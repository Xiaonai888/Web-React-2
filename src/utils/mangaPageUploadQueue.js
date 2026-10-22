import { createUploadQueueManager } from './uploadQueueManager'
import { readMediaUploadFile, requestUploadStoragePersistence } from './uploadQueueDB'
import { MANGA_INPUT_MAX_BYTES, optimizeMangaImage, uploadMangaPageFile, validateMangaFile } from './mangaImageUtils'

const CATEGORY = 'manga_episode_page'
const UNCERTAIN_MARKER = '[MANGA_UPLOAD_UNCERTAIN]'

function tokenUserId(token) {
  try {
    const segment = String(token || '').split('.')[1]
    if (!segment) return ''
    const encoded = segment.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(encoded.padEnd(Math.ceil(encoded.length / 4) * 4, '=')))
    return String(payload.user_id || payload.sub || '').trim()
  } catch {
    return ''
  }
}

function fileFingerprint(file) {
  return JSON.stringify([
    String(file.name || ''),
    Number(file.size || 0),
    String(file.type || ''),
    Number(file.lastModified || 0),
  ])
}

function uncertainUpload(error) {
  const message = String(error?.message || '')
  return error?.stage === 'finalize' ||
    /MANGA_PROCESSING_TIMEOUT|MANGA_JOB_ID_MISSING|IMAGE_URL_MISSING|IMAGE_REQUEST_FAILED|IMAGE_UPLOAD_INTERRUPTED|MANGA_DIRECT_JOB_MISSING/.test(message)
}

