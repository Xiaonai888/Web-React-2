/**
 * Shadow Realms — EnemyAI
 * Procedural enemy raiders, simple local patrol/aggression, and chibi rendering.
 * Reuses EXISTING Farmer movement/path/collision code, no copy of game engine.
 * Integration:
 *   const enemyAI = new EnemyAI({map, navigation, combat, getPlayerUnits: () => farmers})
 *   enemyAI.spawn({type:'raider'}); enemyAI.update(dt)
 *   enemyAI.getUnits() // include in CombatSystem and HealthSystem getUnits()
 *   enemyAI.draw(ctx,camera)
 *
 * The incoming enemy is a separate Farmer entity rendered as a sword raider,
 * never selectable as a player farmer. No NPC or backend request.
 */
import {Farmer} from '../characters/Farmer.js'

const finite = Number.isFinite
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const TWO_PI = 2 * Math.PI

const TYPES = Object.freeze({
  scout: {name:'Scout',hp:50,speed:132,damage:5,range:38,cooldown:1.05,aggro:310,color:'#91614f'},
  raider: {name:'Raider',hp:85,speed:98,damage:11,range:42,cooldown:1.35,aggro:430,color:'#8e3a43'},
  archer: {name:'Archer',hp:62,speed:89,damage:9,range:240,cooldown:1.9,aggro:500,color:'#8a623a'},
  brute: {name:'Brute',hp:180,speed:65,damage:19,range:48,cooldown:2.1,aggro:350,color:'#623b64'},
})

function renderRaider(ctx, unit) {
  // ctx has already been translated and scaled by Farmer.draw().
  const bob = unit.state === 'walking' ? Math.abs(Math.sin(unit.motionTime)) * 2 : Math.sin(unit.lifetime * 2) * .4
  const armor = unit.enemyColor || '#923945'
  const face = unit.facing === 'up'
  const swing = unit.state === 'walking' ? Math.sin(unit.motionTime) * 5 : 0
  ctx.save();ctx.translate(0, -bob)
  const oval = (x, y, rx, ry, fill) => {
    ctx.fillStyle = fill;ctx.beginPath();ctx.ellipse(x, y, rx, ry, 0, 0, TWO_PI);ctx.fill()
  }
  ctx.strokeStyle = '#362f30';ctx.lineWidth = 6;ctx.lineCap = 'round'
  ctx.beginPath();ctx.moveTo(-6,-16);ctx.lineTo(-6 + swing,-2);ctx.moveTo(6,-16);ctx.lineTo(6 - swing,-2);ctx.stroke()
  oval(-7 + swing,-1,5,3,'#2e2d32');oval(7-swing,-1,5,3,'#242730')
  ctx.fillStyle = armor;ctx.fillRect(-11,-36,22,24)
  ctx.fillStyle = '#d3b68c';ctx.fillRect(-10,-17,20,5)
  ctx.strokeStyle = '#b8b5aa';ctx.lineWidth = 5
  ctx.beginPath();ctx.moveTo(-11,-31);ctx.lineTo(-17 + swing*.25,-20);ctx.stroke()
  ctx.strokeStyle = '#e2d4bb';ctx.beginPath();ctx.moveTo(11,-32);ctx.lineTo(18,-23);ctx.stroke()
  ctx.strokeStyle = '#acb9c3';ctx.lineWidth = 3
  ctx.beginPath();ctx.moveTo(18,-23);ctx.lineTo(21,-47);ctx.stroke()
  ctx.strokeStyle = '#c5a25f';ctx.lineWidth = 3;ctx.beginPath();ctx.moveTo(14,-29);ctx.lineTo(25,-27);ctx.stroke()
  oval(0,-47,15,16,'#e0a874')
  if (!face) {
    oval(-5,-47,1.7,2.2,'#342d34');oval(5,-47,1.7,2.2,'#342d34')
    ctx.strokeStyle = '#7d463c';ctx.lineWidth = 2;ctx.beginPath();ctx.moveTo(-4,-39);ctx.lineTo(4,-39);ctx.stroke()
  }
  oval(0,-60,16,8,'#504751');oval(0,-65,11,9,'#56525a')
  ctx.strokeStyle = '#c5bfc0';ctx.lineWidth = 2;ctx.beginPath();ctx.moveTo(-12,-59);ctx.lineTo(12,-59);ctx.stroke()
  ctx.restore()
}

export class EnemyAI {
  constructor({map, navigation = null, combat = null, getPlayerUnits = () => [],
    maxEnemies = 45, patrol = true, onEvent = null} = {}) {
    if (typeof map?.isWalkable !== 'function') throw new TypeError('EnemyAI requires WorldMap')
    this.map = map
    this.navigation = navigation
    this.combat = combat
    this.getPlayerUnits = typeof getPlayerUnits === 'function' ? getPlayerUnits : () => getPlayerUnits
    this.maxEnemies = clamp(Math.floor(maxEnemies), 1, 300)
    this.patrol = patrol
    this.onEvent = onEvent
    this.enemies = []
    this.count = 0
    this.time = 0
    this.decisionTimer = 0
  }

