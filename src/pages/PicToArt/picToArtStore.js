const DB_NAME = 'shadow-pic-to-art'
const DB_VERSION = 1
const STORE_NAME = 'creations'
const MAX_ITEMS = 40

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('createdAt', 'createdAt')
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error || new Error('DATABASE_OPEN_FAILED'))
  })
}

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error || new Error('DATABASE_REQUEST_FAILED'))
  })
}

function transactionDone(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error || new Error('DATABASE_TRANSACTION_FAILED'))
    transaction.onabort = () => reject(transaction.error || new Error('DATABASE_TRANSACTION_ABORTED'))
  })
}

function makeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

async function trimOldItems(database) {
  const transaction = database.transaction(STORE_NAME, 'readwrite')
  const store = transaction.objectStore(STORE_NAME)
  const items = await requestResult(store.getAll())

  items
    .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))
    .slice(MAX_ITEMS)
    .forEach(item => store.delete(item.id))

  await transactionDone(transaction)
}

export async function savePicToArtCreation({
  blob,
  width,
  height,
  style,
  controls,
}) {
  if (!(blob instanceof Blob)) throw new Error('INVALID_CREATION_BLOB')

  const database = await openDatabase()
  const item = {
    id: makeId(),
    blob,
    width: Number(width || 0),
    height: Number(height || 0),
    style: String(style || 'manga'),
    controls: controls && typeof controls === 'object' ? { ...controls } : {},
    createdAt: Date.now(),
  }

  const transaction = database.transaction(STORE_NAME, 'readwrite')
  transaction.objectStore(STORE_NAME).put(item)
  await transactionDone(transaction)
  await trimOldItems(database)
  database.close()
  return item
}

export async function listPicToArtCreations() {
  const database = await openDatabase()
  const transaction = database.transaction(STORE_NAME, 'readonly')
  const items = await requestResult(transaction.objectStore(STORE_NAME).getAll())
  await transactionDone(transaction)
  database.close()

  return items.sort(
    (a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0),
  )
}

export async function deletePicToArtCreation(id) {
  const database = await openDatabase()
  const transaction = database.transaction(STORE_NAME, 'readwrite')
  transaction.objectStore(STORE_NAME).delete(id)
  await transactionDone(transaction)
  database.close()
}

export async function clearPicToArtCreations() {
  const database = await openDatabase()
  const transaction = database.transaction(STORE_NAME, 'readwrite')
  transaction.objectStore(STORE_NAME).clear()
  await transactionDone(transaction)
  database.close()
}
