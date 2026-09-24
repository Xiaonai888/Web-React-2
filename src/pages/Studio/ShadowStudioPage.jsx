import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import StudioNewFileDialog from './StudioNewFileDialog'
import StudioFileMenu from './StudioFileMenu'
import StudioViewMenu from './StudioViewMenu'
import StudioEditMenu from './StudioEditMenu'
import StudioExportDialog from './StudioExportDialog'
import { readStudioImage } from './StudioImageImport'
import { placeStudioDroppedImage } from './StudioImageDrop'
import StudioTextEditor, { drawStudioText } from './StudioTextEditor'
import { normalizeStudioTextData } from './StudioTextLayerData'
import StudioShapeEditor, { drawStudioShape } from './StudioShapeEditor'
import StudioPaperTabs from './StudioPaperTabs'
import StudioHeaderWorkspace from './StudioHeaderWorkspace'
import StudioHome from './StudioHome'
import StudioNavigator from './StudioNavigator'
import { StudioToolRail, StudioControlSidebar, StudioControlFooter } from './StudioWorkspaceControls'
import { beginStudioStroke, extendStudioStroke } from './StudioBrushEngine'
import { applyStudioPaintBucket } from './StudioPaintBucketToolEngine'
import './ShadowStudioMobile.css'
import './StudioHeaderShell.css'
import { buildStudioProject, downloadStudioProject, readStudioProject } from './StudioProjectFile'
import { clearStudioRecovery, readStudioRecovery, restoreStudioRecovery, saveStudioRecovery } from './StudioRecoveryStore'
import StudioOptionsBar from './StudioOptionsBar'
import StudioMangaToolSettingsPage from './StudioMangaToolSettingsPage'
import { drawStudioMangaBalloon } from './StudioMangaBalloonRenderer'
import { confirmLargeBrush } from './StudioPrecisionInput'
import StudioCanvasRulers from './StudioCanvasRulers'
import { studioLayerContext, addStudioLayer, duplicateStudioLayer, selectStudioLayer, updateStudioLayer, moveStudioLayer, removeStudioLayer } from './StudioLayerEngine'
import { createStudioLayerGroup, updateStudioLayerGroup, removeStudioLayerGroup, validateStudioGroupLayout, studioLayerCanEdit } from './StudioLayerGroupEngine'
import { renderStudioAdvancedLayers, setStudioLayerBlendMode, setStudioGroupBlendMode } from './StudioLayerBlendEngine'
import { exportStudioLayerStack, loadStudioLayerStack } from './StudioLayerPersistence'
import { mergeStudioLayerDown } from './StudioLayerMergeEngine'
import { applyStudioLayerGradient } from './StudioGradientEngine'
import { applyStudioScreentone } from './StudioScreentoneEngine'
import { applyStudioSpeechBubble } from './StudioSpeechBubbleEngine'
import { applyStudioComicPanels } from './StudioComicPanelsEngine'
import { applyStudioMangaEffect } from './StudioMangaEffectsEngine'
import { moveStudioPixels } from './StudioMoveToolEngine'
import { transformStudioPixels } from './StudioTransformToolEngine'
import { createStudioRectangleSelection } from './StudioRectangleSelectToolEngine'
import { createStudioMagicWandSelection } from './StudioMagicWandToolEngine'
import { createStudioLassoSelection } from './StudioLassoToolEngine'
import { beginStudioSmudge, extendStudioSmudge } from './StudioSmudgeToolEngine'
import { applyStudioBlurDab } from './StudioBlurToolEngine'
import { cropStudioCanvas } from './StudioCropToolEngine'
import { resizeStudioCanvas } from './StudioCanvasResizeToolEngine'
import { applyStudioPerspectiveTransform } from './StudioPerspectiveToolEngine'
import { applyStudioSelectedGradient } from './StudioGradientSelectionToolEngine'
import { applyStudioCustomComicFrames } from './StudioCustomComicFrameToolEngine'
import { createStudioRulerGuide, renderStudioRulerGuides, snapStudioPointToGuides } from './StudioRulerGuideToolEngine'
import { placeStudioMangaBalloon } from './StudioBalloonPlacementToolEngine'
import StudioAdvancedToolPanel from './StudioAdvancedToolPanel'

registerTranslationNamespace('shadowStudio', {
  en: {
    back: 'Back',
    brush: 'Brush',
    eraser: 'Eraser',
    eyedropper: 'Pick Color',
    newPaper: 'New File',
    undo: 'Undo',
    redo: 'Redo',
    color: 'Color',
    size: 'Brush Size',
    opacity: 'Opacity',
    zoom: 'Zoom',
    clear: 'Clear',
    canvas: 'Canvas',
    closePaper: 'Close paper',
    closeConfirm: 'This paper has changes. Close it without saving?',
    documentLimit: 'You can keep up to 8 papers open at the same time.',
    welcomeTitle: 'Create something new',
    welcomeText: 'Start with a preset or create a custom paper.',
    recent: 'Recent',
    noRecent: 'Recent local projects will appear here after Local Project Save is added.',
    imageLoadFailed: "This paper image could not be loaded. Restore it from another saved project copy.",
    recoveryStorageUnavailable: "{{error}} Use Save Project to keep a device copy.",
    recoveryCleared: "No open papers. Local recovery cleared.",
    autosaveFailed: "Autosave failed: {{error}}",
    autosavedAt: "Autosaved locally at {{time}}.",
    autosaveFailedSave: "Autosave failed: {{error}} Save Project to your device.",
    recoveredPapers: "Recovered local papers. Use Save Project for a durable device copy.",
    recoveryFailed: "Recovery failed: {{error}}",
    deleteRecoveryConfirm: "Delete the local recovery copy? Save a .shadowstudio file first if you need this work.",
    recoveryDeleted: "Local recovery copy deleted.",
    discardRecoveryFailed: "Could not discard recovery: {{error}}",
    exitConfirm: "Leaving Studio closes the open papers. Save Project to your device first. Leave?",
    imageImported: "Imported {{name}} as a new paper. Save Project to keep a copy.",
    imageImportFailed: "Image import failed. Your existing papers were not changed.",
    openProjectConfirm: "Opening this project will close your current papers. Save Project first if you want to keep them. Continue?",
    projectOpened: "Opened {{count}} paper(s) from your device.",
    openProjectFailed: "Unable to open the project file.",
    paperStillLoading: "Wait for the current paper to finish loading.",
    createPaperFirst: "Create a paper before saving.",
    projectDownloadStarted: "Project download started. Keep the .shadowstudio file in a safe place.",
    projectSaveFailed: "Unable to save the project.",
    saveProjectCopyPrompt: "Save project copy as:",
    projectNameRequired: "Enter a project file name.",
    closeAllConfirm: "Close all open papers? Save Project first if you need to keep unsaved changes.",
    allPapersClosed: "All papers closed.",
    samplePixelFailed: "Unable to sample this pixel.",
    importImageLabel: "Import image as a new paper.",
  },
  km: {
    back: 'ត្រឡប់ក្រោយ',
    brush: 'ជក់',
    eraser: 'ជ័រលុប',
    eyedropper: 'ចាប់ពណ៌',
    newPaper: 'ក្រដាសថ្មី',
    undo: 'ត្រឡប់ក្រោយ',
    redo: 'ធ្វើឡើងវិញ',
    color: 'ពណ៌',
    size: 'ទំហំជក់',
    opacity: 'ភាពស្រអាប់',
    zoom: 'ពង្រីក',
    clear: 'សម្អាត',
    canvas: 'ផ្ទាំងគំនូរ',
    closePaper: 'បិទក្រដាស',
    closeConfirm: 'ក្រដាសនេះមានការកែប្រែ។ តើបិទដោយមិនរក្សាទុកមែនទេ?',
    documentLimit: 'អាចបើកក្រដាសបានអតិបរមា 8 ក្នុងពេលតែមួយ។',
    welcomeTitle: 'ចាប់ផ្តើមការងារថ្មី',
    welcomeText: 'ជ្រើស Preset ឬបង្កើតក្រដាសតាមទំហំដែលអ្នកចង់បាន។',
    recent: 'ថ្មីៗ',
    noRecent: 'Project local ថ្មីៗនឹងបង្ហាញនៅទីនេះ ក្រោយពេលយើងបន្ថែម Local Project Save។',
    imageLoadFailed: "មិនអាចបើករូបភាពក្រដាសនេះបានទេ។ សូមស្ដារពីឯកសារគម្រោងដែលបានរក្សាទុកផ្សេងទៀត។",
    recoveryStorageUnavailable: "{{error}} សូមប្រើ Save Project ដើម្បីរក្សាទុកច្បាប់ចម្លងលើឧបករណ៍។",
    recoveryCleared: "គ្មានក្រដាសបើកទេ។ បានសម្អាតទិន្នន័យស្ដារក្នុងឧបករណ៍។",
    autosaveFailed: "រក្សាទុកស្វ័យប្រវត្តិមិនបាន៖ {{error}}",
    autosavedAt: "បានរក្សាទុកស្វ័យប្រវត្តិក្នុងឧបករណ៍នៅម៉ោង {{time}}។",
    autosaveFailedSave: "រក្សាទុកស្វ័យប្រវត្តិមិនបាន៖ {{error}} សូមប្រើ Save Project ដើម្បីរក្សាទុកលើឧបករណ៍។",
    recoveredPapers: "បានស្ដារក្រដាសពីឧបករណ៍។ សូមប្រើ Save Project ដើម្បីរក្សាទុកច្បាប់ចម្លង។",
    recoveryFailed: "ស្ដារទិន្នន័យមិនបាន៖ {{error}}",
    deleteRecoveryConfirm: "លុបទិន្នន័យស្ដារដែលរក្សាទុកក្នុងឧបករណ៍មែនទេ? សូមរក្សាទុកឯកសារ .shadowstudio ជាមុន ប្រសិនបើអ្នកនៅត្រូវការការងារនេះ។",
    recoveryDeleted: "បានលុបទិន្នន័យស្ដារក្នុងឧបករណ៍។",
    discardRecoveryFailed: "មិនអាចលុបទិន្នន័យស្ដារបាន៖ {{error}}",
    exitConfirm: "ការចាកចេញពី Studio នឹងបិទក្រដាសដែលកំពុងបើក។ សូមប្រើ Save Project ជាមុន។ តើចាកចេញមែនទេ?",
    imageImported: "បាននាំចូល {{name}} ជាក្រដាសថ្មី។ សូមប្រើ Save Project ដើម្បីរក្សាទុកច្បាប់ចម្លង។",
    imageImportFailed: "នាំចូលរូបភាពមិនបាន។ ក្រដាសដែលមានស្រាប់មិនត្រូវបានផ្លាស់ប្ដូរទេ។",
    openProjectConfirm: "ការបើកគម្រោងនេះនឹងបិទក្រដាសបច្ចុប្បន្ន។ សូមប្រើ Save Project ជាមុន ប្រសិនបើចង់រក្សាទុក។ តើបន្តមែនទេ?",
    projectOpened: "បានបើកក្រដាស {{count}} ពីឧបករណ៍របស់អ្នក។",
    openProjectFailed: "មិនអាចបើកឯកសារគម្រោងបានទេ។",
    paperStillLoading: "សូមរង់ចាំឱ្យក្រដាសបច្ចុប្បន្នបើករួចសិន។",
    createPaperFirst: "សូមបង្កើតក្រដាសមួយ មុនពេលរក្សាទុក។",
    projectDownloadStarted: "បានចាប់ផ្ដើមទាញយកគម្រោង។ សូមរក្សាទុកឯកសារ .shadowstudio នៅកន្លែងមានសុវត្ថិភាព។",
    projectSaveFailed: "មិនអាចរក្សាទុកគម្រោងបានទេ។",
    saveProjectCopyPrompt: "រក្សាទុកច្បាប់ចម្លងគម្រោងជាឈ្មោះ៖",
    projectNameRequired: "សូមបញ្ចូលឈ្មោះឯកសារគម្រោង។",
    closeAllConfirm: "បិទក្រដាសទាំងអស់មែនទេ? សូមប្រើ Save Project ជាមុន ប្រសិនបើត្រូវការរក្សាទុកការកែប្រែ។",
    allPapersClosed: "បានបិទក្រដាសទាំងអស់។",
    samplePixelFailed: "មិនអាចចាប់យកពណ៌ពីចំណុចនេះបានទេ។",
    importImageLabel: "នាំចូលរូបភាពជាក្រដាសថ្មី",
  },
  zh: {
    back: '返回',
    brush: '画笔',
    eraser: '橡皮擦',
    eyedropper: '吸管取色',
    newPaper: '新建文件',
    undo: '撤销',
    redo: '重做',
    color: '颜色',
    size: '画笔大小',
    opacity: '不透明度',
    zoom: '缩放',
    clear: '清空',
    canvas: '画布',
    closePaper: '关闭画布',
    closeConfirm: '此画布有未保存的更改。仍要关闭吗？',
    documentLimit: '最多可同时打开 8 个画布。',
    welcomeTitle: '创建新作品',
    welcomeText: '选择预设或创建自定义画布。',
    recent: '最近',
    noRecent: '添加本地项目保存后，最近项目将显示在这里。',
    imageLoadFailed: "无法加载此画布图像。请从其他已保存的项目副本恢复。",
    recoveryStorageUnavailable: "{{error}} 请使用 Save Project 将副本保存到设备。",
    recoveryCleared: "没有打开的画布，已清除本地恢复数据。",
    autosaveFailed: "自动保存失败：{{error}}",
    autosavedAt: "已于 {{time}} 自动保存到本地。",
    autosaveFailedSave: "自动保存失败：{{error}} 请使用 Save Project 保存到设备。",
    recoveredPapers: "已恢复本地画布。请使用 Save Project 保存项目副本。",
    recoveryFailed: "恢复失败：{{error}}",
    deleteRecoveryConfirm: "删除本地恢复副本？如需保留作品，请先保存 .shadowstudio 文件。",
    recoveryDeleted: "已删除本地恢复副本。",
    discardRecoveryFailed: "无法删除恢复数据：{{error}}",
    exitConfirm: "离开 Studio 将关闭所有打开的画布。请先使用 Save Project 保存。确定离开吗？",
    imageImported: "已将 {{name}} 导入为新画布。请使用 Save Project 保存副本。",
    imageImportFailed: "导入图像失败。现有画布未被更改。",
    openProjectConfirm: "打开此项目将关闭当前画布。如需保留，请先使用 Save Project 保存。继续吗？",
    projectOpened: "已从设备打开 {{count}} 个画布。",
    openProjectFailed: "无法打开项目文件。",
    paperStillLoading: "请等待当前画布加载完成。",
    createPaperFirst: "请先创建画布再保存。",
    projectDownloadStarted: "已开始下载项目。请妥善保存 .shadowstudio 文件。",
    projectSaveFailed: "无法保存项目。",
    saveProjectCopyPrompt: "将项目副本另存为：",
    projectNameRequired: "请输入项目文件名。",
    closeAllConfirm: "关闭所有画布？如需保留未保存的更改，请先使用 Save Project。",
    allPapersClosed: "已关闭所有画布。",
    samplePixelFailed: "无法从此像素取色。",
    importImageLabel: "将图像导入为新画布",
  },
  ja: {
    back: '戻る',
    brush: 'ブラシ',
    eraser: '消しゴム',
    eyedropper: 'スポイト',
    newPaper: '新規ファイル',
    undo: '元に戻す',
    redo: 'やり直す',
    color: '色',
    size: 'ブラシサイズ',
    opacity: '不透明度',
    zoom: 'ズーム',
    clear: 'クリア',
    canvas: 'キャンバス',
    closePaper: '用紙を閉じる',
    closeConfirm: 'この用紙には変更があります。保存せずに閉じますか？',
    documentLimit: '同時に開ける用紙は最大 8 枚です。',
    welcomeTitle: '新しい作品を作成',
    welcomeText: 'プリセットを選択するか、カスタム用紙を作成します。',
    recent: '最近',
    noRecent: 'ローカルプロジェクト保存を追加すると、最近のプロジェクトがここに表示されます。',
    imageLoadFailed: "このキャンバス画像を読み込めません。別の保存済みプロジェクトから復元してください。",
    recoveryStorageUnavailable: "{{error}} Save Project でデバイスにコピーを保存してください。",
    recoveryCleared: "開いているキャンバスはありません。ローカル復元データを削除しました。",
    autosaveFailed: "自動保存に失敗しました：{{error}}",
    autosavedAt: "{{time}} にローカルへ自動保存しました。",
    autosaveFailedSave: "自動保存に失敗しました：{{error}} Save Project でデバイスに保存してください。",
    recoveredPapers: "ローカルのキャンバスを復元しました。Save Project でコピーを保存してください。",
    recoveryFailed: "復元に失敗しました：{{error}}",
    deleteRecoveryConfirm: "ローカルの復元データを削除しますか？作業を残す場合は、先に .shadowstudio ファイルを保存してください。",
    recoveryDeleted: "ローカルの復元データを削除しました。",
    discardRecoveryFailed: "復元データを削除できません：{{error}}",
    exitConfirm: "Studio を終了すると開いているキャンバスが閉じられます。先に Save Project で保存してください。終了しますか？",
    imageImported: "{{name}} を新しいキャンバスとして読み込みました。Save Project でコピーを保存してください。",
    imageImportFailed: "画像を読み込めませんでした。既存のキャンバスは変更されていません。",
    openProjectConfirm: "このプロジェクトを開くと現在のキャンバスが閉じられます。必要なら先に Save Project で保存してください。続行しますか？",
    projectOpened: "デバイスから {{count}} 件のキャンバスを開きました。",
    openProjectFailed: "プロジェクトファイルを開けません。",
    paperStillLoading: "現在のキャンバスの読み込みが完了するまでお待ちください。",
    createPaperFirst: "保存する前にキャンバスを作成してください。",
    projectDownloadStarted: "プロジェクトのダウンロードを開始しました。.shadowstudio ファイルを安全な場所に保管してください。",
    projectSaveFailed: "プロジェクトを保存できません。",
    saveProjectCopyPrompt: "プロジェクトのコピーの保存名：",
    projectNameRequired: "プロジェクトのファイル名を入力してください。",
    closeAllConfirm: "すべてのキャンバスを閉じますか？変更を残す場合は、先に Save Project で保存してください。",
    allPapersClosed: "すべてのキャンバスを閉じました。",
    samplePixelFailed: "このピクセルから色を取得できません。",
    importImageLabel: "画像を新しいキャンバスとして読み込む",
  },
  ko: {
    back: '뒤로',
    brush: '브러시',
    eraser: '지우개',
    eyedropper: '스포이트',
    newPaper: '새 파일',
    undo: '실행 취소',
    redo: '다시 실행',
    color: '색상',
    size: '브러시 크기',
    opacity: '불투명도',
    zoom: '확대',
    clear: '지우기',
    canvas: '캔버스',
    closePaper: '용지 닫기',
    closeConfirm: '이 용지에 변경 사항이 있습니다. 저장하지 않고 닫을까요?',
    documentLimit: '한 번에 최대 8개의 용지를 열 수 있습니다.',
    welcomeTitle: '새 작업 만들기',
    welcomeText: '프리셋을 선택하거나 사용자 정의 용지를 만드세요.',
    recent: '최근',
    noRecent: '로컬 프로젝트 저장 기능을 추가하면 최근 프로젝트가 여기에 표시됩니다.',
    imageLoadFailed: "이 캔버스 이미지를 불러올 수 없습니다. 다른 저장된 프로젝트 사본에서 복원하세요.",
    recoveryStorageUnavailable: "{{error}} Save Project로 기기에 사본을 저장하세요.",
    recoveryCleared: "열린 캔버스가 없습니다. 로컬 복구 데이터를 지웠습니다.",
    autosaveFailed: "자동 저장 실패: {{error}}",
    autosavedAt: "{{time}}에 로컬 자동 저장을 완료했습니다.",
    autosaveFailedSave: "자동 저장 실패: {{error}} Save Project로 기기에 저장하세요.",
    recoveredPapers: "로컬 캔버스를 복구했습니다. Save Project로 프로젝트 사본을 저장하세요.",
    recoveryFailed: "복구 실패: {{error}}",
    deleteRecoveryConfirm: "로컬 복구 사본을 삭제할까요? 작업을 보관하려면 먼저 .shadowstudio 파일을 저장하세요.",
    recoveryDeleted: "로컬 복구 사본을 삭제했습니다.",
    discardRecoveryFailed: "복구 데이터를 삭제할 수 없습니다: {{error}}",
    exitConfirm: "Studio를 나가면 열린 캔버스가 닫힙니다. 먼저 Save Project로 저장하세요. 나갈까요?",
    imageImported: "{{name}}을(를) 새 캔버스로 가져왔습니다. Save Project로 사본을 저장하세요.",
    imageImportFailed: "이미지를 가져오지 못했습니다. 기존 캔버스는 변경되지 않았습니다.",
    openProjectConfirm: "이 프로젝트를 열면 현재 캔버스가 닫힙니다. 보관하려면 먼저 Save Project로 저장하세요. 계속할까요?",
    projectOpened: "기기에서 캔버스 {{count}}개를 열었습니다.",
    openProjectFailed: "프로젝트 파일을 열 수 없습니다.",
    paperStillLoading: "현재 캔버스가 모두 열릴 때까지 기다리세요.",
    createPaperFirst: "저장하기 전에 캔버스를 만드세요.",
    projectDownloadStarted: "프로젝트 다운로드를 시작했습니다. .shadowstudio 파일을 안전한 곳에 보관하세요.",
    projectSaveFailed: "프로젝트를 저장할 수 없습니다.",
    saveProjectCopyPrompt: "프로젝트 사본의 저장 이름:",
    projectNameRequired: "프로젝트 파일 이름을 입력하세요.",
    closeAllConfirm: "열린 캔버스를 모두 닫을까요? 저장되지 않은 변경 사항이 필요하면 먼저 Save Project로 저장하세요.",
    allPapersClosed: "모든 캔버스를 닫았습니다.",
    samplePixelFailed: "이 픽셀에서 색상을 가져올 수 없습니다.",
    importImageLabel: "이미지를 새 캔버스로 가져오기",
  },
})

