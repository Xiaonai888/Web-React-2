/**
 * Shadow Realms — Stage 1, step 6: selection and command input.
 *
 * Browser-only module: no requests, database, storage, or extra assets.
 * Matches GameEngine.onWorldPointer / onRender and CommandFooter.onAction.
 *
 * Usage (in a LATER integration step, not required in this file):
 *   const selection = new SelectionController({
 *     engine,
 *     footer,
 *     getUnits: () => farmers,    // { id, x, y, team: 'blue', name, radius }
 *     onCommand: ({ type, unitIds, point }) => farmerSystem.order(type, unitIds, point),
 *   }).attach();
 *
 * Desktop: left click = select; Shift + click = add/remove;
 *          left drag = group select; right click = move command.
 * Mobile: tap = select or issue the active right-panel command.
 * The actual unit movement/harvesting/construction belongs to future systems.
 */

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
const sameIds = (a, b) => a.length === b.length && a.every((id, i) => id === b[i])
const hasPosition = u => Number.isFinite(u?.x) && Number.isFinite(u?.y)

export class SelectionController {
  constructor({
    engine,
    footer = null,
    getUnits = () => [],
    onSelectionChange = null,
    onCommand = null,
    onAction = null,
    playerTeam = 'blue',
  } = {}) {
    if (!engine?.canvas || !engine?.camera || !engine?.map) {
      throw new Error('SelectionController requires an existing GameEngine.')
    }
    this.engine = engine
    this.footer = footer
    this.getUnits = typeof getUnits === 'function' ? getUnits : () => getUnits
    this.onSelectionChange = onSelectionChange
    this.onCommand = onCommand
    this.onAction = onAction
    this.playerTeam = playerTeam
    this.ids = []
    this.mode = 'select'
    this.touchMode = 'select'
    this.drag = null
    this.lastOrder = null
    this.active = false
    this.original = {}

    this.pointerDown = e => this.handleDown(e)
    this.pointerMove = e => this.handleMove(e)
    this.pointerUp = e => this.handleUp(e)
    this.pointerCancel = () => { this.drag = null }
  }

  units() {
    const list = this.getUnits()
    return Array.isArray(list) ? list.filter(hasPosition) : []
  }

  canSelect(u) {
    if (u.id === undefined || u.id === null || u.selectable === false ||
        u.alive === false || (Number.isFinite(u.hp) && u.hp <= 0)) return false
    const team = u.team ?? u.faction ?? u.side
    return team == null || team === this.playerTeam
  }

  selectableUnits() { return this.units().filter(u => this.canSelect(u)) }

  selectedUnits() {
    const ids = new Set(this.ids)
    return this.selectableUnits().filter(u => ids.has(u.id))
  }

  getSelectedIds() { return [...this.ids] }

  attach() {
    if (this.active) return this
    const engine = this.engine
    this.original.pointer = engine.onWorldPointer
    this.original.render = engine.onRender
    this.boundPointer = (event, instance) => {
      this.original.pointer?.(event, instance)
      this.handleWorldPointer(event)
    }
    this.boundRender = (ctx, camera, map, instance) => {
      this.original.render?.(ctx, camera, map, instance)
      this.draw(ctx, camera)
    }
    engine.onWorldPointer = this.boundPointer
    engine.onRender = this.boundRender

    // Independent mouse drag-box tracking; leaves camera drag/pinch to GameEngine.
    const canvas = engine.canvas
    canvas.addEventListener('pointerdown', this.pointerDown)
    canvas.addEventListener('pointermove', this.pointerMove)
    canvas.addEventListener('pointerup', this.pointerUp)
    canvas.addEventListener('pointercancel', this.pointerCancel)
    canvas.addEventListener('lostpointercapture', this.pointerCancel)

    if (this.footer) {
      this.original.footerAction = this.footer.onAction
      this.boundAction = (action, payload) => {
        this.handleFooterAction(action, payload)
        this.original.footerAction?.(action, payload)
      }
      this.footer.onAction = this.boundAction
      this.mode = this.footer.state?.mode || 'select'
      this.touchMode = this.footer.state?.touchMode || 'select'
    }
    this.active = true
    this.syncFooter()
    return this
  }

