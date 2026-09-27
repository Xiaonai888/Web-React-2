import { createShadowDocsId } from './ShadowDocsBookModel'
import { restoreShadowDocsSelection } from './ShadowDocsSelectionEngine'

const cleanAuthor = value => String(value || 'Author').trim().slice(0, 80) || 'Author'

function changeElement(type, author) {
  const element = document.createElement(type === 'delete' ? 'del' : 'ins')
  element.dataset.shadowDocsChangeId = createShadowDocsId()
  element.dataset.shadowDocsChangeType = type
  element.dataset.shadowDocsChangeAuthor = cleanAuthor(author)
  element.dataset.shadowDocsChangeTime = String(Date.now())
  return element
}

export function markShadowDocsInsertion(editor, snapshot, text, author = 'Author') {
  const range = restoreShadowDocsSelection(editor, snapshot)
  if (!editor || !range || typeof document === 'undefined') return false
  const value = String(text ?? '').slice(0, 100_000)
  if (!value) return false
  const element = changeElement('insert', author)
  element.textContent = value
  range.deleteContents()
  range.insertNode(element)
  return element.dataset.shadowDocsChangeId
}

export function markShadowDocsDeletion(editor, snapshot, author = 'Author') {
  const range = restoreShadowDocsSelection(editor, snapshot)
  if (!editor || !range || range.collapsed || typeof document === 'undefined') return false
  const element = changeElement('delete', author)
  const fragment = range.extractContents()
  element.appendChild(fragment)
  range.insertNode(element)
  return element.dataset.shadowDocsChangeId
}

export function acceptShadowDocsChange(editor, changeId) {
  if (!editor || !changeId) return false
  const element = editor.querySelector(`[data-shadow-docs-change-id="${CSS.escape(String(changeId))}"]`)
  if (!element) return false
  if (element.dataset.shadowDocsChangeType === 'delete') element.remove()
  else element.replaceWith(...element.childNodes)
  return true
}

export function rejectShadowDocsChange(editor, changeId) {
  if (!editor || !changeId) return false
  const element = editor.querySelector(`[data-shadow-docs-change-id="${CSS.escape(String(changeId))}"]`)
  if (!element) return false
  if (element.dataset.shadowDocsChangeType === 'insert') element.remove()
  else element.replaceWith(...element.childNodes)
  return true
}

export function listShadowDocsChanges(editor) {
  if (!editor) return []
  return [...editor.querySelectorAll('[data-shadow-docs-change-id]')].map(element => ({
    id: element.dataset.shadowDocsChangeId || '',
    type: element.dataset.shadowDocsChangeType || '',
    author: element.dataset.shadowDocsChangeAuthor || '',
    createdAt: Number(element.dataset.shadowDocsChangeTime) || 0,
    text: (element.textContent || '').slice(0, 500),
  }))
}
