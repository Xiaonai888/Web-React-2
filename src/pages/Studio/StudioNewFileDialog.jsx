import { useEffect, useMemo, useState } from 'react'

export const STUDIO_PRESETS = [
  { id: 'basic', label: 'Basic Drawing', width: 1200, height: 800, resolution: 144 },
  { id: 'manga', label: 'Manga Page', width: 1600, height: 2263, resolution: 300 },
  { id: 'webtoon', label: 'Webtoon', width: 1080, height: 1920, resolution: 144 },
  { id: 'cover', label: 'Book Cover', width: 1600, height: 2560, resolution: 300 },
  { id: 'square', label: 'Square', width: 1080, height: 1080, resolution: 144 },
  { id: 'video', label: '16:9', width: 1920, height: 1080, resolution: 144 },
  { id: 'custom', label: 'Custom', width: 1200, height: 800, resolution: 144 },
]

const MAX_SIDE = 4096
const MAX_AREA = 12_000_000
const SAVED_KEY = 'shadow-studio-paper-presets-v1'
const MAX_SAVED = 20
const isHexColor = (value) => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value)

const PAPER_GROUPS = [
  { id: 'drawing', label: 'Drawing & Illustration', presets: [STUDIO_PRESETS[0], STUDIO_PRESETS[4], { id: 'art-portrait', label: 'Portrait Illustration', width: 2400, height: 3200, resolution: 300 }, { id: 'art-landscape', label: 'Landscape Illustration', width: 3200, height: 2400, resolution: 300 }] },
  { id: 'manga', label: 'Manga & Comic', presets: [STUDIO_PRESETS[1], STUDIO_PRESETS[2], { id: 'manga-b5', label: 'B5 Manga Page', width: 2079, height: 2953, resolution: 300 }, { id: 'manga-spread', label: 'Manga Double Page', width: 3200, height: 2263, resolution: 300 }, { id: 'comic-us', label: 'US Comic Page', width: 2100, height: 3150, resolution: 300 }] },
  { id: 'international', label: 'International Paper', presets: [
    { id: 'a0', label: 'A0 · 72 PPI', width: 2384, height: 3370, resolution: 72 },
    { id: 'a1', label: 'A1 · 100 PPI', width: 2339, height: 3307, resolution: 100 },
    { id: 'a2', label: 'A2 · 144 PPI', width: 2381, height: 3368, resolution: 144 },
    { id: 'a3', label: 'A3 · 200 PPI', width: 2339, height: 3307, resolution: 200 },
    { id: 'a4', label: 'A4 · 300 PPI', width: 2480, height: 3508, resolution: 300 },
    { id: 'a5', label: 'A5 · 300 PPI', width: 1748, height: 2480, resolution: 300 },
    { id: 'a6', label: 'A6 · 300 PPI', width: 1240, height: 1748, resolution: 300 },
    { id: 'b4', label: 'B4 · 200 PPI', width: 1969, height: 2787, resolution: 200 },
    { id: 'b5', label: 'B5 · 300 PPI', width: 2079, height: 2953, resolution: 300 },
  ] },
  { id: 'us', label: 'U.S. Paper', presets: [
    { id: 'us-letter', label: 'Letter · 300 PPI', width: 2550, height: 3300, resolution: 300 },
    { id: 'us-legal', label: 'Legal · 200 PPI', width: 1700, height: 2800, resolution: 200 },
    { id: 'us-tabloid', label: 'Tabloid · 150 PPI', width: 1650, height: 2550, resolution: 150 },
    { id: 'us-half', label: 'Half Letter · 300 PPI', width: 1650, height: 2550, resolution: 300 },
  ] },
  { id: 'photo', label: 'Photo', presets: [
    { id: 'photo-4x6', label: '4 × 6 in', width: 1200, height: 1800, resolution: 300 },
    { id: 'photo-5x7', label: '5 × 7 in', width: 1500, height: 2100, resolution: 300 },
    { id: 'photo-8x10', label: '8 × 10 in', width: 2400, height: 3000, resolution: 300 },
  ] },
  { id: 'web', label: 'Web & Social', presets: [STUDIO_PRESETS[4], STUDIO_PRESETS[5], { id: 'web-hd', label: 'HD 1280 × 720', width: 1280, height: 720, resolution: 144 }, { id: 'web-post', label: 'Social Portrait 1080 × 1350', width: 1080, height: 1350, resolution: 144 }, { id: 'web-banner', label: 'Social Banner 1200 × 630', width: 1200, height: 630, resolution: 144 }, { id: 'web-4k', label: '4K 3840 × 2160', width: 3840, height: 2160, resolution: 144 }] },
  { id: 'mobile', label: 'Mobile App Design', presets: [{ id: 'mobile-story', label: 'Story 1080 × 1920', width: 1080, height: 1920, resolution: 144 }, { id: 'mobile-phone', label: 'Phone 1170 × 2532', width: 1170, height: 2532, resolution: 144 }, { id: 'mobile-large', label: 'Large Phone 1290 × 2796', width: 1290, height: 2796, resolution: 144 }] },
  { id: 'video', label: 'Film & Video', presets: [STUDIO_PRESETS[5], { id: 'video-portrait', label: 'Vertical 9:16', width: 1080, height: 1920, resolution: 144 }, { id: 'video-cinema', label: 'Cinema 2K', width: 2048, height: 1080, resolution: 144 }, { id: 'video-4k', label: 'UHD 4K', width: 3840, height: 2160, resolution: 144 }] },
  { id: 'icon', label: 'Iconography', presets: [{ id: 'icon-256', label: 'Icon 256 × 256', width: 256, height: 256, resolution: 144 }, { id: 'icon-512', label: 'Icon 512 × 512', width: 512, height: 512, resolution: 144 }, { id: 'icon-1024', label: 'Icon 1024 × 1024', width: 1024, height: 1024, resolution: 144 }, { id: 'icon-2048', label: 'Icon 2048 × 2048', width: 2048, height: 2048, resolution: 144 }] },
  { id: 'cover', label: 'Book & Cover', presets: [STUDIO_PRESETS[3], { id: 'cover-ebook', label: 'E-book Cover 1600 × 2400', width: 1600, height: 2400, resolution: 300 }, { id: 'cover-print', label: 'Print Cover 2400 × 3600', width: 2400, height: 3600, resolution: 300 }] },
  { id: 'custom', label: 'Custom', presets: [STUDIO_PRESETS[6]] },
]

