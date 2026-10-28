/**
 * Shadow Realms — HealthSystem
 * One source of truth for HP, damage, healing, armor, deaths and health bars.
 * Works with the existing Farmer.takeDamage() without changing Farmer.js.
 * No storage, browser globals, server calls or third-party dependencies.
 *
 * const health = new HealthSystem({getUnits: () => [...farmers, ...enemyAI.getUnits()]})
 * health.damage(enemy, 12, {source: farmer})
 * health.update(dt); health.draw(ctx, camera)
 */
const valid = n => Number.isFinite(n)
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n))

export class HealthSystem {
  constructor({getUnits = () => [], onEvent = null} = {}) {
    this.getUnits = typeof getUnits === 'function' ? getUnits : () => getUnits
    this.onEvent = onEvent
    this.registered = new Map()
    this.deadNotified = new WeakSet()
  }

  register(unit) {
    if (!unit || unit.id == null) return false
    this.registered.set(unit.id, unit)
    this.#normalize(unit)
    return true
  }

  unregister(id) { return this.registered.delete(typeof id === 'object' ? id?.id : id) }

  units() {
    const all = new Map(this.registered)
    const dynamic = this.getUnits()
    if (Array.isArray(dynamic)) for (const u of dynamic) if (u?.id != null) all.set(u.id, u)
    return [...all.values()]
  }

  resolve(value) {
    if (value && typeof value === 'object') return value
    return this.units().find(u => u.id === value) || null
  }

  #normalize(unit) {
    const hp = valid(unit.hp) ? Math.max(0, unit.hp) : 100
    const max = valid(unit.maxHp) && unit.maxHp > 0 ? unit.maxHp : Math.max(100, hp)
    unit.maxHp = max
    unit.hp = clamp(hp, 0, max)
    if (unit.hp <= 0) { unit.alive = false; unit.selectable = false }
    else if (unit.alive == null) unit.alive = true
    return unit
  }

  isAlive(value) {
    const unit = this.resolve(value)
    return !!unit && unit.alive !== false && valid(unit.hp) && unit.hp > 0
  }

  damage(target, amount, {source = null, type = 'physical', ignoreArmor = false} = {}) {
    const unit = this.resolve(target)
    if (!unit || !valid(amount) || amount <= 0) return {ok: false, reason: 'invalid', applied: 0, killed: false}
    this.#normalize(unit)
    if (!this.isAlive(unit)) return {ok: false, reason: 'dead', applied: 0, killed: false}
    const armor = ignoreArmor ? 0 : clamp(valid(unit.armor) ? unit.armor : 0, 0, 9999)
    const requested = Math.min(unit.hp, Math.max(1, Math.round(amount - armor)))
    const before = unit.hp
    if (typeof unit.takeDamage === 'function') unit.takeDamage(requested)
    else unit.hp = Math.max(0, before - requested)
    unit.hp = clamp(valid(unit.hp) ? unit.hp : before - requested, 0, unit.maxHp)
    const applied = Math.max(0, before - unit.hp)
    const killed = unit.hp <= 0 || unit.alive === false
    if (killed) { unit.hp = 0; unit.alive = false; unit.selectable = false; unit.stop?.() }
    if (applied > 0) this.onEvent?.('damage', {unit, source, applied, type, killed})
    if (killed && !this.deadNotified.has(unit)) {
      this.deadNotified.add(unit)
      this.onEvent?.('death', {unit, source, type})
    }
    return {ok: true, applied, remaining: unit.hp, killed}
  }

  heal(target, amount) {
    const unit = this.resolve(target)
    if (!unit || !valid(amount) || amount <= 0) return 0
    this.#normalize(unit)
    if (!this.isAlive(unit)) return 0  // No accidental resurrection.
    const before = unit.hp
    unit.hp = clamp(unit.hp + amount, 0, unit.maxHp)
    const applied = unit.hp - before
    if (applied) this.onEvent?.('heal', {unit, applied})
    return applied
  }

  update(dt) {
    if (!valid(dt) || dt <= 0) return
    const seconds = Math.min(dt, 0.1)
    for (const unit of this.units()) {
      if (this.isAlive(unit) && valid(unit.regen) && unit.regen > 0 && unit.hp < unit.maxHp) {
        this.heal(unit, unit.regen * seconds)
      }
    }
  }

  getStatus(value) {
    const unit = this.resolve(value)
    if (!unit) return null
    this.#normalize(unit)
    return {id: unit.id, hp: unit.hp, maxHp: unit.maxHp,
      fraction: clamp(unit.hp / unit.maxHp, 0, 1), alive: this.isAlive(unit), team: unit.team}
  }

  draw(ctx, camera, {showFull = false} = {}) {
    if (!ctx || !camera) return
    ctx.save()
    for (const unit of this.units()) {
      if (!this.isAlive(unit) || (!showFull && unit.hp >= unit.maxHp)) continue
      if (!valid(unit.x) || !valid(unit.y)) continue
      const p = camera.worldToScreen(unit.x, unit.y)
      if (p.x < -50 || p.y < -100 || p.x > camera.viewportWidth + 50 || p.y > camera.viewportHeight + 50) continue
      const width = Math.max(24, Math.min(48, 36 * camera.zoom))
      const y = p.y - Math.max(31, 68 * camera.zoom)
      const x = p.x - width / 2
      ctx.fillStyle = 'rgba(16,22,16,.8)'; ctx.fillRect(x - 1, y - 1, width + 2, 6)
      const fraction = clamp(unit.hp / unit.maxHp, 0, 1)
      ctx.fillStyle = fraction > .6 ? '#75d978' : fraction > .3 ? '#e5c75e' : '#e86760'
      ctx.fillRect(x, y, width * fraction, 4)
    }
    ctx.restore()
  }

  reset() { this.registered.clear(); this.deadNotified = new WeakSet() }
}

export default HealthSystem
