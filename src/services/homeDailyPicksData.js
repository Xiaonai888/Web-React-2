import {
  addStoryLanguageParam,
  getStoryLanguageId,
} from '../utils/storyLanguage'
import {
  getHomeCacheKey,
  loadHomeCache,
  saveHomeCache,
} from '../utils/homeDataCache'

const CACHE_TTL_MS = 6 * 60 * 60 * 1000
const VERSION_MEMORY_TTL_MS = 60 * 1000

let storiesVersionMemory = {
  version: null,
  checkedAt: 0,
}

let storiesVersionRequest = null

async function getStoriesVersion(apiBaseUrl) {
  const now = Date.now()

  if (
    Number.isFinite(storiesVersionMemory.version) &&
    now - storiesVersionMemory.checkedAt < VERSION_MEMORY_TTL_MS
  ) {
    return storiesVersionMemory.version
  }

  if (storiesVersionRequest) {
    return storiesVersionRequest
  }

  storiesVersionRequest = (async () => {
    const response = await fetch(
      `${apiBaseUrl}/api/public/content-versions?keys=stories`,
      { cache: 'no-store' }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(
        data.message || 'Failed to load stories content version'
      )
    }

    const version = Number(data?.versions?.stories?.version)

    if (!Number.isFinite(version)) {
      return null
    }

    storiesVersionMemory = {
      version,
      checkedAt: Date.now(),
    }

    return version
  })()

  try {
    return await storiesVersionRequest
  } finally {
    storiesVersionRequest = null
  }
}

function normalizeStoryType(value) {
  return String(value || '').trim().toLowerCase()
}

function filterStoryType(stories, storyType) {
  if (!storyType) return stories

  return stories.filter(
    (story) =>
      String(story?.story_type || '')
        .trim()
        .toLowerCase() === storyType
  )
}

async function fetchFreshSource({
  apiBaseUrl,
  storyType,
}) {
  const storyTypeQuery = storyType
    ? `&story_type=${encodeURIComponent(storyType)}`
    : ''

  const [discoverResponse, updatedResponse] =
    await Promise.all([
      fetch(
        addStoryLanguageParam(
          `${apiBaseUrl}/api/public/stories?limit=24&sort=discover_more${storyTypeQuery}`
        )
      ),
      fetch(
        addStoryLanguageParam(
          `${apiBaseUrl}/api/public/stories?limit=24&sort=episode_updated${storyTypeQuery}`
        )
      ),
    ])

  const [discoverData, updatedData] =
    await Promise.all([
      discoverResponse.json().catch(() => ({})),
      updatedResponse.json().catch(() => ({})),
    ])

  if (!discoverResponse.ok || discoverData.ok === false) {
    throw new Error(
      discoverData.message ||
        'Failed to load discover daily picks'
    )
  }

  if (!updatedResponse.ok || updatedData.ok === false) {
    throw new Error(
      updatedData.message ||
        'Failed to load updated daily picks'
    )
  }

  return filterStoryType(
    [
      ...(discoverData.stories || []),
      ...(updatedData.stories || []),
    ],
    storyType
  )
}

export async function loadHomeDailyPicksSource({
  apiBaseUrl,
  storyType = '',
  onCachedStories,
}) {
  const normalizedStoryType = normalizeStoryType(storyType)
  const cacheKey = getHomeCacheKey({
    section: 'daily-picks',
    language: getStoryLanguageId(),
    params: {
      story_type: normalizedStoryType || 'all',
    },
  })

  const cached = await loadHomeCache(cacheKey, {
    maxAgeMs: CACHE_TTL_MS,
    allowExpired: true,
  })
  const cachedStories = Array.isArray(cached?.data)
    ? cached.data
    : []

  if (cachedStories.length && onCachedStories) {
    onCachedStories(cachedStories)
  }

  let currentVersion = null

  try {
    currentVersion = await getStoriesVersion(apiBaseUrl)
  } catch {
    if (cachedStories.length && !cached?.isExpired) {
      return cachedStories
    }
  }

  const cacheVersion = Number(cached?.version)
  const sameVersion =
    Number.isFinite(currentVersion) &&
    Number.isFinite(cacheVersion) &&
    currentVersion === cacheVersion

  if (
    cachedStories.length &&
    !cached?.isExpired &&
    sameVersion
  ) {
    return cachedStories
  }

  if (
    cachedStories.length &&
    !cached?.isExpired &&
    currentVersion === null
  ) {
    return cachedStories
  }

  try {
    const freshStories = await fetchFreshSource({
      apiBaseUrl,
      storyType: normalizedStoryType,
    })

    await saveHomeCache(cacheKey, freshStories, {
      version: currentVersion ?? 0,
      maxAgeMs: CACHE_TTL_MS,
    })

    return freshStories
  } catch (error) {
    if (cachedStories.length) {
      return cachedStories
    }

    throw error
  }
}
