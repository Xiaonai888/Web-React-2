import { getReaderToken } from './chatApi'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://shadow-backend-kucw.onrender.com'
const BASE = `${API_BASE_URL}/api/reader/support-chat`

export class ReaderSupportChatApiError extends Error {
  constructor(status, code, message) {
    super(message)
    this.name = 'ReaderSupportChatApiError'
    this.status = status
    this.code = code
  }
}

async function request(path, { method = 'GET', body, signal } = {}) {
  const token = getReaderToken()
  if (!token) throw new ReaderSupportChatApiError(401, 'LOGIN_REQUIRED', 'Please sign in to chat with Shadow Support')
  const response = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    ...(signal ? { signal } : {}),
    cache: 'no-store',
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data?.ok === false) {
    throw new ReaderSupportChatApiError(response.status, data?.code || 'READER_SUPPORT_ERROR', data?.message || 'Support chat is unavailable')
  }
  return data
}

export function getMySupportConversation({ signal } = {}) {
  return request('/mine', { signal })
}

export function getMySupportMessages({ before = '', signal } = {}) {
  const params = before ? `?${new URLSearchParams({ before })}` : ''
  return request(`/mine/messages${params}`, { signal })
}

export function sendMySupportMessage(message, requestId) {
  return request('/mine/messages', {
    method: 'POST',
    body: { message, ...(requestId ? { request_id: requestId } : {}) },
  })
}

export function markMySupportRead() {
  return request('/mine/read', { method: 'PATCH' })
}
