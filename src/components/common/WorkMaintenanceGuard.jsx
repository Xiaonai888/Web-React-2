import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import MaintenancePage, {
  isWorkCircuitOpenPayload,
} from './MaintenancePage'

const API_BASE_URL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const CHECK_TIMEOUT_MS = 4000

function normalizePath(value) {
  const raw = String(value || '/').split('?')[0] || '/'
  const path = raw.startsWith('/') ? raw : `/${raw}`
  return path.replace(/\/{2,}/g, '/')
}

function pathMatches(patternValue, pathValue) {
  const pattern = normalizePath(patternValue)
  const path = normalizePath(pathValue)

  if (pattern === path) return true

  const patternParts = pattern.split('/').filter(Boolean)
  const pathParts = path.split('/').filter(Boolean)

  if (patternParts.length !== pathParts.length) return false

  return patternParts.every((part, index) => {
    if (part === ':id') return Boolean(pathParts[index])
    return part === pathParts[index]
  })
}

function retrySecondsFromExpiry(expiresAt) {
  if (!expiresAt) return 0

  const expiresMs = new Date(expiresAt).getTime()

  if (!Number.isFinite(expiresMs)) return 0

  return Math.max(
    1,
    Math.ceil((expiresMs - Date.now()) / 1000)
  )
}

function retrySecondsFromResponse(response, payload) {
  const headerValue = response.headers.get('Retry-After')
  const headerSeconds = Number(headerValue)

  if (Number.isFinite(headerSeconds) && headerSeconds > 0) {
    return Math.ceil(headerSeconds)
  }

  const payloadSeconds = Number(payload?.retry_after_seconds)

  if (Number.isFinite(payloadSeconds) && payloadSeconds > 0) {
    return Math.ceil(payloadSeconds)
  }

  return 0
}

export default function WorkMaintenanceGuard({ children }) {
  const location = useLocation()
  const offlineRequested =
    new URLSearchParams(location.search).get('_shadow_offline') === '1'
  const [checking, setChecking] = useState(() => !offlineRequested)
  const [checkedPath, setCheckedPath] = useState(() =>
    offlineRequested ? location.pathname : ''
  )
  const [maintenance, setMaintenance] = useState(null)

  useEffect(() => {
    if (offlineRequested) {
      setChecking(false)
      setMaintenance(null)
      setCheckedPath(location.pathname)
      return undefined
    }

    let active = true
    const controller = new AbortController()
    const timeout = setTimeout(
      () => controller.abort(),
      CHECK_TIMEOUT_MS
    )

    setChecking(true)
    setMaintenance(null)

    async function checkPageMaintenance() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/health/maintenance`,
          {
            cache: 'no-store',
            signal: controller.signal,
          }
        )

        if (!response.ok) return

        const data = await response.json().catch(() => ({}))
        const switches = Array.isArray(data.switches)
          ? data.switches
          : []

        const matched = switches.find((record) =>
          pathMatches(record?.path, location.pathname)
        )

        if (!active || !matched) return

        setMaintenance({
          retryAfterSeconds: retrySecondsFromExpiry(
            matched.expires_at
          ),
        })
      } catch {
      } finally {
        clearTimeout(timeout)

        if (active) {
          setCheckedPath(location.pathname)
          setChecking(false)
        }
      }
    }

    void checkPageMaintenance()

    return () => {
      active = false
      clearTimeout(timeout)
      controller.abort()
    }
  }, [location.pathname, offlineRequested])

  useEffect(() => {
    if (offlineRequested) return undefined

    const originalFetch = window.fetch.bind(window)

    const guardedFetch = async (...args) => {
      const response = await originalFetch(...args)

      if (response.status !== 503) {
        return response
      }

      try {
        const payload = await response.clone().json()

        if (isWorkCircuitOpenPayload(payload)) {
          setMaintenance({
            retryAfterSeconds: retrySecondsFromResponse(
              response,
              payload
            ),
          })
        }
      } catch {
      }

      return response
    }

    window.fetch = guardedFetch

    return () => {
      if (window.fetch === guardedFetch) {
        window.fetch = originalFetch
      }
    }
  }, [offlineRequested])

  if (offlineRequested) {
    return children
  }

  if (maintenance) {
    return (
      <MaintenancePage
        retryAfterSeconds={maintenance.retryAfterSeconds}
      />
    )
  }

  if (checking || checkedPath !== location.pathname) {
    return (
      <div className="app-page flex min-h-screen items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-[var(--shadow-border)] border-t-[var(--shadow-text-primary)]" />
      </div>
    )
  }

  return children
}
