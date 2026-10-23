import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { writeAuthorStoreResourceCache } from '../../utils/authorStoreResourceCache'

registerTranslationNamespace('authorPageIncome', {
  "en": {
    "back": "Back",
    "refresh": "Refresh",
    "income": "Income",
    "authorPageFinance": "Author Page Finance",
    "description": "Track your Author Page store income, available balance, pending balance, and payout history.",
    "available": "Available",
    "pending": "Pending",
    "grossSales": "Gross Sales",
    "orders": "Orders",
    "platformFee": "Platform Fee",
    "paidOut": "Paid Out",
    "pendingReview": "Pending Review",
    "withdrawal": "Withdrawal",
    "withdrawalHelp": "Request a payout when your available balance is ready.",
    "withdraw": "Withdraw",
    "recentWithdrawals": "Recent Withdrawals",
    "viewAll": "View all",
    "noHistory": "No withdrawal history yet.",
    "loadFailed": "Failed to load income",
    "inReview": "In Review",
    "approved": "Approved",
    "paid": "Paid",
    "rejected": "Rejected",
    "retry": "Retry",
    "unavailable": "Unable to load income. Try refreshing.",
    "cancelled": "Cancelled"
  },
  "km": {
    "back": "ត្រឡប់ក្រោយ",
    "refresh": "ផ្ទុកឡើងវិញ",
    "income": "ចំណូល",
    "authorPageFinance": "ហិរញ្ញវត្ថុទំព័រអ្នកនិពន្ធ",
    "description": "តាមដានចំណូលពីហាង សមតុល្យដែលអាចប្រើបាន សមតុល្យរង់ចាំ និងប្រវត្តិការទូទាត់។",
    "available": "អាចប្រើបាន",
    "pending": "កំពុងរង់ចាំ",
    "grossSales": "ការលក់សរុប",
    "orders": "ការបញ្ជាទិញ",
    "platformFee": "ថ្លៃសេវាវេទិកា",
    "paidOut": "បានទូទាត់",
    "pendingReview": "រង់ចាំពិនិត្យ",
    "withdrawal": "ការដកប្រាក់",
    "withdrawalHelp": "ស្នើសុំដកប្រាក់ នៅពេលសមតុល្យរបស់អ្នកអាចប្រើបាន។",
    "withdraw": "ដកប្រាក់",
    "recentWithdrawals": "ការដកប្រាក់ថ្មីៗ",
    "viewAll": "មើលទាំងអស់",
    "noHistory": "មិនទាន់មានប្រវត្តិដកប្រាក់។",
    "loadFailed": "មិនអាចផ្ទុកចំណូលបាន",
    "inReview": "កំពុងពិនិត្យ",
    "approved": "បានអនុម័ត",
    "paid": "បានបង់",
    "rejected": "បានបដិសេធ",
    "retry": "សាកល្បងម្ដងទៀត",
    "unavailable": "មិនអាចផ្ទុកចំណូលបានទេ។ សូមផ្ទុកឡើងវិញ។",
    "cancelled": "បានបោះបង់"
  },
  "zh": {
    "back": "返回",
    "refresh": "刷新",
    "income": "收入",
    "authorPageFinance": "作者主页财务",
    "description": "查看作者商店收入、可用余额、待处理余额和付款记录。",
    "available": "可用",
    "pending": "待处理",
    "grossSales": "销售总额",
    "orders": "订单",
    "platformFee": "平台费用",
    "paidOut": "已支付",
    "pendingReview": "待审核",
    "withdrawal": "提现",
    "withdrawalHelp": "可用余额满足条件后即可申请提现。",
    "withdraw": "提现",
    "recentWithdrawals": "最近提现",
    "viewAll": "查看全部",
    "noHistory": "暂无提现记录。",
    "loadFailed": "无法加载收入",
    "inReview": "审核中",
    "approved": "已批准",
    "paid": "已支付",
    "rejected": "已拒绝",
    "retry": "重试",
    "unavailable": "无法加载收入，请重新刷新。",
    "cancelled": "已取消"
  },
  "ja": {
    "back": "戻る",
    "refresh": "更新",
    "income": "収入",
    "authorPageFinance": "著者ページの収益",
    "description": "ストア収入、利用可能残高、保留残高、支払い履歴を確認します。",
    "available": "利用可能",
    "pending": "保留中",
    "grossSales": "総売上",
    "orders": "注文",
    "platformFee": "プラットフォーム手数料",
    "paidOut": "支払済み",
    "pendingReview": "審査中",
    "withdrawal": "出金",
    "withdrawalHelp": "利用可能残高が準備できたら出金を申請できます。",
    "withdraw": "出金する",
    "recentWithdrawals": "最近の出金",
    "viewAll": "すべて表示",
    "noHistory": "出金履歴はまだありません。",
    "loadFailed": "収入を読み込めませんでした",
    "inReview": "審査中",
    "approved": "承認済み",
    "paid": "支払済み",
    "rejected": "却下",
    "retry": "再試行",
    "unavailable": "収入を読み込めません。更新してください。",
    "cancelled": "キャンセル済み"
  },
  "ko": {
    "back": "뒤로",
    "refresh": "새로고침",
    "income": "수입",
    "authorPageFinance": "작가 페이지 재정",
    "description": "작가 스토어 수입, 사용 가능 잔액, 대기 잔액 및 지급 내역을 확인하세요.",
    "available": "사용 가능",
    "pending": "대기 중",
    "grossSales": "총매출",
    "orders": "주문",
    "platformFee": "플랫폼 수수료",
    "paidOut": "지급 완료",
    "pendingReview": "검토 대기",
    "withdrawal": "출금",
    "withdrawalHelp": "사용 가능한 잔액이 준비되면 출금을 요청하세요.",
    "withdraw": "출금",
    "recentWithdrawals": "최근 출금",
    "viewAll": "전체 보기",
    "noHistory": "아직 출금 내역이 없습니다.",
    "loadFailed": "수입을 불러오지 못했습니다",
    "inReview": "검토 중",
    "approved": "승인됨",
    "paid": "지급됨",
    "rejected": "거절됨",
    "retry": "다시 시도",
    "unavailable": "수입을 불러올 수 없습니다. 새로고침하세요.",
    "cancelled": "취소됨"
  }
})


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

  return new Intl.NumberFormat(getDisplayLanguageId(), {
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

  return date.toLocaleDateString(getDisplayLanguageId(), {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

function getWithdrawalStoreAccountId() {
  const read = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key) || sessionStorage.getItem(key) || 'null') || {}
    } catch {
      return {}
    }
  }
  const reader = read('shadow_reader_user')
  const author = read('shadow_author_page')
  const userId = String(reader.user_id || reader.id || author.user_id || '').trim()
  const pageId = String(author.author_page_id || author.id || '').trim()
  return userId ? `${userId}:${pageId}` : pageId ? `author-page:${pageId}` : ''
}

