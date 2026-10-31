import { optimizeImageForUpload } from './imageUploadOptimizer'
import { createUploadQueueManager } from './uploadQueueManager'
import { readMediaUploadFile } from './uploadQueueDB'
import { uploadMediaWithFallback } from './uploadMediaWithFallback'

const CATEGORY = 'chat_story_episode'
const MAX_FILE_BYTES = 8 * 1024 * 1024
const MAX_DIRECT_BYTES = 5 * 1024 * 1024
const DIRECT_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export function chatStoryQueueUserId(token) {
  try {
    const part = String(token || '').split('.')[1]
    if (!part) return ''
    const payload = JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/')))
    return String(payload.user_id || payload.sub || '').trim()
  } catch {
    return ''
  }
}

export function chatStoryPendingImageCount(messages) {
  return (Array.isArray(messages) ? messages : []).filter(
    (message) => message?.type === 'image' && message.uploadTaskId
  ).length
}

export function createChatStoryInlineUploadQueue({ storyId, draftKey, getToken, onChange, apiBaseUrl } = {}) {
  const scopedStoryId = String(storyId || '').trim()
  const scopedDraftKey = String(draftKey || '').trim()
  const token = typeof getToken === 'function' ? getToken() : ''
  const accountId = chatStoryQueueUserId(token)

  if (!scopedStoryId || !scopedDraftKey) throw new Error('Chat Story upload scope is required')
  if (!accountId) throw new Error('Sign in before queuing Chat Story images')

  const ownerId = `${accountId}:chat-inline`
  const previews = new Map()
  let viewReleased = false
  let checkingIdle = false

  const matches = (task) => Boolean(
    task && task.ownerId === ownerId && task.category === CATEGORY &&
    task.context?.storyId === scopedStoryId &&
    task.context?.draftKey === scopedDraftKey
  )

  async function stopIfIdle() {
    if (!viewReleased || checkingIdle) return
    checkingIdle = true
    try {
      const tasks = await manager.list()
      if (!tasks.some((task) => ['queued', 'retry_wait', 'uploading'].includes(task.status))) {
        manager.stop()
      }
    } catch {
      manager.stop()
    } finally {
      checkingIdle = false
    }
  }

  const manager = createUploadQueueManager({
    ownerId,
    upload: async ({ file, signal, onProgress }) => {
      const currentToken = typeof getToken === 'function' ? getToken() : ''
      if (!currentToken || chatStoryQueueUserId(currentToken) !== accountId) {
        const error = new Error('Sign in to the original account to resume image uploads')
        error.status = 401
        throw error
      }

      let selected = file
      try {
        const optimized = await optimizeImageForUpload(file, { preset: 'post', signal })
        selected = optimized?.file || file
      } catch (error) {
        if (signal?.aborted) throw error
        if (DIRECT_TYPES.has(file.type)) {
          error.permanent = true
          throw error
        }
      }
      if (DIRECT_TYPES.has(selected.type) && selected.size > MAX_DIRECT_BYTES) {
        const error = new Error('This image is too large to upload after optimization')
        error.permanent = true
        throw error
      }

      const result = await uploadMediaWithFallback({
        file: selected,
        category: CATEGORY,
        token: currentToken,
        apiBaseUrl,
        signal,
        onProgress,
      })
      const imageUrl = String(result?.image_url || result?.imageUrl || '')
      if (!/^https?:\/\//i.test(imageUrl)) {
        const error = new Error('Image uploaded but no valid URL was returned')
        error.permanent = true
        throw error
      }
      return { image_url: imageUrl }
    },
    onChange: (event) => {
      if (!viewReleased && matches(event?.task) && typeof onChange === 'function') {
        onChange(event)
      }
      if (viewReleased && ['uploaded', 'failed', 'removed'].includes(event?.type)) {
        void stopIfIdle()
      }
    },
  })

  async function enqueue(file, messageId) {
    if (!(file instanceof Blob) || !file.type.startsWith('image/') ||
      !file.size || file.size > MAX_FILE_BYTES) {
      throw new Error('Choose an image that is 8 MB or smaller')
    }
    if (!String(messageId || '').trim()) throw new Error('Chat image message ID is required')
    return manager.enqueue({
      file,
      category: CATEGORY,
      kind: 'image',
      context: {
        storyId: scopedStoryId,
        draftKey: scopedDraftKey,
        messageId: String(messageId),
      },
    })
  }

  async function get(taskId) {
    const task = await manager.get(taskId)
    return matches(task) ? task : null
  }

  async function list() {
    return (await manager.list()).filter(matches)
  }

  async function preview(taskId) {
    const task = await get(taskId)
    if (!task) return ''
    if (task.status === 'uploaded') {
      return String(task.result?.image_url || task.result?.imageUrl || '')
    }
    if (previews.has(taskId)) return previews.get(taskId)
    const file = await readMediaUploadFile(taskId, ownerId)
    if (!file) return ''
    const url = URL.createObjectURL(file)
    previews.set(taskId, url)
    return url
  }

  async function resolve(messages) {
    const tasks = new Map((await list()).map((task) => [task.id, task]))
    const finishedIds = []
    const next = []
    for (const message of Array.isArray(messages) ? messages : []) {
      if (message?.type !== 'image' || !message.uploadTaskId) {
        next.push(message)
        continue
      }
      const task = tasks.get(message.uploadTaskId)
      const imageUrl = task?.status === 'uploaded'
        ? String(task.result?.image_url || task.result?.imageUrl || '')
        : ''
      if (/^https?:\/\//i.test(imageUrl)) {
        next.push({ ...message, imageUrl, uploadTaskId: null, uploadState: null, uploadProgress: null })
        finishedIds.push(task.id)
      } else {
        const localUrl = task ? await preview(task.id) : ''
        next.push({
          ...message,
          imageUrl: localUrl,
          uploadState: task?.status || 'failed',
          uploadProgress: Number(task?.progress || 0),
        })
      }
    }
    return { messages: next, finishedIds }
  }

  async function acknowledge(ids) {
    for (const id of Array.isArray(ids) ? ids : []) {
      const task = await get(id)
      if (task?.status !== 'uploaded') continue
      await manager.remove(id)
      const url = previews.get(id)
      if (url) URL.revokeObjectURL(url)
      previews.delete(id)
    }
  }

  async function retry(taskId) {
    if (!await get(taskId)) return null
    return manager.retry(taskId)
  }

  function stop() {
    viewReleased = true
    for (const url of previews.values()) URL.revokeObjectURL(url)
    previews.clear()
    void stopIfIdle()
  }

  return {
    start: manager.start,
    stop,
    enqueue,
    list,
    get,
    preview,
    resolve,
    acknowledge,
    retry,
    ownerId,
  }
}
