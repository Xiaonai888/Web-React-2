import { useEffect, useMemo, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('studioMyWorks', {
  en: {
    title: 'My Works', select: 'Select', search: 'Search my works...', newFile: 'New File', newFileHint: 'Create a new canvas', createFolder: 'Create Folder', createFolderHint: 'Organize your works', latestFolders: 'Latest Folders', recentWorks: 'Recent Works', seeAll: 'See All', works: 'works', emptyFolders: 'No folders yet.', emptyWorks: 'No local works yet.', localTitle: 'Works are stored locally on this device.', localHint: 'A smart cache system is coming soon.', untitled: 'Untitled', updatedNow: 'Updated recently',
  },
  km: {
    title: 'ការងាររបស់ខ្ញុំ', select: 'ជ្រើសរើស', search: 'ស្វែងរកការងារ...', newFile: 'ឯកសារថ្មី', newFileHint: 'បង្កើត Canvas ថ្មី', createFolder: 'បង្កើត Folder', createFolderHint: 'រៀបចំការងាររបស់អ្នក', latestFolders: 'Folder ថ្មីៗ', recentWorks: 'ការងារថ្មីៗ', seeAll: 'មើលទាំងអស់', works: 'ការងារ', emptyFolders: 'មិនទាន់មាន Folder ទេ។', emptyWorks: 'មិនទាន់មានការងារ Local ទេ។', localTitle: 'ការងារត្រូវបានរក្សាទុកក្នុងឧបករណ៍នេះ។', localHint: 'Smart Cache នឹងបន្ថែមនៅពេលក្រោយ។', untitled: 'គ្មានចំណងជើង', updatedNow: 'បានកែថ្មីៗ',
  },
  zh: {
    title: '我的作品', select: '选择', search: '搜索作品...', newFile: '新建文件', newFileHint: '创建新画布', createFolder: '新建文件夹', createFolderHint: '整理你的作品', latestFolders: '最近文件夹', recentWorks: '最近作品', seeAll: '查看全部', works: '作品', emptyFolders: '还没有文件夹。', emptyWorks: '还没有本地作品。', localTitle: '作品保存在此设备本地。', localHint: '智能缓存功能即将推出。', untitled: '未命名', updatedNow: '最近更新',
  },
  ja: {
    title: 'マイ作品', select: '選択', search: '作品を検索...', newFile: '新規ファイル', newFileHint: '新しいキャンバスを作成', createFolder: 'フォルダ作成', createFolderHint: '作品を整理', latestFolders: '最近のフォルダ', recentWorks: '最近の作品', seeAll: 'すべて表示', works: '作品', emptyFolders: 'フォルダはまだありません。', emptyWorks: 'ローカル作品はまだありません。', localTitle: '作品はこのデバイスに保存されます。', localHint: 'Smart Cache は今後追加予定です。', untitled: '無題', updatedNow: '最近更新',
  },
  ko: {
    title: '내 작업', select: '선택', search: '작업 검색...', newFile: '새 파일', newFileHint: '새 캔버스 만들기', createFolder: '폴더 만들기', createFolderHint: '작업 정리하기', latestFolders: '최근 폴더', recentWorks: '최근 작업', seeAll: '모두 보기', works: '작업', emptyFolders: '폴더가 없습니다.', emptyWorks: '로컬 작업이 없습니다.', localTitle: '작업은 이 기기에 로컬로 저장됩니다.', localHint: 'Smart Cache는 추후 추가됩니다.', untitled: '제목 없음', updatedNow: '최근 업데이트',
  },
})

const THEME_KEY = 'shadow-studio-home-theme-v1'
const RECENT_LIMIT = 20
const FOLDER_LIMIT = 2

function readTheme() {
  try {
    return window.localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

function stamp(item) {
  const value = item?.updatedAt || item?.savedAt || item?.modifiedAt || item?.createdAt || 0
  const time = new Date(value).getTime()
  return Number.isFinite(time) ? time : 0
}

function sortLatest(items) {
  return [...items].sort((a, b) => stamp(b) - stamp(a))
}

function shapeOf(document) {
  const width = Number(document?.width || 0)
  const height = Number(document?.height || 0)
  if (!width || !height) return 'square'
  const ratio = width / height
  if (ratio >= 1.2) return 'landscape'
  if (ratio <= 0.84) return 'portrait'
  return 'square'
}

function updatedLabel(document, fallback) {
  const value = document?.updatedAt || document?.savedAt || document?.modifiedAt || document?.createdAt
  if (!value) return fallback
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return fallback
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined })
}

export default function StudioMyWorksPage({
  documents = [],
  folders = [],
  onBack,
  onSelect,
  onNewFile,
  onCreateFolder,
  onOpenDocument,
  onOpenFolder,
  onSeeAllWorks,
  onSeeAllFolders,
}) {
  const { t: tx } = useDisplayTranslation()
  const [theme] = useState(readTheme)
  const [query, setQuery] = useState('')
  const [previewUrls, setPreviewUrls] = useState({})

  useEffect(() => {
    const urls = []
    const next = {}
    documents.forEach((document) => {
      if (document?.image instanceof Blob) {
        const url = URL.createObjectURL(document.image)
        urls.push(url)
        next[document.id] = url
      }
    })
    setPreviewUrls(next)
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [documents])

  const normalizedQuery = query.trim().toLowerCase()

  const latestFolders = useMemo(() => {
    const source = normalizedQuery ? folders.filter((folder) => String(folder?.name || '').toLowerCase().includes(normalizedQuery)) : folders
    return sortLatest(source).slice(0, FOLDER_LIMIT)
  }, [folders, normalizedQuery])

  const recentWorks = useMemo(() => {
    const source = normalizedQuery ? documents.filter((document) => String(document?.name || '').toLowerCase().includes(normalizedQuery)) : documents
    return sortLatest(source).slice(0, RECENT_LIMIT)
  }, [documents, normalizedQuery])

  function previewOf(document) {
    if (typeof document?.thumbnail === 'string' && document.thumbnail) return document.thumbnail
    if (typeof document?.preview === 'string' && document.preview) return document.preview
    if (typeof document?.image === 'string' && document.image) return document.image
    return previewUrls[document?.id] || ''
  }

  function folderCount(folder) {
    if (Number.isFinite(Number(folder?.count))) return Number(folder.count)
    if (Number.isFinite(Number(folder?.worksCount))) return Number(folder.worksCount)
    return documents.filter((document) => document?.folderId === folder?.id).length
  }

  return (
    <>
      <style>{`
        .ss-myworks{--mw-bg:#090c0f;--mw-panel:#11171d;--mw-panel-2:#171d23;--mw-line:#27313a;--mw-text:#f6f7f8;--mw-muted:#8f9aa5;--mw-yellow:#ffc934;--mw-yellow-soft:rgba(255,201,52,.12);min-height:100dvh;background:var(--mw-bg);color:var(--mw-text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color-scheme:dark}
        .ss-myworks[data-theme=light]{--mw-bg:#f4f5f6;--mw-panel:#fff;--mw-panel-2:#f7f8f9;--mw-line:#d9dee3;--mw-text:#171b1f;--mw-muted:#707a84;--mw-yellow:#e8b320;--mw-yellow-soft:rgba(232,179,32,.12);color-scheme:light}
        .ss-myworks *{box-sizing:border-box}
        .ss-myworks-shell{width:min(1180px,100%);margin:0 auto;padding:18px clamp(14px,3vw,34px) 108px}
        .ss-myworks-header{min-height:48px;display:grid;grid-template-columns:54px 1fr 78px;align-items:center}
        .ss-myworks-back,.ss-myworks-select,.ss-myworks-see{border:0;background:transparent;color:var(--mw-text);cursor:pointer}
        .ss-myworks-back{width:40px;height:40px;display:grid;place-items:center;padding:0;border-radius:50%;font-size:20px}
        .ss-myworks-back:hover{background:var(--mw-panel)}
        .ss-myworks-title{margin:0;text-align:center;font-size:22px;font-weight:800;letter-spacing:-.02em}
        .ss-myworks-select{justify-self:end;color:var(--mw-yellow);font-size:13px;font-weight:750}
        .ss-myworks-search{position:relative;display:block;margin-top:14px}
        .ss-myworks-search i{position:absolute;top:50%;left:16px;transform:translateY(-50%);color:var(--mw-muted);font-size:15px;pointer-events:none}
        .ss-myworks-search input{width:100%;height:46px;padding:0 16px 0 44px;border:1px solid var(--mw-line);border-radius:23px;outline:0;background:var(--mw-panel-2);color:var(--mw-text);font:600 13px Inter,ui-sans-serif,system-ui,sans-serif}
        .ss-myworks-search input::placeholder{color:var(--mw-muted)}
        .ss-myworks-search input:focus{border-color:#697785}
        .ss-myworks-actions{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px}
        .ss-myworks-action{min-height:82px;display:flex;align-items:center;gap:14px;padding:14px 16px;border:1px solid var(--mw-line);border-radius:14px;background:linear-gradient(145deg,var(--mw-panel-2),var(--mw-panel));color:var(--mw-text);text-align:left;cursor:pointer}
        .ss-myworks-action:hover{border-color:#4b5864}
        .ss-myworks-action-icon{width:46px;height:46px;flex:none;display:grid;place-items:center;border-radius:12px;background:#26303a;font-size:20px}
        .ss-myworks-action--folder .ss-myworks-action-icon{background:var(--mw-yellow-soft);color:var(--mw-yellow)}
        .ss-myworks-action-copy{min-width:0;flex:1}
        .ss-myworks-action strong{display:block;font-size:14px;font-weight:800}
        .ss-myworks-action small{display:block;margin-top:4px;color:var(--mw-muted);font-size:10px}
        .ss-myworks-action-chevron{color:var(--mw-muted);font-size:13px}
        .ss-myworks-section{margin-top:24px}
        .ss-myworks-section-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}
        .ss-myworks-section-head h2{margin:0;font-size:16px;font-weight:800}
        .ss-myworks-see{display:inline-flex;align-items:center;gap:7px;color:var(--mw-muted);font-size:10px;font-weight:750}
        .ss-myworks-folder-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
        .ss-myworks-folder{min-height:96px;display:flex;align-items:center;gap:14px;padding:15px;border:1px solid var(--mw-line);border-radius:14px;background:linear-gradient(145deg,var(--mw-panel-2),var(--mw-panel));color:var(--mw-text);text-align:left;cursor:pointer}
        .ss-myworks-folder-icon{width:52px;height:48px;flex:none;display:grid;place-items:center;border-radius:12px;background:var(--mw-yellow-soft);color:var(--mw-yellow);font-size:27px}
        .ss-myworks-folder-copy{min-width:0;flex:1}
        .ss-myworks-folder strong{display:block;overflow:hidden;font-size:13px;font-weight:800;text-overflow:ellipsis;white-space:nowrap}
        .ss-myworks-folder span{display:block;margin-top:5px;color:var(--mw-muted);font-size:10px}
        .ss-myworks-folder-more{color:var(--mw-muted);font-size:14px}
        .ss-myworks-work-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));align-items:start;gap:14px}
        .ss-myworks-card{min-width:0;overflow:hidden;border:1px solid var(--mw-line);border-radius:12px;background:var(--mw-panel);color:var(--mw-text);cursor:pointer}
        .ss-myworks-thumb{position:relative;overflow:hidden;background:#141a20}
        .ss-myworks-card[data-shape=portrait] .ss-myworks-thumb{aspect-ratio:4/5}
        .ss-myworks-card[data-shape=landscape] .ss-myworks-thumb{aspect-ratio:4/3}
        .ss-myworks-card[data-shape=square] .ss-myworks-thumb{aspect-ratio:1/1}
        .ss-myworks-thumb img{width:100%;height:100%;display:block;object-fit:cover}
        .ss-myworks-thumb-empty{width:100%;height:100%;display:grid;place-items:center;color:#687480;font-size:30px}
        .ss-myworks-card-body{padding:10px 11px 11px}
        .ss-myworks-card-title-row{display:flex;align-items:center;gap:8px}
        .ss-myworks-card strong{min-width:0;flex:1;overflow:hidden;font-size:12px;font-weight:800;text-overflow:ellipsis;white-space:nowrap}
        .ss-myworks-card-more{color:var(--mw-muted);font-size:12px}
        .ss-myworks-card span{display:block;margin-top:3px;color:var(--mw-muted);font-size:9px}
        .ss-myworks-empty{min-height:100px;display:grid;place-items:center;padding:20px;border:1px dashed var(--mw-line);border-radius:12px;background:var(--mw-panel);color:var(--mw-muted);text-align:center;font-size:11px}
        .ss-myworks-local{min-height:62px;display:flex;align-items:center;gap:13px;margin-top:22px;padding:12px 15px;border:1px solid var(--mw-line);border-radius:13px;background:var(--mw-panel);color:var(--mw-muted)}
        .ss-myworks-local>i{width:30px;text-align:center;font-size:21px}
        .ss-myworks-local strong{display:block;color:var(--mw-text);font-size:10px;font-weight:700}
        .ss-myworks-local small{display:block;margin-top:3px;font-size:9px}
        .ss-myworks-fab{position:fixed;z-index:20;right:max(18px,calc((100vw - 1180px)/2 + 28px));bottom:22px;width:68px;height:68px;display:grid;place-items:center;border:1px solid #d9a60c;border-radius:50%;background:linear-gradient(145deg,#ffd65a,var(--mw-yellow));color:#151515;box-shadow:0 12px 28px rgba(0,0,0,.38),0 0 24px rgba(255,201,52,.13);cursor:pointer;font-size:27px}
        .ss-myworks button:focus-visible,.ss-myworks input:focus-visible{outline:2px solid var(--mw-yellow);outline-offset:2px}
        @media(max-width:820px){.ss-myworks-work-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
        @media(max-width:600px){
          .ss-myworks-shell{padding:10px 10px 96px}
          .ss-myworks-header{grid-template-columns:44px 1fr 70px}
          .ss-myworks-title{font-size:18px}
          .ss-myworks-select{font-size:12px}
          .ss-myworks-search{margin-top:8px}
          .ss-myworks-search input{height:42px}
          .ss-myworks-actions{gap:8px;margin-top:12px}
          .ss-myworks-action{min-height:68px;padding:10px;border-radius:11px;gap:10px}
          .ss-myworks-action-icon{width:40px;height:40px;border-radius:10px;font-size:18px}
          .ss-myworks-action strong{font-size:11px}
          .ss-myworks-action small{font-size:8px}
          .ss-myworks-section{margin-top:18px}
          .ss-myworks-section-head{margin-bottom:9px}
          .ss-myworks-section-head h2{font-size:13px}
          .ss-myworks-folder-grid{gap:8px}
          .ss-myworks-folder{min-height:76px;padding:10px;border-radius:11px;gap:9px}
          .ss-myworks-folder-icon{width:42px;height:40px;border-radius:9px;font-size:21px}
          .ss-myworks-folder strong{font-size:10px}
          .ss-myworks-folder span{font-size:8px}
          .ss-myworks-work-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
          .ss-myworks-card{border-radius:9px}
          .ss-myworks-card-body{padding:8px 8px 9px}
          .ss-myworks-card strong{font-size:10px}
          .ss-myworks-card span{font-size:8px}
          .ss-myworks-local{margin-top:16px}
          .ss-myworks-fab{right:16px;bottom:18px;width:62px;height:62px;font-size:25px}
        }
      `}</style>

      <main className="ss-myworks" data-theme={theme}>
        <div className="ss-myworks-shell">
          <header className="ss-myworks-header">
            <button type="button" className="ss-myworks-back" onClick={onBack} aria-label="Back"><i className="fa-solid fa-chevron-left" aria-hidden="true" /></button>
            <h1 className="ss-myworks-title">{tx('studioMyWorks.title')} ({documents.length})</h1>
            <button type="button" className="ss-myworks-select" onClick={onSelect}>{tx('studioMyWorks.select')}</button>
          </header>

          <label className="ss-myworks-search">
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={tx('studioMyWorks.search')} aria-label={tx('studioMyWorks.search')} />
          </label>

          <section className="ss-myworks-actions">
            <button type="button" className="ss-myworks-action" onClick={onNewFile}>
              <span className="ss-myworks-action-icon"><i className="fa-regular fa-file" aria-hidden="true" /></span>
              <span className="ss-myworks-action-copy"><strong>{tx('studioMyWorks.newFile')}</strong><small>{tx('studioMyWorks.newFileHint')}</small></span>
              <i className="fa-solid fa-chevron-right ss-myworks-action-chevron" aria-hidden="true" />
            </button>
            <button type="button" className="ss-myworks-action ss-myworks-action--folder" onClick={onCreateFolder}>
              <span className="ss-myworks-action-icon"><i className="fa-regular fa-folder" aria-hidden="true" /></span>
              <span className="ss-myworks-action-copy"><strong>{tx('studioMyWorks.createFolder')}</strong><small>{tx('studioMyWorks.createFolderHint')}</small></span>
              <i className="fa-solid fa-chevron-right ss-myworks-action-chevron" aria-hidden="true" />
            </button>
          </section>

          <section className="ss-myworks-section">
            <div className="ss-myworks-section-head">
              <h2>{tx('studioMyWorks.latestFolders')}</h2>
              <button type="button" className="ss-myworks-see" onClick={onSeeAllFolders}>{tx('studioMyWorks.seeAll')} <i className="fa-solid fa-chevron-right" aria-hidden="true" /></button>
            </div>
            {latestFolders.length ? (
              <div className="ss-myworks-folder-grid">
                {latestFolders.map((folder) => (
                  <button type="button" className="ss-myworks-folder" key={folder.id} onClick={() => onOpenFolder?.(folder)}>
                    <span className="ss-myworks-folder-icon"><i className="fa-solid fa-folder" aria-hidden="true" /></span>
                    <span className="ss-myworks-folder-copy"><strong>{folder.name || tx('studioMyWorks.untitled')}</strong><span>{folderCount(folder)} {tx('studioMyWorks.works')}</span></span>
                    <i className="fa-solid fa-ellipsis-vertical ss-myworks-folder-more" aria-hidden="true" />
                  </button>
                ))}
              </div>
            ) : <div className="ss-myworks-empty">{tx('studioMyWorks.emptyFolders')}</div>}
          </section>

          <section className="ss-myworks-section">
            <div className="ss-myworks-section-head">
              <h2>{tx('studioMyWorks.recentWorks')}</h2>
              <button type="button" className="ss-myworks-see" onClick={onSeeAllWorks}>{tx('studioMyWorks.seeAll')} <i className="fa-solid fa-chevron-right" aria-hidden="true" /></button>
            </div>
            {recentWorks.length ? (
              <div className="ss-myworks-work-grid">
                {recentWorks.map((document) => {
                  const preview = previewOf(document)
                  const shape = shapeOf(document)
                  return (
                    <article className="ss-myworks-card" data-shape={shape} key={document.id} role="button" tabIndex={0} onClick={() => onOpenDocument?.(document)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onOpenDocument?.(document) } }}>
                      <div className="ss-myworks-thumb">{preview ? <img src={preview} alt="" /> : <div className="ss-myworks-thumb-empty"><i className="fa-regular fa-image" aria-hidden="true" /></div>}</div>
                      <div className="ss-myworks-card-body">
                        <div className="ss-myworks-card-title-row"><strong title={document.name}>{document.name || tx('studioMyWorks.untitled')}</strong><i className="fa-solid fa-ellipsis ss-myworks-card-more" aria-hidden="true" /></div>
                        <span>{Number(document.width || 0).toLocaleString()} × {Number(document.height || 0).toLocaleString()}</span>
                        <span>{updatedLabel(document, tx('studioMyWorks.updatedNow'))}</span>
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : <div className="ss-myworks-empty">{tx('studioMyWorks.emptyWorks')}</div>}
          </section>

          <div className="ss-myworks-local">
            <i className="fa-solid fa-database" aria-hidden="true" />
            <span><strong>{tx('studioMyWorks.localTitle')}</strong><small>{tx('studioMyWorks.localHint')}</small></span>
          </div>
        </div>

        <button type="button" className="ss-myworks-fab" onClick={onNewFile} aria-label={tx('studioMyWorks.newFile')} title={tx('studioMyWorks.newFile')}><i className="fa-solid fa-plus" aria-hidden="true" /></button>
      </main>
    </>
  )
}
