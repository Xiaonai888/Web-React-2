import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useLocation } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const RECONNECT_DELAY_MS = 5000

const AuthorPageNotificationContext =
  createContext(null)

function getReaderToken() {
  return (
    sessionStorage.getItem(
      'shadow_reader_token'
    ) ||
    localStorage.getItem(
      'shadow_reader_token'
    ) ||
    ''
  )
}

function sleep(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function parseSseBlock(block) {
  let eventName = 'message'
  const dataLines = []

  for (const line of block.split('\n')) {
    if (!line || line.startsWith(':')) {
      continue
    }

    const separatorIndex =
      line.indexOf(':')
    const field =
      separatorIndex >= 0
        ? line.slice(0, separatorIndex)
        : line
    const rawValue =
      separatorIndex >= 0
        ? line.slice(separatorIndex + 1)
        : ''
    const value =
      rawValue.startsWith(' ')
        ? rawValue.slice(1)
        : rawValue

    if (field === 'event') {
      eventName = value || 'message'
    }

    if (field === 'data') {
      dataLines.push(value)
    }
  }

  return {
    eventName,
    data: dataLines.join('\n'),
  }
}

async function requestUnreadCount(token) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/authors/me/page-notifications/unread-count`,
      {
        method: 'GET',
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
        cache: 'no-store',
      }
    )

    if (
      response.status === 401 ||
      response.status === 403
    ) {
      return {
        ok: false,
        authError: true,
        count: 0,
      }
    }

    const data =
      await response
        .json()
        .catch(() => ({}))

    if (
      !response.ok ||
      data.ok === false
    ) {
      return {
        ok: false,
        authError: false,
        count: 0,
      }
    }

    return {
      ok: true,
      authError: false,
      count: Math.max(
        0,
        Number(
          data.unread_count || 0
        )
      ),
    }
  } catch {
    return {
      ok: false,
      authError: false,
      count: 0,
    }
  }
}

export function AuthorPageNotificationProvider({
  children,
}) {
  const location = useLocation()
  const [
    sessionToken,
    setSessionToken,
  ] = useState(() =>
    getReaderToken()
  )
  const [
    authorUnreadCount,
    setAuthorUnreadCountState,
  ] = useState(0)
  const [
    connectionState,
    setConnectionState,
  ] = useState('idle')
  const [
    lastCreatedNotification,
    setLastCreatedNotification,
  ] = useState(null)

  const setAuthorUnreadCount =
    useCallback((value) => {
      setAuthorUnreadCountState(
        Math.max(
          0,
          Number(value || 0)
        )
      )
    }, [])

  const adjustAuthorUnreadCount =
    useCallback((delta) => {
      const amount =
        Number(delta || 0)

      if (!Number.isFinite(amount)) {
        return
      }

      setAuthorUnreadCountState(
        (current) =>
          Math.max(
            0,
            current + amount
          )
      )
    }, [])

  const syncAuthorUnreadCount =
    useCallback(async () => {
      const token = getReaderToken()

      if (!token) {
        setAuthorUnreadCountState(0)
        return 0
      }

      const result =
        await requestUnreadCount(token)

      if (result.ok) {
        setAuthorUnreadCountState(
          result.count
        )
        return result.count
      }

      return null
    }, [])

  useEffect(() => {
    const refreshSessionToken = () => {
      const nextToken =
        getReaderToken()

      setSessionToken(
        (current) =>
          current === nextToken
            ? current
            : nextToken
      )
    }

    refreshSessionToken()
  }, [location.pathname])

  useEffect(() => {
    const refreshSessionToken = () => {
      const nextToken =
        getReaderToken()

      setSessionToken(
        (current) =>
          current === nextToken
            ? current
            : nextToken
      )
    }

    let lastVisibleSyncAt = 0

const handleVisible = () => {
  if (
    document.visibilityState !==
    'visible'
  ) {
    return
  }

  refreshSessionToken()

  const now = Date.now()

  if (
    now - lastVisibleSyncAt <
    1000
  ) {
    return
  }

  lastVisibleSyncAt = now
  syncAuthorUnreadCount()
}

    window.addEventListener(
      'storage',
      refreshSessionToken
    )
    window.addEventListener(
  'focus',
  handleVisible
)
    document.addEventListener(
      'visibilitychange',
      handleVisible
    )

    return () => {
      window.removeEventListener(
        'storage',
        refreshSessionToken
      )
      window.removeEventListener(
  'focus',
  handleVisible
)
      document.removeEventListener(
        'visibilitychange',
        handleVisible
      )
    }
  }, [syncAuthorUnreadCount])

  useEffect(() => {
    if (!sessionToken) {
      setAuthorUnreadCountState(0)
      setConnectionState('idle')
      setLastCreatedNotification(null)
      return undefined
    }

    let cancelled = false
    let activeController = null

    const handleSseEvent = (
      eventName,
      rawData
    ) => {
      if (
        eventName !==
        'author-page-notification'
      ) {
        return
      }

      let payload = null

      try {
        payload = JSON.parse(
          rawData || '{}'
        )
      } catch {
        return
      }

      if (
        payload?.action !==
        'created'
      ) {
        return
      }

      const delta = Number(
        payload.unread_delta || 1
      )

      setAuthorUnreadCountState(
        (current) =>
          Math.max(
            0,
            current +
              (Number.isFinite(delta)
                ? delta
                : 1)
          )
      )

      if (payload.notification) {
        setLastCreatedNotification(
          payload.notification
        )
      }
    }

    const consumeStream =
      async (response) => {
        const reader =
          response.body?.getReader()

        if (!reader) {
          throw new Error(
            'Notification stream unavailable'
          )
        }

        const decoder =
          new TextDecoder()
        let buffer = ''

        try {
          while (!cancelled) {
            const {
              value,
              done,
            } = await reader.read()

            if (done) break

            buffer +=
              decoder.decode(
                value,
                {
                  stream: true,
                }
              )

            buffer =
              buffer.replace(
                /\r\n/g,
                '\n'
              )

            let boundary =
              buffer.indexOf(
                '\n\n'
              )

            while (
              boundary >= 0
            ) {
              const block =
                buffer
                  .slice(
                    0,
                    boundary
                  )
                  .trim()

              buffer =
                buffer.slice(
                  boundary + 2
                )

              if (block) {
                const {
                  eventName,
                  data,
                } =
                  parseSseBlock(
                    block
                  )

                handleSseEvent(
                  eventName,
                  data
                )
              }

              boundary =
                buffer.indexOf(
                  '\n\n'
                )
            }
          }
        } finally {
          try {
            reader.releaseLock()
          } catch {}
        }
      }

    const run = async () => {
      let needsReconcile = true

      while (
        !cancelled &&
        getReaderToken() ===
          sessionToken
      ) {
        if (!navigator.onLine) {
          setConnectionState(
            'offline'
          )
          await sleep(
            RECONNECT_DELAY_MS
          )
          continue
        }

        if (needsReconcile) {
          const result =
            await requestUnreadCount(
              sessionToken
            )

          if (cancelled) return

          if (result.authError) {
            setConnectionState(
              'idle'
            )
            return
          }

          if (!result.ok) {
            setConnectionState(
              'disconnected'
            )
            await sleep(
              RECONNECT_DELAY_MS
            )
            continue
          }

          setAuthorUnreadCountState(
            result.count
          )
          needsReconcile = false
        }

        activeController =
          new AbortController()

        try {
          setConnectionState(
            'connecting'
          )

          const response =
            await fetch(
              `${API_BASE_URL}/api/authors/me/page-notifications/stream`,
              {
                method: 'GET',
                headers: {
                  Authorization:
                    `Bearer ${sessionToken}`,
                  Accept:
                    'text/event-stream',
                },
                cache: 'no-store',
                signal:
                  activeController.signal,
              }
            )

          if (cancelled) return

          if (
            response.status === 401 ||
            response.status === 403
          ) {
            setConnectionState(
              'idle'
            )
            return
          }

          if (
            !response.ok ||
            !response.body
          ) {
            throw new Error(
              'Notification stream connection failed'
            )
          }

          setConnectionState(
            'connected'
          )

          await consumeStream(
            response
          )
        } catch (error) {
          if (
            cancelled ||
            error?.name ===
              'AbortError'
          ) {
            return
          }
        } finally {
          activeController = null
        }

        if (cancelled) return

        setConnectionState(
          navigator.onLine
            ? 'disconnected'
            : 'offline'
        )

        needsReconcile = true

        await sleep(
          RECONNECT_DELAY_MS
        )
      }
    }

    run()

    return () => {
      cancelled = true
      activeController?.abort()
    }
  }, [sessionToken])

  const value = useMemo(
    () => ({
      authorUnreadCount,
      hasAuthorUnread:
        authorUnreadCount > 0,
      connectionState,
      lastCreatedNotification,
      setAuthorUnreadCount,
      adjustAuthorUnreadCount,
      syncAuthorUnreadCount,
    }),
    [
      authorUnreadCount,
      connectionState,
      lastCreatedNotification,
      setAuthorUnreadCount,
      adjustAuthorUnreadCount,
      syncAuthorUnreadCount,
    ]
  )

  return (
    <AuthorPageNotificationContext.Provider
      value={value}
    >
      {children}
    </AuthorPageNotificationContext.Provider>
  )
}

export function useAuthorPageNotifications() {
  const context = useContext(
    AuthorPageNotificationContext
  )

  if (!context) {
    throw new Error(
      'useAuthorPageNotifications must be used inside AuthorPageNotificationProvider'
    )
  }

  return context
}
