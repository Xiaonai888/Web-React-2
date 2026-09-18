import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('shadowStudio', {
  en: { title: 'Shadow Studio', back: 'Back', brush: 'Brush', eraser: 'Eraser', newCanvas: 'New Canvas', undo: 'Undo', redo: 'Redo', color: 'Color', size: 'Brush Size', opacity: 'Opacity', zoom: 'Zoom', clear: 'Clear', canvas: 'Canvas' },
  km: { title: 'Shadow Studio', back: 'ត្រឡប់ក្រោយ', brush: 'ជក់', eraser: 'ជ័រលុប', newCanvas: 'ផ្ទាំងថ្មី', undo: 'ត្រឡប់ក្រោយ', redo: 'ធ្វើឡើងវិញ', color: 'ពណ៌', size: 'ទំហំជក់', opacity: 'ភាពស្រអាប់', zoom: 'ពង្រីក', clear: 'សម្អាត', canvas: 'ផ្ទាំងគំនូរ' },
  zh: { title: 'Shadow Studio', back: '返回', brush: '画笔', eraser: '橡皮擦', newCanvas: '新建画布', undo: '撤销', redo: '重做', color: '颜色', size: '画笔大小', opacity: '不透明度', zoom: '缩放', clear: '清空', canvas: '画布' },
  ja: { title: 'Shadow Studio', back: '戻る', brush: 'ブラシ', eraser: '消しゴム', newCanvas: '新しいキャンバス', undo: '元に戻す', redo: 'やり直す', color: '色', size: 'ブラシサイズ', opacity: '不透明度', zoom: 'ズーム', clear: 'クリア', canvas: 'キャンバス' },
  ko: { title: 'Shadow Studio', back: '뒤로', brush: '브러시', eraser: '지우개', newCanvas: '새 캔버스', undo: '실행 취소', redo: '다시 실행', color: '색상', size: '브러시 크기', opacity: '불투명도', zoom: '확대', clear: '지우기', canvas: '캔버스' },
})

const W = 1200
const H = 800
const LIMIT = 12
const SWATCHES = ['#111111', '#374151', '#6B7280', '#D1D5DB', '#FFFFFF', '#7F1D1D', '#78350F', '#172554']

function Tool({ active, icon, label, onClick }) {
  return (
    <button type="button" className={`ss-tool ${active ? 'active' : ''}`} onClick={onClick} title={label} aria-label={label}>
      <i className={icon} />
      <span>{label}</span>
    </button>
  )
}

