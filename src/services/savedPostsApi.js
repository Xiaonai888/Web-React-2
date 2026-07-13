const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

export function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function buildQuery(params = {}) {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    query.set(key, String(value))
  })

  const text = query.toString()
  return text ? `?${text}` : ''
}

async function request(path, options = {}) {
  const token = getReaderToken()
  const headers = new Headers(options.headers || {})

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  if (options.body !== undefined && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body:
      options.body === undefined || options.body instanceof FormData
        ? options.body
        : JSON.stringify(options.body),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    const error = new Error(data.message || 'Request failed')
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export function fetchSavedPosts(params = {}, signal) {
  return request(`/api/saved-posts${buildQuery(params)}`, { signal })
}

export function fetchSavedPostCollections(signal) {
  return request('/api/saved-posts/collections', { signal })
}

export function createSavedPostCollection(payload) {
  return request('/api/saved-posts/collections', {
    method: 'POST',
    body: payload,
  })
}

export function updateSavedPostCollection(collectionId, payload) {
  return request(`/api/saved-posts/collections/${encodeURIComponent(collectionId)}`, {
    method: 'PATCH',
    body: payload,
  })
}

export function deleteSavedPostCollection(collectionId) {
  return request(`/api/saved-posts/collections/${encodeURIComponent(collectionId)}`, {
    method: 'DELETE',
  })
}

export function replaceSavedPostCollections(savedPostId, collectionIds) {
  return request(`/api/saved-posts/${encodeURIComponent(savedPostId)}/collections`, {
    method: 'PUT',
    body: {
      collection_ids: collectionIds,
    },
  })
}

export function deleteSavedPost(savedPostId) {
  return request(`/api/saved-posts/${encodeURIComponent(savedPostId)}`, {
    method: 'DELETE',
  })
}
