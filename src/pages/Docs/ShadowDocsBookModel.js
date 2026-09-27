import { BOOK_TEMPLATES, getBookTemplate, getPageLayoutPreset } from './ShadowDocsTemplateCatalog'
import { isShadowDocsFont } from './ShadowDocsFontCatalog'

const ids = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
const PAGE_SIZES = new Set(['A5', 'A4', 'B5'])
const ALIGNMENTS = new Set(['left', 'center', 'right', 'justify'])
const CHAPTER_STYLES = new Set(['classic', 'modern', 'minimal'])
const ALLOWED = new Set(['P', 'DIV', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'S', 'SUB', 'SUP', 'H1', 'H2', 'H3', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'SPAN', 'A', 'TABLE', 'THEAD', 'TBODY', 'TFOOT', 'TR', 'TH', 'TD', 'INS', 'DEL'])
const INLINE_TAGS = new Set(['SPAN', 'B', 'STRONG', 'I', 'EM', 'U', 'S', 'SUB', 'SUP', 'A', 'INS', 'DEL'])
const BLOCK_TAGS = new Set(['P', 'DIV', 'H1', 'H2', 'H3', 'LI', 'BLOCKQUOTE', 'TH', 'TD'])
const clamp = (value, low, high, fallback) => value === '' || value == null || !Number.isFinite(Number(value)) ? fallback : Math.max(low, Math.min(high, Number(value)))
const brief = (value, max) => String(value ?? '').slice(0, max)
const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
const safeToken = value => String(value || '').trim().replace(/[^\p{L}\p{N}_-]+/gu, '-').replace(/^-+|-+$/g, '').slice(0, 120)
const safeColor = value => /^(?:#[0-9a-f]{3,8}|rgba?\([^)]{1,60}\)|hsla?\([^)]{1,60}\)|transparent)$/i.test(String(value || '').trim()) ? String(value).trim() : ''
const safeHref = value => /^(?:https?:|mailto:|tel:|#)/i.test(String(value || '').trim()) ? String(value).trim().slice(0, 2048) : ''
const safeSettingColor = (value, fallback) => /^#[0-9a-f]{6}$/i.test(String(value || '').trim()) ? String(value).trim().toLowerCase() : fallback
const DESIGN_THEMES = new Set(['classic', 'modern', 'minimal', 'warm'])
const BORDER_STYLES = new Set(['solid', 'double', 'dashed', 'dotted'])
const DOCUMENT_LANGUAGES = new Set(['km', 'en', 'zh', 'ko', 'ja'])
export const createShadowDocsId = ids
export const isShadowDocsImage = value => typeof value === 'string' && /^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(value) && value.length < 2_500_000
export const isShadowDocsManuscriptImage = value => isShadowDocsImage(value) && value.length <= 300_000

function safeLength(value, min, max, units = ['pt']) {
  const match = String(value || '').trim().match(/^(-?\d+(?:\.\d+)?)(pt|px|em|rem|mm|%)$/i)
  if (!match || !units.includes(match[2].toLowerCase())) return ''
  const number = clamp(match[1], min, max, null)
  return number == null ? '' : `${number}${match[2].toLowerCase()}`
}

function safeLineHeight(value) {
  const raw = String(value || '').trim()
  if (/^\d+(?:\.\d+)?$/.test(raw)) return String(clamp(raw, 0.8, 4, 1.65))
  return safeLength(raw, 6, 200, ['pt', 'px', 'em', 'rem'])
}

function sanitizeStyle(node) {
  const style = node.style || {}
  const rules = []
  const family = INLINE_TAGS.has(node.tagName) ? String(style.fontFamily || '').split(',')[0].trim().replace(/^["']|["']$/g, '') : ''
  const fontSize = INLINE_TAGS.has(node.tagName) ? safeLength(style.fontSize, 6, 96, ['pt', 'px', 'em', 'rem']) : ''
  const color = INLINE_TAGS.has(node.tagName) ? safeColor(style.color) : ''
  const background = INLINE_TAGS.has(node.tagName) ? safeColor(style.backgroundColor) : ''
  const weight = INLINE_TAGS.has(node.tagName) && ['400', '500', '600', '700', 'bold', 'normal'].includes(String(style.fontWeight || '').toLowerCase()) ? String(style.fontWeight).toLowerCase() : ''
  const italic = INLINE_TAGS.has(node.tagName) && ['italic', 'normal'].includes(String(style.fontStyle || '').toLowerCase()) ? String(style.fontStyle).toLowerCase() : ''
  const decoration = INLINE_TAGS.has(node.tagName) ? String(style.textDecoration || style.textDecorationLine || '').toLowerCase() : ''
  const vertical = INLINE_TAGS.has(node.tagName) && ['baseline', 'sub', 'super'].includes(String(style.verticalAlign || '').toLowerCase()) ? String(style.verticalAlign).toLowerCase() : ''
  const align = BLOCK_TAGS.has(node.tagName) && ALIGNMENTS.has(style.textAlign) ? style.textAlign : ''
  const lineHeight = BLOCK_TAGS.has(node.tagName) ? safeLineHeight(style.lineHeight) : ''
  const marginTop = BLOCK_TAGS.has(node.tagName) ? safeLength(style.marginTop, 0, 144, ['pt']) : ''
  const marginBottom = BLOCK_TAGS.has(node.tagName) ? safeLength(style.marginBottom, 0, 144, ['pt']) : ''
  const marginLeft = BLOCK_TAGS.has(node.tagName) ? safeLength(style.marginLeft, -72, 144, ['pt']) : ''
  const marginRight = BLOCK_TAGS.has(node.tagName) ? safeLength(style.marginRight, -72, 144, ['pt']) : ''
  const textIndent = BLOCK_TAGS.has(node.tagName) ? safeLength(style.textIndent, -72, 144, ['pt']) : ''

  if (isShadowDocsFont(family)) rules.push(`font-family:'${escapeHTML(family)}'`)
  if (fontSize) rules.push(`font-size:${fontSize}`)
  if (color) rules.push(`color:${color}`)
  if (background) rules.push(`background-color:${background}`)
  if (weight) rules.push(`font-weight:${weight}`)
  if (italic) rules.push(`font-style:${italic}`)
  if (decoration.includes('underline') || decoration.includes('line-through') || decoration === 'none') {
    const values = []
    if (decoration.includes('underline')) values.push('underline')
    if (decoration.includes('line-through')) values.push('line-through')
    rules.push(`text-decoration:${values.length ? values.join(' ') : 'none'}`)
  }
  if (vertical) rules.push(`vertical-align:${vertical}`)
  if (align) rules.push(`text-align:${align}`)
  if (lineHeight) rules.push(`line-height:${lineHeight}`)
  if (marginTop) rules.push(`margin-top:${marginTop}`)
  if (marginBottom) rules.push(`margin-bottom:${marginBottom}`)
  if (marginLeft) rules.push(`margin-left:${marginLeft}`)
  if (marginRight) rules.push(`margin-right:${marginRight}`)
  if (textIndent) rules.push(`text-indent:${textIndent}`)
  return rules
}

function sanitizeAttributes(node, rules) {
  const attributes = []
  const bookmark = safeToken(node.getAttribute('data-shadow-docs-bookmark'))
  if (bookmark) {
    attributes.push(`id="sd-bookmark-${escapeHTML(bookmark)}"`)
    attributes.push(`data-shadow-docs-bookmark="${escapeHTML(bookmark)}"`)
  }

  if (node.tagName === 'A') {
    const href = safeHref(node.getAttribute('href'))
    const title = brief(node.getAttribute('title'), 160)
    if (href) attributes.push(`href="${escapeHTML(href)}"`)
    if (title) attributes.push(`title="${escapeHTML(title)}"`)
    attributes.push('rel="noopener noreferrer"')
  }

  if (node.tagName === 'TABLE' && node.getAttribute('data-shadow-docs-table') === '1') {
    attributes.push('data-shadow-docs-table="1"')
    rules.push('width:100%', 'border-collapse:collapse')
  }

  if (['TH', 'TD'].includes(node.tagName)) {
    const colSpan = clamp(node.getAttribute('colspan'), 1, 20, 1)
    const rowSpan = clamp(node.getAttribute('rowspan'), 1, 50, 1)
    if (colSpan > 1) attributes.push(`colspan="${colSpan}"`)
    if (rowSpan > 1) attributes.push(`rowspan="${rowSpan}"`)
    rules.push('border:1px solid #b9b4c7', 'padding:6px')
  }

  if (node.tagName === 'DIV' && node.getAttribute('data-shadow-docs-text-box') === '1') {
    attributes.push('data-shadow-docs-text-box="1"')
    rules.push('border:1px solid #b9b4c7', 'padding:8px', 'margin:8px 0')
  }

  if (node.tagName === 'SPAN') {
    const commentId = safeToken(node.getAttribute('data-shadow-docs-comment-id'))
    const equation = node.getAttribute('data-shadow-docs-equation') === '1'
    if (commentId) {
      attributes.push(`data-shadow-docs-comment-id="${escapeHTML(commentId)}"`)
      rules.push('background-color:rgba(255,220,92,.35)')
    }
    if (equation) {
      attributes.push('data-shadow-docs-equation="1"')
      attributes.push('contenteditable="false"')
    }
  }

  if (['INS', 'DEL'].includes(node.tagName)) {
    const changeId = safeToken(node.getAttribute('data-shadow-docs-change-id'))
    const type = node.getAttribute('data-shadow-docs-change-type') === 'delete' ? 'delete' : 'insert'
    const author = brief(node.getAttribute('data-shadow-docs-change-author'), 80)
    const time = clamp(node.getAttribute('data-shadow-docs-change-time'), 0, Number.MAX_SAFE_INTEGER, 0)
    if (changeId) attributes.push(`data-shadow-docs-change-id="${escapeHTML(changeId)}"`)
    attributes.push(`data-shadow-docs-change-type="${type}"`)
    if (author) attributes.push(`data-shadow-docs-change-author="${escapeHTML(author)}"`)
    if (time) attributes.push(`data-shadow-docs-change-time="${time}"`)
  }

  if (rules.length) attributes.push(`style="${rules.join(';')}"`)
  return attributes.length ? ` ${attributes.join(' ')}` : ''
}

export function sanitizeShadowDocsHTML(source) {
  const html = String(source ?? '').slice(0, 500_000)
  if (typeof DOMParser === 'undefined') return `<p>${escapeHTML(html.replace(/<[^>]*>/g, ' '))}</p>`
  const doc = new DOMParser().parseFromString(html, 'text/html')

  function walk(node) {
    if (node.nodeType === 3) return escapeHTML(node.nodeValue)
    if (node.nodeType !== 1) return ''

    if (node.tagName === 'HR') {
      if (node.getAttribute('data-shadow-docs-page-break') === '1') return '<hr data-shadow-docs-page-break="1" contenteditable="false">'
      if (node.getAttribute('data-shadow-docs-rule') === '1') return '<hr data-shadow-docs-rule="1">'
      return ''
    }

    if (node.tagName === 'IMG') {
      const src = node.getAttribute('src') || ''
      if (!isShadowDocsManuscriptImage(src)) return ''
      const width = [50, 75, 100].includes(Number(node.getAttribute('data-shadow-docs-width'))) ? Number(node.getAttribute('data-shadow-docs-width')) : 75
      const align = ['left', 'center', 'right'].includes(node.getAttribute('data-shadow-docs-align')) ? node.getAttribute('data-shadow-docs-align') : 'center'
      const margin = align === 'left' ? '1em auto 1em 0' : align === 'right' ? '1em 0 1em auto' : '1em auto'
      const alt = escapeHTML(String(node.getAttribute('alt') || '').slice(0, 80))
      return `<img src="${src}" alt="${alt}" data-shadow-docs-width="${width}" data-shadow-docs-align="${align}" style="display:block;width:${width}%;max-width:100%;height:auto;margin:${margin};break-inside:avoid">`
    }

    const content = Array.from(node.childNodes, walk).join('')

    if (node.tagName === 'FONT') {
      const face = String(node.getAttribute('face') || '').trim().replace(/^["']|["']$/g, '')
      return isShadowDocsFont(face) ? `<span style="font-family:'${escapeHTML(face)}'">${content}</span>` : content
    }

    if (!ALLOWED.has(node.tagName)) return content
    if (node.tagName === 'BR') return '<br>'

    const rules = sanitizeStyle(node)
    const attributes = sanitizeAttributes(node, rules)
    return `<${node.tagName.toLowerCase()}${attributes}>${content}</${node.tagName.toLowerCase()}>`
  }

  return Array.from(doc.body.childNodes, walk).join('')
}

export function normalizeShadowDocsBook(source, { duplicate = false } = {}) {
  if (!source || typeof source !== 'object' || !Array.isArray(source.chapters) || source.chapters.length > 500) throw new Error('Invalid Shadow Docs project.')
  const requested = BOOK_TEMPLATES.some(template => template.id === source.template) ? source.template : 'classic'
  const layout = getPageLayoutPreset(getBookTemplate(requested).layout)
  const sourceSettings = source.settings || {}
  const chapterIds = new Set()
  const chapters = source.chapters.map((chapter, index) => {
    if (!chapter || typeof chapter !== 'object') throw new Error('Invalid chapter in project.')
    let id = duplicate ? ids() : brief(chapter.id || ids(), 120)
    if (chapterIds.has(id)) id = ids()
    chapterIds.add(id)
    return { id, title: brief(chapter.title || `Chapter ${index + 1}`, 160), html: sanitizeShadowDocsHTML(chapter.html) }
  })
  const now = Date.now()
  return {
    id: duplicate ? ids() : brief(source.id || ids(), 120),
    title: brief(source.title || 'Untitled Book', 160),
    author: brief(source.author, 120),
    description: brief(source.description, 350),
    status: source.status === 'completed' ? 'completed' : 'draft',
    deletedAt: typeof source.deletedAt === 'number' && Number.isFinite(source.deletedAt) && source.deletedAt > 0 ? source.deletedAt : null,
    template: requested,
    image: isShadowDocsImage(source.image) ? source.image : '',
    settings: {
      size: PAGE_SIZES.has(sourceSettings.size) ? sourceSettings.size : layout.size,
      margin: clamp(sourceSettings.margin, 10, 35, layout.margin),
      gutter: clamp(sourceSettings.gutter, 0, 20, 0),
      font: isShadowDocsFont(sourceSettings.font) ? sourceSettings.font : layout.font,
      fontSize: clamp(sourceSettings.fontSize, 10, 24, layout.fontSize),
      lineSpacing: clamp(sourceSettings.lineSpacing, 1.2, 2.2, layout.lineSpacing),
      firstLineIndent: clamp(sourceSettings.firstLineIndent, 0, 15, 0),
      paragraphSpacing: clamp(sourceSettings.paragraphSpacing, 0, 20, 10),
      alignment: ALIGNMENTS.has(sourceSettings.alignment) ? sourceSettings.alignment : layout.alignment,
      numbers: sourceSettings.numbers !== false,
      pageNumbers: sourceSettings.pageNumbers === true,
      printHeader: brief(sourceSettings.printHeader, 80),
      printFooter: brief(sourceSettings.printFooter, 60),
      chapterStyle: CHAPTER_STYLES.has(sourceSettings.chapterStyle) ? sourceSettings.chapterStyle : layout.chapterStyle,
      orientation: sourceSettings.orientation === 'landscape' ? 'landscape' : 'portrait',
      columns: Math.round(clamp(sourceSettings.columns, 1, 4, 1)),
      columnGap: clamp(sourceSettings.columnGap, 4, 30, 10),
      hyphenation: sourceSettings.hyphenation === true,
      lineNumbers: sourceSettings.lineNumbers === true,
      textDirection: sourceSettings.textDirection === 'rtl' ? 'rtl' : 'ltr',
      theme: DESIGN_THEMES.has(sourceSettings.theme) ? sourceSettings.theme : 'classic',
      textColor: safeSettingColor(sourceSettings.textColor, '#242139'),
      accentColor: safeSettingColor(sourceSettings.accentColor, '#6f57a5'),
      pageColor: safeSettingColor(sourceSettings.pageColor, '#ffffff'),
      borderColor: safeSettingColor(sourceSettings.borderColor, '#d5d1df'),
      borderWidth: clamp(sourceSettings.borderWidth, 0, 12, 0),
      borderStyle: BORDER_STYLES.has(sourceSettings.borderStyle) ? sourceSettings.borderStyle : 'solid',
      watermark: brief(sourceSettings.watermark, 80).trim(),
      watermarkOpacity: clamp(sourceSettings.watermarkOpacity, 0.03, 0.4, 0.08),
      documentLanguage: DOCUMENT_LANGUAGES.has(sourceSettings.documentLanguage) ? sourceSettings.documentLanguage : 'km',
    },
    chapters: chapters.length ? chapters : [{ id: ids(), title: 'Chapter 1', html: '' }],
    createdAt: duplicate ? now : Number(source.createdAt) || now,
    updatedAt: duplicate ? now : Number(source.updatedAt) || now,
  }
}

export function createShadowDocsBook(values = {}) {
  const template = getBookTemplate(values.template || 'classic')
  const layout = getPageLayoutPreset(template.layout)
  return normalizeShadowDocsBook({ id: ids(), title: brief(values.title || 'Untitled Book', 160), author: brief(values.author, 120), description: brief(values.description, 350), template: template.id, settings: layout, chapters: [{ id: ids(), title: 'Chapter 1', html: '' }] })
}
