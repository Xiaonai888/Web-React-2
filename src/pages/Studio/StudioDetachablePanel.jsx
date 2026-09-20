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
          <span aria-hidden="true">⠿</span><span>{title}</span>
        </button>
        {floating ? <button type="button" className="ss-independent-dock" disabled={disabled} onClick={dock} title={`Dock ${title} on the right`} aria-label={`Dock ${title} on the right`}>↳</button> : null}
      </header>
      <div className="ss-independent-content">{children}</div>
    </section>
  )

  return (
    <>
      <style>{`
        .shadow-studio .ss-independent-panel{box-sizing:border-box;min-width:0;width:100%;border:1px solid #4b5b6a;background:#29333d;color:#e5edf6}
        .shadow-studio .ss-independent-header{display:flex;align-items:center;justify-content:space-between;gap:4px;height:29px;border-bottom:1px solid #4b5b6a;background:#263441}
        .shadow-studio .ss-independent-grip{display:flex;align-items:center;gap:7px;flex:1;min-width:0;height:100%;padding:0 9px;border:0;background:transparent;color:#eef3f9;font:inherit;font-size:11px;font-weight:700;text-align:left;cursor:grab;touch-action:none;user-select:none}
        .shadow-studio .ss-independent-grip:active{cursor:grabbing}
        .shadow-studio .ss-independent-grip:disabled{cursor:not-allowed;opacity:.6}
        .shadow-studio .ss-independent-dock{flex:none;height:24px;min-width:27px;margin-right:4px;border:1px solid #647c92;border-radius:3px;background:#344c61;color:white;cursor:pointer}
        .shadow-studio .ss-independent-grip:focus-visible,.shadow-studio .ss-independent-dock:focus-visible{outline:2px solid #91c8ff;outline-offset:-2px}
        .shadow-studio .ss-independent-content{min-width:0}
        .shadow-studio .ss-independent-panel.is-floating{position:fixed!important;display:flex!important;flex-direction:column!important;box-sizing:border-box;max-width:calc(100vw - 16px);max-height:calc(100dvh - 56px);min-height:90px;margin:0!important;overflow:hidden;border:1px solid #8bb8e5;border-radius:6px;box-shadow:0 16px 36px #000a}
        .shadow-studio .ss-independent-panel.is-floating .ss-independent-content{overflow:auto;overscroll-behavior:contain}
        .shadow-studio .ss-independent-placeholder{display:block;width:100%;height:30px;border:1px dashed #56718a;box-sizing:border-box}
      `}</style>
      {floating ? <div className="ss-independent-placeholder" aria-hidden="true" /> : panel}
      {floating ? createPortal(panel, root) : null}
    </>
  )
}
