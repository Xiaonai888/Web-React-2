const EDITIONS = new Set(['standard', 'limited'])
const UUID = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i

export function readerPreOrderVolumes(record) {
  const books = Array.isArray(record?.books) ? record.books : record?.book ? [record.book] : []
  return books.filter(book => book && typeof book.id === 'string' && UUID.test(book.id))
    .slice().sort((a, b) => Number(a.position ?? 0) - Number(b.position ?? 0))
}

export function readerPreOrderVolumeChoices(book) {
  return ['standard', 'limited'].map(edition => {
    const option = book?.editions?.[edition] || {}
    const available = Number(option.available)
    const price = Number(option.price_usd)
    return {
      edition,
      enabled: option.enabled === true && Number.isSafeInteger(available) && available > 0 &&
        Number.isFinite(price) && price > 0,
      available: Number.isSafeInteger(available) ? Math.max(0, available) : 0,
      price_usd: Number.isFinite(price) && price >= 0 ? price : null,
    }
  })
}

export function readerPreOrderNormalizeVolumeSelection(record, value) {
  const books = readerPreOrderVolumes(record)
  const known = new Map(books.map(book => [book.id.toLowerCase(), book]))
  const entries = Array.isArray(value) ? value : []
  if (entries.length > 10) return { valid: false, items: [], code: 'TOO_MANY_VOLUMES' }
  const selected = new Map()
  for (const raw of entries) {
    const id = String(raw?.book_id || '').toLowerCase()
    const edition = String(raw?.edition || '').toLowerCase()
    const quantity = Number(raw?.quantity)
    const book = known.get(id)
    const choice = readerPreOrderVolumeChoices(book).find(item => item.edition === edition)
    if (!book || !EDITIONS.has(edition) || !choice?.enabled ||
      !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 99 ||
      quantity > choice.available || selected.has(id)) {
      return { valid: false, items: [], code: 'INVALID_VOLUME_SELECTION' }
    }
    selected.set(id, { book_id: book.id, edition, quantity })
  }
  const items = books.map(book => selected.get(book.id.toLowerCase())).filter(Boolean)
  return { valid: items.length > 0, items, code: items.length ? null : 'NO_VOLUMES_SELECTED' }
}

export function readerPreOrderUpdateVolumeSelection(record, value, bookId, edition, quantity = 1) {
  const books = readerPreOrderVolumes(record)
  const book = books.find(item => item.id.toLowerCase() === String(bookId || '').toLowerCase())
  if (!book) return Array.isArray(value) ? value : []
  const others = (Array.isArray(value) ? value : []).filter(item =>
    String(item?.book_id || '').toLowerCase() !== book.id.toLowerCase())
  if (edition === '' || edition == null || quantity === 0) return others
  const choice = readerPreOrderVolumeChoices(book).find(item => item.edition === edition)
  if (!choice?.enabled) return others
  const count = Math.min(99, Math.min(choice.available, Math.max(1, Number(quantity) || 1)))
  return books.map(item => item.id.toLowerCase() === book.id.toLowerCase()
    ? { book_id: book.id, edition, quantity: Math.floor(count) }
    : others.find(other => other.book_id?.toLowerCase() === item.id.toLowerCase())
  ).filter(Boolean)
}

export function readerPreOrderVolumeEstimate(record, value) {
  const selection = readerPreOrderNormalizeVolumeSelection(record, value)
  if (!selection.valid) return { valid: false, subtotal_usd: 0, total_copies: 0 }
  const books = new Map(readerPreOrderVolumes(record).map(item => [item.id.toLowerCase(), item]))
  let cents = 0
  let copies = 0
  for (const line of selection.items) {
    const price = Number(books.get(line.book_id.toLowerCase())?.editions?.[line.edition]?.price_usd)
    if (!Number.isFinite(price) || price <= 0 || !Number.isSafeInteger(Math.round(price * 100))) {
      return { valid: false, subtotal_usd: 0, total_copies: 0 }
    }
    cents += Math.round(price * 100) * line.quantity
    copies += line.quantity
  }
  if (!Number.isSafeInteger(cents)) return { valid: false, subtotal_usd: 0, total_copies: 0 }
  return { valid: true, subtotal_usd: cents / 100, total_copies: copies }
}
