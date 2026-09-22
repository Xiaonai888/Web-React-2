import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, BookOpen, ChevronRight, Plus, Search, X } from 'lucide-react'
import { getManuscriptOverview, searchManuscript } from './ShadowDocsManuscriptTools'

const number = value => Number(value || 0).toLocaleString()

export default function ShadowDocsManuscriptPanel({
  book,
  activeChapterId,
  onSelectChapter,
  onAddChapter,
  onMoveChapter,
}) {
  const [tab, setTab] = useState('chapters')
  const [query, setQuery] = useState('')
  const overview = useMemo(() => getManuscriptOverview(book), [book])
  const results = useMemo(() => searchManuscript(book, query, 40), [book, query])
  const chapters = overview.outline
  const canSelect = typeof onSelectChapter === 'function'
  const canMove = typeof onMoveChapter === 'function'
  const canAdd = typeof onAddChapter === 'function'

  function select(id) {
    if (canSelect) onSelectChapter(id)
  }

  return (
    <aside aria-label="Manuscript outline" className="min-w-0 overflow-hidden rounded-[20px] border border-[#e9e5f1] bg-white text-[#242139] shadow-sm dark:border-white/10 dark:bg-[#20202c] dark:text-white">
      <div className="border-b border-[#eeeaf4] p-4 dark:border-white/10">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <BookOpen size={19} className="shrink-0 text-[#7754b9]" />
            <h2 className="truncate text-[15px] font-bold">Manuscript</h2>
          </div>
          <button type="button" onClick={onAddChapter} disabled={!book || !canAdd} aria-label="Add chapter" title="Add chapter" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f0eaff] text-[#714eba] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#3e3058] dark:text-[#d8c6ff]"><Plus size={18} /></button>
        </div>
        <p className="mt-2 truncate text-[11px] text-[#898195] dark:text-white/50">{book?.title || 'Select a book to begin'}</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            ['Chapters', overview.chapterCount],
            ['Words', overview.words],
            ['Characters', overview.characters],
          ].map(([label, value]) => (
            <div key={label} className="min-w-0 rounded-xl bg-[#f8f5fe] px-1 py-2 dark:bg-white/5">
              <strong className="block truncate text-[13px] font-bold">{number(value)}</strong>
              <span className="mt-1 block text-[10px] text-[#898195] dark:text-white/55">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1 bg-[#f4f0fa] p-1 dark:bg-white/5" role="tablist" aria-label="Manuscript tools">
        {[
          ['chapters', 'Chapters'],
          ['search', 'Find in book'],
        ].map(([id, label]) => (
          <button key={id} id={`docs-manuscript-tab-${id}`} type="button" role="tab" aria-selected={tab === id} aria-controls={`docs-manuscript-panel-${id}`} onClick={() => setTab(id)} className={`rounded-lg px-2 py-2 text-[11px] font-semibold ${tab === id ? 'bg-white text-[#6f4db6] shadow-sm dark:bg-[#393047] dark:text-[#e1d1ff]' : 'text-[#888095] dark:text-white/55'}`}>{label}</button>
        ))}
      </div>

      {tab === 'chapters' && (
        <div id="docs-manuscript-panel-chapters" role="tabpanel" aria-labelledby="docs-manuscript-tab-chapters" className="max-h-[460px] space-y-1 overflow-y-auto p-2">
          {!chapters.length && <p className="p-4 text-center text-[12px] text-[#898195] dark:text-white/55">No chapters yet.</p>}
          {chapters.map((chapter, index) => (
            <div key={chapter.id} className={`flex min-w-0 items-center gap-1 rounded-xl border ${activeChapterId === chapter.id ? 'border-[#d9c8ff] bg-[#f7f2ff] dark:border-[#705491] dark:bg-[#3b3052]' : 'border-transparent hover:bg-[#faf8fe] dark:hover:bg-white/5'}`}>
              <button type="button" disabled={!canSelect} onClick={() => select(chapter.id)} aria-current={activeChapterId === chapter.id ? 'true' : undefined} className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-2 py-3 text-left disabled:cursor-default">
                <span className="w-6 shrink-0 text-center text-[10px] font-bold text-[#8c79b4]">{String(chapter.number).padStart(2, '0')}</span>
                <span className="min-w-0 flex-1"><strong className="block truncate text-[12px]">{chapter.title}</strong><small className="mt-1 block text-[10px] text-[#91899e] dark:text-white/50">{number(chapter.words)} words · {number(chapter.characters)} characters{chapter.empty ? ' · Empty' : ''}</small></span>
                <ChevronRight size={14} className="shrink-0 text-[#a297b5]" />
              </button>
              {canMove && <div className="flex shrink-0 flex-col pr-1">
                <button type="button" title="Move chapter up" aria-label={`Move ${chapter.title} up`} disabled={index === 0} onClick={() => onMoveChapter(chapter.id, -1)} className="grid h-7 w-7 place-items-center rounded-lg text-[#8d77ae] hover:bg-[#eee5fc] disabled:opacity-25"><ArrowUp size={13} /></button>
                <button type="button" title="Move chapter down" aria-label={`Move ${chapter.title} down`} disabled={index === chapters.length - 1} onClick={() => onMoveChapter(chapter.id, 1)} className="grid h-7 w-7 place-items-center rounded-lg text-[#8d77ae] hover:bg-[#eee5fc] disabled:opacity-25"><ArrowDown size={13} /></button>
              </div>}
            </div>
          ))}
        </div>
      )}

      {tab === 'search' && (
        <div id="docs-manuscript-panel-search" role="tabpanel" aria-labelledby="docs-manuscript-tab-search" className="p-3">
          <label className="flex h-10 items-center gap-2 rounded-xl border border-[#e9e5f1] px-3 dark:border-white/15">
            <Search size={16} className="shrink-0 text-[#8f82aa]" />
            <input type="search" maxLength={100} value={query} onChange={event => setQuery(event.target.value)} disabled={!book} aria-label="Search manuscript" placeholder="Search all chapters" className="min-w-0 flex-1 bg-transparent text-[12px] outline-none placeholder:text-[#aaa0b7]" />
            {query && <button type="button" aria-label="Clear search" onClick={() => setQuery('')} className="text-[#8f82aa]"><X size={15} /></button>}
          </label>
          <p className="my-3 text-[11px] text-[#91899e] dark:text-white/50">{!query.trim() ? 'Enter a word or phrase to find it in your book.' : `${number(results.length)} result${results.length === 1 ? '' : 's'}${results.length === 40 ? ' (first 40)' : ''}`}</p>
          <div className="max-h-[385px] space-y-2 overflow-y-auto">
            {results.map((result, index) => (
              <button key={`${result.chapterId}-${index}`} type="button" disabled={!canSelect} onClick={() => select(result.chapterId)} className="w-full min-w-0 rounded-xl border border-[#eeeaf4] p-3 text-left hover:border-[#d8c5ff] hover:bg-[#faf8ff] disabled:cursor-default dark:border-white/10 dark:hover:bg-white/5">
                <strong className="block truncate text-[12px] text-[#6f4db6] dark:text-[#d7c4ff]">{result.chapterNumber}. {result.chapterTitle}</strong>
                <span className="mt-1 block break-words text-[11px] leading-5 text-[#777084] dark:text-white/65">…{result.excerpt}…</span>
              </button>
            ))}
            {query.trim() && !results.length && <p className="py-4 text-center text-[12px] text-[#91899e] dark:text-white/50">No matches found.</p>}
          </div>
        </div>
      )}
    </aside>
  )
}
