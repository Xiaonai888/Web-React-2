import { useEffect, useMemo, useRef, useState } from 'react'
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, ArrowDown, ArrowUp, BookOpen, CheckCircle2, Download, Eye, ImagePlus, Plus, Trash2 } from 'lucide-react'
import { getManuscriptOverview } from './ShadowDocsManuscriptTools'
import { SHADOW_DOCS_KHMER_FONTS, SHADOW_DOCS_LATIN_FONTS, loadShadowDocsFont, shadowDocsFontFamily } from './ShadowDocsFontCatalog'

const formats = [
  { command: 'undo', label: 'Undo', content: '↶' },
  { command: 'redo', label: 'Redo', content: '↷' },
  { command: 'bold', label: 'Bold', content: <strong>B</strong> },
  { command: 'italic', label: 'Italic', content: <em>I</em> },
  { command: 'underline', label: 'Underline', content: <u>U</u> },
  { command: 'formatBlock', value: 'h2', label: 'Heading', content: 'H2' },
  { command: 'formatBlock', value: 'p', label: 'Paragraph', content: '¶' },
  { command: 'insertUnorderedList', label: 'Bulleted list', content: '≡' },
  { command: 'justifyLeft', label: 'Align left', content: <AlignLeft size={16} /> },
  { command: 'justifyCenter', label: 'Align center', content: <AlignCenter size={16} /> },
  { command: 'justifyRight', label: 'Align right', content: <AlignRight size={16} /> },
  { command: 'justifyFull', label: 'Justify', content: <AlignJustify size={16} /> },
]

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
  const fontSelectionRef = useRef(null)
  const imageInputRef = useRef(null)
  const imageTargetRef = useRef(null)
  const [imageWidth, setImageWidth] = useState(75)
  const [imageAlignment, setImageAlignment] = useState('center')
  const [imageError, setImageError] = useState('')
  const [imageBusy, setImageBusy] = useState(false)
  const chapter = book?.chapters?.find(item => item.id === chapterId) || book?.chapters?.[0]
  const chapterIndex = book?.chapters?.findIndex(item => item.id === chapter?.id) ?? -1
  const overview = useMemo(() => getManuscriptOverview(book), [book])
  const chapterStats = overview.outline[chapterIndex]
  const settings = book?.settings || {}
  useEffect(() => { loadShadowDocsFont(settings.font) }, [settings.font])
  useEffect(() => {
  const doc = new DOMParser().parseFromString(chapter?.html || '', 'text/html')
  doc.querySelectorAll('[style*="font-family"]').forEach(node => {
    const font = node.style.fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, '')
    loadShadowDocsFont(font)
  })
}, [book?.id, chapter?.id])
  const firstLineIndent = Math.min(15, Math.max(0, Number(settings.firstLineIndent) || 0))
  const paragraphSpacing = settings.paragraphSpacing == null ? 10 : Math.min(20, Math.max(0, Number(settings.paragraphSpacing) || 0))

  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = chapter?.html || ''
  }, [book?.id, chapter?.id])

  function emitChange() {
    if (editorRef.current && chapter && typeof onChangeHTML === 'function') onChangeHTML(chapter.id, editorRef.current.innerHTML)
  }

  function rememberFontSelection() {
  const selection = window.getSelection()
  const editor = editorRef.current
  if (!editor || !selection?.rangeCount) return
  const range = selection.getRangeAt(0)
  if (!range.collapsed && editor.contains(range.commonAncestorContainer)) fontSelectionRef.current = range.cloneRange()
}

