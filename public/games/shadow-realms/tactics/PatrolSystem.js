/**
 * Shadow Realms — explicit player patrols on real WorldMap paths.
 * A patrol never starts automatically and never spawns units. It uses existing
 * CombatSystem for hostile targets and Pathfinding for navigation.
 */
const pos=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y);
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const living=u=>u?.id!=null&&u.team==='blue'&&u.alive!==false&&u.hp>0&&pos(u);

export class PatrolSystem {
  constructor({map,navigation,getUnits=()=>[],combat=null,checkInterval=.35,
    defaultThreatRadius=185,onEvent=null}={}) {
    if(typeof map?.isWalkable!=='function'||typeof navigation?.moveUnit!=='function')
      throw new TypeError('PatrolSystem needs WorldMap and Pathfinding');
    this.map=map;this.navigation=navigation;this.combat=combat;
    this.getUnits=typeof getUnits==='function'?getUnits:()=>getUnits;
    this.checkInterval=Math.max(.15,Math.min(2,checkInterval));
    this.defaultThreatRadius=defaultThreatRadius;
    this.onEvent=onEvent;this.patrols=new Map();this.assignments=new Map();
    this.serial=0;this.timer=0;
  }
  #all(){const all=this.getUnits();return Array.isArray(all)?all:[];}
  #unit(id){return this.#all().find(u=>u?.id===id)||null;}
  start(unitIds,waypoints,{loop=true,threatRadius=this.defaultThreatRadius}={}){
    if(!Array.isArray(waypoints)||waypoints.length<2||waypoints.length>16||
      waypoints.some(p=>!pos(p)||!this.map.isWalkable(p.x,p.y,14)))
      return {ok:false,reason:'invalid_waypoints'};
    const ids=new Set(Array.isArray(unitIds)?unitIds:[unitIds]);
    const units=this.#all().filter(u=>ids.has(u.id)&&living(u)&&!this.assignments.has(u.id));
    if(!units.length)return {ok:false,reason:'no_available_units'};
    const id=`patrol-${++this.serial}`;
    const states=new Map(units.map(u=>[u.id,{nextIndex:0,arrived:false,repath:0,targetId:null}]));
    this.patrols.set(id,{id,waypoints:waypoints.map(p=>({x:p.x,y:p.y})),loop:!!loop,
      threatRadius:Math.max(30,Math.min(850,threatRadius)),states,paused:false});
    for(const unit of units)this.assignments.set(unit.id,id);
    this.onEvent?.('started',{id,count:units.length});
    return {ok:true,id,count:units.length};
  }
  pause(id,value=true){const p=this.patrols.get(id);if(!p)return false;p.paused=!!value;return true;}
  stop(id,{stopMovement=false}={}){
    const p=this.patrols.get(id);if(!p)return false;
    for(const [unitId,st] of p.states){
      this.assignments.delete(unitId);
      const existing=this.combat?.getOrder?.(unitId);
      if(st.targetId && existing?.type==='attack'&&existing.targetId===st.targetId)
        this.combat?.orderStop?.([unitId]);
      if(stopMovement)this.#unit(unitId)?.stop?.();
    }
    this.patrols.delete(id);this.onEvent?.('stopped',{id});return true;
  }
  stopUnit(unitId){const id=this.assignments.get(unitId),p=this.patrols.get(id);
    if(!p)return false;
    p.states.delete(unitId);this.assignments.delete(unitId);
    if(!p.states.size)this.stop(id);
    return true;
  }
  #enemy(unit,radius,all){let nearest=null,best=radius;
    for(const enemy of all){
      if(!pos(enemy)||enemy.alive===false||!(enemy.hp>0)||enemy.team===unit.team||enemy.team==null)continue;
      const d=dist(unit,enemy);if(d<best){best=d;nearest=enemy;}
    }return nearest;
  }
  update(dt){
    if(!Number.isFinite(dt)||dt<=0||!this.patrols.size)return;
    this.timer+=Math.min(.1,dt);if(this.timer<this.checkInterval)return;
    const step=this.timer;this.timer=0;const all=this.#all();
    for(const p of [...this.patrols.values()]){
      if(p.paused)continue;
      for(const [unitId,st] of [...p.states]){
        const unit=all.find(u=>u?.id===unitId);
        if(!living(unit)){this.stopUnit(unitId);continue;}
        const enemy=this.#enemy(unit,p.threatRadius,all);
        if(enemy&&typeof this.combat?.orderAttack==='function'){
          const old=this.combat.getOrder?.(unitId);
          if(old?.type!=='attack'||old.targetId!==enemy.id)
            this.combat.orderAttack([unitId],enemy.id);
          st.targetId=enemy.id;continue;
        }
        if(st.targetId){
          const old=this.combat?.getOrder?.(unitId);
          if(old?.type==='attack'&&old.targetId===st.targetId)
            this.combat?.orderStop?.([unitId]);
          st.targetId=null;st.repath=0;
        }
        const external=this.combat?.getOrder?.(unitId);
        // Do not interrupt a separately issued guard/attack-move order.
        if(external)continue;
        const waypoint=p.waypoints[st.nextIndex];
        if(dist(unit,waypoint)<=Math.max(17,unit.radius||14)){
          if(!p.loop&&st.nextIndex===p.waypoints.length-1){
            this.stopUnit(unitId);continue;
          }
          st.nextIndex=(st.nextIndex+1)%p.waypoints.length;st.repath=0;
        }
        st.repath-=step;
        if(st.repath<=0||unit.state!=='walking'||!unit.path?.length){
          const dest=p.waypoints[st.nextIndex];
          this.navigation.moveUnit(unit,dest);
          st.repath=1.15;
        }
      }
    }
  }
  getPatrols(){return [...this.patrols.values()].map(p=>({id:p.id,loop:p.loop,
    paused:p.paused,unitIds:[...p.states.keys()],waypoints:p.waypoints.map(w=>({...w}))}));}
  draw(ctx,camera){if(!ctx||!camera)return;
    ctx.save();ctx.lineWidth=1.6;
    for(const p of this.patrols.values()){
      ctx.beginPath();let first=true;
      for(const w of p.waypoints){const q=camera.worldToScreen(w.x,w.y);
        if(first)ctx.moveTo(q.x,q.y);else ctx.lineTo(q.x,q.y);first=false;
      }
      if(p.loop&&p.waypoints.length>1){const q=camera.worldToScreen(p.waypoints[0].x,p.waypoints[0].y);ctx.lineTo(q.x,q.y);}
      ctx.strokeStyle='rgba(116,224,234,.7)';ctx.setLineDash([6,7]);ctx.stroke();ctx.setLineDash([]);
      for(const w of p.waypoints){const q=camera.worldToScreen(w.x,w.y);ctx.fillStyle='#64dcf1';
        ctx.beginPath();ctx.arc(q.x,q.y,4,0,Math.PI*2);ctx.fill();}
    }ctx.restore();
  }
  getSummary(){return {patrols:this.patrols.size,units:this.assignments.size};}
  destroy(){for(const id of [...this.patrols.keys()])this.stop(id);}
}
export default PatrolSystem;
