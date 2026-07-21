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

function money(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '$0.00'

  return `$${number.toFixed(2)}`
}

function percent(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0%'

  return `${number.toFixed(number % 1 === 0 ? 0 : 1)}%`
}

function dateText(value) {
  if (!value) return 'Not scheduled yet'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Not scheduled yet'

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function methodLabel(method) {
  if (!method) return 'Missing'
  if (method.method_type === 'bank_qr') return 'Bank QR'
  if (method.method_type === 'paypal') return 'PayPal'
  if (method.method_type === 'phone') return 'Phone Number'
  return 'Payment Method'
}

function statusStyle(status) {
  if (status === 'paid') return 'bg-[#ecfdf3] text-[#16803c]'
  if (status === 'failed' || status === 'missing_payment_method') return 'bg-[#fff1f2] text-[#e11d48]'
  if (status === 'scheduled') return 'bg-[#fff7ed] text-[#c05621]'
  return 'bg-[#f2f4f7] text-[#667085]'
}

function normalizeEarning(item) {
  const metadata = item.metadata || {}

  return {
    id: item.id,
    title: metadata.story_title || metadata.episode_title || 'Episode unlock',
    subtitle: metadata.package_label || metadata.episode_title || 'Diamond unlock',
    amount: Number(item.author_net_payout_usd || 0),
    diamonds: Number(item.author_earned_diamonds || 0),
    share: Number(item.author_share_percent || 0),
    status: item.earning_status || 'available',
    createdAt: item.created_at,
  }
}

function HeaderButton({ icon, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5 active:scale-95"
    >
      <i className={`${icon} text-[15px]`} />
    </button>
  )
}

function SummaryCard({ label, value, detail, icon, dark = false }) {
  return (
        <div className={`flex h-full min-h-[142px] flex-col justify-between rounded-[24px] p-4 shadow-sm ring-1 ring-black/5 ${dark ? 'bg-[#111827] text-white' : 'bg-white text-[#111827]'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className={`text-[11px] font-extrabold uppercase tracking-[0.08em] ${dark ? 'text-white/55' : 'text-[#98a2b3]'}`}>
            {label}
          </div>
          <div className="mt-3 text-[25px] font-black tracking-[-0.04em]">{value}</div>
        </div>

        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${dark ? 'bg-white/10 text-[#f7c948]' : 'bg-[#f7f4ee] text-[#c89b1e]'}`}>
          <i className={`${icon} text-[15px]`} />
        </div>
      </div>

      <div className={`mt-3 text-[12px] font-semibold leading-5 ${dark ? 'text-white/60' : 'text-[#8d94a1]'}`}>
        {detail}
      </div>
    </div>
  )
}

function SmallStat({ label, value }) {
  return (
    <div className="rounded-[20px] bg-white/10 px-3 py-3 text-center">
      <div className="text-[17px] font-black text-white">{value}</div>
      <div className="mt-1 text-[10.5px] font-bold uppercase tracking-[0.06em] text-white/50">{label}</div>
    </div>
  )
}

function SectionCard({ title, subtitle, action, children }) {
  return (
    <section className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[18px] font-black tracking-[-0.03em] text-[#111827]">{title}</h2>
          {subtitle ? <p className="mt-1 text-[12.5px] font-medium leading-5 text-[#8d94a1]">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function EmptyState({ icon, title, text }) {
  return (
    <div className="rounded-[22px] border border-dashed border-[#e4e7ec] bg-[#fafafa] px-4 py-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#98a2b3] shadow-sm ring-1 ring-black/5">
        <i className={`${icon} text-[17px]`} />
      </div>
      <div className="mt-3 text-[14px] font-black text-[#111827]">{title}</div>
      <div className="mx-auto mt-1 max-w-[270px] text-[12px] font-medium leading-5 text-[#8d94a1]">{text}</div>
    </div>
  )
}

function EarningRow({ item }) {
  return (
    <div className="flex items-center gap-3 rounded-[20px] border border-[#f0eef6] bg-white p-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f7f4ee] text-[#c89b1e]">
        <i className="fa-solid fa-gem text-[15px]" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[13.5px] font-black text-[#111827]">{item.title}</div>
        <div className="mt-0.5 line-clamp-1 text-[11.5px] font-semibold text-[#98a2b3]">
          {item.subtitle} · {percent(item.share)} share
        </div>
      </div>

      <div className="text-right">
        <div className="text-[14px] font-black text-[#111827]">+{money(item.amount)}</div>
        <div className="mt-0.5 text-[11px] font-bold text-[#98a2b3]">
          {item.diamonds.toFixed(item.diamonds % 1 === 0 ? 0 : 1)} Diamonds
        </div>
      </div>
    </div>
  )
}

function SupporterRow({ item, index }) {
  return (
    <div className="flex items-center gap-3 rounded-[18px] bg-[#fafafa] px-3 py-3">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-black ${
        index === 0 ? 'bg-[#111827] text-white' : 'bg-white text-[#111827] ring-1 ring-black/5'
      }`}>
        {index + 1}
      </div>

      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[13px] font-black text-[#111827]">Reader Supporter</div>
        <div className="mt-0.5 text-[11px] font-semibold text-[#98a2b3]">Diamond unlock support</div>
      </div>

      <div className="text-right">
        <div className="text-[13px] font-black text-[#111827]">{money(item.total_usd)}</div>
        <div className="mt-0.5 text-[11px] font-bold text-[#98a2b3]">
          {Number(item.total_diamonds || 0).toFixed(Number(item.total_diamonds || 0) % 1 === 0 ? 0 : 1)} Diamonds
        </div>
      </div>
    </div>
  )
}

function PayoutRow({ item }) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-3 rounded-[18px] bg-[#fafafa] px-3 py-3">
      <div className="min-w-0">
        <div className="text-[13px] font-black text-[#111827]">{item.payout_month || 'Monthly payout'}</div>
        <div className="mt-0.5 text-[11px] font-semibold text-[#98a2b3]">
          {item.paid_at ? `Paid ${dateText(item.paid_at)}` : item.scheduled_at ? `Scheduled ${dateText(item.scheduled_at)}` : 'Auto payout'}
        </div>
      </div>

      <div className="text-right">
        <div className="text-[13px] font-black text-[#111827]">{money(item.net_payout_usd)}</div>
        <div className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-black capitalize ${statusStyle(item.status)}`}>
          {String(item.status || 'scheduled').replaceAll('_', ' ')}
        </div>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-[170px] animate-pulse rounded-[28px] bg-white" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-[128px] animate-pulse rounded-[24px] bg-white" />
        <div className="h-[128px] animate-pulse rounded-[24px] bg-white" />
      </div>
      <div className="h-[260px] animate-pulse rounded-[26px] bg-white" />
    </div>
  )
}

export default function AuthorIncomePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)
  const [showTip, setShowTip] = useState(false)

  useEffect(() => {
    let ignore = false

    async function loadIncome() {
      try {
        setLoading(true)
        setError('')

        const token = getAuthToken()

        if (!token) {
          navigate('/login', { replace: true })
          return
        }

        const response = await fetch(`${API_BASE_URL}/api/authors/me/income`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const result = await response.json().catch(() => ({}))

        if (!response.ok || result.ok === false) {
          throw new Error(result.message || 'Failed to load income')
        }

        if (!ignore) {
          setData(result)
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Failed to load income')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadIncome()

    return () => {
      ignore = true
    }
  }, [navigate])

  const recentEarnings = useMemo(() => {
    return (data?.recent_earnings || []).map(normalizeEarning)
  }, [data])

  const paymentMethod = data?.payment_method?.primary || null
  const paymentComplete = Boolean(data?.payment_method?.complete)

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-10">
      <div className="sticky top-0 z-40 border-b border-black/5 bg-[#f8f5ef]/95 backdrop-blur">
        <div className="mx-auto flex h-[58px] max-w-[760px] items-center justify-between px-4">
          <HeaderButton icon="fa-solid fa-chevron-left" label="Back" onClick={() => navigate('/author/dashboard', { replace: true })} />

          <div className="text-center">
            <h1 className="text-[16px] font-black text-[#111827]">My Income</h1>
            <p className="mt-0.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#98a2b3]">Net author earnings</p>
          </div>

          <HeaderButton icon="fa-solid fa-circle-info" label="Info" onClick={() => setShowTip(true)} />
        </div>
      </div>
      {showTip ? (
  <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/40 px-4 pb-4 sm:items-center sm:pb-0">
    <button
      type="button"
      aria-label="Close income tip"
      onClick={() => setShowTip(false)}
      className="absolute inset-0"
    />

    <div className="relative w-full max-w-[420px] rounded-[28px] bg-white p-5 shadow-2xl">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="text-[18px] font-black text-[#111827]">How income works</div>
          <div className="mt-1 text-[12.5px] font-semibold text-[#98a2b3]">
            Quick guide for author earnings
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowTip(false)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4f5f7]"
        >
          <i className="fa-solid fa-xmark text-[13px] text-[#555]" />
        </button>
      </div>

      <div className="space-y-3 text-[13px] font-semibold leading-6 text-[#667085]">
        <p>Your income is shown as money, but the system records earnings from Diamond unlocks.</p>
        <p>Your share depends on your Quest stage.</p>
        <p>Payouts are processed automatically every 15th. You don’t need to request withdrawal.</p>
        <p>Free unlocks, Gems, Vouchers, Story Cards, and Episodes 1–5 do not count as paid income.</p>
      </div>

      <button
        type="button"
        onClick={() => {
          setShowTip(false)
          navigate('/author/benefits')
        }}
        className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-[#111827] text-[14px] font-black text-white active:scale-[0.99]"
      >
        View Author Benefits
      </button>
    </div>
  </div>
) : null}

      <main className="mx-auto max-w-[760px] space-y-4 px-4 pt-4">
        {loading ? <LoadingSkeleton /> : null}

        {!loading && error ? (
          <div className="rounded-[24px] bg-white p-5 text-center shadow-sm ring-1 ring-black/5">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1f2] text-[#e11d48]">
              <i className="fa-solid fa-triangle-exclamation" />
            </div>
            <div className="mt-3 text-[15px] font-black text-[#111827]">{error}</div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 h-11 rounded-full bg-[#111827] px-6 text-[13px] font-black text-white active:scale-95"
            >
              Try Again
            </button>
          </div>
        ) : null}

        {!loading && !error && data ? (
          <>
            <section className="overflow-hidden rounded-[30px] bg-[#111827] p-5 text-white shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[11px] font-black uppercase tracking-[0.1em] text-white/55">This Month</div>
                  <div className="mt-2 text-[36px] font-black tracking-[-0.06em]">{money(data.income?.this_month_usd)}</div>
                  <p className="mt-2 max-w-[420px] text-[12.5px] font-semibold leading-5 text-white/60">
                    Your income is shown as money. Shadow still records earnings from Diamond unlocks behind the scenes.
                  </p>
                </div>

                <div className="rounded-[18px] bg-white/10 px-3 py-2 text-right">
                  <div className="text-[10px] font-black uppercase tracking-[0.08em] text-white/45">Share</div>
                  <div className="mt-1 text-[20px] font-black text-[#f7c948]">{percent(data.current_share_percent)}</div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <SmallStat label="Today" value={money(data.income?.today_usd)} />
                <SmallStat label="Week" value={money(data.income?.this_week_usd)} />
                <SmallStat label="Total" value={money(data.income?.total_usd)} />
              </div>
            </section>

              <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2">
              <SummaryCard
                label="Next Payout"
                value={dateText(data.next_payout_date)}
                detail="Payout is handled automatically. You do not need to request withdrawal."
                icon="fa-solid fa-calendar-check"
              />

                <button type="button" onClick={() => navigate('/author/payment-method')} className="h-full w-full text-left">
                <SummaryCard
                  label="Payment Method"
                  value={paymentComplete ? methodLabel(paymentMethod) : 'Missing'}
                  detail={paymentComplete ? 'Tap to review or update your payout details.' : 'Tap to add Bank QR, PayPal, or phone payout details.'}
                  icon={paymentComplete ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'}
                  dark={!paymentComplete}
                />
              </button>
            </div>

            <SectionCard
              title="Recent Earnings"
              subtitle="Net earnings from paid Diamond unlocks."
              action={
                <button type="button" className="rounded-full bg-[#f5f3fa] px-3 py-2 text-[11.5px] font-black text-[#111827]">
                  Latest
                </button>
              }
            >
              {recentEarnings.length ? (
                <div className="space-y-2.5">
                  {recentEarnings.map((item) => (
                    <EarningRow key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="fa-solid fa-gem"
                  title="No earnings yet"
                  text="Paid Diamond unlocks will appear here after readers unlock your locked episodes."
                />
              )}
            </SectionCard>

            <SectionCard
              title="Top Supporters"
              subtitle="Readers who supported your stories through paid unlocks."
            >
              {data.top_supporters?.length ? (
                <div className="space-y-2.5">
                  {data.top_supporters.map((item, index) => (
                    <SupporterRow key={item.reader_id || index} item={item} index={index} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="fa-solid fa-users"
                  title="No supporters yet"
                  text="When readers unlock paid episodes, your strongest supporters will appear here."
                />
              )}
            </SectionCard>

            <SectionCard
              title="Payout History"
              subtitle="Automatic monthly payout records."
            >
              {data.payout_history?.length ? (
                <div className="space-y-2.5">
                  {data.payout_history.map((item) => (
                    <PayoutRow key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="fa-solid fa-receipt"
                  title="No payout yet"
                  text="Your monthly payout history will appear here after admin processes payments."
                />
              )}
            </SectionCard>

           <button
  type="button"
  onClick={() => navigate('/author/quest?from=income')}
  className="w-full rounded-[26px] bg-white p-4 text-left shadow-sm ring-1 ring-black/5 transition active:scale-[0.99]"
>
  <div className="flex items-center justify-between gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f7f4ee] text-[#c89b1e]">
                  <i className="fa-solid fa-scale-balanced text-[15px]" />
                </div>
                <div>
                  <div className="text-[15px] font-black text-[#111827]">Income Rules</div>
                  <p className="mt-1 text-[12.5px] font-medium leading-6 text-[#8d94a1]">
                    Income is calculated from net Diamond unlock revenue after package discounts. Your current share comes from Quest progress. Free unlocks, Gems, Vouchers, Story Cards, and free first episodes do not count as paid income yet.
                  </p>
                  
                </div>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#98a2b3]">
      <i className="fa-solid fa-chevron-right text-[12px]" />
    </div>
  </div>
</button>
          </>
        ) : null}
      </main>
    </div>
  )
}
