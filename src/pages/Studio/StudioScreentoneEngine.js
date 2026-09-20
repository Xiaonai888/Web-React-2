import { studioLayerContext } from './StudioLayerEngine'

const HEX = /^#[0-9a-f]{6}$/i
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value))

export function applyStudioScreentone(stack, options = {}) {
  const context = stack && studioLayerContext(stack)
  if (!context) throw new Error('Select a visible, unlocked layer before applying a screentone.')
  const { type = 'dots', spacing = 18, density = 35, angle = 0, opacity = 100, color = '#111111' } = options
  if (!['dots', 'lines', 'crosshatch'].includes(type) || !HEX.test(color)) throw new Error('Invalid screentone style or color.')
  const numbers = [spacing, density, angle, opacity].map(Number)
  if (numbers.some((number) => !Number.isFinite(number))) throw new Error('Invalid screentone settings.')
  const [tileSize, fillAmount, rotation, alpha] = numbers
  if (tileSize < 8 || tileSize > 96 || fillAmount < 5 || fillAmount > 95 || rotation < -180 || rotation > 180 || alpha < 0 || alpha > 100) {
    throw new Error('Screentone settings are outside their supported range.')
  }
  if (alpha === 0) return false
  const width = stack.width
  const height = stack.height
  if (context.canvas.width !== width || context.canvas.height !== height) throw new Error('Layer size does not match the paper.')
  const size = Math.round(tileSize)
  const tile = document.createElement('canvas')
  tile.width = size
  tile.height = size
  const ink = tile.getContext('2d')
  if (!ink) throw new Error('Could not create the screentone pattern.')
  ink.fillStyle = color
  ink.strokeStyle = color
  if (type === 'dots') {
    ink.beginPath()
    ink.arc(size / 2, size / 2, size * clamp(fillAmount, 5, 95) / 210, 0, Math.PI * 2)
    ink.fill()
  } else {
    ink.lineWidth = Math.max(0.5, size * fillAmount / 180)
    ink.beginPath()
    ink.moveTo(0, size / 2)
    ink.lineTo(size, size / 2)
    if (type === 'crosshatch') {
      ink.moveTo(size / 2, 0)
      ink.lineTo(size / 2, size)
    }
    ink.stroke()
  }
  const pattern = context.createPattern(tile, 'repeat')
  if (!pattern) throw new Error('Could not repeat the screentone pattern.')
  const diameter = Math.ceil(Math.hypot(width, height))
  context.save()
  try {
    context.globalAlpha = alpha / 100
    context.globalCompositeOperation = 'source-over'
    context.translate(width / 2, height / 2)
    context.rotate(rotation * Math.PI / 180)
    context.fillStyle = pattern
    context.fillRect(-diameter, -diameter, diameter * 2, diameter * 2)
  } finally {
    context.restore()
  }
  return true
}
