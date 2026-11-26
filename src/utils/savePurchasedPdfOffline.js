import { saveOfflinePdf } from './offlinePdfStorage'
import { getOfflineReaderAccountId } from './offlineReaderContent'
import { getPurchasedPdfResponseVersion, normalizePurchasedPdfVersion, rememberPurchasedPdfVersion } from './purchasedPdfUpdate'

const API_BASE_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : 'https://shadow-backend-kucw.onrender.com')

export async function savePurchasedPdfOffline({ pdfId, signal, onProgress } = {}) {
  const id = String(pdfId ?? '').trim()
  const token = sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
  const accountId = getOfflineReaderAccountId()
  if (!id || !token || !accountId) throw new Error('Sign in and select a purchased PDF first')
  if (navigator.onLine === false) throw new Error('Connect to the internet to save this PDF')

  const endpoint = `${API_BASE_URL}/api/author-store/downloads/${encodeURIComponent(id)}`
  onProgress?.('checking')
  const grantResponse = await fetch(`${endpoint}/offline-grant`, {
    method: 'GET', headers: { Authorization: `Bearer ${token}` }, cache: 'no-store', signal,
  })
  const data = await grantResponse.json().catch(() => ({}))
  if (!grantResponse.ok || data.ok !== true || data.grant?.offline_allowed !== true || String(data.grant.account_id) !== accountId || String(data.grant.pdf_id) !== id) {
    throw new Error(data.message || 'Offline saving is not permitted for this PDF')
  }

  const isPrivate = data.pdf_is_private === true
  let pdfUrl = `${endpoint}/pdf?mode=download`
  if (!isPrivate) {
    const publicUrl = new URL(String(data.pdf_url || ''))
    if (publicUrl.protocol !== 'https:') throw new Error('A secure PDF URL is required')
    pdfUrl = publicUrl.href
  }
  onProgress?.('downloading')
  let pdfResponse
  try {
    pdfResponse = await fetch(pdfUrl, {
      method: 'GET',
      ...(isPrivate ? { headers: { Authorization: `Bearer ${token}` } } : { credentials: 'omit' }),
      cache: 'no-store', signal,
    })
  } catch (error) {
    if (signal?.aborted) throw error
    throw new Error('Cannot fetch this PDF. Please try again.')
  }
  if (!pdfResponse.ok || pdfResponse.type === 'opaque') throw new Error('Unable to download this PDF for offline reading')
  const bytes = Number(pdfResponse.headers.get('content-length') || 0)
  if (bytes > 200 * 1024 * 1024) throw new Error('This PDF is too large for offline storage')
  const blob = await pdfResponse.blob()
  if (signal?.aborted) throw new DOMException('Download cancelled', 'AbortError')
  if (getOfflineReaderAccountId() !== accountId) throw new Error('Reader account changed. Please try again.')
  const version = isPrivate ? getPurchasedPdfResponseVersion(pdfResponse) : normalizePurchasedPdfVersion(data.grant.pdf_version)
  if (isPrivate && !version) throw new Error('PDF version could not be verified. Please try again.')
  onProgress?.('saving')
  const result = await saveOfflinePdf({ pdfId: id, title: data.title, blob, grant: { ...data.grant, pdf_version: version } })
  if (version) rememberPurchasedPdfVersion(accountId, id, version, { kind: 'offline' })
  return result
}
