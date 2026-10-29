/** Shadow Realms — discoverable named zones; never awards mission progress. */
const finite = Number.isFinite;
const point = p => finite(p?.x) && finite(p?.y);
const distance = (a,b) => Math.hypot(a.x - b.x, a.y - b.y);
const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
const names = Object.freeze({
  village: {km:'ភូមិមូលដ្ឋាន',en:'Home Village',zh:'家园村落',ja:'故郷の村',ko:'고향 마을'},
  paddies: {km:'វាលស្រែ',en:'Rice Fields',zh:'稻田',ja:'水田',ko:'논밭'},
  north: {km:'ព្រៃខាងជើង',en:'Northern Forest',zh:'北方森林',ja:'北の森',ko:'북쪽 숲'},
  bridge: {km:'ស្ពានទន្លេ',en:'River Crossing',zh:'河流渡口',ja:'川の渡し場',ko:'강의 건널목'},
  east: {km:'ជំរុំខាងកើត',en:'Eastern Camp',zh:'东部营地',ja:'東の野営地',ko:'동부 야영지'},
  south: {km:'ដែនដីខាងត្បូង',en:'Southern Frontier',zh:'南部边境',ja:'南の辺境',ko:'남부 변경'},
});

export class StageZones {
  constructor(map, { zones = null, onDiscover = null, radius = 150 } = {}) {
    if (!finite(map?.width) || !finite(map?.height) || map.width <= 0 || map.height <= 0)
      throw new TypeError('StageZones requires a valid WorldMap');
    this.map = map;
    const at = (x,y) => ({x:x * map.width / 3200,y:y * map.height / 2200});
    const home = map.getSpawnPoint?.('blue') || at(416,1122);
    const enemy = map.getSpawnPoint?.('red') || at(2784,1122);
    const bridge = map.bridges?.[0] || at(1600,1000);
    const defaults = [
      {id:'village', ...home, radius:210},
      {id:'paddies', ...at(800,1310)},
      {id:'north', ...at(680,470)},
      {id:'bridge',x:bridge.x,y:bridge.y,radius:165},
      {id:'east',...enemy,radius:210},
      {id:'south',...at(2290,1800)},
    ];
    const input = Array.isArray(zones) ? zones : defaults;
    const seen = new Set();
    this.zones = input.map(zone => {
      if (!zone || typeof zone.id !== 'string' || !zone.id.trim() ||
          seen.has(zone.id) || !point(zone))
        throw new TypeError('Zone IDs must be unique and coordinates finite');
      seen.add(zone.id);
      return {id:zone.id,x:zone.x,y:zone.y,
        radius:clamp(finite(zone.radius) ? zone.radius :
          finite(radius) ? radius : 150,15,1500), discovered:false,visits:0};
    });
    this.onDiscover = typeof onDiscover === 'function' ? onDiscover : null;
    this.time = 0;
    this.disposed = false;
  }

  update(dt, units = []) {
    if (this.disposed || !finite(dt) || dt <= 0) return;
    this.time += Math.min(.1,dt);
    const players = (Array.isArray(units) ? units : []).filter(unit =>
      unit?.team === 'blue' && unit.alive !== false && finite(unit.hp) &&
      unit.hp > 0 && point(unit));
    for (const zone of this.zones) {
      if (zone.discovered) continue;
      if (!players.some(player => distance(zone,player) <= zone.radius)) continue;
      zone.discovered = true;
      zone.visits++;
      try { this.onDiscover?.({...zone}); }
      catch (error) { console.warn('Shadow Realms zone observer failed:',error); }
    }
  }

  getZones() { return this.zones.map(zone => ({...zone})); }
  getZone(id) {
    const zone = this.zones.find(z => z.id === id);
    return zone ? {...zone} : null;
  }
  getSummary() {
    return {total:this.zones.length,
      discovered:this.zones.filter(zone => zone.discovered).length};
  }
  label(zone, locale = 'km') {
    const id = typeof zone === 'string' ? zone : zone?.id;
    if (!id) return '';
    const language = String(locale).split('-')[0].toLowerCase();
    return names[id]?.[language] || names[id]?.en || id;
  }

  draw(ctx, camera, fog = null, locale = 'km') {
    if (this.disposed || !ctx || typeof camera?.worldToScreen !== 'function') return;
    ctx.save();
    try {
      for (const zone of this.zones) {
        if (!zone.discovered || (fog && !fog.isExplored(zone.x,zone.y))) continue;
        const p = camera.worldToScreen(zone.x,zone.y);
        if (!point(p) || p.x < -90 || p.x > camera.viewportWidth + 90 ||
            p.y < -80 || p.y > camera.viewportHeight + 80) continue;
        const label = this.label(zone,locale);
        ctx.font = 'bold 10px system-ui,sans-serif';
        const width = Math.min(148, Math.max(32,ctx.measureText(label).width + 14));
        ctx.fillStyle = 'rgba(17,30,20,.76)';
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function')
          ctx.roundRect(p.x-width/2,p.y-31,width,20,8);
        else ctx.rect(p.x-width/2,p.y-31,width,20);
        ctx.fill();
        ctx.textAlign = 'center';ctx.textBaseline = 'middle';
        ctx.fillStyle = '#f6e7b5';ctx.fillText(label,p.x,p.y-21,130);
        ctx.fillStyle = '#f0cc72';ctx.beginPath();ctx.arc(p.x,p.y,3,0,Math.PI*2);ctx.fill();
      }
    } finally {ctx.restore();}
  }
  reset() {
    if (this.disposed) return;
    for (const zone of this.zones) {zone.discovered = false;zone.visits = 0;}
    this.time = 0;
  }
  destroy() {this.disposed = true;this.onDiscover = null;}
}
export default StageZones;
