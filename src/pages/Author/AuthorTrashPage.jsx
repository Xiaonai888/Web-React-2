import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatDate(value) {
  if (!value) return 'Unknown'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Unknown'
  }

  return date.toLocaleDateString('en-GB')
}

function getDaysLeft(item) {
  if (Number.isFinite(Number(item?.days_left))) {
    return Math.max(0, Number(item.days_left))
  }

  const expiresAt = item?.delete_expires_at

  if (!expiresAt) return 0

  const date = new Date(expiresAt)

  if (Number.isNaN(date.getTime())) {
    return 0
  }

  return Math.max(
    0,
    Math.ceil(
      (date.getTime() - Date.now()) /
        86400000
    )
  )
}

function EmptyCover({ title }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#e5e7eb] px-2 text-center">
      <span className="line-clamp-3 text-[10px] font-semibold leading-4 text-[#667085]">
        {title || 'Story'}
      </span>
    </div>
  )
}

function TrashStoryCard({
  story,
  busy,
  onRestore,
}) {
  const daysLeft = getDaysLeft(story)

  return (
    <article className="rounded-[22px] border border-[#e5e7eb] bg-white p-3.5 shadow-sm">
      <div className="flex gap-3.5">
        <div className="h-[122px] w-[84px] shrink-0 overflow-hidden rounded-[15px] bg-[#e5e7eb]">
          {story.cover_url ? (
            <img
              src={story.cover_url}
              alt={story.title || ''}
              className="h-full w-full object-cover"
            />
          ) : (
            <EmptyCover title={story.title} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="line-clamp-1 text-[15px] font-semibold text-[#111827]">
                {story.title || 'Untitled Story'}
              </h2>

              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-[#f2f4f7] px-2.5 py-1 text-[10px] font-medium text-[#475467]">
                  {story.main_genre || 'Novel'}
                </span>

                <span className="rounded-full bg-[#fff1f2] px-2.5 py-1 text-[10px] font-medium text-[#e11d48]">
                  Hidden
                </span>
              </div>
            </div>

            <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[#98a2b3]">
              <i className="fa-regular fa-trash-can text-[14px]" />
            </span>
          </div>

          <div className="mt-3 space-y-1.5 text-[11.5px] font-medium text-[#667085]">
            <div className="flex items-center gap-2">
              <i className="fa-regular fa-calendar text-[12px] text-[#98a2b3]" />
              <span>
                Deleted {formatDate(story.deleted_at)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <i className="fa-regular fa-clock text-[12px] text-[#98a2b3]" />
              <span>
                Restore before{' '}
                {formatDate(story.delete_expires_at)}
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-[11px] font-semibold text-[#e11d48]">
              {daysLeft} days left
            </span>

            <button
              type="button"
              disabled={busy}
              onClick={() => onRestore(story)}
              className="min-w-[86px] rounded-[14px] bg-[#111827] px-4 py-2 text-[12px] font-semibold text-white active:scale-95 disabled:bg-[#c9cdd6]"
            >
              {busy ? 'Restoring...' : 'Restore'}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function TrashPostCard({
  post,
  busy,
  onRestore,
}) {
  const daysLeft = getDaysLeft(post)
  const images = Array.isArray(
    post.image_urls
  )
    ? post.image_urls
    : []
  const excerpt = String(
    post.content || 'Photo post'
  ).trim()

  return (
    <article className="rounded-[22px] border border-[#e5e7eb] bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[15px] bg-[#f2f4f7] text-[#98a2b3]">
          {images[0] ? (
            <img
              src={images[0]}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <i className="fa-regular fa-note-sticky text-[22px]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="rounded-full bg-[#f2f4f7] px-2.5 py-1 text-[10px] font-medium capitalize text-[#475467]">
                {post.post_type || 'article'}
              </span>

              <p className="mt-2 line-clamp-2 break-words text-[13px] font-medium leading-5 text-[#111827]">
                {excerpt || 'Photo post'}
              </p>
            </div>

            <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[#98a2b3]">
              <i className="fa-regular fa-trash-can text-[14px]" />
            </span>
          </div>

          <div className="mt-3 space-y-1.5 text-[11.5px] font-medium text-[#667085]">
            <div className="flex items-center gap-2">
              <i className="fa-regular fa-calendar text-[12px] text-[#98a2b3]" />
              <span>
                Deleted {formatDate(post.deleted_at)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <i className="fa-regular fa-clock text-[12px] text-[#98a2b3]" />
              <span>
                Restore before{' '}
                {formatDate(post.delete_expires_at)}
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-[11px] font-semibold text-[#e11d48]">
              {daysLeft} days left
            </span>

            <button
              type="button"
              disabled={busy}
              onClick={() => onRestore(post)}
              className="min-w-[86px] rounded-[14px] bg-[#111827] px-4 py-2 text-[12px] font-semibold text-white active:scale-95 disabled:bg-[#c9cdd6]"
            >
              {busy ? 'Restoring...' : 'Restore'}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function getCommentType(item) {
  if (item.content_type === 'author_post') {
    return 'Author Post'
  }

  if (item.content_type === 'episode') {
    return 'Episode'
  }

  return 'Story'
}

function getCommentTitle(item) {
  if (item.content_type === 'author_post') {
    return (
      item.context?.post_excerpt ||
      'Author Page post'
    )
  }

  return (
    item.context?.title ||
    'Untitled Story'
  )
}

function TrashCommentCard({
  item,
  busy,
  onRestore,
}) {
  const daysLeft = getDaysLeft(item)
  const canRestore =
    Boolean(item.can_recover) &&
    daysLeft > 0

  const userName =
    item.user?.name ||
    item.user?.username ||
    'Reader'

  return (
    <article className="rounded-[22px] border border-[#e5e7eb] bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center text-[#667085]">
          <i className="fa-regular fa-comment-dots text-[17px]" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#f2f4f7] px-2.5 py-1 text-[10px] font-medium text-[#475467]">
              {getCommentType(item)}
            </span>

            {item.parent_id ? (
              <span className="rounded-full bg-[#f2f4f7] px-2.5 py-1 text-[10px] font-medium text-[#667085]">
                Reply
              </span>
            ) : null}
          </div>

          <h2 className="mt-2 line-clamp-1 text-[13px] font-semibold text-[#111827]">
            {getCommentTitle(item)}
          </h2>

          <p className="mt-2 whitespace-pre-wrap break-words rounded-[15px] bg-[#f7f7f9] px-3 py-2.5 text-[13px] font-normal leading-5 text-[#475467]">
            {item.text || 'Empty comment'}
          </p>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-medium text-[#667085]">
            <span>By {userName}</span>
            <span>
              Deleted {formatDate(item.deleted_at)}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-[11px] font-semibold text-[#e11d48]">
              {daysLeft} days left
            </span>

            <button
              type="button"
              disabled={!canRestore || busy}
              onClick={() => onRestore(item)}
              className="min-w-[86px] rounded-[14px] bg-[#111827] px-4 py-2 text-[12px] font-semibold text-white active:scale-95 disabled:bg-[#c9cdd6]"
            >
              {busy
                ? 'Recovering...'
                : canRestore
                  ? 'Recover'
                  : 'Unavailable'}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function EmptyState({
  icon,
  title,
  text,
}) {
  return (
    <section className="mt-5 rounded-[22px] border border-[#e5e7eb] bg-white px-5 py-10 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center text-[#98a2b3]">
        <i className={`${icon} text-[21px]`} />
      </div>

      <h2 className="mt-3 text-[15px] font-semibold text-[#111827]">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-[320px] text-[12px] leading-5 text-[#667085]">
        {text}
      </p>
    </section>
  )
}

export default function AuthorTrashPage() {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] =
    useState('stories')
  const [stories, setStories] =
    useState([])
  const [posts, setPosts] =
    useState([])
  const [comments, setComments] =
    useState([])
  const [loadingStories, setLoadingStories] =
    useState(true)
  const [loadingPosts, setLoadingPosts] =
    useState(true)
  const [loadingComments, setLoadingComments] =
    useState(true)
  const [busyId, setBusyId] =
    useState('')
  const [message, setMessage] =
    useState('')
  const [showHint, setShowHint] =
    useState(false)
  const [query, setQuery] =
    useState('')
  const [sortOrder, setSortOrder] =
    useState('newest')

  const visibleStories = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    const filtered = stories.filter((story) => {
      if (getDaysLeft(story) <= 0) {
        return false
      }

      if (!keyword) return true

      return String(
        `${story.title || ''} ${story.main_genre || ''}`
      )
        .toLowerCase()
        .includes(keyword)
    })

    return [...filtered].sort((a, b) => {
      const aTime = new Date(
        a.deleted_at || 0
      ).getTime()
      const bTime = new Date(
        b.deleted_at || 0
      ).getTime()

      return sortOrder === 'oldest'
        ? aTime - bTime
        : bTime - aTime
    })
  }, [stories, query, sortOrder])

  const visiblePosts = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    const filtered = posts.filter((post) => {
      if (getDaysLeft(post) <= 0) {
        return false
      }

      if (!keyword) return true

      return String(
        `${post.content || ''} ${post.post_type || ''}`
      )
        .toLowerCase()
        .includes(keyword)
    })

    return [...filtered].sort((a, b) => {
      const aTime = new Date(
        a.deleted_at || 0
      ).getTime()
      const bTime = new Date(
        b.deleted_at || 0
      ).getTime()

      return sortOrder === 'oldest'
        ? aTime - bTime
        : bTime - aTime
    })
  }, [posts, query, sortOrder])

  const visibleComments = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    const filtered = comments.filter((item) => {
      if (getDaysLeft(item) <= 0) {
        return false
      }

      if (!keyword) return true

      return String(
        `${item.text || ''} ${getCommentTitle(item)}`
      )
        .toLowerCase()
        .includes(keyword)
    })

    return [...filtered].sort((a, b) => {
      const aTime = new Date(
        a.deleted_at || 0
      ).getTime()
      const bTime = new Date(
        b.deleted_at || 0
      ).getTime()

      return sortOrder === 'oldest'
        ? aTime - bTime
        : bTime - aTime
    })
  }, [comments, query, sortOrder])

  function requireToken() {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return ''
    }

    return token
  }

  async function loadStories() {
    const token = requireToken()

    if (!token) return

    try {
      setLoadingStories(true)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/stories/trash`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        }
      )

      const data = await response
        .json()
        .catch(() => ({}))

      if (
        !response.ok ||
        data.ok === false
      ) {
        throw new Error(
          data.message ||
            'Failed to load story trash'
        )
      }

      setStories(
        Array.isArray(data.stories)
          ? data.stories
          : []
      )
    } catch (error) {
      setStories([])
      setMessage(
        error.message === 'Failed to fetch'
          ? 'Cannot connect to backend.'
          : error.message ||
              'Failed to load story trash'
      )
    } finally {
      setLoadingStories(false)
    }
  }

  async function loadPosts() {
    const token = requireToken()

    if (!token) return

    try {
      setLoadingPosts(true)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/authors/me/posts/trash`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        }
      )

      const data = await response
        .json()
        .catch(() => ({}))

      if (
        !response.ok ||
        data.ok === false
      ) {
        throw new Error(
          data.message ||
            'Failed to load post trash'
        )
      }

      setPosts(
        Array.isArray(data.posts)
          ? data.posts
          : []
      )
    } catch (error) {
      setPosts([])
      setMessage(
        error.message === 'Failed to fetch'
          ? 'Cannot connect to backend.'
          : error.message ||
              'Failed to load post trash'
      )
    } finally {
      setLoadingPosts(false)
    }
  }

  async function loadComments() {
    const token = requireToken()

    if (!token) return

    try {
      setLoadingComments(true)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/comment-trash/author?page=1&limit=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        }
      )

      const data = await response
        .json()
        .catch(() => ({}))

      if (
        !response.ok ||
        data.ok === false
      ) {
        throw new Error(
          data.message ||
            'Failed to load comment trash'
        )
      }

      setComments(
        Array.isArray(data.items)
          ? data.items
          : []
      )
    } catch (error) {
      setComments([])
      setMessage(
        error.message === 'Failed to fetch'
          ? 'Cannot connect to backend.'
          : error.message ||
              'Failed to load comment trash'
      )
    } finally {
      setLoadingComments(false)
    }
  }

  async function handleRestoreStory(story) {
    const token = requireToken()

    if (!token) return

    try {
      setBusyId(`story:${story.id}`)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/stories/${story.id}/restore`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response
        .json()
        .catch(() => ({}))

      if (
        !response.ok ||
        data.ok === false
      ) {
        throw new Error(
          data.message ||
            'Failed to restore story'
        )
      }

      setStories((current) =>
        current.filter(
          (item) =>
            item.id !== story.id
        )
      )

      setMessage(
        'Story restored successfully.'
      )
    } catch (error) {
      setMessage(
        error.message ||
          'Failed to restore story'
      )
    } finally {
      setBusyId('')
    }
  }

  async function handleRestorePost(post) {
    const token = requireToken()

    if (!token) return

    try {
      setBusyId(`post:${post.id}`)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/authors/me/posts/${encodeURIComponent(
          post.id
        )}/restore`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response
        .json()
        .catch(() => ({}))

      if (
        !response.ok ||
        data.ok === false
      ) {
        throw new Error(
          data.message ||
            'Failed to restore post'
        )
      }

      setPosts((current) =>
        current.filter(
          (item) => item.id !== post.id
        )
      )

      setMessage(
        'Post restored successfully.'
      )
    } catch (error) {
      setMessage(
        error.message ||
          'Failed to restore post'
      )
    } finally {
      setBusyId('')
    }
  }

  async function handleRecoverComment(item) {
    const token = requireToken()

    if (!token) return

    const key =
      `${item.source}:${item.comment_id}`

    try {
      setBusyId(key)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/comment-trash/author/${encodeURIComponent(
          item.source
        )}/${encodeURIComponent(
          item.comment_id
        )}/recover`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response
        .json()
        .catch(() => ({}))

      if (
        !response.ok ||
        data.ok === false
      ) {
        throw new Error(
          data.message ||
            'Failed to recover comment'
        )
      }

      setComments((current) =>
        current.filter(
          (comment) =>
            !(
              comment.source ===
                item.source &&
              String(
                comment.comment_id
              ) ===
                String(
                  item.comment_id
                )
            )
        )
      )

      setMessage(
        'Comment recovered successfully.'
      )
    } catch (error) {
      setMessage(
        error.message ||
          'Failed to recover comment'
      )
    } finally {
      setBusyId('')
    }
  }

  useEffect(() => {
    loadStories()
    loadPosts()
    loadComments()
  }, [])

  useEffect(() => {
    setQuery('')
  }, [activeTab])

  const loading =
    activeTab === 'stories'
      ? loadingStories
      : activeTab === 'posts'
        ? loadingPosts
        : loadingComments

  const activeCount =
    activeTab === 'stories'
      ? visibleStories.length
      : activeTab === 'posts'
        ? visiblePosts.length
        : visibleComments.length

  return (
    <div className="min-h-screen bg-[#f7f7f9] pb-[110px]">
      <header className="sticky top-0 z-50 border-b border-[#eaecf0] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="relative mx-auto flex max-w-5xl items-center justify-between">
          <button
            type="button"
            onClick={() =>
              navigate('/author/profile')
            }
            className="flex h-10 w-10 items-center justify-start text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-arrow-left text-[18px]" />
          </button>

          <h1 className="text-[18px] font-semibold text-[#111827]">
            Trash
          </h1>

          <button
            type="button"
            onClick={() =>
              setShowHint(
                (current) => !current
              )
            }
            className="flex h-10 w-10 items-center justify-end text-[#667085] active:scale-95"
            aria-label="Trash information"
            aria-expanded={showHint}
          >
            <i className="fa-regular fa-circle-question text-[20px]" />
          </button>

          {showHint ? (
            <div className="absolute right-0 top-12 z-20 w-[270px] rounded-[16px] border border-[#e5e7eb] bg-white p-4 text-[12px] font-normal leading-5 text-[#475467] shadow-xl">
              Deleted items are shown here for 30 days. After 30 days, they disappear from your Trash and cannot be restored.
            </div>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        <div className="grid grid-cols-3 border-b border-[#e5e7eb] bg-white px-1 py-1">
          {[
            ['stories', 'Stories', visibleStories.length],
            ['posts', 'Posts', visiblePosts.length],
            ['comments', 'Comments', visibleComments.length],
          ].map(([value, label, count]) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                setActiveTab(value)
              }
              className={`mx-1 h-10 rounded-[16px] px-2 text-[12px] font-medium transition ${
                activeTab === value
                  ? 'bg-[#fff1f2] text-[#e11d48]'
                  : 'text-[#667085]'
              }`}
            >
              {label} · {count}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <select
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(
                event.target.value
              )
            }
            className="h-11 rounded-[14px] border border-[#e5e7eb] bg-white px-3 text-[12px] font-medium text-[#111827] outline-none"
          >
            <option value="newest">
              Newest first
            </option>
            <option value="oldest">
              Oldest first
            </option>
          </select>

          <label className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-[14px] border border-[#e5e7eb] bg-white px-3">
            <i className="fa-solid fa-magnifying-glass text-[13px] text-[#98a2b3]" />

            <input
              value={query}
              onChange={(event) =>
                setQuery(
                  event.target.value
                )
              }
              placeholder="Search"
              className="min-w-0 flex-1 bg-transparent text-[12px] text-[#111827] outline-none placeholder:text-[#98a2b3]"
            />
          </label>
        </div>

        {message ? (
          <button
            type="button"
            onClick={() =>
              setMessage('')
            }
            className="mt-4 w-full rounded-[16px] border border-[#e5e7eb] bg-white px-4 py-3 text-left text-[12px] font-medium leading-5 text-[#475467] shadow-sm"
          >
            {message}
          </button>
        ) : null}

        {loading ? (
          <section className="mt-5 rounded-[22px] border border-[#e5e7eb] bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#111827]" />
            <div className="text-[13px] font-medium text-[#667085]">
              Loading trash...
            </div>
          </section>
        ) : null}

        {!loading &&
        activeTab === 'stories' ? (
          visibleStories.length ? (
            <section className="mt-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[16px] font-semibold text-[#111827]">
                  Can Restore
                </h2>

                <span className="text-[11px] font-medium text-[#667085]">
                  {activeCount}
                </span>
              </div>

              <div className="space-y-3">
                {visibleStories.map(
                  (story) => (
                    <TrashStoryCard
                      key={story.id}
                      story={story}
                      busy={
                        busyId ===
                        `story:${story.id}`
                      }
                      onRestore={
                        handleRestoreStory
                      }
                    />
                  )
                )}
              </div>
            </section>
          ) : (
            <EmptyState
              icon="fa-regular fa-folder-open"
              title="Story trash is empty"
              text="Deleted stories that can still be restored will appear here."
            />
          )
        ) : null}

        {!loading &&
        activeTab === 'posts' ? (
          visiblePosts.length ? (
            <section className="mt-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[16px] font-semibold text-[#111827]">
                  Deleted Posts
                </h2>

                <span className="text-[11px] font-medium text-[#667085]">
                  {activeCount}
                </span>
              </div>

              <div className="space-y-3">
                {visiblePosts.map(
                  (post) => (
                    <TrashPostCard
                      key={post.id}
                      post={post}
                      busy={
                        busyId ===
                        `post:${post.id}`
                      }
                      onRestore={
                        handleRestorePost
                      }
                    />
                  )
                )}
              </div>
            </section>
          ) : (
            <EmptyState
              icon="fa-regular fa-note-sticky"
              title="Post trash is empty"
              text="Deleted Author Posts that can still be restored will appear here."
            />
          )
        ) : null}

        {!loading &&
        activeTab === 'comments' ? (
          visibleComments.length ? (
            <section className="mt-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[16px] font-semibold text-[#111827]">
                  Deleted Comments
                </h2>

                <span className="text-[11px] font-medium text-[#667085]">
                  {activeCount}
                </span>
              </div>

              <div className="space-y-3">
                {visibleComments.map(
                  (item) => (
                    <TrashCommentCard
                      key={`${item.source}:${item.comment_id}`}
                      item={item}
                      busy={
                        busyId ===
                        `${item.source}:${item.comment_id}`
                      }
                      onRestore={
                        handleRecoverComment
                      }
                    />
                  )
                )}
              </div>
            </section>
          ) : (
            <EmptyState
              icon="fa-regular fa-comments"
              title="Comment trash is empty"
              text="Deleted comments that can still be recovered will appear here."
            />
          )
        ) : null}
      </main>
    </div>
  )
}
