import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorPageWithdrawal', {
  "en": {
    "back": "Back",
    "refresh": "Refresh",
    "withdrawal": "Withdrawal",
    "authorPageFinance": "Author Page Finance",
    "description": "Request payout from your Author Page income.",
    "available": "Available",
    "pending": "Pending",
    "paidOut": "Paid Out",
    "requestWithdrawal": "Request Withdrawal",
    "minimum": "Minimum withdrawal amount is {{amount}}.",
    "paymentMethod": "Payment Method",
    "editPaymentMethod": "Edit Payment Method",
    "amount": "Amount",
    "submitting": "Submitting...",
    "submitWithdrawal": "Submit Withdrawal",
    "needAtLeast": "Need at least {{amount}}",
    "history": "Withdrawal History",
    "noHistory": "No withdrawal history yet.",
    "requested": "Requested: {{date}}",
    "paymentMethodLine": "Payment method: {{method}}",
    "paidLine": "Paid: {{date}}",
    "transactionId": "Transaction ID:",
    "viewProof": "View payment proof",
    "rejectReason": "Reject reason: {{reason}}",
    "adminNote": "Admin note: {{note}}",
    "addPaymentMethod": "Add payment method first",
    "noPaymentMethod": "No payment method",
    "bankTransfer": "Bank Transfer",
    "inReview": "In Review",
    "approved": "Approved",
    "paid": "Paid",
    "rejected": "Rejected",
    "cancelled": "Cancelled",
    "loadFailed": "Failed to load withdrawal data",
    "requestFailed": "Failed to request withdrawal",
    "submitted": "Withdrawal request submitted.",
    "invalidAmount": "Withdrawal amount must be between {{min}} and {{max}}.",
    "addPaymentFirst": "Please add a payment method before requesting withdrawal."
  },
  "km": {
    "back": "ត្រឡប់ក្រោយ",
    "refresh": "ផ្ទុកឡើងវិញ",
    "withdrawal": "ការដកប្រាក់",
    "authorPageFinance": "ហិរញ្ញវត្ថុទំព័រអ្នកនិពន្ធ",
    "description": "ស្នើសុំដកប្រាក់ពីចំណូលទំព័រអ្នកនិពន្ធរបស់អ្នក។",
    "available": "អាចប្រើបាន",
    "pending": "កំពុងរង់ចាំ",
    "paidOut": "បានទូទាត់",
    "requestWithdrawal": "ស្នើសុំដកប្រាក់",
    "minimum": "ចំនួនអប្បបរមាសម្រាប់ដកប្រាក់គឺ {{amount}}។",
    "paymentMethod": "វិធីទទួលប្រាក់",
    "editPaymentMethod": "កែវិធីទទួលប្រាក់",
    "amount": "ចំនួនទឹកប្រាក់",
    "submitting": "កំពុងដាក់ស្នើ...",
    "submitWithdrawal": "ដាក់សំណើដកប្រាក់",
    "needAtLeast": "ត្រូវមានយ៉ាងតិច {{amount}}",
    "history": "ប្រវត្តិការដកប្រាក់",
    "noHistory": "មិនទាន់មានប្រវត្តិដកប្រាក់។",
    "requested": "បានស្នើ៖ {{date}}",
    "paymentMethodLine": "វិធីទទួលប្រាក់៖ {{method}}",
    "paidLine": "បានបង់៖ {{date}}",
    "transactionId": "លេខប្រតិបត្តិការ៖",
    "viewProof": "មើលភស្តុតាងទូទាត់",
    "rejectReason": "មូលហេតុបដិសេធ៖ {{reason}}",
    "adminNote": "កំណត់សម្គាល់ Admin៖ {{note}}",
    "addPaymentMethod": "សូមបន្ថែមវិធីទទួលប្រាក់ជាមុន",
    "noPaymentMethod": "មិនមានវិធីទទួលប្រាក់",
    "bankTransfer": "ផ្ទេរតាមធនាគារ",
    "inReview": "កំពុងពិនិត្យ",
    "approved": "បានអនុម័ត",
    "paid": "បានបង់",
    "rejected": "បានបដិសេធ",
    "cancelled": "បានបោះបង់",
    "loadFailed": "មិនអាចផ្ទុកទិន្នន័យដកប្រាក់បាន",
    "requestFailed": "មិនអាចស្នើសុំដកប្រាក់បាន",
    "submitted": "បានដាក់សំណើដកប្រាក់។",
    "invalidAmount": "ចំនួនដកប្រាក់ត្រូវនៅចន្លោះ {{min}} និង {{max}}។",
    "addPaymentFirst": "សូមបន្ថែមវិធីទទួលប្រាក់មុនពេលស្នើសុំដកប្រាក់។"
  },
  "zh": {
    "back": "返回",
    "refresh": "刷新",
    "withdrawal": "提现",
    "authorPageFinance": "作者主页财务",
    "description": "从作者主页收入中申请提现。",
    "available": "可用",
    "pending": "待处理",
    "paidOut": "已支付",
    "requestWithdrawal": "申请提现",
    "minimum": "最低提现金额为 {{amount}}。",
    "paymentMethod": "收款方式",
    "editPaymentMethod": "编辑收款方式",
    "amount": "金额",
    "submitting": "提交中...",
    "submitWithdrawal": "提交提现",
    "needAtLeast": "至少需要 {{amount}}",
    "history": "提现记录",
    "noHistory": "暂无提现记录。",
    "requested": "申请时间：{{date}}",
    "paymentMethodLine": "收款方式：{{method}}",
    "paidLine": "支付时间：{{date}}",
    "transactionId": "交易编号：",
    "viewProof": "查看付款凭证",
    "rejectReason": "拒绝原因：{{reason}}",
    "adminNote": "管理员备注：{{note}}",
    "addPaymentMethod": "请先添加收款方式",
    "noPaymentMethod": "无收款方式",
    "bankTransfer": "银行转账",
    "inReview": "审核中",
    "approved": "已批准",
    "paid": "已支付",
    "rejected": "已拒绝",
    "cancelled": "已取消",
    "loadFailed": "无法加载提现数据",
    "requestFailed": "无法申请提现",
    "submitted": "提现申请已提交。",
    "invalidAmount": "提现金额必须在 {{min}} 至 {{max}} 之间。",
    "addPaymentFirst": "申请提现前请先添加收款方式。"
  },
  "ja": {
    "back": "戻る",
    "refresh": "更新",
    "withdrawal": "出金",
    "authorPageFinance": "著者ページの収益",
    "description": "著者ページの収入から出金を申請します。",
    "available": "利用可能",
    "pending": "保留中",
    "paidOut": "支払済み",
    "requestWithdrawal": "出金を申請",
    "minimum": "最低出金額は {{amount}} です。",
    "paymentMethod": "受取方法",
    "editPaymentMethod": "受取方法を編集",
    "amount": "金額",
    "submitting": "送信中...",
    "submitWithdrawal": "出金を申請",
    "needAtLeast": "最低 {{amount}} が必要",
    "history": "出金履歴",
    "noHistory": "出金履歴はまだありません。",
    "requested": "申請日：{{date}}",
    "paymentMethodLine": "受取方法：{{method}}",
    "paidLine": "支払日：{{date}}",
    "transactionId": "取引ID：",
    "viewProof": "支払い証明を見る",
    "rejectReason": "却下理由：{{reason}}",
    "adminNote": "管理者メモ：{{note}}",
    "addPaymentMethod": "先に受取方法を追加してください",
    "noPaymentMethod": "受取方法なし",
    "bankTransfer": "銀行振込",
    "inReview": "審査中",
    "approved": "承認済み",
    "paid": "支払済み",
    "rejected": "却下",
    "cancelled": "キャンセル済み",
    "loadFailed": "出金データを読み込めませんでした",
    "requestFailed": "出金を申請できませんでした",
    "submitted": "出金申請を送信しました。",
    "invalidAmount": "出金額は {{min}} から {{max}} の範囲で入力してください。",
    "addPaymentFirst": "出金申請の前に受取方法を追加してください。"
  },
  "ko": {
    "back": "뒤로",
    "refresh": "새로고침",
    "withdrawal": "출금",
    "authorPageFinance": "작가 페이지 재정",
    "description": "작가 페이지 수입에서 출금을 요청하세요.",
    "available": "사용 가능",
    "pending": "대기 중",
    "paidOut": "지급 완료",
    "requestWithdrawal": "출금 요청",
    "minimum": "최소 출금 금액은 {{amount}}입니다.",
    "paymentMethod": "지급 방법",
    "editPaymentMethod": "지급 방법 수정",
    "amount": "금액",
    "submitting": "제출 중...",
    "submitWithdrawal": "출금 요청 제출",
    "needAtLeast": "최소 {{amount}} 필요",
    "history": "출금 내역",
    "noHistory": "아직 출금 내역이 없습니다.",
    "requested": "요청일: {{date}}",
    "paymentMethodLine": "지급 방법: {{method}}",
    "paidLine": "지급일: {{date}}",
    "transactionId": "거래 ID:",
    "viewProof": "결제 증빙 보기",
    "rejectReason": "거절 사유: {{reason}}",
    "adminNote": "관리자 메모: {{note}}",
    "addPaymentMethod": "먼저 지급 방법을 추가하세요",
    "noPaymentMethod": "지급 방법 없음",
    "bankTransfer": "은행 이체",
    "inReview": "검토 중",
    "approved": "승인됨",
    "paid": "지급됨",
    "rejected": "거절됨",
    "cancelled": "취소됨",
    "loadFailed": "출금 데이터를 불러오지 못했습니다",
    "requestFailed": "출금을 요청하지 못했습니다",
    "submitted": "출금 요청을 제출했습니다.",
    "invalidAmount": "출금 금액은 {{min}}에서 {{max}} 사이여야 합니다.",
    "addPaymentFirst": "출금 요청 전에 지급 방법을 추가하세요."
  }
})


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

