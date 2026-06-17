import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addStoryLanguageParam } from '../utils/storyLanguage'


const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const fallbackBooks = Array.from({ length: 6 }).map((_, index) => ({
  id: 900 + index,
  title: 'Name Book',
  cover: `/assets/YouMightLike/YouMightLike ${index + 1}.jpg`,
  likes: '1000',
  episodes: 'Ep 17',
  link: `/story/${900 + index}`,
  isAdult: false,
  genre: '',
}))

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`

  return String(number)
}

function normalizeStory(story, index = 0) {
  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    cover: story.cover_url || `/assets/YouMightLike/YouMightLike ${Math.min(index + 1, 6)}.jpg`,
    likes: formatCompactNumber(story.total_likes),
    episodes: `Ep ${Number(story.total_episodes || 0)}`,
    link: `/story/${story.id}`,
    isAdult: Boolean(story.is_adult),
    genre: story.main_genre || '',
  }
}

function BookCard({ book }) {
  return (
    <div className="group block w-full">
      <div className="flex flex-col items-start">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
          <img
            src={book.cover}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = '/assets/YouMightLike/YouMightLike 1.jpg'
            }}
          />

          {book.isAdult ? (
            <div className="absolute bottom-2 left-2 rounded-full bg-[#fff1f1] px-2.5 py-1 text-[10px] font-extrabold text-[#e5484d]">
              18+
            </div>
          ) : null}

          {book.genre ? (
            <div className="absolute left-2 top-2 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
              {book.genre}
            </div>
          ) : null}
        </div>

        <div className="mt-3 w-full">
          <h3 className="line-clamp-2 min-h-[42px] text-[15px] font-extrabold leading-[21px] tracking-tight text-neutral-900">
            {book.title}
          </h3>

          <div className="mt-2 flex items-center gap-3 text-[13px] text-gray-600">
            <div className="flex items-center gap-1">
              <i className="fas fa-heart text-[12px] text-red-500" />
              <span className="font-medium">{book.likes}</span>
            </div>

            <div className="flex items-center gap-1">
              <i className="fas fa-list text-[12px]" />
              <span className="font-medium">{book.episodes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingGrid() {
  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-6 w-44 animate-pulse rounded-full bg-gray-100" />
        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-100" />
      </div>

      <div className="flex snap-x gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible">
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

export default function YouMightLikeSection() {
  const navigate = useNavigate()
  const [realBooks, setRealBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function fetchYouMightLike() {
      try {
        setLoading(true)

        const response = await fetch(
  addStoryLanguageParam(`${API_BASE_URL}/api/public/stories?limit=6&sort=popular`)
)
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load You Might Like')
        }

        if (ignore) return

        setRealBooks((data.stories || []).map(normalizeStory))
      } catch (error) {
        console.error('YouMightLikeSection fetch error:', error)

        if (!ignore) {
          setRealBooks([])
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchYouMightLike()

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
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[20px]">🙂</span>
          <h2 className="text-[18px] font-extrabold tracking-tight text-neutral-900">
            You Might Like
          </h2>
        </div>

        <button
          type="button"
          onClick={() => navigate('/you-might-like')}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
          aria-label="Go to You Might Like page"
        >
          <i className="fas fa-chevron-right text-[15px] text-gray-700" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-x-4 gap-y-6 lg:grid-cols-6">
        {books.map((book) => (
          <button
            key={book.id}
            type="button"
            onClick={() => navigate(book.link)}
            className="w-[42%] shrink-0 snap-start text-left sm:w-[30%] lg:w-full"
          >
            <BookCard book={book} />
          </button>
        ))}
      </div>
    </section>
  )
}
