/**
 * Shadow Realms — local rice ecology and farming economy (Step 10).
 *
 * This independent module owns the full rice lifecycle: seeded -> growing ->
 * ripening -> ripe -> harvested/resting -> regrowing. It also owns harvesting,
 * carrying, storage, and lightweight Canvas visuals.
 *
 * No fetch, Supabase, Render, persistence, DOM, assets, or external packages.
 * All time progresses only through update(deltaSeconds).
 *
 * Integration in a future game entry point:
 *   const rice = new RiceSystem(engine.map)
 *   engine.onUpdate = dt => { rice.update(dt); farmers.forEach(f => f.update(dt, engine.map)); }
 *   engine.onRender = (ctx, camera) => { rice.draw(ctx, camera); farmers.forEach(f => f.draw(ctx, camera)); }
 *   // When a farmer arrives within harvestRange of a ripe plant:
 *   const result = rice.harvestNear(farmer)
 *   // When that farmer returns to the home position:
 *   const deposited = rice.deposit(farmer)
 *   // The footer can read rice.getResources().rice.
 *
 * Public methods are intentionally stable for later FarmerAI / Construction:
 *   getFields(), getFieldAt(point), getNearestRipe(point), getHarvestTarget(point)
 *   harvestNear(farmer), harvestPlant(plantOrId, farmer), deposit(farmer, home?)
 *   update(dt), draw(ctx,camera), drawGround(ctx,camera), drawCrops(ctx,camera)
 *   getResources(), getSummary(), reset(), setStorageRice(amount)
 */

const TAU = Math.PI * 2
const clamp = (n, min, max) => Math.max(min, Math.min(max, n))
const finite = n => Number.isFinite(n)
const at = value => finite(value?.x) && finite(value?.y)
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
const square = n => n * n

function seededRandom(seed) {
  let state = (Number.isFinite(seed) ? seed : 42) >>> 0
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0
    return state / 4294967296
  }
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath()
  ctx.ellipse(x, y, rx, ry, 0, 0, TAU)
  ctx.fillStyle = fill
  ctx.fill()
}

function stroke(ctx, x1, y1, x2, y2, color, thickness) {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.strokeStyle = color
  ctx.lineCap = 'round'
  ctx.lineWidth = thickness
  ctx.stroke()
}

const fieldPoint = (p, sx, sy) => ({ x: p.x * sx, y: p.y * sy })

export class RiceSystem {
  constructor(map, {
    seed = 4107,
    plots = null,
    plotWidth = 116,
    plotHeight = 96,
    rows = 4,
    columns = 5,
    growSeconds = 75,
    restSeconds = 9,
    yieldPerPlant = 3,
    harvestRange = 48,
    carryingCapacity = 24,
    depositRange = 70,
    startingRice = 80,
    initialReadyFraction = 0.34,
  } = {}) {
    if (!map || !finite(map.width) || !finite(map.height) ||
        typeof map.isWalkable !== 'function') {
      throw new TypeError('RiceSystem requires a WorldMap with width, height and isWalkable().')
    }

    if (plots != null && !Array.isArray(plots)) {
      throw new TypeError('RiceSystem plots must be an array or null.')
    }

    this.map = map
    this.seed = Number.isFinite(seed) ? seed : 4107
    this.config = {
      width: clamp(finite(plotWidth) ? plotWidth : 116, 54, 260),
      height: clamp(finite(plotHeight) ? plotHeight : 96, 54, 240),
      rows: Math.floor(clamp(finite(rows) ? rows : 4, 2, 12)),
      columns: Math.floor(clamp(finite(columns) ? columns : 5, 2, 12)),
      growSeconds: clamp(finite(growSeconds) ? growSeconds : 75, 5, 3600),
      restSeconds: clamp(finite(restSeconds) ? restSeconds : 9, 0, 300),
      yieldPerPlant: Math.floor(clamp(finite(yieldPerPlant) ? yieldPerPlant : 3, 1, 99)),
      harvestRange: clamp(finite(harvestRange) ? harvestRange : 48, 10, 160),
      carryingCapacity: Math.floor(clamp(finite(carryingCapacity) ? carryingCapacity : 24, 1, 500)),
      depositRange: clamp(finite(depositRange) ? depositRange : 70, 12, 300),
      initialReadyFraction: clamp(finite(initialReadyFraction) ? initialReadyFraction : 0.34, 0, 1),
    }

    this.initialRice = Math.max(0, Math.floor(finite(startingRice) ? startingRice : 80))
    this.rice = this.initialRice
    this.totalHarvested = 0
    this.totalDeposited = 0
    this.harvestCount = 0
    this.time = 0
    this.fields = []
    this.plants = []
    this.byId = new Map()
    this._customPlotOrigins = plots == null ? null : plots.map(p => ({ x: p?.x, y: p?.y }))
    this.#createFields(plots)
  }

