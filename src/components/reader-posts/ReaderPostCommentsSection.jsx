import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import ReportModal from '../ReportModal'
import ReactionAction from '../social/reactions/ReactionAction'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://shadow-backend-kucw.onrender.com'

const COMMENT_PAGE_SIZE = 20
const COMMENT_LIMIT = 1000

const SORT_OPTIONS = [
  {
    value: 'top',
    label: 'Hot comments',
    description: 'Show comments with the most likes first.',
  },
  {
    value: 'newest',
    label: 'Newest',
    description: 'Show the newest comments first.',
  },
  {
    value: 'all',
    label: 'All comments',
    description: 'Show all comments.',
  },
]

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function getStoredUser() {
  try {
    return JSON.parse(
      localStorage.getItem('shadow_reader_user') ||
        sessionStorage.getItem('shadow_reader_user') ||
        'null'
    )
  } catch {
    return null
  }
}

function formatTime(value) {
  const timestamp = new Date(value || 0).getTime()

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
  const days = Math.floor(
    hours / 24
  )

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`

  return new Date(timestamp).toLocaleDateString(
    'en-GB'
  )
}

function normalizeComment(comment) {
  const user = comment?.user || {}

  return {
    id: comment?.id,
    post_id: comment?.post_id,
    user_id:
      comment?.user_id || user.id,
    parent_id:
      comment?.parent_id || null,
    text: comment?.text || '',
    likes: Number(comment?.likes || 0),
    liked: Boolean(comment?.liked),
    reaction_type:
      comment?.reaction_type || null,
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

function Avatar({
  user,
  small = false,
}) {
  const name =
    user?.name || 'Reader'
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
      {name
        .slice(0, 1)
        .toUpperCase()}
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
        <i
          className={`${icon} text-[17px]`}
        />
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
          onClick={() =>
            runAction(onReply)
          }
        />

        <MenuRow
          icon="fa-regular fa-copy"
          label="Copy"
          onClick={() =>
            runAction(onCopy)
          }
        />

        {ownsComment ? (
          <>
            <MenuRow
              icon="fa-regular fa-pen-to-square"
              label="Edit"
              onClick={() =>
                runAction(onEdit)
              }
            />

            <MenuRow
              icon="fa-regular fa-trash-can"
              label="Delete"
              danger
              onClick={() =>
                runAction(onDelete)
              }
            />
          </>
        ) : (
          <>
            <MenuRow
              icon="fa-regular fa-flag"
              label="Report comment"
              onClick={() =>
                runAction(onReport)
              }
            />

            <MenuRow
              icon="fa-regular fa-eye-slash"
              label="Hide this comment"
              onClick={() =>
                runAction(onHide)
              }
            />
          </>
        )}
      </section>
    </div>
  )
}

function AutoGrowTextarea({
  value,
  onChange,
  ...props
}) {
  const textareaRef = useRef(null)

  useEffect(() => {
    const textarea =
      textareaRef.current

    if (!textarea) return

    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      118
    )}px`
  }, [value])

  return (
    <textarea
      {...props}
      ref={textareaRef}
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      onInput={(event) => {
        const textarea =
          event.currentTarget
        textarea.style.height = 'auto'
        textarea.style.height = `${Math.min(
          textarea.scrollHeight,
          118
        )}px`
      }}
    />
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
        <AutoGrowTextarea
          value={value}
          onChange={onChange}
          maxLength={COMMENT_LIMIT}
          rows={1}
          placeholder="Write a reply..."
          className="max-h-[118px] min-h-[24px] min-w-0 flex-1 resize-none overflow-y-auto bg-transparent text-[13px] font-normal leading-5 text-[#111827] outline-none placeholder:text-[#98a2b3]"
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
        disabled={
          !value.trim() || sending
        }
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

function ReplyItem({
  reply,
  onLike,
}) {
  return (
    <div className="flex gap-2">
      <Avatar
        user={reply.user}
        small
      />

      <div className="min-w-0 flex-1">
        <div className="inline-block max-w-full rounded-[16px] bg-[#f3f4f6] px-3 py-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-semibold text-[#111827]">
              {reply.user?.name ||
                'Reader'}
            </span>

            <span className="text-[10px] font-normal text-[#98a2b3]">
              {formatTime(
                reply.created_at
              )}
            </span>
          </div>

          <p className="mt-1 whitespace-pre-wrap break-words text-[12.5px] font-normal leading-5 text-[#4b5563]">
            {reply.text}
          </p>
        </div>

                <ReactionAction
          reactionType={
            reply.reaction_type ||
            (reply.liked
              ? 'love'
              : '')
          }
          count={reply.likes}
          showCount={
            Number(reply.likes || 0) > 0
          }
          onReact={(reactionType) =>
            onLike(
              reply.id,
              reactionType
            )
          }
          idleLabel="Like"
          className="ml-3 mt-1"
          buttonClassName="text-[11px] font-semibold after:ml-1 after:content-['Like']"
          countClassName="text-[11px] font-semibold"
          pickerAlign="left"
        />
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
  const [
    repliesShown,
    setRepliesShown,
  ] = useState(false)

  const replies = Array.isArray(
    comment.replies
  )
    ? comment.replies
    : []

  const openReplyComposer = () => {
    setReplyOpen(true)
    setRepliesShown(true)
  }

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
              onClick={() =>
                setMenuOpen(true)
              }
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
              onClick={() =>
                setMenuOpen(true)
              }
              className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full text-[#98a2b3] active:scale-95"
              aria-label="Comment options"
            >
              <i className="fa-solid fa-ellipsis text-[14px]" />
            </button>
          </div>

          <div className="mt-1 flex items-center gap-4 pl-3 text-[12px] font-semibold text-[#98a2b3]">
                        <ReactionAction
              reactionType={
                comment.reaction_type ||
                (comment.liked
                  ? 'love'
                  : '')
              }
              count={comment.likes}
              showCount={
                Number(
                  comment.likes || 0
                ) > 0
              }
              onReact={(reactionType) =>
                onLike(
                  comment.id,
                  reactionType
                )
              }
              idleLabel="Like"
              buttonClassName="text-[12px] font-semibold after:ml-1 after:content-['Like']"
              countClassName="text-[12px] font-semibold"
              pickerAlign="left"
            />

            <button
              type="button"
              onClick={openReplyComposer}
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

          {repliesShown &&
          replies.length ? (
            <div className="mt-3 space-y-3 border-l-2 border-[#eef1f5] pl-3">
              {replies.map(
                (reply) => (
                  <ReplyItem
                    key={reply.id}
                    reply={reply}
                    onLike={
                      onLike
                    }
                  />
                )
              )}
            </div>
          ) : null}

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
        </div>
      </div>

      <CommentOptionsSheet
        comment={
          menuOpen
            ? comment
            : null
        }
        currentUserId={
          currentUserId
        }
        onClose={() =>
          setMenuOpen(false)
        }
        onReply={openReplyComposer}
        onCopy={() =>
          onCopy(comment)
        }
        onEdit={() =>
          onEdit(comment)
        }
        onDelete={() =>
          onDelete(comment)
        }
        onHide={() =>
          onHide(comment)
        }
        onReport={() =>
          onReport(comment)
        }
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
    <div className="fixed inset-0 z-[300] flex items-end justify-center bg-black/40 px-4">
      <section className="w-full max-w-xl rounded-t-[26px] bg-white px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-4 shadow-2xl sm:mb-6 sm:rounded-[26px]">
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
            onChange(
              event.target.value
            )
          }
          rows={5}
          className="mt-4 w-full resize-none rounded-[18px] bg-[#f3f4f6] px-4 py-3 text-[14px] font-normal leading-6 outline-none focus:ring-2 focus:ring-[#111827]/10"
        />

        <button
          type="button"
          onClick={onSave}
          disabled={
            !value.trim() ||
            saving
          }
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

function SortSheet({
  open,
  value,
  onChoose,
  onClose,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[280] flex items-end justify-center bg-black/35">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0"
        aria-label="Close comment filter"
      />

      <section className="relative w-full max-w-3xl rounded-t-[28px] bg-white px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-4 shadow-2xl sm:mb-4 sm:rounded-[28px]">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[#d0d5dd]" />

        {SORT_OPTIONS.map(
          (option) => {
            const active =
              value === option.value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  onChoose(
                    option.value
                  )
                }
                className="flex w-full items-center gap-3 px-3 py-3 text-left active:bg-[#f8fafc]"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-normal text-[#111827]">
                    {option.label}
                  </span>

                  <span className="mt-0.5 block text-[13px] font-normal leading-5 text-[#667085]">
                    {
                      option.description
                    }
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
          }
        )}
      </section>
    </div>
  )
}

export default function ReaderPostCommentsSection({
  postId,
  postOwnerId,
  commentsPermission = 'everyone',
  commentCount = 0,
  onTotalChange,
}) {
  const composerRef =
    useRef(null)

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
  const [page, setPage] =
    useState(1)
  const [hasMore, setHasMore] =
    useState(false)
  const [total, setTotal] =
    useState(
      Number(commentCount || 0)
    )
  const [loading, setLoading] =
    useState(false)
  const [
    loadingMore,
    setLoadingMore,
  ] = useState(false)
  const [text, setText] =
    useState('')
  const [sending, setSending] =
    useState(false)
  const [
    sendingReply,
    setSendingReply,
  ] = useState(false)
  const [toast, setToast] =
    useState('')
  const [
    editComment,
    setEditComment,
  ] = useState(null)
  const [editText, setEditText] =
    useState('')
  const [
    savingEdit,
    setSavingEdit,
  ] = useState(false)
  const [
    reportComment,
    setReportComment,
  ] = useState(null)
  const [
    hiddenIds,
    setHiddenIds,
  ] = useState(
    () => new Set()
  )

  const selectedSort =
    SORT_OPTIONS.find(
      (option) =>
        option.value === sort
    ) || SORT_OPTIONS[0]

  const visibleComments =
    useMemo(
      () =>
        comments.filter(
          (comment) =>
            !hiddenIds.has(
              String(comment.id)
            )
        ),
      [comments, hiddenIds]
    )

  const commentingDisabled =
    commentsPermission ===
      'no_one' &&
    String(currentUserId) !==
      String(postOwnerId || '')

  useEffect(() => {
    setTotal(
      Number(commentCount || 0)
    )
  }, [commentCount])

  const showToast = (value) => {
    setToast(value)
    window.clearTimeout(
      showToast.timer
    )
    showToast.timer =
      window.setTimeout(
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

  const buildListUrl = (
    nextPage
  ) => {
    const sortValue =
      sort === 'all'
        ? 'newest'
        : sort

    return `${API_BASE_URL}/api/reader-posts/${encodeURIComponent(
      postId
    )}/comments?page=${nextPage}&limit=${COMMENT_PAGE_SIZE}&sort=${sortValue}`
  }

  async function fetchComments(
    nextPage = 1,
    append = false
  ) {
    if (!postId) return

    const token =
      getAuthToken()

    try {
      append
        ? setLoadingMore(true)
        : setLoading(true)

      const response =
        await fetch(
          buildListUrl(
            nextPage
          ),
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

      const data =
        await response
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

      const normalized =
        Array.isArray(
          data.comments
        )
          ? data.comments.map(
              normalizeComment
            )
          : []

      setComments(
        (current) =>
          append
            ? [
                ...current,
                ...normalized,
              ]
            : normalized
      )

      setPage(
        Number(
          data.page ||
            nextPage
        )
      )
      setHasMore(
        Boolean(
          data.has_more
        )
      )
      applyTotal(
        data.total ??
          normalized.length
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
    if (!postId) return

    setComments([])
    setPage(1)
    setHasMore(false)
    setHiddenIds(new Set())
    fetchComments(1, false)
  }, [postId, sort])

  const updateCommentLocal = (
    commentId,
    changes
  ) => {
    setComments(
      (current) =>
        current.map(
          (comment) => {
            if (
              comment.id ===
              commentId
            ) {
              return {
                ...comment,
                ...changes,
              }
            }

            return {
              ...comment,
              replies: (
                comment.replies ||
                []
              ).map(
                (reply) =>
                  reply.id ===
                  commentId
                    ? {
                        ...reply,
                        ...changes,
                      }
                    : reply
              ),
            }
          }
        )
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

    const token =
      getAuthToken()

    if (!token) {
      showToast(
        'Please login to comment.'
      )
      return
    }

    try {
      setSending(true)

      const response =
        await fetch(
          `${API_BASE_URL}/api/reader-posts/${encodeURIComponent(
            postId
          )}/comments`,
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

      const data =
        await response
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

      setComments(
        (current) => [
          normalizeComment(
            data.comment
          ),
          ...current,
        ]
      )

      setText('')

      applyTotal(
        data.comment_count ??
          total + 1
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
    const token =
      getAuthToken()

    if (!token) {
      showToast(
        'Please login to reply.'
      )
      return false
    }

    try {
      setSendingReply(true)

      const response =
        await fetch(
          `${API_BASE_URL}/api/reader-posts/${encodeURIComponent(
            postId
          )}/comments`,
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
              parent_id:
                parentId,
            }),
          }
        )

      const data =
        await response
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

      const createdReply =
        normalizeComment(
          data.comment
        )

      setComments(
        (current) =>
          current.map(
            (comment) =>
              comment.id ===
              parentId
                ? {
                    ...comment,
                    replies: [
                      ...(comment.replies ||
                        []),
                      createdReply,
                    ],
                  }
                : comment
          )
      )

      applyTotal(
        data.comment_count ??
          total + 1
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

  async function toggleLike(
    commentId,
    reactionType = 'love'
  ) {
    const token =
      getAuthToken()

    if (!token) {
      showToast(
        'Please login to react.'
      )
      return
    }

    const nextReactionType = String(
      reactionType || 'love'
    )
      .trim()
      .toLowerCase()

    try {
      const response =
        await fetch(
          `${API_BASE_URL}/api/reader-posts/comments/${encodeURIComponent(
            commentId
          )}/like`,
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

      const data =
        await response
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

      updateCommentLocal(
        commentId,
        {
          liked: Boolean(
            data.liked
          ),
          reaction_type:
            data.reaction_type || null,
          likes: Number(
            data.likes || 0
          ),
        }
      )
    } catch (error) {
      showToast(
        error.message ||
          'Failed to update reaction.'
      )
    }
  }

  async function copyComment(
    comment
  ) {
    const value = String(
      comment?.text || ''
    ).trim()

    if (!value) return

    try {
      await navigator.clipboard.writeText(
        value
      )
      showToast(
        'Comment copied.'
      )
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

    const token =
      getAuthToken()

    if (!token) {
      showToast(
        'Please login again.'
      )
      return
    }

    try {
      setSavingEdit(true)

      const response =
        await fetch(
          `${API_BASE_URL}/api/reader-posts/comments/${encodeURIComponent(
            editComment.id
          )}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type':
                'application/json',
              Authorization:
                `Bearer ${token}`,
            },
            body: JSON.stringify({
              text:
                editText.trim(),
            }),
          }
        )

      const data =
        await response
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

      updateCommentLocal(
        editComment.id,
        normalizeComment(
          data.comment
        )
      )

      setEditComment(null)
      setEditText('')
      showToast(
        'Comment updated.'
      )
    } catch (error) {
      showToast(
        error.message ||
          'Failed to update comment.'
      )
    } finally {
      setSavingEdit(false)
    }
  }

  async function deleteComment(
    comment
  ) {
    const token =
      getAuthToken()

    if (!token) {
      showToast(
        'Please login again.'
      )
      return
    }

    try {
      const response =
        await fetch(
          `${API_BASE_URL}/api/reader-posts/comments/${encodeURIComponent(
            comment.id
          )}`,
          {
            method: 'DELETE',
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        )

      const data =
        await response
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

      setComments(
        (current) =>
          current
            .filter(
              (item) =>
                item.id !==
                comment.id
            )
            .map(
              (item) => ({
                ...item,
                replies: (
                  item.replies ||
                  []
                ).filter(
                  (reply) =>
                    reply.id !==
                    comment.id
                ),
              })
            )
      )

      applyTotal(
        data.comment_count ??
          Math.max(
            0,
            total - 1
          )
      )

      showToast(
        'Comment deleted.'
      )
    } catch (error) {
      showToast(
        error.message ||
          'Failed to delete comment.'
      )
    }
  }

  const hideComment = (
    comment
  ) => {
    setHiddenIds(
      (current) => {
        const next =
          new Set(current)
        next.add(
          String(
            comment.id
          )
        )
        return next
      }
    )

    showToast(
      'Comment hidden on your device.'
    )
  }

  return (
    <section className="relative bg-white pb-[76px]">
      <div className="sticky top-[56px] z-30 border-b border-[#eef0f4] bg-white px-4 py-3">
        <button
          type="button"
          onClick={() =>
            setSortOpen(true)
          }
          className="flex items-center gap-1 text-[14px] font-normal text-[#111827] active:scale-95"
        >
          <span>
            {selectedSort.label}
          </span>
          <i className="fa-solid fa-chevron-down text-[10px]" />
        </button>
      </div>

      {loading &&
      !visibleComments.length ? (
        <div className="space-y-3 px-4 py-4">
          {Array.from({
            length: 5,
          }).map(
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
                onLike={
                  toggleLike
                }
                onReply={
                  sendReply
                }
                onCopy={
                  copyComment
                }
                onEdit={(
                  selected
                ) => {
                  setEditComment(
                    selected
                  )
                  setEditText(
                    selected.text ||
                      ''
                  )
                }}
                onDelete={
                  deleteComment
                }
                onHide={
                  hideComment
                }
                onReport={
                  setReportComment
                }
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
                disabled={
                  loadingMore
                }
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

      <div className="sticky bottom-0 z-40 border-t border-[#eef1f5] bg-white px-3 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-3xl items-end gap-2">
          <div className="flex min-w-0 flex-1 items-center rounded-[22px] bg-[#f3f4f6] px-4 py-2">
            <textarea
              ref={composerRef}
              id="reader-post-comment-input"
              value={text}
              maxLength={
                COMMENT_LIMIT
              }
              disabled={
                commentingDisabled ||
                sending
              }
              onChange={(
                event
              ) => {
                const textarea =
                  event.currentTarget
                setText(
                  textarea.value
                )
                textarea.style.height =
                  'auto'
                textarea.style.height =
                  `${Math.min(
                    textarea.scrollHeight,
                    118
                  )}px`
              }}
              rows={1}
              placeholder={
                commentingDisabled
                  ? 'Comments are turned off for this post.'
                  : 'Write a comment...'
              }
              className="max-h-[118px] min-h-[24px] w-full resize-none overflow-y-auto bg-transparent text-[14px] font-normal leading-6 text-[#111827] outline-none placeholder:text-[#98a2b3] disabled:cursor-not-allowed"
            />
          </div>

          <button
            type="button"
            onClick={
              sendComment
            }
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
        <div className="fixed bottom-[88px] left-1/2 z-[310] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#111827] px-4 py-2 text-[12px] font-normal text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <SortSheet
        open={sortOpen}
        value={sort}
        onChoose={(
          nextSort
        ) => {
          setSort(nextSort)
          setSortOpen(false)
        }}
        onClose={() =>
          setSortOpen(false)
        }
      />

      <EditCommentSheet
        comment={
          editComment
        }
        value={editText}
        onChange={
          setEditText
        }
        onClose={() => {
          setEditComment(null)
          setEditText('')
        }}
        onSave={saveEdit}
        saving={savingEdit}
      />

      <ReportModal
        open={Boolean(
          reportComment
        )}
        reportType="comment"
        targetId={
          reportComment?.id
        }
        targetTitle={
          reportComment
            ? `${
                reportComment
                  .user?.name ||
                'Reader'
              }: ${String(
                reportComment.text ||
                  ''
              ).slice(0, 80)}`
            : ''
        }
        onClose={() =>
          setReportComment(null)
        }
      />
    </section>
  )
}
