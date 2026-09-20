import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
registerTranslationNamespace('studioTools', {
  "en": {
    "groups": {
      "navigation": "Navigation & selection",
      "drawing": "Drawing & painting",
      "design": "Comics & design"
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
      "perspective": "Perspective"
    },
    "drawingTools": "Drawing tools",
    "notAvailable": " (not available yet)",
    "later": " — coming in a later stage"
  },
  "km": {
    "groups": {
      "navigation": "ផ្លាស់ទី និងជ្រើសរើស",
      "drawing": "គូរ និងផាត់ពណ៌",
      "design": "Manga និងរចនា"
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
      "perspective": "ទស្សនវិស័យ"
    },
    "drawingTools": "ឧបករណ៍គូរ",
    "notAvailable": " (មិនទាន់អាចប្រើបាន)",
    "later": " — នឹងបន្ថែមនៅដំណាក់កាលក្រោយ"
  },
  "zh": {
    "groups": {
      "navigation": "导航与选择",
      "drawing": "绘画与上色",
      "design": "漫画与设计"
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
      "perspective": "透视"
    },
    "drawingTools": "绘图工具",
    "notAvailable": "（暂不可用）",
    "later": " — 将在后续阶段推出"
  },
  "ja": {
    "groups": {
      "navigation": "移動と選択",
      "drawing": "描画とペイント",
      "design": "マンガとデザイン"
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
      "perspective": "パース"
    },
    "drawingTools": "描画ツール",
    "notAvailable": "（未対応）",
    "later": " — 今後の段階で追加予定"
  },
  "ko": {
    "groups": {
      "navigation": "이동 및 선택",
      "drawing": "그리기 및 채색",
      "design": "만화 및 디자인"
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
      "perspective": "원근법"
    },
    "drawingTools": "그리기 도구",
    "notAvailable": "(아직 사용 불가)",
    "later": " — 추후 단계에서 추가 예정"
  }
})

const GROUPS = [
  { id: 'navigation', label: 'Navigation & selection', tools: [
    { id: 'move', label: 'Move', icon: 'fa-arrows-up-down-left-right' },
    { id: 'transform', label: 'Transform', icon: 'fa-up-down-left-right' },
    { id: 'marquee', label: 'Rectangle Select', icon: 'fa-vector-square' },
    { id: 'lasso', label: 'Lasso', icon: 'fa-draw-polygon' },
    { id: 'wand', label: 'Magic Wand', icon: 'fa-wand-magic-sparkles' },
    { id: 'crop', label: 'Crop', icon: 'fa-crop-simple' },
  ] },
  { id: 'drawing', label: 'Drawing & painting', tools: [
    { id: 'brush', label: 'Brush', icon: 'fa-paintbrush' },
    { id: 'pencil', label: 'Pencil', icon: 'fa-pencil' },
    { id: 'eraser', label: 'Eraser', icon: 'fa-eraser' },
    { id: 'fill', label: 'Paint Bucket', icon: 'fa-fill-drip' },
    { id: 'gradient', label: 'Gradient', icon: 'fa-palette' },
    { id: 'eyedropper', label: 'Eyedropper', icon: 'fa-eye-dropper' },
    { id: 'smudge', label: 'Smudge', icon: 'fa-hand-pointer' },
    { id: 'blur', label: 'Blur', icon: 'fa-droplet' },
  ] },
  { id: 'design', label: 'Comics & design', tools: [
    { id: 'text', label: 'Text', icon: 'fa-font' },
    { id: 'shape', label: 'Shapes', icon: 'fa-shapes' },
    { id: 'frame', label: 'Comic Frames', icon: 'fa-table-cells-large' },
    { id: 'balloon', label: 'Speech Balloons', icon: 'fa-comment' },
    { id: 'ruler', label: 'Ruler', icon: 'fa-ruler' },
    { id: 'perspective', label: 'Perspective', icon: 'fa-border-all' },
  ] },
]

const AVAILABLE = new Set(['brush', 'eraser', 'eyedropper'])

export default function StudioToolPalette({ tool, onToolChange, labels = {} }) {
  const { t: tx } = useDisplayTranslation()
  return (
    <aside className="ss-tools ss-tool-palette" aria-label={tx('studioTools.drawingTools')}>
      <style>{`
        .shadow-studio .ss-tool-palette .ss-palette-group{display:flex;flex:0 0 auto;gap:4px;align-items:center}
        .shadow-studio .ss-tool-palette .ss-palette-group+.ss-palette-group{border-left:1px solid #495563;padding-left:6px}
        .shadow-studio .ss-tool-palette .ss-palette-tool{flex:0 0 40px;width:40px;min-width:40px;min-height:44px;height:44px;gap:3px;padding:3px;border-radius:5px}
        .shadow-studio .ss-tool-palette .ss-palette-tool i{font-size:15px}
        .shadow-studio .ss-tool-palette .ss-palette-tool .ss-round-brush-icon{display:inline-block;width:14px;height:14px;flex:none;border-radius:50%;background:currentColor;box-shadow:0 0 0 1px rgba(255,255,255,.16)}
        .shadow-studio .ss-tool-palette .ss-palette-tool span{display:none}
        .shadow-studio .ss-tool-palette .ss-palette-tool:disabled{cursor:not-allowed;opacity:.42;filter:grayscale(.8)}
        .shadow-studio .ss-tool-palette .ss-palette-tool:focus-visible{outline:2px solid #8bc4ff;outline-offset:-2px}
        @media(min-width:1101px) and (min-height:651px){
          .shadow-studio:has(.ss-layout) .ss-left-workspace>.ss-tool-palette{padding:9px 4px 60px}
          .shadow-studio:has(.ss-layout) .ss-tool-palette .ss-palette-group{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px;justify-items:center;padding:0 0 9px}
          .shadow-studio:has(.ss-layout) .ss-tool-palette .ss-palette-group+.ss-palette-group{padding-top:9px;border-left:0;border-top:1px solid #495563}
          .shadow-studio:has(.ss-layout) .ss-tool-palette .ss-palette-tool{width:32px;min-width:0;height:37px;min-height:37px;margin:0;padding:4px 2px}
          .shadow-studio:has(.ss-layout) .ss-tool-palette .ss-palette-tool i{font-size:15px}
        }
      `}</style>
      {GROUPS.map((group) => (
        <div key={group.label} className="ss-palette-group" role="group" aria-label={tx(`studioTools.groups.${group.id}`)}>
          {group.tools.map((item) => {
            const enabled = AVAILABLE.has(item.id)
            const label = labels[item.id] || tx(`studioTools.tools.${item.id}`)
            return (
              <button
                key={item.id}
                type="button"
                className={`ss-tool ss-palette-tool ${tool === item.id ? 'active' : ''}`}
                aria-label={`${label}${enabled ? '' : tx('studioTools.notAvailable')}`}
                aria-pressed={enabled ? tool === item.id : undefined}
                title={`${label}${enabled ? '' : tx('studioTools.later')}`}
                disabled={!enabled}
                onClick={() => onToolChange(item.id)}
              >
                <i className={item.id === 'brush' ? 'ss-round-brush-icon' : `fa-solid ${item.icon}`} aria-hidden="true" />
                <span>{label}</span>
              </button>
            )
          })}
        </div>
      ))}
    </aside>
  )
}
