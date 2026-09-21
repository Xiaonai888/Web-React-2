import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, ChevronLeft, FileDown, FileText, FolderOpen, LayoutTemplate, PenLine, Plus, Search, Settings2 } from 'lucide-react'

const sections = [
  { id: 'books', label: 'My Books', icon: BookOpen },
  { id: 'write', label: 'Writing', icon: PenLine },
  { id: 'design', label: 'Designer', icon: Settings2 },
  { id: 'templates', label: 'Templates', icon: LayoutTemplate },
  { id: 'pdf', label: 'PDF Studio', icon: FileDown },
]

const templates = [
  { name: 'Classic', colors: 'from-amber-50 to-orange-200', accent: 'text-amber-800', mark: '✦' },
  { name: 'Minimal', colors: 'from-slate-50 to-slate-200', accent: 'text-slate-700', mark: '◈' },
  { name: 'Modern', colors: 'from-indigo-100 to-violet-300', accent: 'text-indigo-900', mark: '◇' },
  { name: 'Elegant', colors: 'from-rose-50 to-rose-200', accent: 'text-rose-800', mark: '❀' },
]

function Surface({ children, className = '' }) {
  return <section className={`rounded-[22px] border border-[#e8e5f0] bg-white p-4 shadow-[0_8px_30px_rgba(42,30,79,0.035)] dark:border-white/10 dark:bg-[#20202c] ${className}`}>{children}</section>
}

