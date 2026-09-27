import { restoreShadowDocsSelection } from './ShadowDocsSelectionEngine'

function transformWords(value, transformer) {
  return String(value || '').replace(/\p{L}[\p{L}\p{M}'’-]*/gu, transformer)
}

export function transformShadowDocsCase(value, mode) {
  const text = String(value || '')
  if (mode === 'upper') return text.toLocaleUpperCase()
  if (mode === 'lower') return text.toLocaleLowerCase()
  if (mode === 'title') return transformWords(text, word => word.charAt(0).toLocaleUpperCase() + word.slice(1).toLocaleLowerCase())
  if (mode === 'sentence') {
    let start = true
    return [...text].map(char => {
      if (/[.!?។៕]/u.test(char)) {
        start = true
        return char
      }
      if (start && /\p{L}/u.test(char)) {
        start = false
        return char.toLocaleUpperCase()
      }
      if (/\p{L}/u.test(char)) start = false
      return char
    }).join('')
  }
  if (mode === 'toggle') {
    return [...text].map(char => {
      const upper = char.toLocaleUpperCase()
      const lower = char.toLocaleLowerCase()
      return char === upper && char !== lower ? lower : upper
    }).join('')
  }
  return text
}

export function applyShadowDocsCase(editor, snapshot, mode) {
  const range = restoreShadowDocsSelection(editor, snapshot)
  if (!range || range.collapsed || typeof document === 'undefined') return false
  const fragment = range.extractContents()
  const walker = document.createTreeWalker(fragment, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()
  while (node) {
    node.nodeValue = transformShadowDocsCase(node.nodeValue, mode)
    node = walker.nextNode()
  }
  range.insertNode(fragment)
  editor.normalize()
  return true
}
