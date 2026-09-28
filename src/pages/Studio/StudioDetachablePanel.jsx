import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const DESKTOP = '(min-width:1101px) and (min-height:651px)'
const STORAGE_PREFIX = 'shadow-studio-independent-panel-v1-'
let topZIndex = 9100

function readPosition(id) {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_PREFIX + id) || 'null')
    if (saved && typeof saved.floating === 'boolean' && Number.isFinite(saved.x) && Number.isFinite(saved.y)) return saved
  } catch {}
  return { floating: false, x: 120, y: 90 }
}

function position(x, y, width) {
  return {
    x: Math.max(8, Math.min(x, window.innerWidth - Math.min(width, window.innerWidth - 16) - 8)),
    y: Math.max(48, Math.min(y, window.innerHeight - 42)),
  }
}

export default function StudioDetachablePanel({ id, title, children, width = 340, disabled = false }) {
  const [layout, setLayout] = useState(() => readPosition(id))
  const [root, setRoot] = useState(null)
  const [desktop, setDesktop] = useState(false)
  const [zIndex, setZIndex] = useState(9100)
  const drag = useRef(null)
  const layoutRef = useRef(layout)
  layoutRef.current = layout

  function save(next) {
    try { window.localStorage.setItem(STORAGE_PREFIX + id, JSON.stringify(next)) } catch {}
  }

  useEffect(() => {
    setRoot(document.querySelector('.shadow-studio'))
    const media = window.matchMedia(DESKTOP)
    const sync = () => {
      setDesktop(media.matches)
      if (!media.matches) drag.current = null
    }
    sync()
    media.addEventListener?.('change', sync)
    return () => media.removeEventListener?.('change', sync)
  }, [])

  useEffect(() => {
    function move(event) {
      const current = drag.current
      if (!current || current.pointerId !== event.pointerId) return
      if (!current.moved && Math.hypot(event.clientX - current.startX, event.clientY - current.startY) < 5) return
      current.moved = true
      const at = position(event.clientX - current.offsetX, event.clientY - current.offsetY, width)
      const next = { floating: true, ...at }
      layoutRef.current = next
      setLayout(next)
    }
    function stop(event) {
      if (!drag.current || drag.current.pointerId !== event.pointerId) return
      const moved = drag.current.moved
      drag.current = null
      if (moved) save(layoutRef.current)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
    }
  }, [id, width])

  function start(event) {
    if (disabled || !desktop || (event.pointerType === 'mouse' && event.button !== 0)) return
    const rect = event.currentTarget.closest('.ss-independent-panel').getBoundingClientRect()
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      moved: false,
    }
    setZIndex(++topZIndex)
    event.preventDefault()
    event.stopPropagation()
  }

  function dock() {
    if (disabled) return
    drag.current = null
    const next = { ...layoutRef.current, floating: false }
    layoutRef.current = next
    setLayout(next)
    save(next)
  }

  function detachKeyboard(event) {
    if (event.detail !== 0 || disabled || !desktop || layoutRef.current.floating) return
    const next = { ...layoutRef.current, floating: true, ...position(layoutRef.current.x, layoutRef.current.y, width) }
    layoutRef.current = next
    setLayout(next)
    setZIndex(++topZIndex)
    save(next)
  }

  const floating = desktop && layout.floating && Boolean(root)
  const at = floating ? position(layout.x, layout.y, width) : null
  const panel = (
    <section
      className={`ss-independent-panel${floating ? ' is-floating' : ''}`}
      aria-label={title}
      data-panel-id={id}
      style={floating ? { left: at.x, top: at.y, width: Math.min(width, window.innerWidth - 16), zIndex } : undefined}
      onPointerDown={() => { if (floating) setZIndex(++topZIndex) }}
    >
      <header className="ss-independent-header">
        <button type="button" className="ss-independent-grip" disabled={disabled} title={floating ? `Move ${title}` : `Drag ${title} to detach`} aria-label={floating ? `Move ${title}` : `Drag ${title} to detach`} onPointerDown={start} onClick={detachKeyboard}>
          <span className="ss-independent-grip-icon" aria-hidden="true">⠿</span><span>{title}</span>
        </button>
        {floating ? <button type="button" className="ss-independent-dock" disabled={disabled} onClick={dock} title={`Dock ${title} on the right`} aria-label={`Dock ${title} on the right`}>↳</button> : null}
      </header>
      <div className="ss-independent-content">{children}</div>
    </section>
  )

  return (
    <>
      <style>{`
        .shadow-studio .ss-independent-panel{
          --ss-detach-panel:#29313a;
          --ss-detach-panel-2:#202832;
          --ss-detach-line:#4b5968;
          --ss-detach-line-soft:#3b4651;
          --ss-detach-text:#edf3fa;
          --ss-detach-muted:#aab8c6;
          --ss-detach-blue:#5faeff;
          box-sizing:border-box;
          min-width:0;
          width:100%;
          overflow:hidden;
          border:1px solid var(--ss-detach-line-soft);
          border-radius:8px;
          background:var(--ss-detach-panel);
          color:var(--ss-detach-text);
          box-shadow:inset 0 0 0 1px #ffffff06
        }
        .shadow-studio .ss-independent-header{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:4px;
          min-height:34px;
          border-bottom:1px solid var(--ss-detach-line-soft);
          background:linear-gradient(180deg,#34404c,#2a333c)
        }
        .shadow-studio .ss-independent-grip{
          display:flex;
          align-items:center;
          gap:8px;
          flex:1;
          min-width:0;
          height:34px;
          padding:0 9px;
          border:0;
          background:transparent;
          color:#eef4fb;
          font:800 10px Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          text-align:left;
          cursor:grab;
          touch-action:none;
          user-select:none
        }
        .shadow-studio .ss-independent-grip>span:last-child{
          min-width:0;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap
        }
        .shadow-studio .ss-independent-grip-icon{
          width:22px;
          height:22px;
          display:grid;
          place-items:center;
          flex:none;
          border:1px solid #506171;
          border-radius:5px;
          background:#27323c;
          color:#a7c9e6;
          font-size:13px;
          line-height:1
        }
        .shadow-studio .ss-independent-grip:hover:not(:disabled){
          background:#ffffff08
        }
        .shadow-studio .ss-independent-grip:active{
          cursor:grabbing;
          background:#203243
        }
        .shadow-studio .ss-independent-grip:disabled{
          cursor:not-allowed;
          opacity:.6
        }
        .shadow-studio .ss-independent-dock{
          flex:none;
          width:28px;
          height:26px;
          min-width:28px;
          margin-right:4px;
          border:1px solid #60778c;
          border-radius:5px;
          background:#304a60;
          color:#f0f7fd;
          font:800 12px Inter,ui-sans-serif,system-ui,sans-serif;
          cursor:pointer;
          transition:border-color 120ms ease,background 120ms ease
        }
        .shadow-studio .ss-independent-dock:hover:not(:disabled){
          border-color:#8ec6f4;
          background:#3b6f9b
        }
        .shadow-studio .ss-independent-grip:focus-visible,
        .shadow-studio .ss-independent-dock:focus-visible{
          outline:2px solid var(--ss-detach-blue);
          outline-offset:-2px
        }
        .shadow-studio .ss-independent-content{
          min-width:0;
          background:var(--ss-detach-panel)
        }
        .shadow-studio .ss-independent-panel.is-floating{
          position:fixed!important;
          display:flex!important;
          flex-direction:column!important;
          box-sizing:border-box;
          max-width:calc(100vw - 16px);
          max-height:calc(100dvh - 56px);
          min-height:90px;
          margin:0!important;
          overflow:hidden;
          border:1px solid #76aee0;
          border-radius:9px;
          background:#29313a;
          box-shadow:0 18px 42px #000b,0 0 0 1px #5faeff22
        }
        .shadow-studio .ss-independent-panel.is-floating .ss-independent-header{
          background:linear-gradient(180deg,#374757,#2c3945)
        }
        .shadow-studio .ss-independent-panel.is-floating .ss-independent-content{
          overflow:auto;
          overscroll-behavior:contain;
          scrollbar-width:thin
        }
        .shadow-studio .ss-independent-placeholder{
          display:block;
          width:100%;
          height:34px;
          border:1px dashed #58738b;
          border-radius:7px;
          box-sizing:border-box;
          background:#26313b55
        }
        @media(pointer:coarse){
          .shadow-studio .ss-independent-header{min-height:40px}
          .shadow-studio .ss-independent-grip{height:40px;font-size:11px}
          .shadow-studio .ss-independent-grip-icon{width:26px;height:26px}
          .shadow-studio .ss-independent-dock{width:34px;height:32px;min-width:34px}
          .shadow-studio .ss-independent-placeholder{height:40px}
        }
      `}</style>
      {floating ? <div className="ss-independent-placeholder" aria-hidden="true" /> : panel}
      {floating ? createPortal(panel, root) : null}
    </>
  )
}
