const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_SOURCE_BYTES = 5 * 1024 * 1024
const MAX_BYTES = Math.floor(1.5 * 1024 * 1024)
const ATTEMPTS = [
  [1080, 1920, 0.82],
  [1080, 1920, 0.74],
  [900, 1600, 0.76],
  [900, 1600, 0.68],
  [720, 1280, 0.72],
  [720, 1280, 0.62],
  [540, 960, 0.58],
]

function uploadError(message, code, status = 0) {
  return Object.assign(new Error(message), { code, status })
}

async function compressStoryImage(file) {
  const url = URL.createObjectURL(file)
  const image = new Image()
  const canvas = document.createElement('canvas')
  try {
    await new Promise((resolve, reject) => {
      image.onload = resolve
      image.onerror = () => reject(uploadError('Could not read the Story image on this device', 'STORY_IMAGE_DECODE_FAILED'))
      image.src = url
    })
    const width = image.naturalWidth
    const height = image.naturalHeight
    if (!width || !height || width > 12000 || height > 12000 || width * height > 60000000) {
      throw uploadError('Story image dimensions are too large or invalid', 'STORY_IMAGE_DIMENSIONS_INVALID')
    }
    const context = canvas.getContext('2d', { alpha: true })
    if (!context) throw uploadError('Image compression is unavailable on this device', 'STORY_IMAGE_COMPRESS_FAILED')
    for (const [maxWidth, maxHeight, quality] of ATTEMPTS) {
      const scale = Math.min(1, maxWidth / width, maxHeight / height)
      canvas.width = Math.max(1, Math.round(width * scale))
      canvas.height = Math.max(1, Math.round(height * scale))
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', quality))
      if (!blob || blob.type !== 'image/webp') {
        throw uploadError('WebP compression is unavailable on this device', 'STORY_IMAGE_COMPRESS_FAILED')
      }
      if (blob.size >= 16 && blob.size <= MAX_BYTES) {
        return new File([blob], 'story.webp', { type: 'image/webp' })
      }
    }
    throw uploadError('Photo could not be optimized below 1.5 MB', 'STORY_IMAGE_COMPRESS_FAILED', 413)
  } finally {
    image.onload = null
    image.onerror = null
    image.src = ''
    canvas.width = 0
    canvas.height = 0
    URL.revokeObjectURL(url)
  }
}

async function postJson(url, token, body) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 60000)
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    const result = await response.json().catch(() => ({}))
    if (!response.ok || result.ok === false) {
      throw uploadError(result.message || 'Story upload failed', result.code || 'STORY_IMAGE_REQUEST_FAILED', response.status)
    }
    return result
  } catch (error) {
    if (controller.signal.aborted) throw uploadError('Story request timed out. Check your Stories before trying again.', 'STORY_IMAGE_REQUEST_TIMEOUT', 408)
    throw error
  } finally {
    clearTimeout(timer)
  }
}

function putImage(uploadUrl, file, onProgress) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.open('PUT', uploadUrl)
    request.setRequestHeader('Content-Type', file.type)
    request.timeout = 180000
    request.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) {
        onProgress(Math.min(90, 5 + Math.round(event.loaded / event.total * 85)))
      }
    }
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) resolve()
      else reject(uploadError('Cloudflare R2 rejected the Story image', 'STORY_IMAGE_R2_REJECTED', request.status))
    }
    request.onerror = () => reject(uploadError('Could not reach Cloudflare R2', 'STORY_IMAGE_R2_NETWORK_ERROR'))
    request.ontimeout = () => reject(uploadError('Story image upload timed out', 'STORY_IMAGE_R2_TIMEOUT', 408))
    request.onabort = () => reject(uploadError('Story image upload canceled', 'STORY_IMAGE_R2_CANCELED'))
    request.send(file)
  })
}

export async function uploadStoryImageDirect({ apiBaseUrl, mode, file, token, textOverlay = '', onProgress = () => {} }) {
  if (!token) throw uploadError('Please sign in before sharing a Story', 'UNAUTHORIZED', 401)
  if (!['reader', 'author'].includes(mode)) throw uploadError('Invalid Story mode', 'STORY_IMAGE_MODE_INVALID', 400)
  if (!file || !IMAGE_TYPES.has(file.type) || !Number.isSafeInteger(file.size) || file.size < 16 || file.size > MAX_SOURCE_BYTES) {
    throw uploadError('Story image must be JPEG, PNG or WebP and no larger than 5 MB', 'STORY_IMAGE_INVALID', 415)
  }
  const caption = String(textOverlay || '').trim()
  if (caption.length > 200) throw uploadError('Caption must be 200 characters or fewer', 'STORY_CAPTION_TOO_LONG', 400)
  const base = String(apiBaseUrl || '').replace(/\/+$/, '')
  onProgress(1)
  const uploadFile = await compressStoryImage(file)
  const init = await postJson(`${base}/api/media-direct/user/init`, token, {
    category: mode === 'author' ? 'author_story_image' : 'reader_story_image',
    mime_type: uploadFile.type,
    file_size: uploadFile.size,
  })
  let destination
  try { destination = new URL(init.upload_url) } catch {}
  if (!destination || destination.protocol !== 'https:' || !init.upload_token) {
    throw uploadError('Story upload preparation is incomplete', 'STORY_IMAGE_INIT_INVALID', 503)
  }
  onProgress(5)
  await putImage(destination.href, uploadFile, onProgress)
  onProgress(94)
  const result = await postJson(`${base}/api/media-direct/user/story/finalize`, token, {
    upload_token: init.upload_token,
    caption,
    allow_messages: true,
  })
  if (!result.story?.id) throw uploadError('Story publication could not be confirmed. Check your Stories before trying again.', 'STORY_IMAGE_PUBLISH_UNCONFIRMED')
  onProgress(100)
  return result.story
}
