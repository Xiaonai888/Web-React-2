import { createShadowDocsId } from './ShadowDocsBookModel'
import { restoreShadowDocsSelection } from './ShadowDocsSelectionEngine'

const cleanText = (value, max) => String(value ?? '').trim().slice(0, max)

export function createShadowDocsCommentRecord({ text, author = 'Author', chapterId = '' } = {}) {
  const now = Date.now()
  return {
    id: createShadowDocsId(),
    chapterId: cleanText(chapterId, 120),
    author: cleanText(author, 80) || 'Author',
    text: cleanText(text, 2000),
    createdAt: now,
    updatedAt: now,
    resolvedAt: null,
  }
}

export function addShadowDocsComment(editor, snapshot, record) {
  const range = restoreShadowDocsSelection(editor, snapshot)
  if (!editor || !range || range.collapsed || !record?.id || typeof document === 'undefined') return false
  const span = document.createElement('span')
  span.dataset.shadowDocsCommentId = record.id
  span.style.backgroundColor = 'rgba(255, 220, 92, .35)'
  try {
    range.surroundContents(span)
  } catch {
    const fragment = range.extractContents()
    span.appendChild(fragment)
    range.insertNode(span)
  }
  return true
}

export function removeShadowDocsCommentMark(editor, commentId) {
  if (!editor || !commentId) return false
  const marks = [...editor.querySelectorAll(`[data-shadow-docs-comment-id="${CSS.escape(String(commentId))}"]`)]
  marks.forEach(mark => mark.replaceWith(...mark.childNodes))
  return marks.length > 0
}

export function updateShadowDocsComment(record, text) {
  if (!record?.id) return null
  return { ...record, text: cleanText(text, 2000), updatedAt: Date.now() }
}

export function resolveShadowDocsComment(record, resolved = true) {
  if (!record?.id) return null
  return { ...record, resolvedAt: resolved ? Date.now() : null, updatedAt: Date.now() }
}

export function getShadowDocsCommentMarks(editor) {
  if (!editor) return []
  return [...editor.querySelectorAll('[data-shadow-docs-comment-id]')].map(mark => ({
    id: mark.dataset.shadowDocsCommentId || '',
    text: (mark.textContent || '').slice(0, 240),
  }))
}
