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
  if (!['pending', 'waiting_upload'].includes(job.state)) return
  const token = runtime.getToken()
  if (!token || userFromToken(token) !== runtime.ownerId) return
  const media = await resolveMedia(job, runtime.uploadQueue)
  if (media.error) {
    if (job.state !== 'waiting_upload' || job.error !== media.error) {
      await saveJob({ ...job, state: 'waiting_upload', error: media.error })
    }
    return
  }
  if (!media.ready) {
    if (job.state !== 'waiting_upload') await saveJob({ ...job, state: 'waiting_upload', error: '' })
    return
  }
  const submitting = await saveJob({ ...job, state: 'submitting', error: '', submittedAt: Date.now() })
  try {
    const response = await fetch(`${runtime.apiBaseUrl}/api/stories/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(media.payload),
    })
    const data = await response.json().catch(() => ({}))
    const storyId = String(data.story?.id || '').trim()
    if (response.ok && data.ok !== false && storyId) {
      await saveJob({ ...submitting, state: 'created', storyId, error: '', completedAt: Date.now() })
      return
    }
    await saveJob({
      ...submitting,
      state: 'needs_review',
      error: data.message || `Story creation returned HTTP ${response.status}. Check before retrying.`,
    })
  } catch (error) {
    await saveJob({
      ...submitting,
      state: 'needs_review',
      error: `Story creation response was not confirmed: ${error?.message || 'Network error'}. Check for an existing story before retrying.`,
    })
  }
}

async function tick(runtime) {
  if (runtime.busy || (typeof navigator !== 'undefined' && navigator.onLine === false)) return
  runtime.busy = true
  try {
    const jobs = await listStoryCreationJobs(runtime.ownerId)
    if (!jobs.some((job) => ['pending', 'waiting_upload'].includes(job.state))) {
      clearInterval(runtime.timer)
      runtime.timer = null
      runtime.uploadQueue.stop()
      runtimes.delete(runtime.ownerId)
      return
    }
    for (const job of jobs) {
      if (!['pending', 'waiting_upload'].includes(job.state)) continue
      const run = () => syncOne(runtime, job)
      if (typeof navigator !== 'undefined' && navigator.locks?.request) {
        await navigator.locks.request(`shadow-story-create:${job.id}`, { ifAvailable: true }, async (lock) => {
          if (!lock) return
          const current = await getStoryCreationJob(job.id, runtime.ownerId)
          if (current && ['pending', 'waiting_upload'].includes(current.state)) await syncOne(runtime, current)
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
