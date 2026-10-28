/**
 * Shadow Realms — WaveSystem (Step 33, complete single-file update).
 *
 * Existing browser-only contract is preserved:
 *   new WaveSystem({ enemyAI, totalWaves, firstDelay, restSeconds,
 *     spawnInterval, baseEnemies, extraPerWave, endless, maxConcurrent,
 *     difficulty, onEvent })
 *   start(), startNextWave(), stop(), update(dt), getSummary(), reset()
 *
 * Adds deterministic scouting / ranged / flanking / heavy / mixed / boss wave
 * profiles; inspect upcoming waves with getWavePreview(). Every unit remains
 * owned by EnemyAI and counted by this WaveSystem. The final wave's FIRST
 * enemy is always a brute, enabling the existing BossEncounter promotion
 * without extra spawns or changes to EnemyStrategyFeature.js.
 *
 * No DOM, fetch, storage, background timers or duplicate combat state.
 */

const finite = Number.isFinite;
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const safeInt = (n, fallback, lo, hi) =>
  clamp(Number.isFinite(n) ? Math.floor(n) : fallback, lo, hi);

const PROFILES = Object.freeze({
  scouting: Object.freeze({
    id: 'scouting', label: 'Scout Raid',
    types: Object.freeze(['scout', 'raider', 'raider', 'scout']),
    interval: 0.92, levelBonus: 0,
  }),
  ranged: Object.freeze({
    id: 'ranged', label: 'Ranged Support',
    types: Object.freeze(['raider', 'archer', 'scout', 'archer', 'raider']),
    interval: 1.12, levelBonus: 0,
  }),
  flanking: Object.freeze({
    id: 'flanking', label: 'Flanking Scouts',
    types: Object.freeze(['scout', 'scout', 'raider', 'archer', 'scout', 'raider']),
    interval: 0.82, levelBonus: 0,
  }),
  heavy: Object.freeze({
    id: 'heavy', label: 'Heavy Assault',
    types: Object.freeze(['raider', 'brute', 'archer', 'raider', 'brute']),
    interval: 1.24, levelBonus: 1,
  }),
  combined: Object.freeze({
    id: 'combined', label: 'Combined Arms',
    types: Object.freeze(['scout', 'archer', 'raider', 'brute', 'archer', 'raider']),
    interval: 1.0, levelBonus: 0,
  }),
  boss: Object.freeze({
    id: 'boss', label: 'Boss Siege',
    // MUST start with brute: BossEncounter promotes the first existing brute.
    types: Object.freeze(['brute', 'raider', 'archer', 'scout', 'raider', 'archer', 'brute']),
    interval: 1.08, levelBonus: 1,
  }),
});
const STANDARD_ORDER = Object.freeze(['scouting', 'ranged', 'flanking', 'heavy', 'combined']);

export class WaveSystem {
  constructor({
    enemyAI, totalWaves = 6, firstDelay = 8, restSeconds = 15,
    spawnInterval = 1.2, baseEnemies = 3, extraPerWave = 2,
    endless = false, maxConcurrent = 30, difficulty = 1,
    onEvent = null,
  } = {}) {
    if (typeof enemyAI?.spawn !== 'function' || typeof enemyAI?.getUnits !== 'function') {
      throw new TypeError('WaveSystem requires the existing EnemyAI');
    }
    this.enemyAI = enemyAI;
    this.totalWaves = safeInt(totalWaves, 6, 1, 1000);
    this.firstDelay = clamp(finite(firstDelay) ? firstDelay : 8, 0, 3600);
    this.restSeconds = clamp(finite(restSeconds) ? restSeconds : 15, 0, 3600);
    this.spawnInterval = clamp(finite(spawnInterval) ? spawnInterval : 1.2, 0.2, 60);
    this.baseEnemies = safeInt(baseEnemies, 3, 1, 200);
    this.extraPerWave = safeInt(extraPerWave, 2, 0, 50);
    this.endless = Boolean(endless);
    this.maxConcurrent = safeInt(maxConcurrent, 30, 1, 300);
    this.difficulty = clamp(finite(difficulty) ? difficulty : 1, 0.25, 5);
    this.onEvent = typeof onEvent === 'function' ? onEvent : null;

    this.state = 'idle'; // idle | preparing | spawning | fighting | victory | stopped
    this.wave = 0;
    this.countdown = 0;
    this.toSpawn = 0;
    this.spawnedThisWave = 0;
    this.killedThisWave = 0;
    this.ids = new Set();
    this.nextSpawn = 0;
    this.elapsed = 0;
    this.completed = 0;
    this.currentProfile = null;
    this.spawnFailures = 0;
    this.lastBlockedNotice = -Infinity;
    this.blockedRetrySeconds = 0.85;
    this.blockedNoticeSeconds = 2;
  }

