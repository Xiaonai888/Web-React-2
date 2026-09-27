export const SHADOW_DOCS_STYLES = Object.freeze([
  { id: 'normal', label: 'Normal', block: 'p', fontSize: 13, bold: false, italic: false, spaceAfter: 8, lineHeight: 1.65 },
  { id: 'noSpacing', label: 'No Spacing', block: 'p', fontSize: 13, bold: false, italic: false, spaceAfter: 0, lineHeight: 1.2 },
  { id: 'title', label: 'Title', block: 'h1', fontSize: 26, bold: true, italic: false, alignment: 'center', spaceBefore: 0, spaceAfter: 18, lineHeight: 1.25 },
  { id: 'subtitle', label: 'Subtitle', block: 'p', fontSize: 16, bold: false, italic: true, alignment: 'center', spaceBefore: 0, spaceAfter: 16, lineHeight: 1.4 },
  { id: 'heading1', label: 'Heading 1', block: 'h1', fontSize: 22, bold: true, italic: false, spaceBefore: 18, spaceAfter: 10, lineHeight: 1.3 },
  { id: 'heading2', label: 'Heading 2', block: 'h2', fontSize: 18, bold: true, italic: false, spaceBefore: 14, spaceAfter: 8, lineHeight: 1.35 },
  { id: 'heading3', label: 'Heading 3', block: 'h3', fontSize: 15, bold: true, italic: false, spaceBefore: 12, spaceAfter: 6, lineHeight: 1.4 },
  { id: 'quote', label: 'Quote', block: 'blockquote', fontSize: 13, bold: false, italic: true, indentLeft: 18, indentRight: 18, spaceBefore: 10, spaceAfter: 10, lineHeight: 1.55 },
  { id: 'intenseQuote', label: 'Intense Quote', block: 'blockquote', fontSize: 14, bold: true, italic: true, alignment: 'center', indentLeft: 24, indentRight: 24, spaceBefore: 14, spaceAfter: 14, lineHeight: 1.5 },
])

export function getShadowDocsStyle(id) {
  return SHADOW_DOCS_STYLES.find(style => style.id === id) || SHADOW_DOCS_STYLES[0]
}

export function shadowDocsStyleCommand(id) {
  const style = getShadowDocsStyle(id)
  return {
    blockType: style.block,
    inline: {
      fontSize: style.fontSize,
      bold: style.bold,
      italic: style.italic,
    },
    paragraph: {
      alignment: style.alignment,
      lineHeight: style.lineHeight,
      spaceBefore: style.spaceBefore,
      spaceAfter: style.spaceAfter,
      indentLeft: style.indentLeft,
      indentRight: style.indentRight,
    },
  }
}
