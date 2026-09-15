import {
  useEffect,
  useRef,
  useState,
} from 'react'
import {
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

export default function GoogleAdBanner({
  slot,
  placement = '',
  className = '',
}) {
  const containerRef = useRef(null)
  const dwellTimerRef = useRef(null)
  const pushedRef = useRef(false)

  const [enabled, setEnabled] =
    useState(!placement)
  const [readyToLoad, setReadyToLoad] =
    useState(false)

  useEffect(() => {
    let active = true

    if (!placement) {
      setEnabled(true)

      return () => {
        active = false
      }
    }

    setEnabled(false)

    getPublicGoogleAdsSettings().then(
      (settings) => {
        if (!active) return

        setEnabled(
          getGoogleAdsPlacementEnabled(
            settings,
            placement
          )
        )
      }
    )

    return () => {
      active = false
    }
  }, [placement])

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
      !enabled ||
      !slot ||
      !readyToLoad ||
      pushedRef.current ||
      typeof window === 'undefined' ||
      document.visibilityState !== 'visible'
    ) {
      return
    }

    if (!canRequestDisplayAd()) {
      return
    }

    pushedRef.current = true
    markDisplayAdRequest()

    try {
      ;(window.adsbygoogle =
        window.adsbygoogle || []).push({})
    } catch {
      pushedRef.current = false
    }
  }, [
    enabled,
    readyToLoad,
    slot,
  ])

  if (!slot || !enabled) return null

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
