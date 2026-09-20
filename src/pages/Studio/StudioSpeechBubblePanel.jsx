import { useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'

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
    try { await onApply({ shape, width, height, border, fill, ink, opacity, tail, text, fontSize }) }
    catch (reason) { setError(reason?.message || t[22]) }
    finally { setBusy(false) }
  }

  return (
    <section className="ss-speech-bubble" aria-label={t[0]}>
      <style>{`
        .shadow-studio .ss-speech-bubble{display:grid;gap:9px;min-width:0;color:#e5edf6;font-size:11px}
        .shadow-studio .ss-speech-bubble strong{font-size:12px}
        .shadow-studio .ss-speech-bubble label{display:grid;gap:4px;min-width:0}
        .shadow-studio .ss-speech-bubble .ss-bubble-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}
        .shadow-studio .ss-speech-bubble input:not([type=color]):not([type=range]),.shadow-studio .ss-speech-bubble select,.shadow-studio .ss-speech-bubble textarea{box-sizing:border-box;width:100%;min-width:0;padding:6px;border:1px solid #60758a;border-radius:4px;background:#24313e;color:#edf5ff;font:inherit}
        .shadow-studio .ss-speech-bubble input[type=color]{box-sizing:border-box;width:100%;height:30px;border:1px solid #60758a;border-radius:4px;background:#24313e}
        .shadow-studio .ss-speech-bubble input[type=range]{width:100%;accent-color:#82baff}
        .shadow-studio .ss-speech-bubble textarea{resize:vertical;min-height:55px;max-height:120px}
        .shadow-studio .ss-speech-bubble button{padding:7px;border:1px solid #7795b0;border-radius:5px;background:#385d7e;color:#f2f8ff;font:inherit;cursor:pointer}
        .shadow-studio .ss-speech-bubble button:disabled{opacity:.5;cursor:not-allowed}
        .shadow-studio .ss-speech-bubble p{margin:0;font-size:10px;line-height:1.5}
      `}</style>
      <strong>{t[0]}</strong>
      <label>{t[0]}<select value={shape} onChange={(event) => setShape(event.target.value)}>{SHAPES.map((item, index) => <option key={item} value={item}>{t[index + 1]}</option>)}</select></label>
      <div className="ss-bubble-grid">
        <label>{t[5]} (px)<input type="number" min="80" max="1600" value={width} onChange={(event) => setWidth(Number(event.target.value))} /></label>
        <label>{t[6]} (px)<input type="number" min="60" max="1200" value={height} onChange={(event) => setHeight(Number(event.target.value))} /></label>
        <label>{t[7]} (px)<input type="number" min="1" max="30" value={border} onChange={(event) => setBorder(Number(event.target.value))} /></label>
        <label>{t[18]} (px)<input type="number" min="10" max="100" value={fontSize} onChange={(event) => setFontSize(Number(event.target.value))} /></label>
        <label>{t[8]}<input type="color" value={fill} onChange={(event) => setFill(event.target.value)} /></label>
        <label>{t[9]}<input type="color" value={ink} onChange={(event) => setInk(event.target.value)} /></label>
      </div>
      <label>{t[10]}: {opacity}%<input type="range" min="0" max="100" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} /></label>
      <label>{t[11]}<select value={tail} onChange={(event) => setTail(event.target.value)}>{TAILS.map((item, index) => <option key={item} value={item}>{t[index + 12]}</option>)}</select></label>
      <label>{t[17]}<textarea maxLength={1200} value={text} onChange={(event) => setText(event.target.value)} /></label>
      <button type="button" disabled={unavailable} onClick={apply}>{busy ? t[20] : t[19]}</button>
      {disabled || !onApply ? <p>{t[21]}</p> : null}
      {error ? <p role="alert">{error}</p> : null}
    </section>
  )
}
