import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import StudioColorPanel from './StudioColorPanel'
import StudioBrushSettings from './StudioBrushSettings'
import StudioRightPanels from './StudioRightPanels'
import StudioToolPalette from './StudioToolPalette'

registerTranslationNamespace('studioWorkspace', {
  "en": {
    "brush": "Brush",
    "settingsPresets": "Settings & presets",
    "brushSettingsPanel": "Brush settings panel",
    "studioSidePanels": "Studio side panels",
    "canvasView": "Canvas View",
    "rotateLeft": "Rotate view 90° counterclockwise",
    "rotateRight": "Rotate view 90° clockwise",
    "flipH": "Flip H",
    "flipV": "Flip V",
    "reset": "Reset",
    "rotation": "Rotation",
    "canvasRotation": "Canvas rotation",
    "viewOnlyHelp": "Rotation and flipping affect only the view. Your saved drawing and exported image remain unchanged.",
    "statusControls": "Studio status and canvas controls",
    "documentInfo": "Current document information",
    "currentPaper": "Current paper",
    "noPaper": "No open paper",
    "paperCount": "Current paper / open papers",
    "zoomOut": "Zoom out",
    "zoomIn": "Zoom in",
    "canvasZoom": "Canvas zoom",
    "actualPixels": "Actual pixels",
    "fitScreen": "Fit paper to screen",
    "fit": "Fit",
    "rotateViewLeft": "Rotate view counterclockwise",
    "rotateViewRight": "Rotate view clockwise",
    "flipViewHoriz": "Flip view horizontally",
    "flipViewVert": "Flip view vertically",
    "resetOrientation": "Reset view orientation",
    "viewOrientation": "View orientation",
    "rotate": "Rotate",
    "angleDegrees": "View rotation in degrees",
    "flipHViewOnly": "Flip horizontal (view only)",
    "flipVViewOnly": "Flip vertical (view only)",
    "resetCanvasView": "Reset canvas view orientation"
  },
  "km": {
    "brush": "ជក់",
    "settingsPresets": "ការកំណត់ និង Preset",
    "brushSettingsPanel": "ផ្ទាំងកំណត់ជក់",
    "studioSidePanels": "ផ្ទាំងចំហៀង Studio",
    "canvasView": "ទិដ្ឋភាព Canvas",
    "rotateLeft": "បង្វិលទិដ្ឋភាព ៩០° ច្រាសទ្រនិចនាឡិកា",
    "rotateRight": "បង្វិលទិដ្ឋភាព ៩០° តាមទ្រនិចនាឡិកា",
    "flipH": "ត្រឡប់ផ្ដេក",
    "flipV": "ត្រឡប់បញ្ឈរ",
    "reset": "កំណត់ឡើងវិញ",
    "rotation": "មុំបង្វិល",
    "canvasRotation": "មុំបង្វិល Canvas",
    "viewOnlyHelp": "ការបង្វិល និងត្រឡប់នេះប្ដូរតែទិដ្ឋភាព មិនប្ដូររូបគំនូរដែលបានរក្សាទុក ឬរូបភាព Export ទេ។",
    "statusControls": "ស្ថានភាព និងការគ្រប់គ្រង Canvas",
    "documentInfo": "ព័ត៌មានឯកសារបច្ចុប្បន្ន",
    "currentPaper": "ក្រដាសបច្ចុប្បន្ន",
    "noPaper": "គ្មានក្រដាសបើក",
    "paperCount": "ក្រដាសបច្ចុប្បន្ន / ក្រដាសដែលបើក",
    "zoomOut": "បង្រួម",
    "zoomIn": "ពង្រីក",
    "canvasZoom": "កម្រិតពង្រីក Canvas",
    "actualPixels": "ទំហំភីកសែលពិត",
    "fitScreen": "បង្ហាញក្រដាសឱ្យសមនឹងអេក្រង់",
    "fit": "សមអេក្រង់",
    "rotateViewLeft": "បង្វិលទិដ្ឋភាពទៅឆ្វេង",
    "rotateViewRight": "បង្វិលទិដ្ឋភាពទៅស្ដាំ",
    "flipViewHoriz": "ត្រឡប់ទិដ្ឋភាពផ្ដេក",
    "flipViewVert": "ត្រឡប់ទិដ្ឋភាពបញ្ឈរ",
    "resetOrientation": "កំណត់ទិសទិដ្ឋភាពឡើងវិញ",
    "viewOrientation": "ទិសទិដ្ឋភាព",
    "rotate": "បង្វិល",
    "angleDegrees": "មុំបង្វិលទិដ្ឋភាពគិតជាដឺក្រេ",
    "flipHViewOnly": "ត្រឡប់ផ្ដេក (តែទិដ្ឋភាព)",
    "flipVViewOnly": "ត្រឡប់បញ្ឈរ (តែទិដ្ឋភាព)",
    "resetCanvasView": "កំណត់ទិស Canvas ឡើងវិញ"
  },
  "zh": {
    "brush": "画笔",
    "settingsPresets": "设置与预设",
    "brushSettingsPanel": "画笔设置面板",
    "studioSidePanels": "Studio 侧边面板",
    "canvasView": "画布视图",
    "rotateLeft": "视图逆时针旋转 90°",
    "rotateRight": "视图顺时针旋转 90°",
    "flipH": "水平翻转",
    "flipV": "垂直翻转",
    "reset": "重置",
    "rotation": "旋转角度",
    "canvasRotation": "画布视图旋转",
    "viewOnlyHelp": "旋转和翻转仅改变视图，不会影响保存的绘图或导出图像。",
    "statusControls": "Studio 状态与画布控制",
    "documentInfo": "当前文档信息",
    "currentPaper": "当前画布",
    "noPaper": "未打开画布",
    "paperCount": "当前画布 / 已打开画布",
    "zoomOut": "缩小",
    "zoomIn": "放大",
    "canvasZoom": "画布缩放",
    "actualPixels": "实际像素",
    "fitScreen": "适合屏幕",
    "fit": "适合",
    "rotateViewLeft": "逆时针旋转视图",
    "rotateViewRight": "顺时针旋转视图",
    "flipViewHoriz": "水平翻转视图",
    "flipViewVert": "垂直翻转视图",
    "resetOrientation": "重置视图方向",
    "viewOrientation": "视图方向",
    "rotate": "旋转",
    "angleDegrees": "视图旋转角度",
    "flipHViewOnly": "水平翻转（仅视图）",
    "flipVViewOnly": "垂直翻转（仅视图）",
    "resetCanvasView": "重置画布视图方向"
  },
  "ja": {
    "brush": "ブラシ",
    "settingsPresets": "設定とプリセット",
    "brushSettingsPanel": "ブラシ設定パネル",
    "studioSidePanels": "Studio サイドパネル",
    "canvasView": "キャンバス表示",
    "rotateLeft": "表示を反時計回りに 90° 回転",
    "rotateRight": "表示を時計回りに 90° 回転",
    "flipH": "左右反転",
    "flipV": "上下反転",
    "reset": "リセット",
    "rotation": "回転角度",
    "canvasRotation": "キャンバス表示の回転",
    "viewOnlyHelp": "回転と反転は表示のみに適用されます。保存した描画や書き出し画像は変更されません。",
    "statusControls": "Studio の状態とキャンバス操作",
    "documentInfo": "現在のドキュメント情報",
    "currentPaper": "現在のキャンバス",
    "noPaper": "開いているキャンバスはありません",
    "paperCount": "現在のキャンバス / 開いているキャンバス",
    "zoomOut": "縮小",
    "zoomIn": "拡大",
    "canvasZoom": "キャンバスの拡大率",
    "actualPixels": "実際のピクセル",
    "fitScreen": "画面に合わせる",
    "fit": "全体表示",
    "rotateViewLeft": "表示を反時計回りに回転",
    "rotateViewRight": "表示を時計回りに回転",
    "flipViewHoriz": "表示を左右反転",
    "flipViewVert": "表示を上下反転",
    "resetOrientation": "表示方向をリセット",
    "viewOrientation": "表示方向",
    "rotate": "回転",
    "angleDegrees": "表示の回転角度",
    "flipHViewOnly": "左右反転（表示のみ）",
    "flipVViewOnly": "上下反転（表示のみ）",
    "resetCanvasView": "キャンバス表示方向をリセット"
  },
  "ko": {
    "brush": "브러시",
    "settingsPresets": "설정 및 프리셋",
    "brushSettingsPanel": "브러시 설정 패널",
    "studioSidePanels": "Studio 측면 패널",
    "canvasView": "캔버스 보기",
    "rotateLeft": "보기를 반시계 방향으로 90° 회전",
    "rotateRight": "보기를 시계 방향으로 90° 회전",
    "flipH": "가로 뒤집기",
    "flipV": "세로 뒤집기",
    "reset": "초기화",
    "rotation": "회전 각도",
    "canvasRotation": "캔버스 보기 회전",
    "viewOnlyHelp": "회전 및 뒤집기는 화면 보기에만 적용됩니다. 저장한 그림이나 내보낸 이미지는 변경되지 않습니다.",
    "statusControls": "Studio 상태 및 캔버스 컨트롤",
    "documentInfo": "현재 문서 정보",
    "currentPaper": "현재 캔버스",
    "noPaper": "열린 캔버스 없음",
    "paperCount": "현재 캔버스 / 열린 캔버스",
    "zoomOut": "축소",
    "zoomIn": "확대",
    "canvasZoom": "캔버스 확대/축소",
    "actualPixels": "실제 픽셀",
    "fitScreen": "화면에 맞추기",
    "fit": "맞춤",
    "rotateViewLeft": "보기 반시계 방향 회전",
    "rotateViewRight": "보기 시계 방향 회전",
    "flipViewHoriz": "보기 가로 뒤집기",
    "flipViewVert": "보기 세로 뒤집기",
    "resetOrientation": "보기 방향 초기화",
    "viewOrientation": "보기 방향",
    "rotate": "회전",
    "angleDegrees": "보기 회전 각도",
    "flipHViewOnly": "가로 뒤집기(보기만)",
    "flipVViewOnly": "세로 뒤집기(보기만)",
    "resetCanvasView": "캔버스 보기 방향 초기화"
  }
})

