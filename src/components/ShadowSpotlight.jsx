import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('shadowSpotlight', {
  en: {
    title: 'Shadow Spotlight',
    loading: 'Loading spotlight...',
    empty: 'No spotlight yet',
  },
  km: {
    title: 'Shadow Spotlight',
    loading: 'កំពុងផ្ទុក Spotlight...',
    empty: 'មិនទាន់មាន Spotlight ទេ',
  },
  zh: {
    title: 'Shadow 聚光推荐',
    loading: '正在加载推荐...',
    empty: '暂无推荐内容',
  },
  ja: {
    title: 'Shadow スポットライト',
    loading: 'スポットライトを読み込み中...',
    empty: 'スポットライトはまだありません',
  },
  ko: {
    title: 'Shadow 스포트라이트',
    loading: '스포트라이트 불러오는 중...',
    empty: '아직 스포트라이트가 없습니다',
  },
})
import {
  getHomeCacheKey,
  loadHomeCache,
  saveHomeCache,
} from '../utils/homeDataCache'

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const SHADOW_SPOTLIGHT_CACHE_MAX_AGE_MS =
  6 * 60 * 60 * 1000

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
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const swiperRef = useRef(null)
  const [spotlights, setSpotlights] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  let ignore = false

  async function loadSpotlights() {
    const cacheKey = getHomeCacheKey({
      section: 'slides',
      params: {
        home_section: 'shadow-spotlight',
        section_key: 'shadow_spotlight',
        schema: 1,
      },
    })

    const cached = await loadHomeCache(cacheKey, {
      maxAgeMs: SHADOW_SPOTLIGHT_CACHE_MAX_AGE_MS,
      allowExpired: true,
    })

    const hasCachedSpotlights = Array.isArray(cached?.data)

    if (hasCachedSpotlights && !ignore) {
      setSpotlights(cached.data)
      setLoading(false)
    }

    if (cached?.isFresh && hasCachedSpotlights) {
      return
    }

    try {
      if (!hasCachedSpotlights && !ignore) {
        setLoading(true)
      }

      const response = await fetch(
        `${API_URL}/api/slides?section_key=shadow_spotlight`
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message || 'Failed to fetch spotlight'
        )
      }

      const nextSpotlights = Array.isArray(data.slides)
        ? data.slides
        : []

      if (ignore) return

      setSpotlights(nextSpotlights)

      await saveHomeCache(cacheKey, nextSpotlights, {
        maxAgeMs: SHADOW_SPOTLIGHT_CACHE_MAX_AGE_MS,
      })
    } catch (error) {
      console.error(
        'Fetch Shadow Spotlight error:',
        error
      )

      if (!ignore && !hasCachedSpotlights) {
        setSpotlights([])
      }
    } finally {
      if (!ignore) {
        setLoading(false)
      }
    }
  }

  loadSpotlights()

  return () => {
    ignore = true
  }
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
        <h2 className="text-[18px] font-extrabold tracking-tight text-[var(--shadow-text-primary)] lg:text-[19px]">
  {t('shadowSpotlight.title')}
</h2>
      </div>

      <div className="swiper shadowSpotlightSwiper !pl-4 !pr-10">
        <div className="swiper-wrapper">
          {loading ? (
            <div className="swiper-slide">
              <div className="flex aspect-[3/1] w-full items-center justify-center rounded-[12px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] shadow-sm">
                <span className="text-[12px] font-bold text-[var(--shadow-text-tertiary)]">{t('shadowSpotlight.loading')}</span>
              </div>
            </div>
          ) : null}

          {!loading && spotlights.length === 0 ? (
            <div className="swiper-slide">
              <div className="flex aspect-[3/1] w-full items-center justify-center rounded-[12px] border border-dashed border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-soft)] shadow-sm">
                <span className="text-[12px] font-bold text-[var(--shadow-text-tertiary)]">{t('shadowSpotlight.empty')}</span>
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
        className="relative aspect-[3/1] w-full cursor-pointer overflow-hidden rounded-[12px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] shadow-sm"
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
            {title ? (
              <h2 className="truncate text-[12px] font-black leading-tight text-white drop-shadow sm:text-[16px]">
                {title}
              </h2>
            ) : null}

            {(badge || subtitle) ? (
              <div className="mt-1 flex min-w-0 items-center gap-2">
                {badge ? (
                  <span className={`shrink-0 rounded-[5px] px-2 py-1 text-[8px] font-black uppercase leading-none ${getBadgeClass(badge)}`}>
                    {badge}
                  </span>
                ) : null}

                {subtitle ? (
                  <p className="min-w-0 truncate text-[9.5px] font-semibold leading-4 text-white/90 sm:text-[11px]">
                    {subtitle}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
})}
        </div>

        <div className="shadow-spotlight-pagination mt-4 flex justify-center [&_.swiper-pagination-bullet-active]:!bg-[var(--shadow-text-primary)]" />
      </div>
    </div>
  )
}