export default function ShadowStudioPage() {
  const navigate = useNavigate()
  const { t: tx } = useDisplayTranslation()
  const canvasRef = useRef(null)
  const drawingRef = useRef(false)
  const lastRef = useRef(null)
  const historyRef = useRef([])
  const redoRef = useRef([])
  const [, refresh] = useState(0)
  const [tool, setTool] = useState('brush')
  const [color, setColor] = useState('#111111')
  const [size, setSize] = useState(8)
  const [opacity, setOpacity] = useState(100)
  const [zoom, setZoom] = useState(75)

  const context = () => canvasRef.current?.getContext('2d', { willReadFrequently: true }) || null

  function snapshot(resetRedo = true) {
    const canvas = canvasRef.current
    const ctx = context()
    if (!canvas || !ctx) return
    historyRef.current = [...historyRef.current, ctx.getImageData(0, 0, canvas.width, canvas.height)].slice(-LIMIT)
    if (resetRedo) redoRef.current = []
    refresh((n) => n + 1)
  }

  function clearCanvas(save = true) {
    const canvas = canvasRef.current
    const ctx = context()
    if (!canvas || !ctx) return
    ctx.save()
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.restore()
    if (save) snapshot()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d', { willReadFrequently: true })
    if (!canvas || !ctx) return
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    historyRef.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)]
    redoRef.current = []
    refresh((n) => n + 1)
  }, [])

  function point(event) {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    }
  }

  function setupStroke(ctx) {
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = size
    ctx.globalAlpha = opacity / 100
    ctx.globalCompositeOperation = 'source-over'
    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color
    ctx.fillStyle = tool === 'eraser' ? '#FFFFFF' : color
  }

  function start(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const canvas = canvasRef.current
    const ctx = context()
    const p = point(event)
    if (!canvas || !ctx || !p) return
    event.preventDefault()
    canvas.setPointerCapture?.(event.pointerId)
    drawingRef.current = true
    lastRef.current = p
    ctx.save()
    setupStroke(ctx)
    ctx.beginPath()
    ctx.arc(p.x, p.y, Math.max(size / 2, 0.5), 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  function draw(event) {
    if (!drawingRef.current) return
    const ctx = context()
    const p = point(event)
    const last = lastRef.current
    if (!ctx || !p || !last) return
    event.preventDefault()
    ctx.save()
    setupStroke(ctx)
    ctx.beginPath()
    ctx.moveTo(last.x, last.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    ctx.restore()
    lastRef.current = p
  }

  function finish(event) {
    if (!drawingRef.current) return
    event.preventDefault()
    drawingRef.current = false
    lastRef.current = null
    const canvas = canvasRef.current
    if (canvas?.hasPointerCapture?.(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
    snapshot()
  }

  function undo() {
    if (historyRef.current.length <= 1) return
    redoRef.current = [...redoRef.current, historyRef.current.pop()].slice(-LIMIT)
    const previous = historyRef.current[historyRef.current.length - 1]
    if (previous) context()?.putImageData(previous, 0, 0)
    refresh((n) => n + 1)
  }

  function redo() {
    if (!redoRef.current.length) return
    const next = redoRef.current.pop()
    historyRef.current = [...historyRef.current, next].slice(-LIMIT)
    context()?.putImageData(next, 0, 0)
    refresh((n) => n + 1)
  }

  const canUndo = historyRef.current.length > 1
  const canRedo = redoRef.current.length > 0

  return (
    <div className="shadow-studio">
      <style>{`
        .shadow-studio{min-height:100vh;background:#e8ebee;color:#20242a;font-family:inherit}.ss-top{position:sticky;top:0;z-index:30;height:58px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 14px;border-bottom:1px solid #d7dce1;background:#f7f8f9}.ss-row{display:flex;align-items:center;gap:8px}.ss-title{margin:0 0 0 4px;font-size:16px;font-weight:800}.ss-btn{height:36px;border:1px solid #d2d7dc;border-radius:9px;background:#fff;color:#262b31;padding:0 11px;font:inherit;font-size:12px;font-weight:700;cursor:pointer}.ss-btn.icon{width:36px;padding:0;display:grid;place-items:center}.ss-btn:disabled{opacity:.35;cursor:default}.ss-layout{display:grid;grid-template-columns:86px minmax(0,1fr) 236px;min-height:calc(100vh - 58px)}.ss-tools{border-right:1px solid #d7dce1;background:#f3f4f5;padding:10px 7px}.ss-tool{width:100%;min-height:62px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;border:1px solid transparent;border-radius:10px;background:transparent;color:#555d66;font:inherit;cursor:pointer}.ss-tool i{font-size:17px}.ss-tool span{font-size:10px;font-weight:700}.ss-tool.active{border-color:#cbd1d7;background:#fff;color:#111827}.ss-work{min-width:0;overflow:auto;padding:28px 28px 72px}.ss-stage{min-width:100%;min-height:calc(100vh - 150px);display:grid;place-items:center}.ss-canvas{display:block;width:${zoom}%;max-width:none;height:auto;background:#fff;box-shadow:0 8px 30px rgba(31,41,55,.14);touch-action:none;cursor:${tool === 'eraser' ? 'cell' : 'crosshair'}}.ss-side{border-left:1px solid #d7dce1;background:#f7f8f9;padding:16px}.ss-section+.ss-section{margin-top:20px;padding-top:18px;border-top:1px solid #e0e4e8}.ss-label{margin:0 0 10px;font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#5a626b}.ss-color{width:100%;height:42px;border:1px solid #cbd1d7;border-radius:9px;background:#fff;padding:3px}.ss-swatches{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-top:9px}.ss-swatch{aspect-ratio:1;border:1px solid #cbd1d7;border-radius:8px;cursor:pointer}.ss-range{display:flex;align-items:center;gap:9px}.ss-range input{min-width:0;flex:1;accent-color:#4b5563}.ss-value{width:44px;text-align:right;font-size:11px;font-weight:800;color:#555d66}.ss-bottom{position:fixed;left:86px;right:236px;bottom:0;z-index:20;min-height:48px;display:flex;align-items:center;justify-content:center;border-top:1px solid #d7dce1;background:rgba(248,249,250,.96);backdrop-filter:blur(8px);padding:7px 12px}.ss-controls{width:min(760px,100%);display:flex;align-items:center;gap:15px}.ss-control{min-width:0;flex:1;display:flex;align-items:center;gap:7px}.ss-control label{font-size:10px;font-weight:800;color:#5a626b}.ss-control input{min-width:60px;flex:1;accent-color:#4b5563}.dark .shadow-studio{background:#1d2025;color:#f3f4f6}.dark .ss-top,.dark .ss-bottom{border-color:#343940;background:rgba(32,35,40,.96)}.dark .ss-tools,.dark .ss-side{border-color:#343940;background:#24282e}.dark .ss-btn,.dark .ss-tool.active{border-color:#424850;background:#2c3138;color:#f3f4f6}.dark .ss-tool{color:#c4c9d0}.dark .ss-section+.ss-section{border-color:#3a4047}.dark .ss-label,.dark .ss-value,.dark .ss-control label{color:#b5bbc3}@media(max-width:900px){.ss-layout{grid-template-columns:72px minmax(0,1fr)}.ss-side{display:none}.ss-bottom{left:72px;right:0}.ss-work{padding:18px 18px 68px}}@media(max-width:640px){.ss-title{font-size:14px}.ss-top{padding:0 9px}.ss-btn span{display:none}.ss-layout{display:block}.ss-tools{position:sticky;top:58px;z-index:25;display:flex;gap:6px;overflow-x:auto;border-right:0;border-bottom:1px solid #d7dce1;padding:7px}.ss-tool{width:72px;min-width:72px;min-height:50px}.ss-work{padding:12px 12px 66px}.ss-bottom{left:0}.ss-controls{gap:8px}.ss-control label{display:none}}
      `}</style>

      <header className="ss-top">
        <div className="ss-row">
          <button type="button" className="ss-btn icon" onClick={() => navigate(-1)} title={tx('shadowStudio.back')} aria-label={tx('shadowStudio.back')}><i className="fa-solid fa-arrow-left" /></button>
          <h1 className="ss-title">{tx('shadowStudio.title')}</h1>
        </div>
        <div className="ss-row">
          <button type="button" className="ss-btn icon" onClick={undo} disabled={!canUndo} title={tx('shadowStudio.undo')} aria-label={tx('shadowStudio.undo')}><i className="fa-solid fa-rotate-left" /></button>
          <button type="button" className="ss-btn icon" onClick={redo} disabled={!canRedo} title={tx('shadowStudio.redo')} aria-label={tx('shadowStudio.redo')}><i className="fa-solid fa-rotate-right" /></button>
          <button type="button" className="ss-btn" onClick={() => clearCanvas()}><i className="fa-regular fa-file" /> <span>{tx('shadowStudio.newCanvas')}</span></button>
        </div>
      </header>

      <main className="ss-layout">
        <aside className="ss-tools">
          <Tool active={tool === 'brush'} icon="fa-solid fa-paintbrush" label={tx('shadowStudio.brush')} onClick={() => setTool('brush')} />
          <Tool active={tool === 'eraser'} icon="fa-solid fa-eraser" label={tx('shadowStudio.eraser')} onClick={() => setTool('eraser')} />
        </aside>

        <section className="ss-work">
          <div className="ss-stage">
            <canvas ref={canvasRef} className="ss-canvas" width={W} height={H} aria-label={tx('shadowStudio.canvas')} onPointerDown={start} onPointerMove={draw} onPointerUp={finish} onPointerCancel={finish} />
          </div>
        </section>

        <aside className="ss-side">
          <section className="ss-section">
            <h2 className="ss-label">{tx('shadowStudio.color')}</h2>
            <input className="ss-color" type="color" value={color} onChange={(e) => { setColor(e.target.value); setTool('brush') }} />
            <div className="ss-swatches">
              {SWATCHES.map((swatch) => <button key={swatch} type="button" className="ss-swatch" style={{ background: swatch }} onClick={() => { setColor(swatch); setTool('brush') }} aria-label={swatch} />)}
            </div>
          </section>
          <section className="ss-section">
            <h2 className="ss-label">{tx('shadowStudio.size')}</h2>
            <div className="ss-range"><input type="range" min="1" max="80" value={size} onChange={(e) => setSize(Number(e.target.value))} /><span className="ss-value">{size}px</span></div>
          </section>
          <section className="ss-section">
            <h2 className="ss-label">{tx('shadowStudio.opacity')}</h2>
            <div className="ss-range"><input type="range" min="10" max="100" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} /><span className="ss-value">{opacity}%</span></div>
          </section>
          <section className="ss-section"><button type="button" className="ss-btn" onClick={() => clearCanvas()}>{tx('shadowStudio.clear')}</button></section>
        </aside>
      </main>

      <footer className="ss-bottom">
        <div className="ss-controls">
          <div className="ss-control"><label>{tx('shadowStudio.size')}</label><input type="range" min="1" max="80" value={size} onChange={(e) => setSize(Number(e.target.value))} /><span className="ss-value">{size}px</span></div>
          <div className="ss-control"><label>{tx('shadowStudio.opacity')}</label><input type="range" min="10" max="100" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} /><span className="ss-value">{opacity}%</span></div>
          <div className="ss-control"><label>{tx('shadowStudio.zoom')}</label><input type="range" min="35" max="125" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} /><span className="ss-value">{zoom}%</span></div>
        </div>
      </footer>
    </div>
  )
}
