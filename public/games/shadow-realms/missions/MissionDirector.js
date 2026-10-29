/** Shadow Realms — stage objectives, rescues and breakable supply missions.
 * Pure browser module, works alongside existing combat, farming & WaveSystem.
 * Integration, in ONE future index.html edit:
 *   const missions = new MissionDirector({map,navigation:route,
 *     getUnits:()=>farmers,construction,rice,home})
 *   missions.startStage('stage-1')
 *   // Existing HealthSystem onEvent: missions.onHealthEvent(event,data)
 *   // Update: missions.update(dt); Render: missions.draw(ctx,camera)
 *   // On tap use missions.interact(farmer,worldPosition). Supply caches take
 *   // repeated taps when close, then a pickup. Escort civilians to home.
 *   // After stage completion: missions.startNextStage() (explicit player action).
 */
import {ObjectiveSystem} from './ObjectiveSystem.js'
import {RescueSystem} from './RescueSystem.js'
import {LootSystem} from './LootSystem.js'
import {StageProgression,DEFAULT_STAGES} from './StageProgression.js'

const finite=Number.isFinite
const point=p=>finite(p?.x)&&finite(p?.y)
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y)

export class MissionDirector {
  constructor({map,navigation=null,getUnits=()=>[],home=null,rice=null,construction=null,
    stages=DEFAULT_STAGES,grantReward=null,onEvent=null}={}) {
    if(!map||typeof map.isWalkable!=='function')throw new TypeError('MissionDirector requires WorldMap')
    this.map=map;this.navigation=navigation
    this.getUnits=typeof getUnits==='function'?getUnits:()=>getUnits
    this.home=point(home)?{...home}:map.getSpawnPoint('blue')
    this.rice=rice;this.construction=construction;this.onEvent=onEvent
    this.objectives=new ObjectiveSystem({onEvent:(name,data)=>this.#emit(`objective_${name}`,data)})
    this.progression=new StageProgression({stages,onEvent:(name,data)=>this.#emit(`stage_${name}`,data)})
    this.rescues=new RescueSystem({map,navigation,home:this.home,getUnits:this.getUnits,
      onEvent:(name,data)=>this.#onRescue(name,data)})
    this.loot=new LootSystem({map,grantReward:grantReward||((r)=>this.#grant(r)),
      onEvent:(name,data)=>this.#onLoot(name,data)})
    this.defeatedIds=new Set();this.elapsed=0;this.rewardBusy=false
  }
  #emit(name, data) {
    try { this.onEvent?.(name, data); }
    catch (error) { console.warn('Shadow Realms mission event failed:', name, error); }
  }
  #grant(reward) {
    if (this.rewardBusy) return false;
    const rice=reward?.rice??0,wood=reward?.wood??0;
    if (!Number.isSafeInteger(rice) || !Number.isSafeInteger(wood) ||
        rice<0 || wood<0) return false;
    if (rice && (typeof this.rice?.getResources!=='function' ||
        typeof this.rice?.setStorageRice!=='function')) return false;
    if (wood && (typeof this.construction?.getResources!=='function' ||
        typeof this.construction?.addWood!=='function' ||
        typeof this.construction?.setWood!=='function')) return false;
    const oldRice=rice ? this.rice.getResources().rice : 0;
    const oldWood=wood ? this.construction.getResources().wood : 0;
    if ((rice && (!Number.isSafeInteger(oldRice) ||
        !Number.isSafeInteger(oldRice+rice))) ||
        (wood && (!Number.isSafeInteger(oldWood) ||
        !Number.isSafeInteger(oldWood+wood)))) return false;
    this.rewardBusy=true;
    try {
      let accepted=true;
      try {
        if (rice) accepted=this.rice.setStorageRice(oldRice+rice)===true;
        if (accepted && wood) accepted=this.construction.addWood(wood)===true;
      } catch { accepted=false; }
      if (accepted) return true;
      // Compensate BOTH shared ledgers if a callback failed after mutating.
      try { if (rice) this.rice.setStorageRice(oldRice); } catch { /* rollback best effort */ }
      try { if (wood) this.construction.setWood(oldWood); } catch { /* rollback best effort */ }
      return false;
    } finally { this.rewardBusy=false; }
  }
  #onRescue(name,data) {
    if(name==='rescued'&&this.progression.activeId) {
      this.objectives.progress('rescue',1,{token:data.captive.id})
    }
    this.#emit(`rescue_${name}`,data)
  }
  #onLoot(name,data) {
    if(name==='collected'&&this.progression.activeId){
      this.objectives.progress('supply',1,{token:data.drop.id})
    }
    this.#emit(`loot_${name}`,data)
  }
  onHealthEvent(name,data={}) {
    if(name!=='death'||!this.progression.activeId)return false
    const unit=data.unit
    if(!unit||unit.team!=='red'||unit.id==null||this.defeatedIds.has(unit.id))return false
    this.defeatedIds.add(unit.id)
    return this.objectives.progress('defeat',1,{token:unit.id}).ok
  }
  /** Finds real traversable spaces; avoids active rice fields, existing sites and entities. */
  #findSpot(index,kind) {
    const map=this.map,base=this.home
    const sx=kind==='rescue'?235:320,sy=kind==='rescue'?180:-165
    const target={x:base.x+sx+(index%3)*82,y:base.y+sy+Math.floor(index/3)*94}
    for(let radius=0;radius<=400;radius+=32){
      const count=radius?24:1
      for(let i=0;i<count;i++){
        const a=i*2*Math.PI/count
        const x=target.x+Math.cos(a)*radius,y=target.y+Math.sin(a)*radius
        if(!map.isWalkable(x,y,22))continue
        if(distance({x,y},base)<120)continue
        const terrain=map.getTerrainAt?.(x,y)
        if(terrain==='water'||terrain==='bridge'||terrain==='void')continue
        if(this.rice?.getFields?.().some(f=>distance({x,y},f)<100))continue
        if(this.rescues.getCaptives().some(c=>distance({x,y},c)<70))continue
        if(this.loot.getCaches().some(c=>distance({x,y},c)<70))continue
        return {x,y}
      }
    }
    return null
  }
  startStage(id) {
    if(this.progression.activeId)return {ok:false,reason:'stage_in_progress'}
    const stage=this.progression.getStage(id)
    if(!stage||stage.status!=='unlocked')return {ok:false,reason:'locked_or_completed'}
    this.rescues.reset();this.loot.reset();this.defeatedIds.clear()
    const entries=[]
    if(stage.goals.rescue)entries.push({id:'rescue',title:'Escort villagers to base',target:stage.goals.rescue})
    if(stage.goals.supply)entries.push({id:'supply',title:'Recover broken supply caches',target:stage.goals.supply})
    if(stage.goals.defeat)entries.push({id:'defeat',title:'Defeat hostile raiders',target:stage.goals.defeat})
    this.objectives.load(entries,{missionId:stage.id})
    for(let i=0;i<stage.goals.rescue;i++){
      const p=this.#findSpot(i,'rescue')
      if(!p||!this.rescues.spawn({id:`${id}-villager-${i+1}`,...p}).ok)return this.#rollback('no_rescue_space')
    }
    for(let i=0;i<stage.goals.supply;i++){
      const p=this.#findSpot(i,'supply')
      if(!p||!this.loot.spawn({id:`${id}-cache-${i+1}`,...p,
        hp:35+i*7,reward:{rice:10+i*2,wood:15+i*3}}).ok)return this.#rollback('no_cache_space')
    }
    const result=this.progression.start(id)
    if(!result.ok)return this.#rollback(result.reason)
    this.#emit('mission_started',{stage,summary:this.getSummary()})
    return {ok:true,stage}
  }
  #rollback(reason){this.rescues.reset();this.loot.reset();this.objectives.reset();this.defeatedIds.clear();return {ok:false,reason}}
  startNextStage(){const stage=this.progression.nextUnlocked();return stage?this.startStage(stage.id):{ok:false,reason:'no_unlocked_stage'}}
  /** One direct interaction — no automatic looting or teleport-rescue. */
  interact(unit,position,{damage=20}={}) {
    if(!this.progression.activeId)return {ok:false,reason:'no_active_mission'}
    if(!unit||unit.team!=='blue'||unit.alive===false||!point(position))return {ok:false,reason:'invalid_unit'}
    const villager=this.rescues.getNearest(position,{maxDistance:55})
    if(villager&&distance(unit,villager)<=this.rescues.pickupRange){
      return this.rescues.assignEscort(villager.id,unit)
    }
    return this.loot.interact(unit,position,{damage})
  }
  update(dt) {
    if(!finite(dt)||dt<=0)return
    this.elapsed+=Math.min(.1,dt)
    if(!this.progression.activeId)return
    this.rescues.update(dt);this.loot.update(dt)
    if(!this.objectives.allRequiredComplete())return
    const id=this.progression.activeId
    const result=this.progression.finish(id,{objectivesComplete:this.objectives.getSummary().complete})
    if(result.ok)this.#emit('mission_completed',{...result,summary:this.getSummary()})
  }
  draw(ctx,camera){if(!this.progression.activeId)return;this.loot.draw(ctx,camera);this.rescues.draw(ctx,camera)}
  getSummary(){return {stage:this.progression.getActive(),stages:this.progression.getSummary(),
    objectives:this.objectives.getSummary(),rescue:this.rescues.getSummary(),loot:this.loot.getSummary()}}
  reset(){this.rescues.reset();this.loot.reset();this.objectives.reset();this.progression.reset();this.defeatedIds.clear();this.elapsed=0}
  destroy(){this.reset();this.onEvent=null}
}
export default MissionDirector
