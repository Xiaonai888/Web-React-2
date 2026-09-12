import { useEffect, useState } from 'react'
import CommentSection from './comments/CommentSection'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getReaderToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function CommentCard({ comment, reply = false }) {
  if (!comment) return null

  return (
    <div
      className={`rounded-2xl border border-slate-200 p-4 dark:border-slate-800 ${
        reply ? 'ml-6' : ''
      }`}
    >
      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-800 dark:text-slate-200">
        {comment.text || ''}
      </p>
    </div>
  )
}

export default function AuthorCommentThreadSheet({ item, onClose, onRead }) {
  const [thread, setThread] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingMoreReplies, setLoadingMoreReplies] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!item?.id) {
      setThread(null)
      setError('')
      return
    }

    let ignore = false

    async function loadThread() {
      try {
        setLoading(true)
        setError('')
        setThread(null)

        const response = await fetch(
          `${API_BASE_URL}/api/comments/${item.id}/thread`,
          {
            headers: {
              Authorization: `Bearer ${getReaderToken()}`,
            },
            cache: 'no-store',
          }
        )

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load comment thread')
        }

        if (!ignore) {
          setThread(data)

          if (!item.is_read) {
            try {
              const readResponse = await fetch(
                `${API_BASE_URL}/api/comments/${encodeURIComponent(item.id)}/author-read`,
                {
                  method: 'PATCH',
                  headers: {
                    Authorization: `Bearer ${getReaderToken()}`,
                  },
                }
              )

              const readData = await readResponse.json().catch(() => ({}))

              if (
                readResponse.ok &&
                readData.ok !== false
              ) {
                onRead?.(item.id)
              }
            } catch {}
          }
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Failed to load comment thread')
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadThread()

    return () => {
      ignore = true
    }
  }, [item?.id])

  async function loadMoreReplies() {
    const rootComment = thread?.root_comment

    if (
      !rootComment?.id ||
      loadingMoreReplies ||
      !rootComment.reply_has_more
    ) {
      return
    }

    const nextPage =
      Math.max(
        1,
        Number(rootComment.reply_page || 1)
      ) + 1

    try {
      setLoadingMoreReplies(true)

      const response = await fetch(
        `${API_BASE_URL}/api/comments/${rootComment.id}/replies?page=${nextPage}&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${getReaderToken()}`,
          },
          cache: 'no-store',
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to load more replies')
      }

      setThread((current) => {
        const currentRoot =
          current?.root_comment

        if (!currentRoot) {
          return current
        }

        const currentReplies =
          Array.isArray(currentRoot.replies)
            ? currentRoot.replies
            : []
        const existingIds =
          new Set(
            currentReplies.map((reply) =>
              String(reply.id)
            )
          )
        const nextReplies =
          Array.isArray(data.replies)
            ? data.replies.filter(
                (reply) =>
                  !existingIds.has(
                    String(reply.id)
                  )
              )
            : []

        return {
          ...current,
          root_comment: {
            ...currentRoot,
            replies: [
              ...currentReplies,
              ...nextReplies,
            ],
            reply_page:
              Number(data.page || nextPage),
            reply_total:
              Number(
                data.total ||
                currentRoot.reply_total ||
                0
              ),
            reply_has_more:
              Boolean(data.has_more),
          },
        }
      })
    } catch (err) {
      setError(
        err.message ||
          'Failed to load more replies'
      )
    } finally {
      setLoadingMoreReplies(false)
    }
  }

  if (!item) return null

  const rootComment = thread?.root_comment || null
  const replies = Array.isArray(rootComment?.replies) ? rootComment.replies : []
  const storyTitle =
    thread?.story?.title || item.story?.title || item.story_title || 'Story Comment'
  const episodeId =
    rootComment?.episode_id ||
    thread?.episode_id ||
    item?.episode_id ||
    ''
  const storyId =
    rootComment?.story_id ||
    thread?.story?.id ||
    item?.story_id ||
    ''
  const targetType =
    episodeId ? 'episode' : 'story'
  const targetId =
    episodeId || storyId
  const story =
    thread?.story
      ? {
          ...thread.story,
          id: storyId || thread.story.id,
        }
      : {
          id: storyId,
          title: storyTitle,
        }

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-950">
      <div className="mx-auto flex h-full w-full max-w-3xl flex-col">
        <header className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-slate-950 dark:text-white">
              Comment Thread
            </h2>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {storyTitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-2xl leading-none text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            ×
          </button>
        </header>

        <main
          className={`min-h-0 flex-1 ${
            rootComment && targetId && !loading && !error
              ? 'overflow-hidden'
              : 'overflow-y-auto p-4'
          }`}
        >
          {loading ? (
            <div className="space-y-3">
              <div className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />
              <div className="ml-6 h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </div>
          ) : rootComment && targetId ? (
            <CommentSection
              targetType={targetType}
              targetId={targetId}
              story={story}
              variant="modal"
              focusCommentId={thread?.target_comment_id || item.id}
              threadComment={rootComment}
            />
          ) : rootComment ? (
            <div className="space-y-3">
              <CommentCard comment={rootComment} />
              {replies.map((reply) => (
                <CommentCard key={reply.id} comment={reply} reply />
              ))}

              {rootComment.reply_has_more ? (
                <button
                  type="button"
                  onClick={loadMoreReplies}
                  disabled={loadingMoreReplies}
                  className="ml-6 w-[calc(100%-1.5rem)] rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 disabled:opacity-60 dark:border-slate-800 dark:text-slate-200"
                >
                  {loadingMoreReplies
                    ? 'Loading...'
                    : 'Load more replies'}
                </button>
              ) : null}
            </div>
          ) : null}
        </main>
      </div>
    </div>
  )
}
