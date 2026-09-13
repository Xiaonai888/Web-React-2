import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { addStoryLanguageParam, getStoryLanguageId } from '../../utils/storyLanguage'
import { getHomeCacheKey, loadHomeCache, saveHomeCache } from '../../utils/homeDataCache'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('genreStoriesPage', {
  en: {
    latest: 'Latest',
    updates: 'Updates',
    completed: 'Completed',
    back: 'Back',
    retry: 'Retry',
    failedLoadStories: 'Failed to load stories',
    cannotConnect: 'Cannot connect to server.',
    completedBadge: 'COMPLETED',
    noCompletedStories: 'No completed {{genre}} stories yet.',
    noUpdates: 'No {{genre}} updates yet.',
    noStories: 'No {{genre}} stories yet.',
    episodeOne: '{{count}} Episode',
    episodesMany: '{{count}} Episodes',
    upToEpisode: 'Up to Ep. {{count}}',
    updating: 'Updating',
    untitledStory: 'Untitled Story',
    pageTitle: '{{genre}} · {{tab}}',
    romance: 'Romance',
    fantasy: 'Fantasy',
    action: 'Action',
    adventure: 'Adventure',
    comedy: 'Comedy',
    drama: 'Drama',
    schoolLife: 'School Life',
    historical: 'Historical',
    mystery: 'Mystery',
    horror: 'Horror',
    thriller: 'Thriller',
    sciFi: 'Sci-Fi',
    system: 'System',
    isekai: 'Isekai',
    supernatural: 'Supernatural',
    martialArts: 'Martial Arts',
    revenge: 'Revenge',
    ceo: 'CEO',
    slowBurn: 'Slow Burn',
    enemiesToLovers: 'Enemies to Lovers',
    timeTravel: 'Time Travel',
    strongFemaleLead: 'Strong Female Lead',
    hiddenIdentity: 'Hidden Identity',
    royalty: 'Royalty',
    magic: 'Magic',
    secondChance: 'Second Chance',
    coldMaleLead: 'Cold Male Lead',
    bl: 'BL',
    gl: 'GL',
    lgbtq: 'LGBTQ+',
  },
  km: {
    latest: 'ថ្មីបំផុត',
    updates: 'អាប់ដេត',
    completed: 'បានបញ្ចប់',
    back: 'ត្រឡប់ក្រោយ',
    retry: 'សាកម្តងទៀត',
    failedLoadStories: 'មិនអាចផ្ទុករឿងបានទេ',
    cannotConnect: 'មិនអាចភ្ជាប់ទៅម៉ាស៊ីនមេបានទេ។',
    completedBadge: 'បានបញ្ចប់',
    noCompletedStories: 'មិនទាន់មានរឿង {{genre}} ដែលបានបញ្ចប់ទេ។',
    noUpdates: 'មិនទាន់មាន Update សម្រាប់ {{genre}} ទេ។',
    noStories: 'មិនទាន់មានរឿង {{genre}} ទេ។',
    episodeOne: '{{count}} ភាគ',
    episodesMany: '{{count}} ភាគ',
    upToEpisode: 'ដល់ភាគ {{count}}',
    updating: 'កំពុង Update',
    untitledStory: 'រឿងគ្មានចំណងជើង',
    pageTitle: '{{genre}} · {{tab}}',
    romance: 'មនោសញ្ចេតនា',
    fantasy: 'Fantasy',
    action: 'សកម្មភាព',
    adventure: 'ផ្សងព្រេង',
    comedy: 'កំប្លែង',
    drama: 'Drama',
    schoolLife: 'ជីវិតសាលារៀន',
    historical: 'ប្រវត្តិសាស្ត្រ',
    mystery: 'អាថ៌កំបាំង',
    horror: 'រន្ធត់',
    thriller: 'Thriller',
    sciFi: 'វិទ្យាសាស្ត្រប្រឌិត',
    system: 'System',
    isekai: 'Isekai',
    supernatural: 'អរូបី',
    martialArts: 'ក្បាច់គុន',
    revenge: 'សងសឹក',
    ceo: 'CEO',
    slowBurn: 'ស្នេហាយឺតៗ',
    enemiesToLovers: 'ពីសត្រូវទៅជាគូស្នេហ៍',
    timeTravel: 'ឆ្លងពេលវេលា',
    strongFemaleLead: 'តួស្រីខ្លាំង',
    hiddenIdentity: 'អត្តសញ្ញាណលាក់បាំង',
    royalty: 'រាជវង្ស',
    magic: 'វេទមន្ត',
    secondChance: 'ឱកាសទីពីរ',
    coldMaleLead: 'តួប្រុសត្រជាក់',
    bl: 'BL',
    gl: 'GL',
    lgbtq: 'LGBTQ+',
  },
  zh: {
    latest: '最新',
    updates: '更新',
    completed: '已完结',
    back: '返回',
    retry: '重试',
    failedLoadStories: '无法加载故事',
    cannotConnect: '无法连接服务器。',
    completedBadge: '已完结',
    noCompletedStories: '暂无已完结的 {{genre}} 故事。',
    noUpdates: '暂无 {{genre}} 更新。',
    noStories: '暂无 {{genre}} 故事。',
    episodeOne: '{{count}} 章',
    episodesMany: '{{count}} 章',
    upToEpisode: '更新至第 {{count}} 章',
    updating: '连载中',
    untitledStory: '无标题故事',
    pageTitle: '{{genre}} · {{tab}}',
    romance: '爱情',
    fantasy: '奇幻',
    action: '动作',
    adventure: '冒险',
    comedy: '喜剧',
    drama: '剧情',
    schoolLife: '校园生活',
    historical: '历史',
    mystery: '悬疑',
    horror: '恐怖',
    thriller: '惊悚',
    sciFi: '科幻',
    system: '系统',
    isekai: '异世界',
    supernatural: '超自然',
    martialArts: '武侠',
    revenge: '复仇',
    ceo: 'CEO',
    slowBurn: '慢热',
    enemiesToLovers: '欢喜冤家',
    timeTravel: '时间旅行',
    strongFemaleLead: '强势女主',
    hiddenIdentity: '隐藏身份',
    royalty: '王室',
    magic: '魔法',
    secondChance: '第二次机会',
    coldMaleLead: '高冷男主',
    bl: 'BL',
    gl: 'GL',
    lgbtq: 'LGBTQ+',
  },
  ja: {
    latest: '最新',
    updates: '更新',
    completed: '完結',
    back: '戻る',
    retry: '再試行',
    failedLoadStories: 'ストーリーを読み込めませんでした',
    cannotConnect: 'サーバーに接続できません。',
    completedBadge: '完結',
    noCompletedStories: '完結済みの {{genre}} ストーリーはまだありません。',
    noUpdates: '{{genre}} の更新はまだありません。',
    noStories: '{{genre}} のストーリーはまだありません。',
    episodeOne: '{{count}} エピソード',
    episodesMany: '{{count}} エピソード',
    upToEpisode: '第 {{count}} 話まで',
    updating: '連載中',
    untitledStory: '無題のストーリー',
    pageTitle: '{{genre}} · {{tab}}',
    romance: 'ロマンス',
    fantasy: 'ファンタジー',
    action: 'アクション',
    adventure: '冒険',
    comedy: 'コメディ',
    drama: 'ドラマ',
    schoolLife: '学園生活',
    historical: '歴史',
    mystery: 'ミステリー',
    horror: 'ホラー',
    thriller: 'スリラー',
    sciFi: 'SF',
    system: 'システム',
    isekai: '異世界',
    supernatural: '超自然',
    martialArts: '武術',
    revenge: '復讐',
    ceo: 'CEO',
    slowBurn: 'スローバーン',
    enemiesToLovers: '敵から恋人へ',
    timeTravel: 'タイムトラベル',
    strongFemaleLead: '強い女性主人公',
    hiddenIdentity: '隠された正体',
    royalty: '王族',
    magic: '魔法',
    secondChance: 'セカンドチャンス',
    coldMaleLead: 'クールな男性主人公',
    bl: 'BL',
    gl: 'GL',
    lgbtq: 'LGBTQ+',
  },
  ko: {
    latest: '최신',
    updates: '업데이트',
    completed: '완결',
    back: '뒤로 가기',
    retry: '다시 시도',
    failedLoadStories: '스토리를 불러오지 못했습니다',
    cannotConnect: '서버에 연결할 수 없습니다.',
    completedBadge: '완결',
    noCompletedStories: '완결된 {{genre}} 스토리가 아직 없습니다.',
    noUpdates: '{{genre}} 업데이트가 아직 없습니다.',
    noStories: '{{genre}} 스토리가 아직 없습니다.',
    episodeOne: '{{count}}화',
    episodesMany: '{{count}}화',
    upToEpisode: '{{count}}화까지',
    updating: '연재 중',
    untitledStory: '제목 없는 스토리',
    pageTitle: '{{genre}} · {{tab}}',
    romance: '로맨스',
    fantasy: '판타지',
    action: '액션',
    adventure: '모험',
    comedy: '코미디',
    drama: '드라마',
    schoolLife: '학교생활',
    historical: '역사',
    mystery: '미스터리',
    horror: '호러',
    thriller: '스릴러',
    sciFi: 'SF',
    system: '시스템',
    isekai: '이세계',
    supernatural: '초자연',
    martialArts: '무협',
    revenge: '복수',
    ceo: 'CEO',
    slowBurn: '슬로우 번',
    enemiesToLovers: '적에서 연인으로',
    timeTravel: '시간 여행',
    strongFemaleLead: '강한 여주인공',
    hiddenIdentity: '숨겨진 정체',
    royalty: '왕족',
    magic: '마법',
    secondChance: '두 번째 기회',
    coldMaleLead: '차가운 남주인공',
    bl: 'BL',
    gl: 'GL',
    lgbtq: 'LGBTQ+',
  },
})