export function StudioToolRail({ tool, onToolChange, labels }) {
  const { t: tx } = useDisplayTranslation()
  return (
    <div className="ss-left-workspace">
      <style>{`
        .shadow-studio .ss-left-workspace{min-width:0;min-height:0}
        .shadow-studio .ss-brush-dock{display:none}
        @media(min-width:1101px) and (min-height:651px){
          .shadow-studio:has(.ss-layout) .ss-layout{grid-template-columns:284px minmax(0,1fr) 282px}
          .shadow-studio:has(.ss-layout) .ss-left-workspace{display:grid;grid-template-columns:78px minmax(0,1fr);height:100%;overflow:hidden;background:#293039;border-right:1px solid #45515e}
          .shadow-studio:has(.ss-layout) .ss-left-workspace>.ss-tools{width:78px;height:100%;min-height:0;overflow-x:hidden;overflow-y:auto;padding:10px 6px 60px;border-right:1px solid #445260;background:#27303a;box-sizing:border-box}
          .shadow-studio:has(.ss-layout) .ss-brush-dock{display:block;min-width:0;min-height:0;height:100%;overflow-y:auto;overflow-x:hidden;background:#2a323c;scrollbar-width:thin;scrollbar-color:#586b7e #27303a}
          .shadow-studio:has(.ss-layout) .ss-brush-dock-title{position:sticky;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:5px;min-height:39px;padding:0 12px;border-bottom:1px solid #495560;background:#303a45;color:#eff5fb;font-size:12px;font-weight:800}
          .shadow-studio:has(.ss-layout) .ss-brush-dock-title small{font-size:9px;font-weight:500;color:#a5b5c7}
          .shadow-studio:has(.ss-layout) .ss-brush-dock>.ss-section{margin:0;padding:13px 11px;border:0;border-bottom:1px solid #485563}
          .shadow-studio:has(.ss-layout) .ss-brush-dock .ss-label{margin-bottom:10px;color:#e5edf5;font-size:11px}
          .shadow-studio:has(.ss-layout) .ss-brush-dock .ss-brush-styles{grid-template-columns:repeat(2,minmax(0,1fr))}
          .shadow-studio:has(.ss-layout) .ss-brush-dock .ss-brush-style{min-height:42px}
          .shadow-studio:has(.ss-layout) .ss-brush-dock .ss-brush-presets{grid-template-columns:repeat(2,minmax(0,1fr))}
          .shadow-studio:has(.ss-layout) .ss-brush-dock .ss-brush-preset{min-height:69px}
          .shadow-studio:has(.ss-layout) .ss-brush-dock .ss-brush-mobile{display:none}
          .shadow-studio:has(.ss-layout)>.ss-tabs{padding-left:284px}
          .shadow-studio:has(.ss-layout) .ss-bottom{padding-left:296px}
        }
        @media(max-width:1100px), (max-height:650px){
          .shadow-studio .ss-left-workspace{display:contents}
          .shadow-studio .ss-brush-dock{display:none}
        }
      `}</style>
      <StudioToolPalette tool={tool} onToolChange={onToolChange} labels={labels} />
      <aside className="ss-brush-dock" id="ss-brush-dock-root" aria-label={tx('studioWorkspace.brushSettingsPanel')}>
        <div className="ss-brush-dock-title"><span>{tx('studioWorkspace.brush')}</span><small>{tx('studioWorkspace.settingsPresets')}</small></div>
      </aside>
    </div>
  )
}

