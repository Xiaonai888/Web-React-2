import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addStoryLanguageParam } from '../utils/storyLanguage'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const REFRESH_MS = 60 * 60 * 1000

const updateMarkerUI = {
  width: 42,
  right: 5,
  bottom: -5,
  rotate: 7,
  numberX: 0,
  numberY: 0,
  numberRotate: 0,
  numberSize: 12,
}

function normalizeStory(story) {
  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    cover:
      story.landscape_thumbnail_url ||
      story.cover_url ||
      '/assets/New Arrival/New Arrival 1.jpg',
    updateCount: Math.max(0, Number(story.weekly_update_count || 0)),
  }
}

function WeeklyCard({ book, onOpen }) {
  const updateCount = Math.max(0, Number(book.updateCount || 0))
  const updateCountText = updateCount >= 10 ? '9+' : `+${updateCount}`

  return (
    <button type="button" onClick={onOpen} className="block w-full select-none text-left">
      <div className="relative aspect-[16/9] overflow-hidden rounded-[8px] bg-[#202124] shadow-sm">
        <img
          src={book.cover}
          alt={book.title}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={(event) => {
            event.currentTarget.src = '/assets/New Arrival/New Arrival 1.jpg'
          }}
        />

        {updateCount >= 2 ? (
          <div
            className="pointer-events-none absolute z-20"
            style={{
              width: `${updateMarkerUI.width}px`,
              right: `${updateMarkerUI.right}px`,
              bottom: `${updateMarkerUI.bottom}px`,
              transform: `rotate(${updateMarkerUI.rotate}deg)`,
            }}
          >
            <img
              src="/assets/Icons/Arrow.webp"
              alt=""
              className="block h-auto w-full"
              draggable={false}
            />
            <span
              className="absolute whitespace-nowrap font-black leading-none text-[#ff3b30]"
              style={{
                left: '68%',
                top: '43%',
                fontSize: `${updateMarkerUI.numberSize}px`,
                transform: `translate(-50%, -50%) translate(${updateMarkerUI.numberX}px, ${updateMarkerUI.numberY}px) rotate(${updateMarkerUI.numberRotate}deg)`,
              }}
            >
              {updateCountText}
            </span>
          </div>
        ) : null}
      </div>

      <h3 className="mt-2 line-clamp-2 text-[13px] font-[650] leading-[18px] text-neutral-900">
        {book.title}
      </h3>
    </button>
  )
}

function LoadingRow() {
  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mb-4 h-6 w-40 animate-pulse rounded-full bg-gray-100" />
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="w-[calc((100vw-56px)/2.5)] min-w-[calc((100vw-56px)/2.5)]"
          >
            <div className="aspect-[16/9] animate-pulse rounded-[8px] bg-gray-100" />
            <div className="mt-2 h-4 animate-pulse rounded-full bg-gray-100" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default function WeeklyUpdateSection() {
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const scrollerRef = useRef(null)
  const dragRef = useRef({
    active: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
  })

  useEffect(() => {
    let ignore = false

    async function fetchWeeklyUpdates(firstLoad = false) {
      if (firstLoad) setLoading(true)

      try {
        const response = await fetch(
          addStoryLanguageParam(
            `${API_BASE_URL}/api/public/stories?limit=6&sort=weekly_updates`
          ),
          { cache: 'no-store' }
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load weekly updates')
        }

        if (!ignore) {
          setBooks(
            (data.stories || [])
              .filter((story) => Number(story.weekly_update_count || 0) > 0)
              .slice(0, 6)
              .map(normalizeStory)
          )
        }
      } catch (error) {
        console.error('WeeklyUpdateSection fetch error:', error)
        if (!ignore && firstLoad) setBooks([])
      } finally {
        if (!ignore && firstLoad) setLoading(false)
      }
    }

    fetchWeeklyUpdates(true)
    const intervalId = window.setInterval(
      () => fetchWeeklyUpdates(false),
      REFRESH_MS
    )

    return () => {
      ignore = true
      window.clearInterval(intervalId)
    }
  }, [])

  function handlePointerDown(event) {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    const element = scrollerRef.current
    if (!element) return

    dragRef.current.active = true
    dragRef.current.startX = event.clientX
    dragRef.current.scrollLeft = element.scrollLeft
    dragRef.current.moved = false
    
  }

  function handlePointerMove(event) {
    if (!dragRef.current.active || event.pointerType !== 'mouse') return
    const element = scrollerRef.current
    if (!element) return

    const deltaX = event.clientX - dragRef.current.startX
    if (Math.abs(deltaX) > 4) {
  dragRef.current.moved = true
  element.setPointerCapture?.(event.pointerId)
}
    element.scrollLeft = dragRef.current.scrollLeft - deltaX
  }

  function handlePointerEnd(event) {
    if (event.pointerType !== 'mouse') return
    dragRef.current.active = false
    scrollerRef.current?.releasePointerCapture?.(event.pointerId)
    window.setTimeout(() => {
      dragRef.current.moved = false
    }, 0)
  }

  if (loading) return <LoadingRow />
  if (!books.length) return null

  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mb-4">
        <h2 className="text-[18px] font-extrabold tracking-tight text-neutral-900 lg:text-[19px]">
          🤪 Weekly Update
        </h2>
      </div>

      <div
        ref={scrollerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        className="-mr-4 flex cursor-grab gap-3 overflow-x-auto overscroll-x-contain pb-2 pr-4 select-none active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [touch-action:pan-x_pan-y] sm:-mr-5 sm:pr-5 lg:mr-0 lg:pr-0 [&::-webkit-scrollbar]:hidden"
      >
        {books.map((book) => (
          <div
            key={book.id}
            className="w-[calc((100vw-56px)/2.5)] min-w-[calc((100vw-56px)/2.5)] sm:w-[220px] sm:min-w-[220px] lg:w-[160px] lg:min-w-[160px]"
          >
            <WeeklyCard
              book={book}
              onOpen={() => {
                if (dragRef.current.moved) return
                navigate(`/story/${book.id}`)
              }}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
