import React, { useMemo } from 'react'

const RICH_TAG_PATTERN = /<(?:p|div|br|strong|b|em|i|img)\b/i

export function isRichEpisodeContent(value) {
  return RICH_TAG_PATTERN.test(String(value || ''))
}

export function episodeContentToPlainText(value) {
  const source = String(value || '')
  if (!source) return ''
  if (!isRichEpisodeContent(source)) return source

  if (typeof DOMParser === 'undefined') {
    return source
      .replace(/<img\b[^>]*>/gi, ' ')
      .replace(/<br\s*\/?\s*>/gi, '\n')
      .replace(/<\/(?:p|div)>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  }

  const documentValue = new DOMParser().parseFromString(`<div>${source}</div>`, 'text/html')
  const root = documentValue.body.firstElementChild
  if (!root) return ''

  const parts = []
  root.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || ''
      if (text.trim()) parts.push(text)
      return
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return
    const element = node
    if (element.tagName === 'IMG') return
    const text = element.textContent || ''
    if (text.trim()) parts.push(text)
  })

  return parts.join('\n\n').replace(/\n{3,}/g, '\n\n').trim()
}

function safeImageUrl(value) {
  const source = String(value || '').trim()
  if (!source) return ''

  try {
    const url = new URL(source, window.location.origin)
    if (!['http:', 'https:'].includes(url.protocol)) return ''
    return url.href
  } catch {
    return ''
  }
}

function alignmentFromElement(element) {
  const inlineValue = String(element.style?.textAlign || '').toLowerCase()
  const attributeValue = String(element.getAttribute?.('align') || '').toLowerCase()
  const value = inlineValue || attributeValue
  return ['left', 'center', 'right'].includes(value) ? value : 'left'
}

function renderChildren(element, context, keyPrefix) {
  return Array.from(element.childNodes).map((child, index) =>
    renderNode(child, context, `${keyPrefix}-${index}`)
  )
}

function renderNode(node, context, key) {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent
  if (node.nodeType !== Node.ELEMENT_NODE) return null

  const element = node
  const tagName = element.tagName.toLowerCase()

  if (tagName === 'br') return <br key={key} />

  if (tagName === 'strong' || tagName === 'b') {
    return <strong key={key}>{renderChildren(element, context, key)}</strong>
  }

  if (tagName === 'em' || tagName === 'i') {
    return <em key={key}>{renderChildren(element, context, key)}</em>
  }

  if (tagName === 'img') {
    const source = safeImageUrl(element.getAttribute('src'))
    if (!source) return null

    return (
      <img
        key={key}
        src={source}
        alt={String(element.getAttribute('alt') || 'Episode image').slice(0, 200)}
        loading="lazy"
        decoding="async"
        className="my-5 block h-auto max-h-[72vh] w-full rounded-[12px] object-contain"
      />
    )
  }

  if (tagName === 'p' || tagName === 'div') {
    return (
      <p
        key={key}
        className={`${context.theme.text} ${context.lineHeightClass} whitespace-pre-wrap tracking-[0.003em] [overflow-wrap:normal] [word-break:normal]`}
        style={{
          fontFamily: context.fontFamily,
          fontSize: `${context.fontSizePx}px`,
          textAlign: alignmentFromElement(element),
        }}
      >
        {renderChildren(element, context, key)}
      </p>
    )
  }

  return <React.Fragment key={key}>{renderChildren(element, context, key)}</React.Fragment>
}

export default function RichEpisodeContent({
  content,
  fontSizePx,
  fontFamily,
  lineSpacing,
  theme,
}) {
  const lineHeightClass =
    lineSpacing === 'compact'
      ? 'leading-[1.85]'
      : lineSpacing === 'normal'
        ? 'leading-[2.05]'
        : 'leading-[2.25]'

  const renderedContent = useMemo(() => {
    const source = String(content || '').trim()
    if (!source) return []

    if (!isRichEpisodeContent(source) || typeof DOMParser === 'undefined') {
      return source
        .split(/\n\s*\n+/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
        .map((paragraph, index) => (
          <p
            key={`${paragraph.slice(0, 20)}-${index}`}
            className={`${theme.text} ${lineHeightClass} whitespace-pre-line tracking-[0.003em] [overflow-wrap:normal] [word-break:normal]`}
            style={{ fontFamily, fontSize: `${fontSizePx}px` }}
          >
            {paragraph}
          </p>
        ))
    }

    const parsed = new DOMParser().parseFromString(`<div>${source}</div>`, 'text/html')
    const root = parsed.body.firstElementChild
    if (!root) return []

    const context = { fontSizePx, fontFamily, lineHeightClass, theme }
    return Array.from(root.childNodes).map((node, index) =>
      renderNode(node, context, `episode-node-${index}`)
    )
  }, [content, fontFamily, fontSizePx, lineHeightClass, theme])

  if (!renderedContent.length) {
    return (
      <p className={`text-[15px] font-semibold leading-8 ${theme.muted}`}>
        No episode content found.
      </p>
    )
  }

  return (
    <div className={lineSpacing === 'compact' ? 'space-y-5' : lineSpacing === 'normal' ? 'space-y-6' : 'space-y-7'}>
      {renderedContent}
    </div>
  )
}
