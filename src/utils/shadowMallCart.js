const SHADOW_MALL_CART_KEY = 'shadow_mall_cart'

function parsePrice(value) {
  if (typeof value === 'number') return value

  const number = Number(String(value || '').replace(/[^\d.]/g, ''))
  return Number.isFinite(number) ? number : 0
}

function notifyCartChange() {
  window.dispatchEvent(new Event('shadow-mall-cart-change'))
}

function normalizeCartItem(product, quantity = 1) {
  return {
    id: String(product.id),
    title: product.title || 'Untitled Book',
    author: product.author || 'Shadow Author',
    cover: product.cover || '',
    price: parsePrice(product.salePrice ?? product.price),
    oldPrice: parsePrice(product.originalPrice ?? product.oldPrice),
    quantity: Math.max(1, Number(quantity || 1)),
  }
}

export function getShadowMallCartItems() {
  try {
    const items = JSON.parse(localStorage.getItem(SHADOW_MALL_CART_KEY) || '[]')
    return Array.isArray(items) ? items : []
  } catch {
    return []
  }
}

export function saveShadowMallCartItems(items) {
  try {
    localStorage.setItem(SHADOW_MALL_CART_KEY, JSON.stringify(items))
  } catch {}

  notifyCartChange()
}

export function getShadowMallCartCount() {
  return getShadowMallCartItems().reduce((total, item) => total + Number(item.quantity || 0), 0)
}

export function addShadowMallCartItem(product, quantity = 1) {
  const nextItem = normalizeCartItem(product, quantity)
  const items = getShadowMallCartItems()
  const existingIndex = items.findIndex((item) => String(item.id) === String(nextItem.id))

  if (existingIndex >= 0) {
    items[existingIndex] = {
      ...items[existingIndex],
      quantity: Math.min(Number(items[existingIndex].quantity || 0) + nextItem.quantity, 99),
    }
  } else {
    items.push(nextItem)
  }

  saveShadowMallCartItems(items)
  return items
}

export function updateShadowMallCartItemQuantity(productId, quantity) {
  const nextQuantity = Math.max(1, Math.min(Number(quantity || 1), 99))
  const items = getShadowMallCartItems().map((item) =>
    String(item.id) === String(productId) ? { ...item, quantity: nextQuantity } : item
  )

  saveShadowMallCartItems(items)
  return items
}

export function removeShadowMallCartItem(productId) {
  const items = getShadowMallCartItems().filter((item) => String(item.id) !== String(productId))
  saveShadowMallCartItems(items)
  return items
}
