/**
 * dsh-plugin-sets — host half.
 *
 * A scene is a named selection of *bundles* (the same rows the official
 * Settings → 插件 page lists). Applying a scene calls
 * `pluginManager.setBundleEnabled(name, enabled)` for every row whose state
 * differs, so this plugin is a shortcut over the official page — never a
 * second source of truth.
 *
 * While a scene is active, `plugin-manager/changed` events are absorbed back
 * into that scene: whatever the user changes on the official page becomes the
 * scene's new definition. Scene and official page therefore stay identical.
 *
 * The same scene also carries a *skill* policy. DSH has no native skill switch,
 * so the host registers a shadow skill provider (rank 0, the lowest) that
 * re-serves every disabled name with `modelInvocable: false, userInvocable:
 * false`. The registry keeps the lowest rank on a duplicate name, so the real
 * provider is overridden and `ctx.skills.get()` returns nothing for it: the
 * skill is unusable by both the model and the /skill command.
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const OWN_BUNDLE = 'dsh-plugin-sets'
const API_PREFIX = '/api/plugin-sets'
const BODY_LIMIT = 256 * 1024
const STATE_VERSION = 3
const SHADOW_PROVIDER = 'dsh-plugin-sets-shadow'
/** Loader rows of this module are the MCP servers this profile runs. */
const MCP_CLIENT = '@deepseek-ai/dsh-mcp-client'
/** Below every packaged provider (600), the runtime rank (250) and the
 *  skills-manager overlay, so a disabled name always wins the merge. */
const SHADOW_RANK = 0

export const inject = ['webServer']

export function apply(ctx) {
  const webServer = ctx.get('webServer')
  if (!webServer) {
    ctx.logger?.warn?.('[plugin-sets] webServer service unavailable; routes not registered')
    return
  }

  const store = createStore(ctx)
  let pending = null
  let syncTimer = null
  /** Live agents, so the skills page can list every layer the user actually sees. */
  const agents = new Map()
  /** SkillProviderControl objects of every shadow provider we registered. */
  const skillControls = new Set()
  /** Disposers of every shadow provider (global layer + one per live agent). */
  const skillDisposers = new Set()
  const agentDisposers = new Map()

  const handle = (req, res) => route(ctx, store, () => pending, (next) => { pending = next }, agents, skillControls, req, res)
  const dispose = webServer.register({ kind: 'prefix', path: API_PREFIX, handler: handle })
  ctx.effect(() => dispose, 'plugin-sets:routes')

  // Shadows are registered synchronously for the global layer and for every live
  // agent, so a disabled skill is masked in the preset layers too.
  const registerShadow = (owner) => {
    const skills = owner && typeof owner.get === 'function' ? owner.get('skills') : null
    if (!skills || typeof skills.registerProvider !== 'function') return () => {}
    try {
      const off = skills.registerProvider(createShadowProvider(store, skillControls))
      if (typeof off === 'function') skillDisposers.add(off)
      return typeof off === 'function' ? off : () => {}
    } catch (error) {
      ctx.logger?.warn?.(`[plugin-sets] cannot register shadow provider: ${error?.message ?? error}`)
      return () => {}
    }
  }
  registerShadow(ctx)
  const registerAgentShadow = (agent) => {
    if (!agent || !agent.id || agentDisposers.has(agent.id)) return
    agentDisposers.set(agent.id, registerShadow(agent.ctx))
  }
  const agentsRegistry = ctx.get('agents')
  if (agentsRegistry && typeof agentsRegistry.list === 'function') {
    for (const agent of agentsRegistry.list()) {
      agents.set(agent.id, agent)
      registerAgentShadow(agent)
    }
  }
  ctx.on('agent/created', ({ agent }) => {
    if (!agent || !agent.id) return
    agents.set(agent.id, agent)
    registerAgentShadow(agent)
  })
  ctx.on('agent/disposed', ({ agent }) => {
    if (!agent || !agent.id) return
    agents.delete(agent.id)
    const off = agentDisposers.get(agent.id)
    agentDisposers.delete(agent.id)
    if (typeof off === 'function') {
      skillDisposers.delete(off)
      off()
    }
  })
  ctx.effect(() => () => {
    for (const off of skillDisposers) {
      try {
        off()
      } catch {
        /* already disposed */
      }
    }
    skillDisposers.clear()
    skillControls.clear()
    agentDisposers.clear()
  }, 'plugin-sets:shadow-providers')

  // Absorb official-page changes into the active scene (debounced: one apply of a
  // scene fires one event per row).
  const scheduleSync = () => {
    if (syncTimer) return
    syncTimer = setTimeout(() => {
      syncTimer = null
      absorb(ctx, store, () => pending).catch((error) => {
        ctx.logger?.warn?.(`[plugin-sets] absorb failed: ${error?.message ?? error}`)
      })
    }, 400)
  }
  ctx.on('plugin-manager/changed', scheduleSync)
  ctx.effect(() => () => {
    if (syncTimer) clearTimeout(syncTimer)
  }, 'plugin-sets:sync-timer')
}

/* ------------------------------------------------------------------ store -- */

function homeDir(ctx) {
  const profileContext = ctx.get('profileContext')
  const dir = profileContext && typeof profileContext.dir === 'string' ? profileContext.dir : ''
  if (dir) {
    const parent = path.dirname(dir)
    return path.basename(parent) === 'profiles' ? path.dirname(parent) : parent
  }
  if (process.env.DSH_HOME) return process.env.DSH_HOME
  return path.join(os.homedir(), '.dsh')
}

function createStore(ctx) {
  const dataDir = path.join(homeDir(ctx), OWN_BUNDLE)
  const statePath = path.join(dataDir, 'scenes.json')
  let chain = Promise.resolve()

  async function read() {
    try {
      const parsed = JSON.parse(await fs.readFile(statePath, 'utf8'))
      return normalize(parsed)
    } catch (error) {
      if (error && error.code === 'ENOENT') return emptyState()
      ctx.logger?.warn?.(`[plugin-sets] cannot read ${statePath}: ${error?.message ?? error}`)
      return emptyState()
    }
  }

  async function write(state) {
    await fs.mkdir(dataDir, { recursive: true })
    const tmp = `${statePath}.${process.pid}.${Date.now()}.tmp`
    await fs.writeFile(tmp, `${JSON.stringify(state, null, 2)}\n`, 'utf8')
    await fs.rename(tmp, statePath)
  }

  return {
    path: statePath,
    read,
    write,
    update(change) {
      const run = () => change()
      const next = chain.then(run, run)
      chain = next.then(() => undefined, () => undefined)
      return next
    },
  }
}

