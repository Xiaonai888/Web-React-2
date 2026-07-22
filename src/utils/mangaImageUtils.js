export const MANGA_MAX_PAGES = 100
export const MANGA_MIN_PUBLISH_PAGES = 10
export const MANGA_MAX_FILES_PER_PICK = 10
export const MANGA_INPUT_MAX_BYTES = 2 * 1024 * 1024

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
      resolve({ image, url, width: image.naturalWidth, height: image.naturalHeight })
    }

    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read this image.'))
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
  const base = String(name).replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-_]+/g, '-').replace(/^-+|-+$/g, '')
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
  ].filter((width, index, values) => width > 0 && values.indexOf(width) === index)
}

export function validateMangaFile(file) {
  if (!file) return 'Image file is missing.'
  if (!String(file.type || '').startsWith('image/')) return `${file.name || 'File'} is not an image.`
  if (file.size > MANGA_INPUT_MAX_BYTES) return `${file.name || 'Image'} is larger than 2 MB.`
  return ''
}

export async function optimizeMangaImage(file) {
  const validationError = validateMangaFile(file)
  if (validationError) throw new Error(validationError)

  const loaded = await loadImageFile(file)

  try {
    const alreadyOptimized =
      file.type === 'image/webp' &&
      loaded.width <= MAX_WIDTH &&
      file.size <= HARD_MAX_BYTES

    if (alreadyOptimized) {
      return {
        file,
        width: loaded.width,
        height: loaded.height,
        fileSize: file.size,
        mimeType: 'image/webp',
        compressed: false,
      }
    }

    let smallest = null

    for (const maxWidth of widthCandidates(loaded.width)) {
      const dimensions = scaledDimensions(loaded.width, loaded.height, maxWidth)
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      if (!context) throw new Error('Image processing is unavailable in this browser.')

      canvas.width = dimensions.width
      canvas.height = dimensions.height
      context.drawImage(loaded.image, 0, 0, dimensions.width, dimensions.height)

      for (const quality of QUALITIES) {
        const blob = await canvasToWebp(canvas, quality)
        const candidate = {
          file: new File([blob], safeWebpName(file.name), {
            type: 'image/webp',
            lastModified: Date.now(),
          }),
          width: dimensions.width,
          height: dimensions.height,
          fileSize: blob.size,
          mimeType: 'image/webp',
          compressed: true,
        }

        if (!smallest || candidate.fileSize < smallest.fileSize) smallest = candidate
        if (candidate.fileSize <= TARGET_MAX_BYTES) return candidate
      }

      if (smallest?.fileSize <= HARD_MAX_BYTES) return smallest
    }

    if (smallest?.fileSize <= HARD_MAX_BYTES) return smallest
    throw new Error('This image could not be compressed below 800 KB. Try a smaller image.')
  } finally {
    URL.revokeObjectURL(loaded.url)
  }
}

export async function uploadMangaPageFile({ token, file, storyId, pageId }) {
  const formData = new FormData()
  const safeStoryId = String(storyId || 'story').replace(/[^a-zA-Z0-9-_]/g, '')
  const safePageId = String(pageId || Date.now()).replace(/[^a-zA-Z0-9-_]/g, '')
  const uploadFile = new File([file], `manga-${safeStoryId}-${safePageId}.webp`, {
    type: file.type || 'image/webp',
    lastModified: Date.now(),
  })

  formData.append('image', uploadFile)
  formData.append('folder', 'episode_content')

  const response = await fetch(`${
    import.meta.env.VITE_API_URL ||
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:5000'
      : 'https://shadow-backend-kucw.onrender.com')
  }/api/story-media/upload-image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to upload manga page.')
  }

  return {
    imageUrl: data.image_url || data.imageUrl,
    storagePath: data.path || null,
  }
}

export async function runWithConcurrency(items, concurrency, worker) {
  const queue = [...items]
  const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (queue.length) {
      const item = queue.shift()
      if (item) await worker(item)
    }
  })

  await Promise.all(workers)
}

export function formatFileSize(bytes) {
  const value = Number(bytes || 0)
  if (value < 1024) return `${value} B`
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`
  return `${(value / (1024 * 1024)).toFixed(1)} MB`
}
