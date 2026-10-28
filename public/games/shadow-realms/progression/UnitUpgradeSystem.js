/**
 * Shadow Realms — reversible unit upgrades (Step 39).
 *
 * One source of player-unit bonuses: stable training bases + XP level +
 * research ranks. The existing Farmer/Guard/Archer objects remain authoritative.
 * No extra game loop, persistence, network calls, or ownership of other units.
 *
 * Drop-in API: new UnitUpgradeSystem({getUnits,experience,research,onEvent});
 * apply(unit), sync(), restore(unit), getStats(unit), destroy().
 */
const finite = Number.isFinite;
const clamp = (n,low,high) => Math.max(low,Math.min(high,n));
const STATS = Object.freeze(['maxHp','attackDamage','attackRange','armor','speed']);
const DEFAULTS = Object.freeze({maxHp:100,attackDamage:5,attackRange:39,armor:0,speed:115});
const LIMITS = Object.freeze({
  maxHp:[1,100000],attackDamage:[1,1000],attackRange:[24,900],
  armor:[0,9999],speed:[15,500],
});
const near = (a,b) => finite(a)&&finite(b)&&Math.abs(a-b)<1e-7;
const livingBlue = unit => unit && unit.id != null && unit.team==='blue' &&
  unit.alive!==false && finite(unit.hp) && unit.hp>0;
const safe = (value,fallback=0) => finite(value)?value:fallback;

export class UnitUpgradeSystem {
  constructor({getUnits=()=>[],experience,research,onEvent=null}={}) {
    if(typeof experience?.get!=='function'||typeof research?.getBonuses!=='function')
      throw new TypeError('UnitUpgradeSystem needs ExperienceSystem and ResearchSystem');
    this.getUnits=typeof getUnits==='function'?getUnits:()=>getUnits;
    this.experience=experience;
    this.research=research;
    this.onEvent=typeof onEvent==='function'?onEvent:null;
    this.tracked=new Map(); // Keyed by actual unit object, not potentially reused IDs.
    this.cachedVersion=null;
    this.cachedBonuses=null;
    this.destroyed=false;
    this.syncing=false;
  }

