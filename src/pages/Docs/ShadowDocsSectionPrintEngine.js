import { readShadowDocsSectionBreakMarker } from './ShadowDocsSectionLayoutModel.js'

const SIZES = Object.freeze({ A4: [210, 297], A5: [148, 210], B5: [176, 250] })

function normalizedLayout(settings = {}) {
  const size = Object.prototype.hasOwnProperty.call(SIZES, settings.size) ? settings.size : 'A5'
  const orientation = settings.orientation === 'landscape' ? 'landscape' : 'portrait'
  const marginValue = Number(settings.margin)
  const margin = Number.isFinite(marginValue) ? Math.max(10, Math.min(35, marginValue)) : 18
  const columnsValue = Number(settings.columns)
  const columns = Number.isFinite(columnsValue) ? Math.max(1, Math.min(4, Math.round(columnsValue))) : 1
  return { size, orientation, margin, columns }
}

export function splitShadowDocsChapterIntoPrintSections(source, settings = {}) {
  const layout = normalizedLayout(settings)
  const html = String(source || '').slice(0, 500000)
  const sections = []
  let current = { kind: 'content', orientation: layout.orientation, html: '', startNewPage: false }

  function finishSection() {
    if (current.html.trim()) sections.push({ ...current })
  }

  let cursor = 0
  const markers = /<hr\b[^>]{0,400}\/?>/gi
  for (const match of html.matchAll(markers)) {
    current.html += html.slice(cursor, match.index)
    cursor = match.index + match[0].length
    const type = readShadowDocsSectionBreakMarker(match[0])
    if (!type) {
      current.html += match[0]
    } else if (type.kind === 'page') {
      current.html += '<hr class="sd-page-break">'
    } else if (type.kind === 'column') {
      current.html += '<span class="sd-print-column-break" aria-hidden="true"></span>'
    } else if (type.kind === 'section') {
      finishSection()
      current = { kind: 'content', orientation: type.orientation || current.orientation, html: '', startNewPage: true }
    } else if (type.kind === 'blank') {
      finishSection()
      sections.push({ kind: 'blank', orientation: type.orientation, html: '', startNewPage: true })
      current = { kind: 'content', orientation: current.orientation, html: '', startNewPage: true }
    }
  }
  current.html += html.slice(cursor)
  finishSection()
  return sections.length ? sections : [{ kind: 'content', orientation: layout.orientation, html: '', startNewPage: false }]
}

export function buildShadowDocsSectionPrintHTML(chapterHTML, settings = {}) {
  const sections = splitShadowDocsChapterIntoPrintSections(chapterHTML, settings)
  return sections.map((section, index) => {
    const classes = [
      'sd-print-page-section',
      `sd-print-${section.orientation}`,
      section.startNewPage && index > 0 ? 'sd-print-new-page' : '',
      section.kind === 'blank' ? 'sd-print-blank-page' : '',
    ].filter(Boolean).join(' ')
    return `<section class="${classes}">${section.kind === 'blank' ? '<div aria-hidden="true">&#160;</div>' : section.html}</section>`
  }).join('')
}

export function buildShadowDocsSectionPrintCSS(settings = {}) {
  const { size, margin, columns } = normalizedLayout(settings)
  return `
@page sd-docs-portrait{size:${size} portrait;margin:${margin}mm}
@page sd-docs-landscape{size:${size} landscape;margin:${margin}mm}
.sd-print-page-section.sd-print-portrait{page:sd-docs-portrait}
.sd-print-page-section.sd-print-landscape{page:sd-docs-landscape}
.sd-print-page-section.sd-print-new-page{break-before:page;page-break-before:always}
.sd-print-page-section.sd-print-blank-page{break-before:page;break-after:page;page-break-before:always;page-break-after:always;min-height:1mm}
.sd-print-page-section:not(.sd-print-blank-page){column-count:${columns}}
.sd-print-column-break{display:block;break-before:column;column-break-before:always}
@media screen{
.sd-print-page-section{padding:5px 0}
.sd-print-page-section.sd-print-new-page,.sd-print-page-section.sd-print-blank-page{border-top:2px dashed #8d76be;margin-top:1.5em}
}
`
}
