import { useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import {
  StudioUIButton,
  StudioUIColor,
  StudioUINumber,
  StudioUISection,
  StudioUISlider,
  StudioUIToggle,
} from './StudioUIControls'

const LABELS = {
  en: ['Comic panels', 'Single', 'Two columns', 'Two rows', 'Three panels', 'Four panels', 'Margin', 'Gutter', 'Border width', 'Ink color', 'White panel fill', 'Opacity', 'Apply to selected layer', 'Applying…', 'Choose a visible, unlocked layer first.', 'Could not add panels.'],
  km: ['ស៊ុមរឿង Manga', 'មួយស៊ុម', 'ពីរជួរឈរ', 'ពីរជួរដេក', 'បីស៊ុម', 'បួនស៊ុម', 'គម្លាតគែម', 'គម្លាតស៊ុម', 'កម្រាស់បន្ទាត់', 'ពណ៌បន្ទាត់', 'ផ្ទៃស៊ុមពណ៌ស', 'ភាពស្រអាប់', 'ដាក់លើស្រទាប់ដែលជ្រើស', 'កំពុងដាក់…', 'សូមជ្រើសស្រទាប់ដែលបង្ហាញ និងមិនចាក់សោជាមុន។', 'មិនអាចដាក់ស៊ុមរឿងបានទេ។'],
  zh: ['漫画分镜', '单格', '两列', '两行', '三格', '四格', '边距', '格间距', '线宽', '线条颜色', '白色格内填充', '不透明度', '应用到所选图层', '应用中…', '请先选择可见且未锁定的图层。', '无法添加分镜。'],
  ja: ['漫画コマ', '1コマ', '縦2コマ', '横2コマ', '3コマ', '4コマ', '余白', 'コマ間隔', '線幅', '線の色', 'コマを白く塗る', '不透明度', '選択レイヤーに追加', '追加中…', '表示中でロックされていないレイヤーを選択してください。', 'コマを追加できません。'],
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
    try {
      await onApply({ layout, margin, gutter, border, ink, fill: whiteFill ? '#FFFFFF' : 'transparent', opacity })
    } catch (reason) {
      setError(reason?.message || t[15])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="ss-comic-panels-ui">
      <style>{`
        .ss-comic-panels-ui{display:grid;gap:10px;min-width:0}
        .ss-comic-layouts-ui{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px}
        .ss-comic-layout-ui{min-width:0;display:grid;gap:5px;justify-items:center;padding:7px 3px;border:1px solid #4b5968;border-radius:7px;background:#202832;color:#cbd8e5;font:650 9px Inter,system-ui,sans-serif;cursor:pointer}
        .ss-comic-layout-ui:hover:not(:disabled){border-color:#71889e;background:#303c48}
        .ss-comic-layout-ui[aria-pressed=true]{border-color:#75baff;background:#355d84;color:#fff;box-shadow:inset 0 0 0 1px #6ba9df}
        .ss-comic-layout-thumb-ui{display:grid;grid-template-columns:repeat(2,1fr);grid-template-rows:repeat(2,1fr);width:46px;height:56px;gap:3px;padding:4px;border:1px solid #788796;border-radius:3px;background:#e7edf3}
        .ss-comic-layout-thumb-ui i{display:block;min-width:0;min-height:0;border:2px solid #1d252d;background:#fff}
        .ss-comic-panels-ui-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .ss-comic-panels-ui-actions{display:grid;gap:8px}
        .ss-comic-panels-ui-actions>.ss-ui-button{width:100%}
        .ss-comic-panels-ui-status{margin:0;padding:7px 9px;border:1px solid #3b4651;border-radius:6px;background:#202832;color:#9fb0c0;font-size:9px;line-height:1.45}
        .ss-comic-panels-ui-status.error{border-color:#8e4750;background:#4b2b31;color:#ffd5d8}
        @media(max-width:620px){.ss-comic-layouts-ui{grid-template-columns:repeat(3,minmax(0,1fr))}}
        @media(max-width:430px){.ss-comic-panels-ui-grid{grid-template-columns:1fr}.ss-comic-layouts-ui{grid-template-columns:repeat(2,minmax(0,1fr))}}
      `}</style>

      <StudioUISection title={t[0]} subtitle={t[LAYOUTS.indexOf(layout) + 1]}>
        <div className="ss-comic-layouts-ui" role="group" aria-label={t[0]}>
          {LAYOUTS.map((option, index) => (
            <button type="button" className="ss-comic-layout-ui" key={option} aria-pressed={layout === option} disabled={busy} onClick={() => setLayout(option)}>
              <span className="ss-comic-layout-thumb-ui" aria-hidden="true">
                {THUMBNAILS[option].map(([x1, y1, x2, y2], itemIndex) => (
                  <i key={itemIndex} style={{ gridColumn: `${x1}/${x2}`, gridRow: `${y1}/${y2}` }} />
                ))}
              </span>
              <span>{t[index + 1]}</span>
            </button>
          ))}
        </div>

        <div className="ss-comic-panels-ui-grid">
          <StudioUINumber label={`${t[6]} (px)`} value={margin} min={4} max={200} disabled={busy} onChange={setMargin} />
          <StudioUINumber label={`${t[7]} (px)`} value={gutter} min={4} max={100} disabled={busy} onChange={setGutter} />
          <StudioUINumber label={`${t[8]} (px)`} value={border} min={1} max={30} disabled={busy} onChange={setBorder} />
          <StudioUIColor label={t[9]} value={ink} disabled={busy} onChange={(next) => {
            if (/^#[0-9a-f]{6}$/i.test(next)) setInk(next)
          }} />
        </div>

        <StudioUIToggle label={t[10]} checked={whiteFill} disabled={busy} onChange={setWhiteFill} />
        <StudioUISlider label={t[11]} value={opacity} min={0} max={100} suffix="%" disabled={busy} onChange={setOpacity} />
      </StudioUISection>

      <div className="ss-comic-panels-ui-actions">
        <StudioUIButton variant="primary" icon="fa-solid fa-table-cells-large" disabled={unavailable} onClick={apply}>
          {busy ? t[13] : t[12]}
        </StudioUIButton>
        <p className={`ss-comic-panels-ui-status ${error ? 'error' : ''}`} role={error ? 'alert' : 'status'}>{error || t[14]}</p>
      </div>
    </div>
  )
}
