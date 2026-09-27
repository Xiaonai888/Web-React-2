import { useState } from 'react'
import { SHADOW_DOCS_RIBBON_TABS } from './ShadowDocsRibbonCatalog'
import ShadowDocsRibbonHomeTab from './ShadowDocsRibbonHomeTab'
import ShadowDocsRibbonInsertTab from './ShadowDocsRibbonInsertTab'
import ShadowDocsRibbonLayoutTab from './ShadowDocsRibbonLayoutTab'
import ShadowDocsRibbonReviewTab from './ShadowDocsRibbonReviewTab'

const RENDERERS = { home: ShadowDocsRibbonHomeTab, insert: ShadowDocsRibbonInsertTab, layout: ShadowDocsRibbonLayoutTab, review: ShadowDocsRibbonReviewTab }

export default function ShadowDocsRibbon({ activeTab, onChangeTab, commandState = {}, onCommand, disabled = false }) {
  const [localTab, setLocalTab] = useState('home')
  const selected = activeTab || localTab
  const Active = RENDERERS[selected]
  const tabs = SHADOW_DOCS_RIBBON_TABS.filter(tab => tab.id !== 'file')

  function selectTab(id) {
    if (disabled) return
    if (!activeTab) setLocalTab(id)
    onChangeTab?.(id)
  }

  return <section className="sd-ribbon" aria-label="Document ribbon">
    <div className="sd-ribbon-tabs" role="tablist">{tabs.map(tab => <button key={tab.id} type="button" role="tab" aria-selected={selected === tab.id} className={`sd-ribbon-tab ${selected === tab.id ? 'is-active' : ''}`} disabled={disabled} onClick={() => selectTab(tab.id)}>{tab.label}</button>)}</div>
    <div className="sd-ribbon-content">{Active ? <Active state={commandState} onCommand={onCommand} disabled={disabled} /> : <div className="sd-ribbon-placeholder"><strong>{tabs.find(tab => tab.id === selected)?.label || 'Ribbon'}</strong><span>Commands will be connected later.</span></div>}</div>
  </section>
}
