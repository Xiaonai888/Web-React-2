import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { useState } from 'react'
import StudioLayersChannelsPaths from './StudioLayersChannelsPaths'
import StudioMangaAssets from './StudioMangaAssets'

registerTranslationNamespace('studioPanels', {
  "en": {
    "tabs": {
      "layers": "Layers",
      "color": "Color",
      "assets": "Assets",
      "view": "View"
    },
    "workspacePanels": "Workspace panels",
    "rightTabs": "Right panel tabs",
    "layersOverview": "Layers overview",
    "canvasMode": "Canvas mode",
    "blendMode": "Blend mode",
    "normal": "Normal",
    "opacity": "Opacity",
    "canvasBitmap": "Canvas bitmap",
    "singleCanvas": "Current paper · single canvas",
    "futureLayers": "Future layer controls",
    "addLayerTitle": "Add layer is available after the layer engine",
    "addLayer": "Add layer (not available yet)",
    "addGroupTitle": "Layer groups are not available yet",
    "addGroup": "Add layer group (not available yet)",
    "addMaskTitle": "Masks are not available yet",
    "addMask": "Add mask (not available yet)",
    "deleteLayerTitle": "Deleting layers requires the layer engine",
    "deleteLayer": "Delete layer (not available yet)",
    "layerHint": "This drawing currently uses one canvas. Independent layers, masks and blend modes will be added with the layer engine.",
    "assetsOverview": "Assets overview",
    "library": "Library",
    "emptyAssets": "No assets in this workspace",
    "assetHint": "Asset importing and reusable manga resources will be added with the asset library.",
    "importHint": "To import an image as a separate paper now, use File → Import Image as Paper."
  },
  "km": {
    "tabs": {
      "layers": "ស្រទាប់",
      "color": "ពណ៌",
      "assets": "ធនធាន",
      "view": "ទិដ្ឋភាព"
    },
    "workspacePanels": "ផ្ទាំងការងារ",
    "rightTabs": "ផ្ទាំងខាងស្ដាំ",
    "layersOverview": "ទិដ្ឋភាពទូទៅនៃស្រទាប់",
    "canvasMode": "របៀប Canvas",
    "blendMode": "របៀបលាយពណ៌",
    "normal": "ធម្មតា",
    "opacity": "ភាពស្រអាប់",
    "canvasBitmap": "រូបភាព Canvas",
    "singleCanvas": "ក្រដាសបច្ចុប្បន្ន · Canvas តែមួយ",
    "futureLayers": "ការគ្រប់គ្រងស្រទាប់នាពេលក្រោយ",
    "addLayerTitle": "អាចបន្ថែមស្រទាប់បាន ក្រោយពេលបង្កើត Layer Engine",
    "addLayer": "បន្ថែមស្រទាប់ (មិនទាន់មាន)",
    "addGroupTitle": "មិនទាន់អាចបន្ថែមក្រុមស្រទាប់បានទេ",
    "addGroup": "បន្ថែមក្រុមស្រទាប់ (មិនទាន់មាន)",
    "addMaskTitle": "មិនទាន់អាចប្រើ Mask បានទេ",
    "addMask": "បន្ថែម Mask (មិនទាន់មាន)",
    "deleteLayerTitle": "ការលុបស្រទាប់ត្រូវការ Layer Engine",
    "deleteLayer": "លុបស្រទាប់ (មិនទាន់មាន)",
    "layerHint": "បច្ចុប្បន្នរូបគំនូរមាន Canvas តែមួយ។ ស្រទាប់ដាច់ដោយឡែក Mask និងរបៀបលាយពណ៌ នឹងបន្ថែមពេលមាន Layer Engine។",
    "assetsOverview": "ទិដ្ឋភាពទូទៅនៃធនធាន",
    "library": "បណ្ណាល័យ",
    "emptyAssets": "មិនទាន់មានធនធានក្នុងការងារនេះទេ",
    "assetHint": "ការនាំចូលធនធាន និងរូប Manga ដែលអាចប្រើឡើងវិញនឹងមាននៅក្នុងបណ្ណាល័យធនធាន។",
    "importHint": "បើចង់នាំចូលរូបភាពជាក្រដាសផ្សេងឥឡូវ សូមប្រើ File → Import Image as Paper។"
  },
  "zh": {
    "tabs": {
      "layers": "图层",
      "color": "颜色",
      "assets": "素材",
      "view": "视图"
    },
    "workspacePanels": "工作区面板",
    "rightTabs": "右侧面板选项卡",
    "layersOverview": "图层概览",
    "canvasMode": "画布模式",
    "blendMode": "混合模式",
    "normal": "正常",
    "opacity": "不透明度",
    "canvasBitmap": "画布位图",
    "singleCanvas": "当前画布 · 单一画布",
    "futureLayers": "未来图层操作",
    "addLayerTitle": "图层引擎完成后可添加图层",
    "addLayer": "添加图层（暂不可用）",
    "addGroupTitle": "图层组暂不可用",
    "addGroup": "添加图层组（暂不可用）",
    "addMaskTitle": "蒙版暂不可用",
    "addMask": "添加蒙版（暂不可用）",
    "deleteLayerTitle": "删除图层需要图层引擎",
    "deleteLayer": "删除图层（暂不可用）",
    "layerHint": "当前绘图只有一个画布。独立图层、蒙版和混合模式将在图层引擎完成后提供。",
    "assetsOverview": "素材概览",
    "library": "素材库",
    "emptyAssets": "当前工作区没有素材",
    "assetHint": "素材导入和可复用的漫画资源将随素材库功能加入。",
    "importHint": "如需将图像作为独立画布导入，请使用 File → Import Image as Paper。"
  },
  "ja": {
    "tabs": {
      "layers": "レイヤー",
      "color": "カラー",
      "assets": "素材",
      "view": "表示"
    },
    "workspacePanels": "作業パネル",
    "rightTabs": "右側のパネルタブ",
    "layersOverview": "レイヤー一覧",
    "canvasMode": "キャンバスモード",
    "blendMode": "描画モード",
    "normal": "通常",
    "opacity": "不透明度",
    "canvasBitmap": "キャンバス画像",
    "singleCanvas": "現在の用紙 · 1 つのキャンバス",
    "futureLayers": "今後のレイヤー操作",
    "addLayerTitle": "レイヤーエンジン追加後に使用できます",
    "addLayer": "レイヤーを追加（未対応）",
    "addGroupTitle": "レイヤーグループはまだ使用できません",
    "addGroup": "レイヤーグループを追加（未対応）",
    "addMaskTitle": "マスクはまだ使用できません",
    "addMask": "マスクを追加（未対応）",
    "deleteLayerTitle": "レイヤー削除にはレイヤーエンジンが必要です",
    "deleteLayer": "レイヤーを削除（未対応）",
    "layerHint": "現在の描画は 1 つのキャンバスで構成されています。独立レイヤー、マスク、描画モードはレイヤーエンジンとともに追加されます。",
    "assetsOverview": "素材一覧",
    "library": "ライブラリ",
    "emptyAssets": "この作業領域に素材はありません",
    "assetHint": "素材の読み込みと再利用できるマンガ素材は素材ライブラリに追加されます。",
    "importHint": "画像を別の用紙として読み込むには File → Import Image as Paper を使用してください。"
  },
  "ko": {
    "tabs": {
      "layers": "레이어",
      "color": "색상",
      "assets": "소재",
      "view": "보기"
    },
    "workspacePanels": "작업 영역 패널",
    "rightTabs": "오른쪽 패널 탭",
    "layersOverview": "레이어 개요",
    "canvasMode": "캔버스 모드",
    "blendMode": "혼합 모드",
    "normal": "보통",
    "opacity": "불투명도",
    "canvasBitmap": "캔버스 이미지",
    "singleCanvas": "현재 캔버스 · 단일 캔버스",
    "futureLayers": "향후 레이어 도구",
    "addLayerTitle": "레이어 엔진 추가 후 레이어를 만들 수 있습니다",
    "addLayer": "레이어 추가(아직 사용 불가)",
    "addGroupTitle": "레이어 그룹은 아직 사용할 수 없습니다",
    "addGroup": "레이어 그룹 추가(아직 사용 불가)",
    "addMaskTitle": "마스크는 아직 사용할 수 없습니다",
    "addMask": "마스크 추가(아직 사용 불가)",
    "deleteLayerTitle": "레이어를 삭제하려면 레이어 엔진이 필요합니다",
    "deleteLayer": "레이어 삭제(아직 사용 불가)",
    "layerHint": "현재 그림은 단일 캔버스로 구성됩니다. 독립 레이어, 마스크, 혼합 모드는 레이어 엔진과 함께 추가됩니다.",
    "assetsOverview": "소재 개요",
    "library": "라이브러리",
    "emptyAssets": "이 작업 영역에는 소재가 없습니다",
    "assetHint": "소재 가져오기와 재사용 가능한 만화 리소스는 소재 라이브러리와 함께 추가됩니다.",
    "importHint": "지금 이미지를 별도의 캔버스로 가져오려면 File → Import Image as Paper를 사용하세요."
  }
})

