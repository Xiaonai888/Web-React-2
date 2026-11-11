import { useState } from 'react'
import {
  AlignCenter, AlignLeft, AlignRight, BookOpen, Bookmark, CalendarClock, ChevronLeft, ChevronRight,
  FilePlus2, FileText, Heading1, Heading2, ImagePlus, Link2, ListOrdered, MessageSquarePlus, Scissors,
  Download, Library, Minus, Paperclip, PenLine, Plus, ScanText, Shapes, Sigma, Table2, Trash2, Type,
} from 'lucide-react'
import ShadowDocsMobileShapePanel from './ShadowDocsMobileShapePanel'
import ShadowDocsMobileScanTextPanel from './ShadowDocsMobileScanTextPanel'
import ShadowDocsMobileSignaturePanel from './ShadowDocsMobileSignaturePanel'
import ShadowDocsMobileResourcesPanel from './ShadowDocsMobileResourcesPanel'
import { getShadowDocsBookmarks } from './ShadowDocsLinkEngine'
import { downloadShadowDocsAttachment, listShadowDocsAttachments } from './ShadowDocsAttachmentEngine'

const PAGE_ACTIONS = [
  { id: 'coverPage', label: 'Cover Page', icon: FileText },
  { id: 'blankPage', label: 'Blank Page', icon: FilePlus2 },
  { id: 'breaks', label: 'Breaks', icon: Scissors },
  { id: 'horizontalRule', label: 'Divider', icon: Minus },
]
const OBJECT_ACTIONS = [
  { id: 'image', label: 'Image', icon: ImagePlus },
  { id: 'table', label: 'Table', icon: Table2 },
  { id: 'shape', label: 'Shape', icon: Shapes },
  { id: 'textBox', label: 'Text Box', icon: FileText },
  { id: 'scanText', label: 'Scan Text', icon: ScanText },
  { id: 'signature', label: 'Signature', icon: PenLine },
  { id: 'attachment', label: 'Attachment', icon: Paperclip },
  { id: 'resources', label: 'Resources', icon: Library },
]
const LINK_ACTIONS = [
  { id: 'link', label: 'Link', icon: Link2 },
  { id: 'bookmark', label: 'Bookmark', icon: Bookmark },
  { id: 'viewBookmarks', label: 'View Bookmarks', icon: BookOpen },
]
const NOTE_ACTIONS = [
  { id: 'insertFootnote', label: 'Footnote', icon: BookOpen },
  { id: 'insertEndnote', label: 'Endnote', icon: ListOrdered },
]
const TEXT_ACTIONS = [
  { id: 'dateTime', label: 'Date & Time', icon: CalendarClock },
  { id: 'symbol', label: 'Symbol', icon: Type },
  { id: 'equation', label: 'Equation', icon: Sigma },
  { id: 'comment', label: 'Comment', icon: MessageSquarePlus },
  { id: 'wordArt', label: 'Word Art', icon: Heading1 },
  { id: 'dropCap', label: 'Drop Cap', icon: Heading2 },
]
const DOCUMENT_ACTIONS = [
  { id: 'header', label: 'Header', icon: FileText },
  { id: 'footer', label: 'Footer', icon: FileText },
  { id: 'pageNumber', label: 'Page Numbers', icon: FilePlus2 },
]
const PANEL_VIEWS = new Set(['image', 'table', 'shape', 'textBox', 'scanText', 'signature', 'link', 'bookmark', 'viewBookmarks', 'breaks', 'attachment', 'resources', 'dateTime', 'symbol', 'equation', 'comment', 'header', 'footer', 'insertFootnote', 'insertEndnote'])
const WIDTHS = [50, 75, 100]
const ALIGNMENTS = [
  { value: 'left', label: 'Left', icon: AlignLeft },
  { value: 'center', label: 'Center', icon: AlignCenter },
  { value: 'right', label: 'Right', icon: AlignRight },
]
const SYMBOLS = ['©', '®', '™', '✓', '★', '∞', '±', '÷', '×', '€', '→', '♥']

