/**
 * Shadow Realms — bootstrap adapter. NEVER owns the original game loop.
 * Add to FeatureManifest.js at the one-time final integration:
 * defineGameFeature({id:'base-defenses',dependsOn:['runtime-clock'],
 *   load:()=>import('../defense/DefenseFeature.js')});
 * Pass existing {rice,construction,health,projectiles,navigation,farmers/getUnits}
 * through GameBootstrap services. Service API: defense.place('spikes',{x,y}).
 */
import {DefenseSystem} from './DefenseSystem.js';
import {TrapSystem} from './TrapSystem.js';
import {TowerSystem} from './TowerSystem.js';
import {DEFENSE_BLUEPRINTS} from './DefenseBlueprints.js';

export function createFeature(scope){
  if(!scope||!scope.map||typeof scope.get!=='function')
    throw new TypeError('DefenseFeature requires GameContext scope');
  const construction=scope.get('construction'),rice=scope.get('rice'),health=scope.get('health');
  const projectiles=scope.get('projectiles');
  const navigation=scope.get('navigation',scope.get('route',null));
  const getUnits=()=>{
    const callback=scope.get('getUnits',null);
    if(typeof callback==='function')return callback()||[];
    const farmers=scope.get('farmers',[]),enemyAI=scope.get('enemyAI');
    return [...(Array.isArray(farmers)?farmers:[]),...(enemyAI?.getUnits?.()||[])];
  };
  const defense=new DefenseSystem({map:scope.map,construction,rice,navigation,getUnits,
    onEvent:(event,data)=>scope.emit('defense:'+event,data)});
  let traps,towers;
  try{
    traps=new TrapSystem({defense,health,getUnits,
      onEvent:(event,data)=>scope.emit('defense:trap-'+event,data)});
    towers=new TowerSystem({defense,projectiles,getUnits,
      onEvent:(event,data)=>scope.emit('defense:tower-'+event,data)});
  }catch(error){defense.destroy();throw error;}
  let armed=null,disposed=false;
  const api=Object.freeze({
    types:DEFENSE_BLUEPRINTS,
    getSummary:()=>defense.getSummary(),
    getStructures:()=>defense.getStructures(),
    getResources:()=>defense.getResources(),
    canAfford:type=>defense.canAfford(type),
    validate:(type,position)=>defense.validatePlacement(type,position),
    place:(type,position,options)=>defense.place(type,position,options),
    remove:id=>defense.remove(id),
    arm:type=>{if(!Object.hasOwn(DEFENSE_BLUEPRINTS,type))return false;armed=type;return true;},
    cancel:()=>{armed=null;},
    get armed(){return armed;},
  });
  return {
    start(){scope.provide('defense',api);scope.emit('defense:ready',defense.getSummary());},
    update(dt){if(disposed)return;defense.update(dt);traps.update(dt);towers.update(dt);},
    render(ctx,camera){if(!disposed)defense.draw(ctx,camera);},
    onPointer(event){
      if(disposed||!armed||!['tap','select'].includes(event?.kind))return false;
      const result=defense.place(armed,event.world);
      scope.emit('defense:placement-result',{type:armed,result});
      if(result.ok)armed=null;
      return true;
    },
    dispose(){if(disposed)return;disposed=true;armed=null;towers.destroy();traps.destroy();defense.destroy();},
  };
}
export default createFeature;
