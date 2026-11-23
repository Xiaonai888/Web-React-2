const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const TOKEN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/
const SOURCES = new Set(['stories', 'manga', 'discover'])
const LANGUAGES = new Set(['km', 'en', 'zh', 'ko', 'ja'])

function validMoney(value) {
  const number = Number(value)
  return Number.isFinite(number) && number > 0 && Number.isSafeInteger(Math.round(number * 100)) && Math.abs(number * 100 - Math.round(number * 100)) <= 0.001
}

export function buildSmartPdfCartItem(offer, { rotationKey, expiresAt, source } = {}) {
  const productId = String(offer?.product_id || '').toLowerCase()
  const authorPageId = String(offer?.author_page_id || '').toLowerCase()
  const token = String(offer?.smart_pdf_offer_token || '')
  const expiry = Date.parse(String(expiresAt || ''))
  const slot = Number(rotationKey)
  const price = Number(offer?.promotion_price_usd)
  if (!UUID.test(productId) || !UUID.test(authorPageId) || offer?.product_type !== 'pdf' ||
      !SOURCES.has(source) || !LANGUAGES.has(offer?.story_language) ||
      !String(offer?.page_username || '').trim() || !String(offer?.title || '').trim() ||
      !validMoney(price) || !TOKEN.test(token) || token.length > 2048 ||
      !Number.isSafeInteger(slot) || String(slot) !== String(rotationKey) ||
      !Number.isFinite(expiry) || expiry <= Date.now() ||
      expiry - slot * 1000 !== 6 * 3600000 || String(offer?.expires_at || '') !== new Date(expiry).toISOString()) {
    throw new TypeError('Invalid or expired Smart PDF offer')
  }
  return {
    id: productId,
    title: String(offer.title),
    type: 'PDF',
    cover_url: String(offer.cover_url || ''),
    price_value: price,
    quantity: 1,
    author_page_id: authorPageId,
    author_page_name: String(offer.page_name || offer.author_name || ''),
    author_page_username: String(offer.page_username),
    discover_promotion_rotation_key: String(rotationKey),
    discover_promotion_expires_at: new Date(expiry).toISOString(),
    discover_promotion_story_language: offer.story_language,
    promotion_entry_source: source,
    smart_pdf_offer_token: token,
  }
}

export function planSmartPdfCart(current, item, { replace = false } = {}) {
  const existing = Array.isArray(current) ? current : []
  if (!item || !UUID.test(String(item.id || '')) || !UUID.test(String(item.author_page_id || '')) ||
      !TOKEN.test(String(item.smart_pdf_offer_token || ''))) {
    throw new TypeError('Invalid Smart PDF cart item')
  }
  if (!replace && existing.some((entry) => {
    const author = String(entry?.author_page_id || '').trim()
    const username = String(entry?.author_page_username || '').trim()
    return author ? author !== item.author_page_id : !username || username !== item.author_page_username
  })) {
    return { conflict: true, items: existing }
  }
  const retained = replace ? [] : existing.filter((entry) => String(entry?.id || '') !== item.id)
  return { conflict: false, items: [...retained, { ...item, quantity: 1 }] }
}
