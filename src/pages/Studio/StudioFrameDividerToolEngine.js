const HEX = /^#[0-9a-f]{6}$/i

export function splitStudioComicFrame(frame, { orientation = 'vertical', position = 0.5, gutter = 16, minPanelSize = 12 } = {}) {
  const { x, y, width, height } = frame || {}
  if (![x, y, width, height].every(Number.isFinite) || x < 0 || y < 0 || width < 1 || height < 1) throw new Error('A valid comic frame is required.')
  if (!['vertical', 'horizontal'].includes(orientation) || !Number.isFinite(position) || position <= 0 || position >= 1 || !Number.isFinite(gutter) || gutter < 2 || gutter > 200 || !Number.isFinite(minPanelSize) || minPanelSize < 1) throw new Error('Invalid frame divider settings.')
  const vertical = orientation === 'vertical'
  const full = vertical ? width : height
  const before = full * position - gutter / 2
  const after = full - full * position - gutter / 2
  if (before < minPanelSize || after < minPanelSize) throw new Error('The divider would create a panel that is too small.')
  const panels = vertical
    ? [{ x, y, width: before, height }, { x: x + before + gutter, y, width: after, height }]
    : [{ x, y, width, height: before }, { x, y: y + before + gutter, width, height: after }]
  const divider = vertical ? { x: x + before, y, width: gutter, height } : { x, y: y + before, width, height: gutter }
  return { panels, divider, orientation }
}

export function applyStudioFrameDivider(ctx, frame, { orientation = 'vertical', position = 0.5, gutter = 16, border = 4, ink = '#111111', background = 'transparent', opacity = 100 } = {}) {
  const canvas = ctx?.canvas
  if (!canvas?.width || !canvas?.height) throw new Error('An editable canvas context is required.')
  const layout = splitStudioComicFrame(frame, { orientation, position, gutter, minPanelSize: Math.max(12, border * 2) })
  if (frame.x + frame.width > canvas.width || frame.y + frame.height > canvas.height || !Number.isFinite(border) || border < 1 || border > 30 || !HEX.test(ink) || (background !== 'transparent' && !HEX.test(background)) || !Number.isFinite(opacity) || opacity < 0 || opacity > 100) throw new Error('Invalid frame divider drawing settings.')
  if (opacity === 0) return false
  const { divider } = layout
  const vertical = orientation === 'vertical'
  const start = vertical ? frame.y + border / 2 : frame.x + border / 2
  const end = vertical ? frame.y + frame.height - border / 2 : frame.x + frame.width - border / 2
  if (end <= start) throw new Error('The frame is too small for this border.')
  ctx.save()
  try {
    ctx.globalAlpha = opacity / 100
    ctx.globalCompositeOperation = 'source-over'
    if (background !== 'transparent') {
      ctx.fillStyle = background
      if (vertical) ctx.fillRect(divider.x, start, divider.width, end - start)
      else ctx.fillRect(start, divider.y, end - start, divider.height)
    }
    ctx.strokeStyle = ink
    ctx.lineWidth = border
    ctx.lineCap = 'butt'
    ctx.beginPath()
    if (vertical) {
      ctx.moveTo(divider.x, start)
      ctx.lineTo(divider.x, end)
      ctx.moveTo(divider.x + divider.width, start)
      ctx.lineTo(divider.x + divider.width, end)
    } else {
      ctx.moveTo(start, divider.y)
      ctx.lineTo(end, divider.y)
      ctx.moveTo(start, divider.y + divider.height)
      ctx.lineTo(end, divider.y + divider.height)
    }
    ctx.stroke()
  } finally {
    ctx.restore()
  }
  return layout
}
