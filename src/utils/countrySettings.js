import { changeDisplayLanguage } from '../i18n'
const RECOVERY_KEY = 'shadow_story_km_recovery_20261028_v1'
try {
  if (localStorage.getItem(RECOVERY_KEY) !== 'done') {
  const existing = localStorage.getItem('shadow_story_language')
  if (existing !== null) {
    localStorage.setItem('shadow_story_language', 'km')
    window.dispatchEvent(new CustomEvent('shadow:story-language-initialized', { detail: { language: 'km' } }))
  }
  localStorage.setItem(RECOVERY_KEY, 'done')
}
} catch {}

const ENDPOINT = '/api/country-settings'
const CACHE_MS = 5 * 60 * 1000
const RETRY_MS = 20 * 1000
const LEGACY_FLAGS = new Set(['app', 'physicalBooks', 'binancePay', 'payway'])
const NEW_FLAGS = new Set(['shadowMall', 'readerMall'])
const FLAGS = new Set([...LEGACY_FLAGS, ...NEW_FLAGS])
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
  const policyEnabled = data.countryPolicyEnabled === true && data.countrySource === 'reader_classification'
  const effective = data.effective
  if (effective !== null && effective !== undefined) {
    if (!effective || typeof effective !== 'object' || Array.isArray(effective)) return null
    if (![...LEGACY_FLAGS].every(key => typeof effective[key] === 'boolean')) return null
    if ([...NEW_FLAGS].some(key => effective[key] !== undefined && typeof effective[key] !== 'boolean')) return null
    if (!LANGUAGES.has(effective.storyLanguage) || !TARGETS.has(effective.shopTarget)) return null
  }
  const normalizedEffective = effective ? {
    ...effective,
    shadowMall: typeof effective.shadowMall === 'boolean' ? effective.shadowMall : data.region === 'kh',
    readerMall: typeof effective.readerMall === 'boolean' ? effective.readerMall : data.region === 'kh',
  } : null
  return {
    country: typeof data.country === 'string' ? data.country : 'unknown',
    region: data.region,
    countryVerified: data.countryVerified,
    countryPolicyEnabled: policyEnabled,
    countrySource: data.countrySource === 'reader_classification' ? 'reader_classification' : 'pending',
    effective: normalizedEffective,
    hasException: data.hasException === true,
    revision: Number(data.revision) || 0,
    paymentCountryTicket:
      data.countryVerified === true &&
      typeof data.paymentCountryTicket === 'string' &&
      data.paymentCountryTicket.length <= 4096 &&
      /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(data.paymentCountryTicket)
        ? data.paymentCountryTicket
        : null,
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
        if (result) applyFirstVisitLanguages(result)
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

export function isCountryPolicyEnabled(settings) {
  return settings?.countryPolicyEnabled === true && settings?.countrySource === 'reader_classification'
}

export function getCountryFeature(settings, feature, fallback = null) {
  if (!FLAGS.has(feature)) return fallback
  if (!isCountryPolicyEnabled(settings)) return true
  if (settings?.countryVerified !== true) return fallback
  const value = settings?.effective?.[feature]
  return typeof value === 'boolean' ? value : fallback
}

export function getCountryStoryLanguage(settings, fallback = 'km') {
  if (settings?.countryVerified !== true || settings?.countrySource !== 'reader_classification') return fallback
  const value = settings?.effective?.storyLanguage
  return LANGUAGES.has(value) ? value : fallback
}

export function getCountryShopTarget(settings, fallback = 'shadow_mall') {
  if (!isCountryPolicyEnabled(settings)) return fallback
  const value = settings?.effective?.shopTarget
  return TARGETS.has(value) ? value : fallback
}

function applyFirstVisitLanguages(settings) {
  if (settings.countryVerified !== true || settings.countrySource !== 'reader_classification') return
  if (!['kh', 'international'].includes(settings.region)) return
  const language = getCountryStoryLanguage(settings, settings.region === 'kh' ? 'km' : 'en')
  if (!LANGUAGES.has(language)) return

  try {
    if (localStorage.getItem('shadow_story_language') === null) {
      localStorage.setItem('shadow_story_language', language)
      window.dispatchEvent(new CustomEvent('shadow:story-language-initialized', {
        detail: { language },
      }))
    }
    if (localStorage.getItem('shadow_display_language') === null) {
      changeDisplayLanguage(language)
    }
  } catch {}
}

if (typeof window !== 'undefined') {
  try {
    if (localStorage.getItem('shadow_story_language') === null || localStorage.getItem('shadow_display_language') === null) {
      void loadCountrySettings()
    }
  } catch {}
}

export async function getPaymentCountryTicket({ force = false } = {}) {
  const token = readerToken()
  if (!token) return null

  const settings = await loadCountrySettings({ force })
  if (!isCountryPolicyEnabled(settings)) return null

  if (readerToken() !== token || settings?.countryVerified !== true) {
    return null
  }

  return settings.paymentCountryTicket || null
}
