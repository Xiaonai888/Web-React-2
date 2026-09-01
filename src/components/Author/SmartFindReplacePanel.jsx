import { useEffect, useMemo, useRef, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('smartFindReplacePanel', {
  "en": {
    "title": "Find & Replace",
    "reviewHint": "Review matches before replacing.",
    "find": "Find",
    "searchWord": "Search word",
    "replaceWith": "Replace with",
    "newWord": "New word",
    "matchCase": "Match case",
    "safe": "Safe",
    "risky": "Risky",
    "zeroFound": "0 found",
    "similarText": "Similar text to review",
    "previous": "Previous",
    "next": "Next",
    "replaceCurrent": "Replace current",
    "undo": "Undo",
    "reviewMatches": "Review matches",
    "autoSelect": "Exact boundary matches are selected automatically.",
    "selected": "{{count}} selected",
    "selectSafe": "Select safe",
    "clear": "Clear",
    "typeWord": "Type a word to search.",
    "noMatches": "No matches found.",
    "matchNumber": "Match {{number}}",
    "replaceSelected": "Replace {{count}} selected",
    "noMatchSelected": "No match selected"
  },
  "km": {
    "title": "ស្វែងរក និងជំនួស",
    "reviewHint": "ពិនិត្យលទ្ធផលដែលផ្គូផ្គង មុនពេលជំនួស។",
    "find": "ស្វែងរក",
    "searchWord": "ស្វែងរកពាក្យ",
    "replaceWith": "ជំនួសដោយ",
    "newWord": "ពាក្យថ្មី",
    "matchCase": "ផ្គូផ្គងអក្សរធំតូច",
    "safe": "សុវត្ថិភាព",
    "risky": "ប្រយ័ត្ន",
    "zeroFound": "រកមិនឃើញ",
    "similarText": "អត្ថបទស្រដៀងគ្នាដែលត្រូវពិនិត្យ",
    "previous": "មុន",
    "next": "បន្ទាប់",
    "replaceCurrent": "ជំនួសមួយនេះ",
    "undo": "មិនធ្វើវិញ",
    "reviewMatches": "ពិនិត្យលទ្ធផលផ្គូផ្គង",
    "autoSelect": "លទ្ធផលដែលត្រូវព្រំដែនពាក្យពិតប្រាកដ ត្រូវបានជ្រើសដោយស្វ័យប្រវត្តិ។",
    "selected": "បានជ្រើស {{count}}",
    "selectSafe": "ជ្រើសតែសុវត្ថិភាព",
    "clear": "សម្អាត",
    "typeWord": "វាយពាក្យដើម្បីស្វែងរក។",
    "noMatches": "រកមិនឃើញលទ្ធផលផ្គូផ្គងទេ។",
    "matchNumber": "លទ្ធផលទី {{number}}",
    "replaceSelected": "ជំនួស {{count}} ដែលបានជ្រើស",
    "noMatchSelected": "មិនបានជ្រើសលទ្ធផលណាមួយ"
  },
  "zh": {
    "title": "查找和替换",
    "reviewHint": "替换前请先检查匹配项。",
    "find": "查找",
    "searchWord": "搜索词语",
    "replaceWith": "替换为",
    "newWord": "新词",
    "matchCase": "区分大小写",
    "safe": "安全",
    "risky": "需检查",
    "zeroFound": "未找到",
    "similarText": "需要检查的相似文本",
    "previous": "上一个",
    "next": "下一个",
    "replaceCurrent": "替换当前项",
    "undo": "撤销",
    "reviewMatches": "检查匹配项",
    "autoSelect": "精确词边界匹配会自动选中。",
    "selected": "已选择 {{count}} 项",
    "selectSafe": "选择安全项",
    "clear": "清除",
    "typeWord": "输入词语开始搜索。",
    "noMatches": "未找到匹配项。",
    "matchNumber": "匹配 {{number}}",
    "replaceSelected": "替换已选 {{count}} 项",
    "noMatchSelected": "未选择匹配项"
  },
  "ja": {
    "title": "検索と置換",
    "reviewHint": "置換する前に一致箇所を確認してください。",
    "find": "検索",
    "searchWord": "単語を検索",
    "replaceWith": "置換後",
    "newWord": "新しい単語",
    "matchCase": "大文字小文字を区別",
    "safe": "安全",
    "risky": "要確認",
    "zeroFound": "0件",
    "similarText": "確認が必要な類似テキスト",
    "previous": "前へ",
    "next": "次へ",
    "replaceCurrent": "現在を置換",
    "undo": "元に戻す",
    "reviewMatches": "一致箇所を確認",
    "autoSelect": "単語境界が完全一致する箇所は自動選択されます。",
    "selected": "{{count}}件選択",
    "selectSafe": "安全な項目を選択",
    "clear": "クリア",
    "typeWord": "検索する単語を入力してください。",
    "noMatches": "一致する項目がありません。",
    "matchNumber": "一致 {{number}}",
    "replaceSelected": "選択した{{count}}件を置換",
    "noMatchSelected": "一致項目が選択されていません"
  },
  "ko": {
    "title": "찾기 및 바꾸기",
    "reviewHint": "바꾸기 전에 일치 항목을 검토하세요.",
    "find": "찾기",
    "searchWord": "단어 검색",
    "replaceWith": "바꿀 내용",
    "newWord": "새 단어",
    "matchCase": "대소문자 구분",
    "safe": "안전",
    "risky": "검토 필요",
    "zeroFound": "0개 찾음",
    "similarText": "검토할 유사 텍스트",
    "previous": "이전",
    "next": "다음",
    "replaceCurrent": "현재 항목 바꾸기",
    "undo": "실행 취소",
    "reviewMatches": "일치 항목 검토",
    "autoSelect": "정확한 단어 경계 일치 항목은 자동으로 선택됩니다.",
    "selected": "{{count}}개 선택됨",
    "selectSafe": "안전 항목 선택",
    "clear": "지우기",
    "typeWord": "검색할 단어를 입력하세요.",
    "noMatches": "일치하는 항목이 없습니다.",
    "matchNumber": "일치 {{number}}",
    "replaceSelected": "선택한 {{count}}개 바꾸기",
    "noMatchSelected": "선택된 일치 항목 없음"
  }
})


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
  const { t } = useDisplayTranslation()
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
    <div className="fixed inset-0 z-[190] bg-[var(--shadow-bg-page)] sm:flex sm:items-center sm:justify-center sm:bg-black/35 sm:px-4">
      <div className="flex h-full w-full flex-col bg-[var(--shadow-bg-surface)] shadow-2xl sm:h-[86vh] sm:max-w-[760px] sm:rounded-[28px]">
        <div className="relative flex h-14 items-center gap-3 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4">
  <button
    type="button"
    onClick={onClose}
    className="flex h-9 w-9 shrink-0 items-center justify-center text-[var(--shadow-text-primary)] active:scale-95"
    aria-label="Back to editor"
  >
    <i className="fa-solid fa-chevron-left text-[14px]" />
  </button>

  <h2 className="min-w-0 flex-1 text-[16px] font-extrabold text-[var(--shadow-text-primary)]">
    {t('smartFindReplacePanel.title')}
  </h2>

  <button
    type="button"
    onClick={() => setHintOpen((value) => !value)}
    className="flex h-9 w-9 shrink-0 items-center justify-center text-[var(--shadow-text-secondary)] active:scale-95"
    aria-label="Find and replace help"
  >
    <i className="fa-regular fa-circle-question text-[17px]" />
  </button>

  {hintOpen ? (
    <div className="absolute right-4 top-[50px] z-20 w-[240px] rounded-[12px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] px-3 py-2.5 text-[11.5px] font-medium leading-5 text-[var(--shadow-text-secondary)] shadow-lg">
      {t('smartFindReplacePanel.reviewHint')}
    </div>
  ) : null}
</div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[12px] font-extrabold text-[var(--shadow-text-primary)]">
                {t('smartFindReplacePanel.find')}
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
                placeholder={t('smartFindReplacePanel.searchWord')}
                autoFocus
                className="h-12 w-full rounded-[16px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-4 text-[14px] font-bold text-[var(--shadow-text-primary)] outline-none focus:border-[var(--shadow-border-strong)] focus:bg-[var(--shadow-bg-surface)]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-extrabold text-[var(--shadow-text-primary)]">
                {t('smartFindReplacePanel.replaceWith')}
              </label>
              <input
                value={replaceText}
                onChange={(event) => setReplaceText(event.target.value)}
                onCompositionStart={() => setIsReplaceComposing(true)}
                onCompositionEnd={(event) => {
                  setIsReplaceComposing(false)
                  setReplaceText(event.currentTarget.value)
                }}
                placeholder={t('smartFindReplacePanel.newWord')}
                className="h-12 w-full rounded-[16px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-4 text-[14px] font-bold text-[var(--shadow-text-primary)] outline-none focus:border-[var(--shadow-border-strong)] focus:bg-[var(--shadow-bg-surface)]"
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
                  ? 'bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)]'
                  : 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]'
              }`}
            >
              {t('smartFindReplacePanel.matchCase')}
            </button>

            <div className="rounded-full bg-[#ecfdf3] px-3 py-2 text-[11px] font-extrabold text-[#027a48] dark:bg-[#027a48]/15 dark:text-[#6ce9a6]">
              {t('smartFindReplacePanel.safe')} {result.safe.length}
            </div>

            <div className="rounded-full bg-[#fff7df] px-3 py-2 text-[11px] font-extrabold text-[#a56a00] dark:bg-[#a56a00]/15 dark:text-[#fec84b]">
              {t('smartFindReplacePanel.risky')} {result.risky.length}
            </div>

            <div className="rounded-full bg-[var(--shadow-bg-soft)] px-3 py-2 text-[11px] font-extrabold text-[var(--shadow-text-secondary)]">
              {reviewItems.length
                ? `${currentIndex + 1} / ${reviewItems.length}`
                : t('smartFindReplacePanel.zeroFound')}
            </div>
          </div>

          {result.ignored.length ? (
            <div className="mt-3 rounded-[18px] bg-[#fff7df] px-4 py-3 dark:bg-[#a56a00]/12">
              <div className="text-[12px] font-extrabold text-[var(--shadow-text-primary)]">
                {t('smartFindReplacePanel.similarText')}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.ignored.slice(0, 12).map((item) => (
                  <span
                    key={item.word}
                    className="max-w-full truncate rounded-full bg-[var(--shadow-bg-surface)] px-3 py-1.5 text-[11px] font-extrabold text-[#a56a00] ring-1 ring-[#ffe0a3] dark:text-[#fec84b] dark:ring-[#a56a00]/30"
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
              className="h-11 rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[12px] font-extrabold text-[var(--shadow-text-primary)] active:scale-95 disabled:opacity-50"
            >
              {t('smartFindReplacePanel.previous')}
            </button>

            <button
              type="button"
              onClick={() => goToMatch('next')}
              disabled={!reviewItems.length || compositionActive}
              className="h-11 rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[12px] font-extrabold text-[var(--shadow-text-primary)] active:scale-95 disabled:opacity-50"
            >
              {t('smartFindReplacePanel.next')}
            </button>

            <button
              type="button"
              onClick={replaceCurrent}
              disabled={!activeMatch || !findText || compositionActive}
              className="h-11 rounded-full bg-[#111827] text-[12px] font-extrabold text-white active:scale-95 disabled:bg-[#9ca3af] dark:bg-white dark:text-[#111827] dark:disabled:bg-[#9ca3af]"
            >
              {t('smartFindReplacePanel.replaceCurrent')}
            </button>

            <button
              type="button"
              onClick={undoReplace}
              disabled={!lastHtml}
              className="h-11 rounded-full bg-[var(--shadow-bg-soft)] text-[12px] font-extrabold text-[var(--shadow-text-primary)] active:scale-95 disabled:opacity-50"
            >
              {t('smartFindReplacePanel.undo')}
            </button>
          </div>

          <div className="mt-4 rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)]">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--shadow-border)] px-4 py-3">
              <div className="min-w-0">
                <div className="text-[13px] font-extrabold text-[var(--shadow-text-primary)]">
                  {t('smartFindReplacePanel.reviewMatches')}
                </div>
                <div className="mt-0.5 text-[11px] font-bold text-[var(--shadow-text-tertiary)]">
                  {t('smartFindReplacePanel.autoSelect')}
                </div>
              </div>

              <div className="shrink-0 text-right">
                <div className="text-[11px] font-extrabold text-[var(--shadow-text-secondary)]">
                  {t('smartFindReplacePanel.selected', { count: selectedMatches.length })}
                </div>
                <div className="mt-1 flex gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedIds(result.safe.map((item) => item.id))
                    }
                    className="rounded-full bg-[#ecfdf3] px-2 py-1 text-[10px] font-extrabold text-[#027a48] dark:bg-[#027a48]/15 dark:text-[#6ce9a6]"
                  >
                    {t('smartFindReplacePanel.selectSafe')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedIds([])}
                    className="rounded-full bg-[var(--shadow-bg-surface)] px-2 py-1 text-[10px] font-extrabold text-[var(--shadow-text-secondary)] ring-1 ring-[var(--shadow-border)]"
                  >
                    {t('smartFindReplacePanel.clear')}
                  </button>
                </div>
              </div>
            </div>

            <div className="max-h-[320px] overflow-y-auto p-2">
              {!findText ? (
                <div className="px-3 py-8 text-center text-[12px] font-bold text-[var(--shadow-text-tertiary)]">
                  {t('smartFindReplacePanel.typeWord')}
                </div>
              ) : null}

              {findText && !reviewItems.length ? (
                <div className="px-3 py-8 text-center text-[12px] font-bold text-[var(--shadow-text-tertiary)]">
                  {t('smartFindReplacePanel.noMatches')}
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
                    className={`mb-2 w-full rounded-[16px] bg-[var(--shadow-bg-surface)] p-3 text-left active:scale-[0.99] ${
                      active
                        ? 'ring-2 ring-[var(--shadow-border-strong)]'
                        : 'ring-1 ring-[var(--shadow-border)]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSelected(item.id)}
                        onClick={(event) => event.stopPropagation()}
                        className="mt-1 h-4 w-4 accent-[#6d4aff]"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-extrabold ${
                              isSafe
                                ? 'bg-[#ecfdf3] text-[#027a48] dark:bg-[#027a48]/15 dark:text-[#6ce9a6]'
                                : 'bg-[#fff7df] text-[#a56a00] dark:bg-[#a56a00]/15 dark:text-[#fec84b]'
                            }`}
                          >
                            {isSafe ? t('smartFindReplacePanel.safe') : t('smartFindReplacePanel.risky')}
                          </span>
                          <span className="text-[11px] font-extrabold text-[var(--shadow-text-tertiary)]">
                            {t('smartFindReplacePanel.matchNumber', { number: index + 1 })}
                          </span>
                        </div>

                        <div className="break-words text-[12px] font-semibold leading-6 text-[var(--shadow-text-secondary)]">
                          {item.context.before}
                          <span className="rounded bg-[#fff2a8] px-1 font-extrabold text-[#111827] dark:bg-[#7a5b00]/45 dark:text-[#fff1b8]">
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

        <div className="border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={replaceSelected}
            disabled={
              !selectedMatches.length ||
              !findText ||
              compositionActive
            }
            className="h-12 w-full rounded-full bg-[#111827] text-[13px] font-extrabold text-white shadow-[0_14px_30px_rgba(17,24,39,0.22)] active:scale-[0.99] disabled:bg-[#9ca3af] dark:bg-white dark:text-[#111827] dark:disabled:bg-[#9ca3af]"
          >
            {selectedMatches.length
              ? t('smartFindReplacePanel.replaceSelected', {
                  count: selectedMatches.length,
                })
              : t('smartFindReplacePanel.noMatchSelected')}
          </button>
        </div>
      </div>
    </div>
  )
}
