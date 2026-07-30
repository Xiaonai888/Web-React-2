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

const HISTORY_PATH =
  '/api/authors/me/comment-protection/moderation-history'

const COPY = {
  auto_hide_word_added: ['Auto-hide word added', 'fa-solid fa-filter'],
  auto_hide_word_removed: ['Auto-hide word removed', 'fa-solid fa-filter-circle-xmark'],
  blocked_word_added: ['Blocked word added', 'fa-solid fa-ban'],
  blocked_word_removed: ['Blocked word removed', 'fa-solid fa-circle-minus'],
  comment_auto_hidden: ['Comment auto-hidden', 'fa-regular fa-eye-slash'],
  comment_kept_hidden: ['Comment kept hidden', 'fa-solid fa-eye-slash'],
  comment_restored: ['Comment restored', 'fa-solid fa-eye'],
  comment_deleted: ['Comment moved to Trash', 'fa-regular fa-trash-can'],
  comment_auto_cleaned: ['Comment auto-cleaned', 'fa-solid fa-broom'],
  auto_cleanup_completed: ['Auto Cleanup completed', 'fa-solid fa-circle-check'],
  auto_cleanup_failed: ['Auto Cleanup failed', 'fa-solid fa-triangle-exclamation'],
  cleanup_settings_updated: ['Cleanup settings updated', 'fa-solid fa-sliders'],
  reader_blocked: ['Reader blocked', 'fa-solid fa-user-slash'],
  reader_block_updated: ['Reader block updated', 'fa-solid fa-user-clock'],
  reader_unblocked: ['Reader unblocked', 'fa-solid fa-user-check'],
}

function getToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function humanize(value) {
  return String(value || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    )
}

function configFor(action) {
  const item = COPY[action]

  return {
    label: item?.[0] || humanize(action),
    icon:
      item?.[1] ||
      'fa-solid fa-shield-halved',
  }
}