  #createFields(plots) {
    const sx = this.map.width / 3200
    const sy = this.map.height / 2200
    const defaults = this.map.clearings?.length
      ? this.map.clearings
      : [
          { x: 450, y: 790 }, { x: 850, y: 1320 }, { x: 550, y: 1740 },
          { x: 2510, y: 800 }, { x: 2770, y: 1330 }, { x: 2480, y: 1790 },
        ].map(point => fieldPoint(point, sx, sy))
    const centers = plots == null ? defaults : plots
    if (!Array.isArray(centers)) throw new TypeError('plots must be an array of positions.')
    const rng = seededRandom(this.seed)
    const config = this.config
    const fit = Math.min(sx, sy)
    const width = clamp(config.width * fit, 54, config.width)
    const height = clamp(config.height * fit, 54, config.height)

    for (const point of centers) {
      if (!at(point)) continue
      const x = point.x, y = point.y
      const halfWidth = width / 2, halfHeight = height / 2
      if (x - halfWidth < 18 || x + halfWidth > this.map.width - 18 ||
          y - halfHeight < 18 || y + halfHeight > this.map.height - 18) continue
      // Prevent fields on rivers or inaccessible ground. Keep open farm centers.
      if (!this.map.isWalkable(x, y, 4)) continue
      const id = `rice-field-${this.fields.length + 1}`
      const field = { id, x, y, width, height, plants: [] }
      const spacingX = width / config.columns
      const spacingY = height / config.rows
      for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.columns; col++) {
          const px = x - halfWidth + (col + 0.5) * spacingX
          const py = y - halfHeight + (row + 0.5) * spacingY
          if (!this.map.isWalkable(px, py, 2)) continue
          const age = rng() < config.initialReadyFraction
            ? config.growSeconds
            : config.growSeconds * (0.12 + rng() * 0.8)
          const plant = {
            id: `${id}-p${row * config.columns + col + 1}`,
            fieldId: id,
            x: px,
            y: py,
            age,
            growthSeconds: config.growSeconds * (0.88 + rng() * 0.24),
            yield: config.yieldPerPlant,
            phase: rng() * TAU,
            harvests: 0,
          }
          // Ready seeds must remain ready despite slight growth-time variations.
          if (age === config.growSeconds) plant.age = plant.growthSeconds
          field.plants.push(plant)
          this.plants.push(plant)
          this.byId.set(plant.id, plant)
        }
      }
      if (field.plants.length) this.fields.push(field)
    }
  }

  getFields() { return this.fields }

  getFieldAt(point, padding = 0) {
    if (!at(point)) return null
    const pad = Math.max(0, finite(padding) ? padding : 0)
    return this.fields.find(field =>
      Math.abs(point.x - field.x) <= field.width / 2 + pad &&
      Math.abs(point.y - field.y) <= field.height / 2 + pad) || null
  }

  getPhase(plant) {
    if (!plant) return 'missing'
    if (plant.age < 0) return 'harvested'
    const progress = clamp(plant.age / plant.growthSeconds, 0, 1)
    if (progress >= 1) return 'ripe'
    if (progress < 0.22) return 'seedling'
    if (progress < 0.64) return 'growing'
    return 'ripening'
  }

  getProgress(plant) {
    return plant ? clamp(plant.age / plant.growthSeconds, 0, 1) : 0
  }

  isRipe(plant) { return this.getPhase(plant) === 'ripe' }

  update(deltaSeconds = 0) {
    if (!finite(deltaSeconds) || deltaSeconds <= 0) return
    const delta = clamp(deltaSeconds, 0, 0.1)
    this.time += delta
    for (const plant of this.plants) {
      if (plant.age < plant.growthSeconds) {
        plant.age = Math.min(plant.growthSeconds, plant.age + delta)
      }
    }
  }

  /** Find the closest ready plant, optionally limited to a farm field. */
  getNearestRipe(point, { maxDistance = Infinity, fieldId = null } = {}) {
    if (!at(point)) return null
    const max = finite(maxDistance) && maxDistance >= 0 ? maxDistance : Infinity
    let best = null, bestDistanceSq = square(max)
    for (const plant of this.plants) {
      if ((fieldId && plant.fieldId !== fieldId) || !this.isRipe(plant)) continue
      const d = square(plant.x - point.x) + square(plant.y - point.y)
      if (d <= bestDistanceSq) { best = plant; bestDistanceSq = d }
    }
    return best
  }

  /** Nearest safe standing point for harvest: compatible with Pathfinding.moveUnit. */
  getHarvestTarget(point, options = {}) {
    const plant = this.getNearestRipe(point, options)
    if (!plant) return null
    const radius = Math.max(1, finite(options.radius) ? options.radius : 14)
    if (this.map.isWalkable(plant.x, plant.y, radius)) {
      return { x: plant.x, y: plant.y, plantId: plant.id, fieldId: plant.fieldId }
    }
    for (let ring = 14; ring <= this.config.harvestRange; ring += 8) {
      for (let i = 0; i < 12; i++) {
        const angle = TAU * i / 12
        const x = plant.x + Math.cos(angle) * ring
        const y = plant.y + Math.sin(angle) * ring
        if (this.map.isWalkable(x, y, radius)) {
          return { x, y, plantId: plant.id, fieldId: plant.fieldId }
        }
      }
    }
    return null
  }

  #getPlant(plantOrId) {
    if (typeof plantOrId === 'string') return this.byId.get(plantOrId) || null
    if (plantOrId?.id) return this.byId.get(plantOrId.id) || null
    return null
  }

  /**
   * Harvest exactly one ripe plant. The farmer must be in reach and have room.
   * Nothing is added to stored rice until deposit() is called at the base.
   */
  harvestPlant(plantOrId, farmer) {
    const plant = this.#getPlant(plantOrId)
    if (!plant) return { ok: false, reason: 'not_found', amount: 0 }
    if (!this.isRipe(plant)) return { ok: false, reason: 'not_ripe', amount: 0 }
    if (!farmer || !at(farmer) || farmer.alive === false ||
        (finite(farmer.hp) && farmer.hp <= 0) || farmer.team === 'red') {
      return { ok: false, reason: 'invalid_farmer', amount: 0 }
    }
    if (distance(plant, farmer) > this.config.harvestRange) {
      return { ok: false, reason: 'too_far', amount: 0 }
    }
    const carrying = Math.max(0, Math.floor(finite(farmer.carry) ? farmer.carry : 0))
    const room = Math.max(0, this.config.carryingCapacity - carrying)
    if (room <= 0) return { ok: false, reason: 'full', amount: 0 }
    if (room < plant.yield) {
      return { ok: false, reason: 'not_enough_capacity', amount: 0 }
    }

    // A plant is harvested only once per growing cycle (no double collecting).
    const amount = plant.yield
    plant.age = -this.config.restSeconds
    plant.harvests += 1
    farmer.carry = carrying + amount
    this.totalHarvested += amount
    this.harvestCount += 1
    farmer.setHarvestAnimation?.(true)
    return { ok: true, reason: 'harvested', amount, carrying: farmer.carry,
      capacity: this.config.carryingCapacity, plantId: plant.id, fieldId: plant.fieldId }
  }

  /** Take the nearest ripe plant within reach of the given farmer. */
  harvestNear(farmer) {
    if (!farmer || !at(farmer)) return { ok: false, reason: 'invalid_farmer', amount: 0 }
    const plant = this.getNearestRipe(farmer, { maxDistance: this.config.harvestRange })
    if (!plant) return { ok: false, reason: 'no_ripe_plant_in_range', amount: 0 }
    return this.harvestPlant(plant, farmer)
  }

  /** Deposit only if the farmer reached the base. Prevents remote deposits. */
  deposit(farmer, home = this.map.getSpawnPoint?.(farmer?.team || 'blue')) {
    if (!farmer || !at(farmer) || !at(home) || farmer.alive === false ||
        (finite(farmer.hp) && farmer.hp <= 0) || farmer.team === 'red') {
      return { ok: false, reason: 'invalid_farmer_or_home', amount: 0 }
    }
    if (distance(farmer, home) > this.config.depositRange) {
      return { ok: false, reason: 'too_far', amount: 0 }
    }
    const amount = Math.max(0, Math.floor(finite(farmer.carry) ? farmer.carry : 0))
    if (!amount) return { ok: false, reason: 'empty', amount: 0 }
    farmer.carry = 0
    this.rice += amount
    this.totalDeposited += amount
    return { ok: true, reason: 'deposited', amount, rice: this.rice }
  }

  /** Admin/test economy hook. This does not create any database request. */
  setStorageRice(amount) {
    if (!finite(amount) || amount < 0 || !Number.isSafeInteger(Math.floor(amount))) return false
    this.rice = Math.floor(amount)
    return true
  }

  getResources() {
    return { rice: this.rice }
  }

  getSummary() {
    const plants = { total: this.plants.length, ripe: 0, harvested: 0,
      seedling: 0, growing: 0, ripening: 0 }
    for (const plant of this.plants) plants[this.getPhase(plant)] += 1
    return { fields: this.fields.length, plants, rice: this.rice,
      totalHarvested: this.totalHarvested, totalDeposited: this.totalDeposited,
      harvestCount: this.harvestCount, elapsedSeconds: this.time }
  }

  reset() {
    // Full deterministic reset; keeps the same config and map.
    this.rice = this.initialRice
    this.totalHarvested = 0
    this.totalDeposited = 0
    this.harvestCount = 0
    this.time = 0
    this.fields = []
    this.plants = []
    this.byId.clear()
    this.#createFields(this._customPlotOrigins || null)
  }

  #withWorld(ctx, camera, draw) {
    if (!ctx || !camera || typeof camera.getVisibleBounds !== 'function') return
    ctx.save()
    ctx.translate(camera.viewportWidth / 2 - camera.x * camera.zoom,
      camera.viewportHeight / 2 - camera.y * camera.zoom * camera.tilt)
    ctx.scale(camera.zoom, camera.zoom * camera.tilt)
    draw(camera.getVisibleBounds())
    ctx.restore()
  }

  drawGround(ctx, camera) {
    this.#withWorld(ctx, camera, bounds => {
      for (const field of this.fields) {
        const hw = field.width / 2, hh = field.height / 2
        if (field.x + hw < bounds.left || field.x - hw > bounds.right ||
            field.y + hh < bounds.top || field.y - hh > bounds.bottom) continue
        const x = field.x - hw, y = field.y - hh
        ctx.fillStyle = '#687b3d'
        ctx.fillRect(x - 5, y - 5, field.width + 10, field.height + 10)
        ctx.fillStyle = '#9a7850'
        ctx.fillRect(x - 1, y - 1, field.width + 2, field.height + 2)
        ctx.fillStyle = '#67533d'
        ctx.fillRect(x + 4, y + 4, field.width - 8, field.height - 8)
        for (let row = 0; row < this.config.rows; row++) {
          const ry = y + (row + 0.5) * field.height / this.config.rows
          ctx.fillStyle = row % 2 ? '#886b46' : '#92764e'
          ctx.fillRect(x + 5, ry - 5, field.width - 10, 10)
          ctx.strokeStyle = 'rgba(198,219,135,.35)'
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.moveTo(x + 5, ry + 5)
          ctx.lineTo(x + field.width - 5, ry + 5)
          ctx.stroke()
        }
      }
    })
  }

  #drawPlant(ctx, plant, tilt) {
    const phase = this.getPhase(plant)
    if (phase === 'harvested') {
      ellipse(ctx, plant.x, plant.y, 5, 2, 'rgba(63,87,34,.45)')
      return
    }
    const progress = this.getProgress(plant)
    const height = 5 + progress * 28
    const sway = Math.sin(this.time * 1.6 + plant.phase) * (0.7 + progress * 1.3)
    const mature = phase === 'ripe'
    const green = phase === 'seedling' ? '#8ab65f' : phase === 'growing' ? '#448d50' : '#a3a849'
    const bright = mature ? '#e9d07c' : phase === 'ripening' ? '#b9bb57' : '#70ac59'
    ctx.save()
    ctx.translate(plant.x, plant.y)
    ctx.scale(1, 1 / tilt)
    ctx.lineCap = 'round'
    for (let i = -2; i <= 2; i++) {
      const shift = i * 2.1
      const tip = sway + i * 1.8
      stroke(ctx, shift, 0, shift + tip, -height * (0.7 + 0.05 * (2 - Math.abs(i))), green, 2)
      if (progress > 0.42) {
        stroke(ctx, shift, -height * 0.47, shift - 3.5, -height * 0.65, bright, 1.4)
      }
      if (progress > 0.72) {
        stroke(ctx, shift + tip, -height * .92, shift + tip + 4, -height * .79,
          mature ? '#e1bf52' : '#a7b65c', 1.6)
      }
    }
    if (mature) {
      for (let i = -2; i <= 2; i++) {
        const gx = i * 2.1 + sway + i * 1.8 + 4
        for (let k = 0; k < 3; k++) {
          ellipse(ctx, gx + k * .8, -height * .78 - k * 3,
            1.6, 2.4, k % 2 ? '#e0b854' : '#f4dd8a')
        }
      }
    }
    ctx.restore()
  }

  drawCrops(ctx, camera) {
    this.#withWorld(ctx, camera, bounds => {
      for (const plant of this.plants) {
        if (plant.x < bounds.left - 20 || plant.x > bounds.right + 20 ||
            plant.y < bounds.top - 25 || plant.y > bounds.bottom + 60) continue
        this.#drawPlant(ctx, plant, camera.tilt)
      }
    })
  }

  draw(ctx, camera) {
    this.drawGround(ctx, camera)
    this.drawCrops(ctx, camera)
  }
}

export default RiceSystem
