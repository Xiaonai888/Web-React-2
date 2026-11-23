import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Clock3, ShoppingCart } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { getStoryLanguageId } from '../../utils/storyLanguage'
import { fetchAuthorStorePdfOwnership, hasAuthorStoreReaderSession } from '../../services/authorStorePdfOwnershipApi'
import {
  getPersonalizedSmartPdfPromotion,
  queueSmartPdfVisibleOffers,
  queueSmartPdfOfferClick,
} from '../../services/smartPdfPromotionAdapter'
import { buildSmartPdfCartItem, planSmartPdfCart } from '../../services/smartPdfPromotionCart'

registerTranslationNamespace('discoverSmartPdfPromotion', {
  en: {
    heading: 'PDF Promotion', buy: 'Buy Now', checking: 'Checking Payment',
    endsIn: 'Ends in', slide: 'View PDF {{count}}',
    conflict: 'Your cart contains products from another author. Replace them with this PDF?',
    cancel: 'Cancel', replace: 'Replace and Continue',
    unavailable: 'PDF purchase status could not be verified. No new payment was created.',
    owned: 'You already own this PDF. Looking for another recommendation.',
    failed: 'Could not open your cart. Please try again.', cover: 'No cover',
  },
  km: {
    heading: 'ប្រូម៉ូសិន PDF', buy: 'ទិញឥឡូវនេះ', checking: 'ពិនិត្យការទូទាត់',
    endsIn: 'បញ្ចប់ក្នុង', slide: 'មើល PDF ទី {{count}}',
    conflict: 'កន្ត្រកមានទំនិញពីអ្នកនិពន្ធផ្សេង។ តើអ្នកចង់ជំនួសដោយ PDF នេះឬទេ?',
    cancel: 'បោះបង់', replace: 'ជំនួស ហើយបន្ត',
    unavailable: 'មិនអាចពិនិត្យសិទ្ធិ PDF បានទេ។ មិនមានការបង្កើត Payment ថ្មីទេ។',
    owned: 'អ្នកបានទិញ PDF នេះរួចហើយ។ កំពុងរក PDF ផ្សេងជំនួស។',
    failed: 'មិនអាចបើកកន្ត្រកបានទេ។ សូមសាកល្បងម្ដងទៀត។', cover: 'គ្មានក្រប',
  },
  zh: {
    heading: 'PDF 优惠', buy: '立即购买', checking: '核实付款',
    endsIn: '剩余时间', slide: '查看第 {{count}} 本 PDF',
    conflict: '购物车中有其他作者的商品。是否替换为此 PDF？',
    cancel: '取消', replace: '替换并继续',
    unavailable: '无法核实 PDF 购买状态。未创建新付款。',
    owned: '您已购买此 PDF，正在推荐其他作品。',
    failed: '无法打开购物车，请重试。', cover: '暂无封面',
  },
  ja: {
    heading: 'PDF セール', buy: '今すぐ購入', checking: '支払いを確認',
    endsIn: '終了まで', slide: 'PDF {{count}} を表示',
    conflict: 'カートに別の著者の商品があります。この PDF に置き換えますか？',
    cancel: 'キャンセル', replace: '置き換えて続行',
    unavailable: 'PDF の購入状況を確認できません。決済は開始されていません。',
    owned: '購入済みの PDF です。別の作品を探しています。',
    failed: 'カートを開けませんでした。もう一度お試しください。', cover: '表紙なし',
  },
  ko: {
    heading: 'PDF 프로모션', buy: '지금 구매', checking: '결제 확인',
    endsIn: '종료까지', slide: '{{count}}번째 PDF 보기',
    conflict: '장바구니에 다른 작가의 상품이 있습니다. 이 PDF로 교체하시겠습니까?',
    cancel: '취소', replace: '교체하고 계속',
    unavailable: 'PDF 구매 상태를 확인할 수 없습니다. 결제가 시작되지 않았습니다.',
    owned: '이미 구매한 PDF입니다. 다른 작품을 찾고 있습니다.',
    failed: '장바구니를 열 수 없습니다. 다시 시도하세요.', cover: '표지 없음',
  },
})

const CART_KEY = 'shadow_author_cart_items'
const RETRY_MS = 30000
const MIN_REFRESH_MS = 15000

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

