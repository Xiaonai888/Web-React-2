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

function DiamondIcon() {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#F8F8F8]">
      <i className="fas fa-gem text-[15px] text-[#111111]" />
    </span>
  )
}

function CrystalShardIcon() {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#F4D58D] bg-[#FFF7ED]">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2.6 19.2 7 17.4 17.2 12 21.4 6.6 17.2 4.8 7 12 2.6Z" fill="#F59E0B" />
        <path d="M12 2.6 9.1 8.2 12 21.4 14.9 8.2 12 2.6Z" fill="#FDBA74" />
        <path d="M4.8 7 9.1 8.2 6.6 17.2 4.8 7Z" fill="#D97706" />
        <path d="M19.2 7 14.9 8.2 17.4 17.2 19.2 7Z" fill="#B45309" />
        <path d="M9.1 8.2h5.8L12 21.4 9.1 8.2Z" fill="#FDE68A" opacity=".8" />
      </svg>
    </span>
  )
}

function SmallAssetIcon({ type }) {
  const icon = type === 'voucher' ? 'fas fa-ticket-alt' : 'fas fa-book-open'

  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#F8F8F8]">
      <i className={`${icon} text-[14px] text-[#111111]`} />
    </span>
  )
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

function BalanceCard({ icon, label, value }) {
  return (
    <div className="rounded-[20px] border border-[#E5E7EB] bg-[#F8F8F8] p-4">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-[12px] font-bold text-[#6B7280]">{label}</p>
          <p className="mt-1 text-[23px] font-black text-[#111111]">{value}</p>
        </div>
      </div>
    </div>
  )
}

function PaymentProfileModal({ value, saving, message, onChange, onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 sm:items-center sm:px-4">
      <div className="w-full rounded-t-[28px] bg-white p-5 shadow-2xl sm:max-w-[430px] sm:rounded-[28px]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[20px] font-black text-[#111111]">Payment Profile</h3>
            <p className="mt-1 text-[12px] font-semibold leading-5 text-[#6B7280]">
              Use the same name as your payment account.
            </p>
            <p className="mt-1 text-[11px] font-semibold text-[#9CA3AF]">
              Example: KEO DARIYA / DARIYA KEO
            </p>
          </div>

          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F4F6] text-[#111111] active:scale-95">
            <i className="fas fa-times text-[14px]" />
          </button>
        </div>

        <label className="text-[11px] font-black uppercase tracking-[0.1em] text-[#6B7280]">
          Payment account name
        </label>

        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="KEO DARIYA"
          className="mt-2 h-12 w-full rounded-[16px] border border-[#E5E7EB] bg-[#F8F8F8] px-4 text-[14px] font-bold uppercase text-[#111111] outline-none focus:border-[#111111]"
        />

        {message ? <p className="mt-3 text-center text-[12px] font-bold text-[#111111]">{message}</p> : null}

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="mt-4 h-12 w-full rounded-[18px] bg-[#111111] text-[14px] font-black text-white active:scale-[0.99] disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="mt-3 h-12 w-full rounded-[18px] border border-[#E5E7EB] bg-white text-[14px] font-black text-[#111111] active:scale-[0.99]"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function WalletPage() {
  const navigate = useNavigate()
  const [wallet, setWallet] = useState(null)
  const [orders, setOrders] = useState([])
  const [paymentName, setPaymentName] = useState('')
  const [draftPaymentName, setDraftPaymentName] = useState('')
  const [showPaymentProfileModal, setShowPaymentProfileModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [profileMessage, setProfileMessage] = useState('')
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
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(keyword)

      return matchesStatus && matchesSearch
    })
  }, [orders, status, search])

  async function loadWallet() {
    if (!getReaderToken()) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const [walletResponse, requestsResponse, userResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/purchase/wallet`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/api/purchase/requests`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/api/users/me`, { headers: getHeaders() }),
      ])

      const walletData = await walletResponse.json().catch(() => ({}))
      const requestsData = await requestsResponse.json().catch(() => ({}))
      const userData = await userResponse.json().catch(() => ({}))

      if (walletData.ok) setWallet(walletData.wallet)
      if (requestsData.ok && Array.isArray(requestsData.purchases)) setOrders(requestsData.purchases)

      if (userData.ok && userData.user) {
        const nextName = userData.user.payment_account_name || ''
        setPaymentName(nextName)
        setDraftPaymentName(nextName)
      }
    } catch {
      setMessage('Failed to load wallet.')
    } finally {
      setLoading(false)
    }
  }

  function openPaymentProfileModal() {
    setDraftPaymentName(paymentName)
    setProfileMessage('')
    setShowPaymentProfileModal(true)
  }

  async function savePaymentProfile() {
    if (saving) return

    try {
      setSaving(true)
      setProfileMessage('')

      const response = await fetch(`${API_BASE_URL}/api/users/payment-profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ payment_account_name: draftPaymentName }),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data.ok) throw new Error(data.message || 'Failed to save payment profile.')

      const nextName = data.user?.payment_account_name || ''
      setPaymentName(nextName)
      setDraftPaymentName(nextName)
      setShowPaymentProfileModal(false)
      setMessage('Payment profile saved.')
    } catch (error) {
      setProfileMessage(error.message || 'Failed to save payment profile.')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    loadWallet()
  }, [])

  return (
    <div className="min-h-screen bg-white pb-8">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white shadow-sm">
        <div className="flex h-14 items-center gap-3 px-4">
          <button type="button" onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors" aria-label="Go back">
            <i className="fas fa-chevron-left text-[18px] text-gray-700" />
          </button>
          <h1 className="text-[18px] font-extrabold tracking-tight text-neutral-900">Wallet</h1>
        </div>
      </header>

      <main className="space-y-5 px-4 pt-4">
        <section className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_6px_16px_rgba(17,17,17,0.035)]">
          <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#6B7280]">My Balance</p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <BalanceCard icon={<DiamondIcon />} label="Diamonds" value={loading ? '...' : formatNumber(wallet?.diamond_balance)} />
            <BalanceCard icon={<CrystalShardIcon />} label="Gems" value={loading ? '...' : formatNumber(wallet?.gem_balance)} />
            <BalanceCard icon={<SmallAssetIcon type="voucher" />} label="Voucher" value="0" />
            <BalanceCard icon={<SmallAssetIcon type="story" />} label="Story Card" value="0" />
          </div>
        </section>

        <section className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_6px_16px_rgba(17,17,17,0.035)]">
          <div className="mb-4">
            <h2 className="text-[20px] font-black text-[#111111]">Payment Profile</h2>
            <p className="mt-1 text-[12px] font-semibold leading-5 text-[#6B7280]">
              Use the same name as your payment account.
            </p>
          </div>

          <button
            type="button"
            onClick={openPaymentProfileModal}
            className="flex w-full items-center justify-between gap-4 rounded-[18px] border border-[#E5E7EB] bg-[#F8F8F8] p-4 text-left active:scale-[0.99]"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-black uppercase tracking-[0.1em] text-[#9CA3AF]">Payment account name</p>
              <p className={`mt-1 truncate text-[15px] font-black ${paymentName ? 'text-[#111111]' : 'text-[#9CA3AF]'}`}>
                {paymentName || 'Not set'}
              </p>
              {!paymentName ? (
                <p className="mt-1 text-[11px] font-semibold text-[#9CA3AF]">Example: KEO DARIYA / DARIYA KEO</p>
              ) : null}
            </div>

            <span className="shrink-0 text-[12px] font-black text-[#6B7280]">
              {paymentName ? 'Edit' : 'Add'} <i className="fas fa-chevron-right ml-1 text-[10px]" />
            </span>
          </button>
        </section>

        {message ? <p className="text-center text-[12px] font-bold text-[#111111]">{message}</p> : null}

        <section className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_6px_16px_rgba(17,17,17,0.035)]">
          <div className="mb-4">
            <h2 className="text-[20px] font-black text-[#111111]">Order History</h2>
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

      {showPaymentProfileModal ? (
        <PaymentProfileModal
          value={draftPaymentName}
          saving={saving}
          message={profileMessage}
          onChange={setDraftPaymentName}
          onClose={() => setShowPaymentProfileModal(false)}
          onSave={savePaymentProfile}
        />
      ) : null}
    </div>
  )
}
