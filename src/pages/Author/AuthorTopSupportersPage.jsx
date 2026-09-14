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

function monthLabel() {
  const date = new Date(Date.now() + CAMBODIA_OFFSET_MS)

  return date.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'long',
    year: 'numeric',
  })
}

function numberText(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'

  return number.toLocaleString('en-US', {
    maximumFractionDigits: 2,
  })
}

function money(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '$0.00'

  return number.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function dateText(value) {
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

function initial(value) {
  return String(value || 'R')
    .trim()
    .slice(0, 1)
    .toUpperCase() || 'R'
}

function SupporterAvatar({ item }) {
  if (item.reader_avatar_url) {
    return (
      <img
        src={item.reader_avatar_url}
        alt=""
        className="h-12 w-12 shrink-0 rounded-full object-cover"
      />
    )
  }

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ffe8f1] text-[15px] font-black text-[#bd557e]">
      {initial(item.reader_name)}
    </div>
  )
}

function SupporterRow({ item }) {
  return (
    <article className="flex gap-3 border-b border-[#f0edf4] px-4 py-4 last:border-b-0">
      <div className="flex w-8 shrink-0 items-start justify-center pt-2">
        <span className="text-[13px] font-black text-[#7651ad]">
          #{item.rank}
        </span>
      </div>

      <SupporterAvatar item={item} />

      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[13px] font-black text-[var(--shadow-text-primary)]">
          {item.reader_name || 'Reader'}
        </div>

        {item.reader_username ? (
          <div className="mt-1 line-clamp-1 text-[10px] font-semibold text-[var(--shadow-text-tertiary)]">
            @{item.reader_username}
          </div>
        ) : null}

        <div className="mt-1.5 text-[10px] font-semibold text-[var(--shadow-text-secondary)]">
          {numberText(item.unlock_count)} paid unlocks
        </div>

        <div className="mt-1 text-[9.5px] font-semibold text-[var(--shadow-text-tertiary)]">
          Latest {dateText(item.latest_support_at)}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="flex items-center justify-end gap-1 text-[14px] font-black text-[#7651ad]">
          <img
            src="/assets/Icons/Diamond.svg"
            alt=""
            className="h-4 w-4 object-contain"
          />
          <span>{numberText(item.total_paid_diamonds)}</span>
        </div>

        <div className="mt-1 text-[10px] font-bold text-[#b9517b]">
          Author {money(item.total_author_usd)}
        </div>
      </div>
    </article>
  )
}

function LoadingRows() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-[78px] animate-pulse rounded-[18px] bg-[#f3eff7]"
        />
      ))}
    </div>
  )
}

export default function AuthorTopSupportersPage() {
  const navigate = useNavigate()
  const currentMonth = useMemo(() => monthLabel(), [])

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
          page: String(page),
          limit: String(PAGE_SIZE),
        })

        const response = await fetch(
          `${API_BASE_URL}/api/authors/me/top-supporters?${params.toString()}`,
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
            result.message || 'Failed to load top supporters'
          )
        }

        setData(result)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setMessage(
            error.message || 'Failed to load top supporters'
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
  }, [navigate, page])

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
              Top Supporters
            </h1>
            <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.09em] text-[var(--shadow-text-tertiary)]">
              {currentMonth}
            </p>
          </div>

          <div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-[720px] space-y-4 px-3 pt-4 sm:px-4">
        <section className="rounded-[24px] border border-[#efcbd9] bg-[linear-gradient(145deg,#fff7fa_0%,#fff_100%)] p-4 shadow-[0_9px_24px_rgba(85,59,117,0.06)]">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[17px] bg-[#ffe4ef] text-[#d56894]">
              <i className="fa-solid fa-heart text-[15px]" />
            </span>

            <div>
              <h2 className="text-[15px] font-black text-[var(--shadow-text-primary)]">
                Monthly supporter ranking
              </h2>
              <p className="mt-1 text-[10.5px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
                Ranked by total paid Diamonds used to unlock your stories this month.
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-2">
          <div className="rounded-[20px] border border-[#eadfef] bg-[var(--shadow-bg-surface)] p-3">
            <div className="text-[8.5px] font-black uppercase tracking-[0.07em] text-[var(--shadow-text-tertiary)]">
              Supporters
            </div>
            <div className="mt-2 text-[17px] font-black text-[#31263d]">
              {numberText(summary.total_supporters)}
            </div>
          </div>

          <div className="rounded-[20px] border border-[#eadfef] bg-[var(--shadow-bg-surface)] p-3">
            <div className="text-[8.5px] font-black uppercase tracking-[0.07em] text-[var(--shadow-text-tertiary)]">
              Paid Diamonds
            </div>
            <div className="mt-2 text-[17px] font-black text-[#7651ad]">
              {numberText(summary.total_paid_diamonds)}
            </div>
          </div>

          <div className="rounded-[20px] border border-[#eadfef] bg-[var(--shadow-bg-surface)] p-3">
            <div className="text-[8.5px] font-black uppercase tracking-[0.07em] text-[var(--shadow-text-tertiary)]">
              Unlocks
            </div>
            <div className="mt-2 text-[17px] font-black text-[#b9517b]">
              {numberText(summary.total_unlocks)}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[24px] border border-[#e0d4eb] bg-[var(--shadow-bg-surface)] shadow-[0_9px_24px_rgba(85,59,117,0.06)]">
          <div className="flex items-center justify-between gap-3 border-b border-[#eee8f3] px-4 py-4">
            <div>
              <h2 className="text-[14px] font-black text-[var(--shadow-text-primary)]">
                All Supporters
              </h2>
              <p className="mt-1 text-[10px] font-semibold text-[var(--shadow-text-tertiary)]">
                Highest paid Diamonds first
              </p>
            </div>

            <span className="rounded-full bg-[#fff0f5] px-3 py-1.5 text-[9px] font-black text-[#bd557e]">
              {numberText(pagination.total)} readers
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
              <SupporterRow key={item.reader_id} item={item} />
            ))
          ) : (
            <div className="px-5 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ffe8f1] text-[#d56894]">
                <i className="fa-solid fa-users" />
              </div>
              <div className="mt-4 text-[14px] font-black text-[var(--shadow-text-primary)]">
                No supporters this month
              </div>
              <div className="mx-auto mt-2 max-w-[290px] text-[11px] font-medium leading-5 text-[var(--shadow-text-tertiary)]">
                Readers will appear here after they use paid Diamonds to unlock your stories.
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
      </main>
    </div>
  )
}
