import { studioLayerContext } from './StudioLayerEngine'
import { studioLayerCanEdit } from './StudioLayerGroupEngine'

const HEX = /^#[0-9a-f]{6}$/i

export function applyStudioCustomComicFrames(stack, frames, { border = 5, ink = '#111111', fill = 'transparent', opacity = 100 } = {}) {
  if (!studioLayerCanEdit(stack)) throw new Error('Select a visible, unlocked layer before adding comic frames.')
  const ctx = studioLayerContext(stack)
  const { width, height } = ctx.canvas
  if (width !== stack.width || height !== stack.height) throw new Error('Layer dimensions do not match the canvas.')
  if (!Array.isArray(frames) || frames.length < 1 || frames.length > 32) throw new Error('Choose between 1 and 32 custom comic frames.')
  if (!Number.isFinite(border) || border < 1 || border > 30 || !Number.isFinite(opacity) || opacity < 0 || opacity > 100 || !HEX.test(ink) || (fill !== 'transparent' && !HEX.test(fill))) throw new Error('Invalid custom comic frame settings.')
  const rectangles = frames.map((frame) => {
    const { x, y, width: frameWidth, height: frameHeight } = frame || {}
    if (![x, y, frameWidth, frameHeight].every(Number.isFinite) || frameWidth <= border || frameHeight <= border || frameWidth < 12 || frameHeight < 12 || x < 0 || y < 0 || x + frameWidth > width || y + frameHeight > height) throw new Error('A custom comic frame is outside the paper.')
    return { x, y, frameWidth, frameHeight }
  })
  if (opacity === 0) return false
  ctx.save()
  try {
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.globalAlpha = opacity / 100
    ctx.globalCompositeOperation = 'source-over'
    ctx.strokeStyle = ink
    ctx.lineWidth = border
    ctx.lineJoin = 'miter'
    if (fill !== 'transparent') ctx.fillStyle = fill
    for (const { x, y, frameWidth, frameHeight } of rectangles) {
      const inset = border / 2
      const left = x + inset
      const top = y + inset
      const innerWidth = frameWidth - border
      const innerHeight = frameHeight - border
      if (innerWidth <= 0 || innerHeight <= 0) continue
      if (fill !== 'transparent') ctx.fillRect(left, top, innerWidth, innerHeight)
      ctx.strokeRect(left, top, innerWidth, innerHeight)
    }
  } finally {
    ctx.restore()
  }
  return true
}
