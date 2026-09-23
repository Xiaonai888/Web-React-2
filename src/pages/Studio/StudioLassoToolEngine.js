export function createStudioLassoSelection(width, height, points) {
  if (![width, height].every((value) => Number.isInteger(value) && value > 0)) throw new Error('Invalid canvas dimensions.')
  if (!Array.isArray(points) || points.length < 3 || points.some((point) => !Number.isFinite(point?.x) || !Number.isFinite(point?.y))) throw new Error('A lasso needs at least three valid points.')
  const data = new Uint8Array(width * height)
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const point of points) {
    minX = Math.min(minX, point.x)
    minY = Math.min(minY, point.y)
    maxX = Math.max(maxX, point.x)
    maxY = Math.max(maxY, point.y)
  }
  const left = Math.max(0, Math.min(width, Math.floor(minX)))
  const top = Math.max(0, Math.min(height, Math.floor(minY)))
  const right = Math.max(0, Math.min(width, Math.ceil(maxX)))
  const bottom = Math.max(0, Math.min(height, Math.ceil(maxY)))
  for (let y = top; y < bottom; y += 1) {
    for (let x = left; x < right; x += 1) {
      const px = x + 0.5
      const py = y + 0.5
      let inside = false
      for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
        const a = points[i]
        const b = points[j]
        if ((a.y > py) !== (b.y > py) && px < (b.x - a.x) * (py - a.y) / (b.y - a.y) + a.x) inside = !inside
      }
      if (inside) data[y * width + x] = 255
    }
  }
  return { width, height, data, bounds: { x: left, y: top, width: right - left, height: bottom - top } }
}
