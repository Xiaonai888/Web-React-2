import { useEffect, useMemo, useRef, useState } from 'react'

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
  const map = nodes.map((node) => {
    const start = offset
    offset += node.data.length
    return { node, start, end: offset }
  })

  return {
    text: nodes.map((node) => node.data).join(''),
    map,
  }
}

function pointFromOffset(map, offset, preferEnd = false) {
  if (!map.length) return null

  const entry =
    map.find((item) =>
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

  const flags = matchCase ? 'gu' : 'giu'
  const regex = new RegExp(escapeRegExp(keyword), flags)
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

export default function SmartFindReplacePanel({
  open,
  editorRef,
  onClose,
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
    () => reviewItems.filter((item) => selectedIds.includes(item.id)),
    [reviewItems, selectedIds]
  )

  useEffect(() => {
    setActiveIndex(0)
    setSelectedIds(result.safe.map((item) => item.id))
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

  const refresh = () => {
    onChange?.(editorRef.current?.innerHTML || '')
    window.getSelection()?.removeAllRanges()
    setRevision((value) => value + 1)
  }

  const scrollToItem = (index) => {
    window.setTimeout(() => {
      itemRefs.current.get(index)?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }, 0)
  }

  const goToMatch = (direction) => {
    if (!reviewItems.length || compositionActive) return

    const nextIndex =
      direction === 'next'
        ? (currentIndex + 1) % reviewItems.length
        : (currentIndex - 1 + reviewItems.length) % reviewItems.length

    setActiveIndex(nextIndex)
    scrollToItem(nextIndex)
  }

  const replaceCurrent = () => {
    if (!activeMatch || compositionActive || !editorRef?.current) return

    setLastHtml(editorRef.current.innerHTML)

    if (!replaceMatch(editorRef.current, activeMatch, replaceText)) return

    setActiveIndex(0)
    refresh()
  }

  const replaceSelected = () => {
    if (!selectedMatches.length || compositionActive || !editorRef?.current) return

    setLastHtml(editorRef.current.innerHTML)

    const ordered = [...selectedMatches].sort(
      (first, second) => second.start - first.start
    )

    ordered.forEach((match) => replaceMatch(editorRef.current, match, replaceText))

    setActiveIndex(0)
    refresh()
  }

  const undoReplace = () => {
    if (!lastHtml || !editorRef?.current) return

    editorRef.current.innerHTML = lastHtml
    onChange?.(lastHtml)
    window.getSelection()?.removeAllRanges()
    setLastHtml('')
    setActiveIndex(0)
    setRevision((value) => value + 1)
  }

  const toggleSelected = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    )
  }

  return (
    <div className="fixed inset-0 z-[190] bg-white sm:flex sm:items-center sm:justify-center sm:bg-black/35 sm:px-4">
      <div className="flex h-full w-full flex-col bg-white shadow-2xl sm:h-[86vh] sm:max-w-[760px] sm:rounded-[28px]">
        <div className="flex items-center gap-3 border-b border-[#eceaf2] bg-white px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Back to editor"
          >
            <i className="fa-solid fa-chevron-left text-[13px]" />
          </button>

          <div className="min-w-0 flex-1">
            <h2 className="text-[17px] font-extrabold leading-5 text-[#111827]">
              Find & Replace
            </h2>
            <p className="mt-1 line-clamp-1 text-[11px] font-bold text-[#8d94a1]">
              Review matches before replacing.
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[12px] font-extrabold text-[#111827]">
                Find
              </label>
              <input
                value={findText}
                onChange={(event) => {
                  setFindText(event.target.value)
                  setActiveIndex(0)
                }}
                onCompositionStart={() => setIsFindComposing(true)}
                onCompositionEnd={(event) => {
                  setIsFindComposing(false)
                  setFindText(event.currentTarget.value)
                  setActiveIndex(0)
                }}
                placeholder="Search word"
                autoFocus
                className="h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-[14px] font-bold text-[#111827] outline-none focus:border-[#111827] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-extrabold text-[#111827]">
                Replace with
              </label>
              <input
                value={replaceText}
                onChange={(event) => setReplaceText(event.target.value)}
                onCompositionStart={() => setIsReplaceComposing(true)}
                onCompositionEnd={(event) => {
                  setIsReplaceComposing(false)
                  setReplaceText(event.currentTarget.value)
                }}
                placeholder="New word"
                className="h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-[14px] font-bold text-[#111827] outline-none focus:border-[#111827] focus:bg-white"
              />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setMatchCase((value) => !value)
                setActiveIndex(0)
              }}
              className={`rounded-full px-3 py-2 text-[11px] font-extrabold active:scale-95 ${
                matchCase
                  ? 'bg-[#111827] text-white'
                  : 'bg-[#f5f3fa] text-[#555b66]'
              }`}
            >
              Match case
            </button>

            <div className="rounded-full bg-[#ecfdf3] px-3 py-2 text-[11px] font-extrabold text-[#027a48]">
              Safe {result.safe.length}
            </div>

            <div className="rounded-full bg-[#fff7df] px-3 py-2 text-[11px] font-extrabold text-[#a56a00]">
              Risky {result.risky.length}
            </div>

            <div className="rounded-full bg-[#f5f3fa] px-3 py-2 text-[11px] font-extrabold text-[#555b66]">
              {reviewItems.length
                ? `${currentIndex + 1} / ${reviewItems.length}`
                : '0 found'}
            </div>
          </div>

          {result.ignored.length ? (
            <div className="mt-3 rounded-[18px] bg-[#fff7df] px-4 py-3">
              <div className="text-[12px] font-extrabold text-[#111827]">
                Similar text to review
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.ignored.slice(0, 12).map((item) => (
                  <span
                    key={item.word}
                    className="max-w-full truncate rounded-full bg-white px-3 py-1.5 text-[11px] font-extrabold text-[#a56a00] ring-1 ring-[#ffe0a3]"
                  >
                    {item.word} × {item.count}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button
              type="button"
              onClick={() => goToMatch('previous')}
              disabled={!reviewItems.length || compositionActive}
              className="h-11 rounded-full border border-[#e4e7ec] bg-white text-[12px] font-extrabold text-[#111827] active:scale-95 disabled:opacity-50"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={() => goToMatch('next')}
              disabled={!reviewItems.length || compositionActive}
              className="h-11 rounded-full border border-[#e4e7ec] bg-white text-[12px] font-extrabold text-[#111827] active:scale-95 disabled:opacity-50"
            >
              Next
            </button>

            <button
              type="button"
              onClick={replaceCurrent}
              disabled={!activeMatch || !findText || compositionActive}
              className="h-11 rounded-full bg-[#111827] text-[12px] font-extrabold text-white active:scale-95 disabled:bg-[#9ca3af]"
            >
              Replace current
            </button>

            <button
              type="button"
              onClick={undoReplace}
              disabled={!lastHtml}
              className="h-11 rounded-full bg-[#f5f3fa] text-[12px] font-extrabold text-[#111827] active:scale-95 disabled:opacity-50"
            >
              Undo
            </button>
          </div>

          <div className="mt-4 rounded-[20px] border border-[#eceaf2] bg-[#fafafe]">
            <div className="flex items-center justify-between gap-3 border-b border-[#eceaf2] px-4 py-3">
              <div className="min-w-0">
                <div className="text-[13px] font-extrabold text-[#111827]">
                  Review matches
                </div>
                <div className="mt-0.5 text-[11px] font-bold text-[#8d94a1]">
                  Exact boundary matches are selected automatically.
                </div>
              </div>

              <div className="shrink-0 text-right">
                <div className="text-[11px] font-extrabold text-[#555b66]">
                  {selectedMatches.length} selected
                </div>
                <div className="mt-1 flex gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedIds(result.safe.map((item) => item.id))
                    }
                    className="rounded-full bg-[#ecfdf3] px-2 py-1 text-[10px] font-extrabold text-[#027a48]"
                  >
                    Select safe
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedIds([])}
                    className="rounded-full bg-white px-2 py-1 text-[10px] font-extrabold text-[#667085] ring-1 ring-[#e4e7ec]"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            <div className="max-h-[320px] overflow-y-auto p-2">
              {!findText ? (
                <div className="px-3 py-8 text-center text-[12px] font-bold text-[#8d94a1]">
                  Type a word to search.
                </div>
              ) : null}

              {findText && !reviewItems.length ? (
                <div className="px-3 py-8 text-center text-[12px] font-bold text-[#8d94a1]">
                  No matches found.
                </div>
              ) : null}

              {reviewItems.map((item, index) => {
                const isSafe = result.safe.some(
                  (safeItem) => safeItem.id === item.id
                )
                const checked = selectedIds.includes(item.id)
                const active = index === currentIndex

                return (
                  <button
                    key={item.id}
                    ref={(node) => {
                      if (node) itemRefs.current.set(index, node)
                      else itemRefs.current.delete(index)
                    }}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`mb-2 w-full rounded-[16px] bg-white p-3 text-left active:scale-[0.99] ${
                      active
                        ? 'ring-2 ring-[#111827]'
                        : 'ring-1 ring-[#eceaf2]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSelected(item.id)}
                        onClick={(event) => event.stopPropagation()}
                        className="mt-1 h-4 w-4 accent-[#111827]"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-extrabold ${
                              isSafe
                                ? 'bg-[#ecfdf3] text-[#027a48]'
                                : 'bg-[#fff7df] text-[#a56a00]'
                            }`}
                          >
                            {isSafe ? 'Safe' : 'Risky'}
                          </span>
                          <span className="text-[11px] font-extrabold text-[#8d94a1]">
                            Match {index + 1}
                          </span>
                        </div>

                        <div className="break-words text-[12px] font-semibold leading-6 text-[#555b66]">
                          {item.context.before}
                          <span className="rounded bg-[#fff2a8] px-1 font-extrabold text-[#111827]">
                            {item.context.match}
                          </span>
                          {item.context.after}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-[#eceaf2] bg-white px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={replaceSelected}
            disabled={
              !selectedMatches.length ||
              !findText ||
              compositionActive
            }
            className="h-12 w-full rounded-full bg-[#111827] text-[13px] font-extrabold text-white shadow-[0_14px_30px_rgba(17,24,39,0.22)] active:scale-[0.99] disabled:bg-[#9ca3af]"
          >
            {selectedMatches.length
              ? `Replace ${selectedMatches.length} selected`
              : 'No match selected'}
          </button>
        </div>
      </div>
    </div>
  )
}
