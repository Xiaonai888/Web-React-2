import { loadOfflineEpisode } from './offlineReadingStorage'

export function getOfflineReaderAccountId() {
  const storage = localStorage.getItem('shadow_reader_token') ? localStorage : sessionStorage
  if (!storage.getItem('shadow_reader_token')) return ''
  try {
    const user = JSON.parse(storage.getItem('shadow_reader_user') || 'null')
    return String(user?.id || user?.user_id || '').trim()
  } catch {
    return ''
  }
}

function mapStoredImage(value, imageUrls) {
  if (!value) return value
  const url = new URL(String(value), window.location.origin).href
  const offlineUrl = imageUrls.get(url)
  if (!offlineUrl) throw new Error('An offline episode image is missing')
  return offlineUrl
}

function restoreEpisodeImages(payload, storyType, imageUrls) {
  const episode = payload.episode
  if (storyType === 'manga') {
    if (!Array.isArray(episode.pages) || !episode.pages.length) throw new Error('Manga pages are missing')
    for (const page of episode.pages) {
      if (Array.isArray(page.parts) && page.parts.length) {
        for (const part of page.parts) part.image_url = mapStoredImage(part.image_url, imageUrls)
      } else {
        page.image_url = mapStoredImage(page.image_url, imageUrls)
      }
    }
  } else if (storyType === 'chat_story') {
    const content = typeof episode.content === 'string' ? JSON.parse(episode.content) : episode.content
    if (content?.format !== 'shadow_chat_story_v1' || !Array.isArray(content.messages)) {
      throw new Error('Offline chat story content is incomplete')
    }
    for (const character of content.characters || []) {
      if (character.avatar_url) character.avatar_url = mapStoredImage(character.avatar_url, imageUrls)
    }
    for (const message of content.messages) {
      if (message.type !== 'image') continue
      const url = message.image_url || message.imageUrl
      message.image_url = mapStoredImage(url, imageUrls)
      message.imageUrl = message.image_url
    }
    episode.content = JSON.stringify(content)
  } else if (/<img\b/i.test(String(episode.content || ''))) {
    const document = new DOMParser().parseFromString(String(episode.content), 'text/html')
    for (const image of document.body.querySelectorAll('img')) {
      image.setAttribute('src', mapStoredImage(image.getAttribute('src'), imageUrls))
      image.removeAttribute('srcset')
    }
    episode.content = document.body.innerHTML
  }
}

export async function openOfflineReaderEpisode({ storyId, episodeId } = {}) {
  const accountId = getOfflineReaderAccountId()
  if (!accountId) throw new Error('Sign in to the account that downloaded this episode')
  const record = await loadOfflineEpisode({ accountId, storyId, episodeId })
  if (!record) return null
  const releaseUrls = []
  try {
    const images = new Map()
    if (!Array.isArray(record.assets) || record.assets.length !== record.assetCount) {
      throw new Error('Offline episode media is incomplete')
    }
    for (const asset of record.assets) {
      if (!asset?.url || !(asset.blob instanceof Blob) || !asset.blob.size) {
        throw new Error('Offline episode media is damaged')
      }
      const url = URL.createObjectURL(asset.blob)
      releaseUrls.push(url)
      images.set(new URL(asset.url, window.location.origin).href, url)
    }
    const payload = JSON.parse(JSON.stringify(record.payload))
    restoreEpisodeImages(payload, record.storyType, images)
    if (record.expiresAt != null && Date.now() >= record.expiresAt) {
      throw new Error('Offline access to this episode has expired')
    }
    return {
      payload,
      storyType: record.storyType,
      access: record.access,
      expiresAt: record.expiresAt,
      release: () => releaseUrls.splice(0).forEach((url) => URL.revokeObjectURL(url)),
    }
  } catch (error) {
    releaseUrls.forEach((url) => URL.revokeObjectURL(url))
    throw error
  }
}
