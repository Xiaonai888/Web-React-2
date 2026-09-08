import { getShadowMallCartItems } from './shadowMallCart'

const AUTHOR_CART_KEY = 'shadow_author_cart_items'
const ACTIVE_SELLER_KEY = 'reader_mall_active_seller'

export const SHADOW_MALL_SELLER_KEY = 'shadow-mall'

export function getAuthorCartItems() {
  try {
    const items = JSON.parse(localStorage.getItem(AUTHOR_CART_KEY) || '[]')
    return Array.isArray(items) ? items : []
  } catch {
    return []
  }
}

export function saveAuthorCartItems(items) {
  localStorage.setItem(AUTHOR_CART_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('shadow-author-cart-updated'))
}

export function getAuthorSellerKey(item) {
  return String(
    item?.author_page_id ||
      item?.author_page_username ||
      item?.author_page_name ||
      'author-store'
  )
}

export function getAuthorSellerLabel(item) {
  return String(
    item?.author_page_name ||
      item?.author_page_username ||
      'Author Store'
  )
}

export function groupAuthorCartItems(items = getAuthorCartItems()) {
  const groups = new Map()

  items.forEach((item) => {
    const key = getAuthorSellerKey(item)
    const current = groups.get(key) || {
      key,
      type: 'author',
      label: getAuthorSellerLabel(item),
      count: 0,
      items: [],
    }

    current.count += Math.max(1, Number(item.quantity || 1))
    current.items.push(item)
    groups.set(key, current)
  })

  return Array.from(groups.values())
}

export function buildReaderMallSellers(authorItems, shadowItems) {
  const sellers = []

  if (shadowItems.length) {
    sellers.push({
      key: SHADOW_MALL_SELLER_KEY,
      type: 'shadow',
      label: 'Shadow Mall',
      count: shadowItems.reduce(
        (sum, item) => sum + Math.max(1, Number(item.quantity || 1)),
        0
      ),
      items: shadowItems,
    })
  }

  return [...sellers, ...groupAuthorCartItems(authorItems)]
}

export function getReaderMallSellers() {
  return buildReaderMallSellers(getAuthorCartItems(), getShadowMallCartItems())
}

export function getSavedReaderMallSellerKey() {
  return sessionStorage.getItem(ACTIVE_SELLER_KEY) || ''
}

export function setReaderMallActiveSellerKey(key) {
  if (!key) {
    sessionStorage.removeItem(ACTIVE_SELLER_KEY)
    return
  }

  sessionStorage.setItem(ACTIVE_SELLER_KEY, String(key))
}

export function resolveReaderMallSellerKey(sellers, preferredKey = '') {
  if (!sellers.length) return ''

  if (preferredKey && sellers.some((seller) => seller.key === preferredKey)) {
    return preferredKey
  }

  const saved = getSavedReaderMallSellerKey()

  if (saved && sellers.some((seller) => seller.key === saved)) {
    return saved
  }

  return sellers[0].key
}

export function getReaderMallCartCount() {
  return getReaderMallSellers().reduce((sum, seller) => sum + seller.count, 0)
}
