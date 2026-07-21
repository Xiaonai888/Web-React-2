import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import ReportModal from '../ReportModal'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://shadow-backend-kucw.onrender.com'

const COMMENT_PAGE_SIZE = 20
const COMMENT_LIMIT = 1000

const REACTIONS = [
  {
    type: 'love',
    label: 'Love',
    src: '/assets/React/Love.svg',
    text: '#ff2f5f',
  },
  {
    type: 'haha',
    label: 'Haha',
    src: '/assets/React/Haha.svg',
    text: '#f59e0b',
  },
  {
    type: 'wow',
    label: 'Wow',
    src: '/assets/React/Wow.svg',
    text: '#f59e0b',
  },
  {
    type: 'sad',
    label: 'Sad',
    src: '/assets/React/Sad.svg',
    text: '#3b82f6',
  },
  {
    type: 'angry',
    label: 'Angry',
    src: '/assets/React/Angry.svg',
    text: '#ef4444',
  },
  {
    type: 'support',
    label: 'Support',
    src: '/assets/React/Support.svg',
    text: '#16a34a',
  },
  {
    type: 'touched',
    label: 'Touched',
    src: '/assets/React/Touched.svg',
    text: '#8b5cf6',
  },
]

const SORT_OPTIONS = [
  {
    value: 'top',
    label: 'Hot comments',
  },
  {
    value: 'newest',
    label: 'Newest',
  },
]

const DESTINATIONS = [
  {
    key: 'feed',
    title: 'Echo to Feed',
    subtitle:
      'Show this echo in your Shadow feed and profile.',
    icon: 'fa-solid fa-newspaper',
  },
  {
    key: 'shadow',
    title: 'Add to My Shadow',
    subtitle:
      'Keep this echo on your own Shadow space.',
    icon: 'fa-regular fa-circle-user',
  },
  {
    key: 'reader',
    title: 'Send to Reader',
    subtitle:
      'Share this Shadow Mall post with selected readers.',
    icon: 'fa-solid fa-user-group',
  },
  {
    key: 'circle',
    title: 'Echo to Circle',
    subtitle:
      'Share this echo with your reading circle.',
    icon: 'fa-solid fa-users',
  },
]

const AUDIENCES = [
  {
    key: 'public',
    title: 'Public',
    subtitle:
      'Anyone on Shadow can view this echo.',
    icon: 'fa-solid fa-earth-americas',
  },
  {
    key: 'followers',
    title: 'Followers',
    subtitle:
      'Only people who follow you can view this echo.',
    icon: 'fa-solid fa-user-check',
  },
  {
    key: 'close-readers',
    title: 'Close readers',
    subtitle:
      'Only your selected close readers can view it.',
    icon: 'fa-solid fa-star',
  },
  {
    key: 'only-me',
    title: 'Only me',
    subtitle: 'Keep this echo private.',
    icon: 'fa-solid fa-lock',
  },
]

function getAuthToken() {
  return (
    localStorage.getItem(
      'shadow_reader_token'
    ) ||
    sessionStorage.getItem(
      'shadow_reader_token'
    ) ||
    ''
  )
}

function getStoredUser() {
  try {
    return JSON.parse(
      localStorage.getItem(
        'shadow_reader_user'
      ) ||
        sessionStorage.getItem(
          'shadow_reader_user'
        ) ||
        'null'
    )
  } catch {
    return null
  }
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) {
    return '0'
  }

  if (number >= 1000000) {
    return `${(
      number / 1000000
    ).toFixed(
      number >= 10000000 ? 0 : 1
    )}M`
  }

  if (number >= 1000) {
    return `${(
      number / 1000
    ).toFixed(
      number >= 10000 ? 0 : 1
    )}k`
  }

  return String(number)
}

function formatTime(value) {
  const timestamp = new Date(
    value || 0
  ).getTime()

  if (!timestamp) return 'Just now'

  const difference = Math.max(
    0,
    Date.now() - timestamp
  )
  const minutes = Math.floor(
    difference / 60000
  )
  const hours = Math.floor(
    minutes / 60
  )
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`

  return new Date(
    timestamp
  ).toLocaleDateString('en-GB')
}

function normalizeComment(comment) {
  const user = comment?.user || {}

  return {
    id: comment?.id,
    promotion_id:
      comment?.promotion_id ||
      comment?.post_id,
    user_id:
      comment?.user_id || user.id,
    parent_id:
      comment?.parent_id || null,
    text: comment?.text || '',
    likes: Number(comment?.likes || 0),
    liked: Boolean(comment?.liked),
    created_at: comment?.created_at,
    updated_at: comment?.updated_at,
    user: {
      id: user.id || comment?.user_id,
      name:
        user.name ||
        user.username ||
        'Reader',
      username: user.username || '',
      avatar_url: user.avatar_url || '',
    },
    replies: Array.isArray(
      comment?.replies
    )
      ? comment.replies.map(
          normalizeComment
        )
      : [],
  }
}

function updateCommentTree(
  comments,
  commentId,
  changes
) {
  return comments.map((comment) => {
    if (
      String(comment.id) ===
      String(commentId)
    ) {
      return {
        ...comment,
        ...changes,
      }
    }

    return {
      ...comment,
      replies: updateCommentTree(
        comment.replies || [],
        commentId,
        changes
      ),
    }
  })
}

function removeCommentTree(
  comments,
  commentId
) {
  return comments
    .filter(
      (comment) =>
        String(comment.id) !==
        String(commentId)
    )
    .map((comment) => ({
      ...comment,
      replies: removeCommentTree(
        comment.replies || [],
        commentId
      ),
    }))
}

function Avatar({ user, small = false }) {
  const name = user?.name || 'Reader'
  const size = small
    ? 'h-8 w-8 text-[11px]'
    : 'h-10 w-10 text-[13px]'

  return user?.avatar_url ? (
    <img
      src={user.avatar_url}
      alt={name}
      className={`${size} shrink-0 rounded-full object-cover`}
    />
  ) : (
    <div
      className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-[#111827] font-semibold text-white`}
    >
      {name.slice(0, 1).toUpperCase()}
    </div>
  )
}

