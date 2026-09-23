export function createStudioMagicWandSelection(imageData, point, options = {}) {
  const { width, height, data: pixels } = imageData || {}
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0 || pixels?.length !== width * height * 4) throw new Error('A valid image is required.')
  if (!Number.isFinite(point?.x) || !Number.isFinite(point?.y)) throw new Error('Invalid selection point.')
  const tolerance = Number(options.tolerance ?? 16)
  if (!Number.isFinite(tolerance) || tolerance < 0 || tolerance > 255) throw new Error('Tolerance must be between 0 and 255.')
  const x = Math.floor(point.x)
  const y = Math.floor(point.y)
  const selected = new Uint8Array(width * height)
  if (x < 0 || y < 0 || x >= width || y >= height) return { width, height, data: selected }
  const origin = (y * width + x) * 4
  const similar = (index) => {
    const offset = index * 4
    for (let channel = 0; channel < 4; channel += 1) if (Math.abs(pixels[offset + channel] - pixels[origin + channel]) > tolerance) return false
    return true
  }
  if (options.contiguous === false) {
    for (let index = 0; index < selected.length; index += 1) if (similar(index)) selected[index] = 255
    return { width, height, data: selected }
  }
  const visited = new Uint8Array(width * height)
  const queue = new Int32Array(width * height)
  let head = 0
  let tail = 0
  const seed = y * width + x
  queue[tail++] = seed
  visited[seed] = 1
  while (head < tail) {
    const index = queue[head++]
    if (!similar(index)) continue
    selected[index] = 255
    const px = index % width
    const py = Math.floor(index / width)
    const neighbors = [px > 0 ? index - 1 : -1, px + 1 < width ? index + 1 : -1, py > 0 ? index - width : -1, py + 1 < height ? index + width : -1]
    for (const next of neighbors) {
      if (next < 0 || visited[next]) continue
      visited[next] = 1
      queue[tail++] = next
    }
  }
  return { width, height, data: selected }
}
