/**
 * Shadow Realms — PatrolSystem (Step 41, complete single-file update).
 * Player-issued patrols share the existing WorldMap, Pathfinding, Farmer and
 * CombatSystem. Patrol owns only orders it actually issued, so a newer player
 * attack, guard, attack-move or manual move is never overwritten on the next tick.
 *
 * Compatible API: start, pause, stop, stopUnit, update, getPatrols, draw,
 * getSummary, destroy. No extra event listeners, intervals or server calls.
 */
const finite = Number.isFinite;
const point = p => finite(p?.x) && finite(p?.y);
const distance = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
const clamp = (n,lo,hi) => Math.max(lo,Math.min(hi,n));
const positive = (n,otherwise) => finite(n) && n>0 ? n : otherwise;
const living = u => u?.id!=null && u.team==='blue' && u.alive!==false &&
  finite(u.hp) && u.hp>0 && point(u);

export class PatrolSystem {
  constructor({map,navigation,getUnits=()=>[],combat=null,checkInterval=.35,
    defaultThreatRadius=185,onEvent=null}={}) {
    if(typeof map?.isWalkable!=='function'||typeof navigation?.moveUnit!=='function')
      throw new TypeError('PatrolSystem needs WorldMap and Pathfinding');
    this.map=map;
    this.navigation=navigation;
    this.combat=combat;
    this.getUnits=typeof getUnits==='function'?getUnits:()=>getUnits;
    this.checkInterval=clamp(positive(checkInterval,.35),.15,2);
    this.defaultThreatRadius=clamp(positive(defaultThreatRadius,185),30,850);
    this.onEvent=typeof onEvent==='function'?onEvent:null;
    this.patrols=new Map();
    this.assignments=new Map();
    this.serial=0;
    this.timer=0;
    this.destroyed=false;
  }

