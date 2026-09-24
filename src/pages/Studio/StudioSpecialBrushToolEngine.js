const HEX = /^#[0-9a-f]{6}$/i
const MODES = new Set(['sparkle', 'star', 'glow'])

function drawStamp(ctx, x, y, stroke, rotation) {
  const radius = stroke.size / 2
  ctx.save()
  try {
    ctx.globalAlpha = stroke.opacity / 100
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = stroke.color
    ctx.translate(x, y)
    if (stroke.mode === 'glow') {
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius)
      gradient.addColorStop(0, stroke.color)
      gradient.addColorStop(0.3, stroke.color)
      gradient.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = gradient
      ctx.globalAlpha *= 0.6
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2)
    } else {
      ctx.rotate(rotation)
      ctx.beginPath()
      if (stroke.mode === 'star') {
        for (let vertex = 0; vertex < 10; vertex += 1) {
          const angle = vertex * Math.PI / 5 - Math.PI / 2
          const distance = vertex % 2 ? radius * 0.38 : radius
          const px = Math.cos(angle) * distance
          const py = Math.sin(angle) * distance
          if (vertex === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
      } else {
        ctx.moveTo(0, -radius)
        ctx.quadraticCurveTo(radius * 0.14, -radius * 0.14, radius, 0)
        ctx.quadraticCurveTo(radius * 0.14, radius * 0.14, 0, radius)
        ctx.quadraticCurveTo(-radius * 0.14, radius * 0.14, -radius, 0)
        ctx.quadraticCurveTo(-radius * 0.14, -radius * 0.14, 0, -radius)
      }
      ctx.closePath()
      ctx.fill()
    }
  } finally {
    ctx.restore()
  }
}

function paint(ctx, stroke, point) {
  const { width, height } = ctx.canvas
  const radius = stroke.size / 2
  const left = Math.max(0, Math.floor(point.x - radius - 2))
  const top = Math.max(0, Math.floor(point.y - radius - 2))
  const right = Math.min(width, Math.ceil(point.x + radius + 2))
  const bottom = Math.min(height, Math.ceil(point.y + radius + 2))
  if (right <= left || bottom <= top || !stroke.opacity) return false
  const rotation = (stroke.stamps * 2.399963229728653) % (Math.PI * 2)
  stroke.stamps += 1
  if (!stroke.selection) {
    drawStamp(ctx, point.x, point.y, stroke, rotation)
    return true
  }
  const scratch = document.createElement('canvas')
  scratch.width = right - left
  scratch.height = bottom - top
  const ink = scratch.getContext('2d', { willReadFrequently: true })
  if (!ink) throw new Error('Could not create a special brush buffer.')
  drawStamp(ink, point.x - left, point.y - top, stroke, rotation)
  const image = ink.getImageData(0, 0, scratch.width, scratch.height)
  let visible = false
  for (let y = 0; y < scratch.height; y += 1) {
    for (let x = 0; x < scratch.width; x += 1) {
      const index = (y * scratch.width + x) * 4 + 3
      image.data[index] = Math.round(image.data[index] * stroke.selection.data[(top + y) * width + left + x] / 255)
      if (image.data[index]) visible = true
    }
  }
  if (!visible) return false
  ink.putImageData(image, 0, 0)
  ctx.save()
  try {
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
    ctx.drawImage(scratch, left, top)
  } finally {
    ctx.restore()
  }
  return true
}

export function beginStudioSpecialBrush(ctx, point, { mode = 'sparkle', size = 24, color = '#FFFFFF', opacity = 100, selection = null } = {}) {
  const canvas = ctx?.canvas
  if (!canvas?.width || !canvas?.height || !Number.isFinite(point?.x) || !Number.isFinite(point?.y)) throw new Error('An editable canvas and a valid starting point are required.')
  if (!MODES.has(mode) || !HEX.test(color) || !Number.isFinite(size) || size < 1 || size > 256 || !Number.isFinite(opacity) || opacity < 0 || opacity > 100) throw new Error('Invalid special brush settings.')
  if (selection && (selection.width !== canvas.width || selection.height !== canvas.height || selection.data?.length !== canvas.width * canvas.height)) throw new Error('Selection dimensions do not match the canvas.')
  const stroke = { mode, size, color, opacity, selection, width: canvas.width, height: canvas.height, last: { x: point.x, y: point.y }, stamps: 0, changed: false }
  stroke.changed = paint(ctx, stroke, point)
  return stroke
}

export function extendStudioSpecialBrush(ctx, stroke, point) {
  if (!ctx?.canvas || !stroke || !Number.isFinite(point?.x) || !Number.isFinite(point?.y) || ctx.canvas.width !== stroke.width || ctx.canvas.height !== stroke.height) throw new Error('Invalid special brush stroke.')
  const distance = Math.hypot(point.x - stroke.last.x, point.y - stroke.last.y)
  if (distance < 0.01) return false
  const count = Math.min(512, Math.ceil(distance / Math.max(2, stroke.size * 0.65)))
  let changed = false
  for (let step = 1; step <= count; step += 1) {
    const ratio = step / count
    changed = paint(ctx, stroke, { x: stroke.last.x + (point.x - stroke.last.x) * ratio, y: stroke.last.y + (point.y - stroke.last.y) * ratio }) || changed
  }
  stroke.last = { x: point.x, y: point.y }
  stroke.changed = changed || stroke.changed
  return changed
}
