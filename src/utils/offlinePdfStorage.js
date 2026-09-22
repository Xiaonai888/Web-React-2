import { getOfflineReaderAccountId } from './offlineReaderContent'

const DATABASE = 'shadow_offline_pdfs_v1'
const STORE = 'pdfs'
const LIMIT_BYTES = 200 * 1024 * 1024

function currentAccountId() {
  const id = getOfflineReaderAccountId()
  if (!id) throw new Error('Sign in to access offline PDFs')
  return id
}

function pdfKey(accountId, pdfId) {
  const id = String(pdfId ?? '').trim()
  if (!id) throw new Error('PDF ID is required')
  return JSON.stringify([accountId, id])
}

function expiryTime(value) {
  const result = typeof value === 'number' ? value : Date.parse(String(value || ''))
  return Number.isFinite(result) ? result : 0
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE, 1)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) {
        request.result.createObjectStore(STORE, { keyPath: 'key' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error || new Error('Offline PDF storage unavailable'))
    request.onblocked = () => reject(new Error('Offline PDF storage is blocked'))
  })
}

async function transact(mode, operation) {
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    let value
    let finished = false
    const finish = (error) => {
      if (finished) return
      finished = true
      database.close()
      if (error) reject(error)
      else resolve(value)
    }
    try {
      const transaction = database.transaction(STORE, mode)
      const request = operation(transaction.objectStore(STORE))
      if (request) {
        request.onsuccess = () => { value = request.result }
        request.onerror = () => finish(request.error || new Error('Offline PDF storage failed'))
      }
      transaction.oncomplete = () => finish()
      transaction.onerror = () => finish(transaction.error || new Error('Offline PDF transaction failed'))
      transaction.onabort = () => finish(transaction.error || new Error('Offline PDF transaction aborted'))
    } catch (error) {
      finish(error)
    }
  })
}

async function removeExpired(record) {
  if (!record) return null
  if (record.expiresAt != null && Date.now() >= record.expiresAt) {
    await transact('readwrite', (store) => store.delete(record.key))
    return null
  }
  return record
}

export async function saveOfflinePdf({ pdfId, title, blob, grant } = {}) {
  const accountId = currentAccountId()
  const id = String(pdfId ?? '').trim()
  const access = String(grant?.access_type || '')
  const expiresAt = access === 'temporary' ? expiryTime(grant?.expires_at) : null
  if (grant?.offline_allowed !== true || String(grant?.account_id ?? '') !== accountId ||
    String(grant?.pdf_id ?? '') !== id || !['permanent', 'temporary'].includes(access) ||
    (access === 'temporary' && expiresAt <= Date.now())) {
    throw new Error('Offline reading permission for this PDF is not available')
  }
  if (!(blob instanceof Blob) || blob.size < 5 || blob.size > LIMIT_BYTES ||
    (await blob.slice(0, 5).text()) !== '%PDF-') {
    throw new Error('A complete PDF file is required')
  }
  const record = {
    key: pdfKey(accountId, id), accountId, pdfId: id,
    title: String(title || 'PDF'), blob, access, expiresAt, savedAt: Date.now(),
  }
  await transact('readwrite', (store) => store.put(record))
  return { pdfId: id, title: record.title, access, expiresAt, savedAt: record.savedAt }
}

export async function loadOfflinePdf(pdfId) {
  const key = pdfKey(currentAccountId(), pdfId)
  const record = await transact('readonly', (store) => store.get(key))
  return removeExpired(record)
}

export async function listOfflinePdfs() {
  const accountId = currentAccountId()
  const records = await transact('readonly', (store) => store.getAll())
  const owned = records.filter((record) => record.accountId === accountId)
  const valid = await Promise.all(owned.map(removeExpired))
  return valid.filter(Boolean).map(({ blob, ...metadata }) => metadata)
    .sort((left, right) => right.savedAt - left.savedAt)
}

export async function deleteOfflinePdf(pdfId) {
  const key = pdfKey(currentAccountId(), pdfId)
  await transact('readwrite', (store) => store.delete(key))
}
