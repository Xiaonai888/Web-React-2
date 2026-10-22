const MAX_MANGA_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MANGA_DIRECT_ENDPOINT = '/api/story-media/manga-direct'

function backendBaseUrl(value) {
  const configured = String(value || import.meta.env.VITE_API_URL || '').trim()
  if (configured) return configured.replace(/\/+$/, '')
  return ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'
}

function uploadError(message, { code = 'MANGA_DIRECT_FAILED', stage = 'upload', status = 0, fallbackSafe = false } = {}) {
  const error = new Error(message)
  error.code = code
  error.stage = stage
  error.status = status
  error.fallbackSafe = fallbackSafe
  return error
}

async function postJson(baseUrl, route, token, body, signal) {
  let response
  try {
    response = await fetch(`${baseUrl}${MANGA_DIRECT_ENDPOINT}/${route}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      ...(signal ? { signal } : {}),
    })
  } catch (error) {
    throw uploadError(error?.message || 'Could not reach the upload server.', {
      code: 'MANGA_DIRECT_NETWORK_ERROR',
      stage: route,
    })
  }

  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.ok === false) {
    throw uploadError(data.message || `Manga upload ${route} failed.`, {
      code: String(data.code || `HTTP_${response.status}`),
      stage: route,
      status: response.status,
    })
  }
  return data
}

function uploadSignedFile({ url, file, mimeType, signal, onProgress }) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    let finished = false
    const startedAt = performance.now()

    const finish = (error) => {
      if (finished) return
      finished = true
      signal?.removeEventListener('abort', onAbort)
      if (error) reject(error)
      else resolve()
    }

    const onAbort = () => xhr.abort()
    if (signal?.aborted) {
      finish(uploadError('Upload canceled.', { code: 'MANGA_DIRECT_ABORTED', stage: 'put' }))
      return
    }

    xhr.open('PUT', url, true)
    xhr.setRequestHeader('Content-Type', mimeType)
    xhr.upload.onprogress = (event) => {
      const total = event.lengthComputable ? event.total : file.size
      const loaded = Math.min(event.loaded, total)
      const seconds = Math.max((performance.now() - startedAt) / 1000, 0.001)
      onProgress?.({
        loaded,
        total,
        percent: total > 0 ? Math.min(100, Math.round(loaded * 100 / total)) : 0,
        speedBytesPerSecond: loaded / seconds,
        processing: false,
      })
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) finish()
      else finish(uploadError('Cloudflare R2 rejected the Manga file.', {
        code: `MANGA_DIRECT_PUT_${xhr.status}`,
        stage: 'put',
        status: xhr.status,
      }))
    }
    xhr.onerror = () => finish(uploadError('Could not upload the Manga file to Cloudflare R2.', {
      code: 'MANGA_DIRECT_PUT_NETWORK_ERROR', stage: 'put',
    }))
    xhr.ontimeout = () => finish(uploadError('Cloudflare R2 upload timed out.', {
      code: 'MANGA_DIRECT_PUT_TIMEOUT', stage: 'put',
    }))
    xhr.onabort = () => finish(uploadError('Upload canceled.', {
      code: 'MANGA_DIRECT_ABORTED', stage: 'put',
    }))
    signal?.addEventListener('abort', onAbort, { once: true })
    try {
      xhr.send(file)
    } catch (error) {
      finish(uploadError(error?.message || 'Cloudflare R2 upload could not start.', {
        code: 'MANGA_DIRECT_PUT_FAILED', stage: 'put',
      }))
    }
  })
}

export function isMangaDirectFallbackSafe(error) {
  return Boolean(error?.fallbackSafe === true)
}

export async function cancelMangaDirectUpload({ token, uploadToken, apiBaseUrl } = {}) {
  if (!token || !uploadToken) return false
  const result = await postJson(backendBaseUrl(apiBaseUrl), 'cancel', token, {
    upload_token: uploadToken,
  })
  return result.ok === true
}

export async function stageMangaDirectUpload({
  token,
  file,
  apiBaseUrl,
  signal,
  onProgress,
} = {}) {
  if (!token) throw uploadError('Sign in before uploading Manga pages.', {
    code: 'MANGA_DIRECT_UNAUTHORIZED', stage: 'init', status: 401,
  })
  if (!(file instanceof Blob) || file.size < 16 || file.size > MAX_MANGA_BYTES) {
    throw uploadError('Manga page must be 5 MB or smaller.', {
      code: 'MANGA_DIRECT_SIZE_INVALID', stage: 'init', status: 413,
    })
  }
  const mimeType = String(file.type || '').trim().toLowerCase()
  if (!ALLOWED_TYPES.has(mimeType)) {
    throw uploadError('Use the existing Manga V2 upload for this image format.', {
      code: 'MANGA_DIRECT_TYPE_UNSUPPORTED', stage: 'init', status: 415, fallbackSafe: true,
    })
  }
  if (signal?.aborted) {
    throw uploadError('Upload canceled.', { code: 'MANGA_DIRECT_ABORTED', stage: 'init' })
  }

  const baseUrl = backendBaseUrl(apiBaseUrl)
  let session
  try {
    session = await postJson(baseUrl, 'init', token, {
      file_name: String(file.name || 'manga-page').slice(0, 240),
      file_size: file.size,
      mime_type: mimeType,
    }, signal)
  } catch (error) {
    if (!signal?.aborted && [0, 404, 405, 415, 500, 501, 502, 503, 504].includes(error.status)) {
      error.fallbackSafe = true
    }
    throw error
  }

  const signedUrl = String(session.upload_url || '')
  const uploadToken = String(session.upload_token || '')
  const requiredType = String(session.required_headers?.['Content-Type'] || mimeType).toLowerCase()
  if (!/^https:\/\//i.test(signedUrl) || !uploadToken || requiredType !== mimeType) {
    throw uploadError('The direct upload session is incomplete.', {
      code: 'MANGA_DIRECT_SESSION_INVALID', stage: 'init',
    })
  }

  let fileUploaded = false
  try {
    await uploadSignedFile({ url: signedUrl, file, mimeType, signal, onProgress })
    fileUploaded = true
    if (signal?.aborted) throw uploadError('Upload canceled.', {
      code: 'MANGA_DIRECT_ABORTED', stage: 'put',
    })
    onProgress?.({
      loaded: file.size,
      total: file.size,
      percent: 100,
      speedBytesPerSecond: 0,
      processing: true,
    })
    const result = await postJson(baseUrl, 'finalize', token, {
      upload_token: uploadToken,
    })
    const jobId = String(result.job_id || '')
    if (!jobId || !result.status_url) {
      throw uploadError('Manga processing job was not returned.', {
        code: 'MANGA_DIRECT_JOB_MISSING', stage: 'finalize',
      })
    }
    return result
  } catch (error) {
    if (!fileUploaded || error.code === 'MANGA_DIRECT_ABORTED') {
      try {
        await cancelMangaDirectUpload({ token, uploadToken, apiBaseUrl: baseUrl })
      } catch {}
    }
    throw error
  }
}
