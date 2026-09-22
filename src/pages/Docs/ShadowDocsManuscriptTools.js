function chapterText(html) {
  const source = String(html || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(?:p|div|h[1-6]|li|blockquote)>/gi, '\n')
  if (typeof DOMParser === 'undefined') {
    return source.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  }
  const document = new DOMParser().parseFromString(source, 'text/html')
  return (document.body.textContent || '').replace(/[\t\r ]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim()
}

function countWords(text, locale) {
  if (!text) return 0
  if (typeof Intl.Segmenter === 'function') {
    const words = new Intl.Segmenter(locale, { granularity: 'word' }).segment(text)
    return Array.from(words, segment => segment.isWordLike).filter(Boolean).length
  }
  return (text.match(/[\p{L}\p{N}]+/gu) || []).length
}

export function getManuscriptOverview(book, locale = 'km') {
  const chapters = Array.isArray(book?.chapters) ? book.chapters : []
  const outline = chapters.map((chapter, index) => {
    const text = chapterText(chapter?.html)
    return {
      id: String(chapter?.id || `chapter-${index + 1}`),
      number: index + 1,
      title: String(chapter?.title || `Chapter ${index + 1}`),
      characters: Array.from(text).length,
      words: countWords(text, locale),
      empty: text.length === 0,
    }
  })
  return {
    chapterCount: outline.length,
    characters: outline.reduce((total, chapter) => total + chapter.characters, 0),
    words: outline.reduce((total, chapter) => total + chapter.words, 0),
    outline,
  }
}

export function searchManuscript(book, query, maxResults = 50) {
  const needle = String(query || '').trim().slice(0, 100).toLocaleLowerCase()
  if (!needle) return []
  const chapters = Array.isArray(book?.chapters) ? book.chapters : []
  const limit = Number.isFinite(maxResults) ? Math.max(1, Math.min(100, Math.floor(maxResults))) : 50
  const matches = []
  for (let index = 0; index < chapters.length; index += 1) {
    const chapter = chapters[index]
    const text = chapterText(chapter?.html)
    const searchable = text.toLocaleLowerCase()
    let start = 0
    while (start < searchable.length && matches.length < limit) {
      const position = searchable.indexOf(needle, start)
      if (position < 0) break
      matches.push({
        chapterId: String(chapter?.id || `chapter-${index + 1}`),
        chapterTitle: String(chapter?.title || `Chapter ${index + 1}`),
        chapterNumber: index + 1,
        excerpt: text.slice(Math.max(0, position - 42), Math.min(text.length, position + needle.length + 42)),
      })
      start = position + Math.max(needle.length, 1)
    }
    if (matches.length >= limit) break
  }
  return matches
}

export function moveManuscriptChapter(book, chapterId, direction) {
  if (!book || !Array.isArray(book.chapters) || ![-1, 1].includes(direction)) return book
  const from = book.chapters.findIndex(chapter => chapter?.id === chapterId)
  const to = from + direction
  if (from < 0 || to < 0 || to >= book.chapters.length) return book
  const chapters = [...book.chapters]
  ;[chapters[from], chapters[to]] = [chapters[to], chapters[from]]
  return { ...book, chapters }
}
