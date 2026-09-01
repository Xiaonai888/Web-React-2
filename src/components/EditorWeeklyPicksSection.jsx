import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('editorWeeklyPicksSection', {
  en: {
    title: "EDITOR'S WEEKLY PICKS",
    fallbackTitle: 'Editor Weekly Pick {{number}}',
  },
  km: {
    title: 'ជម្រើសប្រចាំសប្ដាហ៍របស់ក្រុមការងារ',
    fallbackTitle: 'ជម្រើសប្រចាំសប្ដាហ៍ {{number}}',
  },
  zh: {
    title: '编辑每周精选',
    fallbackTitle: '编辑每周精选 {{number}}',
  },
  ja: {
    title: '編集部の週間おすすめ',
    fallbackTitle: '週間おすすめ {{number}}',
  },
  ko: {
    title: '에디터 주간 추천',
    fallbackTitle: '에디터 주간 추천 {{number}}',
  },
})
import {
  getHomeCacheKey,
  loadHomeCache,
  saveHomeCache,
} from '../utils/homeDataCache'

const API_BASE_URL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const EDITOR_PICKS_CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000

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
    title: parsedTitle.title || '',
    subtitle: slide.subtitle || slide.description || '',
    image:
      slide.image_url ||
      `/assets/EditorWeeklyPicksSection/EditorWeeklyPicksSection ${Math.min(index + 1, 3)}.jpg`,
    link: slide.link_url || '/story/1',
    tag: badge,
  }
}

export default function EditorWeeklyPicksSection() {
  const { t } = useDisplayTranslation()
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

  async function loadWeeklyPicks() {
    const cacheKey = getHomeCacheKey({
      section: 'slides',
      params: {
        home_section: 'editor-weekly-picks',
        section_key: 'editor_weekly_picks',
        schema: 1,
      },
    })

    const cached = await loadHomeCache(cacheKey, {
      maxAgeMs: EDITOR_PICKS_CACHE_MAX_AGE_MS,
      allowExpired: true,
    })

    const hasCachedItems = Array.isArray(cached?.data)

    if (hasCachedItems && !ignore) {
      setItems(cached.data)
      setActiveIndex(0)
      setLoading(false)
    }

    if (cached?.isFresh && hasCachedItems) {
      return
    }

    try {
      if (!hasCachedItems && !ignore) {
        setLoading(true)
      }

      const response = await fetch(
        `${API_BASE_URL}/api/slides?section_key=editor_weekly_picks`
      )
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message ||
            'Failed to fetch editor weekly picks'
        )
      }

      const nextItems = Array.isArray(data.slides)
        ? data.slides.map(normalizeSlide)
        : []

      if (ignore) return

      setItems(nextItems)
      setActiveIndex(0)

      await saveHomeCache(cacheKey, nextItems, {
        maxAgeMs: EDITOR_PICKS_CACHE_MAX_AGE_MS,
      })
    } catch (error) {
      console.error(
        'EditorWeeklyPicksSection fetch error:',
        error
      )

      if (!ignore && !hasCachedItems) {
        setItems([])
      }
    } finally {
      if (!ignore) {
        setLoading(false)
      }
    }
  }

  loadWeeklyPicks()

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

    container.scrollLeft = scrollLeftRef.current - walk * 1.6
  }

  const stopMouseDrag = () => {
  isDraggingRef.current = false
  if (scrollRef.current) scrollRef.current.style.scrollSnapType = ''
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
      <div className="mb-3 px-4">
        <h2 className="text-[18px] font-bold tracking-tight text-[var(--shadow-text-primary)]">
          💥 {t('editorWeeklyPicksSection.title')}
        </h2>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopMouseDrag}
        onMouseLeave={stopMouseDrag}
        className="scrollbar-none flex cursor-grab snap-x snap-mandatory scroll-pl-4 overflow-x-auto scroll-smooth pl-4 pr-10 select-none active:cursor-grabbing"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {loading ? (
          <div className="mr-3 w-[88%] shrink-0 snap-start">
            <div className="aspect-[3/1] w-full animate-pulse rounded-[12px] bg-[var(--shadow-bg-soft)]" />
          </div>
        ) : (
          displayItems.map((item, index) => (
            <div key={item.id} className="mr-3 w-[88%] shrink-0 snap-start">
              <button
                type="button"
                onClick={(event) => handleCardClick(event, item.link)}
                className="group block w-full border-0 bg-transparent p-0 text-left"
              >
                <div className="relative aspect-[3/1] w-full overflow-hidden rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] shadow-sm">
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
                        {item.title ||
                          t('editorWeeklyPicksSection.fallbackTitle', {
                            number: index + 1,
                          })}
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
                    ? 'h-2.5 w-6 bg-[var(--shadow-text-primary)]'
                    : 'h-2.5 w-2.5 bg-[var(--shadow-border-strong)] hover:bg-[var(--shadow-text-tertiary)]'
                }`}
              />
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
