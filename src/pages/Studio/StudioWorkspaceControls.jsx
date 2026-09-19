import StudioColorPanel from './StudioColorPanel'
import StudioBrushSettings from './StudioBrushSettings'

function Tool({ active, icon, label, onClick }) {
  return (
    <button
      type="button"
      className={`ss-tool ${active ? 'active' : ''}`}
      onClick={onClick}
      title={label}
      aria-label={label}
    >
      <i className={icon} />
      <span>{label}</span>
    </button>
  )
}

export function StudioToolRail({ tool, onToolChange, labels }) {
  return (
    <aside className="ss-tools">
      <Tool
        active={tool === 'brush'}
        icon="fa-solid fa-paintbrush"
        label={labels.brush}
        onClick={() => onToolChange('brush')}
      />
      <Tool
        active={tool === 'eraser'}
        icon="fa-solid fa-eraser"
        label={labels.eraser}
        onClick={() => onToolChange('eraser')}
      />
      <Tool
        active={tool === 'eyedropper'}
        icon="fa-solid fa-eye-dropper"
        label={labels.eyedropper}
        onClick={() => onToolChange('eyedropper')}
      />
    </aside>
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
  return (
    <aside className="ss-side">
      <StudioColorPanel color={color} label={labels.color} onChange={onColorChange} />

      <StudioBrushSettings
        size={size}
        onSizeChange={onSizeChange}
        style={brushStyle}
        onStyleChange={onBrushStyleChange}
        opacity={opacity}
        onOpacityChange={onOpacityChange}
        labels={labels}
      />

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
        <button
          type="button"
          className="ss-btn"
          onClick={onClear}
        >
          {labels.clear}
        </button>
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
          <label>
            {labels.size}
          </label>
          <input
            type="range"
            min="1"
            max="80"
            value={size}
            onChange={(event) =>
              onSizeChange(Number(event.target.value))
            }
          />
          <span className="ss-value">
            {size}px
          </span>
        </div>

        <div className="ss-control">
          <label>
            {labels.opacity}
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={opacity}
            onChange={(event) =>
              onOpacityChange(
                Number(event.target.value)
              )
            }
          />
          <span className="ss-value">
            {opacity}%
          </span>
        </div>

        <div className="ss-control ss-zoom-control">
          <label>{labels.zoom}</label>
          <button type="button" className="ss-zoom-btn" title="Zoom out" aria-label="Zoom out" onClick={() => onZoom(zoom / 1.2)} disabled={zoom <= 10}>−</button>
          <input
            type="range"
            min="10"
            max="400"
            step="1"
            value={zoom}
            aria-label="Canvas zoom"
            onChange={(event) => onZoom(Number(event.target.value))}
          />
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
