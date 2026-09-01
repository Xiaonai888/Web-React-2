import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'
const PAGE_SIZE = 30

const FILTER_OPTIONS = {
  status: [
  { value: 'all', label: 'All posts' },
  { value: 'published', label: 'Published' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'uploaded', label: 'Uploaded' },
],
  date: [
    { value: 'today', label: 'Today' },
    { value: '7d', label: 'Last 7 days' },
    { value: '14d', label: 'Last 14 days' },
    { value: '28d', label: 'Last 28 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: 'lifetime', label: 'Lifetime' },
  ],
  type: [
    { value: 'all', label: 'All posts' },
    { value: 'photo', label: 'Photos' },
    { value: 'text', label: 'Text' },
  ],
  metrics: [
    { value: 'views', label: 'Views' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'reactions', label: 'Reactions' },
    { value: 'comments', label: 'Comments' },
    { value: 'shares', label: 'Shares' },
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
  if (!value) return 'Just now'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Just now'

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function getOptionLabel(group, value) {
  return (
    FILTER_OPTIONS[group]?.find((item) => item.value === value)?.label || ''
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

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/authors/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false || !data.author_page) {
    throw new Error(data.message || 'Author page not found')
  }

  return data.author_page
}

async function fetchAuthorPostsPage(pageUsername, before = '') {
  const token = getAuthToken()
  const params = new URLSearchParams({
    limit: '100',
    content_library: '1',
  })

  if (before) params.set('before', before)

  const response = await fetch(
    `${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}/posts?${params.toString()}`,
    {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    }
  )
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to load posts')
  }

  return Array.isArray(data.posts) ? data.posts : []
}

async function fetchAllAuthorPosts(pageUsername) {
  const postMap = new Map()
  let before = ''

  for (let pageIndex = 0; pageIndex < 100; pageIndex += 1) {
    const batch = await fetchAuthorPostsPage(pageUsername, before)

    if (!batch.length) break

    const previousSize = postMap.size

    batch.forEach((post) => {
      if (post?.id) postMap.set(String(post.id), post)
    })

    if (batch.length < 100 || postMap.size === previousSize) break

    const oldestCreatedAt = batch
      .map((post) => post?.created_at)
      .filter(Boolean)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0]

    if (!oldestCreatedAt || oldestCreatedAt === before) break

    before = oldestCreatedAt
  }

  return [...postMap.values()]
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
    <span className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-[#e5e7eb]">
      {imageUrl ? (
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-white/80 text-[#9ca3af]">
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
      .find(Boolean) || 'Photo update'

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 px-4 py-2.5 text-left active:bg-[#f8fafc]"
    >
      <PostThumbnail post={post} />

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-normal leading-5 text-[#111827]">
          {title}
        </span>

        <span className="mt-1 flex items-center gap-1.5 text-[12px] font-normal text-[#6b7280]">
          <i
            className={`${postType === 'Photo' ? 'fa-regular fa-image' : 'fa-solid fa-font'} text-[12px]`}
          />
          <span>{postType}</span>
          <span>·</span>
          <span>{formatPostDate(post.created_at)}</span>
        </span>
      </span>

      <span className="mr-2 w-[62px] shrink-0 text-right">
        <span className="block text-[16px] font-medium text-[#111827]">
          {formatCompactNumber(metric)}
        </span>
        <span className="mt-0.5 block text-[9px] font-normal text-[#9ca3af]">
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
      label: 'Post status',
      value: getOptionLabel('status', statusFilter),
    },
    {
      key: 'date',
      label: 'Date ranges',
      value: getOptionLabel('date', dateRange),
    },
    {
      key: 'type',
      label: 'Post type',
      value: getOptionLabel('type', typeFilter),
    },
    {
      key: 'metrics',
      label: 'Metrics',
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
        aria-label="Close filters"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-black/40"
      />

      <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[760px] rounded-t-[26px] bg-[#f5f6fa] px-4 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-3 shadow-2xl">
        <div className="mx-auto h-1 w-14 rounded-full bg-[#8b8d93]" />

        <div
          className={`flex min-h-[58px] items-center justify-center ${
            section !== 'menu' ? 'border-b border-[#d9dde4]' : ''
          }`}
        >
          <h2 className="text-center text-[17px] font-bold text-[#111827]">
            {section === 'menu'
              ? 'Filters'
              : rows.find((item) => item.key === section)?.label || 'Filters'}
          </h2>
        </div>
        {section === 'menu' ? (
          <div className="overflow-hidden rounded-[18px] bg-white">
            {rows.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => onSectionChange(item.key)}
                className="flex w-full items-center gap-4 px-4 py-3 text-left active:bg-[#f3f4f6]"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[17px] font-medium leading-5 text-[#111827]">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-[15px] font-normal leading-5 text-[#6b7280]">
                    {item.value}
                  </span>
                </span>

                <i className="fa-solid fa-chevron-right text-[20px] text-[#6b7280]" />
              </button>
            ))}
          </div>
        ) : (
          <div className="max-h-[64vh] overflow-y-auto rounded-[18px] bg-white">
            {(FILTER_OPTIONS[section] || []).map((item) => {
              const selected = selectedValues[section] === item.value

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => chooseOption(item.value)}
                  className="flex w-full items-center gap-4 px-4 py-4 text-left active:bg-[#f3f4f6]"
                >
                  <span className="min-w-0 flex-1 text-[16px] font-medium text-[#111827]">
                    {item.label}
                  </span>

                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                      selected
                        ? 'border-[#111827]'
: 'border-[#6b7280]'
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
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
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

      const page = await fetchMyAuthorPage()
      const nextPosts = await fetchAllAuthorPosts(page.page_username)

      setPosts(nextPosts)
    } catch (error) {
      setMessage(error.message || 'Failed to load Content Library')
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    loadFirstPage()
  }, [loadFirstPage])

  const visiblePosts = useMemo(() => {
    let nextPosts = [...posts]

    if (statusFilter !== 'all') {
  const expectedStatus = {
    published: 'active',
    scheduled: 'scheduled',
    uploaded: 'uploaded',
  }[statusFilter]
  nextPosts = nextPosts.filter((post) =>
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
    <div className="min-h-screen bg-white">
      {message ? (
        <button
          type="button"
          onClick={() => setMessage('')}
          className="fixed left-1/2 top-[82px] z-[120] w-[calc(100%-2rem)] max-w-[460px] -translate-x-1/2 rounded-[14px] bg-[#111827] px-4 py-3 text-left text-[12px] font-semibold text-white shadow-xl"
        >
          {message}
        </button>
      ) : null}

      <header className="sticky top-0 z-50 border-b border-[#e5e7eb] bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-[60px] max-w-[760px] items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
            aria-label="Back"
          >
            <i className="fa-solid fa-chevron-left text-[22px]" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[17px] font-bold leading-5 text-[#111827]">
              Professional Dashboard
            </h1>
            <p className="mt-0.5 text-[14px] font-normal text-[#6b7280]">
              Content Library
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/author/page/dashboard')}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-[#111827] text-[#111827] active:scale-95"
            aria-label="Page Dashboard"
          >
            <i className="fa-solid fa-chart-simple text-[17px]" />
          </button>
        </div>

        <div className="mx-auto max-w-[760px] overflow-x-auto px-4 pb-3">
          <div className="flex min-w-max gap-2">
            <button
              type="button"
              onClick={() => openFilter('menu')}
              className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#eef0f4] text-[#111827]"
              aria-label="Filters"
            >
              <i className="fa-solid fa-sliders text-[13px]" />
            </button>

            <button
              type="button"
              onClick={() => openFilter('date')}
              className="flex h-11 items-center gap-2 rounded-[12px] bg-[#eef0f4] px-4 text-[14px] font-semibold text-[#111827]"
            >
              {getOptionLabel('date', dateRange)}
              <i className="fa-solid fa-caret-down text-[12px]" />
            </button>

            <button
              type="button"
              onClick={() => openFilter('type')}
              className="flex h-11 items-center gap-2 rounded-[12px] bg-[#eef0f4] px-4 text-[14px] font-semibold text-[#111827]"
            >
              {getOptionLabel('type', typeFilter)}
              <i className="fa-solid fa-caret-down text-[12px]" />
            </button>

            <button
              type="button"
              onClick={() => openFilter('metrics')}
              className="flex h-11 items-center gap-2 rounded-[12px] bg-[#eef0f4] px-4 text-[14px] font-semibold text-[#111827]"
            >
              {getOptionLabel('metrics', metricMode)}
              <i className="fa-solid fa-caret-down text-[12px]" />
            </button>

            <button
              type="button"
              onClick={() => openFilter('status')}
              className="flex h-11 items-center gap-2 rounded-[12px] bg-[#eef0f4] px-4 text-[14px] font-semibold text-[#111827]"
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
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#111827]" />
            <div className="mt-4 text-[13px] font-semibold text-[#6b7280]">
              Loading posts...
            </div>
          </div>
        ) : visiblePosts.length ? (
          <div className="divide-y divide-[#eef0f4]">
            {visiblePosts.map((post) => (
              <PostListRow
                key={post.id}
                post={post}
                metricMode={metricMode}
                onOpen={() => navigate(`/author/page?post=${post.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eef0f4] text-[#6b7280]">
              <i className="fa-regular fa-rectangle-list text-[20px]" />
            </span>
            <h2 className="mt-4 text-[16px] font-black text-[#111827]">
              No posts found
            </h2>
            <p className="mt-2 max-w-[280px] text-[13px] font-medium leading-6 text-[#6b7280]">
              Change the filters or create a new Author Post.
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