const TABS = [
  { id: 'layers', label: 'Layers', icon: 'fa-layer-group' },
  { id: 'color', label: 'Color', icon: 'fa-palette' },
  { id: 'assets', label: 'Assets', icon: 'fa-shapes' },
  { id: 'view', label: 'View', icon: 'fa-magnifying-glass' },
]

export default function StudioRightPanels({ canvasRef, paperId, revision, paper, onPlaceAsset }) {
  const { t: tx } = useDisplayTranslation()
  const [active, setActive] = useState('color')

  return (
    <section className="ss-right-switcher" data-active={active} aria-label={tx('studioPanels.workspacePanels')}>
      <style>{`
        .shadow-studio .ss-right-switcher{display:none}
        @media(min-width:1101px) and (min-height:651px){
          .shadow-studio:has(.ss-layout) .ss-side>.ss-right-switcher{display:block;order:-1;flex:0 0 auto;width:100%;min-width:0;border-bottom:1px solid #48535f}
          .shadow-studio:has(.ss-layout) .ss-side>.ss-color-panel{order:0}
          .shadow-studio:has(.ss-layout) .ss-side>.ss-section[aria-label='Canvas view']{order:1}
          .shadow-studio:has(.ss-layout) .ss-side>.ss-section:last-child{order:2}
          .shadow-studio:has(.ss-layout) .ss-side:has(>.ss-right-switcher:not([data-active='color']))>.ss-color-panel{display:none}
          .shadow-studio:has(.ss-layout) .ss-side>.ss-navigator{order:1}
          .shadow-studio:has(.ss-layout) .ss-side:has(>.ss-right-switcher:not([data-active='view']))>.ss-section[aria-label='Canvas view'],
          .shadow-studio:has(.ss-layout) .ss-side:has(>.ss-right-switcher:not([data-active='view']))>.ss-navigator,
          .shadow-studio:has(.ss-layout) .ss-side:has(>.ss-right-switcher:not([data-active='view']))>.ss-section:last-child{display:none}
          .shadow-studio .ss-right-tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:2px;background:#212932;padding:5px 5px 0}
          .shadow-studio .ss-right-tab{display:flex;min-width:0;min-height:36px;align-items:center;justify-content:center;gap:5px;padding:5px 2px;border:1px solid transparent;border-bottom:2px solid transparent;border-radius:5px 5px 0 0;background:transparent;color:#aebac8;font:inherit;font-size:10px;font-weight:700;cursor:pointer}
          .shadow-studio .ss-right-tab i{font-size:12px}
          .shadow-studio .ss-right-tab:hover,.shadow-studio .ss-right-tab:focus-visible{color:#fff;background:#364657;outline:none}
          .shadow-studio .ss-right-tab[aria-pressed='true']{border-color:#4c5b6a;border-bottom-color:#80baff;background:#303e4b;color:#fff}
          .shadow-studio .ss-right-panel{padding:11px 10px 14px;color:#e5edf6;background:#29333d}
          .shadow-studio .ss-right-panel-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:11px}
          .shadow-studio .ss-right-panel-head strong{font-size:11px;font-weight:800}
          .shadow-studio .ss-right-panel-head span{font-size:10px;color:#a6b7c8}
          .shadow-studio .ss-layer-options{display:grid;grid-template-columns:1fr 76px;gap:7px;margin-bottom:9px}
          .shadow-studio .ss-layer-options label{display:grid;gap:4px;color:#bac8d7;font-size:10px}
          .shadow-studio .ss-layer-options select,.shadow-studio .ss-layer-options input{width:100%;height:29px;border:1px solid #516171;border-radius:4px;background:#222c36;color:#e3eaf2;padding:0 7px;font:inherit;font-size:11px}
          .shadow-studio .ss-layer-options :disabled{opacity:.65;cursor:not-allowed}
          .shadow-studio .ss-layer-row{display:flex;align-items:center;gap:9px;min-height:55px;padding:6px;border:1px solid #5684b4;border-radius:5px;background:#344d65}
          .shadow-studio .ss-layer-thumb{display:grid;place-items:center;width:40px;height:38px;flex:none;border:1px solid #a5b3c1;border-radius:3px;background:linear-gradient(45deg,#cbd3da 25%,transparent 25%,transparent 75%,#cbd3da 75%),linear-gradient(45deg,#cbd3da 25%,#fff 25%,#fff 75%,#cbd3da 75%);background-size:12px 12px;background-position:0 0,6px 6px;color:#425367;font-size:15px}
          .shadow-studio .ss-layer-name{min-width:0;flex:1;display:grid;gap:3px}
          .shadow-studio .ss-layer-name strong{font-size:11px;font-weight:700}
          .shadow-studio .ss-layer-name small{font-size:9px;color:#b9ccdc}
          .shadow-studio .ss-panel-actions{display:flex;justify-content:flex-end;gap:5px;margin-top:10px;border-top:1px solid #455463;padding-top:9px}
          .shadow-studio .ss-panel-actions button{width:28px;height:27px;border:1px solid #4c5d6f;border-radius:4px;background:#344351;color:#9daebe;cursor:not-allowed}
          .shadow-studio .ss-panel-hint{margin:10px 0 0;color:#b2c0ce;font-size:10px;line-height:1.5}
          .shadow-studio .ss-asset-placeholder{display:grid;justify-items:center;gap:9px;padding:26px 9px;border:1px dashed #566779;border-radius:6px;color:#aabccd;text-align:center}
          .shadow-studio .ss-asset-placeholder i{font-size:24px;color:#8ca7c2}
          .shadow-studio .ss-asset-placeholder strong{font-size:11px;color:#dce6f0}
          .shadow-studio .ss-asset-placeholder p{margin:0;font-size:10px;line-height:1.6}
          .shadow-studio .ss-right-switcher+.ss-color-panel{min-width:0}
          .shadow-studio:has(.ss-layout) .ss-right-panel[data-panel]{display:none}
          .shadow-studio:has(.ss-layout) .ss-right-switcher[data-active='layers'] .ss-right-panel[data-panel='layers'],
          .shadow-studio:has(.ss-layout) .ss-right-switcher[data-active='assets'] .ss-right-panel[data-panel='assets']{display:block}
          .shadow-studio:has(.ss-layout) .ss-right-panel{border-bottom:1px solid #4b5663}
          .shadow-studio:has(.ss-layout) .ss-layer-row{border-radius:4px;min-height:58px}
          .shadow-studio:has(.ss-layout) .ss-panel-hint{font-size:10px;line-height:1.55}
        }
        @media(min-width:1280px) and (min-height:651px){
          .shadow-studio:has(.ss-layout) .ss-layout{grid-template-columns:284px minmax(0,1fr) clamp(400px,31vw,490px)}
          .shadow-studio:has(.ss-layout) .ss-side:has(>.ss-right-switcher){display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-rows:220px minmax(0,1fr);align-content:start;gap:0;padding:0;min-width:0;overflow-x:hidden;overflow-y:auto}
          .shadow-studio:has(.ss-layout) .ss-side>.ss-right-switcher{grid-column:2;grid-row:1 / span 2;display:flex;flex-direction:column;align-self:stretch;order:0;flex:none;width:auto;min-width:0;height:auto;min-height:0;border-bottom:0;border-left:1px solid #485561;overflow-x:hidden;overflow-y:auto;background:#29333d}
          .shadow-studio:has(.ss-layout) .ss-side>.ss-navigator{grid-column:1;grid-row:1;order:0;display:block!important;min-width:0;min-height:0;margin:0;padding:10px 9px!important;border-bottom:1px solid #45515e;overflow:hidden}
          .shadow-studio:has(.ss-layout) .ss-side>.ss-color-panel{grid-column:1;grid-row:2;order:0;display:block!important;flex:none;min-width:0;align-self:stretch;min-height:0;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;box-sizing:border-box;margin:0;padding:10px 9px 12px!important;border-bottom:1px solid #45515e}
          .shadow-studio:has(.ss-layout) .ss-side>.ss-section[aria-label='Canvas view']{display:none!important}
          .shadow-studio:has(.ss-layout) .ss-side>.ss-section:last-child{display:none!important}
          .shadow-studio:has(.ss-layout) .ss-right-tabs{display:none}
          .shadow-studio:has(.ss-layout) .ss-right-switcher .ss-right-panel[data-panel]{display:block!important;min-width:0;padding:10px 9px 13px}
          .shadow-studio:has(.ss-layout) .ss-right-switcher .ss-right-panel[data-panel='assets']{border-top:1px solid #596777}
          .shadow-studio:has(.ss-layout) .ss-right-switcher .ss-right-panel-head{padding:1px 0 4px}
          .shadow-studio:has(.ss-layout) .ss-layer-options{grid-template-columns:minmax(0,1fr) 62px;gap:5px}
          .shadow-studio:has(.ss-layout) .ss-panel-actions{gap:3px}
          .shadow-studio:has(.ss-layout) .ss-asset-placeholder{padding:14px 6px}
          .shadow-studio:has(.ss-layout) .ss-side>.ss-navigator .ss-nav-preview{max-width:100%}
          .shadow-studio:has(.ss-layout) .ss-side>.ss-color-panel .ss-hue-wheel{width:min(100%,152px)}
          .shadow-studio:has(.ss-layout) .ss-side>.ss-color-panel .ss-swatches{gap:3px}
        }
      `}</style>
      <div className="ss-right-tabs" role="group" aria-label={tx('studioPanels.rightTabs')}>
        {TABS.map((tab) => (
          <button key={tab.id} type="button" className="ss-right-tab" data-tab={tab.id} aria-pressed={active === tab.id} onClick={() => setActive(tab.id)}>
            <i className={`fa-solid ${tab.icon}`} aria-hidden="true" />
            <span>{tx(`studioPanels.tabs.${tab.id}`)}</span>
          </button>
        ))}
      </div>
      <div className="ss-right-panel" data-panel="layers" aria-label={tx('studioPanels.layersOverview')}>
  <StudioLayersChannelsPaths
    canvasRef={canvasRef}
    paperId={paperId}
    revision={revision}
    paper={paper}
  />
</div>
      <div className="ss-right-panel" data-panel="assets" aria-label={tx('studioPanels.assetsOverview')}>
  <div className="ss-right-panel-head">
    <strong>{tx('studioPanels.tabs.assets')}</strong>
    <span>{tx('studioPanels.library')}</span>
  </div>
  <StudioMangaAssets onInsert={onPlaceAsset} />
</div>
    </section>
  )
}
