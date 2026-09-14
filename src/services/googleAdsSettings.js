const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const CACHE_MS = 60 * 1000

const OFF_SETTINGS = Object.freeze({
  masterEnabled: false,
  homeEnabled: false,
  storyDetailEnabled: false,
  readerEndEnabled: false,
  episodeUnlockEnabled: false,
  homeEffective: false,
  storyDetailEffective: false,
  readerEndEffective: false,
  episodeUnlockEffective: false,
  episodeUnlockSuppressed: false,
  episodeUnlockSuppressionReason: '',
  shadowFreeUnlockAd: {
    enabled: false,
    frequency: 'once_per_session',
  },
  updatedAt: null,
})

let cachedSettings = null
let cachedAt = 0
let pendingRequest = null

function normalizeSettings(value) {
  return {
    ...OFF_SETTINGS,
    ...(value || {}),
    shadowFreeUnlockAd: {
      ...OFF_SETTINGS.shadowFreeUnlockAd,
      ...(value?.shadowFreeUnlockAd || {}),
    },
  }
}

export function getGoogleAdsPlacementEnabled(
  settings,
  placement
) {
  if (!settings) return false

  if (placement === 'home') {
    return Boolean(settings.homeEffective)
  }

  if (placement === 'storyDetail') {
    return Boolean(settings.storyDetailEffective)
  }

  if (placement === 'readerEnd') {
    return Boolean(settings.readerEndEffective)
  }

  if (placement === 'episodeUnlock') {
    return Boolean(settings.episodeUnlockEffective)
  }

  return false
}

export async function getPublicGoogleAdsSettings({
  force = false,
} = {}) {
  const now = Date.now()

  if (
    !force &&
    cachedSettings &&
    now - cachedAt < CACHE_MS
  ) {
    return cachedSettings
  }

  if (!force && pendingRequest) {
    return pendingRequest
  }

  pendingRequest = fetch(
    `${API_BASE_URL}/api/google-ads/public`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    }
  )
    .then(async (response) => {
      const data = await response
        .json()
        .catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message ||
          `Google Ads settings request failed (${response.status})`
        )
      }

      const settings = normalizeSettings(
        data.settings
      )

      cachedSettings = settings
      cachedAt = Date.now()

      return settings
    })
    .catch(() => {
      cachedSettings = OFF_SETTINGS
      cachedAt = Date.now()

      return OFF_SETTINGS
    })
    .finally(() => {
      pendingRequest = null
    })

  return pendingRequest
}

export function clearGoogleAdsSettingsCache() {
  cachedSettings = null
  cachedAt = 0
  pendingRequest = null
}