function formatDate(value) {
  const date = new Date(value || '')
  if (Number.isNaN(date.getTime())) {
    return 'Unknown time'
  }

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function HistoryCard({ item }) {
  const [open, setOpen] = useState(false)
  const config = configFor(
    item.action_type
  )
  const metadata =
    item.metadata &&
    typeof item.metadata === 'object'
      ? item.metadata
      : {}
  const details = [
    ['Reader', metadata.reader_name || metadata.reader_user_id],
    ['Word', metadata.word],
    ['Scope', metadata.scope_type],
    ['Duration', metadata.duration],
    ['Retention', metadata.retention_days ? `${metadata.retention_days} days` : ''],
    ['Comments', metadata.cleaned_count],
    ['Reason', metadata.reason],
    ['Error', metadata.error],
    ['Target ID', item.target_id],
  ].filter(([, value]) =>
    value !== null &&
    value !== undefined &&
    value !== ''
  )

  return (
    <article className="overflow-hidden rounded-[22px] border border-[#ebe7f2] bg-white shadow-[0_9px_26px_rgba(61,45,115,0.055)]">
      <div className="flex items-start gap-3 p-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-[#f1ebff] text-[#7047f5]">
          <i className={`${config.icon} text-[14px]`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[13px] font-black text-[#15192f]">
              {config.label}
            </h3>

            <span
              className={`rounded-full px-2 py-1 text-[8px] font-black uppercase tracking-[0.05em] ${
                item.actor_type === 'system'
                  ? 'bg-[#eef3ff] text-[#4172d9]'
                  : 'bg-[#f1ebff] text-[#7047f5]'
              }`}
            >
              {item.actor_type === 'system'
                ? 'System'
                : 'Author'}
            </span>
          </div>

          <p className="mt-1.5 break-words text-[11.5px] font-medium leading-5 text-[#62687c]">
            {item.summary || config.label}
          </p>

          <div className="mt-2 text-[9.5px] font-semibold text-[#979cad]">
            <i className="fa-regular fa-clock mr-1.5" />
            {formatDate(item.created_at)}
          </div>
        </div>

        {details.length ? (
          <button
            type="button"
            onClick={() =>
              setOpen((current) => !current)
            }
            className="flex h-9 w-9 shrink-0 items-center justify-center text-[#969bad]"
            aria-label={
              open
                ? 'Hide details'
                : 'Show details'
            }
          >
            <i
              className={`fa-solid fa-chevron-down text-[10px] transition ${
                open ? 'rotate-180' : ''
              }`}
            />
          </button>
        ) : null}
      </div>

      {open ? (
        <div className="border-t border-[#f0edf5] bg-[#fcfbfe] px-4 py-2">
          {details.map(([label, value]) => (
            <div
              key={label}
              className="flex items-start justify-between gap-3 border-t border-[#f0edf5] py-2 first:border-t-0"
            >
              <span className="shrink-0 text-[9.5px] font-black uppercase text-[#9a9fb0]">
                {label}
              </span>
              <span className="min-w-0 break-words text-right text-[10.5px] font-semibold text-[#555b70]">
                {String(value)}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </article>
  )
}

export default function AuthorModerationHistoryPage() {
  const navigate = useNavigate()
  const searchTimerRef = useRef(null)
  const toastTimerRef = useRef(null)
  const [logs, setLogs] = useState([])
  const [actions, setActions] = useState([])
  const [actionType, setActionType] =
    useState('all')
  const [searchInput, setSearchInput] =
    useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] =
    useState(1)
  const [loading, setLoading] =
    useState(true)
  const [toast, setToast] = useState(null)

  const request = useCallback(
    async (path) => {
      const token = getToken()

      if (!token) {
        navigate('/login', { replace: true })
        throw new Error('Please login again.')
      }

      const response = await fetch(
        `${API_BASE_URL}${path}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = await response
        .json()
        .catch(() => ({}))

      if (response.status === 401) {
        navigate('/login', { replace: true })
      }

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message || 'Request failed'
        )
      }

      return data
    },
    [navigate]
  )

  const showError = useCallback((message) => {
    setToast({ message })
    window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = window.setTimeout(
      () => setToast(null),
      2400
    )
  }, [])

  useEffect(() => {
    return () => {
      window.clearTimeout(searchTimerRef.current)
      window.clearTimeout(toastTimerRef.current)
    }
  }, [])

  useEffect(() => {
    window.clearTimeout(searchTimerRef.current)
    searchTimerRef.current = window.setTimeout(
      () => {
        setSearch(searchInput.trim())
        setPage(1)
      },
      320
    )
  }, [searchInput])

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        action_type: actionType,
        search,
        page: String(page),
        limit: '15',
      })
      const data = await request(
        `${HISTORY_PATH}?${params.toString()}`
      )

      setLogs(
        Array.isArray(data.logs)
          ? data.logs
          : []
      )
      setActions(
        Array.isArray(data.available_actions)
          ? data.available_actions
          : []
      )
      setTotal(Number(data.total || 0))
      setTotalPages(
        Math.max(
          1,
          Number(data.total_pages || 1)
        )
      )

      if (Number(data.page || 1) !== page) {
        setPage(Number(data.page || 1))
      }
    } catch (error) {
      showError(
        error.message ||
          'Failed to load Moderation History.'
      )
    } finally {
      setLoading(false)
    }
  }, [
    actionType,
    page,
    request,
    search,
    showError,
  ])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const options = useMemo(
    () => [
      { value: 'all', label: 'All actions' },
      ...actions.map((value) => ({
        value,
        label: configFor(value).label,
      })),
    ],
    [actions]
  )

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#faf9ff_48%,#f4f0ff_100%)] pb-[110px]">
      <header className="sticky top-0 z-50 border-b border-[#eeeaf6] bg-white/95 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <button
            type="button"
            onClick={() =>
              navigate('/author/comment-protection')
            }
            className="flex h-10 w-10 items-center justify-start text-[#111827]"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0 px-3 text-center">
            <h1 className="text-[17px] font-black text-[#11152d]">
              Moderation History
            </h1>
            <p className="mt-0.5 truncate text-[10.5px] font-medium text-[#747a90]">
              Protection actions and cleanup records
            </p>
          </div>

          <button
            type="button"
            onClick={loadHistory}
            disabled={loading}
            className="flex h-10 w-10 items-center justify-end text-[#7047f5] disabled:opacity-40"
            aria-label="Refresh history"
          >
            <i
              className={`fa-solid fa-rotate text-[13px] ${
                loading ? 'animate-spin' : ''
              }`}
            />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-3.5 pt-4 sm:px-4">
        <section className="rounded-[24px] border border-[#e8e2f7] bg-white p-4 shadow-[0_12px_32px_rgba(61,45,115,0.07)]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[#f1ebff] text-[#7047f5]">
              <i className="fa-solid fa-clock-rotate-left text-[18px]" />
            </div>
            <div>
              <h2 className="text-[14px] font-black text-[#15192f]">
                Your moderation records
              </h2>
              <p className="mt-1 text-[11px] font-medium text-[#747a90]">
                Author actions and automatic system activity.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-3 flex gap-2.5">
          <div className="relative min-w-0 flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[12px] text-[#9095a8]" />
            <input
              value={searchInput}
              onChange={(event) =>
                setSearchInput(event.target.value)
              }
              placeholder="Search history..."
              className="h-12 w-full rounded-[18px] border border-[#e5e1ee] bg-white pl-10 pr-10 text-[12.5px] font-semibold text-[#11152d] outline-none focus:border-[#7555f6]"
            />
            {searchInput ? (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-[#9ca1b2]"
                aria-label="Clear search"
              >
                <i className="fa-solid fa-xmark text-[12px]" />
              </button>
            ) : null}
          </div>

          <div className="relative shrink-0">
            <select
              value={actionType}
              onChange={(event) => {
                setActionType(event.target.value)
                setPage(1)
              }}
              className="h-12 max-w-[154px] appearance-none rounded-[18px] border border-[#e5e1ee] bg-white pl-3 pr-8 text-[10.5px] font-extrabold text-[#353a50] outline-none"
            >
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-[#858a9d]" />
          </div>
        </section>

        <div className="mt-4 px-0.5">
          <h2 className="text-[15px] font-black text-[#11152d]">
            Activity
          </h2>
          <p className="mt-0.5 text-[10.5px] font-medium text-[#858a9d]">
            {total} {total === 1 ? 'record' : 'records'}
          </p>
        </div>

        <section className="mt-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-[22px] bg-white"
                />
              ))}
            </div>
          ) : logs.length ? (
            <div className="space-y-3">
              {logs.map((item) => (
                <HistoryCard
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[26px] border border-[#ebe7f2] bg-white px-5 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[19px] bg-[#f1ebff] text-[#7047f5]">
                <i className="fa-solid fa-clock-rotate-left text-[20px]" />
              </div>
              <h3 className="mt-3 text-[14px] font-black text-[#171a31]">
                {search
                  ? 'No matching records'
                  : 'No moderation history yet'}
              </h3>
            </div>
          )}
        </section>

        {!loading && totalPages > 1 ? (
          <nav className="mt-5 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() =>
                setPage((current) =>
                  Math.max(1, current - 1)
                )
              }
              disabled={page <= 1}
              className="flex h-10 w-10 items-center justify-center rounded-[14px] border bg-white disabled:opacity-35"
            >
              <i className="fa-solid fa-chevron-left text-[11px]" />
            </button>

            <div className="rounded-[14px] bg-[#7555f6] px-4 py-2.5 text-[11.5px] font-black text-white">
              {page} / {totalPages}
            </div>

            <button
              type="button"
              onClick={() =>
                setPage((current) =>
                  Math.min(
                    totalPages,
                    current + 1
                  )
                )
              }
              disabled={page >= totalPages}
              className="flex h-10 w-10 items-center justify-center rounded-[14px] border bg-white disabled:opacity-35"
            >
              <i className="fa-solid fa-chevron-right text-[11px]" />
            </button>
          </nav>
        ) : null}
      </main>

      {toast ? (
        <div className="fixed bottom-5 left-1/2 z-[120] w-[calc(100%-28px)] max-w-md -translate-x-1/2 rounded-[18px] border border-[#ffd6dc] bg-[#fff5f6] px-4 py-3 text-[12px] font-bold text-[#c93649] shadow-lg">
          {toast.message}
        </div>
      ) : null}
    </div>
  )
}
