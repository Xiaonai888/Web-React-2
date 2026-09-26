const KB = 1024
const MB = 1024 * KB

export const IMAGE_UPLOAD_PRESETS = Object.freeze({
  default: {
    maxWidth: 1920,
    maxHeight: 2400,
    targetBytes: 900 * KB,
    minOptimizeBytes: 1100 * KB,
    minWidth: 720,
    qualities: [0.92, 0.9, 0.88, 0.86, 0.84, 0.82],
    minSavingsRatio: 0.1,
  },
  avatar: {
    maxWidth: 768,
    maxHeight: 768,
    targetBytes: 220 * KB,
    minOptimizeBytes: 300 * KB,
    minWidth: 320,
    qualities: [0.9, 0.86, 0.82, 0.78],
    minSavingsRatio: 0.08,
  },
  cover: {
    maxWidth: 1600,
    maxHeight: 2400,
    targetBytes: 700 * KB,
    minOptimizeBytes: 850 * KB,
    minWidth: 720,
    qualities: [0.92, 0.9, 0.88, 0.86, 0.84, 0.82],
    minSavingsRatio: 0.1,
  },
  thumbnail: {
    maxWidth: 1280,
    maxHeight: 1280,
    targetBytes: 350 * KB,
    minOptimizeBytes: 450 * KB,
    minWidth: 640,
    qualities: [0.9, 0.87, 0.84, 0.81, 0.78],
    minSavingsRatio: 0.1,
  },
  post: {
    maxWidth: 1920,
    maxHeight: 2400,
    targetBytes: 850 * KB,
    minOptimizeBytes: 1000 * KB,
    minWidth: 720,
    qualities: [0.92, 0.9, 0.88, 0.86, 0.84, 0.82],
    minSavingsRatio: 0.1,
  },
  gallery: {
    maxWidth: 1800,
    maxHeight: 2400,
    targetBytes: 950 * KB,
    minOptimizeBytes: 1150 * KB,
    minWidth: 720,
    qualities: [0.93, 0.91, 0.89, 0.87, 0.85, 0.83],
    minSavingsRatio: 0.1,
  },
  banner: {
    maxWidth: 1920,
    maxHeight: 1200,
    targetBytes: 650 * KB,
    minOptimizeBytes: 800 * KB,
    minWidth: 960,
    qualities: [0.92, 0.89, 0.86, 0.83, 0.8],
    minSavingsRatio: 0.1,
  },
})

const DEFAULT_MAX_SOURCE_BYTES = 20 * MB
const DEFAULT_MAX_PIXELS = 60_000_000
const DEFAULT_MAX_DIMENSION = 12000
const WIDTH_STEPS = [1, 0.88, 0.76, 0.66]

function cleanType(file) {
  return String(file?.type || '').trim().toLowerCase()
}

function cleanName(file) {
  return String(file?.name || '').trim().toLowerCase()
}

function isHeicFile(file) {
  return /image\/hei[cf]/i.test(cleanType(file)) || /\.hei[cf]$/i.test(cleanName(file))
}

function isGifFile(file) {
  return cleanType(file) === 'image/gif' || /\.gif$/i.test(cleanName(file))
}

function isSupportedRasterFile(file) {
  const type = cleanType(file)
  const name = cleanName(file)

  return (
    ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif', 'image/heic', 'image/heif'].includes(type) ||
    /\.(jpe?g|png|webp|avif|hei[cf])$/i.test(name)
  )
}

