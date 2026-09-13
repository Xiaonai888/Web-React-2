import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const CAMBODIA_OFFSET_MS = 7 * 60 * 60 * 1000
const PAGE_SIZE = 20

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function cambodiaDateValue(offsetDays = 0) {
  const local = new Date(Date.now() + CAMBODIA_OFFSET_MS)

  local.setUTCDate(local.getUTCDate() + offsetDays)

  return [
    local.getUTCFullYear(),
    String(local.getUTCMonth() + 1).padStart(2, '0'),
    String(local.getUTCDate()).padStart(2, '0'),
  ].join('-')
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

function formatNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'

  return number.toLocaleString('en-US', {
    maximumFractionDigits: 2,
  })
}

function formatDateTime(value) {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '-'

  return date.toLocaleString('en-US', {
    timeZone: 'Asia/Phnom_Penh',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function getInitial(value) {
  return String(value || 'R').slice(0, 1).toUpperCase()
}

function RangeButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 rounded-full px-3 text-[11px] font-black transition active:scale-[0.98] ${
        active
          ? 'bg-[#7651ad] text-white'
          : 'border border-[#ddd1ec] bg-white text-[#7651ad]'
      }`}
    >
      {children}
    </button>
  )
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
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1e9fb] text-[14px] font-black text-[#7651ad]">
      {getInitial(item.reader_name)}
    </div>
  )
}

function EarningRow({ item }) {
  const episode =
    Number(item.episode_number || 0) > 0
      ? `Episode ${item.episode_number}`
      : item.episode_title || 'Episode unlock'

  return (
    <article className="flex gap-3 border-b border-[#f0edf4] px-4 py-4 last:border-b-0">
      <ReaderAvatar item={item} />

      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[13px] font-black text-[var(--shadow-text-primary)]">
          {item.reader_name || 'Reader'}
        </div>

        <div className="mt-1 line-clamp-1 text-[11px] font-semibold text-[var(--shadow-text-secondary)]">
          {episode}
        </div>

        <div className="mt-1 line-clamp-1 text-[10.5px] font-semibold text-[#b4517b]">
          {item.story_title || 'Story'}
        </div>

        <div className="mt-1.5 text-[10px] font-semibold text-[var(--shadow-text-tertiary)]">
          {formatDateTime(item.created_at)}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="text-[14px] font-black text-[#b9517b]">
          +{formatMoney(item.author_net_payout_usd)}
        </div>

        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] font-bold text-[#8e7f98]">
          <img
            src="/assets/Icons/Diamond.svg"
            alt=""
            className="h-3.5 w-3.5 object-contain"
          />
          <span>{formatNumber(item.author_earned_diamonds)}</span>
        </div>
      </div>
    </article>
  )
}

function LoadingRows() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="h-[72px] animate-pulse rounded-[18px] bg-[#f3eff7]"
        />
      ))}
    </div>
  )
}

export default function AuthorRecentEarningsPage() {
  const navigate = useNavigate()
  const minDate = useMemo(() => cambodiaDateValue(-29), [])
  const maxDate = useMemo(() => cambodiaDateValue(0), [])

  const [filter, setFilter] = useState({
    range: 'last30',
    from: '',
    to: '',
  })
  const [draftFrom, setDraftFrom] = useState(minDate)
  const [draftTo, setDraftTo] = useState(maxDate)
  const [customOpen, setCustomOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const items = Array.isArray(data?.items) ? data.items : []
  const summary = data?.summary || {}
  const pagination = data?.pagination || {}

  useEffect(() => {
    const token = getAuthToken()

    if (!token) {
      navigate('/login', { replace: true })
      return undefined
    }

    const controller = new AbortController()

    async function load() {
      try {
        setLoading(true)
        setMessage('')

        const params = new URLSearchParams({
          range: filter.range,
          page: String(page),
          limit: String(PAGE_SIZE),
        })

        if (filter.range === 'custom') {
          params.set('from', filter.from)
          params.set('to', filter.to)
        }

        const response = await fetch(
          `${API_BASE_URL}/api/authors/me/recent-earnings?${params.toString()}`,
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
          throw new Error(
            result.message || 'Failed to load recent earnings'
          )
        }

        setData(result)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setMessage(
            error.message || 'Failed to load recent earnings'
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    load()

    return () => controller.abort()
  }, [filter, navigate, page])

  function selectRange(range) {
    setCustomOpen(false)
    setPage(1)
    setFilter({
      range,
      from: '',
      to: '',
    })
  }

  function applyCustom() {
    if (
      !draftFrom ||
      !draftTo ||
      draftFrom < minDate ||
      draftTo > maxDate ||
      draftFrom > draftTo
    ) {
      setMessage(
        'Choose a valid date range inside the latest 30 days.'
      )
      return
    }

    setMessage('')
    setPage(1)
    setCustomOpen(false)
    setFilter({
      range: 'custom',
      from: draftFrom,
      to: draftTo,
    })
  }

  const filterLabel =
    filter.range === 'today'
      ? 'Today'
      : filter.range === 'last7'
        ? 'Last 7 Days'
        : filter.range === 'custom'
          ? `${filter.from} → ${filter.to}`
          : 'Last 30 Days'

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-10">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
        <div className="mx-auto flex h-[62px] max-w-[720px] items-center justify-between px-3">
          <button
            type="button"
            onClick={() => navigate('/author/income')}
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#7651ad] active:scale-95"
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="text-center">
            <h1 className="text-[17px] font-black text-[var(--shadow-text-primary)]">
              Recent Earnings
            </h1>
            <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.09em] text-[var(--shadow-text-tertiary)]">
              Latest 30 days
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/author/earnings')}
            aria-label="Income history"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#7651ad] active:scale-95"
          >
            <i className="fa-solid fa-clock-rotate-left text-[14px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[720px] space-y-4 px-3 pt-4 sm:px-4">
        <section className="rounded-[24px] border border-[#d9cae8] bg-[var(--shadow-bg-surface)] p-3 shadow-[0_9px_24px_rgba(85,59,117,0.06)]">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <RangeButton
              active={filter.range === 'today' && !customOpen}
              onClick={() => selectRange('today')}
            >
              Today
            </RangeButton>

            <RangeButton
              active={filter.range === 'last7' && !customOpen}
              onClick={() => selectRange('last7')}
            >
              Last 7 Days
            </RangeButton>

            <RangeButton
              active={filter.range === 'last30' && !customOpen}
              onClick={() => selectRange('last30')}
            >
              Last 30 Days
            </RangeButton>

            <RangeButton
              active={filter.range === 'custom' || customOpen}
              onClick={() => setCustomOpen(true)}
            >
              Custom
            </RangeButton>
          </div>

          {customOpen ? (
            <div className="mt-3 rounded-[20px] border border-[#eadff3] bg-[#faf7fd] p-3">
              <div className="grid grid-cols-2 gap-2">
                <label className="min-w-0">
                  <span className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.08em] text-[#8e7f98]">
                    Start
                  </span>
                  <input
                    type="date"
                    min={minDate}
                    max={maxDate}
                    value={draftFrom}
                    onChange={(event) =>
                      setDraftFrom(event.target.value)
                    }
                    className="h-11 w-full min-w-0 rounded-[14px] border border-[#ddd1ec] bg-white px-2 text-[12px] font-bold text-[#31263d] outline-none focus:border-[#9d7ac1]"
                  />
                </label>

                <label className="min-w-0">
                  <span className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.08em] text-[#8e7f98]">
                    End
                  </span>
                  <input
                    type="date"
                    min={minDate}
                    max={maxDate}
                    value={draftTo}
                    onChange={(event) =>
                      setDraftTo(event.target.value)
                    }
                    className="h-11 w-full min-w-0 rounded-[14px] border border-[#ddd1ec] bg-white px-2 text-[12px] font-bold text-[#31263d] outline-none focus:border-[#9d7ac1]"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={applyCustom}
                className="mt-3 h-11 w-full rounded-full bg-[#7651ad] text-[12px] font-black text-white active:scale-[0.99]"
              >
                Apply Custom Range
              </button>
            </div>
          ) : null}
        </section>

        <section className="grid grid-cols-3 gap-2">
          <div className="rounded-[20px] border border-[#e2d7ed] bg-[var(--shadow-bg-surface)] p-3">
            <div className="text-[8.5px] font-black uppercase tracking-[0.07em] text-[var(--shadow-text-tertiary)]">
              Earned
            </div>
            <div className="mt-2 text-[17px] font-black text-[#b9517b]">
              {formatMoney(summary.total_author_usd)}
            </div>
          </div>

          <div className="rounded-[20px] border border-[#e2d7ed] bg-[var(--shadow-bg-surface)] p-3">
            <div className="text-[8.5px] font-black uppercase tracking-[0.07em] text-[var(--shadow-text-tertiary)]">
              Diamonds
            </div>
            <div className="mt-2 text-[17px] font-black text-[#7651ad]">
              {formatNumber(summary.total_author_diamonds)}
            </div>
          </div>

          <div className="rounded-[20px] border border-[#e2d7ed] bg-[var(--shadow-bg-surface)] p-3">
            <div className="text-[8.5px] font-black uppercase tracking-[0.07em] text-[var(--shadow-text-tertiary)]">
              Unlocks
            </div>
            <div className="mt-2 text-[17px] font-black text-[#31263d]">
              {formatNumber(summary.total_transactions)}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[24px] border border-[#d9cae8] bg-[var(--shadow-bg-surface)] shadow-[0_9px_24px_rgba(85,59,117,0.06)]">
          <div className="flex items-center justify-between gap-3 border-b border-[#eee8f3] px-4 py-4">
            <div>
              <h2 className="text-[14px] font-black text-[var(--shadow-text-primary)]">
                {filterLabel}
              </h2>
              <p className="mt-1 text-[10px] font-semibold text-[var(--shadow-text-tertiary)]">
                Newest earnings first
              </p>
            </div>

            <span className="rounded-full bg-[#f4eef9] px-3 py-1.5 text-[9px] font-black text-[#7651ad]">
              {formatNumber(pagination.total)} records
            </span>
          </div>

          {message ? (
            <div className="m-4 rounded-[16px] border border-[#efccd8] bg-[#fff4f7] px-4 py-3 text-[11px] font-semibold text-[#b44d76]">
              {message}
            </div>
          ) : null}

          {loading ? (
            <LoadingRows />
          ) : items.length ? (
            items.map((item) => (
              <EarningRow key={item.id} item={item} />
            ))
          ) : (
            <div className="px-5 py-14 text-center">
              <img
                src="/assets/Icons/Diamond.svg"
                alt=""
                className="mx-auto h-7 w-7 object-contain"
              />
              <div className="mt-4 text-[14px] font-black text-[var(--shadow-text-primary)]">
                No recent earnings
              </div>
              <div className="mx-auto mt-2 max-w-[270px] text-[11px] font-medium leading-5 text-[var(--shadow-text-tertiary)]">
                Paid Diamond unlocks in this recent period will appear here.
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 border-t border-[#eee8f3] px-4 py-3">
            <button
              type="button"
              disabled={loading || !pagination.has_prev}
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
              }
              className="h-10 rounded-full border border-[#ddd1ec] bg-white px-4 text-[11px] font-black text-[#7651ad] disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-[10.5px] font-bold text-[var(--shadow-text-tertiary)]">
              Page {pagination.page || 1} of {pagination.total_pages || 0}
            </span>

            <button
              type="button"
              disabled={loading || !pagination.has_next}
              onClick={() => setPage((current) => current + 1)}
              className="h-10 rounded-full border border-[#ddd1ec] bg-white px-4 text-[11px] font-black text-[#7651ad] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </section>

        <button
          type="button"
          onClick={() => navigate('/author/earnings')}
          className="w-full rounded-[18px] border border-[#ead69c] bg-[#fff8e7] px-4 py-3 text-left text-[10.5px] font-semibold leading-5 text-[#9a6b12]"
        >
          Recent Earnings only shows the latest 30 days. Tap here for older Income History.
        </button>
      </main>
    </div>
  )
}
