import {
  deleteStoryMediaDraftRecord,
  loadStoryMediaDraftRecord,
  saveStoryMediaDraftRecord,
} from './storyMediaDraftDB'

const MAX_TOTAL_BYTES = 60 * 1024 * 1024

export function storyMediaDraftKey({ userId, storyType, storyId = '' }) {
  const user = String(userId || '').trim()
  const type = String(storyType || '').trim()
  if (!user || !['novel', 'manga', 'chat_story'].includes(type)) {
    throw new Error('A signed-in account and valid story type are required')
  }
  return `${user}:story-media:${type}:${String(storyId || '').trim() || 'new'}`
}

async function storeAsset(value) {
  if (!value) return null
  if (typeof Blob !== 'undefined' && value instanceof Blob) {
    return { kind: 'blob', value }
  }
  if (typeof value !== 'string') throw new Error('Unsupported story image data')
  const source = value.trim()
  if (!source) return null
  if (/^https?:\/\//i.test(source)) return { kind: 'url', value: source }
  if (!/^(blob:|data:image\/)/i.test(source)) {
    throw new Error('Unsupported story image URL')
  }
  const response = await fetch(source)
  if (!response.ok) throw new Error('Could not read the selected image for local backup')
  const blob = await response.blob()
  if (!blob.size || !blob.type.startsWith('image/')) {
    throw new Error('The selected local image is invalid')
  }
  return { kind: 'blob', value: blob }
}

function countBytes(item) {
  return item?.kind === 'blob' ? item.value.size : 0
}

async function savePair(pair) {
  return {
    original: await storeAsset(pair?.original),
    preview: await storeAsset(pair?.preview),
  }
}

export async function saveStoryMediaSnapshot(key, media) {
  const cover = await savePair(media?.cover)
  const landscape = await savePair(media?.landscape)
  const slides = []
  for (const slide of media?.slides || []) {
    slides.push({
      id: slide.id,
      original: await storeAsset(slide.original),
      cropped: await storeAsset(slide.cropped),
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
  return saveStoryMediaDraftRecord(key, {
    cover,
    landscape,
    slides,
  })
}

function restoreAsset(asset, urls) {
  if (!asset) return ''
  if (asset.kind === 'url') return asset.value
  if (asset.kind !== 'blob' || !(asset.value instanceof Blob)) return ''
  const url = URL.createObjectURL(asset.value)
  urls.push(url)
  return url
}

export async function restoreStoryMediaSnapshot(key) {
  const snapshot = await loadStoryMediaDraftRecord(key)
  if (!snapshot) return null
  const urls = []
  const media = {
    cover: {
      original: restoreAsset(snapshot.cover?.original, urls),
      preview: restoreAsset(snapshot.cover?.preview, urls),
    },
    landscape: {
      original: restoreAsset(snapshot.landscape?.original, urls),
      preview: restoreAsset(snapshot.landscape?.preview, urls),
    },
    slides: (snapshot.slides || []).map((slide) => ({
      id: slide.id,
      original: restoreAsset(slide.original, urls),
      cropped: restoreAsset(slide.cropped, urls),
      active: slide.active,
      existing: slide.existing,
      changed: slide.changed,
    })),
  }
  return {
    media,
    updatedAt: snapshot.updatedAt,
    revoke: () => urls.forEach((url) => URL.revokeObjectURL(url)),
  }
}

export async function deleteStoryMediaSnapshot(key) {
  return deleteStoryMediaDraftRecord(key)
}
