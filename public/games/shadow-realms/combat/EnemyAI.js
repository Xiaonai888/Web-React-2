/**
 * Shadow Realms — EnemyAI (Step 34, single-file final update).
 *
 * Keeps the original Farmer, CombatSystem, EnemyStrategyFeature and WaveSystem
 * contracts. Does not spawn extra enemies beyond explicit spawn() calls.
 * - Red enemy cleanup runs even while EnemyStrategy owns decisions (Infinity).
 * - Spawn spacing respects each enemy's actual body radius and avoids scenery.
 * - Type-aware fallback target choice, with stable target switching.
 * - Distinct, deterministic idle patrol points and bounded blocked-path recovery.
 * - No backend, new events/listeners, global timer, teleporting or extra engine.
 */
import { Farmer } from '../characters/Farmer.js';

const TAU = Math.PI * 2;
const finite = Number.isFinite;
const point = p => finite(p?.x) && finite(p?.y);
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const number = (value, fallback) => finite(value) ? value : fallback;
const living = unit => unit?.alive !== false && (unit?.hp > 0) && point(unit);
const targetable = unit => living(unit) && !unit.trainingInside;
const PROFILES = Object.freeze({
  scout: Object.freeze({ name: 'Scout', hp: 50, speed: 132, damage: 5, range: 38, cooldown: 1.05, aggro: 310, color: '#91614f' }),
  raider: Object.freeze({ name: 'Raider', hp: 85, speed: 98, damage: 11, range: 42, cooldown: 1.35, aggro: 430, color: '#8e3a43' }),
  archer: Object.freeze({ name: 'Archer', hp: 62, speed: 89, damage: 9, range: 240, cooldown: 1.9, aggro: 500, color: '#8a623a' }),
  brute: Object.freeze({ name: 'Brute', hp: 180, speed: 65, damage: 19, range: 48, cooldown: 2.1, aggro: 350, color: '#623b64' }),
});

/** Existing 2.5D chibi artwork, preserved from the original module. */
function renderRaider(ctx, unit) {
  const bob = unit.state === 'walking' ? Math.abs(Math.sin(unit.motionTime)) * 2 : Math.sin(unit.lifetime * 2) * .4;
  const armor = unit.enemyColor || '#923945';
  const face = unit.facing === 'up';
  const swing = unit.state === 'walking' ? Math.sin(unit.motionTime) * 5 : 0;
  ctx.save(); ctx.translate(0, -bob);
  const oval = (x, y, rx, ry, fill) => {
    ctx.fillStyle = fill; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fill();
  };
  ctx.strokeStyle = '#362f30'; ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-6, -16); ctx.lineTo(-6 + swing, -2);
  ctx.moveTo(6, -16); ctx.lineTo(6 - swing, -2); ctx.stroke();
  oval(-7 + swing, -1, 5, 3, '#2e2d32');
  oval(7 - swing, -1, 5, 3, '#242730');
  ctx.fillStyle = armor; ctx.fillRect(-11, -36, 22, 24);
  ctx.fillStyle = '#d3b68c'; ctx.fillRect(-10, -17, 20, 5);
  ctx.strokeStyle = '#b8b5aa'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(-11, -31); ctx.lineTo(-17 + swing * .25, -20); ctx.stroke();
  ctx.strokeStyle = '#e2d4bb'; ctx.beginPath(); ctx.moveTo(11, -32); ctx.lineTo(18, -23); ctx.stroke();
  ctx.strokeStyle = '#acb9c3'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(18, -23); ctx.lineTo(21, -47); ctx.stroke();
  ctx.strokeStyle = '#c5a25f'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(14, -29); ctx.lineTo(25, -27); ctx.stroke();
  oval(0, -47, 15, 16, '#e0a874');
  if (!face) {
    oval(-5, -47, 1.7, 2.2, '#342d34'); oval(5, -47, 1.7, 2.2, '#342d34');
    ctx.strokeStyle = '#7d463c'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-4, -39); ctx.lineTo(4, -39); ctx.stroke();
  }
  oval(0, -60, 16, 8, '#504751'); oval(0, -65, 11, 9, '#56525a');
  ctx.strokeStyle = '#c5bfc0'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-12, -59); ctx.lineTo(12, -59); ctx.stroke();
  ctx.restore();
}

export class EnemyAI {
  constructor({ map, navigation = null, combat = null, getPlayerUnits = () => [],
    maxEnemies = 45, patrol = true, onEvent = null } = {}) {
    if (typeof map?.isWalkable !== 'function' || typeof map?.getSpawnPoint !== 'function') {
      throw new TypeError('EnemyAI needs existing WorldMap with isWalkable/getSpawnPoint');
    }
    this.map = map;
    this.navigation = navigation;
    this.combat = combat;
    this.getPlayerUnits = typeof getPlayerUnits === 'function' ? getPlayerUnits : () => getPlayerUnits;
    this.maxEnemies = clamp(Math.floor(number(maxEnemies, 45)), 1, 300);
    this.patrol = Boolean(patrol);
    this.onEvent = typeof onEvent === 'function' ? onEvent : null;
    this.enemies = [];
    this.count = 0;
    this.time = 0;
    this.decisionTimer = 0;
    this.removed = 0;
    this.blockedRecoveries = 0;
  }

