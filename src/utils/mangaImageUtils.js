import { mangaApiOrigin, traceMangaUpload } from './mangaUploadConsoleTrace'

export const MANGA_MAX_PAGES = 100
export const MANGA_MIN_PUBLISH_PAGES = 10
export const MANGA_MAX_FILES_PER_PICK = 30
export const MANGA_INPUT_MAX_BYTES = 5 * 1024 * 1024
export const MANGA_MAX_WIDTH = 8000
export const MANGA_MAX_HEIGHT = 30000
export const MANGA_MAX_PIXELS = 120_000_000
const TARGET_MAX_BYTES = 600 * 1024
const HARD_MAX_BYTES = 800 * 1024
const MAX_WIDTH = 1600
const QUALITIES = [0.88, 0.86, 0.84, 0.82, 0.8]
const STANDARD_OPTIMIZE_MIN_BYTES = 1536 * 1024
const STANDARD_OPTIMIZE_TARGET_BYTES = 1536 * 1024
const STANDARD_OPTIMIZE_MAX_WIDTH = 1440
const STANDARD_OPTIMIZE_MAX_PIXELS = 16_000_000
const STANDARD_OPTIMIZE_QUALITIES = [0.92, 0.9, 0.88, 0.86]
const MANGA_V2_JOB_POLL_MS = 5000
const MANGA_V2_JOB_TIMEOUT_MS = 30 * 60 * 1000

function createObjectUrl(file) {
  return URL.createObjectURL(file)
}

function loadImageFile(file) {
  return new Promise((resolve, reject) => {
    const url = createObjectUrl(file)
    const image = new Image()

    image.onload = () => {
      resolve({
        image,
        url,
        width: image.naturalWidth,
        height: image.naturalHeight,
      })
    }

    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read this image on this device.'))
    }

    image.src = url
  })
}

function canvasToWebp(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob || blob.type !== 'image/webp') {
          reject(new Error('This browser could not create a WebP image.'))
          return
        }

        resolve(blob)
      },
      'image/webp',
      quality
    )
  })
}

