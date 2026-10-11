import { getReaderToken } from './chatApi'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

export async function getLightweightChatInbox({ role = 'reader', page = 1, status = 'all', signal } = {}) {
  const token = getReaderToken()
  if (!token) {
    const error = new Error('Please log in to use chat')
    error.status = 401
    throw error
  }

  const query = new URLSearchParams({
    role: role === 'author' ? 'author' : 'reader',
    page: String(page),
    status: status === 'pending' ? 'pending' : 'all',
  })

  const response = await fetch(
    `${API_BASE_URL}/api/chat/conversations/lightweight-page?${query.toString()}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
      ...(signal ? { signal } : {}),
    }
  )

  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.ok === false || !Array.isArray(data.conversations)) {
    const error = new Error(data.message || 'Failed to load chat inbox')
    error.status = response.status
    error.code = data.code
    throw error
  }
  return data
}
