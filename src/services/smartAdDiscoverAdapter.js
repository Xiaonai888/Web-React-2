import {
  getSmartAdReaderKey,
  getSmartAdVersion,
  openSmartAdEpisodeOne,
  selectSmartAds,
  watchSmartAdVersion,
} from './smartAdClient'
import { appendSmartAdSelection, getSmartAdReservedIds } from './smartAdQueue'
import { filterDiscoverSmartAds, validateDiscoverSmartAdVersion } from './smartAdDiscoverGuard'
import { flushDiscoverSmartAdImpressions, queueDiscoverSmartAdImpression } from './smartAdDiscoverImpressions'

const MAX_EXCLUSIONS = 3000
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function staleVersionError() {
  const error = new Error('Smart Ad catalog or rotation has changed')
  error.code = 'SMART_AD_VERSION_CHANGED'
  return error
}

function cleanInterests(value) {
  const result = {}
  if (!value || typeof value !== 'object' || Array.isArray(value)) return result
  for (const [name, amount] of Object.entries(value).slice(0, 24)) {
    const key = name.trim().toLowerCase().slice(0, 60)
    const number = Number(amount)
    if (key && Number.isFinite(number)) result[key] = Math.min(40, Math.max(0, number))
  }
  return result
}

export async function requestDiscoverSmartAdBatch({
  queue,
  slotKey,
  catalogVersion,
  visitKey = '',
  interests = {},
  hiddenStoryIds = [],
  cooldownStoryIds = [],
} = {}) {
  if (!queue || !Array.isArray(queue.batches)) throw new TypeError('Invalid Discover Smart Ad queue')
  const current = await getSmartAdVersion()
  if (!validateDiscoverSmartAdVersion(current, { expectedSlot: slotKey, expectedVersion: catalogVersion })) {
    throw staleVersionError()
  }
  const readerKey = getSmartAdReaderKey()
  const queuedIds = queue.batches.flat().map((item) => String(item?.story_id || '').toLowerCase())
  const otherIds = getSmartAdReservedIds({
    readerKey, placement: 'discover', excludePlacement: 'discover',
    slotKey, catalogVersion,
  })
  const excluded = [...new Set([...queuedIds, ...otherIds, ...hiddenStoryIds]
    .map((id) => String(id || '').toLowerCase()).filter((id) => UUID.test(id)))].slice(0, MAX_EXCLUSIONS)
  if (queue.atEnd) {
    return { batch: [], cursor: String(queue.cursor || ''), atEnd: true,
      catalogVersion: Number(current.catalog_version), slotKey: current.slot_key }
  }
  const cursor = String(queue.cursor || '0')
  const result = await selectSmartAds({
    placement: 'discover',
    cursor,
    queueIndex: Math.max(0, Math.min(10000, queue.batches.length)),
    interests: cleanInterests(interests),
    excludeStoryIds: excluded,
    cooldownStoryIds: Array.isArray(cooldownStoryIds)
      ? cooldownStoryIds.slice(0, MAX_EXCLUSIONS) : [],
  })
  if (!validateDiscoverSmartAdVersion(result, { expectedSlot: slotKey, expectedVersion: catalogVersion })) {
    throw staleVersionError()
  }
  const batch = filterDiscoverSmartAds(result.ads, { catalogVersion, excludeStoryIds: excluded })
  if (batch.length) {
    appendSmartAdSelection({
      readerKey, placement: 'discover',
      response: { ...result, ads: batch }, visitKey,
    })
  }
  return {
    batch,
    cursor: result.next_cursor === null ? '' : String(result.next_cursor || '0'),
    atEnd: Boolean(result.exhausted),
    catalogVersion: Number(result.catalog_version),
    slotKey: result.slot_key,
  }
}

export function trackDiscoverSmartAdImpression(slotKey, storyId) {
  return queueDiscoverSmartAdImpression(slotKey, storyId)
}

export { flushDiscoverSmartAdImpressions, watchSmartAdVersion }

export async function openDiscoverSmartAd(storyId, slotKey) {
  const id = String(storyId || '').toLowerCase()
  if (!UUID.test(id)) throw new TypeError('Invalid Smart Ad story ID')
  const result = await openSmartAdEpisodeOne({ placement: 'discover', slotKey, storyId: id })
  const episodeId = String(result.first_episode_id || '').toLowerCase()
  if (String(result.story_id || '').toLowerCase() !== id || !UUID.test(episodeId)) {
    throw new Error('Invalid first episode response')
  }
  const expected = `/story/${id}/episode/${episodeId}`
  if (result.reader_path !== expected) throw new Error('Invalid Smart Ad reader path')
  return expected
}
