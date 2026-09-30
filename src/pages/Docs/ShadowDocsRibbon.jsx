import { useEffect, useRef, useState } from 'react'
import { AlignLeft, CirclePlus, ImagePlus, Keyboard, Maximize2, Settings2, Type } from 'lucide-react'
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

const MOBILE_ITEMS = [
  { id: 'fit', label: 'Fit to\nScreen', icon: Maximize2 },
  { id: 'format', label: 'Format', icon: Type },
  { id: 'paragraph', label: 'Paragraph', icon: AlignLeft },
  { id: 'image', label: 'Add Image', icon: ImagePlus },
  { id: 'insert', label: 'Insert', icon: CirclePlus },
]

export default function ShadowDocsRibbon({
  activeTab,
  onChangeTab,
  commandState = {},
  onCommand,
  disabled = false,
}) {
  const [localTab, setLocalTab] = useState('home')
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const viewportBaselineRef = useRef(0)
  const selected = RENDERERS[activeTab] ? activeTab : localTab
  const Active = RENDERERS[selected] || ShadowDocsRibbonHomeTab

  useEffect(() => {
    const viewport = globalThis.visualViewport
    if (!viewport) return undefined

    function updateKeyboardState() {
      const height = viewport.height || globalThis.innerHeight || 0
      viewportBaselineRef.current = Math.max(viewportBaselineRef.current, height)
      setKeyboardOpen(viewportBaselineRef.current - height > 120)
    }

    viewportBaselineRef.current = Math.max(globalThis.innerHeight || 0, viewport.height || 0)
    updateKeyboardState()
    viewport.addEventListener('resize', updateKeyboardState)
    viewport.addEventListener('scroll', updateKeyboardState)
    return () => {
      viewport.removeEventListener('resize', updateKeyboardState)
      viewport.removeEventListener('scroll', updateKeyboardState)
    }
  }, [])

  function selectTab(id) {
    if (disabled || !RENDERERS[id]) return
    if (!activeTab) setLocalTab(id)
    onChangeTab?.(id)
  }

  function mobileAction(id) {
    if (disabled) return
    if (id === 'fit') {
      onCommand?.('mobileFit', true)
      return
    }
    if (id === 'format') {
      selectTab('home')
      return
    }
    if (id === 'paragraph') {
      selectTab('layout')
      return
    }
    if (id === 'image') {
      onCommand?.('pictures', true)
      return
    }
    if (id === 'insert') selectTab('insert')
  }

  function toggleKeyboard() {
    const editor = document.querySelector('.sd-writing-area[contenteditable="true"]')
    if (!editor) return
    if (keyboardOpen) editor.blur()
    else {
      editor.focus()
      const selection = globalThis.getSelection?.()
      if (selection && !selection.rangeCount) {
        const range = document.createRange()
        range.selectNodeContents(editor)
        range.collapse(false)
        selection.addRange(range)
      }
    }
  }

  return <>
    <style>{`
      .sd-mobile-editor-toolbar{display:none}
      @media(max-width:700px){
        body:has(.sd-writing-layout) .sd-bottom-nav{display:none!important}
        .sd-app:has(.sd-writing-layout){padding-bottom:74px!important}
        .sd-ribbon-desktop{display:none!important}
        .sd-editor-tools{display:none!important}
        .sd-mobile-editor-toolbar{
          position:fixed;
          z-index:80;
          left:0;
          right:0;
          bottom:0;
          display:flex;
          align-items:stretch;
          min-height:64px;
          padding-bottom:env(safe-area-inset-bottom);
          background:#292929;
          border-top:0;
          color:#f4f4f4;
          box-shadow:none;
        }
        .sd-mobile-editor-scroll{
          min-width:0;
          flex:1;
          display:flex;
          align-items:stretch;
          overflow-x:auto;
          overscroll-behavior-x:contain;
          scrollbar-width:none;
        }
        .sd-mobile-editor-scroll::-webkit-scrollbar{display:none}
        .sd-mobile-editor-fixed{
          flex:none;
          display:flex;
          align-items:stretch;
          background:#292929;
          border-left:1px solid #3a3a3a;
          box-shadow:none;
        }
        .sd-mobile-tool{
          flex:none;
          width:74px;
          min-height:64px;
          border:0;
          background:transparent;
          color:#ededed;
          display:flex;
          align-items:center;
          justify-content:flex-start;
          flex-direction:column;
          gap:3px;
          padding:7px 4px 5px;
          font-size:9px;
          font-weight:400;
          line-height:1.05;
          white-space:normal;
        }
        .sd-mobile-tool:active{background:#383838}
        .sd-mobile-tool:disabled{opacity:.4}
        .sd-mobile-tool svg{width:21px;height:21px;stroke-width:1.75}
        .sd-mobile-editor-fixed .sd-mobile-tool{width:62px}
        .sd-mobile-tool-label{
          display:block;
          max-width:66px;
          text-align:center;
          font-size:9px;
          font-weight:400;
          line-height:1.05;
          white-space:pre-line;
          color:#e2e2e2;
        }
        .sd-mobile-tool.is-active{color:#35d0a6}
        .sd-mobile-tool.is-active .sd-mobile-tool-label{color:#35d0a6}
        .sd-mobile-editor-toolbar.is-keyboard-open{
          min-height:52px;
        }
        .sd-mobile-editor-toolbar.is-keyboard-open .sd-mobile-tool{
          width:58px;
          min-height:52px;
          padding:0 5px;
          justify-content:center;
          gap:0;
        }
        .sd-mobile-editor-toolbar.is-keyboard-open .sd-mobile-editor-fixed .sd-mobile-tool{width:54px}
        .sd-mobile-editor-toolbar.is-keyboard-open .sd-mobile-tool-label{display:none}
        .sd-mobile-editor-toolbar.is-keyboard-open .sd-mobile-tool svg{width:23px;height:23px}
      }
    `}</style>

    <section className="sd-ribbon sd-ribbon-desktop" aria-label="Document ribbon">
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

    <nav className={`sd-mobile-editor-toolbar ${keyboardOpen ? 'is-keyboard-open' : ''}`} aria-label="Mobile editor tools">
      <div className="sd-mobile-editor-scroll">
        {MOBILE_ITEMS.map(item => {
          const Icon = item.icon
          return <button
            key={item.id}
            type="button"
            className={`sd-mobile-tool ${item.id === 'fit' && commandState.mobileFit ? 'is-active' : ''}`}
            disabled={disabled}
            aria-label={item.label}
            title={item.label}
            onPointerDown={event => event.preventDefault()}
            onClick={() => mobileAction(item.id)}
          >
            <Icon />
            <span className="sd-mobile-tool-label">{item.label}</span>
          </button>
        })}
      </div>

      <div className="sd-mobile-editor-fixed">
        <button
          type="button"
          className="sd-mobile-tool"
          disabled={disabled}
          aria-label="Tools"
          title="Tools"
          onPointerDown={event => event.preventDefault()}
          onClick={() => selectTab('tools')}
        >
          <Settings2 />
          <span className="sd-mobile-tool-label">Tools</span>
        </button>
        <button
          type="button"
          className="sd-mobile-tool"
          disabled={disabled}
          aria-label="Keyboard"
          title="Keyboard"
          onClick={toggleKeyboard}
        >
          <Keyboard />
          <span className="sd-mobile-tool-label">Keyboard</span>
        </button>
      </div>
    </nav>
  </>
}
