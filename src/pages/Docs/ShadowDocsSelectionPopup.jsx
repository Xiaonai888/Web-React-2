import { useEffect, useMemo, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Highlighter,
  Languages,
  MessageSquarePlus,
  MousePointer2,
  Paintbrush,
  ScanText,
  Scissors,
  Search,
  Share2,
  SpellCheck2,
  Type,
} from 'lucide-react'

const COMPACT_ACTIONS = [
  { id: 'select', label: 'Select', icon: MousePointer2 },
  { id: 'selectAll', label: 'Select all', icon: MousePointer2 },
  { id: 'scanText', label: 'Scan Text', icon: ScanText },
]

const EXPANDED_PAGES = [
  [
    { id: 'copy', label: 'Copy', icon: Copy },
    { id: 'cut', label: 'Cut', icon: Scissors },
    { id: 'selectAll', label: 'Select all', icon: MousePointer2 },
    { id: 'format', label: 'Format', icon: Type },
    { id: 'highlight', label: 'Highlight', icon: Highlighter },
  ],
  [
    { id: 'format', label: 'Format', icon: Type },
    { id: 'highlight', label: 'Highlight', icon: Highlighter },
    { id: 'copyFormat', label: 'Copy Formats', icon: Paintbrush },
    { id: 'comment', label: 'Comment', icon: MessageSquarePlus },
    { id: 'share', label: 'Share', icon: Share2 },
  ],
]

const COMMON_ACTIONS = [
  { id: 'search', label: 'Search', icon: Search },
  { id: 'translate', label: 'Translate', icon: Languages },
  { id: 'spellCheck', label: 'AI Spell Check', icon: SpellCheck2 },
]

function viewportBounds() {
  const viewport = globalThis.visualViewport
  const top = viewport?.offsetTop || 0
  const height = viewport?.height || globalThis.innerHeight || 0
  return { top, bottom: top + height }
}

function popupTop(anchor, mode) {
  const bounds = viewportBounds()
  const estimatedHeight = mode === 'compact' ? 150 : 182
  const fallback = Math.max(bounds.top + 12, Math.min(bounds.bottom - estimatedHeight - 12, bounds.top + 120))
  if (!anchor) return fallback

  const below = Number(anchor.bottom || 0) + 12
  if (below + estimatedHeight <= bounds.bottom - 12) return Math.max(bounds.top + 12, below)

  const above = Number(anchor.top || 0) - estimatedHeight - 12
  return Math.max(bounds.top + 12, Math.min(bounds.bottom - estimatedHeight - 12, above))
}

