import { studioActiveLayer } from './StudioLayerEngine'

export function canMergeStudioLayerDown(stack) {
  if (!stack || !Array.isArray(stack.layers)) return false
  const index = stack.layers.findIndex((layer) => layer.id === stack.activeLayerId)
  if (index < 1) return false
  const upper = stack.layers[index]
  const lower = stack.layers[index - 1]
  return Boolean(upper?.canvas && lower?.canvas && upper.visible && lower.visible &&
    !upper.locked && !lower.locked && upper.opacity === 100 && lower.opacity === 100 &&
    upper.canvas.width === stack.width && upper.canvas.height === stack.height &&
    lower.canvas.width === stack.width && lower.canvas.height === stack.height)
}

export function mergeStudioLayerDown(stack) {
  if (!canMergeStudioLayerDown(stack)) {
    throw new Error('To merge, select a visible, unlocked layer above another visible, unlocked layer. Both need 100% opacity.')
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
