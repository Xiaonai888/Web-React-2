const MB = 1024 * 1024

const DIRECT_IMAGE_LIMITS = Object.freeze({
  reader_story_image: 5 * MB,
  reader_post_image: 5 * MB,
  reader_avatar: 2 * MB,
  story_cover: 5 * MB,
  story_landscape_thumbnail: 5 * MB,
  story_slide: 5 * MB,
  episode_cover: 5 * MB,
  episode_content: 5 * MB,
  chat_story_character: 2 * MB,
  chat_story_episode: 5 * MB,
  author_post_image: 5 * MB,
  author_store_cover: 5 * MB,
  author_store_gallery: 5 * MB,
  author_page_cover: 5 * MB,
  author_page_slide: 5 * MB,
  author_page_avatar: 2 * MB,
})

const LEGACY_STORY_MEDIA_CATEGORIES = new Set([
  'story_cover',
  'story_landscape_thumbnail',
  'story_slide',
  'episode_cover',
  'episode_content',
  'chat_story_character',
  'chat_story_episode',
  'author_post_image',
  'author_store_cover',
  'author_store_gallery',
  'author_page_cover',
  'author_page_slide',
  'author_page_avatar',
])

const DIRECT_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const DEFAULT_API_URL = import.meta.env?.VITE_API_URL ||
  (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

let temporarilyUnavailableUntil = 0

function uploadError(message, status = 0, code = '') {
  const error = new Error(message)
  error.status = status
  error.code = code
  return error
}

function reportProgress(onProgress, percent, stage) {
  if (typeof onProgress === 'function') onProgress(percent, stage)
}

function isCanceled(error, signal) {
  return signal?.aborted || error?.name === 'AbortError'
}

function allowLegacyFallback(error, stage) {
  if (stage === 'init') {
    return error?.code === 'DIRECT_UPLOAD_NOT_ENABLED' ||
      error?.code === 'DIRECT_UPLOAD_UNAVAILABLE' ||
      error?.code === 'DIRECT_UPLOAD_NETWORK_ERROR' ||
      error?.status === 404 ||
      error?.status === 405 ||
      error?.status === 408 ||
      error?.status >= 500
  }

  if (stage === 'transfer') {
    return error?.code === 'DIRECT_UPLOAD_NETWORK_ERROR' ||
      error?.status === 403 ||
      error?.status === 408 ||
      error?.status >= 500
  }

  if (stage === 'finalize') {
    return error?.code === 'DIRECT_UPLOAD_NOT_ENABLED' ||
      error?.code === 'DIRECT_UPLOAD_UNAVAILABLE' ||
      error?.code === 'DIRECT_UPLOAD_NETWORK_ERROR' ||
      error?.code === 'DIRECT_UPLOAD_NOT_FOUND' ||
      error?.status === 404 ||
      error?.status === 408 ||
      error?.status >= 500
  }

  return false
}

async function postJson(url, token, data, signal) {
  let response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal,
    })
  } catch (error) {
    if (isCanceled(error, signal)) throw error
    throw uploadError('Direct upload server could not be reached', 0, 'DIRECT_UPLOAD_NETWORK_ERROR')
  }

  const result = await response.json().catch(() => ({}))
  if (!response.ok || result.ok === false) {
    throw uploadError(result.message || 'Direct upload failed', response.status, result.code || '')
  }
  return result
}

function putFile(url, file, onProgress, signal) {
  if (typeof XMLHttpRequest === 'undefined') {
    return fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
      signal,
    }).then((response) => {
      if (!response.ok) throw uploadError('Cloudflare R2 rejected the upload', response.status)
    }).catch((error) => {
      if (isCanceled(error, signal) || error?.status) throw error
      throw uploadError('Cloudflare R2 could not be reached', 0, 'DIRECT_UPLOAD_NETWORK_ERROR')
    })
  }

  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    let settled = false

    const finish = (error) => {
      if (settled) return
      settled = true
      signal?.removeEventListener('abort', abort)
      if (error) reject(error)
      else resolve()
    }

    const abort = () => request.abort()
    if (signal?.aborted) {
      finish(uploadError('Upload was canceled', 0, 'DIRECT_UPLOAD_CANCELED'))
      return
    }

    request.open('PUT', url)
    request.setRequestHeader('Content-Type', file.type)
    request.timeout = 180000
    request.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) {
        reportProgress(onProgress, Math.min(94, Math.round(event.loaded / event.total * 94)), 'uploading')
      }
    }
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) finish()
      else finish(uploadError('Cloudflare R2 rejected the upload', request.status))
    }
    request.onerror = () => finish(uploadError('Cloudflare R2 could not be reached', 0, 'DIRECT_UPLOAD_NETWORK_ERROR'))
    request.ontimeout = () => finish(uploadError('Cloudflare R2 upload timed out', 408))
    request.onabort = () => finish(uploadError('Upload was canceled', 0, 'DIRECT_UPLOAD_CANCELED'))
    signal?.addEventListener('abort', abort, { once: true })
    request.send(file)
  })
}

