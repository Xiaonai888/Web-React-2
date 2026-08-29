import { useEffect, useRef, useState, useTransition } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import ShadowSpotlight from '../components/ShadowSpotlight'
import ShadowExclusiveSection from '../components/ShadowExclusiveSection'
import DailyPicksSection from '../components/DailyPicksSection'
import ContinueReadingSection from '../components/ContinueReadingSection'
import TrendingNowSection from '../components/TrendingNowSection'
import UpdateTodaySection from '../components/UpdateTodaySection'
import EditorWeeklyPicksSection from '../components/EditorWeeklyPicksSection'
import TopNovelSection from '../components/TopNovelSection'
import YouMightLikeSection from '../components/YouMightLikeSection'
import EventPerksHubSection from '../components/EventPerksHubSection'
import WeeklyUpdateSection from '../components/WeeklyUpdateSection'
import NewArrivalsSection from '../components/NewArrivalsSection'
import CompletedSection from '../components/CompletedSection'
import FanPicksSection from '../components/FanPicksSection'
import NotificationPage from './NotificationPage'
import EmbeddedGenreRouter from './Genre/EmbeddedGenreRouter'
import StoriesDailyCheckIn from '../components/StoriesDailyCheckIn'
import {
  getHomeCacheKey,
  loadHomeCache,
  saveHomeCache,
} from '../utils/homeDataCache'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('forYouPage', {
  en: {
    genres: 'Genres',
    search: 'Search',
    notifications: 'Notifications',
    novel: 'Novel',
    chatStory: 'Chat Story',
    manga: 'Manga',
    today: 'Today',
    romance: 'Romance',
    fantasy: 'Fantasy',
    action: 'Action',
    comedy: 'Comedy',
    drama: 'Drama',
    genre: 'Genre',
    comingSoon: 'This section is coming soon. Novel is available now.',
    loadingSlides: 'Loading slides...',
    noSlides: 'No slides yet',
    slide: 'Slide {{count}}',
    new: 'NEW',
    hot: 'HOT',
    top: 'TOP',
    shop: 'Shop',
    tasks: 'Tasks',
    ranking: 'Ranking',
    event: 'Event',
    shadowSpotlight: 'Shadow Spotlight',
    continueReading: 'Continue Reading',
    dailyPicks: 'Daily Picks',
    trendingNow: 'Trending Now',
    updateToday: 'Update Today',
    editorWeeklyPicks: "Editor's Weekly Picks",
    newArrivals: 'New Arrivals',
    topNovel: 'Top Novel',
    eventPerksHub: 'Event & Perks Hub',
    youMightLike: 'You Might Like',
  },
  km: {
    genres: 'ប្រភេទរឿង',
    search: 'ស្វែងរក',
    notifications: 'ការជូនដំណឹង',
    novel: 'Novel',
    chatStory: 'Chat Story',
    manga: 'Manga',
    today: 'ថ្ងៃនេះ',
    romance: 'មនោសញ្ចេតនា',
    fantasy: 'Fantasy',
    action: 'សកម្មភាព',
    comedy: 'កំប្លែង',
    drama: 'Drama',
    genre: 'ប្រភេទរឿង',
    comingSoon: 'ផ្នែកនេះនឹងមកដល់ឆាប់ៗនេះ។ ឥឡូវនេះ Novel អាចប្រើបាន។',
    loadingSlides: 'កំពុងផ្ទុក Slides...',
    noSlides: 'មិនទាន់មាន Slides',
    slide: 'Slide {{count}}',
    new: 'ថ្មី',
    hot: 'កំពុងពេញនិយម',
    top: 'កំពូល',
    shop: 'ហាង',
    tasks: 'បេសកកម្ម',
    ranking: 'ចំណាត់ថ្នាក់',
    event: 'ព្រឹត្តិការណ៍',
    shadowSpotlight: 'Shadow Spotlight',
    continueReading: 'បន្តអាន',
    dailyPicks: 'ជម្រើសប្រចាំថ្ងៃ',
    trendingNow: 'កំពុងពេញនិយម',
    updateToday: 'Update ថ្ងៃនេះ',
    editorWeeklyPicks: 'ជម្រើសប្រចាំសប្តាហ៍របស់ Editor',
    newArrivals: 'មកដល់ថ្មី',
    topNovel: 'Novel កំពូល',
    eventPerksHub: 'មជ្ឈមណ្ឌល Event & Perks',
    youMightLike: 'អ្នកអាចចូលចិត្ត',
  },
  zh: {
    genres: '类型',
    search: '搜索',
    notifications: '通知',
    novel: '小说',
    chatStory: 'Chat Story',
    manga: 'Manga',
    today: '今天',
    romance: '爱情',
    fantasy: '奇幻',
    action: '动作',
    comedy: '喜剧',
    drama: '剧情',
    genre: '类型',
    comingSoon: '此版块即将上线。目前 Novel 已可使用。',
    loadingSlides: '正在加载轮播...',
    noSlides: '暂无轮播',
    slide: '轮播 {{count}}',
    new: '新',
    hot: '热门',
    top: '榜首',
    shop: '商店',
    tasks: '任务',
    ranking: '排行榜',
    event: '活动',
    shadowSpotlight: 'Shadow 精选',
    continueReading: '继续阅读',
    dailyPicks: '每日精选',
    trendingNow: '当前热门',
    updateToday: '今日更新',
    editorWeeklyPicks: '编辑每周精选',
    newArrivals: '最新上架',
    topNovel: '热门小说',
    eventPerksHub: '活动与福利中心',
    youMightLike: '猜你喜欢',
  },
  ja: {
    genres: 'ジャンル',
    search: '検索',
    notifications: '通知',
    novel: '小説',
    chatStory: 'Chat Story',
    manga: 'Manga',
    today: '今日',
    romance: 'ロマンス',
    fantasy: 'ファンタジー',
    action: 'アクション',
    comedy: 'コメディ',
    drama: 'ドラマ',
    genre: 'ジャンル',
    comingSoon: 'このセクションは近日公開予定です。現在は Novel を利用できます。',
    loadingSlides: 'スライドを読み込み中...',
    noSlides: 'スライドはまだありません',
    slide: 'スライド {{count}}',
    new: '新着',
    hot: '人気',
    top: 'トップ',
    shop: 'ショップ',
    tasks: 'タスク',
    ranking: 'ランキング',
    event: 'イベント',
    shadowSpotlight: 'Shadow Spotlight',
    continueReading: '続きを読む',
    dailyPicks: 'デイリーピック',
    trendingNow: 'トレンド',
    updateToday: '本日の更新',
    editorWeeklyPicks: '編集部の週間ピック',
    newArrivals: '新着',
    topNovel: 'トップ小説',
    eventPerksHub: 'イベント＆特典',
    youMightLike: 'おすすめ',
  },
  ko: {
    genres: '장르',
    search: '검색',
    notifications: '알림',
    novel: '소설',
    chatStory: 'Chat Story',
    manga: 'Manga',
    today: '오늘',
    romance: '로맨스',
    fantasy: '판타지',
    action: '액션',
    comedy: '코미디',
    drama: '드라마',
    genre: '장르',
    comingSoon: '이 섹션은 곧 제공됩니다. 현재 Novel을 이용할 수 있습니다.',
    loadingSlides: '슬라이드를 불러오는 중...',
    noSlides: '아직 슬라이드가 없습니다',
    slide: '슬라이드 {{count}}',
    new: '신규',
    hot: '인기',
    top: 'TOP',
    shop: '상점',
    tasks: '미션',
    ranking: '랭킹',
    event: '이벤트',
    shadowSpotlight: 'Shadow Spotlight',
    continueReading: '계속 읽기',
    dailyPicks: '오늘의 추천',
    trendingNow: '지금 인기',
    updateToday: '오늘 업데이트',
    editorWeeklyPicks: '에디터 주간 추천',
    newArrivals: '신규 작품',
    topNovel: '인기 소설',
    eventPerksHub: '이벤트 & 혜택',
    youMightLike: '추천 작품',
  },
})

