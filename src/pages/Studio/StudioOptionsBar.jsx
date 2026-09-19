export default function StudioOptionsBar({
  tool, paper, size, opacity, showGrid, busy, canUndo, canRedo,
  onSizeChange, onOpacityChange, onToggleGrid, onUndo, onRedo,
  onFit, onNew, onSave, onExport,
}) {
  const toolName = { brush: 'Brush', eraser: 'Eraser', eyedropper: 'Eyedropper' }[tool] || 'Tool'
  return (
    <div className="ss-options-bar" role="toolbar" aria-label="Shadow Studio tool options">
      <style>{`
        .shadow-studio .ss-options-bar{display:flex;align-items:center;gap:9px;flex:0 0 42px;min-height:42px;width:100%;min-width:0;box-sizing:border-box;padding:4px 12px;border-bottom:1px solid #47515d;background:#303943;color:#d7e2ef;overflow-x:auto;overflow-y:hidden;scrollbar-width:thin;white-space:nowrap}
        .shadow-studio .ss-options-bar .ss-opt-title{display:flex;align-items:center;gap:8px;min-width:115px;max-width:190px;font-size:11px;font-weight:800}
        .shadow-studio .ss-options-bar .ss-opt-title i{color:#8fc4f7;font-size:14px}
        .shadow-studio .ss-options-bar .ss-opt-title span{overflow:hidden;text-overflow:ellipsis}
        .shadow-studio .ss-options-bar .ss-opt-separator{height:23px;width:1px;flex:none;background:#536171}
        .shadow-studio .ss-options-bar .ss-opt-range{display:flex;align-items:center;gap:6px;font-size:10px;font-weight:700;color:#c7d5e4}
        .shadow-studio .ss-options-bar .ss-opt-range input{width:82px;min-width:82px;height:18px;accent-color:#80baff;cursor:pointer}
        .shadow-studio .ss-options-bar .ss-opt-range output{width:36px;text-align:right;font-variant-numeric:tabular-nums}
        .shadow-studio .ss-options-bar button{height:29px;min-width:29px;display:inline-flex;align-items:center;justify-content:center;gap:6px;border:1px solid #526274;border-radius:5px;padding:0 9px;background:#394755;color:#e4edf7;font:inherit;font-size:11px;font-weight:700;cursor:pointer}
        .shadow-studio .ss-options-bar button:hover:not(:disabled){background:#506783;border-color:#759ac0}
        .shadow-studio .ss-options-bar button:focus-visible{outline:2px solid #86bfff;outline-offset:2px}
        .shadow-studio .ss-options-bar button:disabled{opacity:.4;cursor:default}
        .shadow-studio .ss-options-bar button[aria-pressed=true]{border-color:#89c0ff;background:#3e668d;color:#fff}
        .shadow-studio .ss-options-bar .ss-opt-spacer{flex:1 0 5px}
        .shadow-studio .ss-options-bar .ss-opt-primary{background:#326aa0;border-color:#5f9cd3;color:#fff}
        @media(max-width:700px){.shadow-studio .ss-options-bar{padding:4px 8px;gap:7px}.shadow-studio .ss-options-bar .ss-opt-title{min-width:65px}.shadow-studio .ss-options-bar .ss-opt-range input{width:60px;min-width:60px}}
      `}</style>
      <div className="ss-opt-title" title={paper?.name || toolName}>
        <i className={`fa-solid ${tool === 'eraser' ? 'fa-eraser' : tool === 'eyedropper' ? 'fa-eye-dropper' : 'fa-paintbrush'}`} aria-hidden="true" />
        <span>{toolName} options</span>
      </div>
      <span className="ss-opt-separator" aria-hidden="true" />
      <label className="ss-opt-range">Size <input aria-label="Brush size" type="range" min="1" max="80" step="1" value={size} disabled={busy} onChange={(event) => onSizeChange(Number(event.target.value))} /><output>{size}px</output></label>
      <label className="ss-opt-range">Opacity <input aria-label="Brush opacity" type="range" min="10" max="100" step="1" value={opacity} disabled={busy} onChange={(event) => onOpacityChange(Number(event.target.value))} /><output>{opacity}%</output></label>
      <span className="ss-opt-separator" aria-hidden="true" />
      <button type="button" aria-pressed={showGrid} disabled={busy} onClick={onToggleGrid} title="Show or hide grid"><i className="fa-solid fa-border-all" aria-hidden="true" /> Grid</button>
      <button type="button" disabled={busy} onClick={onFit} title="Fit paper to workspace"><i className="fa-solid fa-expand" aria-hidden="true" /> Fit</button>
      <button type="button" disabled={busy || !canUndo} onClick={onUndo} title="Undo" aria-label="Undo"><i className="fa-solid fa-rotate-left" aria-hidden="true" /></button>
      <button type="button" disabled={busy || !canRedo} onClick={onRedo} title="Redo" aria-label="Redo"><i className="fa-solid fa-rotate-right" aria-hidden="true" /></button>
      <span className="ss-opt-spacer" aria-hidden="true" />
      <button type="button" disabled={busy} onClick={onNew} title="New paper"><i className="fa-solid fa-file-circle-plus" aria-hidden="true" /> New</button>
      <button type="button" disabled={busy} onClick={onSave} title="Save Studio project"><i className="fa-solid fa-floppy-disk" aria-hidden="true" /> Save</button>
      <button type="button" className="ss-opt-primary" disabled={busy} onClick={onExport} title="Export image"><i className="fa-solid fa-arrow-up-from-bracket" aria-hidden="true" /> Export</button>
    </div>
  )
}
