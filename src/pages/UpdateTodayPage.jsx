import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { addStoryLanguageParam } from '../utils/storyLanguage'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const dayTabs = [
  { key: 1, label: 'MON' },
  { key: 2, label: 'TUE' },
  { key: 3, label: 'WED' },
  { key: 4, label: 'THU' },
  { key: 5, label: 'FRI' },
  { key: 6, label: 'SAT' },
  { key: 0, label: 'SUN' },
]

const badgeConfig = {
  new: 'bg-[#111827] text-white',
  up: 'bg-[#facc15] text-[#111827]',
  end: 'bg-[#22c55e] text-[#052e16]',
}

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

function getStoryDate(story) {
  const value =
    story.updated_at ||
    story.last_episode_updated_at ||
    story.last_updated_at ||
    story.created_at

  const date = value ? new Date(value) : null
  return date && !Number.isNaN(date.getTime()) ? date : null
}

function isWithinLastSevenDays(date) {
  if (!date) return false

  const now = new Date()
  const sevenDaysAgo = new Date(now)
  sevenDaysAgo.setDate(now.getDate() - 7)

  return date >= sevenDaysAgo && date <= now
}

function normalizeStory(story, index = 0) {
  const updateDate = getStoryDate(story)

  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    author:
      story.author_page?.page_name ||
      story.author_page?.page_username ||
      story.author_name ||
      'Shadow Author',
    cover:
      story.cover_url ||
      `/assets/Update Today/Update Today ${Math.min(index + 1, 7)}.jpg`,
    views: formatCompactNumber(story.total_views),
    episodes: `Ep ${Number(story.total_episodes || 0)}`,
    badge:
      story.status === 'completed'
        ? 'end'
        : index % 3 === 0
          ? 'new'
          : 'up',
    updateDate,
    dayKey: updateDate ? updateDate.getDay() : null,
  }
}

function getBestAvailableDay(stories, preferredDay) {
  const availableDays = new Set(
    stories
      .filter((story) => isWithinLastSevenDays(story.updateDate))
      .map((story) => story.dayKey)
      .filter((day) => day !== null)
  )

  if (availableDays.has(preferredDay)) {
    return preferredDay
  }

  const today = new Date().getDay()

  for (let offset = 0; offset < 7; offset += 1) {
    const day = (today - offset + 7) % 7
    if (availableDays.has(day)) {
      return day
    }
  }

  return preferredDay
}

function wait(milliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds)
  })
}

function BookCard({ book }) {
  const badgeText =
    book.badge === 'end' ? 'END' : book.badge === 'up' ? 'UP' : 'NEW'

  return (
    <Link to={`/story/${book.id}`} className="group block min-w-0">
      <div className="relative aspect-[2/3] overflow-hidden rounded-[16px] bg-[#202124] shadow-sm">
        <img
          src={book.cover}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src =
              '/assets/Update Today/Update Today 1.jpg'
          }}
        />

        <div
          className={`absolute left-0 top-0 rounded-br-[7px] px-2 py-1 text-[10px] font-extrabold leading-none ${badgeConfig[book.badge] || badgeConfig.new}`}
        >
          {badgeText}
        </div>
      </div>

      <div className="mt-2.5 min-w-0">
        <h3 className="line-clamp-1 text-[13px] font-bold tracking-tight text-[#111827] sm:text-[15px]">
          {book.title}
        </h3>

        <p className="mt-1 line-clamp-1 text-[11px] font-medium text-[#6b7280] sm:text-[12px]">
          {book.author}
        </p>

        <div className="mt-1.5 flex items-center gap-2 text-[10px] font-medium text-[#111827] sm:text-[11px]">
          <span className="inline-flex items-center gap-1">
            <i className="fas fa-eye text-[10px]" />
            {book.views}
          </span>

          <span className="inline-flex items-center gap-1 text-[#1d4ed8]">
            <i className="fas fa-list text-[10px] text-[#111827]" />
            {book.episodes}
          </span>
        </div>
      </div>
    </Link>
  )
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-3 gap-x-3 gap-y-7 sm:gap-x-4 md:grid-cols-6 md:gap-x-5 md:gap-y-9">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index}>
          <div className="aspect-[2/3] animate-pulse rounded-[16px] bg-[#f3f4f6]" />
          <div className="mt-3 h-4 animate-pulse rounded-full bg-[#f3f4f6]" />
          <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-[#f3f4f6]" />
        </div>
      ))}
    </div>
  )
}

