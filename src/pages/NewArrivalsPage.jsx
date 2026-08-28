import { useEffect, useMemo, useState } from 'react'
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
  },
})

const API_BASE_URL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const NEW_ARRIVALS_CACHE_MAX_AGE_MS = 2 * 60 * 60 * 1000

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

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`
  }

  return String(number)
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
    author: story.author_page?.page_name || story.author_name || 'Shadow Author',
    badge: badge ? badge.toUpperCase() : '',
    badgeColor,
    likes: formatCompactNumber(story.total_likes),
    views: formatCompactNumber(story.total_views),
    episodes: `Ep ${Number(story.total_episodes || 0)}`,
    cover:
      story.cover_url ||
      `/assets/New Arrival/New Arrival ${Math.min(index + 1, 18)}.jpg`,
    link: `/story/${story.id}`,
    genre: story.main_genre || '',
    isAdult: Boolean(story.is_adult),
    isFallback: false,
  }
}

function getEpisodeCount(value) {
  const match = String(value || '').match(/\d+/)
  return match ? Number(match[0]) : 0
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
  const author =
    !book.author || book.author === 'Shadow Author'
      ? t('newArrivalsPage.shadowAuthor')
      : book.author

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

          <p className="mt-1 line-clamp-1 text-[13px] font-medium text-gray-500 dark:text-[var(--shadow-text-secondary)]">
            {author}
          </p>

          {book.genre ? (
            <div className="mt-2">
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10.5px] font-bold text-gray-500 dark:bg-[var(--shadow-bg-elevated)] dark:text-[var(--shadow-text-secondary)]">
                {book.genre}
              </span>
            </div>
          ) : null}

          <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-500 dark:text-[var(--shadow-text-tertiary)]">
            <span className="flex items-center gap-1">
              <i className="fas fa-heart text-[10px] text-red-500" /> {book.likes}
            </span>
            <span className="flex items-center gap-1">
              <i className="fas fa-list text-[10px]" />{' '}
              {t('newArrivalsPage.episodeCount', {
                count: getEpisodeCount(book.episodes),
              })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-6 lg:grid-cols-6">
      {Array.from({ length: 18 }).map((_, index) => (
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
  const [message, setMessage] = useState('')
  const [realBooks, setRealBooks] = useState({
    Fresh: [],
    Popular: [],
    'Recent Complete': [],
    Romance: [],
    Fantasy: [],
  })

  async function fetchNewArrivalsPageData(
    tab = activeTab,
    { force = false, signal } = {}
  ) {
    const config = NEW_ARRIVALS_TAB_CONFIG[tab]

    if (!config) return

    const cacheKey = getHomeCacheKey({
      section: 'stories',
      language: getStoryLanguageId(),
      params: {
        page: 'new-arrivals',
        tab,
        limit: 48,
        sort: config.sort,
        genre: config.genre || '',
        story_status: config.storyStatus || '',
        schema: 1,
      },
    })

    let hasCachedBooks = false

    if (!force) {
      const cached = await loadHomeCache(cacheKey, {
        maxAgeMs: NEW_ARRIVALS_CACHE_MAX_AGE_MS,
        allowExpired: true,
      })

      if (signal?.aborted) return

      hasCachedBooks = Array.isArray(cached?.data)

      if (hasCachedBooks) {
        setRealBooks((current) => ({
          ...current,
          [tab]: cached.data,
        }))
        setLoading(false)
      }

      if (cached?.isFresh && hasCachedBooks) {
        return
      }
    }

    try {
      if (!hasCachedBooks) {
        setLoading(true)
      }

      setMessage('')

      const params = new URLSearchParams({
        limit: '48',
        sort: config.sort,
      })

      if (config.genre) {
        params.set('genre', config.genre)
      }

      if (config.storyStatus) {
        params.set('story_status', config.storyStatus)
      }

      const response = await fetch(
        addStoryLanguageParam(
          `${API_BASE_URL}/api/public/stories?${params.toString()}`
        ),
        { signal }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message || t('newArrivalsPage.loadFailed')
        )
      }

      let nextBooks = (
        Array.isArray(data.stories) ? data.stories : []
      )

      if (tab === 'Recent Complete') {
        nextBooks = nextBooks.filter(
          (story) => getStoryBadge(story) === 'end'
        )
      }

      nextBooks = nextBooks.map((story, index) =>
        normalizeStory(story, index)
      )

      if (signal?.aborted) return

      setRealBooks((current) => ({
        ...current,
        [tab]: nextBooks,
      }))

      await saveHomeCache(cacheKey, nextBooks, {
        maxAgeMs: NEW_ARRIVALS_CACHE_MAX_AGE_MS,
      })
    } catch (error) {
      if (error?.name === 'AbortError') return

      console.error('NewArrivalsPage fetch error:', error)

      if (!hasCachedBooks) {
        setRealBooks((current) => ({
          ...current,
          [tab]: [],
        }))
      }

      setMessage(
        error.message === 'Failed to fetch'
          ? t('newArrivalsPage.serverUnavailable')
          : error.message || t('newArrivalsPage.loadFailed')
      )
    } finally {
      if (!signal?.aborted) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController()

    fetchNewArrivalsPageData(activeTab, {
      signal: controller.signal,
    })

    return () => {
      controller.abort()
    }
  }, [activeTab])

  const books = useMemo(
    () => realBooks[activeTab] || [],
    [activeTab, realBooks]
  )

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
                onClick={() => setActiveTab(tab)}
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
          <div className="grid grid-cols-3 gap-x-4 gap-y-6 lg:grid-cols-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <EmptyState
            onRefresh={() =>
              fetchNewArrivalsPageData(activeTab, { force: true })
            }
          />
        )}
      </main>
    </div>
  )
}
