import { optimizeImageForUpload } from './imageUploadOptimizer'

export const CHAT_READER_IMAGE_MAX_BYTES = 5 * 1024 * 1024
export const CHAT_READER_IMAGE_FORMATS = Object.freeze({
  indicator: Object.freeze({ width: 1, height: 1, maxWidth: 512, maxHeight: 512 }),
  theme: Object.freeze({ width: 9, height: 16, maxWidth: 900, maxHeight: 1600 }),
})

const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

function imageError(code) {
  const error = new Error(code)
  error.code = code
  return error
}

function checkAbort(signal) {
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
}

export function validateChatReaderImage(file) {
  if (!(file instanceof Blob) || !ACCEPTED_TYPES.has(file.type)) throw imageError('invalidType')
  if (file.size <= 0 || file.size > CHAT_READER_IMAGE_MAX_BYTES) throw imageError('tooLarge')
  return file
}

function loadLocalImage(file, signal) {
  checkAbort(signal)
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    let settled = false
    const finish = (error) => {
      if (settled) return
      settled = true
      image.onload = null
      image.onerror = null
      signal?.removeEventListener('abort', abort)
      URL.revokeObjectURL(url)
      if (error) {
        image.src = ''
        reject(error)
      } else {
        resolve(image)
      }
    }
    const abort = () => finish(new DOMException('Aborted', 'AbortError'))
    image.onload = () => finish(null)
    image.onerror = () => finish(imageError('invalidImage'))
    signal?.addEventListener('abort', abort, { once: true })
    image.src = url
    if (signal?.aborted) abort()
  })
}

function exportCanvas(canvas, signal) {
  checkAbort(signal)
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (signal?.aborted) {
        reject(new DOMException('Aborted', 'AbortError'))
      } else if (!blob || !ACCEPTED_TYPES.has(blob.type)) {
        reject(imageError('invalidImage'))
      } else if (blob.size > CHAT_READER_IMAGE_MAX_BYTES) {
        reject(imageError('tooLarge'))
      } else {
        resolve(blob)
      }
    }, 'image/webp', 0.94)
  })
}

export async function prepareChatReaderImage(file, { kind, signal } = {}) {
  const format = CHAT_READER_IMAGE_FORMATS[kind]
  if (!format) throw imageError('invalidImageKind')
  validateChatReaderImage(file)
  checkAbort(signal)
  let image
  let canvas
  try {
    const optimized = await optimizeImageForUpload(file, {
      preset: kind === 'indicator' ? 'avatar' : 'cover',
      force: true,
      signal,
      maxSourceBytes: CHAT_READER_IMAGE_MAX_BYTES,
    })
    checkAbort(signal)
    image = await loadLocalImage(optimized.file, signal)
    const width = image.naturalWidth
    const height = image.naturalHeight
    if (!width || !height || width * height > 60_000_000) throw imageError('invalidImage')
    const ratio = format.width / format.height
    const cropWidth = Math.min(width, height * ratio)
    const cropHeight = cropWidth / ratio
    const units = Math.floor(Math.min(
      cropWidth / format.width,
      cropHeight / format.height,
      format.maxWidth / format.width,
      format.maxHeight / format.height,
    ))
    if (units < 1) throw imageError('invalidImage')
    canvas = document.createElement('canvas')
    canvas.width = units * format.width
    canvas.height = units * format.height
    const context = canvas.getContext('2d', { alpha: true })
    if (!context) throw imageError('invalidImage')
    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = 'high'
    context.drawImage(image, (width - cropWidth) / 2, (height - cropHeight) / 2, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height)
    const blob = await exportCanvas(canvas, signal)
    checkAbort(signal)
    const extension = blob.type === 'image/webp' ? 'webp' : blob.type === 'image/png' ? 'png' : 'jpg'
    const ready = new File([blob], `chat-${kind}-${Date.now()}.${extension}`, { type: blob.type })
    return { file: ready, width: canvas.width, height: canvas.height, kind }
  } catch (error) {
    if (error.name === 'AbortError' || error.code) throw error
    throw imageError('invalidImage')
  } finally {
    if (canvas) {
      canvas.width = 0
      canvas.height = 0
    }
    if (image) image.src = ''
  }
}
