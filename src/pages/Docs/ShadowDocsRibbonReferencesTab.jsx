function Button({ id, label, disabled, onCommand }) {
  return <button type="button" className="sd-ribbon-button" disabled={disabled} onClick={() => onCommand?.(id, true)}>{label}</button>
}

function Group({ label, children }) {
  return <div className="sd-ribbon-group">{children}<span className="sd-ribbon-group-label">{label}</span></div>
}

export default function ShadowDocsRibbonReferencesTab({ onCommand, disabled = false }) {
  return <div className="sd-ribbon-groups" role="tabpanel" aria-label="References">
    <Group label="Table of Contents"><div className="sd-ribbon-row">
      <Button id="tableOfContents" label="Table of Contents" disabled={disabled} onCommand={onCommand} />
      <Button id="addTocText" label="Add Text" disabled={disabled} onCommand={onCommand} />
      <Button id="updateToc" label="Update Table" disabled={disabled} onCommand={onCommand} />
    </div></Group>
    <Group label="Footnotes"><div className="sd-ribbon-row">
      <Button id="insertFootnote" label="Insert Footnote" disabled={disabled} onCommand={onCommand} />
      <Button id="insertEndnote" label="Insert Endnote" disabled={disabled} onCommand={onCommand} />
      <Button id="nextFootnote" label="Next Footnote" disabled={disabled} onCommand={onCommand} />
      <Button id="showNotes" label="Show Notes" disabled={disabled} onCommand={onCommand} />
    </div></Group>
    <Group label="Citations & Bibliography"><div className="sd-ribbon-row">
      <Button id="insertCitation" label="Insert Citation" disabled={disabled} onCommand={onCommand} />
      <Button id="manageSources" label="Manage Sources" disabled={disabled} onCommand={onCommand} />
      <Button id="citationStyle" label="Style" disabled={disabled} onCommand={onCommand} />
      <Button id="bibliography" label="Bibliography" disabled={disabled} onCommand={onCommand} />
    </div></Group>
    <Group label="Captions"><div className="sd-ribbon-row">
      <Button id="insertCaption" label="Insert Caption" disabled={disabled} onCommand={onCommand} />
      <Button id="tableOfFigures" label="Table of Figures" disabled={disabled} onCommand={onCommand} />
      <Button id="updateTableOfFigures" label="Update Table" disabled={disabled} onCommand={onCommand} />
      <Button id="crossReference" label="Cross-reference" disabled={disabled} onCommand={onCommand} />
    </div></Group>
    <Group label="Index"><div className="sd-ribbon-row">
      <Button id="markEntry" label="Mark Entry" disabled={disabled} onCommand={onCommand} />
      <Button id="insertIndex" label="Insert Index" disabled={disabled} onCommand={onCommand} />
      <Button id="updateIndex" label="Update Index" disabled={disabled} onCommand={onCommand} />
    </div></Group>
  </div>
}
