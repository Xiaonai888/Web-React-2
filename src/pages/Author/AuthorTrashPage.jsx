import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatDate(value) {
  if (!value) return 'Unknown'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Unknown'
  }

  return date.toLocaleDateString('en-GB')
}

function getDaysLeft(item) {
  if (
    Number.isFinite(
      Number(item?.days_left)
    )
  ) {
    return Math.max(
      0,
      Number(item.days_left)
    )
  }

  const value =
    item?.delete_expires_at

  if (!value) return 0

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 0
  }

  return Math.max(
    0,
    Math.ceil(
      (date.getTime() - Date.now()) /
        86400000
    )
  )
}

function EmptyCover({ title }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#111827] to-[#374151] px-2 text-center">
      <span className="line-clamp-3 text-[10px] font-extrabold leading-4 text-white/80">
        {title || 'Story'}
      </span>
    </div>
  )
}

function TrashStoryCard({
  story,
  busy,
  onRestore,
}) {
  const daysLeft = getDaysLeft(story)
  const canRestore = daysLeft > 0

  return (
    <article className="rounded-[22px] bg-white p-3 shadow-sm ring-1 ring-black/5">
      <div className="flex gap-3">
        <div className="h-[112px] w-[78px] shrink-0 overflow-hidden rounded-[14px] bg-[#111827]">
          {story.cover_url ? (
            <img
              src={story.cover_url}
              alt={story.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <EmptyCover
              title={story.title}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="line-clamp-1 text-[15px] font-extrabold text-[#111827]">
                {story.title ||
                  'Untitled Story'}
              </h2>

              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-[#f5f3fa] px-2.5 py-1 text-[10px] font-bold text-[#555b66]">
                  {story.main_genre ||
                    'Novel'}
                </span>

                <span className="rounded-full bg-[#fff1f1] px-2.5 py-1 text-[10px] font-bold text-[#e5484d]">
                  Hidden
                </span>
              </div>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d]">
              <i className="fa-regular fa-trash-can text-[14px]" />
            </div>
          </div>

          <div className="mt-3 space-y-1 text-[11.5px] font-semibold text-[#8d94a1]">
            <div>
              Deleted{' '}
              <span className="font-extrabold text-[#555b66]">
                {formatDate(
                  story.deleted_at
                )}
              </span>
            </div>

            <div>
              Restore before{' '}
              <span className="font-extrabold text-[#555b66]">
                {formatDate(
                  story.delete_expires_at
                )}
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <span
              className={`rounded-full px-3 py-1.5 text-[11px] font-extrabold ${
                canRestore
                  ? 'bg-[#fff7df] text-[#a56a00]'
                  : 'bg-[#f2f4f7] text-[#667085]'
              }`}
            >
              {canRestore
                ? `${daysLeft} days left`
                : 'Restore expired'}
            </span>

            <button
              type="button"
              disabled={
                !canRestore || busy
              }
              onClick={() =>
                onRestore(story)
              }
              className="rounded-full bg-[#111827] px-4 py-2 text-[12px] font-extrabold text-white active:scale-95 disabled:bg-[#c9cdd6]"
            >
              {busy
                ? 'Restoring...'
                : 'Restore'}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function getCommentType(item) {
  if (
    item.content_type ===
    'author_post'
  ) {
    return 'Author Post'
  }

  if (
    item.content_type === 'episode'
  ) {
    return 'Episode'
  }

  return 'Story'
}

function getCommentTitle(item) {
  if (
    item.content_type ===
    'author_post'
  ) {
    return (
      item.context?.post_excerpt ||
      'Author Page post'
    )
  }

  return (
    item.context?.title ||
    'Untitled Story'
  )
}

function TrashCommentCard({
  item,
  busy,
  onRestore,
}) {
  const daysLeft = getDaysLeft(item)
  const canRestore =
    Boolean(item.can_recover) &&
    daysLeft > 0
  const userName =
    item.user?.name ||
    item.user?.username ||
    'Reader'

  return (
    <article className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]">
          <i className="fa-regular fa-comment-dots text-[15px]" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#eef2ff] px-2.5 py-1 text-[10px] font-bold text-[#4f46e5]">
              {getCommentType(item)}
            </span>

            {item.parent_id ? (
              <span className="rounded-full bg-[#f5f3fa] px-2.5 py-1 text-[10px] font-bold text-[#667085]">
                Reply
              </span>
            ) : null}
          </div>

          <h2 className="mt-2 line-clamp-1 text-[13px] font-extrabold text-[#111827]">
            {getCommentTitle(item)}
          </h2>

          <p className="mt-2 whitespace-pre-wrap break-words rounded-[16px] bg-[#f7f7f9] px-3 py-2.5 text-[13px] font-medium leading-5 text-[#4b5563]">
            {item.text ||
              'Empty comment'}
          </p>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-semibold text-[#8d94a1]">
            <span>
              By{' '}
              <strong className="text-[#555b66]">
                {userName}
              </strong>
            </span>

            <span>
              Deleted{' '}
              <strong className="text-[#555b66]">
                {formatDate(
                  item.deleted_at
                )}
              </strong>
            </span>
          </div>

          {item.delete_reason ? (
            <div className="mt-2 rounded-[14px] bg-[#fff7f7] px-3 py-2 text-[11px] font-semibold leading-5 text-[#b42318]">
              Reason: {item.delete_reason}
            </div>
          ) : null}

          <div className="mt-3 flex items-center justify-between gap-3">
            <span
              className={`rounded-full px-3 py-1.5 text-[11px] font-extrabold ${
                daysLeft > 0
                  ? 'bg-[#fff7df] text-[#a56a00]'
                  : 'bg-[#f2f4f7] text-[#667085]'
              }`}
            >
              {daysLeft > 0
                ? `${daysLeft} days left`
                : 'Recovery expired'}
            </span>

            <button
              type="button"
              disabled={
                !canRestore || busy
              }
              onClick={() =>
                onRestore(item)
              }
              className="rounded-full bg-[#111827] px-4 py-2 text-[12px] font-extrabold text-white active:scale-95 disabled:bg-[#c9cdd6]"
            >
              {busy
                ? 'Recovering...'
                : item.can_recover
                  ? 'Recover'
                  : 'Unavailable'}
            </button>
          </div>

          {!item.can_recover ? (
            <p className="mt-2 text-[10.5px] font-semibold leading-4 text-[#98a2b3]">
              Only comments deleted by you can be recovered.
            </p>
          ) : null}
        </div>
      </div>
    </article>
  )
}

function EmptyState({
  icon,
  title,
  text,
}) {
  return (
    <section className="mt-4 rounded-[24px] bg-white px-5 py-10 text-center shadow-sm ring-1 ring-black/5">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]">
        <i className={`${icon} text-[22px]`} />
      </div>

      <h2 className="mt-4 text-[16px] font-extrabold text-[#111827]">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-[340px] text-[12px] leading-5 text-[#8d94a1]">
        {text}
      </p>
    </section>
  )
}

export default function AuthorTrashPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] =
    useState('stories')
  const [stories, setStories] =
    useState([])
  const [comments, setComments] =
    useState([])
  const [loadingStories, setLoadingStories] =
    useState(true)
  const [loadingComments, setLoadingComments] =
    useState(true)
  const [busyId, setBusyId] =
    useState('')
  const [message, setMessage] =
    useState('')

  const activeStories = useMemo(
    () =>
      stories.filter(
        (story) =>
          getDaysLeft(story) > 0
      ),
    [stories]
  )

  const expiredStories = useMemo(
    () =>
      stories.filter(
        (story) =>
          getDaysLeft(story) <= 0
      ),
    [stories]
  )

  function requireToken() {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return ''
    }

    return token
  }

  async function loadStories() {
    const token = requireToken()

    if (!token) return

    try {
      setLoadingStories(true)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/stories/trash`,
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
            'Failed to load story trash'
        )
      }

      setStories(data.stories || [])
    } catch (error) {
      setStories([])
      setMessage(
        error.message ===
          'Failed to fetch'
          ? 'Cannot connect to backend.'
          : error.message ||
              'Failed to load story trash'
      )
    } finally {
      setLoadingStories(false)
    }
  }

  async function loadComments() {
    const token = requireToken()

    if (!token) return

    try {
      setLoadingComments(true)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/comment-trash/author?page=1&limit=100`,
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
            'Failed to load comment trash'
        )
      }

      setComments(
        Array.isArray(data.items)
          ? data.items
          : []
      )
    } catch (error) {
      setComments([])
      setMessage(
        error.message ===
          'Failed to fetch'
          ? 'Cannot connect to backend.'
          : error.message ||
              'Failed to load comment trash'
      )
    } finally {
      setLoadingComments(false)
    }
  }

  async function handleRestoreStory(
    story
  ) {
    const token = requireToken()

    if (!token) return

    try {
      setBusyId(`story:${story.id}`)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/stories/${story.id}/restore`,
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
            'Failed to restore story'
        )
      }

      setStories((current) =>
        current.filter(
          (item) =>
            item.id !== story.id
        )
      )
      setMessage(
        'Story restored successfully.'
      )
    } catch (error) {
      setMessage(
        error.message ||
          'Failed to restore story'
      )
    } finally {
      setBusyId('')
    }
  }

  async function handleRecoverComment(
    item
  ) {
    const token = requireToken()

    if (!token) return

    const key = `${item.source}:${item.comment_id}`

    try {
      setBusyId(key)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/comment-trash/author/${encodeURIComponent(
          item.source
        )}/${encodeURIComponent(
          item.comment_id
        )}/recover`,
        {
          method: 'PATCH',
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
            'Failed to recover comment'
        )
      }

      setComments((current) =>
        current.filter(
          (comment) =>
            !(
              comment.source ===
                item.source &&
              String(
                comment.comment_id
              ) ===
                String(
                  item.comment_id
                )
            )
        )
      )
      setMessage(
        'Comment recovered successfully.'
      )
    } catch (error) {
      setMessage(
        error.message ||
          'Failed to recover comment'
      )
    } finally {
      setBusyId('')
    }
  }

  useEffect(() => {
    loadStories()
    loadComments()
  }, [])

  const loading =
    activeTab === 'stories'
      ? loadingStories
      : loadingComments

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[110px]">
      <header className="sticky top-0 z-50 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            type="button"
            onClick={() =>
              navigate(
                '/author/dashboard'
              )
            }
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-extrabold text-[#111827]">
            Trash
          </h1>

          <button
            type="button"
            onClick={() => {
              loadStories()
              loadComments()
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111827] text-white active:scale-95"
            aria-label="Refresh trash"
          >
            <i className="fa-solid fa-rotate-right text-[13px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        <section className="rounded-[24px] bg-[#111827] p-4 text-white shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#f6b800]">
              <i className="fa-regular fa-trash-can text-[17px]" />
            </div>

            <div className="min-w-0">
              <h2 className="text-[17px] font-extrabold">
                Author Trash
              </h2>

              <p className="mt-1 text-[12.5px] font-medium leading-5 text-white/65">
                Deleted items stay here for up to 30 days. Recovery is available only during that period.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-4 grid grid-cols-2 rounded-[18px] bg-white p-1 shadow-sm ring-1 ring-black/5">
          <button
            type="button"
            onClick={() =>
              setActiveTab('stories')
            }
            className={`h-11 rounded-[15px] text-[13px] font-extrabold transition ${
              activeTab === 'stories'
                ? 'bg-[#111827] text-white'
                : 'text-[#667085]'
            }`}
          >
            Stories · {stories.length}
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab('comments')
            }
            className={`h-11 rounded-[15px] text-[13px] font-extrabold transition ${
              activeTab === 'comments'
                ? 'bg-[#111827] text-white'
                : 'text-[#667085]'
            }`}
          >
            Comments · {comments.length}
          </button>
        </div>

        {message ? (
          <button
            type="button"
            onClick={() =>
              setMessage('')
            }
            className="mt-4 w-full rounded-[18px] bg-white px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#111827] shadow-sm ring-1 ring-black/5"
          >
            {message}
          </button>
        ) : null}

        {loading ? (
          <section className="mt-4 rounded-[24px] bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#111827]" />
            <div className="text-[13px] font-bold text-[#667085]">
              Loading trash...
            </div>
          </section>
        ) : null}

        {!loading &&
        activeTab === 'stories' ? (
          <>
            {!stories.length ? (
              <EmptyState
                icon="fa-regular fa-folder-open"
                title="Story trash is empty"
                text="Deleted stories will appear here during their recovery period."
              />
            ) : null}

            {activeStories.length ? (
              <section className="mt-5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-[17px] font-extrabold text-[#111827]">
                    Can Restore
                  </h2>

                  <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-extrabold text-[#667085] shadow-sm ring-1 ring-black/5">
                    {activeStories.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {activeStories.map(
                    (story) => (
                      <TrashStoryCard
                        key={story.id}
                        story={story}
                        busy={
                          busyId ===
                          `story:${story.id}`
                        }
                        onRestore={
                          handleRestoreStory
                        }
                      />
                    )
                  )}
                </div>
              </section>
            ) : null}

            {expiredStories.length ? (
              <section className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-[17px] font-extrabold text-[#111827]">
                    Recovery Expired
                  </h2>

                  <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-extrabold text-[#667085] shadow-sm ring-1 ring-black/5">
                    {expiredStories.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {expiredStories.map(
                    (story) => (
                      <TrashStoryCard
                        key={story.id}
                        story={story}
                        busy={false}
                        onRestore={
                          handleRestoreStory
                        }
                      />
                    )
                  )}
                </div>
              </section>
            ) : null}
          </>
        ) : null}

        {!loading &&
        activeTab === 'comments' ? (
          <>
            {!comments.length ? (
              <EmptyState
                icon="fa-regular fa-comments"
                title="Comment trash is empty"
                text="Comments removed from your stories, episodes, Author Page, and Author Posts will appear here."
              />
            ) : (
              <section className="mt-5">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-[17px] font-extrabold text-[#111827]">
                      Deleted Comments
                    </h2>

                    <p className="mt-1 text-[11px] font-semibold text-[#8d94a1]">
                      Recovery only. Manual emptying is unavailable.
                    </p>
                  </div>

                  <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-extrabold text-[#667085] shadow-sm ring-1 ring-black/5">
                    {comments.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {comments.map((item) => (
                    <TrashCommentCard
                      key={`${item.source}:${item.comment_id}`}
                      item={item}
                      busy={
                        busyId ===
                        `${item.source}:${item.comment_id}`
                      }
                      onRestore={
                        handleRecoverComment
                      }
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : null}
      </main>
    </div>
  )
}
