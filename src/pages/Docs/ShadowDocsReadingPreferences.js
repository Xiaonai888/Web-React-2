const PREFIX = 'shadow-docs-reading-v1:'
const BOOKMARK_PREFIX = 'shadow-docs-reading-bookmarks-v1:'

const DEFAULTS = Object.freeze({
  theme: 'normal',
  background: '#ffffff',
  fontSize: 16,
  lineSpacing: 1.65,
  readingMode: 'vertical',
  volumeButtons: false,
})

const ALLOWED_BACKGROUNDS = new Set(['#ffffff', '#d5e6d0', '#e2ecf7', '#f9dce7', '#314963', '#f4ecd9', '#111827'])
const clamp = (value, minimum, maximum, fallback) => Number.isFinite(Number(value)) ? Math.min(maximum, Math.max(minimum, Number(value))) : fallback
const safeId = value => encodeURIComponent(String(value || '').slice(0, 120))

export const SHADOW_DOCS_READING_DEFAULTS = DEFAULTS
export const SHADOW_DOCS_READING_BACKGROUNDS = Object.freeze([...ALLOWED_BACKGROUNDS])

export function normalizeShadowDocsReadingPreferences(value = {}) {
  const input = value && typeof value === 'object' ? value : {}
  const theme = ['normal', 'night', 'eye'].includes(input.theme) ? input.theme : DEFAULTS.theme
  const background = /^#[0-9a-f]{6}$/i.test(String(input.background || ''))
    ? String(input.background).toLowerCase()
    : DEFAULTS.background
  const nearestSpacing = [1.4, 1.65, 2].reduce((best, item) => Math.abs(item - Number(input.lineSpacing)) < Math.abs(best - Number(input.lineSpacing)) ? item : best, 1.65)

  return {
    theme,
    background,
    fontSize: Math.round(clamp(input.fontSize, 10, 32, DEFAULTS.fontSize)),
    lineSpacing: Number.isFinite(Number(input.lineSpacing)) ? nearestSpacing : DEFAULTS.lineSpacing,
    readingMode: input.readingMode === 'paged' ? 'paged' : 'vertical',
    volumeButtons: input.volumeButtons === true,
  }
}

export function readShadowDocsReadingPreferences(bookId) {
  if (!bookId) return { ...DEFAULTS }
  try {
    return normalizeShadowDocsReadingPreferences(JSON.parse(localStorage.getItem(PREFIX + safeId(bookId)) || 'null'))
  } catch {
    return { ...DEFAULTS }
  }
}

export function saveShadowDocsReadingPreferences(bookId, preferences) {
  const normalized = normalizeShadowDocsReadingPreferences(preferences)
  if (bookId) {
    try { localStorage.setItem(PREFIX + safeId(bookId), JSON.stringify(normalized)) } catch {}
  }
  return normalized
}

export function readShadowDocsReadingBookmarks(bookId) {
  if (!bookId) return []
  try {
    const records = JSON.parse(localStorage.getItem(BOOKMARK_PREFIX + safeId(bookId)) || '[]')
    if (!Array.isArray(records)) return []
    return records.filter(item => item && typeof item.chapterId === 'string' && Number.isFinite(Number(item.progress)))
      .map(item => ({ chapterId: item.chapterId, progress: clamp(item.progress, 0, 100, 0), savedAt: clamp(item.savedAt, 0, Number.MAX_SAFE_INTEGER, 0) }))
      .sort((a, b) => b.savedAt - a.savedAt).slice(0, 100)
  } catch {
    return []
  }
}

export function saveShadowDocsReadingBookmark(bookId, chapterId, progress) {
  if (!bookId || !chapterId) return null
  const entry = { chapterId: String(chapterId).slice(0, 120), progress: clamp(progress, 0, 100, 0), savedAt: Date.now() }
  const others = readShadowDocsReadingBookmarks(bookId).filter(item => item.chapterId !== entry.chapterId)
  try { localStorage.setItem(BOOKMARK_PREFIX + safeId(bookId), JSON.stringify([entry, ...others].slice(0, 100))) } catch {}
  return entry
}

export function removeShadowDocsReadingBookmark(bookId, chapterId) {
  if (!bookId || !chapterId) return
  const others = readShadowDocsReadingBookmarks(bookId).filter(item => item.chapterId !== chapterId)
  try { localStorage.setItem(BOOKMARK_PREFIX + safeId(bookId), JSON.stringify(others)) } catch {}
}