const SHOW_SHADOW_EXCLUSIVE = false
const STORY_SECTION_TITLES = ['Shadow Spotlight', 'Continue Reading', 'Daily Picks', 'Trending Now', 'Update Today', "Editor's Weekly Picks", 'New Arrivals', 'Top Novel', 'Event & Perks Hub', 'You Might Like']

const STORY_SECTION_TITLE_KEYS = {
  'Shadow Spotlight': 'shadowSpotlight',
  'Continue Reading': 'continueReading',
  'Daily Picks': 'dailyPicks',
  'Trending Now': 'trendingNow',
  'Update Today': 'updateToday',
  "Editor's Weekly Picks": 'editorWeeklyPicks',
  'New Arrivals': 'newArrivals',
  'Top Novel': 'topNovel',
  'Event & Perks Hub': 'eventPerksHub',
  'You Might Like': 'youMightLike',
}

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')
const HOME_SLIDES_CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000
const HOME_GENRES_CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000

const fallbackGenreTabs = [
  { label: 'Today', slug: 'today', is_locked: true },
  { label: 'Romance', slug: 'romance' },
  { label: 'Fantasy', slug: 'fantasy' },
  { label: 'Action', slug: 'action' },
  { label: 'Comedy', slug: 'comedy' },
  { label: 'Drama', slug: 'drama' },
]

