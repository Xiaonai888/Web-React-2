import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { addStoryLanguageParam, getStoryLanguageId } from '../utils/storyLanguage'
import { getHomeCacheKey, loadHomeCache, saveHomeCache } from '../utils/homeDataCache'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('chatStoryHomePage', {
  en: {
    chat: 'Chat',
    search: 'Search',
    genres: 'Genres',
    hotPicks: 'Hot Picks',
    recentFeatures: 'Recent Features',
    featuredCategories: 'Featured Categories',
    newUpdated: 'New & Updated',
    recommendedForYou: 'Recommended for You',
    seeAll: 'See all',
    loadingStories: 'Loading Chat Stories...',
    loadFailed: 'Failed to load Chat Stories',
    noPublishedStories: 'No published Chat Stories yet.',
    untitledStory: 'Untitled Story',
    chatStory: 'Chat Story',
    comments: '{{count}} comments',
    recently: 'recently',
    justNow: 'just now',
    minutesAgo: '{{count}} min ago',
    hoursAgo: '{{count}}h ago',
    yesterday: 'yesterday',
    daysAgo: '{{count}}d ago',
    updatedEpisode: 'EP {{count}} · Updated {{time}}',
    conversationWaiting: 'A new conversation is waiting for you.',
    hotBadge: 'HOT',
    newBadge: 'NEW',
    endBadge: 'END',
    feature1Title: 'What’s it like to date a villain?',
    feature1Subtitle: 'New writing event',
    feature2Title: 'Chat Story Creator Week',
    feature2Subtitle: 'Join the challenge',
  },
  km: {
    chat: 'Chat',
    search: 'ស្វែងរក',
    genres: 'ប្រភេទរឿង',
    hotPicks: 'រឿងពេញនិយម',
    recentFeatures: 'មុខងារថ្មីៗ',
    featuredCategories: 'ប្រភេទរឿងណែនាំ',
    newUpdated: 'ថ្មី និងទើបអាប់ដេត',
    recommendedForYou: 'ណែនាំសម្រាប់អ្នក',
    seeAll: 'មើលទាំងអស់',
    loadingStories: 'កំពុងផ្ទុក Chat Story...',
    loadFailed: 'មិនអាចផ្ទុក Chat Story បានទេ',
    noPublishedStories: 'មិនទាន់មាន Chat Story ដែលបានបោះពុម្ពទេ។',
    untitledStory: 'រឿងគ្មានចំណងជើង',
    chatStory: 'Chat Story',
    comments: '{{count}} មតិ',
    recently: 'ថ្មីៗនេះ',
    justNow: 'ទើបតែឥឡូវនេះ',
    minutesAgo: '{{count}} នាទីមុន',
    hoursAgo: '{{count}} ម៉ោងមុន',
    yesterday: 'ម្សិលមិញ',
    daysAgo: '{{count}} ថ្ងៃមុន',
    updatedEpisode: 'ភាគ {{count}} · អាប់ដេត {{time}}',
    conversationWaiting: 'មានការសន្ទនាថ្មីមួយកំពុងរង់ចាំអ្នក។',
    hotBadge: 'ពេញនិយម',
    newBadge: 'ថ្មី',
    endBadge: 'ចប់',
    feature1Title: 'ការណាត់ជួបជាមួយតួអាក្រក់មានអារម្មណ៍យ៉ាងណា?',
    feature1Subtitle: 'កម្មវិធីសរសេរថ្មី',
    feature2Title: 'សប្តាហ៍អ្នកបង្កើត Chat Story',
    feature2Subtitle: 'ចូលរួមការប្រកួតប្រជែង',
  },
  zh: {
    chat: '聊天',
    search: '搜索',
    genres: '分类',
    hotPicks: '热门精选',
    recentFeatures: '最新活动',
    featuredCategories: '精选分类',
    newUpdated: '最新与更新',
    recommendedForYou: '为你推荐',
    seeAll: '查看全部',
    loadingStories: '正在加载 Chat Story...',
    loadFailed: '无法加载 Chat Story',
    noPublishedStories: '暂无已发布的 Chat Story。',
    untitledStory: '无标题故事',
    chatStory: 'Chat Story',
    comments: '{{count}} 条评论',
    recently: '最近',
    justNow: '刚刚',
    minutesAgo: '{{count}} 分钟前',
    hoursAgo: '{{count}} 小时前',
    yesterday: '昨天',
    daysAgo: '{{count}} 天前',
    updatedEpisode: '第 {{count}} 集 · 更新于 {{time}}',
    conversationWaiting: '一段新的对话正在等你。',
    hotBadge: '热门',
    newBadge: '新',
    endBadge: '完结',
    feature1Title: '和反派约会是什么体验？',
    feature1Subtitle: '全新写作活动',
    feature2Title: 'Chat Story 创作者周',
    feature2Subtitle: '加入挑战',
  },
  ja: {
    chat: 'チャット',
    search: '検索',
    genres: 'ジャンル',
    hotPicks: '人気ピック',
    recentFeatures: '最新特集',
    featuredCategories: '注目カテゴリー',
    newUpdated: '新着・更新',
    recommendedForYou: 'あなたへのおすすめ',
    seeAll: 'すべて見る',
    loadingStories: 'Chat Story を読み込み中...',
    loadFailed: 'Chat Story を読み込めませんでした',
    noPublishedStories: '公開済みの Chat Story はまだありません。',
    untitledStory: '無題のストーリー',
    chatStory: 'Chat Story',
    comments: 'コメント {{count}}件',
    recently: '最近',
    justNow: 'たった今',
    minutesAgo: '{{count}}分前',
    hoursAgo: '{{count}}時間前',
    yesterday: '昨日',
    daysAgo: '{{count}}日前',
    updatedEpisode: 'EP {{count}} · {{time}}に更新',
    conversationWaiting: '新しい会話があなたを待っています。',
    hotBadge: '人気',
    newBadge: '新着',
    endBadge: '完結',
    feature1Title: '悪役とデートするってどんな感じ？',
    feature1Subtitle: '新しい執筆イベント',
    feature2Title: 'Chat Story クリエイターウィーク',
    feature2Subtitle: 'チャレンジに参加',
  },
  ko: {
    chat: '채팅',
    search: '검색',
    genres: '장르',
    hotPicks: '인기 추천',
    recentFeatures: '최근 특집',
    featuredCategories: '추천 카테고리',
    newUpdated: '신작 및 업데이트',
    recommendedForYou: '회원님을 위한 추천',
    seeAll: '모두 보기',
    loadingStories: 'Chat Story를 불러오는 중...',
    loadFailed: 'Chat Story를 불러오지 못했습니다',
    noPublishedStories: '아직 공개된 Chat Story가 없습니다.',
    untitledStory: '제목 없는 스토리',
    chatStory: 'Chat Story',
    comments: '댓글 {{count}}개',
    recently: '최근',
    justNow: '방금',
    minutesAgo: '{{count}}분 전',
    hoursAgo: '{{count}}시간 전',
    yesterday: '어제',
    daysAgo: '{{count}}일 전',
    updatedEpisode: 'EP {{count}} · {{time}} 업데이트',
    conversationWaiting: '새로운 대화가 회원님을 기다리고 있습니다.',
    hotBadge: '인기',
    newBadge: '신규',
    endBadge: '완결',
    feature1Title: '악당과 데이트하면 어떤 느낌일까요?',
    feature1Subtitle: '새로운 글쓰기 이벤트',
    feature2Title: 'Chat Story 크리에이터 위크',
    feature2Subtitle: '챌린지 참여하기',
  },
})

