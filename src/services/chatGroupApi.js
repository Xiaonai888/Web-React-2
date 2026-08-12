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

function normalizeGroupMemberIds(memberUserIds) {
  const values = Array.isArray(memberUserIds)
    ? memberUserIds
    : []

  return [
    ...new Set(
      values
        .map((value) =>
          String(value || '').trim()
        )
        .filter(Boolean)
    ),
  ]
}

async function groupRequest(path, options = {}) {
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
        ? {
            body: JSON.stringify(options.body),
          }
        : {}),
    }
  )

  const data = await response
    .json()
    .catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new ChatApiError(
      response.status,
      data.code || 'GROUP_CHAT_REQUEST_FAILED',
      data.message || 'Group chat request failed'
    )
  }

  return data
}

export function createGroupChat({
  name,
  memberUserIds,
}) {
  const safeName = String(name || '')
    .trim()
    .slice(0, 60)
  const safeMemberUserIds =
    normalizeGroupMemberIds(memberUserIds)

  if (!safeName) {
    throw new ChatApiError(
      400,
      'GROUP_NAME_REQUIRED',
      'Group name is required'
    )
  }

  if (safeMemberUserIds.length < 2) {
    throw new ChatApiError(
      400,
      'GROUP_MIN_MEMBERS',
      'Choose at least 2 people'
    )
  }

  if (safeMemberUserIds.length > 49) {
    throw new ChatApiError(
      400,
      'GROUP_MAX_MEMBERS',
      'A group can have up to 50 people'
    )
  }

  return groupRequest('/groups', {
    method: 'POST',
    body: {
      name: safeName,
      member_user_ids: safeMemberUserIds,
    },
  })
}
