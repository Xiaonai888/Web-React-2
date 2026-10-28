// Web-React-2/src/utils/storyLanguage.js
// Story Language is a reader preference, independent of IP/country rules.
const STORY_LANGUAGE_STORAGE_KEY = 'shadow_story_language'
const VALID_STORY_LANGUAGES = new Set(['km', 'en', 'zh', 'ja', 'ko'])

const STORY_LANGUAGE_LABELS = {
  km: 'Khmer',
  en: 'English',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean',
}

const API_BASE_URL = (
  import.meta.env?.VITE_API_URL || 'https://shadow-backend-kucw.onrender.com'
).replace(/\/$/, '')

let pendingWrite = Promise.resolve()
let lastSaved = null
let pendingRead = null
let readResult = null
let localRevision = 0

function checkedLanguage(value) {
  const language = String(value || '').trim().toLowerCase()
  if (!VALID_STORY_LANGUAGES.has(language)) {
    throw new Error('Invalid Story Language')
  }
  return language
}

function readToken() {
  try {
    return sessionStorage.getItem('shadow_reader_token') ||
      localStorage.getItem('shadow_reader_token') || ''
  } catch {
    return ''
  }
}

function readStoredLanguage() {
  try {
    return localStorage.getItem(STORY_LANGUAGE_STORAGE_KEY)
  } catch {
    return null
  }
}

function setLocalLanguage(language) {
  const selected = checkedLanguage(language)
  localRevision += 1
  try {
    localStorage.setItem(STORY_LANGUAGE_STORAGE_KEY, selected)
    window.dispatchEvent(new CustomEvent('shadow:story-language-initialized', {
      detail: { language: selected },
    }))
  } catch {
    // Keep the on-screen choice when browser storage is unavailable.
  }
  return selected
}

export function getStoryLanguageId() {
  const value = readStoredLanguage()
  return VALID_STORY_LANGUAGES.has(value) ? value : 'km'
}

export function getStoryLanguageLabel() {
  return STORY_LANGUAGE_LABELS[getStoryLanguageId()] || 'Khmer'
}

export function addStoryLanguageParam(url) {
  const selectedLanguage = getStoryLanguageLabel()
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}language=${encodeURIComponent(selectedLanguage)}`
}

// Called only when the reader explicitly chooses a language. Never call this
// on render or every page load; it would produce unnecessary Supabase requests.
export function saveStoryLanguagePreference(language) {
  const selected = setLocalLanguage(language)
  return syncStoryLanguageToAccount(selected)
}

// Serialized writes prevent a slow earlier selection from overwriting a newer one.
export function syncStoryLanguageToAccount(language = getStoryLanguageId()) {
  const selected = checkedLanguage(language)
  const token = readToken()
  if (!token) return Promise.resolve({ ok: false, skipped: 'signed_out' })
  if (lastSaved?.token === token && lastSaved?.language === selected) {
    return Promise.resolve({ ok: true, unchanged: true, story_language: selected })
  }

  const write = pendingWrite.catch(() => {}).then(async () => {
    if (lastSaved?.token === token && lastSaved?.language === selected) {
      return { ok: true, unchanged: true, story_language: selected }
    }
    const response = await fetch(`${API_BASE_URL}/api/users/me/story-language`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ story_language: selected }),
    })
    if (!response.ok) throw new Error(`STORY_LANGUAGE_SYNC_HTTP_${response.status}`)
    const data = await response.json()
    if (!data.ok || data.story_language !== selected) {
      throw new Error('STORY_LANGUAGE_SYNC_INVALID_RESPONSE')
    }
    lastSaved = { token, language: selected }
    readResult = { token, data }
    return data
  })
  pendingWrite = write.catch(() => {})
  return write
}

// Explicitly call once on Mine/Settings open to restore a saved choice from
// another device. The server wins if it has an explicitly synced preference.
export async function loadStoryLanguageFromAccount() {
  const token = readToken()
  if (!token) return { ok: false, skipped: 'signed_out' }
  if (readResult?.token === token) return readResult.data
  if (pendingRead?.token === token) return pendingRead.promise

  const revision = localRevision
  const promise = (async () => {
    const response = await fetch(`${API_BASE_URL}/api/users/me/story-language`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!response.ok) throw new Error(`STORY_LANGUAGE_LOAD_HTTP_${response.status}`)
    const data = await response.json()
    if (!data.ok) throw new Error('STORY_LANGUAGE_LOAD_INVALID_RESPONSE')

    if (revision !== localRevision || readToken() !== token) return data

    if (data.synced && VALID_STORY_LANGUAGES.has(data.story_language)) {
      if (getStoryLanguageId() !== data.story_language) {
        setLocalLanguage(data.story_language)
      }
      lastSaved = { token, language: data.story_language }
    } else if (readStoredLanguage() !== null) {
      // Legacy browser choices are not tied to an account. Never silently
      // migrate one user's local choice into another user's account.
      // The next explicit selection will sync safely via PUT.
      data.needs_explicit_sync = true
    }
    readResult = { token, data }
    return data
  })()
  pendingRead = { token, promise }
  try {
    return await promise
  } finally {
    if (pendingRead?.promise === promise) pendingRead = null
  }
}
