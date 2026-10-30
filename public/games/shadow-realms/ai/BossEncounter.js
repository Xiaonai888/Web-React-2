/**
 * Shadow Realms — complete, self-contained boss encounter (Step 32).
 *
 * The final WaveSystem wave's first EXISTING brute is promoted in-place:
 * - Never creates a second enemy or changes WaveSystem accounting.
 * - Phase 1: armored brute; Phase 2 <=60% HP; Phase 3 <=25% HP.
 * - Ground-locked warning ring, windup, dodge window, and one AoE slam.
 * - Visible boss HP/phase, reversible modifiers and idempotent death events.
 * - Reuses the existing HealthSystem, WaveSystem and Camera2D; no DOM/API.
 *
 * Public API remains compatible with EnemyStrategyFeature.js:
 *   onWaveEvent, onHealthEvent, update, draw, getSummary, destroy.
 */
const TAU = Math.PI * 2;
const isPoint = value => Number.isFinite(value?.x) && Number.isFinite(value?.y);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const number = (value, fallback) => Number.isFinite(value) ? value : fallback;
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const LIFECYCLE_STATS = Object.freeze(['maxHp', 'attackDamage', 'armor', 'attackCooldown', 'speed']);
const BOSS_TITLES = Object.freeze({ km: 'មេបញ្ជាការ', en: 'BOSS', zh: '首领', ja: 'ボス', ko: '보스' });

export class BossEncounter {
  constructor({
    waves, health, getPlayers = () => [], onEvent = null, finalWaveOnly = true,
    slamRadius = 115, slamDamage = 13, slamCooldown = 11, windup = 1.1,
  } = {}) {
    if (typeof waves?.getSummary !== 'function' || typeof health?.damage !== 'function') {
      throw new TypeError('BossEncounter needs existing WaveSystem and HealthSystem');
    }
    this.waves = waves;
    this.health = health;
    this.getPlayers = typeof getPlayers === 'function' ? getPlayers : () => getPlayers;
    this.onEvent = typeof onEvent === 'function' ? onEvent : null;
    this.finalWaveOnly = Boolean(finalWaveOnly);
    this.slamRadius = clamp(number(slamRadius, 115), 45, 260);
    this.slamDamage = clamp(number(slamDamage, 13), 1, 40);
    this.slamCooldown = clamp(number(slamCooldown, 11), 5, 40);
    this.windup = clamp(number(windup, 1.1), 0.3, 3);
    this.bosses = new Map();
    this.announced = new Set();
    this.elapsed = 0;
    this.destroyed = false;
  }

