import { useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'

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
    try { await onApply({ from, to, type, angle, opacity, reverse }) }
    catch (reason) { setError(reason?.message || labels[11]) }
    finally { setBusy(false) }
  }

  return (
    <section className="ss-gradient-panel" aria-label={labels[0]}>
      <style>{`
        .shadow-studio .ss-gradient-panel{min-width:0;color:#e3eaf2;font-size:11px}
        .shadow-studio .ss-gradient-panel>*+*{margin-top:9px}
        .shadow-studio .ss-gradient-panel strong{display:block;font-size:12px}
        .shadow-studio .ss-gradient-preview{height:54px;border:1px solid #71859a;border-radius:5px}
        .shadow-studio .ss-gradient-colors{display:grid;grid-template-columns:1fr 1fr;gap:7px}
        .shadow-studio .ss-gradient-panel label{display:grid;gap:4px;min-width:0;color:#d0dbe5}
        .shadow-studio .ss-gradient-panel input[type=color]{width:100%;height:30px;border:1px solid #61758a;border-radius:4px;background:#283645;cursor:pointer}
        .shadow-studio .ss-gradient-panel input[type=range]{width:100%;min-width:0;accent-color:#83baff}
        .shadow-studio .ss-gradient-panel .ss-gradient-types{display:flex;gap:5px}
        .shadow-studio .ss-gradient-types button,.shadow-studio .ss-gradient-apply{border:1px solid #60778d;border-radius:5px;background:#33485e;color:#e9f2fb;padding:7px;cursor:pointer}
        .shadow-studio .ss-gradient-types button[aria-pressed=true]{background:#476c91;border-color:#9bc8f5}
        .shadow-studio .ss-gradient-panel .ss-gradient-check{display:flex;align-items:center;gap:6px}
        .shadow-studio .ss-gradient-panel .ss-gradient-apply{width:100%;background:#426b91;font-weight:700}
        .shadow-studio .ss-gradient-panel button:disabled{opacity:.48;cursor:not-allowed}
        .shadow-studio .ss-gradient-panel .ss-gradient-error{color:#ffb7b7;line-height:1.4}
        .shadow-studio .ss-gradient-panel .ss-gradient-hint{font-size:10px;color:#b6c6d5;line-height:1.5}
      `}</style>
      <strong>{labels[0]}</strong>
      <div className="ss-gradient-preview" style={{ background: preview, opacity: opacity / 100 }} aria-hidden="true" />
      <div className="ss-gradient-colors">
        <label>{labels[1]}<input type="color" value={from} onChange={(event) => setFrom(event.target.value)} /></label>
        <label>{labels[2]}<input type="color" value={to} onChange={(event) => setTo(event.target.value)} /></label>
      </div>
      <div className="ss-gradient-types" role="group" aria-label={labels[0]}>
        <button type="button" aria-pressed={type === 'linear'} onClick={() => setType('linear')}>{labels[3]}</button>
        <button type="button" aria-pressed={type === 'radial'} onClick={() => setType('radial')}>{labels[4]}</button>
      </div>
      <label>{labels[5]}: {angle}°<input type="range" min="0" max="359" step="1" value={angle} disabled={type === 'radial'} onChange={(event) => setAngle(Number(event.target.value))} /></label>
      <label>{labels[6]}: {opacity}%<input type="range" min="0" max="100" step="1" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} /></label>
      <label className="ss-gradient-check"><input type="checkbox" checked={reverse} onChange={(event) => setReverse(event.target.checked)} />{labels[7]}</label>
      <button type="button" className="ss-gradient-apply" disabled={unavailable} onClick={apply}>{busy ? labels[9] : labels[8]}</button>
      <p className={error ? 'ss-gradient-error' : 'ss-gradient-hint'} role="status">{error || labels[10]}</p>
    </section>
  )
}
