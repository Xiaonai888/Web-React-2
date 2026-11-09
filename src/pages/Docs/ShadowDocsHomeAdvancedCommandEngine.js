import { captureShadowDocsSelection } from './ShadowDocsSelectionEngine'
import {
  applyShadowDocsHomeGradient,
  removeShadowDocsHomeGradient,
} from './ShadowDocsHomeGradientEngine'
import {
  captureShadowDocsHomeFormat,
  applyShadowDocsHomeFormat,
} from './ShadowDocsHomeFormatPainterEngine'
import {
  removeShadowDocsHomeList,
  applyShadowDocsHomeMultilevelList,
  renumberShadowDocsHomeList,
  continueShadowDocsHomeNumbering,
  setShadowDocsHomeNumberingOptions,
  applyShadowDocsHomeAutoNumbering,
} from './ShadowDocsHomeNumberingEngine'
import {
  applyShadowDocsHomeExactLineSpacing,
  applyShadowDocsHomeParagraphLayout,
  getShadowDocsHomeColumnSpec,
  shadowDocsHomeColumnSettings,
} from './ShadowDocsHomeParagraphLayoutEngine'

export function createShadowDocsHomeAdvancedCommandEngine({
  getEditor,
  getSnapshot,
  getState,
  getSettings,
  onDocumentChange,
  onStateChange,
  onSettingsChange,
  onMessage,
} = {}) {
  let copiedFormat = null
  let autoNumberingEnabled = false

  function editor() {
    const value = typeof getEditor === 'function' ? getEditor() : getEditor
    return value?.current || value || null
  }

  function snapshot(node) {
    return (typeof getSnapshot === 'function' ? getSnapshot() : null) || captureShadowDocsSelection(node)
  }

  function state() {
    return (typeof getState === 'function' ? getState() : null) || {}
  }

  function settings() {
    return (typeof getSettings === 'function' ? getSettings() : null) || {}
  }

  function finish(node, changed, message = '') {
    if (!changed) return false
    onDocumentChange?.(node.innerHTML)
    if (message) onMessage?.(message)
    return true
  }

  function run(command, value) {
    const node = editor()
    if (!node || !command) return false
    const selection = snapshot(node)

    if (command === 'formatPainterCopy') {
      copiedFormat = captureShadowDocsHomeFormat(node, selection)
      if (copiedFormat) onMessage?.('Formatting copied.')
      return Boolean(copiedFormat)
    }

    if (command === 'formatPainterPaste') {
      return finish(node, applyShadowDocsHomeFormat(node, selection, copiedFormat), 'Formatting applied.')
    }

    if (command === 'fontGradient') return finish(node, applyShadowDocsHomeGradient(node, selection, value))
    if (command === 'fontGradientReset') return finish(node, removeShadowDocsHomeGradient(node, selection))
    if (command === 'listNone') return finish(node, removeShadowDocsHomeList(node, selection))
    if (command === 'multilevelList') return finish(node, applyShadowDocsHomeMultilevelList(node, selection))
    if (command === 'renumber') return finish(node, renumberShadowDocsHomeList(node, selection, 1))
    if (command === 'continueNumbering') return finish(node, continueShadowDocsHomeNumbering(node, selection))
    if (command === 'numberingOptions') return finish(node, setShadowDocsHomeNumberingOptions(node, selection, value))

    if (command === 'lineSpacingExact') {
      const changed = applyShadowDocsHomeExactLineSpacing(node, selection, value)
      if (changed) onStateChange?.({ lineHeight: Number(value) })
      return finish(node, changed)
    }

    if (command === 'paragraphLayout') {
      const changed = applyShadowDocsHomeParagraphLayout(node, selection, Boolean(value))
      if (changed) onStateChange?.({ paragraphLayout: Boolean(value) })
      return finish(node, changed)
    }

    if (command === 'autoNumbering') {
      autoNumberingEnabled = Boolean(value)
      onStateChange?.({ autoNumbering: autoNumberingEnabled })
      return true
    }

    if (command === 'columnsLayout') {
      const spec = getShadowDocsHomeColumnSpec(value)
      if (spec.requiresManualFlow) {
        onMessage?.('Unequal columns require the document-flow renderer.')
        return false
      }
      const patch = shadowDocsHomeColumnSettings(value, settings().columnGap)
      onSettingsChange?.({ columns: patch.columns, columnGap: patch.columnGap })
      onStateChange?.({ columns: patch.columns, columnLayout: patch.id })
      return true
    }

    return false
  }

  function onInput() {
    if (!autoNumberingEnabled && !state().autoNumbering) return false
    const node = editor()
    if (!node) return false
    return finish(node, applyShadowDocsHomeAutoNumbering(node, snapshot(node)))
  }

  function reset() {
    copiedFormat = null
    autoNumberingEnabled = false
  }

  return {
    run,
    onInput,
    reset,
    hasCopiedFormat: () => Boolean(copiedFormat),
  }
}
