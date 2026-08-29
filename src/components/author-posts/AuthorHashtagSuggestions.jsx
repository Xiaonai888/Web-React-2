import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { fetchAuthorHashtagSuggestions } from '../../services/authorHashtagsApi'

function getActiveHashtag(text, caret) {
  const safeText = String(text || '')
  const safeCaret = Math.max(
    0,
    Math.min(Number(caret) || 0, safeText.length)
  )
  const beforeCaret = safeText.slice(0, safeCaret)
  const match = beforeCaret.match(
    /(?:^|[^\p{L}\p{N}\p{M}_#])#([\p{L}\p{N}\p{M}_]{0,64})$/u
  )

  if (!match) return null

  const query = match[1] || ''
  const tokenLength = query.length + 1

  return {
    query,
    start: safeCaret - tokenLength,
    end: safeCaret,
  }
}

function formatPostCount(value) {
  const count = Math.max(0, Number(value) || 0)

  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(
      count >= 10000000 ? 0 : 1
    )}M posts`
  }

  if (count >= 1000) {
    return `${(count / 1000).toFixed(
      count >= 10000 ? 0 : 1
    )}K posts`
  }

  return `${count.toLocaleString()} ${count === 1 ? 'post' : 'posts'}`
}

export default function AuthorHashtagSuggestions({
  textareaRef,
  draft,
  onDraftChange,
  maxLength = 10000,
}) {
  const requestIdRef = useRef(0)
  const [activeHashtag, setActiveHashtag] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)

  const refreshActiveHashtag = useCallback(() => {
    const textarea = textareaRef?.current

    if (!textarea) {
      setActiveHashtag(null)
      return
    }

    setActiveHashtag(
      getActiveHashtag(
        draft,
        textarea.selectionStart
      )
    )
  }, [draft, textareaRef])

  useEffect(() => {
    refreshActiveHashtag()

    const textarea = textareaRef?.current

    if (!textarea) return undefined

    const handleCaretChange = () => {
      refreshActiveHashtag()
    }

    textarea.addEventListener('keyup', handleCaretChange)
    textarea.addEventListener('click', handleCaretChange)
    textarea.addEventListener('select', handleCaretChange)
    textarea.addEventListener('focus', handleCaretChange)

    return () => {
      textarea.removeEventListener('keyup', handleCaretChange)
      textarea.removeEventListener('click', handleCaretChange)
      textarea.removeEventListener('select', handleCaretChange)
      textarea.removeEventListener('focus', handleCaretChange)
    }
  }, [refreshActiveHashtag, textareaRef])

  useEffect(() => {
    if (!activeHashtag) {
      setSuggestions([])
      setLoading(false)
      return undefined
    }

    const controller = new AbortController()
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId

    const timer = window.setTimeout(async () => {
      try {
        setLoading(true)

        const items = await fetchAuthorHashtagSuggestions(
          activeHashtag.query,
          {
            limit: 8,
            signal: controller.signal,
          }
        )

        if (requestIdRef.current === requestId) {
          setSuggestions(items)
        }
      } catch (error) {
        if (
          error?.name !== 'AbortError' &&
          requestIdRef.current === requestId
        ) {
          setSuggestions([])
        }
      } finally {
        if (requestIdRef.current === requestId) {
          setLoading(false)
        }
      }
    }, 280)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [activeHashtag?.query])

  function selectSuggestion(item) {
    if (!activeHashtag) return

    const tag = String(item?.tag || '').trim()

    if (!tag.startsWith('#')) return

    const before = draft.slice(0, activeHashtag.start)
    const after = draft.slice(activeHashtag.end)
    const spacer = after && /^\s/u.test(after) ? '' : ' '
    const insertion = `${tag}${spacer}`
    const nextDraft = `${before}${insertion}${after}`.slice(
      0,
      maxLength
    )
    const nextCaret = Math.min(
      before.length + insertion.length,
      nextDraft.length
    )

    onDraftChange(nextDraft)
    setSuggestions([])
    setActiveHashtag(null)

    window.requestAnimationFrame(() => {
      const textarea = textareaRef?.current

      if (!textarea) return

      textarea.focus()
      textarea.setSelectionRange(nextCaret, nextCaret)
    })
  }

  if (!activeHashtag) return null

  if (!loading && !suggestions.length) {
    return null
  }

  return (
    <div className="relative z-20 mt-2 overflow-hidden rounded-[14px] border border-[#e5e7eb] bg-white shadow-[0_10px_30px_rgba(17,24,39,0.12)]">
      {loading && !suggestions.length ? (
        <div className="px-4 py-3 text-[13px] text-[#9ca3af]">
          Searching tags...
        </div>
      ) : (
        suggestions.map((item) => (
          <button
            key={item.tag}
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => selectSuggestion(item)}
            className="flex w-full items-center justify-between gap-4 border-b border-[#f1f3f5] px-4 py-3 text-left last:border-b-0 active:bg-[#f3f4f6]"
          >
            <span className="min-w-0 flex-1 truncate text-[15px] font-normal text-[#111827]">
              {item.tag}
            </span>

            <span className="shrink-0 text-[12px] font-normal text-[#8b93a1]">
              {formatPostCount(item.post_count)}
            </span>
          </button>
        ))
      )}
    </div>
  )
}
