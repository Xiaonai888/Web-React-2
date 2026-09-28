import { useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import {
  StudioUIButton,
  StudioUIColor,
  StudioUINumber,
  StudioUISection,
  StudioUISelect,
  StudioUISlider,
  StudioUITabs,
} from './StudioUIControls'

const LABELS = {
  en: ['Speech bubbles', 'Ellipse', 'Rounded', 'Thought', 'Shout', 'Width', 'Height', 'Border', 'Fill', 'Ink', 'Opacity', 'Tail direction', 'Bottom', 'Top', 'Left', 'Right', 'No tail', 'Text (optional)', 'Font size', 'Add to selected layer', 'Adding…', 'Select a visible, unlocked layer first.', 'Could not add the bubble.'],
  km: ['ពពុះសន្ទនា', 'រាងពងក្រពើ', 'ជ្រុងមូល', 'គំនិត', 'ស្រែក', 'ទទឹង', 'កម្ពស់', 'កម្រាស់បន្ទាត់', 'ពណ៌ផ្ទៃ', 'ពណ៌បន្ទាត់', 'ភាពស្រអាប់', 'ទិសកន្ទុយ', 'ក្រោម', 'លើ', 'ឆ្វេង', 'ស្ដាំ', 'គ្មានកន្ទុយ', 'អត្ថបទ (មិនបង្ខំ)', 'ទំហំអក្សរ', 'ដាក់លើស្រទាប់ដែលជ្រើស', 'កំពុងដាក់…', 'សូមជ្រើសស្រទាប់ដែលបង្ហាញ និងមិនចាក់សោជាមុន។', 'មិនអាចដាក់ពពុះសន្ទនាបានទេ។'],
  zh: ['对话气泡', '椭圆', '圆角', '思考', '喊叫', '宽度', '高度', '边框', '填充', '描边', '不透明度', '尾巴方向', '下', '上', '左', '右', '无尾巴', '文字（可选）', '字号', '添加到选中图层', '添加中…', '请先选择可见且未锁定的图层。', '无法添加气泡。'],
  ja: ['吹き出し', '楕円', '角丸', '思考', '叫び', '幅', '高さ', '線幅', '塗り', '線色', '不透明度', 'しっぽの向き', '下', '上', '左', '右', 'なし', '文字（任意）', '文字サイズ', '選択レイヤーに追加', '追加中…', '表示中でロックされていないレイヤーを選んでください。', '吹き出しを追加できません。'],
  ko: ['말풍선', '타원', '둥근 모서리', '생각', '외침', '너비', '높이', '테두리', '채우기', '선 색상', '불투명도', '꼬리 방향', '아래', '위', '왼쪽', '오른쪽', '없음', '텍스트 (선택)', '글꼴 크기', '선택한 레이어에 추가', '추가 중…', '표시된 잠금 해제 레이어를 먼저 선택하세요.', '말풍선을 추가할 수 없습니다.'],
}

const SHAPES = ['ellipse', 'rounded', 'thought', 'shout']
const TAILS = ['bottom', 'top', 'left', 'right', 'none']

export default function StudioSpeechBubblePanel({ onApply, disabled = false }) {
  const { language } = useDisplayTranslation()
  const t = LABELS[language] || LABELS.en
  const [shape, setShape] = useState('ellipse')
  const [width, setWidth] = useState(240)
  const [height, setHeight] = useState(160)
  const [border, setBorder] = useState(5)
  const [fill, setFill] = useState('#FFFFFF')
  const [ink, setInk] = useState('#111111')
  const [opacity, setOpacity] = useState(100)
  const [tail, setTail] = useState('bottom')
  const [text, setText] = useState('')
  const [fontSize, setFontSize] = useState(24)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const unavailable = disabled || busy || typeof onApply !== 'function'

  async function apply() {
    if (unavailable) return
    setError('')
    setBusy(true)
    try {
      await onApply({ shape, width, height, border, fill, ink, opacity, tail, text, fontSize })
    } catch (reason) {
      setError(reason?.message || t[22])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="ss-speech-ui">
      <style>{`
        .ss-speech-ui{display:grid;gap:10px;min-width:0}
        .ss-speech-ui-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .ss-speech-ui-text{display:grid;gap:5px;color:#edf3fa;font-size:10px;font-weight:700}
        .ss-speech-ui-text textarea{width:100%;min-height:78px;padding:8px;border:1px solid #4b5968;border-radius:6px;outline:none;resize:vertical;background:#202832;color:#edf3fa;font:11px Inter,system-ui,sans-serif;line-height:1.45}
        .ss-speech-ui-text textarea:focus{border-color:#5faeff;box-shadow:0 0 0 2px #5faeff26}
        .ss-speech-ui-actions{display:grid;gap:8px}
        .ss-speech-ui-actions>.ss-ui-button{width:100%}
        .ss-speech-ui-status{margin:0;padding:7px 9px;border:1px solid #3b4651;border-radius:6px;background:#202832;color:#9fb0c0;font-size:9px;line-height:1.45}
        .ss-speech-ui-status.error{border-color:#8e4750;background:#4b2b31;color:#ffd5d8}
        @media(max-width:500px){.ss-speech-ui-grid{grid-template-columns:1fr}}
      `}</style>

      <StudioUISection title={t[0]} subtitle={t[SHAPES.indexOf(shape) + 1]}>
        <StudioUITabs
          value={shape}
          ariaLabel={t[0]}
          items={SHAPES.map((item, index) => ({ value: item, label: t[index + 1] }))}
          onChange={setShape}
        />

        <div className="ss-speech-ui-grid">
          <StudioUINumber label={`${t[5]} (px)`} value={width} min={80} max={1600} onChange={setWidth} disabled={busy} />
          <StudioUINumber label={`${t[6]} (px)`} value={height} min={60} max={1200} onChange={setHeight} disabled={busy} />
          <StudioUINumber label={`${t[7]} (px)`} value={border} min={1} max={30} onChange={setBorder} disabled={busy} />
          <StudioUINumber label={`${t[18]} (px)`} value={fontSize} min={10} max={100} onChange={setFontSize} disabled={busy} />
        </div>

        <StudioUIColor label={t[8]} value={fill} disabled={busy} onChange={(next) => {
          if (/^#[0-9a-f]{6}$/i.test(next)) setFill(next)
        }} />
        <StudioUIColor label={t[9]} value={ink} disabled={busy} onChange={(next) => {
          if (/^#[0-9a-f]{6}$/i.test(next)) setInk(next)
        }} />
        <StudioUISlider label={t[10]} value={opacity} min={0} max={100} suffix="%" disabled={busy} onChange={setOpacity} />
        <StudioUISelect
          label={t[11]}
          value={tail}
          options={TAILS.map((item, index) => ({ value: item, label: t[index + 12] }))}
          disabled={busy}
          onChange={setTail}
        />

        <label className="ss-speech-ui-text">
          <span>{t[17]}</span>
          <textarea maxLength={1200} value={text} disabled={busy} onChange={(event) => setText(event.target.value)} />
        </label>
      </StudioUISection>

      <div className="ss-speech-ui-actions">
        <StudioUIButton variant="primary" icon="fa-solid fa-plus" disabled={unavailable} onClick={apply}>
          {busy ? t[20] : t[19]}
        </StudioUIButton>
        <p className={`ss-speech-ui-status ${error ? 'error' : ''}`} role={error ? 'alert' : 'status'}>{error || t[21]}</p>
      </div>
    </div>
  )
}
