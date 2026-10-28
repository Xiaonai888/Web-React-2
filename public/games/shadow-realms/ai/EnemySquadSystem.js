/** Enemy squads use existing enemy units and existing CombatSystem attack orders. */
import {ThreatAnalyzer} from './ThreatAnalyzer.js';
const valid = p => Number.isFinite(p?.x) && Number.isFinite(p?.y);
const dist = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
const alive = u => u?.team === 'red' && u.alive !== false && u.hp > 0 && valid(u);
export class EnemySquadSystem {
  constructor({enemyAI,combat,getPlayers = null,threat = null,maxSize = 4,
    decisionSeconds = 0.85,onEvent = null} = {}) {
    if (typeof enemyAI?.getUnits !== 'function' || typeof combat?.orderAttack !== 'function')
      throw new TypeError('EnemySquadSystem needs existing EnemyAI and CombatSystem');
    this.enemyAI=enemyAI;this.combat=combat;
    this.threat=threat || new ThreatAnalyzer({getPlayers:getPlayers||enemyAI.getPlayerUnits});
    this.maxSize=Math.max(1,Math.min(10,Math.floor(maxSize)||4));
    this.decisionSeconds=Math.max(.2,Math.min(3,decisionSeconds));
    this.onEvent=onEvent;this.groups=new Map();this.unitGroup=new Map();
    this.serial=0;this.elapsed=0;this.timer=0;
  }
  getEnemies() {return this.enemyAI.getUnits().filter(alive);}
  register(unit) {
    if (!alive(unit) || unit.id == null || this.unitGroup.has(unit.id)) return false;
    let group=null;
    for (const entry of this.groups.values()) {
      if (entry.ids.size >= this.maxSize) continue;
      const anchor = this.getEnemies().find(e=>entry.ids.has(e.id));
      if (anchor && dist(unit,anchor)<320) {group=entry;break;}
    }
    if (!group) {
      const id=`enemy-squad-${++this.serial}`;
      group={id,ids:new Set(),targetId:null,orders:0};this.groups.set(id,group);
    }
    group.ids.add(unit.id);this.unitGroup.set(unit.id,group.id);
    this.onEvent?.('unit_assigned',{groupId:group.id,unitId:unit.id});
    return true;
  }
  prune() {
    const current=new Set(this.getEnemies().map(e=>e.id));
    for(const [id,groupId] of [...this.unitGroup])if(!current.has(id)){
      this.unitGroup.delete(id);const group=this.groups.get(groupId);group?.ids.delete(id);
      if(group && !group.ids.size)this.groups.delete(groupId);
    }
  }
  update(dt,{focusId=null} = {}) {
    if (!Number.isFinite(dt)||dt<=0)return 0;
    this.elapsed+=Math.min(.1,dt);this.timer+=Math.min(.1,dt);
    for(const u of this.getEnemies())this.register(u);
    this.prune();
    if(this.timer<this.decisionSeconds)return 0;
    this.timer=0;let issued=0;
    const enemies=new Map(this.getEnemies().map(u=>[u.id,u]));
    for(const group of this.groups.values()) {
      const soldiers=[...group.ids].map(id=>enemies.get(id)).filter(alive);
      if(!soldiers.length)continue;
      const center={x:soldiers.reduce((v,u)=>v+u.x,0)/soldiers.length,
        y:soldiers.reduce((v,u)=>v+u.y,0)/soldiers.length};
      const target=this.threat.choose(center,focusId);
      if(!target){group.targetId=null;continue;}
      const toOrder=soldiers.filter(u=>{
        const old=this.combat.getOrder?.(u.id);
        return old?.type!=='attack'||old.targetId!==target.id;
      });
      if(toOrder.length){
        issued+=this.combat.orderAttack(toOrder.map(u=>u.id),target.id);
        this.onEvent?.('target',{groupId:group.id,targetId:target.id,units:toOrder.length});
      }
      group.targetId=target.id;group.orders++;
    }
    return issued;
  }
  getSummary(){return {groups:this.groups.size,units:this.unitGroup.size,orders:[...this.groups.values()].reduce((n,s)=>n+s.orders,0)};}
  reset(){this.groups.clear();this.unitGroup.clear();this.serial=0;this.elapsed=0;this.timer=0;}
  destroy(){this.reset();this.onEvent=null;}
}
export default EnemySquadSystem;
