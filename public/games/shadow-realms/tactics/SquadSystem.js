/**
 * Shadow Realms — SquadSystem (Step 42, one-file replacement).
 *
 * Keeps existing create/add/remove/disband/formation/move/attackMove/guard/stop
 * API and game services. The built-in Pathfinding supports route preflight:
 * invalid orders do NOT release farmers from jobs or erase old combat orders.
 * No new engine, UI, network requests, persistent state or game-loop hooks.
 */
import { FORMATIONS } from './FormationSystem.js';

const finite = Number.isFinite;
const point = value => finite(value?.x) && finite(value?.y);
const alive = unit => unit?.id != null && unit.team === 'blue' &&
  unit.alive !== false && finite(unit.hp) && unit.hp > 0 && point(unit);
const validShape = shape => FORMATIONS.includes(shape);
const idsOf = value => [...new Set(Array.isArray(value) ? value : [value])].filter(id => id != null);

export class SquadSystem {
  constructor({ getUnits = () => [], formation, combat = null,
    maxSquads = 12, onClaimUnit = null, onEvent = null } = {}) {
    if (typeof formation?.plan !== 'function' || typeof formation?.move !== 'function')
      throw new TypeError('SquadSystem needs the existing FormationSystem');
    this.getWorldUnits = typeof getUnits === 'function' ? getUnits : () => getUnits;
    this.formation = formation;
    this.combat = combat;
    this.maxSquads = finite(maxSquads) ? Math.max(1, Math.min(100, Math.floor(maxSquads))) : 12;
    this.onClaimUnit = typeof onClaimUnit === 'function' ? onClaimUnit : null;
    this.onEvent = typeof onEvent === 'function' ? onEvent : null;
    this.squads = new Map();
    this.members = new Map();
    this.serial = 0;
    this.destroyed = false;
  }

