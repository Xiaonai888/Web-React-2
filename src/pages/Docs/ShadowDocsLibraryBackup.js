import { normalizeShadowDocsBook } from './ShadowDocsBookModel'

const FORMAT = 'shadow-docs-library'
const VERSION = 1
const MAX_BYTES = 50_000_000

export function downloadShadowDocsLibrary(books) {
  if (!Array.isArray(books) || !books.length) throw new Error('There are no books to back up.')
  const payload = JSON.stringify({ format: FORMAT, version: VERSION, exportedAt: new Date().toISOString(), books: books.map(book => normalizeShadowDocsBook(book)) })
  const blob = new Blob([payload], { type: 'application/json;charset=utf-8' })
  if (blob.size > MAX_BYTES) throw new Error('The library backup exceeds 50 MB. Download individual book backups instead.')
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Shadow-Docs-Library-${new Date().toISOString().slice(0, 10)}.shadowdocs-library`
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

export async function readShadowDocsLibrary(file) {
  if (!file || !file.name.toLowerCase().endsWith('.shadowdocs-library') || file.size > MAX_BYTES) throw new Error('Choose a .shadowdocs-library file smaller than 50 MB.')
  let payload
  try { payload = JSON.parse(await file.text()) } catch { throw new Error('This is not a valid Shadow Docs library backup.') }
  if (payload?.format !== FORMAT || payload?.version !== VERSION || !Array.isArray(payload.books) || !payload.books.length) throw new Error('Unsupported or empty Shadow Docs library backup.')
  if (payload.books.length > 1000) throw new Error('Library backup contains too many books.')
  return payload.books.map(book => normalizeShadowDocsBook(book, { duplicate: true }))
}
