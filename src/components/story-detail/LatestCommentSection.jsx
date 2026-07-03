import { useEffect, useState } from 'react'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

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

function getCommentUser(comment) {
  return comment?.user || {
    name: comment?.name || 'Reader',
    avatar_url: comment?.avatar_url || '',
  }
}

function Avatar({ comment }) {
  const user = getCommentUser(comment)
  const avatar = user?.avatar_url || ''
  const letter = (user?.name || 'R').slice(0, 1).toUpperCase()

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={user?.name || 'Reader'}
        className="h-8 w-8 shrink-0 rounded-full object-cover"
      />
    )
  }

  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#111827] text-[12px] font-black text-white">
      {letter}
    </div>
  )
}

export default function LatestCommentSection({ story, refreshKey = 0, onOpenComments }) {
  const [latestComment, setLatestComment] = useState(null)

  useEffect(() => {
    let ignore = false

    async function loadLatestComment() {
      if (!story?.id) return

      try {
        const response = await fetch(`${API_BASE_URL}/api/comments/story/${story.id}`)
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) return

        if (!ignore) {
          setLatestComment((data.comments || [])[0] || null)
        }
      } catch {
        if (!ignore) setLatestComment(null)
      }
    }

    loadLatestComment()

    return () => {
      ignore = true
    }
  }, [story?.id, refreshKey])

  const hasComment = Boolean(latestComment)
  const user = getCommentUser(latestComment)

  return (
    <section className="mt-2 bg-white p-4 shadow-sm sm:mt-4 sm:rounded-[28px] sm:ring-1 sm:ring-black/5 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-bold text-[#111827]">Comments</h2>
          <p className="mt-1 text-[12px] font-semibold text-[#98a2b3]">
            {hasComment ? 'Latest reader comment' : 'Be the first to start the conversation'}
          </p>
        </div>

        <button
  type="button"
  onClick={onOpenComments}
  className="self-start pt-[2px] text-[12px] font-semibold text-[#98a2b3] active:scale-95"
>
  View All
</button>
      </div>

      <button
  type="button"
  onClick={onOpenComments}
  className="flex w-full gap-3 rounded-[13px] bg-[#f8fafc] p-4 text-left active:scale-[0.995]"
>
        <div className="min-w-0 flex-1">
  {hasComment ? (
    <>
      <div className="flex items-center gap-2">
        <Avatar comment={latestComment} />

        <div className="min-w-0">
          <div className="truncate text-[13px] font-bold text-[#111827]">
            {user.name || 'Reader'}
          </div>
          <div className="text-[11px] font-semibold text-[#98a2b3]">
            {formatTime(latestComment.created_at)}
          </div>
        </div>
      </div>

      <p className="mt-2 line-clamp-2 text-[13px] font-medium leading-5 text-[#667085]">
        {latestComment.text || 'Sticker comment'}
      </p>
    </>
  ) : (
    <>
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#98a2b3]">
          <i className="fa-regular fa-comments text-[14px]" />
        </div>

        <div className="text-[13px] font-bold text-[#111827]">No comments yet</div>
      </div>

      <p className="mt-2 line-clamp-2 text-[13px] font-medium leading-5 text-[#667085]">
        Share your thoughts, ask a question, or cheer for this story.
      </p>
    </>
  )}
</div>
      </button>
    </section>
  )
}
