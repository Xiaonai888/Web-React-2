import { createShadowDocsId } from './ShadowDocsBookModel'

const clean = (value, max) => String(value ?? '').trim().slice(0, max)

export function createShadowDocsFootnote(text, chapterId = '') {
  return {
    id: createShadowDocsId(),
    chapterId: clean(chapterId, 120),
    text: clean(text, 4000),
    createdAt: Date.now(),
  }
}

export function createShadowDocsCitation({ author = '', title = '', year = '', publisher = '', url = '' } = {}) {
  return {
    id: createShadowDocsId(),
    author: clean(author, 160),
    title: clean(title, 240),
    year: clean(year, 20),
    publisher: clean(publisher, 160),
    url: clean(url, 2048),
  }
}

export function createShadowDocsCaption({ label = 'Figure', number = 1, text = '', objectId = '' } = {}) {
  const safeNumber = Math.max(1, Math.min(99999, Math.round(Number(number) || 1)))
  return {
    id: createShadowDocsId(),
    objectId: clean(objectId, 120),
    label: clean(label, 40) || 'Figure',
    number: safeNumber,
    text: clean(text, 500),
  }
}

export function buildShadowDocsTableOfContents(book) {
  if (!Array.isArray(book?.chapters)) return []
  return book.chapters.map((chapter, index) => ({
    id: chapter.id,
    level: 1,
    title: clean(chapter.title || `Chapter ${index + 1}`, 160),
    chapterIndex: index,
  }))
}

export function formatShadowDocsCitation(citation, style = 'simple') {
  if (!citation) return ''
  const author = clean(citation.author, 160)
  const title = clean(citation.title, 240)
  const year = clean(citation.year, 20)
  if (style === 'author-year') return [author, year && `(${year})`, title].filter(Boolean).join(' ')
  return [author, title, year].filter(Boolean).join('. ')
}

export function renumberShadowDocsCaptions(captions = []) {
  const counters = new Map()
  return captions.map(item => {
    const label = clean(item?.label, 40) || 'Figure'
    const next = (counters.get(label) || 0) + 1
    counters.set(label, next)
    return { ...item, label, number: next }
  })
}
