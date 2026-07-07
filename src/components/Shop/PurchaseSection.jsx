import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const PENDING_KEY = 'shadow_manual_payment_pending'

const fallbackPackages = [
  { package_usd: 1, diamonds: 100, bonus_gems: 0 },
  { package_usd: 5, diamonds: 500, bonus_gems: 1000 },
  { package_usd: 10, diamonds: 1000, bonus_gems: 2000 },
  { package_usd: 20, diamonds: 2000, bonus_gems: 4000 },
  { package_usd: 50, diamonds: 5000, bonus_gems: 10000 },
  { package_usd: 100, diamonds: 10000, bonus_gems: 20000 },
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

function getSecondsLeft(dateValue) {
  if (!dateValue) return 0
  return Math.max(0, Math.ceil((new Date(dateValue).getTime() - Date.now()) / 1000))
}

function formatCountdown(seconds) {
  const safe = Math.max(0, Number(seconds || 0))
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`
}

function savePendingPayment(payment) {
  localStorage.setItem(PENDING_KEY, JSON.stringify(payment))
}

function getSavedPendingPayment() {
  try {
    return JSON.parse(localStorage.getItem(PENDING_KEY) || 'null')
  } catch {
    return null
  }
}

function clearSavedPendingPayment() {
  localStorage.removeItem(PENDING_KEY)
}

function DiamondIcon({ size = 'h-8 w-8' }) {
  return (
    <img
      src="/assets/Icons/Diamond.svg"
      alt="Diamond"
      className={`${size} shrink-0 object-contain`}
      loading="lazy"
      decoding="async"
    />
  )
}

function CoinIcon({ size = 'h-8 w-8' }) {
  return (
    <img
      src="/assets/Icons/Shadow Coin.svg"
      alt="Shadow Coin"
      className={`shrink-0 object-contain ${size}`}
      loading="lazy"
      decoding="async"
    />
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

function PackageCard({ item, onPurchase }) {
  const isBestValue = Number(item.package_usd) === 10

  return (
    <div className="relative flex min-h-[116px] items-center gap-3 rounded-[20px] bg-white px-4 py-4">
      <DiamondIcon size="h-10 w-10" />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[25px] font-black leading-none tracking-[-0.04em] text-[#111111]">
              {formatNumber(item.diamonds)}
            </span>
            <span className="text-[12px] font-black text-[#111111]">Diamonds</span>
          </div>

          {isBestValue ? (
            <span className="rounded-full bg-[#FF5A5F] px-2 py-1 text-[8px] font-black uppercase tracking-[0.05em] text-white">
              Best Value
            </span>
          ) : null}
        </div>

        <p className={`mt-2 text-[11px] font-bold ${item.bonus_gems > 0 ? 'text-[#B56A00]' : 'text-[#6B7280]'}`}>
          {item.bonus_gems > 0 ? `Bonus ${formatNumber(item.bonus_gems)} Coins` : 'No bonus coins'}
        </p>
      </div>

      <button
        type="button"
        onClick={onPurchase}
        className="min-w-[96px] shrink-0 rounded-full bg-[#FFD400] px-4 py-3 text-[15px] font-black text-[#111111] active:scale-95"
      >
        {formatMoney(item.package_usd)}
      </button>
    </div>
  )
}


function PaymentProfileRequiredModal({ onClose, onGoWallet }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 sm:items-center sm:px-4">
      <div className="w-full rounded-t-[28px] bg-white p-5 shadow-2xl sm:max-w-[430px] sm:rounded-[28px]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[20px] font-black text-[#111111]">Set Payment Profile</h3>
            <p className="mt-1 text-[12px] font-semibold leading-5 text-[#6B7280]">
              Please add your payment account name before your first purchase.
            </p>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F4F6] text-[#111111] active:scale-95">
            <i className="fas fa-times text-[14px]" />
          </button>
        </div>

        <div className="rounded-[20px] border border-[#E5E7EB] bg-[#F8F8F8] p-4">
          <p className="text-[12px] font-bold leading-5 text-[#6B7280]">
            Use the same name as your payment account.
          </p>
          <p className="mt-2 text-[12px] font-black text-[#111111]">
            Example: KEO DARIYA / DARIYA KEO
          </p>
        </div>

        <button type="button" onClick={onGoWallet} className="mt-4 h-12 w-full rounded-2xl bg-[#111111] text-[14px] font-black text-white active:scale-[0.99]">
          Go to Wallet
        </button>

        <button type="button" onClick={onClose} className="mt-3 h-12 w-full rounded-2xl border border-[#E5E7EB] bg-white text-[14px] font-black text-[#111111] active:scale-[0.99]">
          Not Now
        </button>
      </div>
    </div>
  )
}

function PaymentMethodModal({ selectedPackage, creating, onClose, onCreateManualPayment }) {
  if (!selectedPackage) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 sm:items-center sm:px-4">
      <div className="w-full rounded-t-[28px] bg-white p-5 shadow-2xl sm:max-w-[430px] sm:rounded-[28px]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[20px] font-black text-[#111111]">Payment Method</h3>
            <p className="mt-1 text-[12px] font-semibold leading-5 text-[#6B7280]">
              After payment, your Diamonds will be added automatically when payment confirms it.
            </p>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F4F6] text-[#111111] active:scale-95">
            <i className="fas fa-times text-[14px]" />
          </button>
        </div>

        <button
          type="button"
          onClick={onCreateManualPayment}
          disabled={creating}
          className="flex w-full items-center justify-between rounded-[20px] border border-[#E5E7EB] bg-white p-4 text-left active:scale-[0.99] disabled:opacity-60"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-14 items-center justify-center rounded-xl bg-[#E91D2D] text-[13px] font-black text-white">KHQR</div>
            <div>
              <p className="text-[14px] font-black text-[#111111]">PayWay</p>
              <p className="mt-1 text-[11px] font-semibold text-[#6B7280]">
                {creating ? 'Opening payment...' : `Pay exactly ${formatMoney(selectedPackage.package_usd)}`}
              </p>
            </div>
          </div>
          <i className="fas fa-chevron-right text-[14px] text-[#111111]" />
        </button>

        <p className="mb-2 mt-3 text-center text-[10px] font-semibold text-[#9CA3AF]">
          Completed payments are non-refundable.
        </p>

        <button type="button" onClick={onClose} className="h-12 w-full rounded-2xl bg-[#111111] text-[14px] font-black text-white active:scale-[0.99]">
          Cancel
        </button>
      </div>
    </div>
  )
}

function PaymentStatusModal({ payment, secondsLeft, checking, message, onCancel, onClose, onRefresh }) {
  if (!payment) return null

  const status = String(payment.status || '').toLowerCase()
  const isSuccess = status === 'success'
  const isReview = status === 'pending_review'
  const isWaiting = status === 'waiting_payment'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-4 sm:items-center sm:pb-0">
      <div className="w-full max-w-[460px] rounded-[28px] bg-white p-5 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[20px] font-black text-[#111111]">{isSuccess ? 'Payment Successful' : isReview ? 'Waiting for Review' : 'Payment Confirmation'}</h3>
            <p className="mt-1 text-[12px] font-semibold leading-5 text-[#6B7280]">
              {isSuccess ? `${formatNumber(payment.diamonds)} Diamonds were added to your wallet.` : isReview ? 'We received your payment but it needs manual review.' : 'Return here after payment. We will confirm it automatically.'}
            </p>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F4F6] text-[#111111] active:scale-95">
            <i className="fas fa-times text-[14px]" />
          </button>
        </div>

        <div className="rounded-[22px] border border-[#E5E7EB] bg-[#F8F8F8] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.1em] text-[#6B7280]">Amount</p>
              <p className="mt-1 text-[26px] font-black text-[#111111]">{formatMoney(payment.amount_usd)}</p>
            </div>
            <StatusBadge status={payment.status} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[#9CA3AF]">Diamonds</p>
              <p className="mt-1 text-[15px] font-black text-[#111111]">{formatNumber(payment.diamonds)}</p>
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[#9CA3AF]">Time left</p>
              <p className="mt-1 text-[15px] font-black text-[#111111]">{isWaiting ? formatCountdown(secondsLeft) : '-'}</p>
            </div>
          </div>
          <p className="mt-4 break-all text-[11px] font-bold text-[#6B7280]">Order ID: {payment.order_id}</p>
          {payment.aba_trx_id ? <p className="mt-1 break-all text-[11px] font-bold text-[#6B7280]">Trx ID: {payment.aba_trx_id}</p> : null}
        </div>

        {message ? <p className="mt-3 text-center text-[12px] font-bold leading-5 text-[#111111]">{message}</p> : null}

        {isWaiting ? (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button type="button" onClick={onRefresh} disabled={checking} className="rounded-[18px] bg-[#111111] py-4 text-[14px] font-black text-white active:scale-[0.99] disabled:opacity-50">
              {checking ? 'Checking...' : 'Check Status'}
            </button>
            <button type="button" onClick={onCancel} disabled={checking} className="rounded-[18px] border border-[#E5E7EB] bg-white py-4 text-[14px] font-black text-[#111111] active:scale-[0.99] disabled:opacity-50">
              Cancel
            </button>
          </div>
        ) : (
          <button type="button" onClick={onClose} className="mt-4 w-full rounded-[18px] bg-[#111111] py-4 text-[14px] font-black text-white active:scale-[0.99]">
            Done
          </button>
        )}
      </div>
    </div>
  )
}

export default function PurchaseSection() {
  const navigate = useNavigate()
  const [wallet, setWallet] = useState(null)
  const [user, setUser] = useState(null)
  const [packages, setPackages] = useState(fallbackPackages)
  const [selectedUsd, setSelectedUsd] = useState(1)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [showPaymentMethods, setShowPaymentMethods] = useState(false)
  const [showPaymentProfileRequired, setShowPaymentProfileRequired] = useState(false)
  const [manualPayment, setManualPayment] = useState(null)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [creatingPayment, setCreatingPayment] = useState(false)
  const [checking, setChecking] = useState(false)
  const [toast, setToast] = useState('')

  const selectedPackage = useMemo(
    () => packages.find((item) => Number(item.package_usd) === Number(selectedUsd)) || packages[0],
    [packages, selectedUsd]
  )

  const hasPaymentProfile = Boolean(String(user?.payment_account_name || '').trim())

  function openStatusModal(payment) {
    setManualPayment(payment)
    setSecondsLeft(getSecondsLeft(payment.proof_expires_at || payment.expires_at || payment.expired_at))
  }

  async function loadPurchaseData() {
    const token = getReaderToken()
    if (!token) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const [packagesResponse, walletResponse, userResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/purchase/packages`),
        fetch(`${API_BASE_URL}/api/purchase/wallet`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/api/users/me`, { headers: getHeaders() }),
      ])

      const packagesData = await packagesResponse.json().catch(() => ({}))
      const walletData = await walletResponse.json().catch(() => ({}))
      const userData = await userResponse.json().catch(() => ({}))

      if (packagesData.ok && Array.isArray(packagesData.packages)) setPackages(packagesData.packages)
      if (walletData.ok) setWallet(walletData.wallet)
      if (userData.ok && userData.user) setUser(userData.user)
    } catch {
      setMessage('Failed to load purchase data.')
    } finally {
      setLoading(false)
    }
  }

  async function refreshPaymentStatus(orderId, silent = false) {
    if (!orderId || !getReaderToken()) return null

    try {
      setChecking(true)
      const response = await fetch(`${API_BASE_URL}/api/purchase/manual/status/${encodeURIComponent(orderId)}`, { headers: getHeaders() })
      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data.ok) {
        if (!silent) setToast(data.message || 'Payment not confirmed yet.')
        return null
      }

      const payment = data.payment
      openStatusModal(payment)

      if (payment.status === 'success') {
        clearSavedPendingPayment()
        setToast(`${formatNumber(payment.diamonds)} Diamonds added to your wallet.`)
        loadPurchaseData()
      } else if (payment.status === 'pending_review') {
        clearSavedPendingPayment()
        setToast('Payment is waiting for review.')
        loadPurchaseData()
      } else if (['expired', 'cancelled', 'rejected'].includes(payment.status)) {
        clearSavedPendingPayment()
        loadPurchaseData()
      }

      return payment
    } finally {
      setChecking(false)
    }
  }

  async function restorePendingPayment() {
    const saved = getSavedPendingPayment()
    if (!saved?.order_id || !getReaderToken()) return
    const payment = await refreshPaymentStatus(saved.order_id, true)
    if (payment && payment.status === 'waiting_payment') openStatusModal(payment)
  }

  async function createManualPayment() {
    if (!getReaderToken()) {
      navigate('/login')
      return
    }

    if (!selectedPackage || creatingPayment) return

    try {
      setCreatingPayment(true)
      setToast('')
      const response = await fetch(`${API_BASE_URL}/api/purchase/manual/create`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ package_usd: selectedPackage.package_usd }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data.ok) throw new Error(data.message || 'Failed to create payment order.')

      savePendingPayment(data.payment)
      setShowPaymentMethods(false)
      window.location.href = data.payment.checkout_url
    } catch (error) {
      setToast(error.message || 'Failed to create payment order.')
    } finally {
      setCreatingPayment(false)
    }
  }

  function handlePurchase(packageUsd = selectedUsd) {
  setSelectedUsd(packageUsd)

  if (!getReaderToken()) {
    navigate('/login')
    return
  }

  setToast('')

  if (!hasPaymentProfile) {
    setShowPaymentProfileRequired(true)
    return
  }

  setShowPaymentMethods(true)
}


  async function cancelPurchase() {
    if (!manualPayment?.order_id || checking) return

    try {
      setChecking(true)
      await fetch(`${API_BASE_URL}/api/purchase/manual/cancel/${encodeURIComponent(manualPayment.order_id)}`, {
        method: 'POST',
        headers: getHeaders(),
      })
    } finally {
      clearSavedPendingPayment()
      setManualPayment(null)
      setToast('')
      setChecking(false)
      loadPurchaseData()
    }
  }

  useEffect(() => {
    loadPurchaseData()
    restorePendingPayment()
  }, [])

  useEffect(() => {
    if (!manualPayment?.order_id || manualPayment.status !== 'waiting_payment') return undefined

    const timer = window.setInterval(() => {
      const next = getSecondsLeft(manualPayment.proof_expires_at || manualPayment.expires_at || manualPayment.expired_at)
      setSecondsLeft(next)
      refreshPaymentStatus(manualPayment.order_id, true)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [manualPayment?.order_id, manualPayment?.status])

  if (!getReaderToken()) {
    return (
      <section className="rounded-[24px] border border-[#E5E7EB] bg-white p-6 text-center shadow-[0_6px_16px_rgba(17,17,17,0.035)]">
        <h2 className="text-[20px] font-black text-[#111111]">Purchase Diamonds</h2>
        <p className="mx-auto mt-2 max-w-[320px] text-[13px] leading-6 text-[#6B7280]">
          Log in to buy Diamonds, receive bonus Coins, and unlock premium episodes.
        </p>
        <button type="button" onClick={() => navigate('/login')} className="mt-5 rounded-full bg-[#111111] px-6 py-3 text-[13px] font-extrabold text-white active:scale-95">
          Log In
        </button>
      </section>
    )
  }

  return (
  <section className="-mx-4 space-y-4 bg-[#F5F5F5] px-4 pb-8">
    <div className="overflow-hidden rounded-[24px] bg-gradient-to-b from-[#FFD94A] to-[#FFA51F] p-[2px]">
      <div className="rounded-t-[22px] bg-white/95 px-4 pb-5 pt-4">
        <p className="text-center text-[14px] font-black uppercase tracking-[0.08em] text-[#E58A00]">
          Join Premium to Get
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center text-center">
            <DiamondIcon size="h-12 w-12" />
            <p className="mt-2 text-[13px] font-black text-[#111111]">120 Diamonds</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#FFF1D7] text-[#F59E0B]">
              <i className="fas fa-book-open text-[22px]" />
            </div>
            <p className="mt-2 text-[13px] font-black text-[#111111]">Early Access</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#FFE4E7] text-[#F43F5E]">
              <i className="fas fa-book text-[22px]" />
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F43F5E] px-1 text-[9px] font-black text-white">
                7
              </span>
            </div>
            <p className="mt-2 text-[13px] font-black text-[#111111]">Free 7 Stories</p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 pt-3">
        <button
          type="button"
          onClick={() => navigate('/shop', { state: { activeTab: 'Plans' } })}
          className="flex w-full items-center justify-between rounded-full bg-[#FFE85E] px-5 py-3.5 text-[#111111] active:scale-[0.99]"
        >
          <span className="text-[13px] font-black">Buy Premium</span>
          <span className="text-[19px] font-black">$5.99/month</span>
          <i className="fas fa-chevron-right text-[14px]" />
        </button>
      </div>
    </div>

    <div>
      <h2 className="mb-3 text-[20px] font-black text-[#111111]">Choose Diamonds</h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {packages.map((item) => (
          <PackageCard
            key={item.package_usd}
            item={item}
            onPurchase={() => handlePurchase(item.package_usd)}
          />
        ))}
      </div>
    </div>

    {message ? <p className="text-center text-[12px] font-bold text-[#555555]">{message}</p> : null}
    {toast ? <p className="text-center text-[12px] font-bold text-[#111111]">{toast}</p> : null}

    <div className="rounded-[20px] bg-white p-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF4D6] text-[#D98A00]">
          <i className="fas fa-info text-[13px]" />
        </div>
        <h3 className="text-[14px] font-black text-[#111111]">Things to note before purchasing</h3>
      </div>

      <ol className="mt-3 list-decimal space-y-2 pl-5 text-[12px] font-medium leading-5 text-[#6B7280]">
        <li>Diamonds are used to unlock premium episodes and support creators.</li>
        <li>Bonus Coins are added automatically after payment is confirmed.</li>
        <li>Completed purchases are non-refundable.</li>
      </ol>
    </div>

    {showPaymentProfileRequired ? (
      <PaymentProfileRequiredModal
        onClose={() => setShowPaymentProfileRequired(false)}
        onGoWallet={() => {
          setShowPaymentProfileRequired(false)
          navigate('/wallet')
        }}
      />
    ) : null}

    {showPaymentMethods ? (
      <PaymentMethodModal
        selectedPackage={selectedPackage}
        creating={creatingPayment}
        onClose={() => setShowPaymentMethods(false)}
        onCreateManualPayment={createManualPayment}
      />
    ) : null}

    {manualPayment ? (
      <PaymentStatusModal
        payment={manualPayment}
        secondsLeft={secondsLeft}
        checking={checking}
        message={toast}
        onCancel={cancelPurchase}
        onClose={() => setManualPayment(null)}
        onRefresh={() => refreshPaymentStatus(manualPayment.order_id)}
      />
    ) : null}
  </section>
)

}
