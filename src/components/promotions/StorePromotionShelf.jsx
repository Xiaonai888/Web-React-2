import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PromotionBookShelf from '../PromotionBookShelf'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import {
  fetchAuthorStorePdfOwnership,
  hasAuthorStoreReaderSession,
  recheckAuthorStorePdfPayment,
} from '../../services/authorStorePdfOwnershipApi'

registerTranslationNamespace('storeShelfCheckout', {
  en: {
    conflict: 'Your cart contains products from another author. Replace them with this product?',
    failed: 'Could not open your cart. Please try again.',
    cancel: 'Cancel', replace: 'Replace and Continue', title: 'Book & PDF Promotion',
    checking: 'Checking your previous PDF payment. Do not pay again.',
    unavailable: 'PDF purchase status is unavailable. Please try again later; no new payment was started.',
  },
  km: {
    conflict: 'កន្ត្រកមានទំនិញពីអ្នកនិពន្ធផ្សេង។ តើអ្នកចង់ជំនួសដោយទំនិញនេះឬទេ?',
    failed: 'មិនអាចបើកកន្ត្រកបានទេ។ សូមសាកល្បងម្តងទៀត។',
    cancel: 'បោះបង់', replace: 'ជំនួស ហើយបន្ត', title: 'ប្រូម៉ូសិនសៀវភៅ និង PDF',
    checking: 'កំពុងពិនិត្យការទូទាត់ PDF ចាស់។ សូមកុំទូទាត់ម្តងទៀត។',
    unavailable: 'មិនអាចពិនិត្យសិទ្ធិទិញ PDF បានទេ។ សូមសាកល្បងពេលក្រោយ មិនមានការបង្កើត Payment ថ្មីទេ។',
  },
  zh: {
    conflict: '购物车中有其他作者的商品。是否替换为此商品？',
    failed: '无法打开购物车，请重试。',
    cancel: '取消', replace: '替换并继续', title: '图书与 PDF 优惠',
    checking: '正在核实之前的 PDF 付款，请勿重复支付。',
    unavailable: '暂时无法核实 PDF 购买状态，请稍后重试。未创建新付款。',
  },
  ja: {
    conflict: 'カートに別の著者の商品があります。この商品に置き換えますか？',
    failed: 'カートを開けませんでした。もう一度お試しください。',
    cancel: 'キャンセル', replace: '置き換えて続行', title: '書籍・PDF セール',
    checking: '以前の PDF の支払いを確認中です。再度支払わないでください。',
    unavailable: 'PDF の購入状況を確認できません。後ほどお試しください。新しい決済は作成していません。',
  },
  ko: {
    conflict: '장바구니에 다른 작가의 상품이 있습니다. 이 상품으로 교체하시겠습니까?',
    failed: '장바구니를 열 수 없습니다. 다시 시도해 주세요.',
    cancel: '취소', replace: '교체하고 계속', title: '도서 및 PDF 프로모션',
    checking: '기존 PDF 결제를 확인 중입니다. 다시 결제하지 마세요.',
    unavailable: 'PDF 구매 상태를 확인할 수 없습니다. 나중에 다시 시도하세요. 새 결제는 생성되지 않았습니다.',
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
  const [ownership, setOwnership] = useState({ status: 'loading', states: {} })
  const [busyId, setBusyId] = useState('')
  const actionRef = useRef(false)
  const pdfIdsKey = [...new Set((rotation?.promotions || [])
    .filter((offer) => offer?.product_type === 'pdf')
    .map((offer) => String(offer.product_id || '').trim()).filter(Boolean))]
    .sort().join(',')

  useEffect(() => {
    let active = true
    const controller = new AbortController()
    let lastRefreshAt = 0

    async function refresh(force = false) {
      if (!active || (document.visibilityState === 'hidden' && !force)) return
      if (!force && Date.now() - lastRefreshAt < 10000) return
      lastRefreshAt = Date.now()
      if (!pdfIdsKey || !hasAuthorStoreReaderSession()) {
        setOwnership({ status: 'ready', states: {} })
        return
      }
      try {
        const result = await fetchAuthorStorePdfOwnership(pdfIdsKey.split(','), { signal: controller.signal })
        if (!active) return
        const states = Object.fromEntries((result.products || [])
          .filter((row) => row?.product_type === 'pdf')
          .map((row) => [String(row.product_id), row]))
        setOwnership({ status: 'ready', states })
      } catch {
        if (active && !controller.signal.aborted) {
          setOwnership({ status: 'unavailable', states: {} })
        }
      }
    }

    setOwnership({ status: 'loading', states: {} })
    void refresh(true)
    const onVisible = () => { if (document.visibilityState === 'visible') void refresh() }
    const onFocus = () => { void refresh() }
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', onFocus)
    window.addEventListener('pageshow', onFocus)
    return () => {
      active = false
      controller.abort()
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('pageshow', onFocus)
    }
  }, [pdfIdsKey])

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
        ...(product.product_type === 'pdf' && product.story_language === 'km' ? { discover_promotion_story_language: 'km' } : {}),
        promotion_entry_source: location.pathname === '/manga' ? 'manga' : 'stories',
      }
      const existing = current.find((entry) => String(entry.id) === productId)
      const next = existing
        ? current.map((entry) => {
          if (String(entry.id) !== productId) return entry
          const max = product.product_type === 'book' ? Number(product.stock_quantity || 1) : 1
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

  function readPdf(product) {
    setConflict(null)
    setError('')
    const productId = String(product.product_id)
    const existing = readCart()
    const remaining = existing.filter((entry) => String(entry.id) !== productId)
    if (remaining.length !== existing.length) {
      localStorage.setItem(CART_KEY, JSON.stringify(remaining))
      window.dispatchEvent(new Event('shadow-author-cart-updated'))
    }
    navigate(`/discover/pdf/${encodeURIComponent(productId)}`, {
      state: { title: product.title, from: location.pathname + location.search + location.hash },
    })
  }

  async function handleProductAction(product, replace = false) {
    if (!product || remainingSeconds <= 0 || actionRef.current) return
    actionRef.current = true
    setBusyId(String(product.product_id))
    setError('')
    try {
      if (product.product_type === 'pdf' && hasAuthorStoreReaderSession()) {
        const result = await fetchAuthorStorePdfOwnership([product.product_id])
        const current = result.products.find((entry) => String(entry.product_id) === String(product.product_id))
        if (!current || current.product_type !== 'pdf') {
          setError(t('storeShelfCheckout.unavailable'))
          return
        }
        setOwnership((previous) => ({
          status: 'ready',
          states: { ...previous.states, [String(product.product_id)]: current },
        }))
        if (current.state === 'purchased') {
          readPdf(product)
          return
        }
        if (current.state !== 'available') {
          if (current.order_id) {
            try {
              const recovered = await recheckAuthorStorePdfPayment(current.order_id)
              if (recovered.state === 'purchased') {
                const confirmed = await fetchAuthorStorePdfOwnership([product.product_id])
                const owned = confirmed.products.find((entry) => String(entry.product_id) === String(product.product_id))
                if (owned?.state === 'purchased') {
                  setOwnership((previous) => ({
                    status: 'ready',
                    states: { ...previous.states, [String(product.product_id)]: owned },
                  }))
                  readPdf(product)
                  return
                }
              }
            } catch {
              setError(t('storeShelfCheckout.checking'))
              return
            }
          }
          setError(t('storeShelfCheckout.checking'))
          return
        }
      }
      const otherAuthor = !replace && readCart().some((entry) => {
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
      saveToCart(product, replace)
    } catch {
      setError(t('storeShelfCheckout.unavailable'))
    } finally {
      actionRef.current = false
      setBusyId('')
    }
  }

  const getPurchaseState = (offer) => {
    if (offer.product_type !== 'pdf' || !hasAuthorStoreReaderSession()) return 'available'
    if (ownership.status !== 'ready') return 'checking_payment'
    return ownership.states[String(offer.product_id)]?.state || 'checking_payment'
  }

  return (
    <>
      <PromotionBookShelf
        kind="store"
        offers={rotation?.promotions || []}
        remainingSeconds={remainingSeconds}
        onBuy={(product) => { void handleProductAction(product) }}
        onRead={(product) => { void handleProductAction(product) }}
        getPurchaseState={getPurchaseState}
      />
      {busyId ? <p role="status" className="mx-3 mt-2 text-[12px] text-[var(--shadow-text-secondary)]">{t('storeShelfCheckout.checking')}</p> : null}
      {error ? <p className="mx-3 mt-2 text-[12px] font-semibold text-red-600 dark:text-red-300" role="alert">{error}</p> : null}
      {conflict ? (
        <div className="fixed inset-0 z-[1000000] flex items-end justify-center bg-black/50 p-3 sm:items-center" role="dialog" aria-modal="true" aria-label={t('storeShelfCheckout.title')}>
          <div className="w-full max-w-[410px] rounded-2xl bg-white p-5 text-[#25142f] shadow-xl dark:bg-[#241d2b] dark:text-white">
            <p className="text-[14px] font-bold leading-relaxed">{t('storeShelfCheckout.conflict')}</p>
            <div className="mt-5 flex gap-2">
              <button type="button" onClick={() => setConflict(null)} className="flex-1 rounded-full border border-gray-300 px-3 py-3 text-[12px] font-bold dark:border-white/20">{t('storeShelfCheckout.cancel')}</button>
              <button type="button" onClick={() => { void handleProductAction(conflict, true) }} className="flex-[1.5] rounded-full border border-[#d6a343] bg-[#101010] px-3 py-3 text-[12px] font-bold text-white">{t('storeShelfCheckout.replace')}</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
