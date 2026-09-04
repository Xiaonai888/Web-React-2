import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthorStudioBottomNav from '../../components/AuthorStudioBottomNav'
import StorySortMenu from '../../components/author/StorySortMenu'
import StoryActionsSheet from '../../components/author/StoryActionsSheet'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorStories', {
  en: {
    all: 'All',
    novel: 'Novel',
    manga: 'Manga',
    chatStory: 'Chat Story',
    published: 'Published',
    draft: 'Draft',
    scheduled: 'Scheduled',
    recentlyUpdated: 'Recently updated',
    mostViewed: 'Most viewed',
    mostEpisodes: 'Most episodes',
    az: 'A–Z',
    untitledStory: 'Untitled Story',
    noMatching: 'No matching stories',
    createFirst: 'Create your first story',
    noMatchingBody: 'Try another title or choose a different status.',
    createFirstBody: 'Your published stories and drafts will appear here.',
    createStory: 'Create Story',
    loadFailed: 'Failed to load stories',
    cannotConnect: 'Cannot connect to backend. Please check the backend server.',
    searchPlaceholder: 'Search stories...',
    closeSearch: 'Close search',
    title: 'My Stories',
    searchStories: 'Search stories',
    retry: 'Retry',
    drafts: 'Drafts',
    views: 'Views',
    continueWriting: 'Continue Writing',
    episodeNumber: 'Episode {{number}}',
    recentlyEdited: 'Recently edited',
    continue: 'Continue',
    filters: 'Filters',
    allStatus: 'All Status',
    yourLibrary: 'Your Library',
    episodeShort: '{{number}} EP',
    actionsFor: 'Actions for {{title}}',
  },
  km: {
    all: 'ទាំងអស់',
    novel: 'ប្រលោមលោក',
    manga: 'Manga',
    chatStory: 'Chat Story',
    published: 'បានបោះពុម្ព',
    draft: 'ព្រាង',
    scheduled: 'បានកំណត់ពេល',
    recentlyUpdated: 'បានកែថ្មីៗ',
    mostViewed: 'ទស្សនាច្រើនបំផុត',
    mostEpisodes: 'ភាគច្រើនបំផុត',
    az: 'A–Z',
    untitledStory: 'រឿងគ្មានចំណងជើង',
    noMatching: 'រកមិនឃើញរឿងដែលត្រូវគ្នា',
    createFirst: 'បង្កើតរឿងដំបូងរបស់អ្នក',
    noMatchingBody: 'សាកចំណងជើងផ្សេង ឬជ្រើសស្ថានភាពផ្សេង។',
    createFirstBody: 'រឿងដែលបានបោះពុម្ព និងរឿងព្រាងនឹងបង្ហាញនៅទីនេះ។',
    createStory: 'បង្កើតរឿង',
    loadFailed: 'មិនអាចផ្ទុករឿងបានទេ',
    cannotConnect: 'មិនអាចភ្ជាប់ទៅ Backend បានទេ។ សូមពិនិត្យ Server។',
    searchPlaceholder: 'ស្វែងរករឿង...',
    closeSearch: 'បិទការស្វែងរក',
    title: 'រឿងរបស់ខ្ញុំ',
    searchStories: 'ស្វែងរករឿង',
    retry: 'សាកម្តងទៀត',
    drafts: 'រឿងព្រាង',
    views: 'ទស្សនា',
    continueWriting: 'បន្តសរសេរ',
    episodeNumber: 'ភាគ {{number}}',
    recentlyEdited: 'បានកែថ្មីៗ',
    continue: 'បន្ត',
    filters: 'តម្រង',
    allStatus: 'ស្ថានភាពទាំងអស់',
    yourLibrary: 'បណ្ណាល័យរបស់អ្នក',
    episodeShort: '{{number}} ភាគ',
    actionsFor: 'សកម្មភាពសម្រាប់ {{title}}',
  },
  zh: {
    all: '全部',
    novel: '小说',
    manga: '漫画',
    chatStory: '聊天故事',
    published: '已发布',
    draft: '草稿',
    scheduled: '已排期',
    recentlyUpdated: '最近更新',
    mostViewed: '浏览最多',
    mostEpisodes: '章节最多',
    az: 'A–Z',
    untitledStory: '未命名故事',
    noMatching: '没有匹配的故事',
    createFirst: '创建你的第一个故事',
    noMatchingBody: '尝试其他标题或选择不同状态。',
    createFirstBody: '已发布故事和草稿会显示在这里。',
    createStory: '创建故事',
    loadFailed: '无法加载故事',
    cannotConnect: '无法连接后端，请检查服务器。',
    searchPlaceholder: '搜索故事...',
    closeSearch: '关闭搜索',
    title: '我的故事',
    searchStories: '搜索故事',
    retry: '重试',
    drafts: '草稿',
    views: '浏览',
    continueWriting: '继续写作',
    episodeNumber: '第 {{number}} 章',
    recentlyEdited: '最近编辑',
    continue: '继续',
    filters: '筛选',
    allStatus: '全部状态',
    yourLibrary: '你的书库',
    episodeShort: '{{number}} 章',
    actionsFor: '{{title}} 的操作',
  },
  ja: {
    all: 'すべて',
    novel: '小説',
    manga: 'マンガ',
    chatStory: 'チャットストーリー',
    published: '公開済み',
    draft: '下書き',
    scheduled: '予約済み',
    recentlyUpdated: '最近更新',
    mostViewed: '閲覧数順',
    mostEpisodes: 'エピソード数順',
    az: 'A–Z',
    untitledStory: '無題のストーリー',
    noMatching: '一致するストーリーがありません',
    createFirst: '最初のストーリーを作成',
    noMatchingBody: '別のタイトルやステータスを試してください。',
    createFirstBody: '公開済みストーリーと下書きがここに表示されます。',
    createStory: 'ストーリーを作成',
    loadFailed: 'ストーリーを読み込めませんでした',
    cannotConnect: 'バックエンドに接続できません。サーバーを確認してください。',
    searchPlaceholder: 'ストーリーを検索...',
    closeSearch: '検索を閉じる',
    title: 'マイストーリー',
    searchStories: 'ストーリーを検索',
    retry: '再試行',
    drafts: '下書き',
    views: '閲覧',
    continueWriting: '執筆を続ける',
    episodeNumber: 'エピソード {{number}}',
    recentlyEdited: '最近編集',
    continue: '続ける',
    filters: 'フィルター',
    allStatus: 'すべてのステータス',
    yourLibrary: 'ライブラリ',
    episodeShort: '{{number}} EP',
    actionsFor: '{{title}} の操作',
  },
  ko: {
    all: '전체',
    novel: '소설',
    manga: '만화',
    chatStory: '채팅 스토리',
    published: '게시됨',
    draft: '초안',
    scheduled: '예약됨',
    recentlyUpdated: '최근 업데이트',
    mostViewed: '조회수 순',
    mostEpisodes: '에피소드 많은 순',
    az: 'A–Z',
    untitledStory: '제목 없는 스토리',
    noMatching: '일치하는 스토리가 없습니다',
    createFirst: '첫 스토리 만들기',
    noMatchingBody: '다른 제목이나 상태를 선택해 보세요.',
    createFirstBody: '게시된 스토리와 초안이 여기에 표시됩니다.',
    createStory: '스토리 만들기',
    loadFailed: '스토리를 불러오지 못했습니다',
    cannotConnect: '백엔드에 연결할 수 없습니다. 서버를 확인하세요.',
    searchPlaceholder: '스토리 검색...',
    closeSearch: '검색 닫기',
    title: '내 스토리',
    searchStories: '스토리 검색',
    retry: '다시 시도',
    drafts: '초안',
    views: '조회',
    continueWriting: '계속 쓰기',
    episodeNumber: '에피소드 {{number}}',
    recentlyEdited: '최근 편집',
    continue: '계속',
    filters: '필터',
    allStatus: '전체 상태',
    yourLibrary: '내 라이브러리',
    episodeShort: '{{number}} EP',
    actionsFor: '{{title}} 작업',
  },
})

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const AUTHOR_PREVIEW_ENABLED =
  import.meta.env.DEV && import.meta.env.VITE_AUTHOR_PREVIEW === 'true'

