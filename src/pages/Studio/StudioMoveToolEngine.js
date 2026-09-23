export function moveStudioPixels(ctx, { deltaX = 0, deltaY = 0, selection = null } = {}) {
  const canvas = ctx?.canvas
  if (!canvas?.width || !canvas?.height || typeof ctx.getImageData !== 'function') throw new Error('A canvas drawing context is required.')
  if (!Number.isFinite(deltaX) || !Number.isFinite(deltaY)) throw new Error('Invalid movement distance.')
  const dx = Math.round(deltaX)
  const dy = Math.round(deltaY)
  if (!dx && !dy) return false
  const { width, height } = canvas
  if (selection && (selection.width !== width || selection.height !== height || selection.data?.length !== width * height)) throw new Error('Selection dimensions do not match the canvas.')
  const source = document.createElement('canvas')
  source.width = width
  source.height = height
  const sourceContext = source.getContext('2d', { willReadFrequently: true })
  if (!sourceContext) throw new Error('Could not create the move buffer.')
  if (selection) {
    const image = ctx.getImageData(0, 0, width, height)
    const selected = sourceContext.createImageData(width, height)
    let any = false
    for (let index = 0; index < selection.data.length; index += 1) {
      if (!selection.data[index]) continue
      const offset = index * 4
      for (let channel = 0; channel < 4; channel += 1) selected.data[offset + channel] = image.data[offset + channel]
      image.data[offset + 3] = 0
      if (selected.data[offset + 3]) any = true
    }
    if (!any) return false
    sourceContext.putImageData(selected, 0, 0)
    ctx.putImageData(image, 0, 0)
  } else {
    sourceContext.drawImage(canvas, 0, 0)
    ctx.clearRect(0, 0, width, height)
  }
  ctx.save()
  try {
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.drawImage(source, dx, dy)
  } finally {
    ctx.restore()
  }
  return true
}
