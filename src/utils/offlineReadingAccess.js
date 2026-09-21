const STORY_TYPES = new Set(['novel', 'chat_story', 'manga'])

export function getOfflineSaveOptions({ accountId, storyId, episodeId, storyType, response } = {}) {
  const identity = [accountId, storyId, episodeId].map((value) => String(value ?? '').trim())
  if (identity.some((value) => !value) || !STORY_TYPES.has(storyType)) {
    throw new Error('A valid account, story, episode and story type are required')
  }
  const [readerId, bookId, chapterId] = identity
  if (response?.ok !== true || response?.locked !== false ||
    String(response?.story?.id ?? '') !== bookId ||
    String(response?.episode?.id ?? '') !== chapterId ||
    (response.episode.story_id != null && String(response.episode.story_id) !== bookId)) {
    throw new Error('A verified, unlocked episode response is required')
  }
  const actualType = String(response.story.story_type || storyType).toLowerCase().replace(/-/g, '_')
  if (actualType !== storyType || response.story.is_adult === true || response.episode.is_adult === true) {
    throw new Error('This episode is not eligible for offline download')
  }
  const grant = response.cache_access
  const type = String(grant?.access_type || '').toLowerCase()
  const expiresAt = grant?.expires_at ?? null
  const hasExpiry = expiresAt !== null && expiresAt !== ''
  let access
  if (grant?.private_access === false && type === 'public' && !hasExpiry) {
    access = 'free'
  } else if (grant?.private_access === true && type === 'permanent' && !hasExpiry) {
    access = 'permanent'
  } else if (grant?.private_access === true && type === 'temporary' && hasExpiry &&
    Number.isFinite(Date.parse(expiresAt)) && Date.parse(expiresAt) > Date.now()) {
    access = 'temporary'
  } else {
    throw new Error('Offline access cannot be verified for this episode')
  }
  return { accountId: readerId, storyId: bookId, episodeId: chapterId, storyType, payload: response, access, expiresAt: access === 'temporary' ? expiresAt : null }
}
