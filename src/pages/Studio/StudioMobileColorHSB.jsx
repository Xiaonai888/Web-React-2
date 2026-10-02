import { useEffect, useRef, useState } from 'react'
import { hexToHsv, hsvToHex } from './StudioColorPanel'

const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0))

function normalizeHex(value) {
  const text = String(value || '').trim().toUpperCase()
  const source = text.startsWith('#') ? text : `#${text}`
  if (/^#[\dA-F]{6}$/.test(source)) return source
  if (/^#[\dA-F]{3}$/.test(source)) {
    return `#${source[1]}${source[1]}${source[2]}${source[2]}${source[3]}${source[3]}`
  }
  return null
}


function HSBRow({ label, value, min, max, color, disabled, onChange }) {
  const safeValue = clamp(Math.round(value), min, max)

  return (
    <div className="ss-mobile-hsb-row">
      <span className="ss-mobile-hsb-channel">{label}</span>

      <input
        className="ss-mobile-hsb-value"
        type="number"
        min={min}
        max={max}
        step="1"
        inputMode="numeric"
        value={safeValue}
        disabled={disabled}
        aria-label={`${label} value`}
        onChange={(event) => {
          if (event.target.value === '') return
          onChange(clamp(event.target.value, min, max))
        }}
      />

      <button
        type="button"
        className="ss-mobile-hsb-step"
        disabled={disabled || safeValue <= min}
        aria-label={`${label} decrease`}
        onClick={() => onChange(safeValue - 1)}
      >
        −
      </button>

      <input
        className="ss-mobile-hsb-slider"
        type="range"
        min={min}
        max={max}
        step="1"
        value={safeValue}
        disabled={disabled}
        aria-label={`${label} slider`}
        style={{ '--ss-mobile-hsb-accent': color }}
        onChange={(event) => onChange(Number(event.target.value))}
      />

      <button
        type="button"
        className="ss-mobile-hsb-step"
        disabled={disabled || safeValue >= max}
        aria-label={`${label} increase`}
        onClick={() => onChange(safeValue + 1)}
      >
        +
      </button>
    </div>
  )
}

function AlphaRow({ value, disabled, onChange }) {
  const safeValue = clamp(Math.round(value), 0, 100)

  return (
    <div className="ss-mobile-hsb-row ss-mobile-alpha-row">
      <span className="ss-mobile-hsb-channel">A</span>

      <div className="ss-mobile-alpha-value">{safeValue}%</div>

      <button
        type="button"
        className="ss-mobile-hsb-step"
        disabled={disabled || safeValue <= 0}
        aria-label="Alpha decrease"
        onClick={() => onChange(safeValue - 1)}
      >
        −
      </button>

      <div className="ss-mobile-alpha-slider-wrap">
        <span className="ss-mobile-alpha-checker" aria-hidden="true" />
        <input
          className="ss-mobile-hsb-slider ss-mobile-alpha-slider"
          type="range"
          min="0"
          max="100"
          step="1"
          value={safeValue}
          disabled={disabled}
          aria-label="Alpha slider"
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </div>

      <button
        type="button"
        className="ss-mobile-hsb-step"
        disabled={disabled || safeValue >= 100}
        aria-label="Alpha increase"
        onClick={() => onChange(safeValue + 1)}
      >
        +
      </button>
    </div>
  )
}

export default function StudioMobileColorHSB({
  open = true,
  color = '#111111',
  opacity = 100,
  disabled = false,
  onChange,
  onOpacityChange,
  onClose,
  onModeChange,
}) {
  const normalized = normalizeHex(color) || '#111111'
  const [hexDraft, setHexDraft] = useState(normalized)
  const [selectedHue, setSelectedHue] = useState(() => hexToHsv(normalized).h)
  const squareDragRef = useRef(null)
  const wheelDragRef = useRef(null)

  const hsv = hexToHsv(normalized)
  const activeHue = hsv.s > 0 && hsv.v > 0 ? hsv.h : selectedHue
  const hueValue = Math.round(activeHue)
  const saturationValue = Math.round(hsv.s * 100)
  const brightnessValue = Math.round(hsv.v * 100)

  useEffect(() => {
    setHexDraft(normalized)
    const next = hexToHsv(normalized)
    if (next.s > 0 && next.v > 0) setSelectedHue(next.h)
  }, [normalized])

  function applyColor(nextColor) {
    const next = normalizeHex(nextColor)
    if (!next || disabled) return
    onChange?.(next)
  }

  function applyHex() {
    const next = normalizeHex(hexDraft)
    if (next) {
      applyColor(next)
      return
    }
    setHexDraft(normalized)
  }

  function updateHue(nextValue) {
    const nextHue = clamp(nextValue, 0, 359)
    setSelectedHue(nextHue)
    applyColor(hsvToHex(nextHue, hsv.s, hsv.v))
  }

  function updateSaturation(nextValue) {
    const nextSaturation = clamp(nextValue, 0, 100) / 100
    applyColor(hsvToHex(activeHue, nextSaturation, hsv.v))
  }

  function updateBrightness(nextValue) {
    const nextBrightness = clamp(nextValue, 0, 100) / 100
    applyColor(hsvToHex(activeHue, hsv.s, nextBrightness))
  }

  function updateWheel(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = event.clientX - centerX
    const dy = event.clientY - centerY
    const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 450) % 360

    setSelectedHue(angle)
    applyColor(hsvToHex(angle, hsv.s, hsv.v))
  }

  function startWheel(event) {
    if (disabled || (event.pointerType === 'mouse' && event.button !== 0)) return
    event.preventDefault()
    wheelDragRef.current = event.pointerId
    event.currentTarget.setPointerCapture?.(event.pointerId)
    updateWheel(event)
  }

  function moveWheel(event) {
    if (wheelDragRef.current !== event.pointerId) return
    event.preventDefault()
    updateWheel(event)
  }

  function endWheel(event) {
    if (wheelDragRef.current !== event.pointerId) return
    wheelDragRef.current = null
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  function updateSquare(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    const saturation = clamp((event.clientX - rect.left) / rect.width, 0, 1)
    const brightness = 1 - clamp((event.clientY - rect.top) / rect.height, 0, 1)

    applyColor(hsvToHex(activeHue, saturation, brightness))
  }

  function startSquare(event) {
    if (disabled || (event.pointerType === 'mouse' && event.button !== 0)) return
    event.preventDefault()
    squareDragRef.current = event.pointerId
    event.currentTarget.setPointerCapture?.(event.pointerId)
    updateSquare(event)
  }

  function moveSquare(event) {
    if (squareDragRef.current !== event.pointerId) return
    event.preventDefault()
    updateSquare(event)
  }

  function endSquare(event) {
    if (squareDragRef.current !== event.pointerId) return
    squareDragRef.current = null
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  if (!open) return null

  return (
    <section className="ss-mobile-hsb-popup" aria-label="HSB color picker">
      <style>{`
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-popup{
          position:fixed;
          left:8px;
          right:8px;
          bottom:calc(66px + env(safe-area-inset-bottom));
          z-index:88;
          max-height:calc(100dvh - 82px);
          overflow-y:auto;
          box-sizing:border-box;
          border:1px solid rgba(151,164,178,.72);
          border-radius:18px;
          background:rgba(31,37,44,.84);
          color:#f4f7fb;
          padding:12px 12px 8px;
          font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          overscroll-behavior:contain
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-popup *{
          box-sizing:border-box
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-header{
          min-height:42px;
          display:grid;
          grid-template-columns:minmax(0,1fr) auto auto;
          gap:8px;
          align-items:center;
          padding:0 2px 9px;
          border-bottom:1px solid rgba(120,132,144,.32)
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-header strong{
          font-size:16px;
          font-weight:850
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-current{
          display:flex;
          align-items:center;
          min-width:0;
          overflow:hidden;
          border:1px solid rgba(121,134,147,.55);
          border-radius:9px;
          background:rgba(15,19,24,.44)
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-swatch{
          width:52px;
          height:30px;
          flex:0 0 auto;
          border:0;
          border-radius:7px 0 0 7px;
          background:var(--ss-mobile-hsb-current)
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-hex{
          width:82px;
          min-width:0;
          height:30px;
          border:0;
          outline:none;
          background:transparent;
          color:#f4f7fb;
          padding:0 8px;
          font:750 10px Inter,system-ui,sans-serif;
          text-transform:uppercase
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-close{
          width:34px;
          height:34px;
          display:grid;
          place-items:center;
          border:0;
          border-radius:8px;
          background:transparent;
          color:#f5f7fa;
          font-size:25px;
          line-height:1;
          cursor:pointer
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-picker{
          width:min(78vw,310px);
          aspect-ratio:1;
          position:relative;
          margin:12px auto 10px;
          touch-action:none
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-wheel{
          position:absolute;
          inset:0;
          border-radius:50%;
          background:conic-gradient(
            #ff0000,
            #ffff00,
            #00ff00,
            #00ffff,
            #0000ff,
            #ff00ff,
            #ff0000
          );
          touch-action:none;
          cursor:crosshair
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-wheel::after{
          content:'';
          position:absolute;
          inset:16%;
          border-radius:50%;
          background:rgba(20,24,29,.96);
          pointer-events:none
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-wheel-marker{
          position:absolute;
          left:50%;
          top:50%;
          width:24px;
          height:24px;
          border:3px solid #fff;
          border-radius:50%;
          transform:translate(-50%,-50%);
          pointer-events:none;
          z-index:3
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-square{
          position:absolute;
          z-index:2;
          left:50%;
          top:50%;
          width:66%;
          aspect-ratio:1;
          transform:translate(-50%,-50%);
          border:0;
          border-radius:8px;
          background:
            linear-gradient(to top,#000,transparent),
            linear-gradient(to right,#fff,transparent),
            hsl(var(--ss-mobile-hsb-hue) 100% 50%);
          touch-action:none;
          cursor:crosshair
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-square-marker{
          position:absolute;
          width:24px;
          height:24px;
          border:3px solid #fff;
          border-radius:50%;
          transform:translate(-50%,-50%);
          pointer-events:none
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-controls{
          display:grid;
          gap:4px;
          padding:10px 0 8px;
          border-top:1px solid rgba(120,132,144,.32)
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-row{
          min-height:38px;
          display:grid;
          grid-template-columns:20px 50px 34px minmax(0,1fr) 34px;
          gap:6px;
          align-items:center
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-channel{
          color:#f1f5f9;
          font-size:12px;
          font-weight:850;
          text-align:center
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-value,
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-alpha-value{
          width:50px;
          height:30px;
          border:1px solid rgba(105,119,132,.55);
          border-radius:7px;
          outline:none;
          background:rgba(16,20,25,.48);
          color:#f4f7fb;
          padding:0 4px;
          font:750 11px Inter,system-ui,sans-serif;
          text-align:center
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-alpha-value{
          display:grid;
          place-items:center
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-step{
          width:32px;
          height:32px;
          display:grid;
          place-items:center;
          border:0;
          border-radius:50%;
          background:#07090c;
          color:#fff;
          padding:0;
          font:850 21px/1 Inter,system-ui,sans-serif;
          cursor:pointer
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-step:disabled{
          opacity:.35
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-slider{
          width:100%;
          min-width:0;
          margin:0;
          accent-color:var(--ss-mobile-hsb-accent);
          cursor:pointer
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-alpha-slider-wrap{
          position:relative;
          min-width:0;
          height:30px;
          display:flex;
          align-items:center
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-alpha-checker{
          position:absolute;
          left:2px;
          right:2px;
          height:10px;
          border-radius:5px;
          background-color:#fff;
          background-image:
            linear-gradient(45deg,#c9c9c9 25%,transparent 25%),
            linear-gradient(-45deg,#c9c9c9 25%,transparent 25%),
            linear-gradient(45deg,transparent 75%,#c9c9c9 75%),
            linear-gradient(-45deg,transparent 75%,#c9c9c9 75%);
          background-size:10px 10px;
          background-position:0 0,0 5px,5px -5px,-5px 0;
          pointer-events:none
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-alpha-slider{
          position:relative;
          z-index:1;
          background:transparent
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-alpha-row{
          margin-top:5px;
          padding-top:8px;
          border-top:1px solid rgba(120,132,144,.32)
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-tabs{
          min-height:54px;
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
          overflow:hidden;
          margin-top:2px;
          border:1px solid rgba(98,111,124,.52);
          border-radius:12px;
          background:rgba(12,16,20,.66)
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-tabs button{
          min-width:0;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          gap:3px;
          border:0;
          border-right:1px solid rgba(85,98,111,.38);
          background:transparent;
          color:#dce4eb;
          padding:5px 2px;
          font:750 9px Inter,system-ui,sans-serif;
          cursor:pointer
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-tabs button:last-child{
          border-right:0
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-tabs button.active{
          background:rgba(25,67,104,.72);
          color:#4da7ff
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-tabs i{
          font-size:18px
        }

        @media(max-width:380px){
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-popup{
            left:6px;
            right:6px;
            bottom:calc(64px + env(safe-area-inset-bottom));
            padding-left:9px;
            padding-right:9px
          }

          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-picker{
            width:min(72vw,266px)
          }

          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-row{
            grid-template-columns:18px 46px 31px minmax(0,1fr) 31px;
            gap:4px
          }

          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-value,
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-alpha-value{
            width:46px
          }

          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-hsb-step{
            width:30px;
            height:30px
          }
        }
      `}</style>

      <header className="ss-mobile-hsb-header">
        <strong>Color</strong>

        <div className="ss-mobile-hsb-current">
          <span
            className="ss-mobile-hsb-swatch"
            style={{ '--ss-mobile-hsb-current': normalized }}
            aria-hidden="true"
          />
          <input
            className="ss-mobile-hsb-hex"
            type="text"
            maxLength="7"
            spellCheck={false}
            value={hexDraft}
            disabled={disabled}
            aria-label="HEX color"
            onChange={(event) => setHexDraft(event.target.value)}
            onBlur={applyHex}
            onKeyDown={(event) => {
              if (event.key === 'Enter') event.currentTarget.blur()
              if (event.key === 'Escape') {
                setHexDraft(normalized)
                event.currentTarget.blur()
              }
            }}
          />
        </div>

        <button
          type="button"
          className="ss-mobile-hsb-close"
          aria-label="Close color panel"
          onClick={() => onClose?.()}
        >
          ×
        </button>
      </header>

      <div className="ss-mobile-hsb-picker">
        <div
          className="ss-mobile-hsb-wheel"
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label="Hue"
          aria-valuemin="0"
          aria-valuemax="359"
          aria-valuenow={hueValue}
          onPointerDown={startWheel}
          onPointerMove={moveWheel}
          onPointerUp={endWheel}
          onPointerCancel={endWheel}
        >
          <span
            className="ss-mobile-hsb-wheel-marker"
            style={{
              left: `${50 + 43 * Math.sin(activeHue * Math.PI / 180)}%`,
              top: `${50 - 43 * Math.cos(activeHue * Math.PI / 180)}%`,
            }}
          />
        </div>

        <div
          className="ss-mobile-hsb-square"
          role="group"
          aria-label="Saturation and brightness"
          style={{ '--ss-mobile-hsb-hue': activeHue }}
          onPointerDown={startSquare}
          onPointerMove={moveSquare}
          onPointerUp={endSquare}
          onPointerCancel={endSquare}
        >
          <span
            className="ss-mobile-hsb-square-marker"
            style={{
              left: `${hsv.s * 100}%`,
              top: `${(1 - hsv.v) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="ss-mobile-hsb-controls">
        <HSBRow
          label="H"
          value={hueValue}
          min={0}
          max={359}
          color="#b14cff"
          disabled={disabled}
          onChange={updateHue}
        />

        <HSBRow
          label="S"
          value={saturationValue}
          min={0}
          max={100}
          color="#36b7ff"
          disabled={disabled}
          onChange={updateSaturation}
        />

        <HSBRow
          label="B"
          value={brightnessValue}
          min={0}
          max={100}
          color="#ffd43d"
          disabled={disabled}
          onChange={updateBrightness}
        />

        <AlphaRow
          value={opacity}
          disabled={disabled}
          onChange={(value) => onOpacityChange?.(clamp(value, 0, 100))}
        />
      </div>

      <nav className="ss-mobile-hsb-tabs" aria-label="Color mode">
        <button
          type="button"
          aria-label="Palette"
          onClick={() => onModeChange?.('palette')}
        >
          <i className="fa-solid fa-table-cells-large" aria-hidden="true" />
          <span>Palette</span>
        </button>

        <button
          type="button"
          aria-label="RGB"
          onClick={() => onModeChange?.('rgb')}
        >
          <i className="fa-solid fa-circle-nodes" aria-hidden="true" />
          <span>RGB</span>
        </button>

        <button
          type="button"
          className="active"
          aria-current="page"
          aria-label="HSB"
        >
          <i className="fa-solid fa-circle-notch" aria-hidden="true" />
          <span>HSB</span>
        </button>
      </nav>
    </section>
  )
}
