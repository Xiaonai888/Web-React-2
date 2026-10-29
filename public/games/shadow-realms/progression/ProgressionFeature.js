/** Progression bridge for existing HealthSystem, shared Rice and Construction. */
import { ExperienceSystem } from './ExperienceSystem.js';
import { ResearchSystem } from './ResearchSystem.js';
import { UnitUpgradeSystem } from './UnitUpgradeSystem.js';
import { RESEARCH_RULES } from './ProgressionRules.js';

export function createFeature(scope) {
  if (!scope || typeof scope.get !== 'function' || typeof scope.provide !== 'function') {
    throw new TypeError('ProgressionFeature needs GameContext scope');
  }
  const health = scope.get('health');
  const rice = scope.get('rice');
  const construction = scope.get('construction');
  if (typeof health?.damage !== 'function') {
    throw new Error('ProgressionFeature needs existing HealthSystem');
  }
  const getUnits = () => {
    const getter = scope.get('getUnits', null);
    if (typeof getter === 'function') {
      const result = getter();
      return Array.isArray(result) ? result : [];
    }
    const farmers = scope.get('farmers', []);
    const enemy = scope.get('enemyAI', null);
    const enemies = enemy?.getUnits?.() || [];
    return [...(Array.isArray(farmers) ? farmers : []),
      ...(Array.isArray(enemies) ? enemies : [])];
  };
  const emit = (type, payload) => {
    try { scope.emit(type, payload); }
    catch (error) { console.warn('Shadow Realms progression event:', type, error); }
  };
  const experience = new ExperienceSystem({ getUnits,
    onEvent: (name, payload) => emit('progression:' + name, payload) });
  const research = new ResearchSystem({ rice, construction,
    onEvent: (name, payload) => emit('research:' + name, payload) });
  const upgrades = new UnitUpgradeSystem({ getUnits, experience, research,
    onEvent: (name, payload) => emit('progression:' + name, payload) });
  const api = Object.freeze({
    experience, research, upgrades, types: RESEARCH_RULES,
    purchase: id => research.purchase(id),
    unit: id => experience.get(id),
    getSummary: () => ({ experience: experience.getSummary(),
      research: research.getSummary() }),
  });
  let prior = null;
  let observer = null;
  let started = false;
  let disposed = false;

  const restoreObserver = () => {
    // A newer observer may still invoke ours. Keep its link to the prior
    // observer intact until the newer observer is released.
    if (observer && health.onEvent === observer) {
      health.onEvent = prior;
      observer = null;
      prior = null;
    }
  };
  const instance = {
    ...api,
    start() {
      if (started || disposed) return;
      prior = health.onEvent;
      observer = function(event, payload) {
        try {
          if (typeof prior === 'function') prior.call(health, event, payload);
        } catch (error) {
          console.warn('Shadow Realms prior health observer:', error);
        } finally {
          if (!disposed) {
            try { experience.onHealthEvent(event, payload); }
            catch (error) { console.warn('Shadow Realms experience health observer:', error); }
          }
        }
      };
      health.onEvent = observer;
      try {
        scope.provide('progression', api);
        upgrades.sync();
        started = true;
        emit('progression:ready', api.getSummary());
      } catch (error) {
        restoreObserver();
        throw error;
      }
    },
    update() {
      if (started && !disposed) upgrades.sync();
    },
    render() {},
    onPointer() { return false; },
    dispose() {
      if (disposed) return;
      disposed = true;
      started = false;
      restoreObserver();
      try { upgrades.destroy(); }
      finally {
        try { experience.reset(); }
        finally { research.reset(); }
      }
    },
  };
  return instance;
}

export default createFeature;
