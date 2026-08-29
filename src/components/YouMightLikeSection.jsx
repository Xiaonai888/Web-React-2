import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { trackSectionQualifiedView } from '../services/storySectionRankTracking'
import {
  addStoryLanguageParam,
  getStoryLanguageId,
} from '../utils/storyLanguage'
import {
  getHomeCacheKey,
  loadHomeCache,
  saveHomeCache,
} from '../utils/homeDataCache'

const API_BASE_URL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const YOU_MIGHT_LIKE_CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000
const YOU_MIGHT_LIKE_ROTATION_MS = 60 * 60 * 1000
const YOU_MIGHT_LIKE_POOL_SIZE = 72
const YOU_MIGHT_LIKE_DISPLAY_SIZE = 12

function getFallbackCover(index = 0) {
  return `/assets/YouMightLike/YouMightLike ${(index % 6) + 1}.jpg`
}

function getFirstDifferentTag(mainGenre, tags = []) {
  const genre = String(mainGenre || '').trim().toLowerCase()
  const normalizedTags = Array.isArray(tags) ? tags : []

  return (
    normalizedTags
      .map((tag) => String(tag || '').trim())
      .find((tag) => tag && tag.toLowerCase() !== genre) || ''
  )
}

function getTimestamp(value) {
  const time = value ? new Date(value).getTime() : 0
  return Number.isFinite(time) ? time : 0
}

function hashSeed(value) {
  const text = String(value || '')
  let hash = 2166136261

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

function createSeededRandom(seedValue) {
  let seed = hashSeed(seedValue)

  return () => {
    seed += 0x6d2b79f5
    let value = seed
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function shuffleWithSeed(items, seedValue) {
  const result = [...items]
  const random = createSeededRandom(seedValue)

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    const current = result[index]
    result[index] = result[swapIndex]
    result[swapIndex] = current
  }

  return result
}

function getRotationSlot() {
  return Math.floor(Date.now() / YOU_MIGHT_LIKE_ROTATION_MS)
}

const fallbackBooks = Array.from({ length: 12 }).map((_, index) => ({
  id: 900 + index,
  title: 'Name Book',
  cover: getFallbackCover(index),
  genre: 'Recommended',
  firstTag: '',
  totalViews: 0,
  totalLikes: 0,
  createdAt: 0,
  updatedAt: 0,
  storyStatus: 'New',
}))

function normalizeStory(story, index = 0) {
  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    cover: story.cover_url || getFallbackCover(index),
    genre: String(story.main_genre || '').trim(),
    firstTag: getFirstDifferentTag(story.main_genre, story.tags),
    totalViews: Number(story.total_views || 0),
    totalLikes: Number(story.total_likes || 0),
    createdAt: getTimestamp(story.created_at),
    updatedAt: getTimestamp(story.updated_at),
    storyStatus: String(story.story_status || '').trim(),
  }
}

function buildHourlySelection(pool, rotationSlot, storyType = '') {
  if (!Array.isArray(pool) || !pool.length) return []

  const uniquePool = []
  const seenIds = new Set()

  for (const story of pool) {
    const id = String(story?.id || '')
    if (!id || seenIds.has(id)) continue
    seenIds.add(id)
    uniquePool.push(story)
  }

  if (uniquePool.length <= YOU_MIGHT_LIKE_DISPLAY_SIZE) {
    return shuffleWithSeed(
      uniquePool,
      `${rotationSlot}-${storyType}-small`
    )
  }

  const updatedCandidates = [...uniquePool]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 24)

  const popularCandidates = [...uniquePool]
    .sort((a, b) => {
      if (b.totalLikes !== a.totalLikes) {
        return b.totalLikes - a.totalLikes
      }

      if (b.totalViews !== a.totalViews) {
        return b.totalViews - a.totalViews
      }

      return b.updatedAt - a.updatedAt
    })
    .slice(0, 24)

  const newCandidates = [...uniquePool]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 24)

  const hiddenCandidates = [...uniquePool]
    .sort((a, b) => {
      if (a.totalViews !== b.totalViews) {
        return a.totalViews - b.totalViews
      }

      if (b.totalLikes !== a.totalLikes) {
        return b.totalLikes - a.totalLikes
      }

      return b.updatedAt - a.updatedAt
    })
    .slice(0, 24)

  const completedCandidates = uniquePool.filter(
    (story) =>
      String(story.storyStatus || '').trim().toLowerCase() ===
      'completed'
  )

  const picked = []
  const pickedIds = new Set()

  function addFrom(candidates, count, label) {
    const available = candidates.filter(
      (story) => !pickedIds.has(String(story.id))
    )

    const shuffled = shuffleWithSeed(
      available,
      `${rotationSlot}-${storyType}-${label}`
    )

    for (const story of shuffled.slice(0, count)) {
      picked.push(story)
      pickedIds.add(String(story.id))
    }
  }

  addFrom(updatedCandidates, 4, 'updated')
  addFrom(popularCandidates, 3, 'popular')
  addFrom(newCandidates, 2, 'new')
  addFrom(hiddenCandidates, 2, 'hidden')
  addFrom(completedCandidates, 1, 'completed')

  if (picked.length < YOU_MIGHT_LIKE_DISPLAY_SIZE) {
    addFrom(
      uniquePool,
      YOU_MIGHT_LIKE_DISPLAY_SIZE - picked.length,
      'fallback'
    )
  }

  return shuffleWithSeed(
    picked.slice(0, YOU_MIGHT_LIKE_DISPLAY_SIZE),
    `${rotationSlot}-${storyType}-final`
  )
}

