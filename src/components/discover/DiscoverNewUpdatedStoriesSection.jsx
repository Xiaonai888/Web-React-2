import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addStoryLanguageParam } from '../../utils/storyLanguage'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://shadow-backend-kucw.onrender.com'

function getValidDate(value) {
  const date = value ? new Date(value) : null

  return date && !Number.isNaN(date.getTime())
    ? date
    : null
}

function formatUpdateTime(value) {
  const date = getValidDate(value)

  if (!date) return 'Updated recently'

  const difference = Math.max(0, Date.now() - date.getTime())
  const minutes = Math.floor(difference / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'Updated now'
  if (minutes < 60) return `Updated ${minutes}m`
  if (hours < 24) return `Updated ${hours}h`
  if (days < 7) return `Updated ${days}d`

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function isNewStory(story) {
  const createdAt = getValidDate(story.created_at)

  if (!createdAt) {
    return Number(story.total_episodes || 0) <= 1
  }

  const age = Date.now() - createdAt.getTime()
  const twoDays = 2 * 24 * 60 * 60 * 1000

  return (
    age >= 0 &&
    age <= twoDays &&
    Number(story.total_episodes || 0) <= 1
  )
}

function normalizeStory(story) {
  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    coverUrl: story.cover_url || '',
    author:
      story.author_page?.page_name ||
      story.author_page?.page_username ||
      'Shadow Author',
    totalEpisodes: Number(story.total_episodes || 0),
    isAdult: Boolean(story.is_adult),
    isNew: isNewStory(story),
    updatedAt:
      story.updated_at ||
      story.created_at ||
      null,
  }
}

function StorySkeleton() {
  return (
    <div className="w-[106px] shrink-0 sm:w-[112px]">
      <div className="aspect-[2/3] animate-pulse rounded-[8px] bg-gray-100" />
      <div className="mt-2 h-3.5 animate-pulse rounded-full bg-gray-100" />
      <div className="mt-2 h-3 w-4/5 animate-pulse rounded-full bg-gray-100" />
      <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-gray-100" />
    </div>
  )
}

export default function DiscoverNewUpdatedStoriesSection() {
  const navigate = useNavigate()
  const scrollRef = useRef(null)
  const dragRef = useRef({
    active: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
  })
  const suppressClickRef = useRef(false)
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    const controller = new AbortController()

    async function loadStories() {
      try {
        setLoading(true)

        const response = await fetch(
          addStoryLanguageParam(
            `${API_BASE_URL}/api/public/stories?limit=12&sort=updated`
          ),
          {
            signal: controller.signal,
            cache: 'no-store',
          }
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(
            data.message ||
              'Failed to load new and updated stories'
          )
        }

        if (alive) {
          setStories(
            (Array.isArray(data.stories) ? data.stories : [])
              .map(normalizeStory)
              .filter((story) => story.id)
              .slice(0, 10)
          )
        }
      } catch (error) {
        if (alive && error.name !== 'AbortError') {
          setStories([])
        }
      } finally {
        if (alive) {
          setLoading(false)
        }
      }
    }

    loadStories()

    return () => {
      alive = false
      controller.abort()
    }
  }, [])

  function startDrag(event) {
    if (event.pointerType !== 'mouse' || event.button !== 0) {
      return
    }

    const element = scrollRef.current

    if (!element) return

    dragRef.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: element.scrollLeft,
      moved: false,
    }

    element.setPointerCapture?.(event.pointerId)
  }

  function moveDrag(event) {
    const element = scrollRef.current
    const state = dragRef.current

    if (!element || !state.active) return

    const distance = event.clientX - state.startX

    if (Math.abs(distance) > 4) {
      state.moved = true
    }

    element.scrollLeft = state.scrollLeft - distance
  }

  function endDrag(event) {
    const element = scrollRef.current
    const wasMoved = dragRef.current.moved

    dragRef.current.active = false

    if (element?.hasPointerCapture?.(event.pointerId)) {
      element.releasePointerCapture(event.pointerId)
    }

    if (wasMoved) {
      suppressClickRef.current = true

      window.setTimeout(() => {
        suppressClickRef.current = false
      }, 0)
    }
  }

  function openStory(storyId) {
    if (suppressClickRef.current) return

    navigate(`/story/${storyId}`)
  }

  if (!loading && !stories.length) return null

  return (
    <article className="bg-white py-4 ring-1 ring-gray-100 sm:rounded-[12px]">
      <div className="mb-4 flex items-center justify-between gap-4 px-4">
        <div className="min-w-0">
          <div className="text-[17px] font-semibold text-[#111827]">
            New & Updated Stories
          </div>

          <div className="mt-1 text-[11px] font-normal text-gray-400">
            New releases and recently updated episodes
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/update-today')}
          className="shrink-0 text-[12px] font-semibold text-gray-500 active:scale-95"
        >
          More
        </button>
      </div>

      <div
        ref={scrollRef}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="no-scrollbar flex cursor-grab select-none gap-3 overflow-x-auto px-4 pb-1 active:cursor-grabbing"
      >
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <StorySkeleton key={index} />
            ))
          : stories.map((story) => (
              <button
                key={story.id}
                type="button"
                onClick={() => openStory(story.id)}
                className="w-[106px] shrink-0 text-left active:scale-[0.98] sm:w-[112px]"
              >
                <div className="relative aspect-[2/3] overflow-hidden rounded-[8px] bg-gradient-to-br from-[#111827] via-[#4c1d95] to-[#7c3aed]">
                  {story.coverUrl ? (
                    <img
                      src={story.coverUrl}
                      alt={story.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                      onDragStart={(event) =>
                        event.preventDefault()
                      }
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-white/70">
                      <i className="fa-solid fa-book-open text-[24px]" />
                    </div>
                  )}

                  <div
                    className={`absolute left-0 top-0 rounded-br-[6px] px-2 py-1 text-[9px] font-semibold ${
                      story.isNew
                        ? 'bg-[#ff3b5c] text-white'
                        : 'bg-[#f6b800] text-[#111827]'
                    }`}
                  >
                    {story.isNew ? 'NEW' : 'UPDATED'}
                  </div>

                  {story.isAdult ? (
                    <div className="absolute bottom-2 left-2 rounded-[5px] bg-white/90 px-1.5 py-1 text-[9px] font-semibold text-red-500">
                      18+
                    </div>
                  ) : null}
                </div>

                <div className="mt-2 line-clamp-2 min-h-[32px] text-[12px] font-semibold leading-[16px] text-[#111827]">
                  {story.title}
                </div>

                <div className="mt-1 truncate text-[10px] font-normal text-gray-400">
                  {formatUpdateTime(story.updatedAt)}
                  {story.totalEpisodes > 0
                    ? ` · Ep ${story.totalEpisodes}`
                    : ''}
                </div>

                <div className="mt-1 truncate text-[10px] font-normal text-gray-400">
                  {story.author}
                </div>
              </button>
            ))}
      </div>
    </article>
  )
}
