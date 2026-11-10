const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const SLOT = /^\d{4}-\d{2}-\d{2}T(?:00|06|12|18):00$/
const MS_DAY = 86_400_000

function safeImageUrl(value) {
  const input = typeof value === 'string' ? value.trim() : ''
  if (/^https?:\/\/[^\s]+$/i.test(input)) return input
  if (/^\/(?!\/)[^\s]*$/.test(input)) return input
  return ''
}

export function smartAdCambodiaSlotAt(now = Date.now()) {
  const time = Number(now)
  if (!Number.isFinite(time)) throw new TypeError('Invalid Smart Ad time')
  const local = new Date(time + 7 * 3_600_000)
  const day = local.toISOString().slice(0, 10)
  const hour = Math.floor(local.getUTCHours() / 6) * 6
  return `${day}T${String(hour).padStart(2, '0')}:00`
}

export function validateDiscoverSmartAdVersion(value, { expectedSlot = '', expectedVersion = null } = {}) {
  const slot = String(value?.slot_key || '')
  const version = Number(value?.catalog_version)
  if (!SLOT.test(slot) || !Number.isSafeInteger(version) || version < 1) return false
  if (expectedSlot && slot !== expectedSlot) return false
  if (expectedVersion !== null && Number(expectedVersion) !== version) return false
  return true
}

export function normalizeDiscoverSmartAd(record, {
  catalogVersion,
  now = Date.now(),
} = {}) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) return null
  const storyId = String(record.story_id || '').toLowerCase()
  const firstId = String(record.first_episode_id || '').toLowerCase()
  if (!UUID.test(storyId) || !UUID.test(firstId)) return null
  const title = String(record.title || '').trim()
  if (!title) return null
  const version = Number(catalogVersion)
  if (!Number.isSafeInteger(version) || version < 1) return null
  if (Number(record.eligibility_version) !== version) return null

  const storyKind = String(record.story_kind || '')
  if (!['novel', 'short'].includes(storyKind)) return null
  const count = Number(record.episode_count)
  if (!Number.isFinite(count) || count < 1) return null
  const completed = String(record.story_status || '').trim().toLowerCase() === 'completed'
  if (storyKind === 'short' && !completed) return null
  if (storyKind === 'novel' && count < 5) return null

  const publishedAt = Date.parse(record.last_episode_published_at || '')
  const timestamp = Number(now)
  if (!Number.isFinite(timestamp) || !Number.isFinite(publishedAt) || publishedAt > timestamp) return null
  if (!completed && timestamp - publishedAt > 90 * MS_DAY) return null

  const cover = safeImageUrl(record.cover_url)
  const preview = safeImageUrl(record.preview_image_url) || cover
  return {
    ...record,
    story_id: storyId,
    first_episode_id: firstId,
    title,
    description: String(record.description_preview || record.description || '').slice(0, 360),
    story_kind: storyKind,
    episode_count: Math.floor(count),
    cover_url: cover,
    preview_image_url: preview,
    author_avatar_url: safeImageUrl(record.author_avatar_url),
    last_update_at: record.last_episode_published_at,
    eligibility_version: version,
  }
}

export function filterDiscoverSmartAds(records, {
  catalogVersion,
  now = Date.now(),
  excludeStoryIds = [],
} = {}) {
  const excluded = new Set((Array.isArray(excludeStoryIds) ? excludeStoryIds : []).map(String))
  const result = []
  for (const row of Array.isArray(records) ? records : []) {
    const ad = normalizeDiscoverSmartAd(row, { catalogVersion, now })
    if (!ad || excluded.has(ad.story_id)) continue
    excluded.add(ad.story_id)
    result.push(ad)
    if (result.length === 10) break
  }
  return result
}
