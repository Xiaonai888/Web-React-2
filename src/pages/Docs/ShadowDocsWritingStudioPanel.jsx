import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, BookOpen, CheckCircle2, Download, Eye, ImagePlus, Plus, Trash2 } from 'lucide-react'
import { getManuscriptOverview } from './ShadowDocsManuscriptTools'
import { loadShadowDocsFont, shadowDocsFontFamily } from './ShadowDocsFontCatalog'
import ShadowDocsRibbon from './ShadowDocsRibbon'
import { captureShadowDocsSelection, restoreShadowDocsSelection } from './ShadowDocsSelectionEngine'
import { applyShadowDocsCommand, applyShadowDocsInlineFormat, applyShadowDocsParagraphFormat } from './ShadowDocsFormattingEngine'
import { readShadowDocsFormatState } from './ShadowDocsFormatState'
import { shadowDocsStyleCommand } from './ShadowDocsStyleCatalog'
import { createShadowDocsRibbonState } from './ShadowDocsRibbonState'
import { insertShadowDocsTable } from './ShadowDocsTableEngine'
import { applyShadowDocsLink, createShadowDocsBookmark } from './ShadowDocsLinkEngine'
import { insertShadowDocsDateTime, insertShadowDocsEquation, insertShadowDocsPageBreak, insertShadowDocsSymbol, insertShadowDocsTextBox } from './ShadowDocsInsertObjectsEngine'
import { copyShadowDocsSelection, cutShadowDocsSelection, insertShadowDocsClipboardText } from './ShadowDocsClipboardEngine'

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
  status = 'Saved on this device',
}) {
  const editorRef = useRef(null)
  const selectionRef = useRef(null)
  const imageInputRef = useRef(null)
  const imageTargetRef = useRef(null)
  const [imageWidth, setImageWidth] = useState(75)
  const [imageAlignment, setImageAlignment] = useState('center')
  const [imageError, setImageError] = useState('')
  const [imageBusy, setImageBusy] = useState(false)
  const [ribbonMessage, setRibbonMessage] = useState('')
  const [ribbonState, setRibbonState] = useState(() => createShadowDocsRibbonState())
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
    }))
  }, [book?.id, book?.title, book?.author, status, settings.font, settings.fontSize, settings.alignment, settings.size])

  function emitChange() {
    if (editorRef.current && chapter && typeof onChangeHTML === 'function') onChangeHTML(chapter.id, editorRef.current.innerHTML)
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
      onEditorBlur?.(book.id)
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
      setRibbonMessage('Find & Replace is available in Writing tools below.')
      return
    }

    setRibbonMessage(`${command} is not connected yet.`)
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

  return <section aria-label="Writing Studio" className="sd-writing-layout">
    <style>{'.sd-writing-area hr[data-shadow-docs-page-break="1"]{border:0;border-top:2px dashed #8d76be;margin:22px 0;min-height:4px}.sd-writing-area p,.sd-writing-area div{margin-bottom:var(--sd-paragraph-spacing,.75em)}.sd-writing-area h1,.sd-writing-area h2,.sd-writing-area h3,.sd-writing-area li,.sd-writing-area blockquote{text-indent:0}.sd-writing-area img{max-width:100%;height:auto;break-inside:avoid}.sd-writing-area table{width:100%;border-collapse:collapse;margin:12px 0}.sd-writing-area td,.sd-writing-area th{border:1px solid #b9b4c7;padding:6px}'}</style>
    <aside className="sd-chapters">
      <div className="sd-side-head"><strong>Chapters</strong><button type="button" aria-label="Add chapter" title="Add chapter" disabled={typeof onAddChapter !== 'function'} onClick={onAddChapter}><Plus size={17} /></button></div>
      <div className="sd-chapter-list">{book.chapters.map((item, index) => <button type="button" key={item.id} className={`sd-chapter-item ${item.id === chapter.id ? 'is-active' : ''}`} onClick={() => onSelectChapter?.(item.id)} disabled={typeof onSelectChapter !== 'function'}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title || `Chapter ${index + 1}`}</strong></button>)}</div>
      <div className="sd-side-foot">{overview.chapterCount} chapters · {overview.words.toLocaleString()} words</div>
    </aside>

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
        {imageError && <p role="alert" className="my-2 text-xs text-red-600 dark:text-red-300">{imageError}</p>}

        <div
          key={`${book.id}-${chapter.id}`}
          ref={editorRef}
          data-chapter-id={chapter.id}
          className="sd-writing-area"
          contentEditable={typeof onChangeHTML === 'function'}
          suppressContentEditableWarning
          onInput={emitChange}
          onBlur={() => onEditorBlur?.(book.id)}
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
          }}
        />

        <div className="sd-editor-footer"><span>{(chapterStats?.words || 0).toLocaleString()} words · {(chapterStats?.characters || 0).toLocaleString()} characters</span><span><CheckCircle2 size={15} /> {status}</span></div>
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
