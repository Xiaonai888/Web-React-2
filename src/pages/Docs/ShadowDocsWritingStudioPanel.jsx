import { useEffect, useMemo, useRef } from 'react'
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, ArrowDown, ArrowUp, BookOpen, CheckCircle2, Download, Eye, Plus, Trash2 } from 'lucide-react'
import { getManuscriptOverview } from './ShadowDocsManuscriptTools'

const formats = [
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
  status = 'Saved on this device',
}) {
  const editorRef = useRef(null)
  const chapter = book?.chapters?.find(item => item.id === chapterId) || book?.chapters?.[0]
  const chapterIndex = book?.chapters?.findIndex(item => item.id === chapter?.id) ?? -1
  const overview = useMemo(() => getManuscriptOverview(book), [book])
  const chapterStats = overview.outline[chapterIndex]
  const settings = book?.settings || {}

  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = chapter?.html || ''
  }, [book?.id, chapter?.id])

  function emitChange() {
    if (editorRef.current && chapter && typeof onChangeHTML === 'function') onChangeHTML(chapter.id, editorRef.current.innerHTML)
  }

  function format(command, value) {
    if (!editorRef.current || !chapter) return
    editorRef.current.focus()
    document.execCommand(command, false, value)
    emitChange()
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
    <aside className="sd-chapters">
      <div className="sd-side-head"><strong>Chapters</strong><button type="button" aria-label="Add chapter" title="Add chapter" disabled={typeof onAddChapter !== 'function'} onClick={onAddChapter}><Plus size={17} /></button></div>
      <div className="sd-chapter-list">{book.chapters.map((item, index) => <button type="button" key={item.id} className={`sd-chapter-item ${item.id === chapter.id ? 'is-active' : ''}`} onClick={() => onSelectChapter?.(item.id)} disabled={typeof onSelectChapter !== 'function'}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title || `Chapter ${index + 1}`}</strong></button>)}</div>
      <div className="sd-side-foot">{overview.chapterCount} chapters · {overview.words.toLocaleString()} words</div>
    </aside>
    <div className="sd-writing-main">
      <div className="sd-card sd-editor-card">
        <div className="sd-editor-head"><div className="min-w-0 flex-1"><span className="sd-eyebrow">CHAPTER {chapterIndex + 1}</span><input className="sd-chapter-title" aria-label="Chapter title" maxLength={160} value={chapter.title || ''} onChange={event => onRenameChapter?.(chapter.id, event.target.value)} disabled={typeof onRenameChapter !== 'function'} /></div><button type="button" className="sd-button sd-button-ghost" onClick={() => onPreview?.(chapter.id)} disabled={typeof onPreview !== 'function'}><Eye size={16} /> Preview</button></div>
        <div className="sd-editor-tools" aria-label="Formatting toolbar">{formats.map(item => <button key={`${item.command}-${item.value || ''}`} type="button" title={item.label} aria-label={item.label} disabled={typeof onChangeHTML !== 'function'} onMouseDown={event => event.preventDefault()} onClick={() => format(item.command, item.value)}>{item.content}</button>)}</div>
        <div key={`${book.id}-${chapter.id}`} ref={editorRef} className="sd-writing-area" contentEditable={typeof onChangeHTML === 'function'} suppressContentEditableWarning onInput={emitChange} onBlur={() => onEditorBlur?.(book.id)} onPaste={pastePlain} data-placeholder="Start writing your chapter…" role="textbox" aria-label="Chapter text editor" aria-multiline="true" spellCheck style={{ fontFamily: `"${settings.font || 'Noto Serif Khmer'}",serif`, fontSize: `${(Number(settings.fontSize) || 13) + 2}px`, lineHeight: settings.lineSpacing || 1.65, textAlign: settings.alignment || 'left' }} />
        <div className="sd-editor-footer"><span>{(chapterStats?.words || 0).toLocaleString()} words · {(chapterStats?.characters || 0).toLocaleString()} characters</span><span><CheckCircle2 size={15} /> {status}</span></div>
      </div>
      <div className="sd-editor-actions"><div className="sd-inline"><button type="button" className="sd-icon-button" title="Move chapter up" aria-label="Move chapter up" disabled={chapterIndex === 0 || typeof onMoveChapter !== 'function'} onClick={() => onMoveChapter(chapter.id, -1)}><ArrowUp size={17} /></button><button type="button" className="sd-icon-button" title="Move chapter down" aria-label="Move chapter down" disabled={chapterIndex === book.chapters.length - 1 || typeof onMoveChapter !== 'function'} onClick={() => onMoveChapter(chapter.id, 1)}><ArrowDown size={17} /></button><button type="button" className="sd-icon-button sd-icon-danger" title="Delete chapter" aria-label="Delete chapter" disabled={book.chapters.length < 2 || typeof onDeleteChapter !== 'function'} onClick={() => onDeleteChapter(chapter.id)}><Trash2 size={17} /></button></div><button type="button" className="sd-button sd-button-ghost" disabled={typeof onDownloadBackup !== 'function'} onClick={() => onDownloadBackup(book)}><Download size={16} /> Backup</button></div>
    </div>
  </section>
}