const BUILTIN_PRESETS = PAPER_GROUPS.flatMap((group) => group.presets)
const UNITS = [
  { id: 'px', label: 'Pixels' },
  { id: 'in', label: 'Inches' },
  { id: 'cm', label: 'Centimeters' },
  { id: 'mm', label: 'Millimeters' },
  { id: 'pt', label: 'Points' },
  { id: 'pc', label: 'Picas' },
]
const VALID_UNITS = new Set(UNITS.map((unit) => unit.id))
const validSize = (width, height, ppi) => Number.isInteger(width) && Number.isInteger(height) && Number.isInteger(ppi) && width >= 64 && height >= 64 && width <= MAX_SIDE && height <= MAX_SIDE && width * height <= MAX_AREA && ppi >= 72 && ppi <= 600
const factor = (unit, ppi) => unit === 'in' ? ppi : unit === 'cm' ? ppi / 2.54 : unit === 'mm' ? ppi / 25.4 : unit === 'pt' ? ppi / 72 : unit === 'pc' ? ppi / 6 : 1
const pixels = (value, unit, ppi) => Math.round(Number(value) * factor(unit, ppi))
const format = (value, unit, ppi) => unit === 'px' ? String(value) : String(Number((value / factor(unit, ppi)).toFixed(unit === 'in' || unit === 'pc' ? 3 : 2)))
const groupUnit = (group) => group === 'international' ? 'mm' : group === 'us' || group === 'photo' ? 'in' : 'px'

function readSaved() {
  try {
    const value = JSON.parse(window.localStorage.getItem(SAVED_KEY) || '[]')
    if (!Array.isArray(value)) return []
    return value.filter((item) => item && /^saved-[a-z0-9-]{1,28}$/.test(item.id) && typeof item.label === 'string' && item.label.trim() && validSize(item.width, item.height, item.resolution))
      .slice(0, MAX_SAVED).map((item) => ({
        id: item.id,
        label: item.label.trim().slice(0, 48),
        width: item.width,
        height: item.height,
        resolution: item.resolution,
        background: isHexColor(item.background) ? item.background.toUpperCase() : '#FFFFFF',
        unit: VALID_UNITS.has(item.unit) ? item.unit : 'px',
      }))
  } catch {
    return []
  }
}

