import { API_BASE_URL, getAuthToken } from '../config/api'

const ROOT = `${API_BASE_URL}/api/author-store/pre-orders`
const UUID = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i
const DELIVERY_KEY = /^[a-z0-9][a-z0-9_-]{0,63}$/
const FILTERS = new Set(['all', 'scheduled', 'active'])

function preOrderError(message, code = 'READER_PRE_ORDER_REQUEST_FAILED', status = 0) {
  return Object.assign(new Error(String(message)), { code, status })
}

function validId(id) {
  const value = String(id || '').trim()
  if (!UUID.test(value)) throw preOrderError('Invalid pre-order record ID.', 'READER_PRE_ORDER_INVALID_ID', 400)
  return value
}

async function request(path, { method = 'GET', body, signal } = {}) {
  const token = getAuthToken()
  let response
  try {
    response = await fetch(`${ROOT}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      cache: 'no-store',
      signal,
    })
  } catch (error) {
    if (error?.name === 'AbortError') throw error
    throw preOrderError('Could not connect to the pre-order service.', 'READER_PRE_ORDER_NETWORK_ERROR')
  }
  if (getAuthToken() !== token) {
    throw preOrderError('Account changed. Please reload pre-orders.', 'READER_PRE_ORDER_ACCOUNT_CHANGED', 401)
  }
  const data = await response.json().catch(() => null)
  if (!response.ok || !data || data.ok !== true) {
    throw preOrderError(data?.message || `Pre-order service returned HTTP ${response.status}.`, data?.code || 'READER_PRE_ORDER_SERVICE_ERROR', response.status)
  }
  return data
}

export async function fetchReaderPreOrderList({ page = 1, limit = 12, status = 'all', search = '', signal } = {}) {
  const currentPage = Number(page)
  const currentLimit = Number(limit)
  if (!Number.isSafeInteger(currentPage) || currentPage < 1 || currentPage > 10000 || !Number.isSafeInteger(currentLimit) || currentLimit < 1 || currentLimit > 24 || !FILTERS.has(status)) {
    throw preOrderError('Invalid pre-order list options.', 'READER_PRE_ORDER_INVALID_FILTER', 400)
  }
  if (typeof search !== 'string' || search.trim().length > 100) {
    throw preOrderError('Search text is too long.', 'READER_PRE_ORDER_INVALID_FILTER', 400)
  }
  const params = new URLSearchParams({ page: String(currentPage), limit: String(currentLimit), status })
  if (search.trim()) params.set('search', search.trim())
  const data = await request(`?${params.toString()}`, { signal })
  if (!Array.isArray(data.records) || typeof data.has_more !== 'boolean') {
    throw preOrderError('Invalid pre-order list response.', 'READER_PRE_ORDER_INVALID_RESPONSE')
  }
  return { records: data.records, total: Number(data.total) || 0, hasMore: data.has_more, page: currentPage }
}

export async function fetchReaderPreOrderDetail(campaignId, { signal } = {}) {
  const data = await request(`/${validId(campaignId)}`, { signal })
  if (!data.record?.id || !data.record?.book?.id || !Array.isArray(data.record.delivery_companies)) {
    throw preOrderError('Invalid pre-order details.', 'READER_PRE_ORDER_INVALID_RESPONSE')
  }
  return data.record
}

export async function fetchReaderPreOrderQuote(campaignId, { edition, quantity, deliveryCompanyKey, signatureRequested = false }, { signal } = {}) {
  const count = Number(quantity)
  const deliveryKey = String(deliveryCompanyKey || '').trim().toLowerCase()
  if (!['standard', 'limited'].includes(edition) || !Number.isSafeInteger(count) || count < 1 || count > 99 || !DELIVERY_KEY.test(deliveryKey) || typeof signatureRequested !== 'boolean') {
    throw preOrderError('Invalid checkout options.', 'READER_PRE_ORDER_INVALID_QUOTE_INPUT', 400)
  }
  const data = await request(`/${validId(campaignId)}/quote`, {
    method: 'POST',
    body: {
      edition,
      quantity: count,
      delivery_company_key: deliveryKey,
      signature_requested: signatureRequested,
    },
    signal,
  })
  const quote = data.quote
  if (!quote || quote.quote_only !== true || quote.inventory_reserved !== false || quote.payment_created !== false || quote.currency !== 'USD' ||
    quote.campaign_id !== campaignId || quote.edition !== edition || quote.quantity !== count ||
    quote.delivery_company?.company_key !== deliveryKey || quote.signature_requested !== signatureRequested ||
    !Number.isFinite(Number(quote.total_usd)) || Number(quote.total_usd) <= 0) {
    throw preOrderError('Invalid server price preview.', 'READER_PRE_ORDER_INVALID_QUOTE')
  }
  return quote
}
