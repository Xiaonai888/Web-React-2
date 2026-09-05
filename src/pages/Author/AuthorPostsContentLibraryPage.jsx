import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorPostsLibrary', {
  "en": {
    "allPosts": "All posts",
    "published": "Published",
    "scheduled": "Scheduled",
    "uploaded": "Uploaded",
    "today": "Today",
    "last7": "Last 7 days",
    "last14": "Last 14 days",
    "last28": "Last 28 days",
    "last90": "Last 90 days",
    "lifetime": "Lifetime",
    "photos": "Photos",
    "text": "Text",
    "views": "Views",
    "engagement": "Engagement",
    "reactions": "Reactions",
    "comments": "Comments",
    "shares": "Shares",
    "justNow": "Just now",
    "pleaseLogin": "Please login first",
    "authorNotFound": "Author page not found",
    "loadPostsFailed": "Failed to load posts",
    "photo": "Photo",
    "post": "Post",
    "photoUpdate": "Photo update",
    "postStatus": "Post status",
    "dateRanges": "Date ranges",
    "postType": "Post type",
    "metrics": "Metrics",
    "closeFilters": "Close filters",
    "filters": "Filters",
    "loadLibraryFailed": "Failed to load {libraryText('contentLibrary')}",
    "loadMoreFailed": "Failed to load more posts",
    "back": "Back",
    "pageDashboard": "Page Dashboard",
    "professionalDashboard": "{libraryText('professionalDashboard')}",
    "contentLibrary": "{libraryText('contentLibrary')}",
    "loadingPosts": "{libraryText('loadingPosts')}",
    "loading": "Loading...",
    "loadMore": "Load more",
    "noPosts": "{libraryText('noPosts')}",
    "noPostsHelp": "{libraryText('noPostsHelp')}"
  },
  "km": {
    "allPosts": "Post ទាំងអស់",
    "published": "បានបោះពុម្ព",
    "scheduled": "បានកំណត់ពេល",
    "uploaded": "បានបង្ហោះ",
    "today": "ថ្ងៃនេះ",
    "last7": "7 ថ្ងៃចុងក្រោយ",
    "last14": "14 ថ្ងៃចុងក្រោយ",
    "last28": "28 ថ្ងៃចុងក្រោយ",
    "last90": "90 ថ្ងៃចុងក្រោយ",
    "lifetime": "គ្រប់ពេល",
    "photos": "រូបភាព",
    "text": "អត្ថបទ",
    "views": "Views",
    "engagement": "អន្តរកម្ម",
    "reactions": "ប្រតិកម្ម",
    "comments": "មតិយោបល់",
    "shares": "ការចែករំលែក",
    "justNow": "ឥឡូវនេះ",
    "pleaseLogin": "សូមចូលគណនីជាមុន",
    "authorNotFound": "រកមិនឃើញទំព័រអ្នកនិពន្ធ",
    "loadPostsFailed": "មិនអាចផ្ទុក Post បានទេ",
    "photo": "រូបភាព",
    "post": "Post",
    "photoUpdate": "ការអាប់ដេតរូបភាព",
    "postStatus": "ស្ថានភាព Post",
    "dateRanges": "ចន្លោះកាលបរិច្ឆេទ",
    "postType": "ប្រភេទ Post",
    "metrics": "ទិន្នន័យវាស់វែង",
    "closeFilters": "បិទតម្រង",
    "filters": "តម្រង",
    "loadLibraryFailed": "មិនអាចផ្ទុក {libraryText('contentLibrary')} បានទេ",
    "loadMoreFailed": "មិនអាចផ្ទុក Post បន្ថែមបានទេ",
    "back": "ត្រឡប់ក្រោយ",
    "pageDashboard": "Page Dashboard",
    "professionalDashboard": "{libraryText('professionalDashboard')}",
    "contentLibrary": "{libraryText('contentLibrary')}",
    "loadingPosts": "កំពុងផ្ទុក Post...",
    "loading": "កំពុងផ្ទុក...",
    "loadMore": "ផ្ទុកបន្ថែម",
    "noPosts": "រកមិនឃើញ Post",
    "noPostsHelp": "ប្តូរតម្រង ឬបង្កើត Author Post ថ្មី។"
  },
  "zh": {
    "allPosts": "全部帖子",
    "published": "已发布",
    "scheduled": "已排期",
    "uploaded": "已上传",
    "today": "今天",
    "last7": "最近 7 天",
    "last14": "最近 14 天",
    "last28": "最近 28 天",
    "last90": "最近 90 天",
    "lifetime": "全部时间",
    "photos": "图片",
    "text": "文字",
    "views": "浏览量",
    "engagement": "互动",
    "reactions": "反应",
    "comments": "评论",
    "shares": "分享",
    "justNow": "刚刚",
    "pleaseLogin": "请先登录",
    "authorNotFound": "未找到作者页面",
    "loadPostsFailed": "无法加载帖子",
    "photo": "图片",
    "post": "帖子",
    "photoUpdate": "图片动态",
    "postStatus": "帖子状态",
    "dateRanges": "日期范围",
    "postType": "帖子类型",
    "metrics": "指标",
    "closeFilters": "关闭筛选",
    "filters": "筛选",
    "loadLibraryFailed": "无法加载内容库",
    "loadMoreFailed": "无法加载更多帖子",
    "back": "返回",
    "pageDashboard": "页面控制台",
    "professionalDashboard": "专业控制台",
    "contentLibrary": "内容库",
    "loadingPosts": "正在加载帖子...",
    "loading": "加载中...",
    "loadMore": "加载更多",
    "noPosts": "未找到帖子",
    "noPostsHelp": "更改筛选条件或创建新的作者帖子。"
  },
  "ja": {
    "allPosts": "すべての投稿",
    "published": "公開済み",
    "scheduled": "予約済み",
    "uploaded": "アップロード済み",
    "today": "今日",
    "last7": "過去7日間",
    "last14": "過去14日間",
    "last28": "過去28日間",
    "last90": "過去90日間",
    "lifetime": "全期間",
    "photos": "写真",
    "text": "テキスト",
    "views": "閲覧数",
    "engagement": "エンゲージメント",
    "reactions": "リアクション",
    "comments": "コメント",
    "shares": "シェア",
    "justNow": "たった今",
    "pleaseLogin": "先にログインしてください",
    "authorNotFound": "作者ページが見つかりません",
    "loadPostsFailed": "投稿を読み込めませんでした",
    "photo": "写真",
    "post": "投稿",
    "photoUpdate": "写真の更新",
    "postStatus": "投稿ステータス",
    "dateRanges": "期間",
    "postType": "投稿タイプ",
    "metrics": "指標",
    "closeFilters": "フィルターを閉じる",
    "filters": "フィルター",
    "loadLibraryFailed": "コンテンツライブラリを読み込めませんでした",
    "loadMoreFailed": "投稿をさらに読み込めませんでした",
    "back": "戻る",
    "pageDashboard": "ページダッシュボード",
    "professionalDashboard": "プロフェッショナルダッシュボード",
    "contentLibrary": "コンテンツライブラリ",
    "loadingPosts": "投稿を読み込み中...",
    "loading": "読み込み中...",
    "loadMore": "さらに読み込む",
    "noPosts": "投稿が見つかりません",
    "noPostsHelp": "フィルターを変更するか、新しい作者投稿を作成してください。"
  },
  "ko": {
    "allPosts": "모든 게시물",
    "published": "게시됨",
    "scheduled": "예약됨",
    "uploaded": "업로드됨",
    "today": "오늘",
    "last7": "최근 7일",
    "last14": "최근 14일",
    "last28": "최근 28일",
    "last90": "최근 90일",
    "lifetime": "전체 기간",
    "photos": "사진",
    "text": "텍스트",
    "views": "조회수",
    "engagement": "참여",
    "reactions": "반응",
    "comments": "댓글",
    "shares": "공유",
    "justNow": "방금",
    "pleaseLogin": "먼저 로그인해 주세요",
    "authorNotFound": "작가 페이지를 찾을 수 없습니다",
    "loadPostsFailed": "게시물을 불러오지 못했습니다",
    "photo": "사진",
    "post": "게시물",
    "photoUpdate": "사진 업데이트",
    "postStatus": "게시물 상태",
    "dateRanges": "날짜 범위",
    "postType": "게시물 유형",
    "metrics": "지표",
    "closeFilters": "필터 닫기",
    "filters": "필터",
    "loadLibraryFailed": "콘텐츠 라이브러리를 불러오지 못했습니다",
    "loadMoreFailed": "게시물을 더 불러오지 못했습니다",
    "back": "뒤로",
    "pageDashboard": "페이지 대시보드",
    "professionalDashboard": "프로페셔널 대시보드",
    "contentLibrary": "콘텐츠 라이브러리",
    "loadingPosts": "게시물 불러오는 중...",
    "loading": "로딩 중...",
    "loadMore": "더 보기",
    "noPosts": "게시물을 찾을 수 없습니다",
    "noPostsHelp": "필터를 변경하거나 새 작가 게시물을 만드세요."
  }
})

