import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

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

function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString()
}

function StatusBadge({ status }) {
  const value = String(status || '').toLowerCase()
  const labelMap = {
    success: 'Success',
    waiting_payment: 'Waiting',
    pending_review: 'Review',
    expired: 'Expired',
    cancelled: 'Cancelled',
    rejected: 'Rejected',
  }

  const tone = value === 'success'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : value === 'pending_review'
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : value === 'waiting_payment'
        ? 'bg-slate-50 text-slate-700 border-slate-200'
        : 'bg-red-50 text-red-700 border-red-200'

  return <span className={`rounded-full border px-2.5 py-1 text-[11px] font-black ${tone}`}>{labelMap[value] || value || 'Unknown'}</span>
}

export default function ShopOrderHistoryPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return orders.filter((item) => {
      const currentStatus = String(item.status || '').toLowerCase()
      const matchesStatus = status === 'all' || currentStatus === status
      const matchesSearch = !keyword || [
        item.order_id,
        item.aba_trx_id,
        item.amount_usd,
        item.diamonds,
        item.status,
        item.match_reason,
      ].filter(Boolean).join(' ').toLowerCase().includes(keyword)

      return matchesStatus && matchesSearch
    })
  }, [orders, status, search])

  async function loadOrders() {
    if (!getReaderToken()) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      setMessage('')
      const response = await fetch(`${API_BASE_URL}/api/purchase/requests`, { headers: getHeaders() })
      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data.ok) throw new Error(data.message || 'Failed to load order history.')
      setOrders(Array.isArray(data.purchases) ? data.purchases : [])
    } catch (error) {
      setMessage(error.message || 'Failed to load order history.')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  return (
    <div className="min-h-screen bg-white pb-8">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white shadow-sm">
        <div className="flex h-14 items-center gap-3 px-4">
          <button type="button" onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors" aria-label="Go back">
            <i className="fas fa-chevron-left text-[18px] text-gray-700" />
          </button>

          <h1 className="text-[18px] font-extrabold tracking-tight text-neutral-900">Order History</h1>
        </div>
      </header>

      <main className="px-4 pt-4">
        <section className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_6px_16px_rgba(17,17,17,0.035)]">
          <div className="mb-4">
            <h2 className="text-[20px] font-black text-[#111111]">Purchase Records</h2>
            <p className="mt-1 text-[12px] font-semibold leading-5 text-[#6B7280]">
              Use Order ID or Trx ID when contacting support.
            </p>
          </div>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search Order ID or Trx ID..."
            className="mb-3 h-11 w-full rounded-[16px] border border-[#E5E7EB] bg-[#F8F8F8] px-4 text-[13px] font-bold text-[#111111] outline-none focus:border-[#111111]"
          />

          <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {[
              ['all', 'All'],
              ['success', 'Success'],
              ['waiting_payment', 'Waiting'],
              ['pending_review', 'Review'],
              ['rejected', 'Rejected'],
              ['expired', 'Expired'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setStatus(key)}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-[12px] font-black ${status === key ? 'border-[#111111] bg-[#111111] text-white' : 'border-[#E5E7EB] bg-white text-[#6B7280]'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {message ? <p className="mb-3 rounded-[16px] bg-red-50 p-3 text-center text-[12px] font-bold text-red-700">{message}</p> : null}

          <div className="space-y-3">
            {loading ? (
              <p className="rounded-[18px] bg-[#F8F8F8] p-4 text-center text-[12px] font-bold text-[#6B7280]">Loading order history...</p>
            ) : filteredOrders.length ? (
              filteredOrders.map((item) => (
                <div key={item.id || item.order_id} className="rounded-[18px] border border-[#E5E7EB] bg-[#F8F8F8] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-black text-[#111111]">{formatNumber(item.diamonds)} Diamonds</p>
                      <p className="mt-1 text-[12px] font-bold text-[#6B7280]">{formatMoney(item.amount_usd)} · Bonus {formatNumber(item.bonus_gems)} Gems</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>

                  <div className="mt-3 space-y-1 text-[11px] font-bold leading-5 text-[#6B7280]">
                    <p className="break-all">Order ID: {item.order_id || '-'}</p>
                    <p className="break-all">Trx ID: {item.aba_trx_id || '-'}</p>
                    <p>Created: {formatDate(item.created_at)}</p>
                    {item.match_reason ? <p>{item.match_reason}</p> : null}
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-[18px] bg-[#F8F8F8] p-4 text-center text-[12px] font-bold text-[#6B7280]">No order history found.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
