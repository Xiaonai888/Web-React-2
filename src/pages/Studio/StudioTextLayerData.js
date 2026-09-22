const FONTS = new Set(['sans', 'serif', 'mono', 'khmer'])
const ALIGNS = new Set(['left', 'center', 'right'])
const HEX = /^#[0-9a-f]{6}$/i

export function normalizeStudioTextData(source, width, height) {
  if (!source || typeof source !== 'object' || Array.isArray(source)) throw new Error('Invalid editable text layer.')
  const text = source.text
  const anchor = source.anchor
  const valid = typeof text === 'string' && text.trim().length > 0 && text.length <= 1200 &&
    FONTS.has(source.font) && Number.isInteger(source.size) && source.size >= 8 && source.size <= 400 &&
    typeof source.bold === 'boolean' && typeof source.italic === 'boolean' && ALIGNS.has(source.align) &&
    typeof source.color === 'string' && HEX.test(source.color) &&
    Number.isInteger(source.widthPercent) && source.widthPercent >= 20 && source.widthPercent <= 100 &&
    Number.isFinite(source.lineSpacing) && source.lineSpacing >= 1 && source.lineSpacing <= 2.5 &&
    anchor && typeof anchor === 'object' && Number.isFinite(anchor.x) && Number.isFinite(anchor.y) &&
    Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0 &&
    anchor.x >= 0 && anchor.x <= width && anchor.y >= 0 && anchor.y <= height
  if (!valid) throw new Error('Invalid editable text layer.')
  return {
    text, font: source.font, size: source.size, bold: source.bold, italic: source.italic,
    align: source.align, color: source.color, widthPercent: source.widthPercent,
    lineSpacing: source.lineSpacing, anchor: { x: anchor.x, y: anchor.y },
  }
}
