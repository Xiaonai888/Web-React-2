import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const fallbackEventPerksData = [
  {
    id: 'fallback-event-1',
    title: 'Event Banner 1',
    subtitle: 'Special event rewards and limited-time perks.',
    image: '/assets/EventPerksHubPage/EventPerksHubPage 1.jpg',
    link: '/event',
    tag: 'NEW',
  },
  {
    id: 'fallback-event-2',
    title: 'Event Banner 2',
    subtitle: 'Join events and unlock exclusive bonuses.',
    image: '/assets/EventPerksHubPage/EventPerksHubPage 2.jpg',
    link: '/event',
    tag: 'HOT',
  },
  {
    id: 'fallback-event-3',
    title: 'Event Banner 3',
    subtitle: 'Check the newest perks available this week.',
    image: '/assets/EventPerksHubPage/EventPerksHubPage 3.jpg',
    link: '/event',
    tag: 'TOP',
  },
]

function normalizeSlide(slide, index = 0) {
  const tagList = ['NEW', 'HOT', 'TOP']

  return {
    id: slide.id || `event-slide-${index}`,
    title: slide.title || `Event Banner ${index + 1}`,
    subtitle: slide.description || 'Special event rewards and limited-time perks.',
    image: slide.image_url || `/assets/EventPerksHubPage/EventPerksHubPage ${Math.min(index + 1, 3)}.jpg`,
    link: slide.link_url || '/event',
    tag: slide.badge || tagList[index % tagList.length],
  }
}

export default function EventPerksHubSection() {
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

    async function fetchEventPerks() {
      try {
        setLoading(true)

        const response = await fetch(`${API_BASE_URL}/api/slides?section_key=event_perks_hub`)
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to fetch event perks')
        }

        if (ignore) return

        setItems((data.slides || []).map(normalizeSlide))
      } catch (error) {
        console.error('EventPerksHubSection fetch error:', error)

        if (!ignore) {
          setItems([])
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchEventPerks()

    return () => {
      ignore = true
    }
  }, [])

  const displayItems = items.length ? items : fallbackEventPerksData

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

    navigate(link || '/event')
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="mb-3 px-4">
        <h2 className="text-[18px] font-bold uppercase tracking-tight text-neutral-900">
          🎉 EVENT & PERKS HUB
        </h2>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="scrollbar-none flex cursor-grab snap-x snap-mandatory overflow-x-auto scroll-smooth pl-4 pr-10 select-none active:cursor-grabbing"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {loading ? (
          <div className="mr-3 w-[88%] shrink-0 snap-start">
            <div className="aspect-[3/1] w-full animate-pulse rounded-2xl bg-gray-100" />
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
                      event.currentTarget.src = '/assets/EventPerksHubPage/EventPerksHubPage 1.jpg'
                    }}
                  />

                  <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent p-3">
                    <div className="flex items-center space-x-2">
                      <span className="rounded bg-[#ff3b5c] px-1.5 py-0.5 text-[8px] font-black text-white shadow-sm">
                        {item.tag}
                      </span>

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
