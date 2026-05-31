import { useEffect, useMemo, useState } from 'react'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function getStoredUser() {
  try {
    const raw =
      localStorage.getItem('shadow_reader_user') ||
      sessionStorage.getItem('shadow_reader_user') ||
      ''

    if (!raw) return null

    return JSON.parse(raw)
  } catch {
    return null
  }
}

function getCurrentUser() {
  const user = getStoredUser()

  if (!user) {
    return {
      id: null,
      name: 'Reader',
      avatar_url: '',
      role: 'reader',
      is_admin: false,
    }
  }

  const emailName = user.email ? String(user.email).split('@')[0] : ''
  const role = user.role || 'reader'

  return {
    id: user.id || user.user_id || null,
    name: user.name || user.username || user.display_name || emailName || 'Reader',
    avatar_url: user.avatar_url || user.profile_image || user.photo_url || '',
    role,
    is_admin: role === 'admin' || role === 'super_admin',
  }
}

function getStoryOwnerId(story) {
  return (
    story?.user_id ||
    story?.author_user_id ||
    story?.author_id ||
    story?.owner_id ||
    story?.created_by ||
    story?.author?.user_id ||
    story?.author_page?.user_id ||
    null
  )
}

function isStoryAuthor(currentUser, story) {
  const ownerId = getStoryOwnerId(story)

  if (!currentUser?.id || !ownerId) return false

  return String(currentUser.id) === String(ownerId)
}

function formatTime(value) {
  if (!value) return 'Just now'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Just now'

  const diff = Date.now() - date.getTime()
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) return 'Just now'
  if (diff < hour) return `${Math.floor(diff / minute)}m`
  if (diff < day) return `${Math.floor(diff / hour)}h`

  return date.toLocaleDateString('en-GB')
}

function normalizeApiComment(comment) {
  const user = comment.user || {}

  return {
    id: comment.id,
    story_id: comment.story_id,
    user_id: comment.user_id || user.id,
    parent_id: comment.parent_id,
    text: comment.text || '',
    type: comment.type || 'text',
    likes: Number(comment.likes || 0),
    liked: Boolean(comment.liked),
    is_pinned: Boolean(comment.is_pinned),
    is_hidden: Boolean(comment.is_hidden),
    is_spoiler: Boolean(comment.is_spoiler),
    created_at: comment.created_at,
    updated_at: comment.updated_at,
    name: user.name || comment.name || 'Reader',
    avatar_url: user.avatar_url || comment.avatar_url || '',
    replies: [],
  }
}

function Avatar({ user, size = 'h-10 w-10', textSize = 'text-[13px]' }) {
  const avatar = user?.avatar_url || ''
  const name = user?.name || 'Reader'

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${size} shrink-0 rounded-full object-cover`}
      />
    )
  }

  return (
    <div className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-[#111827] ${textSize} font-black text-white`}>
      {name.slice(0, 1).toUpperCase()}
    </div>
  )
}

function EmptyComments({ onFocus }) {
  return (
    <div className="px-5 py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]">
        <i className="fa-regular fa-comments text-[22px]" />
      </div>

      <h3 className="mt-4 text-[17px] font-black text-[#111827]">No comments yet</h3>

      <p className="mx-auto mt-2 max-w-[360px] text-[13px] font-semibold leading-6 text-[#667085]">
        Start the conversation. Share what you feel, ask a question, or cheer for this story.
      </p>

      <button
        type="button"
        onClick={onFocus}
        className="mt-5 h-11 rounded-full bg-[#111827] px-5 text-[13px] font-black text-white active:scale-95"
      >
        Write a comment
      </button>
    </div>
  )
}