const GENRE_LABEL_KEYS = {
  romance: 'romance',
  fantasy: 'fantasy',
  action: 'action',
  adventure: 'adventure',
  comedy: 'comedy',
  drama: 'drama',
  'school-life': 'schoolLife',
  historical: 'historical',
  mystery: 'mystery',
  horror: 'horror',
  thriller: 'thriller',
  'sci-fi': 'sciFi',
  scifi: 'sciFi',
  system: 'system',
  isekai: 'isekai',
  supernatural: 'supernatural',
  'martial-arts': 'martialArts',
  revenge: 'revenge',
  ceo: 'ceo',
  'slow-burn': 'slowBurn',
  'enemies-to-lovers': 'enemiesToLovers',
  'time-travel': 'timeTravel',
  'strong-female-lead': 'strongFemaleLead',
  'hidden-identity': 'hiddenIdentity',
  royalty: 'royalty',
  magic: 'magic',
  'second-chance': 'secondChance',
  'cold-male-lead': 'coldMaleLead',
  bl: 'bl',
  gl: 'gl',
  lgbtq: 'lgbtq',
  'lgbtq-plus': 'lgbtq',
}

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://shadow-backend-kucw.onrender.com'
const GENRE_STORIES_CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000

const TAB_CONFIG = {
  latest: {
    labelKey: 'latest',
  },
  updates: {
    labelKey: 'updates',
  },
  completed: {
    labelKey: 'completed',
  },
}

