import { sanitizeShadowDocsHTML } from './ShadowDocsBookModel'

const safeName = value => String(value || 'Shadow Docs').replace(/[\\/:*?"<>|\u0000-\u001f]/g, '-').slice(0, 80)

function textFromHTML(html) {
  const clean = sanitizeShadowDocsHTML(html)
  if (typeof DOMParser === 'undefined') return clean.replace(/<[^>]*>/g, ' ').trim()
  const document = new DOMParser().parseFromString(clean, 'text/html')
  document.body.querySelectorAll('br').forEach(node => node.replaceWith('\n'))
  document.body.querySelectorAll('p,div,h1,h2,h3,li,blockquote').forEach(node => node.append('\n\n'))
  return (document.body.textContent || '').replace(/\n[ \t]+/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
}

export function downloadShadowDocsText(book, chapterId = '') {
  if (!book || !Array.isArray(book.chapters)) throw new Error('Choose a book first.')
  const chapters = chapterId ? book.chapters.filter(chapter => chapter.id === chapterId) : book.chapters
  if (!chapters.length) throw new Error('No matching chapters found.')
  const body = chapters.map((chapter, index) => `${chapter.title || `Chapter ${index + 1}`}\n\n${textFromHTML(chapter.html)}`).join('\n\n' + '—'.repeat(24) + '\n\n')
  const content = `${book.title || 'Untitled Book'}\n${book.author || ''}\n\n${body}\n`
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  if (blob.size > 25_000_000) throw new Error('This text file is too large. Export one chapter at a time.')
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${safeName(book.title)}${chapterId ? '-chapter' : '-manuscript'}.txt`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}