  #emit(name, data) {
    try { this.onEvent?.(name, data); }
    catch (error) { console.warn('Shadow Realms squad observer failed:', name, error); }
  }
  #all() {
    const result = this.getWorldUnits() || [];
    return Array.isArray(result) ? result : [];
  }
  #resolve(value) {
    const byId = new Map(this.#all().filter(alive).map(unit => [unit.id, unit]));
    return idsOf(value).map(id => byId.get(id)).filter(Boolean);
  }
  #available(value) {
    const requested = idsOf(value);
    if (!requested.length) return { ok: false, reason: 'no_available_units' };
    const units = this.#resolve(requested);
    if (units.length !== requested.length)
      return { ok: false, reason: 'no_available_units' };
    if (units.some(unit => this.members.has(unit.id)))
      return { ok: false, reason: 'unit_assigned' };
    return { ok: true, units };
  }

  getSquad(id) {
    const squad = this.squads.get(id);
    return squad ? { ...squad, unitIds: [...squad.unitIds] } : null;
  }
  getSquads() { return [...this.squads.keys()].map(id => this.getSquad(id)); }
  getUnits(id) {
    const squad = this.squads.get(id);
    return squad ? this.#resolve(squad.unitIds) : [];
  }

  createSquad(unitIds, { name = null, shape = 'line' } = {}) {
    if (this.destroyed) return { ok: false, reason: 'disposed' };
    if (this.squads.size >= this.maxSquads)
      return { ok: false, reason: 'squad_limit' };
    if (!validShape(shape)) return { ok: false, reason: 'invalid_formation' };
    const selection = this.#available(unitIds);
    if (!selection.ok) return selection;
    const id = `squad-${++this.serial}`;
    const squad = {
      id, name: String(name || `Squad ${this.serial}`).slice(0, 50), shape,
      unitIds: selection.units.map(unit => unit.id),
    };
    this.squads.set(id, squad);
    for (const unit of selection.units) this.members.set(unit.id, id);
    this.#emit('created', this.getSquad(id));
    return { ok: true, squad: this.getSquad(id) };
  }

  addUnits(id, unitIds) {
    if (this.destroyed) return { ok: false, reason: 'disposed' };
    const squad = this.squads.get(id);
    if (!squad) return { ok: false, reason: 'unknown_squad' };
    const selection = this.#available(unitIds);
    if (!selection.ok) return selection;
    for (const unit of selection.units) {
      squad.unitIds.push(unit.id);
      this.members.set(unit.id, id);
    }
    this.#emit('updated', this.getSquad(id));
    return { ok: true, added: selection.units.length };
  }

  removeUnit(unitId) {
    const id = this.members.get(unitId), squad = this.squads.get(id);
    if (!squad) { this.members.delete(unitId); return false; }
    squad.unitIds = squad.unitIds.filter(value => value !== unitId);
    this.members.delete(unitId);
    if (!squad.unitIds.length) {
      this.squads.delete(id);
      this.#emit('disbanded', { id });
    } else this.#emit('updated', this.getSquad(id));
    return true;
  }
  disband(id) {
    const squad = this.squads.get(id);
    if (!squad) return false;
    for (const uid of squad.unitIds) this.members.delete(uid);
    this.squads.delete(id);
    // Disbanding membership does NOT interrupt an independent patrol/guard.
    this.#emit('disbanded', { id });
    return true;
  }
  setFormation(id, shape) {
    const squad = this.squads.get(id);
    if (!squad || !validShape(shape) || this.destroyed) return false;
    squad.shape = shape;
    return true;
  }

  #claim(units) {
    if (!this.onClaimUnit) return true;
    try {
      for (const unit of units) this.onClaimUnit(unit);
      return true;
    } catch (error) {
      this.#emit('command_error', { reason: 'claim_failed', error: String(error) });
      return false;
    }
  }
  #prepare(id) {
    const squad = this.squads.get(id);
    if (!squad) return { ok: false, reason: 'unknown_squad' };
    if (this.destroyed) return { ok: false, reason: 'disposed' };
    const units = this.getUnits(id);
    if (!units.length) return { ok: false, reason: 'no_units' };
    if (units.length !== squad.unitIds.length)
      return { ok: false, reason: 'no_units' }; // Never silently issue partial orders.
    return { ok: true, squad, units, ids: units.map(unit => unit.id) };
  }
  #validDestination(destination, units) {
    if (!point(destination)) return false;
    if (typeof this.formation.map?.isWalkable !== 'function') return false;
    return units.every(unit => this.formation.map.isWalkable(
      destination.x, destination.y, unit.radius || 14));
  }

  move(id, destination, options = {}) {
    const request = this.#prepare(id);
    if (!request.ok) return request;
    if (!point(destination)) return { ok: false, reason: 'invalid_command' };
    const { squad, units, ids } = request;
    const shape = options.shape || squad.shape;
    if (!validShape(shape)) return { ok: false, reason: 'invalid_formation' };
    const plan = this.formation.plan(units, destination, { ...options, shape });
    if (!plan.ok || plan.skipped.length || plan.assignments.length !== units.length)
      return { ...plan, ok: false, reason: plan.reason || 'no_route', moved: 0 };

    const navigation = this.formation.navigation;
    if (typeof navigation?.findPath === 'function') {
      // Compute EVERY route before changing an old order/job. The actual game
      // uses Pathfinding.findPath() + Farmer.setPath() and needs no duplicate A*.
      const routes = [];
      for (const assignment of plan.assignments) {
        let path;
        try {
          path = navigation.findPath(assignment.unit, assignment.point,
            { radius: assignment.unit.radius || 14 });
        } catch { path = []; }
        if (!Array.isArray(path) || !path.length ||
            typeof assignment.unit.setPath !== 'function')
          return { ...plan, ok: false, reason: 'no_route', moved: 0,
            skipped: [...plan.skipped, { unitId: assignment.unitId, reason: 'no_route' }] };
        routes.push(path);
      }
      if (!this.#claim(units)) return { ok: false, reason: 'claim_failed', moved: 0 };
      this.combat?.orderStop?.(ids);
      let moved = 0;
      for (let index = 0; index < plan.assignments.length; index++) {
        const assignment = plan.assignments[index];
        try { if (assignment.unit.setPath(routes[index])) moved++; }
        catch (error) { this.#emit('command_error', { id, unitId: assignment.unitId,
          reason: 'path_error', error: String(error) }); }
      }
      const result = { ...plan, ok: moved === units.length, moved,
        requested: units.length, reason: moved === units.length ? undefined : 'path_error' };
      this.#emit('ordered', { id, type: 'move', result });
      return result;
    }

    // Compatible fallback for older custom navigation adapters that only
    // implement moveUnit(). Planning still rejects blocked formations first.
    if (!this.#claim(units)) return { ok: false, reason: 'claim_failed', moved: 0 };
    this.combat?.orderStop?.(ids);
    const result = this.formation.move(units, destination, { ...options, shape });
    this.#emit('ordered', { id, type: 'move', result });
    return result;
  }

  attackMove(id, destination) {
    const request = this.#prepare(id);
    if (!request.ok) return request;
    if (typeof this.combat?.orderAttackMove !== 'function')
      return { ok: false, reason: 'combat_unavailable' };
    if (!this.#validDestination(destination, request.units))
      return { ok: false, reason: 'invalid_point' };
    if (!this.#claim(request.units)) return { ok: false, reason: 'claim_failed' };
    const count = this.combat.orderAttackMove(request.ids, destination);
    this.#emit('ordered', { id, type: 'attackMove', point: { ...destination }, count });
    return { ok: count === request.units.length, count };
  }

  guard(id, destination = null, { radius = 290 } = {}) {
    const request = this.#prepare(id);
    if (!request.ok) return request;
    if (typeof this.combat?.orderGuard !== 'function')
      return { ok: false, reason: 'combat_unavailable' };
    const { units } = request;
    const centre = destination || {
      x: units.reduce((sum, unit) => sum + unit.x, 0) / units.length,
      y: units.reduce((sum, unit) => sum + unit.y, 0) / units.length,
    };
    if (!point(centre) || (destination && !this.#validDestination(centre, units)))
      return { ok: false, reason: 'invalid_point' };
    if (!this.#claim(units)) return { ok: false, reason: 'claim_failed' };
    const count = this.combat.orderGuard(request.ids, centre, { radius });
    this.#emit('ordered', { id, type: 'guard', point: { ...centre }, count });
    return { ok: count === units.length, count, point: centre };
  }

  stop(id) {
    if (!this.squads.has(id) || this.destroyed) return false;
    const ids = this.getUnits(id).map(unit => unit.id);
    this.combat?.orderStop?.(ids);
    return true;
  }
  prune() {
    if (this.destroyed) return;
    const live = new Set(this.#all().filter(alive).map(unit => unit.id));
    for (const id of [...this.members.keys()]) if (!live.has(id)) this.removeUnit(id);
  }
  draw(ctx, camera) {
    if (this.destroyed || !ctx || typeof camera?.worldToScreen !== 'function') return;
    ctx.save();
    let index = 0;
    for (const squad of this.squads.values()) {
      index++;
      const unit = this.getUnits(squad.id)[0];
      if (!unit) continue;
      const p = camera.worldToScreen(unit.x, unit.y);
      if (!point(p)) continue;
      const zoom = finite(camera.zoom) ? camera.zoom : 1;
      const y = p.y - 74 * zoom;
      if (p.x < -30 || p.x > camera.viewportWidth + 30 ||
          y < -30 || y > camera.viewportHeight + 30) continue;
      ctx.fillStyle = 'rgba(18,39,48,.8)';
      ctx.strokeStyle = '#a1dafa';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(p.x, y, 12, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#e5f8ff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(index), p.x, y);
    }
    ctx.restore();
  }
  getSummary() { return { squads: this.squads.size, units: this.members.size }; }
  destroy() {
    if (this.destroyed) return;
    for (const id of [...this.squads.keys()]) this.disband(id);
    this.members.clear();
    this.destroyed = true;
    this.onEvent = null;
  }
}
export default SquadSystem;
