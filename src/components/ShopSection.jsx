import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PlanSection from '../components/Shop/PlanSection'
import PurchaseSection from '../components/Shop/PurchaseSection'
import ShadowMallSection from '../components/Shop/ShadowMallSection'

const tabs = ['Plans', 'Purchase', 'Shadow Mall']

export default function ShopPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Plans')

  return (
    <div className="min-h-screen bg-white pb-24">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white shadow-sm">
        <div className="flex h-14 items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <i className="fas fa-chevron-left text-[18px] text-gray-700" />
          </button>

          <h1 className="text-[18px] font-extrabold tracking-tight text-neutral-900">
            Shop
          </h1>
        </div>
      </header>

      <main className="px-4 pt-4">
        <div className="mb-6 flex gap-3 overflow-x-auto pb-1 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => {
            const isActive = activeTab === tab

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'border-black bg-black text-white'
                    : 'border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50'
                }`}
              >
                {tab}
              </button>
            )
          })}
        </div>

        {activeTab === 'Plans' && <PlanSection />}
        {activeTab === 'Purchase' && <PurchaseSection />}
        {activeTab === 'Shadow Mall' && <ShadowMallSection />}
      </main>
    </div>
  )
}
