import { useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'

const WORDS = {
  en: ['Add text', 'Text', 'Type your text here', 'Font', 'Size (px)', 'Bold', 'Preview', 'Cancel', 'Add to paper'],
  km: ['បន្ថែមអក្សរ', 'អត្ថបទ', 'វាយអត្ថបទរបស់អ្នកនៅទីនេះ', 'ពុម្ពអក្សរ', 'ទំហំ (px)', 'អក្សរដិត', 'មើលជាមុន', 'បោះបង់', 'ដាក់លើក្រដាស'],
  zh: ['添加文字', '文字', '在此输入文字', '字体', '大小 (px)', '粗体', '预览', '取消', '放到画布上'],
  ja: ['文字を追加', 'テキスト', 'ここに文字を入力', 'フォント', 'サイズ (px)', '太字', 'プレビュー', 'キャンセル', 'キャンバスに配置'],
  ko: ['텍스트 추가', '텍스트', '여기에 텍스트 입력', '글꼴', '크기 (px)', '굵게', '미리보기', '취소', '캔버스에 추가'],
}

const FONTS = {
  sans: 'Arial, "Noto Sans Khmer", sans-serif',
  serif: 'Georgia, "Noto Serif Khmer", serif',
  mono: '"Courier New", monospace',
}

export function drawStudioText(ctx, anchor, settings) {
  const text = String(settings?.text || '').trim()
  if (!ctx || !anchor || !text) return false
  const width = ctx.canvas.width
  const height = ctx.canvas.height
  if (width < 1 || height < 1) return false
  const fontSize = Math.max(8, Math.min(400, Math.round(Number(settings.size) || 32)))
  const margin = Math.max(2, Math.min(12, Math.round(fontSize * 0.12)))
  const x = Math.max(margin, Math.min(width - margin, Math.round(anchor.x)))
  const availableWidth = Math.max(1, width - x - margin)
  const lineHeight = Math.ceil(fontSize * 1.35)
  ctx.save()
  try {
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1
    ctx.fillStyle = settings.color || '#111111'
    ctx.font = `${settings.bold ? 'bold ' : ''}${fontSize}px ${FONTS[settings.font] || FONTS.sans}`
    ctx.textBaseline = 'top'
    const lines = []
    for (const source of text.replace(/\r\n?/g, '\n').split('\n')) {
      let line = ''
      for (const character of source) {
        if (line && ctx.measureText(line + character).width > availableWidth) {
          lines.push(line)
          line = character
        } else {
          line += character
        }
      }
      lines.push(line)
    }
    const count = Math.min(lines.length, Math.max(1, Math.floor((height - margin * 2) / lineHeight)))
    const top = Math.max(margin, Math.min(Math.round(anchor.y), height - margin - count * lineHeight))
    for (let index = 0; index < count; index += 1) {
      ctx.fillText(lines[index], x, top + index * lineHeight, availableWidth)
    }
    return true
  } finally {
    ctx.restore()
  }
}

export default function StudioTextEditor({ open, color, onCancel, onApply }) {
  const { language } = useDisplayTranslation()
  const t = WORDS[language] || WORDS.en
  const [text, setText] = useState('')
  const [font, setFont] = useState('sans')
  const [size, setSize] = useState(32)
  const [bold, setBold] = useState(false)
  if (!open) return null
  const submit = (event) => {
    event.preventDefault()
    if (!text.trim()) return
    onApply({ text, font, size, bold, color })
  }
  return (
    <div className="ss-text-backdrop" onKeyDown={(event) => { if (event.key === 'Escape') onCancel() }}>
      <style>{`
        .ss-text-backdrop{position:fixed;inset:0;z-index:1100;display:grid;place-items:center;padding:12px;box-sizing:border-box;background:#080e18c9}
        .ss-text-modal{width:min(460px,100%);max-height:92dvh;overflow-y:auto;box-sizing:border-box;padding:20px;border:1px solid #61758b;border-radius:12px;background:#283441;color:#eff5fc;box-shadow:0 18px 65px #0009}
        .ss-text-modal h2{font-size:16px;margin:0 0 16px}
        .ss-text-modal label{display:grid;gap:6px;font-size:12px;font-weight:600}
        .ss-text-modal textarea,.ss-text-modal select,.ss-text-modal input[type=number]{min-width:0;width:100%;box-sizing:border-box;border:1px solid #687d91;border-radius:6px;padding:8px;background:#1c2834;color:#fff;font:inherit}
        .ss-text-modal textarea{min-height:105px;resize:vertical;line-height:1.4}
        .ss-text-form-grid{display:grid;grid-template-columns:1fr 110px;gap:12px;margin-top:12px}
        .ss-text-bold{display:flex!important;align-items:center;gap:8px;margin-top:12px}
        .ss-text-preview{min-height:55px;max-height:110px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;padding:10px;border:1px solid #516173;border-radius:6px;background:#f9f9f9}
        .ss-text-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:16px}
        .ss-text-actions button{min-height:36px;border:1px solid #68809b;border-radius:6px;padding:6px 13px;background:#3b4c60;color:#fff;font:inherit;cursor:pointer}
        .ss-text-actions button[type=submit]{background:#3474b7;border-color:#71a9e1}
        .ss-text-actions button:disabled{opacity:.45;cursor:not-allowed}
      `}</style>
      <form className="ss-text-modal" role="dialog" aria-modal="true" aria-label={t[0]} onSubmit={submit}>
        <h2>{t[0]}</h2>
        <label>{t[1]}<textarea autoFocus value={text} maxLength={1200} placeholder={t[2]} onChange={(event) => setText(event.target.value)} /></label>
        <div className="ss-text-form-grid">
          <label>{t[3]}<select value={font} onChange={(event) => setFont(event.target.value)}><option value="sans">Sans Serif</option><option value="serif">Serif</option><option value="mono">Monospace</option></select></label>
          <label>{t[4]}<input type="number" min="8" max="400" step="1" value={size} onChange={(event) => setSize(Math.max(8, Math.min(400, Number(event.target.value) || 8)))} /></label>
        </div>
        <label className="ss-text-bold"><input type="checkbox" checked={bold} onChange={(event) => setBold(event.target.checked)} />{t[5]}</label>
        <label style={{ marginTop: 14 }}>{t[6]}<div className="ss-text-preview" style={{ color, fontFamily: FONTS[font], fontWeight: bold ? 700 : 400, fontSize: Math.min(size, 36) }}>{text || t[2]}</div></label>
        <div className="ss-text-actions"><button type="button" onClick={onCancel}>{t[7]}</button><button type="submit" disabled={!text.trim()}>{t[8]}</button></div>
      </form>
    </div>
  )
}
