import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  addStoryLanguageParam,
  getStoryLanguageId,
  getStoryLanguageLabel,
} from '../utils/storyLanguage'
import {
  getHomeCacheKey,
  loadHomeCache,
  saveHomeCache,
} from '../utils/homeDataCache'
import { getStoryBadge } from '../utils/storyBadge'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'


registerTranslationNamespace('newArrivalsSection', {
  en: {
    title: 'New Arrivals',
    viewAll: 'Go to New Arrivals page',
    untitledStory: 'Untitled Story',
    shadowAuthor: 'Shadow Author',
    badgeNew: 'NEW',
    badgeUp: 'UP',
    badgeEnd: 'END',
    newArrival: 'New Arrival',
    loadFailed: 'Could not load new arrivals',
    noManga: 'No Manga new arrivals yet',
    noLanguageStories: 'No {{language}} new stories yet',
    publishedOnly: 'Only published stories with at least one episode are shown.',
  },
  km: {
    title: 'រឿងថ្មី',
    viewAll: 'ទៅកាន់ទំព័ររឿងថ្មី',
    untitledStory: 'រឿងគ្មានចំណងជើង',
    shadowAuthor: 'អ្នកនិពន្ធ Shadow',
    badgeNew: 'ថ្មី',
    badgeUp: 'អាប់ដេត',
    badgeEnd: 'ចប់',
    newArrival: 'រឿងថ្មី',
    loadFailed: 'មិនអាចផ្ទុករឿងថ្មីបានទេ',
    noManga: 'មិនទាន់មាន Manga ថ្មីទេ',
    noLanguageStories: 'មិនទាន់មានរឿង {{language}} ថ្មីទេ',
    publishedOnly: 'បង្ហាញតែរឿងដែលបានបោះពុម្ព និងមានយ៉ាងហោចណាស់ 1 ភាគប៉ុណ្ណោះ។',
  },
  zh: {
    title: '新作品',
    viewAll: '前往新作品页面',
    untitledStory: '无标题故事',
    shadowAuthor: 'Shadow 作者',
    badgeNew: '新',
    badgeUp: '更新',
    badgeEnd: '完结',
    newArrival: '新作品',
    loadFailed: '无法加载新作品',
    noManga: '暂无新的 Manga 作品',
    noLanguageStories: '暂无新的 {{language}} 故事',
    publishedOnly: '这里只显示至少已发布一集的故事。',
  },
  ja: {
    title: '新着作品',
    viewAll: '新着作品ページへ移動',
    untitledStory: '無題のストーリー',
    shadowAuthor: 'Shadow 作者',
    badgeNew: '新着',
    badgeUp: '更新',
    badgeEnd: '完結',
    newArrival: '新着作品',
    loadFailed: '新着作品を読み込めませんでした',
    noManga: 'Manga の新着作品はまだありません',
    noLanguageStories: '{{language}} の新着ストーリーはまだありません',
    publishedOnly: '少なくとも1話公開されているストーリーのみ表示されます。',
  },
  ko: {
    title: '신작',
    viewAll: '신작 페이지로 이동',
    untitledStory: '제목 없는 스토리',
    shadowAuthor: 'Shadow 작가',
    badgeNew: '신규',
    badgeUp: '업데이트',
    badgeEnd: '완결',
    newArrival: '신작',
    loadFailed: '새 작품을 불러오지 못했습니다',
    noManga: '아직 새로운 Manga 작품이 없습니다',
    noLanguageStories: '아직 새로운 {{language}} 스토리가 없습니다',
    publishedOnly: '최소 1개 에피소드가 공개된 스토리만 표시됩니다.',
  },
})

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'
const NEW_ARRIVALS_CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000

const badgeStyles = {
  new: 'bg-[#FF4D6D] text-white',
  up: 'bg-[#F6B800] text-[#111827]',
}

const badgeLabelKeys = {
  new: 'badgeNew',
  up: 'badgeUp',
  end: 'badgeEnd',
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

  return {
    id: story.id,
    title: story.title || '',
    author:
      story.author_page?.page_name ||
      story.author_page?.page_username ||
      story.author_name ||
      '',
    badge: badge ? badge.toUpperCase() : '',
    badgeColor: badge,
    likes: formatCompactNumber(story.total_likes),
    views: formatCompactNumber(story.total_views),
    cover:
      story.cover_url ||
      `/assets/New Arrival/New Arrival ${Math.min(index + 1, 18)}.jpg`,
    link: `/story/${story.id}`,
    genre: story.main_genre || '',
    isAdult: Boolean(story.is_adult),
  }
}

function BookCard({ book, onClick, t }) {
  const displayTitle =
    book.title || t('newArrivalsSection.untitledStory')
  const displayGenre =
    book.genre || t('newArrivalsSection.newArrival')
  const badgeLabelKey = badgeLabelKeys[book.badgeColor]

  return (
    <button
      type="button"
      onClick={onClick}
      className="group block h-full w-full shrink-0 text-left"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[8px] bg-[var(--shadow-bg-soft)] shadow-sm">
        <img
          src={book.cover}
          alt={displayTitle}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = '/assets/New Arrival/New Arrival 1.jpg'
          }}
        />

        {book.badge ? (
          <div
            className={`absolute left-0 top-0 rounded-br-[7px] px-2 py-1 text-[10px] font-extrabold leading-none ${
              badgeStyles[book.badgeColor] || badgeStyles.new
            }`}
          >
            {badgeLabelKey ? t(`newArrivalsSection.${badgeLabelKey}`) : book.badge}
          </div>
        ) : null}

        {book.isAdult ? (
          <div className="absolute bottom-2 left-2 rounded-full bg-[#e5484d] px-2.5 py-1 text-[10px] font-extrabold text-white">
            18+
          </div>
        ) : null}
      </div>

      <h3 className="mt-2 block w-full max-w-full overflow-hidden whitespace-nowrap text-ellipsis text-[14px] font-[640] leading-[20px] text-[var(--shadow-text-primary)]">
        {displayTitle}
      </h3>

      <p className="mt-1 line-clamp-1 text-[11.5px] font-medium text-[var(--shadow-text-secondary)]">
        {displayGenre}
      </p>
    </button>
  )
}

