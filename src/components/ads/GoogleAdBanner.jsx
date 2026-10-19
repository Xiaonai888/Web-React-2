import {
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  GOOGLE_ADS_AVAILABLE,
  getGoogleAdsPlacementEnabled,
  getPublicGoogleAdsSettings,
} from '../../services/googleAdsSettings'
import {
  canRequestDisplayAd,
  markDisplayAdRequest,
} from '../../services/adsTrafficGuard'

const ADSENSE_CLIENT =
  'ca-pub-5181335152763760'

const LOAD_ROOT_MARGIN = '400px 0px'
const LOAD_DWELL_MS = 700
let adsenseScriptPromise = null

function loadAdsenseScript() {
  if (adsenseScriptPromise) {
    return adsenseScriptPromise
  }

  adsenseScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(
      'script[data-shadow-adsense="true"]'
    )

    if (existing?.dataset.loaded === 'true') {
      resolve()
      return
    }

    const script = existing || document.createElement('script')

    script.addEventListener('load', () => {
      script.dataset.loaded = 'true'
      resolve()
    }, { once: true })

    script.addEventListener('error', () => {
      adsenseScriptPromise = null
      script.remove()
      reject(new Error('Google AdSense script failed to load'))
    }, { once: true })

    if (!existing) {
      script.async = true
      script.crossOrigin = 'anonymous'
      script.dataset.shadowAdsense = 'true'
      script.src =
        `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`
      document.head.appendChild(script)
    }
  })

  return adsenseScriptPromise
}

export default function GoogleAdBanner({
  slot,
  placement = '',
  className = '',
}) {
  const containerRef = useRef(null)
  const dwellTimerRef = useRef(null)
  const pushedRef = useRef(false)

  const [enabled, setEnabled] =
    useState(GOOGLE_ADS_AVAILABLE && !placement)
  const [readyToLoad, setReadyToLoad] =
    useState(false)

  useEffect(() => {
    let active = true

    if (!GOOGLE_ADS_AVAILABLE || !slot) {
      setEnabled(false)
      return undefined
    }

    if (!placement) {
      setEnabled(true)

      return () => {
        active = false
      }
    }

    setEnabled(false)

    getPublicGoogleAdsSettings().then(async (settings) => {
      if (!active) return
      const placementEnabled = getGoogleAdsPlacementEnabled(settings, placement)
      if (!placementEnabled) {
        setEnabled(false)
        return
      }
      if (placement === 'readerEnd') {
        const isAdFree = await import('../../services/premiumAdVisibility')
          .then(({ hasPremiumAdFree }) => hasPremiumAdFree())
          .catch(() => false)
        if (!active) return
        setEnabled(!isAdFree)
        return
      }
      setEnabled(true)
    })

    return () => {
      active = false
    }
  }, [placement, slot])

  useEffect(() => {
    const node = containerRef.current

    if (!enabled || !slot || !node) {
      setReadyToLoad(false)
      return undefined
    }

    if (
      typeof IntersectionObserver ===
      'undefined'
    ) {
      setReadyToLoad(true)
      return undefined
    }

    const clearDwellTimer = () => {
      if (dwellTimerRef.current) {
        window.clearTimeout(
          dwellTimerRef.current
        )
        dwellTimerRef.current = null
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          !entry?.isIntersecting ||
          document.visibilityState !==
            'visible'
        ) {
          clearDwellTimer()
          return
        }

        if (readyToLoad) return

        clearDwellTimer()

        dwellTimerRef.current =
          window.setTimeout(() => {
            dwellTimerRef.current = null

            if (
              document.visibilityState ===
              'visible'
            ) {
              setReadyToLoad(true)
            }
          }, LOAD_DWELL_MS)
      },
      {
        root: null,
        rootMargin: LOAD_ROOT_MARGIN,
        threshold: 0.01,
      }
    )

    observer.observe(node)

    return () => {
      clearDwellTimer()
      observer.disconnect()
    }
  }, [enabled, readyToLoad, slot])

  useEffect(() => {
    if (
      !GOOGLE_ADS_AVAILABLE ||
      !enabled ||
      !slot ||
      !readyToLoad ||
      pushedRef.current ||
      typeof window === 'undefined' ||
      document.visibilityState !== 'visible'
    ) {
      return undefined
    }

    if (!canRequestDisplayAd()) {
      return undefined
    }

    let cancelled = false

    loadAdsenseScript().then(() => {
      if (
        cancelled ||
        pushedRef.current ||
        document.visibilityState !== 'visible' ||
        !canRequestDisplayAd()
      ) {
        return
      }

      try {
        ;(window.adsbygoogle =
          window.adsbygoogle || []).push({})
        pushedRef.current = true
        markDisplayAdRequest()
      } catch {
        pushedRef.current = false
      }
    }).catch(() => {})

    return () => {
      cancelled = true
    }
  }, [
    enabled,
    readyToLoad,
    slot,
  ])

  if (!GOOGLE_ADS_AVAILABLE || !slot || !enabled) return null

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden ${className}`.trim()}
      style={{
        minHeight: readyToLoad
          ? undefined
          : '1px',
      }}
    >
      {readyToLoad ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : null}
    </div>
  )
}
