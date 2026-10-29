/**
 * Shadow Realms — DefenseSystem (Step 46, complete replacement).
 * Reuses one Construction/Rice wallet, WorldMap collision and Pathfinding.
 * Preserves constructor, placement API, combat damage, drawing and destroy.
 *
 * Safeguards: full-footprint terrain checks, atomic paid placement with
 * compensating rollback, no reentrant double purchase, observer-safe events,
 * and at most one structure attack per red enemy per attack cooldown.
 * The existing TrapSystem and TowerSystem work without modifications.
 */
import {
  DEFENSE_BLUEPRINTS, DEFENSE_PLACEMENT, getDefenseBlueprint, getDefenseFootprint,
} from './DefenseBlueprints.js';

const finite = Number.isFinite;
const point = p => finite(p?.x) && finite(p?.y);
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const positive = (value, fallback) => finite(value) && value > 0 ? value : fallback;
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const overlaps = (a, b, padding = 0) =>
  point(a) && point(b) && finite(a.width) && finite(a.depth) &&
  finite(b.width) && finite(b.depth) &&
  Math.abs(a.x - b.x) < (a.width + b.width) / 2 + padding &&
  Math.abs(a.y - b.y) < (a.depth + b.depth) / 2 + padding;
const hitRect = (x, y, r, box) => {
  const dx = Math.max(Math.abs(x - box.x) - box.width / 2, 0);
  const dy = Math.max(Math.abs(y - box.y) - box.depth / 2, 0);
  return dx * dx + dy * dy <= r * r;
};
const livingEnemy = u => u?.id != null && u.team === 'red' &&
  u.alive !== false && finite(u.hp) && u.hp > 0 && point(u);

export class DefenseSystem {
  constructor({ map, construction, rice, navigation = null, getUnits = () => [],
    maxStructures = 36, onEvent = null } = {}) {
    if (typeof map?.isWalkable !== 'function' || typeof map?.getTerrainAt !== 'function')
      throw new TypeError('DefenseSystem needs the existing WorldMap');
    if (typeof construction?.getResources !== 'function' ||
        typeof construction?.setWood !== 'function')
      throw new TypeError('DefenseSystem needs ConstructionSystem with setWood');
    if (typeof rice?.getResources !== 'function' ||
        typeof rice?.setStorageRice !== 'function')
      throw new TypeError('DefenseSystem needs RiceSystem');
    if (map.isWalkable.__shadowDefenseOwner !== undefined)
      throw new Error('DefenseSystem already attached to this map');

    this.map = map;
    this.construction = construction;
    this.rice = rice;
    this.navigation = navigation;
    this.getUnits = typeof getUnits === 'function' ? getUnits : () => getUnits;
    this.maxStructures = Math.floor(clamp(positive(maxStructures, 36), 1, 150));
    this.onEvent = typeof onEvent === 'function' ? onEvent : null;
    this.structures = [];
    this.byId = new Map();
    this.serial = 0;
    this.destroyed = false;
    this.placing = false;
    this.elapsed = 0;
    this.siegeClock = 0;
    this.siegeCooldowns = new Map(); // Enemy ID => time until next siege attack.

    this.originalWalkable = map.isWalkable;
    const owner = this;
    const wrapped = function(x, y, radius = 13) {
      if (!owner.originalWalkable.call(this, x, y, radius) || !finite(x) || !finite(y))
        return false;
      const r = clamp(finite(radius) ? radius : 13, 0, 150);
      return !owner.structures.some(s => s.alive && s.kind !== 'trap' &&
        hitRect(x, y, r, s));
    };
    wrapped.__shadowDefenseOwner = this;
    this.wrappedWalkable = wrapped;
    map.isWalkable = wrapped;
    this.#invalidateNavigation();

    this.originalValidate = construction.validatePlacement;
    if (typeof this.originalValidate === 'function') {
      this.wrappedValidate = function(type, position) {
        const result = owner.originalValidate.call(this, type, position);
        if (!result?.ok || !point(position)) return result;
        const sizes = { house: [94, 70], barn: [108, 80] };
        const size = sizes[type];
        if (!size) return result;
        const footprint = { ...position, width: size[0], depth: size[1] };
        return owner.structures.some(s => s.alive && overlaps(s, footprint, 12))
          ? { ok: false, reason: 'defense_overlap' } : result;
      };
      construction.validatePlacement = this.wrappedValidate;
    }
  }