const W = 1200
const H = 800
const HISTORY_LIMIT = 8
const HISTORY_MEMORY_BUDGET = 256 * 1024 * 1024
const DOCUMENT_LIMIT = 8

const STUDIO_HEADER_PLACEHOLDER_MENUS = ['Layer', 'Select', 'Filter']

function createDocument({
  name,
  width = W,
  height = H,
  resolution = 144,
  background = '#FFFFFF',
  presetId = 'custom',
  image = '',
}) {
  return {
    id:
      globalThis.crypto?.randomUUID?.() ||
      `studio-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    name,
    width,
    height,
    resolution,
    background,
    presetId,
    image,
    dirty: Boolean(image),
  }
}

function nextDocumentName(documents) {
  const names = new Set(documents.map((document) => document.name))
  let index = 1

  while (names.has(`Untitled-${index}`)) {
    index += 1
  }

  return `Untitled-${index}`
}

function StudioChrome({ children, onBack, backLabel }) {
  return (
    <div className="ss-chrome">
      <button
        type="button"
        className="ss-logo-btn"
        onClick={onBack}
        aria-label={backLabel}
      >
        <img
          src="/assets/Icons/Shadow Logo.svg"
          alt=""
          className="ss-logo"
        />
      </button>
      {children}
    </div>
  )
}

function studioBrushCursor(size, zoom) {
  const radius = Math.max(2, Math.min(30, size * zoom / 200))
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><circle cx="32" cy="32" r="${radius}" fill="none" stroke="#ffffff" stroke-width="2"/><circle cx="32" cy="32" r="${radius}" fill="none" stroke="#1a2530" stroke-width="0.8"/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 32 32, crosshair`
}

export default function ShadowStudioPage() {
  const navigate = useNavigate()
const { t: tx, language } = useDisplayTranslation()
const mangaToolsLabel = { en: 'Manga Tools', km: 'ឧបករណ៍ Manga', zh: '漫画工具', ja: 'マンガツール', ko: '만화 도구' }[language] || 'Manga Tools'
const placeImageLabel = {
  en: 'Place Image',
  km: 'ដាក់រូបភាព',
  zh: '放入图片',
  ja: '画像を配置',
  ko: '이미지 배치',
}[language] || 'Place Image'
  const canvasRef = useRef(null)
  const workRef = useRef(null)
  const panRef = useRef(null)
  const spaceRef = useRef(false)
  const zoomAnchorRef = useRef(null)
  const drawingRef = useRef(false)
  const strokeRef = useRef(null)
  const toolGestureRef = useRef(null)
  const toolOverlayRef = useRef(null)
  const selectionRef = useRef(null)
  const guidesRef = useRef([])
  const historyRef = useRef([])
  const redoRef = useRef([])
  const layerStackRef = useRef(null)
  const documentsRef = useRef([])
  const loadTokenRef = useRef(0)
  const openProjectInputRef = useRef(null)
  const importImageInputRef = useRef(null)
  const placeImageInputRef = useRef(null)
  const canvasDocumentRef = useRef('')
  const recoveryTimerRef = useRef(null)
  const recoverySequenceRef = useRef(0)
  const hadWorkspaceRef = useRef(false)

  const [canvasRevision, refresh] = useState(0)
  const [documents, setDocuments] = useState([])
  const [activeDocumentId, setActiveDocumentId] = useState('')
  const [workspaceStarted, setWorkspaceStarted] = useState(false)
  const [newFileOpen, setNewFileOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [newFilePreset, setNewFilePreset] = useState('basic')
  const [tool, setTool] = useState('brush')
  const [mangaToolsOpen, setMangaToolsOpen] = useState(false)
  const [mangaToolInitial, setMangaToolInitial] = useState('bubble')
  const [advancedEditor, setAdvancedEditor] = useState(null)
  const [textEditor, setTextEditor] = useState(null)
  const [shapeEditor, setShapeEditor] = useState(null)
  const [brushStyle, setBrushStyle] = useState('round')
  const [color, setColor] = useState('#111111')
  const [size, setSize] = useState(8)
  const [opacity, setOpacity] = useState(100)
  const [zoom, setZoom] = useState(75)
  const [showGrid, setShowGrid] = useState(false)
  const [gridSpacing, setGridSpacing] = useState(50)
  const [viewRotation, setViewRotation] = useState(0)
  const [flipHorizontal, setFlipHorizontal] = useState(false)
  const [flipVertical, setFlipVertical] = useState(false)
  const viewStatesRef = useRef({})
  const [handMode, setHandMode] = useState(false)
  const [projectBusy, setProjectBusy] = useState(false)
  const [projectNotice, setProjectNotice] = useState('')
  const [projectLoadKey, setProjectLoadKey] = useState(0)
  const [paperLoading, setPaperLoading] = useState(false)
  const [recoveryBooting, setRecoveryBooting] = useState(true)
  const [recoveryEntry, setRecoveryEntry] = useState(null)
  const [recoveryBusy, setRecoveryBusy] = useState(false)
  const [recoveryStatus, setRecoveryStatus] = useState('')
  const [recoveryStorageAvailable, setRecoveryStorageAvailable] = useState(true)

  const activeDocument =
    documents.find((document) => document.id === activeDocumentId) ||
    documents[0] ||
    null

  const context = () =>
    canvasRef.current?.getContext('2d', {
      willReadFrequently: true,
    }) || null

  function commitDocuments(next) {
    setDocuments((current) => {
      const value =
        typeof next === 'function' ? next(current) : next
      documentsRef.current = value
      return value
    })
  }

  function updateDocument(documentId, patch) {
    commitDocuments((current) =>
      current.map((document) =>
        document.id === documentId
          ? { ...document, ...patch }
          : document
      )
    )
  }

  function drawingContext() {
    const stack = layerStackRef.current
    if (!stack || canvasDocumentRef.current !== activeDocumentId) return null
    return studioLayerCanEdit(stack) ? studioLayerContext(stack) : null
  }

  function clearSelection() {
    selectionRef.current = null
    paintToolOverlay()
  }

  function selectionBounds(selection) {
    if (!selection?.data) return null
    if (selection.bounds) return selection.bounds.width && selection.bounds.height ? selection.bounds : null
    let left = selection.width, top = selection.height, right = 0, bottom = 0
    for (let index = 0; index < selection.data.length; index += 1) {
      if (!selection.data[index]) continue
      const x = index % selection.width
      const y = (index - x) / selection.width
      left = Math.min(left, x)
      top = Math.min(top, y)
      right = Math.max(right, x + 1)
      bottom = Math.max(bottom, y + 1)
    }
    return right > left && bottom > top ? { x: left, y: top, width: right - left, height: bottom - top } : null
  }

  function paintToolOverlay(preview = null) {
    const canvas = toolOverlayRef.current
    const stack = layerStackRef.current
    if (!canvas || !stack || canvasDocumentRef.current !== activeDocumentId) return
    if (canvas.width !== stack.width) canvas.width = stack.width
    if (canvas.height !== stack.height) canvas.height = stack.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (guidesRef.current.length) renderStudioRulerGuides(ctx, guidesRef.current)
    const chosen = preview || selectionRef.current
    if (!chosen) return
    ctx.save()
    try {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.setLineDash([7, 5])
      ctx.lineWidth = Math.max(1, 100 / Math.max(1, zoom))
      ctx.strokeStyle = '#33bfff'
      ctx.fillStyle = 'rgba(51,191,255,.12)'
      if (Array.isArray(chosen.points) && chosen.points.length > 1) {
        ctx.beginPath()
        chosen.points.forEach((p, index) => index ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))
        if (chosen.closed) ctx.closePath()
        ctx.stroke()
      } else {
        const rect = chosen.bounds || chosen
        if (rect.width > 0 && rect.height > 0) {
          ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)
          ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
        }
      }
    } finally { ctx.restore() }
  }

  function changeLayer(action, layerId, value) {
    const stack = layerStackRef.current
    if (!stack || canvasDocumentRef.current !== activeDocumentId || paperLoading || projectBusy || drawingRef.current || newFileOpen || exportOpen || recoveryBusy) return
    try {
      if (action === 'edit-text') {
        const layer = stack.layers.find((item) => item.id === layerId)
        if (!layer?.textData || !studioLayerCanEdit(stack, layerId)) return
        selectStudioLayer(stack, layerId)
        setTool('text')
        setTextEditor({ paperId: activeDocumentId, editingLayerId: layer.id, ...layer.textData.anchor, initialData: layer.textData })
        refresh((number) => number + 1)
        return
      } else if (action === 'add') {
        const selected = stack.layers.find((layer) => layer.id === stack.activeLayerId)
        const added = addStudioLayer(stack)
        if (selected?.groupId) added.groupId = selected.groupId
      } else if (action === 'convert-background') {
        const layer = stack.layers.find((item) => item.id === layerId)
        if (!layer?.isBackground || stack.layers[0] !== layer) return
        layer.isBackground = false
        layer.locked = false
        layer.name = 'Layer 0'
      } else if (action === 'duplicate') {
        const original = stack.layers.find((layer) => layer.id === layerId)
        const copy = duplicateStudioLayer(stack, layerId)
        if (original?.groupId) copy.groupId = original.groupId
        if (original?.blendMode) copy.blendMode = original.blendMode
      } else if (action === 'select') selectStudioLayer(stack, layerId)
      else if (action === 'visibility') {
        const layer = stack.layers.find((item) => item.id === layerId)
        if (!layer) return
        updateStudioLayer(stack, layerId, { visible: !layer.visible })
      } else if (action === 'lock') {
        const layer = stack.layers.find((item) => item.id === layerId)
        if (!layer) return
        updateStudioLayer(stack, layerId, { locked: !layer.locked })
      } else if (action === 'opacity') updateStudioLayer(stack, layerId, { opacity: value })
      else if (action === 'rename') updateStudioLayer(stack, layerId, { name: value })
      else if (action === 'blend') setStudioLayerBlendMode(stack, layerId, value)
      else if (action === 'group-add') createStudioLayerGroup(stack, [layerId || stack.activeLayerId])
      else if (action === 'group-remove') removeStudioLayerGroup(stack, layerId)
      else if (action === 'group-rename') updateStudioLayerGroup(stack, layerId, { name: value })
      else if (action === 'group-visibility' || action === 'group-lock' || action === 'group-collapse') {
        const group = stack.groups?.find((item) => item.id === layerId)
        if (!group) throw new Error('Layer group not found.')
        const field = action === 'group-visibility' ? 'visible' : action === 'group-lock' ? 'locked' : 'collapsed'
        updateStudioLayerGroup(stack, layerId, { [field]: !group[field] })
      } else if (action === 'group-opacity') updateStudioLayerGroup(stack, layerId, { opacity: value })
      else if (action === 'group-blend') setStudioGroupBlendMode(stack, layerId, value)
      else if (action === 'group-join') {
        const layer = stack.layers.find((item) => item.id === layerId)
        const group = stack.groups?.find((item) => item.id === value)
        if (!layer || !group || layer.isBackground || layer.groupId) throw new Error('Select an ungrouped editable layer.')
        const index = stack.layers.indexOf(layer)
        if (stack.layers[index - 1]?.groupId !== group.id && stack.layers[index + 1]?.groupId !== group.id) throw new Error('Only an adjacent layer can join a group.')
        layer.groupId = group.id
        try { validateStudioGroupLayout(stack) } catch (error) { delete layer.groupId; throw error }
      } else if (action === 'move') {
        const before = [...stack.layers]
        if (!moveStudioLayer(stack, layerId, value)) return
        try { validateStudioGroupLayout(stack) } catch (error) { stack.layers = before; throw error }
      } else if (action === 'merge-down') {
        delete mergeStudioLayerDown(stack).textData
      } else if (action === 'remove') {
        const layer = stack.layers.find((item) => item.id === layerId)
        if (!layer || layer.isBackground || stack.layers.length <= 1) return
        if (!window.confirm(`Delete "${layer.name}"? You can undo this action.`)) return
        if (!removeStudioLayer(stack, layerId)) return
        if (layer?.groupId && !stack.layers.some((item) => item.groupId === layer.groupId)) removeStudioLayerGroup(stack, layer.groupId)
      } else return
      paintLayerPreview()
      if (action === 'select') {
        selectionRef.current = null
        paintToolOverlay()
        const last = historyRef.current[historyRef.current.length - 1]
        if (last) last.activeLayerId = stack.activeLayerId
        refresh((number) => number + 1)
      } else snapshot()
      updateDocument(activeDocumentId, { dirty: true })
      setProjectNotice('')
    } catch (error) {
      setProjectNotice(error.message || 'Could not update the layer.')
    }
  }

  function applyRightFeature(kind, options) {
    const stack = layerStackRef.current
    if (!stack || canvasDocumentRef.current !== activeDocumentId || paperLoading || projectBusy ||
      drawingRef.current || newFileOpen || exportOpen || recoveryBusy) {
      throw new Error('Wait until the current paper is ready before applying an effect.')
    }
    if (!studioLayerCanEdit(stack) || !studioLayerContext(stack)) {
      throw new Error('Select a visible, unlocked layer outside a locked or hidden group.')
    }
    if (kind === 'balloon') {
      const previousLayerId = stack.activeLayerId
      const previousLayer = stack.layers.find((layer) => layer.id === previousLayerId)
      const group = stack.groups?.find((item) => item.id === previousLayer?.groupId)
      if (previousLayer?.groupId && (!group || !group.visible || group.locked)) {
        throw new Error('Unlock and show the selected group before adding a Manga balloon.')
      }
      const prepared = document.createElement('canvas')
      prepared.width = stack.width
      prepared.height = stack.height
      const context = prepared.getContext('2d', { willReadFrequently: true })
      if (!context) throw new Error('The Manga balloon canvas is unavailable.')
      if (options?.anchor) {
        const temporary = { width: stack.width, height: stack.height, layers: [{ id: 'balloon-placement', canvas: prepared, visible: true, locked: false }], activeLayerId: 'balloon-placement' }
        placeStudioMangaBalloon(temporary, options.anchor, options)
      } else drawStudioMangaBalloon(context, null, options)
      let addedLayer = null
      try {
        addedLayer = addStudioLayer(stack, 'Manga Balloon')
        if (previousLayer?.groupId) addedLayer.groupId = previousLayer.groupId
        validateStudioGroupLayout(stack)
        const target = addedLayer.canvas.getContext('2d', { willReadFrequently: true })
        if (!target) throw new Error('Could not create the Manga balloon layer.')
        target.drawImage(prepared, 0, 0)
        paintLayerPreview()
        snapshot()
        updateDocument(activeDocumentId, { dirty: true })
        setProjectNotice('Manga balloon added on a new layer. Undo can remove it.')
        return true
      } catch (error) {
        if (addedLayer) {
          stack.layers = stack.layers.filter((layer) => layer !== addedLayer)
          stack.activeLayerId = previousLayerId
          paintLayerPreview()
        }
        throw error
      }
    }
    const actions = {
      gradient: applyStudioLayerGradient,
      screentone: applyStudioScreentone,
      bubble: applyStudioSpeechBubble,
      panels: applyStudioComicPanels,
      effects: applyStudioMangaEffect,
    }
    const selection = selectionRef.current
    const action = kind === 'gradient' && selection?.data && selection.width === stack.width && selection.height === stack.height
      ? (layerStack, settings) => applyStudioSelectedGradient(layerStack, selection, settings)
      : actions[kind]
    if (!action) throw new Error('This effect is not available.')
    const changed = action(stack, options)
    if (changed) {
      delete stack.layers.find((item) => item.id === stack.activeLayerId)?.textData
      paintLayerPreview()
      snapshot()
      updateDocument(activeDocumentId, { dirty: true })
      setProjectNotice('')
    }
    return changed
  }

  function paintLayerPreview() {
    const stack = layerStackRef.current
    const canvas = canvasRef.current
    if (stack && canvas) renderStudioAdvancedLayers(stack, canvas)
    paintToolOverlay()
  }

  function captureLayerHistory() {
    const stack = layerStackRef.current
    if (!stack) return null
    return {
      width: stack.width,
      height: stack.height,
      activeLayerId: stack.activeLayerId,
      groups: (stack.groups || []).map((group) => ({ ...group })),
      layers: stack.layers.map((layer) => ({
        id: layer.id,
        name: layer.name,
        visible: layer.visible,
        locked: layer.locked,
        opacity: layer.opacity,
        isBackground: layer.isBackground === true,
        ...(layer.groupId ? { groupId: layer.groupId } : {}),
        ...(layer.blendMode ? { blendMode: layer.blendMode } : {}),
        ...(layer.textData ? { textData: { ...layer.textData, anchor: { ...layer.textData.anchor } } } : {}),
        pixels: layer.canvas.getContext('2d', { willReadFrequently: true })
          .getImageData(0, 0, stack.width, stack.height),
      })),
    }
  }

  function restoreLayerHistory(entry) {
    const stack = layerStackRef.current
    if (!stack || !entry) return
    const width = entry.width ?? stack.width
    const height = entry.height ?? stack.height
    const resized = stack.width !== width || stack.height !== height
    stack.width = width
    stack.height = height
    if (resized) {
      const display = canvasRef.current
      if (display) { display.width = width; display.height = height }
      selectionRef.current = null
      guidesRef.current = []
      updateDocument(activeDocumentId, { width, height, dirty: true })
    }
    stack.layers = entry.layers.map((item) => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d', { willReadFrequently: true }).putImageData(item.pixels, 0, 0)
      return { id: item.id, name: item.name, canvas, visible: item.visible, locked: item.locked, opacity: item.opacity, isBackground: item.isBackground === true, ...(item.groupId ? { groupId: item.groupId } : {}), ...(item.blendMode ? { blendMode: item.blendMode } : {}), ...(item.textData ? { textData: { ...item.textData, anchor: { ...item.textData.anchor } } } : {}) }
    })
    stack.activeLayerId = entry.activeLayerId
    stack.groups = (entry.groups || []).map((group) => ({ ...group }))
    paintLayerPreview()
  }

  function limitLayerHistory(entries) {
    const latest = entries.slice(-HISTORY_LIMIT)
    const bytes = (entry) => entry.layers.reduce((total, layer) => total + layer.pixels.data.byteLength, 0)
    let total = latest.reduce((sum, entry) => sum + bytes(entry), 0)
    while (latest.length > 2 && total > HISTORY_MEMORY_BUDGET) total -= bytes(latest.shift())
    return latest
  }

  function resetHistory() {
    const entry = captureLayerHistory()
    historyRef.current = entry ? [entry] : []
    redoRef.current = []
    refresh((number) => number + 1)
  }

  function snapshot(resetRedo = true) {
    const entry = captureLayerHistory()
    if (!entry) return
    historyRef.current = limitLayerHistory([...historyRef.current, entry])
    if (resetRedo) redoRef.current = []
    refresh((number) => number + 1)
  }

  function paintBlank(document = activeDocument) {
    const canvas = canvasRef.current
    const ctx = context()

    if (!canvas || !ctx) return

    ctx.save()
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = document?.background || '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.restore()
  }

  function storeActiveImage(
    documentList = documentsRef.current
  ) {
    const canvas = canvasRef.current

    if (!canvas || !activeDocumentId) {
      return documentList
    }

    const stack = layerStackRef.current
    if (!stack || canvasDocumentRef.current !== activeDocumentId) return documentList
    const image = canvas.toDataURL('image/png')
    const savedLayers = exportStudioLayerStack(stack)

    return documentList.map((document) =>
      document.id === activeDocumentId
        ? { ...document, image, ...savedLayers }
        : document
    )
  }

  function loadDocument(paper) {
    const token = ++loadTokenRef.current
    canvasDocumentRef.current = ''
    layerStackRef.current = null
    selectionRef.current = null
    guidesRef.current = []
    toolGestureRef.current = null
    drawingRef.current = false
    setAdvancedEditor(null)
    const canvas = canvasRef.current
    if (!canvas || !paper) return

    canvas.width = paper.width || W
    canvas.height = paper.height || H
    paintBlank(paper)
    setPaperLoading(true)

    async function finishLoading() {
      if (token !== loadTokenRef.current || canvasRef.current !== canvas) return
      try {
        const stack = await loadStudioLayerStack(paper, canvas)
        if (token !== loadTokenRef.current || canvasRef.current !== canvas) return
        layerStackRef.current = stack
        canvasDocumentRef.current = paper.id
        resetHistory()
      } catch (error) {
        if (token !== loadTokenRef.current) return
        layerStackRef.current = null
        setProjectNotice(`Layer restore failed: ${error.message}. Your saved paper is unchanged.`)
      } finally {
        if (token === loadTokenRef.current) setPaperLoading(false)
      }
    }

    if (!paper.image) {
      void finishLoading()
      return
    }

    const image = new Image()
    image.onload = () => {
      if (token !== loadTokenRef.current || canvasRef.current !== canvas) return
      paintBlank(paper)
      context()?.drawImage(image, 0, 0, canvas.width, canvas.height)
      void finishLoading()
    }
    image.onerror = () => {
      if (token !== loadTokenRef.current) return
      setProjectNotice(tx('shadowStudio.imageLoadFailed'))
      setPaperLoading(false)
    }
    image.src = paper.image
  }

  useEffect(() => {
    if (!workspaceStarted || !activeDocumentId) return

    const document = documentsRef.current.find(
      (item) => item.id === activeDocumentId
    )

    if (document) {
      loadDocument(document)
    }
  }, [workspaceStarted, activeDocumentId, projectLoadKey])

  useEffect(() => {
    let mounted = true

    readStudioRecovery()
      .then((entry) => {
        if (mounted) setRecoveryEntry(entry)
      })
      .catch((error) => {
        if (mounted) {
          setRecoveryStorageAvailable(false)
          setRecoveryStatus(tx('shadowStudio.recoveryStorageUnavailable', { error: error.message }))
        }
      })
      .finally(() => {
        if (mounted) setRecoveryBooting(false)
      })

    return () => {
      mounted = false
      clearTimeout(recoveryTimerRef.current)
    }
  }, [])

  useEffect(() => {
    clearTimeout(recoveryTimerRef.current)

    if (recoveryBooting || !recoveryStorageAvailable || recoveryEntry || recoveryBusy || projectBusy || paperLoading) return

    const current = documentsRef.current
    const revision = ++recoverySequenceRef.current

    if (!current.length) {
      if (!hadWorkspaceRef.current) return
      hadWorkspaceRef.current = false
      clearStudioRecovery()
        .then(() => setRecoveryStatus(tx('shadowStudio.recoveryCleared')))
        .catch((error) => setRecoveryStatus(tx('shadowStudio.autosaveFailed', { error: error.message })))
      return
    }

    hadWorkspaceRef.current = true
    if (workspaceStarted && canvasDocumentRef.current !== activeDocumentId) return

    recoveryTimerRef.current = setTimeout(() => {
      if (drawingRef.current || revision !== recoverySequenceRef.current) return

      const pages = workspaceStarted ? storeActiveImage(documentsRef.current) : documentsRef.current
      const canvas = workspaceStarted && layerStackRef.current ? canvasRef.current : null

      saveStudioRecovery(pages, activeDocumentId, canvas)
        .then((savedAt) => {
          if (revision === recoverySequenceRef.current) {
            setRecoveryStatus(tx('shadowStudio.autosavedAt', { time: new Date(savedAt).toLocaleTimeString() }))
          }
        })
        .catch((error) => {
          setRecoveryStatus(tx('shadowStudio.autosaveFailedSave', { error: error.message }))
        })
    }, 2500)

    return () => clearTimeout(recoveryTimerRef.current)
  }, [documents, activeDocumentId, workspaceStarted, paperLoading, projectBusy, recoveryBooting, recoveryEntry, recoveryBusy, recoveryStorageAvailable])

  async function recoverWorkspace() {
    if (!recoveryEntry || recoveryBusy) return
    setRecoveryBusy(true)

    try {
      const recovered = await restoreStudioRecovery(recoveryEntry)
      const checked = buildStudioProject(recovered.documents, recovered.activeDocumentId)
      const papers = checked.documents.map((paper) => ({ ...paper, dirty: true }))
      documentsRef.current = papers
      setDocuments(papers)
      setActiveDocumentId(checked.activeDocumentId)
      setWorkspaceStarted(true)
      setProjectLoadKey((value) => value + 1)
      setRecoveryEntry(null)
      setRecoveryStatus(tx('shadowStudio.recoveredPapers'))
    } catch (error) {
      setRecoveryStatus(tx('shadowStudio.recoveryFailed', { error: error.message }))
    } finally {
      setRecoveryBusy(false)
    }
  }

  async function discardRecovery() {
    if (!recoveryEntry || recoveryBusy) return
    if (!window.confirm(tx('shadowStudio.deleteRecoveryConfirm'))) return

    setRecoveryBusy(true)
    try {
      await clearStudioRecovery()
      setRecoveryEntry(null)
      setRecoveryStatus(tx('shadowStudio.recoveryDeleted'))
    } catch (error) {
      setRecoveryStatus(tx('shadowStudio.discardRecoveryFailed', { error: error.message }))
    } finally {
      setRecoveryBusy(false)
    }
  }

  useEffect(() => {
    function confirmBeforeUnload(event) {
      if (!documentsRef.current.some((document) => document.dirty)) return
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', confirmBeforeUnload)
    return () => window.removeEventListener('beforeunload', confirmBeforeUnload)
  }, [])

  function exitStudio() {
    if (
      documentsRef.current.length &&
      !window.confirm(tx('shadowStudio.exitConfirm'))
    ) {
      return
    }

    navigate(-1)
  }

  function chooseProjectFile() {
    if (projectBusy || recoveryBooting || recoveryEntry || recoveryBusy) return
    openProjectInputRef.current?.click()
  }

  function chooseImageFile() {
    if (paperLoading || projectBusy || recoveryBooting || recoveryEntry || recoveryBusy || newFileOpen || exportOpen) return
    if (documentsRef.current.length >= DOCUMENT_LIMIT) {
      window.alert(tx('shadowStudio.documentLimit'))
      return
    }
    importImageInputRef.current?.click()
  }

  async function importImageAsPaper(file) {
    if (!file || paperLoading || projectBusy || recoveryBooting || recoveryEntry || recoveryBusy || newFileOpen || exportOpen) return
    if (documentsRef.current.length >= DOCUMENT_LIMIT) {
      window.alert(tx('shadowStudio.documentLimit'))
      return
    }
    setProjectBusy(true)
    setProjectNotice('')
    try {
      const settings = await readStudioImage(file)
      if (documentsRef.current.length >= DOCUMENT_LIMIT) {
        window.alert(tx('shadowStudio.documentLimit'))
        return
      }
      const previous = workspaceStarted && activeDocumentId
        ? storeActiveImage(documentsRef.current)
        : documentsRef.current
      const imported = createDocument(settings)
      const next = [...previous, imported]
      documentsRef.current = next
      setDocuments(next)
      setWorkspaceStarted(true)
      setActiveDocumentId(imported.id)
      setProjectNotice(tx('shadowStudio.imageImported', { name: settings.name }))
    } catch (error) {
      setProjectNotice(error.message || tx('shadowStudio.imageImportFailed'))
    } finally {
      setProjectBusy(false)
    }
  }

  async function openProject(file) {
    if (!file || projectBusy || recoveryBooting || recoveryEntry || recoveryBusy) return

    setProjectBusy(true)
    setProjectNotice('')

    try {
      const project = await readStudioProject(file)

      if (
        documentsRef.current.length &&
        !window.confirm(tx('shadowStudio.openProjectConfirm'))
      ) {
        return
      }

      documentsRef.current = project.documents
      setDocuments(project.documents)
      setActiveDocumentId(project.activeDocumentId)
      setNewFileOpen(false)
      setProjectLoadKey((value) => value + 1)
      setWorkspaceStarted(true)
      setProjectNotice(tx('shadowStudio.projectOpened', { count: project.documents.length }))
    } catch (error) {
      setProjectNotice(error.message || tx('shadowStudio.openProjectFailed'))
    } finally {
      setProjectBusy(false)
    }
  }

  function saveProject(fileName = '') {
    if (projectBusy || paperLoading) {
      setProjectNotice(tx('shadowStudio.paperStillLoading'))
      return
    }

    const current = documentsRef.current

    if (!current.length) {
      setProjectNotice(tx('shadowStudio.createPaperFirst'))
      return
    }

    try {
      const saved = workspaceStarted && activeDocumentId
        ? storeActiveImage(current)
        : current
      const project = buildStudioProject(saved, activeDocumentId)
      downloadStudioProject(project, fileName)
            const clean = saved.map((document) => ({ ...document, dirty: false }))
      documentsRef.current = clean
      setDocuments(clean)
      setProjectNotice(tx('shadowStudio.projectDownloadStarted'))
    } catch (error) {
      setProjectNotice(error.message || tx('shadowStudio.projectSaveFailed'))
    }
  }

  function saveProjectAs() {
    if (!documentsRef.current.length || paperLoading || projectBusy) return
    const suggestedName = documentsRef.current[0]?.name || 'Shadow-Project'
    const entered = window.prompt(tx('shadowStudio.saveProjectCopyPrompt'), suggestedName)
    if (entered === null) return
    const name = entered.trim().replace(/\.shadowstudio$/i, '')
    if (!name) {
      window.alert(tx('shadowStudio.projectNameRequired'))
      return
    }
    saveProject(name)
  }

  function openExportDialog() {
    if (!workspaceStarted || !activeDocument || paperLoading || projectBusy || newFileOpen) return
    setExportOpen(true)
  }

  function closeAllPapers() {
    if (paperLoading || projectBusy || recoveryBusy || !documentsRef.current.length) return
    if (!window.confirm(tx('shadowStudio.closeAllConfirm'))) return
    loadTokenRef.current += 1
    clearTimeout(recoveryTimerRef.current)
    documentsRef.current = []
    setDocuments([])
    setActiveDocumentId('')
    setWorkspaceStarted(false)
    setNewFileOpen(false)
    canvasDocumentRef.current = ''
    layerStackRef.current = null
    historyRef.current = []
    redoRef.current = []
    setProjectNotice(tx('shadowStudio.allPapersClosed'))
  }

  function openNewFile(presetId = 'basic') {
    if (paperLoading || projectBusy || recoveryBooting || recoveryEntry || recoveryBusy) return

    if (documentsRef.current.length >= DOCUMENT_LIMIT) {
      window.alert(tx('shadowStudio.documentLimit'))
      return
    }

    setNewFilePreset(presetId)
    setNewFileOpen(true)
  }

  function createPaper(settings) {
    if (paperLoading || projectBusy) return

    const current = documentsRef.current

    if (current.length >= DOCUMENT_LIMIT) {
      setNewFileOpen(false)
      window.alert(tx('shadowStudio.documentLimit'))
      return
    }

    const saved =
      workspaceStarted && activeDocumentId
        ? storeActiveImage(current)
        : current

    const document = createDocument(settings)
    const next = [...saved, document]

    documentsRef.current = next
    setDocuments(next)
    setNewFileOpen(false)
    setWorkspaceStarted(true)
    setActiveDocumentId(document.id)
  }

  function renameDocument(documentId, nextName) {
    if (paperLoading || projectBusy || recoveryBusy) return
    const current = documentsRef.current.find((paper) => paper.id === documentId)
    const name = String(nextName || '').trim().slice(0, 80)
    if (!current || !name || current.name === name) return
    updateDocument(documentId, { name, dirty: true })
  }

  function switchDocument(documentId) {
    if (paperLoading || projectBusy || documentId === activeDocumentId) return

    const saved = storeActiveImage(documentsRef.current)
    const target = saved.find(
      (document) => document.id === documentId
    )

    if (!target) return

    documentsRef.current = saved
    setDocuments(saved)
    setActiveDocumentId(documentId)
  }

  function closeDocument(documentId, event) {
    event?.stopPropagation()
    if (paperLoading || projectBusy) return

    const current = documentsRef.current
    const index = current.findIndex(
      (document) => document.id === documentId
    )
    const target = current[index]

    if (!target) return

    if (
      target.dirty &&
      !window.confirm(tx('shadowStudio.closeConfirm'))
    ) {
      return
    }

    const base =
      documentId === activeDocumentId
        ? current
        : storeActiveImage(current)

    const next = base.filter(
      (document) => document.id !== documentId
    )

    documentsRef.current = next
    setDocuments(next)

    if (!next.length) {
      setActiveDocumentId('')
      setWorkspaceStarted(false)
      historyRef.current = []
      redoRef.current = []
      layerStackRef.current = null
      return
    }

    if (documentId === activeDocumentId) {
      const nextDocument =
        next[Math.min(index, next.length - 1)]
      setActiveDocumentId(nextDocument.id)
    }
  }

  function goHome() {
    if (paperLoading || projectBusy) return
    const saved = storeActiveImage(documentsRef.current)
    documentsRef.current = saved
    setDocuments(saved)
    setWorkspaceStarted(false)
  }

  function resumeWorkspace() {
    if (projectBusy || !documentsRef.current.length) return

    setWorkspaceStarted(true)

    if (!activeDocumentId) {
      setActiveDocumentId(documentsRef.current[0].id)
    }
  }

  const displayedWidth = Math.max(1, Math.round((activeDocument?.width || W) * zoom / 100))
  const displayedHeight = Math.max(1, Math.round((activeDocument?.height || H) * zoom / 100))
  const viewRadians = viewRotation * Math.PI / 180
  const viewCos = Math.cos(viewRadians)
  const viewSin = Math.sin(viewRadians)
  const viewFrameWidth = Math.ceil(Math.abs(displayedWidth * viewCos) + Math.abs(displayedHeight * viewSin)) + 2
  const viewFrameHeight = Math.ceil(Math.abs(displayedWidth * viewSin) + Math.abs(displayedHeight * viewCos)) + 2

  function updateCanvasView(nextRotation = viewRotation, nextHorizontal = flipHorizontal, nextVertical = flipVertical) {
    const angle = ((Math.round(nextRotation) % 360) + 540) % 360 - 180
    setViewRotation(angle)
    setFlipHorizontal(nextHorizontal)
    setFlipVertical(nextVertical)
    if (activeDocumentId) {
      viewStatesRef.current[activeDocumentId] = {
        angle,
        horizontal: nextHorizontal,
        vertical: nextVertical,
      }
    }
  }

  useEffect(() => {
    const previous = viewStatesRef.current[activeDocumentId]
    setViewRotation(previous?.angle || 0)
    setFlipHorizontal(Boolean(previous?.horizontal))
    setFlipVertical(Boolean(previous?.vertical))
  }, [activeDocumentId])

  function updateBrushSize(raw) {
  const value = Number(raw)
  if (!Number.isFinite(value)) return false
  const next = Math.round(Math.min(5000, Math.max(0.1, value)) * 10) / 10
  if (!confirmLargeBrush(next, size, language)) return false
  setSize(next)
  return true
}

  function clampZoom(value) {
    return Math.min(6400, Math.max(1, Math.round(Number(value) || 1)))
  }

  function zoomAround(nextZoom, clientX, clientY) {
    const work = workRef.current
    const canvas = canvasRef.current
    if (!work || !canvas || !workspaceStarted) return

    let target = clampZoom(nextZoom)
    if (target === zoom && nextZoom > zoom) target = clampZoom(zoom + 1)
    if (target === zoom && nextZoom < zoom) target = clampZoom(zoom - 1)
    if (target === zoom) return

    const canvasRect = canvas.getBoundingClientRect()
    const workRect = work.getBoundingClientRect()
    const x = clientX ?? workRect.left + workRect.width / 2
    const y = clientY ?? workRect.top + workRect.height / 2

    zoomAnchorRef.current = {
      x,
      y,
      canvasX: (x - canvasRect.left) / canvasRect.width,
      canvasY: (y - canvasRect.top) / canvasRect.height,
    }
    setZoom(target)
  }

  function fitCanvas() {
    const work = workRef.current
    const document = documentsRef.current.find((item) => item.id === activeDocumentId)
    if (!work || !document) return

    const width = Math.max(100, work.clientWidth - 70)
    const height = Math.max(100, work.clientHeight - 70)
    const boundingWidth = Math.abs(document.width * viewCos) + Math.abs(document.height * viewSin)
    const boundingHeight = Math.abs(document.width * viewSin) + Math.abs(document.height * viewCos)
    const next = clampZoom(Math.min(width / boundingWidth, height / boundingHeight) * 100)
    zoomAnchorRef.current = null
    setZoom(next)
    requestAnimationFrame(() => {
      if (workRef.current !== work) return
      work.scrollLeft = 0
      work.scrollTop = 0
    })
  }

  useLayoutEffect(() => {
    const anchor = zoomAnchorRef.current
    const work = workRef.current
    const canvas = canvasRef.current
    if (!anchor || !work || !canvas) return

    const rect = canvas.getBoundingClientRect()
    work.scrollLeft += rect.left + anchor.canvasX * rect.width - anchor.x
    work.scrollTop += rect.top + anchor.canvasY * rect.height - anchor.y
    zoomAnchorRef.current = null
  }, [zoom])

  useEffect(() => {
    if (!workspaceStarted || !activeDocumentId) return
    const frame = requestAnimationFrame(fitCanvas)
    return () => cancelAnimationFrame(frame)
  }, [workspaceStarted, activeDocumentId, projectLoadKey])

    useEffect(() => {
    function onKeyDown(event) {
      if (!workspaceStarted || !activeDocumentId || paperLoading || projectBusy || recoveryBooting || recoveryEntry || recoveryBusy || newFileOpen || exportOpen || textEditor || shapeEditor || drawingRef.current || event.isComposing) return

      const target = event.target
      if (target?.closest?.('input, textarea, select, [contenteditable="true"], [role="textbox"], [role="dialog"]')) return
      if (document.querySelector('[aria-modal="true"], .ss-dialog-backdrop, .ss-export-backdrop')) return

      const key = event.key.toLowerCase()
      const modifier = event.ctrlKey || event.metaKey

      if (modifier && !event.altKey) {
        let action = null

        if (key === 'z') {
          action = event.shiftKey ? redo : undo
        } else if (key === 'y' && !event.shiftKey) {
          action = redo
        } else if (key === 's') {
          action = event.shiftKey ? saveProjectAs : () => saveProject()
        } else if (key === 'o' && !event.shiftKey) {
          action = chooseProjectFile
        } else if (key === 'n' && !event.shiftKey) {
          action = () => openNewFile('basic')
        } else if (key === 'e' && event.shiftKey) {
          action = openExportDialog
        }

        if (!action) return

        event.preventDefault()
        event.stopPropagation()

        if (!event.repeat) action()
        return
      }

      if ((key === 'delete' || key === 'backspace') && !modifier && !event.altKey && !event.shiftKey) {
        const paperTab = target?.closest?.('.ss-tabs > .ss-tab')
        if (paperTab) {
          const tabIndex = Array.from(paperTab.parentElement.children).filter((node) => node.classList.contains('ss-tab')).indexOf(paperTab)
          const paperId = documentsRef.current[tabIndex]?.id
          if (paperId) {
            event.preventDefault()
            event.stopPropagation()
            if (!event.repeat) closeDocument(paperId)
          }
          return
        }
        if (target?.closest?.('.ss-lcp-group')) return
        const withinLayers = target?.closest?.('.ss-lcp')
        const withinCanvas = target === canvasRef.current || target?.closest?.('.ss-work')
        const noFocusedControl = target === document.body || target === document.documentElement
        if (!withinLayers && !withinCanvas && !noFocusedControl) return
        const stack = layerStackRef.current
        if (!stack || canvasDocumentRef.current !== activeDocumentId) return
        const focusedLayerId = target?.closest?.('[data-ss-layer-id]')?.getAttribute('data-ss-layer-id')
        const selectedLayer = stack.layers.find((layer) => layer.id === (focusedLayerId || stack.activeLayerId))
        if (!selectedLayer) return
        event.preventDefault()
        event.stopPropagation()
        if (event.repeat) return
        if (selectedLayer.isBackground || stack.layers.length <= 1) {
          setProjectNotice(selectedLayer.isBackground ? 'Convert Background to a normal layer before deleting it.' : 'Keep at least one layer on the canvas.')
          return
        }
        changeLayer('remove', selectedLayer.id)
        return
      }

      if (modifier || event.altKey || event.repeat) return

      if (key === 'escape' && selectionRef.current) {
        event.preventDefault()
        clearSelection()
        return
      }

      if (event.code === 'Space') {
        if (target?.closest?.('button, a, summary, [role="button"], [role="menuitem"]')) return
        event.preventDefault()
        spaceRef.current = true
        setHandMode(true)
        return
      }

      if (event.shiftKey && key === 'g') {
        event.preventDefault()
        setShowGrid((current) => !current)
        return
      }

      if (key === '[' || key === ']') {
        event.preventDefault()
        const step = Math.max(1, Math.round(size * 0.1))
        updateBrushSize(size + (key === '[' ? -step : step))
        return
      }

      if (key === '=' || key === '+') {
        event.preventDefault()
        zoomAround(zoom * 1.2)
        return
      }

      if (key === '-' || key === '_') {
        event.preventDefault()
        zoomAround(zoom / 1.2)
        return
      }

      if (event.shiftKey) return

      const tools = {
        b: 'brush',
        e: 'eraser',
        i: 'eyedropper',
        p: 'pencil',
        t: 'text',
      }

      if (tools[key]) {
        event.preventDefault()
        setTool(tools[key])
        return
      }

      if (key === 'f') {
        event.preventDefault()
        fitCanvas()
      }
    }

    function releaseSpace(event) {
      if (event?.code && event.code !== 'Space') return
      spaceRef.current = false
      setHandMode(false)
    }

    window.addEventListener('keydown', onKeyDown, true)
    window.addEventListener('keyup', releaseSpace)
    window.addEventListener('blur', releaseSpace)

    return () => {
      window.removeEventListener('keydown', onKeyDown, true)
      window.removeEventListener('keyup', releaseSpace)
      window.removeEventListener('blur', releaseSpace)
    }
  }, [
    workspaceStarted, activeDocumentId, paperLoading, projectBusy,
    recoveryBooting, recoveryEntry, recoveryBusy, newFileOpen,
    exportOpen, textEditor, shapeEditor, size, zoom, language,
  ])

  useEffect(() => {
    const work = workRef.current
    if (!work || !workspaceStarted) return

    function onWheel(event) {
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      if (paperLoading || projectBusy || newFileOpen) return
      zoomAround(zoom * (event.deltaY < 0 ? 1.12 : 1 / 1.12), event.clientX, event.clientY)
    }

    work.addEventListener('wheel', onWheel, { passive: false })
    return () => work.removeEventListener('wheel', onWheel)
  }, [workspaceStarted, zoom, paperLoading, projectBusy, newFileOpen])

  function panStart(event) {
    if (drawingRef.current || paperLoading || projectBusy) return
    if (!spaceRef.current && !(event.pointerType === 'mouse' && event.button === 1)) return

    const work = workRef.current
    if (!work) return
    event.preventDefault()
    event.stopPropagation()
    setHandMode(true)
    panRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      left: work.scrollLeft,
      top: work.scrollTop,
    }
    work.setPointerCapture?.(event.pointerId)
  }

  function panMove(event) {
    const pan = panRef.current
    const work = workRef.current
    if (!pan || !work || pan.id !== event.pointerId) return
    event.preventDefault()
    work.scrollLeft = pan.left - (event.clientX - pan.x)
    work.scrollTop = pan.top - (event.clientY - pan.y)
  }

  function panEnd(event) {
    const pan = panRef.current
    const work = workRef.current
    if (!pan || pan.id !== event.pointerId) return
    event.preventDefault()
    panRef.current = null
    setHandMode(spaceRef.current)
    if (work?.hasPointerCapture?.(event.pointerId)) work.releasePointerCapture(event.pointerId)
  }

  function clearCanvas(save = true) {
    const stack = layerStackRef.current
    if (!stack || canvasDocumentRef.current !== activeDocumentId) return
    stack.layers.forEach((layer, index) => {
      const ctx = layer.canvas.getContext('2d', { willReadFrequently: true })
      ctx.clearRect(0, 0, stack.width, stack.height)
      delete layer.textData
      if (index === 0 && layer.isBackground) {
        ctx.fillStyle = activeDocument?.background || '#FFFFFF'
        ctx.fillRect(0, 0, stack.width, stack.height)
      }
    })
    paintLayerPreview()
    updateDocument(activeDocumentId, { dirty: true })
    if (save) snapshot()
  }

  function editTool(type, extras = {}) {
    const stack = layerStackRef.current
    if (!stack || canvasDocumentRef.current !== activeDocumentId || paperLoading || projectBusy || drawingRef.current) return
    const bounds = selectionBounds(selectionRef.current)
    const rect = bounds || { x: 0, y: 0, width: stack.width, height: stack.height }
    let values
    if (type === 'transform') values = { translateX: 0, translateY: 0, scaleX: 1, scaleY: 1, rotate: 0 }
    else if (type === 'perspective') values = {
      corner0x: rect.x, corner0y: rect.y, corner1x: rect.x + rect.width, corner1y: rect.y,
      corner2x: rect.x + rect.width, corner2y: rect.y + rect.height, corner3x: rect.x, corner3y: rect.y + rect.height,
    }
    else if (type === 'canvas') values = { width: stack.width, height: stack.height, offsetX: 0, offsetY: 0 }
    else if (type === 'ruler') values = { axis: 'vertical', position: Math.round(stack.width / 2), angle: 0 }
    else if (type === 'balloon') values = { text: '', shape: 'ellipse', tail: 'bottom', width: Math.min(240, stack.width), height: Math.min(160, stack.height), fontSize: 24, font: 'sans', bold: false, italic: false, align: 'center', fill: '#FFFFFF', ink: color, textColor: color, opacity: 100 }
    else if (type === 'frame') values = { x: rect.x, y: rect.y, width: rect.width, height: rect.height, border: 5, ink: color, fill: 'transparent' }
    else values = { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
    setAdvancedEditor({ type, paperId: activeDocumentId, layerId: stack.activeLayerId, rect, values: { ...values, ...extras.values }, anchor: extras.anchor })
  }

  function finishAdvancedTool(editor, values) {
    const stack = layerStackRef.current
    if (!stack || editor.paperId !== activeDocumentId || canvasDocumentRef.current !== activeDocumentId ||
        paperLoading || projectBusy || drawingRef.current || newFileOpen || exportOpen || recoveryBusy) throw new Error('Wait for this paper to be ready.')
    if (editor.layerId !== stack.activeLayerId) throw new Error('The selected layer changed. Reopen the tool.')
    const type = editor.type
    if (type === 'ruler') {
      if (guidesRef.current.length >= 24) throw new Error('The guide limit is 24. Clear guides before adding more.')
      const guide = createStudioRulerGuide(stack.width, stack.height, values)
      guidesRef.current = [...guidesRef.current, guide]
      paintToolOverlay()
      return true
    }
    if (!studioLayerCanEdit(stack)) throw new Error('Unlock and show the selected layer first.')
    if (type === 'balloon') return applyRightFeature('balloon', { ...values, anchor: editor.anchor })
    const ctx = drawingContext()
    if (!ctx) throw new Error('The selected layer is not editable.')
    const selected = selectionRef.current
    const selection = selected?.width === stack.width && selected?.height === stack.height ? selected : null
    let changed = false
    if (type === 'transform') changed = transformStudioPixels(ctx, { ...values, rect: editor.rect, selection })
    else if (type === 'perspective') {
      const corners = [0, 1, 2, 3].map((index) => ({ x: values[`corner${index}x`], y: values[`corner${index}y`] }))
      changed = applyStudioPerspectiveTransform(stack, { rect: editor.rect, corners, selection })
    } else if (type === 'frame') {
      const { x, y, width, height, border, ink, fill } = values
      changed = applyStudioCustomComicFrames(stack, [{ x, y, width, height }], { border, ink, fill })
    } else if (type === 'crop' || type === 'canvas') {
      const width = Number(values.width)
      const height = Number(values.height)
      if (![width, height].every((value) => Number.isInteger(value) && value >= 64 && value <= 4096) || width * height > 12_000_000) throw new Error('Canvas must be 64–4096 px per side and no more than 12 MP.')
      const next = type === 'crop'
        ? cropStudioCanvas(stack, { x: values.x, y: values.y, width, height })
        : resizeStudioCanvas(stack, { width, height, offsetX: values.offsetX, offsetY: values.offsetY, background: activeDocument?.background || '#FFFFFF' })
      layerStackRef.current = next
      const display = canvasRef.current
      if (display) { display.width = width; display.height = height }
      selectionRef.current = null
      guidesRef.current = []
      paintLayerPreview()
      snapshot()
      updateDocument(activeDocumentId, { width, height, dirty: true })
      setProjectNotice('')
      return true
    } else throw new Error('Unknown tool.')
    if (changed) {
      const layer = stack.layers.find((item) => item.id === stack.activeLayerId)
      if (layer) delete layer.textData
      if (selection && (type === 'transform' || type === 'perspective')) selectionRef.current = null
      paintLayerPreview()
      snapshot()
      updateDocument(activeDocumentId, { dirty: true })
      setProjectNotice('')
    }
    return true
  }

  function selectTool(next) {
    if (drawingRef.current || paperLoading || projectBusy || newFileOpen || exportOpen) return
    if (next === 'gradient') {
      setMangaToolInitial('gradient')
      setMangaToolsOpen(true)
      return
    }
    setTool(next)
    if (['transform', 'perspective', 'canvas', 'ruler'].includes(next)) editTool(next)
    else if (next === 'balloon') setProjectNotice(language === 'km' ? 'ចុចលើក្រដាសដើម្បីជ្រើសទីតាំងពពុះសន្ទនា។' : 'Tap the paper to choose a speech balloon position.')
    else if (next === 'crop' || next === 'frame') setProjectNotice(language === 'km' ? 'អូសលើក្រដាសដើម្បីជ្រើសតំបន់។' : 'Drag on the paper to choose an area.')
  }

  function point(event) {
    const canvas = canvasRef.current

    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    const dx = event.clientX - (rect.left + rect.width / 2)
    const dy = event.clientY - (rect.top + rect.height / 2)
    const unrotatedX = dx * viewCos + dy * viewSin
    const unrotatedY = -dx * viewSin + dy * viewCos
    const x = (unrotatedX * (flipHorizontal ? -1 : 1) / displayedWidth + 0.5) * canvas.width
    const y = (unrotatedY * (flipVertical ? -1 : 1) / displayedHeight + 0.5) * canvas.height

    return { x, y }
  }

  function sampleCanvasColor(ctx, canvas, position) {
    const x = Math.floor(position.x)
    const y = Math.floor(position.y)
    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return
    try {
      const pixel = ctx.getImageData(x, y, 1, 1).data
      const sampled = `#${Array.from(pixel.slice(0, 3), (channel) => channel.toString(16).padStart(2, '0')).join('')}`.toUpperCase()
      setColor(sampled)
      setTool('brush')
    } catch {
      setProjectNotice(tx('shadowStudio.samplePixelFailed'))
    }
  }

  async function placeImageOnCurrentPaper(file, anchor = null) {
  if (!file || !workspaceStarted || paperLoading || projectBusy ||
      recoveryBusy || newFileOpen || exportOpen || drawingRef.current) return

  const canvas = canvasRef.current
  const paperId = activeDocumentId
  const target = drawingContext()?.canvas
  if (!canvas || !target || canvasDocumentRef.current !== paperId) return

  setProjectBusy(true)
  try {
    const name = await placeStudioDroppedImage(
      file, target, anchor,
      () => canvas === canvasRef.current && target === drawingContext()?.canvas &&
        paperId === activeDocumentId && canvasDocumentRef.current === paperId
    )
    if (name) {
      const changedLayer = layerStackRef.current?.layers.find((layer) => layer.canvas === target)
      if (changedLayer) delete changedLayer.textData
      paintLayerPreview()
      snapshot()
      updateDocument(paperId, { dirty: true })
      setProjectNotice(`${placeImageLabel}: ${name}`)
      return name
    }
  } catch {
    setProjectNotice(tx('shadowStudio.imageImportFailed'))
  } finally {
    setProjectBusy(false)
  }
}

async function dropImageOnPaper(event) {
  event.preventDefault()
  const file = [...event.dataTransfer.files]
    .find(f => /\.(png|jpe?g|webp)$/i.test(f.name))
  const anchor = event.target === canvasRef.current ? point(event) : null
  await placeImageOnCurrentPaper(file, anchor)
}

  function finishRasterStroke(ctx, changed) {
    if (!changed) return
    const stack = layerStackRef.current
    const layer = stack?.layers.find((item) => item.id === stack.activeLayerId)
    if (layer) delete layer.textData
    paintLayerPreview()
    snapshot()
    updateDocument(activeDocumentId, { dirty: true })
    setProjectNotice('')
  }

  function gesturePoint(event) {
    const raw = point(event)
    if (!raw) return null
    return guidesRef.current.length && tool !== 'lasso' && tool !== 'smudge' && tool !== 'blur'
      ? snapStudioPointToGuides(raw, guidesRef.current, Math.min(20, 8 * 100 / Math.max(1, zoom)))
      : raw
  }

  function start(event) {
    if (drawingRef.current || paperLoading || projectBusy || recoveryBusy || panRef.current || spaceRef.current || advancedEditor || mangaToolsOpen || newFileOpen || exportOpen) return
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const canvas = canvasRef.current
    const currentPoint = gesturePoint(event)
    const stack = layerStackRef.current
    if (!canvas || !currentPoint || !stack || canvasDocumentRef.current !== activeDocumentId) return
    if (tool === 'text') { event.preventDefault(); setTextEditor({ ...currentPoint, paperId: activeDocumentId }); return }
    if (tool === 'shape') { event.preventDefault(); setShapeEditor({ ...currentPoint, paperId: activeDocumentId }); return }
    if (tool === 'eyedropper') { event.preventDefault(); sampleCanvasColor(context(), canvas, currentPoint); return }
    if (['transform', 'perspective', 'canvas', 'ruler'].includes(tool)) { event.preventDefault(); editTool(tool); return }
    if (tool === 'balloon') { event.preventDefault(); editTool('balloon', { anchor: currentPoint }); return }
    if (tool === 'wand') {
      event.preventDefault()
      const ctx = drawingContext()
      if (!ctx) return
      try {
        const selection = createStudioMagicWandSelection(ctx.getImageData(0, 0, stack.width, stack.height), currentPoint, { tolerance: 16 })
        selection.bounds = selectionBounds(selection)
        selectionRef.current = selection.bounds ? selection : null
        paintToolOverlay()
        setProjectNotice(selection.bounds ? '' : 'Nothing selected.')
      } catch (error) { setProjectNotice(error.message || 'Could not select this area.') }
      return
    }
    if (tool === 'fill') {
      event.preventDefault()
      try {
        const ctx = drawingContext()
        if (ctx) finishRasterStroke(ctx, applyStudioPaintBucket(ctx, currentPoint, { color, opacity, selection: selectionRef.current }))
      } catch (error) { setProjectNotice(error.message || 'Paint Bucket failed.') }
      return
    }
    const gestures = ['move', 'marquee', 'lasso', 'crop', 'frame', 'smudge', 'blur']
    if (gestures.includes(tool)) {
      const ctx = ['move', 'smudge', 'blur', 'frame'].includes(tool) ? drawingContext() : null
      if (['move', 'smudge', 'blur', 'frame'].includes(tool) && !ctx) return
      event.preventDefault()
      try {
        const gesture = {
          tool, ctx, pointerId: event.pointerId, paperId: activeDocumentId, layerId: stack.activeLayerId,
          start: currentPoint, last: currentPoint, points: [currentPoint], changed: false,
        }
        if (tool === 'smudge') gesture.stroke = beginStudioSmudge(ctx, currentPoint, { size: Math.min(size, 256), strength: opacity / 100, selection: selectionRef.current })
        if (tool === 'blur') gesture.changed = applyStudioBlurDab(ctx, currentPoint, { size: Math.min(size, 256), strength: opacity / 100, selection: selectionRef.current })
        toolGestureRef.current = gesture
        drawingRef.current = true
        canvas.setPointerCapture?.(event.pointerId)
        paintToolOverlay(['marquee', 'crop', 'frame'].includes(tool) ? { x: currentPoint.x, y: currentPoint.y, width: 0, height: 0 } : tool === 'lasso' ? { points: gesture.points } : null)
      } catch (error) { setProjectNotice(error.message || 'Could not start this tool.') }
      return
    }
    if (!['brush', 'pencil', 'eraser'].includes(tool)) return
    const ctx = drawingContext()
    if (!ctx) return
    const stroke = beginStudioStroke(ctx, currentPoint, event, {
      size, opacity,
      style: tool === 'eraser' ? 'round' : tool === 'pencil' ? 'pencil' : brushStyle,
      color: tool === 'eraser' ? activeDocument?.background || '#FFFFFF' : color,
      erase: tool === 'eraser',
    })
    if (!stroke) return
    delete stack.layers.find((layer) => layer.id === stack.activeLayerId)?.textData
    paintLayerPreview()
    event.preventDefault()
    strokeRef.current = stroke
    drawingRef.current = true
    canvas.setPointerCapture?.(event.pointerId)
  }

  function gesturePreview(gesture) {
    if (gesture.tool === 'lasso') return { points: gesture.points }
    const x = Math.min(gesture.start.x, gesture.last.x)
    const y = Math.min(gesture.start.y, gesture.last.y)
    return { x, y, width: Math.abs(gesture.last.x - gesture.start.x), height: Math.abs(gesture.last.y - gesture.start.y) }
  }

  function draw(event) {
    const gesture = toolGestureRef.current
    if (gesture && gesture.pointerId === event.pointerId) {
      const ctx = gesture.ctx
      event.preventDefault()
      const position = gesturePoint(event)
      if (!position) return
      try {
        if (gesture.tool === 'lasso' && Math.hypot(position.x - gesture.last.x, position.y - gesture.last.y) >= 2) gesture.points.push(position)
        if (gesture.tool === 'smudge') gesture.changed = extendStudioSmudge(ctx, gesture.stroke, position) || gesture.changed
        if (gesture.tool === 'blur' && Math.hypot(position.x - gesture.last.x, position.y - gesture.last.y) >= Math.max(2, Math.min(size, 256) / 5)) gesture.changed = applyStudioBlurDab(ctx, position, { size: Math.min(size, 256), strength: opacity / 100, selection: selectionRef.current }) || gesture.changed
        gesture.last = position
        if (['marquee', 'lasso', 'crop', 'frame'].includes(gesture.tool)) paintToolOverlay(gesturePreview(gesture))
        else if (gesture.changed) paintLayerPreview()
      } catch (error) { setProjectNotice(error.message || 'Could not use this tool.') }
      return
    }
    const stroke = strokeRef.current
    if (!drawingRef.current || !stroke || stroke.pointerId !== event.pointerId) return
    const ctx = drawingContext()
    if (!ctx) return
    event.preventDefault()
    const coalesced = typeof event.getCoalescedEvents === 'function' ? event.getCoalescedEvents() : []
    for (const sample of [...coalesced, event]) {
      if (sample.pointerId !== stroke.pointerId) continue
      const currentPoint = point(sample)
      if (currentPoint) extendStudioStroke(ctx, stroke, currentPoint, sample)
    }
    paintLayerPreview()
  }

  function finish(event) {
    const gesture = toolGestureRef.current
    if (gesture && gesture.pointerId === event.pointerId) {
      event.preventDefault()
      toolGestureRef.current = null
      drawingRef.current = false
      const canvas = canvasRef.current
      if (canvas?.hasPointerCapture?.(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
      if (gesture.paperId !== activeDocumentId || canvasDocumentRef.current !== activeDocumentId || layerStackRef.current?.activeLayerId !== gesture.layerId) return
      const end = event.type === 'pointercancel' ? gesture.last : gesturePoint(event) || gesture.last
      const previousPoint = gesture.last
      gesture.last = end
      try {
        if (gesture.tool === 'marquee' && event.type !== 'pointercancel') {
          const selection = createStudioRectangleSelection(layerStackRef.current.width, layerStackRef.current.height, gesture.start, end)
          selectionRef.current = selection.bounds.width && selection.bounds.height ? selection : null
        } else if (gesture.tool === 'lasso' && event.type !== 'pointercancel') {
          if (Math.hypot(end.x - previousPoint.x, end.y - previousPoint.y) >= 2) gesture.points.push(end)
          const selection = gesture.points.length >= 3 ? createStudioLassoSelection(layerStackRef.current.width, layerStackRef.current.height, gesture.points) : null
          selectionRef.current = selection?.bounds?.width && selection?.bounds?.height ? { ...selection, points: gesture.points, closed: true } : null
        } else if (gesture.tool === 'crop' && event.type !== 'pointercancel') {
          const area = createStudioRectangleSelection(layerStackRef.current.width, layerStackRef.current.height, gesture.start, end).bounds
          if (area.width >= 64 && area.height >= 64) editTool('crop', { values: area })
          else setProjectNotice('Choose a crop area at least 64 × 64 px.')
        } else if (gesture.tool === 'frame' && event.type !== 'pointercancel') {
          const area = createStudioRectangleSelection(layerStackRef.current.width, layerStackRef.current.height, gesture.start, end).bounds
          if (area.width >= 12 && area.height >= 12) editTool('frame', { values: area })
          else setProjectNotice('Choose a frame at least 12 × 12 px.')
        } else if (gesture.tool === 'move' && event.type !== 'pointercancel') {
          const dx = Math.round(end.x - gesture.start.x)
          const dy = Math.round(end.y - gesture.start.y)
          const selection = selectionRef.current
          if (moveStudioPixels(gesture.ctx, { deltaX: dx, deltaY: dy, selection })) {
            if (selection && (dx || dy)) {
              const data = new Uint8Array(selection.data.length)
              const { width, height } = selection
              for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
                const toX = x + dx
                const toY = y + dy
                if (selection.data[y * width + x] && toX >= 0 && toX < width && toY >= 0 && toY < height) data[toY * width + toX] = selection.data[y * width + x]
              }
              selectionRef.current = { width, height, data }
              selectionRef.current.bounds = selectionBounds(selectionRef.current)
            }
            finishRasterStroke(gesture.ctx, true)
          }
        } else if (gesture.tool === 'smudge') {
          if (event.type !== 'pointercancel') gesture.changed = extendStudioSmudge(gesture.ctx, gesture.stroke, end) || gesture.changed
          finishRasterStroke(gesture.ctx, gesture.changed)
        } else if (gesture.tool === 'blur') finishRasterStroke(gesture.ctx, gesture.changed)
      } catch (error) { setProjectNotice(error.message || 'Could not complete this tool.') }
      paintToolOverlay()
      return
    }
    const stroke = strokeRef.current
    if (!drawingRef.current || !stroke || stroke.pointerId !== event.pointerId) return
    event.preventDefault()
    if (event.type !== 'pointercancel') {
      const currentPoint = point(event)
      if (currentPoint) extendStudioStroke(drawingContext(), stroke, currentPoint, event)
    }
    paintLayerPreview()
    drawingRef.current = false
    strokeRef.current = null
    const canvas = canvasRef.current
    if (canvas?.hasPointerCapture?.(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
    updateDocument(activeDocumentId, { dirty: true })
    snapshot()
  }

  function undo() {
    if (historyRef.current.length <= 1 || !layerStackRef.current || drawingRef.current) return
    selectionRef.current = null
    redoRef.current = limitLayerHistory([...redoRef.current, historyRef.current.pop()])
    restoreLayerHistory(historyRef.current[historyRef.current.length - 1])
    updateDocument(activeDocumentId, { dirty: true })
    refresh((number) => number + 1)
  }

  function redo() {
    if (!redoRef.current.length || !layerStackRef.current || drawingRef.current) return
    selectionRef.current = null
    const next = redoRef.current.pop()
    historyRef.current = limitLayerHistory([...historyRef.current, next])
    restoreLayerHistory(next)
    updateDocument(activeDocumentId, { dirty: true })
    refresh((number) => number + 1)
  }

  useLayoutEffect(() => { paintToolOverlay() }, [activeDocumentId, canvasRevision, workspaceStarted])
  useLayoutEffect(() => {
    const stack = layerStackRef.current
    const canvas = canvasRef.current
    if (stack && canvas && canvasDocumentRef.current === activeDocumentId && canvas.width === stack.width && canvas.height === stack.height) paintLayerPreview()
  }, [activeDocumentId, activeDocument?.width, activeDocument?.height])

  const canUndo = historyRef.current.length > 1
  const canRedo = redoRef.current.length > 0

  return (
    <div className="shadow-studio">
      <style>{`
        .shadow-studio{min-height:100vh;background:#202225;color:#eef0f3;font-family:inherit}
        .ss-chrome{height:34px;display:flex;align-items:center;gap:2px;border-bottom:1px solid #454a50;background:#34373b;padding:0 7px}
        .ss-logo-btn{height:28px;width:28px;display:grid;place-items:center;border:0;background:transparent;cursor:pointer}
        .ss-logo{display:block;width:16px;height:16px;object-fit:contain}
        .ss-chrome-right{display:flex;align-items:center;gap:6px;margin-left:auto;white-space:nowrap}.ss-chrome-right .ss-doc-info{margin-right:7px}.ss-chrome-right .ss-btn.icon{height:27px;width:29px}
        .ss-menu-btn{height:28px;border:0;background:transparent;color:#e6e7e9;padding:0 8px;font:inherit;font-size:11px;cursor:pointer}
        .ss-menu-btn:hover{background:#474b50}
        .ss-menu-btn:disabled{opacity:.45;cursor:default}
        .ss-hidden-file{display:none}
        .ss-project-message{margin:14px 0 0;border:1px solid #59636d;border-radius:8px;background:#303842;color:#d7e6f7;padding:11px 13px;font-size:11px;line-height:1.5}
        .ss-top{position:sticky;top:34px;z-index:30;height:48px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 10px;border-bottom:1px solid #41464c;background:#2c2f33}
        .ss-row{display:flex;align-items:center;gap:7px}
        .ss-doc-info{color:#c9cdd2;font-size:10px;font-weight:700}
        .ss-btn{height:32px;border:1px solid #50555b;border-radius:7px;background:#373b40;color:#f3f4f6;padding:0 10px;font:inherit;font-size:11px;font-weight:700;cursor:pointer}
        .ss-btn:hover{background:#42474d}
        .ss-btn.primary{border-color:#4b9df4;background:#4b9df4;color:#08131f}
        .ss-btn.icon{width:32px;padding:0;display:grid;place-items:center}
        .ss-btn:disabled{opacity:.35;cursor:default}
        .ss-layout{display:grid;grid-template-columns:86px minmax(0,1fr) 236px;height:calc(100dvh - 70px);min-height:320px}
        .ss-tools{border-right:1px solid #3b4046;background:#292c30;padding:10px 7px}
        .ss-tool{width:100%;min-height:62px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;border:1px solid transparent;border-radius:9px;background:transparent;color:#bbc1c8;font:inherit;cursor:pointer}
        .ss-tool i{font-size:17px}
        .ss-tool span{font-size:10px;font-weight:700}
        .ss-tool.active{border-color:#506273;background:#3b4e61;color:#fff}
        .ss-work{min-width:0;min-height:0;overflow:auto;padding:28px 28px 72px;background:#4a4e53;touch-action:pan-x pan-y;overscroll-behavior:contain}.ss-work.ss-panning,.ss-work.ss-panning *{cursor:grabbing!important}.ss-work.ss-hand,.ss-work.ss-hand *{cursor:grab!important}
        .ss-stage{width:max-content;min-width:100%;min-height:100%;display:grid;place-items:center}
        .ss-canvas-frame{position:relative;flex:none;overflow:visible}
        .ss-canvas{position:absolute;left:50%;top:50%;display:block;max-width:none;background-color:#fff;background-image:linear-gradient(45deg,#d9dfe6 25%,transparent 25%),linear-gradient(-45deg,#d9dfe6 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#d9dfe6 75%),linear-gradient(-45deg,transparent 75%,#d9dfe6 75%);background-size:20px 20px;background-position:0 0,0 10px,10px -10px,-10px 0;box-shadow:0 10px 32px rgba(0,0,0,.25);touch-action:none;cursor:${tool === 'eyedropper' ? 'copy' : ['brush', 'pencil', 'eraser', 'smudge', 'blur'].includes(tool) ? studioBrushCursor(size, zoom) : 'crosshair'}}
        .ss-view-buttons{display:flex;flex-wrap:wrap;gap:6px}
        .ss-view-btn{display:flex;align-items:center;justify-content:center;gap:5px;flex:1;min-width:44px;height:31px;border:1px solid #555b62;border-radius:6px;background:#353a40;color:#e7ecf1;font:inherit;font-size:11px;cursor:pointer}
        .ss-view-btn:hover,.ss-view-btn.active{border-color:#72b3f7;background:#355274}
        .ss-view-btn:disabled{opacity:.4;cursor:default}
        .ss-view-angle{margin:10px 0 0;color:#d1d7dd;font-size:11px}
        .ss-view-help{margin:9px 0 0;color:#9ea9b4;font-size:10px;line-height:1.5}
        .ss-side{border-left:1px solid #3b4046;background:#292c30;padding:16px}
        .ss-section+.ss-section{margin-top:20px;padding-top:18px;border-top:1px solid #3d4248}
        .ss-label{margin:0 0 10px;font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#c2c7cd}
        .ss-color{width:100%;height:42px;border:1px solid #50555b;border-radius:8px;background:#fff;padding:2px}
        .ss-swatches{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-top:9px}
        .ss-swatch{aspect-ratio:1;border:1px solid #596068;border-radius:6px;cursor:pointer}
        .ss-range{display:flex;align-items:center;gap:9px}
        .ss-range input{min-width:0;flex:1;accent-color:#73b9ff}
        .ss-value{width:44px;text-align:right;font-size:11px;font-weight:800;color:#c6ccd2}
        .ss-bottom{position:fixed;left:86px;right:236px;bottom:0;z-index:20;min-height:46px;display:flex;align-items:center;justify-content:center;border-top:1px solid #3b4046;background:rgba(42,45,49,.97);backdrop-filter:blur(8px);padding:7px 12px}
        .ss-controls{width:100%;display:flex;align-items:center;gap:12px;overflow-x:auto;scrollbar-width:thin}
        .ss-control{min-width:110px;flex:1;display:flex;align-items:center;gap:7px}
        .ss-control label{font-size:10px;font-weight:800;color:#c2c7cd}
        .ss-control input{min-width:60px;flex:1;accent-color:#73b9ff}.ss-zoom-control{flex:2;min-width:475px}.ss-zoom-btn{height:26px;min-width:25px;padding:0 5px;border:1px solid #50555b;border-radius:5px;background:#373b40;color:#eef0f3;font:inherit;font-size:11px;font-weight:700;cursor:pointer}.ss-zoom-btn:disabled{opacity:.4;cursor:default}.ss-zoom-label{min-width:34px}.ss-zoom-control .ss-value{width:36px}
        .ss-dialog-backdrop{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;background:rgba(0,0,0,.62);padding:18px}
        .ss-new-dialog{width:min(560px,100%);overflow:hidden;border:1px solid #555b62;border-radius:10px;background:#3a3d41;color:#fff;box-shadow:0 24px 70px rgba(0,0,0,.5)}
        .ss-dialog-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:17px 18px;border-bottom:1px solid #50555b}
        .ss-dialog-head h2{margin:0;font-size:16px}
        .ss-dialog-head p{margin:4px 0 0;color:#b4bac1;font-size:10px}
        .ss-dialog-x{width:28px;height:28px;border:0;border-radius:6px;background:transparent;color:#fff;cursor:pointer}
        .ss-dialog-x:hover{background:#4b5056}
        .ss-dialog-body{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:18px}
        .ss-field{display:grid;gap:6px}
        .ss-field-wide{grid-column:1/-1}
        .ss-field>span{font-size:10px;font-weight:800;color:#d4d7db}
        .ss-field input,.ss-field select{width:100%;height:36px;border:1px solid #61676e;border-radius:6px;background:#2f3236;color:#fff;padding:0 9px;outline:none;font:inherit;font-size:11px}
        .ss-field input:focus,.ss-field select:focus{border-color:#69aef4;box-shadow:0 0 0 2px rgba(105,174,244,.16)}
        .ss-field input:disabled{color:#9aa1a9}
        .ss-input-unit{display:grid;grid-template-columns:1fr 52px}
        .ss-input-unit input{border-radius:6px 0 0 6px}
        .ss-input-unit b{height:36px;display:grid;place-items:center;border:1px solid #61676e;border-left:0;border-radius:0 6px 6px 0;background:#44484d;color:#d8dbe0;font-size:9px}
        .ss-background-row{display:grid;grid-template-columns:1fr 42px 42px;gap:8px}
        .ss-background-row input[type=color]{padding:3px}
        .ss-background-preview{display:block;border:1px solid #6a7077;border-radius:6px}
        .ss-dialog-info{display:flex;flex-wrap:wrap;gap:8px 16px;border-radius:7px;background:#2f3236;padding:10px;color:#aeb5bd;font-size:9px}
        .ss-dialog-error{border-radius:7px;background:#552f32;color:#ffc2c7;padding:10px;font-size:10px;font-weight:700}
        .ss-dialog-actions{display:flex;justify-content:flex-end;gap:8px;padding:14px 18px;border-top:1px solid #50555b}
        @media (max-width:900px), (max-width:1100px) and (max-height:650px) and (orientation:landscape){
          .shadow-studio .ss-chrome-right{display:flex;align-items:center;gap:4px;margin-left:auto}
          .shadow-studio .ss-chrome-right .ss-doc-info{display:none}
          .shadow-studio .ss-chrome-right .ss-btn.icon{flex:0 0 29px;width:29px;height:29px;min-height:29px}
          .shadow-studio .ss-file-trigger{font-weight:800}
        }
        @media(max-width:900px){.ss-layout{grid-template-columns:72px minmax(0,1fr)}.ss-side{display:none}.ss-bottom{left:72px;right:0}.ss-work{padding:18px 18px 68px}}
        @media(max-width:640px){.ss-home{grid-template-columns:1fr}.ss-home-side{border-right:0;border-bottom:1px solid #35393e}.ss-home-main{padding:26px 16px}.ss-top{top:34px;padding:0 8px}.ss-layout{display:block}.ss-tab{min-width:104px}.ss-tab-count{display:none}.ss-tools{position:sticky;top:118px;z-index:25;display:flex;gap:6px;overflow-x:auto;border-right:0;border-bottom:1px solid #3b4046;padding:7px}.ss-tool{width:72px;min-width:72px;min-height:50px}.ss-work{padding:12px 12px 66px}.ss-bottom{left:0}.ss-controls{gap:8px}.ss-control label{display:none}.ss-dialog-body{grid-template-columns:1fr}.ss-field-wide{grid-column:auto}}
      `}</style>

      <StudioChrome onBack={exitStudio} backLabel={tx('shadowStudio.back')}>
        <nav className="ss-header-menus" aria-label="Studio menus">
        <StudioFileMenu
          hasPaper={documents.length > 0}
          inWorkspace={workspaceStarted}
          canNew={!paperLoading && !projectBusy && !recoveryBooting && !recoveryEntry && !recoveryBusy && !newFileOpen && documents.length < DOCUMENT_LIMIT}
          canOpen={!projectBusy && !recoveryBooting && !recoveryEntry && !recoveryBusy && !newFileOpen}
          busy={paperLoading || projectBusy || recoveryBusy || newFileOpen}
          onNew={() => openNewFile('basic')}
          onOpen={chooseProjectFile}
          canImport={!paperLoading && !projectBusy && !recoveryBooting && !recoveryEntry && !recoveryBusy && !newFileOpen && !exportOpen && documents.length < DOCUMENT_LIMIT}
          onImport={chooseImageFile}
          onSave={() => saveProject()}
          onSaveAs={saveProjectAs}
          onExport={openExportDialog}
          onClose={() => closeDocument(activeDocumentId)}
          onCloseAll={closeAllPapers}
          onHome={goHome}
          onExit={exitStudio}
        />
        <StudioEditMenu
          enabled={workspaceStarted && !paperLoading && !projectBusy && !recoveryBooting && !recoveryEntry && !recoveryBusy && !newFileOpen}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          onClear={() => clearCanvas()}
                />
        {STUDIO_HEADER_PLACEHOLDER_MENUS.map((label) => (
  <button key={label} type="button" className="ss-menu-btn" disabled>
    {label}
  </button>
))}
        <StudioViewMenu
          enabled={workspaceStarted && !paperLoading && !projectBusy && !newFileOpen}
          zoom={zoom}
          gridVisible={showGrid}
          gridSpacing={gridSpacing}
          rotation={viewRotation}
          flippedHorizontal={flipHorizontal}
          flippedVertical={flipVertical}
          onToggleGrid={() => setShowGrid((current) => !current)}
          onGridSpacing={(spacing) => { setGridSpacing(spacing); setShowGrid(true) }}
          onZoom={zoomAround}
          onFit={fitCanvas}
          onRotate={(degrees) => updateCanvasView(viewRotation + degrees)}
          onFlipHorizontal={() => updateCanvasView(viewRotation, !flipHorizontal, flipVertical)}
          onFlipVertical={() => updateCanvasView(viewRotation, flipHorizontal, !flipVertical)}
          onResetOrientation={() => updateCanvasView(0, false, false)}
        />

        {workspaceStarted ? (
          <button type="button" className="ss-menu-btn" aria-label={mangaToolsLabel}
            disabled={paperLoading || projectBusy || recoveryBooting || recoveryBusy || Boolean(recoveryEntry) || newFileOpen || exportOpen}
            onClick={() => { setMangaToolInitial('bubble'); setMangaToolsOpen(true) }}>{mangaToolsLabel}</button>
        ) : null}
        {['Window', 'Help'].map((label) => (
  <button key={label} type="button" className="ss-menu-btn" disabled>
    {label}
  </button>
))}
        </nav>
        {workspaceStarted ? (
  <StudioHeaderWorkspace
    documents={documents}
    activeDocumentId={activeDocumentId}
    canUndo={canUndo}
    canRedo={canRedo}
    busy={paperLoading || projectBusy || recoveryBusy || newFileOpen || exportOpen}
    onSwitchPaper={switchDocument}
    onUndo={undo}
    onRedo={redo}
    onSave={() => saveProject()}
    onExport={openExportDialog}
    onPlaceImage={() => placeImageInputRef.current?.click()}
    onNewPaper={() => openNewFile('basic')}
    onFit={fitCanvas}
    onToggleGrid={() => setShowGrid((value) => !value)}
    onHome={goHome}
  />
) : null}
      </StudioChrome>

      {!workspaceStarted ? (
        <StudioHome
          documents={documents}
          documentLimit={DOCUMENT_LIMIT}
          recoveryBooting={recoveryBooting}
          recoveryEntry={recoveryEntry}
          recoveryBusy={recoveryBusy}
          projectBusy={projectBusy}
          paperLoading={paperLoading}
          newFileOpen={newFileOpen}
          exportOpen={exportOpen}
          projectNotice={projectNotice}
          recoveryStatus={recoveryStatus}
          onNewFile={openNewFile}
          onOpenProject={chooseProjectFile}
          onImportImage={chooseImageFile}
          onResume={resumeWorkspace}
          onExit={exitStudio}
          onRecover={recoverWorkspace}
          onDiscardRecovery={discardRecovery}
          labels={{
            newPaper: tx('shadowStudio.newPaper'),
            back: tx('shadowStudio.back'),
            welcomeTitle: tx('shadowStudio.welcomeTitle'),
            welcomeText: tx('shadowStudio.welcomeText'),
          }}
        />
      ) : (
        <>
          {projectNotice ? <div className="ss-project-message" role="status">{projectNotice}</div> : null}
              {recoveryStatus ? <div className="ss-project-message" role="status">{recoveryStatus}</div> : null}
          <StudioOptionsBar
  tool={tool} paper={activeDocument} size={size} opacity={opacity}
  showGrid={showGrid} busy={paperLoading || projectBusy || recoveryBusy || newFileOpen}
  canUndo={canUndo} canRedo={canRedo} onSizeChange={updateBrushSize} onOpacityChange={setOpacity}
  onToggleGrid={() => setShowGrid((value) => !value)} onUndo={undo} onRedo={redo}
  onFit={fitCanvas} onNew={() => openNewFile('basic')}
  onSave={() => saveProject()} onExport={openExportDialog}
/>

          <StudioPaperTabs
            documents={documents}
            activeDocumentId={activeDocumentId}
            limit={DOCUMENT_LIMIT}
            disabled={paperLoading || projectBusy || recoveryBusy}
            onSwitch={switchDocument}
            onClose={closeDocument}
            onNew={() => openNewFile('basic')}
            onRename={renameDocument}
            labels={{ close: tx('shadowStudio.closePaper'), new: tx('shadowStudio.newPaper') }}
          />

          <main className="ss-layout">
            <StudioToolRail
              tool={tool}
              onToolChange={selectTool}
              labels={{ brush: tx('shadowStudio.brush'), eraser: tx('shadowStudio.eraser'), eyedropper: tx('shadowStudio.eyedropper') }}
            />

            <section ref={workRef} className={`ss-work ${panRef.current ? 'ss-panning' : handMode ? 'ss-hand' : ''}`} onDragOver={(event) => event.preventDefault()} onDrop={dropImageOnPaper} onPointerDownCapture={panStart} onPointerMove={panMove} onPointerUp={panEnd} onPointerCancel={panEnd}>
              <StudioCanvasRulers
  workRef={workRef}
  canvasRef={canvasRef}
  paperId={activeDocumentId}
  zoom={zoom}
  rotation={viewRotation}
/>
              <div className="ss-stage">
                <div className="ss-canvas-frame" style={{ width: viewFrameWidth, height: viewFrameHeight }}>
                  <canvas
                    ref={canvasRef}
                    className="ss-canvas"
                    width={activeDocument?.width || W}
                    height={activeDocument?.height || H}
                    style={{
                      width: displayedWidth,
                      height: displayedHeight,
                      transform: `translate(-50%, -50%) rotate(${viewRotation}deg) scale(${flipHorizontal ? -1 : 1}, ${flipVertical ? -1 : 1})`,
                    }}
                    aria-label={tx('shadowStudio.canvas')}
                    onPointerDown={start}
                    onPointerMove={draw}
                    onPointerUp={finish}
                    onPointerCancel={finish}
                  />
                  <canvas
                    ref={toolOverlayRef}
                    className="ss-canvas"
                    width={activeDocument?.width || W}
                    height={activeDocument?.height || H}
                    aria-hidden="true"
                    style={{
                      width: displayedWidth, height: displayedHeight, pointerEvents: 'none', zIndex: 4,
                      background: 'transparent', backgroundImage: 'none', boxShadow: 'none',
                      transform: `translate(-50%, -50%) rotate(${viewRotation}deg) scale(${flipHorizontal ? -1 : 1}, ${flipVertical ? -1 : 1})`,
                    }}
                  />
                  {showGrid && gridSpacing * zoom / 100 >= 8 ? (
                    <div
                      className="ss-view-grid"
                      aria-hidden="true"
                      style={{
                        width: displayedWidth,
                        height: displayedHeight,
                        backgroundSize: `${gridSpacing * zoom / 100}px ${gridSpacing * zoom / 100}px`,
                        transform: `translate(-50%, -50%) rotate(${viewRotation}deg) scale(${flipHorizontal ? -1 : 1}, ${flipVertical ? -1 : 1})`,
                      }}
                    />
                  ) : null}
                </div>
              </div>
            </section>

            <StudioControlSidebar
              canvasRef={canvasRef}
              paperId={activeDocumentId}
              revision={canvasRevision}
              paper={activeDocument}
              layers={canvasDocumentRef.current === activeDocumentId ? layerStackRef.current?.layers || [] : []}
              activeLayerId={canvasDocumentRef.current === activeDocumentId ? layerStackRef.current?.activeLayerId || '' : ''}
              groups={canvasDocumentRef.current === activeDocumentId ? layerStackRef.current?.groups || [] : []}
              onLayerAction={changeLayer}
              onFeatureApply={applyRightFeature}
              color={color}
              onColorChange={(nextColor) => { setColor(nextColor); setTool('brush') }}
              brushStyle={brushStyle}
              onBrushStyleChange={(nextStyle) => { setBrushStyle(nextStyle); setTool('brush') }}
              size={size}
              onSizeChange={updateBrushSize}
              opacity={opacity}
              onOpacityChange={setOpacity}
              viewRotation={viewRotation}
              flipHorizontal={flipHorizontal}
              flipVertical={flipVertical}
              onViewChange={updateCanvasView}
              paperLoading={paperLoading}
              projectBusy={projectBusy}
              onClear={() => clearCanvas()}
              onPlaceAsset={async (file) => { if (!await placeImageOnCurrentPaper(file)) throw new Error('Could not add the image to the selected layer.') }}
              navigator={<StudioNavigator canvasRef={canvasRef} workRef={workRef} paperId={activeDocumentId} revision={canvasRevision} rotation={viewRotation} flipHorizontal={flipHorizontal} flipVertical={flipVertical} zoom={zoom} disabled={paperLoading || projectBusy} />}
              labels={{ color: tx('shadowStudio.color'), size: tx('shadowStudio.size'), opacity: tx('shadowStudio.opacity'), clear: tx('shadowStudio.clear') }}
            />
          </main>

          <StudioControlFooter
            paper={activeDocument}
            paperIndex={documents.findIndex((item) => item.id === activeDocumentId) + 1}
            paperCount={documents.length}
            size={size}
            onSizeChange={updateBrushSize}
            opacity={opacity}
            onOpacityChange={setOpacity}
            zoom={zoom}
            onZoom={zoomAround}
            onFit={fitCanvas}
            viewRotation={viewRotation}
            flipHorizontal={flipHorizontal}
            flipVertical={flipVertical}
            onViewChange={updateCanvasView}
            labels={{ size: tx('shadowStudio.size'), opacity: tx('shadowStudio.opacity'), zoom: tx('shadowStudio.zoom') }}
          />
        </>
      )}

      <input
        ref={openProjectInputRef}
        className="ss-hidden-file"
        type="file"
        accept=".shadowstudio"
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ''
          if (file) openProject(file)
        }}
      />

      <input
        ref={importImageInputRef}
        className="ss-hidden-file"
        type="file"
        accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
        aria-label={tx('shadowStudio.importImageLabel')}
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ''
          if (file) importImageAsPaper(file)
        }}
      />

      <input
  ref={placeImageInputRef}
  className="ss-hidden-file"
  type="file"
  accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
  aria-label={placeImageLabel}
  onChange={(event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (file) placeImageOnCurrentPaper(file)
  }}
/>

      <StudioAdvancedToolPanel
        editor={advancedEditor && workspaceStarted ? advancedEditor : null}
        onClose={() => setAdvancedEditor(null)}
        onApply={finishAdvancedTool}
        onClearGuides={() => { guidesRef.current = []; paintToolOverlay() }}
      />

      <StudioMangaToolSettingsPage
        open={mangaToolsOpen && workspaceStarted}
        initialTool={mangaToolInitial}
        onClose={() => setMangaToolsOpen(false)}
        onApply={applyRightFeature}
        color={color}
        disabled={!activeDocumentId || canvasDocumentRef.current !== activeDocumentId || paperLoading || projectBusy || recoveryBooting || recoveryBusy || Boolean(recoveryEntry) || newFileOpen || exportOpen || !studioLayerCanEdit(layerStackRef.current)}
      />

     <StudioTextEditor
  key={textEditor ? `${textEditor.paperId}:${textEditor.editingLayerId || 'new'}:${textEditor.x}:${textEditor.y}` : 'closed'}
  open={Boolean(textEditor) && workspaceStarted}
  color={color}
  initialData={textEditor?.initialData}
  onCancel={() => setTextEditor(null)}
  onApply={(settings) => {
    const stack = layerStackRef.current
    if (!textEditor || textEditor.paperId !== activeDocumentId ||
        paperLoading || projectBusy || drawingRef.current ||
        canvasDocumentRef.current !== activeDocumentId || !stack) return false
    const previouslySelected = stack.activeLayerId
    const previousLayer = stack.layers.find((layer) => layer.id === previouslySelected)
    const group = stack.groups?.find((item) => item.id === previousLayer?.groupId)
    if (previousLayer?.groupId && (!group || !group.visible || group.locked)) {
      setProjectNotice('Unlock and show the selected group before editing text.')
      return false
    }
    let textLayer = null
    try {
      const data = normalizeStudioTextData({ ...settings, anchor: { x: textEditor.x, y: textEditor.y } }, stack.width, stack.height)
      const title = data.text.trim().replace(/\s+/g, ' ').slice(0, 65)
      if (textEditor.editingLayerId) {
        textLayer = stack.layers.find((layer) => layer.id === textEditor.editingLayerId)
        if (!textLayer?.textData || !studioLayerCanEdit(stack, textLayer.id)) throw new Error('Unlock and show the text layer before editing it.')
        const replacement = document.createElement('canvas')
        replacement.width = stack.width
        replacement.height = stack.height
        const context = replacement.getContext('2d', { willReadFrequently: true })
        if (!context || !drawStudioText(context, data.anchor, data)) throw new Error('Could not redraw the text layer.')
        textLayer.canvas = replacement
        textLayer.textData = data
        textLayer.name = `Text · ${title}`.slice(0, 80)
      } else {
        textLayer = addStudioLayer(stack, `Text · ${title}`.slice(0, 80))
        if (previousLayer?.groupId) textLayer.groupId = previousLayer.groupId
        const context = textLayer.canvas.getContext('2d', { willReadFrequently: true })
        if (!context || !drawStudioText(context, data.anchor, data)) throw new Error('Could not draw text on the new layer.')
        textLayer.textData = data
        validateStudioGroupLayout(stack)
      }
      paintLayerPreview()
      snapshot()
      updateDocument(activeDocumentId, { dirty: true })
      setProjectNotice(textEditor.editingLayerId ? 'Text layer updated.' : 'Text layer added. Double-click its name in Layers to edit it again.')
      setTextEditor(null)
      return true
    } catch (error) {
      if (textLayer && !textEditor.editingLayerId) {
        stack.layers = stack.layers.filter((layer) => layer !== textLayer)
        stack.activeLayerId = previouslySelected
        paintLayerPreview()
      }
      setProjectNotice(error.message || 'Could not save text.')
      return false
    }
  }}
/>

      <StudioShapeEditor
  key={shapeEditor ? `${shapeEditor.paperId}:${shapeEditor.x}:${shapeEditor.y}` : 'closed'}
  open={Boolean(shapeEditor) && workspaceStarted}
  color={color}
  onCancel={() => setShapeEditor(null)}
  onApply={(settings) => {
    if (shapeEditor?.paperId === activeDocumentId &&
        !paperLoading && !projectBusy &&
        canvasDocumentRef.current === activeDocumentId &&
        drawStudioShape(drawingContext(), shapeEditor, settings)) {
      delete layerStackRef.current?.layers.find((layer) => layer.id === layerStackRef.current.activeLayerId)?.textData
      paintLayerPreview()
      snapshot()
      updateDocument(activeDocumentId, { dirty: true })
    }
    setShapeEditor(null)
  }}
/>

<StudioExportDialog
  open={exportOpen && workspaceStarted && !paperLoading}
        paper={activeDocument}
        canvasRef={canvasRef}
        onClose={() => setExportOpen(false)}
        onExported={(message) => { setProjectNotice(message); setExportOpen(false) }}
      />

      <StudioNewFileDialog
        open={newFileOpen}
        defaultName={nextDocumentName(documentsRef.current)}
        initialPreset={newFilePreset}
        onClose={() => setNewFileOpen(false)}
        onCreate={createPaper}
      />
    </div>
  )
}
