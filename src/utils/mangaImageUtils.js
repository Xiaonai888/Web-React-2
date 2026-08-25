export const MANGA_MAX_PAGES = 100
export const MANGA_MIN_PUBLISH_PAGES = 10
export const MANGA_MAX_FILES_PER_PICK = 30
export const MANGA_INPUT_MAX_BYTES = 5 * 1024 * 1024

const TARGET_MAX_BYTES = 600 * 1024
const HARD_MAX_BYTES = 800 * 1024
const MAX_WIDTH = 1600
const QUALITIES = [0.88, 0.86, 0.84, 0.82, 0.8]

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
    if (!heic) {
      return {
        file,
        width: loaded.width,
        height: loaded.height,
        fileSize: file.size,
        mimeType: file.type || 'application/octet-stream',
        compressed: false,
      }
    }

    return await convertMangaHeicToWebp(file, loaded)
  } finally {
    URL.revokeObjectURL(loaded.url)
  }
}

export async function uploadMangaPageFile({ token, file, onProgress, signal }) {
  if (!file) {
    throw new Error('Choose a manga page first.')
  }

  const validationError = validateMangaFile(file)

  if (validationError) {
    throw new Error(validationError)
  }

  const apiBaseUrl =
    import.meta.env.VITE_API_URL ||
    (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'
        : 'https://shadow-backend-kucw.onrender.com'
    )

  let bytes

  try {
    bytes = await file.arrayBuffer()
  } catch {
    throw new Error('This device could not read the manga image. [read: IMAGE_FILE_READ_FAILED]')
  }

  if (!bytes.byteLength) {
    throw new Error('The selected manga image contains 0 bytes. [read: IMAGE_FILE_EMPTY]')
  }

  if (signal?.aborted) {
    throw new Error('Upload canceled.')
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const startedAt = performance.now()

    const cleanup = () => {
      if (signal) signal.removeEventListener('abort', handleAbortSignal)
    }

    const fail = (error) => {
      cleanup()
      reject(error)
    }

    const handleAbortSignal = () => {
      xhr.abort()
    }

    xhr.open('POST', `${apiBaseUrl}/api/story-media/upload-manga-page`, true)
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream')

    xhr.upload.onprogress = (event) => {
      const total = event.lengthComputable ? event.total : bytes.byteLength
      const loaded = Math.min(event.loaded, total)
      const elapsedSeconds = Math.max((performance.now() - startedAt) / 1000, 0.001)
      const percent = total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : 0

      onProgress?.({
        loaded,
        total,
        percent,
        speedBytesPerSecond: loaded / elapsedSeconds,
      })
    }

    xhr.onerror = () => {
      fail(
        new Error(
          'Network error: the manga page could not reach the server. Check your connection and try again. [network: IMAGE_REQUEST_FAILED]'
        )
      )
    }

    xhr.onabort = () => {
      fail(new Error('Upload canceled.'))
    }

    xhr.onload = () => {
      let data = {}

      try {
        data = xhr.responseText ? JSON.parse(xhr.responseText) : {}
      } catch {
        data = {}
      }

      if (xhr.status < 200 || xhr.status >= 300 || data.ok === false) {
        const stage = String(data.stage || 'upload')
        const code = String(data.code || `HTTP_${xhr.status}`)
        const message = data.message || 'Manga page upload failed.'
        fail(new Error(`${message} [${stage}: ${code}]`))
        return
      }

      const imageUrl = data.image_url || data.imageUrl

      if (!imageUrl) {
        fail(
          new Error(
            'The upload finished but the server did not return an image URL. [complete: IMAGE_URL_MISSING]'
          )
        )
        return
      }

      cleanup()
      resolve({
        imageUrl,
        storagePath: data.path || null,
      })
    }

    if (signal) signal.addEventListener('abort', handleAbortSignal, { once: true })

    onProgress?.({
      loaded: 0,
      total: bytes.byteLength,
      percent: 0,
      speedBytesPerSecond: 0,
    })

    xhr.send(bytes)
  })
}

export async function runWithConcurrency(
  items,
  concurrency,
  worker
) {
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

  return `${(value / (1024 * 1024)).toFixed(1)} MB`
}
