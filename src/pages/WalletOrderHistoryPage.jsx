import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const PAGE_SIZE = 20

const FILTER_TABS = [
  ['all', 'All'],
  ['success', 'Success'],
  ['waiting_payment', 'Waiting'],
  ['pending_review', 'Review'],
  ['rejected', 'Rejected'],
]

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function getHeaders() {
  const token = getReaderToken()
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString()
}

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`
}

function formatDateParts(value) {
  if (!value) return { date: '-', time: '' }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return { date: '-', time: '' }

  return {
    date: date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    time: date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    }),
  }
}

function FilterIcon({ type }) {
  if (type === 'success') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="m8.5 12 2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (type === 'waiting_payment') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 7.5V12l3 1.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (type === 'pending_review') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none" aria-hidden="true">
        <path d="M3.5 12s3.1-5 8.5-5 8.5 5 8.5 5-3.1 5-8.5 5-8.5-5-8.5-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="2.3" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    )
  }

  if (type === 'rejected') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="m9 9 6 6m0-6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none" aria-hidden="true">
      <path d="m5 8 7-3.5L19 8l-7 3.5L5 8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m5 12 7 3.5 7-3.5M5 16l7 3.5 7-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StatusBadge({ status }) {
  const value = String(status || '').toLowerCase()

  const config = {
    success: {
      label: 'Success',
      tone: 'bg-[#ECFDF3] text-[#16A34A] ring-[#BBF7D0]',
      icon: 'success',
    },
    waiting_payment: {
      label: 'Waiting',
      tone: 'bg-[#FFF8EB] text-[#E98200] ring-[#FED7AA]',
      icon: 'waiting_payment',
    },
    pending_review: {
      label: 'Review',
      tone: 'bg-[#EFF6FF] text-[#2563EB] ring-[#BFDBFE]',
      icon: 'pending_review',
    },
    expired: {
      label: 'Expired',
      tone: 'bg-[#FFF1F2] text-[#EF4444] ring-[#FECACA]',
      icon: 'rejected',
    },
    cancelled: {
      label: 'Cancelled',
      tone: 'bg-[#FFF1F2] text-[#EF4444] ring-[#FECACA]',
      icon: 'rejected',
    },
    rejected: {
      label: 'Rejected',
      tone: 'bg-[#FFF1F2] text-[#EF4444] ring-[#FECACA]',
      icon: 'rejected',
    },
  }

  const current = config[value] || {
    label: value || 'Unknown',
    tone: 'bg-[#F8FAFC] text-[#64748B] ring-[#E2E8F0]',
    icon: 'pending_review',
  }

  return (
    <span className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-[12px] font-bold ring-1 ${current.tone}`}>
      <FilterIcon type={current.icon} />
      {current.label}
    </span>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m15.5 15.5 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function SubmitFilterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none" aria-hidden="true">
      <path d="M4 5h16l-6.2 7.1v5.4l-3.6 1.8v-7.2L4 5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none" aria-hidden="true">
      <rect x="4" y="6" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 3.5V8M16 3.5V8M4 10h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none" aria-hidden="true">
      <path d="M12 3.5 19 6v5.3c0 4.3-2.7 7.7-7 9.2-4.3-1.5-7-4.9-7-9.2V6l7-2.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="m9.2 12 1.8 1.8 3.8-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function OrderCard({ item }) {
  const created = formatDateParts(item.created_at)
  const transactionId = item.aba_trx_id || item.aba_transaction_id || '-'

  return (
    <article className="rounded-[20px] border border-[#E7E9F0] bg-white p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#EAF5FF]">
          <img src="/assets/Icons/Diamond.svg" alt="" className="h-9 w-9 object-contain" />
        </span>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-[17px] font-bold leading-6 text-[#111827]">
                {formatNumber(item.diamonds)} Diamonds
              </h2>
              <p className="mt-0.5 text-[12px] font-normal text-[#667085]">
                {formatMoney(item.amount_usd)} <span className="px-1">·</span> Bonus {formatNumber(item.bonus_gems)} Gems
              </p>
            </div>

            <StatusBadge status={item.status} />
          </div>
        </div>
      </div>

      <div className="my-4 border-t border-dashed border-[#E4E7EC]" />

      <div className="grid grid-cols-[1.25fr_0.85fr_1fr] divide-x divide-[#E4E7EC]">
        <div className="min-w-0 pr-3">
          <p className="text-[11px] font-normal text-[#667085]">Order ID</p>
          <p className="mt-1 break-all text-[10px] font-medium leading-4 text-[#344054]">
            {item.order_id || '-'}
          </p>
        </div>

        <div className="min-w-0 px-3">
          <p className="text-[11px] font-normal text-[#667085]">Trx ID</p>
          <p className="mt-1 break-all text-[10px] font-medium leading-4 text-[#344054]">
            {transactionId}
          </p>
        </div>

        <div className="min-w-0 pl-3">
          <p className="flex items-center gap-1 text-[11px] font-normal text-[#98A2B3]">
            <CalendarIcon />
            Created
          </p>
          <p className="mt-1 text-[10px] font-medium leading-4 text-[#667085]">
            {created.date}
          </p>
          {created.time ? (
            <p className="text-[10px] font-medium leading-4 text-[#667085]">
              {created.time}
            </p>
          ) : null}
        </div>
      </div>

      {item.match_reason ? (
        <p className="mt-4 rounded-[12px] bg-[#F8FAFC] px-3 py-2 text-[11px] font-normal leading-5 text-[#667085]">
          {item.match_reason}
        </p>
      ) : null}
    </article>
  )
}

export default function WalletOrderHistoryPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)

  async function loadOrders(nextPage = page, nextStatus = status, nextSearch = search) {
    if (!getReaderToken()) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const params = new URLSearchParams({
        page: String(nextPage),
        limit: String(PAGE_SIZE),
        status: nextStatus,
        q: nextSearch,
      })

      const response = await fetch(`${API_BASE_URL}/api/purchase/requests?${params.toString()}`, {
        headers: getHeaders(),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data.ok) {
        throw new Error(data.message || 'Failed to load order history.')
      }

      setOrders(Array.isArray(data.purchases) ? data.purchases : [])
      setPage(Number(data.page || nextPage))
      setTotal(Number(data.total || 0))
      setTotalPages(Number(data.total_pages || 1))
      setHasNext(Boolean(data.has_next))
      setHasPrev(Boolean(data.has_prev))
    } catch (error) {
      setMessage(error.message || 'Failed to load order history.')
      setOrders([])
      setTotal(0)
      setTotalPages(1)
      setHasNext(false)
      setHasPrev(false)
    } finally {
      setLoading(false)
    }
  }

  function changeStatus(nextStatus) {
    setStatus(nextStatus)
    setPage(1)
    loadOrders(1, nextStatus, search)
  }

  function submitSearch(event) {
    event.preventDefault()
    const nextSearch = searchInput.trim()
    setSearch(nextSearch)
    setPage(1)
    loadOrders(1, status, nextSearch)
  }

  function clearSearch() {
    setSearchInput('')
    setSearch('')
    setPage(1)
    loadOrders(1, status, '')
  }

  function goPage(nextPage) {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages)
    setPage(safePage)
    loadOrders(safePage, status, search)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    loadOrders(1, 'all', '')
  }, [])

  return (
    <div className="min-h-screen bg-white pb-8">
      <header className="sticky top-0 z-40 border-b border-[#EEF0F4] bg-white">
        <div className="mx-auto flex h-14 max-w-[760px] items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full active:bg-[#F4F4F5]"
            aria-label="Go back"
          >
            <i className="fas fa-chevron-left text-[18px] text-[#111827]" />
          </button>

          <h1 className="text-[18px] font-bold tracking-tight text-[#111827]">
            Order History
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-4 pb-4 pt-5">
        <div className="mb-5 flex items-center gap-3 text-[#667085]">
          <span className="text-[#6366F1]">
            <ShieldIcon />
          </span>
          <p className="text-[13px] font-normal">
            View your past purchases and their current status.
          </p>
        </div>

        <section className="mb-5 grid grid-cols-5 rounded-[20px] border border-[#E7E9F0] bg-white p-2">
          {FILTER_TABS.map(([key, label]) => {
            const active = status === key
            const tone =
              key === 'success'
                ? 'text-[#22C55E]'
                : key === 'waiting_payment'
                  ? 'text-[#F59E0B]'
                  : key === 'pending_review'
                    ? 'text-[#3B82F6]'
                    : key === 'rejected'
                      ? 'text-[#EF4444]'
                      : 'text-[#6366F1]'

            return (
              <button
                key={key}
                type="button"
                onClick={() => changeStatus(key)}
                className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-[15px] px-1 py-2.5 active:scale-[0.98] ${
                  active ? 'bg-[#F0EEFF]' : 'bg-white'
                }`}
              >
                <span className={tone}>
                  <FilterIcon type={key} />
                </span>
                <span className={`text-[11px] font-medium ${active ? 'text-[#5B4FD8]' : 'text-[#667085]'}`}>
                  {label}
                </span>
              </button>
            )
          })}
        </section>

        <form onSubmit={submitSearch} className="mb-5 flex gap-2">
          <div className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-[16px] border border-[#E4E7EC] bg-white px-4 text-[#98A2B3]">
            <SearchIcon />
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by Order ID or Trx ID"
              className="min-w-0 flex-1 bg-transparent text-[13px] font-normal text-[#111827] outline-none placeholder:text-[#98A2B3]"
            />
            {searchInput ? (
              <button
                type="button"
                onClick={clearSearch}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F2F4F7] text-[#667085]"
                aria-label="Clear search"
              >
                <i className="fas fa-times text-[11px]" />
              </button>
            ) : null}
          </div>

          <button
            type="submit"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] border border-[#E4E7EC] bg-white text-[#344054] active:scale-[0.98]"
            aria-label="Search orders"
          >
            <SubmitFilterIcon />
          </button>
        </form>

        {message ? (
          <p className="mb-4 rounded-[16px] bg-[#FFF1F2] p-3 text-center text-[12px] font-medium text-[#DC2626]">
            {message}
          </p>
        ) : null}

        <div className="space-y-3">
          {loading ? (
            <p className="rounded-[20px] bg-[#F8FAFC] p-5 text-center text-[12px] font-medium text-[#667085]">
              Loading order history...
            </p>
          ) : orders.length ? (
            orders.map((item) => (
              <OrderCard key={item.id || item.order_id} item={item} />
            ))
          ) : (
            <p className="rounded-[20px] bg-[#F8FAFC] p-5 text-center text-[12px] font-medium text-[#667085]">
              No order history found.
            </p>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={!hasPrev || loading}
            onClick={() => goPage(page - 1)}
            className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#F5F3FF] text-[#6D28D9] disabled:opacity-35"
            aria-label="Previous page"
          >
            <i className="fas fa-chevron-left text-[13px]" />
          </button>

          <p className="text-[12px] font-medium text-[#667085]">
            Page {page} of {totalPages}
            {total ? ` · ${total} total` : ''}
          </p>

          <button
            type="button"
            disabled={!hasNext || loading}
            onClick={() => goPage(page + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#F5F3FF] text-[#6D28D9] disabled:opacity-35"
            aria-label="Next page"
          >
            <i className="fas fa-chevron-right text-[13px]" />
          </button>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-[#98A2B3]">
          <i className="fas fa-lock text-[10px]" />
          <p className="text-[11px] font-normal">
            History is kept for 1 year.
          </p>
        </div>
      </main>
    </div>
  )
}
