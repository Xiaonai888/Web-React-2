const CONTENT_TTL = 30 * 60 * 1000
const PLAYLIST_TTL = 5 * 60 * 1000
const MAX_VIDEO_RECORDS = 200
const MAX_PLAYLIST_RECORDS = 100
const entries = new Map()
let activeSession = ''

export function studioContentSession() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function sessionReady() {
  const session = studioContentSession()
  if (session !== activeSession) {
    entries.clear()
    activeSession = session
  }
  return Boolean(session)
}

function copy(value) {
  return {
    ...value,
    ...(Array.isArray(value.items) ? { items: [...value.items] } : {}),
    ...(Array.isArray(value.videos) ? { videos: [...value.videos] } : {}),
  }
}

function read(key, ttl) {
  if (!sessionReady()) return null
  const entry = entries.get(key)
  if (!entry) return null
  if (Date.now() - entry.savedAt >= ttl) {
    entries.delete(key)
    return null
  }
  entries.delete(key)
  entries.set(key, entry)
  return copy(entry.value)
}

function write(key, value, ttl) {
  if (!sessionReady()) return
  const copyValue = copy(value)
  const length = Array.isArray(copyValue.items) ? copyValue.items.length : Array.isArray(copyValue.videos) ? copyValue.videos.length : 0
  const isPlaylistList = key === 'section:playlists'
  if (length > (isPlaylistList ? MAX_PLAYLIST_RECORDS : MAX_VIDEO_RECORDS)) {
    entries.delete(key)
    return
  }
  entries.delete(key)
  entries.set(key, { value: copyValue, savedAt: Date.now(), ttl })
  let videos = 0
  let playlists = 0
  const counts = () => {
    videos = 0
    playlists = 0
    for (const [cacheKey, entry] of entries) {
      const value = entry.value
      if (cacheKey === 'section:playlists') playlists += value.items?.length || 0
      else videos += (value.items?.length || value.videos?.length || 0)
    }
  }
  counts()
  while (videos > MAX_VIDEO_RECORDS || playlists > MAX_PLAYLIST_RECORDS) {
    const oldest = entries.keys().next().value
    if (oldest == null) break
    entries.delete(oldest)
    counts()
  }
}

export function readStudioSectionCache(section) {
  return read(`section:${section}`, CONTENT_TTL)
}

export function writeStudioSectionCache(section, value) {
  if (value?.initialized === true) write(`section:${section}`, value, CONTENT_TTL)
}

export function readStudioPlaylistCache(playlistId) {
  return read(`playlist:${playlistId}`, PLAYLIST_TTL)
}

export function writeStudioPlaylistCache(playlistId, value) {
  if (playlistId && value?.ready === true) write(`playlist:${playlistId}`, value, PLAYLIST_TTL)
}

export function invalidateStudioPlaylistCache(playlistId) {
  if (!sessionReady()) return
  if (playlistId) entries.delete(`playlist:${playlistId}`)
  else for (const key of entries.keys()) if (key.startsWith('playlist:')) entries.delete(key)
}

export function invalidateStudioContentCache(sections) {
  if (!sessionReady()) return
  const selected = Array.isArray(sections) ? sections : ['videos', 'shorts', 'playlists']
  for (const section of selected) entries.delete(`section:${section}`)
  if (!Array.isArray(sections)) invalidateStudioPlaylistCache()
}
