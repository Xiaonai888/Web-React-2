export const SHADOW_DOCS_RIBBON_STATE = Object.freeze({
  activeTab: 'home',
  fontFamily: 'Noto Serif Khmer',
  fontSize: 13,
  color: '#242139',
  backgroundColor: '#fff176',
  bold: false,
  italic: false,
  underline: false,
  strike: false,
  superscript: false,
  subscript: false,
  alignment: 'left',
  styleId: 'normal',
  orientation: 'portrait',
  pageSize: 'A5',
  columns: 1,
  indentLeft: 0,
  indentRight: 0,
  spaceBefore: 0,
  spaceAfter: 0,
  lineNumbers: false,
  hyphenation: false,
  pageColor: '#ffffff',
  trackChanges: false,
  viewMode: 'print',
  focus: false,
  ruler: false,
  gridlines: false,
  navigationPane: false,
  syncScrolling: false,
  drawTool: 'pen',
  inkColor: '#111111',
  inkThickness: 2,
  drawWithTouch: false,
  autoCorrect: true,
  mailMergeActive: false,
  previewMerge: false,
})

export function createShadowDocsRibbonState(overrides = {}) {
  return { ...SHADOW_DOCS_RIBBON_STATE, ...(overrides && typeof overrides === 'object' ? overrides : {}) }
}

export function patchShadowDocsRibbonState(state, patch) {
  return { ...createShadowDocsRibbonState(state), ...(patch && typeof patch === 'object' ? patch : {}) }
}

export function resetShadowDocsRibbonSelectionState(state = {}) {
  return {
    ...createShadowDocsRibbonState(state),
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    superscript: false,
    subscript: false,
    styleId: 'normal',
  }
}
