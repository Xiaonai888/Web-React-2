import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('recommendationSection', {
  en: {
    author: 'Author', storyCover: 'Story cover', untitledStory: 'Untitled Story', story: 'Story',
    moreBy: 'More by {{author}}', loadingStories: 'Loading stories...',
    waitRecommendations: 'Please wait while recommendations are loading.',
    noOtherStories: 'No other stories yet', noOtherStoriesText: 'This author does not have more published stories yet.',
    youMightLike: 'You Might Like', loadingSimilar: 'Loading similar stories...',
    waitSimilar: 'Please wait while similar stories are loading.',
    noSimilarStories: 'No similar stories yet', noSimilarStoriesText: 'Similar stories will appear after more published stories are available.',
    loadFailed: 'Could not load recommendations', tryAgain: 'Try again', offline: 'Connect to the internet to load recommendations.',
  },
  km: {
    author: 'អ្នកនិពន្ធ', storyCover: 'គម្របរឿង', untitledStory: 'រឿងគ្មានចំណងជើង', story: 'រឿង',
    moreBy: 'រឿងផ្សេងទៀតពី {{author}}', loadingStories: 'កំពុងផ្ទុករឿង...',
    waitRecommendations: 'សូមរង់ចាំ ខណៈកំពុងផ្ទុករឿងណែនាំ។',
    noOtherStories: 'មិនទាន់មានរឿងផ្សេងទៀត', noOtherStoriesText: 'អ្នកនិពន្ធនេះមិនទាន់មានរឿងផ្សេងដែលបានបោះពុម្ពទេ។',
    youMightLike: 'អ្នកប្រហែលជាចូលចិត្ត', loadingSimilar: 'កំពុងផ្ទុករឿងស្រដៀង...',
    waitSimilar: 'សូមរង់ចាំ ខណៈកំពុងផ្ទុករឿងស្រដៀង។',
    noSimilarStories: 'មិនទាន់មានរឿងស្រដៀង', noSimilarStoriesText: 'រឿងស្រដៀងនឹងបង្ហាញនៅពេលមានរឿងដែលបានបោះពុម្ពបន្ថែម។',
    loadFailed: 'មិនអាចទាញរឿងណែនាំបានទេ', tryAgain: 'ព្យាយាមម្តងទៀត', offline: 'សូមភ្ជាប់អ៊ីនធឺណិតដើម្បីទាញរឿងណែនាំ។',
  },
  zh: {
    author: '作者', storyCover: '故事封面', untitledStory: '无标题故事', story: '故事',
    moreBy: '{{author}} 的更多作品', loadingStories: '正在加载故事...',
    waitRecommendations: '推荐内容正在加载，请稍候。',
    noOtherStories: '暂无其他故事', noOtherStoriesText: '这位作者暂时没有更多已发布的故事。',
    youMightLike: '你可能喜欢', loadingSimilar: '正在加载相似故事...',
    waitSimilar: '相似故事正在加载，请稍候。',
    noSimilarStories: '暂无相似故事', noSimilarStoriesText: '发布更多故事后，相似故事会显示在这里。',
    loadFailed: '无法加载推荐内容', tryAgain: '重试', offline: '请连接网络后加载推荐内容。',
  },
  ja: {
    author: '作者', storyCover: 'ストーリー表紙', untitledStory: '無題のストーリー', story: 'ストーリー',
    moreBy: '{{author}} の他の作品', loadingStories: 'ストーリーを読み込み中...',
    waitRecommendations: 'おすすめを読み込んでいます。しばらくお待ちください。',
    noOtherStories: '他のストーリーはまだありません', noOtherStoriesText: 'この作者には、まだ他の公開済みストーリーがありません。',
    youMightLike: 'あなたへのおすすめ', loadingSimilar: '似ているストーリーを読み込み中...',
    waitSimilar: '似ているストーリーを読み込んでいます。しばらくお待ちください。',
    noSimilarStories: '似ているストーリーはまだありません', noSimilarStoriesText: '公開済みのストーリーが増えると、似ているストーリーが表示されます。',
    loadFailed: 'おすすめを読み込めません', tryAgain: '再試行', offline: 'おすすめを読み込むにはインターネットに接続してください。',
  },
  ko: {
    author: '작가', storyCover: '스토리 표지', untitledStory: '제목 없는 스토리', story: '스토리',
    moreBy: '{{author}}의 다른 작품', loadingStories: '스토리 불러오는 중...',
    waitRecommendations: '추천 스토리를 불러오고 있습니다. 잠시 기다려 주세요.',
    noOtherStories: '다른 스토리가 아직 없습니다', noOtherStoriesText: '이 작가는 아직 다른 게시된 스토리가 없습니다.',
    youMightLike: '추천 스토리', loadingSimilar: '비슷한 스토리 불러오는 중...',
    waitSimilar: '비슷한 스토리를 불러오고 있습니다. 잠시 기다려 주세요.',
    noSimilarStories: '비슷한 스토리가 아직 없습니다', noSimilarStoriesText: '게시된 스토리가 더 많아지면 비슷한 스토리가 표시됩니다.',
    loadFailed: '추천 스토리를 불러올 수 없습니다', tryAgain: '다시 시도', offline: '추천 스토리를 불러오려면 인터넷에 연결하세요.',
  },
})

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const CACHE_TTL_MS = 45 * 1000
const MAX_CACHE_ENTRIES = 64
const MAX_PENDING = 32
const recommendationCache = new Map()
const recommendationRequests = new Map()

