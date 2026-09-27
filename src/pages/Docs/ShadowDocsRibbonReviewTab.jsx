const Button = ({ id, label, active, disabled, onCommand, value = true }) => <button type="button" className={`sd-ribbon-button ${active ? 'is-active' : ''}`} aria-pressed={active || undefined} disabled={disabled} onClick={() => onCommand?.(id, value)}>{label}</button>
const Group = ({ label, items, state, disabled, onCommand }) => <div className="sd-ribbon-group"><div className="sd-ribbon-row">{items.map(([id,text]) => <Button key={id} id={id} label={text} active={id === 'trackChanges' && state.trackChanges} disabled={disabled} onCommand={onCommand} value={id === 'trackChanges' ? !state.trackChanges : true}/>)}</div><span className="sd-ribbon-group-label">{label}</span></div>

export default function ShadowDocsRibbonReviewTab({ state = {}, onCommand, disabled = false }) {
  return <div className="sd-ribbon-groups" role="tabpanel" aria-label="Review">
    <Group label="Proofing" items={[["editor","Editor"],["spellingGrammar","Spelling & Grammar"],["thesaurus","Thesaurus"],["wordCount","Word Count"]]} state={state} disabled={disabled} onCommand={onCommand}/>
    <Group label="Language" items={[["translate","Translate"],["setLanguage","Language"]]} state={state} disabled={disabled} onCommand={onCommand}/>
    <Group label="Comments" items={[["newComment","New Comment"],["deleteComment","Delete"],["previousComment","Previous"],["nextComment","Next"]]} state={state} disabled={disabled} onCommand={onCommand}/>
    <Group label="Tracking" items={[["trackChanges","Track Changes"],["displayReview","Display for Review"],["showMarkup","Show Markup"],["reviewPane","Reviewing Pane"]]} state={state} disabled={disabled} onCommand={onCommand}/>
    <Group label="Changes" items={[["acceptChange","Accept"],["rejectChange","Reject"],["previousChange","Previous"],["nextChange","Next"]]} state={state} disabled={disabled} onCommand={onCommand}/>
    <Group label="Compare / Protect" items={[["compare","Compare"],["combine","Combine"],["restrictEditing","Restrict Editing"],["protectDocument","Protect"]]} state={state} disabled={disabled} onCommand={onCommand}/>
  </div>
}