function MenuButton({ icon, label, danger = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-4 py-3 text-left text-[13px] font-extrabold hover:bg-[#f5f3fa] ${
        danger ? 'text-[#e5484d] hover:bg-[#fff1f1]' : 'text-[#111827]'
      }`}
    >
      <i className={`${icon} w-4 ${danger ? '' : 'text-[#8d94a1]'}`} />
      {label}
    </button>
  )
}

function CommentMenu({
  isOpen,
  permissions,
  comment,
  onEdit,
  onDelete,
  onHide,
  onUnhide,
  onPin,
  onUnpin,
  onSpoiler,
  onUnspoiler,
  onBan,
  onClose,
}) {
  if (!isOpen) return null

  return (
    <div className="absolute right-0 top-8 z-20 w-52 overflow-hidden rounded-[18px] bg-white text-[#111827] shadow-[0_14px_40px_rgba(17,24,39,0.16)] ring-1 ring-black/5">
      {permissions.isOwner ? (
        <MenuButton
          icon="fa-regular fa-pen-to-square"
          label="Edit"
          onClick={() => {
            onEdit()
            onClose()
          }}
        />
      ) : null}

      {permissions.isOtherReader ? (
        <MenuButton
          icon="fa-regular fa-eye-slash"
          label="Hide this comment"
          onClick={() => {
            onHide()
            onClose()
          }}
        />
      ) : null}

      {permissions.isAuthor ? (
        <>
          <MenuButton
            icon="fa-solid fa-thumbtack"
            label={comment.is_pinned ? 'Unpin comment' : 'Pin comment'}
            onClick={() => {
              comment.is_pinned ? onUnpin() : onPin()
              onClose()
            }}
          />
          <MenuButton
            icon="fa-regular fa-eye-slash"
            label="Hide comment"
            onClick={() => {
              onHide()
              onClose()
            }}
          />
          <MenuButton
            icon="fa-solid fa-ban"
            label="Ban user"
            danger
            onClick={() => {
              onBan()
              onClose()
            }}
          />
          <MenuButton
            icon={comment.is_spoiler ? 'fa-regular fa-eye' : 'fa-solid fa-triangle-exclamation'}
            label={comment.is_spoiler ? 'Remove spoiler mark' : 'Spoiler mark'}
            onClick={() => {
              comment.is_spoiler ? onUnspoiler() : onSpoiler()
              onClose()
            }}
          />
        </>
      ) : null}

      {permissions.isAdmin ? (
        <>
          <MenuButton
            icon="fa-regular fa-trash-can"
            label="Delete"
            danger
            onClick={() => {
              onDelete()
              onClose()
            }}
          />
          <MenuButton
            icon={comment.is_hidden ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash'}
            label={comment.is_hidden ? 'Unhide' : 'Hide'}
            onClick={() => {
              comment.is_hidden ? onUnhide() : onHide()
              onClose()
            }}
          />
          <MenuButton
            icon="fa-solid fa-ban"
            label="Ban user"
            danger
            onClick={() => {
              onBan()
              onClose()
            }}
          />
        </>
      ) : null}
    </div>
  )
}

function ReplyComposer({ value, onChange, onCancel, onSend }) {
  const currentUser = getCurrentUser()

  return (
    <div className="mt-3 flex gap-2">
      <Avatar user={currentUser} size="h-8 w-8" textSize="text-[12px]" />

      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[20px] bg-[#f3f4f6] px-3 py-2">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Write a reply..."
          className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-[#111827] outline-none placeholder:text-[#98a2b3]"
        />

        <button type="button" onClick={onCancel} className="text-[12px] font-black text-[#98a2b3]">
          Cancel
        </button>

        <button
          type="button"
          onClick={onSend}
          disabled={!value.trim()}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111827] text-white disabled:bg-[#d0d5dd]"
          aria-label="Send reply"
        >
          <i className="fa-solid fa-paper-plane text-[12px]" />
        </button>
      </div>
    </div>
  )
}

function CommentItem({
  comment,
  story,
  onLike,
  onReply,
  onEdit,
  onDelete,
  onHide,
  onUnhide,
  onPin,
  onUnpin,
  onSpoiler,
  onUnspoiler,
  onBan,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [repliesShown, setRepliesShown] = useState(false)
  const [spoilerOpen, setSpoilerOpen] = useState(false)
  const replies = Array.isArray(comment.replies) ? comment.replies : []
  const currentUser = getCurrentUser()

  const isOwner =
    comment.user_id &&
    currentUser.id &&
    String(comment.user_id) === String(currentUser.id)

  const author = isStoryAuthor(currentUser, story)
  const admin = currentUser.is_admin

  const permissions = {
    isOwner: isOwner && !admin,
    isOtherReader: !isOwner && !author && !admin,
    isAuthor: author && !admin,
    isAdmin: admin,
  }

  const handleSendReply = () => {
    if (!replyText.trim()) return
    onReply(comment.id, replyText.trim())
    setReplyText('')
    setReplyOpen(false)
    setRepliesShown(true)
  }

  return (
    <article className={`px-4 py-4 ${comment.is_hidden ? 'opacity-60' : ''}`} id={`comment-${comment.id}`}>
      <div className="flex gap-3">
        <Avatar
          user={{
            name: comment.name || 'Reader',
            avatar_url: comment.avatar_url || '',
          }}
        />

        <div className="min-w-0 flex-1">
          <div className="relative">
            <div className="inline-block max-w-full rounded-[18px] bg-[#f3f4f6] px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[13px] font-black text-[#111827]">{comment.name || 'Reader'}</h3>
                <span className="text-[11px] font-semibold text-[#98a2b3]">{formatTime(comment.created_at)}</span>

                {comment.is_pinned ? (
                  <span className="rounded-full bg-[#fff7d6] px-2 py-0.5 text-[10px] font-black text-[#b7791f]">
                    Pinned
                  </span>
                ) : null}

                {comment.is_hidden ? (
                  <span className="rounded-full bg-[#eef2ff] px-2 py-0.5 text-[10px] font-black text-[#4f46e5]">
                    Hidden
                  </span>
                ) : null}
              </div>

              {comment.is_spoiler && !spoilerOpen ? (
                <button
                  type="button"
                  onClick={() => setSpoilerOpen(true)}
                  className="mt-2 rounded-[14px] bg-white px-3 py-2 text-left text-[12px] font-black text-[#667085]"
                >
                  This comment may contain spoilers. Tap to reveal.
                </button>
              ) : comment.type === 'sticker' ? (
                <div className="mt-2 inline-flex h-20 w-20 items-center justify-center rounded-[18px] bg-white text-[#98a2b3]">
                  <i className="fa-regular fa-face-smile text-[30px]" />
                </div>
              ) : (
                <p className="mt-1 whitespace-pre-wrap break-words text-[13.5px] font-medium leading-6 text-[#4b5563]">
                  {comment.text}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full text-[#98a2b3] active:scale-95"
              aria-label="Comment options"
            >
              <i className="fa-solid fa-ellipsis text-[14px]" />
            </button>

            <CommentMenu
              isOpen={menuOpen}
              permissions={permissions}
              comment={comment}
              onEdit={() => onEdit(comment)}
              onDelete={() => onDelete(comment)}
              onHide={() => onHide(comment)}
              onUnhide={() => onUnhide(comment)}
              onPin={() => onPin(comment)}
              onUnpin={() => onUnpin(comment)}
              onSpoiler={() => onSpoiler(comment)}
              onUnspoiler={() => onUnspoiler(comment)}
              onBan={() => onBan(comment)}
              onClose={() => setMenuOpen(false)}
            />
          </div>

          <div className="mt-1 flex items-center gap-4 pl-3 text-[12px] font-extrabold text-[#98a2b3]">
            <button type="button" onClick={() => onLike(comment.id)} className={comment.liked ? 'text-[#e5484d]' : ''}>
              {comment.liked ? 'Liked' : 'Like'} {comment.likes ? `· ${comment.likes}` : ''}
            </button>

            <button type="button" onClick={() => setReplyOpen(true)}>
              Reply
            </button>

            {replies.length ? (
              <button type="button" onClick={() => setRepliesShown((value) => !value)}>
                {repliesShown ? 'Hide replies' : `View ${replies.length} ${replies.length > 1 ? 'replies' : 'reply'}`}
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
              onSend={handleSendReply}
            />
          ) : null}

          {repliesShown && replies.length ? (
            <div className="mt-3 space-y-3 border-l-2 border-[#eef1f5] pl-3">
              {replies.map((reply) => (
                <div key={reply.id} className="flex gap-2">
                  <Avatar
                    user={{
                      name: reply.name || 'Reader',
                      avatar_url: reply.avatar_url || '',
                    }}
                    size="h-8 w-8"
                    textSize="text-[11px]"
                  />

                  <div className="min-w-0">
                    <div className="inline-block rounded-[16px] bg-[#f3f4f6] px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-black text-[#111827]">{reply.name || 'Reader'}</span>
                        <span className="text-[10px] font-semibold text-[#98a2b3]">{formatTime(reply.created_at)}</span>
                      </div>
                      <p className="mt-1 text-[12.5px] font-medium leading-5 text-[#4b5563]">{reply.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  )
}

function CommentComposer({
  value,
  onChange,
  onSend,
  onSticker,
  isModal,
  isBanned,
  sending,
}) {
  const currentUser = getCurrentUser()

  return (
    <div className={`${isModal ? 'shrink-0' : 'fixed bottom-0 left-0 right-0'} z-50 border-t border-[#eef1f5] bg-white px-3 py-3`}>
      <div className="mx-auto flex max-w-3xl items-end gap-2">
        <Avatar user={currentUser} />

        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[22px] bg-[#f3f4f6] px-3 py-2">
          <input
            id="shadow-comment-input"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            disabled={isBanned || sending}
            placeholder={isBanned ? 'You cannot comment on this story.' : 'Write a comment...'}
            className="min-w-0 flex-1 bg-transparent text-[14px] font-medium text-[#111827] outline-none placeholder:text-[#98a2b3] disabled:cursor-not-allowed"
          />

          <button
            type="button"
            onClick={onSticker}
            className="hidden text-[#98a2b3]"
            aria-label="Sticker"
            disabled={isBanned}
          >
            <i className="fa-regular fa-note-sticky text-[17px]" />
          </button>

          <button
            type="button"
            onClick={onSend}
            disabled={!value.trim() || isBanned || sending}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111827] text-white disabled:bg-[#d0d5dd]"
            aria-label="Send comment"
          >
            <i className={`fa-solid ${sending ? 'fa-spinner animate-spin' : 'fa-paper-plane'} text-[13px]`} />
          </button>
        </div>
      </div>
    </div>
  )
}

function EditCommentSheet({ comment, value, onChange, onCancel, onSave, saving }) {
  if (!comment) return null

  return (
    <div className="absolute inset-0 z-[90] flex items-end justify-center bg-black/35 px-4">
      <section className="w-full max-w-xl rounded-t-[26px] bg-white px-5 pb-6 pt-4 shadow-2xl sm:mb-6 sm:rounded-[26px]">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#d0d5dd]" />

        <div className="flex items-center justify-between">
          <h3 className="text-[17px] font-black text-[#111827]">Edit comment</h3>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa]"
          >
            <i className="fa-solid fa-xmark text-[13px]" />
          </button>
        </div>

        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={5}
          className="mt-4 w-full resize-none rounded-[18px] bg-[#f3f4f6] px-4 py-3 text-[14px] font-medium leading-6 outline-none focus:ring-2 focus:ring-[#111827]/10"
        />

        <button
          type="button"
          onClick={onSave}
          disabled={!value.trim() || saving}
          className="mt-4 h-11 w-full rounded-full bg-[#111827] text-[13px] font-black text-white disabled:bg-[#d0d5dd]"
        >
          {saving ? 'Saving...' : 'Save comment'}
        </button>
      </section>
    </div>
  )
}

export default function CommentSection({
  targetType = 'story',
  targetId,
  story,
  variant = 'page',
  onCommentsChange,
}) {
  const [comments, setComments] = useState([])
  const [sort, setSort] = useState('newest')
  const [text, setText] = useState('')
  const [toast, setToast] = useState('')
  const [editComment, setEditComment] = useState(null)
  const [editText, setEditText] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [saving, setSaving] = useState(false)
  const isModal = variant === 'modal'
  const currentUser = getCurrentUser()
  const token = getReaderToken()

  useEffect(() => {
    let ignore = false

    async function loadComments() {
      if (!targetId) return

      try {
        setLoading(true)

        const response = await fetch(`${API_BASE_URL}/api/comments/story/${targetId}`)
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load comments')
        }

        if (ignore) return

        const normalized = (data.comments || []).map(normalizeApiComment)
        setComments(normalized)
        onCommentsChange?.(normalized)
      } catch (error) {
        if (!ignore) {
          showToast(error.message || 'Failed to load comments.')
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadComments()

    return () => {
      ignore = true
    }
  }, [targetId])

  const isBanned = false

  const visibleComments = useMemo(() => {
    const author = isStoryAuthor(currentUser, story)
    const admin = currentUser.is_admin

    return comments.filter((comment) => {
      if (!comment.is_hidden) return true

      const owner =
        comment.user_id &&
        currentUser.id &&
        String(comment.user_id) === String(currentUser.id)

      return owner || author || admin
    })
  }, [comments, currentUser, story])

  const sortedComments = useMemo(() => {
    const list = [...visibleComments]

    list.sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1
      if (!a.is_pinned && b.is_pinned) return 1

      if (sort === 'top') {
        return Number(b.likes || 0) - Number(a.likes || 0)
      }

      if (sort === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      }

      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    return list
  }, [visibleComments, sort])

  const updateComments = (nextComments) => {
    setComments(nextComments)
    onCommentsChange?.(nextComments)
  }

  const showToast = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 1600)
  }

  const handleSend = async () => {
    if (!text.trim() || sending) return

    if (!token) {
      showToast('Please login to comment.')
      return
    }

    try {
      setSending(true)

      const response = await fetch(`${API_BASE_URL}/api/comments/story/${targetId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: text.trim(),
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to create comment')
      }

      const newComment = normalizeApiComment(data.comment)
      updateComments([newComment, ...comments])
      setText('')
    } catch (error) {
      showToast(error.message || 'Failed to create comment.')
    } finally {
      setSending(false)
    }
  }

  const handleLike = (commentId) => {
    const nextComments = comments.map((comment) => {
      if (comment.id !== commentId) return comment

      const liked = !comment.liked
      const currentLikes = Number(comment.likes || 0)

      return {
        ...comment,
        liked,
        likes: liked ? currentLikes + 1 : Math.max(0, currentLikes - 1),
      }
    })

    updateComments(nextComments)
  }

  const handleReply = async (commentId, replyText) => {
    if (!token) {
      showToast('Please login to reply.')
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/comments/story/${targetId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: replyText,
          parent_id: commentId,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to create reply')
      }

      const newReply = normalizeApiComment(data.comment)

      const nextComments = comments.map((comment) => {
        if (comment.id !== commentId) return comment

        const replies = Array.isArray(comment.replies) ? comment.replies : []

        return {
          ...comment,
          replies: [...replies, newReply],
        }
      })

      updateComments(nextComments)
    } catch (error) {
      showToast(error.message || 'Failed to create reply.')
    }
  }

  const handleEdit = (comment) => {
    setEditComment(comment)
    setEditText(comment.text || '')
  }

  const handleSaveEdit = async () => {
    if (!editComment || !editText.trim() || saving) return

    if (!token) {
      showToast('Please login again.')
      return
    }

    try {
      setSaving(true)

      const response = await fetch(`${API_BASE_URL}/api/comments/${editComment.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: editText.trim(),
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to update comment')
      }

      const updatedComment = normalizeApiComment(data.comment)

      const nextComments = comments.map((comment) =>
        comment.id === editComment.id ? { ...comment, ...updatedComment } : comment
      )

      updateComments(nextComments)
      setEditComment(null)
      setEditText('')
      showToast('Comment updated.')
    } catch (error) {
      showToast(error.message || 'Failed to update comment.')
    } finally {
      setSaving(false)
    }
  }

  const handleModerate = async (comment, action) => {
    if (!token) {
      showToast('Please login again.')
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/comments/${comment.id}/moderate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Action failed')
      }

      if (action === 'delete') {
        updateComments(comments.filter((item) => item.id !== comment.id))
        showToast('Comment deleted.')
        return
      }

      if (action === 'ban') {
        showToast('User banned from commenting.')
        return
      }

      const updatedComment = normalizeApiComment(data.comment)

      const nextComments = comments.map((item) =>
        item.id === comment.id ? { ...item, ...updatedComment } : item
      )

      updateComments(nextComments)
      showToast('Updated.')
    } catch (error) {
      showToast(error.message || 'Action failed.')
    }
  }

  const handleHideForReader = (comment) => {
    updateComments(comments.filter((item) => item.id !== comment.id))
    showToast('Comment hidden on your device.')
  }

  const handleSticker = () => {
    showToast('Sticker picker is hidden for now.')
  }

  return (
    <section className={`${isModal ? 'relative flex h-full flex-col bg-white' : 'min-h-screen bg-white pb-[84px]'}`}>
      <div className="shrink-0 border-b border-[#eef1f5] bg-white px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div>
            <h2 className="text-[17px] font-black text-[#111827]">All Comments</h2>
            <p className="mt-0.5 text-[12px] font-semibold text-[#98a2b3]">
              {loading ? 'Loading comments...' : visibleComments.length ? `${visibleComments.length} comments` : 'No comments yet'}
            </p>
          </div>

          <div className="rounded-full bg-[#f5f3fa] p-1">
            <button
              type="button"
              onClick={() => setSort('newest')}
              className={`rounded-full px-3 py-1.5 text-[12px] font-black ${
                sort === 'newest' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#98a2b3]'
              }`}
            >
              Newest
            </button>
            <button
              type="button"
              onClick={() => setSort('top')}
              className={`rounded-full px-3 py-1.5 text-[12px] font-black ${
                sort === 'top' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#98a2b3]'
              }`}
            >
              Top
            </button>
            <button
              type="button"
              onClick={() => setSort('oldest')}
              className={`hidden rounded-full px-3 py-1.5 text-[12px] font-black sm:inline-block ${
                sort === 'oldest' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#98a2b3]'
              }`}
            >
              Oldest
            </button>
          </div>
        </div>
      </div>

      <div className={`${isModal ? 'min-h-0 flex-1 overflow-y-auto' : 'mx-auto max-w-3xl divide-y divide-[#eef1f5]'}`}>
        <div className="mx-auto max-w-3xl divide-y divide-[#eef1f5]">
          {sortedComments.length ? (
            sortedComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                story={story}
                onLike={handleLike}
                onReply={handleReply}
                onEdit={handleEdit}
                onDelete={(selectedComment) => handleModerate(selectedComment, 'delete')}
                onHide={(selectedComment) => {
                  const currentUserIsAuthor = isStoryAuthor(currentUser, story)
                  const currentUserIsAdmin = currentUser.is_admin

                  if (currentUserIsAuthor || currentUserIsAdmin) {
                    handleModerate(selectedComment, 'hide')
                    return
                  }

                  handleHideForReader(selectedComment)
                }}
                onUnhide={(selectedComment) => handleModerate(selectedComment, 'unhide')}
                onPin={(selectedComment) => handleModerate(selectedComment, 'pin')}
                onUnpin={(selectedComment) => handleModerate(selectedComment, 'unpin')}
                onSpoiler={(selectedComment) => handleModerate(selectedComment, 'spoiler')}
                onUnspoiler={(selectedComment) => handleModerate(selectedComment, 'unspoiler')}
                onBan={(selectedComment) => handleModerate(selectedComment, 'ban')}
              />
            ))
          ) : (
            <EmptyComments onFocus={() => document.getElementById('shadow-comment-input')?.focus()} />
          )}
        </div>
      </div>

      {toast ? (
        <div className={`${isModal ? 'absolute' : 'fixed'} bottom-[88px] left-1/2 z-[70] -translate-x-1/2 rounded-full bg-[#111827] px-4 py-2 text-[12px] font-black text-white shadow-lg`}>
          {toast}
        </div>
      ) : null}

      <CommentComposer
        value={text}
        onChange={setText}
        onSend={handleSend}
        onSticker={handleSticker}
        isModal={isModal}
        isBanned={isBanned}
        sending={sending}
      />

      <EditCommentSheet
        comment={editComment}
        value={editText}
        onChange={setEditText}
        onCancel={() => {
          setEditComment(null)
          setEditText('')
        }}
        onSave={handleSaveEdit}
        saving={saving}
      />
    </section>
  )
}
