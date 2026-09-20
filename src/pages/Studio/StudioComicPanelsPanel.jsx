import { useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'

const LABELS = {
  en: ['Comic panels', 'Single', 'Two columns', 'Two rows', 'Three panels', 'Four panels', 'Margin', 'Gutter', 'Border width', 'Ink color', 'White panel fill', 'Opacity', 'Apply to selected layer', 'Applying…', 'Choose a visible, unlocked layer first.', 'Could not add panels.'],
  km: ['ស៊ុមរឿង Manga', 'មួយស៊ុម', 'ពីរជួរឈរ', 'ពីរជួរដេក', 'បីស៊ុម', 'បួនស៊ុម', 'គម្លាតគែម', 'គម្លាតស៊ុម', 'កម្រាស់បន្ទាត់', 'ពណ៌បន្ទាត់', 'ផ្ទៃស៊ុមពណ៌ស', 'ភាពស្រអាប់', 'ដាក់លើស្រទាប់ដែលជ្រើស', 'កំពុងដាក់…', 'សូមជ្រើសស្រទាប់ដែលបង្ហាញ និងមិនចាក់សោជាមុន។', 'មិនអាចដាក់ស៊ុមរឿងបានទេ។'],
  zh: ['漫画分镜', '单格', '两列', '两行', '三格', '四格', '边距', '格间距', '线宽', '线条颜色', '白色格内填充', '不透明度', '应用到所选图层', '应用中…', '请先选择可见且未锁定的图层。', '无法添加分镜。'],
  ja: ['漫画コマ', '1コマ', '縦2コマ', '横2コマ', '3コマ', '4コマ', '余白', 'コマ間隔', '線幅', '線の色', 'コマを白く塗る', '不透明度', '選択レイヤーに追加', '追加中…', '表示中でロックされていないレイヤーを選んでください。', 'コマを追加できません。'],
  ko: ['만화 컷', '한 컷', '세로 두 컷', '가로 두 컷', '세 컷', '네 컷', '바깥 여백', '컷 간격', '선 두께', '선 색상', '컷 안쪽 흰색 채우기', '불투명도', '선택한 레이어에 추가', '추가 중…', '보이는 잠금 해제 레이어를 먼저 선택하세요.', '컷을 추가할 수 없습니다.'],
}

const LAYOUTS = ['single', 'vertical', 'horizontal', 'three', 'four']
const THUMBNAILS = {
  single: [[1, 1, 3, 3]],
  vertical: [[1, 1, 2, 3], [2, 1, 3, 3]],
  horizontal: [[1, 1, 3, 2], [1, 2, 3, 3]],
  three: [[1, 1, 3, 2], [1, 2, 2, 3], [2, 2, 3, 3]],
  four: [[1, 1, 2, 2], [2, 1, 3, 2], [1, 2, 2, 3], [2, 2, 3, 3]],
}

export default function StudioComicPanelsPanel({ onApply, disabled = false }) {
  const { language } = useDisplayTranslation()
  const t = LABELS[language] || LABELS.en
  const [layout, setLayout] = useState('three')
  const [margin, setMargin] = useState(28)
  const [gutter, setGutter] = useState(18)
  const [border, setBorder] = useState(5)
  const [ink, setInk] = useState('#111111')
  const [whiteFill, setWhiteFill] = useState(false)
  const [opacity, setOpacity] = useState(100)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const unavailable = disabled || busy || typeof onApply !== 'function'

  async function apply() {
    if (unavailable) return
    setError('')
    setBusy(true)
    try { await onApply({ layout, margin, gutter, border, ink, fill: whiteFill ? '#FFFFFF' : 'transparent', opacity }) }
    catch (reason) { setError(reason?.message || t[15]) }
    finally { setBusy(false) }
  }

  return (
    <section className="ss-comic-panels" aria-label={t[0]}>
      <style>{`
        .shadow-studio .ss-comic-panels{display:grid;gap:9px;min-width:0;color:#e5edf6;font-size:11px}
        .shadow-studio .ss-comic-panels strong{font-size:12px}
        .shadow-studio .ss-comic-panel-layouts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}
        .shadow-studio .ss-comic-panel-layouts button{display:grid;gap:5px;justify-items:center;min-width:0;padding:6px 2px;border:1px solid #5b6f85;border-radius:5px;background:#283847;color:#e8f1fa;font:inherit;font-size:9px;cursor:pointer}
        .shadow-studio .ss-comic-panel-layouts button[aria-pressed=true]{border-color:#9ecaff;background:#426184}
        .shadow-studio .ss-comic-panel-thumb{display:grid;grid-template-columns:repeat(2,1fr);grid-template-rows:repeat(2,1fr);width:48px;height:56px;gap:3px;padding:4px;border:1px solid #8294a5;background:#eef2f6}
        .shadow-studio .ss-comic-panel-thumb i{display:block;min-width:0;min-height:0;border:2px solid #202833;background:white}
        .shadow-studio .ss-comic-panels label{display:grid;gap:4px;min-width:0}
        .shadow-studio .ss-comic-panel-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
        .shadow-studio .ss-comic-panels input[type=number]{box-sizing:border-box;width:100%;min-width:0;padding:6px;border:1px solid #61778b;border-radius:4px;background:#253340;color:#edf5ff;font:inherit}
        .shadow-studio .ss-comic-panels input[type=color]{width:100%;height:30px;border:1px solid #61778b;border-radius:4px;background:#253340}
        .shadow-studio .ss-comic-panels input[type=range]{width:100%;accent-color:#87baff}
        .shadow-studio .ss-comic-panels .ss-comic-panel-fill{display:flex;align-items:center;gap:7px}
        .shadow-studio .ss-comic-panels .ss-comic-panel-apply{padding:8px;border:1px solid #86a8c7;border-radius:5px;background:#3c6182;color:white;font:inherit;cursor:pointer}
        .shadow-studio .ss-comic-panels button:disabled{opacity:.48;cursor:not-allowed}
        .shadow-studio .ss-comic-panels p{margin:0;color:#bed0e0;font-size:10px;line-height:1.5}
      `}</style>
      <strong>{t[0]}</strong>
      <div className="ss-comic-panel-layouts" role="group" aria-label={t[0]}>
        {LAYOUTS.map((option, index) => <button type="button" key={option} aria-pressed={layout === option} onClick={() => setLayout(option)}>
          <span className="ss-comic-panel-thumb" aria-hidden="true">{THUMBNAILS[option].map(([x1, y1, x2, y2], i) => <i key={i} style={{ gridColumn: `${x1}/${x2}`, gridRow: `${y1}/${y2}` }} />)}</span>
          <span>{t[index + 1]}</span>
        </button>)}
      </div>
      <div className="ss-comic-panel-grid">
        <label>{t[6]} (px)<input type="number" min="4" max="200" value={margin} onChange={(event) => setMargin(Number(event.target.value))} /></label>
        <label>{t[7]} (px)<input type="number" min="4" max="100" value={gutter} onChange={(event) => setGutter(Number(event.target.value))} /></label>
        <label>{t[8]} (px)<input type="number" min="1" max="30" value={border} onChange={(event) => setBorder(Number(event.target.value))} /></label>
        <label>{t[9]}<input type="color" value={ink} onChange={(event) => setInk(event.target.value)} /></label>
      </div>
      <label className="ss-comic-panel-fill"><input type="checkbox" checked={whiteFill} onChange={(event) => setWhiteFill(event.target.checked)} />{t[10]}</label>
      <label>{t[11]}: {opacity}%<input type="range" min="0" max="100" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} /></label>
      <button className="ss-comic-panel-apply" type="button" disabled={unavailable} onClick={apply}>{busy ? t[13] : t[12]}</button>
      {disabled || !onApply ? <p>{t[14]}</p> : null}
      {error ? <p role="alert">{error}</p> : null}
    </section>
  )
}
