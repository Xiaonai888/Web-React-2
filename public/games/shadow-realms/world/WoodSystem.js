/**
 * Shadow Realms — WoodSystem (Step 14).
 * Local-only forest harvesting, delivery, growth, and rendering.
 *
 * Reuses WorldMap.trees and WorldMap.foreground, so felled trees really stop
 * blocking Farmer / Pathfinding and disappear from the existing map painter.
 * No remote requests, persistence, assets, intervals, or animation loops.
 *
 *   const wood = new WoodSystem(map, {
 *     navigation, construction, getUnits: () => farmers,
 *     onClaimUnit: farmer => { /* stop its existing rice task *\/ },
 *   });
 *   wood.assign(selectedIds, clickedWorldPoint, { auto: true });
 *   // Called from the existing GameEngine loop, AFTER farmer.update(dt,map):
 *   wood.update(dt);
 *   // Called from GameEngine.onRender BEFORE WorldMap.drawForeground:
 *   wood.draw(ctx, camera);
 *   wood.cancel(unitId);     // Cancel one woodcutter (keeps carried logs).
 *   wood.destroy();         // Restores the original forest on game shutdown.
 *
 * ConstructionSystem owns the authoritative wood balance. Logs are credited
 * via construction.addWood(amount) ONLY after a worker returns to base.
 * A worker's woodCarry is kept separate from Farmer.carry (rice).
 */

const TWO_PI = Math.PI * 2;
const finite = n => Number.isFinite(n);
const pointOK = p => finite(p?.x) && finite(p?.y);
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const distanceSq = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

export class WoodSystem {
  constructor(map, {
    navigation,
    construction,
    getUnits = () => [],
    onClaimUnit = null,
    onReleaseUnit = null,
    onEvent = null,
    home = null,
    team = 'blue',
    chopSeconds = 5.5,
    regrowSeconds = 150,
    woodPerTree = 18,
    carryingCapacity = 36,
    choppingRange = 46,
    depositRange = 70,
    maxTargetDistance = Infinity,
  } = {}) {
    if (!map || !Array.isArray(map.trees) || !Array.isArray(map.foreground) ||
        typeof map.isWalkable !== 'function' || !finite(map.width) || !finite(map.height)) {
      throw new TypeError('WoodSystem requires the existing WorldMap.');
    }
    if (typeof navigation?.moveUnit !== 'function' ||
        typeof navigation?.invalidate !== 'function') {
      throw new TypeError('WoodSystem requires Pathfinding (moveUnit / invalidate).');
    }
    if (typeof construction?.addWood !== 'function' ||
        typeof construction?.getResources !== 'function') {
      throw new TypeError('WoodSystem requires ConstructionSystem (addWood / getResources).');
    }
    if (map.__shadowWoodSystem) throw new Error('Only one WoodSystem may own a WorldMap.');

    this.map = map;
    this.navigation = navigation;
    this.construction = construction;
    this.getUnits = typeof getUnits === 'function' ? getUnits : () => getUnits;
    this.onClaimUnit = typeof onClaimUnit === 'function' ? onClaimUnit : null;
    this.onReleaseUnit = typeof onReleaseUnit === 'function' ? onReleaseUnit : null;
    this.onEvent = typeof onEvent === 'function' ? onEvent : null;
    this.team = team;
    this.home = pointOK(home) ? { x: home.x, y: home.y }
      : map.getSpawnPoint?.(team) || { x: map.width * .13, y: map.height * .51 };
    this.config = {
      chopSeconds: clamp(finite(chopSeconds) ? chopSeconds : 5.5, .3, 120),
      regrowSeconds: clamp(finite(regrowSeconds) ? regrowSeconds : 150, 5, 3600),
      woodPerTree: Math.floor(clamp(finite(woodPerTree) ? woodPerTree : 18, 1, 100)),
      capacity: Math.floor(clamp(finite(carryingCapacity) ? carryingCapacity : 36, 1, 500)),
      choppingRange: clamp(finite(choppingRange) ? choppingRange : 46, 20, 110),
      depositRange: clamp(finite(depositRange) ? depositRange : 70, 25, 250),
      maxTargetDistance: finite(maxTargetDistance) && maxTargetDistance > 0
        ? maxTargetDistance : Infinity,
    };
    this.originalTrees = [...map.trees];
    this.originalForeground = [...map.foreground];
    this.trees = map.trees.map((item, index) => ({
      id: `wood-tree-${index + 1}`,
      source: item,
      foreground: map.foreground.find(o => o.type === 'tree' && o.x === item.x && o.y === item.y),
      x: item.x, y: item.y, size: item.size, tint: item.tint,
      alive: true, regrowIn: 0, fellCount: 0,
    }));
    this.byId = new Map(this.trees.map(t => [t.id, t]));
    this.jobs = new Map();             // Farmer id -> owned work state.
    this.reservations = new Map();     // Tree id -> Farmer id, avoids double harvest.
    this.time = 0;
    this.totalFelled = 0;
    this.totalCollected = 0;
    this.totalDelivered = 0;
    this.destroyed = false;
    map.__shadowWoodSystem = this;
  }

