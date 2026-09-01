import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { addStoryLanguageParam, getStoryLanguageLabel } from '../utils/storyLanguage'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('shadowExclusiveSection', {
  en: {
    title: 'Shadow Exclusive',
    seeAll: 'See All',
    premium: 'Premium',
    untitledStory: 'Untitled Story',
    waitingApproval: 'Waiting for Approval',
    premiumSoon: 'Premium Stories Soon',
    episode: 'EP {{count}}',
    empty: 'No {{language}} exclusive stories yet',
    tryAnotherLanguage: 'Try another story language from Settings.',
  },
  km: {
    title: 'Shadow Exclusive',
    seeAll: 'មើលទាំងអស់',
    premium: 'Premium',
    untitledStory: 'រឿងគ្មានចំណងជើង',
    waitingApproval: 'កំពុងរង់ចាំការអនុម័ត',
    premiumSoon: 'រឿង Premium នឹងមកដល់ឆាប់ៗ',
    episode: 'ភាគ {{count}}',
    empty: 'មិនទាន់មានរឿង Exclusive ជាភាសា {{language}} ទេ',
    tryAnotherLanguage: 'សាកជ្រើសភាសារឿងផ្សេងពី Settings។',
  },
  zh: {
    title: 'Shadow 独家',
    seeAll: '查看全部',
    premium: 'Premium',
    untitledStory: '未命名故事',
    waitingApproval: '等待审核',
    premiumSoon: 'Premium 故事即将上线',
    episode: '第 {{count}} 集',
    empty: '暂无 {{language}} 独家故事',
    tryAnotherLanguage: '请在设置中尝试其他故事语言。',
  },
  ja: {
    title: 'Shadow 限定',
    seeAll: 'すべて見る',
    premium: 'Premium',
    untitledStory: '無題のストーリー',
    waitingApproval: '承認待ち',
    premiumSoon: 'Premium 作品は近日公開',
    episode: 'EP {{count}}',
    empty: '{{language}} の限定作品はまだありません',
    tryAnotherLanguage: '設定から別の作品言語をお試しください。',
  },
  ko: {
    title: 'Shadow 독점',
    seeAll: '전체 보기',
    premium: 'Premium',
    untitledStory: '제목 없는 작품',
    waitingApproval: '승인 대기 중',
    premiumSoon: 'Premium 작품이 곧 공개됩니다',
    episode: 'EP {{count}}',
    empty: '아직 {{language}} 독점 작품이 없습니다',
    tryAnotherLanguage: '설정에서 다른 작품 언어를 선택해 보세요.',
  },
})

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const fallbackSectionData = [
  {
    id: 'exclusive-empty-1',
    titleKey: 'title',
    image: '/assets/Must Read pic/Must Read 1.jpg',
    genre: '',
    genreColor: 'amber',
    episodeCount: 0,
    link: '/shadow-exclusive',
  },
  {
    id: 'exclusive-empty-2',
    titleKey: 'waitingApproval',
    image: '/assets/Must Read pic/Must Read 2.jpg',
    genre: '',
    genreColor: 'amber',
    episodeCount: 0,
    link: '/shadow-exclusive',
  },
  {
    id: 'exclusive-empty-3',
    titleKey: 'premiumSoon',
    image: '/assets/Must Read pic/Must Read 3.jpg',
    genre: '',
    genreColor: 'amber',
    episodeCount: 0,
    link: '/shadow-exclusive',
  },
]

function genreColorFor(genre) {
  const text = String(genre || '').toLowerCase()

  if (text.includes('fantasy') || text.includes('system') || text.includes('isekai')) return 'emerald'
  if (text.includes('romance') || text.includes('love')) return 'rose'
  if (text.includes('action') || text.includes('adventure')) return 'sky'
  if (text.includes('horror') || text.includes('thriller') || text.includes('mystery')) return 'violet'

  return 'amber'
}

function normalizeStory(story, index = 0) {
  const genre = story.main_genre || ''

  return {
    id: story.id,
    title: story.title || '',
    image: story.cover_url || `/assets/Must Read pic/Must Read ${Math.min(index + 1, 6)}.jpg`,
    genre,
    genreColor: genreColorFor(genre),
    episodeCount: Number(story.total_episodes || 0),
    link: `/story/${story.id}`,
    isAdult: Boolean(story.is_adult),
    isReal: true,
  }
}

function genreTextClass(color) {
  if (color === 'emerald') return 'text-emerald-600'
  if (color === 'rose') return 'text-pink-500'
  if (color === 'sky') return 'text-sky-500'
  if (color === 'violet') return 'text-violet-500'
  return 'text-amber-600'
}

