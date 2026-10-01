import {
  Archive,
  ChevronRight,
  FileArchive,
  FileImage,
  FileKey2,
  FileOutput,
  FilePenLine,
  FileText,
  FolderPlus,
  Info,
  Printer,
  Search,
  Share2,
  X,
} from 'lucide-react'

const ACTION_GROUPS = [
  [
    { id: 'rename', label: 'Rename', icon: FilePenLine },
    { id: 'addTo', label: 'Add To', icon: FolderPlus, chevron: true },
  ],
  [
    { id: 'exportPdf', label: 'Export as PDF', icon: FileOutput },
    { id: 'exportImage', label: 'Export as Image', icon: FileImage },
    { id: 'conversion', label: 'More Conversion Options', detail: 'Merge, Compress', icon: FileArchive, chevron: true },
  ],
  [
    { id: 'versionHistory', label: 'Version History', icon: Archive, chevron: true },
    { id: 'encrypt', label: 'Encrypt Document', icon: FileKey2, chevron: true },
    { id: 'information', label: 'Document Information', icon: Info, chevron: true },
  ],
]

const QUICK_ACTIONS = [
  { id: 'saveAs', label: 'Save As', icon: FileText },
  { id: 'findReplace', label: 'Find and Replace', icon: Search },
  { id: 'share', label: 'Share', icon: Share2 },
  { id: 'print', label: 'Print', icon: Printer },
]

function runAction(action, onAction, onClose) {
  if (typeof onAction !== 'function') return
  onAction(action)
  onClose?.()
}

