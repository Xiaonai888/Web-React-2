import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useLocation } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const MIN_RECONNECT_MS = 10 * 1000
const MAX_RECONNECT_MS = 2 * 60 * 1000
const VISIBLE_SYNC_INTERVAL_MS = 60 * 1000
const AuthorPageNotificationContext = createContext(null)

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') ||
    localStorage.getItem('shadow_reader_token') || ''
}

function parseSseBlock(block) {
  let eventName = 'message'
  const dataLines = []

  for (const line of block.split('\n')) {
    if (!line || line.startsWith(':')) continue
    const separator = line.indexOf(':')
    const field = separator < 0 ? line : line.slice(0, separator)
    const raw = separator < 0 ? '' : line.slice(separator + 1)
    const value = raw.startsWith(' ') ? raw.slice(1) : raw
    if (field === 'event') eventName = value || 'message'
    if (field === 'data') dataLines.push(value)
  }

  return { eventName, data: dataLines.join('\n') }
}

async function requestUnreadCount(token) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/authors/me/page-notifications/unread-count`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }
    )

    if (response.status === 401 || response.status === 403) {
      return { ok: false, authError: true, count: 0, hasAuthorPage: false }
    }

    const data = await response.json().catch(() => ({}))
    if (!response.ok || data.ok === false) {
      return { ok: false, authError: false, count: 0, hasAuthorPage: false }
    }

    return {
      ok: true,
      authError: false,
      count: Math.max(0, Number(data.unread_count || 0)),
      hasAuthorPage: data.has_author_page !== false,
    }
  } catch {
    return { ok: false, authError: false, count: 0, hasAuthorPage: false }
  }
}

async function consumeStream(response, onEvent, isCancelled) {
  const reader = response.body?.getReader()
  if (!reader) throw new Error('Notification stream unavailable')
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (!isCancelled()) {
      const { value, done } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      buffer = buffer.replace(/\r\n/g, '\n')
      let boundary = buffer.indexOf('\n\n')

      while (boundary >= 0) {
        const block = buffer.slice(0, boundary).trim()
        buffer = buffer.slice(boundary + 2)
        if (block) {
          const { eventName, data } = parseSseBlock(block)
          onEvent(eventName, data)
        }
        boundary = buffer.indexOf('\n\n')
      }
    }
  } finally {
    try {
      reader.releaseLock()
    } catch {}
  }
}

export function AuthorPageNotificationProvider({ children }) {
  const location = useLocation()
  const [sessionToken, setSessionToken] = useState(getReaderToken)
  const [authorUnreadCount, setAuthorUnreadCountState] = useState(0)
  const [hasAuthorPage, setHasAuthorPage] = useState(false)
  const [connectionState, setConnectionState] = useState('idle')
  const [lastCreatedNotification, setLastCreatedNotification] = useState(null)
  const [visible, setVisible] = useState(() => document.visibilityState === 'visible')
  const [online, setOnline] = useState(() => navigator.onLine)
  const unreadRequestRef = useRef(null)
  const lastVisibleSyncAtRef = useRef(0)

  const setAuthorUnreadCount = useCallback((value) => {
    setAuthorUnreadCountState(Math.max(0, Number(value || 0)))
  }, [])

  const adjustAuthorUnreadCount = useCallback((delta) => {
    const amount = Number(delta || 0)
    if (!Number.isFinite(amount)) return
    setAuthorUnreadCountState((current) => Math.max(0, current + amount))
  }, [])

  const syncAuthorUnreadCount = useCallback(async () => {
    const token = getReaderToken()
    if (!token) {
      setAuthorUnreadCountState(0)
      setHasAuthorPage(false)
      return 0
    }

    if (unreadRequestRef.current?.token === token) {
      return unreadRequestRef.current.promise
    }

    const promise = requestUnreadCount(token)
      .then((result) => {
        if (token !== getReaderToken()) return null
        if (!result.ok) return null
        setAuthorUnreadCountState(result.count)
        setHasAuthorPage(result.hasAuthorPage)
        return result.count
      })
      .finally(() => {
        if (unreadRequestRef.current?.promise === promise) {
          unreadRequestRef.current = null
        }
      })

    unreadRequestRef.current = { token, promise }
    return promise
  }, [])

  useEffect(() => {
    const refreshToken = () => {
      const nextToken = getReaderToken()
      setSessionToken((current) => current === nextToken ? current : nextToken)
    }
    refreshToken()
    window.addEventListener('storage', refreshToken)
    return () => window.removeEventListener('storage', refreshToken)
  }, [location.pathname])

  useEffect(() => {
    if (!sessionToken) {
      setAuthorUnreadCountState(0)
      setHasAuthorPage(false)
      setLastCreatedNotification(null)
      setConnectionState('idle')
      return
    }
    setHasAuthorPage(false)
    setLastCreatedNotification(null)
    setConnectionState('idle')
    if (visible && online) {
      lastVisibleSyncAtRef.current = Date.now()
      void syncAuthorUnreadCount()
    }
  }, [sessionToken, syncAuthorUnreadCount])

  useEffect(() => {
    const updateVisible = () => setVisible(document.visibilityState === 'visible')
    const updateOnline = () => setOnline(navigator.onLine)
    document.addEventListener('visibilitychange', updateVisible)
    window.addEventListener('online', updateOnline)
    window.addEventListener('offline', updateOnline)
    return () => {
      document.removeEventListener('visibilitychange', updateVisible)
      window.removeEventListener('online', updateOnline)
      window.removeEventListener('offline', updateOnline)
    }
  }, [])

  useEffect(() => {
    let previousVisibility = document.visibilityState
    let previousOnline = navigator.onLine

    const handleVisible = () => {
      const nextToken = getReaderToken()
      const visibleNow = document.visibilityState === 'visible'
      const onlineNow = navigator.onLine
      const resumed = previousVisibility !== 'visible' || !previousOnline
      previousVisibility = document.visibilityState
      previousOnline = onlineNow
      setSessionToken((current) => current === nextToken ? current : nextToken)
      if (!visibleNow || !onlineNow || !nextToken) return
      const now = Date.now()
      if (!resumed && now - lastVisibleSyncAtRef.current < VISIBLE_SYNC_INTERVAL_MS) return
      lastVisibleSyncAtRef.current = now
      void syncAuthorUnreadCount()
    }

    window.addEventListener('focus', handleVisible)
    document.addEventListener('visibilitychange', handleVisible)
    window.addEventListener('online', handleVisible)
    window.addEventListener('offline', handleVisible)
    return () => {
      window.removeEventListener('focus', handleVisible)
      document.removeEventListener('visibilitychange', handleVisible)
      window.removeEventListener('online', handleVisible)
      window.removeEventListener('offline', handleVisible)
    }
  }, [syncAuthorUnreadCount])

  useEffect(() => {
    if (!sessionToken || !hasAuthorPage || !visible || !online) {
      setConnectionState(!online ? 'offline' : 'idle')
      return
    }

    let cancelled = false
    let activeController = null
    let retryTimer = null
    let resolveDelay = null

    const delay = (ms) => new Promise((resolve) => {
      resolveDelay = resolve
      retryTimer = window.setTimeout(() => {
        retryTimer = null
        resolveDelay = null
        resolve()
      }, ms)
    })

    const handleSseEvent = (name, rawData) => {
      if (cancelled || name !== 'author-page-notification') return
      let payload
      try {
        payload = JSON.parse(rawData || '{}')
      } catch {
        return
      }
      if (payload?.action !== 'created') return
      const delta = Number(payload.unread_delta ?? 1)
      setAuthorUnreadCountState((current) =>
        Math.max(0, current + (Number.isFinite(delta) ? delta : 1))
      )
      if (payload.notification) setLastCreatedNotification(payload.notification)
    }

    const run = async () => {
      let failures = 0
      let reconcile = false
      while (!cancelled && getReaderToken() === sessionToken) {
        if (reconcile) {
          const result = await requestUnreadCount(sessionToken)
          if (cancelled) return
          if (result.authError || !result.hasAuthorPage && result.ok) {
            setConnectionState('idle')
            if (result.ok) setHasAuthorPage(false)
            return
          }
          if (!result.ok) {
            setConnectionState('disconnected')
            failures += 1
            await delay(Math.min(MAX_RECONNECT_MS, MIN_RECONNECT_MS * 2 ** Math.min(failures - 1, 4)))
            continue
          }
          setAuthorUnreadCountState(result.count)
          reconcile = false
        }

        activeController = new AbortController()
        try {
          setConnectionState('connecting')
          const response = await fetch(
            `${API_BASE_URL}/api/authors/me/page-notifications/stream`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${sessionToken}`,
                Accept: 'text/event-stream',
              },
              cache: 'no-store',
              signal: activeController.signal,
            }
          )
          if (cancelled) return
          if (response.status === 401 || response.status === 403) {
            setConnectionState('idle')
            return
          }
          if (!response.ok || !response.body) {
            throw new Error('Notification stream connection failed')
          }
          setConnectionState('connected')
          const connectedAt = Date.now()
          await consumeStream(response, handleSseEvent, () => cancelled)
          if (Date.now() - connectedAt >= 60 * 1000) failures = 0
        } catch (error) {
          if (cancelled || error?.name === 'AbortError') return
        } finally {
          activeController?.abort()
          activeController = null
        }
        if (cancelled) return
        setConnectionState('disconnected')
        reconcile = true
        failures += 1
        await delay(Math.min(MAX_RECONNECT_MS, MIN_RECONNECT_MS * 2 ** Math.min(failures - 1, 4)))
      }
    }

    void run()
    return () => {
      cancelled = true
      activeController?.abort()
      if (retryTimer !== null) window.clearTimeout(retryTimer)
      resolveDelay?.()
      resolveDelay = null
    }
  }, [sessionToken, hasAuthorPage, visible, online])

  const value = useMemo(() => ({
    authorUnreadCount,
    hasAuthorUnread: authorUnreadCount > 0,
    connectionState,
    lastCreatedNotification,
    setAuthorUnreadCount,
    adjustAuthorUnreadCount,
    syncAuthorUnreadCount,
  }), [
    authorUnreadCount,
    connectionState,
    lastCreatedNotification,
    setAuthorUnreadCount,
    adjustAuthorUnreadCount,
    syncAuthorUnreadCount,
  ])

  return (
    <AuthorPageNotificationContext.Provider value={value}>
      {children}
    </AuthorPageNotificationContext.Provider>
  )
}

export function useAuthorPageNotifications() {
  const context = useContext(AuthorPageNotificationContext)
  if (!context) {
    throw new Error('useAuthorPageNotifications must be used inside AuthorPageNotificationProvider')
  }
  return context
}
