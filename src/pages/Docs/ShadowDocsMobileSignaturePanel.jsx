import { useRef, useState } from 'react'
import { AlignCenter, AlignLeft, AlignRight, ChevronLeft, Eraser, PenLine, Undo2 } from 'lucide-react'

const COLORS = ['#111827', '#1d4ed8', '#b91c1c', '#15803d']
const WIDTHS = [25, 50, 75, 100]
const ALIGNS = [
  { value: 'left', Icon: AlignLeft },
  { value: 'center', Icon: AlignCenter },
  { value: 'right', Icon: AlignRight },
]

export default function ShadowDocsMobileSignaturePanel({ disabled = false, onBack, onInsert }) {
  const canvasRef = useRef(null)
  const strokesRef = useRef([])
  const activePointerRef = useRef(null)
  const [color, setColor] = useState('#111827')
  const [thickness, setThickness] = useState(4)
  const [width, setWidth] = useState(50)
  const [align, setAlign] = useState('center')
  const [hasInk, setHasInk] = useState(false)
  const [error, setError] = useState('')

  function redraw() {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!context) return
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.lineCap = 'round'
    context.lineJoin = 'round'
    for (const stroke of strokesRef.current) {
      context.strokeStyle = stroke.color
      context.fillStyle = stroke.color
      context.lineWidth = stroke.thickness
      context.beginPath()
      stroke.points.forEach((point, index) => {
        if (index === 0) context.moveTo(point.x, point.y)
        else context.lineTo(point.x, point.y)
      })
      if (stroke.points.length === 1) {
        const point = stroke.points[0]
        context.arc(point.x, point.y, stroke.thickness / 2, 0, Math.PI * 2)
        context.fill()
      } else context.stroke()
    }
  }

  function position(event) {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    return {
      x: Math.max(0, Math.min(canvas.width, (event.clientX - rect.left) * canvas.width / Math.max(rect.width, 1))),
      y: Math.max(0, Math.min(canvas.height, (event.clientY - rect.top) * canvas.height / Math.max(rect.height, 1))),
    }
  }

  function start(event) {
    if (disabled || activePointerRef.current !== null || (event.pointerType === 'mouse' && event.button !== 0)) return
    event.preventDefault()
    activePointerRef.current = event.pointerId
    strokesRef.current.push({ color, thickness, points: [position(event)] })
    event.currentTarget.setPointerCapture?.(event.pointerId)
    setHasInk(true)
    setError('')
    redraw()
  }

  function move(event) {
    if (event.pointerId !== activePointerRef.current) return
    event.preventDefault()
    const stroke = strokesRef.current[strokesRef.current.length - 1]
    if (!stroke) return
    stroke.points.push(position(event))
    redraw()
  }

  function end(event) {
    if (event.pointerId !== activePointerRef.current) return
    activePointerRef.current = null
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  function undo() {
    if (disabled) return
    strokesRef.current.pop()
    setHasInk(strokesRef.current.length > 0)
    setError('')
    redraw()
  }

  function clear() {
    if (disabled) return
    strokesRef.current = []
    setHasInk(false)
    setError('')
    redraw()
  }

  function insert() {
    if (disabled || !hasInk || typeof onInsert !== 'function') return
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      const result = document.createElement('canvas')
      result.width = 480
      result.height = 180
      const context = result.getContext('2d')
      if (!context) throw new Error('Signature canvas is unavailable.')
      context.clearRect(0, 0, result.width, result.height)
      context.drawImage(canvas, 0, 0, result.width, result.height)
      const src = result.toDataURL('image/png')
      if (!/^data:image\/png;base64,/i.test(src) || src.length > 300000) throw new Error('Signature is too large. Please redraw with fewer strokes.')
      onInsert({ src, width, align })
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not create signature.')
    }
  }

  return <section className="sd-signature-panel" aria-label="Insert Signature">
    <style>{`
      .sd-signature-panel{color:#efefef;padding:4px 0 22px;display:grid;gap:12px}
      .sd-signature-title{display:flex;align-items:center;gap:9px;font-size:16px;font-weight:650}
      .sd-signature-title button{width:37px;height:38px;display:grid;place-items:center;border:0;border-radius:9px;background:transparent;color:inherit}
      .sd-signature-pad{position:relative;border:1px solid #555;border-radius:12px;background:#fff;overflow:hidden}
      .sd-signature-pad canvas{display:block;width:100%;height:165px;touch-action:none;cursor:crosshair}
      .sd-signature-hint{position:absolute;inset:0;display:grid;place-items:center;color:#a3a3a3;font-size:13px;pointer-events:none}
      .sd-signature-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
      .sd-signature-toolbar button{min-height:39px;display:flex;align-items:center;gap:6px;border:1px solid #505050;background:#363636;color:#f3f3f3;border-radius:9px;padding:7px 11px;font-size:12px}
      .sd-signature-colors{display:flex;align-items:center;gap:10px}
      .sd-signature-color{width:33px;height:33px;border-radius:50%;border:2px solid transparent;padding:3px;background:transparent;display:grid;place-items:center}
      .sd-signature-color span{width:24px;height:24px;border-radius:50%;display:block}
      .sd-signature-color.is-selected{border-color:#77b8ff}
      .sd-signature-panel .sd-insert-setting-row{gap:10px}
      .sd-signature-panel .sd-insert-options button{min-width:43px}
      .sd-signature-thickness{width:106px;accent-color:#6fa9f3}
      .sd-signature-error{font-size:12px;color:#ff9e9e}
      .sd-signature-panel button:disabled{opacity:.4}
      .sd-signature-panel button:focus-visible,.sd-signature-panel input:focus-visible{outline:2px solid #91c3ff;outline-offset:2px}
    `}</style>
    <div className="sd-signature-title">
      <button type="button" aria-label="Back to Insert" onPointerDown={event => event.preventDefault()} onClick={onBack}><ChevronLeft size={22} /></button>
      <PenLine size={21} /> Signature
    </div>
    <div className="sd-signature-pad">
      <canvas ref={canvasRef} width={720} height={270} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end} aria-label="Draw your signature" />
      {!hasInk ? <div className="sd-signature-hint">Draw your signature here</div> : null}
    </div>
    <div className="sd-signature-toolbar">
      <button type="button" disabled={disabled || !hasInk} onPointerDown={event => event.preventDefault()} onClick={undo}><Undo2 size={16} /> Undo</button>
      <button type="button" disabled={disabled || !hasInk} onPointerDown={event => event.preventDefault()} onClick={clear}><Eraser size={16} /> Clear</button>
    </div>
    <div className="sd-insert-card">
      <div className="sd-insert-setting-row"><span>Ink color</span><div className="sd-signature-colors">{COLORS.map(ink => <button type="button" key={ink} className={`sd-signature-color ${color === ink ? 'is-selected' : ''}`} aria-label={ink} aria-pressed={color === ink} disabled={disabled} onPointerDown={event => event.preventDefault()} onClick={() => setColor(ink)}><span style={{ background: ink }} /></button>)}</div></div>
      <div className="sd-insert-setting-row"><span>Pen size</span><input className="sd-signature-thickness" type="range" min="2" max="9" step="1" value={thickness} aria-label="Pen size" disabled={disabled} onChange={event => setThickness(Number(event.target.value))} /></div>
      <div className="sd-insert-setting-row"><span>Width</span><div className="sd-insert-options">{WIDTHS.map(size => <button type="button" key={size} className={width === size ? 'is-selected' : ''} aria-pressed={width === size} disabled={disabled} onPointerDown={event => event.preventDefault()} onClick={() => setWidth(size)}>{size}%</button>)}</div></div>
      <div className="sd-insert-setting-row"><span>Alignment</span><div className="sd-insert-options">{ALIGNS.map(({ value, Icon }) => <button type="button" key={value} aria-label={value} aria-pressed={align === value} className={align === value ? 'is-selected' : ''} disabled={disabled} onPointerDown={event => event.preventDefault()} onClick={() => setAlign(value)}><Icon size={18} /></button>)}</div></div>
    </div>
    {error ? <p role="alert" className="sd-signature-error">{error}</p> : null}
    <button type="button" className="sd-insert-submit" disabled={disabled || !hasInk || typeof onInsert !== 'function'} onPointerDown={event => event.preventDefault()} onClick={insert}><PenLine size={19} /> Insert Signature</button>
    <p className="sd-insert-help">The signature will be inserted as a transparent PNG image. It stays in this document.</p>
  </section>
}
