import { API_BASE_URL, getAuthToken } from '../config/api'

const ROOT = `${API_BASE_URL}/api/author-store/me/pre-order-reports`
const UUID = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i
const DATE = /^\d{4}-\d{2}-\d{2}$/
const EDITIONS = new Set(['all', 'standard', 'limited'])
const SORTS = new Set(['newest', 'oldest', 'highest'])

function reportError(message, code = 'PRE_ORDER_REPORT_FAILED', status = 0) {
  return Object.assign(new Error(message), { code, status })
}

function activeToken() {
  const token = getAuthToken()
  if (!token) throw reportError('Sign in to view your pre-order reports.', 'LOGIN_REQUIRED', 401)
  return token
}

export function authorPreOrderReportParams(filters = {}, { paginated = true } = {}) {
  const params = new URLSearchParams()
  for (const [key, value] of [['campaign_id', filters.campaignId], ['book_id', filters.bookId]]) {
    if (!value) continue
    if (typeof value !== 'string' || !UUID.test(value)) throw reportError(`Invalid ${key}.`, 'PRE_ORDER_REPORT_INVALID_FILTER', 400)
    params.set(key, value)
  }
  const edition = filters.edition || 'all'
  const sort = filters.sort || 'newest'
  if (!EDITIONS.has(edition) || !SORTS.has(sort)) throw reportError('Invalid report selection.', 'PRE_ORDER_REPORT_INVALID_FILTER', 400)
  params.set('edition', edition)
  params.set('sort', sort)
  for (const [key, value] of [['from', filters.from], ['to', filters.to]]) {
    if (!value) continue
    if (typeof value !== 'string' || !DATE.test(value)) throw reportError('Invalid report date.', 'PRE_ORDER_REPORT_INVALID_DATE', 400)
    params.set(key, value)
  }
  if (filters.from && filters.to && filters.from > filters.to) throw reportError('Start date must not be after end date.', 'PRE_ORDER_REPORT_INVALID_DATE', 400)
  if (paginated) {
    const page = Number(filters.page || 1)
    const limit = Number(filters.limit || 20)
    if (!Number.isSafeInteger(page) || page < 1 || page > 100000 || !Number.isSafeInteger(limit) || limit < 1 || limit > 50) {
      throw reportError('Invalid page.', 'PRE_ORDER_REPORT_INVALID_PAGE', 400)
    }
    params.set('page', String(page))
    params.set('limit', String(limit))
  }
  return params
}

async function requestReport(endpoint, filters, { signal, excel = false } = {}) {
  const token = activeToken()
  const params = authorPreOrderReportParams(filters, { paginated: !excel })
  let response
  try {
    response = await fetch(`${ROOT}/${endpoint}?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: excel ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'application/json' },
      cache: 'no-store',
      signal,
    })
  } catch (error) {
    if (error?.name === 'AbortError') throw error
    throw reportError('Could not connect to pre-order reports.', 'PRE_ORDER_REPORT_NETWORK_ERROR')
  }
  if (getAuthToken() !== token) throw reportError('Account changed. Reopen this report.', 'PRE_ORDER_ACCOUNT_CHANGED', 401)
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw reportError(String(data.message || `Pre-order reports returned HTTP ${response.status}.`), String(data.code || 'PRE_ORDER_REPORT_FAILED'), response.status)
  }
  if (excel) {
    const type = response.headers.get('content-type') || ''
    if (!type.includes('spreadsheetml.sheet')) throw reportError('The server did not return an Excel file.', 'PRE_ORDER_INVALID_EXCEL_RESPONSE')
    const blob = await response.blob()
    if (!blob.size) throw reportError('Excel file is empty.', 'PRE_ORDER_EMPTY_EXCEL')
    if (getAuthToken() !== token) throw reportError('Account changed during download.', 'PRE_ORDER_ACCOUNT_CHANGED', 401)
    return blob
  }
  const data = await response.json().catch(() => null)
  if (!data || data.ok !== true || !Array.isArray(data.orders)) throw reportError('Invalid paid-orders response.', 'PRE_ORDER_INVALID_REPORT_RESPONSE')
  return data
}

export function fetchAuthorPreOrderPaidOrders(filters = {}, { signal } = {}) {
  return requestReport('paid-orders', filters, { signal })
}

export async function downloadAuthorPreOrderPaidOrdersExcel(filters = {}, { signal } = {}) {
  const blob = await requestReport('excel', filters, { signal, excel: true })
  const objectUrl = URL.createObjectURL(blob)
  try {
    const anchor = document.createElement('a')
    const date = new Date().toISOString().slice(0, 10)
    anchor.href = objectUrl
    anchor.download = `shadow-preorder-paid-orders-${date}.xlsx`
    anchor.hidden = true
    document.body.appendChild(anchor)
    try {
      anchor.click()
    } finally {
      anchor.remove()
    }
  } finally {
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
  }
  return { downloaded: true }
}
