import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const statusTabs = [
  { key: 'all', label: 'All' },
  { key: 'waiting_payment', label: 'Waiting' },
  { key: 'under_review', label: 'Review' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
]

function getReaderToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function formatUsd(value) {
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return '$0.00'
  return `$${number.toFixed(2)}`
}

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleString()
}

function statusText(status) {
  return String(status || '').replace(/_/g, ' ')
}

function statusClass(status) {
  if (status === 'completed') return 'bg-[#dcfce7] text-[#166534] dark:bg-emerald-500/15 dark:text-emerald-300'
  if (status === 'shipped') return 'bg-[#dbeafe] text-[#1d4ed8] dark:bg-blue-500/15 dark:text-blue-300'
  if (status === 'confirmed') return 'bg-[#eef2ff] text-[#4f46e5] dark:bg-indigo-500/15 dark:text-indigo-300'
  if (status === 'preparing') return 'bg-[#f3e8ff] text-[#7e22ce] dark:bg-purple-500/15 dark:text-purple-300'
  if (status === 'under_review') return 'bg-[#fff7d8] text-[#7a5600] dark:bg-amber-500/15 dark:text-amber-300'
  if (status === 'waiting_payment') return 'bg-[#f1f5f9] text-[#475569] dark:bg-slate-500/15 dark:text-slate-300'
  if (status === 'cancelled' || status === 'rejected' || status === 'amount_mismatch') return 'bg-[#fee2e2] text-[#b91c1c] dark:bg-red-500/15 dark:text-red-300'
  return 'bg-[#f1f5f9] text-[#475569] dark:bg-slate-500/15 dark:text-slate-300'
}

function OrderBookThumbs({ items }) {
  const safeItems = Array.isArray(items) ? items : []
  const visibleItems = safeItems.slice(0, 3)
  const extraCount = Math.max(safeItems.length - visibleItems.length, 0)

  return (
    <div className="flex items-center">
      {visibleItems.map((item, index) => (
        <div
          key={`${item.product_id || index}`}
          className="-ml-2 first:ml-0 h-12 w-9 overflow-hidden rounded-[10px] bg-[var(--shadow-bg-soft)] ring-2 ring-[var(--shadow-bg-surface)]"
        >
          {item.cover_url ? (
            <img
              src={item.cover_url}
              alt={item.title || 'Book'}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[var(--shadow-text-tertiary)]">
              <i className="fa-solid fa-book-open text-[11px]" />
            </div>
          )}
        </div>
      ))}

      {extraCount > 0 ? (
        <div className="-ml-2 flex h-12 w-9 items-center justify-center rounded-[10px] bg-[#111827] text-[10px] font-extrabold text-white ring-2 ring-[var(--shadow-bg-surface)] dark:bg-white dark:text-[#111827]">
          +{extraCount}
        </div>
      ) : null}
    </div>
  )
}

