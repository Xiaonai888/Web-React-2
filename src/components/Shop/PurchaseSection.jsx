import { useEffect, useMemo, useRef, useState } from 'react'
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

function getAuthHeaders() {
  const token = getReaderToken()

  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString()
}

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`
}

function DiamondIcon({ selected = false, size = 'h-10 w-10' }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full border ${size} ${
        selected ? 'border-[#C59B2D] bg-[#FFF7DF]' : 'border-[#E5E7EB] bg-[#F8F8F8]'
      }`}
    >
      <i className={`fas fa-gem text-[15px] ${selected ? 'text-[#3B0764]' : 'text-[#111111]'}`} />
    </span>
  )
}

function PackageCard({ item, selected, onSelect }) {
  const isBestValue = Number(item.package_usd) === 10

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative min-h-[126px] overflow-hidden rounded-[22px] border bg-white p-4 text-left transition active:scale-[0.99] ${
        selected
          ? 'border-[#C59B2D] shadow-[0_14px_30px_rgba(197,155,45,0.16)]'
          : 'border-[#E5E7EB] shadow-[0_6px_16px_rgba(17,17,17,0.035)] hover:border-[#C59B2D]/70'
      }`}
    >
      {isBestValue ? (
        <div className="absolute right-3 top-3 rounded-bl-[12px] rounded-tr-[14px] bg-[#F5C542] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-[#111111] shadow-sm">
          Best Value
        </div>
      ) : null}

      <div className="flex items-start gap-3 pr-8">
        <DiamondIcon selected={selected} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
            <span className="text-[25px] font-black leading-none tracking-[-0.04em] text-[#111111]">
              {formatNumber(item.diamonds)}
            </span>
            <span className="text-[12px] font-black text-[#111111]">Diamonds</span>
          </div>

          <p className="mt-2 text-[12px] font-extrabold text-[#6B7280]">{formatMoney(item.package_usd)}</p>

          <p className={`mt-2 text-[11px] font-extrabold ${item.bonus_gems > 0 ? 'text-[#B56A00]' : 'text-[#6B7280]'}`}>
            {item.bonus_gems > 0 ? `Bonus ${formatNumber(item.bonus_gems)} Gems` : 'No bonus gems'}
          </p>
        </div>
      </div>

      <span
        className={`absolute right-3 flex h-5 w-5 items-center justify-center rounded-full border ${
          selected ? 'border-[#111111] bg-[#111111]' : 'border-[#D1D5DB] bg-white'
        } ${isBestValue ? 'top-11' : 'top-3'}`}
      >
        {selected ? <i className="fas fa-check text-[9px] text-[#F5C542]" /> : null}
      </span>
    </button>
  )
}

function PaymentMethodModal({
  selectedPackage,
  creating,
  onClose,
  onCreateManualPayment,
}) {
  if (!selectedPackage) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-4 sm:items-center sm:pb-0">
      <div className="w-full max-w-[430px] rounded-[28px] bg-white p-5 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[20px] font-black text-[#111111]">Payment Method</h3>
            <p className="mt-1 text-[12px] font-semibold leading-5 text-[#6B7280]">
              Choose a payment method to continue.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F4F6] text-[#111111] active:scale-95"
          >
            <i className="fas fa-times text-[14px]" />
          </button>
        </div>

        <div className="mb-4 rounded-[20px] border border-[#E5E7EB] bg-[#F8F8F8] p-4">
          <div className="flex items-center gap-3">
            <DiamondIcon selected size="h-11 w-11" />
            <div className="min-w-0 flex-1">
              <p className="text-[18px] font-black leading-none text-[#111111]">
                {formatNumber(selectedPackage.diamonds)} Diamonds
              </p>
              <p className="mt-1 text-[12px] font-bold text-[#6B7280]">
                {selectedPackage.bonus_gems > 0 ? `Bonus ${formatNumber(selectedPackage.bonus_gems)} Gems` : 'No bonus gems'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[15px] font-black text-[#111111]">{formatMoney(selectedPackage.package_usd)}</p>
              <p className="mt-0.5 text-[10px] font-black uppercase tracking-[0.08em] text-[#9CA3AF]">USD</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onCreateManualPayment}
          disabled={creating}
          className="flex w-full items-center justify-between rounded-[20px] border border-[#E5E7EB] bg-white p-4 text-left active:scale-[0.99] disabled:opacity-60"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-14 items-center justify-center rounded-xl bg-[#E91D2D] text-[13px] font-black text-white">
              KHQR
            </div>
            <div>
              <p className="text-[14px] font-black text-[#111111]">ABA PayWay</p>
              <p className="mt-1 text-[11px] font-semibold text-[#6B7280]">
                {creating ? 'Creating order...' : 'Open ABA link and upload proof'}
              </p>
            </div>
          </div>

          <i className="fas fa-chevron-right text-[14px] text-[#111111]" />
        </button>

        <button
          type="button"
          onClick={onClose}
          className="mt-3 h-12 w-full rounded-2xl bg-[#111111] text-[14px] font-black text-white active:scale-[0.99]"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function ManualProofModal({
  payment,
  selectedPackage,
  proofFile,
  proofPreview,
  submitting,
  proofChecked,
  message,
  onChooseFile,
  onSetProofChecked,
  onSubmitProof,
  onClose,
}) {
  if (!payment || !selectedPackage) return null

  async function copyText(value) {
    try {
      await navigator.clipboard.writeText(String(value || ''))
    } catch {}
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-4 sm:items-center sm:pb-0">
      <div className="max-h-[92vh] w-full max-w-[480px] overflow-y-auto rounded-[28px] bg-white p-5 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[20px] font-black text-[#111111]">Complete ABA Payment</h3>
            <p className="mt-1 text-[12px] font-semibold leading-5 text-[#6B7280]">
              Pay the exact amount, then upload your payment screenshot.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F4F6] text-[#111111] active:scale-95"
          >
            <i className="fas fa-times text-[14px]" />
          </button>
        </div>

        <div className="space-y-3 rounded-[22px] border border-[#E5E7EB] bg-[#F8F8F8] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.1em] text-[#6B7280]">Amount</p>
              <p className="mt-1 text-[26px] font-black text-[#111111]">{formatMoney(payment.amount_usd)}</p>
            </div>
            <button
              type="button"
              onClick={() => copyText(Number(payment.amount_usd).toFixed(2))}
              className="rounded-full border border-[#D1D5DB] bg-white px-3 py-2 text-[12px] font-black text-[#111111]"
            >
              Copy Amount
            </button>
          </div>

          <div className="h-px bg-[#E5E7EB]" />

          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.1em] text-[#6B7280]">Order ID</p>
              <p className="mt-1 break-all text-[14px] font-black text-[#111111]">{payment.order_id}</p>
            </div>
            <button
              type="button"
              onClick={() => copyText(payment.order_id)}
              className="shrink-0 rounded-full border border-[#D1D5DB] bg-white px-3 py-2 text-[12px] font-black text-[#111111]"
            >
              Copy
            </button>
          </div>
        </div>

        <a
          href={payment.checkout_url}
          target="_blank"
          rel="noreferrer"
          className="mt-4 flex h-14 w-full items-center justify-center rounded-[18px] bg-[#111111] text-[14px] font-black text-white active:scale-[0.99]"
        >
          Open ABA PayWay
        </a>

        <div className="mt-4 rounded-[22px] border border-[#E5E7EB] bg-white p-4">
          <p className="text-[13px] font-black text-[#111111]">Upload payment screenshot</p>
          <p className="mt-1 text-[12px] font-semibold leading-5 text-[#6B7280]">
            Upload the successful payment receipt from ABA. Admin will verify it before Diamonds are released.
          </p>

          <label className="mt-3 flex min-h-[130px] cursor-pointer flex-col items-center justify-center rounded-[18px] border border-dashed border-[#D1D5DB] bg-[#F8F8F8] p-4 text-center">
            {proofPreview ? (
              <img src={proofPreview} alt="Payment proof" className="max-h-[220px] rounded-xl object-contain" />
            ) : (
              <>
                <i className="fas fa-cloud-arrow-up text-[24px] text-[#111111]" />
                <span className="mt-2 text-[12px] font-black text-[#111111]">Choose screenshot</span>
                <span className="mt-1 text-[11px] font-semibold text-[#6B7280]">JPG, PNG, WEBP up to 5MB</span>
              </>
            )}

            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={onChooseFile} className="hidden" />
          </label>

          {proofFile ? (
            <p className="mt-2 truncate text-[11px] font-bold text-[#6B7280]">{proofFile.name}</p>
          ) : null}

          <label className="mt-4 flex items-start gap-3 rounded-[16px] bg-[#F8F8F8] p-3">
            <input
              type="checkbox"
              checked={proofChecked}
              onChange={(event) => onSetProofChecked(event.target.checked)}
              className="mt-1 h-4 w-4 accent-[#111111]"
            />
            <span className="text-[12px] font-bold leading-5 text-[#111111]">
              I have paid the exact amount {formatMoney(payment.amount_usd)} and uploaded the correct payment screenshot.
            </span>
          </label>

          <button
            type="button"
            onClick={onSubmitProof}
            disabled={submitting || !proofFile || !proofChecked}
            className="mt-4 h-13 w-full rounded-[18px] bg-[#111111] py-4 text-[14px] font-black text-white active:scale-[0.99] disabled:opacity-40"
          >
            {submitting ? 'Submitting...' : 'Submit Payment Proof'}
          </button>

          {message ? <p className="mt-3 text-center text-[12px] font-bold leading-5 text-[#111111]">{message}</p> : null}
        </div>
      </div>
    </div>
  )
}

export default function PurchaseSection() {
  const navigate = useNavigate()
  const previewRef = useRef('')
  const [wallet, setWallet] = useState(null)
  const [packages, setPackages] = useState(fallbackPackages)
  const [selectedUsd, setSelectedUsd] = useState(1)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [showPaymentMethods, setShowPaymentMethods] = useState(false)
  const [manualPayment, setManualPayment] = useState(null)
  const [proofFile, setProofFile] = useState(null)
  const [proofPreview, setProofPreview] = useState('')
  const [proofChecked, setProofChecked] = useState(false)
  const [creatingPayment, setCreatingPayment] = useState(false)
  const [submittingProof, setSubmittingProof] = useState(false)
  const [proofMessage, setProofMessage] = useState('')

  const selectedPackage = useMemo(
    () => packages.find((item) => Number(item.package_usd) === Number(selectedUsd)) || packages[0],
    [packages, selectedUsd]
  )

  function clearPreview() {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    previewRef.current = ''
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

  async function createManualPayment() {
    const token = getReaderToken()

    if (!token) {
      navigate('/login')
      return
    }

    if (!selectedPackage || creatingPayment) return

    try {
      setCreatingPayment(true)
      setProofMessage('')
      setProofFile(null)
      setProofChecked(false)
      clearPreview()
      setProofPreview('')

      const response = await fetch(`${API_BASE_URL}/api/purchase/manual/create`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ package_usd: selectedPackage.package_usd }),
      })
      const data = await response.json()

      if (!response.ok || !data.ok) throw new Error(data.message || 'Failed to create payment order.')

      setManualPayment(data.payment)
      setShowPaymentMethods(false)
    } catch (error) {
      setProofMessage(error.message || 'Failed to create payment order.')
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

    setProofMessage('')
    setShowPaymentMethods(true)
  }

  function handleChooseProof(event) {
    const file = event.target.files?.[0] || null

    clearPreview()
    setProofFile(file)

    if (file) {
      const preview = URL.createObjectURL(file)
      previewRef.current = preview
      setProofPreview(preview)
    } else {
      setProofPreview('')
    }
  }

  async function submitProof() {
    if (!manualPayment || !proofFile || !proofChecked || submittingProof) return

    try {
      setSubmittingProof(true)
      setProofMessage('')

      const formData = new FormData()
      formData.append('order_id', manualPayment.order_id)
      formData.append('proof_image', proofFile)

      const response = await fetch(`${API_BASE_URL}/api/purchase/manual/proof/${encodeURIComponent(manualPayment.order_id)}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      })
      const data = await response.json()

      if (!response.ok || !data.ok) throw new Error(data.message || 'Failed to submit payment proof.')

      setManualPayment(data.payment)
      setProofMessage('Payment proof submitted. Please wait for admin verification.')
      setProofFile(null)
      setProofChecked(false)
      clearPreview()
      setProofPreview('')
    } catch (error) {
      setProofMessage(error.message || 'Failed to submit payment proof.')
    } finally {
      setSubmittingProof(false)
    }
  }

  function closeManualProofModal() {
    setManualPayment(null)
    setProofFile(null)
    setProofChecked(false)
    setProofMessage('')
    clearPreview()
    setProofPreview('')
  }

  useEffect(() => {
    loadPurchaseData()

    return () => clearPreview()
  }, [])

  if (!getReaderToken()) {
    return (
      <section className="rounded-[24px] border border-[#E5E7EB] bg-white p-6 text-center shadow-[0_6px_16px_rgba(17,17,17,0.035)]">
        <h2 className="text-[20px] font-black text-[#111111]">Purchase Diamonds</h2>
        <p className="mx-auto mt-2 max-w-[320px] text-[13px] leading-6 text-[#6B7280]">
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
      <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_6px_16px_rgba(17,17,17,0.035)]">
        <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#6B7280]">My Balance</p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-[18px] border border-[#E5E7EB] bg-[#F8F8F8] p-4">
            <div className="flex items-center gap-3">
              <DiamondIcon size="h-9 w-9" />
              <div>
                <p className="text-[12px] font-bold text-[#6B7280]">Diamonds</p>
                <p className="mt-1 text-[23px] font-black text-[#111111]">{loading ? '...' : formatNumber(wallet?.diamond_balance)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-4">
            <p className="text-[12px] font-bold text-[#6B7280]">Gems</p>
            <p className="mt-1 text-[23px] font-black text-[#111111]">{loading ? '...' : formatNumber(wallet?.gem_balance)}</p>
          </div>
        </div>

        <p className="mt-3 text-[12px] leading-5 text-[#6B7280]">
          Diamonds unlock premium episodes. Bonus Gems are rewards from purchases and future tasks.
        </p>
      </div>

      <div>
        <div className="mb-3">
          <h2 className="text-[20px] font-black text-[#111111]">Choose Diamonds</h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

      {message ? <p className="text-center text-[12px] font-bold text-[#555]">{message}</p> : null}

      {showPaymentMethods ? (
        <PaymentMethodModal
          selectedPackage={selectedPackage}
          creating={creatingPayment}
          onClose={() => setShowPaymentMethods(false)}
          onCreateManualPayment={createManualPayment}
        />
      ) : null}

      {manualPayment ? (
        <ManualProofModal
          payment={manualPayment}
          selectedPackage={selectedPackage}
          proofFile={proofFile}
          proofPreview={proofPreview}
          submitting={submittingProof}
          proofChecked={proofChecked}
          message={proofMessage}
          onChooseFile={handleChooseProof}
          onSetProofChecked={setProofChecked}
          onSubmitProof={submitProof}
          onClose={closeManualProofModal}
        />
      ) : null}
    </section>
  )
}
