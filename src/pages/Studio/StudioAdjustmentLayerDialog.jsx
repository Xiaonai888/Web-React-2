import { useEffect, useMemo, useRef, useState } from 'react'
import {
  StudioUIButton,
  StudioUIButtonRow,
  StudioUIColor,
  StudioUIDialog,
  StudioUINumber,
  StudioUIPreview,
  StudioUISection,
  StudioUISelect,
  StudioUISlider,
  StudioUIToggle,
} from './StudioUIControls'
import StudioUIHistogram from './StudioUIHistogram'
import StudioUICurveEditor from './StudioUICurveEditor'
import StudioUIColorPicker from './StudioUIColorPicker'
import StudioUIGradientEditor from './StudioUIGradientEditor'
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
  'color-lookup': [['preset', 'Preset', 'select', ['neutral', 'warm', 'cool', 'cinematic', 'teal-orange', 'faded', 'high-contrast']], ['intensity', 'Intensity', 'range', 0, 100]],
  'selective-color': [['target', 'Colors', 'select', ['reds', 'yellows', 'greens', 'cyans', 'blues', 'magentas', 'whites', 'neutrals', 'blacks']], ['cyan', 'Cyan', 'range', -100, 100], ['magenta', 'Magenta', 'range', -100, 100], ['yellow', 'Yellow', 'range', -100, 100], ['black', 'Black', 'range', -100, 100]],
  posterize: [['levels', 'Levels', 'range', 2, 255]],
  threshold: [['level', 'Threshold level', 'range', 0, 255]],
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
  const [busy, setBusy] = useState(false)
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
    setBusy(false)
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
    if (!open) return undefined
    const escape = (event) => {
      if (event.key !== 'Escape' || busy) return
      event.preventDefault()
      event.stopPropagation()
      onClose?.()
    }
    window.addEventListener('keydown', escape, true)
    return () => window.removeEventListener('keydown', escape, true)
  }, [open, busy, onClose])

  if (!open || !draft) return null

  function updateSetting(key, value) {
    setDraft((current) => ({ ...current, settings: { ...current.settings, [key]: value } }))
    setError('')
  }

  function updateNested(section, key, value) {
    setDraft((current) => ({
      ...current,
      settings: {
        ...current.settings,
        [section]: { ...current.settings[section], [key]: value },
      },
    }))
    setError('')
  }

  function field(key, label, kind, min, max, step = 1) {
    const value = draft.settings[key]
    if (kind === 'check') {
      return <StudioUIToggle key={key} label={label} checked={Boolean(value)} disabled={disabled || busy} onChange={(next) => updateSetting(key, next)} />
    }
    if (kind === 'color') {
      return <StudioUIColor key={key} label={label} value={value} disabled={disabled || busy} onChange={(next) => {
        if (/^#[0-9a-f]{6}$/i.test(next)) updateSetting(key, next)
      }} />
    }
    if (kind === 'select') {
      return <StudioUISelect key={key} label={label} value={value} options={min} disabled={disabled || busy} onChange={(next) => updateSetting(key, next)} />
    }
    if (kind === 'number') {
      return <StudioUINumber key={key} label={label} value={value} min={min} max={max} step={step} disabled={disabled || busy} onChange={(next) => updateSetting(key, next)} />
    }
    return <StudioUISlider key={key} label={label} value={value} min={min} max={max} step={step} disabled={disabled || busy} onChange={(next) => updateSetting(key, next)} />
  }

  function curves() {
    return <>
      <StudioUIHistogram sourceCanvas={sourceCanvas} label="Histogram" />
      <StudioUICurveEditor
        points={draft.settings.points}
        disabled={disabled || busy}
        onChange={(points) => updateSetting('points', points)}
      />
    </>
  }

  function colorBalance() {
    return <>
      {COLOR_BALANCE.map(([section, label]) => (
        <StudioUISection key={section} title={label}>
          {['r', 'g', 'b'].map((channel) => (
            <StudioUISlider
              key={channel}
              label={channel.toUpperCase()}
              value={draft.settings[section][channel]}
              min={-100}
              max={100}
              disabled={disabled || busy}
              onChange={(next) => updateNested(section, channel, next)}
            />
          ))}
        </StudioUISection>
      ))}
      <StudioUIToggle label="Preserve Luminosity" checked={draft.settings.preserveLuminosity} disabled={disabled || busy} onChange={(next) => updateSetting('preserveLuminosity', next)} />
    </>
  }

  function blackWhite() {
    return <>
      {BW.map(([key, label]) => field(key, label, 'range', -200, 300))}
      <StudioUIToggle label="Tint" checked={draft.settings.tint} disabled={disabled || busy} onChange={(next) => updateSetting('tint', next)} />
      {draft.settings.tint ? <>
        <StudioUIColorPicker value={draft.settings.tintColor} disabled={disabled || busy} label="Tint color" onChange={(next) => updateSetting('tintColor', next)} />
        {field('tintStrength', 'Tint strength', 'range', 0, 100)}
      </> : null}
    </>
  }

  function channelMixer() {
    return <>
      <StudioUIToggle label="Monochrome" checked={draft.settings.monochrome} disabled={disabled || busy} onChange={(next) => updateSetting('monochrome', next)} />
      {MIXER.map(([section, label]) => (
        <StudioUISection key={section} title={label}>
          {['r', 'g', 'b', 'constant'].map((channel) => (
            <StudioUISlider
              key={channel}
              label={channel === 'constant' ? 'Constant' : channel.toUpperCase()}
              value={draft.settings[section][channel]}
              min={-200}
              max={200}
              disabled={disabled || busy}
              onChange={(next) => updateNested(section, channel, next)}
            />
          ))}
        </StudioUISection>
      ))}
    </>
  }

  function photoFilter() {
    return <>
      <StudioUIColorPicker value={draft.settings.color} disabled={disabled || busy} label="Filter color" onChange={(next) => updateSetting('color', next)} />
      <StudioUISlider label="Density" value={draft.settings.density} min={0} max={100} suffix="%" disabled={disabled || busy} onChange={(next) => updateSetting('density', next)} />
      <StudioUIToggle label="Preserve Luminosity" checked={draft.settings.preserveLuminosity} disabled={disabled || busy} onChange={(next) => updateSetting('preserveLuminosity', next)} />
    </>
  }

  function gradientEditor(showAngle, label) {
    return <StudioUIGradientEditor
      label={label}
      startColor={draft.settings.startColor}
      endColor={draft.settings.endColor}
      angle={showAngle ? draft.settings.angle : 0}
      reverse={Boolean(draft.settings.reverse)}
      showAngle={showAngle}
      disabled={disabled || busy}
      onChange={(next) => {
        setDraft((current) => ({
          ...current,
          settings: {
            ...current.settings,
            startColor: next.startColor,
            endColor: next.endColor,
            ...(showAngle ? { angle: next.angle } : {}),
            ...('reverse' in current.settings ? { reverse: next.reverse } : {}),
          },
        }))
      }}
    />
  }

  function controls() {
    if (draft.type === 'invert') return <div className="ss-adj-ui-empty"><i className="fa-solid fa-circle-half-stroke" aria-hidden="true" /><span>Invert has no additional controls.</span></div>
    if (draft.type === 'curves') return curves()
    if (draft.type === 'color-balance') return colorBalance()
    if (draft.type === 'black-white') return blackWhite()
    if (draft.type === 'channel-mixer') return channelMixer()
    if (draft.type === 'photo-filter') return photoFilter()
    if (draft.type === 'gradient-map') return gradientEditor(false, 'Gradient Map')
    if (draft.type === 'gradient') return gradientEditor(true, 'Gradient')
    if (draft.type === 'solid-color') return <StudioUIColorPicker value={draft.settings.color} disabled={disabled || busy} label="Solid color" onChange={(next) => updateSetting('color', next)} />
    return <>
      {draft.type === 'levels' ? <StudioUIHistogram sourceCanvas={sourceCanvas} label="Histogram" /> : null}
      {(FIELDS[draft.type] || []).map((definition) => field(...definition))}
    </>
  }

  async function applyDraft() {
    if (disabled || busy) return
    setBusy(true)
    setError('')
    try {
      const normalized = normalizeStudioAdjustment(draft)
      const result = await onApply?.(normalized)
      if (result !== false) onClose?.()
    } catch (reason) {
      setError(reason?.message || words.error)
    } finally {
      setBusy(false)
    }
  }

  const previewPanel = (
    <div className="ss-adj-ui-side">
      <StudioUIPreview label={words.preview}>
        <canvas ref={previewRef} width="260" height="260" aria-label={words.preview} />
      </StudioUIPreview>
      <StudioUIToggle label={words.preview} checked={preview} disabled={busy} onChange={setPreview} />
    </div>
  )

  return (
    <>
      <style>{`
        .ss-adj-ui-dialog .ss-ui-dialog-layout.has-aside{grid-template-columns:minmax(0,1fr) 240px}
        .ss-adj-ui-dialog .ss-ui-dialog-aside{grid-column:2;grid-row:1;border-right:0;border-left:1px solid #3b4651;background:#242b33}
        .ss-adj-ui-dialog .ss-ui-dialog-content{grid-column:1;grid-row:1}
        .ss-adj-ui-controls{display:grid;gap:10px}
        .ss-adj-ui-side{display:grid;gap:10px;padding:11px}
        .ss-adj-ui-side canvas{display:block;width:100%;height:auto;max-width:260px}
        .ss-adj-ui-error{margin:10px 0 0;padding:8px 10px;border:1px solid #8e4750;border-radius:6px;background:#4b2b31;color:#ffd5d8;font-size:10px}
        .ss-adj-ui-empty{min-height:120px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;border:1px dashed #4b5968;border-radius:8px;color:#aab8c6}
        .ss-adj-ui-empty i{font-size:28px;color:#78baff}
        @media(max-width:700px),(pointer:coarse){
          .ss-adj-ui-dialog .ss-ui-dialog-layout.has-aside{grid-template-columns:1fr}
          .ss-adj-ui-dialog .ss-ui-dialog-aside{grid-column:1;grid-row:2;border-left:0;border-top:1px solid #3b4651}
          .ss-adj-ui-dialog .ss-ui-dialog-content{grid-column:1;grid-row:1}
          .ss-adj-ui-side{grid-template-columns:120px minmax(0,1fr);align-items:start}
        }
        @media(max-width:430px){.ss-adj-ui-side{grid-template-columns:1fr}.ss-adj-ui-side .ss-ui-preview{display:none}}
      `}</style>
      <StudioUIDialog
        open={open}
        title={`${words.title} · ${title}`}
        subtitle="Non-destructive adjustment"
        icon="fa-solid fa-circle-half-stroke"
        width={820}
        busy={busy}
        onClose={onClose}
        aside={previewPanel}
        className="ss-adj-ui-dialog"
        footer={
          <StudioUIButtonRow>
            <StudioUIButton disabled={busy} onClick={onClose}>{words.cancel}</StudioUIButton>
            <StudioUIButton variant="primary" disabled={disabled || busy} onClick={applyDraft}>{busy ? 'Applying…' : words.ok}</StudioUIButton>
          </StudioUIButtonRow>
        }
      >
        <div className="ss-adj-ui-controls">
          <StudioUISection title={title} subtitle={draft.type.replaceAll('-', ' ')}>
            <StudioUIToggle label={words.enabled} checked={draft.enabled} disabled={disabled || busy} onChange={(next) => setDraft((current) => ({ ...current, enabled: next }))} />
            {controls()}
          </StudioUISection>
          {error ? <p className="ss-adj-ui-error" role="alert">{error}</p> : null}
        </div>
      </StudioUIDialog>
    </>
  )
}