async function uploadThroughRender({ file, category, token, apiBaseUrl, legacyUpload, signal, onProgress }) {
  reportProgress(onProgress, 0, 'fallback')
  if (typeof legacyUpload === 'function') {
    return legacyUpload({ file, category, token, signal, onProgress })
  }
  if (!LEGACY_STORY_MEDIA_CATEGORIES.has(category)) {
    throw uploadError('This media type requires its existing upload handler')
  }

  const formData = new FormData()
  formData.append('image', file)
  formData.append('folder', category)
  let response
  try {
    response = await fetch(`${apiBaseUrl}/api/story-media/upload-image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
      signal,
    })
  } catch (error) {
    if (isCanceled(error, signal)) throw error
    throw uploadError('Cannot reach the existing Render upload service. Check backend availability and retry.', 0, 'LEGACY_UPLOAD_NETWORK_ERROR')
  }
  const result = await response.json().catch(() => ({}))
  if (!response.ok || result.ok === false) {
    throw uploadError(result.message || 'Image upload failed', response.status, result.code || '')
  }
  reportProgress(onProgress, 100, 'complete')
  return result
}

export async function uploadMediaWithFallback({
  file,
  category,
  token,
  apiBaseUrl = DEFAULT_API_URL,
  legacyUpload = null,
  onProgress = null,
  signal = null,
}) {
  if (!file || !Number.isSafeInteger(file.size) || file.size <= 0) {
    throw uploadError('Please select a valid image file')
  }
  if (!token) throw uploadError('Please sign in before uploading', 401)

  const uploadLegacy = () => uploadThroughRender({
    file,
    category,
    token,
    apiBaseUrl: String(apiBaseUrl).replace(/\/+$/, ''),
    legacyUpload,
    onProgress,
    signal,
  })

  if (!Object.hasOwn(DIRECT_IMAGE_LIMITS, category) || !DIRECT_MIME_TYPES.has(file.type)) {
    return uploadLegacy()
  }
  if (file.size < 16 || file.size > DIRECT_IMAGE_LIMITS[category]) {
    throw uploadError('Image size is invalid or exceeds its limit', 413, 'DIRECT_UPLOAD_SIZE_INVALID')
  }
  if (signal?.aborted) throw uploadError('Upload was canceled', 0, 'DIRECT_UPLOAD_CANCELED')
  if (Date.now() < temporarilyUnavailableUntil) return uploadLegacy()

  const base = String(apiBaseUrl).replace(/\/+$/, '')
  let stage = 'init'

  try {
    reportProgress(onProgress, 0, 'preparing')
    const init = await postJson(`${base}/api/media-direct/user/init`, token, {
      category,
      mime_type: file.type,
      file_size: file.size,
    }, signal)
    if (!init.upload_url || !init.upload_token) {
      throw uploadError('Direct upload response is incomplete', 503, 'DIRECT_UPLOAD_UNAVAILABLE')
    }

    stage = 'transfer'
    await putFile(init.upload_url, file, onProgress, signal)
    stage = 'finalize'
    reportProgress(onProgress, 95, 'finalizing')
    const result = await postJson(`${base}/api/media-direct/user/finalize`, token, {
      upload_token: init.upload_token,
    }, signal)
    reportProgress(onProgress, 100, 'complete')
    return result
  } catch (error) {
    if (isCanceled(error, signal) || error?.code === 'DIRECT_UPLOAD_CANCELED') throw error
    if (!allowLegacyFallback(error, stage)) throw error
    temporarilyUnavailableUntil = Date.now() + 60000
    return uploadLegacy()
  }
}
