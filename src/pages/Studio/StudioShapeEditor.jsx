import { useEffect, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import {
  StudioUIButton,
  StudioUIButtonRow,
  StudioUIDialog,
  StudioUINumber,
  StudioUIPreview,
  StudioUISection,
  StudioUITabs,
  StudioUIToggle,
} from './StudioUIControls'

const LANGUAGE = {
  en: ['Add shape', 'Shape', 'Rectangle', 'Ellipse', 'Line', 'Width (px)', 'Height (px)', 'Stroke (px)', 'Fill shape', 'Preview', 'Cancel', 'Add to paper'],
  km: ['បន្ថែមរូបរាង', 'រូបរាង', 'ចតុកោណ', 'រាងពងក្រពើ', 'បន្ទាត់', 'ទទឹង (px)', 'កម្ពស់ (px)', 'កម្រាស់បន្ទាត់ (px)', 'បំពេញពណ៌', 'មើលជាមុន', 'បោះបង់', 'ដាក់លើក្រដាស'],
  zh: ['添加形状', '形状', '矩形', '椭圆', '直线', '宽度 (px)', '高度 (px)', '线宽 (px)', '填充形状', '预览', '取消', '添加到画布'],
  ja: ['図形を追加', '図形', '長方形', '楕円', '直線', '幅 (px)', '高さ (px)', '線幅 (px)', '塗りつぶす', 'プレビュー', 'キャンセル', 'キャンバスに追加'],
  ko: ['도형 추가', '도형', '사각형', '타원', '직선', '너비 (px)', '높이 (px)', '선 두께 (px)', '도형 채우기', '미리보기', '취소', '캔버스에 추가'],
}

export function drawStudioShape(ctx, anchor, settings) {
  if (!ctx || !anchor || !settings || !['rectangle', 'ellipse', 'line'].includes(settings.shape)) return false
  const canvasWidth = ctx.canvas.width
  const canvasHeight = ctx.canvas.height
  if (canvasWidth < 1 || canvasHeight < 1) return false
  const x = Math.max(0, Math.min(canvasWidth - 1, Math.round(anchor.x)))
  const y = Math.max(0, Math.min(canvasHeight - 1, Math.round(anchor.y)))
  const width = Math.max(1, Math.min(canvasWidth - x, Math.round(Number(settings.width) || 1)))
  const height = Math.max(1, Math.min(canvasHeight - y, Math.round(Number(settings.height) || 1)))
  const thickness = Math.max(1, Math.min(200, Math.round(Number(settings.thickness) || 1)))
  ctx.save()
  try {
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1
    ctx.strokeStyle = settings.color || '#111111'
    ctx.fillStyle = ctx.strokeStyle
    ctx.lineWidth = thickness
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    if (settings.shape === 'rectangle') ctx.rect(x, y, width, height)
    if (settings.shape === 'ellipse') ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2)
    if (settings.shape === 'line') {
      ctx.moveTo(x, y)
      ctx.lineTo(x + width, y + height)
    }
    if (settings.fill && settings.shape !== 'line') ctx.fill()
    ctx.stroke()
    return true
  } finally {
    ctx.restore()
  }
}