const API_BASE_URL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const CHAT_STORY_HOME_CACHE_MAX_AGE_MS = 2 * 60 * 60 * 1000
const SHOW_DEMO_STORIES = false

const hotPicks = [
  { id: '1', title: 'Not Just a Marriage of Convenience', cover: '/assets/chat-story/hot-1.jpg', views: '2.34M', genre: 'Fantasy Romance', badge: 'HOT' },
  { id: '2', title: 'From Chaos to Love: My Husband', cover: '/assets/chat-story/hot-2.jpg', views: '206.4K', genre: 'Modern Romance', badge: 'NEW' },
  { id: '3', title: 'Quietly Obsessed With You', cover: '/assets/chat-story/hot-3.jpg', views: '96.3K', genre: 'LGBT', badge: 'HOT' },
  { id: '4', title: 'Devil’s Badass Wife', cover: '/assets/chat-story/hot-4.jpg', views: '1.56M', genre: 'Modern Romance', badge: 'END' },
]

const sections = [
  {
    key: 'romance',
    icon: '💕',
    title: 'Romance',
    stories: [
      { id: '5', title: 'A Little Timid, Completely Yours', cover: '/assets/chat-story/romance-1.jpg', views: '23.9K', genre: 'Modern Romance' },
      { id: '6', title: 'Reborn to Get Pampered', cover: '/assets/chat-story/romance-2.jpg', views: '399.9K', genre: 'Fantasy Romance' },
      { id: '7', title: 'I Became His Favorite', cover: '/assets/chat-story/romance-3.jpg', views: '260.7K', genre: 'Fantasy Romance' },
      { id: '8', title: 'Not Just a Marriage', cover: '/assets/chat-story/romance-4.jpg', views: '2.34M', genre: 'Fantasy Romance' },
    ],
  },
  {
    key: 'lgbt',
    icon: '🌈',
    title: 'LGBT',
    stories: [
      { id: '9', title: 'Transmigrated: I Am a Star', cover: '/assets/chat-story/lgbt-1.jpg', views: '23.7K', comments: '43' },
      { id: '10', title: 'Married to My Villain', cover: '/assets/chat-story/lgbt-2.jpg', views: '138.5K', comments: '931' },
      { id: '11', title: 'She Rejected Me, Now He Wants Me', cover: '/assets/chat-story/lgbt-3.jpg', views: '977.8K', comments: '1.08K' },
      { id: '12', title: 'Be Mine', cover: '/assets/chat-story/lgbt-4.jpg', views: '14.4K', comments: '51' },
    ],
  },
  {
    key: 'cp-idol',
    icon: '🌟',
    title: 'CP Idol',
    stories: [
      { id: '13', title: 'Reborn to Love My Husband', cover: '/assets/chat-story/cp-1.jpg', views: '535.4K', comments: '557' },
      { id: '14', title: 'Reincarnate to Find a New Love', cover: '/assets/chat-story/cp-2.jpg', views: '177.6K', comments: '775' },
      { id: '15', title: 'Please, Love Me Once More', cover: '/assets/chat-story/cp-3.jpg', views: '108.7K', comments: '113' },
      { id: '16', title: 'I Fell in Love Again', cover: '/assets/chat-story/cp-4.jpg', views: '12.1K', comments: '42' },
    ],
  },
]

