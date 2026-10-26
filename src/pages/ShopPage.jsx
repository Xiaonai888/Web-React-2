import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getShadowMallCartCount } from '../utils/shadowMallCart'
import { getShadowMallWishlistCount } from '../utils/shadowMallWishlist'
import { getCountryFeature, isCountryPolicyEnabled, loadCountrySettings } from '../utils/countrySettings'
import PlanSection from '../components/Shop/PlanSection'
import PurchaseSection from '../components/Shop/PurchaseSection'
import ShadowMallSection from '../components/Shop/ShadowMallSection'
import { getDisplayLanguageId, useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('shopPage', {
  en: {
    goBack: 'Go back',
    purchase: 'Purchase',
    searchBooks: 'Search books',
    openWishlist: 'Open wishlist',
    openCart: 'Open cart',
  },
  km: {
    goBack: 'ត្រឡប់ក្រោយ',
    purchase: 'ទិញ',
    searchBooks: 'ស្វែងរកសៀវភៅ',
    openWishlist: 'បើកបញ្ជីចង់បាន',
    openCart: 'បើកកន្ត្រក',
  },
  zh: {
    goBack: '返回',
    purchase: '购买',
    searchBooks: '搜索书籍',
    openWishlist: '打开愿望清单',
    openCart: '打开购物车',
  },
  ja: {
    goBack: '戻る',
    purchase: '購入',
    searchBooks: '本を検索',
    openWishlist: 'ほしい物リストを開く',
    openCart: 'カートを開く',
  },
  ko: {
    goBack: '뒤로 가기',
    purchase: '구매',
    searchBooks: '도서 검색',
    openWishlist: '위시리스트 열기',
    openCart: '장바구니 열기',
  },
})

const DISPLAY_LOCALES = {
  km: 'km-KH',
  en: 'en-US',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
}

function formatDisplayNumber(value) {
  const number = Number(value || 0)
  const locale = DISPLAY_LOCALES[getDisplayLanguageId()] || DISPLAY_LOCALES.en
  return new Intl.NumberFormat(locale).format(Number.isFinite(number) ? number : 0)
}

const tabs = ['Shadow Mall', 'Plans']

export default function ShopPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'Shadow Mall')
  const [mallAccess, setMallAccess] = useState({ ready: false, enabled: false, allowed: true, local: true })
  const purchaseReturnTo = location.state?.returnTo || location.state?.from || ''
  const [mallSearchOpen, setMallSearchOpen] = useState(false)
  const [cartCount, setCartCount] = useState(() => getShadowMallCartCount())
  const [wishlistCount, setWishlistCount] = useState(() => getShadowMallWishlistCount())

  useEffect(() => {
    let active = true
    loadCountrySettings().then(settings => {
      if (!active) return
      const enabled = isCountryPolicyEnabled(settings)
      setMallAccess({
        ready: true,
        enabled,
        allowed: !enabled || (
          settings.countryVerified === true &&
          getCountryFeature(settings, 'shadowMall', false) === true
        ),
        local: !enabled || settings.country === 'KH',
      })
    }).catch(() => {
      if (active) setMallAccess({ ready: true, enabled: false, allowed: true, local: true })
    })
    return () => { active = false }
  }, [location.key])

  useEffect(() => {
    if (!mallAccess.ready) return
    const requestedTab = location.state?.activeTab
    if (requestedTab === 'Purchase' || requestedTab === 'Plans') {
      setActiveTab(requestedTab)
    } else if (requestedTab === 'Shadow Mall' && mallAccess.allowed) {
      setActiveTab('Shadow Mall')
    } else {
      setActiveTab(mallAccess.enabled && (!mallAccess.allowed || !mallAccess.local) ? 'Purchase' : 'Shadow Mall')
    }
  }, [mallAccess, location.key])

  const showMall = mallAccess.allowed && activeTab === 'Shadow Mall'
  const purchaseMode = activeTab === 'Purchase' || (activeTab === 'Shadow Mall' && !mallAccess.allowed)
  const setAvailableTab = (next) => setActiveTab(next === 'Shadow Mall' && !mallAccess.allowed ? 'Purchase' : next)

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

  if (!mallAccess.ready) {
    return <div role="status" className="flex min-h-screen items-center justify-center bg-[var(--shadow-bg-page)] text-[var(--shadow-text-primary)]">Loading…</div>
  }

  return (
    <div className="app-page min-h-screen pb-24">
      <header
        className={`sticky top-0 z-40 ${
          purchaseMode
            ? 'bg-[#FFE66A] text-[#111827]'
            : 'border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] text-[var(--shadow-text-primary)]'
        }`}
      >
        <div className="flex h-14 items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => {
              if (purchaseMode && purchaseReturnTo && !purchaseReturnTo.startsWith('/shop')) {
                navigate(purchaseReturnTo, { replace: true })
                return
              }

              if (purchaseMode && mallAccess.enabled && (!mallAccess.local || !mallAccess.allowed)) {
                navigate('/', { replace: true })
                return
              }

              if (activeTab !== 'Shadow Mall') {
                setAvailableTab('Shadow Mall')
                return
              }

              navigate(location.state?.returnTo || '/')
            }}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              purchaseMode
                ? 'hover:bg-black/5'
                : 'hover:bg-[var(--shadow-bg-hover)]'
            }`}
            aria-label={t('shopPage.goBack')}
          >
            <i
              className={`fas fa-chevron-left text-[18px] ${
                purchaseMode
                  ? 'text-[#374151]'
                  : 'text-[var(--shadow-text-primary)]'
              }`}
            />
          </button>

          <h1
            className={`text-[18px] font-extrabold tracking-tight ${
              purchaseMode
                ? 'text-[#111827]'
                : 'text-[var(--shadow-text-primary)]'
            }`}
          >
            {purchaseMode ? t('shopPage.purchase') : 'Shadow Mall'}
          </h1>

          {!purchaseMode ? (
            <>
              <button
                type="button"
                onClick={() => setMallSearchOpen((value) => !value)}
                className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] transition active:scale-95 active:bg-[var(--shadow-bg-hover)]"
                aria-label={t('shopPage.searchBooks')}
              >
                <i className="fa-solid fa-magnifying-glass text-[15px]" />
              </button>

              <button
                type="button"
                onClick={() =>
  navigate('/shop/mall/wishlist', {
    state: { from: location.pathname + location.search + location.hash },
  })
}
                className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-transparent text-[var(--shadow-text-primary)] transition active:scale-95 active:bg-[var(--shadow-bg-hover)]"
                aria-label={t('shopPage.openWishlist')}
              >
                <i className="fa-regular fa-heart text-[20px]" />
                {wishlistCount > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f6b800] px-1 text-[10px] font-extrabold text-[#111827]">
                    {formatDisplayNumber(wishlistCount)}
                  </span>
                ) : null}
              </button>

              <button
                type="button"
                onClick={() =>
  navigate('/shop/mall/cart', {
    state: { from: location.pathname + location.search + location.hash },
  })
}
                className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-transparent text-[var(--shadow-text-primary)] transition active:scale-95 active:bg-[var(--shadow-bg-hover)]"
                aria-label={t('shopPage.openCart')}
              >
                <i className="fa-solid fa-cart-shopping text-[20px]" />
                {cartCount > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f6b800] px-1 text-[10px] font-extrabold text-[#111827]">
                    {formatDisplayNumber(cartCount)}
                  </span>
                ) : null}
              </button>
            </>
          ) : null}
        </div>
      </header>

      <main
        className={`px-4 pt-4 ${
          purchaseMode
            ? 'bg-[#FFE66A]'
            : 'bg-[var(--shadow-bg-page)]'
        }`}
      >
        {activeTab === 'Plans' && <PlanSection />}
        {purchaseMode && <PurchaseSection />}
        {showMall && (
          <ShadowMallSection
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setAvailableTab}
            showSearch={mallSearchOpen}
          />
        )}
      </main>
    </div>
  )
}
