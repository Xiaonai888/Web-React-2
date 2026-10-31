/** Dependency-ordered game features with isolated errors and complete cleanup. */
const validId = id => typeof id === 'string' && /^[a-zA-Z][\w.:-]*$/.test(id);

export class FeatureRegistry {
  constructor({ context, onError = null } = {}) {
    if (!context || typeof context.scope !== 'function') {
      throw new TypeError('FeatureRegistry requires GameContext');
    }
    this.context = context;
    this.onError = typeof onError === 'function' ? onError : null;
    this.definitions = new Map();
    this.active = new Map();
    this.order = [];
    this.started = false;
    this.startPromise = null;
    this.stopPromise = null;
    this.destroyed = false;
    this.failures = new Map();
  }

  register(definition) {
    if (this.started || this.startPromise || this.stopPromise || this.destroyed) {
      throw new Error('Register features before starting');
    }
    if (!definition || !validId(definition.id) || this.definitions.has(definition.id)) {
      throw new Error('Invalid/duplicate feature id');
    }
    if (typeof definition.create !== 'function' && typeof definition.load !== 'function') {
      throw new TypeError(`Feature ${definition.id} must provide create() or load()`);
    }
    const deps = definition.dependsOn || [];
    if (!Array.isArray(deps) || deps.some(dep => !validId(dep)) ||
        new Set(deps).size !== deps.length) {
      throw new TypeError('dependsOn must contain unique feature IDs');
    }
    this.definitions.set(definition.id, Object.freeze({
      ...definition, dependsOn: Object.freeze([...deps]), enabled: definition.enabled !== false,
    }));
    return this;
  }

  registerAll(definitions = []) {
    const added = [];
    try {
      for (const definition of definitions) {
        this.register(definition);
        added.push(definition.id);
      }
      return this;
    } catch (error) {
      // Invalid manifests should never leave half of their IDs registered.
      for (const id of added) this.definitions.delete(id);
      throw error;
    }
  }

  #plan() {
    const sorted = [], visiting = new Set(), visited = new Set();
    const visit = id => {
      if (visited.has(id)) return;
      if (visiting.has(id)) throw new Error('Circular feature dependency at ' + id);
      const definition = this.definitions.get(id);
      if (!definition?.enabled) throw new Error('Missing/disabled dependency: ' + id);
      visiting.add(id);
      for (const dependency of definition.dependsOn) visit(dependency);
      visiting.delete(id);
      visited.add(id);
      sorted.push(id);
    };
    for (const [id, definition] of this.definitions) if (definition.enabled) visit(id);
    return sorted;
  }

  #report(error, phase, id = null) {
    const detail = { error, phase, id };
    try { this.onError?.(error, detail); }
    catch { /* Reporters must never interrupt the cleanup path. */ }
    try { this.context.events.emit('feature:error', detail); }
    catch { /* Event listeners must never interrupt cleanup. */ }
  }

  async start() {
    if (this.destroyed) throw new Error('FeatureRegistry is destroyed');
    if (this.started) return this;
    if (this.startPromise) return this.startPromise;
    if (this.stopPromise) await this.stopPromise;
    // A second start() may have been waiting on the same stop promise.
    if (this.started) return this;
    if (this.startPromise) return this.startPromise;
    this.startPromise = this.#initialize();
    try { return await this.startPromise; }
    finally { this.startPromise = null; }
  }

  async #initialize() {
    try {
      this.failures.clear();
      const plan = this.#plan();
      for (const id of plan) {
        const definition = this.definitions.get(id);
        const scope = this.context.scope(id);
        let feature = null;
        try {
          const deps = Object.fromEntries(definition.dependsOn.map(dep =>
            [dep, this.active.get(dep)?.feature]));
          let factory = definition.create;
          if (!factory) {
            const mod = await definition.load();
            factory = definition.exportName ? mod?.[definition.exportName] :
              (mod?.createFeature || mod?.default);
          }
          if (typeof factory !== 'function') {
            throw new TypeError(`Feature ${id} does not export a factory`);
          }
          feature = await factory(scope, deps);
          if (!feature || typeof feature !== 'object') {
            throw new TypeError(`Feature ${id} factory must return an object`);
          }
          if (typeof feature.start === 'function') await feature.start();
          this.active.set(id, { feature, scope, failed: false });
          this.order.push(id);
          this.context.events.emit('feature:ready', { id });
        } catch (error) {
          if (this.active.get(id)?.feature === feature) {
            this.active.delete(id);
            this.order = this.order.filter(item => item !== id);
          }
          try { await feature?.dispose?.(); }
          catch (cleanupError) { this.#report(cleanupError, 'dispose', id); }
          try { scope.cleanup(); }
          catch (cleanupError) { this.#report(cleanupError, 'cleanup', id); }
          this.failures.set(id, error);
          throw Object.assign(new Error(`Failed to initialize ${id}: ${error.message}`),
            { cause: error });
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

  #fail(id, row, method, error) {
    if (row.failed) return;
    row.failed = true;
    this.failures.set(id, error);
    this.#report(error, method, id);
  }

  #run(method, args, { stopOnTrue = false } = {}) {
    if (!this.started || this.destroyed) return stopOnTrue ? false : 0;
    let count = 0;
    for (const id of this.order) {
      const row = this.active.get(id);
      if (!row || row.failed || typeof row.feature?.[method] !== 'function') continue;
      try {
        const value = row.feature[method].apply(row.feature, args);
        count++;
        if (value && typeof value.then === 'function') {
          // The game loop is synchronous; never leave an unhandled async rejection.
          Promise.resolve(value).catch(error => this.#fail(id, row, method, error));
        }
        if (stopOnTrue && value === true) return true;
      } catch (error) {
        this.#fail(id, row, method, error);
      }
    }
    return stopOnTrue ? false : count;
  }

  update(dt) {
    return Number.isFinite(dt) && dt > 0 ? this.#run('update', [Math.min(.1, dt)]) : 0;
  }
  render(ctx, camera) { return this.#run('render', [ctx, camera]); }
  onPointer(event) { return this.#run('onPointer', [event], { stopOnTrue: true }); }
  get(id) { return this.active.get(id)?.feature ?? null; }
  has(id) { return this.active.has(id); }
  getSummary() {
    return { started: this.started, registered: this.definitions.size,
      active: this.active.size, failed: [...this.failures.keys()], order: [...this.order] };
  }

  async #stop() {
    this.started = false;
    const ids = [...this.order].reverse();
    this.order = [];
    for (const id of ids) {
      const row = this.active.get(id);
      if (!row) continue;
      this.active.delete(id);
      try { await row.feature?.dispose?.(); }
      catch (error) { this.#report(error, 'dispose', id); }
      try { row.scope.cleanup(); }
      catch (error) { this.#report(error, 'cleanup', id); }
    }
    this.active.clear();
  }

  async stop() {
    if (this.stopPromise) return this.stopPromise;
    // Lock before awaiting start(), so concurrent stops cannot dispose twice.
    this.stopPromise = (async () => {
      if (this.startPromise) await this.startPromise.catch(() => {});
      await this.#stop();
      return this;
    })();
    try { return await this.stopPromise; }
    finally { this.stopPromise = null; }
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
