import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import {
  STUDIO_TOOL_GROUPS,
  STUDIO_TOOLS_BY_ID,
  STUDIO_WORKING_TOOLS,
  STUDIO_MANGA_DEFAULT_TOOLS,
  loadStudioPinnedTools,
  saveStudioPinnedTools,
} from './StudioToolCatalog'

registerTranslationNamespace('studioTools', {
  "en": {
    "groups": {
      "navigation": "Navigation & selection",
      "drawing": "Drawing & painting",
      "design": "Comics & design",
      "other": "More tools"
    },
    "tools": {
      "move": "Move",
      "transform": "Transform",
      "marquee": "Rectangle Select",
      "lasso": "Lasso",
      "wand": "Magic Wand",
      "crop": "Crop",
      "brush": "Brush",
      "pencil": "Pencil",
      "eraser": "Eraser",
      "fill": "Paint Bucket",
      "gradient": "Gradient",
      "eyedropper": "Eyedropper",
      "smudge": "Smudge",
      "blur": "Blur",
      "text": "Text",
      "shape": "Shapes",
      "frame": "Comic Frames",
      "balloon": "Speech Balloons",
      "ruler": "Ruler",
      "perspective": "Perspective",
      "canvas": "Canvas"
    },
    "drawingTools": "Drawing tools",
    "notAvailable": " (not available yet)",
    "later": " — coming in a later stage"
  },
  "km": {
    "groups": {
      "navigation": "ផ្លាស់ទី និងជ្រើសរើស",
      "drawing": "គូរ និងផាត់ពណ៌",
      "design": "Manga និងរចនា",
      "other": "ឧបករណ៍ផ្សេងទៀត"
    },
    "tools": {
      "move": "ផ្លាស់ទី",
      "transform": "កែទ្រង់ទ្រាយ",
      "marquee": "ជ្រើសតំបន់ចតុកោណ",
      "lasso": "ជ្រើសតំបន់ដោយដៃ",
      "wand": "ជ្រើសតំបន់ពណ៌ស្រដៀង",
      "crop": "កាត់រូប",
      "brush": "ជក់",
      "pencil": "ខ្មៅដៃ",
      "eraser": "ជ័រលុប",
      "fill": "ចាក់ពណ៌",
      "gradient": "ពណ៌ជម្រាល",
      "eyedropper": "ចាប់ពណ៌",
      "smudge": "ប៉ាតពណ៌",
      "blur": "ធ្វើឱ្យព្រិល",
      "text": "អក្សរ",
      "shape": "រូបរាង",
      "frame": "ស៊ុម Manga",
      "balloon": "ប្រអប់សន្ទនា",
      "ruler": "បន្ទាត់វាស់",
      "perspective": "ទស្សនវិស័យ",
      "canvas": "ផ្ទាំងគំនូរ"
    },
    "drawingTools": "ឧបករណ៍គូរ",
    "notAvailable": " (មិនទាន់អាចប្រើបាន)",
    "later": " — នឹងបន្ថែមនៅដំណាក់កាលក្រោយ"
  },
  "zh": {
    "groups": {
      "navigation": "导航与选择",
      "drawing": "绘画与上色",
      "design": "漫画与设计",
      "other": "更多工具"
    },
    "tools": {
      "move": "移动",
      "transform": "变换",
      "marquee": "矩形选框",
      "lasso": "套索",
      "wand": "魔棒",
      "crop": "裁剪",
      "brush": "画笔",
      "pencil": "铅笔",
      "eraser": "橡皮擦",
      "fill": "油漆桶",
      "gradient": "渐变",
      "eyedropper": "吸管",
      "smudge": "涂抹",
      "blur": "模糊",
      "text": "文字",
      "shape": "形状",
      "frame": "漫画分格",
      "balloon": "对话气泡",
      "ruler": "标尺",
      "perspective": "透视",
      "canvas": "画布"
    },
    "drawingTools": "绘图工具",
    "notAvailable": "（暂不可用）",
    "later": " — 将在后续阶段推出"
  },
  "ja": {
    "groups": {
      "navigation": "移動と選択",
      "drawing": "描画とペイント",
      "design": "マンガとデザイン",
      "other": "その他のツール"
    },
    "tools": {
      "move": "移動",
      "transform": "変形",
      "marquee": "長方形選択",
      "lasso": "投げ縄",
      "wand": "自動選択",
      "crop": "切り抜き",
      "brush": "ブラシ",
      "pencil": "鉛筆",
      "eraser": "消しゴム",
      "fill": "塗りつぶし",
      "gradient": "グラデーション",
      "eyedropper": "スポイト",
      "smudge": "指先",
      "blur": "ぼかし",
      "text": "テキスト",
      "shape": "図形",
      "frame": "コマ割り",
      "balloon": "吹き出し",
      "ruler": "定規",
      "perspective": "パース",
      "canvas": "キャンバス"
    },
    "drawingTools": "描画ツール",
    "notAvailable": "（未対応）",
    "later": " — 今後の段階で追加予定"
  },
  "ko": {
    "groups": {
      "navigation": "이동 및 선택",
      "drawing": "그리기 및 채색",
      "design": "만화 및 디자인",
      "other": "기타 도구"
    },
    "tools": {
      "move": "이동",
      "transform": "변형",
      "marquee": "사각형 선택",
      "lasso": "올가미",
      "wand": "자동 선택",
      "crop": "자르기",
      "brush": "브러시",
      "pencil": "연필",
      "eraser": "지우개",
      "fill": "페인트 통",
      "gradient": "그라디언트",
      "eyedropper": "스포이트",
      "smudge": "문지르기",
      "blur": "흐림",
      "text": "텍스트",
      "shape": "도형",
      "frame": "만화 컷",
      "balloon": "말풍선",
      "ruler": "눈금자",
      "perspective": "원근법",
      "canvas": "캔버스"
    },
    "drawingTools": "그리기 도구",
    "notAvailable": "(아직 사용 불가)",
    "later": " — 추후 단계에서 추가 예정"
  }
})