function readCache(key) {
  const item = recommendationCache.get(key)
  if (!item) return null
  if (item.expiresAt <= Date.now()) {
    recommendationCache.delete(key)
    return null
  }
  recommendationCache.delete(key)
  recommendationCache.set(key, item)
  return item.data
}

async function getRecommendations(key, storyId, authorId, genre) {
  const cached = readCache(key)
  if (cached) return cached
  if (recommendationRequests.has(key)) return recommendationRequests.get(key)
  if (recommendationRequests.size >= MAX_PENDING) throw new Error('Too many pending requests')

  const request = (async () => {
    const params = new URLSearchParams()
    if (authorId) params.set('authorId', authorId)
    if (genre) params.set('genre', genre)
    const response = await fetch(
      `${API_BASE_URL}/api/public/stories/${encodeURIComponent(storyId)}/recommendations?${params.toString()}`,
      { cache: 'no-store' }
    )
    const data = await response.json().catch(() => ({}))
    if (!response.ok || data.ok === false) throw new Error(data.message || 'Failed to load recommendations')
    const result = {
      author_stories: Array.isArray(data.author_stories) ? data.author_stories : [],
      similar_stories: Array.isArray(data.similar_stories) ? data.similar_stories : [],
    }
    recommendationCache.delete(key)
    recommendationCache.set(key, { data: result, expiresAt: Date.now() + CACHE_TTL_MS })
    while (recommendationCache.size > MAX_CACHE_ENTRIES) {
      recommendationCache.delete(recommendationCache.keys().next().value)
    }
    return result
  })()

  recommendationRequests.set(key, request)
  try {
    return await request
  } finally {
    if (recommendationRequests.get(key) === request) recommendationRequests.delete(key)
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
          <img src={story.cover_url} alt={story.title || t('recommendationSection.storyCover')} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--shadow-text-secondary)]">
            <i className="fa-regular fa-bookmark text-[20px]" />
          </div>
        )}
      </div>
      <h3
        className="mt-2 h-8 max-w-full overflow-hidden text-[14px] font-bold leading-4 text-[var(--shadow-text-primary)]"
        style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflowWrap: 'anywhere' }}
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
  if (!stories.length) return <EmptyCard icon={emptyIcon} title={emptyTitle} text={emptyText} />
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
  const key = JSON.stringify([storyId, authorId, genre])
  const [intersection, setIntersection] = useState({ key: '', visible: false })
  const [refreshTick, setRefreshTick] = useState(0)
  const [result, setResult] = useState({ key: '', status: 'idle', data: null })
  const inView = intersection.key === key && intersection.visible
  const current = result.key === key ? result : { status: 'idle', data: null }
  const loading = current.status === 'idle' || current.status === 'loading'
  const authorStories = current.data?.author_stories || []
  const similarStories = current.data?.similar_stories || []
  const authorName = story?.author_page?.page_name || story?.authorPage?.page_name ||
    story?.author?.page_name || story?.author_name || t('recommendationSection.author')

  useEffect(() => {
    const element = sectionRef.current
    if (!element || !storyId) return undefined
    if (!('IntersectionObserver' in window)) {
      setIntersection({ key, visible: true })
      return undefined
    }
    const observer = new IntersectionObserver(([entry]) => {
      setIntersection((previous) => {
        const visible = Boolean(entry?.isIntersecting)
        return previous.key === key && previous.visible === visible
          ? previous
          : { key, visible }
      })
    }, { rootMargin: '320px 0px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [key, storyId])

  useEffect(() => {
    const wake = () => {
      if (document.visibilityState === 'visible' && navigator.onLine !== false) {
        setRefreshTick((tick) => tick + 1)
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
    let cancelled = false
    const cached = readCache(key)
    if (cached) {
      setResult({ key, status: 'loaded', data: cached })
      return undefined
    }
    if (document.visibilityState !== 'visible') return undefined
    if (navigator.onLine === false) {
      setResult({ key, status: 'offline', data: null })
      return undefined
    }
    setResult({ key, status: 'loading', data: null })
    getRecommendations(key, storyId, authorId, genre)
      .then((data) => {
        if (!cancelled) setResult({ key, status: 'loaded', data })
      })
      .catch(() => {
        if (!cancelled) setResult({ key, status: 'error', data: null })
      })
    return () => { cancelled = true }
  }, [key, storyId, authorId, genre, inView, refreshTick])

  const handleOpenStory = (targetStoryId) => {
    if (!targetStoryId) return
    navigate(`/story/${targetStoryId}`, { state: { returnTo: `/story/${storyId}` } })
  }
  const errorMessage = current.status === 'offline'
    ? t('recommendationSection.offline')
    : t('recommendationSection.loadFailed')
  const renderStories = (stories, loadingTitle, emptyTitle, emptyText, emptyIcon) => {
    if (loading) return <EmptyCard icon="fa-solid fa-spinner fa-spin" title={loadingTitle} text={t('recommendationSection.waitRecommendations')} />
    if (current.status === 'error' || current.status === 'offline') {
      return (
        <div>
          <EmptyCard icon="fa-solid fa-circle-exclamation" title={errorMessage} text="" />
          <button type="button" onClick={() => setRefreshTick((tick) => tick + 1)} className="mt-2 w-full rounded-full bg-[var(--shadow-bg-soft)] px-4 py-2 text-[12px] font-semibold text-[var(--shadow-text-primary)]">
            {t('recommendationSection.tryAgain')}
          </button>
        </div>
      )
    }
    return <StoryGrid stories={stories} emptyIcon={emptyIcon} emptyTitle={emptyTitle} emptyText={emptyText} onOpenStory={handleOpenStory} />
  }

  return (
    <section ref={sectionRef} className="mt-2 space-y-0 sm:mt-4 sm:space-y-4">
      {loading || authorStories.length ? (
        <div className="bg-[var(--shadow-bg-surface)] px-4 pb-1 pt-3 sm:rounded-[28px] sm:p-5 sm:shadow-sm sm:ring-1 sm:ring-[var(--shadow-border)]">
          <div className="mb-3">
            <h2 className="text-[16px] font-bold text-[var(--shadow-text-primary)]">{t('recommendationSection.moreBy', { author: authorName })}</h2>
          </div>
          {renderStories(authorStories, t('recommendationSection.loadingStories'), t('recommendationSection.noOtherStories'), t('recommendationSection.noOtherStoriesText'), 'fa-solid fa-pen-nib')}
        </div>
      ) : null}
      <div className="bg-[var(--shadow-bg-surface)] px-4 pb-4 pt-[5px] sm:rounded-[28px] sm:p-5 sm:shadow-sm sm:ring-1 sm:ring-[var(--shadow-border)]">
        <div className="mb-3">
          <h2 className="text-[16px] font-bold text-[var(--shadow-text-primary)]">{t('recommendationSection.youMightLike')}</h2>
        </div>
        {renderStories(similarStories, t('recommendationSection.loadingSimilar'), t('recommendationSection.noSimilarStories'), t('recommendationSection.noSimilarStoriesText'), 'fa-regular fa-compass')}
      </div>
    </section>
  )
}
