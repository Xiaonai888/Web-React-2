/** Tactical bridge for existing Formation, Squad, Patrol, Combat and navigation. */
import { FormationSystem } from './FormationSystem.js';
import { SquadSystem } from './SquadSystem.js';
import { PatrolSystem } from './PatrolSystem.js';

export function createFeature(scope) {
  if (!scope || !scope.map || typeof scope.get !== 'function' ||
      typeof scope.provide !== 'function') {
    throw new TypeError('TacticsFeature needs GameContext scope');
  }
  const navigation = scope.get('navigation', scope.get('route', null));
  const combat = scope.get('combat', null);
  if (typeof navigation?.moveUnit !== 'function') {
    throw new Error('TacticsFeature requires existing navigation service');
  }
  // A newly created farmer remains a civilian until the full barracks training ends.
  // Retain RED units in this roster: PatrolSystem still needs visible enemies.
  const tacticalUnit = unit => {
    if (!unit || unit.alive === false || unit.trainingInside ||
        unit.trainingState || unit.training === true) return false;
    if (unit.team !== 'blue') return true;
    if (unit.isCivilian !== false) return false;
    return unit.type !== 'farmer' ||
      unit.combatTraining === 'melee' || unit.combatTraining === 'ranged';
  };
  const allUnits = () => {
    const get = scope.get('getUnits', null);
    if (typeof get === 'function') {
      const roster = get();
      return Array.isArray(roster) ? roster.filter(tacticalUnit) : [];
    }
    const farmers = scope.get('farmers', []);
    const ai = scope.get('enemyAI', null);
    const enemies = ai?.getUnits?.() || [];
    return [...(Array.isArray(farmers) ? farmers : []),
      ...(Array.isArray(enemies) ? enemies : [])].filter(tacticalUnit);
  };
  const emit = (name, payload) => {
    try { scope.emit(name, payload); }
    catch (error) { console.warn('Shadow Realms tactics event:', name, error); }
  };
  const formation = new FormationSystem({ map: scope.map, navigation });
  const claim = scope.get('claimTacticalUnit', null);
  const squads = new SquadSystem({ getUnits: allUnits, formation, combat,
    onClaimUnit: typeof claim === 'function' ? claim : null,
    onEvent: (name, payload) => emit('tactics:squad-' + name, payload) });
  let patrol;
  try {
    patrol = new PatrolSystem({ map: scope.map, navigation, combat, getUnits: allUnits,
      onEvent: (name, payload) => emit('tactics:patrol-' + name, payload) });
  } catch (error) {
    squads.destroy();
    throw error;
  }
  const api = Object.freeze({ formation, squads, patrol });
  let started = false;
  let disposed = false;
  return {
    ...api,
    start() {
      if (started || disposed) return;
      scope.provide('tactics', api);
      started = true;
      emit('tactics:ready', { enabled: true });
    },
    update(dt) {
      if (!started || disposed || !Number.isFinite(dt) || dt <= 0) return;
      squads.prune();
      patrol.update(dt);
    },
    render(ctx, camera) {
      if (!started || disposed) return;
      patrol.draw(ctx, camera);
      squads.draw(ctx, camera);
    },
    onPointer() { return false; },
    dispose() {
      if (disposed) return;
      disposed = true;
      started = false;
      try { patrol.destroy(); }
      finally { squads.destroy(); }
    },
  };
}

export default createFeature;
