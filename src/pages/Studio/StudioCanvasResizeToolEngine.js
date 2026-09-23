const HEX = /^#[0-9a-f]{6}$/i

export function resizeStudioCanvas(stack, { width, height, offsetX = 0, offsetY = 0, background = null } = {}) {
  if (!Number.isInteger(stack?.width) || !Number.isInteger(stack?.height) || !Array.isArray(stack?.layers) || stack.width < 1 || stack.height < 1) throw new Error('A valid layer stack is required.')
  if (![width, height].every((value) => Number.isInteger(value) && value >= 1 && value <= 16384) || ![offsetX, offsetY].every(Number.isInteger) || (background !== null && !HEX.test(background))) throw new Error('Invalid canvas resize settings.')
  if (!stack.layers.every((layer) => layer?.canvas?.width === stack.width && layer.canvas.height === stack.height)) throw new Error('Layer dimensions do not match the canvas.')
  const layers = stack.layers.map((layer) => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) throw new Error('Could not resize a layer.')
    if (layer.isBackground && background) {
      context.fillStyle = background
      context.fillRect(0, 0, width, height)
    }
    context.drawImage(layer.canvas, offsetX, offsetY)
    const result = { ...layer, canvas }
    if (layer.textData?.anchor) {
      const anchor = { ...layer.textData.anchor, x: layer.textData.anchor.x + offsetX, y: layer.textData.anchor.y + offsetY }
      if (Number.isFinite(anchor.x) && Number.isFinite(anchor.y) && anchor.x >= 0 && anchor.x <= width && anchor.y >= 0 && anchor.y <= height) result.textData = { ...layer.textData, anchor }
      else delete result.textData
    }
    return result
  })
  return { ...stack, width, height, layers, groups: stack.groups?.map((group) => ({ ...group })) }
}
