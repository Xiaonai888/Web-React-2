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
import { loadReaderEpisodeCache } from './utils/readerEpisodeCache'

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

const MANGA_CACHE_SW_VERSION = '20260825-1'

function getReaderTokenForCacheScope() {
  return (
    sessionStorage.getItem('shadow_reader_token') ||
    localStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function fingerprintReaderToken(token) {
  const value = String(token || '').trim()
  if (!value) return 'public'

  let hash = 2166136261

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return `reader-${(hash >>> 0).toString(36)}`
}

function getReaderRouteContext() {
  const match = window.location.pathname.match(
    /^\/story\/([^/]+)\/episode\/([^/]+)/
  )

  if (!match) return null

  try {
    return {
      storyId: decodeURIComponent(match[1]),
      episodeId: decodeURIComponent(match[2]),
    }
  } catch {
    return {
      storyId: match[1],
      episodeId: match[2],
    }
  }
}

async function notifyMangaCacheReaderContext() {
  if (!('serviceWorker' in navigator)) return

  const route = getReaderRouteContext()
  if (!route) return

  const worker = navigator.serviceWorker.controller
  if (!worker) return

  const scope = fingerprintReaderToken(
    getReaderTokenForCacheScope()
  )

  worker.postMessage({
    type: 'SHADOW_READER_CONTEXT',
    scope,
    storyId: route.storyId,
    episodeId: route.episodeId,
  })

  let payload = await loadReaderEpisodeCache({
    storyType: 'manga',
    storyId: route.storyId,
    episodeId: route.episodeId,
    privateAccess: false,
    scope: 'public',
  })

  if (!payload && scope !== 'public') {
    payload = await loadReaderEpisodeCache({
      storyType: 'manga',
      storyId: route.storyId,
      episodeId: route.episodeId,
      privateAccess: true,
      scope,
    })
  }

  if (
    payload?.story?.story_type !== 'manga' &&
    payload?.episode?.story_type !== 'manga'
  ) {
    return
  }

  worker.postMessage({
    type: 'SHADOW_MANGA_EPISODE_PAYLOAD',
    scope,
    storyId: route.storyId,
    episodeId: route.episodeId,
    payload,
  })
}

function installReaderRouteContextTracking() {
  if (window.__shadowReaderRouteContextTrackingInstalled) return

  window.__shadowReaderRouteContextTrackingInstalled = true

  for (const methodName of ['pushState', 'replaceState']) {
    const original = window.history[methodName]

    window.history[methodName] = function shadowHistoryMethod(...args) {
      const result = original.apply(this, args)
      window.dispatchEvent(new Event('shadow-reader-route-change'))
      return result
    }
  }

  window.addEventListener('popstate', () => {
    window.dispatchEvent(new Event('shadow-reader-route-change'))
  })

  window.addEventListener(
    'shadow-reader-route-change',
    notifyMangaCacheReaderContext
  )
}

installReaderRouteContextTracking()

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register(`/sw.js?v=${MANGA_CACHE_SW_VERSION}`, {
      scope: '/',
      updateViaCache: 'none',
    })
    .then(async (registration) => {
      await registration.update()
      notifyMangaCacheReaderContext()
    })
    .catch(() => {})

  navigator.serviceWorker.addEventListener(
    'controllerchange',
    notifyMangaCacheReaderContext
  )
}

window.addEventListener('load', () => {
  notifyMangaCacheReaderContext()

  window.setTimeout(
    () => checkForAppUpdate({ force: true }),
    1200
  )
})

window.addEventListener('focus', () => {
  notifyMangaCacheReaderContext()
  checkForAppUpdate()
})

window.addEventListener('online', () => {
  notifyMangaCacheReaderContext()
  checkForAppUpdate({ force: true })
})

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    notifyMangaCacheReaderContext()
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
