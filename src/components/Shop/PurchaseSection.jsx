import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import PaymentProfileModal from '../Wallet/PaymentProfileModal'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('purchaseSection', {
  en: {
    diamond: 'Diamond',
    shadowCoin: 'Shadow Coin',
    success: 'Success',
    waiting: 'Waiting',
    review: 'Review',
    expired: 'Expired',
    cancelled: 'Cancelled',
    rejected: 'Rejected',
    unknown: 'Unknown',
    bestValue: 'Best Value',
    diamonds: 'Diamonds',
    bonusCoins: 'Bonus {{count}} Coins',
    noBonusCoins: 'No bonus coins',
    paymentMethod: 'Payment Method',
    paymentMethodDescription: 'After payment, your Diamonds will be added automatically when payment confirms it.',
    openingPayment: 'Opening payment...',
    payExactly: 'Pay exactly {{amount}}',
    nonRefundable: 'Completed payments are non-refundable.',
    cancel: 'Cancel',
    paymentSuccessful: 'Payment Successful',
    waitingForReview: 'Waiting for Review',
    paymentConfirmation: 'Payment Confirmation',
    diamondsAdded: '{{count}} Diamonds were added to your wallet.',
    paymentNeedsReview: 'We received your payment but it needs manual review.',
    returnAfterPayment: 'Return here after payment. We will confirm it automatically.',
    amount: 'Amount',
    timeLeft: 'Time left',
    orderId: 'Order ID',
    trxId: 'Trx ID',
    checking: 'Checking...',
    checkStatus: 'Check Status',
    done: 'Done',
    failedLoadPurchaseData: 'Failed to load purchase data.',
    paymentNotConfirmed: 'Payment not confirmed yet.',
    diamondsAddedToast: '{{count}} Diamonds added to your wallet.',
    paymentWaitingReview: 'Payment is waiting for review.',
    failedCreatePayment: 'Failed to create payment order.',
    purchaseDiamonds: 'Purchase Diamonds',
    loginDescription: 'Log in to buy Diamonds, receive bonus Coins, and unlock premium episodes.',
    logIn: 'Log In',
    shadowPremium: 'Shadow Premium',
    premiumDiamonds: '{{count}} Diamonds',
    earlyAccess: 'Early Access',
    freeStories: 'Free 7 Stories',
    premiumPrice: '$5/month',
    comingSoon: 'Coming soon',
    purchaseNotes: 'Purchase Notes',
    noteDiamonds: 'Diamonds are used to unlock premium episodes and support creators.',
    noteBonusCoins: 'Bonus Coins are added automatically after payment is confirmed.',
    noteRefund: 'Completed purchases are non-refundable.',
  },
  km: {
    diamond: 'Diamond',
    shadowCoin: 'Shadow Coin',
    success: 'ជោគជ័យ',
    waiting: 'កំពុងរង់ចាំ',
    review: 'កំពុងពិនិត្យ',
    expired: 'ផុតកំណត់',
    cancelled: 'បានបោះបង់',
    rejected: 'បានបដិសេធ',
    unknown: 'មិនស្គាល់',
    bestValue: 'តម្លៃល្អបំផុត',
    diamonds: 'Diamonds',
    bonusCoins: 'Bonus {{count}} Coins',
    noBonusCoins: 'គ្មាន Bonus Coin',
    paymentMethod: 'វិធីទូទាត់',
    paymentMethodDescription: 'បន្ទាប់ពីទូទាត់ Diamonds របស់អ្នកនឹងត្រូវបញ្ចូលដោយស្វ័យប្រវត្តិ នៅពេលការទូទាត់ត្រូវបានបញ្ជាក់។',
    openingPayment: 'កំពុងបើកការទូទាត់...',
    payExactly: 'ទូទាត់ចំនួន {{amount}}',
    nonRefundable: 'ការទូទាត់ដែលបានបញ្ចប់ មិនអាចសងប្រាក់វិញបានទេ។',
    cancel: 'បោះបង់',
    paymentSuccessful: 'ការទូទាត់ជោគជ័យ',
    waitingForReview: 'កំពុងរង់ចាំការពិនិត្យ',
    paymentConfirmation: 'ការបញ្ជាក់ការទូទាត់',
    diamondsAdded: '{{count}} Diamonds ត្រូវបានបញ្ចូលទៅ Wallet របស់អ្នក។',
    paymentNeedsReview: 'យើងបានទទួលការទូទាត់របស់អ្នក ប៉ុន្តែត្រូវការការពិនិត្យដោយដៃ។',
    returnAfterPayment: 'ត្រឡប់មកទីនេះបន្ទាប់ពីទូទាត់។ យើងនឹងបញ្ជាក់ដោយស្វ័យប្រវត្តិ។',
    amount: 'ចំនួនទឹកប្រាក់',
    timeLeft: 'ពេលវេលានៅសល់',
    orderId: 'Order ID',
    trxId: 'Trx ID',
    checking: 'កំពុងពិនិត្យ...',
    checkStatus: 'ពិនិត្យស្ថានភាព',
    done: 'រួចរាល់',
    failedLoadPurchaseData: 'មិនអាចទាញទិន្នន័យការទិញបាន។',
    paymentNotConfirmed: 'ការទូទាត់មិនទាន់ត្រូវបានបញ្ជាក់ទេ។',
    diamondsAddedToast: '{{count}} Diamonds ត្រូវបានបញ្ចូលទៅ Wallet របស់អ្នក។',
    paymentWaitingReview: 'ការទូទាត់កំពុងរង់ចាំការពិនិត្យ។',
    failedCreatePayment: 'មិនអាចបង្កើត Order ទូទាត់បាន។',
    purchaseDiamonds: 'ទិញ Diamonds',
    loginDescription: 'ចូលគណនីដើម្បីទិញ Diamonds ទទួល Bonus Coins និងដោះសោភាគ Premium។',
    logIn: 'ចូលគណនី',
    shadowPremium: 'Shadow Premium',
    premiumDiamonds: '{{count}} Diamonds',
    earlyAccess: 'ចូលអានមុន',
    freeStories: 'អាន 7 រឿងឥតគិតថ្លៃ',
    premiumPrice: '$5/ខែ',
    comingSoon: 'មកដល់ឆាប់ៗ',
    purchaseNotes: 'ចំណាំអំពីការទិញ',
    noteDiamonds: 'Diamonds ប្រើសម្រាប់ដោះសោភាគ Premium និងគាំទ្រអ្នកបង្កើត។',
    noteBonusCoins: 'Bonus Coins នឹងត្រូវបញ្ចូលដោយស្វ័យប្រវត្តិ បន្ទាប់ពីការទូទាត់ត្រូវបានបញ្ជាក់។',
    noteRefund: 'ការទិញដែលបានបញ្ចប់ មិនអាចសងប្រាក់វិញបានទេ។',
  },
  zh: {
    diamond: 'Diamond',
    shadowCoin: 'Shadow Coin',
    success: '成功',
    waiting: '等待中',
    review: '审核中',
    expired: '已过期',
    cancelled: '已取消',
    rejected: '已拒绝',
    unknown: '未知',
    bestValue: '最划算',
    diamonds: 'Diamonds',
    bonusCoins: '赠送 {{count}} Coins',
    noBonusCoins: '无额外 Coins',
    paymentMethod: '付款方式',
    paymentMethodDescription: '付款确认后，Diamonds 将自动添加到您的账户。',
    openingPayment: '正在打开付款...',
    payExactly: '支付 {{amount}}',
    nonRefundable: '已完成的付款不可退款。',
    cancel: '取消',
    paymentSuccessful: '付款成功',
    waitingForReview: '等待审核',
    paymentConfirmation: '付款确认',
    diamondsAdded: '{{count}} Diamonds 已添加到您的 Wallet。',
    paymentNeedsReview: '我们已收到您的付款，但需要人工审核。',
    returnAfterPayment: '付款后请返回此处，我们会自动确认。',
    amount: '金额',
    timeLeft: '剩余时间',
    orderId: '订单 ID',
    trxId: '交易 ID',
    checking: '检查中...',
    checkStatus: '检查状态',
    done: '完成',
    failedLoadPurchaseData: '无法加载购买数据。',
    paymentNotConfirmed: '付款尚未确认。',
    diamondsAddedToast: '{{count}} Diamonds 已添加到您的 Wallet。',
    paymentWaitingReview: '付款正在等待审核。',
    failedCreatePayment: '无法创建付款订单。',
    purchaseDiamonds: '购买 Diamonds',
    loginDescription: '登录后可购买 Diamonds、获得额外 Coins，并解锁 Premium 章节。',
    logIn: '登录',
    shadowPremium: 'Shadow Premium',
    premiumDiamonds: '{{count}} Diamonds',
    earlyAccess: '抢先阅读',
    freeStories: '免费阅读 7 个故事',
    premiumPrice: '$5/月',
    comingSoon: '即将推出',
    purchaseNotes: '购买说明',
    noteDiamonds: 'Diamonds 用于解锁 Premium 章节并支持创作者。',
    noteBonusCoins: '付款确认后，额外 Coins 将自动添加。',
    noteRefund: '已完成的购买不可退款。',
  },
  ja: {
    diamond: 'Diamond',
    shadowCoin: 'Shadow Coin',
    success: '成功',
    waiting: '待機中',
    review: '確認中',
    expired: '期限切れ',
    cancelled: 'キャンセル済み',
    rejected: '拒否',
    unknown: '不明',
    bestValue: 'お得',
    diamonds: 'Diamonds',
    bonusCoins: 'ボーナス {{count}} Coins',
    noBonusCoins: 'ボーナス Coins なし',
    paymentMethod: '支払い方法',
    paymentMethodDescription: '支払いが確認されると、Diamonds は自動的に追加されます。',
    openingPayment: '支払いを開いています...',
    payExactly: '{{amount}} を支払う',
    nonRefundable: '完了した支払いは返金できません。',
    cancel: 'キャンセル',
    paymentSuccessful: '支払い成功',
    waitingForReview: '確認待ち',
    paymentConfirmation: '支払い確認',
    diamondsAdded: '{{count}} Diamonds が Wallet に追加されました。',
    paymentNeedsReview: '支払いを受け取りましたが、手動確認が必要です。',
    returnAfterPayment: '支払い後にここへ戻ってください。自動的に確認します。',
    amount: '金額',
    timeLeft: '残り時間',
    orderId: '注文 ID',
    trxId: '取引 ID',
    checking: '確認中...',
    checkStatus: '状態を確認',
    done: '完了',
    failedLoadPurchaseData: '購入データを読み込めませんでした。',
    paymentNotConfirmed: '支払いはまだ確認されていません。',
    diamondsAddedToast: '{{count}} Diamonds が Wallet に追加されました。',
    paymentWaitingReview: '支払いは確認待ちです。',
    failedCreatePayment: '支払い注文を作成できませんでした。',
    purchaseDiamonds: 'Diamonds を購入',
    loginDescription: 'ログインして Diamonds を購入し、ボーナス Coins を受け取り、Premium エピソードを解除できます。',
    logIn: 'ログイン',
    shadowPremium: 'Shadow Premium',
    premiumDiamonds: '{{count}} Diamonds',
    earlyAccess: '先行アクセス',
    freeStories: '7作品を無料で読む',
    premiumPrice: '$5/月',
    comingSoon: '近日公開',
    purchaseNotes: '購入について',
    noteDiamonds: 'Diamonds は Premium エピソードの解除とクリエイターの支援に使用されます。',
    noteBonusCoins: '支払い確認後、ボーナス Coins が自動的に追加されます。',
    noteRefund: '完了した購入は返金できません。',
  },
  ko: {
    diamond: 'Diamond',
    shadowCoin: 'Shadow Coin',
    success: '성공',
    waiting: '대기 중',
    review: '검토 중',
    expired: '만료됨',
    cancelled: '취소됨',
    rejected: '거절됨',
    unknown: '알 수 없음',
    bestValue: '최고 혜택',
    diamonds: 'Diamonds',
    bonusCoins: '보너스 {{count}} Coins',
    noBonusCoins: '보너스 Coins 없음',
    paymentMethod: '결제 방법',
    paymentMethodDescription: '결제가 확인되면 Diamonds가 자동으로 추가됩니다.',
    openingPayment: '결제를 여는 중...',
    payExactly: '{{amount}} 결제',
    nonRefundable: '완료된 결제는 환불되지 않습니다.',
    cancel: '취소',
    paymentSuccessful: '결제 성공',
    waitingForReview: '검토 대기 중',
    paymentConfirmation: '결제 확인',
    diamondsAdded: '{{count}} Diamonds가 Wallet에 추가되었습니다.',
    paymentNeedsReview: '결제를 받았지만 수동 검토가 필요합니다.',
    returnAfterPayment: '결제 후 이곳으로 돌아오세요. 자동으로 확인합니다.',
    amount: '금액',
    timeLeft: '남은 시간',
    orderId: '주문 ID',
    trxId: '거래 ID',
    checking: '확인 중...',
    checkStatus: '상태 확인',
    done: '완료',
    failedLoadPurchaseData: '구매 데이터를 불러오지 못했습니다.',
    paymentNotConfirmed: '결제가 아직 확인되지 않았습니다.',
    diamondsAddedToast: '{{count}} Diamonds가 Wallet에 추가되었습니다.',
    paymentWaitingReview: '결제가 검토를 기다리고 있습니다.',
    failedCreatePayment: '결제 주문을 만들지 못했습니다.',
    purchaseDiamonds: 'Diamonds 구매',
    loginDescription: '로그인하여 Diamonds를 구매하고 보너스 Coins를 받으며 Premium 에피소드를 잠금 해제하세요.',
    logIn: '로그인',
    shadowPremium: 'Shadow Premium',
    premiumDiamonds: '{{count}} Diamonds',
    earlyAccess: '선공개 이용',
    freeStories: '7개 스토리 무료',
    premiumPrice: '$5/월',
    comingSoon: '출시 예정',
    purchaseNotes: '구매 안내',
    noteDiamonds: 'Diamonds는 Premium 에피소드 잠금 해제와 창작자 지원에 사용됩니다.',
    noteBonusCoins: '결제가 확인되면 보너스 Coins가 자동으로 추가됩니다.',
    noteRefund: '완료된 구매는 환불되지 않습니다.',
  },
})


