import { useState } from 'react'
import { SHADOW_DOCS_RIBBON_TABS } from './ShadowDocsRibbonCatalog'
import ShadowDocsRibbonFileTab from './ShadowDocsRibbonFileTab'
import ShadowDocsRibbonHomeTab from './ShadowDocsRibbonHomeTab'
import ShadowDocsRibbonInsertTab from './ShadowDocsRibbonInsertTab'
import ShadowDocsRibbonDesignTab from './ShadowDocsRibbonDesignTab'
import ShadowDocsRibbonLayoutTab from './ShadowDocsRibbonLayoutTab'
import ShadowDocsRibbonReferencesTab from './ShadowDocsRibbonReferencesTab'
import ShadowDocsRibbonMailingsTab from './ShadowDocsRibbonMailingsTab'
import ShadowDocsRibbonReviewTab from './ShadowDocsRibbonReviewTab'
import ShadowDocsRibbonViewTab from './ShadowDocsRibbonViewTab'
import ShadowDocsRibbonDrawTab from './ShadowDocsRibbonDrawTab'
import ShadowDocsRibbonToolsTab from './ShadowDocsRibbonToolsTab'
import './ShadowDocsRibbon.css'

const RENDERERS = Object.freeze({
  file: ShadowDocsRibbonFileTab,
  home: ShadowDocsRibbonHomeTab,
  insert: ShadowDocsRibbonInsertTab,
  design: ShadowDocsRibbonDesignTab,
  layout: ShadowDocsRibbonLayoutTab,
  references: ShadowDocsRibbonReferencesTab,
  mailings: ShadowDocsRibbonMailingsTab,
  review: ShadowDocsRibbonReviewTab,
  view: ShadowDocsRibbonViewTab,
  draw: ShadowDocsRibbonDrawTab,
  tools: ShadowDocsRibbonToolsTab,
})

export default function ShadowDocsRibbon({
  activeTab,
  onChangeTab,
  commandState = {},
  onCommand,
  disabled = false,
}) {
  const [localTab, setLocalTab] = useState('home')
  const selected = RENDERERS[activeTab] ? activeTab : localTab
  const Active = RENDERERS[selected] || ShadowDocsRibbonHomeTab

  function selectTab(id) {
    if (disabled || !RENDERERS[id]) return
    if (!activeTab) setLocalTab(id)
    onChangeTab?.(id)
  }

  return <section className="sd-ribbon" aria-label="Document ribbon">
    <div className="sd-ribbon-tabs" role="tablist" aria-label="Ribbon tabs">
      {SHADOW_DOCS_RIBBON_TABS.map(tab => <button
        key={tab.id}
        type="button"
        role="tab"
        aria-selected={selected === tab.id}
        className={`sd-ribbon-tab ${selected === tab.id ? 'is-active' : ''}`}
        disabled={disabled}
        onClick={() => selectTab(tab.id)}
      >{tab.label}</button>)}
    </div>
    <div className="sd-ribbon-content">
      <Active state={commandState} onCommand={onCommand} disabled={disabled} />
    </div>
  </section>
}
