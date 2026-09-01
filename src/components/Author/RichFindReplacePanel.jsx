import { useMemo, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('richFindReplacePanel', {
  "en": {
    "title": "Find & Replace",
    "zeroFound": "0 found",
    "find": "Find",
    "replace": "Replace",
    "matchCase": "Match case",
    "replaceCurrent": "Replace current",
    "replaceAll": "Replace all",
    "moreOptions": "More options"
  },
  "km": {
    "title": "ស្វែងរក និងជំនួស",
    "zeroFound": "រកមិនឃើញ",
    "find": "ស្វែងរក",
    "replace": "ជំនួស",
    "matchCase": "ផ្គូផ្គងអក្សរធំតូច",
    "replaceCurrent": "ជំនួសមួយនេះ",
    "replaceAll": "ជំនួសទាំងអស់",
    "moreOptions": "ជម្រើសបន្ថែម"
  },
  "zh": {
    "title": "查找和替换",
    "zeroFound": "未找到",
    "find": "查找",
    "replace": "替换",
    "matchCase": "区分大小写",
    "replaceCurrent": "替换当前项",
    "replaceAll": "全部替换",
    "moreOptions": "更多选项"
  },
  "ja": {
    "title": "検索と置換",
    "zeroFound": "0件",
    "find": "検索",
    "replace": "置換",
    "matchCase": "大文字小文字を区別",
    "replaceCurrent": "現在を置換",
    "replaceAll": "すべて置換",
    "moreOptions": "その他のオプション"
  },
  "ko": {
    "title": "찾기 및 바꾸기",
    "zeroFound": "0개 찾음",
    "find": "찾기",
    "replace": "바꾸기",
    "matchCase": "대소문자 구분",
    "replaceCurrent": "현재 항목 바꾸기",
    "replaceAll": "모두 바꾸기",
    "moreOptions": "추가 옵션"
  }
})


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
  const { t } = useDisplayTranslation()
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
      <div className="w-full rounded-t-[18px] bg-[var(--shadow-bg-surface)] px-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-4 shadow-2xl sm:max-w-[520px] sm:rounded-[18px]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center text-[var(--shadow-text-primary)] active:scale-95"
            aria-label="Close search"
          >
            <i className="fa-solid fa-xmark text-[14px]" />
          </button>

          <h2 className="min-w-0 flex-1 text-[14px] font-bold text-[var(--shadow-text-primary)]">
            {t('richFindReplacePanel.title')}
          </h2>

          <div className="text-[11px] font-bold text-[var(--shadow-text-tertiary)]">
            {matches.length ? `${currentIndex + 1} / ${matches.length}` : t('richFindReplacePanel.zeroFound')}
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
            placeholder={t('richFindReplacePanel.find')}
            autoFocus
            className="h-11 rounded-[10px] bg-[var(--shadow-input-bg)] px-3 text-[14px] text-[var(--shadow-text-primary)] outline-none"
          />

          <input
            value={replaceText}
            onChange={(event) => setReplaceText(event.target.value)}
            onCompositionStart={() => setIsReplaceComposing(true)}
            onCompositionEnd={(event) => {
              setIsReplaceComposing(false)
              setReplaceText(event.currentTarget.value)
            }}
            placeholder={t('richFindReplacePanel.replace')}
            className="h-11 rounded-[10px] bg-[var(--shadow-input-bg)] px-3 text-[14px] text-[var(--shadow-text-primary)] outline-none"
          />
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleMatchCase}
            className={`h-9 rounded-full px-3 text-[11px] font-bold active:scale-95 ${
              matchCase
                ? 'bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)]'
                : 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]'
            }`}
          >
            {t('richFindReplacePanel.matchCase')}
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => goToMatch('previous')}
              disabled={!matches.length || isFindComposing || isReplaceComposing}
              className="flex h-9 w-9 items-center justify-center text-[var(--shadow-text-primary)] disabled:opacity-35"
              aria-label="Previous match"
            >
              <i className="fa-solid fa-chevron-up text-[12px]" />
            </button>

            <button
              type="button"
              onClick={() => goToMatch('next')}
              disabled={!matches.length || isFindComposing || isReplaceComposing}
              className="flex h-9 w-9 items-center justify-center text-[var(--shadow-text-primary)] disabled:opacity-35"
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
            className="h-11 rounded-full bg-[var(--shadow-bg-soft)] text-[12px] font-bold text-[var(--shadow-text-primary)] active:scale-95 disabled:opacity-40"
          >
            {t('richFindReplacePanel.replaceCurrent')}
          </button>

          <button
            type="button"
            onClick={replaceAll}
            disabled={replaceDisabled}
            className="h-11 rounded-full bg-[#111827] text-[12px] font-bold text-white active:scale-95 disabled:bg-[#9ca3af] dark:bg-white dark:text-[#111827] dark:disabled:bg-[#9ca3af]"
          >
            {t('richFindReplacePanel.replaceAll')}
          </button>
        </div>

        <button
          type="button"
          onClick={() => onMoreOptions?.()}
          aria-disabled={!onMoreOptions}
          className="mx-auto mt-4 block px-3 py-1 text-center text-[11px] font-semibold text-[var(--shadow-text-tertiary)] active:opacity-60"
        >
          {t('richFindReplacePanel.moreOptions')}
        </button>
      </div>
    </div>
  )
}
