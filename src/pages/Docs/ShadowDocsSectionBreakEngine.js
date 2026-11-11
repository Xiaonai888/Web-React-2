import { restoreShadowDocsSelection } from './ShadowDocsSelectionEngine'
import { normalizeShadowDocsSectionBreak, renderShadowDocsSectionBreakMarker } from './ShadowDocsSectionLayoutModel.js'

const SPLITTABLE = new Set(['P', 'DIV', 'H1', 'H2', 'H3', 'BLOCKQUOTE'])

function directChildOf(editor, node) {
  let current = node
  while (current && current.parentNode && current.parentNode !== editor) current = current.parentNode
  return current?.parentNode === editor ? current : null
}

function placeMarker(editor, range, marker) {
  if (range.startContainer === editor) {
    editor.insertBefore(marker, editor.childNodes[range.startOffset] || null)
    return null
  }

  const block = directChildOf(editor, range.startContainer)
  if (!block) return false
  if (block.nodeType === 3) {
    const following = block.splitText(range.startOffset)
    editor.insertBefore(marker, following)
    return null
  }

  if (block.nodeType === 1 && SPLITTABLE.has(block.tagName) && !block.hasAttribute('data-shadow-docs-text-box')) {
    const tailRange = document.createRange()
    tailRange.setStart(range.startContainer, range.startOffset)
    tailRange.setEnd(block, block.childNodes.length)
    const tail = tailRange.extractContents()
    const right = tail.hasChildNodes() ? block.cloneNode(false) : document.createElement('p')
    right.removeAttribute('id')
    right.removeAttribute('data-shadow-docs-bookmark')
    if (tail.hasChildNodes()) right.appendChild(tail)
    else right.appendChild(document.createElement('br'))
    block.after(marker, right)
    return right
  }

  block.after(marker)
  return null
}

export function insertShadowDocsSectionBreak(editor, snapshot, options) {
  const value = normalizeShadowDocsSectionBreak(options)
  if (!editor || !value || !snapshot || typeof document === 'undefined') return false
  const range = restoreShadowDocsSelection(editor, snapshot)
  if (!range) return false
  range.collapse(false)

  const source = renderShadowDocsSectionBreakMarker(value)
  const template = document.createElement('template')
  template.innerHTML = source
  const marker = template.content.firstElementChild
  if (!marker) return false
  const destination = placeMarker(editor, range, marker)
  if (destination === false) return false

  const selection = globalThis.getSelection?.()
  if (selection) {
    const caret = document.createRange()
    if (destination) {
      caret.selectNodeContents(destination)
      caret.collapse(true)
    } else {
      caret.setStartAfter(marker)
      caret.collapse(true)
    }
    selection.removeAllRanges()
    selection.addRange(caret)
  }
  return true
}
