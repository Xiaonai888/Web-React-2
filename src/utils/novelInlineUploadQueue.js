import { useCallback, useEffect, useRef, useState } from 'react'
import { createUploadQueueManager } from './uploadQueueManager'

const MARKER_PREFIX = '[[shadow-upload:'

function readUserId(token) {
  try {
    const middle = String(token || '').split('.')[1]
    if (!middle) return ''
    const payload = JSON.parse(atob(middle.replace(/-/g, '+').replace(/_/g, '/')))
    return String(payload.user_id || '').trim()
  } catch {
    return ''
  }
}

export function novelImageUploadMarker(id) {
  return `${MARKER_PREFIX}${id}]]`
}

export function countPendingNovelImageMarkers(html) {
  return (String(html || '').match(/\[\[shadow-upload:[a-z\d-]+\]\]/gi) || []).length
}

export function useNovelInlineUploadQueue({
  active,
  storyId,
  episodeKey,
  editorRef,
  getToken,
  upload,
  onContentChange,
  onLocalSave,
  onFailed,
}) {
  const current = useRef(null)
  const worker = useRef(null)
  const reconciling = useRef(false)
  const rerunRequested = useRef(false)
  const [pendingCount, setPendingCount] = useState(0)
  current.current = { editorRef, getToken, upload, onContentChange, onLocalSave, onFailed }

  const reconcile = useCallback(async () => {
    const queue = worker.current
    if (!queue) return
    if (reconciling.current) {
      rerunRequested.current = true
      return
    }
    reconciling.current = true
    try {
      const tasks = (await queue.list()).filter((task) =>
      task.category === 'episode_content' &&
      task.context?.storyId === String(storyId) &&
      task.context?.episodeKey === String(episodeKey)
    )
    setPendingCount(tasks.filter((task) => !['uploaded'].includes(task.status)).length)

    const editor = current.current.editorRef.current
    if (!editor) return

    for (const task of tasks) {
      if (task.status !== 'uploaded') continue
      const imageUrl = typeof task.result === 'string'
        ? task.result
        : task.result?.image_url || task.result?.imageUrl || task.result?.url || ''
      try {
        const url = new URL(imageUrl)
        if (!['http:', 'https:'].includes(url.protocol)) continue
      } catch {
        continue
      }

      const marker = novelImageUploadMarker(task.id)
      const paragraph = Array.from(editor.querySelectorAll('p'))
        .find((element) => element.textContent?.includes(marker))
      if (!paragraph) continue

      const image = document.createElement('img')
      image.src = imageUrl
      image.alt = 'Episode image'
      paragraph.replaceChildren(image)
      current.current.onContentChange(editor.innerHTML)
      const saved = await current.current.onLocalSave()
      if (saved) await queue.remove(task.id)
    }
    } finally {
      reconciling.current = false
      if (rerunRequested.current) {
        rerunRequested.current = false
        queueMicrotask(() => { void reconcile().catch(() => {}) })
      }
    }
  }, [storyId, episodeKey])

  useEffect(() => {
    if (!active) return undefined
    const token = current.current.getToken()
    const userId = readUserId(token)
    if (!userId) return undefined
    const ownerId = `${userId}:novel-inline`
    const manager = createUploadQueueManager({
      ownerId,
      upload: async ({ file, signal, onProgress }) => {
        const sessionToken = current.current.getToken()
        if (readUserId(sessionToken) !== userId) {
          const error = new Error('Your login changed. Sign in again before uploading.')
          error.status = 401
          throw error
        }
        return current.current.upload({ token: sessionToken, file, signal, onProgress })
      },
      onChange: ({ type, task }) => {
        if (type === 'failed' && task?.context?.storyId === String(storyId) &&
          task?.context?.episodeKey === String(episodeKey)) {
          current.current.onFailed(task)
        }
        if (['uploaded', 'queued', 'failed', 'removed'].includes(type)) {
          void reconcile().catch(() => {})
        }
      },
    })
    worker.current = manager
    manager.start()
    void reconcile().catch(() => {})

    return () => {
      manager.stop()
      if (worker.current === manager) worker.current = null
    }
  }, [active, storyId, episodeKey, reconcile])

  const enqueue = useCallback(async (file) => {
    const queue = worker.current
    if (!queue) throw new Error('Local image queue is not ready. Reopen this episode and try again.')
    const task = await queue.enqueue({
      file,
      category: 'episode_content',
      kind: 'image',
      context: { storyId: String(storyId), episodeKey: String(episodeKey) },
    })
    setPendingCount((count) => count + 1)
    return task
  }, [storyId, episodeKey])

  return { enqueue, reconcile, pendingCount }
}
