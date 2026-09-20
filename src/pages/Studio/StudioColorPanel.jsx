import { useEffect, useRef, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'

const STUDIO_TEXT = {
  "km": {
    "HEX copied": "បានចម្លង HEX",
    "Select the HEX field to copy it manually.": "សូមជ្រើសប្រអប់ HEX ដើម្បីចម្លងដោយដៃ។",
    "Color panel": "ផ្ទាំងពណ៌",
    "Current": "បច្ចុប្បន្ន",
    "Hide": "លាក់",
    "Picker": "ជ្រើសពណ៌",
    "Hue": "លំនាំពណ៌",
    "Saturation and brightness": "កម្រិតឆ្អែត និងពន្លឺពណ៌",
    "System color picker": "ឧបករណ៍ជ្រើសពណ៌ប្រព័ន្ធ",
    "Use previous color": "ប្រើពណ៌មុន",
    "Previous color": "ពណ៌មុន",
    "HEX / System picker": "HEX / ឧបករណ៍ជ្រើសពណ៌ប្រព័ន្ធ",
    "Previous": "មុន",
    "Copy HEX color": "ចម្លងកូដពណ៌ HEX",
    "Copy HEX": "ចម្លង HEX",
    "RGB / HSV numeric controls": "ការកំណត់ RGB / HSV ជាលេខ",
    "Opacity is controlled separately in Brush Settings.": "ភាពស្រអាប់ត្រូវកំណត់ដោយឡែកនៅ Brush Settings។",
    "Color palette": "ក្ដារពណ៌",
    "Use color": "ប្រើពណ៌",
    "My Palette": "ក្ដារពណ៌ខ្ញុំ",
    "Save color": "រក្សាទុកពណ៌",
    "My saved colors": "ពណ៌ដែលខ្ញុំបានរក្សាទុក",
    "Use saved color": "ប្រើពណ៌ដែលបានរក្សាទុក",
    "Remove saved color": "លុបពណ៌ដែលបានរក្សាទុក",
    "Choose a color, then save it here.": "ជ្រើសពណ៌មួយ រួចរក្សាទុកនៅទីនេះ។",
    "Recent Colors": "ពណ៌ដែលប្រើថ្មីៗ",
    "Clear": "សម្អាត",
    "Recently used colors": "ពណ៌ដែលទើបប្រើ",
    "Use recent color": "ប្រើពណ៌ថ្មីៗ",
    "Colors you pick will appear here.": "ពណ៌ដែលអ្នកជ្រើសនឹងបង្ហាញនៅទីនេះ។"
  },
  "zh": {
    "HEX copied": "已复制 HEX",
    "Select the HEX field to copy it manually.": "请选择 HEX 输入框手动复制。",
    "Color panel": "颜色面板",
    "Current": "当前",
    "Hide": "隐藏",
    "Picker": "选色器",
    "Hue": "色相",
    "Saturation and brightness": "饱和度与明度",
    "System color picker": "系统选色器",
    "Use previous color": "使用上一种颜色",
    "Previous color": "上一种颜色",
    "HEX / System picker": "HEX / 系统选色器",
    "Previous": "上一种",
    "Copy HEX color": "复制 HEX 色值",
    "Copy HEX": "复制 HEX",
    "RGB / HSV numeric controls": "RGB / HSV 数值控制",
    "Opacity is controlled separately in Brush Settings.": "不透明度在画笔设置中单独调整。",
    "Color palette": "调色板",
    "Use color": "使用颜色",
    "My Palette": "我的调色板",
    "Save color": "保存颜色",
    "My saved colors": "我保存的颜色",
    "Use saved color": "使用已保存的颜色",
    "Remove saved color": "移除已保存的颜色",
    "Choose a color, then save it here.": "选择颜色后在此保存。",
    "Recent Colors": "最近使用的颜色",
    "Clear": "清除",
    "Recently used colors": "最近使用的颜色",
    "Use recent color": "使用最近的颜色",
    "Colors you pick will appear here.": "您选择的颜色将显示在这里。"
  },
  "ja": {
    "HEX copied": "HEX をコピーしました",
    "Select the HEX field to copy it manually.": "HEX 欄を選んで手動でコピーしてください。",
    "Color panel": "カラーパネル",
    "Current": "現在",
    "Hide": "隠す",
    "Picker": "カラーピッカー",
    "Hue": "色相",
    "Saturation and brightness": "彩度と明度",
    "System color picker": "システムのカラーピッカー",
    "Use previous color": "前の色を使う",
    "Previous color": "前の色",
    "HEX / System picker": "HEX / システム選色",
    "Previous": "前の色",
    "Copy HEX color": "HEX カラーコードをコピー",
    "Copy HEX": "HEX をコピー",
    "RGB / HSV numeric controls": "RGB / HSV 数値設定",
    "Opacity is controlled separately in Brush Settings.": "不透明度はブラシ設定で別途調整します。",
    "Color palette": "カラーパレット",
    "Use color": "色を使う",
    "My Palette": "マイパレット",
    "Save color": "色を保存",
    "My saved colors": "保存した色",
    "Use saved color": "保存した色を使う",
    "Remove saved color": "保存した色を削除",
    "Choose a color, then save it here.": "色を選んでここに保存してください。",
    "Recent Colors": "最近使った色",
    "Clear": "クリア",
    "Recently used colors": "最近使った色",
    "Use recent color": "最近の色を使う",
    "Colors you pick will appear here.": "選んだ色はここに表示されます。"
  },
  "ko": {
    "HEX copied": "HEX 복사됨",
    "Select the HEX field to copy it manually.": "HEX 입력란을 선택하여 직접 복사하세요.",
    "Color panel": "색상 패널",
    "Current": "현재",
    "Hide": "숨기기",
    "Picker": "색상 선택기",
    "Hue": "색조",
    "Saturation and brightness": "채도 및 명도",
    "System color picker": "시스템 색상 선택기",
    "Use previous color": "이전 색상 사용",
    "Previous color": "이전 색상",
    "HEX / System picker": "HEX / 시스템 선택기",
    "Previous": "이전",
    "Copy HEX color": "HEX 색상 코드 복사",
    "Copy HEX": "HEX 복사",
    "RGB / HSV numeric controls": "RGB / HSV 수치 설정",
    "Opacity is controlled separately in Brush Settings.": "불투명도는 브러시 설정에서 별도로 조정합니다.",
    "Color palette": "색상 팔레트",
    "Use color": "색상 사용",
    "My Palette": "내 팔레트",
    "Save color": "색상 저장",
    "My saved colors": "저장한 색상",
    "Use saved color": "저장한 색상 사용",
    "Remove saved color": "저장한 색상 제거",
    "Choose a color, then save it here.": "색상을 선택한 다음 여기에 저장하세요.",
    "Recent Colors": "최근 사용한 색상",
    "Clear": "지우기",
    "Recently used colors": "최근 사용한 색상",
    "Use recent color": "최근 색상 사용",
    "Colors you pick will appear here.": "선택한 색상이 여기에 표시됩니다."
  }
}

function studioTranslate(language, text) {
  return STUDIO_TEXT[language]?.[text] || text
}

const FAVORITES_KEY = 'shadow-studio-color-favorites-v1'
const RECENTS_KEY = 'shadow-studio-color-recent-v1'

const PALETTE = [
  '#111111', '#374151', '#6B7280', '#D1D5DB', '#FFFFFF',
  '#EF4444', '#F97316', '#EAB308', '#22C55E', '#06B6D4',
  '#3B82F6', '#8B5CF6', '#EC4899', '#7F1D1D', '#78350F', '#172554',
]

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const validHex = (input) => /^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(input)
const fullHex = (input) => {
  const text = input.trim().toUpperCase()
  if (!validHex(text)) return null
  return text.length === 4
    ? `#${text[1]}${text[1]}${text[2]}${text[2]}${text[3]}${text[3]}`
    : text
}

export function hexToHsv(hex) {
  const normalized = fullHex(hex) || '#111111'
  const red = parseInt(normalized.slice(1, 3), 16) / 255
  const green = parseInt(normalized.slice(3, 5), 16) / 255
  const blue = parseInt(normalized.slice(5, 7), 16) / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min
  let hue = 0
  if (delta) {
    if (max === red) hue = ((green - blue) / delta) % 6
    else if (max === green) hue = (blue - red) / delta + 2
    else hue = (red - green) / delta + 4
    hue = (hue * 60 + 360) % 360
  }
  return { h: hue, s: max === 0 ? 0 : delta / max, v: max }
}

export function hsvToHex(hue, saturation, value) {
  const h = ((hue % 360) + 360) % 360
  const s = clamp(saturation, 0, 1)
  const v = clamp(value, 0, 1)
  const chroma = v * s
  const segment = h / 60
  const secondary = chroma * (1 - Math.abs((segment % 2) - 1))
  const offset = v - chroma
  const parts = segment < 1 ? [chroma, secondary, 0]
    : segment < 2 ? [secondary, chroma, 0]
      : segment < 3 ? [0, chroma, secondary]
        : segment < 4 ? [0, secondary, chroma]
          : segment < 5 ? [secondary, 0, chroma]
            : [chroma, 0, secondary]
  return `#${parts.map((channel) => Math.round((channel + offset) * 255).toString(16).padStart(2, '0')).join('')}`.toUpperCase()
}

function readColors(key, limit) {
  try {
    const stored = JSON.parse(window.localStorage.getItem(key) || '[]')
    if (!Array.isArray(stored)) return []
    return [...new Set(stored.map((item) => typeof item === 'string' ? fullHex(item) : null).filter(Boolean))].slice(0, limit)
  } catch {
    return []
  }
}

function hexToRgb(hex) {
  const safe = fullHex(hex) || '#111111'
  return [1, 3, 5].map((index) => parseInt(safe.slice(index, index + 2), 16))
}

function rgbToHex(channels) {
  return `#${channels.map((item) => clamp(Math.round(item), 0, 255).toString(16).padStart(2, '0')).join('')}`.toUpperCase()
}

export default function StudioColorPanel({ color, onChange, label = 'Color' }) {
  const [previous, setPrevious] = useState('#FFFFFF')
  const { language } = useDisplayTranslation()
  const tr = (text) => studioTranslate(language, text)
  const [hexText, setHexText] = useState(color.toUpperCase())
  const [expanded, setExpanded] = useState(false)
  const [favorites, setFavorites] = useState(() => readColors(FAVORITES_KEY, 12))
  const [recentColors, setRecentColors] = useState(() => readColors(RECENTS_KEY, 8))
  const [copyStatus, setCopyStatus] = useState('')
  const [selectedHue, setSelectedHue] = useState(() => hexToHsv(color).h)
  const [numericDraft, setNumericDraft] = useState({})
  const dragRef = useRef(null)
  const currentRef = useRef(color)
  currentRef.current = color

  useEffect(() => {
    setHexText(color.toUpperCase())
    setNumericDraft({})
    const next = hexToHsv(color)
    if (next.s > 0 && next.v > 0) setSelectedHue(next.h)
  }, [color])

  useEffect(() => {
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    } catch {
      return
    }
  }, [favorites])

  useEffect(() => {
    try {
      window.localStorage.setItem(RECENTS_KEY, JSON.stringify(recentColors))
    } catch {
      return
    }
  }, [recentColors])

  const hsv = hexToHsv(color)
  const activeHue = hsv.s > 0 && hsv.v > 0 ? hsv.h : selectedHue
  const rgb = hexToRgb(color)

  function rememberColor(nextColor) {
    const normalized = fullHex(nextColor)
    if (!normalized) return
    setRecentColors((current) => [normalized, ...current.filter((item) => item !== normalized)].slice(0, 8))
  }

  function addFavorite() {
    const normalized = fullHex(color)
    if (!normalized) return
    setFavorites((current) => current.includes(normalized) || current.length >= 12 ? current : [...current, normalized])
  }

  function removeFavorite(toRemove) {
    setFavorites((current) => current.filter((item) => item !== toRemove))
  }

  function clearRecentColors() {
    setRecentColors([])
  }

  function pick(nextColor) {
    const normalized = fullHex(nextColor)
    if (!normalized) return
    if (normalized !== currentRef.current.toUpperCase()) {
      setPrevious(currentRef.current.toUpperCase())
      onChange(normalized)
      rememberColor(normalized)
    }
  }

  function updateDrag(event, kind) {
    const rect = event.currentTarget.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    if (kind === 'hue') {
      const dx = event.clientX - rect.left - rect.width / 2
      const dy = event.clientY - rect.top - rect.height / 2
      const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 450) % 360
      setSelectedHue(angle)
      const next = hsvToHex(angle, hsv.s, hsv.v)
      if (dragRef.current) dragRef.current.color = next
      onChange(next)
    } else {
      const saturation = clamp((event.clientX - rect.left) / rect.width, 0, 1)
      const value = 1 - clamp((event.clientY - rect.top) / rect.height, 0, 1)
      const next = hsvToHex(activeHue, saturation, value)
      if (dragRef.current) dragRef.current.color = next
      onChange(next)
    }
  }

  function startDrag(event, kind) {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    event.preventDefault()
    setPrevious(currentRef.current.toUpperCase())
    dragRef.current = { id: event.pointerId, kind, color: currentRef.current }
    event.currentTarget.setPointerCapture?.(event.pointerId)
    updateDrag(event, kind)
  }

  function moveDrag(event, kind) {
    if (dragRef.current?.id !== event.pointerId || dragRef.current.kind !== kind) return
    event.preventDefault()
    updateDrag(event, kind)
  }

  function endDrag(event) {
    if (dragRef.current?.id !== event.pointerId) return
    const finalColor = dragRef.current.color
    dragRef.current = null
    rememberColor(finalColor)
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  function applyHex() {
    const next = fullHex(hexText.startsWith('#') ? hexText : `#${hexText}`)
    if (next) pick(next)
    else setHexText(color.toUpperCase())
  }

  function changeNumeric(key, text, onValid) {
    setNumericDraft((current) => ({ ...current, [key]: text }))
    if (text.trim() === '') return
    const value = Number(text)
    if (Number.isFinite(value)) onValid(value)
  }

  function updateRgb(channel, text) {
    changeNumeric(`rgb-${channel}`, text, (value) => {
      const next = [...rgb]
      next[channel] = clamp(Math.round(value), 0, 255)
      pick(rgbToHex(next))
    })
  }

  function updateHsv(channel, text) {
    changeNumeric(`hsv-${channel}`, text, (value) => {
      const h = channel === 'h' ? clamp(Math.round(value), 0, 359) : activeHue
      if (channel === 'h') setSelectedHue(h)
      const saturation = channel === 's' ? clamp(value, 0, 100) / 100 : hsv.s
      const brightness = channel === 'v' ? clamp(value, 0, 100) / 100 : hsv.v
      pick(hsvToHex(h, saturation, brightness))
    })
  }

  async function copyHex() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText((fullHex(color) || '#111111').toUpperCase())
      setCopyStatus(tr('HEX copied'))
    } catch {
      setCopyStatus(tr('Select the HEX field to copy it manually.'))
    }
  }

  return (
    <section className="ss-section ss-color-panel" data-mobile-open={expanded} aria-label={tr('Color panel')}>
      <style>{`
        .ss-color-panel{min-width:0}
        .ss-color-heading{display:flex;align-items:center;gap:8px;margin-bottom:10px}
        .ss-color-heading .ss-label{margin:0;flex:1}
        .ss-color-current{display:block;width:29px;height:24px;border:1px solid #8993a0;border-radius:4px;flex:none}
        .ss-color-expand{border:1px solid #515a65;border-radius:5px;background:#343a42;color:#ebf1f7;font:inherit;font-size:10px;height:28px;padding:0 8px;cursor:pointer}
        .ss-color-advanced{display:flex;flex-direction:column;align-items:center;gap:10px;margin-bottom:12px}
        .ss-hue-wheel{width:min(100%,184px);aspect-ratio:1;border:0;border-radius:50%;padding:13px;background:conic-gradient(#ff0000,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000);position:relative;touch-action:none;cursor:crosshair;flex:none}
        .ss-hue-wheel::after{content:'';position:absolute;inset:13px;border-radius:50%;background:#292c30;pointer-events:none}
        .ss-hue-marker{position:absolute;left:50%;top:50%;width:13px;height:13px;border:2px solid white;border-radius:50%;box-shadow:0 0 0 1px #202225,0 2px 4px #0009;pointer-events:none;z-index:2;transform:translate(-50%,-50%)}
        .ss-sv-square{width:min(100%,130px);aspect-ratio:1;position:absolute;inset:50% auto auto 50%;transform:translate(-50%,-50%);z-index:1;cursor:crosshair;touch-action:none;border:1px solid #9aa2ab;background:linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,transparent),hsl(var(--ss-hue) 100% 50%)}
        .ss-sv-marker{position:absolute;width:12px;height:12px;border:2px solid #fff;border-radius:50%;transform:translate(-50%,-50%);box-shadow:0 0 0 1px #131619,0 1px 3px #0008;pointer-events:none}
        .ss-color-values{display:grid;grid-template-columns:minmax(0,1fr) 34px 34px;gap:6px;width:100%;align-items:center}
        .ss-color-hex{min-width:0;height:34px;border:1px solid #58636e;border-radius:5px;background:#202429;color:#eef2f7;font:inherit;font-size:12px;padding:0 8px;letter-spacing:.035em}
        .ss-color-native{display:block;width:34px;height:34px;border:1px solid #697582;border-radius:5px;background:transparent;padding:2px;cursor:pointer}
        .ss-color-previous{display:block;width:34px;height:34px;border:1px solid #697582;border-radius:5px;cursor:pointer}
        .ss-color-legend{width:100%;display:flex;justify-content:space-between;gap:8px;font-size:9px;color:#aeb7c1}
        .ss-color-copy{min-height:30px;width:100%;border:1px solid #596b7e;border-radius:5px;background:#35495e;color:#e9f4ff;font:inherit;font-size:10px;cursor:pointer}
        .ss-color-copy-status{margin:0;width:100%;font-size:10px;line-height:1.4;color:#c3d8eb}
        .ss-color-numeric{width:100%;min-width:0;border:1px solid #475460;border-radius:6px;background:#272c32;padding:7px}
        .ss-color-numeric summary{cursor:pointer;list-style:revert;font-size:10px;font-weight:800;color:#e1ebf6}
        .ss-color-numeric-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:10px}
        .ss-color-number{display:grid;gap:4px;min-width:0;color:#b9c7d5;font-size:10px;font-weight:800}
        .ss-color-number input{box-sizing:border-box;min-width:0;width:100%;height:32px;border:1px solid #586775;border-radius:4px;background:#1d242a;color:#f1f5fa;padding:0 5px;font:inherit;font-size:12px}
        .ss-color-number input:focus-visible{outline:2px solid #75bdff;outline-offset:1px}
        .ss-color-numeric-title{grid-column:1/-1;font-size:10px;font-weight:700;color:#a8b9cb}
        .ss-color-numeric-help{margin:8px 0 0;font-size:9px;line-height:1.4;color:#a9b7c6}
        .ss-color-panel .ss-swatches{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin-top:8px}
        .ss-color-panel .ss-swatch{width:100%;min-width:0;aspect-ratio:1;border:1px solid #596068;border-radius:5px;cursor:pointer}
        .ss-color-panel .ss-swatch.selected{outline:2px solid #eef4fb;outline-offset:1px}
        .ss-color-extra{width:100%;min-width:0;margin-top:13px;display:grid;gap:12px}
        .ss-color-group{min-width:0}
        .ss-color-group-head{display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:7px;color:#cad3dd;font-size:10px}
        .ss-color-fav-add{min-height:26px;border:1px solid #586775;border-radius:5px;background:#373f48;color:#f0f6fc;padding:2px 8px;font:inherit;font-size:10px;cursor:pointer}
        .ss-color-fav-add:disabled{opacity:.4;cursor:default}
        .ss-color-items{display:flex;flex-wrap:wrap;align-items:center;gap:7px}
        .ss-color-favorite{position:relative;width:35px;height:35px;flex:none}
        .ss-color-favorite .ss-color-fav-pick{width:35px;height:35px;border:1px solid #6b7886;border-radius:5px;cursor:pointer}
        .ss-color-fav-remove{position:absolute;right:-5px;top:-6px;display:grid;place-items:center;width:17px;height:17px;border:1px solid #626e7b;border-radius:50%;background:#30363e;color:#fff;font:inherit;font-size:12px;line-height:1;cursor:pointer}
        .ss-color-recent-pick{height:32px;width:32px;border:1px solid #687583;border-radius:5px;cursor:pointer}
        .ss-color-empty{margin:0;font-size:10px;color:#a1afbc;line-height:1.5}
        @media(max-width:900px),(max-width:1100px) and (max-height:650px) and (orientation:landscape){
          .shadow-studio .ss-side .ss-color-panel{display:flex;flex:1 1 100%;min-width:0;flex-wrap:wrap;align-items:center;gap:6px;margin:0;padding:0;border:0}
          .shadow-studio .ss-color-panel .ss-color-heading{flex:0 0 auto;margin:0;gap:5px}
          .shadow-studio .ss-color-panel .ss-color-heading .ss-label{font-size:10px}
          .shadow-studio .ss-color-panel .ss-color-expand{display:block}
          .shadow-studio .ss-color-panel .ss-color-current{width:26px;height:26px}
          .shadow-studio .ss-color-panel .ss-swatches{display:flex;flex:1 1 75px;min-width:0;overflow-x:auto;gap:6px;margin:0;padding:3px 2px;overscroll-behavior-x:contain}
          .shadow-studio .ss-color-panel .ss-swatch{flex:0 0 29px;width:29px;height:29px;min-width:29px;aspect-ratio:1}
          .shadow-studio .ss-color-panel .ss-color-advanced{display:none;width:100%;flex:1 1 100%;margin:4px 0 6px;gap:8px}
          .shadow-studio .ss-color-panel[data-mobile-open='true'] .ss-color-advanced{display:flex}
          .shadow-studio .ss-color-panel .ss-hue-wheel{width:min(100%,175px)}
          .shadow-studio .ss-color-panel .ss-color-extra{display:none;flex:1 1 100%;margin:5px 0 8px}
          .shadow-studio .ss-color-panel[data-mobile-open='true'] .ss-color-extra{display:grid}
        }
      `}</style>
      <div className="ss-color-heading">
        <h2 className="ss-label">{label}</h2>
        <span className="ss-color-current" style={{ backgroundColor: color }} title={`${tr('Current')}: ${color}`} />
        <button type="button" className="ss-color-expand" aria-expanded={expanded} onClick={() => setExpanded((open) => !open)}>{expanded ? tr('Hide') : tr('Picker')}</button>
      </div>
      <div className="ss-color-advanced">
        <div className="ss-hue-wheel" role="slider" tabIndex={0} aria-label={tr('Hue')} aria-valuemin={0} aria-valuemax={359} aria-valuenow={Math.round(hsv.h)}
          onPointerDown={(event) => startDrag(event, 'hue')}
          onPointerMove={(event) => moveDrag(event, 'hue')}
          onPointerUp={endDrag} onPointerCancel={endDrag}
          onKeyDown={(event) => {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
            event.preventDefault()
            const nextHue = (activeHue + (event.key === 'ArrowRight' ? 1 : -1) + 360) % 360
             setSelectedHue(nextHue)
             pick(hsvToHex(nextHue, hsv.s, hsv.v))
          }}>
          <span className="ss-hue-marker" style={{ left: `${50 + 45 * Math.sin(activeHue * Math.PI / 180)}%`, top: `${50 - 45 * Math.cos(activeHue * Math.PI / 180)}%` }} />
          <div className="ss-sv-square" role="group" aria-label={tr('Saturation and brightness')} style={{ '--ss-hue': activeHue }}
            onPointerDown={(event) => { event.stopPropagation(); startDrag(event, 'sv') }}
            onPointerMove={(event) => { event.stopPropagation(); moveDrag(event, 'sv') }}
            onPointerUp={(event) => { event.stopPropagation(); endDrag(event) }}
            onPointerCancel={(event) => { event.stopPropagation(); endDrag(event) }}>
            <span className="ss-sv-marker" style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%` }} />
          </div>
        </div>
        <div className="ss-color-values">
          <input className="ss-color-hex" type="text" maxLength={7} spellCheck={false} aria-label="HEX color" value={hexText} onChange={(event) => setHexText(event.target.value)} onBlur={applyHex} onKeyDown={(event) => { if (event.key === 'Enter') event.currentTarget.blur(); if (event.key === 'Escape') { setHexText(color.toUpperCase()); event.currentTarget.blur() } }} />
          <input className="ss-color-native" type="color" title={tr('System color picker')} aria-label={tr('System color picker')} value={color} onChange={(event) => pick(event.target.value)} />
          <button type="button" className="ss-color-previous" style={{ backgroundColor: previous }} title={`${tr('Use previous color')} ${previous}`} aria-label={`${tr('Previous color')} ${previous}`} onClick={() => pick(previous)} />
        </div>
        <div className="ss-color-legend"><span>{tr('HEX / System picker')}</span><span>{tr('Previous')}</span></div>
        <button type="button" className="ss-color-copy" onClick={copyHex} aria-label={`${tr('Copy HEX color')} ${color}`}>{tr('Copy HEX')} · {color.toUpperCase()}</button>
        {copyStatus ? <p className="ss-color-copy-status" role="status">{copyStatus}</p> : null}
        <details className="ss-color-numeric">
          <summary>{tr('RGB / HSV numeric controls')}</summary>
          <div className="ss-color-numeric-grid">
            <div className="ss-color-numeric-title">RGB · 0–255</div>
            {['R', 'G', 'B'].map((label, channel) => (
              <label className="ss-color-number" key={label}>{label}
                <input type="number" min="0" max="255" step="1" inputMode="numeric" aria-label={`${label} channel`} value={numericDraft[`rgb-${channel}`] ?? rgb[channel]} onChange={(event) => updateRgb(channel, event.target.value)} onBlur={() => setNumericDraft((current) => { const next = { ...current }; delete next[`rgb-${channel}`]; return next })} />
              </label>
            ))}
            <div className="ss-color-numeric-title">HSV · Hue 0–359° / Saturation &amp; Value 0–100%</div>
            {[
              { label: 'H', key: 'h', value: Math.round(activeHue), max: 359 },
              { label: 'S', key: 's', value: Math.round(hsv.s * 100), max: 100 },
              { label: 'V', key: 'v', value: Math.round(hsv.v * 100), max: 100 },
            ].map((field) => (
              <label className="ss-color-number" key={field.key}>{field.label}
                <input type="number" min="0" max={field.max} step="1" inputMode="numeric" aria-label={`${field.label} HSV channel`} value={numericDraft[`hsv-${field.key}`] ?? field.value} onChange={(event) => updateHsv(field.key, event.target.value)} onBlur={() => setNumericDraft((current) => { const next = { ...current }; delete next[`hsv-${field.key}`]; return next })} />
              </label>
            ))}
          </div>
          <p className="ss-color-numeric-help">{tr('Opacity is controlled separately in Brush Settings.')}</p>
        </details>
      </div>
      <div className="ss-swatches" aria-label={tr('Color palette')}>
        {PALETTE.map((swatch) => <button key={swatch} type="button" className={`ss-swatch ${color.toUpperCase() === swatch ? 'selected' : ''}`} style={{ backgroundColor: swatch }} title={swatch} aria-label={`${tr('Use color')} ${swatch}`} onClick={() => pick(swatch)} />)}
      </div>
      <div className="ss-color-extra">
        <div className="ss-color-group">
          <div className="ss-color-group-head">
            <strong>{tr('My Palette')} · {favorites.length}/12</strong>
            <button type="button" className="ss-color-fav-add" disabled={favorites.length >= 12 || favorites.includes(color.toUpperCase())} onClick={addFavorite} aria-label={`${tr('Save color')} ${color}`}>+ {tr('Save color')}</button>
          </div>
          {favorites.length ? (
            <div className="ss-color-items" aria-label={tr('My saved colors')}>
              {favorites.map((favorite) => (
                <div key={favorite} className="ss-color-favorite">
                  <button type="button" className="ss-color-fav-pick" style={{ backgroundColor: favorite }} title={`Use ${favorite}`} aria-label={`${tr('Use saved color')} ${favorite}`} onClick={() => pick(favorite)} />
                  <button type="button" className="ss-color-fav-remove" title={`Remove ${favorite}`} aria-label={`${tr('Remove saved color')} ${favorite}`} onClick={() => removeFavorite(favorite)}>×</button>
                </div>
              ))}
            </div>
          ) : <p className="ss-color-empty">{tr('Choose a color, then save it here.')}</p>}
        </div>
        <div className="ss-color-group">
          <div className="ss-color-group-head"><strong>{tr('Recent Colors')}</strong><button type="button" className="ss-color-fav-add" disabled={!recentColors.length} onClick={clearRecentColors}>{tr('Clear')}</button></div>
          {recentColors.length ? (
            <div className="ss-color-items" aria-label={tr('Recently used colors')}>
              {recentColors.map((recent) => <button key={recent} type="button" className="ss-color-recent-pick" style={{ backgroundColor: recent }} title={`Use ${recent}`} aria-label={`${tr('Use recent color')} ${recent}`} onClick={() => pick(recent)} />)}
            </div>
          ) : <p className="ss-color-empty">{tr('Colors you pick will appear here.')}</p>}
        </div>
      </div>
    </section>
  )
}
