import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { addStoryLanguageParam, getStoryLanguageLabel } from '../utils/storyLanguage'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`
  }

  return String(number)
}

function createDailySeed() {
  const today = new Date()

  return (
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate()
  )
}

function createSeededRandom(seed) {
  let value = seed % 2147483647

  if (value <= 0) {
    value += 2147483646
  }

  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

function selectDailyStories(stories) {
  const eligibleStories = stories.filter(
    (story) => Number(story.total_episodes || 0) >= 1
  )

  const selectedStories = [...eligibleStories]
  const random = createSeededRandom(createDailySeed())

  for (let index = selectedStories.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1))

    ;[selectedStories[index], selectedStories[randomIndex]] = [
      selectedStories[randomIndex],
      selectedStories[index],
    ]
  }

  return selectedStories
}

function normalizeStory(story, index = 0) {
  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    image:
      story.landscape_thumbnail_url ||
      story.cover_url ||
      `/assets/Trending%20Now/Trending%20${Math.min(index + 1, 18)}.jpg`,
    genre: story.main_genre || '',
    heat: formatCompactNumber(story.total_likes),
    isAdult: Boolean(story.is_adult),
  }
}

function FireOutlineIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22c4.4 0 8-3.1 8-8 0-2.1-.8-4.1-2-5.5 0 2.5-1.5 4-3 4.5.5-4-2-8-6-11 0 3.5-2 5.5-3.5 7C4 10.5 4 12.5 4 14c0 4.9 3.6 8 8 8Z" />
      <path d="M9.5 17.5c0 1.5 1.1 2.5 2.5 2.5s2.5-1 2.5-2.5c0-1-.5-1.9-1.3-2.6 0 1-.6 1.6-1.2 1.8.1-1.5-.8-2.8-2.1-3.8.1 1.5-.4 2.4-.4 4.6Z" />
    </svg>
  )
}

function DailyPickCard({ book }) {
  return (
    <Link to={`/story/${book.id}`} className="group block min-w-0">
      <div className="relative aspect-[1.42/1] overflow-hidden rounded-[8px] bg-[#202124] shadow-sm">
        <img
          src={book.image}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          loading="lazy"
          decoding="async"
          onError={(event) => {
            event.currentTarget.style.display = 'none'
          }}
        />

        {book.isAdult ? (
          <div className="absolute left-2 top-2 rounded-full bg-[#fff1f1] px-2.5 py-1 text-[10px] font-extrabold text-[#e5484d]">
            18+
          </div>
        ) : null}
      </div>

      <div className="mt-2 min-w-0">
        <h3 className="block w-full max-w-full overflow-hidden whitespace-nowrap text-ellipsis text-[14px] font-[640] leading-[20px] text-neutral-900">
          {book.title}
        </h3>

        <div className="mt-1.5 flex min-h-[22px] items-center gap-2">
          {book.genre ? (
            <span className="inline-flex max-w-full truncate rounded-[4px] bg-[#FFF4BF] px-2 py-1 text-[10px] font-medium leading-none text-[#9A6700]">
              {book.genre}
            </span>
          ) : null}

          <div className="flex shrink-0 items-center gap-1 text-[12px] font-medium text-[#4B5563]">
            <span className="text-[#EF4444]">
              <FireOutlineIcon />
            </span>
            <span>{book.heat}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-3 lg:gap-y-5">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index}>
          <div className="aspect-[1.42/1] animate-pulse rounded-[8px] bg-gray-100" />
          <div className="mt-2 h-4 animate-pulse rounded-full bg-gray-100" />
          <div className="mt-2 h-4 w-24 animate-pulse rounded-[4px] bg-gray-100" />
        </div>
      ))}
    </div>
  )
}

export default function DailyPicksPage() {
  const navigate = useNavigate()
  const storyLanguage = getStoryLanguageLabel()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)

  useEffect(() => {
    let ignore = false

    async function fetchDailyPicks() {
      try {
        setLoading(true)
        setLoadFailed(false)

        const response = await fetch(
          addStoryLanguageParam(
            `${API_BASE_URL}/api/public/stories?limit=24&sort=likes`
          )
        )

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load daily picks')
        }

        if (!ignore) {
          const dailyStories = selectDailyStories(data.stories || [])
          setStories(dailyStories.map(normalizeStory))
        }
      } catch (error) {
        console.error('DailyPicksPage fetch error:', error)

        if (!ignore) {
          setLoadFailed(true)
          setStories([])
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    fetchDailyPicks()

    return () => {
      ignore = true
    }
  }, [])

  const todayLabel = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  return (
    <main className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[52px] max-w-7xl items-center justify-between px-3 sm:px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-start rounded-full text-[#111827] transition-colors hover:bg-gray-100"
            aria-label="Go back"
          >
            <i className="fas fa-chevron-left text-[17px]" />
          </button>

          <h1 className="text-[17px] font-bold text-[#111827]">
            Daily Picks
          </h1>

          <Link
            to="/search"
            className="flex h-9 w-9 items-center justify-end rounded-full text-[#111827] transition-colors hover:bg-gray-100"
            aria-label="Search"
          >
            <i className="fas fa-search text-[18px]" />
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-3 pb-10 pt-4 sm:px-4">
        <div className="mb-5">
          <h2 className="text-[18px] font-extrabold text-[#111827]">
            Today · {todayLabel}
          </h2>
          <p className="mt-1 text-[12px] font-medium text-[#8D94A1]">
            Fresh picks selected every day
          </p>
        </div>

        {loading ? <LoadingGrid /> : null}

        {!loading && stories.length ? (
          <div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-3 lg:gap-y-5">
            {stories.map((book) => (
              <DailyPickCard key={book.id} book={book} />
            ))}
          </div>
        ) : null}

        {!loading && !stories.length ? (
          <div className="rounded-[18px] bg-[#F8F8FB] px-4 py-8 text-center">
            <div className="text-[14px] font-bold text-[#111827]">
              {loadFailed
                ? 'Could not load Daily Picks'
                : `No ${storyLanguage} picks available today`}
            </div>
            <p className="mt-1 text-[12px] text-[#8D94A1]">
              Please check again later.
            </p>
          </div>
        ) : null}
      </section>
    </main>
  )
}
