/**
 * Shadow Realms — Step 5 UI: Battle Realms-style footer and control panels.
 *
 * Pure local UI module. No network, storage, backend, or framework.
 * Creates a bottom footer for desktop and a right-side tool pad for mobile.
 *
 * Usage:
 *   import { CommandFooter } from './ui/CommandFooter.js'
 *   const ui = new CommandFooter({
 *     root: document.body,
 *     onAction: (action, payload) => console.log(action, payload),
 *   })
 *   ui.mount()
 *   ui.setResources({ rice: 120, wood: 40, villagers: 1, selected: 'Farmer' })
 */

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
const MODES = ['select', 'move', 'harvest', 'build']
const LOCALES = {
  en: {resources:'Resources',rice:'Rice',wood:'Wood',villagers:'Villagers',commands:'Commands',
    selection:'Selection',select:'Select',move:'Move',harvest:'Harvest',build:'Build',
    farmer:'Farmer',spawn:'Spawn Farmer',field:'Go Field',return:'Return',
    house:'House',barn:'Barn',cancel:'Cancel',ready:'Ready for command',touch:'Touch Control',
    touchNote:'Use these buttons instead of right-click.',hint:'Left click select • Right click move'},
  km: {resources:'ធនធាន',rice:'ស្រូវ',wood:'ឈើ',villagers:'កសិករ',commands:'បញ្ជា',
    selection:'ការជ្រើសរើស',select:'ជ្រើសរើស',move:'ផ្លាស់ទី',harvest:'ប្រមូលផល',build:'សាងសង់',
    farmer:'កសិករ',spawn:'បន្ថែមកសិករ',field:'ទៅវាលស្រែ',return:'ត្រឡប់',
    house:'ផ្ទះ',barn:'ឃ្លាំង',cancel:'បោះបង់',ready:'រង់ចាំបញ្ជា',touch:'បញ្ជាប៉ះ',
    touchNote:'ប្រើប៊ូតុងនេះជំនួសចុចកណ្ដុរស្ដាំ',hint:'ចុចឆ្វេងជ្រើសរើស • ចុចស្ដាំផ្លាស់ទី'},
  zh: {resources:'资源',rice:'稻米',wood:'木材',villagers:'村民',commands:'命令',
    selection:'选择',select:'选择',move:'移动',harvest:'收获',build:'建造',
    farmer:'农民',spawn:'添加农民',field:'去稻田',return:'返回',
    house:'房屋',barn:'仓库',cancel:'取消',ready:'等待命令',touch:'触控',
    touchNote:'使用按钮代替鼠标右键',hint:'左键选择 • 右键移动'},
  ja: {resources:'資源',rice:'米',wood:'木材',villagers:'村人',commands:'指示',
    selection:'選択',select:'選択',move:'移動',harvest:'収穫',build:'建設',
    farmer:'農民',spawn:'農民を追加',field:'田んぼへ',return:'戻る',
    house:'家',barn:'倉庫',cancel:'取消',ready:'指示待ち',touch:'タッチ操作',
    touchNote:'右クリックの代わりに操作ボタンを使用',hint:'左クリックで選択 • 右クリックで移動'},
  ko: {resources:'자원',rice:'쌀',wood:'나무',villagers:'주민',commands:'명령',
    selection:'선택',select:'선택',move:'이동',harvest:'수확',build:'건설',
    farmer:'농부',spawn:'농부 추가',field:'논으로',return:'귀환',
    house:'집',barn:'창고',cancel:'취소',ready:'명령 대기',touch:'터치 조작',
    touchNote:'오른쪽 클릭 대신 버튼 사용',hint:'왼쪽 클릭 선택 • 오른쪽 클릭 이동'},
};

function el(tag, className = '', text = '') {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text) node.textContent = text
  return node
}

function button(label, icon, action, title = '') {
  const node = el('button', 'sr-ui-btn')
  node.type = 'button'
  node.dataset.action = action
  node.innerHTML = `
    <span class="sr-ui-btn-icon">${icon}</span>
    <span class="sr-ui-btn-label">${label}</span>
  `
  if (title) node.title = title
  return node
}

