import { cloneElement, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const STORAGE_KEY = 'shadow-studio-right-dock-v1'
const DESKTOP_QUERY = '(min-width:1101px) and (min-height:651px)'

function readLayout() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null')
    if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
      return { floating: Boolean(saved.floating), x: saved.x, y: saved.y }
    }
  } catch {}
  return { floating: false, x: 360, y: 90 }
}

export default function StudioFloatingRightDock({ children }) {
  const [layout, setLayout] = useState(readLayout)
  const [root, setRoot] = useState(null)
  const [nearDock, setNearDock] = useState(false)
  const [desktop, setDesktop] = useState(false)
  const dragRef = useRef(null)
  const layoutRef = useRef(layout)
  layoutRef.current = layout

  function persist(next) {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
  }

  useEffect(() => {
    setRoot(document.querySelector('.shadow-studio'))
    const media = window.matchMedia(DESKTOP_QUERY)
    const sync = () => {
      setDesktop(media.matches)
      if (!media.matches) {
        dragRef.current = null
        setNearDock(false)
      }
    }
    sync()
    media.addEventListener?.('change', sync)
    return () => media.removeEventListener?.('change', sync)
  }, [])

  useEffect(() => {
    function move(event) {
      const drag = dragRef.current
      if (!drag || drag.pointerId !== event.pointerId) return
      if (!drag.moved && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 5) return
      drag.moved = true
      const next = {
        floating: true,
        x: Math.max(0, Math.min(window.innerWidth - 90, event.clientX - drag.offsetX)),
        y: Math.max(54, Math.min(window.innerHeight - 35, event.clientY - drag.offsetY)),
      }
      layoutRef.current = next
      setLayout(next)
      setNearDock(event.clientX >= window.innerWidth - 92 && event.clientY >= 54)
    }

    function finish(event) {
      const drag = dragRef.current
      if (!drag || drag.pointerId !== event.pointerId) return
      dragRef.current = null
      setNearDock(false)
      if (!drag.moved) return
      const next = event.clientX >= window.innerWidth - 92 && event.clientY >= 54
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
    if (!desktop || (event.pointerType === 'mouse' && event.button !== 0)) return
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
    setNearDock(false)
    persist(next)
  }

  const floating = desktop && layout.floating && Boolean(root)
  const handle = desktop ? (
    <button
      type="button"
      className="ss-right-drag-handle"
      onPointerDown={start}
      onDoubleClick={floating ? dock : undefined}
      onKeyDown={(event) => { if (floating && event.key === 'Escape') dock() }}
      title={floating ? 'Drag panels or double-click to dock on the right' : 'Drag panels to detach'}
      aria-label={floating ? 'Drag panels or double-click to dock on the right' : 'Drag panels to detach'}
    >
      <span aria-hidden="true">⠿</span>
      <span aria-hidden="true">{floating ? 'Panels · Drag to right edge to dock' : 'Panels · Drag to detach'}</span>
    </button>
  ) : null

  const panel = cloneElement(children, {
    className: `${children.props.className || ''}${floating ? ' ss-right-floating' : ''}${floating && nearDock ? ' ss-right-near-dock' : ''}`,
    style: floating ? {
      ...children.props.style,
      left: Math.max(0, Math.min(window.innerWidth - 90, layout.x)),
      top: Math.max(54, Math.min(window.innerHeight - 35, layout.y)),
    } : children.props.style,
    children: <>{handle}{children.props.children}</>,
  })

  return (
    <>
      <style>{`
        .shadow-studio .ss-side:has(>.ss-right-drag-handle){position:relative;padding-top:25px!important;box-sizing:border-box}
        .shadow-studio .ss-right-drag-handle{position:absolute;top:0;left:0;right:0;z-index:30;display:flex;justify-content:center;align-items:center;gap:8px;height:24px;width:100%;border:0;border-bottom:1px solid #4f6072;border-radius:0;background:#303c49;color:#bcd0e2;font:inherit;font-size:10px;cursor:grab;touch-action:none;user-select:none}
        .shadow-studio .ss-right-drag-handle:active{cursor:grabbing}
        .shadow-studio .ss-right-drag-handle:focus-visible{outline:2px solid #8bc4ff;outline-offset:-2px}
        .shadow-studio .ss-side.ss-right-floating{position:fixed!important;z-index:9050!important;display:grid!important;width:min(490px,calc(100vw - 12px))!important;height:min(760px,calc(100dvh - 66px))!important;min-height:180px!important;max-height:calc(100dvh - 66px)!important;margin:0!important;padding:25px 0 0!important;overflow-x:hidden!important;overflow-y:auto!important;grid-column:auto!important;grid-row:auto!important;align-self:auto!important;border:1px solid #71869c!important;border-radius:7px!important;background:#29333d!important;box-shadow:0 14px 36px #0009!important}
        .shadow-studio .ss-side.ss-right-floating .ss-right-drag-handle{border-radius:6px 6px 0 0}
        .shadow-studio .ss-side.ss-right-near-dock{border-color:#98c9ff!important;box-shadow:0 0 0 2px #98c9ff77,0 14px 36px #0009!important}
        .shadow-studio .ss-side.ss-right-floating .ss-right-switcher{min-height:0}
        .shadow-studio .ss-right-floating-placeholder{display:block;min-width:0;min-height:0}
        @media(min-width:1101px) and (min-height:651px){
          .shadow-studio:has(.ss-right-floating-placeholder) .ss-layout{grid-template-columns:284px minmax(0,1fr) 0px!important}
          .shadow-studio:has(.ss-right-floating-placeholder) .ss-bottom{right:0!important}
        }
      `}</style>
      {floating ? <span className="ss-right-floating-placeholder" aria-hidden="true" /> : panel}
      {floating ? createPortal(panel, root) : null}
    </>
  )
}
