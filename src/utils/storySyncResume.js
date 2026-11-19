import { listStoryCreationJobs, startStoryCreationSync } from './storyCreationSyncQueue'
import { startStoryUpdateSync } from './storyUpdateSyncQueue'
import { loadStoryMediaDraftRecord } from './storyMediaDraftDB'
import { API_BASE_URL, getAuthToken as getToken } from '../config/api'

const CHECK_INTERVAL_MS = 60000


let installed = false
let checking = false
let checkingOwner = ''
let rescanRequested = false
let lastCheckedAt = 0
let lastCheckedOwner = ''

function tokenUserId(token) {
  try {
    const middle = String(token || '').split('.')[1]
    if (!middle) return ''
    const encoded = middle.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(encoded.padEnd(Math.ceil(encoded.length / 4) * 4, '=')))
    return String(payload.user_id || payload.sub || '').trim()
  } catch {
    return ''
  }
}

async function hasPendingStoryUpdate(ownerId) {
  const index = await loadStoryMediaDraftRecord(`shadow:story-update:index:${ownerId}`)
  const ids = Array.isArray(index?.ids) ? index.ids : []
  for (const storyId of ids) {
    if (typeof storyId !== 'string' || !storyId) continue
    const job = await loadStoryMediaDraftRecord(`shadow:story-update:job:${ownerId}:${storyId}`)
    if (job?.ownerId === ownerId && job?.storyId === storyId &&
      ['pending', 'waiting_upload'].includes(job.state)) return true
  }
  return false
}

async function resumeStorySync() {
  const ownerId = tokenUserId(getToken())
  if (!ownerId) {
    lastCheckedOwner = ''
    lastCheckedAt = 0
    return
  }
  if (checking) {
    if (ownerId !== checkingOwner) rescanRequested = true
    return
  }
  const now = Date.now()
  if (ownerId === lastCheckedOwner && now - lastCheckedAt < CHECK_INTERVAL_MS) return
  checking = true
  checkingOwner = ownerId
  lastCheckedOwner = ownerId
  lastCheckedAt = now
  try {
    const [creationJobs, pendingUpdate] = await Promise.all([
      listStoryCreationJobs(ownerId),
      hasPendingStoryUpdate(ownerId),
    ])
    if (tokenUserId(getToken()) !== ownerId) return
    if (creationJobs.some((job) => ['pending', 'waiting_upload', 'submitting', 'retry_wait'].includes(job.state))) {
      startStoryCreationSync({ userId: ownerId, getToken, apiBaseUrl: API_BASE_URL })
    }
    if (pendingUpdate) {
      startStoryUpdateSync({ userId: ownerId, getToken, apiBaseUrl: API_BASE_URL })
    }
  } catch {
    lastCheckedAt = 0
  } finally {
    checking = false
    checkingOwner = ''
    if (rescanRequested) {
      rescanRequested = false
      void resumeStorySync()
    }
  }
}

export function installStorySyncResume() {
  if (installed || typeof window === 'undefined') return
  installed = true
  const resume = () => { void resumeStorySync() }
  window.addEventListener('online', resume)
  window.addEventListener('focus', resume)
  window.addEventListener('pageshow', resume)
  window.addEventListener('shadow-reader-route-change', resume)
  window.addEventListener('storage', (event) => {
    if (event.key === 'shadow_reader_token') resume()
  })
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') resume()
  })
  window.setInterval(resume, CHECK_INTERVAL_MS)
  resume()
}