const categories = [
  { title: 'Modern Romance', icon: '🥂', className: 'from-[#ff8cb9] to-[#f6b7e6]' },
  { title: 'LGBT', icon: '🌈', className: 'from-[#5b7cff] to-[#d083ee]' },
  { title: 'CP Idol', icon: '🎤', className: 'from-[#ffa4bf] to-[#a9eff6]' },
  { title: 'Fantasy Romance', icon: '👑', className: 'from-[#ffd777] to-[#a8efae]' },
  { title: 'Fanfic Anime / Game / Film', icon: '🎮', className: 'from-[#f6aa8d] to-[#a9eff6]' },
  { title: 'Action / Adventure / Horror', icon: '⚔️', className: 'from-[#ffc06f] to-[#8db8ef]' },
]

const DISPLAY_LOCALES = {
  km: 'km-KH',
  en: 'en-GB',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
}

const featureBanners = [
  {
    id: 'feature-1',
    titleKey: 'feature1Title',
    subtitleKey: 'feature1Subtitle',
    className: 'from-[#ffd8e8] via-[#fff0f6] to-[#f8d7e9]',
  },
  {
    id: 'feature-2',
    titleKey: 'feature2Title',
    subtitleKey: 'feature2Subtitle',
    className: 'from-[#b9ecff] via-[#d8f2ff] to-[#b8c8ff]',
  },
]

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number) || number <= 0) {
    return '0'
  }

  if (number >= 1000000) {
    return `${(number / 1000000)
      .toFixed(number >= 10000000 ? 0 : 1)
      .replace(/\.0$/, '')}M`
  }

  if (number >= 1000) {
    return `${(number / 1000)
      .toFixed(number >= 10000 ? 0 : 1)
      .replace(/\.0$/, '')}K`
  }

  return String(number)
}

