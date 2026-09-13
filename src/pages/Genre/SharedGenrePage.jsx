import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addStoryLanguageParam, getStoryLanguageId } from '../../utils/storyLanguage'
import { getHomeCacheKey, loadHomeCache, saveHomeCache } from '../../utils/homeDataCache'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('sharedGenrePage', {
  en: {
    back: 'Back',
    search: 'Search',
    genreStoriesUpdates: '{{genre}} stories and new updates',
    latest: 'Latest',
    updates: 'Updates',
    completed: 'Completed',
    failedLoadGenres: 'Failed to load genres',
    failedLoadStories: 'Failed to load stories',
    cannotConnect: 'Cannot connect to server.',
    updating: 'Updating',
    episodes: '{{count}} Episodes',
    upToEpisode: 'Up to Ep {{count}}',
    untitledStory: 'Untitled Story',
    topGenre: 'Top {{genre}}',
    trendingGenre: 'Trending {{genre}}',
    latestGenre: 'Latest {{genre}}',
    allGenre: 'All {{genre}}',
    noStoriesFound: 'No stories found',
    storiesWillAppear: '{{genre}} stories will appear here after publishing.',
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
    back: 'ត្រឡប់ក្រោយ',
    search: 'ស្វែងរក',
    genreStoriesUpdates: 'រឿង {{genre}} និង Update ថ្មីៗ',
    latest: 'ថ្មីបំផុត',
    updates: 'អាប់ដេត',
    completed: 'បានបញ្ចប់',
    failedLoadGenres: 'មិនអាចផ្ទុកប្រភេទរឿងបានទេ',
    failedLoadStories: 'មិនអាចផ្ទុករឿងបានទេ',
    cannotConnect: 'មិនអាចភ្ជាប់ទៅម៉ាស៊ីនមេបានទេ។',
    updating: 'កំពុង Update',
    episodes: '{{count}} ភាគ',
    upToEpisode: 'ដល់ភាគ {{count}}',
    untitledStory: 'រឿងគ្មានចំណងជើង',
    topGenre: '{{genre}} កំពូល',
    trendingGenre: '{{genre}} កំពុងពេញនិយម',
    latestGenre: '{{genre}} ថ្មីបំផុត',
    allGenre: '{{genre}} ទាំងអស់',
    noStoriesFound: 'រកមិនឃើញរឿង',
    storiesWillAppear: 'រឿង {{genre}} នឹងបង្ហាញនៅទីនេះបន្ទាប់ពីបានបោះពុម្ព។',
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
    back: '返回',
    search: '搜索',
    genreStoriesUpdates: '{{genre}} 故事与最新更新',
    latest: '最新',
    updates: '更新',
    completed: '已完结',
    failedLoadGenres: '无法加载类型',
    failedLoadStories: '无法加载故事',
    cannotConnect: '无法连接服务器。',
    updating: '连载中',
    episodes: '{{count}} 章',
    upToEpisode: '更新至第 {{count}} 章',
    untitledStory: '无标题故事',
    topGenre: '热门 {{genre}}',
    trendingGenre: '趋势 {{genre}}',
    latestGenre: '最新 {{genre}}',
    allGenre: '全部 {{genre}}',
    noStoriesFound: '未找到故事',
    storiesWillAppear: '发布后，{{genre}} 故事会显示在这里。',
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
    back: '戻る',
    search: '検索',
    genreStoriesUpdates: '{{genre}} のストーリーと最新更新',
    latest: '最新',
    updates: '更新',
    completed: '完結',
    failedLoadGenres: 'ジャンルを読み込めませんでした',
    failedLoadStories: 'ストーリーを読み込めませんでした',
    cannotConnect: 'サーバーに接続できません。',
    updating: '連載中',
    episodes: '{{count}} エピソード',
    upToEpisode: '第 {{count}} 話まで',
    untitledStory: '無題のストーリー',
    topGenre: '人気の {{genre}}',
    trendingGenre: 'トレンドの {{genre}}',
    latestGenre: '最新の {{genre}}',
    allGenre: 'すべての {{genre}}',
    noStoriesFound: 'ストーリーが見つかりません',
    storiesWillAppear: '公開後、{{genre}} のストーリーがここに表示されます。',
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
    back: '뒤로 가기',
    search: '검색',
    genreStoriesUpdates: '{{genre}} 스토리 및 최신 업데이트',
    latest: '최신',
    updates: '업데이트',
    completed: '완결',
    failedLoadGenres: '장르를 불러오지 못했습니다',
    failedLoadStories: '스토리를 불러오지 못했습니다',
    cannotConnect: '서버에 연결할 수 없습니다.',
    updating: '연재 중',
    episodes: '{{count}}화',
    upToEpisode: '{{count}}화까지',
    untitledStory: '제목 없는 스토리',
    topGenre: '인기 {{genre}}',
    trendingGenre: '트렌드 {{genre}}',
    latestGenre: '최신 {{genre}}',
    allGenre: '모든 {{genre}}',
    noStoriesFound: '스토리를 찾을 수 없습니다',
    storiesWillAppear: '게시된 {{genre}} 스토리가 여기에 표시됩니다.',
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

const API_URL = import.meta.env.VITE_API_URL || 'https://shadow-backend-kucw.onrender.com'
const SHARED_GENRE_CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000

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
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function getGenreDisplayName(slug, fallbackName, t) {
  const key = GENRE_LABEL_KEYS[slug]
  return key ? t(`sharedGenrePage.${key}`) : fallbackName
}

function getStoryTitle(story, t) {
  if (!story?.title || story.title === 'Untitled Story') {
    return t('sharedGenrePage.untitledStory')
  }

  return story.title
}

function normalizeStory(item) {
  const status = item.story_status || item.status || ''
  const totalEpisodes = Number(
    item.total_episodes || item.episodes_count || item.episode_count || 0
  )

  return {
    id: item.id || item.story_id,
    title: item.title || 'Untitled Story',
    description: item.description || item.summary || item.synopsis || '',
    cover: item.cover_url || item.coverUrl || item.image_url || '',
    landscape:
      item.landscape_thumbnail_url ||
      item.banner_url ||
      item.thumbnail_url ||
      item.cover_url ||
      '',
    status,
    tags: Array.isArray(item.tags) ? item.tags : [],
    views: Number(item.views || item.total_views || item.view_count || 0),
    likes: Number(item.likes || item.total_likes || item.like_count || 0),
    rating: Number(item.rating || item.average_rating || item.avg_rating || 0),
    totalEpisodes,
    isCompleted:
      Boolean(item.is_completed) ||
      String(status).trim().toLowerCase().includes('complete'),
    createdAt: item.created_at || '',
    updatedAt: item.updated_at || item.published_at || item.created_at || '',
  }
}

function getStoryGenreValues(item) {
  return [
    item.genre,
    item.category,
    item.main_genre,
    item.genre_slug,
    item.category_slug,
    ...(Array.isArray(item.genres) ? item.genres : []),
    ...(Array.isArray(item.tags) ? item.tags : []),
  ]
}

function matchesGenre(item, aliases) {
  return getStoryGenreValues(item).some((value) =>
    aliases.has(toSlug(value))
  )
}

function deduplicateStories(items) {
  const seen = new Set()

  return items.filter((item) => {
    const key = String(item?.id || item?.story_id || '')

    if (!key || seen.has(key)) return false

    seen.add(key)
    return true
  })
}

async function requestStories(url) {
  const response = await fetch(url)
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || getDisplayText('sharedGenrePage.failedLoadStories'))
  }

  return data.stories || data.items || data.results || []
}

function getTime(value) {
  const time = new Date(value || 0).getTime()
  return Number.isFinite(time) ? time : 0
}

function getStoryScore(story) {
  return story.views + story.likes * 4 + story.rating * 25 + story.totalEpisodes
}

function getTrendingScore(story) {
  const ageDays = Math.max(
    1,
    (Date.now() - getTime(story.updatedAt)) / 86400000
  )
  const recencyBoost = Math.max(0, 30 - ageDays) * 12

  return story.views + story.likes * 5 + recencyBoost
}

function sortByLatest(list) {
  return [...list].sort(
    (first, second) => getTime(second.updatedAt) - getTime(first.updatedAt)
  )
}

function sortByTop(list) {
  return [...list].sort(
    (first, second) => getStoryScore(second) - getStoryScore(first)
  )
}

function sortByTrending(list) {
  return [...list].sort(
    (first, second) => getTrendingScore(second) - getTrendingScore(first)
  )
}

function formatNumber(value) {
  const number = Number(value || 0)

  return new Intl.NumberFormat(
    getDisplayLanguageId(),
    {
      notation: 'compact',
      maximumFractionDigits: 1,
    }
  ).format(Number.isFinite(number) ? number : 0)
}

function FireSolidIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 22c4.4 0 8-3.1 8-8 0-2.1-.8-4.1-2-5.5 0 2.5-1.5 4-3 4.5.5-4-2-8-6-11 0 3.5-2 5.5-3.5 7C4 10.5 4 12.5 4 14c0 4.9 3.6 8 8 8Z" />
      <path d="M9.5 17.5c0 1.5 1.1 2.5 2.5 2.5s2.5-1 2.5-2.5c0-1-.5-1.9-1.3-2.6 0 1-.6 1.6-1.2 1.8.1-1.5-.8-2.8-2.1-3.8.1 1.5-.4 2.4-.4 4.6Z" />
    </svg>
  )
}

