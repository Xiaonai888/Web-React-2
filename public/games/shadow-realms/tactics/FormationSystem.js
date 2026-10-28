/**
 * Shadow Realms — tactical formations for EXISTING units and WorldMap.
 * Pure world-space slot computation; no separate physics, engine or API calls.
 * A move happens only after an explicit command from the player.
 */
const finitePoint = p => Number.isFinite(p?.x) && Number.isFinite(p?.y);
const distance = (a,b) => Math.hypot(a.x-b.x, a.y-b.y);
const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
export const FORMATIONS = Object.freeze(['line','column','wedge','box']);

export class FormationSystem {
  constructor({map,navigation=null,spacing=42,maxSearchRadius=130}={}) {
    if(typeof map?.isWalkable !== 'function') throw new TypeError('FormationSystem needs WorldMap');
    this.map=map;this.navigation=navigation;
    this.spacing=clamp(spacing,24,100);
    this.maxSearchRadius=clamp(maxSearchRadius,20,350);
  }

  /** Returns offsets in a unit-local coordinate frame: x=across, y=behind. */
  #offsets(count,shape,spacing) {
    const result=[];
    if(shape==='column') {
      for(let i=0;i<count;i++)result.push({x:0,y:i*spacing});
    }else if(shape==='wedge') {
      result.push({x:0,y:0});
      for(let row=1;result.length<count;row++){
        result.push({x:-row*spacing*.7,y:row*spacing});
        if(result.length<count)result.push({x:row*spacing*.7,y:row*spacing});
      }
    }else if(shape==='box'){
      const cols=Math.ceil(Math.sqrt(count));
      for(let i=0;i<count;i++){
        const col=i%cols,row=Math.floor(i/cols);
        const inRow=Math.min(cols,count-row*cols);
        result.push({x:(col-(inRow-1)/2)*spacing,y:row*spacing});
      }
    }else{
      for(let i=0;i<count;i++)result.push({x:(i-(count-1)/2)*spacing,y:0});
    }
    return result;
  }

  #freeNear(point,radius,reserved) {
    const clear = p => this.map.isWalkable(p.x,p.y,radius) &&
      reserved.every(q => distance(p,q)>=Math.max(radius*2+5,this.spacing*.65));
    if(clear(point))return point;
    for(let ring=this.spacing*.45;ring<=this.maxSearchRadius;ring+=this.spacing*.45){
      const n=12+Math.ceil(ring/this.spacing)*6;
      for(let i=0;i<n;i++){
        const angle=i/n*Math.PI*2;
        const p={x:point.x+Math.cos(angle)*ring,y:point.y+Math.sin(angle)*ring};
        if(clear(p))return p;
      }
    }
    return null;
  }

  /** Position each living blue unit around a destination, without moving anyone. */
  plan(units,destination,{shape='line',spacing=this.spacing,facing=null}={}) {
    if(!Array.isArray(units)||!finitePoint(destination)||!FORMATIONS.includes(shape)||
       !this.map.isWalkable(destination.x,destination.y,0))
      return {ok:false,reason:'invalid_input',assignments:[],skipped:[]};
    const seen=new Set();
    const chosen=units.filter(u=>{
      if(!u||u.id==null||seen.has(u.id)||u.team!=='blue'||u.alive===false||!(u.hp>0)||!finitePoint(u))return false;
      seen.add(u.id);return true;
    });
    if(!chosen.length)return {ok:false,reason:'no_units',assignments:[],skipped:[]};
    const centre={x:chosen.reduce((s,u)=>s+u.x,0)/chosen.length,
      y:chosen.reduce((s,u)=>s+u.y,0)/chosen.length};
    const angle=Number.isFinite(facing)?facing:Math.atan2(destination.y-centre.y,destination.x-centre.x);
    const forward={x:Math.cos(angle),y:Math.sin(angle)};
    const side={x:-forward.y,y:forward.x};
    const offsets=this.#offsets(chosen.length,shape,clamp(spacing,24,100));
    const assignments=[],skipped=[],reserved=[];
    for(let i=0;i<chosen.length;i++){
      const u=chosen[i],o=offsets[i];
      const proposed={x:destination.x+side.x*o.x-forward.x*o.y,
        y:destination.y+side.y*o.x-forward.y*o.y};
      const free=this.#freeNear(proposed,u.radius||14,reserved);
      if(!free){skipped.push({unitId:u.id,reason:'blocked'});continue;}
      reserved.push(free);
      assignments.push({unitId:u.id,unit:u,point:free});
    }
    return {ok:assignments.length>0,shape,assignments,skipped};
  }

  /** Issues each waypoint through the existing pathfinder only when asked. */
  move(units,destination,options={}) {
    const plan=this.plan(units,destination,options);
    if(!plan.ok)return {...plan,moved:0};
    if(typeof this.navigation?.moveUnit!=='function')return {...plan,ok:false,reason:'navigation_unavailable',moved:0};
    let moved=0;const errors=[...plan.skipped];
    for(const item of plan.assignments){
      try{
        if(this.navigation.moveUnit(item.unit,item.point))moved++;
        else errors.push({unitId:item.unitId,reason:'no_route'});
      }catch{errors.push({unitId:item.unitId,reason:'path_error'});}
    }
    return {ok:moved>0,shape:plan.shape,moved,requested:plan.assignments.length,
      skipped:errors,assignments:plan.assignments};
  }
}
export default FormationSystem;
