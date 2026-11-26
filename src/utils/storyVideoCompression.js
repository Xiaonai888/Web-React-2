const MIN_BYTES = 5 * 1024 * 1024
const MAX_BYTES = 30 * 1024 * 1024
const TIMEOUT_MS = 75000
const VIDEO_TYPES = new Set(['video/mp4', 'video/quicktime'])
let active = false

export async function compressStoryVideoOnDevice(file, { onProgress = () => {} } = {}) {
  if (!file || !VIDEO_TYPES.has(file.type) || file.size < MIN_BYTES || file.size > MAX_BYTES || active || typeof Worker === 'undefined') return file
  if ((navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) || (navigator.deviceMemory && navigator.deviceMemory <= 2)) return file

  active = true
  try {
    return await new Promise(resolve => {
      let worker
      let timer
      let settled = false
      const finish = result => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        worker?.terminate()
        resolve(result)
      }
      try {
        worker = new Worker(new URL('./storyVideoCompression.worker.js', import.meta.url), { type: 'module' })
        timer = setTimeout(() => finish(file), TIMEOUT_MS)
        worker.onerror = () => finish(file)
        worker.onmessageerror = () => finish(file)
        worker.onmessage = ({ data }) => {
          if (data?.type === 'progress') {
            const progress = Number(data.value)
            if (Number.isFinite(progress)) {
              try { onProgress(Math.max(0, Math.min(1, progress))) } catch {}
            }
            return
          }
          const buffer = data?.buffer
          if (data?.type !== 'done' || !(buffer instanceof ArrayBuffer) || buffer.byteLength < 1024 || buffer.byteLength > file.size * 0.9) return finish(file)
          try {
            finish(new File([buffer], 'story-video.mp4', { type: 'video/mp4' }))
          } catch {
            finish(file)
          }
        }
        worker.postMessage(file)
      } catch {
        finish(file)
      }
    })
  } finally {
    active = false
  }
}
