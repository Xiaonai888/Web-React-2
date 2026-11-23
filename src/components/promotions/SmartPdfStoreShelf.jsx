import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PromotionBookShelf from '../PromotionBookShelf'
import { getStoryLanguageId } from '../../utils/storyLanguage'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { fetchAuthorStorePdfOwnership, hasAuthorStoreReaderSession } from '../../services/authorStorePdfOwnershipApi'
import {
  getPersonalizedSmartPdfPromotion,
  queueSmartPdfVisibleOffers,
  queueSmartPdfOfferClick,
} from '../../services/smartPdfPromotionAdapter'
import { buildSmartPdfCartItem } from '../../services/smartPdfPromotionCart'

registerTranslationNamespace('smartPdfStoreShelf', {
  en: {
    conflict: 'Your cart contains products from another author. Replace them with this PDF?',
    cancel: 'Cancel', replace: 'Replace and Continue',
    checking: 'Checking your PDF purchase status. Please do not pay again.',
    unavailable: 'PDF purchase status is unavailable. No payment was started.',
    failed: 'Could not open your cart. Please try again.',
  },
  km: {
    conflict: 'កន្ត្រកមានទំនិញពីអ្នកនិពន្ធផ្សេង។ តើអ្នកចង់ជំនួសដោយ PDF នេះឬទេ?',
    cancel: 'បោះបង់', replace: 'ជំនួស ហើយបន្ត',
    checking: 'កំពុងពិនិត្យស្ថានភាពការទិញ PDF។ សូមកុំទូទាត់ម្តងទៀត។',
    unavailable: 'មិនអាចពិនិត្យស្ថានភាព PDF បានទេ។ មិនទាន់មានការទូទាត់ថ្មីទេ។',
    failed: 'មិនអាចបើកកន្ត្រកបានទេ។ សូមសាកល្បងម្តងទៀត។',
  },
  zh: {
    conflict: '购物车中有其他作者的商品。是否替换为此 PDF？',
    cancel: '取消', replace: '替换并继续',
    checking: '正在核实 PDF 购买状态，请勿重复支付。',
    unavailable: '暂时无法核实 PDF 购买状态。未创建新付款。',
    failed: '无法打开购物车，请重试。',
  },
  ja: {
    conflict: 'カートに別の作家の商品があります。この PDF に置き換えますか？',
    cancel: 'キャンセル', replace: '置き換えて続行',
    checking: 'PDF 購入状況を確認しています。再度支払わないでください。',
    unavailable: 'PDF 購入状況を確認できません。新しい決済は開始されていません。',
    failed: 'カートを開けません。もう一度お試しください。',
  },
  ko: {
    conflict: '장바구니에 다른 작가의 상품이 있습니다. 이 PDF로 교체하시겠습니까?',
    cancel: '취소', replace: '교체하고 계속',
    checking: 'PDF 구매 상태를 확인 중입니다. 다시 결제하지 마세요.',
    unavailable: 'PDF 구매 상태를 확인할 수 없습니다. 새 결제는 시작되지 않았습니다.',
    failed: '장바구니를 열 수 없습니다. 다시 시도하세요.',
  },
})

const CART_KEY = 'shadow_author_cart_items'
const REFRESH_GAP_MS = 15000
const RETRY_MS = 30000

function getCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function SmartPdfStoreShelf() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const placement = location.pathname.startsWith('/manga') ? 'manga' : 'stories'
  const language = getStoryLanguageId()
  const [selection, setSelection] = useState(null)
  const [now, setNow] = useState(Date.now)
  const [error, setError] = useState('')
