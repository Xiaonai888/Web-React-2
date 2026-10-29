/**
 * Shadow Realms — Step 43: lightweight cooperative enemy squads.
 * Existing EnemyAI owns spawns; existing CombatSystem owns orders and movement.
 * One roster per update, stable squad membership, target hysteresis and bounded
 * command cadence. API kept: getEnemies/register/prune/update/getSummary/reset/destroy.
 */
import {ThreatAnalyzer} from './ThreatAnalyzer.js';
const finite = Number.isFinite;
const pos = p => finite(p?.x) && finite(p?.y);
const dist = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
const alive = u => u?.id != null && u.team === 'red' && u.alive !== false &&
  finite(u.hp) && u.hp > 0 && pos(u);
const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
const safe = (n,fallback) => finite(n) ? n : fallback;

export class EnemySquadSystem {
  constructor({enemyAI,combat,getPlayers = null,threat = null,maxSize = 4,
    decisionSeconds = .85,onEvent = null} = {}) {
    if (typeof enemyAI?.getUnits !== 'function' || typeof combat?.orderAttack !== 'function')
      throw new TypeError('EnemySquadSystem needs existing EnemyAI and CombatSystem');
    this.enemyAI = enemyAI;
    this.combat = combat;
    this.threat = threat || new ThreatAnalyzer({
      getPlayers:getPlayers || enemyAI.getPlayerUnits || (() => []),
    });
    this.maxSize = clamp(Math.floor(safe(maxSize,4)),1,10);
    this.decisionSeconds = clamp(safe(decisionSeconds,.85),.2,3);
    this.onEvent = typeof onEvent === 'function' ? onEvent : null;
    this.groups = new Map();
    this.unitGroup = new Map();
    this.serial = 0;
    this.elapsed = 0;
    this.timer = 0;
    this.issuedTotal = 0;
    this.destroyed = false;
  }

  #emit(name,data) {try{this.onEvent?.(name,data);}catch{/* no gameplay impact */}}

  getEnemies() {
    const units = this.enemyAI.getUnits() || [];
    const seen = new Set();
    return (Array.isArray(units) ? units : []).filter(unit => {
      if (!alive(unit) || seen.has(unit.id)) return false;
      seen.add(unit.id);
      return true;
    });
  }

  #register(unit,lookup) {
    if (this.destroyed || !alive(unit) || this.unitGroup.has(unit.id)) return false;
    let candidate = null, gap = 320;
    for (const group of this.groups.values()) {
      if (group.ids.size >= this.maxSize) continue;
      // Any member can anchor an existing group, not just the first survivor.
      for (const id of group.ids) {
        const member = lookup.get(id);
        if (!member) continue;
        const d = dist(unit,member);
        if (d < gap) {gap = d;candidate = group;}
      }
    }
    if (!candidate) {
      const id = `enemy-squad-${++this.serial}`;
      candidate = {id,ids:new Set(),targetId:null,orders:0};
      this.groups.set(id,candidate);
    }
    candidate.ids.add(unit.id);
    this.unitGroup.set(unit.id,candidate.id);
    this.#emit('unit_assigned',{groupId:candidate.id,unitId:unit.id});
    return true;
  }

  register(unit) {
    // Public spawn-event entrypoint; update() uses one cached roster instead.
    if (!alive(unit) || this.unitGroup.has(unit.id)) return false;
    const roster = this.getEnemies();
    const lookup = new Map(roster.map(u => [u.id,u]));
    lookup.set(unit.id,unit);
    return this.#register(unit,lookup);
  }

  #pruneWith(lookup) {
    for (const [id,groupId] of this.unitGroup) {
      if (lookup.has(id)) continue;
      this.unitGroup.delete(id);
      const group = this.groups.get(groupId);
      group?.ids.delete(id);
      if (group && !group.ids.size) this.groups.delete(groupId);
    }
  }

  prune() {this.#pruneWith(new Map(this.getEnemies().map(u => [u.id,u])));}

  update(dt,{focusId = null} = {}) {
    if (this.destroyed || !finite(dt) || dt <= 0) return 0;
    const step = Math.min(dt,.1);
    this.elapsed += step;
    const roster = this.getEnemies();
    const lookup = new Map(roster.map(unit => [unit.id,unit]));
    this.#pruneWith(lookup);
    for (const unit of roster) this.#register(unit,lookup);
    this.timer += step;
    if (this.timer < this.decisionSeconds) return 0;
    this.timer = 0;
    let issued = 0;
    for (const group of this.groups.values()) {
      const soldiers = [...group.ids].map(id => lookup.get(id)).filter(alive);
      if (!soldiers.length) continue;
      const center = {x:0,y:0};
      for (const unit of soldiers) {center.x += unit.x;center.y += unit.y;}
      center.x /= soldiers.length;center.y /= soldiers.length;
      let target = this.threat.choose(center,focusId);
      if (!target) {group.targetId = null;continue;}
      const existing = this.threat.players().find(u => u.id === group.targetId);
      // Don't oscillate between nearly equivalent targets every decision tick.
      // Active bridge ambush focus retains its deliberate high priority.
      if (existing && existing.id !== target.id && focusId == null) {
        const oldScore = this.threat.score(center,existing);
        const newScore = this.threat.score(center,target);
        if (finite(oldScore) && oldScore >= newScore - 28) target = existing;
      }
      const toOrder = soldiers.filter(unit => {
        const order = this.combat.getOrder?.(unit.id);
        return order?.type !== 'attack' || order.targetId !== target.id;
      });
      if (toOrder.length) {
        let count = 0;
        try {count = this.combat.orderAttack(toOrder.map(u => u.id),target.id) || 0;}
        catch {/* Combat continues; retry at the next decision interval. */}
        if (count > 0) {
          issued += count;
          group.orders += count;
          this.#emit('target',{groupId:group.id,targetId:target.id,units:count});
        }
      }
      group.targetId = target.id;
    }
    this.issuedTotal += issued;
    return issued;
  }

  getSummary() {
    return {groups:this.groups.size,units:this.unitGroup.size,
      orders:[...this.groups.values()].reduce((sum,s) => sum + s.orders,0)};
  }
  reset() {
    this.groups.clear();this.unitGroup.clear();this.serial = 0;
    this.elapsed = 0;this.timer = 0;this.issuedTotal = 0;
  }
  destroy() {this.reset();this.destroyed = true;this.onEvent = null;}
}
export default EnemySquadSystem;
