import { mangaApiOrigin, traceMangaUpload } from './mangaUploadConsoleTrace'

const MAX_MANGA_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MANGA_DIRECT_ENDPOINT = '/api/story-media/manga-direct'
const INIT_TIMEOUT_MS = 20000
const FINALIZE_TIMEOUT_MS = 45000
const CANCEL_TIMEOUT_MS = 8000
const PUT_TIMEOUT_MS = 180000

function backendBaseUrl(value) {
  const configured = String(value || import.meta.env.VITE_API_URL || '').trim()
  if (configured) return configured.replace(/\/+$/, '')
  return ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'
}

function uploadError(message, {
  code = 'MANGA_DIRECT_FAILED',
  stage = 'upload',
  status = 0,
  permanent = false,
} = {}) {
  const error = new Error(`${message} [${stage}: ${code}]`)
  error.code = code
  error.stage = stage
  error.status = status
  error.permanent = permanent
  error.fallbackSafe = false
  return error
}

function canceled(stage) {
  return uploadError('Upload canceled.', {
    code: 'MANGA_DIRECT_ABORTED',
    stage,
  })
}

function isPermanentResponse(code, status, stage) {
  if ([
    'MANGA_DIRECT_DISABLED',
    'MANGA_DIRECT_UNAVAILABLE',
    'MANGA_DIRECT_UNAUTHORIZED',
    'MANGA_DIRECT_TYPE_UNSUPPORTED',
    'MANGA_DIRECT_SIZE_INVALID',
    'MANGA_DIRECT_RATE_LIMIT',
    'MANGA_DIRECT_TOKEN_INVALID',
    'MANGA_DIRECT_OWNER_MISMATCH',
  ].includes(code)) {
    return code !== 'MANGA_DIRECT_RATE_LIMIT'
  }
  if ([400, 401, 403, 404, 405, 413, 415, 422].includes(status)) return true
  if (stage === 'init' && status >= 500) return true
  if (stage === 'put' && status >= 500) return true
  return false
}

function requestTimeout(route) {
  if (route === 'init') return INIT_TIMEOUT_MS
  if (route === 'finalize') return FINALIZE_TIMEOUT_MS
  return CANCEL_TIMEOUT_MS
}

