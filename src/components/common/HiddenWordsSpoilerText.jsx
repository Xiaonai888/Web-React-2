import { useEffect, useMemo, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { getReaderHiddenWords, subscribeReaderHiddenWords } from '../../services/readerHiddenWordsApi'

registerTranslationNamespace('hiddenWordsSpoilerText', {
  en: { reveal: 'Reveal hidden word', conceal: 'Hide word again' },
  km: { reveal: 'បង្ហាញពាក្យដែលបានព្រាល', conceal: 'ព្រាលពាក្យម្តងទៀត' },
  zh: { reveal: '显示隐藏词语', conceal: '再次隐藏词语' },
  ja: { reveal: '非表示ワードを表示', conceal: 'もう一度隠す' },
  ko: { reveal: '숨긴 단어 보기', conceal: '다시 숨기기' },
})

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function splitHiddenWords(text, words) {
  const content = String(text ?? '').normalize('NFC')
  const candidates = Array.from(new Set((Array.isArray(words) ? words : [])
    .map((item) => typeof item === 'string' ? item : (typeof item?.word === 'string' ? item.word : ''))
    .map((value) => value.normalize('NFC').trim().replace(/\s+/g, ' '))
    .filter(Boolean)))
    .sort((a, b) => b.length - a.length)

  if (!candidates.length || !content) return [{ text: content, hidden: false, offset: 0 }]

  const matcher = new RegExp(candidates.map((word) => escapeRegExp(word).replace(/ /g, '\\s+')).join('|'), 'giu')
  const segments = []
  const protectedTokens = Array.from(content.matchAll(/https?:\/\/[^\s]+|#[\p{L}\p{N}\p{M}_]+/giu), (match) => ({
    start: match.index,
    end: match.index + match[0].length,
  }))
  let cursor = 0

  for (const match of content.matchAll(matcher)) {
    const start = match.index
    const end = start + match[0].length
    if (protectedTokens.some((token) => start < token.end && end > token.start)) continue
    const asciiStart = /^[a-z0-9]/i.test(match[0])
    const asciiEnd = /[a-z0-9]$/i.test(match[0])
    const previous = start ? content[start - 1] : ''
    const next = content[end] || ''
    if ((asciiStart && /[\p{L}\p{N}_]/u.test(previous)) ||
        (asciiEnd && /[\p{L}\p{N}_]/u.test(next))) continue

    if (start > cursor) segments.push({ text: content.slice(cursor, start), hidden: false, offset: cursor })
    segments.push({ text: match[0], hidden: true, offset: start })
    cursor = end
  }

  if (cursor < content.length) segments.push({ text: content.slice(cursor), hidden: false, offset: cursor })
  return segments.length ? segments : [{ text: content, hidden: false, offset: 0 }]
}

function SpoilerWord({ text, labelReveal, labelConceal }) {
  const [visible, setVisible] = useState(false)

  return (
    <button
      type="button"
      aria-label={visible ? labelConceal : labelReveal}
      aria-pressed={visible}
      onClick={(event) => {
        event.stopPropagation()
        setVisible((current) => !current)
      }}
      className="inline rounded-[5px] bg-[var(--shadow-bg-soft)] px-1 align-baseline text-inherit outline-offset-2"
    >
      <span className={visible ? 'break-words' : 'inline-block select-none break-words blur-[5px]'}>
        {text}
      </span>
    </button>
  )
}

export default function HiddenWordsSpoilerText({
  text,
  words,
  sourceType,
  renderText,
  className = '',
}) {
  const { t } = useDisplayTranslation()
  const [accountWords, setAccountWords] = useState([])
  const isPost = sourceType === 'reader_post' || sourceType === 'author_post'

  useEffect(() => {
    if (!isPost || words !== undefined) return undefined

    let active = true
    const reload = () => {
      void getReaderHiddenWords()
        .then((result) => {
          if (active) setAccountWords(result)
        })
        .catch(() => {})
    }

    reload()
    const unsubscribe = subscribeReaderHiddenWords(reload)
    return () => {
      active = false
      unsubscribe()
    }
  }, [isPost, words])

  const selectedWords = words === undefined ? accountWords : words
  const segments = useMemo(() => (
    isPost
      ? splitHiddenWords(text, selectedWords)
      : [{ text: String(text ?? ''), hidden: false, offset: 0 }]
  ), [text, selectedWords, isPost])

  return (
    <span className={className}>
      {segments.map((segment) => segment.hidden ? (
        <SpoilerWord
          key={`${segment.offset}:${segment.text}`}
          text={segment.text}
          labelReveal={t('hiddenWordsSpoilerText.reveal')}
          labelConceal={t('hiddenWordsSpoilerText.conceal')}
        />
      ) : (
        <span key={`${segment.offset}:plain`}>{typeof renderText === 'function' ? renderText(segment.text) : segment.text}</span>
      ))}
    </span>
  )
}