const MOCK_STORIES = [
  {
    id: 'preview-story-1',
    title: 'Falling Petals',
    status: 'published',
    total_views: 12400,
    total_episodes: 12,
    cover_url: '/assets/New Arrival/New Arrival 1.jpg',
    updated_at: '2026-07-16T08:00:00.000Z',
  },
  {
    id: 'preview-story-2',
    title: 'CLONE',
    status: 'published',
    total_views: 9300,
    total_episodes: 10,
    cover_url: '/assets/New Arrival/New Arrival 2.jpg',
    updated_at: '2026-07-15T08:00:00.000Z',
  },
  {
    id: 'preview-story-3',
    title: 'Dear Soul, My Light',
    status: 'draft',
    total_views: 2100,
    total_episodes: 8,
    cover_url: '/assets/New Arrival/New Arrival 3.jpg',
    updated_at: '2026-07-13T08:00:00.000Z',
  },
  {
    id: 'preview-story-4',
    title: 'Moonlit Promise',
    status: 'scheduled',
    total_views: 1800,
    total_episodes: 6,
    cover_url: '/assets/Must Read pic/Must Read 3.jpg',
    updated_at: '2026-07-11T08:00:00.000Z',
  },
]

const STORY_TYPE_FILTERS = [
  { id: 'all', labelKey: 'all' },
  { id: 'novel', labelKey: 'novel' },
  { id: 'manga', labelKey: 'manga' },
  { id: 'chat_story', labelKey: 'chatStory' },
]

