import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Clock3, ShoppingCart } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('discoverAuthorStorePromotion', {
  en: {
    heading: 'Book & PDF Promotion',
    book: 'Book',
    pdf: 'PDF',
    buy: 'Buy Now',
    endsIn: 'Ends in',
    slide: 'View product {{count}}',
    cartConflict: 'Your cart contains books from another author. Replace those items with this product?',
    cartFailed: 'Could not open your cart. Please try again.',
    cancel: 'Cancel',
    replace: 'Replace and Continue',
    cover: 'No cover',
    stock: '{{count}} in stock',
  },
  km: {
    heading: 'ប្រូម៉ូសិនសៀវភៅ និង PDF',
    book: 'សៀវភៅ',
    pdf: 'PDF',
    buy: 'ទិញឥឡូវនេះ',
    endsIn: 'បញ្ចប់ក្នុង',
    slide: 'មើលផលិតផលទី {{count}}',
    cartConflict: 'ក្នុងកន្ត្រកមានទំនិញពីអ្នកនិពន្ធផ្សេង។ តើចង់ជំនួសទំនិញទាំងនោះដោយផលិតផលនេះឬទេ?',
    cartFailed: 'មិនអាចបើកកន្ត្រកបានទេ។ សូមសាកល្បងម្ដងទៀត។',
    cancel: 'បោះបង់',
    replace: 'ជំនួស ហើយបន្ត',
    cover: 'គ្មានក្រប',
    stock: 'នៅស្តុក {{count}}',
  },
  zh: {
    heading: '图书与 PDF 优惠',
    book: '图书',
    pdf: 'PDF',
    buy: '立即购买',
    endsIn: '剩余时间',
    slide: '查看第 {{count}} 个商品',
    cartConflict: '购物车中有其他作者的商品。要替换为此商品吗？',
    cartFailed: '无法打开购物车，请重试。',
    cancel: '取消',
    replace: '替换并继续',
    cover: '暂无封面',
    stock: '库存 {{count}}',
  },
  ja: {
    heading: '書籍・PDF プロモーション',
    book: '書籍',
    pdf: 'PDF',
    buy: '今すぐ購入',
    endsIn: '終了まで',
    slide: '商品 {{count}} を表示',
    cartConflict: 'カートに別の著者の商品があります。この商品に置き換えますか？',
    cartFailed: 'カートを開けませんでした。もう一度お試しください。',
    cancel: 'キャンセル',
    replace: '置き換えて続行',
    cover: '表紙なし',
    stock: '在庫 {{count}}',
  },
  ko: {
    heading: '도서 및 PDF 프로모션',
    book: '도서',
    pdf: 'PDF',
    buy: '지금 구매',
    endsIn: '종료까지',
    slide: '{{count}}번 상품 보기',
    cartConflict: '장바구니에 다른 작가의 상품이 있습니다. 이 상품으로 교체하시겠습니까?',
    cartFailed: '장바구니를 열 수 없습니다. 다시 시도해 주세요.',
    cancel: '취소',
    replace: '교체하고 계속',
    cover: '표지 없음',
    stock: '재고 {{count}}',
  },
})

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://shadow-backend-kucw.onrender.com'
const CACHE_KEY = 'shadow_discover_author_store_rotation_v1'
const SLIDE_KEY = 'shadow_discover_author_store_slide_v1'
const CART_KEY = 'shadow_author_cart_items'
const RETRY_MS = 30000
let cachedRotation = null
let pendingLoad = null
let retryAfter = 0

