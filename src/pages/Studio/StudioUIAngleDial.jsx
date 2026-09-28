import { useRef } from 'react'
import './StudioUIControls.css'

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

export default function StudioUIAngleDial({
  value = 0,
  min = -180,
  max = 180,
  step = 1,
  label = 'Angle',
  disabled = false,
  onChange,
  size = 86,
  className = '',
}) {
  const dialRef = useRef(null)
  const normalized = clamp(Number(value) || 0, min, max)
  const radians = (normalized - 90) * Math.PI / 180
  const radius = 31
  const x = 43 + Math.cos(radians) * radius
  const y = 43 + Math.sin(radians) * radius

  function updateFromPointer(event) {
    if (disabled || !dialRef.current) return
    const rect = dialRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    let angle = Math.atan2(event.clientY - cy, event.clientX - cx) * 180 / Math.PI + 90
    while (angle > 180) angle -= 360
    while (angle < -180) angle += 360
    angle = Math.round(angle / step) * step
    onChange?.(clamp(angle, min, max))
  }

  return (
    <div className={`ss-ui-angle ${className}`.trim()}>
      <div className="ss-ui-angle-dial-wrap">
        <svg
          ref={dialRef}
          viewBox="0 0 86 86"
          width={size}
          height={size}
          role="slider"
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={normalized}
          tabIndex={disabled ? -1 : 0}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture?.(event.pointerId)
            updateFromPointer(event)
          }}
          onPointerMove={(event) => {
            if (event.buttons) updateFromPointer(event)
          }}
          onKeyDown={(event) => {
            if (disabled) return
            const delta = event.shiftKey ? step * 10 : step
            if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') onChange?.(clamp(normalized - delta, min, max))
            else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') onChange?.(clamp(normalized + delta, min, max))
            else return
            event.preventDefault()
          }}
        >
          <circle cx="43" cy="43" r="38" className="ss-ui-angle-ring" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((degree) => {
            const angle = (degree - 90) * Math.PI / 180
            const x1 = 43 + Math.cos(angle) * 33
            const y1 = 43 + Math.sin(angle) * 33
            const x2 = 43 + Math.cos(angle) * 37
            const y2 = 43 + Math.sin(angle) * 37
            return <line key={degree} x1={x1} y1={y1} x2={x2} y2={y2} className="ss-ui-angle-tick" />
          })}
          <line x1="43" y1="43" x2={x} y2={y} className="ss-ui-angle-hand" />
          <circle cx="43" cy="43" r="5" className="ss-ui-angle-center" />
        </svg>
      </div>
      <label className="ss-ui-angle-value">
        <span>{label}</span>
        <span><input type="number" min={min} max={max} step={step} value={normalized} disabled={disabled} onChange={(event) => onChange?.(clamp(Number(event.target.value) || 0, min, max))} /><b>°</b></span>
      </label>
      <style>{`
        .ss-ui-angle{display:flex;align-items:center;gap:12px;min-width:0;color:#edf3fa;font-family:Inter,system-ui,sans-serif}
        .ss-ui-angle-dial-wrap{flex:0 0 auto}
        .ss-ui-angle svg{display:block;touch-action:none;cursor:crosshair;outline:none}
        .ss-ui-angle svg:focus-visible{filter:drop-shadow(0 0 3px #5faeff)}
        .ss-ui-angle-ring{fill:#202832;stroke:#596979;stroke-width:2}
        .ss-ui-angle-tick{stroke:#718294;stroke-width:1.5}
        .ss-ui-angle-hand{stroke:#73b9ff;stroke-width:3;stroke-linecap:round}
        .ss-ui-angle-center{fill:#e7f3ff;stroke:#356b9d;stroke-width:2}
        .ss-ui-angle-value{display:flex;flex-direction:column;gap:5px;min-width:85px;color:#aab8c6;font-size:10px;font-weight:700}
        .ss-ui-angle-value>span:last-child{position:relative;display:flex;align-items:center}
        .ss-ui-angle-value input{width:82px;height:31px;padding:0 22px 0 8px;border:1px solid #4b5968;border-radius:5px;outline:none;background:#202832;color:#edf3fa;font:600 11px Inter,system-ui,sans-serif}
        .ss-ui-angle-value input:focus{border-color:#5faeff;box-shadow:0 0 0 2px #5faeff26}
        .ss-ui-angle-value b{position:absolute;right:8px;color:#8fa0b0;font-size:10px}
      `}</style>
    </div>
  )
}
