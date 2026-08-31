import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { addStoryLanguageParam } from '../utils/storyLanguage'
import { getStoryBadge } from '../utils/storyBadge'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'


registerTranslationNamespace('updateTodaySection', {
  en: {
    new: 'NEW',
    up: 'UP',
    end: 'END',
    untitledStory: 'Untitled Story',
    title: 'Update Today',
    viewAll: 'View all update today',
  },
  km: {
    new: 'ថ្មី',
    up: 'អាប់ដេត',
    end: 'ចប់',
    untitledStory: 'រឿងគ្មានចំណងជើង',
    title: 'អាប់ដេតថ្ងៃនេះ',
    viewAll: 'មើលការអាប់ដេតថ្ងៃនេះទាំងអស់',
  },
  zh: {
    new: '新',
    up: '更新',
    end: '完结',
    untitledStory: '无标题故事',
    title: '今日更新',
    viewAll: '查看今日全部更新',
  },
  ja: {
    new: '新着',
    up: '更新',
    end: '完結',
    untitledStory: '無題のストーリー',
    title: '今日の更新',
    viewAll: '今日の更新をすべて見る',
  },
  ko: {
    new: '신규',
    up: '업데이트',
    end: '완결',
    untitledStory: '제목 없는 스토리',
    title: '오늘 업데이트',
    viewAll: '오늘 업데이트 모두 보기',
  },
})

const API_BASE_URL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const badgeConfig = {
  new: {
    labelKey: 'new',
    className: 'bg-[#FF4D6D] text-white',
  },
  up: {
    labelKey: 'up',
    className: 'bg-[#F6B800] text-[#111827]',
  },
  end: {
    labelKey: 'end',
    className: 'bg-[#16A34A] text-white',
  },
}

function getFirstDifferentTag(mainGenre, tags = []) {
  const genre = String(mainGenre || '').trim().toLowerCase()
  const normalizedTags = Array.isArray(tags) ? tags : []

  return (
    normalizedTags
      .map((tag) => String(tag || '').trim())
      .find((tag) => tag && tag.toLowerCase() !== genre) || ''
  )
}

function normalizeStory(story, index = 0) {
  return {
    id: story.id,
    title: story.title || '',
    cover:
      story.cover_url ||
      `/assets/Update Today/Update Today ${Math.min(index + 1, 7)}.jpg`,
    genre: String(story.main_genre || '').trim(),
    firstTag: getFirstDifferentTag(story.main_genre, story.tags),
    badge: getStoryBadge(story),
  }
}

function StatusBadge({ type, t }) {
  const badge = badgeConfig[type]
  if (!badge) return null

  return (
    <div
      className={`absolute left-0 top-0 rounded-br-[7px] px-2 py-1 text-[10px] font-extrabold leading-none ${badge.className}`}
    >
      {t(`updateTodaySection.${badge.labelKey}`)}
    </div>
  )
}

function SmallBookCard({ book, t }) {
  const displayTitle = book.title || t('updateTodaySection.untitledStory')

  return (
    <Link
  to={`/story/${book.id}`}
  state={{ sectionRank: 'update_today' }}
  className="group block min-w-0"
>
      <div className="overflow-hidden rounded-[8px] bg-[#1e1e22] shadow-sm">
        <div className="relative aspect-[2/3] overflow-hidden rounded-[8px]">
          <img
            src={book.cover}
            alt={displayTitle}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            loading="lazy"
            decoding="async"
            onError={(event) => {
              event.currentTarget.src = '/assets/Update Today/Update Today 2.jpg'
            }}
          />
          {book.badge ? <StatusBadge type={book.badge} t={t} /> : null}
        </div>
      </div>

      <div className="pt-2.5 sm:pt-3">
        <h3 className="block w-full max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-[640] leading-[20px] text-[var(--shadow-text-primary)]">
          {displayTitle}
        </h3>

        <p className="mt-1 min-h-[17px] truncate text-[11.5px] font-normal text-[var(--shadow-text-tertiary)]">
          {[book.genre, book.firstTag].filter(Boolean).join(' / ')}
        </p>
      </div>
    </Link>
  )
}

