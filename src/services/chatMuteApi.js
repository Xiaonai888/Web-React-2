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

async function muteRequest(path, options = {}) {
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
      data.code || 'CHAT_MUTE_REQUEST_FAILED',
      data.message || 'Chat mute request failed'
    )
  }

  return data
}

export function getChatMuteStatus(conversationId) {
  return muteRequest(
    `/conversations/${encodeURIComponent(
      conversationId
    )}/mute`
  )
}

export function muteChatConversation(
  conversationId,
  duration = 'forever'
) {
  return muteRequest(
    `/conversations/${encodeURIComponent(
      conversationId
    )}/mute`,
    {
      method: 'PATCH',
      body: { duration },
    }
  )
}

export function unmuteChatConversation(
  conversationId
) {
  return muteRequest(
    `/conversations/${encodeURIComponent(
      conversationId
    )}/mute`,
    {
      method: 'DELETE',
    }
  )
}
