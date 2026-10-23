import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorStoreWithdrawal', {
  en: {
    title: 'Withdrawal', subtitle: 'Request payout from your net store income.', available: 'Available to withdraw', afterFee: 'Net store income after the platform fee.', minimum: 'Minimum withdrawal', pending: 'Pending', pendingHint: 'Reserved for withdrawal', gross: 'Gross sales', grossHint: 'Before fee', platformFee: 'Platform fee', feeHint: '10% fee on product sales', paidOut: 'Paid out', paidHint: 'Completed', request: 'Request withdrawal', requestHint: 'Your request will be sent to admin for review.', inReview: 'In Review', approved: 'Approved', paid: 'Paid', rejected: 'Rejected', cancelled: 'Cancelled', paymentMethod: 'Payment method', usedInIncome: 'The same payout method as My Income.', edit: 'Edit', amount: 'Amount', max: 'MAX', sending: 'Sending request...', send: 'Request Withdrawal', needMin: 'You need at least {{amount}} available before requesting a withdrawal.', history: 'Withdrawal history', historyHint: 'Track your requests and admin review status.', emptyTitle: 'No withdrawal requests yet', emptyHint: 'After you request a payout, its status will appear here.', login: 'Please sign in first.', missingMethod: 'Please add a payment method before requesting a withdrawal.', invalidAmount: 'Enter an amount from {{min}} to {{max}} with no more than 2 decimal places.', success: 'Withdrawal request submitted for review.', loadFailed: 'Failed to load withdrawal information.', requestFailed: 'Failed to request withdrawal.', refreshFailed: 'Request submitted, but the latest balance could not be loaded. Refresh to check.', refresh: 'Refresh', back: 'Back', noMethod: 'Add payment method first', bank: 'Bank QR', paypal: 'PayPal', phone: 'Phone payout', noDetail: 'No payment details', unavailable: 'Balance unavailable', loading: 'Loading...', loadMore: 'Load 20 more',
  },
  km: {
    title: 'ការដកប្រាក់', subtitle: 'ស្នើសុំដកប្រាក់ពីចំណូលសុទ្ធនៃហាងអ្នកនិពន្ធ។', available: 'ប្រាក់ដែលអាចដកបាន', afterFee: 'ចំណូលសុទ្ធក្រោយដកថ្លៃសេវាវេទិកា។', minimum: 'ចំនួនដកអប្បបរមា', pending: 'កំពុងរង់ចាំ', pendingHint: 'ប្រាក់ដែលបានកក់សម្រាប់ដក', gross: 'ការលក់សរុប', grossHint: 'មុនដកថ្លៃសេវា', platformFee: 'ថ្លៃសេវាវេទិកា', feeHint: '10% លើការលក់ផលិតផល', paidOut: 'បានទូទាត់', paidHint: 'បានបញ្ចប់', request: 'ស្នើសុំដកប្រាក់', requestHint: 'សំណើរបស់អ្នកនឹងត្រូវផ្ញើទៅ Admin ដើម្បីពិនិត្យ។', inReview: 'កំពុងពិនិត្យ', approved: 'បានអនុម័ត', paid: 'បានទូទាត់', rejected: 'បានបដិសេធ', cancelled: 'បានលុបចោល', paymentMethod: 'វិធីទទួលប្រាក់', usedInIncome: 'ប្រើវិធីទទួលប្រាក់ដូចផ្នែក My Income។', edit: 'កែប្រែ', amount: 'ចំនួនទឹកប្រាក់', max: 'អតិបរមា', sending: 'កំពុងផ្ញើសំណើ...', send: 'ស្នើសុំដកប្រាក់', needMin: 'ត្រូវមានប្រាក់យ៉ាងតិច {{amount}} ទើបអាចដកបាន។', history: 'ប្រវត្តិការដកប្រាក់', historyHint: 'តាមដានសំណើ និងស្ថានភាពពិនិត្យពី Admin។', emptyTitle: 'មិនទាន់មានសំណើដកប្រាក់', emptyHint: 'ស្ថានភាពសំណើនឹងបង្ហាញនៅទីនេះក្រោយអ្នកស្នើដកប្រាក់។', login: 'សូមចូលគណនីជាមុន។', missingMethod: 'សូមបន្ថែមវិធីទទួលប្រាក់មុនស្នើដក។', invalidAmount: 'បញ្ចូលចំនួនពី {{min}} ដល់ {{max}} និងខ្ទង់ទសភាគមិនលើស 2។', success: 'បានផ្ញើសំណើដកប្រាក់ទៅពិនិត្យរួច។', loadFailed: 'មិនអាចផ្ទុកព័ត៌មានដកប្រាក់បានទេ។', requestFailed: 'មិនអាចផ្ញើសំណើដកប្រាក់បានទេ។', refreshFailed: 'សំណើបានផ្ញើរួច ប៉ុន្តែមិនអាចផ្ទុកសមតុល្យថ្មីបានទេ។ សូម Refresh។', refresh: 'ផ្ទុកឡើងវិញ', back: 'ត្រឡប់ក្រោយ', noMethod: 'បន្ថែមវិធីទទួលប្រាក់ជាមុន', bank: 'Bank QR', paypal: 'PayPal', phone: 'ទទួលតាមទូរស័ព្ទ', noDetail: 'មិនមានព័ត៌មានទទួលប្រាក់', unavailable: 'មិនមានព័ត៌មានសមតុល្យ', loading: 'កំពុងផ្ទុក...', loadMore: 'មើលបន្ថែម 20',
  },
  zh: {
    title: '提现', subtitle: '从店铺净收入申请提现。', available: '可提现余额', afterFee: '扣除平台费后的店铺净收入。', minimum: '最低提现额', pending: '待处理', pendingHint: '已预留的提现金额', gross: '销售总额', grossHint: '扣费前', platformFee: '平台费用', feeHint: '商品销售额的10%', paidOut: '已支付', paidHint: '已完成', request: '申请提现', requestHint: '申请将提交管理员审核。', inReview: '审核中', approved: '已批准', paid: '已付款', rejected: '已拒绝', cancelled: '已取消', paymentMethod: '收款方式', usedInIncome: '与 My Income 使用相同的收款方式。', edit: '编辑', amount: '金额', max: '全部', sending: '正在提交...', send: '申请提现', needMin: '可用余额至少为 {{amount}} 才能提现。', history: '提现记录', historyHint: '查看申请和审核状态。', emptyTitle: '暂无提现申请', emptyHint: '提交提现申请后状态会显示在这里。', login: '请先登录。', missingMethod: '请先添加收款方式。', invalidAmount: '请输入 {{min}} 至 {{max}} 之间的金额，最多两位小数。', success: '提现申请已提交审核。', loadFailed: '加载提现信息失败。', requestFailed: '提交提现申请失败。', refreshFailed: '申请已提交，但无法加载最新余额，请刷新。', refresh: '刷新', back: '返回', noMethod: '请先添加收款方式', bank: '银行二维码', paypal: 'PayPal', phone: '手机收款', noDetail: '无收款信息', unavailable: '余额不可用', loading: '加载中...', loadMore: '加载更多20条',
  },
  ja: {
    title: '出金', subtitle: 'ストアの純収益から出金を申請します。', available: '出金可能額', afterFee: 'プラットフォーム手数料控除後の純収益。', minimum: '最低出金額', pending: '保留中', pendingHint: '出金申請で確保された金額', gross: '総売上', grossHint: '手数料控除前', platformFee: '手数料', feeHint: '商品売上の10%', paidOut: '支払済み', paidHint: '完了', request: '出金を申請', requestHint: '申請は管理者に送信され審査されます。', inReview: '審査中', approved: '承認済み', paid: '支払済み', rejected: '却下', cancelled: 'キャンセル', paymentMethod: '受取方法', usedInIncome: 'My Income と同じ受取方法を使用します。', edit: '編集', amount: '金額', max: '全額', sending: '申請中...', send: '出金申請', needMin: '出金には {{amount}} 以上の残高が必要です。', history: '出金履歴', historyHint: '申請と管理者の審査状況を確認します。', emptyTitle: '出金申請はまだありません', emptyHint: '出金申請後に状況が表示されます。', login: '先にログインしてください。', missingMethod: '先に受取方法を追加してください。', invalidAmount: '{{min}} から {{max}} の金額を小数第2位まで入力してください。', success: '出金申請を送信しました。', loadFailed: '出金情報を読み込めませんでした。', requestFailed: '出金申請に失敗しました。', refreshFailed: '申請は送信されましたが最新の残高を取得できません。更新してください。', refresh: '更新', back: '戻る', noMethod: '受取方法を追加してください', bank: '銀行QR', paypal: 'PayPal', phone: '電話番号による受取', noDetail: '受取情報なし', unavailable: '残高を取得できません', loading: '読み込み中...', loadMore: 'さらに20件表示',
  },
  ko: {
    title: '출금', subtitle: '스토어 순수익에서 출금을 신청하세요.', available: '출금 가능 금액', afterFee: '플랫폼 수수료를 제외한 순수익입니다.', minimum: '최소 출금 금액', pending: '대기 중', pendingHint: '출금 신청으로 예약된 금액', gross: '총매출', grossHint: '수수료 차감 전', platformFee: '플랫폼 수수료', feeHint: '상품 매출의 10%', paidOut: '지급 완료', paidHint: '완료', request: '출금 신청', requestHint: '신청서는 관리자에게 전달되어 검토됩니다.', inReview: '검토 중', approved: '승인됨', paid: '지급 완료', rejected: '거절됨', cancelled: '취소됨', paymentMethod: '지급 방법', usedInIncome: 'My Income과 같은 지급 방법을 사용합니다.', edit: '수정', amount: '금액', max: '최대', sending: '요청 전송 중...', send: '출금 신청', needMin: '출금하려면 {{amount}} 이상의 잔액이 필요합니다.', history: '출금 내역', historyHint: '신청 및 관리자 검토 상태를 확인하세요.', emptyTitle: '출금 신청 내역이 없습니다', emptyHint: '출금 신청 후 이곳에 상태가 표시됩니다.', login: '먼저 로그인하세요.', missingMethod: '먼저 지급 방법을 추가하세요.', invalidAmount: '{{min}}부터 {{max}} 사이의 금액을 소수 둘째 자리까지 입력하세요.', success: '출금 신청이 제출되었습니다.', loadFailed: '출금 정보를 불러오지 못했습니다.', requestFailed: '출금 신청에 실패했습니다.', refreshFailed: '신청은 제출되었지만 최신 잔액을 불러오지 못했습니다. 새로고침하세요.', refresh: '새로고침', back: '뒤로', noMethod: '지급 방법을 추가하세요', bank: '은행 QR', paypal: 'PayPal', phone: '휴대전화 지급', noDetail: '지급 정보 없음', unavailable: '잔액을 확인할 수 없습니다', loading: '불러오는 중...', loadMore: '20개 더 보기',
  },
})

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')
const MIN_WITHDRAWAL_AMOUNT = 10