function libraryText(key, options) {
  return getDisplayText(`authorPostsLibrary.${key}`, options)
}


const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'
const PAGE_SIZE = 30

const FILTER_OPTIONS = {
  status: [
    { value: 'all', labelKey: 'allPosts' },
    { value: 'published', labelKey: 'published' },
    { value: 'scheduled', labelKey: 'scheduled' },
    { value: 'uploaded', labelKey: 'uploaded' },
  ],
  date: [
    { value: 'today', labelKey: 'today' },
    { value: '7d', labelKey: 'last7' },
    { value: '14d', labelKey: 'last14' },
    { value: '28d', labelKey: 'last28' },
    { value: '90d', labelKey: 'last90' },
    { value: 'lifetime', labelKey: 'lifetime' },
  ],
  type: [
    { value: 'all', labelKey: 'allPosts' },
    { value: 'photo', labelKey: 'photos' },
    { value: 'text', labelKey: 'text' },
  ],
  metrics: [
    { value: 'views', labelKey: 'views' },
    { value: 'engagement', labelKey: 'engagement' },
    { value: 'reactions', labelKey: 'reactions' },
    { value: 'comments', labelKey: 'comments' },
    { value: 'shares', labelKey: 'shares' },
  ],
}

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
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}K`
  }

  return String(number)
}

function formatPostDate(value) {
  if (!value) return libraryText('justNow')

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return libraryText('justNow')

  return date.toLocaleString(getDisplayLanguageId(), {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function getOptionLabel(group, value) {
  return (
    libraryText(FILTER_OPTIONS[group]?.find((item) => item.value === value)?.labelKey || 'allPosts')
  )
}

function getDateCutoff(value) {
  const cutoff = new Date()
  cutoff.setHours(0, 0, 0, 0)

  if (value === 'today') return cutoff.getTime()

  const daysBack = {
    '7d': 6,
    '14d': 13,
    '28d': 27,
    '90d': 89,
  }[value]

  if (daysBack === undefined) return null

  cutoff.setDate(cutoff.getDate() - daysBack)
  return cutoff.getTime()
}

async function fetchMyAuthorPage() {
  const token = getAuthToken()

  if (!token) throw new Error(libraryText('pleaseLogin'))

  const response = await fetch(`${API_BASE_URL}/api/authors/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false || !data.author_page) {
    throw new Error(data.message || libraryText('authorNotFound'))
  }

  return data.author_page
}

