import {
  useCallback,
  useEffect,
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

const BLOCKED_READERS_PATH =
  '/api/authors/me/comment-protection/blocked-readers'

const STATUS_OPTIONS = [
  {
    value: 'active',
    label: 'Active',
  },
  {
    value: 'expired',
    label: 'Expired',
  },
  {
    value: 'all',
    label: 'All',
  },
]

const DURATION_OPTIONS = [
  {
    value: '1h',
    label: '1 hour',
  },
  {
    value: '6h',
    label: '6 hours',
  },
  {
    value: '24h',
    label: '24 hours',
  },
  {
    value: '3d',
    label: '3 days',
  },
  {
    value: '7d',
    label: '7 days',
  },
  {
    value: '30d',
    label: '30 days',
  },
]

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

function formatDate(value) {
  const date = new Date(value || '')

  if (Number.isNaN(date.getTime())) {
    return 'Unknown'
  }

  return date.toLocaleString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }
  )
}

function remainingTime(value) {
  const timestamp =
    new Date(value || '').getTime()

  if (!Number.isFinite(timestamp)) {
    return 'Expired'
  }

  const difference =
    timestamp - Date.now()

  if (difference <= 0) {
    return 'Expired'
  }

  const minutes =
    Math.ceil(
      difference / 60000
    )

  if (minutes < 60) {
    return `${minutes}m left`
  }

  const hours =
    Math.ceil(
      minutes / 60
    )

  if (hours < 24) {
    return `${hours}h left`
  }

  const days =
    Math.ceil(
      hours / 24
    )

  return `${days}d left`
}

function Avatar({
  reader,
  className = 'h-12 w-12',
}) {
  if (reader?.avatar_url) {
    return (
      <img
        src={reader.avatar_url}
        alt=""
        className={`${className} shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm`}
      />
    )
  }

  return (
    <div
      className={`${className} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7650f4] to-[#b896ff] font-black text-white ring-2 ring-white shadow-sm`}
    >
      {readerInitial(reader)}
    </div>
  )
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
              <div className="mt-2 h-3 w-44 animate-pulse rounded-full bg-[#f6f3fa]" />
              <div className="mt-4 h-10 w-full animate-pulse rounded-[14px] bg-[#f6f3fa]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function BlockCard({
  item,
  deletingId,
  onUnblock,
}) {
  const active =
    item.status === 'active'

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
                  item.reader?.username ||
                  'Reader'}
              </div>

              <span
                className={`shrink-0 rounded-full px-2 py-1 text-[8.5px] font-black uppercase tracking-[0.05em] ${
                  active
                    ? 'bg-[#e8f9ef] text-[#13824d]'
                    : 'bg-[#f1eef5] text-[#777d91]'
                }`}
              >
                {active
                  ? 'Active'
                  : 'Expired'}
              </span>
            </div>

            {item.reader?.username ? (
              <div className="mt-0.5 truncate text-[11px] font-semibold text-[#858a9d]">
                @{item.reader.username}
              </div>
            ) : null}
          </div>

          {active ? (
            <span className="shrink-0 text-[10px] font-bold text-[#7047f5]">
              {remainingTime(
                item.expires_at
              )}
            </span>
          ) : null}
        </div>

        <div className="mt-4 rounded-[16px] bg-[#f8f6fc] p-3">
          <div className="flex items-start gap-2.5">
            <i className="fa-solid fa-shield-halved mt-0.5 text-[12px] text-[#7555f6]" />

            <div className="min-w-0 flex-1">
              <div className="text-[11.5px] font-extrabold text-[#272b43]">
                {item.scope_type ===
                'all_author'
                  ? 'All author stories'
                  : item.story?.title ||
                    'Specific story'}
              </div>

              <div className="mt-1 text-[10.5px] font-medium leading-4 text-[#858a9d]">
                Until{' '}
                {formatDate(
                  item.expires_at
                )}
              </div>
            </div>
          </div>
        </div>

        {item.reason ? (
          <div className="mt-3">
            <div className="text-[9.5px] font-black uppercase tracking-[0.06em] text-[#9a9fb0]">
              Reason
            </div>

            <p className="mt-1 whitespace-pre-wrap break-words text-[11.5px] font-medium leading-5 text-[#51576b]">
              {item.reason}
            </p>
          </div>
        ) : null}
      </div>

      {active ? (
        <div className="border-t border-[#f0edf5] bg-[#fcfbfe] px-3 py-3">
          <button
            type="button"
            onClick={() =>
              onUnblock(item)
            }
            disabled={
              deletingId === item.id
            }
            className="flex h-10 w-full items-center justify-center gap-2 rounded-[14px] border border-[#ffd9df] bg-[#fff7f8] text-[11.5px] font-extrabold text-[#e93b52] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55"
          >
            <i
              className={`fa-solid ${
                deletingId === item.id
                  ? 'fa-spinner animate-spin'
                  : 'fa-user-check'
              } text-[12px]`}
            />

            Unblock Reader
          </button>
        </div>
      ) : null}
    </article>
  )
}

