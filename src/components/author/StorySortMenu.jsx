import { useEffect, useRef, useState } from 'react'

export default function StorySortMenu({ value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const selected = options.find((option) => option.id === value) || options[0]

  useEffect(() => {
    if (!open) return undefined

    const closeMenu = (event) => {
      if (!menuRef.current?.contains(event.target)) setOpen(false)
    }

    const closeWithEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', closeMenu)
    document.addEventListener('keydown', closeWithEscape)

    return () => {
      document.removeEventListener('pointerdown', closeMenu)
      document.removeEventListener('keydown', closeWithEscape)
    }
  }, [open])

  return (
    <div ref={menuRef} className="relative z-30 w-[150px] max-w-[48vw] shrink-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-9 w-full items-center justify-end gap-2 rounded-[10px] bg-white px-3 text-[12px] font-normal text-[#6f687c] active:bg-[#f4f0fb]"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="min-w-0 truncate">{selected.label}</span>
        <i className={`fa-solid fa-chevron-down shrink-0 text-[9px] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-[170px] max-w-[calc(100vw-28px)] overflow-hidden rounded-[12px] bg-white p-1.5 shadow-[0_12px_32px_rgba(31,20,63,0.18)] ring-1 ring-black/5">
          {options.map((option) => {
            const active = option.id === value

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onChange(option.id)
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between rounded-[8px] px-3 py-2.5 text-left text-[12px] font-normal ${
                  active
                    ? 'bg-[#eee8ff] text-[#7046ef]'
                    : 'text-[#51485f] active:bg-[#f6f3fb]'
                }`}
                role="menuitem"
              >
                <span>{option.label}</span>
                {active ? <i className="fa-solid fa-check text-[10px]" /> : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