const BUILT_IN_GENRE_LABELS = {
  today: { label: 'Today', key: 'today' },
  romance: { label: 'Romance', key: 'romance' },
  fantasy: { label: 'Fantasy', key: 'fantasy' },
  action: { label: 'Action', key: 'action' },
  comedy: { label: 'Comedy', key: 'comedy' },
  drama: { label: 'Drama', key: 'drama' },
}

const slideBadgeColors = {
  NEW: 'bg-[#ff2f55] text-white',
  HOT: 'bg-[#ff7a00] text-white',
  TOP: 'bg-[#f6b800] text-[#111827]',
}

const SLIDE_BADGE_LABEL_KEYS = {
  NEW: 'new',
  HOT: 'hot',
  TOP: 'top',
}

const STORY_TYPE_LABEL_KEYS = {
  novel: 'novel',
  chat: 'chatStory',
  manga: 'manga',
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

function getSlideSubtitle(slide) {
  return String(slide.subtitle || slide.sub_title || slide.description || '').trim()
}

function getSlideGenre(slide) {
  return String(slide.genre_label || slide.genre || slide.genre_name || slide.category || '').trim()
}

function getSlideBadgeClass(badge) {
  return slideBadgeColors[badge] || 'bg-[#ff2f55] text-white'
}

function getGenreDisplayLabel(tab, t) {
  if (tab?.label === 'Genre') {
    return t('forYouPage.genre')
  }

  const builtIn = BUILT_IN_GENRE_LABELS[tab?.slug]

  if (builtIn && tab?.label === builtIn.label) {
    return t(`forYouPage.${builtIn.key}`)
  }

  return tab?.label || ''
}

function getStorySectionTitle(title, t) {
  const key = STORY_SECTION_TITLE_KEYS[title]
  return key ? t(`forYouPage.${key}`) : title
}

function GridHeaderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      className="text-[#111827] dark:text-[var(--shadow-text-primary)]"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </svg>
  )
}

function SearchHeaderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      className="text-[#111827] dark:text-[var(--shadow-text-primary)]"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 4 4" />
    </svg>
  )
}

function BellHeaderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      className="text-[#111827] dark:text-[var(--shadow-text-primary)]"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6.5 9a5.5 5.5 0 0 1 11 0v3.2c0 1.4.5 2.7 1.5 3.8H5c1-1.1 1.5-2.4 1.5-3.8V9Z" />
      <path d="M10 19h4" />
    </svg>
  )
}

function ComingSoonPanel({ title }) {
  const { t } = useDisplayTranslation()

  return (
    <div className="px-4 py-8">
      <div className="rounded-[24px] bg-white p-8 text-center shadow-sm ring-1 ring-gray-100 dark:bg-[var(--shadow-bg-surface)] dark:shadow-[var(--shadow-shadow)] dark:ring-[var(--shadow-border)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
          <i className="fa-solid fa-clock text-xl" />
        </div>
        <h2 className="text-lg font-extrabold text-gray-900 dark:text-[var(--shadow-text-primary)]">{title}</h2>
        <p className="mt-2 text-sm font-medium leading-6 text-gray-500 dark:text-[var(--shadow-text-secondary)]">
          {t('forYouPage.comingSoon')}
        </p>
      </div>
    </div>
  )
}

const SHOW_STORY_TYPE_TABS = false

