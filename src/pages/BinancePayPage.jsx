import { useLocation, useNavigate } from 'react-router-dom'
import BinanceCheckoutPanel from '../components/binance/BinanceCheckoutPanel'
import { PageHeader, PageShell, SurfaceCard } from '../components/common/PagePrimitives'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('binancePayPage', {
  en: {
    checkoutTitle: 'Binance verified checkout',
    paymentWarning: 'Submitting a transaction ID does not confirm payment. Never pay twice. Diamonds and 100 Vouchers are credited only after Admin verifies the Binance receipt and the correct reader.',
    title: 'Binance Pay',
    comingSoon: 'Admin verification',
    description: 'Prepare your payment order below. Pay only when the verified Binance QR is displayed. Admin confirmation is required before Diamonds are credited.',
    extraFee: 'Additional payment amount',
    extraFeeDetails: 'An additional 1 USDT applies to every Binance Pay purchase.',
    bonus: 'Purchase bonus',
    bonusDetails: 'Receive 100 Vouchers after each Binance Pay purchase is confirmed.',
    notActive: 'If the verified QR is not displayed, do not transfer USDT.',
    back: 'Back to Purchase',
  },
  km: {
    checkoutTitle: 'ការទូទាត់ Binance ដែលបានផ្ទៀងផ្ទាត់',
    paymentWarning: 'ការបញ្ជូន Transaction ID មិនមែនមានន័យថាបង់ប្រាក់ជោគជ័យទេ។ កុំបង់ប្រាក់ពីរដង។ ពេជ្រ និង 100 Vouchers នឹងបញ្ចូលតែក្រោយ Admin ផ្ទៀងផ្ទាត់ប្រាក់ចូល Binance និងអ្នកអានត្រឹមត្រូវ។',
    title: 'Binance Pay',
    comingSoon: 'ការផ្ទៀងផ្ទាត់ដោយ Admin',
    description: 'សូមរៀបចំ Order ទូទាត់នៅខាងក្រោម។ បង់ប្រាក់តែនៅពេល QR Binance ដែលបានផ្ទៀងផ្ទាត់បង្ហាញ។ ពេជ្រនឹងបញ្ចូលក្រោយ Admin បញ្ជាក់ការទូទាត់។',
    extraFee: 'ទឹកប្រាក់បន្ថែម',
    extraFeeDetails: 'រាល់ការទិញតាម Binance Pay ត្រូវបូកបន្ថែម 1 USDT។',
    bonus: 'រង្វាន់បន្ថែម',
    bonusDetails: 'ទទួលបាន 100 Vouchers បន្ទាប់ពីការទិញតាម Binance Pay នីមួយៗត្រូវបានបញ្ជាក់ជោគជ័យ។',
    notActive: 'បើ QR ដែលបានផ្ទៀងផ្ទាត់មិនបង្ហាញ សូមកុំផ្ញើ USDT។',
    back: 'ត្រឡប់ទៅទិញ',
  },
  zh: {
    checkoutTitle: '已验证的 Binance 付款',
    paymentWarning: '提交交易 ID 不代表付款成功。请勿重复付款。管理员核实 Binance 收款记录及读者身份后，才会发放钻石和 100 张 Vouchers。',
    title: 'Binance Pay',
    comingSoon: '管理员验证',
    description: '请在下方创建付款订单。仅在已验证的 Binance 付款二维码显示后转账。钻石将在管理员确认付款后发放。',
    extraFee: '额外支付金额',
    extraFeeDetails: '每笔 Binance Pay 购买均需额外支付 1 USDT。',
    bonus: '购买奖励',
    bonusDetails: '每笔 Binance Pay 购买确认成功后，可获得 100 张 Vouchers。',
    notActive: '未显示已验证的付款二维码时，请勿转账 USDT。',
    back: '返回购买页面',
  },
  ja: {
    checkoutTitle: '検証済みの Binance 決済',
    paymentWarning: '取引 ID の提出は支払い完了を意味しません。二重払いしないでください。管理者が Binance 入金と対象ユーザーを確認した後にのみ、ダイヤと 100 Vouchers が付与されます。',
    title: 'Binance Pay',
    comingSoon: '管理者による確認',
    description: '以下で支払い注文を作成してください。確認済みの Binance QR が表示された場合のみ送金してください。ダイヤは管理者による確認後に付与されます。',
    extraFee: '追加のお支払い金額',
    extraFeeDetails: 'Binance Pay での購入には毎回 1 USDT が追加されます。',
    bonus: '購入特典',
    bonusDetails: 'Binance Pay での購入が確認されるごとに 100 Vouchers を受け取れます。',
    notActive: '検証済みの QR が表示されない場合、USDT を送金しないでください。',
    back: '購入画面に戻る',
  },
  ko: {
    checkoutTitle: '검증된 Binance 결제',
    paymentWarning: '거래 ID 제출은 결제 확인이 아닙니다. 중복 결제하지 마세요. 관리자가 Binance 입금 내역과 해당 사용자를 확인한 후에만 다이아몬드와 Vouchers 100개가 지급됩니다.',
    title: 'Binance Pay',
    comingSoon: '관리자 확인',
    description: '아래에서 결제 주문을 준비하세요. 검증된 Binance QR이 표시된 경우에만 송금하세요. 다이아몬드는 관리자 확인 후 지급됩니다.',
    extraFee: '추가 결제 금액',
    extraFeeDetails: 'Binance Pay로 구매할 때마다 1 USDT가 추가됩니다.',
    bonus: '구매 보너스',
    bonusDetails: 'Binance Pay 구매가 확인될 때마다 100 Vouchers를 받습니다.',
    notActive: '검증된 QR이 표시되지 않으면 USDT를 송금하지 마세요.',
    back: '구매 화면으로 돌아가기',
  },
})

