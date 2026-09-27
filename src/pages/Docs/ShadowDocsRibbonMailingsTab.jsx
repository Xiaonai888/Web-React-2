function Button({ id, label, active, disabled, onCommand, value = true }) {
  return <button type="button" className={`sd-ribbon-button ${active ? 'is-active' : ''}`} aria-pressed={active || undefined} disabled={disabled} onClick={() => onCommand?.(id, value)}>{label}</button>
}

function Group({ label, children }) {
  return <div className="sd-ribbon-group">{children}<span className="sd-ribbon-group-label">{label}</span></div>
}

export default function ShadowDocsRibbonMailingsTab({ state = {}, onCommand, disabled = false }) {
  return <div className="sd-ribbon-groups" role="tabpanel" aria-label="Mailings">
    <Group label="Create"><div className="sd-ribbon-row">
      <Button id="envelopes" label="Envelopes" disabled={disabled} onCommand={onCommand} />
      <Button id="labels" label="Labels" disabled={disabled} onCommand={onCommand} />
    </div></Group>
    <Group label="Start Mail Merge"><div className="sd-ribbon-row">
      <Button id="startMailMerge" label="Start Mail Merge" active={state.mailMergeActive} disabled={disabled} onCommand={onCommand} value={!state.mailMergeActive} />
      <Button id="selectRecipients" label="Select Recipients" disabled={disabled} onCommand={onCommand} />
      <Button id="editRecipients" label="Edit Recipient List" disabled={disabled} onCommand={onCommand} />
    </div></Group>
    <Group label="Write & Insert Fields"><div className="sd-ribbon-row">
      <Button id="addressBlock" label="Address Block" disabled={disabled} onCommand={onCommand} />
      <Button id="greetingLine" label="Greeting Line" disabled={disabled} onCommand={onCommand} />
      <Button id="mergeField" label="Insert Merge Field" disabled={disabled} onCommand={onCommand} />
      <Button id="rules" label="Rules" disabled={disabled} onCommand={onCommand} />
      <Button id="matchFields" label="Match Fields" disabled={disabled} onCommand={onCommand} />
    </div></Group>
    <Group label="Preview Results"><div className="sd-ribbon-row">
      <Button id="previewResults" label="Preview Results" active={state.previewMerge} disabled={disabled} onCommand={onCommand} value={!state.previewMerge} />
      <Button id="firstRecord" label="|‹" disabled={disabled} onCommand={onCommand} />
      <Button id="previousRecord" label="‹" disabled={disabled} onCommand={onCommand} />
      <Button id="nextRecord" label="›" disabled={disabled} onCommand={onCommand} />
      <Button id="lastRecord" label="›|" disabled={disabled} onCommand={onCommand} />
      <Button id="findRecipient" label="Find Recipient" disabled={disabled} onCommand={onCommand} />
    </div></Group>
    <Group label="Finish"><div className="sd-ribbon-row">
      <Button id="finishMerge" label="Finish & Merge" disabled={disabled} onCommand={onCommand} />
    </div></Group>
  </div>
}
