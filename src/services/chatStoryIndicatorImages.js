import { chatThemeAccount, chatThemeToken } from './chatStoryThemes'
import { safeTapIndicatorImageUrl } from '../components/chat-story/ChatStoryTapIndicator'
import { prepareChatReaderImage } from '../utils/chatStoryReaderImage'

export const CHAT_INDICATOR_IMAGE_EVENT = 'shadow:chat-indicator-image-changed'
const CACHE_PREFIX = 'shadow_chat_indicator_image_v1:'
const CACHE_TTL = 5 * 60 * 1000
const API_URL = String(import.meta.env?.VITE_API_URL || (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname) ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com')).replace(/\/+$/, '')
const ROOT = `${API_URL}/api/reader/chat-indicator`
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i
const pendingReads = new Map()
const busyAccounts = new Set()
let mutationVersion = 0

function imageError(code, status = 0) {
  return Object.assign(new Error(code), { code, status })
}

function assertAccount(expected) {
  if (chatThemeAccount() !== expected) throw imageError('accountChanged')
  if (!chatThemeToken() || expected === 'guest') throw imageError('signIn', 401)
}

function normalizeItem(value) {
  if (value === null) return null
  const imageUrl = safeTapIndicatorImageUrl(value?.image_url)
  if (!value || !UUID.test(value.id || '') || !imageUrl.startsWith('https://') || !Number.isInteger(value.width) || value.width < 1 || value.width > 512 || value.height !== value.width) throw imageError('invalidImage')
  return { id: value.id, image_url: imageUrl, width: value.width, height: value.height, updated_at: typeof value.updated_at === 'string' ? value.updated_at : '' }
}

export function peekChatIndicatorImage(account = chatThemeAccount()) {
  if (account === 'guest') return { loaded: false, item: null }
  try {
    const saved = JSON.parse(localStorage.getItem(`${CACHE_PREFIX}${account}`) || 'null')
    if (!saved || !Number.isFinite(saved.at) || saved.at > Date.now() || Date.now() - saved.at > CACHE_TTL) return { loaded: false, item: null }
    return { loaded: true, item: normalizeItem(saved.item) }
  } catch {
    return { loaded: false, item: null }
  }
}

function cacheItem(account, item) {
  assertAccount(account)
  try {
    localStorage.setItem(`${CACHE_PREFIX}${account}`, JSON.stringify({ at: Date.now(), item }))
  } catch {}
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(CHAT_INDICATOR_IMAGE_EVENT))
  return item
}

function abortCheck(signal) {
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
}

function responseCode(status, code) {
  if (status === 401 || status === 403) return 'signIn'
  if (code === 'CHAT_INDICATOR_UPLOAD_BUSY') return 'uploadBusy'
  if (status === 429) return 'rateLimited'
  if (status === 413) return 'tooLarge'
  if (status === 415) return 'invalidImage'
  if (code === 'CHAT_INDICATOR_UPLOAD_DISABLED') return 'uploadDisabled'
  if (status === 409) return 'imageChanged'
  if (status === 410) return 'uploadExpired'
  if (status === 404 || status >= 500) return 'unavailable'
  return 'requestFailed'
}

