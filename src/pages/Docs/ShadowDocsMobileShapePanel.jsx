import { useState } from 'react'
import { AlignCenter, AlignLeft, AlignRight, ChevronLeft, Shapes } from 'lucide-react'

const SHAPES = [
  { id: 'rectangle', label: 'Rectangle', symbol: '▰' },
  { id: 'rounded', label: 'Rounded', symbol: '▢' },
  { id: 'ellipse', label: 'Oval', symbol: '●' },
  { id: 'triangle', label: 'Triangle', symbol: '▲' },
  { id: 'diamond', label: 'Diamond', symbol: '◆' },
  { id: 'arrow', label: 'Arrow', symbol: '➜' },
  { id: 'star', label: 'Star', symbol: '★' },
  { id: 'line', label: 'Line', symbol: '━' },
]
const ALIGNS = [{ value: 'left', Icon: AlignLeft }, { value: 'center', Icon: AlignCenter }, { value: 'right', Icon: AlignRight }]

export default function ShadowDocsMobileShapePanel({ disabled = false, onBack, onInsert }) {
  const [shape, setShape] = useState('rectangle')
  const [color, setColor] = useState('#2563eb')
  const [width, setWidth] = useState(50)
  const [align, setAlign] = useState('center')
  return <div className="sd-insert-shape-panel">
    <style>{`
      .sd-insert-shape-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;padding:12px 0}
      .sd-insert-shape-grid button{min-width:0;min-height:80px;border:1px solid #555;border-radius:11px;background:#353535;color:#ddd;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;padding:5px;font-size:10px}
      .sd-insert-shape-grid button.is-selected{background:#354b66;border-color:#6baaff;color:#fff}
      .sd-insert-shape-symbol{font-size:33px;line-height:1.1;font-weight:700}
      .sd-insert-shape-panel input[type="color"]{width:46px;height:37px;border:0;border-radius:7px;background:transparent;cursor:pointer}
      .sd-insert-shape-panel button:focus-visible{outline:2px solid #7db7ff;outline-offset:2px}
      .sd-insert-shape-panel button:disabled{opacity:.4}
      @media(max-width:370px){.sd-insert-shape-grid{gap:4px}.sd-insert-shape-grid button{font-size:9px}}
    `}</style>
    <div className="sd-insert-title">
      <button type="button" aria-label="Back to Insert" onPointerDown={event => event.preventDefault()} onClick={onBack}><ChevronLeft size={22} /></button>
      Insert Shape
    </div>
    <div className="sd-insert-card">
      <div className="sd-insert-shape-grid">
        {SHAPES.map(item => <button key={item.id} type="button" className={shape === item.id ? 'is-selected' : ''} aria-pressed={shape === item.id} disabled={disabled} onPointerDown={event => event.preventDefault()} onClick={() => setShape(item.id)}><span className="sd-insert-shape-symbol">{item.symbol}</span><span>{item.label}</span></button>)}
      </div>
      <div className="sd-insert-setting-row"><span>Shape Color</span><input aria-label="Shape color" type="color" value={color} disabled={disabled} onChange={event => setColor(event.target.value)} /></div>
      <div className="sd-insert-setting-row"><span>Width</span><div className="sd-insert-options">{[25, 50, 75, 100].map(size => <button type="button" key={size} className={width === size ? 'is-selected' : ''} aria-pressed={width === size} disabled={disabled} onPointerDown={event => event.preventDefault()} onClick={() => setWidth(size)}>{size}%</button>)}</div></div>
      <div className="sd-insert-setting-row"><span>Alignment</span><div className="sd-insert-options">{ALIGNS.map(({ value, Icon }) => <button type="button" key={value} aria-label={value} className={align === value ? 'is-selected' : ''} aria-pressed={align === value} disabled={disabled} onPointerDown={event => event.preventDefault()} onClick={() => setAlign(value)}><Icon size={19} /></button>)}</div></div>
    </div>
    <button type="button" className="sd-insert-submit" disabled={disabled || typeof onInsert !== 'function'} onPointerDown={event => event.preventDefault()} onClick={() => onInsert?.({ type: shape, color, width, align })}><Shapes size={20} /> Insert Shape</button>
  </div>
}