function getAuthToken() {
  try {
    return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
  } catch {
    return ''
  }
}

function formatMoney(value) {
  const amount = Number(value)
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number.isFinite(amount) ? amount : 0)
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString(getDisplayLanguageId(), { month: 'short', day: '2-digit', year: 'numeric' })
}

function normalizeStatus(status) {
  const value = String(status || '').trim().toLowerCase()
  if (value === 'approved') return 'approved'
  if (value === 'paid') return 'paid'
  if (value === 'rejected') return 'rejected'
  if (value === 'cancelled' || value === 'canceled') return 'cancelled'
  return 'inReview'
}

function getStatusClass(status) {
  const value = normalizeStatus(status)
  if (value === 'paid') return 'bg-[#ecfdf5] text-[#047857]'
  if (value === 'approved') return 'bg-[#eff6ff] text-[#1d4ed8]'
  if (value === 'rejected') return 'bg-[#fff1f2] text-[#be123c]'
  if (value === 'cancelled') return 'bg-[#f3f4f6] text-[#6b7280]'
  return 'bg-[#fff7ed] text-[#c2410c]'
}

function getReadablePaymentMethod(method, t) {
  const value = String(method || '').trim().toLowerCase()
  if (['bank_qr', 'bank', 'aba'].includes(value)) return t('authorStoreWithdrawal.bank')
  if (value === 'paypal') return t('authorStoreWithdrawal.paypal')
  if (['phone', 'wing', 'truemoney'].includes(value)) return t('authorStoreWithdrawal.phone')
  return String(method || '').trim() || t('authorStoreWithdrawal.noDetail')
}

