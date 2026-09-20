import { studioLayerContext } from './StudioLayerEngine'

const HEX = /^#[0-9a-f]{6}$/i
const clamp = (value, low, high) => Math.min(high, Math.max(low, value))

export function applyStudioSpeechBubble(stack, options = {}) {
  const ctx = stack && studioLayerContext(stack)
  if (!ctx) throw new Error('Select a visible, unlocked layer before adding a bubble.')
  const { shape = 'ellipse', width = 240, height = 160, border = 5, fill = '#FFFFFF', ink = '#111111', opacity = 100, tail = 'bottom', text = '', fontSize = 24 } = options
  if (!['ellipse', 'rounded', 'thought', 'shout'].includes(shape) || !['bottom', 'top', 'left', 'right', 'none'].includes(tail) || !HEX.test(fill) || !HEX.test(ink)) throw new Error('Invalid bubble style or color.')
  const numbers = [width, height, border, opacity, fontSize].map(Number)
  if (numbers.some((value) => !Number.isFinite(value))) throw new Error('Invalid bubble settings.')
  const [requestedWidth, requestedHeight, strokeWidth, alpha, textSize] = numbers
  if (requestedWidth < 80 || requestedWidth > 1600 || requestedHeight < 60 || requestedHeight > 1200 || strokeWidth < 1 || strokeWidth > 30 || alpha < 0 || alpha > 100 || textSize < 10 || textSize > 100 || String(text).length > 1200) throw new Error('Bubble settings are outside their supported range.')
  if (alpha === 0) return false
  const canvasWidth = stack.width
  const canvasHeight = stack.height
  if (canvasWidth < 64 || canvasHeight < 64) throw new Error('The paper is too small.')
  const margin = Math.ceil(strokeWidth / 2) + 2
  const extent = Math.max(0, Math.ceil(Math.min(requestedWidth, requestedHeight) * 0.2))
  const leftInset = tail === 'left' ? extent : 0
  const rightInset = tail === 'right' ? extent : 0
  const topInset = tail === 'top' ? extent : 0
  const bottomInset = tail === 'bottom' ? extent : 0
  const w = Math.min(requestedWidth, canvasWidth - leftInset - rightInset - margin * 2)
  const h = Math.min(requestedHeight, canvasHeight - topInset - bottomInset - margin * 2)
  if (w < 40 || h < 40) throw new Error('The paper is too small for this bubble.')
  const cx = canvasWidth / 2
  const cy = canvasHeight / 2
  const x = clamp(cx - w / 2, margin + leftInset, canvasWidth - margin - rightInset - w)
  const y = clamp(cy - h / 2, margin + topInset, canvasHeight - margin - bottomInset - h)
  const midX = x + w / 2
  const midY = y + h / 2
  const tailSize = Math.min(extent, Math.min(w, h) * 0.34)
  ctx.save()
  try {
    ctx.globalAlpha = alpha / 100
    ctx.globalCompositeOperation = 'source-over'
    ctx.lineWidth = strokeWidth
    ctx.lineJoin = 'round'
    ctx.fillStyle = fill
    ctx.strokeStyle = ink
    if (tail !== 'none' && shape !== 'shout' && tailSize > 0) {
      if (shape === 'thought') {
        const directions = { bottom: [0, 1], top: [0, -1], left: [-1, 0], right: [1, 0] }
        const [dx, dy] = directions[tail]
        const startX = midX + dx * w * 0.45
        const startY = midY + dy * h * 0.45
        for (let index = 1; index <= 2; index += 1) {
          ctx.beginPath()
          ctx.arc(startX + dx * tailSize * index * 0.42, startY + dy * tailSize * index * 0.42, Math.max(2, tailSize * (0.22 - index * 0.05)), 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
        }
      } else {
        const directions = { bottom: [0, 1], top: [0, -1], left: [-1, 0], right: [1, 0] }
        const [dx, dy] = directions[tail]
        const baseX = midX + dx * w * 0.46
        const baseY = midY + dy * h * 0.46
        const halfBase = tailSize * 0.36
        ctx.beginPath()
        ctx.moveTo(baseX - dy * halfBase, baseY + dx * halfBase)
        ctx.lineTo(baseX + dx * tailSize, baseY + dy * tailSize)
        ctx.lineTo(baseX + dy * halfBase, baseY - dx * halfBase)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
      }
    }
    ctx.beginPath()
    if (shape === 'rounded') {
      const radius = Math.min(w, h) * 0.16
      ctx.roundRect(x, y, w, h, radius)
    } else if (shape === 'shout') {
      const count = 24
      for (let index = 0; index < count * 2; index += 1) {
        const angle = -Math.PI / 2 + index * Math.PI / count
        const radius = index % 2 ? 0.83 : 1
        const px = midX + Math.cos(angle) * (w / 2) * radius
        const py = midY + Math.sin(angle) * (h / 2) * radius
        if (index === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
    } else {
      ctx.ellipse(midX, midY, w / 2, h / 2, 0, 0, Math.PI * 2)
    }
    ctx.fill()
    ctx.stroke()
    const content = String(text).trim()
    if (content) {
      ctx.fillStyle = ink
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const size = Math.min(textSize, h * 0.18)
      ctx.font = `${size}px sans-serif`
      const maxWidth = w * (shape === 'shout' ? 0.57 : 0.7)
      const maxLines = Math.max(1, Math.floor(h * 0.62 / (size * 1.3)))
      const lines = ['']
      for (const character of Array.from(content)) {
        if (character === '\n') { if (lines.length >= maxLines) break; lines.push(''); continue }
        const last = lines.length - 1
        if (lines[last] && ctx.measureText(lines[last] + character).width > maxWidth) {
          if (lines.length >= maxLines) break
          lines.push(character)
        } else lines[last] += character
      }
      const lineHeight = size * 1.3
      lines.forEach((line, index) => ctx.fillText(line, midX, midY + (index - (lines.length - 1) / 2) * lineHeight, maxWidth))
    }
  } finally {
    ctx.restore()
  }
  return true
}
