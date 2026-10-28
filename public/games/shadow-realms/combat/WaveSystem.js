/**
 * Shadow Realms — WaveSystem
 * Deterministic local enemy waves, difficulty scaling, prep/intermission,
 * completion and victory, and no wall-clock timers or API requests.
 *
 * const waves = new WaveSystem({enemyAI, totalWaves: 6, onEvent: (event,data)=>{}})
 * waves.start()
 * // GameEngine.onUpdate(dt): enemyAI.update(dt); combat.update(dt); waves.update(dt)
 * // waves.getSummary() supplies lightweight HUD values.
 */
const finite = Number.isFinite
const clamp = (n, a, b) => Math.max(a, Math.min(b, n))
const TYPE_CYCLE = ['scout', 'raider', 'scout', 'archer', 'raider', 'brute']

export class WaveSystem {
  constructor({enemyAI, totalWaves = 6, firstDelay = 8, restSeconds = 15,
    spawnInterval = 1.2, baseEnemies = 3, extraPerWave = 2,
    endless = false, maxConcurrent = 30, difficulty = 1,
    onEvent = null} = {}) {
    if (!enemyAI || typeof enemyAI.spawn !== 'function' || typeof enemyAI.getUnits !== 'function') {
      throw new TypeError('WaveSystem requires EnemyAI')
    }
    this.enemyAI = enemyAI
    this.totalWaves = Math.max(1, Math.floor(totalWaves))
    this.firstDelay = clamp(firstDelay, 0, 3600)
    this.restSeconds = clamp(restSeconds, 0, 3600)
    this.spawnInterval = clamp(spawnInterval, .2, 60)
    this.baseEnemies = Math.max(1, Math.floor(baseEnemies))
    this.extraPerWave = Math.max(0, Math.floor(extraPerWave))
    this.endless = endless
    this.maxConcurrent = Math.max(1, Math.floor(maxConcurrent))
    this.difficulty = clamp(difficulty, .25, 5)
    this.onEvent = onEvent
    this.state = 'idle' // idle | preparing | spawning | fighting | victory | stopped
    this.wave = 0
    this.countdown = 0
    this.toSpawn = 0
    this.spawnedThisWave = 0
    this.killedThisWave = 0
    this.ids = new Set()
    this.nextSpawn = 0
    this.elapsed = 0
    this.completed = 0
  }

  start() {
    if (this.state === 'victory' || this.state === 'preparing' ||
      this.state === 'spawning' || this.state === 'fighting') return false
    this.state = 'preparing'
    this.countdown = this.wave === 0 ? this.firstDelay : this.restSeconds
    this.onEvent?.('preparing', this.getSummary())
    return true
  }

  stop() {this.state = 'stopped';this.onEvent?.('stopped',this.getSummary())}

  #nextWave() {
    if (!this.endless && this.wave >= this.totalWaves) {
      this.state = 'victory'
      this.onEvent?.('victory', this.getSummary())
      return
    }
    this.wave++
    this.spawnedThisWave = 0
    this.killedThisWave = 0
    this.ids = new Set()
    this.toSpawn = Math.max(1, Math.round((this.baseEnemies + (this.wave-1) * this.extraPerWave) * this.difficulty))
    this.nextSpawn = 0
    this.state = 'spawning'
    this.onEvent?.('wave_started', this.getSummary())
  }

  startNextWave() {
    if (this.state !== 'idle' && this.state !== 'preparing') return false
    this.countdown = 0
    this.#nextWave()
    return true
  }

  #chooseType(index) {
    if (this.wave === 1) return index % 3 === 0 ? 'scout' : 'raider'
    if (this.wave < 3) return TYPE_CYCLE[index % 4]
    if (this.wave < 5) return TYPE_CYCLE[index % 5]
    return TYPE_CYCLE[(index + this.wave) % TYPE_CYCLE.length]
  }

  #spawnOne() {
    if (this.enemyAI.getUnits().length >= this.maxConcurrent) return false
    const type = this.#chooseType(this.spawnedThisWave)
    const level = Math.min(30, this.wave + Math.floor((this.difficulty - 1) * 2))
    const unit = this.enemyAI.spawn({type,level:Math.max(1,level)})
    if (!unit) {this.onEvent?.('spawn_blocked',this.getSummary());return false}
    this.ids.add(unit.id)
    this.spawnedThisWave++
    this.toSpawn--
    this.onEvent?.('enemy_spawned', {unit, ...this.getSummary()})
    return true
  }

  update(dt) {
    if (!finite(dt) || dt <= 0) return
    const seconds = Math.min(dt, .1)
    if (this.state === 'idle' || this.state === 'victory' || this.state === 'stopped') return
    this.elapsed += seconds
    if (this.state === 'preparing') {
      this.countdown = Math.max(0, this.countdown - seconds)
      if (this.countdown <= 0) this.#nextWave()
      return
    }
    const aliveIds = new Set(this.enemyAI.getUnits().map(e => e.id))
    let aliveInWave = 0
    for (const id of this.ids) if (aliveIds.has(id)) aliveInWave++
    this.killedThisWave = this.spawnedThisWave - aliveInWave
    if (this.state === 'spawning') {
      this.nextSpawn -= seconds
      if (this.toSpawn > 0 && this.nextSpawn <= 0 && this.#spawnOne()) {
        this.nextSpawn = this.spawnInterval
      }
      if (this.toSpawn === 0) this.state = 'fighting'
    }
    if (this.state === 'fighting') {
      // Check fresh units after last spawn. Avoid declaring victory early.
      const active = new Set(this.enemyAI.getUnits().map(e => e.id))
      let alive = 0
      for (const id of this.ids) if (active.has(id)) alive++
      this.killedThisWave = this.spawnedThisWave - alive
      if (alive === 0) {
        this.completed++
        this.onEvent?.('wave_completed',this.getSummary())
        if (!this.endless && this.wave >= this.totalWaves) {
          this.state = 'victory'
          this.onEvent?.('victory',this.getSummary())
        } else {
          this.state = 'preparing'
          this.countdown = this.restSeconds
          this.onEvent?.('preparing',this.getSummary())
        }
      }
    }
  }

  getSummary() {
    return {state:this.state, wave:this.wave, totalWaves:this.endless?null:this.totalWaves,
      countdown:Math.ceil(this.countdown), remainingToSpawn:this.toSpawn,
      spawned:this.spawnedThisWave, killed:this.killedThisWave,
      alive:Math.max(0,this.spawnedThisWave - this.killedThisWave),
      completed:this.completed, elapsedSeconds:this.elapsed}
  }

  reset({clearEnemies = false} = {}) {
    if (clearEnemies) this.enemyAI.reset?.()
    this.state = 'idle'
    this.wave = 0
    this.countdown = 0
    this.toSpawn = 0
    this.spawnedThisWave = 0
    this.killedThisWave = 0
    this.ids.clear()
    this.nextSpawn = 0
    this.elapsed = 0
    this.completed = 0
  }
}

export default WaveSystem
