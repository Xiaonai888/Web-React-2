const clamp = (value, low, high) => Math.max(low, Math.min(high, value))

export function applyStudioBlurDab(ctx, point, { size = 24, radius = 3, strength = 0.7, selection = null } = {}) {
  const canvas = ctx?.canvas
  if (!canvas?.width || !canvas?.height || typeof ctx.getImageData !== 'function' || typeof ctx.putImageData !== 'function') throw new Error('A canvas drawing context is required.')
  if (![point?.x, point?.y, size, radius, strength].every(Number.isFinite) || size <= 0 || radius <= 0 || strength < 0 || strength > 1) throw new Error('Invalid blur settings.')
  const { width, height } = canvas
  if (selection && (selection.width !== width || selection.height !== height || selection.data?.length !== width * height)) throw new Error('Selection dimensions do not match the canvas.')
  const brushRadius = clamp(size / 2, 0.5, 128)
  const kernel = Math.round(clamp(radius, 1, 20))
  const left = Math.max(0, Math.floor(point.x - brushRadius))
  const top = Math.max(0, Math.floor(point.y - brushRadius))
  const right = Math.min(width, Math.ceil(point.x + brushRadius))
  const bottom = Math.min(height, Math.ceil(point.y + brushRadius))
  if (left >= right || top >= bottom || strength === 0) return false
  const sourceLeft = Math.max(0, left - kernel)
  const sourceTop = Math.max(0, top - kernel)
  const sourceRight = Math.min(width, right + kernel)
  const sourceBottom = Math.min(height, bottom + kernel)
  const image = ctx.getImageData(sourceLeft, sourceTop, sourceRight - sourceLeft, sourceBottom - sourceTop)
  const original = new Uint8ClampedArray(image.data)
  const offsets = [-kernel, 0, kernel]
  const weights = [1, 2, 1]
  let changed = false
  for (let y = top; y < bottom; y += 1) {
    for (let x = left; x < right; x += 1) {
      const distance = Math.hypot(x + 0.5 - point.x, y + 0.5 - point.y) / brushRadius
      if (distance >= 1) continue
      const opacity = selection ? selection.data[y * width + x] / 255 : 1
      const amount = strength * (1 - distance * distance) * opacity
      if (amount <= 0) continue
      const target = ((y - sourceTop) * image.width + x - sourceLeft) * 4
      let total = 0
      let alpha = 0
      let red = 0
      let green = 0
      let blue = 0
      for (let dy = 0; dy < 3; dy += 1) {
        for (let dx = 0; dx < 3; dx += 1) {
          const sampleX = clamp(x + offsets[dx], 0, width - 1)
          const sampleY = clamp(y + offsets[dy], 0, height - 1)
          const offset = ((sampleY - sourceTop) * image.width + sampleX - sourceLeft) * 4
          const weight = weights[dx] * weights[dy]
          const sampleAlpha = original[offset + 3] / 255
          total += weight
          alpha += sampleAlpha * weight
          red += original[offset] * sampleAlpha * weight
          green += original[offset + 1] * sampleAlpha * weight
          blue += original[offset + 2] * sampleAlpha * weight
        }
      }
      const blurred = [alpha > 0 ? red / alpha : 0, alpha > 0 ? green / alpha : 0, alpha > 0 ? blue / alpha : 0, alpha / total * 255]
      for (let channel = 0; channel < 4; channel += 1) {
        const previous = original[target + channel]
        const next = previous * (1 - amount) + blurred[channel] * amount
        if (Math.abs(next - previous) >= 0.5) changed = true
        image.data[target + channel] = next
      }
    }
  }
  if (changed) ctx.putImageData(image, sourceLeft, sourceTop)
  return changed
}