function formatUpdatedTime(value, language, t) {
  const updatedTime = value ? new Date(value).getTime() : 0

  if (!updatedTime || Number.isNaN(updatedTime)) {
    return t('chatStoryHomePage.recently')
  }

  const difference = Date.now() - updatedTime
  const minutes = Math.max(0, Math.floor(difference / 60000))

  if (minutes < 1) {
    return t('chatStoryHomePage.justNow')
  }

  if (minutes < 60) {
    return t('chatStoryHomePage.minutesAgo', {
      count: minutes,
    })
  }

  const hours = Math.floor(minutes / 60)

  if (hours < 24) {
    return t('chatStoryHomePage.hoursAgo', {
      count: hours,
    })
  }

  const days = Math.floor(hours / 24)

  if (days === 1) {
    return t('chatStoryHomePage.yesterday')
  }

  if (days < 30) {
    return t('chatStoryHomePage.daysAgo', {
      count: days,
    })
  }

  return new Date(updatedTime).toLocaleDateString(
    DISPLAY_LOCALES[language] || DISPLAY_LOCALES.en
  )
}

function mapApiStory(story) {
  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    cover: story.cover_url || '',
    views: formatCompactNumber(story.total_views),
    totalViews: Number(story.total_views || 0),
    comments: formatCompactNumber(story.total_comments),
    genre: story.main_genre || 'Chat Story',
    tags: Array.isArray(story.tags) ? story.tags : [],
    description: story.description || '',
    totalEpisodes: Number(story.total_episodes || 0),
    updatedAt: story.updated_at || story.created_at || '',
    badge:
      String(story.story_status || '').toLowerCase() === 'completed'
        ? 'END'
        : '',
  }
}

function storyMatchesSection(story, sectionKey) {
  const searchText = [
    story.genre,
    ...(story.tags || []),
  ]
    .join(' ')
    .toLowerCase()

  if (sectionKey === 'romance') {
    return searchText.includes('romance')
  }

  if (sectionKey === 'lgbt') {
    return (
      searchText.includes('lgbt') ||
      searchText.includes('boy love') ||
      searchText.includes('boys love') ||
      searchText.includes('girl love') ||
      searchText.includes('girls love') ||
      searchText.includes(' bl ') ||
      searchText.includes(' gl ')
    )
  }

  if (sectionKey === 'cp-idol') {
    return (
      searchText.includes('cp idol') ||
      searchText.includes('idol')
    )
  }

  return false
}

function getStoryTitle(story, t) {
  if (!story?.title || story.title === 'Untitled Story') {
    return t('chatStoryHomePage.untitledStory')
  }

  return story.title
}

function getStoryGenre(story, t) {
  if (!story?.genre || story.genre === 'Chat Story') {
    return t('chatStoryHomePage.chatStory')
  }

  return story.genre
}

function getBadgeLabel(badge, t) {
  const key = String(badge || '').toUpperCase()

  if (key === 'HOT') return t('chatStoryHomePage.hotBadge')
  if (key === 'NEW') return t('chatStoryHomePage.newBadge')
  if (key === 'END') return t('chatStoryHomePage.endBadge')

  return badge
}

