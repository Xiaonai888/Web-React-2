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
    if (!node.nodeValue) return
    const span = document.createElement('span')
    setStyle(span, style)
    node.parentNode.replaceChild(span, node)
    span.appendChild(node)
  })
}

function insertAndReselect(editor, range, fragment) {
  if (!editor || !range || !fragment || typeof document === 'undefined') return false

  const nodes = [...fragment.childNodes]
  const textNodes = textNodesWithin(fragment)

  if (!nodes.length) return false

  range.insertNode(fragment)

  const selection = globalThis.getSelection?.()

  if (selection) {
    const next = document.createRange()

    if (textNodes.length) {
      const first = textNodes[0]
      const last = textNodes[textNodes.length - 1]

      next.setStart(first, 0)
      next.setEnd(last, last.nodeValue?.length || 0)
    } else {
      next.setStartBefore(nodes[0])
      next.setEndAfter(nodes[nodes.length - 1])
    }

    selection.removeAllRanges()
    selection.addRange(next)
  }

  return true
}

function offsetInEditor(editor, node, offset) {
  const before = document.createRange()
  before.selectNodeContents(editor)
  before.setEnd(node, offset)
  return before.toString().length
}

function textPoint(root, offset) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()
  let remaining = offset
  let last = null

  while (node) {
    last = node
    const length = node.nodeValue?.length || 0
    if (remaining <= length) return [node, remaining]
    remaining -= length
    node = walker.nextNode()
  }

  return last ? [last, last.nodeValue.length] : null
}

function removeGradientFromFragment(fragment) {
  fragment.querySelectorAll?.('[data-shadow-docs-gradient]').forEach(node => {
    node.removeAttribute('data-shadow-docs-gradient')

    ;[
      'background-image',
      'background-clip',
      '-webkit-background-clip',
      '-webkit-text-fill-color',
      '-webkit-print-color-adjust',
      'print-color-adjust',
      'color',
    ].forEach(name => node.style.removeProperty(name))

    if (!node.style.length) node.removeAttribute('style')
  })
}

function isolateSolidColorRange(editor, range) {
  const start = offsetInEditor(editor, range.startContainer, range.startOffset)
  const end = offsetInEditor(editor, range.endContainer, range.endOffset)

  const gradients = [...editor.querySelectorAll('span[data-shadow-docs-gradient]')]
    .filter(span =>
      range.intersectsNode(span) &&
      !span.parentElement?.closest('span[data-shadow-docs-gradient]')
    )

  for (const span of gradients) {
    if (!span.isConnected || !editor.contains(span)) continue

    const begin = offsetInEditor(editor, span, 0)
    const left = Math.max(0, start - begin)
    const right = Math.min(span.textContent?.length || 0, end - begin)

    if (left >= right) continue

    const firstPoint = textPoint(span, left)
    const lastPoint = textPoint(span, right)
    if (!firstPoint || !lastPoint) continue

    const before = document.createRange()
    before.selectNodeContents(span)
    before.setEnd(...firstPoint)

    const middle = document.createRange()
    middle.setStart(...firstPoint)
    middle.setEnd(...lastPoint)

    const after = document.createRange()
    after.selectNodeContents(span)
    after.setStart(...lastPoint)

    const first = span.cloneNode(false)
    first.append(before.cloneContents())

    const selected = middle.cloneContents()
    removeGradientFromFragment(selected)

    const last = span.cloneNode(false)
    last.append(after.cloneContents())

    const replacement = document.createDocumentFragment()

    if (first.hasChildNodes()) replacement.append(first)
    replacement.append(selected)
    if (last.hasChildNodes()) replacement.append(last)

    span.replaceWith(replacement)
  }

  const startPoint = textPoint(editor, start)
  const endPoint = textPoint(editor, end)
  if (!startPoint || !endPoint) return null

  const next = document.createRange()
  next.setStart(...startPoint)
  next.setEnd(...endPoint)
  return next
}

