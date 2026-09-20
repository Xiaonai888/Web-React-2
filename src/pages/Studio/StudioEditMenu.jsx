import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('studioEditMenu', {
  "en": {
    "edit": "Edit",
    "drawing": "Edit drawing",
    "history": "History",
    "undo": "Undo",
    "redo": "Redo",
    "currentPaper": "Current paper",
    "clearPaper": "Clear Paper",
    "undoAvailable": "Undo available",
    "clearConfirm": "Clear this paper? You can restore it with Undo."
  },
  "km": {
    "edit": "កែសម្រួល",
    "drawing": "កែសម្រួលគំនូរ",
    "history": "ប្រវត្តិកែប្រែ",
    "undo": "ត្រឡប់ក្រោយ",
    "redo": "ធ្វើឡើងវិញ",
    "currentPaper": "ក្រដាសបច្ចុប្បន្ន",
    "clearPaper": "សម្អាតក្រដាស",
    "undoAvailable": "អាចត្រឡប់ក្រោយបាន",
    "clearConfirm": "សម្អាតក្រដាសនេះមែនទេ? អ្នកអាចស្ដារវាវិញដោយប្រើ Undo។"
  },
  "zh": {
    "edit": "编辑",
    "drawing": "编辑绘图",
    "history": "历史记录",
    "undo": "撤销",
    "redo": "重做",
    "currentPaper": "当前画布",
    "clearPaper": "清空画布",
    "undoAvailable": "可撤销",
    "clearConfirm": "清空此画布？您可以使用撤销恢复。"
  },
  "ja": {
    "edit": "編集",
    "drawing": "描画を編集",
    "history": "履歴",
    "undo": "元に戻す",
    "redo": "やり直す",
    "currentPaper": "現在のキャンバス",
    "clearPaper": "キャンバスを消去",
    "undoAvailable": "元に戻せます",
    "clearConfirm": "このキャンバスを消去しますか？元に戻す操作で復元できます。"
  },
  "ko": {
    "edit": "편집",
    "drawing": "그림 편집",
    "history": "기록",
    "undo": "실행 취소",
    "redo": "다시 실행",
    "currentPaper": "현재 캔버스",
    "clearPaper": "캔버스 지우기",
    "undoAvailable": "실행 취소 가능",
    "clearConfirm": "이 캔버스를 지울까요? 실행 취소로 복구할 수 있습니다."
  }
})

export default function StudioEditMenu({ enabled, canUndo, canRedo, onUndo, onRedo, onClear }) {
  const { t: tx } = useDisplayTranslation()
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ top: 34, left: 48 })
  const triggerRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!enabled) setOpen(false)
  }, [enabled])

  useEffect(() => {
    if (!open) return undefined

    function reposition() {
      const rect = triggerRef.current?.getBoundingClientRect()
      if (!rect) return
      setPosition({
        top: Math.min(rect.bottom + 3, Math.max(4, window.innerHeight - 48)),
        left: Math.min(Math.max(4, rect.left), Math.max(4, window.innerWidth - 264)),
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
    menuRef.current?.querySelector('[role="menuitem"]:not(:disabled)')?.focus()
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
    const items = [...(menuRef.current?.querySelectorAll('[role="menuitem"]:not(:disabled)') || [])]
    if (!items.length) return
    event.preventDefault()
    const current = items.indexOf(document.activeElement)
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1
      : event.key === 'ArrowDown' ? (current + 1) % items.length
        : (current + items.length - 1) % items.length
    items[next].focus()
  }

  function invoke(action) {
    setOpen(false)
    if (enabled) action()
  }

  function clearPaper() {
    setOpen(false)
    if (enabled && window.confirm(tx('studioEditMenu.clearConfirm'))) onClear()
  }

  return (
    <>
      <style>{`
        .ss-edit-menu{position:fixed;z-index:100002;width:min(258px,calc(100vw - 8px));max-height:calc(100dvh - 48px);overflow-y:auto;padding:6px;border:1px solid #68727e;border-radius:6px;background:#292e34;color:#f1f4f7;box-shadow:0 16px 42px rgba(0,0,0,.55);font-family:inherit;overscroll-behavior:contain}
        .ss-edit-menu-heading{padding:8px 9px 5px;color:#aebccc;font-size:10px;font-weight:800;letter-spacing:.05em;text-transform:uppercase}
        .ss-edit-menu-item{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;min-height:38px;border:0;border-radius:4px;background:transparent;color:inherit;padding:6px 9px;text-align:left;font:inherit;font-size:12px;cursor:pointer}
        .ss-edit-menu-item:hover:not(:disabled),.ss-edit-menu-item:focus-visible{outline:none;background:#365679}
        .ss-edit-menu-item:disabled{opacity:.35;cursor:default}
        .ss-edit-menu-item small{color:#b5c0cc;font-size:10px;white-space:nowrap}
        .ss-edit-menu-divider{height:1px;margin:5px 6px;background:#4b5560}
        @media(max-width:600px){.ss-edit-menu-item{min-height:44px;font-size:13px}}
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
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            setOpen(true)
          }
        }}
      >
        {tx('studioEditMenu.edit')}
      </button>
      {open && createPortal(
        <div
          ref={menuRef}
          role="menu"
          aria-label={tx('studioEditMenu.drawing')}
          className="ss-edit-menu"
          style={{ top: position.top, left: position.left }}
          onKeyDown={navigateMenu}
        >
          <div className="ss-edit-menu-heading">{tx('studioEditMenu.history')}</div>
          <button type="button" role="menuitem" className="ss-edit-menu-item" disabled={!canUndo} onClick={() => invoke(onUndo)}>{tx('studioEditMenu.undo')} <small>Ctrl/⌘ Z</small></button>
          <button type="button" role="menuitem" className="ss-edit-menu-item" disabled={!canRedo} onClick={() => invoke(onRedo)}>{tx('studioEditMenu.redo')} <small>Ctrl/⌘ Shift Z</small></button>
          <div className="ss-edit-menu-divider" role="separator" />
          <div className="ss-edit-menu-heading">{tx('studioEditMenu.currentPaper')}</div>
          <button type="button" role="menuitem" className="ss-edit-menu-item" onClick={clearPaper}>{tx('studioEditMenu.clearPaper')} <small>{tx('studioEditMenu.undoAvailable')}</small></button>
        </div>,
        document.body
      )}
    </>
  )
}
