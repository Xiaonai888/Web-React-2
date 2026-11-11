import { SHADOW_DOCS_INSERT_RESOURCES, SHADOW_DOCS_RESOURCE_CATEGORIES } from './ShadowDocsInsertResourcesCatalog'

const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character])

function blockToHTML(block) {
  if (!block || typeof block !== 'object') return ''
  const text = escapeHTML(block.text)
  if (block.type === 'heading') return `<h2>${text}</h2>`
  if (block.type === 'heading3') return `<h3>${text}</h3>`
  if (block.type === 'paragraph') return `<p>${text}</p>`
  if (block.type === 'quote') return `<blockquote><p>${text}</p></blockquote>`
  if (block.type === 'list' || block.type === 'numbered') {
    const tag = block.type === 'numbered' ? 'ol' : 'ul'
    const items = Array.isArray(block.items) ? block.items.slice(0, 30) : []
    return `<${tag}>${items.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</${tag}>`
  }
  if (block.type === 'table') {
    const rows = Array.isArray(block.rows) ? block.rows.slice(0, 24) : []
    if (!rows.length) return ''
    const width = Math.min(6, Math.max(1, ...(rows.map(row => Array.isArray(row) ? row.length : 0))))
    return `<table><tbody>${rows.map((row, rowIndex) => `<tr>${Array.from({ length: width }, (_, i) => {
      const tag = rowIndex === 0 ? 'th' : 'td'
      return `<${tag}>${escapeHTML(Array.isArray(row) ? row[i] ?? '' : '')}</${tag}>`
    }).join('')}</tr>`).join('')}</tbody></table>`
  }
  return ''
}

export function listShadowDocsInsertResources({ category = 'All', search = '' } = {}) {
  const currentCategory = SHADOW_DOCS_RESOURCE_CATEGORIES.includes(category) ? category : 'All'
  const term = String(search || '').trim().toLocaleLowerCase().slice(0, 100)
  return SHADOW_DOCS_INSERT_RESOURCES.filter(item => {
    if (currentCategory !== 'All' && item.category !== currentCategory) return false
    if (!term) return true
    return [item.title, item.description, item.category, ...item.keywords]
      .some(value => String(value).toLocaleLowerCase().includes(term))
  })
}

export function getShadowDocsInsertResource(id) {
  return SHADOW_DOCS_INSERT_RESOURCES.find(item => item.id === id) || null
}

export function buildShadowDocsInsertResource(id) {
  const item = getShadowDocsInsertResource(id)
  if (!item) return null
  const blocks = Array.isArray(item.blocks) ? item.blocks.slice(0, 30) : []
  const html = blocks.map(blockToHTML).join('')
  if (!html || html.length > 16000) return null
  return { id: item.id, title: item.title, html }
}