  getUnits() { return this.enemies.filter(living); }
  getAllUnits() { return this.enemies; }

  /** Single pass, including when EnemyStrategy freezes decisionTimer at Infinity. */
  #prune() {
    let write = 0;
    for (let read = 0; read < this.enemies.length; read++) {
      const enemy = this.enemies[read];
      if (living(enemy)) {
        this.enemies[write++] = enemy;
      } else {
        this.removed++;
      }
    }
    this.enemies.length = write;
  }

  /** Staggered rings around a spawn point; never puts large brutes in thin gaps. */
  #spawnPosition(origin, radius) {
    if (!point(origin)) return null;
    const others = this.getUnits();
    const spacing = Math.max(38, radius * 2 + 9);
    const shift = (this.count * 2.399963229728653) % TAU;
    for (let ring = 0; ring <= 10; ring++) {
      const slots = ring === 0 ? 1 : Math.max(12, Math.ceil(TAU * ring * spacing / (radius * 2 + 9)));
      for (let i = 0; i < slots; i++) {
        const angle = shift + i * TAU / slots;
        const pos = ring === 0 ? origin : {
          x: origin.x + Math.cos(angle) * spacing * ring,
          y: origin.y + Math.sin(angle) * spacing * ring,
        };
        if (!this.map.isWalkable(pos.x, pos.y, radius)) continue;
        if (others.some(other => distance(pos, other) < radius + number(other.radius, 14) + 6)) continue;
        return pos;
      }
    }
    return null;
  }

  /** Only WaveSystem (or an explicit caller) creates enemies. */
  spawn({ type = 'raider', x = null, y = null, team = 'red', level = 1 } = {}) {
    if (this.getUnits().length >= this.maxEnemies) return null;
    const kind = Object.hasOwn(PROFILES, type) ? type : 'raider';
    const spec = PROFILES[kind];
    const radius = kind === 'brute' ? 19 : 14;
    const origin = finite(x) && finite(y) ? { x, y } : this.map.getSpawnPoint(team);
    const position = this.#spawnPosition(origin, radius);
    if (!position) return null;
    const lvl = clamp(Math.floor(number(level, 1)), 1, 30);
    const enemy = new Farmer({ id: `enemy-${++this.count}`, name: spec.name,
      team, ...position, hp: 100, speed: spec.speed, radius, renderer: renderRaider });
    // Farmer constructor caps its initial HP at 100. Restore the enemy profile.
    enemy.maxHp = Math.round(spec.hp * (1 + (lvl - 1) * 0.15));
    enemy.hp = enemy.maxHp;
    enemy.alive = true;
    enemy.selectable = false;
    enemy.type = kind;
    enemy.isEnemy = true;
    enemy.isCivilian = false;
    enemy.enemyColor = spec.color;
    enemy.attackDamage = Math.round(spec.damage * (1 + (lvl - 1) * .12));
    enemy.attackRange = spec.range;
    enemy.attackCooldown = spec.cooldown;
    enemy.attackType = kind === 'archer' ? 'ranged' : 'melee';
    enemy.aggroRange = spec.aggro;
    enemy.armor = kind === 'brute' ? 3 : 0;
    enemy._patrolAt = 0;
    enemy._aiRecoverAt = 0;
    enemy._aiBlockedCount = 0;
    enemy._aiTargetId = null;
    enemy._aiTargetPoint = null;
    // Preserve Farmer.update's built-in blocked callback contract.
    enemy.onBlocked = () => { enemy._aiBlockedCount++; };
    this.enemies.push(enemy);
    this.onEvent?.('spawn', { unit: enemy, type: kind, level: lvl });
    return enemy;
  }

  #players() {
    const list = this.getPlayerUnits() || [];
    return Array.isArray(list) ? list.filter(u => targetable(u) && u.team === 'blue') : [];
  }

  /** Fallback AI only. EnemyStrategy's own ThreatAnalyzer owns decisions otherwise. */
  #nearestPlayer(enemy, players) {
    const old = this.combat?.getOrder?.(enemy.id);
    const previous = players.find(unit => unit.id === old?.targetId);
    let best = previous || null;
    let score = previous ? this.#score(enemy, previous) + 36 : -Infinity;
    for (const candidate of players) {
      const value = this.#score(enemy, candidate);
      if (value > score) { best = candidate; score = value; }
    }
    return best;
  }

  #score(enemy, target) {
    const d = distance(enemy, target);
    const hpFraction = target.hp / Math.max(1, number(target.maxHp, 100));
    const lowHealth = 1 - clamp(hpFraction, 0, 1);
    if (enemy.type === 'scout') return -d + lowHealth * 95;
    if (enemy.type === 'archer') return -d + (target.attackType === 'ranged' ? 40 : 0);
    if (enemy.type === 'brute') return -d + (target.attackType === 'ranged' ? 25 : 0);
    return -d;
  }

  #idlePatrol(enemy) {
    if (!this.patrol || typeof this.navigation?.moveUnit !== 'function' ||
        enemy.state === 'walking' || this.time < enemy._patrolAt) return;
    const home = this.map.getSpawnPoint(enemy.team);
    if (!point(home)) return;
    const serial = Number.parseInt(String(enemy.id).replace(/\D/g, ''), 10) || 1;
    const turn = Math.floor(this.time / 5);
    const baseAngle = ((serial * 2.39996323) + turn * 0.9) % TAU;
    const radii = [135, 205, 95];
    let moved = false;
    for (let ring = 0; ring < radii.length && !moved; ring++) {
      for (let i = 0; i < 8; i++) {
        const angle = baseAngle + (i * TAU / 8);
        const target = { x: home.x + Math.cos(angle) * radii[ring],
          y: home.y + Math.sin(angle) * radii[ring] };
        if (this.map.isWalkable(target.x, target.y, enemy.radius)) {
          moved = this.navigation.moveUnit(enemy, target) === true;
          if (moved) break;
        }
      }
    }
    enemy._patrolAt = this.time + (moved ? 5 : 2) + serial % 4;
  }

  /** Avoid teleports or fighting CombatSystem over paths; recover only idle/blocked. */
  #recover(enemy) {
    if (enemy.state !== 'blocked' || this.time < enemy._aiRecoverAt ||
        typeof this.navigation?.moveUnit !== 'function' || this.combat?.getOrder?.(enemy.id)) return;
    enemy._aiRecoverAt = this.time + 1.6;
    const serial = Number.parseInt(String(enemy.id).replace(/\D/g, ''), 10) || 1;
    for (let i = 0; i < 12; i++) {
      const angle = (serial * 1.7 + enemy._aiBlockedCount + i * TAU / 12) % TAU;
      const target = { x: enemy.x + Math.cos(angle) * 65,
        y: enemy.y + Math.sin(angle) * 65 };
      if (!this.map.isWalkable(target.x, target.y, enemy.radius)) continue;
      if (this.navigation.moveUnit(enemy, target)) { this.blockedRecoveries++; break; }
    }
  }

  update(dt) {
    if (!finite(dt) || dt <= 0) return;
    const seconds = Math.min(dt, .05);
    this.time += seconds;
    // Always update movement and prune corpses, even when decisions are frozen
    // by EnemyStrategyFeature (decisionTimer === Infinity).
    this.#prune();
    for (const enemy of this.enemies) enemy.update(seconds, this.map);
    this.#prune();
    for (const enemy of this.enemies) this.#recover(enemy);

    // Infinity is intentionally supplied by EnemyStrategyFeature. Never reset
    // it here, and never issue competing attack orders while it is active.
    if (this.decisionTimer === Infinity) return;
    this.decisionTimer -= seconds;
    if (this.decisionTimer > 0) return;
    this.decisionTimer = 0.7;
    const players = this.#players();
    for (const enemy of this.enemies) {
      const target = this.#nearestPlayer(enemy, players);
      const order = this.combat?.getOrder?.(enemy.id);
      if (target) {
        if (typeof this.combat?.orderAttack === 'function') {
          if (order?.type !== 'attack' || order.targetId !== target.id) {
            this.combat.orderAttack([enemy.id], target.id);
          }
        } else if (typeof this.navigation?.moveUnit === 'function') {
          // Headless/fallback mode without CombatSystem: route toward players.
          if (enemy.state !== 'walking' || !point(enemy._aiTargetPoint) ||
              distance(target, enemy._aiTargetPoint) > 75) {
            if (this.navigation.moveUnit(enemy, target)) {
              enemy._aiTargetId = target.id;
              enemy._aiTargetPoint = { x: target.x, y: target.y };
            }
          }
        }
        continue;
      }
      if (order?.type === 'attack') this.combat?.orderStop?.([enemy.id]);
      this.#idlePatrol(enemy);
    }
  }

  draw(ctx, camera) {
    for (const enemy of [...this.getUnits()].sort((a, b) => a.y - b.y)) enemy.draw(ctx, camera);
  }

  getSummary() {
    const units = this.getUnits();
    const byType = { scout: 0, raider: 0, archer: 0, brute: 0 };
    for (const unit of units) if (Object.hasOwn(byType, unit.type)) byType[unit.type]++;
    return { alive: units.length, spawned: this.count, maxEnemies: this.maxEnemies,
      byType, removed: this.removed, blockedRecoveries: this.blockedRecoveries };
  }

  reset() {
    for (const enemy of this.enemies) this.combat?.orderStop?.([enemy.id]);
    this.enemies = [];
    this.decisionTimer = 0;
    this.time = 0;
    this.removed = 0;
    this.blockedRecoveries = 0;
    // Preserve 'count' to avoid reusing enemy IDs after a campaign reset.
  }
}

export default EnemyAI;
