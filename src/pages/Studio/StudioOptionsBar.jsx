import { useDisplayTranslation } from '../../utils/displayLanguage'
import StudioPrecisionInput from './StudioPrecisionInput'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
registerTranslationNamespace('studioOptions', {
  "en": {
    "toolbar": "Shadow Studio tool options",
    "brush": "Brush",
    "eraser": "Eraser",
    "eyedropper": "Eyedropper",
    "tool": "Tool",
    "options": "options",
    "size": "Size",
    "brushSize": "Brush size",
    "opacity": "Opacity",
    "brushOpacity": "Brush opacity",
    "grid": "Grid",
    "toggleGrid": "Show or hide grid",
    "fit": "Fit",
    "fitPaper": "Fit paper to workspace",
    "undo": "Undo",
    "redo": "Redo",
    "new": "New",
    "newPaper": "New paper",
    "save": "Save",
    "saveProject": "Save Studio project",
    "export": "Export",
    "exportImage": "Export image"
  },
  "km": {
    "toolbar": "ការកំណត់ឧបករណ៍ Shadow Studio",
    "brush": "ជក់",
    "eraser": "ជ័រលុប",
    "eyedropper": "ចាប់ពណ៌",
    "tool": "ឧបករណ៍",
    "options": "— ការកំណត់",
    "size": "ទំហំ",
    "brushSize": "ទំហំជក់",
    "opacity": "ភាពស្រអាប់",
    "brushOpacity": "ភាពស្រអាប់នៃជក់",
    "grid": "ក្រឡាចត្រង្គ",
    "toggleGrid": "បង្ហាញ ឬលាក់ក្រឡាចត្រង្គ",
    "fit": "សមអេក្រង់",
    "fitPaper": "បង្ហាញក្រដាសឱ្យសមនឹងផ្ទាំងការងារ",
    "undo": "មិនធ្វើវិញ",
    "redo": "ធ្វើឡើងវិញ",
    "new": "ថ្មី",
    "newPaper": "ក្រដាសថ្មី",
    "save": "រក្សាទុក",
    "saveProject": "រក្សាទុកគម្រោង Studio",
    "export": "Export",
    "exportImage": "Export រូបភាព"
  },
  "zh": {
    "toolbar": "Shadow Studio 工具选项",
    "brush": "画笔",
    "eraser": "橡皮擦",
    "eyedropper": "吸管",
    "tool": "工具",
    "options": "选项",
    "size": "大小",
    "brushSize": "画笔大小",
    "opacity": "不透明度",
    "brushOpacity": "画笔不透明度",
    "grid": "网格",
    "toggleGrid": "显示或隐藏网格",
    "fit": "适合",
    "fitPaper": "使画布适合工作区",
    "undo": "撤销",
    "redo": "重做",
    "new": "新建",
    "newPaper": "新建画布",
    "save": "保存",
    "saveProject": "保存 Studio 项目",
    "export": "导出",
    "exportImage": "导出图像"
  },
  "ja": {
    "toolbar": "Shadow Studio ツールオプション",
    "brush": "ブラシ",
    "eraser": "消しゴム",
    "eyedropper": "スポイト",
    "tool": "ツール",
    "options": "オプション",
    "size": "サイズ",
    "brushSize": "ブラシサイズ",
    "opacity": "不透明度",
    "brushOpacity": "ブラシの不透明度",
    "grid": "グリッド",
    "toggleGrid": "グリッドの表示・非表示",
    "fit": "全体表示",
    "fitPaper": "キャンバスを作業領域に合わせる",
    "undo": "元に戻す",
    "redo": "やり直す",
    "new": "新規",
    "newPaper": "新規キャンバス",
    "save": "保存",
    "saveProject": "Studio プロジェクトを保存",
    "export": "書き出し",
    "exportImage": "画像を書き出し"
  },
  "ko": {
    "toolbar": "Shadow Studio 도구 옵션",
    "brush": "브러시",
    "eraser": "지우개",
    "eyedropper": "스포이트",
    "tool": "도구",
    "options": "옵션",
    "size": "크기",
    "brushSize": "브러시 크기",
    "opacity": "불투명도",
    "brushOpacity": "브러시 불투명도",
    "grid": "격자",
    "toggleGrid": "격자 표시 또는 숨기기",
    "fit": "맞춤",
    "fitPaper": "캔버스를 작업 영역에 맞추기",
    "undo": "실행 취소",
    "redo": "다시 실행",
    "new": "새로 만들기",
    "newPaper": "새 캔버스",
    "save": "저장",
    "saveProject": "Studio 프로젝트 저장",
    "export": "내보내기",
    "exportImage": "이미지 내보내기"
  }
})

