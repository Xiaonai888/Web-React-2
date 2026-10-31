import { useEffect, useState } from 'react'
import { getStoryLanguageId } from '../utils/storyLanguage'

export default function useStoryLanguageId() {
  const [language, setLanguage] = useState(getStoryLanguageId)

  useEffect(() => {
    const syncLanguage = () => setLanguage(getStoryLanguageId())
    const handleStorage = (event) => {
      if (event.key === 'shadow_story_language' || event.key === null) syncLanguage()
    }

    window.addEventListener('shadow:story-language-initialized', syncLanguage)
    window.addEventListener('storage', handleStorage)
    syncLanguage()
    return () => {
      window.removeEventListener('shadow:story-language-initialized', syncLanguage)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  return language
}
