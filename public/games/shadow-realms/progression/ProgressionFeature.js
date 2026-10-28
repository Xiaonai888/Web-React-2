/**
 * Shadow Realms — bridge via the EXISTING FeatureRegistry and HealthSystem.
 * Later register in bootstrap/FeatureManifest.js (NOT in index.html):
 * defineGameFeature({id:'unit-progression',dependsOn:['runtime-clock'],
 *   load:()=>import('../progression/ProgressionFeature.js')});
 * All features use existing unit objects and the existing rice/wood ledger.
 */
import {ExperienceSystem} from './ExperienceSystem.js';
import {ResearchSystem} from './ResearchSystem.js';
import {UnitUpgradeSystem} from './UnitUpgradeSystem.js';
import {RESEARCH_RULES} from './ProgressionRules.js';

export function createFeature(scope){
  if(!scope||typeof scope.get!=='function')throw new TypeError('ProgressionFeature needs GameContext scope');
  const health=scope.get('health'),rice=scope.get('rice'),construction=scope.get('construction');
  if(!health||typeof health.damage!=='function')throw new Error('ProgressionFeature needs existing HealthSystem');
  const getUnits=()=>{
    const getter=scope.get('getUnits',null);
    if(typeof getter==='function')return getter()||[];
    const farmers=scope.get('farmers',[]),enemy=scope.get('enemyAI',null);
    return [...(Array.isArray(farmers)?farmers:[]),...(enemy?.getUnits?.()||[])];
  };
  const experience=new ExperienceSystem({getUnits,onEvent:(name,payload)=>scope.emit('progression:'+name,payload)});
  const research=new ResearchSystem({rice,construction,onEvent:(name,payload)=>scope.emit('research:'+name,payload)});
  const upgrades=new UnitUpgradeSystem({getUnits,experience,research,
    onEvent:(name,payload)=>scope.emit('progression:'+name,payload)});
  const api=Object.freeze({experience,research,upgrades,types:RESEARCH_RULES,
    purchase:id=>research.purchase(id),
    unit:id=>experience.get(id),
    getSummary:()=>({experience:experience.getSummary(),research:research.getSummary()}),
  });
  let prior=null,observer=null,disposed=false;
  return {
    ...api,
    start(){
      // This is the only observation hook; preserve the Visual/Mission death handler.
      prior=health.onEvent;
      observer=function(event,payload){
        try{if(typeof prior==='function')prior.call(health,event,payload);}
        finally {if(!disposed)experience.onHealthEvent(event,payload);}
      };
      health.onEvent=observer;
      scope.provide('progression',api);
      upgrades.sync();
      scope.emit('progression:ready',api.getSummary());
    },
    update(){if(!disposed)upgrades.sync();},
    render(){},
    onPointer(){return false;},
    dispose(){
      if(disposed)return;disposed=true;
      if(health.onEvent===observer)health.onEvent=prior;
      upgrades.destroy();experience.reset();research.reset();
    },
  };
}
export default createFeature;
