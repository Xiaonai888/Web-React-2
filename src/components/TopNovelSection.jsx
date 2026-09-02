import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('topNovelSection', {
  en: {
    title: 'Ranking',
    bestSellers: 'Best Sellers',
    mostReads: 'Most Reads',
    risingStars: 'Rising Stars',
    romance: 'Romance',
    lgbtq: 'LGBTQ+',
    completed: 'Completed',
    untitledStory: 'Untitled Story',
    rankingGenre: 'Ranking',
  },
  km: {
    title: 'ចំណាត់ថ្នាក់',
    bestSellers: 'លក់ដាច់បំផុត',
    mostReads: 'អានច្រើនបំផុត',
    risingStars: 'កំពុងពេញនិយម',
    romance: 'មនោសញ្ចេតនា',
    lgbtq: 'LGBTQ+',
    completed: 'រឿងចប់',
    untitledStory: 'រឿងគ្មានចំណងជើង',
    rankingGenre: 'ចំណាត់ថ្នាក់',
  },
  zh: {
    title: '排行榜',
    bestSellers: '畅销榜',
    mostReads: '阅读最多',
    risingStars: '新星榜',
    romance: '浪漫',
    lgbtq: 'LGBTQ+',
    completed: '已完结',
    untitledStory: '未命名故事',
    rankingGenre: '排行榜',
  },
  ja: {
    title: 'ランキング',
    bestSellers: 'ベストセラー',
    mostReads: '最多読者',
    risingStars: '注目上昇中',
    romance: 'ロマンス',
    lgbtq: 'LGBTQ+',
    completed: '完結',
    untitledStory: '無題のストーリー',
    rankingGenre: 'ランキング',
  },
  ko: {
    title: '랭킹',
    bestSellers: '베스트셀러',
    mostReads: '최다 조회',
    risingStars: '떠오르는 작품',
    romance: '로맨스',
    lgbtq: 'LGBTQ+',
    completed: '완결',
    untitledStory: '제목 없는 작품',
    rankingGenre: '랭킹',
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

const TOP_NOVEL_CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000

const rankingTabs = [
  {
    label: 'Best Sellers',
    labelKey: 'bestSellers',
    endpoint: '/api/public/stories?limit=6&sort=popular',
  },
  {
    label: 'Most Reads',
    labelKey: 'mostReads',
    endpoint: '/api/public/stories?limit=6&sort=trending',
  },
  {
    label: 'Rising Stars',
    labelKey: 'risingStars',
    endpoint: '/api/public/stories?limit=6&sort=updated',
  },
  {
    label: 'Romance',
    labelKey: 'romance',
    endpoint: '/api/public/stories?limit=6&sort=popular&genre=Romance',
  },
  {
    label: 'LGBTQ+',
    labelKey: 'lgbtq',
    endpoint: '/api/public/stories?limit=48&sort=popular',
    filter: isLgbtqStory,
  },
  {
    label: 'Completed',
    labelKey: 'completed',
    endpoint: '/api/public/stories?limit=6&sort=popular&story_status=Completed',
    filter: isCompletedStory,
  },
]

function isCompletedStory(story) {
  return String(story?.story_status || '').trim().toLowerCase() === 'completed'
}

function isLgbtqStory(story) {
  const tags = Array.isArray(story?.tags) ? story.tags : []
  const text = [story?.main_genre, story?.description, ...tags]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return [
    'lgbtq',
    'lgbt',
    'bl',
    'gl',
    'boys love',
    'girls love',
    'boy love',
    'girl love',
    'queer',
    'yaoi',
    'yuri',
  ].some((keyword) => text.includes(keyword))
}

function getActiveTabConfig(label) {
  return rankingTabs.find((tab) => tab.label === label) || rankingTabs[0]
}

function getRankLabel(rank) {
  return String(rank).padStart(2, '0')
}

function getRankBadgeClass(rank) {
  if (rank === 1) return 'bg-[#facc15] text-[#111827]'
  if (rank === 2) return 'bg-[#ef4444] text-white'
  if (rank === 3) return 'bg-[#f97316] text-white'

  return 'bg-[#6b7280] text-white'
}

function normalizeStory(story, index = 0) {
  return {
    id: story.id,
    rank: index + 1,
    title: story.title || '',
    image: story.cover_url || story.coverUrl || story.image_url || '',
    link: `/story/${story.id}`,
    genre: story.main_genre || story.genre || '',
    isFallback: false,
  }
}

async function fetchRankingItems(
  tab,
  categoryLabel,
  storyType = '',
  onCachedItems = null
) {
  const normalizedStoryType = String(storyType || '')
    .trim()
    .toLowerCase()

  const cacheKey = getHomeCacheKey({
    section: 'stories',
    language: getStoryLanguageId(),
    params: {
      home_section: 'ranking',
      category: categoryLabel,
      story_type: normalizedStoryType || 'all',
      schema: 1,
    },
  })

  const cached = await loadHomeCache(cacheKey, {
    maxAgeMs: TOP_NOVEL_CACHE_MAX_AGE_MS,
    allowExpired: true,
  })

  const hasCachedItems = Array.isArray(cached?.data)

  if (hasCachedItems && onCachedItems) {
    onCachedItems(cached.data)
  }

  if (cached?.isFresh && hasCachedItems) {
    return cached.data
  }

  try {
    const separator = tab.endpoint.includes('?') ? '&' : '?'
    const endpoint = normalizedStoryType
      ? `${tab.endpoint}${separator}story_type=${encodeURIComponent(
          normalizedStoryType
        )}`
      : tab.endpoint

    const response = await fetch(
      addStoryLanguageParam(`${API_BASE_URL}${endpoint}`)
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(
        data.message || `Failed to load ${categoryLabel}`
      )
    }

    const rows = Array.isArray(data.stories)
      ? data.stories
      : []

    const storyTypeRows = normalizedStoryType
      ? rows.filter(
          (story) =>
            String(story?.story_type || '')
              .trim()
              .toLowerCase() === normalizedStoryType
        )
      : rows

    const filteredRows = tab.filter
      ? storyTypeRows.filter(tab.filter)
      : storyTypeRows

    const items = filteredRows
      .slice(0, 6)
      .map(normalizeStory)

    await saveHomeCache(cacheKey, items, {
      maxAgeMs: TOP_NOVEL_CACHE_MAX_AGE_MS,
    })

    return items
  } catch (error) {
    if (hasCachedItems) {
      return cached.data
    }

    throw error
  }
}
function RankBadge({ rank }) {
  return (
    <div
      className={`absolute -left-px -top-px z-10 flex h-[24px] min-w-[28px] items-center justify-center rounded-tl-[8px] rounded-br-[9px] px-1.5 text-[10px] font-extrabold leading-none shadow-sm ${getRankBadgeClass(rank)}`}
    >
      {getRankLabel(rank)}
    </div>
  )
}

function SafeBookCover({ src, title, rank }) {
  const [imageFailed, setImageFailed] = useState(false)
  const hasImage =
    typeof src === 'string' &&
    src.trim() !== '' &&
    !imageFailed

  if (hasImage) {
    return (
      <img
        src={src}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        loading="lazy"
        decoding="async"
        onError={() => setImageFailed(true)}
      />
    )
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--shadow-bg-soft)] to-[var(--shadow-bg-hover)] text-[11px] font-extrabold text-[var(--shadow-text-secondary)]">
      #{rank}
    </div>
  )
}

function RankingBookCard({ item, onOpen }) {
  const { t } = useDisplayTranslation()

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex h-[120px] w-full items-center gap-3 text-left md:h-[116px]"
    >
      <div className="relative h-[120px] w-[82px] shrink-0 overflow-hidden rounded-[8px] bg-[var(--shadow-bg-soft)] shadow-sm md:h-[116px] md:w-[80px]">
        <SafeBookCover src={item.image} title={item.title || t('topNovelSection.untitledStory')} rank={item.rank} />
        <RankBadge rank={item.rank} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 whitespace-normal break-words text-[14px] font-[640] leading-[18px] text-[var(--shadow-text-primary)]">
          {item.title || t('topNovelSection.untitledStory')}
        </h3>

        <p className="mt-1 line-clamp-1 text-[11.5px] font-medium text-[var(--shadow-text-secondary)]">
          {item.genre || t('topNovelSection.rankingGenre')}
        </p>
      </div>
    </button>
  )
}

