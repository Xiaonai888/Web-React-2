const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value))

function pressureFor(event, pointerType) {
  if (pointerType !== 'pen') return 1
  const pressure = Number(event.pressure)
  return Number.isFinite(pressure) && pressure > 0 ? clamp(pressure, 0.05, 1) : 0.5
}

function widthFor(stroke, pressure) {
  return stroke.pointerType === 'pen'
    ? Math.max(0.65, stroke.size * (0.25 + 0.75 * pressure))
    : stroke.size
}

function configureContext(ctx, stroke) {
  ctx.globalAlpha = stroke.opacity / 100
  ctx.globalCompositeOperation = 'source-over'
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = stroke.color
  ctx.fillStyle = stroke.color
}

export function beginStudioStroke(ctx, position, event, settings) {
  if (!ctx || !position || !Number.isFinite(position.x) || !Number.isFinite(position.y)) return null
  const stroke = {
    pointerId: event.pointerId,
    pointerType: event.pointerType,
    size: clamp(Number(settings.size) || 1, 1, 80),
    opacity: clamp(Number(settings.opacity) || 100, 10, 100),
    color: settings.color,
    last: { x: position.x, y: position.y },
    lastPressure: pressureFor(event, event.pointerType),
  }
  ctx.save()
  configureContext(ctx, stroke)
  ctx.beginPath()
  ctx.arc(position.x, position.y, Math.max(0.5, widthFor(stroke, stroke.lastPressure) / 2), 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
  return stroke
}

export function extendStudioStroke(ctx, stroke, position, event) {
  if (!ctx || !stroke || event.pointerId !== stroke.pointerId || !position) return false
  if (!Number.isFinite(position.x) || !Number.isFinite(position.y)) return false
  const distance = Math.hypot(position.x - stroke.last.x, position.y - stroke.last.y)
  if (distance < 0.001) return false
  const nextPressure = pressureFor(event, stroke.pointerType)
  const segments = stroke.pointerType === 'pen'
    ? Math.min(256, Math.max(1, Math.ceil(distance / Math.max(2, stroke.size * 0.3))))
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
    ctx.lineWidth = widthFor(stroke, interpolatedPressure)
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
    from = to
  }
  ctx.restore()
  stroke.last = { x: position.x, y: position.y }
  stroke.lastPressure = nextPressure
  return true
}