export function applyShadowDocsInlineFormat(editor, snapshot, format) {
  let range = restoreShadowDocsSelection(editor, snapshot)
  if (!range || range.collapsed || typeof document === 'undefined') return false

  const style = shadowDocsInlineStyle(format)

  if (format.allCaps != null) {
    style.textTransform = format.allCaps ? 'uppercase' : 'none'
    if (format.allCaps) style.fontVariantCaps = 'normal'
  }

  if (format.smallCaps != null) {
    style.fontVariantCaps = format.smallCaps ? 'small-caps' : 'normal'
    if (format.smallCaps) style.textTransform = 'none'
  }

  if (format.underlineStyle != null || format.underlineColor != null) {
    const node = range.startContainer.nodeType === 3
      ? range.startContainer.parentElement
      : range.startContainer

    const existing = globalThis.getComputedStyle?.(node)?.textDecorationLine || ''

    style.textDecorationLine = existing.includes('line-through')
      ? 'underline line-through'
      : 'underline'

    if (format.underlineStyle != null) {
        const styles = {
        single: 'solid',
        dashed: 'dashed',
        wavy: 'wavy',
      }

      style.textDecorationStyle = styles[format.underlineStyle] || 'solid'
      style.textDecorationThickness = format.underlineStyle === 'wavy'
        ? '1px'
        : 'auto'
    }

    if (
      format.underlineColor != null &&
      /^#[0-9a-f]{6}$/i.test(format.underlineColor)
    ) {
      style.textDecorationColor = format.underlineColor
    }
  }

  if (!Object.keys(style).length) return false

  if (format?.color) {
    range = isolateSolidColorRange(editor, range) || range
  }

  const fragment = range.extractContents()
  wrapTextNodes(fragment, style)

  const changed = insertAndReselect(editor, range, fragment)

  if (changed && format?.color) {
    editor.querySelectorAll('span[data-shadow-docs-gradient]').forEach(span => {
      if (
        !span.textContent &&
        !span.querySelector('img,[data-shadow-docs-equation],[data-shadow-docs-bookmark]')
      ) {
        span.remove()
      }
    })
  }

  return changed
}

export function clearShadowDocsInlineFormatting(editor, snapshot) {
  const range = restoreShadowDocsSelection(editor, snapshot)
  if (!range || range.collapsed || typeof document === 'undefined') return false
  const fragment = range.extractContents()
  fragment.querySelectorAll?.('span,font,b,strong,i,em,u,s,sub,sup').forEach(node => {
    const parent = node.parentNode
    if (!parent) return
    while (node.firstChild) parent.insertBefore(node.firstChild, node)
    node.remove()
  })
  return insertAndReselect(editor, range, fragment)
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

function toggleShadowDocsNativeFormat(editor, snapshot, command) {
  const names = {
    bold: 'bold',
    italic: 'italic',
    underline: 'underline',
    strike: 'strikeThrough',
    superscript: 'superscript',
    subscript: 'subscript',
  }
  const name = names[command]
  if (!name || typeof document === 'undefined' || typeof document.execCommand !== 'function') return null

  let cssEnabled = false
  let previousCSS = false
  try {
    editor.focus({ preventScroll: true })
    const range = restoreShadowDocsSelection(editor, snapshot)
    if (!range || range.collapsed) return false

    previousCSS = Boolean(document.queryCommandState?.('styleWithCSS'))
    cssEnabled = document.execCommand('styleWithCSS', false, !['superscript', 'subscript'].includes(command))
    const changed = document.execCommand(name, false, null)
    return changed ? true : null
  } catch {
    return null
  } finally {
    if (cssEnabled) {
      try {
        document.execCommand('styleWithCSS', false, previousCSS)
      } catch {}
    }
  }
}

export function applyShadowDocsCommand(editor, snapshot, command, value) {
  if (!editor || !snapshot) return false

  const nativeResult = toggleShadowDocsNativeFormat(editor, snapshot, command)

  if (nativeResult !== null) return nativeResult
  if (command === 'fontFamily') return applyShadowDocsInlineFormat(editor, snapshot, { fontFamily: value })
  if (command === 'fontSize') return applyShadowDocsInlineFormat(editor, snapshot, { fontSize: value })
  if (command === 'allCaps') return applyShadowDocsInlineFormat(editor, snapshot, { allCaps: Boolean(value) })
  if (command === 'smallCaps') return applyShadowDocsInlineFormat(editor, snapshot, { smallCaps: Boolean(value) })
  if (command === 'underlineStyle') return applyShadowDocsInlineFormat(editor, snapshot, { underlineStyle: value })
  if (command === 'underlineColor') return applyShadowDocsInlineFormat(editor, snapshot, { underlineColor: value })
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