  #emit(name, detail = {}) {
    try { this.onEvent?.(name, detail); }
    catch (error) { console.warn('Shadow Realms wood event failed:', name, error); }
  }
  #units() {
    const candidates = this.getUnits();
    return Array.isArray(candidates) ? candidates : [];
  }
  #findUnit(id) { return this.#units().find(unit => unit.id === id) || null; }
  #canWork(unit) {
    return unit && unit.id != null && unit.team === this.team &&
      unit.alive !== false && unit.selectable !== false &&
      pointOK(unit) && typeof unit.setPath === 'function';
  }
  #isFull(unit) {
    const held = Math.max(0, finite(unit?.woodCarry) ? unit.woodCarry : 0);
    // Small custom capacities must still allow a partial load from a tree.
    return held >= this.config.capacity ||
      (held > 0 && held + this.config.woodPerTree > this.config.capacity);
  }
  #releaseReservation(job) {
    if (job.treeId && this.reservations.get(job.treeId) === job.unitId) {
      this.reservations.delete(job.treeId);
    }
    job.treeId = null;
  }
  #release(job, { stop = true } = {}) {
    const unit = this.#findUnit(job.unitId);
    this.#releaseReservation(job);
    this.jobs.delete(job.unitId);
    if (unit) {
      if (stop) unit.stop?.();
      unit.setHarvestAnimation?.(false);
      try { this.onReleaseUnit?.(unit); }
      catch (error) { console.warn('Shadow Realms wood release failed:', error); }
    }
  }

  /** All tree objects, including stumps awaiting regrowth. */
  getTrees() { return this.trees; }
  getTreeById(id) { return this.byId.get(id) || null; }
  getSummary() {
    const alive = this.trees.reduce((count, tree) => count + Number(tree.alive), 0);
    return {
      trees: this.trees.length, alive, felled: this.trees.length - alive,
      wood: this.construction.getResources().wood,
      workers: this.jobs.size,
      carried: this.#units().reduce((s, unit) => s + Math.max(0, unit.woodCarry || 0), 0),
      totalFelled: this.totalFelled,
      totalCollected: this.totalCollected,
      totalDelivered: this.totalDelivered,
      elapsedSeconds: this.time,
    };
  }
  getJobs() {
    return [...this.jobs.values()].map(job => ({
      unitId: job.unitId, treeId: job.treeId, phase: job.phase, auto: job.auto,
      progress: job.progress,
    }));
  }

  getNearestTree(point, { maxDistance = this.config.maxTargetDistance,
    includeReserved = false } = {}) {
    if (!pointOK(point)) return null;
    let nearest = null;
    let best = finite(maxDistance) && maxDistance >= 0 ? maxDistance ** 2 : Infinity;
    for (const tree of this.trees) {
      if (!tree.alive || (!includeReserved && this.reservations.has(tree.id))) continue;
      const d = distanceSq(point, tree);
      if (d < best) { nearest = tree; best = d; }
    }
    return nearest;
  }

  /** Check 16 directions outside a trunk; the center of a living tree is blocked. */
  getWorkPosition(treeOrId, unit = null) {
    const tree = typeof treeOrId === 'string' ? this.byId.get(treeOrId) : treeOrId;
    if (!tree?.alive) return null;
    const radius = unit?.radius || 14;
    const trunk = tree.size * .31 + radius + 8;
    const targetDistance = Math.min(this.config.choppingRange - 4, Math.max(trunk, 24));
    const options = [];
    for (let i = 0; i < 16; i++) {
      const angle = TWO_PI * i / 16;
      const x = tree.x + Math.cos(angle) * targetDistance;
      const y = tree.y + Math.sin(angle) * targetDistance;
      const point = { x, y };
      if (this.map.isWalkable(x, y, radius)) options.push(point);
    }
    options.sort((a, b) => distanceSq(a, unit || this.home) - distanceSq(b, unit || this.home));
    return options[0] || null;
  }

  /**
   * Assign one/many farmers. Clicking a specific tree prioritizes that tree;
   * all other workers take different nearby trees to prevent double chopping.
   * Returns a structured result; does not touch the existing game UI.
   */
  assign(unitIds, targetPoint = null, { auto = true } = {}) {
    if (this.destroyed) return { ok: false, reason: 'destroyed', assigned: 0 };
    const requested = [...new Set(Array.isArray(unitIds) ? unitIds : [unitIds])];
    const units = this.#units();
    const valid = requested.map(id => units.find(u => u.id === id)).filter(u => this.#canWork(u));
    if (!valid.length) return { ok: false, reason: 'no_workers', assigned: 0 };
    let assigned = 0;
    for (const unit of valid) {
      this.cancel(unit.id, { stop: false });
      try { this.onClaimUnit?.(unit); }
      catch (error) {
        this.#emit('claim_failed', { unitId: unit.id, error: String(error) });
        continue;
      }
      this.construction.removeBuilderFromAll?.(unit.id);
      const job = { unitId: unit.id, treeId: null, phase: 'seek', auto: Boolean(auto),
        target: pointOK(targetPoint) ? { x: targetPoint.x, y: targetPoint.y } : null,
        progress: 0, retryIn: 0, tried: new Set() };
      this.jobs.set(unit.id, job);
      if (this.#isFull(unit)) {
        this.#beginReturn(unit, job);
        assigned++;
      } else if (this.#findNextTree(unit, job)) {
        assigned++;
      } else {
        this.#release(job, { stop: false });
      }
    }
    if (assigned) this.#emit('assigned', { count: assigned, requested: valid.length });
    return { ok: assigned > 0, assigned, requested: valid.length,
      reason: assigned ? 'assigned' : 'no_reachable_trees' };
  }

  /** End wood task without destroying logs already carried by the unit. */
  cancel(unitId, { stop = true } = {}) {
    const job = this.jobs.get(unitId);
    if (!job) return false;
    this.#release(job, { stop });
    return true;
  }
  cancelAll() {
    const ids = [...this.jobs.keys()];
    ids.forEach(id => this.cancel(id));
    return ids.length;
  }

  /** Deposit carried logs only when the farmer physically reaches base. */
  deposit(unit, home = this.home) {
    if (!this.#canWork(unit) || !pointOK(home)) return { ok: false, reason: 'invalid_worker', amount: 0 };
    if (distance(unit, home) > this.config.depositRange) {
      return { ok: false, reason: 'too_far', amount: 0 };
    }
    const amount = Math.max(0, Math.floor(unit.woodCarry || 0));
    if (!amount) return { ok: false, reason: 'empty', amount: 0 };
    // Reserve logs BEFORE ConstructionSystem.onChange can call deposit again.
    // Snapshot the shared wood wallet so even a mutate-then-false adapter can
    // be compensated before returning the logs for retry.
    const beforeWood = this.construction.getResources().wood;
    unit.woodCarry = 0;
    let accepted = false;
    try { accepted = this.construction.addWood(amount) === true; }
    catch (error) { this.#emit('deposit_failed', { unitId: unit.id, error: String(error) }); }
    if (!accepted) {
      let restored = true;
      try {
        const current = this.construction.getResources().wood;
        if (current !== beforeWood) restored =
          this.construction.setWood?.(beforeWood) === true;
      } catch { restored = false; }
      // Do not refund the inventory if the ledger was credited but cannot be
      // rolled back: otherwise another deposit would duplicate its value.
      if (restored) unit.woodCarry = amount;
      return { ok: false, reason: restored ? 'ledger_rejected' : 'rollback_failed', amount: 0 };
    }
    this.totalDelivered += amount;
    this.#emit('deposited', { unitId: unit.id, amount, balance: this.construction.getResources().wood });
    return { ok: true, reason: 'deposited', amount };
  }

  #claimTree(unit, job, tree) {
    if (!tree?.alive || this.reservations.has(tree.id)) return false;
    const pos = this.getWorkPosition(tree, unit);
    if (!pos) return false;
    // Pathfinding is the only movement author. No direct teleporting.
    if (distance(unit, tree) > this.config.choppingRange - 4) {
      if (!this.navigation.moveUnit(unit, pos)) return false;
      job.phase = 'travel';
    } else {
      unit.stop?.();
      unit.setHarvestAnimation?.(true);
      job.phase = 'chop';
    }
    job.treeId = tree.id;
    job.progress = 0;
    job.retryIn = 0;
    this.reservations.set(tree.id, unit.id);
    return true;
  }

  #findNextTree(unit, job) {
    this.#releaseReservation(job);
    job.tried.clear();
    const candidates = this.trees.filter(tree => tree.alive && !this.reservations.has(tree.id));
    const anchor = job.target || unit;
    candidates.sort((a, b) => {
      const aScore = distanceSq(a, anchor) + distanceSq(a, unit) * .18;
      const bScore = distanceSq(b, anchor) + distanceSq(b, unit) * .18;
      return aScore - bScore;
    });
    // Long-distance path searches are expensive; cap per assignment.
    for (const tree of candidates.slice(0, 24)) {
      if (distance(tree, anchor) > this.config.maxTargetDistance) continue;
      if (this.#claimTree(unit, job, tree)) return true;
      job.tried.add(tree.id);
    }
    job.phase = 'waiting';
    job.retryIn = 2.5;
    return false;
  }

  #beginReturn(unit, job) {
    this.#releaseReservation(job);
    unit.setHarvestAnimation?.(false);
    if (distance(unit, this.home) <= this.config.depositRange) {
      const deposited = this.deposit(unit);
      if (deposited.ok || (unit.woodCarry || 0) === 0) this.#afterDeposit(unit, job);
      else { job.phase = 'retryReturn'; job.retryIn = 2; }
      return;
    }
    if (this.navigation.moveUnit(unit, this.home)) {
      job.phase = 'return';
      return;
    }
    // Search a reachable drop-off point inside the base delivery zone.
    for (let ring = 16; ring <= this.config.depositRange - 8; ring += 16) {
      for (let i = 0; i < 12; i++) {
        const angle = TWO_PI * i / 12;
        const point = { x: this.home.x + Math.cos(angle) * ring,
          y: this.home.y + Math.sin(angle) * ring };
        if (this.map.isWalkable(point.x, point.y, unit.radius) &&
            this.navigation.moveUnit(unit, point)) { job.phase = 'return'; return; }
      }
    }
    job.phase = 'retryReturn';
    job.retryIn = 2;
  }

  #afterDeposit(unit, job) {
    if (!job.auto) { this.#release(job, { stop: false }); return; }
    job.phase = 'seek';
    job.retryIn = 0;
  }

  #fellTree(unit, job, tree) {
    if (!tree.alive || this.reservations.get(tree.id) !== unit.id) return false;
    if (distance(unit, tree) > this.config.choppingRange) return false;
    const room = this.config.capacity - Math.max(0, finite(unit.woodCarry) ? unit.woodCarry : 0);
    if (room < 1) return false;
    const gathered = Math.min(this.config.woodPerTree, Math.floor(room));

    // Update BOTH tree collections: renderer and collision use different ones.
    const liveAt = this.map.trees.indexOf(tree.source);
    if (liveAt < 0) return false;
    this.map.trees.splice(liveAt, 1);
    const renderedAt = this.map.foreground.findIndex(item => item === tree.foreground);
    if (renderedAt >= 0) this.map.foreground.splice(renderedAt, 1);
    tree.alive = false;
    tree.regrowIn = this.config.regrowSeconds;
    tree.fellCount++;
    unit.woodCarry = Math.max(0, unit.woodCarry || 0) + gathered;
    this.totalFelled++;
    this.totalCollected += gathered;
    this.#releaseReservation(job);
    unit.setHarvestAnimation?.(false);
    this.navigation.invalidate();
    this.#emit('tree_felled', { treeId: tree.id, unitId: unit.id,
      collected: gathered, carried: unit.woodCarry });
    return true;
  }

  #regrow(tree) {
    if (tree.alive || this.map.trees.includes(tree.source)) return;
    // An occupying building or a worker on the stump delays regrowth.
    const blocked = !this.map.isWalkable(tree.x, tree.y, tree.size * .31 + 6) ||
      this.#units().some(unit => unit.alive !== false && pointOK(unit) &&
        distance(unit, tree) < tree.size * .31 + (unit.radius || 14) + 4);
    if (blocked) { tree.regrowIn = 4; return; }
    this.map.trees.push(tree.source);
    if (tree.foreground) this.map.foreground.push(tree.foreground);
    this.map.foreground.sort((a, b) => a.y - b.y);
    tree.alive = true;
    tree.regrowIn = 0;
    this.navigation.invalidate();
    this.#emit('tree_regrown', { treeId: tree.id });
  }

  update(dt) {
    if (this.destroyed || !finite(dt) || dt <= 0) return;
    const seconds = clamp(dt, 0, .1);
    this.time += seconds;

    for (const tree of this.trees) {
      if (tree.alive) continue;
      tree.regrowIn -= seconds;
      if (tree.regrowIn <= 0) this.#regrow(tree);
    }

    for (const [id, job] of [...this.jobs]) {
      const unit = this.#findUnit(id);
      if (!this.#canWork(unit)) { this.#release(job, { stop: false }); continue; }

      if (job.phase === 'seek') {
        if (this.#isFull(unit)) this.#beginReturn(unit, job);
        else if (!this.#findNextTree(unit, job) && (unit.woodCarry || 0) > 0) {
          this.#beginReturn(unit, job);
        }
      } else if (job.phase === 'travel') {
        const tree = this.byId.get(job.treeId);
        if (!tree?.alive || this.reservations.get(tree.id) !== id) {
          this.#releaseReservation(job); job.phase = 'seek';
        } else if (distance(unit, tree) <= this.config.choppingRange - 2) {
          unit.stop?.();
          unit.setHarvestAnimation?.(true);
          job.phase = 'chop'; job.progress = 0;
        } else if (unit.state !== 'walking') {
          this.#releaseReservation(job); job.phase = 'retrySeek'; job.retryIn = 1.3;
          this.#emit('blocked', { unitId: id, treeId: tree.id });
        }
      } else if (job.phase === 'chop') {
        const tree = this.byId.get(job.treeId);
        if (!tree?.alive || distance(unit, tree) > this.config.choppingRange + 1) {
          unit.setHarvestAnimation?.(false);
          this.#releaseReservation(job); job.phase = 'retrySeek'; job.retryIn = 1;
        } else {
          job.progress += seconds / this.config.chopSeconds;
          if (job.progress >= 1) {
            if (this.#fellTree(unit, job, tree)) {
              job.phase = this.#isFull(unit) ? 'returnPending' : 'seek';
            } else { job.phase = 'retrySeek'; job.retryIn = 1; }
          }
        }
      } else if (job.phase === 'returnPending') {
        this.#beginReturn(unit, job);
      } else if (job.phase === 'return') {
        if (distance(unit, this.home) <= this.config.depositRange) {
          unit.stop?.();
          const result = this.deposit(unit);
          if (result.ok || (unit.woodCarry || 0) === 0) this.#afterDeposit(unit, job);
          else { job.phase = 'retryReturn'; job.retryIn = 2; }
        } else if (unit.state !== 'walking') {
          job.phase = 'retryReturn'; job.retryIn = 2;
        }
      } else if (job.phase === 'waiting' || job.phase === 'retrySeek') {
        job.retryIn -= seconds;
        if (job.retryIn <= 0) job.phase = 'seek';
      } else if (job.phase === 'retryReturn') {
        job.retryIn -= seconds;
        if (job.retryIn <= 0) this.#beginReturn(unit, job);
      }
    }
  }

  /** Only stumps and worker progress. Living trees remain drawn by WorldMap. */
  draw(ctx, camera) {
    if (!ctx || !camera) return;
    ctx.save();
    ctx.translate(camera.viewportWidth / 2 - camera.x * camera.zoom,
      camera.viewportHeight / 2 - camera.y * camera.zoom * camera.tilt);
    ctx.scale(camera.zoom, camera.zoom * camera.tilt);
    const bounds = camera.getVisibleBounds?.() ||
      { left: 0, right: this.map.width, top: 0, bottom: this.map.height };
    for (const tree of this.trees) {
      if (tree.alive || tree.x < bounds.left - 24 || tree.x > bounds.right + 24 ||
          tree.y < bounds.top - 24 || tree.y > bounds.bottom + 24) continue;
      ctx.fillStyle = '#51402d';
      ctx.beginPath();
      ctx.ellipse(tree.x + 2, tree.y, 11, 5, 0, 0, TWO_PI);
      ctx.fill();
      ctx.fillStyle = '#b08a52';
      ctx.beginPath();
      ctx.ellipse(tree.x, tree.y - 3, 8, 3.6, 0, 0, TWO_PI);
      ctx.fill();
      ctx.strokeStyle = '#7b5937';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
    ctx.restore();

    // Chopping progress is screen-space, always readable on the tilted map.
    ctx.save();
    for (const job of this.jobs.values()) {
      if (job.phase !== 'chop' || !job.treeId) continue;
      const tree = this.byId.get(job.treeId);
      if (!tree?.alive) continue;
      const p = camera.worldToScreen(tree.x, tree.y);
      const width = clamp(camera.zoom * 34, 22, 68);
      ctx.fillStyle = 'rgba(30,32,25,.82)';
      ctx.fillRect(p.x - width / 2 - 2, p.y - 33, width + 4, 8);
      ctx.fillStyle = '#d6ad61';
      ctx.fillRect(p.x - width / 2, p.y - 31, width * clamp(job.progress, 0, 1), 4);
    }
    ctx.restore();
  }

  /** Restore source tree and foreground collections, release all worker jobs. */
  destroy() {
    if (this.destroyed) return;
    this.cancelAll();
    this.map.trees.splice(0, this.map.trees.length, ...this.originalTrees);
    this.map.foreground.splice(0, this.map.foreground.length, ...this.originalForeground);
    this.navigation.invalidate();
    if (this.map.__shadowWoodSystem === this) delete this.map.__shadowWoodSystem;
    this.destroyed = true;
  }
}

export default WoodSystem;
