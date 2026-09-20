import { studioActiveLayer } from './StudioLayerEngine'
import { studioLayerCanEdit } from './StudioLayerGroupEngine'

export function canMergeStudioLayerDown(stack) {
  if (!stack || !Array.isArray(stack.layers)) return false
  const index = stack.layers.findIndex((layer) => layer.id === stack.activeLayerId)
  if (index < 1) return false
  const upper = stack.layers[index]
  const lower = stack.layers[index - 1]
  return Boolean(upper?.canvas && lower?.canvas && upper.visible && lower.visible &&
    studioLayerCanEdit(stack, upper.id) && studioLayerCanEdit(stack, lower.id) &&
    (upper.groupId || null) === (lower.groupId || null) &&
    (upper.blendMode || 'normal') === 'normal' && (lower.blendMode || 'normal') === 'normal' &&
    upper.opacity === 100 && lower.opacity === 100 &&
    upper.canvas.width === stack.width && upper.canvas.height === stack.height &&
    lower.canvas.width === stack.width && lower.canvas.height === stack.height)
}

export function mergeStudioLayerDown(stack) {
  if (!canMergeStudioLayerDown(stack)) {
    throw new Error('To merge, select two adjacent visible, unlocked layers outside locked groups. Both must have 100% opacity, Normal blend mode, and belong to the same group (or neither to a group).')
  }
  const upper = studioActiveLayer(stack)
  const index = stack.layers.findIndex((layer) => layer.id === upper.id)
  const lower = stack.layers[index - 1]
  const merged = document.createElement('canvas')
  merged.width = stack.width
  merged.height = stack.height
  const ctx = merged.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('Could not create the merged layer.')
  ctx.drawImage(lower.canvas, 0, 0)
  ctx.drawImage(upper.canvas, 0, 0)
  lower.canvas = merged
  stack.layers.splice(index, 1)
  stack.activeLayerId = lower.id
  return lower
}
