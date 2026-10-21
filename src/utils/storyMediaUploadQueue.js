import { optimizeImageForUpload } from './imageUploadOptimizer'
import { createUploadQueueManager } from './uploadQueueManager'
import { uploadMediaWithFallback } from './uploadMediaWithFallback'

const CATEGORIES = Object.freeze({
  cover: 'story_cover',
  landscape: 'story_landscape_thumbnail',
  slide: 'story_slide',
})

function tokenUserId(token) {
  try {
    const middle = String(token || '').split('.')[1]
    if (!middle) return ''
    const payload = JSON.parse(atob(middle.replace(/-/g, '+').replace(/_/g, '/')))
    return String(payload.user_id || '').trim()
  } catch {
    return ''
  }
}

export function createStoryMediaUploadQueue({ userId, getToken, onChange } = {}) {
  const owner = String(userId || '').trim()
  if (!owner) throw new Error('Signed-in user ID is required')
  if (typeof getToken !== 'function') throw new Error('An authentication provider is required')

  const manager = createUploadQueueManager({
    ownerId: `${owner}:story-media`,
    onChange,
    upload: async ({ task, file, signal, onProgress }) => {
      const token = getToken()
      if (!token || tokenUserId(token) !== owner) {
        const error = new Error('Sign in to the correct account to resume uploading')
        error.status = 401
        throw error
      }
      const data = await uploadMediaWithFallback({
        file,
        token,
        category: task.category,
        signal,
        onProgress,
      })
      const imageUrl = data?.image_url || data?.imageUrl || ''
      if (!/^https?:\/\//i.test(imageUrl)) {
        throw new Error('Story media upload finished without a usable image URL')
      }
      return { image_url: imageUrl }
    },
  })

  async function enqueue({ file, draftKey, slot, imageId = '' }) {
    const category = CATEGORIES[slot]
    if (!category) throw new Error('Invalid story media slot')
    if (!(file instanceof Blob) || !file.size) throw new Error('A valid story image is required')
    const selected = file instanceof File
      ? file
      : new File([file], `${slot}-${Date.now()}.jpg`, { type: file.type || 'image/jpeg' })
    const optimized = await optimizeImageForUpload(selected, {
      preset: slot === 'cover' ? 'cover' : slot === 'landscape' ? 'thumbnail' : 'banner',
    })
    return manager.enqueue({
      file: optimized.file,
      category,
      kind: 'image',
      context: {
        draftKey: String(draftKey || ''),
        slot,
        imageId: String(imageId || ''),
      },
    })
  }

  return {
    start: manager.start,
    stop: manager.stop,
    enqueue,
    retry: manager.retry,
    remove: manager.remove,
    get: manager.get,
    listForDraft: async (draftKey) => (await manager.list()).filter((task) =>
      task.context?.draftKey === String(draftKey || '') &&
      Object.values(CATEGORIES).includes(task.category)
    ),
  }
}
