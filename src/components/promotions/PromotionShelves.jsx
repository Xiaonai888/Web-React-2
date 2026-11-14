import { useCallback, useEffect, useRef, useState } from 'react'
import { getPromotionShelfCache, loadPromotionShelf } from '../../services/promotionShelfData'
import { getStoryLanguageId } from '../../utils/storyLanguage'
import StoryPromotionShelf from './StoryPromotionShelf'
import StorePromotionShelf from './StorePromotionShelf'

const RETRY_MS = 30000

export default function PromotionShelves() {
  const [language, setLanguage] = useState(getStoryLanguageId)
  const [storyRotation, setStoryRotation] = useState(() => getPromotionShelfCache('story'))
  const [storeRotation, setStoreRotation] = useState(() => getPromotionShelfCache('store'))
  const [now, setNow] = useState(Date.now)
  const languageRef = useRef(language)
  const storyRef = useRef(storyRotation)
  const storeRef = useRef(storeRotation)
  const attemptsRef = useRef({ story: 0, store: 0 })
  const mountedRef = useRef(false)

  const load = useCallback(async (kind, force = false) => {
    const selectedLanguage = getStoryLanguageId()
    if (kind === 'store' && selectedLanguage !== 'km') {
      if (mountedRef.current && languageRef.current === selectedLanguage) {
        storeRef.current = null
        setStoreRotation(null)
      }
      return
    }
    const result = await loadPromotionShelf(kind, { force, language: selectedLanguage })
    if (!mountedRef.current || getStoryLanguageId() !== selectedLanguage || languageRef.current !== selectedLanguage) return
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

    const onLanguageChange = () => {
      const selectedLanguage = getStoryLanguageId()
      if (selectedLanguage === languageRef.current) return
      languageRef.current = selectedLanguage
      setLanguage(selectedLanguage)
      const nextStory = getPromotionShelfCache('story', selectedLanguage)
      const nextStore = getPromotionShelfCache('store', selectedLanguage)
      storyRef.current = nextStory
      storeRef.current = nextStore
      setStoryRotation(nextStory)
      setStoreRotation(nextStore)
      attemptsRef.current = { story: 0, store: 0 }
      void load('story')
      if (selectedLanguage === 'km') void load('store')
    }

    const check = () => {
      onLanguageChange()
      const current = Date.now()
      setNow(current)
      for (const kind of ['story', 'store']) {
        if (kind === 'store' && languageRef.current !== 'km') continue
        const rotation = kind === 'story' ? storyRef.current : storeRef.current
        if (rotation?.expiresAt > current) continue
        if (current - attemptsRef.current[kind] < RETRY_MS) continue
        attemptsRef.current[kind] = current
        void load(kind, true)
      }
    }

    const onStorage = (event) => {
      if (event.key === 'shadow_story_language' || event.key === null) onLanguageChange()
    }
    const onVisibility = () => {
      if (document.visibilityState === 'visible') check()
    }

    check()
    const timer = window.setInterval(check, 1000)
    window.addEventListener('shadow:story-language-initialized', onLanguageChange)
    window.addEventListener('storage', onStorage)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      mountedRef.current = false
      window.clearInterval(timer)
      window.removeEventListener('shadow:story-language-initialized', onLanguageChange)
      window.removeEventListener('storage', onStorage)
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
        key={`story-${language}`}
        rotation={storyRotation}
        remainingSeconds={storyRemaining}
        onStale={refreshStory}
      />
      {language === 'km' ? (
        <StorePromotionShelf
          key={`store-${language}`}
          rotation={storeRotation}
          remainingSeconds={storeRemaining}
        />
      ) : null}
    </div>
  )
}
