import { validateStudioGroupLayout } from './StudioLayerGroupEngine'
import { STUDIO_BLEND_MODES } from './StudioLayerBlendEngine'
import { normalizeStudioTextData } from './StudioTextLayerData'
import { normalizeStudioLayerStyle } from './StudioLayerStyleEngine'

export const STUDIO_PROJECT_EXTENSION = '.shadowstudio'

const MAX_FILE_BYTES = 80 * 1024 * 1024
const MAX_DOCUMENTS = 8
const MAX_LAYERS = 8
const MAX_CANVAS_PIXELS = 12_000_000
const MAX_CANVAS_SIDE = 4096
const IMAGE_PREFIX = /^data:image\/(?:png|webp|jpeg);base64,/i
const HEX_COLOR = /^#[0-9a-f]{6}$/i
const BLEND_MODES = new Set(STUDIO_BLEND_MODES)

function error(message) {
  throw new Error(message)
}

function validNumber(value, min, max) {
  return Number.isInteger(value) && value >= min && value <= max
}

function normalizedLayers(raw, paperIndex) {
  if (!Array.isArray(raw.layers) || raw.layers.length < 1 || raw.layers.length > MAX_LAYERS) {
    error(`Paper ${paperIndex + 1} has an invalid layer count.`)
  }

  const ids = new Set()
  const layers = raw.layers.map((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      error(`Paper ${paperIndex + 1}, layer ${index + 1} is invalid.`)
    }
    const id = typeof item.id === 'string' ? item.id : ''
    const name = typeof item.name === 'string' ? item.name.trim() : ''
    const image = item.image
    const opacity = Number(item.opacity)
    if (!id || id.length > 100 || ids.has(id) || !name || name.length > 80 ||
      typeof image !== 'string' || !IMAGE_PREFIX.test(image) || image.length > MAX_FILE_BYTES ||
      !Number.isFinite(opacity) || opacity < 0 || opacity > 100 ||
      typeof item.visible !== 'boolean' || typeof item.locked !== 'boolean') {
      error(`Paper ${paperIndex + 1}, layer ${index + 1} has invalid data.`)
    }
    const blendMode = item.blendMode ?? 'normal'
    const isBackground = index === 0 && item.isBackground !== false
    const groupId = item.groupId
    if ((item.isBackground !== undefined && typeof item.isBackground !== 'boolean') || (index > 0 && item.isBackground) ||
      !BLEND_MODES.has(blendMode) || (isBackground && blendMode !== 'normal') ||
      (groupId !== undefined && (typeof groupId !== 'string' || !groupId || groupId.length > 100 || isBackground))) {
      error(`Paper ${paperIndex + 1}, layer ${index + 1} has invalid group or blend metadata.`)
    }
    ids.add(id)
    return { id, name, image, visible: item.visible, locked: item.locked, opacity,
      isBackground,
      ...(item.textData !== undefined ? { textData: normalizeStudioTextData(item.textData, raw.width, raw.height) } : {}),
      ...(item.layerStyle !== undefined ? { layerStyle: normalizeStudioLayerStyle(item.layerStyle) } : {}),
      ...(groupId ? { groupId } : {}), ...(item.blendMode ? { blendMode } : {}),
    }
  })

  const activeLayerId = ids.has(raw.activeLayerId) ? raw.activeLayerId : layers[layers.length - 1].id
  if (raw.groups === undefined && !layers.some((layer) => layer.groupId)) return { layers, activeLayerId }
  if (!Array.isArray(raw.groups) || raw.groups.length > 8) error(`Paper ${paperIndex + 1} has invalid groups.`)
  const groups = raw.groups.map((group) => {
    if (!group || typeof group.id !== 'string' || !group.id || group.id.length > 100 ||
      typeof group.name !== 'string' || !group.name.trim() || group.name.length > 80 ||
      typeof group.visible !== 'boolean' || typeof group.locked !== 'boolean' || typeof group.collapsed !== 'boolean' ||
      !Number.isFinite(group.opacity) || group.opacity < 0 || group.opacity > 100 ||
      !BLEND_MODES.has(group.blendMode ?? 'normal')) error(`Paper ${paperIndex + 1} has invalid group metadata.`)
    return { id: group.id, name: group.name, visible: group.visible, locked: group.locked, collapsed: group.collapsed, opacity: group.opacity, blendMode: group.blendMode ?? 'normal' }
  })
  try { validateStudioGroupLayout({ layers, groups }) }
  catch { error(`Paper ${paperIndex + 1} has an invalid group layout.`) }
  return { layers, activeLayerId, groups }
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

  const document = {
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

  if (raw.layers !== undefined) {
    Object.assign(document, normalizedLayers(raw, index))
  } else if (raw.groups !== undefined) {
    error(`Paper ${index + 1} cannot contain groups without layers.`)
  }

  return document
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

export function downloadStudioProject(project, requestedName = '') {
  const safeName = String(requestedName || project.documents[0]?.name || 'Shadow-Project')
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

function validateImage(source, width, height, label) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      if (image.naturalWidth !== width || image.naturalHeight !== height) {
        reject(new Error(`${label} image size does not match its canvas.`))
      } else {
        resolve()
      }
      image.src = ''
    }
    image.onerror = () => reject(new Error(`${label} image could not be opened.`))
    image.src = source
  })
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
    if (paper.image) {
      await validateImage(paper.image, paper.width, paper.height, `Paper ${index + 1}`)
    }
    for (let layerIndex = 0; layerIndex < (paper.layers?.length || 0); layerIndex += 1) {
      await validateImage(paper.layers[layerIndex].image, paper.width, paper.height, `Paper ${index + 1}, layer ${layerIndex + 1}`)
    }
  }

  return project
}
