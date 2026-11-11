import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdvertisementPopup from '../AdvertisementPopup'
import { hasPremiumAdFree } from '../../services/premiumAdVisibility'
import {
  openSmartPlacementEpisodeOne,
  recordSmartPlacementImpression,
  takeSmartPlacementAdvertisement,
} from '../../services/advertisements/smartPlacementAds'

const API_URL = (
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')
).replace(/\/$/, '')

const MODE_CACHE_MS = 60000
const MODE_ERROR_CACHE_MS = 15000
const MODE_TIMEOUT_MS = 4000
const LOAD_TIMEOUT_MS = 12000
const modeCache = new Map()
const modePending = new Map()

async function getPlacementMode(placement) {
  const saved = modeCache.get(placement)
  if (saved && saved.expiresAt > Date.now()) return saved.value
  if (modePending.has(placement)) return modePending.get(placement)

  const request = (async () => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), MODE_TIMEOUT_MS)
    try {
      const response = await fetch(
        `${API_URL}/api/advertisements/public?placement=${encodeURIComponent(placement)}`,
        { signal: controller.signal, cache: 'default' },
      )
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok !== true) throw new Error('Advertisement mode unavailable')
      const mode = String(data.rotation?.mode || '').toLowerCase()
      if (!['manual', 'auto', 'auto_system'].includes(mode)) {
        throw new Error('Advertisement mode missing')
      }
      const result = { mode, enabled: data.rotation?.enabled === true }
      modeCache.set(placement, { value: result, expiresAt: Date.now() + MODE_CACHE_MS })
      return result
    } finally {
      clearTimeout(timeout)
    }
  })().catch((error) => {
    console.warn('SMART_PLACEMENT_MODE_ERROR', placement, error?.message || error)
    modeCache.set(placement, { value: null, expiresAt: Date.now() + MODE_ERROR_CACHE_MS })
    return null
  }).finally(() => {
    if (modePending.get(placement) === request) modePending.delete(placement)
  })

  modePending.set(placement, request)
  return request
}

export default function SmartPlacementAdvertisement({
  placement = 'opening',
  blocking = false,
  onFinish = null,
}) {
  const navigate = useNavigate()
  const onFinishRef = useRef(onFinish)
  onFinishRef.current = onFinish
  const finishedRef = useRef(false)
  const [state, setState] = useState({ status: 'loading', advertisement: null })

  const finish = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    setState({ status: 'none', advertisement: null })
    onFinishRef.current?.()
  }, [])

  useEffect(() => {
    if (placement !== 'opening' && placement !== 'me') {
      finish()
      return undefined
    }

    let cancelled = false
    const controller = new AbortController()
    finishedRef.current = false
    setState({ status: 'loading', advertisement: null })
    const timeout = setTimeout(() => {
      controller.abort()
      if (!cancelled) finish()
    }, LOAD_TIMEOUT_MS)

    async function load() {
      try {
        const rotation = await getPlacementMode(placement)
        if (cancelled || finishedRef.current) return
        if (!rotation) {
          finish()
          return
        }
        if (rotation.mode !== 'auto_system') {
          setState({ status: 'legacy', advertisement: null })
          return
        }
        if (!rotation.enabled || await hasPremiumAdFree()) {
          if (!cancelled) finish()
          return
        }
        if (cancelled || finishedRef.current) return
        const advertisement = await takeSmartPlacementAdvertisement(placement, controller.signal)
        if (cancelled || finishedRef.current) return
        if (!advertisement) {
          finish()
          return
        }
        setState({ status: 'smart', advertisement })
      } catch (error) {
        if (cancelled || finishedRef.current) return
        console.warn('SMART_PLACEMENT_SELECT_ERROR', placement, error?.message || error)
        finish()
      }
    }

    void load()
    return () => {
      cancelled = true
      controller.abort()
      clearTimeout(timeout)
    }
  }, [placement, finish])

  const handleOpen = useCallback(async () => {
    const advertisement = state.advertisement
    if (!advertisement) return false
    try {
      const path = await openSmartPlacementEpisodeOne(advertisement)
      finish()
      navigate(path)
      return true
    } catch (error) {
      console.warn('SMART_PLACEMENT_OPEN_ERROR', placement, error?.message || error)
      if (error?.status === 410) finish()
      return false
    }
  }, [state.advertisement, placement, finish, navigate])

  if (state.status === 'loading' || state.status === 'none') return null
  if (state.status === 'legacy') {
    return <AdvertisementPopup placement={placement} blocking={blocking} onFinish={finish} />
  }

  const advertisement = state.advertisement
  return (
    <AdvertisementPopup
      placement={placement}
      blocking={blocking}
      advertisementOverride={advertisement}
      onFinish={finish}
      onImpression={() => {
        void recordSmartPlacementImpression(advertisement).catch((error) => {
          console.warn('SMART_PLACEMENT_IMPRESSION_ERROR', placement, error?.message || error)
        })
      }}
      onAdClick={handleOpen}
    />
  )
}
