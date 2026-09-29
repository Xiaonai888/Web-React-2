export const SHADOW_DOCS_PAPER_SIZES = Object.freeze({
  A3: [297, 420],
  A4: [210, 297],
  A5: [148, 210],
  A6: [105, 148],
  B4: [250, 353],
  B5: [176, 250],
  B6: [125, 176],
  C4: [229, 324],
  C5: [162, 229],
  C6: [114, 162],
})

export const SHADOW_DOCS_PAPER_GROUPS = Object.freeze([
  { id: 'A', name: 'A Series', items: ['A4', 'A5', 'A3', 'A6'] },
  { id: 'B', name: 'B Series', items: ['B5', 'B4', 'B6'] },
  { id: 'C', name: 'C Series', items: ['C5', 'C4', 'C6'] },
])

export function getShadowDocsPaperSize(id) {
  return SHADOW_DOCS_PAPER_SIZES[id] || SHADOW_DOCS_PAPER_SIZES.A4
}
