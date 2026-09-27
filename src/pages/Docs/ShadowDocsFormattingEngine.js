import { shadowDocsInlineStyle, shadowDocsParagraphStyle } from './ShadowDocsFormattingSchema'
import { getShadowDocsSelectedBlocks, restoreShadowDocsSelection } from './ShadowDocsSelectionEngine'

function setStyle(element, style) {
  Object.entries(style).forEach(([key, value]) => {
    element.style[key] = value
  })
}

function textNodesWithin(fragment) {
  if (typeof document === 'undefined') return []
  const nodes = []
  const walker = document.createTreeWalker(fragment, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()
  while (node) {
    if (node.nodeValue) nodes.push(node)
    node = walker.nextNode()
  }
  return nodes
}

function wrapTextNodes(fragment, style) {
  textNodesWithin(fragment).forEach(node => {
    const span = document.createElement('span')
    setStyle(span, style)
    node.parentNode.replaceChild(span, node)
    span.appendChild(node)
  })
}

export function applyShadowDocsInlineFormat(editor, snapshot, format) {
  const range = restoreShadowDocsSelection(editor, snapshot)
  if (!range || range.collapsed || typeof document === 'undefined') return false
  const style = shadowDocsInlineStyle(format)
  if (!Object.keys(style).length) return false
  const fragment = range.extractContents()
  wrapTextNodes(fragment, style)
  range.insertNode(fragment)
  editor.normalize()
  return true
}

export function clearShadowDocsInlineFormatting(editor, snapshot) {
  const range = restoreShadowDocsSelection(editor, snapshot)
  if (!range || range.collapsed || typeof document === 'undefined') return false
  const fragment = range.extractContents()
  fragment.querySelectorAll?.('span,font,b,strong,i,em,u,s,sub,sup').forEach(node => {
    const parent = node.parentNode
    while (node.firstChild) parent.insertBefore(node.firstChild, node)
    node.remove()
  })
  range.insertNode(fragment)
  editor.normalize()
  return true
}

export function applyShadowDocsParagraphFormat(editor, snapshot, format) {
  const blocks = getShadowDocsSelectedBlocks(editor, snapshot)
  if (!blocks.length) return false
  const style = shadowDocsParagraphStyle(format)
  blocks.forEach(block => setStyle(block, style))
  return true
}

export function setShadowDocsBlockType(editor, snapshot, tagName = 'p') {
  const allowed = new Set(['p', 'h1', 'h2', 'h3', 'blockquote'])
  const tag = allowed.has(String(tagName).toLowerCase()) ? String(tagName).toLowerCase() : 'p'
  const blocks = getShadowDocsSelectedBlocks(editor, snapshot)
  if (!blocks.length || typeof document === 'undefined') return false
  blocks.forEach(block => {
    if (block.tagName === 'LI') return
    const next = document.createElement(tag)
    if (block.hasAttribute('style')) next.setAttribute('style', block.getAttribute('style'))
    while (block.firstChild) next.appendChild(block.firstChild)
    block.replaceWith(next)
  })
  return true
}

export function toggleShadowDocsList(editor, snapshot, type = 'ul') {
  const listTag = type === 'ol' ? 'ol' : 'ul'
  const blocks = getShadowDocsSelectedBlocks(editor, snapshot)
  if (!blocks.length || typeof document === 'undefined') return false
  if (blocks.every(block => block.tagName === 'LI' && block.parentElement?.tagName === listTag.toUpperCase())) {
    const lists = [...new Set(blocks.map(block => block.parentElement))]
    lists.forEach(list => {
      const fragment = document.createDocumentFragment()
      ;[...list.children].forEach(item => {
        const paragraph = document.createElement('p')
        while (item.firstChild) paragraph.appendChild(item.firstChild)
        fragment.appendChild(paragraph)
      })
      list.replaceWith(fragment)
    })
    return true
  }
  const list = document.createElement(listTag)
  const first = blocks[0]
  first.parentNode.insertBefore(list, first)
  blocks.forEach(block => {
    const item = document.createElement('li')
    while (block.firstChild) item.appendChild(block.firstChild)
    list.appendChild(item)
    block.remove()
  })
  return true
}

export function applyShadowDocsCommand(editor, snapshot, command, value) {
  if (!editor || !snapshot) return false
  if (command === 'fontFamily') return applyShadowDocsInlineFormat(editor, snapshot, { fontFamily: value })
  if (command === 'fontSize') return applyShadowDocsInlineFormat(editor, snapshot, { fontSize: value })
  if (command === 'color') return applyShadowDocsInlineFormat(editor, snapshot, { color: value })
  if (command === 'highlight') return applyShadowDocsInlineFormat(editor, snapshot, { backgroundColor: value })
  if (command === 'bold') return applyShadowDocsInlineFormat(editor, snapshot, { bold: Boolean(value) })
  if (command === 'italic') return applyShadowDocsInlineFormat(editor, snapshot, { italic: Boolean(value) })
  if (command === 'underline') return applyShadowDocsInlineFormat(editor, snapshot, { underline: Boolean(value) })
  if (command === 'strike') return applyShadowDocsInlineFormat(editor, snapshot, { strike: Boolean(value) })
  if (command === 'superscript') return applyShadowDocsInlineFormat(editor, snapshot, { superscript: Boolean(value), subscript: false })
  if (command === 'subscript') return applyShadowDocsInlineFormat(editor, snapshot, { subscript: Boolean(value), superscript: false })
  if (command === 'clearFormatting') return clearShadowDocsInlineFormatting(editor, snapshot)
  if (command === 'blockType') return setShadowDocsBlockType(editor, snapshot, value)
  if (command === 'bullets') return toggleShadowDocsList(editor, snapshot, 'ul')
  if (command === 'numbering') return toggleShadowDocsList(editor, snapshot, 'ol')
  if (command === 'paragraph') return applyShadowDocsParagraphFormat(editor, snapshot, value || {})
  return false
}
