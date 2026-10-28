/** Shadow Realms — XP from confirmed combat deaths, idempotent per defeated unit. */
import {MAX_UNIT_LEVEL, xpForNextLevel, experienceForKill} from './ProgressionRules.js';

const alive = unit => unit && unit.alive !== false && Number.isFinite(unit.hp) && unit.hp > 0;
const idOf = unit => unit && (typeof unit === 'object' ? unit.id : unit);

export class ExperienceSystem {
  constructor({getUnits=()=>[],onEvent=null}={}) {
    this.getUnits=typeof getUnits==='function'?getUnits:()=>getUnits;
    this.onEvent=typeof onEvent==='function'?onEvent:null;
    this.records=new Map();
    this.defeated=new Set();
    this.totalEarned=0;
  }
  resolve(idOrUnit) {
    if (idOrUnit && typeof idOrUnit==='object') return idOrUnit;
    return (this.getUnits() || []).find(u=>u?.id===idOrUnit) || null;
  }
  get(unitOrId) {
    const id=idOf(unitOrId);
    if (id == null) return null;
    const s=this.records.get(id) || {id, level:1, xp:0, totalXP:0, kills:0};
    return {...s, toNext:xpForNextLevel(s.level)};
  }
  award(unitOrId,amount,{kill=false}={}) {
    const unit=this.resolve(unitOrId),xp=Math.floor(amount);
    if (!unit || unit.team!=='blue' || !alive(unit) || !Number.isFinite(xp) || xp<=0) return {ok:false,reason:'invalid'};
    const s=this.records.get(unit.id)||{id:unit.id,level:1,xp:0,totalXP:0,kills:0};
    const before=s.level;
    s.totalXP+=xp;s.xp+=xp;if(kill)s.kills++;
    while(s.level<MAX_UNIT_LEVEL && s.xp>=xpForNextLevel(s.level)) {
      s.xp-=xpForNextLevel(s.level);s.level++;
    }
    if(s.level===MAX_UNIT_LEVEL)s.xp=0;
    this.records.set(unit.id,s);this.totalEarned+=xp;
    this.onEvent?.('xp',{unit,id:unit.id,amount:xp,record:this.get(unit.id)});
    if(s.level>before)this.onEvent?.('level_up',{unit,from:before,to:s.level,record:this.get(unit.id)});
    return {ok:true,levelUp:s.level>before,record:this.get(unit.id)};
  }
  /** Attach to HealthSystem 'death'; projectile ownerId strings are supported. */
  onHealthEvent(event,payload={}) {
    if(event!=='death')return false;
    const victim=payload.unit;
    if(victim?.team!=='red'||victim?.id==null||this.defeated.has(victim.id))return false;
    const killer=this.resolve(payload.source);
    if(!alive(killer)||killer.team!=='blue'||killer.id===victim.id)return false;
    const award=this.award(killer,experienceForKill(victim),{kill:true});
    if(award.ok)this.defeated.add(victim.id);
    return award.ok;
  }
  getSummary(){return {tracked:this.records.size,totalEarned:this.totalEarned,confirmedKills:this.defeated.size};}
  reset(){this.records.clear();this.defeated.clear();this.totalEarned=0;}
}
export default ExperienceSystem;
