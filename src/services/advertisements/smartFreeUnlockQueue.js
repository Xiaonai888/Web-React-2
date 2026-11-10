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
  getSmartFreeUnlockInterests,
  toSmartFreeUnlockAdvertisement,
} from './smartFreeUnlockPresentation'

const PLACEMENT = 'freeUnlock'
const EMPTY_RETRY_MS = 60000
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

async function prepareQueue(readerKey, version, signal) {
  const saved = readQueue(readerKey, version)
  if (saved?.batches?.some((batch) => batch.length)) return saved
  const key = `${readerKey}:${version.slot_key}:${version.catalog_version}`
  if (Number(emptySelections.get(key) || 0) > Date.now()) return null
  if (pendingSelections.has(key)) return pendingSelections.get(key)

  const pending = (async () => {
    const reserved = getSmartAdReservedIds({
      readerKey,
      placement: PLACEMENT,
      excludePlacement: PLACEMENT,
      slotKey: version.slot_key,
      catalogVersion: version.catalog_version,
    })
    const result = await selectSmartAds({
      placement: PLACEMENT,
      cursor: '0',
      queueIndex: 0,
      interests: getSmartFreeUnlockInterests(),
      excludeStoryIds: reserved,
      signal,
    })
    if (result.slot_key !== version.slot_key ||
        Number(result.catalog_version) !== Number(version.catalog_version)) {
      const error = new Error('Smart Ad slot or catalog changed during selection')
      error.code = 'SMART_AD_VERSION_CHANGED'
      throw error
    }
    const ads = Array.isArray(result.ads) ? result.ads.slice(0, 10) : []
    if (!ads.length) {
      emptySelections.set(key, Date.now() + EMPTY_RETRY_MS)
      return null
    }
    return appendSmartAdSelection({
      readerKey,
      placement: PLACEMENT,
      response: { ...result, ads },
    })
  })().finally(() => {
    if (pendingSelections.get(key) === pending) pendingSelections.delete(key)
  })

  pendingSelections.set(key, pending)
  return pending
}

export async function takeSmartFreeUnlockAd({ currentStoryId = '', signal } = {}) {
  const version = await getSmartAdVersion({ signal })
  if (!version?.slot_key || !Number.isSafeInteger(Number(version.catalog_version))) {
    throw new Error('Invalid Smart Ad version')
  }
  const readerKey = getSmartAdReaderKey()
  const queue = await prepareQueue(readerKey, version, signal)
  const ads = queue?.batches?.flat() || []
  if (!ads.length) return null

  const currentId = String(currentStoryId || '').toLowerCase()
  for (let i = 0; i < ads.length; i += 1) {
    const story = nextSmartAdFromQueue({
      readerKey,
      placement: PLACEMENT,
      slotKey: version.slot_key,
      catalogVersion: version.catalog_version,
    })
    if (!story || String(story.story_id || '').toLowerCase() === currentId) continue
    const advertisement = toSmartFreeUnlockAdvertisement(story, version.slot_key)
    if (!advertisement) continue
    return {
      advertisement,
      story,
      slotKey: version.slot_key,
      catalogVersion: Number(version.catalog_version),
      queueSize: ads.length,
    }
  }
  return null
}
