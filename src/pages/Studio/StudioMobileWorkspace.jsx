import { useEffect, useRef, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import StudioBrushSettings from './StudioBrushSettings'
import StudioMobileColorPopup from './StudioMobileColorPopup'
import { STUDIO_TOOL_GROUPS, STUDIO_TOOLS_BY_ID, STUDIO_WORKING_TOOLS } from './StudioToolCatalog'

const MOBILE_TEXT = {
  en: {
    ad: 'Reserved Ad Space',
    adSub: 'Future ads and promotions',
    undo: 'Undo',
    redo: 'Redo',
    addImage: 'Add Image',
    reference: 'Reference Window',
    selection: 'Selection',
    stabilizer: 'Stabilizer',
    shape: 'Shape',
    ruler: 'Ruler',
    replaceReference: 'Replace reference',
    closeReference: 'Close reference',
    select: 'Select',
    import: 'Import',
    layers: 'Layers',
    brush: 'Brush',
    eraser: 'Eraser',
    color: 'Color',
    more: 'More Tools',
    size: 'Size',
    opacity: 'Opacity',
    presets: 'Presets',
    hideControls: 'Hide size and opacity',
    showControls: 'Show size and opacity',
    addLayer: 'Add Layer',
    tools: 'Tools',
    actions: 'Actions',
    papers: 'Papers',
    home: 'Home',
    newPaper: 'New Paper',
    save: 'Save',
    export: 'Export',
    fit: 'Fit',
    grid: 'Grid',
    close: 'Close',
    brushSettings: 'Brush Presets',
  },
  km: {
    ad: 'កន្លែងផ្សាយពាណិជ្ជកម្ម',
    adSub: 'សម្រាប់ Ads និង Promotion ពេលក្រោយ',
    undo: 'ត្រឡប់ក្រោយ',
    redo: 'ធ្វើឡើងវិញ',
    addImage: 'បន្ថែមរូប',
    reference: 'Reference Window',
    selection: 'Selection',
    stabilizer: 'Stabilizer',
    shape: 'Shape',
    ruler: 'Ruler',
    replaceReference: 'ប្ដូររូប Reference',
    closeReference: 'បិទ Reference',
    select: 'ជ្រើស',
    import: 'នាំចូល',
    layers: 'Layers',
    brush: 'ជក់',
    eraser: 'ជ័រលុប',
    color: 'ពណ៌',
    more: 'Tool ផ្សេង',
    size: 'ទំហំ',
    opacity: 'ភាពស្រអាប់',
    presets: 'Presets',
    hideControls: 'លាក់ Size និង Opacity',
    showControls: 'បង្ហាញ Size និង Opacity',
    addLayer: 'បន្ថែម Layer',
    tools: 'Tools',
    actions: 'សកម្មភាព',
    papers: 'ក្រដាស',
    home: 'ទំព័រដើម',
    newPaper: 'ក្រដាសថ្មី',
    save: 'រក្សាទុក',
    export: 'Export',
    fit: 'សមអេក្រង់',
    grid: 'Grid',
    close: 'បិទ',
    brushSettings: 'Brush Presets',
  },
  zh: {
    ad: '广告预留区域',
    adSub: '未来广告与推广',
    undo: '撤销',
    redo: '重做',
    addImage: '添加图片',
    reference: '参考窗口',
    selection: '选择',
    stabilizer: '防抖',
    shape: '形状',
    ruler: '尺子',
    replaceReference: '更换参考图',
    closeReference: '关闭参考图',
    select: '选择',
    import: '导入',
    layers: '图层',
    brush: '画笔',
    eraser: '橡皮擦',
    color: '颜色',
    more: '更多工具',
    size: '大小',
    opacity: '不透明度',
    presets: '预设',
    hideControls: '隐藏大小和不透明度',
    showControls: '显示大小和不透明度',
    addLayer: '添加图层',
    tools: '工具',
    actions: '操作',
    papers: '画布',
    home: '首页',
    newPaper: '新建画布',
    save: '保存',
    export: '导出',
    fit: '适合',
    grid: '网格',
    close: '关闭',
    brushSettings: '画笔预设',
  },
  ja: {
    ad: '広告スペース',
    adSub: '今後の広告・プロモーション用',
    undo: '元に戻す',
    redo: 'やり直す',
    addImage: '画像追加',
    reference: '資料ウィンドウ',
    selection: '選択',
    stabilizer: '手ぶれ補正',
    shape: '図形',
    ruler: '定規',
    replaceReference: '資料画像を変更',
    closeReference: '資料を閉じる',
    select: '選択',
    import: '読み込む',
    layers: 'レイヤー',
    brush: 'ブラシ',
    eraser: '消しゴム',
    color: '色',
    more: 'その他',
    size: 'サイズ',
    opacity: '不透明度',
    presets: 'プリセット',
    hideControls: 'サイズと不透明度を隠す',
    showControls: 'サイズと不透明度を表示',
    addLayer: 'レイヤー追加',
    tools: 'ツール',
    actions: '操作',
    papers: 'キャンバス',
    home: 'ホーム',
    newPaper: '新規キャンバス',
    save: '保存',
    export: '書き出し',
    fit: '全体表示',
    grid: 'グリッド',
    close: '閉じる',
    brushSettings: 'ブラシプリセット',
  },
  ko: {
    ad: '광고 영역',
    adSub: '향후 광고 및 프로모션',
    undo: '실행 취소',
    redo: '다시 실행',
    addImage: '이미지 추가',
    reference: '참조 창',
    selection: '선택',
    stabilizer: '손떨림 보정',
    shape: '도형',
    ruler: '자',
    replaceReference: '참조 이미지 변경',
    closeReference: '참조 닫기',
    select: '선택',
    import: '가져오기',
    layers: '레이어',
    brush: '브러시',
    eraser: '지우개',
    color: '색상',
    more: '더 보기',
    size: '크기',
    opacity: '불투명도',
    presets: '프리셋',
    hideControls: '크기와 불투명도 숨기기',
    showControls: '크기와 불투명도 표시',
    addLayer: '레이어 추가',
    tools: '도구',
    actions: '작업',
    papers: '캔버스',
    home: '홈',
    newPaper: '새 캔버스',
    save: '저장',
    export: '내보내기',
    fit: '맞춤',
    grid: '격자',
    close: '닫기',
    brushSettings: '브러시 프리셋',
  },
}

const MOBILE_MEDIA = '@media all'


const MOBILE_BRUSH_TOOLS = [
  { id: 'transform', label: 'Transform' },
  { id: 'wand', label: 'Magic Wand' },
  { id: 'lasso', label: 'Lasso' },
  { id: 'filter', label: 'Filter' },
  { id: 'brush', label: 'Brush' },
  { id: 'eraser', label: 'Eraser' },
  { id: 'smudge', label: 'Smudge' },
  { id: 'blur', label: 'Blur' },
  { id: 'special', label: 'Special Pen' },
  { id: 'fill', label: 'Bucket' },
  { id: 'vector', label: 'Vector', icon: 'fa-location-arrow', disabled: true },
  { id: 'text', label: 'Text' },
  { id: 'frame', label: 'Manga Frame' },
  { id: 'eyedropper', label: 'Eyedropper' },
  { id: 'canvas', label: 'Canvas' },
]

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || min))
}

