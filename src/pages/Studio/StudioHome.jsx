import { useEffect, useRef, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('studioHome', {
  en: {
    openProject: 'Open Project',
    importImage: 'Import Image as Paper',
    resume: 'Continue Workspace',
    checking: 'Checking for locally autosaved work...',
    localRecovery: 'Local recovery',
    recoverHeading: 'Recover your last workspace',
    recoveryDescription: '{{count}} paper(s) · Autosaved {{time}}. Restore them before creating or opening another project.',
    restoring: 'Restoring...',
    restore: 'Restore Workspace',
    discard: 'Discard Recovery',
    projectFiles: 'Project files',
    projectInfo: 'Save Project downloads a .shadowstudio file to your device. Open Project reopens it later. Local autosave is only a temporary browser recovery copy.',
    myWorks: 'My Works',
    openManage: 'Open & Manage',
    newCanvas: 'New Canvas',
    startDrawing: 'Start Drawing',
    recentProjects: 'Recent Projects',
    seeAll: 'See All',
    importFile: 'Import File',
    projectFormat: 'PSD, PNG, JPG',
    openDevice: 'Open from Device',
    photosFiles: 'Photos, Files',
    localOnly: 'Local only',
    noOnline: 'No Online Gallery',
    settings: 'Settings',
    help: 'Help',
    appearance: 'Appearance',
    dark: 'Dark',
    light: 'Light',
    localMessage: 'Shadow Studio keeps this workspace local. Project files stay on your device unless you choose to share them.',
    noRecent: 'No recent local work yet. Create a canvas or open a project.',
  },
  km: {
    openProject: 'បើកគម្រោង',
    importImage: 'នាំចូលរូបភាពជាក្រដាស',
    resume: 'បន្តការងារ',
    checking: 'កំពុងពិនិត្យការងារដែលបានរក្សាទុកស្វ័យប្រវត្តិ...',
    localRecovery: 'ការស្ដារទិន្នន័យក្នុងឧបករណ៍',
    recoverHeading: 'ស្ដារការងារចុងក្រោយ',
    recoveryDescription: 'មានក្រដាស {{count}} · បានរក្សាទុកស្វ័យប្រវត្តិនៅ {{time}}។ សូមស្ដារវាមុនបង្កើត ឬបើកគម្រោងផ្សេង។',
    restoring: 'កំពុងស្ដារ...',
    restore: 'ស្ដារការងារ',
    discard: 'បោះបង់ទិន្នន័យស្ដារ',
    projectFiles: 'ឯកសារគម្រោង',
    projectInfo: 'Save Project ទាញយកឯកសារ .shadowstudio ទៅឧបករណ៍របស់អ្នក។ អាចប្រើ Open Project ដើម្បីបើកវាម្ដងទៀត។ ការរក្សាទុកស្វ័យប្រវត្តិក្នុង Browser គឺសម្រាប់ស្ដារជាបណ្ដោះអាសន្នប៉ុណ្ណោះ។',
    myWorks: 'ការងាររបស់ខ្ញុំ',
    openManage: 'បើក និងគ្រប់គ្រង',
    newCanvas: 'Canvas ថ្មី',
    startDrawing: 'ចាប់ផ្ដើមគូរ',
    recentProjects: 'ការងារថ្មីៗ',
    seeAll: 'មើលទាំងអស់',
    importFile: 'នាំចូល Project',
    projectFormat: 'PSD, PNG, JPG',
    openDevice: 'បើកពីឧបករណ៍',
    photosFiles: 'Photos, Files',
    localOnly: 'Local only',
    noOnline: 'គ្មាន Online Gallery',
    settings: 'ការកំណត់',
    help: 'ជំនួយ',
    appearance: 'រូបរាង',
    dark: 'ខ្មៅ',
    light: 'ស',
    localMessage: 'Shadow Studio រក្សាការងារនៅលើឧបករណ៍នេះ។ Project file មិនត្រូវបានបង្ហោះ Online ទេ លុះត្រាតែអ្នកជ្រើសចែករំលែកដោយខ្លួនឯង។',
    noRecent: 'មិនទាន់មានការងារ Local ថ្មីៗទេ។ បង្កើត Canvas ថ្មី ឬបើក Project មួយ។',
  },
  zh: {
    openProject: '打开项目',
    importImage: '将图像导入为画布',
    resume: '继续编辑',
    checking: '正在检查本地自动保存的作品...',
    localRecovery: '本地恢复',
    recoverHeading: '恢复上次的工作区',
    recoveryDescription: '{{count}} 个画布 · 于 {{time}} 自动保存。请先恢复，再创建或打开其他项目。',
    restoring: '恢复中...',
    restore: '恢复工作区',
    discard: '丢弃恢复数据',
    projectFiles: '项目文件',
    projectInfo: 'Save Project 会将 .shadowstudio 文件下载到设备。以后可用 Open Project 重新打开。本地自动保存仅用于浏览器中的临时恢复。',
    myWorks: '我的作品',
    openManage: '打开与管理',
    newCanvas: '新建画布',
    startDrawing: '开始绘画',
    recentProjects: '最近项目',
    seeAll: '查看全部',
    importFile: '导入项目',
    projectFormat: 'PSD, PNG, JPG',
    openDevice: '从设备打开',
    photosFiles: 'Photos, Files',
    localOnly: 'Local only',
    noOnline: '无在线画廊',
    settings: '设置',
    help: '帮助',
    appearance: '外观',
    dark: '深色',
    light: '浅色',
    localMessage: 'Shadow Studio 将工作保存在本地设备。除非您主动分享，否则项目不会上传到在线服务。',
    noRecent: '暂无最近的本地作品。新建画布或打开一个项目。',
  },
  ja: {
    openProject: 'プロジェクトを開く',
    importImage: '画像をキャンバスとして読み込む',
    resume: '作業を続ける',
    checking: 'ローカルの自動保存データを確認中...',
    localRecovery: 'ローカル復元',
    recoverHeading: '前回の作業を復元',
    recoveryDescription: 'キャンバス {{count}} 件 · {{time}} に自動保存。ほかのプロジェクトを作成または開く前に復元してください。',
    restoring: '復元中...',
    restore: '作業を復元',
    discard: '復元データを破棄',
    projectFiles: 'プロジェクトファイル',
    projectInfo: 'Save Project で .shadowstudio ファイルをデバイスにダウンロードできます。あとで Open Project から開けます。ローカル自動保存はブラウザでの一時的な復元用です。',
    myWorks: 'マイ作品',
    openManage: '開く・管理',
    newCanvas: '新規キャンバス',
    startDrawing: '描画を開始',
    recentProjects: '最近のプロジェクト',
    seeAll: 'すべて表示',
    importFile: 'プロジェクトを読み込む',
    projectFormat: 'PSD, PNG, JPG',
    openDevice: 'デバイスから開く',
    photosFiles: 'Photos, Files',
    localOnly: 'Local only',
    noOnline: 'オンラインギャラリーなし',
    settings: '設定',
    help: 'ヘルプ',
    appearance: '外観',
    dark: 'ダーク',
    light: 'ライト',
    localMessage: 'Shadow Studio は作業をこのデバイスに保存します。自分で共有しない限り、プロジェクトがオンラインへアップロードされることはありません。',
    noRecent: '最近のローカル作品はまだありません。新規キャンバスを作成するか、プロジェクトを開いてください。',
  },
  ko: {
    openProject: '프로젝트 열기',
    importImage: '이미지를 캔버스로 가져오기',
    resume: '작업 계속하기',
    checking: '로컬 자동 저장 작업 확인 중...',
    localRecovery: '로컬 복구',
    recoverHeading: '마지막 작업 공간 복구',
    recoveryDescription: '캔버스 {{count}}개 · {{time}}에 자동 저장됨. 다른 프로젝트를 만들거나 열기 전에 복구하세요.',
    restoring: '복구 중...',
    restore: '작업 공간 복구',
    discard: '복구 데이터 삭제',
    projectFiles: '프로젝트 파일',
    projectInfo: 'Save Project는 .shadowstudio 파일을 기기에 다운로드합니다. 나중에 Open Project로 다시 열 수 있습니다. 로컬 자동 저장은 브라우저의 임시 복구용입니다.',
    myWorks: '내 작업',
    openManage: '열기 및 관리',
    newCanvas: '새 캔버스',
    startDrawing: '그리기 시작',
    recentProjects: '최근 프로젝트',
    seeAll: '모두 보기',
    importFile: '프로젝트 가져오기',
    projectFormat: 'PSD, PNG, JPG',
    openDevice: '기기에서 열기',
    photosFiles: 'Photos, Files',
    localOnly: 'Local only',
    noOnline: '온라인 갤러리 없음',
    settings: '설정',
    help: '도움말',
    appearance: '화면 모드',
    dark: '다크',
    light: '라이트',
    localMessage: 'Shadow Studio는 작업을 이 기기에 로컬로 보관합니다. 직접 공유하지 않는 한 프로젝트가 온라인에 업로드되지 않습니다.',
    noRecent: '최근 로컬 작업이 없습니다. 새 캔버스를 만들거나 프로젝트를 여세요.',
  },
})

const THEME_KEY = 'shadow-studio-home-theme-v1'
const HERO_DESKTOP_IMAGE = '/assets/Shadow Stodio/Pic1.webp'
const HERO_MOBILE_IMAGE = '/assets/Shadow Stodio/Pic2.webp'
const STUDIO_LOGO = '/assets/Shadow Stodio/Shadow Stodio Logo.png.svg'

const HERO_DESKTOP = {
  scale: 1,
  x: 0,
  y: 0,
  brightness: 110,
  opacity: 100,
  shade: 32,
  gradientStart: 48,
  gradientMid: 18,
  gradientEnd: 68,
}

const HERO_MOBILE = {
  scale: 2,
  x: 0,
  y: 0,
  brightness: 88,
  opacity: 100,
  shade: 48,
  gradientStart: 52,
  gradientMid: 22,
  gradientEnd: 100,
}

const LOGO_DESKTOP = {
  scale: 1,
  x: 24,
  y: 0,
}

const LOGO_MOBILE = {
  scale: 1,
  x: 24,
  y: 0,
}

function initialTheme() {
  try {
    return window.localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export default function StudioHome({
  documents,
  documentLimit,
  recoveryBooting,
  recoveryEntry,
  recoveryBusy,
  projectBusy,
  paperLoading,
  newFileOpen,
  exportOpen,
  projectNotice,
  recoveryStatus,
  onNewFile,
  onOpenProject,
  onImportImage,
  onResume,
  onExit,
  onRecover,
  onDiscardRecovery,
  labels,
}) {
  const { t: tx } = useDisplayTranslation()
  const [theme, setTheme] = useState(initialTheme)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [recoveryPreviewUrls, setRecoveryPreviewUrls] = useState({})
  const [recoveryToast, setRecoveryToast] = useState('')
  const settingsRef = useRef(null)
  const recoveryPending = recoveryBooting || Boolean(recoveryEntry) || recoveryBusy
  const busy = projectBusy || paperLoading || newFileOpen || exportOpen
  const canOpen = !recoveryPending && !busy
  const canNew = canOpen && documents.length < documentLimit
  const canImport = canNew
  const canResume = canOpen && documents.length > 0
  const recoveredDocuments = Array.isArray(recoveryEntry?.documents) ? recoveryEntry.documents : []
  const recentDocuments = documents.length ? documents : recoveredDocuments
  const recentFromRecovery = !documents.length && recoveredDocuments.length > 0

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_KEY, theme)
    } catch {}
  }, [theme])

  useEffect(() => {
    if (!settingsOpen) return undefined
    const close = (event) => {
      if (!settingsRef.current?.contains(event.target)) setSettingsOpen(false)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [settingsOpen])

  useEffect(() => {
    const urls = []
    const next = {}
    const papers = Array.isArray(recoveryEntry?.documents) ? recoveryEntry.documents : []

    papers.forEach((paper) => {
      if (paper?.image instanceof Blob) {
        const url = URL.createObjectURL(paper.image)
        urls.push(url)
        next[paper.id] = url
      }
    })

    setRecoveryPreviewUrls(next)
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [recoveryEntry])

  useEffect(() => {
    if (!recoveryStatus) return undefined
    setRecoveryToast(recoveryStatus)
    const timer = window.setTimeout(() => setRecoveryToast(''), 1800)
    return () => window.clearTimeout(timer)
  }, [recoveryStatus])

  function recentPreview(document) {
    if (typeof document?.image === 'string') return document.image
    return recoveryPreviewUrls[document?.id] || ''
  }

  function openMyWorks() {
    if (!canOpen) return
    if (canResume) onResume()
    else onOpenProject()
  }

  function openRecent() {
    if (recentFromRecovery && recoveryEntry && !recoveryBusy) {
      onRecover()
      return
    }
    openMyWorks()
  }

  return (
    <>
      <style>{`
        .ss-home{
          --ss-home-bg:#090c0f;
          --ss-home-panel:#11161b;
          --ss-home-panel-2:#151b21;
          --ss-home-line:#252d35;
          --ss-home-text:#f6f7f8;
          --ss-home-muted:#8e98a3;
          --ss-home-yellow:#f4bd28;
          --ss-home-yellow-2:#ffd149;
          --ss-home-shadow:rgba(0,0,0,.58);
          position:relative;
          min-height:100dvh;
          overflow-x:hidden;
          background:var(--ss-home-bg);
          color:var(--ss-home-text);
          font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          color-scheme:dark
        }
        .shadow-studio:has(.ss-home)>.ss-chrome{display:none}
        .ss-home[data-theme=light]{
          --ss-home-bg:#f4f5f6;
          --ss-home-panel:#fff;
          --ss-home-panel-2:#f8f9fa;
          --ss-home-line:#d9dde1;
          --ss-home-text:#15191d;
          --ss-home-muted:#6f7780;
          --ss-home-shadow:rgba(35,40,45,.14);
          color-scheme:light
        }
        .ss-home *{box-sizing:border-box}
        .ss-home-shell{
          width:min(1600px,100%);
          min-height:inherit;
          margin:0 auto;
          padding:0 clamp(18px,3.2vw,54px) 30px
        }
        .ss-home-hero{
          position:relative;
          min-height:410px;
          display:grid;
          grid-template-columns:minmax(360px,.92fr) minmax(430px,1.08fr);
          align-items:center;
          overflow:hidden
        }
        .ss-home-hero-art{
          position:absolute;
          inset:0;
          width:100%;
          height:100%;
          object-position:center center;
          transform-origin:center center;
          will-change:transform,filter,opacity
        }
        .ss-home-hero-desktop{display:block}
        .ss-home-hero-mobile{display:none}
        .ss-home-hero-desktop.ss-home-hero-art-back{
          object-fit:cover;
          transform:scale(1.06);
          opacity:.42;
          filter:brightness(var(--hero-desktop-brightness)) saturate(.82) blur(10px)
        }
        .ss-home-hero-desktop.ss-home-hero-art-main{
          object-fit:cover;
          transform:translate(var(--hero-desktop-x),var(--hero-desktop-y)) scale(var(--hero-desktop-scale));
          opacity:var(--hero-desktop-opacity);
          filter:brightness(var(--hero-desktop-brightness)) saturate(.92) contrast(1.02)
        }
        .ss-home-hero-shade{
          position:absolute;
          inset:0;
          z-index:2;
          pointer-events:none;
          background:linear-gradient(
            to bottom,
            transparent 0%,
            transparent var(--hero-desktop-gradient-start),
            rgb(0 0 0 / var(--hero-desktop-gradient-mid)) 78%,
            rgb(0 0 0 / var(--hero-desktop-gradient-end)) 100%
          )
        }
        .ss-home-back{
          position:absolute;
          z-index:6;
          top:22px;
          left:4px;
          width:43px;
          height:43px;
          display:grid;
          place-items:center;
          border:1px solid transparent;
          border-radius:50%;
          background:rgba(13,17,21,.3);
          color:#f4f6f8;
          cursor:pointer;
          backdrop-filter:blur(8px);
          transition:background 140ms ease,border-color 140ms ease,transform 140ms ease
        }
        .ss-home-back:hover{
          border-color:#58636e;
          background:rgba(39,45,51,.72);
          transform:translateX(-1px)
        }
        .ss-home-back:focus-visible{
          outline:2px solid var(--ss-home-yellow);
          outline-offset:3px
        }
        .ss-home[data-theme=light] .ss-home-back{
          background:rgba(255,255,255,.66);
          color:#20262c
        }
        .ss-home-top-actions{
          position:absolute;
          z-index:5;
          top:22px;
          right:4px;
          display:flex;
          align-items:center;
          gap:10px
        }
        .ss-home-icon-btn{
          width:43px;
          height:43px;
          display:grid;
          place-items:center;
          border:1px solid #48515b;
          border-radius:50%;
          background:rgba(13,17,21,.54);
          color:#f4f6f8;
          cursor:pointer;
          backdrop-filter:blur(10px)
        }
        .ss-home[data-theme=light] .ss-home-icon-btn{
          background:rgba(255,255,255,.72);
          color:#20262c;
          border-color:#cfd5da
        }
        .ss-home-icon-btn:focus-visible,
        .ss-home-action:focus-visible,
        .ss-home-bottom-card:focus-visible,
        .ss-recent-see:focus-visible,
        .ss-home-settings button:focus-visible{
          outline:2px solid var(--ss-home-yellow);
          outline-offset:3px
        }
        .ss-home-icon-btn:disabled{opacity:.42;cursor:default}
        .ss-home-icon-btn i{font-size:17px}
        .ss-home-brand{
          position:relative;
          z-index:3;
          align-self:center;
          max-width:470px;
          padding:34px 0 48px;
          transform:translate(var(--logo-desktop-x),var(--logo-desktop-y)) scale(var(--logo-desktop-scale));
          transform-origin:left center
        }
        .ss-home-logo{
          display:block;
          width:min(390px,88%);
          max-height:150px;
          object-fit:contain;
          object-position:left center
        }
        .ss-home-quick{
          position:absolute;
          z-index:4;
          left:50%;
          bottom:62px;
          width:max-content;
          max-width:calc(100% - 40px);
          display:flex;
          align-items:flex-start;
          justify-content:center;
          gap:58px;
          margin:0;
          padding:0;
          transform:translateX(-50%)
        }
        .ss-home-action{
          width:142px;
          border:0;
          background:transparent;
          color:var(--ss-home-text);
          text-align:center;
          cursor:pointer
        }
        .ss-home-action:disabled{opacity:.4;cursor:default}
        .ss-home-action-circle{
          width:112px;
          height:112px;
          display:grid;
          place-items:center;
          margin:0 auto 12px;
          border:1px solid #525d68;
          border-radius:50%;
          background:rgba(18,23,28,.78);
          color:#f4f6f8;
          box-shadow:0 15px 32px rgba(0,0,0,.18);
          backdrop-filter:blur(9px)
        }
        .ss-home[data-theme=light] .ss-home-action-circle{
          background:rgba(255,255,255,.8);
          color:#22272c;
          border-color:#c7cdd2
        }
        .ss-home-action--new .ss-home-action-circle{
          border-color:#d8a511;
          background:linear-gradient(145deg,var(--ss-home-yellow-2),var(--ss-home-yellow));
          color:#151515
        }
        .ss-home-action-circle i{font-size:37px;font-weight:400}
        .ss-home-action strong{display:block;font-size:16px;font-weight:800}
        .ss-home-action small{display:block;margin-top:3px;color:var(--ss-home-muted);font-size:11px}
        .ss-home-section{padding:22px 0 0}
        .ss-home-section-head{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:16px;
          margin-bottom:14px
        }
        .ss-home-section-head h2{margin:0;font-size:18px;font-weight:800}
        .ss-recent-see{
          display:inline-flex;
          align-items:center;
          gap:8px;
          border:0;
          background:transparent;
          color:var(--ss-home-muted);
          font:700 11px Inter,ui-sans-serif,system-ui,sans-serif;
          cursor:pointer
        }
        .ss-recent-list{
          display:grid;
          grid-auto-flow:column;
          grid-auto-columns:minmax(142px,1fr);
          gap:14px;
          overflow-x:auto;
          padding:0 0 8px;
          scrollbar-width:thin;
          scrollbar-color:#3b444d transparent
        }
        .ss-recent-card{min-width:0;color:var(--ss-home-text)}
        .ss-recent-thumb{
          aspect-ratio:1/1;
          overflow:hidden;
          border:1px solid var(--ss-home-line);
          border-radius:9px;
          background:var(--ss-home-panel)
        }
        .ss-recent-thumb img{width:100%;height:100%;display:block;object-fit:cover}
        .ss-recent-thumb-empty{width:100%;height:100%;display:grid;place-items:center;color:#68727c;font-size:29px}
        .ss-recent-card strong{display:block;overflow:hidden;margin-top:9px;font-size:11px;font-weight:750;text-overflow:ellipsis;white-space:nowrap}
        .ss-recent-card span{display:block;margin-top:3px;color:var(--ss-home-muted);font-size:9px}
        .ss-recent-empty{
          min-height:135px;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:24px;
          border:1px dashed var(--ss-home-line);
          border-radius:10px;
          background:var(--ss-home-panel);
          color:var(--ss-home-muted);
          text-align:center;
          font-size:11px;
          line-height:1.6
        }
        .ss-home-bottom{
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
          gap:14px;
          margin-top:18px;
          padding-top:14px;
          border-top:1px solid var(--ss-home-line)
        }
        .ss-home-bottom-card{
          min-height:78px;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:18px;
          padding:13px 17px;
          border:1px solid var(--ss-home-line);
          border-radius:10px;
          background:linear-gradient(145deg,var(--ss-home-panel-2),var(--ss-home-panel));
          color:var(--ss-home-text);
          text-align:left
        }
        button.ss-home-bottom-card{cursor:pointer}
        .ss-home-bottom-card:disabled{opacity:.45;cursor:default}
        .ss-home-bottom-card>i{width:34px;flex:none;color:#e9edf0;font-size:28px;text-align:center}
        .ss-home[data-theme=light] .ss-home-bottom-card>i{color:#272c31}
        .ss-home-bottom-card strong{display:block;font-size:11px;font-weight:800}
        .ss-home-bottom-card small{display:block;margin-top:4px;color:var(--ss-home-muted);font-size:9px}
        .ss-home-settings{
          position:absolute;
          z-index:20;
          top:73px;
          right:4px;
          width:210px;
          padding:11px;
          border:1px solid var(--ss-home-line);
          border-radius:10px;
          background:var(--ss-home-panel);
          color:var(--ss-home-text);
          box-shadow:0 18px 45px var(--ss-home-shadow)
        }
        .ss-home-settings-title{margin:0 0 8px;color:var(--ss-home-muted);font-size:9px;font-weight:800;text-transform:uppercase}
        .ss-home-theme-row{display:grid;grid-template-columns:1fr 1fr;gap:6px}
        .ss-home-theme-row button{
          min-height:34px;
          border:1px solid var(--ss-home-line);
          border-radius:7px;
          background:var(--ss-home-panel-2);
          color:var(--ss-home-text);
          font:700 10px Inter,ui-sans-serif,system-ui,sans-serif;
          cursor:pointer
        }
        .ss-home-theme-row button[aria-pressed=true]{border-color:#ba9220;background:rgba(244,189,40,.13)}
        .ss-home-help{
          position:absolute;
          z-index:20;
          top:73px;
          right:55px;
          width:min(310px,calc(100vw - 32px));
          padding:12px 14px;
          border:1px solid var(--ss-home-line);
          border-radius:10px;
          background:var(--ss-home-panel);
          box-shadow:0 18px 45px var(--ss-home-shadow);
          color:var(--ss-home-muted);
          font-size:10px;
          line-height:1.6
        }
        .ss-recovery-backdrop{
          position:fixed;
          inset:0;
          z-index:100;
          display:grid;
          place-items:center;
          padding:18px;
          background:rgba(4,7,10,.64);
          backdrop-filter:blur(7px)
        }
        .ss-recovery-card{
          width:min(430px,100%);
          padding:18px;
          border:1px solid #526170;
          border-radius:12px;
          background:linear-gradient(180deg,#161d24,#10161b);
          color:#f6f8fa;
          box-shadow:0 24px 70px rgba(0,0,0,.58)
        }
        .ss-home[data-theme=light] .ss-recovery-card{
          border-color:#cfd6dc;
          background:#fff;
          color:#15191d
        }
        .ss-recovery-card h2{
          margin:0 0 7px;
          font-size:14px;
          font-weight:800
        }
        .ss-recovery-card p{
          margin:0 0 14px;
          color:var(--ss-home-muted);
          font-size:10px;
          line-height:1.6
        }
        .ss-recovery-actions{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:8px
        }
        .ss-recovery-actions .ss-btn{
          min-height:38px;
          border:1px solid #465361;
          border-radius:8px;
          background:#29323b;
          color:#eef4f8;
          font:750 10px Inter,ui-sans-serif,system-ui,sans-serif;
          cursor:pointer
        }
        .ss-recovery-actions .ss-btn.primary{
          border-color:#6ab7f5;
          background:#55a9ea;
          color:#0c2233
        }
        .ss-recovery-actions .ss-btn:disabled{
          opacity:.55;
          cursor:default
        }
        .ss-project-message{
          margin-top:12px;
          padding:9px 11px;
          border:1px solid var(--ss-home-line);
          border-radius:8px;
          background:var(--ss-home-panel);
          color:var(--ss-home-muted);
          font-size:10px
        }
        .ss-recovery-toast{
          position:fixed;
          top:50%;
          left:50%;
          z-index:140;
          width:max-content;
          max-width:min(360px,calc(100vw - 32px));
          padding:11px 16px;
          border:1px solid rgba(255,255,255,.14);
          border-radius:10px;
          background:rgba(26,30,34,.96);
          color:#f7f9fb;
          box-shadow:0 14px 38px rgba(0,0,0,.42);
          backdrop-filter:blur(10px);
          -webkit-backdrop-filter:blur(10px);
          font:700 10px/1.45 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          text-align:center;
          pointer-events:none;
          animation:ssRecoveryToast 1.8s ease both
        }
        .ss-home[data-theme=light] .ss-recovery-toast{
          border-color:rgba(25,30,35,.12);
          background:rgba(255,255,255,.97);
          color:#171b1f;
          box-shadow:0 14px 34px rgba(24,30,36,.18)
        }
        @keyframes ssRecoveryToast{
          0%{
            opacity:0;
            transform:translate(-50%,-50%) scale(.94)
          }
          12%,76%{
            opacity:1;
            transform:translate(-50%,-50%) scale(1)
          }
          100%{
            opacity:0;
            transform:translate(-50%,-50%) scale(.98)
          }
        }
        @media(max-width:900px){
          .ss-home-shell{padding:0 18px 24px}
          .ss-home-hero{
            min-height:570px;
            display:block;
            width:calc(100% + 36px);
            margin-left:-18px;
            margin-right:-18px
          }
          .ss-home-hero-desktop{display:none}
          .ss-home-hero-mobile{display:block}
          .ss-home-hero-mobile.ss-home-hero-art-back{
            object-fit:cover;
            transform:scale(1.08);
            opacity:.5;
            filter:brightness(var(--hero-mobile-brightness)) saturate(.78) blur(10px)
          }
          .ss-home-hero-mobile.ss-home-hero-art-main{
            object-fit:contain;
            transform:translate(var(--hero-mobile-x),var(--hero-mobile-y)) scale(var(--hero-mobile-scale));
            opacity:var(--hero-mobile-opacity);
            filter:brightness(var(--hero-mobile-brightness)) saturate(.92) contrast(1.02)
          }
          .ss-home-hero-shade{
            background:linear-gradient(
              to bottom,
              transparent 0%,
              transparent var(--hero-mobile-gradient-start),
              rgb(0 0 0 / var(--hero-mobile-gradient-mid)) 78%,
              rgb(0 0 0 / var(--hero-mobile-gradient-end)) 100%
            )
          }
          .ss-home-back{top:16px;left:0}
          .ss-home-top-actions{top:16px;right:0}
          .ss-home-icon-btn{width:40px;height:40px}
          .ss-home-brand{
            position:absolute;
            z-index:3;
            left:0;
            top:90px;
            width:64%;
            padding:0;
            transform:translate(var(--logo-mobile-x),var(--logo-mobile-y)) scale(var(--logo-mobile-scale));
            transform-origin:left top
          }
          .ss-home-logo{width:min(310px,100%)}
          .ss-home-quick{
            position:absolute;
            z-index:4;
            left:50%;
            bottom:35px;
            width:max-content;
            max-width:calc(100% - 36px);
            justify-content:center;
            gap:34px;
            margin:0;
            padding:0;
            transform:translateX(-50%)
          }
          .ss-home-action{width:130px}
          .ss-home-action-circle{width:104px;height:104px}
          .ss-recent-list{grid-auto-columns:minmax(132px,42vw)}
          .ss-home-bottom{grid-template-columns:1fr;gap:8px}
          .ss-home-bottom-card{justify-content:flex-start;min-height:66px}
        }
        @media(max-width:520px){
  .ss-home-shell{padding:0 14px 14px}
  .ss-home-hero{
    min-height:500px;
    width:calc(100% + 28px);
    margin-left:-14px;
    margin-right:-14px
  }
  .ss-home-back{left:14px}
  .ss-home-top-actions{right:14px;gap:8px}
  .ss-home-brand{left:14px;top:112px;width:66%}
  .ss-home-logo{width:100%}
  .ss-home-icon-btn{width:38px;height:38px}
  .ss-home-quick{
    bottom:28px;
    gap:18px;
    max-width:calc(100% - 28px)
  }
  .ss-home-action{width:126px;padding:0}
  .ss-home-action-circle{width:100px;height:100px}
  .ss-home-action strong{font-size:14px}
  .ss-home-action small{font-size:10px}
  .ss-home-section{padding-top:14px}
  .ss-home-section-head h2{font-size:16px}
  .ss-recent-empty{min-height:105px;padding:14px}
  .ss-recent-list{margin-right:-14px;grid-auto-columns:137px;gap:12px;padding-right:14px}
  .ss-home-bottom{margin-top:10px;padding-top:10px}
  .ss-home-bottom-card{min-height:56px}
  .ss-home-settings,.ss-home-help{top:64px;right:0}
}
      `}</style>

      <main
        className="ss-home"
        data-theme={theme}
        style={{
          '--hero-desktop-scale': HERO_DESKTOP.scale,
          '--hero-desktop-x': `${HERO_DESKTOP.x}px`,
          '--hero-desktop-y': `${HERO_DESKTOP.y}px`,
          '--hero-desktop-brightness': `${HERO_DESKTOP.brightness}%`,
          '--hero-desktop-opacity': `${HERO_DESKTOP.opacity}%`,
          '--hero-desktop-shade': `${HERO_DESKTOP.shade}%`,
          '--hero-desktop-gradient-start': `${HERO_DESKTOP.gradientStart}%`,
          '--hero-desktop-gradient-mid': HERO_DESKTOP.gradientMid / 100,
          '--hero-desktop-gradient-end': HERO_DESKTOP.gradientEnd / 100,
          '--hero-mobile-scale': HERO_MOBILE.scale,
          '--hero-mobile-x': `${HERO_MOBILE.x}px`,
          '--hero-mobile-y': `${HERO_MOBILE.y}px`,
          '--hero-mobile-brightness': `${HERO_MOBILE.brightness}%`,
          '--hero-mobile-opacity': `${HERO_MOBILE.opacity}%`,
          '--hero-mobile-shade': `${HERO_MOBILE.shade}%`,
          '--hero-mobile-gradient-start': `${HERO_MOBILE.gradientStart}%`,
          '--hero-mobile-gradient-mid': HERO_MOBILE.gradientMid / 100,
          '--hero-mobile-gradient-end': HERO_MOBILE.gradientEnd / 100,
          '--logo-desktop-scale': LOGO_DESKTOP.scale,
          '--logo-desktop-x': `${LOGO_DESKTOP.x}px`,
          '--logo-desktop-y': `${LOGO_DESKTOP.y}px`,
          '--logo-mobile-scale': LOGO_MOBILE.scale,
          '--logo-mobile-x': `${LOGO_MOBILE.x}px`,
          '--logo-mobile-y': `${LOGO_MOBILE.y}px`,
        }}
      >
        {recoveryEntry ? (
          <div className="ss-recovery-backdrop">
            <section
              className="ss-recovery-card"
              role="dialog"
              aria-modal="true"
              aria-label={tx('studioHome.localRecovery')}
            >
              <h2>{tx('studioHome.recoverHeading')}</h2>
              <p>{tx('studioHome.recoveryDescription', { count: recoveryEntry.documents.length, time: new Date(recoveryEntry.savedAt).toLocaleString() })}</p>
              <div className="ss-recovery-actions">
                <button type="button" className="ss-btn primary" disabled={recoveryBusy} onClick={onRecover}>
                  {recoveryBusy ? tx('studioHome.restoring') : tx('studioHome.restore')}
                </button>
                <button type="button" className="ss-btn" disabled={recoveryBusy} onClick={onDiscardRecovery}>
                  {tx('studioHome.discard')}
                </button>
              </div>
            </section>
          </div>
        ) : null}

        <div className="ss-home-shell">
          <section className="ss-home-hero">
            <img
              className="ss-home-hero-art ss-home-hero-art-back ss-home-hero-desktop"
              src={HERO_DESKTOP_IMAGE}
              alt=""
              aria-hidden="true"
            />
            <img
              className="ss-home-hero-art ss-home-hero-art-main ss-home-hero-desktop"
              src={HERO_DESKTOP_IMAGE}
              alt=""
            />
            <img
              className="ss-home-hero-art ss-home-hero-art-back ss-home-hero-mobile"
              src={HERO_MOBILE_IMAGE}
              alt=""
              aria-hidden="true"
            />
            <img
              className="ss-home-hero-art ss-home-hero-art-main ss-home-hero-mobile"
              src={HERO_MOBILE_IMAGE}
              alt=""
            />
            <div className="ss-home-hero-shade" aria-hidden="true" />

            <button type="button" className="ss-home-back" onClick={onExit} aria-label={labels.back} title={labels.back}>
              <i className="fa-solid fa-chevron-left" aria-hidden="true" />
            </button>

            <div className="ss-home-top-actions">
              <button type="button" className="ss-home-icon-btn" disabled={!canOpen} onClick={onOpenProject} aria-label={tx('studioHome.openProject')} title={tx('studioHome.openProject')}>
                <i className="fa-regular fa-folder-open" aria-hidden="true" />
              </button>
              <button type="button" className="ss-home-icon-btn" onClick={() => { setHelpOpen((value) => !value); setSettingsOpen(false) }} aria-label={tx('studioHome.help')} title={tx('studioHome.help')}>
                <i className="fa-regular fa-circle-question" aria-hidden="true" />
              </button>
              <div ref={settingsRef}>
                <button type="button" className="ss-home-icon-btn" onClick={() => { setSettingsOpen((value) => !value); setHelpOpen(false) }} aria-label={tx('studioHome.settings')} title={tx('studioHome.settings')}>
                  <i className="fa-solid fa-gear" aria-hidden="true" />
                </button>
                {settingsOpen ? (
                  <div className="ss-home-settings" role="dialog" aria-label={tx('studioHome.settings')}>
                    <p className="ss-home-settings-title">{tx('studioHome.appearance')}</p>
                    <div className="ss-home-theme-row">
                      <button type="button" aria-pressed={theme === 'dark'} onClick={() => setTheme('dark')}>{tx('studioHome.dark')}</button>
                      <button type="button" aria-pressed={theme === 'light'} onClick={() => setTheme('light')}>{tx('studioHome.light')}</button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {helpOpen ? <div className="ss-home-help" role="status">{tx('studioHome.localMessage')}</div> : null}

            <div className="ss-home-brand">
              <img className="ss-home-logo" src={STUDIO_LOGO} alt="Shadow Studio" />
              
            </div>

            <div className="ss-home-quick">
              <button type="button" className="ss-home-action" disabled={!canOpen} onClick={openMyWorks}>
                <span className="ss-home-action-circle"><i className="fa-regular fa-images" aria-hidden="true" /></span>
                <strong>{tx('studioHome.myWorks')}</strong>
                <small>{tx('studioHome.openManage')}</small>
              </button>
              <button type="button" className="ss-home-action ss-home-action--new" disabled={!canNew} onClick={() => onNewFile('basic')}>
                <span className="ss-home-action-circle"><i className="fa-solid fa-plus" aria-hidden="true" /></span>
                <strong>{tx('studioHome.newCanvas')}</strong>
                <small>{tx('studioHome.startDrawing')}</small>
              </button>
            </div>
          </section>

          {recoveryBooting ? <div className="ss-project-message" role="status">{tx('studioHome.checking')}</div> : null}

          <section className="ss-home-section">
            <div className="ss-home-section-head">
              <h2>{tx('studioHome.recentProjects')}</h2>
              <button type="button" className="ss-recent-see" disabled={!canOpen} onClick={openRecent}>
                {tx('studioHome.seeAll')} <i className="fa-solid fa-chevron-right" aria-hidden="true" />
              </button>
            </div>

            {recentDocuments.length ? (
              <div className="ss-recent-list">
                {recentDocuments.slice(0, 8).map((document) => (
                  <article className="ss-recent-card" key={document.id}>
                    <div className="ss-recent-thumb">
                      {recentPreview(document) ? <img src={recentPreview(document)} alt="" /> : <div className="ss-recent-thumb-empty"><i className="fa-regular fa-image" aria-hidden="true" /></div>}
                    </div>
                    <strong title={document.name}>{document.name}</strong>
                    <span>{Number(document.width || 0).toLocaleString()} × {Number(document.height || 0).toLocaleString()}</span>
                    <span>{document.resolution || 144} PPI</span>
                  </article>
                ))}
              </div>
            ) : <div className="ss-recent-empty">{tx('studioHome.noRecent')}</div>}
          </section>

          <section className="ss-home-bottom" aria-label={tx('studioHome.projectFiles')}>
            <button type="button" className="ss-home-bottom-card" disabled={!canOpen} onClick={onOpenProject}>
              <i className="fa-regular fa-file" aria-hidden="true" />
              <span><strong>{tx('studioHome.importFile')}</strong><small>{tx('studioHome.projectFormat')}</small></span>
            </button>
            <button type="button" className="ss-home-bottom-card" disabled={!canImport} onClick={onImportImage}>
              <i className="fa-solid fa-mobile-screen-button" aria-hidden="true" />
              <span><strong>{tx('studioHome.openDevice')}</strong><small>{tx('studioHome.photosFiles')}</small></span>
            </button>
            <div className="ss-home-bottom-card">
              <i className="fa-solid fa-cloud-arrow-down" aria-hidden="true" />
              <span><strong>{tx('studioHome.noOnline')}</strong><small>{tx('studioHome.localOnly')}</small></span>
            </div>
          </section>

          {projectNotice ? <div className="ss-project-message" role="status">{projectNotice}</div> : null}
          {recoveryToast ? (
            <div className="ss-recovery-toast" role="status" aria-live="polite">
              {recoveryToast}
            </div>
          ) : null}

        </div>
      </main>
    </>
  )
}
