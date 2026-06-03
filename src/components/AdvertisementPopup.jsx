import { useEffect, useMemo, useRef, useState } from 'react'

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getSearchFlag(name) {
  return new URLSearchParams(window.location.search).get(name) === '1'
}

function storageKey(advertisement) {
  return `shadow_ad_seen_${advertisement.placement}_${advertisement.updated_at || 'current'}`
}

function shouldShowByFrequency(advertisement) {
  if (getSearchFlag('adtest')) return true

  const key = storageKey(advertisement)
  const frequency = advertisement.frequency || 'once_per_session'

  if (frequency === 'every_visit') return true
  if (frequency === 'every_unlock') return true

  if (frequency === 'once_per_day') {
    const today = new Date().toISOString().slice(0, 10)
    return localStorage.getItem(key) !== today
  }

  return sessionStorage.getItem(key) !== '1'
}

function markShown(advertisement) {
  if (getSearchFlag('adtest')) return

  const key = storageKey(advertisement)
  const frequency = advertisement.frequency || 'once_per_session'

  if (frequency === 'once_per_day') {
    localStorage.setItem(key, new Date().toISOString().slice(0, 10))
    return
  }

  if (frequency !== 'every_visit' && frequency !== 'every_unlock') {
    sessionStorage.setItem(key, '1')
  }
}

export default function AdvertisementPopup({ placement = 'opening', onFinish = null }) {
  const [advertisement, setAdvertisement] = useState(null)
  const [visible, setVisible] = useState(false)
  const [canSkip, setCanSkip] = useState(false)
  const [skipCountdown, setSkipCountdown] = useState(0)
  const [debugMessage, setDebugMessage] = useState('')
  const finishedRef = useRef(false)

  const durationSeconds = useMemo(() => {
    return Math.max(1, Number(advertisement?.duration_seconds ?? 5))
  }, [advertisement])

  const closeAfterSeconds = useMemo(() => {
    return Math.max(0, Number(advertisement?.close_after_seconds ?? 3))
  }, [advertisement])

  function finishAd() {
    if (finishedRef.current) return

    finishedRef.current = true
    setVisible(false)

    if (typeof onFinish === 'function') onFinish()
  }

  function closeAd() {
    if (!canSkip) return
    finishAd()
  }

  useEffect(() => {
    finishedRef.current = false
    setAdvertisement(null)
    setVisible(false)
    setCanSkip(false)
    setSkipCountdown(0)
    setDebugMessage('')
  }, [placement])

  useEffect(() => {
    let cancelled = false

    async function loadAdvertisement() {
      const debug = getSearchFlag('addebug') || getSearchFlag('adtest')

      try {
        const url = `${API_URL}/api/advertisements/public?placement=${placement}`

        if (debug) setDebugMessage(`Loading: ${url}`)

        const response = await fetch(url, { cache: 'no-store' })
        const data = await response.json().catch(() => ({}))

        if (debug) {
          console.log('Advertisement response:', data)
          setDebugMessage(JSON.stringify(data))
        }

        if (!response.ok || data.ok === false) {
          finishAd()
          return
        }

        if (!data.advertisement?.image_url) {
          finishAd()
          return
        }

        if (!shouldShowByFrequency(data.advertisement)) {
          finishAd()
          return
        }

        if (cancelled) return

        const waitSeconds = Math.max(0, Number(data.advertisement.close_after_seconds ?? 3))

        setAdvertisement(data.advertisement)
        setVisible(true)
        setCanSkip(waitSeconds <= 0)
        setSkipCountdown(waitSeconds)
        markShown(data.advertisement)
      } catch (error) {
        console.error('Advertisement load error:', error)

        if (debug) setDebugMessage(error.message || 'Advertisement load error')
        finishAd()
      }
    }

    loadAdvertisement()

    return () => {
      cancelled = true
    }
  }, [placement])

  useEffect(() => {
    if (!visible || !advertisement) return undefined

    const closeTimer = window.setTimeout(() => {
      finishAd()
    }, durationSeconds * 1000)

    return () => {
      window.clearTimeout(closeTimer)
    }
  }, [visible, advertisement, durationSeconds])

  useEffect(() => {
    if (!visible || !advertisement) return undefined

    if (closeAfterSeconds <= 0) {
      setCanSkip(true)
      setSkipCountdown(0)
      return undefined
    }

    setCanSkip(false)
    setSkipCountdown(closeAfterSeconds)

    const interval = window.setInterval(() => {
      setSkipCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval)
          setCanSkip(true)
          return 0
        }

        return prev - 1
      })
    }, 1000)

    return () => {
      window.clearInterval(interval)
    }
  }, [visible, advertisement, closeAfterSeconds])

  useEffect(() => {
    if (!visible) return undefined

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [visible])

  if (!visible || !advertisement?.image_url) {
    if (getSearchFlag('addebug') && debugMessage) {
      return (
        <div className="fixed bottom-4 left-4 right-4 z-[2147483647] rounded-[16px] bg-black/90 p-4 text-[12px] font-bold leading-5 text-white">
          {debugMessage}
        </div>
      )
    }

    return null
  }

  return (
    <div className="fixed inset-0 z-[2147483647] bg-black">
      <div className="absolute right-5 top-8 z-20 flex items-center gap-3 text-[17px] font-black">
        {!canSkip ? (
          <span className="text-[#FFB020]">{skipCountdown}s</span>
        ) : null}

        <button
          type="button"
          onClick={closeAd}
          disabled={!canSkip}
          className={`rounded-full px-2 py-1 text-white ${
            canSkip ? 'cursor-pointer opacity-100 active:scale-95' : 'cursor-not-allowed opacity-70'
          }`}
        >
          Skip
        </button>
      </div>

      {advertisement.link_url ? (
        <a href={advertisement.link_url} target="_blank" rel="noreferrer" className="block h-full w-full">
          <img
            src={advertisement.image_url}
            alt="Advertisement"
            className="h-full w-full object-cover"
            onError={() => {
              setDebugMessage('Advertisement image failed to load')
              finishAd()
            }}
          />
        </a>
      ) : (
        <img
          src={advertisement.image_url}
          alt="Advertisement"
          className="h-full w-full object-cover"
          onError={() => {
            setDebugMessage('Advertisement image failed to load')
            finishAd()
          }}
        />
      )}
    </div>
  )
}
