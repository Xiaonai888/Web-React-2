import { useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'

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
  const preview = type === 'crosshatch' ? `${gradient}, repeating-linear-gradient(90deg, transparent 0px, transparent ${spacing / 2 - thickness / 2}px, ${color} ${spacing / 2 - thickness / 2}px, ${color} ${spacing / 2 + thickness / 2}px, transparent ${spacing / 2 + thickness / 2}px, transparent ${spacing}px)` : gradient

  async function apply() {
    if (unavailable) return
    setError('')
    setBusy(true)
    try { await onApply({ type, spacing, density, angle, opacity, color }) }
    catch (reason) { setError(reason?.message || labels[12]) }
    finally { setBusy(false) }
  }

  return (
    <section className="ss-screentone-panel" aria-label={labels[0]}>
      <style>{`
        .shadow-studio .ss-screentone-panel{display:grid;gap:9px;min-width:0;color:#e5edf6;font-size:11px}
        .shadow-studio .ss-screentone-panel strong{font-size:12px}
        .shadow-studio .ss-screentone-preview{height:58px;border:1px solid #71869c;border-radius:5px;background-color:white}
        .shadow-studio .ss-screentone-types{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}
        .shadow-studio .ss-screentone-types button,.shadow-studio .ss-screentone-apply{padding:7px 3px;border:1px solid #61788d;border-radius:4px;background:#33485d;color:#e8f1fb;font:inherit;cursor:pointer}
        .shadow-studio .ss-screentone-types button[aria-pressed=true]{background:#456c92;border-color:#a1cafa}
        .shadow-studio .ss-screentone-panel label{display:grid;gap:4px;min-width:0}
        .shadow-studio .ss-screentone-panel label span{display:flex;justify-content:space-between;gap:5px}
        .shadow-studio .ss-screentone-panel input[type=range]{width:100%;min-width:0;accent-color:#83baff}
        .shadow-studio .ss-screentone-panel input[type=color]{width:100%;height:29px;border:1px solid #61788d;border-radius:4px;background:#293645}
        .shadow-studio .ss-screentone-panel .ss-screentone-apply{background:#426b91;font-weight:700}
        .shadow-studio .ss-screentone-panel button:disabled{opacity:.48;cursor:not-allowed}
        .shadow-studio .ss-screentone-panel .ss-screentone-error{color:#ffb9b9;line-height:1.5}
      `}</style>
      <strong>{labels[0]}</strong>
      <div className="ss-screentone-preview" aria-hidden="true" style={{ backgroundImage: preview, backgroundSize: `${spacing}px ${spacing}px`, opacity: opacity / 100, transform: `rotate(${angle}deg)`, maxWidth: '100%' }} />
      <div className="ss-screentone-types" role="group" aria-label={labels[0]}>
        {TYPES.map((option, index) => <button key={option} type="button" aria-pressed={type === option} onClick={() => setType(option)}>{labels[index + 1]}</button>)}
      </div>
      <label><span>{labels[4]} <b>{spacing}px</b></span><input type="range" min="8" max="96" step="1" value={spacing} onChange={(event) => setSpacing(Number(event.target.value))} /></label>
      <label><span>{labels[5]} <b>{density}%</b></span><input type="range" min="5" max="95" step="1" value={density} onChange={(event) => setDensity(Number(event.target.value))} /></label>
      <label><span>{labels[6]} <b>{angle}°</b></span><input type="range" min="-180" max="180" step="1" value={angle} onChange={(event) => setAngle(Number(event.target.value))} /></label>
      <label><span>{labels[7]} <b>{opacity}%</b></span><input type="range" min="0" max="100" step="1" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} /></label>
      <label>{labels[8]}<input type="color" value={color} onChange={(event) => setColor(event.target.value)} /></label>
      <button className="ss-screentone-apply" type="button" onClick={apply} disabled={unavailable}>{busy ? labels[10] : labels[9]}</button>
      {unavailable && !busy ? <small>{labels[11]}</small> : null}
      {error ? <p className="ss-screentone-error" role="alert">{error}</p> : null}
    </section>
  )
}
