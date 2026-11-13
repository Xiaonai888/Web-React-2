const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://shadow-backend-kucw.onrender.com'
const CONFIG = {
  story: {
    endpoint: '/api/public/discover-special-promotion/active',
    storageKey: 'shadow_discover_special_promotion_rotation_v2',
  },
  store: {
    endpoint: '/api/public/discover-author-store-promotion/active',
    storageKey: 'shadow_discover_author_store_rotation_v1',
  },
}

const memory = { story: null, store: null }
const pending = { story: null, store: null }
const retryAfter = { story: 0, store: 0 }
const RETRY_MS = 30000

function normalize(kind, data) {
  if (!CONFIG[kind] || !data || data.ok === false) return null
  const expiresAt = new Date(data.expires_at || 0).getTime()
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return null
  const source = Array.isArray(data.promotions)
    ? data.promotions
    : kind === 'story' && data.promotion
      ? [data.promotion]
      : []
  const seen = new Set()
  const offers = source.filter((item) => {
    const id = String((kind === 'story' ? item?.story_id : item?.product_id) || '').trim()
    if (!id || seen.has(id) || !String(item?.cover_url || '').trim()) return false
    if (kind === 'story') {
      if (!String(item?.story_title || '').trim()) return false
      if (!Number.isInteger(Number(item?.locked_episode_count)) || Number(item.locked_episode_count) < 5) return false
      if (!Number.isSafeInteger(Number(item?.discounted_price_diamonds)) || Number(item.discounted_price_diamonds) < 1) return false
    } else {
      const type = String(item?.product_type || '').toLowerCase()
      if (!['book', 'pdf'].includes(type) || !String(item?.title || '').trim()) return false
      if (!String(item?.author_page_id || '').trim() || !String(item?.page_username || '').trim()) return false
      if (!Number.isFinite(Number(item?.promotion_price_usd)) || Number(item.promotion_price_usd) <= 0) return false
      if (type === 'book' && Number(item.stock_quantity) < 1) return false
    }
    seen.add(id)
    return true
  }).slice(0, 3)
  return {
    promotions: offers,
    rotationKey: String(data.rotation_key || data.slot_start_at || data.expires_at),
    expiresAt,
    expires_at: new Date(expiresAt).toISOString(),
  }
}

export function getPromotionShelfCache(kind) {
  if (!CONFIG[kind]) return null
  const current = memory[kind]
  if (current?.expiresAt > Date.now()) return current
  memory[kind] = null
  try {
    const serialized = localStorage.getItem(CONFIG[kind].storageKey)
    if (!serialized) return null
    const cached = normalize(kind, JSON.parse(serialized))
    if (!cached) {
      localStorage.removeItem(CONFIG[kind].storageKey)
      return null
    }
    memory[kind] = cached
    return cached
  } catch {
    return null
  }
}

export async function loadPromotionShelf(kind, { force = false } = {}) {
  const config = CONFIG[kind]
  if (!config) return null
  const cached = getPromotionShelfCache(kind)
  if (!force && cached) return cached
  if (pending[kind]) return pending[kind]
  if (Date.now() < retryAfter[kind]) return cached

  const request = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${config.endpoint}`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      })
      if (!response.ok) throw new Error('Promotion unavailable')
      const rotation = normalize(kind, await response.json())
      if (!rotation) throw new Error('Invalid promotion rotation')
      memory[kind] = rotation
      retryAfter[kind] = 0
      try {
        localStorage.setItem(config.storageKey, JSON.stringify({
          ok: true,
          promotions: rotation.promotions,
          rotation_key: rotation.rotationKey,
          expires_at: rotation.expires_at,
        }))
      } catch {}
      return rotation
    } catch {
      retryAfter[kind] = Date.now() + RETRY_MS
      return getPromotionShelfCache(kind)
    }
  })()
  pending[kind] = request
  try {
    return await request
  } finally {
    if (pending[kind] === request) pending[kind] = null
  }
}