function validNonNegativeNumber(value) {
  const amount = Number(value)
  if (value === undefined || value === null || value === '' || !Number.isFinite(amount) || amount < 0) {
    throw new Error(getDisplayText('authorPageIncome.loadFailed'))
  }
  return amount
}

function normalizeIncomePayload(data) {
  if (!data || typeof data !== 'object' || !data.summary || typeof data.summary !== 'object') {
    throw new Error(getDisplayText('authorPageIncome.loadFailed'))
  }
  const summary = data.summary
  const withdrawals = Array.isArray(data.withdrawals) ? data.withdrawals : []

  return {
    availableBalance: validNonNegativeNumber(summary.available_balance),
    pendingBalance: validNonNegativeNumber(summary.pending_balance),
    grossSales: validNonNegativeNumber(summary.gross_sales),
    platformFee: validNonNegativeNumber(summary.platform_fee),
    paidOut: validNonNegativeNumber(summary.paid_out),
    totalOrders: Math.floor(validNonNegativeNumber(summary.total_orders)),
    withdrawals: withdrawals
      .filter((request) => request && !request.deleted_at)
      .sort((a, b) => {
        const first = Date.parse(a.created_at || a.requested_at || '') || 0
        const second = Date.parse(b.created_at || b.requested_at || '') || 0
        return second - first
      }),
  }
}

function Card({ children, className = '' }) {
  return (
    <section className={`rounded-[28px] bg-[var(--shadow-bg-surface)] p-5 shadow-sm ring-1 ring-[var(--shadow-border)] ${className}`}>
      {children}
    </section>
  )
}

