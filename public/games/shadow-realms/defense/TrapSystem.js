/** Shadow Realms — proximity spike traps. No autonomous placement or new AI. */
const near=(u,s)=>Math.abs(u.x-s.x)<=s.width/2+(u.radius||10)&&
  Math.abs(u.y-s.y)<=s.depth/2+(u.radius||10);

export class TrapSystem {
  constructor({defense,health,getUnits=()=>[],onEvent=null}={}){
    if(typeof defense?.getStructures!=='function'||typeof defense?.remove!=='function')
      throw new TypeError('TrapSystem requires DefenseSystem');
    if(typeof health?.damage!=='function')throw new TypeError('TrapSystem requires HealthSystem');
    this.defense=defense;this.health=health;
    this.getUnits=typeof getUnits==='function'?getUnits:()=>getUnits;
    this.onEvent=onEvent;this.timers=new Map();this.destroyed=false;
  }
  update(dt){
    if(this.destroyed||!Number.isFinite(dt)||dt<=0)return;
    const seconds=Math.min(.1,dt);
    const traps=this.defense.getStructures().filter(s=>s.kind==='trap');
    const ids=new Set(traps.map(s=>s.id));
    for(const id of this.timers.keys())if(!ids.has(id))this.timers.delete(id);
    const units=this.getUnits()||[];
    for(const trap of traps){
      const cooldown=Math.max(0,(this.timers.get(trap.id)||0)-seconds);
      this.timers.set(trap.id,cooldown);
      if(cooldown>0)continue;
      const hostile=units.find(u=>u?.team!==trap.team&&u?.team!=null&&u.alive!==false&&u.hp>0&&
        Number.isFinite(u.x)&&Number.isFinite(u.y)&&near(u,trap));
      if(!hostile)continue;
      const hit=this.health.damage(hostile,trap.damage,{source:trap,type:'trap'});
      if(!hit.ok)continue;
      trap.charges--;
      this.timers.set(trap.id,trap.cooldown);
      this.onEvent?.('triggered',{trap,unit:hostile,applied:hit.applied});
      if(trap.charges<=0)this.defense.remove(trap.id,{reason:'depleted'});
    }
  }
  getSummary(){return {armed:this.defense.getStructures().filter(s=>s.kind==='trap').length};}
  destroy(){this.timers.clear();this.destroyed=true;}
}
export default TrapSystem;
