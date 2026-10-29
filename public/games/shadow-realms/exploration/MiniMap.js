/**
 * Shadow Realms — lightweight Mini-map for the existing WorldMap / GameEngine.
 * Step 30: merge equal fog cells into horizontal strips, rather than issuing
 * thousands of fillRect calls per frame. Keep the same visible/explored colors.
 * A responsive mobile layout stays fully inside the game Canvas.
 * No new listeners, timers, APIs, DOM layers, servers or resource ledgers.
 */
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
const goodPoint = p => Number.isFinite(p?.x) && Number.isFinite(p?.y);

export class MiniMap {
  constructor(map, { fog = null, zones = null, getUnits = () => [],
    width = 168, height = 118, y = 170, margin = 10, enabled = true } = {}) {
    if (!map || !Number.isFinite(map.width) || !Number.isFinite(map.height) ||
        map.width <= 0 || map.height <= 0) {
      throw new TypeError('MiniMap needs WorldMap');
    }
    this.map = map;
    this.fog = fog;
    this.zones = zones;
    this.getUnits = typeof getUnits === 'function' ? getUnits : () => getUnits;
    this.width = clamp(width, 100, 300);
    this.height = clamp(height, 75, 220);
    this.y = Math.max(0, y);
    this.margin = Math.max(0, margin);
    this.enabled = Boolean(enabled);
    this.bounds = { x: 0, y: 0, width: this.width, height: this.height };
  }

