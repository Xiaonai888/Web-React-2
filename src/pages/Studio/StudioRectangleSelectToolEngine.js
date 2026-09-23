export function createStudioRectangleSelection(width, height, start, end) {
  if (![width, height].every((value) => Number.isInteger(value) && value > 0)) throw new Error('Invalid canvas dimensions.')
  if (![start?.x, start?.y, end?.x, end?.y].every(Number.isFinite)) throw new Error('Invalid selection coordinates.')
  const data = new Uint8Array(width * height)
  const left = Math.max(0, Math.min(width, Math.floor(Math.min(start.x, end.x))))
  const top = Math.max(0, Math.min(height, Math.floor(Math.min(start.y, end.y))))
  const right = Math.max(0, Math.min(width, Math.ceil(Math.max(start.x, end.x))))
  const bottom = Math.max(0, Math.min(height, Math.ceil(Math.max(start.y, end.y))))
  for (let y = top; y < bottom; y += 1) data.fill(255, y * width + left, y * width + right)
  return { width, height, data, bounds: { x: left, y: top, width: right - left, height: bottom - top } }
}
