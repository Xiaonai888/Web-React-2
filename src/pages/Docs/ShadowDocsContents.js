const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])

export function getShadowDocsContents(book) {
  const chapters = Array.isArray(book?.chapters) ? book.chapters : []
  return chapters.map((chapter, index) => ({
    id: String(chapter?.id || `chapter-${index + 1}`),
    number: index + 1,
    title: String(chapter?.title || `Chapter ${index + 1}`).slice(0, 160),
    anchor: `sd-chapter-${index + 1}`,
  }))
}

export function buildShadowDocsPrintContents(book) {
  const chapters = getShadowDocsContents(book)
  if (!chapters.length) return ''
  const entries = chapters.map(chapter => `<li><a href="#${chapter.anchor}"><span>${chapter.number}.</span> ${escapeHTML(chapter.title)}</a></li>`).join('')
  return `<nav class="sd-print-contents" aria-label="Table of contents"><h2>Contents</h2><ol>${entries}</ol></nav>`
}

export const SHADOW_DOCS_PRINT_CONTENTS_CSS = '.sd-print-contents{break-before:page;page-break-before:always}.sd-print-contents h2{text-align:center;margin:0 0 2em}.sd-print-contents ol{list-style:none;padding:0;margin:0}.sd-print-contents li{margin:0 0 .8em;break-inside:avoid}.sd-print-contents a{color:inherit;text-decoration:none}.sd-print-contents span{display:inline-block;min-width:2.5em}'
