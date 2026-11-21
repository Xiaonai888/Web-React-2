import { API_BASE_URL, getAuthToken } from '../config/api'
import { optimizeImageForUpload } from '../utils/imageUploadOptimizer'
import { uploadMediaWithFallback } from '../utils/uploadMediaWithFallback'
import { canAccessAuthorPreOrder, preOrderCampaignPayload } from '../utils/authorPreOrderRules'
import { loadCountrySettings } from '../utils/countrySettings'

const ROOT = `${API_BASE_URL}/api/author-store/me/pre-orders`
const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export async function verifyAuthorPreOrderAccess() {
  if (!getAuthToken()) throw Object.assign(new Error('Please sign in first.'), { code: 'LOGIN_REQUIRED' })
  const settings = await loadCountrySettings({ force: true })
  if (!settings) throw Object.assign(new Error('Could not verify your country.'), { code: 'COUNTRY_VERIFICATION_FAILED' })
  if (!canAccessAuthorPreOrder(settings)) throw Object.assign(new Error('Verified Cambodian author access is required.'), { code: 'PRE_ORDER_ACCESS_DENIED' })
  return true
}

async function requestPreOrder(path = '', { method = 'GET', body, signal } = {}) {
  const token = getAuthToken()
  if (!token) throw Object.assign(new Error('Please sign in first.'), { code: 'LOGIN_REQUIRED' })
  const response = await fetch(`${ROOT}${path}`, {
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
  if (!response.ok || data.ok === false) {
    const error = new Error(String(data.message || (response.status === 404 ? 'Pre-order service is not available yet.' : 'Pre-order request failed.')))
    error.status = response.status
    error.code = data.code || (response.status === 404 ? 'PRE_ORDER_NOT_READY' : 'PRE_ORDER_REQUEST_FAILED')
    throw error
  }
  return data
}

export async function fetchAuthorPreOrders({ status = 'all', search = '', page = 1, limit = 12, signal } = {}) {
  const params = new URLSearchParams({ page: String(Math.max(1, page)), limit: String(Math.max(1, Math.min(24, limit))) })
  if (status && status !== 'all') params.set('status', status)
  if (String(search || '').trim()) params.set('search', String(search).trim())
  const data = await requestPreOrder(`?${params.toString()}`, { signal })
  return {
    items: Array.isArray(data.campaigns) ? data.campaigns : [],
    total: Number.isFinite(Number(data.total)) ? Math.max(0, Number(data.total)) : null,
    hasMore: data.has_more === true,
    summary: data.summary && typeof data.summary === 'object' ? data.summary : null,
  }
}

export async function fetchAuthorPreOrder(id, { signal } = {}) {
  if (!id) throw new Error('Missing pre-order ID.')
  const data = await requestPreOrder(`/${encodeURIComponent(String(id))}`, { signal })
  if (!data.campaign) throw new Error('Pre-order response did not contain a campaign.')
  return data.campaign
}

export async function saveAuthorPreOrderDraft(campaign, { id, signal } = {}) {
  const url = id ? `/${encodeURIComponent(String(id))}` : ''
  const data = await requestPreOrder(url, {
    method: id ? 'PUT' : 'POST',
    body: { ...preOrderCampaignPayload(campaign), ...(id ? {} : { status: 'draft' }) },
    signal,
  })
  if (!data.campaign?.id) throw new Error('The server did not confirm that the draft was saved.')
  return data.campaign
}

export async function publishAuthorPreOrder(id, { signal } = {}) {
  if (!id) throw new Error('Save the draft before publishing.')
  const data = await requestPreOrder(`/${encodeURIComponent(String(id))}/publish`, { method: 'POST', signal })
  if (!data.campaign?.id) throw new Error('The server did not confirm publication.')
  return data.campaign
}

export async function uploadAuthorPreOrderImage(file, { slot = 'banner', signal, onProgress } = {}) {
  const token = getAuthToken()
  if (!token) throw new Error('Please sign in before uploading an image.')
  const optimized = await optimizeImageForUpload(file, {
    preset: slot === 'book' ? 'cover' : 'post',
    maxSourceBytes: MAX_IMAGE_BYTES,
    signal,
  })
  const category = slot === 'book' ? 'author_store_cover' : 'author_store_gallery'
  const data = await uploadMediaWithFallback({
    file: optimized.file,
    token,
    category,
    apiBaseUrl: API_BASE_URL,
    signal,
    onProgress,
  })
  const url = String(data.image_url || data.imageUrl || '').trim()
  if (!/^https:\/\/[^\s]+$/i.test(url)) throw new Error('Upload did not return a valid image URL.')
  return url
}