const STATUS_FILTERS = [
  { id: 'published', labelKey: 'published' },
  { id: 'draft', labelKey: 'draft' },
  { id: 'scheduled', labelKey: 'scheduled' },
]

const SORT_OPTIONS = [
  { id: 'updated', labelKey: 'recentlyUpdated' },
  { id: 'views', labelKey: 'mostViewed' },
  { id: 'episodes', labelKey: 'mostEpisodes' },
  { id: 'title', labelKey: 'az' },
]

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'

  return new Intl.NumberFormat(getDisplayLanguageId(), {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(number)
}

function normalizeStatus(value) {
  const status = String(value || 'draft').toLowerCase()

  if (status === 'published') return 'published'
  if (status === 'scheduled') return 'scheduled'
  return 'draft'
}

function normalizeStory(story) {
  return {
    id: story.id,
    title: story.title || getDisplayText('authorStories.untitledStory'),
    status: normalizeStatus(story.status),
    type:
      story.story_type === 'manga' || story.story_type === 'chat_story'
        ? story.story_type
        : 'novel',
    views: Number(story.total_views || 0),
    episodes: Number(story.total_episodes || 0),
    cover: story.cover_url || '',
    updatedAt: story.updated_at || story.created_at || '',
  }
}

function StatItem({ icon, label, value }) {
  return (
    <div className="relative flex min-w-0 flex-1 flex-col items-center px-1 py-1 text-center after:absolute after:-right-px after:top-2 after:h-[54px] after:w-px after:bg-[var(--shadow-border)] last:after:hidden">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2edff] text-[#7248f5]">
        <i className={`${icon} text-[16px]`} />
      </span>
      <span className="mt-2 text-[11px] font-semibold text-[var(--shadow-text-secondary)]">{label}</span>
      <strong className="mt-0.5 max-w-full truncate text-[18px] font-black text-[#6840ef]">{value}</strong>
    </div>
  )
}

function StatusBadge({ status }) {
  const { t } = useDisplayTranslation()
  const styles = {
    published: 'bg-[#7951f4] text-white',
    draft: 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]',
    scheduled: 'bg-[#6f687c]/85 text-white',
  }

  return (
    <span className={`rounded-lg px-2.5 py-1 text-[10px] font-extrabold capitalize shadow-sm ${styles[status]}`}>
      {t(`authorStories.${status}`)}
    </span>
  )
}

