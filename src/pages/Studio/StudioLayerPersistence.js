import { createStudioLayerStack, MAX_STUDIO_LAYERS } from './StudioLayerEngine'
import { validateStudioGroupLayout } from './StudioLayerGroupEngine'
import { renderStudioAdvancedLayers, STUDIO_BLEND_MODES } from './StudioLayerBlendEngine'

const IMAGE_PREFIX = /^data:image\/(png|webp|jpeg);base64,/i
const BLEND_MODES = new Set(STUDIO_BLEND_MODES)

function checkBlend(mode) {
  if (!BLEND_MODES.has(mode)) throw new Error('Unsupported layer blend mode.')
  return mode
}

function savedGroups(stack) {
  const groups = validateStudioGroupLayout(stack)
  return groups.map((group) => {
    if (typeof group.name !== 'string' || !group.name.trim() || group.name.length > 80 ||
      typeof group.visible !== 'boolean' || typeof group.locked !== 'boolean' || typeof group.collapsed !== 'boolean' ||
      !Number.isFinite(group.opacity) || group.opacity < 0 || group.opacity > 100 ||
      typeof group.id !== 'string' || group.id.length > 100) throw new Error('Invalid layer group metadata.')
    return { id: group.id, name: group.name, visible: group.visible, locked: group.locked, collapsed: group.collapsed, opacity: group.opacity, blendMode: checkBlend(group.blendMode ?? 'normal') }
  })
}

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
  const groups = savedGroups(stack)
  return {
    activeLayerId: stack.activeLayerId,
    ...(groups.length ? { groups } : {}),
    layers: stack.layers.map((layer, index) => ({
      id: layer.id,
      ...(index === 0 ? { isBackground: layer.isBackground === true } : {}),
      name: layer.name,
      image: layer.canvas.toDataURL('image/png'),
      visible: layer.visible,
      locked: layer.locked,
      opacity: layer.opacity,
      ...(layer.groupId ? { groupId: layer.groupId } : {}),
      ...(layer.blendMode && layer.blendMode !== 'normal' ? { blendMode: checkBlend(layer.blendMode) } : {}),
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
  const loaded = await Promise.all(paper.layers.map(async (item, index) => {
    if (item && ((item.isBackground !== undefined && typeof item.isBackground !== 'boolean') || (index > 0 && item.isBackground))) throw new Error('Invalid Background layer metadata.')
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
    return { id: item.id, name: item.name, canvas, visible: item.visible, locked: item.locked, opacity: item.opacity,
      isBackground: index === 0 && item.isBackground !== false,
      ...(item.groupId ? { groupId: item.groupId } : {}),
      ...(item.blendMode ? { blendMode: checkBlend(item.blendMode) } : {}),
    }
  }))
  if (!ids.has(paper.activeLayerId)) throw new Error('The saved active layer is missing.')
  const stack = { width: paper.width, height: paper.height, layers: loaded, activeLayerId: paper.activeLayerId,
    ...(paper.groups !== undefined ? { groups: paper.groups.map((group) => ({ ...group })) } : {}),
  }
  savedGroups(stack)
  if (stack.layers[0].isBackground && stack.layers[0].blendMode && stack.layers[0].blendMode !== 'normal') throw new Error('Background must use Normal blend mode.')
  renderStudioAdvancedLayers(stack, displayCanvas)
  return stack
}
