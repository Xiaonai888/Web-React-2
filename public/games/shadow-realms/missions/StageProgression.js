/** Shadow Realms — in-session stage unlocks; does not rewrite the existing wave system. */
export const DEFAULT_STAGES = Object.freeze([
  {id:'stage-1', title:'Village Under Siege', goals:{rescue:1, supply:2, defeat:3}},
  {id:'stage-2', title:'The River Road', goals:{rescue:2, supply:3, defeat:5}},
  {id:'stage-3', title:'The Final Stand', goals:{rescue:2, supply:4, defeat:8}},
])
const natural = n => Math.max(0, Math.floor(Number.isFinite(n) ? n : 0))

export class StageProgression {
  constructor({stages = DEFAULT_STAGES, onEvent = null} = {}) {
    if (!Array.isArray(stages) || !stages.length) throw new TypeError('stages must be a nonempty array')
    const ids = new Set()
    this.stages = stages.map((item,i)=>{
      if (!item?.id || typeof item.id !== 'string' || ids.has(item.id)) throw new TypeError('Stage IDs must be unique')
      ids.add(item.id)
      const goals = item.goals || {}
      const safe = {rescue:natural(goals.rescue),supply:natural(goals.supply),defeat:natural(goals.defeat)}
      if (!Object.values(safe).some(Boolean)) throw new TypeError('Every stage needs at least one actual objective')
      return {id:item.id,title:String(item.title||item.id),goals:safe,status:i===0?'unlocked':'locked'}
    })
    this.onEvent = onEvent
    this.activeId = null
    this.completed = new Set()
  }
  #copy(s) {return s ? {...s, goals:{...s.goals}} : null}
  getStages() {return this.stages.map(s=>this.#copy(s))}
  getStage(id) {return this.#copy(this.stages.find(s=>s.id===id))}
  getActive() {return this.getStage(this.activeId)}
  start(id) {
    const stage = this.stages.find(s=>s.id===id)
    if (!stage) return {ok:false,reason:'unknown_stage'}
    if (this.activeId) return {ok:false,reason:'stage_in_progress'}
    if (stage.status!=='unlocked') return {ok:false,reason:'locked_or_completed'}
    stage.status='active'; this.activeId=id
    this.onEvent?.('started', {stage:this.#copy(stage)})
    return {ok:true,stage:this.#copy(stage)}
  }
  finish(id,{objectivesComplete=false}={}) {
    if (!id || this.activeId!==id) return {ok:false,reason:'not_active'}
    if (objectivesComplete!==true) return {ok:false,reason:'objectives_incomplete'}
    const stage = this.stages.find(s=>s.id===id)
    stage.status='completed';this.activeId=null;this.completed.add(id)
    const index=this.stages.indexOf(stage)
    const next=this.stages[index+1]
    if(next && next.status==='locked')next.status='unlocked'
    this.onEvent?.('completed',{stage:this.#copy(stage),unlocked:next?.id||null,finished:!next})
    return {ok:true,stage:this.#copy(stage),unlocked:next?.id||null,finished:!next}
  }
  abandon(id=this.activeId) {
    if (!id || this.activeId!==id) return false
    const stage=this.stages.find(s=>s.id===id)
    stage.status='unlocked';this.activeId=null
    this.onEvent?.('abandoned',{stage:this.#copy(stage)})
    return true
  }
  nextUnlocked() {return this.getStages().find(s=>s.status==='unlocked')||null}
  getSummary() {return {activeId:this.activeId,completed:this.completed.size,total:this.stages.length,
    stages:this.getStages(),finished:this.completed.size===this.stages.length}}
  reset() {
    this.activeId=null;this.completed.clear()
    this.stages.forEach((s,i)=>{s.status=i===0?'unlocked':'locked'})
  }
}
export default StageProgression
