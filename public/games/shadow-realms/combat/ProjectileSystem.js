/**
 * Shadow Realms — ProjectileSystem
 * Browser-only ranged combat, swept collision, optional homing, AoE and effects.
 * Do not add units twice: getUnits() should combine player and enemy units.
 *
 * const projectiles = new ProjectileSystem({health, getUnits: () => allUnits})
 * projectiles.fire(shooter, enemy, {damage: 10, speed: 410})
 * projectiles.update(dt); projectiles.draw(ctx, camera)
 */
const finite = Number.isFinite
const point = p => finite(p?.x) && finite(p?.y)
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

function sweep(a, b, target, radius) {
  const dx = b.x - a.x, dy = b.y - a.y
  const magnitude = dx * dx + dy * dy
  const t = magnitude ? clamp(((target.x - a.x) * dx + (target.y - a.y) * dy) / magnitude, 0, 1) : 0
  const x = a.x + dx * t, y = a.y + dy * t
  return (target.x - x) ** 2 + (target.y - y) ** 2 <= radius ** 2 ? t : null
}

export class ProjectileSystem {
  constructor({health, map = null, getUnits = () => [], maxProjectiles = 250, onEvent = null} = {}) {
    if (!health || typeof health.damage !== 'function') throw new TypeError('ProjectileSystem needs HealthSystem')
    this.health = health
    this.map = map
    this.getUnits = typeof getUnits === 'function' ? getUnits : () => getUnits
    this.maxProjectiles = Math.max(1, Math.floor(maxProjectiles))
    this.onEvent = onEvent
    this.projectiles = []
    this.impacts = []
    this.nextId = 1
  }

  spawn({from, target = null, targetId = null, direction = null, ownerId = null, team = null,
    damage = 10, speed = 430, range = 470, radius = 4, blastRadius = 0,
    homing = false, friendlyFire = false, blockTerrain = false, color = '#e7d299'} = {}) {
    if (!point(from) || this.projectiles.length >= this.maxProjectiles) return null
    const aim = point(target) ? target : point(direction) ? {x: from.x + direction.x, y: from.y + direction.y} : null
    if (!aim || dist(from, aim) < .1) return null
    const angle = Math.atan2(aim.y - from.y, aim.x - from.x)
    const p = {id: `arrow-${this.nextId++}`, x: from.x, y: from.y, lastX: from.x, lastY: from.y,
      vx: Math.cos(angle) * Math.max(1, speed), vy: Math.sin(angle) * Math.max(1, speed),
      damage: Math.max(0, damage), radius: Math.max(1, radius), remaining: Math.max(1, range),
      blastRadius: Math.max(0, blastRadius), homing, friendlyFire, blockTerrain,
      ownerId, team, targetId: targetId ?? target?.id ?? null, color}
    this.projectiles.push(p)
    this.onEvent?.('shot', {projectile: p})
    return p
  }

  fire(attacker, target, options = {}) {
    if (!point(attacker) || !point(target) || attacker.alive === false || target.alive === false) return null
    const offset = Math.max(8, (attacker.radius || 12) * .6)
    const direction = {x: target.x - attacker.x, y: target.y - attacker.y}
    const len = Math.hypot(direction.x, direction.y) || 1
    return this.spawn({from: {x: attacker.x + direction.x / len * offset,
      y: attacker.y + direction.y / len * offset}, target, targetId: target.id,
      ownerId: attacker.id, team: attacker.team,
      damage: attacker.attackDamage || 10, range: attacker.attackRange || 480, ...options})
  }

