import { buildShadowDocsPrintHTML } from './ShadowDocsPDFExport'
import { normalizeShadowDocsBook } from './ShadowDocsBookModel'

const fileName = value => String(value || 'Shadow Docs').replace(/[\\/:*?"<>|\u0000-\u001f]/g, '-').slice(0, 80)

function download(name, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

export function downloadShadowDocsProject(book) {
  const clean = normalizeShadowDocsBook(book)
  download(`${fileName(clean.title)}.shadowdocs`, JSON.stringify({ format: 'shadow-docs', version: 1, book: clean }), 'application/json')
}

export async function readShadowDocsProject(file) {
  if (!file || !file.name.toLowerCase().endsWith('.shadowdocs') || file.size > 15_000_000) throw new Error('Choose a .shadowdocs backup smaller than 15 MB.')
  let payload
  try { payload = JSON.parse(await file.text()) } catch { throw new Error('This file is not a valid Shadow Docs backup.') }
  if (payload?.format !== 'shadow-docs' || payload?.version !== 1) throw new Error('Unsupported Shadow Docs backup version.')
  return normalizeShadowDocsBook(payload.book, { duplicate: true })
}

export function printShadowDocsProject(book) {
  const html = buildShadowDocsPrintHTML(book)
  const popup = window.open('', '_blank')
  if (!popup) throw new Error('Allow pop-ups for this site, or download printable HTML from PDF Studio.')
  popup.document.open()
  popup.document.write(html)
  popup.document.close()
  popup.focus()
  const ready = popup.document.fonts?.ready || Promise.resolve()
  Promise.resolve(ready).then(() => { if (!popup.closed) { popup.focus(); popup.print() } }).catch(() => {})
}

export async function imageToShadowDocsCover(file) {
  if (!file || !['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 6_000_000) throw new Error('Choose a JPG, PNG or WebP image smaller than 6 MB.')
  let bitmap
  let objectURL
  try {
    if (typeof createImageBitmap === 'function') bitmap = await createImageBitmap(file)
    else {
      objectURL = URL.createObjectURL(file)
      bitmap = await new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = () => resolve(image)
        image.onerror = () => reject(new Error('Cannot read the cover image.'))
        image.src = objectURL
      })
    }
    const width = bitmap.width
    const height = bitmap.height
    if (!width || !height) throw new Error('Invalid cover dimensions.')
    const scale = Math.min(1, 900 / width, 1200 / height)
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(width * scale))
    canvas.height = Math.max(1, Math.round(height * scale))
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const data = canvas.toDataURL('image/jpeg', 0.76)
    if (data.length >= 2_500_000) throw new Error('The cover is too large after resizing.')
    return data
  } finally {
    bitmap?.close?.()
    if (objectURL) URL.revokeObjectURL(objectURL)
  }
}
