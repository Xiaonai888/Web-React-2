/**
 * Shadow Realms — Step 43: feature bridge for smarter EXISTING enemy units.
 * WaveSystem still owns every spawn; EnemyAI still updates movement.
 * Install reversible event observers, preserving Visual/Mission/XP/Boss events.
 * API: createFeature(scope) with start/update/render/onPointer/dispose.
 */
import {ThreatAnalyzer} from './ThreatAnalyzer.js';
import {EnemySquadSystem} from './EnemySquadSystem.js';
import {AmbushSystem} from './AmbushSystem.js';
import {BossEncounter} from './BossEncounter.js';

export function createFeature(scope) {
  if (!scope || typeof scope.get !== 'function')
    throw new TypeError('EnemyStrategyFeature needs GameContext');
  const enemyAI = scope.get('enemyAI');
  const waves = scope.get('waves');
  const combat = scope.get('combat');
  const health = scope.get('health');
  if (typeof enemyAI?.getUnits !== 'function' || typeof waves?.getSummary !== 'function' ||
      typeof combat?.orderAttack !== 'function' || typeof health?.damage !== 'function')
    throw new TypeError('EnemyStrategyFeature needs enemyAI, waves, combat and health');

  const getPlayers = () => {
    const roster = scope.get('farmers',[]);
    return Array.isArray(roster) ? roster.filter(u => u?.team === 'blue' &&
      u.alive !== false && Number.isFinite(u.hp) && u.hp > 0) : [];
  };
  const emit = (kind,event,data) => {
    try {scope.emit(`enemy:${kind}-${event}`,data);}
    catch {/* The game loop must survive observer/UI errors. */}
  };
  const threat = new ThreatAnalyzer({getPlayers,home:scope.get('home',null)});
  const squads = new EnemySquadSystem({enemyAI,combat,threat,
    onEvent:(event,data) => emit('squad',event,data)});
  const ambush = new AmbushSystem({map:scope.map,getPlayers,
    getEnemies:() => enemyAI.getUnits(),
    onEvent:(event,data) => emit('ambush',event,data)});
  const boss = new BossEncounter({waves,health,getPlayers,
    onEvent:(event,data) => emit('boss',event,data)});
  const api = Object.freeze({threat,squads,ambush,boss,getSummary:() => ({
    squads:squads.getSummary(),boss:boss.getSummary(),
    ambush:{active:ambush.getFocusId(),zones:ambush.getZones().length},
  })});
  let oldWave = null,oldHealth = null,waveObserver = null,healthObserver = null;
  let oldDecision = null,takeover = false,started = false,disposed = false;
  const reportError = (part,error) => {
    try {console.warn('Shadow Realms enemy strategy:',part,error);} catch {}
  };
  const restore = () => {
    if (waves.onEvent === waveObserver) waves.onEvent = oldWave;
    if (health.onEvent === healthObserver) health.onEvent = oldHealth;
    if (takeover && enemyAI.decisionTimer === Infinity) enemyAI.decisionTimer = oldDecision;
    takeover = false;
  };

  return {
    ...api,
    start() {
      if (started || disposed) return;
      oldWave = waves.onEvent;
      oldHealth = health.onEvent;
      waveObserver = function(name,data) {
        try {if (typeof oldWave === 'function') oldWave.call(waves,name,data);}
        catch(error) {reportError('prior wave observer',error);}
        if (disposed) return;
        try {boss.onWaveEvent(name,data);} catch(error) {reportError('boss wave',error);}
        if (name === 'enemy_spawned' && data?.unit) squads.register(data.unit);
      };
      healthObserver = function(name,data) {
        try {if (typeof oldHealth === 'function') oldHealth.call(health,name,data);}
        catch(error) {reportError('prior health observer',error);}
        if (!disposed) {
          try {boss.onHealthEvent(name,data);} catch(error) {reportError('boss health',error);}
        }
      };
      try {
        waves.onEvent = waveObserver;
        health.onEvent = healthObserver;
        if (typeof enemyAI.decisionTimer === 'number' && Number.isFinite(enemyAI.decisionTimer)) {
          oldDecision = enemyAI.decisionTimer;
          enemyAI.decisionTimer = Infinity;
          takeover = true;
        }
        for (const unit of enemyAI.getUnits()) squads.register(unit);
        scope.provide('enemyStrategy',api);
        started = true;
        emit('strategy','ready',api.getSummary());
      } catch(error) {
        restore();
        throw error;
      }
    },
    update(dt) {
      if (!started || disposed || !Number.isFinite(dt) || dt <= 0) return;
      if (takeover && enemyAI.decisionTimer !== Infinity) enemyAI.decisionTimer = Infinity;
      try {ambush.update(dt);} catch(error) {reportError('ambush',error);}
      try {squads.update(dt,{focusId:ambush.getFocusId()});}
      catch(error) {reportError('squads',error);}
      try {boss.update(dt);} catch(error) {reportError('boss update',error);}
    },
    render(ctx,camera) {if (!disposed && started) boss.draw(ctx,camera);},
    onPointer() {return false;},
    dispose() {
      if (disposed) return;
      disposed = true;
      restore();
      boss.destroy();ambush.destroy();squads.destroy();
    },
  };
}
export default createFeature;