const PAGE_WORDS = {
  en: ['Tool Page', 'Edit Tools', 'Choose the tools shown in your left toolbar.', 'Toolbar order', 'Available tools', 'Coming soon', 'Manga default', 'Cancel', 'Save tools', 'Move up', 'Move down', 'Select at least one tool.', 'Could not save the layout on this device. Check browser storage and try again.', 'Close Tool Page'],
  km: ['ទំព័រ Tool', 'កែ Tool', 'ជ្រើស Tool ដែលត្រូវបង្ហាញនៅផ្ទាំងខាងឆ្វេង។', 'លំដាប់ Tool', 'Tool ដែលអាចប្រើបាន', 'មិនទាន់មាន', 'Manga ដើម', 'បោះបង់', 'រក្សាទុក Tool', 'ឡើងលើ', 'ចុះក្រោម', 'សូមជ្រើស Tool យ៉ាងតិចមួយ។', 'មិនអាចរក្សាទុកការរៀបចំលើឧបករណ៍នេះបានទេ។ សូមពិនិត្យ Browser Storage។', 'បិទទំព័រ Tool'],
  zh: ['工具页面', '编辑工具', '选择左侧工具栏显示的工具。', '工具栏顺序', '可用工具', '即将推出', '漫画默认', '取消', '保存工具', '上移', '下移', '请至少选择一个工具。', '无法将工具布局保存到此设备。请检查浏览器存储。', '关闭工具页面'],
  ja: ['ツールページ', 'ツールを編集', '左側のツールバーに表示するツールを選択します。', 'ツールバーの順序', '利用可能なツール', '近日公開', 'マンガの初期設定', 'キャンセル', 'ツールを保存', '上へ', '下へ', 'ツールを少なくとも1つ選択してください。', 'ツールの配置をこの端末に保存できません。ブラウザーのストレージを確認してください。', 'ツールページを閉じる'],
  ko: ['도구 페이지', '도구 편집', '왼쪽 도구 모음에 표시할 도구를 선택하세요.', '도구 모음 순서', '사용 가능한 도구', '출시 예정', '만화 기본값', '취소', '도구 저장', '위로', '아래로', '도구를 하나 이상 선택하세요.', '이 기기에 도구 배치를 저장할 수 없습니다. 브라우저 저장소를 확인하세요.', '도구 페이지 닫기'],
}

