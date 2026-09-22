import { BOOK_TEMPLATES } from './ShadowDocsTemplateCatalog'

const plainText = html => String(html || '')
  .replace(/<br\s*\/?>/gi, ' ')
  .replace(/<[^>]*>/g, ' ')
  .replace(/&(?:nbsp|#160);/gi, ' ')
  .trim()

export function inspectShadowDocsProject(book) {
  const issues = []
  if (!book || typeof book !== 'object') return { canExport: false, issues: [{ code: 'no-book', message: 'Select a book first.', severity: 'error' }], chapterCount: 0, emptyChapters: 0 }
  const chapters = Array.isArray(book.chapters) ? book.chapters : []
  if (!String(book.title || '').trim()) issues.push({ code: 'title', message: 'Add a book title.', severity: 'warning' })
  if (!String(book.author || '').trim()) issues.push({ code: 'author', message: 'Add an author name before publishing.', severity: 'warning' })
  if (!chapters.length) issues.push({ code: 'chapters', message: 'Add at least one chapter.', severity: 'error' })
  if (chapters.length > 500) issues.push({ code: 'chapter-limit', message: 'Reduce the book to 500 chapters or fewer.', severity: 'error' })
  const emptyChapters = chapters.filter(chapter => !plainText(chapter?.html)).length
  if (chapters.length && emptyChapters === chapters.length) issues.push({ code: 'empty-book', message: 'All chapters are empty.', severity: 'warning' })
  else if (emptyChapters) issues.push({ code: 'empty-chapters', message: `${emptyChapters} chapter${emptyChapters === 1 ? '' : 's'} are empty.`, severity: 'warning' })
  if (!BOOK_TEMPLATES.some(template => template.id === book.template)) issues.push({ code: 'template', message: 'The chosen cover template is unavailable; the Classic template will be used.', severity: 'warning' })
  const size = book.settings?.size
  if (size && !['A5', 'A4', 'B5'].includes(size)) issues.push({ code: 'page-size', message: 'Unsupported page size; A5 will be used.', severity: 'warning' })
  return { canExport: !issues.some(issue => issue.severity === 'error'), issues, chapterCount: chapters.length, emptyChapters }
}
