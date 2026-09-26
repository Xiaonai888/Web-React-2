import { addStudioLayer, duplicateStudioLayer } from './StudioLayerEngine'
import { createStudioAdjustment, normalizeStudioAdjustment, studioAdjustmentLabel } from './StudioAdjustmentLayerEngine'

export function createStudioAdjustmentLayer(stack, type, options = {}) {
  if (!stack?.layers) throw new Error('Layer stack is unavailable.')
  const adjustment = createStudioAdjustment(type)
  const layer = addStudioLayer(stack, options.name || studioAdjustmentLabel(type))
  layer.adjustment = adjustment
  layer.visible = options.visible !== false
  layer.locked = options.locked === true
  layer.opacity = Number.isFinite(Number(options.opacity))
    ? Math.max(0, Math.min(100, Number(options.opacity)))
    : 100
  layer.blendMode = options.blendMode || 'normal'
  delete layer.textData
  delete layer.layerStyle
  return layer
}

export function updateStudioAdjustmentLayer(stack, layerId, adjustment) {
  const layer = stack?.layers?.find((item) => item.id === layerId)
  if (!layer?.adjustment) throw new Error('Adjustment layer not found.')
  layer.adjustment = normalizeStudioAdjustment(adjustment)
  return layer
}

export function duplicateStudioAdjustmentLayer(stack, layerId) {
  const original = stack?.layers?.find((item) => item.id === layerId)
  if (!original?.adjustment) throw new Error('Adjustment layer not found.')
  const copy = duplicateStudioLayer(stack, layerId)
  copy.adjustment = normalizeStudioAdjustment(original.adjustment)
  copy.name = `${original.name} copy`
  delete copy.textData
  delete copy.layerStyle
  return copy
}

export function convertStudioLayerToAdjustment(stack, layerId, type) {
  const layer = stack?.layers?.find((item) => item.id === layerId)
  if (!layer) throw new Error('Layer not found.')
  if (layer.isBackground) throw new Error('Convert Background to a normal layer first.')
  layer.adjustment = createStudioAdjustment(type)
  layer.name = studioAdjustmentLabel(type)
  const context = layer.canvas?.getContext?.('2d', { willReadFrequently: true })
  if (context) context.clearRect(0, 0, layer.canvas.width, layer.canvas.height)
  delete layer.textData
  delete layer.layerStyle
  return layer
}
