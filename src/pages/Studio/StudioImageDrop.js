import { readStudioImage } from './StudioImageImport'

export async function placeStudioDroppedImage(file, canvas, anchor, stillCurrent) {
  const { name, image: source } = await readStudioImage(file)
  const image = new Image()
  await new Promise((resolve, reject) => {
    image.onload = resolve
    image.onerror = () => reject(new Error('The image could not be opened.'))
    image.src = source
  })
  if (!canvas || !stillCurrent()) return null
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('The canvas is not available.')
  const scale = Math.min(1, canvas.width / image.naturalWidth, canvas.height / image.naturalHeight)
  const width = Math.max(1, Math.round(image.naturalWidth * scale))
  const height = Math.max(1, Math.round(image.naturalHeight * scale))
  const x = Math.round(Math.max(0, Math.min(canvas.width - width, (anchor?.x ?? canvas.width / 2) - width / 2)))
  const y = Math.round(Math.max(0, Math.min(canvas.height - height, (anchor?.y ?? canvas.height / 2) - height / 2)))
  ctx.save()
  try {
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
    ctx.drawImage(image, x, y, width, height)
  } finally {
    ctx.restore()
  }
  return name
}
