import { useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'

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
    if (settings.shape === 'line') { ctx.moveTo(x, y); ctx.lineTo(x + width, y + height) }
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
  if (!open) return null
  const commit = (event) => {
    event.preventDefault()
    onApply({ shape, width, height, thickness, fill, color })
  }
  return (
    <div className="ss-shape-backdrop" onKeyDown={(event) => { if (event.key === 'Escape') onCancel() }}>
      <style>{`
        .ss-shape-backdrop{position:fixed;inset:0;z-index:1101;display:grid;place-items:center;padding:12px;box-sizing:border-box;background:#080e18ce}
        .ss-shape-modal{width:min(440px,100%);max-height:92dvh;overflow:auto;padding:20px;box-sizing:border-box;border:1px solid #61758b;border-radius:12px;background:#283441;color:#eff5fc;box-shadow:0 18px 65px #0009}
        .ss-shape-modal h2{font-size:16px;margin:0 0 16px}.ss-shape-modal label{display:grid;gap:6px;font-size:12px;font-weight:600}
        .ss-shape-modal select,.ss-shape-modal input[type=number]{width:100%;min-width:0;height:34px;box-sizing:border-box;border:1px solid #687d91;border-radius:6px;padding:5px 8px;background:#1c2834;color:#fff;font:inherit}
        .ss-shape-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:12px}
        .ss-shape-fill{display:flex!important;align-items:center;gap:8px;margin:12px 0}
        .ss-shape-preview{display:grid;place-items:center;min-height:120px;margin-top:7px;padding:10px;border:1px solid #516173;border-radius:6px;background:#dce2e8}
        .ss-shape-preview svg{width:100%;height:110px;max-width:300px}
        .ss-shape-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:16px}
        .ss-shape-actions button{min-height:36px;border:1px solid #68809b;border-radius:6px;padding:6px 13px;background:#3b4c60;color:#fff;font:inherit;cursor:pointer}
        .ss-shape-actions button[type=submit]{background:#3474b7;border-color:#71a9e1}
      `}</style>
      <form className="ss-shape-modal" role="dialog" aria-modal="true" aria-label={t[0]} onSubmit={commit}>
        <h2>{t[0]}</h2>
        <label>{t[1]}<select value={shape} onChange={(event) => setShape(event.target.value)}><option value="rectangle">{t[2]}</option><option value="ellipse">{t[3]}</option><option value="line">{t[4]}</option></select></label>
        <div className="ss-shape-grid">
          <label>{t[5]}<input type="number" min="1" max="5000" value={width} onChange={(event) => setWidth(Math.max(1, Math.min(5000, Math.round(Number(event.target.value) || 1))))} /></label>
          <label>{t[6]}<input type="number" min="1" max="5000" value={height} onChange={(event) => setHeight(Math.max(1, Math.min(5000, Math.round(Number(event.target.value) || 1))))} /></label>
          <label>{t[7]}<input type="number" min="1" max="200" value={thickness} onChange={(event) => setThickness(Math.max(1, Math.min(200, Math.round(Number(event.target.value) || 1))))} /></label>
          {shape !== 'line' ? <label className="ss-shape-fill"><input type="checkbox" checked={fill} onChange={(event) => setFill(event.target.checked)} />{t[8]}</label> : null}
        </div>
        <label style={{ marginTop: 12 }}>{t[9]}<div className="ss-shape-preview"><svg viewBox="0 0 200 110" aria-hidden="true">
          {shape === 'rectangle' ? <rect x="23" y="13" width="154" height="84" fill={fill ? color : 'none'} stroke={color} strokeWidth={Math.min(15, thickness / 3 + 1)} /> : null}
          {shape === 'ellipse' ? <ellipse cx="100" cy="55" rx="77" ry="42" fill={fill ? color : 'none'} stroke={color} strokeWidth={Math.min(15, thickness / 3 + 1)} /> : null}
          {shape === 'line' ? <line x1="23" y1="13" x2="177" y2="97" stroke={color} strokeWidth={Math.min(15, thickness / 3 + 1)} strokeLinecap="round" /> : null}
        </svg></div></label>
        <div className="ss-shape-actions"><button type="button" onClick={onCancel}>{t[10]}</button><button type="submit">{t[11]}</button></div>
      </form>
    </div>
  )
}
