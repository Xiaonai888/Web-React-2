import { MANGA_DEVICE_POLICY } from './mangaDeviceFirstPolicy.js'

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function cutScore(analysis, targetY, candidateY, outputHeight) {
  const width = Number(analysis?.width || 0)
  const height = Number(analysis?.height || 0)
  const pixels = analysis?.pixels
  if (!width || height < 3 || !pixels || pixels.length < width * height) {
    return Math.abs(candidateY - targetY) / 100
  }

  const center = clamp(Math.round(candidateY * height / outputHeight), 1, height - 2)
  const radius = clamp(Math.round(30 * height / outputHeight), 1, 8)
  let brightness = 0
  let edges = 0
  let ink = 0
  let count = 0

  for (let y = Math.max(1, center - radius); y <= Math.min(height - 2, center + radius); y += 1) {
    const offset = y * width
    const previous = (y - 1) * width
    for (let x = 0; x < width; x += 1) {
      const value = pixels[offset + x]
      brightness += value
      ink += value < 200 ? 1 : 0
      edges += Math.abs(value - pixels[previous + x])
      if (x > 0) edges += Math.abs(value - pixels[offset + x - 1])
      count += 1
    }
  }

  if (!count) return Math.abs(candidateY - targetY) / 100
  const darkRatio = ink / count
  const whitePenalty = 1 - brightness / (count * 255)
  const edgeRatio = edges / (count * 510)
  return darkRatio * 2.5 + whitePenalty * 1.2 + edgeRatio * 3.5 +
    Math.abs(candidateY - targetY) / 1500
}

export function planMangaDeviceCuts({ width, height, analysis = null } = {}) {
  const w = Math.floor(Number(width))
  const h = Math.floor(Number(height))

  if (!Number.isFinite(w) || !Number.isFinite(h) || w < 1 || h < 1) {
    throw new Error('Manga device cut dimensions are invalid')
  }

  const limits = MANGA_DEVICE_POLICY
  const count = Math.max(1, Math.ceil(h / limits.preferredPartHeight))
  if (count > limits.maximumParts) {
    throw new Error('Manga page requires too many parts for device processing')
  }

  if (count === 1) return [{ top: 0, height: h }]

  const cuts = []
  let previousCut = 0

  for (let index = 1; index < count; index += 1) {
    const remaining = count - index
    const target = Math.round(h * index / count)
    const minimum = Math.max(
      previousCut + limits.minimumSplitHeight,
      h - remaining * (limits.maximumPartHeight - limits.partOverlap)
    )
    const maximum = Math.min(
      previousCut + limits.maximumPartHeight - limits.partOverlap,
      h - remaining * limits.minimumSplitHeight
    )

    if (minimum > maximum) throw new Error('Manga device cut cannot satisfy part bounds')

    const center = clamp(target, minimum, maximum)
    const from = Math.max(minimum, center - 120)
    const to = Math.min(maximum, center + 120)
    let best = center
    let bestScore = cutScore(analysis, target, center, h)

    for (let y = from; y <= to; y += 8) {
      const score = cutScore(analysis, target, y, h)
      if (score < bestScore) {
        bestScore = score
        best = y
      }
    }

    for (let y = Math.max(from, best - 8); y <= Math.min(to, best + 8); y += 1) {
      const score = cutScore(analysis, target, y, h)
      if (score < bestScore) {
        bestScore = score
        best = y
      }
    }

    cuts.push(best)
    previousCut = best
  }

  const segments = []
  let top = 0

  for (const cut of cuts) {
    segments.push({ top, height: cut - top })
    top = cut - limits.partOverlap
  }

  segments.push({ top, height: h - top })

  if (segments.length > limits.maximumParts ||
    segments.some((part) => part.height < 1 || part.height > limits.maximumPartHeight)) {
    throw new Error('Manga device part plan exceeds size limits')
  }

  return segments
}
