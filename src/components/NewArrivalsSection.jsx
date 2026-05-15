import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const badgeStyles = {
  red: 'bg-red-500 text-white',
  yellow: 'bg-yellow-400 text-black',
  green: 'bg-lime-400 text-black',
}

const newArrivalsTabs = ['Fresh', 'Popular', 'Recent Complete']

const createFallbackBook = (
  id,
  imageNumber,
  title,
  author,
  badge,
  badgeColor,
  likes,
  views,
  link = `/story/${id}`
) => ({
  id,
  title,
  author,
  badge,
  badgeColor,
  likes,
  views,
  link,
  cover: `/assets/New Arrival/New Arrival ${imageNumber}.jpg`,
  isFallback: true,
})

const fallbackNewArrivalsData = {
  Fresh: [
    createFallbackBook(401, 1, 'Name Book', 'Author Name', 'NEW', 'red', '1000', '100k'),
    createFallbackBook(402, 2, 'Name Book', 'Author Name', 'UP', 'yellow', '920', '88k'),
    createFallbackBook(403, 3, 'Name Book', 'Author Name', 'END', 'green', '860', '74k'),
    createFallbackBook(404, 4, 'Name Book', 'Author Name', 'NEW', 'red', '1.4k', '120k'),
    createFallbackBook(405, 5, 'Name Book', 'Author Name', 'UP', 'yellow', '980', '93k'),
    createFallbackBook(406, 6, 'Name Book', 'Author Name', 'END', 'green', '710', '68k'),
  ],
  Popular: [
    createFallbackBook(407, 7, 'Name Book', 'Author Name', 'NEW', 'red', '2.4k', '210k'),
    createFallbackBook(408, 8, 'Name Book', 'Author Name', 'UP', 'yellow', '2.1k', '196k'),
    createFallbackBook(409, 9, 'Name Book', 'Author Name', 'END', 'green', '1.8k', '172k'),
    createFallbackBook(410, 10, 'Name Book', 'Author Name', 'NEW', 'red', '2.0k', '184k'),
    createFallbackBook(411, 11, 'Name Book', 'Author Name', 'UP', 'yellow', '1.7k', '160k'),
    createFallbackBook(412, 12, 'Name Book', 'Author Name', 'END', 'green', '1.5k', '145k'),
  ],
  'Recent Complete': [
    createFallbackBook(413, 13, 'Name Book', 'Author Name', 'END', 'green', '1.3k', '110k'),
    createFallbackBook(414, 14, 'Name Book', 'Author Name', 'END', 'green', '1.1k', '102k'),
    createFallbackBook(415, 15, 'Name Book', 'Author Name', 'END', 'green', '980', '95k'),
    createFallbackBook(416, 16, 'Name Book', 'Author Name', 'END', 'green', '920', '89k'),
    createFallbackBook(417, 17, 'Name Book', 'Author Name', 'END', 'green', '870', '84k'),
    createFallbackBook(418, 18, 'Name Book', 'Author Name', 'END', 'green', '810', '79k'),
  ],
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`

  return String(number)
}

function normalizeStory(story, index = 0, tab = 'Fresh') {
  const badgeByTab = {
    Fresh: 'NEW',
    Popular: 'UP',
    'Recent Complete': 'END',
  }

  const badgeColorByTab = {
    Fresh: 'red',
    Popular: 'yellow',
    'Recent Complete': 'green',
  }

  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    author: story.author_name || 'Shadow Author',
    badge: badgeByTab[tab] || 'NEW',
    badgeColor: badgeColorByTab[tab] || 'red',
    likes: formatCompactNumber(story.total_likes),
    views: formatCompactNumber(story.total_views),
    cover: story.cover_url || `/assets/New Arrival/New Arrival ${Math.min(index + 1, 18)}.jpg`,
    link: `/story/${story.id}`,
    genre: story.main_genre || '',
    isAdult: Boolean(story.is_adult),
    isFallback: false,
  }
}

function BookCard({ book, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group block w-full text-left"
    >
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

          {book.badge && (
            <div
              className={`absolute right-2 top-2 rounded-full px-3 py-1 text-[10px] font-extrabold sm:text-[11px] ${
                badgeStyles[book.badgeColor] || 'bg-black text-white'
              }`}
            >
              {book.badge}
            </div>
          )}

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
        </div>
      </div>
    </button>
  )
}

function LoadingGrid() {
  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-6 w-44 animate-pulse rounded-full bg-gray-100" />
        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-100" />
      </div>

      <div className="mb-5 flex gap-3 overflow-hidden">
        <div className="h-10 w-20 animate-pulse rounded-full bg-gray-100" />
        <div className="h-10 w-24 animate-pulse rounded-full bg-gray-100" />
        <div className="h-10 w-32 animate-pulse rounded-full bg-gray-100" />
      </div>

      <div className="grid grid-cols-3 gap-x-4 gap-y-6 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <div className="aspect-[2/3] animate-pulse rounded-2xl bg-gray-100" />
            <div className="mt-3 h-4 animate-pulse rounded-full bg-gray-100" />
            <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-gray-100" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default function NewArrivalsSection() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Fresh')
  const [realBooks, setRealBooks] = useState({
    Fresh: [],
    Popular: [],
    'Recent Complete': [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function fetchNewArrivals() {
      try {
        setLoading(true)

        const [freshResponse, popularResponse, recentResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/public/stories?limit=6&sort=latest`),
          fetch(`${API_BASE_URL}/api/public/stories?limit=6&sort=popular`),
          fetch(`${API_BASE_URL}/api/public/stories?limit=6&sort=updated`),
        ])

        const freshData = await freshResponse.json().catch(() => ({}))
        const popularData = await popularResponse.json().catch(() => ({}))
        const recentData = await recentResponse.json().catch(() => ({}))

        if (!freshResponse.ok || freshData.ok === false) {
          throw new Error(freshData.message || 'Failed to load fresh stories')
        }

        if (!popularResponse.ok || popularData.ok === false) {
          throw new Error(popularData.message || 'Failed to load popular stories')
        }

        if (!recentResponse.ok || recentData.ok === false) {
          throw new Error(recentData.message || 'Failed to load recent stories')
        }

        if (ignore) return

        setRealBooks({
          Fresh: (freshData.stories || []).map((story, index) => normalizeStory(story, index, 'Fresh')),
          Popular: (popularData.stories || []).map((story, index) => normalizeStory(story, index, 'Popular')),
          'Recent Complete': (recentData.stories || []).map((story, index) => normalizeStory(story, index, 'Recent Complete')),
        })
      } catch (error) {
        console.error('NewArrivalsSection fetch error:', error)

        if (!ignore) {
          setRealBooks({
            Fresh: [],
            Popular: [],
            'Recent Complete': [],
          })
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchNewArrivals()

    return () => {
      ignore = true
    }
  }, [])

  const books = useMemo(() => {
    const list = realBooks[activeTab]
    return list?.length ? list : fallbackNewArrivalsData[activeTab] || []
  }, [activeTab, realBooks])

  if (loading) {
    return <LoadingGrid />
  }

  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[20px]">🚀</span>
          <h2 className="text-[18px] font-extrabold tracking-tight text-neutral-900">
            New Arrivals
          </h2>
        </div>

        <button
          type="button"
          onClick={() => navigate('/new-arrivals')}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
          aria-label="Go to New Arrivals page"
        >
          <i className="fas fa-chevron-right text-[15px] text-gray-700" />
        </button>
      </div>

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

      <div className="grid grid-cols-3 gap-x-4 gap-y-6 lg:grid-cols-6">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onClick={() => navigate(book.link)}
          />
        ))}
      </div>
    </section>
  )
}
