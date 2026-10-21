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

export function createStoryMediaUploadQueue({ userId, getToken, onChange } = {}) {
  const owner = String(userId || '').trim()
  if (!owner) throw new Error('Signed-in user ID is required')
  if (typeof getToken !== 'function') throw new Error('An authentication provider is required')

  const ownerId = `${owner}:story-media`
  const scopePrefix = `${ownerId}:`
  const categories = Object.values(CATEGORIES)
  const pendingEnqueues = new Map()
  const validDraftKey = (value) => String(value || '').trim().startsWith(scopePrefix)

  const manager = createUploadQueueManager({
    ownerId,
    onChange,
    upload: async ({ task, file, signal, onProgress }) => {
      const token = getToken()
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

  async function enqueue({ file, draftKey, slot, imageId = '' }) {
    const category = CATEGORIES[slot]
    if (!category) throw new Error('Invalid story media slot')
    const scope = String(draftKey || '').trim()
    if (!validDraftKey(scope)) throw new Error('Story media draft belongs to a different account')
    if (!(file instanceof Blob) || !file.size || !String(file.type).startsWith('image/')) {
      throw new Error('A valid story image is required')
    }
    const identity = String(imageId || '').trim()
    const dedupeKey = identity ? JSON.stringify([scope, slot, identity]) : ''
    if (dedupeKey && pendingEnqueues.has(dedupeKey)) return pendingEnqueues.get(dedupeKey)

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

    if (dedupeKey) pendingEnqueues.set(dedupeKey, operation)
    try {
      return await operation
    } finally {
      if (dedupeKey && pendingEnqueues.get(dedupeKey) === operation) pendingEnqueues.delete(dedupeKey)
    }
  }

  return {
    start: manager.start,
    stop: manager.stop,
    enqueue,
    retry: manager.retry,
    remove: manager.remove,
    get: manager.get,
    listForDraft: async (draftKey) => {
      const scope = String(draftKey || '').trim()
      if (!validDraftKey(scope)) return []
      return (await manager.list()).filter((task) =>
        task.context?.draftKey === scope && categories.includes(task.category)
      )
    },
  }
}
