const PREFIX = 'shadow-docs:review:v1:'

export const SHADOW_DOCS_REVIEW_DEFAULTS = Object.freeze({
  spellCheck: true,
  showComments: true,
  showMarkup: true,
  userName: 'Author',
})

function cleanName(value) {
  return String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 80) || 'Author'
}

function keyFor(documentId) {
  return PREFIX + encodeURIComponent(String(documentId || 'default').slice(0, 120))
}

export function readShadowDocsReviewPreferences(documentId) {
  try {
    const raw = JSON.parse(globalThis.localStorage?.getItem(keyFor(documentId)) || 'null')
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { ...SHADOW_DOCS_REVIEW_DEFAULTS }
    return {
      spellCheck: typeof raw.spellCheck === 'boolean' ? raw.spellCheck : true,
      showComments: typeof raw.showComments === 'boolean' ? raw.showComments : true,
      showMarkup: typeof raw.showMarkup === 'boolean' ? raw.showMarkup : true,
      userName: cleanName(raw.userName),
    }
  } catch {
    return { ...SHADOW_DOCS_REVIEW_DEFAULTS }
  }
}

export function saveShadowDocsReviewPreferences(documentId, preferences) {
  const value = {
    spellCheck: preferences?.spellCheck !== false,
    showComments: preferences?.showComments !== false,
    showMarkup: preferences?.showMarkup !== false,
    userName: cleanName(preferences?.userName),
  }
  try {
    globalThis.localStorage?.setItem(keyFor(documentId), JSON.stringify(value))
  } catch {}
  return value
}

export function applyShadowDocsReviewVisibility(editor, preferences) {
  if (!editor) return false
  editor.spellcheck = preferences?.spellCheck !== false
  editor.classList.toggle('sd-review-comments-hidden', preferences?.showComments === false)
  editor.classList.toggle('sd-review-markup-hidden', preferences?.showMarkup === false)
  return true
}
