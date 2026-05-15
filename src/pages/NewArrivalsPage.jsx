import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const badgeStyles = {
  red: 'bg-red-500 text-white',
  yellow: 'bg-yellow-400 text-black',
  green: 'bg-lime-400 text-black',
}

const newArrivalsTabs = ['Fresh', 'Popular', 'Recent Complete', 'Romance', 'Fantasy']

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`

  return String(number)
}

function createFallbackBook(id, imageNumber, tab = 'Fresh') {
  const badgeByTab = {
    Fresh: ['NEW', 'red'],
    Popular: ['UP', 'yellow'],
    'Recent Complete': ['END', 'green'],
    Romance: ['NEW', 'red'],
    Fantasy: ['UP', 'yellow'],
  }

  const [badge, badgeColor] = badgeByTab[tab] || badgeByTab.Fresh

  return {
    id,
    title: 'Name Book',
    author: 'Author Name',
    badge,
    badgeColor,
    likes: '1000',
    views: '100k',
    episodes: 'Ep 17',
    cover: `/assets/New Arrival/New Arrival ${imageNumber}.jpg`,
    link: `/story/${id}`,
    genre: tab === 'Fantasy' ? 'Fantasy' : tab === 'Romance' ? 'Romance' : '',
    isAdult: false,
    isFallback: true,
  }
}

const fallbackBooks = {
  Fresh: Array.from({ length: 18 }).map((_, index) => createFallbackBook(401 + index, (index % 18) + 1, 'Fresh')),
  Popular: Array.from({ length: 18 }).map((_, index) => createFallbackBook(501 + index, (index % 18) + 1, 'Popular')),
  'Recent Complete': Array.from({ length: 18 }).map((_, index) => createFallbackBook(601 + index, (index % 18) + 1, 'Recent Complete')),
  Romance: Array.from({ length: 18 }).map((_, index) => createFallbackBook(701 + index, (index % 18) + 1, 'Romance')),
  Fantasy: Array.from({ length: 18 }).map((_, index) => createFallbackBook(801 + index, (index % 18) + 1, 'Fantasy')),
}

function normalizeStory(story, index = 0, tab = 'Fresh') {
  const badgeByTab = {
    Fresh: ['NEW', 'red'],
    Popular: ['UP', 'yellow'],
    'Recent Complete': ['END', 'green'],
    Romance: ['NEW', 'red'],
    Fantasy: ['UP', 'yellow'],
  }

  const [badge, badgeColor] = badgeByTab[tab] || badgeByTab.Fresh

  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    author: story.author_name || 'Shadow Author',
    badge,
    badgeColor,
    likes: formatCompactNumber(story.total_likes),
    views: formatCompactNumber(story.total_views),
    episodes: `Ep ${Number(story.total_episodes || 0)}`,
    cover: story.cover_url || `/assets/New Arrival/New Arrival ${Math.min(index + 1, 18)}.jpg`,
    link: `/story/${story.id}`,
    genre: story.main_genre || '',
    isAdult: Boolean(story.is_adult),
    isFallback: false,
  }
}

function BookCard({ book }) {
  return (
    <Link to={book.link} className="group block">
      <div className="flex flex-col items-start">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
          <img
            src={book.cover}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = '/assets/New Arrival/New Arrival 1.jpg'
            }}
          />

          <div className={`absolute right-2 top-2 rounded-full px-3 py-1 text-[10px] font-extrabold sm:text-[11px] ${badgeStyles[book.badgeColor] || 'bg-black text-white'}`}>
            {book.badge}
          </div>

          {book.isAdult ? (
            <div className="absolute bottom-2 left-2 rounded-full bg-[#fff1f1] px-2.5 py-1 text-[10px] font-extrabold text-[#e5484d]">
              18+
            </div>
          ) : null}
        </div>

        <div className="mt-3 w-full">
          <h3 className="line-clamp-2 text-[16px] font-extrabold leading-snug tracking-tight text-neutral-900">
            {book.title}
          </h3>

          <p className="mt-1 line-clamp-1 text-[13px] font-medium text-gray-500">
            {book.author}
          </p>

          {book.genre ? (
            <div className="mt-2">
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10.5px] font-bold text-gray-500">
                {book.genre}
              </span>
            </div>
          ) : null}

          <div className="mt-2 flex items-center gap-4 text-[13px] text-gray-600">
            <div className="flex items-center gap-1">
              <i className="fas fa-heart text-[12px] text-red-500" />
              <span>{book.likes}</span>
            </div>

            <div className="flex items-center gap-1">
              <i className="fas fa-eye text-[12px]" />
              <span>{book.views}</span>
            </div>
          </div>

          <div className="mt-1.5 flex items-center gap-1 text-[12px] text-gray-500">
            <i className="fas fa-list text-[11px]" />
            <span>{book.episodes}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-6 lg:grid-cols-6">
      {Array.from({ length: 18 }).map((_, index) => (
        <div key={index}>
          <div className="aspect-[2/3] animate-pulse rounded-2xl bg-gray-100" />
          <div className="mt-3 h-4 animate-pulse rounded-full bg-gray-100" />
          <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-gray-100" />
        </div>
      ))}
    </div>
  )
}

function EmptyState({ onRefresh }) {
  return (
    <div className="rounded-2xl bg-white px-5 py-12 text-center shadow-sm ring-1 ring-gray-100">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
        <i className="fa-regular fa-file-lines text-[22px]" />
      </div>

      <h2 className="mt-4 text-[17px] font-extrabold text-neutral-900">
        No new arrivals yet
      </h2>

      <p className="mx-auto mt-2 max-w-[320px] text-[13px] leading-6 text-gray-500">
        Published stories will appear here after authors publish their episodes.
      </p>

      <button
        type="button"
        onClick={onRefresh}
        className="mt-5 rounded-full bg-neutral-950 px-5 py-3 text-[13px] font-extrabold text-white active:scale-95"
      >
        Refresh
      </button>
    </div>
  )
}

export default function NewArrivalsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Fresh')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [realBooks, setRealBooks] = useState({
    Fresh: [],
    Popular: [],
    'Recent Complete': [],
    Romance: [],
    Fantasy: [],
  })

  async function fetchNewArrivalsPageData() {
    try {
      setLoading(true)
      setMessage('')

      const [freshResponse, popularResponse, recentResponse, romanceResponse, fantasyResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/public/stories?limit=48&sort=latest`),
        fetch(`${API_BASE_URL}/api/public/stories?limit=48&sort=popular`),
        fetch(`${API_BASE_URL}/api/public/stories?limit=48&sort=updated`),
        fetch(`${API_BASE_URL}/api/public/stories?limit=48&sort=latest&genre=Romance`),
        fetch(`${API_BASE_URL}/api/public/stories?limit=48&sort=latest&genre=Fantasy`),
      ])

      const freshData = await freshResponse.json().catch(() => ({}))
      const popularData = await popularResponse.json().catch(() => ({}))
      const recentData = await recentResponse.json().catch(() => ({}))
      const romanceData = await romanceResponse.json().catch(() => ({}))
      const fantasyData = await fantasyResponse.json().catch(() => ({}))

      if (!freshResponse.ok || freshData.ok === false) throw new Error(freshData.message || 'Failed to load fresh stories')
      if (!popularResponse.ok || popularData.ok === false) throw new Error(popularData.message || 'Failed to load popular stories')
      if (!recentResponse.ok || recentData.ok === false) throw new Error(recentData.message || 'Failed to load recent stories')
      if (!romanceResponse.ok || romanceData.ok === false) throw new Error(romanceData.message || 'Failed to load romance stories')
      if (!fantasyResponse.ok || fantasyData.ok === false) throw new Error(fantasyData.message || 'Failed to load fantasy stories')

      setRealBooks({
        Fresh: (freshData.stories || []).map((story, index) => normalizeStory(story, index, 'Fresh')),
        Popular: (popularData.stories || []).map((story, index) => normalizeStory(story, index, 'Popular')),
        'Recent Complete': (recentData.stories || []).map((story, index) => normalizeStory(story, index, 'Recent Complete')),
        Romance: (romanceData.stories || []).map((story, index) => normalizeStory(story, index, 'Romance')),
        Fantasy: (fantasyData.stories || []).map((story, index) => normalizeStory(story, index, 'Fantasy')),
      })
    } catch (error) {
      console.error('NewArrivalsPage fetch error:', error)

      setRealBooks({
        Fresh: [],
        Popular: [],
        'Recent Complete': [],
        Romance: [],
        Fantasy: [],
      })

      setMessage(
        error.message === 'Failed to fetch'
          ? 'Cannot connect to server. Please try again later.'
          : error.message || 'Failed to load new arrivals'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNewArrivalsPageData()
  }, [])

  const books = useMemo(() => {
    const realList = realBooks[activeTab]
    return realList?.length ? realList : message ? [] : fallbackBooks[activeTab] || []
  }, [activeTab, realBooks, message])

  return (
    <div className="min-h-screen bg-white pb-32">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white shadow-sm">
        <div className="flex h-14 items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
            aria-label="Go back"
          >
            <i className="fas fa-chevron-left text-[18px] text-gray-700" />
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="text-[20px]">🚀</span>
            <h1 className="line-clamp-1 text-[18px] font-extrabold tracking-tight text-neutral-900">
              New Arrivals
            </h1>
          </div>

          <button
            type="button"
            onClick={fetchNewArrivalsPageData}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 active:scale-95"
            aria-label="Refresh"
          >
            <i className="fa-solid fa-rotate-right text-[15px]" />
          </button>
        </div>
      </header>

      <main className="px-4 pt-4">
        <div className="mb-5 flex gap-3 overflow-x-auto pb-1 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {newArrivalsTabs.map((tab) => {
            const isActive = activeTab === tab

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'border-black bg-black text-white'
                    : 'border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50'
                }`}
              >
                {tab}
              </button>
            )
          })}
        </div>

        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mb-4 w-full rounded-[16px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#e5484d]"
          >
            {message}
          </button>
        ) : null}

        {loading ? (
          <LoadingGrid />
        ) : books.length ? (
          <div className="grid grid-cols-3 gap-x-4 gap-y-6 lg:grid-cols-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <EmptyState onRefresh={fetchNewArrivalsPageData} />
        )}
      </main>
    </div>
  )
}
