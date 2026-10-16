import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getStoryBadge } from '../utils/storyBadge'
import { addStoryLanguageParam, getStoryLanguageId } from '../utils/storyLanguage'
import { getHomeCacheKey, loadHomeCache, saveHomeCache } from '../utils/homeDataCache'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('newArrivalsPage', {
  en: {
    fresh: 'Fresh',
    popular: 'Popular',
    recentComplete: 'Recent Complete',
    romance: 'Romance',
    fantasy: 'Fantasy',
    untitledStory: 'Untitled Story',
    shadowAuthor: 'Shadow Author',
    episodeCount: 'Ep {{count}}',
    badgeNew: 'NEW',
    badgeUp: 'UP',
    badgeEnd: 'END',
    emptyTitle: 'No new arrivals yet',
    emptyBody: 'Published stories will appear here after authors publish their episodes.',
    refresh: 'Refresh',
    loadFailed: 'Failed to load new arrivals',
    serverUnavailable: 'Cannot connect to server. Please try again later.',
    goBack: 'Go back',
    title: 'New Arrivals',
    loadMore: 'Load 9 More',
    loadingMore: 'Loading...',
    minuteLimit: 'You reached the 100-book limit for this minute. Please wait and try again.',
    retryIn: 'Try again in {{seconds}}s',
  },
  km: {
    fresh: 'ថ្មីបំផុត',
    popular: 'ពេញនិយម',
    recentComplete: 'ទើបបញ្ចប់',
    romance: 'ស្នេហា',
    fantasy: 'Fantasy',
    untitledStory: 'រឿងគ្មានចំណងជើង',
    shadowAuthor: 'អ្នកនិពន្ធ Shadow',
    episodeCount: 'ភាគ {{count}}',
    badgeNew: 'ថ្មី',
    badgeUp: 'អាប់ដេត',
    badgeEnd: 'ចប់',
    emptyTitle: 'មិនទាន់មានរឿងថ្មីទេ',
    emptyBody: 'រឿងដែលបានបោះពុម្ពនឹងបង្ហាញនៅទីនេះ បន្ទាប់ពីអ្នកនិពន្ធបោះពុម្ពភាគរបស់ពួកគេ។',
    refresh: 'ផ្ទុកឡើងវិញ',
    loadFailed: 'មិនអាចផ្ទុករឿងថ្មីបានទេ',
    serverUnavailable: 'មិនអាចភ្ជាប់ទៅ Server បានទេ។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។',
    goBack: 'ត្រឡប់ក្រោយ',
    title: 'រឿងថ្មី',
    loadMore: 'បង្ហាញ ៩ រឿងទៀត',
    loadingMore: 'កំពុងផ្ទុក...',
    minuteLimit: 'អ្នកបានដល់កំណត់ ១០០ រឿងក្នុងមួយនាទី។ សូមរង់ចាំហើយព្យាយាមម្ដងទៀត។',
    retryIn: 'សូមរង់ចាំ {{seconds}} វិនាទី',
  },
  zh: {
    fresh: '最新',
    popular: '热门',
    recentComplete: '最近完结',
    romance: '言情',
    fantasy: '奇幻',
    untitledStory: '无标题故事',
    shadowAuthor: 'Shadow 作者',
    episodeCount: '第 {{count}} 集',
    badgeNew: '新',
    badgeUp: '更新',
    badgeEnd: '完结',
    emptyTitle: '暂无新作品',
    emptyBody: '作者发布章节后，已发布的故事会显示在这里。',
    refresh: '刷新',
    loadFailed: '无法加载新作品',
    serverUnavailable: '无法连接服务器，请稍后再试。',
    goBack: '返回',
    title: '新作品',
    loadMore: '再加载9本',
    loadingMore: '加载中...',
    minuteLimit: '本分钟已达到100本上限，请稍后重试。',
    retryIn: '请在{{seconds}}秒后重试',
  },
  ja: {
    fresh: '新着',
    popular: '人気',
    recentComplete: '最近完結',
    romance: '恋愛',
    fantasy: 'ファンタジー',
    untitledStory: '無題のストーリー',
    shadowAuthor: 'Shadow 作者',
    episodeCount: '全 {{count}} 話',
    badgeNew: '新着',
    badgeUp: '更新',
    badgeEnd: '完結',
    emptyTitle: '新着作品はまだありません',
    emptyBody: '作者がエピソードを公開すると、公開済みストーリーがここに表示されます。',
    refresh: '更新',
    loadFailed: '新着作品を読み込めませんでした',
    serverUnavailable: 'サーバーに接続できません。しばらくしてからもう一度お試しください。',
    goBack: '戻る',
    title: '新着作品',
    loadMore: 'さらに9作品',
    loadingMore: '読み込み中...',
    minuteLimit: '1分間の上限100作品に達しました。少し待ってから再試行してください。',
    retryIn: '{{seconds}}秒後に再試行',
  },
  ko: {
    fresh: '최신',
    popular: '인기',
    recentComplete: '최근 완결',
    romance: '로맨스',
    fantasy: '판타지',
    untitledStory: '제목 없는 스토리',
    shadowAuthor: 'Shadow 작가',
    episodeCount: '총 {{count}}화',
    badgeNew: '신규',
    badgeUp: '업데이트',
    badgeEnd: '완결',
    emptyTitle: '아직 새 작품이 없습니다',
    emptyBody: '작가가 에피소드를 공개하면 게시된 스토리가 여기에 표시됩니다.',
    refresh: '새로고침',
    loadFailed: '새 작품을 불러오지 못했습니다',
    serverUnavailable: '서버에 연결할 수 없습니다. 나중에 다시 시도해 주세요.',
    goBack: '뒤로 가기',
    title: '신작',
    loadMore: '9개 더 보기',
    loadingMore: '불러오는 중...',
    minuteLimit: '1분 동안 최대 100권에 도달했습니다. 잠시 후 다시 시도하세요.',
    retryIn: '{{seconds}}초 후 다시 시도',
  },
})

