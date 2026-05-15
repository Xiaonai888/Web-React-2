import { Link } from 'react-router-dom'
import { useMemo, useState, useEffect, useRef } from 'react'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const trendTabs = ['Daily', 'Weekly', 'Monthly']
const sortOptions = ['Likes', 'Views', 'Comments']

const fallbackTrendingData = {
  Daily: [
    { id: 101, title: 'Crush Theory', likes: 100000, views: 920000, comments: 20000, image: '/assets/Trending%20Now/Trending%201.jpg' },
    { id: 102, title: 'The Actress Next Door', likes: 97000, views: 880000, comments: 19300, image: '/assets/Trending%20Now/Trending%202.jpg' },
    { id: 103, title: 'When the CEO Smiled', likes: 91000, views: 840000, comments: 18800, image: '/assets/Trending%20Now/Trending%203.jpg' },
    { id: 104, title: 'Shadow of Spring', likes: 88500, views: 799000, comments: 17400, image: '/assets/Trending%20Now/Trending%204.jpg' },
    { id: 105, title: 'My Hidden Villain', likes: 86200, views: 770000, comments: 16800, image: '/assets/Trending%20Now/Trending%205.jpg' },
    { id: 106, title: 'Kiss Before Midnight', likes: 84100, views: 742000, comments: 16100, image: '/assets/Trending%20Now/Trending%206.jpg' },
  ],
  Weekly: [
    { id: 201, title: 'Royal Betrothal', likes: 180000, views: 1450000, comments: 34000, image: '/assets/Trending%20Now/Trending%207.jpg' },
    { id: 202, title: 'My Cold-Hearted Prince', likes: 171000, views: 1390000, comments: 32800, image: '/assets/Trending%20Now/Trending%208.jpg' },
    { id: 203, title: 'The Last Summer Promise', likes: 165000, views: 1320000, comments: 31500, image: '/assets/Trending%20Now/Trending%209.jpg' },
    { id: 204, title: 'Her Dangerous Roommate', likes: 154000, views: 1265000, comments: 29400, image: '/assets/Trending%20Now/Trending%2010.jpg' },
    { id: 205, title: "Softly, Don't Leave", likes: 149000, views: 1210000, comments: 28100, image: '/assets/Trending%20Now/Trending%2011.jpg' },
    { id: 206, title: 'Second Chance Bride', likes: 141000, views: 1185000, comments: 27600, image: '/assets/Trending%20Now/Trending%2012.jpg' },
  ],
  Monthly: [
    { id: 301, title: 'Empire of Roses', likes: 320000, views: 2800000, comments: 59000, image: '/assets/Trending%20Now/Trending%2013.jpg' },
    { id: 302, title: 'Call Me Again Tomorrow', likes: 301000, views: 2650000, comments: 55100, image: '/assets/Trending%20Now/Trending%2014.jpg' },
    { id: 303, title: 'Tears Under Neon Light', likes: 294000, views: 2540000, comments: 53000, image: '/assets/Trending%20Now/Trending%2015.jpg' },
    { id: 304, title: 'The Fake Engagement', likes: 280000, views: 2440000, comments: 50100, image: '/assets/Trending%20Now/Trending%2016.jpg' },
    { id: 305, title: 'Moon Over the City', likes: 268000, views: 2320000, comments: 48600, image: '/assets/Trending%20Now/Trending%2017.jpg' },
    { id: 306, title: 'One More Time, My Love', likes: 251000, views: 2240000, comments: 46200, image: '/assets/Trending%20Now/Trending%2018.jpg' },
  ],
}

function formatCount(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) {
    const num = number / 1000000
    return `${Number.isInteger(num) ? num : num.toFixed(1)}M`
  }
  if (number >= 1000) {
    const num = number / 1000
    return `${Number.isInteger(num) ? num : num.toFixed(0)}k`
  }

  return String(number)
}

function normalizeStory(story, index = 0) {
  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    likes: Number(story.total_likes || 0),
    views: Number(story.total_views || 0),
    comments: Number(story.total_comments || 0),
    image: story.cover_url || `/assets/Trending%20Now/Trending%20${Math.min(index + 1, 18)}.jpg`,
    genre: story.main_genre || '',
    isAdult: Boolean(story.is_adult),
    isReal: true,
  }
}

