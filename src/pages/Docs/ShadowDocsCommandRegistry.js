export const SHADOW_DOCS_COMMANDS = Object.freeze({
  fontFamily: { scope: 'selection', engine: 'inline', value: 'fontFamily' },
  fontSize: { scope: 'selection', engine: 'inline', value: 'fontSize' },
  bold: { scope: 'selection', engine: 'inline', value: 'bold' },
  italic: { scope: 'selection', engine: 'inline', value: 'italic' },
  underline: { scope: 'selection', engine: 'inline', value: 'underline' },
  strike: { scope: 'selection', engine: 'inline', value: 'strike' },
  superscript: { scope: 'selection', engine: 'inline', value: 'superscript' },
  subscript: { scope: 'selection', engine: 'inline', value: 'subscript' },
  color: { scope: 'selection', engine: 'inline', value: 'color' },
  highlight: { scope: 'selection', engine: 'inline', value: 'backgroundColor' },
  clearFormatting: { scope: 'selection', engine: 'clear' },
  normal: { scope: 'paragraph', engine: 'block', value: 'p' },
  heading1: { scope: 'paragraph', engine: 'block', value: 'h1' },
  heading2: { scope: 'paragraph', engine: 'block', value: 'h2' },
  heading3: { scope: 'paragraph', engine: 'block', value: 'h3' },
  quote: { scope: 'paragraph', engine: 'block', value: 'blockquote' },
  bullets: { scope: 'paragraph', engine: 'list', value: 'ul' },
  numbering: { scope: 'paragraph', engine: 'list', value: 'ol' },
  alignLeft: { scope: 'paragraph', engine: 'paragraph', value: { alignment: 'left' } },
  alignCenter: { scope: 'paragraph', engine: 'paragraph', value: { alignment: 'center' } },
  alignRight: { scope: 'paragraph', engine: 'paragraph', value: { alignment: 'right' } },
  justify: { scope: 'paragraph', engine: 'paragraph', value: { alignment: 'justify' } },
  lineSpacing: { scope: 'paragraph', engine: 'paragraph', dynamic: 'lineHeight' },
  indentLeft: { scope: 'paragraph', engine: 'paragraph', dynamic: 'indentLeft' },
  indentRight: { scope: 'paragraph', engine: 'paragraph', dynamic: 'indentRight' },
  spaceBefore: { scope: 'paragraph', engine: 'paragraph', dynamic: 'spaceBefore' },
  spaceAfter: { scope: 'paragraph', engine: 'paragraph', dynamic: 'spaceAfter' },
})

export function getShadowDocsCommand(id) {
  return SHADOW_DOCS_COMMANDS[id] || null
}

export function isShadowDocsFormattingCommand(id) {
  return Boolean(SHADOW_DOCS_COMMANDS[id])
}
