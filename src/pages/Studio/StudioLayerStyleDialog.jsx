import { useEffect, useRef, useState } from 'react'
import {
  StudioUIButton,
  StudioUIButtonRow,
  StudioUIColor,
  StudioUIDialog,
  StudioUIPreview,
  StudioUISection,
  StudioUISelect,
  StudioUISlider,
  StudioUIToggle,
} from './StudioUIControls'
import StudioUIAngleDial from './StudioUIAngleDial'
import StudioUIGradientEditor from './StudioUIGradientEditor'
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
  en: { title: 'Layer Style', name: 'Name', blend: 'Blend Mode', opacity: 'Opacity', fill: 'Fill Opacity', channels: 'Channels', effects: 'Styles', preview: 'Preview', cancel: 'Cancel', apply: 'OK', busy: 'Applying…', locked: 'Unlock this layer before applying changes.', noLayer: 'Select a layer to edit its style.', notConnected: 'Layer Style is not connected to this project yet.', error: 'Unable to preview this layer.', knockout: 'Knockout', blendIf: 'Blend If', blendIfChannel: 'Channel', thisLayer: 'This Layer', underlying: 'Underlying Layer', blackCut: 'Black Cut', blackFade: 'Black Fade', whiteFade: 'White Fade', whiteCut: 'White Cut', hint: 'Underlying Layer is calculated from the layers below when the main canvas is rendered.' },
  km: { title: 'រចនាប័ទ្ម Layer', name: 'ឈ្មោះ', blend: 'របៀបលាយ', opacity: 'ភាពស្រអាប់', fill: 'ភាពស្រអាប់ផ្ទៃ', channels: 'ឆានែល', effects: 'រចនាប័ទ្ម', preview: 'មើលជាមុន', cancel: 'បោះបង់', apply: 'យល់ព្រម', busy: 'កំពុងអនុវត្ត…', locked: 'សូមដោះសោ Layer មុនអនុវត្ត។', noLayer: 'សូមជ្រើស Layer ដើម្បីកែរចនាប័ទ្ម។', notConnected: 'ផ្ទាំង Layer Style មិនទាន់ភ្ជាប់ទៅ Project ទេ។', error: 'មិនអាចបង្ហាញរូបមើលជាមុនបាន។', knockout: 'Knockout', blendIf: 'Blend If', blendIfChannel: 'ឆានែល', thisLayer: 'Layer នេះ', underlying: 'Layer ខាងក្រោម', blackCut: 'Black Cut', blackFade: 'Black Fade', whiteFade: 'White Fade', whiteCut: 'White Cut', hint: 'Underlying Layer នឹងគណនាពី Layer ខាងក្រោមនៅពេល Canvas សរុបត្រូវ Render។' },
  zh: { title: '图层样式', name: '名称', blend: '混合模式', opacity: '不透明度', fill: '填充不透明度', channels: '通道', effects: '样式', preview: '预览', cancel: '取消', apply: '确定', busy: '应用中…', locked: '请先解锁图层。', noLayer: '请选择图层。', notConnected: '图层样式尚未连接。', error: '无法预览图层。', knockout: '挖空', blendIf: '混合颜色带', blendIfChannel: '通道', thisLayer: '本图层', underlying: '下一图层', blackCut: '黑色截断', blackFade: '黑色过渡', whiteFade: '白色过渡', whiteCut: '白色截断', hint: '下一图层范围会在主画布合成时从下方图层计算。' },
  ja: { title: 'レイヤースタイル', name: '名前', blend: '描画モード', opacity: '不透明度', fill: '塗りの不透明度', channels: 'チャンネル', effects: 'スタイル', preview: 'プレビュー', cancel: 'キャンセル', apply: 'OK', busy: '適用中…', locked: '先にレイヤーのロックを解除してください。', noLayer: 'レイヤーを選択してください。', notConnected: 'レイヤースタイルは未接続です。', error: 'レイヤーをプレビューできません。', knockout: 'ノックアウト', blendIf: 'ブレンド条件', blendIfChannel: 'チャンネル', thisLayer: 'このレイヤー', underlying: '下のレイヤー', blackCut: '黒のカット', blackFade: '黒のフェード', whiteFade: '白のフェード', whiteCut: '白のカット', hint: '下のレイヤー範囲はメインキャンバス合成時に計算されます。' },
  ko: { title: '레이어 스타일', name: '이름', blend: '혼합 모드', opacity: '불투명도', fill: '채우기 불투명도', channels: '채널', effects: '스타일', preview: '미리보기', cancel: '취소', apply: '확인', busy: '적용 중…', locked: '먼저 레이어 잠금을 해제하세요.', noLayer: '레이어를 선택하세요.', notConnected: '레이어 스타일이 연결되지 않았습니다.', error: '레이어 미리보기를 표시할 수 없습니다.', knockout: '녹아웃', blendIf: 'Blend If', blendIfChannel: '채널', thisLayer: '이 레이어', underlying: '아래 레이어', blackCut: '검정 컷', blackFade: '검정 페이드', whiteFade: '흰색 페이드', whiteCut: '흰색 컷', hint: '아래 레이어 범위는 메인 캔버스를 합성할 때 계산됩니다.' },
}

