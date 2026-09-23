const HEX = /^#[0-9a-f]{6}$/i

export function createStudioRulerGuide(width, height, { axis = 'vertical', position = 0, angle = 0 } = {}) {
  if (![width, height].every((value) => Number.isInteger(value) && value > 0)) throw new Error('Invalid canvas size for a guide.')
  if (!['vertical', 'horizontal', 'angled'].includes(axis) || !Number.isFinite(position) || !Number.isFinite(angle)) throw new Error('Invalid ruler guide settings.')
  if (axis === 'angled') {
    const radians = angle * Math.PI / 180
    const normal = { x: -Math.sin(radians), y: Math.cos(radians) }
    const center = { x: width / 2, y: height / 2 }
    return { axis, normal, position, center, width, height }
  }
  if (position < 0 || position > (axis === 'vertical' ? width : height)) throw new Error('The guide is outside the canvas.')
  return { axis, position, width, height }
}

export function snapStudioPointToGuides(point, guides, threshold = 8) {
  if (!Number.isFinite(point?.x) || !Number.isFinite(point?.y) || !Array.isArray(guides) || !Number.isFinite(threshold) || threshold < 0) throw new Error('Invalid guide snapping settings.')
  let x = point.x
  let y = point.y
  let horizontalDistance = threshold
  let verticalDistance = threshold
  let angledDistance = threshold
  for (const guide of guides) {
    if (guide?.axis === 'vertical') {
      const distance = Math.abs(point.x - guide.position)
      if (distance <= horizontalDistance) { horizontalDistance = distance; x = guide.position }
    } else if (guide?.axis === 'horizontal') {
      const distance = Math.abs(point.y - guide.position)
      if (distance <= verticalDistance) { verticalDistance = distance; y = guide.position }
    } else if (guide?.axis === 'angled' && guide.normal && guide.center) {
      const signed = (point.x - guide.center.x) * guide.normal.x + (point.y - guide.center.y) * guide.normal.y - guide.position
      if (Math.abs(signed) <= angledDistance) { angledDistance = Math.abs(signed); if (horizontalDistance === threshold && verticalDistance === threshold) { x = point.x - signed * guide.normal.x; y = point.y - signed * guide.normal.y } }
    }
  }
  return { x, y }
}

export function renderStudioRulerGuides(ctx, guides, { color = '#40B9FF', dash = 6 } = {}) {
  const { width, height } = ctx?.canvas || {}
  if (!Number.isFinite(width) || !Number.isFinite(height) || !Array.isArray(guides) || !HEX.test(color) || !Number.isFinite(dash) || dash < 1 || dash > 50) throw new Error('Invalid ruler guide overlay settings.')
  ctx.save()
  try {
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.globalAlpha = 0.8
    ctx.globalCompositeOperation = 'source-over'
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    ctx.setLineDash([dash, dash])
    ctx.beginPath()
    for (const guide of guides) {
      if (guide?.width !== width || guide?.height !== height) throw new Error('The guide belongs to a different canvas.')
      if (guide.axis === 'vertical') {
        ctx.moveTo(guide.position + 0.5, 0)
        ctx.lineTo(guide.position + 0.5, height)
      } else if (guide.axis === 'horizontal') {
        ctx.moveTo(0, guide.position + 0.5)
        ctx.lineTo(width, guide.position + 0.5)
      } else if (guide.axis === 'angled') {
        const tangent = { x: guide.normal.y, y: -guide.normal.x }
        const origin = { x: guide.center.x + guide.position * guide.normal.x, y: guide.center.y + guide.position * guide.normal.y }
        const length = Math.hypot(width, height)
        ctx.moveTo(origin.x - tangent.x * length, origin.y - tangent.y * length)
        ctx.lineTo(origin.x + tangent.x * length, origin.y + tangent.y * length)
      } else throw new Error('Unsupported ruler guide.')
    }
    ctx.stroke()
  } finally {
    ctx.restore()
  }
}