  detach() {
    if (!this.active) return this
    const engine = this.engine
    const canvas = engine.canvas
    canvas.removeEventListener('pointerdown', this.pointerDown)
    canvas.removeEventListener('pointermove', this.pointerMove)
    canvas.removeEventListener('pointerup', this.pointerUp)
    canvas.removeEventListener('pointercancel', this.pointerCancel)
    canvas.removeEventListener('lostpointercapture', this.pointerCancel)
    if (engine.onWorldPointer === this.boundPointer) {
      engine.onWorldPointer = this.original.pointer
    }
    if (engine.onRender === this.boundRender) engine.onRender = this.original.render
    if (this.footer && this.footer.onAction === this.boundAction) {
      this.footer.onAction = this.original.footerAction
    }
    this.drag = null
    this.active = false
    return this
  }

  destroy() { this.detach(); this.ids = []; this.lastOrder = null }

  setMode(mode) {
    this.mode = ['select', 'move', 'harvest', 'build'].includes(mode) ? mode : 'select'
    if (this.footer?.state && this.footer.state.mode !== this.mode) {
      this.footer.state.mode = this.mode
      this.footer.render?.()
    }
  }

  setTouchMode(mode) {
    this.touchMode = ['select', 'move', 'harvest', 'build'].includes(mode) ? mode : 'select'
    if (this.footer?.state && this.footer.state.touchMode !== this.touchMode) {
      this.footer.state.touchMode = this.touchMode
      this.footer.render?.()
    }
  }

  setSelectedIds(nextIds) {
    const valid = new Set(this.selectableUnits().map(u => u.id))
    const next = [...new Set(nextIds)].filter(id => valid.has(id))
    if (sameIds(next, this.ids)) return
    this.ids = next
    this.syncFooter()
    this.onSelectionChange?.(this.selectedUnits(), this.ids.slice())
  }

  clear() { this.setSelectedIds([]) }

  syncFooter(hint) {
    if (!this.footer) return
    const selected = this.selectedUnits()
    const name = selected.length === 0 ? 'None' : selected.length === 1
      ? String(selected[0].name || selected[0].type || 'Unit')
      : `${selected.length} Units`
    const props = { selected: name }
    if (hint) props.hint = hint
    this.footer.setResources?.(props)
  }

  hitTest(screen) {
    const camera = this.engine.camera
    let nearest = null
    let nearestDist = Infinity
    for (const u of this.selectableUnits()) {
      const pos = camera.worldToScreen(u.x, u.y)
      const radius = Math.max(19, (Number(u.radius) || 15) * camera.zoom)
      const d = distance(screen, pos)
      if (d <= radius && d < nearestDist) { nearest = u; nearestDist = d }
    }
    return nearest
  }

  selectAt(screen, additive = false) {
    const unit = this.hitTest(screen)
    if (!unit) { if (!additive) this.clear(); return }
    if (!additive) { this.setSelectedIds([unit.id]); return }
    const next = new Set(this.ids)
    if (next.has(unit.id)) next.delete(unit.id)
    else next.add(unit.id)
    this.setSelectedIds([...next])
  }

  selectBox(a, b, additive = false) {
    const left = Math.min(a.x, b.x), right = Math.max(a.x, b.x)
    const top = Math.min(a.y, b.y), bottom = Math.max(a.y, b.y)
    const found = this.selectableUnits().filter(u => {
      const p = this.engine.camera.worldToScreen(u.x, u.y)
      return p.x >= left && p.x <= right && p.y >= top && p.y <= bottom
    }).map(u => u.id)
    this.setSelectedIds(additive ? [...this.ids, ...found] : found)
  }

  handleWorldPointer(event) {
    const { kind, screen, world, originalEvent } = event
    if (kind === 'command') { this.issueCommand('move', world); return }
    if (kind === 'select') {
      if (this.mode === 'select') this.selectAt(screen, Boolean(originalEvent?.shiftKey))
      else this.issueCommand(this.mode, world)
      return
    }
    if (kind === 'tap') {
      if (this.touchMode === 'select') this.selectAt(screen)
      else this.issueCommand(this.touchMode, world)
    }
  }

