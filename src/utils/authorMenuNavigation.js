import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAuthToken } from '../config/api'

const FLOW_KEY = 'shadow_author_menu_navigation_v1'
const RESTORE_KEY = 'authorMenuRestore'
const ROOTS = new Set(['/author/page/pre-order', '/author/page/finance', '/author/page-settings'])

function accountKey() {
  const token = getAuthToken()
  if (!token) return ''
  let hash = 2166136261
  for (let i = 0; i < token.length; i += 1) {
    hash = Math.imul(hash ^ token.charCodeAt(i), 16777619)
  }
  return `${(hash >>> 0).toString(36)}:${token.length}`
}

function readFlow() {
  try {
    const flow = JSON.parse(sessionStorage.getItem(FLOW_KEY) || 'null')
    const account = accountKey()
    if (!account || !flow || flow.account !== account || !ROOTS.has(flow.root)) return null
    return flow
  } catch {
    return null
  }
}

function clearFlow() {
  try {
    sessionStorage.removeItem(FLOW_KEY)
  } catch {}
}

function locationPath(location) {
  return `${location.pathname}${location.search || ''}${location.hash || ''}`
}

function validOrigin(pathname, source) {
  if (source === 'store') return pathname === '/author/page/store'
  return source === 'page' && /^\/author\/page(?:\/[^/]+)?$/.test(pathname) && !ROOTS.has(pathname) && pathname !== '/author/page/store'
}

function insideFlow(location, flow) {
  const path = location.pathname
  if (locationPath(location) === flow.origin) return location.state?.[RESTORE_KEY]?.id === flow.restore?.id
  if (path === flow.root || path.startsWith(`${flow.root}/`)) return true
  if (flow.root === '/author/page-settings') {
    return path === '/author/comment-protection' || path.startsWith('/author/comment-protection/')
  }
  if (flow.root === '/author/page/finance' && path === '/author/payment-method') {
    const back = new URLSearchParams(location.search).get('back') || ''
    return back === '/author/page/finance' || back.startsWith('/author/page/finance/')
  }
  return false
}

function historyIndex() {
  const index = window.history.state?.idx
  return Number.isSafeInteger(index) && index >= 0 ? index : null
}

export function beginAuthorMenuNavigation({ navigate, location, destination, source, activeTab }) {
  if (!ROOTS.has(destination)) return
  const account = accountKey()
  if (!account || !validOrigin(location.pathname, source)) {
    clearFlow()
    navigate(destination)
    return
  }

  const restore = {
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    source,
    activeTab,
    scrollY: Math.max(0, window.scrollY || 0),
  }
  const origin = locationPath(location)
  const flow = {
    account,
    root: destination,
    origin,
    originIndex: historyIndex(),
    restore,
  }

  try {
    sessionStorage.setItem(FLOW_KEY, JSON.stringify(flow))
  } catch {
    navigate(destination)
    return
  }

  navigate(origin, {
    replace: true,
    state: { ...location.state, [RESTORE_KEY]: restore },
  })
  navigate(destination)
}

export function readAuthorMenuRestore(location, source) {
  const flow = readFlow()
  const marker = location.state?.[RESTORE_KEY]
  if (!flow || !marker || flow.restore?.id !== marker.id || flow.restore?.source !== source) return null
  if (!validOrigin(location.pathname, source) || locationPath(location) !== flow.origin) return null
  return flow.restore
}

export function consumeAuthorMenuRestore({ navigate, location, source }) {
  const restore = readAuthorMenuRestore(location, source)
  if (!restore) return null
  clearFlow()
  const state = { ...location.state }
  delete state[RESTORE_KEY]
  navigate(locationPath(location), { replace: true, state })
  return restore
}

export function AuthorMenuNavigationGuard() {
  const location = useLocation()
  useEffect(() => {
    const flow = readFlow()
    if (!flow || !insideFlow(location, flow)) clearFlow()
  }, [location.key, location.pathname, location.search, location.hash])
  return null
}

export function useAuthorMenuReturn() {
  const navigate = useNavigate()
  const location = useLocation()

  return (fallback) => {
    const flow = readFlow()
    if (!flow || location.pathname !== flow.root) {
      fallback()
      return
    }

    const index = historyIndex()
    if (index !== null && flow.originIndex !== null && index > flow.originIndex) {
      navigate(flow.originIndex - index)
      return
    }

    navigate(flow.origin, {
      replace: true,
      state: { [RESTORE_KEY]: flow.restore },
    })
  }
}

export function useAuthorMenuRestore({
  source,
  ready,
  setActiveTab,
  setMenuOpen,
}) {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!ready) return undefined

    const restore = readAuthorMenuRestore(location, source)
    if (!restore) return undefined

    const tabs = source === 'store'
      ? ['Records', 'Orders']
      : ['Posts', 'Works', 'Reel', 'Store']

    if (tabs.includes(restore.activeTab)) {
      setActiveTab(restore.activeTab)
    }

    let secondFrame = 0

    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        window.scrollTo(0, restore.scrollY || 0)
        setMenuOpen(true)

        consumeAuthorMenuRestore({
          navigate,
          location,
          source,
        })
      })
    })

    return () => {
      window.cancelAnimationFrame(firstFrame)
      window.cancelAnimationFrame(secondFrame)
    }
  }, [location, navigate, source, ready, setActiveTab, setMenuOpen])
}
