import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const HIDDEN_COMMENTS_PATH =
  '/api/authors/me/comment-protection/hidden-comments'

const STATUS_OPTIONS = [
  {
    value: 'hidden',
    label: 'Pending review',
  },
  {
    value: 'kept_hidden',
    label: 'Kept hidden',
  },
  {
    value: 'restored',
    label: 'Restored',
  },
  {
    value: 'deleted',
    label: 'Deleted',
  },
]

const STATUS_CONFIG = {
  hidden: {
    label: 'Pending review',
    shortLabel: 'Pending',
    icon: 'fa-regular fa-rectangle-list',
    iconClass:
      'bg-[#f0eaff] text-[#6d3df5]',
    textClass:
      'text-[#6438ed]',
  },
  kept_hidden: {
    label: 'Kept hidden',
    shortLabel: 'Hidden',
    icon: 'fa-regular fa-eye-slash',
    iconClass:
      'bg-[#eaf3ff] text-[#1570d8]',
    textClass:
      'text-[#1570d8]',
  },
  restored: {
    label: 'Restored',
    shortLabel: 'Restored',
    icon: 'fa-regular fa-circle-check',
    iconClass:
      'bg-[#e7faf1] text-[#159768]',
    textClass:
      'text-[#159768]',
  },
  deleted: {
    label: 'Deleted',
    shortLabel: 'Deleted',
    icon: 'fa-regular fa-trash-can',
    iconClass:
      'bg-[#fff0f2] text-[#ef3f56]',
    textClass:
      'text-[#ef3f56]',
  },
}

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

function relativeTime(value) {
  const date = new Date(value || '')
  const time = date.getTime()

  if (!Number.isFinite(time)) {
    return ''
  }

  const difference =
    Date.now() - time
  const seconds =
    Math.max(
      0,
      Math.floor(
        difference / 1000
      )
    )

  if (seconds < 60) {
    return 'Just now'
  }

  const minutes =
    Math.floor(seconds / 60)

  if (minutes < 60) {
    return `${minutes}m ago`
  }

  const hours =
    Math.floor(minutes / 60)

  if (hours < 24) {
    return `${hours}h ago`
  }

  const days =
    Math.floor(hours / 24)

  if (days < 7) {
    return `${days}d ago`
  }

  return date.toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  )
}

function readerInitial(reader) {
  return String(
    reader?.name ||
    reader?.username ||
    'R'
  )
    .trim()
    .charAt(0)
    .toUpperCase()
}

function episodeLabel(episode) {
  if (!episode) return ''

  if (
    Number(
      episode.episode_number || 0
    ) > 0
  ) {
    return `EP ${episode.episode_number}`
  }

  return episode.title || 'Episode'
}

