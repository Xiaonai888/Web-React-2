import {
  deleteStoryMediaDraftRecord,
  loadStoryMediaDraftRecord,
  saveStoryMediaDraftRecord,
} from './storyMediaDraftDB'

const MAX_TOTAL_BYTES = 60 * 1024 * 1024
const pendingOperations = new Map()

export function storyMediaDraftKey({ userId, storyType, storyId = '' }) {
  const user = String(userId || '').trim()
  const type = String(storyType || '').trim()
  if (!user || !['novel', 'manga', 'chat_story'].includes(type)) {
    throw new Error('A signed-in account and valid story type are required')
  }
  return `${user}:story-media:${type}:${String(storyId || '').trim() || 'new'}`
}

function runInOrder(key, operation) {
  const id = String(key || '').trim()
  if (!id) return Promise.reject(new Error('Story media draft key is required'))
  const previous = pendingOperations.get(id) || Promise.resolve()
  const current = previous.catch(() => {}).then(operation)
  pendingOperations.set(id, current)
  void current.finally(() => {
    if (pendingOperations.get(id) === current) pendingOperations.delete(id)
  }).catch(() => {})
  return current
}

function validateBlob(value) {
  if (!value.size || !String(value.type || '').toLowerCase().startsWith('image/')) {
    throw new Error('The selected local image is invalid')
  }
  return { kind: 'blob', value }
}

async function storeAsset(value, cache) {
  if (!value) return null
  if (typeof Blob !== 'undefined' && value instanceof Blob) return validateBlob(value)
  if (typeof value !== 'string') throw new Error('Unsupported story image data')
  const source = value.trim()
  if (!source) return null
  if (/^https?:\/\//i.test(source)) return { kind: 'url', value: source }
  if (!/^(blob:|data:image\/)/i.test(source)) throw new Error('Unsupported story image URL')
  if (!cache.has(source)) {
    cache.set(source, (async () => {
      let response
      try {
        response = await fetch(source)
      } catch {
        throw new Error('Could not read the selected image for local backup')
      }
      if (!response.ok) throw new Error('Could not read the selected image for local backup')
      return validateBlob(await response.blob())
    })())
  }
  return cache.get(source)
}

function countBytes(item) {
  return item?.kind === 'blob' ? item.value.size : 0
}

async function savePair(pair, cache) {
  return {
    original: await storeAsset(pair?.original, cache),
    preview: await storeAsset(pair?.preview, cache),
  }
}

export function saveStoryMediaSnapshot(key, media) {
  return runInOrder(key, async () => {
    const cache = new Map()
    const cover = await savePair(media?.cover, cache)
    const landscape = await savePair(media?.landscape, cache)
    const slides = []
    const providedSlides = Array.isArray(media?.slides) ? media.slides : []
    for (const slide of providedSlides) {
      if (!slide || typeof slide !== 'object') throw new Error('Invalid story slide')
      slides.push({
        id: slide.id,
        original: await storeAsset(slide.original, cache),
        cropped: await storeAsset(slide.cropped, cache),
        active: Boolean(slide.active),
        existing: Boolean(slide.existing),
        changed: Boolean(slide.changed),
      })
    }
    const bytes = countBytes(cover.original) + countBytes(cover.preview) +
      countBytes(landscape.original) + countBytes(landscape.preview) +
      slides.reduce((total, slide) => total + countBytes(slide.original) + countBytes(slide.cropped), 0)
    if (bytes > MAX_TOTAL_BYTES) {
      throw new Error('Story images exceed the 60 MB local draft limit')
    }
    return saveStoryMediaDraftRecord(key, { cover, landscape, slides })
  })
}

function restoreAsset(asset, urls) {
  if (!asset) return ''
  if (asset.kind === 'url') {
    return /^https?:\/\//i.test(String(asset.value || '')) ? asset.value : ''
  }
  if (asset.kind !== 'blob' || !(asset.value instanceof Blob) || !asset.value.size ||
    !String(asset.value.type || '').toLowerCase().startsWith('image/')) return ''
  const url = URL.createObjectURL(asset.value)
  urls.push(url)
  return url
}

export async function restoreStoryMediaSnapshot(key) {
  const id = String(key || '').trim()
  if (!id) return null
  await pendingOperations.get(id)?.catch(() => {})
  const snapshot = await loadStoryMediaDraftRecord(id)
  if (!snapshot) return null
  const urls = []
  try {
    const media = {
      cover: {
        original: restoreAsset(snapshot.cover?.original, urls),
        preview: restoreAsset(snapshot.cover?.preview, urls),
      },
      landscape: {
        original: restoreAsset(snapshot.landscape?.original, urls),
        preview: restoreAsset(snapshot.landscape?.preview, urls),
      },
      slides: (Array.isArray(snapshot.slides) ? snapshot.slides : []).filter(Boolean).map((slide) => ({
        id: slide.id,
        original: restoreAsset(slide.original, urls),
        cropped: restoreAsset(slide.cropped, urls),
        active: slide.active,
        existing: slide.existing,
        changed: slide.changed,
      })),
    }
    let revoked = false
    return {
      media,
      updatedAt: snapshot.updatedAt,
      revoke: () => {
        if (revoked) return
        revoked = true
        urls.forEach((url) => URL.revokeObjectURL(url))
      },
    }
  } catch (error) {
    urls.forEach((url) => URL.revokeObjectURL(url))
    throw error
  }
}

export function deleteStoryMediaSnapshot(key) {
  return runInOrder(key, () => deleteStoryMediaDraftRecord(key))
}
