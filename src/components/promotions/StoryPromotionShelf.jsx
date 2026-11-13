import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Gem, LockKeyhole, X } from 'lucide-react'
import PromotionBookShelf from '../PromotionBookShelf'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

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

function diamonds(value) {
  return Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })
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

  useEffect(() => {
    if (!quote) return undefined
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !inFlightRef.current) setQuote(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [quote])

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
    if (!storyId || !Number.isSafeInteger(price) || price < 1) return
    setError('')
    setNotice('')
    setNeedsTopUp(false)
    setQuote({
      storyId,
      title: String(offer.story_title || offer.title || ''),
      count: Number(offer.locked_episode_count || 0),
      originalPrice: Number(offer.original_price_diamonds || 0),
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
          body: JSON.stringify({ expected_price_diamonds: quote.price, purchase_source: 'stories_manga' }),
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
        if (!Number.isSafeInteger(updatedPrice) || updatedPrice < 1) {
          setError(t('storyShelfCheckout.failed'))
          return
        }
        setQuote((current) => current && ({
          ...current,
          price: updatedPrice,
          count: Number(result.locked_episode_count ?? current.count),
          originalPrice: Number(result.original_price_diamonds ?? current.originalPrice),
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
        setError(t('storyShelfCheckout.failed'))
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
    } catch {
      setError(t('storyShelfCheckout.failed'))
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
        <div className="fixed inset-0 z-[1000000] flex items-end justify-center bg-black/50 sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-label={t('storyShelfCheckout.title')}>
          <button type="button" className="absolute inset-0" onClick={closePurchase} disabled={busy} aria-label={t('storyShelfCheckout.close')} />
          <div className="relative z-10 w-full max-w-[410px] rounded-t-[22px] bg-white p-5 pb-7 text-[#25142f] shadow-2xl dark:bg-[#241d2b] dark:text-white sm:rounded-[22px] sm:pb-5">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-[16px] font-extrabold">{t('storyShelfCheckout.title')}</h2>
              <button type="button" onClick={closePurchase} disabled={busy} className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 disabled:opacity-50 dark:bg-white/10 dark:text-white" aria-label={t('storyShelfCheckout.close')}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-[14px] font-bold">{quote.title}</p>
            <p className="mt-1 text-[12px] text-gray-500 dark:text-white/60">{t('storyShelfCheckout.description', { count: quote.count })}</p>
            <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="line-through text-gray-500 dark:text-white/50"><Gem className="mr-1 inline h-3.5 w-3.5" />{diamonds(quote.originalPrice)}</span>
                <span className="rounded-lg bg-red-600 px-2 py-1 font-extrabold text-white">−50%</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[22px] font-black">
                <Gem className="h-5 w-5 text-[#1baff0]" />{diamonds(quote.price)}
                <span className="ml-auto flex items-center gap-1 text-[11px] text-gray-500 dark:text-white/60"><LockKeyhole className="h-3.5 w-3.5" />{quote.count}</span>
              </div>
            </div>
            {error ? <p className="mt-3 rounded-xl bg-red-50 p-3 text-[12px] text-red-700 dark:bg-red-950/40 dark:text-red-200" role="alert">{error}</p> : null}
            {needsTopUp ? (
              <button type="button" onClick={() => navigate('/shop/mall/purchase')} className="mt-3 w-full rounded-full border border-[#d6a343] px-3 py-2.5 text-[12px] font-bold dark:border-[#d6a343]">
                {t('storyShelfCheckout.topUp')}
              </button>
            ) : null}
            <div className="mt-5 flex gap-2.5">
              <button type="button" onClick={closePurchase} disabled={busy} className="flex-1 rounded-full border border-gray-200 px-3 py-3 text-[12px] font-bold disabled:opacity-50 dark:border-white/20">{t('storyShelfCheckout.cancel')}</button>
              <button type="button" onClick={confirmPurchase} disabled={busy} className="flex-[1.4] rounded-full border-[1.5px] border-[#d6a343] bg-[#101010] px-3 py-3 text-[12px] font-bold text-white disabled:opacity-50">{busy ? t('storyShelfCheckout.processing') : t('storyShelfCheckout.confirm')}</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
