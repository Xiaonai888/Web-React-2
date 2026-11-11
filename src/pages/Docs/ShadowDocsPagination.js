import { sanitizeShadowDocsHTML } from './ShadowDocsBookModel'
import { shadowDocsFontFamily } from './ShadowDocsFontCatalog'
import { splitShadowDocsChapterIntoPrintSections } from './ShadowDocsSectionPrintEngine'

export const SHADOW_DOCS_PAGE_SIZES = Object.freeze({
  A4: [210, 297],
  A5: [148, 210],
  B5: [176, 250],
})

const MM_TO_PX = 96 / 25.4

function clamp(value, min, max, fallback) {
  const number = Number(value)
  if (!Number.isFinite(number)) return fallback
  return Math.max(min, Math.min(max, number))
}

export function getShadowDocsPageMetrics(settings = {}) {
  const size = SHADOW_DOCS_PAGE_SIZES[settings.size] ? settings.size : 'A5'
  const orientation = settings.orientation === 'landscape' ? 'landscape' : 'portrait'
  const margin = clamp(settings.margin, 10, 35, 18)
  const [portraitWidth, portraitHeight] = SHADOW_DOCS_PAGE_SIZES[size]
  const pageWidthMm = orientation === 'landscape' ? portraitHeight : portraitWidth
  const pageHeightMm = orientation === 'landscape' ? portraitWidth : portraitHeight
  const contentWidthMm = Math.max(40, pageWidthMm - margin * 2)
  const contentHeightMm = Math.max(40, pageHeightMm - margin * 2)

  return {
    size,
    orientation,
    margin,
    pageWidthMm,
    pageHeightMm,
    contentWidthMm,
    contentHeightMm,
    pageWidthPx: pageWidthMm * MM_TO_PX,
    pageHeightPx: pageHeightMm * MM_TO_PX,
    contentWidthPx: contentWidthMm * MM_TO_PX,
    contentHeightPx: contentHeightMm * MM_TO_PX,
  }
}

function safeHTML(value) {
  return sanitizeShadowDocsHTML(String(value || '').slice(0, 500_000))
}

async function waitForImages(root) {
  const images = [...root.querySelectorAll('img')]
  await Promise.all(images.map(image => {
    if (image.complete) return image.decode?.().catch(() => {}) || Promise.resolve()
    return new Promise(resolve => {
      image.onload = resolve
      image.onerror = resolve
    })
  }))
}

async function measureShadowDocsMixedPageCount(book, settings) {
  const fontSize = clamp(settings.fontSize, 10, 24, 13)
  const lineSpacing = clamp(settings.lineSpacing, 1.2, 2.2, 1.65)
  const paragraphSpacing = clamp(settings.paragraphSpacing, 0, 20, 10)
  const firstLineIndent = clamp(settings.firstLineIndent, 0, 15, 0)
  const columns = Math.max(1, Math.min(4, Math.round(Number(settings.columns) || 1)))
  const columnGap = clamp(settings.columnGap, 4, 30, 10)
  const host = document.createElement('div')
  host.setAttribute('aria-hidden', 'true')
  host.style.position = 'fixed'
  host.style.left = '-100000px'
  host.style.top = '0'
  host.style.visibility = 'hidden'
  host.style.pointerEvents = 'none'
  host.style.boxSizing = 'border-box'
  host.style.fontFamily = shadowDocsFontFamily(settings.font)
  host.style.fontSize = `${fontSize}pt`
  host.style.lineHeight = String(lineSpacing)
  host.style.textAlign = ['left', 'center', 'right', 'justify'].includes(settings.alignment) ? settings.alignment : 'left'
  host.style.direction = settings.textDirection === 'rtl' ? 'rtl' : 'ltr'
  host.style.overflowWrap = 'anywhere'
  host.style.color = '#111'
  host.style.background = '#fff'
  document.body.appendChild(host)

  try {
    await Promise.resolve(document.fonts?.ready)
    let pageCount = 0
    let sectionCount = 0
    for (const chapter of book.chapters || []) {
      const sections = splitShadowDocsChapterIntoPrintSections(safeHTML(chapter?.html), settings)
      for (const section of sections) {
        sectionCount += 1
        if (sectionCount > 999) return 999
        if (section.kind === 'blank') {
          pageCount += 1
          continue
        }
        const metrics = getShadowDocsPageMetrics({ ...settings, orientation: section.orientation })
        host.style.width = `${metrics.contentWidthPx}px`
        const body = document.createElement('div')
        body.innerHTML = section.html
        body.style.textIndent = `${firstLineIndent}mm`
        body.style.columnCount = String(columns)
        body.style.columnGap = `${columnGap}mm`
        body.querySelectorAll('p,div').forEach(node => {
          node.style.marginTop = '0'
          node.style.marginBottom = `${paragraphSpacing}pt`
        })
        body.querySelectorAll('h1,h2,h3,li,blockquote').forEach(node => { node.style.textIndent = '0' })
        body.querySelectorAll('img').forEach(node => {
          node.style.maxWidth = '100%'
          node.style.height = 'auto'
          node.style.breakInside = 'avoid'
        })
        body.querySelectorAll('table').forEach(node => {
          node.style.width = '100%'
          node.style.borderCollapse = 'collapse'
          node.style.breakInside = 'avoid'
        })
        body.querySelectorAll('.sd-print-column-break').forEach(node => {
          node.style.display = 'block'
          node.style.breakBefore = 'column'
        })
        host.replaceChildren(body)
        await waitForImages(body)
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
        const pageHeight = metrics.contentHeightPx
        let addedBlank = 0
        const hostTop = body.getBoundingClientRect().top
        const breaks = [...body.querySelectorAll('hr.sd-page-break,hr[data-shadow-docs-page-break="1"]')]
          .map(node => node.getBoundingClientRect().top - hostTop)
          .filter(value => Number.isFinite(value) && value >= 0)
          .sort((a, b) => a - b)
        for (const breakTop of breaks) {
          const effectiveTop = breakTop + addedBlank
          const remainder = effectiveTop % pageHeight
          if (remainder > 1) addedBlank += pageHeight - remainder
        }
        const height = Math.max(body.scrollHeight, body.getBoundingClientRect().height)
        pageCount += Math.max(1, Math.ceil((height + addedBlank) / pageHeight))
        if (pageCount >= 999) return 999
      }
    }
    return Math.max(1, pageCount)
  } finally {
    host.remove()
  }
}