function nonNegativeNumber(value) {
  const amount = Number(value)
  return value !== '' && value !== null && value !== undefined && Number.isFinite(amount) && amount >= 0 ? amount : 0
}

function normalizeIncomePayload(data = {}) {
  const summary = data.summary || data.income || data.wallet || data.balance || {}
  const paymentMethod = data.payment_method || data.paymentMethod || data.payout_method || data.payoutMethod || null
  const requests = [data.withdrawals, data.requests, data.withdrawal_requests].find(Array.isArray) || []
  return {
    availableBalance: nonNegativeNumber(summary.available_balance ?? summary.availableBalance ?? data.available_balance ?? data.availableBalance),
    pendingBalance: nonNegativeNumber(summary.pending_balance ?? summary.pendingBalance ?? data.pending_balance ?? data.pendingBalance),
    grossSales: nonNegativeNumber(summary.gross_sales ?? summary.grossSales ?? data.gross_sales ?? data.grossSales),
    platformFee: nonNegativeNumber(summary.platform_fee ?? summary.platformFee ?? data.platform_fee ?? data.platformFee),
    paidOut: nonNegativeNumber(summary.paid_out ?? summary.paidOut ?? data.paid_out ?? data.paidOut),
    paymentMethod,
    requests: requests.filter((request) => request && typeof request === 'object' && !request.deleted_at).sort((a, b) => (Date.parse(b.created_at || b.requested_at || '') || 0) - (Date.parse(a.created_at || a.requested_at || '') || 0)),
  }
}

