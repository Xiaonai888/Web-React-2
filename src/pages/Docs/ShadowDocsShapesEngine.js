const SHAPES = new Set(['rectangle', 'rounded', 'ellipse', 'triangle', 'diamond', 'arrow', 'star', 'line'])

export function createShadowDocsShapeImage(shape = 'rectangle', color = '#2563eb') {
  if (typeof document === 'undefined') return ''
  const kind = SHAPES.has(shape) ? shape : 'rectangle'
  const fill = /^#[0-9a-f]{6}$/i.test(color) ? color : '#2563eb'
  const canvas = document.createElement('canvas')
  canvas.width = 480
  canvas.height = 260
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  ctx.fillStyle = fill
  ctx.strokeStyle = fill
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  const polygon = points => {
    ctx.beginPath()
    points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y))
    ctx.closePath()
    ctx.fill()
  }
  if (kind === 'rectangle') ctx.fillRect(44, 38, 392, 184)
  if (kind === 'rounded') {
    ctx.beginPath()
    ctx.moveTo(80, 38)
    ctx.lineTo(400, 38)
    ctx.quadraticCurveTo(436, 38, 436, 74)
    ctx.lineTo(436, 186)
    ctx.quadraticCurveTo(436, 222, 400, 222)
    ctx.lineTo(80, 222)
    ctx.quadraticCurveTo(44, 222, 44, 186)
    ctx.lineTo(44, 74)
    ctx.quadraticCurveTo(44, 38, 80, 38)
    ctx.closePath()
    ctx.fill()
  }
  if (kind === 'ellipse') {
    ctx.beginPath()
    ctx.ellipse(240, 130, 195, 93, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  if (kind === 'triangle') polygon([[240, 24], [447, 232], [33, 232]])
  if (kind === 'diamond') polygon([[240, 20], [451, 130], [240, 240], [29, 130]])
  if (kind === 'arrow') polygon([[35, 87], [278, 87], [278, 28], [456, 130], [278, 232], [278, 173], [35, 173]])
  if (kind === 'star') {
    const points = []
    for (let i = 0; i < 10; i += 1) {
      const angle = -Math.PI / 2 + i * Math.PI / 5
      const radius = i % 2 === 0 ? 114 : 50
      points.push([240 + Math.cos(angle) * radius, 130 + Math.sin(angle) * radius])
    }
    polygon(points)
  }
  if (kind === 'line') {
    ctx.beginPath()
    ctx.moveTo(35, 130)
    ctx.lineTo(445, 130)
    ctx.lineWidth = 18
    ctx.stroke()
  }
  const data = canvas.toDataURL('image/png')
  return data.length <= 300000 && /^data:image\/png;base64,/i.test(data) ? data : ''
}
