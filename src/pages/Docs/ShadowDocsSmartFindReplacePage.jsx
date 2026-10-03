import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, CircleHelp } from 'lucide-react'

const WORD_CHAR_REGEX = /[\p{L}\p{M}\p{N}_]/u

function escapeRegExp(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function isWordChar(value) {
  return Boolean(value) && WORD_CHAR_REGEX.test(value)
}

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

  return {
    text: nodes.map(node => node.data).join(''),
    map,
  }
}

function pointFromOffset(map, offset, preferEnd = false) {
  if (!map.length) return null

  const entry =
    map.find(item =>
      preferEnd
        ? offset > item.start && offset <= item.end
        : offset >= item.start && offset < item.end
    ) || map[map.length - 1]

  return {
    node: entry.node,
    offset: Math.max(0, Math.min(entry.node.data.length, offset - entry.start)),
  }
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

function getTokenAt(text, start, end) {
  const source = String(text || '')
  let left = start
  let right = end

  while (left > 0 && isWordChar(source[left - 1])) left -= 1
  while (right < source.length && isWordChar(source[right])) right += 1

  return source.slice(left, right)
}

function getContext(text, start, end) {
  const source = String(text || '')
  return {
    before: source.slice(Math.max(0, start - 42), start),
    match: source.slice(start, end),
    after: source.slice(end, Math.min(source.length, end + 42)),
  }
}

function buildMatches(text, findText, matchCase) {
  const source = String(text || '')
  const keyword = String(findText || '')
  if (!keyword) return { safe: [], risky: [], ignored: [] }

  const regex = new RegExp(escapeRegExp(keyword), matchCase ? 'gu' : 'giu')
  const safe = []
  const risky = []
  const ignoredMap = new Map()

  Array.from(source.matchAll(regex)).forEach((match, index) => {
    const start = match.index ?? 0
    const end = start + match[0].length
    const before = source[start - 1] || ''
    const after = source[end] || ''
    const item = {
      id: `${start}-${end}-${index}`,
      start,
      end,
      value: match[0],
      context: getContext(source, start, end),
    }

    if (!isWordChar(before) && !isWordChar(after)) {
      safe.push(item)
      return
    }

    risky.push(item)

    const token = getTokenAt(source, start, end)
    if (token && token !== match[0]) {
      ignoredMap.set(token, (ignoredMap.get(token) || 0) + 1)
    }
  })

  const ignored = Array.from(ignoredMap.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))

  return { safe, risky, ignored }
}

