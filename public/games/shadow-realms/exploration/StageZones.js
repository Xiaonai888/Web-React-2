/** Shadow Realms — named discoverable world zones, no stage/mission rewrite. */
const dist = (a,b) => Math.hypot(a.x-b.x, a.y-b.y);
const good = p => Number.isFinite(p?.x) && Number.isFinite(p?.y);
const languages = Object.freeze({
  village: {km:'ភូមិមូលដ្ឋាន', en:'Home Village', zh:'家园村落', ja:'故郷の村', ko:'고향 마을'},
  paddies: {km:'វាលស្រែ', en:'Rice Fields', zh:'稻田', ja:'水田', ko:'논밭'},
  north: {km:'ព្រៃខាងជើង', en:'Northern Forest', zh:'北方森林', ja:'北の森', ko:'북쪽 숲'},
  bridge: {km:'ស្ពានទន្លេ', en:'River Crossing', zh:'河流渡口', ja:'川の渡し場', ko:'강의 건널목'},
  east: {km:'ជំរុំខាងកើត', en:'Eastern Camp', zh:'东部营地', ja:'東の野営地', ko:'동부 야영지'},
  south: {km:'ដែនដីខាងត្បូង', en:'Southern Frontier', zh:'南部边境', ja:'南の辺境', ko:'남부 변경'},
});

export class StageZones {
  constructor(map, {zones = null, onDiscover = null, radius = 150} = {}) {
    if (!map || !Number.isFinite(map.width) || !Number.isFinite(map.height)) {
      throw new TypeError('StageZones requires WorldMap');
    }
    this.map = map;
    const at = (x,y) => ({x: x*map.width/3200, y:y*map.height/2200});
    const home = map.getSpawnPoint?.('blue') || at(416,1122);
    const red = map.getSpawnPoint?.('red') || at(2784,1122);
    const b = map.bridges?.[0] || at(1600,1000);
    const defaults = [
      {id:'village', ...home, radius:210},
      {id:'paddies', ...at(800,1310)},
      {id:'north', ...at(680,470)},
      {id:'bridge', x:b.x, y:b.y, radius:165},
      {id:'east', ...red, radius:210},
      {id:'south', ...at(2290,1800)},
    ];
    const source = Array.isArray(zones) ? zones : defaults;
    const seen = new Set();
    this.zones = source.map(z => {
      if (!z || typeof z.id !== 'string' || !z.id || seen.has(z.id) || !good(z)) {
        throw new TypeError('Zone IDs must be unique and positions finite');
      }
      seen.add(z.id);
      return {id:z.id, x:z.x, y:z.y,
        radius:Number.isFinite(z.radius) ? Math.max(15,z.radius) : radius,
        discovered:false, visits:0};
    });
    this.onDiscover = typeof onDiscover === 'function' ? onDiscover : null;
    this.time = 0;
    this.disposed = false;
  }
  update(dt, units = []) {
    if (this.disposed || !Number.isFinite(dt) || dt <= 0) return;
    this.time += Math.min(dt, .1);
    for (const z of this.zones) {
      if (z.discovered) continue;
      for (const unit of units) {
        if (unit?.team !== 'blue' || unit.alive === false || !good(unit)) continue;
        if (dist(z,unit) <= z.radius) {
          z.discovered = true; z.visits++;
          this.onDiscover?.({...z});
          break;
        }
      }
    }
  }
  getZones() { return this.zones.map(z => ({...z})); }
  getZone(id) { const z=this.zones.find(z=>z.id===id);return z?{...z}:null; }
  getSummary() {return {total:this.zones.length, discovered:this.zones.filter(z=>z.discovered).length};}
  label(zone, locale = 'km') {return languages[zone.id]?.[locale] || languages[zone.id]?.en || zone.id;}
  draw(ctx,camera,fog=null,locale='km') {
    if (this.disposed || !ctx || !camera) return;
    ctx.save();
    for (const z of this.zones) {
      if (!z.discovered || (fog && !fog.isExplored(z.x,z.y))) continue;
      const p = camera.worldToScreen(z.x,z.y);
      if (p.x<-90 || p.x>camera.viewportWidth+90 || p.y<-80 || p.y>camera.viewportHeight+80) continue;
      ctx.fillStyle='rgba(17,30,20,.76)';
      ctx.font='bold 10px system-ui,sans-serif';
      const label=this.label(z,locale);
      const width=Math.min(148,ctx.measureText(label).width+14);
      ctx.beginPath();ctx.roundRect(p.x-width/2,p.y-31,width,20,8);ctx.fill();
      ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#f6e7b5';
      ctx.fillText(label,p.x,p.y-21,130);
      ctx.fillStyle='#f0cc72';ctx.beginPath();ctx.arc(p.x,p.y,3,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }
  reset() {for(const z of this.zones){z.discovered=false;z.visits=0;}this.time=0;}
  destroy(){this.disposed=true;this.onDiscover=null;}
}
export default StageZones;
