import test from 'node:test'
import assert from 'node:assert/strict'
import { getPurchasedPdfDownloadedVersion, rememberPurchasedPdfVersion, forgetPurchasedPdfVersion, getPurchasedPdfUpdateState, readPurchasedPdfResponse } from '../utils/purchasedPdfUpdate.js'

function makeStorage() {
  const values = new Map()
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) }
}

const state = (storage, changes = {}) => getPurchasedPdfUpdateState({ accountId: 'reader', productId: 'pdf', latestVersion: 2, canDownload: true, storage, ...changes })

test('recommend updates only after a real new version and only for downloadable PDFs', () => {
  const storage = makeStorage()
  assert.equal(state(storage, { latestVersion: 1 }).updateAvailable, false)
  assert.equal(state(storage, { canDownload: false }).updateAvailable, false)
  assert.equal(state(storage).updateAvailable, true)
  assert.equal(state(storage).previousVersionKnown, false)
  rememberPurchasedPdfVersion('reader', 'pdf', 2, { storage })
  assert.equal(state(storage).updateAvailable, false)
  assert.equal(state(storage, { latestVersion: 3 }).updateAvailable, true)
})

test('versions are isolated by account, product and saved-file type', () => {
  const storage = makeStorage()
  rememberPurchasedPdfVersion('reader', 'pdf', 3, { storage })
  assert.equal(getPurchasedPdfDownloadedVersion('other', 'pdf', { storage }), 0)
  assert.equal(getPurchasedPdfDownloadedVersion('reader', 'other', { storage }), 0)
  assert.equal(getPurchasedPdfDownloadedVersion('reader', 'pdf', { storage, kind: 'offline' }), 0)
  rememberPurchasedPdfVersion('reader', 'pdf', 2, { storage })
  assert.equal(getPurchasedPdfDownloadedVersion('reader', 'pdf', { storage }), 3)
  rememberPurchasedPdfVersion('reader', 'pdf', 2, { storage, kind: 'offline' })
  assert.equal(getPurchasedPdfDownloadedVersion('reader', 'pdf', { storage, kind: 'offline' }), 2)
  forgetPurchasedPdfVersion('reader', 'pdf', { storage })
  assert.equal(getPurchasedPdfDownloadedVersion('reader', 'pdf', { storage, kind: 'offline' }), 0)
  assert.equal(getPurchasedPdfDownloadedVersion('reader', 'pdf', { storage }), 3)
})

test('blocked browser storage never interrupts reading or downloading', () => {
  const storage = { getItem() { throw new Error('blocked') }, setItem() { throw new Error('blocked') } }
  assert.equal(rememberPurchasedPdfVersion('reader', 'pdf', 2, { storage }), false)
  assert.equal(state(storage).downloadedVersion, 0)
})

test('actual response version is used, never the stale library version', async () => {
  const response = new Response('%PDF-1.7\nexample', { headers: { 'Content-Type': 'application/pdf', 'X-Shadow-Pdf-Version': '3' } })
  const result = await readPurchasedPdfResponse(response)
  assert.equal(result.version, 3)
  assert.ok(result.blob.size > 0)
  const missingHeader = new Response('%PDF-1.7\nexample', { headers: { 'Content-Type': 'application/pdf' } })
  assert.equal((await readPurchasedPdfResponse(missingHeader)).version, 0)
  await assert.rejects(readPurchasedPdfResponse(new Response('invalid', { headers: { 'Content-Type': 'application/pdf' } })), /PDF_FILE_INVALID/)
  await assert.rejects(readPurchasedPdfResponse(new Response('forbidden', { status: 403 })), /PDF_DOWNLOAD_FAILED/)
})
