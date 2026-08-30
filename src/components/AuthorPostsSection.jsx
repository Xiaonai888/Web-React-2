import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthorPostComposerSheet from './AuthorPostComposerSheet'
import CommentsModal from './story-detail/CommentsModal'
import AuthorPostEchoAction from './author-posts/AuthorPostEchoAction'
import ReactionAction from './social/reactions/ReactionAction'
import ReactionSummary from './social/reactions/ReactionSummary'
import { recordAuthorHashtagInterest } from '../services/authorHashtagsApi'

import ReportModal from './ReportModal'
import AuthorPostFilterSheet from './author-posts/AuthorPostFilterSheet'
import AuthorDiscoverPostText from './author-posts/AuthorDiscoverPostText'
import {
  ProfessionalSinglePostImage,
} from './common/ProfessionalPostContent'
import {
  deleteSavedPostBySource,
  fetchSavedPostStatus,
  saveSavedPost,
} from '../services/savedPostsApi'

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
const POST_TOKEN_PATTERN = /(https?:\/\/[^\s]+|#[\p{L}\p{N}\p{M}_]+)/giu
const POST_URL_ONLY_PATTERN = /^https?:\/\/[^\s]+$/i
const POST_HASHTAG_ONLY_PATTERN = /^#[\p{L}\p{N}\p{M}_]+$/u

function renderPostTextWithLinks(text) {
  return String(text || '').split(POST_TOKEN_PATTERN).map((part, index) => {
    if (POST_URL_ONLY_PATTERN.test(part)) {
      return (
        <a
          key={`${part}-${index}`}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="break-all text-[#1877f2]"
        >
          {part}
        </a>
      )
    }

    if (POST_HASHTAG_ONLY_PATTERN.test(part)) {
      const tagUrl = `/discover/search?q=${encodeURIComponent(part)}&type=posts`

      return (
        <a
          key={`${part}-${index}`}
          href={tagUrl}
          onClick={(event) => {
            event.stopPropagation()
            void recordAuthorHashtagInterest(
              part,
              'hashtag_click'
            )
          }}
          className="text-[#1877f2]"
        >
          {part}
        </a>
      )
    }

    return part
  })
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
    const aPinned = Boolean(a.is_pinned || a.pinned)
    const bPinned = Boolean(b.is_pinned || b.pinned)
    if (aPinned !== bPinned) return Number(bPinned) - Number(aPinned)

    if (aPinned && bPinned) {
      return new Date(b.pinned_at || 0).getTime() - new Date(a.pinned_at || 0).getTime()
    }

    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  })
}

