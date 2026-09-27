export const SHADOW_DOCS_RIBBON_TABS = Object.freeze([
  { id: 'file', label: 'File', groups: [{ id: 'document', label: 'Document', commands: ['new', 'open', 'recent', 'save', 'saveAs', 'import', 'export', 'print', 'backup', 'properties'] }] },
  { id: 'home', label: 'Home', groups: [
    { id: 'clipboard', label: 'Clipboard', commands: ['paste', 'cut', 'copy', 'formatPainter'] },
    { id: 'font', label: 'Font', commands: ['fontFamily', 'fontSize', 'growFont', 'shrinkFont', 'changeCase', 'clearFormatting', 'bold', 'italic', 'underline', 'strike', 'subscript', 'superscript', 'textEffects', 'highlight', 'color'] },
    { id: 'paragraph', label: 'Paragraph', commands: ['bullets', 'numbering', 'multilevelList', 'decreaseIndent', 'increaseIndent', 'sort', 'showMarks', 'alignLeft', 'alignCenter', 'alignRight', 'justify', 'lineSpacing', 'shading', 'borders'] },
    { id: 'styles', label: 'Styles', commands: ['normal', 'noSpacing', 'heading1', 'heading2', 'heading3', 'title', 'subtitle', 'quote'] },
    { id: 'editing', label: 'Editing', commands: ['find', 'replace', 'select'] },
  ] },
  { id: 'insert', label: 'Insert', groups: [
    { id: 'pages', label: 'Pages', commands: ['coverPage', 'blankPage', 'pageBreak'] },
    { id: 'tables', label: 'Tables', commands: ['table'] },
    { id: 'illustrations', label: 'Illustrations', commands: ['pictures', 'shapes', 'icons', 'smartArt', 'chart', 'screenshot'] },
    { id: 'links', label: 'Links', commands: ['link', 'bookmark', 'crossReference'] },
    { id: 'headerFooter', label: 'Header & Footer', commands: ['header', 'footer', 'pageNumber'] },
    { id: 'text', label: 'Text', commands: ['textBox', 'wordArt', 'dropCap', 'signatureLine', 'dateTime', 'object'] },
    { id: 'symbols', label: 'Symbols', commands: ['equation', 'symbol'] },
  ] },
  { id: 'design', label: 'Design', groups: [
    { id: 'documentFormatting', label: 'Document Formatting', commands: ['themes', 'themeColors', 'themeFonts', 'paragraphSpacing', 'effects', 'setDefault'] },
    { id: 'pageBackground', label: 'Page Background', commands: ['watermark', 'pageColor', 'pageBorders'] },
  ] },
  { id: 'layout', label: 'Layout', groups: [
    { id: 'pageSetup', label: 'Page Setup', commands: ['margins', 'orientation', 'paperSize', 'columns', 'breaks', 'lineNumbers', 'hyphenation', 'textDirection'] },
    { id: 'paragraphLayout', label: 'Paragraph', commands: ['indentLeft', 'indentRight', 'spaceBefore', 'spaceAfter'] },
    { id: 'arrange', label: 'Arrange', commands: ['position', 'wrapText', 'bringForward', 'sendBackward', 'selectionPane', 'alignObjects', 'groupObjects', 'rotate'] },
  ] },
  { id: 'references', label: 'References', groups: [
    { id: 'toc', label: 'Table of Contents', commands: ['tableOfContents', 'addTocText', 'updateToc'] },
    { id: 'footnotes', label: 'Footnotes', commands: ['insertFootnote', 'insertEndnote', 'nextFootnote', 'showNotes'] },
    { id: 'citations', label: 'Citations & Bibliography', commands: ['insertCitation', 'manageSources', 'citationStyle', 'bibliography'] },
    { id: 'captions', label: 'Captions', commands: ['insertCaption', 'tableOfFigures', 'updateTableOfFigures', 'crossReference'] },
    { id: 'index', label: 'Index', commands: ['markEntry', 'insertIndex', 'updateIndex'] },
  ] },
  { id: 'mailings', label: 'Mailings', groups: [
    { id: 'create', label: 'Create', commands: ['envelopes', 'labels'] },
    { id: 'mailMerge', label: 'Mail Merge', commands: ['startMailMerge', 'selectRecipients', 'editRecipients', 'addressBlock', 'greetingLine', 'mergeField', 'rules', 'matchFields', 'previewResults', 'finishMerge'] },
  ] },
  { id: 'review', label: 'Review', groups: [
    { id: 'proofing', label: 'Proofing', commands: ['editor', 'spellingGrammar', 'thesaurus', 'wordCount'] },
    { id: 'language', label: 'Language', commands: ['translate', 'setLanguage'] },
    { id: 'comments', label: 'Comments', commands: ['newComment', 'deleteComment', 'previousComment', 'nextComment'] },
    { id: 'tracking', label: 'Tracking', commands: ['trackChanges', 'displayReview', 'showMarkup', 'reviewPane'] },
    { id: 'changes', label: 'Changes', commands: ['acceptChange', 'rejectChange', 'previousChange', 'nextChange'] },
    { id: 'compare', label: 'Compare', commands: ['compare', 'combine'] },
    { id: 'protect', label: 'Protect', commands: ['restrictEditing', 'protectDocument'] },
  ] },
  { id: 'view', label: 'View', groups: [
    { id: 'views', label: 'Views', commands: ['readMode', 'printLayout', 'webLayout', 'outline', 'draft', 'focus'] },
    { id: 'show', label: 'Show', commands: ['ruler', 'gridlines', 'navigationPane'] },
    { id: 'zoom', label: 'Zoom', commands: ['zoom', 'zoom100', 'onePage', 'multiplePages', 'pageWidth'] },
    { id: 'window', label: 'Window', commands: ['newWindow', 'arrangeAll', 'split', 'sideBySide', 'syncScrolling', 'switchWindows'] },
  ] },
  { id: 'draw', label: 'Draw', groups: [{ id: 'ink', label: 'Ink', commands: ['pen', 'pencil', 'highlighter', 'eraser', 'lasso', 'inkColor', 'inkThickness', 'drawWithTouch', 'inkToShape', 'inkToText', 'inkToMath'] }] },
  { id: 'tools', label: 'Tools', groups: [{ id: 'documentTools', label: 'Document Tools', commands: ['wordCount', 'findReplace', 'translate', 'ocr', 'compareDocuments', 'protect', 'convert', 'templates', 'autoCorrect', 'preferences'] }] },
])

export function getShadowDocsRibbonTab(id) {
  return SHADOW_DOCS_RIBBON_TABS.find(tab => tab.id === id) || null
}

export function getShadowDocsRibbonCommand(commandId) {
  for (const tab of SHADOW_DOCS_RIBBON_TABS) {
    for (const group of tab.groups) {
      if (group.commands.includes(commandId)) return { tabId: tab.id, groupId: group.id, commandId }
    }
  }
  return null
}