function renewToken(response, usedToken) {
  const renewed = response.headers.get('X-Reader-Token')
  if (!renewed || renewed.length > 8192 || !/^[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/.test(renewed)) return
  try {
    if (localStorage.getItem('shadow_reader_token') === usedToken) localStorage.setItem('shadow_reader_token', renewed)
    if (sessionStorage.getItem('shadow_reader_token') === usedToken) sessionStorage.setItem('shadow_reader_token', renewed)
  } catch {}
}

async function request(path, { method = 'GET', body, signal, account, timeout = 30000 } = {}) {
  assertAccount(account)
  abortCheck(signal)
  const controller = new AbortController()
  const abort = () => controller.abort()
  signal?.addEventListener('abort', abort, { once: true })
  const timer = setTimeout(abort, timeout)
  const token = chatThemeToken()
  try {
    const response = await fetch(`${ROOT}${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: controller.signal,
      cache: 'no-store',
    })
    assertAccount(account)
    renewToken(response, token)
    const result = await response.json().catch(() => null)
    if (!response.ok || result?.ok !== true) throw imageError(responseCode(response.status, result?.code), response.status)
    return result
  } catch (error) {
    abortCheck(signal)
    if (error.code) throw error
    throw imageError('requestFailed')
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', abort)
  }
}

export async function loadChatIndicatorImage({ force = false, signal } = {}) {
  const account = chatThemeAccount()
  assertAccount(account)
  abortCheck(signal)
  const cached = peekChatIndicatorImage(account)
  if (!force && cached.loaded) return cached.item
  let pending = pendingReads.get(account)
  if (!pending) {
    const version = mutationVersion
    pending = request('/image', { account }).then((result) => {
      if (version !== mutationVersion) {
        const latest = peekChatIndicatorImage(account)
        if (latest.loaded) return latest.item
        throw imageError('imageChanged')
      }
      return cacheItem(account, normalizeItem(result.item))
    })
    pendingReads.set(account, pending)
    const clear = () => { if (pendingReads.get(account) === pending) pendingReads.delete(account) }
    pending.then(clear, clear)
  }
  const item = await pending
  abortCheck(signal)
  assertAccount(account)
  return item
}

function uploadToCloud(uploadUrl, file, { signal, onProgress }) {
  let url
  try {
    url = new URL(uploadUrl)
  } catch {
    throw imageError('uploadFailed')
  }
  if (url.protocol !== 'https:' || url.username || url.password || !/^[a-zA-Z0-9]+\.r2\.cloudflarestorage\.com$/.test(url.hostname)) throw imageError('uploadFailed')
  abortCheck(signal)
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    let settled = false
    const abort = () => xhr.abort()
    const finish = (error) => {
      if (settled) return
      settled = true
      signal?.removeEventListener('abort', abort)
      if (error) reject(error)
      else resolve()
    }
    xhr.open('PUT', url.href)
    xhr.setRequestHeader('Content-Type', file.type)
    xhr.timeout = 180000
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total) onProgress?.(Math.round(10 + 80 * event.loaded / event.total))
    }
    xhr.onload = () => finish(xhr.status >= 200 && xhr.status < 300 ? null : imageError('uploadFailed'))
    xhr.onerror = () => finish(imageError('uploadFailed'))
    xhr.ontimeout = () => finish(imageError('uploadFailed'))
    xhr.onabort = () => finish(new DOMException('Aborted', 'AbortError'))
    signal?.addEventListener('abort', abort, { once: true })
    if (signal?.aborted) finish(new DOMException('Aborted', 'AbortError'))
    else xhr.send(file)
  })
}

export async function uploadChatIndicatorImage(file, { signal, onProgress } = {}) {
  const account = chatThemeAccount()
  assertAccount(account)
  if (busyAccounts.has(account)) throw imageError('uploadBusy')
  busyAccounts.add(account)
  mutationVersion += 1
  let session
  try {
    onProgress?.(0)
    const ready = await prepareChatReaderImage(file, { kind: 'indicator', signal })
    assertAccount(account)
    session = await request('/image/init', { method: 'POST', account, signal, body: { mime_type: ready.file.type, file_size: ready.file.size } })
    if (!UUID.test(session.upload_id || '') || typeof session.upload_token !== 'string' || !/^[a-zA-Z0-9_-]{43}$/.test(session.upload_token)) throw imageError('uploadFailed')
    onProgress?.(10)
    await uploadToCloud(session.upload_url, ready.file, { signal, onProgress })
    assertAccount(account)
    onProgress?.(92)
    const result = await request('/image/complete', { method: 'POST', account, signal, body: { upload_id: session.upload_id, upload_token: session.upload_token } })
    const item = normalizeItem(result.item)
    if (!item) throw imageError('uploadFailed')
    cacheItem(account, item)
    onProgress?.(100)
    return item
  } catch (error) {
    if (session?.upload_id && session?.upload_token && chatThemeAccount() === account && chatThemeToken()) {
      await request('/image/cancel', { method: 'POST', account, timeout: 5000, body: { upload_id: session.upload_id, upload_token: session.upload_token } }).catch(() => {})
    }
    throw error
  } finally {
    busyAccounts.delete(account)
  }
}

export async function deleteChatIndicatorImage(id, { signal } = {}) {
  const account = chatThemeAccount()
  assertAccount(account)
  if (!UUID.test(id || '')) throw imageError('invalidImage')
  if (busyAccounts.has(account)) throw imageError('uploadBusy')
  busyAccounts.add(account)
  mutationVersion += 1
  try {
    await request(`/image/${encodeURIComponent(id)}`, { method: 'DELETE', account, signal })
    cacheItem(account, null)
  } finally {
    busyAccounts.delete(account)
  }
}
