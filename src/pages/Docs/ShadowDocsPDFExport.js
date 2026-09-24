import { inspectShadowDocsProject } from './ShadowDocsQualityReport'

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
    if (node.tagName === 'HR' && node.getAttribute('data-shadow-docs-page-break') === '1') return '<hr class="sd-page-break">'
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
    gutter: number(settings.gutter, 0, 20, 0),
    fontSize: number(settings.fontSize, 10, 24, 13),
    lineSpacing: number(settings.lineSpacing, 1.2, 2.2, 1.65),
    alignment: ['left', 'center', 'right', 'justify'].includes(settings.alignment) ? settings.alignment : 'left',
    pageNumbers: settings.pageNumbers === true,
    printHeader: String(settings.printHeader || '').slice(0, 80).trim(),
    printFooter: String(settings.printFooter || '').slice(0, 60).trim(),
  }
}

function cssString(value) {
  return JSON.stringify(String(value || '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/</g, '\\3c ').replace(/>/g, '\\3e '))
}

export function inspectShadowDocsForPDF(book) {
  return inspectShadowDocsProject(book).issues.map(issue => issue.message)
}

export function buildShadowDocsPrintHTML(book) {
  const report = inspectShadowDocsProject(book)
  if (!report.canExport) throw new Error(report.issues.find(issue => issue.severity === 'error')?.message || 'Choose a valid book to export.')
  const settings = normalizedSettings(book.settings)
  const [width] = PAGE_SIZES[settings.size]
  const chapters = book.chapters.slice(0, 500).map(chapter => `<section class="chapter"><div class="chapter-body">${safeChapterHTML(chapter?.html)}</div></section>`).join('\n')
  const pageFurnitureCss = [
    settings.printHeader ? `@top-center{content:${cssString(settings.printHeader)};font:9pt "Noto Sans Khmer","Khmer OS",sans-serif;color:#555}` : '',
    settings.printFooter ? `@bottom-left{content:${cssString(settings.printFooter)};font:9pt "Noto Sans Khmer","Khmer OS",sans-serif;color:#555}` : '',
    settings.pageNumbers ? '@bottom-center{content:counter(page);font:9pt Georgia,serif;color:#555}' : '',
  ].filter(Boolean).join('\n')
  return `<!doctype html>
<html lang="km"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeText(book.title || 'Untitled Book')}</title>
<style>
@page{size:${settings.size};margin:${settings.margin}mm;${pageFurnitureCss}}
@page :left{margin-left:${settings.margin}mm;margin-right:${settings.margin + settings.gutter}mm}
@page :right{margin-left:${settings.margin + settings.gutter}mm;margin-right:${settings.margin}mm}
*{box-sizing:border-box}html{background:#eee}body{max-width:${width}mm;margin:18px auto;background:#fff;color:#242139;font-family:${settings.font};font-size:${settings.fontSize}pt;line-height:${settings.lineSpacing};text-align:${settings.alignment};overflow-wrap:anywhere}
.chapter{padding:0}.chapter-body p{margin:0 0 .8em}.chapter-body blockquote{margin:1em 0;padding-left:1em;border-left:2px solid #aaa}.chapter-body img{max-width:100%}
@media screen{body{padding:${settings.margin}mm;box-shadow:0 10px 28px #0002}.chapter-body hr.sd-page-break{margin:1.5em 0;border:0;border-top:2px dashed #8d76be}}
@media print{html,body{background:#fff;margin:0;max-width:none;padding:0;box-shadow:none;-webkit-print-color-adjust:exact;print-color-adjust:exact}.chapter-body p,.chapter-body li{orphans:2;widows:2}.chapter-body hr.sd-page-break{display:block;break-after:page;page-break-after:always;height:0;margin:0;border:0}}
</style></head><body>${chapters}</body></html>`
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
