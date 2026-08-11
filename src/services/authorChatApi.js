const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

export class AuthorChatApiError extends Error {
  constructor(status, code, message) {
    super(message)
    this.name = 'AuthorChatApiError'
    this.status = status
    this.code = code
  }
}

export function getAuthorChatToken() {
  return (
    sessionStorage.getItem('shadow_reader_token') ||
    localStorage.getItem('shadow_reader_token') ||
    ''
  )
}

export function hasAuthorChatSession() {
  return Boolean(getAuthorChatToken())
}

async function authorChatRequest(path, options = {}) {
  const token = getAuthorChatToken()

  if (!token) {
    throw new AuthorChatApiError(
      401,
      'LOGIN_REQUIRED',
      'Please log in to use Page Messages'
    )
  }

  const response = await fetch(`${API_BASE_URL}/api/chat${path}`, {
    method: options.method || 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new AuthorChatApiError(
      response.status,
      data.code || 'AUTHOR_CHAT_REQUEST_FAILED',
      data.message || 'Page Messages request failed'
    )
  }

  return data
}

function ensureAuthorConversation(conversation) {
  if (!conversation || conversation.viewer_role !== 'author') {
    throw new AuthorChatApiError(
      403,
      'AUTHOR_CHAT_ACCESS_DENIED',
      'This conversation belongs to Reader Messages'
    )
  }

  return conversation
}

export async function getAuthorChatConversations({
  status = 'all',
  view = 'active',
} = {}) {
  const query = new URLSearchParams()

  if (status && status !== 'all') {
    query.set('status', status)
  }

  query.set('view', view)

  const data = await authorChatRequest(
    `/conversations/managed?${query.toString()}`
  )

  return {
    ...data,
    conversations: Array.isArray(data.conversations)
      ? data.conversations.filter(
          (conversation) => conversation.viewer_role === 'author'
        )
      : [],
  }
}

export async function getAuthorChatMessages(
  conversationId,
  { before = '', limit = 50 } = {}
) {
  const query = new URLSearchParams()
  query.set('limit', String(limit))

  if (before) {
    query.set('before', before)
  }

  const data = await authorChatRequest(
    `/conversations/${encodeURIComponent(
      conversationId
    )}/messages?${query.toString()}`
  )

  ensureAuthorConversation(data.conversation)
  return data
}

export async function sendAuthorChatMessage(conversationId, message) {
  return authorChatRequest(
    `/conversations/${encodeURIComponent(conversationId)}/messages`,
    {
      method: 'POST',
      body: { message },
    }
  )
}

export async function decideAuthorChatRequest(conversationId, action) {
  const data = await authorChatRequest(
    `/conversations/${encodeURIComponent(conversationId)}/request`,
    {
      method: 'PATCH',
      body: { action },
    }
  )

  ensureAuthorConversation(data.conversation)
  return data
}

export function markAuthorChatRead(conversationId) {
  return authorChatRequest(
    `/conversations/${encodeURIComponent(conversationId)}/read`,
    {
      method: 'PATCH',
    }
  )
}

export function archiveAuthorChatConversation(conversationId) {
  return authorChatRequest(
    `/conversations/${encodeURIComponent(conversationId)}/archive`,
    {
      method: 'PATCH',
    }
  )
}

export function unarchiveAuthorChatConversation(conversationId) {
  return authorChatRequest(
    `/conversations/${encodeURIComponent(conversationId)}/archive`,
    {
      method: 'DELETE',
    }
  )
}

export function deleteAuthorChatConversation(conversationId) {
  return authorChatRequest(
    `/conversations/${encodeURIComponent(conversationId)}`,
    {
      method: 'DELETE',
      body: { scope: 'for_me' },
    }
  )
}

export function getAuthorChatMuteStatus(conversationId) {
  return authorChatRequest(
    `/conversations/${encodeURIComponent(conversationId)}/mute`
  )
}

export function muteAuthorChatConversation(
  conversationId,
  duration = 'forever'
) {
  return authorChatRequest(
    `/conversations/${encodeURIComponent(conversationId)}/mute`,
    {
      method: 'PATCH',
      body: { duration },
    }
  )
}

export function unmuteAuthorChatConversation(conversationId) {
  return authorChatRequest(
    `/conversations/${encodeURIComponent(conversationId)}/mute`,
    {
      method: 'DELETE',
    }
  )
}

export function getAuthorChatBlockStatus(conversationId) {
  return authorChatRequest(
    `/conversations/${encodeURIComponent(conversationId)}/block`
  )
}

export function blockAuthorChatConversation(conversationId) {
  return authorChatRequest(
    `/conversations/${encodeURIComponent(conversationId)}/block`,
    {
      method: 'PATCH',
    }
  )
}

export function unblockAuthorChatConversation(conversationId) {
  return authorChatRequest(
    `/conversations/${encodeURIComponent(conversationId)}/block`,
    {
      method: 'DELETE',
    }
  )
}
