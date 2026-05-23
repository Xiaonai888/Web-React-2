const STORY_LANGUAGE_STORAGE_KEY = 'shadow_story_language'

const STORY_LANGUAGE_LABELS = {
  km: 'Khmer',
  en: 'English',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean',
}

export function getStoryLanguageId() {
  return localStorage.getItem(STORY_LANGUAGE_STORAGE_KEY) || 'km'
}

export function getStoryLanguageLabel() {
  return STORY_LANGUAGE_LABELS[getStoryLanguageId()] || 'Khmer'
}

export function addStoryLanguageParam(url) {
  const selectedLanguage = getStoryLanguageLabel()
  const separator = url.includes('?') ? '&' : '?'

  return `${url}${separator}language=${encodeURIComponent(selectedLanguage)}`
}
