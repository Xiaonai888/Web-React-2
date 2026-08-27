import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import resources from './resources'

const DISPLAY_LANGUAGE_STORAGE_KEY = 'shadow_display_language'
const SUPPORTED_LANGUAGES = ['km', 'en', 'zh', 'ja', 'ko']

function normalizeLanguage(languageId) {
  return SUPPORTED_LANGUAGES.includes(languageId) ? languageId : 'en'
}

function getInitialLanguage() {
  try {
    return normalizeLanguage(localStorage.getItem(DISPLAY_LANGUAGE_STORAGE_KEY))
  } catch {
    return 'en'
  }
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  })
}

i18n.on('languageChanged', (languageId) => {
  const language = normalizeLanguage(languageId)

  try {
    localStorage.setItem(DISPLAY_LANGUAGE_STORAGE_KEY, language)
  } catch {}

  document.documentElement.lang = language
  window.dispatchEvent(new Event('shadow-display-language-change'))
})

document.documentElement.lang = normalizeLanguage(i18n.resolvedLanguage || i18n.language)

export { DISPLAY_LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES, normalizeLanguage }
export default i18n
