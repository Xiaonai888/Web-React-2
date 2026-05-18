import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

function PaymentMethodModal({ selectedPackage, onClose }) {
  if (!selectedPackage) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-4 sm:items-center sm:pb-0">
      <div className="w-full max-w-[430px] rounded-[28px] bg-white p-5 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[20px] font-black text-[#111]">Payment Method</h3>
            <p className="mt-1 text-[12px] font-semibold leading-5 text-[#777]">
              Choose a payment method to continue.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f3f3] text-[#111] active:scale-95"
          >
            <i className="fas fa-times text-[14px]" />
          </button>
        </div>

        <div className="mb-4 rounded-2xl bg-[#f6f6f6] p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] font-bold text-[#666]">Amount</span>
            <span className="text-[16px] font-black text-[#111]">${selectedPackage.package_usd}</span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-[13px] font-bold text-[#666]">You get</span>
            <span className="text-right text-[13px] font-black text-[#111]">
              {formatNumber(selectedPackage.diamonds)} Diamonds
              {selectedPackage.bonus_gems > 0 ? ` + ${formatNumber(selectedPackage.bonus_gems)} Gems` : ''}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-between rounded-2xl border border-black bg-white p-4 text-left active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-14 items-center justify-center rounded-xl bg-[#e91d2d] text-[13px] font-black text-white">
              KHQR
            </div>
            <div>
              <p className="text-[14px] font-black text-[#111]">ABA KHQR</p>
              <p className="mt-1 text-[11px] font-semibold text-[#777]">
                Pay with ABA Mobile or KHQR
              </p>
            </div>
          </div>

          <i className="fas fa-chevron-right text-[14px] text-[#111]" />
        </button>

        <button
          type="button"
          onClick={onClose}
          className="mt-3 h-12 w-full rounded-2xl bg-black text-[14px] font-black text-white active:scale-[0.99]"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function PurchaseSection() {
  const navigate = useNavigate()
  const [wallet, setWallet] = useState(null)
  const [packages, setPackages] = useState(fallbackPackages)
  const [selectedUsd, setSelectedUsd] = useState(1)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [showPaymentMethods, setShowPaymentMethods] = useState(false)

  const selectedPackage = useMemo(
    () => packages.find((item) => Number(item.package_usd) === Number(selectedUsd)) || packages[0],
    [packages, selectedUsd]
  )

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

  function handlePurchase() {
    const token = getReaderToken()

    if (!token) {
      navigate('/login')
      return
    }

    setShowPaymentMethods(true)
  }

  useEffect(() => {
    loadPurchaseData()
  }, [])

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
            <p className="mt-1 text-[12px] font-semibold text-[#777]">No service fee in this stage.</p>
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
        className="h-13 w-full rounded-2xl bg-black py-4 text-[15px] font-black text-white active:scale-[0.99]"
      >
        Purchase
      </button>

      {message ? (
        <p className="text-center text-[12px] font-bold text-[#555]">{message}</p>
      ) : null}

      {showPaymentMethods ? (
        <PaymentMethodModal
          selectedPackage={selectedPackage}
          onClose={() => setShowPaymentMethods(false)}
        />
      ) : null}
    </section>
  )
}
