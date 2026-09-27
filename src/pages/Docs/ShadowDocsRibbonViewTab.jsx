function Button({ id, label, active, disabled, onCommand, value = true }) {
  return <button type="button" className={`sd-ribbon-button ${active ? 'is-active' : ''}`} aria-pressed={active || undefined} disabled={disabled} onClick={() => onCommand?.(id, value)}>{label}</button>
}

function Group({ label, children }) {
  return <div className="sd-ribbon-group">{children}<span className="sd-ribbon-group-label">{label}</span></div>
}

export default function ShadowDocsRibbonViewTab({ state = {}, onCommand, disabled = false }) {
  return <div className="sd-ribbon-groups" role="tabpanel" aria-label="View">
    <Group label="Views"><div className="sd-ribbon-row">
      <Button id="readMode" label="Read Mode" active={state.viewMode === 'read'} disabled={disabled} onCommand={onCommand} />
      <Button id="printLayout" label="Print Layout" active={state.viewMode === 'print'} disabled={disabled} onCommand={onCommand} />
      <Button id="webLayout" label="Web Layout" active={state.viewMode === 'web'} disabled={disabled} onCommand={onCommand} />
      <Button id="outline" label="Outline" active={state.viewMode === 'outline'} disabled={disabled} onCommand={onCommand} />
      <Button id="draft" label="Draft" active={state.viewMode === 'draft'} disabled={disabled} onCommand={onCommand} />
      <Button id="focus" label="Focus" active={state.focus} disabled={disabled} onCommand={onCommand} value={!state.focus} />
    </div></Group>
    <Group label="Show"><div className="sd-ribbon-row">
      <Button id="ruler" label="Ruler" active={state.ruler} disabled={disabled} onCommand={onCommand} value={!state.ruler} />
      <Button id="gridlines" label="Gridlines" active={state.gridlines} disabled={disabled} onCommand={onCommand} value={!state.gridlines} />
      <Button id="navigationPane" label="Navigation Pane" active={state.navigationPane} disabled={disabled} onCommand={onCommand} value={!state.navigationPane} />
    </div></Group>
    <Group label="Zoom"><div className="sd-ribbon-row">
      <Button id="zoom" label="Zoom" disabled={disabled} onCommand={onCommand} />
      <Button id="zoom100" label="100%" disabled={disabled} onCommand={onCommand} />
      <Button id="onePage" label="One Page" disabled={disabled} onCommand={onCommand} />
      <Button id="multiplePages" label="Multiple Pages" disabled={disabled} onCommand={onCommand} />
      <Button id="pageWidth" label="Page Width" disabled={disabled} onCommand={onCommand} />
    </div></Group>
    <Group label="Window"><div className="sd-ribbon-row">
      <Button id="newWindow" label="New Window" disabled={disabled} onCommand={onCommand} />
      <Button id="arrangeAll" label="Arrange All" disabled={disabled} onCommand={onCommand} />
      <Button id="split" label="Split" disabled={disabled} onCommand={onCommand} />
      <Button id="sideBySide" label="View Side by Side" disabled={disabled} onCommand={onCommand} />
      <Button id="syncScrolling" label="Synchronous Scrolling" active={state.syncScrolling} disabled={disabled} onCommand={onCommand} value={!state.syncScrolling} />
      <Button id="switchWindows" label="Switch Windows" disabled={disabled} onCommand={onCommand} />
    </div></Group>
  </div>
}
