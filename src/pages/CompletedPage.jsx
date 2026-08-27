import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { addStoryLanguageParam, getStoryLanguageId } from '../utils/storyLanguage'
import { getHomeCacheKey, loadHomeCache, saveHomeCache } from '../utils/homeDataCache'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('completedPage', {
  en: {
    hot: 'Hot',
    romance: 'Romance',
    fantasy: 'Fantasy',
    latest: 'Latest',
    hotQuote: 'Finished stories readers are opening now.',
    romanceQuote: 'Complete romance stories with full endings.',
    fantasyQuote: 'Complete fantasy stories ready for a long reading session.',
    latestQuote: 'Recently updated published stories from Shadow authors.',
    untitledStory: 'Untitled Story',
    shadowAuthor: 'Shadow Author',
    noDescription: 'No description yet.',
    demoBookTitle: 'Name Book',
    demoAuthor: 'Author Name',
    demoDescription: 'A completed Shadow story. Real published stories will appear here after author publishing data is available.',
    episodeCount: 'Ep {{count}}',
    freePreview: 'FREE PREVIEW',
    goToSlide: 'Go to slide {{number}}',
    noCompleted: 'No completed stories yet',
    emptyText: 'Published stories will appear here after author data is available.',
    refresh: 'Refresh',
    loadFailed: 'Failed to load completed stories',
    serverUnavailable: 'Cannot connect to server. Please try again later.',
    goBack: 'Go back',
    completed: 'Completed',
  },
  km: {
    hot: 'ពេញនិយម',
    romance: 'មនោសញ្ចេតនា',
    fantasy: 'Fantasy',
    latest: 'ថ្មីបំផុត',
    hotQuote: 'រឿងដែលបញ្ចប់ហើយ និងកំពុងមានអ្នកអានចូលអានឥឡូវនេះ។',
    romanceQuote: 'រឿងមនោសញ្ចេតនាដែលបញ្ចប់ពេញលេញ និងមានចុងបញ្ចប់រួចរាល់។',
    fantasyQuote: 'រឿង Fantasy ដែលបញ្ចប់ពេញលេញ សម្រាប់អានយូរៗបានភ្លាម។',
    latestQuote: 'រឿងដែលបានបង្ហោះ និងធ្វើបច្ចុប្បន្នភាពថ្មីៗពីអ្នកនិពន្ធ Shadow។',
    untitledStory: 'រឿងគ្មានចំណងជើង',
    shadowAuthor: 'អ្នកនិពន្ធ Shadow',
    noDescription: 'មិនទាន់មានការពិពណ៌នាទេ។',
    demoBookTitle: 'ឈ្មោះរឿង',
    demoAuthor: 'ឈ្មោះអ្នកនិពន្ធ',
    demoDescription: 'រឿង Shadow ដែលបានបញ្ចប់។ រឿងដែលបានបោះពុម្ពពិតនឹងបង្ហាញនៅទីនេះ នៅពេលមានទិន្នន័យពីអ្នកនិពន្ធ។',
    episodeCount: 'ភាគ {{count}}',
    freePreview: 'អានសាកឥតគិតថ្លៃ',
    goToSlide: 'ទៅស្លាយទី {{number}}',
    noCompleted: 'មិនទាន់មានរឿងដែលបញ្ចប់ទេ',
    emptyText: 'រឿងដែលបានបោះពុម្ពនឹងបង្ហាញនៅទីនេះ នៅពេលមានទិន្នន័យពីអ្នកនិពន្ធ។',
    refresh: 'ផ្ទុកឡើងវិញ',
    loadFailed: 'មិនអាចផ្ទុករឿងដែលបញ្ចប់បានទេ',
    serverUnavailable: 'មិនអាចភ្ជាប់ទៅ Server បានទេ។ សូមសាកម្តងទៀតនៅពេលក្រោយ។',
    goBack: 'ត្រឡប់ក្រោយ',
    completed: 'រឿងបញ្ចប់',
  },
  zh: {
    hot: '热门',
    romance: '爱情',
    fantasy: '奇幻',
    latest: '最新',
    hotQuote: '读者正在阅读的完结故事。',
    romanceQuote: '拥有完整结局的完结爱情故事。',
    fantasyQuote: '适合长时间阅读的完结奇幻故事。',
    latestQuote: 'Shadow 作者最近更新并发布的故事。',
    untitledStory: '无标题故事',
    shadowAuthor: 'Shadow 作者',
    noDescription: '暂无简介。',
    demoBookTitle: '故事名称',
    demoAuthor: '作者名称',
    demoDescription: '一部已完结的 Shadow 故事。当作者发布数据可用后，真实发布的故事会显示在这里。',
    episodeCount: '第 {{count}} 集',
    freePreview: '免费试看',
    goToSlide: '前往第 {{number}} 页',
    noCompleted: '还没有完结故事',
    emptyText: '作者发布的数据可用后，已发布的故事会显示在这里。',
    refresh: '刷新',
    loadFailed: '无法加载完结故事',
    serverUnavailable: '无法连接到服务器，请稍后再试。',
    goBack: '返回',
    completed: '已完结',
  },
  ja: {
    hot: '人気',
    romance: 'ロマンス',
    fantasy: 'ファンタジー',
    latest: '最新',
    hotQuote: '今、読者に読まれている完結ストーリー。',
    romanceQuote: '結末まで読める完結ロマンスストーリー。',
    fantasyQuote: 'じっくり読める完結ファンタジーストーリー。',
    latestQuote: 'Shadow 作者が最近更新・公開したストーリー。',
    untitledStory: '無題のストーリー',
    shadowAuthor: 'Shadow 作者',
    noDescription: 'まだ説明はありません。',
    demoBookTitle: 'ストーリー名',
    demoAuthor: '作者名',
    demoDescription: '完結した Shadow ストーリーです。作者の公開データが利用可能になると、実際に公開されたストーリーがここに表示されます。',
    episodeCount: '全 {{count}} 話',
    freePreview: '無料プレビュー',
    goToSlide: '{{number}} ページ目へ',
    noCompleted: '完結ストーリーはまだありません',
    emptyText: '作者の公開データが利用可能になると、公開済みストーリーがここに表示されます。',
    refresh: '更新',
    loadFailed: '完結ストーリーを読み込めませんでした',
    serverUnavailable: 'サーバーに接続できません。しばらくしてからもう一度お試しください。',
    goBack: '戻る',
    completed: '完結',
  },
  ko: {
    hot: '인기',
    romance: '로맨스',
    fantasy: '판타지',
    latest: '최신',
    hotQuote: '지금 독자들이 읽고 있는 완결 스토리입니다.',
    romanceQuote: '결말까지 완성된 로맨스 스토리입니다.',
    fantasyQuote: '오래 읽기 좋은 완결 판타지 스토리입니다.',
    latestQuote: 'Shadow 작가들이 최근 업데이트해 공개한 스토리입니다.',
    untitledStory: '제목 없는 스토리',
    shadowAuthor: 'Shadow 작가',
    noDescription: '아직 설명이 없습니다.',
    demoBookTitle: '스토리 이름',
    demoAuthor: '작가 이름',
    demoDescription: '완결된 Shadow 스토리입니다. 작가 게시 데이터가 제공되면 실제 공개 스토리가 여기에 표시됩니다.',
    episodeCount: '총 {{count}}화',
    freePreview: '무료 미리보기',
    goToSlide: '{{number}}번째 페이지로 이동',
    noCompleted: '아직 완결 스토리가 없습니다',
    emptyText: '작가 게시 데이터가 제공되면 공개된 스토리가 여기에 표시됩니다.',
    refresh: '새로고침',
    loadFailed: '완결 스토리를 불러오지 못했습니다',
    serverUnavailable: '서버에 연결할 수 없습니다. 나중에 다시 시도해 주세요.',
    goBack: '뒤로 가기',
    completed: '완결',
  },
})