export default function StudioOptionsBar({
  tool, paper, size, opacity, showGrid, busy, canUndo, canRedo,
  onSizeChange, onOpacityChange, onToggleGrid, onUndo, onRedo,
  onFit, onNew, onSave, onExport,
}) {
  const { t: tx, language } = useDisplayTranslation()
  const toolName = {
  brush: tx('studioOptions.brush'),
  eraser: tx('studioOptions.eraser'),
  eyedropper: tx('studioOptions.eyedropper'),
  pencil: { km: 'ខ្មៅដៃ', en: 'Pencil', zh: '铅笔', ja: '鉛筆', ko: '연필' }[language] || 'Pencil',
  shape: { km: 'រូបរាង', en: 'Shape', zh: '形状', ja: '図形', ko: '도형' }[language] || 'Shape',
}[tool] || tx('studioOptions.tool')
  return (
    <div className="ss-options-bar" role="toolbar" aria-label={tx('studioOptions.toolbar')}>
      <style>{`
        .shadow-studio .ss-options-bar{
          --ss-opt-bg:#29313a;
          --ss-opt-bg-2:#202832;
          --ss-opt-bg-3:#313b46;
          --ss-opt-line:#4b5968;
          --ss-opt-line-soft:#3b4651;
          --ss-opt-text:#edf3fa;
          --ss-opt-muted:#aab8c6;
          --ss-opt-blue:#5faeff;
          --ss-opt-blue-soft:#355d84;
          display:flex;
          align-items:center;
          gap:9px;
          flex:0 0 44px;
          min-height:44px;
          width:100%;
          min-width:0;
          box-sizing:border-box;
          padding:5px 10px;
          border-bottom:1px solid var(--ss-opt-line);
          background:linear-gradient(180deg,#303a45,#29313a);
          color:var(--ss-opt-text);
          overflow-x:auto;
          overflow-y:hidden;
          scrollbar-width:thin;
          white-space:nowrap;
          font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          box-shadow:inset 0 -1px 0 #0004
        }
        .shadow-studio .ss-options-bar .ss-opt-title{
          display:flex;
          align-items:center;
          gap:8px;
          min-width:118px;
          max-width:190px;
          min-height:32px;
          padding:0 8px;
          border:1px solid var(--ss-opt-line-soft);
          border-radius:7px;
          background:var(--ss-opt-bg-2);
          color:#e4edf6;
          font-size:10px;
          font-weight:800
        }
        .shadow-studio .ss-options-bar .ss-opt-title i{
          width:22px;
          height:22px;
          display:grid;
          place-items:center;
          flex:none;
          border-radius:5px;
          background:#2d3e50;
          color:#8fc4f7;
          font-size:11px
        }
        .shadow-studio .ss-options-bar .ss-opt-title span{
          min-width:0;
          overflow:hidden;
          text-overflow:ellipsis
        }
        .shadow-studio .ss-options-bar .ss-opt-separator{
          height:24px;
          width:1px;
          flex:none;
          background:var(--ss-opt-line)
        }
        .shadow-studio .ss-options-bar .ss-opt-range{
          display:flex;
          align-items:center;
          gap:6px;
          color:#c9d7e4;
          font-size:9px;
          font-weight:800
        }
        .shadow-studio .ss-options-bar .ss-opt-range input[type="range"]{
          width:84px;
          min-width:84px;
          height:20px;
          margin:0;
          appearance:none;
          background:transparent;
          cursor:pointer
        }
        .shadow-studio .ss-options-bar .ss-opt-range input[type="range"]::-webkit-slider-runnable-track{
          height:4px;
          border-radius:99px;
          background:#171d23;
          box-shadow:inset 0 0 0 1px #4b5968
        }
        .shadow-studio .ss-options-bar .ss-opt-range input[type="range"]::-webkit-slider-thumb{
          width:15px;
          height:15px;
          margin-top:-5.5px;
          appearance:none;
          border:2px solid #e5f2ff;
          border-radius:50%;
          background:var(--ss-opt-blue);
          box-shadow:0 1px 5px #0008
        }
        .shadow-studio .ss-options-bar .ss-opt-range input[type="range"]::-moz-range-track{
          height:4px;
          border:1px solid #4b5968;
          border-radius:99px;
          background:#171d23
        }
        .shadow-studio .ss-options-bar .ss-opt-range input[type="range"]::-moz-range-thumb{
          width:13px;
          height:13px;
          border:2px solid #e5f2ff;
          border-radius:50%;
          background:var(--ss-opt-blue);
          box-shadow:0 1px 5px #0008
        }
        .shadow-studio .ss-options-bar .ss-opt-range input[type="range"]:focus-visible{
          outline:2px solid var(--ss-opt-blue);
          outline-offset:3px
        }
        .shadow-studio .ss-options-bar .ss-opt-range input[type="range"]:disabled{
          opacity:.45;
          cursor:default
        }
        .shadow-studio .ss-options-bar .ss-opt-range output{
          min-width:36px;
          color:var(--ss-opt-muted);
          text-align:right;
          font-size:9px;
          font-variant-numeric:tabular-nums
        }
        .shadow-studio .ss-options-bar button{
          height:31px;
          min-width:31px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:6px;
          flex:none;
          border:1px solid var(--ss-opt-line);
          border-radius:6px;
          padding:0 9px;
          background:var(--ss-opt-bg-3);
          color:#e6eef7;
          font:750 10px Inter,ui-sans-serif,system-ui,sans-serif;
          cursor:pointer;
          box-shadow:inset 0 0 0 1px #ffffff05;
          transition:border-color 120ms ease,background 120ms ease,color 120ms ease,box-shadow 120ms ease
        }
        .shadow-studio .ss-options-bar button i{
          color:#b8d4eb;
          font-size:10px
        }
        .shadow-studio .ss-options-bar button:hover:not(:disabled){
          border-color:#748da3;
          background:#435466;
          color:#fff
        }
        .shadow-studio .ss-options-bar button:hover:not(:disabled) i{color:#fff}
        .shadow-studio .ss-options-bar button:focus-visible{
          outline:2px solid var(--ss-opt-blue);
          outline-offset:2px
        }
        .shadow-studio .ss-options-bar button:disabled{
          opacity:.4;
          cursor:default
        }
        .shadow-studio .ss-options-bar button[aria-pressed=true]{
          border-color:#79bcff;
          background:var(--ss-opt-blue-soft);
          color:#fff;
          box-shadow:inset 0 0 0 1px #6ba9df
        }
        .shadow-studio .ss-options-bar button[aria-pressed=true] i{color:#fff}
        .shadow-studio .ss-options-bar .ss-opt-spacer{flex:1 0 5px}
        .shadow-studio .ss-options-bar .ss-opt-primary{
          border-color:#6d9bc4;
          background:#356b9d;
          color:#fff;
          box-shadow:inset 0 0 0 1px #ffffff0d
        }
        .shadow-studio .ss-options-bar .ss-opt-primary i{color:#fff}
        .shadow-studio .ss-options-bar .ss-opt-primary:hover:not(:disabled){
          border-color:#91c7f6;
          background:#3e82bd
        }
        @media(max-width:700px){
          .shadow-studio .ss-options-bar{
            min-height:46px;
            flex-basis:46px;
            padding:5px 8px;
            gap:7px
          }
          .shadow-studio .ss-options-bar .ss-opt-title{
            min-width:72px;
            max-width:120px;
            padding:0 6px
          }
          .shadow-studio .ss-options-bar .ss-opt-title span{
            max-width:70px
          }
          .shadow-studio .ss-options-bar .ss-opt-range input[type="range"]{
            width:64px;
            min-width:64px
          }
          .shadow-studio .ss-options-bar button{
            height:34px;
            min-width:34px
          }
        }
        @media(pointer:coarse){
          .shadow-studio .ss-options-bar{
            min-height:48px;
            flex-basis:48px
          }
          .shadow-studio .ss-options-bar button{
            height:36px;
            min-width:36px
          }
          .shadow-studio .ss-options-bar .ss-opt-range input[type="range"]{
            height:24px
          }
          .shadow-studio .ss-options-bar .ss-opt-range input[type="range"]::-webkit-slider-thumb{
            width:19px;
            height:19px;
            margin-top:-7.5px
          }
        }
      `}</style>
      <div className="ss-opt-title" title={paper?.name || toolName}>
        <i className={`fa-solid ${tool === 'eraser' ? 'fa-eraser' : tool === 'eyedropper' ? 'fa-eye-dropper' : tool === 'pencil' ? 'fa-pencil' : tool === 'shape' ? 'fa-shapes' : 'fa-paintbrush'}`} aria-hidden="true" />
        <span>{toolName} {tx('studioOptions.options')}</span>
      </div>
      <span className="ss-opt-separator" aria-hidden="true" />
      <label className="ss-opt-range">{tx('studioOptions.size')} <input aria-label={tx('studioOptions.brushSize')} type="range" min="1" max="5000" step="1" value={Math.max(1, size)} disabled={busy} onChange={(event) => onSizeChange(Number(event.target.value))} /><StudioPrecisionInput value={size} onCommit={onSizeChange} min={0.1} max={5000} step={0.1} label={tx('studioOptions.brushSize')} width={62} /><output>px</output></label>
      <label className="ss-opt-range">{tx('studioOptions.opacity')} <input aria-label={tx('studioOptions.brushOpacity')} type="range" min="10" max="100" step="1" value={opacity} disabled={busy} onChange={(event) => onOpacityChange(Number(event.target.value))} /><output>{opacity}%</output></label>
      <span className="ss-opt-separator" aria-hidden="true" />
      <button type="button" aria-pressed={showGrid} disabled={busy} onClick={onToggleGrid} title={tx('studioOptions.toggleGrid')}><i className="fa-solid fa-border-all" aria-hidden="true" /> {tx('studioOptions.grid')}</button>
      <button type="button" disabled={busy} onClick={onFit} title={tx('studioOptions.fitPaper')}><i className="fa-solid fa-expand" aria-hidden="true" /> {tx('studioOptions.fit')}</button>
      <button type="button" disabled={busy || !canUndo} onClick={onUndo} title={tx('studioOptions.undo')} aria-label={tx('studioOptions.undo')}><i className="fa-solid fa-rotate-left" aria-hidden="true" /></button>
      <button type="button" disabled={busy || !canRedo} onClick={onRedo} title={tx('studioOptions.redo')} aria-label={tx('studioOptions.redo')}><i className="fa-solid fa-rotate-right" aria-hidden="true" /></button>
      <span className="ss-opt-spacer" aria-hidden="true" />
      <button type="button" disabled={busy} onClick={onNew} title={tx('studioOptions.newPaper')}><i className="fa-solid fa-file-circle-plus" aria-hidden="true" /> {tx('studioOptions.new')}</button>
      <button type="button" disabled={busy} onClick={onSave} title={tx('studioOptions.saveProject')}><i className="fa-solid fa-floppy-disk" aria-hidden="true" /> {tx('studioOptions.save')}</button>
      <button type="button" className="ss-opt-primary" disabled={busy} onClick={onExport} title={tx('studioOptions.exportImage')}><i className="fa-solid fa-arrow-up-from-bracket" aria-hidden="true" /> {tx('studioOptions.export')}</button>
    </div>
  )
}
