import { useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import StudioBrushSettings from './StudioBrushSettings'
import { STUDIO_TOOL_GROUPS, STUDIO_TOOLS_BY_ID, STUDIO_WORKING_TOOLS } from './StudioToolCatalog'

const MOBILE_TEXT = {
  en: {
    ad: 'Reserved Ad Space',
    adSub: 'Future ads and promotions',
    undo: 'Undo',
    redo: 'Redo',
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
}) {
  const { t: tx, language } = useDisplayTranslation()
  const text = MOBILE_TEXT[language] || MOBILE_TEXT.en
  const [controlsOpen, setControlsOpen] = useState(true)
  const [panel, setPanel] = useState('')

  const openPanel = (name) => setPanel((current) => current === name ? '' : name)
  const toolGroups = STUDIO_TOOL_GROUPS.map((group) => ({
    ...group,
    tools: group.tools.filter((item) => STUDIO_WORKING_TOOLS.has(item.id) && !['brush', 'eraser'].includes(item.id)),
  })).filter((group) => group.tools.length)

  function chooseTool(next) {
    if (busy) return
    onToolChange?.(next)
    setPanel('')
  }

  function adjustSize(direction) {
    const step = sizeStep(size)
    onSizeChange?.(clamp(Number(size) + direction * step, 0.1, 5000))
  }

  function adjustOpacity(direction) {
    onOpacityChange?.(clamp(Number(opacity) + direction * 5, 10, 100))
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
            --ss-mobile-bg:#0f141a;
            --ss-mobile-panel:#171d24;
            --ss-mobile-panel-2:#1e252d;
            --ss-mobile-line:#323c47;
            --ss-mobile-text:#f4f7fb;
            --ss-mobile-muted:#9aa8b7;
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
            display:grid;
            gap:7px;
            width:100%;
            box-sizing:border-box;
            padding:max(6px,env(safe-area-inset-top)) 8px 7px;
            border-bottom:1px solid #252d36;
            background:#0e1319
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-ad{
            min-height:68px;
            display:flex;
            align-items:center;
            gap:10px;
            overflow:hidden;
            box-sizing:border-box;
            border:1px solid #394b68;
            border-radius:12px;
            padding:9px 12px;
            background:
              radial-gradient(circle at 86% 25%,rgba(68,94,188,.5),transparent 28%),
              linear-gradient(120deg,#17243a,#1a2041 56%,#101a2d);
            box-shadow:inset 0 0 0 1px #ffffff08
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-ad-badge{
            flex:0 0 auto;
            align-self:flex-start;
            min-width:25px;
            height:20px;
            display:grid;
            place-items:center;
            border:1px solid #91a2bd;
            border-radius:5px;
            color:#dce8fa;
            font-size:9px;
            font-weight:800
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-ad-copy{
            min-width:0;
            display:grid;
            gap:2px
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-ad-copy strong{
            overflow:hidden;
            color:#fff;
            font-size:13px;
            font-weight:850;
            text-overflow:ellipsis;
            white-space:nowrap
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-ad-copy small{
            overflow:hidden;
            color:#a9b8ca;
            font-size:9px;
            text-overflow:ellipsis;
            white-space:nowrap
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-quick{
            display:grid;
            grid-template-columns:repeat(5,minmax(0,1fr));
            min-height:55px;
            overflow:hidden;
            border:1px solid #29333e;
            border-radius:11px;
            background:linear-gradient(180deg,#1b222a,#151b21)
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-quick button{
            min-width:0;
            min-height:55px;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            gap:4px;
            border:0;
            border-right:1px solid #2a333c;
            background:transparent;
            color:#e8eef5;
            padding:4px 2px;
            font:inherit;
            cursor:pointer;
            touch-action:manipulation
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-quick button:last-child{border-right:0}
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-quick button:disabled{opacity:.32}
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-quick button.active{
            background:#263d56;
            color:#fff
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-quick button i{
            font-size:18px;
            line-height:1
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-quick button span{
            max-width:100%;
            overflow:hidden;
            font-size:8px;
            font-weight:700;
            text-overflow:ellipsis;
            white-space:nowrap
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
            display:grid;
            grid-template-columns:52px minmax(0,1fr) 54px;
            gap:8px;
            align-items:stretch;
            box-sizing:border-box;
            min-height:96px;
            padding:8px;
            border:1px solid #343f4a;
            border-radius:12px;
            background:#171d24f4;
            box-shadow:0 -8px 24px #0008,inset 0 0 0 1px #ffffff05;
            backdrop-filter:blur(16px)
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-controls.is-hidden{display:none}
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-brush-preview{
            display:grid;
            place-items:center;
            overflow:hidden;
            border:1px solid #384653;
            border-radius:9px;
            background:#11171d;
            color:#fff
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-brush-preview svg{
            width:43px;
            height:31px
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-sliders{
            min-width:0;
            display:grid;
            gap:5px;
            align-content:center
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-slider-row{
            min-width:0;
            display:grid;
            grid-template-columns:36px 28px minmax(54px,1fr) 28px;
            gap:4px;
            align-items:center
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-slider-value{
            color:#eaf1f8;
            font-size:10px;
            font-weight:800;
            text-align:right;
            font-variant-numeric:tabular-nums
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-slider-row input[type=range]{
            width:100%;
            min-width:0;
            accent-color:var(--ss-mobile-blue);
            touch-action:manipulation
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-step{
            width:28px;
            height:28px;
            display:grid;
            place-items:center;
            border:1px solid #3b4854;
            border-radius:50%;
            background:#10161c;
            color:#fff;
            padding:0;
            font:800 17px/1 Inter,system-ui,sans-serif;
            cursor:pointer
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-step:disabled{opacity:.3}
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-presets{
            min-width:0;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            gap:5px;
            border:1px solid #394754;
            border-radius:9px;
            background:#1d252d;
            color:#dbe5ee;
            padding:4px;
            font:inherit;
            cursor:pointer
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-presets i{font-size:16px}
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-presets span{font-size:8px;font-weight:700}
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-dock{
            position:fixed;
            left:8px;
            right:8px;
            bottom:max(4px,env(safe-area-inset-bottom));
            z-index:70;
            min-height:66px;
            display:grid;
            grid-template-columns:repeat(4,minmax(0,1fr)) minmax(0,1.18fr);
            overflow:hidden;
            box-sizing:border-box;
            border:1px solid #303b46;
            border-radius:14px;
            background:#11171df6;
            box-shadow:0 -7px 25px #000a,inset 0 0 0 1px #ffffff05;
            backdrop-filter:blur(18px)
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-dock-main,
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-label{
            min-width:0;
            min-height:64px;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            gap:4px;
            border:0;
            border-right:1px solid #29323b;
            background:transparent;
            color:#e7edf4;
            padding:4px 2px;
            font:inherit;
            cursor:pointer;
            touch-action:manipulation
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-dock-main.active{
            background:linear-gradient(180deg,#234d7d,#1a3657);
            color:#68b3ff;
            box-shadow:inset 0 0 0 1px #499ef5
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-dock-main i{font-size:20px}
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-dock-main span,
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-label span{
            max-width:100%;
            overflow:hidden;
            font-size:8px;
            font-weight:700;
            text-overflow:ellipsis;
            white-space:nowrap
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-dock-main:disabled{opacity:.3}
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-label{
            position:relative
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-label input{
            position:absolute;
            width:1px;
            height:1px;
            opacity:0;
            pointer-events:none
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-dot{
            width:27px;
            height:27px;
            box-sizing:border-box;
            border:3px solid #f5f7fa;
            border-radius:50%;
            box-shadow:0 0 0 1px #000,0 2px 8px #0008
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-more-cell{
            min-width:0;
            display:grid;
            grid-template-columns:minmax(0,1fr) 29px
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-more-cell>.ss-mobile-dock-main{
            border-right:0
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-collapse{
            width:29px;
            min-width:29px;
            height:100%;
            display:grid;
            place-items:center;
            border:0;
            border-left:1px solid #29323b;
            background:#161d24;
            color:#b8c5d1;
            padding:0;
            cursor:pointer;
            touch-action:manipulation
          }
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-collapse i{font-size:12px}
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
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-ad-copy strong{font-size:11px}
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-quick button span,
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-dock-main span,
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-color-label span{font-size:7px}
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-controls{grid-template-columns:44px minmax(0,1fr) 48px}
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-slider-row{grid-template-columns:31px 25px minmax(45px,1fr) 25px}
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-step{width:25px;height:25px}
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-action-grid,
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-tools-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
        }
      `}</style>

      <div className="ss-mobile-top">
        <div className="ss-mobile-ad" data-shadow-studio-mobile-ad-slot="reserved">
          <span className="ss-mobile-ad-badge">AD</span>
          <span className="ss-mobile-ad-copy">
            <strong>{text.ad}</strong>
            <small>{text.adSub}</small>
          </span>
        </div>

        <nav className="ss-mobile-quick" aria-label={text.actions}>
          <button type="button" onClick={onUndo} disabled={busy || !canUndo} aria-label={text.undo}>
            <i className="fa-solid fa-rotate-left" aria-hidden="true" />
            <span>{text.undo}</span>
          </button>
          <button type="button" onClick={onRedo} disabled={busy || !canRedo} aria-label={text.redo}>
            <i className="fa-solid fa-rotate-right" aria-hidden="true" />
            <span>{text.redo}</span>
          </button>
          <button type="button" className={['marquee', 'lasso', 'wand'].includes(tool) ? 'active' : ''} onClick={() => chooseTool('marquee')} disabled={busy} aria-label={text.select}>
            <i className="fa-solid fa-vector-square" aria-hidden="true" />
            <span>{text.select}</span>
          </button>
          <button type="button" onClick={onImport} disabled={busy} aria-label={text.import}>
            <i className="fa-regular fa-image" aria-hidden="true" />
            <span>{text.import}</span>
          </button>
          <button type="button" className={panel === 'layers' ? 'active' : ''} onClick={() => openPanel('layers')} disabled={busy} aria-label={text.layers}>
            <i className="fa-solid fa-layer-group" aria-hidden="true" />
            <span>{text.layers}</span>
          </button>
        </nav>
      </div>

      <div className={`ss-mobile-controls${controlsOpen ? '' : ' is-hidden'}`}>
        <div className="ss-mobile-brush-preview" aria-hidden="true">
          <svg viewBox="0 0 54 36">
            <path d="M6 27 C15 9 30 28 48 9" fill="none" stroke="currentColor" strokeWidth={Math.max(2, Math.min(11, Number(size) / 5 || 2))} strokeLinecap={brushStyle === 'marker' ? 'square' : 'round'} opacity={Math.max(.1, Number(opacity) / 100 || 1)} />
          </svg>
        </div>

        <div className="ss-mobile-sliders">
          <div className="ss-mobile-slider-row">
            <output className="ss-mobile-slider-value" aria-label={`${text.size} ${formatSize(size)}`}>{formatSize(size)}</output>
            <button type="button" className="ss-mobile-step" onClick={() => adjustSize(-1)} disabled={busy || Number(size) <= .1} aria-label={`${text.size} -`}>−</button>
            <input type="range" min=".1" max="5000" step=".1" value={Math.max(.1, Number(size) || .1)} disabled={busy} aria-label={text.size} onChange={(event) => onSizeChange?.(Number(event.target.value))} />
            <button type="button" className="ss-mobile-step" onClick={() => adjustSize(1)} disabled={busy || Number(size) >= 5000} aria-label={`${text.size} +`}>+</button>
          </div>

          <div className="ss-mobile-slider-row">
            <output className="ss-mobile-slider-value" aria-label={`${text.opacity} ${Math.round(Number(opacity) || 0)}`}>{Math.round(Number(opacity) || 0)}</output>
            <button type="button" className="ss-mobile-step" onClick={() => adjustOpacity(-1)} disabled={busy || Number(opacity) <= 10} aria-label={`${text.opacity} -`}>−</button>
            <input type="range" min="10" max="100" step="1" value={Math.max(10, Number(opacity) || 10)} disabled={busy} aria-label={text.opacity} onChange={(event) => onOpacityChange?.(Number(event.target.value))} />
            <button type="button" className="ss-mobile-step" onClick={() => adjustOpacity(1)} disabled={busy || Number(opacity) >= 100} aria-label={`${text.opacity} +`}>+</button>
          </div>
        </div>

        <button type="button" className="ss-mobile-presets" onClick={() => openPanel('presets')} disabled={busy}>
          <i className="fa-solid fa-sliders" aria-hidden="true" />
          <span>{text.presets}</span>
        </button>
      </div>

      <nav className="ss-mobile-dock" aria-label={text.tools}>
        <button type="button" className={`ss-mobile-dock-main ${tool === 'brush' ? 'active' : ''}`} onClick={() => chooseTool('brush')} disabled={busy}>
          <i className="fa-solid fa-paintbrush" aria-hidden="true" />
          <span>{text.brush}</span>
        </button>

        <button type="button" className={`ss-mobile-dock-main ${tool === 'eraser' ? 'active' : ''}`} onClick={() => chooseTool('eraser')} disabled={busy}>
          <i className="fa-solid fa-eraser" aria-hidden="true" />
          <span>{text.eraser}</span>
        </button>

        <label className="ss-mobile-color-label" aria-label={text.color}>
          <input type="color" value={color || '#111111'} disabled={busy} onChange={(event) => onColorChange?.(event.target.value)} />
          <span className="ss-mobile-color-dot" style={{ backgroundColor: color || '#111111' }} aria-hidden="true" />
          <span>{text.color}</span>
        </label>

        <button type="button" className={`ss-mobile-dock-main ${panel === 'layers' ? 'active' : ''}`} onClick={() => openPanel('layers')} disabled={busy}>
          <i className="fa-solid fa-layer-group" aria-hidden="true" />
          <span>{text.layers}{layers.length ? ` ${layers.length}` : ''}</span>
        </button>

        <div className="ss-mobile-more-cell">
          <button type="button" className={`ss-mobile-dock-main ${panel === 'more' ? 'active' : ''}`} onClick={() => openPanel('more')} disabled={busy}>
            <i className="fa-solid fa-ellipsis" aria-hidden="true" />
            <span>{text.more}</span>
          </button>
          <button type="button" className="ss-mobile-collapse" onClick={() => setControlsOpen((current) => !current)} aria-label={controlsOpen ? text.hideControls : text.showControls} title={controlsOpen ? text.hideControls : text.showControls}>
            <i className={`fa-solid ${controlsOpen ? 'fa-chevron-down' : 'fa-chevron-up'}`} aria-hidden="true" />
          </button>
        </div>
      </nav>

      {panel ? (
        <>
          <button type="button" className="ss-mobile-sheet-backdrop" aria-label={text.close} onClick={() => setPanel('')} />
          <section className="ss-mobile-sheet" role="dialog" aria-modal="true" aria-label={panel === 'layers' ? text.layers : panel === 'presets' ? text.brushSettings : text.more}>
            <header className="ss-mobile-sheet-head">
              <strong>{panel === 'layers' ? text.layers : panel === 'presets' ? text.brushSettings : text.more}</strong>
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
