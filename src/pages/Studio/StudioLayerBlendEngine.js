import { validateStudioGroupLayout } from './StudioLayerGroupEngine'
import { renderStudioStyledLayer, normalizeStudioLayerStyle } from './StudioLayerStyleEngine'

export const STUDIO_BLEND_MODES = Object.freeze([
  'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
  'soft-light', 'hard-light', 'color-dodge', 'color-burn', 'difference', 'exclusion',
])

const operations = Object.freeze({ normal: 'source-over', multiply: 'multiply', screen: 'screen', overlay: 'overlay', darken: 'darken', lighten: 'lighten', 'soft-light': 'soft-light', 'hard-light': 'hard-light', 'color-dodge': 'color-dodge', 'color-burn': 'color-burn', difference: 'difference', exclusion: 'exclusion' })

function operation(mode) {
  const key = mode == null ? 'normal' : mode
  if (!Object.hasOwn(operations, key)) throw new Error('Unsupported layer blend mode.')
  return operations[key]
}

export function setStudioLayerBlendMode(stack, layerId, mode) {
  const layer = stack?.layers?.find((item) => item.id === layerId)
  if (!layer) throw new Error('Layer not found.')
  if (layer.isBackground && mode !== 'normal') throw new Error('Background must use Normal blend mode.')
  operation(mode)
  layer.blendMode = mode
  return layer
}

export function setStudioGroupBlendMode(stack, groupId, mode) {
  const group = stack?.groups?.find((item) => item.id === groupId)
  if (!group) throw new Error('Layer group not found.')
  operation(mode)
  group.blendMode = mode
  return group
}

function layerSurface(layer) {
  if (!layer.layerStyle) return layer.canvas
  const style = normalizeStudioLayerStyle(layer.layerStyle)
  const affectsPixels = style.fillOpacity !== 100 || !style.channels.r || !style.channels.g || !style.channels.b ||
    Object.values(style.effects).some((effect) => effect.enabled)
  return affectsPixels ? renderStudioStyledLayer(layer.canvas, { ...style, opacity: 100 }) : layer.canvas
}

function drawLayer(context, layer) {
  if (layer.visible === false || Number(layer.opacity) <= 0) return
  context.save()
  try {
    context.globalAlpha = (layer.opacity ?? 100) / 100
    context.globalCompositeOperation = operation(layer.blendMode)
    context.drawImage(layerSurface(layer), 0, 0, layer.canvas.width, layer.canvas.height)
  } finally {
    context.restore()
  }
}

export function renderStudioAdvancedLayers(stack, targetCanvas) {
  if (!targetCanvas || targetCanvas.width !== stack?.width || targetCanvas.height !== stack?.height) throw new Error('Layer stack and display canvas sizes do not match.')
  const groups = validateStudioGroupLayout(stack)
  const byId = new Map(groups.map((group) => [group.id, group]))
  const context = targetCanvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new Error('The display canvas is not available.')
  context.save()
  try {
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.globalAlpha = 1
    context.globalCompositeOperation = 'source-over'
    context.clearRect(0, 0, stack.width, stack.height)
    for (let index = 0; index < stack.layers.length;) {
      const layer = stack.layers[index]
      if (!layer.groupId) {
        drawLayer(context, layer)
        index += 1
        continue
      }
      const group = byId.get(layer.groupId)
      const members = []
      while (index < stack.layers.length && stack.layers[index].groupId === group.id) {
        members.push(stack.layers[index])
        index += 1
      }
      if (group.visible === false || Number(group.opacity) <= 0) continue
      const surface = document.createElement('canvas')
      surface.width = stack.width
      surface.height = stack.height
      const nested = surface.getContext('2d', { willReadFrequently: true })
      if (!nested) throw new Error('Could not render the layer group.')
      for (const member of members) drawLayer(nested, member)
      context.save()
      try {
        context.globalAlpha = (group.opacity ?? 100) / 100
        context.globalCompositeOperation = operation(group.blendMode)
        context.drawImage(surface, 0, 0)
      } finally {
        context.restore()
      }
    }
  } finally {
    context.restore()
  }
  return targetCanvas
}