function Stepper({ label, value, min, max, onChange, disabled }) {
  return <div className="sd-insert-setting-row">
    <span>{label}</span>
    <div className="sd-insert-stepper">
      <button type="button" aria-label={`Decrease ${label}`} disabled={disabled || value <= min} onPointerDown={event => event.preventDefault()} onClick={() => onChange(Math.max(min, value - 1))}><Minus size={18} /></button>
      <output>{value}</output>
      <button type="button" aria-label={`Increase ${label}`} disabled={disabled || value >= max} onPointerDown={event => event.preventDefault()} onClick={() => onChange(Math.min(max, value + 1))}><Plus size={18} /></button>
    </div>
  </div>
}

function InsertTitle({ title, onBack }) {
  return <div className="sd-insert-title">
    <button type="button" aria-label="Back to Insert" onPointerDown={event => event.preventDefault()} onClick={onBack}><ChevronLeft size={22} /></button>
    {title}
  </div>
}

export default function ShadowDocsMobileInsertPanel({ disabled = false, onCommand, onClose }) {
  const [view, setView] = useState('menu')
  const [width, setWidth] = useState(75)
  const [alignment, setAlignment] = useState('center')
  const [rows, setRows] = useState(2)
  const [columns, setColumns] = useState(2)
  const [headerRow, setHeaderRow] = useState(false)
  const [textBoxText, setTextBoxText] = useState('')
  const [dateTimeLocale, setDateTimeLocale] = useState('km-KH')
  const [dateTimeIncludeTime, setDateTimeIncludeTime] = useState(true)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [bookmarkName, setBookmarkName] = useState('')
  const [symbolText, setSymbolText] = useState('')
  const [equationText, setEquationText] = useState('')
  const [commentText, setCommentText] = useState('')
  const [headerText, setHeaderText] = useState('')
  const [footerText, setFooterText] = useState('')
  const [footnoteText, setFootnoteText] = useState('')
  const [endnoteText, setEndnoteText] = useState('')
  const [bookmarks, setBookmarks] = useState([])
  const [bookmarkSearch, setBookmarkSearch] = useState('')
  const [pendingBookmarkDelete, setPendingBookmarkDelete] = useState('')
  const [attachedFiles, setAttachedFiles] = useState([])
  const [attachmentError, setAttachmentError] = useState('')
  const [pendingAttachmentDelete, setPendingAttachmentDelete] = useState('')
  const [attachmentLoading, setAttachmentLoading] = useState(false)

  const canInsert = !disabled && typeof onCommand === 'function'
  const bookmarkToken = bookmarkName.trim().replace(/[^\p{L}\p{N}_-]+/gu, '-').replace(/^-+|-+$/g, '').slice(0, 80)
  const rawUrl = linkUrl.trim()
  let validLinkUrl = /^#sd-bookmark-[\p{L}\p{N}_-]{1,80}$/u.test(rawUrl)
  if (!validLinkUrl && rawUrl.length <= 2048) {
    try {
      validLinkUrl = ['http:', 'https:', 'mailto:', 'tel:'].includes(new URL(rawUrl).protocol)
    } catch {
      validLinkUrl = false
    }
  }

  function execute(command, value = true) {
    if (!canInsert) return
    onCommand(command, value)
    onClose?.()
  }

  function editorElement() {
    return typeof document === 'undefined' ? null : document.querySelector('.sd-writing-area')
  }

  function refreshBookmarks() {
    const entries = getShadowDocsBookmarks(editorElement())
      .filter(item => item.name && !item.name.startsWith('note-') && item.name !== 'endnotes-section')
      .slice(0, 200)
    setBookmarks(entries)
  }

  function navigateToBookmark(name) {
    const editor = editorElement()
    const target = [...(editor?.querySelectorAll('[data-shadow-docs-bookmark]') || [])]
      .find(element => element.getAttribute('data-shadow-docs-bookmark') === name)
    if (!target) {
      refreshBookmarks()
      return
    }
    onClose?.()
    requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' }))
  }

  function removeBookmark(name) {
    const editor = editorElement()
    if (!canInsert || !editor?.isContentEditable) return
    const target = [...editor.querySelectorAll('[data-shadow-docs-bookmark]')]
      .find(element => element.getAttribute('data-shadow-docs-bookmark') === name)
    if (!target) {
      refreshBookmarks()
      return
    }
    if (target.tagName === 'SPAN' && target.textContent === '\u200b' && !target.children.length) {
      target.remove()
    } else {
      target.removeAttribute('data-shadow-docs-bookmark')
      if (target.id === `sd-bookmark-${name}`) target.removeAttribute('id')
    }
    editor.dispatchEvent(new Event('input', { bubbles: true }))
    setPendingBookmarkDelete('')
    refreshBookmarks()
  }

  async function refreshAttachments() {
    const editor = editorElement()
    const chapterId = editor?.dataset.chapterId
    setAttachmentError('')
    setAttachedFiles([])
    if (!chapterId) {
      setAttachmentError('Open a chapter before managing its attachments.')
      return
    }
    setAttachmentLoading(true)
    try {
      const references = new Set([...editor.querySelectorAll('a[href^="#sd-attachment-"]')]
        .map(node => node.getAttribute('href')?.slice('#sd-attachment-'.length)).filter(Boolean))
      const items = await listShadowDocsAttachments(chapterId)
      setAttachedFiles(items.filter(item => references.has(item.id)))
    } catch (error) {
      setAttachmentError(error?.message || 'Could not open local attachments.')
    } finally {
      setAttachmentLoading(false)
    }
  }

  async function downloadAttachment(id) {
    try {
      setAttachmentError('')
      await downloadShadowDocsAttachment(id)
    } catch (error) {
      setAttachmentError(error?.message || 'Attachment is unavailable on this device.')
    }
  }

  function removeAttachment(id) {
    if (!canInsert) return
    setPendingAttachmentDelete('')
    execute('attachmentRemove', id)
  }

  function selectAction(id) {
    if (!canInsert) return
    if (id === 'attachment') {
      setPendingAttachmentDelete('')
      void refreshAttachments()
    }
    if (id === 'viewBookmarks') {
      setBookmarkSearch('')
      setPendingBookmarkDelete('')
      refreshBookmarks()
    }
    if (PANEL_VIEWS.has(id)) {
      setView(id)
      return
    }
    execute(id)
  }

  function actionGroup(title, actions) {
    return <>
      <h3 className="sd-insert-section-title">{title}</h3>
      <div className="sd-insert-quick">
        {actions.map(({ id, label, icon: Icon }) => <button key={id} type="button" disabled={!canInsert} onPointerDown={event => event.preventDefault()} onClick={() => selectAction(id)}><Icon /><span>{label}</span></button>)}
      </div>
    </>
  }

  function actionButton(label, command, value, icon = null, enabled = true) {
    return <button type="button" className="sd-insert-submit" disabled={!canInsert || !enabled} onPointerDown={event => event.preventDefault()} onClick={() => execute(command, value)}>{icon}{label}</button>
  }

  function textField(label, value, onChange, maxLength, placeholder = '', multiline = false) {
    return <label className="sd-insert-field">
      <span>{label}</span>
      {multiline ? <textarea aria-label={label} value={value} maxLength={maxLength} rows={5} placeholder={placeholder} disabled={!canInsert} onChange={event => onChange(event.target.value)} />
        : <input type="text" aria-label={label} value={value} maxLength={maxLength} placeholder={placeholder} disabled={!canInsert} onChange={event => onChange(event.target.value)} />}
    </label>
  }

  function renderContent() {
    if (view === 'menu') return <>
      {actionGroup('Pages', PAGE_ACTIONS)}
      {actionGroup('Insert Objects', OBJECT_ACTIONS)}
      {actionGroup('Links', LINK_ACTIONS)}
      {actionGroup('Notes', NOTE_ACTIONS)}
      {actionGroup('Text', TEXT_ACTIONS)}
      {actionGroup('Header & Footer', DOCUMENT_ACTIONS)}
      <p className="sd-insert-help">Select text before adding a comment, Word Art or Drop Cap. Put the cursor in the document before inserting other items.</p>
    </>

    if (view === 'breaks') return <>
      <InsertTitle title="Insert Break" onBack={() => setView('menu')} />
      <div className="sd-insert-card sd-insert-breaks">
        <button type="button" disabled={!canInsert} onPointerDown={event => event.preventDefault()} onClick={() => execute('pageBreak')}>
          <span><strong>Page Break</strong><small>Continue on a new page</small></span><FilePlus2 size={20} />
        </button>
        <button type="button" disabled={!canInsert} onPointerDown={event => event.preventDefault()} onClick={() => execute('lineBreak')}>
          <span><strong>Line Break</strong><small>Start a new line without a new paragraph</small></span><Scissors size={20} />
        </button>
      </div>
      <p className="sd-insert-help">Blank Page inserts an empty page; Page Break continues text on the next page. Section breaks and mixed page orientations are not supported in this document format.</p>
    </>

    if (view === 'attachment') return <>
      <InsertTitle title="Attachments" onBack={() => setView('menu')} />
      <p className="sd-insert-help">Files are stored only in this browser. They do not travel with document backups, PDF or Word exports. Keep a separate copy of each file.</p>
      <div className="sd-insert-card">
        <label className="sd-insert-attachment-picker">
          <Paperclip size={19} /> Add Attachment
          <input type="file" disabled={!canInsert} accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.rtf,.epub,.zip,.md,.json" onChange={event => {
            const file = event.target.files?.[0]
            event.target.value = ''
            if (file) execute('attachmentAdd', file)
          }} />
        </label>
        <p className="sd-insert-help">PDF, Office, text, EPUB or ZIP files. Maximum 5 MB each, 25 files or 25 MB per chapter.</p>
      </div>
      <h3 className="sd-insert-section-title">Attachments in this Chapter</h3>
      <div className="sd-insert-attachment-list">
        {attachmentLoading ? <p className="sd-insert-help">Loading attachments…</p> : null}
        {!attachmentLoading && !attachedFiles.length ? <p className="sd-insert-help">No locally available attachments in this chapter.</p> : null}
        {attachedFiles.map(item => <div className="sd-insert-attachment-row" key={item.id}>
          <span className="sd-insert-attachment-name"><Paperclip size={17} /><span><strong>{item.name}</strong><small>{(item.size / 1024).toFixed(1)} KB</small></span></span>
          {pendingAttachmentDelete === item.id ? <div className="sd-insert-attachment-confirm">
            <span>Delete file permanently?</span>
            <button type="button" onClick={() => setPendingAttachmentDelete('')}>Cancel</button>
            <button type="button" disabled={!canInsert} onClick={() => removeAttachment(item.id)}>Delete</button>
          </div> : <div className="sd-insert-attachment-controls">
            <button type="button" aria-label={`Download ${item.name}`} onClick={() => void downloadAttachment(item.id)}><Download size={19} /></button>
            <button type="button" aria-label={`Remove ${item.name}`} disabled={!canInsert} onClick={() => setPendingAttachmentDelete(item.id)}><Trash2 size={19} /></button>
          </div>}
        </div>)}
      </div>
      {attachmentError ? <p role="alert" className="sd-insert-attachment-error">{attachmentError}</p> : null}
    </>

    if (view === 'resources') return <ShadowDocsMobileResourcesPanel disabled={!canInsert} onBack={() => setView('menu')} onInsert={resource => execute('insertResource', resource.id)} onOpenTemplates={() => execute('templates')} />
    if (view === 'shape') return <ShadowDocsMobileShapePanel disabled={!canInsert} onBack={() => setView('menu')} onInsert={options => execute('shape', options)} />
    if (view === 'scanText') return <ShadowDocsMobileScanTextPanel disabled={!canInsert} onBack={() => setView('menu')} onInsert={text => execute('scanTextInsert', text)} />
    if (view === 'signature') return <ShadowDocsMobileSignaturePanel disabled={!canInsert} onBack={() => setView('menu')} onInsert={options => execute('signature', options)} />

    if (view === 'image') return <>
      <InsertTitle title="Insert Image" onBack={() => setView('menu')} />
      <div className="sd-insert-card">
        <div className="sd-insert-setting-row"><span>Image Width</span><div className="sd-insert-options">{WIDTHS.map(size => <button key={size} type="button" disabled={!canInsert} className={width === size ? 'is-selected' : ''} aria-pressed={width === size} onPointerDown={event => event.preventDefault()} onClick={() => setWidth(size)}>{size}%</button>)}</div></div>
        <div className="sd-insert-setting-row"><span>Alignment</span><div className="sd-insert-options">{ALIGNMENTS.map(({ value, label, icon: Icon }) => <button key={value} type="button" disabled={!canInsert} className={alignment === value ? 'is-selected' : ''} aria-label={label} title={label} aria-pressed={alignment === value} onPointerDown={event => event.preventDefault()} onClick={() => setAlignment(value)}><Icon size={19} /></button>)}</div></div>
      </div>
      <p className="sd-insert-help">PNG, JPG and WebP · Up to 6 MB.</p>
      {actionButton('Choose Image', 'pictures', { width, align: alignment }, <ImagePlus size={20} />)}
    </>

    if (view === 'table') return <>
      <InsertTitle title="Insert Table" onBack={() => setView('menu')} />
      <div className="sd-insert-card">
        <Stepper label="Rows" value={rows} min={1} max={50} onChange={setRows} disabled={!canInsert} />
        <Stepper label="Columns" value={columns} min={1} max={20} onChange={setColumns} disabled={!canInsert} />
        <div className="sd-insert-setting-row"><span>Header Row</span><button type="button" role="switch" aria-label="Header Row" aria-checked={headerRow} disabled={!canInsert} className={`sd-insert-switch ${headerRow ? 'is-on' : ''}`} onPointerDown={event => event.preventDefault()} onClick={() => setHeaderRow(previous => !previous)} /></div>
      </div>
      {actionButton(`Insert ${rows} × ${columns} Table`, 'table', { rows, columns, header: headerRow }, <Table2 size={20} />)}
    </>

    if (view === 'textBox') return <>
      <InsertTitle title="Insert Text Box" onBack={() => setView('menu')} />
      <div className="sd-insert-card">{textField('Text Box Content', textBoxText, setTextBoxText, 5000, 'Write text here...', true)}</div>
      {actionButton('Insert Text Box', 'textBox', textBoxText, <FileText size={20} />, Boolean(textBoxText.trim()))}
    </>

    if (view === 'dateTime') return <>
      <InsertTitle title="Insert Date & Time" onBack={() => setView('menu')} />
      <div className="sd-insert-card">
        <div className="sd-insert-setting-row"><span>Language</span><div className="sd-insert-options">{[{ value: 'km-KH', label: 'Khmer' }, { value: 'en-US', label: 'English' }].map(item => <button key={item.value} type="button" disabled={!canInsert} className={dateTimeLocale === item.value ? 'is-selected' : ''} aria-pressed={dateTimeLocale === item.value} onPointerDown={event => event.preventDefault()} onClick={() => setDateTimeLocale(item.value)}>{item.label}</button>)}</div></div>
        <div className="sd-insert-setting-row"><span>Include Time</span><button type="button" role="switch" aria-label="Include Time" aria-checked={dateTimeIncludeTime} disabled={!canInsert} className={`sd-insert-switch ${dateTimeIncludeTime ? 'is-on' : ''}`} onPointerDown={event => event.preventDefault()} onClick={() => setDateTimeIncludeTime(previous => !previous)} /></div>
      </div>
      <p className="sd-insert-help">Insert the current date, optionally including the time.</p>
      {actionButton('Insert Date & Time', 'dateTime', { locale: dateTimeLocale, includeTime: dateTimeIncludeTime }, <CalendarClock size={20} />)}
    </>

    if (view === 'link') return <>
      <InsertTitle title="Insert Link" onBack={() => setView('menu')} />
      <div className="sd-insert-card">
        {textField('Link URL', linkUrl, setLinkUrl, 2048, 'https://example.com')}
        {textField('Display Text (optional)', linkText, setLinkText, 160, 'Text to display')}
      </div>
      <p className="sd-insert-help">To link to a bookmark in this chapter, enter #sd-bookmark-name as the URL. If text is selected, that text will become the link.</p>
      {actionButton('Insert Link', 'link', { href: rawUrl, text: linkText.trim() }, <Link2 size={20} />, validLinkUrl)}
    </>

    if (view === 'bookmark') return <>
      <InsertTitle title="Insert Bookmark" onBack={() => setView('menu')} />
      <div className="sd-insert-card">{textField('Bookmark Name', bookmarkName, setBookmarkName, 80, 'Chapter-Start')}</div>
      <p className="sd-insert-help">Save a bookmark at the current cursor or selected paragraph. Link to it later using #sd-bookmark-{bookmarkToken || 'name'}.</p>
      {actionButton('Insert Bookmark', 'bookmark', bookmarkName.trim(), <Bookmark size={20} />, Boolean(bookmarkToken))}
    </>

    if (view === 'viewBookmarks') {
      const results = bookmarks.filter(item => `${item.name} ${item.text}`.toLocaleLowerCase().includes(bookmarkSearch.trim().toLocaleLowerCase()))
      return <>
        <InsertTitle title="View Bookmarks" onBack={() => setView('menu')} />
        <p className="sd-insert-help">Bookmarks in the current chapter. Tap a bookmark to jump to its position.</p>
        <label className="sd-insert-field">
          <span>Find Bookmark</span>
          <input type="search" aria-label="Search bookmarks" value={bookmarkSearch} maxLength={80} placeholder="Search bookmark names..." onChange={event => setBookmarkSearch(event.target.value)} />
        </label>
        <div className="sd-insert-bookmark-list">
          {!bookmarks.length ? <p className="sd-insert-help">There are no bookmarks in this chapter. Use Insert Bookmark to add one.</p> : null}
          {bookmarks.length > 0 && !results.length ? <p className="sd-insert-help">No matching bookmarks.</p> : null}
          {results.map(item => <div className="sd-insert-bookmark-row" key={item.name}>
            <button type="button" className="sd-insert-bookmark-jump" onPointerDown={event => event.preventDefault()} onClick={() => navigateToBookmark(item.name)}>
              <Bookmark size={18} />
              <span><strong>{item.name}</strong>{item.text && item.text !== '\u200b' ? <small>{item.text}</small> : null}</span>
              <ChevronRight size={18} />
            </button>
            {pendingBookmarkDelete === item.name ? <div className="sd-insert-bookmark-confirm">
              <span>Delete this bookmark?</span>
              <button type="button" onClick={() => setPendingBookmarkDelete('')}>Cancel</button>
              <button type="button" disabled={!canInsert} onClick={() => removeBookmark(item.name)}>Delete</button>
            </div> : <button type="button" className="sd-insert-bookmark-delete" aria-label={`Delete bookmark ${item.name}`} title="Delete bookmark" disabled={!canInsert} onPointerDown={event => event.preventDefault()} onClick={() => setPendingBookmarkDelete(item.name)}><Trash2 size={17} /></button>}
          </div>)}
        </div>
        <p className="sd-insert-help">Deleting a bookmark removes its destination, but does not delete the paragraph or text. Links to it will no longer work.</p>
      </>
    }

    if (view === 'insertFootnote' || view === 'insertEndnote') {
      const isFootnote = view === 'insertFootnote'
      const noteText = isFootnote ? footnoteText : endnoteText
      const setNoteText = isFootnote ? setFootnoteText : setEndnoteText
      return <>
        <InsertTitle title={isFootnote ? 'Insert Footnote' : 'Insert Endnote'} onBack={() => setView('menu')} />
        <div className="sd-insert-card">
          {textField(isFootnote ? 'Footnote Text' : 'Endnote Text', noteText, setNoteText, 4000, 'Write your note...', true)}
        </div>
        <p className="sd-insert-help">{isFootnote ? 'The note appears after the paragraph containing its reference.' : 'The note appears at the end of the current chapter.'} Tap its reference number to jump to the note.</p>
        {actionButton(isFootnote ? 'Insert Footnote' : 'Insert Endnote', view, noteText.trim(), isFootnote ? <BookOpen size={20} /> : <ListOrdered size={20} />, Boolean(noteText.trim()))}
      </>
    }

    if (view === 'symbol') return <>
      <InsertTitle title="Insert Symbol" onBack={() => setView('menu')} />
      <div className="sd-insert-card">
        {textField('Symbol', symbolText, setSymbolText, 16, '©')}
        <div className="sd-insert-symbols">{SYMBOLS.map(symbol => <button key={symbol} type="button" disabled={!canInsert} className={symbolText === symbol ? 'is-selected' : ''} onPointerDown={event => event.preventDefault()} onClick={() => setSymbolText(symbol)}>{symbol}</button>)}</div>
      </div>
      {actionButton('Insert Symbol', 'symbol', symbolText, <Type size={20} />, Boolean(symbolText.trim()))}
    </>

    if (view === 'equation') return <>
      <InsertTitle title="Insert Equation" onBack={() => setView('menu')} />
      <div className="sd-insert-card">{textField('Equation', equationText, setEquationText, 500, 'x² + y² = z²', true)}</div>
      <p className="sd-insert-help">Inserts the expression as document text, not a calculated formula.</p>
      {actionButton('Insert Equation', 'equation', equationText, <Sigma size={20} />, Boolean(equationText.trim()))}
    </>

    if (view === 'comment') return <>
      <InsertTitle title="Insert Comment" onBack={() => setView('menu')} />
      <div className="sd-insert-card">{textField('Comment Text', commentText, setCommentText, 2000, 'Write a comment...', true)}</div>
      <p className="sd-insert-help">Select the text you want to comment on before opening this panel.</p>
      {actionButton('Add Comment', 'newComment', commentText, <MessageSquarePlus size={20} />, Boolean(commentText.trim()))}
    </>

    if (view === 'header' || view === 'footer') {
      const isHeader = view === 'header'
      const text = isHeader ? headerText : footerText
      const setText = isHeader ? setHeaderText : setFooterText
      return <>
        <InsertTitle title={isHeader ? 'Set Header' : 'Set Footer'} onBack={() => setView('menu')} />
        <div className="sd-insert-card">{textField(isHeader ? 'Header Text' : 'Footer Text', text, setText, isHeader ? 80 : 60, isHeader ? 'Document header' : 'Document footer')}</div>
        <p className="sd-insert-help">Leave empty to clear the existing {isHeader ? 'header' : 'footer'}.</p>
        {actionButton(isHeader ? 'Save Header' : 'Save Footer', view, text, <FileText size={20} />)}
      </>
    }

    return <>
      <InsertTitle title="Insert" onBack={() => setView('menu')} />
    </>
  }

  return <div className="sd-insert-panel">
    <style>{`
      .sd-insert-panel{color:#ededed;padding:7px 0 20px;font-family:Inter,"Noto Sans Khmer",system-ui,sans-serif}
      .sd-insert-title{display:flex;align-items:center;gap:9px;min-height:42px;color:#eaeaea;font-size:15px;font-weight:650}
      .sd-insert-title button{width:36px;height:36px;border:0;background:transparent;color:inherit;display:grid;place-items:center;border-radius:9px}
      .sd-insert-quick{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin-top:5px}
      .sd-insert-quick button{min-width:0;min-height:91px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;border:0;border-radius:13px;background:#303030;color:#ededed;font-size:12px}
      .sd-insert-quick svg{width:29px;height:29px;stroke-width:1.55;color:#cdcdcd}
      .sd-insert-card{margin-top:12px;padding:8px 12px;background:#303030;border-radius:13px}
      .sd-insert-attachment-picker{position:relative;display:flex;gap:10px;align-items:center;justify-content:center;min-height:48px;border-radius:10px;background:#438fe6;color:#fff;font-size:14px;font-weight:650;overflow:hidden}
      .sd-insert-attachment-picker input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer}
      .sd-insert-attachment-list{display:grid;gap:8px}
      .sd-insert-attachment-row{padding:12px;background:#303030;border-radius:11px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
      .sd-insert-attachment-name{display:flex;align-items:center;gap:10px;min-width:0;flex:1}
      .sd-insert-attachment-name>span{display:grid;gap:3px;min-width:0}
      .sd-insert-attachment-name strong{overflow-wrap:anywhere;font-size:13px;font-weight:650}
      .sd-insert-attachment-name small{color:#aaa;font-size:11px}
      .sd-insert-attachment-controls,.sd-insert-attachment-confirm{display:flex;align-items:center;gap:8px}
      .sd-insert-attachment-controls button,.sd-insert-attachment-confirm button{border:1px solid #555;border-radius:8px;background:#3c3c3c;color:#eee;padding:9px;display:grid;place-items:center}
      .sd-insert-attachment-confirm{flex-basis:100%;justify-content:flex-end;font-size:12px}
      .sd-insert-attachment-error{color:#ff9a9a;font-size:12px;line-height:1.5}
      .sd-insert-breaks{padding:0 12px}
      .sd-insert-breaks>button{width:100%;min-height:74px;border:0;border-bottom:1px solid #484848;background:transparent;color:#ededed;display:flex;align-items:center;justify-content:space-between;gap:12px;text-align:left;padding:12px 4px}
      .sd-insert-breaks>button:last-child{border-bottom:0}
      .sd-insert-breaks>button span{display:grid;gap:5px}
      .sd-insert-breaks>button strong{font-size:14px;font-weight:650}
      .sd-insert-breaks>button small{font-size:12px;color:#aaa}
      .sd-insert-breaks>button svg{flex-shrink:0;color:#bbb}
      .sd-insert-section-title{margin:18px 4px 8px;font-size:12px;color:#aeb0b5;font-weight:500}
      .sd-insert-setting-row{min-height:62px;display:flex;align-items:center;justify-content:space-between;gap:10px;border-bottom:1px solid #414141;font-size:14px}
      .sd-insert-setting-row:last-child{border-bottom:0}
      .sd-insert-setting-row>span{color:#e1e1e1}
      .sd-insert-options{display:flex;gap:7px;justify-content:flex-end;flex-wrap:wrap}
      .sd-insert-options button{min-width:61px;min-height:39px;padding:7px 12px;border:1px solid #4b4b4b;border-radius:9px;background:#393939;color:#dedede;display:flex;align-items:center;justify-content:center;gap:6px;font-size:12px}
      .sd-insert-options button.is-selected{background:#3e4e65;border-color:#6aa7ec;color:#fff}
      .sd-insert-stepper{display:flex;align-items:center;gap:6px}
      .sd-insert-stepper button{height:39px;width:38px;display:grid;place-items:center;background:#3c3c3c;color:#fff;border:0;border-radius:9px}
      .sd-insert-stepper output{display:grid;place-items:center;min-width:43px;height:40px;background:#464646;border-radius:9px;font-weight:650}
      .sd-insert-switch{width:48px;height:28px;flex:none;border:0;border-radius:20px;background:#505050;padding:3px;display:flex;align-items:center}
      .sd-insert-switch:before{content:"";width:22px;height:22px;background:#b8b8b8;border-radius:50%;transition:transform .15s}
      .sd-insert-switch.is-on{background:#4184d1}
      .sd-insert-switch.is-on:before{background:#fff;transform:translateX(20px)}
      .sd-insert-submit{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;min-height:47px;margin-top:18px;border:0;border-radius:11px;background:#438fe6;color:white;font-size:15px;font-weight:700}
      .sd-insert-help{font-size:12px;line-height:1.6;color:#aeb0b5;padding:7px 4px}
      .sd-insert-field{display:grid;gap:9px;margin:8px 0;padding:7px 0;color:#ddd;font-size:13px}
      .sd-insert-field input,.sd-insert-field textarea{box-sizing:border-box;width:100%;border:1px solid #565656;border-radius:9px;outline:0;background:#383838;color:#fff;padding:11px 12px;font:inherit;font-size:14px;line-height:1.5}
      .sd-insert-field textarea{min-height:130px;resize:vertical}
      .sd-insert-field input:focus,.sd-insert-field textarea:focus{border-color:#65a5fa}
      .sd-insert-symbols{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:5px;margin:12px 0}
      .sd-insert-symbols button{min-height:40px;border:1px solid #555;border-radius:8px;background:#414141;color:#fff;font-size:20px}
      .sd-insert-symbols button.is-selected{border-color:#6aa7ec;background:#3e4e65}
      .sd-insert-bookmark-list{display:grid;gap:8px;margin-top:12px}
      .sd-insert-bookmark-row{display:flex;align-items:stretch;gap:6px;border:1px solid #474747;border-radius:11px;background:#303030;padding:5px}
      .sd-insert-bookmark-jump{display:flex;align-items:center;gap:10px;flex:1;min-width:0;min-height:57px;text-align:left;background:transparent;border:0;color:#f0f0f0;padding:7px 9px}
      .sd-insert-bookmark-jump>span{display:grid;gap:4px;flex:1;min-width:0}
      .sd-insert-bookmark-jump strong{overflow-wrap:anywhere;font-size:13px}
      .sd-insert-bookmark-jump small{color:#aaa;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px}
      .sd-insert-bookmark-delete{width:42px;flex:none;border:0;border-radius:9px;background:#3c3c3c;color:#e8b2b2}
      .sd-insert-bookmark-confirm{display:flex;align-items:center;gap:5px;flex-wrap:wrap;font-size:12px;color:#e2c0c0}
      .sd-insert-bookmark-confirm button{border:0;border-radius:7px;padding:9px;background:#494949;color:white}
      .sd-insert-bookmark-confirm button:last-child{background:#8b3030}
      .sd-insert-panel button:disabled{opacity:.35}
      .sd-insert-panel button:not(:disabled):active{filter:brightness(1.2)}
      .sd-insert-panel button:focus-visible{outline:2px solid #7db7ff;outline-offset:2px}
      @media(max-width:370px){.sd-insert-quick{gap:5px}.sd-insert-quick button{font-size:11px}.sd-insert-options button{min-width:50px;padding:6px 8px}}
    `}</style>
    {renderContent()}
  </div>
}
