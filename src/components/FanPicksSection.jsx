import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('fanPicksSection', {
  en: {
    title: 'Hidden Gems',
    untitledStory: 'Untitled Story',
    discoverMore: 'Discover More',
  },
  km: {
    title: 'រឿងល្អៗដែលមិនគួររំលង',
    untitledStory: 'រឿងគ្មានចំណងជើង',
    discoverMore: 'ស្វែងរកបន្ថែម',
  },
  zh: {
    title: '宝藏佳作',
    untitledStory: '未命名故事',
    discoverMore: '发现更多',
  },
  ja: {
    title: '隠れた名作',
    untitledStory: '無題のストーリー',
    discoverMore: 'もっと見る',
  },
  ko: {
    title: '숨은 명작',
    untitledStory: '제목 없는 작품',
    discoverMore: '더 발견하기',
  },
})
import {
  addStoryLanguageParam,
  getStoryLanguageId,
} from '../utils/storyLanguage'
import {
  getHomeCacheKey,
  loadHomeCache,
  saveHomeCache,
} from '../utils/homeDataCache'

const API_BASE_URL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const FAN_PICKS_CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000
const fallbackBooks = Array.from({ length: 6 }).map((_, index) => ({
  id: 601 + index,
  title: '',
  cover: `/assets/FanPicksSection/FanPicksSection ${index + 1}.jpg`,
  link: `/story/${601 + index}`,
  genre: '',
}))

function normalizeStory(story, index = 0) {
  return {
    id: story.id,
    title: story.title || '',
    cover: story.cover_url || `/assets/FanPicksSection/FanPicksSection ${Math.min(index + 1, 6)}.jpg`,
    link: `/story/${story.id}`,
    genre: story.main_genre || '',
  }
}

function BookCard({ book }) {
  const { t } = useDisplayTranslation()

  return (
    <div className="group block w-full">
      <div className="flex flex-col items-start">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[8px] bg-[var(--shadow-bg-soft)] shadow-sm">
          <img
            src={book.cover}
            alt={book.title || t('fanPicksSection.untitledStory')}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = '/assets/FanPicksSection/FanPicksSection 1.jpg'
            }}
          />
        </div>

        <h3 className="block w-full max-w-full overflow-hidden whitespace-nowrap text-ellipsis text-[14px] font-[640] leading-[20px] text-[var(--shadow-text-primary)]">
          {book.title || t('fanPicksSection.untitledStory')}
        </h3>

        <p className="mt-1 line-clamp-1 text-[11.5px] font-medium text-[var(--shadow-text-secondary)]">
          {book.genre || t('fanPicksSection.discoverMore')}
        </p>
      </div>
    </div>
  )
}

function LoadingGrid() {
  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-6 w-36 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
      </div>

      <div className="scrollbar-none flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-5 lg:gap-x-3 lg:gap-y-6 lg:overflow-visible lg:pb-0">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="w-[calc((100%_-_24px)/3)] shrink-0 lg:w-full lg:shrink"
          >
            <div className="aspect-[2/3] animate-pulse rounded-[8px] bg-[var(--shadow-bg-soft)]" />
            <div className="mt-2 h-4 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
            <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default function FanPicksSection() {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const [realBooks, setRealBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  let ignore = false

  async function loadFanPicks() {
    const cacheKey = getHomeCacheKey({
      section: 'stories',
      language: getStoryLanguageId(),
      params: {
        home_section: 'hidden-gems',
        sort: 'discover_more',
        limit: 6,
        schema: 1,
      },
    })

    const cached = await loadHomeCache(cacheKey, {
      maxAgeMs: FAN_PICKS_CACHE_MAX_AGE_MS,
      allowExpired: true,
    })

    const hasCachedBooks = Array.isArray(cached?.data)

    if (hasCachedBooks && !ignore) {
      setRealBooks(cached.data)
      setLoading(false)
    }

    if (cached?.isFresh && hasCachedBooks) {
      return
    }

    try {
      if (!hasCachedBooks && !ignore) {
        setLoading(true)
      }

      const response = await fetch(
        addStoryLanguageParam(
          `${API_BASE_URL}/api/public/stories?limit=6&sort=discover_more`
        )
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message || 'Failed to load Discover More'
        )
      }

      const nextBooks = (data.stories || [])
        .map(normalizeStory)
        .slice(0, 6)

      if (ignore) return

      setRealBooks(nextBooks)

      await saveHomeCache(cacheKey, nextBooks, {
        maxAgeMs: FAN_PICKS_CACHE_MAX_AGE_MS,
      })
    } catch (error) {
      console.error('Discover More fetch error:', error)

      if (!ignore && !hasCachedBooks) {
        setRealBooks([])
      }
    } finally {
      if (!ignore) {
        setLoading(false)
      }
    }
  }

  loadFanPicks()

  return () => {
    ignore = true
  }
}, [])

  const books = useMemo(() => {
    return realBooks.length ? realBooks : fallbackBooks
  }, [realBooks])

  if (loading) {
    return <LoadingGrid />
  }

  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-[20px]">💎</span>
        <h2 className="text-[18px] font-extrabold tracking-tight text-[var(--shadow-text-primary)]">
          {t('fanPicksSection.title')}
        </h2>
      </div>

      <div className="scrollbar-none flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-5 lg:gap-x-3 lg:gap-y-6 lg:overflow-visible lg:pb-0">
        {books.map((book) => (
          <button
            key={book.id}
            type="button"
            onClick={() => navigate(book.link)}
            className="w-[calc((100%_-_24px)/3)] shrink-0 text-left lg:w-full lg:shrink"
          >
            <BookCard book={book} />
          </button>
        ))}
      </div>
    </section>
  )
}
