import { getReaderToken } from './chatApi'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

export async function getArchivedChatPage({ role, page = 1, signal } = {}) {
  const token = getReaderToken()
  if (!token) {
    const error = new Error('Please log in to use messages')
    error.status = 401
    throw error
  }

  const query = new URLSearchParams({
    role: role === 'author' ? 'author' : 'reader',
    page: String(page),
    limit: '10',
  })
  const response = await fetch(
    `${API_BASE_URL}/api/chat/conversations/archived-page?${query.toString()}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
      ...(signal ? { signal } : {}),
    }
  )
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.ok === false) {
    const error = new Error(data.message || 'Failed to load archived chats')
    error.status = response.status
    throw error
  }
  return data
}
