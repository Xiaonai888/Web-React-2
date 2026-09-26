import { validateStudioGroupLayout } from './StudioLayerGroupEngine'
import { STUDIO_BLEND_MODES } from './StudioLayerBlendEngine'
import { normalizeStudioTextData } from './StudioTextLayerData'
import { normalizeStudioLayerStyle } from './StudioLayerStyleEngine'
import { normalizeStudioAdjustment } from './StudioAdjustmentLayerEngine'

const DATABASE_NAME = 'shadow-studio-local-recovery'
const STORE_NAME = 'workspaces'
const RECOVERY_KEY = 'current'
const MAX_RECOVERY_BYTES = 55 * 1024 * 1024
const MAX_RECOVERY_LAYERS = 8
const BLEND_MODES = new Set(STUDIO_BLEND_MODES)

let databasePromise = null
let operations = Promise.resolve()

function database() {
  if (!globalThis.indexedDB) {
    return Promise.reject(new Error('Local autosave is not supported in this browser.'))
  }

  if (!databasePromise) {
    databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, 1)

      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        }
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error || new Error('Cannot open local storage.'))
      request.onblocked = () => reject(new Error('Close other Studio tabs and try again.'))
    }).catch((error) => {
      databasePromise = null
      throw error
    })
  }

  return databasePromise
}

async function transaction(mode, operation) {
  const db = await database()

  return new Promise((resolve, reject) => {
    let result
    const tx = db.transaction(STORE_NAME, mode)
    const store = tx.objectStore(STORE_NAME)
    const request = operation(store)

    request.onsuccess = () => {
      result = request.result
    }
    tx.oncomplete = () => resolve(result)
    tx.onerror = () => reject(tx.error || new Error('Local storage failed.'))
    tx.onabort = () => reject(tx.error || new Error('Local storage was interrupted.'))
  })
}

function queue(operation) {
  const next = operations.catch(() => {}).then(operation)
  operations = next
  return next
}

function canvasBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Could not capture the current paper.'))
    }, 'image/png')
  })
}

function toDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error || new Error('Cannot read local recovery.'))
    reader.readAsDataURL(blob)
  })
}

function estimatedBytes(image) {
  if (image instanceof Blob) return image.size
  return typeof image === 'string' ? Math.ceil(image.length * 0.75) : 0
}

function captureLayers(paper) {
  if (paper.layers === undefined) return {}
  if (!Array.isArray(paper.layers) || paper.layers.length < 1 || paper.layers.length > MAX_RECOVERY_LAYERS) {
    throw new Error('The paper has an invalid layer stack. Save a project copy before continuing.')
  }

  const layers = paper.layers.map((layer, index) => {
    if (layer && ((layer.isBackground !== undefined && typeof layer.isBackground !== 'boolean') || (index > 0 && layer.isBackground))) throw new Error('Invalid Background layer metadata.')
    if (!layer || (typeof layer.image !== 'string' && !(layer.image instanceof Blob))) {
      throw new Error('The paper has an invalid layer image. Save a project copy before continuing.')
    }
    return {
      id: layer.id,
      name: layer.name,
      image: layer.image,
      visible: layer.visible,
      locked: layer.locked,
      opacity: layer.opacity,
       ...(index === 0 ? { isBackground: layer.isBackground !== false } : {}),
      ...(layer.textData !== undefined ? { textData: normalizeStudioTextData(layer.textData, paper.width, paper.height) } : {}),
      ...(layer.layerStyle !== undefined ? { layerStyle: normalizeStudioLayerStyle(layer.layerStyle) } : {}),
      ...(layer.adjustment !== undefined ? { adjustment: normalizeStudioAdjustment(layer.adjustment) } : {}),
      ...(layer.groupId ? { groupId: layer.groupId } : {}),
      ...(layer.blendMode ? { blendMode: layer.blendMode } : {}),
    }
  })

  if (paper.groups === undefined && !layers.some((layer) => layer.groupId)) {
    if (layers.some((layer) => layer.blendMode !== undefined && !BLEND_MODES.has(layer.blendMode))) throw new Error('Invalid layer blend mode.')
    return { layers, activeLayerId: paper.activeLayerId }
  }
  if (!Array.isArray(paper.groups) || paper.groups.length > 8) throw new Error('Invalid local recovery layer groups.')
  const groups = paper.groups.map((group) => {
    if (!group || typeof group.id !== 'string' || !group.id || group.id.length > 100 ||
      typeof group.name !== 'string' || !group.name.trim() || group.name.length > 80 ||
      typeof group.visible !== 'boolean' || typeof group.locked !== 'boolean' || typeof group.collapsed !== 'boolean' ||
      !Number.isFinite(group.opacity) || group.opacity < 0 || group.opacity > 100 ||
      !BLEND_MODES.has(group.blendMode ?? 'normal')) throw new Error('Invalid local recovery group metadata.')
    return { id: group.id, name: group.name, visible: group.visible, locked: group.locked, collapsed: group.collapsed, opacity: group.opacity, blendMode: group.blendMode ?? 'normal' }
  })
  if (layers.some((layer) => layer.blendMode !== undefined && !BLEND_MODES.has(layer.blendMode))) throw new Error('Invalid layer blend mode.')
  validateStudioGroupLayout({ layers, groups })
  return { layers, activeLayerId: paper.activeLayerId, groups }
}