export default function ShadowDocsSelectionPopup({
  open = false,
  mode = 'expanded',
  anchor,
  onAction,
  onClose,
}) {
  const [page, setPage] = useState(0)

  useEffect(() => {
    if (!open || mode === 'compact') setPage(0)
  }, [open, mode])

  const top = useMemo(() => popupTop(anchor, mode), [anchor, mode, open])

  if (!open) return null

  const expanded = mode === 'expanded'
  const primaryActions = expanded ? EXPANDED_PAGES[page] : COMPACT_ACTIONS

  function action(id) {
    onAction?.(id)
  }

  return <div className="sd-selection-popup-layer" aria-hidden={!open}>
    <style>{`
      .sd-selection-popup-layer{
        position:fixed;
        inset:0;
        z-index:18800;
        pointer-events:none;
        font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif
      }
      .sd-selection-popup{
        position:fixed;
        left:50%;
        width:min(calc(100vw - 24px),490px);
        transform:translateX(-50%);
        overflow:hidden;
        border:1px solid #3a3a3a;
        border-radius:14px;
        background:#303030;
        color:#f1f1f1;
        box-shadow:0 10px 28px #0005;
        pointer-events:auto;
      }
      .sd-selection-popup-row{
        min-height:78px;
        display:grid;
        align-items:stretch;
        gap:0;
        padding:7px 8px;
      }
      .sd-selection-popup-row.is-compact{
        grid-template-columns:repeat(3,minmax(0,1fr));
      }
      .sd-selection-popup-row.is-expanded{
        grid-template-columns:repeat(5,minmax(0,1fr));
      }
      .sd-selection-popup-bottom{
        min-height:60px;
        display:grid;
        grid-template-columns:repeat(3,minmax(0,1fr)) 34px;
        align-items:stretch;
        border-top:1px solid #414141;
        padding:5px 6px;
      }
      .sd-selection-popup-bottom.is-compact{
        grid-template-columns:repeat(3,minmax(0,1fr));
      }
      .sd-selection-popup-tool{
        min-width:0;
        border:0;
        border-radius:10px;
        background:transparent;
        color:#f0f0f0;
        display:flex;
        align-items:center;
        justify-content:center;
        flex-direction:column;
        gap:5px;
        padding:6px 3px;
        font:inherit;
        font-size:10px;
        line-height:1.1;
        text-align:center;
      }
      .sd-selection-popup-tool:active{
        background:#424242;
      }
      .sd-selection-popup-tool svg{
        width:22px;
        height:22px;
        stroke-width:1.65;
        color:#dedede;
      }
      .sd-selection-popup-tool[data-action="highlight"] svg{
        color:#f6dc38;
      }
      .sd-selection-popup-tool[data-action="search"] svg,
      .sd-selection-popup-tool[data-action="translate"] svg,
      .sd-selection-popup-tool[data-action="spellCheck"] svg{
        color:#bf84ff;
      }
      .sd-selection-popup-tool span{
        max-width:100%;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
      .sd-selection-popup-page{
        width:34px;
        border:0;
        border-radius:9px;
        background:transparent;
        color:#b7b7b7;
        display:grid;
        place-items:center;
      }
      .sd-selection-popup-page:active{
        background:#424242;
      }
      .sd-selection-popup-close-zone{
        position:fixed;
        inset:0;
        z-index:-1;
        pointer-events:auto;
        background:transparent;
        border:0;
      }
      @media(min-width:701px){
        .sd-selection-popup-layer{display:none}
      }
    `}</style>

    <button type="button" className="sd-selection-popup-close-zone" aria-label="Close selection menu" onPointerDown={event => event.preventDefault()} onClick={onClose} />

    <section
      className="sd-selection-popup"
      role="menu"
      aria-label="Selection actions"
      style={{ top: `${top}px` }}
      onPointerDown={event => event.preventDefault()}
    >
      <div className={`sd-selection-popup-row ${expanded ? 'is-expanded' : 'is-compact'}`}>
        {primaryActions.map(item => {
          const Icon = item.icon
          return <button
            key={item.id}
            type="button"
            role="menuitem"
            className="sd-selection-popup-tool"
            data-action={item.id}
            onPointerDown={event => event.preventDefault()}
            onClick={() => action(item.id)}
          >
            <Icon />
            <span>{item.label}</span>
          </button>
        })}
      </div>

      <div className={`sd-selection-popup-bottom ${expanded ? '' : 'is-compact'}`}>
        {COMMON_ACTIONS.map(item => {
          const Icon = item.icon
          return <button
            key={item.id}
            type="button"
            role="menuitem"
            className="sd-selection-popup-tool"
            data-action={item.id}
            onPointerDown={event => event.preventDefault()}
            onClick={() => action(item.id)}
          >
            <Icon />
            <span>{item.label}</span>
          </button>
        })}

        {expanded ? <button
          type="button"
          className="sd-selection-popup-page"
          aria-label={page === 0 ? 'More selection actions' : 'Previous selection actions'}
          onPointerDown={event => event.preventDefault()}
          onClick={() => setPage(value => value === 0 ? 1 : 0)}
        >
          {page === 0 ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button> : null}
      </div>
    </section>
  </div>
}
