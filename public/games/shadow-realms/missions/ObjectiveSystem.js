/**
 * Shadow Realms — ObjectiveSystem (Step 42).
 * One mission's required/optional objectives, duplicate-safe event tokens, and
 * immutable public snapshots. Keeps the original MissionDirector API intact.
 */
const finite = Number.isFinite;
const countOf = n => Math.max(0, Math.floor(finite(n) ? n : 0));

export class ObjectiveSystem {
  constructor({onEvent = null, onChange = null} = {}) {
    this.onEvent = typeof onEvent === 'function' ? onEvent : null;
    this.onChange = typeof onChange === 'function' ? onChange : null;
    this.missionId = null;
    this.entries = new Map();
    this.tokens = new Map();
  }

  load(definitions, {missionId = null} = {}) {
    if (!Array.isArray(definitions)) throw new TypeError('Objective definitions must be an array');
    const next = new Map();
    for (const value of definitions) {
      if (!value || typeof value.id !== 'string' || !value.id.trim() || next.has(value.id))
        throw new TypeError('Objective IDs must be unique nonempty strings');
      const target = countOf(value.target ?? 1);
      if (target < 1 || target > 100000) throw new RangeError('Objective target must be 1..100000');
      next.set(value.id, {
        id: value.id, title: String(value.title || value.id), target,
        count: 0, optional: Boolean(value.optional), completed: false,
      });
    }
    // Validate EVERYTHING before replacing the previous mission ledger.
    this.entries = next;
    this.tokens.clear();
    this.missionId = missionId;
    this.#notify('loaded', {missionId, objectives: this.getAll()});
    return this.getAll();
  }

  #snapshot(entry) { return entry ? {...entry} : null; }
  #notify(event, data) {
    // A visual/UI subscriber must never corrupt a committed objective.
    try { this.onEvent?.(event, data); }
    catch (error) { console.warn('Shadow Realms objective observer:', event, error); }
    try { this.onChange?.(this.getSummary()); }
    catch (error) { console.warn('Shadow Realms objective change observer:', error); }
  }
  get(id) { return this.#snapshot(this.entries.get(id)); }
  getAll() { return [...this.entries.values()].map(entry => this.#snapshot(entry)); }

  progress(id, increment = 1, {token = null} = {}) {
    const entry = this.entries.get(id);
    if (!entry) return {ok:false, reason:'unknown_objective'};
    const n = countOf(increment);
    if (entry.completed || n <= 0) return {ok:false, reason:'unchanged'};
    if (token != null) {
      const key = String(token);
      const seen = this.tokens.get(id) || new Set();
      if (seen.has(key)) return {ok:false, reason:'duplicate'};
      // A token is consumed only when progress is actually accepted.
      seen.add(key);
      this.tokens.set(id, seen);
    }
    const previous = entry.count;
    entry.count = Math.min(entry.target, previous + n);
    entry.completed = entry.count >= entry.target;
    const objective = this.#snapshot(entry);
    const result = {ok:true, objective, added:entry.count - previous};
    // All state is committed BEFORE events; reentrant calls cannot double-count.
    this.#notify('progress', {missionId:this.missionId, objective, added:result.added});
    if (entry.completed) this.#notify('completed', {missionId:this.missionId, objective});
    return result;
  }

  set(id, count) {
    const entry = this.entries.get(id);
    if (!entry || !finite(count) || count < entry.count)
      return {ok:false, reason:'invalid_progress'};
    return this.progress(id, count - entry.count);
  }
  complete(id, {token = null} = {}) {
    const entry = this.entries.get(id);
    return entry ? this.progress(id, entry.target - entry.count, {token})
      : {ok:false, reason:'unknown_objective'};
  }

  allRequiredComplete() {
    const required = [...this.entries.values()].filter(entry => !entry.optional);
    // An empty mission is NOT a completed mission.
    return required.length > 0 && required.every(entry => entry.completed);
  }
  getSummary() {
    const objectives = this.getAll();
    const required = objectives.filter(entry => !entry.optional);
    const completed = required.filter(entry => entry.completed).length;
    return {missionId:this.missionId, objectives,
      required:required.length, completed,
      complete:required.length > 0 && completed === required.length};
  }
  reset() { this.entries.clear(); this.tokens.clear(); this.missionId = null; }
}
export default ObjectiveSystem;