export async function readStudioRecovery() {
  await operations.catch(() => {})
  const record = await transaction('readonly', (store) => store.get(RECOVERY_KEY))

  if (!record) return null
  if (
    record.version !== 1 ||
    !Array.isArray(record.documents) ||
    record.documents.length < 1 ||
    record.documents.length > 8
  ) {
    throw new Error('The local recovery copy is unsupported. Restore your .shadowstudio file instead.')
  }

  return record
}

export function saveStudioRecovery(documents, activeDocumentId, canvas) {
  if (!Array.isArray(documents) || documents.length < 1 || documents.length > 8) {
    return Promise.reject(new Error('A workspace must have 1–8 papers.'))
  }

  let capturedDocuments
  try {
    capturedDocuments = documents.map((paper) => ({ ...paper, ...captureLayers(paper) }))
  } catch (error) {
    return Promise.reject(error)
  }
  const capturedId = activeDocumentId
  const activeBitmapPromise = canvas ? canvasBlob(canvas) : Promise.resolve(null)

  return queue(async () => {
    const activeBitmap = await activeBitmapPromise
    const papers = capturedDocuments.map((paper) => ({
      id: paper.id,
      name: paper.name,
      width: paper.width,
      height: paper.height,
      resolution: paper.resolution,
      background: paper.background,
      presetId: paper.presetId,
      dirty: Boolean(paper.dirty),
      image: activeBitmap && paper.id === capturedId
        ? activeBitmap
        : paper.image || '',
      ...captureLayers(paper),
    }))

    const totalBytes = papers.reduce((sum, paper) =>
      sum + estimatedBytes(paper.image) + (paper.layers || []).reduce((size, layer) => size + estimatedBytes(layer.image), 0), 0)
    if (totalBytes > MAX_RECOVERY_BYTES) {
      throw new Error('Local recovery is over 55 MB. Save Project to your device.')
    }

    const record = {
      id: RECOVERY_KEY,
      version: 1,
      savedAt: new Date().toISOString(),
      activeDocumentId: capturedId,
      documents: papers,
    }

    await transaction('readwrite', (store) => store.put(record))
    return record.savedAt
  })
}

export function clearStudioRecovery() {
  return queue(() => transaction('readwrite', (store) => store.delete(RECOVERY_KEY)))
}

export async function restoreStudioRecovery(record) {
  if (!record || !Array.isArray(record.documents) || record.documents.length < 1) {
    throw new Error('No local recovery copy found.')
  }

  const documents = []

  for (const paper of record.documents) {
    const storedLayers = captureLayers(paper)
    const layers = storedLayers.layers
      ? await Promise.all(storedLayers.layers.map(async (layer) => ({
          ...layer,
          image: layer.image instanceof Blob ? await toDataUrl(layer.image) : layer.image,
        })))
      : undefined

    documents.push({
      ...paper,
      image: paper.image instanceof Blob
        ? await toDataUrl(paper.image)
        : paper.image || '',
      ...(layers ? { layers, activeLayerId: storedLayers.activeLayerId, ...(storedLayers.groups ? { groups: storedLayers.groups } : {}) } : {}),
      dirty: true,
    })
  }

  return { documents, activeDocumentId: record.activeDocumentId }
}
