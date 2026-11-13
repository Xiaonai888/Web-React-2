import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PromotionBookShelf from '../PromotionBookShelf'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('storeShelfCheckout', {
  en: {
    conflict: 'Your cart contains products from another author. Replace them with this product?',
    failed: 'Could not open your cart. Please try again.',
    cancel: 'Cancel', replace: 'Replace and Continue', title: 'Book & PDF Promotion',
  },
  km: {
    conflict: 'កន្ត្រកមានទំនិញពីអ្នកនិពន្ធផ្សេង។ តើអ្នកចង់ជំនួសដោយទំនិញនេះឬទេ?',
    failed: 'មិនអាចបើកកន្ត្រកបានទេ។ សូមសាកល្បងម្តងទៀត។',
    cancel: 'បោះបង់', replace: 'ជំនួស ហើយបន្ត', title: 'ប្រូម៉ូសិនសៀវភៅ និង PDF',
  },
  zh: {
    conflict: '购物车中有其他作者的商品。是否替换为此商品？',
    failed: '无法打开购物车，请重试。',
    cancel: '取消', replace: '替换并继续', title: '图书与 PDF 优惠',
  },
  ja: {
    conflict: 'カートに別の著者の商品があります。この商品に置き換えますか？',
    failed: 'カートを開けませんでした。もう一度お試しください。',
    cancel: 'キャンセル', replace: '置き換えて続行', title: '書籍・PDF セール',
  },
  ko: {
    conflict: '장바구니에 다른 작가의 상품이 있습니다. 이 상품으로 교체하시겠습니까?',
    failed: '장바구니를 열 수 없습니다. 다시 시도해 주세요.',
    cancel: '취소', replace: '교체하고 계속', title: '도서 및 PDF 프로모션',
  },
})

const CART_KEY = 'shadow_author_cart_items'

function readCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function StorePromotionShelf({ rotation, remainingSeconds = 0 }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const [conflict, setConflict] = useState(null)
  const [error, setError] = useState('')

  function saveToCart(product, replace = false) {
    if (!rotation || remainingSeconds <= 0) return
    try {
      const current = replace ? [] : readCart()
      const productId = String(product.product_id)
      const item = {
        id: productId,
        title: product.title,
        type: product.product_type === 'pdf' ? 'PDF' : 'Book',
        cover_url: product.cover_url || '',
        price_value: Number(product.promotion_price_usd),
        quantity: 1,
        author_page_id: String(product.author_page_id),
        author_page_name: product.page_name || product.author_name || '',
        author_page_username: product.page_username,
        discover_promotion_rotation_key: rotation.rotationKey,
        discover_promotion_expires_at: rotation.expires_at,
        promotion_entry_source: location.pathname === '/manga' ? 'manga' : 'stories',
      }
      const existing = current.find((entry) => String(entry.id) === productId)
      const next = existing
        ? current.map((entry) => {
          if (String(entry.id) !== productId) return entry
          const max = product.product_type === 'book' ? Number(product.stock_quantity || 1) : 99
          return { ...item, quantity: Math.min(Number(entry.quantity || 1) + 1, max) }
        })
        : [...current, item]
      localStorage.setItem(CART_KEY, JSON.stringify(next))
      window.dispatchEvent(new Event('shadow-author-cart-updated'))
      setConflict(null)
      setError('')
      navigate('/author/cart', { state: { from: location.pathname + location.search + location.hash } })
    } catch {
      setError(t('storeShelfCheckout.failed'))
    }
  }

  function buy(product) {
    if (!product || remainingSeconds <= 0) return
    const otherAuthor = readCart().some((entry) => {
      const pageId = String(entry.author_page_id || '').trim()
      const username = String(entry.author_page_username || '').trim()
      return pageId
        ? pageId !== String(product.author_page_id)
        : !username || username !== String(product.page_username)
    })
    if (otherAuthor) {
      setConflict(product)
      return
    }
    saveToCart(product)
  }

  return (
    <>
      <PromotionBookShelf
        kind="store"
        offers={rotation?.promotions || []}
        remainingSeconds={remainingSeconds}
        onBuy={buy}
      />
      {error ? <p className="mx-3 mt-2 text-[12px] font-semibold text-red-600 dark:text-red-300" role="alert">{error}</p> : null}
      {conflict ? (
        <div className="fixed inset-0 z-[1000000] flex items-end justify-center bg-black/50 p-3 sm:items-center" role="dialog" aria-modal="true" aria-label={t('storeShelfCheckout.title')}>
          <div className="w-full max-w-[410px] rounded-2xl bg-white p-5 text-[#25142f] shadow-xl dark:bg-[#241d2b] dark:text-white">
            <p className="text-[14px] font-bold leading-relaxed">{t('storeShelfCheckout.conflict')}</p>
            <div className="mt-5 flex gap-2">
              <button type="button" onClick={() => setConflict(null)} className="flex-1 rounded-full border border-gray-300 px-3 py-3 text-[12px] font-bold dark:border-white/20">{t('storeShelfCheckout.cancel')}</button>
              <button type="button" onClick={() => saveToCart(conflict, true)} className="flex-[1.5] rounded-full border border-[#d6a343] bg-[#101010] px-3 py-3 text-[12px] font-bold text-white">{t('storeShelfCheckout.replace')}</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