const API_BASE_URL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const NEW_ARRIVALS_CACHE_MAX_AGE_MS = 2 * 60 * 60 * 1000
const NEW_ARRIVALS_PAGE_SIZE = 9
const NEW_ARRIVALS_AUTO_LIMIT = 27

const NEW_ARRIVALS_TAB_CONFIG = {
  Fresh: { sort: 'latest' },
  Popular: { sort: 'popular' },
  'Recent Complete': { sort: 'updated', storyStatus: 'Completed' },
  Romance: { sort: 'latest', genre: 'Romance' },
  Fantasy: { sort: 'latest', genre: 'Fantasy' },
}

const badgeStyles = {
  red: 'bg-red-500 text-white',
  yellow: 'bg-yellow-400 text-black',
  green: 'bg-lime-400 text-black',
}

const newArrivalsTabs = ['Fresh', 'Popular', 'Recent Complete', 'Romance', 'Fantasy']

const TAB_LABEL_KEYS = {
  Fresh: 'fresh',
  Popular: 'popular',
  'Recent Complete': 'recentComplete',
  Romance: 'romance',
  Fantasy: 'fantasy',
}

function normalizeStory(story, index = 0) {
  const badge = getStoryBadge(story)
  const badgeColor =
    badge === 'new'
      ? 'red'
      : badge === 'up'
        ? 'yellow'
        : badge === 'end'
          ? 'green'
          : ''

  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    badge: badge ? badge.toUpperCase() : '',
    badgeColor,
    cover:
      story.cover_url ||
      `/assets/New Arrival/New Arrival ${Math.min(index + 1, 18)}.jpg`,
    link: `/story/${story.id}`,
    genre: story.main_genre || '',
    isAdult: Boolean(story.is_adult),
    isFallback: false,
  }
}

function getBadgeLabel(value, t) {
  const badge = String(value || '').toUpperCase()

  if (badge === 'NEW') return t('newArrivalsPage.badgeNew')
  if (badge === 'UP') return t('newArrivalsPage.badgeUp')
  if (badge === 'END') return t('newArrivalsPage.badgeEnd')

  return value
}

