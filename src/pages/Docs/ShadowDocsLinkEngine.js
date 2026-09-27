import { restoreShadowDocsSelection } from './ShadowDocsSelectionEngine'

const safeUrl = value => {
  const raw = String(value || '').trim().slice(0, 2048)
  if (!raw) return ''
  try {
    const url = new URL(raw, globalThis.location?.href || 'https://shadow.local/')
    if (!['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol)) return ''
    return raw
  } catch {
    return ''
  }
}

export function applyShadowDocsLink(editor, snapshot, href, { title = '' } = {}) {
  const range = restoreShadowDocsSelection(editor, snapshot)
  const url = safeUrl(href)
  if (!editor || !range || range.collapsed || !url || typeof document === 'undefined') return false
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.rel = 'noopener noreferrer'
  if (String(title || '').trim()) anchor.title = String(title).trim().slice(0, 160)
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
