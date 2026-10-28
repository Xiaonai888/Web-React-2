/**
 * Shadow Realms — UnitAnimationSystem (Step 18, NEW).
 * Presentation-only animation states. Does not mutate Farmer motion/combat orders.
 * No assets, network, storage, timers or dependencies.
 */
const clamp = (n, a, b) => Math.min(b, Math.max(a, n))
const DURATIONS = Object.freeze({ attack: 0.33, hit: 0.24, build: 0.58, harvest: 0.54, cheer: 0.8 })

export class UnitAnimationSystem {
  constructor({ reducedMotion = false, speed = 1 } = {}) {
    this.reducedMotion = Boolean(reducedMotion)
    this.speed = clamp(Number.isFinite(speed) ? speed : 1, 0.2, 3)
    this.states = new WeakMap()
    this.time = 0
  }

  #state(unit) {
    let state = this.states.get(unit)
    if (!state) {
      state = { action: null, remaining: 0, duration: 0, elapsed: 0, flash: 0, pulse: 0 }
      this.states.set(unit, state)
    }
    return state
  }

  /** Visual action: does not interrupt a Farmer's actual path or work. */
  signal(unit, action = 'attack', duration = null) {
    if (!unit || typeof unit !== 'object' || unit.alive === false) return false
    if (typeof action !== 'string' || !DURATIONS[action]) return false
    const state = this.#state(unit)
    state.action = action
    state.duration = clamp(Number.isFinite(duration) ? duration : DURATIONS[action], 0.05, 4)
    state.remaining = state.duration
    state.elapsed = 0
    if (action === 'hit') state.flash = Math.max(state.flash, 0.17)
    return true
  }

  update(dt, units = []) {
    if (!Number.isFinite(dt) || dt <= 0) return
    const delta = Math.min(0.1, dt) * this.speed
    this.time += delta
    for (const unit of units || []) {
      if (!unit || typeof unit !== 'object') continue
      const state = this.#state(unit)
      if (state.remaining > 0) {
        state.remaining = Math.max(0, state.remaining - delta)
        state.elapsed += delta
        if (state.remaining <= 0) state.action = null
      }
      state.flash = Math.max(0, state.flash - delta)
      state.pulse = Math.max(0, state.pulse - delta)
    }
  }

  frame(unit) {
    if (!unit || typeof unit !== 'object') return { state: 'idle', facing: 'down', bob: 0, stride: 0, action: null, actionProgress: 0, flash: 0, time: this.time }
    const state = this.#state(unit)
    const walking = unit.state === 'walking' && unit.alive !== false
    const harvesting = unit.state === 'harvesting'
    const building = unit.state === 'building'
    const strideTime = Number.isFinite(unit.motionTime) ? unit.motionTime : this.time * 8
    const t = Number.isFinite(unit.lifetime) ? unit.lifetime : this.time
    const stride = this.reducedMotion ? 0 : walking ? Math.sin(strideTime) : 0
    const bob = this.reducedMotion ? 0 : walking ? Math.abs(Math.sin(strideTime)) * 2.7 : Math.sin(t * 2) * 0.5
    const progress = state.action && state.duration > 0 ? clamp(state.elapsed / state.duration, 0, 1) : 0
    const swing = this.reducedMotion ? 0 : state.action === 'attack' ? Math.sin(progress * Math.PI) : harvesting || building ? Math.sin(t * 11) * 0.48 : 0
    return {
      state: unit.alive === false || unit.hp === 0 ? 'dead' : unit.state || 'idle',
      facing: unit.facing || 'down', action: state.action, actionProgress: progress,
      bob, stride, swing, flash: state.flash / 0.17, time: this.time,
      isWalking: walking, reducedMotion: this.reducedMotion,
    }
  }

  reset(unit = null) {
    if (unit && typeof unit === 'object') this.states.delete(unit)
    else { this.states = new WeakMap(); this.time = 0 }
  }
}
export default UnitAnimationSystem