function findGroup(id) {
  return PAPER_GROUPS.find((group) => group.presets.some((item) => item.id === id))?.id || 'drawing'
}

export default function StudioNewFileDialog({ open, defaultName, initialPreset = 'basic', onClose, onCreate }) {
  const initial = BUILTIN_PRESETS.find((item) => item.id === initialPreset) || STUDIO_PRESETS[0]
  const [saved, setSaved] = useState(readSaved)
  const [name, setName] = useState(defaultName || 'Untitled-1')
  const [groupId, setGroupId] = useState(findGroup(initial.id))
  const [presetId, setPresetId] = useState(initial.id)
  const [unit, setUnit] = useState('px')
  const [widthInput, setWidthInput] = useState(String(initial.width))
  const [heightInput, setHeightInput] = useState(String(initial.height))
  const [resolutionInput, setResolutionInput] = useState(String(initial.resolution))
  const [backgroundType, setBackgroundType] = useState('white')
  const [customBackground, setCustomBackground] = useState('#FFFFFF')
  const [savedName, setSavedName] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const ppi = Number(resolutionInput)
  const width = pixels(widthInput, unit, ppi)
  const height = pixels(heightInput, unit, ppi)
  const background = backgroundType === 'black' ? '#000000' : backgroundType === 'gray' ? '#E5E7EB' : backgroundType === 'custom' ? customBackground : '#FFFFFF'

  useEffect(() => {
    if (!open) return
    const next = BUILTIN_PRESETS.find((item) => item.id === initialPreset) || STUDIO_PRESETS[0]
    const nextGroup = findGroup(next.id)
    const nextUnit = groupUnit(nextGroup)
    setSaved(readSaved())
    setName(defaultName || 'Untitled-1')
    setGroupId(nextGroup)
    setPresetId(next.id)
    setUnit(nextUnit)
    setWidthInput(format(next.width, nextUnit, next.resolution))
    setHeightInput(format(next.height, nextUnit, next.resolution))
    setResolutionInput(String(next.resolution))
    setBackgroundType('white')
    setCustomBackground('#FFFFFF')
    setSavedName('')
    setError('')
    setNotice('')
  }, [open, defaultName, initialPreset])

  const groups = saved.length ? [...PAPER_GROUPS, { id: 'saved', label: `My Presets (${saved.length})`, presets: saved }] : PAPER_GROUPS
  const currentGroup = groups.find((group) => group.id === groupId) || groups[0]
  const choices = presetId === 'custom' && !currentGroup.presets.some((item) => item.id === 'custom')
    ? [...currentGroup.presets, { id: 'custom', label: 'Custom Size' }] : currentGroup.presets
  const status = useMemo(() => {
    if (!Number.isInteger(ppi) || ppi < 72 || ppi > 600) return 'Resolution must be a whole number between 72 and 600 PPI.'
    if (!widthInput.trim() || !heightInput.trim() || !Number.isFinite(Number(widthInput)) || !Number.isFinite(Number(heightInput)) || Number(widthInput) <= 0 || Number(heightInput) <= 0) return 'Enter a valid width and height.'
    if (!validSize(width, height, ppi)) return 'The paper must be 64–4096 px per side and no more than 12 million pixels. Choose smaller dimensions or resolution.'
    return ''
  }, [width, height, ppi, widthInput, heightInput])
  const rawMemory = useMemo(() => Number.isFinite(width * height) ? (width * height * 4 / 1048576).toFixed(1) : '0.0', [width, height])

  function markCustom() {
    setPresetId('custom')
    setError('')
    setNotice('')
  }

  function applyBackground(color) {
    const next = isHexColor(color) ? color.toUpperCase() : '#FFFFFF'
    setCustomBackground(next)
    setBackgroundType(next === '#FFFFFF' ? 'white' : next === '#000000' ? 'black' : next === '#E5E7EB' ? 'gray' : 'custom')
  }

  function applyPreset(next, targetGroup = groupId) {
    const nextUnit = VALID_UNITS.has(next.unit) ? next.unit : groupUnit(targetGroup)
    setGroupId(targetGroup)
    setPresetId(next.id)
    setUnit(nextUnit)
    setResolutionInput(String(next.resolution))
    setWidthInput(format(next.width, nextUnit, next.resolution))
    setHeightInput(format(next.height, nextUnit, next.resolution))
    applyBackground(next.background)
    setError('')
    setNotice('')
  }

  function selectGroup(id) {
    const group = groups.find((item) => item.id === id)
    if (!group) return
    if (group.id === 'custom') {
      setGroupId(group.id)
      markCustom()
      return
    }
    if (group.presets[0]) applyPreset(group.presets[0], group.id)
  }

  function setDimension(field, text) {
    if (field === 'width') setWidthInput(text)
    else setHeightInput(text)
    markCustom()
  }

  function setMeasurement(nextUnit) {
    if (!VALID_UNITS.has(nextUnit) || nextUnit === unit) return
    if (!status) {
      setWidthInput(format(width, nextUnit, ppi))
      setHeightInput(format(height, nextUnit, ppi))
    } else {
      setWidthInput('')
      setHeightInput('')
    }
    setUnit(nextUnit)
    setError('')
  }

  function orient(direction) {
    if (!status && ((direction === 'portrait' && width > height) || (direction === 'landscape' && height > width))) {
      setWidthInput(heightInput)
      setHeightInput(widthInput)
      markCustom()
    }
  }

  function savePreset() {
    const title = savedName.trim().slice(0, 48)
    if (!title) return setError('Enter a preset name first.')
    if (status) return setError(status)
    if (saved.length >= MAX_SAVED) return setError(`My Presets is full (${MAX_SAVED}). Delete one to save another.`)
    if (saved.some((item) => item.label.toLowerCase() === title.toLowerCase())) return setError('A preset with this name already exists.')
    const item = { id: `saved-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`, label: title, width, height, resolution: ppi, background, unit }
    const next = [...saved, item]
    try {
      window.localStorage.setItem(SAVED_KEY, JSON.stringify(next))
      setSaved(next)
      setGroupId('saved')
      setPresetId(item.id)
      setSavedName('')
      setError('')
      setNotice(`Saved “${title}” in this browser.`)
    } catch {
      setError('Could not save the preset in this browser. Your current paper settings are unchanged.')
    }
  }

  function deletePreset() {
    const selected = saved.find((item) => item.id === presetId)
    if (!selected || !window.confirm(`Delete preset “${selected.label}”?`)) return
    const next = saved.filter((item) => item.id !== selected.id)
    try {
      window.localStorage.setItem(SAVED_KEY, JSON.stringify(next))
      setSaved(next)
      if (next.length) applyPreset(next[0], 'saved')
      else {
        setGroupId('custom')
        setPresetId('custom')
      }
      setNotice(`Deleted “${selected.label}”.`)
      setError('')
    } catch {
      setError('Could not delete this preset from this browser.')
    }
  }

  function submit(event) {
    event.preventDefault()
    const cleanName = name.trim().slice(0, 80)
    if (!cleanName) return setError('A document name is required.')
    if (status) return setError(status)
    setError('')
    onCreate({ name: cleanName, width, height, resolution: ppi, background, presetId })
  }

  if (!open) return null

  return (
    <div className="ss-dialog-backdrop ss-nd-backdrop" role="presentation" onPointerDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <style>{`
        .shadow-studio .ss-nd-backdrop{padding:12px;background:rgba(8,11,15,.76)}
        .shadow-studio .ss-paper-dialog{box-sizing:border-box;width:min(762px,100%);max-height:min(700px,calc(100dvh - 24px));display:flex;flex-direction:column;overflow:hidden;border:1px solid #555c64;border-radius:7px;background:#35383c;color:#edf1f5;box-shadow:0 26px 75px #000a;font-size:12px}
        .shadow-studio .ss-nd-head{display:flex;align-items:center;justify-content:space-between;min-height:43px;border-bottom:1px solid #4d545c;background:#3b3e42;padding:0 12px 0 16px}
        .shadow-studio .ss-nd-head h2{margin:0;font-size:15px;font-weight:700}
        .shadow-studio .ss-nd-close{width:26px;height:26px;border:0;border-radius:4px;background:transparent;color:#f1f3f6;font-size:19px;cursor:pointer}
        .shadow-studio .ss-nd-close:hover{background:#555e68}
        .shadow-studio .ss-nd-content{display:grid;grid-template-columns:minmax(0,1fr) 142px;min-height:0;flex:1;overflow:hidden}
        .shadow-studio .ss-nd-fields{display:grid;align-content:start;gap:11px;min-width:0;overflow-y:auto;overscroll-behavior:contain;padding:18px 20px 20px}
        .shadow-studio .ss-nd-row{display:grid;grid-template-columns:132px minmax(0,1fr);align-items:center;gap:10px;min-width:0}
        .shadow-studio .ss-nd-label{font-size:11px;font-weight:600;color:#d8e0e7;text-align:right}
        .shadow-studio .ss-nd-control{min-width:0;width:100%;height:32px;box-sizing:border-box;border:1px solid #636b74;border-radius:4px;background:#2e3236;color:#fff;padding:0 9px;font:inherit;font-size:12px;outline:none}
        .shadow-studio .ss-nd-control:focus-visible{border-color:#86bfff;box-shadow:0 0 0 2px #4799f230}
        .shadow-studio .ss-nd-control:disabled{color:#aab4be;opacity:.75}
        .shadow-studio .ss-nd-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:7px;min-width:0}
        .shadow-studio .ss-nd-three{display:grid;grid-template-columns:minmax(0,1fr) 132px;gap:7px;min-width:0}
        .shadow-studio .ss-nd-orient{display:flex;gap:6px;min-width:0}
        .shadow-studio .ss-nd-orient button{flex:1;min-height:30px;border:1px solid #636b74;border-radius:4px;background:#31363b;color:#e6edf3;font:inherit;font-size:11px;cursor:pointer}
        .shadow-studio .ss-nd-orient button[aria-pressed=true]{border-color:#83c2ff;background:#324c64;color:#fff}
        .shadow-studio .ss-nd-orient button:disabled{opacity:.45;cursor:default}
        .shadow-studio .ss-nd-background{display:grid;grid-template-columns:minmax(0,1fr) 34px 34px;gap:7px;align-items:center;min-width:0}
        .shadow-studio .ss-nd-background input[type=color]{width:34px;height:32px;padding:2px;cursor:pointer}
        .shadow-studio .ss-nd-swatch{display:block;width:32px;height:30px;box-sizing:border-box;border:1px solid #89929e;border-radius:4px}
        .shadow-studio .ss-nd-info{margin:3px 0 0;border:1px solid #50565e;border-radius:4px;background:#2d3034;color:#cbd6e1;padding:9px 11px;font-size:10px;line-height:1.7}
        .shadow-studio .ss-nd-advanced{margin-top:2px;border-top:1px solid #50565e;padding-top:9px}
        .shadow-studio .ss-nd-advanced summary{cursor:pointer;font-size:11px;font-weight:700;color:#d4e0eb}
        .shadow-studio .ss-nd-advanced-body{display:grid;gap:10px;margin-top:11px}
        .shadow-studio .ss-nd-hint{margin:0;color:#adb9c5;font-size:10px;line-height:1.55}
        .shadow-studio .ss-nd-actions{display:flex;flex-direction:column;align-items:stretch;gap:9px;min-width:0;border-left:1px solid #4f565e;background:#34373b;padding:18px 12px}
        .shadow-studio .ss-nd-actions button{min-height:34px;border:1px solid #77818b;border-radius:18px;background:#41464b;color:#f6f8fa;padding:3px 8px;font:inherit;font-size:11px;cursor:pointer}
        .shadow-studio .ss-nd-actions button.primary{border-color:#8dc7ff;background:#4b9df4;color:#0c2032;font-weight:800}
        .shadow-studio .ss-nd-actions button:disabled{opacity:.4;cursor:default}
        .shadow-studio .ss-nd-actions button:hover:not(:disabled){filter:brightness(1.13)}
        .shadow-studio .ss-nd-preset-save{display:grid;gap:5px;margin-top:15px;border-top:1px solid #4e555d;padding-top:12px}
        .shadow-studio .ss-nd-preset-save label{font-size:10px;color:#c8d4e0}
        .shadow-studio .ss-nd-preset-save input{height:31px;box-sizing:border-box;min-width:0;width:100%;border:1px solid #606a74;border-radius:4px;background:#292d32;color:#fff;padding:0 6px;font:inherit;font-size:11px}
        .shadow-studio .ss-nd-status{grid-column:1/-1;margin:0;border-radius:4px;background:#463438;color:#ffccd1;padding:8px;font-size:11px;line-height:1.45}
        .shadow-studio .ss-nd-success{grid-column:1/-1;margin:0;border-radius:4px;background:#294436;color:#b9f4d2;padding:8px;font-size:10px}
        .shadow-studio .ss-nd-mobile-actions{display:none}
        @media(max-width:620px){
          .shadow-studio .ss-paper-dialog{max-height:calc(100dvh - 12px);width:100%;border-radius:6px}
          .shadow-studio .ss-nd-content{display:flex;flex-direction:column;overflow:auto}
          .shadow-studio .ss-nd-fields{overflow:visible;flex:0 0 auto;padding:14px 12px;gap:12px}
          .shadow-studio .ss-nd-row{grid-template-columns:1fr;gap:5px}
          .shadow-studio .ss-nd-label{text-align:left}
          .shadow-studio .ss-nd-three{grid-template-columns:minmax(0,1fr) 115px}
          .shadow-studio .ss-nd-actions{flex:0 0 auto;border-left:0;border-top:1px solid #4e555d;display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:10px 12px 15px}
          .shadow-studio .ss-nd-actions .ss-nd-preset-save{grid-column:1/-1;grid-row:1;margin:0;border:0;padding:0}
          .shadow-studio .ss-nd-actions .ss-nd-preset-save>div{display:flex;gap:7px}
          .shadow-studio .ss-nd-actions .ss-nd-preset-save input{flex:1}
        }
        @media(max-width:370px){.shadow-studio .ss-nd-two{grid-template-columns:1fr}.shadow-studio .ss-nd-background{grid-template-columns:minmax(0,1fr) 32px 32px}}
      `}</style>
      <form className="ss-new-dialog ss-paper-dialog" onSubmit={submit} role="dialog" aria-modal="true" aria-label="New File" onKeyDown={(event) => { if (event.key === 'Escape') { event.stopPropagation(); onClose() } }}>
        <div className="ss-nd-head"><h2>New File</h2><button type="button" className="ss-nd-close" onClick={onClose} aria-label="Close new file dialog">×</button></div>
        <div className="ss-nd-content">
          <div className="ss-nd-fields">
            <label className="ss-nd-row"><span className="ss-nd-label">Name</span><input className="ss-nd-control" maxLength={80} value={name} autoFocus onChange={(event) => { setName(event.target.value); setError('') }} /></label>
            <label className="ss-nd-row"><span className="ss-nd-label">Document Type</span><select className="ss-nd-control" value={groupId} onChange={(event) => selectGroup(event.target.value)}>{groups.map((group) => <option key={group.id} value={group.id}>{group.label}</option>)}</select></label>
            <label className="ss-nd-row"><span className="ss-nd-label">Size</span><select className="ss-nd-control" value={presetId} onChange={(event) => { const next = choices.find((item) => item.id === event.target.value); if (next?.id === 'custom') markCustom(); else if (next) applyPreset(next) }}>{choices.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
            <div className="ss-nd-row"><span className="ss-nd-label">Orientation</span><div className="ss-nd-orient"><button type="button" aria-pressed={height >= width} disabled={Boolean(status)} onClick={() => orient('portrait')}>▯ Portrait</button><button type="button" aria-pressed={width >= height} disabled={Boolean(status)} onClick={() => orient('landscape')}>▭ Landscape</button></div></div>
            <div className="ss-nd-row"><label className="ss-nd-label" htmlFor="ss-nd-width">Width</label><div className="ss-nd-three"><input id="ss-nd-width" className="ss-nd-control" inputMode="decimal" type="number" min="0" step="any" value={widthInput} onChange={(event) => setDimension('width', event.target.value)} /><select className="ss-nd-control" aria-label="Measurement units" value={unit} onChange={(event) => setMeasurement(event.target.value)}>{UNITS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></div></div>
            <div className="ss-nd-row"><label className="ss-nd-label" htmlFor="ss-nd-height">Height</label><input id="ss-nd-height" className="ss-nd-control" inputMode="decimal" type="number" min="0" step="any" value={heightInput} onChange={(event) => setDimension('height', event.target.value)} /></div>
            <div className="ss-nd-row"><label className="ss-nd-label" htmlFor="ss-nd-ppi">Resolution</label><div className="ss-nd-three"><input id="ss-nd-ppi" className="ss-nd-control" type="number" min="72" max="600" step="1" value={resolutionInput} onChange={(event) => { setResolutionInput(event.target.value); markCustom() }} /><input className="ss-nd-control" value="Pixels / Inch" aria-label="Resolution unit" disabled readOnly /></div></div>
            <div className="ss-nd-row"><span className="ss-nd-label">Color Mode</span><div className="ss-nd-two"><input className="ss-nd-control" value="RGB Color" readOnly disabled aria-label="Color mode RGB only" /><input className="ss-nd-control" value="8 bit" readOnly disabled aria-label="Color depth 8 bit only" /></div></div>
            <label className="ss-nd-row"><span className="ss-nd-label">Background Contents</span><div className="ss-nd-background"><select className="ss-nd-control" value={backgroundType} onChange={(event) => { setBackgroundType(event.target.value); setNotice('') }}><option value="white">White</option><option value="gray">Light Gray</option><option value="black">Black</option><option value="custom">Custom Color</option></select><input type="color" value={customBackground} aria-label="Custom background color" title="Pick a background color" onChange={(event) => { setCustomBackground(event.target.value); setBackgroundType('custom') }} /><span className="ss-nd-swatch" style={{ backgroundColor: background }} title={background} /></div></label>
            <p className="ss-nd-info">{status ? 'Check your dimensions and resolution.' : `${width.toLocaleString()} × ${height.toLocaleString()} px · ${ppi} PPI · ≈ ${rawMemory} MB raw canvas`}</p>
            <details className="ss-nd-advanced"><summary>Advanced</summary><div className="ss-nd-advanced-body"><div className="ss-nd-row"><span className="ss-nd-label">Color Profile</span><input className="ss-nd-control" value="sRGB (browser canvas)" disabled readOnly aria-label="Browser sRGB color profile" /></div><div className="ss-nd-row"><span className="ss-nd-label">Pixel Aspect Ratio</span><input className="ss-nd-control" value="Square Pixels" disabled readOnly aria-label="Square pixel aspect ratio" /></div><p className="ss-nd-hint">The current canvas supports RGB 8-bit with square pixels and a solid-color background. Other color modes, color profiles, and transparency require additional canvas engine support. PPI here is a document setting; downloaded image metadata is not guaranteed to include it.</p></div></details>
            <p className="ss-nd-hint">Limit: 4096 px per side / 12 megapixels / 8 open papers. Units convert to pixels at the chosen PPI. Saved presets remain on this browser only.</p>
            {error || status ? <p className="ss-nd-status" role="alert">{error || status}</p> : null}
            {notice ? <p className="ss-nd-success" role="status">{notice}</p> : null}
          </div>
          <aside className="ss-nd-actions" aria-label="New document actions">
            <button className="primary" type="submit" disabled={Boolean(status)}>Create</button>
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="button" disabled={saved.length >= MAX_SAVED || Boolean(status)} onClick={savePreset}>Save Preset...</button>
            <button type="button" disabled={!saved.some((item) => item.id === presetId)} onClick={deletePreset}>Delete Preset...</button>
            <div className="ss-nd-preset-save"><label htmlFor="ss-nd-preset-name">Preset name</label><div><input id="ss-nd-preset-name" type="text" maxLength={48} value={savedName} placeholder="My custom size" onChange={(event) => { setSavedName(event.target.value); setError('') }} /></div></div>
          </aside>
        </div>
      </form>
    </div>
  )
}
