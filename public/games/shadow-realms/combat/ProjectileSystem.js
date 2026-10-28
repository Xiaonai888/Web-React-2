/**
 * Shadow Realms — ProjectileSystem (Step 36, complete single-file update).
 * Reuses HealthSystem and existing world units: never owns or spawns units.
 * Preserves constructor, spawn(), fire(), update(), draw(), getSummary(), reset().
 *
 * Changes: bounded/validated projectiles, swept first-hit collision,
 * team-safe splash, optional terrain blocking and homing, event-safe spawn
 * queue, bounded effects, safe observers and stable shooter attribution.
 * No game loop, external requests, DOM dependencies or extra modules.
 */
const finite = Number.isFinite;
const point = p => finite(p?.x) && finite(p?.y);
const dist = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
const clamp = (n,lo,hi) => Math.max(lo,Math.min(hi,n));
const bounded = (n,defaultValue,lo,hi) => clamp(finite(n) ? n : defaultValue,lo,hi);

function sweep(from,to,target,radius) {
  const dx=to.x-from.x,dy=to.y-from.y;
  const lengthSq=dx*dx+dy*dy;
  const t=lengthSq>0 ? clamp(((target.x-from.x)*dx+(target.y-from.y)*dy)/lengthSq,0,1) : 0;
  const x=from.x+dx*t,y=from.y+dy*t;
  return (target.x-x)**2+(target.y-y)**2<=radius**2 ? t : null;
}

export class ProjectileSystem {
  constructor({health,map=null,getUnits=()=>[],maxProjectiles=250,onEvent=null}={}) {
    if(typeof health?.damage!=='function')throw new TypeError('ProjectileSystem needs HealthSystem');
    this.health=health;
    this.map=map;
    this.getUnits=typeof getUnits==='function'?getUnits:()=>getUnits;
    this.maxProjectiles=Math.floor(bounded(maxProjectiles,250,1,500));
    this.onEvent=typeof onEvent==='function'?onEvent:null;
    this.projectiles=[];
    this.impacts=[];
    this.nextId=1;
    this.totalShots=0;
    this.totalImpacts=0;
    this._processingCount=0;
    this._survivorCount=0;
    this._updating=false;
  }

