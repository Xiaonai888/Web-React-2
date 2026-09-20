export const MAX_STUDIO_LAYERS = 8

function surface(width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

function layerId() {
  return globalThis.crypto?.randomUUID?.() || `layer-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function requireLayer(stack, id) {
  const layer = stack.layers.find((item) => item.id === id)
  if (!layer) throw new Error('Layer not found.')
  return layer
}

function makeLayer(width, height, name, locked = false) {
  return {
    id: layerId(),
    name,
    canvas: surface(width, height),
    visible: true,
    locked,
    isBackground: false,
    opacity: 100,
  }
}

export function createStudioLayerStack(sourceCanvas) {
  if (!sourceCanvas?.width || !sourceCanvas?.height) throw new Error('A loaded canvas is required.')
  const background = makeLayer(sourceCanvas.width, sourceCanvas.height, 'Background', true)
  background.isBackground = true
  background.canvas.getContext('2d').drawImage(sourceCanvas, 0, 0)
  const drawing = makeLayer(sourceCanvas.width, sourceCanvas.height, 'Layer 1')
  return {
    width: sourceCanvas.width,
    height: sourceCanvas.height,
    layers: [background, drawing],
    activeLayerId: drawing.id,
  }
}

export function studioActiveLayer(stack) {
  return requireLayer(stack, stack.activeLayerId)
}

export function selectStudioLayer(stack, id) {
  requireLayer(stack, id)
  stack.activeLayerId = id
  return studioActiveLayer(stack)
}

export function addStudioLayer(stack, name = '') {
  if (stack.layers.length >= MAX_STUDIO_LAYERS) throw new Error('The layer limit has been reached.')
  const index = stack.layers.findIndex((item) => item.id === stack.activeLayerId)
  const layer = makeLayer(stack.width, stack.height, String(name || `Layer ${stack.layers.length}`).trim().slice(0, 80))
  stack.layers.splice(index + 1, 0, layer)
  stack.activeLayerId = layer.id
  return layer
}

export function duplicateStudioLayer(stack, id = stack.activeLayerId) {
  const original = requireLayer(stack, id)
  if (original.isBackground) throw new Error('Convert Background to a normal layer before duplicating it.')
  if (stack.layers.length >= MAX_STUDIO_LAYERS) throw new Error('The layer limit has been reached.')
  const duplicate = makeLayer(stack.width, stack.height, `${original.name} Copy`.slice(0, 80))
  const context = duplicate.canvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new Error('Could not copy the layer.')
  context.drawImage(original.canvas, 0, 0)
  duplicate.visible = original.visible
  duplicate.opacity = original.opacity
  stack.layers.splice(stack.layers.indexOf(original) + 1, 0, duplicate)
  stack.activeLayerId = duplicate.id
  return duplicate
}

export function updateStudioLayer(stack, id, patch) {
  const layer = requireLayer(stack, id)
  if (Object.hasOwn(patch, 'name')) {
    const name = String(patch.name || '').trim().slice(0, 80)
    if (!name) throw new Error('A layer name is required.')
    layer.name = name
  }
  if (Object.hasOwn(patch, 'visible')) layer.visible = Boolean(patch.visible)
  if (Object.hasOwn(patch, 'locked')) layer.locked = Boolean(patch.locked)
  if (Object.hasOwn(patch, 'opacity')) {
    const value = Number(patch.opacity)
    if (!Number.isFinite(value)) throw new Error('Invalid layer opacity.')
    layer.opacity = Math.min(100, Math.max(0, value))
  }
  return layer
}

export function moveStudioLayer(stack, id, delta) {
  const index = stack.layers.findIndex((item) => item.id === id)
  if (index < 0) throw new Error('Layer not found.')
  if (!Number.isInteger(delta) || Math.abs(delta) !== 1) throw new Error('Move a layer one step at a time.')
  const next = index + delta
  if (next < 0 || next >= stack.layers.length) return false
  if (stack.layers[index].isBackground || stack.layers[next].isBackground) return false
  const [layer] = stack.layers.splice(index, 1)
  stack.layers.splice(next, 0, layer)
  return true
}

export function removeStudioLayer(stack, id) {
  const index = stack.layers.findIndex((item) => item.id === id)
  if (index < 0 || stack.layers.length <= 1 || stack.layers[index].isBackground) return false
  stack.layers.splice(index, 1)
  if (stack.activeLayerId === id) stack.activeLayerId = stack.layers[Math.min(index, stack.layers.length - 1)].id
  return true
}

export function studioLayerContext(stack) {
  const layer = studioActiveLayer(stack)
  if (layer.locked || !layer.visible) return null
  return layer.canvas.getContext('2d', { willReadFrequently: true })
}

export function renderStudioLayers(stack, targetCanvas) {
  if (!targetCanvas || targetCanvas.width !== stack.width || targetCanvas.height !== stack.height) {
    throw new Error('Layer stack and display canvas sizes do not match.')
  }
  const context = targetCanvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new Error('The display canvas is not available.')
  context.save()
  try {
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.globalAlpha = 1
    context.globalCompositeOperation = 'source-over'
    context.clearRect(0, 0, stack.width, stack.height)
    for (const layer of stack.layers) {
      if (!layer.visible || layer.opacity <= 0) continue
      context.globalAlpha = layer.opacity / 100
      context.drawImage(layer.canvas, 0, 0)
    }
  } finally {
    context.restore()
  }
}