  #emit(event, data) {
    // Event subscribers (UI/Boss observers) must not corrupt wave counters.
    try { this.onEvent?.(event, data); }
    catch (error) { console.warn('Shadow Realms wave event failed:', event, error); }
  }

  #profileFor(number) {
    if (!this.endless && number === this.totalWaves) return PROFILES.boss;
    const id = STANDARD_ORDER[(number - 1) % STANDARD_ORDER.length];
    return PROFILES[id];
  }

  #plannedCount(number) {
    const expected = (this.baseEnemies + (number - 1) * this.extraPerWave) * this.difficulty;
    // Hard cap for endless games; no infinitely growing one-wave spawn queue.
    return clamp(Math.round(expected), 1, 200);
  }

  /** Pure deterministic preview. Never advances time or spawns enemies. */
  getWavePreview(number = this.wave + 1) {
    if (!Number.isInteger(number) || number < 1 || (!this.endless && number > this.totalWaves)) {
      return null;
    }
    const profile = this.#profileFor(number);
    const enemyCount = this.#plannedCount(number);
    const types = { scout: 0, raider: 0, archer: 0, brute: 0 };
    for (let i = 0; i < enemyCount; i++) types[profile.types[i % profile.types.length]]++;
    return {
      wave: number,
      pattern: profile.id,
      label: profile.label,
      enemyCount,
      types,
      firstEnemy: profile.types[0],
      bossExpected: !this.endless && number === this.totalWaves,
      spawnInterval: Math.max(0.2, this.spawnInterval * profile.interval),
      level: clamp(number + Math.floor((this.difficulty - 1) * 2) + profile.levelBonus, 1, 30),
    };
  }

  start() {
    if (this.state === 'victory' || this.state === 'preparing' ||
        this.state === 'spawning' || this.state === 'fighting') return false;
    if (!this.endless && this.wave >= this.totalWaves) return false;
    this.state = 'preparing';
    this.countdown = this.wave === 0 ? this.firstDelay : this.restSeconds;
    this.#emit('preparing', this.getSummary());
    return true;
  }

  stop() {
    if (this.state === 'stopped') return;
    this.state = 'stopped';
    this.#emit('stopped', this.getSummary());
  }

  #nextWave() {
    if (!this.endless && this.wave >= this.totalWaves) {
      this.state = 'victory';
      this.#emit('victory', this.getSummary());
      return false;
    }
    this.wave++;
    this.currentProfile = this.#profileFor(this.wave);
    this.spawnedThisWave = 0;
    this.killedThisWave = 0;
    this.toSpawn = this.#plannedCount(this.wave);
    this.ids = new Set();
    this.nextSpawn = 0;
    this.spawnFailures = 0;
    this.lastBlockedNotice = -Infinity;
    this.state = 'spawning';
    this.#emit('wave_started', this.getSummary());
    return true;
  }

  startNextWave() {
    if (this.state !== 'idle' && this.state !== 'preparing') return false;
    if (!this.endless && this.wave >= this.totalWaves) return false;
    this.countdown = 0;
    return this.#nextWave();
  }

  #chooseType(index) {
    const types = this.currentProfile?.types || PROFILES.scouting.types;
    return types[index % types.length];
  }

  #blocked(reason) {
    this.spawnFailures++;
    if (this.elapsed - this.lastBlockedNotice >= this.blockedNoticeSeconds) {
      this.lastBlockedNotice = this.elapsed;
      this.#emit('spawn_blocked', { reason, ...this.getSummary() });
    }
    return false;
  }

  #spawnOne() {
    if (this.enemyAI.getUnits().length >= this.maxConcurrent) return this.#blocked('max_concurrent');
    const type = this.#chooseType(this.spawnedThisWave);
    const level = clamp(this.wave + Math.floor((this.difficulty - 1) * 2) +
      (this.currentProfile?.levelBonus || 0), 1, 30);
    const unit = this.enemyAI.spawn({ type, level });
    if (!unit || unit.id == null) return this.#blocked('no_spawn_point');
    this.ids.add(unit.id);
    this.spawnedThisWave++;
    this.toSpawn--;
    this.#emit('enemy_spawned', { unit, ...this.getSummary() });
    return true;
  }

  #countAlive() {
    const alive = new Set(this.enemyAI.getUnits().map(unit => unit.id));
    let current = 0;
    for (const id of this.ids) if (alive.has(id)) current++;
    this.killedThisWave = Math.max(0, this.spawnedThisWave - current);
    return current;
  }

  update(dt) {
    if (!finite(dt) || dt <= 0 || ['idle', 'victory', 'stopped'].includes(this.state)) return;
    const seconds = Math.min(0.1, dt);
    this.elapsed += seconds;
    if (this.state === 'preparing') {
      this.countdown = Math.max(0, this.countdown - seconds);
      if (this.countdown <= 0) this.#nextWave();
      return;
    }
    if (this.state === 'spawning') {
      this.nextSpawn -= seconds;
      if (this.toSpawn > 0 && this.nextSpawn <= 0) {
        const ok = this.#spawnOne();
        this.nextSpawn = ok ?
          Math.max(0.2, this.spawnInterval * this.currentProfile.interval) : this.blockedRetrySeconds;
      }
      if (this.toSpawn === 0) this.state = 'fighting';
    }
    const stillAlive = this.#countAlive();
    if (this.state !== 'fighting' || stillAlive !== 0) return;
    this.completed++;
    this.#emit('wave_completed', this.getSummary());
    if (!this.endless && this.wave >= this.totalWaves) {
      this.state = 'victory';
      this.#emit('victory', this.getSummary());
    } else {
      this.state = 'preparing';
      this.countdown = this.restSeconds;
      this.#emit('preparing', this.getSummary());
    }
  }

  getSummary() {
    const profile = this.currentProfile;
    return {
      // Preserve all original properties for existing HUD and BossEncounter.
      state: this.state,
      wave: this.wave,
      totalWaves: this.endless ? null : this.totalWaves,
      countdown: Math.ceil(this.countdown),
      remainingToSpawn: this.toSpawn,
      spawned: this.spawnedThisWave,
      killed: this.killedThisWave,
      alive: Math.max(0, this.spawnedThisWave - this.killedThisWave),
      completed: this.completed,
      elapsedSeconds: this.elapsed,
      // Additional optional metadata: callers may ignore these fields.
      pattern: profile?.id || null,
      patternLabel: profile?.label || null,
      planned: profile ? this.#plannedCount(this.wave) : 0,
      spawnFailures: this.spawnFailures,
      nextWave: this.getWavePreview(this.wave + 1),
    };
  }

  reset({ clearEnemies = false } = {}) {
    if (clearEnemies) this.enemyAI.reset?.();
    this.state = 'idle';
    this.wave = 0;
    this.countdown = 0;
    this.toSpawn = 0;
    this.spawnedThisWave = 0;
    this.killedThisWave = 0;
    this.ids.clear();
    this.nextSpawn = 0;
    this.elapsed = 0;
    this.completed = 0;
    this.currentProfile = null;
    this.spawnFailures = 0;
    this.lastBlockedNotice = -Infinity;
  }
}

export default WaveSystem;
