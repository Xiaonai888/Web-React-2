import { useMemo, useRef } from 'react'
import './StudioUIControls.css'

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

function normalizeHex(value) {
  const text = String(value || '').trim()
  if (/^#[0-9a-f]{6}$/i.test(text)) return text.toUpperCase()
  if (/^[0-9a-f]{6}$/i.test(text)) return `#${text.toUpperCase()}`
  return '#000000'
}

function hexToRgb(hex) {
  const value = normalizeHex(hex).slice(1)
  return [parseInt(value.slice(0, 2), 16), parseInt(value.slice(2, 4), 16), parseInt(value.slice(4, 6), 16)]
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0')).join('').toUpperCase()}`
}

function rgbToHsv(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  let h = 0
  if (delta) {
    if (max === r) h = 60 * (((g - b) / delta) % 6)
    else if (max === g) h = 60 * ((b - r) / delta + 2)
    else h = 60 * ((r - g) / delta + 4)
  }
  if (h < 0) h += 360
  return [h, max === 0 ? 0 : delta / max, max]
}

function hsvToRgb(h, s, v) {
  const c = v * s
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = v - c
  let rgb = [0, 0, 0]
  if (h < 60) rgb = [c, x, 0]
  else if (h < 120) rgb = [x, c, 0]
  else if (h < 180) rgb = [0, c, x]
  else if (h < 240) rgb = [0, x, c]
  else if (h < 300) rgb = [x, 0, c]
  else rgb = [c, 0, x]
  return rgb.map((value) => (value + m) * 255)
}

export default function StudioUIColorPicker({
  value = '#000000',
  onChange,
  disabled = false,
  label = 'Color',
  swatches = ['#000000', '#FFFFFF', '#808080', '#FF4D67', '#FFB84D', '#FFE04D', '#56D17B', '#43C4D8', '#4D8DFF', '#925CFF', '#EC62C3'],
  className = '',
}) {
  const planeRef = useRef(null)
  const hex = normalizeHex(value)
  const [r, g, b] = useMemo(() => hexToRgb(hex), [hex])
  const [h, s, v] = useMemo(() => rgbToHsv(r, g, b), [r, g, b])
  const hueColor = rgbToHex(...hsvToRgb(h, 1, 1))

  function emit(nextH, nextS, nextV) {
    if (disabled) return
    onChange?.(rgbToHex(...hsvToRgb((nextH + 360) % 360, clamp(nextS, 0, 1), clamp(nextV, 0, 1))))
  }

  function updatePlane(event) {
    if (disabled || !planeRef.current) return
    const rect = planeRef.current.getBoundingClientRect()
    const nextS = clamp((event.clientX - rect.left) / rect.width, 0, 1)
    const nextV = clamp(1 - (event.clientY - rect.top) / rect.height, 0, 1)
    emit(h, nextS, nextV)
  }

  return (
    <div className={`ss-ui-color-picker ${className}`.trim()} aria-label={label}>
      <div className="ss-ui-color-picker-head"><strong>{label}</strong><span>{hex}</span></div>
      <div
        ref={planeRef}
        className="ss-ui-color-plane"
        style={{ '--ss-ui-picker-hue': hueColor }}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture?.(event.pointerId)
          updatePlane(event)
        }}
        onPointerMove={(event) => {
          if (event.buttons) updatePlane(event)
        }}
      >
        <span className="ss-ui-color-cursor" style={{ left: `${s * 100}%`, top: `${(1 - v) * 100}%` }} />
      </div>
      <label className="ss-ui-hue-row">
        <span>Hue</span>
        <input type="range" min="0" max="359" value={Math.round(h)} disabled={disabled} onChange={(event) => emit(Number(event.target.value), s, v)} />
      </label>
      <div className="ss-ui-color-values">
        <label><span>HEX</span><input value={hex} disabled={disabled} onChange={(event) => {
          const next = event.target.value
          if (/^#[0-9a-f]{6}$/i.test(next)) onChange?.(next.toUpperCase())
        }} /></label>
        <label><span>R</span><input type="number" min="0" max="255" value={r} disabled={disabled} onChange={(event) => onChange?.(rgbToHex(Number(event.target.value), g, b))} /></label>
        <label><span>G</span><input type="number" min="0" max="255" value={g} disabled={disabled} onChange={(event) => onChange?.(rgbToHex(r, Number(event.target.value), b))} /></label>
        <label><span>B</span><input type="number" min="0" max="255" value={b} disabled={disabled} onChange={(event) => onChange?.(rgbToHex(r, g, Number(event.target.value)))} /></label>
      </div>
      <div className="ss-ui-color-swatches">
        {swatches.map((swatch) => <button key={swatch} type="button" disabled={disabled} aria-label={swatch} title={swatch} style={{ background: swatch }} onClick={() => onChange?.(swatch)} />)}
      </div>
      <style>{`
        .ss-ui-color-picker{overflow:hidden;border:1px solid #3b4651;border-radius:8px;background:#20262d;color:#edf3fa;font-family:Inter,system-ui,sans-serif}
        .ss-ui-color-picker-head{height:34px;display:flex;align-items:center;justify-content:space-between;padding:0 10px;border-bottom:1px solid #3b4651;background:#2c3640;font-size:10px}
        .ss-ui-color-picker-head strong{font-size:11px}.ss-ui-color-picker-head span{color:#aab8c6;font-variant-numeric:tabular-nums}
        .ss-ui-color-plane{position:relative;height:165px;margin:10px;border:1px solid #586675;border-radius:6px;background:linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,var(--ss-ui-picker-hue));touch-action:none;cursor:crosshair}
        .ss-ui-color-cursor{position:absolute;width:15px;height:15px;border:2px solid #fff;border-radius:50%;transform:translate(-50%,-50%);box-shadow:0 0 0 1px #000,0 2px 6px #0008;pointer-events:none}
        .ss-ui-hue-row{display:grid;grid-template-columns:36px 1fr;align-items:center;gap:8px;padding:0 10px;color:#aab8c6;font-size:9px;font-weight:700}
        .ss-ui-hue-row input{width:100%;height:18px;appearance:none;background:linear-gradient(90deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00);border-radius:99px;cursor:pointer}
        .ss-ui-hue-row input::-webkit-slider-thumb{appearance:none;width:13px;height:20px;border:2px solid #fff;border-radius:4px;background:#26313c;box-shadow:0 1px 4px #0008}
        .ss-ui-color-values{display:grid;grid-template-columns:1.5fr repeat(3,1fr);gap:6px;padding:10px}
        .ss-ui-color-values label{display:flex;flex-direction:column;gap:3px;color:#8fa0b0;font-size:8px;font-weight:800}
        .ss-ui-color-values input{width:100%;height:28px;padding:0 6px;border:1px solid #4b5968;border-radius:5px;outline:none;background:#171e25;color:#edf3fa;font:600 10px Inter,system-ui,sans-serif}
        .ss-ui-color-values input:focus{border-color:#5faeff}
        .ss-ui-color-swatches{display:grid;grid-template-columns:repeat(11,1fr);gap:5px;padding:0 10px 10px}
        .ss-ui-color-swatches button{aspect-ratio:1;border:1px solid #677686;border-radius:4px;cursor:pointer;box-shadow:inset 0 0 0 1px #0004}
        .ss-ui-color-swatches button:hover:not(:disabled){outline:2px solid #73b9ff;outline-offset:1px}
        @media(max-width:430px){.ss-ui-color-plane{height:140px}.ss-ui-color-values{grid-template-columns:1.4fr repeat(3,1fr);gap:4px}.ss-ui-color-swatches{grid-template-columns:repeat(6,1fr)}}
      `}</style>
    </div>
  )
}
