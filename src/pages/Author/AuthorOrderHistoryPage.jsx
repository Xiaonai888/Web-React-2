import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const FILTERS = ['All', 'Waiting', 'Review', 'Confirmed', 'Preparing', 'Shipped', 'Completed', 'Cancelled']

function getAuthorOrders() {
  try {
    const raw = localStorage.getItem('shadow_author_order_history') || '[]'
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function money(value) {
  const number = Number(value || 0)
  return `$${number.toFixed(2)}`
}

function statusLabel(status) {
  const value = String(status || 'waiting').toLowerCase()
  if (value === 'waiting') return 'WAITING PAYMENT'
  if (value === 'review') return 'UNDER REVIEW'
  if (value === 'confirmed') return 'CONFIRMED'
  if (value === 'preparing') return 'PREPARING'
  if (value === 'shipped') return 'SHIPPED'
  if (value === 'completed') return 'COMPLETED'
  if (value === 'cancelled') return 'CANCELLED'
  return 'WAITING PAYMENT'
}

function statusMatches(filter, status) {
  if (filter === 'All') return true
  return String(status || 'waiting').toLowerCase() === filter.toLowerCase()
}

function formatDate(value) {
  if (!value) return ''
  try {
    return new Date(value).toLocaleString()
  } catch {
    return value
  }
}

export default function AuthorOrderHistoryPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [orders] = useState(getAuthorOrders)

  const visibleOrders = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    return orders.filter((order) => {
      const filterOk = statusMatches(activeFilter, order.status)
      const queryOk = !keyword || String(order.order_id || '').toLowerCase().includes(keyword) || String(order.transaction_id || '').toLowerCase().includes(keyword)
      return filterOk && queryOk
    })
  }, [orders, query, activeFilter])

  return (
    <div className="min-h-screen bg-[#f7f5fb] pb-10">
      <header className="sticky top-0 z-40 border-b border-[#eeeaf5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[980px] items-center justify-between px-4">
          <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f0f8] text-[#111827] active:scale-95">
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="min-w-0 flex-1 px-3">
            <h1 className="text-[18px] font-black leading-5 text-[#111827]">Order History</h1>
            <p className="mt-0.5 text-[11px] font-semibold text-[#8b93a1]">{orders.length} orders · Recent orders from the last 90 days.</p>
          </div>

          <button type="button" onClick={() => window.location.reload()} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111827] text-white active:scale-95">
            <i className="fa-solid fa-rotate-right text-[13px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[980px] px-4 py-4">
        <section className="rounded-[24px] bg-white p-3 shadow-sm ring-1 ring-black/5">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[13px] text-[#9ca3af]" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Order ID or Transaction ID"
              className="h-12 w-full rounded-full bg-[#f3f4f6] pl-11 pr-4 text-[13px] font-bold text-[#111827] outline-none"
            />
          </div>
        </section>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((filter) => {
            const active = activeFilter === filter

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`h-9 shrink-0 rounded-full px-4 text-[12px] font-black ${
                  active ? 'bg-[#111827] text-white' : 'bg-white text-[#6b7280] ring-1 ring-black/5'
                }`}
              >
                {filter}
              </button>
            )
          })}
        </div>

        <section className="mt-3 space-y-3">
          {visibleOrders.length ? visibleOrders.map((order) => {
            const items = Array.isArray(order.items) ? order.items : []
            const firstItem = items[0] || {}
            const totalQty = items.reduce((sum, item) => sum + Number(item.quantity || 1), 0)

            return (
              <article key={order.order_id} className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-semibold text-[#8b93a1]">Order ID</div>
<div className="mt-1 text-[13px] font-black text-[#111827]">{order.order_id}</div>
{order.author_page_name || order.author_page_username ? (
  <div className="mt-1 text-[11px] font-black text-[#111827]">
    {order.author_page_name || 'Author Store'}
    {order.author_page_username ? (
      <span className="font-semibold text-[#8b93a1]"> @{order.author_page_username}</span>
    ) : null}
  </div>
) : null}
<div className="mt-1 text-[11px] font-semibold text-[#42526b]">{formatDate(order.created_at)}</div>
                  </div>

                  <span className="shrink-0 rounded-full bg-[#eef3f8] px-3 py-1 text-[9px] font-black uppercase text-[#42526b]">
                    {statusLabel(order.status)}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex -space-x-2">
                      {items.slice(0, 2).map((item, index) => (
                        <div key={`${item.id}-${index}`} className="h-11 w-9 overflow-hidden rounded-[10px] bg-[#eef0f4] ring-2 ring-white">
                          {item.cover_url ? (
                            <img src={item.cover_url} alt={item.title} className="h-full w-full object-cover" />
                          ) : null}
                        </div>
                      ))}
                    </div>

                    <div className="min-w-0">
                      <div className="line-clamp-1 text-[13px] font-black text-[#111827]">{firstItem.title || 'Author store order'}</div>
                      <div className="mt-1 text-[11px] font-semibold text-[#8b93a1]">{items.length} items · Qty {totalQty}</div>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="text-[11px] font-semibold text-[#8b93a1]">Total</div>
                    <div className="mt-1 text-[14px] font-black text-[#e5484d]">{money(order.total)}</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-[14px] bg-[#faf9fd] px-3 py-3">
                  <span className="text-[12px] font-semibold text-[#42526b]">Delivery</span>
                  <span className="text-[12px] font-black text-[#111827]">{order.delivery || 'Calculate later'}</span>
                </div>
              </article>
            )
          }) : (
            <div className="rounded-[24px] bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f0f8] text-[#111827]">
                <i className="fa-solid fa-clock-rotate-left text-[20px]" />
              </div>
              <h2 className="text-[16px] font-black text-[#111827]">No order history yet</h2>
              <p className="mx-auto mt-2 max-w-[280px] text-[12px] font-semibold leading-5 text-[#8b93a1]">Author store orders will appear here after checkout.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