const visualStyles = `
  @keyframes dasp-gold-spin { to { transform: rotate(360deg); } }
  .dasp-gold-frame, .dasp-buy-frame { position: relative; isolation: isolate; padding: 2.5px; overflow: hidden; background: #ba872f; }
  .dasp-gold-frame::before, .dasp-buy-frame::before { content: ''; position: absolute; z-index: 0; inset: -110%; background: conic-gradient(#a96f16, #f8df8a, #fff8d7, #c58c2a, #a96f16, #ffe6a4, #fffdf1, #a96f16); animation: dasp-gold-spin 6.8s linear infinite; pointer-events: none; }
  .dasp-gold-inside, .dasp-buy-inside { position: relative; z-index: 1; width: 100%; height: 100%; overflow: hidden; }
  .dasp-gold-inside { display: block; border-radius: 14px; }
  .dasp-gold-frame { border-radius: 17px; box-shadow: 0 0 0 1px rgba(196, 146, 33, .24), 0 5px 14px rgba(171, 119, 31, .12); }
  .dasp-buy-frame, .dasp-buy-inside { border-radius: 9999px; }
  .dasp-buy-inside { display: flex; align-items: center; justify-content: center; min-height: 32px; }
  @media (prefers-reduced-motion: reduce) { .dasp-gold-frame::before, .dasp-buy-frame::before { animation: none; } }
`

function normalizeRotation(payload) {
  const expiresAt = new Date(payload?.expires_at || 0).getTime()
  if (payload?.ok === false || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) return null
  if (!Array.isArray(payload.promotions)) return null
  const seen = new Set()
  const promotions = payload.promotions.filter((item) => {
    const productId = String(item?.product_id || '').trim()
    const type = String(item?.product_type || '').toLowerCase()
    const price = Number(item?.promotion_price_usd)
    if (!productId || seen.has(productId) || !['book', 'pdf'].includes(type)) return false
    if (!String(item?.author_page_id || '').trim() || !String(item?.page_username || '').trim()) return false
    if (!String(item?.title || '').trim() || !Number.isFinite(price) || price <= 0) return false
    seen.add(productId)
    return true
  }).slice(0, 3)
  return {
    promotions,
    expiresAt,
    expires_at: new Date(expiresAt).toISOString(),
    rotationKey: String(payload.rotation_key || payload.slot_start_at || expiresAt),
  }
}

function readCachedRotation() {
  if (cachedRotation?.expiresAt > Date.now()) return cachedRotation
  cachedRotation = null
  try {
    const value = localStorage.getItem(CACHE_KEY)
    const result = value ? normalizeRotation(JSON.parse(value)) : null
    if (!result && value) localStorage.removeItem(CACHE_KEY)
    cachedRotation = result
    return result
  } catch {
    return null
  }
}

