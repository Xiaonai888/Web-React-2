const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

export class ChatApiError extends Error {
  constructor(status, code, message) {
    super(message)
    this.name = 'ChatApiError'
    this.status = status
    this.code = code
  }
}

export function getReaderToken() {
  return (
    sessionStorage.getItem('shadow_reader_token') ||
    localStorage.getItem('shadow_reader_token') ||
    ''
  )
}

export function hasReaderSession() {
  return Boolean(getReaderToken())
}

async function chatRequest(path, options = {}) {
  const token = getReaderToken()

  if (!token) {
    throw new ChatApiError(
      401,
      'LOGIN_REQUIRED',
      'Please log in to use messages'
    )
  }

  const isFormData =
    options.body instanceof FormData

  const response = await fetch(
    `${API_BASE_URL}/api/chat${path}`,
    {
      method: options.method || 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        ...(options.body && !isFormData
          ? { 'Content-Type': 'application/json' }
          : {}),
      },
      ...(options.body
        ? {
            body: isFormData
              ? options.body
              : JSON.stringify(options.body),
          }
        : {}),
      ...(options.signal
        ? { signal: options.signal }
        : {}),
    }
  )

  const data = await response
    .json()
    .catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new ChatApiError(
      response.status,
      data.code || 'CHAT_REQUEST_FAILED',
      data.message || 'Chat request failed'
    )
  }

  return data
}

export function getChatConversations(
  status = 'all',
  { signal } = {}
) {
  const query = new URLSearchParams()

  if (status && status !== 'all') {
    query.set('status', status)
  }

  query.set('view', 'active')

  const suffix = query.toString()
    ? `?${query.toString()}`
    : ''

  return chatRequest(
    `/conversations/managed${suffix}`,
    { signal }
  )
}

export function getManagedChatConversations({
  status = 'all',
  view = 'active',
  signal,
} = {}) {
  const query = new URLSearchParams()

  if (status && status !== 'all') {
    query.set('status', status)
  }

  query.set('view', view)

  return chatRequest(
    `/conversations/managed?${query.toString()}`,
    { signal }
  )
}

export function getChatQuickContacts(
  limit = 12,
  { signal } = {}
) {
  const query = new URLSearchParams()
  query.set('limit', String(limit))

  return chatRequest(
    `/quick-contacts?${query.toString()}`,
    { signal }
  )
}

export function touchChatPresence() {
  return chatRequest('/presence', {
    method: 'PATCH',
  })
}

export function searchChatUsers(
  search,
  limit = 12,
  { signal } = {}
) {
  const query = new URLSearchParams()

  query.set('q', String(search || '').trim())
  query.set('limit', String(limit))

  return chatRequest(
    `/users/search?${query.toString()}`,
    { signal }
  )
}