const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const PENDING_KEY = 'shadow_manual_payment_pending'

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
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString()
}

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`
}

function getSecondsLeft(dateValue) {
  if (!dateValue) return 0
  return Math.max(0, Math.ceil((new Date(dateValue).getTime() - Date.now()) / 1000))
}

function formatCountdown(seconds) {
  const safe = Math.max(0, Number(seconds || 0))
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`
}

function savePendingPayment(payment) {
  localStorage.setItem(PENDING_KEY, JSON.stringify(payment))
}

function getSavedPendingPayment() {
  try {
    return JSON.parse(localStorage.getItem(PENDING_KEY) || 'null')
  } catch {
    return null
  }
}

function clearSavedPendingPayment() {
  localStorage.removeItem(PENDING_KEY)
}

function DiamondIcon({ size = 'h-8 w-8' }) {
  return (
    <img
      src="/assets/Icons/Diamond.svg"
      alt="Diamond"
      className={`${size} shrink-0 object-contain`}
      loading="lazy"
      decoding="async"
    />
  )
}

function CoinIcon({ size = 'h-8 w-8' }) {
  return (
    <img
      src="/assets/Icons/Shadow Coin.svg"
      alt="Shadow Coin"
      className={`shrink-0 object-contain ${size}`}
      loading="lazy"
      decoding="async"
    />
  )
}

