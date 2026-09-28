import { useState } from 'react'
import StudioPrecisionInput from './StudioPrecisionInput'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { BRUSH_STYLES } from './StudioBrushEngine'

const STUDIO_TEXT = {
  "km": {
    "Fine line": "បន្ទាត់ស្ដើង",
    "Light sketch": "គំនូរព្រាងស្រាល",
    "Ink line": "បន្ទាត់ទឹកខ្មៅ",
    "Soft stroke": "ជក់ទន់",
    "Wide marker": "ម៉ាកឺធំ",
    "Bold line": "បន្ទាត់ក្រាស់",
    "Round": "មូល",
    "Pencil": "ខ្មៅដៃ",
    "Marker": "ម៉ាកឺ",
    "Airbrush": "ជក់បាញ់ពណ៌",
    "Could not save changes to browser storage. Your current brush still works.": "មិនអាចរក្សាទុកការកែប្រែក្នុង Browser បានទេ។ ជក់បច្ចុប្បន្ននៅប្រើបានធម្មតា។",
    "Enter a preset name first.": "សូមបញ្ចូលឈ្មោះ Preset ជាមុន។",
    "A preset with this name already exists. Choose another name.": "មាន Preset ឈ្មោះនេះរួចហើយ។ សូមជ្រើសឈ្មោះផ្សេង។",
    "My Presets is full. Remove one before saving another.": "My Presets ពេញហើយ។ សូមលុបមួយមុនរក្សាទុកថ្មី។",
    "Preset saved in this browser.": "បានរក្សាទុក Preset ក្នុង Browser នេះ។",
    "Delete brush preset": "លុប Brush Preset",
    "Preset removed.": "បានលុប Preset។",
    "Brush tip": "ក្បាលជក់",
    "Brush tip style": "ប្រភេទក្បាលជក់",
    "Quick presets": "Preset រហ័ស",
    "Brush size and opacity presets": "Preset ទំហំ និងភាពស្រអាប់របស់ជក់",
    "My Presets": "Preset របស់ខ្ញុំ",
    "Preset name": "ឈ្មោះ Preset",
    "New brush preset name": "ឈ្មោះ Brush Preset ថ្មី",
    "Save": "រក្សាទុក",
    "My brush presets": "Brush Preset របស់ខ្ញុំ",
    "Use": "ប្រើ",
    "Remove": "លុប",
    "Brush settings": "ការកំណត់ជក់",
    "Brush size": "ទំហំជក់",
    "Brush opacity": "ភាពស្រអាប់របស់ជក់",
    "Brush": "ជក់",
    "tip": "ក្បាលជក់",
    "pixels": "ភីកសែល",
    "percent opacity": "ភាគរយភាពស្រអាប់"
  },
  "zh": {
    "Fine line": "细线",
    "Light sketch": "淡草稿",
    "Ink line": "墨线",
    "Soft stroke": "柔和笔触",
    "Wide marker": "宽头马克笔",
    "Bold line": "粗线",
    "Round": "圆头",
    "Pencil": "铅笔",
    "Marker": "马克笔",
    "Airbrush": "喷枪",
    "Could not save changes to browser storage. Your current brush still works.": "无法保存到浏览器存储，但当前画笔仍可使用。",
    "Enter a preset name first.": "请先输入预设名称。",
    "A preset with this name already exists. Choose another name.": "同名预设已存在，请使用其他名称。",
    "My Presets is full. Remove one before saving another.": "个人预设已满，请先删除一个。",
    "Preset saved in this browser.": "预设已保存在当前浏览器。",
    "Delete brush preset": "删除画笔预设",
    "Preset removed.": "预设已删除。",
    "Brush tip": "笔尖",
    "Brush tip style": "笔尖样式",
    "Quick presets": "快捷预设",
    "Brush size and opacity presets": "画笔大小及不透明度预设",
    "My Presets": "我的预设",
    "Preset name": "预设名称",
    "New brush preset name": "新画笔预设名称",
    "Save": "保存",
    "My brush presets": "我的画笔预设",
    "Use": "使用",
    "Remove": "移除",
    "Brush settings": "画笔设置",
    "Brush size": "画笔大小",
    "Brush opacity": "画笔不透明度",
    "Brush": "画笔",
    "tip": "笔尖",
    "pixels": "像素",
    "percent opacity": "不透明度百分比"
  },
  "ja": {
    "Fine line": "細線",
    "Light sketch": "薄いスケッチ",
    "Ink line": "インク線",
    "Soft stroke": "柔らかい線",
    "Wide marker": "太いマーカー",
    "Bold line": "太線",
    "Round": "丸",
    "Pencil": "鉛筆",
    "Marker": "マーカー",
    "Airbrush": "エアブラシ",
    "Could not save changes to browser storage. Your current brush still works.": "ブラウザーに保存できませんでした。現在のブラシは引き続き使用できます。",
    "Enter a preset name first.": "先にプリセット名を入力してください。",
    "A preset with this name already exists. Choose another name.": "同じ名前のプリセットがあります。別の名前を選んでください。",
    "My Presets is full. Remove one before saving another.": "保存済みプリセットが上限です。追加する前に一つ削除してください。",
    "Preset saved in this browser.": "プリセットをこのブラウザーに保存しました。",
    "Delete brush preset": "ブラシプリセットを削除",
    "Preset removed.": "プリセットを削除しました。",
    "Brush tip": "ブラシ先端",
    "Brush tip style": "ブラシ先端の種類",
    "Quick presets": "クイックプリセット",
    "Brush size and opacity presets": "ブラシサイズと不透明度のプリセット",
    "My Presets": "マイプリセット",
    "Preset name": "プリセット名",
    "New brush preset name": "新しいブラシプリセット名",
    "Save": "保存",
    "My brush presets": "保存済みブラシプリセット",
    "Use": "使う",
    "Remove": "削除",
    "Brush settings": "ブラシ設定",
    "Brush size": "ブラシサイズ",
    "Brush opacity": "ブラシの不透明度",
    "Brush": "ブラシ",
    "tip": "先端",
    "pixels": "ピクセル",
    "percent opacity": "不透明度（％）"
  },
  "ko": {
    "Fine line": "가는 선",
    "Light sketch": "연한 스케치",
    "Ink line": "잉크 선",
    "Soft stroke": "부드러운 터치",
    "Wide marker": "넓은 마커",
    "Bold line": "굵은 선",
    "Round": "둥근 브러시",
    "Pencil": "연필",
    "Marker": "마커",
    "Airbrush": "에어브러시",
    "Could not save changes to browser storage. Your current brush still works.": "브라우저 저장소에 변경 사항을 저장할 수 없습니다. 현재 브러시는 계속 사용할 수 있습니다.",
    "Enter a preset name first.": "먼저 프리셋 이름을 입력하세요.",
    "A preset with this name already exists. Choose another name.": "같은 이름의 프리셋이 있습니다. 다른 이름을 선택하세요.",
    "My Presets is full. Remove one before saving another.": "내 프리셋이 가득 찼습니다. 새 프리셋을 저장하기 전에 하나를 삭제하세요.",
    "Preset saved in this browser.": "이 브라우저에 프리셋을 저장했습니다.",
    "Delete brush preset": "브러시 프리셋 삭제",
    "Preset removed.": "프리셋을 삭제했습니다.",
    "Brush tip": "브러시 팁",
    "Brush tip style": "브러시 팁 유형",
    "Quick presets": "빠른 프리셋",
    "Brush size and opacity presets": "브러시 크기 및 불투명도 프리셋",
    "My Presets": "내 프리셋",
    "Preset name": "프리셋 이름",
    "New brush preset name": "새 브러시 프리셋 이름",
    "Save": "저장",
    "My brush presets": "내 브러시 프리셋",
    "Use": "사용",
    "Remove": "제거",
    "Brush settings": "브러시 설정",
    "Brush size": "브러시 크기",
    "Brush opacity": "브러시 불투명도",
    "Brush": "브러시",
    "tip": "팁",
    "pixels": "픽셀",
    "percent opacity": "불투명도 비율"
  }
}