export default function ShadowDocsMobileMenu({
  open = false,
  documentName = 'Docs.doc',
  wordCount = 0,
  sizeText = '',
  onClose,
  onAction,
}) {
  if (!open) return null

  const safeName = String(documentName || 'Docs.doc').trim() || 'Docs.doc'
  const safeWords = Math.max(0, Math.round(Number(wordCount) || 0))
  const safeSize = String(sizeText || '').trim()
  const meta = `Words: ${safeWords}${safeSize ? `  |  Size: ${safeSize}` : ''}`

  return (
    <div
      className="sd-mobile-doc-menu-backdrop"
      role="presentation"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose?.()
      }}
    >
      <style>{`
        .sd-mobile-doc-menu-backdrop{
          position:fixed;
          inset:0;
          z-index:16000;
          display:flex;
          align-items:flex-end;
          justify-content:center;
          background:rgba(0,0,0,.10);
          backdrop-filter:blur(0.5px);
          -webkit-backdrop-filter:blur(0.5px)
        }
        .sd-mobile-doc-menu{
          width:min(100%,620px);
          max-height:min(88dvh,900px);
          overflow:hidden;
          border:1px solid #343434;
          border-bottom:0;
          border-radius:20px 20px 0 0;
          background:#151515;
          color:#f2f2f2;
          box-shadow:0 -20px 50px rgba(0,0,0,.52);
          font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif
        }
        .sd-mobile-doc-menu *{box-sizing:border-box}
        .sd-mobile-doc-menu-handle{
          width:46px;
          height:4px;
          margin:8px auto 6px;
          border-radius:99px;
          background:#2b2b2b
        }
        .sd-mobile-doc-menu-scroll{
          max-height:calc(min(88dvh,900px) - 18px);
          overflow-y:auto;
          padding:4px 16px max(18px,env(safe-area-inset-bottom));
          overscroll-behavior:contain;
          scrollbar-width:none
        }
        .sd-mobile-doc-menu-scroll::-webkit-scrollbar{display:none}
        .sd-mobile-doc-menu-file{
          display:grid;
          grid-template-columns:42px minmax(0,1fr) 36px;
          gap:12px;
          align-items:center;
          min-height:70px;
          padding:8px 0 10px
        }
        .sd-mobile-doc-menu-logo{
          position:relative;
          width:40px;
          height:40px;
          display:grid;
          place-items:center;
          overflow:hidden;
          border-radius:8px;
          background:linear-gradient(145deg,#2b7cff,#1057df);
          color:#fff;
          font-family:Arial,sans-serif;
          font-size:23px;
          font-weight:900;
          letter-spacing:-1px;
          box-shadow:inset 0 0 0 1px rgba(255,255,255,.18),0 4px 12px rgba(0,79,208,.28)
        }
        .sd-mobile-doc-menu-logo::before{
          content:'';
          position:absolute;
          inset:0 auto 0 0;
          width:11px;
          background:rgba(255,255,255,.12)
        }
        .sd-mobile-doc-menu-logo span{position:relative;z-index:1}
        .sd-mobile-doc-menu-title{min-width:0}
        .sd-mobile-doc-menu-title strong{
          display:block;
          overflow:hidden;
          color:#f5f5f5;
          font-size:18px;
          font-weight:500;
          line-height:1.25;
          text-overflow:ellipsis;
          white-space:nowrap
        }
        .sd-mobile-doc-menu-title small{
          display:block;
          margin-top:2px;
          overflow:hidden;
          color:#828282;
          font-size:11px;
          line-height:1.25;
          text-overflow:ellipsis;
          white-space:nowrap
        }
        .sd-mobile-doc-menu-close{
          width:36px;
          height:36px;
          display:grid;
          place-items:center;
          border:0;
          border-radius:50%;
          background:transparent;
          color:#e3e3e3;
          cursor:pointer
        }
        .sd-mobile-doc-menu-close:active{background:#292929}
        .sd-mobile-doc-menu-quick{
          display:grid;
          grid-template-columns:repeat(4,minmax(0,1fr));
          gap:10px;
          margin-bottom:12px
        }
        .sd-mobile-doc-menu-quick button{
          min-width:0;
          min-height:104px;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          gap:10px;
          border:0;
          border-radius:13px;
          background:#292929;
          color:#f1f1f1;
          padding:10px 5px;
          font:inherit;
          cursor:pointer;
          transition:background 120ms ease,transform 120ms ease
        }
        .sd-mobile-doc-menu-quick button:active{
          transform:scale(.98);
          background:#343434
        }
        .sd-mobile-doc-menu-quick svg{
          width:27px;
          height:27px;
          stroke-width:1.7
        }
        .sd-mobile-doc-menu-quick span{
          max-width:100%;
          color:#e9e9e9;
          font-size:12px;
          line-height:1.25;
          text-align:center
        }
        .sd-mobile-doc-menu-group{
          overflow:hidden;
          margin-top:10px;
          border-radius:13px;
          background:#292929
        }
        .sd-mobile-doc-menu-row{
          width:100%;
          min-height:65px;
          display:grid;
          grid-template-columns:34px minmax(0,1fr) auto;
          gap:12px;
          align-items:center;
          border:0;
          border-bottom:1px solid #373737;
          background:transparent;
          color:#ededed;
          padding:8px 14px 8px 18px;
          font:inherit;
          text-align:left;
          cursor:pointer
        }
        .sd-mobile-doc-menu-row:last-child{border-bottom:0}
        .sd-mobile-doc-menu-row:active{background:#333}
        .sd-mobile-doc-menu-row>svg:first-child{
          width:25px;
          height:25px;
          color:#e1e1e1;
          stroke-width:1.65
        }
        .sd-mobile-doc-menu-row-copy{min-width:0}
        .sd-mobile-doc-menu-row-copy strong{
          display:block;
          overflow:hidden;
          color:#ededed;
          font-size:14px;
          font-weight:450;
          line-height:1.3;
          text-overflow:ellipsis;
          white-space:nowrap
        }
        .sd-mobile-doc-menu-row-copy small{
          display:block;
          margin-top:2px;
          overflow:hidden;
          color:#858585;
          font-size:10px;
          line-height:1.25;
          text-overflow:ellipsis;
          white-space:nowrap
        }
        .sd-mobile-doc-menu-row-chevron{
          width:18px;
          height:18px;
          color:#676767
        }
        .sd-mobile-doc-menu-row-space{
          width:18px;
          height:18px
        }
        @media(max-width:420px){
          .sd-mobile-doc-menu-scroll{
            padding-left:12px;
            padding-right:12px
          }
          .sd-mobile-doc-menu-quick{gap:7px}
          .sd-mobile-doc-menu-quick button{min-height:94px}
          .sd-mobile-doc-menu-quick span{font-size:10px}
          .sd-mobile-doc-menu-row{
            min-height:60px;
            padding-left:14px
          }
        }
      `}</style>

      <section className="sd-mobile-doc-menu" role="dialog" aria-modal="true" aria-label="Document menu">
        <div className="sd-mobile-doc-menu-handle" aria-hidden="true" />
        <div className="sd-mobile-doc-menu-scroll">
          <header className="sd-mobile-doc-menu-file">
            <div className="sd-mobile-doc-menu-logo" aria-hidden="true"><span>W</span></div>
            <div className="sd-mobile-doc-menu-title">
              <strong>{safeName}</strong>
              <small>{meta}</small>
            </div>
            <button type="button" className="sd-mobile-doc-menu-close" aria-label="Close menu" onClick={onClose}>
              <X size={25} strokeWidth={1.7} />
            </button>
          </header>

          <div className="sd-mobile-doc-menu-quick">
            {QUICK_ACTIONS.map(item => {
              const Icon = item.icon
              return (
                <button type="button" key={item.id} onClick={() => runAction(item.id, onAction, onClose)}>
                  <Icon aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>

          {ACTION_GROUPS.map((group, groupIndex) => (
            <div className="sd-mobile-doc-menu-group" key={`group-${groupIndex}`}>
              {group.map(item => {
                const Icon = item.icon
                return (
                  <button
                    type="button"
                    className="sd-mobile-doc-menu-row"
                    key={item.id}
                    onClick={() => runAction(item.id, onAction, onClose)}
                  >
                    <Icon aria-hidden="true" />
                    <span className="sd-mobile-doc-menu-row-copy">
                      <strong>{item.label}</strong>
                      {item.detail ? <small>{item.detail}</small> : null}
                    </span>
                    {item.chevron
                      ? <ChevronRight className="sd-mobile-doc-menu-row-chevron" aria-hidden="true" />
                      : <span className="sd-mobile-doc-menu-row-space" aria-hidden="true" />}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