const FALLBACK_GENRE_NAMES = {
  bl: 'BL',
  ceo: 'CEO',
  gl: 'GL',
  lgbtq: 'LGBTQ+',
  'lgbtq-plus': 'LGBTQ+',
  'sci-fi': 'Sci-Fi',
  scifi: 'Sci-Fi',
}

function toSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\+/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function formatGenreName(value) {
  const slug = toSlug(value)

  if (FALLBACK_GENRE_NAMES[slug]) {
    return FALLBACK_GENRE_NAMES[slug]
  }

  return slug
    .split('-')
    .filter(Boolean)
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join(' ')
}

function getGenreDisplayName(slug, fallbackName, t) {
  const key = GENRE_LABEL_KEYS[slug]
  return key ? t(`genreStoriesPage.${key}`) : fallbackName
}

function formatDisplayNumber(value) {
  return new Intl.NumberFormat(
    getDisplayLanguageId()
  ).format(Number(value || 0))
}

function getStoryTitle(story, t) {
  if (!story?.title || story.title === 'Untitled Story') {
    return t('genreStoriesPage.untitledStory')
  }

  return story.title
}

function getTime(value) {
  const time = new Date(value || 0).getTime()
  return Number.isFinite(time) ? time : 0
}

function isCompletedStory(story) {
  return (
    Boolean(story?.is_completed) ||
    String(story?.story_status || story?.status || '')
      .trim()
      .toLowerCase() === 'completed'
  )
}

function getStoryGenreValues(story) {
  return [
    story?.main_genre,
    story?.genre,
    story?.category,
    story?.genre_slug,
    story?.category_slug,
    ...(Array.isArray(story?.genres)
      ? story.genres
      : []),
    ...(Array.isArray(story?.tags)
      ? story.tags
      : []),
  ]
}

function matchesGenre(story, aliases) {
  return getStoryGenreValues(story).some((value) =>
    aliases.has(toSlug(value))
  )
}

function normalizeStory(story) {
  return {
    id: story.id || story.story_id,
    title: story.title || 'Untitled Story',
    cover:
      story.cover_url ||
      story.coverUrl ||
      story.image_url ||
      '',
    totalEpisodes: Number(
      story.total_episodes ||
        story.episodes_count ||
        story.episode_count ||
        0
    ),
    createdAt: story.created_at || '',
    updatedAt:
      story.updated_at ||
      story.published_at ||
      story.created_at ||
      '',
    completed: isCompletedStory(story),
  }
}

