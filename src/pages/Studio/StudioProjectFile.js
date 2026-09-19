export const STUDIO_PROJECT_EXTENSION = '.shadowstudio'

const MAX_FILE_BYTES = 80 * 1024 * 1024
const MAX_DOCUMENTS = 8
const MAX_CANVAS_PIXELS = 12_000_000
const MAX_CANVAS_SIDE = 4096
const IMAGE_PREFIX = /^data:image\/(?:png|webp|jpeg);base64,/i
const HEX_COLOR = /^#[0-9a-f]{6}$/i

function error(message) {
  throw new Error(message)
}

function validNumber(value, min, max) {
  return Number.isInteger(value) && value >= min && value <= max
}

function normalizedDocument(raw, index) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    error(`Paper ${index + 1} is invalid.`)
  }

  const width = Number(raw.width)
  const height = Number(raw.height)
  const resolution = Number(raw.resolution)
  const background = String(raw.background || '')
  const image = raw.image == null ? '' : raw.image

  if (
    !validNumber(width, 64, MAX_CANVAS_SIDE) ||
    !validNumber(height, 64, MAX_CANVAS_SIDE) ||
    width * height > MAX_CANVAS_PIXELS
  ) {
    error(`Paper ${index + 1} exceeds the supported canvas size.`)
  }

  if (!validNumber(resolution, 72, 600)) {
    error(`Paper ${index + 1} has an invalid resolution.`)
  }

  if (!HEX_COLOR.test(background)) {
    error(`Paper ${index + 1} has an invalid background color.`)
  }

  if (
    typeof image !== 'string' ||
    (image && (!IMAGE_PREFIX.test(image) || image.length > MAX_FILE_BYTES))
  ) {
    error(`Paper ${index + 1} has an unsupported image.`)
  }

  const name = String(raw.name || '').trim()

  if (!name || name.length > 80) {
    error(`Paper ${index + 1} has an invalid name.`)
  }

  return {
    id: String(raw.id || `imported-${index}`).slice(0, 100),
    name,
    width,
    height,
    resolution,
    background,
    presetId: String(raw.presetId || 'custom').slice(0, 40),
    image,
    dirty: false,
  }
}

function normalizeProject(raw) {
  if (
    !raw ||
    typeof raw !== 'object' ||
    raw.app !== 'shadow-studio' ||
    raw.version !== 1 ||
    !Array.isArray(raw.documents) ||
    raw.documents.length < 1 ||
    raw.documents.length > MAX_DOCUMENTS
  ) {
    error('This is not a supported Shadow Studio project file.')
  }

  const documents = raw.documents.map(normalizedDocument)
  const ids = new Set(documents.map((document) => document.id))

  if (ids.size !== documents.length) {
    error('This project contains duplicate paper IDs.')
  }

  const activeDocumentId = ids.has(raw.activeDocumentId)
    ? raw.activeDocumentId
    : documents[0].id

  return { documents, activeDocumentId }
}

export function buildStudioProject(documents, activeDocumentId) {
  const project = normalizeProject({
    app: 'shadow-studio',
    version: 1,
    documents,
    activeDocumentId,
  })

  return {
    app: 'shadow-studio',
    version: 1,
    savedAt: new Date().toISOString(),
    activeDocumentId: project.activeDocumentId,
    documents: project.documents,
  }
}

export function downloadStudioProject(project) {
  const safeName = String(project.documents[0]?.name || 'Shadow-Project')
    .replace(/[\\/:*?"<>|\x00-\x1f]/g, '-')
    .slice(0, 60) || 'Shadow-Project'
  const content = JSON.stringify(project)
  const blob = new Blob([content], { type: 'application/json' })

  if (blob.size > MAX_FILE_BYTES) {
    error('Project is larger than 80 MB. Close extra papers or reduce image sizes before saving.')
  }

  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${safeName}${STUDIO_PROJECT_EXTENSION}`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 30_000)
}

export async function readStudioProject(file) {
  if (!file || file.size > MAX_FILE_BYTES) {
    error('Choose a Shadow Studio project file smaller than 80 MB.')
  }

  if (!String(file.name || '').toLowerCase().endsWith(STUDIO_PROJECT_EXTENSION)) {
    error('Select a .shadowstudio project file.')
  }

  let parsed

  try {
    parsed = JSON.parse(await file.text())
  } catch {
    error('Could not read this project file.')
  }

  const project = normalizeProject(parsed)

  for (let index = 0; index < project.documents.length; index += 1) {
    const paper = project.documents[index]
    if (!paper.image) continue

    await new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => {
        if (image.naturalWidth !== paper.width || image.naturalHeight !== paper.height) {
          reject(new Error(`Paper ${index + 1} image size does not match its canvas.`))
        } else {
          resolve()
        }
        image.src = ''
      }
      image.onerror = () => reject(new Error(`Paper ${index + 1} image could not be opened.`))
      image.src = paper.image
    })
  }

  return project
}
