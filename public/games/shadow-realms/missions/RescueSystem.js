/**
 * Shadow Realms — RescueSystem (Step 42).
 * Captives follow a living blue escort on actual walkable paths and count as
 * rescued ONLY upon reaching home. Compatible with existing MissionDirector.
 */
const finite = Number.isFinite;
const point = p => finite(p?.x) && finite(p?.y);
const dist = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
const bounded = (n,fallback,min,max) => clamp(finite(n)?n:fallback,min,max);

export class RescueSystem {
  constructor({map,navigation=null,getUnits=()=>[],home=null,maxCaptives=12,
    pickupRange=72,extractionRange=75,followDistance=42,speed=88,onEvent=null}={}) {
    if(typeof map?.isWalkable!=='function') throw new TypeError('RescueSystem requires WorldMap');
    this.map=map;
    this.navigation=navigation;
    this.getUnits=typeof getUnits==='function'?getUnits:()=>getUnits;
    const spawn=point(home)?home:map.getSpawnPoint?.('blue');
    if(!point(spawn))throw new TypeError('RescueSystem needs a valid extraction point');
    this.home={x:spawn.x,y:spawn.y};
    this.maxCaptives=Math.floor(bounded(maxCaptives,12,1,100));
    this.pickupRange=bounded(pickupRange,72,10,500);
    this.extractionRange=bounded(extractionRange,75,10,500);
    this.followDistance=bounded(followDistance,42,5,150);
    this.speed=bounded(speed,88,1,600);
    this.onEvent=typeof onEvent==='function'?onEvent:null;
    this.captives=[];
    this.byId=new Map();
    this.serial=0;
    this.elapsed=0;
  }

