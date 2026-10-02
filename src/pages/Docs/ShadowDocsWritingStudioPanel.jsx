import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, BookOpen, Check, CheckCircle2, Download, Eye, ImagePlus, Menu, Plus, Redo2, Share2, Trash2, Undo2 } from 'lucide-react'
import { getManuscriptOverview } from './ShadowDocsManuscriptTools'
import { loadShadowDocsFont, shadowDocsFontFamily } from './ShadowDocsFontCatalog'
import ShadowDocsRibbon from './ShadowDocsRibbon'
import { captureShadowDocsSelection, restoreShadowDocsSelection, selectShadowDocsNodeContents } from './ShadowDocsSelectionEngine'
import { applyShadowDocsCommand, applyShadowDocsInlineFormat, applyShadowDocsParagraphFormat } from './ShadowDocsFormattingEngine'
import { readShadowDocsFormatState } from './ShadowDocsFormatState'
import { shadowDocsStyleCommand } from './ShadowDocsStyleCatalog'
import { createShadowDocsRibbonState } from './ShadowDocsRibbonState'
import { insertShadowDocsTable } from './ShadowDocsTableEngine'
import { applyShadowDocsLink, createShadowDocsBookmark } from './ShadowDocsLinkEngine'
import { insertShadowDocsDateTime, insertShadowDocsEquation, insertShadowDocsPageBreak, insertShadowDocsSymbol, insertShadowDocsTextBox } from './ShadowDocsInsertObjectsEngine'
import { copyShadowDocsSelection, cutShadowDocsSelection, insertShadowDocsClipboardText } from './ShadowDocsClipboardEngine'
import { getShadowDocsDesignTheme, SHADOW_DOCS_DESIGN_THEMES } from './ShadowDocsDocumentDesignEngine'
import { inspectShadowDocsProofing, getShadowDocsProofingStats } from './ShadowDocsProofingEngine'
import { applyShadowDocsLanguage, detectShadowDocsLanguage, SHADOW_DOCS_LANGUAGES } from './ShadowDocsLanguageEngine'
import { createShadowDocsCommentRecord, addShadowDocsComment, getShadowDocsCommentMarks, removeShadowDocsCommentMark } from './ShadowDocsCommentEngine'
import { acceptShadowDocsChange, rejectShadowDocsChange, listShadowDocsChanges, markShadowDocsDeletion, markShadowDocsInsertion } from './ShadowDocsTrackChangesEngine'
import { buildShadowDocsTableOfContents, createShadowDocsCitation, createShadowDocsFootnote, formatShadowDocsCitation } from './ShadowDocsReferenceEngine'
import { buildShadowDocsMergedDocuments, createShadowDocsAddressBlock, createShadowDocsGreetingLine, getShadowDocsMergeFields, insertShadowDocsMergeField, parseShadowDocsRecipientsCSV } from './ShadowDocsMailMergeEngine'
import { applyShadowDocsCase } from './ShadowDocsTextTransform'
import ShadowDocsMobileMenu from './ShadowDocsMobileMenu'

const FONT_SIZES = [8, 9, 10, 11, 12, 13, 14, 16, 18, 20, 22, 24, 28, 32, 36, 48, 72]
const INLINE_COMMANDS = new Set(['fontFamily', 'fontSize', 'color', 'highlight', 'bold', 'italic', 'underline', 'strike', 'superscript', 'subscript', 'clearFormatting'])
const ALIGNMENTS = new Set(['left', 'center', 'right', 'justify'])

function nearestFontSize(value, fallback = 13) {
  const number = Number(value)
  if (!Number.isFinite(number)) return fallback
  return FONT_SIZES.reduce((best, size) => Math.abs(size - number) < Math.abs(best - number) ? size : best, FONT_SIZES[0])
}