export default function ShadowDocsPage() {
  const navigate = useNavigate()
  const [section, setSection] = useState('books')
  const [filter, setFilter] = useState('All Books')
  const [search, setSearch] = useState('')
  const [template, setTemplate] = useState('Classic')
  const pageTitle = sections.find((item) => item.id === section)?.label || 'My Books'

  return (
    <div className="min-h-screen bg-[#faf9fc] pb-24 text-[#242139] dark:bg-[#11121c] dark:text-white">
      <header className="sticky top-0 z-20 border-b border-[#eae8f2] bg-white/95 backdrop-blur dark:border-white/10 dark:bg-[#191925]/95">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4">
          <button type="button" onClick={() => navigate('/app')} aria-label="Back to App" className="grid h-10 w-10 place-items-center rounded-xl hover:bg-[#f4f1fb] dark:hover:bg-white/10"><ChevronLeft size={22} /></button>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#eee9ff] text-[#6746b3] dark:bg-[#3d315b] dark:text-[#d5c4ff]"><BookOpen size={22} /></div>
          <div className="min-w-0 flex-1"><p className="truncate text-[16px] font-bold tracking-tight">Shadow Docs</p><p className="text-[11px] text-[#817c91] dark:text-white/50">Write · Design · Publish</p></div>
          <span className="rounded-full bg-[#f0ebff] px-3 py-1.5 text-[10px] font-semibold text-[#6a4bbb] dark:bg-[#392c56] dark:text-[#d5c4ff]">UI Preview</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-8 pt-6">
        <div className="mb-5"><p className="text-[11px] font-semibold uppercase tracking-[.22em] text-[#9179c6]">Your publishing workspace</p><h1 className="mt-1 text-[28px] font-bold tracking-tight">{pageTitle}</h1></div>

        {section === 'books' && <div className="space-y-4">
          <Surface className="overflow-hidden bg-gradient-to-br from-[#f8f5ff] via-white to-white dark:from-[#292039] dark:via-[#20202c] dark:to-[#20202c]">
            <div className="flex items-start justify-between gap-4"><div><p className="text-[11px] font-semibold uppercase tracking-[.17em] text-[#8061bf]">My library</p><h2 className="mt-2 text-[20px] font-bold">Every book starts here.</h2><p className="mt-1 max-w-sm text-[13px] leading-6 text-[#7b768a] dark:text-white/55">Keep your writing, book designs and finished documents together.</p></div><div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#e7ddff] text-[#694bbb] dark:bg-[#4a386d] dark:text-[#e0d4ff]"><BookOpen size={27} /></div></div>
            <button type="button" disabled title="Book creation will be connected in the next stage" className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-[#7050bd] px-5 text-[13px] font-semibold text-white opacity-55"><Plus size={17} /> New Book</button>
          </Surface>
          <div className="grid grid-cols-3 gap-2 rounded-xl bg-[#eeebf5] p-1 dark:bg-white/10">{['All Books', 'Drafts', 'Completed'].map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`rounded-lg px-2 py-2.5 text-[12px] font-semibold transition ${filter === item ? 'bg-white text-[#6548ae] shadow-sm dark:bg-[#383044] dark:text-[#e1d4ff]' : 'text-[#898395] dark:text-white/55'}`}>{item}</button>)}</div>
          <label className="flex h-12 items-center gap-3 rounded-xl border border-[#e6e3ef] bg-white px-4 dark:border-white/10 dark:bg-[#20202c]"><Search size={18} className="text-[#9b93aa]"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your books" className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#aaa4b5]" /></label>
          <Surface className="flex min-h-[210px] flex-col items-center justify-center text-center"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#f2edff] text-[#8062c4] dark:bg-[#3b3052]"><FolderOpen size={27} /></div><p className="mt-3 text-[15px] font-semibold">No books yet</p><p className="mt-1 max-w-xs text-[12px] leading-5 text-[#8b8599] dark:text-white/50">Your projects will appear here once local book creation is connected.</p></Surface>
        </div>}

        {section === 'write' && <Surface className="min-h-[500px]"><div className="flex items-center justify-between gap-3 border-b border-[#efedf4] pb-4 dark:border-white/10"><div><p className="text-[11px] text-[#9089a0]">Chapter 1</p><h2 className="mt-1 text-xl font-semibold">A New Beginning</h2></div><span className="rounded-lg border border-[#e7defa] px-3 py-2 text-[11px] text-[#7455ba] dark:border-white/10 dark:text-[#d7c5ff]">Preview</span></div><div className="mt-4 flex flex-wrap gap-2 text-[#716b80] dark:text-white/60">{['B', 'I', 'U', '≡', '☷'].map((v) => <span key={v} className="grid h-9 w-9 place-items-center rounded-lg border border-[#e9e5f1] text-sm font-semibold dark:border-white/10">{v}</span>)}</div><div className="mt-6 rounded-xl bg-[#fcfbff] p-5 text-[15px] leading-8 dark:bg-[#252331]"><p>Every story begins with a single idea. Your writing canvas will appear here when you create a book.</p><p className="mt-5 text-[12px] text-[#928aa2]">Editor preview · No draft has been created.</p></div></Surface>}

        {section === 'design' && <div className="space-y-4"><div className="grid grid-cols-3 gap-2 rounded-xl bg-[#eeebf5] p-1 text-center text-[12px] font-semibold dark:bg-white/10"><span className="rounded-lg bg-white py-3 text-[#6746b3] shadow-sm dark:bg-[#383044] dark:text-[#e1d4ff]">Layout</span><span className="py-3 text-[#91899f]">Typography</span><span className="py-3 text-[#91899f]">Style</span></div><Surface><p className="text-[13px] font-bold">Page size</p><div className="mt-3 grid grid-cols-3 gap-2">{['A5', 'A4', 'B5'].map((size, i) => <div key={size} className={`rounded-xl border p-3 text-center ${i === 0 ? 'border-[#7655bf] bg-[#f6f1ff] text-[#6c49b9] dark:bg-[#3a3050]' : 'border-[#ebe7f1] dark:border-white/10'}`}><p className="font-bold">{size}</p><p className="mt-1 text-[9px] opacity-70">{['148 × 210', '210 × 297', '176 × 250'][i]} mm</p></div>)}</div></Surface><Surface>{[['Margins', 'Normal (2 cm)'], ['Font', 'Khmer OS'], ['Font Size', '12 pt'], ['Line Spacing', '1.5'], ['Page Numbers', 'On']].map(([name, value]) => <div key={name} className="flex items-center justify-between border-b border-[#f0eef4] py-3 text-[13px] last:border-0 dark:border-white/10"><span className="text-[#777084] dark:text-white/60">{name}</span><span className="font-semibold">{value}</span></div>)}</Surface></div>}

        {section === 'templates' && <div className="grid grid-cols-2 gap-3">{templates.map((item) => <button key={item.name} type="button" onClick={() => setTemplate(item.name)} className={`rounded-[20px] border bg-white p-3 text-left dark:bg-[#20202c] ${template === item.name ? 'border-[#7752c1] ring-2 ring-[#7752c1]/20' : 'border-[#e9e6f0] dark:border-white/10'}`}><div className={`flex aspect-[3/4] flex-col items-center justify-center rounded-xl bg-gradient-to-b ${item.colors} ${item.accent}`}><span className="text-[30px]">{item.mark}</span><p className="mt-3 max-w-[125px] text-center font-serif text-[19px] leading-6">Your Book Title</p><p className="mt-4 text-[8px] uppercase tracking-widest">A Shadow Docs book</p></div><p className="mt-3 text-[13px] font-semibold">{item.name}</p></button>)}</div>}

        {section === 'pdf' && <div className="space-y-4"><Surface><div className="mx-auto flex aspect-[3/4] max-w-[240px] flex-col items-center justify-center border border-[#ece8f2] bg-[#fffefa] px-6 text-center shadow-lg dark:bg-[#eeeae5] dark:text-[#292435]"><p className="font-serif text-2xl font-bold">Your Book Title</p><p className="mt-3 text-[10px] uppercase tracking-[.25em] text-[#a69aaf]">Book preview</p><BookOpen size={34} className="mt-12 text-[#9875cb]"/></div><p className="mt-4 text-center text-[12px] text-[#918a9c]">PDF preview will appear after a book is created.</p></Surface><button type="button" disabled className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#7050bd] text-[13px] font-semibold text-white opacity-55"><FileText size={18}/> Export PDF</button></div>}
      </main>

      <nav aria-label="Shadow Docs sections" className="fixed inset-x-0 bottom-0 z-30 border-t border-[#e8e5f0] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur dark:border-white/10 dark:bg-[#1c1b27]/95"><div className="mx-auto grid h-[70px] max-w-5xl grid-cols-5">{sections.map((item) => { const Icon = item.icon; return <button key={item.id} type="button" onClick={() => setSection(item.id)} className={`flex flex-col items-center justify-center gap-1 text-[10px] font-semibold ${section === item.id ? 'text-[#7450bd] dark:text-[#c6aaff]' : 'text-[#9892a4] dark:text-white/45'}`}><Icon size={20} strokeWidth={section === item.id ? 2.4 : 1.8}/><span>{item.label}</span></button> })}</div></nav>
    </div>
  )
}
