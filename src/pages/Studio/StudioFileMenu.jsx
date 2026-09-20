import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('studioFileMenu', {
  "en": {
    "file": "File",
    "new": "New...",
    "newDetail": "New paper",
    "openProject": "Open Project...",
    "importImage": "Import Image as Paper...",
    "saveProject": "Save Project",
    "downloadProject": "Download project",
    "saveAs": "Save As...",
    "saveAsDetail": "Name a project copy",
    "exportImage": "Export Image...",
    "closePaper": "Close Paper",
    "closeAll": "Close All Papers",
    "home": "Home",
    "exit": "Exit Studio"
  },
  "km": {
    "file": "ឯកសារ",
    "new": "ថ្មី...",
    "newDetail": "ក្រដាសថ្មី",
    "openProject": "បើកគម្រោង...",
    "importImage": "នាំចូលរូបភាពជាក្រដាស...",
    "saveProject": "រក្សាទុកគម្រោង",
    "downloadProject": "ទាញយកគម្រោង",
    "saveAs": "រក្សាទុកជា...",
    "saveAsDetail": "ដាក់ឈ្មោះច្បាប់ចម្លងគម្រោង",
    "exportImage": "នាំចេញរូបភាព...",
    "closePaper": "បិទក្រដាស",
    "closeAll": "បិទក្រដាសទាំងអស់",
    "home": "ទំព័រដើម",
    "exit": "ចាកចេញពី Studio"
  },
  "zh": {
    "file": "文件",
    "new": "新建...",
    "newDetail": "新建画布",
    "openProject": "打开项目...",
    "importImage": "将图像导入为画布...",
    "saveProject": "保存项目",
    "downloadProject": "下载项目",
    "saveAs": "另存为...",
    "saveAsDetail": "为项目副本命名",
    "exportImage": "导出图像...",
    "closePaper": "关闭画布",
    "closeAll": "关闭所有画布",
    "home": "主页",
    "exit": "退出 Studio"
  },
  "ja": {
    "file": "ファイル",
    "new": "新規...",
    "newDetail": "新しいキャンバス",
    "openProject": "プロジェクトを開く...",
    "importImage": "画像をキャンバスとして読み込む...",
    "saveProject": "プロジェクトを保存",
    "downloadProject": "プロジェクトをダウンロード",
    "saveAs": "名前を付けて保存...",
    "saveAsDetail": "プロジェクトのコピーに名前を付ける",
    "exportImage": "画像を書き出す...",
    "closePaper": "キャンバスを閉じる",
    "closeAll": "すべて閉じる",
    "home": "ホーム",
    "exit": "Studio を終了"
  },
  "ko": {
    "file": "파일",
    "new": "새로 만들기...",
    "newDetail": "새 캔버스",
    "openProject": "프로젝트 열기...",
    "importImage": "이미지를 캔버스로 가져오기...",
    "saveProject": "프로젝트 저장",
    "downloadProject": "프로젝트 다운로드",
    "saveAs": "다른 이름으로 저장...",
    "saveAsDetail": "프로젝트 사본 이름 지정",
    "exportImage": "이미지 내보내기...",
    "closePaper": "캔버스 닫기",
    "closeAll": "모든 캔버스 닫기",
    "home": "홈",
    "exit": "Studio 종료"
  }
})

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
  const { t: tx } = useDisplayTranslation()
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ top: 34, left: 7 })
  const menuId = useId()
  const triggerRef = useRef(null)
  const menuRef = useRef(null)

  const entries = [
    { label: tx('studioFileMenu.new'), detail: tx('studioFileMenu.newDetail'), action: onNew, disabled: !canNew },
    { label: tx('studioFileMenu.openProject'), detail: '.shadowstudio', action: onOpen, disabled: !canOpen },
    { label: tx('studioFileMenu.importImage'), detail: 'PNG / JPEG / WebP', action: onImport, disabled: !canImport },
    { separator: true },
    { label: tx('studioFileMenu.saveProject'), detail: tx('studioFileMenu.downloadProject'), action: onSave, disabled: !hasPaper || busy },
    { label: tx('studioFileMenu.saveAs'), detail: tx('studioFileMenu.saveAsDetail'), action: onSaveAs, disabled: !hasPaper || busy },
    { label: tx('studioFileMenu.exportImage'), detail: 'PNG / JPEG / WebP', action: onExport, disabled: !hasPaper || !inWorkspace || busy },
    { separator: true },
    { label: tx('studioFileMenu.closePaper'), action: onClose, disabled: !hasPaper || !inWorkspace || busy },
    { label: tx('studioFileMenu.closeAll'), action: onCloseAll, disabled: !hasPaper || busy },
    { separator: true },
    { label: tx('studioFileMenu.home'), action: onHome, disabled: !inWorkspace || busy },
    { label: tx('studioFileMenu.exit'), action: onExit },
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
        {tx('studioFileMenu.file')}
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
            aria-label={tx('studioFileMenu.file')}
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
