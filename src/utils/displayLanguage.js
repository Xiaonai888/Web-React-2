import i18n, {
  DISPLAY_LANGUAGE_STORAGE_KEY,
  normalizeLanguage,
} from '../i18n'

export function getDisplayLanguageId() {
  return normalizeLanguage(i18n.resolvedLanguage || i18n.language || 'en')
}

export function setDisplayLanguageId(languageId) {
  const language = normalizeLanguage(languageId)

  try {
    localStorage.setItem(DISPLAY_LANGUAGE_STORAGE_KEY, language)
  } catch {}

  void i18n.changeLanguage(language)
}

export function getDisplayText(key, options) {
  return i18n.t(key, {
    defaultValue: key,
    ...options,
  })
}
