import {
  ChatApiError,
  getReaderToken,
} from './chatApi'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

async function autoDeleteRequest(path, options = {}) {
  const token = getReaderToken()

  if (!token) {
    throw new ChatApiError(
      401,
      'LOGIN_REQUIRED',
      'Please log in to use messages'
    )
  }

  const response = await fetch(
    `${API_BASE_URL}/api/chat${path}`,
    {
      method: options.method || 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        ...(options.body
          ? { 'Content-Type': 'application/json' }
          : {}),
      },
      ...(options.body
        ? { body: JSON.stringify(options.body) }
        : {}),
    }
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new ChatApiError(
      response.status,
      data.code ||
        'CHAT_AUTO_DELETE_REQUEST_FAILED',
      data.message ||
        'Chat auto-delete request failed'
    )
  }

  return data
}

export function getChatAutoDeleteStatus(
  conversationId
) {
  return autoDeleteRequest(
    `/conversations/${encodeURIComponent(
      conversationId
    )}/auto-delete`
  )
}

export function setChatAutoDelete(
  conversationId,
  seconds
) {
  return autoDeleteRequest(
    `/conversations/${encodeURIComponent(
      conversationId
    )}/auto-delete`,
    {
      method: 'PATCH',
      body: {
        seconds: Number(seconds || 0),
      },
    }
  )
}