function StatusBadge({ status, t }) {
  const value = String(status || '').toLowerCase()
  const labelMap = {
    success: t('purchaseSection.success'),
    waiting_payment: t('purchaseSection.waiting'),
    pending_review: t('purchaseSection.review'),
    expired: t('purchaseSection.expired'),
    cancelled: t('purchaseSection.cancelled'),
    rejected: t('purchaseSection.rejected'),
  }
  const tone = value === 'success'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/25'
    : value === 'pending_review'
      ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/25'
      : value === 'waiting_payment'
        ? 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-500/15 dark:text-slate-300 dark:border-slate-500/25'
        : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/25'

  return <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${tone}`}>{labelMap[value] || value || t('purchaseSection.unknown')}</span>
}

function PackageCard({ item, onPurchase, t }) {
  const isBestValue = Number(item.package_usd) === 10

  return (
    <div
      className="relative flex min-h-[107px] items-start gap-3 overflow-hidden rounded-[12px] bg-[var(--shadow-bg-surface)] px-4 pb-3 ring-1 ring-[var(--shadow-border)]"
      style={{ paddingTop: isBestValue ? '32px' : '16px' }}
    >
      {isBestValue ? (
        <span
          className="absolute left-0 top-0 flex h-6 items-center bg-gradient-to-r from-[#FF5A67] to-[#FF747C] pl-3 pr-5 text-[9px] font-black uppercase tracking-[0.08em] text-white"
          style={{ borderBottomRightRadius: '16px' }}
        >
          {t('purchaseSection.bestValue')}
        </span>
      ) : null}

      <div className="flex min-w-0 flex-1 items-start gap-3 self-center">
  <DiamondIcon size="h-6 w-6" />

  <div className="min-w-0 flex-1">
    <div className="relative -top-[2px] flex items-baseline gap-1.5">
      <span className="text-[27px] font-bold leading-none tracking-[-0.04em] text-[var(--shadow-text-primary)]">
        {formatNumber(item.diamonds)}
      </span>
      <span className="text-[12px] font-black text-[var(--shadow-text-primary)]">{t('purchaseSection.diamonds')}</span>
    </div>

    <p className={`mt-2 text-[11px] font-bold ${item.bonus_gems > 0 ? 'text-[#B56A00] dark:text-amber-300' : 'text-[var(--shadow-text-secondary)]'}`}>
      {item.bonus_gems > 0
        ? t('purchaseSection.bonusCoins', { count: formatNumber(item.bonus_gems) })
        : t('purchaseSection.noBonusCoins')}
    </p>
  </div>
</div>

      <button
        type="button"
        onClick={onPurchase}
        className="min-w-[84px] shrink-0 self-center rounded-full bg-[#FFD400] px-3 py-2 text-[14px] font-[600] text-[#111111] active:scale-95"
      >
        {formatMoney(item.package_usd)}
      </button>
    </div>
  )
}

function PaymentMethodModal({ selectedPackage, creating, onClose, onCreateManualPayment, t }) {
  useEffect(() => {
    const bodyOverflow = document.body.style.overflow
    const htmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = bodyOverflow
      document.documentElement.style.overflow = htmlOverflow
    }
  }, [])

  if (!selectedPackage) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/60 sm:items-center sm:px-4">
      <div className="w-full rounded-t-[28px] bg-[var(--shadow-bg-elevated)] p-5 text-[var(--shadow-text-primary)] shadow-2xl sm:max-w-[430px] sm:rounded-[28px]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[20px] font-black text-[var(--shadow-text-primary)]">{t('purchaseSection.paymentMethod')}</h3>
            <p className="mt-1 text-[12px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
              {t('purchaseSection.paymentMethodDescription')}
            </p>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95">
            <i className="fas fa-times text-[14px]" />
          </button>
        </div>

        <button
          type="button"
          onClick={onCreateManualPayment}
          disabled={creating}
          className="flex w-full items-center justify-between rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 text-left active:scale-[0.99] disabled:opacity-60"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-14 items-center justify-center rounded-xl bg-[#E91D2D] text-[13px] font-black text-white">KHQR</div>
            <div>
              <p className="text-[14px] font-black text-[var(--shadow-text-primary)]">PayWay</p>
              <p className="mt-1 text-[11px] font-semibold text-[var(--shadow-text-secondary)]">
                {creating
                  ? t('purchaseSection.openingPayment')
                  : t('purchaseSection.payExactly', { amount: formatMoney(selectedPackage.package_usd) })}
              </p>
            </div>
          </div>
          <i className="fas fa-chevron-right text-[14px] text-[var(--shadow-text-primary)]" />
        </button>

        <p className="mb-2 mt-3 text-center text-[10px] font-semibold text-[var(--shadow-text-tertiary)]">
          {t('purchaseSection.nonRefundable')}
        </p>

        <button type="button" onClick={onClose} className="h-12 w-full rounded-2xl bg-[#111111] text-[14px] font-black text-white active:scale-[0.99] dark:bg-white dark:text-[#111827]">
          {t('purchaseSection.cancel')}
        </button>
      </div>
        </div>,
    document.body
  )
}

function PaymentStatusModal({ payment, secondsLeft, checking, message, onClose, onRefresh, t }) {
  useEffect(() => {
    const bodyOverflow = document.body.style.overflow
    const htmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = bodyOverflow
      document.documentElement.style.overflow = htmlOverflow
    }
  }, [])

  if (!payment) return null

  const status = String(payment.status || '').toLowerCase()
  const isSuccess = status === 'success'
  const isReview = status === 'pending_review'
  const isWaiting = status === 'waiting_payment'

  return createPortal(
  <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/60 px-4 pb-4 sm:items-center sm:pb-0">
      <div className="w-full max-w-[460px] rounded-[28px] bg-[var(--shadow-bg-elevated)] p-5 text-[var(--shadow-text-primary)] shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[20px] font-bold text-[var(--shadow-text-primary)]">{isSuccess ? t('purchaseSection.paymentSuccessful') : isReview ? t('purchaseSection.waitingForReview') : t('purchaseSection.paymentConfirmation')}</h3>
            <p className="mt-1 text-[12px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
              {isSuccess
                ? t('purchaseSection.diamondsAdded', { count: formatNumber(payment.diamonds) })
                : isReview
                  ? t('purchaseSection.paymentNeedsReview')
                  : t('purchaseSection.returnAfterPayment')}
            </p>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95">
            <i className="fas fa-times text-[14px]" />
          </button>
        </div>

        <div className="rounded-[22px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--shadow-text-secondary)]">{t('purchaseSection.amount')}</p>
              <p className="mt-1 text-[26px] font-bold text-[var(--shadow-text-primary)]">{formatMoney(payment.amount_usd)}</p>
            </div>
            <StatusBadge status={payment.status} t={t} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--shadow-text-tertiary)]">{t('purchaseSection.diamonds')}</p>
              <p className="mt-1 text-[15px] font-bold text-[var(--shadow-text-primary)]">{formatNumber(payment.diamonds)}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--shadow-text-tertiary)]">{t('purchaseSection.timeLeft')}</p>
              <p className="mt-1 text-[15px] font-bold text-[var(--shadow-text-primary)]">{isWaiting ? formatCountdown(secondsLeft) : '-'}</p>
            </div>
          </div>
          <p className="mt-4 break-all text-[11px] font-bold text-[var(--shadow-text-secondary)]">{t('purchaseSection.orderId')}: {payment.order_id}</p>
          {payment.aba_trx_id ? <p className="mt-1 break-all text-[11px] font-bold text-[var(--shadow-text-secondary)]">{t('purchaseSection.trxId')}: {payment.aba_trx_id}</p> : null}
        </div>

        {message ? <p className="mt-3 text-center text-[12px] font-bold leading-5 text-[var(--shadow-text-primary)]">{message}</p> : null}

        {isWaiting ? (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button type="button" onClick={onRefresh} disabled={checking} className="rounded-[18px] bg-[#111111] py-4 text-[14px] font-normal text-white active:scale-[0.99] disabled:opacity-50 dark:bg-white dark:text-[#111827]">
              {checking ? t('purchaseSection.checking') : t('purchaseSection.checkStatus')}
            </button>
            <button type="button" onClick={onClose} disabled={checking} className="rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] py-4 text-[14px] font-normal text-[var(--shadow-text-primary)] active:scale-[0.99] disabled:opacity-50">
              {t('purchaseSection.cancel')}
            </button>
          </div>
        ) : (
          <button type="button" onClick={onClose} className="mt-4 w-full rounded-[18px] bg-[#111111] py-4 text-[14px] font-normal text-white active:scale-[0.99] dark:bg-white dark:text-[#111827]">
            {t('purchaseSection.done')}
          </button>
        )}
      </div>
        </div>,
    document.body
  )
}

export default function PurchaseSection() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [wallet, setWallet] = useState(null)
  const [user, setUser] = useState(null)
  const [packages, setPackages] = useState(fallbackPackages)
  const [selectedUsd, setSelectedUsd] = useState(1)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [showPaymentMethods, setShowPaymentMethods] = useState(false)
  const [showPaymentProfileRequired, setShowPaymentProfileRequired] = useState(false)
  const [manualPayment, setManualPayment] = useState(null)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [creatingPayment, setCreatingPayment] = useState(false)
  const [checking, setChecking] = useState(false)
  const [toast, setToast] = useState('')

  const selectedPackage = useMemo(
    () => packages.find((item) => Number(item.package_usd) === Number(selectedUsd)) || packages[0],
    [packages, selectedUsd]
  )

  const hasPaymentProfile = Boolean(String(user?.payment_account_name || '').trim())

  function openStatusModal(payment) {
    setManualPayment(payment)
    setSecondsLeft(getSecondsLeft(payment.proof_expires_at || payment.expires_at || payment.expired_at))
  }

  async function loadPurchaseData() {
    const token = getReaderToken()
    if (!token) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const [packagesResponse, walletResponse, userResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/purchase/packages`),
        fetch(`${API_BASE_URL}/api/purchase/wallet`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/api/users/me`, { headers: getHeaders() }),
      ])

      const packagesData = await packagesResponse.json().catch(() => ({}))
      const walletData = await walletResponse.json().catch(() => ({}))
      const userData = await userResponse.json().catch(() => ({}))

      if (packagesData.ok && Array.isArray(packagesData.packages)) setPackages(packagesData.packages)
      if (walletData.ok) setWallet(walletData.wallet)
      if (userData.ok && userData.user) setUser(userData.user)
    } catch {
      setMessage(t('purchaseSection.failedLoadPurchaseData'))
    } finally {
      setLoading(false)
    }
  }

  async function refreshPaymentStatus(orderId, silent = false) {
    if (!orderId || !getReaderToken()) return null

    try {
      setChecking(true)
      const response = await fetch(`${API_BASE_URL}/api/purchase/manual/status/${encodeURIComponent(orderId)}`, { headers: getHeaders() })
      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data.ok) {
        if (!silent) setToast(data.message || t('purchaseSection.paymentNotConfirmed'))
        return null
      }

      const payment = data.payment
      openStatusModal(payment)

      if (payment.status === 'success') {
        clearSavedPendingPayment()
        setToast(t('purchaseSection.diamondsAddedToast', { count: formatNumber(payment.diamonds) }))
        loadPurchaseData()
      } else if (payment.status === 'pending_review') {
        clearSavedPendingPayment()
        setToast(t('purchaseSection.paymentWaitingReview'))
        loadPurchaseData()
      } else if (['expired', 'cancelled', 'rejected'].includes(payment.status)) {
        clearSavedPendingPayment()
        loadPurchaseData()
      }

      return payment
    } finally {
      setChecking(false)
    }
  }

  async function restorePendingPayment() {
    const saved = getSavedPendingPayment()
    if (!saved?.order_id || !getReaderToken()) return
    const payment = await refreshPaymentStatus(saved.order_id, true)
    if (payment && payment.status === 'waiting_payment') openStatusModal(payment)
  }

  async function createManualPayment() {
    if (!getReaderToken()) {
      navigate('/login')
      return
    }

    if (!selectedPackage || creatingPayment) return

    try {
      setCreatingPayment(true)
      setToast('')
      const response = await fetch(`${API_BASE_URL}/api/purchase/manual/create`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ package_usd: selectedPackage.package_usd }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data.ok) throw new Error(data.message || t('purchaseSection.failedCreatePayment'))

      savePendingPayment(data.payment)
      setShowPaymentMethods(false)
      window.location.href = data.payment.checkout_url
    } catch (error) {
      setToast(error.message || t('purchaseSection.failedCreatePayment'))
    } finally {
      setCreatingPayment(false)
    }
  }

  function handlePurchase(packageUsd = selectedUsd) {
  setSelectedUsd(packageUsd)

  if (!getReaderToken()) {
    navigate('/login')
    return
  }

  setToast('')

  if (!hasPaymentProfile) {
    setShowPaymentProfileRequired(true)
    return
  }

  setShowPaymentMethods(true)
}

  useEffect(() => {
    loadPurchaseData()
    restorePendingPayment()
  }, [])

  useEffect(() => {
    if (!manualPayment?.order_id || manualPayment.status !== 'waiting_payment') return undefined

    const timer = window.setInterval(() => {
      const next = getSecondsLeft(manualPayment.proof_expires_at || manualPayment.expires_at || manualPayment.expired_at)
      setSecondsLeft(next)
      refreshPaymentStatus(manualPayment.order_id, true)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [manualPayment?.order_id, manualPayment?.status])

  if (!getReaderToken()) {
    return (
      <section className="rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-6 text-center shadow-[0_6px_16px_rgba(17,17,17,0.035)]">
        <h2 className="text-[20px] font-black text-[var(--shadow-text-primary)]">{t('purchaseSection.purchaseDiamonds')}</h2>
        <p className="mx-auto mt-2 max-w-[320px] text-[13px] leading-6 text-[var(--shadow-text-secondary)]">
          {t('purchaseSection.loginDescription')}
        </p>
        <button type="button" onClick={() => navigate('/login')} className="mt-5 rounded-full bg-[#111111] px-6 py-3 text-[13px] font-extrabold text-white active:scale-95 dark:bg-white dark:text-[#111827]">
          {t('purchaseSection.logIn')}
        </button>
      </section>
    )
  }

  return (
  <section
  className="-mx-4 -mb-24 min-h-[calc(100vh-72px)] space-y-4 px-4 pb-24"
  style={{
    background:
      'linear-gradient(to bottom, #FFE66A 0px, color-mix(in srgb, #FFE66A 24%, var(--shadow-bg-page)) 120px, var(--shadow-bg-page) 190px, var(--shadow-bg-page) 100%)',
  }}
>
  <div className="rounded-[16px] bg-[var(--shadow-bg-surface)] px-4 pb-3 pt-3 ring-1 ring-[var(--shadow-border)]">
    <div className="px-4 pb-2 pt-1">
        <div className="flex items-center justify-center gap-2">
  <img src="/assets/Icons/Crown.svg" alt="" className="h-6 w-6 object-contain" />
  <h2 className="text-[16px] font-bold uppercase tracking-[0.04em] text-[var(--shadow-text-primary)]">
    {t('purchaseSection.shadowPremium')}
  </h2>
</div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center">
  <DiamondIcon size="h-10 w-10" />
</div>
            <p className="mt-2 text-[13px] font-bold text-[var(--shadow-text-primary)]">{t('purchaseSection.premiumDiamonds', { count: 120 })}</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center">
  <img
    src="/assets/Icons/Early Access.svg"
    alt={t('purchaseSection.earlyAccess')}
    className="h-10 w-10 object-contain"
  />
</div>
            <p className="mt-2 text-[13px] font-bold text-[var(--shadow-text-primary)]">{t('purchaseSection.earlyAccess')}</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center">
  <img
    src="/assets/Icons/Free 7 Stories.svg"
    alt={t('purchaseSection.freeStories')}
    className="h-10 w-10 object-contain"
  />
</div>
            <p className="mt-2 text-[13px] font-bold text-[var(--shadow-text-primary)]">{t('purchaseSection.freeStories')}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 pt-3">
  <button
  type="button"
  onClick={() => window.alert(t('purchaseSection.comingSoon'))}
  className="flex w-full items-center justify-center rounded-full bg-gradient-to-b from-[#FEE550] via-[#FEE14B] to-[#FECC35] px-5 py-2.5 text-[#111111] transition-all duration-200 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.99]"
>
  <span className="text-[19px] font-bold">{t('purchaseSection.premiumPrice')}</span>
</button>
</div>
</div>

<div>
     

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {packages.map((item) => (
          <PackageCard
            key={item.package_usd}
            item={item}
            onPurchase={() => handlePurchase(item.package_usd)}
            t={t}
          />
        ))}
      </div>
    </div>

    {message ? <p className="text-center text-[12px] font-bold text-[var(--shadow-text-secondary)]">{message}</p> : null}
    {toast ? <p className="text-center text-[12px] font-bold text-[var(--shadow-text-primary)]">{toast}</p> : null}

    <div className="px-1 pb-2">
  <h3 className="text-[14px] font-bold text-[var(--shadow-text-primary)]">{t('purchaseSection.purchaseNotes')}</h3>
<ol className="mt-3 list-decimal space-y-2 pl-5 text-[12px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
    <li>{t('purchaseSection.noteDiamonds')}</li>
    <li>{t('purchaseSection.noteBonusCoins')}</li>
    <li>{t('purchaseSection.noteRefund')}</li>
  </ol>
</div>

    {showPaymentProfileRequired ? (
  <PaymentProfileModal
    initialValue={user?.payment_account_name || ''}
    onClose={() => setShowPaymentProfileRequired(false)}
    onSaved={(savedUser) => {
      setUser((current) => ({ ...(current || {}), ...savedUser }))
      setShowPaymentProfileRequired(false)
      setShowPaymentMethods(true)
    }}
  />
) : null}

    {showPaymentMethods ? (
      <PaymentMethodModal
        selectedPackage={selectedPackage}
        creating={creatingPayment}
        onClose={() => setShowPaymentMethods(false)}
        onCreateManualPayment={createManualPayment}
        t={t}
      />
    ) : null}

    {manualPayment ? (
      <PaymentStatusModal
        payment={manualPayment}
        secondsLeft={secondsLeft}
        checking={checking}
        message={toast}
        onCancel={cancelPurchase}
        onClose={() => setManualPayment(null)}
        onRefresh={() => refreshPaymentStatus(manualPayment.order_id)}
        t={t}
      />
    ) : null}
  </section>
)

}
