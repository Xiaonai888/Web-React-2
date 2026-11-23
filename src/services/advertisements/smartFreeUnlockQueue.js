import {
  getSmartAdReaderKey,
  getSmartAdVersion,
  selectSmartAds,
} from '../smartAdClient'
import {
  appendSmartAdSelection,
  getSmartAdReservedIds,
  nextSmartAdFromQueue,
  readSmartAdQueue,
} from '../smartAdQueue'
import {
  getCachedSmartAdReadingProgress,
  smartAdCachedStoryPriority,
} from '../smartAdReadingProgressGuard'
import {
  getSmartFreeUnlockInterests,
  toSmartFreeUnlockAdvertisement,
} from './smartFreeUnlockPresentation'

import { getStoryLanguageId } from '../../utils/storyLanguage'

const PLACEMENT = 'freeUnlock'
const EMPTY_RETRY_MS = 60000
const MAX_SELECTION_ATTEMPTS = 2
const MAX_EXCLUSIONS = 3000
const pendingSelections = new Map()
const emptySelections = new Map()

function readQueue(readerKey, version) {
  return readSmartAdQueue({
    readerKey,
    placement: PLACEMENT,
    slotKey: version.slot_key,
    catalogVersion: version.catalog_version,
  })
}

function hasNextUnplayedAd(queue) {
  if (!queue) return false
  const total = queue.batches.flat().length
  return total > 0 && Number(queue.position || 0) < total
}

function getQueueExclusions(readerKey, version, queue) {
  const queued = (queue?.batches || []).flat().map((item) => String(item?.story_id || '').toLowerCase()).filter(Boolean)
  const otherPlacements = getSmartAdReservedIds({
    readerKey,
    placement: PLACEMENT,
    excludePlacement: PLACEMENT,
    slotKey: version.slot_key,
    catalogVersion: version.catalog_version,
  })
  return [...new Set([...queued, ...otherPlacements])].slice(0, MAX_EXCLUSIONS)
}

async function prepareQueue(readerKey, version, signal) {
  const language = getStoryLanguageId()
  const saved = readQueue(readerKey, version)
  if (hasNextUnplayedAd(saved)) return saved
  if (saved?.exhausted && saved.batches.flat().length) return saved
  const key = `${readerKey}:${version.slot_key}:${version.catalog_version}:${language}`
  if (Number(emptySelections.get(key) || 0) > Date.now()) return null
  if (pendingSelections.has(key)) return pendingSelections.get(key)

  const pending = (async () => {
    let queue = saved
    let cursor = String(queue?.next_cursor ?? '0')

    for (let attempt = 0; attempt < MAX_SELECTION_ATTEMPTS; attempt += 1) {
      const result = await selectSmartAds({
        placement: PLACEMENT,
        cursor,
        queueIndex: queue?.queue_index || 0,
        interests: getSmartFreeUnlockInterests(),
        excludeStoryIds: getQueueExclusions(readerKey, version, queue),
        signal,
      })
      if (result.slot_key !== version.slot_key ||
          Number(result.catalog_version) !== Number(version.catalog_version)) {
        const error = new Error('Smart Ad slot or catalog changed during selection')
        error.code = 'SMART_AD_VERSION_CHANGED'
        throw error
      }

      const ads = Array.isArray(result.ads) ? result.ads.slice(0, 10) : []
      queue = appendSmartAdSelection({
        readerKey,
        placement: PLACEMENT,
        response: { ...result, ads },
      })
      if (ads.length) {
        emptySelections.delete(key)
        return queue
      }
      if (result.exhausted || result.next_cursor == null || String(result.next_cursor) === cursor) break
      cursor = String(result.next_cursor)
    }

    if (queue?.exhausted && queue.batches.flat().length) return queue
    emptySelections.set(key, Date.now() + EMPTY_RETRY_MS)
    return null
  })().finally(() => {
    if (pendingSelections.get(key) === pending) pendingSelections.delete(key)
  })

  pendingSelections.set(key, pending)
  return pending
}

export async function takeSmartFreeUnlockAd({ currentStoryId = '', signal } = {}) {
  const language = getStoryLanguageId()
  const version = await getSmartAdVersion({ signal })
  if (!version?.slot_key || !Number.isSafeInteger(Number(version.catalog_version))) {
    throw new Error('Invalid Smart Ad version')
  }
  if (getStoryLanguageId() !== language) return null
  const readerKey = getSmartAdReaderKey()
  const [queue, progressRows] = await Promise.all([
    prepareQueue(readerKey, version, signal),
    getCachedSmartAdReadingProgress(),
  ])
  if (getStoryLanguageId() !== language || getSmartAdReaderKey() !== readerKey) return null
  const ads = queue?.batches?.flat() || []
  if (!ads.length) return null

  const currentId = String(currentStoryId || '').toLowerCase()
  let replay = null
  for (let i = 0; i < ads.length; i += 1) {
    const story = nextSmartAdFromQueue({
      readerKey,
      placement: PLACEMENT,
      slotKey: version.slot_key,
      catalogVersion: version.catalog_version,
    })
    if (!story || String(story.story_id || '').toLowerCase() === currentId) continue
    const priority = smartAdCachedStoryPriority(story, progressRows)
    if (priority === 2) continue
    const advertisement = toSmartFreeUnlockAdvertisement(story, version.slot_key)
    if (!advertisement) continue
    const result = {
      advertisement,
      story,
      slotKey: version.slot_key,
      catalogVersion: Number(version.catalog_version),
      queueSize: ads.length,
    }
    if (priority === 0) return result
    if (!replay) replay = result
  }
  return replay
}