function LoadingSkeleton({ t }) {
  return (
    <section className="px-4 pb-8 pt-0 sm:px-5 lg:px-6">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[20px] lg:text-[21px]">🎉</span>
            <h2 className="text-[18px] font-extrabold tracking-tight text-[var(--shadow-text-primary)] lg:text-[19px]">
              {t('updateTodaySection.title')}
            </h2>
          </div>

          <Link
            to="/update-today"
            className="flex h-8 w-8 items-center justify-end rounded-full transition-colors hover:bg-[var(--shadow-bg-hover)]"
            aria-label={t('updateTodaySection.viewAll')}
          >
            <i className="fas fa-chevron-right text-[15px] text-[var(--shadow-text-secondary)] lg:text-[16px]" />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-x-2 gap-y-4 md:grid-cols-6 md:gap-x-3 md:gap-y-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index}>
              <div className="aspect-[2/3] animate-pulse rounded-[8px] bg-[var(--shadow-bg-soft)]" />
              <div className="mt-3 h-4 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
              <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function UpdateTodaySection({
  storyType = '',
}) {
  const { t } = useDisplayTranslation()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  const normalizedStoryType = String(storyType || '')
    .trim()
    .toLowerCase()

  useEffect(() => {
    const controller = new AbortController()
    let ignore = false

    async function loadPublishedStories() {
      setLoading(true)

      try {
        const storyTypeQuery = normalizedStoryType
          ? `&story_type=${encodeURIComponent(normalizedStoryType)}`
          : ''

        const response = await fetch(
          addStoryLanguageParam(
            `${API_BASE_URL}/api/public/story-updates?days=1&limit_per_day=100${storyTypeQuery}`
          ),
          {
            signal: controller.signal,
            cache: 'no-store',
          }
        )

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(
            data.message || 'Failed to load update today stories'
          )
        }

        const today = String(data.today || '').trim()

        const nextStories = (Array.isArray(data.stories) ? data.stories : [])
          .filter(
            (story) =>
              !today ||
              String(story?.update_date || '').trim() === today
          )
          .sort(
            (a, b) =>
              new Date(
                b.last_episode_published_at || 0
              ).getTime() -
              new Date(
                a.last_episode_published_at || 0
              ).getTime()
          )
          .map(normalizeStory)

        if (ignore || controller.signal.aborted) return

        setStories(nextStories)
      } catch (error) {
        if (error?.name === 'AbortError') return

        console.error(
          'UpdateTodaySection fetch error:',
          error
        )

        if (!ignore) {
          setStories([])
        }
      } finally {
        if (!ignore && !controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadPublishedStories()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [normalizedStoryType])

  const updateBooks = useMemo(
    () => stories.slice(0, 6),
    [stories]
  )

  if (loading) {
    return <LoadingSkeleton t={t} />
  }

  if (!updateBooks.length) {
    return null
  }

  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[20px] lg:text-[21px]">
              🎉
            </span>

            <h2 className="text-[18px] font-extrabold tracking-tight text-[var(--shadow-text-primary)] lg:text-[19px]">
              {t('updateTodaySection.title')}
            </h2>
          </div>

          <Link
            to="/update-today"
            className="flex h-8 w-8 items-center justify-end rounded-full transition-colors hover:bg-[var(--shadow-bg-soft)]"
            aria-label={t('updateTodaySection.viewAll')}
          >
            <i className="fas fa-chevron-right text-[15px] text-[var(--shadow-text-secondary)] lg:text-[16px]" />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-x-2 gap-y-4 md:grid-cols-6 md:gap-x-3 md:gap-y-5">
          {updateBooks.map((book) => (
            <SmallBookCard
              key={book.id}
              book={book}
              t={t}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