function colorToHex(value, fallback) {
  const color = String(value || '').trim()
  if (/^#[0-9a-f]{6}$/i.test(color)) return color
  const match = color.match(/^rgba?\(\s*(\d+)\D+(\d+)\D+(\d+)/i)
  if (!match) return fallback
  return `#${match.slice(1, 4).map(part => Math.max(0, Math.min(255, Number(part))).toString(16).padStart(2, '0')).join('')}`
}

function mobileDocumentName(book) {
  const title = String(book?.title || '').trim()
  if (!title || title === 'Untitled Book') return 'Docs.doc'
  return /\.(?:doc|docx)$/i.test(title) ? title : `${title}.doc`
}

function mobileDocumentSize(book) {
  try {
    const bytes = new TextEncoder().encode(JSON.stringify(book || {})).length
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  } catch {
    return ''
  }
}

function explicitFontSize(editor) {
  const selection = globalThis.getSelection?.()
  if (!editor || !selection?.rangeCount || !editor.contains(selection.anchorNode)) return null
  let element = selection.anchorNode.nodeType === 1 ? selection.anchorNode : selection.anchorNode.parentElement
  while (element && element !== editor) {
    if (element.style?.fontSize) {
      const raw = String(element.style.fontSize)
      const number = Number.parseFloat(raw)
      if (!Number.isFinite(number)) return null
      return raw.endsWith('px') ? number * 0.75 : number
    }
    element = element.parentElement
  }
  return null
}

export default function ShadowDocsWritingStudioPanel({
  book,
  chapterId,
  onSelectChapter,
  onAddChapter,
  onRenameChapter,
  onChangeHTML,
  onMoveChapter,
  onDeleteChapter,
  onPreview,
  onDownloadBackup,
  onEditorBlur,
  onChangeSettings,
  onNewBook,
  onOpenBooks,
  onOpenDesigner,
  onOpenTemplates,
  onOpenFindReplace,
  onOpenImport,
  onOpenPDF,
  onPrint,
  onEditProperties,
  onOpenOutline,
  status = 'Saved on this device',
}) {
  const editorRef = useRef(null)
  const selectionRef = useRef(null)
  const imageInputRef = useRef(null)
  const imageTargetRef = useRef(null)
  const mailingInputRef = useRef(null)
  const [imageWidth, setImageWidth] = useState(75)
  const [imageAlignment, setImageAlignment] = useState('center')
  const [imageError, setImageError] = useState('')
  const [imageBusy, setImageBusy] = useState(false)
  const [ribbonMessage, setRibbonMessage] = useState('')
  const [ribbonState, setRibbonState] = useState(() => createShadowDocsRibbonState())
  const [recipients, setRecipients] = useState([])
  const [recipientIndex, setRecipientIndex] = useState(0)
  const [indexEntries, setIndexEntries] = useState([])
  const [localSaveDirty, setLocalSaveDirty] = useState(false)
  const [localSaveSeconds, setLocalSaveSeconds] = useState(10)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const onEditorBlurRef = useRef(onEditorBlur)
  const chapter = book?.chapters?.find(item => item.id === chapterId) || book?.chapters?.[0]
  const chapterIndex = book?.chapters?.findIndex(item => item.id === chapter?.id) ?? -1
  const overview = useMemo(() => getManuscriptOverview(book), [book])
  const chapterStats = overview.outline[chapterIndex]
  const settings = book?.settings || {}
  const firstLineIndent = Math.min(15, Math.max(0, Number(settings.firstLineIndent) || 0))
  const paragraphSpacing = settings.paragraphSpacing == null ? 10 : Math.min(20, Math.max(0, Number(settings.paragraphSpacing) || 0))

  useEffect(() => {
    loadShadowDocsFont(settings.font)
  }, [settings.font])

  useEffect(() => {
    onEditorBlurRef.current = onEditorBlur
  }, [onEditorBlur])

  useEffect(() => {
    setLocalSaveDirty(false)
    setLocalSaveSeconds(10)
    setMobileMenuOpen(false)
  }, [book?.id, chapter?.id])

  useEffect(() => {
    if (!localSaveDirty || !book?.id) return undefined
    if (localSaveSeconds <= 0) {
      onEditorBlurRef.current?.(book.id)
      setLocalSaveDirty(false)
      setLocalSaveSeconds(10)
      return undefined
    }
    const timer = window.setTimeout(() => setLocalSaveSeconds(seconds => Math.max(0, seconds - 1)), 1000)
    return () => window.clearTimeout(timer)
  }, [localSaveDirty, localSaveSeconds, book?.id])


  useEffect(() => {
    const doc = new DOMParser().parseFromString(chapter?.html || '', 'text/html')
    doc.querySelectorAll('[style*="font-family"]').forEach(node => {
      const font = node.style.fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, '')
      loadShadowDocsFont(font)
    })
  }, [book?.id, chapter?.id])

  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = chapter?.html || ''
    selectionRef.current = null
    setRibbonMessage('')
  }, [book?.id, chapter?.id])

  useEffect(() => {
    setRibbonState(state => ({
      ...state,
      title: book?.title || 'Untitled Book',
      author: book?.author || '',
      status,
      fontFamily: settings.font || 'Noto Serif Khmer',
      fontSize: nearestFontSize(settings.fontSize || 13),
      alignment: ALIGNMENTS.has(settings.alignment) ? settings.alignment : 'left',
      pageSize: settings.size || 'A5',
      orientation: settings.orientation || 'portrait',
      columns: settings.columns || 1,
      lineNumbers: settings.lineNumbers === true,
      hyphenation: settings.hyphenation === true,
      textDirection: settings.textDirection || 'ltr',
      pageColor: settings.pageColor || '#ffffff',
      textColor: settings.textColor || '#242139',
      accentColor: settings.accentColor || '#6f57a5',
      theme: settings.theme || 'classic',
      watermark: settings.watermark || '',
      borderColor: settings.borderColor || '#d5d1df',
      borderWidth: settings.borderWidth || 0,
      borderStyle: settings.borderStyle || 'solid',
      documentLanguage: settings.documentLanguage || 'km',
    }))
  }, [book?.id, book?.title, book?.author, status, settings.font, settings.fontSize, settings.alignment, settings.size, settings.orientation, settings.columns, settings.lineNumbers, settings.hyphenation, settings.textDirection, settings.pageColor, settings.textColor, settings.accentColor, settings.theme, settings.watermark, settings.borderColor, settings.borderWidth, settings.borderStyle, settings.documentLanguage])

  function emitChange() {
    if (editorRef.current && chapter && typeof onChangeHTML === 'function') onChangeHTML(chapter.id, editorRef.current.innerHTML)
    setLocalSaveDirty(true)
  }

  function rememberSelection() {
    const editor = editorRef.current
    if (!editor) return null
    const snapshot = captureShadowDocsSelection(editor)
    if (!snapshot) return selectionRef.current
    selectionRef.current = snapshot
    const state = readShadowDocsFormatState(editor)
    if (state) {
      const size = explicitFontSize(editor)
      setRibbonState(current => ({
        ...current,
        fontFamily: state.fontFamily || current.fontFamily,
        fontSize: nearestFontSize(size ?? current.fontSize, current.fontSize),
        color: colorToHex(state.color, current.color || '#242139'),
        backgroundColor: colorToHex(state.backgroundColor, current.backgroundColor || '#fff176'),
        bold: state.bold,
        italic: state.italic,
        underline: state.underline,
        strike: state.strike,
        superscript: state.superscript,
        subscript: state.subscript,
        alignment: ALIGNMENTS.has(state.alignment) ? state.alignment : current.alignment,
        indentLeft: state.marginLeft || 0,
        indentRight: state.marginRight || 0,
        spaceBefore: state.marginTop || 0,
        spaceAfter: state.marginBottom || 0,
      }))
    }
    return snapshot
  }

  function currentSnapshot() {
    return selectionRef.current || rememberSelection()
  }

  function finishRibbonChange(changed, message = '') {
    if (!changed) return false
    emitChange()
    setRibbonMessage(message)
    requestAnimationFrame(() => rememberSelection())
    return true
  }

  function updateSettings(patch, message = '') {
    onChangeSettings?.(patch)
    setRibbonState(state => ({ ...state, ...patch, pageSize: patch.size || state.pageSize }))
    if (message) setRibbonMessage(message)
  }

  function insertHTMLAtSelection(html) {
    const editor = editorRef.current
    const snapshot = currentSnapshot()
    const range = restoreShadowDocsSelection(editor, snapshot)
    if (!editor || !range || typeof document === 'undefined') return false
    const template = document.createElement('template')
    template.innerHTML = html
    range.deleteContents()
    range.insertNode(template.content)
    editor.normalize()
    return finishRibbonChange(true)
  }

  function insertTextAtSelection(text) {
    const editor = editorRef.current
    const snapshot = currentSnapshot()
    return finishRibbonChange(insertShadowDocsClipboardText(editor, snapshot, text))
  }

  function selectMarkedNode(selector, direction = 1) {
    const editor = editorRef.current
    if (!editor) return false
    const nodes = [...editor.querySelectorAll(selector)]
    if (!nodes.length) return false
    const selection = globalThis.getSelection?.()
    const current = selection?.anchorNode?.nodeType === 1 ? selection.anchorNode : selection?.anchorNode?.parentElement
    let index = nodes.findIndex(node => node === current || node.contains(current))
    index = (index + direction + nodes.length) % nodes.length
    selectShadowDocsNodeContents(nodes[index])
    rememberSelection()
    return true
  }

  function downloadText(name, text) {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = name
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1200)
  }

  async function runRibbonCommand(command, value) {
    const editor = editorRef.current
    if (!editor || !chapter) return
    const snapshot = currentSnapshot()
    setRibbonMessage('')

    if (INLINE_COMMANDS.has(command)) {
      if (!snapshot || snapshot.collapsed) {
        setRibbonMessage('Select text first.')
        return
      }
      if (command === 'fontFamily') loadShadowDocsFont(value)
      const changed = applyShadowDocsCommand(editor, snapshot, command, value)
      if (finishRibbonChange(changed)) {
        const patch = { [command === 'highlight' ? 'backgroundColor' : command]: value }
        if (command === 'clearFormatting') {
          setRibbonState(state => ({ ...state, bold: false, italic: false, underline: false, strike: false, superscript: false, subscript: false }))
        } else setRibbonState(state => ({ ...state, ...patch }))
      }
      return
    }

    if (command === 'growFont' || command === 'shrinkFont') {
      if (!snapshot || snapshot.collapsed) {
        setRibbonMessage('Select text first.')
        return
      }
      const current = Number(ribbonState.fontSize) || Number(settings.fontSize) || 13
      const index = Math.max(0, FONT_SIZES.indexOf(nearestFontSize(current)))
      const nextIndex = Math.max(0, Math.min(FONT_SIZES.length - 1, index + (command === 'growFont' ? 1 : -1)))
      const next = FONT_SIZES[nextIndex]
      if (finishRibbonChange(applyShadowDocsCommand(editor, snapshot, 'fontSize', next))) setRibbonState(state => ({ ...state, fontSize: next }))
      return
    }

    if (command === 'bullets' || command === 'numbering') {
      finishRibbonChange(applyShadowDocsCommand(editor, snapshot, command, true))
      return
    }

    if (['alignLeft', 'alignCenter', 'alignRight', 'justify'].includes(command)) {
      const alignment = command === 'justify' ? 'justify' : command.replace('align', '').toLowerCase()
      if (finishRibbonChange(applyShadowDocsCommand(editor, snapshot, 'paragraph', { alignment }))) setRibbonState(state => ({ ...state, alignment }))
      return
    }

    if (command === 'increaseIndent' || command === 'decreaseIndent') {
      const current = Number(ribbonState.indentLeft) || 0
      const indentLeft = Math.max(-72, Math.min(144, current + (command === 'increaseIndent' ? 12 : -12)))
      if (finishRibbonChange(applyShadowDocsCommand(editor, snapshot, 'paragraph', { indentLeft }))) setRibbonState(state => ({ ...state, indentLeft }))
      return
    }

    if (['indentLeft', 'indentRight', 'spaceBefore', 'spaceAfter'].includes(command)) {
      if (finishRibbonChange(applyShadowDocsCommand(editor, snapshot, 'paragraph', { [command]: Number(value) || 0 }))) setRibbonState(state => ({ ...state, [command]: Number(value) || 0 }))
      return
    }

    if (command === 'lineSpacing') {
      const choices = [1, 1.15, 1.5, 2]
      const current = Number(ribbonState.lineHeight) || Number(settings.lineSpacing) || 1.65
      const next = choices[(choices.findIndex(item => item > current + 0.01) + choices.length) % choices.length]
      if (finishRibbonChange(applyShadowDocsCommand(editor, snapshot, 'paragraph', { lineHeight: next }))) setRibbonState(state => ({ ...state, lineHeight: next }))
      return
    }

    if (command === 'style') {
      const style = shadowDocsStyleCommand(value)
      let changed = applyShadowDocsCommand(editor, snapshot, 'blockType', style.blockType)
      if (!snapshot?.collapsed) changed = applyShadowDocsInlineFormat(editor, snapshot, style.inline) || changed
      changed = applyShadowDocsParagraphFormat(editor, snapshot, style.paragraph) || changed
      if (finishRibbonChange(changed)) setRibbonState(state => ({ ...state, styleId: value }))
      return
    }

    if (command === 'pageBreak') {
      finishRibbonChange(Boolean(insertShadowDocsPageBreak(editor, snapshot)))
      return
    }

    if (command === 'table') {
      finishRibbonChange(Boolean(insertShadowDocsTable(editor, snapshot, 2, 2)))
      return
    }

    if (command === 'pictures') {
      chooseImage()
      return
    }

    if (command === 'dateTime') {
      finishRibbonChange(Boolean(insertShadowDocsDateTime(editor, snapshot, { locale: 'km-KH', includeTime: true })))
      return
    }

    if (command === 'symbol') {
      const symbol = globalThis.prompt?.('Enter a symbol:', '©')
      if (symbol) finishRibbonChange(Boolean(insertShadowDocsSymbol(editor, snapshot, symbol)))
      return
    }

    if (command === 'equation') {
      const expression = globalThis.prompt?.('Enter an equation:', 'x² + y² = z²')
      if (expression) finishRibbonChange(Boolean(insertShadowDocsEquation(editor, snapshot, expression)))
      return
    }

    if (command === 'textBox') {
      const text = globalThis.prompt?.('Text box content:', '')
      if (text != null) finishRibbonChange(Boolean(insertShadowDocsTextBox(editor, snapshot, text)))
      return
    }

    if (command === 'link') {
      if (!snapshot || snapshot.collapsed) {
        setRibbonMessage('Select text first.')
        return
      }
      const href = globalThis.prompt?.('Enter link:', 'https://')
      if (href) finishRibbonChange(applyShadowDocsLink(editor, snapshot, href))
      return
    }

    if (command === 'bookmark') {
      const range = restoreShadowDocsSelection(editor, snapshot)
      const element = range?.startContainer?.nodeType === 1 ? range.startContainer : range?.startContainer?.parentElement
      const name = globalThis.prompt?.('Bookmark name:', '')
      if (element && name && createShadowDocsBookmark(element, name)) finishRibbonChange(true)
      return
    }

    if (command === 'copy') {
      if (!snapshot || snapshot.collapsed) return setRibbonMessage('Select text first.')
      try {
        setRibbonMessage(await copyShadowDocsSelection(editor, snapshot) ? 'Copied.' : 'Clipboard access is unavailable.')
      } catch {
        setRibbonMessage('Clipboard access is unavailable.')
      }
      return
    }

    if (command === 'cut') {
      if (!snapshot || snapshot.collapsed) return setRibbonMessage('Select text first.')
      try {
        finishRibbonChange(await cutShadowDocsSelection(editor, snapshot), 'Cut.')
      } catch {
        setRibbonMessage('Clipboard access is unavailable.')
      }
      return
    }

    if (command === 'paste') {
      try {
        const text = await navigator.clipboard?.readText?.()
        if (!text) return setRibbonMessage('Clipboard is empty or unavailable.')
        finishRibbonChange(insertShadowDocsClipboardText(editor, snapshot, text), 'Pasted as plain text.')
      } catch {
        setRibbonMessage('Browser blocked clipboard access. Use Ctrl/Cmd + V.')
      }
      return
    }

    if (command === 'save') {
      onEditorBlurRef.current?.(book.id)
      setLocalSaveDirty(false)
      setLocalSaveSeconds(10)
      setRibbonMessage('Saved on this device.')
      return
    }

    if (command === 'backup') {
      onDownloadBackup?.(book)
      return
    }

    if (command === 'wordCount') {
      setRibbonMessage(`${(chapterStats?.words || 0).toLocaleString()} words · ${(chapterStats?.characters || 0).toLocaleString()} characters`)
      return
    }

    if (command === 'find' || command === 'replace' || command === 'findReplace') {
      onOpenFindReplace?.()
      setRibbonMessage('Writing tools opened below.')
      return
    }

    if (command === 'new') { onNewBook?.(); return }
    if (command === 'open' || command === 'recent') { onOpenBooks?.(); return }
    if (command === 'import') { onOpenImport?.(); return }
    if (command === 'export' || command === 'saveAs' || command === 'convert') { onOpenPDF?.(); return }
    if (command === 'print') { onPrint?.(); return }
    if (command === 'properties') { onEditProperties?.(); return }
    if (command === 'templates') { onOpenTemplates?.(); return }
    if (command === 'preferences') { onOpenDesigner?.(); return }
    if (command === 'navigationPane' || command === 'outline') { onOpenOutline?.(); setRibbonState(state => ({ ...state, navigationPane: true, viewMode: command === 'outline' ? 'outline' : state.viewMode })); return }

    if (command === 'select') {
      selectShadowDocsNodeContents(editor)
      rememberSelection()
      return
    }

    if (command === 'changeCase') {
      const mode = globalThis.prompt?.('Case: upper, lower, title, sentence, toggle', 'title')
      if (mode && snapshot && !snapshot.collapsed) finishRibbonChange(applyShadowDocsCase(editor, snapshot, mode))
      return
    }

    if (command === 'formatPainter') {
      setRibbonMessage('Select target text, then use the same Font/Paragraph controls to apply the captured style.')
      return
    }

    if (command === 'showMarks') {
      setRibbonState(state => ({ ...state, showMarks: !state.showMarks }))
      setRibbonMessage('Paragraph marks display toggled for this session.')
      return
    }

    if (command === 'sort') {
      const blocks = [...editor.querySelectorAll('p')]
      if (blocks.length < 2) return setRibbonMessage('Add at least two paragraphs to sort.')
      const parent = blocks[0].parentNode
      if (!blocks.every(node => node.parentNode === parent)) return setRibbonMessage('Sort works on sibling paragraphs.')
      blocks.sort((a, b) => (a.textContent || '').localeCompare(b.textContent || '', settings.documentLanguage || 'km'))
      blocks.forEach(node => parent.appendChild(node))
      finishRibbonChange(true, 'Paragraphs sorted A–Z.')
      return
    }

    if (command === 'shading') {
      if (!snapshot || snapshot.collapsed) return setRibbonMessage('Select text first.')
      const color = globalThis.prompt?.('Shading color (hex):', '#fff3b0')
      if (color) finishRibbonChange(applyShadowDocsCommand(editor, snapshot, 'highlight', color))
      return
    }

    if (command === 'borders') {
      setRibbonMessage('Paragraph borders use Page Borders in Design for print-safe output.')
      return
    }

    if (command === 'coverPage') {
      const title = String(book.title || 'Untitled Book').replace(/[&<>"']/g, '')
      const author = String(book.author || '').replace(/[&<>"']/g, '')
      insertHTMLAtSelection(`<div style="text-align:center"><h1>${title}</h1><p>${author}</p></div><hr data-shadow-docs-page-break="1" contenteditable="false"><p><br></p>`)
      return
    }
    if (command === 'blankPage' || command === 'breaks') { finishRibbonChange(Boolean(insertShadowDocsPageBreak(editor, snapshot))); return }
    if (command === 'wordArt') {
      if (!snapshot || snapshot.collapsed) return setRibbonMessage('Select text first.')
      finishRibbonChange(applyShadowDocsInlineFormat(editor, snapshot, { fontSize: 28, bold: true, color: settings.accentColor || '#6f57a5' }))
      return
    }
    if (command === 'dropCap') {
      if (!snapshot || snapshot.collapsed) return setRibbonMessage('Select the first letter first.')
      finishRibbonChange(applyShadowDocsInlineFormat(editor, snapshot, { fontSize: 36, bold: true }))
      return
    }
    if (command === 'header') {
      const text = globalThis.prompt?.('Header text:', settings.printHeader || book.title || '')
      if (text != null) updateSettings({ printHeader: text.slice(0, 80) }, 'Header updated.')
      return
    }
    if (command === 'footer') {
      const text = globalThis.prompt?.('Footer text:', settings.printFooter || '')
      if (text != null) updateSettings({ printFooter: text.slice(0, 60) }, 'Footer updated.')
      return
    }
    if (command === 'pageNumber') { updateSettings({ pageNumbers: !settings.pageNumbers }, `Page numbers ${settings.pageNumbers ? 'off' : 'on'}.`); return }
    if (['shapes', 'icons', 'smartArt', 'chart', 'screenshot'].includes(command)) {
      const label = command === 'smartArt' ? 'SmartArt' : command.charAt(0).toUpperCase() + command.slice(1)
      const text = globalThis.prompt?.(`${label} placeholder text:`, label)
      if (text != null) finishRibbonChange(Boolean(insertShadowDocsTextBox(editor, snapshot, text)))
      return
    }
    if (command === 'crossReference') {
      const toc = buildShadowDocsTableOfContents(book)
      const item = toc.find(row => row.id !== chapter.id) || toc[0]
      if (item) insertTextAtSelection(`See ${item.title}`)
      return
    }

    if (command === 'themes') {
      const current = SHADOW_DOCS_DESIGN_THEMES.indexOf(settings.theme || 'classic')
      const next = SHADOW_DOCS_DESIGN_THEMES[(current + 1) % SHADOW_DOCS_DESIGN_THEMES.length]
      const theme = getShadowDocsDesignTheme(next)
      updateSettings({ theme: next, font: theme.font, textColor: theme.text, accentColor: theme.accent, pageColor: theme.page }, `Theme: ${next}.`)
      return
    }
    if (command === 'themeColors') {
      const accentColor = globalThis.prompt?.('Accent color (hex):', settings.accentColor || '#6f57a5')
      if (accentColor) updateSettings({ accentColor }, 'Theme color updated.')
      return
    }
    if (command === 'themeFonts') { onOpenDesigner?.(); return }
    if (command === 'paragraphSpacing') {
      const next = [0, 6, 10, 14, 18][([0, 6, 10, 14, 18].indexOf(Number(settings.paragraphSpacing)) + 1) % 5]
      updateSettings({ paragraphSpacing: next }, `Paragraph spacing: ${next} pt.`)
      return
    }
    if (command === 'effects') { setRibbonMessage('Document effects use the selected theme and page background.'); return }
    if (command === 'setDefault') {
      try { localStorage.setItem('shadow-docs-default-settings', JSON.stringify(settings)); setRibbonMessage('Current document settings saved as local defaults.') } catch { setRibbonMessage('Could not save local defaults.') }
      return
    }
    if (command === 'watermark') {
      const watermark = globalThis.prompt?.('Watermark text:', settings.watermark || '')
      if (watermark != null) updateSettings({ watermark: watermark.slice(0, 80) }, watermark ? 'Watermark updated.' : 'Watermark removed.')
      return
    }
    if (command === 'pageColor') { updateSettings({ pageColor: value }, 'Page color updated.'); return }
    if (command === 'pageBorders') {
      const width = Number(globalThis.prompt?.('Border width 0–12 px:', String(settings.borderWidth || 0)))
      if (Number.isFinite(width)) updateSettings({ borderWidth: Math.max(0, Math.min(12, width)) }, 'Page border updated.')
      return
    }

    if (command === 'margins') {
      const margin = Number(globalThis.prompt?.('Page margin (10–35 mm):', String(settings.margin || 18)))
      if (Number.isFinite(margin)) updateSettings({ margin: Math.max(10, Math.min(35, margin)) }, 'Margins updated.')
      return
    }
    if (command === 'orientation') { const orientation = settings.orientation === 'landscape' ? 'portrait' : 'landscape'; updateSettings({ orientation }, `Orientation: ${orientation}.`); return }
    if (command === 'paperSize') {
      const sizes = ['A5', 'A4', 'B5']; const current = sizes.indexOf(settings.size || 'A5'); const size = sizes[(current + 1) % sizes.length]; updateSettings({ size }, `Paper size: ${size}.`); return
    }
    if (command === 'columns') { const columns = (Number(settings.columns) || 1) % 3 + 1; updateSettings({ columns }, `Columns: ${columns}.`); return }
    if (command === 'lineNumbers') { updateSettings({ lineNumbers: Boolean(value) }, `Line numbers ${value ? 'on' : 'off'}.`); return }
    if (command === 'hyphenation') { updateSettings({ hyphenation: Boolean(value) }, `Hyphenation ${value ? 'on' : 'off'}.`); return }
    if (command === 'textDirection') { const textDirection = settings.textDirection === 'rtl' ? 'ltr' : 'rtl'; updateSettings({ textDirection }, `Text direction: ${textDirection}.`); return }
    if (['position', 'wrapText', 'bringForward', 'sendBackward', 'selectionPane', 'alignObjects', 'groupObjects', 'rotate'].includes(command)) { setRibbonMessage('Arrange commands apply to selected visual objects; image placement is controlled by the Image alignment tools.'); return }

    if (command === 'tableOfContents' || command === 'updateToc') {
      const rows = buildShadowDocsTableOfContents(book)
      insertHTMLAtSelection(`<h2>Contents</h2>${rows.map(row => `<p>${row.chapterIndex + 1}. ${String(row.title).replace(/[&<>"']/g, '')}</p>`).join('')}<p><br></p>`)
      return
    }
    if (command === 'addTocText') { setRibbonMessage('Chapter titles are already used as level-1 Table of Contents entries.'); return }
    if (command === 'insertFootnote' || command === 'insertEndnote') {
      const text = globalThis.prompt?.(command === 'insertFootnote' ? 'Footnote:' : 'Endnote:', '')
      if (!text) return
      const note = createShadowDocsFootnote(text, chapter.id)
      const number = editor.querySelectorAll('sup[data-shadow-docs-note]').length + 1
      insertHTMLAtSelection(`<sup data-shadow-docs-note="${note.id}">[${number}]</sup>`)
      editor.insertAdjacentHTML('beforeend', `<p><sup>[${number}]</sup> ${String(note.text).replace(/[&<>"']/g, '')}</p>`)
      emitChange()
      return
    }
    if (command === 'nextFootnote' || command === 'showNotes') { setRibbonMessage(selectMarkedNode('sup[data-shadow-docs-note]', 1) ? 'Moved to next note.' : 'No notes found.'); return }
    if (command === 'insertCitation') {
      const author = globalThis.prompt?.('Author:', '') || ''
      const title = globalThis.prompt?.('Title:', '') || ''
      const year = globalThis.prompt?.('Year:', '') || ''
      const citation = createShadowDocsCitation({ author, title, year })
      insertTextAtSelection(formatShadowDocsCitation(citation, 'author-year'))
      return
    }
    if (command === 'bibliography') { setRibbonMessage('Insert citations first; bibliography entries can be added from citation text in this local editor.'); return }
    if (command === 'manageSources' || command === 'citationStyle') { setRibbonMessage('Source management is local to inserted citation text in this version.'); return }
    if (command === 'insertCaption') {
      const text = globalThis.prompt?.('Caption:', 'Figure 1')
      if (text) insertHTMLAtSelection(`<p style="text-align:center"><i>${String(text).replace(/[&<>"']/g, '')}</i></p>`)
      return
    }
    if (command === 'tableOfFigures' || command === 'updateTableOfFigures') { setRibbonMessage('Captions remain in the manuscript and are included in PDF output.'); return }
    if (command === 'markEntry') {
      const text = snapshot?.text?.trim()
      if (!text) return setRibbonMessage('Select index text first.')
      setIndexEntries(entries => [...new Set([...entries, text.slice(0, 120)])])
      setRibbonMessage(`Index entry marked: ${text.slice(0, 80)}`)
      return
    }
    if (command === 'insertIndex' || command === 'updateIndex') {
      if (!indexEntries.length) return setRibbonMessage('Mark at least one index entry first.')
      insertHTMLAtSelection(`<h2>Index</h2>${[...indexEntries].sort().map(item => `<p>${String(item).replace(/[&<>"']/g, '')}</p>`).join('')}<p><br></p>`)
      return
    }

    if (command === 'editor' || command === 'spellingGrammar') {
      const stats = getShadowDocsProofingStats(editor.innerHTML)
      const issues = inspectShadowDocsProofing(editor.innerHTML)
      setRibbonMessage(`${stats.words} words · ${stats.sentences} sentences · ${issues.length} local proofing issue(s).${issues[0] ? ` ${issues[0].message}` : ''}`)
      return
    }
    if (command === 'thesaurus') { setRibbonMessage('Thesaurus needs a dictionary service; local proofing remains available offline.'); return }
    if (command === 'setLanguage') {
      const detected = detectShadowDocsLanguage(editor.textContent || '')
      const languageId = globalThis.prompt?.(`Language code (${SHADOW_DOCS_LANGUAGES.map(item => item.id).join(', ')}):`, settings.documentLanguage || detected.id)
      if (!languageId) return
      applyShadowDocsLanguage(editor, languageId)
      updateSettings({ documentLanguage: languageId }, `Language: ${languageId}.`)
      return
    }
    if (command === 'translate') { setRibbonMessage('Translation requires an external translation service and is not sent anywhere automatically.'); return }
    if (command === 'newComment') {
      if (!snapshot || snapshot.collapsed) return setRibbonMessage('Select text first.')
      const text = globalThis.prompt?.('Comment:', '')
      if (!text) return
      const record = createShadowDocsCommentRecord({ text, author: book.author || 'Author', chapterId: chapter.id })
      finishRibbonChange(addShadowDocsComment(editor, snapshot, record), `Comment added: ${record.text.slice(0, 80)}`)
      return
    }
    if (command === 'deleteComment') {
      const marks = getShadowDocsCommentMarks(editor)
      if (!marks.length) return setRibbonMessage('No comments found.')
      finishRibbonChange(removeShadowDocsCommentMark(editor, marks[0].id), 'Comment mark removed.')
      return
    }
    if (command === 'previousComment' || command === 'nextComment') { setRibbonMessage(selectMarkedNode('[data-shadow-docs-comment-id]', command === 'nextComment' ? 1 : -1) ? 'Comment selected.' : 'No comments found.'); return }
    if (command === 'trackChanges') { setRibbonState(state => ({ ...state, trackChanges: Boolean(value) })); setRibbonMessage(`Track Changes ${value ? 'on' : 'off'}.`); return }
    if (command === 'showMarkup') { setRibbonState(state => ({ ...state, showMarkup: !state.showMarkup })); return }
    if (command === 'reviewPane') { const changes = listShadowDocsChanges(editor); setRibbonMessage(changes.length ? `${changes.length} tracked change(s). ${changes[0].type}: ${changes[0].text}` : 'No tracked changes.'); return }
    if (command === 'displayReview') { setRibbonMessage(`${listShadowDocsChanges(editor).length} tracked change(s) in this chapter.`); return }
    if (command === 'acceptChange' || command === 'rejectChange') {
      const changes = listShadowDocsChanges(editor)
      if (!changes.length) return setRibbonMessage('No tracked changes.')
      const changed = command === 'acceptChange' ? acceptShadowDocsChange(editor, changes[0].id) : rejectShadowDocsChange(editor, changes[0].id)
      finishRibbonChange(changed, command === 'acceptChange' ? 'Change accepted.' : 'Change rejected.')
      return
    }
    if (command === 'previousChange' || command === 'nextChange') { setRibbonMessage(selectMarkedNode('[data-shadow-docs-change-id]', command === 'nextChange' ? 1 : -1) ? 'Tracked change selected.' : 'No tracked changes.'); return }
    if (command === 'compare' || command === 'compareDocuments') {
      const other = globalThis.prompt?.('Paste comparison text:', '')
      if (other != null) setRibbonMessage(`Current: ${(editor.textContent || '').length} characters · Comparison: ${other.length} characters.`)
      return
    }
    if (command === 'combine') {
      const other = globalThis.prompt?.('Text to combine at the cursor:', '')
      if (other) insertTextAtSelection(other)
      return
    }
    if (command === 'restrictEditing' || command === 'protectDocument' || command === 'protect') { const protectedEditing = !ribbonState.protectedEditing; setRibbonState(state => ({ ...state, protectedEditing })); setRibbonMessage(`Editing protection ${protectedEditing ? 'on' : 'off'}.`); return }

    if (['readMode', 'printLayout', 'webLayout', 'outline', 'draft'].includes(command)) { const viewMode = command.replace('Mode', '').replace('Layout', '').toLowerCase(); setRibbonState(state => ({ ...state, viewMode })); return }
    if (command === 'focus' || command === 'ruler' || command === 'gridlines' || command === 'syncScrolling') { const key = command === 'focus' ? 'focus' : command; setRibbonState(state => ({ ...state, [key]: Boolean(value) })); return }
    if (command === 'zoom100') { setRibbonState(state => ({ ...state, zoom: 100 })); return }
    if (command === 'onePage') { setRibbonState(state => ({ ...state, zoom: 85 })); return }
    if (command === 'multiplePages') { setRibbonState(state => ({ ...state, zoom: 70 })); return }
    if (command === 'mobileFit') { setRibbonState(state => ({ ...state, mobileFit: !state.mobileFit })); return }
    if (command === 'pageWidth') { setRibbonState(state => ({ ...state, zoom: 110 })); return }
    if (command === 'zoom') { const zoom = Number(globalThis.prompt?.('Zoom percent (50–200):', String(ribbonState.zoom || 100))); if (Number.isFinite(zoom)) setRibbonState(state => ({ ...state, zoom: Math.max(50, Math.min(200, zoom)) })); return }
    if (command === 'newWindow') { window.open(window.location.href, '_blank', 'noopener'); return }
    if (command === 'split') { setRibbonState(state => ({ ...state, splitView: !state.splitView })); return }
    if (['arrangeAll', 'sideBySide', 'switchWindows'].includes(command)) { setRibbonMessage('Window arrangement is handled by your browser/operating system.'); return }

    if (['pen', 'pencil', 'highlighter', 'eraser', 'lasso'].includes(command)) { setRibbonState(state => ({ ...state, drawTool: command })); setRibbonMessage(`${command} selected. Ink overlay is session-only until a drawing canvas is added.`); return }
    if (command === 'inkColor') { setRibbonState(state => ({ ...state, inkColor: value })); return }
    if (command === 'inkThickness') { setRibbonState(state => ({ ...state, inkThickness: Number(value) || 2 })); return }
    if (command === 'drawWithTouch') { setRibbonState(state => ({ ...state, drawWithTouch: Boolean(value) })); return }
    if (command === 'inkToShape' || command === 'inkToText' || command === 'inkToMath') { setRibbonMessage('Ink conversion needs a handwriting-recognition engine; no drawing data is uploaded.'); return }

    if (command === 'autoCorrect') { setRibbonState(state => ({ ...state, autoCorrect: Boolean(value) })); return }
    if (command === 'ocr') { setRibbonMessage('OCR requires an OCR engine. Image insertion remains local and no image is uploaded automatically.'); return }

    if (command === 'startMailMerge') { setRibbonState(state => ({ ...state, mailMergeActive: Boolean(value) })); return }
    if (command === 'selectRecipients') { mailingInputRef.current?.click(); return }
    if (command === 'editRecipients') { setRibbonMessage(`${recipients.length} recipient(s) loaded.`); return }
    if (command === 'mergeField') {
      const fields = getShadowDocsMergeFields(recipients)
      if (!fields.length) return setRibbonMessage('Load a recipient CSV first.')
      const field = globalThis.prompt?.(`Field: ${fields.join(', ')}`, fields[0])
      if (field) insertTextAtSelection(insertShadowDocsMergeField(field))
      return
    }
    if (command === 'addressBlock') { if (!recipients.length) return setRibbonMessage('Load a recipient CSV first.'); insertTextAtSelection(createShadowDocsAddressBlock(recipients[recipientIndex] || recipients[0])); return }
    if (command === 'greetingLine') { if (!recipients.length) return setRibbonMessage('Load a recipient CSV first.'); insertTextAtSelection(createShadowDocsGreetingLine(recipients[recipientIndex] || recipients[0])); return }
    if (command === 'previewResults') {
      if (!recipients.length) return setRibbonMessage('Load a recipient CSV first.')
      const content = buildShadowDocsMergedDocuments(editor.innerText || '', [recipients[recipientIndex] || recipients[0]])[0]?.content || ''
      setRibbonState(state => ({ ...state, previewMerge: Boolean(value) }))
      setRibbonMessage(content.slice(0, 240) || 'Preview is empty.')
      return
    }
    if (['firstRecord', 'previousRecord', 'nextRecord', 'lastRecord'].includes(command)) {
      if (!recipients.length) return setRibbonMessage('Load a recipient CSV first.')
      setRecipientIndex(index => command === 'firstRecord' ? 0 : command === 'lastRecord' ? recipients.length - 1 : command === 'previousRecord' ? Math.max(0, index - 1) : Math.min(recipients.length - 1, index + 1))
      return
    }
    if (command === 'findRecipient') {
      const query = globalThis.prompt?.('Find recipient:', '')?.toLowerCase()
      if (!query) return
      const index = recipients.findIndex(row => Object.values(row).some(item => String(item).toLowerCase().includes(query)))
      if (index >= 0) { setRecipientIndex(index); setRibbonMessage(`Recipient ${index + 1} selected.`) } else setRibbonMessage('Recipient not found.')
      return
    }
    if (command === 'finishMerge') {
      if (!recipients.length) return setRibbonMessage('Load a recipient CSV first.')
      const docs = buildShadowDocsMergedDocuments(editor.innerText || '', recipients)
      downloadText(`${String(book.title || 'Shadow Docs').replace(/[^\p{L}\p{N}_-]+/gu, '-')}-mail-merge.txt`, docs.map((item, index) => `--- ${index + 1} ---\n${item.content}`).join('\n\n'))
      return
    }
    if (command === 'envelopes' || command === 'labels' || command === 'rules' || command === 'matchFields') { setRibbonMessage('Mail merge recipients and fields are ready; use Address Block, Greeting Line, Merge Field, Preview, and Finish & Merge.'); return }

    setRibbonMessage(`${command} is available in the ribbon but needs a specialized external engine or object type.`)
  }

  async function runMobileMenuAction(action, payload = {}) {
    if (action === 'saveAs') {
      const name = String(payload.name || mobileDocumentName(book).replace(/\.[^.]+$/, '') || 'Docs').trim().replace(/[\\/:*?"<>|\u0000-\u001f]/g, '-').slice(0, 80)
      const format = String(payload.format || 'doc').toLowerCase()
      if (payload.encrypt) throw new Error('Encrypted Save As is not connected yet.')
      if (format === 'pdf') {
        onOpenPDF?.()
        return true
      }
      if (format === 'docx') throw new Error('DOCX export engine is not connected yet.')
      if (format === 'uot3') throw new Error('UOT3 export engine is not connected yet.')

      const cleanHTML = value => String(value || '')
      const escapeXML = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character])
      const chapterText = html => {
        const parsed = new DOMParser().parseFromString(String(html || ''), 'text/html')
        parsed.body.querySelectorAll('br').forEach(node => node.replaceWith('\n'))
        parsed.body.querySelectorAll('p,div,h1,h2,h3,li,blockquote').forEach(node => node.append('\n\n'))
        return (parsed.body.textContent || '').replace(/\n[ \t]+/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
      }
      const plainText = `${book?.title || 'Untitled Book'}\n${book?.author || ''}\n\n${(book?.chapters || []).map((item, index) => `${item.title || `Chapter ${index + 1}`}\n\n${chapterText(item.html)}`).join('\n\n${'—'.repeat(24)}\n\n')}\n`
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<shadowDocs title="${escapeXML(book?.title || 'Untitled Book')}" author="${escapeXML(book?.author || '')}">\n${(book?.chapters || []).map((item, index) => `  <chapter index="${index + 1}" title="${escapeXML(item.title || `Chapter ${index + 1}`)}"><![CDATA[${String(item.html || '').replaceAll(']]>', ']]]]><![CDATA[>')}]]></chapter>`).join('\n')}\n</shadowDocs>\n`
      const doc = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeXML(book?.title || 'Untitled Book')}</title></head><body>${(book?.chapters || []).map((item, index) => `<section${index ? ' style="page-break-before:always"' : ''}><h1>${escapeXML(item.title || `Chapter ${index + 1}`)}</h1>${cleanHTML(item.html)}</section>`).join('')}</body></html>`
      const content = format === 'txt' ? plainText : format === 'xml' ? xml : doc
      const type = format === 'txt' ? 'text/plain;charset=utf-8' : format === 'xml' ? 'application/xml;charset=utf-8' : 'application/msword;charset=utf-8'
      const url = URL.createObjectURL(new Blob([content], { type }))
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `${name}.${format}`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      setTimeout(() => URL.revokeObjectURL(url), 10_000)
      setRibbonMessage(`Saved ${name}.${format}`)
      return true
    }
    if (action === 'findReplace') {
      onOpenFindReplace?.()
      return
    }
    if (action === 'share') {
      try {
        if (navigator.share) {
          await navigator.share({
            title: mobileDocumentName(book),
            text: book?.title || 'Shadow Docs',
          })
          return
        }
      } catch (failure) {
        if (failure?.name === 'AbortError') return
      }
      setRibbonMessage('Share is unavailable in this browser.')
      return
    }
    if (action === 'print') {
      onPrint?.()
      return
    }
    if (action === 'rename') {
      onEditProperties?.()
      return
    }
    if (action === 'exportPdf' || action === 'exportImage' || action === 'conversion') {
      onOpenPDF?.()
      return
    }
    if (action === 'information') {
      setRibbonMessage(`${mobileDocumentName(book)} · ${overview.words.toLocaleString()} words · ${mobileDocumentSize(book)}`)
      return
    }
    setRibbonMessage('This menu action will be connected later.')
  }

  function trackBeforeInput(event) {
    if (!ribbonState.trackChanges || event.isComposing || !editorRef.current) return
    const snapshot = captureShadowDocsSelection(editorRef.current)
    if (!snapshot) return
    if (event.inputType === 'insertText' && event.data) {
      event.preventDefault()
      if (markShadowDocsInsertion(editorRef.current, snapshot, event.data, book.author || 'Author')) finishRibbonChange(true)
    } else if ((event.inputType === 'deleteContentBackward' || event.inputType === 'deleteContentForward') && !snapshot.collapsed) {
      event.preventDefault()
      if (markShadowDocsDeletion(editorRef.current, snapshot, book.author || 'Author')) finishRibbonChange(true)
    }
  }

  async function loadRecipients(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const rows = parseShadowDocsRecipientsCSV(await file.text())
      setRecipients(rows)
      setRecipientIndex(0)
      setRibbonMessage(`${rows.length} recipient(s) loaded.`)
    } catch (failure) {
      setRibbonMessage(failure instanceof Error ? failure.message : 'Could not read recipient CSV.')
    }
  }

  function quickFormat(command) {
    if (!editorRef.current || !chapter) return
    editorRef.current.focus()
    document.execCommand(command, false)
    emitChange()
    requestAnimationFrame(() => rememberSelection())
  }

  function chooseImage() {
    const editor = editorRef.current
    if (!editor || !chapter || imageBusy || typeof onChangeHTML !== 'function') return
    imageTargetRef.current = {
      bookId: book.id,
      chapterId: chapter.id,
      snapshot: currentSnapshot(),
      width: imageWidth,
      align: imageAlignment,
    }
    imageInputRef.current?.click()
  }

  async function insertImage(file) {
    const target = imageTargetRef.current
    imageTargetRef.current = null
    if (!target || !file) return
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 6_000_000) {
      setImageError('Choose a PNG, JPG or WebP image smaller than 6 MB.')
      return
    }
    setImageBusy(true)
    setImageError('')
    let bitmap
    let objectURL = ''
    try {
      if (typeof createImageBitmap === 'function') bitmap = await createImageBitmap(file)
      else {
        objectURL = URL.createObjectURL(file)
        bitmap = await new Promise((resolve, reject) => {
          const img = new Image()
          img.onload = () => resolve(img)
          img.onerror = () => reject(new Error('Cannot read this image.'))
          img.src = objectURL
        })
      }
      if (!bitmap.width || !bitmap.height) throw new Error('Invalid image dimensions.')
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Image conversion is unavailable in this browser.')
      let scale = Math.min(1, 1200 / bitmap.width, 1200 / bitmap.height)
      let src = ''
      for (let attempt = 0; attempt < 7; attempt += 1) {
        canvas.width = Math.max(1, Math.round(bitmap.width * scale))
        canvas.height = Math.max(1, Math.round(bitmap.height * scale))
        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
        src = canvas.toDataURL('image/jpeg', 0.8)
        if (src.length <= 300_000) break
        scale *= 0.75
      }
      if (src.length > 300_000) throw new Error('This image is too detailed. Choose a smaller image.')
      const editor = editorRef.current
      if (!editor || editor.dataset.chapterId !== target.chapterId || book.id !== target.bookId) return
      const alt = file.name.slice(0, 80).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
      const margin = target.align === 'left' ? '1em auto 1em 0' : target.align === 'right' ? '1em 0 1em auto' : '1em auto'
      const html = `<img src="${src}" alt="${alt}" data-shadow-docs-width="${target.width}" data-shadow-docs-align="${target.align}" style="display:block;width:${target.width}%;max-width:100%;height:auto;margin:${margin};break-inside:avoid"><p><br></p>`
      if (editor.innerHTML.length + html.length > 490_000) throw new Error('This chapter is too large for another image. Use a new chapter.')
      const selection = window.getSelection()
      let range = target.snapshot ? restoreShadowDocsSelection(editor, target.snapshot) : null
      editor.focus()
      if (!range) {
        range = document.createRange()
        range.selectNodeContents(editor)
        range.collapse(false)
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
      if (!document.execCommand('insertHTML', false, html)) throw new Error('Image insertion is unavailable in this browser.')
      emitChange()
      requestAnimationFrame(() => rememberSelection())
    } catch (failure) {
      setImageError(failure instanceof Error ? failure.message : 'Could not insert image.')
    } finally {
      bitmap?.close?.()
      if (objectURL) URL.revokeObjectURL(objectURL)
      setImageBusy(false)
    }
  }

  function pastePlain(event) {
    event.preventDefault()
    const value = event.clipboardData.getData('text/plain')
    if (!document.execCommand('insertText', false, value)) {
      const selection = window.getSelection()
      if (!selection?.rangeCount || !editorRef.current?.contains(selection.anchorNode)) return
      const range = selection.getRangeAt(0)
      range.deleteContents()
      const text = document.createTextNode(value)
      range.insertNode(text)
      range.setStartAfter(text)
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)
    }
    emitChange()
  }

  if (!book || !chapter) return <section className="sd-card"><BookOpen size={28} /><h2 className="mt-3">Writing Studio</h2><p className="mt-2 text-sm text-[#77758b] dark:text-white/60">Select a book in My Books to start writing.</p></section>

  return <section aria-label="Writing Studio" className={`sd-writing-layout ${ribbonState.mobileFit ? 'sd-mobile-fit-mode' : ''}`}>
    <style>{'.sd-writing-area hr[data-shadow-docs-page-break="1"]{border:0;border-top:2px dashed #8d76be;margin:22px 0;min-height:4px}.sd-writing-area p,.sd-writing-area div{margin-bottom:var(--sd-paragraph-spacing,.75em)}.sd-writing-area h1,.sd-writing-area h2,.sd-writing-area h3,.sd-writing-area li,.sd-writing-area blockquote{text-indent:0}.sd-writing-area img{max-width:100%;height:auto;break-inside:avoid}.sd-writing-area table{width:100%;border-collapse:collapse;margin:12px 0}.sd-writing-area td,.sd-writing-area th{border:1px solid #b9b4c7;padding:6px}.sd-writing-area.sd-gridlines{background-image:linear-gradient(#0000000d 1px,transparent 1px),linear-gradient(90deg,#0000000d 1px,transparent 1px);background-size:24px 24px}.sd-writing-area ins{background:#dff5e8;text-decoration:underline}.sd-writing-area del{background:#fde2e5;color:#9f3d49}'}</style>
    <style>{`
      .sd-mobile-editor-topbar{display:none}
      .sd-mobile-word-count{display:none}
      @media(max-width:700px){
        body:has(.sd-writing-layout),
        body:has(.sd-writing-layout) #root,
        body:has(.sd-writing-layout) .sd-app,
        body:has(.sd-writing-layout) .sd-main{
          background:#fff!important;
          overscroll-behavior-y:none;
        }
        body:has(.sd-writing-layout) .sd-header,
        body:has(.sd-writing-layout) .sd-main>.sd-topline,
        body:has(.sd-writing-layout) .sd-main>.sd-status,
        body:has(.sd-writing-layout) .sd-main>.sd-stack>.sd-button,
        body:has(.sd-writing-layout) .sd-main>.sd-stack>.sd-writing-layout~.sd-stack{
          display:none!important;
        }
        body:has(.sd-writing-layout) .sd-main{
          max-width:none!important;
          height:100dvh!important;
          margin:0!important;
          padding:54px 0 64px!important;
          overflow:hidden!important;
          background:#fff!important;
        }
        .sd-mobile-editor-topbar{
          position:fixed;
          z-index:82;
          top:0;
          left:0;
          right:0;
          height:54px;
          display:flex;
          align-items:center;
          gap:clamp(3px,1.2vw,6px);
          padding:0 8px;
          background:#292929;
          border-bottom:1px solid #3a3a3a;
          color:#f5f5f5;
        }
        .sd-mobile-editor-back{
          width:clamp(30px,9vw,34px);
          height:34px;
          display:grid;
          place-items:center;
          flex:none;
          border:0;
          border-radius:8px;
          background:transparent;
          color:inherit;
        }
        .sd-mobile-editor-back i{font-size:16px}
        .sd-mobile-editor-meta{
          width:48px;
          min-width:48px;
          display:flex;
          flex-direction:column;
          justify-content:center;
          gap:2px;
          overflow:visible;
        }
        .sd-mobile-editor-count{
          color:#f0f0f0;
          font-size:10px;
          font-weight:700;
          line-height:1.05;
          white-space:nowrap;
        }
        .sd-mobile-editor-autosave{
          color:#66d6b6;
          font-size:9px;
          font-weight:600;
          line-height:1.05;
          white-space:nowrap;
        }
        .sd-mobile-editor-actions{
          min-width:0;
          margin-left:auto;
          display:flex;
          align-items:center;
          justify-content:flex-end;
          gap:clamp(2px,1vw,6px);
        }
        .sd-mobile-editor-actions button{
          width:clamp(27px,8.5vw,34px);
          height:34px;
          display:grid;
          place-items:center;
          flex:none;
          border:0;
          border-radius:8px;
          background:transparent;
          color:inherit;
        }
        .sd-mobile-editor-actions .sd-mobile-page{
          width:clamp(25px,8vw,30px);
          min-width:clamp(25px,8vw,30px);
          height:30px;
          padding:0 5px;
          border:1px solid #777;
          border-radius:3px;
          font-size:10px;
          font-weight:700;
        }
        .sd-mobile-editor-actions .sd-mobile-save{
          width:auto;
          height:34px;
          padding:0 clamp(6px,2.4vw,11px);
          display:flex;
          gap:4px;
          border-radius:17px;
          background:#25a884;
          font-size:11px;
          font-weight:700;
        }
        .sd-mobile-editor-actions svg{
  width:21px;
  height:21px;
  stroke-width:1.8;
}
body:has(.sd-writing-layout) .sd-modal .sd-button-primary{
  background:#25a884!important;
  border-color:#25a884!important;
  color:#fff!important;
}
        .sd-writing-layout{
          position:fixed!important;
          z-index:35;
          top:54px;
          right:0;
          bottom:64px;
          left:0;
          display:block!important;
          min-height:0!important;
          margin:0!important;
          overflow:hidden!important;
          background:#fff!important;
        }
        .sd-writing-layout .sd-chapters,
        .sd-writing-layout .sd-editor-head,
        .sd-writing-layout .sd-editor-tools,
        .sd-writing-layout .sd-editor-actions,
        .sd-writing-layout .sd-editor-card>.my-3>p{
          display:none!important;
        }
        .sd-writing-layout .sd-writing-main{
          display:block!important;
          width:100%!important;
          height:100%!important;
          margin:0!important;
          padding:0!important;
          overflow:hidden!important;
          background:#fff!important;
        }
        .sd-writing-layout .sd-editor-card{
          display:flex!important;
          flex-direction:column!important;
          width:100%!important;
          height:100%!important;
          min-height:0!important;
          margin:0!important;
          padding:0!important;
          overflow:hidden!important;
          border:0!important;
          border-radius:0!important;
          background:#fff!important;
          box-shadow:none!important;
        }
        .sd-writing-layout .sd-editor-card>.my-3{
          flex:0 0 0!important;
          height:0!important;
          margin:0!important;
          padding:0!important;
        }
        .sd-writing-layout .sd-writing-area{
          box-sizing:border-box;
          flex:1 1 auto!important;
          width:100%!important;
          max-width:none!important;
          min-height:0!important;
          margin:0!important;
          padding:28px 24px 42px!important;
          overflow-x:hidden!important;
          overflow-y:auto!important;
          overscroll-behavior-y:contain;
          -webkit-overflow-scrolling:touch;
          border:0!important;
          border-radius:0!important;
          background:#fff!important;
          color:#111!important;
          box-shadow:none!important;
          zoom:1!important;
          caret-color:#111;
        }
        .sd-writing-layout.sd-mobile-fit-mode .sd-writing-area{
          width:100%!important;
          padding-top:4px!important;
          padding-left:2px!important;
          padding-right:2px!important;
        }
        .sd-writing-layout .sd-editor-footer,
        .sd-mobile-word-count{
          display:none!important;
        }
      }
    `}</style>
    <div className="sd-mobile-editor-topbar" aria-label="Mobile editor header">
      <button type="button" className="sd-mobile-editor-back" aria-label="Back" onClick={() => onOpenBooks?.()}><i className="fa-solid fa-chevron-left" /></button>
      <div className="sd-mobile-editor-meta">
        <span className="sd-mobile-editor-count">{(chapterStats?.words || 0).toLocaleString()} / Words</span>
        <span className="sd-mobile-editor-autosave">{localSaveDirty ? `Save ${localSaveSeconds}s` : 'Saved'}</span>
      </div>
      <div className="sd-mobile-editor-actions">
        <button type="button" aria-label="Undo" disabled={typeof onChangeHTML !== 'function'} onPointerDown={event => event.preventDefault()} onClick={() => quickFormat('undo')}><Undo2 /></button>
        <button type="button" aria-label="Redo" disabled={typeof onChangeHTML !== 'function'} onPointerDown={event => event.preventDefault()} onClick={() => quickFormat('redo')}><Redo2 /></button>
        <button type="button" className="sd-mobile-page" aria-label={`Chapter ${chapterIndex + 1}`} onClick={() => onOpenOutline?.()}><span>{chapterIndex + 1}</span></button>
        <button type="button" aria-label="Export" onClick={() => onOpenPDF?.()}><Share2 /></button>
        <button type="button" aria-label="Menu" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(true)}><Menu /></button>
        <button type="button" className="sd-mobile-save" aria-label="Save" onClick={() => void runRibbonCommand('save', true)}><Check /> Save</button>
      </div>
    </div>
    <ShadowDocsMobileMenu
      open={mobileMenuOpen}
      documentName={mobileDocumentName(book)}
      wordCount={overview.words}
      sizeText={mobileDocumentSize(book)}
      onClose={() => setMobileMenuOpen(false)}
      onAction={runMobileMenuAction}
    />
    {!ribbonState.focus && <aside className="sd-chapters">
      <div className="sd-side-head"><strong>Chapters</strong><button type="button" aria-label="Add chapter" title="Add chapter" disabled={typeof onAddChapter !== 'function'} onClick={onAddChapter}><Plus size={17} /></button></div>
      <div className="sd-chapter-list">{book.chapters.map((item, index) => <button type="button" key={item.id} className={`sd-chapter-item ${item.id === chapter.id ? 'is-active' : ''}`} onClick={() => onSelectChapter?.(item.id)} disabled={typeof onSelectChapter !== 'function'}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title || `Chapter ${index + 1}`}</strong></button>)}</div>
      <div className="sd-side-foot">{overview.chapterCount} chapters · {overview.words.toLocaleString()} words</div>
    </aside>}

    <div className="sd-writing-main">
      <div className="sd-card sd-editor-card">
        <div className="sd-editor-head">
          <div className="min-w-0 flex-1">
            <span className="sd-eyebrow">CHAPTER {chapterIndex + 1}</span>
            <input className="sd-chapter-title" aria-label="Chapter title" maxLength={160} value={chapter.title || ''} onChange={event => onRenameChapter?.(chapter.id, event.target.value)} disabled={typeof onRenameChapter !== 'function'} />
          </div>
          <button type="button" className="sd-button sd-button-ghost" onClick={() => onPreview?.(chapter.id)} disabled={typeof onPreview !== 'function'}><Eye size={16} /> Preview</button>
        </div>

        <div className="my-3">
          <ShadowDocsRibbon commandState={ribbonState} onCommand={runRibbonCommand} disabled={typeof onChangeHTML !== 'function'} />
          {ribbonMessage && <p role="status" className="mt-2 text-xs text-[#77758b] dark:text-white/60">{ribbonMessage}</p>}
        </div>

        <div className="sd-editor-tools" aria-label="Quick editor tools">
          <button type="button" title="Undo" aria-label="Undo" disabled={typeof onChangeHTML !== 'function'} onMouseDown={event => event.preventDefault()} onClick={() => quickFormat('undo')}>↶</button>
          <button type="button" title="Redo" aria-label="Redo" disabled={typeof onChangeHTML !== 'function'} onMouseDown={event => event.preventDefault()} onClick={() => quickFormat('redo')}>↷</button>
          <button type="button" title="Insert page break" aria-label="Insert page break" disabled={typeof onChangeHTML !== 'function'} onMouseDown={event => event.preventDefault()} onClick={() => void runRibbonCommand('pageBreak', true)} style={{ width: 'auto', padding: '0 10px', whiteSpace: 'nowrap' }}>Page break</button>
          <label className="flex items-center gap-1 text-xs">Image size <select aria-label="Image size" className="sd-field" style={{ minHeight: 35, padding: '4px 6px', width: 65 }} value={imageWidth} disabled={imageBusy} onChange={event => setImageWidth(Number(event.target.value))}><option value={50}>50%</option><option value={75}>75%</option><option value={100}>100%</option></select></label>
          <label className="flex items-center gap-1 text-xs">Align <select aria-label="Image alignment" className="sd-field" style={{ minHeight: 35, padding: '4px 6px', width: 80 }} value={imageAlignment} disabled={imageBusy} onChange={event => setImageAlignment(event.target.value)}><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></label>
          <button type="button" title="Insert image" aria-label="Insert image" disabled={imageBusy || typeof onChangeHTML !== 'function'} onMouseDown={event => event.preventDefault()} onClick={chooseImage} style={{ width: 'auto', padding: '0 10px', whiteSpace: 'nowrap' }}><ImagePlus size={16} /> {imageBusy ? 'Adding…' : 'Image'}</button>
        </div>

        <input ref={imageInputRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={event => { const file = event.target.files?.[0]; event.target.value = ''; if (file) void insertImage(file) }} />
        <input ref={mailingInputRef} type="file" accept=".csv,text/csv" hidden onChange={event => void loadRecipients(event)} />
        {imageError && <p role="alert" className="my-2 text-xs text-red-600 dark:text-red-300">{imageError}</p>}

        <div
          key={`${book.id}-${chapter.id}`}
          ref={editorRef}
          data-chapter-id={chapter.id}
          className={`sd-writing-area sd-view-${ribbonState.viewMode || 'print'} ${ribbonState.gridlines ? 'sd-gridlines' : ''}`}
          contentEditable={typeof onChangeHTML === 'function' && !ribbonState.protectedEditing && ribbonState.viewMode !== 'read'}
          suppressContentEditableWarning
          onBeforeInput={trackBeforeInput}
          onInput={emitChange}
          onBlur={() => { onEditorBlurRef.current?.(book.id); setLocalSaveDirty(false); setLocalSaveSeconds(10) }}
          onPaste={pastePlain}
          onMouseUp={rememberSelection}
          onKeyUp={rememberSelection}
          onTouchEnd={rememberSelection}
          onFocus={rememberSelection}
          data-placeholder="Start writing your chapter…"
          role="textbox"
          aria-label="Chapter text editor"
          aria-multiline="true"
          spellCheck
          style={{
            fontFamily: shadowDocsFontFamily(settings.font),
            fontSize: `${(Number(settings.fontSize) || 13) + 2}px`,
            lineHeight: settings.lineSpacing || 1.65,
            textAlign: settings.alignment || 'left',
            textIndent: `${firstLineIndent}mm`,
            '--sd-paragraph-spacing': `${paragraphSpacing}pt`,
            backgroundColor: settings.pageColor || '#ffffff',
            color: settings.textColor || undefined,
            direction: settings.textDirection || 'ltr',
            columnCount: settings.columns || 1,
            columnGap: `${settings.columnGap || 10}mm`,
            hyphens: settings.hyphenation ? 'auto' : 'manual',
            border: settings.borderWidth ? `${settings.borderWidth}px ${settings.borderStyle || 'solid'} ${settings.borderColor || '#d5d1df'}` : undefined,
            zoom: `${ribbonState.zoom || 100}%`,
          }}
        />

        <div className="sd-editor-footer">
          <span className="sd-desktop-word-count">{(chapterStats?.words || 0).toLocaleString()} words · {(chapterStats?.characters || 0).toLocaleString()} characters</span>
          <span className="sd-mobile-word-count">Word count: {(chapterStats?.words || 0).toLocaleString()}</span>
          <span><CheckCircle2 size={15} /> {status}</span>
        </div>
      </div>

      <div className="sd-editor-actions">
        <div className="sd-inline">
          <button type="button" className="sd-icon-button" title="Move chapter up" aria-label="Move chapter up" disabled={chapterIndex === 0 || typeof onMoveChapter !== 'function'} onClick={() => onMoveChapter(chapter.id, -1)}><ArrowUp size={17} /></button>
          <button type="button" className="sd-icon-button" title="Move chapter down" aria-label="Move chapter down" disabled={chapterIndex === book.chapters.length - 1 || typeof onMoveChapter !== 'function'} onClick={() => onMoveChapter(chapter.id, 1)}><ArrowDown size={17} /></button>
          <button type="button" className="sd-icon-button sd-icon-danger" title="Delete chapter" aria-label="Delete chapter" disabled={book.chapters.length < 2 || typeof onDeleteChapter !== 'function'} onClick={() => onDeleteChapter(chapter.id)}><Trash2 size={17} /></button>
        </div>
        <button type="button" className="sd-button sd-button-ghost" disabled={typeof onDownloadBackup !== 'function'} onClick={() => onDownloadBackup(book)}><Download size={16} /> Backup</button>
      </div>
    </div>
  </section>
}
