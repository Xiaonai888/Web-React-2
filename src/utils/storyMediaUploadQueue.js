import { optimizeImageForUpload } from './imageUploadOptimizer'
import { createUploadQueueManager } from './uploadQueueManager'
import { uploadMediaWithFallback } from './uploadMediaWithFallback'

const CATEGORIES = Object.freeze({
  cover: 'story_cover',
  landscape: 'story_landscape_thumbnail',
  slide: 'story_slide',
})
const DIRECT_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_DIRECT_BYTES = 5 * 1024 * 1024
const activeRuntimes = new Map()

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

function createRuntime(ownerId, owner, getToken) {
  const listeners = new Set()
  const categories = Object.values(CATEGORIES)
  const scopePrefix = `${ownerId}:`
  const runtime = {
    clients: 0,
    processingEnqueues: 0,
    version: 0,
    getToken,
    listeners,
    pendingEnqueues: new Map(),
    manager: null,
    stopWhenIdle: null,
  }
  const validDraftKey = (value) => String(value || '').trim().startsWith(scopePrefix)

  runtime.stopWhenIdle = async () => {
    if (runtime.clients !== 0 || runtime.processingEnqueues !== 0) return
    const version = runtime.version
    let tasks
    try {
      tasks = await runtime.manager.list()
    } catch {
      return
    }
    if (runtime.clients !== 0 || runtime.processingEnqueues !== 0 || runtime.version !== version) return
    if (tasks.some((task) => !['uploaded', 'failed'].includes(task.status))) return
    runtime.manager.stop()
    if (activeRuntimes.get(ownerId) === runtime) activeRuntimes.delete(ownerId)
  }

  runtime.manager = createUploadQueueManager({
    ownerId,
    onChange: (event) => {
      for (const listener of listeners) {
        try { listener(event) } catch {}
      }
      if (runtime.clients === 0 && ['uploaded', 'failed', 'removed'].includes(event.type)) {
        void runtime.stopWhenIdle()
      }
    },
    upload: async ({ task, file, signal, onProgress }) => {
      const token = runtime.getToken()
      if (!token || tokenUserId(token) !== owner) {
        const error = new Error('Sign in to the correct account to resume uploading')
        error.status = 401
        throw error
      }
      if (!categories.includes(task.category) || !validDraftKey(task.context?.draftKey)) {
        const error = new Error('This image upload does not belong to the active story account')
        error.permanent = true
        throw error
      }
      const data = await uploadMediaWithFallback({
        file,
        token,
        category: task.category,
        signal,
        onProgress,
      })
      const imageUrl = String(data?.image_url || data?.imageUrl || '').trim()
      if (!/^https?:\/\//i.test(imageUrl)) {
        const error = new Error('Story media upload finished without a usable image URL')
        error.permanent = true
        throw error
      }
      return { image_url: imageUrl }
    },
  })

  runtime.validDraftKey = validDraftKey
  return runtime
}

export function createStoryMediaUploadQueue({ userId, getToken, onChange } = {}) {
  const owner = String(userId || '').trim()
  if (!owner) throw new Error('Signed-in user ID is required')
  if (typeof getToken !== 'function') throw new Error('An authentication provider is required')

  const ownerId = `${owner}:story-media`
  let runtime = activeRuntimes.get(ownerId)
  if (!runtime) {
    runtime = createRuntime(ownerId, owner, getToken)
    activeRuntimes.set(ownerId, runtime)
  }
  runtime.getToken = getToken
  const manager = runtime.manager
  let active = false

  const start = () => {
    if (!active) {
      active = true
      runtime.clients += 1
      if (typeof onChange === 'function') runtime.listeners.add(onChange)
    }
    runtime.version += 1
    manager.start()
  }

  const stop = () => {
    if (!active) return
    active = false
    runtime.clients = Math.max(0, runtime.clients - 1)
    if (typeof onChange === 'function') runtime.listeners.delete(onChange)
    runtime.version += 1
    void runtime.stopWhenIdle()
  }

  const enqueue = async ({ file, draftKey, slot, imageId = '' }) => {
    const category = CATEGORIES[slot]
    if (!category) throw new Error('Invalid story media slot')
    const scope = String(draftKey || '').trim()
    if (!runtime.validDraftKey(scope)) throw new Error('Story media draft belongs to a different account')
    if (!(file instanceof Blob) || !file.size || !String(file.type).startsWith('image/')) {
      throw new Error('A valid story image is required')
    }
    const identity = String(imageId || '').trim()
    const dedupeKey = identity ? JSON.stringify([scope, slot, identity]) : ''
    if (dedupeKey && runtime.pendingEnqueues.has(dedupeKey)) {
      return runtime.pendingEnqueues.get(dedupeKey)
    }

    runtime.version += 1
    runtime.processingEnqueues += 1
    manager.start()
    const operation = (async () => {
      if (identity) {
        const existing = (await manager.list()).find((task) =>
          task.category === category && task.context?.draftKey === scope &&
          task.context?.slot === slot && task.context?.imageId === identity
        )
        if (existing) return existing
      }
      const selected = file instanceof File ? file : new File(
        [file], `${slot}-${Date.now()}.${file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'}`,
        { type: file.type },
      )
      const optimized = await optimizeImageForUpload(selected, {
        preset: slot === 'cover' ? 'cover' : slot === 'landscape' ? 'thumbnail' : 'banner',
      })
      const prepared = optimized?.file
      if (!(prepared instanceof Blob) || !prepared.size) throw new Error('Image optimization failed')
      if (DIRECT_TYPES.has(prepared.type) && prepared.size > MAX_DIRECT_BYTES) {
        throw new Error('This image exceeds the 5 MB upload limit after compression')
      }
      return manager.enqueue({
        file: prepared,
        category,
        kind: 'image',
        context: { draftKey: scope, slot, imageId: identity },
      })
    })()

    if (dedupeKey) runtime.pendingEnqueues.set(dedupeKey, operation)
    try {
      return await operation
    } finally {
      runtime.processingEnqueues -= 1
      if (dedupeKey && runtime.pendingEnqueues.get(dedupeKey) === operation) {
        runtime.pendingEnqueues.delete(dedupeKey)
      }
      if (runtime.clients === 0) void runtime.stopWhenIdle()
    }
  }

  return {
    start,
    stop,
    enqueue,
    retry: async (id) => {
      runtime.version += 1
      manager.start()
      return manager.retry(id)
    },
    remove: async (id) => {
      const removed = await manager.remove(id)
      if (runtime.clients === 0) void runtime.stopWhenIdle()
      return removed
    },
    get: manager.get,
    listForDraft: async (draftKey) => {
      const scope = String(draftKey || '').trim()
      if (!runtime.validDraftKey(scope)) return []
      return (await manager.list()).filter((task) =>
        task.context?.draftKey === scope && Object.values(CATEGORIES).includes(task.category)
      )
    },
  }
}
