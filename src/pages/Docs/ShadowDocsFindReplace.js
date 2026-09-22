import { sanitizeShadowDocsHTML } from './ShadowDocsBookModel'

const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const makePattern = (query, matchCase) => {
  const term = String(query || '').trim().slice(0, 100)
  if (!term) throw new Error('Enter the text to find.')
  return new RegExp(escapeRegex(term), matchCase ? 'g' : 'gi')
}

function parseChapter(chapter) {
  if (typeof DOMParser === 'undefined') throw new Error('Find and replace requires a browser.')
  return new DOMParser().parseFromString(sanitizeShadowDocsHTML(chapter?.html), 'text/html')
}

export function inspectShadowDocsFind(book, query, matchCase = false) {
  if (!String(query || '').trim()) return []
  const pattern = makePattern(query, matchCase)
  return (Array.isArray(book?.chapters) ? book.chapters : []).map((chapter, index) => {
    const document = parseChapter(chapter)
    const count = Array.from((document.body.textContent || '').matchAll(pattern)).length
    return { id: chapter.id, title: chapter.title || `Chapter ${index + 1}`, count }
  }).filter(result => result.count > 0)
}

export function replaceShadowDocsText(book, query, replacement, { matchCase = false, chapterId = '' } = {}) {
  if (!Array.isArray(book?.chapters)) throw new Error('Choose a book first.')
  const pattern = makePattern(query, matchCase)
  const substitute = String(replacement ?? '').slice(0, 200)
  let replacements = 0
  let affectedChapters = 0
  const chapters = book.chapters.map(chapter => {
    if (chapterId && chapter.id !== chapterId) return chapter
    const document = parseChapter(chapter)
    const walker = document.createTreeWalker(document.body, 4)
    let node = walker.nextNode()
    let changed = false
    while (node) {
      const original = node.nodeValue || ''
      const updated = original.replace(pattern, () => {
        replacements += 1
        if (replacements > 10_000) throw new Error('Too many matches. Replace fewer chapters at a time.')
        changed = true
        return substitute
      })
      if (updated !== original) node.nodeValue = updated
      node = walker.nextNode()
    }
    if (!changed) return chapter
    const html = sanitizeShadowDocsHTML(document.body.innerHTML)
    if (html.length > 500_000) throw new Error('The result is too large for a chapter. Shorten the replacement.')
    affectedChapters += 1
    return { ...chapter, html }
  })
  return { chapters, replacements, affectedChapters }
}
