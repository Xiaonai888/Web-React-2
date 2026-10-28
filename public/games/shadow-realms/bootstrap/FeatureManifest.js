/**
 * Shadow Realms — runtime feature manifest.
 * The old extensionless `FeatureManifest` file in GitHub is not importable by
 * GameBootstrap.js, which imports './FeatureManifest.js'. Keep this named file.
 *
 * Add future optional features here, without editing index.html again.
 * No eager feature imports, no backend requests, no duplicate game systems.
 */
const catalog = [];
const ids = new Set();
const validId = id => typeof id === 'string' && /^[a-zA-Z][\w.:-]*$/.test(id);

export function defineGameFeature(definition) {
  if (!definition || !validId(definition.id) || ids.has(definition.id)) {
    throw new TypeError('Feature ID must be unique and nonempty: ' + String(definition?.id));
  }
  if (typeof definition.create !== 'function' && typeof definition.load !== 'function') {
    throw new TypeError('A feature must implement create() or load()');
  }
  const dependencies = definition.dependsOn ?? [];
  if (!Array.isArray(dependencies) || dependencies.some(d => !validId(d)) ||
      new Set(dependencies).size !== dependencies.length) {
    throw new TypeError('dependsOn must be an array of unique feature IDs');
  }
  ids.add(definition.id);
  catalog.push(Object.freeze({ ...definition, dependsOn: Object.freeze([...dependencies]) }));
  return definition.id;
}

/** Existing bootstrap demo feature, preserved from the extensionless manifest. */
defineGameFeature({
  id: 'runtime-clock',
  create(scope) {
    const clock = { ticks: 0, elapsedSeconds: 0, wholeSeconds: 0 };
    scope.provide('runtimeClock', clock);
    return {
      update(dt) {
        clock.ticks += 1;
        clock.elapsedSeconds += dt;
        const next = Math.floor(clock.elapsedSeconds);
        if (next > clock.wholeSeconds) {
          clock.wholeSeconds = next;
          scope.emit('game:second', { seconds: next });
        }
      },
    };
  },
});



/** New feature modules. Ordered so game overlays draw below fog/minimap. */
defineGameFeature({
  id:'base-defenses', dependsOn:['runtime-clock'],
  load:()=>import('../defense/DefenseFeature.js'),
});
defineGameFeature({
  id:'world-tactics', dependsOn:['runtime-clock'],
  load:()=>import('../tactics/TacticsFeature.js'),
});
defineGameFeature({
  id:'unit-progression', dependsOn:['runtime-clock'],
  load:()=>import('../progression/ProgressionFeature.js'),
});
defineGameFeature({
  id:'enemy-strategy', dependsOn:['unit-progression'],
  load:()=>import('../ai/EnemyStrategyFeature.js'),
});
/** Exploratory overlays and discovery events use the existing WorldMap/Camera. */
defineGameFeature({
  id: 'world-exploration',
  dependsOn: ['runtime-clock'],
  load: () => import('../exploration/ExplorationFeature.js'),
});

defineGameFeature({
  id:'field-controls',
  dependsOn:['base-defenses','world-tactics','unit-progression','enemy-strategy','world-exploration'],
  load:()=>import('./FeatureControls.js'),
});

export function getFeatureManifest() { return [...catalog]; }
export default getFeatureManifest;
