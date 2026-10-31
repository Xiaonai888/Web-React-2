/**
 * Shadow Realms — ONE-TIME bridge for existing GameEngine callbacks.
 * Existing index.html remains the owner of core farming, construction, combat,
 * missions and input. New features go into FeatureManifest.js, NOT index.html.
 *
 * ONE-TIME integration (in a later step, NOT included in this ZIP):
 *   const bridge = new GameBootstrap({
 *     engine: game,
 *     services: { rice, wood, construction, combat, health, missions, visual,
 *                 navigation: route, farmers, footer, home },
 *   });
 *   await bridge.start(); // after existing hooks, before game.start()
 *   // pagehide: await bridge.destroy(); then destroy existing systems as before.
 *
 * Hooks retain original GameEngine behavior, and restore it on destroy().
 * No duplicate GameEngine, no DOM listeners, no fetch, no service ownership leak.
 */
import { GameContext } from './GameContext.js';
import { FeatureRegistry } from './FeatureRegistry.js';
import { getFeatureManifest } from './FeatureManifest.js';

export class GameBootstrap {
  constructor({ engine, services = {}, manifest = null, onError = null,
    pointerPriority = 'after' } = {}) {
    if (!engine || typeof engine !== 'object' || !engine.map || !engine.camera) {
      throw new TypeError('GameBootstrap needs the existing GameEngine');
    }
    if (manifest != null && !Array.isArray(manifest)) throw new TypeError('manifest must be an array');
    if (!['before', 'after'].includes(pointerPriority)) throw new TypeError('pointerPriority must be before/after');
    this.engine = engine;
    this.context = new GameContext({ engine, services, onError });
    this.registry = new FeatureRegistry({ context: this.context, onError });
    this.manifest = manifest == null ? getFeatureManifest() : manifest;
    this.pointerPriority = pointerPriority;
    this.original = null;
    this.handlers = null;
    this.installed = false;
    this.startPromise = null;
    this.destroyPromise = null;
    this.registered = false;
    this.destroyed = false;
  }

  async start() {
    if (this.destroyed || this.destroyPromise) throw new Error('GameBootstrap is stopping or destroyed');
    if (this.installed) return this;
    if (this.startPromise) return this.startPromise;
    this.startPromise = this.#start();
    try { return await this.startPromise; }
    finally { this.startPromise = null; }
  }

  async #start() {
    // A failed optional feature can be retried without registering IDs twice.
    if (!this.registered) {
      this.registry.registerAll(this.manifest);
      this.registered = true;
    }
    await this.registry.start();
    try { this.attach(); }
    catch (error) { await this.registry.stop(); throw error; }
    // An event observer is not permitted to cancel an otherwise healthy boot.
    try { this.context.events.emit('game:features-attached', this.registry.getSummary()); }
    catch { /* GameContext continues to own the installed feature hooks. */ }
    return this;
  }

  attach() {
    if (this.installed) return;
    if (this.destroyed) throw new Error('GameBootstrap is destroyed');
    if (!this.registry.started) throw new Error('Start features before attaching');
    const game = this.engine;
    const old = { update: game.onUpdate, render: game.onRender, pointer: game.onWorldPointer };
    const registry = this.registry;
    const handlers = {
      update: (dt, ...args) => {
        if (typeof old.update === 'function') old.update.call(game, dt, ...args);
        registry.update(dt);
      },
      render: (ctx, camera, ...args) => {
        if (typeof old.render === 'function') old.render.call(game, ctx, camera, ...args);
        registry.render(ctx, camera);
      },
      pointer: (event, ...args) => {
        if (this.pointerPriority === 'before' && registry.onPointer(event)) return true;
        const result = typeof old.pointer === 'function' ? old.pointer.call(game, event, ...args) : undefined;
        // If the original game already consumed the tap, never issue it twice.
        if (this.pointerPriority === 'after' && result !== true &&
            registry.onPointer(event)) return true;
        return result;
      },
    };
    game.onUpdate = handlers.update;
    game.onRender = handlers.render;
    game.onWorldPointer = handlers.pointer;
    this.original = old;
    this.handlers = handlers;
    this.installed = true;
  }

  detach() {
    if (!this.installed) return;
    const game = this.engine, h = this.handlers, old = this.original;
    // Never overwrite hooks installed by a newer subsystem later.
    if (game.onUpdate === h.update) game.onUpdate = old.update;
    if (game.onRender === h.render) game.onRender = old.render;
    if (game.onWorldPointer === h.pointer) game.onWorldPointer = old.pointer;
    this.original = null;
    this.handlers = null;
    this.installed = false;
  }

  getFeature(id) { return this.registry.get(id); }
  getService(id, fallback) { return this.context.get(id, fallback); }
  getSummary() { return { attached: this.installed, ...this.registry.getSummary() }; }

  async destroy() {
    if (this.destroyed) return;
    if (this.destroyPromise) return this.destroyPromise;
    // One teardown path even when pagehide and another caller race.
    this.destroyPromise = (async () => {
      if (this.startPromise) await this.startPromise.catch(() => {});
      this.detach();
      try { await this.registry.destroy(); }
      finally {
        this.context.destroy();
        this.destroyed = true;
      }
    })();
    return this.destroyPromise;
  }
}

export default GameBootstrap;
