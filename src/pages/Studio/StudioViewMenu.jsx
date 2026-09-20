import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('studioViewMenu', {
  "en": {
    "view": "View",
    "canvasView": "Canvas view",
    "zoom": "Zoom",
    "zoomIn": "Zoom In",
    "zoomOut": "Zoom Out",
    "actualPixels": "Actual Pixels",
    "fit": "Fit to Screen",
    "guides": "Canvas guides",
    "showGrid": "Show Grid",
    "on": "On",
    "off": "Off",
    "gridSpacing": "Grid spacing in paper pixels",
    "orientation": "Orientation",
    "rotateLeft": "Rotate View Left",
    "rotateRight": "Rotate View Right",
    "flipHorizontal": "Flip View Horizontally",
    "flipVertical": "Flip View Vertically",
    "resetOrientation": "Reset Orientation"
  },
  "km": {
    "view": "មើល",
    "canvasView": "ទិដ្ឋភាពផ្ទាំងគំនូរ",
    "zoom": "ពង្រីក",
    "zoomIn": "ពង្រីកចូល",
    "zoomOut": "បង្រួមចេញ",
    "actualPixels": "ទំហំភីកសែលពិត",
    "fit": "បង្ហាញពេញផ្ទាំង",
    "guides": "បន្ទាត់ជំនួយ",
    "showGrid": "បង្ហាញក្រឡាចត្រង្គ",
    "on": "បើក",
    "off": "បិទ",
    "gridSpacing": "ចន្លោះក្រឡាចត្រង្គគិតជា px",
    "orientation": "ទិសដៅ",
    "rotateLeft": "បង្វិលទៅឆ្វេង",
    "rotateRight": "បង្វិលទៅស្ដាំ",
    "flipHorizontal": "ត្រឡប់ទិដ្ឋភាពផ្ដេក",
    "flipVertical": "ត្រឡប់ទិដ្ឋភាពបញ្ឈរ",
    "resetOrientation": "កំណត់ទិដ្ឋភាពឡើងវិញ"
  },
  "zh": {
    "view": "视图",
    "canvasView": "画布视图",
    "zoom": "缩放",
    "zoomIn": "放大",
    "zoomOut": "缩小",
    "actualPixels": "实际像素",
    "fit": "适合屏幕",
    "guides": "画布辅助线",
    "showGrid": "显示网格",
    "on": "开",
    "off": "关",
    "gridSpacing": "网格间距（画布像素）",
    "orientation": "方向",
    "rotateLeft": "向左旋转视图",
    "rotateRight": "向右旋转视图",
    "flipHorizontal": "水平翻转视图",
    "flipVertical": "垂直翻转视图",
    "resetOrientation": "重置方向"
  },
  "ja": {
    "view": "表示",
    "canvasView": "キャンバス表示",
    "zoom": "ズーム",
    "zoomIn": "拡大",
    "zoomOut": "縮小",
    "actualPixels": "実際のピクセル",
    "fit": "画面に合わせる",
    "guides": "キャンバスのガイド",
    "showGrid": "グリッドを表示",
    "on": "オン",
    "off": "オフ",
    "gridSpacing": "グリッド間隔（px）",
    "orientation": "向き",
    "rotateLeft": "表示を左に回転",
    "rotateRight": "表示を右に回転",
    "flipHorizontal": "表示を左右反転",
    "flipVertical": "表示を上下反転",
    "resetOrientation": "向きをリセット"
  },
  "ko": {
    "view": "보기",
    "canvasView": "캔버스 보기",
    "zoom": "확대/축소",
    "zoomIn": "확대",
    "zoomOut": "축소",
    "actualPixels": "실제 픽셀",
    "fit": "화면에 맞추기",
    "guides": "캔버스 안내선",
    "showGrid": "격자 표시",
    "on": "켬",
    "off": "끔",
    "gridSpacing": "격자 간격(픽셀)",
    "orientation": "방향",
    "rotateLeft": "보기 왼쪽 회전",
    "rotateRight": "보기 오른쪽 회전",
    "flipHorizontal": "보기 좌우 뒤집기",
    "flipVertical": "보기 상하 뒤집기",
    "resetOrientation": "방향 초기화"
  }
})

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
  const { t: tx } = useDisplayTranslation()
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
        {tx('studioViewMenu.view')}
      </button>
      {open && createPortal(
        <div
          ref={menuRef}
          role="menu"
          aria-label={tx('studioViewMenu.canvasView')}
          className="ss-view-menu"
          style={{ top: position.top, left: position.left }}
          onKeyDown={navigateMenu}
        >
          <div className="ss-view-menu-heading">{tx('studioViewMenu.zoom')}</div>
          <button role="menuitem" type="button" className="ss-view-menu-item" disabled={zoom >= 6400} onClick={() => invoke(() => onZoom(zoom * 1.2))}>{tx('studioViewMenu.zoomIn')} <small>+</small></button>
          <button role="menuitem" type="button" className="ss-view-menu-item" disabled={zoom <= 1} onClick={() => invoke(() => onZoom(zoom / 1.2))}>{tx('studioViewMenu.zoomOut')} <small>−</small></button>
          <button role="menuitem" type="button" className="ss-view-menu-item" onClick={() => invoke(() => onZoom(100))}>{tx('studioViewMenu.actualPixels')} <small>100%</small></button>
          <button role="menuitem" type="button" className="ss-view-menu-item" onClick={() => invoke(onFit)}>{tx('studioViewMenu.fit')} <small>{zoom}%</small></button>
          <div className="ss-view-menu-divider" role="separator" />
          <div className="ss-view-menu-heading">{tx('studioViewMenu.guides')}</div>
          <button role="menuitemcheckbox" aria-checked={gridVisible} type="button" className="ss-view-menu-item" onClick={() => invoke(onToggleGrid)}>{tx('studioViewMenu.showGrid')} <small>{gridVisible ? `✓ ${tx('studioViewMenu.on')}` : tx('studioViewMenu.off')}</small></button>
          <div className="ss-view-grid-spacing" role="group" aria-label={tx('studioViewMenu.gridSpacing')}>
            {[25, 50, 100].map((spacing) => (
              <button key={spacing} type="button" aria-pressed={gridSpacing === spacing} onClick={() => onGridSpacing(spacing)}>{spacing}px</button>
            ))}
          </div>
          <div className="ss-view-menu-divider" role="separator" />
          <div className="ss-view-menu-heading">{tx('studioViewMenu.orientation')} · {rotation}°</div>
          <button role="menuitem" type="button" className="ss-view-menu-item" onClick={() => invoke(() => onRotate(-90))}>{tx('studioViewMenu.rotateLeft')} <small>↶ 90°</small></button>
          <button role="menuitem" type="button" className="ss-view-menu-item" onClick={() => invoke(() => onRotate(90))}>{tx('studioViewMenu.rotateRight')} <small>↷ 90°</small></button>
          <button role="menuitemcheckbox" aria-checked={flippedHorizontal} type="button" className="ss-view-menu-item" onClick={() => invoke(onFlipHorizontal)}>{tx('studioViewMenu.flipHorizontal')} <small>{flippedHorizontal ? '✓' : '⇋'}</small></button>
          <button role="menuitemcheckbox" aria-checked={flippedVertical} type="button" className="ss-view-menu-item" onClick={() => invoke(onFlipVertical)}>{tx('studioViewMenu.flipVertical')} <small>{flippedVertical ? '✓' : '⇵'}</small></button>
          <button role="menuitem" type="button" className="ss-view-menu-item" onClick={() => invoke(onResetOrientation)}>{tx('studioViewMenu.resetOrientation')} <small>0°</small></button>
        </div>,
        document.body
      )}
    </>
  )
}
