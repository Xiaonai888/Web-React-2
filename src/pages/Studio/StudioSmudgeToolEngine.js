const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value))

function validSelection(selection, width, height) {
  if (selection && (selection.width !== width || selection.height !== height || selection.data?.length !== width * height)) throw new Error('Selection dimensions do not match the canvas.')
}

function dab(ctx, stroke, x, y) {
  const { width, height } = ctx.canvas
  const { radius, strength, tip, diameter, selection } = stroke
  const left = Math.max(0, Math.floor(x - radius))
  const top = Math.max(0, Math.floor(y - radius))
  const right = Math.min(width, Math.ceil(x + radius + 1))
  const bottom = Math.min(height, Math.ceil(y + radius + 1))
  if (right <= left || bottom <= top) return false
  const image = ctx.getImageData(left, top, right - left, bottom - top)
  let changed = false
  for (let py = top; py < bottom; py += 1) {
    for (let px = left; px < right; px += 1) {
      const ox = px + 0.5 - x
      const oy = py + 0.5 - y
      const distance = Math.hypot(ox, oy) / radius
      if (distance >= 1) continue
      const mask = selection ? selection.data[py * width + px] / 255 : 1
      const blend = strength * mask * (1 - distance * distance)
      if (blend <= 0) continue
      const tipX = clamp(Math.floor(ox + radius), 0, diameter - 1)
      const tipY = clamp(Math.floor(oy + radius), 0, diameter - 1)
      const sourceOffset = (tipY * diameter + tipX) * 4
      const targetOffset = ((py - top) * image.width + px - left) * 4
      for (let channel = 0; channel < 4; channel += 1) {
        const original = image.data[targetOffset + channel]
        const pigment = tip[sourceOffset + channel]
        const mixed = original + (pigment - original) * blend
        if (Math.abs(mixed - original) >= 0.5) changed = true
        image.data[targetOffset + channel] = mixed
        tip[sourceOffset + channel] = pigment * 0.82 + original * 0.18
      }
    }
  }
  if (changed) ctx.putImageData(image, left, top)
  return changed
}

export function beginStudioSmudge(ctx, point, { size = 20, strength = 0.65, selection = null } = {}) {
  const canvas = ctx?.canvas
  if (!canvas?.width || !canvas?.height || typeof ctx.getImageData !== 'function' || typeof ctx.putImageData !== 'function') throw new Error('A canvas drawing context is required.')
  if (![point?.x, point?.y, size, strength].every(Number.isFinite) || size <= 0 || strength < 0 || strength > 1) throw new Error('Invalid smudge settings.')
  validSelection(selection, canvas.width, canvas.height)
  const diameter = Math.min(256, Math.max(2, Math.ceil(size)))
  const radius = diameter / 2
  const left = Math.floor(point.x - radius)
  const top = Math.floor(point.y - radius)
  const tip = new Float32Array(diameter * diameter * 4)
  const x0 = Math.max(0, left)
  const y0 = Math.max(0, top)
  const x1 = Math.min(canvas.width, left + diameter)
  const y1 = Math.min(canvas.height, top + diameter)
  if (x1 > x0 && y1 > y0) {
    const image = ctx.getImageData(x0, y0, x1 - x0, y1 - y0)
    for (let y = y0; y < y1; y += 1) {
      for (let x = x0; x < x1; x += 1) {
        const from = ((y - y0) * image.width + x - x0) * 4
        const to = ((y - top) * diameter + x - left) * 4
        for (let channel = 0; channel < 4; channel += 1) tip[to + channel] = image.data[from + channel]
      }
    }
  }
  return { last: { x: point.x, y: point.y }, diameter, radius, strength, selection, tip }
}

export function extendStudioSmudge(ctx, stroke, point) {
  if (!stroke || !ctx?.canvas || ![point?.x, point?.y].every(Number.isFinite)) throw new Error('Invalid smudge stroke.')
  const distance = Math.hypot(point.x - stroke.last.x, point.y - stroke.last.y)
  if (distance < 0.01) return false
  const steps = Math.min(512, Math.max(1, Math.ceil(distance / Math.max(1, stroke.radius * 0.35))))
  const start = stroke.last
  let changed = false
  for (let index = 1; index <= steps; index += 1) {
    const factor = index / steps
    changed = dab(ctx, stroke, start.x + (point.x - start.x) * factor, start.y + (point.y - start.y) * factor) || changed
  }
  stroke.last = { x: point.x, y: point.y }
  return changed
}
