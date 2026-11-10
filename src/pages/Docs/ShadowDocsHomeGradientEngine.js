import { restoreShadowDocsSelection } from './ShadowDocsSelectionEngine'
import { applyShadowDocsInlineFormat } from './ShadowDocsFormattingEngine'

const HEX = /^#[0-9a-f]{6}$/i
const TOKEN_PREFIX = 'v1'

export function normalizeShadowDocsHomeGradient(value) {
  if (!value || !Array.isArray(value.colors)) return null
  const colors = value.colors.map(color => String(color || '').trim().toLowerCase())
  if (colors.length < 2 || colors.length > 3 || !colors.every(color => HEX.test(color))) return null
  const rawDirection = Number(value.direction)
  if (!Number.isFinite(rawDirection)) return null
  const direction = ((Math.round(rawDirection) % 360) + 360) % 360
  return { colors, direction }
}

export function serializeShadowDocsHomeGradient(value) {
  const gradient = normalizeShadowDocsHomeGradient(value)
  return gradient ? [TOKEN_PREFIX, String(gradient.direction), ...gradient.colors].join('|') : ''
}

export function parseShadowDocsHomeGradient(token) {
  const parts = String(token || '').split('|')
  if (parts[0] !== TOKEN_PREFIX || (parts.length !== 4 && parts.length !== 5)) return null
  if (!/^\d{1,3}$/.test(parts[1])) return null
  return normalizeShadowDocsHomeGradient({ direction: Number(parts[1]), colors: parts.slice(2) })
}

export function shadowDocsHomeGradientStyle(value) {
  const gradient = normalizeShadowDocsHomeGradient(value)
  if (!gradient) return null
  return {
    color: gradient.colors[0],
    backgroundImage: `linear-gradient(${gradient.direction}deg, ${gradient.colors.join(', ')})`,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    WebkitPrintColorAdjust: 'exact',
    printColorAdjust: 'exact',
  }
}

function insertAndRestore(editor, range, fragment) {
  const start = document.createComment('sd-home-selection-start')
  const end = document.createComment('sd-home-selection-end')
  const insertion = document.createDocumentFragment()
  insertion.append(start, fragment, end)
  range.insertNode(insertion)
  const selection = globalThis.getSelection?.()
  if (selection) {
    const nextRange = document.createRange()
    nextRange.setStartAfter(start)
    nextRange.setEndBefore(end)
    selection.removeAllRanges()
    selection.addRange(nextRange)
  }
  start.remove()
  end.remove()
  editor.normalize()
}

export function applyShadowDocsHomeGradient(editor, snapshot, value) {
  const gradient = normalizeShadowDocsHomeGradient(value)
  if (!gradient || !editor || typeof document === 'undefined') return false
  const range = restoreShadowDocsSelection(editor, snapshot)
  if (!range || range.collapsed || !range.toString().length) return false
  const fragment = range.extractContents()
  const walker = document.createTreeWalker(fragment, NodeFilter.SHOW_TEXT)
  const nodes = []
  let node = walker.nextNode()
  while (node) {
    if (node.nodeValue) nodes.push(node)
    node = walker.nextNode()
  }
  const token = serializeShadowDocsHomeGradient(gradient)
  const style = shadowDocsHomeGradientStyle(gradient)
  nodes.forEach(textNode => {
    const span = document.createElement('span')
    span.setAttribute('data-shadow-docs-gradient', token)
    Object.assign(span.style, style)
    textNode.parentNode.replaceChild(span, textNode)
    span.appendChild(textNode)
  })
  insertAndRestore(editor, range, fragment)
  return nodes.length > 0
}

export function removeShadowDocsHomeGradient(editor, snapshot) {
  if (!editor || typeof document === 'undefined') return false

  const range = restoreShadowDocsSelection(editor, snapshot)
  if (!range || range.collapsed) return false

  const hasGradient = [
    ...editor.querySelectorAll('span[data-shadow-docs-gradient]'),
  ].some(span => range.intersectsNode(span))

  if (!hasGradient) return false

  const color = globalThis.getComputedStyle?.(editor)?.color || '#242139'

  return applyShadowDocsInlineFormat(editor, snapshot, { color })
}
  if (!editor || typeof document === 'undefined') return false

  const range = restoreShadowDocsSelection(editor, snapshot)
  if (!range || range.collapsed) return false

  const spans = [
    ...editor.querySelectorAll('span[data-shadow-docs-gradient]'),
  ].filter(span => range.intersectsNode(span))

  if (!spans.length) return false

  spans.forEach(span => {
    span.removeAttribute('data-shadow-docs-gradient')

    const properties = [
      'background-image',
      'background-clip',
      '-webkit-background-clip',
      '-webkit-text-fill-color',
      '-webkit-print-color-adjust',
      'print-color-adjust',
      'color',
    ]

    properties.forEach(property => {
      span.style.removeProperty(property)
    })

    if (!span.style.length) {
      span.removeAttribute('style')
    }
  })

  return true
}
