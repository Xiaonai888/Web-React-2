import {
  loadStoryMediaDraftRecord,
  saveStoryMediaDraftRecord,
  deleteStoryMediaDraftRecord,
} from './storyMediaDraftDB'
import { createStoryMediaUploadQueue } from './storyMediaUploadQueue'

const runtimes = new Map()
const INDEX_PREFIX = 'shadow:story-create:index:'
const JOB_PREFIX = 'shadow:story-create:job:'
const POLL_MS = 3000
const MAX_RETRY_MS = 300000
const UUID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i

function isIdempotentJob(job) {
  return job?.requestIdVersion === 1 && UUID_PATTERN.test(String(job.id || ''))
}

function shouldProcessJob(job) {
  if (['pending', 'waiting_upload'].includes(job.state)) {
    return !isIdempotentJob(job) || Number(job.retryAt || 0) <= Date.now()
  }
  if (!isIdempotentJob(job)) return false
  if (job.state === 'submitting') return true
  return job.state === 'retry_wait' && Number(job.retryAt || 0) <= Date.now()
}

function shouldKeepWorker(job) {
  return ['pending', 'waiting_upload'].includes(job.state) ||
    (isIdempotentJob(job) && ['submitting', 'retry_wait'].includes(job.state))
}

function isRetryableHttp(status) {
  return [408, 409, 425, 429].includes(status) || status >= 500
}

async function deferIdempotentJob(job, error) {
  const attempts = Math.max(0, Number(job.attempts) || 0) + 1
  const wait = Math.min(MAX_RETRY_MS, 3000 * 2 ** Math.min(7, Math.max(0, attempts - 1)))
  await saveJob({
    ...job,
    state: 'pending',
    attempts,
    retryAt: Date.now() + wait,
    error: String(error || 'Server save will retry automatically'),
  })
}

function userFromToken(token) {
  try {
    const raw = String(token || '').split('.')[1]
    const base64 = raw.replace(/-/g, '+').replace(/_/g, '/')
    const claims = JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')))
    return String(claims.user_id || claims.sub || '')
  } catch {
    return ''
  }
}

function requiredText(value, label) {
  const result = String(value || '').trim()
  if (!result) throw new Error(`${label} is required`)
  return result
}

