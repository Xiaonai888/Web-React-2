function Button({ id, label, disabled, onCommand }) {
  return <button type="button" className="sd-ribbon-file-button" disabled={disabled} onClick={() => onCommand?.(id, true)}>{label}</button>
}

export default function ShadowDocsRibbonFileTab({ state = {}, onCommand, disabled = false }) {
  return <div className="sd-ribbon-file" role="tabpanel" aria-label="File">
    <div className="sd-ribbon-file-primary">
      <Button id="new" label="New" disabled={disabled} onCommand={onCommand} />
      <Button id="open" label="Open" disabled={disabled} onCommand={onCommand} />
      <Button id="save" label="Save" disabled={disabled} onCommand={onCommand} />
      <Button id="saveAs" label="Save As" disabled={disabled} onCommand={onCommand} />
      <Button id="print" label="Print" disabled={disabled} onCommand={onCommand} />
    </div>
    <div className="sd-ribbon-file-secondary">
      <Button id="recent" label="Recent" disabled={disabled} onCommand={onCommand} />
      <Button id="import" label="Import" disabled={disabled} onCommand={onCommand} />
      <Button id="export" label="Export" disabled={disabled} onCommand={onCommand} />
      <Button id="backup" label="Backup" disabled={disabled} onCommand={onCommand} />
      <Button id="properties" label="Properties" disabled={disabled} onCommand={onCommand} />
    </div>
    <div className="sd-ribbon-file-info">
      <strong>{state.title || 'Untitled Book'}</strong>
      <span>{state.author || 'No author'}</span>
      <span>{state.status || 'Saved on this device'}</span>
    </div>
  </div>
}
