/**
 * Shadow Realms — CombatSystem (Step 35, complete single-file update).
 * Keeps the public API used by index.html, EnemyAI, TacticsFeature and waves:
 * orderAttack, orderAttackMove, orderGuard, orderStop, getOrder, update, draw,
 * units, getUnit, isHostile, isAlive, getSummary and reset.
 *
 * Fixes: attack-move routing to the EXACT destination (not melee stand-off),
 * safe chase positions, bounded repath retries, stale-order cleanup, and
 * moving-target recovery. Uses existing Health/Projectile/Pathfinding systems.
 * Never owns units or touches DOM, storage, fetch or game-loop callbacks.
 */
const finite = Number.isFinite;
const point = value => finite(value?.x) && finite(value?.y);
const distance = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
const clamp = (v,lo,hi) => Math.max(lo,Math.min(hi,v));
const positive = (v,fallback) => finite(v) && v > 0 ? v : fallback;

export class CombatSystem {
  constructor({health,projectiles=null,navigation=null,getUnits=()=>[],
    autoDefend=false,onEvent=null}={}) {
    if(typeof health?.damage!=='function' || typeof health?.isAlive!=='function')
      throw new TypeError('CombatSystem requires the existing HealthSystem');
    this.health=health;
    this.projectiles=projectiles;
    this.navigation=navigation;
    this.getUnits=typeof getUnits==='function'?getUnits:()=>getUnits;
    this.autoDefend=!!autoDefend;
    this.onEvent=typeof onEvent==='function'?onEvent:null;
    this.orders=new Map();
    this.cooldowns=new Map();
    this.pathTimers=new Map();
    this.pathGoals=new Map();
    this.combatMovement=new Set();
    this.time=0;
  }

  units(){const result=this.getUnits()||[];
    return Array.isArray(result)?result.filter(u=>u?.id!=null&&point(u)):[];}
  getUnit(id){return this.units().find(u=>u.id===id)||null;}
  isHostile(a,b){return !!(a&&b&&a.id!==b.id&&a.team!=null&&b.team!=null&&a.team!==b.team);}
  isAlive(u){return !!u&&this.health.isAlive(u);}
  #emit(name,payload){try{this.onEvent?.(name,payload);}catch{/* Visuals must not disrupt combat. */}}

