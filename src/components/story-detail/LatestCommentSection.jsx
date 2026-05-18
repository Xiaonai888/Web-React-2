import { useEffect, useState } from 'react'

function getStorageKey(storyId) {
  return `shadow_comments_story_${storyId}`
}

function getLatestComment(storyId) {
  if (!storyId) return null

  try {
    const raw = localStorage.getItem(getStorageKey(storyId))
    const comments = JSON.parse(raw || '[]')

    if (!Array.isArray(comments) || !comments.length) return null

    return [...comments].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0]
  } catch {
    return null
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

function Avatar({ comment }) {
  const avatar = comment?.avatar_url || ''
  const letter = (comment?.name || 'R').slice(0, 1).toUpperCase()

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={comment?.name || 'Reader'}
        className="h-11 w-11 shrink-0 rounded-full object-cover"
      />
    )
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#111827] text-[14px] font-black text-white">
      {letter}
    </div>
  )
}

export default function LatestCommentSection({ story, refreshKey = 0, onOpenComments }) {
  const [latestComment, setLatestComment] = useState(null)

  useEffect(() => {
    setLatestComment(getLatestComment(story?.id))
  }, [story?.id, refreshKey])

  const hasComment = Boolean(latestComment)

  return (
    <section className="mt-2 bg-white p-4 shadow-sm sm:mt-4 sm:rounded-[28px] sm:ring-1 sm:ring-black/5 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-black text-[#111827]">Comments</h2>
          <p className="mt-1 text-[12px] font-semibold text-[#98a2b3]">
            {hasComment ? 'Latest reader comment' : 'Be the first to start the conversation'}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenComments}
          className="rounded-full bg-[#f5f3fa] px-4 py-2 text-[12px] font-extrabold text-[#111827] active:scale-95"
        >
          View All
        </button>
      </div>

      <button
        type="button"
        onClick={onOpenComments}
        className="flex w-full gap-3 rounded-[22px] bg-[#f8fafc] p-4 text-left active:scale-[0.995]"
      >
        {hasComment ? <Avatar comment={latestComment} /> : (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#98a2b3]">
            <i className="fa-regular fa-comments text-[17px]" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          {hasComment ? (
            <>
              <div className="flex items-center gap-2">
                <div className="truncate text-[13px] font-black text-[#111827]">
                  {latestComment.name || 'Reader'}
                </div>
                <div className="shrink-0 text-[11px] font-semibold text-[#98a2b3]">
                  {formatTime(latestComment.created_at)}
                </div>
              </div>

              <p className="mt-1 line-clamp-2 text-[12.5px] font-medium leading-5 text-[#667085]">
                {latestComment.text || 'Sticker comment'}
              </p>
            </>
          ) : (
            <>
              <div className="text-[13px] font-black text-[#111827]">No comments yet</div>
              <p className="mt-1 line-clamp-2 text-[12.5px] font-medium leading-5 text-[#667085]">
                Share your thoughts, ask a question, or cheer for this story.
              </p>
            </>
          )}
        </div>
      </button>
    </section>
  )
}
