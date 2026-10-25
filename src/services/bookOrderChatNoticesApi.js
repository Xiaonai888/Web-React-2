const API_BASE_URL = import.meta.env.VITE_API_URL || ((typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)) ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com')
const UUID = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i

function token() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

async function request(path, { method = 'GET', signal } = {}) {
  const auth = token()
  if (!auth) throw new Error('Please sign in to see book notifications')
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    signal,
    headers: { Authorization: `Bearer ${auth}` },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.ok !== true) throw new Error(data.message || 'Book notifications are unavailable')
  return data
}

export function getBookChatNotices(conversationId, page = 1, { signal } = {}) {
  const id = String(conversationId || '').trim()
  if (!UUID.test(id)) throw new Error('Invalid chat conversation')
  const nextPage = Number(page)
  if (!Number.isSafeInteger(nextPage) || nextPage < 1 || nextPage > 1000) throw new Error('Invalid notification page')
  return request(`/api/chat/conversations/${id}/book-notices?page=${nextPage}`, { signal })
}

export function markBookChatNoticeRead(conversationId, noticeId) {
  const chatId = String(conversationId || '').trim()
  const id = String(noticeId || '').trim()
  if (!UUID.test(chatId) || !UUID.test(id)) throw new Error('Invalid book notification')
  return request(`/api/chat/conversations/${chatId}/book-notices/${id}/seen`, { method: 'POST' })
}