function ReaderResult({
  reader,
  selected,
  onSelect,
}) {
  return (
    <button
      type="button"
      onClick={() =>
        onSelect(reader)
      }
      className={`flex w-full items-center gap-3 rounded-[18px] border p-3 text-left transition active:scale-[0.99] ${
        selected
          ? 'border-[#7555f6] bg-[#f7f4ff] ring-2 ring-[#7555f6]/10'
          : 'border-[#ebe7f2] bg-white'
      }`}
    >
      <Avatar
        reader={reader}
        className="h-11 w-11"
      />

      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-black text-[#11152d]">
          {reader.name ||
            reader.username ||
            'Reader'}
        </div>

        {reader.username ? (
          <div className="mt-0.5 truncate text-[10.5px] font-semibold text-[#858a9d]">
            @{reader.username}
          </div>
        ) : null}
      </div>

      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
          selected
            ? 'border-[#7555f6] bg-[#7555f6] text-white'
            : 'border-[#ddd8e8] text-transparent'
        }`}
      >
        <i className="fa-solid fa-check text-[10px]" />
      </div>
    </button>
  )
}

function BlockReaderSheet({
  open,
  onClose,
  request,
  onCreated,
  showToast,
}) {
  const searchTimerRef =
    useRef(null)
  const [readerQuery, setReaderQuery] =
    useState('')
  const [
    readerResults,
    setReaderResults,
  ] = useState([])
  const [
    selectedReader,
    setSelectedReader,
  ] = useState(null)
  const [
    searchingReaders,
    setSearchingReaders,
  ] = useState(false)
  const [scopeType, setScopeType] =
    useState('all_author')
  const [stories, setStories] =
    useState([])
  const [storiesLoading, setStoriesLoading] =
    useState(false)
  const [storyId, setStoryId] =
    useState('')
  const [duration, setDuration] =
    useState('24h')
  const [reason, setReason] =
    useState('')
  const [saving, setSaving] =
    useState(false)

  const resetForm = useCallback(() => {
    setReaderQuery('')
    setReaderResults([])
    setSelectedReader(null)
    setScopeType('all_author')
    setStoryId('')
    setDuration('24h')
    setReason('')
  }, [])

  useEffect(() => {
    if (!open) {
      window.clearTimeout(
        searchTimerRef.current
      )
      resetForm()
      return
    }

    const loadStories =
      async () => {
        try {
          setStoriesLoading(true)

          const data =
            await request(
              `${BLOCKED_READERS_PATH}/stories`
            )

          setStories(
            Array.isArray(
              data.stories
            )
              ? data.stories
              : []
          )
        } catch (error) {
          showToast(
            error.message ||
              'Failed to load stories.',
            'error'
          )
        } finally {
          setStoriesLoading(false)
        }
      }

    loadStories()
  }, [
    open,
    request,
    resetForm,
    showToast,
  ])

  useEffect(() => {
    if (!open) return

    window.clearTimeout(
      searchTimerRef.current
    )

    const query =
      readerQuery.trim()

    if (query.length < 2) {
      setReaderResults([])
      setSearchingReaders(false)
      return
    }

    searchTimerRef.current =
      window.setTimeout(
        async () => {
          try {
            setSearchingReaders(true)

            const params =
              new URLSearchParams({
                q: query,
              })
            const data =
              await request(
                `${BLOCKED_READERS_PATH}/search?${params.toString()}`
              )

            setReaderResults(
              Array.isArray(
                data.readers
              )
                ? data.readers
                : []
            )
          } catch (error) {
            showToast(
              error.message ||
                'Failed to search readers.',
              'error'
            )
          } finally {
            setSearchingReaders(false)
          }
        },
        320
      )

    return () => {
      window.clearTimeout(
        searchTimerRef.current
      )
    }
  }, [
    open,
    readerQuery,
    request,
    showToast,
  ])

  if (!open) return null

  const canSubmit =
    Boolean(selectedReader) &&
    Boolean(duration) &&
    (
      scopeType === 'all_author' ||
      Boolean(storyId)
    ) &&
    !saving

  const handleSubmit =
    async () => {
      if (!canSubmit) return

      try {
        setSaving(true)

        const data =
          await request(
            BLOCKED_READERS_PATH,
            {
              method: 'POST',
              body: JSON.stringify({
                reader_user_id:
                  selectedReader.id,
                scope_type:
                  scopeType,
                story_id:
                  scopeType === 'story'
                    ? storyId
                    : null,
                duration,
                reason:
                  reason.trim(),
              }),
            }
          )

        showToast(
          data.message ||
            'Reader blocked.'
        )
        onCreated()
        onClose()
      } catch (error) {
        showToast(
          error.message ||
            'Failed to block reader.',
          'error'
        )
      } finally {
        setSaving(false)
      }
    }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-black/35 px-3 pb-[calc(10px+env(safe-area-inset-bottom))]"
      role="presentation"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="block-reader-title"
        onClick={(event) =>
          event.stopPropagation()
        }
        className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[28px] bg-white shadow-[0_24px_80px_rgba(17,24,39,0.24)]"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eeeaf5] bg-white px-5 py-4">
          <div>
            <h2
              id="block-reader-title"
              className="text-[16px] font-black text-[#11152d]"
            >
              Block a Reader
            </h2>

            <p className="mt-1 text-[10.5px] font-medium text-[#858a9d]">
              Choose who, where and how long.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center text-[#111827] transition active:scale-95 active:opacity-60"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark text-[16px]" />
          </button>
        </header>

        <div className="space-y-5 p-4">
          <section>
            <label className="text-[12px] font-black text-[#22263d]">
              Search reader
            </label>

            <div className="relative mt-2">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[12px] text-[#9a9fb0]" />

              <input
                value={readerQuery}
                onChange={(event) => {
                  setReaderQuery(
                    event.target.value
                  )
                  setSelectedReader(null)
                }}
                placeholder="Name or username"
                className="h-12 w-full rounded-[17px] border border-[#e5e1ee] bg-white pl-10 pr-4 text-[12.5px] font-semibold text-[#11152d] outline-none transition placeholder:font-medium placeholder:text-[#9ca1b2] focus:border-[#7555f6] focus:ring-4 focus:ring-[#7555f6]/10"
              />
            </div>

            <div className="mt-2 space-y-2">
              {searchingReaders ? (
                <div className="rounded-[16px] bg-[#f8f6fc] px-4 py-3 text-center text-[11px] font-semibold text-[#858a9d]">
                  <i className="fa-solid fa-spinner mr-2 animate-spin" />
                  Searching readers...
                </div>
              ) : readerQuery.trim().length >= 2 &&
                !readerResults.length ? (
                <div className="rounded-[16px] bg-[#f8f6fc] px-4 py-3 text-center text-[11px] font-semibold text-[#858a9d]">
                  No readers found
                </div>
              ) : (
                readerResults.map(
                  (reader) => (
                    <ReaderResult
                      key={reader.id}
                      reader={reader}
                      selected={
                        selectedReader?.id ===
                        reader.id
                      }
                      onSelect={
                        setSelectedReader
                      }
                    />
                  )
                )
              )}
            </div>
          </section>

          <section>
            <div className="text-[12px] font-black text-[#22263d]">
              Block scope
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              {[
                {
                  value:
                    'all_author',
                  title:
                    'All my stories',
                  icon:
                    'fa-solid fa-layer-group',
                },
                {
                  value: 'story',
                  title:
                    'One story',
                  icon:
                    'fa-regular fa-bookmark',
                },
              ].map((option) => {
                const active =
                  scopeType ===
                  option.value

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setScopeType(
                        option.value
                      )

                      if (
                        option.value ===
                        'all_author'
                      ) {
                        setStoryId('')
                      }
                    }}
                    className={`rounded-[17px] border p-3 text-left transition active:scale-[0.99] ${
                      active
                        ? 'border-[#7555f6] bg-[#f7f4ff] ring-2 ring-[#7555f6]/10'
                        : 'border-[#e8e3ef] bg-white'
                    }`}
                  >
                    <i
                      className={`${option.icon} text-[13px] ${
                        active
                          ? 'text-[#7555f6]'
                          : 'text-[#858a9d]'
                      }`}
                    />

                    <div
                      className={`mt-2 text-[11.5px] font-extrabold ${
                        active
                          ? 'text-[#7047f5]'
                          : 'text-[#3b4055]'
                      }`}
                    >
                      {option.title}
                    </div>
                  </button>
                )
              })}
            </div>

            {scopeType === 'story' ? (
              <div className="relative mt-2">
                <select
                  value={storyId}
                  onChange={(event) =>
                    setStoryId(
                      event.target.value
                    )
                  }
                  disabled={
                    storiesLoading
                  }
                  className="h-12 w-full appearance-none rounded-[17px] border border-[#e5e1ee] bg-white pl-4 pr-10 text-[12px] font-bold text-[#30354b] outline-none transition focus:border-[#7555f6] focus:ring-4 focus:ring-[#7555f6]/10 disabled:opacity-55"
                >
                  <option value="">
                    {storiesLoading
                      ? 'Loading stories...'
                      : 'Choose a story'}
                  </option>

                  {stories.map(
                    (story) => (
                      <option
                        key={story.id}
                        value={story.id}
                      >
                        {story.title}
                      </option>
                    )
                  )}
                </select>

                <i className="fa-solid fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-[#858a9d]" />
              </div>
            ) : null}
          </section>

          <section>
            <label className="text-[12px] font-black text-[#22263d]">
              Duration
            </label>

            <div className="mt-2 grid grid-cols-3 gap-2">
              {DURATION_OPTIONS.map(
                (option) => {
                  const active =
                    duration ===
                    option.value

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setDuration(
                          option.value
                        )
                      }
                      className={`min-h-10 rounded-[14px] border px-2 text-[10.5px] font-extrabold transition active:scale-[0.98] ${
                        active
                          ? 'border-[#7555f6] bg-[#7555f6] text-white shadow-[0_7px_18px_rgba(117,85,246,0.22)]'
                          : 'border-[#e6e1ed] bg-white text-[#666c80]'
                      }`}
                    >
                      {option.label}
                    </button>
                  )
                }
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-black text-[#22263d]">
                Reason
              </label>

              <span className="text-[9.5px] font-semibold text-[#9a9fb0]">
                {reason.length}/300
              </span>
            </div>

            <textarea
              value={reason}
              onChange={(event) =>
                setReason(
                  event.target.value.slice(
                    0,
                    300
                  )
                )
              }
              placeholder="Optional reason for your records"
              rows={3}
              className="mt-2 w-full resize-none rounded-[17px] border border-[#e5e1ee] bg-white px-4 py-3 text-[12px] font-medium leading-5 text-[#11152d] outline-none transition placeholder:text-[#9ca1b2] focus:border-[#7555f6] focus:ring-4 focus:ring-[#7555f6]/10"
            />
          </section>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-[17px] bg-gradient-to-r from-[#7047f5] to-[#855dff] text-[12.5px] font-black text-white shadow-[0_10px_24px_rgba(112,71,245,0.24)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:from-[#d6d1df] disabled:to-[#d6d1df] disabled:shadow-none"
          >
            <i
              className={`fa-solid ${
                saving
                  ? 'fa-spinner animate-spin'
                  : 'fa-user-slash'
              } text-[12px]`}
            />

            Block Reader
          </button>
        </div>
      </section>
    </div>
  )
}

export default function AuthorBlockedReadersPage() {
  const navigate = useNavigate()
  const toastTimerRef =
    useRef(null)
  const searchTimerRef =
    useRef(null)
  const [status, setStatus] =
    useState('active')
  const [searchInput, setSearchInput] =
    useState('')
  const [search, setSearch] =
    useState('')
  const [page, setPage] =
    useState(1)
  const [loading, setLoading] =
    useState(true)
  const [blocks, setBlocks] =
    useState([])
  const [counts, setCounts] =
    useState({
      all: 0,
      active: 0,
      expired: 0,
    })
  const [total, setTotal] =
    useState(0)
  const [
    totalPages,
    setTotalPages,
  ] = useState(1)
  const [sheetOpen, setSheetOpen] =
    useState(false)
  const [deletingId, setDeletingId] =
    useState('')
  const [toast, setToast] =
    useState(null)

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
        }, 2400)
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

  const loadBlocks =
    useCallback(async () => {
      try {
        setLoading(true)

        const params =
          new URLSearchParams({
            status,
            search,
            page:
              String(page),
            limit: '10',
          })
        const data =
          await request(
            `${BLOCKED_READERS_PATH}?${params.toString()}`
          )

        setBlocks(
          Array.isArray(
            data.blocks
          )
            ? data.blocks
            : []
        )
        setCounts({
          all:
            Number(
              data.counts?.all || 0
            ),
          active:
            Number(
              data.counts?.active || 0
            ),
          expired:
            Number(
              data.counts?.expired || 0
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
          Number(data.page || 1) !==
          page
        ) {
          setPage(
            Number(data.page || 1)
          )
        }
      } catch (error) {
        showToast(
          error.message ||
            'Failed to load blocked readers.',
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
      status,
    ])

  useEffect(() => {
    loadBlocks()
  }, [loadBlocks])

  const handleUnblock =
    async (item) => {
      const approved =
        window.confirm(
          `Unblock ${
            item.reader?.name ||
            item.reader?.username ||
            'this reader'
          }?`
        )

      if (!approved) return

      try {
        setDeletingId(item.id)

        const data =
          await request(
            `${BLOCKED_READERS_PATH}/${encodeURIComponent(
              item.id
            )}`,
            {
              method: 'DELETE',
            }
          )

        showToast(
          data.message ||
            'Reader unblocked.'
        )
        await loadBlocks()
      } catch (error) {
        showToast(
          error.message ||
            'Failed to unblock reader.',
          'error'
        )
      } finally {
        setDeletingId('')
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
              Blocked Readers
            </h1>

            <p className="mt-0.5 truncate text-[10.5px] font-medium text-[#747a90]">
              Control who can comment on your stories
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setSheetOpen(true)
            }
            className="flex h-10 w-10 items-center justify-end text-[#7047f5] transition active:scale-95 active:opacity-60"
            aria-label="Block a reader"
          >
            <i className="fa-solid fa-user-plus text-[15px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-3.5 pt-4 sm:px-4">
        <section className="grid grid-cols-3 gap-2">
          {STATUS_OPTIONS.map(
            (option) => {
              const active =
                status ===
                option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setStatus(
                      option.value
                    )
                    setPage(1)
                  }}
                  className={`rounded-[18px] border bg-white px-2 py-3 text-center shadow-[0_7px_20px_rgba(61,45,115,0.05)] transition active:scale-[0.98] ${
                    active
                      ? 'border-[#7555f6] ring-2 ring-[#7555f6]/10'
                      : 'border-[#ebe7f2]'
                  }`}
                >
                  <div
                    className={`text-[18px] font-black ${
                      active
                        ? 'text-[#7047f5]'
                        : 'text-[#11152d]'
                    }`}
                  >
                    {counts[
                      option.value
                    ] || 0}
                  </div>

                  <div className="mt-0.5 text-[9.5px] font-extrabold text-[#858a9d]">
                    {option.label}
                  </div>
                </button>
              )
            }
          )}
        </section>

        <section className="mt-3 flex gap-2.5">
          <div className="relative min-w-0 flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[12px] text-[#9095a8]" />

            <input
              value={searchInput}
              onChange={(event) =>
                setSearchInput(
                  event.target.value
                )
              }
              placeholder="Search blocked readers..."
              className="h-12 w-full rounded-[18px] border border-[#e5e1ee] bg-white pl-10 pr-10 text-[12.5px] font-semibold text-[#11152d] shadow-[0_8px_24px_rgba(61,45,115,0.05)] outline-none transition placeholder:font-medium placeholder:text-[#9ca1b2] focus:border-[#7555f6] focus:ring-4 focus:ring-[#7555f6]/10"
            />

            {searchInput ? (
              <button
                type="button"
                onClick={() =>
                  setSearchInput('')
                }
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-[#9ca1b2] active:opacity-60"
                aria-label="Clear search"
              >
                <i className="fa-solid fa-xmark text-[12px]" />
              </button>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() =>
              setSheetOpen(true)
            }
            className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-[18px] bg-gradient-to-r from-[#7047f5] to-[#855dff] px-4 text-[11.5px] font-black text-white shadow-[0_9px_22px_rgba(112,71,245,0.22)] transition active:scale-[0.98]"
          >
            <i className="fa-solid fa-plus text-[11px]" />
            Block
          </button>
        </section>

        <section className="mt-4 flex items-center justify-between px-0.5">
          <div>
            <h2 className="text-[15px] font-black text-[#11152d]">
              {STATUS_OPTIONS.find(
                (item) =>
                  item.value ===
                  status
              )?.label ||
                'Blocked Readers'}
            </h2>

            <p className="mt-0.5 text-[10.5px] font-medium text-[#858a9d]">
              {total}{' '}
              {total === 1
                ? 'record'
                : 'records'}
            </p>
          </div>
        </section>

        <section className="mt-3">
          {loading ? (
            <LoadingCards />
          ) : blocks.length ? (
            <div className="space-y-3">
              {blocks.map((item) => (
                <BlockCard
                  key={item.id}
                  item={item}
                  deletingId={
                    deletingId
                  }
                  onUnblock={
                    handleUnblock
                  }
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[26px] border border-[#ebe7f2] bg-white px-5 py-12 text-center shadow-[0_12px_34px_rgba(61,45,115,0.06)]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[19px] bg-[#f1ebff] text-[#7047f5]">
                <i className="fa-solid fa-user-shield text-[20px]" />
              </div>

              <h3 className="mt-3 text-[14px] font-black text-[#171a31]">
                {search
                  ? 'No matching readers'
                  : status === 'active'
                    ? 'No active blocks'
                    : status === 'expired'
                      ? 'No expired blocks'
                      : 'No blocked readers'}
              </h3>

              <p className="mx-auto mt-1.5 max-w-[290px] text-[11.5px] font-medium leading-5 text-[#858a9d]">
                {search
                  ? 'Try another search term or clear your search.'
                  : 'Block a reader from all your stories or from one specific story.'}
              </p>

              {!search &&
              status === 'active' ? (
                <button
                  type="button"
                  onClick={() =>
                    setSheetOpen(true)
                  }
                  className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-[14px] bg-[#7555f6] px-4 text-[11.5px] font-black text-white shadow-[0_8px_20px_rgba(117,85,246,0.2)] transition active:scale-[0.98]"
                >
                  <i className="fa-solid fa-plus text-[10px]" />
                  Block a Reader
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
                setPage((current) =>
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

      <BlockReaderSheet
        open={sheetOpen}
        onClose={() =>
          setSheetOpen(false)
        }
        request={request}
        onCreated={
          loadBlocks
        }
        showToast={
          showToast
        }
      />

      {toast ? (
        <div className="fixed bottom-[calc(18px+env(safe-area-inset-bottom))] left-1/2 z-[150] w-[calc(100%-28px)] max-w-md -translate-x-1/2">
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
              className="flex h-8 w-8 shrink-0 items-center justify-center active:opacity-60"
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
