// Shadow Reel stores only YouTube URLs/metadata. No video download or upload.
const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/
const LONG_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
])
const SHORT_HOSTS = new Set(['youtu.be', 'www.youtu.be'])

export function getReelYouTubeId(input) {
  if (typeof input !== 'string' || !input.trim() || input.length > 2048) return ''
  try {
    const url = new URL(input.trim())
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return ''
    const host = url.hostname.toLowerCase()
    const path = url.pathname.split('/').filter(Boolean)
    let id = ''

    if (SHORT_HOSTS.has(host) && path.length === 1) {
      id = path[0]
    } else if (LONG_HOSTS.has(host)) {
      if (path.length === 1 && path[0] === 'watch') id = url.searchParams.get('v') || ''
      if (path.length === 2 && ['shorts', 'embed', 'live'].includes(path[0])) id = path[1]
    }

    return VIDEO_ID.test(id) ? id : ''
  } catch {
    return ''
  }
}

export function getReelYouTubeUrls(input) {
  const id = getReelYouTubeId(input)
  if (!id) return null
  return {
    id,
    videoUrl: `https://www.youtube.com/watch?v=${id}`,
    thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
  }
}
