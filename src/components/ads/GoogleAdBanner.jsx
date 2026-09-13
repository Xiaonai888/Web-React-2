import { useEffect } from 'react'

const ADSENSE_CLIENT = 'ca-pub-5181335152763760'

export default function GoogleAdBanner({ slot, className = '' }) {
  useEffect(() => {
    if (!slot || typeof window === 'undefined') return

    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [slot])

  if (!slot) return null

  return (
    <div className={`w-full overflow-hidden ${className}`.trim()}>
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
