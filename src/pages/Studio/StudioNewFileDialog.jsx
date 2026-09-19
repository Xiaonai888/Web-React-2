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
const isValidSize = (width, height, resolution) => Number.isInteger(width) && Number.isInteger(height) && Number.isInteger(resolution) && width >= 64 && height >= 64 && width <= MAX_SIDE && height <= MAX_SIDE && width * height <= MAX_AREA && resolution >= 72 && resolution <= 600

function readSaved() {
  try {
    const value = JSON.parse(window.localStorage.getItem(SAVED_KEY) || '[]')
    if (!Array.isArray(value)) return []
    return value.filter((item) => item && /^saved-[a-z0-9-]{1,28}$/.test(item.id) && typeof item.label === 'string' && item.label.trim().length > 0 && isValidSize(item.width, item.height, item.resolution)).slice(0, MAX_SAVED).map((item) => ({ ...item, background: isHexColor(item.background) ? item.background.toUpperCase() : '#FFFFFF' }))
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
  const [width, setWidth] = useState(initial.width)
  const [height, setHeight] = useState(initial.height)
  const [resolution, setResolution] = useState(initial.resolution)
  const [backgroundType, setBackgroundType] = useState('white')
  const [customBackground, setCustomBackground] = useState('#FFFFFF')
  const [savedName, setSavedName] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    const next = BUILTIN_PRESETS.find((item) => item.id === initialPreset) || STUDIO_PRESETS[0]
    setName(defaultName || 'Untitled-1')
    setGroupId(findGroup(next.id))
    setPresetId(next.id)
    setWidth(next.width)
    setHeight(next.height)
    setResolution(next.resolution)
    setBackgroundType('white')
    setCustomBackground('#FFFFFF')
    setSavedName('')
    setError('')
  }, [open, defaultName, initialPreset])

  const groups = saved.length ? [...PAPER_GROUPS, { id: 'saved', label: `My Presets (${saved.length})`, presets: saved }] : PAPER_GROUPS
  const currentGroup = groups.find((group) => group.id === groupId) || groups[0]
  const background = backgroundType === 'black' ? '#000000' : backgroundType === 'gray' ? '#E5E7EB' : backgroundType === 'transparent' ? '#FFFFFF' : backgroundType === 'custom' ? customBackground : '#FFFFFF'
  const rawMemory = useMemo(() => ((Number(width) * Number(height) * 4) / (1024 * 1024)).toFixed(1), [width, height])
  const status = useMemo(() => {
    const w = Number(width)
    const h = Number(height)
    const ppi = Number(resolution)
    if (!Number.isInteger(w) || !Number.isInteger(h) || w < 64 || h < 64 || w > MAX_SIDE || h > MAX_SIDE) return `Width and height must be whole pixels between 64 and ${MAX_SIDE}.`
    if (w * h > MAX_AREA) return 'This paper exceeds 12 million pixels. Choose smaller dimensions.'
    if (!Number.isInteger(ppi) || ppi < 72 || ppi > 600) return 'Resolution must be between 72 and 600 PPI.'
    return ''
  }, [width, height, resolution])

  function usePreset(next) {
    setPresetId(next.id)
    setWidth(next.width)
    setHeight(next.height)
    setResolution(next.resolution)
    const backgroundColor = isHexColor(next.background) ? next.background.toUpperCase() : '#FFFFFF'
    setBackgroundType(backgroundColor === '#FFFFFF' ? 'white' : backgroundColor === '#000000' ? 'black' : backgroundColor === '#E5E7EB' ? 'gray' : 'custom')
    setCustomBackground(backgroundColor)
    setError('')
  }

  function selectGroup(id) {
    const group = groups.find((item) => item.id === id)
    if (!group) return
    setGroupId(group.id)
    if (group.id === 'custom') {
      setPresetId('custom')
      setError('')
    } else if (group.presets[0]) {
      usePreset(group.presets[0])
    }
  }

  function customize(field, next) {
    if (field === 'width') setWidth(next)
    if (field === 'height') setHeight(next)
    if (field === 'resolution') setResolution(next)
    setPresetId('custom')
    setGroupId('custom')
    setError('')
  }

  function orient(direction) {
    const w = Number(width)
    const h = Number(height)
    if ((direction === 'portrait' && w > h) || (direction === 'landscape' && h > w)) {
      setWidth(h)
      setHeight(w)
      setPresetId('custom')
      setGroupId('custom')
      setError('')
    }
  }

  function savePreset() {
    const title = savedName.trim().slice(0, 48)
    if (!title) return setError('Enter a name for your custom preset.')
    if (status) return setError(status)
    if (saved.length >= MAX_SAVED) return setError(`You can save up to ${MAX_SAVED} presets. Delete one first.`)
    const item = { id: `saved-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`, label: title, width: Number(width), height: Number(height), resolution: Number(resolution), background }
    const next = [...saved, item]
    try {
      window.localStorage.setItem(SAVED_KEY, JSON.stringify(next))
      setSaved(next)
      setGroupId('saved')
      setPresetId(item.id)
      setSavedName('')
      setError('')
    } catch {
      setError('This browser could not save your custom presets. Your paper settings are still available.')
    }
  }

  function deletePreset() {
    if (!presetId.startsWith('saved-')) return
    const selected = saved.find((item) => item.id === presetId)
    if (!selected || !window.confirm(`Delete preset "${selected.label}"?`)) return
    const next = saved.filter((item) => item.id !== presetId)
    try {
      window.localStorage.setItem(SAVED_KEY, JSON.stringify(next))
      setSaved(next)
      setGroupId(next.length ? 'saved' : 'custom')
      if (next.length) usePreset(next[0])
      else setPresetId('custom')
      setError('')
    } catch {
      setError('Could not delete this preset from this browser.')
    }
  }

  function submit(event) {
    event.preventDefault()
    const cleanName = String(name || '').trim()
    if (!cleanName) return setError('Name is required.')
    if (status) return setError(status)
    if (!Number.isInteger(Number(width)) || !Number.isInteger(Number(height))) return setError('Width and height must be whole pixels.')
    onCreate({ name: cleanName.slice(0, 80), width: Number(width), height: Number(height), resolution: Number(resolution), background, presetId })
  }

  if (!open) return null

  return (
    <div className="ss-dialog-backdrop" role="dialog" aria-modal="true" aria-label="New paper">
      <style>{`
        .shadow-studio .ss-paper-dialog{width:min(640px,100%);max-height:calc(100dvh - 20px);display:flex;flex-direction:column;overflow:hidden}
        .shadow-studio .ss-paper-dialog .ss-dialog-head,.shadow-studio .ss-paper-dialog .ss-dialog-actions{flex:none}
        .shadow-studio .ss-paper-dialog .ss-dialog-body{min-height:0;overflow-y:auto;overscroll-behavior:contain;align-content:start}
        .shadow-studio .ss-paper-dialog .ss-paper-section{grid-column:1/-1;display:grid;gap:7px;min-width:0}
        .shadow-studio .ss-paper-dialog .ss-paper-section>span{font-size:10px;font-weight:800;color:#d4d7db}
        .shadow-studio .ss-paper-dialog .ss-paper-type{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px}
        .shadow-studio .ss-paper-dialog .ss-paper-type select{min-width:0;width:100%;height:36px;border:1px solid #61676e;border-radius:6px;background:#2f3236;color:#fff;padding:0 8px;font:inherit;font-size:12px}
        .shadow-studio .ss-paper-dialog .ss-paper-orientation{grid-column:1/-1;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
        .shadow-studio .ss-paper-dialog .ss-paper-orientation button{min-height:34px;flex:1;border:1px solid #61676e;border-radius:6px;background:#2f3236;color:#e8edf3;padding:4px 10px;font:inherit;font-size:11px;cursor:pointer}
        .shadow-studio .ss-paper-dialog .ss-paper-orientation button.active{border-color:#68aef6;background:#36516a}
        .shadow-studio .ss-paper-dialog .ss-paper-save{grid-column:1/-1;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
        .shadow-studio .ss-paper-dialog .ss-paper-save input{flex:1 1 150px;min-width:0;height:36px;border:1px solid #61676e;border-radius:6px;background:#2f3236;color:#fff;padding:0 9px;font:inherit;font-size:12px}
        .shadow-studio .ss-paper-dialog .ss-paper-save button{min-height:36px;border:1px solid #61676e;border-radius:6px;background:#424951;color:#fff;padding:4px 10px;font:inherit;font-size:11px;cursor:pointer}
        .shadow-studio .ss-paper-dialog .ss-paper-save button:disabled{opacity:.45;cursor:default}
        .shadow-studio .ss-paper-dialog .ss-paper-hint{grid-column:1/-1;margin:0;color:#adb7c3;font-size:10px;line-height:1.5}
        .shadow-studio .ss-paper-dialog .ss-dialog-actions{background:#3a3d41}
        @media(max-width:600px){.shadow-studio .ss-paper-dialog{max-height:calc(100dvh - 12px)}.shadow-studio .ss-paper-dialog .ss-dialog-body{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:12px}.shadow-studio .ss-paper-dialog .ss-paper-type{grid-template-columns:1fr}.shadow-studio .ss-paper-dialog .ss-paper-orientation button{min-height:40px}.shadow-studio .ss-paper-dialog .ss-paper-save button{min-height:40px}}
      `}</style>
      <form className="ss-new-dialog ss-paper-dialog" onSubmit={submit}>
        <div className="ss-dialog-head">
          <div><h2>New File</h2><p>Choose a paper type, size, and background. Your current papers stay open.</p></div>
          <button type="button" className="ss-dialog-x" onClick={onClose} aria-label="Close new file dialog"><i className="fa-solid fa-xmark" /></button>
        </div>
        <div className="ss-dialog-body">
          <label className="ss-field ss-field-wide"><span>Name</span><input value={name} maxLength={80} autoFocus onChange={(event) => setName(event.target.value)} /></label>
          <div className="ss-paper-section">
            <span>Paper Type & Size</span>
            <div className="ss-paper-type">
              <select value={groupId} aria-label="Paper type" onChange={(event) => selectGroup(event.target.value)}>
                {groups.map((group) => <option key={group.id} value={group.id}>{group.label}</option>)}
              </select>
              <select value={currentGroup.presets.some((item) => item.id === presetId) ? presetId : currentGroup.presets[0].id} aria-label="Paper size" onChange={(event) => { const next = currentGroup.presets.find((item) => item.id === event.target.value); if (next) usePreset(next) }}>
                {currentGroup.presets.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
            </div>
          </div>
          <div className="ss-paper-orientation" role="group" aria-label="Paper orientation">
            <button type="button" className={Number(height) >= Number(width) ? 'active' : ''} onClick={() => orient('portrait')}>▯ Portrait</button>
            <button type="button" className={Number(width) >= Number(height) ? 'active' : ''} onClick={() => orient('landscape')}>▭ Landscape</button>
          </div>
          <label className="ss-field"><span>Width</span><div className="ss-input-unit"><input type="number" min="64" max={MAX_SIDE} step="1" value={width} onChange={(event) => customize('width', event.target.value)} /><b>px</b></div></label>
          <label className="ss-field"><span>Height</span><div className="ss-input-unit"><input type="number" min="64" max={MAX_SIDE} step="1" value={height} onChange={(event) => customize('height', event.target.value)} /><b>px</b></div></label>
          <label className="ss-field"><span>Resolution</span><div className="ss-input-unit"><input type="number" min="72" max="600" step="1" value={resolution} onChange={(event) => customize('resolution', event.target.value)} /><b>PPI</b></div></label>
          <label className="ss-field"><span>Color Mode</span><input value="RGB Color · 8 bit" disabled /></label>
          <label className="ss-field ss-field-wide"><span>Background</span><div className="ss-background-row"><select value={backgroundType} onChange={(event) => setBackgroundType(event.target.value)}><option value="white">White</option><option value="gray">Light Gray</option><option value="black">Black</option><option value="custom">Custom Color</option></select><input type="color" value={customBackground} disabled={backgroundType !== 'custom'} aria-label="Custom background color" onChange={(event) => setCustomBackground(event.target.value)} /><span className="ss-background-preview" style={{ background }} /></div></label>
          <div className="ss-dialog-info ss-field-wide"><span>{Number(width || 0).toLocaleString()} × {Number(height || 0).toLocaleString()} px</span><span>{resolution} PPI</span><span>≈ {rawMemory} MB raw canvas</span></div>
          <p className="ss-paper-hint">Large print sizes use a lower PPI here to stay within the current 4096 px / 12 MP canvas limit. PPI changes print metadata only; it does not resize pixels automatically.</p>
          <div className="ss-paper-save"><input type="text" maxLength={48} value={savedName} aria-label="Custom preset name" placeholder="Name for your custom preset" onChange={(event) => setSavedName(event.target.value)} /><button type="button" onClick={savePreset} disabled={saved.length >= MAX_SAVED}>Save Preset</button>{presetId.startsWith('saved-') ? <button type="button" onClick={deletePreset}>Delete Preset</button> : null}</div>
          <p className="ss-paper-hint">My Presets save the paper dimensions, resolution, and background color in this browser only. They are not synced with your account.</p>
          {error || status ? <div className="ss-dialog-error ss-field-wide" role="alert">{error || status}</div> : null}
        </div>
        <div className="ss-dialog-actions"><button type="button" className="ss-btn" onClick={onClose}>Cancel</button><button type="submit" className="ss-btn primary" disabled={Boolean(status)}>Create</button></div>
      </form>
    </div>
  )
}
