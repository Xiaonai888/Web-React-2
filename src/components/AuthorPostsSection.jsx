import { useEffect, useState } from 'react'

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
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`

  return String(number)
}

function formatPostDate(value) {
  if (!value) return 'Just now'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Just now'

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

async function fetchAuthorPosts(pageUsername) {
  if (!pageUsername) return []

  const response = await fetch(`${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}/posts`)
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to load posts')
  }

  return Array.isArray(data.posts) ? data.posts : []
}

async function createAuthorPost(content) {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/authors/me/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      post_type: 'article',
      content,
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to create post')
  }

  return data.post || null
}

function AuthorPostComposer({ author, onOpenComposer, onOpenFilter, onManagePosts }) {
  const avatarUrl = author?.avatar_url || ''
  const pageName = author?.page_name || 'Author'

  return (
    <div className="space-y-3 rounded-[18px] bg-white px-4 py-3 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[15px] font-semibold text-[#111827]">Author Posts</h3>

        <button
          type="button"
          onClick={onOpenFilter}
          className="flex h-8 items-center gap-1.5 rounded-full bg-[#f4f5f7] px-3 text-[12px] font-medium text-[#111827] active:scale-95"
        >
          <i className="fa-solid fa-sliders text-[11px]" />
          Filter
        </button>
      </div>

      <button
        type="button"
        onClick={onOpenComposer}
        className="flex w-full items-center gap-3 rounded-[16px] bg-[#f8f9fb] px-3 py-2.5 text-left active:bg-[#f1f3f6]"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#eef0f4] ring-1 ring-black/5">
          {avatarUrl ? (
            <img src={avatarUrl} alt={pageName} className="h-full w-full object-cover" />
          ) : (
            <i className="fa-solid fa-user text-[14px] text-[#9ca3af]" />
          )}
        </span>

        <span className="min-w-0 flex-1 text-[13px] font-normal text-[#8b93a1]">
          Write something for your readers...
        </span>

        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#111827]">
          <i className="fa-regular fa-image text-[17px]" />
        </span>
      </button>

      <button
        type="button"
        onClick={onManagePosts}
        className="flex h-9 w-full items-center justify-center gap-2 rounded-[12px] bg-[#f4f5f7] text-[13px] font-medium text-[#111827] active:scale-[0.99]"
      >
        <i className="fa-solid fa-list-check text-[12px]" />
        Manage posts
      </button>
    </div>
  )
}
function AuthorPostCard({ post }) {
  return (
    <article className="overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-black/5">
      <div className="flex items-center justify-between gap-3 border-b border-[#eef0f4] px-4 py-3">
        <div>
          <div className="text-[12px] font-black uppercase tracking-[0.05em] text-[#111827]">
            {post.post_type || 'Article'}
          </div>
          <div className="mt-1 text-[11px] font-bold text-[#9ca3af]">
            {formatPostDate(post.created_at)}
          </div>
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827] transition active:scale-95"
          aria-label="Post options"
        >
          <i className="fa-solid fa-ellipsis text-[13px]" />
        </button>
      </div>

      <div className="px-4 py-4">
        <p className="whitespace-pre-wrap text-[14px] font-semibold leading-7 text-[#111827] sm:text-[15px]">
          {post.content}
        </p>
      </div>

      <div className="flex items-center gap-5 border-t border-[#eef0f4] px-4 py-3 text-[12px] font-bold text-[#8b93a1]">
        <span><i className="fa-regular fa-heart mr-1.5" />{formatCompactNumber(post.like_count)}</span>
        <span><i className="fa-regular fa-comment mr-1.5" />{formatCompactNumber(post.comment_count)}</span>
        <span><i className="fa-solid fa-retweet mr-1.5" />{formatCompactNumber(post.echo_count)}</span>
      </div>
    </article>
  )
}

function PostsEmpty({ title, text }) {
  return (
    <div className="rounded-[24px] bg-white p-7 text-center shadow-sm ring-1 ring-black/5">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
        <i className="fa-regular fa-file-lines text-[20px]" />
      </div>
      <h3 className="text-[16px] font-black text-[#111827]">{title}</h3>
      <p className="mx-auto mt-2 max-w-[320px] text-[13px] font-semibold leading-6 text-[#8b93a1]">
        {text}
      </p>
    </div>
  )
}

export default function AuthorPostsSection({ author, onCountChange, onMessage }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [localError, setLocalError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadPosts() {
      if (!author?.page_username) {
        setPosts([])
        onCountChange?.(0)
        return
      }

      try {
        setLoading(true)
        setLocalError('')

        const nextPosts = await fetchAuthorPosts(author.page_username)

        if (!ignore) {
          setPosts(nextPosts)
          onCountChange?.(nextPosts.length)
        }
      } catch (error) {
        if (!ignore) {
          setPosts([])
          onCountChange?.(0)
          setLocalError(error.message || 'Failed to load posts')
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadPosts()

    return () => {
      ignore = true
    }
  }, [author?.page_username, onCountChange])

  async function handleCreatePost() {
    const content = draft.trim()

    if (!content || saving) return

    try {
      setSaving(true)
      setLocalError('')

      const post = await createAuthorPost(content)

      if (post) {
        setPosts((current) => {
          const nextPosts = [post, ...current]
          onCountChange?.(nextPosts.length)
          return nextPosts
        })
        setDraft('')
      }
    } catch (error) {
      const message = error.message || 'Failed to create post'
      setLocalError(message)
      onMessage?.(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {author?.is_owner ? (
  <AuthorPostComposer
    author={author}
    onOpenComposer={() => onMessage?.('Post composer is coming soon.')}
    onOpenFilter={() => onMessage?.('Post filter is coming soon.')}
    onManagePosts={() => onMessage?.('Manage posts is coming soon.')}
  />
) : null}

      {localError ? (
        <button
          type="button"
          onClick={() => setLocalError('')}
          className="w-full rounded-[18px] bg-[#fff7ed] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#9a3412]"
        >
          {localError}
        </button>
      ) : null}

      {loading ? (
        <PostsEmpty title="Loading posts..." text="Please wait while author posts load." />
      ) : posts.length ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <AuthorPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <PostsEmpty
          title="No posts yet"
          text="Author articles, updates, and announcements will appear here."
        />
      )}
    </div>
  )
}
