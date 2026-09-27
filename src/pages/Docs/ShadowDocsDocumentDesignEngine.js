const THEMES = Object.freeze({
  classic: { font: 'Noto Serif Khmer', text: '#242139', accent: '#6f57a5', page: '#ffffff' },
  modern: { font: 'Noto Sans Khmer', text: '#20202a', accent: '#4866d9', page: '#ffffff' },
  minimal: { font: 'Noto Sans Khmer', text: '#222222', accent: '#777777', page: '#ffffff' },
  warm: { font: 'Noto Serif Khmer', text: '#332a24', accent: '#a46d45', page: '#fffaf3' },
})

const hex = value => /^#[0-9a-f]{6}$/i.test(String(value || '').trim()) ? String(value).trim().toLowerCase() : ''

export const SHADOW_DOCS_DESIGN_THEMES = Object.freeze(Object.keys(THEMES))

export function getShadowDocsDesignTheme(id = 'classic') {
  return { ...(THEMES[id] || THEMES.classic) }
}

export function normalizeShadowDocsDocumentDesign(design = {}) {
  const theme = SHADOW_DOCS_DESIGN_THEMES.includes(design.theme) ? design.theme : 'classic'
  const preset = THEMES[theme]
  return {
    theme,
    textColor: hex(design.textColor) || preset.text,
    accentColor: hex(design.accentColor) || preset.accent,
    pageColor: hex(design.pageColor) || preset.page,
    borderColor: hex(design.borderColor) || '#d5d1df',
    borderWidth: Math.max(0, Math.min(12, Number(design.borderWidth) || 0)),
    borderStyle: ['solid', 'double', 'dashed', 'dotted'].includes(design.borderStyle) ? design.borderStyle : 'solid',
    watermark: String(design.watermark || '').trim().slice(0, 80),
    watermarkOpacity: Math.max(0.03, Math.min(0.4, Number(design.watermarkOpacity) || 0.08)),
  }
}

export function shadowDocsDocumentDesignStyle(design = {}) {
  const value = normalizeShadowDocsDocumentDesign(design)
  return {
    color: value.textColor,
    backgroundColor: value.pageColor,
    border: value.borderWidth ? `${value.borderWidth}px ${value.borderStyle} ${value.borderColor}` : 'none',
    '--sd-accent-color': value.accentColor,
  }
}

export function shadowDocsWatermarkCSS(design = {}) {
  const value = normalizeShadowDocsDocumentDesign(design)
  if (!value.watermark) return ''
  const escaped = JSON.stringify(value.watermark.replace(/[\u0000-\u001f]/g, ' '))
  return `.sd-document-page::before{content:${escaped};position:absolute;inset:0;display:grid;place-items:center;pointer-events:none;opacity:${value.watermarkOpacity};font-size:42pt;transform:rotate(-35deg);z-index:0}`
}