async function fetchAuthorPostsPage(
  pageUsername,
  {
    before = '',
    statusFilter = 'all',
    dateRange = 'lifetime',
  } = {}
) {
  const token = getAuthToken()
  const params = new URLSearchParams({
    limit: String(PAGE_SIZE),
    content_library: '1',
  })

  const statusMap = {
    published: 'active',
    scheduled: 'scheduled',
    uploaded: 'uploaded',
  }

  if (statusMap[statusFilter]) {
    params.set('status', statusMap[statusFilter])
  }

  const cutoff = getDateCutoff(dateRange)

  if (cutoff) {
    params.set('after', new Date(cutoff).toISOString())
  }

  if (before) {
    params.set('before', before)
  }

  const response = await fetch(
    `${API_BASE_URL}/api/authors/page/${encodeURIComponent(
      pageUsername
    )}/posts?${params.toString()}`,
    {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    }
  )
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || libraryText('loadPostsFailed'))
  }

  return {
    posts: Array.isArray(data.posts) ? data.posts : [],
    hasMore: Boolean(data.has_more),
    nextBefore: data.next_before || '',
  }
}

function getPostType(post) {
  return Array.isArray(post?.image_urls) && post.image_urls.length ? 'Photo' : 'Post'
}

function getPostMetric(post, metricMode) {
  if (metricMode === 'engagement') {
    return (
      Number(post?.like_count || 0) +
      Number(post?.comment_count || 0) +
      Number(post?.echo_count || 0)
    )
  }

  if (metricMode === 'reactions') {
    return Number(post?.like_count || 0)
  }

  if (metricMode === 'comments') {
    return Number(post?.comment_count || 0)
  }

  if (metricMode === 'shares') {
    return Number(post?.echo_count || 0)
  }

  return Number(post?.view_count || 0)
}

