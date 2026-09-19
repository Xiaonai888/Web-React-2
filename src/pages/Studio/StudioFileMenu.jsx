import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export default function StudioFileMenu({
  hasPaper,
  inWorkspace,
  canNew,
  canOpen,
  canImport,
  busy,
  onNew,
  onOpen,
  onImport,
  onSave,
  onSaveAs,
  onExport,
  onClose,
  onCloseAll,
  onHome,
  onExit,
}) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ top: 34, left: 7 })
  const menuId = useId()
  const triggerRef = useRef(null)
  const menuRef = useRef(null)

  const entries = [
    { label: 'New...', detail: 'New paper', action: onNew, disabled: !canNew },
    { label: 'Open Project...', detail: '.shadowstudio', action: onOpen, disabled: !canOpen },
    { label: 'Import Image as Paper...', detail: 'PNG / JPEG / WebP', action: onImport, disabled: !canImport },
    { separator: true },
    { label: 'Save Project', detail: 'Download project', action: onSave, disabled: !hasPaper || busy },
    { label: 'Save As...', detail: 'Name a project copy', action: onSaveAs, disabled: !hasPaper || busy },
    { label: 'Export Image...', detail: 'PNG / JPEG / WebP', action: onExport, disabled: !hasPaper || !inWorkspace || busy },
    { separator: true },
    { label: 'Close Paper', action: onClose, disabled: !hasPaper || !inWorkspace || busy },
    { label: 'Close All Papers', action: onCloseAll, disabled: !hasPaper || busy },
    { separator: true },
    { label: 'Home', action: onHome, disabled: !inWorkspace || busy },
    { label: 'Exit Studio', action: onExit },
  ]

  useEffect(() => {
    if (!open) return undefined
    function reposition() {
      const rect = triggerRef.current?.getBoundingClientRect()
      if (!rect) return
      const width = Math.min(290, window.innerWidth - 8)
      setPosition({
        top: Math.max(4, Math.min(rect.bottom + 2, window.innerHeight - 44)),
        left: Math.max(4, Math.min(rect.left, window.innerWidth - width - 4)),
      })
    }
    function dismiss(event) {
      if (triggerRef.current?.contains(event.target) || menuRef.current?.contains(event.target)) return
      setOpen(false)
    }
    function onKeyDown(event) {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setOpen(false)
      triggerRef.current?.focus()
    }
    reposition()
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)
    return () => {
      document.removeEventListener('pointerdown', dismiss)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
    }
  }, [open])

  function menuItems() {
    return Array.from(menuRef.current?.querySelectorAll('[role="menuitem"]:not(:disabled)') || [])
  }

  function focusItem(index) {
    const items = menuItems()
    if (!items.length) return
    items[((index % items.length) + items.length) % items.length]?.focus()
  }

  function navigateMenu(event) {
    const items = menuItems()
    const index = items.indexOf(document.activeElement)
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      focusItem(index + (event.key === 'ArrowDown' ? 1 : -1))
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      focusItem(event.key === 'Home' ? 0 : items.length - 1)
    } else if (event.key === 'Tab') {
      setOpen(false)
    }
  }

  function invoke(entry) {
    if (entry.disabled) return
    setOpen(false)
    entry.action()
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="ss-menu-btn ss-file-trigger"
        aria-haspopup="menu"
        aria-controls={open ? menuId : undefined}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
            event.preventDefault()
            setOpen(true)
            requestAnimationFrame(() => focusItem(event.key === 'ArrowDown' ? 0 : -1))
          }
        }}
      >
        File
      </button>
      {open && createPortal(
        <>
          <style>{`
            .ss-file-dropdown{position:fixed;z-index:100000;width:min(290px,calc(100vw - 8px));max-height:calc(100dvh - 42px);overflow-y:auto;padding:5px;border:1px solid #616872;border-radius:5px;background:#292d32;color:#f3f4f6;box-shadow:0 16px 40px rgba(0,0,0,.5);font-family:inherit;overscroll-behavior:contain}
            .ss-file-item{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;min-height:38px;border:0;border-radius:3px;padding:7px 10px;background:transparent;color:inherit;text-align:left;font:inherit;font-size:12px;cursor:pointer}
            .ss-file-item:hover:not(:disabled),.ss-file-item:focus-visible{outline:none;background:#365679}
            .ss-file-item:disabled{opacity:.4;cursor:default}
            .ss-file-detail{color:#b9c0c8;font-size:10px;text-align:right;white-space:nowrap}
            .ss-file-item:hover:not(:disabled) .ss-file-detail{color:#f3f4f6}
            .ss-file-divider{height:1px;margin:5px 6px;background:#4a5159}
            @media(max-width:600px){.ss-file-dropdown{max-height:calc(100dvh - 48px)}.ss-file-item{min-height:44px;font-size:13px}
              .ss-file-detail{white-space:normal;text-align:right}}
          `}</style>
          <div
            id={menuId}
            ref={menuRef}
            role="menu"
            aria-label="File"
            className="ss-file-dropdown"
            style={{ top: position.top, left: position.left }}
            onKeyDown={navigateMenu}
          >
            {entries.map((entry, index) => entry.separator ? (
              <div key={`divider-${index}`} className="ss-file-divider" role="separator" />
            ) : (
              <button
                key={entry.label}
                type="button"
                className="ss-file-item"
                role="menuitem"
                disabled={entry.disabled}
                onClick={() => invoke(entry)}
              >
                <span>{entry.label}</span>
                {entry.detail ? <span className="ss-file-detail">{entry.detail}</span> : null}
              </button>
            ))}
          </div>
        </>,
        document.body
      )}
    </>
  )
}
