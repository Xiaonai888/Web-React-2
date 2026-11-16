import { getStoryLanguageId } from './storyLanguage'

export function isShadowReadEventLanguageVisible() {
  return getStoryLanguageId() === 'km'
}

export function subscribeShadowReadEventLanguageChange(callback) {
  if (typeof window === 'undefined' || typeof callback !== 'function') return () => {}

  const notify = () => callback(isShadowReadEventLanguageVisible())
  const onStorage = (event) => {
    if (event.key === 'shadow_story_language' || event.key === null) notify()
  }

  window.addEventListener('shadow:story-language-initialized', notify)
  window.addEventListener('storage', onStorage)

  return () => {
    window.removeEventListener('shadow:story-language-initialized', notify)
    window.removeEventListener('storage', onStorage)
  }
}
