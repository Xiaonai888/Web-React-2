/** Shadow Realms — bounded, local fog of war on the existing world map. */
const finite = Number.isFinite;
const clamp = (x, min, max) => Math.max(min, Math.min(max, x));
const point = p => finite(p?.x) && finite(p?.y);
const number = (value, fallback, min, max) => clamp(finite(value) ? value : fallback, min, max);

export class FogOfWar {
  constructor(map, { cellSize = 48, sightRadius = 275, refreshSeconds = 0.18,
    unexploredAlpha = 0.82, exploredAlpha = 0.42 } = {}) {
    if (!finite(map?.width) || !finite(map?.height) || map.width <= 0 || map.height <= 0)
      throw new TypeError('FogOfWar requires a valid WorldMap');
    this.map = map;
    this.cellSize = Math.floor(number(cellSize, 48, 24, 120));
    this.columns = Math.ceil(map.width / this.cellSize);
    this.rows = Math.ceil(map.height / this.cellSize);
    if (this.columns * this.rows > 2000000)
      throw new RangeError('FogOfWar map exceeds the safe cell budget');
    this.visited = new Uint8Array(this.columns * this.rows);
    this.visible = new Uint8Array(this.visited.length);
    this.sightRadius = number(sightRadius, 275, 80, 1000);
    this.refreshSeconds = number(refreshSeconds, .18, .08, 2);
    this.unexploredAlpha = number(unexploredAlpha, .82, 0, 1);
    this.exploredAlpha = number(exploredAlpha, .42, 0, 1);
    this.timer = 0;
    this.discoveredCount = 0;
    this.enabled = true;
    this.disposed = false;
  }

  #index(x, y) {
    return x >= 0 && y >= 0 && x < this.columns && y < this.rows
      ? y * this.columns + x : -1;
  }

  revealCircle(worldX, worldY, radius = this.sightRadius) {
    if (this.disposed || !finite(worldX) || !finite(worldY)) return 0;
    const size = this.cellSize;
    const r = number(radius, this.sightRadius, size, 1300);
    if (worldX + r < 0 || worldY + r < 0 || worldX - r > this.map.width ||
        worldY - r > this.map.height) return 0;
    const x0 = clamp(Math.floor((worldX - r) / size), 0, this.columns - 1);
    const x1 = clamp(Math.floor((worldX + r) / size), 0, this.columns - 1);
    const y0 = clamp(Math.floor((worldY - r) / size), 0, this.rows - 1);
    const y1 = clamp(Math.floor((worldY + r) / size), 0, this.rows - 1);
    const toleranceSquared = (r + size * .52) ** 2;
    let added = 0;
    for (let y = y0; y <= y1; y++) {
      const cy = (y + .5) * size;
      for (let x = x0; x <= x1; x++) {
        const cx = (x + .5) * size;
        if ((cx - worldX) ** 2 + (cy - worldY) ** 2 > toleranceSquared) continue;
        const index = y * this.columns + x;
        this.visible[index] = 1;
        if (!this.visited[index]) { this.visited[index] = 1; added++; }
      }
    }
    this.discoveredCount += added;
    return added;
  }

  refresh(units = []) {
    if (this.disposed || !this.enabled) return;
    this.visible.fill(0);
    for (const unit of Array.isArray(units) ? units : []) {
      if (!point(unit) || unit.team !== 'blue' || unit.alive === false ||
          !finite(unit.hp) || unit.hp <= 0) continue;
      this.revealCircle(unit.x, unit.y,
        finite(unit.visionRadius) ? unit.visionRadius : this.sightRadius);
    }
    this.timer = 0;
  }

  update(dt, units = []) {
    if (this.disposed || !this.enabled || !finite(dt) || dt <= 0) return;
    this.timer += Math.min(.1, dt);
    if (this.timer >= this.refreshSeconds) this.refresh(units);
  }

  isVisible(x, y) {
    if (this.disposed) return false;
    if (!this.enabled) return true;
    if (!finite(x) || !finite(y)) return false;
    const index = this.#index(Math.floor(x / this.cellSize), Math.floor(y / this.cellSize));
    return index >= 0 && this.visible[index] === 1;
  }

  isExplored(x, y) {
    if (this.disposed) return false;
    if (!this.enabled) return true;
    if (!finite(x) || !finite(y)) return false;
    const index = this.#index(Math.floor(x / this.cellSize), Math.floor(y / this.cellSize));
    return index >= 0 && this.visited[index] === 1;
  }

  revealAll() {
    if (this.disposed) return;
    this.visited.fill(1);
    this.visible.fill(1);
    this.discoveredCount = this.visited.length;
  }

  getSummary() {
    return { exploredCells: this.discoveredCount, totalCells: this.visited.length,
      exploredPercent: this.visited.length
        ? Math.round(this.discoveredCount * 1000 / this.visited.length) / 10 : 0 };
  }

  draw(ctx, camera) {
    if (!this.enabled || this.disposed || !ctx ||
        typeof camera?.getVisibleBounds !== 'function' ||
        typeof camera.worldToScreen !== 'function') return;
    const bounds = camera.getVisibleBounds();
    if (!bounds || !point({x:bounds.left,y:bounds.top}) ||
        !point({x:bounds.right,y:bounds.bottom})) return;
    const size = this.cellSize;
    const x0 = clamp(Math.floor(bounds.left / size), 0, this.columns - 1);
    const x1 = clamp(Math.ceil(bounds.right / size), 0, this.columns - 1);
    const y0 = clamp(Math.floor(bounds.top / size), 0, this.rows - 1);
    const y1 = clamp(Math.ceil(bounds.bottom / size), 0, this.rows - 1);
    if (bounds.right < 0 || bounds.bottom < 0 || bounds.left > this.map.width ||
        bounds.top > this.map.height || x0 > x1 || y0 > y1) return;
    const sx = size * number(camera.zoom, 1, .1, 8) + .7;
    const sy = size * number(camera.zoom, 1, .1, 8) *
      number(camera.tilt, .74, .1, 2) + .7;
    ctx.save();
    try {
      for (let y = y0; y <= y1; y++) {
        let x = x0;
        while (x <= x1) {
          const index = y * this.columns + x;
          if (this.visible[index]) { x++; continue; }
          const explored = Boolean(this.visited[index]);
          const alpha = explored ? this.exploredAlpha : this.unexploredAlpha;
          let end = x + 1;
          while (end <= x1 && !this.visible[y * this.columns + end] &&
              Boolean(this.visited[y * this.columns + end]) === explored) end++;
          if (alpha > 0) {
            const p = camera.worldToScreen(x * size, y * size);
            if (point(p)) {
              ctx.fillStyle = `rgba(8,16,14,${alpha})`;
              ctx.fillRect(p.x, p.y, (end - x - 1) * size * camera.zoom + sx, sy);
            }
          }
          x = end;
        }
      }
    } finally { ctx.restore(); }
  }

  setEnabled(value) { if (!this.disposed) { this.enabled = Boolean(value); this.timer = this.refreshSeconds; } }
  reset() {
    if (this.disposed) return;
    this.visited.fill(0); this.visible.fill(0); this.discoveredCount = 0; this.timer = 0;
  }
  destroy() {
    if (this.disposed) return;
    this.disposed = true;
    this.visited = new Uint8Array(0);
    this.visible = new Uint8Array(0);
  }
}
export default FogOfWar;
