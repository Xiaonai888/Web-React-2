export const BRUSH_STYLES = [
  { id: 'round', label: 'Round', description: 'Smooth round ink tip' },
  { id: 'pencil', label: 'Pencil', description: 'Fine, precise pencil line' },
  { id: 'marker', label: 'Marker', description: 'Angled chisel tip' },
  { id: 'airbrush', label: 'Airbrush', description: 'Soft, feathered spray tip' },
]

const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value))

function pressureFor(event, pointerType) {
  if (pointerType !== 'pen') return 1
  const pressure = Number(event.pressure)
  return Number.isFinite(pressure) && pressure > 0 ? clamp(pressure, 0.05, 1) : 0.5
}

function widthFor(stroke, pressure) {
  return stroke.pointerType === 'pen'
    ? Math.max(0.1, stroke.size * (0.25 + 0.75 * pressure))
    : stroke.size
}

function paintTip(ctx, stroke, x, y, pressure) {
  const diameter = widthFor(stroke, pressure)
  const radius = Math.max(0.05, diameter / 2)
  if (stroke.style === 'marker') {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(-Math.PI / 4)
    ctx.scale(radius * 1.2, Math.max(0.05, radius * 0.31))
    ctx.beginPath()
    ctx.arc(0, 0, 1, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
    return
  }
  if (stroke.style === 'airbrush') {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, stroke.color)
    gradient.addColorStop(0.25, stroke.color)
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    const left = Math.max(0, x - radius)
    const top = Math.max(0, y - radius)
    const right = Math.min(ctx.canvas.width, x + radius)
    const bottom = Math.min(ctx.canvas.height, y + radius)
    if (right <= left || bottom <= top) return
    ctx.save()
    ctx.globalAlpha = stroke.opacity / 100 * 0.32
    ctx.fillStyle = gradient
    ctx.fillRect(left, top, right - left, bottom - top)
    ctx.restore()
    return
  }
  ctx.beginPath()
  ctx.arc(x, y, Math.max(0.05, diameter / (stroke.style === 'pencil' ? 3.2 : 2)), 0, Math.PI * 2)
  ctx.fill()
}

function configureContext(ctx, stroke) {
  ctx.globalAlpha = stroke.opacity / 100 * (stroke.style === 'pencil' ? 0.85 : 1)
  ctx.globalCompositeOperation = 'source-over'
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = stroke.color
  ctx.fillStyle = stroke.color
}

export function beginStudioStroke(ctx, position, event, settings) {
  if (!ctx || !position || !Number.isFinite(position.x) || !Number.isFinite(position.y)) return null
  const requestedSize = Number(settings.size)
  const stroke = {
    pointerId: event.pointerId,
    pointerType: event.pointerType,
    size: clamp(Number.isFinite(requestedSize) ? requestedSize : 1, 0.1, 5000),
    opacity: clamp(Number(settings.opacity) || 100, 10, 100),
    color: settings.color,
    style: BRUSH_STYLES.some((item) => item.id === settings.style) ? settings.style : 'round',
    last: { x: position.x, y: position.y },
    lastPressure: pressureFor(event, event.pointerType),
  }
  ctx.save()
  configureContext(ctx, stroke)
  paintTip(ctx, stroke, position.x, position.y, stroke.lastPressure)
  ctx.restore()
  return stroke
}

export function extendStudioStroke(ctx, stroke, position, event) {
  if (!ctx || !stroke || event.pointerId !== stroke.pointerId || !position) return false
  if (!Number.isFinite(position.x) || !Number.isFinite(position.y)) return false
  const distance = Math.hypot(position.x - stroke.last.x, position.y - stroke.last.y)
  if (distance < 0.001) return false
  const nextPressure = pressureFor(event, stroke.pointerType)
  const stampMode = stroke.style === 'marker' || stroke.style === 'airbrush'
  const spacing = Math.max(0.1, stroke.size * 0.12)
  const segments = stampMode
    ? Math.min(stroke.size > 512 ? 1 : 128, Math.max(1, Math.ceil(distance / spacing)))
    : stroke.pointerType === 'pen'
      ? Math.min(256, Math.max(1, Math.ceil(distance / Math.max(0.1, stroke.size * 0.3))))
      : 1
  ctx.save()
  configureContext(ctx, stroke)
  let from = stroke.last
  for (let index = 1; index <= segments; index += 1) {
    const fraction = index / segments
    const to = {
      x: stroke.last.x + (position.x - stroke.last.x) * fraction,
      y: stroke.last.y + (position.y - stroke.last.y) * fraction,
    }
    const interpolatedPressure = stroke.lastPressure + (nextPressure - stroke.lastPressure) * ((index - 0.5) / segments)
    if (stampMode) {
      paintTip(ctx, stroke, to.x, to.y, interpolatedPressure)
    } else {
      ctx.lineWidth = widthFor(stroke, interpolatedPressure) * (stroke.style === 'pencil' ? 0.62 : 1)
      ctx.beginPath()
      ctx.moveTo(from.x, from.y)
      ctx.lineTo(to.x, to.y)
      ctx.stroke()
    }
    from = to
  }
  ctx.restore()
  stroke.last = { x: position.x, y: position.y }
  stroke.lastPressure = nextPressure
  return true
}
