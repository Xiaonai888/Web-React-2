import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const MIN_WITHDRAWAL_AMOUNT = 10

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatMoney(value) {
  const amount = Number(value || 0)

  if (!Number.isFinite(amount)) return '$0.00'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

function formatDate(value) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '—'

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

function normalizeStatus(status) {
  const value = String(status || '').toLowerCase()

  if (value === 'approved') return 'Approved'
  if (value === 'paid') return 'Paid'
  if (value === 'rejected') return 'Rejected'
  if (value === 'cancelled') return 'Cancelled'

  return 'In Review'
}

function getStatusClass(status) {
  const value = normalizeStatus(status)

  if (value === 'Paid') return 'bg-[#ecfdf5] text-[#047857]'
  if (value === 'Approved') return 'bg-[#eff6ff] text-[#1d4ed8]'
  if (value === 'Rejected') return 'bg-[#fff1f2] text-[#be123c]'
  if (value === 'Cancelled') return 'bg-[#f3f4f6] text-[#6b7280]'

  return 'bg-[#fff7ed] text-[#c2410c]'
}

function getReadablePaymentMethod(method) {
  const value = String(method || '').toLowerCase()

  if (value === 'aba') return 'ABA Bank'
  if (value === 'paypal') return 'PayPal'
  if (value === 'bank') return 'Bank Transfer'
  if (value === 'wing') return 'Wing'
  if (value === 'truemoney') return 'TrueMoney'

  return method || 'No payment method'
}

function normalizeIncomePayload(data) {
  const summary = data.summary || data.income || data.wallet || data.balance || {}
  const paymentMethod = data.payment_method || data.paymentMethod || data.payout_method || data.payoutMethod || null
  const requests = Array.isArray(data.withdrawals)
    ? data.withdrawals
    : Array.isArray(data.requests)
      ? data.requests
      : Array.isArray(data.withdrawal_requests)
        ? data.withdrawal_requests
        : []

  const availableBalance = Number(
    summary.available_balance ??
      summary.availableBalance ??
      data.available_balance ??
      data.availableBalance ??
      0
  )

  const pendingBalance = Number(
    summary.pending_balance ??
      summary.pendingBalance ??
      data.pending_balance ??
      data.pendingBalance ??
      0
  )

  const paidOut = Number(
    summary.paid_out ??
      summary.paidOut ??
      data.paid_out ??
      data.paidOut ??
      0
  )

  return {
    availableBalance: Number.isFinite(availableBalance) ? availableBalance : 0,
    pendingBalance: Number.isFinite(pendingBalance) ? pendingBalance : 0,
    paidOut: Number.isFinite(paidOut) ? paidOut : 0,
    paymentMethod,
    requests,
  }
}

function getPaymentLabel(paymentMethod) {
  if (!paymentMethod) return 'Add payment method first'

  const method = getReadablePaymentMethod(paymentMethod.method || paymentMethod.type || paymentMethod.provider)

  const accountName =
    paymentMethod.account_name ||
    paymentMethod.accountName ||
    paymentMethod.name ||
    paymentMethod.holder_name ||
    paymentMethod.holderName ||
    ''

  const accountNumber =
    paymentMethod.account_number ||
    paymentMethod.accountNumber ||
    paymentMethod.email ||
    paymentMethod.phone ||
    paymentMethod.wallet_id ||
    paymentMethod.walletId ||
    ''

  return [method, accountName, accountNumber].filter(Boolean).join(' · ') || method
}

function Card({ children, className = '' }) {
  return (
    <section className={`rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5 ${className}`}>
      {children}
    </section>
  )
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-black ${getStatusClass(status)}`}>
      {normalizeStatus(status)}
    </span>
  )
}

function WithdrawalHistoryItem({ request }) {
  const amount = Number(request.amount || request.requested_amount || request.net_amount || 0)
  const status = request.status || request.state || 'in_review'
  const requestedAt = request.created_at || request.requested_at || request.date
  const method = getReadablePaymentMethod(request.payment_method || request.method || request.provider)

  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#f0eef6] py-4 last:border-b-0">
      <div className="min-w-0">
        <div className="text-[15px] font-black text-[#111827]">{formatMoney(amount)}</div>
        <div className="mt-1 text-[12px] font-semibold text-[#8b93a1]">
          {formatDate(requestedAt)} · {method}
        </div>
        {request.admin_note || request.note ? (
          <div className="mt-2 rounded-[14px] bg-[#f9fafb] px-3 py-2 text-[12px] font-semibold leading-5 text-[#6b7280]">
            {request.admin_note || request.note}
          </div>
        ) : null}
      </div>

      <StatusBadge status={status} />
    </div>
  )
}

export default function AuthorPageWithdrawalPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [amount, setAmount] = useState('')
  const [income, setIncome] = useState({
    availableBalance: 0,
    pendingBalance: 0,
    paidOut: 0,
    paymentMethod: null,
    requests: [],
  })

  const availableBalance = Number(income.availableBalance || 0)
  const requestedAmount = Number(amount || 0)
  const canWithdraw = availableBalance >= MIN_WITHDRAWAL_AMOUNT
  const validAmount = Number.isFinite(requestedAmount) && requestedAmount >= MIN_WITHDRAWAL_AMOUNT && requestedAmount <= availableBalance
  const paymentLabel = getPaymentLabel(income.paymentMethod)
  const recentRequests = useMemo(() => income.requests.slice(0, 20), [income.requests])

  async function loadWithdrawalData() {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const response = await fetch(`${API_BASE_URL}/api/author-store/me/income`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to load withdrawal data')
      }

      setIncome(normalizeIncomePayload(data))
    } catch (error) {
      setMessage(error.message || 'Failed to load withdrawal data')
    } finally {
      setLoading(false)
    }
  }

  async function submitWithdrawal() {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    if (!validAmount) {
      setMessage(`Withdrawal amount must be between ${formatMoney(MIN_WITHDRAWAL_AMOUNT)} and ${formatMoney(availableBalance)}.`)
      return
    }

    if (!income.paymentMethod) {
      setMessage('Please add a payment method before requesting withdrawal.')
      return
    }

    try {
      setSaving(true)
      setMessage('')

      const response = await fetch(`${API_BASE_URL}/api/author-store/me/withdrawals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: requestedAmount,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to request withdrawal')
      }

      setAmount('')
      setMessage('Withdrawal request submitted.')
      await loadWithdrawalData()
    } catch (error) {
      setMessage(error.message || 'Failed to request withdrawal')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    loadWithdrawalData()
  }, [])

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-10">
      <header className="sticky top-0 z-40 border-b border-[#eef0f4] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[980px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate('/author/page/finance/income')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
            aria-label="Back"
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="text-[16px] font-black text-[#111827]">Withdrawal</div>

          <button
            type="button"
            onClick={loadWithdrawalData}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827] active:scale-95"
            aria-label="Refresh"
          >
            <i className="fa-solid fa-rotate-right text-[13px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[980px] space-y-4 px-4 py-4">
        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="w-full rounded-[18px] bg-[#fff7ed] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#9a3412]"
          >
            {message}
          </button>
        ) : null}

        <section className="overflow-hidden rounded-[30px] bg-[#111827] text-white shadow-sm">
          <div className="p-5">
            <div className="text-[12px] font-black uppercase tracking-[0.08em] text-white/55">Author Page Finance</div>
            <h1 className="mt-1 text-[26px] font-black tracking-tight">Withdrawal</h1>
            <p className="mt-2 text-[13px] font-semibold leading-6 text-white/65">
              Request payout from your Author Page income.
            </p>
          </div>

          <div className="grid grid-cols-3 border-t border-white/10">
            <div className="p-4">
              <div className="text-[11px] font-bold text-white/45">Available</div>
              <div className="mt-1 text-[18px] font-black">{loading ? '...' : formatMoney(income.availableBalance)}</div>
            </div>
            <div className="p-4">
              <div className="text-[11px] font-bold text-white/45">Pending</div>
              <div className="mt-1 text-[18px] font-black">{loading ? '...' : formatMoney(income.pendingBalance)}</div>
            </div>
            <div className="p-4">
              <div className="text-[11px] font-bold text-white/45">Paid Out</div>
              <div className="mt-1 text-[18px] font-black">{loading ? '...' : formatMoney(income.paidOut)}</div>
            </div>
          </div>
        </section>

        <Card>
          <h2 className="text-[18px] font-black text-[#111827]">Request Withdrawal</h2>
          <p className="mt-1 text-[12px] font-semibold leading-5 text-[#8b93a1]">
            Minimum withdrawal amount is {formatMoney(MIN_WITHDRAWAL_AMOUNT)}.
          </p>

          <div className="mt-4 rounded-[22px] bg-[#f8fafc] p-4 ring-1 ring-black/5">
            <div className="text-[11px] font-black uppercase tracking-[0.08em] text-[#6b7280]">Payment Method</div>
            <div className="mt-1 text-[13px] font-black text-[#111827]">{paymentLabel}</div>
            <button
              type="button"
              onClick={() => navigate('/author/payment-method?back=/author/page/finance/withdrawal')}
              className="mt-3 h-10 rounded-full bg-white px-4 text-[12px] font-black text-[#111827] ring-1 ring-black/10 active:scale-95"
            >
              Edit Payment Method
            </button>
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-[11px] font-black uppercase tracking-[0.08em] text-[#374151]">
              Amount
            </label>
            <input
              type="number"
              min={MIN_WITHDRAWAL_AMOUNT}
              max={availableBalance}
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
              className="h-12 w-full rounded-2xl border border-[#d9e1ec] bg-white px-3.5 text-[14px] font-bold text-[#111827] outline-none focus:border-[#111827]"
            />
          </div>

          <button
            type="button"
            onClick={submitWithdrawal}
            disabled={saving || loading || !canWithdraw}
            className="mt-4 h-12 w-full rounded-full bg-[#111827] text-[13px] font-black text-white active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Submitting...' : canWithdraw ? 'Submit Withdrawal' : `Need at least ${formatMoney(MIN_WITHDRAWAL_AMOUNT)}`}
          </button>
        </Card>

        <Card>
          <div className="mb-1 flex items-center justify-between gap-3">
            <h2 className="text-[18px] font-black text-[#111827]">Withdrawal History</h2>
          </div>

          {recentRequests.length > 0 ? (
            <div className="mt-2">
              {recentRequests.map((request, index) => (
                <WithdrawalHistoryItem key={request.id || index} request={request} />
              ))}
            </div>
          ) : (
            <div className="rounded-[22px] bg-[#f8fafc] px-4 py-6 text-center text-[13px] font-semibold text-[#8b93a1]">
              No withdrawal history yet.
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