function normalizeStatus(status) {
  const value = String(status || '').toLowerCase()

  if (value === 'approved') return 'approved'
  if (value === 'paid') return 'paid'
  if (value === 'rejected') return 'rejected'
  if (value === 'cancelled') return 'cancelled'

  return 'inReview'
}

function statusLabel(status) {
  return getDisplayText(`authorPageWithdrawal.${normalizeStatus(status)}`)
}

function getStatusClass(status) {
  const value = normalizeStatus(status)

  if (value === 'paid') return 'bg-[#ecfdf5] text-[#047857]'
  if (value === 'approved') return 'bg-[#eff6ff] text-[#1d4ed8]'
  if (value === 'rejected') return 'bg-[#fff1f2] text-[#be123c]'
  if (value === 'cancelled') return 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]'

  return 'bg-[#fff7ed] text-[#c2410c]'
}

function getReadablePaymentMethod(method) {
  const value = String(method || '').toLowerCase()

  if (value === 'aba') return 'ABA Bank'
  if (value === 'paypal') return 'PayPal'
  if (value === 'bank') return getDisplayText('authorPageWithdrawal.bankTransfer')
  if (value === 'wing') return 'Wing'
  if (value === 'truemoney') return 'TrueMoney'

  return method || getDisplayText('authorPageWithdrawal.noPaymentMethod')
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
  if (!paymentMethod) return getDisplayText('authorPageWithdrawal.addPaymentMethod')

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
    <section className={`rounded-[28px] bg-[var(--shadow-bg-surface)] p-5 shadow-sm ring-1 ring-[var(--shadow-border)] ${className}`}>
      {children}
    </section>
  )
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-black ${getStatusClass(status)}`}>
      {statusLabel(status)}
    </span>
  )
}

function WithdrawalHistoryItem({ request }) {
  const amount = Number(
    request.amount_usd ||
      request.amount ||
      request.requested_amount ||
      request.net_amount ||
      0
  )

  const status = request.status || request.state || 'in_review'
  const requestedAt = request.created_at || request.requested_at || request.date
  const paidAt = request.paid_at || request.paidAt || null

  const snapshot = request.payment_method_snapshot || request.paymentMethodSnapshot || {}
  const method = getPaymentLabel(snapshot)

  const transactionId =
    request.paid_transaction_id ||
    request.paidTransactionId ||
    ''

  const proofUrl =
    request.paid_proof_url ||
    request.paidProofUrl ||
    ''

  const rejectReason =
    request.reject_reason ||
    request.rejectReason ||
    ''

  const adminNote =
    request.admin_note ||
    request.adminNote ||
    request.note ||
    ''

  return (
    <div className="border-b border-[var(--shadow-border)] py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[15px] font-black text-[var(--shadow-text-primary)]">{formatMoney(amount)}</div>

          <div className="mt-1 text-[12px] font-semibold text-[var(--shadow-text-tertiary)]">
            {getDisplayText('authorPageWithdrawal.requested', { date: formatDate(requestedAt) })}
          </div>

          <div className="mt-1 text-[12px] font-semibold text-[var(--shadow-text-tertiary)]">
            {getDisplayText('authorPageWithdrawal.paymentMethodLine', { method })}
          </div>

          {paidAt ? (
            <div className="mt-1 text-[12px] font-semibold text-[#047857]">
              {getDisplayText('authorPageWithdrawal.paidLine', { date: formatDate(paidAt) })}
            </div>
          ) : null}
        </div>

        <StatusBadge status={status} />
      </div>

      {transactionId ? (
        <div className="mt-3 rounded-[14px] bg-[var(--shadow-bg-soft)] px-3 py-2 text-[12px] font-bold leading-5 text-[var(--shadow-text-secondary)]">
          {getDisplayText('authorPageWithdrawal.transactionId')} <span className="font-black text-[var(--shadow-text-primary)]">{transactionId}</span>
        </div>
      ) : null}

      {proofUrl ? (
        <a
          href={proofUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex h-9 items-center rounded-full bg-[#eef2ff] px-4 text-[12px] font-black text-[#4f46e5] active:scale-95"
        >
          {getDisplayText('authorPageWithdrawal.viewProof')}
        </a>
      ) : null}

      {rejectReason ? (
        <div className="mt-3 rounded-[14px] bg-[#fff1f2] px-3 py-2 text-[12px] font-bold leading-5 text-[#be123c]">
          {getDisplayText('authorPageWithdrawal.rejectReason', { reason: rejectReason })}
        </div>
      ) : null}

      {adminNote ? (
        <div className="mt-3 rounded-[14px] bg-[var(--shadow-bg-soft)] px-3 py-2 text-[12px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
          {getDisplayText('authorPageWithdrawal.adminNote', { note: adminNote })}
        </div>
      ) : null}
    </div>
  )
}

export default function AuthorPageWithdrawalPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [searchParams] = useSearchParams()
  const backPath =
    searchParams.get('back') === 'income'
      ? '/author/page/finance/income'
      : '/author/page/finance'
  const paymentBackPath =
    searchParams.get('back') === 'income'
      ? '/author/page/finance/withdrawal?back=income'
      : '/author/page/finance/withdrawal'
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
        throw new Error(data.message || getDisplayText('authorPageWithdrawal.loadFailed'))
      }

      setIncome(normalizeIncomePayload(data))
    } catch (error) {
      setMessage(error.message || getDisplayText('authorPageWithdrawal.loadFailed'))
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
      setMessage(getDisplayText('authorPageWithdrawal.invalidAmount', { min: formatMoney(MIN_WITHDRAWAL_AMOUNT), max: formatMoney(availableBalance) }))
      return
    }

    if (!income.paymentMethod) {
      setMessage(getDisplayText('authorPageWithdrawal.addPaymentFirst'))
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
        throw new Error(data.message || getDisplayText('authorPageWithdrawal.requestFailed'))
      }

      setAmount('')
      setMessage(getDisplayText('authorPageWithdrawal.submitted'))
      await loadWithdrawalData()
    } catch (error) {
      setMessage(error.message || getDisplayText('authorPageWithdrawal.requestFailed'))
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    loadWithdrawalData()
  }, [])

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-10">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[980px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate(backPath)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-soft)]"
            aria-label={t('authorPageWithdrawal.back')}
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="text-[16px] font-black text-[var(--shadow-text-primary)]">{t('authorPageWithdrawal.withdrawal')}</div>

          <button
            type="button"
            onClick={loadWithdrawalData}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={t('authorPageWithdrawal.refresh')}
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
            <div className="text-[12px] font-black uppercase tracking-[0.08em] text-white/55">{t('authorPageWithdrawal.authorPageFinance')}</div>
            <h1 className="mt-1 text-[26px] font-black tracking-tight">{t('authorPageWithdrawal.withdrawal')}</h1>
            <p className="mt-2 text-[13px] font-semibold leading-6 text-white/65">
              {t('authorPageWithdrawal.description')}
            </p>
          </div>

          <div className="grid grid-cols-3 border-t border-white/10">
            <div className="p-4">
              <div className="text-[11px] font-bold text-white/45">{t('authorPageWithdrawal.available')}</div>
              <div className="mt-1 text-[18px] font-black">{loading ? '...' : formatMoney(income.availableBalance)}</div>
            </div>
            <div className="p-4">
              <div className="text-[11px] font-bold text-white/45">{t('authorPageWithdrawal.pending')}</div>
              <div className="mt-1 text-[18px] font-black">{loading ? '...' : formatMoney(income.pendingBalance)}</div>
            </div>
            <div className="p-4">
              <div className="text-[11px] font-bold text-white/45">{t('authorPageWithdrawal.paidOut')}</div>
              <div className="mt-1 text-[18px] font-black">{loading ? '...' : formatMoney(income.paidOut)}</div>
            </div>
          </div>
        </section>

        <Card>
          <h2 className="text-[18px] font-black text-[var(--shadow-text-primary)]">{t('authorPageWithdrawal.requestWithdrawal')}</h2>
          <p className="mt-1 text-[12px] font-semibold leading-5 text-[var(--shadow-text-tertiary)]">
            {t('authorPageWithdrawal.minimum', { amount: formatMoney(MIN_WITHDRAWAL_AMOUNT) })}
          </p>

          <div className="mt-4 rounded-[22px] bg-[var(--shadow-bg-soft)] p-4 ring-1 ring-[var(--shadow-border)]">
            <div className="text-[11px] font-black uppercase tracking-[0.08em] text-[var(--shadow-text-secondary)]">{t('authorPageWithdrawal.paymentMethod')}</div>
            <div className="mt-1 text-[13px] font-black text-[var(--shadow-text-primary)]">{paymentLabel}</div>
            <button
              type="button"
              onClick={() => navigate(`/author/payment-method?back=${encodeURIComponent(paymentBackPath)}`)}
              className="mt-3 h-10 rounded-full bg-[var(--shadow-bg-surface)] px-4 text-[12px] font-black text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border-strong)] active:scale-95"
            >
              {t('authorPageWithdrawal.editPaymentMethod')}
            </button>
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-[11px] font-black uppercase tracking-[0.08em] text-[var(--shadow-text-secondary)]">
              {t('authorPageWithdrawal.amount')}
            </label>
            <input
              type="number"
              min={MIN_WITHDRAWAL_AMOUNT}
              max={availableBalance}
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
              className="h-12 w-full rounded-2xl border border-[var(--shadow-border-strong)] bg-[var(--shadow-input-bg)] px-3.5 text-[14px] font-bold text-[var(--shadow-text-primary)] outline-none focus:border-[var(--shadow-border-strong)]"
            />
          </div>

          <button
            type="button"
            onClick={submitWithdrawal}
            disabled={saving || loading || !canWithdraw}
            className="mt-4 h-12 w-full rounded-full bg-[#111827] text-[13px] font-black text-white active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? t('authorPageWithdrawal.submitting') : canWithdraw ? t('authorPageWithdrawal.submitWithdrawal') : t('authorPageWithdrawal.needAtLeast', { amount: formatMoney(MIN_WITHDRAWAL_AMOUNT) })}
          </button>
        </Card>

        <Card>
          <div className="mb-1 flex items-center justify-between gap-3">
            <h2 className="text-[18px] font-black text-[var(--shadow-text-primary)]">{t('authorPageWithdrawal.history')}</h2>
          </div>

          {recentRequests.length > 0 ? (
            <div className="mt-2">
              {recentRequests.map((request, index) => (
                <WithdrawalHistoryItem key={request.id || index} request={request} />
              ))}
            </div>
          ) : (
            <div className="rounded-[22px] bg-[var(--shadow-bg-soft)] px-4 py-6 text-center text-[13px] font-semibold text-[var(--shadow-text-tertiary)]">
              {t('authorPageWithdrawal.noHistory')}
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