function StatCard({ label, value, icon, hint }) {
  return (
    <div className="rounded-[24px] bg-[var(--shadow-bg-surface)] p-4 shadow-sm ring-1 ring-[var(--shadow-border)]">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
        <i className={`fa-solid ${icon} text-[15px]`} />
      </div>
      <div className="text-[11.5px] font-bold uppercase tracking-[0.08em] text-[var(--shadow-text-tertiary)]">{label}</div>
      <div className="mt-1 text-[20px] font-black text-[var(--shadow-text-primary)]">{value}</div>
      {hint ? <div className="mt-1 text-[11.5px] font-semibold text-[var(--shadow-text-tertiary)]">{hint}</div> : null}
    </div>
  )
}

function getWithdrawalStatusClass(status) {
  const value = String(status || 'in_review').toLowerCase()
  if (value === 'paid') return 'bg-[#ecfdf5] text-[#047857]'
  if (value === 'approved') return 'bg-[#eff6ff] text-[#1d4ed8]'
  if (value === 'rejected') return 'bg-[#fff1f2] text-[#be123c]'
  if (value === 'cancelled') return 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]'
  return 'bg-[#fff7ed] text-[#c2410c]'
}

function WithdrawalRow({ request }) {
  const amount = Number(request.amount_usd ?? request.amount ?? request.requested_amount ?? request.net_amount ?? 0)
  const status = String(request.status || request.state || 'in_review').toLowerCase()
  const requestedAt = request.created_at || request.requested_at || request.date
  const statusKey = ['approved', 'paid', 'rejected', 'cancelled'].includes(status) ? status : 'inReview'

  return (
    <div className="flex items-center justify-between gap-4 border-b border-[var(--shadow-border)] py-4 last:border-b-0">
      <div className="min-w-0">
        <div className="text-[14px] font-bold text-[var(--shadow-text-primary)]">{formatMoney(amount)}</div>
        <div className="mt-1 text-[12px] font-semibold text-[var(--shadow-text-tertiary)]">{formatDate(requestedAt)}</div>
      </div>
      <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ${getWithdrawalStatusClass(status)}`}>
        {getDisplayText(`authorPageIncome.${statusKey}`)}
      </span>
    </div>
  )
}

export default function AuthorPageIncomePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
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
  const hasLoadedRef = useRef(false)
  const requestIdRef = useRef(0)
  const requestControllerRef = useRef(null)
  const requestPendingRef = useRef(false)

  const recentWithdrawals = useMemo(() => income.withdrawals.slice(0, 5), [income.withdrawals])
  const displayMoney = (value) => hasLoaded ? formatMoney(value) : loading ? '...' : '—'
  const displayCount = (value) => hasLoaded ? value : loading ? '...' : '—'

  const loadIncome = useCallback(async ({ manual = false } = {}) => {
    if (manual && requestPendingRef.current) return
    const token = getAuthToken()
    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    requestControllerRef.current?.abort()
    const controller = new AbortController()
    requestControllerRef.current = controller
    const requestId = ++requestIdRef.current
    requestPendingRef.current = true
    if (hasLoadedRef.current) setRefreshing(true)
    else setLoading(true)
    setMessage('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/author-store/me/income`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false) {
        throw new Error(data.message || getDisplayText('authorPageIncome.loadFailed'))
      }
      const result = normalizeIncomePayload(data)
      if (controller.signal.aborted || requestId !== requestIdRef.current) return
      setIncome(result)
      hasLoadedRef.current = true
      setHasLoaded(true)
      const accountId = getWithdrawalStoreAccountId()
      if (accountId) {
        try {
          writeAuthorStoreResourceCache({ accountId, resource: 'withdrawal', data: result.availableBalance })
        } catch {
        }
      }
    } catch (error) {
      if (!controller.signal.aborted && requestId === requestIdRef.current) {
        setMessage(error?.message || getDisplayText('authorPageIncome.loadFailed'))
      }
    } finally {
      if (requestId === requestIdRef.current) {
        requestPendingRef.current = false
        requestControllerRef.current = null
        setLoading(false)
        setRefreshing(false)
      }
    }
  }, [navigate])

  useEffect(() => {
    void loadIncome()
    return () => {
      requestIdRef.current += 1
      requestControllerRef.current?.abort()
      requestControllerRef.current = null
      requestPendingRef.current = false
    }
  }, [loadIncome])

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-10">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[980px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => location.state?.from === '/author/page/notifications'
  ? navigate(-1)
  : navigate('/author/page/finance')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-soft)]"
            aria-label={t('authorPageIncome.back')}
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="text-[16px] font-black text-[var(--shadow-text-primary)]">{t('authorPageIncome.income')}</div>

          <button
            type="button"
            onClick={() => { void loadIncome({ manual: true }) }}
            disabled={loading || refreshing}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95 disabled:opacity-50"
            aria-label={t('authorPageIncome.refresh')}
          >
            <i className={`fa-solid fa-rotate-right text-[13px] ${refreshing ? 'fa-spin' : ''}`} />
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
            <div className="text-[12px] font-black uppercase tracking-[0.08em] text-white/55">{t('authorPageIncome.authorPageFinance')}</div>
            <h1 className="mt-1 text-[26px] font-black tracking-tight">{t('authorPageIncome.income')}</h1>
            <p className="mt-2 text-[13px] font-semibold leading-6 text-white/65">
              {t('authorPageIncome.description')}
            </p>
          </div>

          <div className="grid grid-cols-2 border-t border-white/10 sm:grid-cols-4">
            <div className="p-4">
              <div className="text-[11px] font-bold text-white/45">{t('authorPageIncome.available')}</div>
              <div className="mt-1 text-[20px] font-black">{displayMoney(income.availableBalance)}</div>
            </div>
            <div className="p-4">
              <div className="text-[11px] font-bold text-white/45">{t('authorPageIncome.pending')}</div>
              <div className="mt-1 text-[20px] font-black">{displayMoney(income.pendingBalance)}</div>
            </div>
            <div className="p-4">
              <div className="text-[11px] font-bold text-white/45">{t('authorPageIncome.grossSales')}</div>
              <div className="mt-1 text-[20px] font-black">{displayMoney(income.grossSales)}</div>
            </div>
            <div className="p-4">
              <div className="text-[11px] font-bold text-white/45">{t('authorPageIncome.orders')}</div>
              <div className="mt-1 text-[20px] font-black">{displayCount(income.totalOrders)}</div>
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <StatCard label={t('authorPageIncome.platformFee')} value={displayMoney(income.platformFee)} icon="fa-percent" />
          <StatCard label={t('authorPageIncome.paidOut')} value={displayMoney(income.paidOut)} icon="fa-circle-check" />
          <StatCard label={t('authorPageIncome.pendingReview')} value={displayMoney(income.pendingBalance)} icon="fa-clock" />
        </section>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-black text-[var(--shadow-text-primary)]">{t('authorPageIncome.withdrawal')}</h2>
              <p className="mt-1 text-[12px] font-semibold leading-5 text-[var(--shadow-text-tertiary)]">
                {t('authorPageIncome.withdrawalHelp')}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/author/page/finance/withdrawal?back=income')}
              disabled={!hasLoaded || loading || refreshing}
              className="h-10 rounded-full bg-[#111827] px-4 text-[12px] font-bold text-white active:scale-95 disabled:opacity-50"
            >
              {t('authorPageIncome.withdraw')}
            </button>
          </div>
        </Card>

        <Card>
          <div className="mb-1 flex items-center justify-between gap-3">
            <h2 className="text-[18px] font-black text-[var(--shadow-text-primary)]">{t('authorPageIncome.recentWithdrawals')}</h2>
            <button
              type="button"
              onClick={() => navigate('/author/page/finance/withdrawal?back=income')}
              className="text-[12px] font-black text-[var(--shadow-text-secondary)]"
            >
              {t('authorPageIncome.viewAll')}
            </button>
          </div>

          {loading && !hasLoaded ? (
            <div className="py-5 text-center text-[var(--shadow-text-tertiary)]">...</div>
          ) : recentWithdrawals.length > 0 ? (
            <div className="mt-2">
              {recentWithdrawals.map((request, index) => (
                <WithdrawalRow key={request.id || index} request={request} />
              ))}
            </div>
          ) : (
            <div className="rounded-[22px] bg-[var(--shadow-bg-soft)] px-4 py-6 text-center text-[13px] font-semibold text-[var(--shadow-text-tertiary)]">
              {hasLoaded ? t('authorPageIncome.noHistory') : t('authorPageIncome.unavailable')}
              {!hasLoaded && !loading ? (
                <button type="button" onClick={() => { void loadIncome({ manual: true }) }} className="mt-3 block w-full text-center text-[12px] font-bold text-[var(--shadow-text-primary)]">
                  {t('authorPageIncome.retry')}
                </button>
              ) : null}
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