export class CommandFooter {
  constructor({ root = document.body, onAction = null } = {}) {
    this.root = root
    this.onAction = typeof onAction === 'function' ? onAction : null
    const language = String(document.documentElement?.lang || 'en').split('-')[0]
    this.language = Object.hasOwn(LOCALES, language) ? language : 'en'
    this.translations = LOCALES[this.language]
    this.state = {
      rice: 0,
      wood: 0,
      villagers: 0,
      selected: 'None',
      mode: 'select',
      hint: this.translations.hint,
      zoom: 100,
      touchMode: 'select',
    }

    this.nodes = {}
    this.handleClick = event => this.#onClick(event)
  }

  #localize(shell) {
    const t = this.translations
    const put = (selector, label) => {
      const element = shell.querySelector(selector)
      if (element && typeof label === 'string') element.textContent = label
    }
    const headings = shell.querySelectorAll('.sr-ui-title')
    ;[t.resources, t.commands, t.selection].forEach((value, index) => {
      if (headings[index]) headings[index].textContent = value
    })
    const resourceLabels = shell.querySelectorAll('.sr-ui-resource-label')
    ;[t.rice, t.wood, t.villagers].forEach((value, index) => {
      if (resourceLabels[index]) resourceLabels[index].textContent = value
    })
    const groups = shell.querySelectorAll('.sr-ui-group-label')
    if (groups[0]) groups[0].textContent = t.farmer
    if (groups[1]) groups[1].textContent = t.build
    for (const button of shell.querySelectorAll('[data-mode]')) {
      button.textContent = t[button.dataset.mode] || button.textContent
    }
    for (const button of shell.querySelectorAll('[data-touch]')) {
      button.textContent = t[button.dataset.touch] || button.textContent
    }
    const commands = {
      spawnFarmer: t.spawn, sendToField: t.field, returnHome: t.return,
      ghostHouse: t.house, ghostBarn: t.barn, cancelBuild: t.cancel,
    }
    for (const button of shell.querySelectorAll('[data-action]')) {
      if (commands[button.dataset.action]) button.textContent = commands[button.dataset.action]
    }
    put('.sr-ui-topbar-text', 'Chibi Strategy')
    put('.sr-ui-selected-sub', t.ready)
    put('.sr-ui-mobile-title', t.touch)
    put('.sr-ui-mobile-note', t.touchNote)
    put('.sr-ui-hint', t.hint)
    const zoomIn = shell.querySelector('[data-action="zoomIn"]')
    const zoomOut = shell.querySelector('[data-action="zoomOut"]')
    if (zoomIn) zoomIn.setAttribute('aria-label', 'Zoom in')
    if (zoomOut) zoomOut.setAttribute('aria-label', 'Zoom out')
  }

  mount() {
    if (this.nodes.shell?.isConnected) return this
    this.#injectStyles()
    const shell = el('div', 'sr-ui-shell')
    shell.innerHTML = `
      <div class="sr-ui-topbar">
        <div class="sr-ui-badge">Shadow Realms</div>
        <div class="sr-ui-topbar-text">Step 5 • Footer + Controls</div>
      </div>

      <div class="sr-ui-footer">
        <section class="sr-ui-panel sr-ui-panel--left">
          <div class="sr-ui-title">Resources</div>
          <div class="sr-ui-resource-grid">
            <div class="sr-ui-resource-card">
              <span class="sr-ui-resource-icon">🌾</span>
              <div><div class="sr-ui-resource-label">Rice</div><div class="sr-ui-resource-value" data-bind="rice">0</div></div>
            </div>
            <div class="sr-ui-resource-card">
              <span class="sr-ui-resource-icon">🪵</span>
              <div><div class="sr-ui-resource-label">Wood</div><div class="sr-ui-resource-value" data-bind="wood">0</div></div>
            </div>
            <div class="sr-ui-resource-card">
              <span class="sr-ui-resource-icon">👨‍🌾</span>
              <div><div class="sr-ui-resource-label">Villagers</div><div class="sr-ui-resource-value" data-bind="villagers">0</div></div>
            </div>
          </div>
        </section>

        <section class="sr-ui-panel sr-ui-panel--center">
          <div class="sr-ui-title">Commands</div>
          <div class="sr-ui-command-row">
            <button type="button" class="sr-ui-mode-chip is-active" data-mode="select">Select</button>
            <button type="button" class="sr-ui-mode-chip" data-mode="move">Move</button>
            <button type="button" class="sr-ui-mode-chip" data-mode="harvest">Harvest</button>
            <button type="button" class="sr-ui-mode-chip" data-mode="build">Build</button>
          </div>
          <div class="sr-ui-actions">
            <div class="sr-ui-action-group">
              <div class="sr-ui-group-label">Farmer</div>
              <div class="sr-ui-action-list">
                <button type="button" class="sr-ui-square-btn" data-action="spawnFarmer">Spawn Farmer</button>
                <button type="button" class="sr-ui-square-btn" data-action="sendToField">Go Field</button>
                <button type="button" class="sr-ui-square-btn" data-action="returnHome">Return</button>
              </div>
            </div>
            <div class="sr-ui-action-group">
              <div class="sr-ui-group-label">Build</div>
              <div class="sr-ui-action-list">
                <button type="button" class="sr-ui-square-btn" data-action="ghostHouse">House</button>
                <button type="button" class="sr-ui-square-btn" data-action="ghostBarn">Barn</button>
                <button type="button" class="sr-ui-square-btn" data-action="cancelBuild">Cancel</button>
              </div>
            </div>
          </div>
        </section>

        <section class="sr-ui-panel sr-ui-panel--right">
          <div class="sr-ui-title">Selection</div>
          <div class="sr-ui-selected-card">
            <div class="sr-ui-selected-name" data-bind="selected">None</div>
            <div class="sr-ui-selected-sub">Ready for command</div>
          </div>
          <div class="sr-ui-minimap">
            <div class="sr-ui-minimap-grid"></div>
            <div class="sr-ui-minimap-camera"></div>
          </div>
          <div class="sr-ui-zoom-row">
            <button type="button" class="sr-ui-zoom-btn" data-action="zoomOut">−</button>
            <div class="sr-ui-zoom-value" data-bind="zoom">100%</div>
            <button type="button" class="sr-ui-zoom-btn" data-action="zoomIn">＋</button>
          </div>
        </section>
      </div>

      <div class="sr-ui-hint" data-bind="hint">Left click select • Right click move</div>

      <div class="sr-ui-mobile-pad">
        <div class="sr-ui-mobile-title">Touch Control</div>
        <div class="sr-ui-mobile-buttons">
          <button type="button" class="sr-ui-mobile-btn is-active" data-touch="select">Select</button>
          <button type="button" class="sr-ui-mobile-btn" data-touch="move">Move</button>
          <button type="button" class="sr-ui-mobile-btn" data-touch="harvest">Harvest</button>
          <button type="button" class="sr-ui-mobile-btn" data-touch="build">Build</button>
        </div>
        <div class="sr-ui-mobile-note">Use this panel instead of mouse right click.</div>
      </div>
    `

    this.#localize(shell)
    this.nodes.shell = shell
    this.nodes.bindings = Object.fromEntries(
      [...shell.querySelectorAll('[data-bind]')].map(node => [node.dataset.bind, node])
    )
    this.nodes.modeButtons = [...shell.querySelectorAll('[data-mode]')]
    this.nodes.touchButtons = [...shell.querySelectorAll('[data-touch]')]
    this.nodes.footer = shell.querySelector('.sr-ui-footer')
    shell.addEventListener('click', this.handleClick)
    this.root.appendChild(shell)
    this.render()
    return this
  }

  destroy() {
    this.nodes.shell?.removeEventListener('click', this.handleClick)
    this.nodes.shell?.remove()
    this.nodes = {}
  }

  setResources({ rice, wood, villagers, selected, hint, zoom } = {}) {
    if (Number.isFinite(rice)) this.state.rice = Math.max(0, Math.round(rice))
    if (Number.isFinite(wood)) this.state.wood = Math.max(0, Math.round(wood))
    if (Number.isFinite(villagers)) this.state.villagers = Math.max(0, Math.round(villagers))
    if (typeof selected === 'string') this.state.selected = selected
    if (typeof hint === 'string') this.state.hint = hint
    if (Number.isFinite(zoom)) this.state.zoom = clamp(Math.round(zoom * 100), 60, 220)
    this.render()
  }

  setMode(mode) {
    this.state.mode = MODES.includes(mode) ? mode : 'select'
    this.render()
    this.onAction?.('mode', { mode: this.state.mode })
  }

  setTouchMode(mode) {
    this.state.touchMode = MODES.includes(mode) ? mode : 'select'
    this.render()
    this.onAction?.('touchMode', { mode: this.state.touchMode })
  }

  render() {
    const b = this.nodes.bindings || {}
    if (b.rice) b.rice.textContent = String(this.state.rice)
    if (b.wood) b.wood.textContent = String(this.state.wood)
    if (b.villagers) b.villagers.textContent = String(this.state.villagers)
    if (b.selected) b.selected.textContent = this.state.selected
    if (b.hint) b.hint.textContent = this.state.hint
    if (b.zoom) b.zoom.textContent = `${this.state.zoom}%`

    for (const node of this.nodes.modeButtons || []) {
      const active = node.dataset.mode === this.state.mode
      node.classList.toggle('is-active', active)
      node.setAttribute('aria-pressed', String(active))
    }
    for (const node of this.nodes.touchButtons || []) {
      const active = node.dataset.touch === this.state.touchMode
      node.classList.toggle('is-active', active)
      node.setAttribute('aria-pressed', String(active))
    }
  }

  #onClick(event) {
    const target = event?.target
    if (!target?.closest || !this.nodes.shell?.contains(target)) return
    const button = target.closest('button')
    if (!button || button.disabled) return
    const actionNode = button.closest('[data-action]')
    if (actionNode) {
      this.onAction?.(actionNode.dataset.action, {})
      return
    }

    const modeNode = button.closest('[data-mode]')
    if (modeNode) {
      this.setMode(modeNode.dataset.mode)
      return
    }

    const touchNode = button.closest('[data-touch]')
    if (touchNode) {
      this.setTouchMode(touchNode.dataset.touch)
    }
  }

  #injectStyles() {
    if (document.getElementById('sr-command-footer-style')) return
    const style = document.createElement('style')
    style.id = 'sr-command-footer-style'
    style.textContent = `
      .sr-ui-shell{position:fixed;inset:0;pointer-events:none;font-family:Inter,system-ui,sans-serif;color:#f8fafc;z-index:30}
      .sr-ui-shell *{box-sizing:border-box}
      .sr-ui-topbar{position:absolute;top:12px;left:12px;display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:14px;background:rgba(17,24,39,.78);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.08)}
      .sr-ui-badge{padding:4px 10px;border-radius:999px;background:#f6b800;color:#111827;font-weight:800;font-size:12px}
      .sr-ui-topbar-text{font-size:12px;color:rgba(255,255,255,.78)}
      .sr-ui-footer{position:absolute;left:0;right:0;bottom:0;display:grid;grid-template-columns:1.05fr 1.45fr 1fr;gap:10px;padding:12px;background:linear-gradient(to top,rgba(13,15,22,.95),rgba(13,15,22,.72));pointer-events:auto;border-top:1px solid rgba(255,255,255,.08)}
      .sr-ui-panel{min-height:168px;border-radius:18px;padding:12px 14px;background:rgba(19,25,36,.88);border:1px solid rgba(255,255,255,.08);box-shadow:0 14px 24px rgba(0,0,0,.25)}
      .sr-ui-title{font-size:13px;font-weight:800;letter-spacing:.02em;text-transform:uppercase;color:#f6e6ab;margin-bottom:10px}
      .sr-ui-resource-grid{display:grid;gap:8px}
      .sr-ui-resource-card{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.05)}
      .sr-ui-resource-icon{font-size:20px}
      .sr-ui-resource-label{font-size:11px;color:rgba(255,255,255,.62)}
      .sr-ui-resource-value{font-size:18px;font-weight:900;line-height:1.1}
      .sr-ui-command-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}
      .sr-ui-mode-chip{pointer-events:auto;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.06);color:#f8fafc;padding:8px 12px;border-radius:999px;font-size:12px;font-weight:700;cursor:pointer}
      .sr-ui-mode-chip.is-active{background:#f6b800;color:#111827;border-color:#f6b800}
      .sr-ui-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      .sr-ui-action-group{padding:10px;border-radius:14px;background:rgba(255,255,255,.04)}
      .sr-ui-group-label{font-size:11px;font-weight:800;color:rgba(255,255,255,.65);text-transform:uppercase;margin-bottom:8px}
      .sr-ui-action-list{display:grid;grid-template-columns:repeat(1,minmax(0,1fr));gap:8px}
      .sr-ui-square-btn{pointer-events:auto;border:1px solid rgba(255,255,255,.08);background:rgba(35,47,63,.9);color:#f8fafc;padding:11px 12px;border-radius:12px;font-size:12px;font-weight:700;cursor:pointer}
      .sr-ui-square-btn:hover,.sr-ui-zoom-btn:hover,.sr-ui-mobile-btn:hover{filter:brightness(1.08)}
      .sr-ui-selected-card{padding:12px;border-radius:14px;background:linear-gradient(135deg,rgba(246,184,0,.2),rgba(255,255,255,.04));border:1px solid rgba(246,184,0,.34)}
      .sr-ui-selected-name{font-size:18px;font-weight:900}
      .sr-ui-selected-sub{font-size:12px;color:rgba(255,255,255,.62);margin-top:4px}
      .sr-ui-minimap{margin-top:10px;height:74px;border-radius:14px;position:relative;overflow:hidden;background:linear-gradient(135deg,#56753b,#76a457);border:1px solid rgba(255,255,255,.08)}
      .sr-ui-minimap-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px);background-size:18px 18px}
      .sr-ui-minimap-camera{position:absolute;left:34%;top:26%;width:32%;height:36%;border:2px solid #f6b800;border-radius:8px;background:rgba(246,184,0,.12)}
      .sr-ui-zoom-row{display:flex;align-items:center;justify-content:center;gap:10px;margin-top:10px}
      .sr-ui-zoom-btn{pointer-events:auto;width:36px;height:36px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:rgba(35,47,63,.9);color:#f8fafc;font-size:20px;cursor:pointer}
      .sr-ui-zoom-value{min-width:54px;text-align:center;font-size:12px;font-weight:800;color:#f6e6ab}
      .sr-ui-hint{position:absolute;left:50%;bottom:188px;transform:translateX(-50%);padding:9px 14px;border-radius:999px;background:rgba(17,24,39,.8);border:1px solid rgba(255,255,255,.08);font-size:12px;pointer-events:none}
      .sr-ui-mobile-pad{position:absolute;right:12px;top:74px;width:126px;padding:10px;border-radius:18px;background:rgba(17,24,39,.86);border:1px solid rgba(255,255,255,.08);pointer-events:auto;display:none}
      .sr-ui-mobile-title{font-size:11px;font-weight:800;color:#f6e6ab;text-transform:uppercase;margin-bottom:8px}
      .sr-ui-mobile-buttons{display:grid;gap:8px}
      .sr-ui-mobile-btn{border:1px solid rgba(255,255,255,.08);background:rgba(35,47,63,.92);color:#f8fafc;padding:10px;border-radius:12px;font-size:12px;font-weight:700;cursor:pointer}
      .sr-ui-mobile-btn.is-active{background:#f6b800;color:#111827;border-color:#f6b800}
      .sr-ui-mobile-note{margin-top:8px;font-size:10px;line-height:1.4;color:rgba(255,255,255,.56)}
      .sr-ui-shell button:focus-visible{outline:2px solid #ffdc75;outline-offset:2px}
      .sr-ui-shell button:disabled{opacity:.4;cursor:not-allowed}
      @media (max-width:980px){
        .sr-ui-footer{grid-template-columns:1fr;gap:8px;padding:10px}
        .sr-ui-panel--center{order:3}
        .sr-ui-panel--right{order:2}
        .sr-ui-hint{bottom:282px;width:min(calc(100% - 16px),420px);text-align:center}
      }
      @media (max-width:760px){
        .sr-ui-topbar{left:10px;right:10px;top:10px;justify-content:space-between}
        .sr-ui-footer{padding-right:146px}
        .sr-ui-mobile-pad{display:block}
        .sr-ui-panel--center .sr-ui-actions{grid-template-columns:1fr}
      }
    `
    document.head.appendChild(style)
  }
}

export default CommandFooter