function studioTranslate(language, text) {
  return STUDIO_TEXT[language]?.[text] || text
}

const STORAGE_KEY = 'shadow-studio-brush-presets-v1'
const MAX_SAVED = 10

const BUILT_IN = [
  { id: 'fine', style: 'pencil', name: 'Fine line', size: 2, opacity: 100 },
  { id: 'sketch', style: 'pencil', name: 'Light sketch', size: 3, opacity: 45 },
  { id: 'ink', style: 'round', name: 'Ink line', size: 7, opacity: 100 },
  { id: 'soft', style: 'airbrush', name: 'Soft stroke', size: 12, opacity: 50 },
  { id: 'marker', style: 'marker', name: 'Wide marker', size: 26, opacity: 65 },
  { id: 'bold', style: 'round', name: 'Bold line', size: 48, opacity: 100 },
]

const clamp = (value, min, max) => Math.min(max, Math.max(min, Math.round(Number(value) || min)))
const clampBrush = (value) => Math.round(Math.min(5000, Math.max(0.1, Number(value) || 0.1)) * 10) / 10

function readSaved() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
    if (!Array.isArray(stored)) return []
    return stored.filter((item) => item && typeof item.name === 'string' && item.name.trim())
      .slice(0, MAX_SAVED)
      .map((item, index) => ({
        id: String(item.id || `saved-${index}`),
        name: item.name.trim().slice(0, 22),
        style: BRUSH_STYLES.some((option) => option.id === item.style) ? item.style : 'round',
        size: clampBrush(item.size),
        opacity: clamp(item.opacity, 10, 100),
      }))
  } catch {
    return []
  }
}

