/**
 * Shadow Realms — DefenseFeature (Step 46, complete replacement).
 * Existing GameBootstrap adapter: uses the same DefenseSystem, TrapSystem,
 * TowerSystem, shared construction resources and world Canvas input.
 * Does not own the game loop or require any index.html changes.
 */
import { DefenseSystem } from './DefenseSystem.js';
import { TrapSystem } from './TrapSystem.js';
import { TowerSystem } from './TowerSystem.js';
import { DEFENSE_BLUEPRINTS, getDefenseBlueprint } from './DefenseBlueprints.js';

export function createFeature(scope) {
  if (!scope || !scope.map || typeof scope.get !== 'function')
    throw new TypeError('DefenseFeature requires GameContext scope');
  const construction = scope.get('construction');
  const rice = scope.get('rice');
  const health = scope.get('health');
  const projectiles = scope.get('projectiles');
  const navigation = scope.get('navigation', scope.get('route', null));
  const getUnits = () => {
    const getter = scope.get('getUnits', null);
    if (typeof getter === 'function') {
      const roster = getter();
      return Array.isArray(roster) ? roster : [];
    }
    const farmers = scope.get('farmers', []);
    const enemyAI = scope.get('enemyAI', null);
    return [ ...(Array.isArray(farmers) ? farmers : []), ...(enemyAI?.getUnits?.() || []) ];
  };
  const emit = (name, payload) => {
    try { scope.emit(name, payload); }
    catch (error) { console.warn('Shadow Realms defense scope observer failed:', name, error); }
  };

  const defense = new DefenseSystem({ map: scope.map, construction, rice,
    navigation, getUnits, onEvent: (name, data) => emit('defense:' + name, data) });
  let traps, towers;
  try {
    traps = new TrapSystem({ defense, health, getUnits,
      onEvent: (name, data) => emit('defense:trap-' + name, data) });
    towers = new TowerSystem({ defense, projectiles, getUnits,
      onEvent: (name, data) => emit('defense:tower-' + name, data) });
  } catch (error) {
    defense.destroy();
    throw error;
  }

  let armed = null;
  let disposed = false;
  let started = false;
  const api = Object.freeze({
    types: DEFENSE_BLUEPRINTS,
    getSummary: () => defense.getSummary(),
    getStructures: () => defense.getStructures(),
    getResources: () => defense.getResources(),
    canAfford: type => defense.canAfford(type),
    validate: (type, position) => defense.validatePlacement(type, position),
    place: (type, position, options) => defense.place(type, position, options),
    remove: id => defense.remove(id),
    arm: type => {
      if (disposed || !getDefenseBlueprint(type)) return false;
      armed = type;
      return true;
    },
    cancel: () => { armed = null; },
    get armed() { return armed; },
  });

  return {
    start() {
      if (started || disposed) return;
      started = true;
      scope.provide('defense', api);
      emit('defense:ready', defense.getSummary());
    },
    update(dt) {
      if (disposed || !Number.isFinite(dt) || dt <= 0) return;
      defense.update(dt);
      traps.update(dt);
      towers.update(dt);
    },
    render(ctx, camera) { if (!disposed) defense.draw(ctx, camera); },
    onPointer(event) {
      if (disposed || !armed || !['tap', 'select'].includes(event?.kind)) return false;
      const minimap = scope.get('exploration')?.miniMap;
      if (minimap?.enabled && minimap.hitTest?.(event.screen, scope.camera))
        return false;
      const type = armed;
      const result = defense.place(type, event.world);
      if (result.ok) armed = null;
      emit('defense:placement-result', { type, result });
      return true;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      armed = null;
      try { towers.destroy(); }
      finally {
        try { traps.destroy(); }
        finally { defense.destroy(); }
      }
    },
  };
}
export default createFeature;
