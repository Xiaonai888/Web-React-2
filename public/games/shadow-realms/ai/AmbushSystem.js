/** Shadow Realms — existing-bridge ambush focus, never spawns duplicate wave units. */
const finite = Number.isFinite;
const point = p => finite(p?.x) && finite(p?.y);
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const bounded = (value, fallback, low, high) => clamp(finite(value) ? value : fallback, low, high);
const playerAlive = u => u?.id != null && u.team === 'blue' && u.alive !== false &&
  finite(u.hp) && u.hp > 0 && point(u);
const enemyAlive = u => u?.id != null && u.team === 'red' && u.alive !== false &&
  finite(u.hp) && u.hp > 0 && point(u);

export class AmbushSystem {
  constructor({ map, getPlayers = () => [], getEnemies = () => [],
    activationRadius = 255, supportRadius = 800, focusSeconds = 4, onEvent = null } = {}) {
    if (!finite(map?.width) || map.width <= 0 || !finite(map?.height) || map.height <= 0 ||
        typeof map.isWalkable !== 'function')
      throw new TypeError('AmbushSystem needs WorldMap');
    this.map = map;
    this.getPlayers = typeof getPlayers === 'function' ? getPlayers : () => getPlayers;
    this.getEnemies = typeof getEnemies === 'function' ? getEnemies : () => getEnemies;
    this.activationRadius = bounded(activationRadius, 255, 60, 550);
    this.supportRadius = bounded(supportRadius, 800, 150, 2000);
    this.focusSeconds = bounded(focusSeconds, 4, 1, 20);
    this.onEvent = typeof onEvent === 'function' ? onEvent : null;
    this.time = 0;
    this.timer = 0;
    this.focus = null;
    this.destroyed = false;
    const bridges = Array.isArray(map.bridges) ? map.bridges.filter(point).slice(0, 3) : [];
    this.zones = bridges.map((bridge, index) => ({
      id: `river-ambush-${index + 1}`, x: bridge.x, y: bridge.y,
      triggered: false, cooldown: 0,
    }));
  }

  #emit(name, data) {
    try { this.onEvent?.(name, data); }
    catch { /* Observers must not interrupt enemy tactics. */ }
  }
  #players() {
    let raw;
    try { raw = this.getPlayers() || []; }
    catch { return []; }
    return Array.isArray(raw) ? raw.filter(playerAlive) : [];
  }
  #enemies() {
    let raw;
    try { raw = this.getEnemies() || []; }
    catch { return []; }
    return Array.isArray(raw) ? raw.filter(enemyAlive) : [];
  }
  #checkFocus(players) {
    if (this.focus && (this.time >= this.focus.until ||
        !players.some(player => player.id === this.focus.targetId))) this.focus = null;
  }

  update(dt) {
    if (this.destroyed || !finite(dt) || dt <= 0) return this.focus;
    const seconds = Math.min(dt, 0.1);
    this.time += seconds;
    this.timer += seconds;
    const players = this.#players();
    this.#checkFocus(players);
    if (this.focus || this.timer < 0.4) return this.focus;
    this.timer = 0;
    if (!players.length) return null;
    const enemies = this.#enemies();
    if (!enemies.length) return null;
    for (const zone of this.zones) {
      if (zone.triggered || this.time < zone.cooldown ||
          !enemies.some(enemy => distance(enemy, zone) <= this.supportRadius)) continue;
      let target = null;
      let nearest = this.activationRadius;
      for (const player of players) {
        const d = distance(player, zone);
        if (d < nearest || (d === nearest && target &&
            String(player.id) < String(target.id))) {
          nearest = d;
          target = player;
        }
      }
      if (!target) continue;
      zone.triggered = true;
      this.focus = { targetId: target.id, until: this.time + this.focusSeconds, zoneId: zone.id };
      this.#emit('triggered', { zoneId: zone.id, targetId: target.id });
      return this.focus;
    }
    return null;
  }

  getFocusId() {
    if (this.destroyed || !this.focus) return null;
    this.#checkFocus(this.#players());
    return this.focus?.targetId ?? null;
  }
  getZones() { return this.zones.map(zone => ({ ...zone })); }
  reset() {
    if (this.destroyed) return;
    this.focus = null;
    this.time = 0;
    this.timer = 0;
    for (const zone of this.zones) { zone.triggered = false; zone.cooldown = 0; }
  }
  destroy() {
    if (this.destroyed) return;
    this.reset();
    this.destroyed = true;
    this.onEvent = null;
  }
}
export default AmbushSystem;
