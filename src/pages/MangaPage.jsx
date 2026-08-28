import { useEffect, useRef, useState } from 'react'
import { Bell, Grid2X2, Search } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import MangaFeedSections from '../components/MangaFeedSections'
import ShadowSpotlight from '../components/ShadowSpotlight'
import ContinueReadingSection from '../components/ContinueReadingSection'
import DailyPicksSection from '../components/DailyPicksSection'
import TrendingNowSection from '../components/TrendingNowSection'
import UpdateTodaySection from '../components/UpdateTodaySection'
import EditorWeeklyPicksSection from '../components/EditorWeeklyPicksSection'
import NewArrivalsSection from '../components/NewArrivalsSection'
import TopNovelSection from '../components/TopNovelSection'
import EventPerksHubSection from '../components/EventPerksHubSection'
import YouMightLikeSection from '../components/YouMightLikeSection'
import StoriesDailyCheckIn from '../components/StoriesDailyCheckIn'
import NotificationPage from './NotificationPage'
import { getHomeCacheKey, loadHomeCache, saveHomeCache } from '../utils/homeDataCache'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('mangaPage', {
  en: {
    today: 'Today',
    romance: 'Romance',
    fantasy: 'Fantasy',
    action: 'Action',
    comedy: 'Comedy',
    drama: 'Drama',
    genre: 'Genre',
    genres: 'Genres',
    search: 'Search',
    notifications: 'Notifications',
    loadingSlides: 'Loading Manga slides...',
    noSlides: 'No Manga slides yet',
    mangaSlide: 'Manga slide',
    new: 'NEW',
    hot: 'HOT',
    top: 'TOP',
    shop: 'Shop',
    tasks: 'Tasks',
    ranking: 'Ranking',
    event: 'Event',
  },
  km: {
    today: 'ថ្ងៃនេះ',
    romance: 'មនោសញ្ចេតនា',
    fantasy: 'Fantasy',
    action: 'សកម្មភាព',
    comedy: 'កំប្លែង',
    drama: 'Drama',
    genre: 'ប្រភេទរឿង',
    genres: 'ប្រភេទរឿង',
    search: 'ស្វែងរក',
    notifications: 'ការជូនដំណឹង',
    loadingSlides: 'កំពុងផ្ទុក Manga slides...',
    noSlides: 'មិនទាន់មាន Manga slides ទេ',
    mangaSlide: 'Manga slide',
    new: 'ថ្មី',
    hot: 'កំពុងពេញនិយម',
    top: 'កំពូល',
    shop: 'ហាង',
    tasks: 'បេសកកម្ម',
    ranking: 'ចំណាត់ថ្នាក់',
    event: 'ព្រឹត្តិការណ៍',
  },
  zh: {
    today: '今天',
    romance: '爱情',
    fantasy: '奇幻',
    action: '动作',
    comedy: '喜剧',
    drama: '剧情',
    genre: '类型',
    genres: '类型',
    search: '搜索',
    notifications: '通知',
    loadingSlides: '正在加载 Manga 轮播...',
    noSlides: '暂无 Manga 轮播',
    mangaSlide: 'Manga 轮播',
    new: '新',
    hot: '热门',
    top: '榜首',
    shop: '商店',
    tasks: '任务',
    ranking: '排行榜',
    event: '活动',
  },
  ja: {
    today: '今日',
    romance: 'ロマンス',
    fantasy: 'ファンタジー',
    action: 'アクション',
    comedy: 'コメディ',
    drama: 'ドラマ',
    genre: 'ジャンル',
    genres: 'ジャンル',
    search: '検索',
    notifications: '通知',
    loadingSlides: 'Manga スライドを読み込み中...',
    noSlides: 'Manga スライドはまだありません',
    mangaSlide: 'Manga スライド',
    new: '新着',
    hot: '人気',
    top: 'トップ',
    shop: 'ショップ',
    tasks: 'タスク',
    ranking: 'ランキング',
    event: 'イベント',
  },
  ko: {
    today: '오늘',
    romance: '로맨스',
    fantasy: '판타지',
    action: '액션',
    comedy: '코미디',
    drama: '드라마',
    genre: '장르',
    genres: '장르',
    search: '검색',
    notifications: '알림',
    loadingSlides: 'Manga 슬라이드를 불러오는 중...',
    noSlides: '아직 Manga 슬라이드가 없습니다',
    mangaSlide: 'Manga 슬라이드',
    new: '신규',
    hot: '인기',
    top: 'TOP',
    shop: '상점',
    tasks: '미션',
    ranking: '랭킹',
    event: '이벤트',
  },
})

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')
const MANGA_PUBLIC_CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000

