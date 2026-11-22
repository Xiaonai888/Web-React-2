export const MANGA_DEVICE_POLICY = Object.freeze({
  inputMaxBytes: 5 * 1024 * 1024,
  maxSourceWidth: 8000,
  maxSourceHeight: 30000,
  maxSourcePixels: 120_000_000,
  maxDevicePixels: 24_000_000,
  outputWidth: 1440,
  preferredPartHeight: 2400,
  maximumPartHeight: 3000,
  minimumSplitHeight: 400,
  partOverlap: 2,
  maximumPartBytes: 2 * 1024 * 1024,
  maximumOutputBytes: 24 * 1024 * 1024,
  maximumParts: 40,
  qualities: Object.freeze([0.82, 0.72]),
})

const DEVICE_INPUT_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export function inspectMangaDeviceEligibility(file, width = 0, height = 0) {
  const bytes = Number(file?.size || 0)
  const type = String(file?.type || '').trim().toLowerCase()

  if (!Number.isSafeInteger(bytes) || bytes < 16 || bytes > MANGA_DEVICE_POLICY.inputMaxBytes) {
    return { eligible: false, reason: 'DEVICE_INPUT_SIZE_UNSUPPORTED' }
  }

  if (!DEVICE_INPUT_TYPES.has(type)) {
    return { eligible: false, reason: 'DEVICE_INPUT_FORMAT_UNSUPPORTED' }
  }

  const w = Number(width)
  const h = Number(height)

  if (!w || !h) {
    return { eligible: true, reason: 'DIMENSIONS_NOT_YET_CHECKED' }
  }

  if (!Number.isInteger(w) || !Number.isInteger(h) || w < 1 || h < 1 ||
    w > MANGA_DEVICE_POLICY.maxSourceWidth || h > MANGA_DEVICE_POLICY.maxSourceHeight ||
    w * h > MANGA_DEVICE_POLICY.maxSourcePixels) {
    return { eligible: false, reason: 'DEVICE_SOURCE_DIMENSIONS_INVALID' }
  }

  if (w * h > MANGA_DEVICE_POLICY.maxDevicePixels) {
    return { eligible: false, reason: 'DEVICE_IMAGE_TOO_LARGE_USE_WORKER' }
  }

  return { eligible: true, reason: 'DEVICE_READY' }
}

export function isMangaDeviceAbort(error) {
  return error?.name === 'AbortError' || error?.code === 'MANGA_DEVICE_ABORTED'
}

export function createMangaDeviceError(code, message) {
  const error = new Error(message)
  error.name = 'MangaDeviceError'
  error.code = code
  error.stage = 'device_process'
  error.fallbackSafe = true
  return error
}
