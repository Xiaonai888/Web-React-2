import {
  deleteStoryMediaDraftRecord,
  loadStoryMediaDraftRecord,
  saveStoryMediaDraftRecord,
} from './storyMediaDraftDB'
import { deleteStoryMediaSnapshot } from './storyMediaDraftAssets'
import { createStoryMediaUploadQueue } from './storyMediaUploadQueue'

const INDEX_PREFIX = 'shadow:story-update:index:'
const JOB_PREFIX = 'shadow:story-update:job:'
const POLL_MS = 3000
const runtimes = new Map()

function clean(value) {
  return String(value || '').trim()
}

function userFromToken(token) {
  try {
    const middle = String(token || '').split('.')[1]
    const encoded = middle.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(encoded.padEnd(Math.ceil(encoded.length / 4) * 4, '=')))
    return clean(payload.user_id || payload.sub)
  } catch {
    return ''
  }
}

function validateRef(value) {
  if (!value) return null
  const url = clean(value.url)
  if (url) {
    if (!/^https:\/\//i.test(url)) throw new Error('Story media URL must be HTTPS')
    return { url }
  }
  const taskId = clean(value.taskId)
  if (!taskId) throw new Error('A story media upload is missing')
  return { taskId }
}

const indexKey = (owner) => `${INDEX_PREFIX}${owner}`
const jobKey = (owner, storyId) => `${JOB_PREFIX}${owner}:${storyId}`

async function loadJob(owner, storyId) {
  const job = await loadStoryMediaDraftRecord(jobKey(owner, storyId))
  return job?.ownerId === owner && job?.storyId === storyId ? job : null
}

async function listJobs(owner) {
  const index = await loadStoryMediaDraftRecord(indexKey(owner))
  const ids = Array.isArray(index?.ids) ? index.ids : []
  return (await Promise.all(ids.map((id) => loadJob(owner, id)))).filter(Boolean)
}

async function saveJob(job) {
  await saveStoryMediaDraftRecord(jobKey(job.ownerId, job.storyId), job)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('shadow-story-update-sync', {
      detail: { ownerId: job.ownerId, storyId: job.storyId, state: job.state, error: job.error || '' },
    }))
  }
  return job
}

async function resolveRef(ref, queue) {
  if (!ref) return { ready: true, url: null }
  if (ref.url) return { ready: true, url: ref.url }
  const task = await queue.get(ref.taskId)
  if (!task) return { ready: false, error: 'A locally queued story image is missing' }
  if (task.status === 'failed') return { ready: false, error: task.lastError || 'Story image upload failed' }
  if (task.status !== 'uploaded') return { ready: false }
  const url = clean(task.result?.image_url || task.result?.imageUrl)
  return /^https:\/\//i.test(url)
    ? { ready: true, url }
    : { ready: false, error: 'Uploaded story image has no valid HTTPS URL' }
}

async function resolveMedia(job, queue) {
  const cover = await resolveRef(job.media.cover, queue)
  const landscape = await resolveRef(job.media.landscape, queue)
  const slides = await Promise.all(job.media.slides.map(async (slide) => ({
    active: slide.active,
    value: await resolveRef(slide.image, queue),
  })))
  const all = [cover, landscape, ...slides.map((slide) => slide.value)]
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
        image_url: slide.value.url,
        sort_order: index,
        is_active: slide.active,
      })),
    },
  }
}

async function clearMedia(job, queue) {
  const refs = [job.media.cover, job.media.landscape, ...job.media.slides.map((slide) => slide.image)]
  for (const id of new Set(refs.map((ref) => ref?.taskId).filter(Boolean))) {
    try { await queue.remove(id) } catch {}
  }
  try { await deleteStoryMediaSnapshot(job.draftKey) } catch {}
}

