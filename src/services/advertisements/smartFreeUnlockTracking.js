import {
  getSmartAdReaderKey,
  openSmartAdEpisodeOne,
  recordSmartAdImpressions,
} from '../smartAdClient'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const seen = new Set()
const pending = new Map()

function impressionKey(advertisement) {
  return `shadow_smart_free_unlock_impression_v1:${getSmartAdReaderKey()}:${advertisement.slot_key}:${advertisement.story_id}`
}

export async function recordSmartFreeUnlockImpression(advertisement) {
  if (!advertisement?.slot_key || !UUID.test(String(advertisement.story_id || ''))) return false
  const key = impressionKey(advertisement)
  if (seen.has(key)) return false
  try {
    if (sessionStorage.getItem(key) === '1') {
      seen.add(key)
      return false
    }
  } catch {}
  if (pending.has(key)) return pending.get(key)

  const request = recordSmartAdImpressions({
    placement: 'freeUnlock',
    slotKey: advertisement.slot_key,
    storyIds: [advertisement.story_id],
  }).then(() => {
    seen.add(key)
    try { sessionStorage.setItem(key, '1') } catch {}
    if (seen.size > 3000) seen.delete(seen.values().next().value)
    return true
  }).finally(() => {
    if (pending.get(key) === request) pending.delete(key)
  })

  pending.set(key, request)
  return request
}

export async function openSmartFreeUnlockEpisodeOne(advertisement) {
  const storyId = String(advertisement?.story_id || '').toLowerCase()
  const slotKey = String(advertisement?.slot_key || '')
  if (!UUID.test(storyId) || !slotKey) throw new TypeError('Invalid Smart Ad story or slot')
  const result = await openSmartAdEpisodeOne({
    placement: 'freeUnlock',
    slotKey,
    storyId,
  })
  const episodeId = String(result.first_episode_id || '').toLowerCase()
  const expectedPath = `/story/${storyId}/episode/${episodeId}`
  if (!UUID.test(episodeId) ||
      String(result.story_id || '').toLowerCase() !== storyId ||
      result.reader_path !== expectedPath) {
    throw new Error('Invalid Smart Ad first episode destination')
  }
  return expectedPath
}
