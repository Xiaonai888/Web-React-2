import { getCountryFeature, getPaymentCountryTicket, loadCountrySettings } from '../utils/countrySettings'

const API_BASE_URL = import.meta.env.VITE_API_URL || (
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'
)

const ORDER_KEY = 'shadow_binance_checkout_order_v1'
const UUID_RE = /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i

function readerToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

export class BinanceCheckoutApiError extends Error {
  constructor(message, code = 'REQUEST_FAILED', status = 0) {
    super(message)
    this.name = 'BinanceCheckoutApiError'
    this.code = code
    this.status = status
  }
}

async function request(path, { method = 'GET', body, signal } = {}) {
  const token = readerToken()
  if (!token) throw new BinanceCheckoutApiError('Please sign in to continue.', 'UNAUTHORIZED', 401)

  let countryTicket = null
  if (path === '/checkout' && method === 'POST') {
    const settings = await loadCountrySettings()
    if (settings?.countryVerified !== true || getCountryFeature(settings, 'binancePay', false) !== true) {
      throw new BinanceCheckoutApiError('Binance Pay is unavailable in your country.', 'PAYMENT_METHOD_UNAVAILABLE', 403)
    }
    countryTicket = await getPaymentCountryTicket()
    if (!countryTicket) {
      throw new BinanceCheckoutApiError('Country verification is unavailable. Please try again.', 'PAYMENT_COUNTRY_REQUIRED', 403)
    }
  }

  let response
  try {
    response = await fetch(`${API_BASE_URL}/api/purchase/binance${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(countryTicket ? { 'X-Shadow-Country-Ticket': countryTicket } : {}),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      cache: 'no-store',
      credentials: 'omit',
      signal,
    })
  } catch {
    throw new BinanceCheckoutApiError('Payment service could not be reached.', 'NETWORK_ERROR', 503)
  }
  const payload = await response.json().catch(() => null)
  if (!response.ok || payload?.ok !== true) {
    const code = String(payload?.code || 'REQUEST_FAILED')
    const message = typeof payload?.message === 'string' && payload.message.length <= 200
      ? payload.message : 'Payment service is temporarily unavailable.'
    throw new BinanceCheckoutApiError(message, code, response.status)
  }
  return payload
}

function validOrderId(orderId) {
  if (!UUID_RE.test(String(orderId || ''))) {
    throw new BinanceCheckoutApiError('Invalid payment order.', 'INVALID_ORDER_ID', 400)
  }
  return String(orderId)
}

export function getRememberedBinanceOrderId() {
  const value = sessionStorage.getItem(ORDER_KEY) || ''
  return UUID_RE.test(value) ? value : ''
}

export function rememberBinanceOrderId(orderId) {
  sessionStorage.setItem(ORDER_KEY, validOrderId(orderId))
}

export function clearRememberedBinanceOrderId() {
  sessionStorage.removeItem(ORDER_KEY)
}

export async function createReaderBinanceOrder(packageUsd) {
  const amount = Number(packageUsd)
  if (!Number.isInteger(amount) || ![1, 5, 10, 20, 50, 100].includes(amount)) {
    throw new BinanceCheckoutApiError('Invalid purchase package.', 'INVALID_PACKAGE', 400)
  }
  return (await request('/checkout', { method: 'POST', body: { package_usd: amount } })).order
}

export async function getReaderBinanceOrder(orderId) {
  return (await request(`/checkout/${validOrderId(orderId)}`)).order
}

export async function cancelReaderBinanceOrder(orderId) {
  return (await request(`/checkout/${validOrderId(orderId)}/cancel`, { method: 'POST' })).order
}

export async function submitReaderBinanceTransaction(orderId, transactionId) {
  const transaction = String(transactionId || '').trim()
  if (!/^[A-Za-z0-9_-]{6,128}$/.test(transaction)) {
    throw new BinanceCheckoutApiError('Invalid Binance transaction ID.', 'INVALID_TRANSACTION_ID', 400)
  }
  return (await request(`/checkout/${validOrderId(orderId)}/claim`, {
    method: 'POST', body: { transaction_id: transaction },
  })).claim
}

export async function getReaderBinanceClaim(orderId) {
  return (await request(`/checkout/${validOrderId(orderId)}/claim`)).claim
}

export function getVerifiedBinanceQrUrl() {
  return `${API_BASE_URL}/api/purchase/binance/receiver/qr`
}
