import { useEffect, useMemo, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('studioFolder', {
  en: { search: 'Search in folder...', empty: 'No works in this folder yet.', untitled: 'Untitled', updatedNow: 'Updated recently' },
  km: { search: 'ស្វែងរកក្នុង Folder...', empty: 'មិនទាន់មានការងារនៅក្នុង Folder នេះទេ។', untitled: 'គ្មានចំណងជើង', updatedNow: 'បានកែថ្មីៗ' },
  zh: { search: '在文件夹中搜索...', empty: '此文件夹中还没有作品。', untitled: '未命名', updatedNow: '最近更新' },
  ja: { search: 'フォルダ内を検索...', empty: 'このフォルダにはまだ作品がありません。', untitled: '無題', updatedNow: '最近更新' },
  ko: { search: '폴더에서 검색...', empty: '이 폴더에는 아직 작업이 없습니다.', untitled: '제목 없음', updatedNow: '최근 업데이트' },
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

export default function StudioFolderPage({ folder, documents = [], onBack, onOpenDocument }) {
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

  const visibleWorks = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const source = needle ? documents.filter((document) => String(document?.name || '').toLowerCase().includes(needle)) : documents
    return [...source].sort((a, b) => stamp(b) - stamp(a))
  }, [documents, query])

  function previewOf(document) {
    if (typeof document?.thumbnail === 'string' && document.thumbnail) return document.thumbnail
    if (typeof document?.preview === 'string' && document.preview) return document.preview
    if (typeof document?.image === 'string' && document.image) return document.image
    return previewUrls[document?.id] || ''
  }

  return (
    <>
      <style>{`
        .ss-folder-page{--fp-bg:#090c0f;--fp-panel:#11171d;--fp-panel-2:#171d23;--fp-line:#27313a;--fp-text:#f6f7f8;--fp-muted:#8f9aa5;--fp-yellow:#ffc934;min-height:100dvh;background:var(--fp-bg);color:var(--fp-text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color-scheme:dark}
        .shadow-studio:has(.ss-folder-page)>.ss-chrome{display:none}
        .ss-folder-page[data-theme=light]{--fp-bg:#f4f5f6;--fp-panel:#fff;--fp-panel-2:#f7f8f9;--fp-line:#d9dee3;--fp-text:#171b1f;--fp-muted:#707a84;--fp-yellow:#e8b320;color-scheme:light}
        .ss-folder-page *{box-sizing:border-box}
        .ss-folder-page-shell{width:min(1180px,100%);margin:0 auto;padding:18px clamp(14px,3vw,34px) 42px}
        .ss-folder-page-header{min-height:48px;display:grid;grid-template-columns:54px 1fr 54px;align-items:center}
        .ss-folder-page-back{width:40px;height:40px;display:grid;place-items:center;padding:0;border:0;border-radius:50%;background:transparent;color:var(--fp-text);cursor:pointer;font-size:20px}
        .ss-folder-page-back:hover{background:var(--fp-panel)}
        .ss-folder-page-title{min-width:0;margin:0;overflow:hidden;text-align:center;font-size:22px;font-weight:800;letter-spacing:-.02em;text-overflow:ellipsis;white-space:nowrap}
        .ss-folder-page-search{position:relative;display:block;margin-top:14px}
        .ss-folder-page-search i{position:absolute;top:50%;left:16px;transform:translateY(-50%);color:var(--fp-muted);font-size:15px;pointer-events:none}
        .ss-folder-page-search input{width:100%;height:46px;padding:0 16px 0 44px;border:1px solid var(--fp-line);border-radius:23px;outline:0;background:var(--fp-panel-2);color:var(--fp-text);font:600 13px Inter,ui-sans-serif,system-ui,sans-serif}
        .ss-folder-page-search input::placeholder{color:var(--fp-muted)}
        .ss-folder-page-search input:focus{border-color:#697785}
        .ss-folder-page-count{margin:18px 0 11px;color:var(--fp-muted);font-size:10px;font-weight:700}
        .ss-folder-page-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));align-items:start;gap:14px}
        .ss-folder-page-card{min-width:0;overflow:hidden;border:1px solid var(--fp-line);border-radius:12px;background:var(--fp-panel);color:var(--fp-text);cursor:pointer}
        .ss-folder-page-card:hover{border-color:#4b5864}
        .ss-folder-page-thumb{position:relative;overflow:hidden;background:#141a20}
        .ss-folder-page-card[data-shape=portrait] .ss-folder-page-thumb{aspect-ratio:4/5}
        .ss-folder-page-card[data-shape=landscape] .ss-folder-page-thumb{aspect-ratio:4/3}
        .ss-folder-page-card[data-shape=square] .ss-folder-page-thumb{aspect-ratio:1/1}
        .ss-folder-page-thumb img{width:100%;height:100%;display:block;object-fit:cover}
        .ss-folder-page-thumb-empty{width:100%;height:100%;display:grid;place-items:center;color:#687480;font-size:30px}
        .ss-folder-page-card-body{padding:10px 11px 11px}
        .ss-folder-page-card strong{display:block;overflow:hidden;font-size:12px;font-weight:800;text-overflow:ellipsis;white-space:nowrap}
        .ss-folder-page-card span{display:block;margin-top:3px;color:var(--fp-muted);font-size:9px}
        .ss-folder-page-empty{min-height:150px;display:grid;place-items:center;padding:24px;border:1px dashed var(--fp-line);border-radius:13px;background:var(--fp-panel);color:var(--fp-muted);text-align:center;font-size:11px}
        .ss-folder-page button:focus-visible,.ss-folder-page input:focus-visible{outline:2px solid var(--fp-yellow);outline-offset:2px}
        @media(max-width:820px){.ss-folder-page-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
        @media(max-width:600px){
          .ss-folder-page-shell{padding:10px 10px 28px}
          .ss-folder-page-header{grid-template-columns:44px 1fr 44px}
          .ss-folder-page-title{font-size:18px}
          .ss-folder-page-search{margin-top:8px}
          .ss-folder-page-search input{height:42px}
          .ss-folder-page-count{margin-top:14px}
          .ss-folder-page-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
          .ss-folder-page-card{border-radius:9px}
          .ss-folder-page-card-body{padding:8px 8px 9px}
          .ss-folder-page-card strong{font-size:10px}
          .ss-folder-page-card span{font-size:8px}
        }
      `}</style>

      <main className="ss-folder-page" data-theme={theme}>
        <div className="ss-folder-page-shell">
          <header className="ss-folder-page-header">
            <button type="button" className="ss-folder-page-back" onClick={onBack} aria-label="Back"><i className="fa-solid fa-chevron-left" aria-hidden="true" /></button>
            <h1 className="ss-folder-page-title" title={folder?.name || ''}>{folder?.name || tx('studioFolder.untitled')} ({documents.length})</h1>
            <span aria-hidden="true" />
          </header>

          <label className="ss-folder-page-search">
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={tx('studioFolder.search')} aria-label={tx('studioFolder.search')} />
          </label>

          <div className="ss-folder-page-count">{visibleWorks.length} / {documents.length}</div>

          {visibleWorks.length ? (
            <section className="ss-folder-page-grid">
              {visibleWorks.map((document) => {
                const preview = previewOf(document)
                const shape = shapeOf(document)
                return (
                  <article className="ss-folder-page-card" data-shape={shape} key={document.id} role="button" tabIndex={0} onClick={() => onOpenDocument?.(document)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onOpenDocument?.(document) } }}>
                    <div className="ss-folder-page-thumb">{preview ? <img src={preview} alt="" /> : <div className="ss-folder-page-thumb-empty"><i className="fa-regular fa-image" aria-hidden="true" /></div>}</div>
                    <div className="ss-folder-page-card-body">
                      <strong title={document.name}>{document.name || tx('studioFolder.untitled')}</strong>
                      <span>{Number(document.width || 0).toLocaleString()} × {Number(document.height || 0).toLocaleString()}</span>
                      <span>{updatedLabel(document, tx('studioFolder.updatedNow'))}</span>
                    </div>
                  </article>
                )
              })}
            </section>
          ) : <div className="ss-folder-page-empty">{tx('studioFolder.empty')}</div>}
        </div>
      </main>
    </>
  )
}