function BinanceMark({ className = 'h-12 w-12' }) {
  return (
    <img
      src="/assets/Icons/Picture/Binance%20Logo.svg"
      alt="Binance Pay"
      className={className}
      decoding="async"
    />
  )
}

const PACKAGES = new Set([1, 5, 10, 20, 50, 100])

export default function BinancePayPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const requestedPackage = Number(location.state?.packageUsd)
  const packageUsd = PACKAGES.has(requestedPackage) ? requestedPackage : undefined

  function goBack() {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }
    navigate('/shop/mall/purchase', { replace: true })
  }

  return (
    <PageShell className="pb-16">
      <PageHeader
        title={t('binancePayPage.title')}
        onBack={goBack}
        backLabel={t('binancePayPage.back')}
      />

      <main className="mx-auto w-full max-w-[560px] px-4 py-8 sm:py-12">
        <SurfaceCard className="overflow-hidden p-6 text-center sm:p-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[20px] bg-[#111111] shadow-lg">
            <BinanceMark className="h-14 w-14" />
          </div>

          <div className="mt-5 inline-flex rounded-full bg-amber-100 px-4 py-1.5 text-[12px] font-extrabold text-amber-900 dark:bg-amber-500/15 dark:text-amber-300">
            {t('binancePayPage.comingSoon')}
          </div>

          <h2 className="app-title mt-4 text-[24px] font-black">
            {t('binancePayPage.title')}
          </h2>
          <p className="app-muted mx-auto mt-2 max-w-[380px] text-[13px] leading-6">
            {t('binancePayPage.description')}
          </p>

          <div className="mt-6 grid gap-3 text-left">
            <div className="app-soft rounded-2xl border border-[var(--shadow-border)] p-4">
              <p className="app-title text-[13px] font-extrabold">
                {t('binancePayPage.extraFee')}
              </p>
              <p className="app-muted mt-1 text-[12px] leading-5">
                {t('binancePayPage.extraFeeDetails')}
              </p>
            </div>

            <div className="app-soft rounded-2xl border border-[var(--shadow-border)] p-4">
              <p className="app-title text-[13px] font-extrabold">
                {t('binancePayPage.bonus')}
              </p>
              <p className="app-muted mt-1 text-[12px] leading-5">
                {t('binancePayPage.bonusDetails')}
              </p>
            </div>
          </div>

          <p className="app-muted mt-5 text-[11px] leading-5">
            {t('binancePayPage.notActive')}
          </p>

        </SurfaceCard>

        <section className="mt-5" aria-label={t('binancePayPage.checkoutTitle')}>
          <BinanceCheckoutPanel packageUsd={packageUsd} />
        </section>

        <SurfaceCard className="mt-4 border border-[var(--shadow-border)] p-4 text-left">
          <p className="app-muted text-[12px] leading-6">
            {t('binancePayPage.paymentWarning')}
          </p>
        </SurfaceCard>

        <button
          type="button"
          onClick={goBack}
          className="mt-5 h-12 w-full rounded-2xl bg-[#111111] text-[14px] font-extrabold text-white transition active:scale-[0.99] dark:bg-white dark:text-[#111111]"
        >
          {t('binancePayPage.back')}
        </button>
      </main>
    </PageShell>
  )
}