  #bonuses() {
    const version=safe(this.research.version,0);
    if(this.cachedBonuses && this.cachedVersion===version)return this.cachedBonuses;
    const bonuses=this.research.getBonuses()||{};
    this.cachedBonuses={
      maxHp:Math.max(0,safe(bonuses.maxHp)),
      attackDamage:Math.max(0,safe(bonuses.attackDamage)),
      armor:Math.max(0,safe(bonuses.armor)),
      rangedRange:Math.max(0,safe(bonuses.rangedRange)),
      speedPercent:clamp(safe(bonuses.speedPercent),-0.8,3),
    };
    this.cachedVersion=version;
    return this.cachedBonuses;
  }

  #register(unit) {
    let row=this.tracked.get(unit);
    if(row)return row;
    const had={},base={};
    for(const key of STATS) {
      had[key]=Object.hasOwn(unit,key);
      base[key]=safe(unit[key],DEFAULTS[key]);
    }
    row={had,base,last:null,signature:null,
      training:unit.combatTraining??null};
    this.tracked.set(unit,row);
    return row;
  }

  #adoptExternal(unit,row) {
    if(!row.last)return;
    const training=unit.combatTraining??null;
    const newlyTrained=training!==row.training;
    row.training=training;
    for(const key of STATS) {
      const changed=finite(unit[key])&&!near(unit[key],row.last[key]);
      // index.html trains Guard/Archer by writing ABSOLUTE attack stats.
      // Even when a training value coincides with a previous buffed value,
      // the explicit training transition marks that value as a new raw base.
      const trainedStat=newlyTrained && training!=null &&
        (key==='attackDamage'||key==='attackRange');
      if(!changed&&!trainedStat)continue;
      if(!finite(unit[key]))continue;
      row.base[key]=unit[key];
      row.had[key]=true;
      row.signature=null;
    }
  }

  #calculate(row,level,attackType,bonuses) {
    const steps=level-1;
    const bonusRange=attackType==='ranged'?bonuses.rangedRange:0;
    const values={
      maxHp:Math.round(row.base.maxHp+steps*10+bonuses.maxHp),
      attackDamage:Math.round(row.base.attackDamage+steps*2+bonuses.attackDamage),
      attackRange:Math.round(row.base.attackRange+bonusRange),
      armor:Math.round(row.base.armor+Math.floor(steps/2)+bonuses.armor),
      speed:row.base.speed*(1+steps*0.018+bonuses.speedPercent),
    };
    for(const key of STATS)values[key]=clamp(safe(values[key],DEFAULTS[key]),...LIMITS[key]);
    return values;
  }

  apply(unit) {
    if(this.destroyed||!livingBlue(unit))return false;
    const row=this.#register(unit);
    this.#adoptExternal(unit,row);
    const level=clamp(Math.floor(safe(this.experience.get(unit)?.level,1)),1,10);
    const version=safe(this.research.version,0);
    const attackType=unit.attackType==='ranged'?'ranged':'melee';
    const signature=`${level}:${version}:${attackType}`;
    if(signature===row.signature)return false;

    const calculated=this.#calculate(row,level,attackType,this.#bonuses());
    const previousMax=safe(unit.maxHp,calculated.maxHp);
    const before=Object.fromEntries(STATS.map(key=>[key,unit[key]]));
    const changed=STATS.some(key=>!near(before[key],calculated[key]));
    for(const key of STATS)unit[key]=calculated[key];
    // Keep existing lost HP when max HP increases. Never resurrect a unit.
    const extra=Math.max(0,calculated.maxHp-previousMax);
    unit.hp=clamp(unit.hp+extra,0,calculated.maxHp);
    row.last=calculated;
    row.signature=signature;
    if(changed) {
      try {this.onEvent?.('stats_changed',{
        unit,level,stats:{...calculated},base:{...row.base},
      });}catch(error){console.warn('Shadow Realms upgrade observer failed:',error);}
    }
    return changed;
  }

  sync() {
    if(this.destroyed||this.syncing)return 0;
    this.syncing=true;
    try {
      const roster=this.getUnits()||[];
      const active=new Set(Array.isArray(roster)?roster.filter(livingBlue):[]);
      let changed=0;
      for(const unit of active)if(this.apply(unit))changed++;
      // Units may be removed without a death event. Do not retain references.
      for(const unit of [...this.tracked.keys()])if(!active.has(unit))this.restore(unit);
      return changed;
    }finally{this.syncing=false;}
  }

  restore(unit) {
    const row=this.tracked.get(unit);
    if(!row)return false;
    const oldMax=safe(unit.maxHp,DEFAULTS.maxHp);
    const hp=safe(unit.hp,0);
    for(const key of STATS) {
      // A later owner may have changed this stat since our last sync.
      if(row.last && !near(unit[key],row.last[key]))continue;
      if(row.had[key])unit[key]=row.base[key];
      else delete unit[key];
    }
    if(unit.alive!==false && hp>0) {
      // On cleanup, cap HP to the restored maximum; do not grant healing.
      const restoredMax=safe(unit.maxHp,oldMax);
      unit.hp=Math.min(hp,restoredMax);
    }
    this.tracked.delete(unit);
    return true;
  }

  getStats(unitOrId) {
    const unit=typeof unitOrId==='object' ? unitOrId :
      [...this.tracked.keys()].find(u=>u.id===unitOrId);
    const row=this.tracked.get(unit);
    if(!row)return null;
    return {id:unit.id,level:this.experience.get(unit)?.level||1,
      base:{...row.base},current:Object.fromEntries(STATS.map(key=>[key,unit[key]]))};
  }

  destroy() {
    if(this.destroyed)return;
    for(const unit of [...this.tracked.keys()])this.restore(unit);
    this.cachedBonuses=null;
    this.destroyed=true;
  }
}
export default UnitUpgradeSystem;
