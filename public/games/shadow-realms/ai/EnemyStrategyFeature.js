/**
 * Shadow Realms — optional AI tactics via the EXISTING GameBootstrap registry.
 * No new enemy spawning: all units belong to the existing EnemyAI/WaveSystem.
 * The built-in EnemyAI repeatedly overwrites attack orders every .7s, so this
 * feature suspends ONLY that decision timer while active, reversibly.
 * Existing EnemyAI.update() continues to move every enemy on every frame.
 *
 * Final integration: register this feature in bootstrap/FeatureManifest.js,
 * pass {enemyAI,waves,combat,health,farmers,home} into GameBootstrap services.
 */
import {ThreatAnalyzer} from './ThreatAnalyzer.js';
import {EnemySquadSystem} from './EnemySquadSystem.js';
import {AmbushSystem} from './AmbushSystem.js';
import {BossEncounter} from './BossEncounter.js';

export function createFeature(scope){
  if(!scope||typeof scope.get!=='function')throw new TypeError('EnemyStrategyFeature needs GameContext');
  const enemyAI=scope.get('enemyAI'),waves=scope.get('waves'),combat=scope.get('combat'),health=scope.get('health');
  if(typeof enemyAI?.getUnits!=='function'||typeof waves?.getSummary!=='function'||
    typeof combat?.orderAttack!=='function'||typeof health?.damage!=='function')
    throw new TypeError('EnemyStrategyFeature needs enemyAI, waves, combat and health');
  const getPlayers=()=>{
    const list=scope.get('farmers',[]);
    return Array.isArray(list)?list.filter(u=>u?.team==='blue'&&u.alive!==false&&u.hp>0):[];
  };
  const emit=(kind,event,data)=>scope.emit(`enemy:${kind}-${event}`,data);
  const threat=new ThreatAnalyzer({getPlayers,home:scope.get('home',null)});
  const squads=new EnemySquadSystem({enemyAI,combat,threat,onEvent:(e,d)=>emit('squad',e,d)});
  const ambush=new AmbushSystem({map:scope.map,getPlayers,getEnemies:()=>enemyAI.getUnits(),
    onEvent:(e,d)=>emit('ambush',e,d)});
  const boss=new BossEncounter({waves,health,getPlayers,onEvent:(e,d)=>emit('boss',e,d)});
  const api=Object.freeze({threat,squads,ambush,boss,getSummary:()=>({squads:squads.getSummary(),boss:boss.getSummary()})});
  let oldWave=null,oldHealth=null,waveObserver=null,healthObserver=null;
  let oldDecision=null,takeover=false,disposed=false,started=false;
  return {
    ...api,
    start(){
      if(started)return;
      oldWave=waves.onEvent;oldHealth=health.onEvent;
      // Preserve mission, visual, progression and wave HUD listeners.
      waveObserver=function(name,data){
        try {oldWave?.call(waves,name,data);} finally {
          if(!disposed){boss.onWaveEvent(name,data);
            if(name==='enemy_spawned')squads.register(data?.unit);}
        }
      };
      healthObserver=function(name,data){
        try{oldHealth?.call(health,name,data);}finally{if(!disposed)boss.onHealthEvent(name,data);}
      };
      waves.onEvent=waveObserver;health.onEvent=healthObserver;
      // Keep EnemyAI movement and WaveSystem ownership, replace only decisions.
      if(typeof enemyAI.decisionTimer==='number'){
        oldDecision=enemyAI.decisionTimer;enemyAI.decisionTimer=Infinity;takeover=true;
      }
      for(const u of enemyAI.getUnits())squads.register(u);
      scope.provide('enemyStrategy',api);
      started=true;
      scope.emit('enemy:strategy-ready',api.getSummary());
    },
    update(dt){
      if(!started||disposed)return;
      if(takeover&&enemyAI.decisionTimer!==Infinity)enemyAI.decisionTimer=Infinity;
      ambush.update(dt);
      squads.update(dt,{focusId:ambush.getFocusId()});
      boss.update(dt);
    },
    render(ctx,camera){if(!disposed)boss.draw(ctx,camera);},
    onPointer(){return false;},
    dispose(){
      if(disposed)return;disposed=true;
      if(waves.onEvent===waveObserver)waves.onEvent=oldWave;
      if(health.onEvent===healthObserver)health.onEvent=oldHealth;
      if(takeover&&enemyAI.decisionTimer===Infinity)enemyAI.decisionTimer=oldDecision;
      boss.destroy();ambush.destroy();squads.destroy();
    },
  };
}
export default createFeature;
