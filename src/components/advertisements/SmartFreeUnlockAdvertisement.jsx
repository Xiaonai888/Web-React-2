import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdvertisementPopup from '../AdvertisementPopup'
import { takeSmartFreeUnlockAd } from '../../services/advertisements/smartFreeUnlockQueue'
import {
  openSmartFreeUnlockEpisodeOne,
  recordSmartFreeUnlockImpression,
} from '../../services/advertisements/smartFreeUnlockTracking'

const API_URL = (
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')
).replace(/\/$/, '')
const MODE_CACHE_MS = 60000
const MODE_ERROR_CACHE_MS = 15000
const MODE_TIMEOUT_MS = 4000
let modeCache = null
let modePending = null

async function isSmartFreeUnlockMode() {
  if (modeCache && modeCache.expiresAt > Date.now()) return modeCache.enabled
  if (modePending) return modePending

  const request = (async () => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), MODE_TIMEOUT_MS)
    try {
      const response = await fetch(`${API_URL}/api/advertisements/public?placement=freeUnlock`, {
        signal: controller.signal,
        cache: 'default',
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok !== true) throw new Error('Advertisement mode unavailable')
      const mode = String(data.rotation?.mode || '').toLowerCase()
      if (!['manual', 'auto', 'smart', 'auto_system'].includes(mode)) {
        throw new Error('Advertisement mode missing')
      }
      const enabled = data.rotation.enabled === true
        ? (mode === 'smart' || mode === 'auto_system')
        : null
      modeCache = { enabled, expiresAt: Date.now() + MODE_CACHE_MS }
      return enabled
    } finally {
      clearTimeout(timer)
    }
  })().catch((error) => {
    console.warn('SMART_FREE_UNLOCK_MODE_ERROR', error?.message || error)
    modeCache = { enabled: null, expiresAt: Date.now() + MODE_ERROR_CACHE_MS }
    return null
  }).finally(() => {
    if (modePending === request) modePending = null
  })

  modePending = request
  return request
}

export default function SmartFreeUnlockAdvertisement({
  enabled = null,
  currentStoryId = '',
  legacyAdvertisement = null,
  onFinish,
}) {
  const navigate = useNavigate()
  const onFinishRef = useRef(onFinish)
  onFinishRef.current = onFinish
  const finishedRef = useRef(false)
  const [state, setState] = useState({ status: 'loading', selection: null })

  const finish = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    onFinishRef.current?.()
  }, [])

  useEffect(() => {
    let cancelled = false
    finishedRef.current = false
    setState({ status: 'loading', selection: null })

    async function load() {
      try {
        const useSmart = enabled == null ? await isSmartFreeUnlockMode() : Boolean(enabled)
        if (cancelled) return
        if (useSmart == null) {
          finish()
          return
        }
        if (!useSmart) {
          setState({ status: 'legacy', selection: null })
          return
        }
        const selection = await takeSmartFreeUnlockAd({ currentStoryId })
        if (cancelled) return
        if (!selection) {
          finish()
          return
        }
        setState({ status: 'smart', selection })
      } catch (error) {
        if (cancelled) return
        console.warn('SMART_FREE_UNLOCK_SELECTION_ERROR', error?.message || error)
        finish()
      }
    }

    void load()
    return () => { cancelled = true }
  }, [enabled, currentStoryId, finish])

  const handleOpen = useCallback(async () => {
    const ad = state.selection?.advertisement
    if (!ad) return false
    try {
      const path = await openSmartFreeUnlockEpisodeOne(ad)
      finish()
      navigate(path)
      return true
    } catch (error) {
      console.warn('SMART_FREE_UNLOCK_OPEN_ERROR', error?.message || error)
      if (error?.status === 410) finish()
      return false
    }
  }, [state.selection, finish, navigate])

  if (state.status === 'loading') return null
  if (state.status === 'legacy') {
    return (
      <AdvertisementPopup
        placement="freeUnlock"
        blocking
        advertisementOverride={legacyAdvertisement}
        onFinish={finish}
      />
    )
  }

  const ad = state.selection.advertisement
  return (
    <AdvertisementPopup
      placement="freeUnlock"
      blocking
      advertisementOverride={ad}
      onFinish={finish}
      onImpression={() => {
        void recordSmartFreeUnlockImpression(ad).catch((error) => {
          console.warn('SMART_FREE_UNLOCK_IMPRESSION_ERROR', error?.message || error)
        })
      }}
      onAdClick={handleOpen}
    />
  )
}
