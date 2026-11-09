import { isShadowDocsFont } from './ShadowDocsFontCatalog'
import { applyShadowDocsInlineFormat, applyShadowDocsParagraphFormat } from './ShadowDocsFormattingEngine'
import { captureShadowDocsSelection, restoreShadowDocsSelection } from './ShadowDocsSelectionEngine'

const BLOCKS = new Set(['P', 'DIV', 'H1', 'H2', 'H3', 'BLOCKQUOTE', 'LI'])

function nearestBlock(editor, element) {
  let node = element
  while (node && node !== editor) {
    if (BLOCKS.has(node.tagName)) return node
    node = node.parentElement
  }
  return null
}

function color(value) {
  const raw = String(value || '').trim()
  if (/^#[\da-f]{3,8}$/i.test(raw)) return raw
  const match = raw.match(/^rgba?\(\s*(\d+)\s*[, ]\s*(\d+)\s*[, ]\s*(\d+)(?:\s*[,/]\s*(\d*\.?\d+))?\s*\)$/i)
  if (!match || (match[4] != null && Number(match[4]) === 0)) return ''
  return `#${match.slice(1, 4).map(value => Math.max(0, Math.min(255, Number(value))).toString(16).padStart(2, '0')).join('')}`
}

function pt(value) {
  const number = Number.parseFloat(String(value || ''))
  return Number.isFinite(number) ? Math.max(0, Math.round(number * 0.75 * 100) / 100) : 0
}

function sourceElement(editor, snapshot) {
  const range = restoreShadowDocsSelection(editor, snapshot)
  if (!range) return null
  const node = range.startContainer
  const element = node?.nodeType === 1 ? node : node?.parentElement
  return element && editor.contains(element) ? element : null
}

export function captureShadowDocsHomeFormat(editor, snapshot) {
  if (!editor || !snapshot || typeof getComputedStyle !== 'function') return null
  const element = sourceElement(editor, snapshot)
  if (!element) return null
  const inline = getComputedStyle(element)
  const blockNode = nearestBlock(editor, element)
  const block = blockNode ? getComputedStyle(blockNode) : null
  const fontName = String(inline.fontFamily || '').split(',')[0].trim().replace(/^["']|["']$/g, '')
  const decoration = `${inline.textDecorationLine || ''} ${inline.textDecoration || ''}`.toLowerCase()
  const fontPixels = Number.parseFloat(inline.fontSize) || 16
  const blockFontPixels = block ? Number.parseFloat(block.fontSize) || fontPixels : fontPixels
  const ratio = block ? Number.parseFloat(block.lineHeight) / blockFontPixels : NaN
  const format = {
    inline: {
      fontSize: Math.max(6, Math.min(96, pt(inline.fontSize) || 13)),
      color: color(inline.color) || '#242139',
      bold: Number.parseInt(inline.fontWeight, 10) >= 600 || inline.fontWeight === 'bold',
      italic: inline.fontStyle === 'italic' || inline.fontStyle === 'oblique',
      underline: decoration.includes('underline'),
      strike: decoration.includes('line-through'),
      superscript: inline.verticalAlign === 'super',
      subscript: inline.verticalAlign === 'sub',
    },
    paragraph: block ? {
      alignment: ['left', 'right', 'center', 'justify'].includes(block.textAlign) ? block.textAlign : 'left',
      lineHeight: Number.isFinite(ratio) ? Math.max(0.8, Math.min(4, ratio)) : 1.65,
      spaceBefore: pt(block.marginTop),
      spaceAfter: pt(block.marginBottom),
      indentLeft: pt(block.marginLeft),
      indentRight: pt(block.marginRight),
      firstLineIndent: pt(block.textIndent),
    } : null,
  }
  if (isShadowDocsFont(fontName)) format.inline.fontFamily = fontName
  const background = color(inline.backgroundColor)
  if (background) format.inline.backgroundColor = background
  return format
}

export function applyShadowDocsHomeFormat(editor, snapshot, captured) {
  if (!captured?.inline || !editor || !snapshot) return false
  const range = restoreShadowDocsSelection(editor, snapshot)
  if (!range || range.collapsed) return false
  const inlineApplied = applyShadowDocsInlineFormat(editor, snapshot, captured.inline)
  const nextSnapshot = captureShadowDocsSelection(editor) || snapshot
  const paragraphApplied = captured.paragraph
    ? applyShadowDocsParagraphFormat(editor, nextSnapshot, captured.paragraph)
    : false
  return inlineApplied || paragraphApplied
}
