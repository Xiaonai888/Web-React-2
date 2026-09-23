import { applyStudioLayerGradient } from './StudioGradientEngine'
import { studioLayerContext } from './StudioLayerEngine'
import { studioLayerCanEdit } from './StudioLayerGroupEngine'

export function applyStudioSelectedGradient(stack, selection, options = {}) {
  if (!studioLayerCanEdit(stack)) throw new Error('Select a visible, unlocked layer before applying a gradient.')
  const ctx = studioLayerContext(stack)
  const { width, height } = ctx.canvas
  if (width !== stack.width || height !== stack.height) throw new Error('Layer dimensions do not match the canvas.')
  if (selection?.width !== width || selection?.height !== height || selection?.data?.length !== width * height) throw new Error('A selection matching the canvas is required.')
  if (!selection.data.some((value) => value > 0)) return false
  const surface = document.createElement('canvas')
  surface.width = width
  surface.height = height
  const previewContext = surface.getContext('2d', { willReadFrequently: true })
  if (!previewContext) throw new Error('Could not prepare the selected gradient.')
  const temporary = { width, height, activeLayerId: 'gradient-preview', layers: [{ id: 'gradient-preview', canvas: surface, locked: false, visible: true }] }
  if (!applyStudioLayerGradient(temporary, options)) return false
  const image = previewContext.getImageData(0, 0, width, height)
  for (let index = 0; index < selection.data.length; index += 1) image.data[index * 4 + 3] = Math.round(image.data[index * 4 + 3] * selection.data[index] / 255)
  previewContext.putImageData(image, 0, 0)
  ctx.save()
  try {
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
    ctx.drawImage(surface, 0, 0)
  } finally {
    ctx.restore()
  }
  return true
}
