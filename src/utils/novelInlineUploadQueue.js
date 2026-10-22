import { useCallback, useEffect, useRef, useState } from 'react'
import { createUploadQueueManager } from './uploadQueueManager'
import { getDisplayText } from './displayLanguage'

const MARKER_PREFIX = '[[shadow-upload:'

function readUserId(token) {
  try {
    const middle = String(token || '').split('.')[1]
    if (!middle) return ''
    const payload = JSON.parse(atob(middle.replace(/-/g, '+').replace(/_/g, '/')))
    return String(payload.user_id || payload.sub || '').trim()
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

function replaceUploadMarker(paragraph, marker, imageUrl) {
  const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT)
  const nodes = []
  let text = ''
  let node
  while ((node = walker.nextNode())) {
    const value = node.nodeValue || ''
    nodes.push({ node, start: text.length, end: text.length + value.length })
    text += value
  }

  const markerStart = text.indexOf(marker)
  if (markerStart < 0) return false
  const prefixCandidates = [
    getDisplayText('episodeEditor.uploading'),
    'Uploading',
    'កំពុងអាប់ឡូដ',
    '上传中',
    'アップロード中',
    '업로드 중',
  ].map((label) => `⏳ ${label} `)
  const prefix = prefixCandidates.find((value) => text.slice(0, markerStart).endsWith(value))
  const start = prefix ? markerStart - prefix.length : markerStart
  const end = markerStart + marker.length
  const first = nodes.find((item) => item.start <= start && item.end > start)
  const last = nodes.find((item) => item.start < end && item.end >= end)
  if (!first || !last) return false

  const image = document.createElement('img')
  image.src = imageUrl
  image.alt = 'Episode image'
  const range = document.createRange()
  range.setStart(first.node, start - first.start)
  range.setEnd(last.node, end - last.start)
  range.deleteContents()
  range.insertNode(image)
  return true
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
  const workerUserId = useRef('')
  const reconciling = useRef(false)
  const rerunRequested = useRef(false)
  const latestReconcile = useRef(null)
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
    const isCurrent = () => worker.current === queue &&
      readUserId(current.current.getToken?.()) === workerUserId.current
    try {
      const tasks = (await queue.list()).filter((task) =>
        task.category === 'episode_content' &&
        task.context?.storyId === String(storyId) &&
        task.context?.episodeKey === String(episodeKey)
      )
      if (!isCurrent()) {
        if (worker.current === queue) setPendingCount(0)
        return
      }
      setPendingCount(tasks.length)

      const editor = current.current.editorRef?.current
      if (!editor) return

      for (const task of tasks) {
        if (!isCurrent() || current.current.editorRef?.current !== editor) return
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
        if (paragraph) {
          if (!replaceUploadMarker(paragraph, marker, imageUrl)) continue
          current.current.onContentChange?.(editor.innerHTML)
        } else {
          const imageExists = Array.from(editor.querySelectorAll('img'))
            .some((image) => image.getAttribute('src') === imageUrl)
          if (!imageExists) continue
        }

        let saved = false
        try {
          saved = await current.current.onLocalSave?.() === true
        } catch {
          saved = false
        }
        if (saved && isCurrent() && current.current.editorRef?.current === editor) {
          await queue.remove(task.id)
        }
      }
    } finally {
      reconciling.current = false
      if (rerunRequested.current) {
        rerunRequested.current = false
        queueMicrotask(() => {
          void latestReconcile.current?.().catch(() => {})
        })
      }
    }
  }, [storyId, episodeKey])
  latestReconcile.current = reconcile

  useEffect(() => {
    setPendingCount(0)
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
        if (worker.current !== manager || readUserId(current.current.getToken?.()) !== userId) return
        if (type === 'failed' && task?.context?.storyId === String(storyId) &&
          task?.context?.episodeKey === String(episodeKey)) {
          current.current.onFailed?.(task)
        }
        if (['uploaded', 'queued', 'failed', 'removed'].includes(type)) {
          void reconcile().catch(() => {})
        }
      },
    })
    worker.current = manager
    workerUserId.current = userId
    manager.start()
    void reconcile().catch(() => {})

    return () => {
      manager.stop()
      if (worker.current === manager) {
        worker.current = null
        workerUserId.current = ''
      }
    }
  }, [active, storyId, episodeKey, reconcile])

  useEffect(() => {
    if (!active || pendingCount === 0) return undefined
    const timer = window.setInterval(() => {
      void reconcile().catch(() => {})
    }, 8000)
    return () => window.clearInterval(timer)
  }, [active, pendingCount, reconcile])

  const enqueue = useCallback(async (file) => {
    const queue = worker.current
    if (!queue) throw new Error('Local image queue is not ready. Reopen this episode and try again.')
    if (readUserId(current.current.getToken?.()) !== workerUserId.current) {
      throw new Error('Your login changed. Reopen this episode before uploading.')
    }
    const task = await queue.enqueue({
      file,
      category: 'episode_content',
      kind: 'image',
      context: { storyId: String(storyId), episodeKey: String(episodeKey) },
    })
    if (worker.current === queue) void reconcile().catch(() => {})
    return task
  }, [storyId, episodeKey, reconcile])

  const retry = useCallback(async (taskId) => {
    const queue = worker.current
    if (!queue || readUserId(current.current.getToken?.()) !== workerUserId.current) return null
    const task = await queue.get(taskId)
    if (!task || task.category !== 'episode_content' ||
      task.context?.storyId !== String(storyId) ||
      task.context?.episodeKey !== String(episodeKey) ||
      worker.current !== queue) return null
    return queue.retry(taskId)
  }, [storyId, episodeKey])

  return { enqueue, reconcile, retry, pendingCount }
}