function getPaymentLabel(paymentMethod, t) {
  if (!paymentMethod || paymentMethod.status !== 'active') return t('authorStoreWithdrawal.noMethod')
  const method = getReadablePaymentMethod(paymentMethod.method_type || paymentMethod.method || paymentMethod.type || paymentMethod.provider, t)
  const accountName = paymentMethod.account_name || paymentMethod.accountName || paymentMethod.paypal_name || paymentMethod.name || ''
  const extra = paymentMethod.method_type === 'bank_qr'
    ? paymentMethod.bank_name || ''
    : paymentMethod.method_type === 'paypal'
      ? paymentMethod.paypal_email || ''
      : paymentMethod.phone_provider || paymentMethod.phone_number || ''
  return [method, accountName, extra].filter(Boolean).join(' · ')
}

function parseAmountCents(value) {
  const input = String(value || '').trim()
  if (!/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/.test(input)) return null
  const [whole, fraction = ''] = input.split('.')
  const result = Number(whole) * 100 + Number(fraction.padEnd(2, '0'))
  return Number.isSafeInteger(result) && result >= 0 ? result : null
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
  const { t } = useDisplayTranslation()
  return <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-black ${getStatusClass(status)}`}>{t(`authorStoreWithdrawal.${normalizeStatus(status)}`)}</span>
}

function WithdrawalHistoryItem({ request }) {
  const { t } = useDisplayTranslation()
  const amount = nonNegativeNumber(request.amount_usd ?? request.amount ?? request.requested_amount ?? request.net_amount)
  const status = request.status || request.state || 'in_review'
  const requestedAt = request.created_at || request.requested_at || request.date
  const methodSnapshot = request.payment_method_snapshot
  const method = typeof methodSnapshot === 'object' && methodSnapshot
    ? methodSnapshot.method_type || methodSnapshot.type || methodSnapshot.method
    : request.payment_method || request.method || request.provider

  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#f0eef6] py-4 last:border-b-0">
      <div className="min-w-0">
        <div className="text-[15px] font-black text-[#111827]">{formatMoney(amount)}</div>
        <div className="mt-1 text-[12px] font-semibold text-[#8b93a1]">{formatDate(requestedAt)} · {getReadablePaymentMethod(method, t)}</div>
        {request.admin_note || request.reject_reason || request.note ? (
          <div className="mt-2 break-words rounded-[14px] bg-[#f9fafb] px-3 py-2 text-[12px] font-semibold leading-5 text-[#6b7280]">{request.reject_reason || request.admin_note || request.note}</div>
        ) : null}
      </div>
      <StatusBadge status={status} />
    </div>
  )
}

export default function AuthorStoreWithdrawalPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const submittingRef = useRef(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('error')
  const [amount, setAmount] = useState('')
  const [visibleCount, setVisibleCount] = useState(20)
  const [income, setIncome] = useState({ availableBalance: 0, pendingBalance: 0, grossSales: 0, platformFee: 0, paidOut: 0, paymentMethod: null, requests: [] })
  const [hasLoaded, setHasLoaded] = useState(false)

  const availableBalance = nonNegativeNumber(income.availableBalance)
  const availableCents = Math.round(availableBalance * 100)
  const requestedCents = parseAmountCents(amount)
  const canWithdraw = hasLoaded && availableCents >= MIN_WITHDRAWAL_AMOUNT * 100
  const validAmount = canWithdraw && requestedCents !== null && requestedCents >= MIN_WITHDRAWAL_AMOUNT * 100 && requestedCents <= availableCents
  const paymentLabel = getPaymentLabel(income.paymentMethod, t)
  const progressPercent = Math.min(100, Math.max(0, availableBalance / MIN_WITHDRAWAL_AMOUNT * 100))
  const recentRequests = useMemo(() => income.requests.slice(0, visibleCount), [income.requests, visibleCount])

  const loadWithdrawalData = useCallback(async ({ silent = false, signal } = {}) => {
    const token = getAuthToken()
    if (!token) {
      navigate('/login', { replace: true })
      return false
    }
    try {
      if (!silent) setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/author-store/me/income`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false || !data.summary) throw new Error(data.message || 'Failed to load store income')
      if (signal?.aborted) return false
      setIncome(normalizeIncomePayload(data))
      setHasLoaded(true)
      return true
    } catch (error) {
      if (signal?.aborted || error.name === 'AbortError') return false
      if (!silent) {
        setHasLoaded(false)
        setMessageType('error')
        setMessage(error.message || t('authorStoreWithdrawal.loadFailed'))
      }
      return false
    } finally {
      if (!signal?.aborted && !silent) setLoading(false)
    }
  }, [navigate, t])

  useEffect(() => {
    const controller = new AbortController()
    void loadWithdrawalData({ signal: controller.signal })
    return () => controller.abort()
  }, [loadWithdrawalData])

  function handleMaxAmount() {
    setAmount(availableCents > 0 ? (availableCents / 100).toFixed(2) : '')
  }

  async function handleRequestWithdrawal() {
    if (submittingRef.current || saving || loading) return
    const token = getAuthToken()
    if (!token) {
      navigate('/login', { replace: true })
      return
    }
    if (!income.paymentMethod || income.paymentMethod.status !== 'active') {
      setMessageType('error')
      setMessage(t('authorStoreWithdrawal.missingMethod'))
      return
    }
    if (!validAmount) {
      setMessageType('error')
      setMessage(t('authorStoreWithdrawal.invalidAmount', { min: formatMoney(MIN_WITHDRAWAL_AMOUNT), max: formatMoney(availableBalance) }))
      return
    }

    submittingRef.current = true
    try {
      setSaving(true)
      setMessage('')
      const response = await fetch(`${API_BASE_URL}/api/author-store/me/withdrawals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: requestedCents / 100 }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false) throw new Error(data.message || t('authorStoreWithdrawal.requestFailed'))
      setAmount('')
      setMessageType('success')
      setMessage(t('authorStoreWithdrawal.success'))
      const refreshed = await loadWithdrawalData({ silent: true })
      if (!refreshed) {
        setHasLoaded(false)
        setMessageType('success')
        setMessage(t('authorStoreWithdrawal.refreshFailed'))
      }
    } catch (error) {
      setMessageType('error')
      setMessage(error.message || t('authorStoreWithdrawal.requestFailed'))
    } finally {
      submittingRef.current = false
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
            aria-label={t('authorStoreWithdrawal.back')}
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0">
            <h1 className="line-clamp-1 text-[18px] font-black text-[#111827]">{t('authorStoreWithdrawal.title')}</h1>
            <p className="text-[11.5px] font-semibold text-[#8b93a1]">{t('authorStoreWithdrawal.subtitle')}</p>
          </div>
          <button type="button" aria-label={t('authorStoreWithdrawal.refresh')} disabled={saving || loading} onClick={() => { setMessage(''); void loadWithdrawalData() }} className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827] disabled:opacity-50"><i className={`fa-solid fa-rotate-right text-[14px] ${loading ? 'fa-spin' : ''}`} /></button>
        </div>
      </header>

      <main className="mx-auto max-w-[920px] space-y-4 px-4 pt-4">
        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className={`w-full rounded-[18px] px-4 py-3 text-left text-[12.5px] font-bold leading-5 shadow-sm ring-1 ${messageType === 'success' ? 'bg-[#ecfdf5] text-[#047857] ring-[#a7f3d0]' : 'bg-white text-[#111827] ring-black/5'}`}
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
                    {t('authorStoreWithdrawal.available')}
                  </div>
                  <div className="mt-2 text-[34px] font-black tracking-tight">
                    {loading ? '...' : hasLoaded ? formatMoney(availableBalance) : '—'}
                  </div>
                  <div className="mt-1 text-[12.5px] font-semibold text-white/65">
                    {t('authorStoreWithdrawal.afterFee')}
                  </div>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                  <i className="fa-solid fa-wallet text-[20px]" />
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-[11.5px] font-bold text-white/65">
                  <span>{t('authorStoreWithdrawal.minimum')}</span>
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
            label={t('authorStoreWithdrawal.pending')}
            value={formatMoney(income.pendingBalance)}
            icon="fa-clock"
            hint={t('authorStoreWithdrawal.pendingHint')}
          />
          <StatCard
            label={t('authorStoreWithdrawal.gross')}
            value={formatMoney(income.grossSales)}
            icon="fa-receipt"
            hint={t('authorStoreWithdrawal.grossHint')}
          />
          <StatCard
            label={t('authorStoreWithdrawal.platformFee')}
            value={formatMoney(income.platformFee)}
            icon="fa-percent"
            hint={t('authorStoreWithdrawal.feeHint')}
          />
          <StatCard
            label={t('authorStoreWithdrawal.paidOut')}
            value={formatMoney(income.paidOut)}
            icon="fa-circle-check"
            hint={t('authorStoreWithdrawal.paidHint')}
          />
        </div>

        <Card>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[18px] font-black text-[#111827]">{t('authorStoreWithdrawal.request')}</h2>
              <p className="mt-1 text-[12.5px] font-semibold leading-5 text-[#8b93a1]">
                {t('authorStoreWithdrawal.requestHint')}
              </p>
            </div>
            <span className="rounded-full bg-[#f3f4f6] px-3 py-1 text-[11px] font-black text-[#111827]">
              {t('authorStoreWithdrawal.inReview')}
            </span>
          </div>

          <div className="rounded-[22px] bg-[#f9fafb] p-4">
            <div className="text-[11.5px] font-bold uppercase tracking-[0.08em] text-[#9ca3af]">
              {t('authorStoreWithdrawal.paymentMethod')}
            </div>
            <div className="mt-2 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="line-clamp-1 text-[14px] font-black text-[#111827]">{paymentLabel}</div>
                <div className="mt-0.5 text-[12px] font-semibold text-[#8b93a1]">
                  {t('authorStoreWithdrawal.usedInIncome')}
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/author/payment-method?back=%2Fauthor%2Fpage%2Ffinance%2Fwithdrawal')}
                className="shrink-0 rounded-full bg-white px-3 py-2 text-[12px] font-black text-[#111827] shadow-sm ring-1 ring-black/5 active:scale-95"
              >
                {t('authorStoreWithdrawal.edit')}
              </button>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.08em] text-[#8b93a1]">
              {t('authorStoreWithdrawal.amount')}
            </label>
            <div className="flex items-center gap-3 rounded-[20px] bg-white px-4 py-3 ring-1 ring-[#e5e7eb]">
              <span className="text-[18px] font-black text-[#111827]">$</span>
              <input
                type="text"
                inputMode="decimal"
                autoComplete="off"
                aria-label={t('authorStoreWithdrawal.amount')}
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                disabled={loading || saving || !hasLoaded}
                placeholder="0.00"
                className="min-w-0 flex-1 bg-transparent text-[22px] font-black text-[#111827] outline-none placeholder:text-[#c7cbd1]"
              />
              <button
                type="button"
                onClick={handleMaxAmount}
                disabled={loading || saving || !hasLoaded}
                className="rounded-full bg-[#f3f4f6] px-3 py-2 text-[11px] font-black text-[#111827] active:scale-95 disabled:opacity-50"
              >
                {t('authorStoreWithdrawal.max')}
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between text-[11.5px] font-semibold text-[#8b93a1]">
              <span>{t('authorStoreWithdrawal.minimum')} {formatMoney(MIN_WITHDRAWAL_AMOUNT)}</span>
              <span>{t('authorStoreWithdrawal.available')} {formatMoney(availableBalance)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRequestWithdrawal}
            disabled={saving || loading || !validAmount || income.paymentMethod?.status !== 'active'}
            className="mt-5 flex h-13 w-full items-center justify-center rounded-full bg-[#111827] text-[14px] font-black text-white active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {saving ? t('authorStoreWithdrawal.sending') : t('authorStoreWithdrawal.send')}
          </button>

          {!canWithdraw ? (
            <div className="mt-3 rounded-[18px] bg-[#fff7ed] px-4 py-3 text-[12.5px] font-bold leading-5 text-[#c2410c]">
              {t('authorStoreWithdrawal.needMin', { amount: formatMoney(MIN_WITHDRAWAL_AMOUNT) })}
            </div>
          ) : null}
        </Card>

        <Card>
          <div className="mb-2 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-[18px] font-black text-[#111827]">{t('authorStoreWithdrawal.history')}</h2>
              <p className="mt-1 text-[12.5px] font-semibold text-[#8b93a1]">
                {t('authorStoreWithdrawal.historyHint')}
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
              {income.requests.length > visibleCount ? (
                <button type="button" onClick={() => setVisibleCount((count) => count + 20)} className="mt-4 h-10 w-full rounded-full bg-[#f3f4f6] text-[12px] font-semibold text-[#111827]">{t('authorStoreWithdrawal.loadMore')}</button>
              ) : null}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
                <i className="fa-solid fa-money-bill-transfer text-[18px]" />
              </div>
              <div className="mt-3 text-[15px] font-black text-[#111827]">{t('authorStoreWithdrawal.emptyTitle')}</div>
              <div className="mx-auto mt-1 max-w-[280px] text-[12.5px] font-semibold leading-5 text-[#8b93a1]">
                {t('authorStoreWithdrawal.emptyHint')}
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