const fallbackGenreTabs = [
  { label: 'Today', slug: 'today' },
  { label: 'Romance', slug: 'romance' },
  { label: 'Fantasy', slug: 'fantasy' },
  { label: 'Action', slug: 'action' },
  { label: 'Comedy', slug: 'comedy' },
  { label: 'Drama', slug: 'drama' },
]

const BUILT_IN_GENRE_LABEL_KEYS = {
  today: 'today',
  romance: 'romance',
  fantasy: 'fantasy',
  action: 'action',
  comedy: 'comedy',
  drama: 'drama',
}

const badgeClasses = {
  NEW: 'bg-[#ff2f55] text-white',
  HOT: 'bg-[#ff7a00] text-white',
  TOP: 'bg-[#F6B800] text-[#111827]',
}

const BADGE_LABEL_KEYS = {
  NEW: 'new',
  HOT: 'hot',
  TOP: 'top',
}

const SHORTCUT_LABEL_KEYS = {
  Shop: 'shop',
  Tasks: 'tasks',
  Ranking: 'ranking',
  Event: 'event',
}

function getSlideBadge(slide) {
  const directBadge = String(slide.badge || slide.badge_label || slide.tag || '').trim().toUpperCase()
  const titleBadge = String(slide.title || '').match(/^\s*\[(HOT|NEW|TOP)\]\s*/i)?.[1]?.toUpperCase() || ''
  const badge = directBadge || titleBadge

  return ['HOT', 'NEW', 'TOP'].includes(badge) ? badge : ''
}

function getSlideTitle(slide) {
  return String(slide.title || '').replace(/^\s*\[(HOT|NEW|TOP)\]\s*/i, '').trim()
}

function getGenreDisplayLabel(tab, t) {
  if (tab?.label === 'Genre') {
    return t('mangaPage.genre')
  }

  const key = BUILT_IN_GENRE_LABEL_KEYS[tab?.slug]
  const expectedLabel =
    tab?.slug === 'today'
      ? 'Today'
      : tab?.slug === 'romance'
        ? 'Romance'
        : tab?.slug === 'fantasy'
          ? 'Fantasy'
          : tab?.slug === 'action'
            ? 'Action'
            : tab?.slug === 'comedy'
              ? 'Comedy'
              : tab?.slug === 'drama'
                ? 'Drama'
                : ''

  if (key && tab?.label === expectedLabel) {
    return t(`mangaPage.${key}`)
  }

  return tab?.label || ''
}

