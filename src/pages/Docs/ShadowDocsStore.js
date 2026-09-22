const DB_NAME = 'shadow-docs-local-v1'
const STORE_NAME = 'books'
let databasePromise
let writes = Promise.resolve()

function database() {
  if (!globalThis.indexedDB) return Promise.reject(new Error('Local storage is unavailable in this browser.'))
  if (!databasePromise) {
    databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1)
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error || new Error('Unable to open local storage.'))
      request.onblocked = () => reject(new Error('Close other Shadow Docs tabs, then try again.'))
    }).catch(error => {
      databasePromise = undefined
      throw error
    })
  }
  return databasePromise
}

async function transact(mode, operation) {
  const db = await database()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode)
    const request = operation(tx.objectStore(STORE_NAME))
    let result
    request.onsuccess = () => { result = request.result }
    request.onerror = () => reject(request.error || new Error('Local save failed.'))
    tx.oncomplete = () => resolve(result)
    tx.onerror = () => reject(tx.error || new Error('Local save failed.'))
    tx.onabort = () => reject(tx.error || new Error('Local save was interrupted.'))
  })
}

export async function loadLocalBooks() {
  await writes.catch(() => {})
  return (await transact('readonly', store => store.getAll())) || []
}

function queue(operation) {
  const job = writes.catch(() => {}).then(operation)
  writes = job
  return job
}

export function saveLocalBook(book) {
  return queue(() => transact('readwrite', store => store.put(book)))
}

export function deleteLocalBook(id) {
  return queue(() => transact('readwrite', store => store.delete(id)))
}

export async function flushLocalBooks() {
  await writes
}
