import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import StudioColorPanel from './StudioColorPanel'
import StudioBrushSettings from './StudioBrushSettings'
import StudioRightPanels from './StudioRightPanels'
import StudioToolPalette from './StudioToolPalette'

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
      <StudioRightPanels />
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
  const clamp = (value, min, max) => Math.min(max, Math.max(min, Math.round(Number(value) || 0)))

  return (
    <footer className="ss-bottom" aria-label="Studio status and canvas controls">
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
          .shadow-studio:has(.ss-layout) .ss-zoom-control>.ss-zoom-btn[aria-label^='Rotate'],.shadow-studio:has(.ss-layout) .ss-zoom-control>.ss-zoom-btn[aria-label^='Flip'],.shadow-studio:has(.ss-layout) .ss-zoom-control>.ss-zoom-btn[aria-label^='Reset']{display:none}
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
        <div className="ss-footer-meta" aria-label="Current document information">
          <strong title={paper?.name || 'Current paper'}>{paper ? `${paper.width} × ${paper.height}px · ${paper.resolution} PPI` : 'No open paper'}</strong>
          {paperCount > 0 ? <span title="Current paper / open papers">{paperIndex}/{paperCount}</span> : null}
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
            <button type="button" className="ss-zoom-btn" title="Zoom out" aria-label="Zoom out" onClick={() => onZoom(zoom / 1.2)} disabled={zoom <= 10}>−</button>
            <input id="ss-footer-zoom" type="range" min="10" max="400" step="1" value={zoom} aria-label="Canvas zoom" onChange={(event) => onZoom(Number(event.target.value))} />
            <button type="button" className="ss-zoom-btn" title="Zoom in" aria-label="Zoom in" onClick={() => onZoom(zoom * 1.2)} disabled={zoom >= 400}>+</button>
            <span className="ss-value">{zoom}%</span>
            <button type="button" className="ss-zoom-btn ss-zoom-label" onClick={() => onZoom(100)} title="Actual pixels">100%</button>
            <button type="button" className="ss-zoom-btn ss-zoom-label" onClick={onFit} title="Fit paper to screen">Fit</button>
            <button type="button" className="ss-zoom-btn ss-zoom-label" title="Rotate view counterclockwise" aria-label="Rotate view counterclockwise" onClick={() => onViewChange(viewRotation - 90)}>↶</button>
            <button type="button" className="ss-zoom-btn ss-zoom-label" title="Rotate view clockwise" aria-label="Rotate view clockwise" onClick={() => onViewChange(viewRotation + 90)}>↷</button>
            <button type="button" className="ss-zoom-btn ss-zoom-label" title="Flip view horizontally" aria-label="Flip view horizontally" aria-pressed={flipHorizontal} onClick={() => onViewChange(viewRotation, !flipHorizontal, flipVertical)}>⇋</button>
            <button type="button" className="ss-zoom-btn ss-zoom-label" title="Reset view orientation" aria-label="Reset view orientation" onClick={() => onViewChange(0, false, false)}>0°</button>
          </div>
        </div>
        <div className="ss-footer-view" aria-label="View orientation">
          <label htmlFor="ss-footer-angle">Rotate</label>
          <input id="ss-footer-angle" className="ss-footer-angle" type="number" step="1" min="-180" max="180" value={viewRotation} onChange={(event) => { if (event.target.value !== '') onViewChange(clamp(event.target.value, -180, 180)) }} aria-label="View rotation in degrees" />
          <span className="ss-value">°</span>
          <button type="button" aria-label="Flip canvas view horizontally" title="Flip horizontal (view only)" aria-pressed={flipHorizontal} onClick={() => onViewChange(viewRotation, !flipHorizontal, flipVertical)}>⇋</button>
          <button type="button" aria-label="Flip canvas view vertically" title="Flip vertical (view only)" aria-pressed={flipVertical} onClick={() => onViewChange(viewRotation, flipHorizontal, !flipVertical)}>⇅</button>
          <button type="button" className="ss-footer-reset" title="Reset canvas view orientation" onClick={() => onViewChange(0, false, false)}>Reset</button>
        </div>
      </div>
    </footer>
  )
}
