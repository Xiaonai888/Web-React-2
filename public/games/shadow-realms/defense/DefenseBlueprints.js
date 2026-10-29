/**
 * Shadow Realms — shared defense blueprints (Step 46).
 * Prices, hit points, attack values and existing type IDs are unchanged.
 * The same immutable dimensions and terrain policy are used for placement,
 * collision and render logic. No unlocks or extra gameplay currencies.
 */
const freeze = Object.freeze;
const spec = value => freeze({ ...value, cost: freeze({ ...value.cost }) });

export const DEFENSE_BLUEPRINTS = freeze({
  spikes: spec({
    name: 'Spike Trap', kind: 'trap', width: 52, depth: 42,
    cost: { rice: 8, wood: 14 },
    damage: 16, cooldown: 1.5, charges: 10, hp: 45,
  }),
  barricade: spec({
    name: 'Barricade', kind: 'solid', width: 78, depth: 38,
    cost: { rice: 0, wood: 32 }, hp: 230,
  }),
  watchtower: spec({
    name: 'Watchtower', kind: 'tower', width: 66, depth: 66,
    cost: { rice: 24, wood: 68 }, hp: 175,
    range: 295, damage: 13, cooldown: 1.35,
  }),
});

export const DEFENSE_PLACEMENT = freeze({
  margin: 20,
  footprintSample: 10,
  betweenDefenses: 9,
  fromBuildings: 12,
  fromFields: 9,
  trapTerrain: freeze(['grass', 'road', 'bridge']),
  solidTerrain: freeze(['grass']),
});

export function getDefenseBlueprint(type) {
  return typeof type === 'string' && Object.hasOwn(DEFENSE_BLUEPRINTS, type)
    ? DEFENSE_BLUEPRINTS[type] : null;
}

/** One shared footprint definition for the placer and other local systems. */
export function getDefenseFootprint(type, point) {
  const item = getDefenseBlueprint(type);
  if (!item || !Number.isFinite(point?.x) || !Number.isFinite(point?.y)) return null;
  return { x: point.x, y: point.y, width: item.width, depth: item.depth };
}

export default DEFENSE_BLUEPRINTS;
