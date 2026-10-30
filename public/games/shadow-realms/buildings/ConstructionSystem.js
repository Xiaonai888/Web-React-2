const TAU = Math.PI * 2;
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const finite = n => Number.isFinite(n);
const pointOK = p => finite(p?.x) && finite(p?.y);
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

export const BUILDING_TYPES = Object.freeze({
  house: Object.freeze({
    name: 'Farmer House', width: 94, depth: 70, seconds: 10, productionSeconds: 10,
    cost: Object.freeze({ rice: 100, wood: 100 }),
    population: 4, riceStorage: 150,
  }),
  swordHouse: Object.freeze({
    name: 'Sword House', width: 106, depth: 78, seconds: 10, trainingSeconds: 10,
    cost: Object.freeze({ rice: 0, wood: 150 }),
    population: 0, riceStorage: 0,
  }),
  archerHouse: Object.freeze({
    name: 'Archer House', width: 108, depth: 80, seconds: 10, trainingSeconds: 10,
    cost: Object.freeze({ rice: 0, wood: 250 }),
    population: 0, riceStorage: 0,
  }),
  barn: Object.freeze({
    name: 'Barn', width: 108, depth: 80, seconds: 32,
    cost: Object.freeze({ rice: 20, wood: 60 }),
    population: 0, riceStorage: 200,
  }),
});


function poly(ctx, vertices, fill, line = null) {
  if (!vertices.length) return;
  ctx.beginPath();
  ctx.moveTo(vertices[0][0], vertices[0][1]);
  for (let i = 1; i < vertices.length; i++) ctx.lineTo(vertices[i][0], vertices[i][1]);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (line) { ctx.strokeStyle = line; ctx.lineWidth = 1.6; ctx.stroke(); }
}

function roundedRect(ctx, x, y, w, h, r, color) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function collisionWithRect(x, y, radius, building) {
  const dx = Math.max(Math.abs(x - building.x) - building.width / 2, 0);
  const dy = Math.max(Math.abs(y - building.y) - building.depth / 2, 0);
  return dx * dx + dy * dy <= radius * radius;
}

export class ConstructionSystem {
  constructor(map, {
    riceSystem = null,
    navigation = null,
    getUnits = () => [],
    startingRice = 80,
    startingWood = 180,
    maxBuildings = 10,
    basePopulation = 8,
    baseRiceStorage = 0,
    maxBuilders = 4,
    autoStarterHouse = true,
    renderer = null,
    onEvent = null,
    onChange = null,
  } = {}) {
    if (!map || !finite(map.width) || !finite(map.height) ||
        typeof map.isWalkable !== 'function' || typeof map.getTerrainAt !== 'function') {
      throw new TypeError('ConstructionSystem requires an existing WorldMap.');
    }
    if (riceSystem != null && (typeof riceSystem.getResources !== 'function' ||
        typeof riceSystem.setStorageRice !== 'function')) {
      throw new TypeError('riceSystem must support getResources() and setStorageRice().');
    }
    if (navigation != null && (typeof navigation.moveUnit !== 'function' ||
        typeof navigation.invalidate !== 'function')) {
      throw new TypeError('navigation must be an existing Pathfinding instance.');
    }
    if (typeof map.isWalkable.__shadowConstructionOwner !== 'undefined') {
      throw new Error('A ConstructionSystem is already attached to this WorldMap.');
    }
    this.map = map;
    this.riceSystem = riceSystem;
    this.navigation = navigation;
    this.getUnits = typeof getUnits === 'function' ? getUnits : () => getUnits;
    this.rice = Math.max(0, Math.floor(finite(startingRice) ? startingRice : 80));
    this.wood = Math.max(0, Math.floor(finite(startingWood) ? startingWood : 180));
    this.maxBuildings = Math.floor(clamp(finite(maxBuildings) ? maxBuildings : 10, 1, 10));
    this.basePopulation = Math.max(0, Math.floor(basePopulation) || 0);
    this.baseRiceStorage = Math.max(0, Math.floor(baseRiceStorage) || 0);
    this.maxBuilders = clamp(Math.floor(maxBuilders) || 4, 1, 12);
    this.renderer = typeof renderer === 'function' ? renderer : null;
    this.onEvent = typeof onEvent === 'function' ? onEvent : null;
    this.onChange = typeof onChange === 'function' ? onChange : null;
    this.buildings = [];
    this.byId = new Map();
    this.nextId = 1;
    this.time = 0;
    this.preview = null;
    this.destroyed = false;
    this.placing = false;
    this.originalWalkable = map.isWalkable;
    const owner = this;
    const wrapped = function (x, y, radius = 13) {
      if (!owner.originalWalkable.call(this, x, y, radius)) return false;
      if (!finite(x) || !finite(y)) return false;
      const r = Math.max(0, finite(radius) ? radius : 13);
      for (const structure of owner.buildings) {
        if (collisionWithRect(x, y, r, structure)) return false;
      }
      return true;
    };
    wrapped.__shadowConstructionOwner = this;
    this.wrappedWalkable = wrapped;
    map.isWalkable = wrapped;
    this.#invalidateNavigation();
    if (autoStarterHouse) {
      const starter = this.createStarterHouse();
      if (!starter.ok) console.warn('Shadow Realms starter house unavailable:', starter.reason);
    }
  }