export default function StudioShapeEditor({ open, color, onCancel, onApply }) {
  const { language } = useDisplayTranslation()
  const t = LANGUAGE[language] || LANGUAGE.en
  const [shape, setShape] = useState('rectangle')
  const [width, setWidth] = useState(200)
  const [height, setHeight] = useState(140)
  const [thickness, setThickness] = useState(4)
  const [fill, setFill] = useState(false)

  useEffect(() => {
    if (!open) return undefined
    const keydown = (event) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      event.stopPropagation()
      onCancel?.()
    }
    window.addEventListener('keydown', keydown, true)
    return () => window.removeEventListener('keydown', keydown, true)
  }, [open, onCancel])

  if (!open) return null

  function commit() {
    onApply({ shape, width, height, thickness, fill, color })
  }

  return (
    <>
      <style>{`
        .ss-shape-ui-layout{display:grid;grid-template-columns:minmax(0,1fr) 230px;gap:12px}
        .ss-shape-ui-controls{display:grid;gap:10px}
        .ss-shape-ui-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .ss-shape-ui-preview .ss-ui-preview-stage{min-height:210px;padding:12px;background:#dce2e8}
        .ss-shape-ui-preview svg{width:100%;height:170px;max-width:320px}
        .ss-shape-ui-color{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 9px;border:1px solid #3b4651;border-radius:6px;background:#202832;color:#aab8c6;font-size:9px}
        .ss-shape-ui-color span:last-child{width:30px;height:24px;border:1px solid #71808e;border-radius:5px}
        @media(max-width:650px),(pointer:coarse){.ss-shape-ui-layout{grid-template-columns:1fr}.ss-shape-ui-preview-column{order:-1}.ss-shape-ui-preview .ss-ui-preview-stage{min-height:130px}.ss-shape-ui-preview svg{height:115px}}
        @media(max-width:430px){.ss-shape-ui-grid{grid-template-columns:1fr}}
      `}</style>

      <StudioUIDialog
        open={open}
        title={t[0]}
        subtitle={t[1]}
        icon="fa-regular fa-square"
        width={700}
        onClose={onCancel}
        className="ss-shape-ui-dialog"
        footer={
          <StudioUIButtonRow>
            <StudioUIButton onClick={onCancel}>{t[10]}</StudioUIButton>
            <StudioUIButton variant="primary" icon="fa-solid fa-plus" onClick={commit}>{t[11]}</StudioUIButton>
          </StudioUIButtonRow>
        }
      >
        <div className="ss-shape-ui-layout">
          <div className="ss-shape-ui-controls">
            <StudioUISection title={t[1]} subtitle={t[['rectangle', 'ellipse', 'line'].indexOf(shape) + 2]}>
              <StudioUITabs
                value={shape}
                ariaLabel={t[1]}
                items={[
                  { value: 'rectangle', label: t[2], icon: 'fa-regular fa-square' },
                  { value: 'ellipse', label: t[3], icon: 'fa-regular fa-circle' },
                  { value: 'line', label: t[4], icon: 'fa-solid fa-minus' },
                ]}
                onChange={setShape}
              />

              <div className="ss-shape-ui-grid">
                <StudioUINumber label={t[5]} value={width} min={1} max={5000} suffix="px" onChange={(next) => setWidth(Math.max(1, Math.min(5000, Math.round(next || 1))))} />
                <StudioUINumber label={t[6]} value={height} min={1} max={5000} suffix="px" onChange={(next) => setHeight(Math.max(1, Math.min(5000, Math.round(next || 1))))} />
                <StudioUINumber label={t[7]} value={thickness} min={1} max={200} suffix="px" onChange={(next) => setThickness(Math.max(1, Math.min(200, Math.round(next || 1))))} />
                {shape !== 'line' ? <StudioUIToggle label={t[8]} checked={fill} onChange={setFill} /> : null}
              </div>

              <div className="ss-shape-ui-color">
                <span>Current color · {color}</span>
                <span style={{ background: color }} aria-hidden="true" />
              </div>
            </StudioUISection>
          </div>

          <div className="ss-shape-ui-preview-column">
            <StudioUIPreview label={t[9]} className="ss-shape-ui-preview">
              <svg viewBox="0 0 200 110" aria-hidden="true">
                {shape === 'rectangle' ? <rect x="23" y="13" width="154" height="84" fill={fill ? color : 'none'} stroke={color} strokeWidth={Math.min(15, thickness / 3 + 1)} /> : null}
                {shape === 'ellipse' ? <ellipse cx="100" cy="55" rx="77" ry="42" fill={fill ? color : 'none'} stroke={color} strokeWidth={Math.min(15, thickness / 3 + 1)} /> : null}
                {shape === 'line' ? <line x1="23" y1="13" x2="177" y2="97" stroke={color} strokeWidth={Math.min(15, thickness / 3 + 1)} strokeLinecap="round" /> : null}
              </svg>
            </StudioUIPreview>
          </div>
        </div>
      </StudioUIDialog>
    </>
  )
}
