import { useLocation, useNavigate } from 'react-router-dom'
import PurchaseSection from '../../components/Shop/PurchaseSection'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('shadowMallPurchasePage', {
  en: {
    goBack: 'Go back',
    purchase: 'Purchase',
  },
  km: {
    goBack: 'ត្រឡប់ក្រោយ',
    purchase: 'ការទិញ',
  },
  zh: {
    goBack: '返回',
    purchase: '购买',
  },
  ja: {
    goBack: '戻る',
    purchase: '購入',
  },
  ko: {
    goBack: '뒤로 가기',
    purchase: '구매',
  },
})

export default function ShadowMallPurchasePage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const location = useLocation()
  const returnTo = location.state?.returnTo || '/shop'

  return (
    <div className="app-page min-h-screen pb-24">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] shadow-sm">
        <div className="flex h-14 items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => navigate(returnTo)}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[var(--shadow-bg-hover)]"
            aria-label={t('shadowMallPurchasePage.goBack')}
          >
            <i className="fas fa-chevron-left text-[18px] text-[var(--shadow-text-primary)]" />
          </button>

          <h1 className="text-[18px] font-extrabold tracking-tight text-[var(--shadow-text-primary)]">
            {t('shadowMallPurchasePage.purchase')}
          </h1>
        </div>
      </header>

      <main className="px-4 pt-4">
        <PurchaseSection />
      </main>
    </div>
  )
}
