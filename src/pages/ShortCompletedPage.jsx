import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerTranslationNamespace } from '../i18n/registerTranslations'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { addStoryLanguageParam, getStoryLanguageId } from '../utils/storyLanguage'
import { getHomeCacheKey, loadHomeCache, saveHomeCache } from '../utils/homeDataCache'

registerTranslationNamespace('shortCompletedPage', {
  en: { title: 'Short & Completed', goBack: 'Go back', empty: 'No short completed stories yet', untitled: 'Untitled Story', genre: 'Genre' },
  km: { title: 'រឿងខ្លី & ចប់រួច', goBack: 'ត្រឡប់ក្រោយ', empty: 'មិនទាន់មានរឿងខ្លីដែលចប់រួចទេ', untitled: 'រឿងគ្មានចំណងជើង', genre: 'ប្រភេទរឿង' },
  zh: { title: '短篇完结', goBack: '返回', empty: '暂无短篇完结作品', untitled: '无标题故事', genre: '类型' },
  ja: { title: '短編・完結', goBack: '戻る', empty: '短編の完結作品はまだありません', untitled: '無題のストーリー', genre: 'ジャンル' },
  ko: { title: '단편 완결', goBack: '뒤로 가기', empty: '아직 단편 완결 작품이 없습니다', untitled: '제목 없는 스토리', genre: '장르' },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const CACHE_MAX_AGE_MS = 60 * 60 * 1000

function normalizeStory(story) {
  return {
    id: story.id,
    title: String(story.title || '').trim(),
    cover: String(story.cover_url || '').trim(),
    genre: String(story.main_genre || '').trim(),
    episodes: Number(story.total_episodes || 0),
    completedAt: new Date(story.last_episode_published_at || story.updated_at || story.created_at || 0).getTime() || 0,
  }
}

function StoryCard({ story, t }) {
  const title = story.title || t('shortCompletedPage.untitled')
  const genre = story.genre || t('shortCompletedPage.genre')

  return (
    <Link to={`/story/${story.id}`} state={{ sectionRank: 'short_completed' }} className="group block min-w-0">
      <div className="aspect-[2/3] overflow-hidden rounded-[10px] bg-[var(--shadow-bg-soft)] shadow-sm">
        <img
          src={story.cover}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="pt-2.5">
        <h2 className="truncate text-[14px] font-[650] leading-[19px] text-[var(--shadow-text-primary)]">{title}</h2>
        <p className="mt-1 truncate text-[11px] text-[var(--shadow-text-tertiary)]">{genre}</p>
      </div>
    </Link>
  )
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-3 gap-x-2.5 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-3">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index}>
          <div className="aspect-[2/3] animate-pulse rounded-[10px] bg-[var(--shadow-bg-soft)]" />
          <div className="mt-2.5 h-4 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
          <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
        </div>
      ))}
    </div>
  )
}

export default function ShortCompletedPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function loadStories() {
      const cacheKey = getHomeCacheKey({
        section: 'stories',
        language: getStoryLanguageId(),
        params: { page: 'short-completed', story_status: 'Completed', story_type: 'novel', max_episodes: 19, sort: 'episode_updated', limit: 100, schema: 1 },
      })

      const cached = await loadHomeCache(cacheKey, { maxAgeMs: CACHE_MAX_AGE_MS, allowExpired: true })
      const hasCached = Array.isArray(cached?.data)

      if (hasCached && !ignore) {
        setStories(cached.data)
        setLoading(false)
      }

      if (cached?.isFresh && hasCached) return

      try {
        const response = await fetch(
          addStoryLanguageParam(
            `${API_BASE_URL}/api/public/stories?limit=100&sort=episode_updated&story_status=Completed&story_type=novel&max_episodes=19`
          )
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) throw new Error(data.message || 'Failed to load Short & Completed')

        const nextStories = (Array.isArray(data.stories) ? data.stories : [])
          .filter((story) => String(story.story_status || '').trim().toLowerCase() === 'completed')
          .filter((story) => String(story.story_type || '').trim().toLowerCase() === 'novel')
          .filter((story) => Number(story.total_episodes || 0) > 0 && Number(story.total_episodes || 0) < 20)
          .filter((story) => Boolean(String(story.cover_url || '').trim()))
          .map(normalizeStory)
          .sort((a, b) => b.completedAt - a.completedAt)

        if (ignore) return

        setStories(nextStories)
        await saveHomeCache(cacheKey, nextStories, { maxAgeMs: CACHE_MAX_AGE_MS })
      } catch {
        if (!ignore && !hasCached) setStories([])
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadStories()
    return () => {
      ignore = true
    }
  }, [])

  const visibleStories = useMemo(() => stories, [stories])

  return (
    <div className="app-page min-h-screen bg-white pb-28 dark:bg-[var(--shadow-bg-page)]">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-nav-bg)]">
        <div className="flex h-14 items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-[var(--shadow-bg-hover)]"
            aria-label={t('shortCompletedPage.goBack')}
          >
            <i className="fas fa-chevron-left text-[18px] text-[var(--shadow-text-primary)]" />
          </button>
          <span className="text-[20px]">📘</span>
          <h1 className="truncate text-[18px] font-extrabold tracking-tight text-[var(--shadow-text-primary)]">
            {t('shortCompletedPage.title')}
          </h1>
        </div>
      </header>

      <main className="px-4 py-5 sm:px-5 lg:px-6">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <LoadingGrid />
          ) : visibleStories.length ? (
            <div className="grid grid-cols-3 gap-x-2.5 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-3">
              {visibleStories.map((story) => (
                <StoryCard key={story.id} story={story} t={t} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-[14px] font-medium text-[var(--shadow-text-secondary)]">
              {t('shortCompletedPage.empty')}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
