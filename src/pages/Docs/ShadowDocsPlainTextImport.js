import { createShadowDocsId } from './ShadowDocsBookModel'

const MAX_FILE_SIZE = 2_000_000
const MAX_CHAPTERS = 500
const MAX_CHAPTER_HTML = 500_000
const heading = /^(?:#{1,3}\s*)?(?:(?:chapter|episode|part)\s+[0-9០-៩IVXLCDM]+|ភាគទី\s*[0-9០-៩]+|ជំពូកទី?\s*[0-9០-៩]+)(?:\s*[:.\-—]\s*.*)?$/iu
const escapeHTML = value => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])

function asHTML(text) {
  return text.trim().split(/\n\s*\n/).map(paragraph => `<p>${escapeHTML(paragraph.trim()).replace(/\n/g, '<br>')}</p>`).join('')
}

export function parseShadowDocsPlainText(text, fileName = 'Imported manuscript', splitHeadings = true) {
  if (typeof text !== 'string' || !text.trim()) throw new Error('The text file is empty.')
  const source = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').replace(/\0/g, '')
  const fallback = String(fileName).replace(/\.txt$/i, '').slice(0, 160) || 'Imported manuscript'
  const sections = []
  let current = { title: fallback, lines: [] }
  for (const line of source.split('\n')) {
    if (splitHeadings && heading.test(line.trim())) {
      if (current.lines.some(item => item.trim())) sections.push(current)
      current = { title: line.trim().replace(/^#{1,3}\s*/, '').slice(0, 160), lines: [] }
    } else current.lines.push(line)
  }
  if (current.lines.some(item => item.trim()) || !sections.length) sections.push(current)
  if (sections.length > MAX_CHAPTERS) throw new Error(`The file contains more than ${MAX_CHAPTERS} chapters. Split it into smaller files.`)
  const chapters = sections.map((section, index) => {
    const html = asHTML(section.lines.join('\n'))
    if (html.length > MAX_CHAPTER_HTML) throw new Error(`Chapter ${index + 1} exceeds the maximum length. Split the text into smaller chapters.`)
    return { id: createShadowDocsId(), title: section.title || `Chapter ${index + 1}`, html }
  })
  if (!chapters.some(chapter => chapter.html.replace(/<[^>]*>/g, '').trim())) throw new Error('The text file has no readable content.')
  return { chapters, chapterCount: chapters.length }
}

export async function readShadowDocsPlainText(file, splitHeadings = true) {
  if (!file || !/\.txt$/i.test(file.name) || file.size > MAX_FILE_SIZE || file.size === 0) throw new Error('Choose a nonempty .txt file smaller than 2 MB.')
  const text = await file.text()
  return parseShadowDocsPlainText(text, file.name, splitHeadings)
}
