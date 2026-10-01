import { useEffect, useRef, useState } from 'react'
import { hexToHsv, hsvToHex } from './StudioColorPanel'

const FAVORITES_KEY = 'shadow-studio-color-favorites-v1'
const RECENTS_KEY = 'shadow-studio-color-recent-v1'

const PALETTE = [
  '#111111', '#252525', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB', '#FFFFFF',
  '#7F1D1D', '#DC2626', '#EF4444', '#FCA5A5', '#78350F', '#EA580C', '#F97316', '#FDBA74',
  '#854D0E', '#EAB308', '#FACC15', '#FEF08A', '#14532D', '#16A34A', '#22C55E', '#86EFAC',
  '#164E63', '#0891B2', '#06B6D4', '#A5F3FC', '#172554', '#2563EB', '#3B82F6', '#93C5FD',
  '#4C1D95', '#7C3AED', '#8B5CF6', '#C4B5FD', '#831843', '#DB2777', '#EC4899', '#F9A8D4',
]

const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0))

function normalizeHex(value) {
  const text = String(value || '').trim().toUpperCase()
  const source = text.startsWith('#') ? text : `#${text}`
  if (/^#[\dA-F]{6}$/.test(source)) return source
  if (/^#[\dA-F]{3}$/.test(source)) return `#${source[1]}${source[1]}${source[2]}${source[2]}${source[3]}${source[3]}`
  return null
}

function readColors(key, limit) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || '[]')
    if (!Array.isArray(value)) return []
    return [...new Set(value.map(normalizeHex).filter(Boolean))].slice(0, limit)
  } catch {
    return []
  }
}

function hexToRgb(hex) {
  const safe = normalizeHex(hex) || '#111111'
  return [1, 3, 5].map((index) => parseInt(safe.slice(index, index + 2), 16))
}

function rgbToHex(values) {
  return `#${values.map((value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0')).join('')}`.toUpperCase()
}

function NumericRow({ label, value, min, max, color, onChange }) {
  return (
    <div className="ss-mobile-color-row">
      <span>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step="1"
        value={value}
        style={{ '--ss-mobile-color-row-accent': color }}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <input
        type="number"
        min={min}
        max={max}
        step="1"
        inputMode="numeric"
        value={value}
        onChange={(event) => {
          if (event.target.value === '') return
          onChange(clamp(event.target.value, min, max))
        }}
      />
    </div>
  )
}

