import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SpecialPromotionCheckoutSheet from './SpecialPromotionCheckoutSheet'
import PromotionBookShelf from '../PromotionBookShelf'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { clearSmartPromotionCache } from '../../services/smartPromotionClient'

registerTranslationNamespace('storyShelfCheckout', {
  en: {
    title: 'Confirm Special Promotion', description: 'Unlock {{count}} locked episodes with Diamonds.',
    cancel: 'Cancel', confirm: 'Confirm Purchase', processing: 'Processing...',
    changed: 'The price or episodes changed. Confirm the updated offer.',
    expired: 'This promotion changed or expired. Please review the new offer.',
    insufficient: 'Not enough Diamonds.', topUp: 'Top Up Diamonds',
    failed: 'Purchase failed. Please try again.', purchased: 'Episodes unlocked successfully!',
    owned: 'All these episodes are already unlocked.', read: 'Read Story', close: 'Close',
  },
  km: {
    title: 'បញ្ជាក់ការទិញប្រូម៉ូសិន', description: 'ដោះសោ {{count}} ភាគដោយប្រើ Diamonds។',
    cancel: 'បោះបង់', confirm: 'បញ្ជាក់ការទិញ', processing: 'កំពុងដំណើរការ...',
    changed: 'តម្លៃ ឬចំនួនភាគបានផ្លាស់ប្តូរ។ សូមបញ្ជាក់ម្តងទៀត។',
    expired: 'ប្រូម៉ូសិនបានផ្លាស់ប្តូរ ឬផុតកំណត់។ សូមមើលការផ្តល់ជូនថ្មី។',
    insufficient: 'ពេជ្រមិនគ្រប់គ្រាន់ទេ។', topUp: 'ទិញពេជ្រ',
    failed: 'ទិញមិនបាន។ សូមសាកល្បងម្តងទៀត។', purchased: 'ដោះសោភាគបានជោគជ័យ!',
    owned: 'អ្នកបានដោះសោភាគទាំងនេះរួចហើយ។', read: 'អានរឿង', close: 'បិទ',
  },
  zh: {
    title: '确认特别优惠', description: '使用钻石解锁 {{count}} 个章节。',
    cancel: '取消', confirm: '确认购买', processing: '处理中...',
    changed: '章节数量或价格已变化，请确认最新价格。',
    expired: '优惠已变化或过期，请查看最新优惠。',
    insufficient: '钻石不足。', topUp: '充值钻石',
    failed: '购买失败，请重试。', purchased: '章节解锁成功！',
    owned: '这些章节已全部解锁。', read: '阅读故事', close: '关闭',
  },
  ja: {
    title: '特別セールの購入確認', description: 'ダイヤモンドで {{count}} 話を解放します。',
    cancel: 'キャンセル', confirm: '購入を確定', processing: '処理中...',
    changed: '価格または話数が変更されました。新しい内容をご確認ください。',
    expired: 'セールは変更または終了しました。最新情報をご確認ください。',
    insufficient: 'ダイヤモンドが不足しています。', topUp: 'チャージ',
    failed: '購入できませんでした。もう一度お試しください。', purchased: 'エピソードを解放しました！',
    owned: 'これらのエピソードは解放済みです。', read: 'ストーリーを読む', close: '閉じる',
  },
  ko: {
    title: '특별 프로모션 구매 확인', description: '다이아몬드로 {{count}}개 에피소드를 해제합니다.',
    cancel: '취소', confirm: '구매 확인', processing: '처리 중...',
    changed: '가격이나 에피소드 수가 변경되었습니다. 다시 확인해 주세요.',
    expired: '프로모션이 변경되거나 만료되었습니다. 최신 내용을 확인해 주세요.',
    insufficient: '다이아몬드가 부족합니다.', topUp: '충전',
    failed: '구매 실패. 다시 시도해 주세요.', purchased: '에피소드가 해제되었습니다!',
    owned: '이미 모든 에피소드를 해제했습니다.', read: '스토리 읽기', close: '닫기',
  },
})

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://shadow-backend-kucw.onrender.com'
const PURCHASED_PREFIX = 'shadow_discover_special_promotion_purchased_v1'

function readerToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function purchasedKey(rotationKey) {
  const token = readerToken()
  if (!token || !rotationKey) return ''
  let hash = 2166136261
  for (let index = 0; index < token.length; index += 1) {
    hash = Math.imul(hash ^ token.charCodeAt(index), 16777619)
  }
  return `${PURCHASED_PREFIX}:${rotationKey}:${(hash >>> 0).toString(36)}`
}

function readPurchased(rotationKey) {
  try {
    const key = purchasedKey(rotationKey)
    if (!key) return new Set()
    const result = JSON.parse(sessionStorage.getItem(key) || '[]')
    return new Set(Array.isArray(result) ? result.map(String) : [])
  } catch {
    return new Set()
  }
}

function savePurchased(rotationKey, ids) {
  try {
    const key = purchasedKey(rotationKey)
    if (key) sessionStorage.setItem(key, JSON.stringify([...ids]))
  } catch {}
}

export default function StoryPromotionShelf({ rotation, remainingSeconds = 0, onStale }) {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const inFlightRef = useRef(false)
  const [quote, setQuote] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [needsTopUp, setNeedsTopUp] = useState(false)
  const [notice, setNotice] = useState('')
  const [purchasedStoryId, setPurchasedStoryId] = useState('')
  const [purchasedIds, setPurchasedIds] = useState(() => readPurchased(rotation?.rotationKey))
  const rotationKey = rotation?.rotationKey || ''

  useEffect(() => {
    setPurchasedIds(readPurchased(rotationKey))
    setNotice('')
    setPurchasedStoryId('')
  }, [rotationKey])

  function openStory(offer) {
    const storyId = String(offer?.story_id || '').trim()
    if (storyId) navigate(`/story/${encodeURIComponent(storyId)}`)
  }

  function startPurchase(offer) {
    if (!readerToken()) {
      navigate('/login')
      return
    }
    if (inFlightRef.current || remainingSeconds <= 0) return
    const storyId = String(offer?.story_id || '').trim()
    const price = Number(offer?.discounted_price_diamonds)
    const offerToken = String(offer?.offer_token || '')
    if (!storyId || !Number.isSafeInteger(price) || price < 1) return
    if (rotation?.personalized && !offerToken.startsWith('sp1.')) {
      setNotice(t('storyShelfCheckout.expired'))
      onStale?.()
      return
    }
    setError('')
    setNotice('')
    setNeedsTopUp(false)
    setQuote({
      storyId,
      title: String(offer.story_title || offer.title || ''),
      count: Number(offer.locked_episode_count || 0),
      originalPrice: Number(offer.original_price_diamonds || 0),
      storyLanguage: String(offer.story_language || '').trim(),
      offerToken,
      price,
    })
  }

  function closePurchase() {
    if (inFlightRef.current) return
    setQuote(null)
    setError('')
    setNeedsTopUp(false)
  }

  async function confirmPurchase() {
    if (!quote || inFlightRef.current) return
    const token = readerToken()
    if (!token) {
      closePurchase()
      navigate('/login')
      return
    }
    inFlightRef.current = true
    setBusy(true)
    setError('')
    setNeedsTopUp(false)
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/unlocks/stories/${encodeURIComponent(quote.storyId)}/special-promotion`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            expected_price_diamonds: quote.price,
            purchase_source: window.location.pathname === '/manga' ? 'manga' : 'stories',
            ...(quote.storyLanguage ? { story_language: quote.storyLanguage } : {}),
            ...(quote.offerToken ? { offer_token: quote.offerToken } : {}),
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
        const updatedOriginal = Number(result.original_price_diamonds)
        const updatedOfferToken = String(result.offer_token || '')
        if (!Number.isSafeInteger(updatedPrice) || updatedPrice < 1 ||
            !Number.isSafeInteger(updatedCount) || updatedCount < 1 ||
            !Number.isSafeInteger(updatedOriginal) || updatedOriginal < updatedPrice ||
            (quote.offerToken && !updatedOfferToken.startsWith('sp1.'))) {
          setQuote(null)
          setNotice(t('storyShelfCheckout.expired'))
          onStale?.()
          return
        }
        setQuote((current) => current && ({
          ...current,
          price: updatedPrice,
          count: updatedCount,
          originalPrice: updatedOriginal,
          offerToken: current.offerToken ? updatedOfferToken : '',
        }))
        setError(t('storyShelfCheckout.changed'))
        return
      }
      if (response.status === 402 || result.code === 'INSUFFICIENT_DIAMONDS') {
        setError(t('storyShelfCheckout.insufficient'))
        setNeedsTopUp(true)
        return
      }
      if (response.status === 409 && [
        'PROMOTION_EXPIRED', 'PROMOTION_CHANGED', 'PROMOTION_PRICE_CHANGED',
        'STORY_UNAVAILABLE', 'AUTHOR_UNAVAILABLE',
      ].includes(result.code)) {
        setQuote(null)
        setNotice(t('storyShelfCheckout.expired'))
        onStale?.()
        return
      }
      if (!response.ok || result.ok === false) {
        const errorCode =
          typeof result?.code === 'string' &&
          /^[A-Z0-9_]{3,64}$/.test(result.code)
            ? result.code
            : `HTTP_${response.status}`

        console.error('SPECIAL_PROMOTION_PURCHASE_FAILED', {
          status: response.status,
          code: errorCode,
        })

        setError(`${t('storyShelfCheckout.failed')} (${errorCode})`)
        return
      }
      const next = new Set(purchasedIds)
      next.add(quote.storyId)
      setPurchasedIds(next)
      savePurchased(rotationKey, next)
      setPurchasedStoryId(quote.storyId)
      setNotice(t(result.already_owned ? 'storyShelfCheckout.owned' : 'storyShelfCheckout.purchased'))
      setQuote(null)
      if (result.wallet) {
        window.dispatchEvent(new CustomEvent('shadow-wallet-updated', { detail: result.wallet }))
      }
      if (rotation?.personalized) {
        clearSmartPromotionCache(rotation.language)
        onStale?.()
      }
    } catch (error) {
      console.error('SPECIAL_PROMOTION_REQUEST_ERROR', error)
      setError(`${t('storyShelfCheckout.failed')} (REQUEST_ERROR)`)
    } finally {
      inFlightRef.current = false
      setBusy(false)
    }
  }

  return (
    <>
      <PromotionBookShelf
        kind="story"
        offers={rotation?.promotions || []}
        remainingSeconds={remainingSeconds}
        onBuy={startPurchase}
        onRead={openStory}
        isPurchased={(offer) => purchasedIds.has(String(offer.story_id))}
      />
      {notice ? (
        <div className="mx-3 mt-2 rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3 text-[12px] font-medium text-[var(--shadow-text-primary)]" role="status">
          <span>{notice}</span>
          {purchasedStoryId ? (
            <button type="button" onClick={() => openStory({ story_id: purchasedStoryId })} className="ml-2 font-bold text-[#af7c1b] dark:text-[#f4c46c]">
              {t('storyShelfCheckout.read')}
            </button>
          ) : null}
        </div>
      ) : null}
      {quote ? (
        <SpecialPromotionCheckoutSheet
          quote={quote}
          busy={busy}
          error={error}
          needsTopUp={needsTopUp}
          onClose={closePurchase}
          onConfirm={confirmPurchase}
          onTopUp={() => navigate('/shop/mall/purchase')}
          labels={{
            title: t('storyShelfCheckout.title'),
            description: t('storyShelfCheckout.description', { count: quote.count }),
            close: t('storyShelfCheckout.close'),
            cancel: t('storyShelfCheckout.cancel'),
            confirm: t('storyShelfCheckout.confirm'),
            processing: t('storyShelfCheckout.processing'),
            topUp: t('storyShelfCheckout.topUp'),
          }}
        />
      ) : null}
    </>
  )
}