export async function measureShadowDocsPageCount(book, settings = book?.settings || {}) {
  if (typeof document === 'undefined' || !book) return 1
  const hasSections = (book.chapters || []).some(item => /<hr\b[^>]*data-shadow-docs-(?:column-break|section-break|blank-page)/i.test(String(item?.html || '')))
  if (hasSections) return measureShadowDocsMixedPageCount(book, settings)

  const metrics = getShadowDocsPageMetrics(settings)
  const fontSize = clamp(settings.fontSize, 10, 24, 13)
  const lineSpacing = clamp(settings.lineSpacing, 1.2, 2.2, 1.65)
  const paragraphSpacing = clamp(settings.paragraphSpacing, 0, 20, 10)
  const firstLineIndent = clamp(settings.firstLineIndent, 0, 15, 0)
  const columns = Math.max(1, Math.min(4, Math.round(Number(settings.columns) || 1)))
  const columnGap = clamp(settings.columnGap, 4, 30, 10)

  const host = document.createElement('div')
  host.setAttribute('aria-hidden', 'true')
  host.style.position = 'fixed'
  host.style.left = '-100000px'
  host.style.top = '0'
  host.style.visibility = 'hidden'
  host.style.pointerEvents = 'none'
  host.style.width = `${metrics.contentWidthPx}px`
  host.style.boxSizing = 'border-box'
  host.style.fontFamily = shadowDocsFontFamily(settings.font)
  host.style.fontSize = `${fontSize}pt`
  host.style.lineHeight = String(lineSpacing)
  host.style.textAlign = ['left', 'center', 'right', 'justify'].includes(settings.alignment) ? settings.alignment : 'left'
  host.style.direction = settings.textDirection === 'rtl' ? 'rtl' : 'ltr'
  host.style.overflowWrap = 'anywhere'
  host.style.color = '#111'
  host.style.background = '#fff'

  for (const chapter of book.chapters || []) {
    const section = document.createElement('section')
    section.className = 'sd-page-measure-chapter'

    const body = document.createElement('div')
    body.className = 'sd-page-measure-body'
    body.innerHTML = safeHTML(chapter?.html)

    body.style.textIndent = `${firstLineIndent}mm`
    body.style.columnCount = String(columns)
    body.style.columnGap = `${columnGap}mm`

    body.querySelectorAll('p,div').forEach(node => {
      node.style.marginTop = '0'
      node.style.marginBottom = `${paragraphSpacing}pt`
    })

    body.querySelectorAll('h1,h2,h3,li,blockquote').forEach(node => {
      node.style.textIndent = '0'
    })

    body.querySelectorAll('img').forEach(node => {
      node.style.maxWidth = '100%'
      node.style.height = 'auto'
      node.style.breakInside = 'avoid'
    })

    body.querySelectorAll('table').forEach(node => {
      node.style.width = '100%'
      node.style.borderCollapse = 'collapse'
      node.style.breakInside = 'avoid'
    })

    section.appendChild(body)
    host.appendChild(section)
  }

  document.body.appendChild(host)

  try {
    await Promise.resolve(document.fonts?.ready)
    await waitForImages(host)
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

    const pageHeight = metrics.contentHeightPx
    const totalHeight = Math.max(host.scrollHeight, host.getBoundingClientRect().height)
    let addedBlank = 0

    const hostTop = host.getBoundingClientRect().top
    const breaks = [...host.querySelectorAll('hr[data-shadow-docs-page-break="1"],hr.sd-page-break')]
      .map(node => node.getBoundingClientRect().top - hostTop)
      .filter(value => Number.isFinite(value) && value >= 0)
      .sort((a, b) => a - b)

    for (const breakTop of breaks) {
      const effectiveTop = breakTop + addedBlank
      const remainder = effectiveTop % pageHeight
      if (remainder > 1) addedBlank += pageHeight - remainder
    }

    const pages = Math.ceil((totalHeight + addedBlank) / pageHeight)
    return Math.max(1, Math.min(999, pages))
  } finally {
    host.remove()
  }
}
