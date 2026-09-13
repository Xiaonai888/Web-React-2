import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  getShadowMallWishlist,
  removeShadowMallWishlist,
  saveShadowMallWishlist,
} from '../../utils/shadowMallWishlist'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('shadowMallWishlistPage', {
  en: {
    removeItem: 'Remove {{title}}',
    addToCart: 'Add to Cart',
    goBack: 'Go back',
    title: 'My Wishlist',
    savedBooks: 'Saved Books',
    savedBody: 'Books you saved for later.',
    clear: 'Clear',
    noBooks: 'No saved books yet',
    noBooksBody: 'Tap the heart icon on any Shadow Mall book to save it here.',
    backShop: 'Back to Shop',
  },
  km: {
    removeItem: 'ដក {{title}} ចេញ',
    addToCart: 'បន្ថែមទៅកន្ត្រក',
    goBack: 'ត្រឡប់ក្រោយ',
    title: 'បញ្ជីដែលខ្ញុំបានរក្សាទុក',
    savedBooks: 'សៀវភៅដែលបានរក្សាទុក',
    savedBody: 'សៀវភៅដែលអ្នកបានរក្សាទុកសម្រាប់ពេលក្រោយ។',
    clear: 'សម្អាត',
    noBooks: 'មិនទាន់មានសៀវភៅដែលបានរក្សាទុក',
    noBooksBody: 'ចុចរូបបេះដូងលើសៀវភៅណាមួយក្នុង Shadow Mall ដើម្បីរក្សាទុកនៅទីនេះ។',
    backShop: 'ត្រឡប់ទៅហាង',
  },
  zh: {
    removeItem: '移除 {{title}}',
    addToCart: '加入购物车',
    goBack: '返回',
    title: '我的心愿单',
    savedBooks: '已保存书籍',
    savedBody: '你保存以便稍后查看的书籍。',
    clear: '清除',
    noBooks: '还没有保存的书籍',
    noBooksBody: '点击 Shadow Mall 中任意书籍的爱心即可保存到这里。',
    backShop: '返回商店',
  },
  ja: {
    removeItem: '{{title}} を削除',
    addToCart: 'カートに追加',
    goBack: '戻る',
    title: 'マイウィッシュリスト',
    savedBooks: '保存した本',
    savedBody: 'あとで見るために保存した本です。',
    clear: 'クリア',
    noBooks: '保存した本はまだありません',
    noBooksBody: 'Shadow Mall の本にあるハートを押すと、ここに保存できます。',
    backShop: 'ショップに戻る',
  },
  ko: {
    removeItem: '{{title}} 삭제',
    addToCart: '장바구니에 추가',
    goBack: '뒤로 가기',
    title: '내 위시리스트',
    savedBooks: '저장한 도서',
    savedBody: '나중에 보기 위해 저장한 도서입니다.',
    clear: '지우기',
    noBooks: '저장한 도서가 없습니다',
    noBooksBody: 'Shadow Mall 도서의 하트를 눌러 여기에 저장하세요.',
    backShop: '상점으로 돌아가기',
  },
})


const CART_KEY = 'shadow_mall_cart'

function formatUsd(value) {
  const number = normalizePrice(value)
  return new Intl.NumberFormat(getDisplayLanguageId(), {
    style: 'currency',
    currency: 'USD',
  }).format(number)
}

function formatNumber(value) {
  return new Intl.NumberFormat(getDisplayLanguageId()).format(Number(value || 0))
}

function normalizePrice(value) {
  const number = Number(String(value || '').replace(/[^\d.-]/g, ''))
  return Number.isFinite(number) ? number : 0
}

function addToCart(product) {
  const current = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
  const existingIndex = current.findIndex((item) => String(item.id) === String(product.id))

  const cartItem = {
    id: product.id,
    title: product.title,
    author: product.author,
    cover: product.cover,
    price: normalizePrice(product.price),
    oldPrice: normalizePrice(product.oldPrice),
    quantity: 1,
  }

  if (existingIndex >= 0) {
    current[existingIndex] = {
      ...current[existingIndex],
      quantity: Number(current[existingIndex].quantity || 0) + 1,
    }
  } else {
    current.push(cartItem)
  }

  localStorage.setItem(CART_KEY, JSON.stringify(current))
  window.dispatchEvent(new Event('shadow-mall-cart-updated'))
  window.dispatchEvent(new Event('shadow-mall-cart-change'))
}

