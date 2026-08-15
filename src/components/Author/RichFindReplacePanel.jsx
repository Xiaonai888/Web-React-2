import { useMemo, useState } from 'react'

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

function findMatches(text, keyword, matchCase) {
  const source = String(text || '')
  const query = String(keyword || '')
  if (!query) return []

  const compareSource = matchCase ? source : source.toLowerCase()
  const compareQuery = matchCase ? query : query.toLowerCase()
  const matches = []
  let start = 0

  while (start <= compareSource.length - compareQuery.length) {
    const index = compareSource.indexOf(compareQuery, start)
    if (index < 0) break
    matches.push({ start: index, end: index + query.length })
    start = index + Math.max(1, query.length)
  }

  return matches
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

export default function RichFindReplacePanel({
  open,
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

  const currentIndex = matches.length
    ? Math.min(activeIndex, matches.length - 1)
    : 0

  const refresh = () => {
    onChange?.(editorRef.current?.innerHTML || '')
    window.getSelection()?.removeAllRanges()
    setRevision((value) => value + 1)
  }

  const handleFindChange = (event) => {
    setFindText(event.target.value)
    setActiveIndex(0)
  }

  const handleMatchCase = () => {
    setMatchCase((value) => !value)
    setActiveIndex(0)
  }

  const goToMatch = (direction) => {
    if (!matches.length || isFindComposing || isReplaceComposing) return

    const nextIndex =
      direction === 'next'
        ? (currentIndex + 1) % matches.length
        : (currentIndex - 1 + matches.length) % matches.length

    setActiveIndex(nextIndex)
    selectMatch(editorRef.current, matches[nextIndex])
  }

  const replaceCurrent = () => {
    if (isFindComposing || isReplaceComposing) return

    const match = matches[currentIndex]
    if (!match || !replaceMatch(editorRef.current, match, replaceText)) return

    setActiveIndex(0)
    refresh()
  }

  const replaceAll = () => {
    if (!matches.length || isFindComposing || isReplaceComposing) return

    const ordered = [...matches].sort((first, second) => second.start - first.start)
    ordered.forEach((match) => replaceMatch(editorRef.current, match, replaceText))

    setActiveIndex(0)
    refresh()
  }

  const replaceDisabled =
    !matches.length || isFindComposing || isReplaceComposing

  return (
    <div className="fixed inset-0 z-[170] flex items-end bg-black/35 sm:items-center sm:justify-center sm:px-4">
      <div className="w-full rounded-t-[18px] bg-white px-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-4 shadow-2xl sm:max-w-[520px] sm:rounded-[18px]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center text-[#111827] active:scale-95"
            aria-label="Close search"
          >
            <i className="fa-solid fa-xmark text-[14px]" />
          </button>

          <h2 className="min-w-0 flex-1 text-[14px] font-bold text-[#111827]">
            Find & Replace
          </h2>

          <div className="text-[11px] font-bold text-[#8d94a1]">
            {matches.length ? `${currentIndex + 1} / ${matches.length}` : '0 found'}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <input
            value={findText}
            onChange={handleFindChange}
            onCompositionStart={() => setIsFindComposing(true)}
            onCompositionEnd={(event) => {
              setIsFindComposing(false)
              setFindText(event.currentTarget.value)
              setActiveIndex(0)
            }}
            placeholder="Find"
            autoFocus
            className="h-11 rounded-[10px] bg-[#f7f7fa] px-3 text-[14px] text-[#111827] outline-none"
          />

          <input
            value={replaceText}
            onChange={(event) => setReplaceText(event.target.value)}
            onCompositionStart={() => setIsReplaceComposing(true)}
            onCompositionEnd={(event) => {
              setIsReplaceComposing(false)
              setReplaceText(event.currentTarget.value)
            }}
            placeholder="Replace"
            className="h-11 rounded-[10px] bg-[#f7f7fa] px-3 text-[14px] text-[#111827] outline-none"
          />
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleMatchCase}
            className={`h-9 rounded-full px-3 text-[11px] font-bold active:scale-95 ${
              matchCase
                ? 'bg-[#111827] text-white'
                : 'bg-[#f2f4f7] text-[#555b66]'
            }`}
          >
            Match case
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => goToMatch('previous')}
              disabled={!matches.length || isFindComposing || isReplaceComposing}
              className="flex h-9 w-9 items-center justify-center text-[#111827] disabled:opacity-35"
              aria-label="Previous match"
            >
              <i className="fa-solid fa-chevron-up text-[12px]" />
            </button>

            <button
              type="button"
              onClick={() => goToMatch('next')}
              disabled={!matches.length || isFindComposing || isReplaceComposing}
              className="flex h-9 w-9 items-center justify-center text-[#111827] disabled:opacity-35"
              aria-label="Next match"
            >
              <i className="fa-solid fa-chevron-down text-[12px]" />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={replaceCurrent}
            disabled={replaceDisabled}
            className="h-11 rounded-full bg-[#f2f4f7] text-[12px] font-bold text-[#111827] active:scale-95 disabled:opacity-40"
          >
            Replace current
          </button>

          <button
            type="button"
            onClick={replaceAll}
            disabled={replaceDisabled}
            className="h-11 rounded-full bg-[#111827] text-[12px] font-bold text-white active:scale-95 disabled:bg-[#9ca3af]"
          >
            Replace all
          </button>
        </div>

        <button
          type="button"
          onClick={() => onMoreOptions?.()}
          aria-disabled={!onMoreOptions}
          className="mx-auto mt-4 block px-3 py-1 text-center text-[11px] font-semibold text-[#9aa1ad] active:opacity-60"
        >
          More options
        </button>
      </div>
    </div>
  )
}
