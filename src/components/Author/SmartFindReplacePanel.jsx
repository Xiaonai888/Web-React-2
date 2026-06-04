import { useEffect, useMemo, useState } from 'react'

const TOKEN_REGEX = /[A-Za-z0-9_]+/g
const BOUNDARY_REGEX = /[\s\n\r\t.,!?;:'"“”‘’()\[\]{}<>«»/\\|+=*_~`—–-]/

function escapeRegExp(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function isBoundary(value) {
  if (!value) return true
  return BOUNDARY_REGEX.test(value)
}

function getTokenAt(text, start, end) {
  const source = String(text || '')
  let left = start
  let right = end

  while (left > 0 && /[A-Za-z0-9_]/.test(source[left - 1])) left -= 1
  while (right < source.length && /[A-Za-z0-9_]/.test(source[right])) right += 1

  return source.slice(left, right)
}

function getContext(text, start, end) {
  const source = String(text || '')
  const before = source.slice(Math.max(0, start - 42), start)
  const match = source.slice(start, end)
  const after = source.slice(end, Math.min(source.length, end + 42))

  return { before, match, after }
}

function buildMatches(content, findText, matchCase) {
  const source = String(content || '')
  const keyword = String(findText || '')

  if (!keyword.trim()) return { safe: [], risky: [], ignored: [] }

  const flags = matchCase ? 'g' : 'gi'
  const regex = new RegExp(escapeRegExp(keyword), flags)
  const safe = []
  const risky = []
  const ignoredMap = new Map()
  const compareKeyword = matchCase ? keyword : keyword.toLowerCase()

  Array.from(source.matchAll(regex)).forEach((match, index) => {
    const start = match.index
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

    if (isBoundary(before) && isBoundary(after)) {
      safe.push(item)
      return
    }

    risky.push(item)

    const token = getTokenAt(source, start, end)
    const compareToken = matchCase ? token : token.toLowerCase()

    if (token && compareToken !== compareKeyword && compareToken.includes(compareKeyword)) {
      ignoredMap.set(token, (ignoredMap.get(token) || 0) + 1)
    }
  })

  const ignored = Array.from(ignoredMap.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))

  return { safe, risky, ignored }
}

function applyReplace(content, matches, replaceText) {
  const selected = [...matches].sort((a, b) => b.start - a.start)
  let nextContent = String(content || '')

  selected.forEach((match) => {
    nextContent = `${nextContent.slice(0, match.start)}${replaceText}${nextContent.slice(match.end)}`
  })

  return nextContent
}

export default function SmartFindReplacePanel({ open, content, textareaRef, onClose, onReplace }) {
  const [findText, setFindText] = useState('')
  const [replaceText, setReplaceText] = useState('')
  const [matchCase, setMatchCase] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedIds, setSelectedIds] = useState([])
  const [lastContent, setLastContent] = useState('')

  const result = useMemo(() => buildMatches(content, findText, matchCase), [content, findText, matchCase])
  const reviewItems = useMemo(() => [...result.safe, ...result.risky], [result.safe, result.risky])
  const selectedMatches = useMemo(
    () => reviewItems.filter((item) => selectedIds.includes(item.id)),
    [reviewItems, selectedIds]
  )

  useEffect(() => {
    setActiveIndex(0)
    setSelectedIds(result.safe.map((item) => item.id))
  }, [findText, matchCase, result.safe])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const activeMatch = reviewItems[activeIndex] || null

  const focusMatch = (match) => {
    if (!match || !textareaRef?.current) return

    window.setTimeout(() => {
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(match.start, match.end)
    }, 80)
  }

  const goToMatch = (direction) => {
    if (!reviewItems.length) return

    const nextIndex = direction === 'next'
      ? (activeIndex + 1) % reviewItems.length
      : (activeIndex - 1 + reviewItems.length) % reviewItems.length

    setActiveIndex(nextIndex)
    focusMatch(reviewItems[nextIndex])
  }

  const replaceCurrent = () => {
    if (!activeMatch) return

    setLastContent(content)
    onReplace(applyReplace(content, [activeMatch], replaceText))
  }

  const replaceSelected = () => {
    if (!selectedMatches.length) return

    setLastContent(content)
    onReplace(applyReplace(content, selectedMatches, replaceText))
  }

  const undoReplace = () => {
    if (!lastContent) return

    onReplace(lastContent)
    setLastContent('')
  }

  const toggleSelected = (id) => {
    setSelectedIds((current) => (
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    ))
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[170] bg-black/35 sm:flex sm:items-center sm:justify-center sm:px-4">
      <div className="flex h-full w-full flex-col bg-white shadow-2xl sm:h-[86vh] sm:max-w-[760px] sm:rounded-[28px]">
        <div className="flex items-center justify-between border-b border-[#eceaf2] px-4 py-3">
          <div>
            <h2 className="text-[17px] font-extrabold text-[#111827]">Find & Replace</h2>
            <p className="mt-0.5 text-[11px] font-bold text-[#8d94a1]">Smart match helps avoid wrong replace.</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Close find and replace"
          >
            <i className="fa-solid fa-xmark text-[14px]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[12px] font-extrabold text-[#111827]">Find</label>
              <input
                value={findText}
                onChange={(event) => setFindText(event.target.value)}
                placeholder="Search word"
                className="h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-[14px] font-bold text-[#111827] outline-none focus:border-[#111827] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-extrabold text-[#111827]">Replace with</label>
              <input
                value={replaceText}
                onChange={(event) => setReplaceText(event.target.value)}
                placeholder="New word"
                className="h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-[14px] font-bold text-[#111827] outline-none focus:border-[#111827] focus:bg-white"
              />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setMatchCase((value) => !value)}
              className={`rounded-full px-3 py-2 text-[11px] font-extrabold active:scale-95 ${
                matchCase ? 'bg-[#111827] text-white' : 'bg-[#f5f3fa] text-[#555b66]'
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
              {reviewItems.length ? `${activeIndex + 1} / ${reviewItems.length}` : '0 found'}
            </div>
          </div>

          {result.ignored.length ? (
            <div className="mt-3 rounded-[18px] bg-[#fff7df] px-4 py-3">
              <div className="text-[12px] font-extrabold text-[#111827]">Ignored similar words</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.ignored.slice(0, 12).map((item) => (
                  <span key={item.word} className="rounded-full bg-white px-3 py-1.5 text-[11px] font-extrabold text-[#a56a00] ring-1 ring-[#ffe0a3]">
                    {item.word} × {item.count}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button
              type="button"
              onClick={() => goToMatch('prev')}
              disabled={!reviewItems.length}
              className="h-11 rounded-full border border-[#e4e7ec] bg-white text-[12px] font-extrabold text-[#111827] active:scale-95 disabled:opacity-50"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={() => goToMatch('next')}
              disabled={!reviewItems.length}
              className="h-11 rounded-full border border-[#e4e7ec] bg-white text-[12px] font-extrabold text-[#111827] active:scale-95 disabled:opacity-50"
            >
              Next
            </button>

            <button
              type="button"
              onClick={replaceCurrent}
              disabled={!activeMatch || !findText.trim()}
              className="h-11 rounded-full bg-[#111827] text-[12px] font-extrabold text-white active:scale-95 disabled:bg-[#9ca3af]"
            >
              Replace current
            </button>

            <button
              type="button"
              onClick={undoReplace}
              disabled={!lastContent}
              className="h-11 rounded-full bg-[#f5f3fa] text-[12px] font-extrabold text-[#111827] active:scale-95 disabled:opacity-50"
            >
              Undo
            </button>
          </div>

          <div className="mt-4 rounded-[20px] border border-[#eceaf2] bg-[#fafafe]">
            <div className="flex items-center justify-between border-b border-[#eceaf2] px-4 py-3">
              <div>
                <div className="text-[13px] font-extrabold text-[#111827]">Review matches</div>
                <div className="mt-0.5 text-[11px] font-bold text-[#8d94a1]">
                  Safe matches are checked by default. Risky matches need manual check.
                </div>
              </div>

              <div className="text-[11px] font-extrabold text-[#555b66]">
                {selectedMatches.length} selected
              </div>
            </div>

            <div className="max-h-[300px] overflow-y-auto p-2">
              {!findText.trim() ? (
                <div className="px-3 py-8 text-center text-[12px] font-bold text-[#8d94a1]">Type a word to search.</div>
              ) : null}

              {findText.trim() && !reviewItems.length ? (
                <div className="px-3 py-8 text-center text-[12px] font-bold text-[#8d94a1]">No matches found.</div>
              ) : null}

              {reviewItems.map((item, index) => {
                const isSafe = result.safe.some((safeItem) => safeItem.id === item.id)
                const checked = selectedIds.includes(item.id)

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveIndex(index)
                      focusMatch(item)
                    }}
                    className="mb-2 w-full rounded-[16px] bg-white p-3 text-left ring-1 ring-[#eceaf2] active:scale-[0.99]"
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
                          <span className={`rounded-full px-2 py-1 text-[10px] font-extrabold ${isSafe ? 'bg-[#ecfdf3] text-[#027a48]' : 'bg-[#fff7df] text-[#a56a00]'}`}>
                            {isSafe ? 'Safe' : 'Risky'}
                          </span>
                          <span className="text-[11px] font-extrabold text-[#8d94a1]">Line item {index + 1}</span>
                        </div>

                        <div className="text-[12px] font-semibold leading-6 text-[#555b66]">
                          {item.context.before}
                          <span className="rounded bg-[#fff2a8] px-1 font-extrabold text-[#111827]">{item.context.match}</span>
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

        <div className="border-t border-[#eceaf2] bg-white px-4 py-3">
          <button
            type="button"
            onClick={replaceSelected}
            disabled={!selectedMatches.length || !findText.trim()}
            className="h-12 w-full rounded-full bg-[#111827] text-[13px] font-extrabold text-white shadow-[0_14px_30px_rgba(17,24,39,0.22)] active:scale-[0.99] disabled:bg-[#9ca3af]"
          >
            Replace {selectedMatches.length} selected
          </button>
        </div>
      </div>
    </div>
  )
}