function countdown(seconds) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0))
  return [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60]
    .map((number) => String(number).padStart(2, '0')).join(':')
}

function money(value) {
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

export default function DiscoverSmartPdfPromotionSection() {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [language, setLanguage] = useState(getStoryLanguageId)
  const [selection, setSelection] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [now, setNow] = useState(Date.now)
  const [conflict, setConflict] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const mountedRef = useRef(false)
  const generationRef = useRef(0)
  const latestRef = useRef(null)
  const lastRequestRef = useRef(0)
  const retryAfterRef = useRef(0)
  const requestRef = useRef(null)
  const sectionRef = useRef(null)
  const touchStartRef = useRef(null)
  const pointerStartRef = useRef(null)
  const suppressClickRef = useRef(0)
  const actionRef = useRef(false)

  latestRef.current = selection

  const load = useCallback(async (force = false) => {
    if (!mountedRef.current) return
    const requestedAt = Date.now()
    if (requestRef.current || requestedAt < retryAfterRef.current ||
        (!force && requestedAt - lastRequestRef.current < MIN_REFRESH_MS)) return
    lastRequestRef.current = requestedAt
    const generation = ++generationRef.current
    const pending = (async () => {
      try {
        const result = await getPersonalizedSmartPdfPromotion({ placement: 'discover', force })
        if (!mountedRef.current || generation !== generationRef.current || getStoryLanguageId() !== language) return
        const expiresAt = Date.parse(String(result?.expires_at || ''))
        if (result?.ok !== true || result?.language !== language ||
            !Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
          throw new Error('PDF promotion is not current')
        }
        setSelection({ ...result, expiresAt })
        setActiveIndex((current) => result.promotions.length ? current % result.promotions.length : 0)
        retryAfterRef.current = 0
        setError('')
      } catch {
        if (!mountedRef.current || generation !== generationRef.current) return
        retryAfterRef.current = Date.now() + RETRY_MS
        setSelection(null)
      }
    })()
    requestRef.current = pending
    try {
      await pending
    } finally {
      if (requestRef.current === pending) requestRef.current = null
    }
  }, [language])

  useEffect(() => {
    mountedRef.current = true
    generationRef.current += 1
    lastRequestRef.current = 0
    retryAfterRef.current = 0
    setSelection(null)
    void load(true)
    const onVisible = () => {
      const selectedLanguage = getStoryLanguageId()
      if (selectedLanguage !== language) {
        setLanguage(selectedLanguage)
        return
      }
      if (document.visibilityState === 'visible') void load(false)
    }
    const onStorage = (event) => {
      if (event.key === 'shadow_reader_token' || event.key === null) {
        setSelection(null)
        lastRequestRef.current = 0
        retryAfterRef.current = 0
        void load(true)
      }
      if (event.key === 'shadow_story_language' || event.key === null) onVisible()
    }
    const tick = () => {
      const time = Date.now()
      setNow(time)
      if (document.visibilityState === 'visible' &&
          (!latestRef.current || latestRef.current.expiresAt <= time)) void load(false)
    }
    const timer = window.setInterval(tick, 1000)
    window.addEventListener('focus', onVisible)
    window.addEventListener('pageshow', onVisible)
    window.addEventListener('storage', onStorage)
    window.addEventListener('shadow:story-language-initialized', onVisible)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      mountedRef.current = false
      generationRef.current += 1
      requestRef.current = null
      window.clearInterval(timer)
      window.removeEventListener('focus', onVisible)
      window.removeEventListener('pageshow', onVisible)
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('shadow:story-language-initialized', onVisible)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [language, load])

  const offers = selection?.promotions || []
  const offer = offers.length ? offers[activeIndex % offers.length] : null
  const rotationKey = String(selection?.rotation_key || '')
  const remainingSeconds = selection?.expiresAt
    ? Math.max(0, Math.ceil((selection.expiresAt - now) / 1000)) : 0
  const visibleProductId = String(offer?.product_id || '')

  useEffect(() => {
    const element = sectionRef.current
    if (!element || !visibleProductId || !rotationKey || remainingSeconds <= 0) return
    let recorded = false
    const record = () => {
      if (recorded) return
      recorded = true
      queueSmartPdfVisibleOffers({ placement: 'discover', rotationKey, productIds: [visibleProductId] })
    }
    if (typeof IntersectionObserver === 'undefined') {
      record()
      return
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.1)) record()
    }, { threshold: 0.1 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [rotationKey, visibleProductId, remainingSeconds > 0])

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

  async function buyProduct(product, replace = false) {
    if (!product || !selection || remainingSeconds <= 0 ||
        Date.now() < suppressClickRef.current || actionRef.current) return
    if (!hasAuthorStoreReaderSession()) {
      navigate('/login', { state: { from: location.pathname + location.search + location.hash } })
      return
    }
    actionRef.current = true
    setBusy(true)
    setError('')
    try {
      const ownership = await fetchAuthorStorePdfOwnership([product.product_id])
      const row = (ownership.products || []).find((item) => String(item.product_id) === String(product.product_id))
      if (ownership.authenticated !== true || !row || row.product_type !== 'pdf') {
        setError(t('discoverSmartPdfPromotion.unavailable'))
        return
      }
      if (row.state !== 'available') {
        if (row.state === 'purchased') {
          setSelection((current) => current ? {
            ...current,
            promotions: current.promotions.filter((item) => item.product_id !== product.product_id),
          } : null)
          lastRequestRef.current = 0
          retryAfterRef.current = 0
          void load(false)
          setError(t('discoverSmartPdfPromotion.owned'))
        } else {
          setError(t('discoverSmartPdfPromotion.checking'))
        }
        return
      }
      const cartItem = buildSmartPdfCartItem(product, {
        rotationKey: selection.rotation_key,
        expiresAt: selection.expires_at,
        source: 'discover',
      })
      const planned = planSmartPdfCart(readCart(), cartItem, { replace })
      if (planned.conflict) {
        setConflict(product)
        return
      }
      localStorage.setItem(CART_KEY, JSON.stringify(planned.items))
      window.dispatchEvent(new Event('shadow-author-cart-updated'))
      queueSmartPdfOfferClick({ placement: 'discover', rotationKey: selection.rotation_key, productId: product.product_id })
      setConflict(null)
      navigate('/author/cart', { state: { from: location.pathname + location.search + location.hash } })
    } catch {
      setError(t('discoverSmartPdfPromotion.failed'))
    } finally {
      actionRef.current = false
      setBusy(false)
    }
  }

  if (!offer || remainingSeconds <= 0) return null

  const discount = Math.max(0, Math.min(99, Number(offer.discount_percent) || 0))
  const original = Number(offer.original_price_usd || 0)
  const sale = Number(offer.promotion_price_usd || 0)

  return (
    <>
      <style>{visualStyles}</style>
      <section ref={sectionRef} className="min-w-0" aria-label={t('discoverSmartPdfPromotion.heading')}>
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
                onClick={(event) => { event.stopPropagation(); navigate('/store') }}
                onKeyDown={(event) => event.stopPropagation()}
                aria-label={t('discoverSmartPdfPromotion.heading')}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
              >
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-[#d6a33e] bg-[#e5d7b0]">
                  {offer.cover_url ? <img src={offer.cover_url} alt="" className="h-full w-full object-cover" loading="lazy" /> : null}
                </div>
                <h2 className="min-w-0 flex-1 truncate text-[13px] font-extrabold text-[#25142f] dark:text-white">
                  {t('discoverSmartPdfPromotion.heading')}
                </h2>
              </button>
              <span className="shrink-0 rounded-full border border-[#d3a34a] bg-[#fff8e5] px-2 py-0.5 text-[10px] font-bold text-[#875d17] dark:bg-[#513b19] dark:text-[#ffe09b]">PDF</span>
            </div>
            <div className="flex items-start gap-2.5 px-2 pb-1.5 sm:px-3 sm:pb-2">
              <div className="dasp-gold-frame h-[162px] w-[114px] shrink-0 min-[390px]:h-[170px] min-[390px]:w-[120px]">
                <div className="dasp-gold-inside bg-[#fff7e5] dark:bg-[#281f2c]">
                  {offer.cover_url
                    ? <img src={offer.cover_url} alt={offer.title} className="h-full w-full object-cover" loading="lazy" />
                    : <div className="flex h-full items-center justify-center text-xs">{t('discoverSmartPdfPromotion.cover')}</div>}
                </div>
              </div>
              <div className="flex h-[162px] min-w-0 flex-1 flex-col gap-1 pt-0.5 min-[390px]:h-[170px]">
                <div className="flex min-w-0 items-start gap-1.5">
                  <h3 className="min-w-0 flex-1 line-clamp-2 text-[13px] font-extrabold leading-[1.3] text-[#25142f] dark:text-white min-[390px]:text-[14px]">{offer.title}</h3>
                </div>
                <p className="truncate text-[10px] font-semibold text-[#84788a] dark:text-white/60">{offer.page_name || offer.author_name}</p>
                <p className="line-clamp-2 min-h-[25px] text-[10px] leading-[1.35] text-[#807486] dark:text-white/60">{offer.description || ''}</p>
                <div className="mt-auto flex flex-col gap-1">
                  <div className="flex min-w-0 items-center gap-1 text-[10px] font-semibold text-[#84788a] dark:text-white/70" role="timer" aria-live="off">
                    <Clock3 className="h-3 w-3 shrink-0" aria-hidden="true" />
                    <span className="shrink-0">{t('discoverSmartPdfPromotion.endsIn')}</span>
                    <span className="min-w-0 font-black tabular-nums text-[#2f2339] dark:text-white">{countdown(remainingSeconds)}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    {original > sale ? <span className="text-[10px] font-medium text-[#99909d] line-through dark:text-white/50">{money(original)}</span> : null}
                    <span className="text-[16px] font-black text-[#25142f] dark:text-white min-[390px]:text-[18px]">{money(sale)}</span>
                    {discount > 0 ? <span className="rounded-md bg-[#e02b32] px-1.5 py-0.5 text-[10px] font-extrabold text-white">-{discount}%</span> : null}
                  </div>
                  <div className="dasp-buy-frame w-full rounded-full">
                    <span className="dasp-buy-inside bg-[#111111] px-2 py-1 text-center text-[11px] font-extrabold text-white">
                      <span className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap">
                        <ShoppingCart className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{t(busy ? 'discoverSmartPdfPromotion.checking' : 'discoverSmartPdfPromotion.buy')}</span>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {offers.length > 1 ? (
            <div className="flex items-center justify-center gap-1.5 pb-3 pt-4" role="group" aria-label={t('discoverSmartPdfPromotion.heading')}>
              {offers.map((item, position) => (
                <button
                  key={item.product_id}
                  type="button"
                  onClick={() => setActiveIndex(position)}
                  aria-label={t('discoverSmartPdfPromotion.slide', { count: position + 1 })}
                  aria-current={activeIndex % offers.length === position ? 'true' : undefined}
                  className={`h-1.5 rounded-full transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b7882d] ${activeIndex % offers.length === position ? 'w-5 bg-[#c99b3e]' : 'w-1.5 bg-gray-300 dark:bg-white/30'}`}
                />
              ))}
            </div>
          ) : null}
        </article>
        {error ? <p className="px-3 py-2 text-[12px] font-semibold text-red-600 dark:text-red-300" role="alert">{error}</p> : null}
      </section>
      {conflict ? (
        <div className="fixed inset-0 z-[1000000] flex items-end justify-center bg-black/50 p-3 sm:items-center" role="dialog" aria-modal="true" aria-label={t('discoverSmartPdfPromotion.heading')}>
          <div className="w-full max-w-[410px] rounded-2xl bg-white p-5 text-[#25142f] shadow-xl dark:bg-[#241d2b] dark:text-white">
            <p className="text-[14px] font-bold leading-relaxed">{t('discoverSmartPdfPromotion.conflict')}</p>
            <div className="mt-5 flex gap-2">
              <button type="button" onClick={() => setConflict(null)} className="flex-1 rounded-full border border-gray-300 px-3 py-3 text-[12px] font-bold dark:border-white/20">{t('discoverSmartPdfPromotion.cancel')}</button>
              <button type="button" onClick={() => { void buyProduct(conflict, true) }} className="flex-[1.5] rounded-full border border-[#d6a343] bg-[#101010] px-3 py-3 text-[12px] font-bold text-white">{t('discoverSmartPdfPromotion.replace')}</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
