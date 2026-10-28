/**
 * Shadow Realms — HealthSystem (Step 37, complete single-file update).
 * The existing game owns every Farmer/Enemy and uses this instance for HP,
 * armor, healing, regeneration, death events and short Canvas health bars.
 *
 * Compatible with CombatSystem, ProjectileSystem, BossEncounter,
 * ProgressionFeature, MissionDirector and VisualSystem without edits.
 * No new game loop, backend, timers or storage.
 */
const finite = Number.isFinite;
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const isPoint = point => finite(point?.x) && finite(point?.y);

export class HealthSystem {
  constructor({ getUnits = () => [], onEvent = null } = {}) {
    this.getUnits = typeof getUnits === 'function' ? getUnits : () => getUnits;
    // onEvent is intentionally public: ProgressionFeature and EnemyStrategyFeature
    // install reversible observers on this exact property.
    this.onEvent = typeof onEvent === 'function' ? onEvent : null;
    this.registered = new Map();
    this.deadNotified = new WeakSet();
    this.regenPending = new WeakMap();
  }

  #emit(name, data) {
    // UI/visual callbacks must never prevent the mandatory death event or
    // interrupt the shared combat loop after HP has already been committed.
    try { this.onEvent?.(name, data); }
    catch (error) { console.warn('Shadow Realms health observer failed:', name, error); }
  }

  register(unit) {
    if (!unit || typeof unit !== 'object' || unit.id == null) return false;
    this.#normalize(unit);
    this.registered.set(unit.id, unit);
    return true;
  }

  unregister(id) {
    return this.registered.delete(typeof id === 'object' ? id?.id : id);
  }

  /** Registered entities plus current world entities, deduplicated by ID. */
  units() {
    const all = new Map(this.registered);
    const dynamic = this.getUnits() || [];
    if (Array.isArray(dynamic)) for (const unit of dynamic) {
      if (unit && typeof unit === 'object' && unit.id != null) all.set(unit.id, unit);
    }
    return [...all.values()];
  }

  resolve(value) {
    if (value && typeof value === 'object') return value;
    if (value == null) return null;
    return this.units().find(unit => unit.id === value) || null;
  }

  #normalize(unit) {
    const hp = finite(unit.hp) ? Math.max(0, unit.hp) : (unit.alive === false ? 0 : 100);
    const max = finite(unit.maxHp) && unit.maxHp > 0 ? unit.maxHp : Math.max(100, hp);
    unit.maxHp = max;
    unit.hp = clamp(hp, 0, max);
    if (unit.hp <= 0 || unit.alive === false) {
      unit.hp = 0;
      unit.alive = false;
      unit.selectable = false;
    } else if (unit.alive == null) unit.alive = true;
    return unit;
  }

  isAlive(value) {
    const unit = this.resolve(value);
    return !!unit && unit.alive !== false && finite(unit.hp) && unit.hp > 0;
  }

  /** Returns {ok,applied,remaining,killed}; source is an object OR owner ID. */
  damage(target, amount, { source = null, type = 'physical', ignoreArmor = false } = {}) {
    const unit = this.resolve(target);
    if (!unit || !finite(amount) || amount <= 0)
      return { ok: false, reason: 'invalid', applied: 0, killed: false };
    this.#normalize(unit);
    if (!this.isAlive(unit))
      return { ok: false, reason: 'dead', applied: 0, killed: false };

    const armor = ignoreArmor ? 0 : clamp(finite(unit.armor) ? unit.armor : 0, 0, 9999);
    // Preserve the existing combat minimum-one-damage rule after armor.
    const requested = Math.min(unit.hp, Math.max(1, Math.round(amount - armor)));
    const before = unit.hp;
    if (typeof unit.takeDamage === 'function') {
      try { unit.takeDamage(requested); }
      catch (error) {
        // Do not inflict a SECOND hit if a custom implementation throws after
        // already modifying HP. Keep the observed value when it is valid.
        if (!finite(unit.hp) || unit.hp === before) unit.hp = before - requested;
        console.warn('Shadow Realms unit.takeDamage failed:', error);
      }
    } else unit.hp = before - requested;
    unit.hp = clamp(finite(unit.hp) ? unit.hp : before - requested, 0, unit.maxHp);
    const killed = unit.hp <= 0 || unit.alive === false;
    if (killed) {
      unit.hp = 0;
      unit.alive = false;
      unit.selectable = false;
      try { unit.stop?.(); }
      catch (error) { console.warn('Shadow Realms unit.stop failed:', error); }
      this.regenPending.delete(unit);
    }
    const applied = Math.max(0, before - unit.hp);
    // Reserve the unique death notification BEFORE emitting damage. A visual
    // or mission observer may synchronously request another health operation.
    const announceDeath = killed && !this.deadNotified.has(unit);
    if (announceDeath) this.deadNotified.add(unit);
    if (applied > 0) this.#emit('damage', { unit, source, applied, type, killed });
    if (announceDeath) this.#emit('death', { unit, source, type });
    return { ok: true, applied, remaining: unit.hp, killed };
  }

  /** Manual healing keeps the previous immediate, exact event behavior. */
  heal(target, amount) {
    const unit = this.resolve(target);
    if (!unit || !finite(amount) || amount <= 0) return 0;
    this.#normalize(unit);
    if (!this.isAlive(unit)) return 0; // No resurrection via heal or regen.
    const before = unit.hp;
    unit.hp = clamp(before + amount, 0, unit.maxHp);
    const applied = unit.hp - before;
    if (applied > 0) this.#emit('heal', { unit, applied });
    return applied;
  }

  /** Apply fractional regen each tick, but batch tiny heal VISUAL events. */
  update(dt) {
    if (!finite(dt) || dt <= 0) return;
    const seconds = Math.min(0.1, dt);
    for (const unit of this.units()) {
      if (!this.isAlive(unit) || !finite(unit.regen) || unit.regen <= 0) continue;
      this.#normalize(unit);
      if (unit.hp >= unit.maxHp) {
        this.regenPending.delete(unit);
        continue;
      }
      const before = unit.hp;
      unit.hp = Math.min(unit.maxHp, before + unit.regen * seconds);
      const applied = Math.max(0, unit.hp - before);
      if (!applied) continue;
      const pending = (this.regenPending.get(unit) || 0) + applied;
      if (pending >= 1 - 1e-8 || unit.hp === unit.maxHp) {
        // CombatEffects renders integer text; never spam floating "+0".
        if (pending >= 0.5) this.#emit('heal', { unit, applied: pending });
        this.regenPending.delete(unit);
      } else this.regenPending.set(unit, pending);
    }
  }

  getStatus(value) {
    const unit = this.resolve(value);
    if (!unit) return null;
    this.#normalize(unit);
    return {
      id: unit.id, hp: unit.hp, maxHp: unit.maxHp,
      fraction: clamp(unit.hp / unit.maxHp, 0, 1),
      alive: this.isAlive(unit), team: unit.team,
    };
  }

  draw(ctx, camera, { showFull = false } = {}) {
    if (!ctx || typeof camera?.worldToScreen !== 'function') return;
    const zoom = finite(camera.zoom) && camera.zoom > 0 ? camera.zoom : 1;
    const width = clamp(36 * zoom, 24, 48);
    ctx.save();
    for (const unit of this.units()) {
      if (!this.isAlive(unit) || !finite(unit.maxHp) || unit.maxHp <= 0 ||
          (!showFull && unit.hp >= unit.maxHp) || !isPoint(unit)) continue;
      const position = camera.worldToScreen(unit.x, unit.y);
      if (!isPoint(position) || position.x < -50 || position.y < -100 ||
          position.x > camera.viewportWidth + 50 ||
          position.y > camera.viewportHeight + 50) continue;
      const x = position.x - width / 2;
      const y = position.y - Math.max(31, 68 * zoom);
      const fraction = clamp(unit.hp / unit.maxHp, 0, 1);
      ctx.fillStyle = 'rgba(16,22,16,.8)';
      ctx.fillRect(x - 1, y - 1, width + 2, 6);
      ctx.fillStyle = fraction > .6 ? '#75d978' : fraction > .3 ? '#e5c75e' : '#e86760';
      ctx.fillRect(x, y, width * fraction, 4);
    }
    ctx.restore();
  }

  reset() {
    this.registered.clear();
    this.deadNotified = new WeakSet();
    this.regenPending = new WeakMap();
  }
}

export default HealthSystem;
