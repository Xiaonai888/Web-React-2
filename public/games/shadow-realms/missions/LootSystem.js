/** Shadow Realms — breakable caches and collectable drops.
 * Rewards are credited ONLY after a supplied economy adapter acknowledges them.
 */
const finite=Number.isFinite
const point=p=>finite(p?.x)&&finite(p?.y)
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y)
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n))
const bounded=(n,fallback,low,high)=>clamp(finite(n)?n:fallback,low,high)
const rewardOf=r=>({rice:Math.floor(bounded(r?.rice,0,0,1000000)),wood:Math.floor(bounded(r?.wood,0,0,1000000))})

export class LootSystem {
  constructor({map,grantReward=null,onEvent=null,maxCaches=40,collectRange=65,breakRange=75}={}) {
    if(!map||typeof map.isWalkable!=='function')throw new TypeError('LootSystem requires WorldMap')
    this.map=map;this.grantReward=typeof grantReward==='function'?grantReward:null
    this.onEvent=typeof onEvent==='function'?onEvent:null
    this.maxCaches=Math.floor(bounded(maxCaches,40,1,1000))
    this.collectRange=bounded(collectRange,65,10,500);this.breakRange=bounded(breakRange,75,10,500)
    this.caches=[];this.drops=[];this.byId=new Map();this.nextId=1;this.time=0
  }
  #emit(name,data){try{this.onEvent?.(name,data)}catch{/* Observer errors must not change loot state. */}}
  #id(prefix){let key;do{key=`${prefix}-${this.nextId++}`}while(this.byId.has(key));return key}
  spawn({id=null,x,y,hp=35,type='cache',reward={rice:10,wood:15}}={}) {
    if(!point({x,y})||!this.map.isWalkable(x,y,12))return {ok:false,reason:'blocked'}
    if(this.caches.length>=this.maxCaches)return {ok:false,reason:'limit'}
    if(this.caches.some(c=>c.state==='intact'&&dist(c,{x,y})<42))return {ok:false,reason:'overlap'}
    const key=id==null?this.#id('cache'):String(id)
    if(!key||this.byId.has(key))return {ok:false,reason:'duplicate_id'}
    const cache={id:key,x,y,hp:Math.floor(bounded(hp,35,1,5000)),maxHp:Math.floor(bounded(hp,35,1,5000)),
      type:String(type),reward:rewardOf(reward),state:'intact'}
    this.caches.push(cache);this.byId.set(key,cache)
    this.#emit('cache_spawned',{cache})
    return {ok:true,cache}
  }
  #isPlayer(unit) {return unit?.team==='blue'&&unit.alive!==false&&finite(unit.hp)&&unit.hp>0&&point(unit)}
  damage(cacheId,damage,{actor=null}={}) {
    const cache=this.byId.get(cacheId)
    if(!cache||cache.state!=='intact')return {ok:false,reason:'not_intact'}
    if(!finite(damage)||damage<=0)return {ok:false,reason:'invalid_damage'}
    if(actor && (!this.#isPlayer(actor)||dist(actor,cache)>this.breakRange))return {ok:false,reason:'out_of_range'}
    const dealt=Math.min(cache.hp,Math.max(1,Math.floor(damage)))
    cache.hp-=dealt
    if(cache.hp>0){
      this.#emit('cache_damaged',{cache,actor,damage:dealt})
      return {ok:true,broken:false,remaining:cache.hp}
    }
    cache.state='broken'
    const drop={id:this.#id('drop'),sourceId:cache.id,x:cache.x,y:cache.y,
      reward:{...cache.reward},state:'ground',createdAt:this.time}
    this.drops.push(drop);this.byId.set(drop.id,drop)
    this.#emit('cache_damaged',{cache,actor,damage:dealt})
    this.#emit('cache_broken',{cache,drop,actor})
    return {ok:true,broken:true,drop}
  }
  collect(dropId,actor) {
    const drop=this.byId.get(dropId)
    if(!drop||drop.state!=='ground')return {ok:false,reason:'missing_drop'}
    if(!this.#isPlayer(actor))return {ok:false,reason:'invalid_collector'}
    if(dist(drop,actor)>this.collectRange)return {ok:false,reason:'too_far'}
    if(typeof this.grantReward!=='function')return {ok:false,reason:'missing_reward_adapter'}
    drop.state='collecting'
    let accepted=false
    try{accepted=this.grantReward({...drop.reward},{drop,actor})===true}
    catch(error){drop.state='ground';return {ok:false,reason:'reward_failed',error}}
    if(!accepted){drop.state='ground';return {ok:false,reason:'reward_rejected'}}
    drop.state='collected'
    this.#emit('collected',{drop,actor,reward:{...drop.reward}})
    return {ok:true,reward:{...drop.reward},drop}
  }
  interact(actor,position,{damage=20}={}) {
    if(!this.#isPlayer(actor)||!point(position))return {ok:false,reason:'invalid_interaction'}
    const drop=this.getNearestDrop(position,{maxDistance:this.collectRange})
    if(drop&&dist(drop,actor)<=this.collectRange)return this.collect(drop.id,actor)
    const cache=this.getNearestCache(position,{maxDistance:this.breakRange})
    if(cache&&dist(cache,actor)<=this.breakRange)return this.damage(cache.id,damage,{actor})
    if(drop||cache)return {ok:false,reason:'too_far'}
    return {ok:false,reason:'no_object'}
  }
  getNearestCache(position,{maxDistance=75}={}) {
    if(!point(position))return null
    let best=bounded(maxDistance,75,0,5000),chosen=null
    for(const c of this.caches){if(c.state!=='intact')continue;const d=dist(c,position)
      if(d<best){best=d;chosen=c}}
    return chosen
  }
  getNearestDrop(position,{maxDistance=65}={}) {
    if(!point(position))return null
    let best=bounded(maxDistance,65,0,5000),chosen=null
    for(const d of this.drops){if(d.state!=='ground')continue;const n=dist(d,position)
      if(n<best){best=n;chosen=d}}
    return chosen
  }
  getCaches({includeBroken=false}={}) {return this.caches.filter(c=>includeBroken||c.state==='intact')}
  getDrops({includeCollected=false}={}) {return this.drops.filter(d=>includeCollected||d.state==='ground')}
  update(dt) {if(finite(dt)&&dt>0)this.time+=Math.min(dt,.1)}
  draw(ctx,camera) {
    if(!ctx||!camera)return
    ctx.save()
    for(const c of this.caches){
      if(c.state!=='intact')continue
      const p=camera.worldToScreen(c.x,c.y),z=clamp(camera.zoom,.5,2)
      if(p.x< -60||p.y< -80||p.x>camera.viewportWidth+60||p.y>camera.viewportHeight+30)continue
      ctx.save();ctx.translate(p.x,p.y);ctx.scale(z,z)
      ctx.fillStyle='#372d1c';ctx.beginPath();ctx.ellipse(0,2,20,6,0,0,Math.PI*2);ctx.fill()
      ctx.fillStyle='#855931';ctx.fillRect(-16,-28,32,26)
      ctx.fillStyle='#c58e4f';ctx.fillRect(-16,-30,32,7)
      ctx.fillStyle='#50412c';ctx.fillRect(-3,-28,6,26)
      ctx.fillStyle='#f5d27a';ctx.textAlign='center';ctx.font='bold 11px sans-serif';ctx.fillText('SUPPLY',0,-37)
      const fraction=c.hp/c.maxHp
      if(fraction<1){ctx.fillStyle='#332c2a';ctx.fillRect(-16,-42,32,4);ctx.fillStyle='#dbaa62';ctx.fillRect(-16,-42,32*fraction,4)}
      ctx.restore()
    }
    for(const d of this.drops){
      if(d.state!=='ground')continue
      const p=camera.worldToScreen(d.x,d.y),z=clamp(camera.zoom,.5,2),bob=Math.sin(this.time*3+d.x)*3
      ctx.save();ctx.translate(p.x,p.y+bob-17*z);ctx.scale(z,z)
      ctx.fillStyle='#ffe9a6';ctx.strokeStyle='#725a2c';ctx.lineWidth=2
      ctx.beginPath();ctx.moveTo(0,-10);ctx.lineTo(11,0);ctx.lineTo(0,10);ctx.lineTo(-11,0);ctx.closePath();ctx.fill();ctx.stroke()
      ctx.restore()
    }
    ctx.restore()
  }
  getSummary(){return {intact:this.getCaches().length,broken:this.caches.filter(c=>c.state==='broken').length,
    ground:this.getDrops().length,collected:this.drops.filter(d=>d.state==='collected').length}}
  reset(){this.caches=[];this.drops=[];this.byId.clear();this.nextId=1;this.time=0}
}
export default LootSystem