  getUnits() {return this.enemies.filter(u => u.alive !== false && u.hp > 0)}
  getAllUnits() {return this.enemies}

  #spawnPosition(origin, radius = 14) {
    for (let ring = 0; ring <= 9; ring++) {
      const count = ring === 0 ? 1 : 10 * ring
      for (let i = 0; i < count; i++) {
        const angle = TWO_PI * i / count
        const x = origin.x + Math.cos(angle) * 34 * ring
        const y = origin.y + Math.sin(angle) * 34 * ring
        if (!this.map.isWalkable(x, y, radius)) continue
        if (this.getUnits().some(e => distance(e,{x,y}) < 32)) continue
        return {x,y}
      }
    }
    return null
  }

  spawn({type = 'raider', x = null, y = null, team = 'red', level = 1} = {}) {
    if (this.getUnits().length >= this.maxEnemies) return null
    const def = TYPES[type] || TYPES.raider
    const origin = finite(x) && finite(y) ? {x,y} : this.map.getSpawnPoint(team)
    const position = this.#spawnPosition(origin)
    if (!position) return null
    const lvl = clamp(Math.floor(level), 1, 30)
    const enemy = new Farmer({id:`enemy-${++this.count}`,name:def.name,team,...position,
      hp:100,speed:def.speed,radius:type === 'brute'?19:14,renderer:renderRaider})
    // Farmer normalizes constructor HP to 0..100, so override before combat.
    enemy.maxHp = Math.round(def.hp * (1 + (lvl-1) * .15))
    enemy.hp = enemy.maxHp
    enemy.alive = true
    enemy.selectable = false
    enemy.type = type
    enemy.isEnemy = true
    enemy.enemyColor = def.color
    enemy.attackDamage = Math.round(def.damage * (1 + (lvl - 1) * .12))
    enemy.attackRange = def.range
    enemy.attackCooldown = def.cooldown
    enemy.attackType = type === 'archer' ? 'ranged' : 'melee'
    enemy.aggroRange = def.aggro
    enemy.armor = type === 'brute' ? 3 : 0
    enemy._patrolAt = 0
    this.enemies.push(enemy)
    this.onEvent?.('spawn', {unit:enemy, type, level:lvl})
    return enemy
  }

  #nearestPlayer(enemy) {
    // Waves must advance toward the player's base even across the river.
    // Aggro range controls combat style, not whether a raider marches at all.
    let best = null, bestDistance = Infinity
    for (const player of this.getPlayerUnits() || []) {
      if (player?.alive === false || !(player?.hp > 0) || player.team === enemy.team) continue
      const d = distance(enemy,player)
      if (d < bestDistance) {bestDistance=d; best=player}
    }
    return best
  }

  update(dt) {
    if (!finite(dt) || dt <= 0) return
    const seconds = Math.min(dt, .05)
    this.time += seconds
    for (const enemy of this.getUnits()) enemy.update(seconds, this.map)
    this.decisionTimer -= seconds
    if (this.decisionTimer > 0) return
    this.decisionTimer = .7
    for (const enemy of this.getUnits()) {
      const player = this.#nearestPlayer(enemy)
      const order = this.combat?.getOrder(enemy.id)
      if (player) {
        if (order?.type !== 'attack' || order.targetId !== player.id) {
          this.combat?.orderAttack([enemy.id], player.id)
        }
        continue
      }
      if (order?.type === 'attack') this.combat?.orderStop([enemy.id])
      if (!this.patrol || enemy.state === 'walking' || this.time < enemy._patrolAt) continue
      const home = this.map.getSpawnPoint(enemy.team)
      const angle = (enemy.id.length * 2.77 + this.time*.17) % TWO_PI
      const dest = {x: home.x + Math.cos(angle) * 140, y:home.y + Math.sin(angle) * 140}
      if (this.map.isWalkable(dest.x,dest.y,enemy.radius)) this.navigation?.moveUnit(enemy,dest)
      enemy._patrolAt = this.time + 5 + (enemy.id.length % 4)
    }
    // Dead enemies are removed from the active pool; external references can
    // still inspect their dead state for WaveSystem completion checks.
    this.enemies = this.enemies.filter(u => u.alive !== false && u.hp > 0)
  }

  draw(ctx,camera) {
    for (const enemy of [...this.getUnits()].sort((a,b)=>a.y-b.y)) enemy.draw(ctx,camera)
  }

  getSummary() {return {alive:this.getUnits().length, spawned:this.count, max:this.maxEnemies}}
  reset() {
    for (const enemy of this.enemies) this.combat?.orderStop([enemy.id])
    this.enemies = []
    this.decisionTimer = 0
    this.time = 0
  }
}

export default EnemyAI