export function createMangaPageUploadQueue({ storyId, draftKey, getToken, onChange } = {}) {
  const story = String(storyId || '').trim()
  const draft = String(draftKey || '').trim()
  const token = typeof getToken === 'function' ? getToken() : ''
  const accountId = tokenUserId(token)

  if (!story || !draft) throw new Error('Manga story and draft are required')
  if (!accountId) throw new Error('Sign in before queuing Manga pages')

  const ownerId = `${accountId}:manga:${story}:${draft}`
  const pendingEnqueues = new Map()
  const previews = new Map()
  const matches = (task) => Boolean(
    task?.ownerId === ownerId && task.category === CATEGORY &&
    task.context?.storyId === story && task.context?.draftKey === draft
  )

  function requireCurrentAccount() {
    const currentToken = typeof getToken === 'function' ? getToken() : ''
    if (!currentToken || tokenUserId(currentToken) !== accountId) {
      const error = new Error('Sign in to the original account to resume Manga uploads')
      error.status = 401
      throw error
    }
    return currentToken
  }

  const manager = createUploadQueueManager({
    ownerId,
    maxAttempts: 6,
    upload: async ({ task, file, signal, onProgress }) => {
      const currentToken = requireCurrentAccount()
      if (!matches(task)) {
        const error = new Error('This Manga file belongs to another draft')
        error.permanent = true
        throw error
      }

      try {
        const uploaded = await uploadMangaPageFile({
          token: currentToken,
          file,
          signal,
          onProgress,
          useV2: true,
        })
        if (!/^https:\/\//i.test(String(uploaded?.imageUrl || ''))) {
          const error = new Error('Manga processing returned no valid image URL')
          error.permanent = true
          throw error
        }
        if (tokenUserId(getToken()) !== accountId) {
          const error = new Error('Account changed before the Manga upload completed')
          error.status = 401
          throw error
        }
        return {
          imageUrl: uploaded.imageUrl,
          storagePath: uploaded.storagePath || null,
          width: uploaded.width || task.context.width || null,
          height: uploaded.height || task.context.height || null,
          fileSize: uploaded.fileSize || file.size,
          mimeType: uploaded.mimeType || file.type,
          parts: Array.isArray(uploaded.parts) ? uploaded.parts : [],
        }
      } catch (error) {
        if (!signal.aborted && uncertainUpload(error)) {
          error.permanent = true
          error.message = `${UNCERTAIN_MARKER} ${String(error.message || 'Manga upload status is unknown')}`
        }
        throw error
      }
    },
    onChange: (event) => {
      if (tokenUserId(getToken()) === accountId && matches(event?.task) && typeof onChange === 'function') onChange(event)
    },
  })

  async function list() {
    requireCurrentAccount()
    return (await manager.list()).filter(matches)
  }

  async function get(taskId) {
    requireCurrentAccount()
    const task = await manager.get(taskId)
    return matches(task) ? task : null
  }

  async function enqueue({ file, pageId, revisionId = 'initial', position = null } = {}) {
    requireCurrentAccount()
    const page = String(pageId || '').trim()
    const revision = String(revisionId || '').trim()
    if (!page || !revision) throw new Error('Manga page and revision IDs are required')
    const validation = validateMangaFile(file)
    if (validation) throw new Error(validation)
    if (file.size > MANGA_INPUT_MAX_BYTES) throw new Error('Manga page must be 5 MB or smaller')

    const fingerprint = fileFingerprint(file)
    const dedupeKey = JSON.stringify([page, revision])
    if (pendingEnqueues.has(dedupeKey)) return pendingEnqueues.get(dedupeKey)

    const operation = (async () => {
      const previous = (await list()).find((task) =>
        task.context?.pageId === page && task.context?.revisionId === revision
      )
      if (previous) {
        if (previous.context?.fingerprint !== fingerprint) {
          throw new Error('Use a new revision ID when replacing a Manga page')
        }
        return previous
      }

      const optimized = await optimizeMangaImage(file)
      requireCurrentAccount()
      const prepared = optimized?.file
      if (!(prepared instanceof Blob) || !prepared.size || prepared.size > MANGA_INPUT_MAX_BYTES) {
        throw new Error('Manga optimization did not produce a valid file')
      }
      const selected = prepared instanceof File ? prepared : new File(
        [prepared], String(file.name || `manga-${page}`),
        { type: String(prepared.type || file.type || 'application/octet-stream') }
      )
      void requestUploadStoragePersistence()
      return manager.enqueue({
        file: selected,
        category: CATEGORY,
        kind: 'image',
        context: {
          storyId: story,
          draftKey: draft,
          pageId: page,
          revisionId: revision,
          position: Number.isInteger(position) && position >= 0 ? position : null,
          fingerprint,
          width: optimized.width || null,
          height: optimized.height || null,
        },
      })
    })()

    pendingEnqueues.set(dedupeKey, operation)
    try {
      return await operation
    } finally {
      if (pendingEnqueues.get(dedupeKey) === operation) pendingEnqueues.delete(dedupeKey)
    }
  }

  async function preview(taskId) {
    const task = await get(taskId)
    if (!task || task.status === 'uploaded') return ''
    if (previews.has(task.id)) return previews.get(task.id)
    const file = await readMediaUploadFile(task.id, ownerId)
    if (!file) return ''
    const url = URL.createObjectURL(file)
    previews.set(task.id, url)
    return url
  }

  async function restore() {
    const tasks = await list()
    return Promise.all(tasks.map(async (task) => ({
      ...task,
      previewUrl: task.status === 'uploaded'
        ? String(task.result?.imageUrl || '')
        : await preview(task.id),
    })))
  }

  async function retry(taskId) {
    requireCurrentAccount()
    const task = await get(taskId)
    if (!task) return null
    if (String(task.lastError || '').includes(UNCERTAIN_MARKER)) {
      throw new Error('Manga processing status is uncertain. Verify the upload before retrying to avoid duplicates')
    }
    return manager.retry(taskId)
  }

  async function remove(taskId) {
    requireCurrentAccount()
    if (!await get(taskId)) return false
    const removed = await manager.remove(taskId)
    if (removed) {
      const url = previews.get(taskId)
      if (url) URL.revokeObjectURL(url)
      previews.delete(taskId)
    }
    return removed
  }

  async function acknowledge(taskIds) {
    requireCurrentAccount()
    for (const id of Array.isArray(taskIds) ? taskIds : []) {
      const task = await get(id)
      if (task?.status === 'uploaded') await remove(id)
    }
  }

  function stop() {
    manager.stop()
    for (const url of previews.values()) URL.revokeObjectURL(url)
    previews.clear()
  }

  return {
    start: manager.start,
    stop,
    enqueue,
    list,
    get,
    restore,
    preview,
    retry,
    remove,
    acknowledge,
    ownerId,
  }
}