function BookCard({ book }) {
  const { t } = useDisplayTranslation()
  const title =
    !book.title || book.title === 'Untitled Story'
      ? t('newArrivalsPage.untitledStory')
      : book.title

  return (
    <Link to={book.link} className="group block">
      <div className="flex flex-col items-start">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm dark:bg-[var(--shadow-bg-elevated)]">
          <img
            src={book.cover}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = '/assets/New Arrival/New Arrival 1.jpg'
            }}
          />

          {book.badge ? (
            <div
              className={`absolute right-2 top-2 rounded-full px-3 py-1 text-[10px] font-extrabold sm:text-[11px] ${badgeStyles[book.badgeColor]}`}
            >
              {getBadgeLabel(book.badge, t)}
            </div>
          ) : null}

          {book.isAdult ? (
            <div className="absolute bottom-2 left-2 rounded-full bg-[#fff1f1] px-2.5 py-1 text-[10px] font-extrabold text-[#e5484d] dark:bg-red-400/15 dark:text-red-300">
              18+
            </div>
          ) : null}
        </div>

        <div className="mt-3 w-full">
          <h3 className="line-clamp-2 min-h-[44px] text-[16px] font-extrabold leading-[22px] tracking-tight text-neutral-900 dark:text-[var(--shadow-text-primary)]">
            {title}
          </h3>

          {book.genre ? (
            <div className="mt-2">
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10.5px] font-normal text-gray-500 dark:bg-[var(--shadow-bg-elevated)] dark:text-[var(--shadow-text-secondary)]">
                {book.genre}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  )
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-6 lg:grid-cols-6">
      {Array.from({ length: NEW_ARRIVALS_PAGE_SIZE }).map((_, index) => (
        <div key={index}>
          <div className="aspect-[2/3] animate-pulse rounded-2xl bg-gray-100 dark:bg-[var(--shadow-bg-elevated)]" />
          <div className="mt-3 h-4 animate-pulse rounded-full bg-gray-100 dark:bg-[var(--shadow-bg-elevated)]" />
          <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-gray-100 dark:bg-[var(--shadow-bg-elevated)]" />
        </div>
      ))}
    </div>
  )
}

function EmptyState({ onRefresh }) {
  const { t } = useDisplayTranslation()

  return (
    <div className="rounded-2xl bg-white px-5 py-12 text-center shadow-sm ring-1 ring-gray-100 dark:bg-[var(--shadow-bg-surface)] dark:ring-[var(--shadow-border)] dark:shadow-none">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-[var(--shadow-bg-elevated)] dark:text-[var(--shadow-text-secondary)]">
        <i className="fa-regular fa-file-lines text-[22px]" />
      </div>

      <h2 className="mt-4 text-[17px] font-extrabold text-neutral-900 dark:text-[var(--shadow-text-primary)]">
        {t('newArrivalsPage.emptyTitle')}
      </h2>

      <p className="mx-auto mt-2 max-w-[320px] text-[13px] leading-6 text-gray-500 dark:text-[var(--shadow-text-secondary)]">
        {t('newArrivalsPage.emptyBody')}
      </p>

      <button
        type="button"
        onClick={onRefresh}
        className="mt-5 rounded-full bg-neutral-950 px-5 py-3 text-[13px] font-extrabold text-white active:scale-95"
      >
        {t('newArrivalsPage.refresh')}
      </button>
    </div>
  )
}