function validRef(value) {
  if (!value) return null
  if (typeof value !== 'object') throw new Error('Invalid story media reference')
  const url = String(value.url || '').trim()
  const taskId = String(value.taskId || '').trim()
  if (url) {
    if (!/^https:\/\//i.test(url)) throw new Error('Story media URL must use HTTPS')
    return { url }
  }
  if (!taskId) throw new Error('Story media must have an uploaded URL or local task ID')
  return { taskId }
}

function jobKey(id) {
  return `${JOB_PREFIX}${requiredText(id, 'Story job ID')}`
}

function indexKey(ownerId) {
  return `${INDEX_PREFIX}${requiredText(ownerId, 'Owner ID')}`
}

async function listIds(ownerId) {
  const record = await loadStoryMediaDraftRecord(indexKey(ownerId))
  return Array.isArray(record?.ids) ? record.ids.filter((id) => typeof id === 'string') : []
}

async function saveJob(job) {
  await saveStoryMediaDraftRecord(jobKey(job.id), job)
  window.dispatchEvent(new CustomEvent('shadow-story-create-sync', {
    detail: { id: job.id, ownerId: job.ownerId, state: job.state, storyId: job.storyId || '' },
  }))
  return job
}

export async function getStoryCreationJob(id, ownerId) {
  const record = await loadStoryMediaDraftRecord(jobKey(id))
  return record?.ownerId === String(ownerId || '') ? record : null
}

export async function listStoryCreationJobs(ownerId) {
  const ids = await listIds(ownerId)
  const jobs = await Promise.all(ids.map((id) => getStoryCreationJob(id, ownerId)))
  return jobs.filter(Boolean)
}

async function resolveRef(ref, queue) {
  if (!ref) return { ready: true, url: null }
  if (ref.url) return { ready: true, url: ref.url }
  const task = await queue.get(ref.taskId)
  if (!task) return { ready: false, error: 'Story image upload task is missing' }
  if (task.status === 'failed') return {
    ready: false,
    error: task.lastError || 'Story image upload failed',
  }
  if (task.status !== 'uploaded') return { ready: false }
  const url = String(task.result?.image_url || '').trim()
  if (!/^https:\/\//i.test(url)) return { ready: false, error: 'Story image URL is invalid' }
  return { ready: true, url }
}

async function resolveMedia(job, queue) {
  const cover = await resolveRef(job.media.cover, queue)
  const landscape = await resolveRef(job.media.landscape, queue)
  const slides = await Promise.all(job.media.slides.map(async (slide) => ({
    ...slide,
    resolved: await resolveRef(slide.image, queue),
  })))
  const all = [cover, landscape, ...slides.map((slide) => slide.resolved)]
  const error = all.find((item) => item.error)?.error
  if (error) return { ready: false, error }
  if (all.some((item) => !item.ready)) return { ready: false }
  return {
    ready: true,
    payload: {
      ...job.payload,
      cover_url: cover.url,
      landscape_thumbnail_url: landscape.url,
      slides: slides.map((slide, index) => ({
        image_url: slide.resolved.url,
        sort_order: index,
        is_active: slide.active,
      })),
    },
  }
}

function runtimeFor(ownerId, getToken, apiBaseUrl) {
  let runtime = runtimes.get(ownerId)
  if (runtime) {
    runtime.getToken = getToken
    runtime.apiBaseUrl = apiBaseUrl
    return runtime
  }
  runtime = {
    ownerId,
    getToken,
    apiBaseUrl,
    timer: null,
    busy: false,
    uploadQueue: createStoryMediaUploadQueue({ userId: ownerId, getToken }),
  }
  runtimes.set(ownerId, runtime)
  return runtime
}

async function syncOne(runtime, job) {
  if (!shouldProcessJob(job)) return
  const token = runtime.getToken()
  if (!token || userFromToken(token) !== runtime.ownerId) return
  const media = job.submittedPayload
    ? { ready: true, payload: job.submittedPayload }
    : await resolveMedia(job, runtime.uploadQueue)
  if (media.error) {
    if (job.state !== 'waiting_upload' || job.error !== media.error) {
      await saveJob({ ...job, state: 'waiting_upload', error: media.error })
    }
    return
  }
  if (!media.ready) {
    if (job.state !== 'waiting_upload') {
      await saveJob({ ...job, state: 'waiting_upload', error: '' })
    }
    return
  }
  const requestId = isIdempotentJob(job) ? job.id : null
  const payload = requestId
    ? { ...media.payload, create_request_id: requestId }
    : media.payload
  const submitting = await saveJob({
    ...job,
    state: requestId ? 'pending' : 'submitting',
    submittedPayload: media.payload,
    error: '',
    submittedAt: Date.now(),
    retryAt: 0,
  })
  try {
    const response = await fetch(`${runtime.apiBaseUrl}/api/stories/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
    const data = await response.json().catch(() => ({}))
    const storyId = String(data.story?.id || '').trim()
    if (response.ok && data.ok !== false && storyId) {
      await saveJob({ ...submitting, state: 'created', storyId, error: '', completedAt: Date.now() })
      return
    }
    const reason = data.message || `Story creation returned HTTP ${response.status}`
    if (requestId && (isRetryableHttp(response.status) || (response.ok && !storyId))) {
      await deferIdempotentJob(submitting, reason)
      return
    }
    await saveJob({
      ...submitting,
      state: 'needs_review',
      error: reason,
    })
  } catch (error) {
    const reason = `Story creation response was not confirmed: ${error?.message || 'Network error'}`
    if (requestId) {
      await deferIdempotentJob(submitting, reason)
      return
    }
    await saveJob({
      ...submitting,
      state: 'needs_review',
      error: `${reason}. Check for an existing story before retrying.`,
    })
  }
}

async function tick(runtime) {
  if (runtime.busy || (typeof navigator !== 'undefined' && navigator.onLine === false)) return
  runtime.busy = true
  try {
    const jobs = await listStoryCreationJobs(runtime.ownerId)
    if (!jobs.some(shouldKeepWorker)) {
      clearInterval(runtime.timer)
      runtime.timer = null
      runtime.uploadQueue.stop()
      runtimes.delete(runtime.ownerId)
      return
    }
    for (const job of jobs) {
      if (!shouldProcessJob(job)) continue
      const run = () => syncOne(runtime, job)
      if (typeof navigator !== 'undefined' && navigator.locks?.request) {
        await navigator.locks.request(`shadow-story-create:${job.id}`, { ifAvailable: true }, async (lock) => {
          if (!lock) return
          const current = await getStoryCreationJob(job.id, runtime.ownerId)
          if (current && shouldProcessJob(current)) await syncOne(runtime, current)
        })
      } else {
        await run()
      }
    }
  } catch (error) {
    window.dispatchEvent(new CustomEvent('shadow-story-create-sync-error', {
      detail: { ownerId: runtime.ownerId, error: error?.message || String(error) },
    }))
  } finally {
    runtime.busy = false
  }
}

export function startStoryCreationSync({ userId, getToken, apiBaseUrl }) {
  const ownerId = requiredText(userId, 'Owner ID')
  if (typeof getToken !== 'function') throw new Error('Token provider is required')
  const base = requiredText(apiBaseUrl, 'API URL').replace(/\/+$/, '')
  const runtime = runtimeFor(ownerId, getToken, base)
  runtime.uploadQueue.start()
  if (!runtime.timer) {
    runtime.timer = setInterval(() => { void tick(runtime) }, POLL_MS)
    void tick(runtime)
  }
  return () => { void tick(runtime) }
}

export async function queueStoryCreation({ userId, draftKey, payload, media, getToken, apiBaseUrl }) {
  const ownerId = requiredText(userId, 'Owner ID')
  const key = requiredText(draftKey, 'Draft key')
  if (!key.startsWith(`${ownerId}:story-media:`)) throw new Error('Story draft account does not match')
  if (!payload || typeof payload !== 'object') throw new Error('Story details are required')
  if (!media || !media.cover) throw new Error('Story cover must be saved locally first')
  const existing = (await listStoryCreationJobs(ownerId)).find((job) => job.draftKey === key)
  if (existing) {
    startStoryCreationSync({ userId: ownerId, getToken, apiBaseUrl })
    return existing
  }
  const id = crypto.randomUUID()
  const job = {
    id,
    ownerId,
    draftKey: key,
    state: 'pending',
    requestIdVersion: 1,
    attempts: 0,
    storyId: '',
    error: '',
    payload: { ...payload },
    media: {
      cover: validRef(media.cover),
      landscape: validRef(media.landscape),
      slides: (Array.isArray(media.slides) ? media.slides : []).map((slide) => ({
        image: validRef(slide.image),
        active: Boolean(slide.active),
      })),
    },
    createdAt: Date.now(),
  }
  await saveJob(job)
  const ids = await listIds(ownerId)
  await saveStoryMediaDraftRecord(indexKey(ownerId), { ids: [...new Set([...ids, id])] })
  startStoryCreationSync({ userId: ownerId, getToken, apiBaseUrl })
  return job
}

export async function clearCompletedStoryCreation(id, ownerId) {
  const job = await getStoryCreationJob(id, ownerId)
  if (!job || job.state !== 'created') return false
  const ids = await listIds(ownerId)
  await saveStoryMediaDraftRecord(indexKey(ownerId), { ids: ids.filter((item) => item !== id) })
  await deleteStoryMediaDraftRecord(jobKey(id))
  return true
}