export function StudioControlSidebar({
  color,
  onColorChange,
  brushStyle,
  onBrushStyleChange,
  size,
  onSizeChange,
  opacity,
  onOpacityChange,
  viewRotation,
  flipHorizontal,
  flipVertical,
  onViewChange,
  paperLoading,
  projectBusy,
  onClear,
  navigator,
  labels,
}) {
  const { t: tx } = useDisplayTranslation()
  const [brushDock, setBrushDock] = useState(null)

  useEffect(() => {
    const media = window.matchMedia('(min-width:1101px) and (min-height:651px)')
    const sync = () => setBrushDock(media.matches ? document.getElementById('ss-brush-dock-root') : null)
    sync()
    media.addEventListener?.('change', sync)
    return () => media.removeEventListener?.('change', sync)
  }, [])

  const brushControls = (
    <StudioBrushSettings
      size={size}
      onSizeChange={onSizeChange}
      style={brushStyle}
      onStyleChange={onBrushStyleChange}
      opacity={opacity}
      onOpacityChange={onOpacityChange}
      labels={labels}
    />
  )

  return (
    <aside className="ss-side" aria-label={tx('studioWorkspace.studioSidePanels')}>
      <StudioColorPanel color={color} label={labels.color} onChange={onColorChange} />
      <StudioRightPanels />
      {brushDock ? createPortal(brushControls, brushDock) : brushControls}
      <section className="ss-section" aria-label="Canvas view">
        <h2 className="ss-label">{tx('studioWorkspace.canvasView')}</h2>
        <div className="ss-view-buttons">
          <button type="button" className="ss-view-btn" title={tx('studioWorkspace.rotateLeft')} onClick={() => onViewChange(viewRotation - 90)} disabled={paperLoading || projectBusy}>↶ 90°</button>
          <button type="button" className="ss-view-btn" title={tx('studioWorkspace.rotateRight')} onClick={() => onViewChange(viewRotation + 90)} disabled={paperLoading || projectBusy}>↷ 90°</button>
        </div>
        <div className="ss-view-buttons" style={{ marginTop: 6 }}>
          <button type="button" className={`ss-view-btn ${flipHorizontal ? 'active' : ''}`} onClick={() => onViewChange(viewRotation, !flipHorizontal, flipVertical)} disabled={paperLoading || projectBusy}>{tx('studioWorkspace.flipH')}</button>
          <button type="button" className={`ss-view-btn ${flipVertical ? 'active' : ''}`} onClick={() => onViewChange(viewRotation, flipHorizontal, !flipVertical)} disabled={paperLoading || projectBusy}>{tx('studioWorkspace.flipV')}</button>
          <button type="button" className="ss-view-btn" onClick={() => onViewChange(0, false, false)} disabled={paperLoading || projectBusy}>{tx('studioWorkspace.reset')}</button>
        </div>
        <div className="ss-view-angle">{tx('studioWorkspace.rotation')}: {viewRotation}°</div>
        <div className="ss-range">
          <input type="range" min="-180" max="180" step="1" value={viewRotation} aria-label={tx('studioWorkspace.canvasRotation')} onChange={(event) => onViewChange(Number(event.target.value))} disabled={paperLoading || projectBusy} />
        </div>
        <p className="ss-view-help">{tx('studioWorkspace.viewOnlyHelp')}</p>
      </section>
      {navigator}
      <section className="ss-section">
        <button type="button" className="ss-btn" onClick={onClear}>{labels.clear}</button>
      </section>
    </aside>
  )
}

