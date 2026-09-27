export const SHADOW_DOCS_LANGUAGES = Object.freeze([
  { id: 'km', label: 'Khmer', locale: 'km-KH', direction: 'ltr' },
  { id: 'en', label: 'English', locale: 'en-US', direction: 'ltr' },
  { id: 'zh', label: 'Chinese', locale: 'zh-CN', direction: 'ltr' },
  { id: 'ko', label: 'Korean', locale: 'ko-KR', direction: 'ltr' },
  { id: 'ja', label: 'Japanese', locale: 'ja-JP', direction: 'ltr' },
])

export function getShadowDocsLanguage(id = 'km') {
  return SHADOW_DOCS_LANGUAGES.find(language => language.id === id) || SHADOW_DOCS_LANGUAGES[0]
}

export function detectShadowDocsScripts(text) {
  const value = String(text || '')
  const counts = {
    khmer: (value.match(/[\u1780-\u17ff]/g) || []).length,
    latin: (value.match(/[A-Za-z]/g) || []).length,
    han: (value.match(/[\u3400-\u9fff]/g) || []).length,
    hangul: (value.match(/[\uac00-\ud7af]/g) || []).length,
    kana: (value.match(/[\u3040-\u30ff]/g) || []).length,
  }
  return counts
}

export function detectShadowDocsLanguage(text) {
  const counts = detectShadowDocsScripts(text)
  const ranked = [
    ['km', counts.khmer],
    ['ko', counts.hangul],
    ['ja', counts.kana],
    ['zh', counts.han],
    ['en', counts.latin],
  ].sort((a, b) => b[1] - a[1])
  return ranked[0][1] > 0 ? getShadowDocsLanguage(ranked[0][0]) : getShadowDocsLanguage('km')
}

export function applyShadowDocsLanguage(element, languageId) {
  if (!element) return false
  const language = getShadowDocsLanguage(languageId)
  element.lang = language.id
  element.dir = language.direction
  element.dataset.shadowDocsLanguage = language.id
  return true
}

export function shadowDocsLocaleCompare(a, b, languageId = 'km') {
  const language = getShadowDocsLanguage(languageId)
  return String(a || '').localeCompare(String(b || ''), language.locale, { numeric: true, sensitivity: 'base' })
}
