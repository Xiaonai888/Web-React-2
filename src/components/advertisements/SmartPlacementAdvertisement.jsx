import {
  getSmartAdReaderKey,
  getSmartAdVersion,
  selectSmartAds,
  recordSmartAdImpressions,
  openSmartAdEpisodeOne,
} from '../smartAdClient'
import {
  readSmartAdQueue,
  nextSmartAdFromQueue,
  appendSmartAdSelection,
  getSmartAdReservedIds,
} from '../smartAdQueue'
import {
  getSmartFreeUnlockInterests,
  toSmartFreeUnlockAdvertisement,
} from './smartFreeUnlockPresentation'

const PLACEMENTS = new Set(['opening', 'me'])
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const pending = new Map()
const emptyRetry = new Map()
const impressions = new Map()

function assertPlacement(placement) {
  if (!PLACEMENTS.has(placement)) throw new TypeError('Invalid Smart Ad placement')
  return placement
}

function findNext(readerKey, placement, version) {
  for (let i = 0; i < 10; i += 1) {
    const story = nextSmartAdFromQueue({
      readerKey,
      placement,
      slotKey: version.slot_key,
      catalogVersion: version.catalog_version,
    })
    if (!story) return null
    const original = toSmartFreeUnlockAdvertisement(story, version.slot_key)
    if (!original) continue
    return {
      ...original,
      placement,
      frequency: 'once_per_session',
      updated_at: 'auto_system_v1',
    }
  }
  return null
}

export async function takeSmartPlacementAdvertisement(placement, signal) {
  assertPlacement(placement)
  const version = await getSmartAdVersion({ signal })
  if (!version?.slot_key || !Number.isSafeInteger(Number(version.catalog_version))) {
    throw new Error('Invalid Smart Ad version')
  }
  const readerKey = getSmartAdReaderKey()
  const options = {
    readerKey,
    placement,
    slotKey: version.slot_key,
    catalogVersion: version.catalog_version,
  }
  const existing = readSmartAdQueue(options)
  const cachedAd = findNext(readerKey, placement, version)
  if (cachedAd) return cachedAd
  if (existing?.exhausted && !existing.next_cursor) return null

  const key = `${readerKey}:${placement}:${version.slot_key}:${version.catalog_version}`
  if ((emptyRetry.get(key) || 0) > Date.now()) return null
  if (!pending.has(key)) {
    const request = (async () => {
      const result = await selectSmartAds({
        placement,
        cursor: existing?.next_cursor || '0',
        queueIndex: existing?.queue_index || 0,
        interests: getSmartFreeUnlockInterests(),
        excludeStoryIds: getSmartAdReservedIds({
          readerKey,
          excludePlacement: placement,
          slotKey: version.slot_key,
          catalogVersion: version.catalog_version,
        }),
        signal,
      })
      if (result.slot_key !== version.slot_key ||
          Number(result.catalog_version) !== Number(version.catalog_version)) {
        throw new Error('Smart Ad selection version changed')
      }
      if (!Array.isArray(result.ads) || !result.ads.length) {
        emptyRetry.set(key, Date.now() + 30000)
        if (emptyRetry.size > 100) emptyRetry.delete(emptyRetry.keys().next().value)
        return null
      }
      return appendSmartAdSelection({
        readerKey,
        placement,
        response: { ...result, ads: result.ads.slice(0, 10) },
      })
    })().finally(() => {
      if (pending.get(key) === request) pending.delete(key)
    })
    pending.set(key, request)
  }
  const result = await pending.get(key)
  if (!result) return null
  return findNext(readerKey, placement, version)
}

export async function recordSmartPlacementImpression(advertisement) {
  const placement = assertPlacement(advertisement?.placement)
  const storyId = String(advertisement?.story_id || '').toLowerCase()
  const slotKey = String(advertisement?.slot_key || '')
  if (!UUID.test(storyId) || !slotKey) return false
  const readerKey = getSmartAdReaderKey()
  const key = `shadow_smart_impression_v1:${readerKey}:${placement}:${slotKey}:${storyId}`
  if (impressions.has(key)) return impressions.get(key)
  try {
    if (sessionStorage.getItem(key) === '1') return false
  } catch {}
  const request = recordSmartAdImpressions({
    placement,
    slotKey,
    storyIds: [storyId],
  }).then(() => {
    try { sessionStorage.setItem(key, '1') } catch {}
    return true
  }).catch((error) => {
    impressions.delete(key)
    throw error
  })
  impressions.set(key, request)
  if (impressions.size > 300) impressions.delete(impressions.keys().next().value)
  return request
}

export async function openSmartPlacementEpisodeOne(advertisement) {
  const placement = assertPlacement(advertisement?.placement)
  const storyId = String(advertisement?.story_id || '').toLowerCase()
  const slotKey = String(advertisement?.slot_key || '')
  if (!UUID.test(storyId) || !slotKey) throw new TypeError('Invalid Smart Ad destination')
  const result = await openSmartAdEpisodeOne({ placement, slotKey, storyId })
  const episodeId = String(result.first_episode_id || '').toLowerCase()
  const path = `/story/${storyId}/episode/${episodeId}`
  if (!UUID.test(episodeId) ||
      String(result.story_id || '').toLowerCase() !== storyId ||
      result.reader_path !== path) {
    throw new Error('Invalid Smart Ad Episode 1 response')
  }
  return path
}
