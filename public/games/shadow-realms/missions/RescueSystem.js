/** Shadow Realms — escort captives back to extraction, not instant point awards.
 * Navigation uses existing Pathfinding.findPath() when provided; no new AI engine.
 */
const finite=Number.isFinite
const point=p=>finite(p?.x)&&finite(p?.y)
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y)
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n))

export class RescueSystem {
  constructor({map,navigation=null,getUnits=()=>[],home=null,maxCaptives=12,
    pickupRange=72,extractionRange=75,followDistance=42,speed=88,onEvent=null}={}) {
    if (!map||typeof map.isWalkable!=='function') throw new TypeError('RescueSystem requires WorldMap')
    this.map=map;this.navigation=navigation
    this.getUnits=typeof getUnits==='function'?getUnits:()=>getUnits
    this.home=point(home)?{...home}:map.getSpawnPoint('blue')
    this.maxCaptives=clamp(Math.floor(maxCaptives)||12,1,100)
    this.pickupRange=pickupRange;this.extractionRange=extractionRange
    this.followDistance=followDistance;this.speed=speed;this.onEvent=onEvent
    this.captives=[];this.byId=new Map();this.serial=0;this.elapsed=0
  }
  spawn({id=null,x,y,name='Villager'}={}) {
    const pos={x,y}
    if (!point(pos)||!this.map.isWalkable(x,y,10)) return {ok:false,reason:'blocked'}
    if (this.captives.filter(c=>c.state!=='rescued').length>=this.maxCaptives) return {ok:false,reason:'limit'}
    if(this.captives.some(c=>c.state!=='rescued'&&dist(c,pos)<37))return {ok:false,reason:'overlap'}
    const key=String(id??`captive-${++this.serial}`)
    if (this.byId.has(key)) return {ok:false,reason:'duplicate_id'}
    const captive={id:key,name:String(name),x,y,state:'waiting',escortId:null,
      waypoints:[],repath:0,lastGoal:null,elapsed:0}
    this.captives.push(captive);this.byId.set(key,captive)
    this.onEvent?.('spawned',{captive:{...captive}})
    return {ok:true,captive}
  }
  getCaptives({includeRescued=false}={}) {
    return this.captives.filter(c=>includeRescued||c.state!=='rescued')
  }
  getNearest(pointAt,{maxDistance=80,includeFollowing=false}={}) {
    if(!point(pointAt))return null
    let closest=null,best=maxDistance
    for(const c of this.captives){
      if(c.state==='rescued'||(!includeFollowing&&c.state!=='waiting'))continue
      const d=dist(c,pointAt)
      if(d<best){best=d;closest=c}
    }
    return closest
  }
  #eligible(unit) {return unit&&unit.team==='blue'&&unit.alive!==false&&finite(unit.hp)&&unit.hp>0&&point(unit)}
  assignEscort(captiveId,unitOrId) {
    const captive=this.byId.get(captiveId)
    if(!captive||captive.state==='rescued')return {ok:false,reason:'missing_captive'}
    const units=this.getUnits()||[]
    const unit=typeof unitOrId==='object'?unitOrId:units.find(u=>u.id===unitOrId)
    if(!this.#eligible(unit))return {ok:false,reason:'invalid_escort'}
    if(dist(unit,captive)>this.pickupRange)return {ok:false,reason:'too_far'}
    captive.state='following';captive.escortId=unit.id;captive.waypoints=[];captive.repath=0;captive.lastGoal=null
    this.onEvent?.('escorted',{captive,unit})
    return {ok:true,captive}
  }
  #pathTo(captive,goal) {
    if(!point(goal)||!this.map.isWalkable(goal.x,goal.y,10))return []
    if(typeof this.navigation?.findPath==='function'){
      const path=this.navigation.findPath(captive,goal,{radius:10,smooth:true})
      if(Array.isArray(path)&&path.length)return path.map(p=>({x:p.x,y:p.y}))
    }
    // Strict fallback: only walk straight if the entire line is free.
    const d=dist(captive,goal),steps=Math.max(1,Math.ceil(d/11))
    for(let i=1;i<=steps;i++){
      const x=captive.x+(goal.x-captive.x)*i/steps
      const y=captive.y+(goal.y-captive.y)*i/steps
      if(!this.map.isWalkable(x,y,10))return []
    }
    return [{...goal}]
  }
  update(dt) {
    if(!finite(dt)||dt<=0)return
    const seconds=Math.min(.1,dt);this.elapsed+=seconds
    const units=this.getUnits()||[]
    for(const c of this.captives){
      if(c.state!=='following')continue
      const escort=units.find(u=>u.id===c.escortId)
      if(!this.#eligible(escort)){
        c.state='waiting';c.escortId=null;c.waypoints=[]
        this.onEvent?.('escort_lost',{captive:c})
        continue
      }
      const d=dist(c,escort)
      if(dist(c,this.home)<=this.extractionRange && dist(escort,this.home)<=this.extractionRange+70){
        c.state='rescued';c.waypoints=[];this.onEvent?.('rescued',{captive:c,unit:escort});continue
      }
      if(d<=this.followDistance){c.waypoints=[];continue}
      c.repath-=seconds
      if(c.repath<=0||!c.lastGoal||dist(c.lastGoal,escort)>65||!c.waypoints.length){
        c.lastGoal={x:escort.x,y:escort.y}
        c.waypoints=this.#pathTo(c,c.lastGoal)
        c.repath=1.0
      }
      let left=this.speed*seconds
      while(left>0.00001&&c.waypoints.length){
        const target=c.waypoints[0],distance=dist(c,target)
        if(distance<.5){c.waypoints.shift();continue}
        const step=Math.min(left,distance)
        const x=c.x+(target.x-c.x)*step/distance,y=c.y+(target.y-c.y)*step/distance
        if(!this.map.isWalkable(x,y,10)){c.waypoints=[];c.repath=0;break}
        c.x=x;c.y=y;left-=step
        if(step>=distance-.00001)c.waypoints.shift()
      }
    }
  }
  draw(ctx,camera) {
    if(!ctx||!camera)return
    ctx.save()
    for(const c of this.captives){
      if(c.state==='rescued')continue
      const p=camera.worldToScreen(c.x,c.y),z=clamp(camera.zoom,.5,2)
      if(p.x< -50||p.y< -90||p.x>camera.viewportWidth+50||p.y>camera.viewportHeight+30)continue
      ctx.save();ctx.translate(p.x,p.y);ctx.scale(z,z)
      ctx.fillStyle='rgba(19,33,24,.3)';ctx.beginPath();ctx.ellipse(0,2,13,4,0,0,Math.PI*2);ctx.fill()
      ctx.fillStyle=c.state==='following'?'#6fc6b5':'#dcb867';ctx.fillRect(-8,-29,16,23)
      ctx.fillStyle='#e7bc96';ctx.beginPath();ctx.arc(0,-37,10,0,Math.PI*2);ctx.fill()
      ctx.fillStyle='#51472b';ctx.fillRect(-9,-48,18,7)
      ctx.fillStyle=c.state==='following'?'#a4ffff':'#ffdf75';ctx.textAlign='center';ctx.font='bold 17px sans-serif';ctx.fillText(c.state==='following'?'✓':'!',0,-55)
      ctx.restore()
    }
    ctx.restore()
  }
  getSummary(){return {waiting:this.captives.filter(c=>c.state==='waiting').length,
    following:this.captives.filter(c=>c.state==='following').length,
    rescued:this.captives.filter(c=>c.state==='rescued').length,total:this.captives.length}}
  reset(){this.captives=[];this.byId.clear();this.serial=0;this.elapsed=0}
}
export default RescueSystem