async function postJson(baseUrl, route, token, body, signal) {
  if (signal?.aborted) throw canceled(route)

  const startedAt = Date.now()
  traceMangaUpload(`backend-${route}`, {
    state: 'start',
    route: `${MANGA_DIRECT_ENDPOINT}/${route}`,
    apiOrigin: mangaApiOrigin(baseUrl),
  })
  const controller = new AbortController()
  const abort = () => controller.abort()
  let timedOut = false

  signal?.addEventListener('abort', abort, { once: true })
  const timer = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, requestTimeout(route))

  try {
    const response = await fetch(`${baseUrl}${MANGA_DIRECT_ENDPOINT}/${route}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    const payload = await response.text()
    let data
    try {
      data = payload ? JSON.parse(payload) : {}
    } catch {
      throw uploadError('Upload server returned an invalid response.', {
        code: 'MANGA_DIRECT_INVALID_RESPONSE',
        stage: route,
        status: response.status,
        permanent: true,
      })
    }

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw uploadError('Upload server returned an invalid response.', {
        code: 'MANGA_DIRECT_INVALID_RESPONSE',
        stage: route,
        status: response.status,
        permanent: true,
      })
    }

        traceMangaUpload(`backend-${route}`, {
      state: 'response',
      httpStatus: response.status,
      code: String(data.code || ''),
      elapsedMs: Date.now() - startedAt,
      apiOrigin: mangaApiOrigin(baseUrl),
    }, !response.ok || data.ok === false ? 'error' : 'info')

    if (!response.ok || data.ok === false) {
      const code = String(data.code || `HTTP_${response.status}`)
      const description = code === 'MANGA_DIRECT_DISABLED'
        ? 'Direct Manga upload is disabled on the server.'
        : data.message || `Manga upload ${route} failed.`
      throw uploadError(description, {
        code,
        stage: route,
        status: response.status,
        permanent: isPermanentResponse(code, response.status, route),
      })
    }

    return data
  } catch (error) {
    traceMangaUpload(`backend-${route}`, {
      state: signal?.aborted ? 'canceled' : 'failed',
      code: String(error?.code || 'NETWORK_OR_TIMEOUT'),
      httpStatus: Number(error?.status || 0),
      message: String(error?.message || ''),
      errorName: String(error?.name || ''),
      elapsedMs: Date.now() - startedAt,
      apiOrigin: mangaApiOrigin(baseUrl),
    }, signal?.aborted ? 'warn' : 'error')
    if (error?.code) throw error
    if (signal?.aborted) throw canceled(route)
    if (timedOut) {
      throw uploadError(`Manga ${route} request timed out.`, {
        code: `MANGA_DIRECT_${route.toUpperCase()}_TIMEOUT`,
        stage: route,
        status: 408,
        permanent: route === 'finalize',
      })
    }
    throw uploadError('Could not reach the Manga direct upload server. Check your connection.', {
      code: `MANGA_DIRECT_${route.toUpperCase()}_NETWORK_ERROR`,
      stage: route,
    })
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', abort)
  }
}

function uploadSignedFile({ url, file, mimeType, signal, onProgress }) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    let finished = false
    const startedAt = performance.now()
    traceMangaUpload('r2-put', { state: 'start', bytes: file.size })

    const finish = (error) => {
      if (finished) return
      finished = true
      traceMangaUpload('r2-put', {
        state: error ? 'failed' : 'complete',
        httpStatus: Number(xhr.status || 0),
        code: String(error?.code || ''),
        message: String(error?.message || ''),
        bytes: file.size,
        elapsedMs: performance.now() - startedAt,
      }, error ? 'error' : 'info')
      signal?.removeEventListener('abort', onAbort)
      if (error) reject(error)
      else resolve()
    }

    const onAbort = () => xhr.abort()

    if (signal?.aborted) {
      finish(canceled('put'))
      return
    }

    try {
      xhr.open('PUT', url, true)
      xhr.timeout = PUT_TIMEOUT_MS
      xhr.setRequestHeader('Content-Type', mimeType)

      xhr.upload.onprogress = (event) => {
        const total = event.lengthComputable && event.total > 0
          ? event.total
          : file.size
        const loaded = Math.max(0, Math.min(event.loaded, total))
        const seconds = Math.max((performance.now() - startedAt) / 1000, 0.001)
        traceMangaUpload('r2-progress', {
          state: 'sending',
          loaded,
          bytes: total,
          percent: total > 0 ? Math.round(loaded * 100 / total) : 0,
        })
        try {
          onProgress?.({
            loaded,
            total,
            percent: total > 0 ? Math.min(100, Math.round(loaded * 100 / total)) : 0,
            speedBytesPerSecond: loaded / seconds,
            processing: false,
          })
        } catch {}
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          finish()
          return
        }
        finish(uploadError('Cloudflare R2 rejected the Manga image.', {
          code: `MANGA_DIRECT_PUT_${xhr.status}`,
          stage: 'put',
          status: xhr.status,
          permanent: isPermanentResponse('', xhr.status, 'put'),
        }))
      }

      xhr.onerror = () => finish(uploadError('Cannot reach Cloudflare R2. Check the network and R2 CORS configuration.', {
        code: 'MANGA_DIRECT_PUT_NETWORK_ERROR',
        stage: 'put',
      }))

      xhr.ontimeout = () => finish(uploadError('Cloudflare R2 upload timed out.', {
        code: 'MANGA_DIRECT_PUT_TIMEOUT',
        stage: 'put',
        status: 408,
      }))

      xhr.onabort = () => finish(canceled('put'))
      signal?.addEventListener('abort', onAbort, { once: true })
      xhr.send(file)
    } catch {
      finish(uploadError('Cloudflare R2 upload could not start.', {
        code: 'MANGA_DIRECT_PUT_FAILED',
        stage: 'put',
        permanent: true,
      }))
    }
  })
}

export function isMangaDirectFallbackSafe() {
  return false
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
  if (!token) {
    throw uploadError('Sign in before uploading Manga pages.', {
      code: 'MANGA_DIRECT_UNAUTHORIZED',
      stage: 'init',
      status: 401,
      permanent: true,
    })
  }

  if (!(file instanceof Blob) || file.size < 16 || file.size > MAX_MANGA_BYTES) {
    throw uploadError('Manga page must be 5 MB or smaller.', {
      code: 'MANGA_DIRECT_SIZE_INVALID',
      stage: 'init',
      status: 413,
      permanent: true,
    })
  }

  const mimeType = String(file.type || '').trim().toLowerCase()
  if (!ALLOWED_TYPES.has(mimeType)) {
    throw uploadError('Manga Direct Upload supports JPEG, PNG and WebP images.', {
      code: 'MANGA_DIRECT_TYPE_UNSUPPORTED',
      stage: 'init',
      status: 415,
      permanent: true,
    })
  }

  if (signal?.aborted) throw canceled('init')

  const baseUrl = backendBaseUrl(apiBaseUrl)
  const session = await postJson(baseUrl, 'init', token, {
    file_name: String(file.name || 'manga-page').slice(0, 240),
    file_size: file.size,
    mime_type: mimeType,
  }, signal)

  const signedUrl = String(session.upload_url || '')
  const uploadToken = String(session.upload_token || '')
  const requiredType = String(session.required_headers?.['Content-Type'] || mimeType).toLowerCase()

  if (!/^https:\/\//i.test(signedUrl) || !uploadToken || requiredType !== mimeType) {
    throw uploadError('Direct Manga upload session is incomplete.', {
      code: 'MANGA_DIRECT_SESSION_INVALID',
      stage: 'init',
      permanent: true,
    })
  }

  let fileUploaded = false

  try {
    await uploadSignedFile({
      url: signedUrl,
      file,
      mimeType,
      signal,
      onProgress,
    })
    fileUploaded = true

    if (signal?.aborted) throw canceled('put')

    const result = await postJson(baseUrl, 'finalize', token, {
      upload_token: uploadToken,
    }, signal)

    const jobId = String(result.job_id || '')
    if (!jobId || !result.status_url) {
      throw uploadError('Manga processing job was not returned.', {
        code: 'MANGA_DIRECT_JOB_MISSING',
        stage: 'finalize',
        permanent: true,
      })
    }

        traceMangaUpload('finalize-job', {
      state: 'queued',
      jobStatus: String(result.status || 'queued'),
      code: String(result.code || ''),
      jobTag: jobId.slice(-8),
    })

    try {
      onProgress?.({
        loaded: file.size,
        total: file.size,
        percent: 100,
        speedBytesPerSecond: 0,
        processing: true,
      })
    } catch {}

    if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') {
      window.dispatchEvent(new CustomEvent('shadow-manga-r2-accepted', {
        detail: { jobId, uploadId: String(result.upload_id || '') },
      }))
    }

    return result
  } catch (error) {
    if (!fileUploaded) {
      try {
        await cancelMangaDirectUpload({
          token,
          uploadToken,
          apiBaseUrl: baseUrl,
        })
      } catch {}
    }
    throw error
  }
}
