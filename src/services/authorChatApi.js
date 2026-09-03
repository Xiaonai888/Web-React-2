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

async function apiRequest(path, options = {}) {
  const token = getAuthorChatToken()

  if (!token) {
    throw new AuthorChatApiError(
      401,
      'LOGIN_REQUIRED',
      'Please log in to use Page Inbox'
    )
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
    ...(options.signal ? { signal: options.signal } : {}),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new AuthorChatApiError(
      response.status,
      data.code || 'AUTHOR_INBOX_REQUEST_FAILED',
      data.message || 'Page Inbox request failed'
    )
  }

  return data
}

function authorChatRequest(path, options = {}) {
  return apiRequest(`/api/chat${path}`, options)
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

export async function getAuthorInboxProfile({
  signal,
} = {}) {
  const data = await apiRequest(
    '/api/authors/me',
    { signal }
  )
  return data.authorPage || data.page || data.author_page || data
}

export async function getAuthorInboxComments(
  limit = 50,
  { signal } = {}
) {
  const params = new URLSearchParams({
    limit: String(Math.min(50, Math.max(1, Number(limit) || 30))),
  })

  const data = await apiRequest(
    `/api/authors/me/page-notifications?${params.toString()}`,
    { signal }
  )

  const notifications = Array.isArray(data.notifications)
    ? data.notifications
    : []

  return notifications.filter((item) => {
    const metadata =
      item?.metadata && typeof item.metadata === 'object'
        ? item.metadata
        : {}
    const type = String(
      metadata.notification_type || item?.type || ''
    ).toLowerCase()

    return ['comment', 'comments', 'mention', 'mentions'].includes(type)
  })
}

export async function getAuthorChatConversations({
  status = 'all',
  view = 'active',
  signal,
} = {}) {
  const query = new URLSearchParams()

  if (status && status !== 'all') {
    query.set('status', status)
  }

  query.set('view', view)

  const data = await authorChatRequest(
    `/conversations/managed?${query.toString()}`,
    { signal }
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
  {
    before = '',
    after = '',
    limit = 50,
    signal,
  } = {}
) {
  if (before && after) {
    throw new AuthorChatApiError(
      400,
      'INVALID_CURSOR_MODE',
      'Use either before or after, not both'
    )
  }

  const query = new URLSearchParams()
  query.set('limit', String(limit))

  if (before) {
    query.set('before', before)
  }

  if (after) {
    query.set('after', after)
  }

  const data = await authorChatRequest(
    `/conversations/${encodeURIComponent(
      conversationId
    )}/messages?${query.toString()}`,
    { signal }
  )

  if (data.conversation) {
    ensureAuthorConversation(data.conversation)
  } else if (!after) {
    ensureAuthorConversation(data.conversation)
  }

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

export function markAuthorChatRead(
  conversationId,
  { signal } = {}
) {
  return authorChatRequest(
    `/conversations/${encodeURIComponent(conversationId)}/read`,
    {
      method: 'PATCH',
      signal,
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
