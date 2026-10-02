import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('premiumPaymentFlow', {
  en: {
    confirmTitle: 'Confirm Premium Payment',
    confirmText: 'You are about to pay for Shadow Premium.',
    plan: 'Plan',
    amount: 'Amount to pay',
    diamonds: 'Diamonds',
    base: 'Base',
    bonus: 'Bonus',
    total: 'Total',
    payExactly: 'Please pay exactly {{amount}}.',
    activateNote: 'Premium and Diamonds will be added after your payment is confirmed.',
    nonRefundable: 'Completed payments are non-refundable.',
    cancel: 'Cancel',
    continuePay: 'Continue to Pay',
    creating: 'Creating payment...',
    paymentStatus: 'Premium Payment',
    waiting: 'Waiting for payment',
    success: 'Premium activated',
    expired: 'Payment expired',
    cancelled: 'Payment cancelled',
    review: 'Payment under review',
    unknown: 'Payment status',
    waitingText: 'Complete the payment, then return here to check the status.',
    successText: 'Your Premium membership and Diamonds have been added.',
    expiredText: 'This payment order has expired. Please create a new one.',
    cancelledText: 'This payment order was cancelled.',
    reviewText: 'Your payment was received and is waiting for review.',
    payNow: 'Pay now',
    checkStatus: 'Check status',
    checking: 'Checking...',
    close: 'Close',
    cancelPayment: 'Cancel payment',
    failedCreate: 'Failed to create Premium payment.',
    failedStatus: 'Failed to check Premium payment.',
    failedCancel: 'Failed to cancel Premium payment.',
    loginRequired: 'Please log in to subscribe to Premium.',
    oneMonth: '1 Month',
    months: '{{count}} Months',
    twelveMonths: '12 Months',
    orderId: 'Order ID',
  },
  km: {
    confirmTitle: 'បញ្ជាក់ការបង់ Premium',
    confirmText: 'អ្នកកំពុងត្រៀមបង់ប្រាក់សម្រាប់ Shadow Premium។',
    plan: 'គម្រោង',
    amount: 'ចំនួនត្រូវបង់',
    diamonds: 'Diamonds',
    base: 'ចំនួនដើម',
    bonus: 'Bonus',
    total: 'សរុប',
    payExactly: 'សូមបង់ឱ្យត្រឹមត្រូវ {{amount}}។',
    activateNote: 'Premium និង Diamonds នឹងត្រូវបញ្ចូល បន្ទាប់ពីការទូទាត់ត្រូវបានបញ្ជាក់។',
    nonRefundable: 'ការទូទាត់ដែលបានបញ្ចប់ មិនអាចសងប្រាក់វិញបានទេ។',
    cancel: 'បោះបង់',
    continuePay: 'បន្តទៅបង់ប្រាក់',
    creating: 'កំពុងបង្កើតការទូទាត់...',
    paymentStatus: 'ការទូទាត់ Premium',
    waiting: 'កំពុងរង់ចាំការទូទាត់',
    success: 'Premium បានដំណើរការ',
    expired: 'ការទូទាត់បានផុតកំណត់',
    cancelled: 'បានបោះបង់ការទូទាត់',
    review: 'កំពុងពិនិត្យការទូទាត់',
    unknown: 'ស្ថានភាពការទូទាត់',
    waitingText: 'សូមបង់ប្រាក់ រួចត្រឡប់មកទីនេះដើម្បីពិនិត្យស្ថានភាព។',
    successText: 'Premium និង Diamonds របស់អ្នកត្រូវបានបញ្ចូលរួចរាល់។',
    expiredText: 'Order នេះផុតកំណត់ហើយ។ សូមបង្កើតការទូទាត់ថ្មី។',
    cancelledText: 'Order ទូទាត់នេះត្រូវបានបោះបង់។',
    reviewText: 'យើងបានទទួលការទូទាត់ ហើយកំពុងរង់ចាំការពិនិត្យ។',
    payNow: 'បង់ឥឡូវនេះ',
    checkStatus: 'ពិនិត្យស្ថានភាព',
    checking: 'កំពុងពិនិត្យ...',
    close: 'បិទ',
    cancelPayment: 'បោះបង់ការទូទាត់',
    failedCreate: 'មិនអាចបង្កើតការទូទាត់ Premium បានទេ។',
    failedStatus: 'មិនអាចពិនិត្យការទូទាត់ Premium បានទេ។',
    failedCancel: 'មិនអាចបោះបង់ការទូទាត់ Premium បានទេ។',
    loginRequired: 'សូម Login ដើម្បីជាវ Premium។',
    oneMonth: '1 ខែ',
    months: '{{count}} ខែ',
    twelveMonths: '12 ខែ',
    orderId: 'Order ID',
  },
  zh: {
    confirmTitle: '确认 Premium 付款',
    confirmText: '您即将支付 Shadow Premium。',
    plan: '方案',
    amount: '付款金额',
    diamonds: 'Diamonds',
    base: '基础',
    bonus: '奖励',
    total: '总计',
    payExactly: '请准确支付 {{amount}}。',
    activateNote: '付款确认后，Premium 和 Diamonds 将自动添加。',
    nonRefundable: '已完成的付款不可退款。',
    cancel: '取消',
    continuePay: '继续付款',
    creating: '正在创建付款...',
    paymentStatus: 'Premium 付款',
    waiting: '等待付款',
    success: 'Premium 已激活',
    expired: '付款已过期',
    cancelled: '付款已取消',
    review: '付款审核中',
    unknown: '付款状态',
    waitingText: '完成付款后请返回这里检查状态。',
    successText: '您的 Premium 会员资格和 Diamonds 已添加。',
    expiredText: '此付款订单已过期，请创建新订单。',
    cancelledText: '此付款订单已取消。',
    reviewText: '已收到付款，正在等待审核。',
    payNow: '立即付款',
    checkStatus: '检查状态',
    checking: '检查中...',
    close: '关闭',
    cancelPayment: '取消付款',
    failedCreate: '无法创建 Premium 付款。',
    failedStatus: '无法检查 Premium 付款。',
    failedCancel: '无法取消 Premium 付款。',
    loginRequired: '请登录后订阅 Premium。',
    oneMonth: '1 个月',
    months: '{{count}} 个月',
    twelveMonths: '12 个月',
    orderId: '订单 ID',
  },
  ja: {
    confirmTitle: 'Premium 支払い確認',
    confirmText: 'Shadow Premium の支払いを行います。',
    plan: 'プラン',
    amount: '支払い金額',
    diamonds: 'Diamonds',
    base: '基本',
    bonus: 'ボーナス',
    total: '合計',
    payExactly: '{{amount}} を正確にお支払いください。',
    activateNote: '支払い確認後、Premium と Diamonds が追加されます。',
    nonRefundable: '完了した支払いは返金できません。',
    cancel: 'キャンセル',
    continuePay: '支払いへ進む',
    creating: '支払いを作成中...',
    paymentStatus: 'Premium 支払い',
    waiting: '支払い待ち',
    success: 'Premium が有効になりました',
    expired: '支払い期限切れ',
    cancelled: '支払いキャンセル済み',
    review: '支払い確認中',
    unknown: '支払い状況',
    waitingText: '支払いを完了後、ここに戻って状態を確認してください。',
    successText: 'Premium メンバーシップと Diamonds が追加されました。',
    expiredText: 'この支払い注文は期限切れです。新しく作成してください。',
    cancelledText: 'この支払い注文はキャンセルされました。',
    reviewText: '支払いを受け取り、確認待ちです。',
    payNow: '今すぐ支払う',
    checkStatus: '状態を確認',
    checking: '確認中...',
    close: '閉じる',
    cancelPayment: '支払いをキャンセル',
    failedCreate: 'Premium 支払いを作成できませんでした。',
    failedStatus: 'Premium 支払いを確認できませんでした。',
    failedCancel: 'Premium 支払いをキャンセルできませんでした。',
    loginRequired: 'Premium に登録するにはログインしてください。',
    oneMonth: '1か月',
    months: '{{count}}か月',
    twelveMonths: '12か月',
    orderId: '注文 ID',
  },
  ko: {
    confirmTitle: 'Premium 결제 확인',
    confirmText: 'Shadow Premium 결제를 진행합니다.',
    plan: '플랜',
    amount: '결제 금액',
    diamonds: 'Diamonds',
    base: '기본',
    bonus: '보너스',
    total: '합계',
    payExactly: '{{amount}}를 정확히 결제해 주세요.',
    activateNote: '결제가 확인되면 Premium과 Diamonds가 추가됩니다.',
    nonRefundable: '완료된 결제는 환불되지 않습니다.',
    cancel: '취소',
    continuePay: '결제 계속',
    creating: '결제 생성 중...',
    paymentStatus: 'Premium 결제',
    waiting: '결제 대기 중',
    success: 'Premium 활성화 완료',
    expired: '결제 만료',
    cancelled: '결제 취소됨',
    review: '결제 검토 중',
    unknown: '결제 상태',
    waitingText: '결제를 완료한 후 여기로 돌아와 상태를 확인하세요.',
    successText: 'Premium 멤버십과 Diamonds가 추가되었습니다.',
    expiredText: '이 결제 주문은 만료되었습니다. 새 주문을 만들어 주세요.',
    cancelledText: '이 결제 주문은 취소되었습니다.',
    reviewText: '결제가 접수되었으며 검토 대기 중입니다.',
    payNow: '지금 결제',
    checkStatus: '상태 확인',
    checking: '확인 중...',
    close: '닫기',
    cancelPayment: '결제 취소',
    failedCreate: 'Premium 결제를 만들지 못했습니다.',
    failedStatus: 'Premium 결제를 확인하지 못했습니다.',
    failedCancel: 'Premium 결제를 취소하지 못했습니다.',
    loginRequired: 'Premium을 구독하려면 로그인해 주세요.',
    oneMonth: '1개월',
    months: '{{count}}개월',
    twelveMonths: '12개월',
    orderId: '주문 ID',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const PENDING_KEY = 'shadow_premium_payment_pending'

function getReaderToken() {
  return (
    sessionStorage.getItem('shadow_reader_token') ||
    localStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function getHeaders() {
  const token = getReaderToken()

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

function savePendingPayment(payment) {
  localStorage.setItem(PENDING_KEY, JSON.stringify(payment))
}

function loadPendingPayment() {
  try {
    return JSON.parse(localStorage.getItem(PENDING_KEY) || 'null')
  } catch {
    return null
  }
}

function clearPendingPayment() {
  localStorage.removeItem(PENDING_KEY)
}

function updateStoredPremium(premium) {
  if (!premium) return

  for (const storage of [localStorage, sessionStorage]) {
    try {
      const raw = storage.getItem('shadow_reader_user')
      if (!raw) continue

      const current = JSON.parse(raw)
      storage.setItem(
        'shadow_reader_user',
        JSON.stringify({
          ...current,
          is_premium: Boolean(premium.is_premium),
          premium_started_at: premium.premium_started_at || null,
          premium_expires_at: premium.premium_expires_at || null,
          premium_plan_months: Number(premium.premium_plan_months || 0),
        })
      )
    } catch {}
  }
}

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2).replace(/\.00$/, '')}`
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString()
}

function normalizePlan(plan) {
  const months = Number(plan?.id || plan?.months || plan?.plan_months || 0)
  const amount = Number(String(plan?.price || plan?.amount_usd || '').replace(/[^0-9.]/g, ''))
  const base = Number(plan?.diamonds || plan?.base_diamonds || 0)
  const bonus = Number(plan?.bonus || plan?.bonus_diamonds || 0)

  return {
    months,
    amount,
    base,
    bonus,
    total: base + bonus,
  }
}

function DiamondIcon({ className = 'h-6 w-6' }) {
  return (
    <img
      src="/assets/Icons/Diamond.svg"
      alt=""
      className={`shrink-0 object-contain ${className}`}
    />
  )
}

function ModalShell({ children, onBackdrop }) {
  return createPortal(
    <div className="fixed inset-0 z-[300000] flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-5">
      <button
        type="button"
        aria-label=""
        className="absolute inset-0"
        onClick={onBackdrop}
      />
      <div className="relative w-full max-w-[430px] rounded-t-[28px] bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-6 shadow-2xl dark:bg-[var(--shadow-bg-surface)] sm:rounded-[28px] sm:pb-6">
        {children}
      </div>
    </div>,
    document.body
  )
}

export default function PremiumPaymentFlow({
  plan,
  label,
  onSuccess,
}) {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const normalizedPlan = useMemo(() => normalizePlan(plan), [plan])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [payment, setPayment] = useState(null)
  const [statusOpen, setStatusOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [checking, setChecking] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [message, setMessage] = useState('')

  const planLabel =
    normalizedPlan.months === 1
      ? t('premiumPaymentFlow.oneMonth')
      : normalizedPlan.months === 12
        ? t('premiumPaymentFlow.twelveMonths')
        : t('premiumPaymentFlow.months', { count: normalizedPlan.months })

  const status = String(payment?.status || '').toLowerCase()

  const statusTitle =
    status === 'success'
      ? t('premiumPaymentFlow.success')
      : status === 'expired'
        ? t('premiumPaymentFlow.expired')
        : status === 'cancelled'
          ? t('premiumPaymentFlow.cancelled')
          : status === 'pending_review' || status === 'callback_received'
            ? t('premiumPaymentFlow.review')
            : status === 'waiting_payment'
              ? t('premiumPaymentFlow.waiting')
              : t('premiumPaymentFlow.unknown')

  const statusText =
    status === 'success'
      ? t('premiumPaymentFlow.successText')
      : status === 'expired'
        ? t('premiumPaymentFlow.expiredText')
        : status === 'cancelled'
          ? t('premiumPaymentFlow.cancelledText')
          : status === 'pending_review' || status === 'callback_received'
            ? t('premiumPaymentFlow.reviewText')
            : t('premiumPaymentFlow.waitingText')

  async function checkStatus(orderId, silent = false) {
    if (!orderId || !getReaderToken()) return null

    try {
      if (!silent) setChecking(true)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/purchase/premium/status/${encodeURIComponent(orderId)}`,
        {
          headers: getHeaders(),
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data.ok) {
        throw new Error(
          data.message || t('premiumPaymentFlow.failedStatus')
        )
      }

      setPayment(data.payment)
      setStatusOpen(true)

      const nextStatus = String(data.payment?.status || '').toLowerCase()

      if (nextStatus === 'success') {
        clearPendingPayment()
        updateStoredPremium(data.premium)
        onSuccess?.(data)
      } else if (
        ['expired', 'cancelled', 'rejected'].includes(nextStatus)
      ) {
        clearPendingPayment()
      } else {
        savePendingPayment(data.payment)
      }

      return data
    } catch (error) {
      if (!silent) {
        setMessage(
          error.message ||
          t('premiumPaymentFlow.failedStatus')
        )
      }

      return null
    } finally {
      if (!silent) setChecking(false)
    }
  }

  async function createPayment() {
    if (!getReaderToken()) {
      setConfirmOpen(false)
      navigate('/login')
      return
    }

    if (
      creating ||
      ![1, 3, 12].includes(normalizedPlan.months)
    ) {
      return
    }

    try {
      setCreating(true)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/purchase/premium/create`,
        {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({
            plan_months: normalizedPlan.months,
          }),
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data.ok) {
        throw new Error(
          data.message || t('premiumPaymentFlow.failedCreate')
        )
      }

      if (!data.payment?.checkout_url) {
        throw new Error(
          t('premiumPaymentFlow.failedCreate')
        )
      }

      savePendingPayment(data.payment)
      setPayment(data.payment)
      setConfirmOpen(false)
      window.location.href = data.payment.checkout_url
    } catch (error) {
      setMessage(
        error.message ||
        t('premiumPaymentFlow.failedCreate')
      )
    } finally {
      setCreating(false)
    }
  }

  async function cancelPayment() {
    if (!payment?.order_id || cancelling) return

    try {
      setCancelling(true)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/purchase/premium/cancel/${encodeURIComponent(payment.order_id)}`,
        {
          method: 'POST',
          headers: getHeaders(),
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data.ok) {
        throw new Error(
          data.message || t('premiumPaymentFlow.failedCancel')
        )
      }

      clearPendingPayment()
      setPayment({
        ...payment,
        status: 'cancelled',
      })
    } catch (error) {
      setMessage(
        error.message ||
        t('premiumPaymentFlow.failedCancel')
      )
    } finally {
      setCancelling(false)
    }
  }

  function openConfirmation() {
    if (!getReaderToken()) {
      navigate('/login')
      return
    }

    setMessage('')
    setConfirmOpen(true)
  }

  function reopenPayment() {
    if (!payment?.checkout_url) return
    window.location.href = payment.checkout_url
  }

  useEffect(() => {
    const saved = loadPendingPayment()

    if (saved?.order_id && getReaderToken()) {
      setPayment(saved)
      checkStatus(saved.order_id, true)
    }
  }, [])

  useEffect(() => {
    const refresh = () => {
      const saved = loadPendingPayment()

      if (
        document.visibilityState === 'visible' &&
        saved?.order_id &&
        getReaderToken()
      ) {
        checkStatus(saved.order_id, true)
      }
    }

    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)

    return () => {
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])

  useEffect(() => {
    if (!confirmOpen && !statusOpen) return undefined

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previous
    }
  }, [confirmOpen, statusOpen])

  return (
    <>
      <button
        type="button"
        onClick={openConfirmation}
        className="mt-4 flex h-14 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#ffd500] to-[#ffad0a] text-[20px] font-semibold text-[#282828] shadow-[0_7px_18px_rgba(255,180,0,0.18)] active:scale-[0.99]"
      >
        {label}
      </button>

      {confirmOpen ? (
        <ModalShell onBackdrop={() => !creating && setConfirmOpen(false)}>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fff7d7] dark:bg-amber-500/10">
            <DiamondIcon className="h-7 w-7" />
          </div>

          <h2 className="mt-4 text-center text-[21px] font-black text-[var(--shadow-text-primary)]">
            {t('premiumPaymentFlow.confirmTitle')}
          </h2>

          <p className="mt-2 text-center text-[13px] leading-5 text-[var(--shadow-text-secondary)]">
            {t('premiumPaymentFlow.confirmText')}
          </p>

          <div className="mt-5 rounded-[18px] bg-[var(--shadow-bg-soft)] p-4">
            <div className="flex items-center justify-between gap-4 text-[13px]">
              <span className="text-[var(--shadow-text-secondary)]">
                {t('premiumPaymentFlow.plan')}
              </span>
              <span className="font-black text-[var(--shadow-text-primary)]">
                {planLabel}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-4 text-[13px]">
              <span className="text-[var(--shadow-text-secondary)]">
                {t('premiumPaymentFlow.amount')}
              </span>
              <span className="text-[22px] font-black text-[#ff3f62]">
                {formatMoney(normalizedPlan.amount)}
              </span>
            </div>

            <div className="mt-4 border-t border-[var(--shadow-border)] pt-4">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[var(--shadow-text-secondary)]">
                  {t('premiumPaymentFlow.base')}
                </span>
                <span className="font-bold text-[var(--shadow-text-primary)]">
                  {formatNumber(normalizedPlan.base)} Diamonds
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-[12px]">
                <span className="text-[var(--shadow-text-secondary)]">
                  {t('premiumPaymentFlow.bonus')}
                </span>
                <span className="font-bold text-[#f59e0b]">
                  +{formatNumber(normalizedPlan.bonus)} Diamonds
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-[var(--shadow-border)] pt-3 text-[13px]">
                <span className="font-bold text-[var(--shadow-text-primary)]">
                  {t('premiumPaymentFlow.total')}
                </span>
                <span className="flex items-center gap-1.5 font-black text-[var(--shadow-text-primary)]">
                  <DiamondIcon className="h-5 w-5" />
                  {formatNumber(normalizedPlan.total)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[16px] bg-[#fff8e8] px-4 py-3 text-[12px] leading-5 text-[#8a5a00] dark:bg-amber-500/10 dark:text-amber-200">
            <div className="font-black">
              {t('premiumPaymentFlow.payExactly', {
                amount: formatMoney(normalizedPlan.amount),
              })}
            </div>
            <div className="mt-1">
              {t('premiumPaymentFlow.activateNote')}
            </div>
            <div className="mt-1">
              {t('premiumPaymentFlow.nonRefundable')}
            </div>
          </div>

          {message ? (
            <p className="mt-3 text-center text-[12px] font-bold text-red-500">
              {message}
            </p>
          ) : null}

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={creating}
              onClick={() => setConfirmOpen(false)}
              className="h-12 rounded-full bg-[var(--shadow-bg-soft)] text-[14px] font-black text-[var(--shadow-text-primary)] disabled:opacity-50"
            >
              {t('premiumPaymentFlow.cancel')}
            </button>

            <button
              type="button"
              disabled={creating}
              onClick={createPayment}
              className="h-12 rounded-full bg-[#ffb800] px-4 text-[14px] font-black text-[#202124] shadow-sm disabled:opacity-60"
            >
              {creating
                ? t('premiumPaymentFlow.creating')
                : t('premiumPaymentFlow.continuePay')}
            </button>
          </div>
        </ModalShell>
      ) : null}

      {statusOpen && payment ? (
        <ModalShell onBackdrop={() => setStatusOpen(false)}>
          <div
            className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
              status === 'success'
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300'
                : status === 'expired' || status === 'cancelled'
                  ? 'bg-red-50 text-red-500 dark:bg-red-500/10'
                  : 'bg-amber-50 text-amber-500 dark:bg-amber-500/10'
            }`}
          >
            <i
              className={`fa-solid ${
                status === 'success'
                  ? 'fa-circle-check'
                  : status === 'expired' || status === 'cancelled'
                    ? 'fa-circle-xmark'
                    : 'fa-clock'
              } text-[22px]`}
            />
          </div>

          <h2 className="mt-4 text-center text-[21px] font-black text-[var(--shadow-text-primary)]">
            {statusTitle}
          </h2>

          <p className="mt-2 text-center text-[13px] leading-5 text-[var(--shadow-text-secondary)]">
            {statusText}
          </p>

          <div className="mt-5 rounded-[18px] bg-[var(--shadow-bg-soft)] p-4 text-[13px]">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[var(--shadow-text-secondary)]">
                {t('premiumPaymentFlow.amount')}
              </span>
              <span className="font-black text-[var(--shadow-text-primary)]">
                {formatMoney(payment.amount_usd)}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="text-[var(--shadow-text-secondary)]">
                {t('premiumPaymentFlow.diamonds')}
              </span>
              <span className="font-black text-[var(--shadow-text-primary)]">
                {formatNumber(payment.total_diamonds)} Diamonds
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="text-[var(--shadow-text-secondary)]">
                {t('premiumPaymentFlow.orderId')}
              </span>
              <span className="max-w-[210px] truncate font-mono text-[11px] font-bold text-[var(--shadow-text-primary)]">
                {payment.order_id}
              </span>
            </div>
          </div>

          {message ? (
            <p className="mt-3 text-center text-[12px] font-bold text-red-500">
              {message}
            </p>
          ) : null}

          {status === 'waiting_payment' ? (
            <>
              <button
                type="button"
                onClick={reopenPayment}
                className="mt-5 h-12 w-full rounded-full bg-[#ffb800] text-[14px] font-black text-[#202124]"
              >
                {t('premiumPaymentFlow.payNow')}
              </button>

              <button
                type="button"
                disabled={checking}
                onClick={() => checkStatus(payment.order_id)}
                className="mt-3 h-12 w-full rounded-full bg-[var(--shadow-bg-soft)] text-[14px] font-black text-[var(--shadow-text-primary)] disabled:opacity-60"
              >
                {checking
                  ? t('premiumPaymentFlow.checking')
                  : t('premiumPaymentFlow.checkStatus')}
              </button>

              <button
                type="button"
                disabled={cancelling}
                onClick={cancelPayment}
                className="mt-3 h-11 w-full text-[13px] font-bold text-red-500 disabled:opacity-50"
              >
                {t('premiumPaymentFlow.cancelPayment')}
              </button>
            </>
          ) : status === 'pending_review' || status === 'callback_received' ? (
            <button
              type="button"
              disabled={checking}
              onClick={() => checkStatus(payment.order_id)}
              className="mt-5 h-12 w-full rounded-full bg-[#ffb800] text-[14px] font-black text-[#202124] disabled:opacity-60"
            >
              {checking
                ? t('premiumPaymentFlow.checking')
                : t('premiumPaymentFlow.checkStatus')}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStatusOpen(false)}
              className="mt-5 h-12 w-full rounded-full bg-[#202124] text-[14px] font-black text-white dark:bg-white dark:text-[#202124]"
            >
              {t('premiumPaymentFlow.close')}
            </button>
          )}
        </ModalShell>
      ) : null}
    </>
  )
}
