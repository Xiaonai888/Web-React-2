const clamp = (value, minimum = 0, maximum = 255) => Math.max(minimum, Math.min(maximum, value))
const FILTERS = new Set(['grayscale', 'sepia', 'invert', 'brightness', 'contrast', 'threshold'])

export function applyStudioPhotoFilter(ctx, { type = 'grayscale', amount = 100, adjustment = 30, selection = null } = {}) {
  const canvas = ctx?.canvas
  if (!canvas?.width || !canvas?.height || typeof ctx.getImageData !== 'function' || typeof ctx.putImageData !== 'function') throw new Error('An editable canvas context is required.')
  if (!FILTERS.has(type) || !Number.isFinite(amount) || amount < 0 || amount > 100 || !Number.isFinite(adjustment) || adjustment < -100 || adjustment > 100) throw new Error('Invalid filter settings.')
  const { width, height } = canvas
  if (selection && (selection.width !== width || selection.height !== height || selection.data?.length !== width * height)) throw new Error('Selection dimensions do not match the canvas.')
  if (amount === 0) return false
  const image = ctx.getImageData(0, 0, width, height)
  const pixels = image.data
  const offset = adjustment * 2.55
  const contrast = adjustment < 0 ? 1 + adjustment / 100 : 1 + adjustment / 50
  let changed = false
  for (let pixel = 0; pixel < width * height; pixel += 1) {
    const index = pixel * 4
    if (pixels[index + 3] === 0) continue
    const weight = amount / 100 * (selection ? selection.data[pixel] / 255 : 1)
    if (!weight) continue
    const red = pixels[index]
    const green = pixels[index + 1]
    const blue = pixels[index + 2]
    const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722
    let filtered
    if (type === 'grayscale') filtered = [luminance, luminance, luminance]
    else if (type === 'sepia') filtered = [red * 0.393 + green * 0.769 + blue * 0.189, red * 0.349 + green * 0.686 + blue * 0.168, red * 0.272 + green * 0.534 + blue * 0.131]
    else if (type === 'invert') filtered = [255 - red, 255 - green, 255 - blue]
    else if (type === 'brightness') filtered = [red + offset, green + offset, blue + offset]
    else if (type === 'contrast') filtered = [(red - 128) * contrast + 128, (green - 128) * contrast + 128, (blue - 128) * contrast + 128]
    else {
      const shade = luminance >= 128 + adjustment * 1.27 ? 255 : 0
      filtered = [shade, shade, shade]
    }
    for (let channel = 0; channel < 3; channel += 1) {
      const next = Math.round(clamp([red, green, blue][channel] * (1 - weight) + clamp(filtered[channel]) * weight))
      if (next !== pixels[index + channel]) changed = true
      pixels[index + channel] = next
    }
  }
  if (changed) ctx.putImageData(image, 0, 0)
  return changed
}
