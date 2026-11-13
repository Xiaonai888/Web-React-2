import { useCallback, useEffect, useRef, useState } from 'react'
import { getPromotionShelfCache, loadPromotionShelf } from '../../services/promotionShelfData'
import StoryPromotionShelf from './StoryPromotionShelf'
import StorePromotionShelf from './StorePromotionShelf'

const RETRY_MS = 30000

export default function PromotionShelves() {
  const [storyRotation, setStoryRotation] = useState(() => getPromotionShelfCache('story'))
  const [storeRotation, setStoreRotation] = useState(() => getPromotionShelfCache('store'))
  const [now, setNow] = useState(Date.now)
  const storyRef = useRef(storyRotation)
  const storeRef = useRef(storeRotation)
  const attemptsRef = useRef({ story: 0, store: 0 })
  const mountedRef = useRef(false)

  const load = useCallback(async (kind, force = false) => {
    const result = await loadPromotionShelf(kind, { force })
    if (!mountedRef.current) return
    if (kind === 'story') {
      storyRef.current = result
      setStoryRotation(result)
    } else {
      storeRef.current = result
      setStoreRotation(result)
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    const check = () => {
      const current = Date.now()
      setNow(current)
      for (const kind of ['story', 'store']) {
        const rotation = kind === 'story' ? storyRef.current : storeRef.current
        if (rotation?.expiresAt > current) continue
        if (current - attemptsRef.current[kind] < RETRY_MS) continue
        attemptsRef.current[kind] = current
        void load(kind, true)
      }
    }
    check()
    const timer = window.setInterval(check, 1000)
    const onVisibility = () => {
      if (document.visibilityState === 'visible') check()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      mountedRef.current = false
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [load])

  const refreshStory = useCallback(() => {
    attemptsRef.current.story = Date.now()
    void load('story', true)
  }, [load])

  const storyRemaining = storyRotation?.expiresAt
    ? Math.max(0, Math.ceil((storyRotation.expiresAt - now) / 1000))
    : 0
  const storeRemaining = storeRotation?.expiresAt
    ? Math.max(0, Math.ceil((storeRotation.expiresAt - now) / 1000))
    : 0

  return (
    <div className="space-y-6">
      <StoryPromotionShelf
        rotation={storyRotation}
        remainingSeconds={storyRemaining}
        onStale={refreshStory}
      />
      <StorePromotionShelf
        rotation={storeRotation}
        remainingSeconds={storeRemaining}
      />
    </div>
  )
}
