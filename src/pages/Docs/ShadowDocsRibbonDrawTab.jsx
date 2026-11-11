function Button({ id, label, active = false, disabled = false, onCommand, value = true, title }) {
  return <button
    type="button"
    className={`sd-ribbon-button ${active ? 'is-active' : ''}`}
    aria-pressed={Boolean(active)}
    aria-label={label}
    title={title || label}
    disabled={disabled}
    onClick={() => onCommand?.(id, value)}
  >{label}</button>
}

const DRAW_TOOLS = [
  { id: 'pen', label: 'Pen' },
  { id: 'pencil', label: 'Pencil' },
  { id: 'highlighter', label: 'Highlighter' },
  { id: 'eraser', label: 'Eraser' },
]

export default function ShadowDocsRibbonDrawTab({ state = {}, onCommand, disabled = false }) {
  const enabled = Boolean(state.drawEnabled)
  const inkCount = Math.max(0, Number(state.inkCount) || 0)
  const undoCount = Math.max(0, Number(state.inkUndoCount) || 0)
  const thickness = Math.max(1, Math.min(24, Number(state.inkThickness) || 2))
  const inkColor = /^#[0-9a-f]{6}$/i.test(state.inkColor || '') ? state.inkColor : '#111111'
  const canUse = !disabled && typeof onCommand === 'function'

  return <div className="sd-ribbon-groups" role="tabpanel" aria-label="Draw">
    <div className="sd-ribbon-group">
      <div className="sd-ribbon-row">
        <Button
          id="drawEnabled"
          label={enabled ? 'Stop Drawing' : 'Start Drawing'}
          active={enabled}
          disabled={!canUse}
          onCommand={onCommand}
          value={!enabled}
        />
        {DRAW_TOOLS.map(({ id, label }) => <Button
          key={id}
          id={id}
          label={label}
          active={enabled && state.drawTool === id}
          disabled={!canUse}
          onCommand={onCommand}
        />)}
        <label className="sd-ribbon-color-control">
          Ink Color
          <input
            type="color"
            value={inkColor}
            disabled={!canUse}
            onChange={event => onCommand?.('inkColor', event.target.value)}
          />
        </label>
        <label className="sd-ribbon-number-control">
          Thickness
          <input
            type="number"
            min="1"
            max="24"
            value={thickness}
            disabled={!canUse}
            onChange={event => onCommand?.('inkThickness', Math.max(1, Math.min(24, Number(event.target.value) || 1)))}
          />
        </label>
        <Button
          id="drawWithTouch"
          label="Draw with Touch"
          active={Boolean(state.drawWithTouch)}
          disabled={!canUse}
          onCommand={onCommand}
          value={!state.drawWithTouch}
        />
        <Button
          id="inkUndo"
          label="Undo Drawing"
          disabled={!canUse || undoCount === 0}
          onCommand={onCommand}
        />
        <Button
          id="inkClear"
          label="Clear Drawing"
          disabled={!canUse || inkCount === 0}
          onCommand={onCommand}
        />
      </div>
      <span className="sd-ribbon-group-label">Ink · {inkCount} stroke{inkCount === 1 ? '' : 's'}</span>
    </div>
  </div>
}
