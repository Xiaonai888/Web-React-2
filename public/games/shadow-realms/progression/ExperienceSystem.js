/**
 * Shadow Realms — confirmed combat XP (Step 38).
 *
 * Drop-in replacement for the existing ProgressionFeature:
 *  - Kill XP stays equal to ProgressionRules.experienceForKill().
 *  - Living allies who dealt meaningful damage earn a SMALL, bounded assist pool.
 *  - Both melee unit sources and projectile owner-ID sources work.
 *  - Exactly one reward pass per defeated enemy, including uncredited deaths.
 *  - Damage attribution has a strict memory cap, even during endless waves.
 *
 * No timers, storage, new UI, backend, or changes to GameBootstrap.
 */
import { MAX_UNIT_LEVEL, xpForNextLevel, experienceForKill } from './ProgressionRules.js';

const finite = Number.isFinite;
const livingBlue = unit => unit?.team === 'blue' && unit.alive !== false &&
  finite(unit.hp) && unit.hp > 0 && unit.id != null;
const idOf = value => value && (typeof value === 'object' ? value.id : value);
const MAX_VICTIMS = 128;
const MAX_CONTRIBUTORS = 24;
const MAX_DEFEATED_HISTORY = 1024;
const MAX_ASSISTANTS = 4;

export class ExperienceSystem {
  constructor({ getUnits = () => [], onEvent = null } = {}) {
    this.getUnits = typeof getUnits === 'function' ? getUnits : () => getUnits;
    this.onEvent = typeof onEvent === 'function' ? onEvent : null;
    this.records = new Map();
    this.defeated = new Set();
    this.defeatedUnits = new WeakSet();
    this.contributors = new Map();
    this.totalEarned = 0;
    this.confirmedKills = 0;
    this.confirmedAssists = 0;
  }

  /** A stable public API: accepts either the original unit or its ID. */
  resolve(idOrUnit) {
    if (idOrUnit && typeof idOrUnit === 'object') return idOrUnit;
    if (idOrUnit == null) return null;
    const units = this.getUnits() || [];
    return Array.isArray(units) ? units.find(unit => unit?.id === idOrUnit) || null : null;
  }

  get(unitOrId) {
    const id = idOf(unitOrId);
    if (id == null) return null;
    const data = this.records.get(id) || {
      id, level: 1, xp: 0, totalXP: 0, kills: 0, assists: 0,
    };
    return { ...data, toNext: xpForNextLevel(data.level) };
  }

