import { useState } from 'react'
import {
  AlignCenter, AlignLeft, AlignRight, ChevronLeft, FilePlus2,
  FileText, ImagePlus, MessageSquarePlus, Minus, PenLine, Plus, ScanText, Shapes, Table2,
} from 'lucide-react'
import ShadowDocsMobileShapePanel from './ShadowDocsMobileShapePanel'
import ShadowDocsMobileScanTextPanel from './ShadowDocsMobileScanTextPanel'
import ShadowDocsMobileSignaturePanel from './ShadowDocsMobileSignaturePanel'

const QUICK_ACTIONS = [
  { id: 'image', label: 'Image', icon: ImagePlus },
  { id: 'table', label: 'Table', icon: Table2 },
  { id: 'blankPage', label: 'Blank Page', icon: FilePlus2 },
  { id: 'comment', label: 'Comment', icon: MessageSquarePlus },
]

const WIDTHS = [50, 75, 100]
const ALIGNMENTS = [
  { value: 'left', label: 'Left', icon: AlignLeft },
  { value: 'center', label: 'Center', icon: AlignCenter },
  { value: 'right', label: 'Right', icon: AlignRight },
]

function Stepper({ label, value, min, max, onChange }) {
  return <div className="sd-insert-setting-row">
    <span>{label}</span>
    <div className="sd-insert-stepper">
      <button type="button" aria-label={`Decrease ${label}`} disabled={value <= min} onPointerDown={event => event.preventDefault()} onClick={() => onChange(Math.max(min, value - 1))}><Minus size={18} /></button>
      <output>{value}</output>
      <button type="button" aria-label={`Increase ${label}`} disabled={value >= max} onPointerDown={event => event.preventDefault()} onClick={() => onChange(Math.min(max, value + 1))}><Plus size={18} /></button>
    </div>
  </div>
}

