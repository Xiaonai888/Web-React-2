import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Clock3, ShoppingCart } from 'lucide-react'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { loadCountrySettings } from '../../utils/countrySettings'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { fetchAuthorStorePdfOwnership, hasAuthorStoreReaderSession, recheckAuthorStorePdfPayment } from '../../services/authorStorePdfOwnershipApi'

registerTranslationNamespace('discoverAuthorStorePromotion', {
  en: {
    heading: 'Book & PDF Promotion',
    book: 'Book',
    pdf: 'PDF',
    buy: 'Buy Now',
    readNow: 'Read Now',
    checking: 'Checking Payment',
    verifyUnavailable: 'PDF ownership could not be verified. No new payment was created.',
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
    readNow: 'អានឥឡូវនេះ',
    checking: 'ពិនិត្យការទូទាត់',
    verifyUnavailable: 'មិនអាចពិនិត្យសិទ្ធិ PDF បានទេ។ មិនមានការបង្កើត Payment ថ្មីទេ។',
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
    readNow: '立即阅读',
    checking: '核实付款',
    verifyUnavailable: '无法核实 PDF 购买状态。未创建新付款。',
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
    readNow: '今すぐ読む',
    checking: '支払いを確認',
    verifyUnavailable: 'PDF の購入状況を確認できません。新しい決済は作成していません。',
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
    readNow: '지금 읽기',
    checking: '결제 확인',
    verifyUnavailable: 'PDF 구매 상태를 확인할 수 없습니다. 새 결제는 생성되지 않았습니다.',
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

const BOOK_COUNTRY_COPY = {
  en: {
    blocked: 'Paper books are available in Cambodia only.',
    unknown: 'Could not verify your country. Please try again.',
    close: 'OK',
  },
  km: {
    blocked: 'សៀវភៅក្រដាសអាចទិញបានតែនៅកម្ពុជាប៉ុណ្ណោះ។',
    unknown: 'មិនអាចផ្ទៀងផ្ទាត់ប្រទេសអ្នកបានទេ។ សូមសាកល្បងម្ដងទៀត។',
    close: 'យល់ព្រម',
  },
  zh: {
    blocked: '纸质书目前仅在柬埔寨出售。',
    unknown: '无法验证您的国家，请重试。',
    close: '确定',
  },
  ja: {
    blocked: '紙の本はカンボジア国内でのみ購入できます。',
    unknown: '国を確認できません。もう一度お試しください。',
    close: 'OK',
  },
  ko: {
    blocked: '종이책은 캄보디아에서만 구매할 수 있습니다.',
    unknown: '국가를 확인할 수 없습니다. 다시 시도해 주세요.',
    close: '확인',
  },
}

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
  const [bookCountryNotice, setBookCountryNotice] = useState(false)
  const bookCountryCopy = BOOK_COUNTRY_COPY[getDisplayLanguageId()] || BOOK_COUNTRY_COPY.en
  const [error, setError] = useState('')
  const [pdfOwnership, setPdfOwnership] = useState({ status: 'loading', states: {} })
  const [busyId, setBusyId] = useState('')
  const actionRef = useRef(false)
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
  const pdfIdsKey = [...new Set((rotation?.promotions || [])
    .filter((product) => product.product_type === 'pdf')
    .map((product) => String(product.product_id || '').trim())
    .filter(Boolean))].sort().join(',')

  useEffect(() => {
    let active = true
    const controller = new AbortController()
    let lastCheckedAt = 0
    let inFlight = false

    async function refresh(force = false) {
      if (!active || inFlight || (!force && document.visibilityState === 'hidden')) return
      if (!force && Date.now() - lastCheckedAt < 10000) return
      lastCheckedAt = Date.now()
      if (!pdfIdsKey || !hasAuthorStoreReaderSession()) {
        setPdfOwnership({ status: 'ready', states: {} })
        return
      }
      inFlight = true
      try {
        const result = await fetchAuthorStorePdfOwnership(pdfIdsKey.split(','), { signal: controller.signal })
        if (!active || controller.signal.aborted) return
        const states = Object.fromEntries((result.products || [])
          .filter((product) => product?.product_type === 'pdf')
          .map((product) => [String(product.product_id), product]))
        setPdfOwnership({ status: 'ready', states })
      } catch {
        if (active && !controller.signal.aborted) setPdfOwnership({ status: 'unavailable', states: {} })
      } finally {
        inFlight = false
      }
    }

    setPdfOwnership({ status: 'loading', states: {} })
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
    if (offers.length < 2 || bookCountryNotice) return
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
    if (event.pointerType !== 'mouse' || event.button !== 0 || offers.length < 2 || bookCountryNotice) return
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

  
function openProductDetail(product) {
  const item = {
    id: String(product.product_id),
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

  navigate(
    `/author/page/${encodeURIComponent(product.page_username)}/store/product/${encodeURIComponent(product.product_id)}`,
    {
      state: {
        from: location.pathname + location.search + location.hash,
        discoverPurchaseOffer: item,
      },
    }
  )
}

  function readPdf(product) {
    const productId = String(product.product_id)
    const existing = readCart()
    const next = existing.filter((item) => String(item.id) !== productId)
    if (next.length !== existing.length) {
      localStorage.setItem(CART_KEY, JSON.stringify(next))
      window.dispatchEvent(new Event('shadow-author-cart-updated'))
    }
setBookCountryNotice(false)
setError('')
navigate(`/discover/pdf/${encodeURIComponent(productId)}`, {
      state: { title: product.title, from: location.pathname + location.search + location.hash },
    })
  }

  async function buyProduct(product) {
    if (!product || remainingSeconds <= 0 || Date.now() < suppressClickRef.current || actionRef.current) return
    actionRef.current = true
    setBusyId(String(product.product_id))
setError('')
try {
  if (product.product_type === 'book') {
    const country = await loadCountrySettings()

    if (country?.countryVerified !== true) {
      setError(bookCountryCopy.unknown)
      return
    }

    const allowed =
      country.country === 'KH' ||
      (country.hasException === true &&
       country.effective?.physicalBooks === true)

    if (!allowed) {
      setBookCountryNotice(true)
      return
    }
  }

  if (product.product_type === 'pdf' && hasAuthorStoreReaderSession()) {
        const result = await fetchAuthorStorePdfOwnership([product.product_id])
        const current = (result.products || []).find((row) => String(row.product_id) === String(product.product_id))
        if (!current || current.product_type !== 'pdf') {
          setError(t('discoverAuthorStorePromotion.verifyUnavailable'))
          return
        }
        setPdfOwnership((previous) => ({
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
                const owned = (confirmed.products || []).find((row) => String(row.product_id) === String(product.product_id))
                if (owned?.state === 'purchased') {
                  setPdfOwnership((previous) => ({
                    status: 'ready',
                    states: { ...previous.states, [String(product.product_id)]: owned },
                  }))
                  readPdf(product)
                  return
                }
              }
            } catch {
              setError(t('discoverAuthorStorePromotion.checking'))
              return
            }
          }
          setError(t('discoverAuthorStorePromotion.checking'))
          return
        }
      }
      openProductDetail(product)
    } catch {
      setError(t('discoverAuthorStorePromotion.verifyUnavailable'))
    } finally {
      actionRef.current = false
      setBusyId('')
    }
  }

  function getPdfAction(product) {
    if (product.product_type !== 'pdf' || !hasAuthorStoreReaderSession()) return 'buy'
    if (pdfOwnership.status !== 'ready') return 'checking'
    const state = pdfOwnership.states[String(product.product_id)]?.state
    return state === 'purchased' ? 'readNow' : state === 'available' ? 'buy' : 'checking'
  }

  if (!offer || remainingSeconds <= 0) return null

  const discount = Math.max(0, Math.min(99, Number(offer.discount_percent || 0)))
  const original = Number(offer.original_price_usd || 0)
  const sale = Number(offer.promotion_price_usd || 0)
  const action = getPdfAction(offer)

  return (
    <>
      <style>{visualStyles}</style>
      <section className="min-w-0" aria-label={t('discoverAuthorStorePromotion.heading')}>
        <article className="overflow-hidden border border-[#e5d9ee] bg-white dark:border-white/10 dark:bg-[var(--shadow-bg-surface)] sm:rounded-2xl">
          <div
            role="button"
            tabIndex={0}
            onClick={() => { void buyProduct(offer) }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                void buyProduct(offer)
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
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  navigate('/store')
                }}
                onKeyDown={(event) => event.stopPropagation()}
                aria-label={t('discoverAuthorStorePromotion.heading')}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
              >
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-[#d6a33e] bg-[#e5d7b0]">
                  {offer.cover_url ? <img src={offer.cover_url} alt="" className="h-full w-full object-cover" loading="lazy" /> : null}
                </div>
                <h2 className="min-w-0 flex-1 truncate text-[13px] font-extrabold text-[#25142f] dark:text-white">
                  {t('discoverAuthorStorePromotion.heading')}
                </h2>
              </button>
              <span className="shrink-0 rounded-full border border-[#d3a34a] bg-[#fff8e5] px-2 py-0.5 text-[10px] font-bold text-[#875d17] dark:bg-[#513b19] dark:text-[#ffe09b]">
                {t(`discoverAuthorStorePromotion.${offer.product_type}`)}
              </span>
            </div>
            <div className="flex items-start gap-2.5 px-2 pb-1.5 sm:px-3 sm:pb-2">
              <div className="dasp-gold-frame h-[162px] w-[114px] shrink-0 min-[390px]:h-[170px] min-[390px]:w-[120px]">
                <div className="dasp-gold-inside bg-[#fff7e5] dark:bg-[#281f2c]">
                  {offer.cover_url
                    ? <img src={offer.cover_url} alt={offer.title} className="h-full w-full object-cover" loading="lazy" />
                    : <div className="flex h-full items-center justify-center text-xs">{t('discoverAuthorStorePromotion.cover')}</div>}
                </div>
              </div>
              <div className="flex h-[162px] min-w-0 flex-1 flex-col gap-1 pt-0.5 min-[390px]:h-[170px]">
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
                        <span>{t(`discoverAuthorStorePromotion.${action}`)}</span>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {offers.length > 1 ? (
            <div className="flex items-center justify-center gap-1.5 pb-3 pt-4" role="group" aria-label={t('discoverAuthorStorePromotion.heading')}>
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
        {busyId ? <p className="px-3 py-2 text-[12px] text-[var(--shadow-text-secondary)]" role="status">{t('discoverAuthorStorePromotion.checking')}</p> : null}
        {error ? <p className="px-3 py-2 text-[12px] font-semibold text-red-600" role="alert">{error}</p> : null}
      </section>
     {bookCountryNotice ? (
  <div
    className="fixed inset-0 z-[1000000] flex items-end justify-center bg-black/50 p-3 sm:items-center"
    role="dialog"
    aria-modal="true"
    aria-label={t('discoverAuthorStorePromotion.heading')}
  >
    <div className="w-full max-w-[410px] rounded-2xl bg-white p-5 text-[#25142f] shadow-xl dark:bg-[#241d2b] dark:text-white">
      <p className="text-[14px] font-medium leading-relaxed">
        {bookCountryCopy.blocked}
      </p>

      <button
        type="button"
        onClick={() => setBookCountryNotice(false)}
        className="mt-5 h-11 w-full rounded-full bg-[#111111] text-[13px] font-medium text-white"
      >
        {bookCountryCopy.close}
      </button>
    </div>
  </div>
) : null}
    </>
  )
}