export default function StudioMobileColorPopup({
  open = false,
  color = '#111111',
  disabled = false,
  onChange,
}) {
  const [tab, setTab] = useState('rgb')
  const [hexDraft, setHexDraft] = useState(color.toUpperCase())
  const [favorites, setFavorites] = useState(() => readColors(FAVORITES_KEY, 12))
  const [recents, setRecents] = useState(() => readColors(RECENTS_KEY, 8))
  const [selectedHue, setSelectedHue] = useState(() => hexToHsv(color).h)
  const dragRef = useRef(null)

  const normalized = normalizeHex(color) || '#111111'
  const hsv = hexToHsv(normalized)
  const hue = hsv.s > 0 && hsv.v > 0 ? hsv.h : selectedHue
  const rgb = hexToRgb(normalized)

  useEffect(() => {
    setHexDraft(normalized)
    const next = hexToHsv(normalized)
    if (next.s > 0 && next.v > 0) setSelectedHue(next.h)
  }, [normalized])

  useEffect(() => {
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    } catch {
      return
    }
  }, [favorites])

  useEffect(() => {
    try {
      window.localStorage.setItem(RECENTS_KEY, JSON.stringify(recents))
    } catch {
      return
    }
  }, [recents])

  function remember(next) {
    const safe = normalizeHex(next)
    if (!safe) return
    setRecents((current) => [safe, ...current.filter((item) => item !== safe)].slice(0, 8))
  }

  function apply(next, saveRecent = true) {
    const safe = normalizeHex(next)
    if (!safe || disabled) return
    onChange?.(safe)
    if (saveRecent) remember(safe)
  }

  function updateHue(nextHue, saveRecent = true) {
    const next = clamp(nextHue, 0, 359)
    setSelectedHue(next)
    apply(hsvToHex(next, hsv.s, hsv.v), saveRecent)
  }

  function updateSquare(event, rememberAtEnd = false) {
    const rect = event.currentTarget.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const saturation = clamp((event.clientX - rect.left) / rect.width, 0, 1)
    const brightness = 1 - clamp((event.clientY - rect.top) / rect.height, 0, 1)
    const next = hsvToHex(hue, saturation, brightness)
    if (dragRef.current) dragRef.current.color = next
    apply(next, rememberAtEnd)
  }

  function startSquare(event) {
    if (disabled || (event.pointerType === 'mouse' && event.button !== 0)) return
    event.preventDefault()
    dragRef.current = { id: event.pointerId, color: normalized }
    event.currentTarget.setPointerCapture?.(event.pointerId)
    updateSquare(event)
  }

  function moveSquare(event) {
    if (dragRef.current?.id !== event.pointerId) return
    event.preventDefault()
    updateSquare(event)
  }

  function endSquare(event) {
    if (dragRef.current?.id !== event.pointerId) return
    const last = dragRef.current.color
    dragRef.current = null
    remember(last)
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  function applyHex() {
    const next = normalizeHex(hexDraft)
    if (next) apply(next)
    else setHexDraft(normalized)
  }

  function updateRgb(channel, nextValue) {
    const next = [...rgb]
    next[channel] = clamp(nextValue, 0, 255)
    apply(rgbToHex(next))
  }

  function updateHsb(channel, nextValue) {
    if (channel === 'h') {
      updateHue(nextValue)
      return
    }
    const saturation = channel === 's' ? clamp(nextValue, 0, 100) / 100 : hsv.s
    const brightness = channel === 'b' ? clamp(nextValue, 0, 100) / 100 : hsv.v
    apply(hsvToHex(hue, saturation, brightness))
  }

  function addFavorite() {
    if (favorites.length >= 12 || favorites.includes(normalized)) return
    setFavorites((current) => [...current, normalized])
  }

  if (!open) return null

  return (
    <section className="ss-mobile-color-popup" aria-label="Color">
      <style>{`
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-popup{
          position:fixed;
          z-index:86;
          left:8px;
          right:8px;
          bottom:calc(76px + env(safe-area-inset-bottom));
          max-height:min(68dvh,620px);
          display:flex;
          flex-direction:column;
          overflow:hidden;
          box-sizing:border-box;
          border:1px solid #38424c;
          border-radius:10px;
          background:#171d24;
          color:#eef4fa;
          font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif
        }
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-popup *{box-sizing:border-box}
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-head{
          flex:0 0 auto;
          min-height:43px;
          display:flex;
          align-items:center;
          gap:8px;
          padding:7px 10px;
          border-bottom:1px solid #313b45;
          background:#1d252d
        }
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-head strong{
          flex:1;
          font-size:11px;
          font-weight:850
        }
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-current{
          width:28px;
          height:28px;
          border:1px solid #71808d;
          border-radius:5px;
        }
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-hex{
          width:76px;
          height:28px;
          border:1px solid #455461;
          border-radius:5px;
          outline:none;
          background:#11171d;
          color:#f2f6fa;
          padding:0 6px;
          font:750 9px Inter,system-ui,sans-serif;
          text-transform:uppercase
        }
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-hex:focus{
          border-color:#5faeff;
        }
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-body{
          min-height:0;
          overflow-y:auto;
          overscroll-behavior:contain;
          padding:10px
        }
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-picker-wrap{
          display:grid;
          grid-template-columns:minmax(0,1fr);
          justify-items:center;
          gap:9px
        }
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-square{
          position:relative;
          width:min(62vw,250px);
          max-width:100%;
          aspect-ratio:1;
          overflow:hidden;
          border:1px solid #71808c;
          border-radius:6px;
          background:
            linear-gradient(to top,#000,transparent),
            linear-gradient(to right,#fff,transparent),
            hsl(var(--ss-mobile-color-hue) 100% 50%);
          touch-action:none;
          cursor:crosshair
        }
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-square-marker{
          position:absolute;
          width:16px;
          height:16px;
          border:2px solid #fff;
          border-radius:50%;
          transform:translate(-50%,-50%);
          pointer-events:none
        }
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-hue{
          width:min(100%,300px);
          height:24px;
          accent-color:#fff;
          background:linear-gradient(90deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)
        }
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-row{
          display:grid;
          grid-template-columns:24px minmax(0,1fr) 48px;
          gap:7px;
          align-items:center;
          min-height:39px;
          border-top:1px solid #2e3943
        }
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-row:first-child{border-top:0}
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-row>span{
          color:#c8d4df;
          font-size:9px;
          font-weight:850;
          text-align:center
        }
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-row input[type=range]{
          width:100%;
          min-width:0;
          accent-color:var(--ss-mobile-color-row-accent,#5faeff)
        }
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-row input[type=number]{
          width:48px;
          height:27px;
          border:1px solid #44515d;
          border-radius:5px;
          outline:none;
          background:#11171d;
          color:#f1f5f9;
          padding:0 4px;
          font:750 9px Inter,system-ui,sans-serif;
          text-align:center
        }
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-controls{
          width:100%;
          margin-top:9px;
          overflow:hidden;
          border:1px solid #303b46;
          border-radius:8px;
          background:#202832
        }
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-palette-grid{
          display:grid;
          grid-template-columns:repeat(8,minmax(0,1fr));
          gap:5px
        }
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-swatch{
          width:100%;
          min-width:0;
          aspect-ratio:1;
          border:1px solid #687582;
          border-radius:5px;
          padding:0;
          cursor:pointer;
        }
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-swatch.active{
          outline:2px solid #65b4ff;
          outline-offset:1px;
        }
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-group{
          margin-top:10px;
          padding:8px;
          border:1px solid #303b46;
          border-radius:8px;
          background:#202832
        }
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-group-head{
          min-height:28px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:8px;
          margin-bottom:7px
        }
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-group-head strong{
          color:#d8e2eb;
          font-size:9px
        }
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-group-head button{
          min-height:27px;
          border:1px solid #526576;
          border-radius:5px;
          background:#2e3b47;
          color:#eef5fb;
          padding:0 8px;
          font:750 8px Inter,system-ui,sans-serif
        }
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-saved{
          display:grid;
          grid-template-columns:repeat(8,minmax(0,1fr));
          gap:6px
        }
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-empty{
          margin:0;
          color:#91a1af;
          font-size:8px
        }
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-tabs{
          flex:0 0 auto;
          min-height:52px;
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
          border-top:1px solid #313b45;
          background:#10161c
        }
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-tabs button{
          min-width:0;
          border:0;
          border-right:1px solid #29333c;
          background:transparent;
          color:#a9b6c2;
          font:800 9px Inter,system-ui,sans-serif
        }
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-tabs button:last-child{border-right:0}
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-tabs button.active{
          background:#1e3f61;
          color:#69b7ff
        }
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-tabs button i{
          display:block;
          margin-bottom:3px;
          font-size:15px
        }
        @media(max-width:380px){
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-square{width:min(58vw,205px)}
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-body{padding:8px}
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-palette-grid,
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-saved{grid-template-columns:repeat(7,minmax(0,1fr))}
        }
      `}</style>

      <header className="ss-mobile-color-head">
        <strong>Color</strong>
        <span className="ss-mobile-color-current" style={{ backgroundColor: normalized }} />
        <input
          className="ss-mobile-color-hex"
          type="text"
          maxLength="7"
          spellCheck={false}
          value={hexDraft}
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
      </header>

      <div className="ss-mobile-color-body">
        {tab === 'palette' ? (
          <>
            <div className="ss-mobile-color-palette-grid" aria-label="Color palette">
              {PALETTE.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`ss-mobile-color-swatch ${normalized === item ? 'active' : ''}`}
                  style={{ backgroundColor: item }}
                  aria-label={`Use ${item}`}
                  onClick={() => apply(item)}
                />
              ))}
            </div>

            <div className="ss-mobile-color-group">
              <div className="ss-mobile-color-group-head">
                <strong>My Palette · {favorites.length}/12</strong>
                <button type="button" disabled={favorites.length >= 12 || favorites.includes(normalized)} onClick={addFavorite}>+ Save color</button>
              </div>
              {favorites.length ? (
                <div className="ss-mobile-color-saved">
                  {favorites.map((item) => (
                    <button
                      type="button"
                      key={item}
                      className={`ss-mobile-color-swatch ${normalized === item ? 'active' : ''}`}
                      style={{ backgroundColor: item }}
                      onClick={() => apply(item)}
                      onDoubleClick={() => setFavorites((current) => current.filter((saved) => saved !== item))}
                      aria-label={`Use saved color ${item}`}
                    />
                  ))}
                </div>
              ) : <p className="ss-mobile-color-empty">Choose a color, then save it here.</p>}
            </div>

            <div className="ss-mobile-color-group">
              <div className="ss-mobile-color-group-head">
                <strong>Recent Colors</strong>
                <button type="button" disabled={!recents.length} onClick={() => setRecents([])}>Clear</button>
              </div>
              {recents.length ? (
                <div className="ss-mobile-color-saved">
                  {recents.map((item) => (
                    <button
                      type="button"
                      key={item}
                      className={`ss-mobile-color-swatch ${normalized === item ? 'active' : ''}`}
                      style={{ backgroundColor: item }}
                      onClick={() => apply(item)}
                      aria-label={`Use recent color ${item}`}
                    />
                  ))}
                </div>
              ) : <p className="ss-mobile-color-empty">Colors you pick will appear here.</p>}
            </div>
          </>
        ) : (
          <div className="ss-mobile-color-picker-wrap">
            <div
              className="ss-mobile-color-square"
              style={{ '--ss-mobile-color-hue': hue }}
              role="slider"
              aria-label="Saturation and brightness"
              onPointerDown={startSquare}
              onPointerMove={moveSquare}
              onPointerUp={endSquare}
              onPointerCancel={endSquare}
            >
              <span
                className="ss-mobile-color-square-marker"
                style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%` }}
              />
            </div>

            <input
              className="ss-mobile-color-hue"
              type="range"
              min="0"
              max="359"
              step="1"
              value={Math.round(hue)}
              aria-label="Hue"
              onChange={(event) => updateHue(Number(event.target.value))}
            />

            <div className="ss-mobile-color-controls">
              {tab === 'rgb' ? (
                <>
                  <NumericRow label="R" value={rgb[0]} min={0} max={255} color="#ff4242" onChange={(value) => updateRgb(0, value)} />
                  <NumericRow label="G" value={rgb[1]} min={0} max={255} color="#38d66b" onChange={(value) => updateRgb(1, value)} />
                  <NumericRow label="B" value={rgb[2]} min={0} max={255} color="#4585ff" onChange={(value) => updateRgb(2, value)} />
                </>
              ) : (
                <>
                  <NumericRow label="H" value={Math.round(hue)} min={0} max={359} color="#b565ff" onChange={(value) => updateHsb('h', value)} />
                  <NumericRow label="S" value={Math.round(hsv.s * 100)} min={0} max={100} color="#42b7ff" onChange={(value) => updateHsb('s', value)} />
                  <NumericRow label="B" value={Math.round(hsv.v * 100)} min={0} max={100} color="#ffd34d" onChange={(value) => updateHsb('b', value)} />
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <nav className="ss-mobile-color-tabs" aria-label="Color mode">
        <button type="button" className={tab === 'palette' ? 'active' : ''} onClick={() => setTab('palette')}>
          <i className="fa-solid fa-table-cells-large" aria-hidden="true" />
          Palette
        </button>
        <button type="button" className={tab === 'rgb' ? 'active' : ''} onClick={() => setTab('rgb')}>
          <i className="fa-solid fa-circle-nodes" aria-hidden="true" />
          RGB
        </button>
        <button type="button" className={tab === 'hsb' ? 'active' : ''} onClick={() => setTab('hsb')}>
          <i className="fa-solid fa-sun" aria-hidden="true" />
          HSB
        </button>
      </nav>
    </section>
  )
}
