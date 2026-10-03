import { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react'

function getTextNodes(root) {
  if (!root || typeof document === 'undefined') return []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const nodes = []
  let current = walker.nextNode()
  while (current) {
    nodes.push(current)
    current = walker.nextNode()
  }
  return nodes
}

function buildTextMap(root) {
  const nodes = getTextNodes(root)
  let offset = 0
  const map = nodes.map(node => {
    const start = offset
    offset += node.data.length
    return { node, start, end: offset }
  })
  return { text: nodes.map(node => node.data).join(''), map }
}

function findMatches(text, keyword, matchCase) {
  const source = String(text || '')
  const query = String(keyword || '')
  if (!query) return []
  const haystack = matchCase ? source : source.toLowerCase()
  const needle = matchCase ? query : query.toLowerCase()
  const matches = []
  let start = 0
  while (start <= haystack.length - needle.length) {
    const index = haystack.indexOf(needle, start)
    if (index < 0) break
    matches.push({ start: index, end: index + query.length })
    start = index + Math.max(1, query.length)
  }
  return matches
}

function pointFromOffset(map, offset, preferEnd = false) {
  if (!map.length) return null
  const entry = map.find(item =>
    preferEnd
      ? offset > item.start && offset <= item.end
      : offset >= item.start && offset < item.end
  ) || map[map.length - 1]
  return {
    node: entry.node,
    offset: Math.max(0, Math.min(entry.node.data.length, offset - entry.start)),
  }
}

function selectMatch(editor, match) {
  if (!editor || !match) return false
  const { map } = buildTextMap(editor)
  const startPoint = pointFromOffset(map, match.start)
  const endPoint = pointFromOffset(map, match.end, true)
  if (!startPoint || !endPoint) return false
  const range = document.createRange()
  range.setStart(startPoint.node, startPoint.offset)
  range.setEnd(endPoint.node, endPoint.offset)
  const selection = window.getSelection()
  if (!selection) return false
  selection.removeAllRanges()
  selection.addRange(range)
  editor.focus()
  return true
}

function replaceMatch(editor, match, replacement) {
  if (!editor || !match) return false
  const { map } = buildTextMap(editor)
  const startPoint = pointFromOffset(map, match.start)
  const endPoint = pointFromOffset(map, match.end, true)
  if (!startPoint || !endPoint) return false
  const range = document.createRange()
  range.setStart(startPoint.node, startPoint.offset)
  range.setEnd(endPoint.node, endPoint.offset)
  range.deleteContents()
  range.insertNode(document.createTextNode(String(replacement ?? '')))
  editor.normalize()
  return true
}

export default function ShadowDocsFindReplaceModal({
  open = false,
  editorRef,
  onClose,
  onChange,
  onMoreOptions,
}) {
  const [findText, setFindText] = useState('')
  const [replaceText, setReplaceText] = useState('')
  const [matchCase, setMatchCase] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [revision, setRevision] = useState(0)
  const [isFindComposing, setIsFindComposing] = useState(false)
  const [isReplaceComposing, setIsReplaceComposing] = useState(false)

  const editorText = useMemo(() => {
    if (!open || !editorRef?.current) return ''
    return buildTextMap(editorRef.current).text
  }, [editorRef, open, revision])

  const matches = useMemo(
    () => findMatches(editorText, findText, matchCase),
    [editorText, findText, matchCase]
  )

  if (!open) return null

  const currentIndex = matches.length ? Math.min(activeIndex, matches.length - 1) : 0
  const replaceDisabled = !matches.length || isFindComposing || isReplaceComposing

  function refresh() {
    onChange?.(editorRef.current?.innerHTML || '')
    window.getSelection()?.removeAllRanges()
    setRevision(value => value + 1)
  }

  function goToMatch(direction) {
    if (!matches.length || isFindComposing || isReplaceComposing) return
    const nextIndex = direction === 'next'
      ? (currentIndex + 1) % matches.length
      : (currentIndex - 1 + matches.length) % matches.length
    setActiveIndex(nextIndex)
    selectMatch(editorRef.current, matches[nextIndex])
  }

  function replaceCurrent() {
    const match = matches[currentIndex]
    if (!match || replaceDisabled || !replaceMatch(editorRef.current, match, replaceText)) return
    setActiveIndex(0)
    refresh()
  }

  function replaceAll() {
    if (replaceDisabled) return
    ;[...matches]
      .sort((first, second) => second.start - first.start)
      .forEach(match => replaceMatch(editorRef.current, match, replaceText))
    setActiveIndex(0)
    refresh()
  }

  return <div className="sd-find-replace-backdrop" role="presentation">
    <style>{`
      .sd-find-replace-backdrop{
        position:fixed;
        inset:0;
        z-index:19000;
        display:flex;
        align-items:flex-end;
        justify-content:center;
        background:rgba(0,0,0,.18)
      }
      .sd-find-replace-panel{
        width:min(100%,540px);
        border:1px solid #2e2e2e;
        border-bottom:0;
        border-radius:18px 18px 0 0;
        background:#151515;
        color:#f4f4f4;
        padding:16px 16px max(22px,env(safe-area-inset-bottom));
        font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif
      }
      .sd-find-replace-head{
        display:flex;
        align-items:center;
        gap:10px
      }
      .sd-find-replace-close{
        width:36px;
        height:36px;
        display:grid;
        place-items:center;
        border:0;
        border-radius:50%;
        background:transparent;
        color:#f4f4f4
      }
      .sd-find-replace-head strong{
        min-width:0;
        flex:1;
        font-size:15px;
        font-weight:750
      }
      .sd-find-replace-count{
        color:#8e8e8e;
        font-size:11px;
        font-weight:700
      }
      .sd-find-replace-fields{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:8px;
        margin-top:14px
      }
      .sd-find-replace-field{
        width:100%;
        height:44px;
        border:1px solid #343434;
        border-radius:10px;
        outline:0;
        background:#242424;
        color:#fff;
        padding:0 12px;
        font:inherit;
        font-size:14px
      }
      .sd-find-replace-field:focus{
        border-color:#25a884
      }
      .sd-find-replace-tools{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:8px;
        margin-top:12px
      }
      .sd-find-replace-case{
        min-height:36px;
        border:0;
        border-radius:999px;
        background:#252525;
        color:#bdbdbd;
        padding:0 13px;
        font:inherit;
        font-size:11px;
        font-weight:700
      }
      .sd-find-replace-case.is-active{
        background:#f2f2f2;
        color:#151515
      }
      .sd-find-replace-nav{
        display:flex;
        align-items:center;
        gap:3px
      }
      .sd-find-replace-nav button{
        width:36px;
        height:36px;
        display:grid;
        place-items:center;
        border:0;
        border-radius:50%;
        background:transparent;
        color:#f2f2f2
      }
      .sd-find-replace-nav button:disabled{
        opacity:.32
      }
      .sd-find-replace-actions{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:8px;
        margin-top:14px
      }
      .sd-find-replace-actions button{
        height:44px;
        border:0;
        border-radius:999px;
        font:inherit;
        font-size:12px;
        font-weight:750
      }
      .sd-find-replace-current{
        background:#292929;
        color:#f2f2f2
      }
      .sd-find-replace-all{
        background:#25a884;
        color:#fff
      }
      .sd-find-replace-actions button:disabled{
        opacity:.38
      }
      .sd-find-replace-more{
        display:block;
        margin:14px auto 0;
        border:0;
        background:transparent;
        color:#8f8f8f;
        padding:4px 10px;
        font:inherit;
        font-size:11px;
        font-weight:700
      }
      .sd-find-replace-more:active{
        color:#f3f3f3
      }
      @media(min-width:640px){
        .sd-find-replace-backdrop{
          align-items:center;
          padding:20px
        }
        .sd-find-replace-panel{
          border-bottom:1px solid #2e2e2e;
          border-radius:18px
        }
      }
    `}</style>

    <section className="sd-find-replace-panel" role="dialog" aria-modal="true" aria-label="Find and Replace">
      <header className="sd-find-replace-head">
        <button type="button" className="sd-find-replace-close" aria-label="Close find and replace" onClick={onClose}>
          <X size={18} />
        </button>
        <strong>Find & Replace</strong>
        <span className="sd-find-replace-count">
          {matches.length ? `${currentIndex + 1} / ${matches.length}` : '0 found'}
        </span>
      </header>

      <div className="sd-find-replace-fields">
        <div className="relative">
          <Search size={16} style={{ position:'absolute', left:12, top:14, color:'#888' }} />
          <input
            className="sd-find-replace-field"
            style={{ paddingLeft:36 }}
            value={findText}
            onChange={event => { setFindText(event.target.value); setActiveIndex(0) }}
            onCompositionStart={() => setIsFindComposing(true)}
            onCompositionEnd={event => {
              setIsFindComposing(false)
              setFindText(event.currentTarget.value)
              setActiveIndex(0)
            }}
            placeholder="Find"
            autoFocus
          />
        </div>

        <input
          className="sd-find-replace-field"
          value={replaceText}
          onChange={event => setReplaceText(event.target.value)}
          onCompositionStart={() => setIsReplaceComposing(true)}
          onCompositionEnd={event => {
            setIsReplaceComposing(false)
            setReplaceText(event.currentTarget.value)
          }}
          placeholder="Replace"
        />
      </div>

      <div className="sd-find-replace-tools">
        <button
          type="button"
          className={`sd-find-replace-case ${matchCase ? 'is-active' : ''}`}
          onClick={() => { setMatchCase(value => !value); setActiveIndex(0) }}
        >
          Match case
        </button>

        <div className="sd-find-replace-nav">
          <button type="button" aria-label="Previous match" disabled={!matches.length} onClick={() => goToMatch('previous')}>
            <ChevronUp size={18} />
          </button>
          <button type="button" aria-label="Next match" disabled={!matches.length} onClick={() => goToMatch('next')}>
            <ChevronDown size={18} />
          </button>
        </div>
      </div>

      <div className="sd-find-replace-actions">
        <button type="button" className="sd-find-replace-current" disabled={replaceDisabled} onClick={replaceCurrent}>
          Replace current
        </button>
        <button type="button" className="sd-find-replace-all" disabled={replaceDisabled} onClick={replaceAll}>
          Replace all
        </button>
      </div>

      <button type="button" className="sd-find-replace-more" onClick={onMoreOptions} disabled={!onMoreOptions}>
        More options
      </button>
    </section>
  </div>
}