export default function ShadowDocsMobileInsertPanel({ disabled = false, onCommand, onClose }) {
  const [view, setView] = useState('menu')
  const [width, setWidth] = useState(75)
  const [alignment, setAlignment] = useState('center')
  const [rows, setRows] = useState(2)
  const [columns, setColumns] = useState(2)
  const [header, setHeader] = useState(false)
  const [textBoxText, setTextBoxText] = useState('')

  function execute(command, value = true) {
    if (disabled || typeof onCommand !== 'function') return
    onCommand(command, value)
    onClose?.()
  }

  function quickAction(id) {
    if (id === 'image' || id === 'table') {
      setView(id)
      return
    }
    execute(id === 'comment' ? 'newComment' : id)
  }

  return <div className="sd-insert-panel">
    <style>{`
      .sd-insert-panel{color:#ededed;padding:7px 0 20px;font-family:Inter,"Noto Sans Khmer",system-ui,sans-serif}
      .sd-insert-title{display:flex;align-items:center;gap:9px;min-height:42px;color:#eaeaea;font-size:15px;font-weight:650}
      .sd-insert-title button{width:36px;height:36px;border:0;background:transparent;color:inherit;display:grid;place-items:center;border-radius:9px}
      .sd-insert-quick{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin-top:5px}
      .sd-insert-quick button{min-width:0;min-height:91px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;border:0;border-radius:13px;background:#303030;color:#ededed;font-size:12px}
      .sd-insert-quick svg{width:29px;height:29px;stroke-width:1.55;color:#cdcdcd}
      .sd-insert-card{margin-top:12px;padding:8px 12px;background:#303030;border-radius:13px}
      .sd-insert-section-title{margin:18px 4px 8px;font-size:12px;color:#aeb0b5;font-weight:500}
      .sd-insert-setting-row{min-height:62px;display:flex;align-items:center;justify-content:space-between;gap:10px;border-bottom:1px solid #414141;font-size:14px}
      .sd-insert-setting-row:last-child{border-bottom:0}
      .sd-insert-setting-row>span{color:#e1e1e1}
      .sd-insert-options{display:flex;gap:7px;justify-content:flex-end;flex-wrap:wrap}
      .sd-insert-options button{min-width:61px;min-height:39px;padding:7px 12px;border:1px solid #4b4b4b;border-radius:9px;background:#393939;color:#dedede;display:flex;align-items:center;justify-content:center;gap:6px;font-size:12px}
      .sd-insert-options button.is-selected{background:#3e4e65;border-color:#6aa7ec;color:#fff}
      .sd-insert-stepper{display:flex;align-items:center;gap:6px}
      .sd-insert-stepper button{height:39px;width:38px;display:grid;place-items:center;background:#3c3c3c;color:#fff;border:0;border-radius:9px}
      .sd-insert-stepper output{display:grid;place-items:center;min-width:43px;height:40px;background:#464646;border-radius:9px;font-weight:650}
      .sd-insert-switch{width:48px;height:28px;flex:none;border:0;border-radius:20px;background:#505050;padding:3px;display:flex;align-items:center}
      .sd-insert-switch:before{content:"";width:22px;height:22px;background:#b8b8b8;border-radius:50%;transition:transform .15s}
      .sd-insert-switch.is-on{background:#4184d1}
      .sd-insert-switch.is-on:before{background:#fff;transform:translateX(20px)}
      .sd-insert-submit{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;min-height:47px;margin-top:18px;border:0;border-radius:11px;background:#438fe6;color:white;font-size:15px;font-weight:700}
      .sd-insert-help{font-size:12px;line-height:1.6;color:#aeb0b5;padding:7px 4px}
      .sd-insert-panel button:disabled{opacity:.35}
      .sd-insert-panel button:not(:disabled):active{filter:brightness(1.2)}
      .sd-insert-panel button:focus-visible{outline:2px solid #7db7ff;outline-offset:2px}
      @media(max-width:370px){.sd-insert-quick{gap:5px}.sd-insert-quick button{font-size:11px}.sd-insert-options button{min-width:50px;padding:6px 8px}}
    `}</style>
    {view === 'menu' ? <>
      <h3 className="sd-insert-section-title">Insert</h3>
      <div className="sd-insert-quick">
        {QUICK_ACTIONS.map(({ id, label, icon: Icon }) => <button key={id} type="button" disabled={disabled || typeof onCommand !== 'function'} onPointerDown={event => event.preventDefault()} onClick={() => quickAction(id)}><Icon /><span>{label}</span></button>)}
           </div>
      <h3 className="sd-insert-section-title">Shapes</h3>
      <div className="sd-insert-quick">
        <button type="button" disabled={disabled} onPointerDown={event => event.preventDefault()} onClick={() => setView('shape')}><Shapes /><span>Shape</span></button>
      <button type="button" disabled={disabled} onPointerDown={event => event.preventDefault()} onClick={() => setView('textBox')}><FileText /><span>Text Box</span></button>
      <button type="button" disabled={disabled} onPointerDown={event => event.preventDefault()} onClick={() => setView('scanText')}><ScanText /><span>Scan Text</span></button>
      <button type="button" disabled={disabled} onPointerDown={event => event.preventDefault()} onClick={() => setView('signature')}><PenLine /><span>Signature</span></button>
      </div>
    </> : view === 'shape' ? (
      <ShadowDocsMobileShapePanel disabled={disabled} onBack={() => setView('menu')} onInsert={options => execute('shape', options)} />
    ) : view === 'signature' ? (
  <ShadowDocsMobileSignaturePanel
    disabled={disabled}
    onBack={() => setView('menu')}
    onInsert={options => execute('signature', options)}
  />
) : view === 'scanText' ? (
  <ShadowDocsMobileScanTextPanel
    disabled={disabled}
    onBack={() => setView('menu')}
    onInsert={text => execute('scanTextInsert', text)}
  />
) : view === 'textBox' ? <>
  <div className="sd-insert-title">
    <button type="button" aria-label="Back to Insert" onPointerDown={event => event.preventDefault()} onClick={() => setView('menu')}><ChevronLeft size={22} /></button>
    Insert Text Box
  </div>
  <h3 className="sd-insert-section-title">Text Box Content</h3>
  <div className="sd-insert-card">
    <textarea
      aria-label="Text box content"
      value={textBoxText}
      maxLength={5000}
      rows={5}
      placeholder="Write your text here..."
      disabled={disabled}
      onChange={event => setTextBoxText(event.target.value)}
      style={{ width: '100%', background: 'transparent', color: '#fff', border: 0, outline: 0, resize: 'vertical', padding: '12px 4px' }}
    />
  </div>
  <button type="button" className="sd-insert-submit" disabled={disabled} onPointerDown={event => event.preventDefault()} onClick={() => execute('textBox', textBoxText)}>
    <FileText size={20} /> Insert Text Box
  </button>
</> : view === 'image' ? <>
      <div className="sd-insert-title"><button type="button" aria-label="Back to Insert" onPointerDown={event => event.preventDefault()} onClick={() => setView('menu')}><ChevronLeft size={22} /></button>Insert Image</div>
      <h3 className="sd-insert-section-title">Image Settings</h3>
      <div className="sd-insert-card">
        <div className="sd-insert-setting-row"><span>Image Width</span><div className="sd-insert-options">{WIDTHS.map(value => <button key={value} type="button" className={width === value ? 'is-selected' : ''} aria-pressed={width === value} onPointerDown={event => event.preventDefault()} onClick={() => setWidth(value)}>{value}%</button>)}</div></div>
        <div className="sd-insert-setting-row"><span>Alignment</span><div className="sd-insert-options">{ALIGNMENTS.map(({ value, label, icon: Icon }) => <button key={value} type="button" className={alignment === value ? 'is-selected' : ''} aria-label={label} title={label} aria-pressed={alignment === value} onPointerDown={event => event.preventDefault()} onClick={() => setAlignment(value)}><Icon size={19} /></button>)}</div></div>
      </div>
      <p className="sd-insert-help">PNG, JPG, WebP · Up to 6 MB</p>
      <button type="button" className="sd-insert-submit" disabled={disabled} onPointerDown={event => event.preventDefault()} onClick={() => execute('pictures', { width, align: alignment })}><ImagePlus size={21} /> Choose Image</button>
    </> : <>
      <div className="sd-insert-title"><button type="button" aria-label="Back to Insert" onPointerDown={event => event.preventDefault()} onClick={() => setView('menu')}><ChevronLeft size={22} /></button>Insert Table</div>
      <h3 className="sd-insert-section-title">Table Settings</h3>
      <div className="sd-insert-card">
        <Stepper label="Rows" value={rows} min={1} max={50} onChange={setRows} />
        <Stepper label="Columns" value={columns} min={1} max={20} onChange={setColumns} />
        <div className="sd-insert-setting-row"><span>Header Row</span><button type="button" role="switch" aria-checked={header} aria-label="Header Row" className={`sd-insert-switch ${header ? 'is-on' : ''}`} onPointerDown={event => event.preventDefault()} onClick={() => setHeader(value => !value)} /></div>
      </div>
      <button type="button" className="sd-insert-submit" disabled={disabled} onPointerDown={event => event.preventDefault()} onClick={() => execute('table', { rows, columns, header })}><Table2 size={21} /> Insert {rows} × {columns} Table</button>
    </>}
  </div>
}