function getEpisodeLabel(story, t) {
  const count = Number(story.totalEpisodes || 0)
  const displayCount = new Intl.NumberFormat(
    getDisplayLanguageId()
  ).format(count)

  if (!count) {
    return story.isCompleted
      ? t('sharedGenrePage.completed')
      : t('sharedGenrePage.updating')
  }

  if (story.isCompleted) {
    return t('sharedGenrePage.episodes', {
      count: displayCount,
    })
  }

  return t('sharedGenrePage.upToEpisode', {
    count: displayCount,
  })
}

function getTagLine(story, genreName) {
  const genreSlug = toSlug(genreName)

  return story.tags
    .map((tag) => String(tag || '').trim())
    .filter((tag) => tag && toSlug(tag) !== genreSlug)
    .slice(0, 2)
    .join(' / ')
}

function SectionTitle({ icon, title }) {
  return (
    <div className="mb-3 grid grid-cols-[1fr_auto] items-center gap-3 px-4">
      <div className="flex min-w-0 items-center gap-1.5">
        <span className="shrink-0 text-[18px] leading-none">{icon}</span>
        <h2 className="min-w-0 truncate text-[18px] font-bold leading-6 text-[var(--shadow-text-primary)]">
          {title}
        </h2>
      </div>

      <button
        type="button"
        className="flex h-7 w-7 shrink-0 items-center justify-end text-[var(--shadow-text-primary)] active:scale-95"
      >
        <i className="fa-solid fa-chevron-right text-[13px]" />
      </button>
    </div>
  )
}

