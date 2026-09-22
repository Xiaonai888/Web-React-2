import { getOfflineReaderAccountId, openOfflineReaderEpisode } from './offlineReaderContent'
import { loadViewedEpisodeOffline } from './offlineViewedEpisode'

const TYPES = ['novel', 'chat_story']

function hasCompleteText(payload, storyType) {
  const content = payload?.episode?.content
  if (payload?.ok !== true || payload?.locked !== false ||
    payload?.story?.is_adult === true || payload?.episode?.is_adult === true) return false
  if (storyType === 'novel') {
    return typeof content === 'string' && content.trim().length > 0 &&
      !/<(?:img|video|audio|iframe|object)\b/i.test(content)
  }
  try {
    const chat = typeof content === 'string' ? JSON.parse(content) : content
    return chat?.format === 'shadow_chat_story_v1' &&
      Array.isArray(chat.messages) && chat.messages.length > 0 &&
      !(chat.characters || []).some((character) => character?.avatar_url) &&
      !chat.messages.some((message) => message?.type === 'image' || message?.image_url || message?.imageUrl)
  } catch {
    return false
  }
}

function toOfflineResult(payload, release = () => {}, source = 'viewed') {
  return {
    payload,
    episodes: [{ ...payload.episode, is_locked: false }],
    source,
    release,
  }
}

export async function loadOfflineReaderFallback({ storyId, episodeId } = {}) {
  if (!getOfflineReaderAccountId() || !storyId || !episodeId) return null
  const downloaded = await openOfflineReaderEpisode({ storyId, episodeId }).catch(() => null)
  if (downloaded) {
    if (downloaded.payload?.ok === true && downloaded.payload?.locked === false &&
      downloaded.payload?.episode && downloaded.payload?.story) {
      return toOfflineResult(downloaded.payload, downloaded.release, 'downloaded')
    }
    downloaded.release()
  }
  for (const storyType of TYPES) {
    const viewed = await loadViewedEpisodeOffline({ storyId, episodeId, storyType }).catch(() => null)
    if (viewed && hasCompleteText(viewed.payload, storyType)) {
      return toOfflineResult(viewed.payload)
    }
  }
  return null
}
