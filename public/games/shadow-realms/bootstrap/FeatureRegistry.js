/**
 * Shadow Realms — dependency-aware, lifecycle-safe feature loader.
 * Feature contract:
 *   { id:'fog', dependsOn:['runtime-clock'], load:()=>import('../new/Fog.js') }
 * The imported module must export createFeature(scope, dependencies), or default
 * as a factory. The factory returns { start?, update?, render?, onPointer?, dispose? }.
 * Existing GameEngine callbacks remain owned by the page, never duplicated here.
 */

const validId = id => typeof id === 'string' && /^[a-zA-Z][\w.:-]*$/.test(id);

export class FeatureRegistry {
  constructor({ context, onError = null } = {}) {
    if (!context || typeof context.scope !== 'function') throw new TypeError('FeatureRegistry requires GameContext');
    this.context = context;
    this.onError = typeof onError === 'function' ? onError : null;
    this.definitions = new Map();
    this.active = new Map();
    this.order = [];
    this.started = false;
    this.startPromise = null;
    this.destroyed = false;
    this.failures = new Map();
  }

  register(definition) {
    if (this.started || this.startPromise || this.destroyed) throw new Error('Register features before starting');
    if (!definition || !validId(definition.id) || this.definitions.has(definition.id)) throw new Error('Invalid/duplicate feature id');
    if (typeof definition.create !== 'function' && typeof definition.load !== 'function') {
      throw new TypeError(`Feature ${definition.id} must provide create() or load()`);
    }
    const deps = definition.dependsOn || [];
    if (!Array.isArray(deps) || deps.some(d => !validId(d)) || new Set(deps).size !== deps.length) {
      throw new TypeError('dependsOn must contain unique feature IDs');
    }
    this.definitions.set(definition.id, Object.freeze({
      ...definition, dependsOn: Object.freeze([...deps]), enabled: definition.enabled !== false,
    }));
    return this;
  }

  registerAll(definitions = []) {
    for (const def of definitions) this.register(def);
    return this;
  }

  #plan() {
    const sorted = [], visiting = new Set(), visited = new Set();
    const visit = id => {
      if (visited.has(id)) return;
      if (visiting.has(id)) throw new Error('Circular feature dependency at ' + id);
      const definition = this.definitions.get(id);
      if (!definition?.enabled) throw new Error('Missing/disabled dependency: ' + id);
      visiting.add(id);
      for (const dep of definition.dependsOn) visit(dep);
      visiting.delete(id);
      visited.add(id);
      sorted.push(id);
    };
    for (const [id, def] of this.definitions) if (def.enabled) visit(id);
    return sorted;
  }

  #report(error, phase, id = null) {
    const payload = { error, phase, id };
    try { this.onError?.(error, payload); } catch { /* Non-throwing reporter. */ }
    try { this.context.events.emit('feature:error', payload); } catch { /* Non-throwing emitter. */ }
  }

  async start() {
    if (this.destroyed) throw new Error('FeatureRegistry is destroyed');
    if (this.started) return this;
    if (this.startPromise) return this.startPromise;
    this.startPromise = this.#initialize();
    try { return await this.startPromise; }
    finally { this.startPromise = null; }
  }

  async #initialize() {
    const plan = this.#plan();
    try {
      for (const id of plan) {
        const def = this.definitions.get(id);
        const scope = this.context.scope(id);
        let feature = null;
        try {
          const deps = Object.fromEntries(def.dependsOn.map(dep => [dep, this.active.get(dep)?.feature]));
          let factory = def.create;
          if (!factory) {
            const mod = await def.load();
            factory = def.exportName ? mod?.[def.exportName] : (mod?.createFeature || mod?.default);
          }
          if (typeof factory !== 'function') throw new TypeError(`Feature ${id} does not export a factory`);
          feature = await factory(scope, deps);
          if (!feature || typeof feature !== 'object') throw new TypeError(`Feature ${id} factory must return an object`);
          if (typeof feature.start === 'function') await feature.start();
          this.active.set(id, { feature, scope, failed: false });
          this.order.push(id);
          this.context.events.emit('feature:ready', { id });
        } catch (error) {
          try { await feature?.dispose?.(); } catch (cleanupError) { this.#report(cleanupError, 'dispose', id); }
          scope.cleanup();
          throw Object.assign(new Error(`Failed to initialize ${id}: ${error.message}`), { cause: error });
        }
      }
      this.started = true;
      this.context.events.emit('features:ready', { count: this.order.length });
      return this;
    } catch (error) {
      this.#report(error, 'start');
      await this.#stop();
      throw error;
    }
  }

  #run(method, args, { stopOnTrue = false } = {}) {
    if (!this.started || this.destroyed) return stopOnTrue ? false : 0;
    let count = 0;
    for (const id of this.order) {
      const row = this.active.get(id);
      if (!row || row.failed) continue;
      const fn = row.feature?.[method];
      if (typeof fn !== 'function') continue;
      try {
        const result = fn.apply(row.feature, args);
        count++;
        if (stopOnTrue && result === true) return true;
      } catch (error) {
        row.failed = true;
        this.failures.set(id, error);
        this.#report(error, method, id);
      }
    }
    return stopOnTrue ? false : count;
  }

  update(dt) { return Number.isFinite(dt) && dt > 0 ? this.#run('update', [Math.min(0.1, dt)]) : 0; }
  render(ctx, camera) { return this.#run('render', [ctx, camera]); }
  onPointer(event) { return this.#run('onPointer', [event], { stopOnTrue: true }); }
  get(id) { return this.active.get(id)?.feature ?? null; }
  has(id) { return this.active.has(id); }
  getSummary() { return { started: this.started, registered: this.definitions.size, active: this.active.size,
    failed: [...this.failures.keys()], order: [...this.order] }; }

  async #stop() {
    for (const id of [...this.order].reverse()) {
      const { feature, scope } = this.active.get(id);
      try { await feature.dispose?.(); } catch (error) { this.#report(error, 'dispose', id); }
      scope.cleanup();
    }
    this.active.clear();
    this.order = [];
    this.started = false;
  }

  async stop() {
    if (this.startPromise) await this.startPromise.catch(() => {});
    await this.#stop();
    return this;
  }

  async destroy() {
    if (this.destroyed) return;
    await this.stop();
    this.destroyed = true;
    this.definitions.clear();
    this.failures.clear();
  }
}

export default FeatureRegistry;
