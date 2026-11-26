const PREFIX = 'shadow:purchased-pdf-version:v1:'
export const PDF_VERSION_HEADER = 'X-Shadow-Pdf-Version'

export function normalizePurchasedPdfVersion(value) {
  const version = Number(value)
  return Number.isSafeInteger(version) && version > 0 ? version : 0
}

function storageKey(accountId, productId, kind) {
  const account = String(accountId || '').trim()
  const product = String(productId || '').trim()
  if (!account || !product || !['download', 'offline'].includes(kind)) return ''
  return `${PREFIX}${kind}:${encodeURIComponent(account)}:${encodeURIComponent(product)}`
}

function resolveStorage(storage) {
  return storage === undefined ? globalThis.localStorage : storage
}

export function getPurchasedPdfDownloadedVersion(accountId, productId, { kind = 'download', storage } = {}) {
  const key = storageKey(accountId, productId, kind)
  if (!key) return 0
  try {
    return normalizePurchasedPdfVersion(resolveStorage(storage)?.getItem(key))
  } catch {
    return 0
  }
}

export function rememberPurchasedPdfVersion(accountId, productId, version, { kind = 'download', storage } = {}) {
  const key = storageKey(accountId, productId, kind)
  const value = normalizePurchasedPdfVersion(version)
  if (!key || !value) return false
  try {
    const target = resolveStorage(storage)
    if (!target) return false
    const previous = normalizePurchasedPdfVersion(target.getItem(key))
    if (kind === 'offline' || value > previous) target.setItem(key, String(value))
    return true
  } catch {
    return false
  }
}

export function forgetPurchasedPdfVersion(accountId, productId, { kind = 'offline', storage } = {}) {
  const key = storageKey(accountId, productId, kind)
  if (!key) return
  try {
    resolveStorage(storage)?.removeItem(key)
  } catch {
  }
}

export function getPurchasedPdfUpdateState({ accountId, productId, latestVersion, canDownload, kind = 'download', storage } = {}) {
  const latest = normalizePurchasedPdfVersion(latestVersion)
  const downloaded = getPurchasedPdfDownloadedVersion(accountId, productId, { kind, storage })
  const available = Boolean(accountId && productId && canDownload === true && latest > 1 && downloaded < latest)
  return { latestVersion: latest, downloadedVersion: downloaded, updateAvailable: available, previousVersionKnown: downloaded > 0 }
}

export function getPurchasedPdfResponseVersion(response) {
  return normalizePurchasedPdfVersion(response?.headers?.get(PDF_VERSION_HEADER))
}

export async function readPurchasedPdfResponse(response) {
  if (!response?.ok) throw new Error('PDF_DOWNLOAD_FAILED')
  const blob = await response.blob()
  if (!blob.size || !blob.type.toLowerCase().startsWith('application/pdf')) throw new Error('PDF_FILE_INVALID')
  const header = await blob.slice(0, 1024).text()
  if (!header.includes('%PDF-')) throw new Error('PDF_FILE_INVALID')
  return { blob, version: getPurchasedPdfResponseVersion(response) }
}
