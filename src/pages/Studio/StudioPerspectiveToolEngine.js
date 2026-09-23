import { studioLayerContext } from './StudioLayerEngine'
import { studioLayerCanEdit } from './StudioLayerGroupEngine'

function solve(matrix, target) {
  const rows = matrix.map((row, index) => [...row, target[index]])
  for (let col = 0; col < 8; col += 1) {
    let pivot = col
    for (let row = col + 1; row < 8; row += 1) if (Math.abs(rows[row][col]) > Math.abs(rows[pivot][col])) pivot = row
    if (Math.abs(rows[pivot][col]) < 1e-10) throw new Error('The perspective corners cannot form a valid shape.')
    ;[rows[col], rows[pivot]] = [rows[pivot], rows[col]]
    const divisor = rows[col][col]
    for (let j = col; j <= 8; j += 1) rows[col][j] /= divisor
    for (let row = 0; row < 8; row += 1) {
      if (row === col) continue
      const factor = rows[row][col]
      for (let j = col; j <= 8; j += 1) rows[row][j] -= factor * rows[col][j]
    }
  }
  return rows.map((row) => row[8])
}

function contains(corners, x, y, direction) {
  for (let i = 0; i < 4; i += 1) {
    const a = corners[i]
    const b = corners[(i + 1) % 4]
    if (((b.x - a.x) * (y - a.y) - (b.y - a.y) * (x - a.x)) * direction < -1e-6) return false
  }
  return true
}

export function applyStudioPerspectiveTransform(stack, { rect, corners, selection = null } = {}) {
  if (!studioLayerCanEdit(stack)) throw new Error('Select a visible, unlocked layer before using perspective.')
  const ctx = studioLayerContext(stack)
  const { width: canvasWidth, height: canvasHeight } = ctx.canvas
  if (canvasWidth !== stack.width || canvasHeight !== stack.height || canvasWidth * canvasHeight > 16777216) throw new Error('The layer is too large for perspective processing.')
  const { x, y, width, height } = rect || {}
  if (![x, y, width, height].every(Number.isInteger) || width < 1 || height < 1 || x < 0 || y < 0 || x + width > canvasWidth || y + height > canvasHeight) throw new Error('Invalid perspective source area.')
  if (!Array.isArray(corners) || corners.length !== 4 || !corners.every((point) => Number.isFinite(point?.x) && Number.isFinite(point?.y))) throw new Error('Choose four valid perspective corners.')
  if (selection && (selection.width !== canvasWidth || selection.height !== canvasHeight || selection.data?.length !== canvasWidth * canvasHeight)) throw new Error('Selection dimensions do not match the canvas.')
  let direction = 0
  for (let i = 0; i < 4; i += 1) {
    const a = corners[i]
    const b = corners[(i + 1) % 4]
    const c = corners[(i + 2) % 4]
    const cross = (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x)
    if (Math.abs(cross) < 1e-5 || (direction && Math.sign(cross) !== direction)) throw new Error('Perspective corners must form a convex quadrilateral.')
    direction = Math.sign(cross)
  }
  const target = [{ x, y }, { x: x + width, y }, { x: x + width, y: y + height }, { x, y: y + height }]
  const equations = []
  const values = []
  corners.forEach((corner, index) => {
    const source = target[index]
    equations.push([corner.x, corner.y, 1, 0, 0, 0, -corner.x * source.x, -corner.y * source.x])
    values.push(source.x)
    equations.push([0, 0, 0, corner.x, corner.y, 1, -corner.x * source.y, -corner.y * source.y])
    values.push(source.y)
  })
  const [a, b, c, d, e, f, g, h] = solve(equations, values)
  const original = ctx.getImageData(0, 0, canvasWidth, canvasHeight)
  const pixels = original.data
  const output = new Uint8ClampedArray(pixels)
  let occupied = false
  for (let py = y; py < y + height; py += 1) for (let px = x; px < x + width; px += 1) {
    const index = py * canvasWidth + px
    const mask = selection ? selection.data[index] / 255 : 1
    if (!mask) continue
    const offset = index * 4
    if (pixels[offset + 3]) occupied = true
    output[offset + 3] = Math.round(pixels[offset + 3] * (1 - mask))
  }
  if (!occupied) return false
  const left = Math.max(0, Math.floor(Math.min(...corners.map((point) => point.x))))
  const top = Math.max(0, Math.floor(Math.min(...corners.map((point) => point.y))))
  const right = Math.min(canvasWidth, Math.ceil(Math.max(...corners.map((point) => point.x))))
  const bottom = Math.min(canvasHeight, Math.ceil(Math.max(...corners.map((point) => point.y))))
  for (let py = top; py < bottom; py += 1) for (let px = left; px < right; px += 1) {
    const dx = px + 0.5
    const dy = py + 0.5
    if (!contains(corners, dx, dy, direction)) continue
    const divisor = g * dx + h * dy + 1
    if (Math.abs(divisor) < 1e-10) continue
    const sx = (a * dx + b * dy + c) / divisor
    const sy = (d * dx + e * dy + f) / divisor
    if (sx < x || sy < y || sx >= x + width || sy >= y + height) continue
    const sourceIndex = Math.floor(sy) * canvasWidth + Math.floor(sx)
    const mask = selection ? selection.data[sourceIndex] / 255 : 1
    if (!mask) continue
    const source = sourceIndex * 4
    const destination = (py * canvasWidth + px) * 4
    const sourceAlpha = pixels[source + 3] / 255 * mask
    const destinationAlpha = output[destination + 3] / 255
    const combined = sourceAlpha + destinationAlpha * (1 - sourceAlpha)
    if (!combined) continue
    for (let channel = 0; channel < 3; channel += 1) {
      output[destination + channel] = (pixels[source + channel] * sourceAlpha + output[destination + channel] * destinationAlpha * (1 - sourceAlpha)) / combined
    }
    output[destination + 3] = Math.round(combined * 255)
  }
  original.data.set(output)
  ctx.putImageData(original, 0, 0)
  return true
}
