import { useNavigate } from 'react-router-dom'
import { PageHeader, PageShell, SurfaceCard } from '../components/common/PagePrimitives'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('binancePayPage', {
  en: {
    title: 'Binance Pay',
    comingSoon: 'Coming Soon',
    description: 'Binance Pay is being prepared and is not available for purchases yet.',
    extraFee: 'Additional payment amount',
    extraFeeDetails: 'An additional 1 USDT applies to every Binance Pay purchase.',
    bonus: 'Purchase bonus',
    bonusDetails: 'Receive 100 Vouchers after each Binance Pay purchase is confirmed.',
    notActive: 'Payments are not enabled on this page yet.',
    back: 'Back to Purchase',
  },
  km: {
    title: 'Binance Pay',
    comingSoon: 'មកដល់ឆាប់ៗ',
    description: 'Binance Pay កំពុងត្រូវបានរៀបចំ ហើយមិនទាន់អាចប្រើសម្រាប់ទិញបានទេ។',
    extraFee: 'ទឹកប្រាក់បន្ថែម',
    extraFeeDetails: 'រាល់ការទិញតាម Binance Pay ត្រូវបូកបន្ថែម 1 USDT។',
    bonus: 'រង្វាន់បន្ថែម',
    bonusDetails: 'ទទួលបាន 100 Vouchers បន្ទាប់ពីការទិញតាម Binance Pay នីមួយៗត្រូវបានបញ្ជាក់ជោគជ័យ។',
    notActive: 'ទំព័រនេះមិនទាន់បើកការទូទាត់ទេ។',
    back: 'ត្រឡប់ទៅទិញ',
  },
  zh: {
    title: 'Binance Pay',
    comingSoon: '即将推出',
    description: 'Binance Pay 正在准备中，目前暂不支持购买。',
    extraFee: '额外支付金额',
    extraFeeDetails: '每笔 Binance Pay 购买均需额外支付 1 USDT。',
    bonus: '购买奖励',
    bonusDetails: '每笔 Binance Pay 购买确认成功后，可获得 100 张 Vouchers。',
    notActive: '此页面尚未开放付款功能。',
    back: '返回购买页面',
  },
  ja: {
    title: 'Binance Pay',
    comingSoon: '近日公開',
    description: 'Binance Pay は準備中のため、現在は購入にご利用いただけません。',
    extraFee: '追加のお支払い金額',
    extraFeeDetails: 'Binance Pay での購入には毎回 1 USDT が追加されます。',
    bonus: '購入特典',
    bonusDetails: 'Binance Pay での購入が確認されるごとに 100 Vouchers を受け取れます。',
    notActive: 'このページではまだお支払いできません。',
    back: '購入画面に戻る',
  },
  ko: {
    title: 'Binance Pay',
    comingSoon: '출시 예정',
    description: 'Binance Pay를 준비 중이며 현재는 구매에 사용할 수 없습니다.',
    extraFee: '추가 결제 금액',
    extraFeeDetails: 'Binance Pay로 구매할 때마다 1 USDT가 추가됩니다.',
    bonus: '구매 보너스',
    bonusDetails: 'Binance Pay 구매가 확인될 때마다 100 Vouchers를 받습니다.',
    notActive: '이 페이지에서는 아직 결제를 진행할 수 없습니다.',
    back: '구매 화면으로 돌아가기',
  },
})

function BinanceMark({ className = 'h-12 w-12' }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="#F3BA2F">
        <polygon points="32,7 51,26 44,33 32,21 20,33 13,26" />
        <polygon points="6,32 14,24 22,32 14,40" />
        <polygon points="42,32 50,24 58,32 50,40" />
        <polygon points="32,24 40,32 32,40 24,32" />
        <polygon points="13,39 20,32 32,44 44,32 51,39 32,58" />
      </g>
    </svg>
  )
}

export default function BinancePayPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()

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

          <button
            type="button"
            onClick={goBack}
            className="mt-5 h-12 w-full rounded-2xl bg-[#111111] text-[14px] font-extrabold text-white transition active:scale-[0.99] dark:bg-white dark:text-[#111111]"
          >
            {t('binancePayPage.back')}
          </button>
        </SurfaceCard>
      </main>
    </PageShell>
  )
}
