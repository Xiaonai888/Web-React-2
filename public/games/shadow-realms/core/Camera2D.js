/**
 * Shadow Realms — camera for a 2D, three-quarter-view battlefield.
 *
 * World coordinates stay in normal 2D units. Only the view is vertically
 * compressed (tilt). Characters can be drawn upright at projected positions.
 * Step 45 — safe input arithmetic, stable pointer-centred zoom and clamps.
 * This module knows nothing about HTML, input, units, or map artwork.
 */
const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const positive = (value, fallback) =>
  Number.isFinite(value) && value > 0 ? value : fallback

export class Camera2D {
  constructor({
    worldWidth = 3200,
    worldHeight = 2200,
    viewportWidth = 960,
    viewportHeight = 540,
    tilt = 0.74,
    zoom = 1,
    minZoom = 0.6,
    maxZoom = 2.2,
  } = {}) {
    this.worldWidth = positive(worldWidth, 3200)
    this.worldHeight = positive(worldHeight, 2200)
    this.viewportWidth = positive(viewportWidth, 960)
    this.viewportHeight = positive(viewportHeight, 540)
    this.tilt = clamp(positive(tilt, 0.74), 0.5, 1)
    this.minZoom = positive(minZoom, 0.6)
    this.maxZoom = Math.max(this.minZoom, positive(maxZoom, 2.2))
    this.zoom = clamp(positive(zoom, 1), this.minZoom, this.maxZoom)

    this.x = this.worldWidth / 2
    this.y = this.worldHeight / 2
    this.#clampPosition()
  }

  get visibleWidth() {
    return this.viewportWidth / this.zoom
  }

  get visibleHeight() {
    return this.viewportHeight / (this.zoom * this.tilt)
  }

  #clampPosition() {
    const halfW = this.visibleWidth / 2
    const halfH = this.visibleHeight / 2

    // Small maps remain centered instead of revealing empty space.
    this.x = this.worldWidth <= halfW * 2
      ? this.worldWidth / 2
      : clamp(this.x, halfW, this.worldWidth - halfW)
    this.y = this.worldHeight <= halfH * 2
      ? this.worldHeight / 2
      : clamp(this.y, halfH, this.worldHeight - halfH)
  }

  setViewport(width, height) {
    this.viewportWidth = positive(width, this.viewportWidth)
    this.viewportHeight = positive(height, this.viewportHeight)
    this.#clampPosition()
  }

  setWorldSize(width, height) {
    this.worldWidth = positive(width, this.worldWidth)
    this.worldHeight = positive(height, this.worldHeight)
    this.#clampPosition()
  }

  centerOn(worldX, worldY, smoothing = 1) {
    const t = Number.isFinite(smoothing) ? clamp(smoothing, 0, 1) : 1
    if (Number.isFinite(worldX)) this.x += (worldX - this.x) * t
    if (Number.isFinite(worldY)) this.y += (worldY - this.y) * t
    this.#clampPosition()
  }

  panWorld(dx, dy) {
    if (!Number.isFinite(dx) || !Number.isFinite(dy)) return
    this.centerOn(this.x + dx, this.y + dy)
  }

  // Dragging right moves the map right, so the camera moves left.
  panScreen(dx, dy) {
    if (!Number.isFinite(dx) || !Number.isFinite(dy)) return
    this.panWorld(-dx / this.zoom, -dy / (this.zoom * this.tilt))
  }

  worldToScreen(worldX, worldY) {
    return {
      x: (worldX - this.x) * this.zoom + this.viewportWidth / 2,
      y: (worldY - this.y) * this.zoom * this.tilt + this.viewportHeight / 2,
    }
  }

  screenToWorld(screenX, screenY) {
    return {
      x: (screenX - this.viewportWidth / 2) / this.zoom + this.x,
      y: (screenY - this.viewportHeight / 2) / (this.zoom * this.tilt) + this.y,
    }
  }

  // Zoom around a mouse pointer or touch point, not just the screen center.
  zoomAt(nextZoom, screenX = this.viewportWidth / 2, screenY = this.viewportHeight / 2) {
    const px = Number.isFinite(screenX) ? screenX : this.viewportWidth / 2
    const py = Number.isFinite(screenY) ? screenY : this.viewportHeight / 2
    const before = this.screenToWorld(px, py)
    this.zoom = clamp(positive(nextZoom, this.zoom), this.minZoom, this.maxZoom)
    this.x = before.x - (px - this.viewportWidth / 2) / this.zoom
    this.y = before.y - (py - this.viewportHeight / 2) / (this.zoom * this.tilt)
    this.#clampPosition()
    return this.zoom
  }

  getVisibleBounds() {
    return {
      left: this.x - this.visibleWidth / 2,
      top: this.y - this.visibleHeight / 2,
      right: this.x + this.visibleWidth / 2,
      bottom: this.y + this.visibleHeight / 2,
    }
  }
}

export default Camera2D
