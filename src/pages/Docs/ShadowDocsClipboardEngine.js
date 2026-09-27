import { sanitizeShadowDocsHTML } from './ShadowDocsBookModel'
import { restoreShadowDocsSelection } from './ShadowDocsSelectionEngine'

const plain = value => String(value ?? '').slice(0, 500_000)

export function getShadowDocsSelectionPayload(editor, snapshot) {
  const range = restoreShadowDocsSelection(editor, snapshot)
  if (!range || range.collapsed || typeof document === 'undefined') return null
  const wrapper = document.createElement('div')
  wrapper.appendChild(range.cloneContents())
  return {
    html: sanitizeShadowDocsHTML(wrapper.innerHTML),
    text: plain(range.toString()),
  }
}

export async function copyShadowDocsSelection(editor, snapshot) {
  const payload = getShadowDocsSelectionPayload(editor, snapshot)
  if (!payload) return false
  if (navigator.clipboard?.write && typeof ClipboardItem !== 'undefined') {
    const item = new ClipboardItem({
      'text/plain': new Blob([payload.text], { type: 'text/plain' }),
      'text/html': new Blob([payload.html], { type: 'text/html' }),
    })
    await navigator.clipboard.write([item])
    return true
  }
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(payload.text)
    return true
  }
  return false
}

export async function cutShadowDocsSelection(editor, snapshot) {
  const copied = await copyShadowDocsSelection(editor, snapshot)
  if (!copied) return false
  const range = restoreShadowDocsSelection(editor, snapshot)
  if (!range || range.collapsed) return false
  range.deleteContents()
  editor?.normalize?.()
  return true
}

export function insertShadowDocsClipboardHTML(editor, snapshot, html) {
  const range = restoreShadowDocsSelection(editor, snapshot)
  if (!editor || !range || typeof document === 'undefined') return false
  const safe = sanitizeShadowDocsHTML(String(html || '').slice(0, 500_000))
  const template = document.createElement('template')
  template.innerHTML = safe
  range.deleteContents()
  range.insertNode(template.content)
  editor.normalize()
  return true
}

export function insertShadowDocsClipboardText(editor, snapshot, text) {
  const range = restoreShadowDocsSelection(editor, snapshot)
  if (!editor || !range || typeof document === 'undefined') return false
  range.deleteContents()
  range.insertNode(document.createTextNode(plain(text)))
  editor.normalize()
  return true
}
