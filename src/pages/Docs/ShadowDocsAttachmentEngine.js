const DATABASE = 'shadow-docs-attachments-v1'
const STORE = 'attachments'
const MAX_FILE_BYTES = 5_000_000
const MAX_CHAPTER_BYTES = 25_000_000
const MAX_CHAPTER_FILES = 25
const ALLOWED_EXTENSIONS = /\.(?:pdf|docx?|xlsx?|pptx?|txt|csv|rtf|epub|zip|md|json)$/i

function openDatabase() {
  if (typeof indexedDB === 'undefined') return Promise.reject(new Error('Local attachment storage is unavailable in this browser.'))
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE, 1)
    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(STORE)) {
        const store = database.createObjectStore(STORE, { keyPath: 'id' })
        store.createIndex('chapterId', 'chapterId', { unique: false })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(new Error('Could not open local attachment storage.'))
    request.onblocked = () => reject(new Error('Attachment database is busy in another tab.'))
  })
}

async function transactionResult(mode, action) {
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    let result
    let transaction
    try {
      transaction = database.transaction(STORE, mode)
      const request = action(transaction.objectStore(STORE))
      request.onsuccess = () => { result = request.result }
      request.onerror = () => { result = undefined }
    } catch (error) {
      database.close()
      reject(error)
      return
    }
    transaction.oncomplete = () => { database.close(); resolve(result) }
    transaction.onerror = () => { database.close(); reject(new Error('Attachment storage failed. Check browser space.')) }
    transaction.onabort = () => { database.close(); reject(new Error('Attachment storage was interrupted.')) }
  })
}

export async function listShadowDocsAttachments(chapterId) {
  if (!chapterId) return []
  const records = await transactionResult('readonly', store => store.index('chapterId').getAll(String(chapterId)))
  return (records || []).map(({ id, name, size, chapterId, createdAt }) => ({ id, name, size, chapterId, createdAt }))
    .sort((a, b) => b.createdAt - a.createdAt)
}

export async function saveShadowDocsAttachment(file, chapterId) {
  if (!chapterId) throw new Error('Open a chapter first.')
  if (!file || typeof file.name !== 'string' || !Number.isFinite(file.size)) throw new Error('Select a valid file.')
  const name = file.name.split(/[\\/]/).pop().replace(/[\u0000-\u001f<>:"|?*]/g, '_').trim().slice(0, 120)
  if (!name || !ALLOWED_EXTENSIONS.test(name)) throw new Error('Choose a PDF, Office, text, EPUB or ZIP file.')
  if (file.size <= 0 || file.size > MAX_FILE_BYTES) throw new Error('File must be smaller than 5 MB.')
  const files = await listShadowDocsAttachments(chapterId)
  if (files.length >= MAX_CHAPTER_FILES || files.reduce((sum, item) => sum + item.size, 0) + file.size > MAX_CHAPTER_BYTES) {
    throw new Error('This chapter has reached the local attachment limit.')
  }
  const id = globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
  const record = { id, chapterId: String(chapterId), name, size: file.size, type: file.type || 'application/octet-stream', createdAt: Date.now(), data: file }
  await transactionResult('readwrite', store => store.put(record))
  return { id, name, size: file.size }
}

export async function deleteShadowDocsAttachment(id) {
  if (!id) throw new Error('Missing attachment identifier.')
  await transactionResult('readwrite', store => store.delete(String(id)))
  return true
}

export async function downloadShadowDocsAttachment(id) {
  if (!id || typeof document === 'undefined') throw new Error('Attachment download is unavailable.')
  const record = await transactionResult('readonly', store => store.get(String(id)))
  if (!record?.data) throw new Error('This attachment is not stored on this browser. Use the original device or file backup.')
  const url = URL.createObjectURL(record.data)
  try {
    const link = document.createElement('a')
    link.href = url
    link.download = record.name || 'attachment'
    document.body.appendChild(link)
    link.click()
    link.remove()
  } finally {
    globalThis.setTimeout(() => URL.revokeObjectURL(url), 60000)
  }
  return true
}
