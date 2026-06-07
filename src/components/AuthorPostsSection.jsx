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
    <div className="border-b border-[#eef0f4] bg-white px-4 py-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-[16px] font-semibold text-[#111827]">Author Posts</h3>

        <button
          type="button"
          onClick={onOpenFilter}
          className="text-[13px] font-medium text-[#2563eb] active:opacity-70"
        >
          Filter
        </button>
      </div>

      <button
        type="button"
        onClick={onOpenComposer}
        className="flex w-full items-center gap-3 py-2 text-left active:bg-[#f8fafc]"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#eef0f4] ring-1 ring-black/5">
          {avatarUrl ? (
            <img src={avatarUrl} alt={pageName} className="h-full w-full object-cover" />
          ) : (
            <i className="fa-solid fa-user text-[14px] text-[#9ca3af]" />
          )}
        </span>

        <span className="min-w-0 flex-1 text-[15px] font-normal text-[#111827]">
          Write something for your readers...
        </span>

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#22c55e]">
          <i className="fa-regular fa-image text-[20px]" />
        </span>
      </button>

      <button
        type="button"
        onClick={onManagePosts}
        className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-[10px] bg-[#eef0f4] text-[14px] font-medium text-[#111827] active:scale-[0.99]"
      >
        <i className="fa-regular fa-rectangle-list text-[15px]" />
        Manage posts
      </button>
    </div>
  )
}

function AuthorPostCard({ post, author }) {
  const avatarUrl = author?.avatar_url || ''
  const pageName = author?.page_name || 'Author'
  const isPinned = Boolean(post.is_pinned || post.pinned)

  return (
    <article className="bg-white px-4 py-3">
      <div className="flex items-start gap-3">
        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#eef0f4] ring-1 ring-black/5">
          {avatarUrl ? (
            <img src={avatarUrl} alt={pageName} className="h-full w-full object-cover" />
          ) : (
            <i className="fa-solid fa-user text-[14px] text-[#9ca3af]" />
          )}

          {isPinned ? (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#22c55e]" />
          ) : null}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="line-clamp-1 text-[14px] font-semibold text-[#111827]">
                {pageName}
              </div>

              <div className="mt-0.5 flex items-center gap-1 text-[12px] font-normal text-[#6b7280]">
                {isPinned ? (
                  <>
                    <i className="fa-solid fa-thumbtack text-[10px]" />
                    <span>Pinned</span>
                    <span>·</span>
                  </>
                ) : null}

                <span>{formatPostDate(post.created_at)}</span>
                <span>·</span>
                <i className="fa-solid fa-earth-asia text-[10px]" />
              </div>
            </div>

            <button
              type="button"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#6b7280] active:bg-[#f3f4f6]"
              aria-label="Post options"
            >
              <i className="fa-solid fa-ellipsis text-[14px]" />
            </button>
          </div>

          <p className="mt-2 whitespace-pre-wrap text-[14px] font-normal leading-6 text-[#111827]">
            {post.content}
          </p>

          <div className="mt-3 flex items-center gap-5 text-[12px] font-normal text-[#8b93a1]">
            <span><i className="fa-regular fa-heart mr-1.5" />{formatCompactNumber(post.like_count)}</span>
            <span><i className="fa-regular fa-comment mr-1.5" />{formatCompactNumber(post.comment_count)}</span>
            <span><i className="fa-solid fa-retweet mr-1.5" />{formatCompactNumber(post.echo_count)}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

function PostsEmpty({ title, text }) {
  return (
    <div className="bg-white px-5 py-8 text-center">
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
        <i className="fa-regular fa-file-lines text-[16px]" />
      </div>

      <h3 className="text-[14px] font-semibold text-[#111827]">{title}</h3>

      <p className="mx-auto mt-1.5 max-w-[300px] text-[12px] font-normal leading-5 text-[#8b93a1]">
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
  <div className="overflow-hidden rounded-[18px] bg-white shadow-sm ring-1 ring-black/5">
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
        className="m-4 w-[calc(100%-2rem)] rounded-[14px] bg-[#fff7ed] px-3 py-2 text-left text-[12px] font-normal leading-5 text-[#9a3412]"
      >
        {localError}
      </button>
    ) : null}

    {loading ? (
      <PostsEmpty title="Loading posts..." text="Please wait while author posts load." />
    ) : posts.length ? (
      <div className="divide-y divide-[#eef0f4]">
        {posts.map((post) => (
          <AuthorPostCard key={post.id} post={post} author={author} />
        ))}
      </div>
    ) : (
      <PostsEmpty
        title="No posts yet"
        text="Updates, notes, and announcements will appear here."
      />
    )}
  </div>
)
}
