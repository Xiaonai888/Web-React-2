const DATABASE_NAME = 'shadow_media_upload_queue'
const DATABASE_VERSION = 1
const TASK_STORE = 'tasks'
const FILE_STORE = 'files'
const DEFAULT_LEASE_MS = 120000
let databasePromise = null

function required(value, label) {
  const clean = String(value || '').trim()
  if (!clean) throw new Error(`${label} is required`)
  return clean
}

function makeId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`
}

function openDatabase() {
  if (databasePromise) return databasePromise
  if (typeof indexedDB === 'undefined') return Promise.reject(new Error('Local media storage is unavailable in this browser'))

  databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)
    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(TASK_STORE)) {
        const tasks = database.createObjectStore(TASK_STORE, { keyPath: 'id' })
        tasks.createIndex('by_owner_created', ['ownerId', 'createdAt'])
      }
      if (!database.objectStoreNames.contains(FILE_STORE)) {
        database.createObjectStore(FILE_STORE)
      }
    }
    request.onsuccess = () => {
      const database = request.result
      database.onversionchange = () => {
        database.close()
        databasePromise = null
      }
      resolve(database)
    }
    request.onerror = () => reject(request.error || new Error('Cannot open local media storage'))
    request.onblocked = () => reject(new Error('Close other Shadow tabs and retry local media storage'))
  }).catch((error) => {
    databasePromise = null
    throw error
  })

  return databasePromise
}

async function transaction(storeNames, mode, operate) {
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    const tx = database.transaction(storeNames, mode)
    let result = null
    tx.oncomplete = () => resolve(result)
    tx.onabort = () => reject(tx.error || new Error('Local media storage transaction failed'))
    tx.onerror = () => {}
    const setResult = (value) => { result = value }
    try {
      operate(tx, setResult)
    } catch (error) {
      tx.abort()
      reject(error)
    }
  })
}

function ownerRange(ownerId) {
  return IDBKeyRange.bound([ownerId, 0], [ownerId, Number.MAX_SAFE_INTEGER])
}

function toSafeTask(task) {
  if (!task) return null
  return { ...task }
}

export async function requestUploadStoragePersistence() {
  if (typeof navigator === 'undefined' || typeof navigator.storage?.persist !== 'function') return false
  try {
    return Boolean(await navigator.storage.persist())
  } catch {
    return false
  }
}

export async function enqueueMediaUpload({ file, ownerId, category, kind = 'image', context = {} }) {
  const owner = required(ownerId, 'Account ID')
  const selectedCategory = required(category, 'Media category')
  if (typeof Blob === 'undefined' || !(file instanceof Blob) || file.size <= 0) {
    throw new Error('A nonempty media file is required')
  }

  const now = Date.now()
  const task = {
    id: makeId(),
    ownerId: owner,
    category: selectedCategory,
    kind: String(kind || 'image'),
    context,
    name: String(file.name || 'media'),
    mimeType: String(file.type || 'application/octet-stream'),
    size: file.size,
    status: 'queued',
    progress: 0,
    attempts: 0,
    retryAt: 0,
    leaseOwner: '',
    leaseUntil: 0,
    lastError: '',
    result: null,
    createdAt: now,
    updatedAt: now,
  }

  try {
    await transaction([TASK_STORE, FILE_STORE], 'readwrite', (tx) => {
      tx.objectStore(FILE_STORE).add(file, task.id)
      tx.objectStore(TASK_STORE).add(task)
    })
  } catch (error) {
    if (error?.name === 'QuotaExceededError') {
      throw new Error('This device has insufficient local storage for the selected media')
    }
    throw error
  }

  return toSafeTask(task)
}

export async function getMediaUploadTask(id, ownerId) {
  const owner = required(ownerId, 'Account ID')
  return transaction([TASK_STORE], 'readonly', (tx, setResult) => {
    const request = tx.objectStore(TASK_STORE).get(id)
    request.onsuccess = () => {
      const task = request.result
      setResult(task?.ownerId === owner ? toSafeTask(task) : null)
    }
  })
}

export async function listMediaUploadTasks(ownerId) {
  const owner = required(ownerId, 'Account ID')
  return transaction([TASK_STORE], 'readonly', (tx, setResult) => {
    const tasks = []
    const cursorRequest = tx.objectStore(TASK_STORE).index('by_owner_created').openCursor(ownerRange(owner))
    cursorRequest.onsuccess = () => {
      const cursor = cursorRequest.result
      if (cursor) {
        tasks.push(toSafeTask(cursor.value))
        cursor.continue()
      } else {
        setResult(tasks)
      }
    }
  })
}

export async function readMediaUploadFile(id, ownerId) {
  const owner = required(ownerId, 'Account ID')
  return transaction([TASK_STORE, FILE_STORE], 'readonly', (tx, setResult) => {
    const request = tx.objectStore(TASK_STORE).get(id)
    request.onsuccess = () => {
      if (request.result?.ownerId !== owner) return
      const fileRequest = tx.objectStore(FILE_STORE).get(id)
      fileRequest.onsuccess = () => setResult(fileRequest.result || null)
    }
  })
}

export async function claimNextMediaUpload(ownerId, workerId, leaseMs = DEFAULT_LEASE_MS) {
  const owner = required(ownerId, 'Account ID')
  const worker = required(workerId, 'Worker ID')
  const now = Date.now()
  const duration = Math.max(30000, Number(leaseMs) || DEFAULT_LEASE_MS)

  return transaction([TASK_STORE], 'readwrite', (tx, setResult) => {
    const request = tx.objectStore(TASK_STORE).index('by_owner_created').openCursor(ownerRange(owner))
    request.onsuccess = () => {
      const cursor = request.result
      if (!cursor) return
      const task = cursor.value
      const available = task.status === 'queued' ||
        (task.status === 'retry_wait' && task.retryAt <= now) ||
        (task.status === 'uploading' && task.leaseUntil <= now)
      if (!available) {
        cursor.continue()
        return
      }
      const claimed = {
        ...task,
        status: 'uploading',
        attempts: task.attempts + 1,
        progress: 0,
        leaseOwner: worker,
        leaseUntil: now + duration,
        updatedAt: now,
      }
      cursor.update(claimed)
      setResult(toSafeTask(claimed))
    }
  })
}

export async function renewMediaUploadLease(id, workerId, leaseMs = DEFAULT_LEASE_MS) {
  const worker = required(workerId, 'Worker ID')
  return transaction([TASK_STORE], 'readwrite', (tx, setResult) => {
    const store = tx.objectStore(TASK_STORE)
    const request = store.get(id)
    request.onsuccess = () => {
      const task = request.result
      if (task?.status !== 'uploading' || task.leaseOwner !== worker) return
      store.put({ ...task, leaseUntil: Date.now() + Math.max(30000, leaseMs) })
      setResult(true)
    }
  })
}

export async function setMediaUploadProgress(id, workerId, progress) {
  const worker = required(workerId, 'Worker ID')
  const percent = Math.max(0, Math.min(99, Math.round(Number(progress) || 0)))
  return transaction([TASK_STORE], 'readwrite', (tx) => {
    const store = tx.objectStore(TASK_STORE)
    const request = store.get(id)
    request.onsuccess = () => {
      const task = request.result
      if (task?.status !== 'uploading' || task.leaseOwner !== worker) return
      if (percent <= task.progress) return
      store.put({ ...task, progress: percent, updatedAt: Date.now() })
    }
  })
}

export async function finishMediaUpload(id, workerId, result) {
  const worker = required(workerId, 'Worker ID')
  if (result === null || result === undefined) throw new Error('The upload result is missing')
  return transaction([TASK_STORE], 'readwrite', (tx, setResult) => {
    const store = tx.objectStore(TASK_STORE)
    const request = store.get(id)
    request.onsuccess = () => {
      const task = request.result
      if (task?.status !== 'uploading' || task.leaseOwner !== worker) return
      const completed = {
        ...task,
        status: 'uploaded',
        progress: 100,
        retryAt: 0,
        leaseOwner: '',
        leaseUntil: 0,
        lastError: '',
        result,
        updatedAt: Date.now(),
      }
      store.put(completed)
      setResult(toSafeTask(completed))
    }
  })
}

export async function failMediaUpload(id, workerId, { message = '', retryAt = 0, permanent = false } = {}) {
  const worker = required(workerId, 'Worker ID')
  return transaction([TASK_STORE], 'readwrite', (tx, setResult) => {
    const store = tx.objectStore(TASK_STORE)
    const request = store.get(id)
    request.onsuccess = () => {
      const task = request.result
      if (task?.status !== 'uploading' || task.leaseOwner !== worker) return
      const next = {
        ...task,
        status: permanent ? 'failed' : retryAt > 0 ? 'retry_wait' : 'queued',
        retryAt: permanent ? 0 : retryAt,
        leaseOwner: '',
        leaseUntil: 0,
        lastError: String(message || '').slice(0, 500),
        updatedAt: Date.now(),
      }
      store.put(next)
      setResult(toSafeTask(next))
    }
  })
}

export async function retryMediaUpload(id, ownerId) {
  const owner = required(ownerId, 'Account ID')
  return transaction([TASK_STORE], 'readwrite', (tx, setResult) => {
    const store = tx.objectStore(TASK_STORE)
    const request = store.get(id)
    request.onsuccess = () => {
      const task = request.result
      if (task?.ownerId !== owner || !['failed', 'retry_wait'].includes(task.status)) return
      const updated = {
        ...task,
        status: 'queued',
        progress: 0,
        attempts: 0,
        retryAt: 0,
        lastError: '',
        updatedAt: Date.now(),
      }
      store.put(updated)
      setResult(toSafeTask(updated))
    }
  })
}

export async function removeMediaUpload(id, ownerId) {
  const owner = required(ownerId, 'Account ID')
  return transaction([TASK_STORE, FILE_STORE], 'readwrite', (tx, setResult) => {
    const store = tx.objectStore(TASK_STORE)
    const request = store.get(id)
    request.onsuccess = () => {
      const task = request.result
      if (task?.ownerId !== owner) return
      if (task.status === 'uploading' && task.leaseUntil > Date.now()) return
      store.delete(id)
      tx.objectStore(FILE_STORE).delete(id)
      setResult(true)
    }
  })
}
