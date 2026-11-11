import { useState } from 'react'
import { ArrowLeft, Check, Columns3, FilePlus2, Files, RectangleHorizontal, RectangleVertical } from 'lucide-react'
import { SHADOW_DOCS_SECTION_BREAK_CHOICES, normalizeShadowDocsSectionBreak } from './ShadowDocsSectionLayoutModel.js'

const ICONS = Object.freeze({
  page: FilePlus2,
  column: Columns3,
  section: Files,
  'section-portrait': RectangleVertical,
  'section-landscape': RectangleHorizontal,
  'blank-portrait': RectangleVertical,
  'blank-landscape': RectangleHorizontal,
})

export default function ShadowDocsMobileSectionBreakPanel({ disabled = false, onBack, onInsert }) {
  const [selected, setSelected] = useState('page')
  const choice = SHADOW_DOCS_SECTION_BREAK_CHOICES.find(item => item.id === selected) || SHADOW_DOCS_SECTION_BREAK_CHOICES[0]
  const options = normalizeShadowDocsSectionBreak(choice)
  const canInsert = !disabled && Boolean(options) && typeof onInsert === 'function'

  return <div className="sd-section-break-panel">
    <style>{`
      .sd-section-break-panel{color:#eee;padding-bottom:16px;font-family:Inter,"Noto Sans Khmer",system-ui,sans-serif}
      .sd-section-break-head{display:flex;align-items:center;gap:9px;min-height:42px;font-size:15px;font-weight:650}
      .sd-section-break-back{display:grid;place-items:center;width:36px;height:36px;border:0;border-radius:9px;background:transparent;color:inherit}
      .sd-section-break-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:15px}
      .sd-section-break-choice{display:flex;flex-direction:column;text-align:left;align-items:flex-start;gap:9px;min-height:118px;padding:13px;border:1px solid #484848;border-radius:12px;background:#303030;color:#eee}
      .sd-section-break-choice svg{color:#bababa}
      .sd-section-break-choice strong{font-size:13px;font-weight:650}
      .sd-section-break-choice small{font-size:11px;line-height:1.45;color:#aeb0b5}
      .sd-section-break-choice.is-selected{background:#3b4c63;border-color:#6aa7ec}
      .sd-section-break-choice.is-selected svg{color:#aed3ff}
      .sd-section-break-info{margin:15px 3px 0;font-size:12px;color:#aeb0b5;line-height:1.6}
      .sd-section-break-submit{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;min-height:47px;margin-top:18px;border:0;border-radius:11px;background:#438fe6;color:white;font-size:15px;font-weight:700}
      .sd-section-break-panel button:disabled{opacity:.35}
      .sd-section-break-panel button:focus-visible{outline:2px solid #7db7ff;outline-offset:2px}
      @media(max-width:340px){.sd-section-break-list{grid-template-columns:1fr}}
    `}</style>
    <div className="sd-section-break-head">
      <button type="button" className="sd-section-break-back" aria-label="Back to Insert" onPointerDown={event => event.preventDefault()} onClick={() => onBack?.()}><ArrowLeft size={22} /></button>
      Pages &amp; Breaks
    </div>
    <div className="sd-section-break-list" role="radiogroup" aria-label="Page and section break type">
      {SHADOW_DOCS_SECTION_BREAK_CHOICES.map(item => {
        const Icon = ICONS[item.id] || FilePlus2
        return <button key={item.id} type="button" role="radio" aria-checked={selected === item.id} className={`sd-section-break-choice ${selected === item.id ? 'is-selected' : ''}`} disabled={disabled} onPointerDown={event => event.preventDefault()} onClick={() => setSelected(item.id)}>
          <Icon size={23} /><strong>{item.title}</strong><small>{item.description}</small>
        </button>
      })}
    </div>
    <p className="sd-section-break-info">{choice.description} Page-specific orientation becomes visible in PDF/Print only after the section export integration is enabled.</p>
    <button type="button" className="sd-section-break-submit" disabled={!canInsert} onPointerDown={event => event.preventDefault()} onClick={() => onInsert(options)}><Check size={19} /> Insert {choice.title}</button>
  </div>
}
