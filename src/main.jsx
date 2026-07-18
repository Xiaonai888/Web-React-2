import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const APP_UPDATE_CHECK_INTERVAL_MS = 60000
let appUpdateCheckRunning = false
let lastAppUpdateCheckAt = 0

async function checkForAppUpdate({ force = false } = {}) {
  if (appUpdateCheckRunning) return

  const now = Date.now()

  if (!force && now - lastAppUpdateCheckAt < APP_UPDATE_CHECK_INTERVAL_MS) {
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

    if (remoteVersion && currentVersion && remoteVersion !== currentVersion) {
      window.location.reload()
    }
  } catch {
    return
  } finally {
    appUpdateCheckRunning = false
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}

window.addEventListener('load', () => {
  window.setTimeout(() => checkForAppUpdate({ force: true }), 1200)
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
}, APP_UPDATE_CHECK_INTERVAL_MS)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
