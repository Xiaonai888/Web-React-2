/** Shadow Realms — objective ledger. All counters are local and idempotent. */
const valid = n => Number.isFinite(n)
const amount = n => Math.max(0, Math.floor(valid(n) ? n : 0))

export class ObjectiveSystem {
  constructor({onEvent = null, onChange = null} = {}) {
    this.onEvent = onEvent
    this.onChange = onChange
    this.missionId = null
    this.entries = new Map()
    this.tokens = new Map()
  }

  load(definitions, {missionId = null} = {}) {
    if (!Array.isArray(definitions)) throw new TypeError('Objective definitions must be an array')
    const next = new Map()
    for (const value of definitions) {
      if (!value || typeof value.id !== 'string' || !value.id.trim() || next.has(value.id)) {
        throw new TypeError('Objective IDs must be unique nonempty strings')
      }
      const target = amount(value.target ?? 1)
      if (target <= 0 || target > 100000) throw new RangeError('Objective target must be 1..100000')
      next.set(value.id, {
        id: value.id, title: String(value.title || value.id),
        target, count: 0, optional: Boolean(value.optional), completed: false,
      })
    }
    this.entries = next
    this.tokens = new Map()
    this.missionId = missionId
    this.#notify('loaded', {missionId, objectives: this.getAll()})
    return this.getAll()
  }

  #snapshot(entry) { return entry ? {...entry} : null }
  #notify(event, data) {
    this.onEvent?.(event, data)
    this.onChange?.(this.getSummary())
  }
  get(id) { return this.#snapshot(this.entries.get(id)) }
  getAll() { return [...this.entries.values()].map(e => this.#snapshot(e)) }

  progress(id, increment = 1, {token = null} = {}) {
    const entry = this.entries.get(id)
    const n = amount(increment)
    if (!entry || entry.completed || n === 0) return {ok:false, reason:entry?'unchanged':'unknown_objective'}
    if (token != null) {
      const name = String(token)
      const used = this.tokens.get(id) || new Set()
      if (used.has(name)) return {ok:false, reason:'duplicate'}
      used.add(name)
      this.tokens.set(id, used)
    }
    const before = entry.count
    entry.count = Math.min(entry.target, before + n)
    if (entry.count === entry.target) entry.completed = true
    const objective = this.#snapshot(entry)
    this.#notify('progress', {missionId:this.missionId, objective, added:entry.count-before})
    if (entry.completed) this.#notify('completed', {missionId:this.missionId, objective})
    return {ok:true, objective, added:entry.count-before}
  }

  set(id, count) {
    const entry = this.entries.get(id)
    if (!entry || !valid(count) || count < entry.count) return {ok:false, reason:'invalid_progress'}
    return this.progress(id, count-entry.count)
  }
  complete(id, {token = null} = {}) {
    const entry = this.entries.get(id)
    return entry ? this.progress(id, entry.target-entry.count, {token}) : {ok:false, reason:'unknown_objective'}
  }
  allRequiredComplete() {
    return [...this.entries.values()].filter(e=>!e.optional).every(e=>e.completed)
  }
  getSummary() {
    const all = this.getAll()
    const required = all.filter(e=>!e.optional)
    return {missionId:this.missionId, objectives:all, required:required.length,
      completed:required.filter(e=>e.completed).length,
      complete:required.length > 0 && required.every(e=>e.completed)}
  }
  reset() { this.entries.clear(); this.tokens.clear(); this.missionId = null }
}
export default ObjectiveSystem
