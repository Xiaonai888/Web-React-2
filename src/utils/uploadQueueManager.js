import {
  claimNextMediaUpload,
  enqueueMediaUpload,
  failMediaUpload,
  finishMediaUpload,
  getMediaUploadTask,
  listMediaUploadTasks,
  readMediaUploadFile,
  removeMediaUpload,
  renewMediaUploadLease,
  retryMediaUpload,
  setMediaUploadProgress,
} from './uploadQueueDB'

const CHECK_INTERVAL_MS = 10000
const LEASE_DURATION_MS = 120000
const LEASE_RENEW_INTERVAL_MS = 20000
const MAX_RETRY_DELAY_MS = 300000

function newWorkerId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function isOnline() {
  return typeof navigator === 'undefined' || navigator.onLine !== false
}

function errorStatus(error) {
  return Number(error?.status || error?.httpStatus || error?.statusCode || 0)
}

function canRetry(error) {
  const status = errorStatus(error)
  if ([408, 425, 429].includes(status) || status >= 500) return true
  if (status >= 400) return false
  return error?.name !== 'AbortError'
}

function isTemporaryOutage(error) {
  const status = errorStatus(error)
  if ([408, 425, 429].includes(status) || status >= 500) return true
  if (status !== 0) return false
  const code = String(error?.code || '').toUpperCase()
  if (['DIRECT_UPLOAD_NETWORK_ERROR', 'LEGACY_UPLOAD_NETWORK_ERROR'].includes(code)) return true
  return /network|offline|failed to fetch|cannot connect|could not (?:be )?reach|timed? ?out/i.test(String(error?.message || ''))
}

function retryDelay(attempts, error) {
  const suggested = Number(error?.retryAfterMs || 0)
  if (suggested > 0) return Math.min(MAX_RETRY_DELAY_MS, Math.max(1000, suggested))
  return Math.min(MAX_RETRY_DELAY_MS, 3000 * 2 ** Math.min(7, Math.max(0, attempts - 1)))
}

export function createUploadQueueManager({ ownerId, upload, onChange, maxAttempts = 6 } = {}) {
  const owner = String(ownerId || '').trim()
  if (!owner) throw new Error('Account ID is required for the upload queue')
  if (typeof upload !== 'function') throw new Error('An upload handler is required')

  const workerId = newWorkerId()
  let running = false
  let busy = false
  let timer = null
  let controller = null
  let leaseTimer = null
  let lastProgressAt = 0
  let lastPercent = -1

  function notify(type, task = null) {
    if (typeof onChange === 'function') {
      try { onChange({ type, task, ownerId: owner }) } catch {}
    }
    if (typeof window !== 'undefined' && typeof CustomEvent === 'function') {
      window.dispatchEvent(new CustomEvent('shadow-media-upload-queue', { detail: { type, task, ownerId: owner } }))
    }
  }

  async function tick() {
    if (!running || busy || !isOnline()) return
    busy = true
    let task = null
    let worked = false

    try {
      task = await claimNextMediaUpload(owner, workerId, LEASE_DURATION_MS)
      if (!task) return
      worked = true
      if (!running) {
        await failMediaUpload(task.id, workerId)
        return
      }
      notify('uploading', task)
      const file = await readMediaUploadFile(task.id, owner)
      if (!file) {
        const missing = new Error('The locally saved media file is missing')
        missing.permanent = true
        throw missing
      }

      controller = new AbortController()
      lastProgressAt = 0
      lastPercent = -1
      leaseTimer = setInterval(() => {
        renewMediaUploadLease(task.id, workerId, LEASE_DURATION_MS).catch(() => {})
      }, LEASE_RENEW_INTERVAL_MS)

      const result = await upload({
        task,
        file,
        signal: controller.signal,
        onProgress: (progress) => {
          const value = typeof progress === 'number' ? progress : progress?.percent
          if (!Number.isFinite(Number(value))) return
          const percent = Math.max(0, Math.min(99, Math.round(Number(value))))
          const now = Date.now()
          if (percent <= lastPercent || (now - lastProgressAt < 600 && percent < lastPercent + 5)) return
          lastProgressAt = now
          lastPercent = percent
          setMediaUploadProgress(task.id, workerId, percent).catch(() => {})
          notify('progress', { ...task, status: 'uploading', progress: percent })
        },
      })

      if (controller.signal.aborted) throw new DOMException('Upload interrupted', 'AbortError')
      const completed = await finishMediaUpload(task.id, workerId, result)
      if (completed) notify('uploaded', completed)
    } catch (error) {
      if (task) {
        const interrupted = controller?.signal.aborted || error?.name === 'AbortError'
        const recoverable = interrupted || canRetry(error)
        const permanent = !interrupted && (error?.permanent || !recoverable || (task.attempts >= maxAttempts && !isTemporaryOutage(error)))
        const nextRetryAt = interrupted ? 0 : permanent ? 0 : Date.now() + retryDelay(task.attempts, error)
        try {
          const failed = await failMediaUpload(task.id, workerId, {
            message: error?.message || 'Upload failed',
            retryAt: nextRetryAt,
            permanent,
          })
          if (failed) notify(permanent ? 'failed' : 'queued', failed)
        } catch (storageError) {
          notify('storage-error', { id: task.id, message: storageError?.message || 'Local storage failed' })
        }
      } else {
        notify('storage-error', { message: error?.message || 'Cannot read upload queue' })
      }
    } finally {
      if (leaseTimer) clearInterval(leaseTimer)
      leaseTimer = null
      controller = null
      busy = false
      if (running && isOnline() && worked) queueMicrotask(() => { void tick() })
    }
  }

  const onOnline = () => { void tick() }
  const onVisible = () => {
    if (typeof document === 'undefined' || document.visibilityState === 'visible') void tick()
  }

  function start() {
    if (running) return
    running = true
    timer = setInterval(() => { void tick() }, CHECK_INTERVAL_MS)
    if (typeof window !== 'undefined') window.addEventListener('online', onOnline)
    if (typeof document !== 'undefined') document.addEventListener('visibilitychange', onVisible)
    void tick()
  }

  function stop() {
    running = false
    if (timer) clearInterval(timer)
    timer = null
    if (typeof window !== 'undefined') window.removeEventListener('online', onOnline)
    if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', onVisible)
    if (controller) controller.abort()
  }

  async function enqueue(options) {
    const task = await enqueueMediaUpload({ ...options, ownerId: owner })
    notify('queued', task)
    void tick()
    return task
  }

  async function retry(id) {
    const task = await retryMediaUpload(id, owner)
    if (task) {
      notify('queued', task)
      void tick()
    }
    return task
  }

  async function remove(id) {
    const removed = await removeMediaUpload(id, owner)
    if (removed) notify('removed', { id })
    return Boolean(removed)
  }

  return {
    start,
    stop,
    enqueue,
    retry,
    remove,
    list: () => listMediaUploadTasks(owner),
    get: (id) => getMediaUploadTask(id, owner),
    isRunning: () => running,
  }
}
