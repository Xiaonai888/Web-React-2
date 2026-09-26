import { normalizeStudioAdjustment } from './StudioAdjustmentLayerEngine'

export function serializeStudioAdjustmentLayer(layer) {
  if (!layer?.adjustment) return {}
  return { adjustment: normalizeStudioAdjustment(layer.adjustment) }
}

export function restoreStudioAdjustmentLayer(savedLayer, runtimeLayer) {
  if (!runtimeLayer) throw new Error('Runtime layer is required.')
  if (savedLayer?.adjustment === undefined) {
    delete runtimeLayer.adjustment
    return runtimeLayer
  }
  runtimeLayer.adjustment = normalizeStudioAdjustment(savedLayer.adjustment)
  return runtimeLayer
}

export function copyStudioAdjustmentLayer(sourceLayer, targetLayer) {
  if (!targetLayer) throw new Error('Target layer is required.')
  if (!sourceLayer?.adjustment) {
    delete targetLayer.adjustment
    return targetLayer
  }
  targetLayer.adjustment = normalizeStudioAdjustment(sourceLayer.adjustment)
  return targetLayer
}

export function validateStudioAdjustmentLayer(layer) {
  if (!layer?.adjustment) return null
  return normalizeStudioAdjustment(layer.adjustment)
}
