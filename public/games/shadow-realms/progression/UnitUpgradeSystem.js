/** Shadow Realms — stat modifiers, computed from a stable base (never compounded). */
const finite = Number.isFinite;
const clamp = (x, min, max) => Math.max(min, Math.min(max, x));
const KEYS = ['maxHp','attackDamage','attackRange','armor','speed'];
const baseValue = (unit,key) => {
  if(finite(unit[key]))return unit[key];
  return {maxHp:100,attackDamage:5,attackRange:39,armor:0,speed:115}[key];
};

export class UnitUpgradeSystem {
  constructor({getUnits=()=>[],experience,research,onEvent=null}={}) {
    if(typeof experience?.get!=='function'||typeof research?.getBonuses!=='function')
      throw new TypeError('UnitUpgradeSystem requires ExperienceSystem and ResearchSystem');
    this.getUnits=typeof getUnits==='function'?getUnits:()=>getUnits;
    this.experience=experience;this.research=research;
    this.onEvent=typeof onEvent==='function'?onEvent:null;
    this.tracked=new Map();this.destroyed=false;
  }
  #register(unit){
    if(this.tracked.has(unit))return this.tracked.get(unit);
    const had=Object.fromEntries(KEYS.map(key=>[key,Object.hasOwn(unit,key)]));
    const base=Object.fromEntries(KEYS.map(key=>[key,baseValue(unit,key)]));
    const row={had,base,last:null,signature:null};
    this.tracked.set(unit,row);
    return row;
  }
  #compute(row,unit){
    const level=clamp(this.experience.get(unit)?.level||1,1,10);
    const bonus=this.research.getBonuses();
    const steps=level-1;
    const rangeExtra=unit.attackType==='ranged'?bonus.rangedRange:0;
    return {
      maxHp:Math.max(1,Math.round(row.base.maxHp+steps*10+bonus.maxHp)),
      attackDamage:Math.max(1,Math.round(row.base.attackDamage+steps*2+bonus.attackDamage)),
      attackRange:Math.max(24,Math.round(row.base.attackRange+rangeExtra)),
      armor:Math.max(0,Math.round(row.base.armor+Math.floor(steps/2)+bonus.armor)),
      speed:clamp(row.base.speed*(1+steps*.018+bonus.speedPercent),15,500),
    };
  }
  apply(unit){
    if(this.destroyed||!unit||unit.team!=='blue'||unit.alive===false||!(unit.hp>0))return false;
    const row=this.#register(unit);
    // Training elsewhere may change an already observed unit (e.g. farmer to archer).
    // Adopt those externally supplied values, never overwrite them with old baselines.
    if(row.last)for(const key of KEYS){
      if(!finite(unit[key])||Math.abs(unit[key]-row.last[key])<1e-7)continue;
      row.base[key]=unit[key];
      row.had[key]=true; // The training system now owns this explicit property.
      row.signature=null;
    }
    const signature=`${this.experience.get(unit)?.level||1}:${this.research.version}:${unit.attackType||'melee'}`;
    if(signature===row.signature)return false;
    const calculated=this.#compute(row,unit);
    const maxDelta=calculated.maxHp-(finite(unit.maxHp)?unit.maxHp:calculated.maxHp);
    for(const key of KEYS)unit[key]=calculated[key];
    if(maxDelta>0)unit.hp=Math.min(unit.maxHp,unit.hp+maxDelta);
    else unit.hp=Math.min(unit.maxHp,unit.hp);
    row.last=calculated;row.signature=signature;
    this.onEvent?.('stats_changed',{unit,level:this.experience.get(unit)?.level||1,stats:{...calculated}});
    return true;
  }
  sync(){
    if(this.destroyed)return 0;
    const current=this.getUnits()||[];
    const active=new Set(current.filter(u=>u?.team==='blue'));
    let changed=0;
    for(const unit of active)if(this.apply(unit))changed++;
    for(const unit of [...this.tracked.keys()])if(!active.has(unit))this.restore(unit);
    return changed;
  }
  restore(unit){
    const row=this.tracked.get(unit);
    if(!row)return false;
    // Leave changes made by other game systems alone.
    for(const key of KEYS){
      if(row.last && finite(unit[key]) && Math.abs(unit[key]-row.last[key])>1e-7)continue;
      if(row.had[key])unit[key]=row.base[key];
      else delete unit[key];
    }
    if(unit.alive!==false && unit.hp>0 && finite(unit.maxHp))unit.hp=Math.min(unit.hp,unit.maxHp);
    this.tracked.delete(unit);return true;
  }
  getStats(unit){
    const row=this.tracked.get(unit);
    return row?{id:unit.id,level:this.experience.get(unit)?.level||1,base:{...row.base},
      current:Object.fromEntries(KEYS.map(key=>[key,unit[key]]))}:null;
  }
  destroy(){
    if(this.destroyed)return;
    for(const unit of [...this.tracked.keys()])this.restore(unit);
    this.destroyed=true;
  }
}
export default UnitUpgradeSystem;