function sizeStep(value) {
  const number = Number(value) || 1
  if (number < 5) return 0.5
  if (number < 50) return 1
  if (number < 200) return 5
  return 10
}

function formatSize(value) {
  const number = Number(value) || 0
  return Number.isInteger(number) ? String(number) : number.toFixed(1)
}

function mobileCanvasScale(document) {
  const width = Number(document?.width)
  const height = Number(document?.height)
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return 1
  return Math.max(0.05, Math.min(width, height) / 1000)
}

function logicalSizeFromActual(actualSize, scale) {
  return Math.round(Math.max(0.1, Number(actualSize) || 0.1) / Math.max(0.05, scale) * 10) / 10
}

function actualSizeFromLogical(logicalSize, scale) {
  return Math.round(Math.min(5000, Math.max(0.1, Number(logicalSize) || 0.1) * Math.max(0.05, scale)) * 10) / 10
}

export default function StudioMobileWorkspace({
  tool,
  color,
  size,
  opacity,
  brushStyle,
  busy,
  canUndo,
  canRedo,
  showGrid,
  stabilizer = 0,
  layers = [],
  activeLayerId = '',
  documents = [],
  activeDocumentId = '',
  onToolChange,
  onColorChange,
  onSizeChange,
  onOpacityChange,
  onBrushStyleChange,
  onUndo,
  onRedo,
  onImport,
  onLayerAction,
  onSwitchPaper,
  onHome,
  onNewPaper,
  onSave,
  onExport,
  onFit,
  onToggleGrid,
  onStabilizerChange,
}) {
  const { t: tx, language } = useDisplayTranslation()
  const text = MOBILE_TEXT[language] || MOBILE_TEXT.en
  const [controlsOpen, setControlsOpen] = useState(true)
  const [panel, setPanel] = useState('')
  const [colorOpen, setColorOpen] = useState(false)
  const [brushToolsOpen, setBrushToolsOpen] = useState(false)
  const [paintTool, setPaintTool] = useState(tool === 'eraser' ? 'eraser' : 'brush')
  const [sizeEditing, setSizeEditing] = useState(false)
  const [sizeDraft, setSizeDraft] = useState('')
  const [referenceImage, setReferenceImage] = useState('')
  const [referenceOpen, setReferenceOpen] = useState(false)
  const referenceInputRef = useRef(null)

  useEffect(() => {
    if (tool === 'brush' || tool === 'eraser') setPaintTool(tool)
  }, [tool])

  useEffect(() => () => {
    if (referenceImage) URL.revokeObjectURL(referenceImage)
  }, [referenceImage])

  const activePaper = documents.find((document) => document.id === activeDocumentId) || documents[0] || null
  const canvasScale = mobileCanvasScale(activePaper)
  const logicalSize = logicalSizeFromActual(size, canvasScale)
  const sliderMax = paintTool === 'eraser' ? 1000 : 30
  const sliderSize = Math.min(sliderMax, Math.max(0.1, logicalSize))
  const manualLogicalMax = Math.max(sliderMax, Math.floor(5000 / canvasScale * 10) / 10)
  const stabilizerValue = Math.max(0, Math.min(10, Math.round(Number(stabilizer) || 0)))
  const selectedMobileTool = MOBILE_BRUSH_TOOLS.find((item) => item.id === tool)
  const activeToolId = STUDIO_TOOLS_BY_ID[tool] ? tool : paintTool
  const activeToolCatalog = STUDIO_TOOLS_BY_ID[activeToolId]
  const activeToolIcon = selectedMobileTool?.icon || activeToolCatalog?.icon || (paintTool === 'eraser' ? 'fa-eraser' : 'fa-paintbrush')
  const activeToolLabel = selectedMobileTool?.label || toolLabel(activeToolId)
  const panelTitle = panel === 'layers'
    ? text.layers
    : panel === 'presets'
      ? text.brushSettings
      : panel === 'stabilizer'
        ? text.stabilizer
        : text.more

  const openPanel = (name) => {
    setColorOpen(false)
    setBrushToolsOpen(false)
    setPanel((current) => current === name ? '' : name)
  }
  const toolGroups = STUDIO_TOOL_GROUPS.map((group) => ({
    ...group,
    tools: group.tools.filter((item) => STUDIO_WORKING_TOOLS.has(item.id) && !['brush', 'eraser'].includes(item.id)),
  })).filter((group) => group.tools.length)

  function chooseTool(next) {
    if (busy) return
    if (next === 'brush' || next === 'eraser') setPaintTool(next)
    onToolChange?.(next)
    setColorOpen(false)
    setBrushToolsOpen(false)
    setPanel('')
  }

  function toggleBrushEraser() {
    if (busy) return
    chooseTool(paintTool === 'eraser' ? 'brush' : 'eraser')
  }

  function applyLogicalSize(nextLogicalSize, max = sliderMax) {
    const next = Math.round(clamp(nextLogicalSize, 0.1, max) * 10) / 10
    return onSizeChange?.(actualSizeFromLogical(next, canvasScale))
  }

  function adjustSize(direction) {
    const step = sizeStep(logicalSize)
    applyLogicalSize(Number(logicalSize) + direction * step)
  }

  function beginSizeEdit() {
    if (busy) return
    setSizeDraft(formatSize(logicalSize))
    setSizeEditing(true)
  }

  function commitSizeEdit() {
    const value = Number(String(sizeDraft).replace(',', '.'))
    setSizeEditing(false)
    if (!Number.isFinite(value)) return
    applyLogicalSize(value, manualLogicalMax)
  }

  function adjustOpacity(direction) {
    onOpacityChange?.(clamp(Number(opacity) + direction * 5, 10, 100))
  }

  function chooseReferenceImage(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) return
    const nextUrl = URL.createObjectURL(file)
    setReferenceImage(nextUrl)
    setReferenceOpen(true)
  }

  function toggleReferenceWindow() {
    if (referenceImage) {
      setReferenceOpen((current) => !current)
      return
    }
    referenceInputRef.current?.click()
  }

  function toolLabel(id) {
    const translated = tx(`studioTools.tools.${id}`)
    return translated && translated !== `studioTools.tools.${id}` ? translated : id
  }

  return (
    <div className="ss-mobile-workspace-ui" data-controls-open={controlsOpen ? 'true' : 'false'}>
      <style>{`
        .shadow-studio .ss-mobile-workspace-ui{display:none}
        ${MOBILE_MEDIA}{
          .shadow-studio.ss-mobile-workspace-mode{
            --ss-mobile-blue:#4b9fff;
            --ss-mobile-bg:#151a20;
            --ss-mobile-panel:#1d242c;
            --ss-mobile-panel-2:#222a33;
            --ss-mobile-line:#2b343e;
            --ss-mobile-text:#f4f7fb;
            --ss-mobile-muted:#a8b0b8;
            display:flex;
            flex-direction:column;
            width:100%;
            height:100dvh;
            min-height:0;
            overflow:hidden;
            background:var(--ss-mobile-bg)
          }
          .shadow-studio.ss-mobile-workspace-mode>.ss-chrome,
          .shadow-studio.ss-mobile-workspace-mode>.ss-options-bar,
          .shadow-studio.ss-mobile-workspace-mode>.ss-tabs,
          .shadow-studio.ss-mobile-workspace-mode .ss-left-workspace,
          .shadow-studio.ss-mobile-workspace-mode .ss-side,
          .shadow-studio.ss-mobile-workspace-mode>.ss-bottom{
            display:none!important
          }
          .shadow-studio.ss-mobile-workspace-mode>.ss-project-message{
            position:fixed;
            left:10px;
            right:10px;
            bottom:calc(184px + env(safe-area-inset-bottom));
            z-index:74;
            max-height:48px;
            margin:0;
            overflow:hidden;
            padding:8px 10px;
            border-color:#526273;
            border-radius:8px;
            background:#26323ddd;
            color:#dceaf7;
            font-size:9px;
            line-height:1.4;
            backdrop-filter:blur(12px)
          }
          .shadow-studio.ss-mobile-workspace-mode:has(.ss-mobile-workspace-ui[data-controls-open="false"])>.ss-project-message{
            bottom:calc(82px + env(safe-area-inset-bottom))
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-workspace-ui{
            display:block;
            flex:0 0 auto;
            width:100%;
            box-sizing:border-box;
            background:#11171e;
            color:var(--ss-mobile-text);
            font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-top{
            display:block;
            width:100%;
            box-sizing:border-box;
            padding:max(6px,env(safe-area-inset-top)) 0 0;
            border:0;
            background:#11161c
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-ad{
            width:100%;
            min-height:68px;
            display:flex;
            align-items:flex-start;
            justify-content:flex-start;
            overflow:hidden;
            box-sizing:border-box;
            border:0;
            border-radius:0;
            padding:6px 8px;
            background:#11161c;
            box-shadow:none
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-ad-placeholder{
            color:#8d98a4;
            font-size:8px;
            font-weight:800;
            letter-spacing:.08em
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-quick{
            min-height:56px;
            display:flex;
            align-items:center;
            gap:4px;
            overflow:hidden;
            box-sizing:border-box;
            margin:8px 8px 0;
            padding:6px 10px;
            border:1px solid #2f3944;
            border-radius:18px;
            background:rgba(14,18,24,.92);
            box-shadow:0 8px 24px #0006;
            backdrop-filter:blur(12px)
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-quick button{
            width:38px;
            min-width:38px;
            height:42px;
            display:grid;
            place-items:center;
            border:0;
            border-radius:12px;
            background:transparent;
            color:#f3f7fb;
            padding:0;
            font:inherit;
            cursor:pointer;
            touch-action:manipulation
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-quick button:disabled{opacity:.3}
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-quick button.active{
            background:#1e2a36;
            color:#fff;
            box-shadow:inset 0 0 0 1px #3f82d4
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-quick button i{
            font-size:17px;
            line-height:1
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-quick-spacer{
            flex:1 1 auto;
            min-width:18px
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-stabilizer-badge{
            position:absolute;
            transform:translate(11px,-11px);
            min-width:14px;
            height:14px;
            display:grid;
            place-items:center;
            border-radius:7px;
            background:#4b9fff;
            color:#07111b;
            font-size:7px;
            font-weight:900
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-reference{
            position:fixed;
            z-index:76;
            top:126px;
            right:8px;
            width:min(38vw,150px);
            overflow:hidden;
            border:1px solid #46525e;
            border-radius:10px;
            background:#171d24;
            box-shadow:0 10px 28px #0009
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-reference img{
            display:block;
            width:100%;
            max-height:190px;
            object-fit:contain;
            background:#0d1116
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-reference-actions{
            display:grid;
            grid-template-columns:1fr 34px;
            min-height:32px
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-reference-actions button{
            border:0;
            border-top:1px solid #313a43;
            background:#202831;
            color:#dfe7ee;
            font-size:8px;
            font-weight:750
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-reference-actions button+button{
            border-left:1px solid #313a43
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-stabilizer-control{
            display:grid;
            grid-template-columns:40px minmax(0,1fr);
            gap:10px;
            align-items:center;
            padding:10px 2px
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-stabilizer-control output{
            min-height:40px;
            display:grid;
            place-items:center;
            border:1px solid #3d4a56;
            border-radius:9px;
            background:#11171d;
            color:#fff;
            font-size:16px;
            font-weight:850
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-stabilizer-control input{
            width:100%;
            accent-color:var(--ss-mobile-blue)
          }
          .shadow-studio.ss-mobile-workspace-mode>.ss-layout{
            flex:1 1 auto;
            display:grid;
            grid-template-columns:minmax(0,1fr);
            width:100%;
            height:auto;
            min-height:0;
            overflow:hidden;
            background:#11161c
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-work{
            order:0;
            display:block;
            width:100%;
            height:100%;
            min-width:0;
            min-height:0;
            max-height:none;
            overflow:auto;
            box-sizing:border-box;
            padding:8px 8px calc(188px + env(safe-area-inset-bottom));
            background:#171c22;
            overscroll-behavior:contain;
            -webkit-overflow-scrolling:touch
          }
          .shadow-studio.ss-mobile-workspace-mode:has(.ss-mobile-workspace-ui[data-controls-open="false"]) .ss-work{
            padding-bottom:calc(84px + env(safe-area-inset-bottom))
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-stage{
            min-height:100%;
            min-width:100%;
            width:max-content
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-canvas{
            box-shadow:0 0 0 1px #66717d,0 12px 32px #0008
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-controls{
            position:fixed;
            left:8px;
            right:8px;
            bottom:calc(74px + env(safe-area-inset-bottom));
            z-index:68;
            display:block;
            box-sizing:border-box;
            min-height:74px;
            padding:10px 12px;
            border:1px solid #353e49;
            border-radius:18px;
            background:rgba(14,18,24,.94);
            box-shadow:0 10px 28px #0008;
            backdrop-filter:blur(12px)
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-controls.is-hidden{display:none}
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-sliders{
            min-width:0;
            display:grid;
            gap:10px;
            align-content:center
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-slider-row{
            min-width:0;
            display:grid;
            grid-template-columns:42px 30px minmax(0,1fr) 30px;
            gap:6px;
            align-items:center
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-slider-value{
            width:42px;
            min-width:42px;
            height:28px;
            box-sizing:border-box;
            border:0;
            border-radius:0;
            background:transparent;
            color:#f2f6fa;
            padding:0;
            font:500 12px Inter,system-ui,sans-serif;
            text-align:left;
            font-variant-numeric:tabular-nums
          }
          .shadow-studio.ss-mobile-workspace-mode button.ss-mobile-slider-value{
            cursor:text
          }
          .shadow-studio.ss-mobile-workspace-mode button.ss-mobile-slider-value:hover{
            background:transparent
          }
          .shadow-studio.ss-mobile-workspace-mode input.ss-mobile-slider-value{
            outline:none;
            background:#ffffff12;
            color:#fff;
            border-radius:6px;
            padding:0 4px
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-slider-row input[type=range]{
            width:100%;
            min-width:0;
            margin:0;
            accent-color:var(--ss-mobile-blue);
            touch-action:manipulation
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-step{
            width:30px;
            height:30px;
            display:grid;
            place-items:center;
            border:0;
            border-radius:50%;
            background:#050505;
            color:#fff;
            padding:0;
            font:800 20px/1 Inter,system-ui,sans-serif;
            cursor:pointer
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-step:disabled{opacity:.3}
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-brush-tools-backdrop{
            position:fixed;
            inset:0;
            z-index:74;
            border:0;
            background:transparent
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-brush-tools{
            position:fixed;
            left:10px;
            bottom:calc(82px + env(safe-area-inset-bottom));
            z-index:76;
            width:min(228px,calc(100vw - 20px));
            max-height:min(68dvh,520px);
            overflow-y:auto;
            display:grid;
            grid-template-columns:repeat(2,minmax(0,1fr));
            gap:2px;
            box-sizing:border-box;
            padding:10px;
            border:1px solid #39434e;
            border-radius:18px;
            background:rgba(28,32,37,.95);
            box-shadow:0 12px 32px #0008;
            backdrop-filter:blur(12px);
            overscroll-behavior:contain
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-brush-tool{
            min-width:0;
            min-height:70px;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            gap:7px;
            border:0;
            border-radius:12px;
            background:transparent;
            color:#f3f5f7;
            padding:8px 4px;
            font:inherit;
            cursor:pointer;
            touch-action:manipulation
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-brush-tool:hover,
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-brush-tool.active{
            background:#202933
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-brush-tool.active{
            color:#69b6ff
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-brush-tool:disabled{
            opacity:.32;
            cursor:default
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-brush-tool i{
            font-size:25px
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-brush-tool span{
            max-width:100%;
            overflow:hidden;
            color:inherit;
            font-size:10px;
            font-weight:700;
            text-align:center;
            text-overflow:ellipsis;
            white-space:nowrap
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-brush-tool small{
            color:#93a0ad;
            font-size:7px;
            font-weight:800
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-dock{
            position:fixed;
            left:8px;
            right:8px;
            bottom:max(8px,env(safe-area-inset-bottom));
            z-index:70;
            min-height:62px;
            display:grid;
            grid-template-columns:repeat(7,minmax(0,1fr));
            overflow:hidden;
            box-sizing:border-box;
            border:1px solid #323b45;
            border-radius:18px;
            background:rgba(12,16,22,.94);
            box-shadow:0 10px 28px #0009;
            backdrop-filter:blur(12px)
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-dock-main,
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-chip,
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-size-chip,
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-collapse{
            min-width:0;
            min-height:62px;
            display:flex;
            align-items:center;
            justify-content:center;
            border:0;
            border-right:1px solid #242c35;
            background:transparent;
            color:#f5f7fa;
            padding:0;
            font:inherit;
            cursor:pointer;
            touch-action:manipulation
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-dock>*:last-child{
            border-right:0
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-dock-main.active,
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-chip.active,
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-size-chip.active{
            background:#171f28
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-dock-main i{font-size:22px}
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-dock-main span{
            display:none
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-tool-toggle{
            gap:0
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-toggle-icons{
            min-height:26px;
            display:flex;
            align-items:center;
            justify-content:center;
            gap:4px;
            color:#f3f3f3
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-toggle-icons .ss-mobile-toggle-tool{
            font-size:18px
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-toggle-icons .ss-mobile-toggle-arrow{
            color:#d8d8d8;
            font-size:10px
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-dock-main:disabled,
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-size-chip:disabled,
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-chip:disabled,
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-collapse:disabled{opacity:.3}
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-size-chip{
            padding:0 2px
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-size-badge{
            width:38px;
            height:38px;
            display:grid;
            place-items:center;
            border:1px solid #525d69;
            border-radius:50%;
            background:#11161c;
            color:#fff;
            font:700 12px Inter,system-ui,sans-serif;
            font-variant-numeric:tabular-nums
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-chip{
            position:relative
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-dot{
            width:30px;
            height:30px;
            box-sizing:border-box;
            border:1px solid #525d69;
            border-radius:6px;
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-collapse i{
            font-size:22px
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-layer-stack{
            position:relative;
            display:inline-flex;
            align-items:center;
            justify-content:center
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-layer-badge{
            position:absolute;
            top:-8px;
            right:-10px;
            min-width:18px;
            height:18px;
            display:grid;
            place-items:center;
            padding:0 3px;
            border:1px solid #d9dee4;
            border-radius:4px;
            background:#f3f5f7;
            color:#1f2933;
            font:700 11px/1 Inter,system-ui,sans-serif
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-sheet-backdrop{
            position:fixed;
            inset:0;
            z-index:88;
            background:#0007;
            backdrop-filter:blur(2px)
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-sheet{
            position:fixed;
            left:6px;
            right:6px;
            bottom:calc(76px + env(safe-area-inset-bottom));
            z-index:90;
            max-height:min(68dvh,600px);
            display:flex;
            flex-direction:column;
            overflow:hidden;
            box-sizing:border-box;
            border:1px solid #3b4855;
            border-radius:15px;
            background:#171d24;
            color:#eef3f8;
            box-shadow:0 -16px 40px #000c,inset 0 0 0 1px #ffffff05
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-sheet-head{
            flex:0 0 auto;
            min-height:46px;
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:8px;
            padding:7px 10px;
            border-bottom:1px solid #313b45;
            background:#1d252d
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-sheet-head strong{
            font-size:11px;
            font-weight:850
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-sheet-close{
            width:32px;
            height:32px;
            display:grid;
            place-items:center;
            border:1px solid #3c4955;
            border-radius:8px;
            background:#252e37;
            color:#fff;
            cursor:pointer
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-sheet-body{
            min-height:0;
            overflow-y:auto;
            padding:10px;
            overscroll-behavior:contain
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-layer-list{
            display:grid;
            gap:6px
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-layer-row{
            display:grid;
            grid-template-columns:36px minmax(0,1fr) 30px;
            gap:6px;
            align-items:center;
            min-height:48px;
            border:1px solid #34414d;
            border-radius:9px;
            background:#1e262f;
            padding:5px
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-layer-row.active{
            border-color:#4b9fff;
            background:#233c57
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-layer-select{
            min-width:0;
            height:36px;
            display:flex;
            align-items:center;
            gap:7px;
            border:0;
            background:transparent;
            color:#edf4fb;
            padding:0;
            text-align:left;
            font:inherit;
            cursor:pointer
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-layer-thumb{
            width:32px;
            height:32px;
            display:grid;
            place-items:center;
            flex:none;
            border:1px solid #485663;
            border-radius:6px;
            background:
              linear-gradient(45deg,#3a4148 25%,transparent 25%),
              linear-gradient(-45deg,#3a4148 25%,transparent 25%),
              linear-gradient(45deg,transparent 75%,#3a4148 75%),
              linear-gradient(-45deg,transparent 75%,#3a4148 75%),
              #252c33;
            background-size:10px 10px;
            background-position:0 0,0 5px,5px -5px,-5px 0;
            color:#dce7f2
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-layer-select span:last-child{
            min-width:0;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            font-size:9px;
            font-weight:700
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-layer-eye,
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-layer-lock{
            width:30px;
            height:34px;
            display:grid;
            place-items:center;
            border:0;
            border-radius:7px;
            background:#252f39;
            color:#d8e4ef;
            cursor:pointer
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-layer-eye.off{opacity:.42}
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-add-layer{
            width:100%;
            min-height:42px;
            display:flex;
            align-items:center;
            justify-content:center;
            gap:7px;
            margin-top:8px;
            border:1px solid #405264;
            border-radius:9px;
            background:#263544;
            color:#fff;
            font:750 10px Inter,system-ui,sans-serif;
            cursor:pointer
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-section-title{
            margin:8px 0 7px;
            color:#aebdca;
            font-size:8px;
            font-weight:850;
            letter-spacing:.06em;
            text-transform:uppercase
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-action-grid,
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-tools-grid{
            display:grid;
            grid-template-columns:repeat(4,minmax(0,1fr));
            gap:6px
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-action-grid button,
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-tools-grid button{
            min-width:0;
            min-height:58px;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            gap:5px;
            border:1px solid #34424f;
            border-radius:9px;
            background:#202933;
            color:#e7eef5;
            padding:5px 3px;
            font:inherit;
            cursor:pointer
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-action-grid button.active,
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-tools-grid button.active{
            border-color:#4b9fff;
            background:#244363;
            color:#fff
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-action-grid button:disabled,
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-tools-grid button:disabled{
            opacity:.35
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-action-grid i,
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-tools-grid i{
            font-size:17px
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-action-grid span,
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-tools-grid span{
            width:100%;
            overflow:hidden;
            font-size:8px;
            font-weight:700;
            text-align:center;
            text-overflow:ellipsis;
            white-space:nowrap
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-paper-list{
            display:grid;
            gap:5px
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-paper-list button{
            width:100%;
            min-height:38px;
            display:flex;
            align-items:center;
            gap:7px;
            border:1px solid #34414d;
            border-radius:8px;
            background:#1f2730;
            color:#e7eef5;
            padding:5px 8px;
            font:inherit;
            font-size:9px;
            font-weight:700;
            text-align:left;
            cursor:pointer
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-paper-list button.active{
            border-color:#4b9fff;
            background:#233d59
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-sheet .ss-brush-settings{
            margin:0;
            padding:0;
            border:0;
            background:transparent
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-sheet .ss-brush-settings>.ss-label{
            display:none
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-sheet .ss-brush-settings .ss-brush-mobile{
            display:none
          }
        }
        @media(max-width:380px){
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-ad{min-height:61px}
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-quick{gap:2px;padding-left:6px;padding-right:6px}
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-quick button{width:35px;min-width:35px;height:38px}
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-slider-row{grid-template-columns:31px 25px minmax(45px,1fr) 25px}
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-step{width:25px;height:25px}
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-action-grid,
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-tools-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
        }
      `}</style>

      <div className="ss-mobile-top">
        <div className="ss-mobile-ad" data-shadow-studio-mobile-ad-slot="reserved">
          <span className="ss-mobile-ad-placeholder">AD</span>
        </div>

        <nav className="ss-mobile-quick" aria-label={text.actions}>
          <button type="button" onClick={onImport} disabled={busy} aria-label={text.addImage} title={text.addImage}>
            <i className="fa-regular fa-image" aria-hidden="true" />
          </button>
          <button type="button" className={referenceOpen ? 'active' : ''} onClick={toggleReferenceWindow} disabled={busy} aria-label={text.reference} title={text.reference}>
            <i className="fa-regular fa-images" aria-hidden="true" />
          </button>
          <button type="button" className={['marquee', 'lasso', 'wand'].includes(tool) ? 'active' : ''} onClick={() => chooseTool('marquee')} disabled={busy} aria-label={text.selection} title={text.selection}>
            <i className="fa-solid fa-vector-square" aria-hidden="true" />
          </button>
          <button type="button" className={panel === 'stabilizer' || stabilizerValue > 0 ? 'active' : ''} onClick={() => openPanel('stabilizer')} disabled={busy} aria-label={`${text.stabilizer} ${stabilizerValue}`} title={`${text.stabilizer}: ${stabilizerValue}`}>
            <i className="fa-solid fa-wave-square" aria-hidden="true" />
            <span className="ss-mobile-stabilizer-badge" aria-hidden="true">{stabilizerValue}</span>
          </button>
          <button type="button" className={tool === 'shape' ? 'active' : ''} onClick={() => chooseTool('shape')} disabled={busy} aria-label={text.shape} title={text.shape}>
            <i className="fa-solid fa-shapes" aria-hidden="true" />
          </button>
          <button type="button" className={tool === 'ruler' ? 'active' : ''} onClick={() => chooseTool('ruler')} disabled={busy} aria-label={text.ruler} title={text.ruler}>
            <i className="fa-solid fa-ruler" aria-hidden="true" />
          </button>
          <span className="ss-mobile-quick-spacer" aria-hidden="true" />
          <button type="button" onClick={onUndo} disabled={busy || !canUndo} aria-label={text.undo} title={text.undo}>
            <i className="fa-solid fa-rotate-left" aria-hidden="true" />
          </button>
          <button type="button" onClick={onRedo} disabled={busy || !canRedo} aria-label={text.redo} title={text.redo}>
            <i className="fa-solid fa-rotate-right" aria-hidden="true" />
          </button>
        </nav>
      </div>

      <input
        ref={referenceInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        hidden
        onChange={chooseReferenceImage}
      />

      {referenceOpen && referenceImage ? (
        <aside className="ss-mobile-reference" aria-label={text.reference}>
          <img src={referenceImage} alt="" />
          <div className="ss-mobile-reference-actions">
            <button type="button" onClick={() => referenceInputRef.current?.click()}>{text.replaceReference}</button>
            <button type="button" onClick={() => setReferenceOpen(false)} aria-label={text.closeReference}>×</button>
          </div>
        </aside>
      ) : null}

      <div className={`ss-mobile-controls${controlsOpen ? '' : ' is-hidden'}`}>
        <div className="ss-mobile-sliders">
          <div className="ss-mobile-slider-row">
            {sizeEditing ? (
              <input
                type="number"
                className="ss-mobile-slider-value"
                min=".1"
                max={manualLogicalMax}
                step=".1"
                inputMode="decimal"
                autoFocus
                value={sizeDraft}
                aria-label={text.size}
                onChange={(event) => setSizeDraft(event.target.value)}
                onBlur={commitSizeEdit}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') event.currentTarget.blur()
                  if (event.key === 'Escape') {
                    setSizeDraft(formatSize(logicalSize))
                    setSizeEditing(false)
                  }
                }}
              />
            ) : (
              <button type="button" className="ss-mobile-slider-value" onClick={beginSizeEdit} disabled={busy} aria-label={`${text.size} ${formatSize(logicalSize)}`}>
                {formatSize(logicalSize)}
              </button>
            )}
            <button type="button" className="ss-mobile-step" onClick={() => adjustSize(-1)} disabled={busy || logicalSize <= .1} aria-label={`${text.size} -`}>−</button>
            <input
              type="range"
              min=".1"
              max={sliderMax}
              step=".1"
              value={sliderSize}
              disabled={busy}
              aria-label={`${text.size} ${formatSize(logicalSize)} · max ${sliderMax}`}
              onChange={(event) => applyLogicalSize(Number(event.target.value))}
            />
            <button type="button" className="ss-mobile-step" onClick={() => adjustSize(1)} disabled={busy || logicalSize >= sliderMax} aria-label={`${text.size} +`}>+</button>
          </div>

          <div className="ss-mobile-slider-row">
            <output className="ss-mobile-slider-value" aria-label={`${text.opacity} ${Math.round(Number(opacity) || 0)}`}>{Math.round(Number(opacity) || 0)}</output>
            <button type="button" className="ss-mobile-step" onClick={() => adjustOpacity(-1)} disabled={busy || Number(opacity) <= 10} aria-label={`${text.opacity} -`}>−</button>
            <input type="range" min="10" max="100" step="1" value={Math.max(10, Number(opacity) || 10)} disabled={busy} aria-label={text.opacity} onChange={(event) => onOpacityChange?.(Number(event.target.value))} />
            <button type="button" className="ss-mobile-step" onClick={() => adjustOpacity(1)} disabled={busy || Number(opacity) >= 100} aria-label={`${text.opacity} +`}>+</button>
          </div>
        </div>
      </div>

      {brushToolsOpen ? (
        <>
          <button
            type="button"
            className="ss-mobile-brush-tools-backdrop"
            aria-label={text.close}
            onClick={() => setBrushToolsOpen(false)}
          />
          <section className="ss-mobile-brush-tools" aria-label={text.tools}>
            {MOBILE_BRUSH_TOOLS.map((item) => {
              const catalogTool = STUDIO_TOOLS_BY_ID[item.id]
              const available = !item.disabled && STUDIO_WORKING_TOOLS.has(item.id) && catalogTool
              const icon = item.icon || catalogTool?.icon || 'fa-circle'

              return (
                <button
                  type="button"
                  key={item.id}
                  className={`ss-mobile-brush-tool ${tool === item.id ? 'active' : ''}`}
                  disabled={busy || !available}
                  onClick={() => available && chooseTool(item.id)}
                  aria-label={item.label}
                  title={item.label}
                >
                  <i className={`fa-solid ${icon}`} aria-hidden="true" />
                  <span>{item.label}</span>
                  {!available ? <small>Soon</small> : null}
                </button>
              )
            })}
          </section>
        </>
      ) : null}

      <nav className="ss-mobile-dock" aria-label={text.tools}>
        <button
          type="button"
          className="ss-mobile-dock-main ss-mobile-tool-toggle"
          onClick={toggleBrushEraser}
          disabled={busy}
          aria-label={`${text.brush} / ${text.eraser}`}
          title={`${text.brush} ↔ ${text.eraser}`}
        >
          <span className="ss-mobile-toggle-icons" aria-hidden="true">
            <i className="fa-solid fa-paintbrush ss-mobile-toggle-tool" />
            <i className="fa-solid fa-arrow-right-arrow-left ss-mobile-toggle-arrow" />
            <i className="fa-solid fa-eraser ss-mobile-toggle-tool" />
          </span>
        </button>

        <button
          type="button"
          className={`ss-mobile-dock-main ${brushToolsOpen ? 'active' : ''}`}
          onClick={() => {
            setColorOpen(false)
            setPanel('')
            setBrushToolsOpen((current) => !current)
          }}
          disabled={busy}
          aria-label={activeToolLabel}
          aria-expanded={brushToolsOpen}
          title={activeToolLabel}
        >
          <i className={`fa-solid ${activeToolIcon}`} aria-hidden="true" />
          <span>{activeToolLabel}</span>
        </button>

        <button
          type="button"
          className={`ss-mobile-size-chip ${controlsOpen ? 'active' : ''}`}
          onClick={() => {
            if (!controlsOpen) {
              setControlsOpen(true)
              return
            }
            beginSizeEdit()
          }}
          disabled={busy}
          aria-label={`${text.size} ${formatSize(logicalSize)}`}
          title={`${text.size} ${formatSize(logicalSize)}`}
        >
          <span className="ss-mobile-size-badge">{formatSize(logicalSize)}</span>
        </button>

        <button
          type="button"
          className={`ss-mobile-color-chip ${colorOpen ? 'active' : ''}`}
          aria-label={colorOpen ? text.close : text.color}
          aria-expanded={colorOpen}
          disabled={busy}
          onClick={() => {
            setPanel('')
            setBrushToolsOpen(false)
            setColorOpen((current) => !current)
          }}
          title={text.color}
        >
          <span className="ss-mobile-color-dot" style={{ backgroundColor: color || '#111111' }} aria-hidden="true" />
        </button>

        <button
          type="button"
          className="ss-mobile-collapse"
          onClick={() => setControlsOpen((current) => !current)}
          aria-label={controlsOpen ? text.hideControls : text.showControls}
          title={controlsOpen ? text.hideControls : text.showControls}
        >
          <i className={`fa-solid ${controlsOpen ? 'fa-chevron-down' : 'fa-chevron-up'}`} aria-hidden="true" />
        </button>

        <button
          type="button"
          className={`ss-mobile-dock-main ${panel === 'layers' ? 'active' : ''}`}
          onClick={() => openPanel('layers')}
          disabled={busy}
          aria-label={text.layers}
          title={text.layers}
        >
          <span className="ss-mobile-layer-stack" aria-hidden="true">
            <i className="fa-solid fa-layer-group" />
            <span className="ss-mobile-layer-badge">{Math.max(1, layers.length || 1)}</span>
          </span>
          <span>{text.layers}</span>
        </button>

        <button
          type="button"
          className={`ss-mobile-dock-main ${panel === 'more' ? 'active' : ''}`}
          onClick={() => openPanel('more')}
          disabled={busy}
          aria-label={text.more}
          title={text.more}
        >
          <i className="fa-solid fa-ellipsis" aria-hidden="true" />
          <span>{text.more}</span>
        </button>
      </nav>

      <StudioMobileColorPopup
        open={colorOpen}
        color={color}
        opacity={opacity}
        disabled={busy}
        onChange={(nextColor) => onColorChange?.(nextColor)}
        onOpacityChange={(nextOpacity) => onOpacityChange?.(nextOpacity)}
        onClose={() => setColorOpen(false)}
      />

      {panel ? (
        <>
          <button type="button" className="ss-mobile-sheet-backdrop" aria-label={text.close} onClick={() => setPanel('')} />
          <section className="ss-mobile-sheet" role="dialog" aria-modal="true" aria-label={panelTitle}>
            <header className="ss-mobile-sheet-head">
              <strong>{panelTitle}</strong>
              <button type="button" className="ss-mobile-sheet-close" onClick={() => setPanel('')} aria-label={text.close}>×</button>
            </header>

            <div className="ss-mobile-sheet-body">
              {panel === 'layers' ? (
                <>
                  <div className="ss-mobile-layer-list">
                    {[...layers].reverse().map((layer) => (
                      <div className={`ss-mobile-layer-row ${layer.id === activeLayerId ? 'active' : ''}`} key={layer.id}>
                        <button type="button" className={`ss-mobile-layer-eye ${layer.visible === false ? 'off' : ''}`} onClick={() => onLayerAction?.('visibility', layer.id)} aria-label={`${text.layers}: ${layer.name}`}>
                          <i className={`fa-solid ${layer.visible === false ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" />
                        </button>
                        <button type="button" className="ss-mobile-layer-select" onClick={() => onLayerAction?.('select', layer.id)}>
                          <span className="ss-mobile-layer-thumb"><i className="fa-regular fa-image" aria-hidden="true" /></span>
                          <span>{layer.name || 'Layer'}</span>
                        </button>
                        <button type="button" className="ss-mobile-layer-lock" onClick={() => onLayerAction?.('lock', layer.id)} aria-label={layer.locked ? 'Unlock layer' : 'Lock layer'}>
                          <i className={`fa-solid ${layer.locked ? 'fa-lock' : 'fa-lock-open'}`} aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button type="button" className="ss-mobile-add-layer" onClick={() => onLayerAction?.('add')} disabled={busy}>
                    <i className="fa-solid fa-plus" aria-hidden="true" />
                    <span>{text.addLayer}</span>
                  </button>
                </>
              ) : null}

              {panel === 'presets' ? (
                <StudioBrushSettings
                  size={size}
                  onSizeChange={onSizeChange}
                  style={brushStyle}
                  onStyleChange={(nextStyle) => {
                    onBrushStyleChange?.(nextStyle)
                    onToolChange?.('brush')
                  }}
                  opacity={opacity}
                  onOpacityChange={onOpacityChange}
                  labels={{ size: text.size, opacity: text.opacity }}
                />
              ) : null}

              {panel === 'stabilizer' ? (
                <div className="ss-mobile-stabilizer-control">
                  <output>{stabilizerValue}</output>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={stabilizerValue}
                    aria-label={text.stabilizer}
                    onChange={(event) => onStabilizerChange?.(Number(event.target.value))}
                  />
                </div>
              ) : null}

              {panel === 'more' ? (
                <>
                  <div className="ss-mobile-section-title">{text.actions}</div>
                  <div className="ss-mobile-action-grid">
                    <button type="button" onClick={() => { onHome?.(); setPanel('') }} disabled={busy}>
                      <i className="fa-solid fa-house" aria-hidden="true" /><span>{text.home}</span>
                    </button>
                    <button type="button" onClick={() => { onNewPaper?.(); setPanel('') }} disabled={busy}>
                      <i className="fa-solid fa-file-circle-plus" aria-hidden="true" /><span>{text.newPaper}</span>
                    </button>
                    <button type="button" onClick={() => { onSave?.(); setPanel('') }} disabled={busy}>
                      <i className="fa-solid fa-floppy-disk" aria-hidden="true" /><span>{text.save}</span>
                    </button>
                    <button type="button" onClick={() => { onExport?.(); setPanel('') }} disabled={busy}>
                      <i className="fa-solid fa-arrow-up-from-bracket" aria-hidden="true" /><span>{text.export}</span>
                    </button>
                    <button type="button" onClick={() => { onFit?.(); setPanel('') }} disabled={busy}>
                      <i className="fa-solid fa-expand" aria-hidden="true" /><span>{text.fit}</span>
                    </button>
                    <button type="button" className={showGrid ? 'active' : ''} onClick={onToggleGrid} disabled={busy}>
                      <i className="fa-solid fa-border-all" aria-hidden="true" /><span>{text.grid}</span>
                    </button>
                    <button type="button" onClick={() => { onImport?.(); setPanel('') }} disabled={busy}>
                      <i className="fa-regular fa-image" aria-hidden="true" /><span>{text.import}</span>
                    </button>
                    <button type="button" onClick={() => setPanel('presets')} disabled={busy}>
                      <i className="fa-solid fa-sliders" aria-hidden="true" /><span>{text.presets}</span>
                    </button>
                  </div>

                  {documents.length > 1 ? (
                    <>
                      <div className="ss-mobile-section-title">{text.papers}</div>
                      <div className="ss-mobile-paper-list">
                        {documents.map((document) => (
                          <button type="button" className={document.id === activeDocumentId ? 'active' : ''} key={document.id} onClick={() => { onSwitchPaper?.(document.id); setPanel('') }} disabled={busy}>
                            <i className="fa-regular fa-file-image" aria-hidden="true" />
                            <span>{document.name || 'Untitled'}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  ) : null}

                  {toolGroups.map((group) => (
                    <div key={group.id}>
                      <div className="ss-mobile-section-title">{tx(`studioTools.groups.${group.id}`)}</div>
                      <div className="ss-mobile-tools-grid">
                        {group.tools.map((item) => (
                          <button type="button" className={tool === item.id ? 'active' : ''} key={item.id} onClick={() => chooseTool(item.id)} disabled={busy}>
                            <i className={`fa-solid ${STUDIO_TOOLS_BY_ID[item.id]?.icon || 'fa-wrench'}`} aria-hidden="true" />
                            <span>{toolLabel(item.id)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              ) : null}
            </div>
          </section>
        </>
      ) : null}
    </div>
  )
}
