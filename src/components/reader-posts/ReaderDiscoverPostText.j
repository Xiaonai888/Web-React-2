import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

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

export default function ReaderDiscoverPostText({
  text,
  renderText,
  className = '',
}) {
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

        const fullHeight =
          probe.scrollHeight

        if (fullHeight <= maxHeight) {
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
          probe.scrollHeight <=
            maxHeight
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
  }, [expanded, text])

  const renderValue = (value) =>
    typeof renderText === 'function'
      ? renderText(value)
      : value

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      {expanded ? (
        <p
          onClick={() =>
            setExpanded(false)
          }
          className={`cursor-pointer whitespace-pre-wrap break-words ${className}`}
        >
          {renderValue(text)}
        </p>
      ) : (
        <p
          className={`whitespace-pre-wrap break-words ${className}`}
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
                className="inline font-semibold text-[#65676b] active:opacity-70"
              >
                ... more
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
          className="font-semibold text-[#65676b]"
        >
          {' '}
          ... more
        </span>
      </p>
    </div>
  )
}
