import { restoreShadowDocsSelection } from './ShadowDocsSelectionEngine'

const safeUrl = value => {
  const raw = String(value ?? '').trim()
  if (!raw || raw.length > 2048 || /[\u0000-\u001F\u007F]/.test(raw)) return null
  try {
    const parsed = new URL(raw, globalThis.location?.href || 'https://shadow.local/')
    const protocol = parsed.protocol
    if (protocol === 'https:' || protocol === 'http:') {
      if (!parsed.hostname || parsed.username || parsed.password) return null
      return { protocol, suffix: `${parsed.host}${parsed.pathname}${parsed.search}${parsed.hash}` }
    }
    if (protocol === 'mailto:' || protocol === 'tel:') {
      return { protocol, suffix: `${parsed.pathname}${parsed.search}${parsed.hash}` }
    }
    return null
  } catch {
    return null
  }
}

export function applyShadowDocsLink(editor, snapshot, href, { title = '' } = {}) {
  const range = restoreShadowDocsSelection(editor, snapshot)
  const url = safeUrl(href)
  if (!editor || !range || range.collapsed || !url || typeof document === 'undefined') return false
  if (!editor.contains(range.startContainer) || !editor.contains(range.endContainer)) return false
  const anchor = document.createElement('a')
  if (url.protocol === 'https:') anchor.href = `https://${url.suffix}`
  else if (url.protocol === 'http:') anchor.href = `http://${url.suffix}`
  else if (url.protocol === 'mailto:') anchor.href = `mailto:${url.suffix}`
  else if (url.protocol === 'tel:') anchor.href = `tel:${url.suffix}`
  else return false
  anchor.rel = 'noopener noreferrer'
  if (String(title ?? '').trim()) anchor.title = String(title).trim().slice(0, 160)
  try {
    range.surroundContents(anchor)
  } catch {
    const fragment = range.extractContents()
    anchor.appendChild(fragment)
    range.insertNode(anchor)
  }
  return true
}

export function removeShadowDocsLink(editor, snapshot) {
  const range = restoreShadowDocsSelection(editor, snapshot)
  if (!editor || !range) return false
  const anchors = new Set()
  const start = range.startContainer.nodeType === 1 ? range.startContainer : range.startContainer.parentElement
  const end = range.endContainer.nodeType === 1 ? range.endContainer : range.endContainer.parentElement
  const startAnchor = start?.closest?.('a')
  const endAnchor = end?.closest?.('a')
  if (startAnchor && editor.contains(startAnchor)) anchors.add(startAnchor)
  if (endAnchor && editor.contains(endAnchor)) anchors.add(endAnchor)
  editor.querySelectorAll('a').forEach(anchor => {
    try { if (range.intersectsNode(anchor)) anchors.add(anchor) } catch {}
  })
  anchors.forEach(anchor => anchor.replaceWith(...anchor.childNodes))
  return anchors.size > 0
}

export function createShadowDocsBookmark(element, name) {
  if (!element) return ''
  const clean = String(name || '').trim().replace(/[^\p{L}\p{N}_-]+/gu, '-').replace(/^-+|-+$/g, '').slice(0, 80)
  if (!clean) return ''
  const id = `sd-bookmark-${clean}`
  element.id = id
  element.dataset.shadowDocsBookmark = clean
  return id
}

export function getShadowDocsBookmarks(editor) {
  if (!editor) return []
  return [...editor.querySelectorAll('[data-shadow-docs-bookmark]')].map(element => ({
    id: element.id || '',
    name: element.dataset.shadowDocsBookmark || '',
    text: (element.textContent || '').trim().slice(0, 160),
  }))
}
