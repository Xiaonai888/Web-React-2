import { useEffect, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import {
  StudioUIButton,
  StudioUIButtonRow,
  StudioUIColor,
  StudioUIDialog,
  StudioUINumber,
  StudioUIPreview,
  StudioUISection,
  StudioUISelect,
  StudioUIToggle,
} from './StudioUIControls'

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

export default function StudioTextEditor({ open, color, initialData, onCancel, onApply }) {
  const { language } = useDisplayTranslation()
  const t = WORDS[language] || WORDS.en
  const [text, setText] = useState(initialData?.text || '')
  const [font, setFont] = useState(initialData?.font || 'sans')
  const [size, setSize] = useState(initialData?.size ?? 32)
  const [bold, setBold] = useState(initialData?.bold ?? false)
  const [italic, setItalic] = useState(initialData?.italic ?? false)
  const [align, setAlign] = useState(initialData?.align || 'left')
  const [widthPercent, setWidthPercent] = useState(initialData?.widthPercent ?? 80)
  const [lineSpacing, setLineSpacing] = useState(initialData?.lineSpacing ?? 1.35)
  const [ink, setInk] = useState(() => /^#[0-9a-f]{6}$/i.test(initialData?.color || color) ? (initialData?.color || color) : '#111111')
  const [error, setError] = useState('')

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

  const editTitle = ({ en: 'Edit text layer', km: 'កែអក្សរលើស្រទាប់', zh: '编辑文字图层', ja: 'テキストレイヤーを編集', ko: '텍스트 레이어 수정' })[language] || 'Edit text layer'
  const saveLabel = ({ en: 'Save text changes', km: 'រក្សាទុកការកែអក្សរ', zh: '保存文字修改', ja: 'テキストの変更を保存', ko: '텍스트 변경 저장' })[language] || 'Save text changes'
  const title = initialData ? editTitle : t[0]

  function submit() {
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
    <>
      <style>{`
        .ss-text-ui-dialog .ss-ui-dialog-content{padding:13px}
        .ss-text-ui-layout{display:grid;grid-template-columns:minmax(0,1fr) 220px;gap:12px}
        .ss-text-ui-controls{display:grid;gap:10px}
        .ss-text-ui-two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .ss-text-ui-area{display:grid;gap:6px;color:#edf3fa;font-size:10px;font-weight:700}
        .ss-text-ui-area textarea{width:100%;min-height:110px;padding:9px;border:1px solid #4b5968;border-radius:6px;outline:none;resize:vertical;background:#202832;color:#edf3fa;font:11px Inter,system-ui,sans-serif;line-height:1.45}
        .ss-text-ui-area textarea:focus{border-color:#5faeff;box-shadow:0 0 0 2px #5faeff26}
        .ss-text-ui-preview .ss-ui-preview-stage{min-height:190px;padding:12px;background:#f7f8fa}
        .ss-text-ui-preview-text{width:100%;max-height:220px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere}
        .ss-text-ui-help{margin:0;padding:8px 9px;border:1px solid #3b4651;border-radius:6px;background:#202832;color:#9fb0c0;font-size:9px;line-height:1.45}
        .ss-text-ui-error{margin:0;padding:8px 9px;border:1px solid #8e4750;border-radius:6px;background:#4b2b31;color:#ffd5d8;font-size:9px;line-height:1.45}
        @media(max-width:700px),(pointer:coarse){.ss-text-ui-layout{grid-template-columns:1fr}.ss-text-ui-preview-column{order:-1}.ss-text-ui-preview .ss-ui-preview-stage{min-height:120px}}
        @media(max-width:430px){.ss-text-ui-two{grid-template-columns:1fr}}
      `}</style>

      <StudioUIDialog
        open={open}
        title={title}
        subtitle={initialData ? editTitle : t[17]}
        icon="fa-solid fa-font"
        width={760}
        onClose={onCancel}
        className="ss-text-ui-dialog"
        footer={
          <StudioUIButtonRow>
            <StudioUIButton onClick={onCancel}>{t[7]}</StudioUIButton>
            <StudioUIButton variant="primary" icon="fa-solid fa-check" disabled={!text.trim()} onClick={submit}>
              {initialData ? saveLabel : t[8]}
            </StudioUIButton>
          </StudioUIButtonRow>
        }
      >
        <div className="ss-text-ui-layout">
          <div className="ss-text-ui-controls">
            <StudioUISection title={t[1]} subtitle={t[2]}>
              <label className="ss-text-ui-area">
                <span>{t[1]}</span>
                <textarea autoFocus value={text} maxLength={1200} placeholder={t[2]} onChange={(event) => { setText(event.target.value); setError('') }} />
              </label>

              <div className="ss-text-ui-two">
                <StudioUISelect
                  label={t[3]}
                  value={font}
                  options={[
                    { value: 'sans', label: 'Sans Serif' },
                    { value: 'serif', label: 'Serif' },
                    { value: 'mono', label: 'Monospace' },
                    { value: 'khmer', label: 'Khmer' },
                  ]}
                  onChange={setFont}
                />
                <StudioUINumber label={t[4]} value={size} min={8} max={400} step={1} suffix="px" onChange={(next) => setSize(Math.round(clamp(next, 8, 400)))} />
              </div>

              <div className="ss-text-ui-two">
                <StudioUIToggle label={t[5]} checked={bold} onChange={setBold} />
                <StudioUIToggle label={t[9]} checked={italic} onChange={setItalic} />
              </div>

              <StudioUIColor label={t[14]} value={ink} onChange={(next) => {
                if (/^#[0-9a-f]{6}$/i.test(next)) setInk(next)
              }} />

              <div className="ss-text-ui-two">
                <StudioUISelect
                  label={t[10]}
                  value={align}
                  options={[
                    { value: 'left', label: t[11] },
                    { value: 'center', label: t[12] },
                    { value: 'right', label: t[13] },
                  ]}
                  onChange={setAlign}
                />
                <StudioUINumber label={`${t[15]} (%)`} value={widthPercent} min={20} max={100} step={5} suffix="%" onChange={(next) => setWidthPercent(Math.round(clamp(next, 20, 100)))} />
              </div>

              <StudioUINumber label={t[16]} value={lineSpacing} min={1} max={2.5} step={0.05} onChange={(next) => setLineSpacing(clamp(next, 1, 2.5))} />
            </StudioUISection>

            <p className="ss-text-ui-help">{initialData ? editTitle : t[17]}</p>
            {error ? <p className="ss-text-ui-error" role="alert">{error}</p> : null}
          </div>

          <div className="ss-text-ui-preview-column">
            <StudioUIPreview label={t[6]} className="ss-text-ui-preview">
              <div
                className="ss-text-ui-preview-text"
                style={{
                  color: ink,
                  fontFamily: FONTS[font],
                  fontWeight: bold ? 700 : 400,
                  fontStyle: italic ? 'italic' : 'normal',
                  textAlign: align,
                  fontSize: Math.min(size, 36),
                  lineHeight: lineSpacing,
                }}
              >
                {text || t[2]}
              </div>
            </StudioUIPreview>
          </div>
        </div>
      </StudioUIDialog>
    </>
  )
}
