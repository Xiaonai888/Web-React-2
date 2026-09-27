function Button({ id, label, active, disabled, onCommand, value = true }) {
  return <button type="button" className={`sd-ribbon-button ${active ? 'is-active' : ''}`} aria-pressed={active || undefined} disabled={disabled} onClick={() => onCommand?.(id, value)}>{label}</button>
}

function Group({ label, children }) {
  return <div className="sd-ribbon-group">{children}<span className="sd-ribbon-group-label">{label}</span></div>
}

export default function ShadowDocsRibbonDesignTab({ state = {}, onCommand, disabled = false }) {
  return <div className="sd-ribbon-groups" role="tabpanel" aria-label="Design">
    <Group label="Document Formatting"><div className="sd-ribbon-row">
      <Button id="themes" label="Themes" disabled={disabled} onCommand={onCommand} />
      <Button id="themeColors" label="Colors" disabled={disabled} onCommand={onCommand} />
      <Button id="themeFonts" label="Fonts" disabled={disabled} onCommand={onCommand} />
      <Button id="paragraphSpacing" label="Paragraph Spacing" disabled={disabled} onCommand={onCommand} />
      <Button id="effects" label="Effects" disabled={disabled} onCommand={onCommand} />
      <Button id="setDefault" label="Set as Default" disabled={disabled} onCommand={onCommand} />
    </div></Group>

    <Group label="Page Background"><div className="sd-ribbon-row">
      <Button id="watermark" label="Watermark" disabled={disabled} onCommand={onCommand} />
      <label className="sd-ribbon-color-control">Page Color<input type="color" value={state.pageColor || '#ffffff'} disabled={disabled} onChange={event => onCommand?.('pageColor', event.target.value)} /></label>
      <Button id="pageBorders" label="Page Borders" disabled={disabled} onCommand={onCommand} />
    </div></Group>
  </div>
}
