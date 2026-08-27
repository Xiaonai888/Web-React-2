import { useLocation, useNavigate } from 'react-router-dom'
import PurchaseSection from '../../components/Shop/PurchaseSection'

export default function ShadowMallPurchasePage() {
  const navigate = useNavigate()
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
            aria-label="Go back"
          >
            <i className="fas fa-chevron-left text-[18px] text-[var(--shadow-text-primary)]" />
          </button>

          <h1 className="text-[18px] font-extrabold tracking-tight text-[var(--shadow-text-primary)]">
            Purchase
          </h1>
        </div>
      </header>

      <main className="px-4 pt-4">
        <PurchaseSection />
      </main>
    </div>
  )
}
