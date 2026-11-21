import { optimizeImageForUpload, validateImageUploadFile } from './imageUploadOptimizer'

export const DELIVERY_COMPANY_LOGO_MAX_SOURCE_BYTES = 10 * 1024 * 1024
export const DELIVERY_COMPANY_LOGO_SIZE = 256
export const DELIVERY_COMPANY_LOGO_TARGET_BYTES = 100 * 1024

const OUTPUT_QUALITIES = [0.92, 0.86, 0.8, 0.74, 0.68, 0.6, 0.52, 0.44]
const SUPPORTED_OUTPUT_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

function checkAborted(signal) {
  if (signal?.aborted) {
    throw new DOMException('Logo preparation canceled.', 'AbortError')
  }
}

function readImage(imageUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Unable to read the selected company logo.'))
    image.src = imageUrl
  })
}

function encodeImage(canvas, mimeType, quality) {
  return new Promise((resolve) => {
    if (typeof canvas.toBlob !== 'function') {
      resolve(null)
      return
    }
    try {
      canvas.toBlob((blob) => {
        resolve(blob?.size > 0 && blob.type === mimeType ? blob : null)
      }, mimeType, quality)
    } catch {
      resolve(null)
    }
  })
}

export async function prepareDeliveryCompanyLogoImage(file, { signal } = {}) {
  const validationError = validateImageUploadFile(file, {
    maxSourceBytes: DELIVERY_COMPANY_LOGO_MAX_SOURCE_BYTES,
  })
  if (validationError) throw new Error(validationError)

  if (file.type === 'image/gif' || /\.gif$/i.test(file.name || '')) {
    throw new Error('Please select a JPG, PNG, WebP, AVIF, or HEIC image.')
  }

  checkAborted(signal)

  const optimized = await optimizeImageForUpload(file, {
    preset: 'avatar',
    maxSourceBytes: DELIVERY_COMPANY_LOGO_MAX_SOURCE_BYTES,
    signal,
  })

  const source = optimized?.file
  if (!source?.size || !SUPPORTED_OUTPUT_TYPES.has(source.type)) {
    throw new Error('This image format cannot be prepared for a company logo.')
  }

  checkAborted(signal)

  const imageUrl = URL.createObjectURL(source)
  const canvas = document.createElement('canvas')
  canvas.width = DELIVERY_COMPANY_LOGO_SIZE
  canvas.height = DELIVERY_COMPANY_LOGO_SIZE

  try {
    const image = await readImage(imageUrl)
    checkAborted(signal)

    const width = image.naturalWidth || image.width
    const height = image.naturalHeight || image.height
    if (!width || !height) {
      throw new Error('The company logo has invalid dimensions.')
    }

    const context = canvas.getContext('2d', { alpha: true })
    if (!context) throw new Error('Image processing is unavailable on this device.')

    const cropSize = Math.min(width, height)
    const cropX = (width - cropSize) / 2
    const cropY = (height - cropSize) / 2

    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = 'high'
    context.drawImage(
      image,
      cropX,
      cropY,
      cropSize,
      cropSize,
      0,
      0,
      DELIVERY_COMPANY_LOGO_SIZE,
      DELIVERY_COMPANY_LOGO_SIZE
    )

    let best = null
    let mimeType = 'image/webp'

    for (const quality of OUTPUT_QUALITIES) {
      checkAborted(signal)
      const blob = await encodeImage(canvas, mimeType, quality)
      if (!blob) break
      if (!best || blob.size < best.size) best = blob
      if (blob.size <= DELIVERY_COMPANY_LOGO_TARGET_BYTES) break
    }

    if (!best) {
      mimeType = 'image/jpeg'
      context.globalCompositeOperation = 'destination-over'
      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.globalCompositeOperation = 'source-over'

      for (const quality of OUTPUT_QUALITIES) {
        checkAborted(signal)
        const blob = await encodeImage(canvas, mimeType, quality)
        if (!blob) break
        if (!best || blob.size < best.size) best = blob
        if (blob.size <= DELIVERY_COMPANY_LOGO_TARGET_BYTES) break
      }
    }

    checkAborted(signal)
    if (!best) throw new Error('Unable to compress the company logo on this device.')

    const extension = mimeType === 'image/webp' ? 'webp' : 'jpg'
    return new File([best], `delivery-company-logo.${extension}`, {
      type: mimeType,
      lastModified: Date.now(),
    })
  } finally {
    URL.revokeObjectURL(imageUrl)
    canvas.width = 0
    canvas.height = 0
  }
}