function applySelectedFont(font) {
  const editor = editorRef.current
  const range = fontSelectionRef.current
  if (!editor || !range || range.collapsed || !editor.contains(range.commonAncestorContainer)) return
  loadShadowDocsFont(font)
  const selection = window.getSelection()
  editor.focus()
  selection.removeAllRanges()
  selection.addRange(range)
  document.execCommand('fontName', false, font)
  emitChange()
}

  function format(command, value) {
    if (!editorRef.current || !chapter) return
    editorRef.current.focus()
    document.execCommand(command, false, value)
    emitChange()
  }

  function insertPageBreak() {
    const editor = editorRef.current
    if (!editor || !chapter || typeof onChangeHTML !== 'function') return
    const selection = window.getSelection()
    if (!selection) return
    if (!selection.rangeCount || !editor.contains(selection.anchorNode)) {
      const end = document.createRange()
      end.selectNodeContents(editor)
      end.collapse(false)
      selection.removeAllRanges()
      selection.addRange(end)
    }
    editor.focus()
    const html = '<hr data-shadow-docs-page-break="1" contenteditable="false"><p><br></p>'
    if (document.execCommand('insertHTML', false, html)) emitChange()
  }

  function chooseImage() {
    const editor = editorRef.current
    if (!editor || !chapter || imageBusy || typeof onChangeHTML !== 'function') return
    const selection = window.getSelection()
    const range = selection?.rangeCount && editor.contains(selection.anchorNode) ? selection.getRangeAt(0).cloneRange() : null
    imageTargetRef.current = { bookId: book.id, chapterId: chapter.id, range, width: imageWidth, align: imageAlignment }
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
      const range = target.range && editor.contains(target.range.commonAncestorContainer) ? target.range : null
      editor.focus()
      if (selection) {
        selection.removeAllRanges()
        if (range) selection.addRange(range)
        else {
          const end = document.createRange()
          end.selectNodeContents(editor)
          end.collapse(false)
          selection.addRange(end)
        }
      }
      if (!document.execCommand('insertHTML', false, html)) throw new Error('Image insertion is unavailable in this browser.')
      emitChange()
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
    <style>{'.sd-writing-area hr[data-shadow-docs-page-break="1"]{border:0;border-top:2px dashed #8d76be;margin:22px 0;min-height:4px}.sd-writing-area p,.sd-writing-area div{margin-bottom:var(--sd-paragraph-spacing,.75em)}.sd-writing-area h1,.sd-writing-area h2,.sd-writing-area h3,.sd-writing-area li,.sd-writing-area blockquote{text-indent:0}.sd-writing-area img{max-width:100%;height:auto;break-inside:avoid}'}</style>
    <aside className="sd-chapters">
      <div className="sd-side-head"><strong>Chapters</strong><button type="button" aria-label="Add chapter" title="Add chapter" disabled={typeof onAddChapter !== 'function'} onClick={onAddChapter}><Plus size={17} /></button></div>
      <div className="sd-chapter-list">{book.chapters.map((item, index) => <button type="button" key={item.id} className={`sd-chapter-item ${item.id === chapter.id ? 'is-active' : ''}`} onClick={() => onSelectChapter?.(item.id)} disabled={typeof onSelectChapter !== 'function'}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title || `Chapter ${index + 1}`}</strong></button>)}</div>
      <div className="sd-side-foot">{overview.chapterCount} chapters · {overview.words.toLocaleString()} words</div>
    </aside>
    <div className="sd-writing-main">
      <div className="sd-card sd-editor-card">
        <div className="sd-editor-head"><div className="min-w-0 flex-1"><span className="sd-eyebrow">CHAPTER {chapterIndex + 1}</span><input className="sd-chapter-title" aria-label="Chapter title" maxLength={160} value={chapter.title || ''} onChange={event => onRenameChapter?.(chapter.id, event.target.value)} disabled={typeof onRenameChapter !== 'function'} /></div><button type="button" className="sd-button sd-button-ghost" onClick={() => onPreview?.(chapter.id)} disabled={typeof onPreview !== 'function'}><Eye size={16} /> Preview</button></div>
        <div className="mb-3 grid grid-cols-[minmax(0,1fr)_90px] gap-2"><label className="min-w-0 text-xs">Font<select className="sd-field mt-1 w-full" value={settings.font || 'Noto Serif Khmer'} disabled={!onChangeSettings} onMouseDown={rememberFontSelection} onTouchStart={rememberFontSelection} onChange={event => applySelectedFont(event.target.value)}><optgroup label="Khmer Fonts">{SHADOW_DOCS_KHMER_FONTS.map(font => <option key={font} value={font}>{font}</option>)}</optgroup><optgroup label="Other Fonts">{SHADOW_DOCS_LATIN_FONTS.map(font => <option key={font} value={font}>{font}</option>)}</optgroup></select></label><label className="min-w-0 text-xs">Size<select className="sd-field mt-1 w-full" value={settings.fontSize || 13} disabled={!onChangeSettings} onChange={event => onChangeSettings?.({ fontSize: Number(event.target.value) })}>{Array.from({ length: 15 }, (_, index) => index + 10).map(size => <option key={size} value={size}>{size} pt</option>)}</select></label></div>
        <div className="sd-editor-tools" aria-label="Formatting toolbar">{formats.map(item => <button key={`${item.command}-${item.value || ''}`} type="button" title={item.label} aria-label={item.label} disabled={typeof onChangeHTML !== 'function'} onMouseDown={event => event.preventDefault()} onClick={() => format(item.command, item.value)}>{item.content}</button>)}<button type="button" title="Insert page break" aria-label="Insert page break" disabled={typeof onChangeHTML !== 'function'} onMouseDown={event => event.preventDefault()} onClick={insertPageBreak} style={{ width: 'auto', padding: '0 10px', whiteSpace: 'nowrap' }}>Page break</button><label className="flex items-center gap-1 text-xs">Image size <select aria-label="Image size" className="sd-field" style={{ minHeight: 35, padding: '4px 6px', width: 65 }} value={imageWidth} disabled={imageBusy} onChange={event => setImageWidth(Number(event.target.value))}><option value={50}>50%</option><option value={75}>75%</option><option value={100}>100%</option></select></label><label className="flex items-center gap-1 text-xs">Align <select aria-label="Image alignment" className="sd-field" style={{ minHeight: 35, padding: '4px 6px', width: 80 }} value={imageAlignment} disabled={imageBusy} onChange={event => setImageAlignment(event.target.value)}><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></label><button type="button" title="Insert image" aria-label="Insert image" disabled={imageBusy || typeof onChangeHTML !== 'function'} onMouseDown={event => event.preventDefault()} onClick={chooseImage} style={{ width: 'auto', padding: '0 10px', whiteSpace: 'nowrap' }}><ImagePlus size={16} /> {imageBusy ? 'Adding…' : 'Image'}</button></div><input ref={imageInputRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={event => { const file = event.target.files?.[0]; event.target.value = ''; if (file) void insertImage(file) }}/>{imageError && <p role="alert" className="my-2 text-xs text-red-600 dark:text-red-300">{imageError}</p>}
        <div key={`${book.id}-${chapter.id}`} ref={editorRef} data-chapter-id={chapter.id} className="sd-writing-area" contentEditable={typeof onChangeHTML === 'function'} suppressContentEditableWarning onInput={emitChange} onBlur={() => onEditorBlur?.(book.id)} onPaste={pastePlain} onMouseUp={rememberFontSelection} onKeyUp={rememberFontSelection} onTouchEnd={rememberFontSelection} data-placeholder="Start writing your chapter…" role="textbox" aria-label="Chapter text editor" aria-multiline="true" spellCheck style={{ fontFamily: shadowDocsFontFamily(settings.font), fontSize: `${(Number(settings.fontSize) || 13) + 2}px`, lineHeight: settings.lineSpacing || 1.65, textAlign: settings.alignment || 'left', textIndent: `${firstLineIndent}mm`, '--sd-paragraph-spacing': `${paragraphSpacing}pt` }} />
        <div className="sd-editor-footer"><span>{(chapterStats?.words || 0).toLocaleString()} words · {(chapterStats?.characters || 0).toLocaleString()} characters</span><span><CheckCircle2 size={15} /> {status}</span></div>
      </div>
      <div className="sd-editor-actions"><div className="sd-inline"><button type="button" className="sd-icon-button" title="Move chapter up" aria-label="Move chapter up" disabled={chapterIndex === 0 || typeof onMoveChapter !== 'function'} onClick={() => onMoveChapter(chapter.id, -1)}><ArrowUp size={17} /></button><button type="button" className="sd-icon-button" title="Move chapter down" aria-label="Move chapter down" disabled={chapterIndex === book.chapters.length - 1 || typeof onMoveChapter !== 'function'} onClick={() => onMoveChapter(chapter.id, 1)}><ArrowDown size={17} /></button><button type="button" className="sd-icon-button sd-icon-danger" title="Delete chapter" aria-label="Delete chapter" disabled={book.chapters.length < 2 || typeof onDeleteChapter !== 'function'} onClick={() => onDeleteChapter(chapter.id)}><Trash2 size={17} /></button></div><button type="button" className="sd-button sd-button-ghost" disabled={typeof onDownloadBackup !== 'function'} onClick={() => onDownloadBackup(book)}><Download size={16} /> Backup</button></div>
    </div>
  </section>
}
