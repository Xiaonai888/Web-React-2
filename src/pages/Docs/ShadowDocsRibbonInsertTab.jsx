const Button = ({ id, label, disabled, onCommand }) => <button type="button" className="sd-ribbon-button" disabled={disabled} onClick={() => onCommand?.(id, true)}>{label}</button>
const Group = ({ label, items, disabled, onCommand }) => <div className="sd-ribbon-group"><div className="sd-ribbon-row">{items.map(([id, text]) => <Button key={id} id={id} label={text} disabled={disabled} onCommand={onCommand}/>)}</div><span className="sd-ribbon-group-label">{label}</span></div>

export default function ShadowDocsRibbonInsertTab({ onCommand, disabled = false }) {
  return <div className="sd-ribbon-groups" role="tabpanel" aria-label="Insert">
    <Group label="Pages" items={[["coverPage","Cover Page"],["blankPage","Blank Page"],["pageBreak","Page Break"]]} disabled={disabled} onCommand={onCommand}/>
    <Group label="Tables" items={[["table","Table"]]} disabled={disabled} onCommand={onCommand}/>
    <Group label="Illustrations" items={[["pictures","Pictures"],["shapes","Shapes"],["icons","Icons"],["smartArt","SmartArt"],["chart","Chart"],["screenshot","Screenshot"]]} disabled={disabled} onCommand={onCommand}/>
    <Group label="Links" items={[["link","Link"],["bookmark","Bookmark"],["crossReference","Cross-reference"]]} disabled={disabled} onCommand={onCommand}/>
    <Group label="Header & Footer" items={[["header","Header"],["footer","Footer"],["pageNumber","Page Number"]]} disabled={disabled} onCommand={onCommand}/>
    <Group label="Text" items={[["textBox","Text Box"],["wordArt","WordArt"],["dropCap","Drop Cap"],["dateTime","Date & Time"]]} disabled={disabled} onCommand={onCommand}/>
    <Group label="Symbols" items={[["equation","Equation"],["symbol","Symbol"]]} disabled={disabled} onCommand={onCommand}/>
  </div>
}