function CoverFallback({ title }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#efe8ff] via-[#fde8f2] to-[#e7f5ff] p-2 text-center">
      <span className="line-clamp-3 text-[10px] font-extrabold leading-4 text-[#6d42db]">
        {title}
      </span>
    </div>
  )
}

function StoryCover({ story, onOpen }) {
  const { t } = useDisplayTranslation()
  const title = getStoryTitle(story, t)
  const genre = getStoryGenre(story, t)

  return (
    <button
      type="button"
      onClick={() => onOpen(story)}
      className="w-[112px] shrink-0 text-left active:scale-[0.98]"
    >
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-[13px]"
        style={{ background: 'var(--shadow-bg-soft)' }}
      >
        {story.cover ? (
          <img
            src={story.cover}
            alt={title}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <CoverFallback title={title} />
        )}

        {story.badge ? (
          <span className="absolute left-1.5 top-1.5 rounded-full bg-[#7c3aed] px-2 py-1 text-[8px] font-black text-white">
            {getBadgeLabel(story.badge, t)}
          </span>
        ) : null}
      </div>

      <div
        className="mt-2 line-clamp-2 min-h-[34px] text-[12px] font-extrabold leading-[17px]"
        style={{ color: 'var(--shadow-text-primary)' }}
      >
        {title}
      </div>

      <div
        className="mt-1 flex items-center gap-1 text-[10px] font-semibold"
        style={{ color: 'var(--shadow-text-secondary)' }}
      >
        <i className="fa-regular fa-eye text-[9px]" />
        <span>{story.views}</span>
      </div>

      <div
        className="mt-0.5 line-clamp-1 text-[10px] font-semibold"
        style={{ color: 'var(--shadow-text-tertiary)' }}
      >
        {story.genre
          ? genre
          : t('chatStoryHomePage.comments', {
              count: story.comments || 0,
            })}
      </div>
    </button>
  )
}

function SectionHeader({ icon, title, onMore }) {
  const { t } = useDisplayTranslation()

  return (
    <div className="mb-3 flex items-center justify-between gap-3 px-4">
      <div className="flex min-w-0 items-center gap-2">
        <span className="text-[17px] leading-none">{icon}</span>
        <h2
          className="truncate text-[16px] font-bold leading-5"
          style={{ color: 'var(--shadow-text-primary)' }}
        >
          {title}
        </h2>
      </div>

      <button
        type="button"
        onClick={onMore}
        className="shrink-0 text-[11px] font-bold active:text-[#6d42db]"
        style={{ color: 'var(--shadow-text-secondary)' }}
      >
        {t('chatStoryHomePage.seeAll')}{' '}
        <i className="fa-solid fa-chevron-right ml-1 text-[8px]" />
      </button>
    </div>
  )
}

