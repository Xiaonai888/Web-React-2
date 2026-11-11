const STORAGE_PREFIX = 'shadow-docs:review-comments:v1:'
const MAX_RECORDS = 300

function storageKey(documentId) {
  return STORAGE_PREFIX + encodeURIComponent(String(documentId || 'default').slice(0, 120))
}

function clean(value, max) {
  return String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max)
}

function normalize(record) {
  if (!record || typeof record !== 'object') return null
  const id = clean(record.id, 120)
  const chapterId = clean(record.chapterId, 120)
  const text = clean(record.text, 2000)
  if (!id || !chapterId || !text) return null
  const createdAt = Math.max(0, Number(record.createdAt) || Date.now())
  return {
    id,
    chapterId,
    author: clean(record.author, 80) || 'Author',
    text,
    quote: clean(record.quote, 240),
    createdAt,
    updatedAt: Math.max(createdAt, Number(record.updatedAt) || createdAt),
    resolvedAt: record.resolvedAt ? Math.max(createdAt, Number(record.resolvedAt) || Date.now()) : null,
  }
}

export function readShadowDocsReviewComments(documentId, chapterId = '') {
  try {
    const raw = JSON.parse(globalThis.localStorage?.getItem(storageKey(documentId)) || '[]')
    if (!Array.isArray(raw)) return []
    const unique = new Map()
    raw.slice(0, MAX_RECORDS).forEach(item => {
      const record = normalize(item)
      if (record) unique.set(record.id, record)
    })
    const records = [...unique.values()].sort((a, b) => a.createdAt - b.createdAt)
    return chapterId ? records.filter(record => record.chapterId === String(chapterId)) : records
  } catch {
    return []
  }
}

function writeRecords(documentId, records) {
  try {
    if (!globalThis.localStorage) return false
    globalThis.localStorage.setItem(storageKey(documentId), JSON.stringify(records.slice(-MAX_RECORDS)))
    return true
  } catch {
    return false
  }
}

export function saveShadowDocsReviewComment(documentId, input) {
  const record = normalize(input)
  if (!record) return false
  const records = readShadowDocsReviewComments(documentId)
  const index = records.findIndex(item => item.id === record.id)
  if (index >= 0) records[index] = record
  else records.push(record)
  return writeRecords(documentId, records)
}

export function updateShadowDocsReviewComment(documentId, id, patch = {}) {
  const records = readShadowDocsReviewComments(documentId)
  const index = records.findIndex(item => item.id === id)
  if (index < 0) return false
  const next = normalize({ ...records[index], ...patch, id: records[index].id, chapterId: records[index].chapterId, createdAt: records[index].createdAt, updatedAt: Date.now() })
  if (!next) return false
  records[index] = next
  return writeRecords(documentId, records)
}

export function deleteShadowDocsReviewComment(documentId, id) {
  const records = readShadowDocsReviewComments(documentId)
  if (!records.some(item => item.id === id)) return false
  return writeRecords(documentId, records.filter(item => item.id !== id))
}