function SortIcon({ open = false }) {
  return (
    <svg
      className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function BlankCover() {
  return <div className="h-full w-full bg-[#202124]" />
}

function TrendingBookCard({ book }) {
  const hasImage = typeof book.image === 'string' && book.image.trim() !== ''

  return (
    <Link to={`/story/${book.id}`} className="group block min-w-0">
      <div className="relative aspect-[1.42/1] overflow-hidden rounded-[16px] bg-[#202124] shadow-sm">
        {hasImage ? (
          <img
            src={book.image}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.045]"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <BlankCover />
        )}

        {book.isAdult ? (
          <div className="absolute left-2 top-2 rounded-full bg-[#fff1f1] px-2.5 py-1 text-[10px] font-extrabold text-[#e5484d]">
            18+
          </div>
        ) : null}

        {book.genre ? (
          <div className="absolute bottom-2 left-2 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
            {book.genre}
          </div>
        ) : null}
      </div>

      <div className="mt-3.5 min-w-0">
        <h3 className="truncate text-[16px] font-extrabold tracking-tight text-[#111] md:text-[17px]">
          {book.title}
        </h3>

        <div className="mt-2.5 flex items-center gap-4 text-[12px] text-[#222]">
          <span className="inline-flex items-center gap-1.5 leading-none">
            <i className="fas fa-heart text-[12px] text-[#ef4444]" />
            <span>{formatCount(book.likes)}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 leading-none">
            <i className="far fa-comment text-[12px] text-[#222]" />
            <span>{formatCount(book.comments)}</span>
          </span>
        </div>
      </div>
    </Link>
  )
}

function LoadingGrid() {
  return (
    <section className="px-4 pb-2 pt-8 md:pt-10">
      <div className="flex items-center gap-2">
        <span className="text-[28px] leading-none">🔥</span>
        <div className="h-6 w-44 animate-pulse rounded-full bg-gray-100" />
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="flex gap-2.5">
          <div className="h-9 w-20 animate-pulse rounded-full bg-gray-100" />
          <div className="h-9 w-20 animate-pulse rounded-full bg-gray-100" />
          <div className="h-9 w-20 animate-pulse rounded-full bg-gray-100" />
        </div>
        <div className="h-8 w-20 animate-pulse rounded-full bg-gray-100" />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-6 md:gap-x-5 md:gap-y-0">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <div className="aspect-[1.42/1] animate-pulse rounded-[16px] bg-gray-100" />
            <div className="mt-3.5 h-4 animate-pulse rounded-full bg-gray-100" />
            <div className="mt-2.5 h-3 w-2/3 animate-pulse rounded-full bg-gray-100" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default function TrendingNowSection() {
  const [activeTab, setActiveTab] = useState('Daily')
  const [sortBy, setSortBy] = useState('Likes')
  const [sortOpen, setSortOpen] = useState(false)
  const [realStories, setRealStories] = useState({
    Daily: [],
    Weekly: [],
    Monthly: [],
  })
  const [loading, setLoading] = useState(true)
  const sortRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    let ignore = false

    async function fetchTrendingStories() {
      try {
        setLoading(true)

        const [dailyResponse, weeklyResponse, monthlyResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/public/stories?limit=6&sort=likes`),
          fetch(`${API_BASE_URL}/api/public/stories?limit=6&sort=popular`),
          fetch(`${API_BASE_URL}/api/public/stories?limit=6&sort=updated`),
        ])

        const dailyData = await dailyResponse.json().catch(() => ({}))
        const weeklyData = await weeklyResponse.json().catch(() => ({}))
        const monthlyData = await monthlyResponse.json().catch(() => ({}))

        if (!dailyResponse.ok || dailyData.ok === false) {
          throw new Error(dailyData.message || 'Failed to load daily trending')
        }

        if (!weeklyResponse.ok || weeklyData.ok === false) {
          throw new Error(weeklyData.message || 'Failed to load weekly trending')
        }

        if (!monthlyResponse.ok || monthlyData.ok === false) {
          throw new Error(monthlyData.message || 'Failed to load monthly trending')
        }

        if (ignore) return

        setRealStories({
          Daily: (dailyData.stories || []).map(normalizeStory),
          Weekly: (weeklyData.stories || []).map(normalizeStory),
          Monthly: (monthlyData.stories || []).map(normalizeStory),
        })
      } catch (error) {
        console.error('TrendingNowSection fetch error:', error)

        if (!ignore) {
          setRealStories({
            Daily: [],
            Weekly: [],
            Monthly: [],
          })
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchTrendingStories()

    return () => {
      ignore = true
    }
  }, [])

  const books = useMemo(() => {
    const baseList = realStories[activeTab]?.length ? realStories[activeTab] : fallbackTrendingData[activeTab]
    const list = [...baseList]

    const keyMap = {
      Likes: 'likes',
      Views: 'views',
      Comments: 'comments',
    }

    const sortKey = keyMap[sortBy]
    list.sort((a, b) => Number(b[sortKey] || 0) - Number(a[sortKey] || 0))

    return list
  }, [activeTab, sortBy, realStories])

  if (loading) {
    return <LoadingGrid />
  }

  return (
    <section className="px-4 pb-2 pt-8 md:pt-10">
      <div className="flex items-center gap-2">
        <span className="text-[28px] leading-none">🔥</span>
        <h2 className="text-[20px] font-black uppercase tracking-tight text-[#111] md:text-[22px]">
          TRENDING NOW
        </h2>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="flex min-w-0 gap-2.5 overflow-x-auto no-scrollbar">
          {trendTabs.map((tab) => {
            const active = tab === activeTab
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 rounded-full border px-5 py-2 text-[13px] font-medium transition-colors md:px-5 md:py-2 md:text-[13px] ${
                  active
                    ? 'border-[#2047f4] bg-[#2047f4] text-white shadow-[0_4px_12px_rgba(32,71,244,0.18)]'
                    : 'border-[#dddddd] bg-white text-[#222] hover:bg-[#f7f7f7]'
                }`}
              >
                {tab}
              </button>
            )
          })}
        </div>

        <div className="relative shrink-0" ref={sortRef}>
          <button
            type="button"
            onClick={() => setSortOpen((value) => !value)}
            className="inline-flex items-center gap-2 rounded-full border border-transparent px-2 py-1 text-[13px] font-medium text-[#1c1c1c] transition hover:bg-black/[0.03] md:text-[13px]"
          >
            <span>Sort by</span>
            <SortIcon open={sortOpen} />
          </button>

          {sortOpen ? (
            <div className="absolute right-0 top-11 z-20 w-[150px] overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_14px_30px_rgba(0,0,0,0.10)]">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setSortBy(option)
                    setSortOpen(false)
                  }}
                  className={`block w-full px-4 py-3 text-left text-[13px] transition-colors ${
                    sortBy === option
                      ? 'bg-[#f4f6ff] font-bold text-[#2047f4]'
                      : 'text-[#222] hover:bg-[#f7f7f7]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-6 md:gap-x-5 md:gap-y-0">
        {books.map((book) => (
          <TrendingBookCard key={book.id} book={book} />
        ))}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  )
}
