export function transformStudioPixels(ctx, options = {}) {
  const canvas = ctx?.canvas
  if (!canvas?.width || !canvas?.height || typeof ctx.getImageData !== 'function') throw new Error('A canvas drawing context is required.')
  const { width: cw, height: ch } = canvas
  const { selection = null, rect = { x: 0, y: 0, width: cw, height: ch }, translateX = 0, translateY = 0, scaleX = 1, scaleY = 1, rotate = 0 } = options
  const { x, y, width, height } = rect
  if (![x, y, width, height].every(Number.isInteger) || width <= 0 || height <= 0 || x < 0 || y < 0 || x + width > cw || y + height > ch) throw new Error('Invalid transform rectangle.')
  if (![translateX, translateY, scaleX, scaleY, rotate].every(Number.isFinite) || scaleX === 0 || scaleY === 0) throw new Error('Invalid transform settings.')
  if (!translateX && !translateY && scaleX === 1 && scaleY === 1 && !rotate) return false
  if (selection && (selection.width !== cw || selection.height !== ch || selection.data?.length !== cw * ch)) throw new Error('Selection dimensions do not match the canvas.')
  const original = ctx.getImageData(x, y, width, height)
  const isolated = ctx.createImageData(width, height)
  let any = false
  for (let py = 0; py < height; py += 1) {
    for (let px = 0; px < width; px += 1) {
      if (selection && !selection.data[(y + py) * cw + x + px]) continue
      const offset = (py * width + px) * 4
      for (let channel = 0; channel < 4; channel += 1) isolated.data[offset + channel] = original.data[offset + channel]
      if (isolated.data[offset + 3]) any = true
      original.data[offset + 3] = 0
    }
  }
  if (!any) return false
  const buffer = document.createElement('canvas')
  buffer.width = width
  buffer.height = height
  const bufferContext = buffer.getContext('2d')
  if (!bufferContext) throw new Error('Could not create the transform buffer.')
  bufferContext.putImageData(isolated, 0, 0)
  ctx.putImageData(original, x, y)
  ctx.save()
  try {
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.translate(x + width / 2 + translateX, y + height / 2 + translateY)
    ctx.rotate(rotate * Math.PI / 180)
    ctx.scale(scaleX, scaleY)
    ctx.drawImage(buffer, -width / 2, -height / 2)
  } finally {
    ctx.restore()
  }
  return true
}
