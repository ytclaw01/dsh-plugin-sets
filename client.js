window.__ModuleLoader__.load({
  id: 'dsh-plugin-sets',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const { useState, useEffect, useRef, useCallback, useMemo } = React

    const API = '/api/plugin-sets'
    const ACCENT = 'var(--dsw-alias-accent, #4d6bfe)'
    const BORDER = 'var(--dsw-alias-border-subtle, rgba(127,127,127,.28))'
    const BORDER_STRONG = 'var(--dsw-alias-border-l2, rgba(127,127,127,.45))'
    const SURFACE = 'var(--dsw-alias-bg-layer-1, rgba(127,127,127,.08))'
    const SURFACE_2 = 'var(--dsw-alias-bg-layer-2, rgba(127,127,127,.14))'
    const TEXT_1 = 'var(--dsw-alias-label-primary, inherit)'
    const TEXT_2 = 'var(--dsw-alias-label-secondary, rgba(127,127,127,.92))'
    const MUTED = 'var(--dsw-alias-label-tertiary, rgba(127,127,127,.8))'
    const DANGER = 'var(--dsw-alias-state-error-primary, #e5534b)'
    const SUCCESS = 'var(--dsw-alias-state-success-primary, #2ea043)'

    const COPY = {
      zh: {
        title: 'DSH场景设置',
        subtitle: '像快捷方式一样切换官方「插件」页里的插件，并同时决定哪些技能可用。被激活的场景会一直跟着官方页走。',
        stepPlugins: '场景设置',
        stepMcp: '2 MCP',
        stepSkills: '3 技能',
        mcpTitle: 'MCP 服务器',
        mcpHint: '关闭后该服务器提供的工具不可用',
        mcpEmpty: '当前没有 MCP 服务器。',
        mcpCount: (on, total) => `${on} / ${total} 启用`,
        ctxCopy: '复制场景',
        ctxEdit: '修改',
        edit: '修改',
        reloaded: '已重新载入，可以修改',
        ctxRename: '重命名',
        ctxApply: '应用场景',
        renameTitle: '重命名场景',
        renameEmpty: '名称不能为空',
        dupSuffix: ' 副本',
        skillsTitle: '技能',
        skillsHint: '关闭后模型和 /skill 都无法使用该技能',
        skillsEmpty: '当前没有可切换的技能。',
        skillNote: '已启用',
        skillDisabled: '已关闭',
        skillCount: (on, total) => `${on} / ${total} 可用`,
        skillsPlan: (off, on) => `技能：关闭 ${off} 个，启用 ${on} 个`,
        chipScene: (name) => `场景：${name}`,
        chipNone: '还没有场景',
        chipPick: '选择场景',
        chipBusy: '正在应用…',
        chipApplied: (name) => `已切换到「${name}」`,
        chipRestart: '已切换，需要重启 DSH 才能完全生效',
        chipFailed: '应用失败',
        chipEmpty: '还没有场景：到「设置 → DSH场景设置」新建。',
        sessionsBusy: (names) => names
          ? `有会话正在运行（${names}），等它结束后再切换场景，免得打断当前的回答`
          : '有会话正在运行，等它结束后再切换场景，免得打断当前的回答',
        sessionsBusyShort: '有会话在运行，稍后再试',
        refresh: '刷新',
        newScene: '新建场景',
        addScene: '添加场景',
        sceneName: '场景名称',
        unsaved: '未保存',
        saved: '已保存',
        save: '保存',
        exclusive: '排他：未勾选的插件一律停用',
        enableAll: '全部启用',
        disableAll: '全部禁用',
        apply: '应用场景',
        undo: '撤销上次应用',
        remove: '删除场景',
        active: '使用中',
        synced: '已与官方页同步',
        builtinConfig: '内置插件配置',
        experimental: '实验性插件',
        installed: '已安装插件',
        configHint: '配置入口，点击官方「插件」页里的同名项进入',
        more: '更多',
        back: '返回',
        confirmTitle: '应用场景',
        confirmBody: '将按下列改动同步到官方「插件」页：',
        noChanges: '当前已经和该场景一致，无需改动。',
        proceed: '开始应用',
        cancel: '取消',
        applying: '正在应用…',
        restartTitle: '有改动需要重启 DSH',
        restartBody: '继续应用剩余改动，还是先停在这里？',
        continueApply: '继续应用',
        stopHere: '停在这里',
        restartBanner: '部分改动需要重启 DSH 才会生效：关闭 DSH 后重新打开即可。',
        resultsTitle: '本次改动',
        applied: '已应用',
        failed: '失败',
        skipped: '已跳过',
        empty: '还没有场景。点下面的「添加场景」开始。',
        emptyHint: '新建一个场景，勾选要启用的插件，然后保存。',
        noSelection: '选择左侧的一个场景，或新建一个。',
        count: (on, total) => `${on} / ${total} 启用`,
        toEnable: '启用',
        toDisable: '停用',
        savedToast: '已保存',
        deletedToast: '已删除',
        undoToast: '已撤销上次应用',
        refreshHint: '官方「插件」页需刷新一次才能看到本次改动。',
        lang: 'EN',
        loadFailed: '读取失败',
        retry: '重试',
      },
      en: {
        title: 'DSH scene settings',
        subtitle: 'Switch the plugins on the official Plugins page like shortcuts and decide which skills stay usable. An active scene keeps following that page.',
        stepPlugins: 'Scene settings',
        stepMcp: 'MCP',
        stepSkills: 'Skills',
        mcpTitle: 'MCP servers',
        mcpHint: 'A disabled server exposes no tools',
        mcpEmpty: 'No MCP servers right now.',
        mcpCount: (on, total) => `${on} / ${total} enabled`,
        ctxCopy: 'Duplicate scene',
        ctxEdit: 'Edit',
        edit: 'Edit',
        reloaded: 'Reloaded for editing',
        ctxRename: 'Rename',
        ctxApply: 'Apply scene',
        renameTitle: 'Rename scene',
        renameEmpty: 'A name is required',
        dupSuffix: ' copy',
        skillsTitle: 'Skills',
        skillsHint: 'A disabled skill is unusable by both the model and /skill',
        skillsEmpty: 'No switchable skills right now.',
        skillNote: 'enabled',
        skillDisabled: 'disabled',
        skillCount: (on, total) => `${on} / ${total} usable`,
        skillsPlan: (off, on) => `Skills: ${off} off, ${on} on`,
        chipScene: (name) => `Scene: ${name}`,
        chipNone: 'No scenes yet',
        chipPick: 'Choose a scene',
        chipBusy: 'Applying…',
        chipApplied: (name) => `Switched to “${name}”`,
        chipRestart: 'Switched; restart DSH to finish applying',
        chipFailed: 'Apply failed',
        chipEmpty: 'No scenes yet: create one in Settings → DSH scene settings.',
        sessionsBusy: (names) => names
          ? `A chat is running (${names}). Switch scenes once it finishes so the answer is not interrupted.`
          : 'A chat is running. Switch scenes once it finishes so the answer is not interrupted.',
        sessionsBusyShort: 'A chat is running, try again later',
        refresh: 'Refresh',
        newScene: 'New scene',
        addScene: 'Add scene',
        sceneName: 'Scene name',
        unsaved: 'Unsaved',
        saved: 'Saved',
        save: 'Save',
        exclusive: 'Exclusive: disable every unchecked plugin',
        enableAll: 'Enable all',
        disableAll: 'Disable all',
        apply: 'Apply scene',
        undo: 'Undo last apply',
        remove: 'Delete scene',
        active: 'Active',
        synced: 'In sync with the official page',
        builtinConfig: 'Built-in plugin configuration',
        experimental: 'Experimental plugins',
        installed: 'Installed plugins',
        configHint: 'Configuration entry — open the same item on the official Plugins page',
        more: 'More',
        back: 'Back',
        confirmTitle: 'Apply scene',
        confirmBody: 'These changes will be applied to the official Plugins page:',
        noChanges: 'The official page already matches this scene.',
        proceed: 'Apply now',
        cancel: 'Cancel',
        applying: 'Applying…',
        restartTitle: 'Some changes need a DSH restart',
        restartBody: 'Continue with the remaining changes, or stop here?',
        continueApply: 'Continue',
        stopHere: 'Stop here',
        restartBanner: 'Some changes take effect after a DSH restart: quit DSH and open it again.',
        resultsTitle: 'Changes',
        applied: 'applied',
        failed: 'failed',
        skipped: 'skipped',
        empty: 'No scenes yet. Use “Add scene” below to start.',
        emptyHint: 'Create a scene, tick the plugins you want, then save.',
        noSelection: 'Pick a scene on the left, or create a new one.',
        count: (on, total) => `${on} / ${total} enabled`,
        toEnable: 'enable',
        toDisable: 'disable',
        savedToast: 'Saved',
        deletedToast: 'Deleted',
        undoToast: 'Last apply undone',
        refreshHint: 'Refresh the official Plugins page once to see these changes.',
        lang: '中文',
        loadFailed: 'Failed to load',
        retry: 'Retry',
      },
    }

    const api = async (action, body) => {
      const lang = langOf()
      const query = action || 'state'
      const res = await fetch(`${API}/${query}?lang=${lang}`, body === undefined
        ? { headers: { accept: 'application/json' } }
        : { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
      const json = await res.json().catch(() => ({ ok: false, error: { code: 'bad-response', message: `HTTP ${res.status}` } }))
      if (!json.ok) throw Object.assign(new Error(json.error?.message || json.error?.code || 'request failed'), { payload: json.error })
      return json
    }

    // A scene swap is refused while a chat is running: show that refusal as the
    // shared notice (with the chat titles) instead of a raw error string.
    const errorText = (error) => {
      const payload = error && error.payload
      const copy = COPY[langOf()]
      if (payload && payload.code === 'sessions-running') {
        const names = (payload.sessions || []).map((entry) => entry.title || '').filter(Boolean)
        return copy.sessionsBusy(names.length > 0 ? names.join('、') : '')
      }
      return (error && error.message) || copy.chipFailed
    }

    let currentLang = 'zh'
    let localeService = null
    let appContext = null
    const langOf = () => currentLang

    // Follow the app language (the same one the official Plugins page renders in).
    // The service is looked up lazily because `apply` can run before it exists.
    const localeOf = () => {
      if (localeService) return localeService
      try {
        if (appContext && typeof appContext.get === 'function') localeService = appContext.get('locale') || null
      } catch {
        localeService = null
      }
      return localeService
    }

    const readLang = () => {
      let tag = ''
      try {
        const locale = localeOf()
        const snapshot = locale && typeof locale.getSnapshot === 'function' ? locale.getSnapshot() : null
        if (snapshot && typeof snapshot.active === 'string') tag = snapshot.active
      } catch {
        tag = ''
      }
      if (!tag) tag = (typeof navigator !== 'undefined' && navigator.language) || 'zh'
      return String(tag).toLowerCase().startsWith('zh') ? 'zh' : 'en'
    }

    // Components render in the app language and re-render when it changes.
    function useLangState() {
      const [lang, setLang] = useState(readLang)
      useEffect(() => {
        const service = localeOf()
        if (!service || typeof service.subscribe !== 'function') return undefined
        return service.subscribe(() => setLang(readLang()))
      }, [])
      return lang
    }

    const sameSet = (left, right) => {
      if (left.length !== right.length) return false
      const set = new Set(left)
      return right.every((item) => set.has(item))
    }

    const sceneDraft = (scene) => ({
      id: scene ? scene.id : '',
      name: scene ? scene.name : '',
      bundles: scene ? [...scene.bundles] : [],
      skills: scene ? (scene.skills || []).map((entry) => entry.name) : [],
      mcp: scene && Array.isArray(scene.mcp) ? [...scene.mcp] : null,
    })

    const sceneSkills = (scene) => (scene && scene.skills ? scene.skills : []).map((entry) => entry.name)

    const draftMatches = (draft, scene) => !!draft
      && draft.id === scene.id
      && draft.name === scene.name
      && sameSet(draft.bundles, scene.bundles)
      && sameSet(draft.skills || [], sceneSkills(scene))
      && (Array.isArray(scene.mcp) ? sameSet(draft.mcp || [], scene.mcp) : true)

    /* The official Plugins page groups and orders bundles with these lists.
       They are copied verbatim so this page lists exactly the same plugins in
       exactly the same order. */
    const HIDDEN_BUNDLES = new Set([
      '@deepseek-ai/dsh-base',
      '@deepseek-ai/dsh-web-app',
      '@deepseek-ai/dsh-headless',
      '@deepseek-ai/dsh-sdk-app',
      '@deepseek-ai/dsh-acp-app',
      '@deepseek-ai/dsh-sdk-minimal',
      '@deepseek-ai/dsh-experimental-terminal-bundle',
      '@deepseek-ai/dsh-experimental-tool-worktree',
    ])
    const EXTENSION_BUNDLES = [
      '@deepseek-ai/dsh-experimental-voice-input-bundle',
      '@deepseek-ai/dsh-experimental-plugin-market-bundle',
      '@deepseek-ai/dsh-experimental-auto-review',
    ]
    const MORE_BUNDLES = [
      '@deepseek-ai/dsh-personalized-recommendations',
      '@deepseek-ai/dsh-experimental-inspector-profile',
      '@deepseek-ai/dsh-cua-bundle',
      '@deepseek-ai/dsh-experimental-cot-translation-bundle',
      '@deepseek-ai/dsh-experimental-session-search',
      '@deepseek-ai/dsh-experimental-session-titles-bundle',
      '@deepseek-ai/dsh-experimental-badge-skill-bundle',
      '@deepseek-ai/dsh-experimental-ralph-bundle',
      '@deepseek-ai/dsh-deepseek-chat-import',
      '@deepseek-ai/dsh-subagent-codex',
      '@deepseek-ai/dsh-subagent-claude-code',
    ]

    const pinnedToMainList = (row) => !MORE_BUNDLES.includes(row.name) || row.enabled
    const optionalBundleRank = (name) => {
      const ranked = EXTENSION_BUNDLES.indexOf(name)
      if (ranked >= 0) return ranked
      const heldBack = MORE_BUNDLES.indexOf(name)
      return heldBack < 0 ? EXTENSION_BUNDLES.length : EXTENSION_BUNDLES.length + 1 + heldBack
    }
    const byOptionalRank = (left, right) => optionalBundleRank(left.name) - optionalBundleRank(right.name)

    // The official installed list orders by this stripped name, so the same
    // comparator keeps our list identical to the page we mirror.
    const shortName = (name) => {
      const text = String(name || '')
      const base = text.startsWith('@') ? text.slice(text.indexOf('/') + 1) : text
      return base.replace(/^dsh-(?:host-|client-)?/, '')
    }
    const byShortName = (left, right) => shortName(left.name).localeCompare(shortName(right.name))

    // Titles and descriptions of the four official config entries. The entries
    // themselves are read from the `plugins.item` slot so they follow whatever
    // the running build registers.
    const CONFIG_ROWS = {
      subagent: {
        zh: ['子智能体', '设置子智能体的递归层级、数量和模型。'],
        en: ['Subagent', 'Set Subagent recursion depth, count, and models.'],
      },
      'web-search': {
        zh: ['网页搜索与获取', '选择网页搜索与网页获取使用的提供方。'],
        en: ['Web search and fetch', 'Choose the providers web search and web fetch use.'],
      },
      'agent-loop': {
        zh: ['Agent 循环', '控制 Agent 派发工具调用的方式。'],
        en: ['Agent loop', 'Control how the Agent dispatches tool calls.'],
      },
      shell: {
        zh: ['终端', '限制每条命令最多能跑多久、最多输出多少内容。'],
        en: ['Shell', 'Limit how long each command may run and how much it may output.'],
      },
    }
    const CONFIG_ORDER = ['subagent', 'web-search', 'agent-loop', 'shell']

    function IconTile({ row }) {
      const letter = (row.title || row.name || '?').trim().charAt(0).toUpperCase()
      return h('div', {
        'aria-hidden': 'true',
        style: {
          width: 34, height: 34, flex: '0 0 auto', borderRadius: 9,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: SURFACE_2, color: TEXT_2, fontWeight: 600, fontSize: 14,
          border: `.5px solid ${BORDER}`,
        },
      }, letter)
    }

    function Switch({ checked, disabled, onChange, label }) {
      return h('button', {
        type: 'button',
        role: 'switch',
        'aria-checked': checked ? 'true' : 'false',
        'aria-label': label,
        disabled: !!disabled,
        onClick: () => { if (!disabled) onChange(!checked) },
        style: {
          width: 40, height: 22, flex: '0 0 auto', borderRadius: 999, position: 'relative',
          border: 'none', padding: 0, cursor: disabled ? 'default' : 'pointer',
          background: checked ? ACCENT : SURFACE_2,
          opacity: disabled ? 0.45 : 1,
          transition: 'background .15s ease',
        },
      },
      h('span', {
        style: {
          position: 'absolute', top: 2, left: checked ? 20 : 2, width: 18, height: 18,
          borderRadius: '50%', background: '#fff', transition: 'left .15s ease',
          boxShadow: '0 1px 2px rgba(0,0,0,.35)',
        },
      }))
    }

    function Button({ children, onClick, variant = 'default', disabled, size = 'md', title, ...rest }) {
      const base = {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        height: size === 'sm' ? 28 : 34, padding: size === 'sm' ? '0 10px' : '0 14px',
        borderRadius: 8, cursor: disabled ? 'default' : 'pointer', font: 'inherit',
        fontSize: 13, lineHeight: '20px', whiteSpace: 'nowrap',
        opacity: disabled ? 0.5 : 1, border: `.5px solid ${BORDER}`,
        background: SURFACE, color: TEXT_1,
      }
      if (variant === 'primary') {
        base.background = ACCENT
        base.color = '#fff'
        base.border = `.5px solid ${ACCENT}`
        base.fontWeight = 600
      }
      if (variant === 'danger') {
        base.color = DANGER
      }
      if (variant === 'ghost') {
        base.background = 'transparent'
      }
      return h('button', { type: 'button', onClick, disabled, title, style: base, ...rest }, children)
    }

    function Dot() {
      return h('span', {
        'aria-hidden': 'true',
        style: { width: 5, height: 5, borderRadius: '50%', background: SUCCESS, margin: '0 6px 0 2px', display: 'inline-block' },
      })
    }

    function Modal({ title, children, onClose, footer }) {
      const dialogRef = useRef(null)
      useEffect(() => {
        const node = dialogRef.current
        if (node && typeof node.focus === 'function') node.focus()
        const onKey = (event) => {
          if (event.key === 'Escape') {
            event.stopPropagation()
            onClose()
          }
        }
        window.addEventListener('keydown', onKey, true)
        return () => window.removeEventListener('keydown', onKey, true)
      }, [onClose])
      return h('div', {
        style: {
          position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center',
          justifyContent: 'center', background: 'rgba(0,0,0,.42)', padding: 24,
        },
        onMouseDown: (event) => { if (event.target === event.currentTarget) onClose() },
      },
      h('div', {
        ref: dialogRef,
        tabIndex: -1,
        role: 'dialog',
        'aria-modal': 'true',
        'aria-label': title,
        style: {
          width: 'min(560px, 100%)', maxHeight: 'min(76vh, 720px)', display: 'flex', flexDirection: 'column',
          background: 'var(--dsw-alias-bg-elevated, #17181b)', color: TEXT_1,
          border: `.5px solid ${BORDER_STRONG}`, borderRadius: 14, overflow: 'hidden',
          boxShadow: '0 18px 50px rgba(0,0,0,.45)', outline: 'none',
        },
      },
      h('div', { style: { padding: '16px 18px 10px', fontWeight: 600, fontSize: 15 } }, title),
      h('div', { style: { padding: '0 18px', overflow: 'auto', flex: 1, fontSize: 13, color: TEXT_2 } }, children),
      h('div', {
        style: {
          padding: '14px 18px 16px', display: 'flex', justifyContent: 'flex-end', gap: 8,
          borderTop: `.5px solid ${BORDER}`, marginTop: 12,
        },
      }, footer)))
    }

    function Section({ title, hint, action, children }) {
      return h('section', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0 2px', minHeight: 28 } },
          h('h3', { style: { margin: 0, fontSize: 13, fontWeight: 600, color: TEXT_2, flex: '1 1 auto', minWidth: 0 } }, title),
          hint ? h('span', { style: { fontSize: 12, color: MUTED } }, hint) : null,
          action || null),
        h('div', { style: { display: 'flex', flexDirection: 'column' } }, children))
    }

    function Row({ row, checked, disabled, onToggle, note, noSwitch, switchHint }) {
      return h('div', {
        style: {
          display: 'flex', alignItems: 'center', gap: 12, padding: '10px 4px',
          borderBottom: `.5px solid ${BORDER}`,
        },
      },
      h(IconTile, { row }),
      h('div', { style: { flex: 1, minWidth: 0 } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: TEXT_1 } },
          h('span', { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, row.title || row.name),
          note ? h('span', { style: { fontSize: 11, color: MUTED, fontWeight: 400 } }, note) : null),
        row.description
          ? h('div', {
            style: {
              fontSize: 12, color: MUTED, marginTop: 2, overflow: 'hidden',
              textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            },
          }, row.description)
          : null),
      noSwitch
        ? h('span', { style: { fontSize: 11, color: MUTED, flex: '0 0 auto' } }, switchHint || '')
        : h(Switch, { checked, disabled, onChange: onToggle, label: row.title || row.name }))
    }

    function SceneCard({ scene, active, count, selected, onSelect, onContext }) {
      return h('button', {
        type: 'button',
        onClick: onSelect,
        onContextMenu: (event) => { event.preventDefault(); onContext(event) },
        'aria-pressed': selected ? 'true' : 'false',
        style: {
          textAlign: 'left', font: 'inherit', cursor: 'pointer', minHeight: 76,
          padding: '12px 14px', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 4,
          background: selected ? SURFACE_2 : SURFACE,
          border: selected ? `.5px solid ${ACCENT}` : `.5px solid ${BORDER}`,
          color: TEXT_1,
        },
      },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 } },
        h('span', { style: { fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, scene.name),
        active ? h('span', {
          style: {
            fontSize: 10, padding: '1px 6px', borderRadius: 999, border: `.5px solid ${ACCENT}`,
            color: ACCENT, flex: '0 0 auto',
          },
        }, scene.activeLabel) : null),
      h('div', { style: { fontSize: 12, color: MUTED } }, count))
    }

    function MenuItem({ onClick, children }) {
      return h('button', {
        type: 'button',
        onClick,
        role: 'menuitem',
        style: {
          textAlign: 'left', font: 'inherit', fontSize: 13, color: TEXT_1, cursor: 'pointer',
          padding: '7px 10px', borderRadius: 7, background: 'transparent', border: 'none',
        },
        onMouseEnter: (event) => { event.currentTarget.style.background = SURFACE },
        onMouseLeave: (event) => { event.currentTarget.style.background = 'transparent' },
      }, children)
    }

    function AddTile({ label, onClick, disabled }) {
      return h('button', {
        type: 'button', onClick, disabled,
        style: {
          minHeight: 76, padding: '12px 14px', borderRadius: 12, cursor: disabled ? 'default' : 'pointer',
          font: 'inherit', fontSize: 13, color: MUTED, background: 'transparent',
          border: `.5px dashed ${BORDER_STRONG}`, display: 'flex', alignItems: 'center', gap: 8,
        },
      }, h('span', { style: { fontSize: 15, lineHeight: 1 } }, '+'), label)
    }

    function Page() {
      const [lang, setLang] = useState(readLang)
      currentLang = lang
      const T = COPY[lang] || COPY.zh

      useEffect(() => {
        const locale = localeService
        if (!locale || typeof locale.subscribe !== 'function') return undefined
        return locale.subscribe(() => setLang(readLang()))
      }, [])

      const [data, setData] = useState(null)
      const [loadError, setLoadError] = useState(null)
      const [loading, setLoading] = useState(true)
      const [selectedId, setSelectedId] = useState('')
      const [draft, setDraft] = useState(null)
      const [note, setNote] = useState(null)
      const [dialog, setDialog] = useState(null)
      const [pause, setPause] = useState(null)
      const [busy, setBusy] = useState(false)
      const [results, setResults] = useState(null)
      const [moreView, setMoreView] = useState(false)
      const [step, setStep] = useState('plugins')
      const [menu, setMenu] = useState(null)
      const [renaming, setRenaming] = useState(null)

      const busyRef = useRef(false)
      const cancelRef = useRef(false)
      const restartOkRef = useRef(false)
      const dialogRef = useRef(null)
      dialogRef.current = dialog
      busyRef.current = busy

      // Which scene id the draft was loaded from. Unsaved edits survive the 2.6 s
      // state poll because only a CHANGE of selection reloads the draft.
      const loadedSceneRef = useRef('')

      const tRef = useRef(T)
      tRef.current = T

      const load = useCallback(async (silent) => {
        if (!silent) setLoading(true)
        try {
          const json = await api('state')
          setData(json)
          setLoadError(null)
          return json
        } catch (error) {
          if (!silent) setLoadError(error.message || tRef.current.loadFailed)
          return null
        } finally {
          if (!silent) setLoading(false)
        }
      }, [])

      useEffect(() => {
        let alive = true
        load(false).then((json) => {
          if (!alive || !json) return
          const first = json.scenes[0]
          const activeId = json.active && json.active.sceneId
          const startId = activeId || (first ? first.id : '')
          if (startId) {
            setSelectedId(startId)
            const scene = json.scenes.find((item) => item.id === startId)
            loadedSceneRef.current = startId
            setDraft(sceneDraft(scene))
          }
        })
        return () => { alive = false }
      }, [load])

      // The official page language changed: refetch so titles/descriptions follow it.
      useEffect(() => {
        if (!data) return
        load(true)
      }, [lang])

      // Live sync: keep the list identical to the official page without a click.
      // The draft is deliberately NOT touched here — an unsaved edit (a toggle the
      // user just flipped) must survive until they save or switch scene.
      useEffect(() => {
        const timer = window.setInterval(() => {
          if (busyRef.current || dialogRef.current) return
          load(true)
        }, 2600)
        return () => window.clearInterval(timer)
      }, [load])

      // Load a scene's draft when the selection changes (click, 修改, 复制场景).
      // A poll only refreshes `data`, so it can never overwrite the draft.
      useEffect(() => {
        if (!selectedId || !data) return
        if (loadedSceneRef.current === selectedId) return
        const scene = data.scenes.find((item) => item.id === selectedId)
        if (!scene) return
        loadedSceneRef.current = selectedId
        setDraft(sceneDraft(scene))
      }, [selectedId, data])

      // Opening the MCP or skills step re-reads the live registry first: the list
      // depends on which plugins are enabled right now.
      useEffect(() => {
        if (step === 'plugins' || busyRef.current) return
        load(true)
      }, [step, load])

      const scenes = data ? data.scenes : []
      const live = useMemo(() => (data && data.bundles) || [], [data])
      const bundlesByName = useMemo(() => {
        const map = new Map()
        for (const row of live) map.set(row.name, row)
        return map
      }, [live])

      const selectedScene = scenes.find((item) => item.id === selectedId) || null

      // Mirror of the official page's listing rules: same filters, same order.
      const listed = useMemo(() => live.filter((row) => !row.mcpOnly && !HIDDEN_BUNDLES.has(row.name)
        && (row.listedByDefault !== false || row.enabled || row.installed)
        && (row.installed || row.official || row.error !== undefined)), [live])
      const officialRows = useMemo(() => listed.filter((row) => row.official), [listed])
      const orderedRows = useMemo(() => [...officialRows].sort(byOptionalRank), [officialRows])
      const pinnedNames = useMemo(() => new Set(officialRows.filter(pinnedToMainList).map((row) => row.name)), [officialRows])
      const extensionRows = useMemo(() => orderedRows.filter((row) => pinnedNames.has(row.name)), [orderedRows, pinnedNames])
      const moreRows = orderedRows
      const installedRows = useMemo(() => listed.filter((row) => !row.official).sort(byShortName), [listed])

      // 「内置插件配置」 lists the config entries the running build registers.
      const configRows = useMemo(() => {
        const entryRows = []
        try {
          const slots = appContext && typeof appContext.get === 'function' ? appContext.get('slots') : null
          const entries = slots && typeof slots.entries === 'function' ? slots.entries('plugins.item') || [] : []
          for (const entry of entries) {
            const options = (entry && entry.options) || {}
            const id = typeof options.id === 'string' ? options.id : ''
            if (!id) continue
            let title = ''
            try {
              title = typeof options.label === 'function' ? options.label() : String(options.label || '')
            } catch {
              title = ''
            }
            entryRows.push({ key: `config:${id}`, id, title, order: typeof options.order === 'number' ? options.order : 0 })
          }
        } catch {
          entryRows.length = 0
        }
        entryRows.sort((left, right) => left.order - right.order)
        const ids = entryRows.length ? entryRows.map((row) => row.id) : CONFIG_ORDER
        return ids.map((id) => {
          const copyRow = CONFIG_ROWS[id]
          const found = entryRows.find((row) => row.id === id)
          const title = (found && found.title) || (copyRow ? (lang === 'en' ? copyRow.en[0] : copyRow.zh[0]) : id)
          const description = copyRow ? (lang === 'en' ? copyRow.en[1] : copyRow.zh[1]) : ''
          return { key: `config:${id}`, id, title, description }
        })
      }, [lang])

      const canToggleRow = (row) => !!row && !row.own && !row.readOnlyReason && row.availability !== 'missing'

      // Every row that carries a switch here — 实验性插件 + 已安装插件.
      const switchable = useMemo(() => [...extensionRows, ...installedRows].filter(canToggleRow).map((row) => row.name), [extensionRows, installedRows])

      const installedToggleable = useMemo(() => installedRows.filter(canToggleRow).map((row) => row.name), [installedRows])

      const countOf = (scene) => {
        const bundles = (scene && scene.bundles) || []
        const on = switchable.filter((name) => bundles.includes(name)).length
        let base = T.count(on, switchable.length)
        const totalSkills = data && data.skills && data.skills.inventory ? data.skills.inventory.length : 0
        const offSkills = scene && scene.skills ? scene.skills.length : 0
        if (totalSkills && offSkills) base = `${base} · ${T.skillCount(totalSkills - offSkills, totalSkills)}`
        if (scene && Array.isArray(scene.mcp) && mcpInventory.length) {
          base = `${base} · MCP ${scene.mcp.filter((id) => mcpInventory.some((row) => row.entryId === id)).length}`
        }
        return base
      }

      const choose = (scene) => {
        loadedSceneRef.current = scene ? scene.id : ''
        setSelectedId(scene ? scene.id : '')
        setDraft(sceneDraft(scene))
        setStep('plugins')
        setNote(null)
        setResults(null)
        setMenu(null)
      }

      const newScene = () => {
        const liveMcp = mcpInventory.filter((row) => row.enabled && !row.readOnlyReason).map((row) => row.entryId)
        loadedSceneRef.current = ''
        setSelectedId('')
        setDraft({ id: '', name: '', bundles: [], skills: [], mcp: liveMcp })
        setStep('plugins')
        setNote(null)
        setResults(null)
        setMenu(null)
      }

      const toggleBundle = (name) => {
        setDraft((current) => {
          if (!current) return current
          const has = current.bundles.includes(name)
          return { ...current, bundles: has ? current.bundles.filter((item) => item !== name) : [...current.bundles, name] }
        })
      }

      const setAllInstalled = (on) => {
        setDraft((current) => {
          if (!current) return current
          const rest = current.bundles.filter((name) => !installedToggleable.includes(name))
          return { ...current, bundles: on ? [...rest, ...installedToggleable] : rest }
        })
      }

      const toggleSkill = (name) => {
        setDraft((current) => {
          if (!current) return current
          const disabled = current.skills || []
          const has = disabled.includes(name)
          return { ...current, skills: has ? disabled.filter((item) => item !== name) : [...disabled, name] }
        })
      }

      const setAllSkills = (on) => {
        setDraft((current) => {
          if (!current) return current
          return { ...current, skills: on ? [] : skillsInventory.map((row) => row.name) }
        })
      }

      const toggleMcp = (entryId) => {
        setDraft((current) => {
          if (!current) return current
          const enabled = current.mcp || []
          const has = enabled.includes(entryId)
          return { ...current, mcp: has ? enabled.filter((item) => item !== entryId) : [...enabled, entryId] }
        })
      }

      const setAllMcp = (on) => {
        setDraft((current) => {
          if (!current) return current
          return { ...current, mcp: on ? mcpToggleable.map((row) => row.entryId) : [] }
        })
      }

      const copyScene = async (scene) => {
        if (!scene) return
        try {
          setBusy(true)
          const json = await api('scene/save', {
            name: `${scene.name}${T.dupSuffix}`,
            bundles: scene.bundles,
            skills: (scene.skills || []).map((entry) => entry.name),
            mcp: Array.isArray(scene.mcp) ? scene.mcp : null,
          })
          await load(true)
          loadedSceneRef.current = ''
          setSelectedId(json.savedId)
          setNote({ tone: 'ok', text: T.savedToast })
        } catch (error) {
          setNote({ tone: 'error', text: errorText(error) })
        } finally {
          setBusy(false)
          setMenu(null)
        }
      }

      const applyScene = (scene) => {
        if (!scene) return
        setMenu(null)
        setSelectedId(scene.id)
        setDraft(sceneDraft(scene))
        startApply(scene)
      }

      const submitRename = async () => {
        if (!renaming) return
        const name = String(renaming.value || '').trim()
        if (!name) { setNote({ tone: 'error', text: T.renameEmpty }); return }
        try {
          setBusy(true)
          const json = await api('scene/save', {
            id: renaming.scene.id,
            name,
            bundles: renaming.scene.bundles,
            skills: (renaming.scene.skills || []).map((entry) => entry.name),
            mcp: Array.isArray(renaming.scene.mcp) ? renaming.scene.mcp : null,
          })
          setRenaming(null)
          setNote({ tone: 'ok', text: T.savedToast })
          setDraft((current) => (current && current.id === json.savedId ? { ...current, name } : current))
          await load(true)
          setSelectedId(json.savedId)
        } catch (error) {
          setNote({ tone: 'error', text: errorText(error) })
        } finally {
          setBusy(false)
        }
      }

      const saveDraft = async () => {
        if (!draft) return
        const name = draft.name.trim()
        if (!name) { setNote({ tone: 'error', text: T.sceneName }); return }
        try {
          setBusy(true)
          const json = await api('scene/save', { id: draft.id || undefined, name, bundles: draft.bundles, skills: draft.skills || [], mcp: Array.isArray(draft.mcp) ? draft.mcp : null })
          setData((current) => (current ? { ...current, scenes: json.scenes } : current))
          setSelectedId(json.savedId)
          setNote({ tone: 'ok', text: T.savedToast })
          setResults(null)
          await load(true)
        } catch (error) {
          setNote({ tone: 'error', text: errorText(error) })
        } finally {
          setBusy(false)
        }
      }

      // 「修改」: throw away unsaved edits and re-enter the scene's three steps.
      const editScene = () => {
        const scene = (data && data.scenes.find((item) => item.id === (draft && draft.id))) || null
        if (!scene) return
        loadedSceneRef.current = scene.id
        setSelectedId(scene.id)
        setDraft(sceneDraft(scene))
        setMoreView(false)
        setStep('plugins')
        setResults(null)
        setNote({ tone: 'ok', text: T.reloaded })
      }

      const removeScene = async () => {
        if (!draft || !draft.id) return
        try {
          setBusy(true)
          const json = await api('scene/delete', { id: draft.id })
          setData((current) => (current ? { ...current, scenes: json.scenes, active: null } : current))
          const next = json.scenes[0]
          choose(next || null)
          if (next) {
            setSelectedId(next.id)
            setDraft(sceneDraft(next))
          } else {
            setDraft(null)
          }
          setNote({ tone: 'ok', text: T.deletedToast })
        } catch (error) {
          setNote({ tone: 'error', text: errorText(error) })
        } finally {
          setBusy(false)
        }
      }

      const finishWith = (summary, restartRequired) => {
        setResults({ rows: summary, restartRequired })
        setNote(restartRequired ? { tone: 'warn', text: `${T.restartBanner} ${T.refreshHint}` } : { tone: 'ok', text: T.refreshHint })
      }

      const pump = async () => {
        while (true) {
          if (cancelRef.current) return
          const step = await api('apply/step', {})
          if (step.done) {
            const done = await api('apply/finish', {})
            finishWith(done.results || [], done.restartRequired)
            return
          }
          if (step.result && step.result.application === 'restart-required' && !restartOkRef.current) {
            setPause({ sceneName: pauseName, current: step.current })
            return
          }
        }
      }

      let pauseName = ''

      const startApply = async (scene) => {
        if (!scene) return
        try {
          setBusy(true)
          setResults(null)
          setNote(null)
          cancelRef.current = false
          restartOkRef.current = false
          const prepared = await api('apply/prepare', { id: scene.id })
          pauseName = scene.name
          if (!prepared.total) {
            finishWith([], false)
            setDialog(null)
            setBusy(false)
            return
          }
          setDialog({ scene, plan: prepared.plan, missing: prepared.missing || [] })
          setBusy(false)
        } catch (error) {
          setNote({ tone: 'error', text: errorText(error) })
          setBusy(false)
        }
      }

      const runApply = async () => {
        setDialog(null)
        setBusy(true)
        try {
          await pump()
        } catch (error) {
          setNote({ tone: 'error', text: errorText(error) })
        } finally {
          setBusy(false)
          load(true)
        }
      }

      const stopHere = async (sceneName) => {
        cancelRef.current = true
        setPause(null)
        try {
          const done = await api('apply/abort', {})
          finishWith(done.results || [], done.restartRequired)
          setNote({ tone: 'warn', text: T.stopHere })
        } catch (error) {
          setNote({ tone: 'error', text: errorText(error) })
        } finally {
          setBusy(false)
          load(true)
        }
      }

      const continueApply = async () => {
        restartOkRef.current = true
        setPause(null)
        try {
          await pump()
        } catch (error) {
          setNote({ tone: 'error', text: errorText(error) })
        } finally {
          setBusy(false)
          load(true)
        }
      }

      const runUndo = async () => {
        try {
          setBusy(true)
          const json = await api('undo', {})
          finishWith(json.results || [], json.restartRequired)
          setNote({ tone: 'ok', text: T.undoToast })
        } catch (error) {
          setNote({ tone: 'error', text: errorText(error) })
        } finally {
          setBusy(false)
          load(true)
        }
      }

      const activeId = data && data.active ? data.active.sceneId : ''
      // A scene swap rewrites the live plugin set, so the host refuses it while a
      // chat is running; show that up front instead of on click.
      const runningChats = data && Array.isArray(data.running) ? data.running : []
      const runningNames = runningChats.map((entry) => entry.title || '').filter(Boolean).join('、')
      const dirty = !!draft && (() => {
        if (!draft.id) return draft.name.trim().length > 0 || draft.bundles.length > 0 || (draft.skills || []).length > 0
        if (!selectedScene) return true
        return draft.name !== selectedScene.name
          || !sameSet(draft.bundles, selectedScene.bundles)
          || !sameSet(draft.skills || [], sceneSkills(selectedScene))
          || (Array.isArray(draft.mcp) && (!Array.isArray(selectedScene.mcp) || !sameSet(draft.mcp, selectedScene.mcp)))
      })()

      const renderBundleRow = (row) => {
        const liveRow = bundlesByName.get(row.name) || row
        const canToggle = canToggleRow(liveRow)
        const checked = !!draft && draft.bundles.includes(row.name)
        const unsavedHint = canToggle && checked !== liveRow.enabled ? T.unsaved : null
        return h(Row, {
          key: row.name,
          row: liveRow,
          checked,
          noSwitch: !canToggle,
          switchHint: '',
          disabled: busy || !canToggle,
          onToggle: () => toggleBundle(row.name),
          note: unsavedHint,
        })
      }

      const skillsInventory = useMemo(() => {
        const rows = data && data.skills && Array.isArray(data.skills.inventory) ? data.skills.inventory : []
        return rows.slice().sort((left, right) => String(left.name).localeCompare(String(right.name)))
      }, [data])
      const disabledSkills = (draft && draft.skills) || []
      const skillOnCount = skillsInventory.filter((row) => !disabledSkills.includes(row.name)).length

      const mcpInventory = useMemo(() => {
        const rows = data && data.mcp && Array.isArray(data.mcp.inventory) ? data.mcp.inventory : []
        return rows.slice().sort((left, right) => String(left.title).localeCompare(String(right.title)))
      }, [data])
      const mcpToggleable = useMemo(() => mcpInventory.filter((row) => !row.readOnlyReason), [mcpInventory])
      const draftMcp = draft && Array.isArray(draft.mcp) ? draft.mcp : null
      const effectiveMcp = draftMcp || mcpInventory.filter((row) => row.enabled).map((row) => row.entryId)
      const mcpOnCount = mcpInventory.filter((row) => effectiveMcp.includes(row.entryId)).length

      const renderSkillRow = (row) => {
        const off = disabledSkills.includes(row.name)
        return h(Row, {
          key: row.name,
          row: { title: row.name, name: row.name, description: row.description },
          checked: !off,
          disabled: busy,
          switchHint: '',
          onToggle: () => toggleSkill(row.name),
          note: off ? T.skillDisabled : null,
        })
      }

      const renderMcpRow = (row) => {
        const canToggle = !row.readOnlyReason
        const on = effectiveMcp.includes(row.entryId)
        return h(Row, {
          key: row.entryId,
          row: { title: row.title, name: row.name, description: row.description, icon: null },
          checked: on,
          noSwitch: !canToggle,
          switchHint: row.readOnlyReason || '',
          disabled: busy || !canToggle,
          onToggle: () => toggleMcp(row.entryId),
          note: canToggle && on !== row.enabled ? T.unsaved : null,
        })
      }

      const cards = scenes.slice()
      const minCells = Math.max(3, Math.min(9, Math.ceil((cards.length + 1) / 3) * 3))
      const addCells = Math.max(1, minCells - cards.length)

      const cardLabel = { ...T }

      return h('div', {
        style: {
          display: 'flex', flexDirection: 'column', gap: 18, padding: '4px 2px 28px',
          color: TEXT_1, fontSize: 13,
        },
      },
      // header
      h('header', { style: { display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' } },
        h('div', { style: { flex: '1 1 320px', minWidth: 0 } },
          h('h2', { style: { margin: 0, fontSize: 18, fontWeight: 600 } }, T.title),
          h('p', { style: { margin: '4px 0 0', fontSize: 13, color: MUTED } }, T.subtitle)),
        h('div', { style: { display: 'flex', gap: 8, alignItems: 'center' } },
          h(Button, { onClick: () => load(false), disabled: busy, size: 'sm' }, T.refresh),
          h(Button, { onClick: newScene, variant: 'primary', size: 'sm' }, `+ ${T.newScene}`))),

      loadError ? h('div', { style: { padding: 10, borderRadius: 8, background: SURFACE, color: DANGER } }, `${T.loadFailed}: ${loadError}`) : null,
      note ? h('div', {
        style: {
          padding: '8px 12px', borderRadius: 8, fontSize: 12,
          background: SURFACE, color: note.tone === 'error' ? DANGER : note.tone === 'warn' ? TEXT_1 : TEXT_2,
          border: `.5px solid ${note.tone === 'error' ? DANGER : BORDER}`,
        },
      }, note.text) : null,

      // scene grid
      h('div', {
        style: {
          display: 'grid', gap: 10,
          gridTemplateColumns: 'repeat(auto-fill, minmax(196px, 1fr))',
        },
      },
      cards.map((scene) => h(SceneCard, {
        key: scene.id,
        scene: { ...scene, activeLabel: cardLabel.active },
        active: scene.id === activeId,
        count: countOf(scene),
        selected: scene.id === selectedId,
        onSelect: () => choose(scene),
        onContext: (event) => setMenu({ scene, x: event.clientX, y: event.clientY }),
      })),
      Array.from({ length: addCells }).map((_, index) => h(AddTile, {
        key: `add-${index}`,
        label: T.addScene,
        onClick: newScene,
        disabled: busy,
      }))),

      loading && !data ? h('div', { style: { color: MUTED } }, T.applying) : null,

      // detail
      draft ? h('div', {
        style: {
          display: 'flex', flexDirection: 'column', gap: 14, padding: 16, borderRadius: 14,
          background: SURFACE, border: `.5px solid ${BORDER}`,
        },
      },
      h('div', { style: { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' } },
        h('input', {
          value: draft.name,
          placeholder: T.sceneName,
          'aria-label': T.sceneName,
          onChange: (event) => setDraft({ ...draft, name: event.target.value }),
          style: {
            flex: '1 1 240px', minWidth: 180, height: 34, padding: '0 12px', font: 'inherit', fontSize: 13,
            color: TEXT_1, background: 'transparent', border: `.5px solid ${BORDER_STRONG}`,
            borderRadius: 8, outline: 'none',
          },
        }),
        dirty
          ? h('span', { style: { fontSize: 11, color: MUTED, border: `.5px solid ${BORDER_STRONG}`, borderRadius: 999, padding: '2px 8px' } }, T.unsaved)
          : h('span', { style: { fontSize: 11, color: MUTED } }, T.saved),
        h(Button, { onClick: saveDraft, variant: 'primary', disabled: busy || !dirty }, T.save),
        h(Button, { onClick: editScene, disabled: busy || !draft.id }, T.edit),
        h(Button, { onClick: () => copyScene(selectedScene || draft), disabled: busy || !draft.id }, T.ctxCopy)),

      // three editing steps: plugins, MCP servers, then skills
      h('div', { style: { display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' } },
        h(Button, { onClick: () => setStep('plugins'), size: 'sm', variant: step === 'plugins' ? 'primary' : 'ghost' }, T.stepPlugins),
        h(Button, { onClick: () => setStep('mcp'), size: 'sm', variant: step === 'mcp' ? 'primary' : 'ghost' }, T.stepMcp),
        h(Button, { onClick: () => setStep('skills'), size: 'sm', variant: step === 'skills' ? 'primary' : 'ghost' }, T.stepSkills),
        h('div', { style: { flex: 1 } }),
        step === 'skills'
          ? h('span', { style: { fontSize: 11, color: MUTED } }, `${T.skillCount(skillOnCount, skillsInventory.length)} · ${T.skillsHint}`)
          : step === 'mcp'
            ? h('span', { style: { fontSize: 11, color: MUTED } }, `${T.mcpCount(mcpOnCount, mcpInventory.length)} · ${T.mcpHint}`)
            : null),

      h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' } },
        h('div', { style: { flex: 1 } }),
        h(Button, {
          onClick: () => startApply(draft.id ? selectedScene : { ...draft, id: '' }),
          variant: 'primary',
          disabled: busy || !draft.id || runningChats.length > 0,
          size: 'sm',
          title: runningChats.length > 0 ? T.sessionsBusy(runningNames) : undefined,
        }, busy ? T.applying : T.apply),
        h(Button, {
          onClick: runUndo,
          disabled: busy || !data || !data.lastApplied || runningChats.length > 0,
          size: 'sm',
          title: runningChats.length > 0 ? T.sessionsBusy(runningNames) : undefined,
        }, T.undo),
        h(Button, { onClick: removeScene, variant: 'danger', disabled: busy || !draft.id, size: 'sm' }, T.remove)),

      runningChats.length > 0
        ? h('div', { style: { fontSize: 12, color: MUTED } }, T.sessionsBusy(runningNames))
        : null,

      !draft.id ? h('div', { style: { fontSize: 12, color: MUTED } }, T.emptyHint) : null,

      // sections — step 1 mirrors the official page, step 2 MCP servers, step 3 skills
      step === 'skills'
        ? h(Section, {
          title: T.skillsTitle,
          hint: String(skillsInventory.length),
          action: draft
            ? h('div', { style: { display: 'flex', gap: 6 } },
              h(Button, { onClick: () => setAllSkills(true), disabled: busy, size: 'sm' }, T.enableAll),
              h(Button, { onClick: () => setAllSkills(false), disabled: busy, size: 'sm' }, T.disableAll))
            : null,
        },
        skillsInventory.length
          ? skillsInventory.map(renderSkillRow)
          : h('div', { style: { fontSize: 12, color: MUTED } }, T.skillsEmpty))
        : step === 'mcp'
        ? h(Section, {
          title: T.mcpTitle,
          hint: String(mcpInventory.length),
          action: draft
            ? h('div', { style: { display: 'flex', gap: 6 } },
              h(Button, { onClick: () => setAllMcp(true), disabled: busy, size: 'sm' }, T.enableAll),
              h(Button, { onClick: () => setAllMcp(false), disabled: busy, size: 'sm' }, T.disableAll))
            : null,
        },
        mcpInventory.length
          ? mcpInventory.map(renderMcpRow)
          : h('div', { style: { fontSize: 12, color: MUTED } }, T.mcpEmpty))
        : moreView
        ? h(Section, {
          title: T.experimental,
          hint: String(moreRows.length),
          action: h(Button, { size: 'sm', variant: 'ghost', onClick: () => setMoreView(false) }, `← ${T.back}`),
        }, moreRows.map(renderBundleRow))
        : [
          configRows.length ? h(Section, { key: 'builtin-config', title: T.builtinConfig }, configRows.map((row) => h(Row, {
            key: row.key,
            row: { title: row.title, name: row.key, description: row.description },
            noSwitch: true,
            switchHint: '',
          }))) : null,
          (extensionRows.length || moreRows.length)
            ? h(Section, {
              key: 'experimental',
              title: T.experimental,
              action: moreRows.length
                ? h(Button, { size: 'sm', variant: 'ghost', onClick: () => setMoreView(true) }, `${T.more} ›`)
                : null,
            }, extensionRows.map(renderBundleRow))
            : null,
          installedRows.length ? h(Section, {
            key: 'installed',
            title: T.installed,
            action: draft
              ? h('div', { style: { display: 'flex', gap: 6 } },
                h(Button, { onClick: () => setAllInstalled(true), disabled: busy, size: 'sm' }, T.enableAll),
                h(Button, { onClick: () => setAllInstalled(false), disabled: busy, size: 'sm' }, T.disableAll))
              : null,
          }, installedRows.map(renderBundleRow)) : null,
        ],

      // results
      results ? h('div', {
        style: { display: 'flex', flexDirection: 'column', gap: 6, padding: 12, borderRadius: 10, background: SURFACE, border: `.5px solid ${BORDER}` },
      },
      h('div', { style: { fontSize: 12, fontWeight: 600, color: TEXT_2 } }, T.resultsTitle),
      results.rows.length === 0
        ? h('div', { style: { fontSize: 12, color: MUTED } }, T.noChanges)
        : results.rows.map((item, index) => h('div', {
          key: `${item.name}-${index}`,
          style: { fontSize: 12, color: item.application === 'failed' ? DANGER : TEXT_2, display: 'flex', gap: 8 },
        },
        item.kind === 'skills'
          ? [
            h('span', { key: 'mark', style: { color: MUTED } }, '·'),
            h('span', { key: 'text', style: { flex: 1, minWidth: 0 } }, T.skillsPlan(item.disableCount || 0, item.enableCount || 0)),
          ]
          : [
            h('span', { key: 'mark', style: { color: MUTED } }, item.enabled ? '+' : '−'),
            h('span', { key: 'text', style: { flex: 1, minWidth: 0 } }, item.title || item.name),
          ],
        h('span', { key: 'state', style: { color: MUTED } }, item.application === 'failed' ? T.failed : item.application === 'skipped' ? T.skipped : T.applied))))
        : null) : (data && data.scenes.length === 0
          ? h('div', { style: { color: MUTED, fontSize: 13 } }, T.empty)
          : null),

      // confirm dialog
      dialog ? h(Modal, {
        title: T.confirmTitle,
        onClose: () => setDialog(null),
        footer: [
          h(Button, { key: 'cancel', onClick: () => setDialog(null), variant: 'ghost' }, T.cancel),
          h(Button, { key: 'go', onClick: runApply, variant: 'primary' }, T.proceed),
        ],
      },
      h('p', { style: { margin: '0 0 8px' } }, `${dialog.scene.name} — ${T.confirmBody}`),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 } },
        dialog.plan.length === 0
          ? h('div', { style: { color: MUTED } }, T.noChanges)
          : dialog.plan.map((item, index) => h('div', { key: `${item.name}-${index}`, style: { display: 'flex', gap: 8 } },
            item.kind === 'skills'
              ? [
                h('span', { key: 'mark', style: { color: MUTED, width: 14 } }, '·'),
                h('span', { key: 'text', style: { flex: 1, minWidth: 0, color: TEXT_1 } }, T.skillsPlan((item.disable || []).length, (item.enable || []).length)),
                h('span', { key: 'state', style: { color: MUTED } }, T.applied),
              ]
              : [
                h('span', { key: 'mark', style: { color: item.to ? SUCCESS : DANGER, width: 14 } }, item.to ? '+' : '−'),
                h('span', { key: 'text', style: { flex: 1, minWidth: 0, color: TEXT_1 } }, item.title || item.name),
                h('span', { key: 'state', style: { color: MUTED } }, item.to ? T.toEnable : T.toDisable),
              ]))),
      dialog.missing && dialog.missing.length ? h('p', { style: { color: MUTED, margin: 0 } }, `${T.skipped}: ${dialog.missing.join(', ')}`) : null) : null,

      // restart pause
      pause ? h(Modal, {
        title: T.restartTitle,
        onClose: () => stopHere(pause.sceneName),
        footer: [
          h(Button, { key: 'stop', onClick: () => stopHere(pause.sceneName), variant: 'ghost' }, T.stopHere),
          h(Button, { key: 'go', onClick: continueApply, variant: 'primary' }, T.continueApply),
        ],
      },
      h('p', { style: { margin: 0 } }, T.restartBody)) : null,

      // right-click menu on a scene card
      menu ? h('div', {
        onMouseLeave: () => setMenu(null),
        style: {
          position: 'fixed', left: Math.max(8, menu.x), top: Math.min(menu.y, Math.max(8, ((typeof window !== 'undefined' && window.innerHeight) || 800) - 140)), zIndex: 60,
          minWidth: 148, padding: 4, borderRadius: 10, background: SURFACE_2,
          border: `.5px solid ${BORDER_STRONG}`, boxShadow: '0 8px 24px rgba(0,0,0,.28)',
          display: 'flex', flexDirection: 'column',
        },
      },
      h(MenuItem, { onClick: () => { const scene = menu.scene; setMenu(null); loadedSceneRef.current = scene.id; setSelectedId(scene.id); setDraft(sceneDraft(scene)); setMoreView(false); setStep('plugins') } }, T.ctxEdit),
      h(MenuItem, { onClick: () => copyScene(menu.scene) }, T.ctxCopy),
      h(MenuItem, { onClick: () => { setRenaming({ scene: menu.scene, value: menu.scene.name }); setMenu(null) } }, T.ctxRename),
      h(MenuItem, { onClick: () => applyScene(menu.scene) }, T.ctxApply)) : null,

      // rename dialog
      renaming ? h(Modal, {
        title: T.renameTitle,
        onClose: () => setRenaming(null),
        footer: [
          h(Button, { key: 'cancel', onClick: () => setRenaming(null), variant: 'ghost' }, T.cancel),
          h(Button, { key: 'ok', onClick: submitRename, variant: 'primary', disabled: busy }, T.save),
        ],
      },
      h('input', {
        value: renaming.value,
        placeholder: T.sceneName,
        'aria-label': T.sceneName,
        autoFocus: true,
        onChange: (event) => setRenaming({ ...renaming, value: event.target.value }),
        onKeyDown: (event) => { if (event.key === 'Enter') submitRename() },
        style: {
          width: '100%', height: 34, padding: '0 12px', font: 'inherit', fontSize: 13, boxSizing: 'border-box',
          color: TEXT_1, background: 'transparent', border: `.5px solid ${BORDER_STRONG}`,
          borderRadius: 8, outline: 'none',
        },
      })) : null)
    }

    /* ---- composer scene picker --------------------------------------------
       A chip in the composer tool row that switches scenes like a shortcut.
       The dropdown lives on document.body so the docked composer cannot clip
       it; the standard slot props do not include a portal helper. */

    let menuNode = null
    let menuCleanup = null

    function closeSceneMenu() {
      if (typeof menuCleanup === 'function') menuCleanup()
      menuCleanup = null
      if (menuNode && menuNode.parentNode) menuNode.parentNode.removeChild(menuNode)
      menuNode = null
    }

    function openSceneMenu(anchor, scenes, activeId, onPick) {
      closeSceneMenu()
      if (!anchor) return
      const T = COPY[readLang()]
      const rect = anchor.getBoundingClientRect()
      const menu = document.createElement('div')
      menuNode = menu
      menu.style.cssText = [
        'position:fixed', 'z-index:2147483000', 'width:248px', 'padding:6px',
        'display:flex', 'flex-direction:column', 'gap:2px',
        'border-radius:10px', 'max-height:56vh', 'overflow:auto',
        'box-shadow:0 14px 36px rgba(0,0,0,.34)',
        'background:var(--dsw-alias-bg-overlay, #26262b)',
        `border:0.5px solid ${BORDER}`,
        `color:${TEXT_1}`, 'font-size:12.5px',
      ].join(';')
      menu.style.bottom = `${Math.max(8, window.innerHeight - rect.top + 6)}px`
      menu.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - 264))}px`
      if (!Array.isArray(scenes) || scenes.length === 0) {
        const empty = document.createElement('div')
        empty.textContent = T.chipEmpty
        empty.style.cssText = `padding:8px 10px;color:${MUTED};line-height:1.55`
        menu.appendChild(empty)
      } else {
        for (const scene of scenes) {
          const row = document.createElement('button')
          row.type = 'button'
          row.textContent = scene.id === activeId ? `✓ ${scene.name}` : scene.name
          row.style.cssText = [
            'display:block', 'width:100%', 'text-align:left', 'padding:7px 10px',
            'border:0', 'border-radius:6px', 'background:transparent',
            `color:${TEXT_1}`, 'font:inherit', 'cursor:pointer',
            'white-space:nowrap', 'overflow:hidden', 'text-overflow:ellipsis',
          ].join(';')
          row.addEventListener('mouseenter', () => { row.style.background = SURFACE })
          row.addEventListener('mouseleave', () => { row.style.background = 'transparent' })
          row.addEventListener('click', () => {
            closeSceneMenu()
            onPick(scene)
          })
          menu.appendChild(row)
        }
      }
      document.body.appendChild(menu)
      const onPointerDown = (event) => {
        if (menuNode && !menuNode.contains(event.target) && !anchor.contains(event.target)) closeSceneMenu()
      }
      const onKeyDown = (event) => {
        if (event.key === 'Escape') closeSceneMenu()
      }
      document.addEventListener('mousedown', onPointerDown, true)
      document.addEventListener('keydown', onKeyDown, true)
      menuCleanup = () => {
        document.removeEventListener('mousedown', onPointerDown, true)
        document.removeEventListener('keydown', onKeyDown, true)
      }
    }

    function ScenePicker() {
      const lang = useLangState()
      const T = COPY[lang]
      const [scenes, setScenes] = useState([])
      const [active, setActive] = useState(null)
      const [busy, setBusy] = useState(false)
      const [note, setNote] = useState(null)
      const buttonRef = useRef(null)

      const refresh = useCallback(async () => {
        try {
          const json = await api('state')
          setScenes(Array.isArray(json.scenes) ? json.scenes : [])
          setActive(json.active && json.active.sceneId ? json.active : null)
          return json
        } catch {
          return null
        }
      }, [])

      useEffect(() => {
        refresh()
      }, [refresh])

      // Keep the chip honest while the settings page adds, renames or applies scenes.
      useEffect(() => {
        const timer = setInterval(() => {
          if (!busy) refresh()
        }, 8000)
        return () => clearInterval(timer)
      }, [refresh, busy])

      useEffect(() => {
        if (!note) return undefined
        const timer = setTimeout(() => setNote(null), 6000)
        return () => clearTimeout(timer)
      }, [note])

      const pick = useCallback(async (scene) => {
        setBusy(true)
        setNote(null)
        try {
          const json = await api('scene/apply-now', { id: scene.id })
          await refresh()
          const failed = Array.isArray(json.failed) ? json.failed : []
          if (failed.length > 0) setNote({ tone: 'error', text: `${T.chipFailed}: ${failed.join(', ')}` })
          else if (json.restartRequired) setNote({ tone: 'warn', text: T.chipRestart })
          else setNote({ tone: 'ok', text: T.chipApplied(scene.name) })
        } catch (error) {
          setNote({ tone: 'error', text: errorText(error) })
        } finally {
          setBusy(false)
        }
      }, [refresh, T])

      const open = useCallback(() => {
        if (busy || !buttonRef.current) return
        refresh().then((json) => {
          const list = json && Array.isArray(json.scenes) ? json.scenes : scenes
          openSceneMenu(buttonRef.current, list, active && active.sceneId, (scene) => pick(scene))
        })
      }, [busy, refresh, scenes, active, pick])

      const icon = h('svg', {
        width: 13, height: 13, viewBox: '0 0 16 16', fill: 'none',
        style: { flexShrink: 0, color: MUTED },
      }, h('path', {
        d: 'M3.2 3.2h3.6v3.6H3.2zM9.2 3.2h3.6v3.6H9.2zM3.2 9.2h3.6v3.6H3.2zM9.2 9.2h3.6v3.6H9.2z',
        stroke: 'currentColor', strokeWidth: 1.1,
      }))

      const chipLabel = busy
        ? T.chipBusy
        : active && active.sceneName
          ? T.chipScene(active.sceneName)
          : scenes.length > 0 ? `${T.chipPick} · ${scenes.length}` : T.chipNone

      const chip = h('button', {
        ref: buttonRef,
        type: 'button',
        title: busy ? T.chipBusy : T.chipPick,
        disabled: busy,
        onClick: open,
        style: {
          display: 'inline-flex', alignItems: 'center', gap: 6, height: 26,
          padding: '0 9px', maxWidth: 220, borderRadius: 7,
          border: `.5px solid ${BORDER}`, background: SURFACE,
          color: TEXT_2, font: 'inherit', fontSize: 12,
          cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.6 : 1,
          whiteSpace: 'nowrap',
        },
      }, [
        icon,
        h('span', { key: 'label', style: { overflow: 'hidden', textOverflow: 'ellipsis' } }, chipLabel),
        h('span', { key: 'caret', style: { color: MUTED, fontSize: 10 } }, '▾'),
      ])

      const label = note
        ? h('span', {
          key: 'note',
          style: {
            fontSize: 11, maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis',
            whiteSpace: 'nowrap', color: note.tone === 'error' ? DANGER : note.tone === 'warn' ? '#d99a2b' : SUCCESS,
          },
        }, note.text)
        : null

      return h('span', {
        style: { display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0 },
      }, [chip, label])
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        appContext = ctx
        localeService = ctx.get('locale') || null
        const slots = ctx.get('slots')
        if (!slots || typeof slots.inject !== 'function') return
        ctx.effect(() => slots.inject('settings.section', () => slots.register({
          name: 'settings.section',
          id: 'plugin-sets',
          order: 16,
          label: () => COPY[readLang()].title,
        }, Page)))
        ctx.effect(() => slots.inject('conversation.input.left', () => slots.register({
          name: 'conversation.input.left',
          id: 'plugin-sets-scene',
          order: 2,
          label: () => COPY[readLang()].chipPick,
        }, ScenePicker)))
      },
    }
  },
})
