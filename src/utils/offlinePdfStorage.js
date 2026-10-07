import { getOfflineReaderAccountId } from './offlineReaderContent'

const DATABASE = 'shadow_offline_pdfs_v1'
const DATABASE_VERSION = 2
const STORE = 'pdfs'
const METADATA = 'metadata'
const ACCOUNT_INDEX = 'accountId'
const LIMIT_BYTES = 200 * 1024 * 1024

let databasePromise = null

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
  const result =
    typeof value === 'number'
      ? value
      : Date.parse(String(value || ''))

  return Number.isFinite(result) ? result : 0
}

function isExpired(record) {
  return (
    record?.expiresAt != null &&
    Date.now() >= record.expiresAt
  )
}

function metadataFromRecord(record) {
  if (!record) return null

  return {
    key: record.key,
    accountId: record.accountId,
    pdfId: record.pdfId,
    title: record.title,
    access: record.access,
    expiresAt: record.expiresAt,
    savedAt: record.savedAt,
  }
}

async function requestPersistentStorage() {
  try {
    if (!navigator.storage?.persist) return false

    if (
      navigator.storage.persisted &&
      await navigator.storage.persisted()
    ) {
      return true
    }

    return Boolean(await navigator.storage.persist())
  } catch {
    return false
  }
}

function openDatabase() {
  if (databasePromise) return databasePromise

  databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(
      DATABASE,
      DATABASE_VERSION
    )

    request.onupgradeneeded = (event) => {
      const database = request.result
      const transaction = request.transaction

      if (!database.objectStoreNames.contains(STORE)) {
        database.createObjectStore(STORE, {
          keyPath: 'key',
        })
      }

      let metadataStore

      if (!database.objectStoreNames.contains(METADATA)) {
        metadataStore = database.createObjectStore(
          METADATA,
          {
            keyPath: 'key',
          }
        )
      } else {
        metadataStore = transaction.objectStore(METADATA)
      }

      if (
        !metadataStore.indexNames.contains(ACCOUNT_INDEX)
      ) {
        metadataStore.createIndex(
          ACCOUNT_INDEX,
          'accountId',
          {
            unique: false,
          }
        )
      }

      if (event.oldVersion < 2) {
        const pdfStore = transaction.objectStore(STORE)
        const cursorRequest = pdfStore.openCursor()

        cursorRequest.onsuccess = () => {
          const cursor = cursorRequest.result
          if (!cursor) return

          const metadata = metadataFromRecord(
            cursor.value
          )

          if (
            metadata?.key &&
            metadata?.accountId
          ) {
            metadataStore.put(metadata)
          }

          cursor.continue()
        }
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

    request.onerror = () => {
      databasePromise = null
      reject(
        request.error ||
        new Error('Offline PDF storage unavailable')
      )
    }

    request.onblocked = () => {
      databasePromise = null
      reject(
        new Error('Offline PDF storage is blocked')
      )
    }
  })

  return databasePromise
}

async function transact(
  storeNames,
  mode,
  operation
) {
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    let value
    let finished = false
    let transaction

    const finish = (error) => {
      if (finished) return
      finished = true

      if (error) {
        reject(error)
      } else {
        resolve(value)
      }
    }

    try {
      transaction = database.transaction(
        storeNames,
        mode
      )

      const result = operation(transaction)

      if (result) {
        result.onsuccess = () => {
          value = result.result
        }

        result.onerror = () => {
          finish(
            result.error ||
            new Error('Offline PDF storage failed')
          )
        }
      }

      transaction.oncomplete = () => finish()
      transaction.onerror = () =>
        finish(
          transaction.error ||
          new Error('Offline PDF transaction failed')
        )
      transaction.onabort = () =>
        finish(
          transaction.error ||
          new Error('Offline PDF transaction aborted')
        )
    } catch (error) {
      try {
        transaction?.abort()
      } catch {
      }

      finish(error)
    }
  })
}