export default function ForYou({
  slideSectionKey = 'home_top_slider',
  titleOnlySections = false,
  onReady = null,
}) {
  const { t } = useDisplayTranslation()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('novel')
  const [activeGenre, setActiveGenre] = useState('today')
  const [contentGenre, setContentGenre] = useState('today')
  const [, startGenreTransition] = useTransition()
  const [pressedGenre, setPressedGenre] = useState('')
  const [genreTabs, setGenreTabs] = useState(fallbackGenreTabs)
  const [slides, setSlides] = useState([])
  const [slidesLoading, setSlidesLoading] = useState(true)
  const [barsHidden, setBarsHidden] = useState(false)
  const [notificationUnreadCount, setNotificationUnreadCount] = useState(0)
  const [showNotificationPopup, setShowNotificationPopup] = useState(false)
  async function refreshNotificationUnreadCount() {
  const token = sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''

  if (!token) {
    setNotificationUnreadCount(0)
    return
  }

  try {
    const response = await fetch(`${API_URL}/api/notifications/unread-count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json().catch(() => ({}))

    if (data?.ok) {
      setNotificationUnreadCount(Number(data.unread_count || 0))
    }
  } catch {
    setNotificationUnreadCount(0)
  }
}

  const navigate = useNavigate()
  const swiperRef = useRef(null)
  const lastScrollYRef = useRef(0)
  const swipeStartRef = useRef(null)

  function handleGenreChange(tab) {
  setPressedGenre(tab.slug)
  setActiveGenre(tab.slug)

  window.setTimeout(() => {
    setPressedGenre((current) =>
      current === tab.slug ? '' : current
    )
  }, 220)

  startGenreTransition(() => {
    setContentGenre(tab.slug)
  })
}

useEffect(() => {
  const requestedGenre = String(searchParams.get('genre') || '').trim().toLowerCase()

  if (!requestedGenre || requestedGenre === activeGenre) return

  const foundTab = genreTabs.find((tab) => tab.slug === requestedGenre)

  if (!foundTab) return

  handleGenreChange(foundTab)
}, [searchParams, genreTabs, activeGenre])

  function isSwipeBlockedTarget(target) {
    const element =
      typeof Element !== 'undefined' && target instanceof Element
        ? target
        : target?.parentElement

    if (!element) return true

    return Boolean(
      element.closest(
        [
          'button',
          'a',
          'input',
          'textarea',
          'select',
          '[role="button"]',
          '.mySwiper',
          '.swiper',
          '.swiper-container',
          '.swiper-wrapper',
          '.swiper-slide',
          '.overflow-x-auto',
          '.no-scrollbar',
          '.snap-x',
          '[data-swipe-block="true"]',
        ].join(',')
      )
    )
  }

  function moveGenreBySwipe(direction) {
    const currentIndex = genreTabs.findIndex((tab) => tab.slug === activeGenre)

    if (currentIndex === -1) return

    const nextIndex = direction === 'left' ? currentIndex + 1 : currentIndex - 1
    const nextTab = genreTabs[nextIndex]

    if (!nextTab) return

    handleGenreChange(nextTab)
  }

  function handleContentTouchStart(event) {
    if (event.touches.length !== 1 || isSwipeBlockedTarget(event.target)) {
      swipeStartRef.current = null
      return
    }

    const touch = event.touches[0]

    swipeStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    }
  }

  function handleContentTouchEnd(event) {
    const start = swipeStartRef.current
    swipeStartRef.current = null

    if (!start || event.changedTouches.length !== 1) return

    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - start.x
    const deltaY = touch.clientY - start.y
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    if (absX < 70) return
    if (absY > 45) return
    if (absX < absY * 1.3) return

    moveGenreBySwipe(deltaX < 0 ? 'left' : 'right')
  }

  useEffect(() => {
  let lastRefreshAt = 0

  function refreshIfNeeded() {
    const now = Date.now()

    if (now - lastRefreshAt < 30_000) {
      return
    }

    lastRefreshAt = now
    refreshNotificationUnreadCount()
  }

  refreshIfNeeded()

  function handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      refreshIfNeeded()
    }
  }

  function handleFocus() {
    refreshIfNeeded()
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('focus', handleFocus)

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('focus', handleFocus)
  }
}, [])


  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY
      const previousScrollY = lastScrollYRef.current
      const difference = currentScrollY - previousScrollY

      if (currentScrollY < 20) {
        setBarsHidden(false)
        document.body.classList.remove('for-you-bars-hidden')
      } else if (difference > 8) {
        setBarsHidden(true)
        document.body.classList.add('for-you-bars-hidden')
      } else if (difference < -8) {
        setBarsHidden(false)
        document.body.classList.remove('for-you-bars-hidden')
      }

      lastScrollYRef.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.body.classList.remove('for-you-bars-hidden')
    }
  }, [])

  useEffect(() => {
    let alive = true

    const cacheKey = getHomeCacheKey({
      section: 'genres',
      params: { source: 'featured-tabs' },
    })

    function applyGenreTabs(finalTabs) {
      if (!alive || !finalTabs.length) return

      setGenreTabs(finalTabs)

      setActiveGenre((current) =>
        finalTabs.some((tab) => tab.slug === current)
          ? current
          : 'today'
      )

      setContentGenre((current) =>
        finalTabs.some((tab) => tab.slug === current)
          ? current
          : 'today'
      )
    }

    async function loadGenreTabs() {
      const cached = await loadHomeCache(cacheKey, {
        maxAgeMs: HOME_GENRES_CACHE_MAX_AGE_MS,
        allowExpired: true,
      })

      const cachedTabs = Array.isArray(cached?.data)
        ? cached.data
        : []

      if (cachedTabs.length) {
        applyGenreTabs(cachedTabs)
      }

      if (cached?.isFresh && cachedTabs.length) {
        return
      }

      try {
        const res = await fetch(
          `${API_URL}/api/genres/featured-tabs`
        )
        const data = await res.json()

        if (!res.ok || data.ok === false) {
          throw new Error(
            data.message || 'Failed to fetch genre tabs'
          )
        }

        const tabs = (data.tabs || [])
          .map((tab) => ({
            label:
              tab.label ||
              tab.genre?.name ||
              'Genre',
            slug:
              tab.slug ||
              tab.genre?.slug ||
              String(tab.label || '').toLowerCase(),
            is_locked: Boolean(tab.is_locked),
          }))
          .filter((tab) => tab.label && tab.slug)
          .slice(0, 12)

        if (!tabs.length || !alive) return

        const today = tabs.find(
          (tab) => tab.slug === 'today'
        )
        const others = tabs.filter(
          (tab) => tab.slug !== 'today'
        )

        const finalTabs = today
          ? [today, ...others]
          : [
              {
                label: 'Today',
                slug: 'today',
                is_locked: true,
              },
              ...others,
            ].slice(0, 12)

        applyGenreTabs(finalTabs)

        await saveHomeCache(
          cacheKey,
          finalTabs,
          {
            maxAgeMs:
              HOME_GENRES_CACHE_MAX_AGE_MS,
          }
        )
      } catch (error) {
        console.error(
          'Fetch genre tabs error:',
          error
        )

        if (!cachedTabs.length && alive) {
          setGenreTabs(fallbackGenreTabs)
        }
      }
    }

    loadGenreTabs()

    return () => {
      alive = false
    }
  }, [])

 useEffect(() => {
  let alive = true

  async function loadSlides() {
    const cacheKey = getHomeCacheKey({
      section: 'slides',
      params: { section_key: slideSectionKey },
    })

    const cached = await loadHomeCache(cacheKey, {
      maxAgeMs: HOME_SLIDES_CACHE_MAX_AGE_MS,
      allowExpired: true,
    })

    const hasCachedSlides = Array.isArray(cached?.data)

    if (hasCachedSlides && alive) {
      setSlides(cached.data)
      setSlidesLoading(false)
    }

    if (cached?.isFresh && hasCachedSlides) return

    try {
      const res = await fetch(
        `${API_URL}/api/slides?section_key=${slideSectionKey}`
      )
      const data = await res.json()

      if (!res.ok || !data.ok) {
        throw new Error(data.message || 'Failed to fetch slides')
      }

      const nextSlides = Array.isArray(data.slides)
        ? data.slides
        : []

      if (!alive) return

      setSlides(nextSlides)

      await saveHomeCache(cacheKey, nextSlides, {
        maxAgeMs: HOME_SLIDES_CACHE_MAX_AGE_MS,
      })
    } catch (error) {
      console.error('Fetch home slides error:', error)

      if (alive && !hasCachedSlides) {
        setSlides([])
      }
    } finally {
      if (alive) setSlidesLoading(false)
    }
  }

  setSlidesLoading(true)
  loadSlides()

  return () => {
    alive = false
  }
}, [slideSectionKey])

  useEffect(() => {
  if (typeof onReady !== 'function') return undefined
  const timer = window.setTimeout(() => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(onReady))
  }, 400)
  return () => window.clearTimeout(timer)
}, [onReady])

  useEffect(() => {
    if (
      (!titleOnlySections && contentGenre !== 'today') ||
    !window.Swiper ||
    slides.length === 0
  ) {
    return
  }

    if (swiperRef.current) {
      swiperRef.current.destroy(true, true)
      swiperRef.current = null
    }

    swiperRef.current = new window.Swiper('.mySwiper', {
  effect: 'coverflow',
  grabCursor: true,

  centeredSlides: false,
  slidesPerView: 1,
  spaceBetween: 0,

  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 80,
    modifier: 2,
    slideShadows: false,
  },

  breakpoints: {
    768: {
      centeredSlides: true,
      slidesPerView: 'auto',
      spaceBetween: 0,
    },
  },

  loop: slides.length > 1,

  autoplay: {
    delay: 4500,
    disableOnInteraction: false,
  },

  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
})

    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true)
        swiperRef.current = null
      }
    }
  }, [slides, contentGenre, titleOnlySections])

  return (
    <>
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          background: var(--shadow-bg-page);
          font-family: 'Roboto', Arial, sans-serif;
          overflow-x: hidden;
        }

        .for-you-top-bars {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100000;
          background: var(--shadow-nav-bg);
          transition: transform 0.2s ease-out;
          will-change: transform;
        }

        body.for-you-bars-hidden footer {
          transform: translateY(110%);
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.mySwiper {
  width: 100%;
  padding-top: 0;
  padding-bottom: 0;
  overflow: hidden;
}

.mySwiper .swiper-slide {
  width: 100%;
  border-radius: 0;
  overflow: hidden;
  box-shadow: none;
  transition: all 0.3s ease;
}

.mySwiper .swiper-slide-next,
.mySwiper .swiper-slide-prev {
  opacity: 1;
  transform: none;
}

.mySwiper .swiper-pagination {
  left: auto;
  right: 10px;
  bottom: 8px;
  width: auto;
  text-align: right;
}

.mySwiper .swiper-pagination-bullet {
  width: 5px;
  height: 5px;
  margin: 0 2px !important;
  background: rgba(255, 255, 255, 0.65);
  opacity: 1;
}

.mySwiper .swiper-pagination-bullet-active {
  width: 5px;
  background: #ffffff;
  border-radius: 50%;
}

@media (min-width: 768px) {
  .mySwiper {
    padding-top: 10px;
    padding-bottom: 30px;
  }

  .mySwiper .swiper-slide {
    width: 58%;
    border-radius: 20px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  .mySwiper .swiper-slide-next,
  .mySwiper .swiper-slide-prev {
    opacity: 0.4;
    transform: scale(0.9);
  }

  .mySwiper .swiper-pagination {
    left: 0;
    right: 0;
    bottom: 10px;
    width: 100%;
    text-align: center;
  }

  .mySwiper .swiper-pagination-bullet {
    width: 8px;
    height: 8px;
    margin: 0 4px !important;
    background: var(--shadow-text-primary);
    opacity: 0.2;
  }

  .mySwiper .swiper-pagination-bullet-active {
    width: 20px;
    background: var(--shadow-text-primary);
    border-radius: 5px;
    opacity: 1;
  }
}

        @media (min-width: 768px) {
          .swiper-slide { width: 58%; }
        }

        .tab-item {
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          padding-bottom: 8px;
        }

        .tab-item.active {
          color: var(--shadow-text-primary);
          font-weight: 700;
        }

        .tab-item.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: #F6B800;
          border-radius: 10px;
        }
      `}</style>

      <div className="app-page min-h-screen" style={{ paddingBottom: '80px', overflowX: 'hidden', width: '100%' }}>
        <div
          className="for-you-top-bars"
          style={{ transform: barsHidden ? 'translateY(-100%)' : 'translateY(0)' }}
        >
          <header className="flex items-center justify-between bg-white px-4 py-3 text-[var(--shadow-text-primary)] dark:bg-[var(--shadow-nav-bg)]">
            <div className="flex items-center space-x-2">
             <div className="flex h-9 w-[92px] items-center overflow-visible">
  <img
    src="/assets/Icons/Logo Shadow 2.svg"
    alt="Shadow"
    className="h-full w-full object-contain object-left"
    loading="eager"
    decoding="async"
  />
</div>
            </div>

            <div className="flex items-center gap-5">
  <Link
    to="/genres"
    className="flex h-6 w-6 items-center justify-center text-[#111827] transition-transform active:scale-95 dark:text-[var(--shadow-text-primary)]"
    aria-label={t('forYouPage.genres')}
  >
    <GridHeaderIcon />
  </Link>

  <Link
    to="/search"
    className="flex h-6 w-6 items-center justify-center text-[#111827] transition-transform active:scale-95 dark:text-[var(--shadow-text-primary)]"
    aria-label={t('forYouPage.search')}
  >
    <SearchHeaderIcon />
  </Link>

  <button
    type="button"
    onClick={() => setShowNotificationPopup(true)}
    className="relative flex h-6 w-6 items-center justify-center text-[#111827] transition-transform active:scale-95 dark:text-[var(--shadow-text-primary)]"
    aria-label={t('forYouPage.notifications')}
  >
    <BellHeaderIcon />

    {notificationUnreadCount > 0 ? (
      <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F6B800] px-1.5 text-[10px] font-medium leading-none text-[#111827] shadow-sm">
        {notificationUnreadCount > 99 ? '99+' : notificationUnreadCount}
      </span>
    ) : null}
  </button>
</div>
          </header>

          {SHOW_STORY_TYPE_TABS ? (
  <nav className="flex px-4 space-x-8 border-b border-gray-100 bg-white pt-2 dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-nav-bg)]">
    {['novel', 'chat', 'manga'].map((tab) => (
      <div
        key={tab}
        className={`tab-item text-sm capitalize ${
          activeTab === tab ? 'active' : 'text-gray-400 font-semibold dark:text-[var(--shadow-text-secondary)]'
        }`}
        onClick={() => setActiveTab(tab)}
      >
        {t(`forYouPage.${STORY_TYPE_LABEL_KEYS[tab]}`)}
      </div>
    ))}
  </nav>
) : null}

          {activeTab === 'novel' ? (
            <div className="flex gap-1.5 overflow-x-auto border-t border-gray-50 bg-white px-4 pb-2 pt-0 no-scrollbar dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-nav-bg)]">
              {genreTabs.map((tab) => {
                const active = activeGenre === tab.slug
                const pressed = pressedGenre === tab.slug

                return (
                  <button
                    key={tab.slug}
                    type="button"
                    onClick={() => handleGenreChange(tab)}
                    className={`relative shrink-0 rounded-full px-3 py-2 text-[12px] transition-colors duration-200 ${
                      active
                        ? 'font-semibold text-[#111827] dark:text-[var(--shadow-text-primary)]'
                        : 'font-normal text-[#9ca3af] dark:text-[var(--shadow-text-secondary)]'
                    } ${
                      pressed
                        ? 'bg-[#f1f2f4] dark:bg-[var(--shadow-bg-hover)]'
                        : 'bg-transparent'
                    }`}
                  >
                    <span className="relative z-10">
                      {getGenreDisplayLabel(tab, t)}
                    </span>

                    <span
                      className={`absolute bottom-[3px] left-1/2 h-[3px] -translate-x-1/2 rounded-full bg-[#F6B800] transition-all duration-200 ${
                        active
                          ? 'w-[62%] opacity-100'
                          : 'w-0 opacity-0'
                      }`}
                    />
                  </button>
                )
              })}
            </div>
          ) : null}
        </div>

        <div style={{ height: activeTab === 'novel' ? '104px' : SHOW_STORY_TYPE_TABS ? '96px' : '58px' }} />

        {activeTab !== 'novel' ? (
          <ComingSoonPanel
            title={t(
              activeTab === 'chat'
                ? 'forYouPage.chatStory'
                : 'forYouPage.manga'
            )}
          />
        ) : (
         <div
           id="tab-content-root"
           onTouchStart={handleContentTouchStart}
           onTouchEnd={handleContentTouchEnd}
         >

           {contentGenre !== 'today' && !titleOnlySections ? (
  <EmbeddedGenreRouter
    key={contentGenre}
    genreSlug={contentGenre}
  />
) : (
  <>

            <div className="swiper-container mySwiper">
              <div className="swiper-wrapper">
                {slidesLoading && (
                  <div className="swiper-slide aspect-[16/9] bg-gray-100 flex items-center justify-center dark:bg-[var(--shadow-bg-soft)]">
                    <span className="text-sm font-semibold text-gray-400 dark:text-[var(--shadow-text-secondary)]">
                      {t('forYouPage.loadingSlides')}
                    </span>
                  </div>
                )}

                {!slidesLoading && slides.length === 0 && (
                  <div className="swiper-slide aspect-[16/9] bg-gray-100 flex items-center justify-center dark:bg-[var(--shadow-bg-soft)]">
                    <span className="text-sm font-semibold text-gray-400 dark:text-[var(--shadow-text-secondary)]">
                      {t('forYouPage.noSlides')}
                    </span>
                  </div>
                )}

                {!slidesLoading && slides.map((slide) => {
                  const slideBadge = getSlideBadge(slide)
                  const slideTitle = getSlideTitle(slide)
                  const slideSubtitle = getSlideSubtitle(slide)
                  const slideGenre = getSlideGenre(slide)

                  return (
                    <div
                      key={slide.id}
                      className="swiper-slide relative aspect-[16/9] cursor-pointer"
                      onClick={() => {
                        if (slide.link_url) navigate(slide.link_url)
                      }}
                    >
                      <img
                        src={slide.image_url}
                        className="h-full w-full object-cover"
                        alt={
                          slideTitle ||
                          t('forYouPage.slide', {
                            count: slide.order_index,
                          })
                        }
                        loading="lazy"
                        decoding="async"
                      />

                      {(slideBadge || slideTitle || slideSubtitle || slideGenre) ? (
  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-4 pb-4 pt-14">
    {slideTitle ? (
      <h2 className="truncate text-[16px] font-black leading-tight text-white drop-shadow sm:text-[24px]">
        {slideTitle}
      </h2>
    ) : null}

    {slideSubtitle ? (
      <p className="mt-1 truncate text-[10px] font-semibold leading-4 text-white/90 sm:text-[12px]">
        {slideSubtitle}
      </p>
    ) : null}

    {(slideBadge || slideGenre) ? (
      <div className="mt-2 flex items-center gap-2">
        {slideBadge ? (
          <span className={`shrink-0 rounded-[5px] px-2 py-1 text-[9px] font-black uppercase leading-none ${getSlideBadgeClass(slideBadge)}`}>
            {t(`forYouPage.${SLIDE_BADGE_LABEL_KEYS[slideBadge]}`)}
          </span>
        ) : null}

        {slideGenre ? (
          <span className="truncate text-[11px] font-black text-white/95">
            {slideGenre}
          </span>
        ) : null}
      </div>
    ) : null}
  </div>
) : null}
                    </div>
                  )
                })}
              </div>
              <div className="swiper-pagination" />
            </div>

            <div className="grid grid-cols-4 gap-4 px-4 py-4 text-center">
  {[
    { icon: '/assets/Shortcut/Store.svg', label: 'Shop', path: '/shop' },
    { icon: '/assets/Shortcut/Task.svg', label: 'Tasks', path: '/tasks' },
    { icon: '/assets/Shortcut/Ranking.svg', label: 'Ranking', path: '/ranking' },
    { icon: '/assets/Shortcut/Event.svg', label: 'Event', path: '/event' },
  ].map((item) => {
    const displayLabel = t(
      `forYouPage.${SHORTCUT_LABEL_KEYS[item.label]}`
    )

    return (
      <button
        key={item.label}
        type="button"
        className="group cursor-pointer"
        onClick={() => item.path && navigate(item.path)}
      >
        <div className="mx-auto mb-1 flex h-12 w-12 items-center justify-center transition-all">
          <img
            src={item.icon}
            alt={displayLabel}
            className="h-7 w-7 object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>

        <span className="text-[10px] font-semibold text-[#111827] dark:text-[var(--shadow-text-primary)]">
          {displayLabel}
        </span>
      </button>
    )
  })}
</div>
    {titleOnlySections ? (
  <div className="px-4 py-2">
    {STORY_SECTION_TITLES.map((title) => (
      <div key={title} className="my-8">
        <h2 className="text-[18px] font-extrabold tracking-tight text-neutral-900 dark:text-[var(--shadow-text-primary)]">
          {getStorySectionTitle(title, t)}
        </h2>
      </div>
    ))}
  </div>
) : (
  <>

            <div className="my-6">
              <ShadowSpotlight />
            </div>

            {SHOW_SHADOW_EXCLUSIVE ? (
  <div className="my-6">
    <ShadowExclusiveSection />
  </div>
) : null}

    <div className="my-6">
  <ContinueReadingSection />
</div>


            <div className="my-6">
              <DailyPicksSection />
            </div>

            <div className="my-6">
              <TrendingNowSection />
            </div>

           <div className="my-6">
  <UpdateTodaySection />
</div>

<div className="my-6">
  <EditorWeeklyPicksSection />
</div>

    <div className="my-6">
  <WeeklyUpdateSection />
</div>

            <div className="my-6">
              <NewArrivalsSection />
            </div>

            <div className="my-6">
              <TopNovelSection />
            </div>



            <div className="my-6">
              <EventPerksHubSection />
            </div>

            <div className="my-6">
              <YouMightLikeSection />
            </div>
  </>
)}

      </>
)}
          </div>
        )}
      </div>

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
    </>
  )
}
