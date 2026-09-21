import { useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'

const WORDS = {
  en: ['Add text', 'Text', 'Type your text here', 'Font', 'Size (px)', 'Bold', 'Preview', 'Cancel', 'Add as new layer', 'Italic', 'Alignment', 'Left', 'Center', 'Right', 'Text color', 'Text width', 'Line spacing', 'Choose a position on the paper, then enter text. Each addition creates an independent raster layer.', 'Could not add text. Check the selected layer, available layer slots and text size.'],
  km: ['បន្ថែមអក្សរ', 'អត្ថបទ', 'វាយអត្ថបទរបស់អ្នកនៅទីនេះ', 'ពុម្ពអក្សរ', 'ទំហំ (px)', 'អក្សរដិត', 'មើលជាមុន', 'បោះបង់', 'បន្ថែមជា Layer ថ្មី', 'អក្សរទ្រេត', 'តម្រឹមអក្សរ', 'ឆ្វេង', 'កណ្ដាល', 'ស្ដាំ', 'ពណ៌អក្សរ', 'ទទឹងអក្សរ', 'គម្លាតបន្ទាត់', 'ជ្រើសទីតាំងលើក្រដាស រួចវាយអក្សរ។ អក្សរនីមួយៗដាក់ក្នុង Layer រូបភាពដាច់ដោយឡែក។', 'មិនអាចបន្ថែមអក្សរបានទេ។ សូមពិនិត្យ Layer ដែលបានជ្រើស ចំនួន Layer និងទំហំអក្សរ។'],
  zh: ['添加文字', '文字', '在此输入文字', '字体', '大小 (px)', '粗体', '预览', '取消', '添加为新图层', '斜体', '对齐', '左对齐', '居中', '右对齐', '文字颜色', '文本宽度', '行间距', '先在画布上选择位置，然后输入文字。每次添加都会建立独立位图图层。', '无法添加文字。请检查图层、图层数量和文字大小。'],
  ja: ['文字を追加', 'テキスト', 'ここに文字を入力', 'フォント', 'サイズ (px)', '太字', 'プレビュー', 'キャンセル', '新規レイヤーに追加', '斜体', '配置', '左', '中央', '右', '文字色', 'テキストの幅', '行間', 'キャンバス上で位置を選び、文字を入力します。追加した文字は独立したビットマップレイヤーになります。', '文字を追加できません。レイヤー、上限、文字サイズをご確認ください。'],
  ko: ['텍스트 추가', '텍스트', '여기에 텍스트 입력', '글꼴', '크기 (px)', '굵게', '미리보기', '취소', '새 레이어에 추가', '기울임꼴', '정렬', '왼쪽', '가운데', '오른쪽', '텍스트 색상', '텍스트 너비', '줄 간격', '캔버스에서 위치를 고른 후 텍스트를 입력하세요. 새 비트맵 레이어로 추가됩니다.', '텍스트를 추가하지 못했습니다. 레이어와 텍스트 크기를 확인하세요.'],
}

const FONTS = {
  sans: 'Arial, "Noto Sans Khmer", sans-serif',
  serif: 'Georgia, "Noto Serif Khmer", serif',
  mono: '"Courier New", monospace',
  khmer: '"Noto Sans Khmer", "Khmer OS", sans-serif',
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, Number.isFinite(Number(value)) ? Number(value) : minimum))
}