const API_BASE_URL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const COMPLETED_PAGE_CACHE_MAX_AGE_MS = 2 * 60 * 60 * 1000

const COMPLETED_TAB_CONFIG = {
  Hot: { sort: 'popular' },
  Romance: { sort: 'updated', genre: 'Romance' },
  Fantasy: { sort: 'updated', genre: 'Fantasy' },
  Latest: { sort: 'latest' },
}

const completedTabs = ['Hot', 'Romance', 'Fantasy', 'Latest']

const completedQuoteKeys = {
  Hot: 'hotQuote',
  Romance: 'romanceQuote',
  Fantasy: 'fantasyQuote',
  Latest: 'latestQuote',
}

const completedTabLabelKeys = {
  Hot: 'hot',
  Romance: 'romance',
  Fantasy: 'fantasy',
  Latest: 'latest',
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`

  return String(number)
}

function normalizeStory(story, index = 0) {
  return {
    id: story.id,
    title: story.title || '',
    author: story.author_name || '',
    views: formatCompactNumber(story.total_views),
    likes: formatCompactNumber(story.total_likes),
    episodesCount: Number(story.total_episodes || 0),
    rating: '5.0',
    ratingCount: formatCompactNumber(
      Number(story.total_likes || 0) +
        Number(story.total_comments || 0)
    ),
    genres: [story.main_genre, ...(story.tags || [])]
      .filter(Boolean)
      .slice(0, 4),
    description: story.description || '',
    cover:
      story.cover_url ||
      `/assets/Completed/Completed ${Math.min(index + 1, 27)}.jpg`,
    link: `/story/${story.id}`,
    freePreview: Number(story.total_episodes || 0) > 0,
    isAdult: Boolean(story.is_adult),
    isReal: true,
  }
}

const fallbackBooks = Array.from({ length: 9 }).map((_, index) => ({
  id: 700 + index,
  title: '',
  author: '',
  views: '100k',
  likes: '1000',
  episodesCount: 17,
  rating: '5.0',
  ratingCount: '1k',
  genres:
    index % 2 === 0
      ? ['Romance', 'Drama', 'Comedy']
      : ['Fantasy', 'Action', 'Adventure'],
  description: '',
  cover: `/assets/Completed/Completed ${index + 1}.jpg`,
  link: `/story/${700 + index}`,
  freePreview: true,
  isAdult: false,
  isReal: false,
}))

function QuoteLine({ activeTab }) {
  const { t } = useDisplayTranslation()
  const quoteKey =
    completedQuoteKeys[activeTab] ||
    completedQuoteKeys.Hot

  return (
    <div className="mb-4 px-1">
      <p className="text-[13px] font-medium text-gray-500">
        {t(`completedPage.${quoteKey}`)}
      </p>
    </div>
  )
}

function Dots({
  count,
  activeIndex,
  onDotClick,
}) {
  const { t } = useDisplayTranslation()

  if (count <= 1) return null

  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      {Array.from({ length: count }).map(
        (_, index) => {
          const isActive =
            index === activeIndex

          return (
            <button
              key={index}
              type="button"
              onClick={() =>
                onDotClick(index)
              }
              aria-label={t(
                'completedPage.goToSlide',
                { number: index + 1 }
              )}
              className={`rounded-full transition-all duration-300 ${
                isActive
                  ? 'h-2.5 w-6 bg-black'
                  : 'h-2.5 w-2.5 bg-neutral-300 hover:bg-neutral-400'
              }`}
            />
          )
        }
      )}
    </div>
  )
}

function SlideCards({ books }) {
  const { t } = useDisplayTranslation()

  return (
    <div className="space-y-4">
      {books.map((book) => {
        const title =
          book.title ||
          (book.isReal
            ? t('completedPage.untitledStory')
            : t('completedPage.demoBookTitle'))
        const author =
          book.author ||
          (book.isReal
            ? t('completedPage.shadowAuthor')
            : t('completedPage.demoAuthor'))
        const description =
          book.description ||
          (book.isReal
            ? t('completedPage.noDescription')
            : t('completedPage.demoDescription'))

        return (
          <Link
            key={book.id}
            to={book.link}
          >
            <div className="group flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:bg-gray-50">
              <div className="relative h-[112px] w-[80px] shrink-0 overflow-hidden rounded-xl bg-gray-100 shadow-sm">
                <img
                  src={book.cover}
                  alt={title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.src =
                      '/assets/Completed/Completed 1.jpg'
                  }}
                />

                {book.freePreview ? (
                  <div className="absolute left-1.5 top-1.5 rounded-full bg-white/92 px-2 py-0.5 text-[9px] font-extrabold tracking-wide text-neutral-900 shadow-sm">
                    {t(
                      'completedPage.freePreview'
                    )}
                  </div>
                ) : null}

                {book.isAdult ? (
                  <div className="absolute bottom-1.5 left-1.5 rounded-full bg-[#fff1f1] px-2 py-0.5 text-[9px] font-extrabold text-[#e5484d]">
                    18+
                  </div>
                ) : null}
              </div>

              <div className="min-w-0 flex-1 py-1">
                <h3 className="line-clamp-2 text-[16px] font-extrabold tracking-tight text-[#1f4f8c]">
                  {title}
                </h3>

                <p className="mt-0.5 text-[13px] font-medium text-gray-500">
                  {author}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-4 text-[13px]">
                  <div className="flex items-center gap-1 text-gray-600">
                    <i className="fas fa-eye text-[13px]" />
                    <span>{book.views}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <i className="fas fa-heart text-[13px] text-red-500" />
                    <span className="text-gray-600">
                      {book.likes}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-600">
                    <i className="fas fa-list text-[13px]" />
                    <span>
                      {t(
                        'completedPage.episodeCount',
                        {
                          count:
                            book.episodesCount,
                        }
                      )}
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-1 text-[13px] text-gray-600">
                  <i className="fas fa-star text-[13px] text-yellow-400" />
                  <span>{book.rating}</span>
                  <span>
                    ({book.ratingCount})
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {book.genres
                    .slice(0, 4)
                    .map((genre) => (
                      <span
                        key={genre}
                        className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500"
                      >
                        {genre}
                      </span>
                    ))}
                </div>

                <p className="mt-2 line-clamp-3 text-[13px] leading-6 text-gray-600">
                  {description}
                </p>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

function LoadingCompletedPage() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map(
        (_, index) => (
          <div
            key={index}
            className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div className="h-[112px] w-[80px] shrink-0 animate-pulse rounded-xl bg-gray-100" />
            <div className="min-w-0 flex-1 py-1">
              <div className="h-5 w-3/4 animate-pulse rounded-full bg-gray-100" />
              <div className="mt-2 h-4 w-1/3 animate-pulse rounded-full bg-gray-100" />
              <div className="mt-3 h-4 w-1/2 animate-pulse rounded-full bg-gray-100" />
              <div className="mt-3 h-12 w-full animate-pulse rounded-xl bg-gray-100" />
            </div>
          </div>
        )
      )}
    </div>
  )
}

function EmptyState({ onRefresh }) {
  const { t } = useDisplayTranslation()

  return (
    <div className="rounded-2xl bg-white px-5 py-10 text-center shadow-sm ring-1 ring-gray-100">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
        <i className="fa-regular fa-file-lines text-[22px]" />
      </div>

      <h2 className="mt-4 text-[17px] font-extrabold text-neutral-900">
        {t('completedPage.noCompleted')}
      </h2>

      <p className="mx-auto mt-2 max-w-[320px] text-[13px] leading-6 text-gray-500">
        {t('completedPage.emptyText')}
      </p>

      <button
        type="button"
        onClick={onRefresh}
        className="mt-5 rounded-full bg-neutral-950 px-5 py-3 text-[13px] font-extrabold text-white active:scale-95"
      >
        {t('completedPage.refresh')}
      </button>
    </div>
  )
}

export default function CompletedPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [activeTab, setActiveTab] =
    useState('Hot')
  const [activeSlide, setActiveSlide] =
    useState(0)
  const [loading, setLoading] =
    useState(true)
  const [message, setMessage] =
    useState('')
  const [realBooks, setRealBooks] =
    useState({
      Hot: [],
      Romance: [],
      Fantasy: [],
      Latest: [],
    })

  const scrollRef = useRef(null)
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

  async function fetchCompletedPageData(
    tab = activeTab,
    { force = false, signal } = {}
  ) {
    const config =
      COMPLETED_TAB_CONFIG[tab]

    if (!config) return

    const cacheKey = getHomeCacheKey({
      section: 'stories',
      language: getStoryLanguageId(),
      params: {
        page: 'completed',
        tab,
        limit: 27,
        sort: config.sort,
        genre: config.genre || '',
        story_status: 'Completed',
        schema: 1,
      },
    })

    let hasCachedBooks = false
    const hasCurrentBooks =
      Array.isArray(realBooks[tab]) &&
      realBooks[tab].length > 0

    if (!force) {
      const cached = await loadHomeCache(
        cacheKey,
        {
          maxAgeMs:
            COMPLETED_PAGE_CACHE_MAX_AGE_MS,
          allowExpired: true,
        }
      )

      if (signal?.aborted) return

      hasCachedBooks = Array.isArray(
        cached?.data
      )

      if (hasCachedBooks) {
        setRealBooks((current) => ({
          ...current,
          [tab]: cached.data,
        }))
        setLoading(false)
      }

      if (
        cached?.isFresh &&
        hasCachedBooks
      ) {
        return
      }
    }

    try {
      if (
        !hasCachedBooks &&
        !hasCurrentBooks
      ) {
        setLoading(true)
      }

      setMessage('')

      const params = new URLSearchParams({
        limit: '27',
        sort: config.sort,
        story_status: 'Completed',
      })

      if (config.genre) {
        params.set('genre', config.genre)
      }

      const response = await fetch(
        addStoryLanguageParam(
          `${API_BASE_URL}/api/public/stories?${params.toString()}`
        ),
        { signal }
      )

      const data = await response
        .json()
        .catch(() => ({}))

      if (
        !response.ok ||
        data.ok === false
      ) {
        throw new Error(
          data.message ||
            t(
              'completedPage.loadFailed'
            )
        )
      }

      const nextBooks = (
        Array.isArray(data.stories)
          ? data.stories
          : []
      ).map((story, index) =>
        normalizeStory(story, index)
      )

      if (signal?.aborted) return

      setRealBooks((current) => ({
        ...current,
        [tab]: nextBooks,
      }))

      await saveHomeCache(
        cacheKey,
        nextBooks,
        {
          maxAgeMs:
            COMPLETED_PAGE_CACHE_MAX_AGE_MS,
        }
      )
    } catch (error) {
      if (error?.name === 'AbortError') {
        return
      }

      console.error(
        'CompletedPage fetch error:',
        error
      )

      if (
        !hasCachedBooks &&
        !hasCurrentBooks
      ) {
        setRealBooks((current) => ({
          ...current,
          [tab]: [],
        }))
      }

      setMessage(
        error.message === 'Failed to fetch'
          ? t(
              'completedPage.serverUnavailable'
            )
          : error.message ||
              t(
                'completedPage.loadFailed'
              )
      )
    } finally {
      if (!signal?.aborted) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    const controller =
      new AbortController()

    fetchCompletedPageData(activeTab, {
      signal: controller.signal,
    })

    return () => {
      controller.abort()
    }
  }, [activeTab])

  const books = useMemo(() => {
    const realList = realBooks[activeTab]
    return realList?.length
      ? realList
      : message
        ? []
        : fallbackBooks
  }, [activeTab, realBooks, message])

  const slides = useMemo(() => {
    const chunks = []

    for (
      let index = 0;
      index < books.length;
      index += 3
    ) {
      chunks.push(
        books.slice(index, index + 3)
      )
    }

    return chunks
  }, [books])

  const handleScroll = () => {
    const container = scrollRef.current
    if (!container) return

    const slideWidth =
      container.offsetWidth
    const currentIndex = Math.round(
      container.scrollLeft / slideWidth
    )
    setActiveSlide(currentIndex)
  }

  const scrollToIndex = (index) => {
    const container = scrollRef.current
    if (!container) return

    const slideWidth =
      container.offsetWidth
    container.scrollTo({
      left: slideWidth * index,
      behavior: 'smooth',
    })

    setActiveSlide(index)
  }

  const handleMouseDown = (event) => {
    const container = scrollRef.current
    if (!container) return

    isDraggingRef.current = true
    startXRef.current =
      event.pageX -
      container.offsetLeft
    scrollLeftRef.current =
      container.scrollLeft
  }

  const handleMouseMove = (event) => {
    const container = scrollRef.current
    if (
      !container ||
      !isDraggingRef.current
    ) {
      return
    }

    event.preventDefault()
    const x =
      event.pageX -
      container.offsetLeft
    const walk = x - startXRef.current
    container.scrollLeft =
      scrollLeftRef.current - walk
  }

  const stopDragging = () => {
    isDraggingRef.current = false
  }

  useEffect(() => {
    setActiveSlide(0)
    const container = scrollRef.current

    if (container) {
      container.scrollTo({
        left: 0,
        behavior: 'auto',
      })
    }
  }, [activeTab])

  return (
    <div className="min-h-screen bg-white pb-32">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white shadow-sm">
        <div className="flex h-14 items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
            aria-label={t(
              'completedPage.goBack'
            )}
          >
            <i className="fas fa-chevron-left text-[18px] text-gray-700" />
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="text-[20px]">
              😁
            </span>
            <h1 className="line-clamp-1 text-[18px] font-extrabold tracking-tight text-neutral-900">
              {t(
                'completedPage.completed'
              )}
            </h1>
          </div>

          <button
            type="button"
            onClick={() =>
              fetchCompletedPageData(
                activeTab,
                { force: true }
              )
            }
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 active:scale-95"
            aria-label={t(
              'completedPage.refresh'
            )}
          >
            <i className="fa-solid fa-rotate-right text-[15px]" />
          </button>
        </div>
      </header>

      <main className="px-4 pt-4">
        <div className="mb-5 flex gap-3 overflow-x-auto pb-1 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {completedTabs.map((tab) => {
            const isActive =
              activeTab === tab
            const labelKey =
              completedTabLabelKeys[tab] ||
              completedTabLabelKeys.Hot

            return (
              <button
                key={tab}
                type="button"
                onClick={() =>
                  setActiveTab(tab)
                }
                className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'border-black bg-black text-white'
                    : 'border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50'
                }`}
              >
                {t(
                  `completedPage.${labelKey}`
                )}
              </button>
            )
          })}
        </div>

        <QuoteLine activeTab={activeTab} />

        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mb-4 w-full rounded-[16px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#e5484d]"
          >
            {message}
          </button>
        ) : null}

        {loading ? (
          <LoadingCompletedPage />
        ) : slides.length ? (
          <>
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={stopDragging}
              onMouseLeave={stopDragging}
              className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth cursor-grab select-none active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {slides.map(
                (group, index) => (
                  <div
                    key={index}
                    className="w-full shrink-0 snap-start"
                  >
                    <SlideCards
                      books={group}
                    />
                  </div>
                )
              )}
            </div>

            <Dots
              count={slides.length}
              activeIndex={activeSlide}
              onDotClick={scrollToIndex}
            />
          </>
        ) : (
          <EmptyState
            onRefresh={() =>
              fetchCompletedPageData(
                activeTab,
                { force: true }
              )
            }
          />
        )}
      </main>
    </div>
  )
}