function emptyState() {
  return { version: STATE_VERSION, scenes: [], active: null, lastApplied: null, skills: { disabled: [] } }
}

function cleanDisabled(list) {
  const out = []
  const seen = new Set()
  for (const item of Array.isArray(list) ? list : []) {
    const entry = typeof item === 'string' ? { name: item } : item && typeof item === 'object' ? item : null
    if (!entry) continue
    const name = typeof entry.name === 'string' ? entry.name.trim() : ''
    if (!name || seen.has(name)) continue
    seen.add(name)
    out.push({
      name,
      description: typeof entry.description === 'string' ? entry.description : '',
      whenToUse: typeof entry.whenToUse === 'string' ? entry.whenToUse : null,
      source: typeof entry.source === 'string' ? entry.source : 'custom',
    })
  }
  return out
}

function normalize(raw) {
  const state = emptyState()
  if (!raw || typeof raw !== 'object') return state
  for (const scene of Array.isArray(raw.scenes) ? raw.scenes : []) {
    if (!scene || typeof scene !== 'object') continue
    const name = typeof scene.name === 'string' ? scene.name.trim() : ''
    if (!name) continue
    state.scenes.push({
      id: typeof scene.id === 'string' && scene.id ? scene.id : newId(),
      name,
      bundles: Array.isArray(scene.bundles)
        ? [...new Set(scene.bundles.filter((item) => typeof item === 'string' && item))]
        : [],
      skills: cleanDisabled(scene.skills && scene.skills.disabled ? scene.skills.disabled : scene.skills),
      mcp: Array.isArray(scene.mcp) ? [...new Set(scene.mcp.filter((item) => typeof item === 'string' && item))] : null,
      createdAt: typeof scene.createdAt === 'string' ? scene.createdAt : new Date().toISOString(),
      updatedAt: typeof scene.updatedAt === 'string' ? scene.updatedAt : new Date().toISOString(),
    })
  }
  state.skills = { disabled: cleanDisabled(raw.skills && raw.skills.disabled ? raw.skills.disabled : raw.skills) }
  const active = raw.active
  if (active && typeof active === 'object' && active.baseline && typeof active.baseline === 'object') {
    state.active = {
      sceneId: typeof active.sceneId === 'string' ? active.sceneId : '',
      sceneName: typeof active.sceneName === 'string' ? active.sceneName : '',
      appliedAt: typeof active.appliedAt === 'string' ? active.appliedAt : new Date().toISOString(),
      baseline: cleanMap(active.baseline),
      baselineMcp: active.baselineMcp && typeof active.baselineMcp === 'object' ? cleanMap(active.baselineMcp) : null,
    }
  }
  const last = raw.lastApplied
  if (last && typeof last === 'object' && Array.isArray(last.before)) {
    state.lastApplied = {
      sceneId: typeof last.sceneId === 'string' ? last.sceneId : '',
      sceneName: typeof last.sceneName === 'string' ? last.sceneName : '',
      at: typeof last.at === 'string' ? last.at : new Date().toISOString(),
      before: last.before
        .filter((item) => item && typeof item.name === 'string')
        .map((item) => ({ name: item.name, enabled: item.enabled === true })),
      beforeSkills: cleanDisabled(last.beforeSkills),
      beforeMcp: Array.isArray(last.beforeMcp)
        ? last.beforeMcp
          .filter((item) => item && typeof item.name === 'string')
          .map((item) => ({ name: item.name, enabled: item.enabled === true }))
        : [],
    }
  }
  return state
}

function cleanMap(value) {
  const out = {}
  for (const [key, entry] of Object.entries(value || {})) {
    if (typeof key === 'string' && key) out[key] = entry === true
  }
  return out
}

function newId() {
  return `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`
}

/* ----------------------------------------------------------------- skills -- */

/**
 * A provider whose only job is to occupy the winning rank for a disabled name.
 * `get()` returns `undefined`, so neither the model catalog nor the /skill
 * command can load instructions for it.
 */
function createShadowProvider(store, controls) {
  return (control) => {
    controls.add(control)
    try {
      control.signal?.addEventListener?.('abort', () => controls.delete(control), { once: true })
    } catch {
      /* ignore */
    }
    return {
      name: SHADOW_PROVIDER,
      async list() {
        const state = await store.read()
        return state.skills.disabled.map((entry) => ({
          name: entry.name,
          description: entry.description || '已被「DSH场景设置」停用',
          ...(entry.whenToUse ? { whenToUse: entry.whenToUse } : {}),
          invocation: { modelInvocable: false, userInvocable: false },
          source: entry.source || 'custom',
          provider: SHADOW_PROVIDER,
          rank: SHADOW_RANK,
          locator: { name: entry.name },
        }))
      },
      async get() {
        return undefined
      },
    }
  }
}

function invalidateSkills(controls) {
  for (const control of controls) {
    try {
      control.invalidate?.()
    } catch {
      /* provider already disposed */
    }
  }
}

/** Keep the metadata of a skill that is about to be masked, so the page can
 *  still show its real title/description while it is switched off. */
async function captureDisabled(ctx, agents, names, previous) {
  const wanted = [...new Set(names.filter((name) => typeof name === 'string' && name))]
  if (wanted.length === 0) return []
  const inventory = await skillInventory(ctx, agents)
  const live = new Map(inventory.map((row) => [row.name, row]))
  const old = new Map((previous || []).map((entry) => [entry.name, entry]))
  return wanted.map((name) => {
    const found = live.get(name)
    const before = old.get(name)
    return {
      name,
      description: found?.description || before?.description || '',
      whenToUse: found?.whenToUse || before?.whenToUse || null,
      source: found?.source || before?.source || 'custom',
    }
  })
}

/* ---------------------------------------------------------------- inventory -- */

function pickText(value, lang) {
  if (typeof value === 'string') return value
  if (!value || typeof value !== 'object') return ''
  const short = String(lang || 'zh').split('-')[0]
  return value[lang] || value[short] || value.en || ''
}