  #emit(name, data) {
    try { this.onEvent?.(name, data); }
    catch (error) { console.warn('Shadow Realms defense event failed:', name, error); }
  }
  #invalidateNavigation() {
    try { this.navigation?.invalidate?.(); }
    catch (error) { console.warn('Shadow Realms defense navigation invalidate failed:', error); }
  }
  getStructures() { return this.structures.filter(s => s.alive); }
  getById(id) { return this.byId.get(id) || null; }
  getBlueprints() { return DEFENSE_BLUEPRINTS; }
  getResources() { return this.construction.getResources(); }
  getSummary() {
    const live = this.getStructures();
    return { total: live.length,
      traps: live.filter(s => s.kind === 'trap').length,
      towers: live.filter(s => s.kind === 'tower').length,
      barricades: live.filter(s => s.type === 'barricade').length };
  }
  canAfford(type) {
    if (this.destroyed || this.placing) return false;
    const spec = getDefenseBlueprint(type);
    if (!spec) return false;
    const resources = this.getResources();
    return finite(resources?.rice) && finite(resources?.wood) &&
      resources.rice >= spec.cost.rice && resources.wood >= spec.cost.wood;
  }

  validatePlacement(type, position) {
    if (this.destroyed) return { ok: false, reason: 'destroyed' };
    if (this.placing) return { ok: false, reason: 'busy' };
    const spec = getDefenseBlueprint(type);
    if (!spec) return { ok: false, reason: 'unknown_type' };
    const box = getDefenseFootprint(type, position);
    if (!box) return { ok: false, reason: 'invalid_position' };
    if (this.getStructures().length >= this.maxStructures)
      return { ok: false, reason: 'limit' };
    const { margin, footprintSample } = DEFENSE_PLACEMENT;
    const left = position.x - box.width / 2;
    const right = position.x + box.width / 2;
    const top = position.y - box.depth / 2;
    const bottom = position.y + box.depth / 2;
    if (left < margin || right > this.map.width - margin ||
        top < margin || bottom > this.map.height - margin)
      return { ok: false, reason: 'outside_map' };

    // Include the far right/bottom edges even when the footprint is not a
    // multiple of the sampling interval. Do not allow hidden water/tree slivers.
    const allowed = spec.kind === 'trap'
      ? DEFENSE_PLACEMENT.trapTerrain : DEFENSE_PLACEMENT.solidTerrain;
    for (let y = top; y <= bottom + footprintSample; y += footprintSample) {
      const sy = Math.min(y, bottom);
      for (let x = left; x <= right + footprintSample; x += footprintSample) {
        const sx = Math.min(x, right);
        if (!allowed.includes(this.map.getTerrainAt(sx, sy)))
          return { ok: false, reason: 'terrain' };
        if (!this.originalWalkable.call(this.map, sx, sy, 3))
          return { ok: false, reason: 'blocked' };
      }
    }
    // Include all actual corners explicitly for arbitrary future sizes.
    for (const x of [left, right]) for (const y of [top, bottom]) {
      if (!allowed.includes(this.map.getTerrainAt(x, y)) ||
          !this.originalWalkable.call(this.map, x, y, 3))
        return { ok: false, reason: 'terrain' };
    }

    if (this.getStructures().some(s => overlaps(box, s, DEFENSE_PLACEMENT.betweenDefenses)))
      return { ok: false, reason: 'defense_overlap' };
    for (const building of this.construction.getBuildings?.() || []) {
      if (overlaps(box, {
        x: building.x, y: building.y, width: building.width, depth: building.depth,
      }, DEFENSE_PLACEMENT.fromBuildings))
        return { ok: false, reason: 'building_overlap' };
    }
    for (const field of this.rice.getFields?.() || []) {
      if (overlaps(box, {
        x: field.x, y: field.y, width: field.width, depth: field.height,
      }, DEFENSE_PLACEMENT.fromFields))
        return { ok: false, reason: 'rice_field' };
    }
    if (spec.kind !== 'trap') {
      const units = this.getUnits() || [];
      for (const unit of Array.isArray(units) ? units : []) {
        if (unit?.alive === false || !point(unit)) continue;
        if (hitRect(unit.x, unit.y, positive(unit.radius, 13), box))
          return { ok: false, reason: 'unit_occupying' };
      }
    }
    return { ok: true, reason: 'ready' };
  }

  /** Undo a failed transaction even if the wood setter mutated then threw. */
  #restoreResources(before) {
    let riceOK = false;
    let woodOK = false;
    try { riceOK = this.rice.setStorageRice(before.rice) === true; } catch { /* rollback */ }
    try { woodOK = this.construction.setWood(before.wood) === true; } catch { /* rollback */ }
    return riceOK && woodOK;
  }

  place(type, position, { team = 'blue' } = {}) {
    const validation = this.validatePlacement(type, position);
    if (!validation.ok) return validation;
    if (team !== 'blue' && team !== 'red') return { ok: false, reason: 'invalid_team' };
    const spec = getDefenseBlueprint(type);
    const before = this.getResources();
    if (!finite(before?.rice) || !finite(before?.wood) ||
        before.rice < spec.cost.rice || before.wood < spec.cost.wood)
      return { ok: false, reason: 'insufficient_resources' };

    // Guard against a synchronous onChange observer buying twice before the
    // current structure exists (ConstructionSystem.setWood emits onChange).
    this.placing = true;
    try {
      let paidRice = false;
      let paidWood = false;
      try {
        paidRice = this.rice.setStorageRice(before.rice - spec.cost.rice) === true;
        if (paidRice) paidWood = this.construction.setWood(before.wood - spec.cost.wood) === true;
      } catch (error) {
        const rolledBack = this.#restoreResources(before);
        return { ok: false, reason: rolledBack ? 'payment_failed' : 'rollback_failed' };
      }
      if (!paidRice || !paidWood) {
        const rolledBack = this.#restoreResources(before);
        return { ok: false, reason: rolledBack
          ? (paidRice ? 'wood_payment_failed' : 'rice_payment_failed')
          : 'rollback_failed' };
      }

      const structure = {
        id: `defense-${++this.serial}`, type, kind: spec.kind, team,
        x: position.x, y: position.y, width: spec.width, depth: spec.depth,
        hp: spec.hp, maxHp: spec.hp, alive: true, armor: 0,
        damage: spec.damage ?? 0, cooldown: spec.cooldown ?? 0,
        charges: spec.charges ?? null, range: spec.range ?? 0,
        placedAt: this.elapsed,
      };
      this.structures.push(structure);
      this.byId.set(structure.id, structure);
      if (spec.kind !== 'trap') this.#invalidateNavigation();
      this.#emit('placed', { structure, cost: { ...spec.cost } });
      return { ok: true, structure };
    } finally {
      this.placing = false;
    }
  }

  damageStructure(id, damage, { source = null } = {}) {
    const structure = this.getById(id);
    if (!structure?.alive || !finite(damage) || damage <= 0)
      return { ok: false, reason: 'invalid' };
    const applied = Math.min(structure.hp,
      Math.max(1, Math.round(damage - Math.max(0, finite(structure.armor) ? structure.armor : 0))));
    structure.hp = Math.max(0, structure.hp - applied);
    const killed = structure.hp <= 0;
    this.#emit('hit', { structure, applied, source });
    if (killed && structure.alive) this.remove(id, { reason: 'destroyed' });
    return { ok: true, applied, remaining: structure.hp, killed: !structure.alive };
  }

  remove(id, { reason = 'removed' } = {}) {
    const structure = this.byId.get(id);
    if (!structure?.alive) return false;
    structure.alive = false;
    this.byId.delete(id);
    this.structures = this.structures.filter(other => other !== structure);
    if (structure.kind !== 'trap') this.#invalidateNavigation();
    this.#emit('removed', { structure, reason });
    return true;
  }

  /** Each red unit attacks only ONE nearby defense per its own cooldown. */
  update(dt) {
    if (this.destroyed || !finite(dt) || dt <= 0) return;
    const delta = Math.min(dt, 0.1);
    this.elapsed += delta;
    this.siegeClock += delta;
    if (this.siegeClock < 0.2) return;
    const seconds = this.siegeClock;
    this.siegeClock = 0;
    const raw = this.getUnits() || [];
    const enemies = Array.isArray(raw) ? raw.filter(livingEnemy) : [];
    const seen = new Set();
    const unique = enemies.filter(u => {
      if (seen.has(u.id)) return false;
      seen.add(u.id);
      return true;
    });
    for (const id of this.siegeCooldowns.keys())
      if (!seen.has(id)) this.siegeCooldowns.delete(id);
    const structures = this.getStructures().filter(s => s.kind !== 'trap');
    if (!structures.length) return;
    for (const enemy of unique) {
      const timer = Math.max(0, (this.siegeCooldowns.get(enemy.id) || 0) - seconds);
      if (timer > 0) { this.siegeCooldowns.set(enemy.id, timer); continue; }
      this.siegeCooldowns.delete(enemy.id);
      const range = clamp(positive(enemy.attackRange, 36) + 12, 15, 800);
      let target = null;
      let closest = Infinity;
      for (const s of structures) {
        if (!s.alive || s.team === enemy.team || !hitRect(enemy.x, enemy.y, range, s)) continue;
        const d = distance(enemy, s);
        if (d < closest) { closest = d; target = s; }
      }
      if (!target) continue;
      const outcome = this.damageStructure(target.id, positive(enemy.attackDamage, 8), { source: enemy });
      if (outcome.ok) this.siegeCooldowns.set(enemy.id,
        clamp(positive(enemy.attackCooldown, 1.25), 0.3, 12));
    }
  }

  draw(ctx, camera) {
    if (!ctx || typeof camera?.worldToScreen !== 'function') return;
    const zoom = clamp(positive(camera.zoom, 1), 0.35, 3);
    for (const s of [...this.getStructures()].sort((a, b) => a.y - b.y)) {
      const p = camera.worldToScreen(s.x, s.y);
      if (!point(p) || p.x < -120 || p.x > camera.viewportWidth + 120 ||
          p.y < -170 || p.y > camera.viewportHeight + 100) continue;
      ctx.save(); ctx.translate(p.x, p.y); ctx.scale(zoom, zoom);
      ctx.fillStyle = 'rgba(13,32,21,.32)'; ctx.beginPath();
      ctx.ellipse(2, 3, s.width * .51, 7, 0, 0, Math.PI * 2); ctx.fill();
      if (s.type === 'spikes') {
        ctx.fillStyle = '#715438'; ctx.fillRect(-26, -13, 52, 28);
        ctx.fillStyle = '#c2a879';
        for (let x = -19; x < 24; x += 13) {
          ctx.beginPath(); ctx.moveTo(x, -8); ctx.lineTo(x + 6, -24);
          ctx.lineTo(x + 12, -8); ctx.fill();
        }
      } else if (s.type === 'barricade') {
        ctx.fillStyle = '#68452f'; ctx.fillRect(-40, -33, 80, 39);
        ctx.strokeStyle = '#b88952'; ctx.lineWidth = 6;
        for (let x = -30; x <= 30; x += 20) {
          ctx.beginPath(); ctx.moveTo(x, -34); ctx.lineTo(x, 5); ctx.stroke();
        }
        ctx.strokeStyle = '#493227'; ctx.lineWidth = 3;
        ctx.strokeRect(-39, -33, 78, 39);
      } else if (s.type === 'watchtower') {
        ctx.fillStyle = '#644431'; ctx.fillRect(-24, -84, 10, 88);
        ctx.fillRect(14, -84, 10, 88);
        ctx.fillStyle = '#9b7650'; ctx.fillRect(-36, -103, 72, 25);
        ctx.fillStyle = '#4d6557'; ctx.beginPath();
        ctx.moveTo(-43, -101); ctx.lineTo(0, -137); ctx.lineTo(43, -101);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#d8ad69'; ctx.fillRect(-13, -94, 26, 9);
      }
      if (s.hp < s.maxHp) {
        ctx.fillStyle = '#332d29'; ctx.fillRect(-25, -s.depth - 18, 50, 5);
        ctx.fillStyle = s.hp / s.maxHp > .4 ? '#79ca7b' : '#e8766c';
        ctx.fillRect(-25, -s.depth - 18, 50 * s.hp / s.maxHp, 5);
      }
      ctx.restore();
    }
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    if (this.map.isWalkable === this.wrappedWalkable)
      this.map.isWalkable = this.originalWalkable;
    if (this.wrappedValidate && this.construction.validatePlacement === this.wrappedValidate)
      this.construction.validatePlacement = this.originalValidate;
    this.structures = [];
    this.byId.clear();
    this.siegeCooldowns.clear();
    this.#invalidateNavigation();
  }
}
export default DefenseSystem;
