import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const fallbackWeeklyPicks = [
  {
    id: 'fallback-editor-1',
    title: 'Editor Weekly Pick 1',
    subtitle: 'A featured story selected by Shadow editors this week.',
    image: '/assets/EditorWeeklyPicksSection/EditorWeeklyPicksSection 1.jpg',
    link: '/story/1',
    tag: 'NEW',
  },
  {
    id: 'fallback-editor-2',
    title: 'Editor Weekly Pick 2',
    subtitle: 'Fresh and exciting content worth checking out this week.',
    image: '/assets/EditorWeeklyPicksSection/EditorWeeklyPicksSection 2.jpg',
    link: '/story/2',
    tag: 'HOT',
  },
  {
    id: 'fallback-editor-3',
    title: 'Editor Weekly Pick 3',
    subtitle: 'A special recommendation chosen for For You readers.',
    image: '/assets/EditorWeeklyPicksSection/EditorWeeklyPicksSection 3.jpg',
    link: '/story/3',
    tag: 'TOP',
  },
]

const badgeColors = {
  NEW: 'bg-[#ff2f55] text-white',
  HOT: 'bg-[#ff7a00] text-white',
  TOP: 'bg-[#f6b800] text-[#111827]',
}

function parseBadgeTitle(value = '') {
  const match = String(value).match(/^\s*\[(NEW|HOT|TOP)\]\s*(.*)$/i)

  return match
    ? { badge: match[1].toUpperCase(), title: match[2].trim() }
    : { badge: '', title: String(value || '').trim() }
}

function getBadgeClass(badge) {
  return badgeColors[badge] || ''
}

function normalizeSlide(slide, index = 0) {
  const parsedTitle = parseBadgeTitle(slide.title)
  const directBadge = String(slide.badge || '').trim().toUpperCase()
  const badge = ['NEW', 'HOT', 'TOP'].includes(directBadge)
    ? directBadge
    : parsedTitle.badge

  return {
    id: slide.id || `editor-slide-${index}`,
    title: parsedTitle.title || `Editor Weekly Pick ${index + 1}`,
    subtitle: slide.subtitle || slide.description || '',
    image:
      slide.image_url ||
      `/assets/EditorWeeklyPicksSection/EditorWeeklyPicksSection ${Math.min(index + 1, 3)}.jpg`,
    link: slide.link_url || '/story/1',
    tag: badge,
  }
}

export default function EditorWeeklyPicksSection() {
  const navigate = useNavigate()
  const scrollRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)
  const dragMovedRef = useRef(false)

  useEffect(() => {
    let ignore = false

    async function fetchWeeklyPicks() {
      try {
        setLoading(true)

        const response = await fetch(`${API_BASE_URL}/api/slides?section_key=editor_weekly_picks`)
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to fetch editor weekly picks')
        }

        if (ignore) return

        setItems((data.slides || []).map(normalizeSlide))
      } catch (error) {
        console.error('EditorWeeklyPicksSection fetch error:', error)

        if (!ignore) {
          setItems([])
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchWeeklyPicks()

    return () => {
      ignore = true
    }
  }, [])

  const displayItems = items

  const handleScroll = () => {
    const container = scrollRef.current
    if (!container) return

    const slideWidth = container.offsetWidth * 0.88 + 12
    const currentIndex = Math.round(container.scrollLeft / slideWidth)
    setActiveIndex(Math.min(currentIndex, displayItems.length - 1))
  }

  const scrollToIndex = (index) => {
    const container = scrollRef.current
    if (!container) return

    const slideWidth = container.offsetWidth * 0.88 + 12
    container.scrollTo({
      left: slideWidth * index,
      behavior: 'smooth',
    })

    setActiveIndex(index)
  }

  const handleMouseDown = (event) => {
    const container = scrollRef.current
    if (!container) return

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

    container.scrollLeft = scrollLeftRef.current - walk
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
  }

  const handleMouseLeave = () => {
    isDraggingRef.current = false
  }

  const handleCardClick = (event, link) => {
    if (dragMovedRef.current) {
      event.preventDefault()
      return
    }

    navigate(link || '/')
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="mb-3 px-3">
        <h2 className="text-[18px] font-bold tracking-tight text-neutral-900">
          💥 EDITOR’S WEEKLY PICKS
        </h2>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="scrollbar-none flex cursor-grab snap-x snap-mandatory overflow-x-auto scroll-smooth pl-3 pr-10 select-none active:cursor-grabbing"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {loading ? (
          <div className="mr-3 w-[88%] shrink-0 snap-start">
            <div className="aspect-[3/1] w-full animate-pulse rounded-[12px] bg-gray-100" />
          </div>
        ) : (
          displayItems.map((item) => (
            <div key={item.id} className="mr-3 w-[88%] shrink-0 snap-start">
              <button
                type="button"
                onClick={(event) => handleCardClick(event, item.link)}
                className="group block w-full text-left"
              >
                <div className="relative aspect-[3/1] w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="pointer-events-none h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                    draggable="false"
                    onError={(event) => {
                      event.currentTarget.src =
                        '/assets/EditorWeeklyPicksSection/EditorWeeklyPicksSection 1.jpg'
                    }}
                  />

                  <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent p-3">
                    <div className="flex items-center space-x-2">
                      {item.tag ? (
  <span
    className={`rounded px-1.5 py-0.5 text-[8px] font-black uppercase shadow-sm ${getBadgeClass(item.tag)}`}
  >
    {item.tag}
  </span>
) : null}

                      <h3 className="truncate text-[11px] font-bold text-white">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          ))
        )}
      </div>

      {!loading ? (
        <div className="mt-4 flex items-center justify-center gap-2">
          {displayItems.map((_, index) => {
            const isActive = activeIndex === index

            return (
              <button
                key={index}
                type="button"
                onClick={() => scrollToIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  isActive
                    ? 'h-2.5 w-6 bg-blue-600'
                    : 'h-2.5 w-2.5 bg-neutral-300 hover:bg-neutral-400'
                }`}
              />
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
