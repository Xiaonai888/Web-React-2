import { useMemo, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('studioFolders', {
  en: {
    title: 'Folders',
    select: 'Select',
    search: 'Search folders...',
    create: 'Create Folder',
    createHint: 'Organize your works',
    works: 'works',
    empty: 'No folders yet.',
    untitled: 'Untitled Folder',
  },
  km: {
    title: 'Folders',
    select: 'ជ្រើសរើស',
    search: 'ស្វែងរក Folder...',
    create: 'បង្កើត Folder',
    createHint: 'រៀបចំការងាររបស់អ្នក',
    works: 'ការងារ',
    empty: 'មិនទាន់មាន Folder ទេ។',
    untitled: 'Folder គ្មានឈ្មោះ',
  },
  zh: {
    title: '文件夹',
    select: '选择',
    search: '搜索文件夹...',
    create: '新建文件夹',
    createHint: '整理你的作品',
    works: '作品',
    empty: '还没有文件夹。',
    untitled: '未命名文件夹',
  },
  ja: {
    title: 'フォルダ',
    select: '選択',
    search: 'フォルダを検索...',
    create: 'フォルダ作成',
    createHint: '作品を整理',
    works: '作品',
    empty: 'フォルダはまだありません。',
    untitled: '無題のフォルダ',
  },
  ko: {
    title: '폴더',
    select: '선택',
    search: '폴더 검색...',
    create: '폴더 만들기',
    createHint: '작업 정리하기',
    works: '작업',
    empty: '폴더가 없습니다.',
    untitled: '제목 없는 폴더',
  },
})

const THEME_KEY = 'shadow-studio-home-theme-v1'

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

export default function StudioFoldersPage({
  folders = [],
  documents = [],
  onBack,
  onSelect,
  onCreateFolder,
  onOpenFolder,
}) {
  const { t: tx } = useDisplayTranslation()
  const [theme] = useState(readTheme)
  const [query, setQuery] = useState('')

  const visibleFolders = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const source = needle
      ? folders.filter((folder) => String(folder?.name || '').toLowerCase().includes(needle))
      : folders
    return [...source].sort((a, b) => stamp(b) - stamp(a))
  }, [folders, query])

  function folderCount(folder) {
    if (Number.isFinite(Number(folder?.count))) return Number(folder.count)
    if (Number.isFinite(Number(folder?.worksCount))) return Number(folder.worksCount)
    return documents.filter((document) => document?.folderId === folder?.id).length
  }

  return (
    <>
      <style>{`
        .ss-folders{
          --sf-bg:#090c0f;
          --sf-panel:#11171d;
          --sf-panel-2:#171d23;
          --sf-line:#27313a;
          --sf-text:#f6f7f8;
          --sf-muted:#8f9aa5;
          --sf-yellow:#ffc934;
          --sf-yellow-soft:rgba(255,201,52,.12);
          min-height:100dvh;
          background:var(--sf-bg);
          color:var(--sf-text);
          font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          color-scheme:dark
        }
        .shadow-studio:has(.ss-folders)>.ss-chrome{display:none}
        .ss-folders[data-theme=light]{
          --sf-bg:#f4f5f6;
          --sf-panel:#fff;
          --sf-panel-2:#f7f8f9;
          --sf-line:#d9dee3;
          --sf-text:#171b1f;
          --sf-muted:#707a84;
          --sf-yellow:#e8b320;
          --sf-yellow-soft:rgba(232,179,32,.12);
          color-scheme:light
        }
        .ss-folders *{box-sizing:border-box}
        .ss-folders-shell{
          width:min(1100px,100%);
          margin:0 auto;
          padding:18px clamp(14px,3vw,34px) 40px
        }
        .ss-folders-header{
          min-height:48px;
          display:grid;
          grid-template-columns:54px 1fr 78px;
          align-items:center
        }
        .ss-folders-back,
        .ss-folders-select{
          border:0;
          background:transparent;
          color:var(--sf-text);
          cursor:pointer
        }
        .ss-folders-back{
          width:40px;
          height:40px;
          display:grid;
          place-items:center;
          padding:0;
          border-radius:50%;
          font-size:20px
        }
        .ss-folders-back:hover{background:var(--sf-panel)}
        .ss-folders-title{
          margin:0;
          text-align:center;
          font-size:22px;
          font-weight:800;
          letter-spacing:-.02em
        }
        .ss-folders-select{
          justify-self:end;
          color:var(--sf-yellow);
          font-size:13px;
          font-weight:750
        }
        .ss-folders-search{
          position:relative;
          display:block;
          margin-top:14px
        }
        .ss-folders-search i{
          position:absolute;
          top:50%;
          left:16px;
          transform:translateY(-50%);
          color:var(--sf-muted);
          font-size:15px;
          pointer-events:none
        }
        .ss-folders-search input{
          width:100%;
          height:46px;
          padding:0 16px 0 44px;
          border:1px solid var(--sf-line);
          border-radius:23px;
          outline:0;
          background:var(--sf-panel-2);
          color:var(--sf-text);
          font:600 13px Inter,ui-sans-serif,system-ui,sans-serif
        }
        .ss-folders-search input::placeholder{color:var(--sf-muted)}
        .ss-folders-search input:focus{border-color:#697785}
        .ss-folders-create{
          width:100%;
          min-height:72px;
          display:flex;
          align-items:center;
          gap:14px;
          margin-top:16px;
          padding:12px 15px;
          border:1px solid var(--sf-line);
          border-radius:13px;
          background:linear-gradient(145deg,var(--sf-panel-2),var(--sf-panel));
          color:var(--sf-text);
          text-align:left;
          cursor:pointer
        }
        .ss-folders-create-icon{
          width:44px;
          height:44px;
          flex:none;
          display:grid;
          place-items:center;
          border-radius:11px;
          background:var(--sf-yellow-soft);
          color:var(--sf-yellow);
          font-size:21px
        }
        .ss-folders-create-copy{min-width:0;flex:1}
        .ss-folders-create strong{display:block;font-size:13px;font-weight:800}
        .ss-folders-create small{display:block;margin-top:4px;color:var(--sf-muted);font-size:9px}
        .ss-folders-create-chevron{color:var(--sf-muted);font-size:13px}
        .ss-folders-grid{
          display:grid;
          grid-template-columns:repeat(4,minmax(0,1fr));
          gap:13px;
          margin-top:20px
        }
        .ss-folder-card{
          min-height:132px;
          display:flex;
          flex-direction:column;
          justify-content:space-between;
          padding:15px;
          border:1px solid var(--sf-line);
          border-radius:14px;
          background:linear-gradient(145deg,var(--sf-panel-2),var(--sf-panel));
          color:var(--sf-text);
          text-align:left;
          cursor:pointer
        }
        .ss-folder-card:hover{border-color:#4b5864}
        .ss-folder-card-top{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:10px
        }
        .ss-folder-card-icon{
          width:54px;
          height:50px;
          display:grid;
          place-items:center;
          border-radius:12px;
          background:var(--sf-yellow-soft);
          color:var(--sf-yellow);
          font-size:28px
        }
        .ss-folder-card-more{
          padding:4px;
          color:var(--sf-muted);
          font-size:14px
        }
        .ss-folder-card strong{
          display:block;
          overflow:hidden;
          margin-top:14px;
          font-size:13px;
          font-weight:800;
          text-overflow:ellipsis;
          white-space:nowrap
        }
        .ss-folder-card span{
          display:block;
          margin-top:5px;
          color:var(--sf-muted);
          font-size:10px
        }
        .ss-folders-empty{
          min-height:150px;
          display:grid;
          place-items:center;
          margin-top:20px;
          padding:24px;
          border:1px dashed var(--sf-line);
          border-radius:13px;
          background:var(--sf-panel);
          color:var(--sf-muted);
          text-align:center;
          font-size:11px
        }
        .ss-folders button:focus-visible,
        .ss-folders input:focus-visible{
          outline:2px solid var(--sf-yellow);
          outline-offset:2px
        }
        @media(max-width:820px){
          .ss-folders-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
        }
        @media(max-width:600px){
          .ss-folders-shell{padding:10px 10px 28px}
          .ss-folders-header{grid-template-columns:44px 1fr 70px}
          .ss-folders-title{font-size:18px}
          .ss-folders-select{font-size:12px}
          .ss-folders-search{margin-top:8px}
          .ss-folders-search input{height:42px}
          .ss-folders-create{min-height:64px;margin-top:12px;padding:10px}
          .ss-folders-create-icon{width:40px;height:40px;border-radius:10px;font-size:19px}
          .ss-folders-create strong{font-size:11px}
          .ss-folders-create small{font-size:8px}
          .ss-folders-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:14px}
          .ss-folder-card{min-height:112px;padding:11px;border-radius:11px}
          .ss-folder-card-icon{width:44px;height:41px;border-radius:10px;font-size:22px}
          .ss-folder-card strong{margin-top:11px;font-size:10px}
          .ss-folder-card span{font-size:8px}
        }
      `}</style>

      <main className="ss-folders" data-theme={theme}>
        <div className="ss-folders-shell">
          <header className="ss-folders-header">
            <button type="button" className="ss-folders-back" onClick={onBack} aria-label="Back">
              <i className="fa-solid fa-chevron-left" aria-hidden="true" />
            </button>
            <h1 className="ss-folders-title">{tx('studioFolders.title')} ({folders.length})</h1>
            <button type="button" className="ss-folders-select" onClick={onSelect}>{tx('studioFolders.select')}</button>
          </header>

          <label className="ss-folders-search">
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={tx('studioFolders.search')}
              aria-label={tx('studioFolders.search')}
            />
          </label>

          <button type="button" className="ss-folders-create" onClick={onCreateFolder}>
            <span className="ss-folders-create-icon"><i className="fa-solid fa-folder-plus" aria-hidden="true" /></span>
            <span className="ss-folders-create-copy">
              <strong>{tx('studioFolders.create')}</strong>
              <small>{tx('studioFolders.createHint')}</small>
            </span>
            <i className="fa-solid fa-chevron-right ss-folders-create-chevron" aria-hidden="true" />
          </button>

          {visibleFolders.length ? (
            <section className="ss-folders-grid">
              {visibleFolders.map((folder) => (
                <button type="button" className="ss-folder-card" key={folder.id} onClick={() => onOpenFolder?.(folder)}>
                  <span className="ss-folder-card-top">
                    <span className="ss-folder-card-icon"><i className="fa-solid fa-folder" aria-hidden="true" /></span>
                    <i className="fa-solid fa-ellipsis-vertical ss-folder-card-more" aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{folder.name || tx('studioFolders.untitled')}</strong>
                    <span>{folderCount(folder)} {tx('studioFolders.works')}</span>
                  </span>
                </button>
              ))}
            </section>
          ) : <div className="ss-folders-empty">{tx('studioFolders.empty')}</div>}
        </div>
      </main>
    </>
  )
}