async function loadRotation(force = false) {
  const saved = readCachedRotation()
  if (!force && saved) return saved
  if (pendingLoad) return pendingLoad
  if (Date.now() < retryAfter) return saved
  pendingLoad = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/public/discover-author-store-promotion/active`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      })
      if (!response.ok) throw new Error('Unavailable')
      const rotation = normalizeRotation(await response.json())
      if (!rotation) throw new Error('Invalid rotation')
      cachedRotation = rotation
      retryAfter = 0
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          ok: true,
          promotions: rotation.promotions,
          expires_at: rotation.expires_at,
          rotation_key: rotation.rotationKey,
        }))
      } catch {}
      return rotation
    } catch {
      retryAfter = Date.now() + RETRY_MS
      return readCachedRotation()
    } finally {
      pendingLoad = null
    }
  })()
  return pendingLoad
}

function nextStartingSlide(rotationKey, count) {
  if (!count) return 0
  let index = 0
  try {
    const prior = JSON.parse(localStorage.getItem(SLIDE_KEY) || '{}')
    if (prior.rotationKey === rotationKey && Number.isInteger(prior.nextIndex)) {
      index = ((prior.nextIndex % count) + count) % count
    }
    localStorage.setItem(SLIDE_KEY, JSON.stringify({
      rotationKey,
      nextIndex: (index + 1) % count,
    }))
  } catch {}
  return index
}

function countdown(seconds) {
  const total = Math.max(0, Math.floor(seconds))
  return [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60]
    .map((number) => String(number).padStart(2, '0')).join(':')
}

function price(value) {
  return Number(value || 0).toLocaleString('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2,
  })
}

function readCart() {
  try {
    const items = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    return Array.isArray(items) ? items : []
  } catch {
    return []
  }
}

export default function DiscoverAuthorStorePromotionSection() {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [rotation, setRotation] = useState(readCachedRotation)
  const [activeIndex, setActiveIndex] = useState(0)
  const [now, setNow] = useState(Date.now())
  const [conflict, setConflict] = useState(null)
  const [error, setError] = useState('')
  const initializedRef = useRef('')
  const lastRefreshRef = useRef(0)
  const touchStartRef = useRef(null)
  const pointerStartRef = useRef(null)
  const suppressClickRef = useRef(0)

  useEffect(() => {
    let mounted = true
    loadRotation().then((value) => {
      if (mounted) setRotation(value)
    })
    return () => { mounted = false }
  }, [])

  const rotationKey = rotation?.rotationKey || ''
  const promotionCount = rotation?.promotions?.length || 0

  useEffect(() => {
    if (!rotationKey || !promotionCount || initializedRef.current === rotationKey) return
    initializedRef.current = rotationKey
    setActiveIndex(nextStartingSlide(rotationKey, promotionCount))
    setError('')
  }, [rotationKey, promotionCount])

  useEffect(() => {
    let mounted = true
    const tick = () => {
      const time = Date.now()
      if (!mounted) return
      setNow(time)
      if ((!rotation || rotation.expiresAt <= time) && time - lastRefreshRef.current >= RETRY_MS) {
        lastRefreshRef.current = time
        loadRotation(true).then((result) => {
          if (mounted && result?.expiresAt > Date.now()) setRotation(result)
        })
      }
    }
    const timer = window.setInterval(tick, 1000)
    document.addEventListener('visibilitychange', tick)
    tick()
    return () => {
      mounted = false
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [rotation?.expiresAt])

  const offers = rotation?.promotions || []
  const index = offers.length ? activeIndex % offers.length : 0
  const offer = offers[index] || null
  const remainingSeconds = rotation?.expiresAt ? Math.max(0, Math.ceil((rotation.expiresAt - now) / 1000)) : 0

  function switchSlide(delta) {
    if (offers.length < 2 || conflict) return
    setActiveIndex((current) => (current + delta + offers.length) % offers.length)
  }

  function touchStart(event) {
    const point = event.touches?.[0]
    if (point) touchStartRef.current = { x: point.clientX, y: point.clientY }
  }

  function touchEnd(event) {
    const start = touchStartRef.current
    const end = event.changedTouches?.[0]
    touchStartRef.current = null
    if (!start || !end) return
    const dx = end.clientX - start.x
    const dy = end.clientY - start.y
    if (Math.abs(dx) < 38 || Math.abs(dx) <= Math.abs(dy) * 1.2) return
    suppressClickRef.current = Date.now() + 400
    switchSlide(dx < 0 ? 1 : -1)
  }

  function handlePointerDown(event) {
    if (event.pointerType !== 'mouse' || event.button !== 0 || offers.length < 2 || conflict) return
    pointerStartRef.current = { x: event.clientX, y: event.clientY, id: event.pointerId, captured: false }
  }

  function handlePointerMove(event) {
    const start = pointerStartRef.current
    if (!start || start.id !== event.pointerId || start.captured) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy)) {
      event.currentTarget.setPointerCapture?.(event.pointerId)
      start.captured = true
    }
  }

  function handlePointerUp(event) {
    const start = pointerStartRef.current
    pointerStartRef.current = null
    if (!start || start.id !== event.pointerId) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) < 38 || Math.abs(dx) <= Math.abs(dy) * 1.2) return
    suppressClickRef.current = Date.now() + 500
    switchSlide(dx < 0 ? 1 : -1)
  }

  function saveProductToCart(product, replace = false) {
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
      }
      const existing = current.find((cartItem) => String(cartItem.id) === productId)
      const next = existing
        ? current.map((cartItem) => {
          if (String(cartItem.id) !== productId) return cartItem
          const quantity = Number(cartItem.quantity || 1)
          const max = product.product_type === 'book' ? Number(product.stock_quantity || 1) : 99
          return { ...item, quantity: Math.min(quantity + 1, max) }
        })
        : [...current, item]
      localStorage.setItem(CART_KEY, JSON.stringify(next))
      window.dispatchEvent(new Event('shadow-author-cart-updated'))
      setConflict(null)
      setError('')
      navigate('/author/cart', {
        state: { from: location.pathname + location.search + location.hash },
      })
    } catch {
      setError(t('discoverAuthorStorePromotion.cartFailed'))
    }
  }

  function buyProduct(product) {
    if (!product || remainingSeconds <= 0 || Date.now() < suppressClickRef.current) return
    const others = readCart().some((item) => {
      const otherPageId = String(item.author_page_id || '').trim()
      const otherUsername = String(item.author_page_username || '').trim()
      return otherPageId
        ? otherPageId !== String(product.author_page_id)
        : !otherUsername || otherUsername !== String(product.page_username)
    })
    if (others) {
      setConflict(product)
      return
    }
    saveProductToCart(product)
  }

  if (!offer || remainingSeconds <= 0) return null

  const discount = Math.max(0, Math.min(99, Number(offer.discount_percent || 0)))
  const original = Number(offer.original_price_usd || 0)
  const sale = Number(offer.promotion_price_usd || 0)

  return (
    <>
      <style>{visualStyles}</style>
      <section className="min-w-0" aria-label={t('discoverAuthorStorePromotion.heading')}>
        <article className="overflow-hidden border border-[#e5d9ee] bg-white dark:border-white/10 dark:bg-[var(--shadow-bg-surface)] sm:rounded-2xl">
          <div
            role="button"
            tabIndex={0}
            onClick={() => buyProduct(offer)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                buyProduct(offer)
              }
            }}
            onTouchStart={touchStart}
            onTouchEnd={touchEnd}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => { pointerStartRef.current = null }}
            onClickCapture={(event) => {
              if (Date.now() < suppressClickRef.current) {
                event.preventDefault()
                event.stopPropagation()
              }
            }}
            onDragStart={(event) => event.preventDefault()}
            style={{ touchAction: 'pan-y', userSelect: 'none' }}
            className="cursor-pointer transition-transform active:scale-[0.997] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b7882d]"
          >
            <div className="flex items-center gap-2 px-3 pb-6 pt-3 sm:px-4">
              <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full border-2 border-[#d6a33e] bg-[#e5d7b0]">
                {offer.cover_url ? <img src={offer.cover_url} alt="" className="h-full w-full object-cover" loading="lazy" /> : null}
              </div>
              <h2 className="min-w-0 flex-1 truncate text-[13px] font-extrabold text-[#25142f] dark:text-white">
                {t('discoverAuthorStorePromotion.heading')}
              </h2>
              <span className="shrink-0 rounded-full border border-[#d3a34a] bg-[#fff8e5] px-2 py-0.5 text-[10px] font-bold text-[#875d17] dark:bg-[#513b19] dark:text-[#ffe09b]">
                {t(`discoverAuthorStorePromotion.${offer.product_type}`)}
              </span>
            </div>
            <div className="flex items-start gap-2.5 px-2 pb-1.5 sm:px-3 sm:pb-2">
              <div className="dasp-gold-frame h-[240px] w-[134px] shrink-0 min-[390px]:h-[250px] min-[390px]:w-[140px]">
                <div className="dasp-gold-inside bg-[#fff7e5] dark:bg-[#281f2c]">
                  {offer.cover_url
                    ? <img src={offer.cover_url} alt={offer.title} className="h-full w-full object-cover" loading="lazy" />
                    : <div className="flex h-full items-center justify-center text-xs">{t('discoverAuthorStorePromotion.cover')}</div>}
                </div>
              </div>
              <div className="flex h-[240px] min-w-0 flex-1 flex-col gap-1 pt-0.5 min-[390px]:h-[250px]">
                <div className="flex min-w-0 items-start gap-1.5">
                  <h3 className="min-w-0 flex-1 line-clamp-2 text-[13px] font-extrabold leading-[1.3] text-[#25142f] dark:text-white min-[390px]:text-[14px]">{offer.title}</h3>
                  {offer.product_type === 'book' ? (
                    <span className="shrink-0 whitespace-nowrap rounded-full bg-[#f5eddd] px-1.5 py-0.5 text-[9px] font-bold text-[#997129] dark:bg-[#4f3d27] dark:text-[#f6db9f]">
                      {t('discoverAuthorStorePromotion.stock', { count: offer.stock_quantity })}
                    </span>
                  ) : null}
                </div>
                <p className="truncate text-[10px] font-semibold text-[#84788a] dark:text-white/60">{offer.page_name || offer.author_name}</p>
                <p className="line-clamp-2 min-h-[25px] text-[10px] leading-[1.35] text-[#807486] dark:text-white/60">{offer.description || ''}</p>
                <div className="mt-auto flex flex-col gap-1">
                  <div className="flex min-w-0 items-center gap-1 text-[10px] font-semibold text-[#84788a] dark:text-white/70" role="timer" aria-live="off">
                    <Clock3 className="h-3 w-3 shrink-0" aria-hidden="true" />
                    <span className="shrink-0">{t('discoverAuthorStorePromotion.endsIn')}</span>
                    <span className="min-w-0 font-black tabular-nums text-[#2f2339] dark:text-white">{countdown(remainingSeconds)}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    {original > sale ? <span className="text-[10px] font-medium text-[#99909d] line-through dark:text-white/50">{price(original)}</span> : null}
                    <span className="text-[16px] font-black text-[#25142f] dark:text-white min-[390px]:text-[18px]">{price(sale)}</span>
                    {discount > 0 ? <span className="rounded-md bg-[#e02b32] px-1.5 py-0.5 text-[10px] font-extrabold text-white">-{discount}%</span> : null}
                  </div>
                  <div className="dasp-buy-frame w-full rounded-full">
                    <span className="dasp-buy-inside bg-[#111111] px-2 py-1 text-center text-[11px] font-extrabold text-white">
                      <span className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap">
                        <ShoppingCart className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{t('discoverAuthorStorePromotion.buy')}</span>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {offers.length > 1 ? (
            <div className="flex items-center justify-center gap-1.5 pb-1.5 pt-0.5" role="group" aria-label={t('discoverAuthorStorePromotion.heading')}>
              {offers.map((item, position) => (
                <button
                  key={item.product_id}
                  type="button"
                  onClick={() => setActiveIndex(position)}
                  aria-label={t('discoverAuthorStorePromotion.slide', { count: position + 1 })}
                  aria-current={index === position ? 'true' : undefined}
                  className={`h-1.5 rounded-full transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b7882d] ${index === position ? 'w-5 bg-[#c99b3e]' : 'w-1.5 bg-gray-300 dark:bg-white/30'}`}
                />
              ))}
            </div>
          ) : null}
        </article>
        {error ? <p className="px-3 py-2 text-[12px] font-semibold text-red-600" role="alert">{error}</p> : null}
      </section>
      {conflict ? (
        <div className="fixed inset-0 z-[1000000] flex items-end justify-center bg-black/50 p-3 sm:items-center" role="dialog" aria-modal="true" aria-label={t('discoverAuthorStorePromotion.heading')}>
          <div className="w-full max-w-[410px] rounded-2xl bg-white p-5 text-[#25142f] shadow-xl dark:bg-[#241d2b] dark:text-white">
            <p className="text-[14px] font-bold leading-relaxed">{t('discoverAuthorStorePromotion.cartConflict')}</p>
            <div className="mt-5 flex gap-2">
              <button type="button" onClick={() => setConflict(null)} className="flex-1 rounded-full border border-gray-300 px-3 py-3 text-[12px] font-bold dark:border-white/20">
                {t('discoverAuthorStorePromotion.cancel')}
              </button>
              <button type="button" onClick={() => saveProductToCart(conflict, true)} className="flex-[1.5] rounded-full border border-[#d6a343] bg-[#101010] px-3 py-3 text-[12px] font-bold text-white">
                {t('discoverAuthorStorePromotion.replace')}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