  issueCommand(type, point) {
    const selected = this.selectedUnits()
    if (!selected.length) { this.syncFooter('Select a unit first'); return false }
    if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) return false
    // Move is legal only on the navigable ground. Harvest/build systems will
    // validate their own destinations later (farms and building footprints).
    if (type === 'move' && !this.engine.map.isWalkable(point.x, point.y)) {
      this.syncFooter('Blocked terrain — choose a path or bridge')
      return false
    }
    const order = {
      type,
      point: { x: point.x, y: point.y },
      unitIds: selected.map(unit => unit.id),
      units: selected,
    }
    this.onCommand?.(order)
    this.lastOrder = { x: point.x, y: point.y, expires: performance.now() + 1200 }
    this.syncFooter(`${type.toUpperCase()} order for ${selected.length} unit(s)`)
    return true
  }

  handleFooterAction(action, payload = {}) {
    if (action === 'mode') { this.setMode(payload.mode); return }
    if (action === 'touchMode') { this.setTouchMode(payload.mode); return }
    // Let future farmer/construction modules implement game-state mutations.
    this.onAction?.(action, payload, this)
  }

  handleDown(event) {
    if (!this.active || event.pointerType !== 'mouse' || event.button !== 0 ||
        this.engine.spaceDown || this.mode !== 'select') return
    const start = this.engine.clientPoint(event)
    this.drag = { pointerId: event.pointerId, start, end: start, moved: false,
      additive: Boolean(event.shiftKey) }
  }

  handleMove(event) {
    if (!this.drag || event.pointerId !== this.drag.pointerId) return
    this.drag.end = this.engine.clientPoint(event)
    if (distance(this.drag.start, this.drag.end) > 8) this.drag.moved = true
  }

  handleUp(event) {
    if (!this.drag || event.pointerId !== this.drag.pointerId) return
    const drag = this.drag
    this.drag = null
    if (drag.moved) this.selectBox(drag.start, drag.end, drag.additive)
    // Single clicks are already handled by GameEngine.onWorldPointer.
  }

  draw(ctx, camera = this.engine.camera) {
    const selected = this.selectedUnits()
    if (selected.length !== this.ids.length) {
      // Units may be removed by game systems after dying or despawning.
      this.setSelectedIds(selected.map(u => u.id))
    }
    ctx.save()
    ctx.strokeStyle = '#f6ce54'
    ctx.fillStyle = 'rgba(246,206,84,.12)'
    ctx.lineWidth = 2.5
    for (const unit of selected) {
      const p = camera.worldToScreen(unit.x, unit.y)
      const radius = Math.max(17, (Number(unit.radius) || 16) * camera.zoom)
      ctx.beginPath()
      ctx.ellipse(p.x, p.y, radius, radius * .55, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    }
    if (this.drag?.moved) {
      const { start, end } = this.drag
      const x = Math.min(start.x, end.x), y = Math.min(start.y, end.y)
      const w = Math.abs(end.x - start.x), h = Math.abs(end.y - start.y)
      ctx.fillStyle = 'rgba(246,206,84,.13)'
      ctx.strokeStyle = 'rgba(252,230,136,.95)'
      ctx.lineWidth = 1.5
      ctx.fillRect(x, y, w, h)
      ctx.strokeRect(x, y, w, h)
    }
    if (this.lastOrder && performance.now() < this.lastOrder.expires) {
      const p = camera.worldToScreen(this.lastOrder.x, this.lastOrder.y)
      ctx.strokeStyle = '#fff1ae'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(p.x, p.y, 10, 0, Math.PI * 2)
      ctx.moveTo(p.x - 14, p.y); ctx.lineTo(p.x - 6, p.y)
      ctx.moveTo(p.x + 6, p.y); ctx.lineTo(p.x + 14, p.y)
      ctx.stroke()
    }
    ctx.restore()
  }
}

export default SelectionController
