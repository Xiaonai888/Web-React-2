import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addStoryLanguageParam } from '../utils/storyLanguage'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const fallbackTrendingStories = Array.from({ length: 9 }).map((_, index) => ({
  id: 201 + index,
  title: 'Trending Story',
  image: `/assets/New Arrival/New Arrival ${index + 1}.jpg`,
  genre: index % 2 === 0 ? 'Romance' : 'Fantasy',
  isAdult: false,
}))

function normalizeStory(story, index = 0) {
  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    image:
      story.cover_url ||
      story.landscape_thumbnail_url ||
      `/assets/New Arrival/New Arrival ${Math.min(index + 1, 18)}.jpg`,
    genre: story.main_genre || '',
    isAdult: Boolean(story.is_adult),
  }
}

function TrendingBookCard({ book, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group block w-full min-w-0 border-0 bg-transparent p-0 text-left"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-[8px] bg-[#202124] shadow-sm">
        <img
          src={book.image}
          alt={book.title}
          className="pointer-events-none h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          loading="lazy"
          decoding="async"
          draggable="false"
          onError={(event) => {
            event.currentTarget.src = '/assets/New Arrival/New Arrival 1.jpg'
          }}
        />

        {book.isAdult ? (
          <div className="absolute bottom-2 left-2 rounded-full bg-[#fff1f1] px-2.5 py-1 text-[10px] font-extrabold text-[#e5484d]">
            18+
          </div>
        ) : null}
      </div>

      <h3 className="mt-2 block w-full max-w-full overflow-hidden whitespace-nowrap text-ellipsis text-[14px] font-[640] leading-[20px] text-neutral-900">
        {book.title}
      </h3>

      <div className="mt-1 min-h-[18px]">
        {book.genre ? (
          <span className="inline-flex max-w-full truncate rounded-[4px] bg-[#F3F4F6] px-2 py-1 text-[10px] font-medium leading-none text-[#6B7280]">
            {book.genre}
          </span>
        ) : null}
      </div>
    </button>
  )
}

function LoadingGrid() {
  return (
    <section className="px-3 pb-2 pt-0 md:px-4 md:pt-0">
      <div className="flex items-center gap-2">
        <span className="text-[24px] leading-none">🔥</span>
        <div className="h-6 w-36 animate-pulse rounded-full bg-gray-100" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-x-2 gap-y-4 md:flex md:gap-3 md:overflow-hidden">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className="min-w-0 md:w-[calc((100%_-_60px)/6)] md:shrink-0"
          >
            <div className="aspect-[2/3] animate-pulse rounded-[8px] bg-gray-100" />
            <div className="mt-2 h-4 animate-pulse rounded-full bg-gray-100" />
            <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-gray-100" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default function TrendingNowSection() {
  const navigate = useNavigate()
  const scrollRef = useRef(null)
  const isDraggingRef = useRef(false)
  const dragMovedRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function fetchTrendingStories() {
      try {
        setLoading(true)

        const response = await fetch(
          addStoryLanguageParam(
            `${API_BASE_URL}/api/public/stories?limit=9&sort=popular`
          )
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load trending stories')
        }

        if (!ignore) {
          setStories((data.stories || []).map(normalizeStory).slice(0, 9))
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

  const handleMouseDown = (event) => {
    const container = scrollRef.current
    if (!container || window.innerWidth < 768) return

    isDraggingRef.current = true
    dragMovedRef.current = false
    startXRef.current = event.pageX - container.offsetLeft
    scrollLeftRef.current = container.scrollLeft
  }

  const handleMouseMove = (event) => {
    const container = scrollRef.current
    if (!container || !isDraggingRef.current) return

    event.preventDefault()

    const x = event.pageX - container.offsetLeft
    const walk = x - startXRef.current

    if (Math.abs(walk) > 4) {
      dragMovedRef.current = true
    }

    container.scrollLeft = scrollLeftRef.current - walk * 1.4
  }

  const stopMouseDrag = () => {
    isDraggingRef.current = false
  }

  const handleBookOpen = (bookId) => {
    if (dragMovedRef.current) {
      dragMovedRef.current = false
      return
    }

    navigate(`/story/${bookId}`)
  }

  if (loading) {
    return <LoadingGrid />
  }

  const books = stories.length ? stories : fallbackTrendingStories

  return (
    <section className="px-3 pb-2 pt-0 md:px-4 md:pt-0">
      <div className="flex items-center gap-2">
        <span className="text-[24px] leading-none">🔥</span>
        <h2 className="text-[18px] font-extrabold tracking-tight text-neutral-900 lg:text-[19px]">
          Trending Now
        </h2>
      </div>

      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopMouseDrag}
        onMouseLeave={stopMouseDrag}
        className="scrollbar-none mt-4 grid grid-cols-3 gap-x-2 gap-y-6 md:flex md:cursor-grab md:gap-3 md:overflow-x-auto md:select-none md:active:cursor-grabbing"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {books.map((book) => (
          <div
            key={book.id}
            className="min-w-0 md:w-[calc((100%_-_60px)/6)] md:shrink-0"
          >
            <TrendingBookCard
              book={book}
              onOpen={() => handleBookOpen(book.id)}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
