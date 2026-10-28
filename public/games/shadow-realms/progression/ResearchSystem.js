/**
 * Shadow Realms — ResearchSystem (Step 40, complete single-file update).
 * One shared RiceSystem/ConstructionSystem wallet, no duplicated inventory.
 * Synchronous, verified Rice + Wood purchase with compensating rollback.
 * Reentrant purchases from onChange/onEvent are rejected, not charged twice.
 *
 * Preserves public API: getRank, getResources, getCost, canPurchase, purchase,
 * getBonuses, getSummary and reset. No fetch, storage, timer or new game loop.
 */
import {
  RESEARCH_RULES, researchCost, aggregateResearchBonuses,
} from './ProgressionRules.js';

const validAmount = value => Number.isSafeInteger(value) && value >= 0;
const ownRule = id => typeof id === 'string' && Object.hasOwn(RESEARCH_RULES, id);

export class ResearchSystem {
  constructor({rice, construction, onEvent = null} = {}) {
    if (typeof rice?.getResources !== 'function' ||
        typeof rice?.setStorageRice !== 'function' ||
        typeof construction?.getResources !== 'function' ||
        typeof construction?.setWood !== 'function') {
      throw new TypeError('ResearchSystem requires the existing RiceSystem and ConstructionSystem');
    }
    this.rice = rice;
    this.construction = construction;
    this.onEvent = typeof onEvent === 'function' ? onEvent : null;
    this.ranks = Object.fromEntries(Object.keys(RESEARCH_RULES).map(id => [id, 0]));
    this.version = 0;
    this.busy = false;
    this.purchases = 0;
    this.totalSpent = {rice: 0, wood: 0};
  }

  getRank(id) {
    return ownRule(id) ? this.ranks[id] : null;
  }

  /** Never cache wallet values: farmers and buildings change them at runtime. */
  getResources() {
    const r = this.rice.getResources();
    const w = this.construction.getResources();
    return {rice: r?.rice, wood: w?.wood};
  }

  getCost(id) {
    const rank = this.getRank(id);
    return rank === null ? null : researchCost(id, rank + 1);
  }

  canPurchase(id) {
    if (this.busy) return false;
    const cost = this.getCost(id);
    if (!cost) return false;
    try {
      const balance = this.getResources();
      return validAmount(balance.rice) && validAmount(balance.wood) &&
        balance.rice >= cost.rice && balance.wood >= cost.wood;
    } catch {
      return false;
    }
  }

  /** Restore either balance even if its setter threw after changing the ledger. */
  #rollback(before) {
    try {
      if (this.rice.getResources()?.rice !== before.rice)
        this.rice.setStorageRice(before.rice);
    } catch { /* Confirm the actual balance below. */ }
    try {
      if (this.construction.getResources()?.wood !== before.wood)
        this.construction.setWood(before.wood);
    } catch { /* onChange may throw after restoring the balance. */ }
    try {
      const now = this.getResources();
      return now.rice === before.rice && now.wood === before.wood;
    } catch {return false;}
  }

  purchase(id) {
    if (!ownRule(id)) return {ok: false, reason: 'unknown_research'};
    if (this.busy) return {ok: false, reason: 'busy'};
    const cost = this.getCost(id);
    if (!cost) return {ok: false, reason: 'max_rank'};

    // Lock before reading the ledgers: setWood may synchronously fire onChange.
    this.busy = true;
    try {
      let before;
      try {before = this.getResources();}
      catch {return {ok: false, reason: 'wallet_unavailable'};}
      if (!validAmount(before.rice) || !validAmount(before.wood))
        return {ok: false, reason: 'invalid_balance'};
      if (before.rice < cost.rice || before.wood < cost.wood)
        return {ok: false, reason: 'insufficient_resources', cost: {...cost}};

      const expected = {
        rice: before.rice - cost.rice,
        wood: before.wood - cost.wood,
      };
      let reason = null;
      let stage = 'rice';
      try {
        if (this.rice.setStorageRice(expected.rice) !== true ||
            this.rice.getResources()?.rice !== expected.rice) {
          reason = 'rice_payment_failed';
        } else {
          stage = 'wood';
          if (this.construction.setWood(expected.wood) !== true ||
              this.construction.getResources()?.wood !== expected.wood)
            reason = 'wood_payment_failed';
        }
      } catch {
        // A setter can mutate the wallet before its observer throws.
        reason = stage + '_payment_failed';
      }
      if (reason) {
        const restored = this.#rollback(before);
        return {ok: false, reason: restored ? reason : 'rollback_failed', cost: {...cost}};
      }

      // Only commit research AFTER both balances were verified.
      const rank = ++this.ranks[id];
      this.version++;
      this.purchases++;
      this.totalSpent.rice += cost.rice;
      this.totalSpent.wood += cost.wood;
      const result = {ok: true, id, rank, cost: {...cost}, bonuses: this.getBonuses()};
      try {this.onEvent?.('purchased', result);}
      catch (error) {console.warn('Shadow Realms research observer failed:', error);}
      return result;
    } finally {
      this.busy = false;
    }
  }

  getBonuses() {
    return aggregateResearchBonuses(this.ranks);
  }

  getSummary() {
    return {
      version: this.version,
      ranks: {...this.ranks},
      bonuses: this.getBonuses(),
      available: Object.keys(RESEARCH_RULES).filter(id => this.canPurchase(id)),
      resources: this.getResources(),
      purchases: this.purchases,
      totalSpent: {...this.totalSpent},
    };
  }

  reset() {
    if (this.busy) return false;
    for (const id of Object.keys(RESEARCH_RULES)) this.ranks[id] = 0;
    this.version++;
    this.purchases = 0;
    this.totalSpent = {rice: 0, wood: 0};
    // Research reset does not refund resources, matching the original API.
    return true;
  }
}

export default ResearchSystem;
