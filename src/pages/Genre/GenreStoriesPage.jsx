import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'https://shadow-backend-kucw.onrender.com'

const TAB_CONFIG = {
  latest: {
    label: 'Latest',
    sort: 'latest',
  },
  updates: {
    label: 'Updates',
    sort: 'updated',
  },
  completed: {
    label: 'Completed',
    sort: 'updated',
  },
}

function toSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\+/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function formatGenreName(value) {
  return String(value || '')
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function getTime(value) {
  const time = new Date(value || 0).getTime()
  return Number.isFinite(time) ? time : 0
}

function isCompletedStory(story) {
  return (
    Boolean(story?.is_completed) ||
    String(story?.story_status || story?.status || '')
      .trim()
      .toLowerCase() === 'completed'
  )
}

function normalizeStory(story) {
  return {
    id: story.id || story.story_id,
    title: story.title || 'Untitled Story',
    cover: story.cover_url || story.coverUrl || story.image_url || '',
    totalEpisodes: Number(story.total_episodes || story.episodes_count || story.episode_count || 0),
    createdAt: story.created_at || '',
    updatedAt: story.updated_at || story.published_at || story.created_at || '',
    completed: isCompletedStory(story),
  }
}

function StoryCover({ story, completed }) {
  return (
    <div className="relative aspect-[2/3] overflow-hidden rounded-[8px] bg-[#f3f4f6]">
      {story.cover ? (
        <img
          src={story.cover}
          alt={story.title}
          draggable={false}
          onDragStart={(event) => event.preventDefault()}
          className="h-full w-full select-none object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[#d6336c]">
          <i className="fa-solid fa-book-open text-[30px]" />
        </div>
      )}

      {completed ? (
        <span className="absolute bottom-2 right-2 rounded-[4px] bg-black/75 px-2 py-1 text-[9px] font-bold leading-none text-white">
          COMPLETED
        </span>
      ) : null}
    </div>
  )
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-5 px-4 pt-5 md:grid-cols-4 lg:grid-cols-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index}>
          <div className="aspect-[2/3] animate-pulse rounded-[8px] bg-gray-100" />
          <div className="mt-2 h-4 animate-pulse rounded-full bg-gray-100" />
          <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-gray-100" />
        </div>
      ))}
    </div>
  )
}

export default function GenreStoriesPage({ tab = 'latest' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { genreSlug = '' } = useParams()
  const activeTab = TAB_CONFIG[tab] ? tab : 'latest'
  const tabConfig = TAB_CONFIG[activeTab]
  const normalizedGenreSlug = toSlug(genreSlug)
  const fallbackGenreName = formatGenreName(normalizedGenreSlug)
  const [genreName, setGenreName] = useState(fallbackGenreName)
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let ignore = false

    async function loadStories() {
      setLoading(true)
      setMessage('')
      setStories([])
      setGenreName(fallbackGenreName)

      try {
        let resolvedGenreName = fallbackGenreName

        try {
          const genresResponse = await fetch(`${API_URL}/api/genres?include_inactive=true`)
          const genresData = await genresResponse.json().catch(() => ({}))
          const foundGenre = (genresData.genres || []).find(
            (genre) => toSlug(genre.slug || genre.name) === normalizedGenreSlug
          )

          if (foundGenre?.name) {
            resolvedGenreName = foundGenre.name
          }
        } catch {
          resolvedGenreName = fallbackGenreName
        }

        if (!ignore) setGenreName(resolvedGenreName)

        const response = await fetch(
          `${API_URL}/api/public/stories?genre=${encodeURIComponent(resolvedGenreName)}&limit=48&sort=${tabConfig.sort}`
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || `Failed to load ${resolvedGenreName} stories`)
        }

        const rawStories = data.stories || data.items || data.results || []
        const matchedStories = rawStories
          .filter(
            (story) =>
              toSlug(story.main_genre || story.genre || story.category) === normalizedGenreSlug
          )
          .map(normalizeStory)

        if (!ignore) setStories(matchedStories)
      } catch (error) {
        if (!ignore) {
          setStories([])
          setMessage(
            error.message === 'Failed to fetch'
              ? 'Cannot connect to server.'
              : error.message || 'Failed to load stories'
          )
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadStories()

    return () => {
      ignore = true
    }
  }, [fallbackGenreName, normalizedGenreSlug, reloadKey, tabConfig.sort])

  const visibleStories = useMemo(() => {
    const filtered =
      activeTab === 'completed'
        ? stories.filter((story) => story.completed)
        : stories

    const dateKey = activeTab === 'latest' ? 'createdAt' : 'updatedAt'

    return [...filtered].sort(
      (first, second) => getTime(second[dateKey]) - getTime(first[dateKey])
    )
  }, [activeTab, stories])

  const genreReturnPath =
    location.state?.returnTo || `/?genre=${encodeURIComponent(normalizedGenreSlug)}`

  const emptyText =
    activeTab === 'completed'
      ? `No completed ${genreName} stories yet.`
      : activeTab === 'updates'
        ? `No ${genreName} updates yet.`
        : `No ${genreName} stories yet.`

  return (
    <div className="min-h-screen bg-white pb-8">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex h-[58px] max-w-5xl items-center px-4">
          <button
            type="button"
            onClick={() => navigate(genreReturnPath)}
            className="flex h-10 w-10 shrink-0 items-center justify-start text-[#111827] active:scale-95"
            aria-label="Back"
          >
            <i className="fa-solid fa-arrow-left text-[21px]" />
          </button>

          <h1 className="ml-1 text-[20px] font-[650] text-[#111827]">
            {genreName} {tabConfig.label}
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl">
        {loading ? <LoadingGrid /> : null}

        {!loading && message ? (
          <div className="mx-4 mt-5 rounded-[16px] bg-gray-50 px-5 py-9 text-center">
            <p className="text-[13px] font-medium text-[#e5484d]">{message}</p>
            <button
              type="button"
              onClick={() => setReloadKey((current) => current + 1)}
              className="mt-4 rounded-full bg-[#111827] px-5 py-2.5 text-[13px] font-bold text-white active:scale-95"
            >
              Retry
            </button>
          </div>
        ) : null}

        {!loading && !message && visibleStories.length === 0 ? (
          <div className="px-5 py-16 text-center text-[14px] text-gray-400">
            {emptyText}
          </div>
        ) : null}

        {!loading && !message && visibleStories.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-2 gap-y-5 px-4 pt-5 md:grid-cols-4 lg:grid-cols-6">
            {visibleStories.map((story) => (
              <button
                key={story.id}
                type="button"
                onClick={() =>
                  navigate(`/story/${story.id}`, {
                    state: { returnTo: location.pathname },
                  })
                }
                className="min-w-0 text-left active:scale-[0.99]"
              >
                <StoryCover
                  story={story}
                  completed={activeTab === 'completed'}
                />

                <h2 className="mt-2 line-clamp-2 text-[14px] font-[600] leading-[19px] text-[#222222]">
                  {story.title}
                </h2>

                <p className="mt-2 text-[12px] font-normal text-gray-400">
                  {activeTab === 'completed'
                    ? `${story.totalEpisodes} ${
                        story.totalEpisodes === 1 ? 'Episode' : 'Episodes'
                      }`
                    : `Up to Ep. ${story.totalEpisodes}`}
                </p>
              </button>
            ))}
          </div>
        ) : null}
      </main>
    </div>
  )
}
