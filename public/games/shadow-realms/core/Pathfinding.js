/**
 * Shadow Realms — local A* navigation (Step 45: bounded, safe routing).
 *
 * Compatible with the existing WorldMap.getNavigationGrid(),
 * WorldMap.isWalkable(), and Farmer.setPath().
 *
 *   import { Pathfinding } from './core/Pathfinding.js'
 *   const navigation = new Pathfinding(engine.map)
 *   navigation.moveUnit(farmer, { x: 2050, y: 1040 })
 *
 * The route is an array of world-space waypoints ending at the exact target.
 * Empty array = blocked, unreachable, invalid request, or search limit reached.
 * If buildings later change walkable ground, call navigation.invalidate().
 * No API requests, workers, timers, storage, or external dependencies.
 */

const SQRT2 = Math.SQRT2
const DIRECTIONS = [
  [-1, 0, 1], [1, 0, 1], [0, -1, 1], [0, 1, 1],
  [-1, -1, SQRT2], [1, -1, SQRT2], [-1, 1, SQRT2], [1, 1, SQRT2],
]

const validPoint = point => Number.isFinite(point?.x) && Number.isFinite(point?.y)
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
const positive = (number, fallback) => Number.isFinite(number) && number > 0 ? number : fallback

class MinHeap {
  constructor() { this.items = [] }
  get length() { return this.items.length }

  push(entry) {
    const arr = this.items
    let at = arr.length
    arr.push(entry)
    while (at > 0) {
      const parent = (at - 1) >> 1
      if (arr[parent].score <= entry.score) break
      arr[at] = arr[parent]
      at = parent
    }
    arr[at] = entry
  }

  pop() {
    const arr = this.items
    if (!arr.length) return null
    const result = arr[0]
    const end = arr.pop()
    if (arr.length) {
      let at = 0
      for (;;) {
        let child = at * 2 + 1
        if (child >= arr.length) break
        if (child + 1 < arr.length && arr[child + 1].score < arr[child].score) child++
        if (arr[child].score >= end.score) break
        arr[at] = arr[child]
        at = child
      }
      arr[at] = end
    }
    return result
  }
}

export class Pathfinding {
  constructor(map, {
    cellSize = 32,
    radius = 14,
    maxVisited = 15000,
    endpointCandidates = 12,
  } = {}) {
    if (typeof map?.isWalkable !== 'function' ||
        typeof map?.getNavigationGrid !== 'function') {
      throw new TypeError('Pathfinding requires WorldMap with isWalkable() and getNavigationGrid().')
    }
    this.map = map
    this.cellSize = Math.max(20, Math.min(128, Math.round(positive(cellSize, 32))))
    this.radius = Math.max(0, Math.min(120, Number.isFinite(radius) ? radius : 14))
    this.maxVisited = Math.max(100, Math.min(50000, Math.floor(positive(maxVisited, 15000))))
    this.endpointCandidates = Math.max(1, Math.min(32, Math.floor(positive(endpointCandidates, 12))))
    this.gridCache = new Map()
  }

  /** Rebuild the navigation grid after buildings or terrain change. */
  invalidate() { this.gridCache.clear() }

