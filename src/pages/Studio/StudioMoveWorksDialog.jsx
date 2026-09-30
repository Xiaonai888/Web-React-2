import { useEffect, useMemo, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('studioMoveWorks', {
  en: { title: 'Move Works', close: 'Close', selectWorks: 'Select works', destination: 'Move to folder', selected: 'selected', move: 'Move', cancel: 'Cancel', noWorks: 'No works available.', noFolders: 'Create a folder first before moving works.', untitled: 'Untitled' },
  km: { title: 'ផ្លាស់ទីការងារ', close: 'បិទ', selectWorks: 'ជ្រើសរើសការងារ', destination: 'ផ្លាស់ទីទៅ Folder', selected: 'បានជ្រើស', move: 'ផ្លាស់ទី', cancel: 'បោះបង់', noWorks: 'មិនមានការងារសម្រាប់ជ្រើសទេ។', noFolders: 'សូមបង្កើត Folder មុនពេលផ្លាស់ទីការងារ។', untitled: 'គ្មានចំណងជើង' },
  zh: { title: '移动作品', close: '关闭', selectWorks: '选择作品', destination: '移动到文件夹', selected: '已选择', move: '移动', cancel: '取消', noWorks: '没有可选择的作品。', noFolders: '请先创建文件夹再移动作品。', untitled: '未命名' },
  ja: { title: '作品を移動', close: '閉じる', selectWorks: '作品を選択', destination: '移動先フォルダ', selected: '選択中', move: '移動', cancel: 'キャンセル', noWorks: '選択できる作品がありません。', noFolders: '作品を移動する前にフォルダを作成してください。', untitled: '無題' },
  ko: { title: '작업 이동', close: '닫기', selectWorks: '작업 선택', destination: '폴더로 이동', selected: '선택됨', move: '이동', cancel: '취소', noWorks: '선택할 작업이 없습니다.', noFolders: '작업을 이동하기 전에 폴더를 먼저 만드세요.', untitled: '제목 없음' },
})

const THEME_KEY = 'shadow-studio-home-theme-v1'

function readTheme() {
  try {
    return window.localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
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

export default function StudioMoveWorksDialog({ open, documents = [], folders = [], assignments = {}, onClose, onMove }) {
  const { t: tx } = useDisplayTranslation()
  const [theme] = useState(readTheme)
  const [selectedIds, setSelectedIds] = useState([])
  const [folderId, setFolderId] = useState('')
  const [previewUrls, setPreviewUrls] = useState({})

  useEffect(() => {
    if (!open) return
    setSelectedIds([])
    setFolderId(folders[0]?.id || '')
  }, [open, folders])

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

  const selected = useMemo(() => new Set(selectedIds), [selectedIds])

  if (!open) return null

  function previewOf(document) {
    if (typeof document?.thumbnail === 'string' && document.thumbnail) return document.thumbnail
    if (typeof document?.preview === 'string' && document.preview) return document.preview
    if (typeof document?.image === 'string' && document.image) return document.image
    return previewUrls[document?.id] || ''
  }

  function toggle(documentId) {
    setSelectedIds((current) => current.includes(documentId) ? current.filter((id) => id !== documentId) : [...current, documentId])
  }

  function submit() {
    if (!selectedIds.length || !folderId) return
    onMove?.(selectedIds, folderId)
  }

  return (
    <div className="ss-move-works-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose?.() }}>
      <style>{`
        .ss-move-works-backdrop{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:16px;background:rgba(0,0,0,.68);backdrop-filter:blur(6px)}
        .ss-move-works{--mw-bg:#10151a;--mw-panel:#171d23;--mw-line:#2e3842;--mw-text:#f6f7f8;--mw-muted:#8f9aa5;--mw-yellow:#ffc934;width:min(760px,100%);max-height:min(760px,92dvh);display:flex;flex-direction:column;overflow:hidden;border:1px solid #46515c;border-radius:16px;background:var(--mw-bg);color:var(--mw-text);box-shadow:0 26px 80px rgba(0,0,0,.58);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color-scheme:dark}
        .ss-move-works[data-theme=light]{--mw-bg:#f5f6f7;--mw-panel:#fff;--mw-line:#d7dde2;--mw-text:#171b1f;--mw-muted:#707a84;--mw-yellow:#dca710;color-scheme:light}
        .ss-move-works *{box-sizing:border-box}
        .ss-move-works-head{height:58px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 17px;border-bottom:1px solid var(--mw-line)}
        .ss-move-works-head h2{margin:0;font-size:17px;font-weight:850}
        .ss-move-works-x{width:36px;height:36px;display:grid;place-items:center;border:0;border-radius:50%;background:transparent;color:var(--mw-text);cursor:pointer;font-size:17px}
        .ss-move-works-x:hover{background:var(--mw-panel)}
        .ss-move-works-body{min-height:0;overflow:auto;padding:16px}
        .ss-move-works-label{display:block;margin:0 0 10px;color:var(--mw-muted);font-size:10px;font-weight:850;text-transform:uppercase;letter-spacing:.06em}
        .ss-move-works-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
        .ss-move-work{position:relative;min-width:0;overflow:hidden;padding:0;border:1px solid var(--mw-line);border-radius:11px;background:var(--mw-panel);color:var(--mw-text);text-align:left;cursor:pointer}
        .ss-move-work[data-selected=true]{border-color:var(--mw-yellow);box-shadow:0 0 0 2px rgba(255,201,52,.14)}
        .ss-move-work-thumb{position:relative;overflow:hidden;background:#141a20;aspect-ratio:1/1}
        .ss-move-work-thumb img{width:100%;height:100%;display:block;object-fit:cover}
        .ss-move-work-empty{width:100%;height:100%;display:grid;place-items:center;color:#687480;font-size:26px}
        .ss-move-work-check{position:absolute;z-index:2;top:7px;right:7px;width:24px;height:24px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.45);border-radius:50%;background:rgba(10,13,16,.72);color:transparent;font-size:12px}
        .ss-move-work[data-selected=true] .ss-move-work-check{border-color:var(--mw-yellow);background:var(--mw-yellow);color:#151515}
        .ss-move-work-copy{padding:8px 9px 9px}
        .ss-move-work-copy strong{display:block;overflow:hidden;font-size:10px;font-weight:800;text-overflow:ellipsis;white-space:nowrap}
        .ss-move-work-copy small{display:block;margin-top:3px;color:var(--mw-muted);font-size:8px}
        .ss-move-works-empty{min-height:110px;display:grid;place-items:center;padding:20px;border:1px dashed var(--mw-line);border-radius:11px;background:var(--mw-panel);color:var(--mw-muted);font-size:11px;text-align:center}
        .ss-move-works-destination{margin-top:17px;padding-top:15px;border-top:1px solid var(--mw-line)}
        .ss-move-works-folders{display:flex;gap:8px;overflow-x:auto;padding-bottom:3px;scrollbar-width:thin}
        .ss-move-folder{flex:none;min-width:132px;max-width:210px;display:flex;align-items:center;gap:8px;padding:10px 12px;border:1px solid var(--mw-line);border-radius:10px;background:var(--mw-panel);color:var(--mw-text);cursor:pointer;text-align:left}
        .ss-move-folder[data-active=true]{border-color:var(--mw-yellow);background:rgba(255,201,52,.1)}
        .ss-move-folder i{color:var(--mw-yellow);font-size:16px}
        .ss-move-folder span{min-width:0;overflow:hidden;font-size:10px;font-weight:800;text-overflow:ellipsis;white-space:nowrap}
        .ss-move-works-actions{display:flex;align-items:center;gap:9px;padding:13px 16px;border-top:1px solid var(--mw-line)}
        .ss-move-works-count{margin-right:auto;color:var(--mw-muted);font-size:10px;font-weight:700}
        .ss-move-works-btn{min-height:36px;padding:0 16px;border:1px solid var(--mw-line);border-radius:9px;background:var(--mw-panel);color:var(--mw-text);font:800 11px Inter,ui-sans-serif,system-ui,sans-serif;cursor:pointer}
        .ss-move-works-btn.primary{border-color:#d9a60c;background:var(--mw-yellow);color:#151515}
        .ss-move-works-btn:disabled{opacity:.4;cursor:default}
        .ss-move-works button:focus-visible{outline:2px solid var(--mw-yellow);outline-offset:2px}
        @media(max-width:620px){.ss-move-works-backdrop{padding:8px}.ss-move-works{max-height:94dvh;border-radius:13px}.ss-move-works-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ss-move-works-body{padding:12px}.ss-move-folder{min-width:116px}.ss-move-works-actions{padding:11px 12px}}
      `}</style>

      <section className="ss-move-works" data-theme={theme} role="dialog" aria-modal="true" aria-label={tx('studioMoveWorks.title')}>
        <header className="ss-move-works-head">
          <h2>{tx('studioMoveWorks.title')}</h2>
          <button type="button" className="ss-move-works-x" onClick={onClose} aria-label={tx('studioMoveWorks.close')}><i className="fa-solid fa-xmark" aria-hidden="true" /></button>
        </header>

        <div className="ss-move-works-body">
          <span className="ss-move-works-label">{tx('studioMoveWorks.selectWorks')}</span>
          {documents.length ? (
            <div className="ss-move-works-grid">
              {documents.map((document) => {
                const preview = previewOf(document)
                const assignedFolder = folders.find((folder) => folder.id === assignments[document.id])
                return (
                  <button type="button" className="ss-move-work" data-selected={selected.has(document.id)} key={document.id} onClick={() => toggle(document.id)}>
                    <span className="ss-move-work-thumb">
                      <span className="ss-move-work-check"><i className="fa-solid fa-check" aria-hidden="true" /></span>
                      {preview ? <img src={preview} alt="" /> : <span className="ss-move-work-empty"><i className="fa-regular fa-image" aria-hidden="true" /></span>}
                    </span>
                    <span className="ss-move-work-copy"><strong>{document.name || tx('studioMoveWorks.untitled')}</strong><small>{assignedFolder?.name || `${shapeOf(document)} · ${Number(document.width || 0)}×${Number(document.height || 0)}`}</small></span>
                  </button>
                )
              })}
            </div>
          ) : <div className="ss-move-works-empty">{tx('studioMoveWorks.noWorks')}</div>}

          <div className="ss-move-works-destination">
            <span className="ss-move-works-label">{tx('studioMoveWorks.destination')}</span>
            {folders.length ? (
              <div className="ss-move-works-folders">
                {folders.map((folder) => (
                  <button type="button" className="ss-move-folder" data-active={folderId === folder.id} key={folder.id} onClick={() => setFolderId(folder.id)}>
                    <i className="fa-solid fa-folder" aria-hidden="true" /><span>{folder.name}</span>
                  </button>
                ))}
              </div>
            ) : <div className="ss-move-works-empty">{tx('studioMoveWorks.noFolders')}</div>}
          </div>
        </div>

        <footer className="ss-move-works-actions">
          <span className="ss-move-works-count">{selectedIds.length} {tx('studioMoveWorks.selected')}</span>
          <button type="button" className="ss-move-works-btn" onClick={onClose}>{tx('studioMoveWorks.cancel')}</button>
          <button type="button" className="ss-move-works-btn primary" disabled={!selectedIds.length || !folderId} onClick={submit}>{tx('studioMoveWorks.move')}</button>
        </footer>
      </section>
    </div>
  )
}
