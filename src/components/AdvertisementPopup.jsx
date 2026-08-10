import { useEffect, useMemo, useRef, useState } from 'react'

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const SHOW_BLOCKING_LOADING_SCREEN = false
const SHADOW_LOGO_URL = '/assets/Icons/Logo Shadow 2.svg'
const BRAND_TEXT = 'STORIES LIVE IN THE SHADOWS.'

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

function AdBadge({ badge, compact = false }) {
  const value = String(badge || '').trim().toUpperCase()
  if (!value) return null

  const tone =
    value === 'HOT'
      ? 'bg-[#FF4F64] text-white'
      : value === 'TOP'
        ? 'bg-[#8B5CF6] text-white'
        : 'bg-[#FACC15] text-[#111827]'

  return (
    <span
      className={`absolute left-4 top-6 z-30 inline-flex items-center justify-center rounded-[11px] font-black shadow-[0_8px_24px_rgba(0,0,0,0.24)] ${tone} ${
        compact
          ? 'min-w-[54px] px-3 py-1.5 text-[12px]'
          : 'min-w-[62px] px-3.5 py-2 text-[13px]'
      }`}
    >
      {value}
    </span>
  )
}

function BrandLockup({ compact = false }) {
  return (
    <div
      className={`absolute bottom-5 left-4 z-30 flex max-w-[calc(100%-32px)] flex-col items-start rounded-[14px] bg-white/95 shadow-[0_12px_34px_rgba(0,0,0,0.28)] backdrop-blur-[4px] ${
        compact ? 'right-4 gap-1.5 px-3 py-2.5' : 'gap-2 px-4 py-3'
      }`}
    >
      <img
        src={SHADOW_LOGO_URL}
        alt="Shadow"
        className={`${compact ? 'h-[34px]' : 'h-[42px]'} max-w-full object-contain object-left`}
      />
      <div
        className={`font-black tracking-[0.13em] text-[#111827] ${
          compact ? 'text-[8px]' : 'text-[9px]'
        }`}
      >
        {BRAND_TEXT}
      </div>
    </div>
  )
}

export default function AdvertisementPopup({
  placement = 'opening',
  onFinish = null,
  blocking = false,
  advertisementOverride = null,
}) {
  const [advertisement, setAdvertisement] = useState(null)
  const [visible, setVisible] = useState(false)
  const [loadingAd, setLoadingAd] = useState(Boolean(blocking))
  const [imageLoaded, setImageLoaded] = useState(false)
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
    setLoadingAd(false)

    if (typeof onFinish === 'function') onFinish()
  }

  function closeAd() {
    if (placement !== 'opening' && !canSkip) return
    finishAd()
  }

  useEffect(() => {
    finishedRef.current = false
    setAdvertisement(null)
    setVisible(false)
    setCanSkip(false)
    setSkipCountdown(0)
    setDebugMessage('')
    setLoadingAd(Boolean(blocking))
    setImageLoaded(false)
  }, [placement, advertisementOverride, blocking])

  useEffect(() => {
    let cancelled = false

    async function loadAdvertisement() {
      const debug = getSearchFlag('addebug') || getSearchFlag('adtest')

      try {
        if (advertisementOverride?.image_url) {
          if (!shouldShowByFrequency(advertisementOverride)) {
            finishAd()
            return
          }

          const waitSeconds = Math.max(
            0,
            Number(advertisementOverride.close_after_seconds ?? 3),
          )

          if (cancelled) return

          setLoadingAd(false)
          setAdvertisement(advertisementOverride)
          setVisible(true)
          setCanSkip(waitSeconds <= 0)
          setSkipCountdown(waitSeconds)
          markShown(advertisementOverride)
          return
        }

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

        const nextAdvertisement = data.advertisement
        const waitSeconds = Math.max(
          0,
          Number(nextAdvertisement.close_after_seconds ?? 3),
        )

        setLoadingAd(false)
        setAdvertisement(nextAdvertisement)
        setVisible(true)
        setCanSkip(waitSeconds <= 0)
        setSkipCountdown(waitSeconds)
        markShown(nextAdvertisement)
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
  }, [placement, advertisementOverride])

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
      setSkipCountdown((previous) => {
        if (previous <= 1) {
          window.clearInterval(interval)

          if (placement === 'opening') {
            finishAd()
            return 0
          }

          setCanSkip(true)
          return 0
        }

        return previous - 1
      })
    }, 1000)

    return () => {
      window.clearInterval(interval)
    }
  }, [visible, advertisement, closeAfterSeconds, placement])

  useEffect(() => {
    if (!visible) return undefined

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [visible])

  if (!visible || !advertisement?.image_url) {
    if (SHOW_BLOCKING_LOADING_SCREEN && loadingAd && blocking) {
      return (
        <div className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black">
          <div className="text-center">
            <div className="text-[13px] font-medium tracking-wide text-white/80">
              Preparing your story...
            </div>
            <div className="mx-auto mt-3 h-1 w-16 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-white/55" />
            </div>
          </div>
        </div>
      )
    }

    if (getSearchFlag('addebug') && debugMessage) {
      return (
        <div className="fixed bottom-4 left-4 right-4 z-[2147483647] rounded-[16px] bg-black/90 p-4 text-[12px] font-bold leading-5 text-white">
          {debugMessage}
        </div>
      )
    }

    return null
  }

  const adImage = (
    <img
      src={advertisement.image_url}
      alt="Advertisement"
      className={`h-full w-full object-cover transition-opacity duration-200 ${
        imageLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      onLoad={() => setImageLoaded(true)}
      onError={() => {
        setDebugMessage('Advertisement image failed to load')
        finishAd()
      }}
    />
  )

  const linkedAdImage = advertisement.link_url ? (
    <a
      href={advertisement.link_url}
      target="_blank"
      rel="noreferrer"
      className="block h-full w-full"
    >
      {adImage}
    </a>
  ) : (
    adImage
  )

  if (placement === 'me') {
    return (
      <div className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-[2px]">
        <div
          className="relative"
          style={{ width: 'min(88vw, 45vh, 410px)' }}
        >
          <button
            type="button"
            aria-label="Close advertisement"
            onClick={finishAd}
            className="absolute -top-10 right-0 z-40 text-[30px] font-light leading-none text-white drop-shadow-lg active:scale-95"
          >
            ×
          </button>

          <div className="relative aspect-[9/16] overflow-hidden rounded-[24px] bg-black shadow-[0_24px_80px_rgba(0,0,0,0.6)] ring-1 ring-white/15">
            {linkedAdImage}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-28 bg-gradient-to-b from-black/55 via-black/20 to-transparent" />
            <AdBadge badge={advertisement.badge} compact />
            <BrandLockup compact />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[2147483647] overflow-hidden bg-black">
      <div className="absolute inset-0">{linkedAdImage}</div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-32 bg-gradient-to-b from-black/60 via-black/25 to-transparent" />

      <AdBadge badge={advertisement.badge} />

      <div className="absolute right-4 top-6 z-40 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-[14px] font-semibold shadow-lg backdrop-blur-[3px]">
        {!canSkip ? <span className="text-[#FFB020]">{skipCountdown}s</span> : null}

        <button
          type="button"
          onClick={closeAd}
          disabled={placement !== 'opening' && !canSkip}
          className={`text-white ${
            placement === 'opening' || canSkip
              ? 'cursor-pointer opacity-100 active:scale-95'
              : 'cursor-not-allowed opacity-80'
          }`}
        >
          Skip
        </button>
      </div>

      <BrandLockup />
    </div>
  )
}
