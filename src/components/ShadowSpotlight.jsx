import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const badgeColors = {
  NEW: 'bg-[#ff2f55] text-white',
  HOT: 'bg-[#ff7a00] text-white',
  TOP: 'bg-[#f6b800] text-[#111827]',
}

function getBadge(item) {
  const directBadge = String(item.badge || item.badge_label || item.tag || '').trim().toUpperCase()
  const titleBadge = String(item.title || '').match(/^\s*\[(HOT|NEW|TOP)\]\s*/i)?.[1]?.toUpperCase() || ''
  const badge = directBadge || titleBadge

  return ['NEW', 'HOT', 'TOP'].includes(badge) ? badge : ''
}

function getTitle(item) {
  return String(item.title || '').replace(/^\s*\[(HOT|NEW|TOP)\]\s*/i, '').trim()
}

function getSubtitle(item) {
  return String(item.subtitle || item.sub_title || item.description || '').trim()
}

function getBadgeClass(badge) {
  return badgeColors[badge] || 'bg-[#ff2f55] text-white'
}

export default function ShadowSpotlight() {
  const navigate = useNavigate()
  const swiperRef = useRef(null)
  const [spotlights, setSpotlights] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSpotlights() {
      try {
        const response = await fetch(`${API_URL}/api/slides?section_key=shadow_spotlight`)
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to fetch spotlight')
        }

        setSpotlights(data.slides || [])
      } catch (error) {
        console.error('Fetch Shadow Spotlight error:', error)
        setSpotlights([])
      } finally {
        setLoading(false)
      }
    }

    fetchSpotlights()
  }, [])

  useEffect(() => {
    if (!window.Swiper || spotlights.length === 0) return

    if (swiperRef.current) {
      swiperRef.current.destroy(true, true)
      swiperRef.current = null
    }

    swiperRef.current = new window.Swiper('.shadowSpotlightSwiper', {
      slidesPerView: 1.08,
      spaceBetween: 12,
      centeredSlides: false,
      loop: spotlights.length > 1,
      pagination: {
        el: '.shadow-spotlight-pagination',
        clickable: true,
      },
    })

    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true)
        swiperRef.current = null
      }
    }
  }, [spotlights])

  return (
    <div className="w-full overflow-hidden">
      <div className="mb-3 flex items-center px-4">
        <h2 className="text-[20px] font-extrabold tracking-tight text-neutral-900">
          SHADOW SPOTLIGHT
        </h2>
      </div>

      <div className="swiper shadowSpotlightSwiper !pl-4 !pr-10">
        <div className="swiper-wrapper">
          {loading ? (
            <div className="swiper-slide">
              <div className="flex aspect-[3/1] w-full items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
                <span className="text-[12px] font-bold text-gray-400">Loading spotlight...</span>
              </div>
            </div>
          ) : null}

          {!loading && spotlights.length === 0 ? (
            <div className="swiper-slide">
              <div className="flex aspect-[3/1] w-full items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 shadow-sm">
                <span className="text-[12px] font-bold text-gray-400">No spotlight yet</span>
              </div>
            </div>
          ) : null}

          {!loading && spotlights.map((item) => {
            const badge = getBadge(item)
            const title = getTitle(item)
            const subtitle = getSubtitle(item)

            return (
              <div key={item.id} className="swiper-slide">
                <div
                  className="relative aspect-[3/1] w-full cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm"
                  onClick={() => {
                    if (item.link_url) navigate(item.link_url)
                  }}
                >
                  <img
                    src={item.image_url}
                    className="h-full w-full object-cover"
                    alt={title || `Shadow Spotlight ${item.order_index}`}
                  />

                  {(badge || title || subtitle) ? (
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3">
                      <div className="flex min-w-0 items-center gap-2">
                        {badge ? (
                          <span className={`shrink-0 rounded-[5px] px-2 py-1 text-[8px] font-black uppercase leading-none ${getBadgeClass(badge)}`}>
                            {badge}
                          </span>
                        ) : null}

                        {title ? (
                          <h2 className="min-w-0 truncate text-[12px] font-black leading-tight text-white drop-shadow sm:text-[16px]">
                            {title}
                          </h2>
                        ) : null}
                      </div>

                      {subtitle ? (
                        <p className="mt-1 truncate text-[9.5px] font-semibold leading-4 text-white/90 sm:text-[11px]">
                          {subtitle}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>

        <div className="shadow-spotlight-pagination mt-4 flex justify-center" />
      </div>
    </div>
  )
}
