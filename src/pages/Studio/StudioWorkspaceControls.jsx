import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import StudioColorPanel from './StudioColorPanel'
import StudioBrushSettings from './StudioBrushSettings'

function Tool({ active, icon, label, onClick }) {
  return (
    <button type="button" className={`ss-tool ${active ? 'active' : ''}`} onClick={onClick} title={label} aria-label={label} aria-pressed={active}>
      <i className={icon} />
      <span>{label}</span>
    </button>
  )
}

export function StudioToolRail({ tool, onToolChange, labels }) {
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
      <aside className="ss-tools" aria-label="Drawing tools">
        <Tool active={tool === 'brush'} icon="fa-solid fa-paintbrush" label={labels.brush} onClick={() => onToolChange('brush')} />
        <Tool active={tool === 'eraser'} icon="fa-solid fa-eraser" label={labels.eraser} onClick={() => onToolChange('eraser')} />
        <Tool active={tool === 'eyedropper'} icon="fa-solid fa-eye-dropper" label={labels.eyedropper} onClick={() => onToolChange('eyedropper')} />
      </aside>
      <aside className="ss-brush-dock" id="ss-brush-dock-root" aria-label="Brush settings panel">
        <div className="ss-brush-dock-title"><span>Brush</span><small>Settings &amp; presets</small></div>
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
    <aside className="ss-side" aria-label="Studio side panels">
      <StudioColorPanel color={color} label={labels.color} onChange={onColorChange} />
      {brushDock ? createPortal(brushControls, brushDock) : brushControls}
      <section className="ss-section" aria-label="Canvas view">
        <h2 className="ss-label">Canvas View</h2>
        <div className="ss-view-buttons">
          <button type="button" className="ss-view-btn" title="Rotate view 90° counterclockwise" onClick={() => onViewChange(viewRotation - 90)} disabled={paperLoading || projectBusy}>↶ 90°</button>
          <button type="button" className="ss-view-btn" title="Rotate view 90° clockwise" onClick={() => onViewChange(viewRotation + 90)} disabled={paperLoading || projectBusy}>↷ 90°</button>
        </div>
        <div className="ss-view-buttons" style={{ marginTop: 6 }}>
          <button type="button" className={`ss-view-btn ${flipHorizontal ? 'active' : ''}`} onClick={() => onViewChange(viewRotation, !flipHorizontal, flipVertical)} disabled={paperLoading || projectBusy}>Flip H</button>
          <button type="button" className={`ss-view-btn ${flipVertical ? 'active' : ''}`} onClick={() => onViewChange(viewRotation, flipHorizontal, !flipVertical)} disabled={paperLoading || projectBusy}>Flip V</button>
          <button type="button" className="ss-view-btn" onClick={() => onViewChange(0, false, false)} disabled={paperLoading || projectBusy}>Reset</button>
        </div>
        <div className="ss-view-angle">Rotation: {viewRotation}°</div>
        <div className="ss-range">
          <input type="range" min="-180" max="180" step="1" value={viewRotation} aria-label="Canvas rotation" onChange={(event) => onViewChange(Number(event.target.value))} disabled={paperLoading || projectBusy} />
        </div>
        <p className="ss-view-help">View-only rotation and flip. Your saved drawing and export are not transformed.</p>
      </section>
      {navigator}
      <section className="ss-section">
        <button type="button" className="ss-btn" onClick={onClear}>{labels.clear}</button>
      </section>
    </aside>
  )
}

export function StudioControlFooter({
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
  return (
    <footer className="ss-bottom">
      <div className="ss-controls">
        <div className="ss-control">
          <label>{labels.size}</label>
          <input type="range" min="1" max="80" value={size} onChange={(event) => onSizeChange(Number(event.target.value))} />
          <span className="ss-value">{size}px</span>
        </div>
        <div className="ss-control">
          <label>{labels.opacity}</label>
          <input type="range" min="10" max="100" value={opacity} onChange={(event) => onOpacityChange(Number(event.target.value))} />
          <span className="ss-value">{opacity}%</span>
        </div>
        <div className="ss-control ss-zoom-control">
          <label>{labels.zoom}</label>
          <button type="button" className="ss-zoom-btn" title="Zoom out" aria-label="Zoom out" onClick={() => onZoom(zoom / 1.2)} disabled={zoom <= 10}>−</button>
          <input type="range" min="10" max="400" step="1" value={zoom} aria-label="Canvas zoom" onChange={(event) => onZoom(Number(event.target.value))} />
          <button type="button" className="ss-zoom-btn" title="Zoom in" aria-label="Zoom in" onClick={() => onZoom(zoom * 1.2)} disabled={zoom >= 400}>+</button>
          <span className="ss-value">{zoom}%</span>
          <button type="button" className="ss-zoom-btn ss-zoom-label" onClick={() => onZoom(100)}>100%</button>
          <button type="button" className="ss-zoom-btn ss-zoom-label" onClick={onFit}>Fit</button>
          <button type="button" className="ss-zoom-btn" title="Rotate view counterclockwise" aria-label="Rotate view counterclockwise" onClick={() => onViewChange(viewRotation - 90)}>↶</button>
          <button type="button" className="ss-zoom-btn" title="Rotate view clockwise" aria-label="Rotate view clockwise" onClick={() => onViewChange(viewRotation + 90)}>↷</button>
          <button type="button" className="ss-zoom-btn" title="Flip view horizontally" aria-label="Flip view horizontally" onClick={() => onViewChange(viewRotation, !flipHorizontal, flipVertical)}>⇋</button>
          <button type="button" className="ss-zoom-btn" title="Reset view orientation" aria-label="Reset view orientation" onClick={() => onViewChange(0, false, false)}>0°</button>
        </div>
      </div>
    </footer>
  )
}
