import { resizeStudioCanvas } from './StudioCanvasResizeToolEngine.js'

export function cropStudioCanvas(stack, rect) {
  const { x, y, width, height } = rect || {}
  if (![x, y, width, height].every(Number.isInteger) || width < 1 || height < 1 || x < 0 || y < 0 || x + width > stack?.width || y + height > stack?.height) throw new Error('Invalid crop rectangle.')
  return resizeStudioCanvas(stack, { width, height, offsetX: -x, offsetY: -y })
}
