import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export default function StudioViewMenu({
  enabled,
  zoom,
  gridVisible,
  gridSpacing,
  rotation,
  flippedHorizontal,
  flippedVertical,
  onToggleGrid,
  onGridSpacing,
  onZoom,
  onFit,
  onRotate,
  onFlipHorizontal,
  onFlipVertical,
  onResetOrientation,
}) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ top: 34, left: 48 })
  const triggerRef = useRef(null)
  const menuRef = useRef(null)
  const focusOnOpenRef = useRef(false)

  useEffect(() => {
    if (!enabled) setOpen(false)
  }, [enabled])

  useEffect(() => {
    if (!open) return undefined

    function reposition() {
      const rect = triggerRef.current?.getBoundingClientRect()
      if (!rect) return
      const height = menuRef.current?.getBoundingClientRect().height || 360
      setPosition({
        top: Math.min(Math.max(4, rect.bottom + 3), Math.max(4, window.innerHeight - height - 4)),
        left: Math.min(Math.max(4, rect.left), Math.max(4, window.innerWidth - 254)),
      })
    }

    function dismiss(event) {
      if (triggerRef.current?.contains(event.target) || menuRef.current?.contains(event.target)) return
      setOpen(false)
    }

    function escape(event) {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setOpen(false)
      triggerRef.current?.focus()
    }

    reposition()
    if (focusOnOpenRef.current) menuRef.current?.querySelector('button:not(:disabled)')?.focus()
    focusOnOpenRef.current = false
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', escape)
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)
    return () => {
      document.removeEventListener('pointerdown', dismiss)
      document.removeEventListener('keydown', escape)
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
    }
  }, [open])

  function navigateMenu(event) {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    const items = [...(menuRef.current?.querySelectorAll('button:not(:disabled)') || [])]
    if (!items.length) return
    event.preventDefault()
    const index = items.indexOf(document.activeElement)
    const next = event.key === 'Home' ? 0
      : event.key === 'End' ? items.length - 1
        : event.key === 'ArrowDown' ? (index + 1) % items.length
          : (index + items.length - 1) % items.length
    items[next]?.focus()
  }

  function invoke(action) {
    setOpen(false)
    action()
    triggerRef.current?.focus()
  }

  return (
    <>
      <style>{`
        .ss-view-grid{position:absolute;left:50%;top:50%;z-index:1;box-sizing:border-box;pointer-events:none;background-image:linear-gradient(to right,rgba(24,96,165,.28) 1px,transparent 1px),linear-gradient(to bottom,rgba(24,96,165,.28) 1px,transparent 1px);box-shadow:inset 0 0 0 1px rgba(25,108,185,.55);background-position:0 0;transform-origin:center center}
        .ss-view-menu{position:fixed;z-index:100001;width:min(250px,calc(100vw - 8px));max-height:calc(100dvh - 48px);overflow-y:auto;padding:6px;border:1px solid #68727e;border-radius:6px;background:#292e34;color:#f1f4f7;box-shadow:0 16px 42px rgba(0,0,0,.55);font-family:inherit;overscroll-behavior:contain}
        .ss-view-menu-heading{padding:8px 9px 5px;color:#aebccc;font-size:10px;font-weight:800;letter-spacing:.05em;text-transform:uppercase}
        .ss-view-menu-item{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;min-height:36px;border:0;border-radius:4px;background:transparent;color:inherit;padding:6px 9px;text-align:left;font:inherit;font-size:12px;cursor:pointer}
        .ss-view-menu-item:hover:not(:disabled),.ss-view-menu-item:focus-visible{outline:none;background:#365679}
        .ss-view-menu-item:disabled{opacity:.35;cursor:default}
        .ss-view-menu-item small{color:#b5c0cc;font-size:10px;white-space:nowrap}
        .ss-view-menu-item[aria-checked=true] small{color:#8cceff}
        .ss-view-menu-divider{height:1px;margin:5px 6px;background:#4b5560}
        .ss-view-grid-spacing{display:flex;gap:5px;padding:4px 9px 7px}
        .ss-view-grid-spacing button{flex:1;min-height:32px;border:1px solid #56616d;border-radius:4px;background:#343b43;color:#d5dfe9;font:inherit;font-size:11px;cursor:pointer}
        .ss-view-grid-spacing button[aria-pressed=true]{border-color:#78beff;background:#365679;color:#fff}
        @media(max-width:600px){.ss-view-menu-item{min-height:44px;font-size:13px}.ss-view-grid-spacing button{min-height:40px}}
      `}</style>
      <button
        ref={triggerRef}
        type="button"
        className="ss-menu-btn"
        disabled={!enabled}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return
          event.preventDefault()
          focusOnOpenRef.current = true
          setOpen(true)
        }}
      >
        View
      </button>
      {open && createPortal(
        <div
          ref={menuRef}
          role="menu"
          aria-label="Canvas view"
          className="ss-view-menu"
          style={{ top: position.top, left: position.left }}
          onKeyDown={navigateMenu}
        >
          <div className="ss-view-menu-heading">Zoom</div>
          <button role="menuitem" type="button" className="ss-view-menu-item" disabled={zoom >= 400} onClick={() => invoke(() => onZoom(zoom * 1.2))}>Zoom In <small>+</small></button>
          <button role="menuitem" type="button" className="ss-view-menu-item" disabled={zoom <= 10} onClick={() => invoke(() => onZoom(zoom / 1.2))}>Zoom Out <small>−</small></button>
          <button role="menuitem" type="button" className="ss-view-menu-item" onClick={() => invoke(() => onZoom(100))}>Actual Pixels <small>100%</small></button>
          <button role="menuitem" type="button" className="ss-view-menu-item" onClick={() => invoke(onFit)}>Fit to Screen <small>{zoom}%</small></button>
          <div className="ss-view-menu-divider" role="separator" />
          <div className="ss-view-menu-heading">Canvas guides</div>
          <button role="menuitemcheckbox" aria-checked={gridVisible} type="button" className="ss-view-menu-item" onClick={() => invoke(onToggleGrid)}>Show Grid <small>{gridVisible ? '✓ On' : 'Off'}</small></button>
          <div className="ss-view-grid-spacing" role="group" aria-label="Grid spacing in paper pixels">
            {[25, 50, 100].map((spacing) => (
              <button key={spacing} type="button" aria-pressed={gridSpacing === spacing} onClick={() => onGridSpacing(spacing)}>{spacing}px</button>
            ))}
          </div>
          <div className="ss-view-menu-divider" role="separator" />
          <div className="ss-view-menu-heading">Orientation · {rotation}°</div>
          <button role="menuitem" type="button" className="ss-view-menu-item" onClick={() => invoke(() => onRotate(-90))}>Rotate View Left <small>↶ 90°</small></button>
          <button role="menuitem" type="button" className="ss-view-menu-item" onClick={() => invoke(() => onRotate(90))}>Rotate View Right <small>↷ 90°</small></button>
          <button role="menuitemcheckbox" aria-checked={flippedHorizontal} type="button" className="ss-view-menu-item" onClick={() => invoke(onFlipHorizontal)}>Flip View Horizontally <small>{flippedHorizontal ? '✓' : '⇋'}</small></button>
          <button role="menuitemcheckbox" aria-checked={flippedVertical} type="button" className="ss-view-menu-item" onClick={() => invoke(onFlipVertical)}>Flip View Vertically <small>{flippedVertical ? '✓' : '⇵'}</small></button>
          <button role="menuitem" type="button" className="ss-view-menu-item" onClick={() => invoke(onResetOrientation)}>Reset Orientation <small>0°</small></button>
        </div>,
        document.body
      )}
    </>
  )
}