export default function ChatStoryHomePage() {
  const navigate = useNavigate()
  const { language, t } = useDisplayTranslation()
  const [chatStories, setChatStories] = useState([])
  const [loadingStories, setLoadingStories] = useState(true)
  const [storiesError, setStoriesError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadChatStories() {
      const cacheKey = getHomeCacheKey({
        section: 'stories',
        language: getStoryLanguageId(),
        params: {
          page: 'chat-story-home',
          story_type: 'chat_story',
          sort: 'updated',
          limit: 40,
          schema: 1,
        },
      })

      let hasCachedStories = false

      const cached = await loadHomeCache(cacheKey, {
        maxAgeMs: CHAT_STORY_HOME_CACHE_MAX_AGE_MS,
        allowExpired: true,
      })

      if (controller.signal.aborted) return

      hasCachedStories = Array.isArray(cached?.data)

      if (hasCachedStories) {
        setChatStories(cached.data)
        setLoadingStories(false)
        setStoriesError('')
      }

      if (cached?.isFresh && hasCachedStories) {
        return
      }

      try {
        if (!hasCachedStories) {
          setLoadingStories(true)
        }

        setStoriesError('')

        const response = await fetch(
          addStoryLanguageParam(
            `${API_BASE_URL}/api/public/stories?story_type=chat_story&sort=updated&limit=40`
          ),
          {
            signal: controller.signal,
          }
        )

        const data = await response
          .json()
          .catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(
            data.message || t('chatStoryHomePage.loadFailed')
          )
        }

        const nextStories = (
          Array.isArray(data.stories) ? data.stories : []
        )
          .filter(
            (story) =>
              story?.id &&
              String(story.story_type || '')
                .trim()
                .toLowerCase() === 'chat_story'
          )
          .map(mapApiStory)

        if (controller.signal.aborted) return

        setChatStories(nextStories)

        await saveHomeCache(cacheKey, nextStories, {
          maxAgeMs: CHAT_STORY_HOME_CACHE_MAX_AGE_MS,
        })
      } catch (error) {
        if (error?.name === 'AbortError') return

        if (!hasCachedStories) {
          setChatStories([])
          setStoriesError(
            error.message || t('chatStoryHomePage.loadFailed')
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingStories(false)
        }
      }
    }

    loadChatStories()

    return () => {
      controller.abort()
    }
  }, [t])

  const hotPickStories = useMemo(
    () =>
      [...chatStories]
        .sort(
          (first, second) =>
            second.totalViews - first.totalViews ||
            new Date(second.updatedAt || 0).getTime() -
              new Date(first.updatedAt || 0).getTime()
        )
        .slice(0, 10),
    [chatStories]
  )

  const realSections = useMemo(
    () =>
      sections
        .map((section) => ({
          ...section,
          stories: chatStories
            .filter((story) =>
              storyMatchesSection(story, section.key)
            )
            .slice(0, 10),
        }))
        .filter((section) => section.stories.length > 0),
    [chatStories]
  )

  const newUpdatedStories = useMemo(
    () =>
      [...chatStories]
        .sort(
          (first, second) =>
            new Date(second.updatedAt || 0).getTime() -
            new Date(first.updatedAt || 0).getTime()
        )
        .slice(0, 10),
    [chatStories]
  )

  const recommendedStory =
    hotPickStories[0] ||
    newUpdatedStories[0] ||
    null

  const openStory = (story) => {
    navigate(`/story/${story.id}`)
  }

  const openCollection = (key) => {
    navigate(`/chat-stories?section=${encodeURIComponent(key)}`)
  }

  return (
    <div className="app-page min-h-screen pb-[110px]">
      <header
        className="app-nav sticky top-0 z-40 px-4 pb-3 pt-[calc(12px+env(safe-area-inset-top))] backdrop-blur"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1
            className="text-[17px] font-bold tracking-[-0.01em]"
            style={{ color: 'var(--shadow-text-primary)' }}
          >
            {t('chatStoryHomePage.chat')}
          </h1>

          <div
            className="flex items-center gap-1"
            style={{ color: 'var(--shadow-icon)' }}
          >
            <button
              type="button"
              onClick={() => navigate('/search')}
              className="flex h-10 w-10 items-center justify-center rounded-full active:scale-95"
              style={{ color: 'var(--shadow-icon)' }}
              aria-label={t('chatStoryHomePage.search')}
            >
              <i className="fa-solid fa-magnifying-glass text-[19px]" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/chat-stories/categories')}
              className="flex h-10 w-10 items-center justify-center rounded-full active:scale-95"
              style={{ color: 'var(--shadow-icon)' }}
              aria-label={t('chatStoryHomePage.genres')}
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect x="4" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.8" />
                <rect x="14" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.8" />
                <rect x="4" y="14" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.8" />
                <rect x="14" y="14" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl">
        <section className="pt-2">
          <SectionHeader
            icon="💎"
            title={t('chatStoryHomePage.hotPicks')}
            onMore={() => openCollection('hot-picks')}
          />

          <div className="flex gap-3 overflow-x-auto px-4 pb-2">
            {loadingStories ? (
              <div
                className="flex h-[188px] w-full items-center justify-center text-[12px] font-semibold"
                style={{ color: 'var(--shadow-text-secondary)' }}
              >
                {t('chatStoryHomePage.loadingStories')}
              </div>
            ) : storiesError ? (
              <div
                className="flex h-[100px] w-full items-center justify-center px-5 text-center text-[12px] font-semibold"
                style={{ color: 'var(--shadow-danger)' }}
              >
                {storiesError}
              </div>
            ) : hotPickStories.length ? (
              hotPickStories.map((story) => (
                <StoryCover
                  key={story.id}
                  story={story}
                  onOpen={openStory}
                />
              ))
            ) : (
              <div
                className="flex h-[100px] w-full items-center justify-center text-[12px] font-semibold"
                style={{ color: 'var(--shadow-text-secondary)' }}
              >
                {t('chatStoryHomePage.noPublishedStories')}
              </div>
            )}

            <div className="w-1 shrink-0" />
          </div>
        </section>

        <section className="mt-7">
          <SectionHeader
            icon="🎀"
            title={t('chatStoryHomePage.recentFeatures')}
            onMore={() => openCollection('features')}
          />

          <div className="flex gap-3 overflow-x-auto px-4 pb-1">
            {featureBanners.map((feature) => (
              <button
                key={feature.id}
                type="button"
                onClick={() => openCollection(feature.id)}
                className={`relative h-[116px] w-[82vw] max-w-[430px] shrink-0 overflow-hidden rounded-[16px] bg-gradient-to-r ${feature.className} px-5 text-left active:scale-[0.99]`}
              >
                <div className="absolute -right-5 -top-7 h-28 w-28 rounded-full bg-white/40" />
                <div className="absolute -bottom-10 right-16 h-24 w-24 rounded-full bg-white/30" />
                <div className="relative z-10 max-w-[70%]">
                  <div className="text-[11px] font-black uppercase tracking-[0.08em] text-[#8d5c79]">
                    {t(`chatStoryHomePage.${feature.subtitleKey}`)}
                  </div>
                  <div className="mt-2 text-[18px] font-black leading-6 text-[#5d3b50]">
                    {t(`chatStoryHomePage.${feature.titleKey}`)}
                  </div>
                </div>
              </button>
            ))}
            <div className="w-1 shrink-0" />
          </div>
        </section>

        {realSections.map((section) => (
          <section key={section.key} className="mt-7">
            <SectionHeader
              icon={section.icon}
              title={section.title}
              onMore={() => openCollection(section.key)}
            />

            <div className="flex gap-3 overflow-x-auto px-4 pb-2">
              {section.stories.map((story) => (
                <StoryCover
                  key={story.id}
                  story={story}
                  onOpen={openStory}
                />
              ))}
              <div className="w-1 shrink-0" />
            </div>
          </section>
        ))}

        <section className="mt-8 px-4">
          <SectionHeader
            icon="💖"
            title={t('chatStoryHomePage.featuredCategories')}
            onMore={() => navigate('/chat-stories/categories')}
          />

          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <button
                key={category.title}
                type="button"
                onClick={() =>
                  navigate(`/chat-stories?category=${encodeURIComponent(category.title)}`)
                }
                className={`relative min-h-[82px] overflow-hidden rounded-[16px] bg-gradient-to-r ${category.className} px-4 py-3 text-left shadow-[0_5px_16px_rgba(17,24,39,0.06)] active:scale-[0.98]`}
              >
                <span className="absolute -right-2 top-1/2 -translate-y-1/2 text-[34px] drop-shadow-sm">
                  {category.icon}
                </span>
                <span className="relative z-10 block max-w-[72%] text-[14px] font-black uppercase leading-[17px] text-white drop-shadow-sm">
                  {category.title}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8 px-4">
          <SectionHeader
            icon="✨"
            title={t('chatStoryHomePage.newUpdated')}
            onMore={() => openCollection('new-updated')}
          />

          <div
            className="divide-y"
            style={{ borderColor: 'var(--shadow-border)' }}
          >
            {newUpdatedStories
              .slice(0, 6)
              .map((story) => {
                const title = getStoryTitle(story, t)
                const updatedTime = formatUpdatedTime(
                  story.updatedAt,
                  language,
                  t
                )

                return (
                  <button
                    key={`updated-${story.id}`}
                    type="button"
                    onClick={() => openStory(story)}
                    className="flex w-full items-center gap-3 py-3 text-left active:scale-[0.995]"
                  >
                    <div
                      className="h-[68px] w-[54px] shrink-0 overflow-hidden rounded-[10px]"
                      style={{ background: 'var(--shadow-bg-soft)' }}
                    >
                      {story.cover ? (
                        <img
                          src={story.cover}
                          alt={title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <CoverFallback title={title} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div
                        className="line-clamp-1 text-[14px] font-extrabold"
                        style={{ color: 'var(--shadow-text-primary)' }}
                      >
                        {title}
                      </div>
                      <div
                        className="mt-1 text-[11px] font-semibold"
                        style={{ color: 'var(--shadow-text-secondary)' }}
                      >
                        {t('chatStoryHomePage.updatedEpisode', {
                          count: story.totalEpisodes,
                          time: updatedTime,
                        })}
                      </div>
                      <div
                        className="mt-1 line-clamp-1 text-[11px]"
                        style={{ color: 'var(--shadow-text-tertiary)' }}
                      >
                        {story.description ||
                          t('chatStoryHomePage.conversationWaiting')}
                      </div>
                    </div>

                    <span className="h-2 w-2 shrink-0 rounded-full bg-[#7c3aed]" />
                  </button>
                )
              })}
          </div>
        </section>

        {recommendedStory ? (
          <section className="mt-8 px-4">
            <SectionHeader
              icon="⭐"
              title={t('chatStoryHomePage.recommendedForYou')}
              onMore={() => openCollection('recommended')}
            />

            <button
              type="button"
              onClick={() => openStory(recommendedStory)}
              className="app-card flex w-full gap-3 rounded-[18px] border p-3 text-left active:scale-[0.99]"
              style={{ boxShadow: 'var(--shadow-shadow)' }}
            >
              <div
                className="aspect-[3/4] w-[94px] shrink-0 overflow-hidden rounded-[12px]"
                style={{ background: 'var(--shadow-bg-soft)' }}
              >
                {recommendedStory.cover ? (
                  <img
                    src={recommendedStory.cover}
                    alt={getStoryTitle(recommendedStory, t)}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <CoverFallback
                    title={getStoryTitle(recommendedStory, t)}
                  />
                )}
              </div>

              <div className="min-w-0 flex-1 py-1">
                <div
                  className="line-clamp-2 text-[16px] font-black leading-5"
                  style={{ color: 'var(--shadow-text-primary)' }}
                >
                  {getStoryTitle(recommendedStory, t)}
                </div>

                <div
                  className="mt-2 line-clamp-2 text-[12px] leading-5"
                  style={{ color: 'var(--shadow-text-secondary)' }}
                >
                  {recommendedStory.description ||
                    t('chatStoryHomePage.conversationWaiting')}
                </div>

                <div
                  className="mt-3 flex items-center gap-3 text-[11px] font-semibold"
                  style={{ color: 'var(--shadow-text-tertiary)' }}
                >
                  <span>
                    <i className="fa-regular fa-eye mr-1" />
                    {recommendedStory.views}
                  </span>

                  <span>{getStoryGenre(recommendedStory, t)}</span>
                </div>
              </div>

              <i className="fa-regular fa-bookmark mt-1 text-[16px] text-[#7c3aed]" />
            </button>
          </section>
        ) : null}
      </main>
    </div>
  )
}
