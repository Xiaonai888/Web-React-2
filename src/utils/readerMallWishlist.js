import {
  getShadowMallWishlist,
  removeShadowMallWishlist,
  toggleShadowMallWishlist,
} from './shadowMallWishlist'

const READER_MALL_WISHLIST_KEY = 'reader_mall_waitlist_v1'
const READER_MALL_WISHLIST_EVENT = 'reader-mall-wishlist-change'

function readLocalItems() {
  try {
    const value = JSON.parse(localStorage.getItem(READER_MALL_WISHLIST_KEY) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function writeLocalItems(items) {
  localStorage.setItem(READER_MALL_WISHLIST_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event(READER_MALL_WISHLIST_EVENT))
}

function normalizeSource(value) {
  return value === 'shadow' ? 'shadow' : 'author'
}

function normalizeReaderMallItem(item) {
  const source = normalizeSource(item?.source)
  const productId = item?.productId ?? item?.id ?? ''
  const sellerId = source === 'shadow' ? 'shadow-mall' : item?.sellerId ?? item?.authorPageId ?? ''

  return {
    source,
    sellerId: String(sellerId || ''),
    productId: String(productId || ''),
    id: productId,
    title: item?.title || 'Untitled book',
    author: item?.author || item?.author_name || 'Unknown author',
    cover: item?.cover || item?.cover_url || '',
    price: item?.price ?? item?.price_usd ?? 0,
    oldPrice: item?.oldPrice ?? item?.old_price_usd ?? '',
    type: item?.type || item?.product_type || 'book',
    status: item?.status || item?.stockStatus || item?.stock_status || 'in_stock',
    pageName: item?.pageName || item?.page_name || '',
    pageUsername: item?.pageUsername || item?.page_username || '',
    authorAvatar: item?.authorAvatar || item?.author_avatar_url || '',
    savedAt: item?.savedAt || new Date().toISOString(),
  }
}

function normalizeShadowItem(item) {
  return normalizeReaderMallItem({
    ...item,
    source: 'shadow',
    sellerId: 'shadow-mall',
    productId: item?.id,
    type: 'book',
  })
}

export function getReaderMallWishlistKey(item) {
  const normalized = normalizeReaderMallItem(item)
  return `${normalized.source}:${normalized.sellerId}:${normalized.productId}`
}

export function getReaderMallWishlist() {
  const authorItems = readLocalItems()
    .map(normalizeReaderMallItem)
    .filter((item) => item.productId && item.source !== 'shadow')
  const shadowItems = getShadowMallWishlist()
    .map(normalizeShadowItem)
    .filter((item) => item.productId)
  const merged = [...authorItems, ...shadowItems]
  const seen = new Set()

  return merged.filter((item) => {
    const key = getReaderMallWishlistKey(item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function getReaderMallWishlistCount() {
  return getReaderMallWishlist().length
}

export function isReaderMallWishlisted(item) {
  const normalized = normalizeReaderMallItem(item)

  if (!normalized.productId) return false

  if (normalized.source === 'shadow') {
    return getShadowMallWishlist().some(
      (entry) => String(entry.id) === String(normalized.productId)
    )
  }

  const key = getReaderMallWishlistKey(normalized)
  return readLocalItems()
    .map(normalizeReaderMallItem)
    .some((entry) => getReaderMallWishlistKey(entry) === key)
}

export function addReaderMallWishlist(item) {
  const normalized = normalizeReaderMallItem(item)

  if (!normalized.productId) return getReaderMallWishlist()

  if (normalized.source === 'shadow') {
    const exists = getShadowMallWishlist().some(
      (entry) => String(entry.id) === String(normalized.productId)
    )

    if (!exists) {
      toggleShadowMallWishlist({
        id: normalized.productId,
        title: normalized.title,
        author: normalized.author,
        cover: normalized.cover,
        price: normalized.price,
        oldPrice: normalized.oldPrice,
        status: normalized.status,
      })
    }

    window.dispatchEvent(new Event(READER_MALL_WISHLIST_EVENT))
    return getReaderMallWishlist()
  }

  const current = readLocalItems().map(normalizeReaderMallItem)
  const key = getReaderMallWishlistKey(normalized)

  if (current.some((entry) => getReaderMallWishlistKey(entry) === key)) {
    return getReaderMallWishlist()
  }

  writeLocalItems([normalized, ...current])
  return getReaderMallWishlist()
}

export function removeReaderMallWishlist(item) {
  const normalized = normalizeReaderMallItem(item)

  if (!normalized.productId) return getReaderMallWishlist()

  if (normalized.source === 'shadow') {
    removeShadowMallWishlist(normalized.productId)
    window.dispatchEvent(new Event(READER_MALL_WISHLIST_EVENT))
    return getReaderMallWishlist()
  }

  const key = getReaderMallWishlistKey(normalized)
  const next = readLocalItems()
    .map(normalizeReaderMallItem)
    .filter((entry) => getReaderMallWishlistKey(entry) !== key)

  writeLocalItems(next)
  return getReaderMallWishlist()
}

export function toggleReaderMallWishlist(item) {
  if (isReaderMallWishlisted(item)) {
    return {
      wishlisted: false,
      items: removeReaderMallWishlist(item),
    }
  }

  return {
    wishlisted: true,
    items: addReaderMallWishlist(item),
  }
}