const [busy, setBusy] = useState(false)
  const busyRef = useRef(false)
  const sectionRef = useRef(null)
  const visibleRef = useRef(false)
  const mountedRef = useRef(false)
  const generationRef = useRef(0)
  const refreshRef = useRef({ last: 0, retryAt: 0 })
  const latestRef = useRef(selection)
  latestRef.current = selection

  const load = useCallback(async (force = false) => {
    if (!mountedRef.current) return
    const time = Date.now()
    if (time < refreshRef.current.retryAt ||
        (!force && time - refreshRef.current.last < REFRESH_GAP_MS)) return
    refreshRef.current.last = time
    const generation = ++generationRef.current
    try {
      const result = await getPersonalizedSmartPdfPromotion({ placement, force })
      if (!mountedRef.current || generation !== generationRef.current || getStoryLanguageId() !== language) return
      const expires = Date.parse(String(result.expires_at || ''))
      if (result.ok !== true || result.language !== language || !Number.isFinite(expires) || expires <= Date.now()) {
        throw new Error('PDF selection is not current')
      }
      setSelection({ ...result, expiresAt: expires })
      setError('')
      refreshRef.current.retryAt = 0
    } catch {
      if (!mountedRef.current || generation !== generationRef.current) return
      setSelection(null)
      setError('')
      refreshRef.current.retryAt = Date.now() + RETRY_MS
    }
  }, [placement, language])

  useEffect(() => {
    mountedRef.current = true
    generationRef.current += 1
    refreshRef.current = { last: 0, retryAt: 0 }
    setSelection(null)
    void load(true)
    const update = () => {
      if (document.visibilityState !== 'visible') return
      setNow(Date.now())
      void load()
    }
    const onStorage = (event) => {
      if (event.key === 'shadow_reader_token' || event.key === null) {
        setSelection(null)
        refreshRef.current = { last: 0, retryAt: 0 }
        void load(true)
      }
    }
    const timer = window.setInterval(() => {
      const time = Date.now()
      setNow(time)
      if (document.visibilityState === 'visible' && (!latestRef.current || latestRef.current.expiresAt <= time)) {
        void load()
      }
    }, 1000)
    window.addEventListener('focus', update)
    window.addEventListener('pageshow', update)
    window.addEventListener('storage', onStorage)
    document.addEventListener('visibilitychange', update)
    return () => {
      mountedRef.current = false
      generationRef.current += 1
      window.clearInterval(timer)
      window.removeEventListener('focus', update)
      window.removeEventListener('pageshow', update)
      window.removeEventListener('storage', onStorage)
      document.removeEventListener('visibilitychange', update)
    }
  }, [load])

  const offers = selection?.promotions || []
  const productsKey = offers.map((offer) => offer.product_id).join(',')
  const remainingSeconds = selection?.expiresAt ? Math.max(0, Math.ceil((selection.expiresAt - now) / 1000)) : 0

  useEffect(() => {
    const element = sectionRef.current
    if (!element || !selection || !productsKey || remainingSeconds <= 0) return
    let stopped = false
    const expose = () => {
      if (stopped || visibleRef.current) return
      visibleRef.current = true
      queueSmartPdfVisibleOffers({
        placement,
        rotationKey: selection.rotation_key,
        productIds: productsKey.split(','),
      })
    }
    visibleRef.current = false
    if (typeof IntersectionObserver === 'undefined') {
      expose()
      return () => { stopped = true }
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.1)) expose()
    }, { threshold: 0.1 })
    observer.observe(element)
    return () => { stopped = true; observer.disconnect() }
  }, [placement, selection?.rotation_key, productsKey])

  async function handleBuy(product) {
    if (busyRef.current || !selection || remainingSeconds <= 0 || !product) return
    if (!hasAuthorStoreReaderSession()) {
      navigate('/login', { state: { from: location.pathname + location.search + location.hash } })
      return
    }
    busyRef.current = true
    setBusy(true)
    setError('')
    try {
      const status = await fetchAuthorStorePdfOwnership([product.product_id])
      const itemState = (status.products || []).find((row) => String(row.product_id) === String(product.product_id))
      if (status.authenticated !== true || !itemState || itemState.product_type !== 'pdf') {
        setError(t('smartPdfStoreShelf.unavailable'))
        return
      }
      if (itemState.state === 'purchased') {
  const current = getCart()
  const remaining = current.filter(
    (item) => String(item.id) !== String(product.product_id)
  )

  if (remaining.length !== current.length) {
    localStorage.setItem(CART_KEY, JSON.stringify(remaining))
    window.dispatchEvent(new Event('shadow-author-cart-updated'))
  }

  navigate(`/discover/pdf/${encodeURIComponent(product.product_id)}`, {
    state: {
      title: product.title,
      from: location.pathname + location.search + location.hash,
    },
  })
  return
}

if (itemState.state !== 'available') {
  setError(t('smartPdfStoreShelf.checking'))
  return
}
      const cartItem = buildSmartPdfCartItem(product, {
        rotationKey: selection.rotation_key,
        expiresAt: selection.expires_at,
        source: placement,
      })
      queueSmartPdfOfferClick({
  placement,
  rotationKey: selection.rotation_key,
  productId: product.product_id,
})

navigate(
  `/author/page/${encodeURIComponent(product.page_username)}/store/product/${encodeURIComponent(product.product_id)}`,
  {
    state: {
      from: location.pathname + location.search + location.hash,
      discoverPurchaseOffer: cartItem,
    },
  }
)
    } catch {
      setError(t('smartPdfStoreShelf.failed'))
    } finally {
      busyRef.current = false
      setBusy(false)
    }
  }

  if (!selection || !offers.length || remainingSeconds <= 0) return null

  return (
    <div ref={sectionRef}>
      <PromotionBookShelf
        kind="store"
        offers={offers}
        remainingSeconds={remainingSeconds}
        onBuy={(product) => { void handleBuy(product) }}
      />
      {busy ? <p role="status" className="mx-3 mt-2 text-[12px] text-[var(--shadow-text-secondary)]">{t('smartPdfStoreShelf.checking')}</p> : null}
      {error ? <p role="alert" className="mx-3 mt-2 text-[12px] font-semibold text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  )
}