function OrderCard({ order }) {
  const items = Array.isArray(order.items) ? order.items : []
  const firstItem = items[0]
  const totalQty = items.reduce((total, item) => total + Number(item.quantity || 0), 0)

  return (
    <article className="rounded-[24px] bg-[var(--shadow-bg-surface)] p-4 shadow-sm ring-1 ring-[var(--shadow-border)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[12px] font-semibold text-[var(--shadow-text-secondary)]">Order ID</div>
          <div className="mt-1 line-clamp-1 text-[14px] font-extrabold text-[var(--shadow-text-primary)]">
            {order.order_id}
          </div>
          <div className="mt-1 text-[11.5px] font-semibold text-[var(--shadow-text-secondary)]">
            {formatDate(order.created_at)}
          </div>
        </div>

        <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase ${statusClass(order.status)}`}>
          {statusText(order.status)}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <OrderBookThumbs items={items} />

        <div className="min-w-0 flex-1">
          <div className="line-clamp-1 text-[13px] font-extrabold text-[var(--shadow-text-primary)]">
            {firstItem?.title || 'Shadow Mall books'}
          </div>
          <div className="mt-1 text-[11.5px] font-semibold text-[var(--shadow-text-secondary)]">
            {items.length} item{items.length > 1 ? 's' : ''} · Qty {totalQty || 0}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-[11px] font-semibold text-[var(--shadow-text-secondary)]">Total</div>
          <div className="mt-1 text-[15px] font-extrabold text-[#e5484d]">
            {formatUsd(order.total_usd)}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-[18px] bg-[var(--shadow-bg-soft)] px-4 py-3">
        <div className="flex items-center justify-between gap-3 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
          <span>Delivery</span>
          <span className="font-extrabold text-[var(--shadow-text-primary)]">
            {order.delivery_company?.shortName || order.delivery_company?.name || '-'}
          </span>
        </div>

        {order.aba_transaction_id ? (
          <div className="mt-2 flex items-center justify-between gap-3 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
            <span>Transaction</span>
            <span className="line-clamp-1 font-extrabold text-[var(--shadow-text-primary)]">
              {order.aba_transaction_id}
            </span>
          </div>
        ) : null}
      </div>
    </article>
  )
}

export default function ShadowMallOrderHistoryPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({
    total: 0,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const token = getReaderToken()

  async function loadOrders(options = {}) {
    const nextPage = options.page || page
    const nextStatus = options.status || status
    const nextSearch = options.search ?? search

    if (!token) {
      setOrders([])
      setLoading(false)
      setMessage('Please login to view your order history.')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const params = new URLSearchParams({
        page: String(nextPage),
        limit: '20',
        status: nextStatus,
        q: nextSearch.trim(),
      })

      const response = await fetch(`${API_URL}/api/shadow-mall/orders/my?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to load order history')
      }

      setOrders(data.orders || [])
      setMeta({
        total: data.total || 0,
        total_pages: data.total_pages || 1,
        has_next: Boolean(data.has_next),
        has_prev: Boolean(data.has_prev),
      })
    } catch (error) {
      setOrders([])
      setMessage(error.message || 'Failed to load order history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders({ page, status, search })

    const interval = window.setInterval(() => {
      loadOrders({ page, status, search })
    }, 15000)

    const refreshOnFocus = () => {
      loadOrders({ page, status, search })
    }

    window.addEventListener('focus', refreshOnFocus)

    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', refreshOnFocus)
    }
  }, [page, status])

  function handleStatusChange(nextStatus) {
    setStatus(nextStatus)
    setPage(1)
  }

  function handleSearchSubmit(event) {
    event.preventDefault()
    setPage(1)
    loadOrders({ page: 1, status, search })
  }

  const orderCountText = useMemo(() => {
    if (!meta.total) return 'No orders'
    if (meta.total === 1) return '1 order'
    return `${meta.total} orders`
  }, [meta.total])

  return (
    <div className="app-page min-h-screen pb-[110px]">
      <header className="sticky top-0 z-50 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/shop/mall/cart')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="text-left text-[18px] font-extrabold text-[var(--shadow-text-primary)]">Order History</h1>
            <div className="mt-0.5 text-[11.5px] font-semibold text-[var(--shadow-text-secondary)]">
              {orderCountText} · Recent orders from the last 90 days.
            </div>
          </div>

          <button
            type="button"
            onClick={() => loadOrders({ page, status, search })}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#111827] text-white active:scale-95 dark:bg-white dark:text-[#111827]"
            aria-label="Refresh orders"
          >
            <i className={`fa-solid fa-rotate-right text-[13px] ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        <form onSubmit={handleSearchSubmit} className="rounded-[22px] bg-[var(--shadow-bg-surface)] p-3 shadow-sm ring-1 ring-[var(--shadow-border)]">
          <div className="flex items-center gap-2 rounded-full bg-[var(--shadow-bg-soft)] px-4 py-3">
            <i className="fa-solid fa-magnifying-glass text-[14px] text-[var(--shadow-text-secondary)]" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search Order ID or Transaction ID"
              className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-[var(--shadow-text-primary)] outline-none placeholder:text-[var(--shadow-placeholder)]"
            />
            {search ? (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setPage(1)
                  loadOrders({ page: 1, status, search: '' })
                }}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-secondary)]"
                aria-label="Clear search"
              >
                <i className="fa-solid fa-xmark text-[12px]" />
              </button>
            ) : null}
          </div>
        </form>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {statusTabs.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleStatusChange(item.key)}
              className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-extrabold active:scale-95 ${
                status === item.key
                  ? 'bg-[#111827] text-white dark:bg-white dark:text-[#111827]'
                  : 'bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-secondary)] ring-1 ring-[var(--shadow-border)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {message ? (
          <div className="mt-4 rounded-[18px] bg-[#fff1f1] px-4 py-3 text-[12px] font-extrabold text-[#e5484d] dark:bg-red-500/10 dark:text-red-300">
            {message}
          </div>
        ) : null}

        {loading && !orders.length ? (
          <section className="mt-4 space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-[170px] animate-pulse rounded-[24px] bg-[var(--shadow-bg-surface)] shadow-sm ring-1 ring-[var(--shadow-border)]" />
            ))}
          </section>
        ) : orders.length ? (
          <section className="mt-4 space-y-3">
            {orders.map((order) => (
              <OrderCard key={order.order_id} order={order} />
            ))}
          </section>
        ) : (
          <section className="mt-4 rounded-[26px] bg-[var(--shadow-bg-surface)] px-5 py-12 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff7d8] text-[#7a5600] dark:bg-amber-500/15 dark:text-amber-300">
              <i className="fa-solid fa-clock-rotate-left text-[22px]" />
            </div>
            <h2 className="mt-4 text-[18px] font-extrabold text-[var(--shadow-text-primary)]">No orders yet</h2>
            <p className="mt-2 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">
              Your Shadow Mall orders will appear here after checkout.
            </p>
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="mt-5 rounded-full bg-[#111827] px-5 py-3 text-[13px] font-extrabold text-white active:scale-95 dark:bg-white dark:text-[#111827]"
            >
              Back to Shop
            </button>
          </section>
        )}

        {orders.length ? (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-[22px] bg-[var(--shadow-bg-surface)] px-4 py-3 shadow-sm ring-1 ring-[var(--shadow-border)]">
            <button
              type="button"
              disabled={!meta.has_prev}
              onClick={() => setPage((value) => Math.max(value - 1, 1))}
              className="rounded-full bg-[var(--shadow-bg-soft)] px-4 py-2 text-[12px] font-extrabold text-[var(--shadow-text-primary)] disabled:text-[var(--shadow-text-disabled)]"
            >
              Previous
            </button>

            <div className="text-[12px] font-extrabold text-[var(--shadow-text-secondary)]">
              Page {page} / {meta.total_pages}
            </div>

            <button
              type="button"
              disabled={!meta.has_next}
              onClick={() => setPage((value) => value + 1)}
              className="rounded-full bg-[#111827] px-4 py-2 text-[12px] font-extrabold text-white disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-disabled)] dark:bg-white dark:text-[#111827]"
            >
              Next
            </button>
          </div>
        ) : null}
      </main>
    </div>
  )
}
