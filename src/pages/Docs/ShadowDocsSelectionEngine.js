import { SHADOW_DOCS_BLOCK_TAGS } from './ShadowDocsFormattingSchema'

function childIndex(node) {
  return node?.parentNode ? Array.prototype.indexOf.call(node.parentNode.childNodes, node) : -1
}

function nodePath(root, node) {
  if (!root || !node || !root.contains(node)) return null
  const path = []
  let current = node
  while (current && current !== root) {
    const index = childIndex(current)
    if (index < 0) return null
    path.unshift(index)
    current = current.parentNode
  }
  return current === root ? path : null
}

function resolvePath(root, path) {
  if (!root || !Array.isArray(path)) return null
  let node = root
  for (const index of path) {
    node = node?.childNodes?.[index]
    if (!node) return null
  }
  return node
}

function safeOffset(node, offset) {
  const limit = node?.nodeType === 3 ? node.nodeValue?.length || 0 : node?.childNodes?.length || 0
  return Math.max(0, Math.min(Number(offset) || 0, limit))
}

export function isShadowDocsSelectionInside(editor, selection = globalThis.getSelection?.()) {
  if (!editor || !selection?.rangeCount) return false
  const range = selection.getRangeAt(0)
  return editor.contains(range.startContainer) && editor.contains(range.endContainer)
}

export function captureShadowDocsSelection(editor, selection = globalThis.getSelection?.()) {
  if (!isShadowDocsSelectionInside(editor, selection)) return null
  const range = selection.getRangeAt(0)
  return {
    startPath: nodePath(editor, range.startContainer),
    startOffset: range.startOffset,
    endPath: nodePath(editor, range.endContainer),
    endOffset: range.endOffset,
    collapsed: range.collapsed,
    text: range.toString(),
  }
}

export function restoreShadowDocsSelection(editor, snapshot, selection = globalThis.getSelection?.()) {
  if (!editor || !snapshot || !selection || typeof document === 'undefined') return null
  const start = resolvePath(editor, snapshot.startPath)
  const end = resolvePath(editor, snapshot.endPath)
  if (!start || !end) return null
  const range = document.createRange()
  range.setStart(start, safeOffset(start, snapshot.startOffset))
  range.setEnd(end, safeOffset(end, snapshot.endOffset))
  selection.removeAllRanges()
  selection.addRange(range)
  return range
}

export function getShadowDocsSelectedBlocks(editor, snapshot) {
  const range = restoreShadowDocsSelection(editor, snapshot)
  if (!range || typeof document === 'undefined') return []
  const blocks = []
  const walker = document.createTreeWalker(editor, NodeFilter.SHOW_ELEMENT)
  let node = walker.nextNode()
  while (node) {
    if (SHADOW_DOCS_BLOCK_TAGS.includes(node.tagName) && range.intersectsNode(node)) blocks.push(node)
    node = walker.nextNode()
  }
  if (blocks.length) return blocks.filter(node => !blocks.some(other => other !== node && other.contains(node) && other.tagName === 'LI'))
  let current = range.startContainer.nodeType === 1 ? range.startContainer : range.startContainer.parentElement
  while (current && current !== editor && !SHADOW_DOCS_BLOCK_TAGS.includes(current.tagName)) current = current.parentElement
  return current && current !== editor ? [current] : []
}

export function selectShadowDocsNodeContents(node, collapseToEnd = false) {
  if (!node || typeof document === 'undefined') return false
  const selection = globalThis.getSelection?.()
  if (!selection) return false
  const range = document.createRange()
  range.selectNodeContents(node)
  if (collapseToEnd) range.collapse(false)
  selection.removeAllRanges()
  selection.addRange(range)
  return true
}