function LoadingShadowExclusive() {
  return (
    <div className="mb-10 px-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-6 w-52 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
        <div className="h-4 w-14 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
      </div>

      <div className="grid grid-cols-3 gap-x-4 gap-y-10 md:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <div className="aspect-[2/3] animate-pulse rounded-2xl bg-[var(--shadow-bg-soft)]" />
            <div className="mt-3 h-3 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
            <div className="mt-2 h-2 w-2/3 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ShadowExclusiveSection() {
  const { t } = useDisplayTranslation()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchFailed, setFetchFailed] = useState(false)
  const [storyLanguage, setStoryLanguage] = useState(() => getStoryLanguageLabel())

  useEffect(() => {
    let ignore = false

    async function fetchExclusiveStories() {
      try {
        setLoading(true)
        setFetchFailed(false)
        setStoryLanguage(getStoryLanguageLabel())

        const response = await fetch(
          addStoryLanguageParam(`${API_BASE_URL}/api/public/shadow-exclusive/stories?limit=6&section=featured&sort=updated`)
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load Shadow Exclusive stories')
        }

        if (ignore) return

        setStories((data.stories || []).map(normalizeStory))
      } catch (error) {
        console.error('ShadowExclusiveSection fetch error:', error)

        if (!ignore) {
          setFetchFailed(true)
          setStories([])
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchExclusiveStories()

    return () => {
      ignore = true
    }
  }, [])

  const sectionData = useMemo(() => {
    if (stories.length) return stories
    return fetchFailed ? fallbackSectionData : []
  }, [fetchFailed, stories])

  if (loading) {
    return <LoadingShadowExclusive />
  }

  return (
    <div className="mb-10 px-4">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center text-[18px] font-extrabold tracking-tight text-[var(--shadow-text-primary)] lg:text-[19px]">
          <img
            src="https://img.icons8.com/emoji/48/crown-emoji.png"
            className="mr-2 h-5 w-5 lg:h-[21px] lg:w-[21px]"
            alt="crown"
          />
          {t('shadowExclusiveSection.title')}
        </h3>

        <Link
          to="/shadow-exclusive"
          className="text-[11px] font-black uppercase tracking-widest text-amber-700 transition-all hover:text-amber-800 hover:underline"
        >
          {t('shadowExclusiveSection.seeAll')}
        </Link>
      </div>

      {sectionData.length ? (
        <div className="grid grid-cols-3 gap-x-4 gap-y-10 md:grid-cols-6">
          {sectionData.map((item) => {
            const title = item.title || (
              item.titleKey
                ? t(`shadowExclusiveSection.${item.titleKey}`)
                : t('shadowExclusiveSection.untitledStory')
            )
            const genre = item.genre || t('shadowExclusiveSection.premium')

            return (
              <Link
                to={item.link || `/story/${item.id}`}
                key={item.id}
                className="group flex cursor-pointer flex-col"
              >
                <div className="relative mb-3 aspect-[2/3] overflow-hidden rounded-2xl border border-amber-200/70 bg-[var(--shadow-bg-surface)] shadow-[0_8px_24px_rgba(212,175,55,0.18)] transition-all duration-500 group-hover:shadow-[0_12px_30px_rgba(212,175,55,0.28)]">
                  <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl ring-1 ring-inset ring-amber-300/80" />

                  <img
                    src={item.image}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={title}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.src = '/assets/Must Read pic/Must Read 1.jpg'
                    }}
                  />

                  <div className="absolute right-2 top-2 z-20 rounded-full border border-amber-100 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 px-2.5 py-1 text-[7px] font-black uppercase tracking-[0.16em] text-amber-950 shadow-[0_6px_18px_rgba(212,175,55,0.35)]">
                    {t('shadowExclusiveSection.premium')}
                  </div>

                  {item.isAdult ? (
                    <div className="absolute bottom-2 left-2 z-20 rounded-full bg-[#fff1f1] px-2.5 py-1 text-[9px] font-extrabold text-[#e5484d]">
                      18+
                    </div>
                  ) : null}

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />
                </div>

                <div className="px-0.5">
                  <h4 className="mb-1 overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-extrabold leading-tight text-[var(--shadow-text-primary)] transition-colors group-hover:text-amber-700">
                    {title}
                  </h4>

                  <div className="flex items-center gap-2 text-[9px] font-semibold">
                    <span className={genreTextClass(item.genreColor)}>
                      {genre}
                    </span>

                    <span className="text-[var(--shadow-text-tertiary)]">•</span>

                    <span className="text-[var(--shadow-text-secondary)]">
                      {t('shadowExclusiveSection.episode', {
                        count: item.episodeCount,
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="rounded-[22px] bg-[var(--shadow-bg-soft)] px-4 py-6 text-center ring-1 ring-[var(--shadow-border)]">
          <div className="text-[14px] font-extrabold text-[var(--shadow-text-primary)]">
            {t('shadowExclusiveSection.empty', {
              language: storyLanguage,
            })}
          </div>
          <div className="mt-1 text-[12px] text-[var(--shadow-text-secondary)]">
            {t('shadowExclusiveSection.tryAnotherLanguage')}
          </div>
        </div>
      )}
    </div>
  )
}
