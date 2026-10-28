/** Shadow Realms — local defenses. Numeric fields are immutable gameplay rules. */
export const DEFENSE_BLUEPRINTS = Object.freeze({
  spikes: Object.freeze({
    name: 'Spike Trap', kind: 'trap', width: 52, depth: 42,
    cost: Object.freeze({ rice: 8, wood: 14 }),
    damage: 16, cooldown: 1.5, charges: 10, hp: 45,
  }),
  barricade: Object.freeze({
    name: 'Barricade', kind: 'solid', width: 78, depth: 38,
    cost: Object.freeze({ rice: 0, wood: 32 }), hp: 230,
  }),
  watchtower: Object.freeze({
    name: 'Watchtower', kind: 'tower', width: 66, depth: 66,
    cost: Object.freeze({ rice: 24, wood: 68 }), hp: 175,
    range: 295, damage: 13, cooldown: 1.35,
  }),
});

export function getDefenseBlueprint(type) {
  return Object.prototype.hasOwnProperty.call(DEFENSE_BLUEPRINTS, type)
    ? DEFENSE_BLUEPRINTS[type] : null;
}

export default DEFENSE_BLUEPRINTS;