function deduplicateStories(stories) {
  const seen = new Set()

  return stories.filter((story) => {
    const key = String(story?.id || story?.story_id || '')

    if (!key || seen.has(key)) return false

    seen.add(key)
    return true
  })
}

async function requestStories(url) {
  const response = await fetch(url)
  const data = await response
    .json()
    .catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(
      data.message || getDisplayText('genreStoriesPage.failedLoadStories')
    )
  }

  return (
    data.stories ||
    data.items ||
    data.results ||
    []
  )
}

function StoryCover({ story, completed }) {
  const { t } = useDisplayTranslation()
  const title = getStoryTitle(story, t)

  return (
    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[8px] bg-[var(--shadow-bg-soft)]">
      {story.cover ? (
        <img
          src={story.cover}
          alt={title}
          draggable={false}
          onDragStart={(event) =>
            event.preventDefault()
          }
          className="h-full w-full select-none object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[#d6336c]">
          <i className="fa-solid fa-book-open text-[30px]" />
        </div>
      )}

      {completed ? (
        <span className="absolute bottom-2 right-2 rounded-[4px] bg-black/75 px-2 py-1 text-[9px] font-bold leading-none text-white">
          {t('genreStoriesPage.completedBadge')}
        </span>
      ) : null}
    </div>
  )
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-5 px-4 pt-5 md:grid-cols-4 lg:grid-cols-6">
      {Array.from({ length: 12 }).map(
        (_, index) => (
          <div key={index}>
            <div className="aspect-[2/3] animate-pulse rounded-[8px] bg-[var(--shadow-bg-elevated)]" />
            <div className="mt-2 h-[38px] animate-pulse rounded-[6px] bg-[var(--shadow-bg-elevated)]" />
            <div className="mt-1 h-3 w-2/3 animate-pulse rounded-full bg-[var(--shadow-bg-elevated)]" />
          </div>
        )
      )}
    </div>
  )
}

