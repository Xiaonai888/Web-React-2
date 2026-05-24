import React, { useEffect, useState } from 'react'
import { getShadowMallCartCount } from '../utils/shadowMallCart'
import { useNavigate } from 'react-router-dom'
import PlanSection from '../components/Shop/PlanSection'
import PurchaseSection from '../components/Shop/PurchaseSection'
import ShadowMallSection from '../components/Shop/ShadowMallSection'


const tabs = ['Shadow Mall', 'Purchase', 'Plans']

export default function ShopPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Shadow Mall')
  const [mallSearchOpen, setMallSearchOpen] = useState(false)
  const [cartCount, setCartCount] = useState(() => getShadowMallCartCount())

useEffect(() => {
  const refreshCartCount = () => {
    setCartCount(getShadowMallCartCount())
  }

  window.addEventListener('shadow-mall-cart-change', refreshCartCount)
  window.addEventListener('storage', refreshCartCount)
  window.addEventListener('focus', refreshCartCount)

  return () => {
    window.removeEventListener('shadow-mall-cart-change', refreshCartCount)
    window.removeEventListener('storage', refreshCartCount)
    window.removeEventListener('focus', refreshCartCount)
  }
}, [])

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
            Shadow Mall
          </h1>

          <button
            type="button"
            onClick={() => setMallSearchOpen((value) => !value)}
            className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-50 text-[#111827] active:scale-95"
            aria-label="Search books"
          >
            <i className="fa-solid fa-magnifying-glass text-[15px]" />
          </button>

         <button
  type="button"
  onClick={() => navigate('/shop/mall/cart')}
  className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-transparent text-[#111827] active:scale-95"
  aria-label="Open cart"
>
  <i className="fa-solid fa-cart-shopping text-[20px]" />
  {cartCount > 0 ? (
    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f6b800] px-1 text-[10px] font-extrabold text-[#111827]">
      {cartCount}
    </span>
  ) : null}
</button>
        </div>
      </header>

      <main className="px-4 pt-4">
        {activeTab !== 'Shadow Mall' ? (
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
        ) : null}

        {activeTab === 'Plans' && <PlanSection />}
        {activeTab === 'Purchase' && <PurchaseSection />}
        {activeTab === 'Shadow Mall' && (
          <ShadowMallSection
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            showSearch={mallSearchOpen}
          />
        )}
      </main>
    </div>
  )
}
