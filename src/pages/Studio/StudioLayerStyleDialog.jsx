import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { STUDIO_BLEND_MODES } from './StudioLayerBlendEngine'
import { createStudioLayerStyle, normalizeStudioLayerStyle, renderStudioStyledLayer, STUDIO_LAYER_STYLE_EFFECTS } from './StudioLayerStyleEngine'

const CONTROL_GROUPS = {
  bevelEmboss: [['size', 'Size', 'range', 1, 64], ['depth', 'Depth', 'range', 0, 100], ['angle', 'Angle', 'range', -180, 180], ['opacity', 'Opacity', 'range', 0, 100], ['color', 'Highlight', 'color'], ['shadowColor', 'Shadow', 'color']],
  contour: [['amount', 'Contour strength', 'range', 0, 100]],
  texture: [['size', 'Pattern size', 'range', 1, 64], ['amount', 'Amount', 'range', 0, 100]],
  stroke: [['size', 'Size', 'range', 1, 64], ['position', 'Position', 'select', ['outside', 'inside', 'center']], ['color', 'Color', 'color'], ['opacity', 'Opacity', 'range', 0, 100]],
  innerShadow: [['size', 'Blur', 'range', 1, 64], ['distance', 'Distance', 'range', 0, 64], ['angle', 'Angle', 'range', -180, 180], ['color', 'Color', 'color'], ['opacity', 'Opacity', 'range', 0, 100]],
  innerGlow: [['size', 'Blur', 'range', 1, 64], ['color', 'Color', 'color'], ['opacity', 'Opacity', 'range', 0, 100]],
  satin: [['size', 'Blur', 'range', 1, 64], ['distance', 'Distance', 'range', 0, 64], ['angle', 'Angle', 'range', -180, 180], ['color', 'Color', 'color'], ['opacity', 'Opacity', 'range', 0, 100]],
  colorOverlay: [['color', 'Color', 'color'], ['opacity', 'Opacity', 'range', 0, 100]],
  gradientOverlay: [['color', 'Start color', 'color'], ['secondColor', 'End color', 'color'], ['angle', 'Angle', 'range', -180, 180], ['opacity', 'Opacity', 'range', 0, 100]],
  patternOverlay: [['color', 'Background', 'color'], ['secondColor', 'Pattern', 'color'], ['size', 'Pattern size', 'range', 1, 64], ['opacity', 'Opacity', 'range', 0, 100]],
  outerGlow: [['size', 'Blur', 'range', 1, 64], ['color', 'Color', 'color'], ['opacity', 'Opacity', 'range', 0, 100]],
  dropShadow: [['size', 'Blur', 'range', 1, 64], ['distance', 'Distance', 'range', 0, 64], ['angle', 'Angle', 'range', -180, 180], ['color', 'Color', 'color'], ['opacity', 'Opacity', 'range', 0, 100]],
}

const TRANSLATIONS = {
  en: { title: 'Layer Style', name: 'Name', blend: 'Blend Mode', opacity: 'Opacity', fill: 'Fill Opacity', channels: 'Channels', effects: 'Styles', preview: 'Preview', cancel: 'Cancel', apply: 'OK', busy: 'Applying…', locked: 'Unlock this layer before applying changes.', noLayer: 'Select a layer to edit its style.', notConnected: 'Layer Style is not connected to this project yet.', error: 'Unable to preview this layer.', advanced: 'Blend If / Knockout require the layer compositor and will be added during integration.' },
  km: { title: 'រចនាប័ទ្ម Layer', name: 'ឈ្មោះ', blend: 'របៀបលាយ', opacity: 'ភាពស្រអាប់', fill: 'ភាពស្រអាប់ផ្ទៃ', channels: 'ឆានែល', effects: 'រចនាប័ទ្ម', preview: 'មើលជាមុន', cancel: 'បោះបង់', apply: 'យល់ព្រម', busy: 'កំពុងអនុវត្ត…', locked: 'សូមដោះសោ Layer មុនអនុវត្ត។', noLayer: 'សូមជ្រើស Layer ដើម្បីកែរចនាប័ទ្ម។', notConnected: 'ផ្ទាំង Layer Style មិនទាន់ភ្ជាប់ទៅ Project ទេ។', error: 'មិនអាចបង្ហាញរូបមើលជាមុនបាន។', advanced: 'Blend If / Knockout ត្រូវការប្រព័ន្ធលាយ Layer ហើយនឹងភ្ជាប់នៅជំហានក្រោយ។' },
}

