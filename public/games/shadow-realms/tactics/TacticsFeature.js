/**
 * Shadow Realms — FeatureRegistry adapter for Formation/Squad/Patrol.
 * Only manual commands change unit orders: existing farming, wood, missions,
 * selection, combat AI, wave spawning and health continue to own their state.
 *
 * LATER in FeatureManifest.js (NOT done in this step):
 * defineGameFeature({id:'world-tactics',dependsOn:['runtime-clock'],
 *   load:()=>import('../tactics/TacticsFeature.js')});
 * The one-time GameBootstrap bridge is installed in a final integration step.
 */
import {FormationSystem} from './FormationSystem.js';
import {SquadSystem} from './SquadSystem.js';
import {PatrolSystem} from './PatrolSystem.js';

export function createFeature(scope){
  if(!scope||!scope.map||typeof scope.get!=='function')
    throw new TypeError('TacticsFeature needs GameContext scope');
  const navigation=scope.get('navigation',scope.get('route',null));
  const combat=scope.get('combat',null);
  if(typeof navigation?.moveUnit!=='function')
    throw new Error('TacticsFeature requires existing navigation service');
  const allUnits=()=>{
    const get=scope.get('getUnits',null);
    if(typeof get==='function'){const result=get();return Array.isArray(result)?result:[];}
    const friends=scope.get('farmers',[]);
    const ai=scope.get('enemyAI',null);
    return [...(Array.isArray(friends)?friends:[]),...(ai?.getUnits?.()||[])];
  };
  const formation=new FormationSystem({map:scope.map,navigation});
  const claim=scope.get('claimTacticalUnit',null);
  const squads=new SquadSystem({getUnits:allUnits,formation,combat,
    onClaimUnit:typeof claim==='function'?claim:null,
    onEvent:(name,payload)=>scope.emit('tactics:squad-'+name,payload)});
  const patrol=new PatrolSystem({map:scope.map,navigation,combat,getUnits:allUnits,
    onEvent:(name,payload)=>scope.emit('tactics:patrol-'+name,payload)});
  const api=Object.freeze({formation,squads,patrol});
  let disposed=false;
  return {
    ...api,
    start(){scope.provide('tactics',api);scope.emit('tactics:ready',{enabled:true});},
    update(dt){if(disposed)return;squads.prune();patrol.update(dt);},
    render(ctx,camera){if(disposed)return;patrol.draw(ctx,camera);squads.draw(ctx,camera);},
    onPointer(){return false;}, // SelectionController stays the pointer owner.
    dispose(){if(disposed)return;disposed=true;patrol.destroy();squads.destroy();},
  };
}
export default createFeature;
