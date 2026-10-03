const QUALITY_PRESETS = {
  standard: { maxSide: 1280, maxPixels: 2073600 },
  hd: { maxSide: 2048, maxPixels: 4194304 },
}

function clamp(value, min = 0, max = 255) {
  return Math.max(min, Math.min(max, value))
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = url
  })
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('EXPORT_FAILED')), 'image/png')
  })
}

function fitSize(width, height, quality = 'hd') {
  const preset = QUALITY_PRESETS[quality] || QUALITY_PRESETS.hd
  let scale = Math.min(1, preset.maxSide / Math.max(width, height))
  const scaledPixels = width * height * scale * scale
  if (scaledPixels > preset.maxPixels) scale *= Math.sqrt(preset.maxPixels / scaledPixels)
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

function posterize(value, levels) {
  const safeLevels = Math.max(2, levels)
  const step = 255 / (safeLevels - 1)
  return Math.round(value / step) * step
}

function contrast(value, amount) {
  return clamp((value - 128) * amount + 128)
}

function saturate(r, g, b, amount) {
  const gray = r * 0.299 + g * 0.587 + b * 0.114
  return [
    clamp(gray + (r - gray) * amount),
    clamp(gray + (g - gray) * amount),
    clamp(gray + (b - gray) * amount),
  ]
}

function mixColor(base, styled, amount) {
  return clamp(base * (1 - amount) + styled * amount)
}

function edgeAt(luma, width, height, x, y) {
  if (x <= 0 || y <= 0 || x >= width - 1 || y >= height - 1) return 0
  const index = y * width + x
  const center = luma[index]
  const horizontal = Math.abs(luma[index - 1] - luma[index + 1])
  const vertical = Math.abs(luma[index - width] - luma[index + width])
  const diagonal = Math.abs(center - luma[index - width - 1]) + Math.abs(center - luma[index + width + 1])
  return clamp(horizontal * 0.9 + vertical * 0.9 + diagonal * 0.35)
}

function applyStyle(data, width, height, style, controls) {
  const pixels = data.data
  const total = width * height
  const luma = new Float32Array(total)
  const strength = clamp(Number(controls.strength || 0), 0, 100) / 100
  const detail = clamp(Number(controls.detail || 0), 0, 100) / 100
  const contrastAmount = 0.85 + clamp(Number(controls.contrast || 0), 0, 100) / 100 * 0.8
  const lineAmount = clamp(Number(controls.lineArt || 0), 0, 100) / 100
  const levels = Math.round(4 + detail * 8)
  const mix = 0.48 + strength * 0.52

  for (let i = 0; i < total; i += 1) {
    const p = i * 4
    luma[i] = pixels[p] * 0.299 + pixels[p + 1] * 0.587 + pixels[p + 2] * 0.114
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x
      const p = index * 4
      const originalR = pixels[p]
      const originalG = pixels[p + 1]
      const originalB = pixels[p + 2]
      const gray = contrast(luma[index], contrastAmount)
      const edge = edgeAt(luma, width, height, x, y)
      const ink = clamp(edge * (0.8 + lineAmount * 2.2))
      let r = originalR
      let g = originalG
      let b = originalB

      if (style === 'manga') {
        const tone = posterize(gray, Math.max(4, Math.round(levels * 0.65)))
        r = tone
        g = tone
        b = tone
      } else if (style === 'anime') {
        const color = saturate(originalR, originalG, originalB, 1.08 + strength * 0.45)
        r = posterize(contrast(color[0], contrastAmount), levels)
        g = posterize(contrast(color[1], contrastAmount), levels)
        b = posterize(contrast(color[2], contrastAmount), levels)
      } else if (style === 'sketch') {
        const shade = 255 - (255 - gray) * (0.2 + strength * 0.55)
        r = shade
        g = shade
        b = shade
      } else if (style === 'comic') {
        const color = saturate(originalR, originalG, originalB, 1.28 + strength * 0.6)
        r = posterize(contrast(color[0], contrastAmount * 1.08), Math.max(4, Math.round(levels * 0.7)))
        g = posterize(contrast(color[1], contrastAmount * 1.08), Math.max(4, Math.round(levels * 0.7)))
        b = posterize(contrast(color[2], contrastAmount * 1.08), Math.max(4, Math.round(levels * 0.7)))
      } else if (style === 'watercolor') {
        const color = saturate(originalR, originalG, originalB, 1.08 + strength * 0.28)
        r = posterize(color[0], Math.max(8, levels + 2))
        g = posterize(color[1], Math.max(8, levels + 2))
        b = posterize(color[2], Math.max(8, levels + 2))
      } else if (style === 'bwManga') {
        const low = 96 - strength * 18
        const high = 168 + strength * 12
        const tone = gray < low ? 0 : gray > high ? 255 : detail > 0.55 ? 150 : 210
        r = tone
        g = tone
        b = tone
      }

      const styleLineMultiplier = style === 'watercolor' ? 0.28 : style === 'sketch' ? 1.2 : style === 'bwManga' ? 1.35 : 0.9
      const line = ink * lineAmount * styleLineMultiplier
      r = clamp(r - line)
      g = clamp(g - line)
      b = clamp(b - line)

      pixels[p] = mixColor(originalR, r, mix)
      pixels[p + 1] = mixColor(originalG, g, mix)
      pixels[p + 2] = mixColor(originalB, b, mix)
      pixels[p + 3] = 255
    }
  }

  return data
}

export async function convertPicToArt({ sourceUrl, style, controls, quality = 'hd', onProgress }) {
  const update = value => onProgress?.(value)
  update(5)
  const image = await loadImage(sourceUrl)
  const size = fitSize(image.naturalWidth, image.naturalHeight, quality)
  const canvas = document.createElement('canvas')
  canvas.width = size.width
  canvas.height = size.height
  const context = canvas.getContext('2d', { alpha: false, willReadFrequently: true })
  if (!context) throw new Error('CANVAS_UNAVAILABLE')

  update(18)
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.filter = style === 'watercolor' ? 'blur(0.65px)' : 'none'
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  context.filter = 'none'

  update(35)
  await new Promise(resolve => requestAnimationFrame(resolve))
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
  const styled = applyStyle(imageData, canvas.width, canvas.height, style, controls)
  context.putImageData(styled, 0, 0)

  update(86)
  await new Promise(resolve => requestAnimationFrame(resolve))
  const blob = await canvasToBlob(canvas)
  const url = URL.createObjectURL(blob)
  update(100)

  return {
    blob,
    url,
    width: canvas.width,
    height: canvas.height,
  }
}
