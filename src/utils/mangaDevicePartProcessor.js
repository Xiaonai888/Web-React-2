import {
  MANGA_DEVICE_POLICY,
  createMangaDeviceError,
  inspectMangaDeviceEligibility,
} from './mangaDeviceFirstPolicy.js'
import { planMangaDeviceCuts } from './mangaDeviceCutPlanner.js'

function ensureNotCanceled(signal) {
  if (signal?.aborted) {
    const error = createMangaDeviceError('MANGA_DEVICE_ABORTED', 'Manga device processing was canceled')
    error.name = 'AbortError'
    throw error
  }
}

function readImage(file, signal) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    let settled = false

    const finish = (error) => {
      if (settled) return
      settled = true
      image.onload = null
      image.onerror = null
      signal?.removeEventListener('abort', onAbort)
      if (error) {
        URL.revokeObjectURL(url)
        reject(error)
      } else {
        resolve({ image, url })
      }
    }

    const onAbort = () => {
      const error = createMangaDeviceError('MANGA_DEVICE_ABORTED', 'Manga device processing was canceled')
      error.name = 'AbortError'
      finish(error)
    }
    image.onload = () => finish()
    image.onerror = () => finish(createMangaDeviceError('MANGA_DEVICE_DECODE_FAILED', 'Cannot decode this Manga image on the device'))
    signal?.addEventListener('abort', onAbort, { once: true })
    if (signal?.aborted) onAbort()
    else image.src = url
  })
}

function createCanvas(width, height, readFrequently = false) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d', readFrequently ? { willReadFrequently: true } : undefined)
  if (!context) {
    canvas.width = 0
    canvas.height = 0
    throw createMangaDeviceError('MANGA_DEVICE_CANVAS_UNAVAILABLE', 'Canvas is not supported on this device')
  }
  return { canvas, context }
}

function analyzeImage(image, sourceWidth, sourceHeight, outputWidth, outputHeight) {
  const width = Math.min(220, outputWidth)
  const height = Math.max(1, Math.round(outputHeight * width / outputWidth))
  if (width * height > 2_000_000) return null

  const { canvas, context } = createCanvas(width, height, true)
  try {
    context.drawImage(image, 0, 0, sourceWidth, sourceHeight, 0, 0, width, height)
    const rgba = context.getImageData(0, 0, width, height).data
    const pixels = new Uint8Array(width * height)
    for (let i = 0, j = 0; i < rgba.length; i += 4, j += 1) {
      pixels[j] = Math.round(rgba[i] * 0.299 + rgba[i + 1] * 0.587 + rgba[i + 2] * 0.114)
    }
    return { pixels, width, height }
  } catch {
    return null
  } finally {
    canvas.width = 0
    canvas.height = 0
  }
}

function webpBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob || blob.size < 16 || blob.type !== 'image/webp') {
        reject(createMangaDeviceError('MANGA_DEVICE_WEBP_UNAVAILABLE', 'This device cannot export Manga WebP parts'))
        return
      }
      resolve(blob)
    }, 'image/webp', quality)
  })
}

async function encodeSegment({ image, sourceWidth, sourceHeight, outputWidth, outputHeight, segment, signal }) {
  ensureNotCanceled(signal)
  const { canvas, context } = createCanvas(outputWidth, segment.height)
  try {
    const sourceTop = segment.top * sourceHeight / outputHeight
    const sourceBottom = (segment.top + segment.height) * sourceHeight / outputHeight
    context.drawImage(
      image,
      0,
      sourceTop,
      sourceWidth,
      Math.min(sourceHeight, sourceBottom) - sourceTop,
      0,
      0,
      outputWidth,
      segment.height
    )

    for (const quality of MANGA_DEVICE_POLICY.qualities) {
      ensureNotCanceled(signal)
      const blob = await webpBlob(canvas, quality)
      if (blob.size <= MANGA_DEVICE_POLICY.maximumPartBytes) {
        return { blob, quality }
      }
    }
    return null
  } finally {
    canvas.width = 0
    canvas.height = 0
  }
}

