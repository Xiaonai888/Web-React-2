import { isShadowDocsFont } from './ShadowDocsFontCatalog'

export const SHADOW_DOCS_BLOCK_TAGS = Object.freeze(['P', 'DIV', 'H1', 'H2', 'H3', 'BLOCKQUOTE', 'LI'])
export const SHADOW_DOCS_ALIGNMENTS = Object.freeze(['left', 'center', 'right', 'justify'])
export const SHADOW_DOCS_LIST_TYPES = Object.freeze(['ul', 'ol'])

const number = (value, min, max, fallback) => Number.isFinite(Number(value)) ? Math.max(min, Math.min(max, Number(value))) : fallback
const colorPattern = /^(?:#[0-9a-f]{3,8}|rgba?\([^)]{1,60}\)|hsla?\([^)]{1,60}\)|transparent)$/i

export function normalizeShadowDocsColor(value, fallback = '') {
  const color = String(value || '').trim()
  return colorPattern.test(color) ? color : fallback
}

export function normalizeShadowDocsFontSize(value, fallback = 13) {
  return number(value, 6, 96, fallback)
}

export function normalizeShadowDocsLineHeight(value, fallback = 1.65) {
  return number(value, 0.8, 4, fallback)
}

export function normalizeShadowDocsSpacing(value, fallback = 0) {
  return number(value, 0, 144, fallback)
}

export function normalizeShadowDocsIndent(value, fallback = 0) {
  return number(value, -72, 144, fallback)
}

export function normalizeShadowDocsInlineFormat(format = {}) {
  return {
    fontFamily: isShadowDocsFont(format.fontFamily) ? format.fontFamily : '',
    fontSize: normalizeShadowDocsFontSize(format.fontSize, 13),
    color: normalizeShadowDocsColor(format.color),
    backgroundColor: normalizeShadowDocsColor(format.backgroundColor),
    bold: format.bold === true,
    italic: format.italic === true,
    underline: format.underline === true,
    strike: format.strike === true,
    superscript: format.superscript === true,
    subscript: format.subscript === true,
  }
}

export function normalizeShadowDocsParagraphFormat(format = {}) {
  return {
    alignment: SHADOW_DOCS_ALIGNMENTS.includes(format.alignment) ? format.alignment : '',
    lineHeight: normalizeShadowDocsLineHeight(format.lineHeight, 1.65),
    spaceBefore: normalizeShadowDocsSpacing(format.spaceBefore, 0),
    spaceAfter: normalizeShadowDocsSpacing(format.spaceAfter, 0),
    indentLeft: normalizeShadowDocsIndent(format.indentLeft, 0),
    indentRight: normalizeShadowDocsIndent(format.indentRight, 0),
    firstLineIndent: normalizeShadowDocsIndent(format.firstLineIndent, 0),
  }
}

export function shadowDocsInlineStyle(format = {}) {
  const value = normalizeShadowDocsInlineFormat(format)
  const style = {}
  if (value.fontFamily) style.fontFamily = `"${value.fontFamily.replaceAll('"', '')}"`
  if (format.fontSize != null) style.fontSize = `${value.fontSize}pt`
  if (value.color) style.color = value.color
  if (value.backgroundColor) style.backgroundColor = value.backgroundColor
  if (format.bold != null) style.fontWeight = value.bold ? '700' : '400'
  if (format.italic != null) style.fontStyle = value.italic ? 'italic' : 'normal'
  const decorations = []
  if (value.underline) decorations.push('underline')
  if (value.strike) decorations.push('line-through')
  if (format.underline != null || format.strike != null) style.textDecoration = decorations.length ? decorations.join(' ') : 'none'
  if (value.superscript) style.verticalAlign = 'super'
  else if (value.subscript) style.verticalAlign = 'sub'
  else if (format.superscript != null || format.subscript != null) style.verticalAlign = 'baseline'
  return style
}

export function shadowDocsParagraphStyle(format = {}) {
  const value = normalizeShadowDocsParagraphFormat(format)
  const style = {}
  if (value.alignment) style.textAlign = value.alignment
  if (format.lineHeight != null) style.lineHeight = String(value.lineHeight)
  if (format.spaceBefore != null) style.marginTop = `${value.spaceBefore}pt`
  if (format.spaceAfter != null) style.marginBottom = `${value.spaceAfter}pt`
  if (format.indentLeft != null) style.marginLeft = `${value.indentLeft}pt`
  if (format.indentRight != null) style.marginRight = `${value.indentRight}pt`
  if (format.firstLineIndent != null) style.textIndent = `${value.firstLineIndent}pt`
  return style
}