  #emit(name,data) {
    try{this.onEvent?.(name,data);}
    catch(error){console.warn('Shadow Realms patrol observer failed:',name,error);}
  }
  #all() {
    const list=this.getUnits()||[];
    return Array.isArray(list)?list:[];
  }
  #unit(id) {return this.#all().find(u=>u?.id===id)||null;}
  #ownRoute(unit,state) {
    // A manual move overwrites Farmer.destination; never stop that new route.
    return point(state.goal) && unit?.state==='walking' &&
      point(unit.destination) && distance(unit.destination,state.goal)<2;
  }
  #ownAttack(unitId,state) {
    const order=this.combat?.getOrder?.(unitId);
    return state.attackOrder!=null && order===state.attackOrder;
  }
  #clearAttack(unitId,state) {
    if(this.#ownAttack(unitId,state))this.combat?.orderStop?.([unitId]);
    state.attackOrder=null;
    state.targetId=null;
  }
  #release(unitId,state,{stopMovement=false}={}) {
    const unit=this.#unit(unitId);
    this.#clearAttack(unitId,state);
    if(stopMovement && this.#ownRoute(unit,state))unit.stop?.();
    state.goal=null;
    this.assignments.delete(unitId);
  }

  start(unitIds,waypoints,{loop=true,threatRadius=this.defaultThreatRadius}={}) {
    if(this.destroyed)return {ok:false,reason:'destroyed'};
    if(!Array.isArray(waypoints)||waypoints.length<2||waypoints.length>16||
       waypoints.some(p=>!point(p)||!this.map.isWalkable(p.x,p.y,14)))
      return {ok:false,reason:'invalid_waypoints'};
    const ids=new Set(Array.isArray(unitIds)?unitIds:[unitIds]);
    const units=this.#all().filter(u=>ids.has(u?.id)&&living(u));
    if(!units.length)return {ok:false,reason:'no_available_units'};
    if(units.some(u=>this.assignments.has(u.id)))
      return {ok:false,reason:'already_assigned'};
    if(units.some(u=>waypoints.some(p=>!this.map.isWalkable(p.x,p.y,u.radius||14))))
      return {ok:false,reason:'invalid_waypoints'};
    if(this.patrols.size>=24)return {ok:false,reason:'patrol_limit'};
    const id=`patrol-${++this.serial}`;
    const states=new Map(units.map(u=>[u.id,{
      nextIndex:0,targetId:null,attackOrder:null,goal:null,retryIn:0,
      failures:0,noticeIn:0,
    }]));
    this.patrols.set(id,{id,waypoints:waypoints.map(p=>({x:p.x,y:p.y})),
      loop:!!loop,threatRadius:clamp(positive(threatRadius,this.defaultThreatRadius),30,850),
      states,paused:false});
    for(const unit of units)this.assignments.set(unit.id,id);
    this.#emit('started',{id,count:units.length});
    return {ok:true,id,count:units.length};
  }

  pause(id,value=true) {
    const patrol=this.patrols.get(id);
    if(!patrol||this.destroyed)return false;
    const paused=!!value;
    if(patrol.paused===paused)return true;
    patrol.paused=paused;
    if(paused)for(const [unitId,state] of patrol.states){
      const unit=this.#unit(unitId);
      this.#clearAttack(unitId,state);
      if(this.#ownRoute(unit,state))unit.stop?.();
      state.goal=null;
    }
    else for(const state of patrol.states.values())state.retryIn=0;
    this.#emit(paused?'paused':'resumed',{id});
    return true;
  }

  stop(id,{stopMovement=false}={}) {
    const patrol=this.patrols.get(id);
    if(!patrol)return false;
    // Unregister first: reentrant UI observers cannot double-release members.
    this.patrols.delete(id);
    for(const [unitId,state] of patrol.states)
      this.#release(unitId,state,{stopMovement});
    patrol.states.clear();
    this.#emit('stopped',{id});
    return true;
  }

  stopUnit(unitId) {
    const id=this.assignments.get(unitId);
    const patrol=this.patrols.get(id);
    if(!patrol){this.assignments.delete(unitId);return false;}
    const state=patrol.states.get(unitId);
    if(!state){this.assignments.delete(unitId);return false;}
    patrol.states.delete(unitId);
    this.#release(unitId,state);
    this.#emit('unit_removed',{id,unitId});
    if(!patrol.states.size)this.stop(id);
    return true;
  }

  #enemy(unit,radius,all) {
    let selected=null,best=radius;
    for(const enemy of all){
      if(!point(enemy)||enemy?.id===unit.id||enemy.team==null||enemy.team===unit.team||
         enemy.alive===false||!(enemy.hp>0))continue;
      const d=distance(unit,enemy);
      if(d<best){best=d;selected=enemy;}
    }
    return selected;
  }

  #route(unit,state,patrol,elapsed) {
    const waypoint=patrol.waypoints[state.nextIndex];
    const threshold=Math.max(17,positive(unit.radius,14));
    if(distance(unit,waypoint)<=threshold){
      if(!patrol.loop && state.nextIndex===patrol.waypoints.length-1){
        this.stopUnit(unit.id);
        return;
      }
      state.nextIndex=(state.nextIndex+1)%patrol.waypoints.length;
      state.goal=null;
      state.failures=0;
      state.retryIn=0;
    }
    const target=patrol.waypoints[state.nextIndex];
    // Pathfinding owns this route while walking. Do not recalculate A* every
    // 1.15 seconds (the old implementation reset waypoint progress repeatedly).
    if(this.#ownRoute(unit,state))return;
    // A newer manual move has replaced the previously issued patrol route.
    if(point(state.goal) && unit.state==='walking' && point(unit.destination) &&
       distance(unit.destination,state.goal)>=2){
      this.stopUnit(unit.id);
      return;
    }
    state.goal=null;
    state.retryIn=Math.max(0,state.retryIn-elapsed);
    state.noticeIn=Math.max(0,state.noticeIn-elapsed);
    if(state.retryIn>0)return;
    let moved=false;
    try{moved=this.navigation.moveUnit(unit,target)===true;}
    catch(error){this.#emit('route_error',{id:patrol.id,unitId:unit.id,error:String(error)});}
    if(moved){
      state.goal={x:target.x,y:target.y};
      state.retryIn=0;
      state.failures=0;
    }else{
      state.failures++;
      state.retryIn=Math.min(3.5,.55*Math.pow(1.8,Math.min(5,state.failures)));
      if(state.noticeIn<=0){
        this.#emit('route_blocked',{id:patrol.id,unitId:unit.id,waypoint:state.nextIndex});
        state.noticeIn=5;
      }
    }
  }

  update(dt) {
    if(this.destroyed||!finite(dt)||dt<=0||!this.patrols.size)return;
    this.timer+=Math.min(.1,dt);
    if(this.timer<this.checkInterval)return;
    const step=this.timer;
    this.timer=0;
    const all=this.#all();
    const byId=new Map(all.filter(u=>u?.id!=null).map(u=>[u.id,u]));
    for(const patrol of [...this.patrols.values()]){
      for(const [unitId,state] of [...patrol.states]){
        const unit=byId.get(unitId);
        // Clean up dead/missing units even while a patrol is paused.
        if(!living(unit)){this.stopUnit(unitId);continue;}
        if(patrol.paused)continue;
        const existing=this.combat?.getOrder?.(unitId);
        const owned=this.#ownAttack(unitId,state);
        if(existing && !owned){
          // Guard, attack-move, or a newly issued attack belongs to the player.
          this.stopUnit(unitId);
          continue;
        }
        const enemy=this.#enemy(unit,patrol.threatRadius,all);
        if(enemy && typeof this.combat?.orderAttack==='function'){
          if(owned && state.targetId===enemy.id)continue;
          // Replace ONLY a patrol-owned attack, not any newer manual command.
          if(owned)this.#clearAttack(unitId,state);
          let issued=0;
          try{issued=this.combat.orderAttack([unitId],enemy.id)||0;}
          catch(error){this.#emit('attack_error',{id:patrol.id,unitId,error:String(error)});}
          if(issued>0){
            state.attackOrder=this.combat.getOrder?.(unitId)||null;
            state.targetId=enemy.id;
            state.goal=null;
          }
          continue;
        }
        if(owned)this.#clearAttack(unitId,state);
        else {state.attackOrder=null;state.targetId=null;}
        this.#route(unit,state,patrol,step);
      }
    }
  }

  getPatrols() {
    return [...this.patrols.values()].map(p=>({id:p.id,loop:p.loop,paused:p.paused,
      unitIds:[...p.states.keys()],waypoints:p.waypoints.map(w=>({...w}))}));
  }

  draw(ctx,camera) {
    if(!ctx||typeof camera?.worldToScreen!=='function'||this.destroyed)return;
    ctx.save();
    ctx.lineWidth=1.6;
    for(const patrol of this.patrols.values()){
      ctx.beginPath();
      let first=true;
      for(const waypoint of patrol.waypoints){
        const p=camera.worldToScreen(waypoint.x,waypoint.y);
        if(!point(p))continue;
        if(first)ctx.moveTo(p.x,p.y);
        else ctx.lineTo(p.x,p.y);
        first=false;
      }
      if(patrol.loop&&!first){
        const p=camera.worldToScreen(patrol.waypoints[0].x,patrol.waypoints[0].y);
        if(point(p))ctx.lineTo(p.x,p.y);
      }
      ctx.strokeStyle=patrol.paused?'rgba(174,174,174,.6)':'rgba(116,224,234,.7)';
      ctx.setLineDash([6,7]);ctx.stroke();ctx.setLineDash([]);
      for(const waypoint of patrol.waypoints){
        const p=camera.worldToScreen(waypoint.x,waypoint.y);
        if(!point(p))continue;
        ctx.fillStyle=patrol.paused?'#9ba9a8':'#64dcf1';
        ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fill();
      }
    }
    ctx.restore();
  }

  getSummary(){return {patrols:this.patrols.size,units:this.assignments.size};}
  destroy(){
    if(this.destroyed)return;
    for(const id of [...this.patrols.keys()])this.stop(id,{stopMovement:true});
    this.assignments.clear();
    this.destroyed=true;
  }
}
export default PatrolSystem;