function MenuRow({
  icon,
  label,
  danger = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-[16px] px-2 py-3.5 text-left active:bg-[#f3f4f6] ${
        danger
          ? 'text-[#dc2626]'
          : 'text-[#111827]'
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          danger
            ? 'bg-[#fff1f2] text-[#dc2626]'
            : 'bg-[#f3f4f6] text-[#111827]'
        }`}
      >
        <i className={`${icon} text-[17px]`} />
      </span>
      <span className="text-[16px] font-normal">
        {label}
      </span>
    </button>
  )
}

function CommentOptionsSheet({
  comment,
  currentUserId,
  onClose,
  onReply,
  onCopy,
  onEdit,
  onDelete,
  onHide,
  onReport,
}) {
  if (!comment) return null

  const ownsComment =
    currentUserId &&
    String(comment.user_id || '') ===
      String(currentUserId)

  const runAction = (action) => {
    onClose()
    action?.()
  }

  return (
    <div className="fixed inset-0 z-[290] flex items-end justify-center">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close comment options"
        className="absolute inset-0 bg-black/40"
      />

      <section className="relative w-full max-w-3xl rounded-t-[28px] bg-white px-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-3 shadow-2xl sm:mb-4 sm:rounded-[28px]">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[#d1d5db]" />

        <MenuRow
          icon="fa-regular fa-comment"
          label="Reply"
          onClick={() => runAction(onReply)}
        />
        <MenuRow
          icon="fa-regular fa-copy"
          label="Copy"
          onClick={() => runAction(onCopy)}
        />

        {ownsComment ? (
          <>
            <MenuRow
              icon="fa-regular fa-pen-to-square"
              label="Edit"
              onClick={() => runAction(onEdit)}
            />
            <MenuRow
              icon="fa-regular fa-trash-can"
              label="Delete"
              danger
              onClick={() => runAction(onDelete)}
            />
          </>
        ) : (
          <>
            <MenuRow
              icon="fa-regular fa-flag"
              label="Report comment"
              onClick={() => runAction(onReport)}
            />
            <MenuRow
              icon="fa-regular fa-eye-slash"
              label="Hide this comment"
              onClick={() => runAction(onHide)}
            />
          </>
        )}
      </section>
    </div>
  )
}

function ReplyComposer({
  value,
  onChange,
  onCancel,
  onSend,
  sending,
}) {
  return (
    <div className="mt-3 flex items-end gap-2">
      <div className="flex min-w-0 flex-1 items-center rounded-[20px] bg-[#f3f4f6] px-3 py-2">
        <input
          value={value}
          maxLength={COMMENT_LIMIT}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder="Write a reply..."
          className="min-w-0 flex-1 bg-transparent text-[13px] font-normal text-[#111827] outline-none placeholder:text-[#98a2b3]"
        />
      </div>

      <button
        type="button"
        onClick={onCancel}
        className="mb-1 text-[12px] font-normal text-[#98a2b3]"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={onSend}
        disabled={!value.trim() || sending}
        className="mb-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#111827] text-white disabled:bg-[#d0d5dd]"
        aria-label="Send reply"
      >
        <i
          className={`fa-solid ${
            sending
              ? 'fa-spinner animate-spin'
              : 'fa-paper-plane'
          } text-[12px]`}
        />
      </button>
    </div>
  )
}

function ReplyItem({ reply, onLike }) {
  return (
    <div className="flex gap-2">
      <Avatar user={reply.user} small />

      <div className="min-w-0 flex-1">
        <div className="inline-block max-w-full rounded-[16px] bg-[#f3f4f6] px-3 py-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-semibold text-[#111827]">
              {reply.user?.name || 'Reader'}
            </span>
            <span className="text-[10px] font-normal text-[#98a2b3]">
              {formatTime(reply.created_at)}
            </span>
          </div>
          <p className="mt-1 whitespace-pre-wrap break-words text-[12.5px] font-normal leading-5 text-[#4b5563]">
            {reply.text}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onLike(reply.id)}
          className={`ml-3 mt-1 text-[11px] font-semibold ${
            reply.liked
              ? 'text-[#e5484d]'
              : 'text-[#98a2b3]'
          }`}
        >
          {reply.liked ? 'Liked' : 'Like'}
          {reply.likes
            ? ` · ${reply.likes}`
            : ''}
        </button>
      </div>
    </div>
  )
}

function CommentItem({
  comment,
  currentUserId,
  onLike,
  onReply,
  onCopy,
  onEdit,
  onDelete,
  onHide,
  onReport,
  sendingReply,
}) {
  const [menuOpen, setMenuOpen] =
    useState(false)
  const [replyOpen, setReplyOpen] =
    useState(false)
  const [replyText, setReplyText] =
    useState('')
  const [repliesShown, setRepliesShown] =
    useState(false)

  const replies = Array.isArray(
    comment.replies
  )
    ? comment.replies
    : []

  const sendReply = async () => {
    if (!replyText.trim()) return

    const created = await onReply(
      comment.id,
      replyText.trim()
    )

    if (created) {
      setReplyText('')
      setReplyOpen(false)
      setRepliesShown(true)
    }
  }

  return (
    <article className="px-4 py-4">
      <div className="flex gap-3">
        <Avatar user={comment.user} />

        <div className="min-w-0 flex-1">
          <div className="relative pr-8">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-block max-w-full rounded-[18px] bg-[#f3f4f6] px-4 py-3 text-left active:bg-[#ebeef2]"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[13px] font-semibold text-[#111827]">
                  {comment.user?.name ||
                    'Reader'}
                </span>
                <span className="text-[11px] font-normal text-[#98a2b3]">
                  {formatTime(
                    comment.created_at
                  )}
                </span>
              </div>

              <p className="mt-1 whitespace-pre-wrap break-words text-[13.5px] font-normal leading-6 text-[#4b5563]">
                {comment.text}
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full text-[#98a2b3] active:scale-95"
              aria-label="Comment options"
            >
              <i className="fa-solid fa-ellipsis text-[14px]" />
            </button>
          </div>

          <div className="mt-1 flex items-center gap-4 pl-3 text-[12px] font-semibold text-[#98a2b3]">
            <button
              type="button"
              onClick={() => onLike(comment.id)}
              className={
                comment.liked
                  ? 'text-[#e5484d]'
                  : ''
              }
            >
              {comment.liked
                ? 'Liked'
                : 'Like'}
              {comment.likes
                ? ` · ${comment.likes}`
                : ''}
            </button>

            <button
              type="button"
              onClick={() =>
                setReplyOpen(true)
              }
            >
              Reply
            </button>

            {replies.length ? (
              <button
                type="button"
                onClick={() =>
                  setRepliesShown(
                    (value) => !value
                  )
                }
              >
                {repliesShown
                  ? 'Hide replies'
                  : `View ${
                      replies.length
                    } ${
                      replies.length > 1
                        ? 'replies'
                        : 'reply'
                    }`}
              </button>
            ) : null}
          </div>

          {replyOpen ? (
            <ReplyComposer
              value={replyText}
              onChange={setReplyText}
              onCancel={() => {
                setReplyOpen(false)
                setReplyText('')
              }}
              onSend={sendReply}
              sending={sendingReply}
            />
          ) : null}

          {repliesShown && replies.length ? (
            <div className="mt-3 space-y-3 border-l-2 border-[#eef1f5] pl-3">
              {replies.map((reply) => (
                <ReplyItem
                  key={reply.id}
                  reply={reply}
                  onLike={onLike}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <CommentOptionsSheet
        comment={menuOpen ? comment : null}
        currentUserId={currentUserId}
        onClose={() => setMenuOpen(false)}
        onReply={() => setReplyOpen(true)}
        onCopy={() => onCopy(comment)}
        onEdit={() => onEdit(comment)}
        onDelete={() => onDelete(comment)}
        onHide={() => onHide(comment)}
        onReport={() => onReport(comment)}
      />
    </article>
  )
}

function EditCommentSheet({
  comment,
  value,
  onChange,
  onClose,
  onSave,
  saving,
}) {
  if (!comment) return null

  return (
    <div className="absolute inset-0 z-[100] flex items-end justify-center bg-black/35 px-4">
      <section className="w-full max-w-xl rounded-t-[26px] bg-white px-5 pb-6 pt-4 shadow-2xl sm:mb-6 sm:rounded-[26px]">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#d0d5dd]" />

        <div className="flex items-center justify-between">
          <h3 className="text-[17px] font-semibold text-[#111827]">
            Edit comment
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa]"
            aria-label="Close edit comment"
          >
            <i className="fa-solid fa-xmark text-[13px]" />
          </button>
        </div>

        <textarea
          value={value}
          maxLength={COMMENT_LIMIT}
          onChange={(event) =>
            onChange(event.target.value)
          }
          rows={5}
          className="mt-4 w-full resize-none rounded-[18px] bg-[#f3f4f6] px-4 py-3 text-[14px] font-normal leading-6 outline-none focus:ring-2 focus:ring-[#111827]/10"
        />

        <button
          type="button"
          onClick={onSave}
          disabled={!value.trim() || saving}
          className="mt-4 h-11 w-full rounded-full bg-[#111827] text-[13px] font-semibold text-white disabled:bg-[#d0d5dd]"
        >
          {saving
            ? 'Saving...'
            : 'Save comment'}
        </button>
      </section>
    </div>
  )
}

function CommentsModal({
  open,
  promotion,
  reactionCount = 0,
  commentCount = 0,
  echoCount = 0,
  onClose,
  onTotalChange,
}) {
  const promotionId = promotion?.id
  const sheetRef = useRef(null)
  const composerRef = useRef(null)
  const dragStartYRef = useRef(0)
  const dragCurrentYRef = useRef(0)
  const draggingRef = useRef(false)

  const currentUser = useMemo(
    () => getStoredUser(),
    []
  )
  const currentUserId =
    currentUser?.id ||
    currentUser?.user_id ||
    ''

  const [comments, setComments] =
    useState([])
  const [sort, setSort] =
    useState('top')
  const [sortOpen, setSortOpen] =
    useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] =
    useState(false)
  const [total, setTotal] = useState(
    Number(commentCount || 0)
  )
  const [loading, setLoading] =
    useState(false)
  const [loadingMore, setLoadingMore] =
    useState(false)
  const [text, setText] = useState('')
  const [sending, setSending] =
    useState(false)
  const [sendingReply, setSendingReply] =
    useState(false)
  const [toast, setToast] = useState('')
  const [editComment, setEditComment] =
    useState(null)
  const [editText, setEditText] =
    useState('')
  const [savingEdit, setSavingEdit] =
    useState(false)
  const [reportComment, setReportComment] =
    useState(null)
  const [hiddenIds, setHiddenIds] =
    useState(() => new Set())
  const [dragging, setDragging] =
    useState(false)
  const [dragOffset, setDragOffset] =
    useState(0)

  const selectedSort =
    SORT_OPTIONS.find(
      (option) => option.value === sort
    ) || SORT_OPTIONS[0]

  const visibleComments = useMemo(
    () =>
      comments.filter(
        (comment) =>
          !hiddenIds.has(
            String(comment.id)
          )
      ),
    [comments, hiddenIds]
  )

  const commentingDisabled = false

  useEffect(() => {
    setTotal(Number(commentCount || 0))
  }, [commentCount])

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow =
      document.body.style.overflow

    setDragOffset(0)
    setDragging(false)
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow =
        previousOverflow
    }
  }, [open])
  
  const showToast = (value) => {
    setToast(value)
    window.clearTimeout(showToast.timer)
    showToast.timer = window.setTimeout(
      () => setToast(''),
      1700
    )
  }

  const applyTotal = (value) => {
    const nextTotal = Math.max(
      0,
      Number(value || 0)
    )
    setTotal(nextTotal)
    onTotalChange?.(nextTotal)
  }

  const buildListUrl = (nextPage) => {
    const sortValue =
      sort === 'all' ? 'newest' : sort

    return `${API_BASE_URL}/api/shadow-mall/promotions/${encodeURIComponent(promotionId)}/comments?page=${nextPage}&limit=${COMMENT_PAGE_SIZE}&sort=${sortValue}`
  }

  async function fetchComments(
    nextPage = 1,
    append = false
  ) {
    if (!promotionId) return

    const token = getAuthToken()

    if (!token) {
      setComments([])
      setLoading(false)
      showToast('Please login to view comments.')
      return
    }

    try {
      append
        ? setLoadingMore(true)
        : setLoading(true)

      const response = await fetch(
        buildListUrl(nextPage),
        {
          headers: token
            ? {
                Authorization:
                  `Bearer ${token}`,
              }
            : {},
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
            'Failed to load comments'
        )
      }

      const normalized = Array.isArray(
        data.comments
      )
        ? data.comments.map(
            normalizeComment
          )
        : []

      setComments((current) =>
        append
          ? [...current, ...normalized]
          : normalized
      )
      setPage(Number(data.page || nextPage))
      setHasMore(Boolean(data.has_more))
      applyTotal(
        data.total ?? normalized.length
      )
    } catch (error) {
      showToast(
        error.message ||
          'Failed to load comments.'
      )
    } finally {
      append
        ? setLoadingMore(false)
        : setLoading(false)
    }
  }

  useEffect(() => {
    if (!open || !promotionId) return

    setComments([])
    setPage(1)
    setHasMore(false)
    setHiddenIds(new Set())
    fetchComments(1, false)
  }, [open, promotionId, sort])

  const updateCommentLocal = (
    commentId,
    changes
  ) => {
    setComments((current) =>
      current.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            ...changes,
          }
        }

        return {
          ...comment,
          replies: (comment.replies || []).map(
            (reply) =>
              reply.id === commentId
                ? {
                    ...reply,
                    ...changes,
                  }
                : reply
          ),
        }
      })
    )
  }

  async function sendComment() {
    if (
      !text.trim() ||
      sending ||
      commentingDisabled
    ) {
      return
    }

    const token = getAuthToken()

    if (!token) {
      showToast('Please login to comment.')
      return
    }

    try {
      setSending(true)

      const response = await fetch(
        `${API_BASE_URL}/api/shadow-mall/promotions/${encodeURIComponent(promotionId)}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: text.trim(),
          }),
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
            'Failed to create comment'
        )
      }

      setComments((current) => [
        normalizeComment(data.comment),
        ...current,
      ])
      setText('')
      applyTotal(
        data.comment_count ?? total + 1
      )
    } catch (error) {
      showToast(
        error.message ||
          'Failed to create comment.'
      )
    } finally {
      setSending(false)
    }
  }

  async function sendReply(
    parentId,
    replyText
  ) {
    const token = getAuthToken()

    if (!token) {
      showToast('Please login to reply.')
      return false
    }

    try {
      setSendingReply(true)

      const response = await fetch(
        `${API_BASE_URL}/api/shadow-mall/promotions/${encodeURIComponent(promotionId)}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: replyText,
            parent_id: parentId,
          }),
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
            'Failed to create reply'
        )
      }

      const createdReply = normalizeComment(
        data.comment
      )

      setComments((current) =>
        current.map((comment) =>
          comment.id === parentId
            ? {
                ...comment,
                replies: [
                  ...(comment.replies || []),
                  createdReply,
                ],
              }
            : comment
        )
      )
      applyTotal(
        data.comment_count ?? total + 1
      )
      return true
    } catch (error) {
      showToast(
        error.message ||
          'Failed to create reply.'
      )
      return false
    } finally {
      setSendingReply(false)
    }
  }

  async function toggleLike(commentId) {
    const token = getAuthToken()

    if (!token) {
      showToast('Please login to like.')
      return
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/shadow-mall/promotion-comments/${encodeURIComponent(commentId)}/like`,
        {
          method: 'POST',
          headers: {
            Authorization:
              `Bearer ${token}`,
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
            'Failed to update like'
        )
      }

      updateCommentLocal(commentId, {
        liked: Boolean(data.liked),
        likes: Number(data.likes || 0),
      })
    } catch (error) {
      showToast(
        error.message ||
          'Failed to update like.'
      )
    }
  }

  async function copyComment(comment) {
    const value = String(
      comment?.text || ''
    ).trim()

    if (!value) return

    try {
      await navigator.clipboard.writeText(
        value
      )
      showToast('Comment copied.')
    } catch {
      showToast('Copy failed.')
    }
  }

  async function saveEdit() {
    if (
      !editComment ||
      !editText.trim() ||
      savingEdit
    ) {
      return
    }

    const token = getAuthToken()

    if (!token) {
      showToast('Please login again.')
      return
    }

    try {
      setSavingEdit(true)

      const response = await fetch(
        `${API_BASE_URL}/api/shadow-mall/promotion-comments/${encodeURIComponent(editComment.id)}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type':
              'application/json',
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: editText.trim(),
          }),
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
            'Failed to update comment'
        )
      }

      const updated = normalizeComment(
        data.comment
      )
      updateCommentLocal(
        editComment.id,
        updated
      )
      setEditComment(null)
      setEditText('')
      showToast('Comment updated.')
    } catch (error) {
      showToast(
        error.message ||
          'Failed to update comment.'
      )
    } finally {
      setSavingEdit(false)
    }
  }

  async function deleteComment(comment) {
    const token = getAuthToken()

    if (!token) {
      showToast('Please login again.')
      return
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/shadow-mall/promotion-comments/${encodeURIComponent(comment.id)}`,
        {
          method: 'DELETE',
          headers: {
            Authorization:
              `Bearer ${token}`,
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
            'Failed to delete comment'
        )
      }

      setComments((current) =>
        current
          .filter(
            (item) =>
              item.id !== comment.id
          )
          .map((item) => ({
            ...item,
            replies: (
              item.replies || []
            ).filter(
              (reply) =>
                reply.id !== comment.id
            ),
          }))
      )
      applyTotal(
        data.comment_count ??
          Math.max(0, total - 1)
      )
      showToast('Comment deleted.')
    } catch (error) {
      showToast(
        error.message ||
          'Failed to delete comment.'
      )
    }
  }

  const hideComment = (comment) => {
    setHiddenIds((current) => {
      const next = new Set(current)
      next.add(String(comment.id))
      return next
    })
    showToast('Comment hidden on your device.')
  }

  const startDrag = (event) => {
    if (!event.isPrimary) return

    if (
      event.pointerType === 'mouse' &&
      event.button !== 0
    ) {
      return
    }

    draggingRef.current = true
    setDragging(true)

    dragStartYRef.current = event.clientY
    dragCurrentYRef.current = event.clientY

    event.currentTarget.setPointerCapture?.(
      event.pointerId
    )
  }

  const moveDrag = (event) => {
    if (!draggingRef.current) return

    dragCurrentYRef.current = event.clientY

    setDragOffset(
      Math.max(
        0,
        event.clientY -
          dragStartYRef.current
      )
    )
  }

  const endDrag = () => {
    if (!draggingRef.current) return

    const distance = Math.max(
      0,
      dragCurrentYRef.current -
        dragStartYRef.current
    )

    draggingRef.current = false
    setDragging(false)

    if (distance > 70) {
      onClose()
      return
    }

    setDragOffset(0)
  }

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[200000] flex items-end justify-center sm:items-center sm:px-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
        aria-label="Close comments"
      />

      <section
        ref={sheetRef}
        className="relative flex h-[calc(100dvh-12px)] w-full max-w-3xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:h-[calc(100dvh-24px)] sm:rounded-[28px]"
        style={{
          transform: `translateY(${dragOffset}px)`,
          transition: dragging
            ? 'none'
            : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform',
        }}
      >
       
        <header
          role="presentation"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={endDrag}
          className="shrink-0 cursor-grab touch-none border-b border-[#eef0f4] bg-white px-4 pb-3 pt-2.5 active:cursor-grabbing"
          style={{ touchAction: 'none' }}
        >
          <div className="grid grid-cols-3 items-center gap-2 text-center">
            <div className="flex items-center justify-center gap-1 text-[14px] font-normal text-[#111827]">
              <i className="fa-solid fa-heart text-[14px] text-[#ff3b5f]" />
              <span>
                {formatCompactNumber(
                  reactionCount
                )}
              </span>
            </div>

            <div className="rounded-full bg-[#f5f3fa] px-3 py-2 text-[14px] font-normal text-[#111827]">
              {formatCompactNumber(total)}{' '}
              comments
            </div>

            <div className="flex items-center justify-center gap-1 text-[14px] font-normal text-[#111827]">
              <img
                src="/assets/Icons/echo.svg"
                alt=""
                aria-hidden="true"
                className="h-[14px] w-[14px] object-contain opacity-75"
              />
              <span>
                {formatCompactNumber(
                  echoCount
                )}
              </span>
            </div>
          </div>
        </header>

        <div className="relative z-10 shrink-0 bg-white px-4 py-2">
          <button
            type="button"
            onClick={() => setSortOpen(true)}
            className="flex items-center gap-1 text-[14px] font-normal text-[#111827] active:scale-95"
          >
            <span>{selectedSort.label}</span>
            <i className="fa-solid fa-chevron-down text-[10px]" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {loading && !visibleComments.length ? (
            <div className="space-y-3 px-4 py-4">
              {Array.from({ length: 5 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-20 animate-pulse rounded-[18px] bg-[#f3f4f6]"
                  />
                )
              )}
            </div>
          ) : visibleComments.length ? (
            <>
              {visibleComments.map(
                (comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    currentUserId={
                      currentUserId
                    }
                    onLike={toggleLike}
                    onReply={sendReply}
                    onCopy={copyComment}
                    onEdit={(selected) => {
                      setEditComment(selected)
                      setEditText(
                        selected.text || ''
                      )
                    }}
                    onDelete={deleteComment}
                    onHide={hideComment}
                    onReport={setReportComment}
                    sendingReply={
                      sendingReply
                    }
                  />
                )
              )}

              {hasMore ? (
                <div className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() =>
                      fetchComments(
                        page + 1,
                        true
                      )
                    }
                    disabled={loadingMore}
                    className="h-11 w-full rounded-full bg-[#f5f3fa] text-[13px] font-normal text-[#111827] disabled:text-[#98a2b3]"
                  >
                    {loadingMore
                      ? 'Loading...'
                      : 'Load more comments'}
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="px-5 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]">
                <i className="fa-regular fa-comments text-[22px]" />
              </div>
              <h3 className="mt-4 text-[17px] font-semibold text-[#111827]">
                No comments yet
              </h3>
              <p className="mx-auto mt-2 max-w-[360px] text-[13px] font-normal leading-6 text-[#667085]">
                Start the conversation and share what you think about this post.
              </p>
              {!commentingDisabled ? (
                <button
                  type="button"
                  onClick={() =>
                    composerRef.current?.focus()
                  }
                  className="mt-5 h-11 rounded-full bg-[#111827] px-5 text-[13px] font-normal text-white active:scale-95"
                >
                  Write a comment
                </button>
              ) : null}
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-[#eef1f5] bg-white px-3 py-3">
          <div className="mx-auto flex max-w-3xl items-end gap-2">
            <div className="flex min-w-0 flex-1 items-center rounded-[22px] bg-[#f3f4f6] px-4 py-2">
              <textarea
                ref={composerRef}
                value={text}
                maxLength={COMMENT_LIMIT}
                disabled={
                  commentingDisabled ||
                  sending
                }
                onChange={(event) =>
                  setText(event.target.value)
                }
                rows={1}
                placeholder={
                  commentingDisabled
                    ? 'Comments are turned off for this post.'
                    : 'Write a comment...'
                }
                className="max-h-[118px] min-h-[24px] w-full resize-none bg-transparent text-[14px] font-normal leading-6 text-[#111827] outline-none placeholder:text-[#98a2b3] disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="button"
              onClick={sendComment}
              disabled={
                !text.trim() ||
                sending ||
                commentingDisabled
              }
              className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#111827] text-white active:scale-95 disabled:bg-[#d0d5dd]"
              aria-label="Send comment"
            >
              <i
                className={`fa-solid ${
                  sending
                    ? 'fa-spinner animate-spin'
                    : 'fa-paper-plane'
                } text-[13px]`}
              />
            </button>
          </div>
        </div>

        {toast ? (
          <div className="absolute bottom-[88px] left-1/2 z-[120] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#111827] px-4 py-2 text-[12px] font-normal text-white shadow-lg">
            {toast}
          </div>
        ) : null}

        {sortOpen ? (
          <div className="absolute inset-0 z-[110] flex items-end justify-center bg-black/35">
            <button
              type="button"
              onClick={() =>
                setSortOpen(false)
              }
              className="absolute inset-0"
              aria-label="Close comment filter"
            />

            <section className="relative w-full max-w-3xl rounded-t-[28px] bg-white px-5 pb-5 pt-4 shadow-2xl sm:mb-4 sm:rounded-[28px]">
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[#d0d5dd]" />

              {SORT_OPTIONS.map((option) => {
                const active =
                  sort === option.value

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSort(option.value)
                      setSortOpen(false)
                    }}
                    className="flex w-full items-center gap-3 px-3 py-3 text-left active:bg-[#f8fafc]"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[16px] font-normal text-[#111827]">
                        {option.label}
                      </span>
                      <span className="mt-0.5 block text-[13px] font-normal leading-5 text-[#667085]">
                        {option.description}
                      </span>
                    </span>

                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        active
                          ? 'border-[#111827] bg-[#111827]'
                          : 'border-[#d0d5dd] bg-white'
                      }`}
                    >
                      {active ? (
                        <i className="fa-solid fa-check text-[10px] text-white" />
                      ) : null}
                    </span>
                  </button>
                )
              })}
            </section>
          </div>
        ) : null}

        <EditCommentSheet
          comment={editComment}
          value={editText}
          onChange={setEditText}
          onClose={() => {
            setEditComment(null)
            setEditText('')
          }}
          onSave={saveEdit}
          saving={savingEdit}
        />

        <ReportModal
          open={Boolean(reportComment)}
          reportType="comment"
          targetId={reportComment?.id}
          targetTitle={
            reportComment
              ? `${
                  reportComment.user?.name ||
                  'Reader'
                }: ${String(
                  reportComment.text || ''
                ).slice(0, 80)}`
              : ''
          }
          onClose={() =>
            setReportComment(null)
          }
        />
      </section>
    </div>,
    document.body
  )
}

function ReaderCircle({
  reader,
  active,
  onClick,
}) {
  const name =
    reader?.name ||
    reader?.username ||
    'Reader'

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-[76px] shrink-0 text-center active:scale-95"
    >
      <div
        className={`mx-auto flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[#e5e7eb] text-[17px] font-semibold text-white ring-2 ${
          active
            ? 'ring-[#8b5cf6]'
            : 'ring-transparent'
        }`}
      >
        {reader?.avatar_url ? (
          <img
            src={reader.avatar_url}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          name.slice(0, 1).toUpperCase()
        )}
      </div>
      <div
        className={`mt-2 line-clamp-2 text-[11.5px] font-semibold leading-4 ${
          active
            ? 'text-[#6d28d9]'
            : 'text-[#667085]'
        }`}
      >
        {name}
      </div>
    </button>
  )
}

function ChoiceSheet({
  title,
  subtitle,
  options,
  value,
  onChoose,
  onBack,
}) {
  return (
    <div className="fixed inset-0 z-[200050] bg-white text-[#111827]">
      <div className="flex items-center gap-3 border-b border-[#eceaf2] px-4 py-4">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[#f5f3fa]"
        >
          <i className="fa-solid fa-chevron-left text-[18px]" />
        </button>

        <div className="min-w-0 flex-1">
          <h2 className="text-[20px] font-normal leading-7">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-[12px] font-normal leading-5 text-[#8d94a1]">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>

      <div className="px-4 py-3">
        {options.map((item) => {
          const active =
            item.key === value

          return (
            <button
              key={item.key}
              type="button"
              onClick={() =>
                onChoose(item.key)
              }
              className="flex w-full items-center gap-4 rounded-[20px] px-2 py-4 text-left active:bg-[#f5f3fa]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]">
                <i
                  className={`${item.icon} text-[18px]`}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-[16px] font-normal text-[#111827]">
                  {item.title}
                </div>
                <div className="mt-0.5 text-[12.5px] font-normal leading-5 text-[#8d94a1]">
                  {item.subtitle}
                </div>
              </div>

              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                  active
                    ? 'border-[#111827] bg-[#111827]'
                    : 'border-[#98a2b3]'
                }`}
              >
                {active ? (
                  <i className="fa-solid fa-check text-[10px] text-white" />
                ) : null}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function getEchoPosts() {
  try {
    const parsed = JSON.parse(
      localStorage.getItem(
        'shadow_profile_echo_posts'
      ) || '[]'
    )

    return Array.isArray(parsed)
      ? parsed
      : []
  } catch {
    return []
  }
}

function saveEchoPost(post) {
  localStorage.setItem(
    'shadow_profile_echo_posts',
    JSON.stringify([
      post,
      ...getEchoPosts(),
    ])
  )
}

function getPromotionLink(promotion) {
  const url = new URL(
    window.location.href
  )
  url.hash = `shadow-mall-promotion-${
    promotion?.id || ''
  }`
  return url.toString()
}

function EchoShareSheet({
  open,
  promotion,
  onClose,
  onEchoed,
}) {
  const dragStartYRef = useRef(0)
  const dragOffsetRef = useRef(0)
  const draggingRef = useRef(false)
  const user = useMemo(
    () => getStoredUser(),
    []
  )
  const [postText, setPostText] =
    useState('')
  const [message, setMessage] =
    useState('')
  const [destination, setDestination] =
    useState('feed')
  const [audience, setAudience] =
    useState('public')
  const [activePanel, setActivePanel] =
    useState('')
  const [selectedReaders, setSelectedReaders] =
    useState([])
  const [sending, setSending] =
    useState(false)
  const [followers, setFollowers] =
    useState([])
  const [followersLoading, setFollowersLoading] =
    useState(false)
  const [followersError, setFollowersError] =
    useState('')
  const [dragOffset, setDragOffset] =
    useState(0)

  const displayName =
    user?.name ||
    user?.username ||
    'Reader'
  const sourceName =
    promotion?.sponsor ||
    'Shadow Mall'
  const destinationItem =
    DESTINATIONS.find(
      (item) =>
        item.key === destination
    ) || DESTINATIONS[0]
  const audienceItem =
    AUDIENCES.find(
      (item) => item.key === audience
    ) || AUDIENCES[0]
  const promotionLink = useMemo(
    () => getPromotionLink(promotion),
    [promotion]
  )

  useEffect(() => {
    if (!open) return undefined

    document.body.style.overflow =
      'hidden'
    dragOffsetRef.current = 0
    setDragOffset(0)

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined

    const token = getAuthToken()
    const username = String(
      user?.username || ''
    ).trim()

    if (!token || !username) {
      setFollowers([])
      setFollowersError('')
      return undefined
    }

    let ignore = false

    async function loadFollowers() {
      try {
        setFollowersLoading(true)
        setFollowersError('')

        const response = await fetch(
          `${API_BASE_URL}/api/users/${encodeURIComponent(
            username
          )}/followers?page=1&limit=50`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
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
              'Failed to load followers'
          )
        }

        if (!ignore) {
          setFollowers(
            Array.isArray(data.users)
              ? data.users
              : []
          )
        }
      } catch (error) {
        if (!ignore) {
          setFollowers([])
          setFollowersError(
            error.message ||
              'Failed to load followers.'
          )
        }
      } finally {
        if (!ignore) {
          setFollowersLoading(false)
        }
      }
    }

    loadFollowers()

    return () => {
      ignore = true
    }
  }, [open, user?.username])

  if (!open) return null

  const startDrag = (event) => {
    draggingRef.current = true
    dragStartYRef.current =
      event.clientY
    dragOffsetRef.current = 0
    event.currentTarget.setPointerCapture?.(
      event.pointerId
    )
  }

  const moveDrag = (event) => {
    if (!draggingRef.current) return

    const nextOffset = Math.max(
      0,
      event.clientY -
        dragStartYRef.current
    )

    dragOffsetRef.current = nextOffset
    setDragOffset(nextOffset)
  }

  const endDrag = () => {
    if (!draggingRef.current) return

    draggingRef.current = false

    if (dragOffsetRef.current > 80) {
      onClose()
      return
    }

    dragOffsetRef.current = 0
    setDragOffset(0)
  }

  const handleReaderToggle = (
    readerId
  ) => {
    const value = String(readerId || '')

    if (!value) return

    setSelectedReaders((current) =>
      current.includes(value)
        ? current.filter(
            (item) => item !== value
          )
        : [...current, value]
    )
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        promotionLink
      )
      setMessage('Link copied.')
    } catch {
      setMessage(promotionLink)
    }
  }

  const handleTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(
        promotionLink
      )}&text=${encodeURIComponent(
        promotion?.title ||
          'Shadow Mall'
      )}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const handleFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        promotionLink
      )}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const handleEchoNow = async () => {
    if (!promotion?.id) {
      setMessage(
        'Shadow Mall post is not ready yet.'
      )
      return
    }

    const token = getAuthToken()

    if (!token) {
      setMessage(
        'Please log in before echoing.'
      )
      return
    }

    try {
      setSending(true)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/shadow-mall/promotions/${encodeURIComponent(
          promotion.id
        )}/echoes`,
        {
          method: 'POST',
          headers: {
            Authorization:
              `Bearer ${token}`,
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            echo_text: postText.trim(),
            destination,
            audience,
            selected_reader_ids:
              selectedReaders,
          }),
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
            'Failed to echo Shadow Mall post'
        )
      }

      const savedPost = {
        id:
          data.echo?.id ||
          `${Date.now()}-${Math.random()
            .toString(16)
            .slice(2)}`,
        type:
          'shadow_mall_promotion_echo',
        shadow_mall_promotion_id:
          promotion.id,
        source_user_name: sourceName,
        source_content:
          promotion.description ||
          promotion.title ||
          '',
        story_title:
          promotion.title ||
          'Shadow Mall',
        story_author_name:
          sourceName,
        story_genre: 'Shadow Mall',
        story_cover_url:
          promotion.image_url ||
          promotion.profile_image_url ||
          '',
        echo_text: postText.trim(),
        destination,
        destination_label:
          destinationItem.title,
        audience,
        audience_label:
          audienceItem.title,
        selected_readers: followers
          .filter((reader) =>
            selectedReaders.includes(
              String(reader.id)
            )
          )
          .map((reader) => ({
            id: reader.id,
            name:
              reader.name ||
              reader.username ||
              'Reader',
            username:
              reader.username || '',
            avatar_url:
              reader.avatar_url || '',
          })),
        user_name: displayName,
        created_at:
          data.echo?.created_at ||
          new Date().toISOString(),
      }

      saveEchoPost(savedPost)
      setPostText('')
      setSelectedReaders([])
      onEchoed?.(
        data.echo || savedPost,
        Number(data.echo_count || 0)
      )
      onClose()
    } catch (error) {
      setMessage(
        error.message ||
          'Failed to echo Shadow Mall post.'
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[200000] flex items-end justify-center bg-black/40">
      <button
        type="button"
        aria-label="Close echo share"
        onClick={onClose}
        className="absolute inset-0"
      />

      <section
        className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-[30px] bg-[#f5f3fa] px-4 pb-[calc(18px+env(safe-area-inset-bottom))] pt-3 shadow-2xl md:mb-5 md:max-w-[520px] md:rounded-[30px]"
        style={{
          transform: `translateY(${dragOffset}px)`,
          transition: draggingRef.current
            ? 'none'
            : 'transform 220ms ease',
        }}
      >
        <div
          role="presentation"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="sticky top-0 z-20 mx-auto mb-4 flex h-5 w-20 cursor-grab items-start justify-center bg-[#f5f3fa]"
          style={{ touchAction: 'none' }}
        >
          <div className="h-1.5 w-14 rounded-full bg-[#9ca3af]" />
        </div>

        <div className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex items-start gap-3">
            <Avatar user={user} />

            <div className="min-w-0 flex-1">
              <div className="line-clamp-1 text-[16px] font-semibold text-[#111827]">
                {displayName}
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setActivePanel(
                      'destination'
                    )
                  }
                  className="flex h-8 items-center gap-2 rounded-full bg-[#eef0f4] px-3 text-[12px] font-normal text-[#111827] active:scale-95"
                >
                  <span>
                    {destinationItem.title}
                  </span>
                  <i className="fa-solid fa-caret-down text-[11px]" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActivePanel(
                      'audience'
                    )
                  }
                  className="flex h-8 items-center gap-2 rounded-full bg-[#eef0f4] px-3 text-[12px] font-normal text-[#111827] active:scale-95"
                >
                  <i
                    className={`${audienceItem.icon} text-[12px]`}
                  />
                  <span>
                    {audienceItem.title}
                  </span>
                  <i className="fa-solid fa-caret-down text-[11px]" />
                </button>
              </div>
            </div>
          </div>

          <textarea
            value={postText}
            onChange={(event) =>
              setPostText(
                event.target.value
              )
            }
            rows={2}
            maxLength={280}
            placeholder="Say something..."
            className="mt-3 w-full resize-none bg-transparent text-[14px] font-normal leading-6 text-[#111827] outline-none placeholder:font-normal placeholder:text-[#98a2b3]"
          />

          <div className="mt-3 rounded-[16px] bg-[#f7f7fa] p-3 ring-1 ring-black/5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[13px] font-semibold text-white">
                {promotion?.profile_image_url ? (
                  <img
                    src={
                      promotion.profile_image_url
                    }
                    alt={sourceName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <i className="fa-solid fa-store text-[14px]" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="line-clamp-1 text-[13px] font-semibold text-[#111827]">
                  {sourceName}
                </div>
                <div className="mt-1 line-clamp-1 text-[12px] font-semibold text-[#111827]">
                  {promotion?.title ||
                    'Shadow Mall'}
                </div>
                <p className="mt-1 line-clamp-3 whitespace-pre-wrap break-words text-[12px] font-normal leading-5 text-[#667085]">
                  {promotion?.description ||
                    'Shadow Mall promotion'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-end">
            <button
              type="button"
              onClick={handleEchoNow}
              disabled={sending}
              className="h-11 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#8b5cf6] to-[#a855f7] px-6 text-[14px] font-normal text-white shadow-[0_8px_20px_rgba(139,92,246,0.28)] active:scale-95 disabled:opacity-60"
            >
              {sending
                ? 'Echoing...'
                : 'Echo now'}
            </button>
          </div>
        </div>

        {message ? (
          <div className="mt-3 rounded-[16px] bg-white px-4 py-3 text-[12px] font-normal text-[#667085] ring-1 ring-black/5">
            {message}
          </div>
        ) : null}

        <div className="mt-5">
          <div className="mb-3 text-[12px] font-normal uppercase tracking-[0.08em] text-[#98a2b3]">
            Readers
          </div>
          <div className="flex gap-4 overflow-x-auto pb-1">
            {followersLoading ? (
              Array.from({
                length: 5,
              }).map((_, index) => (
                <div
                  key={index}
                  className="w-[76px] shrink-0"
                >
                  <div className="mx-auto h-14 w-14 animate-pulse rounded-full bg-[#e5e7eb]" />
                  <div className="mx-auto mt-2 h-3 w-12 animate-pulse rounded-full bg-[#e5e7eb]" />
                </div>
              ))
            ) : followers.length ? (
              followers.map((reader) => (
                <ReaderCircle
                  key={reader.id}
                  reader={reader}
                  active={selectedReaders.includes(
                    String(reader.id)
                  )}
                  onClick={() =>
                    handleReaderToggle(
                      reader.id
                    )
                  }
                />
              ))
            ) : (
              <div className="py-3 text-[12px] font-normal text-[#98a2b3]">
                {followersError ||
                  'No followers yet.'}
              </div>
            )}
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-3 text-[12px] font-normal uppercase tracking-[0.08em] text-[#98a2b3]">
            Share
          </div>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              className="rounded-[18px] bg-white px-3 py-4 text-center shadow-sm ring-1 ring-black/5 active:scale-95"
            >
              <i className="fa-solid fa-link text-[20px] text-[#111827]" />
              <div className="mt-2 text-[12px] font-normal text-[#111827]">
                Copy link
              </div>
            </button>

            <button
              type="button"
              onClick={handleTelegram}
              className="rounded-[18px] bg-white px-3 py-4 text-center shadow-sm ring-1 ring-black/5 active:scale-95"
            >
              <i className="fa-brands fa-telegram text-[22px] text-[#229ed9]" />
              <div className="mt-2 text-[12px] font-normal text-[#111827]">
                Telegram
              </div>
            </button>

            <button
              type="button"
              onClick={handleFacebook}
              className="rounded-[18px] bg-white px-3 py-4 text-center shadow-sm ring-1 ring-black/5 active:scale-95"
            >
              <i className="fa-brands fa-facebook text-[22px] text-[#1877f2]" />
              <div className="mt-2 text-[12px] font-normal text-[#111827]">
                Facebook
              </div>
            </button>
          </div>
        </div>
      </section>

      {activePanel ===
      'destination' ? (
        <ChoiceSheet
          title="Choose destination"
          subtitle="Choose where this echo should appear."
          options={DESTINATIONS}
          value={destination}
          onChoose={(value) => {
            setDestination(value)
            setActivePanel('')
          }}
          onBack={() =>
            setActivePanel('')
          }
        />
      ) : null}

      {activePanel === 'audience' ? (
        <ChoiceSheet
          title="Choose audience"
          subtitle="Choose who can see this echo."
          options={AUDIENCES}
          value={audience}
          onChoose={(value) => {
            setAudience(value)
            setActivePanel('')
          }}
          onBack={() =>
            setActivePanel('')
          }
        />
      ) : null}
    </div>
  )
}

export default function ShadowMallPromotionSocial({
  promotion,
}) {
  const reactionPressTimerRef =
    useRef(null)
  const longPressOpenedRef =
    useRef(false)
  const reactionPickerRef =
    useRef(null)
  const [reactionPickerOpen, setReactionPickerOpen] =
    useState(false)
  const [reactionBusy, setReactionBusy] =
    useState(false)
  const [reactionType, setReactionType] =
    useState(
      promotion?.my_reaction || null
    )
  const [reactionCount, setReactionCount] =
    useState(
      Number(promotion?.like_count || 0)
    )
  const [commentCount, setCommentCount] =
    useState(
      Number(
        promotion?.comment_count || 0
      )
    )
  const [echoCount, setEchoCount] =
    useState(
      Number(promotion?.echo_count || 0)
    )
  const [commentOpen, setCommentOpen] =
    useState(false)
  const [echoOpen, setEchoOpen] =
    useState(false)
  const [message, setMessage] =
    useState('')

  const activeReaction =
    REACTIONS.find(
      (reaction) =>
        reaction.type === reactionType
    ) || null

  useEffect(() => {
    setReactionCount(
      Number(promotion?.like_count || 0)
    )
  }, [promotion?.like_count])

  useEffect(() => {
    setCommentCount(
      Number(
        promotion?.comment_count || 0
      )
    )
  }, [promotion?.comment_count])

  useEffect(() => {
    setEchoCount(
      Number(promotion?.echo_count || 0)
    )
  }, [promotion?.echo_count])

  useEffect(() => {
    if (!reactionPickerOpen) {
      return undefined
    }

    function closeReactionPicker(event) {
      if (
        reactionPickerRef.current &&
        !reactionPickerRef.current.contains(
          event.target
        )
      ) {
        setReactionPickerOpen(false)
      }
    }

    document.addEventListener(
      'pointerdown',
      closeReactionPicker
    )

    return () => {
      document.removeEventListener(
        'pointerdown',
        closeReactionPicker
      )
    }
  }, [reactionPickerOpen])

  useEffect(() => {
    let ignore = false
    const token = getAuthToken()

    if (!promotion?.id || !token) {
      return undefined
    }

    async function loadReactionStatus() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/shadow-mall/promotions/${encodeURIComponent(
            promotion.id
          )}/reaction`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
            cache: 'no-store',
          }
        )

        const data = await response
          .json()
          .catch(() => ({}))

        if (
          ignore ||
          !response.ok ||
          data.ok === false
        ) {
          return
        }

        setReactionType(
          data.my_reaction || null
        )
        setReactionCount(
          Number(data.like_count || 0)
        )
      } catch {
        return
      }
    }

    loadReactionStatus()

    return () => {
      ignore = true
    }
  }, [promotion?.id])

  useEffect(() => {
    return () => {
      if (
        reactionPressTimerRef.current
      ) {
        window.clearTimeout(
          reactionPressTimerRef.current
        )
      }
    }
  }, [])

  const showMessage = (value) => {
    setMessage(value)
    window.clearTimeout(
      showMessage.timer
    )
    showMessage.timer = window.setTimeout(
      () => setMessage(''),
      1800
    )
  }

  async function updateReaction(
    nextReactionType
  ) {
    if (
      !promotion?.id ||
      reactionBusy
    ) {
      return
    }

    const token = getAuthToken()

    if (!token) {
      showMessage('Please login first.')
      return
    }

    try {
      setReactionBusy(true)

      const response = await fetch(
        `${API_BASE_URL}/api/shadow-mall/promotions/${encodeURIComponent(
          promotion.id
        )}/reaction`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            reaction_type:
              nextReactionType,
          }),
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
            'Failed to update reaction'
        )
      }

      setReactionType(
        data.reacted
          ? data.reaction_type ||
              nextReactionType
          : null
      )
      setReactionCount(
        Number(data.like_count || 0)
      )
      setReactionPickerOpen(false)
    } catch (error) {
      showMessage(
        error.message ||
          'Failed to update reaction.'
      )
    } finally {
      setReactionBusy(false)
    }
  }

  function startReactionPress() {
    if (reactionBusy) return

    longPressOpenedRef.current = false
    reactionPressTimerRef.current =
      window.setTimeout(() => {
        longPressOpenedRef.current = true
        reactionPressTimerRef.current =
          null
        setReactionPickerOpen(true)
      }, 420)
  }

  function endReactionPress() {
    if (
      reactionPressTimerRef.current
    ) {
      window.clearTimeout(
        reactionPressTimerRef.current
      )
      reactionPressTimerRef.current = null
    }

    if (longPressOpenedRef.current) {
      longPressOpenedRef.current = false
      return
    }

    updateReaction('love')
  }

  function cancelReactionPress() {
    if (
      reactionPressTimerRef.current
    ) {
      window.clearTimeout(
        reactionPressTimerRef.current
      )
      reactionPressTimerRef.current = null
    }

    longPressOpenedRef.current = false
  }

  return (
    <>
      <div className="flex items-center gap-6 px-4 py-2 text-[13px] font-normal text-gray-500">
        <div
          ref={reactionPickerRef}
          className="relative"
        >
          {reactionPickerOpen ? (
            <div className="absolute bottom-8 left-0 z-40 flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-2xl ring-1 ring-black/10">
              {REACTIONS.map((reaction) => (
                <button
                  key={reaction.type}
                  type="button"
                  disabled={reactionBusy}
                  onClick={() =>
                    updateReaction(
                      reaction.type
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full active:scale-90 disabled:opacity-60"
                  aria-label={reaction.label}
                >
                  <img
                    src={reaction.src}
                    alt={reaction.label}
                    className="h-8 w-8 object-contain"
                  />
                </button>
              ))}
            </div>
          ) : null}

          <button
            type="button"
            disabled={reactionBusy}
            onPointerDown={
              startReactionPress
            }
            onPointerUp={endReactionPress}
            onPointerLeave={
              cancelReactionPress
            }
            onPointerCancel={() => {
              cancelReactionPress()
              setReactionPickerOpen(false)
            }}
            onContextMenu={(event) =>
              event.preventDefault()
            }
            className="inline-flex items-center gap-1.5 active:scale-95 disabled:opacity-60"
            style={{
              color:
                activeReaction?.text ||
                undefined,
            }}
            aria-label={
              activeReaction
                ? activeReaction.label
                : 'React'
            }
          >
            {activeReaction ? (
              <img
                src={activeReaction.src}
                alt=""
                aria-hidden="true"
                className="h-[17px] w-[17px] object-contain"
              />
            ) : (
              <i className="fa-regular fa-heart text-[15px]" />
            )}
            <span>
              {formatCompactNumber(
                reactionCount
              )}
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={() =>
            setCommentOpen(true)
          }
          className="inline-flex items-center gap-1.5 active:scale-95"
          aria-label="Comment on promotion"
        >
          <i className="fa-regular fa-comment text-[15px]" />
          <span>
            {formatCompactNumber(
              commentCount
            )}
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            setEchoOpen(true)
          }
          className="inline-flex items-center gap-1.5 active:scale-95"
          aria-label="Echo promotion"
        >
          <img
            src="/assets/Icons/echo.svg"
            alt=""
            aria-hidden="true"
            className="h-[15px] w-[15px] object-contain opacity-70"
          />
          <span>
            {formatCompactNumber(
              echoCount
            )}
          </span>
        </button>
      </div>

      {message ? (
        <div className="fixed left-1/2 top-20 z-[200080] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#111827] px-4 py-2 text-[12px] font-normal text-white shadow-2xl">
          {message}
        </div>
      ) : null}

      <CommentsModal
        open={commentOpen}
        promotion={promotion}
        reactionCount={reactionCount}
        commentCount={commentCount}
        echoCount={echoCount}
        onClose={() =>
          setCommentOpen(false)
        }
        onTotalChange={(nextTotal) =>
          setCommentCount(nextTotal)
        }
      />

      <EchoShareSheet
        open={echoOpen}
        promotion={promotion}
        onClose={() =>
          setEchoOpen(false)
        }
        onEchoed={(_, nextTotal) =>
          setEchoCount(
            Number(nextTotal || 0)
          )
        }
      />
    </>
  )
}
