export const AUTHOR_STORE_PRODUCT_PAGE_SIZE = 10
export const AUTHOR_STORE_PRODUCT_TTL_MS = 10 * 60 * 1000

const memory = new Map()
const pending = new Map()
const versions = new Map()
const MAX_VIEWS = 12
const MAX_PAGES = 100000

function scopeId(accountId) {
  const id = String(accountId || '').trim()
  if (!id) throw new Error('Author Store account is required')
  return `shadow_author_store_product_cache_v1:${encodeURIComponent(id)}`
}

function normalizeView(view = {}) {
  const type = String(view.type || 'all').toLowerCase()
  const sort = String(view.sort || 'newest').toLowerCase()
  return {
    type: ['all', 'book', 'pdf', 'active', 'draft', 'hidden'].includes(type) ? type : 'all',
    sort: ['newest', 'oldest', 'recently_updated', 'low_stock', 'sold_out'].includes(sort) ? sort : 'newest',
    q: String(view.q || '').trim().slice(0, 100),
  }
}

function viewId(view) {
  return JSON.stringify(normalizeView(view))
}

function loadAccount(scope) {
  if (memory.has(scope)) return memory.get(scope)
  let saved = null
  try {
    saved = JSON.parse(sessionStorage.getItem(scope) || 'null')
  } catch {
    saved = null
  }
  const state = saved && typeof saved === 'object' && saved.views && typeof saved.views === 'object'
    ? saved
    : { views: {} }
  memory.set(scope, state)
  return state
}

function saveAccount(scope, state) {
  memory.set(scope, state)
  const keys = Object.keys(state.views)
  if (keys.length > MAX_VIEWS) {
    keys.sort((a, b) => Number(state.views[a]?.visitedAt || 0) - Number(state.views[b]?.visitedAt || 0))
    for (const key of keys.slice(0, keys.length - MAX_VIEWS)) delete state.views[key]
  }
  try {
    sessionStorage.setItem(scope, JSON.stringify(state))
  } catch {
    try {
      sessionStorage.removeItem(scope)
    } catch {
    }
  }
}

function getEntry(scope, view, create = false) {
  const state = loadAccount(scope)
  const key = viewId(view)
  if (!state.views[key] && create) {
    state.views[key] = { pages: {}, scrollY: 0, visitedAt: 0, checkedAt: 0 }
  }
  return { state, key, entry: state.views[key] || null }
}

export function readAuthorStoreProductCache(accountId, view = {}) {
  const scope = scopeId(accountId)
  const { entry } = getEntry(scope, view)
  const pages = entry?.pages || {}
  const numbers = Object.keys(pages).map(Number).filter(Number.isInteger).sort((a, b) => a - b)
  const seen = new Set()
  const products = []
  let lastPage = 0
  let pagination = null

  for (const number of numbers) {
    if (number !== lastPage + 1) break
    const item = pages[number]
    if (!Array.isArray(item?.products)) break
    for (const product of item.products) {
      const id = String(product?.id || '')
      if (id && !seen.has(id)) {
        seen.add(id)
        products.push(product)
      }
    }
    lastPage = number
    pagination = item.pagination
  }

  return {
    products,
    loadedPages: lastPage,
    total: Number(pagination?.total || 0),
    hasNext: lastPage === 0 || Boolean(pagination?.has_next),
    scrollY: Number(entry?.scrollY || 0),
    visitedAt: Number(entry?.visitedAt || 0),
    checkedAt: Number(entry?.checkedAt || 0),
    fresh: lastPage > 0 && Date.now() - Number(entry?.checkedAt || 0) < AUTHOR_STORE_PRODUCT_TTL_MS,
  }
}

export function rememberAuthorStoreProductView(accountId, view = {}, scrollY = 0) {
  const scope = scopeId(accountId)
  const { state, entry } = getEntry(scope, view, true)
  entry.scrollY = Math.max(0, Math.floor(Number(scrollY) || 0))
  entry.visitedAt = Date.now()
  saveAccount(scope, state)
}

export function invalidateAuthorStoreProductCache(accountId) {
  const scope = scopeId(accountId)
  versions.set(scope, (versions.get(scope) || 0) + 1)
  const state = loadAccount(scope)
  for (const entry of Object.values(state.views)) {
    entry.checkedAt = 0
    for (const page of Object.values(entry.pages || {})) page.savedAt = 0
  }
  saveAccount(scope, state)
}

export function clearAuthorStoreProductCache(accountId) {
  const scope = scopeId(accountId)
  versions.set(scope, (versions.get(scope) || 0) + 1)
  memory.delete(scope)
  for (const key of pending.keys()) if (key.startsWith(`${scope}:`)) pending.delete(key)
  try {
    sessionStorage.removeItem(scope)
  } catch {
  }
}

export async function fetchAuthorStoreProductPage({ accountId, apiBaseUrl, token, view = {}, page = 1, force = false }) {
  const scope = scopeId(accountId)
  const auth = String(token || '').trim()
  if (!auth) throw new Error('Sign in required')
  const number = Math.max(1, Math.min(MAX_PAGES, Math.floor(Number(page) || 1)))
  const normalized = normalizeView(view)
  const viewKey = viewId(normalized)
  const version = versions.get(scope) || 0
  const { entry } = getEntry(scope, normalized)
  const cached = entry?.pages?.[number]

  if (!force && cached && Date.now() - Number(cached.savedAt || 0) < AUTHOR_STORE_PRODUCT_TTL_MS) {
    return { products: cached.products, pagination: cached.pagination, cached: true }
  }

  const requestKey = `${scope}:${viewKey}:${number}:${version}`
  if (pending.has(requestKey)) return pending.get(requestKey)

  const promise = (async () => {
    const params = new URLSearchParams({
      page: String(number),
      limit: String(AUTHOR_STORE_PRODUCT_PAGE_SIZE),
      type: normalized.type,
      sort: normalized.sort,
    })
    if (normalized.q) params.set('q', normalized.q)

    const response = await fetch(`${String(apiBaseUrl || '').replace(/\/$/, '')}/api/author-store/me/products?${params}`, {
      headers: { Authorization: `Bearer ${auth}` },
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok || data.ok === false) throw new Error(data.message || 'Failed to load products')
    if (!Array.isArray(data.products) || !data.pagination) throw new Error('Products pagination is not available')

    if ((versions.get(scope) || 0) === version) {
      const { state, entry: current } = getEntry(scope, normalized, true)
      current.pages[number] = {
        products: data.products,
        pagination: data.pagination,
        savedAt: Date.now(),
      }
      if (number === 1) current.checkedAt = Date.now()
      current.visitedAt = Date.now()
      saveAccount(scope, state)
    }
    return { products: data.products, pagination: data.pagination, cached: false }
  })()

  pending.set(requestKey, promise)
  try {
    return await promise
  } finally {
    if (pending.get(requestKey) === promise) pending.delete(requestKey)
  }
}
