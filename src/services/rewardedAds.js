import {
  getPublicGoogleAdsSettings,
} from './googleAdsSettings'

const GPT_SRC =
  'https://securepubads.g.doubleclick.net/tag/js/gpt.js'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

let gptPromise = null
let servicesEnabled = false
let activeRewardedRequest = null

export class RewardedAdError extends Error {
  constructor(code, message, status = 0) {
    super(message)
    this.name = 'RewardedAdError'
    this.code = code
    this.status = status
  }
}

function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

export function getRewardedAdUnitPath() {
  return String(
    import.meta.env.VITE_GOOGLE_REWARDED_AD_UNIT_PATH || ''
  ).trim()
}

export function hasRewardedAdUnitPath() {
  return Boolean(getRewardedAdUnitPath())
}

async function apiRequest(path, options = {}) {
  const token = getReaderToken()

  if (!token) {
    throw new RewardedAdError(
      'LOGIN_REQUIRED',
      'Please login to watch a rewarded ad.',
      401
    )
  }

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    }
  )

  const data = await response
    .json()
    .catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new RewardedAdError(
      data.code || 'REWARDED_AD_REQUEST_FAILED',
      data.message ||
        `Rewarded ad request failed (${response.status})`,
      response.status
    )
  }

  return data
}

async function loadGooglePublisherTag() {
  if (typeof window === 'undefined') {
    throw new RewardedAdError(
      'REWARDED_AD_UNSUPPORTED',
      'Rewarded ads are unavailable on this device.'
    )
  }

  window.googletag =
    window.googletag || { cmd: [] }

  if (
    window.googletag.apiReady &&
    window.googletag.pubads
  ) {
    return window.googletag
  }

  if (gptPromise) {
    return gptPromise
  }

  gptPromise = new Promise(
    (resolve, reject) => {
      const existing = document.querySelector(
        `script[src="${GPT_SRC}"]`
      )

      const waitForReady = () => {
        window.googletag.cmd.push(() => {
          resolve(window.googletag)
        })
      }

      if (existing) {
        if (window.googletag.apiReady) {
          waitForReady()
          return
        }

        existing.addEventListener(
          'load',
          waitForReady,
          { once: true }
        )
        existing.addEventListener(
          'error',
          () =>
            reject(
              new RewardedAdError(
                'REWARDED_AD_SCRIPT_FAILED',
                'Unable to load rewarded ads.'
              )
            ),
          { once: true }
        )
        return
      }

      const script =
        document.createElement('script')

      script.async = true
      script.src = GPT_SRC
      script.onload = waitForReady
      script.onerror = () =>
        reject(
          new RewardedAdError(
            'REWARDED_AD_SCRIPT_FAILED',
            'Unable to load rewarded ads.'
          )
        )

      document.head.appendChild(script)
    }
  ).catch((error) => {
    gptPromise = null
    throw error
  })

  return gptPromise
}

async function createChallenge(
  storyId,
  episodeId
) {
  return apiRequest(
    `/api/unlocks/stories/${storyId}/episodes/${episodeId}/ad/challenge`,
    {
      method: 'POST',
      body: JSON.stringify({}),
    }
  )
}

async function grantChallenge(
  storyId,
  episodeId,
  challengeToken
) {
  return apiRequest(
    `/api/unlocks/stories/${storyId}/episodes/${episodeId}/ad`,
    {
      method: 'POST',
      body: JSON.stringify({
        challengeToken,
      }),
    }
  )
}

async function verifyRewardedAvailability() {
  const settings =
    await getPublicGoogleAdsSettings()

  if (!settings.episodeUnlockEffective) {
    throw new RewardedAdError(
      settings.episodeUnlockSuppressed
        ? 'REWARDED_AD_SUPPRESSED'
        : 'REWARDED_AD_DISABLED',
      'Rewarded episode unlock is unavailable.'
    )
  }

  const adUnitPath =
    getRewardedAdUnitPath()

  if (!adUnitPath) {
    throw new RewardedAdError(
      'REWARDED_AD_NOT_CONFIGURED',
      'Rewarded episode unlock is not configured.'
    )
  }

  return adUnitPath
}

