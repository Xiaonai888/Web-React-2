import { getReaderToken } from '../../services/chatApi'

const API_URL = String(import.meta.env.VITE_API_URL || 'https://shadow-backend-kucw.onrender.com').replace(/\/+$/, '')
const REQUEST_TIMEOUT_MS = 45000

export class ShadowDocsReviewAIError extends Error {
  constructor(message, status = 0, code = '') {
    super(message)
    this.name = 'ShadowDocsReviewAIError'
    this.status = status
    this.code = code
  }
}

export async function requestShadowDocsReviewAI({ mode, text, targetLanguage = 'en', sourceLanguage = 'auto', signal } = {}) {
  const content = String(text || '')
  if (!['translate', 'proofread'].includes(mode) || !content.trim() || content.length > 5000) {
    throw new ShadowDocsReviewAIError('Please provide up to 5000 characters of text.', 400, 'INVALID_REVIEW_INPUT')
  }

  const token = getReaderToken()
  if (!token) throw new ShadowDocsReviewAIError('Sign in to use AI Review.', 401, 'LOGIN_REQUIRED')

  const requestController = new AbortController()
  const cancelRequest = () => requestController.abort()
  if (signal?.aborted) cancelRequest()
  else signal?.addEventListener('abort', cancelRequest, { once: true })

  let timedOut = false
  const timeoutId = setTimeout(() => {
    timedOut = true
    requestController.abort()
  }, REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(`${API_URL}/api/shadow-docs/review-ai/run`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode, text: content, targetLanguage, sourceLanguage }),
      cache: 'no-store',
      signal: requestController.signal,
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok || data?.ok !== true || typeof data?.result !== 'string' || !data.result.trim()) {
      throw new ShadowDocsReviewAIError(data?.message || 'AI Review is unavailable.', response.status, data?.code || 'REVIEW_AI_ERROR')
    }
    return data.result
  } catch (error) {
    if (signal?.aborted) throw error
    if (timedOut) throw new ShadowDocsReviewAIError('AI Review timed out. Please try again.', 504, 'REVIEW_AI_TIMEOUT')
    if (error instanceof ShadowDocsReviewAIError) throw error
    throw new ShadowDocsReviewAIError('Could not contact the AI service.', 0, 'NETWORK_ERROR')
  } finally {
    clearTimeout(timeoutId)
    signal?.removeEventListener('abort', cancelRequest)
  }
}
