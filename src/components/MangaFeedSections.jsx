import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  addStoryLanguageParam,
  getStoryLanguageId,
  getStoryLanguageLabel,
} from '../utils/storyLanguage'
import {
  getHomeCacheKey,
  loadHomeCache,
  saveHomeCache,
} from '../utils/homeDataCache'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')
const MANGA_FEED_CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`

  return String(number)
}

function getAuthorName(story) {
  return (
    story.author_page?.page_name ||
    story.author_page?.page_username ||
    story.author_name ||
    'Shadow Author'
  )
}

function getGenreTitle(genre) {
  if (!genre || genre === 'today') return 'Latest Manga'

  return `${genre
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')} Manga`
}

function MangaCard({ story, onOpen }) {
  return (
    <button type="button" onClick={onOpen} className="group block w-full text-left">
      <div
        className="relative aspect-[2/3] w-full overflow-hidden rounded-[10px] shadow-sm"
        style={{ background: 'var(--shadow-bg-soft)' }}
      >
        <img
          src={story.cover_url || '/assets/New Arrival/New Arrival 1.jpg'}
          alt={story.title || 'Manga cover'}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.035]"
          loading="lazy"
          decoding="async"
          onError={(event) => {
            event.currentTarget.src = '/assets/New Arrival/New Arrival 1.jpg'
          }}
        />

        {story.is_adult ? (
          <span
            className="absolute bottom-2 left-2 rounded-full px-2 py-1 text-[9px] font-extrabold shadow-sm"
            style={{
              background: 'var(--shadow-bg-surface)',
              color: 'var(--shadow-danger)',
            }}
          >
            18+
          </span>
        ) : null}
      </div>

      <h3
        className="mt-2 truncate text-[13.5px] font-[680] leading-5"
        style={{ color: 'var(--shadow-text-primary)' }}
      >
        {story.title || 'Untitled Manga'}
      </h3>
      <p
        className="mt-0.5 truncate text-[10.5px] font-medium"
        style={{ color: 'var(--shadow-text-secondary)' }}
      >
        {getAuthorName(story)}
      </p>
      <div
        className="mt-1 flex items-center gap-2 text-[10px] font-semibold"
        style={{ color: 'var(--shadow-text-tertiary)' }}
      >
        <span>{story.main_genre || 'Manga'}</span>
        <span>•</span>
        <span>{formatCompactNumber(story.total_views)} views</span>
      </div>
    </button>
  )
}

function MangaRow({ title, stories, onOpen }) {
  if (!stories.length) return null

  return (
    <section className="my-7 px-4 sm:px-5 lg:px-6">
      <div className="mb-4 flex items-center justify-between">
        <h2
          className="text-[18px] font-extrabold tracking-tight lg:text-[19px]"
          style={{ color: 'var(--shadow-text-primary)' }}
        >
          {title}
        </h2>
        <span
          className="rounded-full px-3 py-1 text-[10px] font-extrabold"
          style={{
            background: 'var(--shadow-bg-soft)',
            color: 'var(--shadow-text-secondary)',
          }}
        >
          {stories.length}
        </span>
      </div>

      <div className="-mr-4 flex gap-3 overflow-x-auto overscroll-x-contain pb-2 pr-4 [scrollbar-width:none] sm:-mr-5 sm:pr-5 lg:mr-0 lg:grid lg:grid-cols-6 lg:gap-3 lg:overflow-visible lg:pb-0 lg:pr-0 [&::-webkit-scrollbar]:hidden">
        {stories.map((story) => (
          <div
            key={story.id}
            className="w-[calc((100vw-56px)/2.5)] min-w-[calc((100vw-56px)/2.5)] lg:w-auto lg:min-w-0"
          >
            <MangaCard story={story} onOpen={() => onOpen(story.id)} />
          </div>
        ))}
      </div>
    </section>
  )
}