function PostThumbnail({ post }) {
  const imageUrl = Array.isArray(post?.image_urls) ? post.image_urls[0] : ''

  return (
    <span className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-[var(--shadow-bg-soft)]">
      {imageUrl ? (
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-tertiary)]">
          <i className="fa-solid fa-a text-[16px]" />
        </span>
      )}
    </span>
  )
}

function PostListRow({ post, metricMode, onOpen }) {
  const postType = getPostType(post)
  const metric = getPostMetric(post, metricMode)
  const title =
    String(post?.content || '')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find(Boolean) || libraryText('photoUpdate')

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 px-4 py-2.5 text-left active:bg-[var(--shadow-bg-hover)]"
    >
      <PostThumbnail post={post} />

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-normal leading-5 text-[var(--shadow-text-primary)]">
          {title}
        </span>

        <span className="mt-1 flex items-center gap-1.5 text-[12px] font-normal text-[var(--shadow-text-secondary)]">
          <i
            className={`${postType === 'Photo' ? 'fa-regular fa-image' : 'fa-solid fa-font'} text-[12px]`}
          />
          <span>{libraryText(postType === 'Photo' ? 'photo' : 'post')}</span>
          <span>·</span>
          <span>{formatPostDate(post.created_at)}</span>
        </span>
      </span>

      <span className="mr-1 flex w-[58px] shrink-0 flex-col items-center justify-center pr-1 text-center">
        <span className="block text-[16px] font-medium leading-5 text-[var(--shadow-text-primary)]">
          {formatCompactNumber(metric)}
        </span>
        <span className="mt-0.5 block text-[9px] font-normal leading-3 text-[var(--shadow-text-tertiary)]">
          {getOptionLabel('metrics', metricMode)}
        </span>
      </span>
    </button>
  )
}

