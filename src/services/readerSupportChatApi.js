import { getReaderToken } from './chatApi'
import { optimizeImageForUpload } from '../utils/imageUploadOptimizer'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://shadow-backend-kucw.onrender.com'
const BASE = `${API_BASE_URL}/api/reader/support-chat`
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_IMAGE_BYTES = 2 * 1024 * 1024
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export class ReaderSupportChatApiError extends Error {
  constructor(status, code, message) {
    super(message)
    this.name = 'ReaderSupportChatApiError'
    this.status = status
    this.code = code
  }
}

function imageError(code, status = 400) {
  return new ReaderSupportChatApiError(status, code, code)
}

function requireSameToken(token) {
  if (!token || token !== getReaderToken()) throw new ReaderSupportChatApiError(401, 'LOGIN_REQUIRED', 'Please sign in to chat with Shadow Support')
}

async function request(path, { method = 'GET', body, signal, expectedToken = getReaderToken() } = {}) {
  requireSameToken(expectedToken)
  const response = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${expectedToken}`,
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    ...(signal ? { signal } : {}),
    cache: 'no-store',
    redirect: 'error',
  })
  const data = await response.json().catch(() => ({}))
  requireSameToken(expectedToken)
  if (!response.ok || data?.ok === false) {
    throw new ReaderSupportChatApiError(response.status, data?.code || 'READER_SUPPORT_ERROR', data?.message || 'Support chat is unavailable')
  }
  return data
}

export function getMySupportConversation({ signal, deletionCheckIds = '' } = {}) {
  const params = deletionCheckIds ? `?${new URLSearchParams({ deletion_check_ids: deletionCheckIds })}` : ''
  return request(`/mine${params}`, { signal })
}

export function getMySupportMessages({ before = '', signal } = {}) {
  const params = before ? `?${new URLSearchParams({ before })}` : ''
  return request(`/mine/messages${params}`, { signal })
}

export function sendMySupportMessage(message, requestId) {
  return request('/mine/messages', {
    method: 'POST',
    body: { message, ...(requestId ? { request_id: requestId } : {}) },
  })
}

export function replyMySupportMessage(messageId, message, requestId) {
  return request(`/mine/messages/${encodeURIComponent(messageId)}/reply`, {
    method: 'POST',
    body: { message, ...(requestId ? { request_id: requestId } : {}) },
  })
}

export function editMySupportMessage(messageId, message) {
  return request(`/mine/messages/${encodeURIComponent(messageId)}`, {
    method: 'PATCH',
    body: { message },
  })
}

export function deleteMySupportMessage(messageId) {
  return request(`/mine/messages/${encodeURIComponent(messageId)}`, {
    method: 'DELETE',
  })
}

export function markMySupportRead() {
  return request('/mine/read', { method: 'PATCH' })
}

export function markMySupportSeen(messageId, { signal } = {}) {
  if (!UUID.test(String(messageId || ''))) throw imageError('SUPPORT_SEEN_INVALID')
  return request('/mine/seen', { method: 'PATCH', body: { through_message_id: messageId }, signal })
}

export function getMySupportBlock({ signal } = {}) {
  return request('/mine/block', { signal })
}

function validateSupportPins(data) {
  if (data?.ok !== true || !Array.isArray(data.pins) || data.pins.length > 50 || data.pins.some(pin => !UUID.test(String(pin?.message_id || '')))) {
    throw new ReaderSupportChatApiError(503, 'SUPPORT_PIN_INVALID_RESPONSE', 'Support pins are unavailable')
  }
  return data
}

export async function getMySupportPins({ signal } = {}) {
  return validateSupportPins(await request('/mine/pins', { signal }))
}

export async function setMySupportPin(messageId, pinned, { signal } = {}) {
  if (!UUID.test(String(messageId || '')) || typeof pinned !== 'boolean') throw imageError('SUPPORT_PIN_INVALID')
  return validateSupportPins(await request(`/mine/messages/${encodeURIComponent(messageId)}/pin`, { method: pinned ? 'POST' : 'DELETE', signal }))
}

function validatePrivateImageUrl(value, kind) {
  let url
  try { url = new URL(value) } catch { throw imageError('SUPPORT_IMAGE_URL_INVALID') }
  const parts = url.pathname.split('/')
  const match = /^([0-9a-f-]{36})\.(webp|jpg|png)$/.exec(parts[3] || '')
  if (url.protocol !== 'https:' || !/^[a-z0-9-]+\.r2\.cloudflarestorage\.com$/.test(url.hostname) || url.port || url.username || url.password || url.hash || parts.length !== 4 || parts[1] !== 'shadow-support-chat' || parts[2] !== `support-chat-${kind}` || !match || !UUID.test(match[1]) || !url.searchParams.get('X-Amz-Signature')) {
    throw imageError('SUPPORT_IMAGE_URL_INVALID')
  }
  return url.href
}

export async function getMySupportImage(messageId, { signal } = {}) {
  if (!UUID.test(String(messageId || ''))) throw imageError('SUPPORT_IMAGE_ID_INVALID')
  const data = await request(`/mine/messages/${encodeURIComponent(messageId)}/image`, { signal })
  if (data.ok !== true || !Number.isFinite(data.expires_in_seconds) || data.expires_in_seconds <= 0) throw imageError('SUPPORT_IMAGE_RESPONSE_INVALID')
  return { url: validatePrivateImageUrl(data.url, 'media'), expires_in_seconds: data.expires_in_seconds }
}

export function createMySupportImageUpload(file, message = '') {
  const token = getReaderToken()
  requireSameToken(token)
  if (!(file instanceof Blob) || file.size < 32 || file.size > 20 * 1024 * 1024) throw imageError('SUPPORT_IMAGE_INVALID')
  if (typeof message !== 'string' || message.trim().length > 2000) throw imageError('SUPPORT_IMAGE_CAPTION_INVALID')
  const caption = message.trim()
  let source = file
  let prepared = null
  let session = null
  let uploaded = false
  let active = false
  let result = null

  async function run({ signal, onStage = () => {} } = {}) {
    requireSameToken(token)
    signal?.throwIfAborted()
    if (result) return result
    if (active) throw imageError('SUPPORT_IMAGE_BUSY', 409)
    active = true
    const stage = name => {
      requireSameToken(token)
      signal?.throwIfAborted()
      onStage(name)
    }
    try {
      if (!prepared && !uploaded) {
        stage('compress')
        const optimized = await optimizeImageForUpload(source, { preset: 'gallery', force: true, signal, maxSourceBytes: 20 * 1024 * 1024 })
        prepared = optimized.file
        if (!IMAGE_TYPES.has(prepared?.type) || prepared.size < 32 || prepared.size > MAX_IMAGE_BYTES) {
          prepared = null
          throw imageError('SUPPORT_IMAGE_COMPRESS_LIMIT', 413)
        }
        source = null
      }
      if (!session) {
        stage('prepare')
        const started = Date.now()
        const data = await request('/mine/images/init', { method: 'POST', body: { mime_type: prepared.type, file_size: prepared.size }, signal, expectedToken: token })
        if (data.ok !== true || typeof data.upload_token !== 'string' || !data.upload_token || !UUID.test(data.request_id || '') || data.expires_in_seconds !== 300) throw imageError('SUPPORT_IMAGE_SESSION_INVALID')
        session = { token: data.upload_token, url: validatePrivateImageUrl(data.upload_url, 'temp'), id: data.request_id, putExpires: started + 300000, finalizeExpires: started + 720000 }
      }
      if (!uploaded) {
        if (Date.now() >= session.putExpires) throw imageError('SUPPORT_IMAGE_UPLOAD_EXPIRED', 409)
        stage('upload')
        const response = await fetch(session.url, { method: 'PUT', headers: { 'Content-Type': prepared.type }, body: prepared, credentials: 'omit', redirect: 'error', referrerPolicy: 'no-referrer', signal })
        if (!response.ok) throw imageError('SUPPORT_IMAGE_PUT_FAILED', response.status)
        uploaded = true
        prepared = null
      }
      if (Date.now() >= session.finalizeExpires) throw imageError('SUPPORT_IMAGE_FINALIZE_EXPIRED', 409)
      stage('finalize')
      const data = await request('/mine/images/finalize', { method: 'POST', body: { upload_token: session.token, message: caption }, signal, expectedToken: token })
      if (data.ok !== true || data.message?.id !== session.id || !UUID.test(data.conversation_id || '')) throw imageError('SUPPORT_IMAGE_RESPONSE_INVALID')
      result = data
      session = null
      onStage('done')
      return result
    } finally {
      active = false
    }
  }
  return { run }
}
