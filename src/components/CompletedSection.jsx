import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('completedSection', {
  en: {
    title: 'Completed',
    untitledStory: 'Untitled Story',
    loadFailed: 'Could not load completed stories',
    empty: 'No completed stories yet',
    emptyDescription: 'Completed stories with at least one episode will appear here.',
  },
  km: {
    title: 'រឿងចប់',
    untitledStory: 'រឿងគ្មានចំណងជើង',
    loadFailed: 'មិនអាចផ្ទុករឿងដែលបានបញ្ចប់បានទេ',
    empty: 'មិនទាន់មានរឿងដែលបានបញ្ចប់ទេ',
    emptyDescription: 'រឿងដែលបានបញ្ចប់ និងមានយ៉ាងហោចណាស់មួយភាគ នឹងបង្ហាញនៅទីនេះ។',
  },
  zh: {
    title: '已完结',
    untitledStory: '未命名故事',
    loadFailed: '无法加载已完结故事',
    empty: '暂无已完结故事',
    emptyDescription: '至少有一章的已完结故事会显示在这里。',
  },
  ja: {
    title: '完結作品',
    untitledStory: '無題のストーリー',
    loadFailed: '完結作品を読み込めませんでした',
    empty: '完結作品はまだありません',
    emptyDescription: '1話以上ある完結作品がここに表示されます。',
  },
  ko: {
    title: '완결 작품',
    untitledStory: '제목 없는 작품',
    loadFailed: '완결 작품을 불러오지 못했습니다',
    empty: '아직 완결 작품이 없습니다',
    emptyDescription: '에피소드가 하나 이상 있는 완결 작품이 여기에 표시됩니다.',
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

const COMPLETED_CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000

function normalizeStory(story, index = 0) {
  return {
    id: story.id,
    title: story.title || '',
    genre: story.main_genre || '',
    cover:
      story.cover_url ||
      `/assets/Completed/Completed ${Math.min(index + 1, 27)}.jpg`,
    link: `/story/${story.id}`,
  }
}

function BookCard({ book, onOpen }) {
  const { t } = useDisplayTranslation()

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group block w-full border-0 bg-transparent p-0 text-left"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[8px] bg-[var(--shadow-bg-soft)] shadow-sm">
        <img
          src={book.cover}
          alt={book.title || t('completedSection.untitledStory')}
          className="pointer-events-none h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          loading="lazy"
          draggable="false"
          onError={(event) => {
            event.currentTarget.src = '/assets/Completed/Completed 1.jpg'
          }}
        />
      </div>

      <h3 className="mt-2 block w-full overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-[640] leading-[20px] text-[var(--shadow-text-primary)]">
        {book.title || t('completedSection.untitledStory')}
      </h3>

      <p className="mt-1 line-clamp-1 min-h-[17px] text-[11.5px] font-medium text-[var(--shadow-text-secondary)]">
        {book.genre}
      </p>
    </button>
  )
}

function LoadingCompleted() {
  return (
    <section className="px-4 pb-2 sm:px-5 lg:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-6 w-32 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
        <div className="h-8 w-8 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
      </div>

      <div className="flex gap-2 overflow-hidden md:gap-3">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="w-[calc((100%_-_8px)/2)] shrink-0 md:min-w-[112px] md:w-[calc((100%_-_60px)/6)] lg:min-w-[92px] lg:w-[calc((100%_-_132px)/12)]"
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

export default function CompletedSection() {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const scrollRef = useRef(null)
  const isDraggingRef = useRef(false)
  const dragMovedRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)

  useEffect(() => {
  let ignore = false

  async function loadCompletedStories() {
    const cacheKey = getHomeCacheKey({
      section: 'stories',
      language: getStoryLanguageId(),
      params: {
        home_section: 'completed',
        sort: 'latest',
        limit: 12,
        story_status: 'completed',
        schema: 1,
      },
    })

    const cached = await loadHomeCache(cacheKey, {
      maxAgeMs: COMPLETED_CACHE_MAX_AGE_MS,
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

      const response = await fetch(
        addStoryLanguageParam(
          `${API_BASE_URL}/api/public/stories?limit=12&sort=latest&story_status=Completed`
        )
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message ||
            'Failed to load completed stories'
        )
      }

      const completedBooks = (data.stories || [])
        .filter(
          (story) =>
            Number(story.total_episodes || 0) >= 1
        )
        .filter(
          (story) =>
            Boolean(story.is_completed) ||
            String(story.story_status || '')
              .trim()
              .toLowerCase() === 'completed'
        )
        .map(normalizeStory)
        .slice(0, 12)

      if (ignore) return

      setBooks(completedBooks)
      setLoadFailed(false)

      await saveHomeCache(cacheKey, completedBooks, {
        maxAgeMs: COMPLETED_CACHE_MAX_AGE_MS,
      })
    } catch (error) {
      console.error(
        'CompletedSection fetch error:',
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

  loadCompletedStories()

  return () => {
    ignore = true
  }
}, [])
  const handleMouseDown = (event) => {
    const container = scrollRef.current
    if (!container) return

    isDraggingRef.current = true
    dragMovedRef.current = false
    startXRef.current = event.pageX - container.offsetLeft
    scrollLeftRef.current = container.scrollLeft
    container.style.scrollSnapType = 'none'
  }

  const handleMouseMove = (event) => {
    const container = scrollRef.current
    if (!container || !isDraggingRef.current) return

    event.preventDefault()

    const x = event.pageX - container.offsetLeft
    const walk = x - startXRef.current

    if (Math.abs(walk) > 4) {
      dragMovedRef.current = true
    }

    container.scrollLeft = scrollLeftRef.current - walk * 1.4
  }

  const stopMouseDrag = () => {
    isDraggingRef.current = false

    if (scrollRef.current) {
      scrollRef.current.style.scrollSnapType = ''
    }
  }

  const openBook = (link) => {
    if (dragMovedRef.current) {
      dragMovedRef.current = false
      return
    }

    navigate(link)
  }

  if (loading) {
    return <LoadingCompleted />
  }

  return (
    <section className="px-4 pb-2 sm:px-5 lg:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[20px] lg:text-[21px]">😁</span>
          <h2 className="text-[18px] font-extrabold tracking-tight text-[var(--shadow-text-primary)] lg:text-[19px]">
            {t('completedSection.title')}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => navigate('/completed')}
          className="flex h-8 w-8 items-center justify-end rounded-full transition-colors hover:bg-[var(--shadow-bg-hover)]"
          aria-label="Go to Completed page"
        >
          <i className="fas fa-chevron-right text-[15px] text-[var(--shadow-text-secondary)] lg:text-[16px]" />
        </button>
      </div>

      {books.length ? (
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopMouseDrag}
          onMouseLeave={stopMouseDrag}
          className="scrollbar-none flex cursor-grab snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth select-none active:cursor-grabbing md:gap-3"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {books.map((book) => (
            <div
              key={book.id}
              className="w-[calc((100%_-_8px)/2)] shrink-0 snap-start md:min-w-[112px] md:w-[calc((100%_-_60px)/6)] lg:min-w-[92px] lg:w-[calc((100%_-_132px)/12)]"
            >
              <BookCard book={book} onOpen={() => openBook(book.link)} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[22px] bg-[var(--shadow-bg-soft)] px-4 py-6 text-center">
          <div className="text-[14px] font-extrabold text-[var(--shadow-text-primary)]">
            {loadFailed
              ? t('completedSection.loadFailed')
              : t('completedSection.empty')}
          </div>
          <div className="mt-1 text-[12px] text-[var(--shadow-text-secondary)]">
            {t('completedSection.emptyDescription')}
          </div>
        </div>
      )}
    </section>
  )
}
