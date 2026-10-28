/**
 * Shadow Realms — CombatSystem
 * Team-aware target selection, attack orders, melee and ranged attacks,
 * cooldowns, chase paths, guard/attack-move and combat indicators.
 * Integration: getUnits must return BOTH allied farmers and enemyAI.getUnits().
 *
 * const combat = new CombatSystem({health, projectiles, navigation,
 *   getUnits: () => [...farmers, ...enemyAI.getUnits()]})
 * combat.orderAttack([farmer.id], raider.id)
 * combat.update(dt) // after units update, before projectile update
 *
 * Existing Farmer has no attack properties: defaults below are only a weak
 * defensive attack; combat units can override attackDamage/Range/Cooldown.
 */
const finite = Number.isFinite
const isPoint = value => finite(value?.x) && finite(value?.y)
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

export class CombatSystem {
  constructor({health, projectiles = null, navigation = null, getUnits = () => [],
    autoDefend = false, onEvent = null} = {}) {
    if (!health || typeof health.damage !== 'function') throw new TypeError('CombatSystem requires HealthSystem')
    this.health = health
    this.projectiles = projectiles
    this.navigation = navigation
    this.getUnits = typeof getUnits === 'function' ? getUnits : () => getUnits
    this.autoDefend = autoDefend
    this.onEvent = onEvent
    this.orders = new Map()
    this.cooldowns = new Map()
    this.pathTimers = new Map()
    this.time = 0
  }

  units() {return (this.getUnits() || []).filter(u => u?.id != null && isPoint(u))}
  getUnit(id) {return this.units().find(u => u.id === id) || null}
  isHostile(a, b) {return a && b && a.id !== b.id && a.team != null && b.team != null && a.team !== b.team}
  isAlive(u) {return u && this.health.isAlive(u)}

