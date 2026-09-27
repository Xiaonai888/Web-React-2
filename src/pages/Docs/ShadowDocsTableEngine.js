import { restoreShadowDocsSelection } from './ShadowDocsSelectionEngine'

const clamp = (value, min, max, fallback) => Number.isFinite(Number(value)) ? Math.max(min, Math.min(max, Math.round(Number(value)))) : fallback

function cell(tag = 'td') {
  const element = document.createElement(tag)
  element.appendChild(document.createElement('br'))
  return element
}

export function createShadowDocsTable(rows = 2, columns = 2, { header = false } = {}) {
  if (typeof document === 'undefined') return null
  const rowCount = clamp(rows, 1, 50, 2)
  const columnCount = clamp(columns, 1, 20, 2)
  const table = document.createElement('table')
  table.dataset.shadowDocsTable = '1'
  table.style.width = '100%'
  table.style.borderCollapse = 'collapse'
  const body = document.createElement('tbody')
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    const row = document.createElement('tr')
    for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
      const item = cell(header && rowIndex === 0 ? 'th' : 'td')
      item.style.border = '1px solid #b9b4c7'
      item.style.padding = '6px'
      row.appendChild(item)
    }
    body.appendChild(row)
  }
  table.appendChild(body)
  return table
}

export function insertShadowDocsTable(editor, snapshot, rows = 2, columns = 2, options = {}) {
  const range = restoreShadowDocsSelection(editor, snapshot)
  if (!editor || !range || typeof document === 'undefined') return false
  const table = createShadowDocsTable(rows, columns, options)
  if (!table) return false
  range.deleteContents()
  range.insertNode(table)
  const paragraph = document.createElement('p')
  paragraph.appendChild(document.createElement('br'))
  table.after(paragraph)
  return table
}

export function getShadowDocsTableCell(node) {
  const element = node?.nodeType === 1 ? node : node?.parentElement
  return element?.closest?.('td,th') || null
}

export function addShadowDocsTableRow(cellNode, after = true) {
  const current = getShadowDocsTableCell(cellNode)
  const row = current?.parentElement
  if (!row || !row.parentElement) return false
  const next = document.createElement('tr')
  const count = Math.max(1, row.cells.length)
  for (let index = 0; index < count; index += 1) {
    const item = cell('td')
    item.style.border = '1px solid #b9b4c7'
    item.style.padding = '6px'
    next.appendChild(item)
  }
  row.insertAdjacentElement(after ? 'afterend' : 'beforebegin', next)
  return true
}

export function deleteShadowDocsTableRow(cellNode) {
  const current = getShadowDocsTableCell(cellNode)
  const row = current?.parentElement
  const table = row?.closest?.('table')
  if (!row || !table) return false
  if (table.rows.length <= 1) {
    table.remove()
    return true
  }
  row.remove()
  return true
}

export function addShadowDocsTableColumn(cellNode, after = true) {
  const current = getShadowDocsTableCell(cellNode)
  const table = current?.closest?.('table')
  if (!current || !table) return false
  const columnIndex = current.cellIndex + (after ? 1 : 0)
  ;[...table.rows].forEach(row => {
    const reference = row.cells[columnIndex] || null
    const item = cell(row.parentElement?.tagName === 'THEAD' ? 'th' : 'td')
    item.style.border = '1px solid #b9b4c7'
    item.style.padding = '6px'
    row.insertBefore(item, reference)
  })
  return true
}

export function deleteShadowDocsTableColumn(cellNode) {
  const current = getShadowDocsTableCell(cellNode)
  const table = current?.closest?.('table')
  if (!current || !table) return false
  const columnIndex = current.cellIndex
  if ([...table.rows].every(row => row.cells.length <= 1)) {
    table.remove()
    return true
  }
  ;[...table.rows].forEach(row => row.cells[columnIndex]?.remove())
  return true
}
