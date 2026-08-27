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
  return <img src="/assets/Icons/Diamond.svg" alt="Diamond" className="h-8 w-8 object-contain" />
}

function CoinIcon() {
  return <img src="/assets/Icons/Shadow Coin.svg" alt="Coin" className="h-8 w-8 object-contain" />
}

function VoucherIcon() {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F0E8FF] text-[#6D28D9] dark:bg-violet-500/15 dark:text-violet-300">
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none" aria-hidden="true">
        <path d="M4 6.5h16v4a2.5 2.5 0 0 0 0 5v4H4v-4a2.5 2.5 0 0 0 0-5v-4Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 8.5v7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeDasharray="1.5 2.5" />
      </svg>
    </span>
  )
}

function BookPassIcon() {
  return (
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF0EA] dark:bg-rose-500/10">
      <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-gradient-to-br from-[#FF765F] to-[#FF3F7D] text-white">
        <i className="fas fa-book-open text-[18px]" />
      </span>
    </span>
  )
}

function OrderHistoryIcon() {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-[#F0E8FF] text-[#6D28D9] dark:bg-violet-500/15 dark:text-violet-300">
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none" aria-hidden="true">
        <path d="M9 5.5h6M9.5 4h5a1 1 0 0 1 1 1v1H8.5V5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 6h10a2 2 0 0 1 2 2v11H5V8a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.5 11h7M8.5 15h7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    </span>
  )
}

function EarnIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] fill-none" aria-hidden="true">
      <path d="M12 3.5l1.65 3.35 3.7.54-2.68 2.61.63 3.69L12 11.95 8.7 13.69l.63-3.69-2.68-2.61 3.7-.54L12 3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 16.5h14M7 20h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function TopUpIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] fill-none" aria-hidden="true">
      <path d="M14 5h4a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 14V3m0 0L8.5 6.5M12 3l3.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PaymentProfileModal({ value, saving, message, onChange, onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 dark:bg-black/70 sm:items-center sm:px-4">
      <div className="app-card w-full rounded-t-[28px] p-5 shadow-2xl sm:max-w-[430px] sm:rounded-[28px]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="app-title text-[20px] font-bold">Payment Profile</h3>
            <p className="app-muted mt-1 text-[12px] font-semibold leading-5">Use the same name as your payment account.</p>
            <p className="app-tertiary mt-1 text-[11px] font-semibold">Example: KEO DARIYA / DARIYA KEO</p>
          </div>
          <button type="button" onClick={onClose} className="app-soft flex h-9 w-9 items-center justify-center rounded-full active:scale-95">
            <i className="fas fa-times text-[14px]" />
          </button>
        </div>
        <label className="app-muted text-[11px] font-normal uppercase tracking-[0.1em]">Payment account name</label>
        <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="KEO DARIYA" className="app-input mt-2 h-12 w-full rounded-[16px] border px-4 text-[14px] font-normal uppercase outline-none focus:border-[var(--shadow-border-strong)]" />
        {message ? <p className="app-title mt-3 text-center text-[12px] font-bold">{message}</p> : null}
        <button type="button" onClick={onSave} disabled={saving} className="mt-4 h-12 w-full rounded-[18px] bg-[#111111] text-[14px] font-normal text-white active:scale-[0.99] disabled:opacity-60 dark:bg-white dark:text-[#111111]">{saving ? 'Saving...' : 'Save'}</button>
        <button type="button" onClick={onClose} className="app-card mt-3 h-12 w-full rounded-[18px] border text-[14px] font-normal active:scale-[0.99]">Cancel</button>
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

  const voucherBalance = Number(wallet?.voucher_balance || 0)
  const bookPassBalance = Number(wallet?.story_card_balance || 0)

  return (
    <div className="app-page min-h-screen pb-8">
      <header className="app-nav sticky top-0 z-40 border-b shadow-sm">
        <div className="flex h-14 items-center gap-3 px-4">
          <button type="button" onClick={() => navigate('/me', { replace: true })} className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[var(--shadow-bg-soft)]" aria-label="Go back">
            <i className="fas fa-chevron-left text-[18px] text-[var(--shadow-text-primary)]" />
          </button>
          <h1 className="app-title flex-1 text-[18px] font-bold tracking-tight">Wallet</h1>
          <button type="button" onClick={openPaymentProfileModal} className="app-card app-muted relative flex h-9 w-9 items-center justify-center rounded-full border active:scale-95" aria-label="Payment profile">
            <i className="fas fa-user text-[14px]" />
            {!paymentName ? <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border border-[var(--shadow-bg-surface)] bg-[#F59E0B]" /> : null}
          </button>
        </div>
      </header>

      <main className="space-y-5 px-3 pt-4 sm:px-4">
        <section className="rounded-[20px] bg-[#F3EEFF] p-3 dark:bg-violet-500/10">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 px-1 py-2">
              <span className="app-card flex h-12 w-12 shrink-0 items-center justify-center rounded-full"><DiamondIcon /></span>
              <div className="min-w-0">
                <p className="app-title text-[12px] font-bold">Diamonds</p>
                <p className="app-title mt-1 text-[24px] font-bold leading-none">{loading ? '...' : formatNumber(wallet?.diamond_balance)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-1 py-2">
              <span className="app-card flex h-12 w-12 shrink-0 items-center justify-center rounded-full"><CoinIcon /></span>
              <div className="min-w-0">
                <p className="app-title text-[12px] font-bold">Coins</p>
                <p className="app-title mt-1 text-[24px] font-bold leading-none">{loading ? '...' : formatNumber(wallet?.coin_balance ?? wallet?.gem_balance)}</p>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <button type="button" onClick={() => navigate('/tasks')} className="app-card flex h-11 items-center justify-center gap-2 rounded-full px-4 text-[13px] font-semibold active:scale-[0.98]">
              <EarnIcon />
              <span>Earn</span>
            </button>
            <button type="button" onClick={() => navigate('/shop/mall/purchase', { state: { returnTo: '/wallet' } })} className="app-card flex h-11 items-center justify-center gap-2 rounded-full px-4 text-[13px] font-semibold active:scale-[0.98]">
              <TopUpIcon />
              <span>Top-Up</span>
            </button>
          </div>
        </section>

        <section>
          <h2 className="app-title mb-3 text-[17px] font-bold">Reading Benefits</h2>

          <button type="button" onClick={() => navigate('/tasks')} className="app-soft flex w-full items-center gap-3 rounded-[18px] p-4 text-left active:scale-[0.99]">
            <VoucherIcon />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-1.5">
                <p className="app-title text-[14px] font-normal">Reading Vouchers</p>
                <span className="text-[15px] font-bold text-[#6D28D9] dark:text-violet-300">{loading ? '...' : formatNumber(voucherBalance)}</span>
              </div>
              <p className="app-muted mt-1 text-[11px] font-medium">Unlock 1 episode permanently</p>
            </div>
            <i className="fas fa-chevron-right text-[12px] text-[var(--shadow-text-tertiary)]" />
          </button>

          <div className="relative mt-4 overflow-hidden rounded-[20px] bg-gradient-to-br from-[#FFF9F7] via-[#FFF0EA] to-[#FFE8E4] p-4 dark:from-rose-500/10 dark:via-orange-500/10 dark:to-pink-500/10">
            <img src="/assets/Icons/Openbook.webp" alt="" className="pointer-events-none absolute -bottom-5 -right-2 w-[125px] select-none object-contain opacity-35" />
            <div className="absolute right-10 top-5 text-[12px] text-[#8B5CF6]">✦</div>
            <div className="absolute right-5 top-4 text-[13px] text-[#FF5B5B]">✦</div>
            <div className="relative flex items-start gap-3">
              <BookPassIcon />
              <div className="min-w-0 flex-1 pt-1">
                <div className="flex items-baseline gap-1.5">
                  <p className="app-title text-[18px] font-bold">Free Book Pass</p>
                  <span className="text-[16px] font-bold text-[#FF4D5F] dark:text-rose-300">{loading ? '...' : formatNumber(bookPassBalance)}</span>
                </div>
                <p className="app-muted mt-1 text-[11px] font-medium leading-5">Unlock 1 completed story permanently</p>
              </div>
            </div>
            <button type="button" disabled={bookPassBalance < 1} onClick={() => setMessage('Free Book Pass selection will be connected in the next step.')} className="relative mt-4 h-11 w-full rounded-full bg-gradient-to-r from-[#FF6B57] to-[#FF3F7D] text-[14px] font-bold text-white active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45">Use Now</button>
          </div>
        </section>

        <button type="button" onClick={() => navigate('/wallet/orders')} className="app-soft flex h-[62px] w-full items-center gap-3 rounded-[18px] px-4 text-left active:scale-[0.99]">
          <OrderHistoryIcon />
          <span className="app-title flex-1 text-[14px] font-normal">Order History</span>
          <i className="fas fa-chevron-right text-[13px] text-[#6D28D9] dark:text-violet-300" />
        </button>

        {message ? <p className="app-title text-center text-[12px] font-bold">{message}</p> : null}
      </main>

      {showPaymentProfileModal ? (
        <PaymentProfileModal value={draftPaymentName} saving={saving} message={profileMessage} onChange={setDraftPaymentName} onClose={() => setShowPaymentProfileModal(false)} onSave={savePaymentProfile} />
      ) : null}
    </div>
  )
}
