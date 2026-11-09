import { getShadowDocsSelectedBlocks, restoreShadowDocsSelection } from './ShadowDocsSelectionEngine'
import { toggleShadowDocsList } from './ShadowDocsFormattingEngine'

const LIST_TAGS = new Set(['OL', 'UL'])
const NUMBER_STYLES = Object.freeze({ decimal: '1', lowerAlpha: 'a', upperAlpha: 'A', lowerRoman: 'i', upperRoman: 'I' })

function listItems(editor, snapshot) {
  if (!editor || !snapshot) return []
  const blocks = getShadowDocsSelectedBlocks(editor, snapshot)
  return [...new Set(blocks.map(block => block.closest?.('li')).filter(item => item && editor.contains(item) && LIST_TAGS.has(item.parentElement?.tagName)))]
}

function selectedLists(editor, snapshot, listTag = '') {
  const blocks = getShadowDocsSelectedBlocks(editor, snapshot)
  const lists = blocks.map(block => {
    if (LIST_TAGS.has(block.tagName)) return block
    if (block.tagName === 'LI') return block.parentElement
    return block.closest?.('ol,ul')
  }).filter(list => list && editor.contains(list) && (!listTag || list.tagName === listTag))
  return [...new Set(lists)]
}

export function removeShadowDocsHomeList(editor, snapshot) {
  const items = listItems(editor, snapshot)
  if (!items.length || typeof document === 'undefined') return false
  if (items.some(item => item.querySelector('ol,ul'))) return false
  const groups = new Map()
  items.forEach(item => {
    const list = item.parentElement
    if (!groups.has(list)) groups.set(list, new Set())
    groups.get(list).add(item)
  })
  groups.forEach((selected, list) => {
    const children = [...list.children].filter(item => item.tagName === 'LI')
    const start = list.tagName === 'OL' ? Math.max(1, Number(list.getAttribute('start')) || 1) : 1
    const replacement = document.createDocumentFragment()
    let currentList = null
    children.forEach((item, index) => {
      if (selected.has(item)) {
        currentList = null
        const paragraph = document.createElement('p')
        paragraph.style.cssText = item.style.cssText
        while (item.firstChild) paragraph.appendChild(item.firstChild)
        replacement.appendChild(paragraph)
      } else {
        if (!currentList) {
          currentList = list.cloneNode(false)
          if (list.tagName === 'OL') currentList.setAttribute('start', String(start + index))
          replacement.appendChild(currentList)
        }
        currentList.appendChild(item)
      }
    })
    list.replaceWith(replacement)
  })
  return true
}

export function applyShadowDocsHomeMultilevelList(editor, snapshot) {
  const selected = listItems(editor, snapshot)
  if (!selected.length) return toggleShadowDocsList(editor, snapshot, 'ol')
  const parent = selected[0].parentElement
  if (!selected.every(item => item.parentElement === parent)) return false
  const siblings = [...parent.children]
  const selectedIndices = selected.map(item => siblings.indexOf(item)).sort((a, b) => a - b)
  const first = selectedIndices[0]
  if (first <= 0 || selectedIndices.some((index, position) => index !== first + position)) return false
  const previous = siblings[first - 1]
  if (previous.tagName !== 'LI') return false
  let sublist = [...previous.children].find(item => item.tagName === parent.tagName)
  if (!sublist) {
    sublist = document.createElement(parent.tagName.toLowerCase())
    previous.appendChild(sublist)
  }
  selectedIndices.map(index => siblings[index]).forEach(item => sublist.appendChild(item))
  return true
}

export function renumberShadowDocsHomeList(editor, snapshot, start = 1) {
  const lists = selectedLists(editor, snapshot, 'OL')
  const number = Number(start)
  if (!lists.length || !Number.isInteger(number) || number < 1 || number > 9999) return false
  lists.forEach(list => {
    list.setAttribute('start', String(number))
    ;[...list.children].filter(item => item.tagName === 'LI').forEach(item => item.removeAttribute('value'))
  })
  return true
}

export function continueShadowDocsHomeNumbering(editor, snapshot) {
  const lists = selectedLists(editor, snapshot, 'OL')
  let changed = false
  lists.forEach(list => {
    let previous = list.previousElementSibling
    while (previous && previous.tagName !== 'OL') previous = previous.previousElementSibling
    if (!previous) return
    const start = Math.max(1, Number(previous.getAttribute('start')) || 1)
    const itemCount = [...previous.children].filter(item => item.tagName === 'LI').length
    if (itemCount < 1) return
    list.setAttribute('start', String(start + itemCount))
    changed = true
  })
  return changed
}

export function setShadowDocsHomeNumberingOptions(editor, snapshot, value) {
  const lists = selectedLists(editor, snapshot, 'OL')
  const requested = NUMBER_STYLES[value?.style] || NUMBER_STYLES[String(value || '')]
  if (!lists.length) return false
  const styles = Object.values(NUMBER_STYLES)
  lists.forEach(list => {
    const current = list.getAttribute('type') || '1'
    const next = requested || styles[(styles.indexOf(current) + 1) % styles.length]
    list.setAttribute('type', next)
  })
  return true
}

export function applyShadowDocsHomeAutoNumbering(editor, snapshot) {
  if (!editor || !snapshot?.collapsed || typeof document === 'undefined') return false
  const range = restoreShadowDocsSelection(editor, snapshot)
  if (!range || !range.collapsed || range.startContainer?.nodeType !== 3) return false
  const textNode = range.startContainer
  const block = textNode.parentElement
  if (!block || !['P', 'DIV'].includes(block.tagName) || (block !== editor && block.childNodes.length !== 1)) return false
  const prefix = textNode.nodeValue.slice(0, range.startOffset)
  const match = prefix.match(/^\s*(?:(\d{1,4})[.)]|([-*]))\s+$/)
  if (!match) return false
  const type = match[1] ? 'ol' : 'ul'
  const list = document.createElement(type)
  if (match[1]) list.setAttribute('start', String(Math.max(1, Number(match[1]))))
  const item = document.createElement('li')
  textNode.deleteData(0, prefix.length)
  if (block === editor) editor.replaceChild(list, textNode)
  else block.replaceWith(list)
  item.appendChild(textNode)
  list.appendChild(item)
  const selection = globalThis.getSelection?.()
  if (selection) {
    const cursor = document.createRange()
    cursor.setStart(textNode, 0)
    cursor.collapse(true)
    selection.removeAllRanges()
    selection.addRange(cursor)
  }
  return true
}
