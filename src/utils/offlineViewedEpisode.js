import { getOfflineSaveOptions } from './offlineReadingAccess'
import { getReaderEpisodeCacheScope, loadReaderEpisodeCache, saveReaderEpisodeCache } from './readerEpisodeCache'

function activeAccountId() {
  const storage = sessionStorage.getItem('shadow_reader_token') ? sessionStorage : localStorage
  if (!storage.getItem('shadow_reader_token')) return ''
  try {
    const user = JSON.parse(storage.getItem('shadow_reader_user') || 'null')
    return String(user?.id || user?.user_id || '').trim()
  } catch {
    return ''
  }
}

function validateEpisode(response, storyId, episodeId, storyType) {
  const accountId = activeAccountId()
  if (!accountId) return null
  try {
    return getOfflineSaveOptions({ accountId, storyId, episodeId, storyType, response })
  } catch {
    return null
  }
}

export async function rememberViewedEpisode({ storyId, episodeId, storyType, response } = {}) {
  const options = validateEpisode(response, storyId, episodeId, storyType)
  if (!options) return false
  const privateAccess = options.access !== 'free'
  await saveReaderEpisodeCache({
    storyId, episodeId, storyType,
    data: response,
    updatedAt: response.episode?.updated_at || null,
    privateAccess,
    scope: getReaderEpisodeCacheScope({ privateAccess }),
    accessExpiresAt: options.expiresAt,
  })
  return true
}

export async function loadViewedEpisodeOffline({ storyId, episodeId, storyType } = {}) {
  if (!activeAccountId() || !['novel', 'chat_story', 'manga'].includes(storyType)) return null
  for (const privateAccess of [true, false]) {
    const response = await loadReaderEpisodeCache({
      storyId, episodeId, storyType, privateAccess,
      scope: getReaderEpisodeCacheScope({ privateAccess }),
    })
    if (!response) continue
    const options = validateEpisode(response, storyId, episodeId, storyType)
    if (!options || (options.access !== 'free') !== privateAccess) continue
    return { payload: response, access: options.access, expiresAt: options.expiresAt }
  }
  return null
}
