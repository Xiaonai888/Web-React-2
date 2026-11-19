import { getActiveReaderToken } from '../utils/readerActiveAccount'

const DEFAULT_API_BASE_URL = 'https://shadow-backend-kucw.onrender.com'

function normalizeApiBaseUrl(value) {
  const input = String(value ?? '').trim()
  if (!input) return DEFAULT_API_BASE_URL

  try {
    const url = new URL(input)

    const isProductionApi = url.origin === DEFAULT_API_BASE_URL
    const isLocalDevApi =
      import.meta.env.DEV &&
      url.protocol === 'http:' &&
      ['localhost', '127.0.0.1'].includes(url.hostname) &&
      url.port === '5000'

    if (
      !(isProductionApi || isLocalDevApi) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname !== '/'
    ) {
      return DEFAULT_API_BASE_URL
    }

    return url.origin

  } catch {
    return DEFAULT_API_BASE_URL
  }
}

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL)
export const getAuthToken = getActiveReaderToken