function WishlistItem({ item, onRemove, onAddToCart, onOpen }) {
  const { t } = useDisplayTranslation()
  const price = normalizePrice(item.price)
  const oldPrice = normalizePrice(item.oldPrice)

  return (
    <article className="rounded-[24px] bg-[var(--shadow-bg-surface)] p-3 shadow-sm ring-1 ring-[var(--shadow-border)]">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onOpen}
          className="h-[116px] w-[78px] shrink-0 overflow-hidden rounded-[16px] bg-[var(--shadow-bg-soft)]"
        >
          {item.cover ? (
            <img
              src={item.cover}
              alt={item.title}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[var(--shadow-text-tertiary)]">
              <i className="fa-solid fa-book-open text-[18px]" />
            </div>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <button type="button" onClick={onOpen} className="min-w-0 text-left">
              <h3 className="line-clamp-2 text-[14px] font-extrabold leading-5 text-[var(--shadow-text-primary)]">
                {item.title}
              </h3>
              <p className="mt-1 line-clamp-1 text-[11.5px] font-semibold text-[var(--shadow-text-secondary)]">
                {item.author}
              </p>
            </button>

            <button
              type="button"
              onClick={onRemove}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d] active:scale-95 dark:bg-red-500/10 dark:text-red-300"
              aria-label={t('shadowMallWishlistPage.removeItem', { title: item.title })}
            >
              <i className="fa-solid fa-trash text-[11px]" />
            </button>
          </div>

          <div className="mt-3 flex items-end justify-between gap-3">
            <button type="button" onClick={onOpen} className="text-left">
              <div className="text-[14px] font-extrabold text-[#e5484d]">{formatUsd(price)}</div>
              {oldPrice ? (
                <div className="mt-0.5 text-[10.5px] font-semibold text-[var(--shadow-text-tertiary)] line-through">
                  {formatUsd(oldPrice)}
                </div>
              ) : null}
            </button>

            <button
              type="button"
              onClick={onAddToCart}
              className="rounded-full bg-[#111827] px-4 py-2 text-[12px] font-extrabold text-white active:scale-95 dark:bg-white dark:text-[#111827]"
            >
              {t('shadowMallWishlistPage.addToCart')}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function ShadowMallWishlistPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const [items, setItems] = useState([])

  useEffect(() => {
    setItems(getShadowMallWishlist())
  }, [])

  function handleRemove(id) {
    const next = removeShadowMallWishlist(id)
    setItems(next)
  }

  function handleAddToCart(item) {
    addToCart(item)
    navigate('/shop/mall/cart', {
  state: { from: location.pathname + location.search + location.hash },
})
  }

  function handleClearAll() {
    saveShadowMallWishlist([])
    setItems([])
  }

  const itemCount = useMemo(() => items.length, [items])

  return (
    <div className="app-page min-h-screen pb-[110px]">
      <header className="sticky top-0 z-50 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            type="button"
            onClick={() => {
  if (location.state?.from) return navigate(-1)
  navigate('/shop', { replace: true })
}}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={t('shadowMallWishlistPage.goBack')}
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallWishlistPage.title')}</h1>

          {itemCount > 0 ? (
            <div className="flex h-10 min-w-10 items-center justify-center rounded-full bg-[#111827] px-3 text-[12px] font-extrabold text-white dark:bg-white dark:text-[#111827]">
              {formatNumber(itemCount)}
            </div>
          ) : (
            <div className="h-10 w-10" />
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        {items.length ? (
          <>
            <section className="mb-4 flex items-center justify-between gap-3 rounded-[22px] bg-[var(--shadow-bg-surface)] px-4 py-3 shadow-sm ring-1 ring-[var(--shadow-border)]">
              <div>
                <div className="text-[14px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallWishlistPage.savedBooks')}</div>
                <div className="mt-1 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
                  {t('shadowMallWishlistPage.savedBody')}
                </div>
              </div>

              <button
                type="button"
                onClick={handleClearAll}
                className="rounded-full bg-[#fff1f1] px-4 py-2 text-[12px] font-extrabold text-[#e5484d] active:scale-95 dark:bg-red-500/10 dark:text-red-300"
              >
                {t('shadowMallWishlistPage.clear')}
              </button>
            </section>

            <section className="space-y-3">
              {items.map((item) => (
                <WishlistItem
                  key={item.id}
                  item={item}
                  onRemove={() => handleRemove(item.id)}
                  onAddToCart={() => handleAddToCart(item)}
                  onOpen={() =>
  navigate(`/shop/mall/product/${item.id}`, {
    state: { from: location.pathname + location.search + location.hash },
  })
}
                />
              ))}
            </section>
          </>
        ) : (
          <section className="rounded-[26px] bg-[var(--shadow-bg-surface)] px-5 py-12 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d] dark:bg-red-500/10 dark:text-red-300">
              <i className="fa-regular fa-heart text-[24px]" />
            </div>
            <h2 className="mt-4 text-[18px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallWishlistPage.noBooks')}</h2>
            <p className="mt-2 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">
              {t('shadowMallWishlistPage.noBooksBody')}
            </p>
            <button
              type="button"
              onClick={() => {
  if (location.state?.from) return navigate(-1)
  navigate('/shop', { replace: true })
}}
              className="mt-5 rounded-full bg-[#111827] px-5 py-3 text-[13px] font-extrabold text-white active:scale-95 dark:bg-white dark:text-[#111827]"
            >
              {t('shadowMallWishlistPage.backShop')}
            </button>
          </section>
        )}
      </main>
    </div>
  )
}