async function fetchAuthorPosts(pageUsername, before = '') {
  if (!pageUsername) return []

  const token = getAuthToken()
  const params = new URLSearchParams({ limit: '30' })

  if (before) {
    params.set('before', before)
  }

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

async function updateAuthorPost(postId, content, imageUrls = []) {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(
    `${API_BASE_URL}/api/authors/me/posts/${encodeURIComponent(postId)}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content,
        image_urls: Array.isArray(imageUrls) ? imageUrls : [],
      }),
    }
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to update post')
  }

  return data.post || null
}

async function moveAuthorPostToTrash(postId) {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(
    `${API_BASE_URL}/api/authors/me/posts/${encodeURIComponent(postId)}/trash`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to move post to trash')
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

async function fetchAuthorPostNotificationPreference(postId, signal) {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(
    `${API_BASE_URL}/api/authors/page/posts/${encodeURIComponent(postId)}/notification-preference`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal,
    }
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to load notification preference')
  }

  return data.notifications_enabled !== false
}

async function updateAuthorPostNotificationPreference(postId, enabled) {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(
    `${API_BASE_URL}/api/authors/page/posts/${encodeURIComponent(postId)}/notification-preference`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        notifications_enabled: Boolean(enabled),
      }),
    }
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to update notification preference')
  }

  return data.preference?.notifications_enabled !== false
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
  className="text-[14px] font-medium text-[#374151] active:opacity-70"
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

       <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[#31a84f]" aria-hidden="true">
  <svg
    className="h-[25px] w-[21px]"
    viewBox="0 0 22 26"
    fill="none"
  >
    <rect
      x="2.8"
      y="3.2"
      width="16.4"
      height="19.6"
      rx="3"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <circle cx="7.4" cy="8.7" r="1.55" fill="currentColor" />
    <path
      d="M4.9 18.9l4.2-4.5 3.1 3.3 2.1-2.4 3.2 3.6H4.9z"
      fill="currentColor"
    />
  </svg>
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
      <ProfessionalSinglePostImage
        src={images[0]}
        alt=""
        onClick={() => onView(images[0])}
        className="mt-3"
      />
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

function AuthorPostCard({ post, author, isOwner, reactionBusyId, onOpenMenu, onReact, onComment, onViewImage, onMessage }) {
  const navigate = useNavigate()
  const avatarUrl = author?.avatar_url || ''
  const pageName = author?.page_name || 'Author'
  const isPinned = Boolean(post.is_pinned || post.pinned)
  const postImages = Array.isArray(post.image_urls) ? post.image_urls : []
  const reactionBusy = reactionBusyId === post.id
  const [echoCount, setEchoCount] = useState(Number(post.echo_count || 0))
  

useEffect(() => {
  setEchoCount(Number(post.echo_count || 0))
}, [post.echo_count, post.id])
  const postText = String(
    post?.content || ''
  )
  

  
  

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
        <div className="mt-2 px-4 pb-3">
          <AuthorDiscoverPostText
  text={postText}
  renderText={renderPostTextWithLinks}
  className="text-[16px] font-normal leading-7 text-[#111827]"
/>
        </div>
      ) : null}


      <PostImageGrid images={postImages} onView={onViewImage} />

{isOwner ? (
  <div className="flex items-center gap-3 border-b border-[#eef0f4] px-4 py-2">
    <button type="button" onClick={() => navigate(`/author/page/posts/${encodeURIComponent(post.id)}/insights`)} className="shrink-0 text-left active:opacity-60">
      <span className="text-[13px] font-medium leading-5 text-[#64748B]">See insights<br />and ads</span>
    </button>
    <button type="button" onClick={() => onMessage?.('Boost post coming soon.')} className="ml-auto flex h-10 flex-1 items-center justify-center rounded-[8px] bg-black px-4 text-[14px] font-semibold text-white active:opacity-80">
      Boost post
    </button>
  </div>
) : null}

<div className="mt-2 px-4 pb-1">
  <div className="flex items-center justify-between pb-2 text-[12px] text-[#65676b]">
    <button
  type="button"
  onClick={() =>
    navigate(`/interactions/author_post/${post.id}/likes`, {
      state: { sourceName: 'Author Post' },
    })
  }
  className="flex min-w-0 items-center active:opacity-60"
>
  <ReactionSummary
    summary={post.reaction_summary}
    likeCount={post.like_count}
    myReaction={post.my_reaction}
  />
</button>

    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => onComment(post)}
        className="active:opacity-60"
      >
        {formatCompactNumber(post.comment_count)} comments
      </button>

      <span>
        {formatCompactNumber(echoCount)} echoes
      </span>
    </div>
  </div>

  <div className="grid grid-cols-3 items-center py-1.5 text-[14px] font-normal text-[#65676b]">
    <div className="flex items-center justify-center py-2">
      <ReactionAction
        reactionType={post.my_reaction}
        count={post.like_count}
        busy={reactionBusy}
        onReact={(reactionType) =>
          onReact(post, reactionType)
        }
        showCount={false}
        idleLabel="Like"
        className="w-full justify-center"
        buttonClassName="w-full justify-center gap-2 after:content-['Like'] [&>i]:!text-[20px] [&>img]:!h-[20px] [&>img]:!w-[20px]"
      />
    </div>

    <button
      type="button"
      onClick={() => onComment(post)}
      className="flex w-full items-center justify-center gap-2 py-2 active:bg-[#f2f2f2]"
    >
      <i className="fa-regular fa-comment text-[20px]" />
      <span>Comment</span>
    </button>

    <div className="flex items-center justify-center py-2">
      <AuthorPostEchoAction
        post={post}
        author={author}
        onCountChange={(_, total) =>
          setEchoCount(Number(total || 0))
        }
        className="w-full justify-center gap-2 [&>span]:hidden after:content-['Echo'] [&>img]:!h-[20px] [&>img]:!w-[20px]"
      />
    </div>
  </div>
</div>

    </article>
  )
}

function SheetOption({
  icon,
  title,
  subtext,
  disabled = false,
  onClick,
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[12px] px-2 py-2.5 text-left active:bg-black/[0.04] disabled:opacity-50"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[#111827]">
        <i className={`${icon} text-[16px]`} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-normal text-[#111827]">
          {title}
        </span>

        {subtext ? (
          <span className="mt-0.5 block text-[10px] font-normal leading-4 text-[#98a2b3]">
            {subtext}
          </span>
        ) : null}
      </span>
    </button>
  )
}

function PostOptionsSheet({
  post,
  busy,
  saveBusy,
  notificationBusy,
  trashBusy,
  isSaved,
  notificationsEnabled,
  isOwner,
  author,
  onClose,
  onPinChange,
  onSaveToggle,
  onNotificationToggle,
  onMoveToTrash,
  onEdit,
  onReport,
  onMessage,
}) {
  const startYRef = useRef(0)
  const currentYRef = useRef(0)
  const [sheetOffset, setSheetOffset] =
    useState(0)

  const [dragging, setDragging] =
    useState(false)

  useEffect(() => {
    if (!post) return undefined

    const bodyOverflow =
      document.body.style.overflow

    const htmlOverflow =
      document.documentElement.style
        .overflow

    document.body.style.overflow =
      'hidden'

    document.documentElement.style.overflow =
      'hidden'

    return () => {
      document.body.style.overflow =
        bodyOverflow

      document.documentElement.style.overflow =
        htmlOverflow
    }
  }, [post])

  if (!post) return null

  const isPinned = Boolean(
    post.is_pinned || post.pinned
  )

  function handleTouchStart(event) {
    const point = event.touches?.[0]

    const startY =
      point?.clientY || 0

    startYRef.current = startY
    currentYRef.current = startY

    setDragging(true)
  }

  function handleTouchMove(event) {
    const point = event.touches?.[0]

    const currentY =
      point?.clientY ||
      startYRef.current

    const offset = Math.max(
      0,
      currentY - startYRef.current
    )

    currentYRef.current = currentY

    setSheetOffset(
      Math.min(offset, 240)
    )
  }

  function handleTouchEnd() {
    const distance =
      currentYRef.current -
      startYRef.current

    setDragging(false)

    if (distance > 70) {
      setSheetOffset(0)
      onClose?.()
      return
    }

    setSheetOffset(0)
  }

  async function copyPostLink() {
    const username =
      author?.page_username || ''

    const path = username
      ? `/author/page/${username}?post=${post.id}`
      : `/author/page?post=${post.id}`

    const link =
      `${window.location.origin}${path}`

    try {
      if (
        navigator.clipboard?.writeText
      ) {
        await navigator.clipboard.writeText(
          link
        )

        onMessage?.(
          'Post link copied.'
        )

        return
      }
    } catch {
      onMessage?.(link)
      return
    }

    onMessage?.(link)
  }

  function handleComingSoon(message) {
    onMessage?.(message)
  }

  return (
    <div className="fixed inset-0 z-[230]">
      <button
        type="button"
        aria-label="Close post options"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
      />

      <section
        className={`absolute bottom-0 left-0 right-0 mx-auto w-full max-w-[560px] rounded-t-[24px] bg-white px-3 pb-[max(18px,env(safe-area-inset-bottom))] pt-2 shadow-2xl ${
          dragging
            ? ''
            : 'transition-transform duration-200 ease-out'
        }`}
        style={{
          transform:
            `translateY(${sheetOffset}px)`,
          touchAction: 'none',
        }}
        onTouchStart={
          handleTouchStart
        }
        onTouchMove={
          handleTouchMove
        }
        onTouchEnd={handleTouchEnd}
        onTouchCancel={
          handleTouchEnd
        }
        role="dialog"
        aria-modal="true"
      >
        <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-[#b8bec8]" />

        <div className="space-y-0.5">
          {isOwner ? (
            <>
              <SheetOption
                icon="fa-solid fa-thumbtack"
                title={
                  isPinned
                    ? 'Unpin post'
                    : 'Pin to top'
                }
                subtext={
                  isPinned
                    ? 'Remove this post from the top of your page'
                    : 'Show this post first on your page'
                }
                disabled={busy}
                onClick={() =>
                  onPinChange(
                    post,
                    !isPinned
                  )
                }
              />

              <SheetOption
  icon={
    isSaved
      ? 'fa-solid fa-bookmark'
      : 'fa-regular fa-bookmark'
  }
  title={
    isSaved
      ? 'Remove from saved'
      : 'Save post'
  }
  subtext={
    isSaved
      ? 'Remove this post from your saved items.'
      : 'Add this post to your saved items.'
  }
  disabled={saveBusy}
  onClick={() =>
    onSaveToggle?.(post)
  }
/>

              <SheetOption
                icon="fa-solid fa-pen"
                title="Edit post"
                onClick={() => onEdit?.(post)}
              />

              <SheetOption
                icon="fa-solid fa-trash-can"
                title={
                  trashBusy
                    ? 'Moving to trash...'
                    : 'Move to trash'
                }
                subtext="You can restore this post within 30 days."
                disabled={trashBusy}
                onClick={() =>
                  onMoveToTrash?.(post)
                }
              />

              <SheetOption
                icon={
                  notificationsEnabled
                    ? 'fa-regular fa-bell-slash'
                    : 'fa-regular fa-bell'
                }
                title={
                  notificationsEnabled
                    ? 'Turn off notifications for this post'
                    : 'Turn on notifications for this post'
                }
                disabled={notificationBusy}
                onClick={() =>
                  onNotificationToggle?.(post)
                }
              />

              <SheetOption
                icon="fa-regular fa-copy"
                title="Copy link"
                onClick={copyPostLink}
              />
            </>
          ) : (
            <>
              <SheetOption
  icon={
    isSaved
      ? 'fa-solid fa-bookmark'
      : 'fa-regular fa-bookmark'
  }
  title={
    isSaved
      ? 'Remove from saved'
      : 'Save post'
  }
  subtext={
    isSaved
      ? 'Remove this post from your saved items.'
      : 'Add this post to your saved items.'
  }
  disabled={saveBusy}
  onClick={() =>
    onSaveToggle?.(post)
  }
/>

              <SheetOption
                icon="fa-regular fa-eye-slash"
                title="Hide post"
                subtext="See fewer posts like this."
                onClick={() =>
                  handleComingSoon(
                    'Post hidden'
                  )
                }
              />

              <SheetOption
                icon="fa-regular fa-flag"
                title="Report Author Post"
                subtext="Tell us if this post violates platform rules."
                onClick={() =>
                  onReport?.(post)
                }
              />

              <SheetOption
                icon="fa-solid fa-user-slash"
                title="Block author"
                subtext="Stop seeing this author in your experience."
                onClick={() =>
                  handleComingSoon(
                    'Block author is coming soon.'
                  )
                }
              />

              <SheetOption
                icon={
                  notificationsEnabled
                    ? 'fa-regular fa-bell-slash'
                    : 'fa-regular fa-bell'
                }
                title={
                  notificationsEnabled
                    ? 'Turn off notifications for this post'
                    : 'Turn on notifications for this post'
                }
                disabled={notificationBusy}
                onClick={() =>
                  onNotificationToggle?.(post)
                }
              />

              <SheetOption
                icon="fa-regular fa-copy"
                title="Copy link"
                onClick={copyPostLink}
              />
            </>
          )}
        </div>
      </section>

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
  const navigate = useNavigate()
  function openAuthorPhoto(post, imageUrl) {
  if (!post?.id) return

  const images = Array.isArray(post.image_urls)
    ? post.image_urls.filter(Boolean).slice(0, 5)
    : []

  const photoIndex = Math.max(0, images.indexOf(imageUrl))

  navigate(
    `/author/post/${encodeURIComponent(post.id)}?photo=${photoIndex}&source=author_page`,
    { state: { fromAuthorPage: true } }
  )
}
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [localError, setLocalError] = useState('')
  const [composerOpen, setComposerOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [postFilterDate, setPostFilterDate] = useState('')
  const [editingPost, setEditingPost] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [reportPost, setReportPost] = useState(null)
  const [commentPost, setCommentPost] = useState(null)
  const [pinBusy, setPinBusy] = useState(false)
  const [saveBusy, setSaveBusy] = useState(false)
  const [notificationBusy, setNotificationBusy] = useState(false)
  const [trashBusy, setTrashBusy] = useState(false)
  const [
    selectedPostSaved,
    setSelectedPostSaved,
  ] = useState(false)
  const [
    selectedPostNotificationsEnabled,
    setSelectedPostNotificationsEnabled,
  ] = useState(true)
  const [reactionBusyId, setReactionBusyId] = useState('')

  useEffect(() => {
    if (!localError) return undefined

    const timer = window.setTimeout(() => {
      setLocalError('')
    }, 3000)

    return () => window.clearTimeout(timer)
  }, [localError])

  useEffect(() => {
    if (!selectedPost?.id) {
      setSelectedPostSaved(false)
      return undefined
    }

    const controller =
      new AbortController()

    setSelectedPostSaved(false)

    fetchSavedPostStatus(
      'author_post',
      String(selectedPost.id),
      controller.signal
    )
      .then((data) => {
        setSelectedPostSaved(
          Boolean(data.saved)
        )
      })
      .catch((error) => {
        if (
          error?.name !==
          'AbortError'
        ) {
          setSelectedPostSaved(false)
        }
      })

    return () => {
      controller.abort()
    }
  }, [selectedPost?.id])

  useEffect(() => {
    if (!selectedPost?.id) {
      setSelectedPostNotificationsEnabled(true)
      return undefined
    }

    const controller = new AbortController()

    setSelectedPostNotificationsEnabled(true)

    fetchAuthorPostNotificationPreference(
      String(selectedPost.id),
      controller.signal
    )
      .then((enabled) => {
        setSelectedPostNotificationsEnabled(
          Boolean(enabled)
        )
      })
      .catch((error) => {
        if (error?.name !== 'AbortError') {
          setSelectedPostNotificationsEnabled(true)
        }
      })

    return () => {
      controller.abort()
    }
  }, [selectedPost?.id])

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

        const nextPosts = await fetchAuthorPosts(author.page_username, postFilterDate)

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
  }, [author?.page_username, onCountChange, postFilterDate])

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

  async function handleUpdatePost(postId, content, imageUrls = []) {
    const nextContent = String(content || '').trim()
    const nextImageUrls = Array.isArray(imageUrls) ? imageUrls : []

    if (!postId || (!nextContent && !nextImageUrls.length) || saving) {
      return false
    }

    try {
      setSaving(true)
      setLocalError('')

      const updatedPost = await updateAuthorPost(
        postId,
        nextContent,
        nextImageUrls
      )

      if (!updatedPost) return false

      setPosts((current) =>
        sortAuthorPosts(
          current.map((item) =>
            item.id === postId
              ? {
                  ...item,
                  ...updatedPost,
                  my_reaction: item.my_reaction,
                  reaction_summary:
                    Array.isArray(updatedPost.reaction_summary) &&
                    updatedPost.reaction_summary.length
                      ? updatedPost.reaction_summary
                      : item.reaction_summary,
                }
              : item
          )
        )
      )

      onMessage?.('Post updated.')
      return true
    } catch (error) {
      const message = error.message || 'Failed to update post'
      setLocalError(message)
      onMessage?.(message)
      return false
    } finally {
      setSaving(false)
    }
  }

  async function handleSavePost(post) {
  if (!post?.id || saveBusy) return

  try {
    setSaveBusy(true)
    setLocalError('')

    if (selectedPostSaved) {
      await deleteSavedPostBySource(
        'author_post',
        String(post.id)
      )

      setSelectedPostSaved(false)
      onMessage?.(
        'Removed from saved.'
      )
      return
    }

    const username =
      author?.page_username || ''

    const sourceUrl = username
      ? `/author/page/${username}?post=${post.id}`
      : `/author/page?post=${post.id}`

    await saveSavedPost({
      source_type: 'author_post',
      source_id: String(post.id),
      source_url: sourceUrl,
      snapshot_data: {
        content: post.content || '',
        page_name:
          author?.page_name ||
          'Author',
        page_username: username,
        avatar_url:
          author?.avatar_url || '',
        image_urls: Array.isArray(
          post.image_urls
        )
          ? post.image_urls
          : [],
      },
      original_created_at:
        post.created_at || null,
    })

    setSelectedPostSaved(true)
    onMessage?.('Post saved.')
  } catch (error) {
    const message =
      error.message ||
      'Failed to save post'

    setLocalError(message)
    onMessage?.(message)
  } finally {
    setSaveBusy(false)
  }
}

  async function handlePostNotificationToggle(post) {
    if (!post?.id || notificationBusy) return

    const nextEnabled =
      !selectedPostNotificationsEnabled

    try {
      setNotificationBusy(true)
      setLocalError('')

      const enabled =
        await updateAuthorPostNotificationPreference(
          post.id,
          nextEnabled
        )

      setSelectedPostNotificationsEnabled(
        Boolean(enabled)
      )

      onMessage?.(
        enabled
          ? 'Post notifications turned on.'
          : 'Post notifications turned off.'
      )
    } catch (error) {
      const message =
        error.message ||
        'Failed to update notification preference'

      setLocalError(message)
      onMessage?.(message)
    } finally {
      setNotificationBusy(false)
    }
  }

  async function handleMovePostToTrash(post) {
    if (!post?.id || trashBusy) return

    try {
      setTrashBusy(true)
      setLocalError('')

      await moveAuthorPostToTrash(post.id)

      setPosts((current) => {
        const nextPosts = current.filter(
          (item) => item.id !== post.id
        )

        onCountChange?.(nextPosts.length)
        return nextPosts
      })

      setSelectedPost(null)
      onMessage?.('Post moved to trash.')
    } catch (error) {
      const message =
        error.message ||
        'Failed to move post to trash'

      setLocalError(message)
      onMessage?.(message)
    } finally {
      setTrashBusy(false)
    }
  }

  async function handlePinChange(post, isPinned) {
    if (!post?.id || pinBusy) return

    try {
      setPinBusy(true)
      setLocalError('')

      await setAuthorPostPinned(post.id, isPinned)

      const nextPosts = await fetchAuthorPosts(
        author?.page_username || '',
        postFilterDate
      )
      const sortedPosts = sortAuthorPosts(nextPosts)

      setPosts(sortedPosts)
      onCountChange?.(sortedPosts.length)
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
  reaction_summary: Array.isArray(data.reaction_summary)
    ? data.reaction_summary
    : [],
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
          onOpenComposer={() => {
            setEditingPost(null)
            setComposerOpen(true)
          }}
          onOpenFilter={() => setFilterOpen(true)}
          onManagePosts={() => navigate('/author/page/posts')}
        />
      ) : null}

      {localError ? (
        <button
          type="button"
          onClick={() => setLocalError('')}
          className="m-4 w-[calc(100%-2rem)] rounded-[14px] bg-white px-3 py-2 text-left text-[12px] font-medium leading-5 text-[#111827] shadow-sm ring-1 ring-black/10"
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
              onViewImage={(imageUrl) =>
  openAuthorPhoto(post, imageUrl)
}
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

      <AuthorPostFilterSheet
  open={filterOpen}
  value={postFilterDate}
  onClose={() => setFilterOpen(false)}
  onApply={setPostFilterDate}
  onClear={() => setPostFilterDate('')}
/>

      <AuthorPostComposerSheet
        open={composerOpen}
        author={author}
        saving={saving}
        editingPost={editingPost}
        onClose={() => {
          setComposerOpen(false)
          setEditingPost(null)
        }}
        onPublishText={handleCreatePost}
        onUpdatePost={handleUpdatePost}
        onMessage={onMessage}
      />


      <PostOptionsSheet
  post={selectedPost}
  busy={pinBusy}
  saveBusy={saveBusy}
  notificationBusy={notificationBusy}
  trashBusy={trashBusy}
  isSaved={selectedPostSaved}
  notificationsEnabled={selectedPostNotificationsEnabled}
  isOwner={Boolean(author?.is_owner)}
        author={author}
        onClose={() => setSelectedPost(null)}
        onPinChange={handlePinChange}
        onSaveToggle={handleSavePost}
        onNotificationToggle={handlePostNotificationToggle}
        onMoveToTrash={handleMovePostToTrash}
        onEdit={(post) => {
          setSelectedPost(null)
          setEditingPost(post)
          setComposerOpen(true)
        }}
        onReport={(post) => {
          setSelectedPost(null)
          setReportPost(post)
        }}
        onMessage={onMessage}
      />

      <ReportModal
        open={Boolean(reportPost)}
        reportType="author_post"
        targetId={reportPost?.id}
        targetTitle={
          reportPost
            ? `${author?.page_name || 'Author'}: ${String(reportPost.content || 'Author post').slice(0, 80)}`
            : ''
        }
        onClose={() => setReportPost(null)}
      />

      <CommentsModal
  open={Boolean(commentPost)}
  targetType="author_post"
  targetId={commentPost?.id}
  title="Author post comments"
  story={{
    id: commentPost?.id,
    title: 'Author post comments',
    user_id: author?.user_id || author?.owner_id || author?.created_by || author?.id,
    author_user_id: author?.user_id || author?.owner_id || author?.created_by || author?.id,
    author_page: {
      user_id: author?.user_id || author?.owner_id || author?.created_by || author?.id,
      page_name: author?.page_name || 'Author',
      avatar_url: author?.avatar_url || '',
    },
  }}
  onClose={() => setCommentPost(null)}
  onCommentChanged={handleAuthorPostCommentChanged}
/>
      
    </div>
  )
}
