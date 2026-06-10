import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const MIN_WITHDRAWAL_AMOUNT = 10
const PLATFORM_FEE_RATE = 0.1

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

  const grossSales = Number(
    summary.gross_sales ??
      summary.grossSales ??
      data.gross_sales ??
      data.grossSales ??
      0
  )

  const platformFee = Number(
    summary.platform_fee ??
      summary.platformFee ??
      data.platform_fee ??
      data.platformFee ??
      grossSales * PLATFORM_FEE_RATE
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
    grossSales: Number.isFinite(grossSales) ? grossSales : 0,
    platformFee: Number.isFinite(platformFee) ? platformFee : 0,
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

function StatCard({ label, value, icon, hint }) {
  return (
    <div className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
        <i className={`fa-solid ${icon} text-[15px]`} />
      </div>
      <div className="text-[11.5px] font-bold uppercase tracking-[0.08em] text-[#9ca3af]">{label}</div>
      <div className="mt-1 text-[20px] font-black text-[#111827]">{value}</div>
      {hint ? <div className="mt-1 text-[11.5px] font-semibold text-[#8b93a1]">{hint}</div> : null}
    </div>
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

export default function AuthorStoreWithdrawalPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [amount, setAmount] = useState('')
  const [income, setIncome] = useState({
    availableBalance: 0,
    pendingBalance: 0,
    grossSales: 0,
    platformFee: 0,
    paidOut: 0,
    paymentMethod: null,
    requests: [],
  })

  const availableBalance = Number(income.availableBalance || 0)
  const requestedAmount = Number(amount || 0)
  const canWithdraw = availableBalance >= MIN_WITHDRAWAL_AMOUNT
  const validAmount = Number.isFinite(requestedAmount) && requestedAmount >= MIN_WITHDRAWAL_AMOUNT && requestedAmount <= availableBalance
  const paymentLabel = getPaymentLabel(income.paymentMethod)
  const progressPercent = Math.min(100, Math.max(0, (availableBalance / MIN_WITHDRAWAL_AMOUNT) * 100))
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

      const response = await fetch(`${API_BASE_URL}/api/authors/store/income`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Income API is not ready yet.')
      }

      setIncome(normalizeIncomePayload(data))
    } catch (error) {
      setMessage(error.message || 'Failed to load withdrawal data.')
      setIncome((current) => ({ ...current }))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWithdrawalData()
  }, [])

  function handleMaxAmount() {
    setAmount(availableBalance > 0 ? availableBalance.toFixed(2) : '')
  }

  async function handleRequestWithdrawal() {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    if (!canWithdraw) {
      setMessage(`Minimum withdrawal is ${formatMoney(MIN_WITHDRAWAL_AMOUNT)}.`)
      return
    }

    if (!income.paymentMethod) {
      setMessage('Please add a payment method before requesting a withdrawal.')
      return
    }

    if (!validAmount) {
      setMessage(`Enter an amount from ${formatMoney(MIN_WITHDRAWAL_AMOUNT)} to ${formatMoney(availableBalance)}.`)
      return
    }

    try {
      setSaving(true)
      setMessage('')

      const response = await fetch(`${API_BASE_URL}/api/authors/store/withdrawals`, {
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
        throw new Error(data.message || 'Failed to request withdrawal.')
      }

      setMessage('Withdrawal request sent for review.')
      setAmount('')
      await loadWithdrawalData()
    } catch (error) {
      setMessage(error.message || 'Failed to request withdrawal.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-10">
      <header className="sticky top-0 z-30 border-b border-[#eef0f3] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[58px] max-w-[920px] items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827] active:scale-95"
            aria-label="Back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0">
            <h1 className="line-clamp-1 text-[18px] font-black text-[#111827]">Withdrawal</h1>
            <p className="text-[11.5px] font-semibold text-[#8b93a1]">Request payout from your net store income.</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[920px] space-y-4 px-4 pt-4">
        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="w-full rounded-[18px] bg-white px-4 py-3 text-left text-[12.5px] font-bold leading-5 text-[#111827] shadow-sm ring-1 ring-black/5"
          >
            {message}
          </button>
        ) : null}

        <Card className="overflow-hidden bg-[#111827] p-0 text-white ring-0">
          <div className="relative overflow-hidden p-5">
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10" />
            <div className="absolute -bottom-14 right-10 h-40 w-40 rounded-full bg-white/5" />

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[12px] font-bold uppercase tracking-[0.1em] text-white/60">
                    Available to withdraw
                  </div>
                  <div className="mt-2 text-[34px] font-black tracking-tight">
                    {loading ? '...' : formatMoney(availableBalance)}
                  </div>
                  <div className="mt-1 text-[12.5px] font-semibold text-white/65">
                    Net income after 10% platform fee.
                  </div>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                  <i className="fa-solid fa-wallet text-[20px]" />
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-[11.5px] font-bold text-white/65">
                  <span>Minimum withdrawal</span>
                  <span>{formatMoney(MIN_WITHDRAWAL_AMOUNT)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full bg-white"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard
            label="Pending"
            value={formatMoney(income.pendingBalance)}
            icon="fa-clock"
            hint="Not available yet"
          />
          <StatCard
            label="Gross sales"
            value={formatMoney(income.grossSales)}
            icon="fa-receipt"
            hint="Before fee"
          />
          <StatCard
            label="Platform fee"
            value={formatMoney(income.platformFee)}
            icon="fa-percent"
            hint="10% fee"
          />
          <StatCard
            label="Paid out"
            value={formatMoney(income.paidOut)}
            icon="fa-circle-check"
            hint="Completed"
          />
        </div>

        <Card>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[18px] font-black text-[#111827]">Request withdrawal</h2>
              <p className="mt-1 text-[12.5px] font-semibold leading-5 text-[#8b93a1]">
                Your request will be sent to admin and Telegram group for review.
              </p>
            </div>
            <span className="rounded-full bg-[#f3f4f6] px-3 py-1 text-[11px] font-black text-[#111827]">
              In Review
            </span>
          </div>

          <div className="rounded-[22px] bg-[#f9fafb] p-4">
            <div className="text-[11.5px] font-bold uppercase tracking-[0.08em] text-[#9ca3af]">
              Payment method
            </div>
            <div className="mt-2 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="line-clamp-1 text-[14px] font-black text-[#111827]">{paymentLabel}</div>
                <div className="mt-0.5 text-[12px] font-semibold text-[#8b93a1]">
                  Same payment method used in My Income.
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/author/dashboard?section=income')}
                className="shrink-0 rounded-full bg-white px-3 py-2 text-[12px] font-black text-[#111827] shadow-sm ring-1 ring-black/5 active:scale-95"
              >
                Edit
              </button>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.08em] text-[#8b93a1]">
              Amount
            </label>
            <div className="flex items-center gap-3 rounded-[20px] bg-white px-4 py-3 ring-1 ring-[#e5e7eb]">
              <span className="text-[18px] font-black text-[#111827]">$</span>
              <input
                type="number"
                inputMode="decimal"
                min={MIN_WITHDRAWAL_AMOUNT}
                max={availableBalance}
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0.00"
                className="min-w-0 flex-1 bg-transparent text-[22px] font-black text-[#111827] outline-none placeholder:text-[#c7cbd1]"
              />
              <button
                type="button"
                onClick={handleMaxAmount}
                className="rounded-full bg-[#f3f4f6] px-3 py-2 text-[11px] font-black text-[#111827] active:scale-95"
              >
                MAX
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between text-[11.5px] font-semibold text-[#8b93a1]">
              <span>Minimum {formatMoney(MIN_WITHDRAWAL_AMOUNT)}</span>
              <span>Available {formatMoney(availableBalance)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRequestWithdrawal}
            disabled={saving || loading || !validAmount || !income.paymentMethod}
            className="mt-5 flex h-13 w-full items-center justify-center rounded-full bg-[#111827] text-[14px] font-black text-white active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {saving ? 'Sending request...' : 'Request Withdrawal'}
          </button>

          {!canWithdraw ? (
            <div className="mt-3 rounded-[18px] bg-[#fff7ed] px-4 py-3 text-[12.5px] font-bold leading-5 text-[#c2410c]">
              You need at least {formatMoney(MIN_WITHDRAWAL_AMOUNT)} available balance before requesting withdrawal.
            </div>
          ) : null}
        </Card>

        <Card>
          <div className="mb-2 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-[18px] font-black text-[#111827]">Withdrawal history</h2>
              <p className="mt-1 text-[12.5px] font-semibold text-[#8b93a1]">
                Track your requests and admin review status.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-16 animate-pulse rounded-[18px] bg-[#f3f4f6]" />
              ))}
            </div>
          ) : recentRequests.length ? (
            <div>
              {recentRequests.map((request, index) => (
                <WithdrawalHistoryItem
                  key={request.id || request.request_id || `${request.created_at || 'request'}-${index}`}
                  request={request}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
                <i className="fa-solid fa-money-bill-transfer text-[18px]" />
              </div>
              <div className="mt-3 text-[15px] font-black text-[#111827]">No withdrawal requests yet</div>
              <div className="mx-auto mt-1 max-w-[280px] text-[12.5px] font-semibold leading-5 text-[#8b93a1]">
                Once you request a payout, the status will appear here.
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