function ImageFrame({
  src,
  title,
  className,
  fallbackClassName = 'text-[#d6336c]',
}) {
  return (
    <div className={`overflow-hidden bg-[var(--shadow-bg-soft)] ${className}`}>
      {src ? (
        <img
          src={src}
          alt={title}
          draggable={false}
          onDragStart={(event) => event.preventDefault()}
          className="h-full w-full select-none object-cover transition-transform duration-300 hover:scale-[1.03]"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center ${fallbackClassName}`}
        >
          <i className="fa-solid fa-heart text-[24px]" />
        </div>
      )}
    </div>
  )
}

function TopGenreCard({ story, onOpen }) {
  const { t } = useDisplayTranslation()
  const title = getStoryTitle(story, t)

  return (
    <button
      type="button"
      onClick={() => onOpen(story)}
      className="min-w-0 text-left active:scale-[0.99]"
    >
      <ImageFrame
        src={story.landscape || story.cover}
        title={title}
        className="aspect-[1.42/1] rounded-[9px]"
      />

      <h3 className="mt-2 line-clamp-1 text-[14px] font-[640] leading-[20px] text-[var(--shadow-text-primary)]">
        {title}
      </h3>

      <p className="mt-1 text-[11.5px] font-normal leading-[17px] text-[var(--shadow-text-tertiary)]">
        {getEpisodeLabel(story, t)}
      </p>
    </button>
  )
}

function TrendingGenreCard({ story, onOpen }) {
  const { t } = useDisplayTranslation()
  const title = getStoryTitle(story, t)

  return (
    <button
      type="button"
      onClick={() => onOpen(story)}
      className="flex h-full min-w-0 flex-col text-left active:scale-[0.99]"
    >
      <ImageFrame
        src={story.cover}
        title={title}
        className="aspect-[2/3] rounded-[8px]"
      />

      <h3 className="mt-2 h-[34px] line-clamp-2 text-[12.5px] font-[640] leading-[17px] text-[var(--shadow-text-primary)] sm:text-[13px]">
        {title}
      </h3>

      <p className="mt-1 flex h-[18px] items-center gap-1 text-[11.5px] font-medium leading-none text-[var(--shadow-text-secondary)]">
        <span className="text-[#EF4444]">
          <FireSolidIcon />
        </span>

        <span>{formatNumber(story.likes)}</span>
      </p>
    </button>
  )
}

function LatestGenreCard({ story, onOpen }) {
  const { t } = useDisplayTranslation()
  const title = getStoryTitle(story, t)

  return (
    <button
      type="button"
      onClick={() => onOpen(story)}
      className="flex h-full w-[42vw] max-w-[170px] shrink-0 select-none flex-col text-left active:scale-[0.99] sm:w-[170px]"
    >
      <ImageFrame
        src={story.cover}
        title={title}
        className="aspect-[2/3] rounded-[8px]"
      />

      <h3 className="mt-2 h-[38px] line-clamp-2 text-[14px] font-[640] leading-[19px] text-[var(--shadow-text-primary)]">
        {title}
      </h3>
    </button>
  )
}

function AllGenreCard({ story, onOpen, genreName }) {
  const { t } = useDisplayTranslation()
  const title = getStoryTitle(story, t)
  const tagLine = getTagLine(story, genreName)

  return (
    <button
      type="button"
      onClick={() => onOpen(story)}
      className="min-w-0 text-left active:scale-[0.99]"
    >
      <ImageFrame
        src={story.cover}
        title={title}
        className="aspect-[2/3] rounded-[8px]"
      />

      <h3 className="mt-2 line-clamp-1 text-[14px] font-[640] leading-[20px] text-[var(--shadow-text-primary)]">
        {title}
      </h3>

      <p className="mt-1 min-h-[17px] truncate text-[11.5px] font-normal text-[var(--shadow-text-tertiary)]">
        {tagLine}
      </p>
    </button>
  )
}

function LoadingGrid() {
  return (
    <div className="space-y-7 px-4 pt-5">
      {Array.from({ length: 3 }).map((_, sectionIndex) => (
        <section key={sectionIndex}>
          <div className="mb-3 h-6 w-44 animate-pulse rounded-full bg-[var(--shadow-bg-elevated)]" />

          <div className="grid grid-cols-2 gap-x-3 gap-y-5">
            {Array.from({ length: 4 }).map((__, index) => (
              <div key={index}>
                <div className="aspect-[2/3] animate-pulse rounded-[8px] bg-[var(--shadow-bg-elevated)]" />
                <div className="mt-2 h-4 animate-pulse rounded-full bg-[var(--shadow-bg-elevated)]" />
                <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-[var(--shadow-bg-elevated)]" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default function SharedGenrePage({
  genreSlug,
  embedded = false,
}) {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const normalizedGenreSlug = toSlug(genreSlug)
  const fallbackGenreName = formatGenreName(normalizedGenreSlug)
  const [genreName, setGenreName] = useState(fallbackGenreName)
  const [stories, setStories] = useState([])
  const [genreInfo, setGenreInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const latestScrollRef = useRef(null)
  const latestDragRef = useRef({
    active: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
    blockClick: false,
  })

  useEffect(() => {
  const controller = new AbortController()
  let ignore = false

  async function loadGenrePage() {
    setMessage('')

    const genreCacheKey = getHomeCacheKey({
      section: 'genres',
      language: 'all',
      params: {
        list: 'all',
        include_inactive: true,
        schema: 1,
      },
    })

    const storiesCacheKey = getHomeCacheKey({
      section: 'stories',
      language: getStoryLanguageId(),
      params: {
        page: 'shared-genre',
        genre: normalizedGenreSlug,
        sort: 'latest',
        limit: 100,
        schema: 1,
      },
    })

    const [cachedGenreList, cachedStories] =
      await Promise.all([
        loadHomeCache(genreCacheKey, {
          maxAgeMs: SHARED_GENRE_CACHE_MAX_AGE_MS,
          allowExpired: true,
        }),
        loadHomeCache(storiesCacheKey, {
          maxAgeMs: SHARED_GENRE_CACHE_MAX_AGE_MS,
          allowExpired: true,
        }),
      ])

    if (ignore || controller.signal.aborted) return

    const cachedGenres = Array.isArray(
      cachedGenreList?.data
    )
      ? cachedGenreList.data
      : null

    const hasCachedStories = Array.isArray(
      cachedStories?.data
    )

    const cachedGenreInfo = cachedGenres?.find(
      (genre) =>
        toSlug(genre.slug) === normalizedGenreSlug ||
        toSlug(genre.name) === normalizedGenreSlug
    ) || null

    if (cachedGenreInfo) {
      setGenreInfo(cachedGenreInfo)
      setGenreName(
        cachedGenreInfo.name || fallbackGenreName
      )
    } else {
      setGenreInfo(null)
      setGenreName(fallbackGenreName)
    }

    if (hasCachedStories) {
      setStories(cachedStories.data)
      setLoading(false)
    }

    const needsGenreRefresh =
      !cachedGenreList?.isFresh || !cachedGenres

    const needsStoriesRefresh =
      !cachedStories?.isFresh || !hasCachedStories

    if (!needsGenreRefresh && !needsStoriesRefresh) {
      return
    }

    try {
      if (!hasCachedStories) {
        setLoading(true)
      }

      setMessage('')

      const genreRequest = needsGenreRefresh
        ? fetch(
            `${API_URL}/api/genres?include_inactive=true`,
            { signal: controller.signal }
          )
            .then(async (response) => {
              const data = await response
                .json()
                .catch(() => ({}))

              if (!response.ok || data.ok === false) {
                throw new Error(
                  data.message ||
                    getDisplayText('sharedGenrePage.failedLoadGenres')
                )
              }

              return Array.isArray(data.genres)
                ? data.genres
                : []
            })
        : Promise.resolve(cachedGenres || [])

      const storiesRequest = needsStoriesRefresh
  ? genreRequest.then((nextGenres) => {
      const resolvedGenreInfo =
        nextGenres.find(
          (genre) =>
            toSlug(genre.slug) === normalizedGenreSlug ||
            toSlug(genre.name) === normalizedGenreSlug
        ) ||
        cachedGenreInfo ||
        null

      const resolvedGenreName =
        resolvedGenreInfo?.name || fallbackGenreName

      return fetch(
        addStoryLanguageParam(
          `${API_URL}/api/public/stories?genre=${encodeURIComponent(
            resolvedGenreName
          )}&limit=100&sort=latest`
        ),
        { signal: controller.signal }
      ).then(async (response) => {
        const data = await response
          .json()
          .catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(
            data.message || getDisplayText('sharedGenrePage.failedLoadStories')
          )
        }

        return deduplicateStories(
          Array.isArray(data.stories)
            ? data.stories
            : []
        ).map(normalizeStory)
      })
    })
  : Promise.resolve(cachedStories.data)


      const [genreResult, storiesResult] =
        await Promise.allSettled([
          genreRequest,
          storiesRequest,
        ])

      if (ignore || controller.signal.aborted) return

      if (genreResult.status === 'fulfilled') {
        const nextGenres = genreResult.value
        const nextGenreInfo =
          nextGenres.find(
            (genre) =>
              toSlug(genre.slug) ===
                normalizedGenreSlug ||
              toSlug(genre.name) ===
                normalizedGenreSlug
          ) || null

        setGenreInfo(nextGenreInfo)
        setGenreName(
          nextGenreInfo?.name || fallbackGenreName
        )

        if (needsGenreRefresh) {
          await saveHomeCache(
            genreCacheKey,
            nextGenres,
            {
              maxAgeMs:
                SHARED_GENRE_CACHE_MAX_AGE_MS,
            }
          )
        }
      }

      if (storiesResult.status === 'fulfilled') {
        setStories(storiesResult.value)

        if (needsStoriesRefresh) {
          await saveHomeCache(
            storiesCacheKey,
            storiesResult.value,
            {
              maxAgeMs:
                SHARED_GENRE_CACHE_MAX_AGE_MS,
            }
          )
        }
      } else if (!hasCachedStories) {
        throw storiesResult.reason
      }
    } catch (error) {
      if (error?.name === 'AbortError') return

      if (!ignore && !hasCachedStories) {
        setStories([])
        setMessage(
          error.message === 'Failed to fetch'
            ? getDisplayText('sharedGenrePage.cannotConnect')
            : error.message ||
                getDisplayText('sharedGenrePage.failedLoadStories')
        )
      }
    } finally {
      if (!ignore && !controller.signal.aborted) {
        setLoading(false)
      }
    }
  }

  loadGenrePage()

  return () => {
    ignore = true
    controller.abort()
  }
}, [fallbackGenreName, normalizedGenreSlug])


  const quickButtons = useMemo(
    () => [
      {
        labelKey: 'latest',
        icon: 'fa-regular fa-calendar-plus',
        path: `/genre/${normalizedGenreSlug}/latest`,
      },
      {
        labelKey: 'updates',
        icon: 'fa-regular fa-star',
        path: `/genre/${normalizedGenreSlug}/updates`,
      },
      {
        labelKey: 'completed',
        icon: 'fa-regular fa-circle-check',
        path: `/genre/${normalizedGenreSlug}/completed`,
      },
    ],
    [normalizedGenreSlug]
  )

  const topStories = useMemo(
    () => sortByTop(stories).slice(0, 6),
    [stories]
  )
  const trendingStories = useMemo(
    () => sortByTrending(stories).slice(0, 6),
    [stories]
  )
  const latestStories = useMemo(
    () => sortByLatest(stories).slice(0, 6),
    [stories]
  )
  const allStories = useMemo(() => stories.slice(0, 20), [stories])

  const heroImage = useMemo(() => {
    const found = topStories.find(
      (story) => story.landscape || story.cover
    )

    return found?.landscape || found?.cover || ''
  }, [topStories])

  const genreDesktopImage =
    genreInfo?.banner_image_url ||
    genreInfo?.mobile_banner_image_url ||
    heroImage
  const genreMobileImage =
    genreInfo?.mobile_banner_image_url ||
    genreInfo?.banner_image_url ||
    heroImage
  const returnToPath = embedded
    ? `/?genre=${encodeURIComponent(normalizedGenreSlug)}`
    : `/genre/${normalizedGenreSlug}`
  const displayGenreName = getGenreDisplayName(
    normalizedGenreSlug,
    genreName,
    t
  )

  const openStory = (story) => {
    if (latestDragRef.current.blockClick) {
      latestDragRef.current.blockClick = false
      return
    }

    if (story?.id) {
      navigate(`/story/${story.id}`, {
        state: { returnTo: returnToPath },
      })
    }
  }

  const openTab = (path) => {
    navigate(path, {
      state: { returnTo: returnToPath },
    })
  }

  const handleLatestMouseDown = (event) => {
    if (event.button !== 0) return

    const element = latestScrollRef.current
    if (!element) return

    latestDragRef.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: element.scrollLeft,
      moved: false,
      blockClick: false,
    }
  }

  const handleLatestMouseMove = (event) => {
    const element = latestScrollRef.current
    const drag = latestDragRef.current

    if (!element || !drag.active) return

    if (event.buttons !== 1) {
      latestDragRef.current.active = false
      return
    }

    const walk = event.clientX - drag.startX

    if (Math.abs(walk) > 5) {
      latestDragRef.current.moved = true
      event.preventDefault()
    }

    element.scrollLeft = drag.scrollLeft - walk
  }

  const stopLatestDrag = () => {
    const drag = latestDragRef.current

    if (drag.active && drag.moved) {
      latestDragRef.current.blockClick = true

      window.setTimeout(() => {
        latestDragRef.current.blockClick = false
      }, 180)
    }

    latestDragRef.current.active = false
  }

  return (
    <div
      className={
        embedded
          ? 'bg-[var(--shadow-bg-page)] pb-6'
          : 'min-h-screen bg-[var(--shadow-bg-page)] pb-[110px]'
      }
    >
      {!embedded ? (
        <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95"
              aria-label={t('sharedGenrePage.back')}
            >
              <i className="fa-solid fa-chevron-left text-[13px]" />
            </button>

            <div className="min-w-0 text-center">
              <h1 className="text-[17px] font-black text-[var(--shadow-text-primary)]">
                {displayGenreName}
              </h1>

              <p className="text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">
                {t('sharedGenrePage.genreStoriesUpdates', {
                  genre: displayGenreName,
                })}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/search')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95"
              aria-label={t('sharedGenrePage.search')}
            >
              <i className="fa-solid fa-magnifying-glass text-[13px]" />
            </button>
          </div>
        </header>
      ) : null}

      <main
        className={`mx-auto max-w-5xl ${
          embedded ? 'pt-0' : 'pt-4'
        }`}
      >
        <section className="px-0 sm:px-4">
          <div className="relative aspect-[4.25/1] overflow-hidden rounded-none bg-gradient-to-r from-[#ff5eb8] to-[#ffb1d5] sm:rounded-[14px]">
            {genreDesktopImage || genreMobileImage ? (
              <picture>
                {genreMobileImage ? (
                  <source
                    media="(max-width: 639px)"
                    srcSet={genreMobileImage}
                  />
                ) : null}

                <img
                  src={genreDesktopImage || genreMobileImage}
                  alt={displayGenreName}
                  draggable={false}
                  onDragStart={(event) => event.preventDefault()}
                  className="h-full w-full select-none object-cover"
                  loading="eager"
                  decoding="async"
                />
              </picture>
            ) : (
              <div className="flex h-full w-full items-center justify-end px-5">
                <i className="fa-solid fa-heart text-[42px] text-white/85" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-[#ec4899]/45 via-transparent to-transparent" />
          </div>
        </section>

        <section className="mt-4 px-4">
          <div className="grid grid-cols-3 gap-2">
            {quickButtons.map((item) => (
              <button
                key={item.labelKey}
                type="button"
                onClick={() => openTab(item.path)}
                className="flex h-12 items-center justify-center gap-2 rounded-[11px] bg-[var(--shadow-bg-surface)] text-[13px] font-[640] text-[var(--shadow-text-primary)] shadow-sm ring-1 ring-[var(--shadow-border)] active:scale-[0.98]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-[#facc15] text-[12px] text-[#111827]">
                  <i className={item.icon} />
                </span>

                <span className="truncate">{t(`sharedGenrePage.${item.labelKey}`)}</span>
              </button>
            ))}
          </div>
        </section>

        {loading ? <LoadingGrid /> : null}

        {!loading && message ? (
          <section className="mx-4 mt-5 rounded-[18px] bg-[var(--shadow-bg-soft)] p-6 text-center">
            <div className="text-[13px] font-[640] text-[var(--shadow-danger)]">
              {message}
            </div>
          </section>
        ) : null}

        {!loading && !message ? (
          <div className="pt-7">
            <section>
              <SectionTitle
                icon="🏆"
                title={t('sharedGenrePage.topGenre', { genre: displayGenreName })}
              />

              <div className="grid grid-cols-2 gap-x-3 gap-y-5 px-4 md:grid-cols-6 md:gap-x-3">
                {topStories.map((story) => (
                  <TopGenreCard
                    key={`top-${story.id}`}
                    story={story}
                    onOpen={openStory}
                  />
                ))}
              </div>
            </section>

            <section className="mt-8">
              <SectionTitle
                icon="🔥"
                title={t('sharedGenrePage.trendingGenre', { genre: displayGenreName })}
              />

              <div className="grid grid-cols-3 items-start gap-x-2.5 gap-y-5 px-4 md:grid-cols-6 md:gap-x-3">
                {trendingStories.map((story) => (
                  <TrendingGenreCard
                    key={`trending-${story.id}`}
                    story={story}
                    onOpen={openStory}
                  />
                ))}
              </div>
            </section>

            <section className="mt-8">
              <SectionTitle
                icon="🆕"
                title={t('sharedGenrePage.latestGenre', { genre: displayGenreName })}
              />

              <div
                ref={latestScrollRef}
                onMouseDown={handleLatestMouseDown}
                onMouseMove={handleLatestMouseMove}
                onMouseUp={stopLatestDrag}
                onMouseLeave={stopLatestDrag}
                className="flex cursor-grab select-none gap-3 overflow-x-auto px-4 pb-1 active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {latestStories.map((story) => (
                  <LatestGenreCard
                    key={`latest-${story.id}`}
                    story={story}
                    onOpen={openStory}
                  />
                ))}
              </div>
            </section>

            <section className="mt-8">
              <SectionTitle
                icon="📖"
                title={t('sharedGenrePage.allGenre', { genre: displayGenreName })}
              />

              {allStories.length ? (
                <div className="grid grid-cols-2 gap-x-3 gap-y-6 px-4 md:grid-cols-6 md:gap-x-3">
                  {allStories.map((story) => (
                    <AllGenreCard
                      key={`all-${story.id}`}
                      story={story}
                      onOpen={openStory}
                      genreName={genreName}
                    />
                  ))}
                </div>
              ) : (
                <div className="mx-4 rounded-[18px] bg-[var(--shadow-bg-soft)] p-8 text-center">
                  <h3 className="text-[16px] font-black text-[var(--shadow-text-primary)]">
                    {t('sharedGenrePage.noStoriesFound')}
                  </h3>

                  <p className="mt-2 text-[13px] font-normal text-[var(--shadow-text-tertiary)]">
                    {t('sharedGenrePage.storiesWillAppear', {
                      genre: displayGenreName,
                    })}
                  </p>
                </div>
              )}
            </section>
          </div>
        ) : null}
      </main>
    </div>
  )
}