  #emit(name,data){
    try{this.onEvent?.(name,data);}
    catch(error){console.warn('Shadow Realms rescue observer:',name,error);}
  }
  #eligible(unit){return !!unit&&unit.team==='blue'&&unit.alive!==false&&
    finite(unit.hp)&&unit.hp>0&&point(unit);}
  #roster(){const units=this.getUnits()||[];return Array.isArray(units)?units:[];}

  spawn({id=null,x,y,name='Villager'}={}) {
    const at={x,y};
    if(!point(at)||!this.map.isWalkable(x,y,10))return {ok:false,reason:'blocked'};
    if(this.captives.filter(c=>c.state!=='rescued').length>=this.maxCaptives)
      return {ok:false,reason:'limit'};
    if(this.captives.some(c=>c.state!=='rescued'&&dist(c,at)<37))
      return {ok:false,reason:'overlap'};
    let key;
    if(id!=null){key=String(id);if(!key)return {ok:false,reason:'duplicate_id'};}
    else {do{key=`captive-${++this.serial}`;}while(this.byId.has(key));}
    if(this.byId.has(key))return {ok:false,reason:'duplicate_id'};
    const captive={id:key,name:String(name).slice(0,80),x,y,state:'waiting',escortId:null,
      waypoints:[],repath:0,lastGoal:null,elapsed:0};
    this.captives.push(captive);
    this.byId.set(key,captive);
    this.#emit('spawned',{captive:{...captive}});
    return {ok:true,captive};
  }
  getCaptives({includeRescued=false}={}){
    return this.captives.filter(c=>includeRescued||c.state!=='rescued');
  }
  getNearest(at,{maxDistance=80,includeFollowing=false}={}) {
    if(!point(at))return null;
    let best=bounded(maxDistance,80,0,5000),closest=null;
    for(const c of this.captives){
      if(c.state==='rescued'||(!includeFollowing&&c.state!=='waiting'))continue;
      const d=dist(c,at);
      if(d<best){best=d;closest=c;}
    }
    return closest;
  }
  assignEscort(captiveId,unitOrId) {
    const captive=this.byId.get(captiveId);
    if(!captive||captive.state==='rescued')return {ok:false,reason:'missing_captive'};
    const unit=typeof unitOrId==='object'?unitOrId:
      this.#roster().find(u=>u?.id===unitOrId);
    if(!this.#eligible(unit))return {ok:false,reason:'invalid_escort'};
    if(dist(unit,captive)>this.pickupRange)return {ok:false,reason:'too_far'};
    if(captive.state==='following'&&captive.escortId===unit.id)
      return {ok:true,captive}; // Repeated tap is not a new assignment.
    captive.state='following';
    captive.escortId=unit.id;
    captive.waypoints=[];
    captive.repath=0;
    captive.lastGoal=null;
    this.#emit('escorted',{captive,unit});
    return {ok:true,captive};
  }

  #pathTo(captive,goal) {
    if(!point(goal)||!this.map.isWalkable(goal.x,goal.y,10))return [];
    if(typeof this.navigation?.findPath==='function'){
      try{
        const found=this.navigation.findPath(captive,goal,{radius:10,smooth:true});
        if(Array.isArray(found)&&found.length&&found.every(point))
          return found.map(p=>({x:p.x,y:p.y}));
      }catch{/* Try safe direct-line fallback when navigation is unavailable. */}
    }
    // Only use straight-line movement when EACH intermediate point is walkable.
    const length=dist(captive,goal);
    const steps=Math.max(1,Math.ceil(length/11));
    for(let i=1;i<=steps;i++){
      const x=captive.x+(goal.x-captive.x)*i/steps;
      const y=captive.y+(goal.y-captive.y)*i/steps;
      if(!this.map.isWalkable(x,y,10))return [];
    }
    return [{x:goal.x,y:goal.y}];
  }

  update(dt) {
    if(!finite(dt)||dt<=0)return;
    const seconds=Math.min(.1,dt);
    this.elapsed+=seconds;
    const roster=this.#roster();
    for(const c of this.captives){
      if(c.state!=='following')continue;
      c.elapsed+=seconds;
      const escort=roster.find(u=>u?.id===c.escortId);
      if(!this.#eligible(escort)){
        c.state='waiting';c.escortId=null;c.waypoints=[];
        c.repath=0;c.lastGoal=null;
        this.#emit('escort_lost',{captive:c});
        continue;
      }
      if(dist(c,this.home)<=this.extractionRange&&
         dist(escort,this.home)<=this.extractionRange+70){
        c.state='rescued';c.waypoints=[];c.escortId=null;
        this.#emit('rescued',{captive:c,unit:escort});
        continue;
      }
      const separation=dist(c,escort);
      if(separation<=this.followDistance){c.waypoints=[];c.repath=0;continue;}
      c.repath=Math.max(0,c.repath-seconds);
      const movedGoal=c.lastGoal&&dist(c.lastGoal,escort)>65;
      // Failed routes MUST wait for the retry clock; no A* on every tick.
      if(c.repath<=0 || (movedGoal&&c.repath<=.25)){
        c.lastGoal={x:escort.x,y:escort.y};
        c.waypoints=this.#pathTo(c,c.lastGoal);
        c.repath=c.waypoints.length?1:1.4;
      }
      let left=this.speed*seconds;
      let segments=0;
      while(left>0.00001&&c.waypoints.length&&segments++<64){
        const target=c.waypoints[0],distance=dist(c,target);
        if(distance<.5){c.waypoints.shift();continue;}
        const step=Math.min(left,distance);
        const x=c.x+(target.x-c.x)*step/distance;
        const y=c.y+(target.y-c.y)*step/distance;
        if(!this.map.isWalkable(x,y,10)){
          c.waypoints=[];c.repath=Math.max(.4,c.repath);
          break;
        }
        c.x=x;c.y=y;left-=step;
        if(step>=distance-.00001)c.waypoints.shift();
      }
    }
  }

  draw(ctx,camera) {
    if(!ctx||typeof camera?.worldToScreen!=='function')return;
    ctx.save();
    for(const c of this.captives){
      if(c.state==='rescued')continue;
      const p=camera.worldToScreen(c.x,c.y),z=bounded(camera.zoom,1,.5,2);
      if(!point(p)||p.x< -50||p.y< -90||p.x>camera.viewportWidth+50||p.y>camera.viewportHeight+30)continue;
      ctx.save();ctx.translate(p.x,p.y);ctx.scale(z,z);
      ctx.fillStyle='rgba(19,33,24,.3)';ctx.beginPath();ctx.ellipse(0,2,13,4,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=c.state==='following'?'#6fc6b5':'#dcb867';ctx.fillRect(-8,-29,16,23);
      ctx.fillStyle='#e7bc96';ctx.beginPath();ctx.arc(0,-37,10,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#51472b';ctx.fillRect(-9,-48,18,7);
      ctx.fillStyle=c.state==='following'?'#a4ffff':'#ffdf75';
      ctx.textAlign='center';ctx.font='bold 17px sans-serif';
      ctx.fillText(c.state==='following'?'✓':'!',0,-55);ctx.restore();
    }
    ctx.restore();
  }
  getSummary(){return {waiting:this.captives.filter(c=>c.state==='waiting').length,
    following:this.captives.filter(c=>c.state==='following').length,
    rescued:this.captives.filter(c=>c.state==='rescued').length,total:this.captives.length};}
  reset(){this.captives=[];this.byId.clear();this.serial=0;this.elapsed=0;}
}
export default RescueSystem;
