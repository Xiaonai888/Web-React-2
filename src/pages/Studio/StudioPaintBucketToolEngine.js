const HEX = /^#[0-9a-f]{6}$/i

export function applyStudioPaintBucket(ctx, point, { color = '#111111', tolerance = 0, opacity = 100, contiguous = true, selection = null } = {}) {
  const canvas = ctx?.canvas
  if (!canvas?.width || !canvas?.height || typeof ctx.getImageData !== 'function' || typeof ctx.putImageData !== 'function') throw new Error('A canvas drawing context is required.')
  const { width, height } = canvas
  if (![point?.x, point?.y, tolerance, opacity].every(Number.isFinite) || !HEX.test(color) || tolerance < 0 || tolerance > 255 || opacity < 0 || opacity > 100 || typeof contiguous !== 'boolean') throw new Error('Invalid paint bucket settings.')
  if (selection && (selection.width !== width || selection.height !== height || selection.data?.length !== width * height)) throw new Error('Selection dimensions do not match the canvas.')
  const x = Math.floor(point.x)
  const y = Math.floor(point.y)
  if (x < 0 || y < 0 || x >= width || y >= height || opacity === 0) return false
  const image = ctx.getImageData(0, 0, width, height)
  const pixels = image.data
  const original = new Uint8ClampedArray(pixels)
  const seed = (y * width + x) * 4
  const rgba = [parseInt(color.slice(1, 3), 16), parseInt(color.slice(3, 5), 16), parseInt(color.slice(5, 7), 16)]
  const target = [original[seed], original[seed + 1], original[seed + 2], original[seed + 3]]
  const allowed = (index) => {
    if (selection && !selection.data[index]) return false
    const offset = index * 4
    return Math.abs(original[offset] - target[0]) <= tolerance && Math.abs(original[offset + 1] - target[1]) <= tolerance && Math.abs(original[offset + 2] - target[2]) <= tolerance && Math.abs(original[offset + 3] - target[3]) <= tolerance
  }
  const paint = (index) => {
    const offset = index * 4
    const amount = opacity / 100 * (selection ? selection.data[index] / 255 : 1)
    const oldAlpha = original[offset + 3] / 255
    const resultingAlpha = amount + oldAlpha * (1 - amount)
    const pixel = resultingAlpha > 0
      ? rgba.map((value, channel) => (value * amount + original[offset + channel] * oldAlpha * (1 - amount)) / resultingAlpha)
      : [0, 0, 0]
    let pixelChanged = false
    for (let channel = 0; channel < 3; channel += 1) {
      const next = Math.round(pixel[channel])
      if (next !== original[offset + channel]) pixelChanged = true
      pixels[offset + channel] = next
    }
    const nextAlpha = Math.round(resultingAlpha * 255)
    if (nextAlpha !== original[offset + 3]) pixelChanged = true
    pixels[offset + 3] = nextAlpha
    return pixelChanged
  }
  if (!allowed(y * width + x)) return false
  let changed = false
  if (!contiguous) {
    for (let index = 0; index < width * height; index += 1) {
      if (allowed(index)) changed = paint(index) || changed
    }
  } else {
    const visited = new Uint8Array(width * height)
    const queue = new Uint32Array(width * height)
    let head = 0
    let tail = 1
    queue[0] = y * width + x
    visited[queue[0]] = 1
    while (head < tail) {
      const index = queue[head++]
      if (!allowed(index)) continue
      changed = paint(index) || changed
      const px = index % width
      const py = (index - px) / width
      const neighbors = [px > 0 ? index - 1 : -1, px + 1 < width ? index + 1 : -1, py > 0 ? index - width : -1, py + 1 < height ? index + width : -1]
      for (const next of neighbors) {
        if (next < 0 || visited[next]) continue
        visited[next] = 1
        if (allowed(next)) queue[tail++] = next
      }
    }
  }
  if (changed) ctx.putImageData(image, 0, 0)
  return changed
}