function LoadingRows() {
  return (
    <div className="px-4 py-6 sm:px-5 lg:px-6">
      <div
        className="mb-4 h-6 w-36 animate-pulse rounded-full"
        style={{ background: 'var(--shadow-bg-soft)' }}
      />
      <div className="grid grid-cols-3 gap-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <div
              className="aspect-[2/3] animate-pulse rounded-[10px]"
              style={{ background: 'var(--shadow-bg-soft)' }}
            />
            <div
              className="mt-2 h-4 animate-pulse rounded-full"
              style={{ background: 'var(--shadow-bg-soft)' }}
            />
            <div
              className="mt-2 h-3 w-2/3 animate-pulse rounded-full"
              style={{ background: 'var(--shadow-bg-soft)' }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function MangaFeedSections({ genre = 'today' }) {
  const navigate = useNavigate()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const storyLanguage = getStoryLanguageLabel()

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    async function loadManga() {
      const cacheKey = getHomeCacheKey({
        section: 'stories',
        language: getStoryLanguageId(),
        params: {
          page: 'manga-feed',
          story_type: 'manga',
          sort: 'latest',
          limit: 100,
          schema: 1,
        },
      })

      let hasCachedStories = false

      const cached = await loadHomeCache(cacheKey, {
        maxAgeMs: MANGA_FEED_CACHE_MAX_AGE_MS,
        allowExpired: true,
      })

      if (cancelled || controller.signal.aborted) return

      hasCachedStories = Array.isArray(cached?.data)

      if (hasCachedStories) {
        setStories(cached.data)
        setLoading(false)
        setError('')
      }

      if (cached?.isFresh && hasCachedStories) {
        return
      }

      try {
        if (!hasCachedStories) {
          setLoading(true)
        }

        setError('')

        const endpoint = addStoryLanguageParam(
          `${API_BASE_URL}/api/public/stories?limit=100&sort=latest&story_type=manga`
        )

        const response = await fetch(endpoint, {
          signal: controller.signal,
        })
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load manga')
        }

        const mangaStories = (
          Array.isArray(data.stories) ? data.stories : []
        ).filter(
          (story) =>
            String(story.story_type || '').toLowerCase() === 'manga'
        )

        if (cancelled || controller.signal.aborted) return

        setStories(mangaStories)

        await saveHomeCache(cacheKey, mangaStories, {
          maxAgeMs: MANGA_FEED_CACHE_MAX_AGE_MS,
        })
      } catch (loadError) {
        if (loadError?.name === 'AbortError') return

        if (!cancelled && !hasCachedStories) {
          setStories([])
          setError(loadError.message || 'Failed to load manga')
        }
      } finally {
        if (!cancelled && !controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadManga()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [storyLanguage])

  const filteredStories = useMemo(() => {
    if (!genre || genre === 'today') return stories

    const normalizedGenre = String(genre).trim().toLowerCase()
    return stories.filter(
      (story) => String(story.main_genre || '').trim().toLowerCase() === normalizedGenre
    )
  }, [genre, stories])

  const latestStories = useMemo(
    () =>
      [...filteredStories]
        .sort((first, second) => new Date(second.created_at || 0) - new Date(first.created_at || 0))
        .slice(0, 18),
    [filteredStories]
  )

  const popularStories = useMemo(() => {
    if (filteredStories.length < 4) return []

    return [...filteredStories]
      .sort(
        (first, second) =>
          Number(second.total_views || 0) - Number(first.total_views || 0) ||
          Number(second.total_likes || 0) - Number(first.total_likes || 0)
      )
      .slice(0, 12)
  }, [filteredStories])

  const completedStories = useMemo(
    () =>
      filteredStories
        .filter(
          (story) => String(story.story_status || '').trim().toLowerCase() === 'completed'
        )
        .slice(0, 12),
    [filteredStories]
  )

  if (loading) return <LoadingRows />

  if (error) {
    return (
      <div className="px-4 py-8 sm:px-5 lg:px-6">
        <div
          className="rounded-[22px] px-5 py-7 text-center"
          style={{
            background: 'rgba(229, 72, 77, 0.10)',
            border: '1px solid rgba(229, 72, 77, 0.18)',
          }}
        >
          <div
            className="text-[14px] font-extrabold"
            style={{ color: 'var(--shadow-danger)' }}
          >
            Could not load Manga
          </div>
          <div
            className="mt-1 text-[12px]"
            style={{ color: 'var(--shadow-text-secondary)' }}
          >
            {error}
          </div>
        </div>
      </div>
    )
  }

  if (!filteredStories.length) {
    return (
      <div className="px-4 py-8 sm:px-5 lg:px-6">
        <div
          className="rounded-[22px] px-5 py-9 text-center"
          style={{
            background: 'var(--shadow-bg-elevated)',
            border: '1px solid var(--shadow-border)',
          }}
        >
          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full text-[24px] shadow-sm"
            style={{
              background: 'var(--shadow-bg-surface)',
              border: '1px solid var(--shadow-border)',
            }}
          >
            📚
          </div>
          <div
            className="mt-4 text-[15px] font-extrabold"
            style={{ color: 'var(--shadow-text-primary)' }}
          >
            No {genre === 'today' ? storyLanguage : genre} Manga yet
          </div>
          <div
            className="mt-1 text-[12px] leading-5"
            style={{ color: 'var(--shadow-text-secondary)' }}
          >
            Published Manga will appear here automatically.
          </div>
        </div>
      </div>
    )
  }

  const openStory = (storyId) => navigate(`/story/${storyId}`)

  return (
    <div>
      <MangaRow title={getGenreTitle(genre)} stories={latestStories} onOpen={openStory} />
      <MangaRow title="Popular Manga" stories={popularStories} onOpen={openStory} />
      <MangaRow title="Completed Manga" stories={completedStories} onOpen={openStory} />
    </div>
  )
}
