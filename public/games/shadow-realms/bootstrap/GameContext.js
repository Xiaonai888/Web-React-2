/** Shared game services, scoped ownership and disposable event subscriptions. */
import { GameEventBus } from './GameEventBus.js';

const validName = name => typeof name === 'string' && /^[a-zA-Z][\w.:-]*$/.test(name);
const RESERVED = new Set(['engine', 'map', 'camera', 'events']);

export class GameContext {
  constructor({ engine, services = {}, events = null, onError = null } = {}) {
    if (!engine || typeof engine !== 'object' || !engine.map || !engine.camera) {
      throw new TypeError('GameContext requires an existing GameEngine with map and camera');
    }
    if (events != null && (typeof events.on !== 'function' || typeof events.emit !== 'function')) {
      throw new TypeError('GameContext events must support on() and emit()');
    }
    this.engine = engine;
    this.map = engine.map;
    this.camera = engine.camera;
    this.events = events || new GameEventBus({ onError });
    this.ownsEvents = events == null;
    this.services = new Map();
    this.owners = new Map();
    this.scopes = new Map();
    this.destroyed = false;
    for (const [name, value] of Object.entries(services || {})) this.provide(name, value);
  }

  #assertActive() {
    if (this.destroyed) throw new Error('GameContext is destroyed');
  }

  get(name, fallback = undefined) {
    if (name === 'engine') return this.engine;
    if (name === 'map') return this.map;
    if (name === 'camera') return this.camera;
    if (name === 'events') return this.events;
    return this.services.has(name) ? this.services.get(name) : fallback;
  }

  has(name) { return RESERVED.has(name) || this.services.has(name); }

  provide(name, value, { owner = null, replace = false } = {}) {
    this.#assertActive();
    if (!validName(name) || RESERVED.has(name)) {
      throw new TypeError('Invalid or reserved service name: ' + name);
    }
    if (this.services.has(name) && !replace) throw new Error('Service already registered: ' + name);
    this.services.set(name, value);
    if (owner == null) this.owners.delete(name);
    else this.owners.set(name, owner);
    return value;
  }

  remove(name, owner = null) {
    this.#assertActive();
    if (owner != null && this.owners.get(name) !== owner) return false;
    this.owners.delete(name);
    return this.services.delete(name);
  }

  /** Each feature releases only the registrations it still owns. */
  scope(featureId) {
    this.#assertActive();
    if (!validName(featureId) || this.scopes.has(featureId)) {
      throw new Error('Duplicate/invalid feature scope: ' + featureId);
    }
    const subscriptions = new Set();
    const ownedServices = new Set();
    let active = true;
    const assert = () => {
      if (!active || this.destroyed) throw new Error('Feature scope is closed: ' + featureId);
    };
    const subscribe = (type, callback, opts) => {
      assert();
      const unsubscribe = this.events.on(type, callback, opts);
      subscriptions.add(unsubscribe);
      return () => { subscriptions.delete(unsubscribe); return unsubscribe(); };
    };
    const scope = Object.freeze({
      id: featureId, context: this, engine: this.engine, map: this.map,
      camera: this.camera, events: this.events,
      get: (name, fallback) => this.get(name, fallback),
      has: name => this.has(name),
      provide: (name, value) => {
        assert();
        const result = this.provide(name, value, { owner: featureId });
        ownedServices.add(name);
        return result;
      },
      on: (type, fn, opts) => subscribe(type, fn, opts),
      once: (type, fn, opts) => subscribe(type, fn, { ...opts, once: true }),
      emit: (type, data) => { assert(); return this.events.emit(type, data); },
      cleanup: () => {
        if (!active) return;
        active = false;
        try {
          for (const off of subscriptions) {
            try { off(); }
            catch { /* Continue releasing the rest of the scope. */ }
          }
          subscriptions.clear();
          for (const name of ownedServices) {
            if (this.owners.get(name) === featureId) this.remove(name, featureId);
          }
          ownedServices.clear();
        } finally {
          this.scopes.delete(featureId);
        }
      },
    });
    this.scopes.set(featureId, scope);
    return scope;
  }

  destroy() {
    if (this.destroyed) return;
    for (const scope of [...this.scopes.values()]) {
      try { scope.cleanup(); }
      catch { /* Always clean up subsequent scopes and services. */ }
    }
    this.scopes.clear();
    this.services.clear();
    this.owners.clear();
    this.destroyed = true;
    if (this.ownsEvents) this.events.destroy();
  }
}

export default GameContext;
