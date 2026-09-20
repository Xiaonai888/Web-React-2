export const BRUSH_STYLES = [
  { id: 'round', label: 'Round', description: 'Smooth round ink tip' },
  { id: 'pencil', label: 'Pencil', description: 'Fine, precise pencil line' },
  { id: 'marker', label: 'Marker', description: 'Angled chisel tip' },
  { id: 'airbrush', label: 'Airbrush', description: 'Soft, feathered spray tip' },
  { id: 'gpen', label: 'G-Pen', description: 'Pressure-sensitive manga inking pen' },
  { id: 'dryink', label: 'Dry Ink', description: 'Broken, textured dry ink strokes' },
]

const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value))

function pressureFor(event, pointerType) {
  if (pointerType !== 'pen') return 1
  const pressure = Number(event.pressure)
  return Number.isFinite(pressure) && pressure > 0 ? clamp(pressure, 0.05, 1) : 0.5
}

function widthFor(stroke, pressure) {
  const factor = stroke.style === 'gpen' ? 0.12 + 0.88 * pressure : 0.25 + 0.75 * pressure
  return stroke.pointerType === 'pen'
    ? Math.max(0.1, stroke.size * factor)
    : stroke.style === 'gpen' ? stroke.size * 0.82 : stroke.size
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
  if (stroke.style === 'dryink') {
    const count = Math.min(28, Math.max(4, Math.ceil(diameter * 0.7)))
    ctx.save()
    ctx.globalAlpha = stroke.opacity / 100 * 0.84
    for (let index = 0; index < count; index += 1) {
      const angle = index * 2.399963229728653 + x * 0.013 + y * 0.017
      const ring = Math.sqrt((index + 0.5) / count)
      const px = x + Math.cos(angle) * radius * ring
      const py = y + Math.sin(angle) * radius * ring
      const dot = Math.max(0.12, Math.min(2.2, diameter * (index % 4 === 0 ? 0.11 : 0.055)))
      ctx.beginPath()
      ctx.arc(px, py, dot, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
    return
  }
  ctx.beginPath()
  ctx.arc(x, y, Math.max(0.05, diameter / (stroke.style === 'pencil' ? 3.2 : 2)), 0, Math.PI * 2)
  ctx.fill()
}

function configureContext(ctx, stroke) {
  ctx.globalAlpha = stroke.opacity / 100 * (stroke.style === 'pencil' ? 0.85 : 1)
  ctx.globalCompositeOperation = stroke.erase ? 'destination-out' : 'source-over'
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
    erase: settings.erase === true,
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
  const stampMode = stroke.style === 'marker' || stroke.style === 'airbrush' || stroke.style === 'dryink'
  const spacing = stroke.style === 'dryink' ? Math.max(0.8, stroke.size * 0.14) : Math.max(0.1, stroke.size * 0.12)
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
