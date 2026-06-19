import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addStoryLanguageParam } from '../utils/storyLanguage'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const fallbackBooks = Array.from({ length: 6 }).map((_, index) => ({
  id: 601 + index,
  title: 'Name Book',
  cover: `/assets/FanPicksSection/FanPicksSection ${index + 1}.jpg`,
  link: `/story/${601 + index}`,
  genre: 'Discover More',
}))

function normalizeStory(story, index = 0) {
  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    cover: story.cover_url || `/assets/FanPicksSection/FanPicksSection ${Math.min(index + 1, 6)}.jpg`,
    link: `/story/${story.id}`,
    genre: story.main_genre || 'Discover More',
  }
}

function BookCard({ book }) {
  return (
    <div className="group block w-full">
      <div className="flex flex-col items-start">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[8px] bg-gray-100 shadow-sm">
          <img
            src={book.cover}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = '/assets/FanPicksSection/FanPicksSection 1.jpg'
            }}
          />
        </div>

        <h3 className="block w-full max-w-full overflow-hidden whitespace-nowrap text-ellipsis text-[14px] font-[640] leading-[20px] text-neutral-900">
          {book.title}
        </h3>

        <p className="mt-1 line-clamp-1 text-[11.5px] font-medium text-gray-500">
          {book.genre || 'Discover More'}
        </p>
      </div>
    </div>
  )
}

function LoadingGrid() {
  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-6 w-36 animate-pulse rounded-full bg-gray-100" />
      </div>

      <div className="scrollbar-none flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-5 lg:gap-x-3 lg:gap-y-6 lg:overflow-visible lg:pb-0"
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <div className="aspect-[2/3] animate-pulse rounded-[8px] bg-gray-100" />
            <div className="mt-2 h-4 animate-pulse rounded-full bg-gray-100" />
            <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-gray-100" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default function FanPicksSection() {
  const navigate = useNavigate()
  const [realBooks, setRealBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function fetchFanPicks() {
      try {
        setLoading(true)

        const response = await fetch(
          addStoryLanguageParam(`${API_BASE_URL}/api/public/stories?limit=6&sort=discover_more`)
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load Discover More')
        }

        if (ignore) return

        setRealBooks((data.stories || []).map(normalizeStory))
      } catch (error) {
        console.error('Discover More fetch error:', error)

        if (!ignore) {
          setRealBooks([])
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchFanPicks()

    return () => {
      ignore = true
    }
  }, [])

  const books = useMemo(() => {
    return realBooks.length ? realBooks : fallbackBooks
  }, [realBooks])

  if (loading) {
    return <LoadingGrid />
  }

  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mb-4 flex items-center gap-2">
  <span className="text-[20px]">💎</span>
  <h2 className="text-[18px] font-extrabold tracking-tight text-neutral-900">
    Hidden Gems
  </h2>
</div>

      <div className="grid grid-cols-3 gap-x-2 gap-y-6 lg:grid-cols-5 lg:gap-x-3">
        {books.map((book) => (
          <button
            key={book.id}
            type="button"
            onClick={() => navigate(book.link)}
            className="w-full text-left"
          >
            <BookCard book={book} />
          </button>
        ))}
      </div>
    </section>
  )
}
