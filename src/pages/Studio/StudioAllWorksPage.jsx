import { useEffect, useMemo, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('studioAllWorks', {
  en: {
    title: 'All Works',
    search: 'Search works...',
    all: 'All',
    portrait: 'Portrait',
    landscape: 'Landscape',
    square: 'Square',
    empty: 'No works found.',
    untitled: 'Untitled',
    updatedNow: 'Updated recently',
  },
  km: {
    title: 'ការងារទាំងអស់',
    search: 'ស្វែងរកការងារ...',
    all: 'ទាំងអស់',
    portrait: 'បញ្ឈរ',
    landscape: 'ផ្ដេក',
    square: 'ការ៉េ',
    empty: 'រកមិនឃើញការងារ។',
    untitled: 'គ្មានចំណងជើង',
    updatedNow: 'បានកែថ្មីៗ',
  },
  zh: {
    title: '全部作品',
    search: '搜索作品...',
    all: '全部',
    portrait: '竖版',
    landscape: '横版',
    square: '方形',
    empty: '没有找到作品。',
    untitled: '未命名',
    updatedNow: '最近更新',
  },
  ja: {
    title: 'すべての作品',
    search: '作品を検索...',
    all: 'すべて',
    portrait: '縦長',
    landscape: '横長',
    square: '正方形',
    empty: '作品が見つかりません。',
    untitled: '無題',
    updatedNow: '最近更新',
  },
  ko: {
    title: '모든 작업',
    search: '작업 검색...',
    all: '전체',
    portrait: '세로',
    landscape: '가로',
    square: '정사각형',
    empty: '작업을 찾을 수 없습니다.',
    untitled: '제목 없음',
    updatedNow: '최근 업데이트',
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
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  })
}

export default function StudioAllWorksPage({
  documents = [],
  onBack,
  onOpenDocument,
}) {
  const { t: tx } = useDisplayTranslation()
  const [theme] = useState(readTheme)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
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
    return [...documents]
      .filter((document) => {
        if (filter !== 'all' && shapeOf(document) !== filter) return false
        if (!needle) return true
        return String(document?.name || '').toLowerCase().includes(needle)
      })
      .sort((a, b) => stamp(b) - stamp(a))
  }, [documents, filter, query])

  function previewOf(document) {
    if (typeof document?.thumbnail === 'string' && document.thumbnail) return document.thumbnail
    if (typeof document?.preview === 'string' && document.preview) return document.preview
    if (typeof document?.image === 'string' && document.image) return document.image
    return previewUrls[document?.id] || ''
  }

  const filters = [
    ['all', tx('studioAllWorks.all')],
    ['portrait', tx('studioAllWorks.portrait')],
    ['landscape', tx('studioAllWorks.landscape')],
    ['square', tx('studioAllWorks.square')],
  ]

  return (
    <>
      <style>{`
        .ss-allworks{
          --aw-bg:#090c0f;
          --aw-panel:#11171d;
          --aw-panel-2:#171d23;
          --aw-line:#27313a;
          --aw-text:#f6f7f8;
          --aw-muted:#8f9aa5;
          --aw-yellow:#ffc934;
          min-height:100dvh;
          background:var(--aw-bg);
          color:var(--aw-text);
          font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          color-scheme:dark
        }
        .shadow-studio:has(.ss-allworks)>.ss-chrome{display:none}
        .ss-allworks[data-theme=light]{
          --aw-bg:#f4f5f6;
          --aw-panel:#fff;
          --aw-panel-2:#f7f8f9;
          --aw-line:#d9dee3;
          --aw-text:#171b1f;
          --aw-muted:#707a84;
          --aw-yellow:#e8b320;
          color-scheme:light
        }
        .ss-allworks *{box-sizing:border-box}
        .ss-allworks-shell{width:min(1180px,100%);margin:0 auto;padding:18px clamp(14px,3vw,34px) 42px}
        .ss-allworks-header{min-height:48px;display:grid;grid-template-columns:54px 1fr 54px;align-items:center}
        .ss-allworks-back{width:40px;height:40px;display:grid;place-items:center;padding:0;border:0;border-radius:50%;background:transparent;color:var(--aw-text);cursor:pointer;font-size:20px}
        .ss-allworks-back:hover{background:var(--aw-panel)}
        .ss-allworks-title{margin:0;text-align:center;font-size:22px;font-weight:800;letter-spacing:-.02em}
        .ss-allworks-search{position:relative;display:block;margin-top:14px}
        .ss-allworks-search i{position:absolute;top:50%;left:16px;transform:translateY(-50%);color:var(--aw-muted);font-size:15px;pointer-events:none}
        .ss-allworks-search input{width:100%;height:46px;padding:0 16px 0 44px;border:1px solid var(--aw-line);border-radius:23px;outline:0;background:var(--aw-panel-2);color:var(--aw-text);font:600 13px Inter,ui-sans-serif,system-ui,sans-serif}
        .ss-allworks-search input::placeholder{color:var(--aw-muted)}
        .ss-allworks-search input:focus{border-color:#697785}
        .ss-allworks-filters{display:flex;gap:8px;overflow-x:auto;margin-top:15px;padding:0 0 3px;scrollbar-width:none}
        .ss-allworks-filters::-webkit-scrollbar{display:none}
        .ss-allworks-filter{flex:none;min-height:34px;padding:0 15px;border:1px solid var(--aw-line);border-radius:18px;background:var(--aw-panel);color:var(--aw-muted);font:750 11px Inter,ui-sans-serif,system-ui,sans-serif;cursor:pointer}
        .ss-allworks-filter.active{border-color:#c99a18;background:rgba(255,201,52,.12);color:var(--aw-yellow)}
        .ss-allworks-count{margin:18px 0 11px;color:var(--aw-muted);font-size:10px;font-weight:700}
        .ss-allworks-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));align-items:start;gap:14px}
        .ss-allworks-card{min-width:0;overflow:hidden;border:1px solid var(--aw-line);border-radius:12px;background:var(--aw-panel);color:var(--aw-text);cursor:pointer}
        .ss-allworks-card:hover{border-color:#4b5864}
        .ss-allworks-thumb{position:relative;overflow:hidden;background:#141a20}
        .ss-allworks-card[data-shape=portrait] .ss-allworks-thumb{aspect-ratio:4/5}
        .ss-allworks-card[data-shape=landscape] .ss-allworks-thumb{aspect-ratio:4/3}
        .ss-allworks-card[data-shape=square] .ss-allworks-thumb{aspect-ratio:1/1}
        .ss-allworks-thumb img{width:100%;height:100%;display:block;object-fit:cover}
        .ss-allworks-thumb-empty{width:100%;height:100%;display:grid;place-items:center;color:#687480;font-size:30px}
        .ss-allworks-card-body{padding:10px 11px 11px}
        .ss-allworks-card-title-row{display:flex;align-items:center;gap:8px}
        .ss-allworks-card strong{min-width:0;flex:1;overflow:hidden;font-size:12px;font-weight:800;text-overflow:ellipsis;white-space:nowrap}
        .ss-allworks-card-more{color:var(--aw-muted);font-size:12px}
        .ss-allworks-card span{display:block;margin-top:3px;color:var(--aw-muted);font-size:9px}
        .ss-allworks-empty{min-height:150px;display:grid;place-items:center;padding:24px;border:1px dashed var(--aw-line);border-radius:13px;background:var(--aw-panel);color:var(--aw-muted);text-align:center;font-size:11px}
        .ss-allworks button:focus-visible,.ss-allworks input:focus-visible{outline:2px solid var(--aw-yellow);outline-offset:2px}
        @media(max-width:820px){.ss-allworks-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
        @media(max-width:600px){
          .ss-allworks-shell{padding:10px 10px 28px}
          .ss-allworks-header{grid-template-columns:44px 1fr 44px}
          .ss-allworks-title{font-size:18px}
          .ss-allworks-search{margin-top:8px}
          .ss-allworks-search input{height:42px}
          .ss-allworks-filters{margin-top:11px}
          .ss-allworks-filter{min-height:32px;padding:0 13px;font-size:10px}
          .ss-allworks-count{margin-top:14px}
          .ss-allworks-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
          .ss-allworks-card{border-radius:9px}
          .ss-allworks-card-body{padding:8px 8px 9px}
          .ss-allworks-card strong{font-size:10px}
          .ss-allworks-card span{font-size:8px}
        }
      `}</style>

      <main className="ss-allworks" data-theme={theme}>
        <div className="ss-allworks-shell">
          <header className="ss-allworks-header">
            <button type="button" className="ss-allworks-back" onClick={onBack} aria-label="Back">
              <i className="fa-solid fa-chevron-left" aria-hidden="true" />
            </button>
            <h1 className="ss-allworks-title">{tx('studioAllWorks.title')} ({documents.length})</h1>
            <span aria-hidden="true" />
          </header>

          <label className="ss-allworks-search">
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={tx('studioAllWorks.search')}
              aria-label={tx('studioAllWorks.search')}
            />
          </label>

          <div className="ss-allworks-filters" role="group" aria-label={tx('studioAllWorks.title')}>
            {filters.map(([value, label]) => (
              <button
                type="button"
                key={value}
                className={`ss-allworks-filter${filter === value ? ' active' : ''}`}
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="ss-allworks-count">{visibleWorks.length} / {documents.length}</div>

          {visibleWorks.length ? (
            <section className="ss-allworks-grid">
              {visibleWorks.map((document) => {
                const preview = previewOf(document)
                const shape = shapeOf(document)
                return (
                  <article
                    className="ss-allworks-card"
                    data-shape={shape}
                    key={document.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onOpenDocument?.(document)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        onOpenDocument?.(document)
                      }
                    }}
                  >
                    <div className="ss-allworks-thumb">
                      {preview ? (
                        <img src={preview} alt="" />
                      ) : (
                        <div className="ss-allworks-thumb-empty">
                          <i className="fa-regular fa-image" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <div className="ss-allworks-card-body">
                      <div className="ss-allworks-card-title-row">
                        <strong title={document.name}>{document.name || tx('studioAllWorks.untitled')}</strong>
                        <i className="fa-solid fa-ellipsis ss-allworks-card-more" aria-hidden="true" />
                      </div>
                      <span>{Number(document.width || 0).toLocaleString()} × {Number(document.height || 0).toLocaleString()}</span>
                      <span>{updatedLabel(document, tx('studioAllWorks.updatedNow'))}</span>
                    </div>
                  </article>
                )
              })}
            </section>
          ) : (
            <div className="ss-allworks-empty">{tx('studioAllWorks.empty')}</div>
          )}
        </div>
      </main>
    </>
  )
}
