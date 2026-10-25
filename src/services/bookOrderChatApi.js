const API = import.meta.env.VITE_API_URL || ((typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)) ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com')

function authToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

async function request(path, { method = 'GET', body, signal } = {}) {
  const token = authToken()
  if (!token) throw new Error('Please log in to access book orders')
  const response = await fetch(`${API}${path}`, {
    method,
    signal,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.ok !== true) throw new Error(data.message || `Book order request failed (${response.status})`)
  return data
}

export function getConversationBookOrders(conversationId, { signal } = {}) {
  return request(`/api/chat/conversations/${encodeURIComponent(conversationId)}/book-orders`, { signal })
}

export function dismissBookOrderPopup(conversationId, orderId) {
  return request(`/api/chat/conversations/${encodeURIComponent(conversationId)}/book-orders/${encodeURIComponent(orderId)}/popup-seen`, { method: 'POST' })
}

export function submitBookShippingEvidence(holdId, { delivery_company, tracking_number = '', proof_url }) {
  return request(`/api/author-store/me/book-pending/${encodeURIComponent(holdId)}/evidence`, {
    method: 'POST',
    body: { delivery_company, tracking_number, proof_url },
  })
}

export function confirmBookReceived(orderId) {
  return request(`/api/author-store/orders/${encodeURIComponent(orderId)}/confirm-received`, { method: 'POST' })
}
