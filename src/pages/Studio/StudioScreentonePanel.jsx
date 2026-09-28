import { useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import {
  StudioUIButton,
  StudioUIColor,
  StudioUIPreview,
  StudioUISection,
  StudioUISlider,
  StudioUITabs,
} from './StudioUIControls'
import StudioUIAngleDial from './StudioUIAngleDial'

const LABELS = {
  en: ['Screentone', 'Dots', 'Lines', 'Crosshatch', 'Spacing', 'Ink coverage', 'Angle', 'Opacity', 'Ink color', 'Apply to selected layer', 'Applying…', 'Select a visible, unlocked layer first.', 'Could not apply the screentone.'],
  km: ['ស្គ្រីនតូន', 'ចំណុច', 'បន្ទាត់', 'បន្ទាត់ខ្វែង', 'ចន្លោះ', 'កម្រាស់ទឹកខ្មៅ', 'មុំ', 'ភាពស្រអាប់', 'ពណ៌ទឹកខ្មៅ', 'ដាក់លើស្រទាប់ដែលជ្រើស', 'កំពុងដាក់…', 'សូមជ្រើសស្រទាប់ដែលបង្ហាញ និងមិនចាក់សោជាមុន។', 'មិនអាចដាក់ស្គ្រីនតូនបានទេ។'],
  zh: ['网点', '圆点', '线条', '交叉线', '间距', '墨色覆盖', '角度', '不透明度', '墨色', '应用到选中图层', '应用中…', '请先选择可见且未锁定的图层。', '无法应用网点。'],
  ja: ['スクリーントーン', 'ドット', '線', 'クロスハッチ', '間隔', 'インクの濃さ', '角度', '不透明度', 'インク色', '選択レイヤーに適用', '適用中…', '表示中でロックされていないレイヤーを選択してください。', 'トーンを適用できません。'],
  ko: ['스크린톤', '도트', '선', '교차선', '간격', '잉크 농도', '각도', '불투명도', '잉크 색상', '선택한 레이어에 적용', '적용 중…', '보이고 잠금 해제된 레이어를 먼저 선택하세요.', '스크린톤을 적용할 수 없습니다.'],
}

const TYPES = ['dots', 'lines', 'crosshatch']

export default function StudioScreentonePanel({ onApply, disabled = false }) {
  const { language } = useDisplayTranslation()
  const labels = LABELS[language] || LABELS.en
  const [type, setType] = useState('dots')
  const [spacing, setSpacing] = useState(18)
  const [density, setDensity] = useState(35)
  const [angle, setAngle] = useState(0)
  const [opacity, setOpacity] = useState(100)
  const [color, setColor] = useState('#111111')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const unavailable = disabled || busy || typeof onApply !== 'function'
  const thickness = Math.max(1, spacing * density / 180)
  const gradient = type === 'dots'
    ? `radial-gradient(circle, ${color} ${spacing * density / 210}px, transparent ${spacing * density / 210 + 0.5}px)`
    : `repeating-linear-gradient(0deg, transparent 0px, transparent ${spacing / 2 - thickness / 2}px, ${color} ${spacing / 2 - thickness / 2}px, ${color} ${spacing / 2 + thickness / 2}px, transparent ${spacing / 2 + thickness / 2}px, transparent ${spacing}px)`
  const preview = type === 'crosshatch'
    ? `${gradient}, repeating-linear-gradient(90deg, transparent 0px, transparent ${spacing / 2 - thickness / 2}px, ${color} ${spacing / 2 - thickness / 2}px, ${color} ${spacing / 2 + thickness / 2}px, transparent ${spacing / 2 + thickness / 2}px, transparent ${spacing}px)`
    : gradient

  async function apply() {
    if (unavailable) return
    setError('')
    setBusy(true)
    try {
      await onApply({ type, spacing, density, angle, opacity, color })
    } catch (reason) {
      setError(reason?.message || labels[12])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="ss-screentone-ui">
      <style>{`
        .ss-screentone-ui{display:grid;gap:10px;min-width:0}
        .ss-screentone-ui .ss-ui-preview-stage{min-height:112px;background:#fff}
        .ss-screentone-ui-preview{width:100%;height:112px;background-color:#fff;transform-origin:center}
        .ss-screentone-ui-angle{padding:9px;border:1px solid #3b4651;border-radius:8px;background:#242c34}
        .ss-screentone-ui-actions{display:grid;gap:8px}
        .ss-screentone-ui-actions>.ss-ui-button{width:100%}
        .ss-screentone-ui-status{margin:0;padding:7px 9px;border:1px solid #3b4651;border-radius:6px;background:#202832;color:#9fb0c0;font-size:9px;line-height:1.45}
        .ss-screentone-ui-status.error{border-color:#8e4750;background:#4b2b31;color:#ffd5d8}
      `}</style>

      <StudioUIPreview label={labels[0]}>
        <div
          className="ss-screentone-ui-preview"
          aria-hidden="true"
          style={{
            backgroundImage: preview,
            backgroundSize: `${spacing}px ${spacing}px`,
            opacity: opacity / 100,
            transform: `rotate(${angle}deg) scale(1.15)`,
          }}
        />
      </StudioUIPreview>

      <StudioUISection title={labels[0]} subtitle={labels[TYPES.indexOf(type) + 1]}>
        <StudioUITabs
          value={type}
          ariaLabel={labels[0]}
          items={[
            { value: 'dots', label: labels[1], icon: 'fa-solid fa-braille' },
            { value: 'lines', label: labels[2], icon: 'fa-solid fa-grip-lines' },
            { value: 'crosshatch', label: labels[3], icon: 'fa-solid fa-border-all' },
          ]}
          onChange={setType}
        />

        <StudioUISlider label={labels[4]} value={spacing} min={8} max={96} suffix="px" disabled={busy} onChange={setSpacing} />
        <StudioUISlider label={labels[5]} value={density} min={5} max={95} suffix="%" disabled={busy} onChange={setDensity} />

        <div className="ss-screentone-ui-angle">
          <StudioUIAngleDial label={labels[6]} value={angle} min={-180} max={180} disabled={busy} onChange={setAngle} size={78} />
        </div>

        <StudioUISlider label={labels[7]} value={opacity} min={0} max={100} suffix="%" disabled={busy} onChange={setOpacity} />
        <StudioUIColor label={labels[8]} value={color} disabled={busy} onChange={(next) => {
          if (/^#[0-9a-f]{6}$/i.test(next)) setColor(next)
        }} />
      </StudioUISection>

      <div className="ss-screentone-ui-actions">
        <StudioUIButton variant="primary" icon="fa-solid fa-check" disabled={unavailable} onClick={apply}>
          {busy ? labels[10] : labels[9]}
        </StudioUIButton>
        <p className={`ss-screentone-ui-status ${error ? 'error' : ''}`} role={error ? 'alert' : 'status'}>
          {error || labels[11]}
        </p>
      </div>
    </div>
  )
}
