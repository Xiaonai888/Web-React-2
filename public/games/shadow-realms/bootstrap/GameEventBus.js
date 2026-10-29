/** Synchronous, reentrant-safe game events with deterministic priority order. */
export class GameEventBus {
  constructor({ onError = null } = {}) {
    this.listeners = new Map();
    this.onError = typeof onError === 'function' ? onError : null;
    this.disposed = false;
    this.serial = 0;
  }

  on(type, callback, { once = false, priority = 0 } = {}) {
    if (this.disposed) throw new Error('GameEventBus is disposed');
    if (typeof type !== 'string' || !type.trim()) throw new TypeError('Event name is required');
    if (typeof callback !== 'function') throw new TypeError('Event listener must be a function');
    const item = {
      callback, once: Boolean(once), priority: Number.isFinite(priority) ? priority : 0,
      serial: this.serial++, active: true,
    };
    const bucket = this.listeners.get(type) || [];
    bucket.push(item);
    bucket.sort((a, b) => b.priority - a.priority || a.serial - b.serial);
    this.listeners.set(type, bucket);

    return () => {
      if (!item.active) return false;
      item.active = false;
      const current = this.listeners.get(type);
      if (!current) return false;
      const index = current.indexOf(item);
      if (index < 0) return false;
      current.splice(index, 1);
      if (!current.length && this.listeners.get(type) === current) this.listeners.delete(type);
      return true;
    };
  }

  once(type, callback, options = {}) {
    return this.on(type, callback, { ...options, once: true });
  }

  emit(type, payload) {
    if (this.disposed) return 0;
    const bucket = this.listeners.get(type);
    if (!bucket?.length) return 0;
    let delivered = 0;
    for (const item of [...bucket]) {
      if (this.disposed || !item.active || !this.listeners.get(type)?.includes(item)) continue;
      if (item.once) {
        item.active = false;
        const current = this.listeners.get(type);
        const index = current?.indexOf(item) ?? -1;
        if (index >= 0) {
          current.splice(index, 1);
          if (!current.length && this.listeners.get(type) === current) this.listeners.delete(type);
        }
      }
      try {
        item.callback(payload, type);
        delivered++;
      } catch (error) {
        try { this.onError?.(error, { event: type }); }
        catch { /* A reporting failure cannot interrupt the game loop. */ }
      }
    }
    return delivered;
  }

  listenerCount(type = null) {
    return type == null
      ? [...this.listeners.values()].reduce((sum, entries) => sum + entries.length, 0)
      : (this.listeners.get(type)?.length || 0);
  }

  clear(type = null) {
    if (type == null) {
      for (const entries of this.listeners.values()) {
        for (const item of entries) item.active = false;
      }
      this.listeners.clear();
      return;
    }
    for (const item of this.listeners.get(type) || []) item.active = false;
    this.listeners.delete(type);
  }

  destroy() {
    if (this.disposed) return;
    this.clear();
    this.disposed = true;
  }
}

export default GameEventBus;