function LoadingCards() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="rounded-[24px] border border-[#ebe7f2] bg-white p-4 shadow-[0_10px_28px_rgba(61,45,115,0.06)]"
        >
          <div className="flex gap-3">
            <div className="h-12 w-12 animate-pulse rounded-full bg-[#f1edf8]" />

            <div className="min-w-0 flex-1">
              <div className="h-4 w-28 animate-pulse rounded-full bg-[#f1edf8]" />
              <div className="mt-2 h-3 w-48 animate-pulse rounded-full bg-[#f6f3fa]" />
              <div className="mt-5 h-4 w-full animate-pulse rounded-full bg-[#f1edf8]" />
              <div className="mt-2 h-4 w-4/5 animate-pulse rounded-full bg-[#f6f3fa]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function StatCard({
  status,
  count,
  active,
  onClick,
}) {
  const config =
    STATUS_CONFIG[status]

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[21px] border bg-white px-2.5 py-3.5 text-center shadow-[0_8px_22px_rgba(61,45,115,0.05)] transition active:scale-[0.98] ${
        active
          ? 'border-[#7a55f6] ring-2 ring-[#7a55f6]/10'
          : 'border-[#ebe7f2]'
      }`}
    >
      <div
        className={`mx-auto flex h-10 w-10 items-center justify-center rounded-[14px] ${config.iconClass}`}
      >
        <i
          className={`${config.icon} text-[15px]`}
        />
      </div>

      <div className="mt-2 text-[19px] font-black text-[#11152d]">
        {Number(count || 0)}
      </div>

      <div
        className={`mt-0.5 text-[10.5px] font-extrabold ${config.textClass}`}
      >
        {config.label}
      </div>
    </button>
  )
}

function Avatar({ reader }) {
  if (reader?.avatar_url) {
    return (
      <img
        src={reader.avatar_url}
        alt=""
        className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm"
      />
    )
  }

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7a55f6] to-[#ba93ff] text-[17px] font-black text-white ring-2 ring-white shadow-sm">
      {readerInitial(reader)}
    </div>
  )
}

function ActionButton({
  icon,
  label,
  className,
  disabled,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-[14px] border px-2 text-[11.5px] font-extrabold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      <i
        className={`${icon} text-[12px]`}
      />

      <span className="truncate">
        {label}
      </span>
    </button>
  )
}

function HiddenCommentCard({
  item,
  actionKey,
  onAction,
}) {
  const status =
    STATUS_CONFIG[item.status] ||
    STATUS_CONFIG.hidden
  const isWorking =
    actionKey.startsWith(
      `${item.id}:`
    )
  const matchedWords =
    Array.isArray(
      item.matched_words
    )
      ? item.matched_words
      : []
  const visibleWords =
    matchedWords.slice(0, 3)
  const extraWords =
    Math.max(
      0,
      matchedWords.length - 3
    )

  return (
    <article className="overflow-hidden rounded-[24px] border border-[#ebe7f2] bg-white shadow-[0_10px_30px_rgba(61,45,115,0.065)]">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Avatar
            reader={item.reader}
          />

          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <div className="truncate text-[14px] font-black text-[#11152d]">
                {item.reader?.name ||
                  item.reader
                    ?.username ||
                  'Reader'}
              </div>

              <span
                className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-[0.04em] ${status.iconClass} ${status.textClass}`}
              >
                {status.shortLabel}
              </span>

              <span className="ml-auto shrink-0 text-[10.5px] font-semibold text-[#8a90a3]">
                {relativeTime(
                  item.created_at
                )}
              </span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold text-[#697087]">
              <span className="max-w-full truncate">
                Story:{' '}
                {item.story?.title ||
                  'Unknown story'}
              </span>

              {item.episode ? (
                <>
                  <span>•</span>
                  <span>
                    {episodeLabel(
                      item.episode
                    )}
                  </span>
                </>
              ) : null}
            </div>
          </div>
        </div>

        <p className="mt-4 whitespace-pre-wrap break-words text-[13.5px] font-medium leading-6 text-[#171b33]">
          {item.text ||
            'Comment text is unavailable.'}
        </p>

        {visibleWords.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {visibleWords.map(
              (
                word,
                index
              ) => (
                <span
                  key={`${word.word}-${index}`}
                  className="rounded-[10px] bg-[#fff0f2] px-2.5 py-1.5 text-[10.5px] font-bold text-[#e23d52]"
                >
                  Matched:{' '}
                  {word.word}
                  {Number(
                    word.count || 0
                  ) > 1
                    ? ` ×${word.count}`
                    : ''}
                </span>
              )
            )}

            {extraWords ? (
              <span className="rounded-[10px] bg-[#f2eef9] px-2.5 py-1.5 text-[10.5px] font-bold text-[#6f7487]">
                +{extraWords} more
              </span>
            ) : null}
          </div>
        ) : (
          <div className="mt-3 inline-flex rounded-[10px] bg-[#f3f0f8] px-2.5 py-1.5 text-[10.5px] font-bold text-[#777d91]">
            Auto hidden by your rule
          </div>
        )}
      </div>

      {item.status !== 'deleted' ? (
        <div className="flex gap-2 border-t border-[#f0edf5] bg-[#fcfbfe] px-3 py-3">
          {item.status !==
          'kept_hidden' ? (
            <ActionButton
              icon={
                actionKey ===
                `${item.id}:keep_hidden`
                  ? 'fa-solid fa-spinner animate-spin'
                  : 'fa-solid fa-lock'
              }
              label="Keep Hidden"
              disabled={isWorking}
              onClick={() =>
                onAction(
                  item,
                  'keep_hidden'
                )
              }
              className="border-[#e5ddff] bg-white text-[#6d3df5]"
            />
          ) : null}

          {item.status !==
          'restored' ? (
            <ActionButton
              icon={
                actionKey ===
                `${item.id}:restore`
                  ? 'fa-solid fa-spinner animate-spin'
                  : 'fa-solid fa-rotate'
              }
              label="Restore"
              disabled={isWorking}
              onClick={() =>
                onAction(
                  item,
                  'restore'
                )
              }
              className="border-[#dbe7ff] bg-white text-[#1769e0]"
            />
          ) : null}

          <ActionButton
            icon={
              actionKey ===
                `${item.id}:delete`
                ? 'fa-solid fa-spinner animate-spin'
                : 'fa-regular fa-trash-can'
            }
            label="Delete"
            disabled={isWorking}
            onClick={() =>
              onAction(
                item,
                'delete'
              )
            }
            className="border-[#ffdce1] bg-[#fff7f8] text-[#ef334d]"
          />
        </div>
      ) : (
        <div className="border-t border-[#f0edf5] bg-[#fff8f9] px-4 py-3 text-center text-[11.5px] font-bold text-[#ef3f56]">
          This comment is in trash.
        </div>
      )}
    </article>
  )
}