export function drawStudioText(ctx, anchor, settings) {
  const text = String(settings?.text || '').trim()
  if (!ctx || !anchor || !text) return false
  const width = ctx.canvas.width
  const height = ctx.canvas.height
  if (width < 1 || height < 1) return false
  const fontSize = Math.round(clamp(settings.size, 8, 400))
  const lineHeight = Math.ceil(fontSize * clamp(settings.lineSpacing ?? 1.35, 1, 2.5))
  const margin = Math.max(2, Math.min(12, Math.round(fontSize * 0.12)))
  const minimumWidth = Math.min(Math.max(fontSize * 2, 30), Math.max(1, width - margin * 2))
  const left = Math.max(margin, Math.min(width - margin - minimumWidth, Math.round(anchor.x)))
  const availableWidth = Math.min(Math.max(1, width - left - margin), Math.max(minimumWidth, Math.round(width * clamp(settings.widthPercent ?? 80, 20, 100) / 100)))
  const align = ['left', 'center', 'right'].includes(settings.align) ? settings.align : 'left'
  const x = align === 'center' ? left + availableWidth / 2 : align === 'right' ? left + availableWidth : left
  const top = Math.max(margin, Math.min(height - margin - lineHeight, Math.round(anchor.y)))
  ctx.save()
  try {
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1
    ctx.fillStyle = /^#[0-9a-f]{6}$/i.test(settings.color) ? settings.color : '#111111'
    ctx.font = `${settings.italic ? 'italic ' : ''}${settings.bold ? 'bold ' : ''}${fontSize}px ${FONTS[settings.font] || FONTS.sans}`
    ctx.textBaseline = 'top'
    ctx.textAlign = align
    const graphemes = typeof Intl.Segmenter === 'function'
      ? (source) => Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(source), (part) => part.segment)
      : (source) => Array.from(source)
    const lines = []
    for (const source of text.replace(/\r\n?/g, '\n').split('\n')) {
      let line = ''
      for (const character of graphemes(source)) {
        if (line && ctx.measureText(line + character).width > availableWidth) {
          lines.push(line)
          line = character
        } else line += character
      }
      lines.push(line)
    }
    if (top + lines.length * lineHeight > height - margin) throw new Error('Text is too long for the paper. Reduce the font size, line spacing or text length.')
    for (let index = 0; index < lines.length; index += 1) {
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
  const [italic, setItalic] = useState(false)
  const [align, setAlign] = useState('left')
  const [widthPercent, setWidthPercent] = useState(80)
  const [lineSpacing, setLineSpacing] = useState(1.35)
  const [ink, setInk] = useState(() => /^#[0-9a-f]{6}$/i.test(color) ? color : '#111111')
  const [error, setError] = useState('')
  if (!open) return null
  const submit = (event) => {
    event.preventDefault()
    if (!text.trim()) return
    setError('')
    try {
      const result = onApply({ text, font, size, bold, italic, align, color: ink, widthPercent, lineSpacing })
      if (result === false) setError(t[18])
    } catch (reason) {
      setError(reason?.message || t[18])
    }
  }
  return (
    <div className="ss-text-backdrop" onKeyDown={(event) => { if (event.key === 'Escape') { event.stopPropagation(); onCancel() } }}>
      <style>{`
        .ss-text-backdrop{position:fixed;inset:0;z-index:1100;display:grid;place-items:center;padding:12px;box-sizing:border-box;background:#080e18c9}
        .ss-text-modal{width:min(525px,100%);max-height:92dvh;overflow-y:auto;box-sizing:border-box;padding:18px;border:1px solid #61758b;border-radius:12px;background:#283441;color:#eff5fc;box-shadow:0 18px 65px #0009}
        .ss-text-modal h2{font-size:16px;margin:0 0 12px}
        .ss-text-modal label{display:grid;gap:6px;font-size:12px;font-weight:600}
        .ss-text-modal textarea,.ss-text-modal select,.ss-text-modal input[type=number]{min-width:0;width:100%;box-sizing:border-box;border:1px solid #687d91;border-radius:6px;padding:8px;background:#1c2834;color:#fff;font:inherit}
        .ss-text-modal textarea{min-height:104px;resize:vertical;line-height:1.4}
        .ss-text-form-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(90px,120px);gap:11px;margin-top:11px}
        .ss-text-style-row{display:flex;flex-wrap:wrap;align-items:center;gap:11px;margin-top:11px}
        .ss-text-style-row label{display:flex;align-items:center;gap:6px}
        .ss-text-modal input[type=color]{width:48px;height:34px;padding:2px;border:1px solid #687d91;border-radius:5px;background:#1c2834}
        .ss-text-preview{min-height:55px;max-height:145px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;padding:10px;border:1px solid #516173;border-radius:6px;background:#f9f9f9;line-height:1.35}
        .ss-text-help{margin:10px 0 0;color:#b9cadb;font-size:11px;line-height:1.45}
        .ss-text-error{margin:10px 0 0;color:#ffc1c1;font-size:11px;line-height:1.4}
        .ss-text-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:16px}
        .ss-text-actions button{min-height:36px;border:1px solid #68809b;border-radius:6px;padding:6px 13px;background:#3b4c60;color:#fff;font:inherit;cursor:pointer}
        .ss-text-actions button[type=submit]{background:#3474b7;border-color:#71a9e1}
        .ss-text-actions button:disabled{opacity:.45;cursor:not-allowed}
        @media(max-width:440px){.ss-text-modal{padding:12px}.ss-text-form-grid{grid-template-columns:minmax(0,1fr) 90px}}
      `}</style>
      <form className="ss-text-modal" role="dialog" aria-modal="true" aria-label={t[0]} onSubmit={submit}>
        <h2>{t[0]}</h2>
        <label>{t[1]}<textarea autoFocus value={text} maxLength={1200} placeholder={t[2]} onChange={(event) => { setText(event.target.value); setError('') }} /></label>
        <div className="ss-text-form-grid">
          <label>{t[3]}<select value={font} onChange={(event) => setFont(event.target.value)}><option value="sans">Sans Serif</option><option value="serif">Serif</option><option value="mono">Monospace</option><option value="khmer">Khmer</option></select></label>
          <label>{t[4]}<input type="number" min="8" max="400" step="1" value={size} onChange={(event) => setSize(Math.round(clamp(event.target.value, 8, 400)))} /></label>
        </div>
        <div className="ss-text-style-row">
          <label><input type="checkbox" checked={bold} onChange={(event) => setBold(event.target.checked)} />{t[5]}</label>
          <label><input type="checkbox" checked={italic} onChange={(event) => setItalic(event.target.checked)} />{t[9]}</label>
          <label>{t[14]}<input type="color" value={ink} onChange={(event) => setInk(event.target.value)} /></label>
        </div>
        <div className="ss-text-form-grid">
          <label>{t[10]}<select value={align} onChange={(event) => setAlign(event.target.value)}><option value="left">{t[11]}</option><option value="center">{t[12]}</option><option value="right">{t[13]}</option></select></label>
          <label>{t[15]} (%)<input type="number" min="20" max="100" step="5" value={widthPercent} onChange={(event) => setWidthPercent(Math.round(clamp(event.target.value, 20, 100)))} /></label>
        </div>
        <div className="ss-text-form-grid">
          <label>{t[16]}<input type="number" min="1" max="2.5" step="0.05" value={lineSpacing} onChange={(event) => setLineSpacing(clamp(event.target.value, 1, 2.5))} /></label>
        </div>
        <label style={{ marginTop: 12 }}>{t[6]}<div className="ss-text-preview" style={{ color: ink, fontFamily: FONTS[font], fontWeight: bold ? 700 : 400, fontStyle: italic ? 'italic' : 'normal', textAlign: align, fontSize: Math.min(size, 36), lineHeight: lineSpacing }}>{text || t[2]}</div></label>
        <p className="ss-text-help">{t[17]}</p>
        {error ? <p className="ss-text-error" role="alert">{error}</p> : null}
        <div className="ss-text-actions"><button type="button" onClick={onCancel}>{t[7]}</button><button type="submit" disabled={!text.trim()}>{t[8]}</button></div>
      </form>
    </div>
  )
}
