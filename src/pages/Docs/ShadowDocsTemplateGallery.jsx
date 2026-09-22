import { useState } from 'react'
import { Check, LayoutTemplate } from 'lucide-react'
import {
  BOOK_TEMPLATE_CATEGORIES,
  BOOK_TEMPLATES,
  getCoverPreset,
  getPageLayoutPreset,
} from './ShadowDocsTemplateCatalog'

export default function ShadowDocsTemplateGallery({ book, onSelectTemplate }) {
  const [category, setCategory] = useState('All')
  const [showDetails, setShowDetails] = useState(false)
  const templates = BOOK_TEMPLATES.filter(template => category === 'All' || template.category === category)
  const selected = book?.template || 'classic'
  const canSelect = Boolean(book) && typeof onSelectTemplate === 'function'

  return (
    <section aria-label="Book templates" className="sd-stack">
      <div className="sd-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="sd-eyebrow">BOOK TEMPLATES</span>
            <h2 className="mt-2 flex items-center gap-2"><LayoutTemplate size={19} /> Choose a book style</h2>
            <p className="mt-2 text-[12px] leading-6 text-[#77758b] dark:text-white/60">
              Explore cover styles and suggested page layouts. Your writing stays in this book.
            </p>
          </div>
          <label className="flex items-center gap-2 text-[12px] text-[#77758b] dark:text-white/70">
            <input type="checkbox" checked={showDetails} onChange={event => setShowDetails(event.target.checked)} />
            Show layout details
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Template categories">
          {BOOK_TEMPLATE_CATEGORIES.map(item => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
              className={`rounded-full border px-3 py-2 text-[11px] font-semibold transition-colors ${category === item ? 'border-[#7653bd] bg-[#7653bd] text-white' : 'border-[#e8e3f1] bg-white text-[#776b87] hover:border-[#baa3e7] dark:border-white/15 dark:bg-white/5 dark:text-white/70'}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {!book && <p role="status" className="rounded-xl bg-[#f2ecff] px-4 py-3 text-[12px] text-[#6340a5] dark:bg-white/10 dark:text-white">Create or select a book before applying a template.</p>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {templates.map(template => {
          const cover = getCoverPreset(template.cover)
          const layout = getPageLayoutPreset(template.layout)
          const isSelected = selected === template.id
          return (
            <button
              key={template.id}
              type="button"
              disabled={!canSelect}
              aria-pressed={isSelected}
              aria-label={`${template.name} template${isSelected ? ', selected' : ''}`}
              onClick={() => onSelectTemplate(template.id)}
              className={`min-w-0 rounded-[18px] border p-2 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${isSelected ? 'border-[#7653bd] bg-[#f7f2ff] ring-2 ring-[#d9cbfb] dark:bg-[#342947]' : 'border-[#e9e5f1] bg-white hover:border-[#baa3e7] dark:border-white/10 dark:bg-[#20202c]'}`}
            >
              <div
                className="relative flex aspect-[3/4] flex-col items-center justify-between overflow-hidden rounded-xl p-[10%] text-center"
                style={{ background: cover.background, color: cover.foreground }}
              >
                <span aria-hidden="true" className="text-[26px] sm:text-[33px]">{template.symbol}</span>
                <div className="w-full min-w-0">
                  <span className="block text-[7px] font-semibold tracking-[0.17em] opacity-80">SHADOW DOCS</span>
                  <strong className="mt-2 block break-words text-[12px] leading-snug sm:text-[16px]" style={{ fontFamily: 'Georgia, "Noto Serif Khmer", serif' }}>{book?.title || template.name}</strong>
                  <span className="mx-auto my-2 block h-px w-12" style={{ background: cover.accent }} />
                  <small className="block break-words text-[9px] opacity-90">{book?.author || 'YOUR NAME'}</small>
                </div>
                <span aria-hidden="true" className="text-[17px] opacity-80">{template.symbol}</span>
                {isSelected && <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-white text-[#6946b4] shadow"><Check size={15} /></span>}
              </div>
              <div className="min-w-0 px-1 pb-1 pt-3">
                <div className="flex items-start justify-between gap-1">
                  <strong className="min-w-0 truncate text-[12px] text-[#242139] dark:text-white">{template.name}</strong>
                  {isSelected && <span className="shrink-0 text-[9px] font-bold text-[#7653bd] dark:text-[#d4bfff]">SELECTED</span>}
                </div>
                <p className="mt-1 text-[10px] leading-4 text-[#858095] dark:text-white/55">{template.subtitle}</p>
                {showDetails && <p className="mt-2 text-[10px] leading-4 text-[#7653bd] dark:text-[#d4bfff]">{layout.name} · {layout.size} · {layout.fontSize} pt</p>}
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