export default function StudioBrushSettings({ size, onSizeChange, style = 'round', onStyleChange = () => {}, opacity, onOpacityChange, labels }) {
  const [saved, setSaved] = useState(readSaved)
  const { language } = useDisplayTranslation()
  const tr = (text) => studioTranslate(language, text)
  const [name, setName] = useState('')
  const [notice, setNotice] = useState('')

  function persist(next) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      setSaved(next)
      return true
    } catch {
      setNotice(tr('Could not save changes to browser storage. Your current brush still works.'))
      return false
    }
  }

  function applyPreset(preset) {
    onStyleChange(preset.style || 'round')
    onSizeChange(preset.size)
    onOpacityChange(preset.opacity)
  }

  function savePreset() {
    const cleanName = name.trim().slice(0, 22)
    if (!cleanName) {
      setNotice(tr('Enter a preset name first.'))
      return
    }
    if (saved.some((preset) => preset.name.toLocaleLowerCase() === cleanName.toLocaleLowerCase())) {
      setNotice(tr('A preset with this name already exists. Choose another name.'))
      return
    }
    if (saved.length >= MAX_SAVED) {
      setNotice(tr('My Presets is full. Remove one before saving another.'))
      return
    }
    const next = [...saved, {
      id: globalThis.crypto?.randomUUID?.() || `brush-${Date.now()}-${Math.random()}`,
      name: cleanName,
      style: BRUSH_STYLES.some((option) => option.id === style) ? style : 'round',
      size: clampBrush(size),
      opacity: clamp(opacity, 10, 100),
    }]
    if (!persist(next)) return
    setName('')
    setNotice(tr('Preset saved in this browser.'))
  }

  function deletePreset(id) {
    const target = saved.find((item) => item.id === id)
    if (!target || !window.confirm(`${tr('Delete brush preset')} “${target.name}”?`)) return
    if (persist(saved.filter((item) => item.id !== id))) setNotice(tr('Preset removed.'))
  }

  function presetOptions() {
    return (
      <>
        <div className="ss-brush-heading">{tr('Brush tip')}</div>
        <div className="ss-brush-styles" role="group" aria-label={tr('Brush tip style')}>
          {BRUSH_STYLES.map((option) => (
            <button key={option.id} type="button" className={`ss-brush-style ${style === option.id ? 'active' : ''}`} onClick={() => onStyleChange(option.id)} aria-pressed={style === option.id} title={tr(option.description)}>
              <span className={`ss-brush-style-icon ss-brush-style-${option.id}`} aria-hidden="true" />
              <span>{tr(option.label)}</span>
            </button>
          ))}
        </div>
        <div className="ss-brush-heading">{tr('Quick presets')}</div>
        <div className="ss-brush-presets" role="group" aria-label={tr('Brush size and opacity presets')}>
          {BUILT_IN.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={`ss-brush-preset ${style === preset.style && size === preset.size && opacity === preset.opacity ? 'active' : ''}`}
              onClick={() => applyPreset(preset)}
              aria-label={`${tr(preset.name)}: ${tr(preset.style)} ${tr('tip')}, ${preset.size} ${tr('pixels')}, ${preset.opacity} ${tr('percent opacity')}`}
            >
              <svg className="ss-brush-preset-preview" viewBox="0 0 46 22" aria-hidden="true">
                <path d="M5 15 C15 5 28 17 41 7" fill="none" stroke="currentColor" strokeWidth={Math.min(9, Math.max(1.4, preset.size / 6))} strokeLinecap={preset.style === 'marker' ? 'square' : 'round'} opacity={preset.opacity / 100} />
              </svg>
              <span className="ss-brush-preset-name">{tr(preset.name)}</span>
              <small>{preset.size}px · {preset.opacity}%</small>
            </button>
          ))}
        </div>
        <div className="ss-brush-heading ss-brush-saved-heading">{tr('My Presets')} · {saved.length}/{MAX_SAVED}</div>
        <div className="ss-brush-save-row">
          <input
            type="text"
            maxLength={22}
            value={name}
            placeholder={tr('Preset name')}
            aria-label={tr('New brush preset name')}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); savePreset() } }}
          />
          <button type="button" onClick={savePreset} disabled={saved.length >= MAX_SAVED}>{tr('Save')}</button>
        </div>
        {saved.length ? (
          <div className="ss-brush-saved" role="group" aria-label={tr('My brush presets')}>
            {saved.map((preset) => (
              <div className="ss-brush-saved-item" key={preset.id}>
                <button type="button" className="ss-brush-saved-use" onClick={() => applyPreset(preset)} title={`${tr('Use')} ${preset.name}`}>
                  <span>{preset.name}</span><small>{preset.style} · {preset.size}px · {preset.opacity}%</small>
                </button>
                <button type="button" className="ss-brush-saved-remove" onClick={() => deletePreset(preset.id)} title={`${tr('Remove')} ${preset.name}`} aria-label={`${tr('Remove')} ${preset.name}`}>×</button>
              </div>
            ))}
          </div>
        ) : null}
        {notice ? <p className="ss-brush-notice" role="status">{notice}</p> : null}
      </>
    )
  }

  return (
    <>
      <section className="ss-section ss-brush-settings" aria-label={tr('Brush settings')}>
        <style>{`
          .ss-brush-settings{
            --ss-brush-bg:#20262d;
            --ss-brush-panel:#29313a;
            --ss-brush-panel-2:#313b46;
            --ss-brush-line:#4b5968;
            --ss-brush-line-soft:#3b4651;
            --ss-brush-text:#edf3fa;
            --ss-brush-muted:#aab8c6;
            --ss-brush-blue:#5faeff;
            --ss-brush-blue-soft:#355d84;
            min-width:0;
            color:var(--ss-brush-text);
            font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif
          }
          .ss-brush-settings .ss-label,.ss-brush-opacity .ss-label{color:#dce7f2;font-size:10px;font-weight:800;letter-spacing:.01em}
          .ss-brush-current-preview{display:flex;align-items:center;justify-content:center;min-height:82px;margin:0 0 13px;border:1px solid var(--ss-brush-line);border-radius:8px;background:linear-gradient(180deg,#242d36,#1b2229);box-shadow:inset 0 0 0 1px #ffffff08}
          .ss-brush-current-preview svg{display:block;width:100%;max-width:166px;height:55px;color:#f4f7fc;filter:drop-shadow(0 1px 2px #0008)}
          .ss-brush-settings .ss-range,.ss-brush-opacity .ss-range{display:flex;align-items:center;gap:8px}
          .ss-brush-settings .ss-range input[type="range"],.ss-brush-opacity .ss-range input[type="range"]{flex:1;min-width:52px;height:20px;margin:0;appearance:none;background:transparent;cursor:pointer}
          .ss-brush-settings .ss-range input[type="range"]::-webkit-slider-runnable-track,.ss-brush-opacity .ss-range input[type="range"]::-webkit-slider-runnable-track{height:4px;border-radius:99px;background:#171d23;box-shadow:inset 0 0 0 1px #4b5968}
          .ss-brush-settings .ss-range input[type="range"]::-webkit-slider-thumb,.ss-brush-opacity .ss-range input[type="range"]::-webkit-slider-thumb{width:15px;height:15px;margin-top:-5.5px;appearance:none;border:2px solid #e5f2ff;border-radius:50%;background:var(--ss-brush-blue);box-shadow:0 1px 5px #0008}
          .ss-brush-settings .ss-range input[type="range"]::-moz-range-track,.ss-brush-opacity .ss-range input[type="range"]::-moz-range-track{height:4px;border:1px solid #4b5968;border-radius:99px;background:#171d23}
          .ss-brush-settings .ss-range input[type="range"]::-moz-range-thumb,.ss-brush-opacity .ss-range input[type="range"]::-moz-range-thumb{width:13px;height:13px;border:2px solid #e5f2ff;border-radius:50%;background:var(--ss-brush-blue);box-shadow:0 1px 5px #0008}
          .ss-brush-settings .ss-range input[type="range"]:focus-visible,.ss-brush-opacity .ss-range input[type="range"]:focus-visible{outline:2px solid var(--ss-brush-blue);outline-offset:3px}
          .ss-brush-settings .ss-value,.ss-brush-opacity .ss-value{min-width:28px;color:var(--ss-brush-muted);font-size:9px;font-weight:700;text-align:right}
          .ss-brush-styles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px;margin:8px 0 12px}
          .ss-brush-style{display:flex;min-width:0;align-items:center;gap:7px;min-height:38px;border:1px solid var(--ss-brush-line);border-radius:7px;background:var(--ss-brush-panel-2);color:#eaf0f6;padding:5px 7px;font:inherit;font-size:10px;font-weight:800;cursor:pointer;transition:120ms ease}
          .ss-brush-style:hover:not(:disabled){border-color:#74879a;background:#3b4855}
          .ss-brush-style.active,.ss-brush-style:focus-visible{outline:none;border-color:#79bcff;background:var(--ss-brush-blue-soft);box-shadow:inset 0 0 0 1px #6ba9df}
          .ss-brush-style-icon{display:inline-block;flex:none;width:14px;height:14px;border-radius:50%;background:#eaf0f6;box-shadow:0 1px 3px #0006}
          .ss-brush-style-pencil{width:3px;height:14px;border-radius:2px;transform:rotate(35deg)}
          .ss-brush-style-marker{width:16px;height:7px;border-radius:2px;transform:rotate(-35deg)}
          .ss-brush-style-airbrush{width:18px;height:18px;background:radial-gradient(circle,#eaf0f6 0%,rgba(234,240,246,.6) 28%,transparent 72%)}
          .ss-brush-presets{display:grid;grid-template-columns:minmax(0,1fr);gap:4px;margin:8px 0 10px}
          .ss-brush-heading{margin-top:14px;padding-bottom:4px;border-bottom:1px solid var(--ss-brush-line-soft);color:#cbd8e5;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.04em}
          .ss-brush-saved-heading{margin-top:15px}
          .ss-brush-preset{display:grid;grid-template-columns:46px minmax(0,1fr) auto;align-items:center;min-width:0;min-height:38px;gap:6px;border:1px solid transparent;border-radius:6px;background:#26313b;color:#e3e8ee;padding:5px 7px;text-align:left;font:inherit;cursor:pointer;transition:120ms ease}
          .ss-brush-preset:hover:not(:disabled){border-color:#536a7f;background:#344453}
          .ss-brush-preset.active,.ss-brush-preset:focus-visible{border-color:#6bb9ff;background:var(--ss-brush-blue-soft);outline:none;box-shadow:inset 0 0 0 1px #5f9fd5}
          .ss-brush-preset-preview{display:block;width:46px;height:22px;flex:none;color:#f4f7fc;overflow:visible}
          .ss-brush-preset-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:10px;font-weight:700}
          .ss-brush-preset small{font-size:9px;color:#b8c6d4;white-space:nowrap;text-align:right}
          .ss-brush-saved-use small{font-size:9px;color:#b8c6d4}
          .ss-brush-save-row{display:flex;gap:5px;margin:8px 0}
          .ss-brush-save-row input{min-width:0;flex:1;height:33px;border:1px solid var(--ss-brush-line);border-radius:6px;background:#202832;color:#f5f7fa;padding:0 8px;font:inherit;font-size:11px;outline:none}
          .ss-brush-save-row input:focus{border-color:var(--ss-brush-blue);box-shadow:0 0 0 2px #5faeff26}
          .ss-brush-save-row button{min-height:33px;border:1px solid #6694bd;border-radius:6px;background:#356b9d;color:#f5f7fa;padding:0 10px;font:inherit;font-size:10px;font-weight:800;cursor:pointer}
          .ss-brush-save-row button:hover:not(:disabled){background:#3e82bd}
          .ss-brush-save-row button:disabled{opacity:.4;cursor:default}
          .ss-brush-saved{display:grid;gap:5px}
          .ss-brush-saved-item{display:flex;min-width:0;align-items:stretch;border:1px solid var(--ss-brush-line-soft);border-radius:6px;background:#26313b;overflow:hidden}
          .ss-brush-saved-item:hover{border-color:#596d80}
          .ss-brush-saved-use{display:flex;min-width:0;flex:1;align-items:flex-start;flex-direction:column;gap:2px;border:0;background:none;color:#eaf0f6;padding:7px 8px;font:inherit;font-size:11px;cursor:pointer;text-align:left}
          .ss-brush-saved-use span{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
          .ss-brush-saved-remove{flex:none;width:33px;border:0;border-left:1px solid var(--ss-brush-line-soft);background:#2c3540;color:#efb9bd;font:inherit;font-size:18px;cursor:pointer}
          .ss-brush-saved-remove:hover{background:#5d3238;color:#fff}
          .ss-brush-notice{margin:8px 0 0;padding:7px 8px;border:1px solid #4d6275;border-radius:6px;background:#263747;color:#d4e6f7;font-size:9px;line-height:1.5}
          .ss-brush-mobile{display:none}
          .ss-brush-opacity{border-color:#3b4651!important;background:#29313a!important}
          @media(max-width:900px),(max-width:1100px) and (max-height:650px) and (orientation:landscape){
            .shadow-studio .ss-brush-mobile{display:block;flex:1 1 100%;min-width:0;border:1px solid #4b5968;border-radius:8px;background:#29313a;padding:0 8px}
            .shadow-studio .ss-brush-mobile summary{min-height:40px;display:flex;align-items:center;justify-content:space-between;color:#eff3f8;font-size:10px;font-weight:800;cursor:pointer;list-style:none;touch-action:manipulation}
            .shadow-studio .ss-brush-mobile summary::-webkit-details-marker{display:none}
            .shadow-studio .ss-brush-mobile summary::after{content:'▾';margin-left:auto;color:#b8c6d4}
            .shadow-studio .ss-brush-mobile[open] summary::after{content:'▴'}
            .shadow-studio .ss-brush-styles{grid-template-columns:repeat(4,minmax(0,1fr))}
            .shadow-studio .ss-brush-style{min-height:44px;flex-direction:column;gap:3px;font-size:9px}
            .shadow-studio .ss-brush-presets{grid-template-columns:minmax(0,1fr)}
            .shadow-studio .ss-brush-preset{min-height:40px}
            .shadow-studio .ss-brush-mobile .ss-brush-save-row input{font-size:16px}
            .shadow-studio .ss-brush-mobile .ss-brush-notice{padding-bottom:8px}
            .shadow-studio .ss-brush-settings .ss-range input[type="range"],.shadow-studio .ss-brush-opacity .ss-range input[type="range"]{height:26px}
            .shadow-studio .ss-brush-settings .ss-range input[type="range"]::-webkit-slider-thumb,.shadow-studio .ss-brush-opacity .ss-range input[type="range"]::-webkit-slider-thumb{width:19px;height:19px;margin-top:-7.5px}
          }
          @media(max-width:360px){.shadow-studio .ss-brush-presets{grid-template-columns:minmax(0,1fr)}.shadow-studio .ss-brush-styles{grid-template-columns:repeat(2,minmax(0,1fr))}}
        `}</style>
        <div className="ss-brush-current-preview" aria-hidden="true">
          <svg viewBox="0 0 160 56">
            <path d="M12 42 C38 7 80 14 106 32 S139 35 149 15" fill="none" stroke="currentColor" strokeWidth={Math.min(18, Math.max(1.5, size / 4))} strokeLinecap={style === 'marker' ? 'square' : 'round'} opacity={opacity / 100} />
          </svg>
        </div>
        <h2 className="ss-label">{labels.size}</h2>
        <div className="ss-range">
          <input type="range" min="1" max="5000" step="1" value={Math.max(1, size)} aria-label={tr('Brush size')} onChange={(event) => onSizeChange(Number(event.target.value))} />
          <StudioPrecisionInput value={size} onCommit={onSizeChange} min={0.1} max={5000} step={0.1} label={tr('Brush size')} width={62} />
          <span className="ss-value">px</span>
        </div>
        {presetOptions()}
      </section>

      <section className="ss-section ss-brush-opacity" aria-label={tr('Brush opacity')}>
        <h2 className="ss-label">{labels.opacity}</h2>
        <div className="ss-range">
          <input type="range" min="10" max="100" value={opacity} aria-label={tr('Brush opacity')} onChange={(event) => onOpacityChange(Number(event.target.value))} />
          <span className="ss-value">{opacity}%</span>
        </div>
      </section>

      <details className="ss-brush-mobile">
        <summary>{tr('Brush')} · {tr(BRUSH_STYLES.find((option) => option.id === style)?.label || 'Round')} · {size}px / {opacity}%</summary>
        {presetOptions()}
      </details>
    </>
  )
}
