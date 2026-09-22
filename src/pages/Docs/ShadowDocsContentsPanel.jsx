import { BookOpen, ChevronRight } from 'lucide-react'
import { getShadowDocsContents } from './ShadowDocsContents'

export default function ShadowDocsContentsPanel({ book, onSelectChapter }) {
  const chapters = getShadowDocsContents(book)
  return <section className="sd-card" aria-label="Table of contents">
    <div className="flex items-center gap-2"><BookOpen size={19} className="text-[#7653bd]"/><h2>Table of contents</h2></div>
    <p className="mt-2 text-xs leading-6 text-[#77758b] dark:text-white/65">Review the order and titles of your chapters before printing.</p>
    {!chapters.length && <p className="mt-4 text-xs text-[#77758b]">No chapters yet.</p>}
    <ol className="mt-3 space-y-1">{chapters.map(chapter => <li key={chapter.id}>
      <button type="button" disabled={typeof onSelectChapter !== 'function'} onClick={() => onSelectChapter(chapter.id)} className="flex w-full min-w-0 items-center gap-3 rounded-xl px-3 py-2 text-left text-sm hover:bg-[#f5f0ff] disabled:cursor-default dark:hover:bg-white/5"><span className="w-7 shrink-0 text-xs font-semibold text-[#7653bd]">{chapter.number}.</span><span className="min-w-0 flex-1 break-words">{chapter.title}</span><ChevronRight size={15} className="shrink-0 opacity-50"/></button>
    </li>)}</ol>
  </section>
}
