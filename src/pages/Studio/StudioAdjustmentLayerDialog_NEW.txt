import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  createStudioAdjustment,
  normalizeStudioAdjustment,
  renderStudioAdjustmentCanvas,
  studioAdjustmentLabel,
} from './StudioAdjustmentLayerEngine'

const TEXT = {
  en: { title: 'Adjustment Layer', preview: 'Preview', cancel: 'Cancel', ok: 'OK', enabled: 'Enabled', error: 'Unable to preview this adjustment.' },
  km: { title: 'Adjustment Layer', preview: 'មើលជាមុន', cancel: 'បោះបង់', ok: 'យល់ព្រម', enabled: 'បើកប្រើ', error: 'មិនអាចបង្ហាញ Preview បាន។' },
  zh: { title: '调整图层', preview: '预览', cancel: '取消', ok: '确定', enabled: '启用', error: '无法预览此调整。' },
  ja: { title: '調整レイヤー', preview: 'プレビュー', cancel: 'キャンセル', ok: 'OK', enabled: '有効', error: 'この調整をプレビューできません。' },
  ko: { title: '조정 레이어', preview: '미리보기', cancel: '취소', ok: '확인', enabled: '사용', error: '이 조정을 미리 볼 수 없습니다.' },
}

const FIELDS = {
  'color-vibrance': [['vibrance', 'Vibrance', 'range', -100, 100], ['saturation', 'Saturation', 'range', -100, 100]],
  'brightness-contrast': [['brightness', 'Brightness', 'range', -100, 100], ['contrast', 'Contrast', 'range', -100, 100]],
  levels: [['inputBlack', 'Input black', 'range', 0, 254], ['gamma', 'Gamma', 'number', 0.1, 9.99, 0.01], ['inputWhite', 'Input white', 'range', 1, 255], ['outputBlack', 'Output black', 'range', 0, 255], ['outputWhite', 'Output white', 'range', 0, 255]],
  exposure: [['exposure', 'Exposure', 'number', -5, 5, 0.1], ['offset', 'Offset', 'number', -0.5, 0.5, 0.01], ['gamma', 'Gamma', 'number', 0.1, 9.99, 0.01]],
  vibrance: [['vibrance', 'Vibrance', 'range', -100, 100], ['saturation', 'Saturation', 'range', -100, 100]],
  'hue-saturation': [['hue', 'Hue', 'range', -180, 180], ['saturation', 'Saturation', 'range', -100, 100], ['lightness', 'Lightness', 'range', -100, 100]],
  'photo-filter': [['color', 'Color', 'color'], ['density', 'Density', 'range', 0, 100], ['preserveLuminosity', 'Preserve Luminosity', 'check']],
  'color-lookup': [['preset', 'Preset', 'select', ['neutral', 'warm', 'cool', 'cinematic', 'teal-orange', 'faded', 'high-contrast']], ['intensity', 'Intensity', 'range', 0, 100]],
  'selective-color': [['target', 'Colors', 'select', ['reds', 'yellows', 'greens', 'cyans', 'blues', 'magentas', 'whites', 'neutrals', 'blacks']], ['cyan', 'Cyan', 'range', -100, 100], ['magenta', 'Magenta', 'range', -100, 100], ['yellow', 'Yellow', 'range', -100, 100], ['black', 'Black', 'range', -100, 100]],
  posterize: [['levels', 'Levels', 'range', 2, 255]],
  threshold: [['level', 'Threshold level', 'range', 0, 255]],
  'gradient-map': [['startColor', 'Shadow color', 'color'], ['endColor', 'Highlight color', 'color'], ['reverse', 'Reverse', 'check']],
  'solid-color': [['color', 'Color', 'color']],
  gradient: [['startColor', 'Start color', 'color'], ['endColor', 'End color', 'color'], ['angle', 'Angle', 'range', -180, 180]],
  pattern: [['color', 'Background', 'color'], ['secondColor', 'Pattern', 'color'], ['size', 'Size', 'range', 2, 128], ['style', 'Style', 'select', ['checker', 'dots', 'lines']]],
}

