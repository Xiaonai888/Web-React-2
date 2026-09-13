import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('readerMallCart', {
  en: {
    cart: 'Cart',
    shadowMall: 'Shadow Mall',
    authorStore: 'Author Store',
    shadowHelp: 'Open your existing Shadow Mall cart.',
    authorHelp: 'Open your existing Author Store cart.',
    openCart: 'Open Cart',
    items: '{{count}} items',
    goBack: 'Go back',
  },
  km: {
    cart: 'កន្ត្រក',
    shadowMall: 'Shadow Mall',
    authorStore: 'ហាងអ្នកនិពន្ធ',
    shadowHelp: 'បើកកន្ត្រក Shadow Mall ដែលមានស្រាប់។',
    authorHelp: 'បើកកន្ត្រកហាងអ្នកនិពន្ធដែលមានស្រាប់។',
    openCart: 'បើកកន្ត្រក',
    items: '{{count}} ទំនិញ',
    goBack: 'ត្រឡប់ក្រោយ',
  },
  zh: {
    cart: '购物车',
    shadowMall: 'Shadow Mall',
    authorStore: '作者商店',
    shadowHelp: '打开现有的 Shadow Mall 购物车。',
    authorHelp: '打开现有的作者商店购物车。',
    openCart: '打开购物车',
    items: '{{count}} 件商品',
    goBack: '返回',
  },
  ja: {
    cart: 'カート',
    shadowMall: 'Shadow Mall',
    authorStore: '作家ストア',
    shadowHelp: '既存の Shadow Mall カートを開きます。',
    authorHelp: '既存の作家ストアカートを開きます。',
    openCart: 'カートを開く',
    items: '{{count}} 点',
    goBack: '戻る',
  },
  ko: {
    cart: '장바구니',
    shadowMall: 'Shadow Mall',
    authorStore: '작가 스토어',
    shadowHelp: '기존 Shadow Mall 장바구니를 엽니다.',
    authorHelp: '기존 작가 스토어 장바구니를 엽니다.',
    openCart: '장바구니 열기',
    items: '{{count}}개',
    goBack: '뒤로',
  },
})

function readCount(key) {
  try {
    const items = JSON.parse(localStorage.getItem(key) || '[]')
    if (!Array.isArray(items)) return 0
    return items.reduce((sum, item) => sum + Math.max(1, Number(item.quantity || 1)), 0)
  } catch {
    return 0
  }
}

export default function ReaderMallCartPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const [active, setActive] = useState('shadow')
  const [counts, setCounts] = useState(() => ({
    shadow: readCount('shadow_mall_cart'),
    author: readCount('shadow_author_cart_items'),
  }))

  useEffect(() => {
    const refresh = () =>
      setCounts({
        shadow: readCount('shadow_mall_cart'),
        author: readCount('shadow_author_cart_items'),
      })

    window.addEventListener('shadow-mall-cart-change', refresh)
    window.addEventListener('shadow-author-cart-updated', refresh)
    window.addEventListener('storage', refresh)
    window.addEventListener('focus', refresh)

    return () => {
      window.removeEventListener('shadow-mall-cart-change', refresh)
      window.removeEventListener('shadow-author-cart-updated', refresh)
      window.removeEventListener('storage', refresh)
      window.removeEventListener('focus', refresh)
    }
  }, [])

  const isShadow = active === 'shadow'
  const title = isShadow ? t('readerMallCart.shadowMall') : t('readerMallCart.authorStore')
  const help = isShadow ? t('readerMallCart.shadowHelp') : t('readerMallCart.authorHelp')
  const count = isShadow ? counts.shadow : counts.author
  const path = isShadow ? '/shop/mall/cart' : '/author/cart'

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
        <div className="mx-auto flex h-14 max-w-[560px] items-center px-3">
          <button
            type="button"
            onClick={() => {
  if (location.state?.from) return navigate(-1)
  navigate('/store', { replace: true })
}}
            aria-label={t('readerMallCart.goBack')}
            className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]"
          >
            <i className="fa-solid fa-chevron-left text-[16px]" />
          </button>
          <h1 className="px-2 text-[19px] font-extrabold">{t('readerMallCart.cart')}</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[560px] px-4 py-4">
        <div className="flex gap-2 rounded-[18px] bg-[var(--shadow-bg-surface)] p-1.5 ring-1 ring-[var(--shadow-border)]">
          <button
            type="button"
            onClick={() => setActive('shadow')}
            className={`flex-1 rounded-[14px] px-3 py-2.5 text-[12px] font-black ${
              isShadow
                ? 'bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)]'
                : 'text-[var(--shadow-text-secondary)]'
            }`}
          >
            {t('readerMallCart.shadowMall')} ({counts.shadow})
          </button>
          <button
            type="button"
            onClick={() => setActive('author')}
            className={`flex-1 rounded-[14px] px-3 py-2.5 text-[12px] font-black ${
              !isShadow
                ? 'bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)]'
                : 'text-[var(--shadow-text-secondary)]'
            }`}
          >
            {t('readerMallCart.authorStore')} ({counts.author})
          </button>
        </div>

        <section className="mt-3 rounded-[24px] bg-[var(--shadow-bg-surface)] p-5 shadow-sm ring-1 ring-[var(--shadow-border)]">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)]">
              <i className={`fa-solid ${isShadow ? 'fa-store' : 'fa-pen-nib'} text-[16px]`} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-[15px] font-black">{title}</h2>
              <p className="mt-1 text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">{help}</p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-[var(--shadow-border)] pt-4">
            <span className="text-[12px] font-bold text-[var(--shadow-text-secondary)]">
              {t('readerMallCart.items', { count })}
            </span>
            <button
              type="button"
              onClick={() =>
  navigate(path, {
    state: { from: location.pathname + location.search + location.hash },
  })
}
              className="h-10 rounded-full bg-[var(--shadow-text-primary)] px-5 text-[12px] font-black text-[var(--shadow-bg-surface)] active:scale-95"
            >
              {t('readerMallCart.openCart')}
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
