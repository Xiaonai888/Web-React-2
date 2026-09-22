import { useState } from 'react'
import { BookOpen, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { sanitizeShadowDocsHTML } from './ShadowDocsBookModel'

const SIZES = { A5: [148, 210], A4: [210, 297], B5: [176, 250] }
const FONTS = ['Noto Serif Khmer', 'Noto Sans Khmer', 'Battambang', 'Georgia', 'Arial']

export default function ShadowDocsReaderPreview({ book, onEditChapter, onPrint }) {
  const [selectedId, setSelectedId] = useState('')
  if (!book) return <section className="sd-card"><h2>Reading preview</h2><p className="mt-2 text-xs text-[#77758b]">Select a book to preview its chapters.</p></section>

  const chapters = Array.isArray(book.chapters) ? book.chapters : []
  const chapterIndex = Math.max(0, chapters.findIndex(chapter => chapter.id === selectedId))
  const chapter = chapters[chapterIndex]
  const settings = book.settings || {}
  const size = SIZES[settings.size] ? settings.size : 'A5'
  const [width, height] = SIZES[size]
  const fontSize = Math.min(24, Math.max(10, Number(settings.fontSize) || 13))
  const lineSpacing = Math.min(2.2, Math.max(1.2, Number(settings.lineSpacing) || 1.65))
  const margin = Math.min(35, Math.max(10, Number(settings.margin) || 18))
  const font = FONTS.includes(settings.font) ? settings.font : FONTS[0]
  const alignment = ['left', 'center', 'right', 'justify'].includes(settings.alignment) ? settings.alignment : 'left'

  return <section className="sd-stack" aria-label="Reading preview">
    <div className="sd-card">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="flex items-center gap-2"><Eye size={20}/> Reading preview</h2><p className="mt-2 text-xs text-[#77758b] dark:text-white/65">Review chapters without changing your draft. Final print page breaks may differ.</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => chapter && onEditChapter?.(chapter.id)} disabled={!chapter || typeof onEditChapter !== 'function'} className="sd-button sd-button-ghost">Edit chapter</button><button type="button" onClick={onPrint} disabled={typeof onPrint !== 'function'} className="sd-button sd-button-primary">PDF Studio</button></div></div>
      <label htmlFor="sd-preview-chapter" className="mt-4 block text-xs font-semibold">Chapter</label><select id="sd-preview-chapter" value={chapter?.id || ''} onChange={event => setSelectedId(event.target.value)} disabled={!chapters.length} className="sd-field mt-2 w-full">{chapters.map((item, index) => <option key={item.id} value={item.id}>{index + 1}. {item.title || `Chapter ${index + 1}`}</option>)}</select>
      <div className="mt-4 flex items-center justify-between gap-2"><button type="button" disabled={chapterIndex === 0 || !chapters.length} onClick={() => setSelectedId(chapters[chapterIndex - 1].id)} className="sd-button sd-button-ghost"><ChevronLeft size={16}/> Previous</button><span className="text-center text-xs text-[#77758b]">{chapters.length ? `${chapterIndex + 1} / ${chapters.length}` : 'No chapters'}</span><button type="button" disabled={!chapters.length || chapterIndex === chapters.length - 1} onClick={() => setSelectedId(chapters[chapterIndex + 1].id)} className="sd-button sd-button-ghost">Next <ChevronRight size={16}/></button></div>
    </div>
    {chapter ? <div className="rounded-2xl bg-[#eae7ef] p-3 dark:bg-[#282632] sm:p-5"><article className="mx-auto w-full overflow-hidden rounded-md bg-white text-[#292338] shadow-lg" style={{ maxWidth: `${width}mm`, minHeight: `${Math.min(height, 210)}mm`, padding: `${margin}mm`, fontFamily: `"${font}", serif`, fontSize: `${fontSize}pt`, lineHeight: lineSpacing, textAlign: alignment, overflowWrap: 'anywhere' }}><h3 className="mb-7 break-words text-center text-[1.4em] font-bold">{chapter.title || `Chapter ${chapterIndex + 1}`}</h3><div className="space-y-3 break-words" dangerouslySetInnerHTML={{ __html: sanitizeShadowDocsHTML(chapter.html) }}/>{settings.numbers !== false && <footer className="mt-12 text-center text-xs text-[#77758b]">{chapterIndex + 1}</footer>}</article></div> : <div className="sd-card text-center text-xs text-[#77758b]"><BookOpen size={27} className="mx-auto mb-2"/>No chapters to preview.</div>}
  </section>
}