export default function StudioToolPalette({ tool, onToolChange, labels = {} }) {
  const { t: tx, language } = useDisplayTranslation()
  const words = PAGE_WORDS[language] || PAGE_WORDS.en
  const [pinned, setPinned] = useState(loadStudioPinnedTools)
  const [draft, setDraft] = useState(() => [...pinned])
  const [pageOpen, setPageOpen] = useState(false)
  const [error, setError] = useState('')

  function openPage() {
    setDraft([...pinned])
    setError('')
    setPageOpen(true)
  }

  function toggleTool(id) {
    if (!STUDIO_WORKING_TOOLS.has(id)) return
    setError('')
    setDraft((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  function moveTool(index, offset) {
    const nextIndex = index + offset
    if (nextIndex < 0 || nextIndex >= draft.length) return
    setDraft((current) => {
      const next = [...current]
      ;[next[index], next[nextIndex]] = [next[nextIndex], next[index]]
      return next
    })
  }

  function savePage() {
    if (!draft.length) {
      setError(words[11])
      return
    }
    try {
      const next = saveStudioPinnedTools(draft)
      setPinned(next)
      if (!next.includes(tool)) onToolChange(next[0])
      setPageOpen(false)
    } catch {
      setError(words[12])
    }
  }

  return (
    <aside className="ss-tools ss-tool-palette" aria-label={tx('studioTools.drawingTools')}>
      <style>{`
        .shadow-studio .ss-tool-palette .ss-palette-group{display:flex;flex:0 0 auto;gap:4px;align-items:center}
        .shadow-studio .ss-tool-palette .ss-palette-group+.ss-palette-group{border-left:1px solid #495563;padding-left:6px}
        .shadow-studio .ss-tool-palette .ss-palette-tool{flex:0 0 40px;width:40px;min-width:40px;min-height:44px;height:44px;gap:3px;padding:3px;border-radius:5px}
        .shadow-studio .ss-tool-palette .ss-palette-tool i{font-size:15px}
        .shadow-studio .ss-tool-palette .ss-palette-tool .ss-round-brush-icon{display:inline-block;width:14px;height:14px;flex:none;border-radius:50%;background:currentColor;box-shadow:0 0 0 1px rgba(255,255,255,.16)}
        .shadow-studio .ss-tool-palette .ss-palette-tool span{display:none}
        .shadow-studio .ss-tool-palette .ss-palette-tool:disabled{cursor:not-allowed;opacity:.58;filter:grayscale(.65)}
        .shadow-studio .ss-tool-palette .ss-palette-tool:focus-visible{outline:2px solid #8bc4ff;outline-offset:-2px}
        .shadow-studio .ss-tool-palette .ss-palette-group:last-child{opacity:.8}
        .shadow-studio .ss-tool-page-launch{position:sticky;bottom:0;z-index:2;display:grid;place-items:center;flex:0 0 42px;min-height:38px;width:100%;margin-top:8px;border:1px solid #647b94;border-radius:6px;background:#354759;color:#f3f7ff;font:inherit;font-size:17px;cursor:pointer}
        .shadow-studio .ss-tool-page-launch:focus-visible{outline:2px solid #8bc4ff;outline-offset:-2px}
        @media(min-width:1101px) and (min-height:651px){
          .shadow-studio:has(.ss-layout) .ss-left-workspace>.ss-tool-palette{padding:9px 4px 60px}
          .shadow-studio:has(.ss-layout) .ss-tool-palette .ss-palette-group{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px;justify-items:center;padding:0 0 9px}
          .shadow-studio:has(.ss-layout) .ss-tool-palette .ss-palette-tool{width:32px;min-width:0;height:37px;min-height:37px;margin:0;padding:4px 2px}
        }
        @media(max-width:1100px), (max-height:650px){
          .shadow-studio .ss-tool-page-launch{position:sticky;right:0;bottom:auto;width:44px;min-width:44px;min-height:44px;margin:0 0 0 5px}
        }
        .ss-tool-page{position:fixed;inset:0;z-index:12000;display:flex;flex-direction:column;box-sizing:border-box;overflow:hidden;background:#202936;color:#edf4ff;font:inherit}
        .ss-tool-page *{box-sizing:border-box}
        .ss-tool-page-header{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px max(16px,env(safe-area-inset-right));border-bottom:1px solid #52657b;background:#283748}
        .ss-tool-page-header h2{margin:0;font-size:19px}
        .ss-tool-page-header button,.ss-tool-page-actions button,.ss-tool-page-order button{min-height:36px;border:1px solid #617e9c;border-radius:6px;padding:5px 12px;background:#354e67;color:#f2f7ff;font:inherit;cursor:pointer}
        .ss-tool-page button:disabled{opacity:.45;cursor:not-allowed}
        .ss-tool-page-body{flex:1;min-height:0;overflow-y:auto;padding:18px max(16px,calc((100vw - 960px)/2));overscroll-behavior:contain}
        .ss-tool-page-body>p{margin:0 0 16px;color:#c1d1e1;font-size:13px}
        .ss-tool-page section{margin:0 0 22px;padding:13px;border:1px solid #4b5e73;border-radius:9px;background:#29394b}
        .ss-tool-page section h3{margin:0 0 12px;font-size:14px}
        .ss-tool-page-order{display:flex;flex-direction:column;gap:6px}
        .ss-tool-page-order-row{display:flex;align-items:center;gap:8px;min-height:42px;padding:5px 7px;border:1px solid #4a647e;border-radius:6px;background:#30465c}
        .ss-tool-page-order-row>span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}
        .ss-tool-page-order-row>button{min-width:36px;padding:4px 8px}
        .ss-tool-page-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(185px,1fr));gap:7px}
        .ss-tool-page-grid label{display:flex;align-items:center;gap:9px;min-height:43px;padding:7px;border:1px solid #506781;border-radius:6px;background:#34485e;font-size:12px;cursor:pointer}
        .ss-tool-page-grid label[data-unavailable=true]{opacity:.6;cursor:not-allowed}
        .ss-tool-page-grid label input{accent-color:#7ab8ff}
        .ss-tool-page-grid label span{flex:1}
        .ss-tool-page-grid label small{font-size:10px;color:#b9c8d9}
        .ss-tool-page-actions{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:8px;padding:12px max(16px,env(safe-area-inset-right));border-top:1px solid #52657b;background:#283748}
        .ss-tool-page-actions .ss-tool-page-save{border-color:#9ac8fa;background:#3479bb}
        .ss-tool-page-error{margin:0 auto 0 0;color:#ffccce;font-size:12px}
        @media(max-width:600px){.ss-tool-page-header h2{font-size:16px}.ss-tool-page-body{padding:12px}.ss-tool-page-actions{justify-content:space-between}.ss-tool-page-grid{grid-template-columns:minmax(0,1fr)}}
      `}</style>
      <div className="ss-palette-group" role="group" aria-label={tx('studioTools.drawingTools')}>
        {pinned.map((id) => {
          const item = STUDIO_TOOLS_BY_ID[id]
          if (!item || !STUDIO_WORKING_TOOLS.has(id)) return null
          const label = labels[id] || tx(`studioTools.tools.${id}`)
          return (
            <button key={id} type="button" className={`ss-tool ss-palette-tool ${tool === id ? 'active' : ''}`} aria-label={label} aria-pressed={tool === id} title={label} onClick={() => onToolChange(id)}>
              <i className={id === 'brush' ? 'ss-round-brush-icon' : `fa-solid ${item.icon}`} aria-hidden="true" />
              <span>{label}</span>
            </button>
          )
        })}
      </div>
      <button type="button" className="ss-tool-page-launch" title={words[1]} aria-label={words[1]} onClick={openPage}>
        <i className="fa-solid fa-ellipsis" aria-hidden="true" />
      </button>
      {pageOpen ? createPortal(
        <div className="ss-tool-page" role="dialog" aria-modal="true" aria-label={words[0]} onKeyDown={(event) => { event.stopPropagation(); if (event.key === 'Escape') { event.preventDefault(); setPageOpen(false) } }}>
          <header className="ss-tool-page-header"><h2>{words[0]} · {words[1]}</h2><button type="button" aria-label={words[13]} onClick={() => setPageOpen(false)}>✕</button></header>
          <div className="ss-tool-page-body">
            <p>{words[2]}</p>
            <section><h3>{words[3]}</h3><div className="ss-tool-page-order">
              {draft.map((id, index) => <div key={id} className="ss-tool-page-order-row">
                <i className={id === 'brush' ? 'ss-round-brush-icon' : `fa-solid ${STUDIO_TOOLS_BY_ID[id]?.icon || 'fa-wrench'}`} aria-hidden="true" />
                <span>{tx(`studioTools.tools.${id}`)}</span>
                <button type="button" disabled={index === 0} aria-label={`${words[9]}: ${tx(`studioTools.tools.${id}`)}`} onClick={() => moveTool(index, -1)}>↑</button>
                <button type="button" disabled={index === draft.length - 1} aria-label={`${words[10]}: ${tx(`studioTools.tools.${id}`)}`} onClick={() => moveTool(index, 1)}>↓</button>
                <button type="button" aria-label={`${words[7]}: ${tx(`studioTools.tools.${id}`)}`} onClick={() => toggleTool(id)}>×</button>
              </div>)}
            </div></section>
            {STUDIO_TOOL_GROUPS.map((group) => <section key={group.id}>
              <h3>{tx(`studioTools.groups.${group.id}`)}</h3>
              <div className="ss-tool-page-grid">{group.tools.map((item) => {
                const enabled = STUDIO_WORKING_TOOLS.has(item.id)
                return <label key={item.id} data-unavailable={!enabled}>
                  <input type="checkbox" disabled={!enabled} checked={enabled && draft.includes(item.id)} onChange={() => toggleTool(item.id)} />
                  <i className={item.id === 'brush' ? 'ss-round-brush-icon' : `fa-solid ${item.icon}`} aria-hidden="true" />
                  <span>{tx(`studioTools.tools.${item.id}`)}</span>
                  {!enabled ? <small>{words[5]}</small> : null}
                </label>
              })}</div>
            </section>)}
          </div>
          <footer className="ss-tool-page-actions">
            {error ? <p className="ss-tool-page-error" role="alert">{error}</p> : null}
            <button type="button" onClick={() => { setDraft([...STUDIO_MANGA_DEFAULT_TOOLS]); setError('') }}>{words[6]}</button>
            <button type="button" onClick={() => setPageOpen(false)}>{words[7]}</button>
            <button type="button" className="ss-tool-page-save" onClick={savePage} disabled={!draft.length}>{words[8]}</button>
          </footer>
        </div>, document.body
      ) : null}
    </aside>
  )
}