function safeWebpName(name = 'image') {
  const base = String(name)
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${base || 'image'}.webp`
}

function getPreset(name) {
  return IMAGE_UPLOAD_PRESETS[name] || IMAGE_UPLOAD_PRESETS.default
}

function fitDimensions(width, height, maxWidth, maxHeight) {
  const ratio = Math.min(1, maxWidth / width, maxHeight / height)

  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  }
}

function buildDimensionCandidates(width, height, preset) {
  const base = fitDimensions(width, height, preset.maxWidth, preset.maxHeight)
  const values = WIDTH_STEPS.map((step) => {
    const nextWidth = Math.max(
      Math.min(preset.minWidth, base.width),
      Math.round(base.width * step)
    )
    const ratio = nextWidth / base.width

    return {
      width: nextWidth,
      height: Math.max(1, Math.round(base.height * ratio)),
    }
  })

  return values.filter(
    (value, index, list) =>
      list.findIndex(
        (item) => item.width === value.width && item.height === value.height
      ) === index
  )
}

function loadImageFile(file, signal) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    let settled = false

    const cleanup = () => {
      signal?.removeEventListener('abort', onAbort)
    }

    const finish = (error, value) => {
      if (settled) return
      settled = true
      cleanup()

      if (error) {
        URL.revokeObjectURL(url)
        reject(error)
        return
      }

      resolve(value)
    }

    const onAbort = () => {
      image.src = ''
      finish(new DOMException('Image optimization canceled.', 'AbortError'))
    }

    image.onload = () =>
      finish(null, {
        image,
        url,
        width: image.naturalWidth,
        height: image.naturalHeight,
      })

    image.onerror = () =>
      finish(new Error('Could not read this image on this device.'))

    signal?.addEventListener('abort', onAbort, { once: true })
    image.src = url
  })
}

function canvasToWebp(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob || blob.type !== 'image/webp') {
          reject(new Error('WebP encoding is unavailable in this browser.'))
          return
        }

        resolve(blob)
      },
      'image/webp',
      quality
    )
  })
}

async function decodeHeic(file) {
  const { heicTo } = await import('heic-to')
  const blob = await heicTo({
    blob: file,
    type: 'image/jpeg',
    quality: 0.92,
  })

  if (!(blob instanceof Blob) || !blob.size) {
    throw new Error('HEIC conversion returned an empty image.')
  }

  const base = String(file.name || 'image').replace(/\.[^.]+$/, '')

  return new File([blob], `${base}.jpg`, {
    type: 'image/jpeg',
    lastModified: Date.now(),
  })
}

function originalResult(file, metadata = {}) {
  return {
    file,
    originalFile: file,
    originalBytes: Number(file?.size || 0),
    finalBytes: Number(file?.size || 0),
    savedBytes: 0,
    savingsPercent: 0,
    width: metadata.width || null,
    height: metadata.height || null,
    mimeType: file?.type || 'application/octet-stream',
    optimized: false,
    preset: metadata.preset || 'default',
    reason: metadata.reason || 'original-kept',
  }
}

export function validateImageUploadFile(
  file,
  {
    maxSourceBytes = DEFAULT_MAX_SOURCE_BYTES,
  } = {}
) {
  if (!file) return 'Image file is missing.'

  if (!cleanType(file).startsWith('image/') && !isSupportedRasterFile(file) && !isGifFile(file)) {
    return 'Selected file is not an image.'
  }

  if (!Number(file.size) || Number(file.size) <= 0) {
    return 'Selected image is empty.'
  }

  if (Number(file.size) > Number(maxSourceBytes)) {
    return `Image is larger than ${Math.round(maxSourceBytes / MB)} MB.`
  }

  return ''
}

export async function optimizeImageForUpload(
  file,
  {
    preset = 'default',
    force = false,
    signal,
    maxSourceBytes = DEFAULT_MAX_SOURCE_BYTES,
    maxPixels = DEFAULT_MAX_PIXELS,
    maxDimension = DEFAULT_MAX_DIMENSION,
  } = {}
) {
  const validationError = validateImageUploadFile(file, { maxSourceBytes })

  if (validationError) {
    throw new Error(validationError)
  }

  if (signal?.aborted) {
    throw new DOMException('Image optimization canceled.', 'AbortError')
  }

  if (isGifFile(file)) {
    return originalResult(file, { preset, reason: 'gif-preserved' })
  }

  if (!isSupportedRasterFile(file)) {
    return originalResult(file, { preset, reason: 'unsupported-format-preserved' })
  }

  const selectedPreset = getPreset(preset)
  const sourceFile = isHeicFile(file) ? await decodeHeic(file) : file
  const loaded = await loadImageFile(sourceFile, signal)

  try {
    const pixelCount = loaded.width * loaded.height

    if (
      loaded.width > maxDimension ||
      loaded.height > maxDimension ||
      pixelCount > maxPixels
    ) {
      throw new Error('Image dimensions are too large to optimize safely on this device.')
    }

    const needsResize =
      loaded.width > selectedPreset.maxWidth ||
      loaded.height > selectedPreset.maxHeight

    const needsByteOptimization =
      Number(file.size) >= selectedPreset.minOptimizeBytes

    if (!force && !isHeicFile(file) && !needsResize && !needsByteOptimization) {
      return originalResult(file, {
        width: loaded.width,
        height: loaded.height,
        preset,
        reason: 'already-efficient',
      })
    }

    const candidates = buildDimensionCandidates(
      loaded.width,
      loaded.height,
      selectedPreset
    )

    let best = null

    for (const dimensions of candidates) {
      if (signal?.aborted) {
        throw new DOMException('Image optimization canceled.', 'AbortError')
      }

      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d', { alpha: true })

      if (!context) {
        return originalResult(file, {
          width: loaded.width,
          height: loaded.height,
          preset,
          reason: 'canvas-unavailable',
        })
      }

      try {
        canvas.width = dimensions.width
        canvas.height = dimensions.height
        context.drawImage(
          loaded.image,
          0,
          0,
          dimensions.width,
          dimensions.height
        )

        for (const quality of selectedPreset.qualities) {
          const blob = await canvasToWebp(canvas, quality)

          if (!blob?.size) continue

          const candidate = {
            file: new File([blob], safeWebpName(file.name), {
              type: 'image/webp',
              lastModified: Date.now(),
            }),
            originalFile: file,
            originalBytes: Number(file.size || 0),
            finalBytes: Number(blob.size || 0),
            savedBytes: Math.max(0, Number(file.size || 0) - Number(blob.size || 0)),
            savingsPercent:
              Number(file.size || 0) > 0
                ? Math.max(
                    0,
                    Math.round(
                      ((Number(file.size || 0) - Number(blob.size || 0)) /
                        Number(file.size || 0)) *
                        100
                    )
                  )
                : 0,
            width: dimensions.width,
            height: dimensions.height,
            mimeType: 'image/webp',
            optimized: true,
            preset,
            reason: 'optimized',
          }

          if (!best || candidate.finalBytes < best.finalBytes) {
            best = candidate
          }

          if (candidate.finalBytes <= selectedPreset.targetBytes) {
            break
          }
        }
      } catch {
        return originalResult(file, {
          width: loaded.width,
          height: loaded.height,
          preset,
          reason: 'browser-encoding-failed',
        })
      } finally {
        canvas.width = 0
        canvas.height = 0
      }

      if (best?.finalBytes <= selectedPreset.targetBytes) {
        break
      }
    }

    const minimumUsefulBytes =
      Number(file.size || 0) * (1 - selectedPreset.minSavingsRatio)

    if (isHeicFile(file) && best) {
      return best
    }

    if (!best || best.finalBytes >= minimumUsefulBytes) {
      return originalResult(file, {
        width: loaded.width,
        height: loaded.height,
        preset,
        reason: 'insufficient-savings',
      })
    }

    return best
  } finally {
    URL.revokeObjectURL(loaded.url)
  }
}

export async function optimizeImagesForUpload(
  files,
  {
    concurrency = 2,
    ...options
  } = {}
) {
  const input = Array.from(files || [])
  const results = new Array(input.length)
  let cursor = 0

  const worker = async () => {
    while (cursor < input.length) {
      const index = cursor
      cursor += 1
      results[index] = await optimizeImageForUpload(input[index], options)
    }
  }

  const workerCount = Math.max(
    1,
    Math.min(Number(concurrency) || 1, input.length || 1)
  )

  await Promise.all(
    Array.from({ length: workerCount }, () => worker())
  )

  return results
}