  #layout(camera) {
    const vw = Math.max(1, Number(camera.viewportWidth) || 1);
    const vh = Math.max(1, Number(camera.viewportHeight) || 1);
    const phone = vw < 500;
    const scale = phone ? .73 : vw < 700 ? .85 : 1;
    const width = Math.max(1, Math.min(this.width * scale, vw - 8));
    const height = Math.max(1, Math.min(this.height * scale, vh - 8));
    const x = phone ? Math.min(this.margin, Math.max(4, vw - width - 4))
      : Math.max(4, vw - width - this.margin);
    // The minimap is Canvas content; the height is the actual Canvas viewport,
    // not the whole phone screen. Avoid creating a partly untappable map.
    const preferredY = phone ? vh - height - 12 : this.y;
    const y = clamp(preferredY, 4, Math.max(4, vh - height - 4));
    this.bounds = { x, y, width, height };
    return this.bounds;
  }

  hitTest(screen, camera) {
    if (!this.enabled || !goodPoint(screen) || !camera) return null;
    const r = this.#layout(camera);
    if (screen.x < r.x || screen.y < r.y ||
        screen.x > r.x + r.width || screen.y > r.y + r.height) return null;
    return {
      x: clamp((screen.x - r.x) / r.width, 0, 1) * this.map.width,
      y: clamp((screen.y - r.y) / r.height, 0, 1) * this.map.height,
    };
  }

  onPointer(event, camera) {
    if (!['tap', 'select'].includes(event?.kind)) return false;
    const position = this.hitTest(event.screen, camera);
    if (!position) return false;
    if (typeof camera.centerOn !== 'function') return false;
    camera.centerOn(position.x, position.y);
    return true;
  }

  /** Identical fog opacity, fewer fillRect calls: contiguous runs per row. */
  #drawFog(ctx, frame) {
    const fog = this.fog;
    if (!fog?.enabled || !(fog.columns > 0 && fog.rows > 0) ||
        !fog.visited || !fog.visible) return;
    const fw = frame.width / fog.columns;
    const fh = frame.height / fog.rows;
    const visited = fog.visited, visible = fog.visible;
    const cols = fog.columns;
    // One fog rectangle per horizontal run of matching state. This preserves
    // the two old opacity levels while significantly cutting Canvas calls.
    for (let row = 0; row < fog.rows; row++) {
      const first = row * cols;
      let col = 0;
      while (col < cols) {
        const index = first + col;
        if (visible[index]) { col++; continue; }
        const discovered = Boolean(visited[index]);
        let end = col + 1;
        while (end < cols && !visible[first + end] &&
               Boolean(visited[first + end]) === discovered) end++;
        ctx.fillStyle = discovered ? 'rgba(10,20,14,.42)' : 'rgba(6,14,9,.88)';
        ctx.fillRect(frame.x + col * fw, frame.y + row * fh,
          (end - col) * fw + .5, fh + .5);
        col = end;
      }
    }
  }

  draw(ctx, camera) {
    if (!this.enabled || !ctx || !camera) return;
    const r = this.#layout(camera);
    const mx = x => r.x + x / this.map.width * r.width;
    const my = y => r.y + y / this.map.height * r.height;
    ctx.save();
    ctx.fillStyle = 'rgba(17,35,23,.94)';
    ctx.strokeStyle = '#d8c08b';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') ctx.roundRect(r.x - 3, r.y - 3, r.width + 6, r.height + 6, 8);
    else ctx.rect(r.x - 3, r.y - 3, r.width + 6, r.height + 6);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.rect(r.x, r.y, r.width, r.height);
    ctx.clip();
    ctx.fillStyle = '#65804b';
    ctx.fillRect(r.x, r.y, r.width, r.height);

    ctx.strokeStyle = '#568fa4';
    ctx.lineWidth = Math.max(4, r.width * .07);
    ctx.beginPath();
    if (typeof this.map.riverX === 'function') {
      for (let i = 0; i <= 24; i++) {
        const y = i * this.map.height / 24;
        const x = this.map.riverX(y);
        if (i === 0) ctx.moveTo(mx(x), my(y));
        else ctx.lineTo(mx(x), my(y));
      }
    }
    ctx.stroke();

    ctx.fillStyle = '#bba47f';
    for (const b of this.map.bridges || []) {
      ctx.fillRect(mx(b.x - b.halfWidth), my(b.y - b.halfHeight),
        2 * b.halfWidth / this.map.width * r.width,
        2 * b.halfHeight / this.map.height * r.height);
    }
    ctx.fillStyle = '#3c5c3e';
    for (const tree of this.map.trees || []) {
      ctx.fillRect(mx(tree.x) - .7, my(tree.y) - .7, 1.4, 1.4);
    }
    for (const zone of this.zones?.zones || []) {
      if (!zone.discovered) continue;
      ctx.fillStyle = '#f3d67c';
      ctx.fillRect(mx(zone.x) - 1.6, my(zone.y) - 1.6, 3.2, 3.2);
    }

    this.#drawFog(ctx, r);

    const roster = this.getUnits();
    for (const unit of (Array.isArray(roster) ? roster : [])) {
      if (unit?.alive === false || !goodPoint(unit)) continue;
      if (unit.team !== 'blue' && !this.fog?.isVisible(unit.x, unit.y)) continue;
      ctx.fillStyle = unit.team === 'blue' ? '#85d7ff' : '#f98b83';
      ctx.beginPath();
      ctx.arc(mx(unit.x), my(unit.y), unit.team === 'blue' ? 2.8 : 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    const view = typeof camera.getVisibleBounds === 'function' ? camera.getVisibleBounds() : null;
    if (view && Number.isFinite(view.left) && Number.isFinite(view.top) &&
        Number.isFinite(view.right) && Number.isFinite(view.bottom)) {
      ctx.strokeStyle = '#fff7cf';
      ctx.lineWidth = 1.1;
      ctx.strokeRect(mx(view.left), my(view.top),
        (view.right - view.left) / this.map.width * r.width,
        (view.bottom - view.top) / this.map.height * r.height);
    }
    ctx.restore();
  }

  setEnabled(flag) { this.enabled = Boolean(flag); }
  destroy() { this.getUnits = () => []; this.fog = null; this.zones = null; }
}
export default MiniMap;