function humanize(name) {
  const base = String(name || '').replace(/^@[^/]+\//, '').replace(/^dsh-/, '')
  return base
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function readManager(ctx) {
  const manager = ctx.get('pluginManager')
  if (!manager || typeof manager.listBundles !== 'function' || typeof manager.setBundleEnabled !== 'function') return null
  return manager
}

/** One row per bundle, grouped exactly like the official page groups them. */
async function bundles(ctx, lang) {
  const manager = readManager(ctx)
  if (!manager) return { ok: false, code: 'plugin-manager-unavailable', sections: [] }
  let list
  try {
    list = await manager.listBundles()
  } catch (error) {
    return { ok: false, code: 'plugin-manager-failed', message: String(error?.message ?? error), sections: [] }
  }
  const rows = (Array.isArray(list) ? list : []).map((bundle) => {
    const icon = typeof bundle.meta?.icon === 'string' ? bundle.meta.icon : ''
    const bundleRows = Array.isArray(bundle.rows) ? bundle.rows : []
    return {
      name: bundle.name,
      title: pickText(bundle.meta?.title, lang) || humanize(bundle.name),
      description: pickText(bundle.meta?.description, lang) || String(bundle.description || ''),
      icon: /^(data:|https?:|\/)/.test(icon) ? icon : null,
      version: bundle.version || null,
      enabled: bundle.enabled === true,
      installed: bundle.installed === true,
      official: bundle.official === true,
      availability: bundle.availability || '',
      optional: bundle.optional === true,
      removable: bundle.removable === true,
      readOnlyReason: bundle.readOnlyReason || null,
      error: bundle.error ? String(bundle.error.code || 'error') : null,
      own: bundle.name === OWN_BUNDLE,
      experimental: bundle.official === true && bundle.optional === true && bundle.availability === 'installation',
      profile: bundle.availability === 'profile' && bundle.installed === true,
      // A bundle whose only rows are MCP clients is just a container for the
      // server it runs: the MCP step owns it, so the plugin sections hide it.
      mcpOnly: bundleRows.length > 0 && bundleRows.every((row) => row.moduleName === MCP_CLIENT),
      // `dsh.bundle.listedByDefault` from the bundle's own manifest decides
      // whether the official page lists it before it is installed or enabled.
      listedByDefault: typeof bundle.listedByDefault === 'boolean' ? bundle.listedByDefault : null,
    }
  })

  return { ok: true, bundles: rows }
}

function liveMap(all) {
  const map = {}
  for (const row of all) map[row.name] = row.enabled
  return map
}

function toggleable(row) {
  return !row.own && !row.readOnlyReason && row.availability !== 'missing'
}

/* ---------------------------------------------------------------------- mcp -- */

/**
 * The MCP servers this profile runs are Loader rows of the MCP client module,
 * so a scene toggles them exactly like plugins: one `setPluginEnabled` per row.
 * Names shown to the user come from each row's own server config.
 */
async function mcpInventory(ctx) {
  const manager = readManager(ctx)
  if (!manager) return { ok: false, code: 'plugin-manager-unavailable', rows: [] }
  const all = await manager.listPlugins()
  let entries = []
  const editor = ctx.get('configEditor')
  if (editor && typeof editor.entries === 'function') {
    try {
      entries = editor.entries()
    } catch {
      entries = []
    }
  }
  const byId = new Map(entries.map((entry) => [entry?.options?.id, entry]))
  const rows = all
    .filter((row) => row.moduleName === MCP_CLIENT)
    .map((row) => {
      const entry = row.patchId ? byId.get(row.patchId) : undefined
      const config = (entry && entry.options && entry.options.config) || {}
      const serverName = typeof config.serverName === 'string' ? config.serverName : ''
      const transport = typeof config.transport === 'string' ? config.transport : 'stdio'
      const args = Array.isArray(config.args) ? config.args.map(String) : []
      const detail = transport === 'streamable-http'
        ? String(config.url || '')
        : [config.command, ...args].filter(Boolean).join(' ')
      return {
        entryId: row.entryId,
        patchId: row.patchId || null,
        name: serverName || row.patchId || row.entryId,
        title: serverName || row.patchId || row.entryId,
        description: detail,
        transport,
        enabled: row.enabled === true,
        phase: row.fiberPhase ?? null,
        readOnlyReason: row.readOnlyReason ?? null,
      }
    })
  rows.sort((left, right) => String(left.title).localeCompare(String(right.title)))
  return { ok: true, rows }
}

/* ------------------------------------------------------------------- routes -- */

async function route(ctx, store, getPending, setPending, agents, controls, req, res) {
  const url = new URL(req.url || '/', 'http://localhost')
  const action = url.pathname.slice(API_PREFIX.length).replace(/^\/+|\/+$/g, '')
  const lang = url.searchParams.get('lang') || 'zh'
  const method = (req.method || 'GET').toUpperCase()

  try {
    if (!(await isAllowed(ctx, req))) {
      return send(res, 403, { ok: false, error: { code: 'forbidden', message: 'loopback access only' } })
    }
    if (method === 'GET' && (action === '' || action === 'state')) {
      return send(res, 200, await statePayload(ctx, store, getPending(), lang, agents))
    }
    if (method !== 'POST') {
      return send(res, 405, { ok: false, error: { code: 'method-not-allowed', message: `use POST for ${action}` } })
    }
    if (!isJsonRequest(req)) {
      return send(res, 403, { ok: false, error: { code: 'forbidden', message: 'same-origin JSON requests only' } })
    }

    const body = await readJson(req)

    if (action === 'debug/skillget') return send(res, 200, await debugSkillGet(ctx, body))
    if (action === 'debug/agent') return send(res, 200, await debugAgent(ctx))
    if (action === 'debug/mcp') return send(res, 200, await debugMcp(ctx))
    if (action === 'debug/entries') return send(res, 200, await debugEntries(ctx))
    if (action === 'debug/plugins') return send(res, 200, await debugPlugins(ctx))
    if (action === 'debug/turns') return send(res, 200, await debugTurns(ctx))
    if (action === 'debug/skills') return send(res, 200, await debugSkills(ctx, agents))
    if (action === 'debug/bundle') return send(res, 200, await debugBundle(ctx, body))
    if (action === 'debug/file') return send(res, 200, await debugFile(body))
    if (action === 'debug/ls') return send(res, 200, await debugLs(body))
    if (action === 'debug/graph') return send(res, 200, await debugGraph(ctx))
    if (action === 'scene/save') return send(res, 200, await saveScene(ctx, store, body, agents))
    if (action === 'scene/delete') return send(res, 200, await deleteScene(store, body))
    if (action === 'scene/apply-now') return send(res, 200, await applyNow(ctx, store, body, getPending, setPending, controls, lang, agents))
    if (action === 'apply/prepare') return send(res, 200, await prepareApply(ctx, store, body, setPending, lang, agents))
    if (action === 'apply/step') return send(res, 200, await stepApply(ctx, store, getPending, setPending, controls))
    if (action === 'apply/finish') return send(res, 200, await finishApply(ctx, store, getPending(), setPending, lang))
    if (action === 'apply/abort') return send(res, 200, await abortApply(ctx, store, getPending(), setPending))
    if (action === 'undo') return send(res, 200, await undo(ctx, store, lang, controls, body))

    return send(res, 404, { ok: false, error: { code: 'unknown-action', message: action } })
  } catch (error) {
    ctx.logger?.warn?.(`[plugin-sets] ${action} failed: ${error?.stack ?? error}`)
    return send(res, 500, { ok: false, error: { code: 'internal', message: String(error?.message ?? error) } })
  }
}

/* Temporary inspection helpers: read files served by the shell and return only
   the windows around a pattern, so the caller never sees the raw minified body.
   Loopback-only like every other action. */
async function debugPlugins(ctx) {
  const manager = ctx.get('pluginManager')
  if (!manager || typeof manager.listPlugins !== 'function') return { ok: false, error: { code: 'no-manager', message: 'pluginManager unavailable' } }
  const rows = await manager.listPlugins()
  return {
    ok: true,
    total: rows.length,
    rows: rows.filter((row) => /mcp/i.test(row.moduleName) || /mcp/i.test(row.entryId)).map((row) => ({
      entryId: row.entryId,
      moduleName: row.moduleName,
      title: typeof row.meta?.title === 'string' ? row.meta.title : row.meta?.title && row.meta.title.zh,
      enabled: row.enabled,
      phase: row.fiberPhase,
      readOnlyReason: row.readOnlyReason ?? null,
      patchId: row.patchId ?? null,
      diagnostic: row.diagnostic ?? null,
    })),
  }
}

async function debugTurns(ctx) {
  const sessions = ctx.get('sessions')
  const agents = ctx.get('agents')
  const rows = []
  for (const session of sessions?.list?.() ?? []) {
    let turn = null
    try { turn = agents?.turnBoundaryOf?.(session) ?? null } catch (error) { turn = { error: String(error?.message ?? error) } }
    try { turn = turn === null ? null : JSON.parse(JSON.stringify(turn)) } catch { /* cyclic */ }
    const keys = []
    for (const key in session) keys.push(key)
    rows.push({
      id: session?.id ?? null,
      status: session?.status ?? null,
      running: session?.running ?? null,
      busy: session?.busy ?? null,
      turn,
      keys: keys.slice(0, 40),
    })
  }
  return { ok: true, total: rows.length, rows }
}

async function debugEntries(ctx) {
  const editor = ctx.get('configEditor')
  if (!editor || typeof editor.entries !== 'function') return { ok: false, error: { code: 'no-editor', message: 'configEditor unavailable' } }
  const rows = editor.entries().map((entry) => ({
    id: entry?.options?.id ?? null,
    name: entry?.options?.name ?? null,
    keys: Object.keys((entry?.options?.config ?? {})).slice(0, 24),
    hasServers: !!(entry?.options?.config && typeof entry.options.config.servers === 'object'),
  }))
  return { ok: true, count: rows.length, entries: rows.filter((row) => row.hasServers || /mcp/i.test(String(row.name || '')) || /mcp/i.test(String(row.id || ''))) }
}

async function debugMcp(ctx) {
  const manager = ctx.get('mcpManager')
  const views = manager && typeof manager.list === 'function' ? manager.list() : []
  const editor = ctx.get('configEditor')
  const entry = editor && typeof editor.entries === 'function'
    ? editor.entries().find((row) => row?.options?.config && typeof row.options.config.servers === 'object')
    : undefined
  const servers = entry && entry.options.config.servers ? entry.options.config.servers : {}
  return {
    ok: true,
    entry: entry ? { id: entry.options.id ?? null, name: entry.options.name ?? null } : null,
    views: views.map((view) => ({ name: view.name, configured: view.configured, state: view.status && view.status.state ? view.status.state : String(view.status) })),
    configured: Object.keys(servers).map((name) => ({
      name,
      enabled: servers[name] && servers[name].enabled !== false,
      transport: servers[name] ? servers[name].transport : null,
      command: servers[name] ? servers[name].command || servers[name].url || '' : '',
    })),
  }
}

async function debugAgent(ctx) {
  const registry = ctx.get('agents')
  const list = registry && typeof registry.list === 'function' ? registry.list() : []
  const agent = list[0]
  if (!agent) return { ok: false, error: { code: 'no-agent' } }
  const describe = (value) => {
    if (!value || typeof value !== 'object') return String(value)
    const names = []
    for (const key of Object.getOwnPropertyNames(value)) {
      let type = '?'
      try {
        type = typeof value[key]
      } catch {
        type = 'throws'
      }
      names.push(`${key}:${type}`)
      if (names.length >= 80) break
    }
    return { names, symbols: Object.getOwnPropertySymbols(value).map((sym) => String(sym.description || sym)) }
  }
  return { ok: true, count: list.length, agent: describe(agent), ctx: describe(agent.ctx) }
}

async function debugSkillGet(ctx, body) {
  const name = String(body.name || '')
  const out = []
  const globalSkills = ctx.get('skills')
  if (globalSkills && typeof globalSkills.get === 'function') {
    const skill = await globalSkills.get(name).catch((error) => ({ error: String(error?.message ?? error) }))
    out.push({ source: 'global', found: Boolean(skill && !skill.error), skill: skill ?? null })
  }
  const registry = ctx.get('agents')
  for (const agent of registry && typeof registry.list === 'function' ? registry.list() : []) {
    const service = agent?.ctx?.get?.('skills')
    if (!service || typeof service.get !== 'function') continue
    const skill = await service.get(name, { scope: agent.scope }).catch((error) => ({ error: String(error?.message ?? error) }))
    out.push({ source: agent.id, found: Boolean(skill && !skill.error), provider: skill?.provider ?? null, path: skill?.path ?? null, invocation: skill?.invocation ?? null })
  }
  return { ok: true, name, results: out }
}

async function debugSkills(ctx, agents) {
  const skills = await skillInventory(ctx, agents)
  const registry = ctx.get('agents')
  const live = registry && typeof registry.list === 'function' ? registry.list() : [...agents.values()]
  const perSource = []
  for (const agent of live) {
    const service = agent?.ctx?.get?.('skills')
    if (!service || typeof service.list !== 'function') continue
    let names = []
    try {
      names = (await service.list({ scope: agent.scope })).map((skill) => skill.name)
    } catch (error) {
      names = [`ERROR ${error?.message ?? error}`]
    }
    perSource.push({ id: agent.id, preset: agent.session?.header?.agentPreset ?? null, cwd: agent.session?.header?.cwd ?? null, names })
  }
  return { ok: true, count: skills.length, agents: live.length, perSource, skills }
}

/**
 * Every skill the UI can offer, merged across the global layer and each live
 * agent's own layer chain (a preset-mounted skill only exists in its layer).
 */async function skillInventory(ctx, agents) {
  const sources = []
  const globalSkills = ctx.get('skills')
  if (globalSkills && typeof globalSkills.list === 'function') sources.push({ id: 'global', skills: globalSkills })
  const live = new Map(agents)
  const registry = ctx.get('agents')
  if (registry && typeof registry.list === 'function') {
    for (const agent of registry.list()) if (agent?.id) live.set(agent.id, agent)
  }
  for (const agent of live.values()) {
    const service = agent?.ctx?.get?.('skills')
    if (service && typeof service.list === 'function') sources.push({ id: `agent:${agent.id}`, skills: service, scope: agent.scope })
  }
  const byName = new Map()
  for (const source of sources) {
    let list = []
    try {
      list = await source.skills.list(source.scope ? { scope: source.scope } : {})
    } catch {
      list = []
    }
    for (const skill of Array.isArray(list) ? list : []) {
      const existing = byName.get(skill.name)
      if (existing) {
        existing.scopes.push(source.id)
        continue
      }
      byName.set(skill.name, {
        name: skill.name,
        description: skill.description,
        whenToUse: skill.whenToUse ?? null,
        source: skill.source,
        provider: skill.provider,
        path: skill.path ?? null,
        modelInvocable: skill.invocation?.modelInvocable ?? null,
        userInvocable: skill.invocation?.userInvocable ?? null,
        shadow: skill.provider === SHADOW_PROVIDER,
        scopes: [source.id],
      })
    }
  }
  return [...byName.values()].sort((left, right) => left.name.localeCompare(right.name))
}
async function debugBundle(ctx, body) {
  const modules = ctx.get('clientModules')
  if (!modules) return { ok: false, error: { code: 'no-client-modules' } }
  const id = String(body.id || '')
  const path = modules.clientPath(id)
  if (!path) return { ok: false, error: { code: 'unknown-client', message: id } }
  let text = ''
  try {
    text = await fs.readFile(path, 'utf8')
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
    const response = await modules.fetchBundle(new Request(`http://127.0.0.1${path}`))
    text = await response.text()
  }
  return scanText(text, path, body)
}

async function debugFile(body) {
  const target = String(body.path || '')
  if (!target) return { ok: false, error: { code: 'path-required' } }
  const text = await fs.readFile(target, 'utf8')
  return scanText(text, target, body)
}

async function debugLs(body) {
  const dir = String(body.dir || '')
  if (!dir) return { ok: false, error: { code: 'dir-required' } }
  const entries = await fs.readdir(dir, { withFileTypes: true })
  return {
    ok: true,
    dir,
    entries: entries.map((entry) => ({ name: entry.name, dir: entry.isDirectory() })),
  }
}

function scanText(text, path, body) {
  const result = { ok: true, path, length: text.length, matches: [] }
  if (!body.pattern) return result
  const flags = body.flags || 'g'
  const pattern = new RegExp(String(body.pattern), flags)
  const limit = Number(body.limit) || 12
  const before = Number(body.before) || 160
  const after = Number(body.after) || 520
  let match = pattern.exec(text)
  while (match && result.matches.length < limit) {
    result.matches.push(text.slice(Math.max(0, match.index - before), match.index + match[0].length + after))
    if (pattern.lastIndex === match.index) pattern.lastIndex += 1
    match = pattern.exec(text)
  }
  return result
}

async function debugGraph(ctx) {
  const modules = ctx.get('clientModules')
  if (!modules) return { ok: false, error: { code: 'no-client-modules' } }
  const graph = modules.graph()
  return {
    ok: true,
    entries: graph.entries.map((entry) => ({ id: entry.id, url: entry.url, inject: entry.inject, immediately: entry.immediately })),
  }
}

async function statePayload(ctx, store, pending, lang, agents) {
  const state = await store.read()
  const live = await bundles(ctx, lang)
  const skills = await skillInventory(ctx, agents || new Map())
  const mcp = await mcpInventory(ctx)
  const disabled = new Set(state.skills.disabled.map((entry) => entry.name))
  return {
    ok: true,
    statePath: store.path,
    scenes: state.scenes,
    active: state.active,
    lastApplied: state.lastApplied,
    sections: [],
    skills: {
      disabled: state.skills.disabled.map((entry) => entry.name),
      inventory: skills.map((row) => ({ ...row, disabled: disabled.has(row.name) })),
    },
    mcp: { inventory: mcp.rows || [] },
    // Applying a scene is refused while a chat runs; the page shows these so the
    // buttons can say why before the user clicks them.
    running: runningSessions(ctx),
    bundles: (live.bundles || []).map((row) => ({
      name: row.name,
      title: row.title,
      description: row.description,
      icon: row.icon,
      version: row.version,
      enabled: row.enabled,
      installed: row.installed,
      official: row.official,
      availability: row.availability,
      optional: row.optional,
      removable: row.removable,
      readOnlyReason: row.readOnlyReason,
      error: row.error,
      own: row.own,
      experimental: row.experimental,
      profile: row.profile,
      mcpOnly: row.mcpOnly === true,
      listedByDefault: row.listedByDefault,
    })),
    inventoryError: live.ok ? null : { code: live.code, message: live.message ?? null },
    pending: pending
      ? { sceneId: pending.sceneId, sceneName: pending.sceneName, total: pending.plan.length, done: pending.index }
      : null,
  }
}

async function saveScene(ctx, store, body, agents) {
  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  if (!name) return { ok: false, error: { code: 'invalid-name', message: '场景名称不能为空' } }
  const members = Array.isArray(body?.bundles) ? [...new Set(body.bundles.filter((item) => typeof item === 'string' && item))] : []
  const skillNames = Array.isArray(body?.skills)
    ? [...new Set(body.skills.filter((item) => typeof item === 'string' && item))]
    : []
  const mcpMembers = Array.isArray(body?.mcp)
    ? [...new Set(body.mcp.filter((item) => typeof item === 'string' && item))]
    : null
  const id = typeof body?.id === 'string' && body.id ? body.id : ''
  const previous = (await store.read()).scenes.find((item) => item.id === id)
  const skills = await captureDisabled(ctx, agents, skillNames, previous?.skills)
  return store.update(async () => {
    const state = await store.read()
    const now = new Date().toISOString()
    let savedId = id
    if (id) {
      const scene = state.scenes.find((item) => item.id === id)
      if (!scene) return { ok: false, error: { code: 'unknown-scene', message: '场景不存在' } }
      scene.name = name
      scene.bundles = members
      scene.skills = skills
      scene.mcp = mcpMembers
      scene.updatedAt = now
    } else {
      if (state.scenes.some((item) => item.name === name)) {
        return { ok: false, error: { code: 'duplicate-name', message: '已有同名场景' } }
      }
      savedId = newId()
      state.scenes.push({ id: savedId, name, bundles: members, skills, mcp: mcpMembers, createdAt: now, updatedAt: now })
    }
    await store.write(state)
    return { ok: true, scenes: state.scenes, savedId }
  })
}

async function deleteScene(store, body) {
  const id = typeof body?.id === 'string' ? body.id : ''
  return store.update(async () => {
    const state = await store.read()
    const before = state.scenes.length
    state.scenes = state.scenes.filter((item) => item.id !== id)
    if (state.scenes.length === before) return { ok: false, error: { code: 'unknown-scene', message: '场景不存在' } }
    if (state.active?.sceneId === id) state.active = null
    if (state.lastApplied?.sceneId === id) state.lastApplied = null
    await store.write(state)
    return { ok: true, scenes: state.scenes }
  })
}

async function prepareApply(ctx, store, body, setPending, lang, agents) {
  const manager = readManager(ctx)
  if (!manager) return { ok: false, error: { code: 'plugin-manager-unavailable', message: '插件管理服务不可用' } }
  const busy = runningSessions(ctx)
  if (busy.length > 0) return sessionsBusyError(busy)
  const state = await store.read()
  const scene = state.scenes.find((item) => item.id === body?.id)
  if (!scene) return { ok: false, error: { code: 'unknown-scene', message: '场景不存在' } }
  const live = await bundles(ctx, lang)
  if (!live.ok) return { ok: false, error: { code: live.code, message: live.message ?? null } }

  const target = new Set(scene.bundles)
  const known = new Set(live.bundles.map((row) => row.name))
  const missing = scene.bundles.filter((name) => !known.has(name))

  const plan = []
  for (const row of live.bundles) {
    // MCP-only bundles belong to the MCP step (and must stay exactly as the
    // user leaves them there), so the plugin diff never touches them.
    if (row.mcpOnly) continue
    if (!toggleable(row)) continue
    const shouldEnable = target.has(row.name)
    if (shouldEnable && !row.enabled) plan.push({ kind: 'bundle', name: row.name, title: row.title, to: true, side: 0 })
    if (!shouldEnable && row.enabled) plan.push({ kind: 'bundle', name: row.name, title: row.title, to: false, side: 2 })
  }

  const currentSkills = new Map(state.skills.disabled.map((entry) => [entry.name, entry]))
  const wantedSkills = new Map((scene.skills || []).map((entry) => [entry.name, entry]))
  const disableSkills = [...wantedSkills.values()].filter((entry) => !currentSkills.has(entry.name))
  const enableSkills = [...currentSkills.keys()].filter((name) => !wantedSkills.has(name))
  if (disableSkills.length > 0 || enableSkills.length > 0) {
    plan.push({
      kind: 'skills',
      name: 'skills',
      title: '技能开关',
      side: 3,
      disable: disableSkills,
      enable: enableSkills,
    })
  }

  // MCP servers are Loader rows; `null` on an older scene means "leave alone".
  // They run before a bundle is switched off (side 2), because switching the
  // owning bundle off removes the row this step still has to address.
  const mcp = await mcpInventory(ctx)
  const mcpBefore = []
  if (Array.isArray(scene.mcp)) {
    const wantedMcp = new Set(scene.mcp)
    for (const row of mcp.rows || []) {
      mcpBefore.push({ name: row.entryId, enabled: row.enabled })
      if (row.readOnlyReason) continue
      const shouldEnable = wantedMcp.has(row.entryId)
      if (shouldEnable === row.enabled) continue
      plan.push({ kind: 'mcp', name: row.entryId, title: row.title, to: shouldEnable, side: 1 })
    }
  }
  plan.sort((left, right) => left.side - right.side)

  const before = live.bundles.filter((row) => toggleable(row) && !row.mcpOnly).map((row) => ({ name: row.name, enabled: row.enabled }))

  setPending({
    sceneId: scene.id,
    sceneName: scene.name,
    plan,
    index: 0,
    results: [],
    before,
    beforeSkills: state.skills.disabled,
    beforeMcp: mcpBefore,
    startedAt: new Date().toISOString(),
  })
  return {
    ok: true,
    plan,
    missing,
    total: plan.length,
    scene: { id: scene.id, name: scene.name, bundles: scene.bundles, skills: (scene.skills || []).map((entry) => entry.name) },
  }
}

async function applyOne(manager, change) {
  try {
    const result = change.kind === 'mcp'
      ? await manager.setPluginEnabled(change.name, change.to)
      : await manager.setBundleEnabled(change.name, change.to)
    return {
      kind: change.kind || 'bundle',
      name: change.name,
      title: change.title,
      enabled: change.to,
      changed: result?.changed !== false,
      application: result?.application ?? 'applied',
      restartReason: result?.restartReason ?? null,
      error: result?.error ? { code: result.error.code ?? 'failed', diagnostic: result.error.diagnostic ?? null } : null,
    }
  } catch (error) {
    return {
      kind: change.kind || 'bundle',
      name: change.name,
      title: change.title,
      enabled: change.to,
      changed: false,
      application: 'failed',
      restartReason: null,
      error: { code: 'thrown', diagnostic: String(error?.message ?? error) },
    }
  }
}

async function applySkills(store, change, controls) {
  try {
    const state = await store.read()
    const enableNames = new Set((change.enable || []).map((entry) => entry.name))
    const kept = state.skills.disabled.filter((entry) => !enableNames.has(entry.name))
    const present = new Set(kept.map((entry) => entry.name))
    const added = []
    for (const entry of change.disable || []) {
      if (present.has(entry.name)) continue
      present.add(entry.name)
      added.push({
        name: entry.name,
        description: entry.description || '',
        whenToUse: entry.whenToUse || null,
        source: entry.source || 'custom',
      })
    }
    state.skills = { disabled: [...kept, ...added] }
    await store.write(state)
    invalidateSkills(controls)
    return {
      kind: 'skills',
      name: 'skills',
      title: '技能开关',
      enabled: false,
      changed: true,
      application: 'applied',
      restartReason: null,
      error: null,
      disableCount: added.length,
      enableCount: enableNames.size,
    }
  } catch (error) {
    return {
      kind: 'skills',
      name: 'skills',
      title: '技能开关',
      changed: false,
      application: 'failed',
      restartReason: null,
      error: { code: 'thrown', diagnostic: String(error?.message ?? error) },
    }
  }
}

async function stepApply(ctx, store, getPending, setPending, controls) {
  const pending = getPending()
  if (!pending) return { ok: false, error: { code: 'no-pending', message: '没有进行中的应用' } }
  const manager = readManager(ctx)
  if (!manager) return { ok: false, error: { code: 'plugin-manager-unavailable', message: '插件管理服务不可用' } }
  if (pending.index >= pending.plan.length) {
    return { ok: true, done: true, total: pending.plan.length, doneCount: pending.index, result: null }
  }
  const change = pending.plan[pending.index]
  const result = change.kind === 'skills' ? await applySkills(store, change, controls) : await applyOne(manager, change)
  pending.index += 1
  pending.results.push(result)
  setPending(pending)
  return {
    ok: true,
    done: pending.index >= pending.plan.length,
    total: pending.plan.length,
    doneCount: pending.index,
    current: change.title,
    result,
  }
}

/* One-call apply, used by the composer scene picker: prepare, run every step,
   then finish. Returns the same shape as apply/finish plus the plan. */
async function applyNow(ctx, store, body, getPending, setPending, controls, lang, agents) {
  const prepared = await prepareApply(ctx, store, body, setPending, lang, agents)
  if (!prepared.ok) return prepared
  const total = prepared.total
  for (let guard = 0; guard <= total; guard += 1) {
    const current = getPending()
    if (!current || current.index >= current.plan.length) break
    const step = await stepApply(ctx, store, getPending, setPending, controls)
    if (!step.ok) {
      setPending(null)
      return step
    }
  }
  const pending = getPending()
  if (!pending) return { ok: true, plan: prepared.plan, total, results: [], restartRequired: false }
  const finished = await finishApply(ctx, store, pending, setPending, lang)
  return {
    ...finished,
    plan: prepared.plan,
    total,
    sceneId: pending.sceneId,
    sceneName: pending.sceneName,
    failed: (pending.results || [])
      .filter((item) => item.application === 'failed')
      .map((item) => item.title),
  }
}

async function finishApply(ctx, store, pending, setPending, lang) {
  if (!pending) return { ok: false, error: { code: 'no-pending', message: '没有进行中的应用' } }
  const restartRequired = pending.results.some((item) => item.application === 'restart-required')
  const live = await bundles(ctx, lang)
  const baseline = live.ok ? liveMap(live.bundles) : {}
  const mcp = await mcpInventory(ctx)
  const baselineMcp = Object.fromEntries((mcp.rows || []).map((row) => [row.entryId, row.enabled]))
  const lastApplied = {
    sceneId: pending.sceneId,
    sceneName: pending.sceneName,
    at: pending.startedAt,
    before: pending.before,
    beforeSkills: pending.beforeSkills || [],
    beforeMcp: pending.beforeMcp || [],
  }
  await store.update(async () => {
    const state = await store.read()
    state.lastApplied = lastApplied
    state.active = { sceneId: pending.sceneId, sceneName: pending.sceneName, appliedAt: pending.startedAt, baseline, baselineMcp }
    await store.write(state)
  })
  setPending(null)
  return { ok: true, results: pending.results, restartRequired, lastApplied }
}

async function abortApply(ctx, store, pending, setPending) {
  if (!pending) return { ok: false, error: { code: 'no-pending', message: '没有进行中的应用' } }
  const payload = {
    ok: true,
    results: pending.results,
    aborted: true,
    applied: pending.index,
    total: pending.plan.length,
    restartRequired: pending.results.some((item) => item.application === 'restart-required'),
  }
  if (pending.index > 0) {
    payload.lastApplied = {
      sceneId: pending.sceneId,
      sceneName: pending.sceneName,
      at: pending.startedAt,
      before: pending.before,
      beforeSkills: pending.beforeSkills || [],
      beforeMcp: pending.beforeMcp || [],
    }
    await store.update(async () => {
      const state = await store.read()
      state.lastApplied = payload.lastApplied
      await store.write(state)
    })
  }
  setPending(null)
  return payload
}

async function undo(ctx, store, lang, controls, body) {
  const manager = readManager(ctx)
  if (!manager) return { ok: false, error: { code: 'plugin-manager-unavailable', message: '插件管理服务不可用' } }
  const busy = runningSessions(ctx)
  if (busy.length > 0) return sessionsBusyError(busy)
  const state = await store.read()
  const last = state.lastApplied
  if (!last) return { ok: false, error: { code: 'nothing-to-undo', message: '没有可撤销的应用记录' } }
  const live = await bundles(ctx, lang)
  if (!live.ok) return { ok: false, error: { code: live.code, message: live.message ?? null } }
  const byName = new Map(live.bundles.map((row) => [row.name, row]))
  const results = []
  for (const item of last.before) {
    const row = byName.get(item.name)
    if (!row) {
      results.push({ name: item.name, title: item.name, enabled: item.enabled, changed: false, application: 'skipped', restartReason: null, error: { code: 'missing', diagnostic: '插件已不存在' } })
      continue
    }
    if (!toggleable(row) || row.enabled === item.enabled) continue
    results.push(await applyOne(manager, { name: item.name, title: row.title, to: item.enabled }))
  }
  const mcp = await mcpInventory(ctx)
  const mcpByName = new Map((mcp.rows || []).map((row) => [row.entryId, row]))
  for (const item of last.beforeMcp || []) {
    const row = mcpByName.get(item.name)
    if (!row) {
      results.push({ kind: 'mcp', name: item.name, title: item.name, enabled: item.enabled, changed: false, application: 'skipped', restartReason: null, error: { code: 'missing', diagnostic: 'MCP 服务器已不存在' } })
      continue
    }
    if (row.readOnlyReason || row.enabled === item.enabled) continue
    results.push(await applyOne(manager, { kind: 'mcp', name: item.name, title: row.title, to: item.enabled }))
  }
  await store.update(async () => {
    const current = await store.read()
    current.lastApplied = null
    current.active = null
    current.skills = { disabled: cleanDisabled(last.beforeSkills || []) }
    await store.write(current)
  })
  invalidateSkills(controls)
  return {
    ok: true,
    results,
    restartRequired: results.some((item) => item.application === 'restart-required'),
    sceneName: last.sceneName,
  }
}

/**
 * Keep the active scene identical to the official page: every bundle whose live
 * state moved away from the last recorded baseline is written into the scene.
 */
async function absorb(ctx, store, getPending) {
  if (getPending()) return
  const state = await store.read()
  const active = state.active
  if (!active) return
  const scene = state.scenes.find((item) => item.id === active.sceneId)
  if (!scene) return
  const live = await bundles(ctx)
  if (!live.ok) return
  const now = liveMap(live.bundles)
  const members = new Set(scene.bundles)
  let dirty = false
  for (const row of live.bundles) {
    // MCP-only bundles are tracked by the MCP step, not by scene.bundles.
    if (row.mcpOnly) continue
    if (!toggleable(row)) continue
    if (!(row.name in active.baseline)) {
      // A bundle that appeared after the scene was applied follows the scene only
      // when the user explicitly toggled it; new rows are recorded as-is.
      active.baseline[row.name] = row.enabled
      continue
    }
    if (now[row.name] === active.baseline[row.name]) continue
    if (now[row.name]) members.add(row.name)
    else members.delete(row.name)
    dirty = true
  }
  active.baseline = now
  if (Array.isArray(scene.mcp)) {
    const mcp = await mcpInventory(ctx)
    const base = active.baselineMcp && typeof active.baselineMcp === 'object' ? active.baselineMcp : null
    const rows = mcp.rows || []
    if (!base) {
      active.baselineMcp = Object.fromEntries(rows.map((row) => [row.entryId, row.enabled]))
    } else {
      const next = { ...base }
      const set = new Set(scene.mcp)
      for (const row of rows) {
        if (row.readOnlyReason) continue
        next[row.entryId] = row.enabled
        if (!(row.entryId in base)) continue
        if (row.enabled === base[row.entryId]) continue
        if (row.enabled) set.add(row.entryId)
        else set.delete(row.entryId)
        dirty = true
      }
      active.baselineMcp = next
      scene.mcp = [...set]
    }
  }
  if (dirty) {
    scene.bundles = [...members]
    scene.updatedAt = new Date().toISOString()
  }
  await store.write(state)
}

/* -------------------------------------------------------------------- http -- */

/* A scene swap rewrites the live plugin set, so it must not happen while any
   chat is executing a turn: the running agent would lose tools (or get new
   ones) mid-step. Every apply/undo entry point refuses with this list. */
function runningSessions(ctx) {
  const sessions = ctx.get('sessions')
  const agents = ctx.get('agents')
  if (!sessions || typeof sessions.list !== 'function' || !agents || typeof agents.turnBoundaryOf !== 'function') return []
  const rows = []
  for (const session of sessions.list()) {
    let turn = null
    try { turn = agents.turnBoundaryOf(session) || null } catch { turn = null }
    if (!turn) continue
    const open = turn.openTurnStartSeq
    if (open === null || open === undefined) continue
    const header = session?.header && typeof session.header === 'object' ? session.header : null
    const title = header?.title || header?.name || null
    rows.push({ id: session?.id ?? null, title: typeof title === 'string' && title.trim() ? title.trim() : null })
  }
  return rows
}

function sessionsBusyError(rows) {
  return {
    ok: false,
    error: {
      code: 'sessions-running',
      message: `有 ${rows.length} 个会话正在运行，等它结束后再切换场景`,
      sessions: rows,
    },
  }
}

async function isAllowed(ctx, req) {
  const address = req.socket?.remoteAddress || ''
  const loopback = address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1'
  if (loopback) return true
  const connection = ctx.get('connection')
  if (!connection || typeof connection.requestRejection !== 'function') return false
  try {
    return (await connection.requestRejection(req)) === undefined
  } catch {
    return false
  }
}

function isJsonRequest(req) {
  const origin = req.headers?.origin
  if (origin) {
    try {
      const parsed = new URL(origin)
      const hostname = parsed.hostname
      const local = hostname === '127.0.0.1' || hostname === 'localhost' || hostname === '::1' || hostname === '[::1]'
      if (!local) return false
      const host = String(req.headers?.host || '')
      if (host && parsed.host !== host) return false
    } catch {
      return false
    }
  }
  return String(req.headers?.['content-type'] || '').toLowerCase().startsWith('application/json')
}

async function readJson(req) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > BODY_LIMIT) throw new Error('request body too large')
    chunks.push(chunk)
  }
  if (chunks.length === 0) return {}
  const text = Buffer.concat(chunks).toString('utf8').trim()
  if (!text) return {}
  return JSON.parse(text)
}

function send(res, status, payload) {
  const body = JSON.stringify(payload)
  res.statusCode = status
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.setHeader('cache-control', 'no-store')
  res.end(body)
}
