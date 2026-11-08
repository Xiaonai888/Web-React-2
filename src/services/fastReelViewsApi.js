// NEW: src/services/fastReelViewsApi.js
// Only call after the YouTube iframe confirms PLAYING (player state === 1).
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com')

const VIEWER_STORAGE_KEY = 'shadow_fast_reel_viewer_id_v1'
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const recentlyReported = new Map()
let volatileViewerId = null
const REPEAT_INTERVAL_MS = 30 * 60 * 1000

function getBrowserViewerId() {
  try {
    const prior = localStorage.getItem(VIEWER_STORAGE_KEY)
    if (prior && UUID.test(prior)) return prior
  } catch { /* e.g. private mode */ }

  if (volatileViewerId) return volatileViewerId
  if (typeof crypto === 'undefined' || typeof crypto.randomUUID !== 'function') return null
  const value = crypto.randomUUID()
  volatileViewerId = value
  try { localStorage.setItem(VIEWER_STORAGE_KEY, value) } catch { /* no persistence */ }
  return value
}

export async function recordFastReelView(videoId) {
  if (!UUID.test(String(videoId || ''))) return null
  const now = Date.now()
  const last = recentlyReported.get(videoId)
  if (last && now - last < REPEAT_INTERVAL_MS) return null
  const viewerId = getBrowserViewerId()
  if (!viewerId) return null

  // Prevent overlapping calls caused by duplicate player state events.
  recentlyReported.set(videoId, now)
  if (recentlyReported.size > 500) recentlyReported.clear()
  try {
    const response = await fetch(`${API_BASE_URL}/api/fast/videos/${encodeURIComponent(videoId)}/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ viewer_id: viewerId }),
      cache: 'no-store',
      keepalive: true,
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok || !data.ok) throw new Error(data.message || 'View tracking failed')
    return data
  } catch (error) {
    recentlyReported.delete(videoId) // allow retry after a failed request
    throw error
  }
}
