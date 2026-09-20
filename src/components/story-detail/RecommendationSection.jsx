import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('recommendationSection', {
  en: {
    author: 'Author',
    storyCover: 'Story cover',
    untitledStory: 'Untitled Story',
    story: 'Story',
    moreBy: 'More by {{author}}',
    loadingStories: 'Loading stories...',
    waitRecommendations: 'Please wait while recommendations are loading.',
    noOtherStories: 'No other stories yet',
    noOtherStoriesText: 'This author does not have more published stories yet.',
    youMightLike: 'You Might Like',
    loadingSimilar: 'Loading similar stories...',
    waitSimilar: 'Please wait while similar stories are loading.',
    noSimilarStories: 'No similar stories yet',
    noSimilarStoriesText: 'Similar stories will appear after more published stories are available.',
    loadFailed: 'Could not load recommendations',
    tryAgain: 'Try again',
    offline: 'Connect to the internet to load recommendations.',
  },
  km: {
    author: 'អ្នកនិពន្ធ',
    storyCover: 'គម្របរឿង',
    untitledStory: 'រឿងគ្មានចំណងជើង',
    story: 'រឿង',
    moreBy: 'រឿងផ្សេងទៀតពី {{author}}',
    loadingStories: 'កំពុងផ្ទុករឿង...',
    waitRecommendations: 'សូមរង់ចាំ ខណៈកំពុងផ្ទុករឿងណែនាំ។',
    noOtherStories: 'មិនទាន់មានរឿងផ្សេងទៀត',
    noOtherStoriesText: 'អ្នកនិពន្ធនេះមិនទាន់មានរឿងផ្សេងដែលបានបោះពុម្ពទេ។',
    youMightLike: 'អ្នកប្រហែលជាចូលចិត្ត',
    loadingSimilar: 'កំពុងផ្ទុករឿងស្រដៀង...',
    waitSimilar: 'សូមរង់ចាំ ខណៈកំពុងផ្ទុករឿងស្រដៀង។',
    noSimilarStories: 'មិនទាន់មានរឿងស្រដៀង',
    noSimilarStoriesText: 'រឿងស្រដៀងនឹងបង្ហាញនៅពេលមានរឿងដែលបានបោះពុម្ពបន្ថែម។',
    loadFailed: 'មិនអាចទាញរឿងណែនាំបានទេ',
    tryAgain: 'ព្យាយាមម្តងទៀត',
    offline: 'សូមភ្ជាប់អ៊ីនធឺណិតដើម្បីទាញរឿងណែនាំ។',
  },
  zh: {
    author: '作者',
    storyCover: '故事封面',
    untitledStory: '无标题故事',
    story: '故事',
    moreBy: '{{author}} 的更多作品',
    loadingStories: '正在加载故事...',
    waitRecommendations: '推荐内容正在加载，请稍候。',
    noOtherStories: '暂无其他故事',
    noOtherStoriesText: '该作者暂时没有更多已发布的故事。',
    youMightLike: '你可能喜欢',
    loadingSimilar: '正在加载相似故事...',
    waitSimilar: '相似故事正在加载，请稍候。',
    noSimilarStories: '暂无相似故事',
    noSimilarStoriesText: '有更多故事发布后，相似故事会显示在这里。',
    loadFailed: '无法加载推荐内容',
    tryAgain: '重试',
    offline: '请连接网络后加载推荐内容。',
  },
  ja: {
    author: '作者',
    storyCover: 'ストーリー表紙',
    untitledStory: '無題のストーリー',
    story: 'ストーリー',
    moreBy: '{{author}} の他の作品',
    loadingStories: 'ストーリーを読み込み中...',
    waitRecommendations: 'おすすめを読み込んでいます。しばらくお待ちください。',
    noOtherStories: '他のストーリーはまだありません',
    noOtherStoriesText: 'この作者には、まだ他の公開済みストーリーがありません。',
    youMightLike: 'あなたへのおすすめ',
    loadingSimilar: '似ているストーリーを読み込み中...',
    waitSimilar: '似ているストーリーを読み込んでいます。しばらくお待ちください。',
    noSimilarStories: '似ているストーリーはまだありません',
    noSimilarStoriesText: '公開済みストーリーが増えると、似ているストーリーが表示されます。',
    loadFailed: 'おすすめを読み込めません',
    tryAgain: '再試行',
    offline: 'おすすめを読み込むにはインターネットに接続してください。',
  },
  ko: {
    author: '작가',
    storyCover: '스토리 표지',
    untitledStory: '제목 없는 스토리',
    story: '스토리',
    moreBy: '{{author}}의 다른 작품',
    loadingStories: '스토리 불러오는 중...',
    waitRecommendations: '추천 스토리를 불러오는 중입니다. 잠시 기다려 주세요.',
    noOtherStories: '다른 스토리가 아직 없습니다',
    noOtherStoriesText: '이 작가는 아직 다른 게시된 스토리가 없습니다.',
    youMightLike: '추천 스토리',
    loadingSimilar: '비슷한 스토리 불러오는 중...',
    waitSimilar: '비슷한 스토리를 불러오는 중입니다. 잠시 기다려 주세요.',
    noSimilarStories: '비슷한 스토리가 아직 없습니다',
    noSimilarStoriesText: '게시된 스토리가 더 많아지면 비슷한 스토리가 표시됩니다.',
    loadFailed: '추천 스토리를 불러올 수 없습니다',
    tryAgain: '다시 시도',
    offline: '추천 스토리를 불러오려면 인터넷에 연결하세요.',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const CACHE_TTL_MS = 45 * 1000
const REQUEST_TIMEOUT_MS = 12 * 1000
const ERROR_COOLDOWN_MS = 20 * 1000
const MAX_CACHE_ENTRIES = 64
const MAX_PENDING_REQUESTS = 32
const recommendationsCache = new Map()
const recommendationsInFlight = new Map()
const recommendationFailures = new Map()

function readRecommendationsCache(key) {
  const cached = recommendationsCache.get(key)

  if (!cached) return null

  if (Date.now() >= cached.expiresAt) {
    recommendationsCache.delete(key)
    return null
  }

  recommendationsCache.delete(key)
  recommendationsCache.set(key, cached)

  return cached.data
}

function rememberRecommendations(key, data) {
  recommendationsCache.delete(key)
  recommendationsCache.set(key, {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  })

  while (recommendationsCache.size > MAX_CACHE_ENTRIES) {
    recommendationsCache.delete(recommendationsCache.keys().next().value)
  }
}

function rememberRecommendationFailure(key) {
  recommendationFailures.delete(key)
  recommendationFailures.set(key, Date.now() + ERROR_COOLDOWN_MS)

  while (recommendationFailures.size > MAX_CACHE_ENTRIES) {
    recommendationFailures.delete(recommendationFailures.keys().next().value)
  }
}

async function getRecommendations(key, storyId, authorId, genre) {
  const cached = readRecommendationsCache(key)

  if (cached) return cached

  const inFlight = recommendationsInFlight.get(key)

  if (inFlight) return inFlight

  if (recommendationsInFlight.size >= MAX_PENDING_REQUESTS) {
    rememberRecommendationFailure(key)
    throw new Error('Too many pending recommendations')
  }

  const controller = new AbortController()
  const timeout = window.setTimeout(() => {
    controller.abort()
  }, REQUEST_TIMEOUT_MS)

  const request = (async () => {
    try {
      const params = new URLSearchParams()

      if (authorId) params.set('authorId', authorId)
      if (genre) params.set('genre', genre)

      const response = await fetch(
        `${API_BASE_URL}/api/public/stories/${encodeURIComponent(
          storyId
        )}/recommendations?${params.toString()}`,
        {
          cache: 'no-store',
          signal: controller.signal,
        }
      )

      const data = await response.json().catch(() => ({}))

      if (
        !response.ok ||
        data.ok !== true ||
        !Array.isArray(data.author_stories) ||
        !Array.isArray(data.similar_stories)
      ) {
        throw new Error(data.message || 'Failed to load recommendations')
      }

      const result = {
        author_stories: Array.isArray(data.author_stories)
          ? data.author_stories
          : [],
        similar_stories: Array.isArray(data.similar_stories)
          ? data.similar_stories
          : [],
      }

      rememberRecommendations(key, result)
      recommendationFailures.delete(key)

      return result
    } finally {
      window.clearTimeout(timeout)
    }
  })()

  recommendationsInFlight.set(key, request)

  try {
    return await request
  } catch (error) {
    rememberRecommendationFailure(key)
    throw error
  } finally {
    if (recommendationsInFlight.get(key) === request) {
      recommendationsInFlight.delete(key)
    }
  }
}

function EmptyCard({ title, text, icon }) {
  return (
    <div className="rounded-[22px] bg-[var(--shadow-bg-soft)] p-4 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] shadow-sm ring-1 ring-[var(--shadow-border)]">
        <i className={`${icon} text-[18px]`} />
      </div>
      <div className="mt-3 text-[14px] font-black text-[var(--shadow-text-primary)]">{title}</div>
      <div className="mt-1 text-[12px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">{text}</div>
    </div>
  )
}

function BookCard({ story, onClick }) {
  const { t } = useDisplayTranslation()

  return (
    <button type="button" onClick={onClick} className="min-w-0 text-left active:scale-[0.99]">
      <div className="aspect-[2/3] w-full overflow-hidden rounded-[8px] bg-[var(--shadow-bg-soft)]">
        {story.cover_url ? (
          <img
            src={story.cover_url}
            alt={story.title || t('recommendationSection.storyCover')}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--shadow-text-secondary)]">
            <i className="fa-regular fa-bookmark text-[20px]" />
          </div>
        )}
      </div>

      <h3
         className="mt-2 h-8 max-w-full overflow-hidden text-[14px] font-bold leading-4 text-[var(--shadow-text-primary)]"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflowWrap: 'anywhere',
        }}
      >
        {story.title || t('recommendationSection.untitledStory')}
      </h3>

      <p className="mt-0.5 line-clamp-1 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
        {story.main_genre || t('recommendationSection.story')}
      </p>
    </button>
  )
}

