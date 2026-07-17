import { useMemo, useState } from 'react'

const API_BASE_URL =
  'https://shadow-backend-kucw.onrender.com'

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

function formatPostTime(value) {
  const timestamp =
    new Date(value || 0).getTime()

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

  return new Intl.DateTimeFormat(
    undefined,
    {
      month: 'short',
      day: 'numeric',
      year:
        new Date().getFullYear() !==
        new Date(timestamp).getFullYear()
          ? 'numeric'
          : undefined,
    }
  ).format(new Date(timestamp))
}

function ReaderAvatar({ user }) {
  const name = user?.name || 'Reader'

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[14px] font-semibold text-white">
      {user?.avatar_url ? (
        <img
          src={user.avatar_url}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        name.slice(0, 1).toUpperCase()
      )}
    </div>
  )
}

export default function ReaderPostCard({
  post,
  onUpdated,
  onDeleted,
  onHidden,
}) {
  const storedUser = useMemo(
    () => getStoredUser(),
    []
  )
  const [menuOpen, setMenuOpen] =
    useState(false)
  const [editorOpen, setEditorOpen] =
    useState(false)
  const [content, setContent] =
    useState(post?.content || '')
  const [saving, setSaving] =
    useState(false)
  const [deleting, setDeleting] =
    useState(false)
  const [message, setMessage] =
    useState('')

  const user = post?.user || {}
  const isOwner =
    Boolean(post?.is_owner) ||
    String(storedUser?.id || '') ===
      String(post?.user_id || '')

  async function updatePost() {
    const text = content.trim()

    if (!text) {
      setMessage('Post text is required.')
      return
    }

    try {
      setSaving(true)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/reader-posts/me/${encodeURIComponent(post.id)}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type':
              'application/json',
            Authorization:
              `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify({
            content: text,
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
            'Failed to update post'
        )
      }

      if (data.post) {
        onUpdated?.(data.post)
      }

      setEditorOpen(false)
      setMenuOpen(false)
    } catch (error) {
      setMessage(
        error.message ||
          'Failed to update post'
      )
    } finally {
      setSaving(false)
    }
  }

  async function deletePost() {
    const confirmed = window.confirm(
      'Delete this post?'
    )

    if (!confirmed) return

    try {
      setDeleting(true)

      const response = await fetch(
        `${API_BASE_URL}/api/reader-posts/me/${encodeURIComponent(post.id)}`,
        {
          method: 'DELETE',
          headers: {
            Authorization:
              `Bearer ${getAuthToken()}`,
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
            'Failed to delete post'
        )
      }

      onDeleted?.(post.id)
    } catch (error) {
      window.alert(
        error.message ||
          'Failed to delete post'
      )
    } finally {
      setDeleting(false)
      setMenuOpen(false)
    }
  }

  return (
    <>
      <article className="bg-white sm:rounded-[12px]">
        <div className="flex items-start gap-2 px-4 pb-3 pt-4">
          <ReaderAvatar user={user} />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-[14px] font-semibold text-[#111827]">
                  {user.name || 'Reader'}
                </div>

                <div className="mt-0.5 flex items-center gap-1 text-[11px] font-normal text-gray-400">
                  <span>
                    {formatPostTime(
                      post.created_at
                    )}
                  </span>
                  {post.is_edited ? (
                    <>
                      <span>·</span>
                      <span>Edited</span>
                    </>
                  ) : null}
                  <span>·</span>
                  <i className="fa-solid fa-earth-americas text-[10px]" />
                </div>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setMenuOpen(
                      (current) => !current
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 active:bg-gray-100"
                  aria-label="Post options"
                >
                  <i className="fa-solid fa-ellipsis" />
                </button>

                {menuOpen ? (
                  <div className="absolute right-0 top-9 z-30 w-[160px] overflow-hidden rounded-[14px] border border-gray-100 bg-white p-1 shadow-xl">
                    {isOwner ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setContent(
                              post.content || ''
                            )
                            setMessage('')
                            setEditorOpen(true)
                            setMenuOpen(false)
                          }}
                          className="w-full rounded-[10px] px-3 py-2.5 text-left text-[13px] font-normal text-[#111827] active:bg-gray-50"
                        >
                          Edit post
                        </button>
                        <button
                          type="button"
                          onClick={deletePost}
                          disabled={deleting}
                          className="w-full rounded-[10px] px-3 py-2.5 text-left text-[13px] font-normal text-red-600 active:bg-red-50 disabled:opacity-60"
                        >
                          {deleting
                            ? 'Deleting...'
                            : 'Delete post'}
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          onHidden?.(post.id)
                          setMenuOpen(false)
                        }}
                        className="w-full rounded-[10px] px-3 py-2.5 text-left text-[13px] font-normal text-[#111827] active:bg-gray-50"
                      >
                        Hide post
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <p className="whitespace-pre-wrap break-words px-4 pb-4 text-[14px] font-normal leading-6 text-[#111827]">
          {post.content}
        </p>

        <div className="flex items-center gap-5 border-t border-gray-100 px-4 py-3 text-[11px] font-normal text-gray-500">
          <span className="inline-flex items-center gap-1.5">
            <i className="fa-regular fa-heart" />
            {Number(post.like_count || 0)}
          </span>

          <span className="inline-flex items-center gap-1.5">
            <i className="fa-regular fa-comment" />
            {Number(
              post.comment_count || 0
            )}
          </span>

          <span className="inline-flex items-center gap-1.5">
            <i className="fa-solid fa-rotate-left text-[10px]" />
            {Number(post.echo_count || 0)}
          </span>
        </div>
      </article>

      {editorOpen ? (
        <div className="fixed inset-0 z-[200000] flex items-end justify-center bg-black/45 sm:items-center sm:p-4">
          <button
            type="button"
            onClick={() => {
              if (!saving) {
                setEditorOpen(false)
              }
            }}
            className="absolute inset-0"
            aria-label="Close editor"
          />

          <section className="relative w-full max-w-[520px] rounded-t-[24px] bg-white p-4 shadow-2xl sm:rounded-[24px]">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[17px] font-semibold text-[#111827]">
                Edit post
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditorOpen(false)
                }
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center text-[#111827] disabled:opacity-50"
              >
                <i className="fa-solid fa-xmark text-[18px]" />
              </button>
            </div>

            <textarea
              autoFocus
              value={content}
              onChange={(event) =>
                setContent(
                  event.target.value.slice(
                    0,
                    1000
                  )
                )
              }
              className="min-h-[180px] w-full resize-none rounded-[16px] border border-gray-200 px-4 py-3 text-[15px] font-normal leading-6 text-[#111827] outline-none focus:border-[#111827]"
            />

            <div className="mt-2 text-right text-[11px] font-normal text-gray-400">
              {content.length}/1000
            </div>

            {message ? (
              <div className="mt-3 rounded-[12px] bg-red-50 px-3 py-2 text-[12px] font-normal text-red-600">
                {message}
              </div>
            ) : null}

            <button
              type="button"
              onClick={updatePost}
              disabled={
                saving ||
                !content.trim()
              }
              className="mt-4 h-11 w-full rounded-full bg-[#111827] text-[14px] font-semibold text-white disabled:bg-gray-300"
            >
              {saving
                ? 'Saving...'
                : 'Save changes'}
            </button>
          </section>
        </div>
      ) : null}
    </>
  )
}
