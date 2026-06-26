import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getShadowMallCartCount } from '../utils/shadowMallCart'
import { getShadowMallWishlistCount } from '../utils/shadowMallWishlist'
import PlanSection from '../components/Shop/PlanSection'
import PurchaseSection from '../components/Shop/PurchaseSection'
import ShadowMallSection from '../components/Shop/ShadowMallSection'

const tabs = ['Shadow Mall', 'Plans']

export default function ShopPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'Shadow Mall')
  const purchaseReturnTo = location.state?.returnTo || location.state?.from || ''
  const isPurchaseMode = activeTab === 'Purchase'
  const [mallSearchOpen, setMallSearchOpen] = useState(false)
  const [cartCount, setCartCount] = useState(() => getShadowMallCartCount())
  const [wishlistCount, setWishlistCount] = useState(() => getShadowMallWishlistCount())

  useEffect(() => {
  if (location.state?.activeTab) {
    setActiveTab(location.state.activeTab)
  }
}, [location.state])

  useEffect(() => {
    const refreshCartCount = () => {
      setCartCount(getShadowMallCartCount())
    }

    const refreshWishlistCount = () => {
      setWishlistCount(getShadowMallWishlistCount())
    }

    window.addEventListener('shadow-mall-cart-change', refreshCartCount)
    window.addEventListener('shadow-mall-wishlist-change', refreshWishlistCount)
    window.addEventListener('storage', refreshCartCount)
    window.addEventListener('storage', refreshWishlistCount)
    window.addEventListener('focus', refreshCartCount)
    window.addEventListener('focus', refreshWishlistCount)

    return () => {
      window.removeEventListener('shadow-mall-cart-change', refreshCartCount)
      window.removeEventListener('shadow-mall-wishlist-change', refreshWishlistCount)
      window.removeEventListener('storage', refreshCartCount)
      window.removeEventListener('storage', refreshWishlistCount)
      window.removeEventListener('focus', refreshCartCount)
      window.removeEventListener('focus', refreshWishlistCount)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white pb-24">
<header className="sticky top-0 z-40 border-b border-gray-100 bg-white shadow-sm">
  <div className="flex h-14 items-center gap-3 px-4">
    <button
      type="button"
      onClick={() => {
  if (isPurchaseMode && purchaseReturnTo) {
    navigate(purchaseReturnTo, { replace: true })
    return
  }

  if (activeTab !== 'Shadow Mall') {
    setActiveTab('Shadow Mall')
    return
  }

  navigate('/')
}}
      className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
      aria-label="Go back"
    >
      <i className="fas fa-chevron-left text-[18px] text-gray-700" />
    </button>

    <h1 className="text-[18px] font-extrabold tracking-tight text-neutral-900">
      {isPurchaseMode ? 'Purchase' : 'Shadow Mall'}
    </h1>

    {!isPurchaseMode ? (
      <>
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
          onClick={() => navigate('/shop/mall/wishlist')}
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-transparent text-[#111827] active:scale-95"
          aria-label="Open wishlist"
        >
          <i className="fa-regular fa-heart text-[20px]" />
          {wishlistCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f6b800] px-1 text-[10px] font-extrabold text-[#111827]">
              {wishlistCount}
            </span>
          ) : null}
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
      </>
    ) : null}
  </div>
</header>

      <main className="px-4 pt-4">
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
