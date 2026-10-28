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
  if(!scope || !scope.map || !scope.camera || typeof scope.get!=='function') {
    throw new TypeError('ExplorationFeature requires a bootstrap GameContext scope');
  }
  const allUnits = () => {
    const player = scope.get('farmers',[]);
    const units = scope.get('getUnits',null);
    if(typeof units==='function')return units() || [];
    return Array.isArray(player)?player:[];
  };
  const playerUnits = () => allUnits().filter(u=>u && u.team==='blue' && u.alive!==false);
  const map=scope.map;
  const fog = new FogOfWar(map);
  const zones = new StageZones(map,{onDiscover:zone=>scope.emit('exploration:zone-discovered',{...zone})});
  const miniMap = new MiniMap(map,{fog,zones,getUnits:allUnits});
  let disposed=false;
  let locale='km';
  const localeValue = () => {
    const lang = typeof document!=='undefined' ? document.documentElement.lang : 'km';
    return ['km','en','zh','ja','ko'].includes(lang)?lang:'en';
  };
  return {
    fog,zones,miniMap,
    start(){
      locale=localeValue();
      scope.provide('exploration',{fog,zones,miniMap});
      fog.refresh(playerUnits());
      zones.update(0.01,playerUnits());
      scope.emit('exploration:ready',{zones:zones.getSummary(),fog:fog.getSummary()});
    },
    update(dt){
      if(disposed)return;
      const units=playerUnits();
      fog.update(dt,units);
      zones.update(dt,units);
    },
    render(ctx,camera){
      if(disposed)return;
      fog.draw(ctx,camera);
      zones.draw(ctx,camera,fog,locale);
      miniMap.draw(ctx,camera);
    },
    onPointer(event){return !disposed && miniMap.onPointer(event,scope.camera);},
    dispose(){
      if(disposed)return;
      disposed=true;
      miniMap.destroy();zones.destroy();fog.destroy();
      // The owning GameContext scope releases exploration service by itself.
    },
  };
}
export default createFeature;
