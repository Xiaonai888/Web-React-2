import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdvertisementPopup from '../AdvertisementPopup'
import { takeSmartFreeUnlockAd } from '../../services/advertisements/smartFreeUnlockQueue'
import {
  openSmartFreeUnlockEpisodeOne,
  recordSmartFreeUnlockImpression,
} from '../../services/advertisements/smartFreeUnlockTracking'

export default function SmartFreeUnlockAdvertisement({
  enabled = true,
  currentStoryId = '',
  onFinish,
}) {
  const navigate = useNavigate()
  const onFinishRef = useRef(onFinish)
  onFinishRef.current = onFinish
  const finishedRef = useRef(false)
  const [state, setState] = useState({ status: enabled ? 'loading' : 'legacy', selection: null })

  const finish = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    onFinishRef.current?.()
  }, [])

  useEffect(() => {
    let cancelled = false
    finishedRef.current = false
    if (!enabled) {
      setState({ status: 'legacy', selection: null })
      return undefined
    }
    setState({ status: 'loading', selection: null })
    void takeSmartFreeUnlockAd({ currentStoryId }).then((selection) => {
      if (cancelled) return
      setState(selection
        ? { status: 'smart', selection }
        : { status: 'legacy', selection: null })
    }).catch((error) => {
      if (cancelled) return
      console.warn('SMART_FREE_UNLOCK_SELECTION_ERROR', error?.message || error)
      setState({ status: 'legacy', selection: null })
    })
    return () => { cancelled = true }
  }, [enabled, currentStoryId])

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
      if (error?.status === 410) setState({ status: 'legacy', selection: null })
      return false
    }
  }, [state.selection, finish, navigate])

  if (state.status === 'loading') return null
  if (state.status === 'legacy') {
    return <AdvertisementPopup placement="freeUnlock" blocking onFinish={finish} />
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
