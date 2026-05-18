import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PlanSection from '../components/Shop/PlanSection'
import PurchaseSection from '../components/Shop/PurchaseSection'
import ShadowMallSection from '../components/Shop/ShadowMallSection'

const tabs = ['Purchase', 'Plans', 'Shadow Mall']

export default function ShopPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Purchase')

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-24">
      <header className="sticky top-0 z-40 border-b border-[#eeeeee] bg-white">
        <div className="flex h-14 items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full active:bg-[#f1f1f1]"
            aria-label="Go back"
          >
            <i className="fas fa-chevron-left text-[17px] text-[#111]" />
          </button>

          <h1 className="text-[18px] font-extrabold tracking-tight text-[#111]">
            Shop
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-4 pt-4">
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => {
            const isActive = activeTab === tab

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-[13px] font-extrabold transition ${
                  isActive
                    ? 'border-black bg-black text-white'
                    : 'border-[#d8d8d8] bg-white text-[#111] active:bg-[#f1f1f1]'
                }`}
              >
                {tab}
              </button>
            )
          })}
        </div>

        {activeTab === 'Purchase' && <PurchaseSection />}
        {activeTab === 'Plans' && <PlanSection />}
        {activeTab === 'Shadow Mall' && <ShadowMallSection />}
      </main>
    </div>
  )
}
