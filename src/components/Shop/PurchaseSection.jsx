import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QRCode from 'qrcode'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

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

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString()
}

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`
}

function formatTime(seconds) {
  const safeSeconds = Math.max(0, Number(seconds || 0))
  const minutes = Math.floor(safeSeconds / 60)
  const remain = safeSeconds % 60
  return `${minutes}:${String(remain).padStart(2, '0')}`
}

function getSecondsLeft(expiresAt) {
  if (!expiresAt) return 0
  const diff = new Date(expiresAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / 1000))
}

function DiamondIcon({ selected = false, size = 'h-9 w-9' }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full border ${size} ${
        selected ? 'border-[#c9a227] bg-[#fff9e6]' : 'border-[#e5e7eb] bg-[#f8f8f8]'
      }`}
    >
      <i className={`fas fa-gem text-[15px] ${selected ? 'text-[#c9a227]' : 'text-[#111111]'}`} />
    </span>
  )
}

function PackageCard({ item, selected, onSelect }) {
  const isBestValue = Number(item.package_usd) === 10

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex min-h-[112px] items-start gap-3 rounded-[22px] border bg-white p-4 text-left transition active:scale-[0.99] ${
        selected
          ? 'border-[#111111] shadow-[0_10px_24px_rgba(17,17,17,0.10)] ring-1 ring-[#c9a227]/60'
          : 'border-[#e5e7eb] shadow-[0_6px_16px_rgba(17,17,17,0.035)] hover:border-[#c9a227]/70'
      }`}
    >
      <DiamondIcon selected={selected} />

      <div className="min-w-0 flex-1">
        <div className="flex min-h-[20px] items-center gap-2">
          {isBestValue ? (
            <span className="rounded-full border border-[#ead997] bg-[#fff9e6] px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.08em] text-[#8a6f18]">
              Best Value
            </span>
          ) : null}
        </div>

        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-[24px] font-black leading-none tracking-[-0.04em] text-[#111111]">
            {formatNumber(item.diamonds)}
          </span>
          <span className="text-[12px] font-black text-[#111111]">Diamonds</span>
        </div>

        <p className="mt-1 text-[12px] font-black text-[#6b7280]">{formatMoney(item.package_usd)}</p>

        <p className={`mt-2 text-[11px] font-bold ${item.bonus_gems > 0 ? 'text-[#8a6f18]' : 'text-[#6b7280]'}`}>
          {item.bonus_gems > 0 ? `Bonus ${formatNumber(item.bonus_gems)} Gems` : 'No bonus gems'}
        </p>
      </div>

      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
          selected ? 'border-[#111111] bg-[#111111]' : 'border-[#d1d5db] bg-white'
        }`}
      >
        {selected ? <i className="fas fa-check text-[9px] text-[#c9a227]" /> : null}
      </span>
    </button>
  )
}