function StoryCover({ story, className = '' }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-[#eee8ff] to-[#d9cdfd] ${className}`}>
      {story.cover && !failed ? (
        <img
          src={story.cover}
          alt={story.title}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center px-3 text-center text-[#7651e9]">
          <i className="fa-solid fa-book-open text-[30px]" />
          <span className="mt-3 line-clamp-2 text-[12px] font-extrabold">{story.title}</span>
        </div>
      )}
    </div>
  )
}

function LoadingCard() {
  return (
    <div className="overflow-hidden rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] shadow-sm">
      <div className="aspect-[3/4] animate-pulse bg-[var(--shadow-bg-soft)]" />
      <div className="space-y-2 p-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--shadow-bg-soft)]" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-[var(--shadow-bg-soft)]" />
      </div>
    </div>
  )
}

function EmptyState({ searching, onCreate }) {
  const { t } = useDisplayTranslation()
  return (
    <div className="col-span-full rounded-[14px] bg-[var(--shadow-bg-surface)] px-6 py-12 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f0eaff] text-[#744af3]">
        <i className={`fa-solid ${searching ? 'fa-magnifying-glass' : 'fa-feather-pointed'} text-[20px]`} />
      </span>
      <h3 className="mt-4 text-[16px] font-black text-[var(--shadow-text-primary)]">
        {searching ? t('authorStories.noMatching') : t('authorStories.createFirst')}
      </h3>
      <p className="mx-auto mt-1 max-w-[260px] text-[12px] leading-5 text-[var(--shadow-text-secondary)]">
        {searching
          ? t('authorStories.noMatchingBody')
          : t('authorStories.createFirstBody')}
      </p>
      {!searching ? (
        <button
          type="button"
          onClick={onCreate}
          className="mt-5 rounded-full bg-[#7047f3] px-5 py-2.5 text-[12px] font-extrabold text-white shadow-[0_8px_18px_rgba(112,71,243,0.24)] active:scale-95"
        >
          {t('authorStories.createStory')}
        </button>
      ) : null}
    </div>
  )
}

export default function AuthorStoriesPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [filterOpen, setFilterOpen] = useState(false)
  const filterMenuRef = useRef(null)
  const [sort, setSort] = useState('updated')
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [menuStoryId, setMenuStoryId] = useState(null)

  async function fetchStories() {
    if (AUTHOR_PREVIEW_ENABLED) {
      setStories(MOCK_STORIES.map(normalizeStory))
      setError('')
      setLoading(false)
      return
    }

    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${API_BASE_URL}/api/stories/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || t('authorStories.loadFailed'))
      }

      setStories((data.stories || []).map(normalizeStory))
    } catch (fetchError) {
      setStories([])
      setError(
        fetchError.message === 'Failed to fetch'
          ? t('authorStories.cannotConnect')
          : fetchError.message || t('authorStories.loadFailed')
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStories()
  }, [])

  useEffect(() => {
  if (!menuStoryId) return undefined
  const closeMenu = () => setMenuStoryId(null)
  window.addEventListener('resize', closeMenu)
  return () => window.removeEventListener('resize', closeMenu)
}, [menuStoryId])


  useEffect(() => {
  if (!filterOpen) return undefined

  const closeFilter = (event) => {
    if (!filterMenuRef.current?.contains(event.target)) {
      setFilterOpen(false)
    }
  }

  document.addEventListener('pointerdown', closeFilter)

  return () => {
    document.removeEventListener('pointerdown', closeFilter)
  }
}, [filterOpen])

  const stats = useMemo(() => {
    return {
      all: stories.length,
      published: stories.filter((story) => story.status === 'published').length,
      drafts: stories.filter((story) => story.status === 'draft').length,
      views: stories.reduce((total, story) => total + story.views, 0),
    }
  }, [stories])

  const latestStory = useMemo(() => {
    return [...stories].sort(
      (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
    )[0] || null
  }, [stories])

  const visibleStories = useMemo(() => {
  const query = search.trim().toLowerCase()
  const nextStories = stories.filter((story) => {
    const matchesType = typeFilter === 'all' || story.type === typeFilter
    const matchesStatus = statusFilter === 'all' || story.status === statusFilter
    const matchesSearch = !query || story.title.toLowerCase().includes(query)
    return matchesType && matchesStatus && matchesSearch
  })

  return nextStories.sort((a, b) => {
    if (sort === 'views') return b.views - a.views
    if (sort === 'episodes') return b.episodes - a.episodes
    if (sort === 'title') return a.title.localeCompare(b.title)
    return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
  })
}, [search, sort, statusFilter, stories, typeFilter])

  const selectedStory = stories.find((story) => String(story.id) === String(menuStoryId)) || null
  const localizedSortOptions = SORT_OPTIONS.map((item) => ({
    id: item.id,
    label: t(`authorStories.${item.labelKey}`),
  }))

  const closeSearch = () => {
    setSearch('')
    setSearchOpen(false)
  }

  const openStory = (story) => {
    navigate(`/author/story/${story.id}/manage`)
  }

  const runStoryAction = (path) => {
    setMenuStoryId(null)
    navigate(path)
  }

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-[100px] text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] backdrop-blur-xl">
        <div className="mx-auto flex h-[62px] max-w-5xl items-center px-4">
          {searchOpen ? (
            <div className="flex w-full items-center gap-3 rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-4 py-2.5 focus-within:border-[#9479ec]">
              <i className="fa-solid fa-magnifying-glass text-[14px] text-[#7351dc]" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t('authorStories.searchPlaceholder')}
                autoFocus
                className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-[var(--shadow-text-primary)] outline-none placeholder:font-medium placeholder:text-[var(--shadow-placeholder)]"
              />
              <button
                type="button"
                onClick={closeSearch}
                className="flex h-7 w-7 items-center justify-center text-[var(--shadow-text-primary)] active:opacity-60"
                aria-label={t('authorStories.closeSearch')}
              >
                <i className="fa-solid fa-xmark text-[15px]" />
              </button>
            </div>
          ) : (
            <div className="grid w-full grid-cols-[42px_1fr_42px] items-center">
              <span />
              <h1 className="text-center text-[15px] font-semibold text-[var(--shadow-text-primary)]">{t('authorStories.title')}</h1>
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex h-10 w-10 items-center justify-center justify-self-end text-[var(--shadow-text-primary)] active:opacity-60"
                aria-label={t('authorStories.searchStories')}
              >
                <i className="fa-solid fa-magnifying-glass text-[19px]" />
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-3.5 pb-6 pt-4 sm:px-5">
        {error ? (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-[16px] border border-red-100 bg-red-50 px-4 py-3 text-[12px] font-semibold text-red-600">
            <span>{error}</span>
            <button type="button" onClick={fetchStories} className="shrink-0 font-black text-red-700">
              {t('authorStories.retry')}
            </button>
          </div>
        ) : null}

        <section className="flex rounded-[14px] bg-[var(--shadow-bg-surface)] px-1.5 py-3 shadow-[0_8px_26px_rgba(71,55,110,0.07)]">
          <StatItem icon="fa-solid fa-book-open" label={t('authorStories.all')} value={formatCompactNumber(stats.all)} />
          <StatItem icon="fa-regular fa-circle-check" label={t('authorStories.published')} value={formatCompactNumber(stats.published)} />
          <StatItem icon="fa-regular fa-file-lines" label={t('authorStories.drafts')} value={formatCompactNumber(stats.drafts)} />
          <StatItem icon="fa-regular fa-eye" label={t('authorStories.views')} value={formatCompactNumber(stats.views)} />
        </section>

        {!loading && latestStory ? (
          <section className="mt-4 overflow-hidden rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3 shadow-[0_7px_22px_rgba(71,55,110,0.06)]">
            <div className="flex items-center gap-3">
              <StoryCover story={latestStory} className="h-[82px] w-[64px] shrink-0 rounded-[10px]" />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#7951f4]">{t('authorStories.continueWriting')}</div>
                <h2 className="mt-1 line-clamp-1 text-[15px] font-black text-[var(--shadow-text-primary)]">{latestStory.title}</h2>
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-[var(--shadow-text-secondary)]">
                  <span>{t('authorStories.episodeNumber', { number: latestStory.episodes })}</span>
                  <span className="h-1 w-1 rounded-full bg-[#825af5]" />
                  <span>{t('authorStories.recentlyEdited')}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openStory(latestStory)}
                className="shrink-0 rounded-full bg-[#f0ebff] px-4 py-2.5 text-[12px] font-extrabold text-[#6d43ee] active:scale-95"
              >
                {t('authorStories.continue')}
              </button>
            </div>
          </section>
        ) : null}

        <div
  ref={filterMenuRef}
  className="relative mt-5 flex items-center gap-2"