export default function GenreStoriesPage({
  tab = 'latest',
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const { genreSlug = '' } = useParams()
  const activeTab = TAB_CONFIG[tab]
    ? tab
    : 'latest'
  const tabConfig = TAB_CONFIG[activeTab]
  const normalizedGenreSlug = toSlug(genreSlug)
  const fallbackGenreName = formatGenreName(
    normalizedGenreSlug
  )
  const [genreName, setGenreName] =
    useState(fallbackGenreName)
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

    useEffect(() => {
  const controller = new AbortController()
  let ignore = false

  async function loadStories() {
    const cacheKey = getHomeCacheKey({
      section: 'stories',
      language: getStoryLanguageId(),
      params: {
        page: 'genre-stories',
        genre: normalizedGenreSlug,
        sort: 'latest',
        limit: 100,
        schema: 1,
      },
    })

    let hasCachedStories = false

    if (reloadKey === 0) {
      const cached = await loadHomeCache(cacheKey, {
        maxAgeMs: GENRE_STORIES_CACHE_MAX_AGE_MS,
        allowExpired: true,
      })

      if (ignore || controller.signal.aborted) return

      hasCachedStories = Array.isArray(cached?.data)

      if (hasCachedStories) {
        setGenreName(fallbackGenreName)
        setStories(cached.data)
        setLoading(false)
        setMessage('')
      }

      if (cached?.isFresh && hasCachedStories) {
        return
      }
    }

    try {
      if (!hasCachedStories) {
        setLoading(true)
      }

      setMessage('')
      setGenreName(fallbackGenreName)

      const response = await fetch(
        addStoryLanguageParam(
          `${API_URL}/api/public/stories?genre=${encodeURIComponent(
            fallbackGenreName
          )}&limit=100&sort=latest`
        ),
        { signal: controller.signal }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message || getDisplayText('genreStoriesPage.failedLoadStories')
        )
      }

      const nextStories = deduplicateStories(
        Array.isArray(data.stories) ? data.stories : []
      ).map(normalizeStory)

      if (ignore || controller.signal.aborted) return

      setStories(nextStories)

      await saveHomeCache(cacheKey, nextStories, {
        maxAgeMs: GENRE_STORIES_CACHE_MAX_AGE_MS,
      })
    } catch (error) {
      if (error?.name === 'AbortError') return

      if (!ignore && !hasCachedStories) {
        setStories([])
        setMessage(
          error.message === 'Failed to fetch'
            ? getDisplayText('genreStoriesPage.cannotConnect')
            : error.message ||
              getDisplayText('genreStoriesPage.failedLoadStories')
        )
      }
    } finally {
      if (!ignore && !controller.signal.aborted) {
        setLoading(false)
      }
    }
  }

  loadStories()

  return () => {
    ignore = true
    controller.abort()
  }
}, [
  fallbackGenreName,
  normalizedGenreSlug,
  reloadKey,
])


  const visibleStories = useMemo(() => {
    const filtered =
      activeTab === 'completed'
        ? stories.filter(
            (story) => story.completed
          )
        : stories

    const dateKey =
      activeTab === 'latest'
        ? 'createdAt'
        : 'updatedAt'

    return [...filtered].sort(
      (first, second) =>
        getTime(second[dateKey]) -
        getTime(first[dateKey])
    )
  }, [activeTab, stories])

  const genreReturnPath =
    location.state?.returnTo ||
    `/?genre=${encodeURIComponent(
      normalizedGenreSlug
    )}`

  const displayGenreName = getGenreDisplayName(
    normalizedGenreSlug,
    genreName,
    t
  )
  const tabLabel = t(
    `genreStoriesPage.${tabConfig.labelKey}`
  )
  const emptyText =
    activeTab === 'completed'
      ? t('genreStoriesPage.noCompletedStories', {
          genre: displayGenreName,
        })
      : activeTab === 'updates'
        ? t('genreStoriesPage.noUpdates', {
            genre: displayGenreName,
          })
        : t('genreStoriesPage.noStories', {
            genre: displayGenreName,
          })

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-8">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] shadow-sm">
        <div className="mx-auto flex h-[58px] max-w-5xl items-center px-4">
          <button
            type="button"
            onClick={() =>
              navigate(genreReturnPath)
            }
            className="flex h-10 w-10 shrink-0 items-center justify-start text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={t('genreStoriesPage.back')}
          >
            <i className="fa-solid fa-arrow-left text-[21px]" />
          </button>

          <h1 className="ml-1 text-[20px] font-[650] text-[var(--shadow-text-primary)]">
            {t('genreStoriesPage.pageTitle', {
              genre: displayGenreName,
              tab: tabLabel,
            })}
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl">
        {loading ? <LoadingGrid /> : null}

        {!loading && message ? (
          <div className="mx-4 mt-5 rounded-[16px] bg-[var(--shadow-bg-soft)] px-5 py-9 text-center">
            <p className="text-[13px] font-medium text-[var(--shadow-danger)]">
              {message}
            </p>

            <button
              type="button"
              onClick={() =>
                setReloadKey(
                  (current) => current + 1
                )
              }
              className="mt-4 rounded-full bg-[var(--shadow-text-primary)] px-5 py-2.5 text-[13px] font-bold text-[var(--shadow-bg-surface)] active:scale-95"
            >
              {t('genreStoriesPage.retry')}
            </button>
          </div>
        ) : null}

        {!loading &&
        !message &&
        visibleStories.length === 0 ? (
          <div className="px-5 py-16 text-center text-[14px] text-[var(--shadow-text-tertiary)]">
            {emptyText}
          </div>
        ) : null}

        {!loading &&
        !message &&
        visibleStories.length > 0 ? (
          <div className="grid auto-rows-fr grid-cols-2 gap-x-2 gap-y-5 px-4 pt-5 md:grid-cols-4 lg:grid-cols-6">
            {visibleStories.map((story) => (
              <button
                key={story.id}
                type="button"
                onClick={() =>
                  navigate(
                    `/story/${story.id}`,
                    {
                      state: {
                        returnTo:
                          location.pathname,
                      },
                    }
                  )
                }
                className="flex h-full min-w-0 flex-col text-left active:scale-[0.99]"
              >
                <StoryCover
                  story={story}
                  completed={
                    activeTab === 'completed'
                  }
                />

                <h2 className="mt-2 h-[38px] line-clamp-2 text-[14px] font-[600] leading-[19px] text-[var(--shadow-text-primary)]">
                  {getStoryTitle(story, t)}
                </h2>

                <p className="mt-1 text-[12px] font-normal text-[var(--shadow-text-tertiary)]">
                  {activeTab === 'completed'
                    ? t(
                        story.totalEpisodes === 1
                          ? 'genreStoriesPage.episodeOne'
                          : 'genreStoriesPage.episodesMany',
                        {
                          count: formatDisplayNumber(
                            story.totalEpisodes
                          ),
                        }
                      )
                    : story.totalEpisodes > 0
                      ? t('genreStoriesPage.upToEpisode', {
                          count: formatDisplayNumber(
                            story.totalEpisodes
                          ),
                        })
                      : t('genreStoriesPage.updating')}
                </p>
              </button>
            ))}
          </div>
        ) : null}
      </main>
    </div>
  )
}
