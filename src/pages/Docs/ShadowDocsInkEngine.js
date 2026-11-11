export const SHADOW_DOCS_INK_COLORS = Object.freeze([
  '#b67a24', '#b52d2e', '#8f8f25', '#37658c', '#121820',
  '#f0b532', '#7a3ba6', '#1c8b62', '#ffffff', '#111111',
])

const TOOLS = new Set(['pen', 'pencil', 'highlighter', 'eraser'])
const MAX_STROKES = 2000
const MAX_POINTS = 2500
const unit = value => Math.max(0, Math.min(1, Number(value) || 0))
const thickness = value => Math.max(1, Math.min(24, Number(value) || 2))
const inkColor = value => /^#[0-9a-f]{6}$/i.test(String(value || '')) ? String(value).toLowerCase() : '#111111'

export function createShadowDocsInkStroke({ tool = 'pen', color = '#111111', width = 2, points = [] } = {}) {
  return {
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    tool: TOOLS.has(tool) && tool !== 'eraser' ? tool : 'pen',
    color: inkColor(color),
    width: thickness(width),
    points: points.slice(0, MAX_POINTS).map(point => [unit(point?.[0]), unit(point?.[1])]),
  }
}

export function normalizeShadowDocsInkStrokes(value) {
  if (!Array.isArray(value)) return []
  return value.slice(-MAX_STROKES).flatMap(stroke => {
    if (!stroke || typeof stroke !== 'object' || !Array.isArray(stroke.points) || !stroke.points.length) return []
    const clean = createShadowDocsInkStroke(stroke)
    clean.id = String(stroke.id || clean.id).slice(0, 100)
    clean.points = stroke.points.slice(0, MAX_POINTS).filter(point => Array.isArray(point) && point.length >= 2 && Number.isFinite(Number(point[0])) && Number.isFinite(Number(point[1]))).map(point => [unit(point[0]), unit(point[1])])
    return clean.points.length ? [clean] : []
  })
}

export function shadowDocsInkPointFromEvent(event, rect) {
  return [unit((event.clientX - rect.left) / Math.max(rect.width, 1)), unit((event.clientY - rect.top) / Math.max(rect.height, 1))]
}

function distanceToSegment(x, y, x1, y1, x2, y2) {
  const dx = x2 - x1
  const dy = y2 - y1
  const scale = dx * dx + dy * dy
  const t = scale ? Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / scale)) : 0
  return Math.hypot(x - x1 - t * dx, y - y1 - t * dy)
}

export function removeShadowDocsInkAtPoint(strokes, point, width, height, radius = 15) {
  const x = point[0] * width
  const y = point[1] * height
  return strokes.filter(stroke => {
    const points = stroke.points || []
    const limit = radius + (Number(stroke.width) || 2) / 2
    for (let index = 0; index < points.length; index += 1) {
      const from = points[Math.max(0, index - 1)]
      const to = points[index]
      if (distanceToSegment(x, y, from[0] * width, from[1] * height, to[0] * width, to[1] * height) <= limit) return false
    }
    return true
  })
}

export function paintShadowDocsInk(context, strokes, width, height) {
  if (!context || width <= 0 || height <= 0) return
  for (const stroke of strokes) {
    const points = stroke.points || []
    if (!points.length) continue
    context.save()
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.strokeStyle = inkColor(stroke.color)
    context.fillStyle = inkColor(stroke.color)
    context.lineWidth = thickness(stroke.width) * (stroke.tool === 'highlighter' ? 2.5 : 1)
    context.globalAlpha = stroke.tool === 'highlighter' ? 0.34 : stroke.tool === 'pencil' ? 0.78 : 1
    context.beginPath()
    context.moveTo(points[0][0] * width, points[0][1] * height)
    for (let index = 1; index < points.length; index += 1) context.lineTo(points[index][0] * width, points[index][1] * height)
    if (points.length === 1) {
      context.arc(points[0][0] * width, points[0][1] * height, context.lineWidth / 2, 0, Math.PI * 2)
      context.fill()
    } else context.stroke()
    context.restore()
  }
}