function safeWebpName(name = 'manga-page') {
  const base = String(name)
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${base || 'manga-page'}.webp`
}

function scaledDimensions(width, height, maxWidth) {
  if (width <= maxWidth) return { width, height }

  const ratio = maxWidth / width

  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  }
}

function widthCandidates(sourceWidth) {
  return [
    Math.min(MAX_WIDTH, sourceWidth),
    Math.min(1440, sourceWidth),
    Math.min(1280, sourceWidth),
    Math.min(1120, sourceWidth),
    Math.min(960, sourceWidth),
  ].filter(
    (width, index, values) =>
      width > 0 && values.indexOf(width) === index
  )
}

function isMangaImageFile(file) {
  const type = String(file?.type || '').toLowerCase()
  const name = String(file?.name || '').toLowerCase()

  return (
    type.startsWith('image/') ||
    /\.(jpe?g|png|webp|gif|avif|hei[cf])$/i.test(name)
  )
}

function isMangaHeicFile(file) {
  return (
    /image\/hei[cf]/i.test(file?.type || '') ||
    /\.hei[cf]$/i.test(file?.name || '')
  )
}

function isStandardMangaCompressibleFile(file) {
  const type = String(file?.type || '').toLowerCase()
  const name = String(file?.name || '').toLowerCase()

  return (
    ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(type) ||
    /\.(jpe?g|png|webp)$/i.test(name)
  )
}

async function optimizeStandardMangaImage(file, loaded) {
  if (
    !isStandardMangaCompressibleFile(file) ||
    Number(file?.size || 0) < STANDARD_OPTIMIZE_MIN_BYTES
  ) {
    return null
  }

  const dimensions = scaledDimensions(
    loaded.width,
    loaded.height,
    Math.min(STANDARD_OPTIMIZE_MAX_WIDTH, loaded.width)
  )

  if (
    dimensions.width * dimensions.height >
    STANDARD_OPTIMIZE_MAX_PIXELS
  ) {
    return null
  }

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    return null
  }

  let best = null

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

    for (const quality of STANDARD_OPTIMIZE_QUALITIES) {
      const blob = await canvasToWebp(canvas, quality)

      if (!blob?.size || blob.size >= file.size) {
        continue
      }

      const candidate = {
        file: new File(
          [blob],
          safeWebpName(file.name),
          {
            type: 'image/webp',
            lastModified: Date.now(),
          }
        ),
        width: dimensions.width,
        height: dimensions.height,
        fileSize: blob.size,
        mimeType: 'image/webp',
        compressed: true,
      }

      if (!best || candidate.fileSize < best.fileSize) {
        best = candidate
      }

      if (
        candidate.fileSize <=
        STANDARD_OPTIMIZE_TARGET_BYTES
      ) {
        break
      }
    }
  } catch {
    return null
  } finally {
    canvas.width = 0
    canvas.height = 0
  }

  if (
    !best ||
    best.fileSize >= Number(file.size || 0) * 0.9
  ) {
    return null
  }

  return best
}

export function validateMangaFile(file) {
  if (!file) return 'Image file is missing.'

  if (!isMangaImageFile(file)) {
    return `${file.name || 'File'} is not an image.`
  }

  if (file.size > MANGA_INPUT_MAX_BYTES) {
    return `${file.name || 'Image'} is larger than 5 MB.`
  }

  return ''
}

async function decodeMangaHeicToJpeg(file) {
  try {
    const { heicTo } = await import('heic-to')
    const blob = await heicTo({
      blob: file,
      type: 'image/jpeg',
      quality: 0.9,
    })

    if (!(blob instanceof Blob) || !blob.size) {
      throw new Error('HEIC conversion returned an empty image.')
    }

    const base = String(file.name || 'manga-page').replace(/\.[^.]+$/, '')

    return new File([blob], `${base}.jpg`, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    })
  } catch {
    throw new Error(
      'This HEIC/HEIF image could not be converted on this device. [convert: HEIC_CONVERSION_FAILED]'
    )
  }
}

async function convertMangaHeicToWebp(file, loaded) {
  let smallest = null

  for (const maxWidth of widthCandidates(loaded.width)) {
    const dimensions = scaledDimensions(
      loaded.width,
      loaded.height,
      maxWidth
    )
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error(
        'Image processing is unavailable in this browser.'
      )
    }

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    context.drawImage(
      loaded.image,
      0,
      0,
      dimensions.width,
      dimensions.height
    )

    for (const quality of QUALITIES) {
      const blob = await canvasToWebp(canvas, quality)
      const candidate = {
        file: new File(
          [blob],
          safeWebpName(file.name),
          {
            type: 'image/webp',
            lastModified: Date.now(),
          }
        ),
        width: dimensions.width,
        height: dimensions.height,
        fileSize: blob.size,
        mimeType: 'image/webp',
        compressed: true,
      }

      if (!smallest || candidate.fileSize < smallest.fileSize) {
        smallest = candidate
      }

      if (candidate.fileSize <= TARGET_MAX_BYTES) {
        return candidate
      }
    }

    canvas.width = 0
    canvas.height = 0

    if (smallest?.fileSize <= HARD_MAX_BYTES) {
      return smallest
    }
  }

  if (smallest?.fileSize <= HARD_MAX_BYTES) {
    return smallest
  }

  throw new Error(
    'This HEIC/HEIF image could not be converted below the required size.'
  )
}

export async function optimizeMangaImage(file) {
  const validationError = validateMangaFile(file)

  if (validationError) {
    throw new Error(validationError)
  }

  const heic = isMangaHeicFile(file)
  const sourceFile = heic
    ? await decodeMangaHeicToJpeg(file)
    : file

  let loaded

  try {
    loaded = await loadImageFile(sourceFile)
  } catch {
    throw new Error(
      heic
        ? 'The converted HEIC image could not be read. [read: HEIC_PREVIEW_FAILED]'
        : 'This image could not be read on this device. Please choose another image.'
    )
  }

  try {
    if (
      loaded.width > MANGA_MAX_WIDTH ||
      loaded.height > MANGA_MAX_HEIGHT ||
      loaded.width * loaded.height > MANGA_MAX_PIXELS
    ) {
      throw new Error(
        'Manga image is too large. Max: 8000×30000px and 120MP.'
      )
    }

    if (!heic) {
      const original = {
        file,
        width: loaded.width,
        height: loaded.height,
        fileSize: file.size,
        mimeType: file.type || 'application/octet-stream',
        compressed: false,
      }

      const optimized =
        await optimizeStandardMangaImage(file, loaded)

      return optimized || original
    }

    return await convertMangaHeicToWebp(file, loaded)
  } finally {
    URL.revokeObjectURL(loaded.url)
  }
}

function normalizeMangaUploadResult(data) {
  const page =
    data?.page &&
    typeof data.page === 'object'
      ? data.page
      : {}

  const imageUrl =
    data?.image_url ||
    data?.imageUrl ||
    page.image_url ||
    null

  if (!imageUrl) {
    throw new Error(
      'The manga processing finished but the server did not return an image URL. [complete: IMAGE_URL_MISSING]'
    )
  }

  const parts = Array.isArray(page.parts)
    ? page.parts
    : Array.isArray(data?.parts)
      ? data.parts
      : null

  return {
    imageUrl,
    storagePath:
      data?.path ||
      page.storage_path ||
      null,
    width:
      Number(
        page.width ||
        data?.width ||
        0
      ) || null,
    height:
      Number(
        page.height ||
        data?.height ||
        0
      ) || null,
    fileSize:
      Number(
        page.file_size ||
        data?.file_size ||
        0
      ) || null,
    mimeType:
      page.mime_type ||
      data?.mime_type ||
      null,
    ...(parts ? { parts } : {}),
  }
}

function waitForMangaPoll(ms, signal) {
  if (signal?.aborted) {
    return Promise.reject(
      new Error('Upload canceled.')
    )
  }

  return new Promise((resolve, reject) => {
    let timer = null

    const cleanup = () => {
      if (timer) {
        clearTimeout(timer)
      }

      signal?.removeEventListener(
        'abort',
        onAbort
      )
    }

    const onAbort = () => {
      cleanup()
      reject(new Error('Upload canceled.'))
    }

    timer = setTimeout(() => {
      cleanup()
      resolve()
    }, ms)

    signal?.addEventListener(
      'abort',
      onAbort,
      { once: true }
    )
  })
}

function mangaV2PollDelay(startedAt) {
  const elapsed = Date.now() - startedAt
  if (elapsed >= 120000) return 15000
  if (elapsed >= 30000) return 10000
  return MANGA_V2_JOB_POLL_MS
}

async function waitForMangaV2Job({
  apiBaseUrl,
  token,
  jobId,
  statusUrl,
  signal,
  onJobStatus,
}) {
  const safeJobId = String(jobId || '').trim()

  if (!safeJobId) {
    throw new Error(
      'The server queued the manga page without a job ID. [queue: MANGA_JOB_ID_MISSING]'
    )
  }

  const relativeStatusUrl =
    String(statusUrl || '').trim() ||
    `/api/story-media/manga-page-v2/jobs/${safeJobId}`

  const requestUrl =
    /^https?:\/\//i.test(relativeStatusUrl)
      ? relativeStatusUrl
      : `${apiBaseUrl}${relativeStatusUrl}`

  const startedAt = Date.now()
  let networkFailures = 0
  traceMangaUpload('job-poll', {
    state: 'start',
    jobTag: safeJobId.slice(-8),
    apiOrigin: mangaApiOrigin(requestUrl),
  })

  while (
    Date.now() - startedAt <
    MANGA_V2_JOB_TIMEOUT_MS
  ) {
    if (signal?.aborted) {
      throw new Error('Upload canceled.')
    }

    let response

    try {
      response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
        signal,
      })
    } catch (error) {
      if (signal?.aborted) {
        throw new Error('Upload canceled.')
      }
      networkFailures += 1
      traceMangaUpload('job-poll-network', {
        state: 'retry',
        jobTag: safeJobId.slice(-8),
        errorName: String(error?.name || ''),
        message: String(error?.message || ''),
        retryCount: networkFailures,
        waitSeconds: Math.round((Date.now() - startedAt) / 1000),
        apiOrigin: mangaApiOrigin(requestUrl),
      }, 'warn')

      await waitForMangaPoll(
        mangaV2PollDelay(startedAt),
        signal
      )
      continue
    }

      const data =
      await response
        .json()
        .catch(() => ({}))

    const jobStatus = String(data?.status || data?.stage || 'unknown').toLowerCase()
    const diagnostics = data?.queue_diagnostic
    const hasDiagnostic = Boolean(diagnostics && typeof diagnostics === 'object' && diagnostics.code)
    traceMangaUpload('job-poll-response', {
      state: 'received',
      jobTag: safeJobId.slice(-8),
      apiOrigin: mangaApiOrigin(requestUrl),
      httpStatus: response.status,
      jobStatus,
      code: String(diagnostics?.code || data?.error?.code || data?.code || ''),
      attempts: Number(data?.attempt_count || 0),
      maxAttempts: Number(data?.max_attempts || 0),
      diagnosticPresent: hasDiagnostic,
      workerState: String(diagnostics?.worker_state || 'unknown'),
      admissionReason: String(diagnostics?.admission_reason || 'unknown'),
      memoryUsedMb: Number(diagnostics?.memory?.used_mb || 0),
      memoryLimitMb: Number(diagnostics?.memory?.limit_mb || 0),
      waitSeconds: Math.round((Date.now() - startedAt) / 1000),
    }, !response.ok || data?.ok === false ? 'warn' : 'info')
    if (response.ok && jobStatus === 'queued' && !hasDiagnostic) {
      traceMangaUpload('job-diagnostics-missing', {
        state: 'backend-response-missing-field',
        jobTag: safeJobId.slice(-8),
        apiOrigin: mangaApiOrigin(requestUrl),
        httpStatus: response.status,
        code: 'MANGA_QUEUE_DIAGNOSTIC_MISSING',
        message: 'Job is queued, but Backend response has no queue_diagnostic.code. This does NOT identify the reason Worker did not claim it.',
      }, 'warn')
    }

    if (response.ok && data?.ok !== false && typeof onJobStatus === 'function') {
      try { onJobStatus(data) } catch {}
    }

    if (
      !response.ok ||
      data.ok === false
    ) {
      const stage = String(
        data.stage || 'status'
      )
      const code = String(
        data.code ||
        `HTTP_${response.status}`
      )
      const message =
        data.message ||
        'Manga processing status could not be loaded.'

      if (
        response.status >= 500 &&
        response.status < 600
      ) {
        await waitForMangaPoll(
          mangaV2PollDelay(startedAt),
          signal
        )
        continue
      }

      throw new Error(
        `${message} [${stage}: ${code}]`
      )
    }

    const status =
      String(
        data.status ||
        data.stage ||
        ''
      )
        .trim()
        .toLowerCase()

    if (status === 'done') {
      traceMangaUpload('job-complete', {
        jobTag: safeJobId.slice(-8),
        state: 'done',
        waitSeconds: Math.round((Date.now() - startedAt) / 1000),
      })
      return normalizeMangaUploadResult(
        data
      )
    }

    if (
      status === 'failed' ||
      status === 'cancelled'
    ) {
      const errorData =
        data.error &&
        typeof data.error === 'object'
          ? data.error
          : {}
      const code =
        String(
          errorData.code ||
          data.code ||
          'MANGA_PROCESSING_FAILED'
        )
      const message =
        errorData.message ||
        data.message ||
        'The manga page could not be processed.'

      traceMangaUpload('job-failed', {
        jobTag: safeJobId.slice(-8),
        state: 'failed',
        code,
        message,
        waitSeconds: Math.round((Date.now() - startedAt) / 1000),
      }, 'error')
      throw new Error(
        `${message} [process: ${code}]`
      )
    }

    await waitForMangaPoll(
      mangaV2PollDelay(startedAt),
      signal
    )
  }

  traceMangaUpload('job-timeout', {
    state: 'timeout',
    code: 'MANGA_PROCESSING_TIMEOUT',
    jobTag: safeJobId.slice(-8),
    waitSeconds: Math.round((Date.now() - startedAt) / 1000),
    apiOrigin: mangaApiOrigin(requestUrl),
  }, 'error')
  throw new Error(
    'Manga processing is taking longer than expected. Please try again later. [queue: MANGA_PROCESSING_TIMEOUT]'
  )
}

export async function uploadMangaPageFile({
  token,
  file,
  onProgress,
  onJobStatus,
  signal,
  useV2 = true,
}) {
  if (!file) {
    throw new Error('Choose a manga page first.')
  }

  const validationError = validateMangaFile(file)
  if (validationError) throw new Error(validationError)

  if (!token) {
    const error = new Error('Sign in before uploading Manga pages. [auth: MANGA_DIRECT_UNAUTHORIZED]')
    error.status = 401
    error.permanent = true
    throw error
  }

  if (signal?.aborted) {
    throw new Error('Upload canceled.')
  }

  const apiBaseUrl = String(import.meta.env.VITE_API_URL || (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
      ? 'http://localhost:5000'
      : 'https://shadow-backend-kucw.onrender.com'
  )).replace(/\/+$/, '')

  const { stageMangaDirectUpload } = await import('./mangaDirectUploadClient')
  const staged = await stageMangaDirectUpload({
    token,
    file,
    apiBaseUrl,
    signal,
    onProgress,
  })

  return waitForMangaV2Job({
    apiBaseUrl,
    token,
    jobId: staged.job_id,
    statusUrl: staged.status_url,
    signal,
    onJobStatus,
  })
}

export async function runWithConcurrency(
  items,
  concurrency,
  worker
){
  const queue = [...items]
  const workers = Array.from(
    { length: Math.min(concurrency, queue.length) },
    async () => {
      while (queue.length) {
        const item = queue.shift()

        if (item) {
          await worker(item)
        }
      }
    }
  )

  await Promise.all(workers)
}

export function formatFileSize(bytes) {
  const value = Number(bytes || 0)

  if (value < 1024) {
    return `${value} B`
  }

  if (value < 1024 * 1024) {
    return `${Math.round(value / 1024)} KB`
  }

  return `${(
    value /
    (1024 * 1024)
  ).toFixed(1)} MB`
}