export function StudioControlFooter({
  paper,
  paperIndex = 0,
  paperCount = 0,
  size,
  onSizeChange,
  opacity,
  onOpacityChange,
  zoom,
  onZoom,
  onFit,
  viewRotation,
  flipHorizontal,
  flipVertical,
  onViewChange,
  labels,
}) {
  const { t: tx } = useDisplayTranslation()
  const clamp = (value, min, max) => Math.min(max, Math.max(min, Math.round(Number(value) || 0)))

  return (
    <footer className="ss-bottom" aria-label={tx('studioWorkspace.statusControls')}>
      <style>{`
        .shadow-studio .ss-footer-inner{width:100%;min-width:0}
        .shadow-studio .ss-footer-meta{display:none}
        .shadow-studio .ss-footer-view{display:none}
        .shadow-studio .ss-footer-control{min-width:0}
        .shadow-studio .ss-footer-control input[type=range]{accent-color:#88bffe}
        .shadow-studio .ss-footer-control input[type=range]:focus-visible,.shadow-studio .ss-footer-view button:focus-visible{outline:2px solid #88bffe;outline-offset:2px}
        @media(min-width:1101px) and (min-height:651px){
          .shadow-studio:has(.ss-layout) .ss-bottom{left:0;right:0;height:48px;min-height:48px;padding:0 10px;display:flex;align-items:center;overflow:hidden;background:#26303a;border-top:1px solid #52606e;box-shadow:0 -2px 8px #10151a66}
          .shadow-studio:has(.ss-layout) .ss-footer-inner{display:flex;align-items:center;height:100%;gap:0;overflow-x:auto;overflow-y:hidden;scrollbar-width:thin;scrollbar-color:#5b6c7c #26303a}
          .shadow-studio:has(.ss-layout) .ss-footer-meta{display:flex;align-items:center;flex:0 0 275px;min-width:0;max-width:275px;height:30px;gap:9px;padding:0 11px 0 5px;margin-right:6px;border-right:1px solid #465360;white-space:nowrap;color:#c2cedb;font-size:10px}
          .shadow-studio:has(.ss-layout) .ss-footer-meta strong{max-width:188px;overflow:hidden;text-overflow:ellipsis;font-weight:700;color:#e5ebf1}
          .shadow-studio:has(.ss-layout) .ss-footer-meta span{margin-left:auto;color:#a4b2bf;font-weight:800}
          .shadow-studio:has(.ss-layout) .ss-controls{width:auto;min-width:0;display:flex;flex:1 0 auto;align-items:center;gap:0;overflow:visible}
          .shadow-studio:has(.ss-layout) .ss-control{flex:0 0 181px;width:181px;min-width:0;height:30px;display:flex;align-items:center;gap:6px;padding:0 10px;border-right:1px solid #465360}
          .shadow-studio:has(.ss-layout) .ss-control label{flex:0 0 auto;display:inline;color:#c7d2dc;font-size:10px;font-weight:700;white-space:nowrap}
          .shadow-studio:has(.ss-layout) .ss-control input[type=range]{flex:1 1 auto;min-width:26px;width:auto;max-width:85px;margin:0;cursor:pointer}
          .shadow-studio:has(.ss-layout) .ss-value{flex:0 0 auto;width:auto;min-width:31px;font-size:10px;font-variant-numeric:tabular-nums;color:#e0eaf4;text-align:right}
          .shadow-studio:has(.ss-layout) .ss-control.ss-zoom-control{flex:0 0 300px;width:300px;min-width:0;gap:5px}
          .shadow-studio:has(.ss-layout) .ss-zoom-control input[type=range]{max-width:72px}
          .shadow-studio:has(.ss-layout) .ss-zoom-control>.ss-zoom-btn.ss-view-only-control{display:none}
          .shadow-studio:has(.ss-layout) .ss-zoom-btn{width:25px;min-width:25px;height:27px;display:grid;place-items:center;padding:0;border:1px solid #536272;border-radius:5px;background:#344250;color:#e7f0f9;font:inherit;font-size:12px;font-weight:800;cursor:pointer}
          .shadow-studio:has(.ss-layout) .ss-zoom-btn:hover:not(:disabled){background:#45617d}
          .shadow-studio:has(.ss-layout) .ss-zoom-label{width:auto;min-width:31px;padding:0 5px;font-size:10px}
          .shadow-studio:has(.ss-layout) .ss-footer-view{display:flex;flex:0 0 auto;align-items:center;gap:6px;height:30px;padding:0 8px 0 12px}
          .shadow-studio:has(.ss-layout) .ss-footer-view label{color:#c7d2dc;font-size:10px;font-weight:700;white-space:nowrap}
          .shadow-studio:has(.ss-layout) .ss-footer-angle{width:48px;height:27px;padding:0 3px;border:1px solid #536272;border-radius:5px;background:#2c3742;color:#e5edf5;text-align:center;font:inherit;font-size:11px;font-variant-numeric:tabular-nums}
          .shadow-studio:has(.ss-layout) .ss-footer-view button{width:auto;min-width:28px;height:27px;padding:0 6px;border:1px solid #536272;border-radius:5px;background:#344250;color:#e7f0f9;font:inherit;font-size:10px;font-weight:700;cursor:pointer}
          .shadow-studio:has(.ss-layout) .ss-footer-view button[aria-pressed=true]{border-color:#75baff;background:#3b638b}
          .shadow-studio:has(.ss-layout) .ss-footer-view button:hover{background:#45617d}
          .shadow-studio:has(.ss-layout) .ss-footer-view .ss-footer-reset{min-width:45px}
          .shadow-studio:has(.ss-layout) .ss-bottom button:disabled{opacity:.4;cursor:default}
        }
      `}</style>
      <div className="ss-footer-inner">
        <div className="ss-footer-meta" aria-label={tx('studioWorkspace.documentInfo')}>
          <strong title={paper?.name || tx('studioWorkspace.currentPaper')}>{paper ? `${paper.width} × ${paper.height}px · ${paper.resolution} PPI` : tx('studioWorkspace.noPaper')}</strong>
          {paperCount > 0 ? <span title={tx('studioWorkspace.paperCount')}>{paperIndex}/{paperCount}</span> : null}
        </div>
        <div className="ss-controls">
          <div className="ss-control ss-footer-control">
            <label htmlFor="ss-footer-brush-size">{labels.size}</label>
            <input id="ss-footer-brush-size" type="range" min="1" max="80" step="1" value={size} onChange={(event) => onSizeChange(Number(event.target.value))} />
            <span className="ss-value">{size}px</span>
          </div>
          <div className="ss-control ss-footer-control">
            <label htmlFor="ss-footer-opacity">{labels.opacity}</label>
            <input id="ss-footer-opacity" type="range" min="10" max="100" step="1" value={opacity} onChange={(event) => onOpacityChange(Number(event.target.value))} />
            <span className="ss-value">{opacity}%</span>
          </div>
          <div className="ss-control ss-zoom-control ss-footer-control">
            <label htmlFor="ss-footer-zoom">{labels.zoom}</label>
            <button type="button" className="ss-zoom-btn" title={tx('studioWorkspace.zoomOut')} aria-label={tx('studioWorkspace.zoomOut')} onClick={() => onZoom(zoom / 1.2)} disabled={zoom <= 10}>−</button>
            <input id="ss-footer-zoom" type="range" min="10" max="400" step="1" value={zoom} aria-label={tx('studioWorkspace.canvasZoom')} onChange={(event) => onZoom(Number(event.target.value))} />
            <button type="button" className="ss-zoom-btn" title={tx('studioWorkspace.zoomIn')} aria-label={tx('studioWorkspace.zoomIn')} onClick={() => onZoom(zoom * 1.2)} disabled={zoom >= 400}>+</button>
            <span className="ss-value">{zoom}%</span>
            <button type="button" className="ss-zoom-btn ss-zoom-label" onClick={() => onZoom(100)} title={tx('studioWorkspace.actualPixels')}>100%</button>
            <button type="button" className="ss-zoom-btn ss-zoom-label" onClick={onFit} title={tx('studioWorkspace.fitScreen')}>{tx('studioWorkspace.fit')}</button>
            <button type="button" className="ss-zoom-btn ss-zoom-label ss-view-only-control" title={tx('studioWorkspace.rotateViewLeft')} aria-label={tx('studioWorkspace.rotateViewLeft')} onClick={() => onViewChange(viewRotation - 90)}>↶</button>
            <button type="button" className="ss-zoom-btn ss-zoom-label ss-view-only-control" title={tx('studioWorkspace.rotateViewRight')} aria-label={tx('studioWorkspace.rotateViewRight')} onClick={() => onViewChange(viewRotation + 90)}>↷</button>
            <button type="button" className="ss-zoom-btn ss-zoom-label ss-view-only-control" title={tx('studioWorkspace.flipViewHoriz')} aria-label={tx('studioWorkspace.flipViewHoriz')} aria-pressed={flipHorizontal} onClick={() => onViewChange(viewRotation, !flipHorizontal, flipVertical)}>⇋</button>
            <button type="button" className="ss-zoom-btn ss-zoom-label ss-view-only-control" title={tx('studioWorkspace.resetOrientation')} aria-label={tx('studioWorkspace.resetOrientation')} onClick={() => onViewChange(0, false, false)}>0°</button>
          </div>
        </div>
        <div className="ss-footer-view" aria-label={tx('studioWorkspace.viewOrientation')}>
          <label htmlFor="ss-footer-angle">{tx('studioWorkspace.rotate')}</label>
          <input id="ss-footer-angle" className="ss-footer-angle" type="number" step="1" min="-180" max="180" value={viewRotation} onChange={(event) => { if (event.target.value !== '') onViewChange(clamp(event.target.value, -180, 180)) }} aria-label={tx('studioWorkspace.angleDegrees')} />
          <span className="ss-value">°</span>
          <button type="button" aria-label={tx('studioWorkspace.flipViewHoriz')} title={tx('studioWorkspace.flipHViewOnly')} aria-pressed={flipHorizontal} onClick={() => onViewChange(viewRotation, !flipHorizontal, flipVertical)}>⇋</button>
          <button type="button" aria-label={tx('studioWorkspace.flipViewVert')} title={tx('studioWorkspace.flipVViewOnly')} aria-pressed={flipVertical} onClick={() => onViewChange(viewRotation, flipHorizontal, !flipVertical)}>⇅</button>
          <button type="button" className="ss-footer-reset" title={tx('studioWorkspace.resetCanvasView')} onClick={() => onViewChange(0, false, false)}>{tx('studioWorkspace.reset')}</button>
        </div>
      </div>
    </footer>
  )
}
