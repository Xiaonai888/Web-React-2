const PUSH_DEVICE_KEY = 'shadow_reader_story_push_enabled_v1'
const SCRIPT_SELECTOR = 'script[data-shadow-onesignal="true"]'
const SDK_URL = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js'

let identityQueue = Promise.resolve()

function getReaderId() {
  for (const storage of [sessionStorage, localStorage]) {
    try {
      if (!storage.getItem('shadow_reader_token')) continue
      const reader = JSON.parse(storage.getItem('shadow_reader_user') || 'null')
      return String(reader?.id || reader?.user_id || '').trim()
    } catch {
      return ''
    }
  }
  return ''
}

function rememberPushDevice() {
  try {
    localStorage.setItem(PUSH_DEVICE_KEY, '1')
  } catch {}
}

function hasPushDevice() {
  try {
    return localStorage.getItem(PUSH_DEVICE_KEY) === '1'
  } catch {
    return false
  }
}

async function loadReaderOneSignal() {
  const appId = String(import.meta.env.VITE_ONESIGNAL_APP_ID || '').trim()
  if (!appId || !window.isSecureContext) return null

  window.OneSignalDeferred = window.OneSignalDeferred || []

  if (!window.__shadowOneSignalSdkPromise) {
    window.__shadowOneSignalSdkPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(SCRIPT_SELECTOR)

      if (existing?.dataset.loaded === 'true') {
        resolve()
        return
      }

      if (existing) {
        existing.addEventListener('load', resolve, { once: true })
        existing.addEventListener('error', reject, { once: true })
        return
      }

      const script = document.createElement('script')
      script.src = SDK_URL
      script.defer = true
      script.dataset.shadowOnesignal = 'true'
      script.addEventListener('load', () => {
        script.dataset.loaded = 'true'
        resolve()
      }, { once: true })
      script.addEventListener('error', reject, { once: true })
      document.head.appendChild(script)
    })
  }

  await window.__shadowOneSignalSdkPromise

  if (!window.__shadowOneSignalReadyPromise) {
    window.__shadowOneSignalReadyPromise = new Promise((resolve, reject) => {
      window.OneSignalDeferred.push(async (OneSignal) => {
        try {
          await OneSignal.init({
            appId,
            serviceWorkerPath: 'onesignal/OneSignalSDKWorker.js',
            serviceWorkerParam: { scope: '/onesignal/' },
            notifyButton: { enable: false },
            welcomeNotification: { disable: true },
            autoResubscribe: true,
          })
          resolve(OneSignal)
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  return window.__shadowOneSignalReadyPromise
}

async function matchReaderIdentity(oneSignal, userId) {
  identityQueue = identityQueue.catch(() => {}).then(async () => {
    const activeId = String(oneSignal.User.externalId || '')
    if (userId) {
      if (activeId !== userId) await oneSignal.login(userId)
    } else if (activeId) {
      await oneSignal.logout()
    }
  })

  await identityQueue
}

export async function syncReaderOneSignalIdentity() {
  if (!hasPushDevice() && !window.__shadowOneSignalReadyPromise) return false

  const oneSignal = await loadReaderOneSignal()
  if (!oneSignal) return false

  await matchReaderIdentity(oneSignal, getReaderId())
  return true
}

export async function prepareReaderStoryPush() {
  const userId = getReaderId()
  if (!userId) return null

  const oneSignal = await loadReaderOneSignal()
  if (!oneSignal || !oneSignal.Notifications.isPushSupported()) return null

  await matchReaderIdentity(oneSignal, userId)
  return oneSignal
}

export async function enableReaderStoryPush() {
  const oneSignal = await prepareReaderStoryPush()
  if (!oneSignal) return false
  if (getReaderId() !== String(oneSignal.User.externalId || '')) return false

  await oneSignal.User.PushSubscription.optIn()
  const enabled = Boolean(
    oneSignal.Notifications.permission && oneSignal.User.PushSubscription.optedIn
  )

  if (enabled) rememberPushDevice()
  return enabled
}