function LoadingRanking() {
  const { t } = useDisplayTranslation()

  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[20px] lg:text-[21px]">🏆</span>
            <h2 className="text-[18px] font-extrabold tracking-tight text-[var(--shadow-text-primary)] lg:text-[19px]">
              {t('topNovelSection.title')}
            </h2>
          </div>

          <div className="h-8 w-8 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
        </div>

        <div className="mb-5 flex gap-4 overflow-hidden">
          {rankingTabs.slice(0, 4).map((tab) => (
            <div key={tab.label} className="h-[34px] w-20 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
          ))}
        </div>

        <div className="flex snap-x gap-3 overflow-hidden md:grid md:max-w-[760px] md:grid-cols-2 md:gap-5">
          {Array.from({ length: 2 }).map((_, groupIndex) => (
            <div
              key={groupIndex}
              className="grid w-[56vw] max-w-[250px] shrink-0 snap-start grid-rows-3 gap-2 md:w-full md:max-w-none md:shrink md:gap-2.5"
            >
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex h-[108px] items-center gap-3 md:h-[112px]">
                  <div className="h-[116px] w-[80px] shrink-0 animate-pulse rounded-[8px] bg-[var(--shadow-bg-soft)] md:h-[116px] md:w-[80px]" />
                  <div className="min-w-0 flex-1">
                    <div className="h-4 w-4/5 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
                    <div className="mt-2 h-3 w-2/5 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function TopNovelSection({
  storyType = '',
}) {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory =
    rankingTabs.find(
      (tab) => tab.labelKey === searchParams.get('ranking')
    )?.label || rankingTabs[0].label
  const [realDataByCategory, setRealDataByCategory] =
    useState({})
  const [loading, setLoading] = useState(true)

  const normalizedStoryType = String(storyType || '')
    .trim()
    .toLowerCase()

  const activeDataKey = `${normalizedStoryType || 'all'}::${activeCategory}`

  useEffect(() => {
    let ignore = false

  async function loadActiveRankingTab() {
    if (
      Object.prototype.hasOwnProperty.call(
        realDataByCategory,
        activeDataKey
      )
    ) {
      setLoading(false)
      return
    }

    setLoading(true)

    const tab = getActiveTabConfig(activeCategory)

    try {
      const items = await fetchRankingItems(
        tab,
        tab.label,
        normalizedStoryType,
        (cachedItems) => {
          if (ignore) return

          setRealDataByCategory((current) => ({
            ...current,
            [activeDataKey]: cachedItems,
          }))

          setLoading(false)
        }
      )

      if (!ignore) {
        setRealDataByCategory((current) => ({
          ...current,
          [activeDataKey]: items,
        }))
      }
    } catch (error) {
      console.error(
        `Ranking load error: ${activeCategory}`,
        error
      )

      if (!ignore) {
        setRealDataByCategory((current) => ({
          ...current,
          [activeDataKey]: [],
        }))
      }
    } finally {
      if (!ignore) {
        setLoading(false)
      }
    }
  }

  loadActiveRankingTab()

  return () => {
    ignore = true
  }
}, [
  activeCategory,
  activeDataKey,
  normalizedStoryType,
])
  const filteredData = useMemo(() => {
    return realDataByCategory[activeDataKey] || []
  }, [activeDataKey, realDataByCategory])

  const rankingGroups = useMemo(() => {
    const items = filteredData.slice(0, 6)

    return [
      items.slice(0, 3),
      items.slice(3, 6),
    ].filter((group) => group.length)
  }, [filteredData])

  if (loading) {
    return <LoadingRanking />
  }

  if (!rankingGroups.length) {
    return null
  }

  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[20px] lg:text-[21px]">
              🏆
            </span>

            <h2 className="text-[18px] font-extrabold tracking-tight text-[var(--shadow-text-primary)] lg:text-[19px]">
              {t('topNovelSection.title')}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigate('/ranking')}
            className="flex h-8 w-8 items-center justify-end rounded-full transition-colors hover:bg-[var(--shadow-bg-hover)]"
            aria-label={t('topNovelSection.title')}
          >
            <i className="fas fa-chevron-right text-[15px] text-[var(--shadow-text-secondary)] lg:text-[16px]" />
          </button>
        </div>

        <div className="mb-5 flex gap-4 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [touch-action:pan-x_pan-y] [&::-webkit-scrollbar]:hidden">
          {rankingTabs.map((tab) => {
            const isActive =
              activeCategory === tab.label

            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => {
                  const nextParams = new URLSearchParams(searchParams)
                  nextParams.set('ranking', tab.labelKey)
                  setSearchParams(nextParams, { replace: true })
                }}
                className={`relative inline-flex h-[34px] shrink-0 items-center px-0.5 text-[13px] leading-none transition-colors active:scale-[0.98] ${
                  isActive
                    ? 'font-extrabold text-[var(--shadow-text-primary)]'
                    : 'font-[560] text-[var(--shadow-text-secondary)]'
                }`}
              >
                {t(`topNovelSection.${tab.labelKey}`)}

                <span
                  className={`absolute bottom-0 left-1/2 h-[3px] -translate-x-1/2 rounded-full bg-[#facc15] transition-all duration-200 ${
                    isActive
                      ? 'w-[82%] opacity-100'
                      : 'w-0 opacity-0'
                  }`}
                />
              </button>
            )
          })}
        </div>

        <div className="-mr-4 flex snap-x gap-2 overflow-x-auto overscroll-x-contain pb-2 pr-4 [-ms-overflow-style:none] [scrollbar-width:none] [touch-action:pan-x_pan-y] md:mr-0 md:grid md:max-w-[760px] md:grid-cols-2 md:gap-5 md:overflow-visible md:pb-0 md:pr-0 [&::-webkit-scrollbar]:hidden">
          {rankingGroups.map(
            (group, groupIndex) => (
              <div
                key={groupIndex}
                className="grid w-[calc(100vw-106px)] max-w-[330px] shrink-0 snap-start grid-rows-3 gap-2 md:w-full md:max-w-none md:shrink md:gap-2.5"
              >
                {group.map((item) => (
                  <RankingBookCard
                    key={item.id}
                    item={item}
                    onOpen={() => {
                      if (!item.isFallback) {
                        navigate(item.link)
                      }
                    }}
                  />
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  )
}
