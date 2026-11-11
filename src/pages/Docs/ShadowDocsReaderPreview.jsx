import { useState } from 'react'
import { BookOpen, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { sanitizeShadowDocsHTML } from './ShadowDocsBookModel'
import { shadowDocsFontFamily } from './ShadowDocsFontCatalog'
import ShadowDocsInkCanvas from './ShadowDocsInkCanvas'

const SIZES = { A5: [148, 210], A4: [210, 297], B5: [176, 250] }
const clamp = (value, min, max, fallback) => {
  const number = Number(value)
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback
}

export default function ShadowDocsReaderPreview({ book, onEditChapter, onPrint }) {
  const [selectedId, setSelectedId] = useState('')

  if (!book) {
    return <section className="sd-card">
      <h2>Reading preview</h2>
      <p className="mt-2 text-xs text-[#77758b]">Select a book to preview its chapters.</p>
    </section>
  }

  const chapters = Array.isArray(book.chapters) ? book.chapters : []
  const chapterIndex = Math.max(0, chapters.findIndex(item => item.id === selectedId))
  const chapter = chapters[chapterIndex]
  const settings = book.settings || {}
  const size = SIZES[settings.size] ? settings.size : 'A5'
  const orientation = settings.orientation === 'landscape' ? 'landscape' : 'portrait'
  const dimensions = SIZES[size]
  const [width, height] = orientation === 'landscape' ? [...dimensions].reverse() : dimensions
  const fontSize = clamp(settings.fontSize, 10, 24, 13)
  const lineSpacing = clamp(settings.lineSpacing, 1.2, 2.2, 1.65)
  const margin = clamp(settings.margin, 10, 35, 18)
  const firstLineIndent = clamp(settings.firstLineIndent, 0, 15, 0)
  const paragraphSpacing = clamp(settings.paragraphSpacing, 0, 20, 10)
  const alignment = ['left', 'center', 'right', 'justify'].includes(settings.alignment) ? settings.alignment : 'left'
  const textDirection = settings.textDirection === 'rtl' ? 'rtl' : 'ltr'
  const pageColor = /^#[0-9a-f]{6}$/i.test(settings.pageColor || '') ? settings.pageColor : '#ffffff'
  const textColor = /^#[0-9a-f]{6}$/i.test(settings.textColor || '') ? settings.textColor : '#292338'
  const ink = Array.isArray(chapter?.ink) ? chapter.ink : []

  return <section className="sd-stack" aria-label="Reading preview">
    <div className="sd-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2"><Eye size={20} /> Reading preview</h2>
          <p className="mt-2 text-xs text-[#77758b] dark:text-white/65">Review chapters without changing your draft. Final print page breaks may differ.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => chapter && onEditChapter?.(chapter.id)} disabled={!chapter || typeof onEditChapter !== 'function'} className="sd-button sd-button-ghost">Edit chapter</button>
          <button type="button" onClick={onPrint} disabled={typeof onPrint !== 'function'} className="sd-button sd-button-primary">PDF Studio</button>
        </div>
      </div>
      <label htmlFor="sd-preview-chapter" className="mt-4 block text-xs font-semibold">Chapter</label>
      <select id="sd-preview-chapter" value={chapter?.id || ''} onChange={event => setSelectedId(event.target.value)} disabled={!chapters.length} className="sd-field mt-2 w-full">
        {chapters.map((item, index) => <option key={item.id} value={item.id}>{index + 1}. {item.title || `Chapter ${index + 1}`}</option>)}
      </select>
      <div className="mt-4 flex items-center justify-between gap-2">
        <button type="button" disabled={chapterIndex === 0 || !chapters.length} onClick={() => setSelectedId(chapters[chapterIndex - 1].id)} className="sd-button sd-button-ghost"><ChevronLeft size={16} /> Previous</button>
        <span className="text-center text-xs text-[#77758b]">{chapters.length ? `${chapterIndex + 1} / ${chapters.length}` : '0 / 0'}</span>
        <button type="button" disabled={!chapters.length || chapterIndex === chapters.length - 1} onClick={() => setSelectedId(chapters[chapterIndex + 1].id)} className="sd-button sd-button-ghost">Next <ChevronRight size={16} /></button>
      </div>
    </div>

    {chapter ? <div className="rounded-2xl bg-[#eae7ef] p-3 dark:bg-[#282632] sm:p-5">
      <article className="mx-auto w-full overflow-hidden rounded-md shadow-lg" style={{ maxWidth: `${width}mm`, minHeight: `${height}mm`, padding: `${margin}mm`, backgroundColor: pageColor, color: textColor, fontFamily: shadowDocsFontFamily(settings.font), fontSize: `${fontSize}pt`, lineHeight: lineSpacing, textAlign: alignment, overflowWrap: 'anywhere', direction: textDirection }}>
        <h3 className="mb-7 break-words text-center text-[1.4em] font-bold">{chapter.title || `Chapter ${chapterIndex + 1}`}</h3>
        <div style={{ position: 'relative', isolation: 'isolate' }}>
          <div
            className="sd-writing-area"
            style={{
              fontFamily: shadowDocsFontFamily(settings.font),
              fontSize: `${fontSize}pt`,
              lineHeight: lineSpacing,
              textAlign: alignment,
              textIndent: `${firstLineIndent}mm`,
              '--sd-paragraph-spacing': `${paragraphSpacing}pt`,
              color: textColor,
              backgroundColor: pageColor,
              direction: textDirection,
              columnCount: Math.max(1, Math.min(4, Math.round(Number(settings.columns) || 1))),
              columnGap: `${settings.columnGap || 10}mm`,
              hyphens: settings.hyphenation ? 'auto' : 'manual',
            }}
            dangerouslySetInnerHTML={{ __html: sanitizeShadowDocsHTML(chapter.html) }}
          />
          {ink.length > 0 && <ShadowDocsInkCanvas key={`${book.id}-${chapter.id}`} strokes={ink} enabled={false} disabled />}
        </div>
        {settings.numbers !== false && <footer className="mt-12 text-center text-xs text-[#77758b]">{chapterIndex + 1}</footer>}
      </article>
      {ink.length > 0 && <p className="mt-3 text-center text-xs text-[#77758b] dark:text-white/60">{ink.length} drawing stroke{ink.length === 1 ? '' : 's'} · Ink positions are approximate in preview and may differ in PDF.</p>}
    </div> : <div className="sd-card text-center text-xs text-[#77758b]"><BookOpen size={27} className="mx-auto mb-2" />No chapters to preview.</div>}
  </section>
}
