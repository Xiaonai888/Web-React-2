/**
 * Shadow Realms — Stage 1: procedural, three-quarter-view world map.
 *
 * Pure local Canvas module. No fetch, storage, backend, or external assets.
 * World positions are flat (x, y); Camera2D applies the visual tilt.
 *
 * Later game loop:
 *   map.update(dt);
 *   map.drawGround(ctx, camera);
 *   // draw characters / buildings here
 *   map.drawForeground(ctx, camera);
 *
 * For a map-only test: map.draw(ctx, camera).
 */

const clamp = (n, a, b) => Math.max(a, Math.min(b, n))
const sq = n => n * n

function randomSource(seed) {
  let state = seed >>> 0
  return () => {
    state += 0x6d2b79f5
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function distanceToSegmentSquared(x, y, a, b) {
  const vx = b.x - a.x
  const vy = b.y - a.y
  const t = clamp(((x - a.x) * vx + (y - a.y) * vy) / (vx * vx + vy * vy || 1), 0, 1)
  return sq(x - a.x - vx * t) + sq(y - a.y - vy * t)
}

function insideBounds(x, y, bounds, margin = 0) {
  return x >= bounds.left - margin && x <= bounds.right + margin &&
    y >= bounds.top - margin && y <= bounds.bottom + margin
}

export class WorldMap {
  constructor({ width = 3200, height = 2200, seed = 42 } = {}) {
    this.width = Math.max(900, Number(width) || 3200)
    this.height = Math.max(700, Number(height) || 2200)
    this.seed = Number(seed) || 42
    this.elapsed = 0

    const sx = this.width / 3200
    const sy = this.height / 2200
    const pos = (x, y) => ({ x: x * sx, y: y * sy })

    this.bridges = [
      { y: 1000 * sy, halfHeight: 52 * sy },
      { y: 1600 * sy, halfHeight: 52 * sy },
    ].map(b => ({ ...b, x: this.riverX(b.y), halfWidth: 170 * sx }))

    this.roads = [
      [pos(70, 1100), pos(510, 1110), pos(890, 1010), pos(1300, 975),
        { x: this.bridges[0].x, y: this.bridges[0].y },
        pos(2010, 1040), pos(2560, 1080), pos(3130, 1020)],
      [pos(450, 1470), pos(950, 1490), pos(1300, 1600),
        { x: this.bridges[1].x, y: this.bridges[1].y },
        pos(2100, 1570), pos(2710, 1480)],
    ]

    // Reserved clear land for the later farm/building modules; NO farming logic here.
    this.clearings = [
      pos(450, 790), pos(850, 1320), pos(550, 1740),
      pos(2510, 800), pos(2770, 1330), pos(2480, 1790),
    ].map(p => ({ ...p, r: 100 * Math.min(sx, sy) }))

    const random = randomSource(this.seed)
    this.grass = []
    for (let i = 0; i < 1900; i++) {
      this.grass.push({
        x: random() * this.width,
        y: random() * this.height,
        size: 3 + random() * 10,
        type: random(),
      })
    }

    this.trees = []
    this.rocks = []
    let attempts = 0
    while (this.trees.length < 205 && attempts++ < 2200) {
      const x = 75 + random() * (this.width - 150)
      const y = 75 + random() * (this.height - 150)
      const size = 30 + random() * 19
      if (!this.#allowScenery(x, y, size + 38)) continue
      if (this.trees.some(t => sq(t.x - x) + sq(t.y - y) < sq(size + t.size + 12))) continue
      this.trees.push({ x, y, size, tint: random(), kind: random() })
    }
    attempts = 0
    while (this.rocks.length < 85 && attempts++ < 1000) {
      const x = 45 + random() * (this.width - 90)
      const y = 45 + random() * (this.height - 90)
      const size = 12 + random() * 14
      if (!this.#allowScenery(x, y, size + 16)) continue
      if (this.trees.some(t => sq(t.x - x) + sq(t.y - y) < sq(t.size * 0.55 + size))) continue
      this.rocks.push({ x, y, size, tint: random() })
    }
    this.foreground = [...this.trees.map(o => ({ ...o, type: 'tree' })),
      ...this.rocks.map(o => ({ ...o, type: 'rock' }))]
      .sort((a, b) => a.y - b.y)
  }

  riverX(y) {
    const t = y / this.height
    return this.width * (0.5 + 0.028 * Math.sin(t * Math.PI * 2.7) +
      0.012 * Math.sin(t * Math.PI * 6.2))
  }

  riverRadius(y) {
    return this.width * (0.033 + 0.0035 * Math.sin(y / this.height * 16))
  }

  #nearRoad(x, y, distance) {
    const limit = distance * distance
    return this.roads.some(points => points.slice(1).some((end, i) =>
      distanceToSegmentSquared(x, y, points[i], end) <= limit))
  }

  #onBridge(x, y) {
    return this.bridges.some(b =>
      Math.abs(y - b.y) <= b.halfHeight && Math.abs(x - b.x) <= b.halfWidth)
  }

  #allowScenery(x, y, buffer) {
    if (Math.abs(x - this.riverX(y)) < this.riverRadius(y) + buffer) return false
    if (this.#nearRoad(x, y, buffer + 41)) return false
    if (this.clearings.some(c => sq(x - c.x) + sq(y - c.y) < sq(c.r + buffer))) return false
    return true
  }

  getTerrainAt(x, y) {
    if (!Number.isFinite(x) || !Number.isFinite(y) ||
        x < 0 || y < 0 || x > this.width || y > this.height) return 'void'
    if (this.#onBridge(x, y)) return 'bridge'
    if (Math.abs(x - this.riverX(y)) < this.riverRadius(y)) return 'water'
    if (this.#nearRoad(x, y, 42 * (this.width / 3200))) return 'road'
    return 'grass'
  }

  // Use for click-to-move, basic collision and the future pathfinding module.
  // Characters are blocked by water (except bridges), tree trunks and rocks.
  isWalkable(x, y, radius = 13) {
    const r = Math.max(0, Number(radius) || 0)
    if (x - r < 0 || x + r > this.width || y - r < 0 || y + r > this.height) return false
    for (const [dx, dy] of [[0, 0], [r, 0], [-r, 0], [0, r], [0, -r]]) {
      if (this.getTerrainAt(x + dx, y + dy) === 'water') return false
    }
    for (const t of this.trees) {
      if (sq(t.x - x) + sq(t.y - y) < sq(r + t.size * 0.31)) return false
    }
    for (const b of this.rocks) {
      if (sq(b.x - x) + sq(b.y - y) < sq(r + b.size * 0.7)) return false
    }
    return true
  }

  getSpawnPoint(side = 'blue') {
    return side === 'red'
      ? { x: this.width * 0.87, y: this.height * 0.51 }
      : { x: this.width * 0.13, y: this.height * 0.51 }
  }

  getNavigationGrid(cellSize = 48, unitRadius = 13) {
    const size = clamp(Math.floor(cellSize) || 48, 20, 128)
    const columns = Math.ceil(this.width / size)
    const rows = Math.ceil(this.height / size)
    const cells = new Uint8Array(columns * rows)
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const x = Math.min(this.width - unitRadius, (column + 0.5) * size)
        const y = Math.min(this.height - unitRadius, (row + 0.5) * size)
        cells[row * columns + column] = this.isWalkable(x, y, unitRadius) ? 1 : 0
      }
    }
    return { cellSize: size, columns, rows, cells }
  }

  update(deltaSeconds = 0) {
    if (Number.isFinite(deltaSeconds) && deltaSeconds > 0) {
      this.elapsed += Math.min(deltaSeconds, 0.1)
    }
  }

  #withCamera(ctx, camera, paint) {
    if (!ctx || !camera) return
    ctx.save()
    ctx.translate(camera.viewportWidth / 2 - camera.x * camera.zoom,
      camera.viewportHeight / 2 - camera.y * camera.zoom * camera.tilt)
    ctx.scale(camera.zoom, camera.zoom * camera.tilt)
    paint(camera.getVisibleBounds())
    ctx.restore()
  }

  #strokePath(ctx, points, width, color) {
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y)
    ctx.lineWidth = width
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.strokeStyle = color
    ctx.stroke()
  }

  #drawRoads(ctx) {
    const scale = Math.min(this.width / 3200, this.height / 2200)
    for (const points of this.roads) {
      this.#strokePath(ctx, points, 106 * scale, '#79914c')
      this.#strokePath(ctx, points, 93 * scale, '#c4a773')
      this.#strokePath(ctx, points, 75 * scale, '#d9bc86')
    }
  }

  #drawRiver(ctx, bounds) {
    const begin = Math.max(-90, bounds.top - 160)
    const end = Math.min(this.height + 90, bounds.bottom + 160)
    if (begin > end) return
    const sections = [
      { extra: 27, color: '#55784f' },
      { extra: 15, color: '#a1a36c' },
      { extra: 5, color: '#1f7485' },
      { extra: -12, color: '#2c9fbc' },
    ]
    for (const section of sections) {
      ctx.beginPath()
      for (let y = begin, i = 0; y <= end + 28; y += 23, i++) {
        const x = this.riverX(y)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = section.color
      ctx.lineWidth = this.riverRadius((begin + end) / 2) * 2 + section.extra * 2
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      ctx.stroke()
    }
    // Moving water ripples. No images, shaders, or network traffic.
    for (let y = Math.floor(begin / 64) * 64; y < end; y += 64) {
      for (let i = -1; i <= 1; i++) {
        const x = this.riverX(y) + i * this.riverRadius(y) * 0.38
        const wave = 7 * Math.sin(this.elapsed * 1.7 + y * 0.04 + i * 3)
        ctx.beginPath()
        ctx.moveTo(x - 12 + wave, y)
        ctx.quadraticCurveTo(x, y - 4, x + 14 + wave, y)
        ctx.strokeStyle = 'rgba(215,250,244,.38)'
        ctx.lineWidth = 2.5
        ctx.stroke()
      }
    }
  }

  #drawBridges(ctx) {
    for (const bridge of this.bridges) {
      const { x, y, halfWidth: w, halfHeight: h } = bridge
      ctx.fillStyle = '#3a362a'
      ctx.fillRect(x - w - 3, y - h - 6, w * 2 + 6, h * 2 + 12)
      ctx.fillStyle = '#805331'
      ctx.fillRect(x - w, y - h, w * 2, h * 2)
      const boardCount = Math.ceil(w * 2 / 21)
      for (let i = 0; i < boardCount; i++) {
        const bx = x - w + i * (w * 2) / boardCount
        ctx.fillStyle = i % 2 ? '#ae7944' : '#bd8b53'
        ctx.fillRect(bx + 1.4, y - h + 7, (w * 2) / boardCount - 2.8, h * 2 - 14)
        ctx.strokeStyle = '#67472f'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(bx, y - h + 7)
        ctx.lineTo(bx, y + h - 7)
        ctx.stroke()
      }
      ctx.fillStyle = '#5b4029'
      ctx.fillRect(x - w, y - h, w * 2, 9)
      ctx.fillRect(x - w, y + h - 9, w * 2, 9)
      ctx.fillStyle = '#d0a36a'
      for (let bx = x - w; bx < x + w; bx += 40) {
        ctx.fillRect(bx, y - h - 5, 9, 17)
        ctx.fillRect(bx, y + h - 12, 9, 17)
      }
    }
  }

  #drawClearings(ctx) {
    for (const c of this.clearings) {
      ctx.beginPath()
      ctx.ellipse(c.x, c.y, c.r, c.r * 0.75, -0.13, 0, Math.PI * 2)
      ctx.fillStyle = '#a3bd71'
      ctx.fill()
      ctx.strokeStyle = '#829f5e'
      ctx.lineWidth = 5
      ctx.stroke()
    }
  }

  drawGround(ctx, camera) {
    this.#withCamera(ctx, camera, bounds => {
      ctx.fillStyle = '#91b46b'
      ctx.fillRect(0, 0, this.width, this.height)

      // Precomputed, deterministic ground variation; only visible cells render.
      const tile = 110
      const x0 = Math.max(0, Math.floor(bounds.left / tile) - 1)
      const x1 = Math.min(Math.ceil(this.width / tile), Math.ceil(bounds.right / tile) + 1)
      const y0 = Math.max(0, Math.floor(bounds.top / tile) - 1)
      const y1 = Math.min(Math.ceil(this.height / tile), Math.ceil(bounds.bottom / tile) + 1)
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const n = Math.abs(Math.sin(x * 12.9898 + y * 78.233 + this.seed * 0.27))
          ctx.fillStyle = n > 0.66 ? '#94b86d' : n > 0.33 ? '#91b46b' : '#8eaf67'
          ctx.fillRect(x * tile, y * tile, tile + 1, tile + 1)
        }
      }

      this.#drawClearings(ctx)
      this.#drawRoads(ctx)
      this.#drawRiver(ctx, bounds)
      this.#drawBridges(ctx)

      for (const g of this.grass) {
        if (!insideBounds(g.x, g.y, bounds, 14)) continue
        if (this.getTerrainAt(g.x, g.y) !== 'grass') continue
        ctx.strokeStyle = g.type > .72 ? '#6c9c53' : '#a4c779'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(g.x - g.size * .5, g.y + 2)
        ctx.lineTo(g.x, g.y - g.size * .65)
        ctx.lineTo(g.x + g.size * .45, g.y + 2)
        ctx.stroke()
      }
    })
  }

  #drawTree(ctx, item, tilt) {
    const { x, y, size: s, tint, kind } = item
    ctx.fillStyle = 'rgba(33,66,38,.22)'
    ctx.beginPath()
    ctx.ellipse(x + 6, y + 4, s * .85, s * .34, 0, 0, Math.PI * 2)
    ctx.fill()

    // Correct the camera's ground tilt so trees stay visually upright.
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(1, 1 / tilt)
    ctx.fillStyle = '#77502e'
    ctx.fillRect(-s * .15, -s * .77, s * .3, s * .8)
    ctx.fillStyle = '#4e3825'
    ctx.fillRect(s * .03, -s * .67, s * .08, s * .7)
    const bottom = kind > .22 ? '#326d48' : '#426f46'
    const top = tint > .5 ? '#67a75b' : '#579c58'
    const lobes = [
      [-.46, -.92, .52, .49], [.45, -.92, .52, .49],
      [0, -1.29, .67, .56], [0, -.78, .62, .49],
    ]
    for (let i = 0; i < lobes.length; i++) {
      const [ox, oy, rx, ry] = lobes[i]
      ctx.beginPath()
      ctx.ellipse(s * ox, s * oy, s * rx, s * ry, 0, 0, Math.PI * 2)
      ctx.fillStyle = i < 2 ? bottom : top
      ctx.fill()
    }
    ctx.strokeStyle = 'rgba(205,238,153,.45)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(-s * .11, -s * 1.34, s * .28, 3.8, 5.65)
    ctx.stroke()
    ctx.restore()
  }

  #drawRock(ctx, item) {
    const { x, y, size: r, tint } = item
    ctx.fillStyle = 'rgba(39,62,37,.17)'
    ctx.beginPath()
    ctx.ellipse(x + 4, y + 4, r * 1.1, r * .55, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(x - r, y + r * .3)
    ctx.lineTo(x - r * .57, y - r * .61)
    ctx.lineTo(x + r * .23, y - r * .8)
    ctx.lineTo(x + r, y - r * .15)
    ctx.lineTo(x + r * .77, y + r * .5)
    ctx.closePath()
    ctx.fillStyle = tint > .5 ? '#849589' : '#738476'
    ctx.fill()
    ctx.strokeStyle = '#526e63'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x - r * .57, y - r * .61)
    ctx.lineTo(x - r * .14, y - r * .19)
    ctx.lineTo(x + r * .23, y - r * .8)
    ctx.fillStyle = '#a4b2a4'
    ctx.fill()
  }

  drawForeground(ctx, camera) {
    this.#withCamera(ctx, camera, bounds => {
      for (const item of this.foreground) {
        if (!insideBounds(item.x, item.y, bounds, item.size * 2.6)) continue
        if (item.type === 'tree') this.#drawTree(ctx, item, camera.tilt)
        else this.#drawRock(ctx, item)
      }
      // Thin map boundary for debugging world limits, removable later.
      ctx.strokeStyle = 'rgba(30,68,36,.45)'
      ctx.lineWidth = 8
      ctx.strokeRect(0, 0, this.width, this.height)
    })
  }

  draw(ctx, camera) {
    this.drawGround(ctx, camera)
    this.drawForeground(ctx, camera)
  }
}

export default WorldMap
