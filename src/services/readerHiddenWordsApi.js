const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const PATH = '/api/users/me/hidden-words'
const CACHE_MS = 60000
let cache = { token: '', words: null, loadedAt: 0, pending: null, revision: 0 }

function readerToken() {
  return localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') || ''
}

function prepareCache(token) {
  if (cache.token !== token) {
    cache = { token, words: null, loadedAt: 0, pending: null, revision: 0 }
  }
}

async function request(path, { method = 'GET', body, token } = {}) {
  const currentToken = token || readerToken()
  if (!currentToken) throw new Error('Please sign in to manage hidden words.')

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${currentToken}`,
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    cache: 'no-store',
  })

  const result = await response.json().catch(() => ({}))
  if (!response.ok || result.ok === false) {
    const error = new Error(result.message || 'Could not update hidden words.')
    error.status = response.status
    error.code = result.code || ''
    throw error
  }
  return result
}

function notifyChange() {
  window.dispatchEvent(new Event('shadow:reader-hidden-words-changed'))
}

export async function getReaderHiddenWords({ force = false } = {}) {
  const token = readerToken()
  if (!token) throw new Error('Please sign in to manage hidden words.')
  prepareCache(token)

  if (!force && cache.words && Date.now() - cache.loadedAt < CACHE_MS) {
    return [...cache.words]
  }
  if (cache.pending) return [...await cache.pending]

  const revision = cache.revision
  const pending = request(PATH, { token }).then((result) => {
    const words = Array.isArray(result.words) ? result.words : []
    if (cache.token === token && cache.revision === revision) {
      cache.words = words
      cache.loadedAt = Date.now()
    }
    return words
  })
  cache.pending = pending

  try {
    return [...await pending]
  } finally {
    if (cache.token === token && cache.pending === pending) cache.pending = null
  }
}

export async function addReaderHiddenWord(word) {
  const token = readerToken()
  if (!token) throw new Error('Please sign in to manage hidden words.')
  prepareCache(token)
  const result = await request(PATH, { method: 'POST', body: { word }, token })
  if (cache.token === token) {
    cache.revision += 1
    cache.words = cache.words ? [result.word, ...cache.words] : null
    cache.loadedAt = cache.words ? Date.now() : 0
  }
  notifyChange()
  return result.word
}

export async function deleteReaderHiddenWord(id) {
  const token = readerToken()
  if (!token) throw new Error('Please sign in to manage hidden words.')
  prepareCache(token)
  const result = await request(`${PATH}/${encodeURIComponent(id)}`, { method: 'DELETE', token })
  if (cache.token === token) {
    cache.revision += 1
    cache.words = cache.words?.filter((item) => String(item.id) !== String(id)) || null
    cache.loadedAt = cache.words ? Date.now() : 0
  }
  notifyChange()
  return result
}

export function clearReaderHiddenWordsCache() {
  cache = { token: '', words: null, loadedAt: 0, pending: null, revision: 0 }
  notifyChange()
}

export function subscribeReaderHiddenWords(listener) {
  window.addEventListener('shadow:reader-hidden-words-changed', listener)
  return () => window.removeEventListener('shadow:reader-hidden-words-changed', listener)
}
