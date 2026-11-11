import { useEffect, useRef } from 'react'
import './ShadowDocsDraw.css'

const DEFAULT_TABS = [
  { id: 'home', label: 'Home' },
  { id: 'insert', label: 'Insert' },
  { id: 'view', label: 'View' },
  { id: 'review', label: 'Review' },
  { id: 'draw', label: 'Draw' },
]

export default function ShadowDocsScrollableTabs({
  tabs = DEFAULT_TABS,
  activeTab = 'home',
  onChange,
  disabled = false,
  labels = {},
}) {
  const containerRef = useRef(null)
  const buttonsRef = useRef(new Map())

  useEffect(() => {
    const container = containerRef.current
    const button = buttonsRef.current.get(activeTab)
    if (!container || !button) return
    const left = button.offsetLeft - container.offsetLeft - (container.clientWidth - button.offsetWidth) / 2
    container.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
  }, [activeTab])

  return <div ref={containerRef} className="sd-draw-tab-scroll" role="tablist" aria-label="Document ribbon tabs">
    {tabs.map(tab => <button
      key={tab.id}
      ref={element => { if (element) buttonsRef.current.set(tab.id, element); else buttonsRef.current.delete(tab.id) }}
      type="button"
      role="tab"
      className={`sd-draw-tab ${activeTab === tab.id ? 'is-active' : ''}`}
      aria-selected={activeTab === tab.id}
      disabled={disabled || tab.disabled}
      onClick={() => onChange?.(tab.id)}
    >{labels[tab.id] || tab.label}</button>)}
  </div>
}
