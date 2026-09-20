import { studioLayerContext } from './StudioLayerEngine'

const HEX = /^#[0-9a-f]{6}$/i
const LAYOUTS = new Set(['single', 'vertical', 'horizontal', 'three', 'four'])

export function applyStudioComicPanels(stack, options = {}) {
  const ctx = stack && studioLayerContext(stack)
  if (!ctx) throw new Error('Select a visible, unlocked layer before adding comic panels.')
  const { layout = 'three', margin = 28, gutter = 18, border = 5, ink = '#111111', fill = 'transparent', opacity = 100 } = options
  const values = [margin, gutter, border, opacity].map(Number)
  if (!LAYOUTS.has(layout) || !HEX.test(ink) || (fill !== 'transparent' && !HEX.test(fill)) || values.some((value) => !Number.isFinite(value))) {
    throw new Error('Invalid comic panel settings.')
  }
  const [m, g, b, alpha] = values
  if (m < 4 || m > 200 || g < 4 || g > 100 || b < 1 || b > 30 || alpha < 0 || alpha > 100) {
    throw new Error('Comic panel settings are outside their supported range.')
  }
  if (alpha === 0) return false
  const w = stack.width
  const h = stack.height
  if (ctx.canvas.width !== w || ctx.canvas.height !== h) throw new Error('Layer and paper sizes do not match.')
  const x = m + b / 2
  const y = m + b / 2
  const width = w - 2 * m - b
  const height = h - 2 * m - b
  if (width < 24 || height < 24) throw new Error('Reduce the margin or use a larger paper.')
  const halfW = (width - g) / 2
  const halfH = (height - g) / 2
  let frames
  if (layout === 'single') frames = [[x, y, width, height]]
  else if (layout === 'vertical') frames = [[x, y, halfW, height], [x + halfW + g, y, halfW, height]]
  else if (layout === 'horizontal') frames = [[x, y, width, halfH], [x, y + halfH + g, width, halfH]]
  else if (layout === 'three') frames = [[x, y, width, halfH], [x, y + halfH + g, halfW, halfH], [x + halfW + g, y + halfH + g, halfW, halfH]]
  else frames = [[x, y, halfW, halfH], [x + halfW + g, y, halfW, halfH], [x, y + halfH + g, halfW, halfH], [x + halfW + g, y + halfH + g, halfW, halfH]]
  if (frames.some((frame) => frame[2] < 24 || frame[3] < 24)) throw new Error('Panel frames would be too small. Reduce margin or gutter.')
  ctx.save()
  try {
    ctx.globalAlpha = alpha / 100
    ctx.globalCompositeOperation = 'source-over'
    ctx.lineWidth = b
    ctx.strokeStyle = ink
    if (fill !== 'transparent') ctx.fillStyle = fill
    for (const [left, top, frameWidth, frameHeight] of frames) {
      if (fill !== 'transparent') ctx.fillRect(left, top, frameWidth, frameHeight)
      ctx.strokeRect(left, top, frameWidth, frameHeight)
    }
  } finally {
    ctx.restore()
  }
  return true
}