>
  <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    {STORY_TYPE_FILTERS.map((item) => {
      const active = typeFilter === item.id

      return (
        <button
          key={item.id}
          type="button"
          onClick={() => setTypeFilter(item.id)}
          className={`shrink-0 whitespace-nowrap rounded-full border px-5 py-2.5 text-[12px] font-medium transition active:scale-95 ${
            active
              ? 'border-[#7951f4] bg-[#7951f4] text-white'
              : 'border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-secondary)]'
          }`}
        >
          {t(`authorStories.${item.labelKey}`)}
        </button>
      )
    })}
  </div>

  <button
    type="button"
    onClick={() => setFilterOpen((current) => !current)}
    aria-haspopup="menu"
    aria-expanded={filterOpen}
    className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2.5 text-[12px] font-medium transition active:scale-95 ${
      filterOpen || statusFilter !== 'all'
        ? 'border-[#7951f4] bg-[#7951f4] text-white'
        : 'border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-secondary)]'
    }`}
  >
    <span>{t('authorStories.filters')}</span>
    <i
      className={`fa-solid fa-chevron-down text-[8px] transition-transform ${
        filterOpen ? 'rotate-180' : ''
      }`}
    />
  </button>

  {filterOpen ? (
    <div className="absolute right-0 top-[calc(100%+6px)] z-40 w-[170px] overflow-hidden rounded-[14px] bg-[var(--shadow-bg-elevated)] p-1.5 shadow-[0_12px_32px_rgba(31,20,63,0.18)] ring-1 ring-[var(--shadow-border)]">
      <button
        type="button"
        onClick={() => {
          setStatusFilter('all')
          setFilterOpen(false)
        }}
        className={`flex w-full items-center justify-between rounded-[9px] px-3 py-2.5 text-left text-[12px] font-normal ${
          statusFilter === 'all'
            ? 'bg-[#eee8ff] text-[#7046ef]'
            : 'text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)]'
        }`}
      >
        <span>{t('authorStories.allStatus')}</span>
        {statusFilter === 'all' ? (
          <i className="fa-solid fa-check text-[10px]" />
        ) : null}
      </button>

      {STATUS_FILTERS.map((item) => {
        const active = statusFilter === item.id

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setStatusFilter(item.id)
              setFilterOpen(false)
            }}
            className={`flex w-full items-center justify-between rounded-[9px] px-3 py-2.5 text-left text-[12px] font-normal ${
              active
                ? 'bg-[#eee8ff] text-[#7046ef]'
                : 'text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)]'
            }`}
          >
            <span>{t(`authorStories.${item.labelKey}`)}</span>
            {active ? (
              <i className="fa-solid fa-check text-[10px]" />
            ) : null}
          </button>
        )
      })}
    </div>
  ) : null}
</div>

        <div className="mb-3 mt-5 flex items-center justify-between gap-3">
          <h2 className="text-[18px] font-black tracking-[-0.02em] text-[var(--shadow-text-primary)]">{t('authorStories.yourLibrary')}</h2>
          <StorySortMenu value={sort} options={localizedSortOptions} onChange={setSort} />
        </div>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {loading ? (
            <>
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
            </>
          ) : visibleStories.length > 0 ? (
            visibleStories.map((story) => (
              <article
                key={story.id}
                className="group overflow-visible rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] shadow-[0_7px_20px_rgba(71,55,110,0.06)]"
              >
                <button
                  type="button"
                  onClick={() => openStory(story)}
                  className="relative block aspect-[3/4] w-full overflow-hidden rounded-t-[13px] text-left"
                >
                  <StoryCover story={story} className="h-full w-full transition duration-300 group-hover:scale-[1.02]" />
                  <span className="absolute left-2.5 top-2.5">
                    <StatusBadge status={story.status} />
                  </span>
                </button>

                <div className="relative p-3">
                  <h3 className="line-clamp-1 pr-7 text-[14px] font-black text-[var(--shadow-text-primary)]">{story.title}</h3>
                  <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-[var(--shadow-text-secondary)]">
                    <span className="flex items-center gap-1">
                      <i className="fa-regular fa-eye text-[10px]" />
                      {formatCompactNumber(story.views)}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-[#8d8499]" />
                    <span>{t('authorStories.episodeShort', { number: story.episodes })}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMenuStoryId((current) => current === story.id ? null : story.id)}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center text-[var(--shadow-text-primary)] active:scale-95"
                    aria-label={t('authorStories.actionsFor', { title: story.title })}
                  >
                    <i className="fa-solid fa-ellipsis-vertical text-[13px]" />
                  </button>
                </div>
              </article>
            ))
          ) : (
            <EmptyState
  searching={
    Boolean(search.trim()) ||
    typeFilter !== 'all' ||
    statusFilter !== 'all'
  }
  onCreate={() => navigate('/author/create-story')}
/>
          )}
        </section>
      </main>

      <StoryActionsSheet
  story={selectedStory}
  onClose={() => setMenuStoryId(null)}
  onDeleted={(storyId) => setStories((current) => current.filter((item) => String(item.id) !== String(storyId)))}
/>

      <AuthorStudioBottomNav />
    </div>
  )
}
