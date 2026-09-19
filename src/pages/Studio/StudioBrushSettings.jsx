import { useEffect, useState } from 'react'
import { BRUSH_STYLES } from './StudioBrushEngine'

const STORAGE_KEY = 'shadow-studio-brush-presets-v1'
const MAX_SAVED = 10

const BUILT_IN = [
  { id: 'fine', name: 'Fine line', style: 'pencil', size: 2, opacity: 100 },
  { id: 'sketch', name: 'Light sketch', style: 'pencil', size: 3, opacity: 45 },
  { id: 'ink', name: 'Ink line', style: 'round', size: 7, opacity: 100 },
  { id: 'soft', name: 'Soft stroke', style: 'airbrush', size: 12, opacity: 50 },
  { id: 'marker', name: 'Wide marker', style: 'marker', size: 26, opacity: 65 },
  { id: 'bold', name: 'Bold line', style: 'round', size: 48, opacity: 100 },
]

const clamp = (value, min, max) => Math.min(max, Math.max(min, Math.round(Number(value) || min)))

function readSaved() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
    if (!Array.isArray(stored)) return []
    return stored.filter((item) => item && typeof item.name === 'string' && item.name.trim())
      .slice(0, MAX_SAVED)
      .map((item, index) => ({
        id: String(item.id || `saved-${index}`),
        name: item.name.trim().slice(0, 22),
        style: BRUSH_STYLES.some((style) => style.id === item.style) ? item.style : 'round',
        size: clamp(item.size, 1, 80),
        opacity: clamp(item.opacity, 10, 100),
      }))
  } catch {
    return []
  }
}