  #emit(name, data) {
    // UI observers may fail, but already-committed XP must not roll back.
    try { this.onEvent?.(name, data); }
    catch (error) { console.warn('Shadow Realms XP observer failed:', name, error); }
  }

  award(unitOrId, amount, { kill = false, assist = false } = {}) {
    const unit = this.resolve(unitOrId);
    if (!livingBlue(unit) || !finite(amount) || amount < 1)
      return { ok: false, reason: 'invalid' };
    const xp = Math.floor(amount);
    if (xp <= 0) return { ok: false, reason: 'invalid' };
    const state = this.records.get(unit.id) || {
      id: unit.id, level: 1, xp: 0, totalXP: 0, kills: 0, assists: 0,
    };
    const previous = state.level;
    state.totalXP += xp;
    state.xp += xp;
    if (kill) state.kills++;
    if (assist) state.assists++;
    while (state.level < MAX_UNIT_LEVEL) {
      const needed = xpForNextLevel(state.level);
      if (!(needed > 0) || state.xp < needed) break;
      state.xp -= needed;
      state.level++;
    }
    if (state.level === MAX_UNIT_LEVEL) state.xp = 0;
    this.records.set(unit.id, state);
    this.totalEarned += xp;
    const record = this.get(unit.id);
    this.#emit('xp', { unit, id: unit.id, amount: xp, record,
      reason: kill ? 'kill' : assist ? 'assist' : 'award' });
    if (state.level > previous)
      this.#emit('level_up', { unit, from: previous, to: state.level, record });
    return { ok: true, levelUp: state.level > previous, record };
  }

  #alreadyDefeated(victim) {
    return this.defeated.has(victim.id) || this.defeatedUnits.has(victim);
  }

  #markDefeated(victim) {
    this.defeatedUnits.add(victim);
    if (this.defeated.size >= MAX_DEFEATED_HISTORY)
      this.defeated.delete(this.defeated.values().next().value);
    this.defeated.add(victim.id);
  }

  #rememberDamage({ unit: victim, source, applied } = {}) {
    if (victim?.team !== 'red' || victim.id == null || this.#alreadyDefeated(victim) ||
        !finite(applied) || applied <= 0) return false;
    const attacker = this.resolve(source);
    if (!livingBlue(attacker) || attacker.id === victim.id) return false;
    let entry = this.contributors.get(victim.id);
    if (!entry) {
      // Evict oldest unresolved victim; bound memory even if enemies despawn.
      if (this.contributors.size >= MAX_VICTIMS)
        this.contributors.delete(this.contributors.keys().next().value);
      entry = new Map();
      this.contributors.set(victim.id, entry);
    }
    if (!entry.has(attacker.id) && entry.size >= MAX_CONTRIBUTORS) return false;
    entry.set(attacker.id, (entry.get(attacker.id) || 0) + applied);
    return true;
  }

  #rewardDeath({ unit: victim, source } = {}) {
    if (victim?.team !== 'red' || victim.id == null || this.#alreadyDefeated(victim))
      return false;
    // Commit dedup BEFORE emitting XP. Reentrant death callbacks stay safe.
    this.#markDefeated(victim);
    const contributions = this.contributors.get(victim.id) || new Map();
    this.contributors.delete(victim.id);
    const reward = experienceForKill(victim);
    if (!(reward > 0)) return false;

    const lastHit = this.resolve(source);
    const killer = livingBlue(lastHit) && lastHit.id !== victim.id ? lastHit : null;
    let credited = false;
    if (killer && this.award(killer, reward, { kill: true }).ok) {
      this.confirmedKills++;
      credited = true;
    }

    // An assist must be a meaningful contribution by a surviving blue unit.
    // Keep the original killer reward intact, and give at most 25% more XP
    // across FOUR assistants. Never award XP to enemy or unknown sources.
    const qualifying = [...contributions].map(([id, damage]) => ({
      unit: this.resolve(id), damage,
    })).filter(x => x.unit && livingBlue(x.unit) && x.unit.id !== killer?.id)
      .sort((a, b) => b.damage - a.damage || String(a.unit.id).localeCompare(String(b.unit.id)));
    const totalDamage = [...contributions.values()].reduce((sum, n) => sum + n, 0);
    const minDamage = Math.max(2, totalDamage * 0.12);
    const helpers = qualifying.filter(x => x.damage >= minDamage).slice(0, MAX_ASSISTANTS);
    const pool = Math.floor(reward * 0.25);
    if (pool <= 0 || !helpers.length) return credited;
    const weight = helpers.reduce((sum, h) => sum + h.damage, 0);
    if (!(weight > 0)) return credited;

    // Integer largest-remainder allocation: sum of assist awards <= pool.
    const portions = helpers.map(h => {
      const exact = pool * h.damage / weight;
      return { unit: h.unit, xp: Math.floor(exact), fraction: exact % 1 };
    });
    let extra = pool - portions.reduce((sum, p) => sum + p.xp, 0);
    const ranked = [...portions].sort((a, b) => b.fraction - a.fraction ||
      String(a.unit.id).localeCompare(String(b.unit.id)));
    for (const part of ranked) { if (extra-- <= 0) break; part.xp++; }
    for (const part of portions) {
      if (part.xp > 0 && this.award(part.unit, part.xp, { assist: true }).ok) {
        this.confirmedAssists++;
        credited = true;
      }
    }
    return credited;
  }

  /** HealthSystem sends damage BEFORE death, with source as unit or owner ID. */
  onHealthEvent(event, payload = {}) {
    if (event === 'damage') return this.#rememberDamage(payload);
    if (event === 'death') return this.#rewardDeath(payload);
    return false;
  }

  getSummary() {
    return { tracked: this.records.size, totalEarned: this.totalEarned,
      confirmedKills: this.confirmedKills, confirmedAssists: this.confirmedAssists,
      pendingVictims: this.contributors.size };
  }

  reset() {
    this.records.clear();
    this.defeated.clear();
    this.defeatedUnits = new WeakSet();
    this.contributors.clear();
    this.totalEarned = 0;
    this.confirmedKills = 0;
    this.confirmedAssists = 0;
  }
}
export default ExperienceSystem;