async function syncOne(runtime, job) {
  const token = runtime.getToken()
  if (!token || userFromToken(token) !== runtime.ownerId) return
  if (!['pending', 'waiting_upload'].includes(job.state) || Number(job.retryAt || 0) > Date.now()) return

  if (!job.expectedUpdatedAt) {
    await saveJob({
      ...job,
      state: 'needs_review',
      error: 'Original story version is missing. Review the story before syncing this local draft.',
    })
    return
  }

  const media = await resolveMedia(job, runtime.uploadQueue)
  if (!media.ready) {
    if (job.state !== 'waiting_upload' || (job.error || '') !== (media.error || '')) {
      await saveJob({ ...job, state: 'waiting_upload', error: media.error || '' })
    }
    return
  }

  const submitting = await saveJob({ ...job, state: 'submitting', error: '', retryAt: 0 })
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 45000)
    let response
    try {
      response = await fetch(`${runtime.apiBaseUrl}/api/stories/${job.storyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...media.payload,
          expected_updated_at: job.expectedUpdatedAt,
        }),
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeout)
    }
    const data = await response.json().catch(() => ({}))
    if (!response.ok || data.ok === false) {
      await saveJob({
        ...submitting,
        state: 'needs_review',
        error: data.message || `Story update returned HTTP ${response.status}`,
      })
      return
    }
    await saveJob({ ...submitting, state: 'completed', error: '', completedAt: Date.now() })
    await clearMedia(job, runtime.uploadQueue)
  } catch (error) {
    await saveJob({
      ...submitting,
      state: 'needs_review',
      error: `Server response is unconfirmed: ${clean(error?.message) || 'Network error'}. Verify the story before retrying.`,
    })
  }
}

async function tick(runtime) {
  if (runtime.busy || (typeof navigator !== 'undefined' && navigator.onLine === false)) return
  runtime.busy = true
  try {
    const jobs = await listJobs(runtime.ownerId)
    const pending = jobs.filter((job) => ['pending', 'waiting_upload'].includes(job.state))
    if (!pending.length) {
      clearInterval(runtime.timer)
      runtime.timer = null
      runtime.uploadQueue.stop()
      runtimes.delete(runtime.ownerId)
      return
    }
    for (const job of pending) {
      if (Number(job.retryAt || 0) > Date.now()) continue
      if (typeof navigator !== 'undefined' && navigator.locks?.request) {
        await navigator.locks.request(`shadow-story-update:${job.ownerId}:${job.storyId}`, { ifAvailable: true }, async (lock) => {
          if (!lock) return
          const latest = await loadJob(job.ownerId, job.storyId)
          if (latest) await syncOne(runtime, latest)
        })
      } else {
        await syncOne(runtime, job)
      }
    }
  } catch (error) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('shadow-story-update-sync-error', {
        detail: { ownerId: runtime.ownerId, error: clean(error?.message) || 'Story sync failed' },
      }))
    }
  } finally {
    runtime.busy = false
  }
}

export function startStoryUpdateSync({ userId, getToken, apiBaseUrl }) {
  const owner = clean(userId)
  if (!owner || typeof getToken !== 'function') throw new Error('Valid story sync account is required')
  let runtime = runtimes.get(owner)
  if (!runtime) {
    runtime = {
      ownerId: owner,
      getToken,
      apiBaseUrl: clean(apiBaseUrl).replace(/\/+$/, ''),
      uploadQueue: createStoryMediaUploadQueue({ userId: owner, getToken }),
      timer: null,
      busy: false,
    }
    runtimes.set(owner, runtime)
  }
  runtime.getToken = getToken
  runtime.apiBaseUrl = clean(apiBaseUrl).replace(/\/+$/, '')
  runtime.uploadQueue.start()
  if (!runtime.timer) {
    runtime.timer = setInterval(() => { void tick(runtime) }, POLL_MS)
    void tick(runtime)
  }
}

export async function queueStoryUpdate({ userId, storyId, draftKey, payload, media, expectedUpdatedAt, getToken, apiBaseUrl }) {
  const owner = clean(userId)
  const id = clean(storyId)
  const key = clean(draftKey)
  if (!owner || !id || !key.startsWith(`${owner}:story-media:`)) throw new Error('Invalid story update scope')
  if (!payload || typeof payload !== 'object' || !media) throw new Error('Story update data is required')
  const previous = await loadJob(owner, id)
  if (previous && !['completed'].includes(previous.state)) {
    throw new Error(previous.state === 'needs_review'
      ? 'A previous story save needs review. Check the online story before saving again.'
      : 'A previous story save is still syncing. Reopen this story after it finishes.')
  }
  const job = {
    ownerId: owner,
    storyId: id,
    draftKey: key,
    state: 'pending',
    attempts: 0,
    retryAt: 0,
    expectedUpdatedAt: clean(expectedUpdatedAt),
    error: '',
    payload: { ...payload },
    media: {
      cover: validateRef(media.cover),
      landscape: validateRef(media.landscape),
      slides: (Array.isArray(media.slides) ? media.slides : []).map((slide) => ({
        image: validateRef(slide.image),
        active: Boolean(slide.active),
      })),
    },
    createdAt: Date.now(),
  }
  await saveJob(job)
  const index = await loadStoryMediaDraftRecord(indexKey(owner))
  const ids = Array.isArray(index?.ids) ? index.ids : []
  await saveStoryMediaDraftRecord(indexKey(owner), { ids: [...new Set([...ids, id])] })
  startStoryUpdateSync({ userId: owner, getToken, apiBaseUrl })
  return job
}
