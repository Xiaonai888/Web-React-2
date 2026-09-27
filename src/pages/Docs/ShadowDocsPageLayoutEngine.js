export const SHADOW_DOCS_PAGE_PRESETS = Object.freeze({
  A5: { width: 148, height: 210 },
  A4: { width: 210, height: 297 },
  B5: { width: 176, height: 250 },
  Letter: { width: 215.9, height: 279.4 },
  Legal: { width: 215.9, height: 355.6 },
})

const clamp = (value, min, max, fallback) => Number.isFinite(Number(value)) ? Math.max(min, Math.min(max, Number(value))) : fallback

export function normalizeShadowDocsPageLayout(layout = {}) {
  const size = SHADOW_DOCS_PAGE_PRESETS[layout.size] ? layout.size : 'A5'
  const orientation = layout.orientation === 'landscape' ? 'landscape' : 'portrait'
  const columns = Math.round(clamp(layout.columns, 1, 4, 1))
  return {
    size,
    orientation,
    marginTop: clamp(layout.marginTop ?? layout.margin, 5, 60, 18),
    marginRight: clamp(layout.marginRight ?? layout.margin, 5, 60, 18),
    marginBottom: clamp(layout.marginBottom ?? layout.margin, 5, 60, 18),
    marginLeft: clamp(layout.marginLeft ?? layout.margin, 5, 60, 18),
    gutter: clamp(layout.gutter, 0, 30, 0),
    columns,
    columnGap: clamp(layout.columnGap, 4, 30, 10),
    hyphenation: layout.hyphenation === true,
    lineNumbers: layout.lineNumbers === true,
    textDirection: layout.textDirection === 'rtl' ? 'rtl' : 'ltr',
  }
}

export function getShadowDocsPageDimensions(layout = {}) {
  const value = normalizeShadowDocsPageLayout(layout)
  const preset = SHADOW_DOCS_PAGE_PRESETS[value.size]
  return value.orientation === 'landscape'
    ? { width: preset.height, height: preset.width }
    : { width: preset.width, height: preset.height }
}

export function shadowDocsPageLayoutStyle(layout = {}) {
  const value = normalizeShadowDocsPageLayout(layout)
  const dimensions = getShadowDocsPageDimensions(value)
  return {
    width: `${dimensions.width}mm`,
    minHeight: `${dimensions.height}mm`,
    paddingTop: `${value.marginTop}mm`,
    paddingRight: `${value.marginRight + value.gutter}mm`,
    paddingBottom: `${value.marginBottom}mm`,
    paddingLeft: `${value.marginLeft}mm`,
    columnCount: value.columns,
    columnGap: `${value.columnGap}mm`,
    hyphens: value.hyphenation ? 'auto' : 'manual',
    direction: value.textDirection,
  }
}

export function shadowDocsPageRule(layout = {}) {
  const value = normalizeShadowDocsPageLayout(layout)
  return `@page{size:${value.size} ${value.orientation};margin:${value.marginTop}mm ${value.marginRight}mm ${value.marginBottom}mm ${value.marginLeft}mm}`
}

export function cycleShadowDocsOrientation(layout = {}) {
  const value = normalizeShadowDocsPageLayout(layout)
  return { ...value, orientation: value.orientation === 'portrait' ? 'landscape' : 'portrait' }
}
