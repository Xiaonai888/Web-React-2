/**
 * Shadow Realms — FeatureRegistry adapter for existing WorldMap + Camera.
 * Loaded dynamically by bootstrap/FeatureManifest.js; NO index.html edits now.
 *
 * One-time GameBootstrap integration later should set pointerPriority:'before'
 * so mini-map taps cannot also select a farmer on the underlying world.
 */
import {FogOfWar} from './FogOfWar.js';
import {MiniMap} from './MiniMap.js';
import {StageZones} from './StageZones.js';

export function createFeature(scope) {
  if(!scope || !scope.map || !scope.camera || typeof scope.get!=='function' ||
      typeof scope.provide!=='function' || typeof scope.emit!=='function') {
    throw new TypeError('ExplorationFeature requires a bootstrap GameContext scope');
  }
  const allUnits = () => {
    const player = scope.get('farmers',[]);
    const units = scope.get('getUnits',null);
    let raw;
    try { raw = typeof units==='function' ? units() : player; }
    catch { raw = player; }
    return Array.isArray(raw)?raw:[];
  };
  const playerUnits = () => allUnits().filter(u => u && u.team==='blue' && u.alive!==false &&
    Number.isFinite(u.hp) && u.hp>0 && Number.isFinite(u.x) && Number.isFinite(u.y));
  const emit = (name, data) => {try{scope.emit(name,data)}catch{/* Observers are isolated. */}};
  const map=scope.map;
  const fog = new FogOfWar(map);
  const zones = new StageZones(map,{onDiscover:zone=>emit('exploration:zone-discovered',{...zone})});
  const miniMap = new MiniMap(map,{fog,zones,getUnits:allUnits});
  const api=Object.freeze({fog,zones,miniMap});
  let disposed=false;
  let started=false;
  let elapsed=0;
  let pendingZoneSeconds=0;
  const localeValue = () => {
    const lang = typeof document!=='undefined' ? String(document.documentElement?.lang || 'km').split('-')[0].toLowerCase() : 'km';
    return ['km','en','zh','ja','ko'].includes(lang)?lang:'en';
  };
  return {
    ...api,
    start(){
      if(disposed||started)return;
      scope.provide('exploration',api);
      started=true;
      const units=playerUnits();
      fog.refresh(units);
      zones.update(0.01,units);
      emit('exploration:ready',{zones:zones.getSummary(),fog:fog.getSummary()});
    },
    update(dt){
      if(disposed||!started||!Number.isFinite(dt)||dt<=0)return;
      const units=playerUnits();
      fog.update(dt,units);
      const step=Math.min(dt,.1);
      elapsed+=step;
      pendingZoneSeconds+=step;
      if(elapsed>=.12){
        elapsed=0;
        zones.update(pendingZoneSeconds,units);
        pendingZoneSeconds=0;
      }
    },
    render(ctx,camera){
      if(disposed||!started)return;
      fog.draw(ctx,camera);
      zones.draw(ctx,camera,fog,localeValue());
      miniMap.draw(ctx,camera);
    },
    onPointer(event){return !!(!disposed&&started&&miniMap.onPointer(event,scope.camera));},
    dispose(){
      if(disposed)return;
      disposed=true;
      miniMap.destroy();zones.destroy();fog.destroy();
      // The owning GameContext scope releases exploration service by itself.
    },
  };
}
export default createFeature;
