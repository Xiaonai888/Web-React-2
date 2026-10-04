import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { registerTranslationNamespace } from '../i18n/registerTranslations'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { addStoryLanguageParam, getStoryLanguageId } from '../utils/storyLanguage'
import { getHomeCacheKey, loadHomeCache, saveHomeCache } from '../utils/homeDataCache'

registerTranslationNamespace('shortCompletedSection', {
  en: { title: 'Short & Completed', viewAll: 'View all Short & Completed', untitled: 'Untitled Story', genre: 'Genre' },
  km: { title: 'រឿងខ្លី & ចប់រួច', viewAll: 'មើលរឿងខ្លីដែលចប់រួចទាំងអស់', untitled: 'រឿងគ្មានចំណងជើង', genre: 'ប្រភេទរឿង' },
  zh: { title: '短篇完结', viewAll: '查看全部短篇完结', untitled: '无标题故事', genre: '类型' },
  ja: { title: '短編・完結', viewAll: '短編・完結をすべて見る', untitled: '無題のストーリー', genre: 'ジャンル' },
  ko: { title: '단편 완결', viewAll: '단편 완결 전체 보기', untitled: '제목 없는 스토리', genre: '장르' },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000
const ROTATION_MS = 60 * 60 * 1000
const POOL_SIZE = 48
const DISPLAY_SIZE = 6
const PRIORITY_POOL_SIZE = 24

function getRotationSlot() {
  return Math.floor(Date.now() / ROTATION_MS)
}

function normalizeStory(story) {
  return {
    id: story.id,
    title: String(story.title || '').trim(),
    cover: String(story.cover_url || '').trim(),
    genre: String(story.main_genre || '').trim(),
    views: Number(story.total_views || 0),
    episodes: Number(story.total_episodes || 0),
    updatedAt: new Date(story.updated_at || story.created_at || 0).getTime() || 0,
  }
}

function buildHourlySelection(stories, slot) {
  const sorted = [...stories]
    .sort((a, b) => a.views - b.views || b.updatedAt - a.updatedAt)
    .slice(0, PRIORITY_POOL_SIZE)

  if (sorted.length <= DISPLAY_SIZE) {
    if (!sorted.length) return []
    const shift = slot % sorted.length
    return sorted.map((_, index) => sorted[(index + shift) % sorted.length])
  }

  const start = (slot * DISPLAY_SIZE) % sorted.length
  const selected = Array.from(
    { length: DISPLAY_SIZE },
    (_, index) => sorted[(start + index) % sorted.length]
  )
  const shift = slot % selected.length
  return selected.map((_, index) => selected[(index + shift) % selected.length])
}

function StoryCard({ story, t }) {
  const title = story.title || t('shortCompletedSection.untitled')
  const genre = story.genre || t('shortCompletedSection.genre')

  return (
    <Link to={`/story/${story.id}`} state={{ sectionRank: 'short_completed' }} className="group block min-w-0">
      <div className="aspect-[2/3] overflow-hidden rounded-[8px] bg-[var(--shadow-bg-soft)] shadow-sm">
        <img
          src={story.cover}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="pt-2">
        <h3 className="truncate text-[13px] font-[650] leading-[18px] text-[var(--shadow-text-primary)]">{title}</h3>
        <p className="mt-1 truncate text-[10.5px] text-[var(--shadow-text-tertiary)]">{genre}</p>
      </div>
    </Link>
  )
}

function LoadingGrid({ t }) {
  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[20px]">📘</span>
            <h2 className="text-[18px] font-extrabold text-[var(--shadow-text-primary)]">{t('shortCompletedSection.title')}</h2>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-x-2.5 gap-y-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index}>
              <div className="aspect-[2/3] animate-pulse rounded-[8px] bg-[var(--shadow-bg-soft)]" />
              <div className="mt-2 h-3.5 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
              <div className="mt-2 h-2.5 w-2/3 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function ShortCompletedSection() {
  const { t } = useDisplayTranslation()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [rotationSlot, setRotationSlot] = useState(getRotationSlot)

  useEffect(() => {
    const intervalId = window.setInterval(() => setRotationSlot(getRotationSlot()), 60 * 1000)
    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadStories() {
      const cacheKey = getHomeCacheKey({
        section: 'stories',
        language: getStoryLanguageId(),
        params: { home_section: 'short-completed', story_status: 'Completed', story_type: 'novel', max_episodes: 20, sort: 'discover_more', limit: POOL_SIZE, schema: 1 },
      })

      const cached = await loadHomeCache(cacheKey, { maxAgeMs: CACHE_MAX_AGE_MS, allowExpired: true })
      const hasCached = Array.isArray(cached?.data) && cached.data.length > 0

      if (hasCached && !ignore) {
        setStories(cached.data)
        setLoading(false)
      }

      if (cached?.isFresh && hasCached) return

      try {
        const response = await fetch(
          addStoryLanguageParam(
            `${API_BASE_URL}/api/public/stories?limit=${POOL_SIZE}&sort=discover_more&story_status=Completed&story_type=novel&max_episodes=20`
          )
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) throw new Error(data.message || 'Failed to load Short & Completed')

        const nextStories = (Array.isArray(data.stories) ? data.stories : [])
          .filter((story) => String(story.story_status || '').trim().toLowerCase() === 'completed')
          .filter((story) => String(story.story_type || '').trim().toLowerCase() === 'novel')
          .filter((story) => Number(story.total_episodes || 0) > 0 && Number(story.total_episodes || 0) <= 20)
          .filter((story) => Boolean(String(story.cover_url || '').trim()))
          .map(normalizeStory)

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

  const visibleStories = useMemo(
    () => buildHourlySelection(stories, rotationSlot),
    [stories, rotationSlot]
  )

  if (loading) return <LoadingGrid t={t} />
  if (!visibleStories.length) return null

  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[20px]">📘</span>
            <h2 className="text-[18px] font-extrabold tracking-tight text-[var(--shadow-text-primary)] lg:text-[19px]">
              {t('shortCompletedSection.title')}
            </h2>
          </div>
          <Link
            to="/short-completed"
            className="flex h-8 w-8 items-center justify-end rounded-full transition-colors hover:bg-[var(--shadow-bg-soft)]"
            aria-label={t('shortCompletedSection.viewAll')}
          >
            <i className="fas fa-chevron-right text-[15px] text-[var(--shadow-text-secondary)]" />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-x-2.5 gap-y-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-3">
          {visibleStories.map((story) => (
            <StoryCard key={story.id} story={story} t={t} />
          ))}
        </div>
      </div>
    </section>
  )
}
