function Button({ id, label, active, disabled, onCommand, value = true }) {
  return <button type="button" className={`sd-ribbon-button ${active ? 'is-active' : ''}`} aria-pressed={active || undefined} disabled={disabled} onClick={() => onCommand?.(id, value)}>{label}</button>
}

export default function ShadowDocsRibbonDrawTab({ state = {}, onCommand, disabled = false }) {
  return <div className="sd-ribbon-groups" role="tabpanel" aria-label="Draw">
    <div className="sd-ribbon-group">
      <div className="sd-ribbon-row">
        <Button id="pen" label="Pen" active={state.drawTool === 'pen'} disabled={disabled} onCommand={onCommand} />
        <Button id="pencil" label="Pencil" active={state.drawTool === 'pencil'} disabled={disabled} onCommand={onCommand} />
        <Button id="highlighter" label="Highlighter" active={state.drawTool === 'highlighter'} disabled={disabled} onCommand={onCommand} />
        <Button id="eraser" label="Eraser" active={state.drawTool === 'eraser'} disabled={disabled} onCommand={onCommand} />
        <Button id="lasso" label="Lasso Select" active={state.drawTool === 'lasso'} disabled={disabled} onCommand={onCommand} />
        <label className="sd-ribbon-color-control">Ink Color<input type="color" value={state.inkColor || '#111111'} disabled={disabled} onChange={event => onCommand?.('inkColor', event.target.value)} /></label>
        <label className="sd-ribbon-number-control">Thickness<input type="number" min="1" max="24" value={state.inkThickness || 2} disabled={disabled} onChange={event => onCommand?.('inkThickness', Number(event.target.value))} /></label>
        <Button id="drawWithTouch" label="Draw with Touch" active={state.drawWithTouch} disabled={disabled} onCommand={onCommand} value={!state.drawWithTouch} />
        <Button id="inkToShape" label="Ink to Shape" disabled={disabled} onCommand={onCommand} />
        <Button id="inkToText" label="Ink to Text" disabled={disabled} onCommand={onCommand} />
        <Button id="inkToMath" label="Ink to Math" disabled={disabled} onCommand={onCommand} />
      </div>
      <span className="sd-ribbon-group-label">Ink</span>
    </div>
  </div>
}