function LoadingGrid() {
  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-6 w-44 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
        <div className="h-8 w-8 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
      </div>

      <div className="grid grid-cols-3 gap-x-2 gap-y-6 lg:grid-cols-5 lg:gap-x-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index}>
            <div className="aspect-[2/3] animate-pulse rounded-2xl bg-[var(--shadow-bg-soft)]" />
            <div className="mt-3 h-4 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
            <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default function NewArrivalsSection({
  storyType = '',
}) {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)
  const storyLanguage = getStoryLanguageLabel()

  const normalizedStoryType = String(storyType || '')
    .trim()
    .toLowerCase()

  useEffect(() => {
  let ignore = false

  async function loadNewArrivals() {
    const cacheKey = getHomeCacheKey({
      section: 'stories',
      language: getStoryLanguageId(),
      params: {
        home_section: 'new-arrivals',
        sort: 'latest',
        limit: 24,
        story_type: normalizedStoryType || 'all',
        schema: 1,
      },
    })

    const cached = await loadHomeCache(cacheKey, {
      maxAgeMs: NEW_ARRIVALS_CACHE_MAX_AGE_MS,
      allowExpired: true,
    })

    const hasCachedBooks = Array.isArray(cached?.data)

    if (hasCachedBooks && !ignore) {
      setBooks(cached.data)
      setLoadFailed(false)
      setLoading(false)
    }

    if (cached?.isFresh && hasCachedBooks) {
      return
    }

    try {
      if (!hasCachedBooks && !ignore) {
        setLoading(true)
      }

      if (!ignore) {
        setLoadFailed(false)
      }

      const storyTypeQuery = normalizedStoryType
        ? `&story_type=${encodeURIComponent(
            normalizedStoryType
          )}`
        : ''

      const response = await fetch(
        addStoryLanguageParam(
          `${API_BASE_URL}/api/public/stories?limit=24&sort=latest${storyTypeQuery}`
        )
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message ||
            'Failed to load new arrivals'
        )
      }

      const newestBooks = (data.stories || [])
        .filter(
          (story) =>
            !normalizedStoryType ||
            String(story?.story_type || '')
              .trim()
              .toLowerCase() === normalizedStoryType
        )
        .filter(
          (story) =>
            Number(story.total_episodes || 0) >= 1
        )
        .filter(
          (story) => getStoryBadge(story) !== 'end'
        )
        .map(normalizeStory)
        .slice(0, 12)

      if (ignore) return

      setBooks(newestBooks)
      setLoadFailed(false)

      await saveHomeCache(cacheKey, newestBooks, {
        maxAgeMs: NEW_ARRIVALS_CACHE_MAX_AGE_MS,
      })
    } catch (error) {
      console.error(
        'NewArrivalsSection fetch error:',
        error
      )

      if (!ignore && !hasCachedBooks) {
        setLoadFailed(true)
        setBooks([])
      }
    } finally {
      if (!ignore) {
        setLoading(false)
      }
    }
  }

  loadNewArrivals()

  return () => {
    ignore = true
  }
}, [normalizedStoryType])

  if (loading) {
    return <LoadingGrid />
  }

  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[20px] lg:text-[21px]">
            🚀
          </span>

          <h2 className="text-[18px] font-extrabold tracking-tight text-[var(--shadow-text-primary)] lg:text-[19px]">
            {t('newArrivalsSection.title')}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => navigate('/new-arrivals')}
          className="flex h-8 w-8 items-center justify-end rounded-full transition-colors hover:bg-[var(--shadow-bg-soft)]"
          aria-label={t('newArrivalsSection.viewAll')}
        >
          <i className="fas fa-chevron-right text-[15px] text-[var(--shadow-text-secondary)] lg:text-[16px]" />
        </button>
      </div>

      {books.length ? (
        <div className="-mr-4 flex gap-3 overflow-x-auto overscroll-x-contain pb-2 pr-4 [-ms-overflow-style:none] [scrollbar-width:none] [touch-action:pan-x_pan-y] sm:-mr-5 sm:pr-5 lg:mr-0 lg:grid lg:grid-cols-6 lg:gap-3 lg:overflow-visible lg:pb-0 lg:pr-0 [&::-webkit-scrollbar]:hidden">
          {books.map((book) => (
            <div
              key={book.id}
              className="w-[calc((100vw-56px)/2.5)] min-w-[calc((100vw-56px)/2.5)] lg:w-auto lg:min-w-0"
            >
              <BookCard
                book={book}
                onClick={() => {
  navigate(book.link, {
    state: { sectionRank: 'new_arrivals' },
  })
}}
                t={t}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[22px] bg-[var(--shadow-bg-soft)] px-4 py-6 text-center">
          <div className="text-[14px] font-extrabold text-[var(--shadow-text-primary)]">
            {loadFailed
              ? t('newArrivalsSection.loadFailed')
              : normalizedStoryType === 'manga'
                ? t('newArrivalsSection.noManga')
                : t('newArrivalsSection.noLanguageStories', {
                    language: storyLanguage,
                  })}
          </div>

          <div className="mt-1 text-[12px] text-[var(--shadow-text-tertiary)]">
            {t('newArrivalsSection.publishedOnly')}
          </div>
        </div>
      )}
    </section>
  )
}