export default function ShadowDocsSmartFindReplacePage({
  open = false,
  editorRef,
  onBack,
  onChange,
}) {
  const [findText, setFindText] = useState('')
  const [replaceText, setReplaceText] = useState('')
  const [matchCase, setMatchCase] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedIds, setSelectedIds] = useState([])
  const [lastHtml, setLastHtml] = useState('')
  const [revision, setRevision] = useState(0)
  const [isFindComposing, setIsFindComposing] = useState(false)
  const [isReplaceComposing, setIsReplaceComposing] = useState(false)
  const [hintOpen, setHintOpen] = useState(false)
  const itemRefs = useRef(new Map())

  const editorText = useMemo(() => {
    if (!open || !editorRef?.current) return ''
    return buildTextMap(editorRef.current).text
  }, [editorRef, open, revision])

  const result = useMemo(
    () => buildMatches(editorText, findText, matchCase),
    [editorText, findText, matchCase]
  )

  const reviewItems = useMemo(
    () => [...result.safe, ...result.risky],
    [result.safe, result.risky]
  )

  const selectedMatches = useMemo(
    () => reviewItems.filter(item => selectedIds.includes(item.id)),
    [reviewItems, selectedIds]
  )

  useEffect(() => {
    setActiveIndex(0)
    setSelectedIds(result.safe.map(item => item.id))
  }, [findText, matchCase, result.safe])

  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!open) return null

  const currentIndex = reviewItems.length
    ? Math.min(activeIndex, reviewItems.length - 1)
    : 0

  const activeMatch = reviewItems[currentIndex] || null
  const compositionActive = isFindComposing || isReplaceComposing

  function refresh() {
    onChange?.(editorRef.current?.innerHTML || '')
    window.getSelection()?.removeAllRanges()
    setRevision(value => value + 1)
  }

  function scrollToItem(index) {
    window.setTimeout(() => {
      itemRefs.current.get(index)?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }, 0)
  }

  function goToMatch(direction) {
    if (!reviewItems.length || compositionActive) return

    const nextIndex =
      direction === 'next'
        ? (currentIndex + 1) % reviewItems.length
        : (currentIndex - 1 + reviewItems.length) % reviewItems.length

    setActiveIndex(nextIndex)
    scrollToItem(nextIndex)
  }

  function replaceCurrent() {
    if (!activeMatch || compositionActive || !editorRef?.current) return

    setLastHtml(editorRef.current.innerHTML)
    if (!replaceMatch(editorRef.current, activeMatch, replaceText)) return

    setActiveIndex(0)
    refresh()
  }

  function replaceSelected() {
    if (!selectedMatches.length || compositionActive || !editorRef?.current) return

    setLastHtml(editorRef.current.innerHTML)

    const ordered = [...selectedMatches].sort(
      (first, second) => second.start - first.start
    )

    ordered.forEach(match => replaceMatch(editorRef.current, match, replaceText))

    setActiveIndex(0)
    refresh()
  }

  function undoReplace() {
    if (!lastHtml || !editorRef?.current) return

    editorRef.current.innerHTML = lastHtml
    onChange?.(lastHtml)
    window.getSelection()?.removeAllRanges()
    setLastHtml('')
    setActiveIndex(0)
    setRevision(value => value + 1)
  }

  function toggleSelected(id) {
    setSelectedIds(current =>
      current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id]
    )
  }

  return <div className="sd-smart-replace-page">
    <style>{`
      .sd-smart-replace-page{
        position:fixed;
        inset:0;
        z-index:20000;
        display:flex;
        flex-direction:column;
        background:#111214;
        color:#f5f5f6;
        font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif
      }
      .sd-smart-replace-page *{box-sizing:border-box}
      .sd-smart-replace-head{
        position:relative;
        min-height:58px;
        display:grid;
        grid-template-columns:42px minmax(0,1fr) 42px;
        align-items:center;
        gap:8px;
        padding:0 12px;
        border-bottom:1px solid #2c2d31;
        background:#17181b
      }
      .sd-smart-replace-back,.sd-smart-replace-help{
        width:38px;
        height:38px;
        display:grid;
        place-items:center;
        border:0;
        border-radius:9px;
        background:transparent;
        color:#f1f1f2
      }
      .sd-smart-replace-head strong{
        font-size:16px;
        font-weight:800
      }
      .sd-smart-replace-hint{
        position:absolute;
        z-index:3;
        top:52px;
        right:14px;
        width:240px;
        padding:10px 12px;
        border:1px solid #36373c;
        border-radius:12px;
        background:#232428;
        color:#b9bac0;
        font-size:11px;
        line-height:1.55;
        box-shadow:0 12px 28px #0005
      }
      .sd-smart-replace-scroll{
        flex:1;
        overflow-y:auto;
        overscroll-behavior:contain;
        padding:16px 16px 94px
      }
      .sd-smart-replace-fields{
        display:grid;
        gap:12px
      }
      .sd-smart-replace-label{
        display:block;
        margin:0 0 6px 2px;
        color:#d7d7da;
        font-size:12px;
        font-weight:800
      }
      .sd-smart-replace-input{
        width:100%;
        height:48px;
        border:1px solid #34353a;
        border-radius:15px;
        outline:0;
        background:#1b1c1f;
        color:#f5f5f6;
        padding:0 14px;
        font:inherit;
        font-size:14px;
        font-weight:650
      }
      .sd-smart-replace-input:focus{
        border-color:#25a884;
        background:#202125
      }
      .sd-smart-replace-badges{
        display:flex;
        flex-wrap:wrap;
        align-items:center;
        gap:7px;
        margin-top:12px
      }
      .sd-smart-replace-pill{
        border:0;
        border-radius:999px;
        padding:8px 11px;
        font:inherit;
        font-size:10px;
        font-weight:800
      }
      .sd-smart-replace-case{
        background:#26272b;
        color:#bdbec4
      }
      .sd-smart-replace-case.is-active{
        background:#f0f0f1;
        color:#141518
      }
      .sd-smart-replace-safe{
        background:#123b2e;
        color:#65d7a5
      }
      .sd-smart-replace-risk{
        background:#453716;
        color:#f3c561
      }
      .sd-smart-replace-count{
        background:#27282c;
        color:#bfc0c5
      }
      .sd-smart-replace-similar{
        margin-top:12px;
        padding:12px;
        border-radius:15px;
        background:#382f18;
        color:#e7c46c
      }
      .sd-smart-replace-similar strong{
        display:block;
        color:#f1dfaa;
        font-size:11px
      }
      .sd-smart-replace-similar div{
        display:flex;
        flex-wrap:wrap;
        gap:6px;
        margin-top:8px
      }
      .sd-smart-replace-similar span{
        max-width:100%;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        border-radius:999px;
        background:#1e1f22;
        padding:6px 9px;
        font-size:10px;
        font-weight:750
      }
      .sd-smart-replace-actions{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:8px;
        margin-top:13px
      }
      .sd-smart-replace-actions button{
        height:42px;
        border:1px solid #35363b;
        border-radius:999px;
        background:#1c1d20;
        color:#f1f1f2;
        font:inherit;
        font-size:11px;
        font-weight:800
      }
      .sd-smart-replace-actions .is-primary{
        border-color:#25a884;
        background:#25a884;
        color:#fff
      }
      .sd-smart-replace-actions button:disabled{
        opacity:.38
      }
      .sd-smart-replace-review{
        margin-top:14px;
        overflow:hidden;
        border:1px solid #303136;
        border-radius:18px;
        background:#1a1b1e
      }
      .sd-smart-replace-review-head{
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:10px;
        padding:12px 13px;
        border-bottom:1px solid #303136
      }
      .sd-smart-replace-review-head strong{
        display:block;
        font-size:12px
      }
      .sd-smart-replace-review-head small{
        display:block;
        margin-top:3px;
        color:#85868d;
        font-size:9px;
        line-height:1.45
      }
      .sd-smart-replace-review-tools{
        flex:none;
        text-align:right
      }
      .sd-smart-replace-review-tools span{
        display:block;
        color:#a4a5aa;
        font-size:9px;
        font-weight:750
      }
      .sd-smart-replace-review-tools div{
        display:flex;
        gap:5px;
        margin-top:5px
      }
      .sd-smart-replace-review-tools button{
        border:0;
        border-radius:999px;
        background:#292a2e;
        color:#babcc1;
        padding:5px 8px;
        font:inherit;
        font-size:9px;
        font-weight:800
      }
      .sd-smart-replace-review-tools .is-safe{
        background:#123b2e;
        color:#65d7a5
      }
      .sd-smart-replace-list{
        max-height:330px;
        overflow-y:auto;
        padding:8px
      }
      .sd-smart-replace-empty{
        padding:34px 12px;
        text-align:center;
        color:#74757b;
        font-size:11px;
        font-weight:700
      }
      .sd-smart-replace-item{
        width:100%;
        margin-bottom:7px;
        border:1px solid #303136;
        border-radius:14px;
        background:#212226;
        color:#e8e8ea;
        padding:11px;
        text-align:left
      }
      .sd-smart-replace-item.is-active{
        border-color:#25a884
      }
      .sd-smart-replace-item-row{
        display:flex;
        align-items:flex-start;
        gap:10px
      }
      .sd-smart-replace-item input{
        margin-top:3px;
        accent-color:#25a884
      }
      .sd-smart-replace-item-copy{
        min-width:0;
        flex:1
      }
      .sd-smart-replace-item-top{
        display:flex;
        align-items:center;
        gap:6px;
        margin-bottom:6px
      }
      .sd-smart-replace-item-tag{
        border-radius:999px;
        padding:4px 7px;
        font-size:9px;
        font-weight:850
      }
      .sd-smart-replace-item-tag.is-safe{
        background:#123b2e;
        color:#65d7a5
      }
      .sd-smart-replace-item-tag.is-risk{
        background:#453716;
        color:#f3c561
      }
      .sd-smart-replace-item-number{
        color:#7f8087;
        font-size:9px;
        font-weight:800
      }
      .sd-smart-replace-context{
        overflow-wrap:anywhere;
        color:#b7b8be;
        font-size:11px;
        line-height:1.65
      }
      .sd-smart-replace-context mark{
        border-radius:4px;
        background:#79620c;
        color:#fff2ad;
        padding:1px 3px
      }
      .sd-smart-replace-footer{
        position:fixed;
        z-index:2;
        left:0;
        right:0;
        bottom:0;
        padding:11px 16px calc(12px + env(safe-area-inset-bottom));
        border-top:1px solid #2e2f33;
        background:#17181b
      }
      .sd-smart-replace-submit{
        width:100%;
        height:50px;
        border:0;
        border-radius:999px;
        background:#25a884;
        color:#fff;
        font:inherit;
        font-size:13px;
        font-weight:850
      }
      .sd-smart-replace-submit:disabled{
        background:#3a3b40;
        color:#898a90
      }
      @media(min-width:700px){
        .sd-smart-replace-page{
          left:50%;
          width:min(760px,100%);
          transform:translateX(-50%);
          border-left:1px solid #2f3034;
          border-right:1px solid #2f3034
        }
        .sd-smart-replace-footer{
          left:50%;
          width:min(760px,100%);
          transform:translateX(-50%)
        }
      }
    `}</style>

    <header className="sd-smart-replace-head">
      <button type="button" className="sd-smart-replace-back" aria-label="Back" onClick={onBack}>
        <ChevronLeft size={21} />
      </button>
      <strong>Find & Replace</strong>
      <button type="button" className="sd-smart-replace-help" aria-label="Help" onClick={() => setHintOpen(value => !value)}>
        <CircleHelp size={19} />
      </button>
      {hintOpen ? <div className="sd-smart-replace-hint">Review matches before replacing. Exact word-boundary matches are marked Safe, while partial matches are marked Risky.</div> : null}
    </header>

    <div className="sd-smart-replace-scroll">
      <div className="sd-smart-replace-fields">
        <div>
          <label className="sd-smart-replace-label" htmlFor="sd-smart-find">Find</label>
          <input
            id="sd-smart-find"
            className="sd-smart-replace-input"
            value={findText}
            onChange={event => {
              setFindText(event.target.value)
              setActiveIndex(0)
            }}
            onCompositionStart={() => setIsFindComposing(true)}
            onCompositionEnd={event => {
              setIsFindComposing(false)
              setFindText(event.currentTarget.value)
              setActiveIndex(0)
            }}
            placeholder="Search word"
            autoFocus
          />
        </div>

        <div>
          <label className="sd-smart-replace-label" htmlFor="sd-smart-replace">Replace with</label>
          <input
            id="sd-smart-replace"
            className="sd-smart-replace-input"
            value={replaceText}
            onChange={event => setReplaceText(event.target.value)}
            onCompositionStart={() => setIsReplaceComposing(true)}
            onCompositionEnd={event => {
              setIsReplaceComposing(false)
              setReplaceText(event.currentTarget.value)
            }}
            placeholder="New word"
          />
        </div>
      </div>

      <div className="sd-smart-replace-badges">
        <button type="button" className={`sd-smart-replace-pill sd-smart-replace-case ${matchCase ? 'is-active' : ''}`} onClick={() => setMatchCase(value => !value)}>
          Match case
        </button>
        <span className="sd-smart-replace-pill sd-smart-replace-safe">Safe {result.safe.length}</span>
        <span className="sd-smart-replace-pill sd-smart-replace-risk">Risky {result.risky.length}</span>
        <span className="sd-smart-replace-pill sd-smart-replace-count">{reviewItems.length ? `${currentIndex + 1} / ${reviewItems.length}` : '0 found'}</span>
      </div>

      {result.ignored.length ? <div className="sd-smart-replace-similar">
        <strong>Similar text to review</strong>
        <div>
          {result.ignored.slice(0, 12).map(item => <span key={item.word}>{item.word} × {item.count}</span>)}
        </div>
      </div> : null}

      <div className="sd-smart-replace-actions">
        <button type="button" disabled={!reviewItems.length || compositionActive} onClick={() => goToMatch('previous')}>Previous</button>
        <button type="button" disabled={!reviewItems.length || compositionActive} onClick={() => goToMatch('next')}>Next</button>
        <button type="button" className="is-primary" disabled={!activeMatch || !findText || compositionActive} onClick={replaceCurrent}>Replace current</button>
        <button type="button" disabled={!lastHtml} onClick={undoReplace}>Undo</button>
      </div>

      <section className="sd-smart-replace-review">
        <div className="sd-smart-replace-review-head">
          <div>
            <strong>Review matches</strong>
            <small>Exact boundary matches are selected automatically.</small>
          </div>
          <div className="sd-smart-replace-review-tools">
            <span>{selectedMatches.length} selected</span>
            <div>
              <button type="button" className="is-safe" onClick={() => setSelectedIds(result.safe.map(item => item.id))}>Select safe</button>
              <button type="button" onClick={() => setSelectedIds([])}>Clear</button>
            </div>
          </div>
        </div>

        <div className="sd-smart-replace-list">
          {!findText ? <div className="sd-smart-replace-empty">Type a word to search.</div> : null}
          {findText && !reviewItems.length ? <div className="sd-smart-replace-empty">No matches found.</div> : null}

          {reviewItems.map((item, index) => {
            const safe = result.safe.some(safeItem => safeItem.id === item.id)
            const checked = selectedIds.includes(item.id)
            const active = index === currentIndex

            return <button
              key={item.id}
              ref={node => {
                if (node) itemRefs.current.set(index, node)
                else itemRefs.current.delete(index)
              }}
              type="button"
              className={`sd-smart-replace-item ${active ? 'is-active' : ''}`}
              onClick={() => setActiveIndex(index)}
            >
              <span className="sd-smart-replace-item-row">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleSelected(item.id)}
                  onClick={event => event.stopPropagation()}
                />
                <span className="sd-smart-replace-item-copy">
                  <span className="sd-smart-replace-item-top">
                    <span className={`sd-smart-replace-item-tag ${safe ? 'is-safe' : 'is-risk'}`}>{safe ? 'Safe' : 'Risky'}</span>
                    <span className="sd-smart-replace-item-number">Match {index + 1}</span>
                  </span>
                  <span className="sd-smart-replace-context">
                    {item.context.before}<mark>{item.context.match}</mark>{item.context.after}
                  </span>
                </span>
              </span>
            </button>
          })}
        </div>
      </section>
    </div>

    <footer className="sd-smart-replace-footer">
      <button
        type="button"
        className="sd-smart-replace-submit"
        disabled={!selectedMatches.length || !findText || compositionActive}
        onClick={replaceSelected}
      >
        {selectedMatches.length ? `Replace ${selectedMatches.length} selected` : 'No match selected'}
      </button>
    </footer>
  </div>
}
