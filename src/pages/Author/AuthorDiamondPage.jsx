import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const CAMBODIA_OFFSET_MS = 7 * 60 * 60 * 1000

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'

  return number.toLocaleString('en-US', {
    maximumFractionDigits: 2,
  })
}

function formatMoney(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '$0.00'

  return number.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function getCambodiaDateKey(value = new Date()) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return new Date(date.getTime() + CAMBODIA_OFFSET_MS)
    .toISOString()
    .slice(0, 10)
}

function getCambodiaMonthKey(value = new Date()) {
  return getCambodiaDateKey(value).slice(0, 7)
}

function formatHistoryTime(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  const todayKey = getCambodiaDateKey()
  const itemKey = getCambodiaDateKey(date)
  const time = date.toLocaleTimeString('en-US', {
    timeZone: 'Asia/Phnom_Penh',
    hour: 'numeric',
    minute: '2-digit',
  })

  if (itemKey === todayKey) {
    return `Today, ${time}`
  }

  return date.toLocaleDateString('en-US', {
    timeZone: 'Asia/Phnom_Penh',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getInitial(value) {
  return String(value || 'R').trim().charAt(0).toUpperCase() || 'R'
}

function ReaderAvatar({ item }) {
  if (item.reader_avatar_url) {
    return (
      <img
        src={item.reader_avatar_url}
        alt=""
        className="h-11 w-11 shrink-0 rounded-full object-cover"
      />
    )
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eaf4ff] text-[15px] font-extrabold text-[#4386d8]">
      {getInitial(item.reader_name)}
    </div>
  )
}

function DiamondHistoryRow({ item }) {
  const isGift =
    item.earning_type === 'gift' ||
    item.source_type === 'diamond_gift'
  const quantity = Math.max(1, Number(item.gift_quantity || 1))
  const episodeText =
    Number(item.episode_number || 0) > 0
      ? `Episode ${item.episode_number}`
      : item.episode_title || 'Episode unlock'
  const sourceText = isGift
    ? quantity > 1
      ? `Gift · ${quantity} × ${item.gift_name || 'Diamond Gift'}`
      : `Gift · ${item.gift_name || 'Diamond Gift'}`
    : `Unlock · ${episodeText}`

  return (
    <div className="mx-2 mb-2 flex items-center gap-3 rounded-[14px] bg-[#f7fbff] px-3 py-3.5 last:mb-0">
      <ReaderAvatar item={item} />

      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[13px] font-extrabold text-[#111827]">
          {item.reader_name || 'Reader'}
        </div>

        <div className="mt-1 line-clamp-1 text-[11.5px] font-semibold text-[#4386d8]">
          {sourceText}
        </div>

        <div className="mt-1 line-clamp-1 text-[10.5px] font-medium text-[#98a2b3]">
          {item.story_title || 'Story'} · {formatHistoryTime(item.created_at)}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="flex items-center justify-end gap-1 text-[14px] font-extrabold text-[#111827]">
          <span>+{formatNumber(item.diamonds)}</span>
          <img
            src="/assets/Icons/Diamond.svg"
            alt=""
            className="h-4 w-4 object-contain"
          />
        </div>

        <div className="mt-1 text-[10.5px] font-semibold text-[#98a2b3]">
          {formatMoney(item.usd)}
        </div>
      </div>
    </div>
  )
}

function DiamondHintPopup({ open, onClose }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:px-4">
      <button
        type="button"
        aria-label="Close Diamond help"
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
      />

      <div className="relative w-full max-w-[420px] overflow-hidden rounded-t-[28px] bg-white p-5 shadow-2xl sm:rounded-[24px]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-[#eaf4ff] via-[#f6faff] to-[#fff8e8]" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eaf4ff] text-[#4386d8]">
              <i className="fa-solid fa-circle-info text-[17px]" />
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#111827] shadow-sm active:scale-95"
            >
              <i className="fa-solid fa-xmark text-[14px]" />
            </button>
          </div>

          <h2 className="mt-5 text-[18px] font-extrabold text-[#111827]">
            How Diamonds Work
          </h2>

          <p className="mt-2 text-[12.5px] font-medium leading-6 text-[#65758b]">
            Diamonds can come from paid episode unlocks and Diamond Gifts.
            Diamond Gifts go 100% to you. The USD amount is the equivalent
            value of the same earnings, not separate income. Coin Gifts are
            support only and do not add author earnings.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-5 h-11 w-full rounded-full bg-[#4386d8] text-[13px] font-extrabold text-white shadow-[0_12px_24px_rgba(67,134,216,0.22)] active:scale-[0.98]"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  )
}

function LoadingPage() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-[176px] rounded-[24px] bg-[#eaf3ff]" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-[92px] rounded-[18px] bg-white" />
        <div className="h-[92px] rounded-[18px] bg-white" />
      </div>
      <div className="h-[320px] rounded-[20px] bg-white" />
    </div>
  )
}

export default function AuthorDiamondPage() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [filter, setFilter] = useState('all')
  const [filterOpen, setFilterOpen] = useState(false)
  const [hintOpen, setHintOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    const controller = new AbortController()

    async function loadDiamonds() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login', { replace: true })
        return
      }

      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${API_BASE_URL}/api/authors/me/diamonds`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
            signal: controller.signal,
          }
        )

        const result = await response.json().catch(() => ({}))

        if (!response.ok || result.ok === false) {
          throw new Error(result.message || 'Failed to load Diamond history')
        }

        if (!ignore) {
          setData(result)
        }
      } catch (loadError) {
        if (
          loadError?.name !== 'AbortError' &&
          !ignore
        ) {
          setError(
            loadError.message === 'Failed to fetch'
              ? 'Cannot connect to backend.'
              : loadError.message || 'Failed to load Diamond history'
          )
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadDiamonds()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [navigate])

  useEffect(() => {
    if (!hintOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [hintOpen])

  const summary = data?.summary || {}
  const history = useMemo(
    () => (Array.isArray(data?.history) ? data.history : []),
    [data?.history]
  )

  const filteredHistory = useMemo(() => {
    if (filter === 'today') {
      const todayKey = getCambodiaDateKey()

      return history.filter(
        (item) => getCambodiaDateKey(item.created_at) === todayKey
      )
    }

    if (filter === 'month') {
      const monthKey = getCambodiaMonthKey()

      return history.filter(
        (item) => getCambodiaMonthKey(item.created_at) === monthKey
      )
    }

    return history
  }, [filter, history])

  const filterLabel =
    filter === 'today'
      ? 'Today'
      : filter === 'month'
        ? 'This Month'
        : 'All'

  return (
    <div
      className="min-h-screen pb-10"
      style={{
        backgroundColor: '#FAFAFA',
        backgroundImage:
          'linear-gradient(180deg, rgba(250,250,250,0) 0%, rgba(250,250,250,0.18) 38%, rgba(250,250,250,0.72) 76%, #FAFAFA 100%), linear-gradient(90deg, #EAF4FF 0%, #FFF8E8 100%)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 270px, 100% 270px',
      }}
    >
      <DiamondHintPopup
        open={hintOpen}
        onClose={() => setHintOpen(false)}
      />

      <header className="sticky top-0 z-40 bg-transparent">
        <div className="mx-auto flex h-[58px] max-w-[720px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate('/author/profile')}
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center text-[#111827] active:scale-95"
          >
            <i className="fa-solid fa-chevron-left text-[17px]" />
          </button>

          <h1 className="text-[17px] font-bold text-[#111827]">
            My Diamonds
          </h1>

          <button
            type="button"
            onClick={() => setHintOpen(true)}
            aria-label="Diamond help"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-black bg-transparent text-black active:scale-95"
          >
            <i className="fa-solid fa-question text-[13px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[720px] space-y-4 px-4 pt-4">
        {loading && !data ? <LoadingPage /> : null}

        {error ? (
          <div className="rounded-[18px] bg-[#fff1f1] px-4 py-4 text-center text-[12.5px] font-semibold text-[#e5484d] shadow-sm">
            {error}
          </div>
        ) : null}

        {data ? (
          <>
            <section className="overflow-hidden rounded-[24px] border border-[#edf0f4] bg-white px-5 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.045)]">
              <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#7b8ca5]">
                Diamond Today
              </div>

              <div className="mt-3 flex items-center gap-3">
                <img
                  src="/assets/Icons/Diamond.svg"
                  alt=""
                  className="h-10 w-10 object-contain"
                />

                <div className="text-[38px] font-extrabold leading-none tracking-[-0.04em] text-[#111827]">
                  {formatNumber(summary.today_diamonds)}
                </div>
              </div>

              <div className="mt-3 text-[12px] font-semibold text-[#5d7291]">
                {formatMoney(summary.today_usd)} earned today
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <div>
                  <div className="text-[10.5px] font-semibold text-[#7b8ca5]">
                    Paid unlocks today
                  </div>
                  <div className="mt-1 text-[16px] font-extrabold text-[#111827]">
                    {formatNumber(summary.today_unlocks)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/author/income')}
                  className="rounded-full bg-[#4386d8] px-4 py-2 text-[11.5px] font-extrabold text-white active:scale-[0.98]"
                >
                  View Income
                </button>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-3">
              <div className="rounded-[18px] border border-[#edf0f4] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                <div className="text-[10.5px] font-bold text-[#98a2b3]">
                  This Month
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <img
                    src="/assets/Icons/Diamond.svg"
                    alt=""
                    className="h-5 w-5 object-contain"
                  />
                  <span className="text-[20px] font-extrabold text-[#111827]">
                    {formatNumber(summary.this_month_diamonds)}
                  </span>
                </div>
              </div>

              <div className="rounded-[18px] border border-[#edf0f4] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                <div className="text-[10.5px] font-bold text-[#98a2b3]">
                  All Time
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <img
                    src="/assets/Icons/Diamond.svg"
                    alt=""
                    className="h-5 w-5 object-contain"
                  />
                  <span className="text-[20px] font-extrabold text-[#111827]">
                    {formatNumber(summary.all_time_diamonds)}
                  </span>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-[20px] border border-[#edf0f4] bg-white py-2 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <div>
                  <h2 className="text-[14px] font-extrabold text-[#111827]">
                    Diamond History
                  </h2>
                  <p className="mt-1 text-[10.5px] font-medium text-[#98a2b3]">
                    Readers who unlocked your episodes
                  </p>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setFilterOpen((value) => !value)}
                    className="flex h-9 items-center gap-2 rounded-full bg-[#f3f7fb] px-3 text-[11px] font-extrabold text-[#111827] active:scale-95"
                  >
                    {filterLabel}
                    <i className="fa-solid fa-chevron-down text-[9px] text-[#98a2b3]" />
                  </button>

                  {filterOpen ? (
                    <>
                      <button
                        type="button"
                        aria-label="Close filter"
                        onClick={() => setFilterOpen(false)}
                        className="fixed inset-0 z-40"
                      />

                      <div className="absolute right-0 top-11 z-50 w-36 overflow-hidden rounded-[15px] bg-white p-1.5 shadow-xl">
                        {[
                          ['all', 'All'],
                          ['today', 'Today'],
                          ['month', 'This Month'],
                        ].map(([value, label]) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => {
                              setFilter(value)
                              setFilterOpen(false)
                            }}
                            className={`flex w-full items-center justify-between rounded-[11px] px-3 py-2.5 text-left text-[11.5px] font-bold ${
                              filter === value
                                ? 'bg-[#eaf4ff] text-[#4386d8]'
                                : 'text-[#111827]'
                            }`}
                          >
                            {label}
                            {filter === value ? (
                              <i className="fa-solid fa-check text-[10px]" />
                            ) : null}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              {filteredHistory.length ? (
                filteredHistory.map((item) => (
                  <DiamondHistoryRow
                    key={item.id}
                    item={item}
                  />
                ))
              ) : (
                <div className="px-5 py-14 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf4ff]">
                    <img
                      src="/assets/Icons/Diamond.svg"
                      alt=""
                      className="h-7 w-7 object-contain"
                    />
                  </div>

                  <div className="mt-4 text-[14px] font-extrabold text-[#111827]">
                    No Diamond history found
                  </div>

                  <div className="mx-auto mt-2 max-w-[270px] text-[11.5px] font-medium leading-5 text-[#98a2b3]">
                    Diamonds earned from paid episode unlocks will appear here.
                  </div>
                </div>
              )}

              {data.has_more ? (
                <div className="px-4 py-3 text-center text-[10.5px] font-semibold text-[#98a2b3]">
                  Latest 100 records are shown
                </div>
              ) : null}
            </section>
          </>
        ) : null}
      </main>
    </div>
  )
}
