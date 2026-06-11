import { useNavigate } from 'react-router-dom'
import PurchaseSection from '../../components/Shop/PurchaseSection'

export default function ShadowMallPurchasePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white pb-24">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white shadow-sm">
        <div className="flex h-14 items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
            aria-label="Go back"
          >
            <i className="fas fa-chevron-left text-[18px] text-gray-700" />
          </button>

          <h1 className="text-[18px] font-extrabold tracking-tight text-neutral-900">
            Shadow Mall
          </h1>
        </div>
      </header>

      <main className="px-4 pt-4">
        <PurchaseSection />
      </main>
    </div>
  )
}
