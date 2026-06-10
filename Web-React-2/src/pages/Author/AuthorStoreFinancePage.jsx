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
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return '$0.00'
  return `$${number.toFixed(2)}`
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function normalizeIncomePayload(data) {
  const summary = data?.summary || data?.income || data || {}
  const sales = Array.isArray(data?.sales)
    ? data.sales
    : Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data?.transactions)
        ? data.transactions
        : []

  return {
    availableBalance: Number(summary.available_balance ?? summary.availableBalance ?? 0),
    pendingBalance: Number(summary.pending_balance ?? summary.pendingBalance ?? 0),
    totalGross: Number(summary.total_gross ?? summary.totalGross ?? 0),
    platformFee: Number(summary.platform_fee ?? summary.platformFee ?? 0),
    totalNet: Number(summary.total_net ?? summary.totalNet ?? 0),
    paidOut: Number(summary.paid_out ?? summary.paidOut ?? 0),
    minimumWithdrawal: Number(summary.minimum_withdrawal ?? summary.minimumWithdrawal ?? 10),
    paymentMethod: data?.payment_method || data?.paymentMethod || summary.payment_method || null,
    sales,
  }
}

function StatusPill({ status }) {
  const normalized = String(status || 'completed').toLowerCase()
  const styles = {
    completed: 'bg-[#ecfdf3] text-[#047857]',
    paid: 'bg-[#ecfdf3] text-[#047857]',
    pending: 'bg-[#fff7ed] text-[#c2410c]',
    refund: 'bg-[#fff1f2] text-[#e11d48]',
    refunded: 'bg-[#fff1f2] text-[#e11d48]',
  }

  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${styles[normalized] || 'bg-[#f3f4f6] text-[#6b7280]'}`}>
      {status || 'Completed'}
    </span>
  )
}

function SummaryCard({ icon, label, value, hint, dark = false }) {
  return (
    <div className={`rounded-[24px] p-4 shadow-sm ring-1 ring-black/5 ${dark ? 'bg-[#111827] text-white' : 'bg-white text-[#111827]'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className={`text-[12px] font-bold ${dark ? 'text-white/70' : 'text-[#8b93a1]'}`}>{label}</div>
          <div className="mt-2 text-[24px] font-black leading-none tracking-tight">{value}</div>
          {hint ? <div className={`mt-2 text-[11.5px] font-semibold leading-5 ${dark ? 'text-white/65' : 'text-[#8b93a1]'}`}>{hint}</div> : null}
        </div>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${dark ? 'bg-white/12 text-white' : 'bg-[#f3f4f6] text-[#111827]'}`}>
          <i className={`fa-solid ${icon} text-[16px]`} />
        </span>
      </div>
    </div>
  )
}

function PaymentMethodCard({ method }) {
  const hasMethod = Boolean(method?.type || method?.account_name || method?.account_number || method?.email)

  return (
    <section className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[17px] font-black text-[#111827]">Payment Method</h2>
          <p className="mt-1 text-[12px] font-semibold leading-5 text-[#8b93a1]">
            This method will be used when you request a withdrawal.
          </p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
          <i className="fa-solid fa-wallet text-[16px]" />
        </span>
      </div>

      <div className="mt-4 rounded-[22px] bg-[#f8fafc] p-4">
        {hasMethod ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[13px] font-bold text-[#8b93a1]">Method</span>
              <span className="text-[13px] font-black text-[#111827]">{method.type || 'Payment account'}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[13px] font-bold text-[#8b93a1]">Name</span>
              <span className="line-clamp-1 text-right text-[13px] font-black text-[#111827]">{method.account_name || method.name || '—'}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[13px] font-bold text-[#8b93a1]">Account</span>
              <span className="line-clamp-1 text-right text-[13px] font-black text-[#111827]">{method.account_number || method.email || method.phone || '—'}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#f59e0b] ring-1 ring-black/5">
              <i className="fa-solid fa-triangle-exclamation text-[16px]" />
            </span>
            <div>
              <div className="text-[14px] font-black text-[#111827]">No payment method yet</div>
              <div className="mt-0.5 text-[12px] font-semibold text-[#8b93a1]">Add your payment method before requesting withdrawal.</div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function SaleRow({ sale }) {
  const title = sale.title || sale.book_title || sale.product_title || 'Book sale'
  const gross = Number(sale.gross_amount ?? sale.gross ?? sale.amount ?? 0)
  const fee = Number(sale.platform_fee ?? sale.fee ?? gross * 0.1)
  const net = Number(sale.net_amount ?? sale.net ?? Math.max(0, gross - fee))

  return (
    <div className="flex gap-3 border-b border-[#f1f3f6] px-1 py-4 last:border-b-0">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-[#f3f4f6] text-[#111827]">
        <i className="fa-solid fa-book text-[15px]" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="line-clamp-1 text-[14px] font-black text-[#111827]">{title}</div>
            <div className="mt-1 text-[11.5px] font-semibold text-[#8b93a1]">{formatDate(sale.created_at || sale.date)}</div>
          </div>
          <div className="text-right">
            <div className="text-[14px] font-black text-[#111827]">{formatMoney(net)}</div>
            <StatusPill status={sale.status || 'Completed'} />
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 rounded-[16px] bg-[#f8fafc] px-3 py-2 text-[11px] font-bold text-[#8b93a1]">
          <span>Gross {formatMoney(gross)}</span>
          <span>Fee {formatMoney(fee)}</span>
          <span>Net {formatMoney(net)}</span>
        </div>
      </div>
    </div>
  )
}

export default function AuthorIncomePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [income, setIncome] = useState(() => normalizeIncomePayload({}))

  const canWithdraw = income.availableBalance >= income.minimumWithdrawal
  const progressPercent = useMemo(() => {
    if (income.minimumWithdrawal <= 0) return 100
    return Math.max(0, Math.min(100, (income.availableBalance / income.minimumWithdrawal) * 100))
  }, [income.availableBalance, income.minimumWithdrawal])

  async function loadIncome() {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const response = await fetch(`${API_BASE_URL}/api/authors/store/income`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Income API is not ready yet.')
      }

      setIncome(normalizeIncomePayload(data))
    } catch (error) {
      setMessage(error.message || 'Income API is not ready yet.')
      setIncome(normalizeIncomePayload({}))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadIncome()
  }, [])

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-10">
      <header className="sticky top-0 z-30 border-b border-[#edf0f4] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[56px] max-w-[920px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0 flex-1 px-3 text-center">
            <h1 className="line-clamp-1 text-[17px] font-black text-[#111827]">My Income</h1>
          </div>

          <button
            type="button"
            onClick={loadIncome}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827] active:scale-95"
            aria-label="Refresh income"
          >
            <i className={`fa-solid fa-rotate-right text-[14px] ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[920px] px-4 pt-4">
        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mb-4 w-full rounded-[18px] bg-[#fff7ed] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#c2410c]"
          >
            {message}
          </button>
        ) : null}

        <section className="rounded-[30px] bg-[#111827] p-5 text-white shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[12px] font-bold uppercase tracking-[0.16em] text-white/60">Available Balance</div>
              <div className="mt-3 text-[38px] font-black leading-none tracking-tight">{formatMoney(income.availableBalance)}</div>
              <p className="mt-3 max-w-[520px] text-[12.5px] font-semibold leading-5 text-white/65">
                This is your net income after the 10% platform fee has already been deducted from book and PDF sales.
              </p>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/12">
              <i className="fa-solid fa-sack-dollar text-[20px]" />
            </span>
          </div>

          <div className="mt-5 rounded-[22px] bg-white/10 p-4">
            <div className="flex items-center justify-between text-[12px] font-bold text-white/70">
              <span>Minimum withdrawal</span>
              <span>{formatMoney(income.minimumWithdrawal)}</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-white" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-[12px] font-semibold text-white/65">
                {canWithdraw ? 'Ready to request withdrawal.' : `${formatMoney(Math.max(0, income.minimumWithdrawal - income.availableBalance))} more needed.`}
              </span>
              <button
                type="button"
                onClick={() => navigate('/author/page/store/withdrawal')}
                disabled={!canWithdraw}
                className="h-10 rounded-full bg-white px-4 text-[13px] font-black text-[#111827] active:scale-[0.98] disabled:opacity-50"
              >
                Withdraw
              </button>
            </div>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <SummaryCard icon="fa-clock" label="Pending" value={formatMoney(income.pendingBalance)} hint="Waiting to clear" />
          <SummaryCard icon="fa-receipt" label="Gross Sales" value={formatMoney(income.totalGross)} hint="Before platform fee" />
          <SummaryCard icon="fa-percent" label="Platform Fee" value={formatMoney(income.platformFee)} hint="10% deducted" />
          <SummaryCard icon="fa-circle-check" label="Paid Out" value={formatMoney(income.paidOut)} hint="Completed payouts" />
        </section>

        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_340px]">
          <section className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[17px] font-black text-[#111827]">Income History</h2>
                <p className="mt-1 text-[12px] font-semibold text-[#8b93a1]">Recent book and PDF sales after fee calculation.</p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
                <i className="fa-solid fa-chart-line text-[15px]" />
              </span>
            </div>

            <div className="mt-3">
              {loading ? (
                <div className="space-y-3 py-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="h-20 animate-pulse rounded-[20px] bg-[#f3f4f6]" />
                  ))}
                </div>
              ) : income.sales.length ? (
                income.sales.slice(0, 12).map((sale, index) => (
                  <SaleRow key={sale.id || sale.order_id || index} sale={sale} />
                ))
              ) : (
                <div className="py-10 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f4f6] text-[#9ca3af]">
                    <i className="fa-solid fa-receipt text-[20px]" />
                  </div>
                  <div className="mt-4 text-[15px] font-black text-[#111827]">No income yet</div>
                  <p className="mx-auto mt-2 max-w-[280px] text-[12px] font-semibold leading-5 text-[#8b93a1]">
                    Your net sales income will appear here after readers buy your books or PDFs.
                  </p>
                </div>
              )}
            </div>
          </section>

          <div className="space-y-4">
            <PaymentMethodCard method={income.paymentMethod} />

            <section className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-black/5">
              <h2 className="text-[17px] font-black text-[#111827]">How income works</h2>
              <div className="mt-4 space-y-3">
                <div className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3f4f6] text-[12px] font-black text-[#111827]">1</span>
                  <p className="text-[12.5px] font-semibold leading-5 text-[#6b7280]">Reader buys your book or PDF from the author store.</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3f4f6] text-[12px] font-black text-[#111827]">2</span>
                  <p className="text-[12.5px] font-semibold leading-5 text-[#6b7280]">Shadow deducts the 10% platform fee automatically.</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3f4f6] text-[12px] font-black text-[#111827]">3</span>
                  <p className="text-[12.5px] font-semibold leading-5 text-[#6b7280]">The remaining net amount becomes available for withdrawal after it clears.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
