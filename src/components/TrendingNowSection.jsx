import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { addStoryLanguageParam } from '../utils/storyLanguage'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const fallbackTrendingStories = [
  { id: 201, title: 'Royal Betrothal', image: '/assets/Trending%20Now/Trending%207.jpg', genre: 'Romance' },
  { id: 202, title: 'My Cold-Hearted Prince', image: '/assets/Trending%20Now/Trending%208.jpg', genre: 'Romance' },
  { id: 203, title: 'The Last Summer Promise', image: '/assets/Trending%20Now/Trending%209.jpg', genre: 'Drama' },
  { id: 204, title: 'Her Dangerous Roommate', image: '/assets/Trending%20Now/Trending%2010.jpg', genre: 'Romance' },
  { id: 205, title: "Softly, Don't Leave", image: '/assets/Trending%20Now/Trending%2011.jpg', genre: 'Romance' },
  { id: 206, title: 'Second Chance Bride', image: '/assets/Trending%20Now/Trending%2012.jpg', genre: 'Romance' },
]

function normalizeStory(story, index = 0) {
  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    image:
      story.landscape_thumbnail_url ||
      story.cover_url ||
      `/assets/Trending%20Now/Trending%20${Math.min(index + 1, 18)}.jpg`,
    genre: story.main_genre || '',
    isAdult: Boolean(story.is_adult),
  }
}

function BlankCover() {
  return <div className="h-full w-full bg-[#202124]" />
}

function TrendingBookCard({ book }) {
  const hasImage =
    typeof book.image === 'string' && book.image.trim() !== ''

  return (
    <Link to={`/story/${book.id}`} className="group block min-w-0">
      <div className="relative aspect-[1.42/1] overflow-hidden rounded-[8px] bg-[#202124] shadow-sm">
        {hasImage ? (
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
        ) : (
          <BlankCover />
        )}

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

  <div className="mt-1 min-h-[18px]">
    {book.genre ? (
      <span className="inline-flex max-w-full truncate rounded-[4px] bg-[#F3F4F6] px-2 py-1 text-[10px] font-medium leading-none text-[#6B7280]">
        {book.genre}
      </span>
    ) : null}
  </div>
</div>
    </Link>
  )
}

function LoadingGrid() {
  return (
    <section className="px-3 pb-2 pt-8 md:px-4 md:pt-10">
      <div className="flex items-center gap-2">
        <span className="text-[24px] leading-none">🔥</span>
        <div className="h-6 w-36 animate-pulse rounded-full bg-gray-100" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-6 md:grid-cols-6 md:gap-x-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <div className="aspect-[1.42/1] animate-pulse rounded-[8px] bg-gray-100" />
            <div className="mt-2 h-4 animate-pulse rounded-full bg-gray-100" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default function TrendingNowSection() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function fetchTrendingStories() {
      try {
        setLoading(true)

        const response = await fetch(
          addStoryLanguageParam(
            `${API_BASE_URL}/api/public/stories?limit=6&sort=popular`
          )
        )

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load trending stories')
        }

        if (!ignore) {
          setStories((data.stories || []).map(normalizeStory))
        }
      } catch (error) {
        console.error('TrendingNowSection fetch error:', error)

        if (!ignore) {
          setStories([])
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    fetchTrendingStories()

    return () => {
      ignore = true
    }
  }, [])

  if (loading) {
    return <LoadingGrid />
  }

  const books = stories.length ? stories : fallbackTrendingStories

  return (
    <section className="px-3 pb-2 pt-8 md:px-4 md:pt-10">
      <div className="flex items-center gap-2">
        <span className="text-[24px] leading-none">🔥</span>
        <h2 className="text-[18px] font-extrabold tracking-tight text-neutral-900 lg:text-[19px]">
          Trending Now
        </h2>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-6 md:grid-cols-6 md:gap-x-3">
        {books.map((book) => (
          <TrendingBookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  )
}
