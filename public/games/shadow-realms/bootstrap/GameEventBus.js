/**
 * Shadow Realms — synchronous in-memory gameplay event bus.
 * No browser APIs, persistence, external packages, fetch or background tasks.
 */
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
    const item = { callback, once: Boolean(once), priority: Number.isFinite(priority) ? priority : 0, serial: this.serial++ };
    const bucket = this.listeners.get(type) || [];
    bucket.push(item);
    bucket.sort((a, b) => b.priority - a.priority || a.serial - b.serial);
    this.listeners.set(type, bucket);
    let active = true;
    return () => {
      if (!active) return false;
      active = false;
      const current = this.listeners.get(type);
      if (!current) return false;
      const i = current.indexOf(item);
      if (i < 0) return false;
      current.splice(i, 1);
      if (!current.length) this.listeners.delete(type);
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
      if (!bucket.includes(item)) continue; // May have been unsubscribed mid-dispatch.
      if (item.once) {
        bucket.splice(bucket.indexOf(item), 1); // Remove BEFORE calling; reentrant safe.
        if (!bucket.length) this.listeners.delete(type);
      }
      try { item.callback(payload, type); delivered++; }
      catch (error) {
        try { this.onError?.(error, { event: type }); } catch { /* An error reporter cannot break the loop. */ }
      }
    }
    return delivered;
  }

  listenerCount(type = null) {
    return type == null ? [...this.listeners.values()].reduce((sum, a) => sum + a.length, 0)
      : (this.listeners.get(type)?.length || 0);
  }

  clear(type = null) {
    if (type == null) this.listeners.clear();
    else this.listeners.delete(type);
  }

  destroy() {
    if (this.disposed) return;
    this.clear();
    this.disposed = true;
  }
}

export default GameEventBus;
