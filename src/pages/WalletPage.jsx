import { useEffect, useState } from 'react'
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

function DiamondIcon() {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#F8F8F8]">
      <i className="fas fa-gem text-[15px] text-[#111111]" />
    </span>
  )
}

function CrystalShardIcon() {
  return (
    <img
      src="/assets/Icons/Shadow%20Coin.svg"
      alt="Shadow Coin"
      className="h-10 w-10 shrink-0 object-contain"
    />
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
  const [paymentName, setPaymentName] = useState('')
  const [draftPaymentName, setDraftPaymentName] = useState('')
  const [showPaymentProfileModal, setShowPaymentProfileModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [profileMessage, setProfileMessage] = useState('')

  async function loadWallet() {
    if (!getReaderToken()) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const [walletResponse, userResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/purchase/wallet`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/api/users/me`, { headers: getHeaders() }),
      ])

      const walletData = await walletResponse.json().catch(() => ({}))
      const userData = await userResponse.json().catch(() => ({}))

      if (walletData.ok) setWallet(walletData.wallet)

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

          <h1 className="flex-1 text-[18px] font-extrabold tracking-tight text-neutral-900">Wallet</h1>

          <button
            type="button"
            onClick={openPaymentProfileModal}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#6B7280] active:scale-95"
            aria-label="Payment profile"
          >
            <i className="fas fa-user text-[14px]" />
            {!paymentName ? <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border border-white bg-[#F59E0B]" /> : null}
          </button>
        </div>
      </header>

      <main className="space-y-5 px-4 pt-4">
        <section className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_6px_16px_rgba(17,17,17,0.035)]">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#6B7280]">My Balance</p>

            <button type="button" onClick={() => navigate('/wallet/orders')} className="text-[12px] font-semibold text-[#9CA3AF] active:scale-95">
              Order History <i className="fas fa-chevron-right ml-1 text-[9px]" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <BalanceCard icon={<DiamondIcon />} label="Diamonds" value={loading ? '...' : formatNumber(wallet?.diamond_balance)} />
            <BalanceCard icon={<CrystalShardIcon />} label="Gems" value={loading ? '...' : formatNumber(wallet?.gem_balance)} />
            <BalanceCard icon={<SmallAssetIcon type="voucher" />} label="Voucher" value="0" />
            <BalanceCard icon={<SmallAssetIcon type="story" />} label="Story Card" value="0" />
          </div>
        </section>

        {message ? <p className="text-center text-[12px] font-bold text-[#111111]">{message}</p> : null}
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