  #emit(name,payload){
    try{this.onEvent?.(name,payload);}catch{/* Observers must not disrupt projectiles. */}
  }

  spawn({from,target=null,targetId=null,direction=null,ownerId=null,team=null,
    damage=10,speed=430,range=470,radius=4,blastRadius=0,
    homing=false,friendlyFire=false,blockTerrain=false,color='#e7d299'}={}) {
    if(!point(from) || this.projectiles.length+this._processingCount+this._survivorCount>=this.maxProjectiles)
      return null;
    const aim=point(target) ? target : point(direction)
      ? {x:from.x+direction.x,y:from.y+direction.y} : null;
    if(!aim || dist(from,aim)<0.1)return null;
    const angle=Math.atan2(aim.y-from.y,aim.x-from.x);
    const velocity=bounded(speed,430,1,3000);
    const projectile={
      id:`arrow-${this.nextId++}`,x:from.x,y:from.y,lastX:from.x,lastY:from.y,
      vx:Math.cos(angle)*velocity,vy:Math.sin(angle)*velocity,
      damage:bounded(damage,10,0,1000),radius:bounded(radius,4,1,40),
      remaining:bounded(range,470,1,5000),blastRadius:bounded(blastRadius,0,0,600),
      homing:!!homing,friendlyFire:!!friendlyFire,blockTerrain:!!blockTerrain,
      ownerId,team,targetId:targetId??target?.id??null,
      color:typeof color==='string'&&color.length<=100 ? color:'#e7d299',
    };
    this.projectiles.push(projectile);
    this.totalShots++;
    this.#emit('shot',{projectile});
    return projectile;
  }

  fire(attacker,target,options={}) {
    if(!point(attacker)||!point(target)||attacker.alive===false||target.alive===false||
       (finite(attacker.hp)&&attacker.hp<=0)||(finite(target.hp)&&target.hp<=0))return null;
    const dx=target.x-attacker.x,dy=target.y-attacker.y;
    const len=Math.hypot(dx,dy);
    if(len<0.1)return null;
    const offset=Math.max(8,bounded(attacker.radius,12,1,50)*0.6);
    return this.spawn({
      from:{x:attacker.x+dx/len*offset,y:attacker.y+dy/len*offset},
      target,targetId:target.id,ownerId:attacker.id,team:attacker.team,
      damage:attacker.attackDamage??10,range:attacker.attackRange??480,
      ...options,
    });
  }

  #validTarget(projectile,unit){
    return point(unit)&&unit.id!=null&&unit.id!==projectile.ownerId&&
      unit.alive!==false&&finite(unit.hp)&&unit.hp>0&&
      (projectile.friendlyFire||unit.team!==projectile.team);
  }

  #impact(projectile,target,where,units){
    if(target&&this.#validTarget(projectile,target)){
      this.health.damage(target,projectile.damage,{source:projectile.ownerId,type:'projectile'});
    }
    if(projectile.blastRadius>0&&projectile.damage>0){
      for(const unit of units){
        if(unit===target||!this.#validTarget(projectile,unit))continue;
        const distance=dist(where,unit),range=projectile.blastRadius+bounded(unit.radius,12,0,50);
        if(distance>range)continue;
        const scaled=projectile.damage*(1-clamp(distance/Math.max(1,range),0,.85));
        this.health.damage(unit,scaled,{source:projectile.ownerId,type:'splash'});
      }
    }
    this.impacts.push({x:where.x,y:where.y,age:0,color:projectile.color});
    if(this.impacts.length>100)this.impacts.splice(0,this.impacts.length-100);
    this.totalImpacts++;
    this.#emit('impact',{projectile,target,position:{x:where.x,y:where.y}});
  }

  update(dt){
    if(!finite(dt)||dt<=0||this._updating)return;
    const seconds=Math.min(dt,.05);
    const raw=this.getUnits()||[];
    // A duplicate reference must never receive the same splash twice.
    const ids=new Set();
    const units=(Array.isArray(raw)?raw:[]).filter(u=>{
      if(u?.id==null||ids.has(u.id))return false;
      ids.add(u.id);return point(u);
    });
    const current=this.projectiles;
    this.projectiles=[];
    const survivors=[];
    this._processingCount=current.length;
    this._survivorCount=0;
    this._updating=true;
    try{
      for(const p of current){
        this._processingCount--;
        if(!point(p)||!finite(p.vx)||!finite(p.vy)||
           !finite(p.remaining)||p.remaining<=0)continue;
        const target=p.homing ? units.find(u=>u.id===p.targetId&&this.#validTarget(p,u)) : null;
        if(target){
          const speed=Math.hypot(p.vx,p.vy),angle=Math.atan2(target.y-p.y,target.x-p.x);
          const blend=Math.min(1,seconds*5),vx=Math.cos(angle)*speed,vy=Math.sin(angle)*speed;
          p.vx=p.vx*(1-blend)+vx*blend;
          p.vy=p.vy*(1-blend)+vy*blend;
          const norm=Math.hypot(p.vx,p.vy)||1;
          p.vx=p.vx*speed/norm;p.vy=p.vy*speed/norm;
        }
        const speed=Math.hypot(p.vx,p.vy);
        if(!finite(speed)||speed<0.001)continue;
        const from={x:p.x,y:p.y},travel=Math.min(speed*seconds,p.remaining);
        const to={x:p.x+p.vx/speed*travel,y:p.y+p.vy/speed*travel};
        let first=null,firstT=Infinity;
        for(const unit of units){
          if(!this.#validTarget(p,unit))continue;
          const radius=bounded(unit.radius,12,0,50)+p.radius;
          if(Math.abs(unit.x-(from.x+to.x)/2)>Math.abs(to.x-from.x)/2+radius||
             Math.abs(unit.y-(from.y+to.y)/2)>Math.abs(to.y-from.y)/2+radius)continue;
          const t=sweep(from,to,unit,radius);
          if(t!==null && t<firstT){firstT=t;first=unit;}
        }
        if(p.blockTerrain&&typeof this.map?.isWalkable==='function'){
          const steps=Math.max(1,Math.ceil(travel/8));
          for(let i=0;i<=steps;i++){
            const t=i/steps;
            if(!this.map.isWalkable(from.x+(to.x-from.x)*t,from.y+(to.y-from.y)*t,0)){
              if(t<firstT){firstT=t;first=null;}
              break;
            }
          }
        }
        p.lastX=p.x;p.lastY=p.y;
        p.x=firstT<Infinity?from.x+(to.x-from.x)*firstT:to.x;
        p.y=firstT<Infinity?from.y+(to.y-from.y)*firstT:to.y;
        p.remaining=Math.max(0,p.remaining-travel*(firstT<Infinity?firstT:1));
        if(firstT<Infinity)this.#impact(p,first,p,units);
        else if(p.remaining>0.01){survivors.push(p);this._survivorCount++;}
      }
      // Projectiles spawned by shot/impact observers start next frame, not
      // during the current iteration, and are NEVER silently discarded.
      this.projectiles=[...survivors,...this.projectiles].slice(0,this.maxProjectiles);
      for(const effect of this.impacts)effect.age+=seconds;
      this.impacts=this.impacts.filter(e=>e.age<.26);
    }finally{
      this._processingCount=0;this._survivorCount=0;this._updating=false;
    }
  }

  draw(ctx,camera){
    if(!ctx||typeof camera?.worldToScreen!=='function')return;
    ctx.save();
    for(const p of this.projectiles){
      const a=camera.worldToScreen(p.x,p.y);
      if(!point(a))continue;
      const angle=Math.atan2(p.vy*(camera.tilt||1),p.vx);
      ctx.save();ctx.translate(a.x,a.y);ctx.rotate(angle);
      ctx.strokeStyle='#55472a';ctx.lineWidth=3;ctx.beginPath();
      ctx.moveTo(-12,0);ctx.lineTo(5,0);ctx.stroke();
      ctx.fillStyle=p.color;ctx.beginPath();ctx.moveTo(8,0);
      ctx.lineTo(1,-4);ctx.lineTo(1,4);ctx.closePath();ctx.fill();ctx.restore();
    }
    for(const effect of this.impacts){
      const a=camera.worldToScreen(effect.x,effect.y);
      if(!point(a))continue;
      ctx.globalAlpha=clamp(1-effect.age/.26,0,1);
      ctx.strokeStyle=effect.color;ctx.lineWidth=2;ctx.beginPath();
      ctx.arc(a.x,a.y,5+13*effect.age/.26,0,Math.PI*2);ctx.stroke();
    }
    ctx.restore();
  }

  getSummary(){return {flying:this.projectiles.length,impacts:this.impacts.length,
    totalShots:this.totalShots,totalImpacts:this.totalImpacts};}
  reset(){this.projectiles=[];this.impacts=[];this._processingCount=0;
    this._survivorCount=0;this.totalShots=0;this.totalImpacts=0;}
}
export default ProjectileSystem;
