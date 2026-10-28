/**
 * Shadow Realms — local-only tile fog for an existing WorldMap.
 * Visible cells refresh from living blue units; explored cells stay discovered.
 * Nothing mutates map collision, camera, or unit simulation state.
 */
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const valid = p => Number.isFinite(p?.x) && Number.isFinite(p?.y);

export class FogOfWar {
  constructor(map, {
    cellSize = 48, sightRadius = 275, refreshSeconds = 0.18,
    unexploredAlpha = 0.82, exploredAlpha = 0.42,
  } = {}) {
    if (!map || !Number.isFinite(map.width) || !Number.isFinite(map.height)) {
      throw new TypeError('FogOfWar requires a WorldMap');
    }
    this.map = map;
    this.cellSize = clamp(Math.floor(cellSize) || 48, 24, 120);
    this.columns = Math.ceil(map.width / this.cellSize);
    this.rows = Math.ceil(map.height / this.cellSize);
    this.visited = new Uint8Array(this.columns * this.rows);
    this.visible = new Uint8Array(this.visited.length);
    this.sightRadius = clamp(sightRadius, 80, 1000);
    this.refreshSeconds = clamp(refreshSeconds, 0.08, 2);
    this.unexploredAlpha = clamp(unexploredAlpha, 0, 1);
    this.exploredAlpha = clamp(exploredAlpha, 0, 1);
    this.timer = 0;
    this.discoveredCount = 0;
    this.enabled = true;
    this.disposed = false;
  }

  #index(x, y) {
    return y >= 0 && x >= 0 && x < this.columns && y < this.rows
      ? y * this.columns + x : -1;
  }

  revealCircle(worldX, worldY, radius = this.sightRadius) {
    if (this.disposed || !Number.isFinite(worldX) || !Number.isFinite(worldY)) return 0;
    const size = this.cellSize;
    const r = clamp(radius, size, 1300);
    const x0 = clamp(Math.floor((worldX - r) / size), 0, this.columns - 1);
    const x1 = clamp(Math.floor((worldX + r) / size), 0, this.columns - 1);
    const y0 = clamp(Math.floor((worldY - r) / size), 0, this.rows - 1);
    const y1 = clamp(Math.floor((worldY + r) / size), 0, this.rows - 1);
    let newlyDiscovered = 0;
    const tolerance = r + size * 0.52;
    for (let y = y0; y <= y1; y++) {
      const cy = (y + 0.5) * size;
      for (let x = x0; x <= x1; x++) {
        const cx = (x + 0.5) * size;
        if ((cx-worldX)**2 + (cy-worldY)**2 > tolerance**2) continue;
        const idx = y * this.columns + x;
        this.visible[idx] = 1;
        if (!this.visited[idx]) { this.visited[idx] = 1; newlyDiscovered++; }
      }
    }
    this.discoveredCount += newlyDiscovered;
    return newlyDiscovered;
  }

  refresh(units = []) {
    if (!this.enabled || this.disposed) return;
    this.visible.fill(0);
    for (const unit of units) {
      if (!valid(unit) || unit.alive === false || (Number.isFinite(unit.hp) && unit.hp <= 0) ||
          unit.team !== 'blue') continue;
      this.revealCircle(unit.x, unit.y,
        Number.isFinite(unit.visionRadius) ? unit.visionRadius : this.sightRadius);
    }
    this.timer = 0;
  }

  update(dt, units = []) {
    if (!this.enabled || this.disposed || !Number.isFinite(dt) || dt <= 0) return;
    this.timer += Math.min(0.1, dt);
    if (this.timer >= this.refreshSeconds) this.refresh(units);
  }

  isVisible(x, y) {
    if (!this.enabled) return true;
    if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
    const i = this.#index(Math.floor(x / this.cellSize), Math.floor(y / this.cellSize));
    return i >= 0 && this.visible[i] === 1;
  }
  isExplored(x, y) {
    if (!this.enabled) return true;
    if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
    const i = this.#index(Math.floor(x / this.cellSize), Math.floor(y / this.cellSize));
    return i >= 0 && this.visited[i] === 1;
  }
  revealAll() {
    if (this.disposed) return;
    this.visited.fill(1);
    this.visible.fill(1);
    this.discoveredCount = this.visited.length;
  }
  getSummary() {
    return { exploredCells: this.discoveredCount, totalCells: this.visited.length,
      exploredPercent: Math.round(this.discoveredCount * 1000 / this.visited.length) / 10 };
  }

  draw(ctx, camera) {
    if (!this.enabled || this.disposed || !ctx || !camera) return;
    const bounds = camera.getVisibleBounds();
    const size = this.cellSize;
    const x0 = clamp(Math.floor(bounds.left / size), 0, this.columns - 1);
    const x1 = clamp(Math.ceil(bounds.right / size), 0, this.columns - 1);
    const y0 = clamp(Math.floor(bounds.top / size), 0, this.rows - 1);
    const y1 = clamp(Math.ceil(bounds.bottom / size), 0, this.rows - 1);
    const sx = size * camera.zoom + 0.7;
    const sy = size * camera.zoom * camera.tilt + 0.7;
    ctx.save();
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const i = y * this.columns + x;
      if (this.visible[i]) continue;
      const alpha = this.visited[i] ? this.exploredAlpha : this.unexploredAlpha;
      if (alpha <= 0) continue;
      const p = camera.worldToScreen(x * size, y * size);
      ctx.fillStyle = `rgba(8,16,14,${alpha})`;
      ctx.fillRect(p.x, p.y, sx, sy);
    }
    ctx.restore();
  }
  setEnabled(value) { this.enabled = Boolean(value); }
  reset() { this.visited.fill(0); this.visible.fill(0); this.discoveredCount = 0; this.timer = 0; }
  destroy() { this.disposed = true; this.visited = new Uint8Array(0); this.visible = new Uint8Array(0); }
}
export default FogOfWar;
