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
        stepPlugins: '1 插件',
        stepMcp: '2 MCP',
        stepSkills: '3 技能组合',
        stepNotes: '4 注明',
        stepDiscover: '5 搜寻技能',
        discoverTitle: '搜寻技能',
        discoverHint: '扫描本机技能源：用户目录、项目目录，以及其它技能插件提供的技能',
        discoverEmpty: '还没有扫描结果。',
        rescan: '重新扫描',
        scanning: '扫描中…',
        providedBy: '插件提供',
        loadedSkill: '已加载',
        unloadedSkill: '未加载',
        rootMissing: '目录不存在',
        sceneSkills: '场景技能',
        sceneDir: '本插件自有目录',
        adopt: '装为场景技能',
        adopted: '已装为场景技能',
        removeSkill: '卸下',
        adoptDone: '已装为场景技能，可在「3 技能组合」里开关。',
        removeDone: '已卸下（目录移到 trash，可手动找回）。',
        scanNote: '只读取本机目录；「装为场景技能」会复制到插件自有目录，不改动原文件。',
        pickScene: '选择场景',
        noScene: '还没有场景',
        rename: '重命名',
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
        comboTitle: '技能组合',
        comboPick: '选择组合',
        comboNone: '还没有组合',
        comboSave: '保存为组合',
        comboUpdate: '更新组合',
        comboCopy: '复制组合',
        comboRename: '组合改名',
        comboDelete: '删除组合',
        comboName: '组合名称',
        comboEmpty: '还没有组合：先勾选技能，再「保存为组合」。',
        comboLoaded: (name) => `已载入组合「${name}」`,
        comboSaved: (name) => `组合「${name}」已保存`,
        comboDeleted: '组合已删除',
        availableSkills: '现有技能',
        selectedSkills: '选择技能',
        comboMoveIn: '加入组合',
        comboMoveOut: '移出组合',
        notesTitle: '场景注明',
        notesHint: '像记忆一样写给 AGENT 的补充说明；启用的条目会随场景应用注入系统提示',
        notesEmpty: '还没有注明。新建一条，写上希望 AGENT 在这个场景里遵守的规则。',
        noteNew: '新建注明',
        noteEdit: '编辑',
        noteDelete: '删除',
        noteName: '标题',
        noteBody: '内容（写给 AGENT 的说明）',
        noteSaved: '注明已保存',
        noteDeleted: '注明已删除',
        noteNoScene: '先新建或选择一个场景，注明属于场景。',
        notesCount: (on, total) => `${on} / ${total} 启用`,
        notesPlan: (on, off) => `注明：启用 ${on} 条，停用 ${off} 条`,
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
        stepPlugins: '1 Plugins',
        stepMcp: '2 MCP',
        stepSkills: '3 Skill combos',
        stepNotes: '4 Notes',
        stepDiscover: '5 Discover skills',
        discoverTitle: 'Discover skills',
        discoverHint: 'Scans local skill sources: user dir, project dir, and skills contributed by other skill plugins',
        discoverEmpty: 'Nothing scanned yet.',
        rescan: 'Scan again',
        scanning: 'Scanning…',
        providedBy: 'from plugins',
        loadedSkill: 'loaded',
        unloadedSkill: 'not loaded',
        rootMissing: 'folder missing',
        sceneSkills: 'Scene skills',
        sceneDir: 'this plugin owns this folder',
        adopt: 'Adopt as scene skill',
        adopted: 'Adopted',
        removeSkill: 'Remove',
        adoptDone: 'Adopted — toggle it on the Skills tab.',
        removeDone: 'Removed (moved to trash, restorable by hand).',
        scanNote: 'Read-only scan. Adopting copies the folder into this plugin, the original is untouched.',
        pickScene: 'Choose a scene',
        noScene: 'No scenes yet',
        rename: 'Rename',
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
        comboTitle: 'Skill combos',
        comboPick: 'Choose a combo',
        comboNone: 'No combos yet',
        comboSave: 'Save as combo',
        comboUpdate: 'Update combo',
        comboCopy: 'Duplicate combo',
        comboRename: 'Rename combo',
        comboDelete: 'Delete combo',
        comboName: 'Combo name',
        comboEmpty: 'No combos yet: pick skills, then “Save as combo”.',
        comboLoaded: (name) => `Loaded combo “${name}”`,
        comboSaved: (name) => `Combo “${name}” saved`,
        comboDeleted: 'Combo deleted',
        availableSkills: 'Available skills',
        selectedSkills: 'Selected skills',
        comboMoveIn: 'Add to combo',
        comboMoveOut: 'Remove from combo',
        notesTitle: 'Scene notes',
        notesHint: 'Extra written instructions for the agent, like memory; enabled notes are injected into the system prompt with the scene',
        notesEmpty: 'No notes yet. Create one with the rules the agent should follow in this scene.',
        noteNew: 'New note',
        noteEdit: 'Edit',
        noteDelete: 'Delete',
        noteName: 'Title',
        noteBody: 'Body (instructions for the agent)',
        noteSaved: 'Note saved',
        noteDeleted: 'Note deleted',
        noteNoScene: 'Create or pick a scene first: notes belong to a scene.',
        notesCount: (on, total) => `${on} / ${total} enabled`,
        notesPlan: (on, off) => `Notes: ${on} enabled, ${off} disabled`,
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
      notes: scene && Array.isArray(scene.notes) ? [...scene.notes] : null,
      comboId: scene && scene.comboId ? scene.comboId : '',
    })

    const sceneSkills = (scene) => (scene && scene.skills ? scene.skills : []).map((entry) => entry.name)

    const draftMatches = (draft, scene) => !!draft
      && draft.id === scene.id
      && draft.name === scene.name
      && sameSet(draft.bundles, scene.bundles)
      && sameSet(draft.skills || [], sceneSkills(scene))
      && (Array.isArray(scene.mcp) ? sameSet(draft.mcp || [], scene.mcp) : true)
      && (Array.isArray(scene.notes) ? sameSet(draft.notes || [], scene.notes) : true)

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
      const [comboForm, setComboForm] = useState(null)
      const [noteForm, setNoteForm] = useState(null)
      const [scan, setScan] = useState(null)
      const [scanBusy, setScanBusy] = useState(false)

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
        setDraft({ id: '', name: '', bundles: [], skills: [], mcp: liveMcp, notes: [] })
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
          const json = await api('scene/save', { id: draft.id || undefined, name, bundles: draft.bundles, skills: draft.skills || [], mcp: Array.isArray(draft.mcp) ? draft.mcp : null, notes: Array.isArray(draft.notes) ? draft.notes : null, comboId: draft.comboId || '' })
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

      const runScan = useCallback(async () => {
        if (scanBusy) return
        setScanBusy(true)
        try {
          const json = await api('discover/scan', {})
          setScan(json)
        } catch (error) {
          setNote({ tone: 'error', text: errorText(error) })
        } finally {
          setScanBusy(false)
        }
      }, [scanBusy])

      useEffect(() => {
        if (step !== 'discover' || scan || scanBusy) return
        runScan()
      }, [step, scan, scanBusy, runScan])

      const adoptSkill = async (skill) => {
        try {
          setScanBusy(true)
          await api('discover/adopt', { path: skill.path })
          setNote({ tone: 'ok', text: T.adoptDone })
          setScan(null)
          load(true)
        } catch (error) {
          setNote({ tone: 'error', text: errorText(error) })
        } finally {
          setScanBusy(false)
        }
      }

      const removeSkill = async (folder) => {
        try {
          setScanBusy(true)
          await api('discover/remove', { folder })
          setNote({ tone: 'ok', text: T.removeDone })
          setScan(null)
          load(true)
        } catch (error) {
          setNote({ tone: 'error', text: errorText(error) })
        } finally {
          setScanBusy(false)
        }
      }

      const activeId = data && data.active ? data.active.sceneId : ''
      // A scene swap rewrites the live plugin set, so the host refuses it while a
      // chat is running; show that up front instead of on click.
      const runningChats = data && Array.isArray(data.running) ? data.running : []
      const runningNames = runningChats.map((entry) => entry.title || '').filter(Boolean).join('、')
      const dirty = !!draft && (() => {
        if (!draft.id) return draft.name.trim().length > 0 || draft.bundles.length > 0 || (draft.skills || []).length > 0 || (draft.notes || []).length > 0
        if (!selectedScene) return true
        return draft.name !== selectedScene.name
          || !sameSet(draft.bundles, selectedScene.bundles)
          || !sameSet(draft.skills || [], sceneSkills(selectedScene))
          || (Array.isArray(draft.mcp) && (!Array.isArray(selectedScene.mcp) || !sameSet(draft.mcp, selectedScene.mcp)))
          || (Array.isArray(draft.notes) && (!Array.isArray(selectedScene.notes) || !sameSet(draft.notes, selectedScene.notes)))
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

      // ---- skill combos: named, reusable sets of switched-on skills ----
      const combos = data && Array.isArray(data.combos) ? data.combos : []
      const skillOnNames = skillsInventory.filter((row) => !disabledSkills.includes(row.name)).map((row) => row.name)
      // Adopted skills are stored as `scene-<id>` because the registry requires
      // kebab-case, but they are always shown with the 场景- prefix.
      const skillLabel = (row) => {
        const source = (row && row.provider) || ''
        const name = (row && row.name) || ''
        if (row && row.display) return row.display
        return source === 'dsh-plugin-sets-scene' ? `场景-${name.replace(/^scene-/, '')}` : name
      }
      // Skills are grouped by where they come from, so a masked skill still
      // sits under its real owner (Univer, GenUI, …) instead of the shadow.
      const ORIGIN_LABELS = {
        univer: { zh: 'Univer 办公', en: 'Univer office' },
        'dsh-genui': { zh: 'GenUI 界面', en: 'GenUI interface' },
        'dsh-windows-acl': { zh: 'Windows 沙箱', en: 'Windows sandbox' },
        'dsh-plugin-sets-scene': { zh: '场景技能', en: 'Scene skills' },
        'dsh-skills-manager-external': { zh: '技能管理器', en: 'Skills manager' },
        custom: { zh: '本地技能', en: 'Local skills' },
      }
      const originLabel = (key) => {
        const hit = ORIGIN_LABELS[key]
        if (hit) return lang === 'en' ? hit.en : hit.zh
        if (key === 'dsh-plugin-sets-shadow') return lang === 'en' ? 'Other' : '其它'
        return key
      }
      const groupByProvider = (rows) => {
        // Older disabled entries were captured before the origin was stored;
        // recover the owner from the name so the grouping never regresses.
        const LEGACY_ORIGIN = (name) => {
          if (name === 'genui') return 'dsh-genui'
          if (name === 'diagnose-windows-sandbox-acl') return 'dsh-windows-acl'
          if (/^(office|univer)(-|$)/.test(name)) return 'univer'
          return 'custom'
        }
        const order = []
        const map = new Map()
        for (const row of rows) {
          const raw = row.origin && row.origin !== 'dsh-plugin-sets-shadow' ? row.origin : LEGACY_ORIGIN(row.name)
          const key = raw || row.provider || 'custom'
          if (!map.has(key)) { map.set(key, []); order.push(key) }
          map.get(key).push(row)
        }
        // 场景技能 always first: the built-in routing skill is the entry point.
        order.sort((left, right) => (right === 'dsh-plugin-sets-scene' ? 1 : 0) - (left === 'dsh-plugin-sets-scene' ? 1 : 0) || left.localeCompare(right))
        return order.map((key) => ({ key, label: originLabel(key), rows: map.get(key) }))
      }
      const loadCombo = (id) => {
        const combo = combos.find((item) => item.id === id)
        if (!combo || !draft) return
        const chosen = new Set(combo.skills)
        setDraft({
          ...draft,
          comboId: combo.id,
          skills: skillsInventory.filter((row) => !chosen.has(row.name)).map((row) => row.name),
        })
        setNote({ tone: 'ok', text: T.comboLoaded(combo.name) })
      }
      const submitCombo = async () => {
        if (!comboForm) return
        const name = String(comboForm.value || '').trim()
        if (!name) { setNote({ tone: 'error', text: T.renameEmpty }); return }
        try {
          setBusy(true)
          await api('combo/save', { id: comboForm.id, name, skills: skillOnNames })
          await load(true)
          setDraft((current) => (current ? { ...current, comboId: comboForm.id || current.comboId } : current))
          setComboForm(null)
          setNote({ tone: 'ok', text: T.comboSaved(name) })
        } catch (error) {
          setNote({ tone: 'error', text: errorText(error) })
        } finally {
          setBusy(false)
        }
      }
      const removeCombo = async (id) => {
        if (!id) return
        try {
          setBusy(true)
          await api('combo/delete', { id })
          await load(true)
          setDraft((current) => (current && current.comboId === id ? { ...current, comboId: '' } : current))
          setNote({ tone: 'ok', text: T.comboDeleted })
        } catch (error) {
          setNote({ tone: 'error', text: errorText(error) })
        } finally {
          setBusy(false)
        }
      }
      const comboSelected = combos.find((item) => item.id === (draft && draft.comboId)) || null

      // ---- notes: written instructions that ride along with a scene ----
      const notes = data && Array.isArray(data.notes) ? data.notes : []
      const draftNotes = draft && Array.isArray(draft.notes) ? draft.notes : []
      const toggleNote = (id) => {
        setDraft((current) => {
          if (!current) return current
          const list = Array.isArray(current.notes) ? current.notes : []
          return { ...current, notes: list.includes(id) ? list.filter((item) => item !== id) : [...list, id] }
        })
      }
      const setAllNotes = (on) => {
        setDraft((current) => (current ? { ...current, notes: on ? notes.map((item) => item.id) : [] } : current))
      }
      const submitNote = async () => {
        if (!noteForm) return
        const name = String(noteForm.name || '').trim()
        const body = String(noteForm.body || '').trim()
        if (!name) { setNote({ tone: 'error', text: T.noteName }); return }
        if (!body) { setNote({ tone: 'error', text: T.noteBody }); return }
        try {
          setBusy(true)
          const json = await api('note/save', { id: noteForm.id || undefined, name, body })
          setData((current) => (current ? { ...current, notes: json.notes } : current))
          if (!noteForm.id) {
            setDraft((current) => (current ? { ...current, notes: [...(current.notes || []), json.savedId] } : current))
          }
          setNoteForm(null)
          setNote({ tone: 'ok', text: T.noteSaved })
        } catch (error) {
          setNote({ tone: 'error', text: errorText(error) })
        } finally {
          setBusy(false)
        }
      }
      const removeNote = async (id) => {
        if (!id) return
        try {
          setBusy(true)
          const json = await api('note/delete', { id })
          setData((current) => (current ? { ...current, notes: json.notes } : current))
          setDraft((current) => (current && Array.isArray(current.notes) ? { ...current, notes: current.notes.filter((item) => item !== id) } : current))
          setNoteForm(null)
          setNote({ tone: 'ok', text: T.noteDeleted })
        } catch (error) {
          setNote({ tone: 'error', text: errorText(error) })
        } finally {
          setBusy(false)
        }
      }
      const renderComboSkill = (row, side) => h('button', {
        key: `${side}-${row.name}`,
        type: 'button',
        disabled: busy,
        onClick: () => toggleSkill(row.name),
        title: side === 'in' ? T.comboMoveOut : T.comboMoveIn,
        style: {
          display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left',
          font: 'inherit', fontSize: 12, color: TEXT_1, background: 'transparent',
          border: 'none', padding: '6px 8px', borderRadius: 6, cursor: busy ? 'default' : 'pointer',
        },
      },
      h('span', { style: { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, skillLabel(row)),
      h('span', { style: { color: MUTED, flex: '0 0 auto' } }, side === 'in' ? '‹' : '›'))
      const skillPanel = (title, rows, side) => h('div', {
        style: {
          display: 'flex', flexDirection: 'column', gap: 4, padding: 10, borderRadius: 10,
          background: SURFACE, border: `.5px solid ${BORDER}`, minHeight: 120,
        },
      },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, padding: '0 2px 4px' } },
        h('span', { style: { fontSize: 12, fontWeight: 600, color: TEXT_2 } }, title),
        h('span', { style: { fontSize: 11, color: MUTED } }, String(rows.length))),
      rows.length === 0
        ? h('div', { style: { fontSize: 12, color: MUTED, padding: '6px 8px' } }, T.skillsEmpty)
        : groupByProvider(rows).map((group) => h('div', { key: group.key, style: { display: 'flex', flexDirection: 'column' } },
          h('div', { style: { fontSize: 11, color: MUTED, padding: '4px 8px 2px' } }, group.label),
          group.rows.map((row) => renderComboSkill(row, side)))))

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

      const renderDiscoverRow = (skill) => h('div', {
        key: `${skill.folder || skill.name}-${skill.name}`,
        style: {
          display: 'flex', gap: 10, alignItems: 'center', padding: '8px 12px',
          borderTop: `.5px solid ${BORDER}`,
        },
      },
      h('div', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 } },
        h('span', { style: { fontSize: 13, fontWeight: 500, color: TEXT_1 } }, skill.display || skill.name),
        h('span', { style: { fontSize: 12, color: MUTED } }, skill.description || skill.folder || '')),
      h('span', { style: { fontSize: 11, color: MUTED, whiteSpace: 'nowrap' } }, skill.adopted ? T.adopted : skill.adoptable ? '' : skill.registered ? T.loadedSkill : T.unloadedSkill),
      skill.adopted
        ? h(Button, { size: 'sm', variant: 'danger', disabled: busy || scanBusy, onClick: () => removeSkill(skill.folder) }, T.removeSkill)
        : skill.adoptable
          ? h(Button, { size: 'sm', variant: 'ghost', disabled: busy || scanBusy, onClick: () => adoptSkill(skill) }, T.adopt)
          : null)

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
          h('p', { style: { margin: '4px 0 0', fontSize: 13, color: MUTED } }, T.subtitle))),

      loadError ? h('div', { style: { padding: 10, borderRadius: 8, background: SURFACE, color: DANGER } }, `${T.loadFailed}: ${loadError}`) : null,
      note ? h('div', {
        style: {
          padding: '8px 12px', borderRadius: 8, fontSize: 12,
          background: SURFACE, color: note.tone === 'error' ? DANGER : note.tone === 'warn' ? TEXT_1 : TEXT_2,
          border: `.5px solid ${note.tone === 'error' ? DANGER : BORDER}`,
        },
      }, note.text) : null,

      loading && !data ? h('div', { style: { color: MUTED } }, T.applying) : null,

      // detail
      draft ? h('div', {
        style: {
          display: 'flex', flexDirection: 'column', gap: 14, padding: 16, borderRadius: 14,
          background: SURFACE, border: `.5px solid ${BORDER}`,
        },
      },
      !draft.id ? h('input', {
        value: draft.name,
        placeholder: T.sceneName,
        'aria-label': T.sceneName,
        onChange: (event) => setDraft({ ...draft, name: event.target.value }),
        style: {
          width: '100%', height: 34, padding: '0 12px', font: 'inherit', fontSize: 13, boxSizing: 'border-box',
          color: TEXT_1, background: 'transparent', border: `.5px solid ${BORDER_STRONG}`,
          borderRadius: 8, outline: 'none',
        },
      }) : null,

      // toolbar: scene picker on the left, primary actions right-aligned
      h('div', {
        style: {
          display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap',
          padding: '10px 12px', borderRadius: 12,
          background: SURFACE, border: `.5px solid ${BORDER}`,
        },
      },
      h('div', { style: { display: 'flex', gap: 6, alignItems: 'center', flex: '1 1 260px', minWidth: 0 } },
        h('select', {
          value: draft.id || '',
          'aria-label': T.pickScene,
          disabled: busy,
          onChange: (event) => {
            const next = scenes.find((scene) => scene.id === event.target.value)
            if (next) choose(next)
          },
          style: {
            flex: '1 1 200px', minWidth: 150, height: 32, padding: '0 10px', font: 'inherit', fontSize: 13,
            color: TEXT_1, background: SURFACE_2, border: `.5px solid ${BORDER_STRONG}`,
            borderRadius: 8, outline: 'none', cursor: 'pointer',
          },
        },
        scenes.length
          ? scenes.map((scene) => h('option', { key: scene.id, value: scene.id },
            `${scene.id === activeId ? '✓ ' : ''}${scene.name}`))
          : h('option', { key: 'none', value: '' }, T.noScene)),
        draft.id
          ? h(Button, {
            onClick: () => setRenaming({ scene: selectedScene || draft, value: draft.name }),
            size: 'sm', variant: 'ghost', disabled: busy, title: T.rename,
          }, '✎')
          : null,
        dirty
          ? h('span', { style: { fontSize: 11, color: MUTED, border: `.5px solid ${BORDER_STRONG}`, borderRadius: 999, padding: '2px 8px', whiteSpace: 'nowrap' } }, T.unsaved)
          : h('span', { style: { fontSize: 11, color: MUTED, whiteSpace: 'nowrap' } }, T.saved)),
      h('div', { style: { display: 'flex', gap: 8, alignItems: 'center', marginLeft: 'auto' } },
        h(Button, { onClick: newScene, size: 'sm', variant: 'ghost', disabled: busy }, `+ ${T.newScene}`),
        h(Button, { onClick: saveDraft, variant: 'primary', size: 'sm', disabled: busy || !dirty }, T.save),
        h(Button, {
          onClick: () => startApply(draft.id ? selectedScene : { ...draft, id: '' }),
          variant: 'primary',
          disabled: busy || !draft.id || runningChats.length > 0,
          size: 'sm',
          title: runningChats.length > 0 ? T.sessionsBusy(runningNames) : undefined,
        }, busy ? T.applying : T.apply))),

      // secondary actions, right-aligned on their own row
      h('div', { style: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' } },
        h(Button, { onClick: editScene, disabled: busy || !draft.id, size: 'sm', variant: 'ghost' }, T.edit),
        h(Button, { onClick: () => copyScene(selectedScene || draft), disabled: busy || !draft.id, size: 'sm', variant: 'ghost' }, T.ctxCopy),
        h(Button, { onClick: () => load(false), disabled: busy, size: 'sm', variant: 'ghost' }, T.refresh),
        h(Button, {
          onClick: runUndo,
          disabled: busy || !data || !data.lastApplied || runningChats.length > 0,
          size: 'sm',
          variant: 'ghost',
          title: runningChats.length > 0 ? T.sessionsBusy(runningNames) : undefined,
        }, T.undo),
        h(Button, { onClick: removeScene, variant: 'danger', disabled: busy || !draft.id, size: 'sm' }, T.remove)),

      // four editing steps: plugins, MCP servers, skills, discovery
      h('div', { style: { display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' } },
        h(Button, { onClick: () => setStep('plugins'), size: 'sm', variant: step === 'plugins' ? 'primary' : 'ghost' }, T.stepPlugins),
        h(Button, { onClick: () => setStep('mcp'), size: 'sm', variant: step === 'mcp' ? 'primary' : 'ghost' }, T.stepMcp),
        h(Button, { onClick: () => setStep('skills'), size: 'sm', variant: step === 'skills' ? 'primary' : 'ghost' }, T.stepSkills),
        h(Button, { onClick: () => setStep('notes'), size: 'sm', variant: step === 'notes' ? 'primary' : 'ghost' }, T.stepNotes),
        h(Button, { onClick: () => setStep('discover'), size: 'sm', variant: step === 'discover' ? 'primary' : 'ghost' }, T.stepDiscover),
        h('div', { style: { flex: 1 } }),
        step === 'skills'
          ? h('span', { style: { fontSize: 11, color: MUTED } }, `${T.skillCount(skillOnCount, skillsInventory.length)} · ${T.skillsHint}`)
          : step === 'mcp'
            ? h('span', { style: { fontSize: 11, color: MUTED } }, `${T.mcpCount(mcpOnCount, mcpInventory.length)} · ${T.mcpHint}`)
            : step === 'notes'
              ? h('span', { style: { fontSize: 11, color: MUTED } }, `${T.notesCount(draftNotes.length, notes.length)} · ${T.notesHint}`)
              : null),

      runningChats.length > 0
        ? h('div', { style: { fontSize: 12, color: MUTED } }, T.sessionsBusy(runningNames))
        : null,

      !draft.id ? h('div', { style: { fontSize: 12, color: MUTED } }, T.emptyHint) : null,

      // sections — step 1 mirrors the official page, step 2 MCP servers, step 3 skills
      step === 'skills'
        ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 } },
          h('div', {
            style: {
              display: 'flex', flexDirection: 'column', gap: 8,
              padding: '10px 12px', borderRadius: 10, background: SURFACE, border: `.5px solid ${BORDER}`,
            },
          },
          h('div', { style: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' } },
            h('span', { style: { fontSize: 12, fontWeight: 600, color: TEXT_2, flex: '0 0 auto' } }, T.comboTitle),
            h('select', {
              value: (draft && draft.comboId) || '',
              'aria-label': T.comboPick,
              disabled: busy || combos.length === 0,
              onChange: (event) => loadCombo(event.target.value),
              style: {
                flex: '1 1 180px', minWidth: 140, height: 30, padding: '0 8px', font: 'inherit', fontSize: 12,
                color: TEXT_1, background: SURFACE_2, border: `.5px solid ${BORDER_STRONG}`,
                borderRadius: 8, outline: 'none', cursor: 'pointer',
              },
            },
            combos.length
              ? combos.map((combo) => h('option', { key: combo.id, value: combo.id }, combo.name))
              : h('option', { key: 'none', value: '' }, T.comboNone)),
            h('div', { style: { display: 'flex', gap: 8, alignItems: 'center', marginLeft: 'auto' } },
              h(Button, { onClick: () => setComboForm({ id: '', value: (draft && draft.name) || '' }), size: 'sm', variant: 'ghost', disabled: busy || !draft }, T.comboSave),
              comboSelected ? h(Button, { onClick: () => setComboForm({ id: comboSelected.id, value: comboSelected.name }), size: 'sm', variant: 'ghost', disabled: busy }, T.comboUpdate) : null,
              comboSelected ? h(Button, { onClick: () => setComboForm({ id: '', value: `${comboSelected.name}${T.dupSuffix}` }), size: 'sm', variant: 'ghost', disabled: busy }, T.comboCopy) : null)),
          h('div', { style: { display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap' } },
            h(Button, { onClick: () => setAllSkills(true), size: 'sm', variant: 'ghost', disabled: busy || !draft }, T.enableAll),
            h(Button, { onClick: () => setAllSkills(false), size: 'sm', variant: 'ghost', disabled: busy || !draft }, T.disableAll),
            comboSelected ? h(Button, { onClick: () => removeCombo(comboSelected.id), size: 'sm', variant: 'danger', disabled: busy }, T.comboDelete) : null)),
          h('div', { style: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 10, alignItems: 'start' } },
            skillPanel(T.availableSkills, skillsInventory.filter((row) => disabledSkills.includes(row.name)), 'out'),
            skillPanel(T.selectedSkills, skillsInventory.filter((row) => !disabledSkills.includes(row.name)), 'in')))
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
        : step === 'notes'
        ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
          h('div', {
            style: {
              display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap',
              padding: '10px 12px', borderRadius: 10, background: SURFACE, border: `.5px solid ${BORDER}`,
            },
          },
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 } },
            h('span', { style: { fontSize: 12, fontWeight: 600, color: TEXT_2 } }, T.notesTitle),
            h('span', { style: { fontSize: 11, color: MUTED } }, T.notesHint)),
          h('div', { style: { marginLeft: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' } },
            h(Button, { onClick: () => setNoteForm({ id: '', name: '', body: '' }), size: 'sm', disabled: busy || !draft }, T.noteNew),
            h(Button, { onClick: () => setAllNotes(true), size: 'sm', variant: 'ghost', disabled: busy || !draft || notes.length === 0 }, T.enableAll),
            h(Button, { onClick: () => setAllNotes(false), size: 'sm', variant: 'ghost', disabled: busy || !draft || notes.length === 0 }, T.disableAll))),
          notes.length === 0
            ? h('div', { style: { fontSize: 12, color: MUTED, padding: '6px 4px' } }, T.notesEmpty)
            : notes.map((item) => h('div', {
              key: item.id,
              style: { display: 'flex', alignItems: 'flex-start', gap: 8 },
            },
            h('div', { style: { flex: '1 1 auto', minWidth: 0 } },
              h(Row, {
                row: { name: item.id, title: item.name, description: String(item.body || '').replace(/\s+/g, ' ').slice(0, 160) },
                checked: draftNotes.includes(item.id),
                noSwitch: !draft || busy,
                onToggle: () => toggleNote(item.id),
              })),
            h('div', { style: { flex: '0 0 auto', paddingTop: 10 } },
              h(Button, { size: 'sm', variant: 'ghost', disabled: busy, onClick: () => setNoteForm({ id: item.id, name: item.name, body: item.body || '' }) }, T.noteEdit)))))
        : step === 'discover'
        ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 } },
          h('div', {
            style: {
              display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap',
              padding: '10px 12px', borderRadius: 10, background: SURFACE, border: `.5px solid ${BORDER}`,
            },
          },
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: 2 } },
            h('span', { style: { fontSize: 12, fontWeight: 600, color: TEXT_2 } }, T.discoverTitle),
            h('span', { style: { fontSize: 11, color: MUTED } }, T.discoverHint)),
          h('div', { style: { marginLeft: 'auto' } },
            h(Button, { onClick: runScan, size: 'sm', variant: 'ghost', disabled: scanBusy }, scanBusy ? T.scanning : T.rescan))),
          !scan
            ? h(Section, { title: T.discoverTitle }, h('div', { style: { fontSize: 12, color: MUTED } }, scanBusy ? T.scanning : T.discoverEmpty))
            : [
              (scan.sceneSkills || []).length
                ? h(Section, {
                  key: 'scene-skills',
                  title: T.sceneSkills,
                  hint: scan.sceneDir || T.sceneDir,
                  action: h('span', { style: { fontSize: 11, color: MUTED } }, String((scan.sceneSkills || []).length)),
                }, scan.sceneSkills.map((skill) => renderDiscoverRow({ ...skill, adopted: true })))
                : null,
              ...scan.roots.map((root) => h(Section, {
                key: root.path,
                title: root.label,
                hint: root.path,
                action: h('span', { style: { fontSize: 11, color: MUTED } }, root.exists ? String(root.skills.length) : T.rootMissing),
              }, root.exists && root.skills.length
                ? root.skills.map((skill) => renderDiscoverRow(skill))
                : null)),
              ...scan.provided.map((group) => h(Section, {
                key: group.provider,
                title: originLabel(group.provider),
                hint: T.providedBy,
                action: h('span', { style: { fontSize: 11, color: MUTED } }, String(group.skills.length)),
              }, group.skills.map((skill) => h(Row, {
                key: skill.name,
                row: { title: skill.name, name: skill.name, description: skill.description || '' },
                noSwitch: true,
                switchHint: T.loadedSkill,
              })))),
              h('div', { style: { fontSize: 11, color: MUTED } }, T.scanNote),
            ])
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
      })) : null,

      // combo name dialog (save / update / duplicate)
      comboForm ? h(Modal, {
        title: comboForm.id ? T.comboUpdate : T.comboSave,
        onClose: () => setComboForm(null),
        footer: [
          h(Button, { key: 'cancel', onClick: () => setComboForm(null), variant: 'ghost' }, T.cancel),
          h(Button, { key: 'ok', onClick: submitCombo, variant: 'primary', disabled: busy }, T.save),
        ],
      },
      h('input', {
        value: comboForm.value,
        placeholder: T.comboName,
        'aria-label': T.comboName,
        autoFocus: true,
        onChange: (event) => setComboForm({ ...comboForm, value: event.target.value }),
        onKeyDown: (event) => { if (event.key === 'Enter') submitCombo() },
        style: {
          width: '100%', height: 34, padding: '0 12px', font: 'inherit', fontSize: 13, boxSizing: 'border-box',
          color: TEXT_1, background: 'transparent', border: `.5px solid ${BORDER_STRONG}`,
          borderRadius: 8, outline: 'none',
        },
      }),
      h('p', { style: { margin: '8px 0 0', fontSize: 12, color: MUTED } }, `${T.comboTitle} · ${skillOnNames.length}`)) : null,

      noteForm ? h(Modal, {
        title: noteForm.id ? T.noteEdit : T.noteNew,
        onClose: () => setNoteForm(null),
        footer: [
          noteForm.id ? h(Button, { key: 'del', onClick: () => removeNote(noteForm.id), variant: 'danger' }, T.noteDelete) : null,
          h(Button, { key: 'cancel', onClick: () => setNoteForm(null), variant: 'ghost' }, T.cancel),
          h(Button, { key: 'ok', onClick: submitNote, variant: 'primary', disabled: busy }, T.save),
        ],
      },
      h('input', {
        value: noteForm.name,
        placeholder: T.noteName,
        'aria-label': T.noteName,
        autoFocus: true,
        onChange: (event) => setNoteForm({ ...noteForm, name: event.target.value }),
        style: {
          width: '100%', height: 34, padding: '0 12px', font: 'inherit', fontSize: 13, boxSizing: 'border-box',
          color: TEXT_1, background: 'transparent', border: `.5px solid ${BORDER_STRONG}`,
          borderRadius: 8, outline: 'none',
        },
      }),
      h('textarea', {
        value: noteForm.body,
        placeholder: T.noteBody,
        'aria-label': T.noteBody,
        rows: 8,
        onChange: (event) => setNoteForm({ ...noteForm, body: event.target.value }),
        style: {
          width: '100%', minHeight: 140, marginTop: 8, padding: '8px 12px', font: 'inherit', fontSize: 13,
          boxSizing: 'border-box', color: TEXT_1, background: 'transparent', border: `.5px solid ${BORDER_STRONG}`,
          borderRadius: 8, outline: 'none', resize: 'vertical', lineHeight: 1.5,
        },
      }),
      h('p', { style: { margin: '8px 0 0', fontSize: 12, color: MUTED } }, T.notesHint)) : null)
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
