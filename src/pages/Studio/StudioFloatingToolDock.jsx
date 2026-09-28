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
        <span className="ss-tool-drag-icon" aria-hidden="true">⠿</span>
      </button>
      <StudioToolPalette tool={tool} onToolChange={onToolChange} labels={labels} />
    </div>
  )

  return (
    <>
      <style>{`
        .shadow-studio .ss-tool-mount{
          --ss-tool-bg:#27303a;
          --ss-tool-bg-2:#303b47;
          --ss-tool-line:#445260;
          --ss-tool-line-soft:#3b4651;
          --ss-tool-text:#edf3fa;
          --ss-tool-muted:#aab8c6;
          --ss-tool-blue:#5faeff;
          --ss-tool-blue-soft:#355d84;
          position:relative;
          display:flex;
          flex-direction:column;
          width:78px;
          min-width:0;
          height:100%;
          min-height:0;
          overflow:hidden;
          box-sizing:border-box;
          border-right:1px solid var(--ss-tool-line);
          background:linear-gradient(180deg,#2a333d,#252d35);
          color:var(--ss-tool-text);
          box-shadow:inset -1px 0 0 #0003
        }
        .shadow-studio .ss-tool-drag-handle{
          display:grid;
          place-items:center;
          flex:0 0 28px;
          width:100%;
          height:28px;
          padding:0;
          border:0;
          border-bottom:1px solid var(--ss-tool-line-soft);
          background:linear-gradient(180deg,#34414d,#2b3540);
          color:#b8ccdc;
          font:inherit;
          cursor:grab;
          touch-action:none;
          user-select:none;
          transition:background 120ms ease,color 120ms ease
        }
        .shadow-studio .ss-tool-drag-handle:hover{
          background:#3b4a58;
          color:#fff
        }
        .shadow-studio .ss-tool-drag-handle:active{
          cursor:grabbing;
          background:#223448
        }
        .shadow-studio .ss-tool-drag-handle:focus-visible{
          outline:2px solid var(--ss-tool-blue);
          outline-offset:-2px
        }
        .shadow-studio .ss-tool-drag-icon{
          width:24px;
          height:19px;
          display:grid;
          place-items:center;
          border:1px solid #556779;
          border-radius:5px;
          background:#26313b;
          color:#a9c8e1;
          font-size:14px;
          line-height:1
        }
        .shadow-studio:has(.ss-layout) .ss-tool-mount>.ss-tool-palette{
          display:block;
          flex:1;
          min-width:0;
          min-height:0;
          width:100%;
          height:auto;
          max-height:none;
          overflow-x:hidden;
          overflow-y:auto;
          padding:9px 5px 58px;
          box-sizing:border-box;
          border-right:0;
          background:transparent;
          scrollbar-width:thin;
          scrollbar-color:#596c7f #252d35
        }
        .shadow-studio:has(.ss-layout) .ss-tool-mount>.ss-tool-palette .ss-palette-group{
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:5px;
          justify-items:center;
          padding:0 0 10px;
          border-left:0
        }
        .shadow-studio:has(.ss-layout) .ss-tool-mount>.ss-tool-palette .ss-palette-group+.ss-palette-group{
          padding-top:10px;
          border-top:1px solid var(--ss-tool-line-soft)
        }
        .shadow-studio .ss-tool-mount--floating{
          position:fixed;
          z-index:9000;
          width:78px;
          height:min(680px,calc(100dvh - 90px));
          min-height:160px;
          overflow:hidden;
          border:1px solid #6f8295;
          border-radius:9px;
          background:#27303a;
          box-shadow:0 16px 38px #000b,0 0 0 1px #ffffff08
        }
        .shadow-studio .ss-tool-mount--floating .ss-tool-drag-handle{
          background:linear-gradient(180deg,#3a4a59,#2e3b47)
        }
        .shadow-studio .ss-tool-mount--near-dock{
          border-color:#8fc4ff;
          box-shadow:0 0 0 2px #5faeff99,0 16px 38px #000b
        }
        .shadow-studio .ss-tools-floating-placeholder{
          display:none
        }
        .shadow-studio:has(.ss-layout) .ss-left-workspace:has(>.ss-tools-floating-placeholder){
          grid-template-columns:minmax(0,1fr)
        }
        @media(max-width:1100px), (max-height:650px){
          .shadow-studio .ss-tool-mount:not(.ss-tool-mount--floating){
            display:contents
          }
          .shadow-studio .ss-tool-mount:not(.ss-tool-mount--floating)>.ss-tool-drag-handle{
            display:none
          }
          .shadow-studio .ss-tool-mount:not(.ss-tool-mount--floating)>.ss-tool-palette{
            display:flex;
            width:auto;
            height:auto;
            max-height:none;
            overflow-x:auto;
            overflow-y:visible;
            padding:7px
          }
          .shadow-studio .ss-tool-mount:not(.ss-tool-mount--floating)>.ss-tool-palette .ss-palette-group{
            display:flex;
            flex:0 0 auto;
            padding:0;
            gap:4px;
            border-top:0
          }
        }
        @media(pointer:coarse) and (min-width:1101px) and (min-height:651px){
          .shadow-studio .ss-tool-drag-handle{
            flex-basis:34px;
            height:34px
          }
          .shadow-studio .ss-tool-drag-icon{
            width:28px;
            height:24px;
            font-size:16px
          }
        }
      `}</style>
      {isFloating ? <span className="ss-tools-floating-placeholder" aria-hidden="true" /> : panel}
      {isFloating ? createPortal(panel, portalRoot) : null}
    </>
  )
}
