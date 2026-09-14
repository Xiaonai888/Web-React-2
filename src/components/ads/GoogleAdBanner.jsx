import { useEffect, useState } from 'react'
import {
  getGoogleAdsPlacementEnabled,
  getPublicGoogleAdsSettings,
} from '../../services/googleAdsSettings'

const ADSENSE_CLIENT = 'ca-pub-5181335152763760'

export default function GoogleAdBanner({
  slot,
  placement = '',
  className = '',
}) {
  const [enabled, setEnabled] = useState(!placement)

  useEffect(() => {
    let active = true

    if (!placement) {
      setEnabled(true)
      return () => {
        active = false
      }
    }

    setEnabled(false)

    getPublicGoogleAdsSettings().then((settings) => {
      if (!active) return

      setEnabled(
        getGoogleAdsPlacementEnabled(
          settings,
          placement
        )
      )
    })

    return () => {
      active = false
    }
  }, [placement])

  useEffect(() => {
    if (
      !enabled ||
      !slot ||
      typeof window === 'undefined'
    ) {
      return
    }

    try {
      ;(window.adsbygoogle =
        window.adsbygoogle || []).push({})
    } catch {}
  }, [enabled, slot])

  if (!slot || !enabled) return null

  return (
    <div
      className={`w-full overflow-hidden ${className}`.trim()}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
