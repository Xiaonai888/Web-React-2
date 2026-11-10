const API_BASE = import.meta.env.VITE_API_URL || (
  ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com'
)
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function getStudioPlaylistDetailPage(playlistId, { limit = 12, offset = 0, signal } = {}) {
  const id = String(playlistId || '')
  if (!UUID.test(id)) throw new Error('Invalid Playlist ID')
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 24) throw new Error('Invalid page size')
  if (!Number.isSafeInteger(offset) || offset < 0 || offset > 5000) throw new Error('Invalid page offset')

  const token = localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token')
  if (!token) throw new Error('Sign in to manage Playlists.')

  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) })
  const response = await fetch(`${API_BASE}/api/shadow-studio/content/playlists/${encodeURIComponent(id)}/videos?${params.toString()}`, {
    signal,
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` },
  })
  const result = await response.json().catch(() => null)
  if (!response.ok || result?.ok !== true) {
    throw new Error(result?.message || `Unable to load Playlist (${response.status})`)
  }

  const items = Array.isArray(result.videos) ? result.videos : []
  const next = Number(result.pagination?.next_offset)
  const nextOffset = Number.isSafeInteger(next) && next > offset ? next : offset + items.length
  return {
    playlist: result.playlist || null,
    videos: items,
    pagination: {
      nextOffset,
      hasMore: Boolean(result.pagination?.has_more) && nextOffset > offset && nextOffset <= 5000,
      total: Number.isSafeInteger(result.pagination?.total) ? result.pagination.total : null,
    },
  }
}
