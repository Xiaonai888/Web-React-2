const API_BASE_URL = import.meta.env.VITE_API_URL || ((typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)) ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com')
const UUID = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i
const TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

function sessionToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

async function safeResponse(response) {
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.ok !== true) throw new Error(data.message || 'Shipping request failed')
  return data
}

export async function uploadBookOrderPrivateProof(file, order, { signal } = {}) {
  const token = sessionToken()
  const holdId = String(order?.holdId || '').trim()
  if (!token) throw new Error('Please sign in')
  if (!UUID.test(holdId)) throw new Error('Invalid book hold')
  if (!file || !TYPES.has(file.type) || file.size < 16 || file.size > 5 * 1024 * 1024) {
    throw new Error('Select a valid JPEG, PNG or WebP proof image up to 5 MB')
  }
  const body = new FormData()
  body.append('proof', file)
  const response = await fetch(`${API_BASE_URL}/api/author-store/book-holds/${encodeURIComponent(holdId)}/proof-upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body,
    signal,
  })
  const data = await safeResponse(response)
  if (!UUID.test(String(data.proof_id || ''))) throw new Error('Private shipping proof was not verified')
  return { proofId: data.proof_id, proofRef: data.proof_ref }
}

export async function finalizeBookOrderShipment(order, details, { signal } = {}) {
  const token = sessionToken()
  const holdId = String(order?.holdId || '').trim()
  const proofId = String(details?.proof_id || details?.proofId || '').trim()
  const company = String(details?.delivery_company || '').trim()
  const tracking = String(details?.tracking_number || '').trim()
  if (!token) throw new Error('Please sign in')
  if (!UUID.test(holdId) || !UUID.test(proofId)) throw new Error('Invalid book hold or proof ID')
  if (company.length < 2 || company.length > 120 || (tracking && tracking.length < 4) || tracking.length > 120) {
    throw new Error('Delivery company is required; tracking number is optional')
  }
  const response = await fetch(`${API_BASE_URL}/api/author-store/me/book-pending/${encodeURIComponent(holdId)}/mark-shipped`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ proof_id: proofId, delivery_company: company, tracking_number: tracking }),
    signal,
  })
  return safeResponse(response)
}

export async function submitBookOrderShipment({ order, delivery_company, tracking_number = '', proof_file }, options = {}) {
  const uploaded = await uploadBookOrderPrivateProof(proof_file, order, options)
  return finalizeBookOrderShipment(order, { proof_id: uploaded.proofId, delivery_company, tracking_number }, options)
}
