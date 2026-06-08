import { useEffect, useState } from 'react'
import AuthorPostComposerSheet from './AuthorPostComposerSheet'
import CommentsModal from './story-detail/CommentsModal'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const AUTHOR_POST_REACTIONS = [
  { type: 'love', label: 'Love', src: '/assets/React/1_React_Love.svg', text: '#ff2f5f' },
  { type: 'haha', label: 'Haha', src: '/assets/React/2_React_Haha.svg', text: '#f59e0b' },
  { type: 'wow', label: 'Wow', src: '/assets/React/3_React_Wow.svg', text: '#f59e0b' },
  { type: 'sad', label: 'Sad', src: '/assets/React/4_React_Sad.svg', text: '#3b82f6' },
  { type: 'angry', label: 'Angry', src: '/assets/React/5_React_Angry.svg', text: '#ef4444' },
  { type: 'support', label: 'Support', src: '/assets/React/6_React_Support.svg', text: '#16a34a' },
  { type: 'touched', label: 'Touched', src: '/assets/React/7_React_Touched.svg', text: '#8b5cf6' },
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

function sortAuthorPosts(posts) {
  return [...posts].sort((a, b) => {
    const pinnedScore = Number(Boolean(b.is_pinned || b.pinned)) - Number(Boolean(a.is_pinned || a.pinned))

    if (pinnedScore !== 0) return pinnedScore

    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
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

async function createAuthorPost(content, imageUrls = []) {
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
      image_urls: Array.isArray(imageUrls) ? imageUrls : [],
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to create post')
  }

  return data.post || null
}

async function setAuthorPostPinned(postId, isPinned) {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/authors/me/posts/${encodeURIComponent(postId)}/pin`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      is_pinned: Boolean(isPinned),
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to update pinned post')
  }

  return data.post || null
}

async function setAuthorPostReaction(postId, reactionType = 'love') {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/authors/me/posts/${encodeURIComponent(postId)}/react`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      reaction_type: reactionType,
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to update reaction')
  }

  return data
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

        <span className="min-w-0 flex-1 truncate text-[15px] font-normal text-[#111827]">
          Share an update...
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

function PostImageGrid({ images, onView }) {
  if (!images.length) return null

  if (images.length === 1) {
    return (
      <button
        type="button"
        onClick={() => onView(images[0])}
        className="mt-3 block w-full bg-white"
      >
        <img src={images[0]} alt="" className="max-h-[620px] w-full object-contain" />
      </button>
    )
  }

  return (
    <div className="mt-3 grid w-full grid-cols-2 gap-1 bg-white">
      {images.slice(0, 4).map((imageUrl, index) => (
        <button
          key={`${imageUrl}-${index}`}
          type="button"
          onClick={() => onView(imageUrl)}
          className="relative aspect-square bg-[#f3f4f6]"
        >
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          {index === 3 && images.length > 4 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-[22px] font-semibold text-white">
              +{images.length - 4}
            </div>
          ) : null}
        </button>
      ))}
    </div>
  )
}

function AuthorPostCard({ post, author, isOwner, reactionBusyId, onOpenMenu, onReact, onComment, onEcho, onViewImage, onMessage }) {
  const avatarUrl = author?.avatar_url || ''
  const pageName = author?.page_name || 'Author'
  const isPinned = Boolean(post.is_pinned || post.pinned)
  const postImages = Array.isArray(post.image_urls) ? post.image_urls : []
  const hasReacted = Boolean(post.my_reaction)
  const reactionBusy = reactionBusyId === post.id

  const [reactionPickerOpen, setReactionPickerOpen] = useState(false)
const [pressTimer, setPressTimer] = useState(null)
const activeReaction = AUTHOR_POST_REACTIONS.find((item) => item.type === post.my_reaction) || null

function startReactionPress() {
  const timer = window.setTimeout(() => {
    setReactionPickerOpen(true)
    setPressTimer(null)
  }, 420)

  setPressTimer(timer)
}

function endReactionPress() {
  if (!pressTimer) return

  window.clearTimeout(pressTimer)
  setPressTimer(null)
  onReact(post, 'love')
}

function cancelReactionPress() {
  if (!pressTimer) return

  window.clearTimeout(pressTimer)
  setPressTimer(null)
}

  return (
    <article className="bg-white py-3">
      <div className="flex items-start gap-3 px-4">
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
              onClick={() => onOpenMenu(post)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#6b7280] active:bg-[#f3f4f6]"
              aria-label="Post options"
            >
              <i className="fa-solid fa-ellipsis text-[14px]" />
            </button>
          </div>
        </div>
      </div>

      {post.content ? (
        <p className="mt-2 whitespace-pre-wrap px-4 text-[16px] font-normal leading-7 text-[#111827]">
          {post.content}
        </p>
      ) : null}

      <PostImageGrid images={postImages} onView={onViewImage} />

{isOwner ? (
  <button
    type="button"
    onClick={() => onMessage?.('Insights and Ads coming soon.')}
    className="flex w-full border-b border-[#eef0f4] px-4 py-2 text-left active:bg-[#f3f4f6]"
  >
    <span className="text-[13px] font-medium leading-5 text-[#64748B]">
      See insights<br />
      and ads
    </span>
  </button>
) : null}

<div className="flex items-center gap-6 border-b border-[#eef0f4] px-4 py-2 text-[13px] font-normal text-[#6b7280]">
  <div className="relative">
    {reactionPickerOpen ? (
      <div className="absolute bottom-8 left-0 z-30 flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-2xl ring-1 ring-black/10">
        {AUTHOR_POST_REACTIONS.map((reaction) => (
          <button
            key={reaction.type}
            type="button"
            disabled={reactionBusy}
            onClick={() => {
              setReactionPickerOpen(false)
              onReact(post, reaction.type)
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full active:scale-90"
            aria-label={reaction.label}
          >
            <img src={reaction.src} alt={reaction.label} className="h-8 w-8 object-contain" />
          </button>
        ))}
      </div>
    ) : null}

    <button
      type="button"
      disabled={reactionBusy}
      onPointerDown={startReactionPress}
      onPointerUp={endReactionPress}
      onPointerLeave={cancelReactionPress}
      onContextMenu={(event) => event.preventDefault()}
      className="inline-flex items-center gap-1.5 active:scale-95 disabled:opacity-60"
      style={{ color: activeReaction?.text || undefined }}
    >
      {activeReaction ? (
        <img src={activeReaction.src} alt={activeReaction.label} className="h-[17px] w-[17px] object-contain" />
      ) : (
        <i className="fa-regular fa-heart text-[15px]" />
      )}
      {formatCompactNumber(post.like_count)}
    </button>
  </div>

  <button
  type="button"
  onClick={() => onComment(post)}
  className="inline-flex items-center gap-1.5 active:scale-95"
>
  <i className="fa-regular fa-comment text-[15px]" />
  {formatCompactNumber(post.comment_count)}
</button>

  <button
    type="button"
    onClick={() => onEcho(post)}
    className="inline-flex items-center gap-1.5 active:scale-95"
  >
    <i className="fa-solid fa-retweet text-[15px]" />
    {formatCompactNumber(post.echo_count)}
  </button>
</div>
    </article>
  )
}

function ToastBubble({ text, author }) {
  if (!text) return null

  const avatarUrl = author?.avatar_url || ''

  return (
    <div className="pointer-events-none fixed left-1/2 top-20 z-[260] flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#111827] px-4 py-2 text-[12px] font-semibold text-white shadow-2xl">
      <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-white">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <i className="fa-solid fa-feather-pointed text-[11px] text-[#111827]" />
        )}
      </span>
      <span>{text}</span>
    </div>
  )
}

function SheetOption({ icon, title, subtext, danger = false, disabled = false, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-[16px] px-1 py-3.5 text-left active:bg-[#f3f4f6] disabled:opacity-60"
    >
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${danger ? 'bg-[#fff1f2] text-[#dc2626]' : 'bg-[#f3f4f6] text-[#111827]'}`}>
        <i className={`${icon} text-[17px]`} />
      </span>

      <span className="min-w-0 flex-1">
        <span className={`block text-[16px] font-semibold ${danger ? 'text-[#dc2626]' : 'text-[#111827]'}`}>{title}</span>
        {subtext ? <span className="mt-0.5 block text-[12px] font-normal leading-5 text-[#8b93a1]">{subtext}</span> : null}
      </span>
    </button>
  )
}

function PostOptionsSheet({ post, busy, isOwner, author, onClose, onPinChange, onMessage }) {
  const [toast, setToast] = useState('')
  const [notificationsOff, setNotificationsOff] = useState(false)

  if (!post) return null

  const isPinned = Boolean(post.is_pinned || post.pinned)

  function showToast(text) {
    setToast(text)
    window.clearTimeout(showToast.timer)
    showToast.timer = window.setTimeout(() => setToast(''), 1600)
  }

  async function copyPostLink() {
    const username = author?.page_username || ''
    const path = username ? `/author/page/${username}?post=${post.id}` : `/author/page?post=${post.id}`
    const link = `${window.location.origin}${path}`

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(link)
      showToast('Post link copied')
      return
    }

    onMessage?.(link)
  }

  function handleNotificationToggle() {
    const nextValue = !notificationsOff
    setNotificationsOff(nextValue)
    showToast(nextValue ? 'Notifications turned off' : 'Notifications turned on')
  }

  function handleComingSoon(message) {
    showToast(message)
    onMessage?.(message)
  }

  return (
    <div className="fixed inset-0 z-[230]">
      <button type="button" aria-label="Close post options" onClick={onClose} className="absolute inset-0 bg-black/35" />

      <div className="absolute bottom-0 left-0 right-0 rounded-t-[28px] bg-white px-5 pb-7 pt-4 shadow-2xl">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#d1d5db]" />

        <div className="mb-2 text-[15px] font-semibold text-[#111827]">Post options</div>

        {isOwner ? (
          <>
            <SheetOption
              icon={`fa-solid ${isPinned ? 'fa-thumbtack-slash' : 'fa-thumbtack'}`}
              title={isPinned ? 'Unpin post' : 'Pin to top'}
              subtext={isPinned ? 'Remove this post from the top of your page' : 'Show this post first on your page'}
              disabled={busy}
              onClick={() => onPinChange(post, !isPinned)}
            />
            <SheetOption icon="fa-regular fa-bookmark" title="Save post" subtext="Add this to your saved items." onClick={() => handleComingSoon('Post saved')} />
            <SheetOption icon="fa-solid fa-pen" title="Edit post" onClick={() => handleComingSoon('Edit post is coming soon.')} />
            <SheetOption icon="fa-solid fa-trash-can" title="Move to trash" subtext="Items in your trash are deleted after 30 days." danger onClick={() => handleComingSoon('Move to trash is coming soon.')} />
            <SheetOption icon="fa-regular fa-bell-slash" title={notificationsOff ? 'Turn on notifications for this post' : 'Turn off notifications for this post'} onClick={handleNotificationToggle} />
            <SheetOption icon="fa-regular fa-copy" title="Copy link" onClick={copyPostLink} />
          </>
        ) : (
          <>
            <SheetOption icon="fa-regular fa-bookmark" title="Save post" subtext="Add this to your saved items." onClick={() => handleComingSoon('Post saved')} />
            <SheetOption icon="fa-regular fa-eye-slash" title="Hide post" subtext="See fewer posts like this." onClick={() => handleComingSoon('Post hidden')} />
            <SheetOption icon="fa-regular fa-flag" title="Report post" subtext="Tell us if this post violates platform rules." onClick={() => handleComingSoon('Report post is coming soon.')} />
            <SheetOption icon="fa-solid fa-user-slash" title="Block author" subtext="Stop seeing this author in your experience." onClick={() => handleComingSoon('Block author is coming soon.')} />
            <SheetOption icon="fa-regular fa-bell-slash" title={notificationsOff ? 'Turn on notifications for this post' : 'Turn off notifications for this post'} onClick={handleNotificationToggle} />
            <SheetOption icon="fa-regular fa-copy" title="Copy link" onClick={copyPostLink} />
          </>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-2 flex w-full items-center gap-4 rounded-[16px] px-1 py-3.5 text-left active:bg-[#f3f4f6]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
            <i className="fa-solid fa-xmark text-[16px]" />
          </span>
          <span className="text-[16px] font-semibold text-[#111827]">Close</span>
        </button>
      </div>

      <ToastBubble text={toast} author={author} />
    </div>
  )
}

function AuthorPostEchoSheet({ post, author, onClose, onCopyLink, onMessage }) {
  const [mode, setMode] = useState('write')
  const [text, setText] = useState('')

  if (!post) return null

  function handleEcho() {
    onMessage?.('Echo for Author Posts is coming soon.')
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-[260]">
      <button
        type="button"
        aria-label="Close echo"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div className="absolute bottom-0 left-0 right-0 rounded-t-[28px] bg-white px-4 pb-6 pt-4 shadow-2xl">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#d1d5db]" />

        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[17px] font-semibold text-[#111827]">Echo Post</h3>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]"
          >
            <i className="fa-solid fa-xmark text-[14px]" />
          </button>
        </div>

        <div className="rounded-[18px] bg-[#f8fafc] p-3 ring-1 ring-[#eef0f4]">
          <div className="text-[13px] font-semibold text-[#111827]">
            {author?.page_name || 'Author'}
          </div>

          <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-[13px] leading-5 text-[#6b7280]">
            {post.content || 'Author post'}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMode('share-now')}
            className={`rounded-[18px] border px-4 py-3 text-left active:scale-[0.99] ${
              mode === 'share-now'
                ? 'border-[#111827] bg-[#111827] text-white'
                : 'border-[#eef0f4] bg-white text-[#111827]'
            }`}
          >
            <i className="fa-solid fa-bolt text-[15px]" />
            <div className="mt-2 text-[13px] font-semibold">Share Now</div>
          </button>

          <button
            type="button"
            onClick={() => setMode('write')}
            className={`rounded-[18px] border px-4 py-3 text-left active:scale-[0.99] ${
              mode === 'write'
                ? 'border-[#111827] bg-[#111827] text-white'
                : 'border-[#eef0f4] bg-white text-[#111827]'
            }`}
          >
            <i className="fa-regular fa-pen-to-square text-[15px]" />
            <div className="mt-2 text-[13px] font-semibold">Write Post</div>
          </button>
        </div>

        {mode === 'write' ? (
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            maxLength={280}
            rows={4}
            placeholder="Say something about this post..."
            className="mt-4 w-full resize-none rounded-[18px] bg-[#f5f3fa] px-4 py-3 text-[14px] leading-6 text-[#111827] outline-none placeholder:text-[#98a2b3]"
          />
        ) : null}

        <button
          type="button"
          onClick={() => onCopyLink(post)}
          className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#f3f4f6] text-[14px] font-semibold text-[#111827] active:scale-[0.99]"
        >
          <i className="fa-regular fa-copy text-[14px]" />
          Copy Link
        </button>

        <button
          type="button"
          onClick={handleEcho}
          className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#111827] text-[14px] font-semibold text-white active:scale-[0.99]"
        >
          <i className="fa-solid fa-retweet text-[14px]" />
          Echo
        </button>
      </div>
    </div>
  )
}

function ImageViewer({ imageUrl, onClose }) {
  if (!imageUrl) return null

  return (
    <div className="fixed inset-0 z-[280] bg-black">
      <button
        type="button"
        onClick={onClose}
        className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white"
        aria-label="Close image"
      >
        <i className="fa-solid fa-xmark text-[18px]" />
      </button>

      <div className="flex h-full w-full items-center justify-center">
        <img src={imageUrl} alt="" className="max-h-full max-w-full object-contain" />
      </div>
    </div>
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
  const [saving, setSaving] = useState(false)
  const [localError, setLocalError] = useState('')
  const [composerOpen, setComposerOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [echoPost, setEchoPost] = useState(null)
  const [commentPost, setCommentPost] = useState(null)
  const [viewImageUrl, setViewImageUrl] = useState('')    
  const [pinBusy, setPinBusy] = useState(false)
  const [reactionBusyId, setReactionBusyId] = useState('')

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
          const sortedPosts = sortAuthorPosts(nextPosts)
          setPosts(sortedPosts)
          onCountChange?.(sortedPosts.length)
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

  async function handleCreatePost(content, imageUrls = []) {
    const nextContent = String(content || '').trim()
    const nextImageUrls = Array.isArray(imageUrls) ? imageUrls : []

    if ((!nextContent && !nextImageUrls.length) || saving) return false

    try {
      setSaving(true)
      setLocalError('')

      const post = await createAuthorPost(nextContent, nextImageUrls)

      if (post) {
        setPosts((current) => {
          const nextPosts = sortAuthorPosts([post, ...current])
          onCountChange?.(nextPosts.length)
          return nextPosts
        })
        return true
      }

      return false
    } catch (error) {
      const message = error.message || 'Failed to create post'
      setLocalError(message)
      onMessage?.(message)
      return false
    } finally {
      setSaving(false)
    }
  }

  async function handlePinChange(post, isPinned) {
    if (!post?.id || pinBusy) return

    try {
      setPinBusy(true)

      const updatedPost = await setAuthorPostPinned(post.id, isPinned)

      setPosts((current) => {
        const nextPosts = current.map((item) => {
          if (isPinned) {
            return item.id === post.id ? { ...item, ...updatedPost, is_pinned: true } : { ...item, is_pinned: false }
          }

          return item.id === post.id ? { ...item, ...updatedPost, is_pinned: false } : item
        })

        return sortAuthorPosts(nextPosts)
      })

      setSelectedPost(null)
      onMessage?.(isPinned ? 'Post pinned to top.' : 'Post removed from top.')
    } catch (error) {
      const message = error.message || 'Failed to update pinned post'
      setLocalError(message)
      onMessage?.(message)
    } finally {
      setPinBusy(false)
    }
  }

 async function handlePostReaction(post, reactionType = 'love') {
  if (!post?.id || reactionBusyId) return

  try {
    setReactionBusyId(post.id)

    const data = await setAuthorPostReaction(post.id, reactionType)

    setPosts((current) => current.map((item) => {
      if (item.id !== post.id) return item

      return {
        ...item,
        like_count: Number(data.like_count || 0),
        my_reaction: data.reacted ? data.reaction_type || reactionType : null,
      }
    }))
  } catch (error) {
    const message = error.message || 'Failed to update reaction'
    setLocalError(message)
    onMessage?.(message)
  } finally {
    setReactionBusyId('')
  }
}

function handleAuthorPostCommentChanged(nextComments = []) {
  if (!commentPost?.id) return

  setPosts((current) => current.map((post) => {
    if (post.id !== commentPost.id) return post

    return {
      ...post,
      comment_count: Array.isArray(nextComments) ? nextComments.length : Number(post.comment_count || 0),
    }
  }))
}
  
  async function copyAuthorPostLink(post) {
  const username = author?.page_username || ''
  const path = username ? `/author/page/${username}?post=${post.id}` : `/author/page?post=${post.id}`
  const link = `${window.location.origin}${path}`

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(link)
    onMessage?.('Post link copied.')
    return
  }

  onMessage?.(link)
}

  return (
    <div className="mx-[-16px] overflow-hidden bg-white sm:mx-0">
      {author?.is_owner ? (
        <AuthorPostComposer
          author={author}
          onOpenComposer={() => setComposerOpen(true)}
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
        <div className="space-y-2 bg-[#f3f4f6]">
          {posts.map((post) => (
            <AuthorPostCard
              key={post.id}
              post={post}
              author={author}
              isOwner={Boolean(author?.is_owner)}
              reactionBusyId={reactionBusyId}
              onOpenMenu={setSelectedPost}
              onReact={handlePostReaction}
              onEcho={setEchoPost}
              onViewImage={setViewImageUrl}
              onMessage={onMessage}
              onComment={setCommentPost}
            />
          ))}
        </div>
      ) : (
        <PostsEmpty
          title="No posts yet"
          text="Updates, notes, and announcements will appear here."
        />
      )}

      <AuthorPostComposerSheet
        open={composerOpen}
        author={author}
        saving={saving}
        onClose={() => setComposerOpen(false)}
        onPublishText={handleCreatePost}
        onMessage={onMessage}
      />

      <AuthorPostEchoSheet
  post={echoPost}
  author={author}
  onClose={() => setEchoPost(null)}
  onCopyLink={copyAuthorPostLink}
  onMessage={onMessage}
/>

      <PostOptionsSheet
        post={selectedPost}
        busy={pinBusy}
        isOwner={Boolean(author?.is_owner)}
        author={author}
        onClose={() => setSelectedPost(null)}
        onPinChange={handlePinChange}
        onMessage={onMessage}
      />

      <CommentsModal
  open={Boolean(commentPost)}
  targetType="author_post"
  targetId={commentPost?.id}
  title="Author post comments"
  onClose={() => setCommentPost(null)}
  onCommentChanged={handleAuthorPostCommentChanged}
/>

      <ImageViewer
  imageUrl={viewImageUrl}
  onClose={() => setViewImageUrl('')}
/>
      
    </div>
  )
}
