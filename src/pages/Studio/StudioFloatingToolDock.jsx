import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import StudioToolPalette from './StudioToolPalette'

const STORAGE_KEY = 'shadow-studio-floating-tools-v1'
const DESKTOP_QUERY = '(min-width:1101px) and (min-height:651px)'

function readLayout() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null')
    if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
      return { floating: Boolean(saved.floating), x: saved.x, y: saved.y }
    }
  } catch {}
  return { floating: false, x: 110, y: 100 }
}

export default function StudioFloatingToolDock({ tool, onToolChange, labels }) {
  const [layout, setLayout] = useState(readLayout)
  const [portalRoot, setPortalRoot] = useState(null)
  const [dockHint, setDockHint] = useState(false)
  const dragRef = useRef(null)
  const layoutRef = useRef(layout)
  layoutRef.current = layout

  function persist(next) {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
  }

  useEffect(() => {
    setPortalRoot(document.querySelector('.shadow-studio'))
    const media = window.matchMedia(DESKTOP_QUERY)
    const sync = () => {
      if (!media.matches) {
        dragRef.current = null
        setDockHint(false)
        setLayout((current) => {
          const next = { ...current, floating: false }
          persist(next)
          return next
        })
      }
    }
    sync()
    media.addEventListener?.('change', sync)
    return () => media.removeEventListener?.('change', sync)
  }, [])

  useEffect(() => {
    function move(event) {
      const drag = dragRef.current
      if (!drag || event.pointerId !== drag.pointerId) return
      const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY)
      if (!drag.moved && distance < 5) return
      drag.moved = true
      const next = {
        floating: true,
        x: Math.max(0, Math.min(window.innerWidth - 78, event.clientX - drag.offsetX)),
        y: Math.max(54, Math.min(window.innerHeight - 30, event.clientY - drag.offsetY)),
      }
      layoutRef.current = next
      setLayout(next)
      setDockHint(event.clientX <= 90 && event.clientY >= 54)
    }

    function finish(event) {
      const drag = dragRef.current
      if (!drag || event.pointerId !== drag.pointerId) return
      dragRef.current = null
      setDockHint(false)
      if (!drag.moved) return
      const next = event.clientX <= 90 && event.clientY >= 54
        ? { ...layoutRef.current, floating: false }
        : layoutRef.current
      layoutRef.current = next
      setLayout(next)
      persist(next)
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', finish)
    window.addEventListener('pointercancel', finish)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', finish)
      window.removeEventListener('pointercancel', finish)
    }
  }, [])

  function start(event) {
    if ((event.pointerType === 'mouse' && event.button !== 0) || !window.matchMedia(DESKTOP_QUERY).matches) return
    const rect = event.currentTarget.parentElement.getBoundingClientRect()
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      moved: false,
    }
    event.preventDefault()
    event.stopPropagation()
  }

  function dock() {
    const next = { ...layoutRef.current, floating: false }
    dragRef.current = null
    layoutRef.current = next
    setLayout(next)
    setDockHint(false)
    persist(next)
  }

  const isFloating = layout.floating && Boolean(portalRoot)
  const panel = (
    <div
      className={`ss-tool-mount${isFloating ? ' ss-tool-mount--floating' : ''}${dockHint && isFloating ? ' ss-tool-mount--near-dock' : ''}`}
      style={isFloating ? {
        left: Math.max(0, Math.min(window.innerWidth - 78, layout.x)),
        top: Math.max(54, Math.min(window.innerHeight - 30, layout.y)),
      } : undefined}
    >
      <button
        type="button"
        className="ss-tool-drag-handle"
        aria-label={isFloating ? 'Drag tools; double-click to dock on the left' : 'Drag tools to detach'}
        title={isFloating ? 'Drag tools; double-click to dock on the left' : 'Drag tools to detach'}
        onPointerDown={start}
        onDoubleClick={isFloating ? dock : undefined}
        onKeyDown={(event) => { if (isFloating && event.key === 'Escape') dock() }}
      >
        <span aria-hidden="true">⠿</span>
      </button>
      <StudioToolPalette tool={tool} onToolChange={onToolChange} labels={labels} />
    </div>
  )

  return (
    <>
      <style>{`
        .shadow-studio .ss-tool-mount{position:relative;display:flex;flex-direction:column;width:78px;min-width:0;height:100%;min-height:0;overflow:hidden;background:#27303a;border-right:1px solid #445260;box-sizing:border-box}
        .shadow-studio .ss-tool-drag-handle{display:grid;place-items:center;flex:0 0 22px;width:100%;height:22px;padding:0;border:0;border-bottom:1px solid #445260;background:#303b47;color:#b5c8d9;font:inherit;font-size:16px;line-height:1;cursor:grab;touch-action:none;user-select:none}
        .shadow-studio .ss-tool-drag-handle:active{cursor:grabbing}
        .shadow-studio .ss-tool-drag-handle:focus-visible{outline:2px solid #8bc4ff;outline-offset:-2px}
        .shadow-studio:has(.ss-layout) .ss-tool-mount>.ss-tool-palette{display:block;flex:1;min-width:0;min-height:0;width:100%;height:auto;max-height:none;overflow-x:hidden;overflow-y:auto;padding:8px 4px 58px;box-sizing:border-box;border-right:0;background:#27303a;scrollbar-width:thin}
        .shadow-studio:has(.ss-layout) .ss-tool-mount>.ss-tool-palette .ss-palette-group{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px;justify-items:center;padding:0 0 9px;border-left:0}
        .shadow-studio:has(.ss-layout) .ss-tool-mount>.ss-tool-palette .ss-palette-group+.ss-palette-group{padding-top:9px;border-top:1px solid #495563}
        .shadow-studio .ss-tool-mount--floating{position:fixed;z-index:9000;width:78px;height:min(680px,calc(100dvh - 90px));min-height:160px;border:1px solid #64778b;border-radius:7px;box-shadow:0 12px 32px #0008}
        .shadow-studio .ss-tool-mount--near-dock{border-color:#8fc4ff;box-shadow:0 0 0 2px #8fc4ff77,0 12px 32px #0008}
        .shadow-studio .ss-tools-floating-placeholder{display:none}
        .shadow-studio:has(.ss-layout) .ss-left-workspace:has(>.ss-tools-floating-placeholder){grid-template-columns:minmax(0,1fr)}
        @media(max-width:1100px), (max-height:650px){
          .shadow-studio .ss-tool-mount:not(.ss-tool-mount--floating){display:contents}
          .shadow-studio .ss-tool-mount:not(.ss-tool-mount--floating)>.ss-tool-drag-handle{display:none}
          .shadow-studio .ss-tool-mount:not(.ss-tool-mount--floating)>.ss-tool-palette{display:flex;width:auto;height:auto;max-height:none;overflow-x:auto;overflow-y:visible;padding:7px}
          .shadow-studio .ss-tool-mount:not(.ss-tool-mount--floating)>.ss-tool-palette .ss-palette-group{display:flex;flex:0 0 auto;padding:0;gap:4px;border-top:0}
        }
      `}</style>
      {isFloating ? <span className="ss-tools-floating-placeholder" aria-hidden="true" /> : panel}
      {isFloating ? createPortal(panel, portalRoot) : null}
    </>
  )
}
