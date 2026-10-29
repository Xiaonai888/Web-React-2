/**
 * Shadow Realms — local-only Canvas game engine (Step 45 input fixes).
 *
 * Responsibilities: frame loop, canvas sizing, camera input, map rendering,
 * and stable hooks for later units/buildings. No backend, fetch, or storage.
 *
 * Integration (in a later index.html module script):
 *   import { GameEngine } from './core/GameEngine.js';
 *   const game = new GameEngine({ canvas: document.querySelector('#game') });
 *   game.start();
 */
import { Camera2D } from './Camera2D.js'
import { WorldMap } from './WorldMap.js'

const clamp = (value, low, high) => Math.max(low, Math.min(high, value))
const length = (x, y) => Math.hypot(x, y)

export class GameEngine {
  constructor({
    canvas,
    map = new WorldMap(),
    camera = null,
    onUpdate = null,
    onRender = null,
    onWorldPointer = null,
    cameraSpeed = 620,
    maxPixelRatio = 2,
  } = {}) {
    if (!canvas || typeof canvas.getContext !== 'function') {
      throw new Error('GameEngine requires a <canvas> element.')
    }
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) throw new Error('Cannot create a 2D Canvas context.')

    this.canvas = canvas
    this.ctx = ctx
    this.map = map
    this.camera = camera || new Camera2D({
      worldWidth: map.width,
      worldHeight: map.height,
    })
    this.camera.setWorldSize(map.width, map.height)
    if (!camera && typeof map.getSpawnPoint === 'function') {
      const spawn = map.getSpawnPoint('blue')
      this.camera.centerOn(spawn.x, spawn.y)
    }

    this.onUpdate = onUpdate
    this.onRender = onRender
    this.onWorldPointer = onWorldPointer
    this.cameraSpeed = cameraSpeed
    this.maxPixelRatio = maxPixelRatio
    this.running = false
    this.destroyed = false
    this.frameId = 0
    this.lastTime = null
    this.pixelRatio = 1
    this.keys = new Set()
    this.pointers = new Map()
    this.spaceDown = false
    this.dragThreshold = 7
    this.resizeObserver = null
    this.originalTouchAction = canvas.style.touchAction
    this.originalTabIndex = canvas.getAttribute('tabindex')

    this.handleResize = () => this.resize()
    this.handleKeyDown = event => this.keyDown(event)
    this.handleKeyUp = event => this.keyUp(event)
    this.handleBlur = () => {
      this.keys.clear()
      this.spaceDown = false
      this.pointers.clear()
    }
    this.handleContextMenu = event => event.preventDefault()
    this.handlePointerDown = event => this.pointerDown(event)
    this.handlePointerMove = event => this.pointerMove(event)
    this.handlePointerUp = event => this.pointerUp(event)
    this.handleWheel = event => this.wheel(event)
    this.tick = time => this.frame(time)

