import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SpecialPromotionCheckoutSheet from '../promotions/SpecialPromotionCheckoutSheet'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import DiscoverSpecialPromotionCard from './DiscoverSpecialPromotionCard'
import { getStoryLanguageId } from '../../utils/storyLanguage'
import { getSmartAdReaderKey } from '../../services/smartAdClient'
import { getSmartPromotionCache, loadSmartPromotionShelf, clearSmartPromotionCache } from '../../services/smartPromotionClient'

registerTranslationNamespace('discoverSpecialPromotionCheckout', {
  en: {
    confirmTitle: 'Confirm Special Promotion',
    confirmDescription: 'Unlock {{count}} locked episodes of this story with Diamonds.',
    discount: '50% off',
    cancel: 'Cancel',
    confirm: 'Confirm Purchase',
    processing: 'Processing...',
    close: 'Close purchase confirmation',
    updatedPrice: 'Your available episodes or price changed. Please confirm the updated amount.',
    insufficient: 'Not enough Diamonds to complete this purchase.',
    topUp: 'Top Up Diamonds',
    expired: 'This promotion has changed. Please review the updated offer.',
    failed: 'Could not complete the purchase. Please try again.',
    purchased: 'Episodes unlocked successfully!',
    alreadyOwned: 'You already have all these episodes unlocked.',
    readStory: 'Read Story',
    slide: 'Promotion {{count}}',
  },
  km: {
    confirmTitle: 'បញ្ជាក់ការទិញការផ្ដល់ជូនពិសេស',
    confirmDescription: 'ដោះសោ {{count}} ភាគចាក់សោនៃរឿងនេះដោយប្រើ Diamonds។',
    discount: 'បញ្ចុះតម្លៃ 50%',
    cancel: 'បោះបង់',
    confirm: 'បញ្ជាក់ការទិញ',
    processing: 'កំពុងដំណើរការ...',
    close: 'បិទផ្ទាំងបញ្ជាក់ការទិញ',
    updatedPrice: 'ចំនួនភាគ ឬតម្លៃបានផ្លាស់ប្ដូរ។ សូមបញ្ជាក់តម្លៃថ្មីម្ដងទៀត។',
    insufficient: 'Diamonds របស់អ្នកមិនគ្រប់សម្រាប់ទិញទេ។',
    topUp: 'បញ្ចូល Diamonds',
    expired: 'ការផ្ដល់ជូននេះបានផ្លាស់ប្ដូរ។ សូមពិនិត្យតម្លៃថ្មី។',
    failed: 'មិនអាចទិញបានទេ។ សូមសាកល្បងម្ដងទៀត។',
    purchased: 'បានដោះសោភាគដោយជោគជ័យ!',
    alreadyOwned: 'អ្នកបានដោះសោភាគទាំងនេះរួចហើយ។',
    readStory: 'អានរឿង',
    slide: 'រឿងទី {{count}}',
  },
  zh: {
    confirmTitle: '确认特别优惠购买',
    confirmDescription: '使用钻石解锁本书的 {{count}} 个锁定章节。',
    discount: '五折优惠',
    cancel: '取消',
    confirm: '确认购买',
    processing: '处理中...',
    close: '关闭购买确认',
    updatedPrice: '章节数量或价格已变化，请重新确认。',
    insufficient: '钻石余额不足。',
    topUp: '充值钻石',
    expired: '该优惠已变更，请查看最新优惠。',
    failed: '购买失败，请重试。',
    purchased: '章节解锁成功！',
    alreadyOwned: '您已经解锁了这些章节。',
    readStory: '阅读故事',
    slide: '第 {{count}} 本',
  },
  ja: {
    confirmTitle: '特別キャンペーンの購入確認',
    confirmDescription: 'ダイヤモンドでロック中の {{count}} 話を解放します。',
    discount: '50%オフ',
    cancel: 'キャンセル',
    confirm: '購入を確定',
    processing: '処理中...',
    close: '購入確認を閉じる',
    updatedPrice: '話数または価格が変更されました。新しい価格を確認してください。',
    insufficient: 'ダイヤモンドが不足しています。',
    topUp: 'ダイヤモンドをチャージ',
    expired: 'このキャンペーンは変更されました。内容をご確認ください。',
    failed: '購入できませんでした。もう一度お試しください。',
    purchased: 'エピソードを解放しました！',
    alreadyOwned: 'すべてのエピソードを解放済みです。',
    readStory: 'ストーリーを読む',
    slide: '作品 {{count}}',
  },
  ko: {
    confirmTitle: '특별 프로모션 구매 확인',
    confirmDescription: '다이아몬드로 잠긴 에피소드 {{count}}개를 해제합니다.',
    discount: '50% 할인',
    cancel: '취소',
    confirm: '구매 확인',
    processing: '처리 중...',
    close: '구매 확인 닫기',
    updatedPrice: '에피소드 수 또는 가격이 변경되었습니다. 새로운 가격을 확인해 주세요.',
    insufficient: '다이아몬드가 부족합니다.',
    topUp: '다이아몬드 충전',
    expired: '프로모션이 변경되었습니다. 최신 정보를 확인해 주세요.',
    failed: '구매하지 못했습니다. 다시 시도해 주세요.',
    purchased: '에피소드를 해제했습니다!',
    alreadyOwned: '이미 모든 에피소드를 해제했습니다.',
    readStory: '스토리 읽기',
    slide: '이야기 {{count}}',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://shadow-backend-kucw.onrender.com'

const VISIT_STORAGE_KEY = 'shadow_discover_special_promotion_slide_v2'
const PURCHASED_STORAGE_PREFIX = 'shadow_discover_special_promotion_purchased_v1'
const RETRY_DELAY_MS = 30 * 1000

function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function getPurchasedStorageKey(rotationKey) {
  const token = getReaderToken()
  if (!rotationKey || !token) return ''
  let hash = 2166136261
  for (let index = 0; index < token.length; index += 1) {
    hash = Math.imul(hash ^ token.charCodeAt(index), 16777619)
  }
  return `${PURCHASED_STORAGE_PREFIX}:${rotationKey}:${(hash >>> 0).toString(36)}`
}

function readPurchasedPromotionIds(rotationKey) {
  const key = getPurchasedStorageKey(rotationKey)
  if (!key) return new Set()
  try {
    const values = JSON.parse(sessionStorage.getItem(key) || '[]')
    return new Set(Array.isArray(values) ? values.map(String) : [])
  } catch {
    return new Set()
  }
}

function savePurchasedPromotionIds(rotationKey, ids) {
  const key = getPurchasedStorageKey(rotationKey)
  if (!key) return
  try {
    sessionStorage.setItem(key, JSON.stringify([...ids]))
  } catch {}
}

function readCachedRotation() {
  return getSmartPromotionCache(getStoryLanguageId())
}

async function loadActivePromotions(force = false) {
  const language = getStoryLanguageId()
  const result = await loadSmartPromotionShelf({ force, language })
  return getStoryLanguageId() === language ? result : null
}

function nextInitialSlide(rotationKey, count) {
  if (!count) return 0
  let currentIndex = 0
  const visitKey = `${VISIT_STORAGE_KEY}:${getSmartAdReaderKey()}:${getStoryLanguageId()}`

  try {
    const prior = JSON.parse(localStorage.getItem(visitKey) || '{}')
    if (prior.rotationKey === rotationKey && Number.isInteger(prior.nextIndex)) {
      currentIndex = ((prior.nextIndex % count) + count) % count
    }
    localStorage.setItem(visitKey, JSON.stringify({
      rotationKey,
      nextIndex: (currentIndex + 1) % count,
    }))
  } catch {}

  return currentIndex
}

export default function DiscoverSpecialPromotionSection() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const purchaseInFlightRef = useRef(false)
  const touchStartRef = useRef(null)
  const mouseDragRef = useRef(null)
  const suppressMouseClickUntilRef = useRef(0)
  const initializedRotationRef = useRef('')
  const expiryReloadRef = useRef(0)
  const readerScopeRef = useRef(`${getSmartAdReaderKey()}:${getStoryLanguageId()}`)
  const [rotation, setRotation] = useState(() => readCachedRotation())
  const [activeIndex, setActiveIndex] = useState(0)
  const [now, setNow] = useState(Date.now())
  const [quote, setQuote] = useState(null)
  const [purchaseBusy, setPurchaseBusy] = useState(false)
  const [purchaseError, setPurchaseError] = useState('')
  const [needsTopUp, setNeedsTopUp] = useState(false)
  const [notice, setNotice] = useState('')
  const [purchasedStoryId, setPurchasedStoryId] = useState('')
  const [purchasedStoryIds, setPurchasedStoryIds] = useState(() => readPurchasedPromotionIds(readCachedRotation()?.rotationKey))

  useEffect(() => {
    let mounted = true
    const requestScope = readerScopeRef.current

    loadActivePromotions().then((result) => {
      if (mounted && readerScopeRef.current === requestScope) setRotation(result)
    })

    return () => {
      mounted = false
    }
  }, [])

  const rotationKey = rotation?.rotationKey ? `${readerScopeRef.current}:${rotation.rotationKey}` : ''
  const promotionCount = rotation?.promotions?.length || 0

  useEffect(() => {
    if (!rotationKey || !promotionCount || initializedRotationRef.current === rotationKey) return
    initializedRotationRef.current = rotationKey
    setActiveIndex(nextInitialSlide(rotationKey, promotionCount))
    setPurchasedStoryId('')
    setPurchasedStoryIds(readPurchasedPromotionIds(rotationKey))
  }, [rotationKey, promotionCount])

  useEffect(() => {
    let mounted = true

    function tick() {
      const currentTime = Date.now()
      if (!mounted) return
      setNow(currentTime)
      const nextScope = `${getSmartAdReaderKey()}:${getStoryLanguageId()}`
      if (readerScopeRef.current !== nextScope) {
        readerScopeRef.current = nextScope
        initializedRotationRef.current = ''
        expiryReloadRef.current = currentTime
        setQuote(null)
        setPurchasedStoryId('')
        setPurchasedStoryIds(new Set())
        setRotation(readCachedRotation())
        void loadActivePromotions().then((updated) => {
          if (mounted && readerScopeRef.current === nextScope) setRotation(updated)
        })
        return
      }

      if (
        (!rotation?.expiresAt || currentTime >= rotation.expiresAt) &&
        currentTime - expiryReloadRef.current >= RETRY_DELAY_MS
      ) {
        expiryReloadRef.current = currentTime
        loadActivePromotions(true).then((updated) => {
          if (mounted && readerScopeRef.current === nextScope && updated?.expiresAt > Date.now()) {
            setRotation(updated)
          }
        })
      }
    }

    const interval = window.setInterval(tick, 1000)
    document.addEventListener('visibilitychange', tick)
    return () => {
      mounted = false
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [rotation?.expiresAt])

  function startPurchase(offer) {
    if (!getReaderToken()) {
      navigate('/login')
      return
    }

    if (purchaseInFlightRef.current || !rotation || rotation.expiresAt <= Date.now()) return

    const storyId = offer?.story_id || offer?.story?.id
    const price = Number(offer?.discounted_price_diamonds)
    const offerToken = String(offer?.offer_token || '')

    if (!storyId || !Number.isSafeInteger(price) || price < 1 || !offerToken.startsWith('sp1.')) {
      setNotice(t('discoverSpecialPromotionCheckout.failed'))
      return
    }

    setNotice('')
    setPurchaseError('')
    setNeedsTopUp(false)
    setQuote({
      storyId,
      title: offer.story_title || offer.title || '',
      count: Number(offer.locked_episode_count || 0),
      originalPrice: Number(offer.original_price_diamonds || 0),
      storyLanguage: String(offer.story_language || getStoryLanguageId()),
      offerToken,
      price,
    })
  }

  function closePurchase() {
    if (purchaseInFlightRef.current) return
    setQuote(null)
    setPurchaseError('')
    setNeedsTopUp(false)
  }

  async function confirmPurchase() {
    if (!quote || purchaseInFlightRef.current) return

    const token = getReaderToken()

    if (!token) {
      closePurchase()
      navigate('/login')
      return
    }

    purchaseInFlightRef.current = true
    setPurchaseBusy(true)
    setPurchaseError('')
    setNeedsTopUp(false)

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/unlocks/stories/${encodeURIComponent(quote.storyId)}/special-promotion`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            expected_price_diamonds: quote.price,
            purchase_source: 'discover',
            story_language: quote.storyLanguage,
            offer_token: quote.offerToken,
          }),
        }
      )

      const result = await response.json().catch(() => ({}))

      if (response.status === 401) {
        setQuote(null)
        navigate('/login')
        return
      }

      if (response.status === 409 && result.code === 'PRICE_CONFIRMATION_REQUIRED') {
        const updatedPrice = Number(result.discounted_price_diamonds)
        const updatedCount = Number(result.locked_episode_count)
        const originalPrice = Number(result.original_price_diamonds)
        const updatedOfferToken = String(result.offer_token || '')

        if (!Number.isSafeInteger(updatedPrice) || updatedPrice < 1 ||
            !updatedOfferToken.startsWith('sp1.')) {
          setPurchaseError(t('discoverSpecialPromotionCheckout.failed'))
          return
        }

        setQuote((current) => current && ({
          ...current,
          price: updatedPrice,
          count: Number.isFinite(updatedCount) ? updatedCount : current.count,
          originalPrice: Number.isFinite(originalPrice) ? originalPrice : current.originalPrice,
          offerToken: updatedOfferToken,
        }))
        setPurchaseError(t('discoverSpecialPromotionCheckout.updatedPrice'))
        return
      }

      if (response.status === 402 || result.code === 'INSUFFICIENT_DIAMONDS') {
        setPurchaseError(t('discoverSpecialPromotionCheckout.insufficient'))
        setNeedsTopUp(true)
        return
      }

      if (response.status === 409 && [
        'PROMOTION_EXPIRED',
        'PROMOTION_CHANGED',
        'PROMOTION_PRICE_CHANGED',
        'STORY_UNAVAILABLE',
        'AUTHOR_UNAVAILABLE',
      ].includes(result.code)) {
        setQuote(null)
        setNotice(t('discoverSpecialPromotionCheckout.expired'))
        clearSmartPromotionCache(getStoryLanguageId())
        const updatedRotation = await loadActivePromotions(true)
        setRotation(updatedRotation)
        return
      }

      if (!response.ok || result.ok === false) {
        setPurchaseError(t('discoverSpecialPromotionCheckout.failed'))
        return
      }

      setQuote(null)
      setPurchasedStoryId(quote.storyId)
      const nextPurchasedStoryIds = new Set(purchasedStoryIds)
      nextPurchasedStoryIds.add(String(quote.storyId))
      setPurchasedStoryIds(nextPurchasedStoryIds)
      savePurchasedPromotionIds(rotationKey, nextPurchasedStoryIds)
      clearSmartPromotionCache(getStoryLanguageId())
      void loadActivePromotions(true).then((updated) => {
        if (updated && readerScopeRef.current === `${getSmartAdReaderKey()}:${getStoryLanguageId()}`) {
          setRotation(updated)
        }
      })
      setNotice(
        t(
          result.already_owned
            ? 'discoverSpecialPromotionCheckout.alreadyOwned'
            : 'discoverSpecialPromotionCheckout.purchased'
        )
      )

      if (result.wallet) {
        window.dispatchEvent(
          new CustomEvent('shadow-wallet-updated', { detail: result.wallet })
        )
      }
    } catch {
      setPurchaseError(t('discoverSpecialPromotionCheckout.failed'))
    } finally {
      purchaseInFlightRef.current = false
      setPurchaseBusy(false)
    }
  }

  const promotions = rotation?.promotions || []
  const visibleIndex = promotions.length ? activeIndex % promotions.length : 0
  const promotion = promotions[visibleIndex] || null
  const storyId = promotion?.story_id || promotion?.story?.id
  const remainingSeconds = rotation?.expiresAt
    ? Math.max(0, Math.ceil((rotation.expiresAt - now) / 1000))
    : 0

  function changeSlide(direction) {
    if (promotions.length < 2 || purchaseInFlightRef.current || quote) return
    setActiveIndex((index) => (index + direction + promotions.length) % promotions.length)
  }

  function handleTouchStart(event) {
    const touch = event.touches?.[0]
    if (touch) touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }

  function handleTouchEnd(event) {
    const start = touchStartRef.current
    touchStartRef.current = null
    const touch = event.changedTouches?.[0]
    if (!start || !touch) return
    const deltaX = touch.clientX - start.x
    const deltaY = touch.clientY - start.y
    if (Math.abs(deltaX) < 38 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.2) return
    changeSlide(deltaX < 0 ? 1 : -1)
  }

  function handleMousePointerDown(event) {
    if (
      event.pointerType !== 'mouse' ||
      event.button !== 0 ||
      promotions.length < 2 ||
      purchaseInFlightRef.current ||
      quote
    ) return

    mouseDragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      captured: false,
    }
  }

  function handleMousePointerMove(event) {
    const start = mouseDragRef.current
    if (!start || start.pointerId !== event.pointerId || !(event.buttons & 1)) return

    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (!start.captured && Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      try {
        event.currentTarget.setPointerCapture(event.pointerId)
        start.captured = true
      } catch {}
    }
  }

  function handleMousePointerUp(event) {
    const start = mouseDragRef.current
    if (!start || start.pointerId !== event.pointerId) return
    mouseDragRef.current = null

    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    const didSwipe = Math.abs(dx) >= 38 && Math.abs(dx) > Math.abs(dy) * 1.2

    if (didSwipe) {
      suppressMouseClickUntilRef.current = Date.now() + 450
      changeSlide(dx < 0 ? 1 : -1)
    }

    if (start.captured) {
      try {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId)
        }
      } catch {}
    }
  }

  function handleMouseClickCapture(event) {
    if (Date.now() >= suppressMouseClickUntilRef.current) return
    suppressMouseClickUntilRef.current = 0
    event.preventDefault()
    event.stopPropagation()
  }

  if (!promotion && !notice) return null

  return (
    <>
      {promotion ? (
        <div
          className="min-w-0 cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onPointerDown={handleMousePointerDown}
          onPointerMove={handleMousePointerMove}
          onPointerUp={handleMousePointerUp}
          onPointerCancel={() => { mouseDragRef.current = null }}
          onClickCapture={handleMouseClickCapture}
          onDragStart={(event) => event.preventDefault()}
          style={{ touchAction: 'pan-y', userSelect: 'none' }}
        >
          <DiscoverSpecialPromotionCard
            key={storyId}
            promotion={promotion}
            purchasing={purchaseBusy || remainingSeconds <= 0}
            remainingSeconds={remainingSeconds}
            slideCount={promotions.length}
            activeSlide={visibleIndex}
            onSelectSlide={(index) => {
              if (!purchaseInFlightRef.current && !quote) setActiveIndex(index)
            }}
            onBuy={startPurchase}
            isPurchased={purchasedStoryIds.has(String(storyId || ''))}
            onRead={() => storyId && navigate(`/story/${encodeURIComponent(storyId)}`)}
            onOpen={
              storyId
                ? () => navigate(`/story/${encodeURIComponent(storyId)}`)
                : undefined
            }
          />
        </div>
      ) : null}

      {notice ? (
        <div className="border border-[#e5d9ee] bg-white px-4 py-3 text-[12px] font-medium text-[#25142f] dark:border-white/10 dark:bg-[var(--shadow-bg-surface)] dark:text-white sm:rounded-xl" role="status">
          <p>{notice}</p>
          {purchasedStoryId ? (
            <button
              type="button"
              onClick={() => navigate(`/story/${encodeURIComponent(purchasedStoryId)}`)}
              className="mt-2 rounded-full border border-[#d6a343] bg-[#101010] px-4 py-2 text-[11px] font-bold text-white"
            >
              {t('discoverSpecialPromotionCheckout.readStory')}
            </button>
          ) : null}
        </div>
      ) : null}

      {quote ? (
        <SpecialPromotionCheckoutSheet
          quote={quote}
          busy={purchaseBusy}
          error={purchaseError}
          needsTopUp={needsTopUp}
          onClose={closePurchase}
          onConfirm={confirmPurchase}
          onTopUp={() => navigate('/shop/mall/purchase')}
          labels={{
            title: t('discoverSpecialPromotionCheckout.confirmTitle'),
            description: t('discoverSpecialPromotionCheckout.confirmDescription', { count: quote.count }),
            close: t('discoverSpecialPromotionCheckout.close'),
            cancel: t('discoverSpecialPromotionCheckout.cancel'),
            confirm: t('discoverSpecialPromotionCheckout.confirm'),
            processing: t('discoverSpecialPromotionCheckout.processing'),
            topUp: t('discoverSpecialPromotionCheckout.topUp'),
          }}
        />
      ) : null}
    </>
  )
}
