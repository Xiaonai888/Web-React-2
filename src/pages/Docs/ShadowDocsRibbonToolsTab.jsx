function Button({ id, label, active, disabled, onCommand, value = true }) {
  return <button type="button" className={`sd-ribbon-button ${active ? 'is-active' : ''}`} aria-pressed={active || undefined} disabled={disabled} onClick={() => onCommand?.(id, value)}>{label}</button>
}

export default function ShadowDocsRibbonToolsTab({ state = {}, onCommand, disabled = false }) {
  return <div className="sd-ribbon-groups" role="tabpanel" aria-label="Tools">
    <div className="sd-ribbon-group">
      <div className="sd-ribbon-row">
        <Button id="wordCount" label="Word Count" disabled={disabled} onCommand={onCommand} />
        <Button id="findReplace" label="Find & Replace" disabled={disabled} onCommand={onCommand} />
        <Button id="translate" label="Translate" disabled={disabled} onCommand={onCommand} />
        <Button id="ocr" label="OCR" disabled={disabled} onCommand={onCommand} />
        <Button id="compareDocuments" label="Compare Documents" disabled={disabled} onCommand={onCommand} />
        <Button id="protect" label="Protect" disabled={disabled} onCommand={onCommand} />
        <Button id="convert" label="Convert" disabled={disabled} onCommand={onCommand} />
        <Button id="templates" label="Templates" disabled={disabled} onCommand={onCommand} />
        <Button id="autoCorrect" label="AutoCorrect" active={state.autoCorrect} disabled={disabled} onCommand={onCommand} value={!state.autoCorrect} />
        <Button id="preferences" label="Preferences" disabled={disabled} onCommand={onCommand} />
      </div>
      <span className="sd-ribbon-group-label">Document Tools</span>
    </div>
  </div>
}
