import { BOOK_TEMPLATES, getBookTemplate, getPageLayoutPreset } from './ShadowDocsTemplateCatalog'

const ids = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
const PAGE_SIZES = new Set(['A5', 'A4', 'B5'])
const FONTS = new Set(['Noto Serif Khmer', 'Noto Sans Khmer', 'Battambang', 'Georgia', 'Arial'])
const ALIGNMENTS = new Set(['left', 'center', 'right', 'justify'])
const CHAPTER_STYLES = new Set(['classic', 'modern', 'minimal'])
const ALLOWED = new Set(['P', 'DIV', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'S', 'H1', 'H2', 'H3', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'SPAN'])
const clamp = (value, low, high, fallback) => value === '' || value == null || !Number.isFinite(Number(value)) ? fallback : Math.max(low, Math.min(high, Number(value)))
const brief = (value, max) => String(value ?? '').slice(0, max)
const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
export const createShadowDocsId = ids
export const isShadowDocsImage = value => typeof value === 'string' && /^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(value) && value.length < 2_500_000
export const isShadowDocsManuscriptImage = value => isShadowDocsImage(value) && value.length <= 300_000

export function sanitizeShadowDocsHTML(source) {
  const html = String(source ?? '').slice(0, 500_000)
  if (typeof DOMParser === 'undefined') return `<p>${escapeHTML(html.replace(/<[^>]*>/g, ' '))}</p>`
  const doc = new DOMParser().parseFromString(html, 'text/html')
  function walk(node) {
    if (node.nodeType === 3) return escapeHTML(node.nodeValue)
    if (node.nodeType !== 1) return ''
    if (node.tagName === 'HR' && node.getAttribute('data-shadow-docs-page-break') === '1') return '<hr data-shadow-docs-page-break="1" contenteditable="false">'
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
    if (!ALLOWED.has(node.tagName)) return content
    if (node.tagName === 'BR') return '<br>'
    const align = node.style?.textAlign
    const style = ALIGNMENTS.has(align) ? ` style="text-align:${align}"` : ''
    return `<${node.tagName.toLowerCase()}${style}>${content}</${node.tagName.toLowerCase()}>`
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
    template: requested,
    image: isShadowDocsImage(source.image) ? source.image : '',
    settings: {
      size: PAGE_SIZES.has(sourceSettings.size) ? sourceSettings.size : layout.size,
      margin: clamp(sourceSettings.margin, 10, 35, layout.margin),
      gutter: clamp(sourceSettings.gutter, 0, 20, 0),
      font: FONTS.has(sourceSettings.font) ? sourceSettings.font : layout.font,
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
