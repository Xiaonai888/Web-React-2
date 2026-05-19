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
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
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

function formatUsd(value) {
  return Number(value || 0).toFixed(2)
}

function formatTime(seconds) {
  const safeSeconds = Math.max(0, Number(seconds || 0))
  const minutes = Math.floor(safeSeconds / 60)
  const remain = safeSeconds % 60
  return `${minutes}:${String(remain).padStart(2, '0')}`
}

function getSecondsLeft(expiredAt) {
  if (!expiredAt) return 0
  const diff = new Date(expiredAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / 1000))
}

function PackageCard({ item, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-3xl border bg-white p-4 text-left transition active:scale-[0.99] ${
        selected ? 'border-black ring-2 ring-black/10' : 'border-[#e9e9e9]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[24px] font-black tracking-tight text-[#111]">${item.package_usd}</p>
          <p className="mt-2 text-[14px] font-extrabold text-[#111]">
            {formatNumber(item.diamonds)} Diamonds
          </p>
          <p className="mt-1 min-h-[20px] text-[12px] font-semibold text-[#777]">
            {item.bonus_gems > 0 ? `Bonus ${formatNumber(item.bonus_gems)} Gems` : 'No bonus gems'}
          </p>
        </div>

        <span className={`mt-1 h-5 w-5 rounded-full border ${selected ? 'border-black bg-black' : 'border-[#cfcfcf] bg-white'}`}>
          {selected ? <i className="fas fa-check block pt-[3px] text-center text-[10px] text-white" /> : null}
        </span>
      </div>
    </button>
  )
}

function PaymentStatusBadge({ payment, secondsLeft }) {
  if (!payment) return null

  if (payment.status === 'success') {
    return (
      <div className="mx-auto mb-3 inline-flex rounded-full bg-green-100 px-3 py-1 text-[12px] font-black text-green-700">
        Payment Success
      </div>
    )
  }

  if (['failed', 'expired', 'cancelled'].includes(payment.status)) {
    return (
      <div className="mx-auto mb-3 inline-flex rounded-full bg-red-100 px-3 py-1 text-[12px] font-black capitalize text-red-700">
        {payment.status}
      </div>
    )
  }

  return (
    <div className="mx-auto mb-3 inline-flex rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-black text-neutral-800">
      Expires in {formatTime(secondsLeft)}
    </div>
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
            <h3 className="text-[20px] font-black text-[#111]">Payment Method</h3>
            <p className="mt-1 text-[12px] font-semibold leading-5 text-[#777]">
              {payment ? 'Scan and complete payment before the QR expires.' : 'Choose a payment method to continue.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f3f3] text-[#111] active:scale-95"
            aria-label="Close payment method"
          >
            <i className="fas fa-times text-[14px]" />
          </button>
        </div>

        <div className="mb-4 rounded-2xl bg-[#f6f6f6] p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] font-bold text-[#666]">Amount</span>
            <span className="text-[16px] font-black text-[#111]">${formatUsd(selectedPackage.package_usd)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-[13px] font-bold text-[#666]">You get</span>
            <span className="text-right text-[13px] font-black text-[#111]">
              {formatNumber(selectedPackage.diamonds)} Diamonds
              {selectedPackage.bonus_gems > 0 ? ` + ${formatNumber(selectedPackage.bonus_gems)} Gems` : ''}
            </span>
          </div>
        </div>

        {!payment ? (
          <button
            type="button"
            onClick={onCreateAbaPayment}
            disabled={creating}
            className="flex w-full items-center justify-between rounded-2xl border border-black bg-white p-4 text-left active:scale-[0.99] disabled:opacity-60"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-14 items-center justify-center rounded-xl bg-[#e91d2d] text-[13px] font-black text-white">
                KHQR
              </div>
              <div>
                <p className="text-[14px] font-black text-[#111]">ABA KHQR</p>
                <p className="mt-1 text-[11px] font-semibold text-[#777]">
                  {creating ? 'Generating secure QR...' : 'Pay with ABA Mobile or KHQR'}
                </p>
              </div>
            </div>

            <i className="fas fa-chevron-right text-[14px] text-[#111]" />
          </button>
        ) : null}

        {payment ? (
          <div className="rounded-3xl border border-[#eeeeee] bg-white p-4 text-center">
            <PaymentStatusBadge payment={payment} secondsLeft={secondsLeft} />

            {qrImage && isWaiting ? (
              <div className="mx-auto w-fit rounded-[24px] border border-[#eeeeee] bg-white p-3 shadow-sm">
                <img src={qrImage} alt="ABA KHQR" className="h-[230px] w-[230px] rounded-2xl bg-white object-contain" />
              </div>
            ) : null}

            {!qrImage && payment.checkout_url && isWaiting ? (
              <a
                href={payment.checkout_url}
                target="_blank"
                rel="noreferrer"
                className="mx-auto flex h-14 max-w-[260px] items-center justify-center rounded-2xl bg-black text-[14px] font-black text-white"
              >
                Open ABA Payment
              </a>
            ) : null}

            {!qrImage && !payment.checkout_url && isWaiting ? (
              <div className="rounded-2xl bg-[#f6f6f6] p-4 text-[12px] font-bold leading-5 text-[#777]">
                Payment order was created. ABA QR will appear after PayWay credentials are configured.
              </div>
            ) : null}

            {checking && isWaiting ? (
              <p className="mt-3 text-[12px] font-bold text-[#777]">Checking payment status...</p>
            ) : null}

            {paymentMessage ? (
              <p className="mt-3 text-[12px] font-extrabold leading-5 text-[#111]">{paymentMessage}</p>
            ) : null}

            {isEnded ? (
              <button
                type="button"
                onClick={onCreateAbaPayment}
                disabled={creating}
                className="mt-4 h-12 w-full rounded-2xl bg-black text-[14px] font-black text-white active:scale-[0.99] disabled:opacity-60"
              >
                Generate New QR
              </button>
            ) : null}
          </div>
        ) : null}

        <button
          type="button"
          onClick={onClose}
          className="mt-3 h-12 w-full rounded-2xl bg-black text-[14px] font-black text-white active:scale-[0.99]"
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

      const packagesData = await packagesResponse.json().catch(() => ({}))
      const walletData = await walletResponse.json().catch(() => ({}))

      if (packagesData.ok && Array.isArray(packagesData.packages)) setPackages(packagesData.packages)
      if (walletData.ok) setWallet(walletData.wallet)
    } catch {
      setMessage('Failed to load purchase data.')
    } finally {
      setLoading(false)
    }
  }

  async function createQrFromPayment(nextPayment) {
    const directImage = nextPayment?.qr_image || nextPayment?.qrImage || nextPayment?.qr_image_url || ''

    if (directImage) {
      setQrImage(directImage)
      return
    }

    const qrValue = nextPayment?.qr_string || nextPayment?.qrString || ''

    if (!qrValue) {
      setQrImage('')
      return
    }

    try {
      const url = await QRCode.toDataURL(qrValue, {
        width: 420,
        margin: 1,
        errorCorrectionLevel: 'M',
      })
      setQrImage(url)
    } catch {
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
      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data.ok) throw new Error(data.message || 'Failed to check payment status.')

      setPayment(data.payment)
      setSecondsLeft(getSecondsLeft(data.payment?.expired_at))

      if (data.payment?.status === 'success') {
        stopPolling()
        setPaymentMessage('Diamonds added to your wallet successfully.')
        await loadPurchaseData()
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
      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data.ok) throw new Error(data.message || 'Failed to create ABA payment.')

      setPayment(data.payment)
      setSecondsLeft(getSecondsLeft(data.payment?.expired_at))
      await createQrFromPayment(data.payment)
      startPolling(data.payment?.order_id)

      if (!data.configured) {
        setPaymentMessage('ABA PayWay credentials are not configured yet. Order structure is ready for sandbox testing later.')
      }
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
    if (!payment?.expired_at || payment.status !== 'waiting_payment') return undefined

    const timer = window.setInterval(() => {
      const nextSeconds = getSecondsLeft(payment.expired_at)
      setSecondsLeft(nextSeconds)
      if (nextSeconds <= 0) checkPaymentStatus(payment.order_id)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [payment?.order_id, payment?.expired_at, payment?.status])

  if (!getReaderToken()) {
    return (
      <section className="rounded-3xl border border-[#eeeeee] bg-white p-6 text-center">
        <h2 className="text-[20px] font-black text-[#111]">Purchase Diamonds</h2>
        <p className="mx-auto mt-2 max-w-[320px] text-[13px] leading-6 text-[#666]">
          Log in to buy Diamonds, receive bonus Gems, and unlock premium episodes.
        </p>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="mt-5 rounded-full bg-black px-6 py-3 text-[13px] font-extrabold text-white active:scale-95"
        >
          Log In
        </button>
      </section>
    )
  }

  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-[#eeeeee] bg-white p-5">
        <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#777]">My Balance</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[#f6f6f6] p-4">
            <p className="text-[12px] font-bold text-[#777]">Diamonds</p>
            <p className="mt-1 text-[24px] font-black text-[#111]">
              {loading ? '...' : formatNumber(wallet?.diamond_balance)}
            </p>
          </div>

          <div className="rounded-2xl bg-[#f6f6f6] p-4">
            <p className="text-[12px] font-bold text-[#777]">Gems</p>
            <p className="mt-1 text-[24px] font-black text-[#111]">
              {loading ? '...' : formatNumber(wallet?.gem_balance)}
            </p>
          </div>
        </div>

        <p className="mt-3 text-[12px] leading-5 text-[#777]">
          Diamonds unlock premium episodes. Bonus Gems are rewards from purchases and future tasks.
        </p>
      </div>

      <div>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-[20px] font-black text-[#111]">Choose Amount</h2>
            <p className="mt-1 text-[12px] font-semibold text-[#777]">ABA KHQR expires in 3 minutes.</p>
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
        className="w-full rounded-2xl bg-black py-4 text-[15px] font-black text-white active:scale-[0.99]"
      >
        Purchase
      </button>

      {message ? <p className="text-center text-[12px] font-bold text-[#555]">{message}</p> : null}

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