export function getChatMessages(
  conversationId,
  {
    before = '',
    after = '',
    limit = 50,
    signal,
  } = {}
) {
  if (before && after) {
    throw new ChatApiError(
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

  return chatRequest(
    `/conversations/${encodeURIComponent(
      conversationId
    )}/messages?${query.toString()}`,
    { signal }
  )
}

export function createReaderAuthorMessageRequest({
  authorPageId,
  message,
}) {
  return chatRequest('/reader-author/requests', {
    method: 'POST',
    body: {
      author_page_id: authorPageId,
      message,
    },
  })
}

export function createReaderReaderMessageRequest({
  readerUserId,
  message,
}) {
  return chatRequest('/reader-reader/requests', {
    method: 'POST',
    body: {
      reader_user_id: readerUserId,
      message,
    },
  })
}

export function sendChatMessage(
  conversationId,
  message
) {
  return chatRequest(
    `/conversations/${encodeURIComponent(
      conversationId
    )}/messages`,
    {
      method: 'POST',
      body: { message },
    }
  )
}

export function sendChatAttachment(
  conversationId,
  file,
  message = ''
) {
  if (!file) {
    throw new ChatApiError(
      400,
      'CHAT_ATTACHMENT_REQUIRED',
      'Choose a file to send'
    )
  }

  if (Number(file.size || 0) > 8 * 1024 * 1024) {
    throw new ChatApiError(
      413,
      'CHAT_ATTACHMENT_TOO_LARGE',
      'File must be 8 MB or smaller'
    )
  }

  const formData = new FormData()
  formData.append('file', file)

  const caption = String(message || '')
    .trim()
    .slice(0, 2000)

  if (caption) {
    formData.append('message', caption)
  }

  return chatRequest(
    `/conversations/${encodeURIComponent(
      conversationId
    )}/attachments`,
    {
      method: 'POST',
      body: formData,
    }
  )
}

export function archiveChatConversation(
  conversationId
) {
  return chatRequest(
    `/conversations/${encodeURIComponent(
      conversationId
    )}/archive`,
    {
      method: 'PATCH',
    }
  )
}

export function unarchiveChatConversation(
  conversationId
) {
  return chatRequest(
    `/conversations/${encodeURIComponent(
      conversationId
    )}/archive`,
    {
      method: 'DELETE',
    }
  )
}

export function getChatFolders(conversationId = '') {
  const query = conversationId
    ? `?conversation_id=${encodeURIComponent(conversationId)}`
    : ''

  return chatRequest(`/folders${query}`)
}

export function createChatFolder(name) {
  return chatRequest('/folders', {
    method: 'POST',
    body: { name },
  })
}

export function addChatConversationToFolder(
  folderId,
  conversationId
) {
  return chatRequest(
    `/folders/${encodeURIComponent(folderId)}/conversations/${encodeURIComponent(conversationId)}`,
    { method: 'PATCH' }
  )
}

export function removeChatConversationFromFolder(
  folderId,
  conversationId
) {
  return chatRequest(
    `/folders/${encodeURIComponent(folderId)}/conversations/${encodeURIComponent(conversationId)}`,
    { method: 'DELETE' }
  )
}

export function getChatSoundSettings(conversationId) {
  return chatRequest(
    `/conversations/${encodeURIComponent(conversationId)}/sound`
  )
}

export function updateChatSoundSettings(
  conversationId,
  settings
) {
  return chatRequest(
    `/conversations/${encodeURIComponent(conversationId)}/sound`,
    {
      method: 'PATCH',
      body: settings,
    }
  )
}

export function getChatNicknames(conversationId) {
  return chatRequest(
    `/conversations/${encodeURIComponent(conversationId)}/nicknames`
  )
}

export function updateChatNickname(
  conversationId,
  targetUserId,
  nickname
) {
  return chatRequest(
    `/conversations/${encodeURIComponent(conversationId)}/nicknames/${encodeURIComponent(targetUserId)}`,
    {
      method: 'PATCH',
      body: { nickname },
    }
  )
}


export function pinChatConversation(conversationId) {
  return chatRequest(
    `/conversations/${encodeURIComponent(conversationId)}/pin`,
    { method: 'PATCH' }
  )
}

export function unpinChatConversation(conversationId) {
  return chatRequest(
    `/conversations/${encodeURIComponent(conversationId)}/pin`,
    { method: 'DELETE' }
  )
}

function normalizeConversationDeleteScope(scope) {
  const normalized = String(scope || 'for_me')
    .trim()
    .toLowerCase()

  if (!['for_me', 'for_both'].includes(normalized)) {
    throw new ChatApiError(
      400,
      'INVALID_DELETE_SCOPE',
      'Delete option is not valid'
    )
  }

  return normalized
}

export function deleteChatConversation(
  conversationId,
  scope = 'for_me'
) {
  return chatRequest(
    `/conversations/${encodeURIComponent(
      conversationId
    )}`,
    {
      method: 'DELETE',
      body: {
        scope:
          normalizeConversationDeleteScope(
            scope
          ),
      },
    }
  )
}

export function deleteChatConversationForMe(
  conversationId
) {
  return deleteChatConversation(
    conversationId,
    'for_me'
  )
}

export function deleteChatConversationForBoth(
  conversationId
) {
  return deleteChatConversation(
    conversationId,
    'for_both'
  )
}

export function getChatBlockStatus(
  conversationId,
  { signal } = {}
) {
  return chatRequest(
    `/conversations/${encodeURIComponent(
      conversationId
    )}/block`,
    { signal }
  )
}

export function blockChatConversation(
  conversationId
) {
  return chatRequest(
    `/conversations/${encodeURIComponent(
      conversationId
    )}/block`,
    {
      method: 'PATCH',
    }
  )
}

export function unblockChatConversation(
  conversationId
) {
  return chatRequest(
    `/conversations/${encodeURIComponent(
      conversationId
    )}/block`,
    {
      method: 'DELETE',
    }
  )
}

export function decideChatRequest(
  conversationId,
  action
) {
  return chatRequest(
    `/conversations/${encodeURIComponent(
      conversationId
    )}/request`,
    {
      method: 'PATCH',
      body: { action },
    }
  )
}

export function clearChatHistory(conversationId) {
  return chatRequest(
    `/conversations/${encodeURIComponent(conversationId)}/clear-history`,
    { method: 'PATCH' }
  )
}

export function markChatUnread(conversationId) {
  return chatRequest(
    `/conversations/${encodeURIComponent(conversationId)}/unread`,
    { method: 'PATCH' }
  )
}

export function markChatRead(
  conversationId,
  { signal } = {}
) {
  return chatRequest(
    `/conversations/${encodeURIComponent(
      conversationId
    )}/read`,
    {
      method: 'PATCH',
      signal,
    }
  )
}

export const MAX_CHAT_MESSAGE_SELECTION = 100

function normalizeChatMessageIds(messageIds) {
  const values = Array.isArray(messageIds)
    ? messageIds
    : [messageIds]

  const normalized = [
    ...new Set(
      values
        .map((value) =>
          String(value || '').trim()
        )
        .filter(Boolean)
    ),
  ]

  if (!normalized.length) {
    throw new ChatApiError(
      400,
      'MESSAGE_IDS_REQUIRED',
      'Select at least one message'
    )
  }

  if (
    normalized.length >
    MAX_CHAT_MESSAGE_SELECTION
  ) {
    throw new ChatApiError(
      400,
      'MESSAGE_SELECTION_LIMIT',
      `You can select up to ${MAX_CHAT_MESSAGE_SELECTION} messages`
    )
  }

  return normalized
}

export function replyChatMessage(
  conversationId,
  messageId,
  message
) {
  return chatRequest(
    `/conversations/${encodeURIComponent(
      conversationId
    )}/messages/${encodeURIComponent(
      messageId
    )}/reply`,
    {
      method: 'POST',
      body: { message },
    }
  )
}

export function editChatMessage(
  conversationId,
  messageId,
  message
) {
  return chatRequest(
    `/conversations/${encodeURIComponent(
      conversationId
    )}/messages/${encodeURIComponent(
      messageId
    )}`,
    {
      method: 'PATCH',
      body: { message },
    }
  )
}

export function deleteChatMessages(
  conversationId,
  messageIds
) {
  return chatRequest(
    `/conversations/${encodeURIComponent(
      conversationId
    )}/messages`,
    {
      method: 'DELETE',
      body: {
        message_ids:
          normalizeChatMessageIds(
            messageIds
          ),
      },
    }
  )
}

export function deleteChatMessage(
  conversationId,
  messageId
) {
  return deleteChatMessages(
    conversationId,
    [messageId]
  )
}

export function getPinnedChatMessages(
  conversationId,
  { signal } = {}
) {
  return chatRequest(
    `/conversations/${encodeURIComponent(
      conversationId
    )}/pins`,
    { signal }
  )
}

export function pinChatMessage(
  conversationId,
  messageId
) {
  return chatRequest(
    `/conversations/${encodeURIComponent(
      conversationId
    )}/messages/${encodeURIComponent(
      messageId
    )}/pin`,
    {
      method: 'POST',
    }
  )
}

export function unpinChatMessage(
  conversationId,
  messageId
) {
  return chatRequest(
    `/conversations/${encodeURIComponent(
      conversationId
    )}/messages/${encodeURIComponent(
      messageId
    )}/pin`,
    {
      method: 'DELETE',
    }
  )
}

export function forwardChatMessages({
  sourceConversationId,
  targetConversationId,
  messageIds,
}) {
  return chatRequest(
    `/conversations/${encodeURIComponent(
      sourceConversationId
    )}/forward`,
    {
      method: 'POST',
      body: {
        target_conversation_id:
          targetConversationId,
        message_ids:
          normalizeChatMessageIds(
            messageIds
          ),
      },
    }
  )
}

export function reportChatMessage(
  conversationId,
  messageId,
  { reason, details = '' }
) {
  return chatRequest(
    `/conversations/${encodeURIComponent(
      conversationId
    )}/messages/${encodeURIComponent(
      messageId
    )}/report`,
    {
      method: 'POST',
      body: {
        reason,
        details,
      },
    }
  )
}
