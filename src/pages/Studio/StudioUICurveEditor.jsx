import { useMemo, useRef, useState } from 'react'
import './StudioUIControls.css'

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
const normalizePoints = (points) => [...(points || [[0, 0], [255, 255]])]
  .map(([x, y]) => [clamp(Number(x) || 0, 0, 255), clamp(Number(y) || 0, 0, 255)])
  .sort((a, b) => a[0] - b[0])

export default function StudioUICurveEditor({
  points = [[0, 0], [255, 255]],
  onChange,
  disabled = false,
  channel = 'rgb',
  size = 260,
  label = 'Curves',
  className = '',
}) {
  const svgRef = useRef(null)
  const [dragIndex, setDragIndex] = useState(-1)
  const normalized = useMemo(() => normalizePoints(points), [points])
  const color = channel === 'r' ? '#ff6f7d' : channel === 'g' ? '#6ed58b' : channel === 'b' ? '#6f9fff' : '#d7e8fa'
  const polyline = normalized.map(([x, y]) => `${x},${255 - y}`).join(' ')

  function pointFromEvent(event) {
    const svg = svgRef.current
    if (!svg) return [0, 0]
    const rect = svg.getBoundingClientRect()
    const x = clamp((event.clientX - rect.left) / rect.width * 255, 0, 255)
    const y = clamp(255 - (event.clientY - rect.top) / rect.height * 255, 0, 255)
    return [Math.round(x), Math.round(y)]
  }

  function updatePoint(index, point) {
    if (disabled) return
    const next = normalized.map((item) => [...item])
    const minX = index === 0 ? 0 : next[index - 1][0] + 1
    const maxX = index === next.length - 1 ? 255 : next[index + 1][0] - 1
    next[index] = [clamp(point[0], minX, maxX), clamp(point[1], 0, 255)]
    onChange?.(next)
  }

  function addPoint(event) {
    if (disabled || event.target.closest('[data-curve-point]')) return
    const point = pointFromEvent(event)
    const next = [...normalized, point].sort((a, b) => a[0] - b[0])
    onChange?.(next)
  }

  function removePoint(index) {
    if (disabled || index === 0 || index === normalized.length - 1 || normalized.length <= 2) return
    onChange?.(normalized.filter((_, itemIndex) => itemIndex !== index))
  }

  return (
    <div className={`ss-ui-curve ${className}`.trim()} style={{ '--ss-ui-curve-size': `${size}px` }}>
      <div className="ss-ui-curve-head">
        <span>{label}</span>
        <span>{channel.toUpperCase()}</span>
      </div>
      <svg
        ref={svgRef}
        viewBox="0 0 255 255"
        role="img"
        aria-label={`${label} ${channel}`}
        onDoubleClick={addPoint}
        onPointerMove={(event) => {
          if (dragIndex < 0 || disabled) return
          event.preventDefault()
          updatePoint(dragIndex, pointFromEvent(event))
        }}
        onPointerUp={() => setDragIndex(-1)}
        onPointerCancel={() => setDragIndex(-1)}
        onPointerLeave={() => setDragIndex(-1)}
      >
        <rect x="0" y="0" width="255" height="255" className="ss-ui-curve-bg" />
        {[63.75, 127.5, 191.25].map((value) => <path key={`v${value}`} d={`M ${value} 0 V 255`} className="ss-ui-curve-grid" />)}
        {[63.75, 127.5, 191.25].map((value) => <path key={`h${value}`} d={`M 0 ${value} H 255`} className="ss-ui-curve-grid" />)}
        <path d="M 0 255 L 255 0" className="ss-ui-curve-diagonal" />
        <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.4" vectorEffect="non-scaling-stroke" />
        {normalized.map(([x, y], index) => (
          <circle
            key={`${x}-${y}-${index}`}
            data-curve-point
            cx={x}
            cy={255 - y}
            r="5.5"
            fill={dragIndex === index ? '#fff' : color}
            stroke="#13202b"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            tabIndex={disabled ? -1 : 0}
            role="button"
            aria-label={`Curve point ${index + 1}: ${x}, ${Math.round(y)}`}
            onPointerDown={(event) => {
              if (disabled) return
              event.currentTarget.setPointerCapture?.(event.pointerId)
              setDragIndex(index)
            }}
            onDoubleClick={(event) => {
              event.stopPropagation()
              removePoint(index)
            }}
            onKeyDown={(event) => {
              if (disabled) return
              const step = event.shiftKey ? 10 : 1
              if (event.key === 'ArrowLeft') updatePoint(index, [x - step, y])
              else if (event.key === 'ArrowRight') updatePoint(index, [x + step, y])
              else if (event.key === 'ArrowUp') updatePoint(index, [x, y + step])
              else if (event.key === 'ArrowDown') updatePoint(index, [x, y - step])
              else if (event.key === 'Delete' || event.key === 'Backspace') removePoint(index)
              else return
              event.preventDefault()
            }}
          />
        ))}
      </svg>
      <div className="ss-ui-curve-foot">Double-click to add · Double-click a middle point to remove</div>
      <style>{`
        .ss-ui-curve{width:min(100%,var(--ss-ui-curve-size));overflow:hidden;border:1px solid #3b4651;border-radius:8px;background:#171d23;color:#edf3fa}
        .ss-ui-curve-head{height:30px;display:flex;align-items:center;justify-content:space-between;padding:0 9px;border-bottom:1px solid #3b4651;background:#29323c;color:#aab8c6;font:700 9px Inter,system-ui,sans-serif;text-transform:uppercase;letter-spacing:.04em}
        .ss-ui-curve svg{display:block;width:100%;aspect-ratio:1;touch-action:none}
        .ss-ui-curve-bg{fill:#171d23}
        .ss-ui-curve-grid{stroke:#33404b;stroke-width:1;vector-effect:non-scaling-stroke}
        .ss-ui-curve-diagonal{stroke:#42515f;stroke-width:1;stroke-dasharray:4 4;vector-effect:non-scaling-stroke}
        .ss-ui-curve circle{cursor:grab;outline:none}
        .ss-ui-curve circle:focus-visible{stroke:#fff;stroke-width:3}
        .ss-ui-curve-foot{padding:6px 8px;border-top:1px solid #3b4651;color:#8898a8;font:500 9px Inter,system-ui,sans-serif}
      `}</style>
    </div>
  )
}