  #grid(radius) {
    const key = `${this.cellSize}:${radius}`
    if (!this.gridCache.has(key)) {
      // The enemy roster uses only a few radii. Keep unusual custom unit
      // sizes from growing cached navigation grids without bound.
      if (this.gridCache.size >= 12) this.gridCache.clear()
      const grid = this.map.getNavigationGrid(this.cellSize, radius)
      if (!grid || !(grid.columns > 0 && grid.rows > 0) ||
          grid.cells?.length !== grid.columns * grid.rows) {
        throw new Error('WorldMap returned an invalid navigation grid.')
      }
      this.gridCache.set(key, grid)
    }
    return this.gridCache.get(key)
  }

  #center(grid, col, row, radius) {
    return {
      x: Math.min(this.map.width - radius, (col + 0.5) * grid.cellSize),
      y: Math.min(this.map.height - radius, (row + 0.5) * grid.cellSize),
    }
  }

  /** Continuous collision samples prevent shortcuts through rivers and trees. */
  clearSegment(from, to, radius = this.radius) {
    if (!validPoint(from) || !validPoint(to)) return false
    const r = Math.max(0, Math.min(120, Number.isFinite(radius) ? radius : this.radius))
    const gap = Math.max(6, Math.min(12, r * 0.65))
    const steps = Math.max(1, Math.ceil(distance(from, to) / gap))
    for (let step = 0; step <= steps; step++) {
      const portion = step / steps
      if (!this.map.isWalkable(
        from.x + (to.x - from.x) * portion,
        from.y + (to.y - from.y) * portion,
        r,
      )) return false
    }
    return true
  }

  #nearby(grid, point, radius) {
    const { columns, rows, cells, cellSize } = grid
    const col = Math.floor(point.x / cellSize)
    const row = Math.floor(point.y / cellSize)
    const candidates = []

    // The actual clicked point may be valid even when its grid-cell center
    // sits in a tree trunk. Search adjacent centers and test each connection.
    for (let ring = 0; ring <= 4; ring++) {
      for (let dy = -ring; dy <= ring; dy++) {
        for (let dx = -ring; dx <= ring; dx++) {
          if (ring && Math.max(Math.abs(dx), Math.abs(dy)) !== ring) continue
          const x = col + dx, y = row + dy
          if (x < 0 || y < 0 || x >= columns || y >= rows) continue
          const index = y * columns + x
          if (!cells[index]) continue
          const center = this.#center(grid, x, y, radius)
          candidates.push({ index, point: center, distance: distance(point, center) })
        }
      }
      if (candidates.length >= this.endpointCandidates * 2) break
    }

    candidates.sort((a, b) => a.distance - b.distance)
    const connected = []
    for (const candidate of candidates) {
      if (this.clearSegment(point, candidate.point, radius)) connected.push(candidate)
      if (connected.length >= this.endpointCandidates) break
    }
    return connected
  }

  #simplify(points, radius) {
    if (points.length <= 2) return points
    const answer = [points[0]]
    let current = 0
    while (current < points.length - 1) {
      // Test the final destination first, then use a bounded local lookahead.
      // Worst-case routes no longer scan every distant blocked segment.
      let next = points.length - 1
      if (!this.clearSegment(points[current], points[next], radius)) {
        next = Math.min(current + 20, points.length - 1)
        while (next > current + 1 &&
               !this.clearSegment(points[current], points[next], radius)) next--
      }
      answer.push(points[next])
      current = next
    }
    return answer
  }

  /**
   * Return safe waypoints, excluding start and including exact destination.
   * Use directly with farmer.setPath(result).
   */
  findPath(start, destination, { radius = this.radius, smooth = true } = {}) {
    if (!validPoint(start) || !validPoint(destination)) return []
    const r = Math.max(0, Math.min(120, Number.isFinite(radius) ? radius : this.radius))
    if (!this.map.isWalkable(start.x, start.y, r) ||
        !this.map.isWalkable(destination.x, destination.y, r)) return []
    // No need to issue a walking path when the unit is already at its goal.
    if (distance(start, destination) < 0.01) return [{ x: destination.x, y: destination.y }]
    if (this.clearSegment(start, destination, r)) return [{ ...destination }]

    const grid = this.#grid(r)
    const starts = this.#nearby(grid, start, r)
    const goals = this.#nearby(grid, destination, r)
    if (!starts.length || !goals.length) return []

    const { columns, rows, cells, cellSize } = grid
    const count = columns * rows
    const goalMap = new Map(goals.map(item => [item.index, item.distance]))
    const scores = new Float64Array(count).fill(Infinity)
    const previous = new Int32Array(count).fill(-1)
    const visited = new Uint8Array(count)
    const queue = new MinHeap()
    const pointAt = id => this.#center(grid, id % columns, Math.floor(id / columns), r)

    for (const item of starts) {
      if (item.distance >= scores[item.index]) continue
      scores[item.index] = item.distance
      queue.push({ id: item.index,
        cost: item.distance,
        score: item.distance + distance(item.point, destination) })
    }

    let found = -1
    let expanded = 0
    while (queue.length && expanded < this.maxVisited) {
      const next = queue.pop()
      const id = next.id
      if (visited[id] || next.cost > scores[id] + 1e-7) continue
      visited[id] = 1
      expanded++

      if (goalMap.has(id)) { found = id; break }
      const x = id % columns
      const y = Math.floor(id / columns)
      const from = pointAt(id)
      for (const [dx, dy, weight] of DIRECTIONS) {
        const nx = x + dx, ny = y + dy
        if (nx < 0 || ny < 0 || nx >= columns || ny >= rows) continue
        const neighbor = ny * columns + nx
        if (!cells[neighbor] || visited[neighbor]) continue
        const to = pointAt(neighbor)
        // With diagonals, also checks intermediate terrain: no corner cuts.
        if (!this.clearSegment(from, to, r)) continue
        const tentative = scores[id] + weight * cellSize
        if (tentative >= scores[neighbor] - 1e-7) continue
        scores[neighbor] = tentative
        previous[neighbor] = id
        queue.push({ id: neighbor, cost: tentative,
          score: tentative + distance(to, destination) })
      }
    }

    if (found < 0) return []
    const reversed = []
    for (let at = found; at !== -1; at = previous[at]) reversed.push(pointAt(at))
    reversed.reverse()
    // All endpoints and intermediate segments were collision checked.
    const raw = [{ x: start.x, y: start.y }, ...reversed,
      { x: destination.x, y: destination.y }]
    const route = smooth ? this.#simplify(raw, r) : raw
    return route.slice(1)
  }

  /** Route a Farmer (or any unit with x/y/radius/setPath). No game-loop changes. */
  moveUnit(unit, destination, options = {}) {
    if (!unit || unit.alive === false || !(unit.hp == null || unit.hp > 0) ||
        typeof unit.setPath !== 'function' || !validPoint(unit) || !validPoint(destination)) return false
    const path = this.findPath(unit, destination,
      { ...options, radius: options.radius ?? unit.radius ?? this.radius })
    // Existing selection/combat callers treat this Boolean as successful route.
    return path.length > 0 && unit.setPath(path) === true
  }
}

export default Pathfinding