export default function NewArrivalsPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [activeTab, setActiveTab] = useState('Fresh')
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [message, setMessage] = useState('')
  const [cooldownUntil, setCooldownUntil] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [pageStates, setPageStates] = useState({})
  const pageStatesRef = useRef({})
  const requestRef = useRef(null)
  const sentinelRef = useRef(null)

  useEffect(() => {
    if (!cooldownUntil) return
    const update = () => {
      setSecondsLeft(Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000)))
    }
    update()
    const interval = window.setInterval(update, 1000)
    return () => window.clearInterval(interval)
  }, [cooldownUntil])

  function updatePageState(tab, nextState) {
    const previous = pageStatesRef.current[tab] || {
      books: [],
      nextOffset: 0,
      hasMore: true,
      loaded: false,
      error: false,
    }
    const updated = { ...previous, ...nextState }
    pageStatesRef.current = {
      ...pageStatesRef.current,
      [tab]: updated,
    }
    setPageStates((current) => ({ ...current, [tab]: updated }))
  }

  async function fetchNewArrivalsPageData(tab, { reset = false, force = false } = {}) {
    const config = NEW_ARRIVALS_TAB_CONFIG[tab]
    if (!config || requestRef.current || Date.now() < cooldownUntil) return

    const previous = pageStatesRef.current[tab]
    const offset = reset ? 0 : previous?.nextOffset || 0
    if (!reset && !previous?.hasMore) return

    const limit = NEW_ARRIVALS_PAGE_SIZE
    const controller = new AbortController()
    const request = { tab, controller }
    requestRef.current = request

    if (offset === 0) setLoading(true)
    else setLoadingMore(true)
    setMessage('')

    const cacheKey = getHomeCacheKey({
      section: 'stories',
      language: getStoryLanguageId(),
      params: {
        page: 'new-arrivals',
        tab,
        offset,
        limit,
        sort: config.sort,
        genre: config.genre || '',
        story_status: config.storyStatus || '',
        schema: 3,
      },
    })

    try {
      let payload = null

      if (!force) {
        const cached = await loadHomeCache(cacheKey, {
          maxAgeMs: NEW_ARRIVALS_CACHE_MAX_AGE_MS,
          allowExpired: false,
        })

        if (controller.signal.aborted) return
        if (cached?.isFresh && Array.isArray(cached?.data?.books)) {
          payload = cached.data
        }
      }

      if (!payload) {
        const params = new URLSearchParams({
          new_arrivals_pagination: '1',
          limit: String(limit),
          offset: String(offset),
          sort: config.sort,
        })

        if (config.genre) params.set('genre', config.genre)
        if (config.storyStatus) params.set('story_status', config.storyStatus)

        const response = await fetch(
          addStoryLanguageParam(
            `${API_BASE_URL}/api/public/stories?${params.toString()}`
          ),
          { signal: controller.signal }
        )
        const data = await response.json().catch(() => ({}))

        if (response.status === 429 && data.code === 'NEW_ARRIVALS_MINUTE_LIMIT') {
          const retryAfter = Number(
            response.headers.get('Retry-After') || data.retry_after_seconds || 60
          )
          setCooldownUntil(Date.now() + Math.max(1, Math.min(120, retryAfter)) * 1000)
          throw new Error(t('newArrivalsPage.minuteLimit'))
        }

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || t('newArrivalsPage.loadFailed'))
        }

        if (
          !data.pagination ||
          Number(data.pagination.offset) !== offset ||
          !Array.isArray(data.stories)
        ) {
          throw new Error(t('newArrivalsPage.loadFailed'))
        }

        const sourceBooks = data.stories
        const nextBooks =
          tab === 'Recent Complete'
            ? sourceBooks.filter((story) => getStoryBadge(story) === 'end')
            : sourceBooks

        const nextOffset = Number.isSafeInteger(Number(data.pagination.next_offset)) &&
          data.pagination.next_offset !== null
          ? Number(data.pagination.next_offset)
          : offset + sourceBooks.length

        payload = {
          books: nextBooks.map((story, index) => normalizeStory(story, offset + index)),
          nextOffset,
          hasMore:
            Boolean(data.pagination.has_more) &&
            sourceBooks.length > 0 &&
            nextOffset > offset,
        }

        if (controller.signal.aborted) return

        await saveHomeCache(cacheKey, payload, {
          maxAgeMs: NEW_ARRIVALS_CACHE_MAX_AGE_MS,
        })
      }

      if (controller.signal.aborted) return

      const existing = reset ? [] : pageStatesRef.current[tab]?.books || []
      const seen = new Set(existing.map((book) => String(book.id)))
      const appended = payload.books.filter((book) => {
        const id = String(book.id)
        if (seen.has(id)) return false
        seen.add(id)
        return true
      })

      updatePageState(tab, {
        books: [...existing, ...appended],
        nextOffset: payload.nextOffset,
        hasMore: payload.hasMore,
        loaded: true,
        error: false,
      })
    } catch (error) {
      if (controller.signal.aborted || error?.name === 'AbortError') return

      console.error('NewArrivalsPage fetch error:', error)
      updatePageState(tab, { error: true })
      setMessage(
        error.message === 'Failed to fetch'
          ? t('newArrivalsPage.serverUnavailable')
          : error.message || t('newArrivalsPage.loadFailed')
      )
    } finally {
      if (requestRef.current === request) {
        requestRef.current = null
        setLoading(false)
        setLoadingMore(false)
      }
    }
  }

  useEffect(() => {
    setMessage(Date.now() < cooldownUntil ? t('newArrivalsPage.minuteLimit') : '')
    const tabState = pageStatesRef.current[activeTab]
    setLoading(!tabState?.loaded && !tabState?.books?.length)
    setLoadingMore(false)

    if (!tabState?.loaded) {
      if (Date.now() < cooldownUntil) setLoading(false)
      else fetchNewArrivalsPageData(activeTab, { reset: true })
    }

    return () => {
      const current = requestRef.current
      if (current?.tab === activeTab) {
        current.controller.abort()
        requestRef.current = null
      }
    }
  }, [activeTab])

  const activePage = pageStates[activeTab] || {
    books: [],
    nextOffset: 0,
    hasMore: true,
    loaded: false,
    error: false,
  }
  const books = activePage.books
  const autoAvailable =
    !loading &&
    !loadingMore &&
    !activePage.error &&
    activePage.hasMore &&
    books.length > 0 &&
    books.length < NEW_ARRIVALS_AUTO_LIMIT &&
    secondsLeft === 0

  useEffect(() => {
    if (!autoAvailable || !sentinelRef.current) return

    const tab = activeTab
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        observer.disconnect()
        fetchNewArrivalsPageData(tab)
      },
      { rootMargin: '200px 0px' }
    )

    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [
    activeTab,
    autoAvailable,
    books.length,
    activePage.nextOffset,
    activePage.hasMore,
  ])

  const canLoadMore =
    !loading &&
    !loadingMore &&
    activePage.hasMore &&
    books.length > 0 &&
    (books.length >= NEW_ARRIVALS_AUTO_LIMIT || activePage.error)

  return (
    <div className="app-page min-h-screen bg-white pb-32 dark:bg-[var(--shadow-bg-page)]">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white shadow-sm dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-nav-bg)] dark:shadow-none">
        <div className="grid h-14 grid-cols-[36px_1fr_36px] items-center px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-[var(--shadow-bg-hover)]"
            aria-label={t('newArrivalsPage.goBack')}
          >
            <i className="fas fa-chevron-left text-[18px] text-gray-700 dark:text-[var(--shadow-text-primary)]" />
          </button>

          <h1 className="text-center text-[18px] font-extrabold tracking-tight text-neutral-900 dark:text-[var(--shadow-text-primary)]">
            {t('newArrivalsPage.title')}
          </h1>

          <div className="h-9 w-9" />
        </div>
      </header>

      <main className="px-4 pt-4">
        <div className="mb-5 flex gap-3 overflow-x-auto pb-1 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {newArrivalsTabs.map((tab) => {
            const isActive = activeTab === tab

            return (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab)
                  setMessage('')
                  if (!pageStatesRef.current[tab]?.loaded) setLoading(true)
                }}
                className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-[#111827]'
                    : 'border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-bg-surface)] dark:text-[var(--shadow-text-secondary)] dark:hover:bg-[var(--shadow-bg-hover)]'
                }`}
              >
                {t(`newArrivalsPage.${TAB_LABEL_KEYS[tab]}`)}
              </button>
            )
          })}
        </div>

        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mb-4 w-full rounded-[16px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#e5484d] dark:bg-red-400/10 dark:text-red-300"
          >
            {message}
          </button>
        ) : null}

        {loading ? (
          <LoadingGrid />
        ) : books.length ? (
          <>
            <div className="grid grid-cols-3 gap-x-4 gap-y-6 lg:grid-cols-6">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {autoAvailable ? (
              <div ref={sentinelRef} className="h-2 w-full" aria-hidden="true" />
            ) : null}

            {loadingMore && books.length < NEW_ARRIVALS_AUTO_LIMIT ? (
              <p className="mt-6 text-center text-[13px] text-gray-500 dark:text-[var(--shadow-text-secondary)]">
                {t('newArrivalsPage.loadingMore')}
              </p>
            ) : null}

            {canLoadMore ? (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => fetchNewArrivalsPageData(activeTab)}
                  disabled={secondsLeft > 0}
                  className="rounded-full border border-neutral-300 bg-white px-6 py-3 text-[13px] font-medium text-neutral-900 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-bg-surface)] dark:text-[var(--shadow-text-primary)] dark:hover:bg-[var(--shadow-bg-hover)]"
                >
                  {secondsLeft > 0
                    ? t('newArrivalsPage.retryIn', { seconds: secondsLeft })
                    : t('newArrivalsPage.loadMore')}
                </button>
              </div>
            ) : null}

            {loadingMore && books.length >= NEW_ARRIVALS_AUTO_LIMIT ? (
              <p className="mt-6 text-center text-[13px] text-gray-500 dark:text-[var(--shadow-text-secondary)]">
                {t('newArrivalsPage.loadingMore')}
              </p>
            ) : null}
          </>
        ) : activePage.error && secondsLeft > 0 ? (
          <p className="py-12 text-center text-[13px] text-gray-500 dark:text-[var(--shadow-text-secondary)]">
            {t('newArrivalsPage.retryIn', { seconds: secondsLeft })}
          </p>
        ) : (
          <EmptyState
            onRefresh={() =>
              fetchNewArrivalsPageData(activeTab, { reset: true, force: true })
            }
          />
        )}
      </main>
    </div>
  )
}
