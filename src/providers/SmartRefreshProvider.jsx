import { createContext, useEffect, useMemo, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const MIN_CHECK_INTERVAL_MS = 60000
const STORAGE_KEY = 'shadow_content_versions'

export const SmartRefreshContext = createContext(null)

function getRouteRefreshKeys(pathname) {
  if (pathname === '/') return ['home', 'slides', 'banners', 'genres', 'stories']
  if (pathname === '/genres' || pathname.startsWith('/genre/')) return ['genres', 'stories']
  if (pathname.startsWith('/story/')) return ['stories']
  if (pathname.startsWith('/shop')) return ['shop']
  if (pathname.startsWith('/author/page')) return ['authors', 'shop']
  if (pathname.startsWith('/author/')) return ['authors', 'stories']
  if (pathname === '/library') return ['library']
  if (pathname === '/notifications' || pathname.startsWith('/notifications/')) return ['notifications']
  if (pathname === '/comments') return ['comments']
  if (pathname === '/tasks' || pathname.startsWith('/tasks/')) return []
  if (pathname === '/ranking' || pathname === '/top-novel') return ['ranking', 'stories']
  if (pathname === '/me' || pathname.startsWith('/profile')) return ['me']

  if (
    pathname === '/discover' ||
    pathname === '/new-arrivals' ||
    pathname === '/completed' ||
    pathname === '/update-today' ||
    pathname === '/daily-picks' ||
    pathname === '/you-might-like' ||
    pathname === '/most-read-this-week'
  ) {
    return ['stories']
  }

  return ['global']
}

function loadStoredVersions() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveStoredVersions(versions) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(versions || {}))
  } catch {
    return
  }
}

export function SmartRefreshProvider({ children }) {
  const location = useLocation()
  const versionsRef = useRef(loadStoredVersions())
  const lastCheckAtRef = useRef(0)
  const checkingRef = useRef(false)
  const pathnameRef = useRef(location.pathname)

  useEffect(() => {
    pathnameRef.current = location.pathname
  }, [location.pathname])

  const value = useMemo(() => ({
    getKeysForPath: getRouteRefreshKeys,
  }), [])

  async function checkCurrentPageVersion({ force = false } = {}) {
    if (checkingRef.current) return

    const now = Date.now()

    if (!force && now - lastCheckAtRef.current < MIN_CHECK_INTERVAL_MS) {
      return
    }

    const pathname = pathnameRef.current
    const keys = getRouteRefreshKeys(pathname)

    if (!keys.length) return

    checkingRef.current = true
    lastCheckAtRef.current = now

    try {
      const url = new URL(`${API_URL}/api/public/content-versions`)
      url.searchParams.set('keys', keys.join(','))

      const response = await fetch(url.toString(), {
        method: 'GET',
        cache: 'no-store',
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false || !data.versions) {
        return
      }

      const oldVersions = versionsRef.current || {}
      const nextVersions = {
        ...oldVersions,
        ...data.versions,
      }

      const hasKnownOldVersion = keys.some((key) => oldVersions[key])
      const hasChanged = hasKnownOldVersion && keys.some((key) => {
      const oldVersion = Number(oldVersions[key]?.version || 0)
      const nextVersion = Number(data.versions[key]?.version || 0)

  return oldVersion > 0 && nextVersion > 0 && oldVersion !== nextVersion
})

      versionsRef.current = nextVersions
      saveStoredVersions(nextVersions)

      if (hasChanged) {
        window.location.reload()
      }
    } catch {
      return
    } finally {
      checkingRef.current = false
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      checkCurrentPageVersion()
    }, 250)

    return () => window.clearTimeout(timer)
  }, [location.pathname])

  useEffect(() => {
    function handleVisibleAgain() {
      if (document.visibilityState === 'visible') {
        checkCurrentPageVersion()
      }
    }

    function handleFocus() {
      checkCurrentPageVersion()
    }

    document.addEventListener('visibilitychange', handleVisibleAgain)
    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibleAgain)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  return (
    <SmartRefreshContext.Provider value={value}>
      {children}
    </SmartRefreshContext.Provider>
  )
}
