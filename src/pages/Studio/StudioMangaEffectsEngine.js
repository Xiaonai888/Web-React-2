import { studioLayerContext } from './StudioLayerEngine'

const HEX = /^#[0-9a-f]{6}$/i
const TYPES = ['speed', 'impact', 'sparkles']

export function drawStudioMangaEffect(ctx, options = {}) {
  if (!ctx?.canvas || ctx.canvas.width < 1 || ctx.canvas.height < 1) throw new Error('A drawing canvas is required.')
  const { type = 'speed', count = 28, thickness = 3, color = '#111111', opacity = 100, centerX = 50, centerY = 50, scale = 65 } = options
  if (!TYPES.includes(type) || !HEX.test(color)) throw new Error('Unsupported effect or color.')
  const values = [count, thickness, opacity, centerX, centerY, scale].map(Number)
  if (values.some((value) => !Number.isFinite(value))) throw new Error('Invalid manga effect settings.')
  const [amount, lineWidth, alpha, horizontal, vertical, size] = values
  if (!Number.isInteger(amount) || amount < 8 || amount > 100 || lineWidth < 1 || lineWidth > 20 ||
      alpha < 0 || alpha > 100 || horizontal < 0 || horizontal > 100 || vertical < 0 || vertical > 100 ||
      size < 10 || size > 100) throw new Error('Manga effect settings are outside their supported range.')
  if (alpha === 0) return false
  const width = ctx.canvas.width
  const height = ctx.canvas.height
  const cx = width * horizontal / 100
  const cy = height * vertical / 100
  const radius = Math.max(3, Math.min(width, height) * size / 170)
  const outer = Math.hypot(Math.max(cx, width - cx), Math.max(cy, height - cy)) + lineWidth * 2
  ctx.save()
  try {
    ctx.globalAlpha = alpha / 100
    ctx.globalCompositeOperation = 'source-over'
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    for (let index = 0; index < amount; index += 1) {
      const angle = index * Math.PI * 2 / amount
      const dx = Math.cos(angle)
      const dy = Math.sin(angle)
      const shift = (index * 37 % 23) / 23
      if (type === 'sparkles') {
        const distance = radius * (0.2 + shift * 1.3)
        const x = cx + dx * distance
        const y = cy + dy * distance
        const span = Math.max(2, radius * (0.035 + ((index * 13) % 9) / 170))
        ctx.beginPath()
        ctx.moveTo(x, y - span)
        ctx.quadraticCurveTo(x + span * 0.17, y - span * 0.17, x + span, y)
        ctx.quadraticCurveTo(x + span * 0.17, y + span * 0.17, x, y + span)
        ctx.quadraticCurveTo(x - span * 0.17, y + span * 0.17, x - span, y)
        ctx.quadraticCurveTo(x - span * 0.17, y - span * 0.17, x, y - span)
        ctx.closePath()
        ctx.fill()
      } else {
        const inner = type === 'speed' ? radius * (0.8 + shift * 0.55) : radius * (0.1 + shift * 0.4)
        const end = type === 'speed' ? outer : radius * (1 + shift * 0.85)
        ctx.beginPath()
        ctx.moveTo(cx + dx * inner, cy + dy * inner)
        ctx.lineTo(cx + dx * end, cy + dy * end)
        ctx.stroke()
      }
    }
  } finally {
    ctx.restore()
  }
  return true
}

export function applyStudioMangaEffect(stack, options = {}) {
  const ctx = stack && studioLayerContext(stack)
  if (!ctx) throw new Error('Select a visible, unlocked layer before applying an effect.')
  if (ctx.canvas.width !== stack.width || ctx.canvas.height !== stack.height) throw new Error('The selected layer has an incompatible canvas size.')
  return drawStudioMangaEffect(ctx, options)
}
