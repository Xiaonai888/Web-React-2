import { createUploadQueueManager } from './uploadQueueManager'
import { readMediaUploadFile, requestUploadStoragePersistence } from './uploadQueueDB'
import { MANGA_INPUT_MAX_BYTES, optimizeMangaImage, uploadMangaPageFile, validateMangaFile } from './mangaImageUtils'

const CATEGORY = 'manga_episode_page'
const UNCERTAIN_MARKER = '[MANGA_UPLOAD_UNCERTAIN]'
const DIAGNOSTIC_EVENT = 'shadow-manga-upload-diagnostic'

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
    /MANGA_PROCESSING_TIMEOUT|MANGA_JOB_ID_MISSING|IMAGE_URL_MISSING|IMAGE_REQUEST_FAILED|IMAGE_UPLOAD_INTERRUPTED|IMAGE_UPLOAD_TIMEOUT|MANGA_DIRECT_JOB_MISSING/.test(message)
}

function diagnosticFromError(error, fallbackStage = 'upload') {
  const message = String(error?.message || 'Manga upload failed').slice(0, 420)
  const marker = message.match(/\[([a-z][a-z\d_-]*):\s*([A-Z\d_]+)\]/i)
  const code = String(error?.code || marker?.[2] || 'MANGA_UPLOAD_FAILED').replace(/[^A-Z\d_]/gi, '').slice(0, 90)
  const stage = String(error?.stage || marker?.[1] || fallbackStage).replace(/[^a-z\d_-]/gi, '').slice(0, 40)
  const uncertain = message.includes(UNCERTAIN_MARKER) || uncertainUpload(error)
  return { stage, code, message, uncertain }
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
  const recentDiagnostics = new Map()
  const matches = (task) => Boolean(
    task?.ownerId === ownerId && task.category === CATEGORY &&
    task.context?.storyId === story && task.context?.draftKey === draft
  )

  function notifyDiagnostic(task, details = {}) {
    if (!matches(task) || typeof window === 'undefined' || typeof CustomEvent !== 'function') return
    const pageId = String(task.context?.pageId || '')
    if (!pageId) return
    const stage = String(details.stage || 'queue')
    const status = String(details.status || 'working')
    const progress = Number.isFinite(Number(details.progress))
      ? Math.max(0, Math.min(100, Math.round(Number(details.progress))))
      : null
    const now = Date.now()
    const last = recentDiagnostics.get(pageId)
    if (status === 'working' && last?.stage === stage && now - last.at < 1000 &&
      (progress === null || progress === last.progress)) return
    recentDiagnostics.set(pageId, { stage, progress, at: now })
    window.dispatchEvent(new CustomEvent(DIAGNOSTIC_EVENT, {
      detail: {
        pageId,
        taskId: String(task.id || ''),
        stage,
        status,
        progress,
        code: String(details.code || '').slice(0, 90),
        message: String(details.message || '').slice(0, 420),
        uncertain: Boolean(details.uncertain),
        at: now,
      },
    }))
  }

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

      let stage = 'prepare'
      try {
        if (signal.aborted) throw new DOMException('Upload interrupted', 'AbortError')
        notifyDiagnostic(task, { stage, message: 'Reading and preparing image' })

        let prepared
        const previousWidth = Number(task.context?.width || 0)
        const previousHeight = Number(task.context?.height || 0)
        if (previousWidth > 0 && previousHeight > 0) {
          prepared = { file, width: previousWidth, height: previousHeight }
        } else {
          try {
            prepared = await optimizeMangaImage(file)
          } catch (error) {
            if (!signal.aborted) error.permanent = true
            throw error
          }
        }
        const selected = prepared?.file
        if (!(selected instanceof Blob) || !selected.size || selected.size > MANGA_INPUT_MAX_BYTES) {
          const error = new Error('Manga optimization did not produce a valid file')
          error.permanent = true
          throw error
        }
        if (signal.aborted) throw new DOMException('Upload interrupted', 'AbortError')

        stage = 'init'
        notifyDiagnostic(task, { stage, message: 'Requesting a signed upload session from Backend' })
        const uploaded = await uploadMangaPageFile({
          token: requireCurrentAccount(),
          file: selected,
          signal,
          onProgress: (progress) => {
            if (signal.aborted) return
            const value = typeof progress === 'number' ? { percent: progress } : (progress || {})
            const percent = Number(value.percent || 0)
            if (value.processing) {
              stage = 'worker'
              notifyDiagnostic(task, {
                stage,
                progress: 100,
                message: 'R2 upload accepted; waiting for image-processing job',
              })
            } else if (percent > 0 || Number(value.loaded || 0) > 0) {
              stage = 'put'
              notifyDiagnostic(task, {
                stage,
                progress: percent,
                message: percent >= 100 ? 'File transfer reached 100%; waiting for server response' : 'Sending image to Cloudflare R2',
              })
            }
            onProgress(progress)
          },
          onJobStatus: (data) => {
            if (signal.aborted) return
            const jobStatus = String(data?.status || 'queued').toLowerCase()
            const detail = data?.queue_diagnostic || {}
            const code = String(detail.code || `MANGA_JOB_${jobStatus.toUpperCase()}`)
            const message = String(detail.message || `Server reports Manga job status: ${jobStatus}`)
            stage = jobStatus === 'queued' ? 'status' : 'worker'
            notifyDiagnostic(task, {
              stage,
              progress: 100,
              code,
              status: 'working',
              message: `${code}: ${message}`,
            })
          },
          useV2: true,
        })
        if (!/^https:\/\//i.test(String(uploaded?.imageUrl || ''))) {
          const error = new Error('Manga processing returned no valid image URL [complete: IMAGE_URL_MISSING]')
          error.permanent = true
          throw error
        }
        if (tokenUserId(getToken()) !== accountId) {
          const error = new Error('Account changed before the Manga upload completed')
          error.status = 401
          throw error
        }
        notifyDiagnostic(task, { stage: 'complete', status: 'done', progress: 100, message: 'Server returned a valid Manga image URL' })
        return {
          imageUrl: uploaded.imageUrl,
          storagePath: uploaded.storagePath || null,
          width: uploaded.width || prepared.width || null,
          height: uploaded.height || prepared.height || null,
          fileSize: uploaded.fileSize || selected.size,
          mimeType: uploaded.mimeType || selected.type,
          parts: Array.isArray(uploaded.parts) ? uploaded.parts : [],
        }
      } catch (error) {
        const diagnostic = diagnosticFromError(error, stage)
        if (!signal.aborted && diagnostic.uncertain) {
          error.permanent = true
          if (!String(error.message || '').includes(UNCERTAIN_MARKER)) {
            error.message = `${UNCERTAIN_MARKER} ${String(error.message || 'Manga upload status is unknown')}`
          }
        }
        const displayError = diagnosticFromError(error, stage)
        if (!/\[[a-z][a-z\d_-]*:\s*[A-Z\d_]+\]/i.test(String(error.message || ''))) {
          error.message = `${String(error.message || 'Manga upload failed')} [${displayError.stage}: ${displayError.code}]`
        }
        notifyDiagnostic(task, { ...displayError, status: signal.aborted ? 'canceled' : 'error' })
        throw error
      }
    },
    onChange: (event) => {
      if (tokenUserId(getToken()) !== accountId || !matches(event?.task)) return
      const task = event.task
      if (event.type === 'failed' || (event.type === 'queued' && task.status === 'retry_wait')) {
        notifyDiagnostic(task, {
          ...diagnosticFromError({ message: task.lastError || 'Upload failed' }),
          status: event.type === 'failed' ? 'error' : 'retry',
        })
      }
      if (event.type === 'uploaded') {
        notifyDiagnostic(task, { stage: 'complete', status: 'done', progress: 100 })
      }
      if (typeof onChange === 'function') onChange(event)
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

      requireCurrentAccount()
      const selected = file instanceof File ? file : new File(
        [file], String(file.name || `manga-${page}`),
        { type: String(file.type || 'application/octet-stream') }
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
    const task = await get(taskId)
    if (!task) return false
    const removed = await manager.remove(taskId)
    if (removed) {
      const url = previews.get(taskId)
      if (url) URL.revokeObjectURL(url)
      previews.delete(taskId)
      recentDiagnostics.delete(String(task.context?.pageId || ''))
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
    recentDiagnostics.clear()
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
