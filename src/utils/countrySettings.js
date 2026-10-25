const ENDPOINT = '/api/country-settings'
const CACHE_MS = 5 * 60 * 1000
const RETRY_MS = 20 * 1000
const FLAGS = new Set(['app', 'physicalBooks', 'binancePay', 'payway'])
const LANGUAGES = new Set(['km', 'en', 'zh', 'ja', 'ko'])
const TARGETS = new Set(['shadow_mall', 'diamonds'])

let activeToken = null
let cached = null
let expiresAt = 0
let pending = null
let pendingToken = null
let generation = 0

function readerToken() {
  try {
    return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
  } catch {
    return ''
  }
}

function parseCountrySettings(data) {
  if (!data || data.ok !== true) return null
  if (!['kh', 'international', 'unknown'].includes(data.region)) return null
  if (typeof data.countryVerified !== 'boolean') return null
  const effective = data.effective
  if (effective !== null && effective !== undefined) {
    if (!effective || typeof effective !== 'object' || Array.isArray(effective)) return null
    if (![...FLAGS].every(key => typeof effective[key] === 'boolean')) return null
    if (!LANGUAGES.has(effective.storyLanguage) || !TARGETS.has(effective.shopTarget)) return null
  }
  return {
    country: typeof data.country === 'string' ? data.country : 'unknown',
    region: data.region,
    countryVerified: data.countryVerified,
    effective: effective || null,
    hasException: data.hasException === true,
    revision: Number(data.revision) || 0,
  }
}

export function invalidateCountrySettings() {
  generation += 1
  activeToken = null
  cached = null
  expiresAt = 0
  pending = null
  pendingToken = null
}

export async function loadCountrySettings({ force = false } = {}) {
  const token = readerToken()
  if (token !== activeToken) {
    invalidateCountrySettings()
    activeToken = token
  }

  if (!force && Date.now() < expiresAt) return cached
  if (!force && pending && pendingToken === token) return pending

  const currentGeneration = ++generation
  pendingToken = token
  const task = (async () => {
    try {
      const response = await fetch(ENDPOINT, {
        method: 'GET',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'same-origin',
        cache: 'no-store',
        signal: AbortSignal.timeout(10000),
      })
      const data = response.ok ? await response.json() : null
      const result = parseCountrySettings(data)
if (currentGeneration === generation) {
  cached = result
  expiresAt = Date.now() + (result ? CACHE_MS : RETRY_MS)
  if (result) applyFirstVisitStoryLanguage(result)
}
      return result
    } catch {
      if (currentGeneration === generation) {
        cached = null
        expiresAt = Date.now() + RETRY_MS
      }
      return null
    }
  })()
  pending = task
  try {
    return await task
  } finally {
    if (currentGeneration === generation) {
      pending = null
      pendingToken = null
    }
  }
}

export function getCountryFeature(settings, feature, fallback = null) {
  if (!FLAGS.has(feature)) return fallback
  const value = settings?.effective?.[feature]
  return typeof value === 'boolean' ? value : fallback
}

export function getCountryStoryLanguage(settings, fallback = 'km') {
  const value = settings?.effective?.storyLanguage
  return LANGUAGES.has(value) ? value : fallback
}

export function getCountryShopTarget(settings, fallback = 'shadow_mall') {
  const value = settings?.effective?.shopTarget
  return TARGETS.has(value) ? value : fallback
}

function applyFirstVisitStoryLanguage(settings) {
  const language = getCountryStoryLanguage(settings, null)
  if (!LANGUAGES.has(language)) return

  try {
    if (localStorage.getItem('shadow_story_language') !== null) return
    localStorage.setItem('shadow_story_language', language)
    window.dispatchEvent(new CustomEvent('shadow:story-language-initialized', {
      detail: { language },
    }))
  } catch {}
}

if (typeof window !== 'undefined') {
  try {
    if (localStorage.getItem('shadow_story_language') === null) {
      void loadCountrySettings()
    }
  } catch {}
}
