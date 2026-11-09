import { applyShadowDocsParagraphFormat } from './ShadowDocsFormattingEngine'
import { getShadowDocsSelectedBlocks } from './ShadowDocsSelectionEngine'

const BLOCK_LAYOUTS = new WeakMap()
const COLUMN_SPECS = Object.freeze({
  1: Object.freeze({ id: 'one', columns: 1, proportions: Object.freeze([1]), requiresManualFlow: false }),
  2: Object.freeze({ id: 'two', columns: 2, proportions: Object.freeze([1, 1]), requiresManualFlow: false }),
  3: Object.freeze({ id: 'three', columns: 3, proportions: Object.freeze([1, 1, 1]), requiresManualFlow: false }),
  left: Object.freeze({ id: 'left', columns: 2, proportions: Object.freeze([1, 2]), requiresManualFlow: true }),
  right: Object.freeze({ id: 'right', columns: 2, proportions: Object.freeze([2, 1]), requiresManualFlow: true }),
})

function validNumber(value, minimum, maximum, fallback) {
  const number = Number(value)
  return Number.isFinite(number) ? Math.max(minimum, Math.min(maximum, number)) : fallback
}

export function applyShadowDocsHomeExactLineSpacing(editor, snapshot, value) {
  const number = Number(value)
  if (!Number.isFinite(number) || number < 0.8 || number > 4) return false
  return applyShadowDocsParagraphFormat(editor, snapshot, { lineHeight: number })
}

export function applyShadowDocsHomeParagraphLayout(editor, snapshot, enabled, options = {}) {
  if (!editor || !snapshot) return false
  const blocks = getShadowDocsSelectedBlocks(editor, snapshot)
  if (!blocks.length) return false
  const lineHeight = validNumber(options.lineHeight, 0.8, 4, 1.65)
  const firstLineIndent = validNumber(options.firstLineIndent, -72, 144, 18)
  const spaceAfter = validNumber(options.spaceAfter, 0, 144, 10)
  let changed = false
  blocks.forEach(block => {
    if (enabled) {
      if (!BLOCK_LAYOUTS.has(block)) BLOCK_LAYOUTS.set(block, {
        lineHeight: block.style.lineHeight,
        textIndent: block.style.textIndent,
        marginBottom: block.style.marginBottom,
      })
      block.style.lineHeight = String(lineHeight)
      block.style.textIndent = `${firstLineIndent}pt`
      block.style.marginBottom = `${spaceAfter}pt`
      changed = true
    } else {
      const previous = BLOCK_LAYOUTS.get(block)
      if (!previous) return
      block.style.lineHeight = previous.lineHeight
      block.style.textIndent = previous.textIndent
      block.style.marginBottom = previous.marginBottom
      BLOCK_LAYOUTS.delete(block)
      changed = true
    }
  })
  return changed
}

export function getShadowDocsHomeColumnSpec(value) {
  return COLUMN_SPECS[value] || COLUMN_SPECS[1]
}

export function shadowDocsHomeColumnSettings(value, gap = 10) {
  const spec = getShadowDocsHomeColumnSpec(value)
  return {
    columns: spec.columns,
    columnLayout: spec.id,
    columnProportions: [...spec.proportions],
    columnGap: validNumber(gap, 4, 30, 10),
  }
}

export function shadowDocsHomeEqualColumnStyle(value, gap = 10) {
  const spec = getShadowDocsHomeColumnSpec(value)
  if (spec.requiresManualFlow) return null
  return {
    columnCount: String(spec.columns),
    columnGap: `${validNumber(gap, 4, 30, 10)}mm`,
  }
}

export function shadowDocsHomeUnequalColumnTracks(value) {
  const spec = getShadowDocsHomeColumnSpec(value)
  if (!spec.requiresManualFlow) return null
  return spec.proportions.map(weight => `minmax(0, ${weight}fr)`).join(' ')
}
