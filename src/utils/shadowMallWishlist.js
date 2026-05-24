const WISHLIST_KEY = 'shadow_mall_wishlist'

export function getShadowMallWishlist() {
  try {
    const value = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

export function saveShadowMallWishlist(items) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('shadow-mall-wishlist-change'))
}

export function getShadowMallWishlistCount() {
  return getShadowMallWishlist().length
}

export function isShadowMallWishlisted(productId) {
  return getShadowMallWishlist().some((item) => String(item.id) === String(productId))
}

export function addShadowMallWishlist(product) {
  const current = getShadowMallWishlist()
  const exists = current.some((item) => String(item.id) === String(product.id))

  if (exists) {
    return current
  }

  const next = [
    {
      id: product.id,
      title: product.title || 'Untitled book',
      author: product.author || product.author_name || 'Unknown author',
      cover: product.cover || product.cover_url || '',
      price: product.price || product.price_usd || 0,
      oldPrice: product.oldPrice || product.old_price_usd || '',
      status: product.status || product.stock_status || 'in_stock',
    },
    ...current,
  ]

  saveShadowMallWishlist(next)
  return next
}

export function removeShadowMallWishlist(productId) {
  const next = getShadowMallWishlist().filter((item) => String(item.id) !== String(productId))
  saveShadowMallWishlist(next)
  return next
}

export function toggleShadowMallWishlist(product) {
  if (isShadowMallWishlisted(product.id)) {
    return {
      wishlisted: false,
      items: removeShadowMallWishlist(product.id),
    }
  }

  return {
    wishlisted: true,
    items: addShadowMallWishlist(product),
  }
}
