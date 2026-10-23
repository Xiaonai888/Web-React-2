export const AUTHOR_STORE_RESOURCE_TTL_MS = Object.freeze({
  orders: 3 * 60 * 1000,
  orderSummary: 3 * 60 * 1000,
  withdrawal: 3 * 60 * 1000,
  promotion: 5 * 60 * 1000,
  categories: 30 * 60 * 1000,
  delivery: 30 * 60 * 1000,
  telegram: 15 * 60 * 1000,
  salesReports: 15 * 60 * 1000,
})

const MAX_CACHE_ENTRIES = 120
const entries = new Map()
const requests = new Map()
const revisions = new Map()

function keyFor(accountId, resource, params = {}) {
  const account = String(accountId || '').trim()
  const name = String(resource || '').trim()
  if (!account) throw new Error('Author Store account is required')
  if (!Object.prototype.hasOwnProperty.call(AUTHOR_STORE_RESOURCE_TTL_MS, name)) {
    throw new Error('Invalid Author Store resource')
  }
  const normalized = Object.fromEntries(
    Object.entries(params || {})
      .filter(([, value]) => value !== undefined && value !== null)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => [key, String(value)])
  )
  return JSON.stringify([account, name, normalized])
}

function bumpRevision(key) {
  const value = (revisions.get(key) || 0) + 1
  revisions.set(key, value)
  return value
}

function trimEntries() {
  while (entries.size > MAX_CACHE_ENTRIES) {
    entries.delete(entries.keys().next().value)
  }
}

function store(key, data, ttlMs) {
  const now = Date.now()
  entries.delete(key)
  entries.set(key, { data, updatedAt: now, expiresAt: now + ttlMs })
  trimEntries()
}

export function readAuthorStoreResourceCache({ accountId, resource, params = {} }) {
  const key = keyFor(accountId, resource, params)
  const entry = entries.get(key)
  return {
    data: entry?.data ?? null,
    exists: Boolean(entry),
    fresh: Boolean(entry && Date.now() < entry.expiresAt),
    updatedAt: entry?.updatedAt || 0,
  }
}

export function writeAuthorStoreResourceCache({ accountId, resource, params = {}, data }) {
  const key = keyFor(accountId, resource, params)
  bumpRevision(key)
  requests.delete(key)
  store(key, data, AUTHOR_STORE_RESOURCE_TTL_MS[resource])
  return data
}

export function invalidateAuthorStoreResourceCache({ accountId, resource, params } = {}) {
  const account = String(accountId || '').trim()
  if (!account) throw new Error('Author Store account is required')
  if (resource && !Object.prototype.hasOwnProperty.call(AUTHOR_STORE_RESOURCE_TTL_MS, resource)) {
    throw new Error('Invalid Author Store resource')
  }
  const exactKey = resource && params !== undefined ? keyFor(account, resource, params) : null
  const known = new Set([...entries.keys(), ...requests.keys()])
  for (const key of known) {
    const [owner, name] = JSON.parse(key)
    if (owner !== account || (resource && name !== resource) || (exactKey && key !== exactKey)) continue
    bumpRevision(key)
    requests.delete(key)
    const entry = entries.get(key)
    if (entry) entry.expiresAt = 0
  }
}

export function clearAuthorStoreResourceCache(accountId) {
  const account = String(accountId || '').trim()
  if (!account) throw new Error('Author Store account is required')
  const known = new Set([...entries.keys(), ...requests.keys()])
  for (const key of known) {
    if (JSON.parse(key)[0] !== account) continue
    bumpRevision(key)
    entries.delete(key)
    requests.delete(key)
  }
}

export async function fetchAuthorStoreResource({ accountId, resource, params = {}, fetcher, force = false }) {
  const key = keyFor(accountId, resource, params)
  if (typeof fetcher !== 'function') throw new Error('Author Store fetcher is required')
  const cached = entries.get(key)
  if (!force && cached && Date.now() < cached.expiresAt) {
    return { data: cached.data, fromCache: true, obsolete: false }
  }
  if (!force && requests.has(key)) return requests.get(key)

  const version = force ? bumpRevision(key) : (revisions.get(key) || 0)
  const promise = (async () => {
    const data = await fetcher()
    if ((revisions.get(key) || 0) !== version) {
      return { data: entries.get(key)?.data ?? null, fromCache: true, obsolete: true }
    }
    store(key, data, AUTHOR_STORE_RESOURCE_TTL_MS[resource])
    return { data, fromCache: false, obsolete: false }
  })()
  requests.set(key, promise)
  try {
    return await promise
  } finally {
    if (requests.get(key) === promise) requests.delete(key)
  }
}