    this.canvas.style.touchAction = 'none'
    this.canvas.setAttribute('tabindex', '0')
    this.resize()
  }

  resize() {
    if (this.destroyed) return
    const rect = this.canvas.getBoundingClientRect()
    const width = Math.max(1, Math.round(rect.width || this.canvas.clientWidth || 960))
    const height = Math.max(1, Math.round(rect.height || this.canvas.clientHeight || 540))
    const requested = Number(globalThis.window?.devicePixelRatio) || 1
    this.pixelRatio = clamp(requested, 1, Math.max(1, this.maxPixelRatio))
    const pixelWidth = Math.round(width * this.pixelRatio)
    const pixelHeight = Math.round(height * this.pixelRatio)
    if (this.canvas.width !== pixelWidth) this.canvas.width = pixelWidth
    if (this.canvas.height !== pixelHeight) this.canvas.height = pixelHeight
    this.camera.setViewport(width, height)
    this.ctx.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0)
  }

  attachInput() {
    this.canvas.addEventListener('pointerdown', this.handlePointerDown)
    this.canvas.addEventListener('pointermove', this.handlePointerMove)
    this.canvas.addEventListener('pointerup', this.handlePointerUp)
    this.canvas.addEventListener('pointercancel', this.handlePointerUp)
    this.canvas.addEventListener('lostpointercapture', this.handlePointerUp)
    this.canvas.addEventListener('wheel', this.handleWheel, { passive: false })
    this.canvas.addEventListener('contextmenu', this.handleContextMenu)
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
    window.addEventListener('blur', this.handleBlur)
    window.addEventListener('resize', this.handleResize)
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(this.handleResize)
      this.resizeObserver.observe(this.canvas)
    }
  }

  detachInput() {
    this.canvas.removeEventListener('pointerdown', this.handlePointerDown)
    this.canvas.removeEventListener('pointermove', this.handlePointerMove)
    this.canvas.removeEventListener('pointerup', this.handlePointerUp)
    this.canvas.removeEventListener('pointercancel', this.handlePointerUp)
    this.canvas.removeEventListener('lostpointercapture', this.handlePointerUp)
    this.canvas.removeEventListener('wheel', this.handleWheel)
    this.canvas.removeEventListener('contextmenu', this.handleContextMenu)
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
    window.removeEventListener('blur', this.handleBlur)
    window.removeEventListener('resize', this.handleResize)
    this.resizeObserver?.disconnect()
    this.resizeObserver = null
    this.keys.clear()
    this.pointers.clear()
    this.spaceDown = false
  }

  start() {
    if (this.destroyed) throw new Error('Cannot start a destroyed game.')
    if (this.running) return this
    this.resize()
    this.attachInput()
    this.running = true
    this.lastTime = null
    this.frameId = requestAnimationFrame(this.tick)
    return this
  }

  stop() {
    if (!this.running) return this
    this.running = false
    cancelAnimationFrame(this.frameId)
    this.frameId = 0
    this.lastTime = null
    this.detachInput()
    return this
  }

  destroy() {
    if (this.destroyed) return
    this.stop()
    this.canvas.style.touchAction = this.originalTouchAction
    if (this.originalTabIndex === null) this.canvas.removeAttribute('tabindex')
    else this.canvas.setAttribute('tabindex', this.originalTabIndex)
    this.destroyed = true
  }

  frame(time) {
    if (!this.running) return
    const dt = this.lastTime === null ? 0 : clamp((time - this.lastTime) / 1000, 0, 0.05)
    this.lastTime = time
    this.update(dt)
    this.render()
    if (this.running) this.frameId = requestAnimationFrame(this.tick)
  }

  update(dt) {
    let horizontal = Number(this.keys.has('arrowright') || this.keys.has('d')) -
      Number(this.keys.has('arrowleft') || this.keys.has('a'))
    let vertical = Number(this.keys.has('arrowdown') || this.keys.has('s')) -
      Number(this.keys.has('arrowup') || this.keys.has('w'))
    const magnitude = length(horizontal, vertical)
    if (magnitude > 0) {
      horizontal /= magnitude
      vertical /= magnitude
      const distance = this.cameraSpeed * dt
      this.camera.panScreen(-horizontal * distance, -vertical * distance)
    }
    this.map.update(dt)
    this.onUpdate?.(dt, this)
  }

  render() {
    const ctx = this.ctx
    ctx.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0)
    ctx.clearRect(0, 0, this.camera.viewportWidth, this.camera.viewportHeight)
    this.map.drawGround(ctx, this.camera)
    // Later units and buildings can draw between ground and tree canopies.
    this.onRender?.(ctx, this.camera, this.map, this)
    this.map.drawForeground(ctx, this.camera)
  }

  clientPoint(event) {
    const rect = this.canvas.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  screenToWorld(x, y) {
    return this.camera.screenToWorld(x, y)
  }

  emitWorldPointer(kind, point, event) {
    if (typeof this.onWorldPointer !== 'function') return
    this.onWorldPointer({
      kind,
      screen: { x: point.x, y: point.y },
      world: this.screenToWorld(point.x, point.y),
      originalEvent: event,
    }, this)
  }

  pointerDown(event) {
    if (!this.running) return
    const point = this.clientPoint(event)
    const isTouch = event.pointerType !== 'mouse'
    const pan = isTouch || event.button === 1 || (event.button === 0 && this.spaceDown)
    const item = { ...point, startX: point.x, startY: point.y,
      pointerType: event.pointerType, button: event.button, pan, moved: false }
    this.pointers.set(event.pointerId, item)
    // A second touch turns the entire gesture into camera navigation.
    // Neither finger is later allowed to emit an accidental selection tap.
    if (isTouch && [...this.pointers.values()].filter(p => p.pointerType !== 'mouse').length > 1) {
      for (const touch of this.pointers.values()) if (touch.pointerType !== 'mouse') touch.moved = true
    }
    try { this.canvas.setPointerCapture(event.pointerId) } catch { /* Not capturable. */ }
    if (pan || event.button === 2) event.preventDefault()
  }

  pointerMove(event) {
    const pointer = this.pointers.get(event.pointerId)
    if (!pointer) return
    const previous = { x: pointer.x, y: pointer.y }
    const touchPointers = [...this.pointers.values()].filter(item => item.pointerType !== 'mouse')
    const oldMidpoint = touchPointers.length === 2 ? {
      x: (touchPointers[0].x + touchPointers[1].x) / 2,
      y: (touchPointers[0].y + touchPointers[1].y) / 2,
      distance: length(touchPointers[0].x - touchPointers[1].x,
        touchPointers[0].y - touchPointers[1].y),
    } : null

    const next = this.clientPoint(event)
    pointer.x = next.x
    pointer.y = next.y
    const movedBefore = pointer.moved
    if (length(next.x - pointer.startX, next.y - pointer.startY) > this.dragThreshold)
      pointer.moved = true

    if (oldMidpoint && pointer.pointerType !== 'mouse') {
      const touches = [...this.pointers.values()].filter(item => item.pointerType !== 'mouse')
      const center = { x: (touches[0].x + touches[1].x) / 2,
        y: (touches[0].y + touches[1].y) / 2 }
      const distance = length(touches[0].x - touches[1].x, touches[0].y - touches[1].y)
      this.camera.panScreen(center.x - oldMidpoint.x, center.y - oldMidpoint.y)
      if (oldMidpoint.distance > 3 && distance > 3) {
        this.camera.zoomAt(this.camera.zoom * distance / oldMidpoint.distance, center.x, center.y)
      }
      for (const touch of touches) touch.moved = true
    } else if (pointer.pan && pointer.moved) {
      // Do not pan a few pixels while a mobile user is trying to tap/select.
      // On first drag apply the whole distance since pointerDown to avoid a jump.
      const dx = movedBefore ? next.x - previous.x : next.x - pointer.startX
      const dy = movedBefore ? next.y - previous.y : next.y - pointer.startY
      this.camera.panScreen(dx, dy)
    }
  }

  pointerUp(event) {
    const pointer = this.pointers.get(event.pointerId)
    if (!pointer) return
    this.pointers.delete(event.pointerId)
    const canceled = event.type === 'pointercancel' || event.type === 'lostpointercapture'
    const point = this.clientPoint(event)
    const releasedAway = length(point.x - pointer.startX, point.y - pointer.startY) > this.dragThreshold
    if (!canceled && !pointer.moved && !releasedAway && this.running) {
      const kind = pointer.pointerType === 'mouse'
        ? (pointer.button === 2 ? 'command' : pointer.button === 0 && !pointer.pan ? 'select' : null)
        : 'tap'
      if (kind) this.emitWorldPointer(kind, point, event)
    }
    if (this.canvas.hasPointerCapture?.(event.pointerId)) {
      try { this.canvas.releasePointerCapture(event.pointerId) } catch { /* Already released. */ }
    }
  }

  wheel(event) {
    if (!this.running) return
    event.preventDefault()
    const point = this.clientPoint(event)
    const factor = Math.exp(-clamp(event.deltaY, -200, 200) * 0.0013)
    this.camera.zoomAt(this.camera.zoom * factor, point.x, point.y)
  }

  keyDown(event) {
    if (event.target?.closest?.('input, textarea, select, [contenteditable="true"]')) return
    const key = String(event.key || '').toLowerCase()
    if (key === ' ') {
      this.spaceDown = true
      event.preventDefault()
    } else if ('wasd'.includes(key) && key.length === 1 || key.startsWith('arrow')) {
      this.keys.add(key)
      event.preventDefault()
    }
  }

  keyUp(event) {
    const key = String(event.key || '').toLowerCase()
    if (key === ' ') this.spaceDown = false
    this.keys.delete(key)
  }
}

export default GameEngine
