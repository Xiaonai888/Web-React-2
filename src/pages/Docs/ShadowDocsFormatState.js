import { isShadowDocsFont } from './ShadowDocsFontCatalog'
import { captureShadowDocsSelection } from './ShadowDocsSelectionEngine'

const cleanFamily = value => String(value || '').split(',')[0].trim().replace(/^["']|["']$/g, '')
const number = (value, fallback) => Number.isFinite(Number.parseFloat(value)) ? Number.parseFloat(value) : fallback

function elementFromSelection(editor) {
  const selection = globalThis.getSelection?.()
  if (!editor || !selection?.rangeCount) return null
  const node = selection.anchorNode
  if (!node || !editor.contains(node)) return null
  return node.nodeType === 1 ? node : node.parentElement
}

function nearestBlock(editor, element) {
  let current = element
  while (current && current !== editor) {
    if (['P', 'DIV', 'H1', 'H2', 'H3', 'BLOCKQUOTE', 'LI'].includes(current.tagName)) return current
    current = current.parentElement
  }
  return null
}

export function readShadowDocsFormatState(editor) {
  const element = elementFromSelection(editor)
  if (!element || typeof getComputedStyle !== 'function') return null
  const computed = getComputedStyle(element)
  const block = nearestBlock(editor, element)
  const blockStyle = block ? getComputedStyle(block) : computed
  const family = cleanFamily(computed.fontFamily)
  const decoration = computed.textDecorationLine || ''
  return {
    selection: captureShadowDocsSelection(editor),
    fontFamily: isShadowDocsFont(family) ? family : '',
    fontSize: number(computed.fontSize, 16),
    color: computed.color || '',
    backgroundColor: computed.backgroundColor || '',
    bold: Number(computed.fontWeight) >= 600 || ['bold', 'bolder'].includes(computed.fontWeight),
    italic: computed.fontStyle === 'italic',
    underline: decoration.includes('underline'),
    strike: decoration.includes('line-through'),
    superscript: computed.verticalAlign === 'super',
    subscript: computed.verticalAlign === 'sub',
    blockType: block?.tagName?.toLowerCase() || 'p',
    alignment: blockStyle.textAlign || 'left',
    lineHeight: number(blockStyle.lineHeight, 1.65),
    marginTop: number(blockStyle.marginTop, 0),
    marginBottom: number(blockStyle.marginBottom, 0),
    marginLeft: number(blockStyle.marginLeft, 0),
    marginRight: number(blockStyle.marginRight, 0),
    textIndent: number(blockStyle.textIndent, 0),
  }
}

export function isShadowDocsMixedFormat(states, key) {
  if (!Array.isArray(states) || states.length < 2) return false
  const first = states[0]?.[key]
  return states.some(state => state?.[key] !== first)
}