export default function StudioBrushSettings({ size, onSizeChange, style = 'round', onStyleChange = () => {}, opacity, onOpacityChange, labels }) {
  const [saved, setSaved] = useState(readSaved)
  const [name, setName] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
    } catch {
      setNotice('This browser cannot save brush presets. Your current brush still works.')
    }
  }, [saved])

  function applyPreset(preset) {
    onStyleChange(preset.style || 'round')
    onSizeChange(preset.size)
    onOpacityChange(preset.opacity)
  }

  function savePreset() {
    const cleanName = name.trim().slice(0, 22)
    if (!cleanName) {
      setNotice('Enter a preset name first.')
      return
    }
    if (saved.length >= MAX_SAVED) {
      setNotice('My Presets is full. Remove one before saving another.')
      return
    }
    setSaved((current) => [...current, {
      id: globalThis.crypto?.randomUUID?.() || `brush-${Date.now()}-${Math.random()}`,
      name: cleanName,
      style,
      size: clamp(size, 1, 80),
      opacity: clamp(opacity, 10, 100),
    }])
    setName('')
    setNotice('Preset saved in this browser.')
  }

  function deletePreset(id) {
    setSaved((current) => current.filter((item) => item.id !== id))
    setNotice('Preset removed.')
  }

  function presetOptions() {
    return (
      <>
        <div className="ss-brush-heading">Brush tip</div>
        <div className="ss-brush-styles" role="group" aria-label="Brush tip style">
          {BRUSH_STYLES.map((option) => (
            <button key={option.id} type="button" className={`ss-brush-style ${style === option.id ? 'active' : ''}`} onClick={() => onStyleChange(option.id)} aria-pressed={style === option.id} title={option.description}>
              <span className={`ss-brush-style-icon ss-brush-style-${option.id}`} aria-hidden="true" />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
        <div className="ss-brush-heading">Quick presets</div>
        <div className="ss-brush-presets" role="group" aria-label="Brush size and opacity presets">
          {BUILT_IN.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={`ss-brush-preset ${style === preset.style && size === preset.size && opacity === preset.opacity ? 'active' : ''}`}
              onClick={() => applyPreset(preset)}
              aria-label={`${preset.name}: ${preset.style} tip, ${preset.size} pixels, ${preset.opacity} percent opacity`}
            >
              <span className="ss-brush-dot" style={{ width: Math.max(3, Math.min(28, preset.size / 2)), height: Math.max(3, Math.min(28, preset.size / 2)), opacity: preset.opacity / 100 }} />
              <span className="ss-brush-preset-name">{preset.name}</span>
              <small>{preset.size}px · {preset.opacity}%</small>
            </button>
          ))}
        </div>
        <div className="ss-brush-heading ss-brush-saved-heading">My Presets · {saved.length}/{MAX_SAVED}</div>
        <div className="ss-brush-save-row">
          <input
            type="text"
            maxLength={22}
            value={name}
            placeholder="Preset name"
            aria-label="New brush preset name"
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); savePreset() } }}
          />
          <button type="button" onClick={savePreset} disabled={saved.length >= MAX_SAVED}>Save</button>
        </div>
        {saved.length ? (
          <div className="ss-brush-saved" role="group" aria-label="My brush presets">
            {saved.map((preset) => (
              <div className="ss-brush-saved-item" key={preset.id}>
                <button type="button" className="ss-brush-saved-use" onClick={() => applyPreset(preset)} title={`Use ${preset.name}`}>
                  <span>{preset.name}</span><small>{preset.style} · {preset.size}px · {preset.opacity}%</small>
                </button>
                <button type="button" className="ss-brush-saved-remove" onClick={() => deletePreset(preset.id)} title={`Remove ${preset.name}`} aria-label={`Remove ${preset.name}`}>×</button>
              </div>
            ))}
          </div>
        ) : null}
        {notice ? <p className="ss-brush-notice" role="status">{notice}</p> : null}
      </>
    )
  }

  return (
    <>
      <section className="ss-section ss-brush-settings" aria-label="Brush settings">
        <style>{`
          .ss-brush-styles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px;margin:8px 0 12px}
          .ss-brush-style{display:flex;min-width:0;align-items:center;gap:7px;min-height:36px;border:1px solid #58636e;border-radius:6px;background:#30353b;color:#eaf0f6;padding:5px 7px;font:inherit;font-size:10px;font-weight:800;cursor:pointer}
          .ss-brush-style.active,.ss-brush-style:focus-visible{outline:none;border-color:#78baff;background:#355371}
          .ss-brush-style-icon{display:inline-block;flex:none;width:14px;height:14px;border-radius:50%;background:#eaf0f6}
          .ss-brush-style-pencil{width:3px;height:14px;border-radius:2px;transform:rotate(35deg)}
          .ss-brush-style-marker{width:16px;height:7px;border-radius:2px;transform:rotate(-35deg)}
          .ss-brush-style-airbrush{width:18px;height:18px;background:radial-gradient(circle,#eaf0f6 0%,rgba(234,240,246,.6) 28%,transparent 72%)}
          .ss-brush-presets{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin:9px 0}
          .ss-brush-heading{margin-top:14px;font-size:10px;font-weight:800;color:#cbd3dc}
          .ss-brush-saved-heading{margin-top:15px}
          .ss-brush-preset{display:flex;min-width:0;min-height:78px;flex-direction:column;align-items:center;justify-content:center;gap:4px;border:1px solid #515b66;border-radius:7px;background:#30353b;color:#e3e8ee;padding:7px 4px;font:inherit;cursor:pointer}
          .ss-brush-preset.active,.ss-brush-preset:focus-visible{border-color:#6bb9ff;background:#304a62;outline:none}
          .ss-brush-dot{display:block;flex:none;border-radius:50%;background:#eaf3ff}
          .ss-brush-preset-name{width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:center;font-size:10px;font-weight:800}
          .ss-brush-preset small,.ss-brush-saved-use small{font-size:9px;color:#b8c6d4}
          .ss-brush-save-row{display:flex;gap:5px;margin:8px 0}
          .ss-brush-save-row input{min-width:0;flex:1;height:32px;border:1px solid #5b6672;border-radius:5px;background:#272d33;color:#f5f7fa;padding:0 7px;font:inherit;font-size:11px}
          .ss-brush-save-row button{min-height:32px;border:1px solid #6782a0;border-radius:5px;background:#375674;color:#f5f7fa;padding:0 9px;font:inherit;font-size:11px;cursor:pointer}
          .ss-brush-save-row button:disabled{opacity:.4;cursor:default}
          .ss-brush-saved{display:grid;gap:5px}
          .ss-brush-saved-item{display:flex;min-width:0;align-items:stretch;border:1px solid #4a545d;border-radius:5px;background:#30353b}
          .ss-brush-saved-use{display:flex;min-width:0;flex:1;align-items:flex-start;flex-direction:column;gap:2px;border:0;background:none;color:#eaf0f6;padding:7px;font:inherit;font-size:11px;cursor:pointer;text-align:left}
          .ss-brush-saved-use span{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
          .ss-brush-saved-remove{flex:none;width:31px;border:0;border-left:1px solid #4a545d;background:none;color:#e7c5c5;font:inherit;font-size:18px;cursor:pointer}
          .ss-brush-notice{margin:8px 0 0;color:#c5d4e3;font-size:10px;line-height:1.5}
          .ss-brush-mobile{display:none}
          @media(max-width:900px),(max-width:1100px) and (max-height:650px) and (orientation:landscape){
            .shadow-studio .ss-brush-mobile{display:block;flex:1 1 100%;min-width:0;border:1px solid #535c65;border-radius:6px;background:#30353b;padding:0 8px}
            .shadow-studio .ss-brush-mobile summary{min-height:38px;display:flex;align-items:center;justify-content:space-between;color:#eff3f8;font-size:11px;font-weight:800;cursor:pointer;list-style:none;touch-action:manipulation}
            .shadow-studio .ss-brush-mobile summary::-webkit-details-marker{display:none}
            .shadow-studio .ss-brush-mobile summary::after{content:'▾';margin-left:auto;color:#b8c6d4}
            .shadow-studio .ss-brush-mobile[open] summary::after{content:'▴'}
            .shadow-studio .ss-brush-styles{grid-template-columns:repeat(4,minmax(0,1fr))}
            .shadow-studio .ss-brush-style{min-height:42px;flex-direction:column;gap:3px;font-size:9px}
            .shadow-studio .ss-brush-presets{grid-template-columns:repeat(3,minmax(0,1fr))}
            .shadow-studio .ss-brush-preset{min-height:68px}
            .shadow-studio .ss-brush-mobile .ss-brush-save-row input{font-size:16px}
            .shadow-studio .ss-brush-mobile .ss-brush-notice{padding-bottom:8px}
          }
          @media(max-width:360px){.shadow-studio .ss-brush-presets{grid-template-columns:repeat(2,minmax(0,1fr))}.shadow-studio .ss-brush-styles{grid-template-columns:repeat(2,minmax(0,1fr))}}
        `}</style>
        <h2 className="ss-label">{labels.size}</h2>
        <div className="ss-range">
          <input type="range" min="1" max="80" value={size} aria-label="Brush size" onChange={(event) => onSizeChange(Number(event.target.value))} />
          <span className="ss-value">{size}px</span>
        </div>
        {presetOptions()}
      </section>

      <section className="ss-section ss-brush-opacity" aria-label="Brush opacity">
        <h2 className="ss-label">{labels.opacity}</h2>
        <div className="ss-range">
          <input type="range" min="10" max="100" value={opacity} aria-label="Brush opacity" onChange={(event) => onOpacityChange(Number(event.target.value))} />
          <span className="ss-value">{opacity}%</span>
        </div>
      </section>

      <details className="ss-brush-mobile">
        <summary>Brush · {BRUSH_STYLES.find((option) => option.id === style)?.label || 'Round'} · {size}px / {opacity}%</summary>
        {presetOptions()}
      </details>
    </>
  )
}
