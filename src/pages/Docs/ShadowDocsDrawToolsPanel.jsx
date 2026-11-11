import { Eraser, Highlighter, Minus, PenLine, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { SHADOW_DOCS_INK_COLORS } from './ShadowDocsInkEngine'
import './ShadowDocsDraw.css'

const DEFAULT_TEXT = {
  brush: 'Enable Brush',
  touch: 'Touch Mode',
  tools: 'Drawing Tools',
  colors: 'Ink Colors',
  thickness: 'Thickness',
  pen: 'Pen',
  pencil: 'Pencil',
  highlighter: 'Highlighter',
  eraser: 'Eraser',
  undo: 'Undo Stroke',
  clear: 'Clear Drawing',
}

const TOOLS = [
  { id: 'pen', icon: PenLine, text: 'pen' },
  { id: 'pencil', icon: Pencil, text: 'pencil' },
  { id: 'highlighter', icon: Highlighter, text: 'highlighter' },
  { id: 'eraser', icon: Eraser, text: 'eraser' },
]

export default function ShadowDocsDrawToolsPanel({
  state = {},
  onCommand,
  onUndo,
  onClear,
  hasStrokes = false,
  disabled = false,
  labels = {},
}) {
  const text = { ...DEFAULT_TEXT, ...labels }
  const active = Boolean(state.drawEnabled)
  const current = state.drawTool || 'pen'
  const width = Math.max(1, Math.min(24, Number(state.inkThickness) || 2))
  const color = /^#[0-9a-f]{6}$/i.test(state.inkColor || '') ? state.inkColor : '#111111'
  const command = (name, value) => onCommand?.(name, value)

  return <div className="sd-draw-panel" role="tabpanel" aria-label="Draw">
    <div className="sd-draw-settings">
      <div className="sd-draw-setting">
        <span>{text.brush}</span>
        <button type="button" className={`sd-draw-switch ${active ? 'is-on' : ''}`} role="switch" aria-checked={active} aria-label={text.brush} disabled={disabled} onClick={() => command('drawEnabled', !active)}><span /></button>
      </div>
      <div className="sd-draw-setting">
        <span>{text.touch}</span>
        <button type="button" className={`sd-draw-switch ${state.drawWithTouch ? 'is-on' : ''}`} role="switch" aria-checked={Boolean(state.drawWithTouch)} aria-label={text.touch} disabled={disabled || !active} onClick={() => command('drawWithTouch', !state.drawWithTouch)}><span /></button>
      </div>
    </div>
    <div className="sd-draw-toolbox" aria-label={text.tools}>
      {TOOLS.map(({ id, icon: Icon, text: label }) => <button key={id} type="button" title={text[label]} aria-label={text[label]} aria-pressed={current === id} className={`sd-draw-tool ${current === id ? 'is-selected' : ''}`} disabled={disabled} onClick={() => { command('drawTool', id); if (!active) command('drawEnabled', true) }}><Icon size={23} strokeWidth={1.8} /></button>)}
    </div>
    <div className="sd-draw-colors" aria-label={text.colors}>
      {SHADOW_DOCS_INK_COLORS.map(value => <button type="button" key={value} className={`sd-draw-color ${value.toLowerCase() === color.toLowerCase() ? 'is-selected' : ''}`} style={{ '--ink': value }} title={value} aria-label={`${text.colors} ${value}`} aria-pressed={value.toLowerCase() === color.toLowerCase()} disabled={disabled} onClick={() => command('inkColor', value)} />)}
      <input type="color" className="sd-draw-custom-color" aria-label={`${text.colors} custom`} value={color} disabled={disabled} onChange={event => command('inkColor', event.target.value)} />
    </div>
    <div className="sd-draw-width">
      <label htmlFor="sd-draw-thickness">{text.thickness}</label>
      <button type="button" aria-label="Decrease thickness" disabled={disabled || width <= 1} onClick={() => command('inkThickness', width - 1)}><Minus size={18} /></button>
      <input id="sd-draw-thickness" type="range" min="1" max="24" value={width} disabled={disabled} onChange={event => command('inkThickness', Number(event.target.value))} />
      <button type="button" aria-label="Increase thickness" disabled={disabled || width >= 24} onClick={() => command('inkThickness', width + 1)}><Plus size={18} /></button>
      <output>{width}</output>
    </div>
    <div className="sd-draw-actions">
      <button type="button" disabled={disabled || !Number(state.inkUndoCount)} onClick={onUndo}><RotateCcw size={17} />{text.undo}</button>
      <button type="button" disabled={disabled || !hasStrokes} onClick={onClear}><Trash2 size={17} />{text.clear}</button>
    </div>
  </div>
}
