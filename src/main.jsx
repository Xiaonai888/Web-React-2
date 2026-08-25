import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppErrorBoundary from './components/AppErrorBoundary.jsx'
import { installApiAuthFetch } from './utils/installApiAuthFetch'
import { installPaidContentRequirementFetch } from './utils/installPaidContentRequirementFetch'
import { installHomePublicCacheFetch } from './utils/installHomePublicCacheFetch'
import { installReaderEpisodeCacheFetch } from './utils/installReaderEpisodeCacheFetch'
import { installReaderPresenceTracking } from './utils/installReaderPresenceTracking'

installApiAuthFetch()
installPaidContentRequirementFetch()
installHomePublicCacheFetch()
installReaderEpisodeCacheFetch()
installReaderPresenceTracking()

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault()
  window.__shadowInstallPrompt = event
  window.dispatchEvent(new Event('shadow-install-ready'))
})

window.addEventListener('appinstalled', () => {
  window.__shadowInstallPrompt = null
  window.dispatchEvent(new Event('shadow-app-installed'))
})

const APP_UPDATE_MIN_CHECK_GAP_MS = 60 * 1000
const APP_UPDATE_POLL_INTERVAL_MS = 5 * 60 * 1000

let appUpdateCheckRunning = false
let lastAppUpdateCheckAt = 0

async function checkForAppUpdate({ force = false } = {}) {
  if (appUpdateCheckRunning) return

  const now = Date.now()

  if (
    !force &&
    now - lastAppUpdateCheckAt < APP_UPDATE_MIN_CHECK_GAP_MS
  ) {
    return
  }

  appUpdateCheckRunning = true
  lastAppUpdateCheckAt = now

  try {
    const response = await fetch(`/app-version.json?t=${now}`, {
      cache: 'no-store',
    })

    if (!response.ok) return

    const data = await response.json()
    const remoteVersion = String(data?.version || '')
    const currentVersion = String(__APP_BUILD_VERSION__ || '')

    if (
      remoteVersion &&
      currentVersion &&
      remoteVersion !== currentVersion
    ) {
      window.location.reload()
    }
  } catch {
    return
  } finally {
    appUpdateCheckRunning = false
  }
}

const LEGACY_SW_RESET_VERSION = '20260818-1'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then(async (registrations) => {
      if (!registrations.length) return

      const registration = await navigator.serviceWorker.register(
        `/sw.js?v=${LEGACY_SW_RESET_VERSION}`,
        {
          scope: '/',
          updateViaCache: 'none',
        }
      )

      await registration.update()
    })
    .catch(() => {})
}

window.addEventListener('load', () => {
  window.setTimeout(
    () => checkForAppUpdate({ force: true }),
    1200
  )
})

window.addEventListener('focus', () => {
  checkForAppUpdate()
})

window.addEventListener('online', () => {
  checkForAppUpdate({ force: true })
})

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    checkForAppUpdate()
  }
})

window.setInterval(() => {
  if (document.visibilityState === 'visible') {
    checkForAppUpdate({ force: true })
  }
}, APP_UPDATE_POLL_INTERVAL_MS)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
)
