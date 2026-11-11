export const SHADOW_DOCS_SECTION_BREAK_CHOICES = Object.freeze([
  { id: 'page', title: 'Page Break', description: 'Continue on a new page.', kind: 'page', orientation: null },
  { id: 'column', title: 'Column Break', description: 'Continue in the next column when columns are enabled.', kind: 'column', orientation: null },
  { id: 'section', title: 'Next Section', description: 'Start a new section with the current page orientation.', kind: 'section', orientation: null },
  { id: 'section-portrait', title: 'Portrait Section', description: 'Start a new portrait section.', kind: 'section', orientation: 'portrait' },
  { id: 'section-landscape', title: 'Landscape Section', description: 'Start a new landscape section.', kind: 'section', orientation: 'landscape' },
  { id: 'blank-portrait', title: 'Portrait Blank Page', description: 'Insert a portrait blank page and resume the previous layout.', kind: 'blank', orientation: 'portrait' },
  { id: 'blank-landscape', title: 'Landscape Blank Page', description: 'Insert a landscape blank page and resume the previous layout.', kind: 'blank', orientation: 'landscape' },
])

const BREAK_KINDS = new Set(['page', 'column', 'section', 'blank'])
const ORIENTATIONS = new Set(['portrait', 'landscape'])

export function normalizeShadowDocsSectionBreak(value) {
  const source = typeof value === 'string'
    ? SHADOW_DOCS_SECTION_BREAK_CHOICES.find(item => item.id === value)
    : value
  if (!source || typeof source !== 'object' || !BREAK_KINDS.has(source.kind)) return null
  const orientation = ORIENTATIONS.has(source.orientation) ? source.orientation : null
  if (source.kind === 'blank' && !orientation) return null
  return { kind: source.kind, orientation: ['section', 'blank'].includes(source.kind) ? orientation : null }
}

export function renderShadowDocsSectionBreakMarker(value) {
  const breakType = normalizeShadowDocsSectionBreak(value)
  if (!breakType) return ''
  if (breakType.kind === 'page') return '<hr data-shadow-docs-page-break="1" contenteditable="false">'
  if (breakType.kind === 'column') return '<hr data-shadow-docs-column-break="1" contenteditable="false">'
  const attribute = breakType.kind === 'blank' ? 'data-shadow-docs-blank-page="1"' : 'data-shadow-docs-section-break="next"'
  const orientation = breakType.orientation ? ` data-shadow-docs-orientation="${breakType.orientation}"` : ''
  return `<hr ${attribute}${orientation} contenteditable="false">`
}

function readAttribute(markup, name) {
  const match = String(markup).match(new RegExp(`(?:\\s|^)${name}\\s*=\\s*["']([^"']{1,80})["']`, 'i'))
  return match?.[1] || ''
}

export function readShadowDocsSectionBreakMarker(markup) {
  const html = String(markup || '').trim()
  if (!/^<hr\b[^>]{0,400}\/?>$/i.test(html)) return null
  const orientation = readAttribute(html, 'data-shadow-docs-orientation')
  if (readAttribute(html, 'data-shadow-docs-page-break') === '1') return { kind: 'page', orientation: null }
  if (readAttribute(html, 'data-shadow-docs-column-break') === '1') return { kind: 'column', orientation: null }
  if (readAttribute(html, 'data-shadow-docs-blank-page') === '1') return normalizeShadowDocsSectionBreak({ kind: 'blank', orientation })
  if (readAttribute(html, 'data-shadow-docs-section-break') === 'next') {
    return normalizeShadowDocsSectionBreak({ kind: 'section', orientation })
  }
  return null
}
