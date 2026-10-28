/** Shadow Realms — shared, bounded level and research rules. Browser-only data. */
export const MAX_UNIT_LEVEL = 10;
export const RESEARCH_MAX_RANK = 3;

const freeze = value => Object.freeze(value);

/** XP needed to advance *from* the given level. */
export function xpForNextLevel(level) {
  const current = Math.max(1, Math.min(MAX_UNIT_LEVEL, Math.floor(Number(level) || 1)));
  return current >= MAX_UNIT_LEVEL ? 0 : 30 + (current - 1) * 20;
}

export function experienceForKill(enemy) {
  if (enemy?.team !== 'red') return 0;
  const rewards = { scout: 12, raider: 20, archer: 24, brute: 42 };
  return rewards[enemy.type] ?? 15;
}

/** All costs are rice + wood from existing RiceSystem / ConstructionSystem. */
export const RESEARCH_RULES = freeze({
  drills: freeze({name:'Combat Drills',maxRank:3,cost:freeze({rice:28,wood:20}),growth:freeze({rice:20,wood:15}),
    effects:freeze({attackDamage:2})}),
  armor: freeze({name:'Reinforced Armor',maxRank:3,cost:freeze({rice:35,wood:28}),growth:freeze({rice:22,wood:20}),
    effects:freeze({armor:1})}),
  vitality: freeze({name:'Field Medicine',maxRank:3,cost:freeze({rice:40,wood:24}),growth:freeze({rice:25,wood:18}),
    effects:freeze({maxHp:12})}),
  mobility: freeze({name:'Marching Boots',maxRank:3,cost:freeze({rice:24,wood:25}),growth:freeze({rice:20,wood:20}),
    effects:freeze({speedPercent:0.05})}),
  archery: freeze({name:'Fletching',maxRank:3,cost:freeze({rice:30,wood:38}),growth:freeze({rice:25,wood:25}),
    effects:freeze({rangedRange:16})}),
});

export function researchCost(id, nextRank) {
  const rule = RESEARCH_RULES[id];
  if (!rule || !Number.isInteger(nextRank) || nextRank < 1 || nextRank > rule.maxRank) return null;
  const extra = nextRank - 1;
  return { rice: rule.cost.rice + rule.growth.rice * extra,
    wood: rule.cost.wood + rule.growth.wood * extra };
}

export function aggregateResearchBonuses(ranks = {}) {
  const result = {attackDamage:0,armor:0,maxHp:0,speedPercent:0,rangedRange:0};
  for (const [id, rule] of Object.entries(RESEARCH_RULES)) {
    const level = Math.max(0, Math.min(rule.maxRank, Math.floor(Number(ranks[id]) || 0)));
    for (const [key, value] of Object.entries(rule.effects)) result[key] += value * level;
  }
  return result;
}
