import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export default function StudioFileMenu({
  hasPaper,
  inWorkspace,
  canNew,
  canOpen,
  busy,
  onNew,
  onOpen,
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
  const triggerRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const reposition = () => {
      const rect = triggerRef.current?.getBoundingClientRect()
      if (!rect) return
      setPosition({
        top: Math.max(0, rect.bottom),
        left: Math.min(Math.max(4, rect.left), Math.max(4, window.innerWidth - 294)),
      })
    }

    const dismiss = (event) => {
      if (triggerRef.current?.contains(event.target) || menuRef.current?.contains(event.target)) return
      setOpen(false)
    }

    const onEscape = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    reposition()
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', onEscape)
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)

    return () => {
      document.removeEventListener('pointerdown', dismiss)
      document.removeEventListener('keydown', onEscape)
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
    }
  }, [open])

  const entries = [
    { label: 'New...', detail: 'New paper', action: onNew, disabled: !canNew },
    { label: 'Open Project...', detail: '.shadowstudio', action: onOpen, disabled: !canOpen },
    { separator: true },
    { label: 'Save Project', detail: 'Download project', action: onSave, disabled: !hasPaper || busy },
    { label: 'Save As...', detail: 'Name a project copy', action: onSaveAs, disabled: !hasPaper || busy },
    { label: 'Export PNG...', detail: 'Current paper', action: onExport, disabled: !hasPaper || !inWorkspace || busy },
    { separator: true },
    { label: 'Close Paper', action: onClose, disabled: !hasPaper || !inWorkspace || busy },
    { label: 'Close All Papers', action: onCloseAll, disabled: !hasPaper || busy },
    { separator: true },
    { label: 'Home', action: onHome, disabled: !inWorkspace || busy },
    { label: 'Exit Studio', action: onExit },
  ]

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="ss-menu-btn ss-file-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
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
            @media(max-width:600px){.ss-file-dropdown{max-height:calc(100dvh - 48px)}.ss-file-item{min-height:44px;font-size:13px}}
          `}</style>
          <div
            ref={menuRef}
            role="menu"
            aria-label="File"
            className="ss-file-dropdown"
            style={{ top: position.top, left: position.left }}
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
                onClick={() => {
                  setOpen(false)
                  entry.action()
                }}
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
