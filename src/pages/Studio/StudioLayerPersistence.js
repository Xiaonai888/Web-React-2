import { createStudioLayerStack, MAX_STUDIO_LAYERS, renderStudioLayers } from './StudioLayerEngine'

const IMAGE_PREFIX = /^data:image\/(png|webp|jpeg);base64,/i

function loadImage(source, width, height) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      if (image.naturalWidth !== width || image.naturalHeight !== height) {
        reject(new Error('A saved layer has an incompatible canvas size.'))
        return
      }
      resolve(image)
    }
    image.onerror = () => reject(new Error('A saved layer could not be opened.'))
    image.src = source
  })
}

export function exportStudioLayerStack(stack) {
  if (!stack || !Array.isArray(stack.layers) || !stack.layers.length || stack.layers.length > MAX_STUDIO_LAYERS) {
    throw new Error('The current layer stack is invalid.')
  }
  if (!stack.layers.some((layer) => layer.id === stack.activeLayerId)) {
    throw new Error('No active layer is selected.')
  }
  return {
    activeLayerId: stack.activeLayerId,
    layers: stack.layers.map((layer) => ({
      id: layer.id,
      name: layer.name,
      image: layer.canvas.toDataURL('image/png'),
      visible: layer.visible,
      locked: layer.locked,
      opacity: layer.opacity,
    })),
  }
}

export async function loadStudioLayerStack(paper, displayCanvas) {
  if (!paper || !displayCanvas || displayCanvas.width !== paper.width || displayCanvas.height !== paper.height) {
    throw new Error('The paper and canvas sizes do not match.')
  }
  if (paper.layers === undefined) return createStudioLayerStack(displayCanvas)
  if (!Array.isArray(paper.layers) || !paper.layers.length || paper.layers.length > MAX_STUDIO_LAYERS) {
    throw new Error('The saved paper has an invalid layer count.')
  }
  const ids = new Set()
  const loaded = await Promise.all(paper.layers.map(async (item) => {
    if (!item || typeof item.id !== 'string' || !item.id || item.id.length > 100 || ids.has(item.id) ||
        typeof item.name !== 'string' || !item.name.trim() || item.name.length > 80 ||
        typeof item.image !== 'string' || !IMAGE_PREFIX.test(item.image) ||
        typeof item.visible !== 'boolean' || typeof item.locked !== 'boolean' ||
        !Number.isFinite(item.opacity) || item.opacity < 0 || item.opacity > 100) {
      throw new Error('The saved paper contains an invalid layer.')
    }
    ids.add(item.id)
    const image = await loadImage(item.image, paper.width, paper.height)
    const canvas = document.createElement('canvas')
    canvas.width = paper.width
    canvas.height = paper.height
    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) throw new Error('Could not restore a saved layer.')
    context.drawImage(image, 0, 0)
    return { id: item.id, name: item.name, canvas, visible: item.visible, locked: item.locked, opacity: item.opacity }
  }))
  if (!ids.has(paper.activeLayerId)) throw new Error('The saved active layer is missing.')
  const stack = { width: paper.width, height: paper.height, layers: loaded, activeLayerId: paper.activeLayerId }
  renderStudioLayers(stack, displayCanvas)
  return stack
}
