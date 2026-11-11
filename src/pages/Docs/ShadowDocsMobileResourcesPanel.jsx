import { useMemo, useState } from 'react'
import { ArrowLeft, BookOpen, Check, ChevronRight, FileText, Search, X } from 'lucide-react'
import { SHADOW_DOCS_RESOURCE_CATEGORIES } from './ShadowDocsInsertResourcesCatalog'
import { buildShadowDocsInsertResource, getShadowDocsInsertResource, listShadowDocsInsertResources } from './ShadowDocsInsertResourcesEngine'

export default function ShadowDocsMobileResourcesPanel({ disabled = false, onBack, onInsert, onOpenTemplates }) {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const resources = useMemo(() => listShadowDocsInsertResources({ category, search }), [category, search])
  const selected = useMemo(() => getShadowDocsInsertResource(selectedId), [selectedId])
  const payload = useMemo(() => selected ? buildShadowDocsInsertResource(selected.id) : null, [selected])
  const canInsert = !disabled && typeof onInsert === 'function'

  function insertSelected() {
    if (!canInsert || !payload) return
    onInsert({ id: payload.id, html: payload.html })
  }

  return <div className="sd-resource-panel">
    <style>{`
      .sd-resource-panel{color:#ededed;font-family:Inter,"Noto Sans Khmer",system-ui,sans-serif;padding-bottom:16px}
      .sd-resource-head{display:flex;align-items:center;gap:9px;min-height:42px;font-size:15px;font-weight:650}
      .sd-resource-back{width:36px;height:36px;display:grid;place-items:center;border:0;border-radius:9px;background:transparent;color:inherit}
      .sd-resource-search{display:flex;align-items:center;gap:9px;background:#303030;border:1px solid #4a4a4a;border-radius:11px;padding:0 12px;margin:12px 0}
      .sd-resource-search input{min-width:0;flex:1;height:45px;border:0;outline:0;background:transparent;color:#fff;font:inherit;font-size:14px}
      .sd-resource-categories{display:flex;gap:7px;overflow-x:auto;padding:4px 0 12px;scrollbar-width:none}
      .sd-resource-categories button{white-space:nowrap;border:1px solid #505050;border-radius:20px;padding:9px 13px;color:#e2e2e2;background:#343434;font-size:12px}
      .sd-resource-categories button.is-active{background:#3c506b;border-color:#6aa7ec;color:#fff}
      .sd-resource-count{display:block;margin:5px 3px 11px;color:#aeb0b5;font-size:12px}
      .sd-resource-list{display:grid;gap:9px}
      .sd-resource-card{width:100%;min-height:82px;display:flex;align-items:center;text-align:left;gap:12px;padding:12px;border:1px solid #444;background:#303030;border-radius:13px;color:#f1f1f1}
      .sd-resource-symbol{flex:none;width:42px;height:50px;border-radius:9px;background:#444967;display:grid;place-items:center;color:#aecdff}
      .sd-resource-info{display:grid;gap:4px;min-width:0;flex:1}
      .sd-resource-info strong{font-size:14px;font-weight:650}
      .sd-resource-info small{font-size:12px;color:#bcbec3;line-height:1.45}
      .sd-resource-info em{font-size:11px;color:#9fc4ff;font-style:normal}
      .sd-resource-preview{background:#303030;border:1px solid #464646;border-radius:13px;padding:16px;margin-top:12px}
      .sd-resource-document{background:#fff;color:#2d2d35;border-radius:9px;padding:14px;max-height:315px;overflow-y:auto;overflow-wrap:anywhere;font-size:12px;line-height:1.55}
      .sd-resource-document h2{font-size:17px;font-weight:700;margin:0 0 12px}
      .sd-resource-document h3{font-size:13px;font-weight:650;margin:13px 0 6px}
      .sd-resource-document p{margin:7px 0}
      .sd-resource-document ul,.sd-resource-document ol{padding-left:18px;margin:7px 0}
      .sd-resource-document table{border-collapse:collapse;width:100%;margin:9px 0;table-layout:fixed}
      .sd-resource-document td,.sd-resource-document th{border:1px solid #aaa;padding:5px;text-align:left;word-break:break-word}
      .sd-resource-note{font-size:12px;line-height:1.55;color:#bdbdbd;margin:11px 2px}
      .sd-resource-insert{width:100%;min-height:47px;border:0;border-radius:11px;background:#438fe6;color:#fff;font-size:15px;font-weight:700;display:flex;gap:8px;align-items:center;justify-content:center;margin-top:16px}
      .sd-resource-templates{width:100%;display:flex;gap:11px;align-items:center;justify-content:space-between;padding:13px;margin-top:15px;background:#303030;border:1px solid #484848;border-radius:12px;color:#eaeaea;text-align:left;font-size:13px}
      .sd-resource-panel button:disabled{opacity:.35}
      .sd-resource-panel button:focus-visible,.sd-resource-search:focus-within{outline:2px solid #7db7ff;outline-offset:2px}
    `}</style>

    <div className="sd-resource-head">
      <button type="button" className="sd-resource-back" aria-label={selected ? 'Back to resources' : 'Back to Insert'} onPointerDown={event => event.preventDefault()} onClick={() => selected ? setSelectedId('') : onBack?.()}><ArrowLeft size={21} /></button>
      <span>{selected ? selected.title : 'Resources'}</span>
    </div>

    {selected ? <>
      <p className="sd-resource-note">{selected.description}</p>
      <div className="sd-resource-preview">
        <div className="sd-resource-document" aria-label={`${selected.title} preview`} dangerouslySetInnerHTML={{ __html: payload?.html || '' }} />
      </div>
      <p className="sd-resource-note">This editable block will be inserted at your document cursor. It does not change the book template or layout.</p>
      <button type="button" className="sd-resource-insert" disabled={!canInsert || !payload} onPointerDown={event => event.preventDefault()} onClick={insertSelected}><Check size={19} /> Insert Resource</button>
    </> : <>
      <label className="sd-resource-search">
        <Search size={18} color="#bcbec3" />
        <input aria-label="Search resources" type="search" value={search} maxLength={100} placeholder="Search resources..." onChange={event => setSearch(event.target.value)} />
        {search ? <button type="button" className="sd-resource-back" aria-label="Clear resource search" onClick={() => setSearch('')}><X size={17} /></button> : null}
      </label>
      <div className="sd-resource-categories" role="group" aria-label="Resource categories">
        {SHADOW_DOCS_RESOURCE_CATEGORIES.map(item => <button key={item} type="button" className={category === item ? 'is-active' : ''} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
      </div>
      <span className="sd-resource-count">{resources.length} reusable content {resources.length === 1 ? 'block' : 'blocks'}</span>
      <div className="sd-resource-list">
        {resources.map(item => <button key={item.id} type="button" className="sd-resource-card" onPointerDown={event => event.preventDefault()} onClick={() => setSelectedId(item.id)}>
          <span className="sd-resource-symbol"><FileText size={23} /></span>
          <span className="sd-resource-info"><strong>{item.title}</strong><small>{item.description}</small><em>{item.category}</em></span>
          <ChevronRight size={18} color="#bcbec3" />
        </button>)}
        {!resources.length && <p className="sd-resource-note">No matching resources. Try another word or category.</p>}
      </div>
      {typeof onOpenTemplates === 'function' && <button type="button" className="sd-resource-templates" onPointerDown={event => event.preventDefault()} onClick={onOpenTemplates}><BookOpen size={20} /><span style={{ flex: 1 }}>Browse existing Book Templates</span><ChevronRight size={18} /></button>}
    </>}
  </div>
}
