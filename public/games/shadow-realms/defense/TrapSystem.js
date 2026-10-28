/**
 * Shadow Realms — TrapSystem (Step 45, single-file replacement).
 *
 * Existing API: new TrapSystem({defense,health,getUnits,onEvent}),
 * update(dt), getSummary(), destroy(). Uses existing DefenseSystem traps,
 * HealthSystem damage events and the current world roster; no new game loop.
 *
 * Fixes: team-safe targeting, exact circle/rectangle proximity, stable nearest
 * hostile selection, finite charges/cooldowns, safe depletion and observers,
 * duplicate roster entries and stale timer cleanup. Never spawns units/traps.
 */
const finite = Number.isFinite;
const point = p => finite(p?.x) && finite(p?.y);
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const positive = (value, fallback) => finite(value) && value > 0 ? value : fallback;

function overlaps(unit, trap) {
  const radius = clamp(positive(unit.radius, 10), 1, 80);
  const halfWidth = positive(trap.width, 52) / 2;
  const halfDepth = positive(trap.depth, 42) / 2;
  const dx = Math.max(Math.abs(unit.x - trap.x) - halfWidth, 0);
  const dy = Math.max(Math.abs(unit.y - trap.y) - halfDepth, 0);
  return dx * dx + dy * dy <= radius * radius;
}

export class TrapSystem {
  constructor({ defense, health, getUnits = () => [], onEvent = null } = {}) {
    if (typeof defense?.getStructures !== 'function' || typeof defense?.remove !== 'function')
      throw new TypeError('TrapSystem requires the existing DefenseSystem');
    if (typeof health?.damage !== 'function')
      throw new TypeError('TrapSystem requires the existing HealthSystem');
    this.defense = defense;
    this.health = health;
    this.getUnits = typeof getUnits === 'function' ? getUnits : () => getUnits;
    this.onEvent = typeof onEvent === 'function' ? onEvent : null;
    this.timers = new Map();
    this.activations = 0;
    this.totalDamage = 0;
    this.depleted = 0;
    this.destroyed = false;
    this.updating = false;
  }

  #emit(name, payload) {
    try { this.onEvent?.(name, payload); }
    catch (error) { console.warn('Shadow Realms trap observer failed:', name, error); }
  }

  #traps() {
    const list = this.defense.getStructures() || [];
    return Array.isArray(list) ? list.filter(trap => trap?.kind === 'trap' &&
      trap.alive !== false && trap.id != null && point(trap)) : [];
  }

  #enemies() {
    const list = this.getUnits() || [];
    if (!Array.isArray(list)) return [];
    const ids = new Set();
    return list.filter(unit => {
      if (!unit || unit.id == null || ids.has(unit.id) || !point(unit) ||
          unit.team == null || unit.alive === false || !finite(unit.hp) || unit.hp <= 0)
        return false;
      ids.add(unit.id);
      return true;
    });
  }

  #closestHostile(trap, units) {
    let selected = null;
    let bestDistance = Infinity;
    for (const unit of units) {
      if (unit.team === trap.team || unit.alive === false ||
          !finite(unit.hp) || unit.hp <= 0 || !overlaps(unit, trap)) continue;
      const dx = unit.x - trap.x;
      const dy = unit.y - trap.y;
      const squared = dx * dx + dy * dy;
      if (squared < bestDistance) {
        bestDistance = squared;
        selected = unit;
      }
    }
    return selected;
  }

  #deplete(trap) {
    // Defensive: charge zero means never deliver another hit, even if an
    // observer re-enters update() or remove() invokes an external callback.
    this.timers.delete(trap.id);
    try {
      if (this.defense.remove(trap.id, { reason: 'depleted' })) this.depleted++;
    } catch (error) {
      console.warn('Shadow Realms trap depletion failed:', error);
    }
  }

  update(dt) {
    if (this.destroyed || this.updating || !finite(dt) || dt <= 0) return;
    const seconds = Math.min(dt, 0.1);
    this.updating = true;
    try {
      const traps = this.#traps();
      const activeIds = new Set(traps.map(trap => trap.id));
      for (const id of this.timers.keys()) if (!activeIds.has(id)) this.timers.delete(id);
      if (!traps.length) return;
      const units = this.#enemies();
      for (const trap of traps) {
        if (this.destroyed) break;
        // A callback may remove a trap while the snapshot is being processed.
        if (trap.alive === false || !this.defense.getStructures().includes(trap)) {
          this.timers.delete(trap.id);
          continue;
        }
        const remaining = finite(trap.charges) ? Math.max(0, Math.floor(trap.charges)) : 0;
        if (!remaining) { this.#deplete(trap); continue; }
        const cooldown = Math.max(0, (this.timers.get(trap.id) || 0) - seconds);
        if (cooldown > 0) { this.timers.set(trap.id, cooldown); continue; }
        const target = this.#closestHostile(trap, units);
        if (!target) { this.timers.delete(trap.id); continue; }

        let hit;
        try { hit = this.health.damage(target, positive(trap.damage, 1),
          // Attribute the trap hit to its ID (not a blue unit object):
          // ExperienceSystem must not award unit XP to a structure.
          { source: trap.id, type: 'trap' }); }
        catch (error) {
          console.warn('Shadow Realms trap damage failed:', error);
          this.timers.set(trap.id, 0.25);
          continue;
        }
        if (hit?.ok !== true || !(hit.applied > 0)) {
          this.timers.set(trap.id, 0.25);
          continue;
        }
        trap.charges = remaining - 1;
        this.activations++;
        this.totalDamage += hit.applied;
        this.timers.set(trap.id, clamp(positive(trap.cooldown, 1.5), 0.2, 60));
        if (trap.charges === 0) this.#deplete(trap);
        this.#emit('triggered', { trap, unit: target, applied: hit.applied,
          chargesRemaining: trap.charges });
      }
    } finally {
      this.updating = false;
    }
  }

  getSummary() {
    return { armed: this.destroyed ? 0 : this.#traps().length,
      activations: this.activations, totalDamage: this.totalDamage,
      depleted: this.depleted };
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.timers.clear();
    this.onEvent = null;
  }
}

export default TrapSystem;