  #checkLive() {
    if (this.destroyed) throw new Error('ConstructionSystem was destroyed.');
  }

  #emit(name, payload) {
    try { this.onEvent?.(name, payload); }
    catch (error) { console.warn('Shadow Realms construction event failed:', name, error); }
  }

  #changed() {
    try { this.onChange?.(this.getSummary()); }
    catch (error) { console.warn('Shadow Realms construction observer failed:', error); }
  }

  #invalidateNavigation() {
    try { this.navigation?.invalidate?.(); }
    catch (error) { console.warn('Shadow Realms construction path update failed:', error); }
  }

  #riceBalance() {
    const value = this.riceSystem?.getResources()?.rice ?? this.rice;
    return Math.max(0, Math.floor(finite(value) ? value : 0));
  }
  setWood(value) {
    this.#checkLive();
    if (!finite(value) || value < 0 || !Number.isSafeInteger(Math.floor(value))) return false;
    this.wood = Math.floor(value);
    this.#changed();
    return true;
  }

  addWood(value) {
    this.#checkLive();
    if (!finite(value) || value < 1 || !Number.isSafeInteger(Math.floor(value)) ||
        !Number.isSafeInteger(this.wood + Math.floor(value))) return false;
    this.wood += Math.floor(value);
    this.#changed();
    return true;
  }
  #setRice(value) {
    const amount = Math.max(0, Math.floor(value));
    if (this.riceSystem) return this.riceSystem.setStorageRice(amount) === true;
    this.rice = amount;
    return true;
  }

  getResources() {
    let population = this.basePopulation;
    let riceStorage = this.baseRiceStorage;
    for (const b of this.buildings) {
      if (b.state !== 'complete') continue;
      population += BUILDING_TYPES[b.type].population;
      riceStorage += BUILDING_TYPES[b.type].riceStorage;
    }
    return { rice: this.#riceBalance(), wood: this.wood,
      populationCapacity: population, riceStorageCapacity: riceStorage };
  }

  canAfford(type) {
    const definition = BUILDING_TYPES[type];
    if (!definition) return false;
    return this.#riceBalance() >= definition.cost.rice &&
      this.wood >= definition.cost.wood;
  }

  getBuildings() { return this.buildings; }
  getBuildingById(id) { return this.byId.get(id) || null; }

  createStarterHouse(origin = this.map.getSpawnPoint?.('blue')) {
    this.#checkLive();
    const existing = this.buildings.find(b => b.isStarter === true);
    if (existing) return { ok: true, reason: 'already_exists', building: existing };
    if (this.buildings.length >= this.maxBuildings) {
      return { ok: false, reason: 'limit_reached' };
    }
    if (!pointOK(origin)) return { ok: false, reason: 'invalid_origin' };
    const position = this.findNearbyPosition('house', origin, 900);
    if (!position) return { ok: false, reason: 'no_safe_position' };
    const spec = BUILDING_TYPES.house;
    const building = {
      id: `building-${this.nextId++}`, type: 'house',
      x: position.x, y: position.y,
      width: spec.width, depth: spec.depth,
      state: 'complete', progress: 1,
      secondsRequired: spec.seconds, elapsedWork: spec.seconds,
      cost: { rice: 0, wood: 0 },
      builders: new Set(),
      builtAt: this.time, completedAt: this.time,
      isStarter: true,
      _lastProgressSignal: 20,
      _nextRoute: new Map(),
    };
    this.buildings.push(building);
    this.byId.set(building.id, building);
    this.#invalidateNavigation();
    this.#emit('starter_created', { building, resources: this.getResources() });
    this.#changed();
    return { ok: true, reason: 'created', building };
  }

  getCompletedHouses(type = 'house') {
    return this.buildings.filter(b => b.state === 'complete' && b.type === type);
  }

  getNearestHouse(point, type = 'house') {
    if (!pointOK(point)) return null;
    const houses = this.getCompletedHouses(type);
    if (!houses.length) return null;
    return houses.reduce((best, next) =>
      dist(next, point) < dist(best, point) ? next : best);
  }
  validatePlacement(type, position) {
    if (!BUILDING_TYPES[type]) return { ok: false, reason: 'unknown_type' };
    if (this.destroyed) return { ok: false, reason: 'destroyed' };
    if (this.placing) return { ok: false, reason: 'busy' };
    if (!pointOK(position)) return { ok: false, reason: 'invalid_position' };
    if (this.buildings.length >= this.maxBuildings) return { ok: false, reason: 'limit_reached' };
    const definition = BUILDING_TYPES[type];
    const hw = definition.width / 2, hd = definition.depth / 2;
    const x = position.x, y = position.y;
    if (x - hw < 25 || x + hw > this.map.width - 25 ||
        y - hd < 25 || y + hd > this.map.height - 25) {
      return { ok: false, reason: 'outside_map' };
    }
    const base = this.map.getSpawnPoint?.('blue');
    if (pointOK(base) && dist(position, base) < 125) {
      return { ok: false, reason: 'base_clearance' };
    }
    const redBase = this.map.getSpawnPoint?.('red');
    if (pointOK(redBase) && dist(position, redBase) < 125) {
      return { ok: false, reason: 'base_clearance' };
    }
    for (let sy = y - hd - 7; sy <= y + hd + 8; sy += 12) {
      for (let sx = x - hw - 7; sx <= x + hw + 8; sx += 12) {
        if (this.map.getTerrainAt(sx, sy) !== 'grass') {
          return { ok: false, reason: 'terrain_blocked' };
        }
        if (!this.originalWalkable.call(this.map, sx, sy, 4)) {
          return { ok: false, reason: 'terrain_blocked' };
        }
      }
    }
    for (const sx of [x - hw - 7, x + hw + 7]) {
      for (const sy of [y - hd - 7, y + hd + 7]) {
        if (this.map.getTerrainAt(sx, sy) !== 'grass' ||
            !this.originalWalkable.call(this.map, sx, sy, 4)) {
          return { ok: false, reason: 'terrain_blocked' };
        }
      }
    }

    const allFields = this.riceSystem?.getFields?.() || [];
    for (const field of allFields) {
      if (Math.abs(x - field.x) < hw + field.width / 2 + 24 &&
          Math.abs(y - field.y) < hd + field.height / 2 + 24) {
        return { ok: false, reason: 'rice_field' };
      }
    }
    for (const other of this.buildings) {
      if (Math.abs(x - other.x) < hw + other.width / 2 + 18 &&
          Math.abs(y - other.y) < hd + other.depth / 2 + 18) {
        return { ok: false, reason: 'overlap' };
      }
    }
    return { ok: true, reason: 'ready' };
  }

  startPlacement(type) {
    this.#checkLive();
    if (!BUILDING_TYPES[type]) return { ok: false, reason: 'unknown_type' };
    this.preview = { type, x: null, y: null, valid: false, reason: 'no_position' };
    this.#emit('preview_started', { type });
    return { ok: true, type };
  }

  setPreview(point) {
    if (!this.preview || !pointOK(point)) return { ok: false, reason: 'no_preview' };
    const status = this.validatePlacement(this.preview.type, point);
    this.preview = { ...this.preview, x: point.x, y: point.y,
      valid: status.ok, reason: status.reason };
    return status;
  }

  cancelPlacement() {
    const wasActive = !!this.preview;
    this.preview = null;
    if (wasActive) this.#emit('preview_cancelled', {});
    return wasActive;
  }

  confirmPlacement(builderIds = []) {
    if (!this.preview || !pointOK(this.preview)) {
      return { ok: false, reason: 'no_preview' };
    }
    const { type, x, y } = this.preview;
    const result = this.place(type, { x, y }, { builderIds });
    if (result.ok) this.cancelPlacement();
    return result;
  }
  place(type, point, { builderIds = [] } = {}) {
    this.#checkLive();
    const status = this.validatePlacement(type, point);
    if (!status.ok) return status;
    if (!this.canAfford(type)) return { ok: false, reason: 'insufficient_resources' };
    const spec = BUILDING_TYPES[type];
    const before = this.#riceBalance();
    const beforeWood = this.wood;
    this.placing = true;
    try {
      let paid = false;
      try { paid = this.#setRice(before - spec.cost.rice) === true; }
      catch { paid = false; }
      if (!paid) {
        let restored = false;
        try { restored = this.#setRice(before) === true; } catch { }
        return { ok: false, reason: restored ? 'rice_payment_failed' : 'rollback_failed' };
      }
      this.wood = beforeWood - spec.cost.wood;
      const building = {
      id: `building-${this.nextId++}`,
      type, x: point.x, y: point.y,
      width: spec.width, depth: spec.depth,
      state: 'construction', progress: 0,
      secondsRequired: spec.seconds, elapsedWork: 0,
      cost: { ...spec.cost }, builders: new Set(),
      builtAt: this.time, completedAt: null,
      _lastProgressSignal: -1,
      _nextRoute: new Map(),
    };
    this.buildings.push(building);
    this.byId.set(building.id, building);
    this.#invalidateNavigation();
    if (builderIds.length) this.assignBuilders(building.id, builderIds);
    this.#emit('placed', { building, resources: this.getResources() });
    this.#changed();
    return { ok: true, reason: 'placed', building };
    } finally { this.placing = false; }
  }
  findNearbyPosition(type, origin, maxDistance = 420) {
    if (!BUILDING_TYPES[type] || !pointOK(origin)) return null;
    const limit = finite(maxDistance) ? clamp(maxDistance, 0, 3000) : 420;
    for (let radius = 0; radius <= limit; radius += 24) {
      const count = radius === 0 ? 1 : Math.max(12, Math.ceil(TAU * radius / 38));
      for (let i = 0; i < count; i++) {
        const angle = TAU * i / count;
        const point = { x: origin.x + Math.cos(angle) * radius,
          y: origin.y + Math.sin(angle) * radius };
        if (this.validatePlacement(type, point).ok) return point;
      }
    }
    return null;
  }
  findWorkPosition(building, unit) {
    if (!building || !pointOK(unit)) return null;
    const margin = Math.max(17, unit.radius || 14) + 9;
    const positions = [
      { x: building.x - building.width / 2 - margin, y: building.y },
      { x: building.x + building.width / 2 + margin, y: building.y },
      { x: building.x, y: building.y - building.depth / 2 - margin },
      { x: building.x, y: building.y + building.depth / 2 + margin },
      { x: building.x - building.width / 2 - margin, y: building.y - building.depth / 2 - margin },
      { x: building.x + building.width / 2 + margin, y: building.y - building.depth / 2 - margin },
      { x: building.x - building.width / 2 - margin, y: building.y + building.depth / 2 + margin },
      { x: building.x + building.width / 2 + margin, y: building.y + building.depth / 2 + margin },
    ];
    positions.sort((a, b) => dist(a, unit) - dist(b, unit));
    return positions.find(p => this.map.isWalkable(p.x, p.y, unit.radius || 14)) || null;
  }
  assignBuilders(id, ids = []) {
    this.#checkLive();
    const building = this.byId.get(id);
    if (!building || building.state !== 'construction') {
      return { ok: false, reason: 'not_under_construction' };
    }
    const available = new Map((this.getUnits() || [])
      .filter(u => u && u.alive !== false && u.team === 'blue' &&
        u.selectable !== false && u.isCivilian !== false && !u.combatTraining &&
        !u.training && typeof u.setPath === 'function')
      .map(unit => [unit.id, unit]));
    const requested = [...new Set(Array.isArray(ids) ? ids : [ids])];
    let accepted = 0;
    for (const unitId of requested) {
      if (building.builders.size >= this.maxBuilders) break;
      const unit = available.get(unitId);
      if (!unit) continue;
      for (const other of this.buildings) {
        if (other !== building) other.builders.delete(unitId);
      }
      if (!building.builders.has(unitId)) {
        building.builders.add(unitId);
        unit.setHarvestAnimation?.(false);
        unit.stop?.();
        accepted++;
      }
      building._nextRoute.delete(unitId);
    }
    if (accepted) this.#emit('builders_assigned', { id, count: accepted });
    return { ok: accepted > 0, accepted,
      assigned: [...building.builders], reason: accepted ? 'assigned' : 'no_eligible_units' };
  }

  removeBuilder(id, unitId) {
    const building = this.byId.get(id);
    if (!building) return false;
    building._nextRoute.delete(unitId);
    return building.builders.delete(unitId);
  }

  removeBuilderFromAll(unitId) {
    let removed = 0;
    for (const building of this.buildings) {
      if (building.builders.delete(unitId)) removed++;
      building._nextRoute.delete(unitId);
    }
    return removed;
  }
  update(dt) {
    if (this.destroyed || !finite(dt) || dt <= 0) return;
    const seconds = clamp(dt, 0, 0.1);
    this.time += seconds;
    const units = new Map((this.getUnits() || []).map(u => [u.id, u]));
    for (const building of this.buildings) {
      if (building.state !== 'construction') continue;
      let working = 0;
      for (const unitId of [...building.builders]) {
        const farmer = units.get(unitId);
        if (!farmer || farmer.alive === false || farmer.isCivilian === false ||
            farmer.combatTraining || farmer.training) {
          building.builders.delete(unitId);
          continue;
        }
        const workPoint = this.findWorkPosition(building, farmer);
        if (!workPoint) continue;
        const reach = Math.hypot(building.width / 2 + 34, building.depth / 2 + 34);
        const nearby = dist(farmer, building) <= reach;
        if (nearby && farmer.state !== 'walking' && farmer.state !== 'harvesting') {
          working++;
          continue;
        }
        if (farmer.state === 'walking') continue;
        if (!this.navigation || !pointOK(workPoint)) continue;
        if (this.time < (building._nextRoute.get(unitId) || 0)) continue;
        const moved = this.navigation.moveUnit(farmer, workPoint);
        building._nextRoute.set(unitId, this.time + (moved ? 2.5 : 5));
        if (!moved) this.#emit('builder_route_failed', { id: building.id, unitId });
      }
      if (!working) continue;
      const multiplier = 1;
      building.elapsedWork = Math.min(building.secondsRequired,
        building.elapsedWork + seconds * multiplier);
      if (building.elapsedWork >= building.secondsRequired - 1e-8) {
        building.elapsedWork = building.secondsRequired;
      }
      building.progress = building.elapsedWork / building.secondsRequired;
      const milestone = Math.floor(building.progress * 20);
      if (milestone > building._lastProgressSignal) {
        building._lastProgressSignal = milestone;
        this.#emit('progress', { id: building.id, progress: building.progress });
      }
      if (building.progress >= 1) {
        building.state = 'complete';
        building.completedAt = this.time;
        building.builders.clear();
        building._nextRoute.clear();
        this.#emit('completed', { building, resources: this.getResources() });
        this.#changed();
      }
    }
  }
  cancelConstruction(id) {
    this.#checkLive();
    const building = this.byId.get(id);
    if (!building || building.state !== 'construction') {
      return { ok: false, reason: 'not_under_construction' };
    }
    const refundRate = building.progress === 0 ? 1 : 0.7 * (1 - building.progress);
    const refund = {
      rice: Math.floor(building.cost.rice * refundRate),
      wood: Math.floor(building.cost.wood * refundRate),
    };
    if (!this.#setRice(this.#riceBalance() + refund.rice)) {
      return { ok: false, reason: 'refund_failed' };
    }
    this.wood += refund.wood;
    this.#removeBuilding(building);
    this.#emit('cancelled', { id, refund });
    this.#changed();
    return { ok: true, refund };
  }
  demolish(id) {
    this.#checkLive();
    const building = this.byId.get(id);
    if (!building || building.state !== 'complete') {
      return { ok: false, reason: 'not_complete' };
    }
    if (building.isStarter) return { ok: false, reason: 'starter_protected' };
    this.#removeBuilding(building);
    this.#emit('demolished', { id, type: building.type });
    this.#changed();
    return { ok: true };
  }

  #removeBuilding(building) {
    this.buildings = this.buildings.filter(b => b !== building);
    this.byId.delete(building.id);
    building.builders.clear();
    building._nextRoute.clear();
    this.#invalidateNavigation();
  }

  getBuildingAt(point, padding = 8) {
    if (!pointOK(point)) return null;
    for (let i = this.buildings.length - 1; i >= 0; i--) {
      const b = this.buildings[i];
      if (Math.abs(point.x - b.x) <= b.width / 2 + padding &&
          Math.abs(point.y - b.y) <= b.depth / 2 + padding) return b;
    }
    return null;
  }

  getSummary() {
    return {
      count: this.buildings.length,
      completed: this.buildings.filter(b => b.state === 'complete').length,
      sites: this.buildings.filter(b => b.state === 'construction').length,
      houses: this.buildings.filter(b => b.type === 'house' && b.state === 'complete').length,
      barns: this.buildings.filter(b => b.type === 'barn' && b.state === 'complete').length,
      swordHouses: this.getCompletedHouses('swordHouse').length,
      archerHouses: this.getCompletedHouses('archerHouse').length,
      starterHouse: this.buildings.find(b => b.isStarter === true)?.id || null,
      resources: this.getResources(),
      maxBuildings: this.maxBuildings,
    };
  }

  #world(ctx, camera, paint) {
    if (!ctx || !camera) return;
    ctx.save();
    ctx.translate(camera.viewportWidth / 2 - camera.x * camera.zoom,
      camera.viewportHeight / 2 - camera.y * camera.zoom * camera.tilt);
    ctx.scale(camera.zoom, camera.zoom * camera.tilt);
    paint(camera.getVisibleBounds());
    ctx.restore();
  }

  drawGround(ctx, camera) {
    this.#world(ctx, camera, bounds => {
      for (const b of this.buildings) {
        if (Math.abs(b.x - (bounds.left + bounds.right) / 2) >
              (bounds.right - bounds.left) / 2 + b.width ||
            Math.abs(b.y - (bounds.top + bounds.bottom) / 2) >
              (bounds.bottom - bounds.top) / 2 + b.depth) continue;
        ctx.fillStyle = b.state === 'complete' ? '#897954' : '#897c60';
        ctx.fillRect(b.x - b.width / 2, b.y - b.depth / 2, b.width, b.depth);
        ctx.strokeStyle = '#4d4b35';
        ctx.lineWidth = 3;
        ctx.strokeRect(b.x - b.width / 2, b.y - b.depth / 2, b.width, b.depth);
      }
    });
  }

  #drawHouse(ctx, b, buildingProgress) {
    const width = b.width;
    const half = width / 2;
    const height = 53;
    roundedRect(ctx, -half + 12, -height + 6, width - 24, height,
      4, '#c6a57b');
    poly(ctx, [[-half + 12, -height + 6], [half - 12, -height + 6],
      [half - 12, 5], [12, 10], [12, -6], [-12, -6], [-12, 10], [-half + 12, 5]], '#a98055');
    poly(ctx, [[half - 12, -height + 6], [half - 4, -height + 16],
      [half - 4, -3], [half - 12, 5]], '#8c684b');
    poly(ctx, [[-half - 5, -height + 11], [0, -height - 29],
      [half + 6, -height + 11], [half - 7, -height + 18],
      [0, -height - 10], [-half + 6, -height + 18]], '#633b32', '#3d302c');
    poly(ctx, [[-half - 5, -height + 11], [0, -height - 29],
      [0, -height - 10], [-half + 6, -height + 18]], '#ab6344');
    poly(ctx, [[0, -height - 29], [half + 6, -height + 11],
      [half - 7, -height + 18], [0, -height - 10]], '#81503d');
    for (let x = -half + 9; x < half - 4; x += 15) {
      ctx.strokeStyle = 'rgba(255,217,154,.21)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(x, -height + 5); ctx.lineTo(x + 4, -height - 6); ctx.stroke();
    }
    roundedRect(ctx, -11, -31, 22, 38, 3, '#66472c');
    roundedRect(ctx, -8, -28, 16, 32, 2, '#403a30');
    ctx.fillStyle = '#e8c66c';
    ctx.beginPath(); ctx.arc(5, -14, 2, 0, TAU); ctx.fill();
    for (const x of [-half + 20, half - 34]) {
      roundedRect(ctx, x, -34, 14, 13, 2, '#513d2d');
      roundedRect(ctx, x + 2, -32, 10, 9, 1, '#b5d8bf');
      ctx.strokeStyle = '#65422c'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x + 7, -32); ctx.lineTo(x + 7, -23); ctx.stroke();
    }
    if (buildingProgress < 1) this.#drawScaffolding(ctx, b, buildingProgress);
  }

  #drawTrainingHouse(ctx, b, progress) {
    this.#drawHouse(ctx, b, progress);
    const sword = b.type === 'swordHouse';
    ctx.save();
    ctx.fillStyle = sword ? '#4f557d' : '#466b62';
    ctx.fillRect(-b.width / 2 + 15, -45, b.width - 30, 5);
    ctx.strokeStyle = sword ? '#e2d3fb' : '#d2f1cb';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (sword) {
      ctx.moveTo(-16, -68); ctx.lineTo(16, -43);
      ctx.moveTo(16, -68); ctx.lineTo(-16, -43);
      ctx.moveTo(-19, -47); ctx.lineTo(-10, -56);
      ctx.moveTo(19, -47); ctx.lineTo(10, -56);
    } else {
      ctx.arc(-4, -55, 17, -Math.PI * 0.52, Math.PI * 0.52);
      ctx.moveTo(-5, -72); ctx.lineTo(-5, -38);
      ctx.moveTo(-5, -72); ctx.lineTo(17, -55);
    }
    ctx.stroke();
    ctx.restore();
  }

  #drawBarn(ctx, b, buildingProgress) {
    const half = b.width / 2;
    const height = 61;
    poly(ctx, [[-half + 11, -height], [half - 11, -height],
      [half - 11, 3], [-half + 11, 3]], '#b84e3b', '#6b3a2f');
    poly(ctx, [[half - 11, -height], [half - 1, -height + 10],
      [half - 1, -1], [half - 11, 3]], '#883c32');
    poly(ctx, [[-half - 3, -height + 3], [0, -height - 28],
      [half + 3, -height + 3], [half - 5, -height + 14],
      [0, -height - 9], [-half + 5, -height + 14]], '#6e4540', '#50312e');
    poly(ctx, [[-half - 3, -height + 3], [0, -height - 28],
      [0, -height - 9], [-half + 5, -height + 14]], '#a46b53');
    roundedRect(ctx, -19, -38, 38, 40, 2, '#6e4935');
    poly(ctx, [[-16, -34], [16, -34], [16, 0], [-16, 0]], '#c47a55');
    ctx.strokeStyle = '#794830'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-14, -33); ctx.lineTo(14, -1);
    ctx.moveTo(14, -33); ctx.lineTo(-14, -1); ctx.stroke();
    roundedRect(ctx, -8, -height + 1, 16, 12, 2, '#4a422e');
    if (buildingProgress < 1) this.#drawScaffolding(ctx, b, buildingProgress);
  }

  #drawScaffolding(ctx, b, progress) {
    const left = -b.width / 2 - 4;
    const right = b.width / 2 + 4;
    const top = b.type === 'house' ? -97 : -102;
    ctx.strokeStyle = '#9f8657'; ctx.lineWidth = 3.5;
    for (const x of [left, right]) {
      ctx.beginPath(); ctx.moveTo(x, 4); ctx.lineTo(x, top); ctx.stroke();
    }
    for (const y of [top + 19, -36]) {
      ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(right, y); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(30,37,31,.73)';
    ctx.fillRect(-b.width / 2, 14, b.width, 8);
    ctx.fillStyle = '#eac45c';
    ctx.fillRect(-b.width / 2, 14, b.width * progress, 8);
  }
  drawBuildings(ctx, camera) {
    if (!ctx || !camera) return;
    for (const b of [...this.buildings].sort((a, b) => a.y - b.y)) {
      const pos = camera.worldToScreen(b.x, b.y + b.depth / 2);
      const z = camera.zoom;
      if (pos.x < -b.width * z || pos.x > camera.viewportWidth + b.width * z ||
          pos.y < -140 * z || pos.y > camera.viewportHeight + 90 * z) continue;
      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.scale(z, z);
      ctx.fillStyle = 'rgba(20,35,24,.22)';
      ctx.beginPath();
      ctx.ellipse(6, 3, b.width * 0.52, 9, 0, 0, TAU);
      ctx.fill();
      const progress = b.state === 'complete' ? 1 : b.progress;
      if (progress < 1) ctx.globalAlpha = 0.2 + progress * 0.72;
      if (this.renderer) this.renderer(ctx, b, camera);
      else if (b.type === 'house') this.#drawHouse(ctx, b, progress);
      else if (b.type === 'swordHouse' || b.type === 'archerHouse') {
        this.#drawTrainingHouse(ctx, b, progress);
      } else this.#drawBarn(ctx, b, progress);
      ctx.restore();
    }
  }

  drawPreview(ctx, camera) {
    const preview = this.preview;
    if (!ctx || !camera || !pointOK(preview)) return;
    const spec = BUILDING_TYPES[preview.type];
    if (!spec) return;
    const color = preview.valid && this.canAfford(preview.type)
      ? 'rgba(110,245,132,.32)' : 'rgba(255,107,100,.32)';
    const outline = preview.valid && this.canAfford(preview.type)
      ? '#7bed96' : '#ff8580';
    this.#world(ctx, camera, () => {
      ctx.fillStyle = color;
      ctx.fillRect(preview.x - spec.width / 2, preview.y - spec.depth / 2,
        spec.width, spec.depth);
      ctx.strokeStyle = outline;
      ctx.lineWidth = 3;
      ctx.strokeRect(preview.x - spec.width / 2, preview.y - spec.depth / 2,
        spec.width, spec.depth);
    });
    const pos = camera.worldToScreen(preview.x, preview.y);
    ctx.save();
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fffbe6';
    ctx.shadowColor = '#000'; ctx.shadowBlur = 5;
    ctx.fillText(`${spec.name} · ${spec.cost.rice} rice + ${spec.cost.wood} wood`,
      pos.x, pos.y - 12);
    ctx.restore();
  }

  draw(ctx, camera) {
    this.drawGround(ctx, camera);
    this.drawBuildings(ctx, camera);
    this.drawPreview(ctx, camera);
  }

  destroy() {
    if (this.destroyed) return;
    if (this.map.isWalkable === this.wrappedWalkable) {
      this.map.isWalkable = this.originalWalkable;
    }
    this.#invalidateNavigation();
    this.buildings.length = 0;
    this.byId.clear();
    this.preview = null;
    this.destroyed = true;
  }
}

export default ConstructionSystem;
