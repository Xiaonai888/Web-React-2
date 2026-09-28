import { useEffect, useRef, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import {
  StudioUIButton,
  StudioUIColor,
  StudioUINumber,
  StudioUIPreview,
  StudioUISection,
  StudioUISlider,
  StudioUITabs,
} from './StudioUIControls'
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
    const context = previewRef.current?.getContext('2d')
    if (!context) return
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    try {
      drawStudioMangaEffect(context, options)
    } catch {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    }
  }, [type, count, thickness, scale, centerX, centerY, color, opacity])

  async function apply() {
    if (unavailable) return
    setError('')
    setBusy(true)
    try {
      await onApply(options)
    } catch (reason) {
      setError(reason?.message || t[14])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="ss-manga-effects-ui">
      <style>{`
        .ss-manga-effects-ui{display:grid;gap:10px;min-width:0}
        .ss-manga-effects-ui .ss-ui-preview-stage{min-height:150px;background:#fff}
        .ss-manga-effects-ui canvas{display:block;width:100%;height:auto;max-height:210px;background:#fff}
        .ss-manga-effects-ui-two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .ss-manga-effects-ui-actions{display:grid;gap:8px}
        .ss-manga-effects-ui-actions>.ss-ui-button{width:100%}
        .ss-manga-effects-ui-status{margin:0;padding:7px 9px;border:1px solid #3b4651;border-radius:6px;background:#202832;color:#9fb0c0;font-size:9px;line-height:1.45}
        .ss-manga-effects-ui-status.error{border-color:#8e4750;background:#4b2b31;color:#ffd5d8}
        @media(max-width:500px){.ss-manga-effects-ui-two{grid-template-columns:1fr}}
      `}</style>

      <StudioUIPreview label={t[0]}>
        <canvas ref={previewRef} width="480" height="240" aria-label={t[0]} />
      </StudioUIPreview>

      <StudioUISection title={t[0]} subtitle={t[TYPES.indexOf(type) + 1]}>
        <StudioUITabs
          value={type}
          ariaLabel={t[0]}
          items={[
            { value: 'speed', label: t[1], icon: 'fa-solid fa-forward-fast' },
            { value: 'impact', label: t[2], icon: 'fa-solid fa-burst' },
            { value: 'sparkles', label: t[3], icon: 'fa-solid fa-sparkles' },
          ]}
          onChange={setType}
        />

        <div className="ss-manga-effects-ui-two">
          <StudioUINumber label={t[4]} value={count} min={8} max={100} step={1} disabled={busy} onChange={setCount} />
          <StudioUINumber label={`${t[5]} (px)`} value={thickness} min={1} max={20} step={1} disabled={busy} onChange={setThickness} />
        </div>

        <StudioUISlider label={t[6]} value={scale} min={10} max={100} suffix="%" disabled={busy} onChange={setScale} />

        <div className="ss-manga-effects-ui-two">
          <StudioUISlider label={t[7]} value={centerX} min={0} max={100} suffix="%" disabled={busy} onChange={setCenterX} />
          <StudioUISlider label={t[8]} value={centerY} min={0} max={100} suffix="%" disabled={busy} onChange={setCenterY} />
        </div>

        <StudioUIColor label={t[9]} value={color} disabled={busy} onChange={(next) => {
          if (/^#[0-9a-f]{6}$/i.test(next)) setColor(next)
        }} />

        <StudioUISlider label={t[10]} value={opacity} min={0} max={100} suffix="%" disabled={busy} onChange={setOpacity} />
      </StudioUISection>

      <div className="ss-manga-effects-ui-actions">
        <StudioUIButton variant="primary" icon="fa-solid fa-check" disabled={unavailable} onClick={apply}>
          {busy ? t[12] : t[11]}
        </StudioUIButton>
        <p className={`ss-manga-effects-ui-status ${error ? 'error' : ''}`} role={error ? 'alert' : 'status'}>
          {error || t[13]}
        </p>
      </div>
    </div>
  )
}