function BookCard({ book }) {
  return (
    <Link
  to={`/story/${book.id}`}
  onClick={() => void trackSectionQualifiedView('you_might_like', book.id)}
  className="group block min-w-0"
>
      <div className="overflow-hidden rounded-[8px] bg-[#1e1e22] shadow-sm">
        <div className="relative aspect-[2/3] overflow-hidden rounded-[8px]">
          <img
            src={book.cover}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            loading="lazy"
            decoding="async"
            onError={(event) => {
              event.currentTarget.src =
                '/assets/YouMightLike/YouMightLike 1.jpg'
            }}
          />
        </div>
      </div>

      <div className="pt-2.5 sm:pt-3">
        <h3 className="block w-full max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-[640] leading-[20px] text-neutral-900">
          {book.title}
        </h3>

        <p className="mt-1 min-h-[17px] truncate text-[11.5px] font-normal text-gray-400">
          {[book.genre, book.firstTag].filter(Boolean).join(' / ') ||
            'Recommended'}
        </p>
      </div>
    </Link>
  )
}

function LoadingGrid() {
  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[20px] lg:text-[21px]">🙂</span>
            <h2 className="text-[18px] font-extrabold tracking-tight text-neutral-900 lg:text-[19px]">
              You Might Like
            </h2>
          </div>

          <Link
            to="/you-might-like"
            className="flex h-8 w-8 items-center justify-end rounded-full transition-colors hover:bg-gray-100"
            aria-label="View all You Might Like"
          >
            <i className="fas fa-chevron-right text-[15px] text-gray-700 lg:text-[16px]" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-3 lg:gap-y-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index}>
              <div className="aspect-[2/3] animate-pulse rounded-[8px] bg-gray-100" />
              <div className="mt-3 h-4 animate-pulse rounded-full bg-gray-100" />
              <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function YouMightLikeSection({
  storyType = '',
}) {
  const [realBooks, setRealBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [rotationSlot, setRotationSlot] = useState(getRotationSlot)

  const normalizedStoryType = String(storyType || '')
    .trim()
    .toLowerCase()

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setRotationSlot(getRotationSlot())
    }, 60 * 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadYouMightLike() {
      const cacheKey = getHomeCacheKey({
        section: 'stories',
        language: getStoryLanguageId(),
        params: {
          home_section: 'you-might-like',
          sort: 'updated',
          limit: YOU_MIGHT_LIKE_POOL_SIZE,
          story_type: normalizedStoryType || 'all',
          schema: 2,
        },
      })

      const cached = await loadHomeCache(cacheKey, {
        maxAgeMs: YOU_MIGHT_LIKE_CACHE_MAX_AGE_MS,
        allowExpired: true,
      })

      const hasCachedBooks =
        Array.isArray(cached?.data) && cached.data.length > 0

      if (hasCachedBooks && !ignore) {
        setRealBooks(cached.data)
        setLoading(false)
      }

      if (cached?.isFresh && hasCachedBooks) {
        return
      }

      try {
        if (!hasCachedBooks && !ignore) {
          setLoading(true)
        }

        const storyTypeQuery = normalizedStoryType
          ? `&story_type=${encodeURIComponent(normalizedStoryType)}`
          : ''

        const response = await fetch(
          addStoryLanguageParam(
            `${API_BASE_URL}/api/public/stories?limit=${YOU_MIGHT_LIKE_POOL_SIZE}&sort=updated${storyTypeQuery}`
          )
        )

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(
            data.message || 'Failed to load You Might Like'
          )
        }

        const nextBooks = (data.stories || [])
          .filter(
            (story) =>
              !normalizedStoryType ||
              String(story?.story_type || '')
                .trim()
                .toLowerCase() === normalizedStoryType
          )
          .filter(
            (story) =>
              !normalizedStoryType ||
              Boolean(String(story?.cover_url || '').trim())
          )
          .map(normalizeStory)

        if (ignore) return

        setRealBooks(nextBooks)

        await saveHomeCache(cacheKey, nextBooks, {
          maxAgeMs: YOU_MIGHT_LIKE_CACHE_MAX_AGE_MS,
        })
      } catch (error) {
        console.error(
          'YouMightLikeSection fetch error:',
          error
        )

        if (!ignore && !hasCachedBooks) {
          setRealBooks([])
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadYouMightLike()

    return () => {
      ignore = true
    }
  }, [normalizedStoryType])

  const books = useMemo(() => {
    const sourceBooks = realBooks.length
      ? realBooks
      : normalizedStoryType
        ? []
        : fallbackBooks

    return buildHourlySelection(
      sourceBooks,
      rotationSlot,
      normalizedStoryType
    )
  }, [
    normalizedStoryType,
    realBooks,
    rotationSlot,
  ])

  if (loading) {
    return <LoadingGrid />
  }

  if (!books.length) {
    return null
  }

  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[20px] lg:text-[21px]">
              🙂
            </span>

            <h2 className="text-[18px] font-extrabold tracking-tight text-neutral-900 lg:text-[19px]">
              You Might Like
            </h2>
          </div>

          <Link
            to="/you-might-like"
            className="flex h-8 w-8 items-center justify-end rounded-full transition-colors hover:bg-gray-100"
            aria-label="View all You Might Like"
          >
            <i className="fas fa-chevron-right text-[15px] text-gray-700 lg:text-[16px]" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-3 lg:gap-y-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
