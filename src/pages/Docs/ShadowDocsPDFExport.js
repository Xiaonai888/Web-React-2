import { inspectShadowDocsProject } from './ShadowDocsQualityReport'
import { sanitizeShadowDocsHTML } from './ShadowDocsBookModel'
import { isShadowDocsFont, shadowDocsFontCSS, shadowDocsFontFamily } from './ShadowDocsFontCatalog'

const PAGE_SIZES = Object.freeze({ A5: [148, 210], A4: [210, 297], B5: [176, 250] })
function escapeText(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
}

function safeChapterHTML(source) {
  return sanitizeShadowDocsHTML(String(source || '').slice(0, 500_000))
    .replaceAll('<hr data-shadow-docs-page-break="1" contenteditable="false">', '<hr class="sd-page-break">')
}

function selectedFontCSS(chapterHTML, defaultFont) {
  const fonts = new Set(['Noto Serif Khmer'])
  if (isShadowDocsFont(defaultFont)) fonts.add(defaultFont)
  chapterHTML.forEach(html => {
    for (const match of html.matchAll(/font-family:\s*'([^']+)'/gi)) {
      if (isShadowDocsFont(match[1])) fonts.add(match[1])
    }
  })
  const rules = [...fonts].map(shadowDocsFontCSS).filter(Boolean)
  return [...rules.filter(rule => rule.startsWith('@import')), ...rules.filter(rule => !rule.startsWith('@import'))].join('\n')
}

function normalizedSettings(settings = {}) {
  const size = PAGE_SIZES[settings.size] ? settings.size : 'A5'
  const font = shadowDocsFontFamily(settings.font)
  const number = (value, min, max, fallback) => Number.isFinite(Number(value)) ? Math.max(min, Math.min(max, Number(value))) : fallback
  return {
    size,
    font,
    margin: number(settings.margin, 10, 35, 18),
    gutter: number(settings.gutter, 0, 20, 0),
    fontSize: number(settings.fontSize, 10, 24, 13),
    lineSpacing: number(settings.lineSpacing, 1.2, 2.2, 1.65),
    firstLineIndent: number(settings.firstLineIndent, 0, 15, 0),
    paragraphSpacing: number(settings.paragraphSpacing, 0, 20, 10),
    alignment: ['left', 'center', 'right', 'justify'].includes(settings.alignment) ? settings.alignment : 'left',
    pageNumbers: settings.pageNumbers === true,
    printHeader: String(settings.printHeader || '').slice(0, 80).trim(),
    printFooter: String(settings.printFooter || '').slice(0, 60).trim(),
    orientation: settings.orientation === 'landscape' ? 'landscape' : 'portrait',
    columns: Math.max(1, Math.min(4, Math.round(Number(settings.columns) || 1))),
    columnGap: number(settings.columnGap, 4, 30, 10),
    hyphenation: settings.hyphenation === true,
    textDirection: settings.textDirection === 'rtl' ? 'rtl' : 'ltr',
    textColor: /^#[0-9a-f]{6}$/i.test(String(settings.textColor || '')) ? settings.textColor : '#242139',
    pageColor: /^#[0-9a-f]{6}$/i.test(String(settings.pageColor || '')) ? settings.pageColor : '#ffffff',
    borderColor: /^#[0-9a-f]{6}$/i.test(String(settings.borderColor || '')) ? settings.borderColor : '#d5d1df',
    borderWidth: number(settings.borderWidth, 0, 12, 0),
    borderStyle: ['solid', 'double', 'dashed', 'dotted'].includes(settings.borderStyle) ? settings.borderStyle : 'solid',
    watermark: String(settings.watermark || '').slice(0, 80).trim(),
    watermarkOpacity: number(settings.watermarkOpacity, 0.03, 0.4, 0.08),
    documentLanguage: ['km', 'en', 'zh', 'ko', 'ja'].includes(settings.documentLanguage) ? settings.documentLanguage : 'km',
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
  const [portraitWidth, portraitHeight] = PAGE_SIZES[settings.size]
  const width = settings.orientation === 'landscape' ? portraitHeight : portraitWidth
  const chapterHTML = book.chapters.slice(0, 500).map(chapter => safeChapterHTML(chapter?.html))
  const chapters = chapterHTML.map(html => `<section class="chapter"><div class="chapter-body">${html}</div></section>`).join('\n')
  const fontCSS = selectedFontCSS(chapterHTML, book.settings?.font)
  const pageFurnitureCss = [
    settings.printHeader ? `@top-center{content:${cssString(settings.printHeader)};font:9pt "Noto Sans Khmer","Khmer OS",sans-serif;color:#555}` : '',
    settings.printFooter ? `@bottom-left{content:${cssString(settings.printFooter)};font:9pt "Noto Sans Khmer","Khmer OS",sans-serif;color:#555}` : '',
    settings.pageNumbers ? '@bottom-center{content:counter(page);font:9pt Georgia,serif;color:#555}' : '',
  ].filter(Boolean).join('\n')
  return `<!doctype html>
<html lang="${settings.documentLanguage}" dir="${settings.textDirection}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeText(book.title || 'Untitled Book')}</title>
<style>
${fontCSS}
@page{size:${settings.size} ${settings.orientation};margin:${settings.margin}mm;${pageFurnitureCss}}
@page :left{margin-left:${settings.margin}mm;margin-right:${settings.margin + settings.gutter}mm}
@page :right{margin-left:${settings.margin + settings.gutter}mm;margin-right:${settings.margin}mm}
*{box-sizing:border-box}html{background:#eee}body{position:relative;max-width:${width}mm;margin:18px auto;background:${settings.pageColor};color:${settings.textColor};font-family:${settings.font};font-size:${settings.fontSize}pt;line-height:${settings.lineSpacing};text-align:${settings.alignment};direction:${settings.textDirection};overflow-wrap:anywhere;border:${settings.borderWidth}px ${settings.borderStyle} ${settings.borderColor}}
.chapter{position:relative;padding:0}.chapter-body{text-indent:${settings.firstLineIndent}mm;column-count:${settings.columns};column-gap:${settings.columnGap}mm;hyphens:${settings.hyphenation ? 'auto' : 'manual'}}.chapter-body p,.chapter-body div{margin:0 0 ${settings.paragraphSpacing}pt}.chapter-body h1,.chapter-body h2,.chapter-body h3,.chapter-body li,.chapter-body blockquote{text-indent:0}.chapter-body blockquote{margin:1em 0;padding-left:1em;border-left:2px solid #aaa}.chapter-body img{max-width:100%;height:auto;break-inside:avoid;page-break-inside:avoid}.chapter-body table{width:100%;border-collapse:collapse;break-inside:avoid}.chapter-body td,.chapter-body th{border:1px solid #b9b4c7;padding:6px}.chapter-body ins{text-decoration:underline;text-decoration-color:#2d8a5b}.chapter-body del{text-decoration:line-through;color:#9f3d49}${settings.watermark ? `.chapter::before{content:${cssString(settings.watermark)};position:fixed;inset:40% 8% auto;z-index:0;text-align:center;font-size:42pt;font-weight:700;opacity:${settings.watermarkOpacity};transform:rotate(-35deg);pointer-events:none}` : ''}
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