function StoryGrid({ stories, emptyTitle, emptyText, emptyIcon, onOpenStory }) {
  if (!stories.length) {
    return <EmptyCard icon={emptyIcon} title={emptyTitle} text={emptyText} />
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {stories.slice(0, 3).map((item) => (
        <BookCard key={item.id} story={item} onClick={() => onOpenStory(item.id)} />
      ))}
    </div>
  )
}

export default function RecommendationSection({ story }) {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const sectionRef = useRef(null)
  const storyId = String(story?.id || '')
  const authorId = String(story?.author_id || '')
  const genre = String(story?.main_genre || '')
  const requestKey = JSON.stringify([storyId, authorId, genre])
  const [intersection, setIntersection] = useState({ key: '', visible: false })
  const [refreshTick, setRefreshTick] = useState(0)
  const [result, setResult] = useState({
    key: '',
    status: 'idle',
    data: null,
  })
  const inView = intersection.key === requestKey && intersection.visible
  const current = result.key === requestKey
    ? result
    : { status: 'idle', data: null }
  const loading = current.status === 'idle' || current.status === 'loading'
  const hasError = current.status === 'error' || current.status === 'offline'
  const authorStories = current.data?.author_stories || []
  const similarStories = current.data?.similar_stories || []

  const authorName =
    story?.author_page?.page_name ||
    story?.authorPage?.page_name ||
    story?.author?.page_name ||
    story?.author_name ||
    t('recommendationSection.author')

  useEffect(() => {
    const element = sectionRef.current

    if (!element || !storyId) return undefined

    if (!('IntersectionObserver' in window)) {
      setIntersection({ key: requestKey, visible: true })
      return undefined
    }

    const observer = new IntersectionObserver(([entry]) => {
      const visible = Boolean(entry?.isIntersecting)

      setIntersection((previous) => (
        previous.key === requestKey && previous.visible === visible
          ? previous
          : { key: requestKey, visible }
      ))
    }, {
      rootMargin: '320px 0px',
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [requestKey, storyId])

  useEffect(() => {
    const wake = () => {
      if (
        document.visibilityState === 'visible' &&
        navigator.onLine !== false
      ) {
        setRefreshTick((previous) => previous + 1)
      }
    }

    document.addEventListener('visibilitychange', wake)
    window.addEventListener('online', wake)

    return () => {
      document.removeEventListener('visibilitychange', wake)
      window.removeEventListener('online', wake)
    }
  }, [])

  useEffect(() => {
    if (!storyId || !inView) return undefined

    let ignore = false

    const cached = readRecommendationsCache(requestKey)

    if (cached) {
      setResult({
        key: requestKey,
        status: 'loaded',
        data: cached,
      })
      return undefined
    }

    if (document.visibilityState !== 'visible') return undefined

    if (navigator.onLine === false) {
      setResult({
        key: requestKey,
        status: 'offline',
        data: null,
      })
      return undefined
    }

    if (Date.now() < (recommendationFailures.get(requestKey) || 0)) {
      setResult({
        key: requestKey,
        status: 'error',
        data: null,
      })
      return undefined
    }

    setResult({
      key: requestKey,
      status: 'loading',
      data: null,
    })

    getRecommendations(requestKey, storyId, authorId, genre)
      .then((data) => {
        if (ignore) return

        setResult({
          key: requestKey,
          status: 'loaded',
          data,
        })
      })
      .catch(() => {
        if (ignore) return

        setResult({
          key: requestKey,
          status: 'error',
          data: null,
        })
      })

    return () => {
      ignore = true
    }
  }, [
    requestKey,
    storyId,
    authorId,
    genre,
    inView,
    refreshTick,
  ])

  const authorSectionStories = useMemo(() => {
    return authorStories
  }, [authorStories])

  const handleOpenStory = (storyId) => {
    if (!storyId) return
    navigate(`/story/${storyId}`, {
      state: { returnTo: `/story/${story.id}` },
    })
  }

  const retryRecommendations = () => {
    recommendationFailures.delete(requestKey)
    setRefreshTick((previous) => previous + 1)
  }

  const renderRecommendationError = () => (
    <div className="rounded-[22px] bg-[var(--shadow-bg-soft)] p-4 text-center">
      <p className="text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
        {current.status === 'offline'
          ? t('recommendationSection.offline')
          : t('recommendationSection.loadFailed')}
      </p>
      <button
        type="button"
        onClick={retryRecommendations}
        className="mt-3 rounded-full bg-[var(--shadow-bg-surface)] px-4 py-2 text-[12px] font-bold text-[var(--shadow-text-primary)]"
      >
        {t('recommendationSection.tryAgain')}
      </button>
    </div>
  )

  return (
    <section ref={sectionRef} className="mt-2 space-y-0 sm:mt-4 sm:space-y-4">
      {loading || authorSectionStories.length || hasError ? (
       <div className="bg-[var(--shadow-bg-surface)] px-4 pb-1 pt-3 sm:rounded-[28px] sm:p-5 sm:shadow-sm sm:ring-1 sm:ring-[var(--shadow-border)]">
  <div className="mb-3">
            <h2 className="text-[16px] font-bold text-[var(--shadow-text-primary)]">
              {t('recommendationSection.moreBy', {
                author: authorName,
              })}
            </h2>
          </div>

          {loading ? (
            <EmptyCard
              icon="fa-solid fa-spinner fa-spin"
              title={t('recommendationSection.loadingStories')}
              text={t('recommendationSection.waitRecommendations')}
            />
          ) : hasError ? (
            renderRecommendationError()
          ) : (
            <StoryGrid
              stories={authorSectionStories}
              emptyIcon="fa-solid fa-pen-nib"
              emptyTitle={t('recommendationSection.noOtherStories')}
              emptyText={t('recommendationSection.noOtherStoriesText')}
              onOpenStory={handleOpenStory}
            />
          )}
        </div>
      ) : null}

      <div className="bg-[var(--shadow-bg-surface)] px-4 pb-4 pt-[5px] sm:rounded-[28px] sm:p-5 sm:shadow-sm sm:ring-1 sm:ring-[var(--shadow-border)]">
  <div className="mb-3">
    <h2 className="text-[16px] font-bold text-[var(--shadow-text-primary)]">
      {t('recommendationSection.youMightLike')}
    </h2>
  </div>

        {loading ? (
          <EmptyCard
            icon="fa-solid fa-spinner fa-spin"
            title={t('recommendationSection.loadingSimilar')}
            text={t('recommendationSection.waitSimilar')}
          />
        ) : hasError ? (
          renderRecommendationError()
        ) : (
          <StoryGrid
            stories={similarStories}
            emptyIcon="fa-regular fa-compass"
            emptyTitle={t('recommendationSection.noSimilarStories')}
            emptyText={t('recommendationSection.noSimilarStoriesText')}
            onOpenStory={handleOpenStory}
          />
        )}
      </div>
    </section>
  )
}
