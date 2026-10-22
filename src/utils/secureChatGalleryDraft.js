const DATABASE_NAME = 'shadow_secure_chat_gallery_v1'
const STORE_NAME = 'keys'
const KEY_ID = 'gallery_draft'
let cachedKeyPromise = null

function openKeyDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, 1)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error || new Error('Unable to open secure storage'))
    request.onblocked = () => reject(new Error('Secure storage is blocked'))
  })
}

async function createOrReadKey() {
  if (!globalThis.crypto?.subtle || !globalThis.indexedDB) {
    throw new Error('Secure gallery draft storage is unavailable')
  }

  const candidate = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
  const db = await openKeyDatabase()

  try {
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(KEY_ID)
      let chosenKey = null

      request.onsuccess = () => {
        chosenKey = request.result || candidate
        if (!request.result) store.put(candidate, KEY_ID)
      }
      transaction.oncomplete = () => resolve(chosenKey)
      transaction.onerror = () => reject(transaction.error || new Error('Unable to save secure key'))
      transaction.onabort = () => reject(transaction.error || new Error('Secure key operation was cancelled'))
    })
  } finally {
    db.close()
  }
}

function getCryptoKey() {
  if (!cachedKeyPromise) {
    cachedKeyPromise = createOrReadKey().catch((error) => {
      cachedKeyPromise = null
      throw error
    })
  }
  return cachedKeyPromise
}

function bytesToBase64(bytes) {
  let binary = ''
  for (let index = 0; index < bytes.length; index += 8192) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 8192))
  }
  return btoa(binary)
}

function base64ToBytes(value) {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

export async function encryptChatGalleryDraft(draft) {
  const key = await getCryptoKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const plain = new TextEncoder().encode(JSON.stringify(draft))
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plain)
  return JSON.stringify({
    version: 1,
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(new Uint8Array(encrypted)),
  })
}

export async function decryptChatGalleryDraft(serialized) {
  const payload = JSON.parse(serialized)
  if (payload?.version !== 1 || !payload.iv || !payload.ciphertext) {
    throw new Error('Invalid encrypted gallery draft')
  }
  const key = await getCryptoKey()
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: base64ToBytes(payload.iv) },
    key,
    base64ToBytes(payload.ciphertext)
  )
  return JSON.parse(new TextDecoder().decode(plain))
}