  #order(ids, build) {
    if (!Array.isArray(ids)) ids = [ids]
    let count = 0
    for (const id of new Set(ids)) {
      const unit = this.getUnit(id)
      if (!this.isAlive(unit)) continue
      const order = build(unit)
      if (!order) continue
      this.orders.set(id, order)
      this.pathTimers.delete(id)
      count++
    }
    return count
  }

  orderAttack(unitIds, targetId) {
    const target = this.getUnit(targetId)
    if (!this.isAlive(target)) return 0
    return this.#order(unitIds, unit => this.isHostile(unit, target)
      ? {type: 'attack', targetId, issuedAt: this.time} : null)
  }

  orderAttackMove(unitIds, destination, {acquireRange = 300} = {}) {
    if (!isPoint(destination)) return 0
    return this.#order(unitIds, () => ({type: 'attackMove', destination: {x: destination.x, y: destination.y},
      acquireRange: clamp(acquireRange, 40, 900), issuedAt: this.time}))
  }

  orderGuard(unitIds, point = null, {radius = 280} = {}) {
    return this.#order(unitIds, unit => ({type:'guard', point: isPoint(point) ? {...point} : {x: unit.x, y: unit.y},
      radius: clamp(radius, 50, 1000), issuedAt: this.time}))
  }

  orderStop(unitIds) {
    if (!Array.isArray(unitIds)) unitIds = [unitIds]
    let stopped = 0
    for (const id of unitIds) {
      if (this.orders.delete(id)) stopped++
      this.cooldowns.delete(id)
      this.pathTimers.delete(id)
      const unit = this.getUnit(id)
      if (unit && this.isAlive(unit)) unit.stop?.()
    }
    return stopped
  }

  getOrder(id) {return this.orders.get(id) || null}

  #nearestEnemy(unit, maxDistance, units, guardPoint = null) {
    let nearest = null, best = maxDistance
    for (const target of units) {
      if (!this.isHostile(unit, target) || !this.isAlive(target)) continue
      if (guardPoint && distance(target, guardPoint) > maxDistance) continue
      const d = distance(unit, target)
      if (d < best) {nearest = target; best = d}
    }
    return nearest
  }

  #approach(unit, target, range, dt) {
    if (!this.navigation || !this.isAlive(unit)) return
    const next = (this.pathTimers.get(unit.id) || 0) - dt
    this.pathTimers.set(unit.id, next)
    if (next > 0 && unit.state === 'walking') return
    // Arrive just outside the target's collision body, not directly on top.
    const d = Math.max(.001, distance(unit, target))
    const standDistance = Math.max((unit.radius || 12) + (target.radius || 12) + 4, range * .78)
    const point = {x: target.x + (unit.x - target.x) / d * standDistance,
      y: target.y + (unit.y - target.y) / d * standDistance}
    const moved = this.navigation.moveUnit(unit, point)
    if (!moved) this.navigation.moveUnit(unit, {x:target.x,y:target.y})
    this.pathTimers.set(unit.id, .65)
  }

  #engage(unit, target, dt) {
    if (!this.isAlive(target) || !this.isHostile(unit, target)) return false
    const range = clamp(finite(unit.attackRange) ? unit.attackRange : 39, 24, 900)
    const d = distance(unit, target)
    if (d > range + (target.radius || 12) * .3) {
      this.#approach(unit, target, range, dt)
      return true
    }
    // Stop combat movement, not another player's idle guard position.
    if (unit.state === 'walking' && this.orders.has(unit.id)) unit.stop?.()
    if ((this.cooldowns.get(unit.id) || 0) > 0) return true
    const damage = clamp(finite(unit.attackDamage) ? unit.attackDamage : 5, 1, 1000)
    const cooldown = clamp(finite(unit.attackCooldown) ? unit.attackCooldown : 1.35, .15, 10)
    const ranged = unit.attackType === 'ranged' || range > 85
    if (ranged) {
      if (!this.projectiles) return true
      const result = this.projectiles.fire(unit, target, {
        damage, range: range + 90, speed: unit.projectileSpeed || 440,
        color: unit.team === 'red' ? '#f2a77a' : '#f1dfa1',
      })
      if (!result) return true
    } else this.health.damage(target, damage, {source: unit, type: 'melee'})
    this.cooldowns.set(unit.id, cooldown)
    this.onEvent?.('attack', {unit, target, damage, ranged})
    return true
  }

  update(dt) {
    if (!finite(dt) || dt <= 0) return
    const seconds = Math.min(dt, .1)
    this.time += seconds
    const units = this.units()
    const byId = new Map(units.map(unit => [unit.id, unit]))
    for (const [id, time] of this.cooldowns) {
      if (!byId.has(id)) this.cooldowns.delete(id)
      else this.cooldowns.set(id, Math.max(0, time - seconds))
    }
    for (const [id, order] of this.orders) {
      const unit = byId.get(id)
      if (!this.isAlive(unit)) {this.orders.delete(id);this.pathTimers.delete(id);continue}
      if (order.type === 'attack') {
        const target = byId.get(order.targetId)
        if (!this.isAlive(target) || !this.isHostile(unit, target)) {
          this.orders.delete(id); this.pathTimers.delete(id); continue
        }
        this.#engage(unit, target, seconds)
      } else if (order.type === 'attackMove') {
        const enemy = this.#nearestEnemy(unit, order.acquireRange, units)
        if (enemy) this.#engage(unit, enemy, seconds)
        else if (distance(unit, order.destination) > Math.max(16, unit.radius || 12)) {
          this.#approach(unit, order.destination, 20, seconds)
        } else this.orders.delete(id)
      } else if (order.type === 'guard') {
        const enemy = this.#nearestEnemy(unit, order.radius, units, order.point)
        if (enemy) this.#engage(unit, enemy, seconds)
        else if (distance(unit, order.point) > 55) this.#approach(unit, order.point, 20, seconds)
      }
    }
    if (this.autoDefend) for (const unit of units) {
      if (!this.isAlive(unit) || this.orders.has(unit.id) || unit.isCivilian === true) continue
      if (unit.state === 'harvesting' || unit.state === 'walking') continue
      const enemy = this.#nearestEnemy(unit, finite(unit.aggroRange) ? unit.aggroRange : 145, units)
      if (enemy) this.#engage(unit, enemy, seconds)
    }
  }

  draw(ctx, camera) {
    if (!ctx || !camera) return
    ctx.save()
    ctx.lineWidth = 1.2
    for (const [id, order] of this.orders) {
      const unit = this.getUnit(id)
      if (!this.isAlive(unit)) continue
      const target = order.type === 'attack' ? this.getUnit(order.targetId) : null
      if (!target || !this.isAlive(target)) continue
      const p = camera.worldToScreen(target.x, target.y)
      ctx.strokeStyle = unit.team === 'red' ? 'rgba(233,109,93,.6)' : 'rgba(242,215,121,.65)'
      ctx.beginPath();ctx.arc(p.x, p.y, Math.max(12, (target.radius || 13) * camera.zoom), 0, Math.PI * 2);ctx.stroke()
    }
    ctx.restore()
  }

  getSummary() {return {activeOrders: this.orders.size, cooldowns: this.cooldowns.size}}
  reset() {this.orders.clear();this.cooldowns.clear();this.pathTimers.clear();this.time = 0}
}

export default CombatSystem
