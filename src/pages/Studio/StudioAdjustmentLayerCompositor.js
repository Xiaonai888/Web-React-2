import { isStudioAdjustmentLayer, normalizeStudioAdjustment, renderStudioAdjustmentCanvas } from './StudioAdjustmentLayerEngine'

const OPERATIONS = Object.freeze({
  normal: 'source-over',
  multiply: 'multiply',
  screen: 'screen',
  overlay: 'overlay',
  darken: 'darken',
  lighten: 'lighten',
  'soft-light': 'soft-light',
  'hard-light': 'hard-light',
  'color-dodge': 'color-dodge',
  'color-burn': 'color-burn',
  difference: 'difference',
  exclusion: 'exclusion',
})

function operation(mode) {
  const key = mode || 'normal'
  if (!Object.hasOwn(OPERATIONS, key)) throw new Error('Unsupported adjustment layer blend mode.')
  return OPERATIONS[key]
}

function snapshotCanvas(source) {
  const canvas = document.createElement('canvas')
  canvas.width = source.width
  canvas.height = source.height
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new Error('Could not capture adjustment source.')
  context.drawImage(source, 0, 0)
  return canvas
}

export function applyStudioAdjustmentLayer(context, layer) {
  if (!context?.canvas || !isStudioAdjustmentLayer(layer) || layer.visible === false || Number(layer.opacity) <= 0) return false
  const adjustment = normalizeStudioAdjustment(layer.adjustment)
  if (!adjustment.enabled) return false

  const source = snapshotCanvas(context.canvas)
  const rendered = renderStudioAdjustmentCanvas(source, adjustment)
  context.save()
  try {
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.globalAlpha = Math.max(0, Math.min(100, Number(layer.opacity) || 0)) / 100
    context.globalCompositeOperation = operation(layer.blendMode)
    context.drawImage(rendered, 0, 0, context.canvas.width, context.canvas.height)
  } finally {
    context.restore()
  }
  return true
}

export function renderStudioAdjustmentPreview(sourceCanvas, layer, maxDimension = 280) {
  if (!sourceCanvas || !layer?.adjustment) throw new Error('Adjustment preview source is unavailable.')
  const maximum = Number.isFinite(Number(maxDimension))
    ? Math.max(16, Math.min(4096, Math.round(Number(maxDimension))))
    : 280
  return renderStudioAdjustmentCanvas(sourceCanvas, normalizeStudioAdjustment(layer.adjustment), { maxDimension: maximum })
}