export default function UpdateTodayPage() {
  const navigate = useNavigate()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [activeDay, setActiveDay] = useState(new Date().getDay())
  const [requestVersion, setRequestVersion] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let ignore = false

    async function fetchStories() {
      setLoading(true)
      setErrorMessage('')

      let lastError = null

      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          const response = await fetch(
            addStoryLanguageParam(
              `${API_BASE_URL}/api/public/stories?limit=60&sort=updated`
            ),
            {
              signal: controller.signal,
              cache: 'no-store',
            }
          )

          const data = await response.json().catch(() => ({}))

          if (!response.ok || data.ok === false) {
            throw new Error(
              data.message || 'Failed to load update today stories'
            )
          }

          if (ignore) return

          const normalizedStories = (data.stories || []).map(normalizeStory)

          setStories(normalizedStories)
          setActiveDay((currentDay) =>
            getBestAvailableDay(normalizedStories, currentDay)
          )
          setLoading(false)
          return
        } catch (error) {
          if (error.name === 'AbortError') return

          lastError = error

          if (attempt < 2) {
            await wait(700 * (attempt + 1))
          }
        }
      }

      if (!ignore) {
        setStories([])
        setErrorMessage(
          lastError?.message || 'Cannot load updates. Please try again.'
        )
        setLoading(false)
      }
    }

    fetchStories()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [requestVersion])

  const filteredStories = useMemo(() => {
    return stories
      .filter((story) => story.dayKey === activeDay)
      .filter((story) => isWithinLastSevenDays(story.updateDate))
      .sort((a, b) => {
        const aTime = a.updateDate?.getTime() || 0
        const bTime = b.updateDate?.getTime() || 0
        return bTime - aTime
      })
  }, [activeDay, stories])

  return (
    <div className="min-h-screen bg-white pb-16">
      <header className="sticky top-0 z-40 border-b border-[#eceef2] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1180px] items-center px-4 sm:px-5 lg:px-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#111827] transition-colors hover:bg-[#f4f5f7]"
            aria-label="Go back"
          >
            <i className="fas fa-chevron-left text-[17px]" />
          </button>

          <h1 className="min-w-0 flex-1 text-center text-[18px] font-extrabold tracking-tight text-neutral-900 lg:text-[19px]">
            Update Today
          </h1>

          <Link
  to="/search"
  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#111827] transition-colors hover:bg-[#f4f5f7]"
  aria-label="Search"
>
  <i className="fas fa-search text-[18px]" />
</Link>
        </div>
      </header>

      <div className="sticky top-14 z-30 border-b border-[#f0f1f3] bg-white">
        <div className="mx-auto grid h-[58px] max-w-[1180px] grid-cols-7 px-2 sm:px-4 lg:px-6">
          {dayTabs.map((day) => {
            const active = activeDay === day.key

            return (
              <button
                key={day.key}
                type="button"
                onClick={() => setActiveDay(day.key)}
                className={`relative flex items-center justify-center text-[12px] transition-colors sm:text-[13px] ${
                  active
                    ? 'font-extrabold text-[#111827]'
                    : 'font-medium text-[#6b7280] hover:text-[#111827]'
                }`}
              >
                {day.label}

                <span
  className={`absolute bottom-0 left-1/2 h-[3px] -translate-x-1/2 rounded-[10px] transition-all ${
    active
      ? 'w-7 bg-[#F6B800]'
      : 'w-0 bg-transparent'
  }`}
/>
              </button>
            )
          })}
        </div>
      </div>

      <main className="mx-auto max-w-[1180px] px-4 pt-6 sm:px-5 lg:px-6">
        {errorMessage ? (
          <div className="rounded-[20px] bg-[#fff1f2] px-5 py-10 text-center">
            <p className="text-[13px] font-medium text-[#be123c]">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={() => setRequestVersion((value) => value + 1)}
              className="mt-4 rounded-full bg-[#111827] px-5 py-2.5 text-[13px] font-bold text-white"
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          <LoadingGrid />
        ) : filteredStories.length ? (
          <div className="grid grid-cols-3 gap-x-3 gap-y-7 sm:gap-x-4 md:grid-cols-6 md:gap-x-5 md:gap-y-9">
            {filteredStories.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f6f8] text-[#9ca3af]">
              <i className="fa-regular fa-calendar text-[22px]" />
            </div>

            <h2 className="mt-4 text-[16px] font-bold text-[#111827]">
              No updates for this day
            </h2>

            <p className="mt-1 text-[12px] text-[#8b93a1]">
              Select another day to see recent updates.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
