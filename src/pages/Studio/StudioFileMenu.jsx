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
            .ss-file-dropdown{
              --ss-file-bg:#202832;
              --ss-file-bg-2:#29313a;
              --ss-file-bg-3:#313b46;
              --ss-file-line:#4b5968;
              --ss-file-line-soft:#3b4651;
              --ss-file-text:#edf3fa;
              --ss-file-muted:#aab8c6;
              --ss-file-blue:#5faeff;
              --ss-file-blue-soft:#355d84;
              position:fixed;
              z-index:100000;
              width:min(290px,calc(100vw - 8px));
              max-height:calc(100dvh - 42px);
              overflow-y:auto;
              padding:6px;
              border:1px solid #607183;
              border-radius:8px;
              background:linear-gradient(180deg,#29313a,#242c34);
              color:var(--ss-file-text);
              box-shadow:0 18px 42px #000b,0 0 0 1px #ffffff06;
              font:10px Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
              overscroll-behavior:contain;
              scrollbar-width:thin;
              scrollbar-color:#596c7f #242c34
            }
            .ss-file-item{
              position:relative;
              display:flex;
              align-items:center;
              justify-content:space-between;
              gap:12px;
              width:100%;
              min-height:36px;
              border:1px solid transparent;
              border-radius:6px;
              padding:7px 9px;
              background:transparent;
              color:inherit;
              text-align:left;
              font:700 10px Inter,ui-sans-serif,system-ui,sans-serif;
              cursor:pointer;
              transition:border-color 120ms ease,background 120ms ease,color 120ms ease
            }
            .ss-file-item::before{
              content:'';
              position:absolute;
              left:5px;
              top:50%;
              width:2px;
              height:0;
              border-radius:99px;
              background:var(--ss-file-blue);
              transform:translateY(-50%);
              transition:height 120ms ease
            }
            .ss-file-item:hover:not(:disabled),
            .ss-file-item:focus-visible{
              outline:none;
              border-color:#516679;
              background:#34495d;
              color:#fff
            }
            .ss-file-item:hover:not(:disabled)::before,
            .ss-file-item:focus-visible::before{
              height:18px
            }
            .ss-file-item:disabled{
              opacity:.38;
              cursor:default
            }
            .ss-file-item>span:first-child{
              min-width:0;
              overflow:hidden;
              text-overflow:ellipsis;
              white-space:nowrap
            }
            .ss-file-detail{
              flex:none;
              max-width:44%;
              overflow:hidden;
              color:#91a3b3;
              font-size:8px;
              font-weight:650;
              text-align:right;
              text-overflow:ellipsis;
              white-space:nowrap
            }
            .ss-file-item:hover:not(:disabled) .ss-file-detail,
            .ss-file-item:focus-visible .ss-file-detail{
              color:#cde6fb
            }
            .ss-file-divider{
              height:1px;
              margin:5px 5px;
              background:linear-gradient(90deg,transparent,var(--ss-file-line),transparent)
            }
            @media(max-width:600px){
              .ss-file-dropdown{
                max-height:calc(100dvh - 48px);
                border-radius:9px
              }
              .ss-file-item{
                min-height:42px;
                font-size:11px
              }
              .ss-file-detail{
                max-width:42%;
                white-space:normal;
                text-align:right;
                line-height:1.25
              }
            }
            @media(pointer:coarse){
              .ss-file-item{
                min-height:44px
              }
            }
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
