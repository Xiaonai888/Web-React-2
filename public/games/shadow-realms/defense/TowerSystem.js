/** Shadow Realms — simple autonomous guard towers using existing projectiles. */
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export class TowerSystem {
  constructor({defense,projectiles,getUnits=()=>[],onEvent=null,maxShotsPerTick=10}={}){
    if(typeof defense?.getStructures!=='function')throw new TypeError('TowerSystem requires DefenseSystem');
    if(typeof projectiles?.fire!=='function')throw new TypeError('TowerSystem needs existing ProjectileSystem');
    this.defense=defense;this.projectiles=projectiles;
    this.getUnits=typeof getUnits==='function'?getUnits:()=>getUnits;
    this.onEvent=onEvent;
    this.cooldowns=new Map();this.destroyed=false;
    this.maxShotsPerTick=Math.max(1,Math.min(50,Math.floor(maxShotsPerTick)||10));
  }
  update(dt){
    if(this.destroyed||!Number.isFinite(dt)||dt<=0)return;
    const seconds=Math.min(.1,dt),towers=this.defense.getStructures().filter(s=>s.kind==='tower');
    const ids=new Set(towers.map(s=>s.id));
    for(const id of this.cooldowns.keys())if(!ids.has(id))this.cooldowns.delete(id);
    const enemies=(this.getUnits()||[]).filter(u=>u?.alive!==false&&u?.hp>0&&
      Number.isFinite(u?.x)&&Number.isFinite(u?.y));
    let shots=0;
    for(const tower of towers){
      const cooldown=Math.max(0,(this.cooldowns.get(tower.id)||0)-seconds);
      this.cooldowns.set(tower.id,cooldown);
      if(cooldown>0||shots>=this.maxShotsPerTick)continue;
      let nearest=null,best=tower.range;
      for(const enemy of enemies){
        if(enemy.team===tower.team||enemy.team==null)continue;
        const d=distance(tower,enemy);
        if(d<best){best=d;nearest=enemy;}
      }
      if(!nearest)continue;
      const shooter={id:tower.id,x:tower.x,y:tower.y,alive:true,team:tower.team,
        radius:Math.max(tower.width,tower.depth)/3,attackDamage:tower.damage,attackRange:tower.range};
      const shot=this.projectiles.fire(shooter,nearest,{damage:tower.damage,range:tower.range+55,
        speed:485,color:'#f7d37e'});
      if(!shot)continue;
      this.cooldowns.set(tower.id,tower.cooldown);shots++;
      this.onEvent?.('fired',{tower,target:nearest,shot});
    }
  }
  getSummary(){return {towers:this.defense.getStructures().filter(s=>s.kind==='tower').length};}
  destroy(){this.cooldowns.clear();this.destroyed=true;}
}
export default TowerSystem;
