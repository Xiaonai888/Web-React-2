import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

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

function normalizeIncomePayload(data) {
  const summary = data.summary || data.income || data.wallet || data.balance || {}
  const withdrawals = Array.isArray(data.withdrawals)
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
      0
  )

  const paidOut = Number(
    summary.paid_out ??
      summary.paidOut ??
      data.paid_out ??
      data.paidOut ??
      0
  )

  const totalOrders = Number(
    summary.total_orders ??
      summary.totalOrders ??
      data.total_orders ??
      data.totalOrders ??
      0
  )

  return {
    availableBalance: Number.isFinite(availableBalance) ? availableBalance : 0,
    pendingBalance: Number.isFinite(pendingBalance) ? pendingBalance : 0,
    grossSales: Number.isFinite(grossSales) ? grossSales : 0,
    platformFee: Number.isFinite(platformFee) ? platformFee : 0,
    paidOut: Number.isFinite(paidOut) ? paidOut : 0,
    totalOrders: Number.isFinite(totalOrders) ? totalOrders : 0,
    withdrawals,
  }
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

function WithdrawalRow({ request }) {
  const amount = Number(request.amount || request.requested_amount || request.net_amount || 0)
  const status = request.status || request.state || 'in_review'
  const requestedAt = request.created_at || request.requested_at || request.date

  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#f0eef6] py-4 last:border-b-0">
      <div className="min-w-0">
        <div className="text-[14px] font-black text-[#111827]">{formatMoney(amount)}</div>
        <div className="mt-1 text-[12px] font-semibold text-[#8b93a1]">{formatDate(requestedAt)}</div>
      </div>
      <span className="shrink-0 rounded-full bg-[#fff7ed] px-3 py-1 text-[11px] font-black text-[#c2410c]">
        {String(status || 'In Review').replaceAll('_', ' ')}
      </span>
    </div>
  )
}

export default function AuthorPageIncomePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [income, setIncome] = useState({
    availableBalance: 0,
    pendingBalance: 0,
    grossSales: 0,
    platformFee: 0,
    paidOut: 0,
    totalOrders: 0,
    withdrawals: [],
  })

  const recentWithdrawals = useMemo(() => income.withdrawals.slice(0, 5), [income.withdrawals])

  async function loadIncome() {
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
        throw new Error(data.message || 'Failed to load income')
      }

      setIncome(normalizeIncomePayload(data))
    } catch (error) {
      setMessage(error.message || 'Failed to load income')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadIncome()
  }, [])

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-10">
      <header className="sticky top-0 z-40 border-b border-[#eef0f4] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[980px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate('/author/page/finance')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
            aria-label="Back"
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="text-[16px] font-black text-[#111827]">Income</div>

          <button
            type="button"
            onClick={loadIncome}
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
            <h1 className="mt-1 text-[26px] font-black tracking-tight">Income</h1>
            <p className="mt-2 text-[13px] font-semibold leading-6 text-white/65">
              Track your Author Page store income, available balance, pending balance, and payout history.
            </p>
          </div>

          <div className="grid grid-cols-2 border-t border-white/10 sm:grid-cols-4">
            <div className="p-4">
              <div className="text-[11px] font-bold text-white/45">Available</div>
              <div className="mt-1 text-[20px] font-black">{loading ? '...' : formatMoney(income.availableBalance)}</div>
            </div>
            <div className="p-4">
              <div className="text-[11px] font-bold text-white/45">Pending</div>
              <div className="mt-1 text-[20px] font-black">{loading ? '...' : formatMoney(income.pendingBalance)}</div>
            </div>
            <div className="p-4">
              <div className="text-[11px] font-bold text-white/45">Gross Sales</div>
              <div className="mt-1 text-[20px] font-black">{loading ? '...' : formatMoney(income.grossSales)}</div>
            </div>
            <div className="p-4">
              <div className="text-[11px] font-bold text-white/45">Orders</div>
              <div className="mt-1 text-[20px] font-black">{loading ? '...' : income.totalOrders}</div>
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <StatCard label="Platform Fee" value={loading ? '...' : formatMoney(income.platformFee)} icon="fa-percent" />
          <StatCard label="Paid Out" value={loading ? '...' : formatMoney(income.paidOut)} icon="fa-circle-check" />
          <StatCard label="Pending Review" value={loading ? '...' : formatMoney(income.pendingBalance)} icon="fa-clock" />
        </section>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-black text-[#111827]">Withdrawal</h2>
              <p className="mt-1 text-[12px] font-semibold leading-5 text-[#8b93a1]">
                Request a payout when your available balance is ready.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/author/page/finance/withdrawal?back=income')}
              className="h-10 rounded-full bg-[#111827] px-4 text-[12px] font-black text-white active:scale-95"
            >
              Withdraw
            </button>
          </div>
        </Card>

        <Card>
          <div className="mb-1 flex items-center justify-between gap-3">
            <h2 className="text-[18px] font-black text-[#111827]">Recent Withdrawals</h2>
            <button
              type="button"
              onClick={() => navigate('/author/page/finance/withdrawal?back=income')}
              className="text-[12px] font-black text-[#6b7280]"
            >
              View all
            </button>
          </div>

          {recentWithdrawals.length > 0 ? (
            <div className="mt-2">
              {recentWithdrawals.map((request, index) => (
                <WithdrawalRow key={request.id || index} request={request} />
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
