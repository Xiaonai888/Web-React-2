import { restoreShadowDocsSelection } from './ShadowDocsSelectionEngine'

function insertNode(editor, snapshot, node) {
  const range = restoreShadowDocsSelection(editor, snapshot)
  if (!editor || !range || !node) return false
  range.deleteContents()
  range.insertNode(node)
  return node
}

export function insertShadowDocsHorizontalRule(editor, snapshot) {
  if (typeof document === 'undefined') return false
  const hr = document.createElement('hr')
  hr.dataset.shadowDocsRule = '1'
  return insertNode(editor, snapshot, hr)
}

export function insertShadowDocsPageBreak(editor, snapshot) {
  if (typeof document === 'undefined') return false
  const hr = document.createElement('hr')
  hr.dataset.shadowDocsPageBreak = '1'
  hr.contentEditable = 'false'
  return insertNode(editor, snapshot, hr)
}

export function insertShadowDocsDateTime(editor, snapshot, options = {}) {
  if (typeof document === 'undefined') return false
  const date = options.date instanceof Date ? options.date : new Date()
  const locale = String(options.locale || 'km-KH').slice(0, 20)
  const value = options.includeTime
    ? new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
    : new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date)
  return insertNode(editor, snapshot, document.createTextNode(value))
}

export function insertShadowDocsSymbol(editor, snapshot, symbol) {
  if (typeof document === 'undefined') return false
  const value = String(symbol || '').slice(0, 16)
  if (!value || /[\u0000-\u001f]/.test(value)) return false
  return insertNode(editor, snapshot, document.createTextNode(value))
}

export function insertShadowDocsEquation(editor, snapshot, expression) {
  if (typeof document === 'undefined') return false
  const value = String(expression || '').trim().slice(0, 500)
  if (!value) return false
  const span = document.createElement('span')
  span.dataset.shadowDocsEquation = '1'
  span.contentEditable = 'false'
  span.textContent = value
  return insertNode(editor, snapshot, span)
}

export function insertShadowDocsTextBox(editor, snapshot, text = '') {
  if (typeof document === 'undefined') return false
  const box = document.createElement('div')
  box.dataset.shadowDocsTextBox = '1'
  box.contentEditable = 'true'
  box.style.border = '1px solid #b9b4c7'
  box.style.padding = '8px'
  box.style.margin = '8px 0'
  box.textContent = String(text || '').slice(0, 5000)
  return insertNode(editor, snapshot, box)
}
