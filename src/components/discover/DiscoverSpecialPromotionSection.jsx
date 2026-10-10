import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Gem, LockKeyhole, X } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import DiscoverSpecialPromotionCard from './DiscoverSpecialPromotionCard'

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
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://shadow-backend-kucw.onrender.com'

const CACHE_DURATION_MS = 5 * 60 * 1000

let cachedPromotion = null
let lastRequestAt = 0
let pendingRequest = null

function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatDiamonds(value) {
  return Number(value || 0).toLocaleString('en-US', {
    maximumFractionDigits: 0,
  })
}

async function loadActivePromotion(force = false) {
  if (!force && Date.now() - lastRequestAt < CACHE_DURATION_MS) {
    return cachedPromotion
  }

  if (pendingRequest) return pendingRequest

  pendingRequest = (async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/public/discover-special-promotion/active`,
        { headers: { Accept: 'application/json' }, cache: 'no-store' }
      )

      if (!response.ok) {
        throw new Error('Promotion unavailable')
      }

      const payload = await response.json()

      if (payload?.ok === false) {
        throw new Error('Promotion unavailable')
      }

      cachedPromotion =
        payload?.promotion && typeof payload.promotion === 'object'
          ? payload.promotion
          : null

      lastRequestAt = Date.now()
      return cachedPromotion
    } catch {
      lastRequestAt = Date.now()
      return cachedPromotion
    } finally {
      pendingRequest = null
    }
  })()

  return pendingRequest
}

export default function DiscoverSpecialPromotionSection() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const purchaseInFlightRef = useRef(false)
  const [promotion, setPromotion] = useState(
    () =>
      Date.now() - lastRequestAt < CACHE_DURATION_MS
        ? cachedPromotion
        : null
  )
  const [quote, setQuote] = useState(null)
  const [purchaseBusy, setPurchaseBusy] = useState(false)
  const [purchaseError, setPurchaseError] = useState('')
  const [needsTopUp, setNeedsTopUp] = useState(false)
  const [notice, setNotice] = useState('')
  const [purchasedStoryId, setPurchasedStoryId] = useState('')

  useEffect(() => {
    let mounted = true

    loadActivePromotion().then((result) => {
      if (mounted) setPromotion(result)
    })

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!quote) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleEscape(event) {
      if (event.key === 'Escape' && !purchaseInFlightRef.current) {
        setQuote(null)
        setPurchaseError('')
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = previousOverflow
    }
  }, [quote])

  function startPurchase(offer) {
    if (!getReaderToken()) {
      navigate('/login')
      return
    }

    if (purchaseInFlightRef.current) return

    const storyId = offer?.story_id || offer?.story?.id
    const price = Number(offer?.discounted_price_diamonds)

    if (!storyId || !Number.isSafeInteger(price) || price < 1) {
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
          body: JSON.stringify({ expected_price_diamonds: quote.price }),
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

        if (!Number.isSafeInteger(updatedPrice) || updatedPrice < 1) {
          setPurchaseError(t('discoverSpecialPromotionCheckout.failed'))
          return
        }

        setQuote((current) => current && ({
          ...current,
          price: updatedPrice,
          count: Number.isFinite(updatedCount) ? updatedCount : current.count,
          originalPrice: Number.isFinite(originalPrice) ? originalPrice : current.originalPrice,
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
        const updatedPromotion = await loadActivePromotion(true)
        setPromotion(updatedPromotion)
        return
      }

      if (!response.ok || result.ok === false) {
        setPurchaseError(t('discoverSpecialPromotionCheckout.failed'))
        return
      }

      setQuote(null)
      setPurchasedStoryId(quote.storyId)
      setNotice(
        t(
          result.already_owned
            ? 'discoverSpecialPromotionCheckout.alreadyOwned'
            : 'discoverSpecialPromotionCheckout.purchased'
        )
      )
      cachedPromotion = null
      lastRequestAt = Date.now()
      setPromotion(null)

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

  const storyId = promotion?.story_id || promotion?.story?.id

  if (!promotion && !notice) return null

  return (
    <>
      {promotion ? (
        <DiscoverSpecialPromotionCard
          promotion={promotion}
          purchasing={purchaseBusy}
          onBuy={startPurchase}
          onOpen={
            storyId
              ? () => navigate(`/story/${encodeURIComponent(storyId)}`)
              : undefined
          }
        />
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
        <div
          className="fixed inset-0 z-[1000000] flex items-end justify-center bg-black/50 sm:items-center sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-label={t('discoverSpecialPromotionCheckout.confirmTitle')}
        >
          <button
            type="button"
            aria-label={t('discoverSpecialPromotionCheckout.close')}
            className="absolute inset-0 cursor-default"
            disabled={purchaseBusy}
            onClick={closePurchase}
          />

          <div className="relative z-10 w-full max-w-[410px] rounded-t-[22px] bg-white px-5 pb-7 pt-5 text-[#25142f] shadow-2xl dark:bg-[#241d2b] dark:text-white sm:rounded-[22px] sm:pb-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-[16px] font-extrabold leading-snug">
                {t('discoverSpecialPromotionCheckout.confirmTitle')}
              </h2>
              <button
                type="button"
                aria-label={t('discoverSpecialPromotionCheckout.close')}
                onClick={closePurchase}
                disabled={purchaseBusy}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 disabled:opacity-40 dark:bg-white/10 dark:text-white"
              >
                <X size={17} aria-hidden="true" />
              </button>
            </div>

            <p className="mt-3 text-[14px] font-bold leading-relaxed">{quote.title}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-gray-500 dark:text-white/60">
              {t('discoverSpecialPromotionCheckout.confirmDescription', { count: quote.count })}
            </p>

            <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1 text-[12px] text-gray-400 line-through dark:text-white/40">
                  <Gem size={13} aria-hidden="true" />
                  {formatDiamonds(quote.originalPrice)}
                </span>
                <span className="rounded-lg bg-red-600 px-2 py-1 text-[11px] font-extrabold text-white">
                  -50%
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-[22px] font-black">
                <Gem size={20} className="text-[#38aadb]" aria-hidden="true" />
                {formatDiamonds(quote.price)}
                <span className="ml-auto text-[11px] font-semibold text-gray-500 dark:text-white/60">
                  <LockKeyhole size={12} className="mr-1 inline" aria-hidden="true" />
                  {quote.count}
                </span>
              </div>
            </div>

            {purchaseError ? (
              <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-[12px] text-red-700 dark:bg-red-950/40 dark:text-red-200" role="alert">
                {purchaseError}
              </p>
            ) : null}

            {needsTopUp ? (
              <button
                type="button"
                onClick={() => navigate('/shop/mall/purchase')}
                className="mt-3 w-full rounded-full border border-[#d6a343] bg-white px-3 py-2.5 text-[12px] font-bold text-[#25142f] dark:bg-white/10 dark:text-white"
              >
                {t('discoverSpecialPromotionCheckout.topUp')}
              </button>
            ) : null}

            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                disabled={purchaseBusy}
                onClick={closePurchase}
                className="flex-1 rounded-full border border-gray-200 px-3 py-3 text-[12px] font-bold disabled:opacity-50 dark:border-white/20"
              >
                {t('discoverSpecialPromotionCheckout.cancel')}
              </button>
              <button
                type="button"
                disabled={purchaseBusy}
                onClick={confirmPurchase}
                className="flex-[1.4] rounded-full border-[1.5px] border-[#d6a343] bg-[#101010] px-3 py-3 text-[12px] font-bold text-white disabled:opacity-50"
              >
                {purchaseBusy
                  ? t('discoverSpecialPromotionCheckout.processing')
                  : t('discoverSpecialPromotionCheckout.confirm')}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
