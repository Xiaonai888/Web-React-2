import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('continueReadingSection', {
  en: {
    title: 'Continue Reading',
    readChapter: 'Read Ch. {{current}} / {{total}}',
    untitledStory: 'Untitled Story',
  },
  km: {
    title: 'បន្តការអាន',
    readChapter: 'អានជំពូក {{current}} / {{total}}',
    untitledStory: 'រឿងគ្មានចំណងជើង',
  },
  zh: {
    title: '继续阅读',
    readChapter: '阅读第 {{current}} / {{total}} 章',
    untitledStory: '未命名故事',
  },
  ja: {
    title: '続きを読む',
    readChapter: '{{current}} / {{total}} 話を読む',
    untitledStory: '無題のストーリー',
  },
  ko: {
    title: '계속 읽기',
    readChapter: '{{current}} / {{total}}화 읽기',
    untitledStory: '제목 없는 작품',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function ContinueReadingCard({ item }) {
  const { t } = useDisplayTranslation()
  const story = item.story || {}
  const episode = item.episode || {}
  const image = story.landscape_thumbnail_url || story.cover_url || ''
  const episodeNumber = Number(episode.episode_number || item.episode_number || 1)
  const totalEpisodes = Math.max(episodeNumber, Number(item.total_episodes || story.total_episodes || 1))

  return (
    <Link
      to={`/story/${item.story_id}/episode/${item.episode_id}`}
      className="group block w-[112px] shrink-0 md:w-[150px]"
    >
      <div className="relative aspect-[1.28/1] overflow-hidden rounded-[8px] bg-[var(--shadow-bg-soft)]">
        {image ? (
          <img
            src={image}
            alt={story.title || 'Continue reading'}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </div>

      <p className="mt-2 truncate text-[11px] font-medium text-[var(--shadow-text-secondary)]">
        {t('continueReadingSection.readChapter', {
          current: episodeNumber,
          total: totalEpisodes,
        })}
      </p>

      <h3 className="mt-0.5 line-clamp-2 text-[13px] font-semibold leading-[18px] text-[var(--shadow-text-primary)]">
        {story.title || t('continueReadingSection.untitledStory')}
      </h3>
    </Link>
  )
}

export default function ContinueReadingSection({
  storyType = '',
}) {
  const { t } = useDisplayTranslation()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const normalizedStoryType = String(storyType || '')
    .trim()
    .toLowerCase()

  useEffect(() => {
  let ignore = false
  let requestInFlight = false
  let lastRequestStartedAt = 0

  async function loadProgress({
    force = false,
  } = {}) {
    const token = getReaderToken()

    if (!token) {
      if (!ignore) {
        setItems([])
        setLoading(false)
      }
      return
    }

    const now = Date.now()

    if (requestInFlight) return

    if (
      !force &&
      now - lastRequestStartedAt < 5000
    ) {
      return
    }

    requestInFlight = true
    lastRequestStartedAt = now

    try {
      const limit =
        normalizedStoryType ? 30 : 6

      const response = await fetch(
        `${API_BASE_URL}/api/reading-progress?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        }
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
            'Failed to load reading progress'
        )
      }

      const sourceItems =
        Array.isArray(data.items)
          ? data.items
          : []

      const visibleItems =
        normalizedStoryType
          ? sourceItems.filter(
              (item) =>
                String(
                  item?.story?.story_type ||
                    item?.story_type ||
                    ''
                )
                  .trim()
                  .toLowerCase() ===
                normalizedStoryType
            )
          : sourceItems

      if (!ignore) {
        setItems(
          visibleItems.slice(0, 6)
        )
      }
    } catch {
      if (!ignore) {
        setItems([])
      }
    } finally {
      requestInFlight = false

      if (!ignore) {
        setLoading(false)
      }
    }
  }

  loadProgress({ force: true })

  function refreshWhenVisible() {
    if (
      document.visibilityState ===
      'visible'
    ) {
      loadProgress()
    }
  }

  function refreshOnFocus() {
    loadProgress()
  }

  window.addEventListener(
    'focus',
    refreshOnFocus
  )

  document.addEventListener(
    'visibilitychange',
    refreshWhenVisible
  )

  return () => {
    ignore = true

    window.removeEventListener(
      'focus',
      refreshOnFocus
    )

    document.removeEventListener(
      'visibilitychange',
      refreshWhenVisible
    )
  }
}, [normalizedStoryType])

  if (loading || !items.length) return null

  return (
    <section className="px-3 pb-2 md:px-4">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center text-[#ff7a00]">
          <i className="fa-solid fa-book-open text-[17px]" />
        </span>

        <h2 className="text-[18px] font-extrabold tracking-tight text-[var(--shadow-text-primary)] lg:text-[19px]">
          {t('continueReadingSection.title')}
        </h2>
      </div>

      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
        {items.map((item) => (
          <ContinueReadingCard
            key={`${item.story_id}-${item.episode_id}`}
            item={item}
          />
        ))}
      </div>
    </section>
  )
}