export default function StudioLayerStyleDialog({ open = false, layer = null, initialEffect = 'blending', onClose, onApply, disabled = false, language = 'en' }) {
  const words = TRANSLATIONS[language] || TRANSLATIONS.en
  const [draft, setDraft] = useState(createStudioLayerStyle)
  const [selected, setSelected] = useState('blending')
  const [preview, setPreview] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const previewRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const next = normalizeStudioLayerStyle({ blendMode: layer?.blendMode || 'normal', opacity: layer?.opacity ?? 100, ...(layer?.layerStyle || {}) })
    const target = STUDIO_LAYER_STYLE_EFFECTS.some((item) => item.id === initialEffect) ? initialEffect : 'blending'
    if (target !== 'blending') next.effects[target].enabled = true
    setDraft(next)
    setSelected(target)
    setPreview(true)
    setError('')
    setBusy(false)
  }, [open, layer?.id, initialEffect])

  useEffect(() => {
    if (!open || !previewRef.current) return
    const canvas = previewRef.current
    const context = canvas.getContext('2d')
    if (!context) return
    context.clearRect(0, 0, canvas.width, canvas.height)
    if (!layer?.canvas || !preview) return
    try {
      const rendered = renderStudioStyledLayer(layer.canvas, draft, { maxDimension: 210 })
      const scale = Math.min(1, 190 / Math.max(rendered.width, rendered.height))
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
    setDraft((current) => normalizeStudioLayerStyle({ ...current, [key]: value }))
    setError('')
  }

  function updateAdvanced(key, value) {
    setDraft((current) => normalizeStudioLayerStyle({ ...current, advanced: { ...current.advanced, [key]: value } }))
    setError('')
  }

  function updateBlendIf(scope, key, value) {
    setDraft((current) => normalizeStudioLayerStyle({
      ...current,
      advanced: {
        ...current.advanced,
        blendIf: {
          ...current.advanced.blendIf,
          [scope]: { ...current.advanced.blendIf[scope], [key]: value },
        },
      },
    }))
    setError('')
  }

  function updateEffect(name, key, value) {
    setDraft((current) => ({ ...current, effects: { ...current.effects, [name]: { ...current.effects[name], [key]: value } } }))
    setError('')
  }

  function control(name, key, label, kind, min, max) {
    const settings = draft.effects[name]
    const value = settings[key]
    if (kind === 'color') {
      return <StudioUIColor key={key} label={label} value={value} disabled={busy || disabled} onChange={(next) => {
        if (/^#[0-9a-f]{6}$/i.test(next)) updateEffect(name, key, next)
      }} />
    }
    if (kind === 'select') {
      return <StudioUISelect key={key} label={label} value={value} options={min} disabled={busy || disabled} onChange={(next) => updateEffect(name, key, next)} />
    }
    if (key === 'angle') {
      return <div className="ss-ls-ui-angle" key={key}><StudioUIAngleDial label={label} value={value} min={min} max={max} disabled={busy || disabled} onChange={(next) => updateEffect(name, key, next)} /></div>
    }
    return <StudioUISlider key={key} label={label} value={value} min={min} max={max} suffix={key === 'opacity' || key === 'depth' || key === 'amount' ? '%' : ''} disabled={busy || disabled} onChange={(next) => updateEffect(name, key, next)} />
  }

  function effectFields(name) {
    if (name === 'gradientOverlay') {
      const settings = draft.effects.gradientOverlay
      return <>
        <StudioUIGradientEditor
          label="Gradient Overlay"
          startColor={settings.color}
          endColor={settings.secondColor}
          angle={settings.angle}
          disabled={busy || disabled}
          onChange={(next) => {
            setDraft((current) => ({
              ...current,
              effects: {
                ...current.effects,
                gradientOverlay: {
                  ...current.effects.gradientOverlay,
                  color: next.startColor,
                  secondColor: next.endColor,
                  angle: next.angle,
                },
              },
            }))
          }}
        />
        <StudioUISlider label="Opacity" value={settings.opacity} min={0} max={100} suffix="%" disabled={busy || disabled} onChange={(next) => updateEffect(name, 'opacity', next)} />
      </>
    }
    return <>{CONTROL_GROUPS[name].map(([key, label, kind, min, max]) => control(name, key, label, kind, min, max))}</>
  }

  function blendIfFields(scope, title) {
    const range = draft.advanced.blendIf[scope]
    return <StudioUISection title={title}>
      <StudioUISlider label={words.blackCut} value={range.black} min={0} max={255} disabled={busy || disabled} onChange={(next) => updateBlendIf(scope, 'black', next)} />
      <StudioUISlider label={words.blackFade} value={range.blackFade} min={0} max={255} disabled={busy || disabled} onChange={(next) => updateBlendIf(scope, 'blackFade', next)} />
      <StudioUISlider label={words.whiteFade} value={range.whiteFade} min={0} max={255} disabled={busy || disabled} onChange={(next) => updateBlendIf(scope, 'whiteFade', next)} />
      <StudioUISlider label={words.whiteCut} value={range.white} min={0} max={255} disabled={busy || disabled} onChange={(next) => updateBlendIf(scope, 'white', next)} />
    </StudioUISection>
  }

  async function submit() {
    if (busy || disabled || !layer) return
    if (typeof onApply !== 'function') {
      setError(words.notConnected)
      return
    }
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

  const effectList = (
    <div className="ss-ls-ui-effects" aria-label={words.effects}>
      <button type="button" className={selected === 'blending' ? 'active' : ''} onClick={() => setSelected('blending')}>
        <span className="ss-ls-ui-effect-check-placeholder" aria-hidden="true" />
        <span>Blending Options</span>
      </button>
      {STUDIO_LAYER_STYLE_EFFECTS.map(({ id, label }) => (
        <div className={`ss-ls-ui-effect-row ${selected === id ? 'active' : ''}`} key={id}>
          <input type="checkbox" checked={draft.effects[id].enabled} onChange={(event) => updateEffect(id, 'enabled', event.target.checked)} disabled={busy || disabled} aria-label={`${label}: enabled`} />
          <button type="button" onClick={() => setSelected(id)}>{label}</button>
        </div>
      ))}
    </div>
  )

  return (
    <>
      <style>{`
        .ss-ls-ui-dialog .ss-ui-dialog-layout.has-aside{grid-template-columns:205px minmax(0,1fr)}
        .ss-ls-ui-dialog .ss-ui-dialog-content{padding:0}
        .ss-ls-ui-effects{padding:7px;display:grid;gap:3px}
        .ss-ls-ui-effects>button,.ss-ls-ui-effect-row{min-height:31px;border-radius:5px}
        .ss-ls-ui-effects>button{display:grid;grid-template-columns:18px minmax(0,1fr);align-items:center;width:100%;padding:0 7px;border:0;background:transparent;color:#dce7f2;text-align:left;font:600 10px Inter,system-ui,sans-serif;cursor:pointer}
        .ss-ls-ui-effects>button.active,.ss-ls-ui-effect-row.active{background:#355d84;color:#fff}
        .ss-ls-ui-effect-row{display:grid;grid-template-columns:22px minmax(0,1fr);align-items:center;padding:0 5px}
        .ss-ls-ui-effect-row input{width:15px;height:15px;accent-color:#5faeff}
        .ss-ls-ui-effect-row button{min-width:0;height:100%;padding:0;border:0;background:transparent;color:inherit;text-align:left;font:600 10px Inter,system-ui,sans-serif;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .ss-ls-ui-effect-check-placeholder{display:block;width:15px;height:15px}
        .ss-ls-ui-work{display:grid;grid-template-columns:minmax(0,1fr) 210px;min-height:430px}
        .ss-ls-ui-main{min-width:0;padding:13px;overflow:auto}
        .ss-ls-ui-preview-column{display:grid;align-content:start;gap:10px;padding:11px;border-left:1px solid #3b4651;background:#242b33}
        .ss-ls-ui-preview-column canvas{display:block;width:100%;height:auto;max-width:210px}
        .ss-ls-ui-meta{margin-bottom:10px;padding:7px 9px;border:1px solid #3b4651;border-radius:6px;background:#242c34;color:#aab8c6;font-size:10px}
        .ss-ls-ui-controls{display:grid;gap:10px}
        .ss-ls-ui-channel-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:4px 0}
        .ss-ls-ui-channel-row>span{color:#aab8c6;font-size:10px;font-weight:700}
        .ss-ls-ui-channel-row label{display:flex;align-items:center;gap:4px;color:#edf3fa;font-size:10px}
        .ss-ls-ui-channel-row input{width:15px;height:15px;accent-color:#5faeff}
        .ss-ls-ui-angle{padding:6px 0}
        .ss-ls-ui-hint{margin:0;padding:8px 9px;border-radius:6px;background:#202832;color:#9fb0c0;font-size:9px;line-height:1.45}
        .ss-ls-ui-error{margin:10px 0 0;padding:8px 10px;border:1px solid #8e4750;border-radius:6px;background:#4b2b31;color:#ffd5d8;font-size:10px}
        @media(max-width:760px),(pointer:coarse){
          .ss-ls-ui-dialog .ss-ui-dialog-layout.has-aside{grid-template-columns:1fr}
          .ss-ls-ui-dialog .ss-ui-dialog-aside{max-height:145px;border-right:0;border-bottom:1px solid #3b4651}
          .ss-ls-ui-effects{grid-template-columns:repeat(2,minmax(0,1fr))}
          .ss-ls-ui-work{grid-template-columns:1fr}
          .ss-ls-ui-preview-column{grid-template-columns:120px minmax(0,1fr);border-left:0;border-top:1px solid #3b4651}
        }
        @media(max-width:430px){
          .ss-ls-ui-effects{grid-template-columns:1fr 1fr}
          .ss-ls-ui-preview-column .ss-ui-preview{display:none}
          .ss-ls-ui-preview-column{grid-template-columns:1fr}
        }
      `}</style>
      <StudioUIDialog
        open={open}
        title={words.title}
        subtitle={layer?.name || words.noLayer}
        icon="fa-solid fa-wand-magic-sparkles"
        width={940}
        busy={busy}
        onClose={onClose}
        aside={effectList}
        className="ss-ls-ui-dialog"
        footer={
          <StudioUIButtonRow>
            <StudioUIButton disabled={busy} onClick={onClose}>{words.cancel}</StudioUIButton>
            <StudioUIButton variant="primary" disabled={busy || disabled || layer?.locked || !layer} onClick={submit}>{busy ? words.busy : words.apply}</StudioUIButton>
          </StudioUIButtonRow>
        }
      >
        <div className="ss-ls-ui-work">
          <div className="ss-ls-ui-main">
            <div className="ss-ls-ui-meta"><strong>{words.name}:</strong> {layer?.name || words.noLayer}</div>
            <div className="ss-ls-ui-controls">
              {selected === 'blending' ? <>
                <StudioUISection title="Blending Options" subtitle={words.blend}>
                  <StudioUISelect label={words.blend} value={draft.blendMode} options={STUDIO_BLEND_MODES} disabled={busy || disabled || layer?.isBackground} onChange={(next) => updateMain('blendMode', next)} />
                  <StudioUISlider label={words.opacity} value={draft.opacity} min={0} max={100} suffix="%" disabled={busy || disabled} onChange={(next) => updateMain('opacity', next)} />
                  <StudioUISlider label={words.fill} value={draft.fillOpacity} min={0} max={100} suffix="%" disabled={busy || disabled} onChange={(next) => updateMain('fillOpacity', next)} />
                  <div className="ss-ls-ui-channel-row">
                    <span>{words.channels}:</span>
                    {['r', 'g', 'b'].map((channel) => <label key={channel}><input type="checkbox" checked={draft.channels[channel]} disabled={busy || disabled} onChange={(event) => updateMain('channels', { ...draft.channels, [channel]: event.target.checked })} />{channel.toUpperCase()}</label>)}
                  </div>
                  <StudioUISelect label={words.knockout} value={draft.advanced.knockout} options={['none', 'shallow', 'deep']} disabled={busy || disabled || layer?.isBackground} onChange={(next) => updateAdvanced('knockout', next)} />
                </StudioUISection>
                <StudioUISection title={words.blendIf} subtitle={words.hint}>
                  <StudioUISelect label={words.blendIfChannel} value={draft.advanced.blendIf.channel} options={[{ value: 'gray', label: 'Gray' }, { value: 'r', label: 'Red' }, { value: 'g', label: 'Green' }, { value: 'b', label: 'Blue' }]} disabled={busy || disabled} onChange={(next) => updateAdvanced('blendIf', { ...draft.advanced.blendIf, channel: next })} />
                  {blendIfFields('thisLayer', words.thisLayer)}
                  {blendIfFields('underlying', words.underlying)}
                  <p className="ss-ls-ui-hint">{words.hint}</p>
                </StudioUISection>
              </> : <StudioUISection title={STUDIO_LAYER_STYLE_EFFECTS.find((item) => item.id === selected)?.label || selected}>
                <StudioUIToggle label="Enabled" checked={draft.effects[selected].enabled} disabled={busy || disabled} onChange={(next) => updateEffect(selected, 'enabled', next)} />
                {effectFields(selected)}
              </StudioUISection>}
              {layer?.locked ? <p className="ss-ls-ui-error">{words.locked}</p> : null}
              {error ? <p className="ss-ls-ui-error" role="alert">{error}</p> : null}
            </div>
          </div>
          <aside className="ss-ls-ui-preview-column">
            <StudioUIPreview label={words.preview}><canvas ref={previewRef} width={210} height={210} aria-label={words.preview} /></StudioUIPreview>
            <StudioUIToggle label={words.preview} checked={preview} disabled={busy} onChange={setPreview} />
          </aside>
        </div>
      </StudioUIDialog>
    </>
  )
}
