import { useEffect, useId } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('diamondPurchaseSuccess', {
  en: {
    paymentSuccessful: 'Payment Successful!',
    diamondsAdded: 'Diamonds Added!',
    instantDescription: '{{count}} Diamonds have been added to your wallet.',
    delayedDescription: '{{count}} Diamonds have been credited to your wallet.',
    diamonds: 'Diamonds',
    bonusCoins: '+{{count}} Bonus Coins',
    bonusVouchers: '+{{count}} Bonus Vouchers',
    done: 'Done',
    viewWallet: 'View Wallet',
  },
  km: {
    paymentSuccessful: 'ការទូទាត់ជោគជ័យ!',
    diamondsAdded: 'បានបញ្ចូលពេជ្រហើយ!',
    instantDescription: 'ពេជ្រ {{count}} ត្រូវបានបញ្ចូលក្នុងកាបូបរបស់អ្នកហើយ។',
    delayedDescription: 'ពេជ្រ {{count}} ត្រូវបានបញ្ចូលក្នុងកាបូបរបស់អ្នកដោយជោគជ័យ។',
    diamonds: 'ពេជ្រ',
    bonusCoins: '+{{count}} កាក់រង្វាន់',
    bonusVouchers: '+{{count}} Voucher រង្វាន់',
    done: 'រួចរាល់',
    viewWallet: 'មើលកាបូប',
  },
  zh: {
    paymentSuccessful: '支付成功！',
    diamondsAdded: '钻石已到账！',
    instantDescription: '{{count}} 颗钻石已加入您的钱包。',
    delayedDescription: '{{count}} 颗钻石已成功存入您的钱包。',
    diamonds: '钻石',
    bonusCoins: '+{{count}} 奖励金币',
    bonusVouchers: '+{{count}} 奖励券',
    done: '完成',
    viewWallet: '查看钱包',
  },
  ja: {
    paymentSuccessful: 'お支払い完了！',
    diamondsAdded: 'ダイヤが追加されました！',
    instantDescription: '{{count}} 個のダイヤがウォレットに追加されました。',
    delayedDescription: '{{count}} 個のダイヤがウォレットに反映されました。',
    diamonds: 'ダイヤ',
    bonusCoins: '+{{count}} ボーナスコイン',
    bonusVouchers: '+{{count}} ボーナスバウチャー',
    done: '完了',
    viewWallet: 'ウォレットを見る',
  },
  ko: {
    paymentSuccessful: '결제가 완료되었습니다!',
    diamondsAdded: '다이아몬드가 지급되었습니다!',
    instantDescription: '다이아몬드 {{count}}개가 지갑에 추가되었습니다.',
    delayedDescription: '다이아몬드 {{count}}개가 지갑에 지급되었습니다.',
    diamonds: '다이아몬드',
    bonusCoins: '+{{count}} 보너스 코인',
    bonusVouchers: '+{{count}} 보너스 바우처',
    done: '완료',
    viewWallet: '지갑 보기',
  },
})

function positiveInteger(value) {
  const number = Number(value)
  return Number.isFinite(number) ? Math.max(0, Math.floor(number)) : 0
}

function RewardIcon({ type }) {
  if (type === 'diamond') {
    return <img src="/assets/Icons/Diamond.svg" alt="" className="h-8 w-8 object-contain" />
  }

  if (type === 'coin') {
    return <img src="/assets/Icons/Shadow Coin.svg" alt="" className="h-7 w-7 object-contain" />
  }

  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-7 w-7 text-amber-600 dark:text-amber-300">
      <path d="M6 7h20v6a3 3 0 0 0 0 6v6H6v-6a3 3 0 0 0 0-6V7Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M16 9v14" stroke="currentColor" strokeWidth="2" strokeDasharray="2 3" strokeLinecap="round" />
    </svg>
  )
}

export default function DiamondPurchaseSuccessModal({
  open = false,
  confirmed = false,
  diamonds = 0,
  bonusCoins = 0,
  bonusVouchers = 0,
  paymentMethod = 'payway',
  delayed = false,
  onClose,
}) {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const titleId = useId()
  const diamondCount = positiveInteger(diamonds)
  const coinCount = positiveInteger(bonusCoins)
  const voucherCount = positiveInteger(bonusVouchers)
  const isBinance = String(paymentMethod).toLowerCase().includes('binance')
  const shouldShow = Boolean(open && confirmed && diamondCount > 0)

  useEffect(() => {
    if (!shouldShow) return undefined
    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
    }
  }, [shouldShow])

  if (!shouldShow) return null

  const formattedDiamonds = diamondCount.toLocaleString()
  const rewardCount = isBinance ? voucherCount : coinCount
  const rewardType = isBinance ? 'voucher' : 'coin'
  const rewardLabel = isBinance
    ? t('diamondPurchaseSuccess.bonusVouchers', { count: rewardCount.toLocaleString() })
    : t('diamondPurchaseSuccess.bonusCoins', { count: rewardCount.toLocaleString() })

  function viewWallet() {
    onClose?.()
    navigate('/wallet')
  }

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 px-5 py-6" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-[380px] rounded-[26px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-6 pb-6 pt-7 text-center text-[var(--shadow-text-primary)] shadow-2xl"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF3C4] dark:bg-amber-400/15">
          <svg viewBox="0 0 64 64" aria-hidden="true" className="h-12 w-12" fill="none">
            <circle cx="32" cy="32" r="25" fill="#FFD400" />
            <path d="m20 32 8 8 16-17" stroke="#1B1B1B" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 id={titleId} className="mt-4 text-[21px] font-bold leading-8 text-[var(--shadow-text-primary)]">
          {t(delayed ? 'diamondPurchaseSuccess.diamondsAdded' : 'diamondPurchaseSuccess.paymentSuccessful')}
        </h2>
        <p className="mt-2 text-[13px] font-normal leading-6 text-[var(--shadow-text-secondary)]">
          {t(delayed ? 'diamondPurchaseSuccess.delayedDescription' : 'diamondPurchaseSuccess.instantDescription', { count: formattedDiamonds })}
        </p>

        <div className="mt-5 rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] px-4 py-4">
          <div className="flex items-center justify-center gap-3">
            <RewardIcon type="diamond" />
            <div className="text-left">
              <p className="text-[24px] font-bold leading-7 text-[var(--shadow-text-primary)]">+{formattedDiamonds}</p>
              <p className="text-[12px] font-medium text-[var(--shadow-text-secondary)]">{t('diamondPurchaseSuccess.diamonds')}</p>
            </div>
          </div>

          {rewardCount > 0 ? (
            <div className="mt-4 flex items-center justify-center gap-2 border-t border-[var(--shadow-border)] pt-4">
              <RewardIcon type={rewardType} />
              <p className="text-[14px] font-bold text-[#B57900] dark:text-amber-300">{rewardLabel}</p>
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button type="button" onClick={onClose} className="h-12 w-full rounded-full bg-[#FFD400] text-[14px] font-semibold text-[#111111] transition active:scale-[0.98]">
            {t('diamondPurchaseSuccess.done')}
          </button>
          <button type="button" onClick={viewWallet} className="h-12 w-full rounded-full border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)] text-[14px] font-medium text-[var(--shadow-text-primary)] transition active:scale-[0.98]">
            {t('diamondPurchaseSuccess.viewWallet')}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
