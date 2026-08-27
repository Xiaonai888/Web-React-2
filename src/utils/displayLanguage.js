import i18n, {
  changeDisplayLanguage,
  getDisplayLanguage,
  normalizeLanguage,
  useDisplayTranslation,
} from '../i18n'

export function getDisplayLanguageId() {
  return getDisplayLanguage()
}

export function setDisplayLanguageId(languageId) {
  changeDisplayLanguage(normalizeLanguage(languageId))
}

export function getDisplayText(key, options) {
  return i18n.t(key, options)
}

export { useDisplayTranslation }
