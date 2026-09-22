import { saveOfflinePdf } from './offlinePdfStorage'

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : 'https://shadow-backend-kucw.onrender.com'

export async function savePurchasedPdfOffline({ pdfId, signal, onProgress } = {}) {
  const id = String(pdfId ?? '').trim()
  const token = sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
  if (!id || !token) throw new Error('Sign in and select a purchased PDF first')
  if (navigator.onLine === false) throw new Error('Connect to the internet to save this PDF')

  onProgress?.('checking')
  const grantResponse = await fetch(`${API_BASE_URL}/api/author-store/downloads/${encodeURIComponent(id)}/offline-grant`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
    signal,
  })
  const data = await grantResponse.json().catch(() => ({}))
  if (!grantResponse.ok || data.ok !== true || data.grant?.offline_allowed !== true) {
    throw new Error(data.message || 'Offline saving is not permitted for this PDF')
  }

  const pdfUrl = new URL(String(data.pdf_url || ''))
  if (pdfUrl.protocol !== 'https:') throw new Error('A secure PDF URL is required')
  onProgress?.('downloading')
  let pdfResponse
  try {
    pdfResponse = await fetch(pdfUrl.href, { method: 'GET', credentials: 'omit', cache: 'no-store', signal })
  } catch (error) {
    if (signal?.aborted) throw error
    throw new Error('Cannot fetch this PDF. Check that its file host allows access from Shadow.')
  }
  if (!pdfResponse.ok || pdfResponse.type === 'opaque') {
    throw new Error('Unable to download this PDF for offline reading')
  }
  const bytes = Number(pdfResponse.headers.get('content-length') || 0)
  if (bytes > 200 * 1024 * 1024) throw new Error('This PDF is too large for offline storage')
  const blob = await pdfResponse.blob()
  onProgress?.('saving')
  return saveOfflinePdf({ pdfId: id, title: data.title, blob, grant: data.grant })
}