  #emit(name, payload) {
    // A UI/event subscriber must not stop the combat simulation.
    try { this.onEvent?.(name, payload); } catch { /* Observer only. */ }
  }

  #players() {
    const result = this.getPlayers() || [];
    return Array.isArray(result) ? result.filter(unit =>
      unit?.team === 'blue' && unit.alive !== false && unit.hp > 0 &&
      isPoint(unit) && !unit.trainingInside && unit.trainingState !== 'training') : [];
  }

  #phaseFor(boss) {
    const hp = clamp(number(boss.unit.hp, 0), 0, number(boss.unit.maxHp, 1));
    const ratio = hp / Math.max(1, number(boss.unit.maxHp, 1));
    return ratio <= 0.25 ? 3 : ratio <= 0.6 ? 2 : 1;
  }

  #cooldown(boss) {
    return this.slamCooldown * (boss.phase === 3 ? 0.58 : boss.phase === 2 ? 0.78 : 1);
  }
  #windup(boss) {
    return Math.max(0.38, this.windup * (boss.phase === 3 ? 0.75 : boss.phase === 2 ? 0.9 : 1));
  }
  #radius(boss) { return this.slamRadius + (boss.phase === 3 ? 20 : boss.phase === 2 ? 10 : 0); }
  #damage(boss) { return Math.round(this.slamDamage * (boss.phase === 3 ? 1.65 : boss.phase === 2 ? 1.3 : 1)); }

  #applyPhase(boss) {
    if (boss.dead || !(boss.unit.hp > 0) || boss.unit.alive === false) return;
    const phase = this.#phaseFor(boss);
    if (phase <= boss.phase) return; // Phase only increases: no repeated stacking.
    const previous = boss.phase;
    boss.phase = phase;
    const { unit, initialBoost, assigned } = boss;
    const changed = {
      attackDamage: Math.round(initialBoost.attackDamage * (phase === 3 ? 1.35 : 1.18)),
      speed: clamp(initialBoost.speed * (phase === 3 ? 1.22 : 1.12), 15, 500),
    };
    for (const [key, value] of Object.entries(changed)) {
      // Preserve external changes made since the boss's previous phase.
      if (Number.isFinite(unit[key]) && Number.isFinite(assigned[key]) &&
          Math.abs(unit[key] - assigned[key]) < 1e-7) {
        unit[key] = value;
        assigned[key] = value;
      }
    }
    // Give the player an extra dodge window after each enraged transition.
    if (!boss.telegraph) boss.cooldown = Math.max(boss.cooldown, 1.5);
    this.#emit('phase_changed', { unitId: unit.id, wave: boss.wave, from: previous, to: phase });
  }

  promote(unit, { wave = null, totalWaves = null } = {}) {
    if (this.destroyed) return false;
    const current = wave ?? this.waves.wave;
    const total = totalWaves ?? this.waves.totalWaves;
    if (!Number.isInteger(current) || current < 1) return false;
    if (this.finalWaveOnly && (this.waves.endless || !Number.isInteger(total) || current !== total)) return false;
    if (!unit || unit.id == null || unit.team !== 'red' || unit.type !== 'brute' ||
        unit.alive === false || !(unit.hp > 0) || !isPoint(unit)) return false;
    if (this.announced.has(current) || this.bosses.has(unit.id)) return false;

    const initialHP = Math.max(1, number(unit.maxHp, unit.hp));
    const oldRatio = clamp(unit.hp / initialHP, 0, 1);
    const before = Object.fromEntries(LIFECYCLE_STATS.map(key => [key, unit[key]]));
    const had = Object.fromEntries(LIFECYCLE_STATS.map(key => [key, Object.hasOwn(unit, key)]));
    const initialBoost = {
      maxHp: Math.round(initialHP * 2.35),
      attackDamage: Math.max(1, Math.round(number(unit.attackDamage, 10) * 1.65)),
      armor: clamp(number(unit.armor, 0) + 4, 0, 50),
      attackCooldown: clamp(number(unit.attackCooldown, 2) * 0.8, 0.45, 6),
      speed: Math.max(15, number(unit.speed, 65)),
    };
    const assigned = { ...initialBoost };
    Object.assign(unit, initialBoost);
    unit.hp = Math.max(1, Math.round(initialBoost.maxHp * oldRatio));
    const boss = {
      unit, before, had, initialBoost, assigned, wave: current,
      phase: 1, cooldown: this.slamCooldown, telegraph: null,
      slams: 0, dead: false,
    };
    this.bosses.set(unit.id, boss);
    this.announced.add(current);
    this.#emit('spawned', { unitId: unit.id, wave: current, phase: 1 });
    this.#applyPhase(boss);
    return true;
  }

  onWaveEvent(name, data = {}) {
    if (this.destroyed) return false;
    if (name === 'enemy_spawned') {
      return this.promote(data?.unit, { wave: data?.wave, totalWaves: data?.totalWaves });
    }
    // WaveSystem.reset() can start the campaign again without recreating modules.
    if (name === 'wave_started' && data?.wave === 1 && this.waves.wave === 1 &&
        (this.waves.completed === 0 || this.waves.completed == null) &&
        this.announced.size) this.reset();
    return false;
  }

  onHealthEvent(name, data = {}) {
    if (this.destroyed || !data?.unit || !this.bosses.has(data.unit.id)) return false;
    const boss = this.bosses.get(data.unit.id);
    if (name === 'damage' || name === 'heal') {
      this.#applyPhase(boss);
      return true;
    }
    if (name !== 'death' || boss.dead) return false;
    boss.dead = true;
    boss.telegraph = null; // Never deliver a queued hit after death.
    this.#emit('defeated', { unitId: boss.unit.id, wave: boss.wave, phase: boss.phase });
    return true;
  }

  update(dt) {
    if (this.destroyed || !Number.isFinite(dt) || dt <= 0) return;
    const step = Math.min(0.1, dt);
    this.elapsed += step;
    const players = this.#players();
    for (const boss of this.bosses.values()) {
      const unit = boss.unit;
      if (boss.dead || unit.alive === false || !(unit.hp > 0)) {
        boss.telegraph = null;
        continue;
      }
      this.#applyPhase(boss);
      const attack = boss.telegraph;
      if (attack) {
        attack.remaining -= step;
        if (attack.remaining > 0) continue;
        boss.telegraph = null;
        boss.cooldown = this.#cooldown(boss);
        boss.slams++;
        const hits = [];
        // Hit the WARNED position, not the boss's new position: dodging works.
        for (const player of players) {
          if (player.trainingInside || player.trainingState === 'training') continue;
          if (distance(attack.center, player) > attack.radius + (player.radius || 0)) continue;
          const result = this.health.damage(player, attack.damage,
            { source: unit, type: 'boss-slam' });
          if (result?.ok && result.applied > 0) hits.push(player.id);
        }
        this.#emit('slam', { unitId: unit.id, phase: boss.phase,
          hits, position: { ...attack.center }, damage: attack.damage });
        continue;
      }
      boss.cooldown -= step;
      if (boss.cooldown > 0) continue;
      const radius = this.#radius(boss);
      if (!players.some(player => distance(unit, player) <= radius + 35)) {
        boss.cooldown = 1.2; // No costly warning while players are far away.
        continue;
      }
      const duration = this.#windup(boss);
      boss.telegraph = {
        center: { x: unit.x, y: unit.y }, radius,
        damage: this.#damage(boss), remaining: duration, duration,
      };
      this.#emit('slam-warning', { unitId: unit.id, phase: boss.phase,
        duration, position: { ...boss.telegraph.center }, radius });
    }
  }

  draw(ctx, camera) {
    if (this.destroyed || !ctx || !camera || typeof camera.worldToScreen !== 'function') return;
    ctx.save();
    for (const boss of this.bosses.values()) {
      const unit = boss.unit;
      if (boss.dead || unit.alive === false || !(unit.hp > 0) || !isPoint(unit)) continue;
      const point = camera.worldToScreen(unit.x, unit.y);
      const zoom = clamp(number(camera.zoom, 1), 0.2, 4);
      const tilt = clamp(number(camera.tilt, 0.72), 0.3, 1.5);
      const attack = boss.telegraph;
      if (attack) {
        const center = camera.worldToScreen(attack.center.x, attack.center.y);
        const rx = attack.radius * zoom, ry = rx * tilt;
        const visible = center.x + rx >= 0 && center.x - rx <= camera.viewportWidth &&
          center.y + ry >= 0 && center.y - ry <= camera.viewportHeight;
        if (visible) {
          const portion = clamp(1 - attack.remaining / attack.duration, 0, 1);
          ctx.fillStyle = `rgba(238,82,50,${(0.08 + portion * 0.17).toFixed(3)})`;
          ctx.strokeStyle = portion > 0.75 ? '#ffe19a' : '#ff8b63';
          ctx.lineWidth = 2.5 + portion * 1.4;
          ctx.beginPath(); ctx.ellipse(center.x, center.y, rx, ry, 0, 0, TAU);
          ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.ellipse(center.x, center.y,
            Math.max(1, rx * portion), Math.max(1, ry * portion), 0, 0, TAU);
          ctx.stroke();
        }
      }
      if (point.x < -110 || point.x > camera.viewportWidth + 110 ||
          point.y < -150 || point.y > camera.viewportHeight + 110) continue;
      const barWidth = Math.max(66, Math.min(124, 93 * zoom));
      const x = point.x - barWidth / 2;
      const y = point.y - Math.max(72, 112 * zoom);
      const healthRatio = clamp(unit.hp / Math.max(1, number(unit.maxHp, 1)), 0, 1);
      ctx.fillStyle = 'rgba(26,16,24,.88)';
      ctx.fillRect(x - 3, y - 23, barWidth + 6, 35);
      ctx.fillStyle = '#ffe5a0';
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      const language = typeof document === 'undefined' ? 'en' :
        String(document.documentElement?.lang || 'en').split('-')[0].toLowerCase();
      const title = BOSS_TITLES[language] || BOSS_TITLES.en;
      ctx.fillText(`♛ ${title} · ${boss.phase}/3`, point.x, y - 8, barWidth + 5);
      ctx.fillStyle = '#3e1a22'; ctx.fillRect(x, y - 2, barWidth, 9);
      ctx.fillStyle = boss.phase === 3 ? '#ff6156' : boss.phase === 2 ? '#ed9b51' : '#d65b67';
      ctx.fillRect(x + 1, y - 1, (barWidth - 2) * healthRatio, 7);
      ctx.strokeStyle = '#f1dbad'; ctx.lineWidth = 1;
      ctx.strokeRect(x, y - 2, barWidth, 9);
    }
    ctx.restore();
  }

  getSummary() {
    const bosses = [...this.bosses.values()];
    return {
      promoted: bosses.length,
      alive: bosses.filter(b => !b.dead && b.unit.alive !== false && b.unit.hp > 0).length,
      defeated: bosses.filter(b => b.dead || b.unit.alive === false || !(b.unit.hp > 0)).length,
      warning: bosses.filter(b => !!b.telegraph).length,
      totalSlams: bosses.reduce((total, b) => total + b.slams, 0),
      phases: bosses.filter(b => !b.dead && b.unit.hp > 0)
        .map(b => ({ unitId: b.unit.id, phase: b.phase, hp: b.unit.hp, maxHp: b.unit.maxHp })),
    };
  }

  #restore(boss) {
    const { unit, before, had, assigned } = boss;
    if (!unit || unit.alive === false || !(unit.hp > 0)) return;
    const previousMax = Math.max(1, number(unit.maxHp, 1));
    const hpRatio = clamp(unit.hp / previousMax, 0, 1);
    for (const key of LIFECYCLE_STATS) {
      // If another subsystem changed the property after our last write, keep it.
      if (!Number.isFinite(unit[key]) || !Number.isFinite(assigned[key]) ||
          Math.abs(unit[key] - assigned[key]) > 1e-7) continue;
      if (had[key]) unit[key] = before[key];
      else delete unit[key];
    }
    unit.hp = Math.min(Math.max(1, number(unit.maxHp, 1)),
      Math.max(1, Math.round(hpRatio * Math.max(1, number(unit.maxHp, 1)))));
  }

  reset() {
    if (this.destroyed) return;
    for (const boss of this.bosses.values()) this.#restore(boss);
    this.bosses.clear();
    this.announced.clear();
    this.elapsed = 0;
  }

  destroy() {
    if (this.destroyed) return;
    this.reset();
    this.onEvent = null;
    this.destroyed = true;
  }
}

export default BossEncounter;
