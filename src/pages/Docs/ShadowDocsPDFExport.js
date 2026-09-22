import { getShadowDocsPrintCoverStyle } from './ShadowDocsPrintTheme'
import { inspectShadowDocsProject } from './ShadowDocsQualityReport'
import { buildShadowDocsPrintContents, SHADOW_DOCS_PRINT_CONTENTS_CSS } from './ShadowDocsContents'

const PAGE_SIZES = Object.freeze({ A5: [148, 210], A4: [210, 297], B5: [176, 250] })
const FONT_FAMILIES = Object.freeze({
  'Noto Serif Khmer': '"Noto Serif Khmer", "Khmer OS", serif',
  'Noto Sans Khmer': '"Noto Sans Khmer", "Khmer OS", sans-serif',
  Battambang: '"Battambang", "Khmer OS", serif',
  Georgia: 'Georgia, "Noto Serif Khmer", serif',
  Arial: 'Arial, "Noto Sans Khmer", sans-serif',
})

function escapeText(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
}

function safeChapterHTML(source) {
  const html = String(source || '').slice(0, 2_000_000)
  if (typeof DOMParser === 'undefined') return `<p>${escapeText(html.replace(/<[^>]*>/g, ' '))}</p>`
  const document = new DOMParser().parseFromString(html, 'text/html')
  const allowed = new Set(['P', 'DIV', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'S', 'H1', 'H2', 'H3', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'SPAN'])
  function render(node) {
    if (node.nodeType === 3) return escapeText(node.nodeValue)
    if (node.nodeType !== 1) return ''
    const content = Array.from(node.childNodes, render).join('')
    if (!allowed.has(node.tagName)) return content
    if (node.tagName === 'BR') return '<br>'
    const align = node.style?.textAlign
    const style = ['left', 'center', 'right', 'justify'].includes(align) ? ` style="text-align:${align}"` : ''
    const tag = node.tagName.toLowerCase()
    return `<${tag}${style}>${content}</${tag}>`
  }
  return Array.from(document.body.childNodes, render).join('')
}

function normalizedSettings(settings = {}) {
  const size = PAGE_SIZES[settings.size] ? settings.size : 'A5'
  const font = FONT_FAMILIES[settings.font] || FONT_FAMILIES['Noto Serif Khmer']
  const number = (value, min, max, fallback) => Number.isFinite(Number(value)) ? Math.max(min, Math.min(max, Number(value))) : fallback
  return {
    size,
    font,
    margin: number(settings.margin, 10, 35, 18),
    fontSize: number(settings.fontSize, 10, 24, 13),
    lineSpacing: number(settings.lineSpacing, 1.2, 2.2, 1.65),
    alignment: ['left', 'center', 'right', 'justify'].includes(settings.alignment) ? settings.alignment : 'left',
  }
}

export function inspectShadowDocsForPDF(book) {
  return inspectShadowDocsProject(book).issues.map(issue => issue.message)
}

export function buildShadowDocsPrintHTML(book) {
  const report = inspectShadowDocsProject(book)
  if (!report.canExport) throw new Error(report.issues.find(issue => issue.severity === 'error')?.message || 'Choose a valid book to export.')
  const settings = normalizedSettings(book.settings)
  const [width, height] = PAGE_SIZES[settings.size]
  const coverStyle = getShadowDocsPrintCoverStyle(book)
  const contents = buildShadowDocsPrintContents(book)
  const chapters = book.chapters.slice(0, 500).map((chapter, index) => `<section id="sd-chapter-${index + 1}" class="chapter"><h2>${escapeText(chapter?.title || `Chapter ${index + 1}`)}</h2><div class="chapter-body">${safeChapterHTML(chapter?.html)}</div></section>`).join('\n')
  return `<!doctype html>
<html lang="km"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeText(book.title || 'Untitled Book')}</title>
<style>
@page{size:${settings.size};margin:${settings.margin}mm}
*{box-sizing:border-box}html{background:#eee}body{max-width:${width}mm;margin:18px auto;background:#fff;color:#242139;font-family:${settings.font};font-size:${settings.fontSize}pt;line-height:${settings.lineSpacing};text-align:${settings.alignment};overflow-wrap:anywhere}
.cover{min-height:${Math.max(75, height - 2 * settings.margin)}mm;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;text-align:center;padding:12mm;${coverStyle}}
.cover h1{font-size:2.15em;line-height:1.45;overflow-wrap:anywhere}.cover p{font-size:1em}.chapter{break-before:page;page-break-before:always;padding:0}.chapter h2{text-align:center;font-size:1.4em;margin:0 0 1.5em;break-after:avoid;page-break-after:avoid}.chapter-body p{margin:0 0 .8em}.chapter-body blockquote{margin:1em 0;padding-left:1em;border-left:2px solid #aaa}.chapter-body img{max-width:100%}
${SHADOW_DOCS_PRINT_CONTENTS_CSS}
@media screen{body{padding:${settings.margin}mm;box-shadow:0 10px 28px #0002}.chapter{margin-top:1.5em;border-top:1px solid #e3e0e9;padding-top:2em}}
@media print{html,body{background:#fff;margin:0;max-width:none;padding:0;box-shadow:none;-webkit-print-color-adjust:exact;print-color-adjust:exact}.cover{-webkit-print-color-adjust:exact;print-color-adjust:exact}.chapter-body p,.chapter-body li{orphans:2;widows:2}}
</style></head><body><section class="cover"><h1>${escapeText(book.title || 'Untitled Book')}</h1><p>${escapeText(book.author || '')}</p></section>${contents}${chapters}</body></html>`
}

export function downloadShadowDocsPrintHTML(book) {
  if (typeof document === 'undefined') throw new Error('HTML export requires a browser.')
  const html = buildShadowDocsPrintHTML(book)
  const name = String(book.title || 'Shadow Docs').replace(/[\\/:*?"<>|\u0000-\u001f]/g, '-').slice(0, 80)
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${name}.html`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1500)
}
