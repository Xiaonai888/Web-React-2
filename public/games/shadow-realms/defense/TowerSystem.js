/**
 * Shadow Realms — TowerSystem (Step 44, complete single-file replacement).
 * Autonomous watchtowers reuse the EXISTING DefenseSystem and ProjectileSystem.
 *
 * Improvements:
 * - Fair round-robin firing when maxShotsPerTick is smaller than tower count.
 * - Ignore allies, dead units, invalid towers and out-of-range targets.
 * - Prefer immediately threatening / weakened enemies; avoid obvious overkill
 *   when multiple towers fire during the same update.
 * - Safe cooldowns, removed-tower cleanup, bounded event handling and stats.
 *
 * Public API unchanged: constructor, update(dt), getSummary(), destroy().
 * Never spawns units, runs its own timer, or touches the game bootstrap.
 */
const finite = Number.isFinite;
const point = value => finite(value?.x) && finite(value?.y);
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const positive = (value, fallback) => finite(value) && value > 0 ? value : fallback;
const alive = unit => unit?.id != null && unit.alive !== false &&
  finite(unit.hp) && unit.hp > 0 && point(unit);

export class TowerSystem {
  constructor({ defense, projectiles, getUnits = () => [],
    onEvent = null, maxShotsPerTick = 10 } = {}) {
    if (typeof defense?.getStructures !== 'function')
      throw new TypeError('TowerSystem requires existing DefenseSystem');
    if (typeof projectiles?.fire !== 'function')
      throw new TypeError('TowerSystem requires existing ProjectileSystem');
    this.defense = defense;
    this.projectiles = projectiles;
    this.getUnits = typeof getUnits === 'function' ? getUnits : () => getUnits;
    this.onEvent = typeof onEvent === 'function' ? onEvent : null;
    this.maxShotsPerTick = Math.floor(clamp(positive(maxShotsPerTick, 10), 1, 50));
    this.cooldowns = new Map();
    this.nextTowerIndex = 0;
    this.shotsFired = 0;
    this.destroyed = false;
  }

  #towers() {
    const source = this.defense.getStructures() || [];
    if (!Array.isArray(source)) return [];
    const ids = new Set();
    return source.filter(tower => {
      if (tower?.kind !== 'tower' || tower.alive === false ||
          tower.id == null || ids.has(tower.id) || !point(tower) ||
          !(tower.hp > 0) || !(tower.range > 0) || !(tower.damage > 0)) return false;
      ids.add(tower.id);
      return true;
    });
  }

  #enemies() {
    const source = this.getUnits() || [];
    if (!Array.isArray(source)) return [];
    const ids = new Set();
    return source.filter(unit => {
      if (!alive(unit) || ids.has(unit.id)) return false;
      ids.add(unit.id);
      return true;
    });
  }

  #target(tower, units, reservedDamage) {
    const range = clamp(tower.range, 1, 5000);
    let best = null;
    let score = Infinity;
    let backup = null;
    let backupScore = Infinity;
    for (const unit of units) {
      if (unit.id === tower.id || unit.team == null || unit.team === tower.team) continue;
      const gap = distance(tower, unit);
      if (gap > range) continue;

      // Immediate attackers threaten the tower more than passive distant units.
      const attackRange = clamp(positive(unit.attackRange, 40), 10, 900);
      const footprint = Math.max(0, positive(tower.width, 0), positive(tower.depth, 0)) / 2;
      const threatening = gap <= attackRange + footprint + 12;
      const ratio = finite(unit.maxHp) && unit.maxHp > 0
        ? clamp(unit.hp / unit.maxHp, 0, 1) : 1;
      const priority = gap - (threatening ? 45 : 0) - (1 - ratio) * 24;
      // Stable tie-breaker keeps targeting deterministic across frames.
      if (priority < backupScore || (priority === backupScore &&
          String(unit.id) < String(backup?.id))) {
        backup = unit;
        backupScore = priority;
      }
      if (unit.hp <= (reservedDamage.get(unit.id) || 0)) continue;
      if (priority < score || (priority === score &&
          String(unit.id) < String(best?.id))) {
        best = unit;
        score = priority;
      }
    }
    return best || backup;
  }

  #emit(name, data) {
    try { this.onEvent?.(name, data); }
    catch (error) { console.warn('Shadow Realms tower event failed:', name, error); }
  }

  update(dt) {
    if (this.destroyed || !finite(dt) || dt <= 0) return;
    const seconds = Math.min(0.1, dt);
    const towers = this.#towers();
    const present = new Set(towers.map(tower => tower.id));
    for (const id of this.cooldowns.keys())
      if (!present.has(id)) this.cooldowns.delete(id);
    if (!towers.length) { this.nextTowerIndex = 0; return; }

    const ready = [];
    for (const tower of towers) {
      const next = Math.max(0, (this.cooldowns.get(tower.id) || 0) - seconds);
      if (next > 0) this.cooldowns.set(tower.id, next);
      else { this.cooldowns.delete(tower.id); ready.push(tower.id); }
    }
    if (!ready.length) return;

    const units = this.#enemies();
    if (!units.length) return;
    const total = towers.length;
    const start = this.nextTowerIndex % total;
    let lastFiredIndex = -1;
    let shots = 0;
    const reservedDamage = new Map();
    for (let offset = 0; offset < total && shots < this.maxShotsPerTick; offset++) {
      const index = (start + offset) % total;
      const tower = towers[index];
      if (this.cooldowns.has(tower.id)) continue;
      const target = this.#target(tower, units, reservedDamage);
      if (!target) continue;
      const damage = clamp(tower.damage, 1, 1000);
      const range = clamp(tower.range, 1, 5000);
      const shooter = {
        id: tower.id, x: tower.x, y: tower.y, alive: true,
        hp: positive(tower.hp, 1), team: tower.team,
        radius: Math.max(8, positive(tower.width, 36), positive(tower.depth, 36)) / 3,
        attackDamage: damage, attackRange: range,
      };
      let shot = null;
      try {
        shot = this.projectiles.fire(shooter, target, {
          damage, range: range + 55, speed: 485, color: '#f7d37e',
        });
      } catch (error) {
        this.#emit('fire_error', { towerId: tower.id, error: String(error) });
      }
      if (!shot) continue; // Do not consume a cooldown for a rejected shot.
      this.cooldowns.set(tower.id, clamp(positive(tower.cooldown, 1.35), 0.2, 30));
      reservedDamage.set(target.id, (reservedDamage.get(target.id) || 0) + damage);
      this.shotsFired++;
      shots++;
      lastFiredIndex = index;
      this.#emit('fired', { tower, target, shot });
    }
    // A capped volley should not indefinitely favor the first placed towers.
    this.nextTowerIndex = lastFiredIndex >= 0
      ? (lastFiredIndex + 1) % total : (start + 1) % total;
  }

  getSummary() {
    const towers = this.#towers();
    return { towers: towers.length, ready: towers.filter(t =>
      !(this.cooldowns.get(t.id) > 0)).length,
      shotsFired: this.shotsFired };
  }

  destroy() {
    if (this.destroyed) return;
    this.cooldowns.clear();
    this.nextTowerIndex = 0;
    this.onEvent = null;
    this.destroyed = true;
  }
}

export default TowerSystem;
