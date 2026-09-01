import { useEffect, useRef } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'https://shadow-backend-kucw.onrender.com'

let youtubeApiPromise = null

function getReaderToken() {
  return (
    sessionStorage.getItem('shadow_reader_token') ||
    localStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function loadYoutubeIframeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (youtubeApiPromise) return youtubeApiPromise

  youtubeApiPromise = new Promise((resolve, reject) => {
    const finish = () => {
      if (window.YT?.Player) resolve(window.YT)
      else reject(new Error('YouTube player API unavailable'))
    }

    const previousReady = window.onYouTubeIframeAPIReady

    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousReady === 'function') {
        try {
          previousReady()
        } catch {
          void 0
        }
      }
      finish()
    }

    let script = document.getElementById('shadow-youtube-iframe-api')

    if (!script) {
      script = document.createElement('script')
      script.id = 'shadow-youtube-iframe-api'
      script.src = 'https://www.youtube.com/iframe_api'
      script.async = true
      script.onerror = () => reject(new Error('Failed to load YouTube player API'))
      document.head.appendChild(script)
    }

    const startedAt = Date.now()
    const poll = window.setInterval(() => {
      if (window.YT?.Player) {
        window.clearInterval(poll)
        finish()
        return
      }

      if (Date.now() - startedAt > 15000) {
        window.clearInterval(poll)
        reject(new Error('YouTube player API timed out'))
      }
    }, 100)
  }).catch((error) => {
    youtubeApiPromise = null
    throw error
  })

  return youtubeApiPromise
}

export default function MusicYoutubePlayer({
  songId,
  videoId,
  title,
  playNonce = 0,
  onListenRecorded,
  onAuthRequired,
}) {
  const iframeRef = useRef(null)
  const playerRef = useRef(null)
  const validListenTimerRef = useRef(null)
  const listenRecordedRef = useRef(false)
  const onListenRecordedRef = useRef(onListenRecorded)
  const onAuthRequiredRef = useRef(onAuthRequired)

  useEffect(() => {
    onListenRecordedRef.current = onListenRecorded
  }, [onListenRecorded])

  useEffect(() => {
    onAuthRequiredRef.current = onAuthRequired
  }, [onAuthRequired])

  useEffect(() => {
    listenRecordedRef.current = false

    if (!songId || !videoId || !iframeRef.current) return undefined

    let cancelled = false

    function clearValidListenTimer() {
      if (validListenTimerRef.current) {
        window.clearTimeout(validListenTimerRef.current)
        validListenTimerRef.current = null
      }
    }

    async function recordValidListen() {
      if (cancelled || listenRecordedRef.current) return

      const token = getReaderToken()

      if (!token) {
        onAuthRequiredRef.current?.()
        return
      }

      listenRecordedRef.current = true

      try {
        const response = await fetch(
          `${API_URL}/api/music/songs/${encodeURIComponent(songId)}/listen`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json().catch(() => ({}))

        if (response.status === 401 || response.status === 403) {
          listenRecordedRef.current = false
          onAuthRequiredRef.current?.()
          return
        }

        if (!response.ok || data.ok === false) {
          listenRecordedRef.current = false
          return
        }

        onListenRecordedRef.current?.({
          songId,
          counted: Boolean(data.counted),
          viewCount: Number(data.view_count || 0),
        })
      } catch {
        listenRecordedRef.current = false
      }
    }

    loadYoutubeIframeApi()
      .then((YT) => {
        if (cancelled || !iframeRef.current) return

        playerRef.current = new YT.Player(iframeRef.current, {
          events: {
            onStateChange(event) {
              clearValidListenTimer()

              if (
                event.data === YT.PlayerState.PLAYING &&
                !listenRecordedRef.current
              ) {
                validListenTimerRef.current = window.setTimeout(() => {
                  void recordValidListen()
                }, 5000)
              }
            },
          },
        })
      })
      .catch(() => undefined)

    return () => {
      cancelled = true
      clearValidListenTimer()

      try {
        playerRef.current?.destroy?.()
      } catch {
        void 0
      }

      playerRef.current = null
    }
  }, [songId, videoId, playNonce])

  if (!videoId) return null

  const origin =
    typeof window !== 'undefined'
      ? encodeURIComponent(window.location.origin)
      : ''

  return (
    <iframe
      ref={iframeRef}
      src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1&enablejsapi=1&origin=${origin}`}
      title={title || 'Shadow Music'}
      className="absolute inset-0 h-full w-full"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  )
}
