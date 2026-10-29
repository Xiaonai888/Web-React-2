/**
 * Shadow Realms — StageProgression (Step 42).
 * Session-local sequential stages; does not replace or reset WaveSystem.
 * Public stage copies prevent accidental mutation of the active campaign.
 */
export const DEFAULT_STAGES = Object.freeze([
  {id:'stage-1', title:'Village Under Siege', goals:{rescue:1, supply:2, defeat:3}},
  {id:'stage-2', title:'The River Road', goals:{rescue:2, supply:3, defeat:5}},
  {id:'stage-3', title:'The Final Stand', goals:{rescue:2, supply:4, defeat:8}},
]);
const finite = Number.isFinite;
const natural = n => Math.max(0, Math.floor(finite(n) ? n : 0));

export class StageProgression {
  constructor({stages = DEFAULT_STAGES, onEvent = null} = {}) {
    if (!Array.isArray(stages) || !stages.length) throw new TypeError('stages must be a nonempty array');
    const ids = new Set();
    this.stages = stages.map((item, index) => {
      if (!item || typeof item.id !== 'string' || !item.id.trim() || ids.has(item.id))
        throw new TypeError('Stage IDs must be unique nonempty strings');
      ids.add(item.id);
      const goals = item.goals || {};
      const safe = {
        rescue: natural(goals.rescue), supply: natural(goals.supply), defeat: natural(goals.defeat),
      };
      if (!Object.values(safe).some(Boolean))
        throw new TypeError('Every stage needs at least one actual objective');
      if (Object.values(safe).some(value => value > 100000))
        throw new RangeError('Stage objective exceeds the ObjectiveSystem limit');
      return {id:item.id, title:String(item.title || item.id), goals:safe,
        status:index === 0 ? 'unlocked' : 'locked'};
    });
    this.onEvent = typeof onEvent === 'function' ? onEvent : null;
    this.activeId = null;
    this.completed = new Set();
  }

  #copy(stage) { return stage ? {...stage, goals:{...stage.goals}} : null; }
  #emit(name, data) {
    try { this.onEvent?.(name, data); }
    catch (error) { console.warn('Shadow Realms stage observer:', name, error); }
  }
  getStages() { return this.stages.map(stage => this.#copy(stage)); }
  getStage(id) { return this.#copy(this.stages.find(stage => stage.id === id)); }
  getActive() { return this.getStage(this.activeId); }

  start(id) {
    const stage = this.stages.find(row => row.id === id);
    if (!stage) return {ok:false, reason:'unknown_stage'};
    if (this.activeId) return {ok:false, reason:'stage_in_progress'};
    if (stage.status !== 'unlocked') return {ok:false, reason:'locked_or_completed'};
    stage.status = 'active';
    this.activeId = id;
    const result = {ok:true, stage:this.#copy(stage)};
    this.#emit('started', {stage:this.#copy(stage)});
    return result;
  }

  finish(id, {objectivesComplete = false} = {}) {
    if (!id || this.activeId !== id) return {ok:false, reason:'not_active'};
    if (objectivesComplete !== true) return {ok:false, reason:'objectives_incomplete'};
    const stage = this.stages.find(row => row.id === id);
    stage.status = 'completed';
    this.activeId = null;
    this.completed.add(id);
    const next = this.stages[this.stages.indexOf(stage) + 1] || null;
    if (next?.status === 'locked') next.status = 'unlocked';
    const result = {ok:true, stage:this.#copy(stage), unlocked:next?.id || null,
      finished:!next};
    this.#emit('completed', {...result});
    return result;
  }

  abandon(id = this.activeId) {
    if (!id || this.activeId !== id) return false;
    const stage = this.stages.find(row => row.id === id);
    stage.status = 'unlocked';
    this.activeId = null;
    this.#emit('abandoned', {stage:this.#copy(stage)});
    return true;
  }
  nextUnlocked() { return this.getStages().find(row => row.status === 'unlocked') || null; }
  getSummary() { return {activeId:this.activeId, completed:this.completed.size,
    total:this.stages.length, stages:this.getStages(), finished:this.completed.size === this.stages.length}; }
  reset() {
    this.activeId = null;
    this.completed.clear();
    this.stages.forEach((stage, index) => {stage.status = index === 0 ? 'unlocked' : 'locked';});
  }
}
export default StageProgression;
