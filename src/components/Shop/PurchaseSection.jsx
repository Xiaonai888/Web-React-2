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

function formatDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleString()
}

function StatusBadge({ status }) {
  const styles = {
    pending: 'bg-[#fff7ed] text-[#c2410c] border-[#fed7aa]',
    approved: 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]',
    rejected: 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]',
  }

  return (
    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-extrabold capitalize ${styles[status] || styles.pending}`}>
      {status || 'pending'}
    </span>
  )
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

export default function PurchaseSection() {
  const navigate = useNavigate()
  const [wallet, setWallet] = useState(null)
  const [packages, setPackages] = useState(fallbackPackages)
  const [selectedUsd, setSelectedUsd] = useState(1)
  const [purchases, setPurchases] = useState([])
  const [payerName, setPayerName] = useState('')
  const [paymentReference, setPaymentReference] = useState('')
  const [proofFile, setProofFile] = useState(null)
  const [proofPreview, setProofPreview] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

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

      const [packagesResponse, walletResponse, requestsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/purchase/packages`),
        fetch(`${API_BASE_URL}/api/purchase/wallet`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/api/purchase/requests`, { headers: getHeaders() }),
      ])

      const packagesData = await packagesResponse.json()
      const walletData = await walletResponse.json()
      const requestsData = await requestsResponse.json()

      if (packagesData.ok && Array.isArray(packagesData.packages)) setPackages(packagesData.packages)
      if (walletData.ok) setWallet(walletData.wallet)
      if (requestsData.ok && Array.isArray(requestsData.purchases)) setPurchases(requestsData.purchases)
    } catch (error) {
      setMessage('Failed to load purchase data.')
    } finally {
      setLoading(false)
    }
  }

  async function uploadProofImage() {
    if (!proofFile) return ''

    const token = getReaderToken()
    const formData = new FormData()
    formData.append('image', proofFile)
    formData.append('folder', 'payment_proof')

    const response = await fetch(`${API_BASE_URL}/api/story-media/upload-image`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    })

    const data = await response.json()

    if (!response.ok || !data.ok) {
      throw new Error(data.message || 'Failed to upload payment proof.')
    }

    return data.image_url || data.imageUrl || ''
  }

  async function submitPurchase() {
    const token = getReaderToken()

    if (!token) {
      navigate('/login')
      return
    }

    if (!selectedPackage || submitting) return

    try {
      setSubmitting(true)
      setMessage('')

      const proofUrl = await uploadProofImage()

      const response = await fetch(`${API_BASE_URL}/api/purchase/requests`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          package_usd: selectedPackage.package_usd,
          payer_name: payerName,
          payment_reference: paymentReference,
          proof_url: proofUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.ok) {
        throw new Error(data.message || 'Failed to submit purchase request.')
      }

      setPayerName('')
      setPaymentReference('')
      setProofFile(null)
      setProofPreview('')
      setMessage('Purchase request submitted. Please wait for admin approval.')
      await loadPurchaseData()
    } catch (error) {
      setMessage(error.message || 'Failed to submit purchase request.')
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    loadPurchaseData()
  }, [])

  useEffect(() => {
    if (!proofFile) {
      setProofPreview('')
      return
    }

    const url = URL.createObjectURL(proofFile)
    setProofPreview(url)

    return () => URL.revokeObjectURL(url)
  }, [proofFile])

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

      <div className="rounded-3xl border border-[#eeeeee] bg-white p-5">
        <h3 className="text-[18px] font-black text-[#111]">Payment Request</h3>
        <p className="mt-1 text-[12px] leading-5 text-[#777]">
          Submit payment proof after sending payment. Admin will approve and add Diamonds to your wallet.
        </p>

        <div className="mt-4 rounded-2xl bg-[#f6f6f6] p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] font-bold text-[#666]">Selected</span>
            <span className="text-[15px] font-black text-[#111]">${selectedPackage?.package_usd}</span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-[13px] font-bold text-[#666]">You get</span>
            <span className="text-[13px] font-black text-[#111]">
              {formatNumber(selectedPackage?.diamonds)} Diamonds
              {selectedPackage?.bonus_gems > 0 ? ` + ${formatNumber(selectedPackage.bonus_gems)} Gems` : ''}
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <input
            value={payerName}
            onChange={(event) => setPayerName(event.target.value)}
            placeholder="Payer name"
            className="h-12 w-full rounded-2xl border border-[#e5e5e5] bg-white px-4 text-[14px] font-semibold text-[#111] outline-none focus:border-black"
          />

          <input
            value={paymentReference}
            onChange={(event) => setPaymentReference(event.target.value)}
            placeholder="Payment reference"
            className="h-12 w-full rounded-2xl border border-[#e5e5e5] bg-white px-4 text-[14px] font-semibold text-[#111] outline-none focus:border-black"
          />

          <label className="block rounded-2xl border border-dashed border-[#d4d4d4] bg-[#fafafa] p-4 text-center active:bg-[#f1f1f1]">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => setProofFile(event.target.files?.[0] || null)}
            />
            <span className="text-[13px] font-black text-[#111]">
              {proofFile ? proofFile.name : 'Upload payment proof'}
            </span>
            <span className="mt-1 block text-[11px] font-semibold text-[#777]">
              Screenshot or photo of payment receipt
            </span>
          </label>

          {proofPreview ? (
            <div className="overflow-hidden rounded-2xl border border-[#e5e5e5] bg-[#f6f6f6]">
              <img src={proofPreview} alt="Payment proof preview" className="max-h-[260px] w-full object-contain" />
            </div>
          ) : null}

          <button
            type="button"
            onClick={submitPurchase}
            disabled={submitting}
            className="h-12 w-full rounded-2xl bg-black text-[14px] font-black text-white disabled:opacity-60 active:scale-[0.99]"
          >
            {submitting ? 'Submitting...' : 'Submit Purchase Request'}
          </button>

          {message ? (
            <p className="text-center text-[12px] font-bold text-[#555]">{message}</p>
          ) : null}
        </div>
      </div>

      <div className="rounded-3xl border border-[#eeeeee] bg-white p-5">
        <h3 className="text-[18px] font-black text-[#111]">Recharge History</h3>

        <div className="mt-4 space-y-3">
          {purchases.length ? (
            purchases.map((item) => (
              <div key={item.id} className="rounded-2xl border border-[#eeeeee] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[15px] font-black text-[#111]">${item.package_usd}</p>
                    <p className="mt-1 text-[12px] font-semibold text-[#777]">
                      {formatNumber(item.diamonds)} Diamonds
                      {item.bonus_gems > 0 ? ` + ${formatNumber(item.bonus_gems)} Gems` : ''}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-[#999]">{formatDate(item.created_at)}</p>
                  </div>

                  <StatusBadge status={item.status} />
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl bg-[#f6f6f6] p-6 text-center">
              <p className="text-[13px] font-bold text-[#777]">No recharge history yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