const COLOR_BALANCE = [['shadows', 'Shadows'], ['midtones', 'Midtones'], ['highlights', 'Highlights']]
const MIXER = [['red', 'Red output'], ['green', 'Green output'], ['blue', 'Blue output']]
const BW = [['red', 'Reds'], ['yellow', 'Yellows'], ['green', 'Greens'], ['cyan', 'Cyans'], ['blue', 'Blues'], ['magenta', 'Magentas']]

export default function StudioAdjustmentLayerDialog({
  open = false,
  type = '',
  adjustment = null,
  sourceCanvas = null,
  language = 'en',
  disabled = false,
  onClose,
  onApply,
}) {
  const words = TEXT[language] || TEXT.en
  const [draft, setDraft] = useState(null)
  const [preview, setPreview] = useState(true)
  const [error, setError] = useState('')
  const previewRef = useRef(null)
  const title = useMemo(() => {
    try { return studioAdjustmentLabel(type) }
    catch { return words.title }
  }, [type, words.title])

  useEffect(() => {
    if (!open || !type) return
    setDraft(normalizeStudioAdjustment(adjustment?.type ? adjustment : createStudioAdjustment(type)))
    setPreview(true)
    setError('')
  }, [open, type, adjustment])

  useEffect(() => {
    if (!open || !draft || !previewRef.current) return
    const canvas = previewRef.current
    const context = canvas.getContext('2d')
    if (!context) return
    context.clearRect(0, 0, canvas.width, canvas.height)
    if (!preview || !sourceCanvas) return
    try {
      const rendered = renderStudioAdjustmentCanvas(sourceCanvas, draft, { maxDimension: 260 })
      const scale = Math.min(canvas.width / rendered.width, canvas.height / rendered.height)
      const width = rendered.width * scale
      const height = rendered.height * scale
      context.drawImage(rendered, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height)
      setError('')
    } catch {
      setError(words.error)
    }
  }, [open, draft, preview, sourceCanvas, words.error])

  useEffect(() => {
    if (!open) return
    const escape = (event) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      onClose?.()
    }
    window.addEventListener('keydown', escape, true)
    return () => window.removeEventListener('keydown', escape, true)
  }, [open, onClose])

  if (!open || !draft) return null

  function updateSetting(key, value) {
    setDraft((current) => ({ ...current, settings: { ...current.settings, [key]: value } }))
  }

  function updateNested(section, key, value) {
    setDraft((current) => ({
      ...current,
      settings: {
        ...current.settings,
        [section]: { ...current.settings[section], [key]: value },
      },
    }))
  }

  function field(key, label, kind, min, max, step = 1) {
    const value = draft.settings[key]
    if (kind === 'check') {
      return <label className="ss-adj-check" key={key}><input type="checkbox" checked={Boolean(value)} disabled={disabled} onChange={(event) => updateSetting(key, event.target.checked)} /> <span>{label}</span></label>
    }
    if (kind === 'color') {
      return <label className="ss-adj-field" key={key}><span>{label}</span><input type="color" value={value} disabled={disabled} onChange={(event) => updateSetting(key, event.target.value)} /></label>
    }
    if (kind === 'select') {
      return <label className="ss-adj-field" key={key}><span>{label}</span><select value={value} disabled={disabled} onChange={(event) => updateSetting(key, event.target.value)}>{min.map((choice) => <option value={choice} key={choice}>{choice}</option>)}</select></label>
    }
    return <label className="ss-adj-field" key={key}><span>{label}</span><div className="ss-adj-number">{kind === 'range' ? <input type="range" min={min} max={max} step={step} value={value} disabled={disabled} onChange={(event) => updateSetting(key, Number(event.target.value))} /> : null}<input type="number" min={min} max={max} step={step} value={value} disabled={disabled} onChange={(event) => updateSetting(key, Number(event.target.value))} /></div></label>
  }

  function curves() {
    return <div className="ss-adj-section"><p className="ss-adj-help">Curve output points</p>{draft.settings.points.map((point, index) => <label className="ss-adj-field" key={`${point[0]}-${index}`}><span>{`Input ${Math.round(point[0])}`}</span><div className="ss-adj-number"><input type="range" min="0" max="255" value={point[1]} disabled={disabled} onChange={(event) => {
      const points = draft.settings.points.map((item, itemIndex) => itemIndex === index ? [item[0], Number(event.target.value)] : item)
      updateSetting('points', points)
    }} /><input type="number" min="0" max="255" value={point[1]} disabled={disabled} onChange={(event) => {
      const points = draft.settings.points.map((item, itemIndex) => itemIndex === index ? [item[0], Number(event.target.value)] : item)
      updateSetting('points', points)
    }} /></div></label>)}</div>
  }

  function colorBalance() {
    return <>{COLOR_BALANCE.map(([section, label]) => <fieldset className="ss-adj-group" key={section}><legend>{label}</legend>{['r', 'g', 'b'].map((channel) => <label className="ss-adj-field" key={channel}><span>{channel.toUpperCase()}</span><div className="ss-adj-number"><input type="range" min="-100" max="100" value={draft.settings[section][channel]} disabled={disabled} onChange={(event) => updateNested(section, channel, Number(event.target.value))} /><input type="number" min="-100" max="100" value={draft.settings[section][channel]} disabled={disabled} onChange={(event) => updateNested(section, channel, Number(event.target.value))} /></div></label>)}</fieldset>)}<label className="ss-adj-check"><input type="checkbox" checked={draft.settings.preserveLuminosity} disabled={disabled} onChange={(event) => updateSetting('preserveLuminosity', event.target.checked)} /> Preserve Luminosity</label></>
  }

  function blackWhite() {
    return <>{BW.map(([key, label]) => field(key, label, 'range', -200, 300))}<label className="ss-adj-check"><input type="checkbox" checked={draft.settings.tint} disabled={disabled} onChange={(event) => updateSetting('tint', event.target.checked)} /> Tint</label>{draft.settings.tint ? <>{field('tintColor', 'Tint color', 'color')}{field('tintStrength', 'Tint strength', 'range', 0, 100)}</> : null}</>
  }

  function channelMixer() {
    return <><label className="ss-adj-check"><input type="checkbox" checked={draft.settings.monochrome} disabled={disabled} onChange={(event) => updateSetting('monochrome', event.target.checked)} /> Monochrome</label>{MIXER.map(([section, label]) => <fieldset className="ss-adj-group" key={section}><legend>{label}</legend>{['r', 'g', 'b', 'constant'].map((channel) => <label className="ss-adj-field" key={channel}><span>{channel === 'constant' ? 'Constant' : channel.toUpperCase()}</span><div className="ss-adj-number"><input type="range" min="-200" max="200" value={draft.settings[section][channel]} disabled={disabled} onChange={(event) => updateNested(section, channel, Number(event.target.value))} /><input type="number" min="-200" max="200" value={draft.settings[section][channel]} disabled={disabled} onChange={(event) => updateNested(section, channel, Number(event.target.value))} /></div></label>)}</fieldset>)}</>
  }

  function controls() {
    if (draft.type === 'invert') return <p className="ss-adj-help">Invert has no additional controls.</p>
    if (draft.type === 'curves') return curves()
    if (draft.type === 'color-balance') return colorBalance()
    if (draft.type === 'black-white') return blackWhite()
    if (draft.type === 'channel-mixer') return channelMixer()
    return <>{(FIELDS[draft.type] || []).map((definition) => field(...definition))}</>
  }

  async function submit(event) {
    event.preventDefault()
    if (disabled) return
    const normalized = normalizeStudioAdjustment(draft)
    const result = await onApply?.(normalized)
    if (result !== false) onClose?.()
  }

  return createPortal(<div className="ss-adj-overlay">
    <style>{`
      .ss-adj-overlay{position:fixed;inset:0;z-index:12400;display:grid;place-items:center;padding:12px;background:#101010d9;color:#eee;font:12px Arial,sans-serif}
      .ss-adj-overlay *{box-sizing:border-box}.ss-adj-dialog{width:min(94vw,760px);max-height:94dvh;display:flex;flex-direction:column;border:1px solid #858585;background:#4b4b4b;box-shadow:0 18px 50px #000b}
      .ss-adj-title{display:flex;align-items:center;justify-content:space-between;min-height:38px;padding:7px 12px;background:#ededed;color:#222;font-weight:700}.ss-adj-title button{border:0;background:transparent;font-size:18px;cursor:pointer}
      .ss-adj-form{display:grid;grid-template-columns:minmax(0,1fr) 220px;gap:12px;min-height:0;padding:12px}.ss-adj-controls{min-height:300px;max-height:70dvh;overflow:auto;padding:12px;border:1px solid #666;background:#515151}.ss-adj-controls h3{margin:0 0 14px}
      .ss-adj-field{display:grid;grid-template-columns:130px minmax(0,1fr);gap:9px;align-items:center;margin:9px 0}.ss-adj-field select,.ss-adj-field input[type=number],.ss-adj-field input[type=color]{height:30px;border:1px solid #777;background:#3d3d3d;color:#fff}.ss-adj-number{display:flex;align-items:center;gap:7px}.ss-adj-number input[type=range]{flex:1;min-width:50px}.ss-adj-number input[type=number]{width:68px}.ss-adj-check{display:flex;gap:7px;align-items:center;margin:10px 0}.ss-adj-group{margin:12px 0;padding:8px;border:1px solid #737373}.ss-adj-help{color:#d0d0d0}
      .ss-adj-side{display:flex;flex-direction:column;gap:10px}.ss-adj-preview{width:100%;aspect-ratio:1;border:1px solid #282828;background:#777;display:grid;place-items:center}.ss-adj-preview canvas{max-width:100%;height:auto}.ss-adj-actions{display:flex;gap:8px}.ss-adj-actions button{flex:1;min-height:34px;border:1px solid #999;border-radius:18px;background:#555;color:#fff}.ss-adj-error{color:#ffd0d0}
      @media(max-width:640px){.ss-adj-dialog{width:96vw;max-height:96dvh}.ss-adj-form{grid-template-columns:1fr;overflow:auto}.ss-adj-controls{min-height:220px;max-height:none}.ss-adj-side{display:grid;grid-template-columns:110px 1fr;align-items:start}.ss-adj-preview{width:110px}.ss-adj-actions{align-self:center}.ss-adj-field{grid-template-columns:105px minmax(0,1fr)}}
    `}</style>
    <section className="ss-adj-dialog" role="dialog" aria-modal="true" aria-label={`${words.title}: ${title}`}>
      <header className="ss-adj-title"><span>{words.title}: {title}</span><button type="button" onClick={onClose} aria-label={words.cancel}>×</button></header>
      <form className="ss-adj-form" onSubmit={submit}>
        <section className="ss-adj-controls"><h3>{title}</h3><label className="ss-adj-check"><input type="checkbox" checked={draft.enabled} disabled={disabled} onChange={(event) => setDraft((current) => ({ ...current, enabled: event.target.checked }))} /> {words.enabled}</label>{controls()}{error ? <p className="ss-adj-error" role="alert">{error}</p> : null}</section>
        <aside className="ss-adj-side"><div className="ss-adj-preview"><canvas ref={previewRef} width="260" height="260" aria-label={words.preview} /></div><label className="ss-adj-check"><input type="checkbox" checked={preview} onChange={(event) => setPreview(event.target.checked)} /> {words.preview}</label><div className="ss-adj-actions"><button type="submit" disabled={disabled}>{words.ok}</button><button type="button" onClick={onClose}>{words.cancel}</button></div></aside>
      </form>
    </section>
  </div>, document.body)
}
