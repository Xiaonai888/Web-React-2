import { useEffect, useState } from 'react'
import { SHADOW_DOCS_FONT_OPTIONS, loadShadowDocsFont, shadowDocsFontFamily } from './ShadowDocsFontCatalog'
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, BookOpen, Check, FileText, LayoutTemplate, Type } from 'lucide-react'
import { getBookTemplate, getPageLayoutPreset, PAGE_LAYOUT_PRESETS } from './ShadowDocsTemplateCatalog'

const PAGE_SIZES = { A5: [148, 210], A4: [210, 297], B5: [176, 250] }
const font = SHADOW_DOCS_FONT_OPTIONS.includes(settings.font) ? settings.font : 'Noto Serif Khmer'
const ALIGNMENTS = [{ id: 'left', icon: AlignLeft }, { id: 'center', icon: AlignCenter }, { id: 'right', icon: AlignRight }, { id: 'justify', icon: AlignJustify }]
const clamp = (value, min, max, fallback) => Number.isFinite(Number(value)) ? Math.min(max, Math.max(min, Number(value))) : fallback

export default function ShadowDocsBookDesignerPanel({ book, onChangeSettings }) {
  const [previewText, setPreviewText] = useState('ជំពូកទី១ · Chapter One\nនេះជាគំរូអត្ថបទសម្រាប់សៀវភៅរបស់អ្នក។')
  useEffect(() => { loadShadowDocsFont(book?.settings?.font) }, [book?.settings?.font])
  if (!book) return <section className="sd-card" aria-label="Book designer"><h2>Book Designer</h2><p className="mt-2 text-sm text-[#77758b] dark:text-white/65">Select a book in My Books to edit its page layout.</p></section>

  const settings = book.settings || {}
  const currentSize = PAGE_SIZES[settings.size] ? settings.size : 'A5'
  const [width, height] = PAGE_SIZES[currentSize]
  const font = SHADOW_DOCS_FONT_OPTIONS.includes(settings.font) ? settings.font : 'Noto Serif Khmer'
  const margin = clamp(settings.margin, 10, 35, 18)
  const gutter = clamp(settings.gutter, 0, 20, 0)
  const fontSize = clamp(settings.fontSize, 10, 24, 13)
  const lineSpacing = clamp(settings.lineSpacing, 1.2, 2.2, 1.65)
  const firstLineIndent = clamp(settings.firstLineIndent, 0, 15, 0)
  const paragraphSpacing = clamp(settings.paragraphSpacing, 0, 20, 10)
  const alignment = ALIGNMENTS.some(item => item.id === settings.alignment) ? settings.alignment : 'left'
  const chapterStyle = ['classic', 'modern', 'minimal'].includes(settings.chapterStyle) ? settings.chapterStyle : 'classic'
  const canChange = typeof onChangeSettings === 'function'
  const recommendedLayout = getPageLayoutPreset(getBookTemplate(book.template).layout)
  const patch = value => { if (canChange) onChangeSettings(value) }

  return <section aria-label="Book designer" className="sd-stack">
    <div className="sd-card">
      <div className="flex items-center gap-2"><LayoutTemplate size={19} className="text-[#7653bd]"/><h2>Book Designer</h2></div>
      <p className="mt-2 text-xs leading-6 text-[#77758b] dark:text-white/65">Adjust page layout and typography. Changes apply to this book and remain on your device.</p>
      <div className="mt-4 flex flex-wrap items-center gap-2"><span className="text-xs text-[#77758b] dark:text-white/65">Suggested for {getBookTemplate(book.template).name}:</span><strong className="text-xs">{recommendedLayout.name}</strong><button type="button" disabled={!canChange} onClick={() => patch({ size: recommendedLayout.size, margin: recommendedLayout.margin, font: recommendedLayout.font, fontSize: recommendedLayout.fontSize, lineSpacing: recommendedLayout.lineSpacing, alignment: recommendedLayout.alignment, numbers: recommendedLayout.numbers, chapterStyle: recommendedLayout.chapterStyle })} className="sd-button sd-button-ghost">Apply suggested layout</button></div>
    </div>

    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(270px,.85fr)]">
      <div className="sd-stack">
        <div className="sd-card">
          <div className="flex items-center gap-2"><FileText size={17} className="text-[#7653bd]"/><h3>Page setup</h3></div>
          <div className="mt-4 grid grid-cols-3 gap-2" role="group" aria-label="Page size">{Object.entries(PAGE_SIZES).map(([size, [w, h]]) => <button key={size} type="button" disabled={!canChange} aria-pressed={currentSize === size} onClick={() => patch({ size })} className={`min-w-0 rounded-xl border p-3 text-center text-xs ${currentSize === size ? 'border-[#7653bd] bg-[#f5efff] text-[#6946b4] dark:bg-[#3b3052] dark:text-[#e4d6ff]' : 'border-[#e9e5f1] dark:border-white/15'}`}><strong className="block text-sm">{size}</strong><span className="mt-1 block text-[10px]">{w} × {h} mm</span></button>)}</div>
          <label htmlFor="docs-designer-margin" className="mt-5 flex items-center justify-between gap-3 text-xs font-semibold">Margins <span>{margin} mm</span></label><input id="docs-designer-margin" className="mt-2 w-full accent-[#7653bd]" type="range" min="10" max="35" step="1" value={margin} disabled={!canChange} onChange={event => patch({ margin: Number(event.target.value) })}/>
          <label htmlFor="docs-designer-gutter" className="mt-4 flex items-center justify-between gap-3 text-xs font-semibold">Binding gutter <span>{gutter} mm</span></label><input id="docs-designer-gutter" className="mt-2 w-full accent-[#7653bd]" type="range" min="0" max="20" step="1" value={gutter} disabled={!canChange} onChange={event => patch({ gutter: Number(event.target.value) })}/>
          <p className="mt-2 text-[11px] leading-5 text-[#77758b] dark:text-white/60">Extra space at the book spine, alternating on left- and right-hand printed pages. Set 0 mm for documents that will not be bound.</p>
          <label className="mt-4 flex items-center justify-between gap-3 text-xs font-semibold" htmlFor="docs-designer-numbers">Chapter numbers<input id="docs-designer-numbers" type="checkbox" checked={settings.numbers !== false} disabled={!canChange} onChange={event => patch({ numbers: event.target.checked })} className="h-4 w-4 accent-[#7653bd]"/></label>
        </div>

        <div className="sd-card">
          <div className="flex items-center gap-2"><Type size={17} className="text-[#7653bd]"/><h3>Typography</h3></div>
          <label htmlFor="docs-designer-font" className="mt-4 block text-xs font-semibold">Font family</label><select id="docs-designer-font" value={font} disabled={!canChange} onChange={event => patch({ font: event.target.value })} className="sd-field mt-2 w-full">{SHADOW_DOCS_FONT_OPTIONS.map(item => <option key={item} value={item}>{item}</option>)}</select>
          <label htmlFor="docs-designer-fontsize" className="mt-4 flex items-center justify-between gap-3 text-xs font-semibold">Text size <span>{fontSize} pt</span></label><input id="docs-designer-fontsize" type="range" min="10" max="24" step="1" value={fontSize} disabled={!canChange} onChange={event => patch({ fontSize: Number(event.target.value) })} className="mt-2 w-full accent-[#7653bd]"/>
          <label htmlFor="docs-designer-spacing" className="mt-4 flex items-center justify-between gap-3 text-xs font-semibold">Line spacing <span>{lineSpacing.toFixed(2)}</span></label><input id="docs-designer-spacing" type="range" min="1.2" max="2.2" step="0.05" value={lineSpacing} disabled={!canChange} onChange={event => patch({ lineSpacing: Number(event.target.value) })} className="mt-2 w-full accent-[#7653bd]"/>
          <h3 className="mt-5 text-sm font-semibold">Paragraph settings</h3>
          <label htmlFor="docs-designer-first-line-indent" className="mt-4 flex items-center justify-between gap-3 text-xs font-semibold">First-line indent <span>{firstLineIndent} mm</span></label><input id="docs-designer-first-line-indent" type="range" min="0" max="15" step="1" value={firstLineIndent} disabled={!canChange} onChange={event => patch({ firstLineIndent: Number(event.target.value) })} className="mt-2 w-full accent-[#7653bd]"/>
          <label htmlFor="docs-designer-paragraph-spacing" className="mt-4 flex items-center justify-between gap-3 text-xs font-semibold">Space after paragraph <span>{paragraphSpacing} pt</span></label><input id="docs-designer-paragraph-spacing" type="range" min="0" max="20" step="1" value={paragraphSpacing} disabled={!canChange} onChange={event => patch({ paragraphSpacing: Number(event.target.value) })} className="mt-2 w-full accent-[#7653bd]"/>
          <span className="mt-4 block text-xs font-semibold">Text alignment</span><div className="mt-2 grid grid-cols-4 gap-2" role="group" aria-label="Text alignment">{ALIGNMENTS.map(item => {const Icon = item.icon;return <button key={item.id} type="button" title={item.id} aria-label={item.id} aria-pressed={alignment === item.id} disabled={!canChange} onClick={() => patch({ alignment: item.id })} className={`grid h-10 place-items-center rounded-xl border ${alignment === item.id ? 'border-[#7653bd] bg-[#f5efff] text-[#6946b4] dark:bg-[#3b3052] dark:text-[#e4d6ff]' : 'border-[#e9e5f1] dark:border-white/15'}`}><Icon size={17}/></button>})}</div>
          <span className="mt-4 block text-xs font-semibold">Chapter title style</span><div className="mt-2 grid grid-cols-3 gap-2" role="group" aria-label="Chapter title style">{['classic', 'modern', 'minimal'].map(item => <button key={item} type="button" disabled={!canChange} aria-pressed={chapterStyle === item} onClick={() => patch({ chapterStyle: item })} className={`rounded-xl border px-2 py-3 text-xs capitalize ${chapterStyle === item ? 'border-[#7653bd] bg-[#f5efff] text-[#6946b4] dark:bg-[#3b3052] dark:text-[#e4d6ff]' : 'border-[#e9e5f1] dark:border-white/15'}`}>{chapterStyle === item && <Check size={12} className="mr-1 inline"/>}{item}</button>)}</div>
        </div>
      </div>

      <div className="sd-card self-start lg:sticky lg:top-20">
        <div className="flex items-center justify-between gap-2"><h3 className="flex items-center gap-2"><BookOpen size={17}/> Page preview</h3><span className="text-xs text-[#77758b] dark:text-white/60">{currentSize}</span></div>
        <div className="mt-4 overflow-hidden rounded-xl bg-[#e9e5ee] p-3 dark:bg-[#2a2935]"><div className="mx-auto w-full max-w-[380px] overflow-hidden bg-white text-[#242139] shadow-md" style={{ aspectRatio: `${width}/${height}`, fontFamily: shadowDocsFontFamily(font), fontSize: `${fontSize}px`, lineHeight: lineSpacing, textAlign: alignment, paddingTop: `${margin / width * 100}%`, paddingBottom: `${margin / width * 100}%`, paddingLeft: `${(margin + gutter) / width * 100}%`, paddingRight: `${margin / width * 100}%`, overflowWrap: 'anywhere' }}><h4 className="mb-5 text-center font-bold" style={{fontSize:'1.2em'}}>{book.chapters?.[0]?.title || 'Chapter 1'}</h4><div>{previewText.split('\n').map((line, index) => <p key={index} style={{ textIndent: `${firstLineIndent / Math.max(1, width - 2 * margin - gutter) * 100}%`, marginBottom: `${paragraphSpacing / fontSize}em` }}>{line || '\u00a0'}</p>)}</div>{settings.numbers !== false && <span className="mt-7 block text-center text-[10px]">1</span>}</div></div>
        <label htmlFor="docs-designer-preview" className="mt-4 block text-xs font-semibold">Preview text</label><textarea id="docs-designer-preview" rows={3} maxLength={500} value={previewText} onChange={event => setPreviewText(event.target.value)} className="sd-field mt-2 w-full"/>
        <p className="mt-3 text-[11px] leading-5 text-[#77758b] dark:text-white/60">Preview illustrates a right-hand page. Final PDF page breaks depend on your browser.</p>
      </div>
    </div>
  </section>
}
