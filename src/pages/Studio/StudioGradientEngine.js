import { studioLayerContext } from './StudioLayerEngine'

const HEX = /^#[0-9a-f]{6}$/i
const clamp = (value, low, high) => Math.min(high, Math.max(low, value))

export function applyStudioLayerGradient(stack, options = {}) {
  const ctx = stack && studioLayerContext(stack)
  if (!ctx) throw new Error('Select a visible, unlocked layer before applying a gradient.')
  const { from, to, type = 'linear', angle = 0, opacity = 100, reverse = false } = options
  if (!HEX.test(from) || !HEX.test(to)) throw new Error('Choose two valid gradient colors.')
  if (!['linear', 'radial'].includes(type)) throw new Error('Unsupported gradient type.')
  if (!Number.isFinite(Number(angle)) || !Number.isFinite(Number(opacity))) throw new Error('Invalid gradient settings.')
  const width = stack.width
  const height = stack.height
  if (ctx.canvas.width !== width || ctx.canvas.height !== height) throw new Error('Layer canvas dimensions do not match.')
  const alpha = clamp(Number(opacity), 0, 100) / 100
  if (alpha === 0) return false
  const cx = width / 2
  const cy = height / 2
  let gradient
  if (type === 'radial') {
    gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.hypot(width, height) / 2)
  } else {
    const radians = Number(angle) * Math.PI / 180
    const dx = Math.cos(radians)
    const dy = Math.sin(radians)
    const extent = Math.abs(dx) * width / 2 + Math.abs(dy) * height / 2
    gradient = ctx.createLinearGradient(cx - dx * extent, cy - dy * extent, cx + dx * extent, cy + dy * extent)
  }
  gradient.addColorStop(0, reverse ? to : from)
  gradient.addColorStop(1, reverse ? from : to)
  ctx.save()
  try {
    ctx.globalAlpha = alpha
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  } finally {
    ctx.restore()
  }
  return true
}