export async function prepareMangaDeviceParts(file, { signal, onProgress } = {}) {
  ensureNotCanceled(signal)
  const preliminary = inspectMangaDeviceEligibility(file)
  if (!preliminary.eligible) {
    throw createMangaDeviceError(preliminary.reason, 'This Manga image must use the existing server worker')
  }
  if (typeof document === 'undefined' || typeof Image === 'undefined' ||
      typeof URL?.createObjectURL !== 'function' || typeof File === 'undefined') {
    throw createMangaDeviceError('MANGA_DEVICE_BROWSER_UNSUPPORTED', 'This browser cannot process Manga parts')
  }

  const loaded = await readImage(file, signal)
  try {
    ensureNotCanceled(signal)
    const sourceWidth = Number(loaded.image.naturalWidth || 0)
    const sourceHeight = Number(loaded.image.naturalHeight || 0)
    const check = inspectMangaDeviceEligibility(file, sourceWidth, sourceHeight)
    if (!check.eligible) {
      throw createMangaDeviceError(check.reason, 'This Manga image must use the existing server worker')
    }

    const outputWidth = Math.min(MANGA_DEVICE_POLICY.outputWidth, sourceWidth)
    const outputHeight = Math.max(1, Math.round(sourceHeight * outputWidth / sourceWidth))
    const analysis = analyzeImage(loaded.image, sourceWidth, sourceHeight, outputWidth, outputHeight)
    if (!analysis && outputHeight > MANGA_DEVICE_POLICY.maximumPartHeight) {
      throw createMangaDeviceError('MANGA_DEVICE_CUT_ANALYSIS_UNAVAILABLE', 'Safe Manga cuts cannot be determined on this device')
    }
    const queue = planMangaDeviceCuts({ width: outputWidth, height: outputHeight, analysis })
    const parts = []
    let totalBytes = 0

    while (queue.length) {
      ensureNotCanceled(signal)
      if (parts.length + queue.length > MANGA_DEVICE_POLICY.maximumParts) {
        throw createMangaDeviceError('MANGA_DEVICE_TOO_MANY_PARTS', 'Manga device output contains too many parts')
      }

      const segment = queue.shift()
      const encoded = await encodeSegment({
        image: loaded.image,
        sourceWidth,
        sourceHeight,
        outputWidth,
        outputHeight,
        segment,
        signal,
      })

      if (!encoded) {
        if (segment.height < MANGA_DEVICE_POLICY.minimumSplitHeight * 2 + MANGA_DEVICE_POLICY.partOverlap) {
          throw createMangaDeviceError('MANGA_DEVICE_COMPRESSION_FAILED', 'The device cannot compress this Manga part below 2 MB')
        }
        const firstHeight = Math.floor(segment.height / 2)
        queue.unshift(
          { top: segment.top, height: firstHeight },
          {
            top: segment.top + firstHeight - MANGA_DEVICE_POLICY.partOverlap,
            height: segment.height - firstHeight + MANGA_DEVICE_POLICY.partOverlap,
          }
        )
        continue
      }

      totalBytes += encoded.blob.size
      if (totalBytes > MANGA_DEVICE_POLICY.maximumOutputBytes) {
        throw createMangaDeviceError('MANGA_DEVICE_OUTPUT_TOO_LARGE', 'Manga device output exceeds the upload budget')
      }

      const partIndex = parts.length
      parts.push({
        partIndex,
        file: new File([encoded.blob], `manga-part-${String(partIndex).padStart(3, '0')}.webp`, {
          type: 'image/webp',
          lastModified: Date.now(),
        }),
        top: segment.top,
        width: outputWidth,
        height: segment.height,
        size: encoded.blob.size,
        quality: encoded.quality,
      })
      onProgress?.({ stage: 'device_process', processedParts: parts.length, remainingParts: queue.length })
    }

    return {
      processedBy: 'device',
      sourceWidth,
      sourceHeight,
      width: outputWidth,
      height: outputHeight,
      fileSize: totalBytes,
      mimeType: 'image/webp',
      partCount: parts.length,
      parts,
    }
  } finally {
    URL.revokeObjectURL(loaded.url)
    loaded.image.src = ''
  }
}
