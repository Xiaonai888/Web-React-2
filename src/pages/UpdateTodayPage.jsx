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
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`

  return String(number)
}

function getStoryDate(story) {
  const value = story.updated_at || story.last_episode_updated_at || story.last_updated_at || story.created_at
  const date = value ? new Date(value) : null
  return date && !Number.isNaN(date.getTime()) ? date : null
}

function isWithinLastSevenDays(date) {
  if (!date) return true

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
    author: story.author_name || story.author?.page_name || 'Shadow Author',
    cover: story.cover_url || `/assets/Update Today/Update Today ${Math.min(index + 1, 7)}.jpg`,
    views: formatCompactNumber(story.total_views),
    likes: formatCompactNumber(story.total_likes),
    episodes: `Ep ${Number(story.total_episodes || 0)}`,
    genre: story.main_genre || story.genre || '',
    badge: story.status === 'completed' ? 'end' : index % 3 === 0 ? 'new' : 'up',
    updateDate,
    dayKey: updateDate ? updateDate.getDay() : new Date().getDay(),
    isSubscription: Boolean(story.is_subscription || story.subscription_only || story.is_subscribed || story.requires_subscription),
  }
}

function BookCard({ book }) {
  const badgeText = book.badge === 'end' ? 'End' : book.badge === 'up' ? 'UP' : 'New'

  return (
    <Link to={`/story/${book.id}`} className="group block min-w-0">
      <div className="relative overflow-hidden rounded-[18px] bg-[#202124] shadow-sm">
        <div className="aspect-[2/3] overflow-hidden">
          <img
            src={book.cover}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            onError={(event) => {
              event.currentTarget.src = '/assets/Update Today/Update Today 1.jpg'
            }}
          />
        </div>

        <div className={`absolute right-2 top-2 rounded-full px-3 py-1 text-[10px] font-black uppercase ${badgeConfig[book.badge] || badgeConfig.new}`}>
          {badgeText}
        </div>
      </div>

      <div className="mt-2.5 min-w-0">
        <h3 className="line-clamp-1 text-[13px] font-black tracking-tight text-[#111827] sm:text-[15px]">
          {book.title}
        </h3>

        <p className="mt-1 line-clamp-1 text-[11px] font-semibold text-[#6b7280] sm:text-[12px]">
          {book.author}
        </p>

        <div className="mt-1.5 flex items-center gap-2 text-[10px] font-bold text-[#111827] sm:text-[11px]">
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

export default function UpdateTodayPage() {
  const navigate = useNavigate()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeDay, setActiveDay] = useState(new Date().getDay())
  const [sortBy, setSortBy] = useState('newest')
  const [subscriptionOnly, setSubscriptionOnly] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  useEffect(() => {
    let ignore = false

    async function fetchStories() {
      try {
        setLoading(true)

        const response = await fetch(addStoryLanguageParam(`${API_BASE_URL}/api/public/stories?limit=60&sort=updated`))
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load update today stories')
        }

        if (!ignore) {
          setStories((data.stories || []).map(normalizeStory))
        }
      } catch (error) {
        console.error('UpdateTodayPage fetch error:', error)

        if (!ignore) {
          setStories([])
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchStories()

    return () => {
      ignore = true
    }
  }, [])

  const dayCounts = useMemo(() => {
    return dayTabs.reduce((counts, day) => {
      counts[day.key] = stories.filter((story) => story.dayKey === day.key && isWithinLastSevenDays(story.updateDate)).length
      return counts
    }, {})
  }, [stories])

  const filteredStories = useMemo(() => {
    const list = stories
      .filter((story) => story.dayKey === activeDay)
      .filter((story) => isWithinLastSevenDays(story.updateDate))
      .filter((story) => !subscriptionOnly || story.isSubscription)

    return list.sort((a, b) => {
      const aTime = a.updateDate ? a.updateDate.getTime() : 0
      const bTime = b.updateDate ? b.updateDate.getTime() : 0
      return sortBy === 'oldest' ? aTime - bTime : bTime - aTime
    })
  }, [activeDay, sortBy, stories, subscriptionOnly])

  return (
    <div className="min-h-screen bg-white pb-12">
      <header className="sticky top-0 z-30 border-b border-[#eef0f4] bg-white/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f6f8] text-[#111827]"
          >
            <i className="fas fa-chevron-left text-[14px]" />
          </button>

          <div className="text-center">
            <h1 className="text-[18px] font-black tracking-[0.14em] text-[#111827] sm:text-[22px]">
              UPDATE TODAY
            </h1>
            <p className="mt-0.5 text-[11px] font-semibold text-[#8b93a1] sm:text-[12px]">
              Weekly updates stay visible for 7 days
            </p>
          </div>

          <div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-4 pt-5">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {dayTabs.map((day) => {
            const active = activeDay === day.key

            return (
              <button
                key={day.key}
                type="button"
                onClick={() => setActiveDay(day.key)}
                className={`shrink-0 rounded-full border px-4 py-2 text-[12px] font-black transition ${
                  active
                    ? 'border-[#111827] bg-[#111827] text-white'
                    : 'border-[#e5e7eb] bg-white text-[#8b93a1] hover:border-[#111827] hover:text-[#111827]'
                }`}
              >
                <span>{day.label}</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] ${active ? 'bg-white/15 text-white' : 'bg-[#f3f4f6] text-[#6b7280]'}`}>
                  {dayCounts[day.key] || 0}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-black text-[#111827] sm:text-[22px]">Newest Updates</h2>
            <p className="mt-0.5 text-[12px] font-semibold text-[#8b93a1]">
              {filteredStories.length} stories in this day
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSubscriptionOnly((value) => !value)}
              className={`rounded-full border px-4 py-2 text-[12px] font-black transition ${
                subscriptionOnly
                  ? 'border-[#111827] bg-[#111827] text-white'
                  : 'border-[#e5e7eb] bg-white text-[#111827]'
              }`}
            >
              My subscriptions
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setSortOpen((value) => !value)}
                className="rounded-full border border-[#e5e7eb] bg-white px-4 py-2 text-[12px] font-black text-[#111827]"
              >
                Sort: {sortBy === 'newest' ? 'Newest' : 'Oldest'} <i className="fas fa-chevron-down ml-1 text-[10px]" />
              </button>

              {sortOpen ? (
                <div className="absolute right-0 top-11 z-20 w-[150px] overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_16px_35px_rgba(0,0,0,0.12)]">
                  {[
                    { key: 'newest', label: 'Newest first' },
                    { key: 'oldest', label: 'Oldest first' },
                  ].map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => {
                        setSortBy(option.key)
                        setSortOpen(false)
                      }}
                      className={`block w-full px-4 py-3 text-left text-[13px] font-bold ${
                        sortBy === option.key ? 'bg-[#f3f4f6] text-[#111827]' : 'text-[#6b7280] hover:bg-[#f9fafb]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="mt-7 grid grid-cols-3 gap-x-3 gap-y-7 md:grid-cols-6 md:gap-x-5">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index}>
                <div className="aspect-[2/3] animate-pulse rounded-[18px] bg-[#f3f4f6]" />
                <div className="mt-3 h-4 animate-pulse rounded-full bg-[#f3f4f6]" />
                <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-[#f3f4f6]" />
              </div>
            ))}
          </div>
        ) : filteredStories.length ? (
          <div className="mt-7 grid grid-cols-3 gap-x-3 gap-y-7 md:grid-cols-6 md:gap-x-5 md:gap-y-9">
            {filteredStories.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-[24px] bg-[#f7f7f8] px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm">
              <i className="fas fa-book-open text-[20px]" />
            </div>
            <h3 className="text-[18px] font-black text-[#111827]">No updates found</h3>
            <p className="mt-2 text-[13px] font-semibold text-[#8b93a1]">
              Try another day or turn off subscription filter.
            </p>
          </div>
        )}
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