  #validTarget(p, unit) {
    return point(unit) && unit.id !== p.ownerId && unit.alive !== false &&
      finite(unit.hp) && unit.hp > 0 && (p.friendlyFire || unit.team !== p.team)
  }

  #impact(p, target, where, units) {
    if (target) this.health.damage(target, p.damage, {source: p.ownerId, type: 'projectile'})
    if (p.blastRadius > 0) for (const unit of units) {
      if (unit === target || !this.#validTarget(p, unit)) continue
      const d = dist(where, unit)
      if (d <= p.blastRadius + (unit.radius || 12)) {
        const scaled = p.damage * (1 - clamp(d / (p.blastRadius + (unit.radius || 12)), 0, .85))
        this.health.damage(unit, scaled, {source: p.ownerId, type: 'splash'})
      }
    }
    this.impacts.push({x: where.x, y: where.y, age: 0, color: p.color})
    this.onEvent?.('impact', {projectile: p, target, position: where})
  }

  update(dt) {
    if (!finite(dt) || dt <= 0) return
    const seconds = Math.min(dt, .05)
    const units = this.getUnits() || []
    const survivors = []
    for (const p of this.projectiles) {
      const target = p.homing ? units.find(u => u.id === p.targetId && this.#validTarget(p, u)) : null
      if (target) {
        const angle = Math.atan2(target.y - p.y, target.x - p.x)
        const speed = Math.hypot(p.vx, p.vy)
        const change = Math.min(1, seconds * 5)
        const vx = Math.cos(angle) * speed, vy = Math.sin(angle) * speed
        p.vx = p.vx * (1 - change) + vx * change
        p.vy = p.vy * (1 - change) + vy * change
        const len = Math.hypot(p.vx, p.vy) || 1
        p.vx *= speed / len; p.vy *= speed / len
      }
      const a = {x: p.x, y: p.y}
      const travel = Math.min(Math.hypot(p.vx, p.vy) * seconds, p.remaining)
      const speed = Math.hypot(p.vx, p.vy) || 1
      const b = {x: a.x + p.vx / speed * travel, y: a.y + p.vy / speed * travel}
      let first = null, firstT = Infinity
      for (const unit of units) {
        if (!this.#validTarget(p, unit)) continue
        const t = sweep(a, b, unit, (unit.radius || 12) + p.radius)
        if (t !== null && t < firstT) {firstT = t; first = unit}
      }
      if (p.blockTerrain && this.map?.isWalkable) {
        const steps = Math.max(1, Math.ceil(travel / 12))
        for (let i = 1; i <= steps; i++) {
          const t = i / steps
          const x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t
          if (!this.map.isWalkable(x, y, 0)) {
            if (t < firstT) {firstT = t; first = null}
            break
          }
        }
      }
      p.lastX = p.x; p.lastY = p.y
      p.x = firstT < Infinity ? a.x + (b.x - a.x) * firstT : b.x
      p.y = firstT < Infinity ? a.y + (b.y - a.y) * firstT : b.y
      p.remaining -= travel * (firstT < Infinity ? firstT : 1)
      if (firstT < Infinity) this.#impact(p, first, p, units)
      else if (p.remaining > .01) survivors.push(p)
    }
    this.projectiles = survivors
    for (const effect of this.impacts) effect.age += seconds
    this.impacts = this.impacts.filter(effect => effect.age < .26).slice(-100)
  }

  draw(ctx, camera) {
    if (!ctx || !camera) return
    ctx.save()
    for (const p of this.projectiles) {
      const a = camera.worldToScreen(p.x, p.y)
      const angle = Math.atan2(p.vy * (camera.tilt || 1), p.vx)
      ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(angle)
      ctx.strokeStyle = '#55472a'; ctx.lineWidth = 3; ctx.beginPath();ctx.moveTo(-12, 0);ctx.lineTo(5, 0);ctx.stroke()
      ctx.fillStyle = p.color;ctx.beginPath();ctx.moveTo(8, 0);ctx.lineTo(1, -4);ctx.lineTo(1, 4);ctx.closePath();ctx.fill()
      ctx.restore()
    }
    for (const effect of this.impacts) {
      const a = camera.worldToScreen(effect.x, effect.y)
      ctx.globalAlpha = 1 - effect.age / .26
      ctx.strokeStyle = effect.color;ctx.lineWidth = 2
      ctx.beginPath();ctx.arc(a.x, a.y, 5 + 13 * effect.age / .26, 0, 2 * Math.PI);ctx.stroke()
    }
    ctx.restore()
  }

  getSummary() {return {flying: this.projectiles.length, impacts: this.impacts.length}}
  reset() {this.projectiles = []; this.impacts = []}
}

export default ProjectileSystem
