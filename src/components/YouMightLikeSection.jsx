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



function normalizeStory(story, index = 0) {
  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    cover: story.cover_url || `/assets/YouMightLike/YouMightLike ${Math.min(index + 1, 6)}.jpg`,
    link: `/story/${story.id}`,
    isAdult: Boolean(story.is_adult),
    genre: story.main_genre || '',
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
              event.currentTarget.src = '/assets/YouMightLike/YouMightLike 1.jpg'
            }}
          />

          {book.isAdult ? (
            <div className="absolute bottom-2 left-2 rounded-full bg-[#fff1f1] px-2.5 py-1 text-[10px] font-extrabold text-[#e5484d]">
              18+
            </div>
          ) : null}
        </div>

        <div className="mt-2 w-full">
          <h3 className="block w-full max-w-full overflow-hidden whitespace-nowrap text-ellipsis text-[14px] font-[640] leading-[20px] text-neutral-900">
            {book.title}
          </h3>

          <p className="mt-1 truncate text-[11.5px] font-normal text-gray-400">
            {book.genre}
          </p>
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
            <div className="aspect-[2/3] animate-pulse rounded-[8px] bg-gray-100" />
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
          <span className="text-[20px] lg:text-[21px]">🙂</span>
          <h2 className="text-[18px] font-extrabold tracking-tight text-neutral-900 lg:text-[19px]">
            You Might Like
          </h2>
        </div>

        <button
  type="button"
  onClick={() => navigate('/you-might-like')}
  className="flex h-8 w-8 items-center justify-end rounded-full transition-colors hover:bg-gray-100"
  aria-label="Go to You Might Like page"
>
  <i className="fas fa-chevron-right text-[15px] text-gray-700 lg:text-[16px]" />
</button>
      </div>

      <div className="grid grid-cols-3 gap-x-4 gap-y-6 lg:grid-cols-6">
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
