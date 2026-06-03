import { useEffect, useMemo, useState } from 'react'

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

  if (frequency !== 'every_visit') {
    sessionStorage.setItem(key, '1')
  }
}

export default function AdvertisementPopup({ placement = 'opening' }) {
  const [advertisement, setAdvertisement] = useState(null)
  const [visible, setVisible] = useState(false)
  const [canClose, setCanClose] = useState(false)
  const [debugMessage, setDebugMessage] = useState('')

  const durationSeconds = useMemo(() => {
    return Math.max(1, Number(advertisement?.duration_seconds || 5))
  }, [advertisement])

  const closeAfterSeconds = useMemo(() => {
    return Math.max(0, Number(advertisement?.close_after_seconds || 0))
  }, [advertisement])

  function closeAd() {
    setVisible(false)
  }

  useEffect(() => {
    let cancelled = false

    async function loadAdvertisement() {
      const debug = getSearchFlag('addebug') || getSearchFlag('adtest')

      try {
        const url = `${API_URL}/api/advertisements/public?placement=${placement}`
        if (debug) setDebugMessage(`Loading: ${url}`)

        const response = await fetch(url, {
          cache: 'no-store',
        })
        const data = await response.json().catch(() => ({}))

        if (debug) {
          console.log('Advertisement response:', data)
          setDebugMessage(JSON.stringify(data))
        }

        if (!response.ok || data.ok === false) return
        if (!data.advertisement?.image_url) return
        if (!shouldShowByFrequency(data.advertisement)) return
        if (cancelled) return

        setAdvertisement(data.advertisement)
        setVisible(true)
        setCanClose(Number(data.advertisement.close_after_seconds || 0) <= 0)
        markShown(data.advertisement)
      } catch (error) {
        console.error('Advertisement load error:', error)
        if (debug) setDebugMessage(error.message || 'Advertisement load error')
      }
    }

    loadAdvertisement()

    return () => {
      cancelled = true
    }
  }, [placement])

  useEffect(() => {
    if (!visible || !advertisement) return

    const closeTimer = window.setTimeout(() => {
      setVisible(false)
    }, durationSeconds * 1000)

    const allowCloseTimer = window.setTimeout(() => {
      setCanClose(true)
    }, closeAfterSeconds * 1000)

    return () => {
      window.clearTimeout(closeTimer)
      window.clearTimeout(allowCloseTimer)
    }
  }, [visible, advertisement, durationSeconds, closeAfterSeconds])

  useEffect(() => {
    if (!visible) return

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

  const image = (
    <img
      src={advertisement.image_url}
      alt="Advertisement"
      className="max-h-[82vh] w-full max-w-[420px] rounded-[24px] object-contain shadow-2xl"
      onError={() => {
        setVisible(false)
        setDebugMessage('Advertisement image failed to load')
      }}
    />
  )

  return (
    <div className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/85 px-4 py-6">
      <div className="relative w-full max-w-[430px]">
        {canClose ? (
          <button
            type="button"
            onClick={closeAd}
            className="absolute -right-2 -top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[16px] font-black text-[#111827] shadow-lg active:scale-95"
            aria-label="Close advertisement"
          >
            ×
          </button>
        ) : null}

        {advertisement.link_url ? (
          <a href={advertisement.link_url} target="_blank" rel="noreferrer">
            {image}
          </a>
        ) : (
          image
        )}
      </div>
    </div>
  )
}