  #forgetRoute(id,unit=null,stop=false){
    this.pathTimers.delete(id);this.pathGoals.delete(id);
    const owned=this.combatMovement.delete(id);
    if(stop && owned && unit && this.isAlive(unit))unit.stop?.();
  }
  #removeOrder(id,unit=null){
    this.orders.delete(id);this.#forgetRoute(id,unit,true);
  }
  #order(ids,build){
    const all=this.units(),byId=new Map(all.map(u=>[u.id,u]));
    let count=0;
    for(const id of new Set(Array.isArray(ids)?ids:[ids])){
      const unit=byId.get(id);
      if(!this.isAlive(unit))continue;
      const command=build(unit);
      if(!command)continue;
      this.#forgetRoute(id,unit,true);
      this.orders.set(id,command);count++;
    }
    return count;
  }

  orderAttack(unitIds,targetId){
    const target=this.getUnit(targetId);
    if(!this.isAlive(target))return 0;
    return this.#order(unitIds,unit=>this.isHostile(unit,target)
      ? {type:'attack',targetId,issuedAt:this.time}:null);
  }
  orderAttackMove(unitIds,destination,{acquireRange=300}={}){
    if(!point(destination))return 0;
    const target={x:destination.x,y:destination.y};
    return this.#order(unitIds,()=>({type:'attackMove',destination:{...target},
      acquireRange:clamp(positive(acquireRange,300),40,900),issuedAt:this.time}));
  }
  orderGuard(unitIds,place=null,{radius=280}={}){
    if(place!=null&&!point(place))return 0;
    return this.#order(unitIds,unit=>({type:'guard',
      point:place?{x:place.x,y:place.y}:{x:unit.x,y:unit.y},
      radius:clamp(positive(radius,280),50,1000),issuedAt:this.time}));
  }
  orderStop(unitIds){
    let count=0;
    const byId=new Map(this.units().map(u=>[u.id,u]));
    for(const id of new Set(Array.isArray(unitIds)?unitIds:[unitIds])){
      if(this.orders.delete(id))count++;
      this.cooldowns.delete(id);
      this.#forgetRoute(id);
      // Explicit stop retains the previous public behavior for UI commands.
      const unit=byId.get(id);
      if(this.isAlive(unit))unit.stop?.();
    }
    return count;
  }
  getOrder(id){return this.orders.get(id)||null;}

  #nearestEnemy(unit,maxDistance,units,guardPoint=null){
    let nearest=null,best=positive(maxDistance,145);
    for(const target of units){
      if(!this.isHostile(unit,target)||!this.isAlive(target))continue;
      if(guardPoint && distance(target,guardPoint)>maxDistance)continue;
      const gap=distance(unit,target);
      if(gap<best){best=gap;nearest=target;}
    }
    return nearest;
  }

  /** Throttle expensive A* calls even if a destination cannot be reached. */
  #navigate(unit,destination,dt,{chase=false}={}){
    if(typeof this.navigation?.moveUnit!=='function'||!this.isAlive(unit)||!point(destination))return false;
    const id=unit.id;
    const timer=Math.max(0,(this.pathTimers.get(id)||0)-dt);
    this.pathTimers.set(id,timer);
    const previous=this.pathGoals.get(id);
    const changed=previous && distance(previous,destination)>(chase?50:17);
    if(timer>0 && (!changed || timer>.28))return unit.state==='walking';
    if(!changed && unit.state==='walking' && timer>0)return true;
    let moved=false;
    try{moved=this.navigation.moveUnit(unit,destination)===true;}catch{/* Invalid route. */}
    this.pathTimers.set(id,moved?.85:1.35);
    if(moved){this.pathGoals.set(id,{x:destination.x,y:destination.y});this.combatMovement.add(id);}
    return moved;
  }

  /** Stand on a walkable ring AROUND the target, never route into its body. */
  #approachEnemy(unit,target,range,dt){
    const dx=unit.x-target.x,dy=unit.y-target.y;
    const d=Math.max(.001,Math.hypot(dx,dy));
    const radius=Math.max(positive(unit.radius,12)+positive(target.radius,12)+5,range*.77);
    const nx=dx/d,ny=dy/d;
    const positions=[
      {x:target.x+nx*radius,y:target.y+ny*radius},
      {x:target.x-ny*radius,y:target.y+nx*radius},
      {x:target.x+ny*radius,y:target.y-nx*radius},
    ];
    // Try alternate sides only after the primary route fails, and obey retry delay.
    const timer=this.pathTimers.get(unit.id)||0;
    if(timer>.28)return;
    for(const pos of positions){
      if(this.navigation?.map?.isWalkable &&
        !this.navigation.map.isWalkable(pos.x,pos.y,positive(unit.radius,12)))continue;
      if(this.#navigate(unit,pos,dt,{chase:true}))return;
      // Skip the failure cooldown within this single bounded attempt only.
      this.pathTimers.set(unit.id,0);
    }
    this.pathTimers.set(unit.id,1.35);
  }

  #engage(unit,target,dt,ordered=false){
    if(!this.isAlive(unit)||!this.isAlive(target)||!this.isHostile(unit,target))return false;
    const range=clamp(positive(unit.attackRange,39),24,900);
    if(distance(unit,target)>range+positive(target.radius,12)*.3){
      this.#approachEnemy(unit,target,range,dt);
      return true;
    }
    if(this.combatMovement.has(unit.id)){
      this.#forgetRoute(unit.id,unit,true);
    }else if(ordered && unit.state==='walking'){
      // The explicit combat command supersedes the unit's previous movement.
      unit.stop?.();
    }
    if((this.cooldowns.get(unit.id)||0)>0)return true;
    const damage=clamp(positive(unit.attackDamage,5),1,1000);
    const cooldown=clamp(positive(unit.attackCooldown,1.35),.15,10);
    const ranged=unit.attackType==='ranged'||range>85;
    if(ranged){
      if(typeof this.projectiles?.fire!=='function')return false;
      const shot=this.projectiles.fire(unit,target,{
        damage,range:range+90,speed:positive(unit.projectileSpeed,440),
        color:unit.team==='red'?'#f2a77a':'#f1dfa1',
      });
      if(!shot){this.cooldowns.set(unit.id,.15);return false;}
    }else{
      const hit=this.health.damage(target,damage,{source:unit,type:'melee'});
      if(hit?.ok===false)return false;
    }
    this.cooldowns.set(unit.id,cooldown);
    this.#emit('attack',{unit,target,damage,ranged});
    return true;
  }

  update(dt){
    if(!finite(dt)||dt<=0)return;
    const seconds=Math.min(dt,.1);
    this.time+=seconds;
    const all=this.units();
    const byId=new Map(all.map(u=>[u.id,u]));
    for(const [id,cooldown] of this.cooldowns){
      if(!this.isAlive(byId.get(id)))this.cooldowns.delete(id);
      else this.cooldowns.set(id,Math.max(0,cooldown-seconds));
    }
    for(const [id,order] of [...this.orders]){
      const unit=byId.get(id);
      if(!this.isAlive(unit)){this.#removeOrder(id,unit);continue;}
      if(order.type==='attack'){
        const enemy=byId.get(order.targetId);
        if(!this.isAlive(enemy)||!this.isHostile(unit,enemy)){
          this.#removeOrder(id,unit);continue;
        }
        this.#engage(unit,enemy,seconds,true);
      }else if(order.type==='attackMove'){
        const enemy=this.#nearestEnemy(unit,order.acquireRange,all);
        if(enemy){this.#engage(unit,enemy,seconds,true);continue;}
        const tolerance=Math.max(16,positive(unit.radius,12)+4);
        if(distance(unit,order.destination)<=tolerance){
          this.#removeOrder(id,unit);
        }else{
          // IMPORTANT: this is MOVEMENT, not a target's combat stand-off ring.
          this.#navigate(unit,order.destination,seconds);
        }
      }else if(order.type==='guard'){
        const enemy=this.#nearestEnemy(unit,order.radius,all,order.point);
        if(enemy){this.#engage(unit,enemy,seconds,true);continue;}
        if(distance(unit,order.point)>55)this.#navigate(unit,order.point,seconds);
        else if(this.combatMovement.has(id))this.#forgetRoute(id,unit,true);
      }else this.#removeOrder(id,unit);
    }
    if(this.autoDefend)for(const unit of all){
      if(!this.isAlive(unit)||this.orders.has(unit.id)||unit.isCivilian===true)continue;
      if(unit.state==='harvesting'||unit.state==='walking')continue;
      const enemy=this.#nearestEnemy(unit,positive(unit.aggroRange,145),all);
      if(enemy)this.#engage(unit,enemy,seconds,false);
    }
    // Keep transient navigation state bounded when units die or reset outside combat.
    for(const id of this.combatMovement){
      if(!this.isAlive(byId.get(id))){this.#forgetRoute(id);this.cooldowns.delete(id);}
    }
  }

  draw(ctx,camera){
    if(!ctx||typeof camera?.worldToScreen!=='function')return;
    const byId=new Map(this.units().map(u=>[u.id,u]));
    ctx.save();ctx.lineWidth=1.2;
    for(const [id,order] of this.orders){
      const unit=byId.get(id);
      if(!this.isAlive(unit))continue;
      const marker=order.type==='attack'?byId.get(order.targetId):
        order.type==='guard'?order.point:order.destination;
      if(!point(marker))continue;
      const p=camera.worldToScreen(marker.x,marker.y);
      if(!point(p))continue;
      if(p.x<-80||p.y<-80||p.x>camera.viewportWidth+80||p.y>camera.viewportHeight+80)continue;
      ctx.strokeStyle=unit.team==='red'?'rgba(233,109,93,.6)':'rgba(242,215,121,.65)';
      ctx.beginPath();ctx.arc(p.x,p.y,Math.max(10,positive(marker.radius,13)*positive(camera.zoom,1)),0,Math.PI*2);ctx.stroke();
    }
    ctx.restore();
  }
  getSummary(){return {activeOrders:this.orders.size,cooldowns:this.cooldowns.size};}
  reset(){
    // Preserve the existing reset API and stop only movement this system owns.
    const byId=new Map(this.units().map(u=>[u.id,u]));
    for(const id of this.combatMovement)this.#forgetRoute(id,byId.get(id),true);
    this.orders.clear();this.cooldowns.clear();this.pathTimers.clear();
    this.pathGoals.clear();this.combatMovement.clear();this.time=0;
  }
}
export default CombatSystem;
