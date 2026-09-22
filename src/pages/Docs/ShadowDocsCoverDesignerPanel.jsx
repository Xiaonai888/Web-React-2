import { useEffect, useMemo, useState } from 'react'
import { Check, ImagePlus, PenLine, Trash2 } from 'lucide-react'
import { getBookTemplate, getCoverPreset } from './ShadowDocsTemplateCatalog'

export default function ShadowDocsCoverDesignerPanel({ book, onSaveDetails, onUploadCover, onRemoveCover }) {
  const [title, setTitle] = useState(book?.title || '')
  const [author, setAuthor] = useState(book?.author || '')
  const [message, setMessage] = useState('')

  useEffect(() => {
    setTitle(book?.title || '')
    setAuthor(book?.author || '')
    setMessage('')
  }, [book?.id, book?.title, book?.author])

  const template = useMemo(() => getBookTemplate(book?.template), [book?.template])
  const preset = useMemo(() => getCoverPreset(template.cover), [template.cover])
  const canSave = typeof onSaveDetails === 'function'
  const hasChanges = title.trim() !== (book?.title || '') || author.trim() !== (book?.author || '')

  function save(event) {
    event.preventDefault()
    if (!book || !canSave || !title.trim()) return
    onSaveDetails({ title: title.trim().slice(0, 160), author: author.trim().slice(0, 120) })
    setMessage('Cover details saved to this book.')
  }

  if (!book) return (
    <section className="sd-card" aria-label="Cover designer">
      <h2>Cover Designer</h2>
      <p className="mt-2 text-sm text-[#77758b] dark:text-white/65">Select a book in My Books to design its cover.</p>
    </section>
  )

  return (
    <section className="sd-card" aria-label="Cover designer">
      <div className="flex items-center gap-2"><PenLine size={19} className="text-[#7653bd]" /><h2>Cover Designer</h2></div>
      <p className="mt-2 text-xs leading-6 text-[#77758b] dark:text-white/65">Edit the title, author and cover image. Changes to the title and author also update your book details.</p>
      <div className="mt-5 grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="mx-auto flex aspect-[3/4] w-full max-w-[300px] flex-col items-center justify-between overflow-hidden rounded-[18px] p-[10%] text-center shadow-md" style={{ background: preset.background, backgroundImage: book.image ? `linear-gradient(180deg,rgba(15,12,31,.28),rgba(15,12,31,.72)),url("${book.image}")` : preset.background, backgroundPosition: 'center', backgroundSize: 'cover', color: book.image ? '#ffffff' : preset.foreground }}>
          <span aria-hidden="true" className="text-4xl">{template.symbol}</span>
          <div className="min-w-0 w-full">
            <span className="block text-[8px] font-semibold tracking-[.14em] opacity-85">SHADOW DOCS</span>
            <strong className="mt-4 block break-words text-xl leading-relaxed" style={{ fontFamily: 'Georgia, "Noto Serif Khmer", serif' }}>{title.trim() || 'Untitled Book'}</strong>
            <span className="mx-auto my-4 block h-px w-14" style={{ background: book.image ? '#ffffff' : preset.accent }} />
            <small className="block break-words text-xs">{author.trim() || 'YOUR NAME'}</small>
          </div>
          <span aria-hidden="true" className="text-2xl">{template.symbol}</span>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#7653bd] dark:text-[#d4c1ff]">{template.name} cover</p>
          <form className="mt-4 space-y-4" onSubmit={save}>
            <label className="block text-xs font-semibold">Book title<input required maxLength={160} value={title} onChange={event => { setTitle(event.target.value); setMessage('') }} className="sd-field mt-2 w-full" placeholder="Enter a book title" /></label>
            <label className="block text-xs font-semibold">Author name<input maxLength={120} value={author} onChange={event => { setAuthor(event.target.value); setMessage('') }} className="sd-field mt-2 w-full" placeholder="Enter an author name" /></label>
            <button type="submit" disabled={!canSave || !title.trim() || !hasChanges} className="sd-button sd-button-primary w-full"><Check size={16} /> Save cover details</button>
          </form>
          {message && <p role="status" className="mt-3 text-xs text-[#34775a] dark:text-[#9ee0bd]">{message}</p>}
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" onClick={onUploadCover} disabled={typeof onUploadCover !== 'function'} className="sd-button sd-button-ghost"><ImagePlus size={16} /> {book.image ? 'Change image' : 'Upload image'}</button>
            {book.image && <button type="button" onClick={onRemoveCover} disabled={typeof onRemoveCover !== 'function'} className="sd-button sd-button-ghost"><Trash2 size={16} /> Remove image</button>}
          </div>
          <p className="mt-3 text-[11px] leading-5 text-[#77758b] dark:text-white/60">Your image is saved in the local book project. Download a backup to keep a separate copy.</p>
        </div>
      </div>
    </section>
  )
}
