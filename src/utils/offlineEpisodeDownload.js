import { getOfflineSaveOptions } from './offlineReadingAccess'
import { saveOfflineEpisode } from './offlineReadingStorage'

const API_BASE_URL = 'https://shadow-backend-kucw.onrender.com'

function collectImageUrls(payload, storyType) {
  const episode = payload.episode
  const urls = []
  if (storyType === 'manga') {
    const pages = episode.pages
    if (!Array.isArray(pages) || !pages.length || Number(episode.page_count || 0) > pages.length) {
      throw new Error('Manga pages are incomplete')
    }
    for (const page of pages) {
      const parts = Array.isArray(page.parts) && page.parts.length ? page.parts : [page]
      for (const part of parts) {
        if (!part?.image_url) throw new Error('A manga image is missing')
        urls.push(part.image_url)
      }
    }
  } else if (storyType === 'chat_story') {
    let content
    try {
      content = typeof episode.content === 'string' ? JSON.parse(episode.content) : episode.content
    } catch {
      throw new Error('Invalid chat story content')
    }
    if (content?.format !== 'shadow_chat_story_v1' || !Array.isArray(content.messages)) {
      throw new Error('Incomplete chat story content')
    }
    for (const character of content.characters || []) {
      if (character?.avatar_url) urls.push(character.avatar_url)
    }
    for (const message of content.messages) {
      if (message?.type === 'image') {
        const url = message.image_url || message.imageUrl
        if (!url) throw new Error('A chat story image is missing')
        urls.push(url)
      }
    }
  } else {
    const document = new DOMParser().parseFromString(String(episode.content || ''), 'text/html')
    for (const image of document.querySelectorAll('img')) {
      if (!image.getAttribute('src')) throw new Error('An episode image is missing')
      urls.push(image.getAttribute('src'))
    }
  }
  return [...new Set(urls.map((value) => {
    const url = new URL(String(value), window.location.origin)
    if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Unsupported episode image URL')
    return url.href
  }))]
}

export async function downloadOfflineEpisode({ accountId, storyId, episodeId, signal, onProgress } = {}) {
  const token = localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token')
  if (!token) throw new Error('Please sign in before downloading an episode')
  if (!navigator.onLine) throw new Error('An internet connection is required to download')
  const story = String(storyId ?? '').trim()
  const episode = String(episodeId ?? '').trim()
  if (!story || !episode) throw new Error('Story and episode IDs are required')
  const url = `${API_BASE_URL}/api/public/stories/${encodeURIComponent(story)}/episodes/${encodeURIComponent(episode)}`
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store', signal })
  if (!response.ok) throw new Error(response.status === 423 ? 'Unlock this episode before downloading' : 'Unable to load this episode')
  const payload = await response.json()
  const storyType = String(payload?.story?.story_type || '').toLowerCase().replace(/-/g, '_')
  const options = getOfflineSaveOptions({ accountId, storyId: story, episodeId: episode, storyType, response: payload })
  const imageUrls = collectImageUrls(payload, storyType)
  const assets = []
  onProgress?.({ completed: 0, total: imageUrls.length })
  for (const imageUrl of imageUrls) {
    const imageResponse = await fetch(imageUrl, { cache: 'no-store', signal })
    if (!imageResponse.ok || imageResponse.type === 'opaque') throw new Error('Unable to download every episode image')
    const blob = await imageResponse.blob()
    if (!blob.size) throw new Error('An episode image is empty')
    assets.push({ url: imageUrl, blob })
    onProgress?.({ completed: assets.length, total: imageUrls.length })
  }
  if (signal?.aborted) throw new DOMException('Download cancelled', 'AbortError')
  if ((localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token')) !== token) {
    throw new Error('The reader account changed during download')
  }
  return saveOfflineEpisode({ ...options, assets })
}
