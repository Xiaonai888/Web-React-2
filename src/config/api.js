import { getActiveReaderToken } from '../utils/readerActiveAccount'

const DEFAULT_API_BASE_URL = 'https://shadow-backend-kucw.onrender.com'

function normalizeApiBaseUrl(value) {
  const input = String(value ?? '').trim()
  if (!input) return DEFAULT_API_BASE_URL

  try {
    const url = new URL(input)
    const isLocalHost = ['localhost', '127.0.0.1'].includes(url.hostname)
    const allowedProtocol = url.protocol === 'https:' ||
      (import.meta.env.DEV && isLocalHost && url.protocol === 'http:')

    if (!allowedProtocol || url.username || url.password || url.search || url.hash) {
      return DEFAULT_API_BASE_URL
    }

    return `${url.origin}${url.pathname.replace(/\/+$/, '')}`
  } catch {
    return DEFAULT_API_BASE_URL
  }
}

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL)
export const getAuthToken = getActiveReaderToken
