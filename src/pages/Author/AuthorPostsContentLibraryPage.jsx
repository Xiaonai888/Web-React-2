import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

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
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}K`

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

async function fetchAuthorPosts(pageUsername, before = '') {
  const params = new URLSearchParams({ limit: '30' })

  if (before) params.set('before', before)

  const response = await fetch(
    `${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}/posts?${params.toString()}`
  )
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to load posts')
  }

  return Array.isArray(data.posts) ? data.posts : []
}

function getPostType(post) {
  return Array.isArray(post?.image_urls) && post.image_urls.length ? 'Photo' : 'Post'
}

function getPostMetric(post) {
  return (
    Number(post?.like_count || 0) +
    Number(post?.comment_count || 0) +
    Number(post?.echo_count || 0)
  )
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

function PostListRow({ post, onOpen }) {
  const postType = getPostType(post)
  const hasViews = Number.isFinite(Number(post?.view_count))
  const metric = hasViews ? Number(post.view_count) : getPostMetric(post)
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

      <span className="w-[62px] shrink-0 text-right">
        <span className="block text-[16px] font-medium text-[#111827]">
          {formatCompactNumber(metric)}
        </span>
        <span className="mt-0.5 block text-[9px] font-normal text-[#9ca3af]">
          {hasViews ? 'Views' : 'Engagement'}
        </span>
      </span>
    </button>
  )
}

export default function AuthorPostsContentLibraryPage() {
  const navigate = useNavigate()
  const [authorPage, setAuthorPage] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [message, setMessage] = useState('')
  const [pinnedOnly, setPinnedOnly] = useState(false)
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortMode, setSortMode] = useState('engagement')

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
      const nextPosts = await fetchAuthorPosts(page.page_username)

      setAuthorPage(page)
      setPosts(nextPosts)
      setHasMore(nextPosts.length === 30)
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

    if (pinnedOnly) {
      nextPosts = nextPosts.filter((post) => post?.is_pinned)
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

    if (sortMode === 'engagement') {
      nextPosts.sort(
        (a, b) =>
          getPostMetric(b) - getPostMetric(a) ||
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      )
    }

    if (sortMode === 'newest') {
      nextPosts.sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      )
    }

    if (sortMode === 'oldest') {
      nextPosts.sort(
        (a, b) =>
          new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
      )
    }

    return nextPosts
  }, [pinnedOnly, posts, sortMode, typeFilter])

  async function loadMorePosts() {
    if (!authorPage?.page_username || loadingMore || !hasMore || !posts.length) return

    const oldestPost = [...posts].sort(
      (a, b) =>
        new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
    )[0]
    const before = String(oldestPost?.created_at || '').slice(0, 10)

    if (!before) return

    try {
      setLoadingMore(true)
      setMessage('')

      const nextPosts = await fetchAuthorPosts(authorPage.page_username, before)

      setPosts((current) => {
        const postMap = new Map(current.map((post) => [post.id, post]))

        nextPosts.forEach((post) => postMap.set(post.id, post))

        return [...postMap.values()]
      })
      setHasMore(nextPosts.length === 30)
    } catch (error) {
      setMessage(error.message || 'Failed to load more posts')
    } finally {
      setLoadingMore(false)
    }
  }

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
              onClick={() => setPinnedOnly((current) => !current)}
              className={`flex h-11 items-center gap-2 rounded-[12px] px-4 text-[14px] font-semibold ${
                pinnedOnly
                  ? 'bg-[#dbeeff] text-[#1674c4]'
                  : 'bg-[#eef0f4] text-[#111827]'
              }`}
            >
              <i className="fa-solid fa-sliders text-[13px]" />
              {pinnedOnly ? '(1)' : 'Filter'}
            </button>

            <button
              type="button"
              className="flex h-11 items-center gap-2 rounded-[12px] bg-[#eef0f4] px-4 text-[14px] font-semibold text-[#111827]"
            >
              Lifetime
              <i className="fa-solid fa-caret-down text-[12px]" />
            </button>

            <label className="relative">
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className="h-11 appearance-none rounded-[12px] bg-[#eef0f4] pl-4 pr-9 text-[14px] font-semibold text-[#111827] outline-none"
              >
                <option value="all">All posts</option>
                <option value="photo">Photo posts</option>
                <option value="text">Text posts</option>
              </select>
              <i className="fa-solid fa-caret-down pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[#111827]" />
            </label>

            <label className="relative">
              <select
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value)}
                className="h-11 appearance-none rounded-[12px] bg-[#dbeeff] pl-4 pr-9 text-[14px] font-semibold text-[#1674c4] outline-none"
              >
                <option value="engagement">Engagement</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
              <i className="fa-solid fa-caret-down pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[#1674c4]" />
            </label>
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

        {hasMore && !loading ? (
          <div className="px-4 py-5">
            <button
              type="button"
              disabled={loadingMore}
              onClick={loadMorePosts}
              className="h-11 w-full rounded-[12px] bg-[#eef0f4] text-[14px] font-semibold text-[#111827] disabled:text-[#9ca3af]"
            >
              {loadingMore ? 'Loading...' : 'Load more posts'}
            </button>
          </div>
        ) : null}
      </main>
    </div>
  )
}