export default function StudioLayerStyleDialog({ open = false, layer = null, onClose, onApply, disabled = false, language = 'en' }) {
  const words = TRANSLATIONS[language] || TRANSLATIONS.en
  const [draft, setDraft] = useState(createStudioLayerStyle)
  const [selected, setSelected] = useState('blending')
  const [preview, setPreview] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const previewRef = useRef(null)
  const titleRef = useRef(null)

  useEffect(() => {
    if (!open) return
    setDraft(normalizeStudioLayerStyle({ blendMode: layer?.blendMode || 'normal', opacity: layer?.opacity ?? 100, ...(layer?.layerStyle || {}) }))
    setSelected('blending')
    setPreview(true)
    setError('')
    setBusy(false)
    requestAnimationFrame(() => titleRef.current?.focus())
  }, [open, layer?.id])

  useEffect(() => {
    if (!open || !previewRef.current) return
    const canvas = previewRef.current
    const context = canvas.getContext('2d')
    if (!context) return
    context.clearRect(0, 0, canvas.width, canvas.height)
    if (!layer?.canvas || !preview) return
    try {
      const rendered = renderStudioStyledLayer(layer.canvas, draft, { maxDimension: 190 })
      const scale = Math.min(1, 172 / Math.max(rendered.width, rendered.height))
      const width = rendered.width * scale
      const height = rendered.height * scale
      context.drawImage(rendered, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height)
      setError((current) => current === words.error ? '' : current)
    } catch {
      setError(words.error)
    }
  }, [open, layer?.id, layer?.canvas, draft, preview, words.error])

  useEffect(() => {
    if (!open) return undefined
    function escape(event) {
      if (event.key !== 'Escape' || busy) return
      event.preventDefault()
      event.stopPropagation()
      onClose?.()
    }
    window.addEventListener('keydown', escape, true)
    return () => window.removeEventListener('keydown', escape, true)
  }, [open, busy, onClose])

  if (!open) return null

  function updateMain(key, value) {
    setDraft((current) => ({ ...current, [key]: value }))
    setError('')
  }

  function updateEffect(name, key, value) {
    setDraft((current) => ({ ...current, effects: { ...current.effects, [name]: { ...current.effects[name], [key]: value } } }))
    setError('')
  }

  function renderNumber(key, label, value, min, max, update) {
    return <label className="ss-ls-field" key={key}>
      <span>{label}</span>
      <span className="ss-ls-number"><input type="range" min={min} max={max} step="1" value={value} onChange={(event) => update(Number(event.target.value))} disabled={busy || disabled} /><input type="number" min={min} max={max} value={value} onChange={(event) => update(Math.max(min, Math.min(max, Number(event.target.value) || 0)))} disabled={busy || disabled} /></span>
    </label>
  }

  function effectFields(name) {
    const settings = draft.effects[name]
    return <div className="ss-ls-effect-settings">
      {CONTROL_GROUPS[name].map(([key, label, kind, min, max]) => {
        if (kind === 'range') return renderNumber(key, label, settings[key], min, max, (value) => updateEffect(name, key, value))
        if (kind === 'color') return <label className="ss-ls-field" key={key}><span>{label}</span><input type="color" value={settings[key]} disabled={busy || disabled} onChange={(event) => updateEffect(name, key, event.target.value)} /></label>
        return <label className="ss-ls-field" key={key}><span>{label}</span><select value={settings[key]} disabled={busy || disabled} onChange={(event) => updateEffect(name, key, event.target.value)}>{min.map((choice) => <option value={choice} key={choice}>{choice}</option>)}</select></label>
      })}
    </div>
  }

  async function submit(event) {
    event.preventDefault()
    if (busy || disabled || !layer) return
    if (typeof onApply !== 'function') { setError(words.notConnected); return }
    setBusy(true)
    setError('')
    try {
      const result = await onApply(normalizeStudioLayerStyle(draft), layer)
      if (result !== false) onClose?.()
    } catch (reason) {
      setError(reason?.message || words.notConnected)
    } finally {
      setBusy(false)
    }
  }

  return createPortal(
    <div className="ss-ls-overlay" role="presentation">
      <style>{`
        .ss-ls-overlay{position:fixed;inset:0;z-index:12200;display:flex;align-items:center;justify-content:center;padding:12px;background:#101010d9;color:#ededed;font:12px Arial,sans-serif}
        .ss-ls-overlay *{box-sizing:border-box}
        .ss-ls-dialog{width:min(98vw,900px);max-height:min(94dvh,760px);overflow:hidden;display:flex;flex-direction:column;border:1px solid #969696;background:#505050;box-shadow:0 16px 46px #000a}
        .ss-ls-title{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:38px;padding:7px 13px;background:#ededed;color:#242424;font-weight:600}
        .ss-ls-title button{border:0;background:transparent;color:#242424;font-size:18px;cursor:pointer}
        .ss-ls-body{display:grid;grid-template-columns:225px minmax(0,1fr) 150px;flex:1;min-height:0;gap:10px;padding:11px}
        .ss-ls-effects{overflow-y:auto;overscroll-behavior:contain;min-height:0;border:1px solid #343434;background:#484848}
        .ss-ls-effect-row{display:flex;align-items:center;gap:4px;min-height:30px;padding:0 6px;border-bottom:1px solid #565656}
        .ss-ls-effect-row[data-selected=true]{background:#777}
        .ss-ls-effect-row input{width:15px;height:15px;accent-color:#93b5e5}
        .ss-ls-effect-row button{flex:1;min-width:0;border:0;background:none;color:#f5f5f5;text-align:left;font:inherit;padding:7px 2px;cursor:pointer}
        .ss-ls-main{min-width:0;min-height:0;overflow-y:auto;border:1px solid #777;padding:12px;background:#515151}
        .ss-ls-main h3{margin:0 0 13px;font-size:13px}
        .ss-ls-field{display:grid;grid-template-columns:minmax(85px,120px) minmax(0,1fr);gap:9px;align-items:center;margin:9px 0;min-width:0}
        .ss-ls-field>span:first-child{color:#eee}
        .ss-ls-field select,.ss-ls-field input[type=color],.ss-ls-field input[type=number]{min-width:0;height:30px;background:#404040;border:1px solid #7b7b7b;color:#fff;padding:2px 5px;font:inherit}
        .ss-ls-field input[type=color]{width:48px;padding:2px;cursor:pointer}
        .ss-ls-number{display:flex;gap:7px;align-items:center;min-width:0}
        .ss-ls-number input[type=range]{flex:1;min-width:20px;accent-color:#a6c5ed}
        .ss-ls-number input[type=number]{width:54px}
        .ss-ls-channel{display:flex;gap:15px;align-items:center;margin:14px 0}
        .ss-ls-channel label{display:flex;gap:5px;align-items:center}
        .ss-ls-muted{color:#c6c6c6;line-height:1.4}
        .ss-ls-actions{display:flex;flex-direction:column;gap:9px;min-width:0}
        .ss-ls-actions>button{min-height:34px;border-radius:21px;border:1px solid #9d9d9d;background:#555;color:#fff;cursor:pointer}
        .ss-ls-actions>button:first-child{border-color:#d4d4d4}
        .ss-ls-actions>button:disabled{opacity:.5;cursor:not-allowed}
        .ss-ls-preview{width:100%;aspect-ratio:1;border:1px solid #292929;background:#777;display:grid;place-items:center;overflow:hidden}
        .ss-ls-preview canvas{max-width:100%;height:auto;background-color:transparent;background-image:linear-gradient(45deg,#aaa 25%,transparent 25%),linear-gradient(-45deg,#aaa 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#aaa 75%),linear-gradient(-45deg,transparent 75%,#aaa 75%);background-size:16px 16px;background-position:0 0,0 8px,8px -8px,-8px 0}
        .ss-ls-error{margin:12px 0 0;color:#ffcbcb;font-size:12px;line-height:1.5}
        .ss-ls-meta{margin-bottom:12px;padding:5px 8px;border:1px solid #737373;overflow-wrap:anywhere}
        @media(max-width:740px){.ss-ls-dialog{max-height:96dvh}.ss-ls-body{grid-template-columns:minmax(0,1fr) 110px;grid-template-rows:minmax(130px,36vh) minmax(100px,1fr);overflow-y:auto}.ss-ls-effects{grid-column:1;grid-row:1}.ss-ls-main{grid-column:1;grid-row:2;min-height:220px}.ss-ls-actions{grid-column:2;grid-row:1/3}.ss-ls-preview{max-width:110px}.ss-ls-field{grid-template-columns:minmax(70px,105px) minmax(0,1fr)}.ss-ls-number{flex-wrap:wrap}.ss-ls-number input[type=range]{flex-basis:100%}}
        @media(max-width:390px){.ss-ls-body{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(100px,26vh) minmax(150px,1fr) auto}.ss-ls-effects{grid-column:1;grid-row:1}.ss-ls-main{grid-column:1;grid-row:2}.ss-ls-actions{grid-column:1;grid-row:3;display:grid;grid-template-columns:1fr 1fr;align-items:center}.ss-ls-actions>.ss-ls-preview{display:none}.ss-ls-actions>.ss-ls-preview-toggle{grid-column:1/3}}
      `}</style>
      <section className="ss-ls-dialog" role="dialog" aria-modal="true" aria-label={words.title}>
        <header className="ss-ls-title"><span ref={titleRef} tabIndex={-1}>{words.title}</span><button type="button" onClick={onClose} disabled={busy} aria-label={words.cancel}>×</button></header>
        <form className="ss-ls-body" onSubmit={submit}>
          <aside className="ss-ls-effects" aria-label={words.effects}>
            <div className="ss-ls-effect-row" data-selected={selected === 'blending'}><button type="button" onClick={() => setSelected('blending')}>Blending Options</button></div>
            {STUDIO_LAYER_STYLE_EFFECTS.map(({ id, label }) => <div className="ss-ls-effect-row" data-selected={selected === id} key={id}>
              <input type="checkbox" checked={draft.effects[id].enabled} onChange={(event) => updateEffect(id, 'enabled', event.target.checked)} disabled={busy || disabled} aria-label={`${label}: enabled`} />
              <button type="button" onClick={() => setSelected(id)} aria-pressed={selected === id}>{label}</button>
            </div>)}
          </aside>
          <section className="ss-ls-main">
            <h3>{selected === 'blending' ? 'Blending Options' : STUDIO_LAYER_STYLE_EFFECTS.find((item) => item.id === selected)?.label}</h3>
            <div className="ss-ls-meta"><strong>{words.name}:</strong> {layer?.name || words.noLayer}</div>
            {selected === 'blending' ? <>
              <label className="ss-ls-field"><span>{words.blend}</span><select value={draft.blendMode} disabled={busy || disabled || layer?.isBackground} onChange={(event) => updateMain('blendMode', event.target.value)}>{STUDIO_BLEND_MODES.map((mode) => <option key={mode} value={mode}>{mode}</option>)}</select></label>
              {renderNumber('opacity', words.opacity, draft.opacity, 0, 100, (value) => updateMain('opacity', value))}
              {renderNumber('fillOpacity', words.fill, draft.fillOpacity, 0, 100, (value) => updateMain('fillOpacity', value))}
              <div className="ss-ls-channel"><span>{words.channels}:</span>{['r', 'g', 'b'].map((channel) => <label key={channel}><input type="checkbox" checked={draft.channels[channel]} disabled={busy || disabled} onChange={(event) => updateMain('channels', { ...draft.channels, [channel]: event.target.checked })} />{channel.toUpperCase()}</label>)}</div>
              <p className="ss-ls-muted">{words.advanced}</p>
            </> : effectFields(selected)}
            {layer?.locked ? <p className="ss-ls-error">{words.locked}</p> : null}
            {error ? <p className="ss-ls-error" role="alert">{error}</p> : null}
          </section>
          <aside className="ss-ls-actions">
            <button type="submit" disabled={busy || disabled || layer?.locked || !layer}>{busy ? words.busy : words.apply}</button>
            <button type="button" onClick={onClose} disabled={busy}>{words.cancel}</button>
            <label className="ss-ls-preview-toggle"><input type="checkbox" checked={preview} onChange={(event) => setPreview(event.target.checked)} /> {words.preview}</label>
            <div className="ss-ls-preview"><canvas ref={previewRef} width={190} height={190} aria-label={words.preview} /></div>
          </aside>
        </form>
      </section>
    </div>, document.body
  )
}
