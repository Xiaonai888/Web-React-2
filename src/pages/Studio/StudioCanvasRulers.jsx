import { useEffect, useMemo, useState } from 'react'

const RULER_SIZE = 24
const EMPTY = { width: 0, height: 0, left: 0, top: 0, canvasWidth: 0, canvasHeight: 0, scaleX: 1, scaleY: 1 }

function majorStep(scale) {
  if (!Number.isFinite(scale) || scale <= 0) return 100
  const required = 86 / scale
  const base = 10 ** Math.floor(Math.log10(required))
  return [1, 2, 5, 10].map((n) => n * base).find((step) => step >= required) || base * 10
}

function axisTicks(length, offset, scale, viewport) {
  if (!(length > 0 && scale > 0 && viewport > 0)) return []
  const major = majorStep(scale)
  const minor = major / 5
  const first = Math.max(0, Math.ceil((-offset / scale) / minor - 0.000001))
  const last = Math.min(Math.floor(length / minor), Math.floor(((viewport - offset) / scale) / minor))
  const result = []
  for (let index = first; index <= last && result.length < 250; index += 1) {
    const value = Math.round(index * minor * 1000) / 1000
    result.push({ value, at: offset + value * scale, major: index % 5 === 0 })
  }
  return result
}

export default function StudioCanvasRulers({ workRef, canvasRef, paperId, zoom, rotation = 0 }) {
  const [measure, setMeasure] = useState(EMPTY)

  useEffect(() => {
    const work = workRef.current
    const canvas = canvasRef.current
    if (!work || !canvas) return undefined
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const outer = work.getBoundingClientRect()
        const inner = canvas.getBoundingClientRect()
        const quarterTurn = Math.abs(Math.round(rotation / 90)) % 2 === 1
        const logicalWidth = quarterTurn ? canvas.height : canvas.width
        const logicalHeight = quarterTurn ? canvas.width : canvas.height
        setMeasure({
          width: work.clientWidth,
          height: work.clientHeight,
          left: inner.left - outer.left - work.clientLeft,
          top: inner.top - outer.top - work.clientTop,
          canvasWidth: logicalWidth,
          canvasHeight: logicalHeight,
          scaleX: inner.width / Math.max(1, logicalWidth),
          scaleY: inner.height / Math.max(1, logicalHeight),
        })
      })
    }
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)
    observer?.observe(work)
    observer?.observe(canvas)
    work.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      work.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [workRef, canvasRef, paperId, zoom, rotation])

  const xTicks = useMemo(() => axisTicks(measure.canvasWidth, measure.left, measure.scaleX, measure.width), [measure])
  const yTicks = useMemo(() => axisTicks(measure.canvasHeight, measure.top, measure.scaleY, measure.height), [measure])

  return (
    <div className="ss-canvas-rulers" aria-hidden="true" style={{ width: measure.width, height: 0 }}>
      <style>{`
        .shadow-studio .ss-canvas-rulers{
          --ss-ruler-bg:#202832;
          --ss-ruler-bg-2:#29313a;
          --ss-ruler-line:#4b5968;
          --ss-ruler-line-soft:#3b4651;
          --ss-ruler-tick:#8da0b2;
          --ss-ruler-text:#cbd8e4;
          position:sticky;
          top:0;
          left:0;
          z-index:12;
          display:block;
          flex:none;
          overflow:visible;
          pointer-events:none;
          color:var(--ss-ruler-text)
        }
        .shadow-studio .ss-canvas-rulers svg{
          position:absolute;
          display:block;
          overflow:hidden;
          background:linear-gradient(180deg,#27313b,#202832);
          color:var(--ss-ruler-text);
          box-shadow:inset 0 -1px 0 #0003
        }
        .shadow-studio .ss-canvas-ruler-x{
          top:0;
          left:24px;
          border-bottom:1px solid var(--ss-ruler-line)
        }
        .shadow-studio .ss-canvas-ruler-y{
          top:24px;
          left:0;
          border-right:1px solid var(--ss-ruler-line)
        }
        .shadow-studio .ss-canvas-ruler-corner{
          position:absolute;
          top:0;
          left:0;
          width:24px;
          height:24px;
          display:grid;
          place-items:center;
          border-right:1px solid var(--ss-ruler-line);
          border-bottom:1px solid var(--ss-ruler-line);
          background:linear-gradient(180deg,#34404b,#2a333d);
          color:#b9c9d8;
          font:800 8px Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          letter-spacing:.02em;
          box-shadow:inset 0 0 0 1px #ffffff04
        }
        .shadow-studio .ss-canvas-rulers line{
          stroke:var(--ss-ruler-tick);
          stroke-width:1;
          shape-rendering:crispEdges
        }
        .shadow-studio .ss-canvas-rulers text{
          fill:var(--ss-ruler-text);
          font:700 8px Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          paint-order:stroke;
          stroke:#202832;
          stroke-width:2px;
          stroke-linejoin:round
        }
        @media(max-width:640px){
          .shadow-studio .ss-canvas-rulers{display:none}
        }
      `}</style>
      <svg className="ss-canvas-ruler-x" width={Math.max(0, measure.width - RULER_SIZE)} height={RULER_SIZE} viewBox={`0 0 ${Math.max(1, measure.width - RULER_SIZE)} ${RULER_SIZE}`}>
        {xTicks.map(({ value, at, major }) => <g key={`x-${value}`} transform={`translate(${at - RULER_SIZE} 0)`}><line x1="0" x2="0" y1={major ? 14 : 19} y2="24" />{major && <text x="3" y="11">{value}</text>}</g>)}
      </svg>
      <svg className="ss-canvas-ruler-y" width={RULER_SIZE} height={Math.max(0, measure.height - RULER_SIZE)} viewBox={`0 0 ${RULER_SIZE} ${Math.max(1, measure.height - RULER_SIZE)}`}>
        {yTicks.map(({ value, at, major }) => <g key={`y-${value}`} transform={`translate(0 ${at - RULER_SIZE})`}><line x1={major ? 14 : 19} x2="24" y1="0" y2="0" />{major && <text transform="translate(11 -3) rotate(-90)">{value}</text>}</g>)}
      </svg>
      <div className="ss-canvas-ruler-corner" title="Canvas ruler in pixels">px</div>
    </div>
  )
}