export default function MangaPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [searchParams] = useSearchParams()
  const sliderRef = useRef(null)
  const lastScrollYRef = useRef(0)
  const [activeGenre, setActiveGenre] = useState('today')
  const [pressedGenre, setPressedGenre] = useState('')
  const [genreTabs, setGenreTabs] = useState(fallbackGenreTabs)
  const [slides, setSlides] = useState([])
  const [slidesLoading, setSlidesLoading] = useState(true)
  const [activeSlide, setActiveSlide] = useState(0)
  const [barsHidden, setBarsHidden] = useState(false)
  const [notificationUnreadCount, setNotificationUnreadCount] = useState(0)
  const [showNotificationPopup, setShowNotificationPopup] = useState(false)

  async function refreshNotificationUnreadCount() {
    const token =
      sessionStorage.getItem('shadow_reader_token') ||
      localStorage.getItem('shadow_reader_token') ||
      ''

    if (!token) {
      setNotificationUnreadCount(0)
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json().catch(() => ({}))

      setNotificationUnreadCount(data?.ok ? Number(data.unread_count || 0) : 0)
    } catch {
      setNotificationUnreadCount(0)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    function normalizeTabs(rawTabs) {
      return (Array.isArray(rawTabs) ? rawTabs : [])
        .map((tab) => ({
          label: tab.label || tab.genre?.name || 'Genre',
          slug:
            tab.slug ||
            tab.genre?.slug ||
            String(tab.label || '').toLowerCase(),
        }))
        .filter((tab) => tab.label && tab.slug)
        .slice(0, 12)
    }

    function applyTabs(tabs) {
      if (cancelled || controller.signal.aborted) return

      if (!tabs.length) {
        setGenreTabs(fallbackGenreTabs)
        return
      }

      const today = tabs.find((tab) => tab.slug === 'today')
      const otherTabs = tabs.filter((tab) => tab.slug !== 'today')

      setGenreTabs(
        today
          ? [today, ...otherTabs]
          : [{ label: 'Today', slug: 'today' }, ...otherTabs].slice(0, 12)
      )
    }

    async function loadGenres() {
      const cacheKey = getHomeCacheKey({
        section: 'genres',
        language: 'all',
        params: {
          page: 'manga',
          list: 'featured-tabs',
          schema: 1,
        },
      })

      let hasCachedTabs = false

      const cached = await loadHomeCache(cacheKey, {
        maxAgeMs: MANGA_PUBLIC_CACHE_MAX_AGE_MS,
        allowExpired: true,
      })

      if (cancelled || controller.signal.aborted) return

      hasCachedTabs = Array.isArray(cached?.data)

      if (hasCachedTabs) {
        applyTabs(cached.data)
      }

      if (cached?.isFresh && hasCachedTabs) {
        return
      }

      try {
        const response = await fetch(
          `${API_URL}/api/genres/featured-tabs`,
          { signal: controller.signal }
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error('Failed to load genres')
        }

        const tabs = normalizeTabs(data.tabs)

        if (cancelled || controller.signal.aborted) return

        applyTabs(tabs)

        await saveHomeCache(cacheKey, tabs, {
          maxAgeMs: MANGA_PUBLIC_CACHE_MAX_AGE_MS,
        })
      } catch (error) {
        if (
          error?.name !== 'AbortError' &&
          !cancelled &&
          !hasCachedTabs
        ) {
          setGenreTabs(fallbackGenreTabs)
        }
      }
    }

    loadGenres()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [])

  useEffect(() => {
    const requestedGenre = String(searchParams.get('genre') || '').trim().toLowerCase()

    if (requestedGenre && genreTabs.some((tab) => tab.slug === requestedGenre)) {
      setActiveGenre(requestedGenre)
    }
  }, [genreTabs, searchParams])

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    async function loadSlides() {
      const cacheKey = getHomeCacheKey({
        section: 'slides',
        language: 'all',
        params: {
          page: 'manga',
          section_key: 'manga_top_slider',
          schema: 1,
        },
      })

      let hasCachedSlides = false

      const cached = await loadHomeCache(cacheKey, {
        maxAgeMs: MANGA_PUBLIC_CACHE_MAX_AGE_MS,
        allowExpired: true,
      })

      if (cancelled || controller.signal.aborted) return

      hasCachedSlides = Array.isArray(cached?.data)

      if (hasCachedSlides) {
        setSlides(cached.data)
        setSlidesLoading(false)
      }

      if (cached?.isFresh && hasCachedSlides) {
        return
      }

      try {
        if (!hasCachedSlides) {
          setSlidesLoading(true)
        }

        const response = await fetch(
          `${API_URL}/api/slides?section_key=manga_top_slider`,
          { signal: controller.signal }
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error('Failed to load slides')
        }

        const nextSlides = Array.isArray(data.slides)
          ? data.slides
          : []

        if (cancelled || controller.signal.aborted) return

        setSlides(nextSlides)

        await saveHomeCache(cacheKey, nextSlides, {
          maxAgeMs: MANGA_PUBLIC_CACHE_MAX_AGE_MS,
        })
      } catch (error) {
        if (
          error?.name !== 'AbortError' &&
          !cancelled &&
          !hasCachedSlides
        ) {
          setSlides([])
        }
      } finally {
        if (!cancelled && !controller.signal.aborted) {
          setSlidesLoading(false)
        }
      }
    }

    loadSlides()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [])

  useEffect(() => {
    if (slides.length <= 1) return undefined

    const timer = window.setInterval(() => {
      const slider = sliderRef.current
      if (!slider || !slider.clientWidth) return

      const currentIndex = Math.round(slider.scrollLeft / slider.clientWidth)
      const nextIndex = (currentIndex + 1) % slides.length

      slider.scrollTo({
        left: nextIndex * slider.clientWidth,
        behavior: 'smooth',
      })
      setActiveSlide(nextIndex)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [slides.length])

  useEffect(() => {
    refreshNotificationUnreadCount()

    const refresh = () => refreshNotificationUnreadCount()
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') refresh()
    }

    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY
      const difference = currentScrollY - lastScrollYRef.current

      if (currentScrollY < 20) {
        setBarsHidden(false)
        document.body.classList.remove('manga-bars-hidden')
      } else if (difference > 8) {
        setBarsHidden(true)
        document.body.classList.add('manga-bars-hidden')
      } else if (difference < -8) {
        setBarsHidden(false)
        document.body.classList.remove('manga-bars-hidden')
      }

      lastScrollYRef.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.body.classList.remove('manga-bars-hidden')
    }
  }, [])

  function handleGenreChange(tab) {
    setPressedGenre(tab.slug)
    setActiveGenre(tab.slug)
    window.setTimeout(() => setPressedGenre(''), 220)
  }

  function handleSliderScroll() {
    const slider = sliderRef.current
    if (!slider || !slider.clientWidth) return

    setActiveSlide(Math.round(slider.scrollLeft / slider.clientWidth))
  }

  return (
    <div className="app-page min-h-screen pb-[82px]">
      <style>{`
        body.manga-bars-hidden footer { transform: translateY(110%); }
        .manga-no-scrollbar::-webkit-scrollbar { display: none; }
        .manga-no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div
        className="app-nav fixed left-0 right-0 top-0 z-[100000] transition-transform duration-200"
        style={{ transform: barsHidden ? 'translateY(-100%)' : 'translateY(0)' }}
      >
        <header className="flex items-center justify-between px-4 py-3">
          <div className="flex h-9 w-[92px] items-center">
            <img
              src="/assets/Icons/Logo Shadow 2.svg"
              alt="Shadow"
              className="h-full w-full object-contain object-left"
            />
          </div>

          <div className="flex items-center gap-5" style={{ color: 'var(--shadow-icon)' }}>
            <Link
              to="/genres"
              className="flex h-6 w-6 items-center justify-center"
              aria-label={t('mangaPage.genres')}
            >
              <Grid2X2 size={20} strokeWidth={1.8} />
            </Link>
            <Link
              to="/search"
              className="flex h-6 w-6 items-center justify-center"
              aria-label={t('mangaPage.search')}
            >
              <Search size={20} strokeWidth={1.8} />
            </Link>
            <button
              type="button"
              onClick={() => setShowNotificationPopup(true)}
              className="relative flex h-6 w-6 items-center justify-center"
              aria-label={t('mangaPage.notifications')}
            >
              <Bell size={20} strokeWidth={1.8} />
              {notificationUnreadCount > 0 ? (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F6B800] px-1.5 text-[10px] font-medium leading-none text-[#111827] shadow-sm">
                  {notificationUnreadCount > 99 ? '99+' : notificationUnreadCount}
                </span>
              ) : null}
            </button>
          </div>
        </header>

        <nav
          className="manga-no-scrollbar flex gap-1.5 overflow-x-auto border-t px-4 pb-2"
          style={{ borderColor: 'var(--shadow-border)' }}
        >
          {genreTabs.map((tab) => {
            const active = activeGenre === tab.slug
            const pressed = pressedGenre === tab.slug

            return (
              <button
                key={tab.slug}
                type="button"
                onClick={() => handleGenreChange(tab)}
                className={`relative shrink-0 rounded-full px-3 py-2 text-[12px] transition-colors ${
                  active ? 'font-semibold' : 'font-normal'
                }`}
                style={{
                  color: active
                    ? 'var(--shadow-text-primary)'
                    : 'var(--shadow-text-secondary)',
                  background: pressed
                    ? 'var(--shadow-bg-hover)'
                    : 'transparent',
                }}
              >
                {getGenreDisplayLabel(tab, t)}
                <span
                  className={`absolute bottom-[3px] left-1/2 h-[3px] -translate-x-1/2 rounded-full bg-[#F6B800] transition-all ${
                    active ? 'w-[62%] opacity-100' : 'w-0 opacity-0'
                  }`}
                />
              </button>
            )
          })}
        </nav>
      </div>

      <div className="h-[104px]" />

      <main id="tab-content-root">
        <section
          className="relative overflow-hidden"
          style={{ background: 'var(--shadow-bg-soft)' }}
        >
          <div
            ref={sliderRef}
            onScroll={handleSliderScroll}
            className="manga-no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
          >
            {slidesLoading ? (
              <div
                className="flex aspect-[16/9] w-full shrink-0 items-center justify-center text-[13px] font-semibold"
                style={{
                  background: 'var(--shadow-bg-soft)',
                  color: 'var(--shadow-text-secondary)',
                }}
              >
                {t('mangaPage.loadingSlides')}
              </div>
            ) : null}

            {!slidesLoading && !slides.length ? (
              <div
                className="flex aspect-[16/9] w-full shrink-0 items-center justify-center text-[13px] font-semibold"
                style={{
                  background: 'var(--shadow-bg-soft)',
                  color: 'var(--shadow-text-secondary)',
                }}
              >
                {t('mangaPage.noSlides')}
              </div>
            ) : null}

            {!slidesLoading
              ? slides.map((slide) => {
                  const badge = getSlideBadge(slide)
                  const title = getSlideTitle(slide)

                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => slide.link_url && navigate(slide.link_url)}
                      className="relative aspect-[16/9] w-full shrink-0 snap-center overflow-hidden text-left"
                    >
                      <img
                        src={slide.image_url}
                        alt={title || t('mangaPage.mangaSlide')}
                        className="h-full w-full object-cover"
                      />
                      {badge || title || slide.subtitle || slide.description ? (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-4 pb-4 pt-14 text-white">
                          {title ? (
                            <h2 className="truncate text-[17px] font-black">
                              {title}
                            </h2>
                          ) : null}
                          {slide.subtitle || slide.description ? (
                            <p className="mt-1 truncate text-[11px] font-semibold text-white/90">
                              {slide.subtitle || slide.description}
                            </p>
                          ) : null}
                          {badge ? (
                            <span
                              className={`mt-2 inline-flex rounded-[5px] px-2 py-1 text-[9px] font-black ${badgeClasses[badge]}`}
                            >
                              {t(`mangaPage.${BADGE_LABEL_KEYS[badge]}`)}
                            </span>
                          ) : null}
                        </div>
                      ) : null}
                    </button>
                  )
                })
              : null}
          </div>

          {slides.length > 1 ? (
            <div className="absolute bottom-2 right-3 flex gap-1.5">
              {slides.map((slide, index) => (
                <span
                  key={slide.id}
                  className={`h-1.5 rounded-full bg-white transition-all ${
                    activeSlide === index ? 'w-4 opacity-100' : 'w-1.5 opacity-60'
                  }`}
                />
              ))}
            </div>
          ) : null}
        </section>

        <div className="grid grid-cols-4 gap-4 px-4 py-4 text-center">
          {[
            { icon: '/assets/Shortcut/Store.svg', label: 'Shop', path: '/shop' },
            { icon: '/assets/Shortcut/Task.svg', label: 'Tasks', path: '/tasks' },
            { icon: '/assets/Shortcut/Ranking.svg', label: 'Ranking', path: '/ranking' },
            { icon: '/assets/Shortcut/Event.svg', label: 'Event', path: '/event' },
          ].map((item) => {
            const displayLabel = t(
              `mangaPage.${SHORTCUT_LABEL_KEYS[item.label]}`
            )

            return (
              <button key={item.label} type="button" onClick={() => navigate(item.path)}>
                <div className="mx-auto mb-1 flex h-12 w-12 items-center justify-center">
                  <img src={item.icon} alt={displayLabel} className="h-7 w-7 object-contain" />
                </div>
                <span
                  className="text-[10px] font-semibold"
                  style={{ color: 'var(--shadow-text-primary)' }}
                >
                  {displayLabel}
                </span>
              </button>
            )
          })}
        </div>

        {activeGenre === 'today' ? (
          <>
            <div className="my-6">
              <ShadowSpotlight />
            </div>

            <div className="my-6">
              <ContinueReadingSection storyType="manga" />
            </div>

            <div className="my-6">
              <DailyPicksSection storyType="manga" />
            </div>

            <div className="my-6">
              <TrendingNowSection storyType="manga" />
            </div>

            <div className="my-6">
              <UpdateTodaySection storyType="manga" />
            </div>

            <div className="my-6">
              <EditorWeeklyPicksSection />
            </div>

            <div className="my-6">
              <NewArrivalsSection storyType="manga" />
            </div>

            <div className="my-6">
              <TopNovelSection storyType="manga" />
            </div>

            <div className="my-6">
              <EventPerksHubSection />
            </div>

            <div className="my-6">
              <YouMightLikeSection storyType="manga" />
            </div>
          </>
        ) : (
          <MangaFeedSections genre={activeGenre} />
        )}
      </main>

      {showNotificationPopup ? (
        <NotificationPage
          isOpen={showNotificationPopup}
          onClose={() => {
            setShowNotificationPopup(false)
            refreshNotificationUnreadCount()
          }}
        />
      ) : null}

      {!showNotificationPopup ? <StoriesDailyCheckIn /> : null}
    </div>
  )
}