function showRewardedSlot({
  googletag,
  adUnitPath,
  storyId,
  episodeId,
  challengeToken,
}) {
  return new Promise((resolve, reject) => {
    googletag.cmd.push(() => {
      const slot =
        googletag.defineOutOfPageSlot(
          adUnitPath,
          googletag.enums.OutOfPageFormat.REWARDED
        )

      if (!slot) {
        reject(
          new RewardedAdError(
            'REWARDED_AD_UNSUPPORTED',
            'Rewarded ads are unavailable on this device.'
          )
        )
        return
      }

      const pubads = googletag.pubads()
      let rewardGranted = false
      let grantPromise = null
      let settled = false
      let ready = false

      const readyTimeout =
        window.setTimeout(() => {
          finishReject(
            new RewardedAdError(
              'REWARDED_AD_TIMEOUT',
              'No rewarded ad is available right now.'
            )
          )
        }, 20000)

      const removeListener = (
        eventName,
        handler
      ) => {
        if (
          typeof pubads.removeEventListener ===
          'function'
        ) {
          pubads.removeEventListener(
            eventName,
            handler
          )
        }
      }

      const cleanup = () => {
        window.clearTimeout(readyTimeout)

        removeListener(
          'rewardedSlotReady',
          onReady
        )
        removeListener(
          'rewardedSlotGranted',
          onGranted
        )
        removeListener(
          'rewardedSlotClosed',
          onClosed
        )
        removeListener(
          'slotRenderEnded',
          onRenderEnded
        )

        try {
          googletag.destroySlots([slot])
        } catch {}
      }

      const finishReject = (error) => {
        if (settled) return

        settled = true
        cleanup()
        reject(error)
      }

      const finishResolve = (data) => {
        if (settled) return

        settled = true
        cleanup()
        resolve(data)
      }

      const onReady = (event) => {
        if (event.slot !== slot) return

        ready = true
        window.clearTimeout(readyTimeout)

        try {
          event.makeRewardedVisible()
        } catch {
          finishReject(
            new RewardedAdError(
              'REWARDED_AD_SHOW_FAILED',
              'Unable to show rewarded ad.'
            )
          )
        }
      }

      const onGranted = (event) => {
        if (event.slot !== slot) return
        if (rewardGranted) return

        rewardGranted = true

        grantPromise = grantChallenge(
          storyId,
          episodeId,
          challengeToken
        )
      }

      const onClosed = async (event) => {
        if (event.slot !== slot) return

        if (!rewardGranted) {
          finishReject(
            new RewardedAdError(
              'REWARDED_AD_CANCELLED',
              'Ad closed before the reward was granted.'
            )
          )
          return
        }

        try {
          const data = await grantPromise

          finishResolve({
            ...data,
            rewardPayload:
              event.payload || null,
          })
        } catch (error) {
          finishReject(error)
        }
      }

      const onRenderEnded = (event) => {
        if (event.slot !== slot) return

        if (event.isEmpty && !ready) {
          finishReject(
            new RewardedAdError(
              'REWARDED_AD_NO_FILL',
              'No rewarded ad is available right now.'
            )
          )
        }
      }

      pubads.addEventListener(
        'rewardedSlotReady',
        onReady
      )
      pubads.addEventListener(
        'rewardedSlotGranted',
        onGranted
      )
      pubads.addEventListener(
        'rewardedSlotClosed',
        onClosed
      )
      pubads.addEventListener(
        'slotRenderEnded',
        onRenderEnded
      )

      slot.addService(pubads)

      if (!servicesEnabled) {
        googletag.enableServices()
        servicesEnabled = true
      }

      googletag.display(slot)
    })
  })
}

export async function isRewardedEpisodeUnlockReady() {
  if (!hasRewardedAdUnitPath()) {
    return false
  }

  const settings =
    await getPublicGoogleAdsSettings()

  return Boolean(
    settings.episodeUnlockEffective
  )
}

export function runRewardedEpisodeUnlock({
  storyId,
  episodeId,
}) {
  if (activeRewardedRequest) {
    return activeRewardedRequest
  }

  activeRewardedRequest = (async () => {
    const adUnitPath =
      await verifyRewardedAvailability()

    const challenge =
      await createChallenge(
        storyId,
        episodeId
      )

    if (!challenge.challengeToken) {
      throw new RewardedAdError(
        'REWARDED_AD_CHALLENGE_MISSING',
        'Unable to start rewarded unlock.'
      )
    }

    const googletag =
      await loadGooglePublisherTag()

    return showRewardedSlot({
      googletag,
      adUnitPath,
      storyId,
      episodeId,
      challengeToken:
        challenge.challengeToken,
    })
  })().finally(() => {
    activeRewardedRequest = null
  })

  return activeRewardedRequest
}
