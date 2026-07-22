import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addStoryLanguageParam, getStoryLanguageLabel } from '../utils/storyLanguage'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

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
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[10px] bg-[#f1f2f4] shadow-sm">
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
          <span className="absolute bottom-2 left-2 rounded-full bg-white/95 px-2 py-1 text-[9px] font-extrabold text-[#e5484d] shadow-sm">
            18+
          </span>
        ) : null}
      </div>

      <h3 className="mt-2 truncate text-[13.5px] font-[680] leading-5 text-[#111827]">
        {story.title || 'Untitled Manga'}
      </h3>
      <p className="mt-0.5 truncate text-[10.5px] font-medium text-[#8d94a1]">
        {getAuthorName(story)}
      </p>
      <div className="mt-1 flex items-center gap-2 text-[10px] font-semibold text-[#667085]">
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
        <h2 className="text-[18px] font-extrabold tracking-tight text-[#111827] lg:text-[19px]">
          {title}
        </h2>
        <span className="rounded-full bg-[#fff8d8] px-3 py-1 text-[10px] font-extrabold text-[#8a6500]">
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
      <div className="mb-4 h-6 w-36 animate-pulse rounded-full bg-[#f1f2f4]" />
      <div className="grid grid-cols-3 gap-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <div className="aspect-[2/3] animate-pulse rounded-[10px] bg-[#f1f2f4]" />
            <div className="mt-2 h-4 animate-pulse rounded-full bg-[#f1f2f4]" />
            <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-[#f1f2f4]" />
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
    let cancelled = false

    async function loadManga() {
      try {
        setLoading(true)
        setError('')

        const endpoint = addStoryLanguageParam(
          `${API_BASE_URL}/api/public/stories?limit=100&sort=latest&story_type=manga`
        )
        const response = await fetch(endpoint)
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load manga')
        }

        if (cancelled) return

        const mangaStories = (data.stories || []).filter(
          (story) => String(story.story_type || '').toLowerCase() === 'manga'
        )

        setStories(mangaStories)
      } catch (loadError) {
        if (!cancelled) {
          setStories([])
          setError(loadError.message || 'Failed to load manga')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadManga()

    return () => {
      cancelled = true
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
        <div className="rounded-[22px] bg-[#fff1f1] px-5 py-7 text-center">
          <div className="text-[14px] font-extrabold text-[#e5484d]">Could not load Manga</div>
          <div className="mt-1 text-[12px] text-[#a35a5a]">{error}</div>
        </div>
      </div>
    )
  }

  if (!filteredStories.length) {
    return (
      <div className="px-4 py-8 sm:px-5 lg:px-6">
        <div className="rounded-[22px] bg-[#f8f8fb] px-5 py-9 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-[24px] shadow-sm ring-1 ring-black/5">
            📚
          </div>
          <div className="mt-4 text-[15px] font-extrabold text-[#111827]">
            No {genre === 'today' ? storyLanguage : genre} Manga yet
          </div>
          <div className="mt-1 text-[12px] leading-5 text-[#8d94a1]">
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
