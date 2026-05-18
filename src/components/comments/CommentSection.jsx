import { useEffect, useMemo, useState } from 'react'

function getStorageKey(targetType, targetId) {
  return `shadow_comments_${targetType}_${targetId}`
}

function createId() {
  return crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random())
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
    }
  }

  const emailName = user.email ? String(user.email).split('@')[0] : ''

  return {
    id: user.id || user.user_id || null,
    name: user.name || user.username || user.display_name || emailName || 'Reader',
    avatar_url: user.avatar_url || user.profile_image || user.photo_url || '',
  }
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

function loadComments(targetType, targetId) {
  if (!targetId) return []

  try {
    const raw = localStorage.getItem(getStorageKey(targetType, targetId))
    const parsed = JSON.parse(raw || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveComments(targetType, targetId, comments) {
  if (!targetId) return
  localStorage.setItem(getStorageKey(targetType, targetId), JSON.stringify(comments))
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

function CommentMenu({ isOpen, onReport, onCopy, onClose }) {
  if (!isOpen) return null

  return (
    <div className="absolute right-0 top-8 z-20 w-44 overflow-hidden rounded-[18px] bg-white text-[#111827] shadow-[0_14px_40px_rgba(17,24,39,0.16)] ring-1 ring-black/5">
      <button
        type="button"
        onClick={() => {
          onReport()
          onClose()
        }}
        className="flex w-full items-center gap-3 px-4 py-3 text-left text-[13px] font-extrabold hover:bg-[#f5f3fa]"
      >
        <i className="fa-regular fa-flag w-4 text-[#8d94a1]" />
        Report
      </button>

      <button
        type="button"
        onClick={() => {
          onCopy()
          onClose()
        }}
        className="flex w-full items-center gap-3 px-4 py-3 text-left text-[13px] font-extrabold hover:bg-[#f5f3fa]"
      >
        <i className="fa-solid fa-link w-4 text-[#8d94a1]" />
        Copy link
      </button>
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
  onLike,
  onReply,
  onReport,
  onCopy,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [repliesShown, setRepliesShown] = useState(false)
  const replies = Array.isArray(comment.replies) ? comment.replies : []

  const handleSendReply = () => {
    if (!replyText.trim()) return
    onReply(comment.id, replyText.trim())
    setReplyText('')
    setReplyOpen(false)
    setRepliesShown(true)
  }

  return (
    <article className="px-4 py-4">
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
              <div className="flex items-center gap-2">
                <h3 className="text-[13px] font-black text-[#111827]">{comment.name || 'Reader'}</h3>
                <span className="text-[11px] font-semibold text-[#98a2b3]">{formatTime(comment.created_at)}</span>
              </div>

              {comment.type === 'sticker' ? (
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
              onReport={() => onReport(comment)}
              onCopy={() => onCopy(comment)}
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
}) {
  const currentUser = getCurrentUser()

  return (
    <div className={`${isModal ? 'absolute' : 'fixed'} bottom-0 left-0 right-0 z-50 border-t border-[#eef1f5] bg-white px-3 py-3`}>
      <div className="mx-auto flex max-w-3xl items-end gap-2">
        <Avatar user={currentUser} />

        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[22px] bg-[#f3f4f6] px-3 py-2">
          <input
            id="shadow-comment-input"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            disabled={isBanned}
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
            disabled={!value.trim() || isBanned}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111827] text-white disabled:bg-[#d0d5dd]"
            aria-label="Send comment"
          >
            <i className="fa-solid fa-paper-plane text-[13px]" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CommentSection({
  targetType = 'story',
  targetId,
  variant = 'page',
  onCommentsChange,
}) {
  const [comments, setComments] = useState([])
  const [sort, setSort] = useState('newest')
  const [text, setText] = useState('')
  const [toast, setToast] = useState('')
  const isModal = variant === 'modal'

  useEffect(() => {
    setComments(loadComments(targetType, targetId))
  }, [targetType, targetId])

  const sortedComments = useMemo(() => {
    const list = [...comments]

    if (sort === 'top') {
      return list.sort((a, b) => Number(b.likes || 0) - Number(a.likes || 0))
    }

    if (sort === 'oldest') {
      return list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    }

    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }, [comments, sort])

  const updateComments = (nextComments) => {
    setComments(nextComments)
    saveComments(targetType, targetId, nextComments)
    onCommentsChange?.(nextComments)
  }

  const showToast = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 1600)
  }

  const handleSend = () => {
    if (!text.trim()) return

    const currentUser = getCurrentUser()

    const nextComment = {
      id: createId(),
      user_id: currentUser.id,
      name: currentUser.name,
      avatar_url: currentUser.avatar_url,
      text: text.trim(),
      type: 'text',
      likes: 0,
      liked: false,
      created_at: new Date().toISOString(),
      replies: [],
    }

    updateComments([nextComment, ...comments])
    setText('')
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

  const handleReply = (commentId, replyText) => {
    const currentUser = getCurrentUser()

    const nextComments = comments.map((comment) => {
      if (comment.id !== commentId) return comment

      const replies = Array.isArray(comment.replies) ? comment.replies : []

      return {
        ...comment,
        replies: [
          ...replies,
          {
            id: createId(),
            user_id: currentUser.id,
            name: currentUser.name,
            avatar_url: currentUser.avatar_url,
            text: replyText,
            created_at: new Date().toISOString(),
          },
        ],
      }
    })

    updateComments(nextComments)
  }

  const handleReport = () => {
    showToast('Report saved for demo.')
  }

  const handleCopy = (comment) => {
    const url = `${window.location.href}#comment-${comment.id}`

    navigator.clipboard?.writeText(url)
      .then(() => showToast('Comment link copied.'))
      .catch(() => showToast('Copy is not available.'))
  }

  const handleSticker = () => {
    showToast('Sticker picker is ready for Admin stickers later.')
  }

  const handleEmoji = () => {
    showToast('Emoji picker coming soon.')
  }

  return (
    <section className={`${isModal ? 'relative flex h-full flex-col bg-white' : 'min-h-screen bg-white pb-[84px]'}`}>
      <div className="shrink-0 border-b border-[#eef1f5] bg-white px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div>
            <h2 className="text-[17px] font-black text-[#111827]">All Comments</h2>
            <p className="mt-0.5 text-[12px] font-semibold text-[#98a2b3]">
              {comments.length ? `${comments.length} comments` : 'No comments yet'}
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

      <div className={`${isModal ? 'min-h-0 flex-1 overflow-y-auto pb-[86px]' : 'mx-auto max-w-3xl divide-y divide-[#eef1f5]'}`}>
        <div className="mx-auto max-w-3xl divide-y divide-[#eef1f5]">
          {sortedComments.length ? (
            sortedComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onLike={handleLike}
                onReply={handleReply}
                onReport={handleReport}
                onCopy={handleCopy}
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
        onEmoji={handleEmoji}
        isModal={isModal}
      />
    </section>
  )
}
