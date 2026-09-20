import { useEffect, useRef, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { drawStudioMangaEffect } from './StudioMangaEffectsEngine'

const TEXT = {
  en: ['Manga effects', 'Speed lines', 'Impact burst', 'Sparkles', 'Line / star count', 'Thickness', 'Scale', 'Horizontal center', 'Vertical center', 'Color', 'Opacity', 'Apply to selected layer', 'Applying…', 'Select a visible, unlocked layer first.', 'Could not apply this effect.'],
  km: ['បែបផែន Manga', 'បន្ទាត់ល្បឿន', 'បន្ទាត់ផ្ទុះ', 'ផ្កាយភ្លឺ', 'ចំនួនបន្ទាត់ / ផ្កាយ', 'កម្រាស់', 'ទំហំ', 'ចំណុចកណ្ដាលផ្ដេក', 'ចំណុចកណ្ដាលបញ្ឈរ', 'ពណ៌', 'ភាពស្រអាប់', 'ដាក់លើស្រទាប់ដែលជ្រើស', 'កំពុងដាក់…', 'សូមជ្រើសស្រទាប់ដែលបង្ហាញ និងមិនចាក់សោជាមុន។', 'មិនអាចដាក់បែបផែននេះបានទេ។'],
  zh: ['漫画效果', '速度线', '冲击线', '闪光', '线条 / 星星数量', '粗细', '大小', '水平中心', '垂直中心', '颜色', '不透明度', '应用到选中图层', '应用中…', '请先选择可见且未锁定的图层。', '无法应用此效果。'],
  ja: ['漫画エフェクト', '集中線', '衝撃線', 'きらめき', '線 / 星の数', '太さ', 'サイズ', '中心 X', '中心 Y', '色', '不透明度', '選択レイヤーに適用', '適用中…', '表示中でロックされていないレイヤーを選んでください。', 'エフェクトを適用できません。'],
  ko: ['만화 효과', '속도선', '충격선', '반짝임', '선 / 별 개수', '두께', '크기', '가로 중심', '세로 중심', '색상', '불투명도', '선택한 레이어에 적용', '적용 중…', '표시된 잠금 해제 레이어를 먼저 선택하세요.', '효과를 적용할 수 없습니다.'],
}

const TYPES = ['speed', 'impact', 'sparkles']

export default function StudioMangaEffectsPanel({ onApply, disabled = false }) {
  const { language } = useDisplayTranslation()
  const t = TEXT[language] || TEXT.en
  const previewRef = useRef(null)
  const [type, setType] = useState('speed')
  const [count, setCount] = useState(28)
  const [thickness, setThickness] = useState(3)
  const [scale, setScale] = useState(65)
  const [centerX, setCenterX] = useState(50)
  const [centerY, setCenterY] = useState(50)
  const [color, setColor] = useState('#111111')
  const [opacity, setOpacity] = useState(100)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const options = { type, count, thickness, scale, centerX, centerY, color, opacity }
  const unavailable = disabled || busy || typeof onApply !== 'function'

  useEffect(() => {
    const ctx = previewRef.current?.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    try { drawStudioMangaEffect(ctx, { type, count, thickness, scale, centerX, centerY, color, opacity }) }
    catch { ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height) }
  }, [type, count, thickness, scale, centerX, centerY, color, opacity])

  async function apply() {
    if (unavailable) return
    setError('')
    setBusy(true)
    try { await onApply(options) }
    catch (reason) { setError(reason?.message || t[14]) }
    finally { setBusy(false) }
  }

  return (
    <section className="ss-manga-effects" aria-label={t[0]}>
      <style>{`
        .shadow-studio .ss-manga-effects{display:grid;gap:9px;min-width:0;color:#e5edf6;font-size:11px}
        .shadow-studio .ss-manga-effects strong{font-size:12px}
        .shadow-studio .ss-manga-effects label{display:grid;gap:4px;min-width:0}
        .shadow-studio .ss-manga-effects select,.shadow-studio .ss-manga-effects input[type=number]{box-sizing:border-box;width:100%;min-width:0;padding:6px;border:1px solid #60758a;border-radius:4px;background:#24313e;color:#edf5ff;font:inherit}
        .shadow-studio .ss-manga-effects input[type=range]{width:100%;accent-color:#82baff}
        .shadow-studio .ss-manga-effects input[type=color]{box-sizing:border-box;width:100%;height:30px;border:1px solid #60758a;border-radius:4px;background:#24313e}
        .shadow-studio .ss-manga-effects .ss-effect-preview{box-sizing:border-box;display:block;width:100%;height:auto;aspect-ratio:2/1;border:1px solid #71869c;border-radius:5px;background:white}
        .shadow-studio .ss-manga-effects .ss-effect-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
        .shadow-studio .ss-manga-effects button{padding:8px;border:1px solid #7795b0;border-radius:5px;background:#385d7e;color:#f2f8ff;font:inherit;cursor:pointer}
        .shadow-studio .ss-manga-effects button:disabled{opacity:.5;cursor:not-allowed}
        .shadow-studio .ss-manga-effects p{margin:0;font-size:10px;line-height:1.5}
      `}</style>
      <strong>{t[0]}</strong>
      <canvas ref={previewRef} className="ss-effect-preview" width={240} height={120} aria-label={t[0]} />
      <label>{t[0]}<select value={type} onChange={(event) => setType(event.target.value)}>{TYPES.map((item, index) => <option key={item} value={item}>{t[index + 1]}</option>)}</select></label>
      <div className="ss-effect-grid">
        <label>{t[4]}<input type="number" min="8" max="100" step="1" value={count} onChange={(event) => setCount(Number(event.target.value))} /></label>
        <label>{t[5]} (px)<input type="number" min="1" max="20" step="1" value={thickness} onChange={(event) => setThickness(Number(event.target.value))} /></label>
      </div>
      <label>{t[6]}: {scale}%<input type="range" min="10" max="100" value={scale} onChange={(event) => setScale(Number(event.target.value))} /></label>
      <div className="ss-effect-grid">
        <label>{t[7]}: {centerX}%<input type="range" min="0" max="100" value={centerX} onChange={(event) => setCenterX(Number(event.target.value))} /></label>
        <label>{t[8]}: {centerY}%<input type="range" min="0" max="100" value={centerY} onChange={(event) => setCenterY(Number(event.target.value))} /></label>
      </div>
      <div className="ss-effect-grid">
        <label>{t[9]}<input type="color" value={color} onChange={(event) => setColor(event.target.value)} /></label>
        <label>{t[10]}: {opacity}%<input type="range" min="0" max="100" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} /></label>
      </div>
      <button type="button" disabled={unavailable} onClick={apply}>{busy ? t[12] : t[11]}</button>
      {disabled || !onApply ? <p>{t[13]}</p> : null}
      {error ? <p role="alert">{error}</p> : null}
    </section>
  )
}
