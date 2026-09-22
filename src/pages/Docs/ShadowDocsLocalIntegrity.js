import { flushLocalBooks, loadLocalBooks, saveLocalBook } from './ShadowDocsStore'
import { normalizeShadowDocsBook } from './ShadowDocsBookModel'

export async function loadShadowDocsBooksSafely() {
  const raw = await loadLocalBooks()
  const books = []
  const skippedIds = []
  const seenIds = new Set()
  for (const item of raw) {
    try {
      const book = normalizeShadowDocsBook(item)
      if (seenIds.has(book.id)) throw new Error('Duplicate book id')
      books.push(book)
      seenIds.add(book.id)
    } catch {
      skippedIds.push(String(item?.id ?? 'unknown'))
    }
  }
  return { books, skippedIds }
}

export async function flushShadowDocsPendingWrites(pending, currentBooks) {
  const writes = []
  for (const [id, timer] of pending) {
    clearTimeout(timer)
    pending.delete(id)
    const item = currentBooks.find(book => book.id === id)
    if (item) writes.push(saveLocalBook(item))
  }
  const results = await Promise.allSettled(writes)
  await flushLocalBooks()
  const failed = results.find(result => result.status === 'rejected')
  if (failed) throw failed.reason
}