function FilterSheet({
  open,
  section,
  onClose,
  onSectionChange,
  statusFilter,
  dateRange,
  typeFilter,
  metricMode,
  onStatusChange,
  onDateChange,
  onTypeChange,
  onMetricChange,
}) {
  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  const selectedValues = {
    status: statusFilter,
    date: dateRange,
    type: typeFilter,
    metrics: metricMode,
  }

  const rows = [
    {
      key: 'status',
      label: libraryText('postStatus'),
      value: getOptionLabel('status', statusFilter),
    },
    {
      key: 'date',
      label: libraryText('dateRanges'),
      value: getOptionLabel('date', dateRange),
    },
    {
      key: 'type',
      label: libraryText('postType'),
      value: getOptionLabel('type', typeFilter),
    },
    {
      key: 'metrics',
      label: libraryText('metrics'),
      value: getOptionLabel('metrics', metricMode),
    },
  ]

  const setters = {
    status: onStatusChange,
    date: onDateChange,
    type: onTypeChange,
    metrics: onMetricChange,
  }

  function chooseOption(value) {
    setters[section]?.(value)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[200]">
      <button
        type="button"
        aria-label={libraryText('closeFilters')}
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-black/40"
      />

      <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[760px] rounded-t-[26px] bg-[var(--shadow-bg-soft)] px-4 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-3 shadow-2xl">
        <div className="mx-auto h-1 w-14 rounded-full bg-[var(--shadow-border-strong)]" />

        <div
          className={`flex min-h-[58px] items-center justify-center ${
            section !== 'menu' ? 'border-b border-[var(--shadow-border)]' : ''
          }`}
        >
          <h2 className="text-center text-[17px] font-bold text-[var(--shadow-text-primary)]">
            {section === 'menu'
              ? libraryText('filters')
              : rows.find((item) => item.key === section)?.label || libraryText('filters')}
          </h2>
        </div>
        {section === 'menu' ? (
          <div className="overflow-hidden rounded-[18px] bg-[var(--shadow-bg-surface)]">
            {rows.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => onSectionChange(item.key)}
                className="flex w-full items-center gap-4 px-4 py-3 text-left active:bg-[var(--shadow-bg-hover)]"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[17px] font-medium leading-5 text-[var(--shadow-text-primary)]">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-[15px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
                    {item.value}
                  </span>
                </span>

                <i className="fa-solid fa-chevron-right text-[20px] text-[var(--shadow-text-secondary)]" />
              </button>
            ))}
          </div>
        ) : (
          <div className="max-h-[64vh] overflow-y-auto rounded-[18px] bg-[var(--shadow-bg-surface)]">
            {(FILTER_OPTIONS[section] || []).map((item) => {
              const selected = selectedValues[section] === item.value

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => chooseOption(item.value)}
                  className="flex w-full items-center gap-4 px-4 py-4 text-left active:bg-[var(--shadow-bg-hover)]"
                >
                  <span className="min-w-0 flex-1 text-[16px] font-medium text-[var(--shadow-text-primary)]">
                    {item.label}
                  </span>

                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                      selected
                        ? 'border-[#111827]'
                        : 'border-[var(--shadow-border-strong)]'
                    }`}
                  >
                    {selected ? (
                      <span className="h-3 w-3 rounded-full bg-[#111827]" />
                    ) : null}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AuthorPostsContentLibraryPage() {
  useDisplayTranslation()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [authorPageUsername, setAuthorPageUsername] = useState('')
  const [nextBefore, setNextBefore] = useState('')
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [message, setMessage] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [filterSection, setFilterSection] = useState('menu')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateRange, setDateRange] = useState('lifetime')
  const [typeFilter, setTypeFilter] = useState('all')
  const [metricMode, setMetricMode] = useState('views')

  const openFilter = useCallback((section = 'menu') => {
    setFilterSection(section)
    setFilterOpen(true)
  }, [])

  const closeFilter = useCallback(() => {
    setFilterOpen(false)
    setFilterSection('menu')
  }, [])

  const loadFirstPage = useCallback(async () => {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      setMessage('')
      setHasMore(false)
      setNextBefore('')

      const page = await fetchMyAuthorPage()
      const result = await fetchAuthorPostsPage(
        page.page_username,
        {
          statusFilter,
          dateRange,
        }
      )

      setAuthorPageUsername(page.page_username)
      setPosts(result.posts)
      setNextBefore(result.nextBefore)
      setHasMore(result.hasMore)
    } catch (error) {
      setMessage(error.message || libraryText('loadLibraryFailed'))
    } finally {
      setLoading(false)
    }
  }, [dateRange, navigate, statusFilter])

  useEffect(() => {
    loadFirstPage()
  }, [loadFirstPage])

  const loadMore = useCallback(async () => {
    if (
      !authorPageUsername ||
      !hasMore ||
      loadingMore ||
      !nextBefore
    ) {
      return
    }

    try {
      setLoadingMore(true)

      const result = await fetchAuthorPostsPage(
        authorPageUsername,
        {
          before: nextBefore,
          statusFilter,
          dateRange,
        }
      )

      setPosts((current) => {
        const postMap = new Map(
          current.map((post) => [String(post.id), post])
        )

        result.posts.forEach((post) => {
          if (post?.id) {
            postMap.set(String(post.id), post)
          }
        })

        return [...postMap.values()]
      })

      setNextBefore(result.nextBefore)
      setHasMore(result.hasMore)
    } catch (error) {
      setMessage(error.message || libraryText('loadMoreFailed'))
    } finally {
      setLoadingMore(false)
    }
  }, [
    authorPageUsername,
    dateRange,
    hasMore,
    loadingMore,
    nextBefore,
    statusFilter,
  ])

  const visiblePosts = useMemo(() => {
    let nextPosts = [...posts]

    if (statusFilter !== 'all') {
      const expectedStatus = {
        published: 'active',
        scheduled: 'scheduled',
        uploaded: 'uploaded',
      }[statusFilter]

      nextPosts = nextPosts.filter(
        (post) =>
          String(post?.status || '').toLowerCase() === expectedStatus
      )
    }

    const cutoff = getDateCutoff(dateRange)

    if (cutoff) {
      nextPosts = nextPosts.filter((post) => {
        const createdAt = new Date(post?.created_at || 0).getTime()
        return Number.isFinite(createdAt) && createdAt >= cutoff
      })
    }

    if (typeFilter === 'photo') {
      nextPosts = nextPosts.filter(
        (post) => Array.isArray(post?.image_urls) && post.image_urls.length
      )
    }

    if (typeFilter === 'text') {
      nextPosts = nextPosts.filter(
        (post) => !Array.isArray(post?.image_urls) || !post.image_urls.length
      )
    }

    nextPosts.sort(
      (a, b) =>
        getPostMetric(b, metricMode) - getPostMetric(a, metricMode) ||
        new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
    )

    return nextPosts
  }, [dateRange, metricMode, posts, statusFilter, typeFilter])

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-surface)]">
      {message ? (
        <button
          type="button"
          onClick={() => setMessage('')}
          className="fixed left-1/2 top-[82px] z-[120] w-[calc(100%-2rem)] max-w-[460px] -translate-x-1/2 rounded-[14px] bg-[#111827] px-4 py-3 text-left text-[12px] font-semibold text-white shadow-xl"
        >
          {message}
        </button>
      ) : null}

      <header className="sticky top-0 z-50 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] backdrop-blur">
        <div className="mx-auto flex min-h-[54px] max-w-[760px] items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)]"
            aria-label={libraryText('back')}
          >
            <i className="fa-solid fa-chevron-left text-[22px]" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[16px] font-bold leading-5 text-[var(--shadow-text-primary)]">
              {libraryText('professionalDashboard')}
            </h1>
            <p className="mt-0.5 text-[13px] font-normal text-[var(--shadow-text-secondary)]">
              {libraryText('contentLibrary')}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/author/page/dashboard')}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-[#111827] text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={libraryText('pageDashboard')}
          >
            <i className="fa-solid fa-chart-simple text-[15px]" />
          </button>
        </div>

        <div className="mx-auto max-w-[760px] overflow-x-auto px-4 pb-2.5">
          <div className="flex min-w-max gap-2">
            <button
              type="button"
              onClick={() => openFilter('menu')}
              className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]"
              aria-label={libraryText('filters')}
            >
              <i className="fa-solid fa-sliders text-[12px]" />
            </button>

            <button
              type="button"
              onClick={() => openFilter('date')}
              className="flex h-9 items-center gap-2 rounded-[11px] bg-[var(--shadow-bg-soft)] px-3.5 text-[13px] font-semibold text-[var(--shadow-text-primary)]"
            >
              {getOptionLabel('date', dateRange)}
              <i className="fa-solid fa-caret-down text-[12px]" />
            </button>

            <button
              type="button"
              onClick={() => openFilter('type')}
              className="flex h-9 items-center gap-2 rounded-[11px] bg-[var(--shadow-bg-soft)] px-3.5 text-[13px] font-semibold text-[var(--shadow-text-primary)]"
            >
              {getOptionLabel('type', typeFilter)}
              <i className="fa-solid fa-caret-down text-[12px]" />
            </button>

            <button
              type="button"
              onClick={() => openFilter('metrics')}
              className="flex h-9 items-center gap-2 rounded-[11px] bg-[var(--shadow-bg-soft)] px-3.5 text-[13px] font-semibold text-[var(--shadow-text-primary)]"
            >
              {getOptionLabel('metrics', metricMode)}
              <i className="fa-solid fa-caret-down text-[12px]" />
            </button>

            <button
              type="button"
              onClick={() => openFilter('status')}
              className="flex h-9 items-center gap-2 rounded-[11px] bg-[var(--shadow-bg-soft)] px-3.5 text-[13px] font-semibold text-[var(--shadow-text-primary)]"
            >
              {getOptionLabel('status', statusFilter)}
              <i className="fa-solid fa-caret-down text-[12px]" />
            </button>

          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] pb-10">
        {loading ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-[var(--shadow-border)] border-t-[#111827]" />
            <div className="mt-4 text-[13px] font-semibold text-[var(--shadow-text-secondary)]">
              {libraryText('loadingPosts')}
            </div>
          </div>
        ) : visiblePosts.length || hasMore ? (
          <>
            <div className="divide-y divide-[var(--shadow-border)]">
              {visiblePosts.map((post) => (
                <PostListRow
                  key={post.id}
                  post={post}
                  metricMode={metricMode}
                  onOpen={() => navigate(`/author/page?post=${post.id}`)}
                />
              ))}
            </div>

            {hasMore ? (
              <div className="px-4 py-5">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="h-11 w-full rounded-[12px] bg-[var(--shadow-bg-soft)] text-[14px] font-semibold text-[var(--shadow-text-primary)] disabled:opacity-60"
                >
                  {loadingMore ? libraryText('loading') : libraryText('loadMore')}
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]">
              <i className="fa-regular fa-rectangle-list text-[20px]" />
            </span>
            <h2 className="mt-4 text-[16px] font-black text-[var(--shadow-text-primary)]">
              {libraryText('noPosts')}
            </h2>
            <p className="mt-2 max-w-[280px] text-[13px] font-medium leading-6 text-[var(--shadow-text-secondary)]">
              {libraryText('noPostsHelp')}
            </p>
          </div>
        )}

      </main>

      <FilterSheet
        open={filterOpen}
        section={filterSection}
        onClose={closeFilter}
        onSectionChange={setFilterSection}
        statusFilter={statusFilter}
        dateRange={dateRange}
        typeFilter={typeFilter}
        metricMode={metricMode}
        onStatusChange={setStatusFilter}
        onDateChange={setDateRange}
        onTypeChange={setTypeFilter}
        onMetricChange={setMetricMode}
      />
    </div>
  )
}
