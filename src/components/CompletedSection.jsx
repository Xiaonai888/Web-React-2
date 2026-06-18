import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addStoryLanguageParam } from '../utils/storyLanguage'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

function normalizeStory(story, index = 0) {
  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    genre: story.main_genre || '',
    cover:
      story.cover_url ||
      `/assets/Completed/Completed ${Math.min(index + 1, 27)}.jpg`,
    link: `/story/${story.id}`,
  }
}

function BookCard({ book, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group block w-full border-0 bg-transparent p-0 text-left"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[8px] bg-gray-100 shadow-sm">
        <img
          src={book.cover}
          alt={book.title}
          className="pointer-events-none h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          loading="lazy"
          draggable="false"
          onError={(event) => {
            event.currentTarget.src = '/assets/Completed/Completed 1.jpg'
          }}
        />
      </div>

      <h3 className="mt-2 block w-full overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-[640] leading-[20px] text-neutral-900">
        {book.title}
      </h3>

      <p className="mt-1 line-clamp-1 min-h-[17px] text-[11.5px] font-medium text-gray-500">
        {book.genre}
      </p>
    </button>
  )
}

function LoadingCompleted() {
  return (
    <section className="px-4 pb-2 sm:px-5 lg:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-6 w-32 animate-pulse rounded-full bg-gray-100" />
        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-100" />
      </div>

      <div className="flex gap-2 overflow-hidden md:gap-3">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="w-[calc((100%_-_8px)/2)] shrink-0 md:min-w-[112px] md:w-[calc((100%_-_60px)/6)] lg:min-w-[92px] lg:w-[calc((100%_-_132px)/12)]"
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

export default function CompletedSection() {
  const navigate = useNavigate()
  const scrollRef = useRef(null)
  const isDraggingRef = useRef(false)
  const dragMovedRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)

  useEffect(() => {
    let ignore = false

    async function fetchCompletedStories() {
      try {
        setLoading(true)
        setLoadFailed(false)

        const response = await fetch(
          addStoryLanguageParam(
            `${API_BASE_URL}/api/public/stories?limit=12&sort=latest&story_status=Completed`
          )
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load completed stories')
        }

        if (ignore) return

        const completedBooks = (data.stories || [])
          .filter((story) => Number(story.total_episodes || 0) >= 1)
          .filter(
            (story) =>
              Boolean(story.is_completed) ||
              String(story.story_status || '').trim().toLowerCase() === 'completed'
          )
          .map(normalizeStory)
          .slice(0, 12)

        setBooks(completedBooks)
      } catch (error) {
        console.error('CompletedSection fetch error:', error)

        if (!ignore) {
          setLoadFailed(true)
          setBooks([])
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchCompletedStories()

    return () => {
      ignore = true
    }
  }, [])

  const handleMouseDown = (event) => {
    const container = scrollRef.current
    if (!container) return

    isDraggingRef.current = true
    dragMovedRef.current = false
    startXRef.current = event.pageX - container.offsetLeft
    scrollLeftRef.current = container.scrollLeft
    container.style.scrollSnapType = 'none'
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

    if (scrollRef.current) {
      scrollRef.current.style.scrollSnapType = ''
    }
  }

  const openBook = (link) => {
    if (dragMovedRef.current) {
      dragMovedRef.current = false
      return
    }

    navigate(link)
  }

  if (loading) {
    return <LoadingCompleted />
  }

  return (
    <section className="px-4 pb-2 sm:px-5 lg:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[20px] lg:text-[21px]">😁</span>
          <h2 className="text-[18px] font-extrabold tracking-tight text-neutral-900 lg:text-[19px]">
            Completed
          </h2>
        </div>

        <button
          type="button"
          onClick={() => navigate('/completed')}
          className="flex h-8 w-8 items-center justify-end rounded-full transition-colors hover:bg-gray-100"
          aria-label="Go to Completed page"
        >
          <i className="fas fa-chevron-right text-[15px] text-gray-700 lg:text-[16px]" />
        </button>
      </div>

      {books.length ? (
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopMouseDrag}
          onMouseLeave={stopMouseDrag}
          className="scrollbar-none flex cursor-grab snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth select-none active:cursor-grabbing md:gap-3"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {books.map((book) => (
            <div
              key={book.id}
              className="w-[calc((100%_-_8px)/2)] shrink-0 snap-start md:min-w-[112px] md:w-[calc((100%_-_60px)/6)] lg:min-w-[92px] lg:w-[calc((100%_-_132px)/12)]"
            >
              <BookCard book={book} onOpen={() => openBook(book.link)} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[22px] bg-[#f8f8fb] px-4 py-6 text-center">
          <div className="text-[14px] font-extrabold text-[#111827]">
            {loadFailed
              ? 'Could not load completed stories'
              : 'No completed stories yet'}
          </div>
          <div className="mt-1 text-[12px] text-[#8d94a1]">
            Completed stories with at least one episode will appear here.
          </div>
        </div>
      )}
    </section>
  )
}
