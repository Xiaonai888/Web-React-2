import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorDiscoverPostText', {
  en: {
    more: 'more',
  },
  km: {
    more: 'បន្ថែម',
  },
  zh: {
    more: '更多',
  },
  ja: {
    more: 'もっと見る',
  },
  ko: {
    more: '더보기',
  },
})

function splitGraphemes(value) {
  const text = String(value || '')

  if (
    typeof Intl !== 'undefined' &&
    typeof Intl.Segmenter === 'function'
  ) {
    const segmenter = new Intl.Segmenter(
      undefined,
      {
        granularity: 'grapheme',
      }
    )

    return Array.from(
      segmenter.segment(text),
      (item) => item.segment
    )
  }

  return Array.from(text)
}

function trimToReadableBoundary(value) {
  const text = String(value || '').trimEnd()

  if (!text) return ''

  const lastSpace = text.lastIndexOf(' ')

  if (
    lastSpace > 0 &&
    text.length - lastSpace <= 28
  ) {
    return text
      .slice(0, lastSpace)
      .trimEnd()
  }

  return text
}

export default function AuthorDiscoverPostText({
  text,
  renderText,
  className = '',
}) {
  const { t } = useDisplayTranslation()
  const moreLabel = t('authorDiscoverPostText.more')
  const containerRef = useRef(null)
  const probeRef = useRef(null)
  const probeTextRef = useRef(null)
  const probeMoreRef = useRef(null)

  const [expanded, setExpanded] =
    useState(false)
  const [overflowing, setOverflowing] =
    useState(false)
  const [collapsedText, setCollapsedText] =
    useState(String(text || ''))

  useEffect(() => {
    setExpanded(false)
    setCollapsedText(String(text || ''))
  }, [text])

  useLayoutEffect(() => {
    if (expanded) return undefined

    const container = containerRef.current
    const probe = probeRef.current
    const probeText = probeTextRef.current
    const probeMore = probeMoreRef.current

    if (
      !container ||
      !probe ||
      !probeText ||
      !probeMore
    ) {
      return undefined
    }

    let frame = 0

    const measure = () => {
      window.cancelAnimationFrame(frame)

      frame = window.requestAnimationFrame(() => {
        const width =
          container.getBoundingClientRect().width

        if (!width) return

        probe.style.width = `${width}px`

        const computed =
          window.getComputedStyle(probe)
        const lineHeight =
          Number.parseFloat(
            computed.lineHeight
          ) || 24
        const maxHeight =
          lineHeight * 2 + 1

        probeMore.style.display = 'none'
        probeText.textContent =
          String(text || '')

        if (
          probe.scrollHeight <= maxHeight
        ) {
          setOverflowing(false)
          setCollapsedText(
            String(text || '')
          )
          return
        }

        probeMore.style.display = 'inline'

        const graphemes =
          splitGraphemes(text)

        let low = 0
        let high = graphemes.length
        let best = ''

        while (low <= high) {
          const middle = Math.floor(
            (low + high) / 2
          )
          const candidate =
            graphemes
              .slice(0, middle)
              .join('')
              .trimEnd()

          probeText.textContent =
            candidate

          if (
            probe.scrollHeight <=
            maxHeight
          ) {
            best = candidate
            low = middle + 1
          } else {
            high = middle - 1
          }
        }

        const readable =
          trimToReadableBoundary(best)

        probeText.textContent =
          readable

        if (
          readable &&
          probe.scrollHeight <= maxHeight
        ) {
          setCollapsedText(readable)
        } else {
          setCollapsedText(best)
        }

        setOverflowing(true)
      })
    }

    measure()

    const observer =
      typeof ResizeObserver !==
      'undefined'
        ? new ResizeObserver(measure)
        : null

    observer?.observe(container)
    window.addEventListener(
      'resize',
      measure
    )

    return () => {
      window.cancelAnimationFrame(frame)
      observer?.disconnect()
      window.removeEventListener(
        'resize',
        measure
      )
    }
  }, [expanded, text, moreLabel])

  const renderValue = (value) =>
    typeof renderText === 'function'
      ? renderText(value)
      : value

  const handleTextToggle = (event) => {
  if (!overflowing) return
  if (event.target instanceof Element && event.target.closest('a, button')) return
  setExpanded((current) => !current)
}

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      {expanded ? (
        <p
  onClick={handleTextToggle}
  className={`cursor-pointer whitespace-pre-wrap break-words ${className}`}
>
          {renderValue(text)}
        </p>
      ) : (
        <p
  onClick={handleTextToggle}
  className={`whitespace-pre-wrap break-words ${overflowing ? 'cursor-pointer' : ''} ${className}`}
>
          {renderValue(
            overflowing
              ? collapsedText
              : text
          )}

          {overflowing ? (
            <>
              {' '}
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  setExpanded(true)
                }}
                className="inline font-semibold text-[var(--shadow-text-secondary)] active:opacity-70"
              >
                ... {moreLabel}
              </button>
            </>
          ) : null}
        </p>
      )}

      <p
        ref={probeRef}
        aria-hidden="true"
        className={`whitespace-pre-wrap break-words ${className}`}
        style={{
          position: 'fixed',
          left: '-10000px',
          top: 0,
          visibility: 'hidden',
          pointerEvents: 'none',
          margin: 0,
        }}
      >
        <span ref={probeTextRef} />
        <span
          ref={probeMoreRef}
          className="font-semibold text-[var(--shadow-text-secondary)]"
        >
          {' '}
          ... {moreLabel}
        </span>
      </p>
    </div>
  )
}
