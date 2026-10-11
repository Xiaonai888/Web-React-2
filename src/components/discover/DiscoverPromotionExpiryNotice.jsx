import { useEffect, useState } from 'react'
import { getDisplayLanguageId } from '../../utils/displayLanguage'

const messages = {
  km: 'ប្រូម៉ូសិនសៀវភៅ/PDF ក្នុងរទេះនេះបានផុតកំណត់ហើយ។ តម្លៃចាស់លែងមានសុពលភាព។ សូមលុបផលិតផលដែលផុតកំណត់ចេញ ហើយជ្រើសរើសប្រូម៉ូសិនថ្មីពី Discover មុនបង់ប្រាក់។',
  en: 'A Book/PDF promotion in your cart has expired. The previous discount is no longer valid. Remove the expired item and add an active offer from Discover before paying.',
  zh: '购物车中的图书或 PDF 优惠已过期，原优惠价格不再有效。请移除过期商品，然后从 Discover 重新添加当前优惠再付款。',
  ja: 'カート内の書籍・PDF プロモーションが期限切れです。以前の割引価格は無効です。期限切れの商品を削除し、Discover から現在の特典を追加してください。',
  ko: '장바구니의 도서/PDF 프로모션이 만료되었습니다. 이전 할인가는 더 이상 유효하지 않습니다. 만료된 상품을 삭제한 뒤 Discover에서 새 프로모션을 추가해 주세요.',
}

function hasMarker(item) {
  return item && typeof item === 'object' && (
    Object.prototype.hasOwnProperty.call(item, 'discover_promotion_rotation_key') ||
    Object.prototype.hasOwnProperty.call(item, 'discover_promotion_expires_at')
  )
}

export function isExpiredDiscoverPromotion(item, now = Date.now()) {
  if (!hasMarker(item)) return false
  const expiresAt = Date.parse(String(item.discover_promotion_expires_at || ''))
  return !Number.isFinite(expiresAt) || now >= expiresAt
}

export function hasExpiredDiscoverPromotion(items, now = Date.now()) {
  return Array.isArray(items) && items.some((item) => isExpiredDiscoverPromotion(item, now))
}

export function useDiscoverPromotionExpiry(items) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const futureExpirations = (Array.isArray(items) ? items : [])
      .filter(hasMarker)
      .map((item) => Date.parse(String(item.discover_promotion_expires_at || '')))
      .filter((value) => Number.isFinite(value) && value > Date.now())

    if (!futureExpirations.length) return undefined

    const nextExpiry = Math.min(...futureExpirations)
    const timer = window.setTimeout(
      () => setNow(Date.now()),
      Math.max(1, Math.min(2147483647, nextExpiry - Date.now() + 25))
    )
    return () => window.clearTimeout(timer)
  }, [items, now])

  useEffect(() => {
    const refresh = () => setNow(Date.now())
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])

  return hasExpiredDiscoverPromotion(items, now)
}

export function discoverPromotionExpiryMessage() {
  return messages[getDisplayLanguageId()] || messages.en
}

export default function DiscoverPromotionExpiryNotice({ expired }) {
  if (!expired) return null
  return (
    <div role="alert" className="mb-3 rounded-[18px] border border-red-300 bg-red-50 px-4 py-3 text-[12px] font-semibold leading-5 text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
      {discoverPromotionExpiryMessage()}
    </div>
  )
}
