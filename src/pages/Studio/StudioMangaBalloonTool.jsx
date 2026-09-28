import { useEffect, useRef, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import {
  StudioUIButton,
  StudioUIColor,
  StudioUINumber,
  StudioUIPreview,
  StudioUISection,
  StudioUISelect,
  StudioUISlider,
  StudioUIToggle,
} from './StudioUIControls'
import { drawStudioMangaBalloon, normalizeStudioMangaBalloonOptions } from './StudioMangaBalloonRenderer'

const TEXT = {
  en: ['Manga balloon tool', 'Preview', 'Shape', 'Ellipse', 'Rounded', 'Thought', 'Shout', 'Tail', 'None', 'Bottom', 'Top', 'Left', 'Right', 'Width', 'Height', 'Border', 'Fill', 'Outline', 'Text color', 'Opacity', 'Dialogue (optional)', 'Font', 'Sans serif', 'Serif', 'Monospace', 'Font size', 'Bold', 'Italic', 'Align', 'Add balloon', 'Select an editable layer before placing a balloon.', 'Manga balloon is not connected to the canvas yet.', 'The balloon could not be added.', 'Bubble settings', 'Text settings', 'Preview the balloon here, then add it at the center of the paper on a new raster layer. Undo can remove it.', 'Left', 'Center', 'Right'],
  km: ['ឧបករណ៍ពពុះសន្ទនា Manga', 'មើលជាមុន', 'ទម្រង់', 'រាងពងក្រពើ', 'ជ្រុងមូល', 'ពពុះគំនិត', 'ពពុះស្រែក', 'កន្ទុយ', 'គ្មាន', 'ក្រោម', 'លើ', 'ឆ្វេង', 'ស្ដាំ', 'ទទឹង', 'កម្ពស់', 'កម្រាស់ស៊ុម', 'ពណ៌ផ្ទៃ', 'ពណ៌ស៊ុម', 'ពណ៌អក្សរ', 'ភាពស្រអាប់', 'អត្ថបទសន្ទនា (មិនបង្ខំ)', 'ពុម្ពអក្សរ', 'អក្សរធម្មតា', 'អក្សរស៊េរីហ្វ', 'អក្សរម៉ូណូ', 'ទំហំអក្សរ', 'ដិត', 'ទ្រេត', 'តម្រឹម', 'ដាក់ពពុះសន្ទនា', 'សូមជ្រើស Layer ដែលអាចកែប្រែបានមុនដាក់ពពុះសន្ទនា។', 'Tool នេះមិនទាន់បានភ្ជាប់ទៅ Canvas ទេ។', 'មិនអាចដាក់ពពុះសន្ទនាបានទេ។', 'ការកំណត់ពពុះ', 'ការកំណត់អក្សរ', 'មើលពពុះជាមុន រួចដាក់នៅកណ្ដាលក្រដាសជា Raster Layer ថ្មី។ អាចប្រើ Undo ដើម្បីដកចេញ។', 'ឆ្វេង', 'កណ្ដាល', 'ស្ដាំ'],
  zh: ['漫画气泡工具', '预览', '形状', '椭圆', '圆角', '思考', '喊叫', '尾巴', '无', '下', '上', '左', '右', '宽度', '高度', '边框', '填充', '描边颜色', '文字颜色', '不透明度', '对话文字（可选）', '字体', '无衬线', '衬线', '等宽', '字号', '粗体', '斜体', '对齐', '添加气泡', '请先选择可编辑的图层。', '气泡工具尚未连接画布。', '无法添加气泡。', '气泡设置', '文字设置', '先预览气泡，再将其添加到画布中央的新位图图层。可使用撤销移除。', '左', '居中', '右'],
  ja: ['マンガ吹き出しツール', 'プレビュー', '形状', '楕円', '角丸', '思考', '叫び', 'しっぽ', 'なし', '下', '上', '左', '右', '幅', '高さ', '枠線', '塗り', '線の色', '文字色', '不透明度', '台詞（任意）', 'フォント', 'サンセリフ', 'セリフ', '等幅', '文字サイズ', '太字', '斜体', '整列', '吹き出しを追加', '編集可能なレイヤーを選択してください。', 'まだキャンバスには接続されていません。', '吹き出しを追加できませんでした。', '吹き出し設定', '文字設定', '吹き出しをプレビューし、キャンバス中央の新しいラスターレイヤーに追加します。元に戻すで削除できます。', '左', '中央', '右'],
  ko: ['만화 말풍선 도구', '미리보기', '모양', '타원', '둥근 모서리', '생각', '외침', '꼬리', '없음', '아래', '위', '왼쪽', '오른쪽', '너비', '높이', '테두리', '채우기', '테두리 색', '글자 색', '불투명도', '대사(선택)', '글꼴', '산세리프', '세리프', '고정폭', '글자 크기', '굵게', '기울임', '정렬', '말풍선 추가', '편집 가능한 레이어를 먼저 선택하세요.', '아직 캔버스에 연결되지 않았습니다.', '말풍선을 추가할 수 없습니다.', '말풍선 설정', '글자 설정', '말풍선을 미리 본 뒤 캔버스 중앙에 새 래스터 레이어로 추가합니다. 실행 취소로 제거할 수 있습니다.', '왼쪽', '가운데', '오른쪽'],
}

const SHAPES = [['ellipse', 3], ['rounded', 4], ['thought', 5], ['shout', 6]]
const TAILS = [['none', 8], ['bottom', 9], ['top', 10], ['left', 11], ['right', 12]]
const FONTS = [['sans', 22], ['serif', 23], ['mono', 24]]
const DEFAULT = { shape: 'ellipse', tail: 'bottom', width: 240, height: 160, border: 4, fill: '#FFFFFF', ink: '#111111', textColor: '#111111', opacity: 100, text: '', font: 'sans', fontSize: 24, bold: false, italic: false, align: 'center' }

export default function StudioMangaBalloonTool({ onApply, disabled = false, color = '#111111' }) {
  const { language } = useDisplayTranslation()
  const t = TEXT[language] || TEXT.en
  const [options, setOptions] = useState(() => ({ ...DEFAULT, ink: color, textColor: color }))
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const canvasRef = useRef(null)
  const previewWidth = 520
  const previewHeight = 340
  const update = (key, value) => {
    setMessage('')
    setOptions((current) => ({ ...current, [key]: value }))
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    context.clearRect(0, 0, canvas.width, canvas.height)
    const logicalWidth = Math.max(600, options.width + 150)
    const logicalHeight = Math.max(420, options.height + 150)
    const scale = Math.min(previewWidth / logicalWidth, previewHeight / logicalHeight)
    try {
      const preview = document.createElement('canvas')
      preview.width = logicalWidth
      preview.height = logicalHeight
      const previewContext = preview.getContext('2d')
      if (!previewContext) throw new Error('Canvas preview is unavailable.')
      drawStudioMangaBalloon(previewContext, null, options)
      context.drawImage(preview, (previewWidth - logicalWidth * scale) / 2, (previewHeight - logicalHeight * scale) / 2, logicalWidth * scale, logicalHeight * scale)
      setMessage('')
    } catch (error) {
      setMessage(error.message || t[32])
    }
  }, [options, t])

  async function submit() {
    if (disabled || busy || typeof onApply !== 'function') return
    let normalized
    try {
      normalized = normalizeStudioMangaBalloonOptions(options)
    } catch (error) {
      setMessage(error.message || t[32])
      return
    }
    setBusy(true)
    setMessage('')
    try {
      await onApply(normalized)
    } catch (error) {
      setMessage(error?.message || t[32])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="ss-manga-balloon-ui">
      <style>{`
        .ss-manga-balloon-ui{display:grid;gap:10px;min-width:0}
        .ss-manga-balloon-ui .ss-ui-preview-stage{min-height:190px}
        .ss-manga-balloon-ui canvas{display:block;width:100%;height:auto;max-width:520px}
        .ss-manga-balloon-ui-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .ss-manga-balloon-ui-text{display:grid;gap:5px;color:#edf3fa;font-size:10px;font-weight:700}
        .ss-manga-balloon-ui-text textarea{width:100%;min-height:78px;padding:8px;border:1px solid #4b5968;border-radius:6px;outline:none;resize:vertical;background:#202832;color:#edf3fa;font:11px Inter,system-ui,sans-serif;line-height:1.45}
        .ss-manga-balloon-ui-help{margin:0;padding:7px 9px;border:1px solid #3b4651;border-radius:6px;background:#202832;color:#9fb0c0;font-size:9px;line-height:1.45}
        .ss-manga-balloon-ui-error{margin:0;padding:7px 9px;border:1px solid #8e4750;border-radius:6px;background:#4b2b31;color:#ffd5d8;font-size:9px;line-height:1.45}
        .ss-manga-balloon-ui>.ss-ui-button{width:100%}
        @media(max-width:500px){.ss-manga-balloon-ui-grid{grid-template-columns:1fr}}
      `}</style>

      <StudioUIPreview label={t[1]}>
        <canvas ref={canvasRef} width={previewWidth} height={previewHeight} aria-label={t[1]} />
      </StudioUIPreview>

      <p className="ss-manga-balloon-ui-help">{t[35]}</p>

      <StudioUISection title={t[33]} subtitle={t[0]}>
        <div className="ss-manga-balloon-ui-grid">
          <StudioUISelect label={t[2]} value={options.shape} options={SHAPES.map(([id, label]) => ({ value: id, label: t[label] }))} disabled={busy} onChange={(next) => update('shape', next)} />
          <StudioUISelect label={t[7]} value={options.tail} options={TAILS.map(([id, label]) => ({ value: id, label: t[label] }))} disabled={busy} onChange={(next) => update('tail', next)} />
          <StudioUINumber label={t[13]} value={options.width} min={80} max={1600} suffix="px" disabled={busy} onChange={(next) => update('width', next)} />
          <StudioUINumber label={t[14]} value={options.height} min={60} max={1200} suffix="px" disabled={busy} onChange={(next) => update('height', next)} />
          <StudioUINumber label={t[15]} value={options.border} min={1} max={30} suffix="px" disabled={busy} onChange={(next) => update('border', next)} />
          <StudioUISlider label={t[19]} value={options.opacity} min={1} max={100} suffix="%" disabled={busy} onChange={(next) => update('opacity', next)} />
        </div>
        <StudioUIColor label={t[16]} value={options.fill} disabled={busy} onChange={(next) => {
          if (/^#[0-9a-f]{6}$/i.test(next)) update('fill', next)
        }} />
        <StudioUIColor label={t[17]} value={options.ink} disabled={busy} onChange={(next) => {
          if (/^#[0-9a-f]{6}$/i.test(next)) update('ink', next)
        }} />
      </StudioUISection>

      <StudioUISection title={t[34]} subtitle={t[20]}>
        <label className="ss-manga-balloon-ui-text">
          <span>{t[20]}</span>
          <textarea rows={3} maxLength={1200} value={options.text} disabled={busy} onChange={(event) => update('text', event.target.value)} />
        </label>

        <div className="ss-manga-balloon-ui-grid">
          <StudioUISelect label={t[21]} value={options.font} options={FONTS.map(([id, label]) => ({ value: id, label: t[label] }))} disabled={busy} onChange={(next) => update('font', next)} />
          <StudioUINumber label={t[25]} value={options.fontSize} min={8} max={160} suffix="px" disabled={busy} onChange={(next) => update('fontSize', next)} />
          <StudioUIColor label={t[18]} value={options.textColor} disabled={busy} onChange={(next) => {
            if (/^#[0-9a-f]{6}$/i.test(next)) update('textColor', next)
          }} />
          <StudioUISelect
            label={t[28]}
            value={options.align}
            options={[['left', 36], ['center', 37], ['right', 38]].map(([id, label]) => ({ value: id, label: t[label] }))}
            disabled={busy}
            onChange={(next) => update('align', next)}
          />
          <StudioUIToggle label={t[26]} checked={options.bold} disabled={busy} onChange={(next) => update('bold', next)} />
          <StudioUIToggle label={t[27]} checked={options.italic} disabled={busy} onChange={(next) => update('italic', next)} />
        </div>
      </StudioUISection>

      {message ? <p className="ss-manga-balloon-ui-error" role="alert">{message}</p> : null}
      {!onApply ? <p className="ss-manga-balloon-ui-help">{t[31]}</p> : null}

      <StudioUIButton variant="primary" icon="fa-solid fa-plus" disabled={disabled || busy || typeof onApply !== 'function'} onClick={submit}>
        {t[29]}
      </StudioUIButton>
    </div>
  )
}