export default function AuthorHiddenCommentsPage() {
  const navigate = useNavigate()
  const toastTimerRef =
    useRef(null)
  const searchTimerRef =
    useRef(null)
  const [status, setStatus] =
    useState('hidden')
  const [
    searchInput,
    setSearchInput,
  ] = useState('')
  const [search, setSearch] =
    useState('')
  const [sort, setSort] =
    useState('newest')
  const [page, setPage] =
    useState(1)
  const [loading, setLoading] =
    useState(true)
  const [items, setItems] =
    useState([])
  const [counts, setCounts] =
    useState({
      hidden: 0,
      kept_hidden: 0,
      restored: 0,
      deleted: 0,
    })
  const [total, setTotal] =
    useState(0)
  const [
    totalPages,
    setTotalPages,
  ] = useState(1)
  const [
    actionKey,
    setActionKey,
  ] = useState('')
  const [toast, setToast] =
    useState(null)

  const openAutoHideWords =
    () => {
      navigate(
        '/author/comment-protection?view=word-filters&type=auto_hide'
      )
    }

  const request = useCallback(
    async (
      path,
      options = {}
    ) => {
      const token =
        getAuthToken()

      if (!token) {
        navigate('/login', {
          replace: true,
        })
        throw new Error(
          'Please login again.'
        )
      }

      const response =
        await fetch(
          `${API_BASE_URL}${path}`,
          {
            ...options,
            headers: {
              'Content-Type':
                'application/json',
              Authorization:
                `Bearer ${token}`,
              ...(options.headers ||
                {}),
            },
          }
        )

      const data =
        await response
          .json()
          .catch(() => ({}))

      if (
        response.status === 401
      ) {
        navigate('/login', {
          replace: true,
        })
      }

      if (
        !response.ok ||
        data.ok === false
      ) {
        throw new Error(
          data.message ||
            'Request failed'
        )
      }

      return data
    },
    [navigate]
  )

  const showToast = useCallback(
    (
      message,
      type = 'success'
    ) => {
      setToast({
        message,
        type,
      })

      window.clearTimeout(
        toastTimerRef.current
      )

      toastTimerRef.current =
        window.setTimeout(() => {
          setToast(null)
        }, 2300)
    },
    []
  )

  useEffect(() => {
    return () => {
      window.clearTimeout(
        toastTimerRef.current
      )
      window.clearTimeout(
        searchTimerRef.current
      )
    }
  }, [])

  useEffect(() => {
    window.clearTimeout(
      searchTimerRef.current
    )

    searchTimerRef.current =
      window.setTimeout(() => {
        setSearch(
          searchInput.trim()
        )
        setPage(1)
      }, 320)
  }, [searchInput])

  const loadComments =
    useCallback(async () => {
      try {
        setLoading(true)

        const params =
          new URLSearchParams({
            status,
            search,
            sort,
            page:
              String(page),
            limit: '10',
          })
        const data =
          await request(
            `${HIDDEN_COMMENTS_PATH}?${params.toString()}`
          )

        setItems(
          Array.isArray(
            data.comments
          )
            ? data.comments
            : []
        )
        setCounts({
          hidden:
            Number(
              data.counts
                ?.hidden || 0
            ),
          kept_hidden:
            Number(
              data.counts
                ?.kept_hidden || 0
            ),
          restored:
            Number(
              data.counts
                ?.restored || 0
            ),
          deleted:
            Number(
              data.counts
                ?.deleted || 0
            ),
        })
        setTotal(
          Number(
            data.total || 0
          )
        )
        setTotalPages(
          Math.max(
            1,
            Number(
              data.total_pages || 1
            )
          )
        )

        if (
          Number(
            data.page || 1
          ) !== page
        ) {
          setPage(
            Number(
              data.page || 1
            )
          )
        }
      } catch (error) {
        showToast(
          error.message ||
            'Failed to load hidden comments.',
          'error'
        )
      } finally {
        setLoading(false)
      }
    }, [
      page,
      request,
      search,
      showToast,
      sort,
      status,
    ])

  useEffect(() => {
    loadComments()
  }, [loadComments])

  const activeConfig =
    STATUS_CONFIG[status]
  const statusCards =
    useMemo(
      () =>
        STATUS_OPTIONS.map(
          (option) => ({
            ...option,
            count:
              counts[
                option.value
              ] || 0,
          })
        ),
      [counts]
    )

  const handleStatusChange = (
    nextStatus
  ) => {
    setStatus(nextStatus)
    setPage(1)
  }

  const handleAction = async (
    item,
    action
  ) => {
    if (
      action === 'delete'
    ) {
      const approved =
        window.confirm(
          'Move this comment to trash?'
        )

      if (!approved) return
    }

    try {
      setActionKey(
        `${item.id}:${action}`
      )

      const data =
        await request(
          `${HIDDEN_COMMENTS_PATH}/${encodeURIComponent(
            item.id
          )}`,
          {
            method: 'PATCH',
            body:
              JSON.stringify({
                action,
              }),
          }
        )

      showToast(
        data.message ||
          'Hidden comment updated.'
      )
      await loadComments()
    } catch (error) {
      showToast(
        error.message ||
          'Failed to update hidden comment.',
        'error'
      )
    } finally {
      setActionKey('')
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#faf9ff_48%,#f4f0ff_100%)] pb-[110px]">
      <header className="sticky top-0 z-50 border-b border-[#eeeaf6] bg-white/95 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <button
            type="button"
            onClick={() =>
              navigate(
                '/author/comment-protection'
              )
            }
            className="flex h-10 w-10 items-center justify-start text-[#111827] transition active:scale-95 active:opacity-60"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0 px-3 text-center">
            <h1 className="text-[17px] font-black text-[#11152d]">
              Hidden Comments
            </h1>

            <p className="mt-0.5 truncate text-[10.5px] font-medium text-[#747a90]">
              Comments hidden by your words and rules
            </p>
          </div>

          <button
            type="button"
            onClick={
              openAutoHideWords
            }
            className="flex h-10 w-10 items-center justify-end text-[#111827] transition active:scale-95 active:opacity-60"
            aria-label="Manage auto-hide words"
          >
            <i className="fa-solid fa-sliders text-[14px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-3.5 pt-4 sm:px-4">
        <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {statusCards.map(
            (card) => (
              <StatCard
                key={card.value}
                status={
                  card.value
                }
                count={card.count}
                active={
                  status ===
                  card.value
                }
                onClick={() =>
                  handleStatusChange(
                    card.value
                  )
                }
              />
            )
          )}
        </section>

        <section className="mt-3.5 flex gap-2.5">
          <div className="relative min-w-0 flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[13px] text-[#9095a8]" />

            <input
              value={searchInput}
              onChange={(event) =>
                setSearchInput(
                  event.target.value
                )
              }
              placeholder="Search hidden comments..."
              className="h-12 w-full rounded-[18px] border border-[#e5e1ee] bg-white pl-10 pr-10 text-[13px] font-semibold text-[#11152d] shadow-[0_8px_24px_rgba(61,45,115,0.05)] outline-none transition placeholder:font-medium placeholder:text-[#9ca1b2] focus:border-[#7555f6] focus:ring-4 focus:ring-[#7555f6]/10"
            />

            {searchInput ? (
              <button
                type="button"
                onClick={() =>
                  setSearchInput('')
                }
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#9ca1b2] active:bg-[#f4f1f9]"
                aria-label="Clear search"
              >
                <i className="fa-solid fa-xmark text-[13px]" />
              </button>
            ) : null}
          </div>

          <div className="relative shrink-0">
            <select
              value={status}
              onChange={(event) =>
                handleStatusChange(
                  event.target.value
                )
              }
              className="h-12 max-w-[154px] appearance-none rounded-[18px] border border-[#e5e1ee] bg-white pl-4 pr-9 text-[12px] font-extrabold text-[#252942] shadow-[0_8px_24px_rgba(61,45,115,0.05)] outline-none transition focus:border-[#7555f6] focus:ring-4 focus:ring-[#7555f6]/10"
              aria-label="Filter hidden comments"
            >
              {STATUS_OPTIONS.map(
                (option) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {option.label}
                  </option>
                )
              )}
            </select>

            <i className="fa-solid fa-chevron-down pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#74798c]" />
          </div>
        </section>

        <section className="mt-3 flex items-center justify-between gap-3 px-0.5">
          <div>
            <h2 className="text-[15px] font-black text-[#11152d]">
              {activeConfig.label}
            </h2>

            <p className="mt-0.5 text-[10.5px] font-medium text-[#858a9d]">
              {total}{' '}
              {total === 1
                ? 'comment'
                : 'comments'}
            </p>
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={(event) => {
                setSort(
                  event.target.value
                )
                setPage(1)
              }}
              className="h-9 appearance-none rounded-[14px] border border-[#e5e1ee] bg-white pl-3 pr-8 text-[10.5px] font-bold text-[#5f6579] outline-none"
              aria-label="Sort hidden comments"
            >
              <option value="newest">
                Newest first
              </option>

              <option value="oldest">
                Oldest first
              </option>
            </select>

            <i className="fa-solid fa-chevron-down pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-[#858a9d]" />
          </div>
        </section>

        <section className="mt-3">
          {loading ? (
            <LoadingCards />
          ) : items.length ? (
            <div className="space-y-3">
              {items.map((item) => (
                <HiddenCommentCard
                  key={item.id}
                  item={item}
                  actionKey={
                    actionKey
                  }
                  onAction={
                    handleAction
                  }
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[26px] border border-[#ebe7f2] bg-white px-5 py-12 text-center shadow-[0_12px_34px_rgba(61,45,115,0.06)]">
              <div
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-[19px] ${activeConfig.iconClass}`}
              >
                <i
                  className={`${activeConfig.icon} text-[20px]`}
                />
              </div>

              <h3 className="mt-3 text-[14px] font-black text-[#171a31]">
                {search
                  ? 'No matching comments'
                  : `No ${activeConfig.label.toLowerCase()} comments`}
              </h3>

              <p className="mx-auto mt-1.5 max-w-[290px] text-[11.5px] font-medium leading-5 text-[#858a9d]">
                {search
                  ? 'Try another search term or clear your search.'
                  : status ===
                      'hidden'
                    ? 'Comments matching your auto-hide words will appear here for review.'
                    : 'Comments with this review status will appear here.'}
              </p>

              {!search &&
              status === 'hidden' ? (
                <button
                  type="button"
                  onClick={
                    openAutoHideWords
                  }
                  className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-[16px] bg-gradient-to-r from-[#7047f5] to-[#8459ff] px-4 text-[12px] font-extrabold text-white shadow-[0_10px_24px_rgba(112,71,245,0.22)] transition active:scale-95"
                >
                  <i className="fa-solid fa-filter text-[11px]" />
                  Manage Auto-hide Words
                </button>
              ) : null}
            </div>
          )}
        </section>

        {!loading &&
        totalPages > 1 ? (
          <nav className="mt-5 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() =>
                setPage(
                  (current) =>
                    Math.max(
                      1,
                      current - 1
                    )
                )
              }
              disabled={page <= 1}
              className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-[#e5e1ee] bg-white text-[#62687b] shadow-sm active:scale-95 disabled:opacity-35"
              aria-label="Previous page"
            >
              <i className="fa-solid fa-chevron-left text-[11px]" />
            </button>

            <div className="rounded-[14px] bg-gradient-to-r from-[#7047f5] to-[#855dff] px-4 py-2.5 text-[11.5px] font-black text-white shadow-[0_8px_20px_rgba(112,71,245,0.22)]">
              {page} /{' '}
              {totalPages}
            </div>

            <button
              type="button"
              onClick={() =>
                setPage(
                  (current) =>
                    Math.min(
                      totalPages,
                      current + 1
                    )
                )
              }
              disabled={
                page >= totalPages
              }
              className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-[#e5e1ee] bg-white text-[#62687b] shadow-sm active:scale-95 disabled:opacity-35"
              aria-label="Next page"
            >
              <i className="fa-solid fa-chevron-right text-[11px]" />
            </button>
          </nav>
        ) : null}
      </main>

      {toast ? (
        <div className="fixed bottom-[calc(18px+env(safe-area-inset-bottom))] left-1/2 z-[120] w-[calc(100%-28px)] max-w-md -translate-x-1/2">
          <div
            className={`flex items-center gap-3 rounded-[20px] border px-4 py-3 shadow-[0_18px_50px_rgba(32,28,51,0.18)] ${
              toast.type === 'error'
                ? 'border-[#ffd6dc] bg-[#fff5f6] text-[#c93649]'
                : 'border-[#ccefd8] bg-[#f0fff5] text-[#16803c]'
            }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                toast.type === 'error'
                  ? 'bg-[#ffe1e5]'
                  : 'bg-[#d9f8e4]'
              }`}
            >
              <i
                className={`fa-solid ${
                  toast.type === 'error'
                    ? 'fa-triangle-exclamation'
                    : 'fa-check'
                } text-[13px]`}
              />
            </div>

            <span className="min-w-0 flex-1 text-[12px] font-bold leading-5">
              {toast.message}
            </span>

            <button
              type="button"
              onClick={() =>
                setToast(null)
              }
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full active:bg-black/5"
              aria-label="Close message"
            >
              <i className="fa-solid fa-xmark text-[13px]" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