async function deleteRecordByKey(key) {
  await transact(
    [STORE, METADATA],
    'readwrite',
    (transaction) => {
      transaction.objectStore(STORE).delete(key)
      transaction.objectStore(METADATA).delete(key)
    }
  )
}

async function ensureMetadataForKey(key) {
  const metadata = await transact(
    [METADATA],
    'readonly',
    (transaction) =>
      transaction.objectStore(METADATA).get(key)
  )

  if (metadata) return metadata

  const record = await transact(
    [STORE],
    'readonly',
    (transaction) =>
      transaction.objectStore(STORE).get(key)
  )

  if (!record) return null

  const recovered = metadataFromRecord(record)

  if (recovered) {
    await transact(
      [METADATA],
      'readwrite',
      (transaction) =>
        transaction
          .objectStore(METADATA)
          .put(recovered)
    )
  }

  return recovered
}

export async function saveOfflinePdf({
  pdfId,
  title,
  blob,
  grant,
} = {}) {
  const accountId = currentAccountId()
  const id = String(pdfId ?? '').trim()
  const access = String(grant?.access_type || '')
  const expiresAt =
    access === 'temporary'
      ? expiryTime(grant?.expires_at)
      : null

  if (
    grant?.offline_allowed !== true ||
    String(grant?.account_id ?? '') !== accountId ||
    String(grant?.pdf_id ?? '') !== id ||
    !['permanent', 'temporary'].includes(access) ||
    (
      access === 'temporary' &&
      expiresAt <= Date.now()
    )
  ) {
    throw new Error(
      'Offline reading permission for this PDF is not available'
    )
  }

  if (
    !(blob instanceof Blob) ||
    blob.size < 5 ||
    blob.size > LIMIT_BYTES ||
    (await blob.slice(0, 5).text()) !== '%PDF-'
  ) {
    throw new Error('A complete PDF file is required')
  }

  await requestPersistentStorage()

  const record = {
    key: pdfKey(accountId, id),
    accountId,
    pdfId: id,
    title: String(title || 'PDF'),
    blob,
    access,
    expiresAt,
    savedAt: Date.now(),
  }

  const metadata = metadataFromRecord(record)

  await transact(
    [STORE, METADATA],
    'readwrite',
    (transaction) => {
      transaction.objectStore(STORE).put(record)
      transaction
        .objectStore(METADATA)
        .put(metadata)
    }
  )

  return metadata
}

export async function loadOfflinePdf(pdfId) {
  const accountId = currentAccountId()
  const key = pdfKey(accountId, pdfId)
  const metadata = await ensureMetadataForKey(key)

  if (!metadata) return null

  if (isExpired(metadata)) {
    await deleteRecordByKey(key)
    return null
  }

  const record = await transact(
    [STORE],
    'readonly',
    (transaction) =>
      transaction.objectStore(STORE).get(key)
  )

  if (!record) {
    await transact(
      [METADATA],
      'readwrite',
      (transaction) =>
        transaction.objectStore(METADATA).delete(key)
    )
    return null
  }

  return record
}

export async function listOfflinePdfs() {
  const accountId = currentAccountId()

  const records = await transact(
    [METADATA],
    'readonly',
    (transaction) =>
      transaction
        .objectStore(METADATA)
        .index(ACCOUNT_INDEX)
        .getAll(accountId)
  )

  const expired = records.filter(isExpired)

  if (expired.length) {
    await transact(
      [STORE, METADATA],
      'readwrite',
      (transaction) => {
        const pdfStore =
          transaction.objectStore(STORE)
        const metadataStore =
          transaction.objectStore(METADATA)

        for (const record of expired) {
          pdfStore.delete(record.key)
          metadataStore.delete(record.key)
        }
      }
    )
  }

  return records
    .filter((record) => !isExpired(record))
    .sort(
      (left, right) =>
        Number(right.savedAt || 0) -
        Number(left.savedAt || 0)
    )
}

export async function deleteOfflinePdf(pdfId) {
  const key = pdfKey(
    currentAccountId(),
    pdfId
  )

  await deleteRecordByKey(key)
}
