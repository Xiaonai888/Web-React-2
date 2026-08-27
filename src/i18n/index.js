import { useSyncExternalStore } from 'react'
import resources from './resources'

const DISPLAY_LANGUAGE_STORAGE_KEY = 'shadow_display_language'
const SUPPORTED_LANGUAGES = ['km', 'en', 'zh', 'ja', 'ko']
const listeners = new Set()

export function normalizeLanguage(languageId) {
  return SUPPORTED_LANGUAGES.includes(languageId) ? languageId : 'en'
}

function loadLanguage() {
  try {
    return normalizeLanguage(localStorage.getItem(DISPLAY_LANGUAGE_STORAGE_KEY))
  } catch {
    return 'en'
  }
}

let currentLanguage = loadLanguage()

function readTranslation(languageId, key) {
  return String(key || '')
    .split('.')
    .reduce((value, part) => value?.[part], resources[languageId]?.translation)
}

function interpolate(value, options = {}) {
  if (typeof value !== 'string') return value

  return value.replace(/\{\{\s*([^{}\s]+)\s*\}\}/g, (_, name) => {
    const replacement = options[name]
    return replacement === undefined || replacement === null ? '' : String(replacement)
  })
}

export function getDisplayLanguage() {
  return currentLanguage
}

export function translate(key, options = {}) {
  const selected = readTranslation(currentLanguage, key)
  const fallback = readTranslation('en', key)
  const value = selected ?? fallback ?? options.defaultValue ?? key
  return interpolate(value, options)
}

export function changeDisplayLanguage(languageId) {
  const nextLanguage = normalizeLanguage(languageId)
  currentLanguage = nextLanguage

  try {
    localStorage.setItem(DISPLAY_LANGUAGE_STORAGE_KEY, nextLanguage)
  } catch {}

  document.documentElement.lang = nextLanguage

  for (const listener of listeners) listener()

  window.dispatchEvent(new Event('shadow-display-language-change'))
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useDisplayTranslation() {
  const language = useSyncExternalStore(
    subscribe,
    getDisplayLanguage,
    getDisplayLanguage
  )

  return {
    language,
    t: translate,
    changeLanguage: changeDisplayLanguage,
  }
}

document.documentElement.lang = currentLanguage

const i18n = {
  get language() {
    return currentLanguage
  },
  get resolvedLanguage() {
    return currentLanguage
  },
  t: translate,
  changeLanguage: changeDisplayLanguage,
}

export {
  DISPLAY_LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
}

export default i18n
