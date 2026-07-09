import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

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

function formatPostTime(value) {
  const timestamp = new Date(value || 0).getTime()

  if (!timestamp) return 'Just now'

  const difference = Math.max(0, Date.now() - timestamp)
  const minutes = Math.floor(difference / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(new Date(timestamp))
}

function getInitial(value) {
  return String(value || 'A').trim().slice(0, 1).toUpperCase()
}

function mergePosts(current, incoming) {
  const seen = new Set()
  const merged = []

  for (const post of [...current, ...incoming]) {
    if (!post?.id || seen.has(post.id)) continue

    seen.add(post.id)
    merged.push(post)
  }

  return merged
}

function PostSkeleton() {
  return (
    <article className="overflow-hidden bg-white shadow-sm ring-1 ring-gray-100 sm:rounded-[22px]">
      <div className="flex animate-pulse items-start gap-3 p-4">
        <div className="h-11 w-11 shrink-0 rounded-full bg-gray-200" />
        <div className="min-w-0 flex-1">
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="mt-2 h-3 w-24 rounded bg-gray-100" />
          <div className="mt-5 h-3 w-full rounded bg-gray-100" />
          <div className="mt-2 h-3 w-4/5 rounded bg-gray-100" />
        </div>
      </div>
      <div className="h-[240px] animate-pulse bg-gray-100" />
    </article>
  )
}

function EmptyState() {
  return (
    <article className="bg-white p-7 text-center shadow-sm ring-1 ring-gray-100 sm:rounded-[22px]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f1edfb] text-[#7c3aed]">
        <i className="fa-solid fa-user-plus text-xl" />
      </div>
      <h2 className="mt-4 text-[17px] font-black text-[#111827]">
        No posts yet
      </h2>
      <p className="mx-auto mt-2 max-w-[300px] text-[13px] font-semibold leading-6 text-gray-500">
        Follow authors to see their latest posts here.
      </p>
      <Link
        to="/authors/top"
        className="mt-5 inline-flex items-center justify-center rounded-full bg-[#111827] px-5 py-2.5 text-[12px] font-black text-white active:scale-[0.98]"
      >
        Find authors
      </Link>
    </article>
  )
}

function ErrorState({ onRetry }) {
  return (
    <article className="bg-white p-7 text-center shadow-sm ring-1 ring-gray-100 sm:rounded-[22px]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
        <i className="fa-solid fa-triangle-exclamation text-xl" />
      </div>
      <h2 className="mt-4 text-[17px] font-black text-[#111827]">
        Could not load posts
      </h2>
      <p className="mx-auto mt-2 max-w-[300px] text-[13px] font-semibold leading-6 text-gray-500">
        Check your connection and try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-full bg-[#111827] px-5 py-2.5 text-[12px] font-black text-white active:scale-[0.98]"
      >
        Retry
      </button>
    </article>
  )
}

function SingleImage({ url, alt }) {
  return (
    <div className="bg-gray-100">
      <img
        src={url}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="max-h-[620px] w-full object-cover"
      />
    </div>
  )
}

function PostImageGrid({ images, authorName }) {
  const urls = Array.isArray(images) ? images.filter(Boolean).slice(0, 5) : []

  if (!urls.length) return null

  const alt = `${authorName || 'Author'} post`

  if (urls.length === 1) {
    return <SingleImage url={urls[0]} alt={alt} />
  }

  if (urls.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-[2px] bg-gray-100">
        {urls.map((url) => (
          <img
            key={url}
            src={url}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="h-[260px] w-full object-cover sm:h-[310px]"
          />
        ))}
      </div>
    )
  }

  if (urls.length === 3) {
    return (
      <div className="grid h-[340px] grid-cols-2 gap-[2px] bg-gray-100 sm:h-[400px]">
        <img
          src={urls[0]}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <div className="grid min-h-0 grid-rows-2 gap-[2px]">
          {urls.slice(1).map((url) => (
            <img
              key={url}
              src={url}
              alt={alt}
              loading="lazy"
              decoding="async"
              className="h-full min-h-0 w-full object-cover"
            />
          ))}
        </div>
      </div>
    )
  }

  const visibleUrls = urls.slice(0, 4)
  const hiddenCount = Math.max(0, urls.length - 4)

  return (
    <div className="grid grid-cols-2 gap-[2px] bg-gray-100">
      {visibleUrls.map((url, index) => (
        <div key={url} className="relative">
          <img
            src={url}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="h-[210px] w-full object-cover sm:h-[250px]"
          />
          {index === 3 && hiddenCount > 0 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-[28px] font-black text-white">
              +{hiddenCount}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

function ReactionSummary({ summary, likeCount }) {
  const icons = {
    love: '❤️',
    haha: '😂',
    wow: '😮',
    sad: '😢',
    angry: '😡',
    support: '👏',
    touched: '🥹',
  }

  const items = Array.isArray(summary) ? summary.slice(0, 3) : []

  return (
    <div className="flex items-center gap-1">
      {items.length ? (
        <div className="flex -space-x-1">
          {items.map((item) => (
            <span
              key={item.type}
              className="flex h-5 w-5 items-center justify-center rounded-full border border-white bg-[#f5f3fa] text-[11px]"
            >
              {icons[item.type] || '❤️'}
            </span>
          ))}
        </div>
      ) : null}
      <span>{Number(likeCount || 0)}</span>
    </div>
  )
}

function FollowedPostCard({ post }) {
  const author = post.author_page || {}
  const authorName = author.page_name || 'Author'
  const pageUsername = author.page_username || ''
  const pageUrl = pageUsername
    ? `/author/page/${encodeURIComponent(pageUsername)}`
    : '#'

  return (
    <article className="overflow-hidden bg-white shadow-sm ring-1 ring-gray-100 sm:rounded-[22px]">
      <div className="flex items-start gap-3 p-4">
        <Link
          to={pageUrl}
          className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[14px] font-black text-white"
          aria-label={`Open ${authorName}`}
        >
          {author.avatar_url ? (
            <img
              src={author.avatar_url}
              alt={authorName}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            getInitial(authorName)
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                to={pageUrl}
                className="block truncate text-[15px] font-black text-[#111827]"
              >
                {authorName}
              </Link>

              <div className="mt-0.5 flex items-center gap-1 text-[11px] font-bold text-gray-400">
                {pageUsername ? <span>@{pageUsername}</span> : null}
                {pageUsername ? <span>·</span> : null}
                <span>{formatPostTime(post.created_at)}</span>
                <span>·</span>
                <i className="fa-solid fa-earth-americas text-[10px]" />
              </div>
            </div>
          </div>

          {post.content ? (
            <p className="mt-3 whitespace-pre-wrap break-words text-[14px] font-semibold leading-6 text-[#111827]">
              {post.content}
            </p>
          ) : null}
        </div>
      </div>

      <PostImageGrid
        images={post.image_urls}
        authorName={authorName}
      />

      <div className="flex items-center justify-between px-4 py-3 text-[12px] font-bold text-gray-500">
        <ReactionSummary
          summary={post.reaction_summary}
          likeCount={post.like_count}
        />
        <div>
          {Number(post.comment_count || 0)}{' '}
          {Number(post.comment_count || 0) === 1 ? 'comment' : 'comments'}
        </div>
      </div>
    </article>
  )
}

export default function DiscoverFollowedPosts() {
  const token = useMemo(() => getAuthToken(), [])
  const [posts, setPosts] = useState([])
  const [cursor, setCursor] = useState(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')

  const loadPosts = useCallback(
    async ({ reset = false } = {}) => {
      if (!token) {
        setPosts([])
        setCursor(null)
        setHasMore(false)
        setLoading(false)
        setLoadingMore(false)
        setError('')
        return
      }

      const activeCursor = reset ? null : cursor
      const parameters = new URLSearchParams({ limit: '10' })

      if (activeCursor) {
        parameters.set('cursor', activeCursor)
      }

      if (reset) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      setError('')

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/authors/following/posts/feed?${parameters.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load posts')
        }

        const incomingPosts = Array.isArray(data.posts) ? data.posts : []

        setPosts((current) =>
          reset ? incomingPosts : mergePosts(current, incomingPosts)
        )
        setCursor(data.next_cursor || null)
        setHasMore(Boolean(data.has_more && data.next_cursor))
      } catch (loadError) {
        setError(loadError.message || 'Failed to load posts')
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [cursor, token]
  )

  useEffect(() => {
    loadPosts({ reset: true })
  }, [token])

  if (loading) {
    return (
      <section className="space-y-2 py-2 sm:space-y-3 sm:px-3 sm:py-3">
        <PostSkeleton />
        <PostSkeleton />
      </section>
    )
  }

  if (error && !posts.length) {
    return (
      <section className="py-2 sm:px-3 sm:py-3">
        <ErrorState onRetry={() => loadPosts({ reset: true })} />
      </section>
    )
  }

  if (!posts.length) {
    return (
      <section className="py-2 sm:px-3 sm:py-3">
        <EmptyState />
      </section>
    )
  }

  return (
    <section className="space-y-2 py-2 sm:space-y-3 sm:px-3 sm:py-3">
      {posts.map((post) => (
        <FollowedPostCard key={post.id} post={post} />
      ))}

      {error ? (
        <div className="rounded-[18px] bg-red-50 px-4 py-3 text-center text-[12px] font-bold text-red-600 ring-1 ring-red-100">
          {error}
        </div>
      ) : null}

      {hasMore ? (
        <button
          type="button"
          onClick={() => loadPosts()}
          disabled={loadingMore}
          className="w-full rounded-[16px] bg-white py-3.5 text-[13px] font-black text-[#111827] shadow-sm ring-1 ring-gray-100 active:scale-[0.99] disabled:opacity-60"
        >
          {loadingMore ? (
            <>
              <i className="fa-solid fa-circle-notch mr-2 animate-spin" />
              Loading
            </>
          ) : (
            'Load more posts'
          )}
        </button>
      ) : null}
    </section>
  )
}
