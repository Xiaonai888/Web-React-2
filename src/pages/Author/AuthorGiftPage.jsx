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

function getCambodiaMonthKey(value = new Date()) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return new Date(date.getTime() + CAMBODIA_OFFSET_MS)
    .toISOString()
    .slice(0, 7)
}

function formatHistoryTime(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString('en-US', {
    timeZone: 'Asia/Phnom_Penh',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function normalizeImageUrl(value) {
  const url = String(value || '').trim()

  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith('/')) return url

  return `/${url}`
}

function GiftArtwork({ item }) {
  const imageUrl = normalizeImageUrl(item.gift_image_path)

  if (imageUrl) {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden">
        <img
          src={imageUrl}
          alt=""
          className="h-full w-full object-contain p-1"
        />
      </div>
    )
  }

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center text-[#ff3b5f]">
      <i className="fa-solid fa-gift text-[18px]" />
    </div>
  )
}

function GiftHistoryRow({ item }) {
  const quantity = Math.max(1, Number(item.quantity || 1))
  const supportPoints = Number(item.support_points || 0) * quantity

  return (
    <div className="flex items-center gap-3 border-b border-[#edf0f4] px-1 py-3.5 last:border-b-0">
      <GiftArtwork item={item} />

      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[13px] font-bold text-[#111827]">
          {item.reader_name || 'Reader'}
        </div>

        <div className="mt-1 line-clamp-1 text-[11.5px] font-medium text-[#ff3b5f]">
          Sent {quantity} × {item.gift_name || 'Gift'}
        </div>

        <div className="mt-1 line-clamp-1 text-[10.5px] font-normal text-[#98a2b3]">
          {item.story_title || 'Story'} · {formatHistoryTime(item.created_at)}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="text-[13.5px] font-bold text-[#111827]">
          +{quantity}
        </div>

        <div className="mt-1 text-[10.5px] font-normal text-[#98a2b3]">
          {formatNumber(supportPoints)} pts
        </div>
      </div>
    </div>
  )
}

function GiftHintPopup({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined

    const scrollY = window.scrollY
    const body = document.body
    const root = document.documentElement
    const previousBodyOverflow = body.style.overflow
    const previousBodyPosition = body.style.position
    const previousBodyTop = body.style.top
    const previousBodyWidth = body.style.width
    const previousRootOverflow = root.style.overflow

    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    root.style.overflow = 'hidden'

    return () => {
      body.style.overflow = previousBodyOverflow
      body.style.position = previousBodyPosition
      body.style.top = previousBodyTop
      body.style.width = previousBodyWidth
      root.style.overflow = previousRootOverflow
      window.scrollTo(0, scrollY)
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gift-help-title"
    >
      <button
        type="button"
        aria-label="Close Gift help"
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
      />

      <div className="relative w-full max-w-[420px] overflow-hidden rounded-t-[28px] bg-white p-5 shadow-2xl sm:rounded-[24px]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-[#fff1f5] via-[#fff7f8] to-[#fff8e8]" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff1f5] text-[#ff3b5f]">
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

          <h2
            id="gift-help-title"
            className="mt-5 text-[18px] font-bold text-[#111827]"
          >
            How Gifts Work
          </h2>

          <p className="mt-2 text-[12.5px] font-normal leading-6 text-[#65758b]">
            Readers can send gifts to support your stories. Every gift,
            sender, story and support point is saved in your Gift history.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-5 h-11 w-full rounded-full bg-[#ff3b5f] text-[13px] font-bold text-white active:scale-[0.98]"
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
      <div className="h-[176px] rounded-[24px] bg-white" />

      <div className="grid grid-cols-2 gap-3">
        <div className="h-[92px] rounded-[18px] bg-white" />
        <div className="h-[92px] rounded-[18px] bg-white" />
      </div>

      <div className="h-[320px] bg-white" />
    </div>
  )
}

export default function AuthorGiftPage() {
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

    async function loadGifts() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login', { replace: true })
        return
      }

      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${API_BASE_URL}/api/authors/me/gifts`,
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
          throw new Error(result.message || 'Failed to load Gift history')
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
              : loadError.message || 'Failed to load Gift history'
          )
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadGifts()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [navigate])

  const summary = data?.summary || {}

  const history = useMemo(
    () => (Array.isArray(data?.history) ? data.history : []),
    [data?.history]
  )

  const filteredHistory = useMemo(() => {
    if (filter !== 'month') return history

    const monthKey = getCambodiaMonthKey()

    return history.filter(
      (item) => getCambodiaMonthKey(item.created_at) === monthKey
    )
  }, [filter, history])

  const filterLabel = filter === 'month' ? 'This Month' : 'All'

  return (
    <div
      className="min-h-screen pb-10"
      style={{
        backgroundColor: '#FAFAFA',
        backgroundImage:
          'linear-gradient(180deg, rgba(250,250,250,0) 0%, rgba(250,250,250,0.18) 38%, rgba(250,250,250,0.72) 76%, #FAFAFA 100%), linear-gradient(90deg, #FFF1F5 0%, #FFF8E8 100%)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 270px, 100% 270px',
      }}
    >
      <GiftHintPopup
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
            My Gifts
          </h1>

          <button
            type="button"
            onClick={() => setHintOpen(true)}
            aria-label="Gift help"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-black bg-transparent text-black active:scale-95"
          >
            <i className="fa-solid fa-question text-[11px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[720px] space-y-4 px-4 pt-4">
        {loading && !data ? <LoadingPage /> : null}

        {error ? (
          <div className="rounded-[18px] bg-[#fff1f1] px-4 py-4 text-center text-[12.5px] font-medium text-[#e5484d]">
            {error}
          </div>
        ) : null}

        {data ? (
          <>
            <section className="overflow-hidden rounded-[24px] border border-[#edf0f4] bg-white px-5 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
              <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#9b7180]">
                Total Gifts Received
              </div>

              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center text-[#ff3b5f]">
                  <i className="fa-solid fa-gift text-[20px]" />
                </div>

                <div className="text-[38px] font-bold leading-none tracking-[-0.04em] text-[#111827]">
                  {formatNumber(summary.total_gifts)}
                </div>
              </div>

              <div className="mt-3 text-[12px] font-normal text-[#8b6471]">
                Gifts sent by readers across all your stories
              </div>

              <div className="mt-5 h-px bg-[#edf0f4]" />

              <div className="mt-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-[10.5px] font-normal text-[#9b7180]">
                    Total support points
                  </div>

                  <div className="mt-1 text-[16px] font-bold text-[#111827]">
                    {formatNumber(summary.total_support_points)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setFilter('month')}
                  className="rounded-full bg-[#ff3b5f] px-4 py-2 text-[11.5px] font-bold text-white active:scale-[0.98]"
                >
                  View This Month
                </button>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-3">
              <div className="rounded-[18px] border border-[#edf0f4] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                <div className="text-[10.5px] font-normal text-[#98a2b3]">
                  This Month
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <i className="fa-solid fa-gift text-[17px] text-[#111827]" />

                  <span className="text-[20px] font-bold text-[#ff3b5f]">
                    {formatNumber(summary.this_month_gifts)}
                  </span>
                </div>
              </div>

              <div className="rounded-[18px] border border-[#edf0f4] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                <div className="text-[10.5px] font-normal text-[#98a2b3]">
                  Unique Senders
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <i className="fa-solid fa-user-group text-[16px] text-[#111827]" />

                  <span className="text-[20px] font-bold text-[#ff3b5f]">
                    {formatNumber(summary.unique_senders)}
                  </span>
                </div>
              </div>
            </section>

            <section className="overflow-visible rounded-[20px] border border-[#edf0f4] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between gap-4 border-b border-[#edf0f4] pb-4">
                <div>
                  <h2 className="text-[14px] font-bold text-[#111827]">
                    Gift History
                  </h2>

                  <p className="mt-1 text-[10.5px] font-normal text-[#98a2b3]">
                    Gifts received from your readers
                  </p>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setFilterOpen((value) => !value)}
                    className="flex h-9 items-center gap-2 rounded-full bg-white px-3 text-[11px] font-bold text-[#111827] shadow-[0_4px_14px_rgba(15,23,42,0.04)] active:scale-95"
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

                      <div className="absolute right-0 top-11 z-50 w-36 overflow-hidden rounded-[15px] bg-white p-1.5 shadow-xl ring-1 ring-black/[0.06]">
                        {[
                          ['all', 'All'],
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
                                ? 'bg-[#fff1f5] text-[#ff3b5f]'
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
                  <GiftHistoryRow
                    key={item.id}
                    item={item}
                  />
                ))
              ) : (
                <div className="px-5 py-14 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center text-[#ff3b5f]">
                    <i className="fa-solid fa-gift text-[23px]" />
                  </div>

                  <div className="mt-4 text-[14px] font-bold text-[#111827]">
                    No Gift history found
                  </div>

                  <div className="mx-auto mt-2 max-w-[270px] text-[11.5px] font-normal leading-5 text-[#98a2b3]">
                    Gifts sent by readers will appear here.
                  </div>
                </div>
              )}

              {data.has_more ? (
                <div className="border-t border-[#edf0f4] py-3 text-center text-[10.5px] font-normal text-[#98a2b3]">
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