function PaymentMethodModal({
  selectedPackage,
  payment,
  qrImage,
  secondsLeft,
  creating,
  checking,
  paymentMessage,
  onClose,
  onCreateAbaPayment,
}) {
  if (!selectedPackage) return null

  const isWaiting = payment?.status === 'waiting_payment'
  const isSuccess = payment?.status === 'success'
  const isEnded = ['failed', 'expired', 'cancelled'].includes(payment?.status)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-4 sm:items-center sm:pb-0">
      <div className="w-full max-w-[430px] rounded-[28px] bg-white p-5 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[20px] font-black text-[#111111]">Payment Method</h3>
            <p className="mt-1 text-[12px] font-semibold leading-5 text-[#6b7280]">
              {payment ? 'Scan and complete payment before the QR expires.' : 'Choose a payment method to continue.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111111] active:scale-95"
          >
            <i className="fas fa-times text-[14px]" />
          </button>
        </div>

        <div className="mb-4 rounded-[20px] border border-[#e5e7eb] bg-[#f8f8f8] p-4">
          <div className="flex items-center gap-3">
            <DiamondIcon selected size="h-11 w-11" />
            <div className="min-w-0 flex-1">
              <p className="text-[18px] font-black leading-none text-[#111111]">
                {formatNumber(selectedPackage.diamonds)} Diamonds
              </p>
              <p className="mt-1 text-[12px] font-bold text-[#6b7280]">
                {selectedPackage.bonus_gems > 0 ? `Bonus ${formatNumber(selectedPackage.bonus_gems)} Gems` : 'No bonus gems'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[15px] font-black text-[#111111]">{formatMoney(selectedPackage.package_usd)}</p>
              <p className="mt-0.5 text-[10px] font-black uppercase tracking-[0.08em] text-[#9ca3af]">USD</p>
            </div>
          </div>
        </div>

        {!payment ? (
          <button
            type="button"
            onClick={onCreateAbaPayment}
            disabled={creating}
            className="flex w-full items-center justify-between rounded-[20px] border border-[#e5e7eb] bg-white p-4 text-left active:scale-[0.99] disabled:opacity-60"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-14 items-center justify-center rounded-xl bg-[#e91d2d] text-[13px] font-black text-white">KHQR</div>
              <div>
                <p className="text-[14px] font-black text-[#111111]">ABA KHQR</p>
                <p className="mt-1 text-[11px] font-semibold text-[#6b7280]">
                  {creating ? 'Generating secure QR...' : 'Pay with ABA Mobile or KHQR'}
                </p>
              </div>
            </div>

            <i className="fas fa-chevron-right text-[14px] text-[#111111]" />
          </button>
        ) : null}

        {payment ? (
          <div className="rounded-[22px] border border-[#e5e7eb] bg-white p-4 text-center">
            <div
              className={`mx-auto mb-3 inline-flex rounded-full px-3 py-1 text-[12px] font-black ${
                isSuccess
                  ? 'bg-green-100 text-green-700'
                  : isEnded
                    ? 'bg-red-100 text-red-700'
                    : 'bg-[#fff9e6] text-[#8a6f18]'
              }`}
            >
              {isSuccess ? 'Payment Success' : isEnded ? payment.status : `Expires in ${formatTime(secondsLeft)}`}
            </div>

            {qrImage && isWaiting ? (
              <img src={qrImage} alt="ABA KHQR" className="mx-auto h-[230px] w-[230px] rounded-2xl border border-[#e5e7eb] bg-white p-2" />
            ) : null}

            {!qrImage && payment.checkout_url && isWaiting ? (
              <a
                href={payment.checkout_url}
                target="_blank"
                rel="noreferrer"
                className="mx-auto flex h-14 max-w-[260px] items-center justify-center rounded-2xl bg-[#111111] text-[14px] font-black text-white"
              >
                Open ABA Payment
              </a>
            ) : null}

            {!qrImage && !payment.checkout_url && isWaiting ? (
              <div className="rounded-2xl bg-[#f8f8f8] p-4 text-[12px] font-bold leading-5 text-[#6b7280]">
                ABA payment was created, but QR data is not available yet.
              </div>
            ) : null}

            {checking && isWaiting ? (
              <p className="mt-3 text-[12px] font-bold text-[#6b7280]">Checking payment safely...</p>
            ) : null}

            {paymentMessage ? (
              <p className="mt-3 text-[12px] font-extrabold leading-5 text-[#111111]">{paymentMessage}</p>
            ) : null}

            {isEnded ? (
              <button
                type="button"
                onClick={onCreateAbaPayment}
                disabled={creating}
                className="mt-4 h-12 w-full rounded-2xl bg-[#111111] text-[14px] font-black text-white active:scale-[0.99] disabled:opacity-60"
              >
                Generate New QR
              </button>
            ) : null}
          </div>
        ) : null}

        <button
          type="button"
          onClick={onClose}
          className="mt-3 h-12 w-full rounded-2xl bg-[#111111] text-[14px] font-black text-white active:scale-[0.99]"
        >
          {isSuccess ? 'Done' : 'Cancel'}
        </button>
      </div>
    </div>
  )
}

export default function PurchaseSection() {
  const navigate = useNavigate()
  const pollRef = useRef(null)
  const [wallet, setWallet] = useState(null)
  const [packages, setPackages] = useState(fallbackPackages)
  const [selectedUsd, setSelectedUsd] = useState(1)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [showPaymentMethods, setShowPaymentMethods] = useState(false)
  const [payment, setPayment] = useState(null)
  const [qrImage, setQrImage] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [creatingPayment, setCreatingPayment] = useState(false)
  const [checkingPayment, setCheckingPayment] = useState(false)
  const [paymentMessage, setPaymentMessage] = useState('')

  const selectedPackage = useMemo(
    () => packages.find((item) => Number(item.package_usd) === Number(selectedUsd)) || packages[0],
    [packages, selectedUsd]
  )

  function stopPolling() {
    if (pollRef.current) window.clearInterval(pollRef.current)
    pollRef.current = null
  }

  async function loadPurchaseData() {
    const token = getReaderToken()

    if (!token) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      const [packagesResponse, walletResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/purchase/packages`),
        fetch(`${API_BASE_URL}/api/purchase/wallet`, { headers: getHeaders() }),
      ])

      const packagesData = await packagesResponse.json()
      const walletData = await walletResponse.json()

      if (packagesData.ok && Array.isArray(packagesData.packages)) setPackages(packagesData.packages)
      if (walletData.ok) setWallet(walletData.wallet)
    } catch (error) {
      setMessage('Failed to load purchase data.')
    } finally {
      setLoading(false)
    }
  }

  async function createQrFromPayment(nextPayment) {
    const directImage = nextPayment?.qr_image || nextPayment?.qrImage || ''

    if (directImage) {
      setQrImage(directImage)
      return
    }

    const value = nextPayment?.qr_string || nextPayment?.qrString || nextPayment?.checkout_url || ''

    if (!value) {
      setQrImage('')
      return
    }

    try {
      const url = await QRCode.toDataURL(value, {
        width: 420,
        margin: 1,
        errorCorrectionLevel: 'M',
      })
      setQrImage(url)
    } catch (error) {
      setQrImage('')
    }
  }

  async function checkPaymentStatus(orderId) {
    if (!orderId) return

    try {
      setCheckingPayment(true)
      const response = await fetch(`${API_BASE_URL}/api/purchase/aba/status/${encodeURIComponent(orderId)}`, {
        headers: getHeaders(),
      })
      const data = await response.json()

      if (!response.ok || !data.ok) throw new Error(data.message || 'Failed to check payment status.')

      setPayment(data.payment)
      setSecondsLeft(getSecondsLeft(data.payment?.expires_at || data.payment?.expired_at))

      if (data.payment?.status === 'success') {
        stopPolling()
        setPaymentMessage('Diamonds added to your wallet successfully.')
        await loadPurchaseData()
        return
      }

      if (data.payment?.status === 'callback_received') {
        stopPolling()
        setPaymentMessage('Payment callback received. Waiting for final ABA verification before release.')
        return
      }

      if (['failed', 'expired', 'cancelled'].includes(data.payment?.status)) {
        stopPolling()
        setPaymentMessage('Payment was not completed. No report was sent. You can generate a new QR.')
      }
    } catch (error) {
      setPaymentMessage(error.message || 'Failed to check payment status.')
    } finally {
      setCheckingPayment(false)
    }
  }

  function startPolling(orderId) {
    stopPolling()
    pollRef.current = window.setInterval(() => {
      checkPaymentStatus(orderId)
    }, 3000)
  }

  async function createAbaPayment() {
    const token = getReaderToken()

    if (!token) {
      navigate('/login')
      return
    }

    if (!selectedPackage || creatingPayment) return

    try {
      stopPolling()
      setCreatingPayment(true)
      setPaymentMessage('')
      setPayment(null)
      setQrImage('')

      const response = await fetch(`${API_BASE_URL}/api/purchase/aba/create`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ package_usd: selectedPackage.package_usd }),
      })
      const data = await response.json()

      if (!response.ok || !data.ok) throw new Error(data.message || 'Failed to create ABA payment.')

      setPayment(data.payment)
      setSecondsLeft(getSecondsLeft(data.payment?.expires_at || data.payment?.expired_at))
      await createQrFromPayment(data.payment)
      startPolling(data.payment?.order_id)

      if (!data.configured) setPaymentMessage('ABA PayWay is not configured yet. This is preparation mode only.')
    } catch (error) {
      setPaymentMessage(error.message || 'Failed to create ABA payment.')
    } finally {
      setCreatingPayment(false)
    }
  }

  function handlePurchase() {
    const token = getReaderToken()

    if (!token) {
      navigate('/login')
      return
    }

    setPayment(null)
    setQrImage('')
    setPaymentMessage('')
    setShowPaymentMethods(true)
  }

  function closePaymentModal() {
    stopPolling()
    setShowPaymentMethods(false)
  }

  useEffect(() => {
    loadPurchaseData()
    return () => stopPolling()
  }, [])

  useEffect(() => {
    const expiresAt = payment?.expires_at || payment?.expired_at

    if (!expiresAt || payment.status !== 'waiting_payment') return undefined

    const timer = window.setInterval(() => {
      const nextSeconds = getSecondsLeft(expiresAt)
      setSecondsLeft(nextSeconds)
      if (nextSeconds <= 0) checkPaymentStatus(payment.order_id)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [payment?.order_id, payment?.expires_at, payment?.expired_at, payment?.status])

  if (!getReaderToken()) {
    return (
      <section className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 text-center shadow-[0_6px_16px_rgba(17,17,17,0.035)]">
        <h2 className="text-[20px] font-black text-[#111111]">Purchase Diamonds</h2>
        <p className="mx-auto mt-2 max-w-[320px] text-[13px] leading-6 text-[#6b7280]">
          Log in to buy Diamonds, receive bonus Gems, and unlock premium episodes.
        </p>
        <button type="button" onClick={() => navigate('/login')} className="mt-5 rounded-full bg-[#111111] px-6 py-3 text-[13px] font-extrabold text-white active:scale-95">
          Log In
        </button>
      </section>
    )
  }

  return (
    <section className="space-y-5">
      <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-5 shadow-[0_6px_16px_rgba(17,17,17,0.035)]">
        <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#6b7280]">My Balance</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-[18px] border border-[#e5e7eb] bg-[#f8f8f8] p-4">
            <div className="flex items-center gap-3">
              <DiamondIcon size="h-9 w-9" />
              <div>
                <p className="text-[12px] font-bold text-[#6b7280]">Diamonds</p>
                <p className="mt-1 text-[23px] font-black text-[#111111]">{loading ? '...' : formatNumber(wallet?.diamond_balance)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-4">
            <p className="text-[12px] font-bold text-[#6b7280]">Gems</p>
            <p className="mt-1 text-[23px] font-black text-[#111111]">{loading ? '...' : formatNumber(wallet?.gem_balance)}</p>
          </div>
        </div>

        <p className="mt-3 text-[12px] leading-5 text-[#6b7280]">
          Diamonds unlock premium episodes. Bonus Gems are rewards from purchases and future tasks.
        </p>
      </div>

      <div>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-[20px] font-black text-[#111111]">Choose Diamonds</h2>
            <p className="mt-1 text-[12px] font-semibold text-[#6b7280]">ABA KHQR expires in 3 minutes.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {packages.map((item) => (
            <PackageCard
              key={item.package_usd}
              item={item}
              selected={Number(selectedUsd) === Number(item.package_usd)}
              onSelect={() => setSelectedUsd(item.package_usd)}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handlePurchase}
        className="w-full rounded-[18px] bg-[#111111] py-4 text-[15px] font-black text-white shadow-[0_12px_24px_rgba(17,17,17,0.16)] active:scale-[0.99]"
      >
        Purchase {selectedPackage ? `${formatNumber(selectedPackage.diamonds)} Diamonds` : ''}
      </button>

      {message ? <p className="text-center text-[12px] font-bold text-[#555]\">{message}</p> : null}

      {showPaymentMethods ? (
        <PaymentMethodModal
          selectedPackage={selectedPackage}
          payment={payment}
          qrImage={qrImage}
          secondsLeft={secondsLeft}
          creating={creatingPayment}
          checking={checkingPayment}
          paymentMessage={paymentMessage}
          onClose={closePaymentModal}
          onCreateAbaPayment={createAbaPayment}
        />
      ) : null}
    </section>
  )
}
