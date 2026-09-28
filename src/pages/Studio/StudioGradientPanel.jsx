import { useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import {
  StudioUIButton,
  StudioUIColor,
  StudioUIPreview,
  StudioUISection,
  StudioUISlider,
  StudioUITabs,
  StudioUIToggle,
} from './StudioUIControls'
import StudioUIAngleDial from './StudioUIAngleDial'

const LABELS = {
  en: ['Gradient', 'Start color', 'End color', 'Linear', 'Radial', 'Angle', 'Opacity', 'Reverse colors', 'Apply to selected layer', 'Applying…', 'Create or select a visible, unlocked layer first.', 'Could not apply gradient.'],
  km: ['ពណ៌ជម្រាល', 'ពណ៌ដើម', 'ពណ៌ចុង', 'ត្រង់', 'មូល', 'មុំ', 'ភាពស្រអាប់', 'ប្ដូរពណ៌ដើមនិងចុង', 'ដាក់លើស្រទាប់ដែលជ្រើស', 'កំពុងដាក់…', 'សូមបង្កើត ឬជ្រើសស្រទាប់ដែលមិនលាក់ និងមិនចាក់សោជាមុន។', 'មិនអាចដាក់ពណ៌ជម្រាលបានទេ។'],
  zh: ['渐变', '起始颜色', '结束颜色', '线性', '径向', '角度', '不透明度', '反转颜色', '应用到选中图层', '正在应用…', '请先选择可见且未锁定的图层。', '无法应用渐变。'],
  ja: ['グラデーション', '開始色', '終了色', '線形', '円形', '角度', '不透明度', '色を反転', '選択レイヤーに適用', '適用中…', '表示中でロックされていないレイヤーを選択してください。', 'グラデーションを適用できません。'],
  ko: ['그라디언트', '시작 색상', '끝 색상', '선형', '방사형', '각도', '불투명도', '색 반전', '선택 레이어에 적용', '적용 중…', '보이고 잠금 해제된 레이어를 먼저 선택하세요.', '그라디언트를 적용할 수 없습니다.'],
}

export default function StudioGradientPanel({ color = '#111111', onApply, disabled = false }) {
  const { language } = useDisplayTranslation()
  const labels = LABELS[language] || LABELS.en
  const [from, setFrom] = useState(/^#[0-9a-f]{6}$/i.test(color) ? color : '#111111')
  const [to, setTo] = useState('#FFFFFF')
  const [type, setType] = useState('linear')
  const [angle, setAngle] = useState(0)
  const [opacity, setOpacity] = useState(100)
  const [reverse, setReverse] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const unavailable = disabled || busy || typeof onApply !== 'function'
  const start = reverse ? to : from
  const end = reverse ? from : to
  const preview = type === 'radial'
    ? `radial-gradient(circle at center, ${start}, ${end})`
    : `linear-gradient(${90 + angle}deg, ${start}, ${end})`

  async function apply() {
    if (unavailable) return
    setError('')
    setBusy(true)
    try {
      await onApply({ from, to, type, angle, opacity, reverse })
    } catch (reason) {
      setError(reason?.message || labels[11])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="ss-gradient-ui-panel">
      <style>{`
        .ss-gradient-ui-panel{display:grid;gap:10px;min-width:0}
        .ss-gradient-ui-preview .ss-ui-preview-stage{min-height:86px}
        .ss-gradient-ui-preview-swatch{width:100%;height:86px}
        .ss-gradient-ui-angle{padding:9px;border:1px solid #3b4651;border-radius:8px;background:#242c34}
        .ss-gradient-ui-actions{display:grid;gap:8px}
        .ss-gradient-ui-actions>.ss-ui-button{width:100%}
        .ss-gradient-ui-status{margin:0;padding:7px 9px;border:1px solid #3b4651;border-radius:6px;background:#202832;color:#9fb0c0;font-size:9px;line-height:1.45}
        .ss-gradient-ui-status.error{border-color:#8e4750;background:#4b2b31;color:#ffd5d8}
      `}</style>

      <StudioUIPreview label={labels[0]} className="ss-gradient-ui-preview">
        <div className="ss-gradient-ui-preview-swatch" style={{ background: preview, opacity: opacity / 100 }} aria-hidden="true" />
      </StudioUIPreview>

      <StudioUISection title={labels[0]} subtitle={type === 'linear' ? labels[3] : labels[4]}>
        <StudioUITabs
          value={type}
          ariaLabel={labels[0]}
          items={[
            { value: 'linear', label: labels[3], icon: 'fa-solid fa-arrow-right-long' },
            { value: 'radial', label: labels[4], icon: 'fa-regular fa-circle' },
          ]}
          onChange={setType}
        />

        <StudioUIColor label={labels[1]} value={from} disabled={busy} onChange={(next) => {
          if (/^#[0-9a-f]{6}$/i.test(next)) setFrom(next)
        }} />

        <StudioUIColor label={labels[2]} value={to} disabled={busy} onChange={(next) => {
          if (/^#[0-9a-f]{6}$/i.test(next)) setTo(next)
        }} />

        {type === 'linear' ? (
          <div className="ss-gradient-ui-angle">
            <StudioUIAngleDial label={labels[5]} value={angle} min={-180} max={180} disabled={busy} onChange={setAngle} size={78} />
          </div>
        ) : null}

        <StudioUISlider label={labels[6]} value={opacity} min={0} max={100} suffix="%" disabled={busy} onChange={setOpacity} />
        <StudioUIToggle label={labels[7]} checked={reverse} disabled={busy} onChange={setReverse} />
      </StudioUISection>

      <div className="ss-gradient-ui-actions">
        <StudioUIButton variant="primary" icon="fa-solid fa-check" disabled={unavailable} onClick={apply}>
          {busy ? labels[9] : labels[8]}
        </StudioUIButton>
        <p className={`ss-gradient-ui-status ${error ? 'error' : ''}`} role={error ? 'alert' : 'status'}>{error || labels[10]}</p>
      </div>
    </div>
  )
}
